---
title: "Implementation Summary: Codex hook/plugin parity"
description: "In-progress summary of the Codex guard-adapter parity build: capability spike done, scaffold conformed, adapters/wiring/install/verification pending. Carries the adapter/native/gap coverage map."
trigger_phrases: ["Codex hook parity summary", "codex parity status"]
importance_tier: important
contextType: implementation
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/007-codex-hook-parity"
    last_updated_at: "2026-07-13T18:17:53Z"
    last_updated_by: "claude-code"
    recent_action: "Conformed scaffold to L3 template"
    next_safe_action: "Build the portable Codex guard adapters (Phase 2)"
    blockers: []
    completion_pct: 20
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
| **Status** | In progress |
| **Level** | 3 |
| **Predecessor** | `../004-codex-hook-adapter-layer` |
| **Started** | 2026-07-13 |
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:what-built -->
## What Was Built

Built so far:
- **Capability spike** — the Codex 0.144.2 hook contract pinned from the binary schema plus a live probe (`decision-record.md`, ADR-001).
- **Scaffold conformance** — `spec.md`, `tasks.md`, and this summary conformed to the Level 3 template.

Pending (Phase 2 → Phase 3): the guard adapters, lifecycle wiring, native equivalents, install, and verification.

### Coverage map (adapter / native / gap)

| Claude hook / plugin | Codex handling | Target | Status |
|---|---|---|---|
| spec-gate-enforce | Adapter (PreToolUse, deny) | `system-spec-kit/runtime/hooks/codex/spec-gate-enforce.mjs` | Pending |
| spec-gate-classify | Adapter (UserPromptSubmit) | `system-spec-kit/runtime/hooks/codex/spec-gate-classify.mjs` | Pending |
| code-graph-freshness | Adapter (PostToolUse) | `system-code-graph/runtime/hooks/codex/code-graph-freshness.cjs` | Pending |
| post-edit-quality | Adapter (PostToolUse) | `sk-code/code-quality/scripts/hooks/codex/post-edit-quality.cjs` | Pending |
| dispatch-preflight-lint | Adapter (PreToolUse, deny) | `cli-opencode/scripts/hooks/codex/dispatch-preflight-lint.mjs` | Pending |
| dispatch-audit | Adapter (PostToolUse, observe) | `cli-opencode/scripts/hooks/codex/dispatch-audit-posttooluse.mjs` | Pending |
| completion-evidence | Adapter (Stop, advisory) | `system-spec-kit/mcp_server/hooks/codex/completion-evidence-stop.cjs` | Pending |
| mcp-route-guard | Native equivalent (dormant, documented) | `mcp-code-mode/runtime/hooks/codex/mcp-route-guard.cjs` | Pending |
| task-dispatch-guard | Folded into exec command-shape recognizer | (in the Codex dispatch adapter) | Pending |
| SessionStart guards (worktree, git-hooks, dist-staleness) | Wire neutral scripts | `.codex/hooks.json` SessionStart chain | Pending |
| session-cleanup | Fold into Stop (no SessionEnd event) | `.codex/hooks.json` Stop chain | Pending |
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
| Scaffold `validate.sh --strict` | Pending → target Errors: 0 | Re-run after this summary lands |
| Per-adapter fixture smoke (allow / advise / deny / fail-open) | Pending | Phase 3, T017 |
| Live `codex exec` matrix (timed) | Pending | Phase 3, T018 |
| Cores / Claude hooks / OpenCode plugins byte-unchanged | Pending | Diff at closeout |
| `.codex/hooks.json` parses + adapter paths exist | Pending | Phase 3 |
<!-- /ANCHOR:verification -->
<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live deny-behavioral confirmation is owed until Phase 3** — deny capability is settled from the 0.144.2 binary schema; the runtime block will be observed (or documented as owed if the session hangs) in the live matrix.
2. **`~/.codex/hooks.json` is the one out-of-repo write** — the installer backs it up first and merges rather than replaces; revertible via the backup.
3. **`mcp-route-guard` codex adapter is dormant** — Codex's three registered MCP servers are all `mk_`-prefixed and thus core-exempt; it activates only when an external MCP family is registered.
<!-- /ANCHOR:limitations -->
<!-- ANCHOR:architecture-summary -->
## Architecture Summary

Every guard hook is a thin adapter over a runtime-neutral core already dual-consumed by the Claude hook and an OpenCode plugin. Adding Codex makes each adapter a third consumer of the same core; the cores stay byte-unchanged. Lifecycle codex adapters (from child 004) keep their `runClaudeHookAdapter` delegation model; the new guard adapters use the direct-core model because that helper cannot reach per-skill hooks and drops the deny envelope.
<!-- /ANCHOR:architecture-summary -->
