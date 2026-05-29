/**
 * Character cards with their point values
 * Ram = 1000 (the player who makes the guess)
 * Seetha = 0 (the player who gets the income if Ram guesses wrong)
 */
export const CHARACTER_CARDS = {
  ram: { name: 'Ram', points: 1000 },
  seetha: { name: 'Seetha', points: 0 },
  laxman: { name: 'Laxman', points: 900 },
  hanuman: { name: 'Hanuman', points: 800 },
  bharath: { name: 'Bharath', points: 700 },
  arjun: { name: 'Arjun', points: 600 },
};

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {array} array - Array to shuffle
 * @returns {array} Shuffled array
 */
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Assign character cards to players
 * Distributes unique characters to each player for a round
 * @param {array} players - Array of player objects with socket IDs
 * @returns {object} Object mapping player socket IDs to their character cards
 */
export const assignCharacterCards = (players) => {
  const requiredCharacters = ['ram', 'seetha'];
  const remainingCharacters = Object.keys(CHARACTER_CARDS).filter(
    (character) => !requiredCharacters.includes(character)
  );

  const playerCards = {};
  const selectedCharacters = [...requiredCharacters];

  // Add random characters until we have enough for all players
  while (selectedCharacters.length < players.length) {
    const randomIndex = Math.floor(Math.random() * remainingCharacters.length);
    selectedCharacters.push(remainingCharacters.splice(randomIndex, 1)[0]);
  }

  const shuffledCharacters = shuffleArray(selectedCharacters);

  players.forEach((player, index) => {
    playerCards[player.socketId] = shuffledCharacters[index];
  });

  return playerCards;
};

/**
 * Get card details for a player
 * @param {string} cardKey - The character key (ram, seetha, etc.)
 * @returns {object} Character card details
 */
export const getCardDetails = (cardKey) => {
  return CHARACTER_CARDS[cardKey] || null;
};
