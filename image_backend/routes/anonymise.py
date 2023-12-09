from flask import Blueprint, jsonify, request, current_app
from minio import Minio
import os
from flask import Blueprint, request, jsonify
from flask_mail import Message
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
import shutil, zipfile
from zipfile import ZipFile
import pyunpack
from PIL import Image
import cv2
import sys
sys.path.append(os.path.abspath('../'))
from utilities.number_plates_module import numplate_boxes
from utilities.mask_image import mask_region
from utilities.blur_image import blur_region
from utilities.replace_face import replace_region,replace_custom
from utilities.face_recog import face_boxes
import requests
import numpy as np
import base64

UPLOAD_FOLDER = "uploads"

image_routes = Blueprint('process', __name__)


def download_image(url, local_filename):
    response = requests.get(url)
    with open(local_filename, 'wb') as f:
        f.write(response.content)
    
    # return absolute path of the downloaded image
    return os.path.abspath(local_filename)

def convert_to_jpeg(file_path):
    # open the image
    print(file_path)
    image = Image.open(file_path)
    # convert to jpeg
    image = image.convert('RGB')
    # save the image
    print("1",file_path)
    image.save(file_path, 'jpeg')
    print("2",file_path)

    # return the absolute path of the image
    return file_path



@image_routes.route('/image', methods=['POST'])
def process_image():
    data = request.json
    # print(data)
    # Extract image details
    image_name = data.get("image")
    image_format = data.get("format")
    image_link = data.get("link")

    # print(image_name, image_format, image_link)

    # Extract parameters
    object_param = data["object"]
    technique_param = data["technique"]
    
    # print(object_param, technique_param)

    # convert both to lowercase
    # object_param = object_param.lower()
    # technique_param = technique_param.lower()

    # Download the image locally
    local_file = f"{image_name}.{image_format}"
    # print(local_file)
    file_path = download_image(image_link, local_file)

    # convert the file to jpeg
    file_path = convert_to_jpeg(file_path)

    # convert file_path to absolute path
    file_path = os.path.abspath(file_path)



    image = None
    # Perform appropriate functions based on parameters
    if(object_param == 'face'):
        boxes, probs, points = face_boxes(file_path)
        if(technique_param == 'blur'):
            image = blur_region(file_path, boxes)
        elif(technique_param == 'mask'):
            image = mask_region(file_path, boxes)
        elif(technique_param == 'replacement'):
            image = replace_region(file_path, os.path.abspath('../utilities/pm.jpg'), boxes)
        else:
            pass

    elif(object_param == 'name_plate'):
        boxes, scores = numplate_boxes(file_path)
        print(boxes)
        print(boxes[0])
        if(technique_param == 'blur'):
            image = blur_region(file_path, boxes[0])
        elif(technique_param == 'mask'):
            image = mask_region(file_path, boxes[0])
        elif(technique_param == 'replacement'):
            image = replace_region(file_path, os.path.abspath('../utilities/np.jpeg'), boxes[0])
        else:
            pass

    elif(object_param == 'both'):
        if(technique_param == 'blur'):
            pass
        elif(technique_param == 'mask'):
            pass
        elif(technique_param == 'replacement'):
            pass
        else:
            pass
    # convert image to base64
    # image = Image.fromarray(image)
    # convert numpy array to bit stream
    if(image is None or image is np.array(None)):
        return jsonify({'error': 'Invalid parameters'})
    

    
    image = Image.fromarray(image)
    image = image.convert('RGB')
    image.save(file_path, 'jpeg')

    def convert_image_to_base64(image_path):
        with open(image_path, "rb") as image_file:
            encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
        return encoded_image

    
    base64_image = convert_image_to_base64(file_path)
    # print(base64_image)

    with open("a.txt", "w") as f:
        f.write(base64_image)
    
    
    return jsonify({'image64': base64_image})


# print(numplate_boxes("/home/akash/Downloads/idd_temporal_val_1/00066/894867_leftImg8bit/0002267.jpeg"))



'''
curl --location 'http://localhost:4000/process/image' \
--header 'Content-Type: application/json' \
--data '{"image":"akash",
"format":"png",
"link": "http://10.8.0.31:9000/datadrive-dev/hv/shaantanu2018gmailcom/thumbnail/0006758.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=MzsWV9nrzt0a4jDjdORY%2F20231202%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20231202T150303Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=dd59e844948486e3a68ca0f2d6d327d404ef2751f49b7ce4bbfd031598454498",
"object":"name_plate",
"technique":"mask"}
'

'''