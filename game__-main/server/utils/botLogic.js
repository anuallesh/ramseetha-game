/**
 * Bot Logic for RamSeetha Game
 * Handles bot decisions and behavior
 */

/**
 * Generate a random bot name
 * @returns {string} Random bot name
 */
export const generateBotName = () => {
  const botNames = [
    'Bot Vishnu', 'Bot Shiva', 'Bot Brahma',
    'Bot Indra', 'Bot Yama', 'Bot Vayu',
    'Bot Agni', 'Bot Surya', 'Bot Chandra'
  ];
  return botNames[Math.floor(Math.random() * botNames.length)];
};

/**
 * Bot makes a guess about who has Seetha
 * Uses random selection to make the guess unpredictable
 * @param {array} players - Array of player objects
 * @param {string} ramSocketId - Socket ID of Ram player
 * @returns {object} Guessed player object
 */
export const makeBotGuess = (players, ramSocketId) => {
  // Filter out Ram (the guesser)
  const otherPlayers = players.filter(p => p.socketId !== ramSocketId);
  
  if (otherPlayers.length === 0) {
    return null;
  }
  
  // Random guess
  const randomGuess = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
  return randomGuess;
};

/**
 * Check if a player is a bot
 * @param {object} player - Player object
 * @returns {boolean} True if player is a bot
 */
export const isBot = (player) => {
  return player.isBot === true;
};

/**
 * Create bot player object
 * @param {number} botIndex - Index of the bot (1, 2, 3, etc.)
 * @returns {object} Bot player object
 */
export const createBotPlayer = (botIndex) => {
  return {
    socketId: `bot_${botIndex}_${Date.now()}`,
    name: generateBotName(),
    joinedAt: Date.now(),
    isHost: false,
    isBot: true,
  };
};
