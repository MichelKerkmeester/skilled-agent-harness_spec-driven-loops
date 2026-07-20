---
title: "Tasks: sk-doc Template Alignment"
description: "Task breakdown for the trigger_phrases claim fix, topology quote-tolerance, the 12-value test-type taxonomy, the strict package validator, and the P4 lockstep directive-surface manifest (Planned)."
trigger_phrases:
  - "sk-doc template alignment tasks"
  - "lockstep manifest task list"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: sk-doc Template Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

**Focus**: Doc-truth fixes + quote-tolerance.

- [ ] T001 [P] Remove/correct the trigger_phrases routing claim in `feature-catalog-snippet-template.md` (~L41).
- [ ] T002 [P] Sweep `feature-catalog-template.md` for the same claim and align wording.
- [ ] T003 [P] Make `validate-playbook-topology.cjs`'s frontmatter/typed-gold parsing quote-tolerant (~L95 area).
- [ ] T004 Document one canonical typed-gold serialization.
- [ ] T005 Add a quoted-value fixture and an unquoted-value fixture for the topology validator.

**Evidence**: `grep -n "drives skill-advisor routing" feature-catalog-snippet-template.md feature-catalog-template.md` returns no hit (or an accurate, harvester-scoped claim if T012 ships first); both topology fixtures parse to identical structured output.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Focus**: Taxonomy, strict package validator, lockstep manifest.

- [ ] T006 Run a fresh census of the live corpus's SOURCE FILES Type-column values.
- [ ] T007 [B: T006] Define the 12-value canonical test-type taxonomy from the census, with zero unmapped stragglers.
- [ ] T008 [B: T007] Update `validate_document.py`'s `allowed` set to the 12-value taxonomy.
- [ ] T009 [B: T007] Update `feature-catalog-snippet-template.md`'s "Type column valid values" line to match.
- [ ] T010 [P] Author `validate_catalog_package.py`: router/advisor-central + 7-hub bijection, source-path existence, taxonomy conformance.
- [ ] T011 [P] Author `compiled-routing-lockstep-surfaces.json` naming all 9 lockstep surfaces (7 hub SKILL.md + 2 create-skill parent templates).
- [ ] T012 [B: T011] Author `compiled-routing-lockstep-parity.test.cjs` reading the manifest from T011.

**Evidence**: `validate_catalog_package.py` reports zero violations on a clean corpus and fails each seeded violation class by name; the parity test passes clean and fails on a seeded drift, naming the drifted surface; the taxonomy accounts for 100% of the T006 census with zero unmapped values.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

**Focus**: Stretch harvester extension (P1), then final verification.

- [ ] T013 [P1] Extend `doc-frontmatter.ts`'s `HARVEST_SUBDIRS` to a capped, explicitly-scored feature-catalog leaf path.
- [ ] T014 [P1][B: T013] Add an invariance test proving no score/rank change for any currently-harvested `references/`/`assets/` doc.
- [ ] T015 Re-hash the three frozen scorer files before and after this child's full diff; confirm unchanged.
- [ ] T016 Run `validate.sh --strict` on this child folder.

**Evidence**: the invariance test passes; pre/post SHA-256 identical for `router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`; `validate.sh --strict` reports Errors: 0.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements (REQ-001..REQ-004) implemented and evidenced.
- [ ] P1 requirements (REQ-005, REQ-006) implemented or explicitly deferred with user approval.
- [ ] Frozen scorer digests unchanged.
- [ ] No routing decision changed anywhere in this child's diff.
- [ ] Strict Level-2 packet validation passes.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification checklist**: See `checklist.md`
- **Completion record**: See `implementation-summary.md`
- **Upstream evidence**: `../001-research/synthesis-v1.md` §2.7, `../001-research/verification-v1.md`, `../001-research/review-v1.md` §4

<!-- /ANCHOR:cross-refs -->
