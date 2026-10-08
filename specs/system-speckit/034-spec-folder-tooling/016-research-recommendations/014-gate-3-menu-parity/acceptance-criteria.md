---
title: "Acceptance Criteria: Gate 3 menu parity"
description: "Verification conditions for this phase."
trigger_phrases:
  - "gate 3 menu parity acceptance"
  - "gate 3 constants parity verification"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria-core | v2.2 -->

# Acceptance Criteria: Gate 3 menu parity

<!-- ANCHOR:criteria -->

| Criterion | Given | When | Then | Verification | Status | Waiver |
|-----------|-------|------|------|--------------|--------|--------|
| R1: All 9 named presentations include the phrase | 9 files identified | Each file is checked | All 9 contain "in the same track" in option C | Grep each named file and confirm all 9 contain the phrase | Met — `rg -c 'existing packet in the same track'` returns 1 for each of the 9 files | - |
| R2: 3 deep contracts regenerated and include the phrase | Contracts are generated | compile-command-contracts.cjs is run | All 3 deep contracts contain "in the same track" in option C | Regenerate and grep each of the 3 contracts for the phrase | Met — `compile-command-contracts.cjs --write --command deep/{research,review,ai-council}` regenerated all 3; each contains the phrase once | - |
| R3: Parity test confirms all 12 files match the constant | Parity test is written | Test is executed on all 12 files | Test reports 0 mismatches and exits 0 | Run parity test on all 12 named files | Met — `node --test gate-3-menu-parity.test.mjs`: 12 pass, 0 fail; a planted stale option C line fails 1 of 12 | - |
| P1: Hook test baseline is unchanged | Hook tests are read | spec-gate-core.test.mjs:324 is checked | Byte-identity hash in baseline unchanged | Confirm baseline `plannedHash` at line 324 is unchanged | Met — `git diff` on `spec-gate-core.test.mjs` is empty; `plannedHash` at line 324 still reads `a180a01a…bf29` | - |
| P2: Constants remain source of truth | `spec-gate-core.mjs` is verified | Line 151 is read | `GATE_3_CHOICE_RELATED` unchanged | Read spec-gate-core.mjs:151 and confirm exact wording | Met — `git diff` on `spec-gate-core.mjs` is empty; line 151 holds the full wording ending in "in the same track" | - |
| R4: Phase validates strictly | All changes are in place | `validate.sh --strict` runs | No validation errors in the phase spec folder | Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/014-gate-3-menu-parity --strict` | Met — `validate.sh --strict` on this folder prints `RESULT: PASSED` | - |

<!-- /ANCHOR:criteria -->
