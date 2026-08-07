# XSS Cheatsheet (internal)

Payloads our WAF must block. These are documented as text, never executed.

## Classic
- `<script>alert(1)</script>`
- `<img src=x onerror=alert(document.cookie)>`

## Attribute break-out
- `" onmouseover="alert(1)`
