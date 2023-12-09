# # to run minio server: sudo minio server /mnt/minio_data/ --console-address ":9001"

# from minio import Minio
# from minio.error import S3Error
# import os
# from dotenv import load_dotenv
# import io
# from PIL import Image
# load_dotenv()
# from datetime import datetime, timedelta
# import zipfile
# import shutil

# MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT")
# MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY")
# MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY")

# # convert each to string
# MINIO_ENDPOINT = str(MINIO_ENDPOINT)
# MINIO_ACCESS_KEY = str(MINIO_ACCESS_KEY)
# MINIO_SECRET_KEY = str(MINIO_SECRET_KEY)

# MINIO_ENDPOINT="localhost:9000"
# MINIO_ACCESS_KEY="codered"
# MINIO_SECRET_KEY="dfscodered"

# # Initialize MinIO client
# minio_client = Minio(
#     endpoint=MINIO_ENDPOINT,
#     access_key=MINIO_ACCESS_KEY,
#     secret_key=MINIO_SECRET_KEY,
#     secure=False  
# )

# def create_bucket(bucket_name):
#     try:
#         if not minio_client.bucket_exists(bucket_name):
#             minio_client.make_bucket(bucket_name)
#             return 1,f"Bucket '{bucket_name}' created successfully"
#         else:
#             return 0,f"Bucket '{bucket_name}' already exists"
#     except S3Error as e:
#         return -1,f"Error: {str(e)}"

# def create_folder(bucket_name, folder_name):
#     try:
#         # For MinIO, folders are simulated using object name prefixes
#         # So, there's no explicit "folder creation" operation
#         # Instead, you can upload an empty object with the folder name as the object name
#         object_name = folder_name + '/' if not folder_name.endswith('/') else folder_name
#         minio_client.put_object(bucket_name, object_name, io.BytesIO(b''), 0)
#         return 1,f"Folder '{folder_name}' created in '{bucket_name}'"
#     except S3Error as e:
#         return -1,f"Error creating folder: {str(e)}"

# def upload_files(bucket_name, folder_name, files):
#     try:
#         for file_path in files:
#             object_name = folder_name + '/' + file_path.split('/')[-1]  # Using filename as object name
#             minio_client.fput_object(bucket_name, object_name, file_path)
#         return 1,f"Files uploaded to '{folder_name}' in '{bucket_name}'"
#     except S3Error as e:
#         return -1,f"Error uploading files: {str(e)}"

# from io import BytesIO
# from PIL import Image

# def get_file(bucket_name, folder_name, file_name, compress=False, max_size=None):
#     try:
#         object_name = folder_name + '/' + file_name if folder_name else file_name
#         file_data = minio_client.get_object(bucket_name, object_name)
#         if compress:
#             # Open the image from the file data
#             image = Image.open(BytesIO(file_data.read()))

#             # Resize the image if necessary
#             if max_size:
#                 image.thumbnail((max_size, max_size))

#             # Save the compressed image to a buffer
#             buffer = BytesIO()
#             image.save(buffer, format="JPEG", quality=80)

#             # Return the compressed image data
#             return 1, buffer.getvalue()
#         else:
#             # Return the original file data
#             return 1, file_data.read()
#     except:
#         return -1, f"Error retrieving file: {str()}"
    
# def list_folders(bucket_name):
#     try:
#         objects = minio_client.list_objects(bucket_name, prefix='', recursive=True)
#         folder_set = set()
#         for obj in objects:
#             folder_set.add(obj.object_name.split('/')[0])
#         folder_list = list(folder_set)
#         return 1,folder_list
#     except :
#         return -1,f"Error listing folders: {str()}"

# def list_files(bucket_name, folder_name):
#     try:
#         objects = minio_client.list_objects(bucket_name, prefix=folder_name, recursive=True)
#         file_list = [obj.object_name for obj in objects if obj.object_name != folder_name + '/' or 'zip' in obj.object_name]
#         return 1,file_list
#     except :
#         return -1,f"Error listing files: {str()}"
    
# def generate_presigned_url_for_file(bucket_name, folder_name, file_name):
#     try:
#         object_name = folder_name + '/' + file_name if folder_name else file_name
        
        
#         presigned_url = minio_client.presigned_get_object(bucket_name, object_name)

#         return 1,presigned_url
#     except Exception as e:
#         return -1,f"Error generating pre-signed URL: {str(e)}"

# # def get_folder_as_zip(bucket_name, folder_name):
# #     try:
# #         # Create an in-memory zip file
# #         buffer = BytesIO()
# #         zip_file = zipfile.ZipFile(buffer, 'w', zipfile.ZIP_DEFLATED)

# #         # Add all files from the folder to the zip file
# #         objects = minio_client.list_objects(bucket_name, prefix=folder_name, recursive=True)
# #         for obj in objects:
# #             file_data = minio_client.get_object(bucket_name, obj.object_name)
# #             print(obj.object_name)
# #             zip_file.writestr(obj.object_name, file_data)

# #         # close the zip file and save it to the bucket as a new object, with name folder_name.zip
# #         zip_file.close()
# #         object_name = folder_name + '.zip'
# #         minio_client.put_object(bucket_name, object_name, buffer.getvalue(), len(buffer.getvalue()))

# #         # Generate a pre-signed URL for the zip file
# #         presigned_url = minio_client.presigned_get_object(bucket_name, object_name)

# #         return 1,presigned_url



#     # except Exception as e:
#     #     return -1,f"Error generating zip file: {str(e)}"

# # # Usage
# bucket_name = 'test-bucket'
# folder_name = '1'
# files_to_upload = ['/home/akash/Documents/4.1/DFS/OIP.jpeg']  # Paths to the files to be uploaded

# # a,b = create_bucket(bucket_name)
# # print(b)
# # a,b = create_folder(bucket_name, folder_name)
# # print(b)
# # a,b = upload_files(bucket_name, folder_name, files_to_upload)
# # print(b)
# # a,b = list_files(bucket_name, folder_name)
# # print(b)
# # a,b = generate_presigned_url_for_file(bucket_name, folder_name, 'Context_Diagram.jpeg')
# # print(b)

# from flask import jsonify, request

# def download_project(current_user, project_name):
#     # current_user = get_jwt_identity()
#     # project_name = request.args.get('project_name')

    

#     if not project_name:
#         return jsonify({'error': 'Project name not provided'}), 400
#     else:
#         print(f"project name exists,{project_name}")
#     if not minio_client.bucket_exists(current_user):
#         return jsonify({'error': 'Bucket does not exist'}), 400
#     else:
#         print("bucket exists")

#     objects = minio_client.list_objects(bucket_name, prefix=f"{current_user}/{project_name}")
#     if not objects:
#         return jsonify({'error': 'Project does not exist'}), 400
#     else:
#         print("project exists")

#     # Get the list of files in the project
#     files = list_files(current_user, project_name)

#     # Create an in-memory zip file
#     # buffer = BytesIO()
#     # zip_file = zipfile.ZipFile(buffer, 'w', zipfile.ZIP_DEFLATED)

#     # for each file, add it to the zip file
#     # files has the following format: ['project_name/file1', 'project_name/file2', ...]
#     # it also includes just project_name/ which is the folder itself
#     # so we need to remove that
#     print(type(files))
#     files = files[1]
    
#     # get all the files and store them in a folder in ./uploads, then compress that to a zip file
#     # and put this in the bucket and send  a presigned url for this zip file
    
#     if not os.path.exists('uploads'):
#         os.makedirs('uploads', exist_ok=True)
    
#     if not os.path.exists(f'uploads/{project_name}'):
#         os.makedirs(f'uploads/{project_name}', exist_ok=True)
    

#     for file in files:
#         if file != project_name + '/':
#             # get the file from the bucket and save it to ./uploads
#             file_data = minio_client.get_object(current_user, file)
#             file_name = str(file)
#             file_path = f"./uploads/{file_name}"
#             # print(file_data.read())
#             print(file_path, file_name)
#             with open(file_path, 'wb') as f:
#                 f.write(file_data.read())

#     shutil.make_archive(f"./uploads/{project_name}", 'zip', f"./uploads/{project_name}")
#     # upload the zip file to the bucket
#     object_name = project_name + '.zip'
#     minio_client.fput_object(current_user, object_name, f"./uploads/{project_name}.zip")
#     # Generate a pre-signed URL for the zip file
#     presigned_url = minio_client.presigned_get_object(current_user, object_name)

#     return 1,presigned_url

# # a,b = (download_project('test-bucket', '1'))
# # print(b)
    