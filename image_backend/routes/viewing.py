from flask import Blueprint, jsonify, request, current_app
from minio import Minio
from utilities import minio_utilities
import os
from flask import Blueprint, request, jsonify
from flask_mail import Message
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
import shutil, zipfile
from zipfile import ZipFile
import pyunpack, io, base64
from PIL import Image


UPLOAD_FOLDER = "uploads"

view_routes = Blueprint('view', __name__)

@view_routes.route('/image', methods=['GET'])
@jwt_required()
def view_image():
    pass

@view_routes.route('/project', methods=['GET'])
@jwt_required()
def view_project():
    
    # bucket_name = get_jwt_identity()
    bucket_name = 'test-bucket'
    project_name = request.args.get('project_name')
    if not minio_utilities.minio_client.bucket_exists(bucket_name):
        return jsonify({'error': 'User does not exist'}), 400
    
    objects = minio_utilities.minio_client.list_objects(bucket_name, prefix=f"{bucket_name}/{project_name}")
    if not objects:
        return jsonify({'error': 'Project does not exist'}), 400
    else:
        print("project exists")
    
    files_list = minio_utilities.list_files(bucket_name, project_name)[1]
    print(files_list)
    # retrieve all files data in the project, and send them to the frontend, so it can 
    # display them to the user
    files_metadata = []
    for file in files_list:
        # object_exists = minio_utilities.minio_client.object_exists(bucket_name, f"{project_name}/{file_name}")
        # if not object_exists:
        #     return jsonify({'error': 'File does not exist'}), 400

        if file != project_name + '/' and 'zip' not in file and file != project_name:
            print(file)
            file_metadata = {
                "name": file,
                "size": minio_utilities.minio_client.stat_object(bucket_name, f"{file}").size,
                # Add more metadata here as needed
            }

            # Check if the file is an image (you might need more thorough validation)
            if file.endswith('.jpg') or file.endswith('.jpeg') or file.endswith('.png'):
                # Generate and attach a thumbnail
                thumbnail_size = (100, 100)  # Adjust the thumbnail size as needed
                file_data = minio_utilities.minio_client.get_object(bucket_name, f"{file}")
                image = Image.open(io.BytesIO(file_data.data))
                image.thumbnail(thumbnail_size)

                # Convert the thumbnail to bytes and base64 for transfer
                buffered = io.BytesIO()
                image.save(buffered, format="JPEG")
                thumbnail_bytes = buffered.getvalue()
                thumbnail_base64 = base64.b64encode(thumbnail_bytes).decode('utf-8')

                file_metadata["thumbnail"] = thumbnail_base64  # Send the thumbnail as base64 string

            files_metadata.append(file_metadata)

    return jsonify(files_metadata), 200




