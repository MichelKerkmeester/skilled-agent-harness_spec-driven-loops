---
title: "Cursor Hook Discovery Mirror"
description: "Discovery-only symlinks for the repository's Cursor hook scripts; runtime wiring remains in .cursor/hooks.json and points to real .opencode paths."
---
# Cursor Hook Discovery Mirror

> A filesystem index of Cursor hook entrypoints, not the runtime wiring source.

## 1. OVERVIEW

`.cursor/hooks/` contains 15 symlinks after including the session-start spec-gate prebind. `mcp-route-guard.mjs` and `task-dispatch-guard.mjs` target `.opencode/runtime-hooks/` (the fully-portable guard cores, see [`runtime-hooks/README.md`](../../.opencode/runtime-hooks/README.md)); the rest target their owning skill under `.opencode/skills/`. Cursor executes the real paths declared in `.cursor/hooks.json`, not this discovery mirror.

Four compiled ESM lifecycle adapters do not execute through their symlink because `runCursorHook()` compares the invocation path with the resolved module URL. Plain `.mjs` proxies do not use that guard, but all runtime wiring stays on one consistent set of real paths.

## 2. ENTRYPOINT BEHAVIOR

| Script | Through Mirror | Through Real Path |
|--------|----------------|-------------------|
| `session-start.js` | No output | Valid Cursor hook response |
| `session-end.js` | No output | Valid Cursor hook response |
| `user-prompt-submit.js` | No output | Valid Cursor hook response |
| `precompact.js` | No output | Valid Cursor hook response |
| Plain `.mjs` and shell files | Matches real-path behavior | Authoritative runtime behavior |

## 3. INVENTORY

| Group | Files |
|-------|-------|
| Session lifecycle | `session-start.js`, `session-end.js`, `session-cleanup.sh`, `precompact.js`, `user-prompt-submit.js` |
| Spec and dispatch gates | `spec-gate-prebind.mjs`, `spec-gate-classify.mjs`, `spec-gate-enforce.mjs`, `task-dispatch-guard.mjs` |
| Tool and MCP proxies | `post-tool-use.mjs`, `mcp-route-guard.mjs` |
| Repository hygiene | `worktree-guard.sh`, `check-git-hooks.sh`, `check-dist-staleness.sh`, `install-codex-hooks.mjs` |

`mcp-route-guard.mjs` recombines Cursor's split `mcp_server_name` and bare `tool_name` fields before delegating to the shared route-guard policy.

`spec-gate-prebind.mjs` is wired on `sessionStart` through its real path. Its mirror is discovery-only, like every other entry here.

## 4. VALIDATION

```bash
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .cursor/hooks/README.md
```

Expected result: exit 0 with zero document issues.

```bash
test -L .cursor/hooks/mcp-route-guard.mjs && test -e .cursor/hooks/mcp-route-guard.mjs
```

Expected result: exit 0, proving the discovery link exists and resolves.

## 5. RELATED RESOURCES

- [Cursor hook wiring](../hooks.json)
- [Claude mirror](../../.claude/hooks/README.md)
- [Codex mirror](../../.codex/hooks/README.md)
- [Devin mirror](../../.devin/hooks/README.md)
- [Injection contract](../../.opencode/skills/system-spec-kit/references/hooks/injection-contract.md): what each of these hooks actually injects, on which event, and whether it is visible to the human by default
- [Runtime hooks tree](../../.opencode/runtime-hooks/README.md): the two fully-portable guard cores this mirror points at outside `.opencode/skills/`
