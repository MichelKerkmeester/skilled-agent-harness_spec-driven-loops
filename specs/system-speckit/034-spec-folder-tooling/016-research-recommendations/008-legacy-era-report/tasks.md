---
title: "Tasks: Legacy-era report and detection"
description: "Build a unified, read-only packet classifier that combines five pre-v4 signals with exclusion filtering and header alias normalization."
trigger_phrases:
  - "legacy era report tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Legacy-era report and detection

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

- [x] T001 Define exclusion list patterns for lineages, scratch, changelog, git-ignored paths (repo-era.mjs:10-30). Done: `EXCLUSION_RULES` at repo-era.mjs:36-59 holds research lineages, the `research`/`review`/`context` containment trees, scratch, `z_archive/00-changelog` and git-ignored paths. The line range in the row was a planning estimate.
- [x] T002 Create header alias map for drifting spellings (repo-era.mjs:32-50). Done: `HEADER_ALIASES` at repo-era.mjs:72-83 maps `impl-summary-core`, `implementation-summary-core` and `implementation-summary` to `implementation-summary`, the other `-core` spellings to their document names, and `resource-map@v1.1` and `@v2.2` to `resource-map`.
- [x] T003 [P] Set up Vitest fixture with 20 test packets covering era signals (tests/repo-era.vitest.ts:1-100). Done differently: the main fixture builds 22 packets that must be counted (19 numbered packets plus 3 archived at top-level, track-level and nested depth) and 7 excluded copies, and five smaller fixtures cover aliases, v3 and v4 layout, prose-only residue, a YAML level and a phase parent. The file is `tests/repo-era.vitest.ts`, 372 lines, 6 tests.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement PacketClassifier class: walk specs/ tree using lib/corpus.mjs filtering (repo-era.mjs:52-150). Done differently: a function, `classifyRepo` (repo-era.mjs:499-596), not a class. It reuses `walkCorpus`, `gitIgnoredPaths` and `canonicalRelativePath` from `lib/corpus.mjs`, and `specRootsFor` adds every `z_archive` root at any depth because the shared walk prunes archives.
- [x] T005 Implement signal detectors: layout, frontmatter, template marker, generated metadata, level match (repo-era.mjs:152-300). Done: `detectLayoutSignal` (with provenance), `detectFrontmatterSignal`, `detectTemplateMarkerSignal`, `detectGeneratedMetadataSignal` and `detectLevelDocumentSignal`, each independent of the others.
- [x] T006 Implement EraReport class: aggregate signal findings into counts and classification (repo-era.mjs:302-400). Done differently: a function, `buildReport` (repo-era.mjs:605-654), returning counts per signal plus `totals`.
- [x] T007 Export classifyRepo and buildReport functions for preflight/doctor/sweep (repo-era.mjs:402-410). Done: both are exported, along with `EXCLUSION_RULES` and `HEADER_ALIASES`. Run directly, the module prints the JSON report (repo-era.mjs:656-659).
- [x] T008 Integrate era report into upgrade-legacy.mjs preflight section (upgrade-legacy.mjs:~170). Done differently: the import is at upgrade-legacy.mjs:33 and the dry run prints a `repo era report:` block at :604-615 (layout provenance, layout, frontmatter counts), after the per-packet result lines. The `--apply` path does not print it, and the findings are printed, not routed to repair stages.
- [x] T009 Add compatibility section to /doctor:update check workflow (doctor-update-check.yaml:new section). Not applicable to this phase and not done here: the doctor/update integration belongs to phase 009 (009-doctor-update-compatibility). No doctor file was touched.
- [x] T010 Add era signals documentation to spec-kit README (README.md:new section). Done: the `### Repo Era Report` section in `runtime/cli/spec/README.md` gives the command and describes the five signals.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Test classifier walk covers all 20 fixture packets (tests/repo-era.vitest.ts:102-180). Done against 22 packets: the first test asserts `toHaveLength(22)`, that the three archived packets appear, and that `specs/fixture-track/001-packet` appears exactly once.
- [x] T012 Test exclusion patterns filter lineages, scratch, changelog, git-ignored (tests/repo-era.vitest.ts:182-250). Done in the first test: the `research`, `research/lineages`, `review`, `context`, `scratch`, git-ignored and `z_archive/00-changelog` paths are all in `excluded`, and no `*-copy` fixture reaches `packets`.
- [x] T013 Test signal detectors fire correctly on each era signal (tests/repo-era.vitest.ts:252-380). Done: missing frontmatter, `none` and `legacy` markers, `missing` and `stub` metadata and a level mismatch in the first test, v3, v4 and `both` layout in the first and third, plus the prose-only residue, YAML level and phase-parent tests.
- [x] T014 Test header alias normalization resolves all drifting spellings (tests/repo-era.vitest.ts:382-420). Done in the second test: `impl-summary-core`, `implementation-summary-core` and `implementation-summary` all resolve to `implementation-summary`, and `resource-map` v1.1 reads as current while v2.2 reads as legacy.
- [x] T015 Test report counts match individual signal tallies (tests/repo-era.vitest.ts:422-450). Done in the second test: each signal's counts sum to the document or packet total, and `report.totals` equals the expected object.
- [x] T016 Run repo-era on fixture, verify report counts match AC-004 consistency check (fixture, not corpus-scale). Done on the fixture (second test) and also at corpus scale: 4431 packets, equal to an independent `find` count, and two consecutive CLI runs produced byte-identical JSON.
- [x] T017 Verify `upgrade-legacy` preflight prints layout and frontmatter findings (manual). Done: a dry run printed `layout provenance: source=none; description.json residue count=0`, `layout: v4 (v3=false, v4=true)` and `frontmatter: present=18457 missing=99`. No test pins those lines, and the dry run ran from a manual command, not from a test.
- [x] T018 Update plan.md and spec.md for closure (this folder). Done: spec.md Status is Complete with the open questions answered, and the plan's pre-deployment checklist is ticked with evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (T009 is ticked as not applicable to this phase: it belongs to phase 009)
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (corpus run, two repeated CLI runs and the `upgrade-legacy` dry run)
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001, REQ-002, REQ-004, REQ-005 and REQ-006 in section 4)
- [x] CHK-002 [P0] Technical approach defined in plan.md (architecture, data flow, testing strategy and rollback)
- [x] CHK-003 [P1] Dependencies identified and available (the module imports `walkCorpus`, `gitIgnoredPaths`, `isExcludedDirectory` and `canonicalRelativePath` from `retrieval/lib/corpus.mjs`, all present)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (the CLI package `run check`, which is `tsc --noEmit` plus the architecture and boundary checks, exited 0 in the wave 1 final gates; the package has no separate formatter, so no style check ran on repo-era.mjs)
- [x] CHK-011 [P0] No console errors or warnings (CLI typecheck rc 0, build rc 0; two CLI runs of the module wrote nothing to stderr; the 24 tests pass)
- [x] CHK-012 [P1] Error handling implemented (an unreadable directory is skipped, a malformed `graph-metadata.json` reports `stub`, a malformed `description.json` is ignored; the last two were probed ad hoc and are not pinned by a test)
- [x] CHK-013 [P1] Code follows project patterns (an ES module beside its peers in `runtime/cli/spec/`, JSDoc on every function, the shared corpus walk reused instead of a second walker)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (AC-001 to AC-008 are Met in acceptance-criteria.md)
- [x] CHK-021 [P0] Manual testing complete (corpus run of 4431 packets, two repeated runs with identical output, and the `upgrade-legacy` dry run)
- [x] CHK-022 [P1] Edge cases tested (archives at three depths, prose-only legacy-root mention, YAML frontmatter level, phase parent against the lean trio, a completed task with no implementation summary; an empty `specs/` reported zero packets in an ad hoc probe)
- [x] CHK-023 [P1] Error scenarios validated (a stub `graph-metadata.json` is pinned by the first test; malformed JSON in `graph-metadata.json` and `description.json` was checked ad hoc and gave `stub` and no residue)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. The review round had three findings: F1 `class-of-bug` (P0, the walk kept only the top-level archive and dropped every deeper one), F2 `instance-only` (P2, the v3 residue test matched prose and gave no provenance) and F3 `instance-only` (P2, a YAML frontmatter `level:` was ignored). All three are fixed and each has its own fixture test.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. The archive handling this phase changed is `specRootsFor` in repo-era.mjs. `rg z_archive` over `runtime/cli` also finds `retrieval/lib/corpus.mjs` (leaves archives out of the shared walk by design) and `spec/upgrade-legacy.mjs` (tags archived packets). Neither was changed, and neither supplies roots to the era report, so no other producer of archive roots feeds its packet count.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. `rg repo-era` over the skill finds exactly three files: `spec/upgrade-legacy.mjs` (the dry-run block), `tests/repo-era.vitest.ts` and `spec/README.md`. No other caller reads `layout.provenance`.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Not a table-driven suite: the module is read-only and has no redaction or auth surface, and the path and parser fixes are each pinned by a fixture: archives at top-level, track-level and nested depth, a prose-only `description.json`, and a YAML `level:` key. The fixtures also hold seven excluded-copy paths that must not reach `packets`.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Layout: 3 outcomes (`v3`, `v4`, `both`). Archive depth: 3 (top-level, track-level, nested). Excluded-copy kind: 7. Alias spelling: 3 for the implementation summary and 2 for `resource-map`. Level source: 3 (marker plus table, YAML frontmatter, phase-parent lean trio). Each axis has one fixture row per value, spread over the 6 tests.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Not applicable: the tests read no environment variable or module state, and each runs in its own temporary root that `afterEach` removes.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. The wave 1 gates compare the uncommitted working tree against baseline `c85ec7f8803` (whole CLI suite: 161 files and 1639 passed tests before, 162 files and 1648 passed after, both with 19 skipped). No fix SHA exists until the wave 1 commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (`rg -i 'secret|token|password|api[_-]?key'` over repo-era.mjs finds nothing)
- [x] CHK-031 [P0] Input validation implemented (the root argument goes through `path.resolve`, a missing `specs/` gives layout `unknown`, the `description.json` and `graph-metadata.json` parses are guarded, and `rg` for write calls in repo-era.mjs finds none)
- [x] CHK-032 [P1] Auth/authz working correctly (not applicable: a local read-only module with no authentication surface)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (status, results and the corpus count agree across the docs; one wording gap remains: the spec Scope section still lists the `/doctor:update check` presentation, which tasks.md and the spec handoff criteria assign to phase 009)
- [x] CHK-041 [P1] Code comments adequate (a module banner, plus JSDoc on every function and on both exported tables)
- [x] CHK-042 [P2] README updated (if applicable) (the `Repo Era Report` section in `runtime/cli/spec/README.md`)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (the tests write under `os.tmpdir()` and remove it after each test)
- [x] CHK-051 [P1] scratch/ cleaned before completion (only `.gitkeep` is in this phase's scratch/)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-08
<!-- /ANCHOR:summary -->

---



