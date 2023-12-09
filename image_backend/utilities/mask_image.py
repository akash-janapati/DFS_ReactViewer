import cv2
import numpy as np

# Function to mask a region specified by coordinates (x1, y1, x2, y2)
def mask_region(image_path, boxes):
    image = cv2.imread(image_path)

    # Create a mask with the same shape as the image
    if(boxes is None):
        return np.array(image)
    for box in boxes:
        print(box)
        # break
        mask = np.zeros_like(image)
        x1, y1, x2, y2 = box
        x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
        image[y1:y2, x1:x2] = 0
    
    # convert img to numpy array
    image = np.array(image)
        
    return image

