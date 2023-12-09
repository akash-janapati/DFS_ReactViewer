# import yolov5
# import yolov8
# import torch
# from PIL import Image

# # load model
# # import sys
# # sys.path.insert(0, './yolov5')

# import sys
# sys.path.append('/home/akash/anaconda3/envs/dfs/lib/python3.8/site-packages/yolov5')

# def numplate_boxes(image_path):
#     model = yolov5.load('keremberke/yolov5m-license-plate')

#     model.conf = 0.25  # NMS confidence threshold
#     model.iou = 0.45  # NMS IoU threshold
#     model.agnostic = False  # NMS class-agnostic
#     model.multi_label = False  # NMS multiple labels per box
#     model.max_det = 1000  # maximum number of detections per image

#     img = Image.open(image_path)
#     # perform inference
#     results = model(img, size=640)

#     # inference with test time augmentation
#     results = model(img, augment=True)

#     # parse resultshow 
#     predictions = results.pred[0]
#     boxes = predictions[:, :4] # x1, y1, x2, y2
#     scores = predictions[:, 4]
#     categories = predictions[:, 5]

#     boxes = []
#     scores = []

#     for result in results.pred:
#         boxes.append(result[:, :4])
#         scores.append(result[:, 4])
    
#     # draw boxes on image and display it
#     results.render()  # updates results.imgs with boxes and labels
#     results.show()  # display results


#     return boxes, scores                                                    

# # print(numplate_boxes("/home/akash/Downloads/idd_temporal_val_1/00066/894867_leftImg8bit/0002267.jpeg"))