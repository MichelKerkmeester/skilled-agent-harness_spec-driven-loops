---
title: "Tasks: Move cli-jev into the cli-classifier Hub"
description: "Ordered tasks for the entry gate, the route replay baseline, the disposition table, the one-commit git mv of all 81 hub files with the hub-file merges and literal-list updates, and the replay and hub checks that decide keep or revert."
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

Every task is blocked until 008-cli-classifier-hub is Complete and a Deem arm in phase 002 or 017 prints `keep` under that phase's pre-fixed keep rule (D4 of the parent goal). `cli-classifier` and `cli-deem` are proposed names from phase 008.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [B] Confirm the entry gate: `../008-cli-classifier-hub/spec.md` shows Complete, `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier` exits 0 and a Deem arm in 002 or 017 printed `keep` under that phase's pre-fixed keep rule. Name the keep's phase, verdict line and commit pair (`implementation-summary.md`). With no such keep, stop, leave the phase Planned and put the deciding verdicts in the parent goal's log (`../goal.md`)
- [ ] T002 Record the baseline replay before any file moves: each of the 7 canary prompts in `canary-cases.v1.json` and the 3 hub-routing prompts CJ-001, CJ-002 and CJ-003 through `node .skilled/bin/compiled-route.cjs --hub cli-jev --prompt "<prompt>"`, with each exit status (`scratch/route-baseline.txt`)
- [ ] T003 [P] Reopen each literal list at build HEAD and confirm the lines: `compiled-route.cjs:35`, `compiled-route-sync.cjs:59`, `compiled-route-guard.cjs:47`, `compiled-routing-flag.ts:19` and `:37`, `resolve.cjs:36-44`, `serving-closure.manifest.json:5-13` and `dispatch-audit.mjs:46`, `:234` and `:237`
- [ ] T004 [P] Recount the footprint at build HEAD: `git ls-files .skilled/skills/cli-jev` (81 on 2026-09-27, 59 in `cli-usage`) and `git grep -l 'cli-jev' -- . ':!specs' ':!.skilled/skills/cli-jev'` (48)
- [ ] T005 Write the disposition table for every hub file: the target path, and whether it moves or merges into a `cli-classifier` counterpart (`implementation-summary.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 `git mv` the 59 files of `cli-usage/` to `.skilled/skills/cli-classifier/cli-usage/`, editing only prose that names the packet's hub, such as `SKILL.md:282`
- [ ] T007 `git mv` the 14 files of `benchmark/`, `manual-testing-playbook/`, `shared/` and `changelog/` into the matching `cli-classifier` subtree per the table. Changelogs and dated benchmark reports move byte-identical
- [ ] T008 Merge the 8 hub-root files (`SKILL.md`, `README.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `graph-metadata.json`, `description.json`, `leaf-manifest.json`) into their `cli-classifier` counterparts, then remove each source only after its merge is in the counterpart (`.skilled/skills/cli-classifier/`)
- [ ] T009 Register mode `cli-jev` over packet `cli-usage`: `packetKind` `transport`, `routingClass` `metadata`, today's aliases and tool surface, membership in the transport axis, and its signals in `hub-router.json` with both modes in `tieBreak` (`cli-classifier/mode-registry.json`, `cli-classifier/hub-router.json`)
- [ ] T010 Update the literal lists: `cli-jev` leaves each, and `cli-classifier` appears once (`compiled-route.cjs`, `compiled-route-sync.cjs`, `compiled-route-guard.cjs`, `compiled-routing-flag.ts`, `resolve.cjs`, `serving-closure.manifest.json`)
- [ ] T011 Update the dispatch audit to skill `cli-classifier` and packet path `cli-classifier/cli-usage`, and its two tests (`.skilled/hooks/dispatch/lib/dispatch-audit.mjs`, `dispatch-audit.test.mjs`, `dispatch-rule-checks.test.mjs`)
- [ ] T012 Rework the rollout package to compile the two-mode registry, with canary expectations naming mode `cli-jev` (`.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-jev/`)
- [ ] T013 [P] Update the `.hermes` mirrors, the `orchestrate` and `prompt-improver` agents in each runtime, `README.md` and `.skilled/skills/README.txt`, and review each remaining naming file, leaving history lines and every changelog as written
- [ ] T014 Regenerate the advisor graph and its parity fixture, the trigger index and its retrieval fixtures with their own tools (`skill-graph.json`, `trigger-index.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Run `git diff --cached -M --name-status` and confirm a rename for every moved file and `D` rows only for merged hub-level files named in the table
- [ ] T016 Run `git ls-files .skilled/skills/cli-jev | wc -l` and expect `0`
- [ ] T017 Run `parent-skill-check.cjs .skilled/skills/cli-classifier` and expect exit 0 with two modes
- [ ] T018 Replay the 10 prompts through `--hub cli-classifier` and compare `action`, `selectionKind` and `packetId` with the baseline (`scratch/route-replay-after.txt`)
- [ ] T019 Kill criterion: if any prompt routes differently, `git revert` the move commit, rerun the replay through `--hub cli-jev` and record the case (`implementation-summary.md`)
- [ ] T020 Run the stale-path `git grep -l '\.skilled/skills/cli-jev/' -- . ':!specs' ':!**/changelog/**' ':!**/benchmark/reports/**'` and expect no output, and confirm every changelog rename is at 100% similarity
- [ ] T021 Run the two dispatch tests and read their pass counts and exit status
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
