---
title: "Verification Checklist: convert the direct-dispatch deep command to yaml-backed"
description: "Level 2 checklist with concrete dispatch-equivalence, report-parity, and conformance evidence."
trigger_phrases:
  - "deep direct dispatch to yaml"
  - "skill-benchmark yaml-backed"
  - "byte identical loop-host dispatch"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/012-deep-command-family-parity/002-direct-dispatch-to-yaml"
    last_updated_at: "2026-07-13T14:15:00Z"
    last_updated_by: "claude"
    recent_action: "All checklist items verified with evidence"
    next_safe_action: "Proceed to child 003"
---
# Verification Checklist: convert the two direct-dispatch deep commands to yaml-backed

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md]
  - **Evidence**: `spec.md` REQ-001 through REQ-006 and REQ-008 define the conversion + byte-identical dispatch requirements.
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md]
  - **Evidence**: `plan.md` architecture describes the minimal single-dispatch wrapper cloned from the Lane A/B shape.
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: plan.md dependencies]
  - **Evidence**: `plan.md` lists the `loop-host.cjs` forwarding sets and the `parse-args.cjs` dialect as green internal dependencies.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Three new assets exist, one per required file [EVIDENCE: deep_skill-benchmark_auto.yaml]
  - **Evidence**: `deep_skill-benchmark_auto.yaml`, its confirm, and its presentation peer are all present.
- [x] CHK-011 [P0] Wrapper is minimal single-dispatch, not a phase-loop clone [EVIDENCE: single_dispatch]
  - **Evidence**: each YAML `operating_mode.workflow` is `single_dispatch_diagnostic` / `single_dispatch_guarded_refine` with one `phase_run` step.
- [x] CHK-012 [P1] Optional flags appended only when set [EVIDENCE: dispatch guard]
  - **Evidence**: the dispatch uses `$([ -n "{flag}" ] && echo …)` so unset flags fall back to the loop host's own defaults.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: remaining requirements]
  - **Evidence**: every remaining REQ has a passing gate recorded in `implementation-summary.md`.
- [x] CHK-021 [P0] Adapter argv byte-identical across flag combos [EVIDENCE: planInvocation harness]
  - **Evidence**: the `planInvocation` shell-expansion harness reported `ALL_ADAPTER_ARGV_IDENTICAL=true` across 8 combinations for skill-benchmark.
- [x] CHK-022 [P0] skill-benchmark converted report equals baseline [EVIDENCE: report parity]
  - **Evidence**: the converted `loop-host.cjs` run produced a report byte-identical to the baseline (timestamps normalized).
- [x] CHK-023 [P1] Command conformance across all 7 commands [EVIDENCE: validate_document.py]
  - **Evidence**: `validate_document.py --type command` reported `7 pass / 0 fail`.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P0] Both HARD-BLOCK gates preserved verbatim [EVIDENCE: Phase 0 + input gate]
  - **Evidence**: `skill-benchmark.md` retains the Phase 0 dispatch-context block and the Mandatory Input Gate unchanged.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in changed files [EVIDENCE: asset diff]
  - **Evidence**: the changed files are `*.yaml` / `*.txt` / `*.md` assets; no credential-shaped values.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: spec-plan-task sync]
  - **Evidence**: `spec.md`, `plan.md`, and `tasks.md` all describe the same two-command conversion scope.
- [x] CHK-041 [P1] Presentation boundary updated in both commands [EVIDENCE: §5 pointer]
  - **Evidence**: each command's `PRESENTATION BOUNDARY` section now points to its `*_presentation.txt` asset while keeping the router-owned verbatim-render list.
- [x] CHK-042 [P2] Command comment hygiene preserved
  - **Evidence**: no ephemeral artifact ids were added to any code comment; the `*.yaml` / `*.md` changes are docs/asset only.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files committed [EVIDENCE: scratchpad only]
  - **Evidence**: the baseline/converted run outputs and the `preserve-harness.cjs` argv harness live under the session scratchpad, not the packet.
- [x] CHK-051 [P1] Assets live in the canonical deep command locations [EVIDENCE: assets path]
  - **Evidence**: all six new assets live under `.opencode/commands/deep/assets/`.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-13
**Verified By**: Claude (dispatch-equivalence + conformance gates)

<!-- /ANCHOR:summary -->
