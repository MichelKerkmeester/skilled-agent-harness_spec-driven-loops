---
title: "Claude Hook Discovery Mirror"
description: "Discovery-only symlinks for the repository's Claude hook scripts; runtime wiring remains in .claude/settings.json and points to real .opencode paths."
---
# Claude Hook Discovery Mirror

> A filesystem index of Claude hook entrypoints, not the runtime wiring source.

## 1. OVERVIEW

`.claude/hooks/` contains 19 symlinks to hook scripts owned under `.opencode/`. Most target their owning skill under `.opencode/skills/`; the four fully-portable guard cores (`dispatch-preflight-lint.mjs`, `dispatch-audit-posttooluse.mjs`, `mcp-route-guard.cjs`, `task-dispatch-guard.cjs`, `fable-subagent-guard.mjs`, `claude-posttooluse.cjs`) target `.opencode/hooks/` instead, see [`hooks/README.md`](../../.opencode/hooks/README.md) for why. The mirror gives maintainers one place to inspect the Claude inventory. Claude executes the real paths declared in `.claude/settings.json`, not these links.

Two compiled ESM entrypoints do not execute correctly through their symlink because their direct-entry guards compare the invocation path with the resolved module URL. Keep all runtime commands pointed at the real files.

## 2. ENTRYPOINT BEHAVIOR

| Script                    | Through Mirror             | Through Real Path              |
| ---------------------------| ----------------------------| --------------------------------|
| `session-prime.js`        | No output                  | Full session context brief     |
| `install-codex-hooks.mjs` | Different root resolution  | Authoritative check behavior   |
| Other 17 scripts          | Matches real-path behavior | Authoritative runtime behavior |

Empty output can be a normal allow decision. Compare a mirror invocation with its real target before treating silence as failure.

## 3. INVENTORY

| Group | Files |
|-------|-------|
| Session lifecycle | `session-prime.js`, `session-stop.js`, `session-cleanup.sh`, `compact-inject.js`, `user-prompt-submit.js` |
| Spec and completion gates | `spec-gate-classify.mjs`, `spec-gate-enforce.mjs`, `completion-evidence-stop.cjs` |
| Dispatch and MCP guards | `dispatch-preflight-lint.mjs`, `dispatch-audit-posttooluse.mjs`, `task-dispatch-guard.cjs`, `fable-subagent-guard.mjs`, `mcp-route-guard.cjs` |
| Edit quality | `claude-posttooluse.cjs` |
| Repository hygiene | `worktree-guard.sh`, `check-git-hooks.sh`, `check-dist-staleness.sh`, `install-codex-hooks.mjs` |

## 4. VALIDATION

Validate this README from the repository root:

```bash
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .claude/hooks/README.md
```

Expected result: exit 0 with zero document issues.

Inspect tracked link modes:

```bash
git ls-files -s .claude/hooks
```

Expected result: hook scripts use mode `120000`; `README.md` uses mode `100644`.

## 5. RELATED RESOURCES

- [Claude hook wiring](../settings.json)
- [Codex mirror](../../.codex/hooks/README.md)
- [Cursor mirror](../../.cursor/hooks/README.md)
- [Devin mirror](../../.devin/hooks/README.md)
- [Injection contract](../../.opencode/hooks/injection-contract.md): what each of these hooks actually injects, on which event, and whether it is visible to the human by default
- [Runtime hooks tree](../../.opencode/hooks/README.md): the four fully-portable guard cores this mirror now points at outside `.opencode/skills/`
