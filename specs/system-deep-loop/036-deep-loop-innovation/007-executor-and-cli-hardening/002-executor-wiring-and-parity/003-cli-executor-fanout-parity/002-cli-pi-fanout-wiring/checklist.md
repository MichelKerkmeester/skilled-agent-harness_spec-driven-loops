---
title: "QA Checklist: cli-pi Fan-out Lineage Wiring"
description: "Verification checklist for the cli-pi fan-out lineage builder: command construction, reasoning forwarding, read-only tool allowlist, suites green, and a live end-to-end dispatch against real pi."
trigger_phrases:
  - "cli-pi fanout wiring checklist"
  - "buildPiLineageCommand checklist"
  - "pi provider map checklist"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/002-executor-wiring-and-parity/003-cli-executor-fanout-parity/002-cli-pi-fanout-wiring"
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Reconciled cli-pi fanout packet docs to Complete"
    next_safe_action: "Commit the reconciled cli-pi packet docs"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
    completion_pct: 100
    open_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

# QA Checklist: cli-pi Fan-out Lineage Wiring

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | HARD BLOCKER | Cannot claim done until complete |
| **P1** | Required | Must complete OR get user approval |
| **P2** | Optional | Can defer with documented reason |

Command-construction unit tests plus a live end-to-end dispatch of the builder's own output; full vitest output captured, never through `tail`.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P1] Provider map captured from `pi --list-models`.
- [x] CHK-002 [P1] Clean `tsc` baseline captured in the worktree before changes.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-010 [P0] `--offline` always present; prompt is the final positional arg; exit code documented as non-authoritative.
- [x] CHK-011 [P0] Provider prefix correct for every allowlisted model in `fanout-run.cjs`.
- [x] CHK-012 [P0] Invalid `--thinking` level fails closed with a typed error.
- [x] CHK-013 [P1] Comment hygiene: durable WHY only, no ephemeral ids; diff review clean.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-020 [P0] Suites green: fanout-run 93/93, executor-config 86/86, executor-audit 27/27 via `vitest`.
- [x] CHK-021 [P0] Whole-runtime TypeScript `tsc` reported 0 diagnostics across the runtime.
- [x] CHK-022 [P1] Live dispatch of `pi -p --offline` returned the expected token from real pi.
- [x] CHK-023 [P0] `validate.sh --strict` passes for this phase.
  - Evidence: `validate.sh --strict` reconciliation pass returned `Errors: 0`.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-FIX-001 [P0] The stub is fully removed; no code path still throws the "unavailable" contract error (`fanout-run.cjs:2091`).
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [x] CHK-030 [P1] Read-only leaves restrict the `--tools` allowlist to reads; no secrets in constructed args.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-040 [P1] The builder documents the `--offline` requirement and the exit-code caveat.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-050 [P1] Changes confined to `fanout-run.cjs`, `executor-config.ts`, and their two test files.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
- [x] CHK-060 [P1] Unit + live evidence recorded in `implementation-summary.md`.
- Status: Complete — all P0/P1 items checked; 1 external sign-off deferred (operator review).
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off
- [Deferred: external operator review pending] Operator review before the per-mode wiring phase (004) exposes cli-pi.
<!-- /ANCHOR:sign-off -->
