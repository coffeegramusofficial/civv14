# Russian Civil War Card Game

## Overview

A 2D Hearthstone-style strategy card game set during the Russian Civil War (1917-1923). Players choose between White Army (Imperial Loyalists) and Red Army (Bolsheviks) factions, building decks and deploying cards in a lane-based tactical battle system. The objective is to destroy the enemy's main tower while defending your own through strategic card placement and combat management. The project aims to deliver an engaging historical strategy game with a focus on tactical depth and faction-specific gameplay.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Core Technologies:** React 18 with TypeScript, Vite, TailwindCSS, Framer Motion, Radix UI.

**State Management:** Zustand for global game state, React Query for server data fetching, React hooks for local component state.

**Game Rendering:** 2D Hearthstone-style interface with lane-based card positioning, responsive layouts using CSS Grid and Flexbox, Framer Motion for animations. Gradient backgrounds and visual effects for faction theming.

**Game Flow:**
- **Menu Phase:** Main menu with faction selection, deck building, and settings.
- **Faction Select Phase:** Choose between White Army or Red Army.
- **Deck Building Phase:** Create and save custom 8-card decks from faction-specific cards.
- **Playing Phase:** Active turn-based gameplay on a lane-based battlefield.
- **Game Over Phase:** Victory/defeat screen with reset capability.

**Game Logic:**
- **Card Types:** Units (assault, support, spy) and Bonuses (medic, engineer, instructor, aerial).
- **Special Units:** Aerial bombardment (attack towers directly), Spy units (attack main tower directly).
- **Battlefield:** Lane-based positioning with three slots per faction.
- **Combat System:** Center lane attacks enemies first, then side towers, then main tower.
- **Resource Management:** Turn-based supply generation (+3 supply per turn), unlimited supply accumulation.
- **Tower Defense:** Main tower (15 HP) and two side towers (10 HP each).
- **Deck Building:** 8 unique cards per deck, supports auto-filling with random cards.
- **Card Rarity:** Common, Rare, Epic, Legendary with visual indicators and animated shimmer for Legendary cards.

**Data Persistence:** LocalStorage for deck persistence with versioning and automatic pruning of old decks.

### Backend Architecture

**Server Framework:** Express.js with TypeScript, integrated with Vite middleware for development.

**API Design:** RESTful endpoints for game session management, including creation, state retrieval, and action processing. Placeholder routes for future multiplayer.

**Storage Layer:** In-memory storage (`MemStorage`) for development, designed with an interface (`IStorage`) for future database integration.

### System Design Choices

- **UI/UX:** Minimalistic design with a focus on visual card representation and intuitive navigation. Military-themed textures and historical artwork. Mobile-responsive deck builder with bottom-heavy controls for accessibility.
- **2D Implementation:** Prioritizes 2D graphics over legacy 3D components for performance and visual consistency.

## External Dependencies

**Database:**
- Drizzle ORM configured for PostgreSQL (`@neondatabase/serverless`).
- Schema defined in `shared/schema.ts` (user table).

**UI Component Libraries:**
- Radix UI for accessible, unstyled primitives (Dialog, Dropdown, Tooltip, Select, etc.).
- `class-variance-authority` for variant styling.
- `cmdk` for command palette functionality.

**Animation:**
- Framer Motion for 2D animations and transitions.

**Build & Development Tools:**
- TypeScript, Vite, PostCSS (with Tailwind and Autoprefixer), `tsx`, `esbuild`.
- Path aliases: `@/` for client source, `@shared/` for shared code.
- Asset handling for audio (MP3, OGG, WAV).
## Recent Changes

**Date:** October 20, 2025 - v.2.15 (Beta) [build 27051]

**UI Consistency & Minimalism:**
- ✅ FactionSelect page redesigned to match minimalistic style of DeckBuilder and Settings
  - Changed from amber gradient theme to solid gray-900 background
  - Simplified faction selection cards with faction-colored borders (blue/red)
  - Consistent typography and button styling across all menu pages
- ✅ GameScreen2D battlefield made more minimalistic
  - Changed from slate gradient to solid gray-900 background
  - Simplified UI elements while preserving all game mechanics
  - Cleaner, less distracting interface for better gameplay focus
  - All card designs and mechanics preserved

**Sound Effects System:**
- ✅ Comprehensive audio feedback implemented throughout the game
  - Click sounds (playClick) for all buttons in MainMenu, FactionSelect, Settings, and GameScreen2D
  - Card slide sounds (playCardSlide) when playing units or applying bonus cards
  - Hit sounds (playHit) when units attack enemy cards
  - All sounds respect the global mute setting
  - Audio system expanded in useAudio store with new playClick and playCardSlide functions

**Card Mechanics Fixes:**
- ✅ Bombardier (Aerial) mechanics fixed
  - Aerial bombardment cards (Илья Муромец) now attack enemy towers directly from hand
  - Towers become clickable targets when aerial card is selected (isBombardTarget)
  - Implemented handleBonusCardOnTower function for direct tower targeting
  - Properly integrated with existing game flow
- ✅ Medic bonus cards functionality fixed
  - Medic cards now properly heal friendly units on the battlefield
  - Board2D correctly identifies friendly units as targets for healing
  - playBonusCard applies heal effect to currentHealth with proper capping at max health

**Branding & Version:**
- ✅ Studio name changed from "Студия Марка Минченко" to "Carbatyshka Studios"
- ✅ Version updated to 2.15 (Beta) [build 27051]

**Date:** October 20, 2025 - v.2.14 (Beta) [build 27041]

**Mobile-Responsive Deck Builder Redesign:**
- ✅ Complete UI redesign inspired by Clash Royale deck collector mechanics
- ✅ Fixed bottom control bar with all primary actions (Menu, Auto-fill, Load, Save, Set Active)
  - Bottom-heavy design for optimal mobile usability
  - Always-visible action buttons regardless of scroll position
  - Deck counter badge displayed prominently at bottom center
- ✅ Responsive card grids with adaptive sizing for all screen sizes
  - Mobile: 3-column available cards grid, 2-column deck grid
  - Tablet/Desktop: 4-column available cards grid, 2-column deck grid
  - Improved touch targets and spacing for mobile devices
- ✅ Flexible height system using calc() for different viewports
- ✅ Auto-loading of default decks when entering deck builder
  - Active_whites and Active_reds decks now load automatically on faction selection
  - Users see their default deck pre-populated instead of empty deck
  - Seamless deck management across faction switches
- ✅ Enhanced mobile accessibility with responsive text sizes and icon scaling
- ✅ Version number updated to 2.14 (Beta) [build 27041] in Settings
