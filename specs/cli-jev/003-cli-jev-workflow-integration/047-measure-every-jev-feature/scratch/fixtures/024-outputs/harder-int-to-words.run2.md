```js
function intToWords(n) {
  if (n === 0) return 'zero';

  const belowTwenty = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tensWords = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const scaleWords = ['thousand', 'million', 'billion'];

  function chunkToWords(chunk) {
    if (chunk === 0) return '';
    const parts = [];
    const hundreds = Math.floor(chunk / 100);
    if (hundreds > 0) parts.push(belowTwenty[hundreds] + ' hundred');
    const remainder = chunk % 100;
    if (remainder >= 20) {
      const tensDigit = Math.floor(remainder / 10);
      const onesDigit = remainder % 10;
      parts.push(onesDigit === 0 ? tensWords[tensDigit] : tensWords[tensDigit] + '-' + belowTwenty[onesDigit]);
    } else if (remainder > 0) {
      parts.push(belowTwenty[remainder]);
    }
    return parts.join(' ');
  }

  const chunks = [];
  let rest = n;
  let scale = 0;
  while (rest > 0) {
    const chunk = rest % 1000;
    if (chunk > 0) {
      const words = chunkToWords(chunk);
      chunks.push(scale === 0 ? words : words + ' ' + scaleWords[scale - 1]);
    }
    rest = Math.floor(rest / 1000);
    scale += 1;
  }
  return chunks.reverse().join(' ');
}
```
