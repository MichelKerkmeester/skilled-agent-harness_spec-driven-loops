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

- [x] T001 [P] Remove/correct the trigger_phrases routing claim in `feature-catalog-snippet-template.md` (~L41).
- [x] T002 [P] Sweep `feature-catalog-template.md` for the same claim and align wording.
- [x] T003 [P] Make `validate-playbook-topology.cjs`'s frontmatter/typed-gold parsing quote-tolerant (~L95 area).
- [x] T004 Document one canonical typed-gold serialization.
  - Evidence: documented as a code comment in `validate-playbook-topology.cjs`'s section-3 header, above `readFileSafe`.
- [x] T005 Add a quoted-value fixture and an unquoted-value fixture for the topology validator.
  - Evidence: `validate-playbook-topology.test.cjs` (new) — 3/3 PASS (`node .../validate-playbook-topology.test.cjs`, exit 0).

**Evidence**: `grep -n "drives skill-advisor routing" feature-catalog-snippet-template.md feature-catalog-template.md` returns no hit (confirmed, exit 1/no match). The corrected comment states the actual harvester scope instead. `validate-playbook-topology.test.cjs` (new) proves quoted and unquoted typed-gold fixtures parse to byte-identical structured output; an A/B run against sk-doc's own 31-scenario live playbook (`--strict`) shows `valid=31 blocked=0` both before and after the edit (git-stash comparison) — no regression on unquoted fixtures.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Focus**: Taxonomy, strict package validator, lockstep manifest.

- [x] T006 Run a fresh census of the live corpus's SOURCE FILES Type-column values.
  - Evidence: confirmed `template-rules.json`'s existing `allowedValidationTypes` (12 values, committed 2026-07-06) as the live canonical census rather than re-deriving it.
- [x] T007 [B: T006] Define the 12-value canonical test-type taxonomy from the census, with zero unmapped stragglers.
  - Evidence: `validate_catalog_package.py` run against the full live corpus reports 0/0 `off_taxonomy_validation_type` violations — 100% of live values already map to the 12-value set.
- [x] T008 [B: T007] Update `validate_document.py`'s `allowed` set to the 12-value taxonomy.
- [x] T009 [B: T007] Update `feature-catalog-snippet-template.md`'s "Type column valid values" line to match.
- [x] T010 [P] Author `validate_catalog_package.py`: router/advisor-central + 7-hub bijection, source-path existence, taxonomy conformance.
- [x] T011 [P] Author `compiled-routing-lockstep-surfaces.json` naming all 9 lockstep surfaces (7 hub SKILL.md + 2 create-skill parent templates).
- [x] T012 [B: T011] Author `compiled-routing-lockstep-parity.test.cjs` reading the manifest from T011.

**Evidence**: T006/T007 — the 12-value canonical taxonomy already existed as a curated set in `template-rules.json`'s `allowedValidationTypes` (committed 2026-07-06, predating this child); the "fresh census" this task required was confirming that live source of truth rather than fabricating a new list, so T008's `allowed` set already matched it and T009 aligned the template's documented line to the same 12 values (both the snippet-template's authoring-note bullet and the `{TEST_TYPE}` scaffold placeholder in both catalog templates). `validate_catalog_package.py` (new, `create-feature-catalog/scripts/`) reports zero violations on the live 8-package corpus's bijection/taxonomy checks (5 pre-existing, out-of-scope `missing_source_path` findings reported, none from this child's diff) and `test_validate_catalog_package.py` (new fixture test) proves it catches a seeded missing-leaf, orphan-leaf, missing-source-path, off-taxonomy, and missing-root-catalog violation each by name, plus passes clean on a seeded-complete fixture — 12/12 PASS. `compiled-routing-lockstep-parity.test.cjs` (new) proves the parity check passes on a clean 5-surface seeded fixture, catches a seeded drift by naming the exact surface, and treats an unrendered directive as safe (not a violation) — 4/4 assertions PASS; its informational live-report section (never asserted) additionally surfaces a real, pre-existing, out-of-scope wording drift on `sk-code`'s SKILL.md relative to the other 6 hubs.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

**Focus**: Stretch harvester extension (P1), then final verification.

- [ ] T013 [P1][DEFERRED] Extend `doc-frontmatter.ts`'s `HARVEST_SUBDIRS` to a capped, explicitly-scored feature-catalog leaf path.
- [ ] T014 [P1][B: T013][DEFERRED] Add an invariance test proving no score/rank change for any currently-harvested `references/`/`assets/` doc.
- [x] T015 Re-hash the three frozen scorer files before and after this child's full diff; confirm unchanged.
  - Evidence: `shasum -a 256` before/after — identical digests for `router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs` (0 diff).
- [x] T016 Run `validate.sh --strict` on this child folder.

**Evidence**: T013/T014 explicitly deferred per operator directive — `doc-frontmatter.ts` lives under `system-skill-advisor` (advisor code), which this child's build constraints named out of scope ("do NOT touch the advisor/benchmark/sk-code/activation code"). This resolves `spec.md` §7's open question: REQ-006 does not ship in this child. T015 — pre/post SHA-256 identical for all three frozen files (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`), confirmed via `shasum -a 256` before any edit and again after the full diff. T016 — `validate.sh --strict` on this folder reports `Errors: 0, Warnings: 2` (exit 2 under `--strict`, which reclassifies warnings as blocking); the two warnings (`FRONTMATTER_VALID`, `FRONTMATTER_MEMORY_BLOCK`) are pre-existing in this packet's originally-authored `spec.md`/`plan.md`/frontmatter content — untouched by this child's diff (confirmed via `git status`) — and are not unique to this packet: sibling `002-runtime-promotion-and-status-foundation` (already implemented and committed) also returns `RESULT: FAILED` under `--strict` with 0 errors and warnings present, which appears to be the current baseline pattern across this program's packets rather than a regression introduced here.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements (REQ-001..REQ-004) implemented and evidenced.
- [x] P1 requirements (REQ-005, REQ-006) implemented or explicitly deferred with user approval. (REQ-005 implemented; REQ-006 explicitly deferred per operator scope directive.)
- [x] Frozen scorer digests unchanged.
- [x] No routing decision changed anywhere in this child's diff.
- [ ] Strict Level-2 packet validation passes. (Errors: 0; 2 pre-existing frontmatter warnings unrelated to this diff push `--strict` to exit 2 — see T016 evidence.)

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
