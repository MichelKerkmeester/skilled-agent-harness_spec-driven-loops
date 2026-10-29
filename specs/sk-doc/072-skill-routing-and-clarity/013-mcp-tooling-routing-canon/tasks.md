---
title: "Tasks: Phase 13: mcp-tooling-routing-canon"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "mcp tooling routing canon tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 13: mcp-tooling-routing-canon

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`H` is `.skilled/skills/mcp-tooling/SKILL.md`. `PS` is `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Count the SKILL.md files without a MACHINE ROUTER section on `origin/main`. Verify: the count prints 1 of 54, the `mcp-tooling` hub.
- [x] T002 Record that the strict check passes that hub (`H`). Verify: `package_skill.py .skilled/skills/mcp-tooling --check --strict` prints `Result: PASS` (`scratch/before.txt`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Rewrite SMART ROUTING as prose and add a final `## 6. MACHINE ROUTER` section (`H`). Verify: SMART ROUTING has 8 non-blank lines and `grep -c "MACHINE ROUTER" H` prints 2.
- [x] T004 Add RS-005 to the Python check (`PS`). Verify: the old `H` from `origin/main` returns the RS-005 warning and the new `H` returns none.
- [x] T005 [P] Add RS-005 to check 12b (`.skilled/commands/doctor/scripts/parent-skill-check.cjs`). Verify: the JS routing-shape suite passes.
- [x] T006 [P] Add an RS-005 case to both suites and give the clean fixtures the section (`.skilled/skills/sk-doc/scripts/tests/`, `.skilled/commands/doctor/scripts/tests/parent-skill-check-routing-shape.test.cjs`). Verify: pytest prints 270 passed.
- [x] T007 [P] List five codes in the canon docs and the two `/create:skill` workflow assets. Verify: `rg 'RS-001 to RS-004' .skilled` prints nothing.
- [x] T008 Bump versions and add changelogs for mcp-tooling 1.9.2.0, sk-create-skill 1.7.6.0 and sk-doc 2.3.30.0. Verify: `validate_document.py` reports 0 issues on each entry.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Count the SKILL.md files without the section on the final tree. Verify: the count prints 0 of 54.
- [x] T010 Regenerate the Hermes copies and the mcp-tooling route manifest and twin. Verify: `sync-skills-hermes.cjs --check` prints PASS and `compiled-route-guard.cjs --json` exits 0.
- [x] T011 Run the 38-gate set. Verify: every gate line ends with exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the old hub file fails RS-005 and the new one passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
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
- [x] CHK-003 [P1] The before state is recorded in `scratch/before.txt`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Both checks emit the same RS-005 message text
- [x] CHK-011 [P0] The comments name the durable reason and no ticket or phase id
- [x] CHK-012 [P1] RS-005 is accepted in a known-debt entry, like the other codes
- [x] CHK-013 [P1] The new rule follows the existing finding pattern in both files
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] The old hub file fails the new check with RS-005
- [x] CHK-022 [P1] A fenced `## MACHINE ROUTER` heading still does not count as the section
- [x] CHK-023 [P1] The RS-002 cases still isolate RS-002 with the appendix present
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding class: `class-of-bug`. The check let any skill with short prose skip the section.
- [x] CHK-FIX-002 [P0] Same-class inventory: a scan of all 54 SKILL.md files found one without the section.
- [x] CHK-FIX-003 [P0] Consumer inventory: both checks, their four test files, three canon docs and two workflow assets.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction surface changes.
- [x] CHK-FIX-005 [P1] Matrix: two checks by two cases (section present, section absent).
- [x] CHK-FIX-006 [P1] N/A: the checks read only the file under test and the ledger path.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the phase commit on `main`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] N/A: no new input surface
- [x] CHK-032 [P1] N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same files and codes
- [x] CHK-041 [P1] Code comments give the reason the section is required
- [x] CHK-042 [P2] The canon docs and the template list five codes
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Evidence files live in `scratch/`
- [x] CHK-051 [P1] scratch/ holds the two evidence files and nothing temporary
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-29
<!-- /ANCHOR:summary -->

---
