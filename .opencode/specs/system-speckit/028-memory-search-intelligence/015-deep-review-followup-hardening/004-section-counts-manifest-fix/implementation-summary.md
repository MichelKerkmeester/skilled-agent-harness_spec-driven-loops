---
title: "Implementation Summary: Section-Counts Manifest Fix"
description: "Delivery evidence for the SECTION_COUNTS spec.md per-doc template contract fix."
trigger_phrases:
  - "section counts implementation"
  - "section counts verification"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/015-deep-review-followup-hardening/004-section-counts-manifest-fix"
    last_updated_at: "2026-07-02T17:59:45Z"
    last_updated_by: "opencode-gpt-5.5"
    recent_action: "Implemented and verified the SECTION_COUNTS per-doc spec.md expectation fix"
    next_safe_action: "No follow-up required; packet is complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh"
      - ".opencode/skills/system-spec-kit/scripts/tests/test-validation-extended.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "opencode-032-004-section-counts"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Section-Counts Manifest Fix

<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| Status | Complete |
| Completed At | 2026-07-02T17:59:45Z |
| Implementer | opencode-gpt-5.5 |
| Primary File | `.opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh` |
| Suite Expectation File | `.opencode/skills/system-spec-kit/scripts/tests/test-validation-extended.sh` |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`_section_expected_spec_h2` now derives the minimum `spec.md` h2 count from the same per-document template contract mechanism already used by `plan.md`, pointed at `spec.md`.

The fallback remains level-specific and only applies when the helper returns `0`: Level 1 and Level 2 fall back to 7, Level 3 falls back to 14, and Level 3+ falls back to 18.

The full validation suite had stale expectations that `053-template-compliant-level2` should warn. That fixture now correctly passes, so the suite expectations were updated from `warn` to `pass`. No fixture content was changed.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

| Step | Result |
|------|--------|
| Helper truth | `contract <level> spec.md` returned header counts 7, 7, 14, 18 for levels 1, 2, 3, 3+ |
| Rule change | Removed cross-document `sectionGates` derivation from the shell rule |
| Test expectation update | Changed stale `053-template-compliant-level2` expected outcomes from `warn` to `pass` |
| Scratch fixture | Created a temporary thin Level 1 spec under this packet's `scratch/`, captured the warning, then deleted all scratch files |

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Outcome |
|----------|---------|
| Use per-doc contract | Keeps `spec.md` and `plan.md` expectations tied to their own templates |
| Preserve policy minima | Requirement and acceptance-scenario thresholds were not changed |
| Preserve severity | `SECTION_COUNTS` remains warn severity |
| Update stale suite expectations | A template-compliant Level 2 fixture now proves a clean pass instead of the removed false warning |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Command | Result |
|---------|--------|
| `node .opencode/skills/system-spec-kit/scripts/utils/template-structure.js contract 1 spec.md` | `headerRules` count 7 |
| `node .opencode/skills/system-spec-kit/scripts/utils/template-structure.js contract 2 spec.md` | `headerRules` count 7 |
| `node .opencode/skills/system-spec-kit/scripts/utils/template-structure.js contract 3 spec.md` | `headerRules` count 14 |
| `node .opencode/skills/system-spec-kit/scripts/utils/template-structure.js contract '3+' spec.md` | `headerRules` count 18 |
| `SPECKIT_RULES=SECTION_COUNTS bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/deep-loops/030-agent-loops-improved/001-reference-research --strict` | Before: `spec.md has 7 sections, expected at least 25`; after: `SECTION_COUNTS` passed with warnings 0 |
| `SPECKIT_RULES=SECTION_COUNTS bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit --strict` | Before: `spec.md has 10 sections, expected at least 39`; after: h2 warning absent, existing acceptance-scenario warning remains |
| `SPECKIT_RULES=SECTION_COUNTS bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .../scratch/thin-spec-check --strict` | `spec.md has 2 sections, expected at least 7 for Level 1` |
| `bash .opencode/skills/system-spec-kit/scripts/tests/test-validation-extended.sh` | Final run passed 113/113, `RESULT: PASSED` |
| `shellcheck .opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh` | Exit 0, no output |
| `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh .opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh .opencode/skills/system-spec-kit/scripts/tests/test-validation-extended.sh` | Exit 0, no output |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit/scripts/rules --root .opencode/skills/system-spec-kit/scripts/tests` | PASS, scanned 253 files, findings 0 |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/028-memory-search-intelligence/015-deep-review-followup-hardening/004-section-counts-manifest-fix --strict --verbose` | PASS, errors 0, warnings 0, `RESULT: PASSED` |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The Level 2 live folder still has an unrelated acceptance-scenario warning: `Found 3 acceptance scenarios, expected at least 4 for Level 2`. That policy was explicitly out of scope and remains unchanged.

Generated metadata was refreshed after documentation edits and strict spec validation passed with errors 0 and warnings 0.

<!-- /ANCHOR:limitations -->
