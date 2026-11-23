---
title: "Tasks: Phase 8: hub-wiring"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "hub wiring tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: hub-wiring

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Shell variables: `H` is `.skilled/skills/system-skilled-bots`. `PSC` is `node .skilled/commands/doctor/scripts/parent-skill-check.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [B] T001 Confirm phases 001 to 007 are closed (`../00[1-7]-*/acceptance-criteria.md`). Verify: `rg -c '\| Unmet \|' ../00[1-7]-*/acceptance-criteria.md` prints no file with a count above 0. Evidence: `rg -c` prints `../002-schedule-predicates-and-checker/acceptance-criteria.md:3`: phase 002 keeps three Unmet weekday-probe rows, so the precondition is not met. Recorded, not patched here.
- [x] T002 Re-capture the Measured Behavior block with the phase 1 skill root in place (`spec.md`). Verify: `$PSC $H` output is pasted verbatim with its exit status. Evidence: Re-captured in `spec.md` Measured Behavior: the HEAD skill root held only `assets`, `runtime`, `scripts` and the gate exited 2; after the build the gate exits 0 (`scratch/parent-skill-check.txt:66`).
- [x] T003 Read the two workflow contracts in full (`.skilled/commands/create/skill-parent.md`, `.skilled/commands/create/command.md`). Verify: each contract's owned assets are named in `plan.md` section 6 with no missing path. Evidence: Both contracts read and followed; owned assets named in `plan.md` section 6.
- [x] T004 Settle the mode aliases and record them (`decision-record.md` ADR-002). Verify: `rg -n 'ADR-002' decision-record.md` shows the alias list per mode. Evidence: ADR-002 carries the final alias list and the four aliases dropped after the doctor-routing replay.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T005 Run `/create:skill-parent system-skilled-bots <create|update> --modes author,run,schedule,status` to scaffold the hub, using `update` when phase 1 left a skill root (`$H/`). Verify: `ls $H` lists `SKILL.md`, `mode-registry.json`, `hub-router.json`, `ROUTER.md`, `graph-metadata.json`, `description.json` and four mode folders. Evidence: `create` was used because the HEAD skill root had no `SKILL.md`. `ls` lists the hub files and `bots-author`, `bots-run`, `bots-schedule`, `bots-status` (`scratch/surfaces.txt:23`).
- [x] T006 Set `routingClass` to `metadata` for every mode (`$H/mode-registry.json`). Verify: `rg -c '"routingClass": "metadata"' $H/mode-registry.json` prints 4. Evidence: `rg -c` prints 4.
- [x] T007 Confirm no nested advisor identity (`$H/`). Verify: `find $H -mindepth 2 -name graph-metadata.json` prints nothing. Evidence: `find` prints nothing.
- [x] T008 Fill `routerSignals` and a `tieBreak` that lists the four modes once each (`$H/hub-router.json`). Verify: `$PSC $H` reports check 5e passing. Evidence: `$PSC $H` passes every hard invariant (`scratch/parent-skill-check.txt:65`).
- [x] T009 Fill `INTENT_SIGNALS` and `RESOURCE_MAP` with equal keys for the four modes (`$H/ROUTER.md`). Verify: the key lists printed by `rg` from both blocks are identical. Evidence: Both blocks list `AUTHOR,RUN,SCHEDULE,STATUS`.
- [x] T010 Add every mode's vocabulary to the hub's advisor identity (`$H/graph-metadata.json`). Verify: `rg -n 'author|run|schedule|status' $H/graph-metadata.json` shows vocabulary for each mode. Evidence: `ci-router-vocabulary-reach.cjs --hub system-skilled-bots` RESULT: PASSED (`scratch/final-gates.txt:32`).
- [x] T011 Name all four modes and the packet count in the mode table (`$H/SKILL.md`). Verify: `$PSC $H` reports check 6b passing. Evidence: Check 6b passes; the mode table names all four (`scratch/surfaces.txt:28`).
- [x] T012 Name all four modes in keywords and description (`$H/description.json`). Verify: `rg -c 'author|run|schedule|status' $H/description.json` prints a count of 4 or more. Evidence: `rg -c` prints 15.
- [x] T013 Run `/create:command` once per bots command per ADR-003 (`.skilled/commands/bots/`). Verify: `ls .skilled/commands/bots/` lists one command file per mode. Evidence: `ls .skilled/commands/bots/` lists `author.md`, `run.md`, `schedule.md`, `status.md` and `assets/`.
- [x] T014 Record one entry per owned command (`$H/command-metadata.json`). Verify: `$PSC $H` reports no command-metadata finding. Evidence: Check 3k passes for 4 bound commands (`scratch/parent-skill-check.txt:23`).
- [x] T015 Run `/create:command` for the doctor bots command and its asset (`.skilled/commands/doctor/assets/doctor-bots-check.yaml`). Verify: the asset invokes the phase 2 checker and `rg -n 'bots' .skilled/commands/doctor/_routes.yaml` prints its route. Evidence: The asset runs `bot-check.cjs`; `_routes.yaml` holds the `/doctor:bots` route (target bots-check, read-only).
- [x] T016 Generate the runtime mirrors with each sync script (`.claude/commands/`, `.cursor/commands/`, `.codex/prompts/`, `.pi/prompts/`). Verify: each tree lists every bots command and the doctor bots command. Evidence: Each tree lists the four bots commands and doctor bots (`scratch/mirrors.txt:1`).
- [x] T017 Regenerate the leaf manifest (`$H/leaf-manifest.json`). Verify: `$PSC $H` reports `10b-byte-drift` passing. Evidence: `PASS: 10b-byte-drift` (`scratch/parent-skill-check.txt:50`).

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T018 Run the per-hub gate with the hub path (`$H`). Verify: `$PSC $H` exits 0 and its `INFO: Parent skill:` line names `system-skilled-bots`. Evidence: Exit 0, `INFO: Parent skill: .skilled/skills/system-skilled-bots` (`scratch/parent-skill-check.txt:1`).
- [x] T019 Replay stage two with one natural prompt per mode (`.skilled/bin/compiled-route.cjs`). Verify: `node .skilled/bin/compiled-route.cjs --hub system-skilled-bots --prompt "<prompt>"` returns the expected mode with non-empty intents for all four prompts. Evidence: after the compiled engine, canaries and activation (operator decision Q002), the manifest serves `compiled` and the front door routes author, run, schedule and status, one target each (`scratch/stage-two-after-review-fix.jsonl:1`). The front door prints no intents field for any hub; the compiled gold carries `observedIntents` per scenario.
- [x] T020 Replay stage one with the same four prompts (`.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`). Verify: `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "<prompt>" --threshold 0.5` returns `system-skilled-bots` for all four. Evidence: Top `system-skilled-bots` for all four (`scratch/stage-one-replay.jsonl:1`).
- [x] T021 Replay each alias against one out-of-domain phrase (`decision-record.md` ADR-002). Verify: neither stage selects `system-skilled-bots` for any out-of-domain phrase. Evidence: No probe puts the hub first in either stage (`scratch/stage-one-replay.jsonl:10`, `scratch/stage-two-replay.jsonl:10`).
- [x] T022 Run the mirror checkers (`.skilled/skills/system-spec-kit/runtime/cli/`). Verify: `validate-command-tree-parity.sh`, `codex/sync-prompts.cjs --check` and `pi/sync-prompts-pi.cjs --check` each exit 0. Evidence: All three exit 0 (`scratch/mirrors.txt:46`).
- [x] T023 Run a staged re-pin on a copy of a vendored consumer with a fixture `bots/` folder (`.skilled/commands/doctor/scripts/overlay-engine.cjs`). Verify: `shasum` over every file in `bots/` prints the same list for the copy before the run, for the copy after `repin --root <copy> --stage <empty dir>` and for the staged tree. Evidence: Both `diff` runs print nothing (`scratch/repin-proof.txt:41`, `scratch/repin-proof.txt:43`).
- [x] T024 Check the ungated surfaces by hand and record each result (`implementation-summary.md`). Verify: the Verification table holds one row each for stage-two intent, advisor vocabulary and `description.json`, with command and output. Evidence: Verification table rows in `implementation-summary.md`.
- [x] T025 Confirm no runtime file changed in this phase (`$H/runtime/`). Verify: `git diff --stat -- $H/runtime` prints nothing. Evidence: Prints nothing (`scratch/d4-runtime-untouched.txt:1`).
- [x] T027 Replay one `bots inbox` prompt and one `bots answer` prompt through both stages, then each new alias against its out-of-domain phrase (`.skilled/bin/compiled-route.cjs`, `skill_advisor.py`). Verify: inbox returns status, answer returns run, stage one returns `system-skilled-bots`, and no out-of-domain phrase selects the hub. Evidence: inbox lists the hub first at 0.855 and routes to status; answer lists it first at 0.91 and routes to run (`scratch/stage-one-final.jsonl:6`, `scratch/stage-one-final.jsonl:7`). Every out-of-domain probe defers at stage two (`scratch/stage-two-after-review-fix.jsonl:12`).
- [x] T028 In the T023 copy, add a fixture install record at `<state root>/<identity>/installs/<bot-id>.json` under a temp user-level state root (`XDG_STATE_HOME`), and a fixture run folder under the copy's `.skilled/skills/.state/system-skilled-bots/<identity>/runs/`, then read the staged tree with `bots status` (`scratch/`). Verify: `bots status` reports the schedule as needing reinstall, and `ls` of the run folder in the copy and the staged tree is recorded with whether it survived. Evidence: Verify reads the promoted case after operator decision Q004. Rerun from the final state: `needs-reinstall` with reason `pin-changed` once the staged tree takes the copy's path (`scratch/repin-proof-final.txt:61`); the run folder survived in the copy and the staged tree (`scratch/repin-proof-final.txt:45`).
- [x] T026 Confirm no earlier phase claims a mode is routed (`../00[1-8]-*/`). Verify: `rg -n -i 'mode.{0,20}(is|are) (routed|reachable|integrated)' ../00[1-8]-*/*.md` prints no claim of completed routing or integration. Evidence: Only negations match (`scratch/ac007-no-routed-claim.txt:1`).

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [x] `implementation-summary.md` holds the verbatim gate, replay and re-pin outputs
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
- **Closure gate**: See `acceptance-criteria.md`
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

A task blocked by a defect in phases 1 to 7 is marked `[B]` and the defect goes back to the owning phase. This phase never patches runtime code.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available: phases 001 to 007 closed per T001. Not met: phase 002 keeps three Unmet rows (T001).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] Every JSON hub file parses: `node -e 'JSON.parse(require("fs").readFileSync(f))'` succeeds for each Every `*.json` at the hub root parses.
- [x] CHK-011 [P0] `parent-skill-check.cjs` with the hub path prints no ERROR line Exit 0, 0 warnings.
- [x] CHK-012 [P1] No hub or command file was hand-rolled outside `/create:skill-parent` and `/create:command`. Redone per operator decision Q001: `/create:skill-parent` and `/create:command` ran as @markdown step by step (`scratch/workflow-run-log.txt:1`). `command-metadata.json` and the `active` ROUTER.md maps are authored companions the workflows do not write, and the `_routes.yaml` entry is a post-workflow registration, each logged there.
- [x] CHK-013 [P1] Every alias is lowercase and unique across the four modes 24 aliases, 24 unique, all lowercase.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] All acceptance criteria met. Every row of `acceptance-criteria.md` is Met after the redo, the activation and the final-state reruns.
- [x] CHK-021 [P0] Both routing stages replayed for all four modes with verbatim output recorded. Both stages replayed for all four modes plus inbox and answer, verbatim in `scratch/stage-one-final.jsonl:1` and `scratch/stage-two-after-review-fix.jsonl:1`.
- [x] CHK-022 [P1] Each alias replayed against an out-of-domain phrase Six probes replayed through both stages.
- [x] CHK-023 [P1] Staged re-pin left the consumer copy's `bots/` byte-identical `diff` printed nothing for both comparisons.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

N/A. This phase fixes no reported finding. The rows stay unchecked and do not block closure.

- [ ] CHK-FIX-001 [P2] N/A: no actionable finding to classify.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No hardcoded secrets in any hub, command or doctor file `rg` for key, secret, token and password finds only template and prose wording.
- [x] CHK-031 [P0] Each command's `allowed-tools` matches its mode's tool surface, and the status command grants no write tool Check 3k passes; the status command grants Read, Bash, Grep, Glob only.
- [x] CHK-032 [P1] The doctor asset runs the checker read-only The asset declares `read_only: true` and the run left `git status` unchanged except for its evidence file.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec/plan/tasks synchronized Spec, plan, tasks and acceptance criteria updated together.
- [x] CHK-041 [P1] Hub `SKILL.md` and `description.json` name the same four modes Both name author, run, schedule and status.
- [x] CHK-042 [P2] Each mode packet's `README.md` names its command Each packet README names its `/bots:<mode>` command.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [ ] CHK-050 [P1] The re-pin copy and its stage folder live under `scratch/` only. Deviation: the copy and its stage folder were built in the session scratchpad outside the worktree, as the dispatch asked for a temp folder, and only the evidence was copied to `scratch/`.
- [x] CHK-051 [P1] scratch/ cleaned before completion The copy, stage folder and temp HOME were deleted after the run; evidence files stay in `scratch/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 6/8 |
| P1 Items | 10 | 7/10 |
| P2 Items | 2 | 1/2 |

**Verification Date**: 2026-11-23
<!-- /ANCHOR:summary -->

---
