---
title: "GitHub Hooks: Superset Copilot Webhook Configuration"
description: "Superset Copilot hook integration configuration defining event handlers for session lifecycle and tool use events."
trigger_phrases:
  - "github hooks"
  - "superset-notify"
  - "copilot hook wiring"
  - "superset webhook config"
---

# GitHub Hooks: Superset Copilot Webhook Configuration

> Data-only configuration directory that defines Superset Copilot webhook event routing for session and tool use lifecycle events.

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. KEY FILES](#2--key-files)
- [3. ENTRYPOINTS](#3--entrypoints)
- [4. VALIDATION](#4--validation)
- [5. RELATED](#5--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`.github/hooks/` owns the Superset Copilot webhook configuration that routes session lifecycle events to the Superset hook integration. The folder contains a single JSON configuration file that defines event handlers for the Copilot/Superset integration pipeline.

Current state:

- `superset-notify.json` is the only file. It defines four hook events: `sessionStart`, `sessionEnd`, `userPromptSubmitted` and `postToolUse`.
- Each hook event maps to a bash command invoking the `copilot-hook.sh` wrapper script with the appropriate event argument.
- All hook commands use a 5-second timeout and target user-local Superset hook scripts.
- The consumer test is `tests/copilot-hook-wiring.vitest.ts`, which validates the configuration structure and verifies hook routing.
- The configuration contains an absolute user path (`/Users/michelkerkmeester/.superset/hooks/`) and needs adjustment for different environments.
- No executable code or subdirectories exist in this folder. The configuration is read by test infrastructure only.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:key-files -->
## 2. KEY FILES

| File | Responsibility |
|---|---|
| `superset-notify.json` | Defines the `hooks` object with four Copilot event handler entries, each pointing to the Superset `copilot-hook.sh` wrapper script. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:entrypoints -->
## 3. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `superset-notify.json` | Data | Superset webhook configuration consumed by `tests/copilot-hook-wiring.vitest.ts` for hook wiring validation. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 4. VALIDATION

Run from the repository root.

```bash
cd .opencode/skills/system-spec-kit/mcp_server && npm test -- tests/copilot-hook-wiring.vitest.ts
```

The consumer test contains 4 cases. 2 cases pass (JSON structure validation and the superset-notify wrapper output check). 2 cases fail due to missing local hook build artifacts (`dist/hooks/copilot/session-prime.js` and `dist/hooks/copilot/user-prompt-submit.js`). Run the consumer test to exercise this configuration.

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 5. RELATED

- [Parent: mcp_server](../../README.md)
- [Consumer test: tests/copilot-hook-wiring.vitest.ts](../../tests/copilot-hook-wiring.vitest.ts)
- [Tests](../../tests/README.md)

<!-- /ANCHOR:related -->
