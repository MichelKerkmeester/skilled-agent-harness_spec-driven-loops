---
title: "Implementation Summary: devin + cursor Fan-out Exec Hardening"
description: "Re-mapped the devin and cursor fan-out lineage builders from the live headless behavior of the installed CLIs. Live testing refuted the prior mappings: devin's --sandbox forces autonomous mode and ignores --permission-mode (read-only leaves could write; accept-edits never stalled), and cursor's -p mode is trust-gated and --sandbox enabled still permits cwd writes. Read-only is now genuine (devin --permission-mode auto with no sandbox; cursor --mode plan --trust), workspace-write never stalls and stays confined, and every non-interactive leaf clears its trust gate."
trigger_phrases:
  - "devin cursor exec hardening done"
  - "cursor mode plan trust fanout"
  - "devin read-only auto no sandbox"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-executor-wiring-and-parity/003-cli-executor-fanout-parity/003-devin-cursor-exec-hardening"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/002-executor-wiring-and-parity/003-cli-executor-fanout-parity/003-devin-cursor-exec-hardening"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "claude"
    recent_action: "Implemented and gated the devin and cursor containment re-map"
    next_safe_action: "Fold SOL verdict, validate --strict, land, then phase 004"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts"
    completion_pct: 95
    open_questions:
      - "Isolate cursor ambient repo config (write-capable hooks + unapproved MCP) for fan-out leaves; deferred to combo-matrix phase"
    answered_questions:
      - "devin --sandbox ignores --permission-mode; read-only must drop --sandbox to be read-only"
      - "cursor -p is trust-gated; read-only + workspace-write must pass --trust"
      - "cursor --mode plan is genuine read-only (reads allowed, edits/shell blocked)"
---
# Implementation Summary: devin + cursor Fan-out Exec Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| **Spec Folder** | 003-devin-cursor-exec-hardening |
| **Completed** | 2026-07-29 (pending SOL verdict + land) |
| **Level** | 2 |
| **Status** | In Progress |
| **Posture** | Corrective flag re-map of two builders + one resolver; no other executor kind changes |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Both the devin and cursor fan-out lineage builders now map each sandbox mode to flags that match the installed CLI's real non-interactive behavior, established by live probing before any change:

**devin (3000.2.17).** `--sandbox` forces the "autonomous" permission mode and ignores `--permission-mode` (the CLI prints a warning), and without granted Write scopes the sandbox defaults to a writable cwd. New mapping: read-only → `--permission-mode auto` with **no** `--sandbox` (devin cleanly rejects shell-exec and writes non-interactively while still allowing native file reads); workspace-write → `--permission-mode dangerous --sandbox` (autonomous, cwd-confined, never stalls); danger-full-access → `--permission-mode dangerous` (unchanged).

**cursor (2026.07.23).** `-p` mode has access to all tools and, in an untrusted directory, refuses to run anything without a trust flag; `--sandbox enabled` confines but still permits cwd writes. New mapping: read-only → `--mode plan --trust` (plan mode blocks edits/shell writes, allows reads; `--trust` clears the gate); workspace-write → `--force --sandbox enabled` (autonomous so it never stalls, writes confined to cwd); danger-full-access → `--force --sandbox disabled` (unchanged; `--force` implies trust). Workspace-write uses `--force` rather than `--auto-review` because Smart Auto prompts for tool calls it deems unsafe and a non-interactive leaf has no stdin to answer, so it could block until the lineage timeout. The `CursorApprovalMode` abstraction's read-only value moved from the fictional `ask` to `plan`, and both write modes resolve to `force`.

### Files Changed

| File | Action | Purpose |
|---|---|---|
| `runtime/scripts/fanout-run.cjs` | Modified | Re-mapped `buildDevinLineageCommand` (read-only drops `--sandbox`) and `buildCursorLineageCommand` (read-only → `--mode plan --trust`; workspace-write adds `--trust`); rewrote both permission-mapping comments to the live behavior |
| `runtime/lib/deep-loop/executor-config.ts` | Modified | `CursorApprovalMode` `ask` → `plan`; `resolveCursorApprovalMode` read-only → `plan`; doc comments corrected |
| `runtime/tests/unit/fanout-run.vitest.ts` | Modified | Locked the exact arg-vectors + not-contains guards for all three sandbox modes of devin and cursor |
| `runtime/tests/unit/executor-config.vitest.ts` | Modified | `resolveCursorApprovalMode` read-only test `ask` → `plan` |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The mappings were derived empirically: each CLI was dispatched non-interactively across the three sandbox modes with tasks that force a shell exec, a file write, and a native read, and the emitted args were fixed to whatever combination produced genuine read-only (reads yes, writes/exec no), stall-free workspace-write, and trust-gate clearance. The devin read-only fix and the cursor test/resolver updates were applied directly; the cursor builder re-map was authored via the cli-pi LUNA primary builder and finished inline where an exact-text edit did not match. No behavior of the codex, claude-code, opencode, or pi builders was touched.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|---|---|
| devin read-only drops `--sandbox` | `--sandbox` forces autonomous mode and defaults to a writable cwd; `--permission-mode auto` alone is what actually blocks exec/writes non-interactively |
| devin workspace-write keeps `dangerous --sandbox` | Autonomous (never stalls) with writes confined to cwd; the prior `accept-edits` was ignored under `--sandbox` and is a misleading label |
| cursor read-only uses `--mode plan` | Plan mode is cursor's real read-only mode; `--sandbox enabled` still permits cwd writes and does not make a leaf read-only |
| cursor workspace-write uses `--force` (not `--auto-review`) | `--auto-review` prompts for tools it deems unsafe; a non-interactive leaf has no stdin, so it could block until timeout. `--force` auto-approves everything; `--sandbox enabled` keeps writes cwd-confined |
| cursor read-only passes `--trust`; write modes rely on `--force` | `-p` refuses to run in an untrusted dir without a trust flag; `--mode plan` needs an explicit `--trust`, while `--force` already implies trust |
| `CursorApprovalMode` `ask` → `plan` | `ask` described a prompt-and-block default that does not exist in `-p` mode; `plan` names the real mechanism |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Gate | Result |
|---|---|
| fanout-run Vitest | PASS — 93 tests |
| executor-config Vitest | PASS — 86 tests |
| Whole-runtime TypeScript | PASS — zero diagnostics |
| Live devin read-only (`--permission-mode auto`) | PASS — write rejected, no file written; native read returned the token |
| Live devin workspace-write (`dangerous --sandbox`) | PASS — exec ran, file written to cwd, exit 0, no stall |
| Live cursor read-only (`--mode plan --trust`) | PASS — "Plan mode blocked the write command", no file written; native read returned the token |
| Live cursor workspace-write (`--force --sandbox enabled`) | PASS — file written, exit 0, no stall, no trust-block |
| Cross-model SOL review (cli-opencode GPT-5.6-SOL, high) | REQUESTED_CHANGES, 0 P0 / 3 P1 — P1-002 fixed; P1-001 and P1-003 verified non-reproducing against the real hooks/MCP (see below) |
| `validate.sh --strict` | Errors: 0 (5 tolerated warnings, matching the sibling phase baseline) |

Live command shapes now produced by the builders:

- devin read-only: `devin -p <prompt> --model <m> --permission-mode auto`
- devin workspace-write: `devin -p <prompt> --model <m> --permission-mode dangerous --sandbox`
- cursor read-only: `cursor-agent -p <prompt> --output-format text --model <m> --mode plan --trust`
- cursor workspace-write: `cursor-agent -p <prompt> --output-format text --model <m> --force --sandbox enabled`

### SOL review disposition

- **P1-002 (workspace-write Smart Auto could stall) — FIXED.** Confirmed by the installed CLI docs and the fan-out's ignored-stdin/long-timeout contract. Workspace-write moved from `--auto-review` to `--force --sandbox enabled` (autonomous, never stalls, writes OS-confined); live-verified (a shell write completed, exit 0, no stall, no trust prompt) and gated (fanout 93, executor-config 86, tsc 0).
- **P1-003 (unapproved MCP servers could block a leaf) — did not reproduce; tracked as defense-in-depth.** `cursor-agent mcp list` reports three servers "not loaded (needs approval)", but every live cursor probe completed (exit 0) with them unloaded — an unapproved server is skipped, not a blocking prompt. Carried to the combo-matrix phase, where an isolated MCP configuration (no servers unless required) is the fix if a leaf ever invokes one.
- **P1-001 (repo lifecycle hooks can write under read-only) — capability exists but does NOT reproduce with the real hooks; tracked as defense-in-depth.** A synthetic `sessionStart` hook that writes unconditionally does fire under `-p --mode plan --trust`, confirming plan mode does not constrain hook subprocesses. But running a read-only cursor leaf in the repo under the real dispatch env (`AI_SESSION_CHILD=1`) with the actual `.cursor/hooks.json` produced ZERO writes — git status byte-identical before/after, no file modified in the run window, no `.goal-state` (the goal-inject hook fails open with no active goal, and the other sessionStart hooks did not write). So a read-only cursor leaf is non-mutating in production today. The residual concern is defense-in-depth — a future or differently-configured write-capable hook would not be constrained by `--mode plan` — and its fix is spawn-environment isolation of cursor's ambient config (a different mechanism than this phase's flag mapping), carried to the combo-matrix phase.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| Target | Result | Status |
|---|---|---|
| Read-only leaves cannot mutate the repo | devin `auto` and cursor `--mode plan` both block writes/exec (live) | Pass |
| Non-interactive leaves never stall on a prompt | devin autonomous under `--sandbox`; cursor cleared by `--trust`/`--force` | Pass |
| No regression to other executor kinds | Change touches only the devin/cursor builders + the cursor resolver | Pass |
<!-- /ANCHOR:nfr-verify -->

<!-- ANCHOR:limitations -->
## Known Limitations

This phase hardens the sandbox-mode → CLI-flag mapping (the agent's own exec/write tools). Cursor also inherits ambient repository configuration when it runs in the repo cwd — a separate isolation surface tracked as defense-in-depth for the combo-matrix phase. Both items below were verified NON-reproducing today and are latent, not current defects: (1) a synthetic write-capable `sessionStart` hook does fire under `--mode plan`, but the repo's real hooks wrote nothing when a read-only leaf ran in-repo under the real dispatch env, so a read-only leaf is non-mutating in production; the residual risk is that a future write-capable hook would not be constrained by `--mode plan`; (2) three repo MCP servers report "not loaded (needs approval)" — skipped in every live run, but a leaf that invokes one has no stdin to approve it. The defense-in-depth fix for both is isolating cursor's ambient config at spawn time. devin's workspace-write write-boundary beyond the confirmed cwd write is asserted-by-flag, not exhaustively probed. Per-mode exposure of devin/cursor is phase 004.
<!-- /ANCHOR:limitations -->

<!-- ANCHOR:deviations -->
## Deviations from Plan

The phase entered as a one-line devin permission-mode change (operator's `dangerous + --sandbox`), but live testing refuted its premise (`--sandbox` ignores `--permission-mode`, so `accept-edits` never stalled) and surfaced two real containment defects — devin and cursor read-only leaves could both write, and cursor leaves were trust-gated. Scope expanded, with the operator's go-ahead, to the correct evidence-based re-map of both builders.
<!-- /ANCHOR:deviations -->
