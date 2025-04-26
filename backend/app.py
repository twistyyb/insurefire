import sys
import os
from ultralytics import YOLO
import cv2

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

model = YOLO('yolo11n.pt')

# Optionally, save output
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
out = cv2.VideoWriter('output_detection.mp4', fourcc, 30.0, (int(cap.get(3)), int(cap.get(4))))

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    results = model.predict(frame, imgsz=640, conf=0.5)
    annotated_frame = results[0].plot()
    cv2.imshow('YOLOv Detection', annotated_frame)
    out.write(annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
out.release()
cv2.destroyAllWindows()