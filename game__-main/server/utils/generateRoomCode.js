/**
 * Generate a unique 6-digit room code
 * @returns {string} A unique room code
 */
export const generateRoomCode = () => {
  return Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();
};

/**
 * Validate if room code format is correct
 * @param {string} code - The room code to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidRoomCode = (code) => {
  return /^[A-Z0-9]{6}$/.test(code);
};
