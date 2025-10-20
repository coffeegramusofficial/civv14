import { useGameState } from "../../lib/stores/useGameState";
import { useAudio } from "../../lib/stores/useAudio";
import { Button } from "../ui/button";
import { Faction } from "../../lib/cards";
import { getDecksByFaction, loadDeck } from "../../lib/deckStorage";
import { ArrowLeft } from "lucide-react";

export default function FactionSelect() {
  const { setSelectedFaction, setGamePhase, initializeGame, setPlayerDeck } = useGameState();
  const { playClick } = useAudio();

  const selectFaction = (faction: Faction) => {
    playClick();
    setSelectedFaction(faction);
    
    const decks = getDecksByFaction(faction);
    const activeDeck = decks.find(d => d.name === `Active_${faction}`);
    
    if (activeDeck) {
      const cards = loadDeck(activeDeck.id);
      if (cards) {
        setPlayerDeck(cards);
      }
    }
    
    initializeGame();
    setGamePhase('playing');
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-4xl w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-100 mb-8 sm:mb-12">
            Выберите фракцию
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <button
              onClick={() => selectFaction('whites')}
              className="group relative bg-gray-800 hover:bg-gray-750 border-2 border-blue-500 hover:border-blue-400 rounded-xl p-6 sm:p-8 transition-all hover:scale-105 active:scale-95"
            >
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-300 mb-3 sm:mb-4">
                  Белая Армия
                </h2>
                <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
                  Имперские лоялисты
                </p>
                <div className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                  Играть
                </div>
              </div>
            </button>

            <button
              onClick={() => selectFaction('reds')}
              className="group relative bg-gray-800 hover:bg-gray-750 border-2 border-red-500 hover:border-red-400 rounded-xl p-6 sm:p-8 transition-all hover:scale-105 active:scale-95"
            >
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-red-300 mb-3 sm:mb-4">
                  Красная Армия
                </h2>
                <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
                  Большевики
                </p>
                <div className="inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
                  Играть
                </div>
              </div>
            </button>
          </div>

          <div className="text-center mt-6 sm:mt-8">
            <Button 
              onClick={() => { setGamePhase('menu'); playClick(); }}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад в меню
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
