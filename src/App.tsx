/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Hallway } from './components/Hallway';
import { SweatRoom } from './components/SweatRoom';
import { BrotherRoom } from './components/BrotherRoom';
import { LickRoom } from './components/LickRoom';

type Room = 'sweat' | 'brother' | 'lick' | null;

export default function App() {
  const [currentRoom, setCurrentRoom] = useState<Room>(null);

  const handleEnterRoom = (room: Room) => {
    setCurrentRoom(room);
  };

  const handleBack = () => {
    setCurrentRoom(null);
  };

  return (
    <div className="w-full min-h-screen bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        {currentRoom === null && (
          <motion.div
            key="hallway"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <Hallway onEnterRoom={handleEnterRoom} />
          </motion.div>
        )}
        
        {currentRoom === 'sweat' && (
          <motion.div
            key="sweat"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <SweatRoom onBack={handleBack} />
          </motion.div>
        )}

        {currentRoom === 'brother' && (
          <motion.div
            key="brother"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <BrotherRoom onBack={handleBack} />
          </motion.div>
        )}

        {currentRoom === 'lick' && (
          <motion.div
            key="lick"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <LickRoom onBack={handleBack} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
