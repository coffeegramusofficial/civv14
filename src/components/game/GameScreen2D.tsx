import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameState, Tower, GameCard } from "../../lib/stores/useGameState";
import { useAudio } from "../../lib/stores/useAudio";
import Tower2D from "./Tower2D";
import Board2D from "./Board2D";
import Card2D from "./Card2D";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

export default function GameScreen2D() {
  const { 
    player, 
    ai,
    boardCards, 
    currentTurn, 
    turnNumber, 
    selectedCard,
    selectedAttacker, 
    selectCard, 
    playCard,
    playBonusCard,
    attackWithCard, 
    endTurn, 
    resetGame,
    winner
  } = useGameState();
  const { playSuccess, playCardSlide, playClick } = useAudio();
  const [isPaused, setIsPaused] = useState(false);
  
  const handleBattlefieldClick = () => {
    if (!selectedCard || selectedCard.type !== 'unit' || !player) return;
    if (currentTurn !== 'player' || player.supply < selectedCard.cost) return;
    
    playCard(selectedCard, { x: Math.random() * 4 - 2, z: -6 });
    
    selectCard(null);
    playCardSlide();
  };

  const handleBonusCardOnBoard = (targetCard: GameCard) => {
    if (!selectedCard || selectedCard.type !== 'bonus' || !player) return;
    if (currentTurn !== 'player' || player.supply < selectedCard.cost) return;
    
    if (selectedCard.bonusClass === 'medic' && targetCard.faction === player.faction) {
      playBonusCard(selectedCard, targetCard.id);
      playCardSlide();
    }
  };

  const handleBonusCardOnTower = (tower: Tower) => {
    if (!selectedCard || selectedCard.type !== 'bonus' || !player || !ai) return;
    if (currentTurn !== 'player' || player.supply < selectedCard.cost) return;
    
    if (selectedCard.bonusClass === 'aerial' && tower.faction === ai.faction) {
      playBonusCard(selectedCard, tower.id);
      selectCard(null);
      playCardSlide();
    }
  };
  
  const canAttackTower = (tower: Tower): boolean => {
    if (!selectedAttacker || !ai || !player) return false;
    
    const enemyCards = boardCards.filter(c => 
      c.faction === ai.faction && 
      c.type === 'unit' && 
      (c.currentHealth || 0) > 0
    );
    
    if (selectedAttacker.unitClass === 'spy') {
      return tower.isMain;
    } else {
      if (enemyCards.length > 0) return false;
      
      if (tower.isMain) {
        const sideTowers = ai.towers.filter(t => !t.isMain && t.health > 0);
        return sideTowers.length === 0;
      }
      
      return true;
    }
  };
  
  if (!player || !ai) return null;

  if (isPaused) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="w-full max-w-md mx-4 bg-gray-900/95 border-gray-700 border-2">
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-4xl font-bold text-gray-100 mb-6">Пауза</h2>
              <Button 
                onClick={() => { setIsPaused(false); playClick(); }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 text-lg"
              >
                Продолжить игру
              </Button>
              <Button 
                onClick={() => {
                  resetGame();
                  setIsPaused(false);
                  playClick();
                }}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 font-semibold py-6 text-lg"
              >
                Вернуться в меню
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (winner) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md mx-4 bg-gray-800 border-amber-600 border-4">
            <CardContent className="p-8 text-center">
              <motion.h2 
                className="text-5xl font-bold text-amber-200 mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {winner === player.faction ? 'ПОБЕДА' : 'ПОРАЖЕНИЕ'}
              </motion.h2>
              <p className="text-gray-300 mb-6 text-lg">
                {winner === 'whites' ? 'Белая Армия' : 'Красная Армия'} уничтожила главную башню врага!
              </p>
              <Button 
                onClick={() => { resetGame(); playClick(); }}
                className="w-full bg-amber-600 hover:bg-amber-700 text-black font-semibold py-6 text-lg"
              >
                Вернуться в меню
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 overflow-auto">
      <div className="min-h-screen py-4 px-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <Card className="bg-gray-800 border-red-500">
              <CardContent className="p-3 flex items-center gap-3">
                <Badge className="bg-red-600 text-white">
                  {ai.faction === 'whites' ? 'Белая' : 'Красная'} (AI)
                </Badge>
                <div className="text-white flex items-center gap-3">
                  <span className="text-sm">Снабжение: {ai.supply}</span>
                  <span className="text-sm">Карт: {ai.deck.length}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-3">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-gray-200 font-semibold text-lg">Ход {turnNumber}</div>
                  <div className="text-sm text-gray-400">
                    {currentTurn === 'player' ? 'Ваш ход' : 'Ход врага'}
                  </div>
                </CardContent>
              </Card>
              
              <Button
                onClick={() => { setIsPaused(true); playClick(); }}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 px-6"
              >
                ⏸ Пауза
              </Button>
            </div>

            <Card className="bg-gray-800 border-blue-500">
              <CardContent className="p-3 flex items-center gap-3">
                <Badge className="bg-blue-600 text-white">
                  {player.faction === 'whites' ? 'Белая' : 'Красная'} (Вы)
                </Badge>
                <div className="text-white flex items-center gap-3">
                  <span className="text-sm">Снабжение: {player.supply}/{player.maxSupply}</span>
                  <span className="text-sm">Карт: {player.deck.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center gap-4">
            {ai.towers.map(tower => {
              const isAttackTarget = !!selectedAttacker && currentTurn === 'player' && tower.health > 0 && canAttackTower(tower);
              const isBombardTarget = !!selectedCard && selectedCard.type === 'bonus' && selectedCard.bonusClass === 'aerial' && currentTurn === 'player' && tower.health > 0;
              
              return (
                <Tower2D 
                  key={tower.id} 
                  tower={tower}
                  isTargetable={isAttackTarget || isBombardTarget}
                  onClick={() => {
                    if (isAttackTarget && selectedAttacker) {
                      attackWithCard(selectedAttacker.id, tower.id);
                      playClick();
                    } else if (isBombardTarget && selectedCard) {
                      handleBonusCardOnTower(tower);
                    }
                  }}
                />
              );
            })}
          </div>

          <Board2D 
            onBattlefieldClick={handleBattlefieldClick}
          />

          <div className="flex justify-center gap-4">
            {player.towers.map(tower => (
              <Tower2D key={tower.id} tower={tower} />
            ))}
          </div>

          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={() => { endTurn(); playClick(); }}
              disabled={currentTurn !== 'player'}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-6 text-lg disabled:opacity-50"
            >
              Завершить ход
            </Button>

            <div className="flex gap-2 justify-center flex-wrap max-w-4xl">
              <AnimatePresence>
                {player.hand.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card2D
                      card={card}
                      isInHand
                      isSelected={selectedCard?.id === card.id}
                      onClick={() => {
                        if (currentTurn === 'player' && player.supply >= card.cost) {
                          selectCard(selectedCard?.id === card.id ? null : card);
                          playClick();
                        }
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {selectedCard && (
              <Card className="max-w-md bg-gray-800 border-yellow-400 border-2">
                <CardContent className="p-4">
                  <h3 className="font-bold text-yellow-400 text-lg mb-2">{selectedCard.name}</h3>
                  <p className="text-sm text-gray-300 mb-2">{selectedCard.description}</p>
                  {selectedCard.type === 'unit' && (
                    <div className="flex gap-4 text-sm text-gray-300 mb-2">
                      <span>АТК: {selectedCard.damage}</span>
                      <span>Урон башням: {selectedCard.buildingDamage}</span>
                      <span>ОЗ: {selectedCard.health}</span>
                      <span>ЗАЩ: {selectedCard.defense}</span>
                    </div>
                  )}
                  <div className="text-sm text-yellow-400">Стоимость: {selectedCard.cost} Снабжения</div>
                  <p className="text-xs text-gray-400 mt-2">
                    {selectedCard.type === 'unit' 
                      ? 'Нажмите на поле боя для размещения' 
                      : selectedCard.bonusClass === 'aerial'
                      ? 'Нажмите на вражескую башню для атаки'
                      : selectedCard.bonusClass === 'medic'
                      ? 'Нажмите на союзную карту для лечения'
                      : 'Нажмите на союзную карту для усиления'}
                  </p>
                </CardContent>
              </Card>
            )}
            
            {selectedAttacker && (
              <Card className="max-w-md bg-gray-800 border-green-400 border-2">
                <CardContent className="p-4">
                  <h3 className="font-bold text-green-400 text-lg mb-2">⚔️ {selectedAttacker.name} готов к атаке!</h3>
                  <p className="text-sm text-gray-300 mb-2">
                    {selectedAttacker.unitClass === 'spy' 
                      ? 'Нажмите на ГЛАВНУЮ БАШНЮ врага для прямой атаки' 
                      : 'Нажмите на вражескую карту или башню для атаки'}
                  </p>
                  <div className="flex gap-4 text-sm text-gray-300 mb-2">
                    <span>АТК: {selectedAttacker.damage}</span>
                    <span>Урон башням: {selectedAttacker.buildingDamage}</span>
                    <span>ЗАЩ: {selectedAttacker.defense} (контратака)</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Нажмите на карту еще раз для отмены
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
