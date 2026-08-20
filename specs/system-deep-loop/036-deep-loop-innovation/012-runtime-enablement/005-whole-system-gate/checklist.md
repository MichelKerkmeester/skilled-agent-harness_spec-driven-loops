---
title: "Checklist: Whole-System Gate"
description: "Blocking verification contract for the whole-system gate: frozen candidate, enumerated checks, a receipt on pass or fail, and a proven-falsifiable verdict."
trigger_phrases:
  - "whole system gate checklist"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/005-whole-system-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/005-whole-system-gate"
    last_updated_at: "2026-08-19T07:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the gate verification contract"
    next_safe_action: "Wait for retirement"
    blockers:
      - "Predecessor 004-legacy-writer-retirement must pass first"
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Whole-System Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

A pass counts only if the gate has been shown capable of failing. The falsifiability run is therefore a blocking item,
not an optional extra, and it comes before the verdict is trusted.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Predecessor `004-legacy-writer-retirement` complete
- [ ] CHK-002 [P0] Candidate and baseline SHAs resolved from the environment, not supplied (REQ-001)
- [ ] CHK-003 [P0] Working tree clean before measurement begins (SC-006)
- [ ] CHK-004 [P1] Baseline runtime suite result captured at the baseline SHA (REQ-004)
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] The check set is enumerated rather than discovered at runtime (REQ-002)
- [ ] CHK-006 [P0] No advisory tier exists that lets a failing check produce a passing verdict (REQ-006)
- [ ] CHK-007 [P1] The receipt is written on failure as well as success (REQ-003)
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-008 [P0] The gate was run against a deliberately broken condition and reported failure (REQ-006)
- [ ] CHK-009 [P0] The runtime suite ran at the candidate and is reported as a delta (REQ-004, SC-003)
- [ ] CHK-010 [P0] A real fan-out run completed within the gate (REQ-007, SC-004)
- [ ] CHK-011 [P0] Every mode's reader contract ran at the candidate (REQ-002)
- [ ] CHK-012 [P0] Every check is confirmed to have run at the same frozen candidate SHA (REQ-002, SC-002)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-013 [P0] The receipt names both SHAs, every check, and the verdict (REQ-003, SC-001)
- [ ] CHK-014 [P0] All seven modes' authority states are recorded in the receipt (REQ-008, SC-005)
- [ ] CHK-015 [P1] No finding is repaired inside this phase; failures open a forward-fix phase instead
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-016 [P0] The gate changed no runtime code, protocol document, or authority record (REQ-005)
- [ ] CHK-017 [P0] The working tree is unchanged after the run, proven by status and diff (SC-006)
- [ ] CHK-018 [P1] The broken condition used for the falsifiability run was fully reverted
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-019 [P1] `implementation-summary.md` records the verdict and the falsifiability run
- [ ] CHK-020 [P2] The receipt is legible to someone who did not run the gate
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-021 [P2] The receipt and gate output live in this folder's `scratch/`
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-022 [P0] `validate.sh` on this folder with `--strict` reports Errors: 0
- [ ] CHK-023 [P0] Every item above is `[x]` with evidence, or the phase is not complete
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

| Role | Condition |
|------|-----------|
| Builder | Gate run complete, receipt written |
| Verifier | Confirmed the gate can fail before accepting that it passed |
<!-- /ANCHOR:sign-off -->
