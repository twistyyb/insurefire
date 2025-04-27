import sys
import os
from ultralytics import YOLO
import cv2
from collections import defaultdict
import json
import shutil
from FurniturePriceEstimator import FurniturePriceEstimator
import tkinter as tk
import argparse

def process_video(video_path):
    print(f"process_video: {video_path}")

    # Configuration variables that can be imported from other files
    hide_display = True  # Set to True to hide bounding boxes, labels, and inventory display

    # Initialize FurniturePriceEstimator
    root = tk.Tk()
    root.withdraw()  # Hide the main window since we only need the estimation functionality
    price_estimator = FurniturePriceEstimator(root)

    # Parse command line arguments
    #parser = argparse.ArgumentParser(description='Object detection and tracking from video')
    #parser.add_argument('video_path', help='Path to the video file')
    #args = parser.parse_args()

    # Get video path from arguments
    #video_path = args.video_path

    # Expand user (~) and get absolute path
    #video_path = os.path.abspath(os.path.expanduser(video_path))

    # if not os.path.isfile(video_path):
    #     print(f"Error: File '{video_path}' does not exist.")
    #     sys.exit(1)

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error: Could not open video file '{video_path}'.")
        print("Tips:")
        print(" - Try converting your video to .mp4 (H.264) format.")
        print(" - Check permissions and file integrity.")
        print(" - Try a different video file.")
        sys.exit(1)

    # Load YOLO model
    model = YOLO('yolo11l.pt')

    # Get video properties
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    # Process every 2nd frame
    frame_skip = 2  # Process every 2nd frame
    new_fps = fps / frame_skip

    print(f"Original video: {width}x{height}, {fps} FPS, {total_frames} frames")
    print(f"Processing at: {new_fps:.1f} FPS (every {frame_skip} frames)")

    # Optionally, save output
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter('output_tracking_items.mp4', fourcc, fps, (width, height))

    # Dictionary to store unique object counts
    object_counts = defaultdict(int)
    tracked_objects = {}

    # Track history for filtering
    track_history = {}  # {track_id: {frames_seen: int, consecutive_misses: int, class_counts: {class: count}}}
    min_frames_to_count = 3  # Minimum number of frames an object must appear in to be counted
    max_consecutive_misses = 5  # Maximum number of consecutive frames an object can be missing before being forgotten
    confidence_threshold = 0.55  # Confidence threshold for detection
    iou_threshold = 0.45  # IoU threshold for tracking
    snapshot_confidence_threshold = 0.55  # Minimum confidence for taking a snapshot

    # Create directory for snapshots (delete if it exists)
    snapshot_dir = "item_snapshots"
    if os.path.exists(snapshot_dir):
        print(f"Removing existing snapshots directory: {snapshot_dir}")
        shutil.rmtree(snapshot_dir)
    os.makedirs(snapshot_dir, exist_ok=True)
    print(f"Created fresh snapshots directory: {snapshot_dir}")

    # Dictionary to store best snapshots for each object
    best_snapshots = {}  # {track_id: {"conf": conf, "saved": False, "class": class_name, "path": path}}

    # Classes to exclude (don't track these)
    excluded_classes = ['person']

    # Metadata for items (to be used with Gemini API)
    item_metadata = {}

    # Function to calculate IoU between two bounding boxes
    def calculate_iou(box1, box2):
        x1_1, y1_1, x2_1, y2_1 = box1
        x1_2, y1_2, x2_2, y2_2 = box2
        area1 = (x2_1 - x1_1) * (y2_1 - y1_1)
        area2 = (x2_2 - x1_2) * (y2_2 - y1_2)
        x1_i = max(x1_1, x1_2)
        y1_i = max(y1_1, y1_2)
        x2_i = min(x2_1, x2_2)
        y2_i = min(y2_1, y2_2)
        if x2_i <= x1_i or y2_i <= y1_i:
            return 0.0
        area_i = (x2_i - x1_i) * (y2_i - y1_i)
        return area_i / (area1 + area2 - area_i)

    # Process the video
    frame_count = 0
    processed_count = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        print(f"frame_count: {frame_count}")
        frame_count += 1
        
        # Skip frames to speed up processing
        if (frame_count - 1) % frame_skip != 0:
            continue
            
        processed_count += 1
        
        # Display progress
        if processed_count % 10 == 0:
            progress = (frame_count / total_frames) * 100
            print(f"Processing: {progress:.1f}% (frame {frame_count}/{total_frames})")
        
        # Run YOLOv8 tracking on the frame with improved parameters
        results = model.track(
            frame, 
            persist=True, 
            conf=confidence_threshold, 
            iou=iou_threshold, 
            imgsz=640
        )
        
        # Current frame's tracked objects
        current_tracks = set()
        
        # Get the boxes and track IDs
        if results[0].boxes is not None and hasattr(results[0].boxes, 'id') and results[0].boxes.id is not None:
            boxes = results[0].boxes.xyxy.cpu().numpy().astype(int)
            track_ids = results[0].boxes.id.cpu().numpy().astype(int)
            cls_ids = results[0].boxes.cls.cpu().numpy().astype(int)
            confs = results[0].boxes.conf.cpu().numpy()
            
            # Get class names
            class_names = results[0].names
            
            # Process each detection
            for i, (box, track_id, cls_id, conf) in enumerate(zip(boxes, track_ids, cls_ids, confs)):
                class_name = class_names[cls_id]
                
                # Skip excluded classes (like person)
                if class_name in excluded_classes:
                    continue
                
                current_tracks.add(track_id)
                
                # Initialize or update track history
                if track_id not in track_history:
                    track_history[track_id] = {
                        'frames_seen': 0,
                        'consecutive_misses': 0,
                        'class_counts': defaultdict(int),
                        'counted': False,
                        'box_history': []
                    }
                
                # Update track history
                track_history[track_id]['frames_seen'] += 1
                track_history[track_id]['consecutive_misses'] = 0
                track_history[track_id]['class_counts'][class_name] += 1
                track_history[track_id]['box_history'].append(box)
                
                # Keep only the last 10 boxes for trajectory analysis
                if len(track_history[track_id]['box_history']) > 10:
                    track_history[track_id]['box_history'] = track_history[track_id]['box_history'][-10:]
                
                # Determine the most likely class for this track
                most_common_class = max(track_history[track_id]['class_counts'].items(), key=lambda x: x[1])[0]
                
                # Count the object if it has been seen in enough frames and hasn't been counted yet
                if track_history[track_id]['frames_seen'] >= min_frames_to_count and not track_history[track_id]['counted']:
                    track_history[track_id]['counted'] = True
                    tracked_objects[track_id] = most_common_class
                    object_counts[most_common_class] += 1
                    
                    # Initialize item metadata
                    item_id = f"{most_common_class}_{object_counts[most_common_class]}"
                    item_metadata[item_id] = {
                        "class": most_common_class,
                        "track_id": int(track_id),
                        "confidence": float(conf),
                        "first_seen_frame": frame_count,
                        "snapshot_path": None,
                        "estimated_value": None
                    }
                
                # Check if this is a good frame for a snapshot (high confidence and object has been tracked for a while)
                if (track_id not in best_snapshots or conf > best_snapshots[track_id]["conf"]) and \
                conf >= snapshot_confidence_threshold and \
                track_history[track_id]['frames_seen'] >= min_frames_to_count:
                    
                    # Extract the object region with a small margin
                    x1, y1, x2, y2 = box
                    # Add margin (10% of width/height)
                    margin_x = int((x2 - x1) * 0.1)
                    margin_y = int((y2 - y1) * 0.1)
                    # Ensure coordinates are within frame boundaries
                    x1_margin = max(0, x1 - margin_x)
                    y1_margin = max(0, y1 - margin_y)
                    x2_margin = min(width, x2 + margin_x)
                    y2_margin = min(height, y2 + margin_y)
                    
                    # Extract the object snapshot
                    object_snapshot = frame[y1_margin:y2_margin, x1_margin:x2_margin].copy()
                    
                    # Only proceed if the snapshot is not empty
                    if object_snapshot.size > 0:
                        # Update best snapshot for this track
                        best_snapshots[track_id] = {
                            "conf": conf,
                            "saved": False,
                            "class": most_common_class,
                            "snapshot": object_snapshot,
                            "frame_number": frame_count
                        }
                
                # Draw bounding box with different colors based on track stability
                if not hide_display:
                    color = (0, 255, 0)  # Default green
                    if track_history[track_id]['frames_seen'] < min_frames_to_count:
                        color = (0, 165, 255)  # Orange for new tracks
                    elif track_history[track_id]['counted']:
                        color = (0, 255, 0)  # Green for counted tracks
                
                    x1, y1, x2, y2 = box
                    cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                
                    # Display class name, track ID, confidence and frame count
                    label = f"{most_common_class} #{track_id} {conf:.2f} ({track_history[track_id]['frames_seen']})"
                    cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
        
        # Update consecutive misses for tracks not seen in this frame
        tracks_to_remove = []
        for track_id in track_history:
            if track_id not in current_tracks:
                track_history[track_id]['consecutive_misses'] += 1
                
                # Remove tracks that have been missing for too many consecutive frames
                if track_history[track_id]['consecutive_misses'] > max_consecutive_misses:
                    tracks_to_remove.append(track_id)
        
        # Remove stale tracks
        for track_id in tracks_to_remove:
            del track_history[track_id]
        
        # Display object counts on the frame
        if not hide_display:
            y_pos = 30
            cv2.putText(frame, f"Frame: {frame_count}", (10, y_pos), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            y_pos += 30
            
            cv2.putText(frame, "Items Inventory:", (10, y_pos), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            y_pos += 30
        
            for cls, count in sorted(object_counts.items()):
                cv2.putText(frame, f"{cls}: {count}", (10, y_pos), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                y_pos += 30
        
        # Show and save the frame
        cv2.imshow('Insurance Item Tracking', frame)
        out.write(frame)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Save snapshots for each tracked object
    print("\nSaving best snapshots of detected items...")
    for track_id, snapshot_info in best_snapshots.items():
        if track_id in tracked_objects and not snapshot_info["saved"]:
            class_name = snapshot_info["class"]
            item_count = sum(1 for t_id, cls in tracked_objects.items() if cls == class_name and t_id <= track_id)
            
            # Create a unique filename
            snapshot_filename = f"{class_name}_{item_count}_id{track_id}_conf{snapshot_info['conf']:.2f}_frame{snapshot_info['frame_number']}.jpg"
            snapshot_path = os.path.join(snapshot_dir, snapshot_filename)
            
            # Save the snapshot
            cv2.imwrite(snapshot_path, snapshot_info["snapshot"])
            snapshot_info["saved"] = True
            
            # Estimate price for the item
            try:
                name, price = price_estimator.analyze_item_with_gemini(snapshot_path)
                snapshot_info["estimated_name"] = name
                snapshot_info["estimated_price"] = price
            except Exception as e:
                print(f"Error estimating price for {class_name} (ID: {track_id}): {str(e)}")
                snapshot_info["estimated_name"] = class_name
                snapshot_info["estimated_price"] = None
            
            # Update metadata
            item_id = f"{class_name}_{item_count}"
            if item_id in item_metadata:
                item_metadata[item_id]["snapshot_path"] = snapshot_path
                item_metadata[item_id]["best_confidence"] = float(snapshot_info["conf"])
                item_metadata[item_id]["snapshot_frame"] = int(snapshot_info["frame_number"])
                item_metadata[item_id]["estimated_name"] = snapshot_info["estimated_name"]
                item_metadata[item_id]["estimated_price"] = snapshot_info["estimated_price"]
            
            print(f"Saved snapshot of {class_name} (ID: {track_id}) to {snapshot_path}")
            if snapshot_info["estimated_price"] is not None:
                print(f"Estimated price: ${snapshot_info['estimated_price']:,.2f} ({snapshot_info['estimated_name']})")

    # Filter metadata to only include items with snapshots
    filtered_metadata = {}
    for item_id, data in item_metadata.items():
        if data.get("snapshot_path") is not None:
            filtered_metadata[item_id] = data

    # Save metadata to JSON file
    metadata_path = os.path.join(snapshot_dir, "item_metadata.json")
    with open(metadata_path, 'w') as f:
        json.dump(filtered_metadata, f, indent=2)
    print(f"Saved item metadata to {metadata_path}")

    # Print final inventory
    print("\nFinal Items Inventory:")
    snapshot_count = 0
    class_counts = defaultdict(int)
    total_value = 0

    # Count only items with snapshots
    for item_id, data in filtered_metadata.items():
        class_name = data["class"]
        class_counts[class_name] += 1
        snapshot_count += 1
        if data.get("estimated_price") is not None:
            total_value += data["estimated_price"]

    # Print counts by class with prices
    for class_name, count in sorted(class_counts.items()):
        items = [item for item in filtered_metadata.values() if item["class"] == class_name]
        avg_price = sum(item.get("estimated_price", 0) for item in items) / count if count > 0 else 0
        print(f"{class_name}: {count} items")
        for item in items:
            if item.get("estimated_price") is not None:
                print(f"  - {item['estimated_name']}: ${item['estimated_price']:,.2f}")

    print(f"\nTotal unique items with snapshots: {snapshot_count}")
    print(f"Total estimated value: ${total_value:,.2f}")
    print(f"Snapshots saved: {snapshot_count}")
    print(f"Snapshots directory: {os.path.abspath(snapshot_dir)}")

    # Upload inventory to Supabase
    from InventoryUploader import InventoryUploader
    uploader = InventoryUploader()
    print("\nUploading inventory to Supabase...")
    response = uploader.upload_inventory(metadata_path, video_path)
    if response:
        print(f"Inventory uploaded successfully with ID: {response.get('id')}")
        print(f"Total value recorded: ${response.get('totalValue', total_value):,.2f}")
        print(f"Number of items: {response.get('numItems', snapshot_count)}")
    else:
        print("Failed to upload inventory to Supabase. Check connection and credentials.")


    # response.get('id') is the jobId
    # Clean up tkinter
    root.destroy()

    cap.release()
    out.release()
    cv2.destroyAllWindows()
    return snapshot_dir