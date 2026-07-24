---
title: "Verification Checklist: Code READMEs (Design, Prompt, Spec-Kit Batch)"
description: "Verification evidence that all thirty-eight in-scope code READMEs are valid, accurate, HVR-clean, and that the seven exclusions are honored and recorded."
importance_tier: "normal"
contextType: "implementation"
status: "complete"
completion_pct: 100
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/021-documentation-quality-program/006-code-readmes-design-prompt-speckit"
    last_updated_at: "2026-07-22T13:46:50Z"
    last_updated_by: "claude"
    recent_action: "Verified all thirty-eight READMEs and the seven exclusions."
    next_safe_action: "Proceed to phase 007."
    blockers: []
    key_files: []
---

# Verification Checklist: Code READMEs (Design, Prompt, Spec-Kit Batch)

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

- [x] CHK-001 [P1] The `design-mcp-open-design` tests duplicate confirmed byte-identical
  - **Evidence**: `cmp -s __tests__/transport-grounding.test.mjs tests/transport-grounding.test.mjs` returned BYTE-IDENTICAL, and `tests/` is the more recent git-touched copy
- [x] CHK-002 [P1] The scan filtered to thirty-eight with the exclusions recorded
  - **Evidence**: `phase-006-author.txt` holds 38 folders and `phase-006-excluded.txt` holds the 6 seed folders plus the 1 stale `__tests__`

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P1] Every in-scope folder carries a `README.md` with a numbered ALL-CAPS OVERVIEW
  - **Evidence**: the reconcile loop found no `MISSING` folder across the thirty-eight
- [x] CHK-011 [P1] Every CONTENTS-table entry names a real direct file
  - **Evidence**: the scoped CONTENTS cross-check reported `0` mismatches (`c6-mismatch.txt` empty)
- [x] CHK-012 [P2] Layered library folders carry a boundary or architecture note
  - **Evidence**: `system-spec-kit/mcp-server/lib/storage/ports/README.md` (73 lines) documents the five typed ports and their adapters while flat folders stay lean

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P1] All thirty-eight READMEs clear the floor validator
  - **Evidence**: the reconcile loop reported `ALL VALID` running `validate_document.py --type readme` on each, independently of the author self-reports
- [x] CHK-021 [P1] Em-dash and semicolon sweep returns zero across all thirty-eight
  - **Evidence**: the reconcile loop reported `HVR-dirty: 0`

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P1] The seven excluded folders received no README
  - **Evidence**: the exclusion check found no `VIOLATION` across `phase-006-excluded.txt`
- [x] CHK-031 [P2] Author findings recorded for follow-up
  - **Evidence**: the stale `score-variant.cjs` `RIG_ROOT` path, the unused `dispatch-swe16.cjs`, and the `offline-fixtures.mjs` runtime use are noted in the relevant folder READMEs

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P1] No code changed and no fixture polluted
  - **Evidence**: only new `README.md` files were added under the thirty-eight folders, and no `benchmarks/*/seed/` folder was touched

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] The `shared/ipc` re-export relationship is documented accurately
  - **Evidence**: `shared/ipc/README.md` states the three `socket-server.ts` siblings are re-export wrappers of the canonical file, not separate implementations
- [x] CHK-051 [P2] The stale duplicate is flagged for an operator delete decision
  - **Evidence**: `design-mcp-open-design/__tests__` is recorded in the parent `context-index.md` as a delete candidate

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] No stray files added outside the target folders
  - **Evidence**: only the thirty-eight `README.md` files and this phase's spec docs changed; the author and exclusion lists live in the scratchpad

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 0 | 0/0 |
| P1 Items | 9 | 9/9 |
| P2 Items | 4 | 4/4 |

**Verification Date**: 2026-07-22
**Verified By**: AI Assistant (Claude)

<!-- /ANCHOR:summary -->
