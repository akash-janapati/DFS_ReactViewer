# import pytesseract
# from PIL import Image
# import cv2 
# import numpy as np

# def extract_text(image_path):

#     image = Image.open(image_path)

#     # Use pytesseract to extract data with image_to_data
#     data = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)
#     # print(data)
#     # Define the levels to extract
#     desired_levels = [2]

#     # print(data)

#     # draw bounding boxes on the text
#     for i, word in enumerate(data['text']):
#         if int(data['level'][i]) in desired_levels:# and word.strip() != '':
#             # print(word)
#             (x, y, w, h) = (data['left'][i], data['top'][i], data['width'][i], data['height'][i])
#             image = cv2.rectangle(np.array(image), (x, y), (x + w, y + h), (0, 0, 255), 2)
#             print(word)

#     # Display the image with bounding boxes
#     cv2.imshow("Image", image)
#     cv2.waitKey(0)
#     cv2.destroyAllWindows()


# extract_text("/home/akash/Documents/4.1/DFS/OIP.jpeg")
