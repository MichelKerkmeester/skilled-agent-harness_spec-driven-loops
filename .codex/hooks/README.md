---
title: "Codex Hook Discovery Mirror"
description: "Discovery-only symlinks for the repository's Codex hook scripts; runtime wiring remains in .codex/hooks.json and points to real .opencode paths."
---
# Codex Hook Discovery Mirror

> A filesystem index of Codex hook entrypoints, not the runtime wiring source.

## 1. OVERVIEW

`.codex/hooks/` contains 16 symlinks to hook scripts owned under `.opencode/`. `mcp-route-guard.cjs`, `dispatch-preflight-lint.mjs`, `dispatch-audit-posttooluse.mjs`, and `post-edit-quality.cjs` target `.opencode/hooks/` (the fully-portable guard cores, see [`hooks/README.md`](../../.opencode/hooks/README.md)); the rest target their owning skill under `.opencode/skills/`. Codex executes the real paths declared in `.codex/hooks.json`. The user-global Codex hook file is managed separately by the repository installer and should not be repointed to this mirror.

Two compiled ESM adapters do not execute through their symlink because their direct-entry guards compare the invocation path with the resolved module URL. Invoke those files through the real command path used by `hooks.json`.

## 2. ENTRYPOINT BEHAVIOR

| Script | Through Mirror | Through Real Path |
|--------|----------------|-------------------|
| `session-start.js` | No output | Valid `SessionStart` envelope |
| `user-prompt-submit.js` | No output | Valid `UserPromptSubmit` envelope |
| Other 14 scripts | Matches real-path behavior | Authoritative runtime behavior |

## 3. INVENTORY

| Group | Files |
|-------|-------|
| Session lifecycle | `session-start.js`, `session-stop.js`, `session-cleanup.sh`, `compact-inject.js`, `user-prompt-submit.js` |
| Spec and completion gates | `spec-gate-classify.mjs`, `spec-gate-enforce.mjs`, `completion-evidence-stop.cjs` |
| Dispatch and MCP guards | `dispatch-preflight-lint.mjs`, `dispatch-audit-posttooluse.mjs`, `mcp-route-guard.cjs` |
| Edit quality | `post-edit-quality.cjs` |
| Repository hygiene | `worktree-guard.sh`, `check-git-hooks.sh`, `check-dist-staleness.sh` |

## 4. VALIDATION

```bash
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .codex/hooks/README.md
```

Expected result: exit 0 with zero document issues.

```bash
node .opencode/bin/install-codex-hooks.mjs --check
```

Expected result: the managed Codex hook installation reports no drift.

## 5. RELATED RESOURCES

- [Codex project hook wiring](../hooks.json)
- [Claude mirror](../../.claude/hooks/README.md)
- [Cursor mirror](../../.cursor/hooks/README.md)
- [Devin mirror](../../.devin/hooks/README.md)
- [Injection contract](../../.opencode/skills/system-spec-kit/references/hooks/injection-contract.md): what each of these hooks actually injects, on which event, and whether it is visible to the human by default
- [Runtime hooks tree](../../.opencode/hooks/README.md): the four fully-portable guard cores this mirror points at outside `.opencode/skills/`
