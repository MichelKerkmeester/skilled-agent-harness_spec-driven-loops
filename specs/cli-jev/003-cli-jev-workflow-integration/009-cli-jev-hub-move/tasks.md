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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the entry gate: `../008-cli-classifier-hub/spec.md` shows Status Complete and `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier` exits 0. The build starts then (operator, 2026-09-29, parent D4 amended), with no Deem `keep` (`implementation-summary.md`)
- [ ] T002 Record the baseline replay before any file moves: each of the 7 canary prompts in `canary-cases.v1.json` and the 3 hub-routing prompts CJ-001, CJ-002 and CJ-003 through `node .skilled/bin/compiled-route.cjs --hub cli-jev --prompt "<prompt>"`, with each exit status (`scratch/route-baseline.txt`)
- [ ] T003 [P] Reopen each literal list at build HEAD and confirm the lines: `compiled-route.cjs:35`, `compiled-route-sync.cjs:59`, `compiled-route-guard.cjs:47`, `compiled-routing-flag.ts:19` and `:37`, `resolve.cjs:36-44`, `serving-closure.manifest.json:5-13` and `dispatch-audit.mjs:46`, `:234` and `:237` (all unchanged on 2026-09-29)
- [ ] T004 [P] Recount the footprint at build HEAD: `git ls-files .skilled/skills/cli-jev` (81 on 2026-09-27 and on 2026-09-29, 59 in `cli-usage`) and `git grep -l 'cli-jev' -- . ':!specs' ':!.skilled/skills/cli-jev'` (48 on 2026-09-27, 62 on 2026-09-29)
- [ ] T005 Write the disposition table for every hub file: the target path, and whether it moves or merges into a `cli-classifier` counterpart (`implementation-summary.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 `git mv` the 59 files of `cli-usage/` to `.skilled/skills/cli-classifier/cli-usage/`, editing only prose that names the packet's hub, such as `SKILL.md:282`
- [ ] T007 `git mv` the 14 files of `benchmark/`, `manual-testing-playbook/`, `shared/` and `changelog/` into the matching `cli-classifier` subtree per the table. Changelogs and dated benchmark reports move byte-identical
- [ ] T008 Merge the 8 hub-root files (`SKILL.md`, `README.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `graph-metadata.json`, `description.json`, `leaf-manifest.json`) into their `cli-classifier` counterparts, then remove each source only after its merge is in the counterpart (`.skilled/skills/cli-classifier/`)
- [ ] T009 Register mode `cli-jev` over packet `cli-usage`: `packetKind` `transport`, `routingClass` `metadata`, today's aliases and tool surface, membership in the transport axis, and its signals in `hub-router.json` with both modes in `tieBreak` (`cli-classifier/mode-registry.json`, `cli-classifier/hub-router.json`)
- [ ] T010 Update the literal lists: `cli-jev` leaves each, and `cli-classifier` appears once, so the fleet stays at 7 hubs. `HUB_CHILD` maps `cli-classifier` to `009-parent-hub-rollout/008-cli-classifier`, the serving-closure file list names the renamed rollout and activation paths, and the advisor's gitignored `dist` twin is rebuilt by `npm run build` (`compiled-route.cjs`, `compiled-route-sync.cjs`, `compiled-route-guard.cjs`, `compiled-routing-flag.ts`, `resolve.cjs`, `serving-closure.manifest.json`)
- [ ] T011 Update the dispatch audit to skill `cli-classifier` and packet path `cli-classifier/cli-usage`, and its two tests (`.skilled/hooks/dispatch/lib/dispatch-audit.mjs`, `dispatch-audit.test.mjs`, `dispatch-rule-checks.test.mjs`)
- [ ] T012 `git mv` the rollout package `009-parent-hub-rollout/008-cli-jev/` to `008-cli-classifier/` in the runtime mirror and in the authored twin, and rework it to compile the two-mode registry, with its harness's literal `cli-jev/...` ids and `SKILL_ROOT` pointing at `cli-classifier` and canary expectations naming mode `cli-jev` (`.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/`, `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/`)
- [ ] T013 [P] Update the `.hermes` mirrors, the `orchestrate` and `prompt-improver` agents in each runtime, `README.md` and `.skilled/skills/README.txt`, and review each remaining naming file, leaving history lines and every changelog as written
- [ ] T014 Regenerate the advisor graph and its parity fixture, the trigger index and its retrieval fixtures with their own tools (`skill-graph.json`, `trigger-index.json`)
- [ ] T024 Move CJ-001 `judgment-request-routes-to-transport.md` and CJ-002 `alias-still-resolves.md` with `git mv` and rewrite each to expect mode `cli-jev` of `cli-classifier`, prompts unchanged, and keep scored scenarios for `cli-deem`, `cli-jev` and out-of-domain. Rewrite or retire CC-002, whose expectation the move makes false (`cli-classifier/manual-testing-playbook/hub-routing/`)
- [ ] T025 Last, `git mv` `013-live-activation/activation/cli-jev/` to `activation/cli-classifier/` in both trees and write its manifest through the manifest library's canonical bytes, since the CLI `mint` verb cannot compile a transport-only hub (`../../002-cli-jev-hub-migration/004-compiled-fleet-onboarding/implementation-summary.md`, Known Limitations 4)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Run `git diff --cached -M --name-status` and confirm a rename for every moved file, CJ-001 and CJ-002 included, and `D` rows only for the eleven named merges: the 8 hub-root files, `benchmark/README.md`, `manual-testing-playbook/manual-testing-playbook.md` and `manual-testing-playbook/hub-routing/out-of-domain-resolves-nothing.md`
- [ ] T016 Run `git ls-files .skilled/skills/cli-jev | wc -l` and expect `0`
- [ ] T017 Run `parent-skill-check.cjs .skilled/skills/cli-classifier` and expect exit 0 with two modes
- [ ] T018 Replay the 10 prompts through `--hub cli-classifier` and compare `action`, `selectionKind` and `packetId` with the baseline (`scratch/route-replay-after.txt`)
- [ ] T019 Kill criterion: if any prompt routes differently, `git revert` the move commit, rerun the replay through `--hub cli-jev` and record the case (`implementation-summary.md`)
- [ ] T020 Run the stale-path `git grep -l '\.skilled/skills/cli-jev/' -- . ':!specs' ':!**/changelog/**' ':!**/benchmark/reports/**'` and expect no output, and confirm every changelog rename is at 100% similarity
- [ ] T021 Run the two dispatch tests and read their pass counts and exit status
- [ ] T026 Run `compiled-route-manifest.cjs refresh --hub cli-classifier --skill-root .skilled/skills/cli-classifier` and confirm exit 0 and the manifest's SHA-256 equal before and after
- [ ] T027 Run `compiled-route-status.cjs --all`, `compiled-route-guard.cjs` (exit 0), `compiled-route-admission.cjs --hub cli-classifier` and `compiled-route-sync.cjs --check` and `--verify`, and read each output and exit status: 7 hubs, `cli-classifier` compiled-serving, no `cli-jev`
- [ ] T022 Commit the move, merges, edits and regenerated artifacts as one path-scoped commit
- [ ] T023 Run `validate.sh --strict` and `check-goal.cjs` on this phase, and fill `implementation-summary.md` with the table, both replays and the check results
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
