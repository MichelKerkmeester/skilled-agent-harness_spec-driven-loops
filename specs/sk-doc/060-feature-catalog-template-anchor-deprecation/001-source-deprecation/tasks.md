---
title: "Tasks: Phase 1: source-deprecation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "source deprecation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: source-deprecation

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

- [x] T001 Census every `sk-doc-template:` value and spelling across tracked files (git grep)
- [x] T002 Inventory readers in code and config: none found (git grep over .py/.cjs/.mjs/.js/.ts/.sh/.json/.yaml/.toml)
- [x] T003 Trace the origin: commit `7d7650471d` added the marker to the template and 588 snippets
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Drop the marker from the per-feature scaffold (assets/feature-catalog-template.md)
- [x] T005 Drop the marker and its checklist line (assets/feature-catalog-snippet-template.md)
- [x] T006 Drop the marker from both worked examples (references/examples.md)
- [x] T007 Bump to 1.0.2.0 and add the changelog entry (SKILL.md, changelog/v1.0.2.0.md)
- [x] T008 Regenerate the Hermes copy (sync-skills-hermes.cjs)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run validate_document.py on the five edited mode files: all exit 0
- [x] T010 Run test_validator_fixtures.py: ALL PASS
- [x] T011 Run sync-skills-hermes.cjs --check: PASS, 70 copies in sync
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

- [x] CHK-010 [P0] Code passes lint/format checks (validate_document.py exit 0 on every edited file)
- [x] CHK-011 [P0] No console errors or warnings
- [x] CHK-012 [P1] Error handling implemented: not applicable, documentation only
- [x] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete
- [x] CHK-022 [P1] Edge cases tested: the hyphenated spelling is handed to phase 2
- [x] CHK-023 [P1] Error scenarios validated: not applicable
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `class-of-bug` (one producer, many stamped copies)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: only the two feature catalog assets emit the marker
- [x] CHK-FIX-003 [P0] Consumer inventory completed: no code, config or test reads it
- [x] CHK-FIX-004 [P0] Security/path/parser fixes: not applicable
- [x] CHK-FIX-005 [P1] Matrix axes: two spellings, handled in phase 2
- [x] CHK-FIX-006 [P1] Hostile env variant: not applicable
- [x] CHK-FIX-007 [P1] Evidence pinned to the phase commit
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented: not applicable
- [x] CHK-032 [P1] Auth/authz working correctly: not applicable
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate: not applicable
- [x] CHK-042 [P2] README updated (if applicable): not applicable, the README never named the marker
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-10
<!-- /ANCHOR:summary -->

---
