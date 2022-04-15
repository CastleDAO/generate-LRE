function ifProbability(number) {
  // returns callback executed if probability is true
  // Number between 0 and 1
  const probability = number * 100;

  const result = Math.random() * 100;

  return function (callback) {
    // If the result is less than the probability, it works
    if (result < probability) {
      return callback();
    }

    return null;
  };
}

function getRandomItemFromArray(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
  ifProbability,
  getRandomIntFromInterval,
  getRandomItemFromArray,
};
