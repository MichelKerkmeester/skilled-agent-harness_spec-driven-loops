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

- [ ] T001 Confirm phases 001 to 007 are closed (`../00[1-7]-*/acceptance-criteria.md`). Verify: `rg -c '\| Unmet \|' ../00[1-7]-*/acceptance-criteria.md` prints no file with a count above 0.
- [ ] T002 Re-capture the Measured Behavior block with the phase 1 skill root in place (`spec.md`). Verify: `$PSC $H` output is pasted verbatim with its exit status.
- [ ] T003 Read the two workflow contracts in full (`.skilled/commands/create/skill-parent.md`, `.skilled/commands/create/command.md`). Verify: each contract's owned assets are named in `plan.md` section 6 with no missing path.
- [ ] T004 Settle the mode aliases and record them (`decision-record.md` ADR-002). Verify: `rg -n 'ADR-002' decision-record.md` shows the alias list per mode.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [ ] T005 Run `/create:skill-parent system-skilled-bots <create|update> --modes author,run,schedule,status` to scaffold the hub, using `update` when phase 1 left a skill root (`$H/`). Verify: `ls $H` lists `SKILL.md`, `mode-registry.json`, `hub-router.json`, `ROUTER.md`, `graph-metadata.json`, `description.json` and four mode folders.
- [ ] T006 Set `routingClass` to `metadata` for every mode (`$H/mode-registry.json`). Verify: `rg -c '"routingClass": "metadata"' $H/mode-registry.json` prints 4.
- [ ] T007 Confirm no nested advisor identity (`$H/`). Verify: `find $H -mindepth 2 -name graph-metadata.json` prints nothing.
- [ ] T008 Fill `routerSignals` and a `tieBreak` that lists the four modes once each (`$H/hub-router.json`). Verify: `$PSC $H` reports check 5e passing.
- [ ] T009 Fill `INTENT_SIGNALS` and `RESOURCE_MAP` with equal keys for the four modes (`$H/ROUTER.md`). Verify: the key lists printed by `rg` from both blocks are identical.
- [ ] T010 Add every mode's vocabulary to the hub's advisor identity (`$H/graph-metadata.json`). Verify: `rg -n 'author|run|schedule|status' $H/graph-metadata.json` shows vocabulary for each mode.
- [ ] T011 Name all four modes and the packet count in the mode table (`$H/SKILL.md`). Verify: `$PSC $H` reports check 6b passing.
- [ ] T012 Name all four modes in keywords and description (`$H/description.json`). Verify: `rg -c 'author|run|schedule|status' $H/description.json` prints a count of 4 or more.
- [ ] T013 Run `/create:command` once per bots command per ADR-003 (`.skilled/commands/bots/`). Verify: `ls .skilled/commands/bots/` lists one command file per mode.
- [ ] T014 Record one entry per owned command (`$H/command-metadata.json`). Verify: `$PSC $H` reports no command-metadata finding.
- [ ] T015 Run `/create:command` for the doctor bots command and its asset (`.skilled/commands/doctor/assets/doctor-bots-check.yaml`). Verify: the asset invokes the phase 2 checker and `rg -n 'bots' .skilled/commands/doctor/_routes.yaml` prints its route.
- [ ] T016 Generate the runtime mirrors with each sync script (`.claude/commands/`, `.cursor/commands/`, `.codex/prompts/`, `.pi/prompts/`). Verify: each tree lists every bots command and the doctor bots command.
- [ ] T017 Regenerate the leaf manifest (`$H/leaf-manifest.json`). Verify: `$PSC $H` reports `10b-byte-drift` passing.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [ ] T018 Run the per-hub gate with the hub path (`$H`). Verify: `$PSC $H` exits 0 and its `INFO: Parent skill:` line names `system-skilled-bots`.
- [ ] T019 Replay stage two with one natural prompt per mode (`.skilled/bin/compiled-route.cjs`). Verify: `node .skilled/bin/compiled-route.cjs --hub system-skilled-bots --prompt "<prompt>"` returns the expected mode with non-empty intents for all four prompts.
- [ ] T020 Replay stage one with the same four prompts (`.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`). Verify: `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "<prompt>" --threshold 0.5` returns `system-skilled-bots` for all four.
- [ ] T021 Replay each alias against one out-of-domain phrase (`decision-record.md` ADR-002). Verify: neither stage selects `system-skilled-bots` for any out-of-domain phrase.
- [ ] T022 Run the mirror checkers (`.skilled/skills/system-spec-kit/runtime/cli/`). Verify: `validate-command-tree-parity.sh`, `codex/sync-prompts.cjs --check` and `pi/sync-prompts-pi.cjs --check` each exit 0.
- [ ] T023 Run a staged re-pin on a copy of a vendored consumer with a fixture `bots/` folder (`.skilled/commands/doctor/scripts/overlay-engine.cjs`). Verify: `shasum` over every file in `bots/` prints the same list for the copy before the run, for the copy after `repin --root <copy> --stage <empty dir>` and for the staged tree.
- [ ] T024 Check the ungated surfaces by hand and record each result (`implementation-summary.md`). Verify: the Verification table holds one row each for stage-two intent, advisor vocabulary and `description.json`, with command and output.
- [ ] T025 Confirm no runtime file changed in this phase (`$H/runtime/`). Verify: `git diff --stat -- $H/runtime` prints nothing.
- [ ] T027 Replay one `bots inbox` prompt and one `bots answer` prompt through both stages, then each new alias against its out-of-domain phrase (`.skilled/bin/compiled-route.cjs`, `skill_advisor.py`). Verify: inbox returns status, answer returns run, stage one returns `system-skilled-bots`, and no out-of-domain phrase selects the hub.
- [ ] T028 In the T023 copy, add a fixture install record at `<state root>/<identity>/installs/<bot-id>.json` under a temp user-level state root (`XDG_STATE_HOME`), and a fixture run folder under the copy's `.skilled/skills/.state/system-skilled-bots/<identity>/runs/`, then read the staged tree with `bots status` (`scratch/`). Verify: `bots status` reports the schedule as needing reinstall, and `ls` of the run folder in the copy and the staged tree is recorded with whether it survived.
- [ ] T026 Confirm no earlier phase claims a mode is routed (`../00[1-8]-*/`). Verify: `rg -n -i 'mode.{0,20}(is|are) (routed|reachable|integrated)' ../00[1-8]-*/*.md` prints no claim of completed routing or integration.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `implementation-summary.md` holds the verbatim gate, replay and re-pin outputs
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available: phases 001 to 007 closed per T001
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [ ] CHK-010 [P0] Every JSON hub file parses: `node -e 'JSON.parse(require("fs").readFileSync(f))'` succeeds for each
- [ ] CHK-011 [P0] `parent-skill-check.cjs` with the hub path prints no ERROR line
- [ ] CHK-012 [P1] No hub or command file was hand-rolled outside `/create:skill-parent` and `/create:command`
- [ ] CHK-013 [P1] Every alias is lowercase and unique across the four modes
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Both routing stages replayed for all four modes with verbatim output recorded
- [ ] CHK-022 [P1] Each alias replayed against an out-of-domain phrase
- [ ] CHK-023 [P1] Staged re-pin left the consumer copy's `bots/` byte-identical
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

- [ ] CHK-030 [P0] No hardcoded secrets in any hub, command or doctor file
- [ ] CHK-031 [P0] Each command's `allowed-tools` matches its mode's tool surface, and the status command grants no write tool
- [ ] CHK-032 [P1] The doctor asset runs the checker read-only
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Hub `SKILL.md` and `description.json` name the same four modes
- [ ] CHK-042 [P2] Each mode packet's `README.md` names its command
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [ ] CHK-050 [P1] The re-pin copy and its stage folder live under `scratch/` only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 10 | 0/10 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-11-22 (planned, not yet verified)
<!-- /ANCHOR:summary -->

---
