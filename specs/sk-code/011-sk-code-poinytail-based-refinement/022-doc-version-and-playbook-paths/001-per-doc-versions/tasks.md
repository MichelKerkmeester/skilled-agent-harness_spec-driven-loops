---
title: "Tasks: Per-doc versions"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "per doc versions tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Per-doc versions

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

- [x] T001 Measure the baseline: `frontmatter-version.mjs verify` and `gate`, `package_skill.py --check --strict` on every skill, the git-hook tests and the citation gate (scratch measure files)
- [x] T002 Read the spec-remint gate in `.skilled/scripts/git-hooks/pre-commit` and its tests before writing the new gate
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 PV-R1: restore the lines 31888d05bb removed, with their prior values, in one deterministic script run and its own commit (child docs under `.skilled/skills/`)
- [x] T004 PV-R2: rewrite the contract and the bump rule (`.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md`)
- [x] T005 PV-R3: widen the engine scope and change `verify`, and move the two scope mirrors with it (`frontmatter-version.mjs`, `package_skill.py`, `post-edit-router.cjs`)
- [x] T006 PV-R4: add the auto-bump gate and its bypass (`.skilled/scripts/git-hooks/pre-commit`, `.skilled/scripts/git-hooks/lib/gates.tsv`)
- [x] T007 PV-R5: add the pull-request check (`.github/workflows/skill-doc-frontmatter.yml` or a sibling)
- [x] T008 [P] PV-R6: seed `version: 1.0.0.0` in every sk-doc doc template (`.skilled/skills/sk-doc/*/assets/`)
- [x] T009 [P] PV-R7: confirm the 61 docs that kept a frontmatter version are valid and in scope
- [x] T010 Re-anchor the citations the restore shifted
- [x] T011 PV-R8: bump sk-doc once with one changelog entry (`.skilled/skills/sk-doc/SKILL.md`, `.skilled/skills/sk-doc/changelog/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Write T1 to T4 and record before and after exits in the Tests table (`implementation-summary.md`)
- [x] T013 Rerun the baseline measures and record the deltas
- [x] T014 Fill the ledger, then run `check-goal.cjs` and strict `validate.sh`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: every review finding reproduced in a throwaway repository before its fix
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
- [x] CHK-003 [P1] Dependencies identified and available: the spec-remint gate read before the new gate was written
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks: `node --check` on the engine, actionlint exit 0 on the workflow, `bash -n` via the hook tests
- [x] CHK-011 [P0] No console errors or warnings: T1 to T9 exit 0
- [x] CHK-012 [P1] Error handling implemented: the gate blocks with a named message when it cannot re-stage (T1 partial-staging and pathspec cases)
- [x] CHK-013 [P1] Code follows project patterns: the gate mirrors the spec-remint gate (re-stage, `next-index-*` block, gates.tsv bypass)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 to REQ-009): `acceptance-criteria.md` AC-001 to AC-009 Met
- [x] CHK-021 [P0] T1 to T4 fail before and pass after: Tests table in `implementation-summary.md`
- [x] CHK-022 [P1] Edge cases tested: new doc, version-only change, quoted value, partly staged doc (T1, T2)
- [x] CHK-023 [P1] Error scenarios validated: malformed version, pathspec-narrowed commit (T1, T2, T8)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented: the gate reads only staged paths under `.skilled/skills/`, and refuses a line-break path or a symlinked doc (T8)
- [x] CHK-032 [P1] Auth/authz working correctly: not applicable, no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate: the packager comment names its two deliberate scope differences
- [x] CHK-042 [P2] README updated (if applicable): git-hooks README gate counts
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only: build temp files lived in the session scratchpad, outside the repository
- [x] CHK-051 [P1] scratch/ cleaned before completion: only `.gitkeep` remains
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-12
<!-- /ANCHOR:summary -->
