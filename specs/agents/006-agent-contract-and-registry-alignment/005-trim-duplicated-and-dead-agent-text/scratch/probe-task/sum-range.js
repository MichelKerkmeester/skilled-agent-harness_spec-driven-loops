'use strict';

// Returns the sum of the whole numbers from start to end, both included.
function sumRange(start, end) {
  let total = 0;
  for (let n = start; n < end; n += 1) {
    total += n;
  }
  return total;
}

module.exports = { sumRange };
