/**
 * Calculate scores for a round based on Ram's guess
 * @param {object} gameState - Current game state
 * @param {string} ramGuess - The socket ID of the player Ram guessed to have Seetha
 * @returns {object} Score updates for all players
 */
export const calculateRoundScores = (gameState) => {
  const { playerCards, ramGuess, players } = gameState;
  
  // Find who has the Seetha card
  let seethaPlayer = null;
  for (const [socketId, character] of Object.entries(playerCards)) {
    if (character === 'seetha') {
      seethaPlayer = socketId;
      break;
    }
  }

  // Find who has the Ram card
  let ramPlayer = null;
  for (const [socketId, character] of Object.entries(playerCards)) {
    if (character === 'ram') {
      ramPlayer = socketId;
      break;
    }
  }

  const roundScores = {};

  // Initialize all players with their character points
  Object.entries(playerCards).forEach(([socketId, character]) => {
    roundScores[socketId] = getCharacterPoints(character);
  });

  // Handle Ram's guess
  if (ramGuess === seethaPlayer) {
    // Ram guessed correctly
    roundScores[ramPlayer] = 1000; // Ram gets 1000
    roundScores[seethaPlayer] = 0; // Seetha gets 0
  } else {
    // Ram guessed wrong
    roundScores[ramPlayer] = 0; // Ram gets 0
    roundScores[seethaPlayer] = 1000; // Seetha gets 1000
  }

  return {
    roundScores,
    ramCorrect: ramGuess === seethaPlayer,
    correctSeethaPlayer: seethaPlayer,
    ramPlayer,
  };
};

/**
 * Get character's base points
 * @param {string} character - Character key
 * @returns {number} Points value
 */
const getCharacterPoints = (character) => {
  const points = {
    ram: 1000,
    seetha: 0,
    laxman: 900,
    hanuman: 800,
    bharath: 700,
    arjun: 600,
  };
  return points[character] || 0;
};

/**
 * Calculate final scores and determine winner
 * @param {object} playerScores - Total scores for all players
 * @returns {object} Winner info and sorted players
 */
export const calculateFinalWinner = (playerScores) => {
  const sortedPlayers = Object.entries(playerScores)
    .map(([socketId, score]) => ({
      socketId,
      score,
    }))
    .sort((a, b) => b.score - a.score);

  return {
    winner: sortedPlayers[0],
    runners_up: sortedPlayers.slice(1),
    sortedPlayers,
  };
};

/**
 * Update cumulative player scores
 * @param {object} currentScores - Current total scores
 * @param {object} roundScores - Scores from this round
 * @returns {object} Updated cumulative scores
 */
export const updateCumulativeScores = (currentScores, roundScores) => {
  const updated = { ...currentScores };
  
  Object.entries(roundScores).forEach(([socketId, points]) => {
    updated[socketId] = (updated[socketId] || 0) + points;
  });

  return updated;
};
