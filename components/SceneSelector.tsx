import React from 'react';
import { SCENES } from '../constants';
import { HistoricalScene } from '../types';
import { Clock } from 'lucide-react';

interface SceneSelectorProps {
  selectedSceneId: string | null;
  onSelect: (scene: HistoricalScene) => void;
}

export const SceneSelector: React.FC<SceneSelectorProps> = ({ selectedSceneId, onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {SCENES.map((scene) => (
        <div 
          key={scene.id}
          onClick={() => onSelect(scene)}
          className={`
            relative cursor-pointer group rounded-xl overflow-hidden border-2 transition-all duration-300
            ${selectedSceneId === scene.id 
              ? 'border-gold-500 shadow-[0_0_20px_rgba(234,179,8,0.3)] scale-[1.02]' 
              : 'border-transparent hover:border-gray-600 grayscale hover:grayscale-0'
            }
          `}
        >
          {/* Background Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />
          
          <img 
            src={scene.thumbnail} 
            alt={scene.name}
            className="w-full h-48 object-cover -z-10"
          />
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-1">
                <Clock className="w-3 h-3 text-gold-500" />
                <span className="text-xs font-bold text-gold-500 tracking-wider uppercase">{scene.era}</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-gold-400 transition-colors">{scene.name}</h3>
            <p className="text-xs text-gray-300 line-clamp-2">{scene.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};