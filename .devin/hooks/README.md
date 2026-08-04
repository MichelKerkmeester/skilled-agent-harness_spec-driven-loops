---
title: "Devin Hook Discovery Mirror"
description: "Discovery-only symlinks for Devin-specific hook adapters; runtime wiring remains in .devin/hooks.v1.json and points to real .opencode paths."
---
# Devin Hook Discovery Mirror

> A filesystem index of Devin hook adapters, not the runtime wiring source.

## 1. OVERVIEW

`.devin/hooks/` contains 13 relative symlinks to Devin adapters owned under `.opencode/`. `mcp-route-guard.cjs`, `dispatch-preflight-lint.mjs`, `dispatch-audit-posttooluse.mjs`, `post-edit-quality.cjs`, and `task-dispatch-guard.cjs` target `.opencode/hooks/` (the fully-portable guard cores, see [`hooks/README.md`](../../.opencode/hooks/README.md)); the rest target their owning skill under `.opencode/skills/`. Devin executes the real paths declared in `.devin/hooks.v1.json`. The mirror exists for discovery and direct comparison across runtimes.

The current registration is live under `devin -p` when events are top-level arrays with nested matcher groups. Six lifecycle events have fired in a corrected-schema session. `PermissionRequest` and `PostCompaction` remain unobserved because those events did not occur.

## 2. INVENTORY

| Group | Files |
|-------|-------|
| Session lifecycle | `session-start.js`, `session-stop.js`, `user-prompt-submit.js`, `post-compaction.cjs`, `completion-evidence-stop.cjs` |
| Spec and dispatch gates | `spec-gate-classify.mjs`, `spec-gate-enforce.mjs`, `task-dispatch-guard.cjs` |
| Tool and quality adapters | `dispatch-preflight-lint.mjs`, `dispatch-audit-posttooluse.mjs`, `post-edit-quality.cjs`, `mcp-route-guard.cjs` |

The three `.js` links target compiled `mcp-server/dist/` output. A fresh checkout must build that package before those links resolve.

## 3. WIRING AND CAVEATS

- `.devin/hooks.v1.json` is the runtime authority and contains 8 events, 11 matcher groups and 19 commands.
- `run_subagent` did not occur in the captured session, so `task-dispatch-guard.cjs` remains directly tested but not live-observed.
- No external non-`mk_` MCP family is currently registered under Devin, so the route guard has no applicable live call yet.
- No block-severity fixture exists, so the dispatch deny branch remains structurally tested rather than proven end to end.

## 4. VALIDATION

```bash
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .devin/hooks/README.md
```

Expected result: exit 0 with zero document issues.

```bash
node -e "const d=require('./.devin/hooks.v1.json'); console.log(Object.keys(d).length)"
```

Expected result: `8`.

## 5. RELATED RESOURCES

- [Devin runtime wiring](../hooks.v1.json)
- [Claude mirror](../../.claude/hooks/README.md)
- [Codex mirror](../../.codex/hooks/README.md)
- [Cursor mirror](../../.cursor/hooks/README.md)
- [Canonical live evidence](../../.opencode/specs/cli-external-orchestration/029-cli-devin-revival/hook-testing-results.md)
- [Injection contract](../../.opencode/hooks/injection-contract.md): what each of these hooks actually injects, on which event, and whether it is visible to the human by default
- [Runtime hooks tree](../../.opencode/hooks/README.md): the five fully-portable guard cores this mirror points at outside `.opencode/skills/`
