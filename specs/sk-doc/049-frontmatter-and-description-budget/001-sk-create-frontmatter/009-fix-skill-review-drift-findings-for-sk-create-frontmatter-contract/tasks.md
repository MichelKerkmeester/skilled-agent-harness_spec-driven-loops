---
title: "Task Breakdown: fix the skill-review drift findings in the sk-create-frontmatter contract"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "frontmatter drift tasks"
  - "hub description trim tasks"
  - "contract correction checklist"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: fix the skill-review drift findings in the sk-create-frontmatter contract

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Baseline the advisor on the seventeen declared triggers and eight hub-shaped prompts, recording `freshness` (rows in `implementation-summary.md` section 4)
- [x] T002 Baseline the description audit and the compiled-routing guard before any routing input changes
- [x] T003 Reproduce each contract drift site by grep and by reading the validator it names
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Correct the parse diagram, the section 5 length limits and spec rule, and the checklist lines to what the validators enforce (`sk-create-frontmatter/assets/frontmatter-templates.md`)
- [x] T005 State the checker's real default mode and walk scope on the reference, asset and README notes, with the script's path (`sk-create-frontmatter/assets/frontmatter-templates.md`)
- [x] T006 List `gate` in the engine usage text (`sk-doc/shared/scripts/frontmatter-version.mjs`)
- [x] T007 Add sections 7 and 8 the packaging gate recommends, and the spaced alias to the keyword list (`sk-create-frontmatter/SKILL.md`)
- [x] T008 Add an overview section to the references router (`sk-create-frontmatter/references/README.md`)
- [x] T009 Add `trigger phrases` to the mode's aliases and `version field` plus `trigger phrases` to stage one (`sk-doc/mode-registry.json`, `sk-doc/graph-metadata.json`)
- [x] T010 Trim the hub description to the per-skill soft target, keeping the name, verb and domain tokens (`sk-doc/SKILL.md`)
- [x] T011 Re-mint the activation manifests, rebuild the canary artifacts and re-pin the digest set for the hub edit
- [x] T012 Reconcile the parent `goal.md` progress and criteria, the parent `spec.md` metadata residue and phase map, and phase 008's titles, checklist and session ids
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Replay the advisor on the same trigger set and hub prompts, and replay the new alias against out-of-domain phrases
- [x] T014 Run the engine tests, the packaging gate, the document validator, the playbook package validator, the link check and the human-voice scanner on every edited file
- [x] T015 Run `parent-skill-check.cjs`, `compiled-route-guard.cjs`, `compiled-route-sync.cjs --verify` and `validate-canary.cjs` against the hub
- [x] T016 Apply versions to the edited mode documents, run the corpus gate, regenerate packet metadata and run `validate.sh --strict` on every folder of the packet
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

- [x] CHK-010 [P0] Code passes lint/format checks, the engine tests run clean after the usage-text edit
- [x] CHK-011 [P0] No console errors or warnings, every gate exits 0 with its affirmative marker
- [x] CHK-012 [P1] Error handling implemented, not applicable, no control flow changed
- [x] CHK-013 [P1] Code follows project patterns, the usage string follows the file's own format
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met, see `acceptance-criteria.md`
- [x] CHK-021 [P0] Manual testing complete, advisor replays before and after
- [x] CHK-022 [P1] Edge cases tested, the zero-scoring alias and the checker's shape mode
- [x] CHK-023 [P1] Error scenarios validated, guard stale after the hub edit and fresh after the re-mint
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class, recorded in `implementation-summary.md`
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed by grep over the mode for every corrected phrase
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the alias list across the three files that carry it
- [x] CHK-FIX-004 [P0] No security, path, parser or redaction fix in this phase
- [x] CHK-FIX-005 [P1] Matrix axes listed: eighteen triggers, eight hub prompts, four out-of-domain phrases
- [x] CHK-FIX-006 [P1] No test or code here reads process-wide state
- [x] CHK-FIX-007 [P1] Evidence pinned to the working tree at the close of this session, named in the summary
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented, not applicable, no input path changed
- [x] CHK-032 [P1] Auth/authz working correctly, not applicable
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate, the usage string carries the standard's path as before
- [x] CHK-042 [P2] README updated, the mode README needed no change and says so in the summary
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
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-05
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [x] CHK-103 [P2] Migration path documented, not applicable, no migration
<!-- /ANCHOR:arch-verify -->
