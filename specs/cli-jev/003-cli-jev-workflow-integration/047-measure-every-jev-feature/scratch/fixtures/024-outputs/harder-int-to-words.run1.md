```js
function intToWords(n) {
  if (n === 0) return 'zero';

  const ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const scales = ['', ' thousand', ' million', ' billion'];

  function underThousand(value) {
    const parts = [];
    const hundreds = Math.floor(value / 100);
    const rest = value % 100;
    if (hundreds > 0) parts.push(ones[hundreds] + ' hundred');
    if (rest >= 20) {
      const tensDigit = Math.floor(rest / 10);
      const onesDigit = rest % 10;
      parts.push(onesDigit === 0 ? tens[tensDigit] : tens[tensDigit] + '-' + ones[onesDigit]);
    } else if (rest > 0) {
      parts.push(ones[rest]);
    }
    return parts.join(' ');
  }

  const groups = [];
  let rest = n;
  while (rest > 0) {
    groups.push(rest % 1000);
    rest = Math.floor(rest / 1000);
  }

  const words = [];
  for (let i = groups.length - 1; i >= 0; i -= 1) {
    if (groups[i] === 0) continue;
    words.push(underThousand(groups[i]) + scales[i]);
  }
  return words.join(' ');
}
```
