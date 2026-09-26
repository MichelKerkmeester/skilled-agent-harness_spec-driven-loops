# Security

## Reporting a vulnerability

Please do not open a public issue for security problems. Use GitHub's private
vulnerability reporting on this repository ("Report a vulnerability" under the
Security tab), or email the maintainer listed in `package.json`. You should get
an acknowledgement within a few days.

## Scope and notes

- jev-cli sends the text you pass it (claims, evidence, screened content,
  candidates, state) to the configured provider: TypeSafe, OpenRouter, or
  Cloudflare. Do not pass secrets or data you are not allowed to send to those
  services. `--dry-run` shows exactly what would be sent.
- API keys come from environment variables or from `jev auth login`, which
  stores them in the OS keychain (macOS Keychain, Linux Secret Service) or, when
  no keychain is available, in `~/.config/jev/credentials.json` with mode 0600.
  The config file never stores keys. `jev config` and `jev auth status` print
  keys masked.
- Third-party proxies (OpenRouter, Cloudflare) add a hop; direct TypeSafe is
  the recommended default.
- Supported versions: the latest published minor release receives fixes.
