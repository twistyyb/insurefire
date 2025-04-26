import sys
import os
from ultralytics import YOLO
import cv2
import numpy as np
from collections import defaultdict

# Accept video path as argument or fallback to default
video_path = sys.argv[1] 

# Expand user (~) and get absolute path
video_path = os.path.abspath(os.path.expanduser(video_path))

if not os.path.isfile(video_path):
    print(f"Error: File '{video_path}' does not exist.")
    sys.exit(1)

cap = cv2.VideoCapture(video_path)
if not cap.isOpened():
    print(f"Error: Could not open video file '{video_path}'.")
    print("Tips:")
    print(" - Try converting your video to .mp4 (H.264) format.")
    print(" - Check permissions and file integrity.")
    print(" - Try a different video file.")
    sys.exit(1)

# Load YOLO model
model = YOLO('yolo11n.pt')

# Get video properties
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = cap.get(cv2.CAP_PROP_FPS)

# Optionally, save output
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter('output_tracking.mp4', fourcc, fps, (width, height))

# Dictionary to store unique object counts
object_counts = defaultdict(int)
tracked_objects = {}

# Process the video
frame_count = 0
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    
    frame_count += 1
    
    # Run YOLOv8 tracking on the frame
    # The track method maintains object IDs across frames
    results = model.track(frame, persist=True, conf=0.5, iou=0.5, imgsz=640)
    
    # Get the boxes and track IDs
    if results[0].boxes is not None and hasattr(results[0].boxes, 'id') and results[0].boxes.id is not None:
        boxes = results[0].boxes.xyxy.cpu().numpy().astype(int)
        track_ids = results[0].boxes.id.cpu().numpy().astype(int)
        cls_ids = results[0].boxes.cls.cpu().numpy().astype(int)
        confs = results[0].boxes.conf.cpu().numpy()
        
        # Get class names
        class_names = results[0].names
        
        # Update tracked objects and count
        current_objects = set()
        
        for i, (box, track_id, cls_id, conf) in enumerate(zip(boxes, track_ids, cls_ids, confs)):
            class_name = class_names[cls_id]
            
            # If this is a new tracked object, increment the count
            if track_id not in tracked_objects:
                tracked_objects[track_id] = class_name
                object_counts[class_name] += 1
            
            current_objects.add(track_id)
            
            # Draw bounding box and label on frame
            x1, y1, x2, y2 = box
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            
            # Display class name, track ID and confidence
            label = f"{class_name} #{track_id} {conf:.2f}"
            cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
    
    # Display object counts on the frame
    y_pos = 30
    cv2.putText(frame, f"Frame: {frame_count}", (10, y_pos), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
    y_pos += 30
    
    cv2.putText(frame, "Unique Object Counts:", (10, y_pos), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
    y_pos += 30
    
    for cls, count in sorted(object_counts.items()):
        cv2.putText(frame, f"{cls}: {count}", (10, y_pos), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
        y_pos += 30
    
    # Show and save the frame
    cv2.imshow('YOLOv8 Tracking', frame)
    out.write(frame)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Print final counts
print("\nFinal Object Counts:")
for cls, count in sorted(object_counts.items()):
    print(f"{cls}: {count}")

cap.release()
out.release()
cv2.destroyAllWindows()