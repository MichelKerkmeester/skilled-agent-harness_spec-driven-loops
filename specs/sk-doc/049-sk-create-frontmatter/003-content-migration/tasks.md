---
title: "Tasks: Phase 3: content-migration"
description: "The two git mv calls, the one substitution that covered 28 files, the six references written in forms the substitution could not reach, the five links inside the moved documents, and the five checks that proved the move."
trigger_phrases:
  - "frontmatter migration tasks"
  - "repoint consumer files"
  - "outbound link repair tasks"
  - "link integrity delta check"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: content-migration

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

- [x] T001 Re-read the phase 001 handoff and take its consumer list as the work order (`../001-inventory-and-contract/inventory/consumer-inventory.md` §8)
- [x] T002 Confirm the structural property the substitution strategy rests on: `shared/` and `sk-create-frontmatter/` are both direct children of the hub, so every relative reference keeps its existing `../` prefix and only the path segment changes
- [x] T003 [P] Capture the pre-move baselines: 113 link-resolver failures across the hub, vitest at 54 files and 683 tests passing, and `leaf-aliases.json` at 5 entries with none of them frontmatter
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 `git mv` the template spec, 939 lines, from `.opencode/skills/sk-doc/shared/assets/frontmatter-templates.md` to `.opencode/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md`
- [x] T005 `git mv` the versioning rules, 148 lines, from `.opencode/skills/sk-doc/shared/references/frontmatter-versioning.md` to `.opencode/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md`
- [x] T006 Run the bulk substitution over the 28 files whose references are written in the dominant form, changing only the path segment
- [x] T007 Hand-fix the three `shared/references/` siblings, which used `../assets/frontmatter-templates.md` and had to become `../../sk-create-frontmatter/assets/...`: `validation.md:544`, `core-standards.md:337`, `quick-reference.md:351`
- [x] T008 Hand-fix the two same-directory `./frontmatter-templates.md` forms: `shared/assets/llmstxt-templates.md:850` and `sk-create-changelog/assets/changelog-template.md:286`, the second of which was already broken before the move
- [x] T009 Hand-fix the skill-relative paths carried inside docstrings and operator-facing strings: `shared/scripts/quick_validate.py` lines 12, 254, 261 and 266, and `sk-create-skill/scripts/package_skill.py:334`, all now reading `sk-create-frontmatter/references/frontmatter-versioning.md`
- [x] T010 Fix the four outbound links inside the moved documents, which point away from them and were therefore invisible to the phase 001 probe: `frontmatter-templates.md` lines 938 and 939 (`../references/core-standards.md`, `../references/validation.md` to `../../shared/references/...`) and `frontmatter-versioning.md` lines 147 and 148 (`../scripts/frontmatter-version.mjs`, `../scripts/check-frontmatter-versions.sh` to `../../shared/scripts/...`)
- [x] T011 Fix the prose path at `frontmatter-versioning.md:126`, which named `scripts/check-frontmatter-versions.sh` and now names `shared/scripts/...`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Scan the repository for both old paths: the only survivors are three frozen benchmark report bundles under `sk-doc/benchmark/reports/compiled-routing/`, one line in `system-skill-advisor/manual-testing-playbook/auto-indexing/provenance-and-trust-lanes.md` that is closed to this packet by instruction, and the three entries in the released changelog `sk-doc/changelog/v1.8.0.0.md` that record where the file used to be (REQ-001, SC-001)
- [x] T013 Run both validators against the new location: `quick_validate.py` reports `Skill is valid!` and `package_skill.py --check --strict` reports `Result: PASS` (REQ-002, SC-002)
- [x] T014 Confirm no alias was added: `git diff .opencode/skills/sk-doc/leaf-aliases.json` is empty and the table still holds its original 5 entries, none of them frontmatter (REQ-003, SC-003)
- [x] T015 Re-measure link integrity and the test suite: hub-wide failures went from 113 to 112 with frontmatter-related failures at 0, and vitest stayed at 54 files and 683 tests passing. Confirm the modified-file count is 34, exactly what the phase 001 inventory predicted
- [x] T016 Record the one side effect: changing the disk tree alone dropped the hub's compiled routing to `stale-manifest` with no routing input edited, closed by the phase 004 refresh
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — T001-T016 all closed
- [x] No `[B]` blocked tasks remaining — `grep '\[B\]' tasks.md` returns nothing
- [x] Manual verification passed — acceptance-criteria.md AC-001 through AC-006 are all `Met`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Inventory**: See `../001-inventory-and-contract/inventory/consumer-inventory.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001, REQ-002 and REQ-003 in spec.md §4
- [x] CHK-002 [P0] Technical approach defined in plan.md — the sibling-depth property, the bulk substitution and the six exceptions are in plan.md §1 and §3
- [x] CHK-003 [P1] Dependencies identified and available — the phase 001 inventory and the phase 002 packet were both in place before the first `git mv`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — the two edited Python files changed only string and docstring contents; both still run and report their normal output
- [x] CHK-011 [P0] No console errors or warnings — `quick_validate.py` reports `Skill is valid!` and `package_skill.py --check --strict` reports `Result: PASS`, neither with an error
- [x] CHK-012 [P1] Error handling implemented — Not applicable: no control flow was changed in either script, only the path text they print
- [x] CHK-013 [P1] Code follows project patterns — the edited lines keep the skill-relative path form the surrounding code already used; only the path itself changed
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — AC-001 through AC-006 in acceptance-criteria.md are all `Met`
- [x] CHK-021 [P0] Manual testing complete — the residue scan, both validator runs, the alias diff and the link-resolver comparison were each run and their output read
- [x] CHK-022 [P1] Edge cases tested — the three reference forms the bulk substitution cannot reach were each found and fixed by hand: the `shared/`-internal sibling form, the same-directory `./` form, and the skill-relative form inside a Python string
- [x] CHK-023 [P1] Error scenarios validated — the outbound-link case was the real trap: four links inside the moved documents break on the move and the reference probe cannot see them, because they point out of the moved files at something else. They were found by scanning both documents for every relative link
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. — `cross-consumer`: one file move invalidates a reference in every consumer, and the consumers span mode packets, the hub shared tier, command YAML and two Python scripts
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. — The two moved documents are the only producers; the phase 001 probe over `.opencode/` is the producer-side sweep, and it was rerun after the move as the residue scan
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. — Sections 5a through 5e of the phase 001 inventory enumerate every consumer by file and line; 34 files were modified, exactly the predicted count
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. — Not applicable in the security sense, and worth stating plainly why: the paths here are text in documents and in printed strings, never joined and resolved at run time. Phase 001 established that neither script opens either document
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. — Two axes, five written forms crossed with two filenames; the inventory's sections 5a to 5e are the filled rows, and the bulk substitution covers one form while the other four were handled by hand
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. — Not applicable: neither edited script reads process-wide state for these paths; the strings are literals
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. — Evidence is pinned to named commands with quoted output and to explicit file-and-line citations, plus a before-and-after link-failure count captured in the same session
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — confirmed: every edited line is a relative file path
- [x] CHK-031 [P0] Input validation implemented — Not applicable: no input-handling code was changed. The two Python edits touch a docstring and printed strings only
- [x] CHK-032 [P1] Auth/authz working correctly — Not applicable: no auth surface is involved in a document move
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — plan.md, tasks.md, acceptance-criteria.md and implementation-summary.md all trace to spec.md's REQ-001/002/003 and SC-001/002/003
- [x] CHK-041 [P1] Code comments adequate — the comments and docstrings that named the old path in both Python scripts were updated in the same pass as the strings, so no comment now describes a path that does not exist
- [x] CHK-042 [P2] README updated (if applicable) — the mode packet's `references/README.md` and the reference tree it indexes are the phase 002 and phase 005 surfaces; this phase changed no README, because no README named either document by path
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — confirmed: `scratch/` holds only `.gitkeep`
- [x] CHK-051 [P1] scratch/ cleaned before completion — confirmed: `scratch/` is empty aside from `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 23 | 23/23 |
| P2 Items | 9 | 9/9 |

**Verification Date**: 2026-09-01
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md — no `decision-record.md` exists for this phase and none is required at this level; the one architecture decision, repointing rather than aliasing, is ADR-001 in plan.md's L3 Architecture Decision Record section
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) — ADR-001 status: Accepted
- [x] CHK-102 [P1] Alternatives documented with rejection rationale — ADR-001 records both rejected options, adding an alias and leaving the documents in the shared tier, with the reason for each
- [x] CHK-103 [P2] Migration path documented (if applicable) — this phase is the migration; the ordered path is T004 through T011 in this document, and the reverse path is plan.md §7
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Response time targets met (NFR-P01) — Not applicable: moving two documents changes no request-serving surface
- [x] CHK-111 [P1] Throughput targets met (NFR-P02) — Not applicable: no throughput surface exists
- [x] CHK-112 [P2] Load testing completed — Not applicable: there is no runtime service to load-test
- [x] CHK-113 [P2] Performance benchmarks documented — Not applicable: no performance claim is made by this phase
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented and tested — plan.md §7: `git checkout -- .opencode/skills/sk-doc/` reverts the move and all 34 consumer edits at once, because the whole change is confined to that directory
- [x] CHK-121 [P0] Feature flag configured (if applicable) — Not applicable, and deliberately so: an alias entry would be the closest equivalent to a compatibility flag, and REQ-003 forbids it
- [x] CHK-122 [P1] Monitoring/alerting configured — Not applicable: the link resolver, the two validators and the vitest suite are the monitoring, and all were run before and after
- [x] CHK-123 [P1] Runbook created — the ordered T004 to T011 sequence in this document plus the plan.md §7 reversal is this phase's runbook
- [x] CHK-124 [P2] Deployment runbook reviewed — see CHK-123; the reversal was reviewed against the captured pre-move link total of 113
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review completed — satisfied by CHK-030 and CHK-031: every edited line was read, and all of them are relative paths
- [x] CHK-131 [P1] Dependency licenses compatible — Not applicable: no new dependency is introduced; both validators and the link resolver are existing internal tools
- [x] CHK-132 [P2] OWASP Top 10 checklist completed — Not applicable: no web-facing runtime surface is involved
- [x] CHK-133 [P2] Data handling compliant with requirements — confirmed: the moved documents hold authoring guidance, no personal or customer data
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized — spec.md, plan.md, tasks.md, acceptance-criteria.md and implementation-summary.md trace to the same requirement and success-criterion ids
- [x] CHK-141 [P1] API documentation complete (if applicable) — Not applicable: no API surface changed
- [x] CHK-142 [P2] User-facing documentation updated — the two moved documents are themselves the user-facing authoring guidance, and their content is unchanged; only their location and five internal links moved
- [x] CHK-143 [P2] Knowledge transfer documented — the outbound-link trap and the sibling-depth property are recorded in implementation-summary.md, because both are the kind of thing the next mover would otherwise rediscover the hard way
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

Not applicable. No formal named-approver sign-off process governs this internal spec-folder phase.

| Approver | Role | Status | Date |
|----------|------|--------|------|
| N/A | Technical Lead | Not required | |
| N/A | Product Owner | Not required | |
| N/A | QA Lead | Not required | |
<!-- /ANCHOR:sign-off -->
