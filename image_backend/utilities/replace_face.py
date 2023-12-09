# from face_recog import face_boxes 
from PIL import Image
import cv2
import numpy as np

# Function to replace a region specified by coordinates (x1, y1, x2, y2)
def replace_region(image_path, replace_path, boxes):
    image = cv2.imread(image_path)
    img = Image.open(image_path)
    img_array = np.array(img)
    replacement_img = Image.open(replace_path)

    

    # Create a mask with the same shape as the image
    if boxes is None:
        return np.array(image)
    
    # print(img_array.shape)
    # print(img.size)
    # print(image.shape)
    # if(box)
    for box in boxes:
        x1, y1, x2, y2 = box
        x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
        replacement_resized = replacement_img.resize((x2 - x1, y2 - y1))

        # Convert the resized replacement image to RGB
        replacement_resized_rgb = replacement_resized.convert("RGB")

        # Convert the resized replacement image to a NumPy array
        replacement_array = np.array(replacement_resized_rgb)

        # Create a mask for non-black pixels in the resized replacement image
        mask = np.all(replacement_array != [0, 0, 0], axis=-1)

        # Replace the background pixels with the corresponding pixels from the original image
        img_array[y1:y2, x1:x2][mask] = replacement_array[mask]

    # Save the result
    modified_img = Image.fromarray(img_array)
    # convert img to numpy array
    modified_img = np.array(modified_img)
    return modified_img


# Function to replace a region specified by coordinates (x1, y1, x2, y2)
def replace_custom(image_path, replace_path, boxes):
    img = Image.open(image_path)
    replacement_img = Image.open(replace_path)

    # Create a mask with the same shape as the image
    if(boxes is None):
        return np.array(img)

    for box in boxes[0]:
        x1, y1, x2, y2 = box
        x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
        replacement_resized = replacement_img.resize((x2 - x1, y2 - y1))

        # Paste the replacement image onto the original image at the specified coordinates
        img.paste(replacement_resized, (x1, y1, x2, y2))
    
    # convert img to numpy array
    img = np.array(img)
    
    return img  

# boxes, scores = numplate_boxes("./number_plate.jpg")
# replace_custom("./number_plate.jpg", "custom_nameplate.jpg", boxes)