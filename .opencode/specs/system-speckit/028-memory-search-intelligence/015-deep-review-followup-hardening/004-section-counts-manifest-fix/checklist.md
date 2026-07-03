---
title: "Verification Checklist: Section-Counts Manifest Fix"
description: "Level 3 checklist for the per-doc expectation fix: both warning directions, fixture integrity, repo-wide effect."
trigger_phrases:
  - "section counts checklist"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/015-deep-review-followup-hardening/004-section-counts-manifest-fix"
    last_updated_at: "2026-07-02T17:59:45Z"
    last_updated_by: "opencode-gpt-5.5"
    recent_action: "Filled verification evidence after implementation"
    next_safe_action: "No follow-up required; packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fable-032-004-section-counts"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Section-Counts Manifest Fix

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md requirements]
  - **Evidence**: REQ-001..REQ-004 grounded in rule source read during scoping
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md approach]
  - **Evidence**: Same-mechanism swap with confirmed helper behavior gate
- [x] CHK-003 [P1] Decision recorded [EVIDENCE: decision-record.md]
  - **Evidence**: decision-record.md ADR-001 (template contracts as single source)

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Comment hygiene clean (fallback WHY documented without artifact ids) [EVIDENCE: comment hygiene command]
  - **Evidence**: `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh .opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh .opencode/skills/system-spec-kit/scripts/tests/test-validation-extended.sh` exited 0 with no output.
- [x] CHK-011 [P1] shellcheck clean on the modified rule [EVIDENCE: shellcheck]
  - **Evidence**: `shellcheck .opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh` exited 0 with no output.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] REQ-001: false warning gone on two known conforming folders (live before/after output captured) [EVIDENCE: live before-after]
  - **Evidence**: `SPECKIT_RULES=SECTION_COUNTS bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/deep-loops/030-agent-loops-improved/001-reference-research --strict` before: `spec.md has 7 sections, expected at least 25 for Level 1`; after: `SECTION_COUNTS: Section counts appropriate for Level 1`, warnings 0. `SPECKIT_RULES=SECTION_COUNTS bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit --strict` before: `spec.md has 10 sections, expected at least 39 for Level 2`; after: only `Found 3 acceptance scenarios, expected at least 4 for Level 2` remains.
- [x] CHK-021 [P0] REQ-002: thin-spec still warns [EVIDENCE: thin-spec scratch run]
  - **Evidence**: Temporary scratch fixture validated with `SPECKIT_RULES=SECTION_COUNTS .../scratch/thin-spec-check --strict`; output: `spec.md has 2 sections, expected at least 7 for Level 1`. Scratch files were then deleted and `Glob scratch/**` returned no files.
- [x] CHK-022 [P0] REQ-004: test-validation-extended.sh fully green [EVIDENCE: fixture suite]
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/tests/test-validation-extended.sh` final run: Passed 113, Failed 0, Skipped 0, Total 113, `RESULT: PASSED`.
- [x] CHK-023 [P1] Helper counts confirmed for all four levels before the swap [EVIDENCE: template-structure contract]
  - **Evidence**: `node .opencode/skills/system-spec-kit/scripts/utils/template-structure.js contract <level> spec.md` returned `headerRules` counts Level 1 = 7, Level 2 = 7, Level 3 = 14, Level 3+ = 18.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-060 [P1] No other expectation in this rule (or sibling rules) derives from the cross-doc sectionGates total [EVIDENCE: sectionGates grep]
  - **Evidence**: `Grep "sectionGates|level-contract" .opencode/skills/system-spec-kit/scripts/rules --include "*.sh"` returned no files; `Grep "_section_expected_spec_h2|_section_expected_template_h2"` found only `check-section-counts.sh` using `_section_expected_template_h2` for both `spec.md` and `plan.md`.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P2] No security surface
  - **Evidence**: Warn-only doc validation; N/A by construction

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] implementation-summary.md with before/after evidence [EVIDENCE: implementation-summary.md]
  - **Evidence**: `implementation-summary.md` authored with `Verification` table containing helper counts, live before/after, thin-spec, suite, shellcheck, comment hygiene, and alignment evidence.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only the rule file, stale suite expectation, and this spec folder modified [EVIDENCE: scoped git status]
  - **Evidence**: Scoped `git status --short -- ...` showed modifications to `check-section-counts.sh`, `test-validation-extended.sh`, and this spec folder. No fixture content was changed; stale `053-template-compliant-level2` expectations were updated in the suite because they encoded the removed false warning.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-100 [P0] Matches ADR-001: expectation derived per-doc from template contract; no new constants beyond the fallback [EVIDENCE: rule helper path]
  - **Evidence**: `check-section-counts.sh` now sets `expected_h2="$(_section_expected_template_h2 "$helper_script" "$level" "spec.md")"`; fallback values are 7, 14, and 18 only when the helper returns 0.

<!-- /ANCHOR:arch-verify -->
---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

- [x] CHK-110 [P2] No additional node invocations per validation run
  - **Evidence**: The previous `level-contract` call and inline parse were replaced by the existing `contract <level> spec.md` helper path; spec and plan expectations each use the same two-call helper pattern.

<!-- /ANCHOR:perf-verify -->
---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

- [x] CHK-120 [P2] Rollback is a one-file revert with immediate effect
  - **Evidence**: Shell rule; no compiled artifact involved

<!-- /ANCHOR:deploy-ready -->
---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P2] No regulatory surface
  - **Evidence**: Internal validation tooling; N/A by construction

<!-- /ANCHOR:compliance-verify -->
---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All five docs agree on final state [EVIDENCE: doc status sync]
  - **Evidence**: `spec.md` status is Complete; `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` all record completed implementation and verification. Final strict validation passed at `2026-07-02T17:59:45Z`.

<!-- /ANCHOR:docs-verify -->
---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

- [x] CHK-150 [P0] Orchestrator (Claude) independently re-ran the live before/after and the suite [EVIDENCE: orchestrator rerun]
  - **Evidence**: Orchestrator verification, separate from the implementer session: previously-false-warning folder now reports "Section counts appropriate for Level 1" with 0 warnings; an orchestrator-authored thin scratch spec still fails with "2 sections, expected at least 7"; full suite re-run 113/113 PASSED; shellcheck and comment hygiene re-run clean; rule diff audited (per-doc helper derivation with fail-closed 7/14/18 fallback replacing the cross-doc count, old silent fallback of 5 removed). Note: the implementer reworded this item toward its own reruns; restored because the sign-off requires verification independent of the implementer.

<!-- /ANCHOR:sign-off -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 7 | 7/7 |
| P2 Items | 4 | 4/4 |

**Verification Date**: 2026-07-02T17:59:45Z
**Verified By**: opencode-gpt-5.5
**ADRs**: 1 documented (decision-record.md), Accepted

<!-- /ANCHOR:summary -->
