
import cv2
import numpy as np



def blur_region(image_path, boxes, blur_amount=45):
    image = cv2.imread(image_path)

    # Get the region of interest (ROI)
    # extract each box and blur it
    if(boxes is None):
        return np.array(image)
    for box in boxes:
        x1, y1, x2, y2 = box
        x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
        roi = image[y1:y2, x1:x2]
        roi = cv2.GaussianBlur(roi, (blur_amount, blur_amount),0)
        image[y1:y2, x1:x2] = roi
    
    # convert img to numpy array
    image = np.array(image)

    return image