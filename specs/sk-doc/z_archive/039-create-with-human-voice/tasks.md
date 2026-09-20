---
title: "Tasks: Add the sk-create-with-human-voice mode packet to the sk-doc hub"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "human voice mode tasks"
  - "section 7 wiring tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Add the sk-create-with-human-voice mode packet to the sk-doc hub

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the three baselines before the first edit (`scratch/baseline-*.txt`)
- [x] T002 Read the section 7 integration contract and both precedent packets
- [x] T003 [P] Confirm the level with `recommend-level.sh --loc 1400 --files 24`, which returned Level 2, phases NO
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the scanner, parsing the standard by section title (`sk-create-with-human-voice/scripts/hvr_scan.py`)
- [x] T005 Write the scope gate, which is the mode's own content and absent from the standard (`references/scope-and-exemptions.md`)
- [x] T006 Write the scoring and verification reference (`references/scoring-and-verification.md`)
- [x] T007 Write the reference router, the report template and the scripts README
- [x] T008 Write `SKILL.md` and `README.md`, and the v1.0.0.0 changelog entry
- [x] T009 Surface 1: register the mode with ten unique aliases (`mode-registry.json`)
- [x] T010 Surfaces 2 and 3: router signal, vocabulary class and tie-break entry (`hub-router.json`)
- [x] T011 Surfaces 4 and 5: widen the `HVR` intent, repoint its leaves, extend `FULL_INVENTORY`, correct the wrong gloss (`ROUTER.md`)
- [x] T012 Surface 7: mode table row, packet counts, layout, fallback checklist, keywords (`SKILL.md`)
- [x] T013 Surface 8: doctor description and keywords (`description.json`)
- [x] T014 Surface 6: advisor vocabulary (`graph-metadata.json`)
- [x] T015 Surface 9: regenerate the leaf manifest with the generator, never by hand
- [x] T016 Hub README: overview, command list and document map
- [x] T017 Write the command router, presentation contract and both workflow YAMLs
- [x] T018 Add the `command-metadata.json` entry
- [x] T019 Surface 11: run the three mirror generators for the four runtime surfaces
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Dirty and clean fixture controls, including the fenced-block and inline-code masking check
- [x] T021 Negative control: rename a section of the standard and confirm the run stops at exit 2
- [x] T022 Control: renumber a section and confirm the result is unchanged
- [x] T023 Replay seven phrasings through `router-replay.cjs`, covering the mode and both siblings sharing voice vocabulary
- [x] T024 Confirm the advisor surfaces `sk-doc` for two voice phrasings
- [x] T025 Run all three required gates and confirm the two pre-existing red results are unchanged
- [x] T026 Fill the spec documents and reconcile completion metadata
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Scanner runs clean on Python 3.9, the runtime the repository ships
- [x] CHK-011 [P0] No warnings from `package_skill.py --check --strict`
- [x] CHK-012 [P1] Error handling: unreadable target, unreadable standard and an under-parsed standard each exit 2 with a message
- [x] CHK-013 [P1] Follows the packet layout and the frontmatter contract the sibling packets use
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete: seven replays, two advisor runs, four scanner controls
- [x] CHK-022 [P1] Edge cases tested: empty input, fenced block, inline code, frontmatter, renamed section, renumbered section
- [x] CHK-023 [P1] Error scenarios validated: missing standard, renamed section, unreadable target
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded. This packet is an addition, not a fix, apart from one `class-of-bug` correction: the `ROUTER.md` gloss calling HVR the "hidden-variation rule"
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `grep -rn "hidden-variation" .opencode/` now returns zero, so the one occurrence was the whole class
- [x] CHK-FIX-003 [P0] Consumer inventory for the standard's path completed by grep before deciding not to move it
- [x] CHK-FIX-004 [P0] The scanner's masking is the security-shaped surface here, and its adversarial cases (fenced block, inline span, frontmatter, malformed fence) are covered by the dirty fixture
- [x] CHK-FIX-005 [P1] Routing matrix axes listed: seven phrasings across the mode and two siblings
- [x] CHK-FIX-006 [P1] The scanner reads no process-wide state, so no hostile-env variant applies
- [x] CHK-FIX-007 [P1] Evidence is command output captured in `scratch/`, not a branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation: the scanner validates its own parse against declared floors and refuses to proceed below them
- [x] CHK-032 [P1] No auth surface. The scanner reads files and writes nothing
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments explain why the parser keys on titles and why masking preserves length
- [x] CHK-042 [P2] Hub README updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] Working copies of the mutated standard were written to the session scratchpad, never into the repository
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-31
<!-- /ANCHOR:summary -->

---
