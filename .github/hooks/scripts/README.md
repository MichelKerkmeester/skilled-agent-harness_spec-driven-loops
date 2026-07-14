---
title: "GitHub hooks scripts: Copilot CLI hook wrappers"
description: "Shell wrappers that forward GitHub Copilot CLI hook events to the spec-kit Copilot hook handlers."
trigger_phrases:
  - "copilot cli hook scripts"
  - "session start hook wrapper"
  - "user prompt submitted hook"
---

# GitHub hooks scripts: Copilot CLI hook wrappers

---

## 1. OVERVIEW

`.github/hooks/scripts/` holds the shell wrappers that connect GitHub Copilot CLI hook events to the spec-kit Copilot hook handlers. Each wrapper reads the hook payload from stdin, resolves the repository root and pipes the payload into a compiled Node handler under `system-spec-kit`. If the compiled handler is absent, the wrapper exits without error, so a checkout that has not built the spec-kit server does not break the hook.

Current state:

- Both wrappers run `set -euo pipefail` and capture stdin to a temp file that an `EXIT` trap removes.
- Both resolve the repository root with `git rev-parse --show-toplevel` and fall back to the current directory.
- The handlers live in `system-spec-kit/mcp_server/dist/hooks/copilot/`, so these wrappers stay thin and forward only.

---

## 2. DIRECTORY TREE

```text
scripts/
+-- session-start.sh            # Forwards the session-start event
`-- user-prompt-submitted.sh    # Forwards the user-prompt-submit event
```

---

## 3. KEY FILES

| File | Forwards to |
|---|---|
| `session-start.sh` | `system-spec-kit/mcp_server/dist/hooks/copilot/session-prime.js` |
| `user-prompt-submitted.sh` | `system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js` |

---

## 4. DATA FLOW

```text
Copilot CLI hook event
        |
        v
wrapper reads stdin to a temp file
        |
        v
cd to repository root
        |
        v
node dist/hooks/copilot/<handler>.js < payload   (only if the handler exists)
        |
        v
temp file removed by EXIT trap
```

---

## 5. RELATED

- [`../../workflows/README.md`](../../workflows/README.md)
- [`../../../.opencode/skills/system-spec-kit/SKILL.md`](../../../.opencode/skills/system-spec-kit/SKILL.md)
