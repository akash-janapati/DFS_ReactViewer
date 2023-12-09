# # let image_body = {
# #       "name": image_name,
# #       "format": image_format,
# #       "link": image_link,
# #     };

# #     let image_params = {
# #       "object": object,
# #       "technique": technique,
# #     };

# from flask import Flask, request, jsonify
# import requests

# app = Flask(__name__)

# def download_image(url, local_filename):
#     response = requests.get(url)
#     with open(local_filename, 'wb') as f:
#         f.write(response.content)

# @app.route('/download-image', methods=['POST'])
# def download_image_endpoint():
#     data = request.json

#     # Extract image details
#     image_name = data.get("name")
#     image_format = data.get("format")
#     image_link = data.get("link")

#     # Extract parameters
#     object_param = data.get("object")
#     technique_param = data.get("technique")

#     # Download the image locally
#     local_file = f"{image_name}.{image_format}"
#     download_image(image_link, local_file)

#     # Perform appropriate functions based on parameters
#     # Add your logic here based on the values of "object_param" and "technique_param"
#     if object_param == "name_plate":
#       if technique_param == "blur":
#         blur_region(local_filename, boxes)
#       elif technique_param == "fixed_replacement":
#         replace_plate(local_filename, boxes)
#       # elif technique_param == "emoji_replace":
#         # replace_emoji(local_filename, boxes)
#     elif object_param == "face":
#       if technique_param == "blur":
#         mask_region(local_filename, boxes)
#       elif technique_param == "mask":
#         blur_region(local_filename, boxes)
#       elif technique_param == "fixed_replacement":
#         replace_face(local_filename, boxes)
#       elif technique_param == "emoji_replace":
#         replace_emoji(local_filename, boxes)

#     # Return a response
#     response_data = {
#         "status": "success",
#         "message": "Image downloaded and processing complete."
#     }
#     return jsonify(response_data)

# if __name__ == '__main__':
#     app.run(debug=True)

from number_plates_module import numplate_boxes

# print(numplate_boxes("/home/akash/Downloads/idd_temporal_val_1/00066/894867_leftImg8bit/0002267.jpeg"))
