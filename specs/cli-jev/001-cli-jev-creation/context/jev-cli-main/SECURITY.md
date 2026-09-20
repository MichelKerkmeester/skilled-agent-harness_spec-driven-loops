# Security Policy

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability or exposed credential.

Report vulnerabilities through [GitHub private vulnerability reporting](https://github.com/tumf/jev-cli/security/advisories/new). Include the affected version, reproduction steps, and potential impact.

API keys are sent to the selected provider endpoint, or to an explicitly configured endpoint override. The official TypeSafe API remains the default. Vercel AI Gateway, OpenRouter, and custom proxies use separate keys and endpoints. A custom proxy receives `JEV_API_KEY` through the bearer authorization header; configure only a trusted HTTPS endpoint. Keep API keys out of shell history and repository files.
