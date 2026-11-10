---
title: "Tasks: Phase 3: context-type-unification"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "context type unification tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: context-type-unification

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

- [x] T001 Capture baselines: `shared` tests, CLI vitest, advisor suite, advisor `--coverage` (`implementation-summary.md`). CLI 1648 passed, advisor 1082 passed, `--coverage` 101 docs and 0 violations, all before the first edit
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Create the shared data file (`.skilled/skills/system-spec-kit/shared/frontmatter-values.json`)
- [x] T003 Re-export it and add the new lists (`.skilled/skills/system-spec-kit/shared/context-types.ts`)
- [x] T004 Import the shared lists (`runtime/cli/utils/input-normalizer.ts`, `runtime/cli/extractors/session-extractor.ts`, `runtime/cli/lib/frontmatter-migration.ts`)
- [x] T005 Add the warn rule and its registry entry (`runtime/cli/rules/check-frontmatter-values.sh`, `runtime/cli/lib/validator-registry.json`)
- [x] T006 [P] Warn on values outside the list (`.skilled/skills/sk-doc/shared/scripts/validate_document.py`)
- [x] T007 [P] Read the JSON in the advisor checker (`.skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs`)
- [x] T008 Fix generators that seed values (`.skilled/commands/create/assets/`, `.skilled/commands/speckit/assets/speckit-save-context-tail.yaml`, spec-kit templates). None needed a change: 96 templates and assets checked, 89 carry `contextType`, 0 warnings. The `files` value in the save tail is an anchor-ID prefix, not a frontmatter value
- [x] T009 Map outlier docs to canonical values, then repair derived metadata in each touched packet (`scratch/cleanup.py`, `scratch/cleanup-report.json`). 102 docs in 57 packets plus one by hand
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Tests for the shared lists and the CLI behavior on `review`, `planning`, `debugging` and `decision`. `shared` 18/18, sk-doc 7/7, advisor checker 2/2, three phase cases in `phase-status-from-payload.vitest.ts`, and a probe of the built CLI shows no mismatch against the HEAD lists
- [x] T011 Corpus sweep prints zero warnings, and a doc from each generator passes (`scratch/sweep-before.tsv` 102 lines, `scratch/sweep-after.tsv` 0 lines)
- [x] T012 Rerun the baselines and report the delta. CLI and `shared` unchanged, advisor +2 for the new tests, `--coverage` unchanged, and 58 packets with 0 changed rule sets (`implementation-summary.md` Verification)
- [x] T013 Run `/doctor:skill-advisor` and `/doctor:skill-graph-freshness` checks. Freshness panel reports no drift. `skill_graph_validate` is valid with 0 errors; its 14 warnings are all the existing `sanitizer_version` class. `advisor_status` is live with 14 skills. Only the route's read-only commands ran
- [ ] T014 Write `implementation-summary.md` and run `validate.sh --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

- [x] CHK-001 [P0] Requirements documented in spec.md: REQ-001 to REQ-007 in spec.md section 4
- [x] CHK-002 [P0] Technical approach defined in plan.md: plan.md
- [x] CHK-003 [P1] Dependencies identified and available: the phase 002 decisions, approved by the operator (`../002-baseline-and-decisions/decision-record.md`)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks: `npm run lint` exit 0 in `runtime/cli`; `node --check` on both helpers; `py_compile` on `validate_document.py`
- [x] CHK-011 [P0] No console errors or warnings: CLI suite exit 0 with no failed test (implementation-summary.md:120)
- [x] CHK-012 [P1] Error handling implemented: an unreadable shared list makes the rule warn that the check was skipped, and an unreadable doc is skipped (`check-frontmatter-values.sh`)
- [x] CHK-013 [P1] Code follows project patterns: registry-driven shell rule with a node helper, the shape of the existing rules
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met: six of seven met; AC-006 waits for the commit (acceptance-criteria.md:62)
- [x] CHK-021 [P0] Manual testing complete: planted-value probe warns and never errors (implementation-summary.md:122)
- [x] CHK-022 [P1] Edge cases tested: aliases pass, `discovery` accepted on save, three phase cases (implementation-summary.md:121)
- [x] CHK-023 [P1] Error scenarios validated: the D1 proof over 191 folders shows no result change (implementation-summary.md:125)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: not applicable: this phase builds a feature and fixes no review finding
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.: every literal value list was found by grep and moved to the shared file: the session extractor, the migration, `validate_document.py` and the advisor checker
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.: the same four consumers read the shared file, and each has a test (implementation-summary.md:116-121)
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.: not applicable: no security, path or parser fix
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.: 58 packets by HEAD and edited content, 191 folders (implementation-summary.md:125)
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.: not applicable: the rule reads no environment variable
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.: evidence is the uncommitted diff on `5285608745fe`; the commit is held by root D4
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets: a pattern scan of the whole program diff found none
- [x] CHK-031 [P0] Input validation implemented: values are checked against the shared list, and an off-list value warns
- [x] CHK-032 [P1] Auth/authz working correctly: not applicable: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized: spec, plan and tasks describe the same build
- [x] CHK-041 [P1] Code comments adequate: comments state the why and carry no packet labels
- [x] CHK-042 [P2] README updated (if applicable): spec-kit README and ARCHITECTURE registry counts updated, enforced by `validator-registry-doc-count.vitest.ts`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only: all helper scripts and captures are in `scratch/`
- [x] CHK-051 [P1] scratch/ cleaned before completion: kept on purpose: the summary cites `d1-proof.json`, the sweep TSVs and the CLI summaries as evidence
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-04
<!-- /ANCHOR:summary -->

---



