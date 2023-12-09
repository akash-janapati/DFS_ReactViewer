from flask import Flask, request, jsonify, current_app
from PIL import Image
from flask_cors import CORS
# from authenticate import auth_routes
# from config import Config
from flask_mail import Mail, Message
from anonymise import image_routes
from minio_storage import storage_routes
from viewing import view_routes
from flask_jwt_extended import JWTManager
import requests
from utilities.mask_image import mask_region
from utilities.blur_image import blur_region
from utilities.replace_face import replace_region,replace_custom
from utilities.face_recog import face_boxes
from utilities.number_plates_module import numplate_boxes
import os
import base64
import numpy as np
import cv2

import sys
sys.path.append(os.path.abspath('../'))

app = Flask(__name__)

# import sys
# sys.path.append('/home/akash/Documents/4.1/DFS/Data-Anonymization-Images_Code-Red/src/backend')
# sys.path.append('/home/akash/anaconda3/envs/dfs/lib/python3.8/site-packages/yolov5')

# use CORS
# allow all origins
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}})

import sys
import base64
# sys.path.append('/home/akash/anaconda3/envs/dfs/lib/python3.8/site-packages/yolov5')

# app.config['MONGODB_SETTINGS'] = {
#     'db': 'dfs',
#     'host': 'mongodb+srv://akash2009janapati:Akash2009@cluster0.wihofuh.mongodb.net/?retryWrites=true&w=majority',
#     # Additional configuration parameters if needed
# }

# db = MongoEngine(app)

# app.config.from_object(Config)
# mail = Mail(app)

# with app.app_context():
#     current_app.mail = mail

# app.config["JWT_SECRET_KEY"] = "secretKey"
# jwt = JWTManager(app)



# bind routes
# app.register_blueprint(auth_routes, url_prefix='/auth')
app.register_blueprint(image_routes, url_prefix='/process')
app.register_blueprint(storage_routes, url_prefix='/manage')
app.register_blueprint(view_routes, url_prefix='/view')


    


@app.route('/api', methods=['GET'])
def api():
    return jsonify({'data': 'Hello World!'})

if __name__ == '__main__':
    app.run(debug=True,port=4000)



# from utilities.number_plates_module import numplate_boxes

# print(numplate_boxes("/home/akash/Downloads/idd_temporal_val_1/00066/894867_leftImg8bit/0002267.jpeg"))
