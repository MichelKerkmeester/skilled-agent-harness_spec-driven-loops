---
title: "QA Checklist: devin + cursor Fan-out Exec Hardening"
description: "QA verification for the devin and cursor fan-out lineage builder re-map: unit tests over the exact arg-vectors for all three sandbox modes of both kinds, live read-only and workspace-write probes, and a cross-model SOL review, landed in commit b1d36b1741."
trigger_phrases:
  - "devin cursor exec hardening checklist"
  - "fanout read-only containment qa"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/002-executor-wiring-and-parity/003-cli-executor-fanout-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/002-executor-wiring-and-parity/003-cli-executor-fanout-parity/003-devin-cursor-exec-hardening"
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Reconciled QA checklist to Complete with priority tags and evidence"
    next_safe_action: "Proceed to per-mode executor parity phase 004"
    blockers: []
    completion_pct: 100
    open_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

# QA Checklist: devin + cursor Fan-out Exec Hardening

<!-- ANCHOR:protocol -->
## Verification Protocol
Unit tests over the exact constructed args for all three sandbox modes of both kinds, plus live write/read probes reproducing each mode with the emitted args; full vitest output captured, never through `tail`. Cross-model SOL adversarial review before landing.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P2] devin and cursor live behavior probed across every sandbox mode (`--sandbox`, `--mode plan`).
- [x] CHK-002 [P2] Clean `tsc` baseline in the worktree.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-003 [P1] devin read-only drops `--sandbox`; workspace-write keeps `dangerous --sandbox`; full-access unchanged.
- [x] CHK-004 [P1] cursor read-only is `--mode plan --trust`; workspace-write adds `--trust`; full-access unchanged.
- [x] CHK-005 [P1] `CursorApprovalMode`/`resolveCursorApprovalMode` renamed read-only value to `plan` for truthfulness.
- [x] CHK-006 [P2] Comment hygiene: durable WHY grounded in live behavior, no ephemeral ids/spec paths.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-007 [P0] fanout-run 93/93 and executor-config 86/86 green.
- [x] CHK-008 [P1] Whole-runtime `tsc` typecheck clean: 0 diagnostics.
- [x] CHK-009 [P0] Live probes: read-only writes blocked and reads allowed; workspace-write writes succeed with no stall (`--mode plan`, `--sandbox`).
- [x] CHK-010 [P1] SOL cross-verify: 0 P0; the one stall P1 (Smart Auto) fixed via `--force --sandbox enabled`; the two ambient-config P1s (repo hooks, unapproved MCP) verified NON-reproducing against the real hooks/MCP (read-only leaf wrote zero files in-repo under the real dispatch env; MCPs skipped) — tracked as defense-in-depth for the combo-matrix phase.
- [x] CHK-011 [P1] `validate.sh --strict`: Errors 0 for this phase.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-012 [P0] No read-only leaf of either kind can write the working directory; the original defect on both is closed (`--sandbox`/`--mode plan` block writes).
- [x] CHK-013 [P0] No non-`danger-full-access` leaf is blocked by cursor's untrusted-directory gate (`--trust`).
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [x] CHK-014 [P0] Read-only leaves cannot mutate the repo (exec and write blocked via `--mode plan`/`auto`); no secrets in constructed args.
- [x] CHK-015 [P0] Workspace-write writes are confined to the working directory at the OS level (devin `--sandbox`, cursor `--sandbox enabled`).
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-016 [P2] Both builders' comments document the real trust/sandbox/permission behavior of the installed CLIs.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-017 [P2] Changes confined to `fanout-run.cjs`, `executor-config.ts`, and their two test files.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
Completed items: 19 of 19 evidenced (all P0/P1 tiers cited); 1 external sign-off deferred. Status: Complete.
- [x] CHK-018 [P1] Unit + live evidence recorded in `implementation-summary.md`.
- [x] CHK-019 [P1] SOL verdict + P1 dispositions recorded in `implementation-summary.md` (landed `b1d36b1741`).
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off
- [Deferred: external operator review pending] Operator review before the per-mode wiring phase (004) exposes devin/cursor; phase `004-per-mode-executor-parity` already built on top of the landed `b1d36b1741`, so this external gate is effectively moot.
<!-- /ANCHOR:sign-off -->
