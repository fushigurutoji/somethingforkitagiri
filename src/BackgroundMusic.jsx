import React, { useState, useEffect, useRef } from "react";

export default function BackgroundMusic() {
  
  const audioUrl = "./src/assets/song.mp3"; 
  
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
   
    audioRef.current = new Audio(audioUrl);
    audioRef.current.loop = true;

   
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.log("Playback blocked or failed:", err);
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={togglePlay}
        className="px-4 py-2 bg-black text-white rounded-full shadow-lg border border-gray-700 hover:bg-gray-900 transition-all flex items-center gap-2 text-sm font-semibold"
      >
        {isPlaying ? (
          <>
            <span>⏸️</span> Pause Vibe
          </>
        ) : (
          <>
            <span>▶️</span> Play Music
          </>
        )}
      </button>
    </div>
  );
}
