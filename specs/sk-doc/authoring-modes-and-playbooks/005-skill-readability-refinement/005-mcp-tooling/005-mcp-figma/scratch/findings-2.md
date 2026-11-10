### .skilled/skills/mcp-tooling/mcp-figma/references/troubleshooting.md

- [P2] .skilled/skills/mcp-tooling/mcp-figma/references/troubleshooting.md:24 | 4 | The overview opens with Core Principle and puts When to Use second; the reference template orders Purpose, When to Use, Core Principle, and this file has no Purpose at all. | Insert after line 23:
  ```markdown
  ### Purpose

  This reference lets a reader resolve a `figma-ds-cli` failure at its cause, with the fix or escalation that matches the symptom.
  ```
  Then move lines 28-31 (the `### When to Use` heading and its two bullets) to immediately before line 24 (`### Core Principle`).

- [P2] .skilled/skills/mcp-tooling/mcp-figma/references/troubleshooting.md:39 | 6 | The two hard facts that frame every fix sit after Key Sources, so the source list interrupts the overview before the facts a reader needs. | Move lines 39-42 (the `Two hard facts shape every fix below:` sentence and its two bullets) to immediately before line 33 (`### Key Sources`).

- [P2] .skilled/skills/mcp-tooling/mcp-figma/references/troubleshooting.md:310 | 7 | The daemon overview packs the endpoint, auth header, token path, PID file, idle timeout and reboot persistence into one paragraph, so the daemon model cannot be scanned. | Replace line 310 with:
  ```markdown
  The daemon is a local HTTP server, not a Unix socket:

  - **Endpoint**: `127.0.0.1:3456`.
  - **Auth**: the `X-Daemon-Token` header (`~/.figma-ds-cli/.daemon-token`).
  - **PID file**: `~/.figma-cli-daemon.pid`.
  - **Lifetime**: an idle timeout (~60 min), with no reboot persistence.

  Recovery order is always **status -> diagnose -> restart -> reconnect**.
  ```

- [P2] .skilled/skills/mcp-tooling/mcp-figma/references/troubleshooting.md:330 | 5 | The `Never auto-delete the token` trust rule sits after the diagnose/restart Fix block it governs, so a reader can run the recovery steps without seeing the credential rule. | Move the blockquote at line 330 to immediately before line 323 (`**Fix**:`).
