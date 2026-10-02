```js
const { scaleWords } = require('../../config/number-scales.json');

function intToWords(n) {
  const ones = [
    'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
    'seventeen', 'eighteen', 'nineteen',
  ];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  function under1000(value) {
    const parts = [];
    if (value >= 100) {
      parts.push(ones[Math.floor(value / 100)] + ' hundred');
      value %= 100;
    }
    if (value >= 20) {
      const ten = tens[Math.floor(value / 10)];
      const one = value % 10;
      parts.push(one === 0 ? ten : ten + '-' + ones[one]);
    } else if (value > 0) {
      parts.push(ones[value]);
    }
    return parts.join(' ');
  }

  if (n === 0) return 'zero';

  const groups = [];
  let value = n;
  let scale = 0;

  while (value > 0) {
    const chunk = value % 1000;
    if (chunk !== 0) {
      const words = under1000(chunk);
      groups.unshift(scale === 0 ? words : words + ' ' + scaleWords[scale]);
    }
    value = Math.floor(value / 1000);
    scale += 1;
  }

  return groups.join(' ');
}
```
