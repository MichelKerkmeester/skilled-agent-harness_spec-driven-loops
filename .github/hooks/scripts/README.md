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

`.github/hooks/scripts/` holds the shell wrappers that connect GitHub Copilot CLI hook events to the spec-kit Copilot hook handlers. Each wrapper reads the hook payload from stdin, resolves the repository root and pipes the payload into a compiled Node handler under `system-spec-kit`. When the compiled handler is present the wrappers forward to it and do nothing else. When it is absent each wrapper runs a built-in fallback so the hook still returns useful output.

Current state:

- Both wrappers run `set -euo pipefail` and capture stdin to a temp file that an `EXIT` trap removes.
- Both resolve the repository root with `git rev-parse --show-toplevel` and fall back to the current directory.
- The handlers live in `system-spec-kit/mcp-server/dist/hooks/copilot/`. The wrappers forward to them when built.
- Fallback when the handler is missing is not a no-op: `session-start.sh` prints a synthetic startup snapshot to stdout, and `user-prompt-submitted.sh` writes a fallback context block to `.github/copilot-instructions.md` (override the path with `SPECKIT_COPILOT_INSTRUCTIONS_PATH`), creating the parent directory if needed, then prints `{}`.

---

## 2. DIRECTORY TREE

```text
scripts/
+-- session-start.sh            # Forwards the session-start event
`-- user-prompt-submitted.sh    # Forwards the user-prompt-submit event
```

---

## 3. KEY FILES

| File | Forwards to | Fallback when handler is missing |
|---|---|---|
| `session-start.sh` | `system-spec-kit/mcp-server/dist/hooks/copilot/session-prime.js` | Prints a synthetic startup snapshot to stdout |
| `user-prompt-submitted.sh` | `system-spec-kit/mcp-server/dist/hooks/copilot/user-prompt-submit.js` | Writes a context block to `.github/copilot-instructions.md` (or `SPECKIT_COPILOT_INSTRUCTIONS_PATH`), then prints `{}` |

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
        +-- handler built?  --> node dist/hooks/copilot/<handler>.js < payload
        |
        `-- handler missing? --> fallback:
              session-start.sh        -> print startup snapshot to stdout
              user-prompt-submitted.sh -> write .github/copilot-instructions.md, print {}
        |
        v
temp file removed by EXIT trap
```

---

## 5. RELATED

- [`../../workflows/README.md`](../../workflows/README.md)
- [`../../../.opencode/skills/system-spec-kit/SKILL.md`](../../../.opencode/skills/system-spec-kit/SKILL.md)
