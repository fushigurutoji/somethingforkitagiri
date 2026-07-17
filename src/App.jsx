import { useState, useEffect, useRef } from "react"; // Added useEffect and useRef
import { story } from "./data/story";
import Frame from "./components/Frame";
import Navbar from "./components/Navbar";
import FloatingElements from "./components/FloatingElements";
import Question from "./components/Question";
import FinalScreen from "./components/FinalScreen";

function App() {
  const [current, setCurrent] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const handleTimeUpdate = () => {
  const audio = audioRef.current;
  
  // If we are before the 13s mark, clear the text
  if (audio.currentTime < 5) {
    setCurrentLyric("");
    return;
  }

  // Otherwise, find the current chunk
  const active = lyricsData.find((item, index) => {
    const next = lyricsData[index + 1];
    return audio.currentTime >= item.time && (!next || audio.currentTime < next.time);
  });

  if (active && active.text !== currentLyric) {
    setCurrentLyric(active.text);
  }
};

  // --- MUSIC STATE & REF ---
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const musicSrc = "/song.mp3"; 

  useEffect(() => {
    // Initialize the audio element
    audioRef.current = new Audio(musicSrc);
    audioRef.current.loop = true;

    // Cleanup: stop music if user closes/reloads the page
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [musicSrc]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.log("Autoplay blocked. User must interact first:", err);
      });
    }
    setIsPlaying(!isPlaying);
  };
  // -------------------------

  const replay = () => {
    setCurrent(0);
    setShowQuestion(false);
    setShowFinal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-200 via-purple-200 to-pink-300 relative overflow-hidden">
      {/* live background hearts/candy/teddy */}
      <FloatingElements />

      <Navbar />

      {!showQuestion && !showFinal && (
        <Frame
          image={story[current].image}
          text={story[current].text}
          onNext={() => {
            // Cool detail: Automatically start playing music on the first click!
            if (!isPlaying && audioRef.current) {
              audioRef.current.play().catch(() => {});
              setIsPlaying(true);
            }

            if (current === story.length - 1) {
              setShowQuestion(true);
            } else {
              setCurrent((p) => p + 1);
            }
          }}
        />
      )}

      {showQuestion && !showFinal && (
        <Question onYes={() => setShowFinal(true)} />
      )}

      {showFinal && <FinalScreen onReplay={replay} />}

      {/* FLOATING MUSIC TOGGLE BUTTON */}
      <button
        onClick={togglePlay}
        className="fixed bottom-6 right-6 z-50 p-3 bg-white/80 backdrop-blur-md text-pink-600 rounded-full shadow-lg border border-pink-100 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center text-xl"
        title={isPlaying ? "Pause Music" : "Play Music"}
      >
        {isPlaying ? "🎵" : "🔇"}
      </button>
    </div>
  );
}

export default App;
