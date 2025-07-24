/**
 * Creates a delay for the specified duration
 * @param {number} ms - Duration in milliseconds
 * @returns {Promise} Promise that resolves after the specified time
 */
export const delay = (ms = 300) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export default delay;