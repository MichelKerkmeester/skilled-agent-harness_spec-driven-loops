---
title: "Feature Specification: Phase 17: handover-docs-and-harness"
description: "The session-relaunch README and the Claude relaunch playbook say nothing about what phases 009 to 016 change, and README line 83 says a hop takes the name from the relaunch record, which the wrapper does not do. The live hop harness can delete a sandbox session folder before the receiver's last write, which left a session log under ~/.claude/projects on 2026-11-13."
trigger_phrases:
  - "handover docs and harness"
  - "phase 17 handover docs and harness"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 17: handover-docs-and-harness

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-13 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 17 of 17 |
| **Predecessor** | 016-receiver-claim-under-goal |
| **Successor** | None |
| **Handoff Criteria** | Phases 009 to 016 each end Complete or declined, every acceptance row of this phase is Met, and `validate.sh 017-handover-docs-and-harness --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 17** of the State a session hop drops: running workers, session names, permission mode and schedules specification.

**Scope Boundary**: Documentation of what phases 009 to 016 ship or decline, in the session-relaunch README and the Claude relaunch playbook, plus one harness fix in `finish-run.sh` with its test. No hook, adapter, wrapper, plugin or deep-loop source changes in this phase.

**Dependencies**:
- Phases 009 to 016 have each closed, Complete or declined, with their acceptance criteria settled. Each documentation task names the phase it waits on.
- The live hop harness under `028-goal-rebind-live-proof-and-docs/scratch/harness/` and the recorded worker variant diff under `scratch/live-hops-claude-2026-11-13/10-background-worker-orphaned/`.
- `node`, `rg`, `patch`, `tmux` and `claude` for the one live run.

**Deliverables**:
- README sections that describe each shipped change and each declined one with its reason.
- A corrected README line 83 that says where the hop name really comes from.
- Playbook checks, one per shipped behaviour, including a repeatable background-worker hop.
- A raised playbook frontmatter version.
- A `finish-run.sh` that cannot leave a sandbox session folder behind, with a test that failed first.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 009 to 016 change what a hand-over note asks for, what a hop carries and when a hop is refused or deferred, and neither the README nor the Claude playbook mentions any of it. README line 83 already says the name comes from the relaunch record, while `prepare` stores it from the environment (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:560`) and the wrapper reads only model, provider and effort back from `consume` (`.skilled/bin/skilled-loop:1226`, `:1241`, `:1252`). The harness `finish-run.sh` deletes the sandbox session folder at once (`finish-run.sh:16`) while the receiver ended by the tmux kill in `run-hop.sh:24-25` may still write, which left a sandbox session log under `~/.claude/projects` on 2026-11-13.

### Purpose
An operator can read in the README what a hop carries and drops after phases 009 to 016, can repeat each shipped behaviour from the playbook, and a harness run leaves no sandbox folder behind.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
rg -n -o --sort path -F -e 'Running workers:' -e 'Scheduled:' -e 'Added directories:' -e '--permission-mode' -e 'name, provider and Pi extension settings come from the relaunch record' -e 'Any other child program is not detected' -e 'version: 1.0.21.0' -e 'rm -rf "$(cat "$out/project-dir.txt")"' -e 'trap cleanup EXIT' .skilled/hooks/session-relaunch/README.md .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md $H/finish-run.sh $H/run-hop.sh
.skilled/hooks/session-relaunch/README.md:83:name, provider and Pi extension settings come from the relaunch record
.skilled/hooks/session-relaunch/README.md:124:Any other child program is not detected
.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md:9:version: 1.0.21.0
specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/finish-run.sh:16:rm -rf "$(cat "$out/project-dir.txt")"
specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/run-hop.sh:25:trap cleanup EXIT
exit=0
```

`$H` is `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness`. Neither document holds a `Running workers:`, `Scheduled:`, `Added directories:` or `--permission-mode` string. The README still states the record as the name source and the shell-child limit. The playbook is at version 1.0.21.0. `finish-run.sh` removes the project folder in one step with no wait, and `run-hop.sh` ends the receiver only through its exit trap.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Document in the README each change phases 009 to 016 ship, and each change a phase declines with its reason.
- Correct README line 83 so the name source matches the wrapper as phase 012 leaves it.
- Add playbook checks, one per shipped behaviour, including a repeatable background-worker hop built from the recorded variant diff.
- Raise the playbook frontmatter version with `frontmatter-version.mjs bump --base HEAD`.
- Make `finish-run.sh` watch the removed project folder for a settle window and remove it again each time it reappears, with a test that fails first.

### Out of Scope
- Any behaviour change in a hook, adapter, wrapper, plugin or the fan-out runner - phases 009 to 016 own those, and this phase only describes them.
- The wrong iteration timestamp in `research/deep-research-state.jsonl:6` - decision D4 in `goal.md`: the deep-research iteration writer in `system-deep-loop` stamps it, so a fix belongs to that skill, and rewriting a closed research record would change evidence.
- `run-hop.sh` behaviour - the background-worker form is produced by applying the recorded diff to a copy, so the harness script itself does not change.
- The Pi and OpenCode playbooks and the feature catalog - the brief names only the Claude playbook.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/README.md` | Modify | Shipped and declined changes from phases 009 to 016, and the corrected name sentence on line 83 |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` | Modify | One check per shipped behaviour, the background-worker hop and the raised version |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/finish-run.sh` | Modify | Remove the project folder, then watch it for a settle window and remove it again on a late write |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/test-finish-run.sh` | Create | The failing-first test for the late write |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Depends on phase 009. The README hand-over section names each note line phase 009 ships, `Running workers:`, `Scheduled:` and `Added directories:`, says what the receiver does with each, and gives the reason for any line phase 009 declines. `rg -c 'Running workers:\|Scheduled:\|Added directories:' .skilled/hooks/session-relaunch/README.md` prints at least 3, or the decline sentence names the line. |
| REQ-002 | Depends on phases 009 and 010. The README deep-loop step says what the nudge now asks before the lock release, as phase 009 ships it at `lib/nudge.cjs:199` today, and one sentence states the fan-out liveness check phase 010 ships in `fanout-pool.cjs`, or its decline reason. |
| REQ-003 | Depends on phases 011 and 012. The README states the permission mode carry-over and the session name carry-over with the hop suffix, per runtime, as those phases ship them. README line 83 no longer says the name comes from the relaunch record unless phase 012 makes the wrapper read `name` from `consume`, and the sentence names the source the wrapper actually uses. |
| REQ-004 | Depends on phases 013 and 014. The README states the OpenCode child-session guard and title carry-over phase 013 ships, and the deferred-hop notice and cron handling phase 014 ships, each with its runtime, or each decline reason. |
| REQ-005 | Depends on phases 015 and 016. The README states the Pi mode carry-over, the descendant walk and the receiver claim under a goal as phases 015 and 016 end. A phase that ends in a decline is documented as declined with the reason its own record gives. |
| REQ-006 | Depends on phases 009 to 016. The Claude playbook holds one check per behaviour the phases ship on Claude or in the shared core, each with its exact command, expected signal and pass or fail line. A behaviour only another runtime ships is named with the playbook that should carry it, and a declined change gets no check. |
| REQ-007 | The Claude playbook holds a live background-worker hop check that applies `scratch/live-hops-claude-2026-11-13/10-background-worker-orphaned/run-hop-variant.diff` to a copy of `run-hop.sh` with `patch -o`, runs it with `NO_GOAL=1`, and reads `RECEIVER.marker`, `PREPARE.exit` and `worker.log`. The check names the `PREPARE.exit` value phases 009 and 015 leave, because the harness note at `run-hop.sh:151-152` has no `Running workers:` line and a shipped validation or descendant walk could refuse it. One run of the check as written ends with its evidence folder recorded. |
| REQ-008 | `finish-run.sh` removes the project folder, then checks it once a second for `FINISH_SETTLE_S` seconds (default 15) and removes it again each time it reappears, printing `finish-run: removed <folder> again after a late write` on stderr. It exits 1 with `finish-run: <folder> is still present` when the folder exists at the end of the window. Test `a late write after finish-run leaves no project folder` in `test-finish-run.sh` starts a writer that recreates the folder 2 s after `finish-run.sh` starts, runs it with `FINISH_SETTLE_S=5`, and asserts the folder is absent 3 s after it returns. Today the folder is recreated and stays. A wait on the pids in `processes.txt` is not used: `run-hop.sh:183` keeps only processes whose command line names the sandbox, and the runtime command at `run-hop.sh:53` and `:72` names no sandbox path, so the list is likely empty for Claude (inferred, not observed). |
| REQ-009 | The playbook frontmatter version is raised by `node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs bump --base HEAD` with the playbook staged, so `version:` is above 1.0.21.0. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-010 | No behaviour change. `git diff --name-only` over `.skilled`, `.opencode` and the 028 harness folder lists only the four files in the Files to Change table. |
| REQ-011 | The README and the playbook still pass `validate_document.py` with 0 issues, as they did before the edit. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each of phases 009 to 016 is named in the README by the change it ships or by its decline reason, checked by the commands in `acceptance-criteria.md`.
- **SC-002**: `bash $H/test-finish-run.sh` exits 0 after the fix and exited 1 before it.
- **SC-003**: The live background-worker check run as written leaves its evidence folder with the `PREPARE.exit` value the check names in `summary.txt`, and `ls` of the run's project folder prints nothing after `finish-run.sh` returns.
- **SC-004**: `validate.sh 017-handover-docs-and-harness --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 009 to 016 closed | The README would describe planned work as shipped | Each documentation task reads that phase's `acceptance-criteria.md` closure line first and writes nothing until it says Yes or the phase records a decline |
| Risk | The late write has a cause other than the receiver outliving the tmux kill, or comes after the settle window | Medium | The fix removes the folder again whatever wrote it, the window is 15 s by default, and the live run checks the folder stays absent |
| Risk | The worker diff no longer applies after a later `run-hop.sh` edit | Low | Setup runs `patch -o` into the scratchpad first, and on 2026-11-13 it applied with exit 0 |
| Risk | The live check leaves the orphaned worker running | Low | The variant kills the worker pid at its end, and the check reads `ps -p` for that pid after the run |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `finish-run.sh` adds `FINISH_SETTLE_S` seconds, 15 by default, to a run.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: `finish-run.sh` removes only the folder named in `$out/project-dir.txt` and the run's own `run` folder, as it does today.
- **NFR-S02**: No raw transcript survives `finish-run.sh`, because they hold the runtime's system prompt and private instruction files.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: A folder still present after the re-check makes `finish-run.sh` exit 1, so a leak is never silent.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an empty `project-dir.txt`, as an OpenCode run writes (`run-hop.sh:33`), removes nothing and skips the settle window.
- Maximum input: a writer that keeps recreating the folder past the window makes the run exit 1.
- Failure path: a folder that reappears after the second removal makes `finish-run.sh` print `finish-run: <folder> was written after removal` on stderr and exit 1.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two documents, one harness script and one new test script |
| Risk | 4/25 | No product code changes, and the harness only removes the folder it already removes |
| Research | 6/20 | Each section waits on a sibling phase's outcome |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does the receiver write its session log after the tmux kill in `run-hop.sh:24-25`? This is inferred from the leftover log, and the live run in the playbook task settles it.
- Which phases end in a decline? Known only once each of phases 009 to 016 closes.
<!-- /ANCHOR:questions -->

---
