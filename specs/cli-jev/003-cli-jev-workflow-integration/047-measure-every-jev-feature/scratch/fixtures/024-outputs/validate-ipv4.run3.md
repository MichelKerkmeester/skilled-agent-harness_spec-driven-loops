```js
function isValidIPv4(s) {
  if (typeof s !== 'string' || s.length === 0) return false;

  const octets = s.split('.');
  if (octets.length !== 4) return false;

  for (const octet of octets) {
    if (!/^(0|[1-9]\d{0,2})$/.test(octet)) return false;
    if (Number(octet) > 255) return false;
  }

  return true;
}
```
