import { motion } from "framer-motion";
import { GameCard } from "../../lib/stores/useGameState";
import { cn } from "../../lib/utils";
import { Swords, Castle, Heart, Shield } from "lucide-react";

interface Card2DProps {
  card: GameCard;
  isInHand?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
  isTargetable?: boolean;
  className?: string;
}

const getCardImage = (card: GameCard): string => {
  const cardKey = `${card.faction}_${card.name}`;
  
  const imageMap: Record<string, string> = {
    'whites_Юнкер': '/images/whites_yunker.jpg',
    'whites_Пулеметчик «Максим»': '/images/whites_maxim.jpg',
    'whites_Козак': '/images/whites_kozak.jpg',
    'whites_Илья Муромец': '/images/whites_ilya_muromets.jpg',
    'whites_Матрос': '/images/whites_matros.jpg',
    'whites_Разведчик-шпион': '/images/whites_spy.jpg',
    'whites_Доктор Павлов': '/images/whites_doctor_pavlov.jpg',
    'whites_Адмирал Колчак': '/images/whites_admiral_kolchak.jpg',
    'whites_Стенобитное орудие': '/images/whites_siege_weapon.jpg',
    
    'reds_Красноармеец': '/images/reds_krasnoarmeets.jpg',
    'reds_Пулеметчик «Максим»': '/images/reds_maxim.jpg',
    'reds_Офицер ВЧК': '/images/reds_vchk_officer.jpg',
    'reds_Пролетарий': '/images/reds_proletariy.jpg',
    'reds_Рабочий': '/images/reds_rabochiy.jpg',
    'reds_Агент ВЧК': '/images/reds_vchk_agent.jpg',
    'reds_Доктор Маша': '/images/reds_doctor_masha.jpg',
    'reds_Феликс Дзержинский': '/images/reds_felix_dzerzhinsky.jpg',
    'reds_Стенобитное орудие': '/images/reds_siege_weapon.jpg',
  };
  
  return imageMap[cardKey] || '';
};

export default function Card2D({ 
  card, 
  isInHand = false, 
  onClick, 
  isSelected = false, 
  isTargetable = false,
  className 
}: Card2DProps) {
  // Rarity-based border colors
  const rarityBorderColors = {
    common: 'border-gray-400',
    rare: 'border-blue-400',
    epic: 'border-purple-500',
    legendary: 'border-orange-500'
  };
  
  const rarityGlowColors = {
    common: 'shadow-gray-500/50',
    rare: 'shadow-blue-500/50',
    epic: 'shadow-purple-500/50',
    legendary: 'shadow-orange-500/50'
  };
  
  const borderColor = rarityBorderColors[card.rarity];
  const glowColor = rarityGlowColors[card.rarity];
  const isDead = card.type === 'unit' && (card.currentHealth !== undefined ? card.currentHealth : card.health) <= 0;
  const cardImage = getCardImage(card);
  
  return (
    <motion.div
      className={cn(
        "relative w-32 h-44 rounded-lg border-2 cursor-pointer transition-all overflow-hidden bg-black shadow-lg",
        `${borderColor}`,
        isSelected && `ring-4 ring-yellow-400 scale-105 shadow-2xl ${glowColor}`,
        isTargetable && "ring-4 ring-green-400 animate-pulse",
        isDead && "opacity-40 grayscale",
        isInHand && "hover:scale-105 hover:-translate-y-2",
        className
      )}
      onClick={onClick}
      whileHover={!isDead ? { y: isInHand ? -10 : 0, scale: isInHand ? 1.05 : 1 } : {}}
      whileTap={!isDead ? { scale: 0.95 } : {}}
    >
      {cardImage && (
        <>
          {card.rarity === 'legendary' && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/30 to-transparent z-[1]"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          )}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${cardImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
        </>
      )}
      
      <div className="absolute top-2 right-2 bg-amber-500 text-black font-bold text-sm w-7 h-7 rounded-full flex items-center justify-center shadow-lg z-10">
        {card.cost}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-2 space-y-1">
        <div className="text-white font-bold text-xs text-center drop-shadow-lg truncate">
          {card.name}
        </div>
        
        {card.type === 'unit' && (
          <div className="flex justify-center gap-1 text-[10px] flex-wrap">
            <div className="flex items-center gap-0.5 bg-black/70 px-1 py-0.5 rounded">
              <Swords className="h-2.5 w-2.5 text-red-400" />
              <span className="text-white font-semibold">{card.damage}</span>
            </div>
            <div className="flex items-center gap-0.5 bg-black/70 px-1 py-0.5 rounded">
              <Castle className="h-2.5 w-2.5 text-orange-400" />
              <span className="text-white font-semibold">{card.buildingDamage}</span>
            </div>
            <div className="flex items-center gap-0.5 bg-black/70 px-1 py-0.5 rounded">
              <Heart className="h-2.5 w-2.5 text-green-400" />
              <span className="text-white font-semibold">
                {card.currentHealth !== undefined ? card.currentHealth : card.health}
              </span>
            </div>
            <div className="flex items-center gap-0.5 bg-black/70 px-1 py-0.5 rounded">
              <Shield className="h-2.5 w-2.5 text-blue-400" />
              <span className="text-white font-semibold">{card.defense}</span>
            </div>
          </div>
        )}
        
        {card.type === 'bonus' && card.bonusEffect && (
          <div className="flex justify-center gap-1 text-[10px] flex-wrap">
            {card.bonusEffect.type === 'heal' && (
              <div className="flex items-center gap-0.5 bg-black/70 px-1 py-0.5 rounded">
                <Heart className="h-2.5 w-2.5 text-green-400" />
                <span className="text-white font-semibold">+{card.bonusEffect.value}</span>
              </div>
            )}
            {card.bonusEffect.type === 'damage_boost' && (
              <div className="flex items-center gap-0.5 bg-black/70 px-1 py-0.5 rounded">
                <Swords className="h-2.5 w-2.5 text-red-400" />
                <span className="text-white font-semibold">+{card.bonusEffect.value}</span>
              </div>
            )}
            {card.bonusEffect.type === 'building_damage_boost' && (
              <div className="flex items-center gap-0.5 bg-black/70 px-1 py-0.5 rounded">
                <Castle className="h-2.5 w-2.5 text-orange-400" />
                <span className="text-white font-semibold">+{card.bonusEffect.value}</span>
              </div>
            )}
            {card.bonusEffect.type === 'direct_building_damage' && (
              <div className="flex items-center gap-0.5 bg-black/70 px-1 py-0.5 rounded">
                <Castle className="h-2.5 w-2.5 text-orange-400" />
                <span className="text-white font-semibold">{card.bonusEffect.value}</span>
              </div>
            )}
            {card.bonusEffect.type === 'direct_damage' && (
              <div className="flex items-center gap-0.5 bg-black/70 px-1 py-0.5 rounded">
                <Swords className="h-2.5 w-2.5 text-red-400" />
                <span className="text-white font-semibold">{card.bonusEffect.value}</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {card.unitClass && (
        <div className="absolute top-2 left-2">
          <span className={cn(
            "text-[8px] font-bold px-1.5 py-0.5 rounded shadow-lg",
            card.unitClass === 'spy' && "bg-purple-700 text-white",
            card.unitClass === 'assault' && "bg-red-700 text-white",
            card.unitClass === 'support' && "bg-green-700 text-white"
          )}>
            {card.unitClass === 'assault' && 'ШТМ'}
            {card.unitClass === 'support' && 'ПДД'}
            {card.unitClass === 'spy' && 'ШПН'}
          </span>
        </div>
      )}
      
      {card.bonusClass === 'aerial' && (
        <div className="absolute top-2 left-2">
          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded shadow-lg bg-sky-600 text-white">
            АВА
          </span>
        </div>
      )}
    </motion.div>
  );
}
