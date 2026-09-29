---
title: "Tasks: Move cli-jev into the cli-classifier Hub"
description: "Ordered tasks for the entry gate, the route replay baseline, the disposition table, the one-commit git mv of all 81 hub files with the hub-file merges, literal-list updates and compiled-fleet onboarding of cli-classifier, and the replay, hub and fleet checks that decide keep or revert."
trigger_phrases:
  - "cli-jev hub move tasks"
  - "cli-jev replay baseline tasks"
  - "cli-jev disposition table"
  - "cli-classifier hub move verification"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Move cli-jev into the cli-classifier Hub

<!-- SPECKIT_LEVEL: 1 -->

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

The build starts once 008-cli-classifier-hub is Complete (operator, 2026-09-29, parent D4 amended), with no Deem `keep`. `cli-classifier` and `cli-deem` exist since 008's build `ee3a1b057c`. Tasks T024 to T027 were added on 2026-09-29 and sit in the list where they run.

Evidence sources, closed 2026-09-29: `scratch/w3-build/build-evidence.md` (the build orchestrator's record), `scratch/w3-session/session-evidence.md` (the orchestrator session's rerun from the final state, review verdicts and commits, which wins where the two differ) and read-only `git` reruns by the closure pass at HEAD `c0178c093d`, marked "closure rerun".
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the entry gate: `../008-cli-classifier-hub/spec.md` shows Status Complete and `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier` exits 0. The build starts then (operator, 2026-09-29, parent D4 amended), with no Deem `keep` (`implementation-summary.md`). Evidence: `../008-cli-classifier-hub/spec.md:27` says Status Complete. At the session's baseline on clean HEAD `3dde18cb54`, `parent-skill-check.cjs` on `cli-classifier` exited 0 with "OK, 1 manifest mode, version 1.0.0.0" (`scratch/baselines.md`)
- [x] T002 Record the baseline replay before any file moves: each of the 7 canary prompts in `canary-cases.v1.json` and the 3 hub-routing prompts CJ-001, CJ-002 and CJ-003 through `node .skilled/bin/compiled-route.cjs --hub cli-jev --prompt "<prompt>"`, with each exit status (`scratch/route-baseline.txt`). Evidence: the session wrote `scratch/route-baseline.txt` at clean HEAD `3dde18cb54` before any move. It holds 17 prompts, each with its route JSON and an `EXIT` line, all exit 0. The 17 are the 7 canary prompts and the hub-routing scenario prompts plus phrasing variants, so the 10 named here are a subset (session evidence section 1). Closure rerun: `git ls-tree -r --name-only 3dde18cb54 -- .skilled/skills/cli-jev | wc -l` prints 81
- [x] T003 [P] Reopen each literal list at build HEAD and confirm the lines: `compiled-route.cjs:35`, `compiled-route-sync.cjs:59`, `compiled-route-guard.cjs:47`, `compiled-routing-flag.ts:19` and `:37`, `resolve.cjs:36-44`, `serving-closure.manifest.json:5-13` and `dispatch-audit.mjs:46`, `:234` and `:237` (all unchanged on 2026-09-29). Evidence: the goal log row "Recount (2026-09-29)" found every line holding `cli-jev` at `3dde18cb54`, the build's starting HEAD. Closure rerun: `git show 3dde18cb54:<file>` finds `cli-jev` on all ten named lines, `resolve.cjs:41` and `serving-closure.manifest.json:10` included
- [x] T004 [P] Recount the footprint at build HEAD: `git ls-files .skilled/skills/cli-jev` (81 on 2026-09-27 and on 2026-09-29, 59 in `cli-usage`) and `git grep -l 'cli-jev' -- . ':!specs' ':!.skilled/skills/cli-jev'` (48 on 2026-09-27, 62 on 2026-09-29). Evidence, closure rerun at `3dde18cb54`: `git ls-tree` gives 81 hub files and 59 in `cli-usage`, and `git grep -l 'cli-jev' 3dde18cb54 -- . ':!specs' ':!.skilled/skills/cli-jev'` gives 62
- [x] T005 Write the disposition table for every hub file: the target path, and whether it moves or merges into a `cli-classifier` counterpart (`implementation-summary.md`). Evidence: `scratch/w3-build/disposition.md` lists all 81 files, "Totals: 81 files, 70 moves, 11 merges, 0 unmapped". `implementation-summary.md` carries it whole, with each file's row in `ea883967d4` added
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 `git mv` the 59 files of `cli-usage/` to `.skilled/skills/cli-classifier/cli-usage/`, editing only prose that names the packet's hub, such as `SKILL.md:282`. Evidence: the session ran the `git mv` before the build (session evidence section 2). Closure rerun of `git show -M --name-status ea883967d4`: all 59 are rename rows into `cli-classifier/cli-usage/`, 51 at `R100` and 8 edited (`README.md` R093, `SKILL.md` R098, three feature-catalog files and three playbook files). Briefs 04 and 28 to 34 made the hub-name edits. Fix round 1 also restructured the playbook root's sections to pass `validate_document.py`, which goes past a hub-name edit and is logged in `implementation-summary.md` Deviations
- [x] T007 `git mv` the 14 files of `benchmark/`, `manual-testing-playbook/`, `shared/` and `changelog/` into the matching `cli-classifier` subtree per the table. Changelogs and dated benchmark reports move byte-identical. Evidence, closure rerun on `ea883967d4`: 11 of the 14 are rename rows. The 6 dated benchmark report files and the 2 changelogs are `R100`, `shared/README.md` is `R088` and CJ-001 and CJ-002 are `R052`. The other 3, `benchmark/README.md`, the playbook root and CJ-003, are named merges with `D` rows, as the table records
- [x] T008 Merge the 8 hub-root files (`SKILL.md`, `README.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `graph-metadata.json`, `description.json`, `leaf-manifest.json`) into their `cli-classifier` counterparts, then remove each source only after its merge is in the counterpart (`.skilled/skills/cli-classifier/`). Evidence: briefs 01, 02, 03 and 40 to 43 wrote each merged root file and then removed its source. `leaf-manifest.json` merged by `generate-leaf-manifest.cjs --write`, `--check` "leaf-manifest.json OK", and brief 47 removed the source (build evidence section 6). Closure rerun: the 8 are `D` rows in `ea883967d4`
- [x] T009 Register mode `cli-jev` over packet `cli-usage`: `packetKind` `transport`, `routingClass` `metadata`, today's aliases and tool surface, membership in the transport axis, and its signals in `hub-router.json` with both modes in `tieBreak` (`cli-classifier/mode-registry.json`, `cli-classifier/hub-router.json`). Evidence: briefs 01 and 02 (Devin). Closure read: `mode-registry.json` lists `cli-deem` and `cli-jev`, and `cli-jev` has `packet` `cli-usage`, `packetKind` `transport`, `backendKind` `cli-dispatch` and `routingClass` `metadata` (`:51-76`). The transport axis reads `["cli-deem", "cli-jev"]`. `hub-router.json:7` reads `"tieBreak": ["cli-jev", "cli-deem"]`
- [x] T010 Update the literal lists: `cli-jev` leaves each, and `cli-classifier` appears once, so the fleet stays at 7 hubs. `HUB_CHILD` maps `cli-classifier` to `009-parent-hub-rollout/008-cli-classifier`, the serving-closure file list names the renamed rollout and activation paths, and the advisor's gitignored `dist` twin is rebuilt by `npm run build` (`compiled-route.cjs`, `compiled-route-sync.cjs`, `compiled-route-guard.cjs`, `compiled-routing-flag.ts`, `resolve.cjs`, `serving-closure.manifest.json`). Evidence: briefs 07 to 11 (Devin) and 38 (Pi, `fileCount` 62). The advisor `npm run build` exited 0 (build evidence section 6). Closure rerun: `git grep -n "'cli-jev'\|\"cli-jev\""` over the seven files prints nothing, exit 1. `compiled-route.cjs:35` reads `'cli-classifier': '009-parent-hub-rollout/008-cli-classifier'`, and `resolve.cjs:42` and `compiled-routing-flag.ts:19` and `:37` each name `cli-classifier`
- [x] T011 Update the dispatch audit to skill `cli-classifier` and packet path `cli-classifier/cli-usage`, and its two tests (`.skilled/hooks/dispatch/lib/dispatch-audit.mjs`, `dispatch-audit.test.mjs`, `dispatch-rule-checks.test.mjs`). Evidence: briefs 17 and 18 (Devin). The rule-checks test now scans the classifier hub, filtered to the packets a dispatch shape governs, so `cli-deem` is excluded (build evidence section 7). Session: dispatch audit vitest 75 passed and rule-checks `node --test` 20 of 20, both equal to the baseline
- [x] T012 `git mv` the rollout package `009-parent-hub-rollout/008-cli-jev/` to `008-cli-classifier/` in the runtime mirror and in the authored twin, and rework it to compile the two-mode registry, with its harness's literal `cli-jev/...` ids and `SKILL_ROOT` pointing at `cli-classifier` and canary expectations naming mode `cli-jev` (`.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/`, `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/`). Evidence: the session ran the folder `git mv` in both trees before the build. Briefs 12 to 15 (Devin) reworked the harness and `lib/` in both trees, and brief 16 (Pi) set 7 Jev canary cases to expect `cli-jev` and added `deem-choice-single` and `deem-verb-narrowness`. `build-artifacts.cjs` rebuilt the twin's `compiled/` and `activation/` artifacts, exit 0, `effectivePolicyHash 63c0e7c4...`. Fix round 1 added `assertGoldExpectations` to the harness, byte-identical in both trees. Closure rerun: `008-cli-classifier/` exists in both trees
- [x] T013 [P] Update the `.hermes` mirrors, the `orchestrate` and `prompt-improver` agents in each runtime, `README.md` and `.skilled/skills/README.txt`, and review each remaining naming file, leaving history lines and every changelog as written. Evidence: briefs 19, 19b, 19c, 20 and 20b edited the `.skilled` and `.claude` agents, and `codex/sync-agents.cjs` and `pi/sync-agents-pi.cjs` wrote the other two. `sync-skills-hermes.cjs` refreshed the Hermes copies and pruned `.hermes/skills/cli-jev/`, `--check` "PASS: 72 Hermes skill copies in sync". Briefs 25 and 26 edited the two inventories, and briefs 21 to 24 and 27 to 36 the other naming files. The `004-cli-external-orchestration` canary `jev-transport-single` and `declared-hard-rules-refuse-violations.md:28` stay as recorded (build evidence sections 6 and 7)
- [x] T014 Regenerate the advisor graph and its parity fixture, the trigger index and its retrieval fixtures with their own tools (`skill-graph.json`, `trigger-index.json`). Evidence: `skill_graph_compiler.py --validate-only` "VALIDATION PASSED", then `--export-json`. `capture-local-native-divergence-ledger.mjs --write` changed one row. Both files are `M` rows in `ea883967d4` (closure rerun). The session rebuilt the trigger index and its fixtures from an archive of HEAD in `c0178c093d`, with 23,318 documents, 0 stale, 0 obsolete and 0 untrusted (session evidence section 5)
- [x] T024 Move CJ-001 `judgment-request-routes-to-transport.md` and CJ-002 `alias-still-resolves.md` with `git mv` and rewrite each to expect mode `cli-jev` of `cli-classifier`, prompts unchanged, and keep scored scenarios for `cli-deem`, `cli-jev` and out-of-domain. Rewrite or retire CC-002, whose expectation the move makes false (`cli-classifier/manual-testing-playbook/hub-routing/`). Evidence: briefs 52 and 52b rewrote CJ-001 and briefs 53 and 53b CJ-002. Both are `R052` in `ea883967d4`, and each keeps its prompt line word for word against `3dde18cb54` (closure rerun). CC-002 was rewritten in place by brief 51, not retired, and CC-003 absorbed CJ-003 in brief 49. `hub-routing/` holds 5 scenarios covering `cli-deem` (CC-001), `cli-jev` (CC-002, CJ-001, CJ-002) and out-of-domain (CC-003). Session: `compiled-route-admission.cjs --hub cli-classifier` 5 pass, 0 drift
- [x] T025 Last, `git mv` `013-live-activation/activation/cli-jev/` to `activation/cli-classifier/` in both trees and write its manifest through the manifest library's canonical bytes, since the CLI `mint` verb cannot compile a transport-only hub (`../../002-cli-jev-hub-migration/004-compiled-fleet-onboarding/implementation-summary.md`, Known Limitations 4). Evidence: the session ran the folder `git mv` in both trees. Brief 37 wrote `activation/cli-classifier/manifest.json` in both trees from the library's canonical bytes prepared by `runs/gen-manifest.cjs`. `refresh` kept the SHA-256 at `aa840b21...` and `freshness` printed `fresh: true`. The manifest shows as `D` plus `A` against HEAD because its bytes carry a new policy hash, which `implementation-summary.md` records. Closure rerun: `activation/cli-classifier/` exists in both trees
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run `git diff --cached -M --name-status` and confirm a rename for every moved file, CJ-001 and CJ-002 included, and `D` rows only for the eleven named merges: the 8 hub-root files, `benchmark/README.md`, `manual-testing-playbook/manual-testing-playbook.md` and `manual-testing-playbook/hub-routing/out-of-domain-resolves-nothing.md`. Evidence: the session checked the committed form, `git show -M --name-status ea883967d4` (session evidence section 5). Closure rerun of the same command over the whole commit: 70 rename rows and 11 `D` rows from `.skilled/skills/cli-jev/`, no other status. The `D` rows are exactly the eleven named merges, and CJ-001 and CJ-002 are `R052`
- [x] T016 Run `git ls-files .skilled/skills/cli-jev | wc -l` and expect `0`. Evidence, closure rerun at `c0178c093d`: `0`, and the folder does not exist
- [x] T017 Run `parent-skill-check.cjs .skilled/skills/cli-classifier` and expect exit 0 with two modes. Evidence: session, exit 0, "3b: mode-registry.json declares 2 modes", 13a and 13b at 1.1.0.0, and exit 0 on `cli-external-orchestration` too (session evidence section 3)
- [x] T018 Replay the 10 prompts through `--hub cli-classifier` and compare `action`, `selectionKind` and `packetId` with the baseline (`scratch/route-replay-after.txt`). Evidence: all 17 baseline prompts replayed. The build's comparer printed "TOTAL 17 rows, 17 match, 0 mismatch", exit 0 (`scratch/w3-build/route-after.txt`). The session's own comparer, which also compares `packetKind`, `backendKind` and the exit code, printed `rows 17 after 17 mismatch 0`, exit 0, rerun at committed HEAD `c0178c093d` (`scratch/w3-session/route-after-session.txt`, `compare-output.txt`). The file name `scratch/route-replay-after.txt` was not used
- [x] T019 Kill criterion: if any prompt routes differently, `git revert` the move commit, rerun the replay through `--hub cli-jev` and record the case (`implementation-summary.md`). Evidence: not triggered. Both comparisons report 0 mismatches, so no revert ran
- [x] T020 Run the stale-path `git grep -l '\.skilled/skills/cli-jev/' -- . ':!specs' ':!**/changelog/**' ':!**/benchmark/reports/**'` and expect no output, and confirm every changelog rename is at 100% similarity. Evidence, closure rerun at `c0178c093d`: no output, exit 1. The same pattern without the exclusions matches 134 files, and the 5 outside `specs/` are all changelogs or dated reports, so the pattern works and the exclusions account for every match. The 5 moved changelogs are `R100` in `ea883967d4`. The one added changelog, `cli-classifier/changelog/v1.1.0.0.md` (brief 46), is a new entry, not an edit
- [x] T021 Run the two dispatch tests and read their pass counts and exit status. Evidence: session, dispatch audit vitest 75 passed (baseline 75) and rule-checks `node --test` 20 of 20 (baseline 20) (session evidence section 3)
- [x] T026 Run `compiled-route-manifest.cjs refresh --hub cli-classifier --skill-root .skilled/skills/cli-classifier` and confirm exit 0 and the manifest's SHA-256 equal before and after. Evidence: build, exit 0 with SHA-256 `aa840b21735c7de220e5054f84a4faac84a8641862673dd952ef87f4294ddc7a` before and after, then `freshness` exit 0, `fresh: true`, `causeCode: fresh`. Session: `freshness` `fresh: true` on `cli-classifier` and `cli-external-orchestration` before and after the commit's re-mint
- [x] T027 Run `compiled-route-status.cjs --all`, `compiled-route-guard.cjs` (exit 0), `compiled-route-admission.cjs --hub cli-classifier` and `compiled-route-sync.cjs --check` and `--verify`, and read each output and exit status: 7 hubs, `cli-classifier` compiled-serving, no `cli-jev`. Evidence, session from the final state: status exit 0 with 7 fleet hubs compiled, `cli-classifier` at generation 1 and no `cli-jev` row. Guard exit 0 with 7 hubs fresh. Admission `--hub cli-classifier` exit 0 with 5 pass and 0 drift, and `--all` exit 0. Sync `--check` exit 0, "all 7 hubs resolve", and `--verify` exit 0, "move-simulation OK" (session evidence section 3)
- [x] T022 Commit the move, merges, edits and regenerated artifacts as one path-scoped commit. Evidence: `ea883967d4` holds the move, the merges, every literal list, the harness assertion, the docs, the mirrors and the regenerated artifacts, 177 paths (session evidence section 5, closure rerun `git show --name-only`). The trigger index followed in its own commit `c0178c093d`, because it is built from an archive of HEAD. The session ruled that a recorded deviation from REQ-007
- [x] T023 Run `validate.sh --strict` and `check-goal.cjs` on this phase, and fill `implementation-summary.md` with the table, both replays and the check results. Evidence: the closure pass filled `implementation-summary.md` and ran both gates on the final state of these docs. Their output is in `implementation-summary.md` Verification
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. Evidence: 27 of 27
- [x] No `[B]` blocked tasks remaining. Evidence: none carries `[B]`
- [x] Manual verification passed. Evidence: the session reran every gate from the final state (session evidence section 3), and the closure pass reran the move, grep and registry checks read-only
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
