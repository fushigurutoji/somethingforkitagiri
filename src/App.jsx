import { useState, useEffect, useRef } from "react";
import { story } from "./data/story";
import { lyricsData } from "./data/lyrics";
import Frame from "./components/Frame";
import Navbar from "./components/Navbar";
import FloatingElements from "./components/FloatingElements";
import Question from "./components/Question";
import FinalScreen from "./components/FinalScreen";

function App() {
  const [current, setCurrent] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLyric, setCurrentLyric] = useState("");
  
  // Use a ref for the current lyric state to access it inside the listener 
  // without needing to re-bind the event listener constantly
  const lyricRef = useRef("");
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/song.mp3");
    audioRef.current.loop = true;
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      if (audio.currentTime < 5) {
        if (lyricRef.current !== "") {
          lyricRef.current = "";
          setCurrentLyric("");
        }
        return;
      }

      const active = lyricsData.find((item, index) => {
        const next = lyricsData[index + 1];
        return audio.currentTime >= item.time && (!next || audio.currentTime < next.time);
      });

      if (active && active.text !== lyricRef.current) {
        lyricRef.current = active.text;
        setCurrentLyric(active.text);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.pause();
    };
  }, []); // Empty dependency array is safe now because we use refs

  const togglePlay = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play().catch(console.error);
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-200 via-purple-200 to-pink-300 relative overflow-hidden">
      <FloatingElements />
      <Navbar />

      {/* Lyric Display */}
      <div className="fixed top-20 left-4 z-40 w-64 p-4 bg-white/20 backdrop-blur-md rounded-lg shadow-lg border border-white/30">
        <p className="text-white font-medium text-sm">
          {currentLyric || "Waiting..."}
        </p>
      </div>

      {!showQuestion && !showFinal && (
        <Frame
          image={story[current].image}
          text={story[current].text}
          onNext={() => {
            if (!isPlaying && audioRef.current) {
              audioRef.current.play().catch(() => {});
              setIsPlaying(true);
            }
            if (current === story.length - 1) setShowQuestion(true);
            else setCurrent((p) => p + 1);
          }}
        />
      )}

      {showQuestion && !showFinal && <Question onYes={() => setShowFinal(true)} />}
      {showFinal && <FinalScreen onReplay={() => { setCurrent(0); setShowQuestion(false); setShowFinal(false); }} />}

      <button onClick={togglePlay} className="fixed bottom-6 right-6 z-50 p-3 bg-white/80 backdrop-blur-md text-pink-600 rounded-full shadow-lg border border-pink-100 hover:scale-110 active:scale-95 transition-all duration-300">
        {isPlaying ? "🎵" : "🔇"}
      </button>
    </div>
  );
}

export default App;
