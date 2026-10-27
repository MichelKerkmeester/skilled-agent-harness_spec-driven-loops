---
title: "Tasks: Phase 11: alignment-fixes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "alignment fixes tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 11: alignment-fixes

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

`A` is `.skilled/skills/system-skill-advisor/runtime`. `C` is `.skilled/skills/sk-code`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the advisor baselines before any scorer change (`A/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs`). Verify: it prints full corpus 154/195, holdout 49/66 and ambiguity 18/24. Evidence 2026-10-27: those three numbers, exit 0. The vitest parity, golden and scorer folders printed `Test Files 36 passed (36)` and `Tests 326 passed | 4 skipped (330)`.
- [x] T002 Capture the routing guards before the alias change (`.skilled/bin/compiled-route-guard.cjs`, `compiled-route-sync.cjs --check`, `ci-skill-derived-freshness.cjs`). Verify: guard `failures: 0`, sync `all 55 served copies match`, freshness `stale: 0`. Evidence 2026-10-27: all three as stated, each exit 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Let a matching marker replace the current best only when it contains it in `detect_explicit_command_intent` (`A/scripts/skill_advisor.py`), with a case for the four sibling targets and a two-command prompt (`A/tests/python/test_skill_advisor.py`). Verify: `python3 A/tests/python/test_skill_advisor.py` prints `PASS: typed doctor sibling target beats its bare default marker`. Evidence 2026-10-27: before any fix the case printed `FAIL ... /doctor:ci toggle: intent=command-doctor-ci-report` with three more sibling mismatches and `Summary: pass=84, fail=2`. A plain longest-marker rule fixed the siblings but failed the two-command case, `/deep:review the diff, then /speckit:resume: intent=command-spec-kit-resume`, with `Summary: pass=85, fail=1`. With the containment rule the case prints PASS and the suite `Summary: pass=86, fail=0`, exit 0. T243-SA-022, the second baseline failure, read `unable to open database file` at baseline and passed later with no change to its code.
- [x] T004 [P] Pin the same four sibling targets on the TypeScript path (`A/tests/scorer/doctor-ordering.vitest.ts`). Verify: `npx vitest run tests/scorer/doctor-ordering.vitest.ts` prints `Tests 32 passed (32)`. Evidence 2026-10-27: 32 passed, exit 0. `keepPassingSkillsAboveDoctorBridges` already picks the longest bridge prefix, so the cases pin correct behavior rather than fix it.
- [x] T005 Widen the write verbs to `add|build|change|configure|create|disable[sd]?|edit|enable[sd]?|execute|fix|generate|implement|modify|patch|refactor|rename|re-?run|run|save|switch (?:on|off)|turn (?:on|off)|update|write` (`A/lib/scorer/text.ts`), with cases (`A/tests/scorer/read-only-explainer.vitest.ts`). Verify: the new file prints `Tests 10 passed (10)`. Evidence 2026-10-27: with the original list the first cases printed `Tests 3 failed | 2 passed (5)`. With the first widening (`run`, `turn off`, `disable`) the turn-on, execute, switch-off and rerun cases printed `Tests 4 failed | 6 passed (10)`. With the full list all 10 pass. Probes P02, P06, W01, W02 and W03 route to their sk-code mode. The line-132 then/and list was left as it is, because its extra verbs `move`, `replace` and `start` belong to that clause only.
- [x] T006 Anchor the release and deploy aliases on GitHub Actions (`C/hub-router.json`, `C/mode-registry.json`, `C/graph-metadata.json`, `C/ROUTER.md`). Verify: probes O03 and O05 no longer return `sk-code/sk-code-ci`. Evidence 2026-10-27: before, both read `got=sk-code/sk-code-ci 0.82`. After, both read `got=-`.
- [x] T007 Add general CI cost aliases in the same four files, and replay them against cost paraphrases and unrelated phrases. Verify: P04, C01, C02 and the general paraphrases H01 to H15 route to `sk-code/sk-code-ci`, and N01 and N04 stay off it. Evidence 2026-10-27: the brief's `workflow minutes`, `ci cost` and `cheaper ci` first caught N01 (meeting minutes), N03 and N04. The probe-fitted set that replaced them (`ci cost of this repository`, `ci cost of this repo`, `ci pipeline cheaper`, `cheaper ci runs`) passed only 3 of the 15 paraphrases in review. The shipped set is `github actions minutes`, `actions minutes`, `actions runner minutes`, `runner minutes`, `ci workflow cost`, `ci cost`, `ci costs`, `ci spend`, `ci bill`, `ci minutes`, `ci pipeline`, `ci pipelines`, `ci runs`, `cost of our ci`, `make ci cheaper`, `github actions bill` and `github actions cost`. With it P04, C01 to C07 and H01 to H15 read `sk-code/sk-code-ci`, and N01, N02, N04, N05 and N06 stay off the CI surface. N03, N09, N10 and N11, which the conductor ruled contrived, route to `sk-code-ci`, and so do N07 (a confidence-interval simulation in runner minutes) and N08 (a clinical-informatics org chart named the ci pipeline), which are the same contrived class. C04, which names `github actions minutes` and `actions runner minutes` and also mentions pull requests, read `sk-git 0.8232` with the earlier set and now reads `sk-code/sk-code-ci`. T020 later bound the bare nouns in this set to a cost word.
- [x] T008 Regenerate what derives from the hub files (`compiled-route-manifest.cjs refresh --hub sk-code`, the archived manifest copy, `skill_graph_compiler.py --export-json`). Verify: the route guard prints `"failures": 0` and `skill-graph-freshness.cjs --strict` prints `SIGNAL DRIFT compiled vs disk: none`. Evidence 2026-10-27: both as stated, exit 0. Before the regeneration the guard read `stale-manifest` for sk-code and the freshness panel read `SIGNAL DRIFT compiled vs disk: sk-code`.
- [x] T009 [P] Add the module header (`C/sk-code-skilled/assets/scripts/verify-router-sync.cjs`). Verify: `grep -n MODULE C/sk-code-skilled/assets/scripts/*.cjs` prints three lines. Evidence 2026-10-27: three lines, including `verify-router-sync.cjs:3:// MODULE: Router Sync Verifier`, and `node --check` exits 0.
- [x] T010 [P] Add five feature-catalog entries and their root sections (`C/feature-catalog/`). Verify: `validate_catalog_package.py --package sk-code` prints `PASS: 0 violations`. Evidence 2026-10-27: that line, exit 0. Each new leaf reads `valid true, 0 issues` in `validate_document.py`.
- [x] T011 [P] Name the quality leg in the root README (`README.md`). Verify: `rg -n 'route-probe and quality checks' README.md` prints line 1254. Evidence 2026-10-27: one line, 1254.
- [x] T012 [P] Write the phase 002 changelog with the nested generator, then rewrite it as reader-facing behavior (`../changelog/changelog-015-002-builtin-runner.md`). Verify: `validate_document.py` prints 0 issues. Evidence 2026-10-27: the generator output carried internal ids and test counts and read 2 warnings. The rewrite keeps the generator's frontmatter and section shape, describes what the runner does, and reads `valid: true` with 0 issues and `hvr_scan.py` 100/100.
- [x] T013 Write one changelog entry per changed component and step its version carriers, numbered above origin/main. Verify: `validate_document.py` prints 0 issues for each entry and `parent-skill-check.cjs .skilled/skills/sk-code` prints `OK`. Evidence 2026-10-27: after `git fetch origin main`, origin/main held system-skill-advisor v0.17.11.0 and sk-code-skilled v2.1.5.0 from other lanes, so these entries are system-skill-advisor v0.17.12.0, sk-code v3.9.8.0 and sk-code-skilled v2.1.6.0. Each reads 0 issues, and the parent check printed `OK`. `sync-skills-hermes.cjs` printed `Wrote 2 of 67 Hermes skill copies` after the renumbering.
- [x] T017 Route git release prompts to sk-git without the bare word `release` in its vocabulary. sk-git's routing source (`.skilled/skills/sk-git/graph-metadata.json` `intent_signals`) gains `git tag` and `tags and publishes`, and the explicit lane gains a tagged-release anchor that boosts sk-git when a release action (`cut`, `tag`, `publish` or `ship` a release) and a tag appear together (`A/lib/scorer/lanes/explicit.ts`, mirrored in `A/scripts/skill_advisor.py`), with cases (`A/tests/scorer/tagged-release-intent.vitest.ts`, `A/tests/python/test_skill_advisor.py`). Verify: O03 and O05 top-1 is sk-git, "update skilled to the latest release" stays on sk-code, G01 to G04 and G06 stay off sk-git, and C03 and C06 still route to `sk-code/sk-code-ci`. Evidence 2026-10-27: the earlier phrase set (`cut a release`, `release workflow that tags`, `tags the release`) put the slice prompt on sk-git and failed `doctor-routing-slice.vitest.ts` row doctor-b-update-02. Every phrase without `release` either missed O03 (`version tag`) or caught an unrelated tag (`tag the version` caught G06, `push the tag` caught G01). The anchor's vitest file printed `Tests 3 failed | 5 passed (8)` against the HEAD lane and `Tests 8 passed (8)` with the anchor. The advisor CLI then read O03 `sk-git 0.82`, O05 `sk-git 0.837`, the slice prompt `sk-code`, C03 `sk-code/sk-code-ci 0.8353` and C06 `0.8674`, and G01, G02, G03, G04 and G06 off sk-git. The Python case passes with and without the Python boost, because the fallback scorer already ranked O03 on sk-git, so it pins that ranking. G05 reads sk-git on the word `git`, as V06, the same prompt without `tag`, shows.
- [x] T018 Write the sk-git changelog and step its carrier (`.skilled/skills/sk-git/changelog/v1.10.1.0.md`, `SKILL.md`). Verify: `validate_document.py` prints 0 issues. Evidence 2026-10-27: 0 issues, `hvr_scan.py` 100/100 and `SKILL.md` reads `version: 1.10.1.0`.
- [x] T019 Narrow the tagged-release anchor, textually identical in `A/lib/scorer/lanes/explicit.ts` and `A/scripts/skill_advisor.py`: a release action followed by notes, blog, post, party, announcement or newsletter is not one, and a tag counts only as `git tag`, a pushed or created tag, `tag it`, `tag the version`, `tag the release`, `tag the commit`, a version number such as `v2.3.0`, `tagged` or `tagging`. The vitest file and the Python suite gain three negatives (a newsletter release, a release blog post, release notes) and the Python case asserts `!tagged-release-intent` in the sk-git reason, adding "Ship a new release and tag it v2.3.0". Verify: both suites pass, and the Python assertions fail against HEAD `skill_advisor.py`. Evidence 2026-10-27: the round-one anchor fired on all three negatives (a node check of the old patterns printed `true` three times). `tagged-release-intent.vitest.ts` now prints `Tests 12 passed (12)`. A scratch runner that executes a given `skill_advisor.py` in the real scripts folder printed, for HEAD, `anchored FAIL` for both anchored prompts (O03 tops sk-git without the reason, the v2.3.0 prompt tops `create:manual-testing-playbook`), exit 1, and for the worktree six PASS lines. The suite reads `Summary: pass=87, fail=0`. O03 reads `sk-git 0.82` and O05 `sk-git 0.837`.
- [x] T020 Bind the bare CI nouns to a cost word, and give CI debugging its own phrases, in the four alias carriers. `ci minutes`, `ci pipeline`, `ci pipelines`, `ci runs` and `ci costs` became `ci minutes cost`, `cut the ci minutes`, `cut ci minutes`, `reduce ci minutes`, `ci pipeline cost`, `ci pipeline cheaper`, `ci pipelines cheaper`, `cheaper ci pipeline`, `ci runs cheaper`, `reduce ci costs`, `lower ci costs`, `cut ci costs`, `reduce our ci costs` and `lower our ci costs`, and `failing ci`, `failing ci pipeline`, `ci failure`, `ci failures`, `ci is failing`, `broken ci`, `debug the ci` and `debug ci` were added. Verify: the flowchart, heatmap and blog-post prompts leave sk-code, the two debugging prompts reach `sk-code/sk-code-ci`, and H01 to H15 still do. Evidence 2026-10-27: before, the flowchart, heatmap and blog-post prompts read `sk-code/sk-code-ci 0.82`. With only the nouns bound, the two debugging prompts fell to `sk-code` and `sk-code/sk-code-skilled`, because they had reached CI through the bare `ci pipeline` alias. With the final set the flowchart reads `sk-design/sk-design-diagram`, the heatmap `sk-design/sk-design-chart`, the blog post `sk-doc`, "fix the failing ci pipeline" `sk-code/sk-code-ci 0.9011` and "debug the ci pipeline" `0.9027`, and H01 to H15 all pass. The 60-probe set reads 49 pass and 11 fail: N03, N07, N09, N10 and N11 (contrived), G05, and R04 to R07 and R09, with N08 now off the CI surface. The manifest and skill graph were regenerated as in T008.
- [x] T021 Write this phase's changelog with the nested generator and rewrite it for readers (`../changelog/changelog-015-011-alignment-fixes.md`). Verify: `validate_document.py` prints 0 issues. Evidence 2026-10-27: the generator copied task evidence and probe ids into the entries, so the rewrite keeps its frontmatter and section shape and states the behavior. It reads `VALID` with `Total issues: 0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Rerun the accuracy baseline and the advisor suites. Verify: the corpus numbers equal T001 and the suites pass. Evidence 2026-10-27: 154/195, 49/66 and 18/24 again after the review fixes. The reviewer's corpus harness over 343 rows (labeled, holdout, ambiguity and doctor prompts) showed 0 top-1 changes against HEAD. After the second review round, this lane's whole advisor `npx vitest run` printed `Test Files 1 failed | 151 passed (152)` and `Tests 1 failed | 1278 passed | 8 skipped (1287)`, with `doctor-routing-slice.vitest.ts` 2 of 2 and `tagged-release-intent.vitest.ts` 12 of 12. The conductor's run of the same tree was green, 152 of 152 files with 1275 passed and 8 skipped, before the round's added cases, and the watcher test passed 5 of 5 twice on main. The one failure in this lane's runs is `daemon-watcher-new-root-ingestion.vitest.ts` ("discovers a newborn skill through real chokidar"), a host FSEvents timing flake under load: it touches no file this phase changes, and a separate lane is making that test poll on macOS. The Python suite reads pass=87, fail=0.
- [x] T015 Run the sk-code setup battery from the final tree. Verify: it prints `STATUS=OK legs=9`. Evidence 2026-10-27: nine PASS lines and `STATUS=OK legs=9`, exit 0. The run needed `core.fsmonitor=false` in the environment, because an earlier run sat for 14 minutes on a `git ls-files -z` the drift guard starts.
- [x] T016 Check every markdown link in the tree. Verify: `check-markdown-links.cjs` prints `0 broken`. Evidence 2026-10-27: `7675 files, 14008 links checked, 0 broken`, exit 0.
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-008 in section 4.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan sections 1 and 3.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: T001 and T002 baselines ran.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` passes on the changed `.cjs` file and `npm run build` compiles `text.ts`. Evidence: T009 and T005.
- [x] CHK-011 [P0] The advisor suites print no failure. Evidence: T003 and T014.
- [x] CHK-012 [P1] The matcher keeps the routing-disabled and untyped-doctor skips. Evidence: T003, the bare `/doctor:ci` assertion.
- [x] CHK-013 [P1] Code comments state the durable reason and carry no packet or finding id. Evidence: `rg -n 'A-0|D-0|015' A/scripts/skill_advisor.py A/lib/scorer/text.ts` finds nothing in the changed lines.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md` rows read Met.
- [x] CHK-021 [P0] Manual probes ran from the worktree. Evidence: T006 and T007.
- [x] CHK-022 [P1] Edge cases tested. Evidence: the bare `/doctor:ci` and the `runtime` word cases.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: unrelated-phrase probes in T007.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. Evidence: the matcher is `cross-consumer` (Python and TypeScript), the classifier is `instance-only`, the aliases are `cross-consumer` (four files plus two derived artifacts), the docs are `instance-only`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: `rg -n 'deploy workflow|release workflow' .skilled/skills/sk-code` lists the four alias carriers, and `sk-code-ci/SKILL.md` never carried the two aliases.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: the compiled manifest and the skill graph were regenerated in T008.
- [x] CHK-FIX-004 [P0] N/A. No security, path, parser or redaction fix.
- [x] CHK-FIX-005 [P1] Matrix axes listed. Evidence: four sibling prompts by two scorers in T003 and T004.
- [x] CHK-FIX-006 [P1] N/A. No test reads process-wide state the fix changes.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the working tree on top of `ee64a63b2c`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the diff adds vocabulary, tests and docs only.
- [x] CHK-031 [P0] N/A. No new input path.
- [x] CHK-032 [P1] N/A. No auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree on the eight requirements.
- [x] CHK-041 [P1] The matcher comment and the bridge-table comment state the containing-marker rule.
- [x] CHK-042 [P2] README updated. Evidence: T011.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Probe files and logs live in the session scratchpad, not the tree.
- [x] CHK-051 [P1] scratch/ holds only its `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->

---
