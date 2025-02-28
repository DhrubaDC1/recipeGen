import React, { useRef, useEffect } from "react";

function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        onClose(); // Close the camera UI if access fails
      }
    }
    setupCamera();

    // Cleanup function to stop the camera stream
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onClose]);

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const file = new File([blob], "captured_photo.jpg", {
        type: "image/jpeg",
      });
      onCapture(file);
      onClose(); // Close the camera after capturing
    }, "image/jpeg");
  };

  return (
    <div className="camera-capture">
      <video ref={videoRef} autoPlay />
      <button onClick={capturePhoto}>Capture</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default CameraCapture;
