from minio import Minio
from utilities import minio_utilities
import os
from flask import Blueprint, request, jsonify
from flask_mail import Message
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
import shutil, zipfile
from zipfile import ZipFile
import pyunpack
storage_routes = Blueprint('store', __name__)
UPLOAD_FOLDER = "uploads"

def extract_zip(file_path, extract_to):
    if not os.path.exists(extract_to):
        os.makedirs(extract_to)   

    file_path = repr(file_path)
    extract_to = repr(extract_to) 
    
    with ZipFile(file_path, 'r') as zip_ref:
        zip_ref.extractall(extract_to)
        zip_ref.close()


@storage_routes.route('/uploadProject', methods=['POST'])
@jwt_required()
def upload_project():
    if 'file' not in request.files:
        return 'No file part'
    
    current_user = get_jwt_identity()

    file = request.files['file']

    if file.filename == '':
        return 'No selected file'

    if file:

        project_name = file.filename.split('.')[0]

        # check if the project name already exists in the user's bucket
        if minio_utilities.minio_client.bucket_exists(current_user):
            folders_existing = minio_utilities.list_folders(current_user)
            if project_name in folders_existing:
                return jsonify({'error': 'Project name already exists'}), 400
        else:
            minio_utilities.minio_client.make_bucket(current_user)

        try:
            zipfile.ZipFile(file)
        except zipfile.BadZipFile:
            return jsonify({'error': 'File is not a valid zip file'}), 400
        
        if not os.path.exists(UPLOAD_FOLDER):
            print("folder doesn't exist!!")
            os.makedirs(UPLOAD_FOLDER)
        # shutil.unpack_archivefil
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

        print(file.filename)

        extraction_directory = os.path.join(UPLOAD_FOLDER, project_name)

        print(file_path)
        print(extraction_directory)

        if not os.path.exists(extraction_directory):
            os.makedirs(extraction_directory)

        if(os.path.getsize(file_path) == 0):
            return jsonify({'error': 'File is empty'}), 400
        else:
            print(os.path.getsize(file_path))

        # extract_zip(file_path, extraction_directory)
        pyunpack.Archive(file_path).extractall(extraction_directory)
        # try:
        #     # Extract the contents of the zip file
        #     extract_zip(file_path, extraction_directory)
        # except: # Exception as e:

        #     # return f'Error during extraction: {e}'

        # Delete the zip file after extraction
        os.remove(file_path)

        return 'Zip file uploaded, extracted, and zip file deleted.'


from io import BytesIO
@storage_routes.route('/downloadProject', methods=['GET'])
@jwt_required()
def download_project():
    current_user = get_jwt_identity()
    project_name = request.body['project_name']


    if not project_name:
        return jsonify({'error': 'Project name not provided'}), 400

    if not minio_utilities.minio_client.bucket_exists(current_user):
        return jsonify({'error': 'User does not exist'}), 400

    objects = minio_utilities.minio_client.list_objects(current_user, prefix=f"{current_user}/{project_name}")
    if not objects:
        return jsonify({'error': 'Project does not exist'}), 400
    
    # Get the list of files in the project
    files = minio_utilities.list_files(current_user, project_name)

    # Create an in-memory zip file
    files = minio_utilities.list_files(current_user, project_name)
    files = files[1]

    if not os.path.exists('uploads'):
        os.makedirs('uploads', exist_ok=True)
    
    if not os.path.exists(f'uploads/{project_name}'):
        os.makedirs(f'uploads/{project_name}', exist_ok=True)

    for file in files:
        if file != project_name + '/':
            # get the file from the bucket and save it to ./uploads
            file_data = minio_utilities.minio_client.get_object(current_user, file)
            file_name = str(file)
            file_path = f"./uploads/{file_name}"
            # print(file_data.read())
            print(file_path, file_name)
            with open(file_path, 'wb') as f:
                f.write(file_data.read())

    # Create a zip file of the files in the project
    shutil.make_archive(f'./uploads/{project_name}', 'zip', f'./uploads/{project_name}')

    # Upload the zip file to the bucket
    object_name = project_name + '.zip'
    minio_utilities.minio_client.fput_object(current_user, object_name, f'./uploads/{project_name}.zip')

    presigned_url = minio_utilities.minio_client.presigned_get_object(current_user, object_name)

    # Delete the zip file after uploading
    os.remove(f'./uploads/{project_name}.zip')
    # Delete the folder after uploading
    shutil.rmtree(f'./uploads/{project_name}')

    return jsonify({'project_name': project_name,'presigned_url': presigned_url}), 200
    


@storage_routes.route('/getProjects', methods=['POST'])
@jwt_required()
def get_projects():
    current_user = get_jwt_identity()
    if not minio_utilities.minio_client.bucket_exists(current_user):
        return jsonify({'error': 'User does not exist'}), 400

    folders = minio_utilities.list_folders(current_user)
    return jsonify({'folders': folders}), 200
    