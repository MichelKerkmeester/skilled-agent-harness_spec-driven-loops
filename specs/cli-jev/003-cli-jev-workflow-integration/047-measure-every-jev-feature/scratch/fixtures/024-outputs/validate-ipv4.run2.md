```js
function isValidIPv4(s) {
  if (typeof s !== 'string' || s.length === 0) return false;

  const octets = s.split('.');
  if (octets.length !== 4) return false;

  for (const octet of octets) {
    if (octet.length === 0 || octet.length > 3) return false;
    for (let i = 0; i < octet.length; i += 1) {
      const digit = octet[i];
      if (digit < '0' || digit > '9') return false;
    }
    if (octet.length > 1 && octet[0] === '0') return false;
    if (Number(octet) > 255) return false;
  }
  return true;
}
```
