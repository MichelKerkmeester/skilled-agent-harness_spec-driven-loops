---
title: "Tasks: devin + cursor Fan-out Exec Hardening"
description: "Task tracker for the devin and cursor fan-out lineage builder re-map: live-probe both CLIs, re-map both builders and the cursor resolver, lock unit tests, verify with vitest plus live probes and a SOL review, landed in commit b1d36b1741."
trigger_phrases:
  - "devin cursor exec hardening tasks"
  - "fanout builder re-map tasks"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/002-executor-wiring-and-parity/003-cli-executor-fanout-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/002-executor-wiring-and-parity/003-cli-executor-fanout-parity/003-devin-cursor-exec-hardening"
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Reconciled task tracker to Complete"
    next_safe_action: "Proceed to per-mode executor parity phase 004"
    blockers: []
    completion_pct: 100
    open_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: devin + cursor Fan-out Exec Hardening

<!-- ANCHOR:notation -->
## Task Notation
`[ ]` open · `[x]` done. Status: Complete — code implemented, gated, and SOL-reviewed (P1-002 fixed; two ambient-config P1s tracked forward), landed in `b1d36b1741`.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] Live-probe devin across auto/accept-edits/dangerous × sandbox on/off (permission-mode ignored under --sandbox; read-only write-leak found).
- [x] Live-probe cursor across --sandbox enabled/disabled, --mode plan, --trust (trust gate + read-only write-leak found; plan mode is genuine read-only).
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] devin: read-only → `--permission-mode auto` (drop `--sandbox`); keep workspace-write `dangerous --sandbox` and full-access `dangerous`; rewrite the permission-mapping comment.
- [x] cursor: read-only → `--mode plan --trust`; workspace-write → `--force --sandbox enabled`; keep full-access `--force --sandbox disabled`; rewrite the mapping comment.
- [x] `CursorApprovalMode` `ask` → `plan`; `resolveCursorApprovalMode` read-only → `plan`; update its doc comment.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] fanout-run 93/93, executor-config 86/86; whole-runtime tsc 0.
- [x] Live: devin read-only (`auto`) blocks writes, allows native reads; cursor read-only (`--mode plan --trust`) blocks writes, allows reads.
- [x] Live: cursor workspace-write (`--force --sandbox enabled`) writes without stalling; devin workspace-write (`dangerous --sandbox`) writes without stalling.
- [x] cli-opencode GPT-5.6-SOL cross-verify: 0 P0 / 3 P1 — P1-002 (Smart Auto stall) fixed via `--force --sandbox enabled`; two pre-existing ambient-config P1s tracked to the combo-matrix phase.
- [x] `validate.sh --strict` passes for this phase (Errors: 0).
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] Read-only leaves of both kinds are genuinely read-only.
- [x] Workspace-write leaves of both kinds never stall on a permission/trust prompt.
- [x] SOL review dispositioned (P1-002 fixed; P1-001/P1-003 tracked forward) and landed in `b1d36b1741` with strict validation.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Parent: `system-deep-loop/036-deep-loop-innovation/002-executor-wiring-and-parity/003-cli-executor-fanout-parity`
- Predecessor: `002-cli-pi-fanout-wiring`; successor: `004-per-mode-executor-parity`
- Code: `fanout-run.cjs`, `executor-config.ts`, `fanout-run.vitest.ts`, `executor-config.vitest.ts`
<!-- /ANCHOR:cross-refs -->
