---
title: "hooks: Git Preflight Advisory Runtime Adapters"
description: "Advisory-only git command preflight delivery across Claude, Codex, Devin, Cursor, OpenCode, and Pi."
trigger_phrases:
  - "git preflight advisory hook"
  - "git advisory runtime matrix"
  - "SKGIT_ADVISORY"
  - "git hook fail open"
---

# hooks: Git Preflight Advisory Runtime Adapters

---

## 1. OVERVIEW

The git preflight advisory evaluates a shell command before it runs and surfaces surprising git behavior without changing the command's permission or exit path. The primary hook accepts Claude's `Bash` payload and Codex/Devin's `exec` payload. Cursor, OpenCode, and Pi adapt their native tool events onto the same hard-rule parser, 17 checks, and lazy git context.

This layer is advisory only. Any malformed payload, missing rule file, non-repository directory, subprocess timeout, import error, or adapter failure becomes silence or approval. Enforcement remains the responsibility of git's own behavior and the repository's commit and push hooks.

---

## 2. ARCHITECTURE

```text
╭────────────────────────────────────────────────────────────────────╮
│ Claude Bash · Codex/Devin exec · Cursor Shell · OpenCode/Pi bash   │
╰────────────────────────────────────────────────────────────────────╯
                              │
                  runtime payload normalization
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│ readHardRules + evaluate                                           │
│ GIT_SHAPE + GIT_CHECKS + createGitContext                          │
└────────────────────────────────────────────────────────────────────┘
                              │
             up to 3 findings + omitted-count line
                              │
          ┌───────────────┬───────────────┬────────────────┐
          ▼               ▼               ▼                ▼
  hook context JSON   Cursor proxy    Pi reason     OpenCode next-turn
  Claude/Codex/Devin  stdout verbatim  no block      system context
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `git-preflight-advisory.mjs` | Shared stdin hook for `Bash` and `exec` payloads. Reads the repository from payload `cwd` or the runtime project-directory environment. |
| `../lib/git-rule-checks.mjs` | Shared git shape gate, parser, and 17 checks. |
| `../lib/git-context.mjs` | Shared lazy repository-state collector. |
| `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | Maintained shared adapter registered for Cursor `Shell` payloads; it forwards advisory stdout verbatim. |
| `.opencode/plugins/mk-git-preflight-advisory.js` | Evaluates OpenCode `bash` calls and drains bounded findings into `experimental.chat.system.transform` on the next turn. It never prints to plugin stdout or stderr. |
| `.pi/extensions/git-preflight-advisory.ts` | Evaluates Pi `bash` tool calls and returns a warning `reason` without `block: true`. |

---

## 4. RUNTIME MATRIX

| Runtime | Tool shape | Adapter or entrypoint | Registration |
|---|---|---|---|
| Claude Code | `tool_name: Bash` | `git-preflight-advisory.mjs` | `.claude/settings.json` `PreToolUse` wiring |
| Codex | `tool_name: exec` | `git-preflight-advisory.mjs` | `.codex/hooks.json` pre-tool wiring |
| Devin | `tool_name: exec` | `git-preflight-advisory.mjs` | `.devin/hooks.v1.json` `PreToolUse`, matcher `^exec$` |
| Cursor | `tool_name: Shell` | `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | `.cursor/hooks.json` `preToolUse`, matcher `Shell` |
| OpenCode | `tool: bash` | `.opencode/plugins/mk-git-preflight-advisory.js` | OpenCode plugin discovery under `.opencode/plugins/` |
| Pi | `toolName: bash` | `.pi/extensions/git-preflight-advisory.ts` | Pi extension discovery under `.pi/extensions/` |

OpenCode plugins cannot print because stdout or stderr overlays the TUI prompt line. Its adapter therefore buffers at most 20 advisory events and injects each once through the strongest existing legal channel, `experimental.chat.system.transform`. The advisory reaches the agent on the next transform after the command event; the command itself is never delayed or blocked.

OpenCode discovers plugins solely from `.opencode/plugins/`, so `mk-git-preflight-advisory.js` must live there. For cross-runtime browsability, `scripts/hooks/opencode/mk-git-preflight-advisory.js` is a relative symlink pointing back into `.opencode/plugins/` — nothing loads through it (the reverse of Pi's `.pi/extensions/` direction, where the symlink is the load path).

---

## 5. SUPPRESSION

Three suppression levels are resolved before repository state is collected:

| Setting | Effect |
|---|---|
| `SKGIT_ADVISORY=0` | Silence every git preflight advisory. `false` and `off` are equivalent, case-insensitively. |
| `SKGIT_ADVISORY_SKIP=commit` | Silence every rule whose ID starts with `commit-`. |
| `SKGIT_ADVISORY_SKIP=add-pathspec-only-ignored` | Silence one exact rule ID. |

`SKGIT_ADVISORY_SKIP` accepts comma-separated tokens. A token matches either a complete rule ID or an ID prefix followed by `-`.

---

## 6. FAIL-OPEN GUARANTEES

- Non-git commands stop at the shared `GIT_SHAPE` gate.
- Missing or malformed stdin produces no advisory and exits successfully.
- Missing hard-rule frontmatter produces an empty rule set.
- A check that throws is swallowed by the shared evaluator.
- Git subprocess failures and timeouts return safe unknown values.
- Cursor proxy spawn failures produce no output.
- Pi catches import and evaluation errors and returns `undefined`.
- OpenCode catches evaluation and transform errors, never throws, and never writes stdout or stderr.
- Every surfaced result is warning-only and capped at three findings plus one omitted-count line.

---

## VALIDATION

Run from the repository root.

```bash
node --test .opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs
node --check .opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs
node --check .opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs
node --check .opencode/plugins/mk-git-preflight-advisory.js
node -e "JSON.parse(require('node:fs').readFileSync('.cursor/hooks.json', 'utf8')); JSON.parse(require('node:fs').readFileSync('.devin/hooks.v1.json', 'utf8'))"
```

For stdin smoke tests, create a temporary repository with hooks disabled, then pass `Bash`, `exec`, and Cursor `Shell` payloads containing `git commit --only <dir> -m x`. The dirty scoped repository must advise; a non-git command and an ordinary commit in a clean repository must stay silent.

---

## RELATED

- [`../lib/README.md`](../lib/README.md)
- [`../../SKILL.md`](../../SKILL.md)
