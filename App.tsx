import React, { useState } from 'react';
import { CameraCapture } from './components/CameraCapture';
import { ImageUploader } from './components/ImageUploader';
import { SceneSelector } from './components/SceneSelector';
import { Button } from './components/Button';
import { transformImage, analyzeImage } from './services/geminiService';
import { HistoricalScene, AppState } from './types';
import { Camera, Image as ImageIcon, Sparkles, Wand2, Search, ArrowLeft, Download, RotateCcw } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [inputMethod, setInputMethod] = useState<'camera' | 'upload'>('upload');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [selectedScene, setSelectedScene] = useState<HistoricalScene | null>(null);
  const [editPrompt, setEditPrompt] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const handleImageInput = (base64: string) => {
    setOriginalImage(base64);
    setCurrentImage(base64);
  };

  const reset = () => {
    setAppState(AppState.IDLE);
    setOriginalImage(null);
    setCurrentImage(null);
    setSelectedScene(null);
    setAnalysisResult('');
    setEditPrompt('');
  };

  const handleTimeTravel = async () => {
    if (!currentImage || !selectedScene) return;

    setAppState(AppState.PROCESSING);
    setLoadingMessage(`Traveling to ${selectedScene.era}...`);

    try {
      const result = await transformImage(currentImage, selectedScene.promptModifier);
      setCurrentImage(result);
      setAppState(AppState.RESULT);
    } catch (error) {
      alert("Time travel malfunction! Please try again.");
      setAppState(AppState.IDLE); // Or error state
    }
  };

  const handleEdit = async () => {
    if (!currentImage || !editPrompt.trim()) return;

    setAppState(AppState.PROCESSING);
    setLoadingMessage('Refining reality...');

    try {
      const result = await transformImage(currentImage, editPrompt);
      setCurrentImage(result);
      setEditPrompt('');
      setAppState(AppState.RESULT);
    } catch (error) {
      alert("Edit failed. Please try again.");
      setAppState(AppState.RESULT);
    }
  };

  const handleAnalyze = async () => {
    if (!currentImage) return;

    setAppState(AppState.PROCESSING);
    setLoadingMessage('Analyzing temporal anomalies...');

    try {
      const result = await analyzeImage(currentImage);
      setAnalysisResult(result);
      setAppState(AppState.RESULT);
    } catch (error) {
      alert("Analysis failed.");
      setAppState(AppState.RESULT);
    }
  };

  const downloadImage = () => {
    if (currentImage) {
      const link = document.createElement('a');
      link.href = currentImage;
      link.download = `chronosnap-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 font-sans selection:bg-gold-500/30">
      
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#141414] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={reset} role="button">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
              <ClockIcon className="text-black w-5 h-5" />
            </div>
            <h1 className="text-xl font-serif font-bold text-white tracking-wide">Chrono<span className="text-gold-500">Snap</span></h1>
          </div>
          {originalImage && (
            <Button variant="ghost" onClick={reset} className="text-sm">
              <RotateCcw className="w-4 h-4" /> Start Over
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 pb-32">
        
        {/* Step 1: Input */}
        {!originalImage && (
          <div className="flex flex-col items-center animate-fade-in space-y-8 mt-10">
            <div className="text-center max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Step into History</h2>
              <p className="text-gray-400 text-lg">Upload a selfie or take a photo to transport yourself across time and space using advanced AI.</p>
            </div>

            <div className="flex p-1 bg-gray-800 rounded-lg">
              <button
                onClick={() => setInputMethod('upload')}
                className={`px-6 py-2 rounded-md transition-all ${inputMethod === 'upload' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
              >
                <div className="flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Upload</div>
              </button>
              <button
                onClick={() => setInputMethod('camera')}
                className={`px-6 py-2 rounded-md transition-all ${inputMethod === 'camera' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
              >
                <div className="flex items-center gap-2"><Camera className="w-4 h-4"/> Camera</div>
              </button>
            </div>

            <div className="w-full max-w-2xl">
              {inputMethod === 'upload' ? (
                <ImageUploader onUpload={handleImageInput} />
              ) : (
                <CameraCapture onCapture={handleImageInput} />
              )}
            </div>
          </div>
        )}

        {/* Step 2 & 3: Selection and Results */}
        {originalImage && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Image Display */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="relative rounded-2xl overflow-hidden bg-[#1a1a1a] shadow-2xl border border-gray-800 aspect-[4/3] group">
                {currentImage ? (
                  <img src={currentImage} alt="Current" className="w-full h-full object-contain bg-black/50" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                )}
                
                {appState === AppState.PROCESSING && (
                   <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
                     <div className="w-16 h-16 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mb-4"></div>
                     <p className="text-gold-400 font-serif text-lg animate-pulse">{loadingMessage}</p>
                   </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                <Button onClick={downloadImage} variant="secondary" disabled={appState === AppState.PROCESSING}>
                  <Download className="w-4 h-4" /> Download
                </Button>
                <Button onClick={handleAnalyze} variant="outline" disabled={appState === AppState.PROCESSING}>
                  <Search className="w-4 h-4" /> Analyze Image
                </Button>
                {/* Revert to original if changed */}
                {currentImage !== originalImage && (
                  <Button onClick={() => { setCurrentImage(originalImage); setAnalysisResult(''); }} variant="ghost">
                    Show Original
                  </Button>
                )}
              </div>

              {/* Analysis Result Box */}
              {analysisResult && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 animate-fade-in">
                  <h3 className="text-gold-500 font-bold mb-2 flex items-center gap-2">
                    <Search className="w-4 h-4" /> Image Analysis
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm">{analysisResult}</p>
                </div>
              )}
            </div>

            {/* Right Column: Controls */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Scene Selector */}
              <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold-500" /> Choose Era
                </h3>
                <div className="h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  <SceneSelector 
                    selectedSceneId={selectedScene?.id || null} 
                    onSelect={setSelectedScene} 
                  />
                </div>
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <Button 
                    className="w-full" 
                    onClick={handleTimeTravel}
                    disabled={!selectedScene || appState === AppState.PROCESSING}
                  >
                    Travel to {selectedScene?.era || 'Unknown'}
                  </Button>
                </div>
              </div>

              {/* Magic Editor (Nano Banana Feature) */}
              <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6">
                 <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-purple-400" /> Magic Edit
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Use AI to refine the image. E.g., "Add a vintage filter", "Remove the background", "Make it rainy".
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="Describe your edit..."
                    className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-gold-500 transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
                  />
                  <Button 
                    variant="secondary" 
                    onClick={handleEdit}
                    disabled={!editPrompt.trim() || appState === AppState.PROCESSING}
                    className="shrink-0"
                  >
                    <Wand2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Simple Clock Icon Component
const ClockIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default App;