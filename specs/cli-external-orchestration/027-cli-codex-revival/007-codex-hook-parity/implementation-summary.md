---
title: "Implementation Summary: Codex hook/plugin parity"
description: "In-progress summary of the Codex guard-adapter parity build: capability spike done, scaffold conformed, adapters/wiring/install/verification pending. Carries the adapter/native/gap coverage map."
trigger_phrases: ["Codex hook parity summary", "codex parity status"]
importance_tier: important
contextType: implementation
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/027-cli-codex-revival/007-codex-hook-parity"
    last_updated_at: "2026-07-14T03:36:41Z"
    last_updated_by: "claude-code"
    recent_action: "Landed Stop-stdout fix to v4; deferred installer re-point to primary reconcile"
    next_safe_action: "Re-run install-codex-hooks.mjs against the primary checkout once it reconciles to origin/v4"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Codex hook/plugin parity
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->
<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| **Spec Folder** | 007-codex-hook-parity |
| **Status** | Complete |
| **Level** | 3 |
| **Predecessor** | `../004-codex-hook-adapter-layer` |
| **Started** | 2026-07-13 |
| **Completed** | 2026-07-13 |
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:what-built -->
## What Was Built

Built:
- **Capability spike** — the Codex 0.144.2 hook contract pinned from the binary schema plus a live probe (`decision-record.md`, ADR-001).
- **Eight guard adapters** — thin Codex siblings over the runtime-neutral cores (six guard cores + two CLI-dispatch cores), each a third consumer alongside the Claude hook and the OpenCode plugin.
- **Lifecycle wiring** — the neutral SessionStart guards (worktree, git-hooks, dist-staleness) and the Stop chain (session-cleanup folded in) registered in `.codex/hooks.json`.
- **Installer** — `install-codex-hooks.mjs` merges the versioned repo hook set into user-global `~/.codex/hooks.json`, backed up and idempotent.
- **Verification** — fixture stdin-pipe matrix (33/33) plus a live `codex exec` run under Codex 0.144.2.

### Coverage map (adapter / native / gap)

| Claude hook / plugin | Codex handling | Target | Status |
|---|---|---|---|
| spec-gate-enforce | Adapter (PreToolUse, deny) | `system-spec-kit/runtime/hooks/codex/spec-gate-enforce.mjs` | Done |
| spec-gate-classify | Adapter (UserPromptSubmit) | `system-spec-kit/runtime/hooks/codex/spec-gate-classify.mjs` | Done |
| code-graph-freshness | Adapter (PostToolUse) | `system-code-graph/runtime/hooks/codex/code-graph-freshness.cjs` | Done |
| post-edit-quality | Adapter (PostToolUse) | `sk-code/code-quality/scripts/hooks/codex/post-edit-quality.cjs` | Done |
| dispatch-preflight-lint | Adapter (PreToolUse, deny) | `cli-opencode/scripts/hooks/codex/dispatch-preflight-lint.mjs` | Done |
| dispatch-audit | Adapter (PostToolUse, observe) | `cli-opencode/scripts/hooks/codex/dispatch-audit-posttooluse.mjs` | Done |
| completion-evidence | Adapter (Stop, advisory) | `system-spec-kit/mcp_server/hooks/codex/completion-evidence-stop.cjs` | Done |
| mcp-route-guard | Native equivalent (dormant, documented) | `mcp-code-mode/runtime/hooks/codex/mcp-route-guard.cjs` | Done |
| task-dispatch-guard | Folded into exec command-shape recognizer | (in the Codex dispatch adapter) | Done |
| SessionStart guards (worktree, git-hooks, dist-staleness) | Wire neutral scripts | `.codex/hooks.json` SessionStart chain | Done |
| session-cleanup | Fold into Stop (no SessionEnd event) | `.codex/hooks.json` Stop chain | Done |
<!-- /ANCHOR:what-built -->
<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Work runs in an isolated git worktree (`.worktrees/0038-codex-hook-parity`, branch `wt/0038-codex-hook-parity`). Node validators run from the main tree against worktree paths because the worktree lacks the gitignored `dist/`. Each guard adapter is a thin sibling of the existing Claude adapter, calling the neutral core directly as a third consumer (alongside the Claude hook and the OpenCode plugin); no core is modified.
<!-- /ANCHOR:how-delivered -->
<!-- ANCHOR:decisions -->
## Key Decisions

| ADR | Decision | Status |
|---|---|---|
| ADR-001 | Pin the Codex 0.144.2 native hook contract | Accepted |
| ADR-002 | Guard adapters call the neutral core directly | Accepted |
| ADR-003 | Deny-capable guards block via `permissionDecision: deny` | Accepted |
| ADR-004 | Versioned repo source plus an installer into `~/.codex/hooks.json` | Accepted |
| ADR-005 | Honest handling of non-portable guards and SessionEnd | Accepted |

The shipped `mcp_server/hooks/codex/shared.ts` helper drops `permissionDecision`, so deny-capable adapters inline their own deny envelope like their Claude siblings — no `shared.ts` change and no `mcp_server` build required.

See `decision-record.md` for full ADR documentation.
<!-- /ANCHOR:decisions -->
<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|---|---|---|
| `validate.sh --strict` | Pass | Errors: 0 (closeout run) |
| Per-adapter fixture smoke (allow / advise / deny / fail-open) | Pass | 33/33 assertions; real `permissionDecision:"deny"` envelope, Gate-3 `additionalContext`, and `runtime:"codex"` audit line all captured |
| Live `codex exec` matrix (timed) | Pass | Codex 0.144.2: SessionStart 5/5 + UserPromptSubmit 3/3 Completed; `spec-gate-classify` wrote `.spec-gate-state/<hex(session_id)>.json`; model honored the injected Gate-3 menu (chose option E) |
| Live deny block (`spec-gate-enforce`) | Pass | Real `apply_patch` blocked: Codex router logged `Command blocked by PreToolUse hook: DENIED…`, the file was not created, and the enforce warning log recorded `codex \| <session> \| write \| src/app.ts \| would-deny` |
| Live Stop chain clean | Pass | Acceptance run: Stop 4/4 Completed, 0 Failed after suppressing `session-cleanup.sh` stdout in the wiring |
| Cores / Claude hooks / OpenCode plugins byte-unchanged | Pass | Landed diff touches only new `codex/` adapters + `.codex/hooks.json` + installer + spec docs; no core modified |
| `.codex/hooks.json` parses + adapter paths exist | Pass | Installer dry-run parsed the source and resolved all 8 adapter paths |
| Installer idempotent + preserves Superset entries | Pass | 14 added / 2 skipped, re-run 0 added, `notify.sh` preserved (3), `.bak-<ts>` backup created |
<!-- /ANCHOR:verification -->
<!-- ANCHOR:limitations -->
## Known Limitations

1. **Deny is live-confirmed.** A live `codex exec apply_patch` on a non-exempt file was blocked end-to-end (Codex router: `Command blocked by PreToolUse hook: DENIED…`; file not created; `would-deny` logged). Confirming this surfaced a real defect: Codex delivers the target path inside the patch body (`tool_input.command`, an `*** Add/Update/Delete File:` header), not a `file_path` field, so the first live attempt read a null path and treated every patch as exempt. Fixed by parsing the affected path(s) out of the patch in the three filePath-driven adapters (`spec-gate-enforce`, `post-edit-quality`, `code-graph-freshness`); the enforce adapter evaluates the first non-exempt affected path so a multi-file patch can't hide a real write behind an exempt sibling.
2. **The active install points at the worktree, not the primary checkout — deferred by operator decision (2026-07-14).** The primary checkout is diverged from origin/v4 (ahead by local commits, behind, and dirty with concurrent-session work) and unsafe to write into, so the installer targets the isolated worktree (which required staging the gitignored `shared/dist` + `mcp_server/dist` from the primary tree to complete the lifecycle-adapter chain). The interim worktree install is functional and live-verified, and fail-open means it degrades gracefully if the worktree is removed. The operator chose to **defer re-pointing until the primary checkout reconciles to origin/v4**, then re-run `install-codex-hooks.mjs` against the primary tree for the permanent target. All eight adapters are on origin/v4, so any clean v4 checkout already carries them — no rebuild is required, only the installer re-run.
3. **Stop chain is now clean (was 1 `Stop Failed`; fixed).** Root cause: `session-cleanup.sh` always prints a plain-text teardown line to stdout (`action=skip reason=no-session-pid`), and Codex parses a Stop hook's stdout as a response envelope — the non-JSON text failed that parse and read as `Stop Failed` (despite exit 0). Fixed by redirecting that neutral script's stdout in the Stop wiring (`>/dev/null 2>&1`; the script stays byte-unchanged). A live acceptance run now shows Stop 4/4 Completed. Contract note recorded in `decision-record.md`: neutral shell scripts wired to a Codex hook must not emit stdout, since only the lifecycle JS adapters speak the response-envelope protocol.
4. **`~/.codex/hooks.json` is the one out-of-repo write** — the installer backs it up first and merges rather than replaces; revertible via the `.bak-<ts>` backup.
5. **`mcp-route-guard` codex adapter is dormant** — Codex's registered MCP servers are all `mk_`-prefixed and thus core-exempt; it activates only when an external MCP family is registered.
<!-- /ANCHOR:limitations -->
<!-- ANCHOR:architecture-summary -->
## Architecture Summary

Every guard hook is a thin adapter over a runtime-neutral core already dual-consumed by the Claude hook and an OpenCode plugin. Adding Codex makes each adapter a third consumer of the same core; the cores stay byte-unchanged. Lifecycle codex adapters (from child 004) keep their `runClaudeHookAdapter` delegation model; the new guard adapters use the direct-core model because that helper cannot reach per-skill hooks and drops the deny envelope.
<!-- /ANCHOR:architecture-summary -->
