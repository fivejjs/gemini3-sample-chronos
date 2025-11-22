import React, { useRef, useState, useEffect } from 'react';
import { Button } from './Button';
import { Camera, RefreshCw, AlertCircle, Video } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (base64: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState<boolean>(false);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    setIsInitializing(true);
    setError('');
    
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user', 
          width: { ideal: 1280 }, 
          height: { ideal: 720 } 
        } 
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      
      let errorMessage = "Could not access camera.";
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = "Camera permission denied. Please allow access in your browser settings.";
      } else if (err.name === 'NotFoundError') {
        errorMessage = "No camera found on your device.";
      } else if (err.name === 'NotReadableError') {
        errorMessage = "Camera is currently in use by another application.";
      } else if (err.message?.includes('dismissed')) {
        errorMessage = "Permission request dismissed. Please try again.";
      }
      
      setError(errorMessage);
    } finally {
      setIsInitializing(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Flip horizontally for mirror effect
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto animate-fade-in">
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800">
        
        {/* Video Feed */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className={`w-full h-full object-cover transform scale-x-[-1] ${!stream ? 'hidden' : ''}`}
        />
        
        {/* Canvas (Hidden) */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Overlay: Initial State or Error */}
        {!stream && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gray-900/90 z-10">
            {error ? (
              <div className="flex flex-col items-center gap-4 animate-fade-in">
                <div className="p-3 bg-red-500/10 rounded-full text-red-400">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-red-400 font-semibold">Camera Error</h3>
                  <p className="text-sm text-gray-400 max-w-xs mx-auto">{error}</p>
                </div>
                <Button onClick={startCamera} variant="outline" className="mt-2 border-red-500/30 text-red-400 hover:bg-red-500/10">
                  <RefreshCw className="w-4 h-4 mr-2" /> Try Again
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-gray-800 rounded-full text-gray-400">
                  <Video className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-white font-semibold">Enable Camera</h3>
                  <p className="text-sm text-gray-400">Allow access to take your time travel photo</p>
                </div>
                <Button 
                  onClick={startCamera} 
                  variant="primary" 
                  isLoading={isInitializing}
                  className="mt-2"
                >
                  Start Camera
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      {stream && (
        <div className="flex gap-4 animate-fade-in">
          <Button onClick={capturePhoto} className="min-w-[200px] shadow-xl shadow-gold-900/20">
            <Camera className="w-5 h-5 mr-2" />
            Take Photo
          </Button>
        </div>
      )}
    </div>
  );
};