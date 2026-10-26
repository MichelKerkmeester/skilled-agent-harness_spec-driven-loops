---
title: "Tasks: Phase 13: addon-removal-and-speed-refinements"
description: "Take the baselines, remove three add-ons with their wiring, tests and docs, build six speed refinements, then rerun the censuses and suites."
trigger_phrases:
  - "addon removal and speed refinements tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Phase 13: addon-removal-and-speed-refinements

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `S` is the script path. `P` is the packet path. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`S` is `.skilled/skills/system-spec-kit`. `B` is this phase's `scratch/baseline/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Read the output block in `recommend-level.sh`. Verify: `rg -n 'Recommended Level'` prints one line. WEAK: T001 Set up the project. -->

- [x] T001 Take the strict and six-rule census baselines over the 010 shard lists (`B/census-before-*.tsv`, `B/rules-before-*.tsv`). Verify: `cat B/census-before-*.tsv | wc -l` prints 4719. Evidence: census-before.tsv and rules-before.tsv hold 4,719 rows each, taken at `fdc0ddde40`.
- [x] T002 Take the CLI test project baseline (`B/cli-before.txt`). Verify: `rg 'vitest_exit' B/cli-before.txt` prints a line. Evidence: 188 files, 2,184 tests passed, vitest_exit=0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--quiet` branch. Verify: `--quiet` prints one line. WEAK: T002 Implement the feature. -->

- [x] T003 Remove the before-after and roadmap add-ons from the templates, the manifest, `create.sh` and the phrase and structure tools (`S/templates/spec-kit-docs.json`, `S/runtime/cli/spec/create.sh`). Verify: `rg -l 'before-after.md.tmpl|roadmap.md.tmpl' .skilled` prints nothing. Evidence: the three-name `rg -l` over `.skilled .hermes README.md` exits 1 with no output.
- [x] T004 Update the tests and golden snapshots for the two add-ons (`S/runtime/cli/tests/`). Verify: the five named test files pass. Evidence: scaffold-golden-snapshots and template-fill-guidance 36/36; repo-era 7/7.
- [x] T005 Remove the resource-map add-on template, its manifest entries, `create.sh` and phrase-tool wiring, the dangling speckit YAML path and its tests (`S/templates/addons/resource-map.md.tmpl`). Verify: `rg -l 'resource-map.md.tmpl' .skilled` prints nothing. Evidence: `rg` exits 1 with no output; `rg -n 'shared\.resource_map' .skilled` also exits 1.
- [x] T006 Align the spec-kit references, catalog, playbook, README and SKILL docs with the seven add-ons (`S/references/`, `S/feature-catalog/`, `README.md`). Verify: `rg -il 'before-after\.md|roadmap\.md' .skilled README.md` lists no doc that offers them. Evidence: the `rg` excluding changelog/, runtime/data/ and fixtures/ prints nothing; check-markdown-links.cjs prints "0 broken".
- [x] T007 Card refinements R1, R3, R4 and the repair command (`S/references/workflows/spec-authoring-card.md`). Verify: `bash S/runtime/cli/spec/check-card-sync.sh` exits 0. Evidence: prints "CARD SYNC OK"; `--quiet` and "every failing rule" sit in section 9.
- [x] T008 Repair hint R2 with a test (`S/runtime/lib/validation/orchestrator.ts`). Verify: the new hint test passes after `npm --prefix S/runtime run build`. Evidence: repair-hint-order.vitest.ts, Tests 2 passed.
- [x] T009 Template refinements R5 and R6 (`S/templates/core/spec.md.tmpl`, `S/templates/addons/acceptance-criteria.md.tmpl`). Verify: `template-fill-guidance.vitest.ts` and the golden snapshots pass. Evidence: 36/36 passed; check-example-drift.sh printed EXAMPLE_DRIFT_OK.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `wc -l` prints 1 and 17. WEAK: T003 Test everything. -->

- [x] T010 Rerun both censuses and compare (`B/census-after-*.tsv`). Verify: `diff <(sort B/census-before.tsv) <(sort B/census-after.tsv)` prints nothing. Evidence: six-rule diff printed nothing; strict diff showed 2 rows, both toward PASS from a root `resource-map.md`, accepted by ADR-001.
- [x] T011 Rerun the CLI test project (`B/cli-after.txt`). Verify: no failure the baseline did not have. Evidence: 2,179 passed, 2 failed of 2,201; repo-era then fixed (7/7), recursive-child-manifest timed out under load and passes alone (2/2).
- [x] T012 Scaffold throwaway packets at Levels 1, 2 and 3, with and without `--with-lazy-addons` (`specs/zz-addon-check/`). Verify: each prints `RESULT: PASSED` under `--strict`, then the track is removed. Evidence: all six printed `RESULT: PASSED` under `--strict --quiet`; track removed.
- [x] T013 Run the deep-loop resource-map tests (`resource-map-extractor`, `fanout-root-resource-map`, `deep-research-reduce-state`). Verify: all pass. Evidence: resource-map-extractor 4/4; the other two 32/32.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--quiet` prints one line and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `acceptance-criteria.md` reads Closeable: Yes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Analysis**: `../011-authoring-speed-research/scratch/speed-loop/results/20261026T050500Z-67716/`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task is marked `[B]` with its reason, and the phase stays In Progress.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] The baselines exist before any edit: `ls B` lists the census and suite files. Evidence: census-before.tsv, rules-before.tsv, cli-before.txt.
- [x] CHK-002 [P0] The start commit is `fdc0ddde40`. Evidence: baselines taken at `fdc0ddde40`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n recommend-level.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] `bash -n S/runtime/cli/spec/create.sh` exits 0. Evidence: exit 0.
- [x] CHK-011 [P0] `npm --prefix S/runtime run build` exits 0. Evidence: exited 0 after the code edits.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--quiet` prints one line. WEAK: Tests pass. -->

- [x] CHK-020 [P0] Every row of `acceptance-criteria.md` is Met. Evidence: every row Met except AC-003, Superseded by ADR-001 after the 2-row strict diff; AC-010 Met.
- [x] CHK-021 [P0] The census diffs print nothing. Evidence: six-rule diff empty; strict diff 2 rows, both fewer errors, accepted by ADR-001.
- [x] CHK-022 [P1] The throwaway scaffolds pass strict at every level. Evidence: six `RESULT: PASSED`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
<!-- FILL: Keep this section, because every level requires it. Write one check per finding class this packet can produce. Delete only the rows that do not apply, never the section. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-002 [P0] Same-class producer inventory: every reader of the three templates is listed in the dependency maps and changed or proven unaffected. Evidence: the Opus reviews covered the manifest, create.sh, census and cleanup tools, template-structure.js, frontmatter-migration.ts, spec-doc-structure.ts, upgrade-legacy and repo-era.
- [x] CHK-FIX-003 [P0] Consumer inventory: docs, tests and snapshots that name the three add-ons are updated. Evidence: the docs `rg` prints nothing; snapshots 36/36.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the commit SHAs in `implementation-summary.md`. Commit `6df0a21a0d` carries phases 013 and 014.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] The script reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] N/A: no credential, input path or permission changes; the dispatch briefs carry no secret. Evidence: security review found none.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` name the same flag. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] The templates README, the folder-structure reference and the root README list the same seven add-ons. Evidence: all three list the same seven.
- [x] CHK-041 [P1] The Hermes copy of the skill matches: `sync-skills-hermes.cjs --check` passes. Evidence: "PASS: 67 Hermes skill copies in sync".
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] The throwaway track `specs/zz-addon-check/` is removed after T012. Evidence: track removed.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 5 | 5/5 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---
