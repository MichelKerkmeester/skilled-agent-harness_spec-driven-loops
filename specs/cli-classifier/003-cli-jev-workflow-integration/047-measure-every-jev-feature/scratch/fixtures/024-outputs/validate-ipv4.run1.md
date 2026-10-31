```js
function isValidIPv4(s) {
  if (typeof s !== 'string') return false;

  const octets = s.split('.');
  if (octets.length !== 4) return false;

  for (const octet of octets) {
    if (!/^(?:0|[1-9][0-9]{0,2})$/.test(octet)) return false;
    if (Number(octet) > 255) return false;
  }
  return true;
}
```
