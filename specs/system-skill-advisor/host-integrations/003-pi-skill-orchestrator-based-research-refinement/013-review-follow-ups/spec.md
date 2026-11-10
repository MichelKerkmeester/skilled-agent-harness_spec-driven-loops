---
title: "Feature Specification: Closing the Phase 12 Review Findings"
description: "A fresh Opus review of phase 12 found one P1 and nine P2 problems, and the orchestrator confirmed all but one against the files. This phase gives scenario 433 the signal-free teardown, hardens the teardown in all three scenarios, runs one watched crash test and corrects the phase 12 records."
trigger_phrases:
  - "phase 12 review findings"
  - "scenario 433 teardown"
  - "lsof self-check teardown"
  - "watched crash test"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Closing the Phase 12 Review Findings

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 012-reverify-follow-ups |
| **Successor** | None |
| **Handoff Criteria** | Each finding below is closed with its check, scenarios 433, CP-003 and CP-004 pass again in the five CLIs and the parent goal binds this phase with a chat slice at `packet_budget=ok` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the Pi skill orchestrator research for skill advisor refinement specification. It closes what a fresh Opus 5.5 review of phase 12 found, after the orchestrator checked each finding against the files.

**Scope Boundary**: The findings F1 to F12 below, except F8. A defect found while closing them is added here before any work on it starts, as F12 was.

**Dependencies**:
- 012-reverify-follow-ups, hard. Its teardown design and its records are what this phase fixes.
- The operator's choices of 2026-09-28: fix every confirmed finding in this phase, and run one watched crash test.

**Deliverables**:
- Scenario 433 with the signal-free teardown, and an `lsof` self-check, a variable check and `rm -r` in all three teardown blocks
- The watched crash test and its record
- Corrected phase 12 records, a refreshed parent status and five CLI reruns each of 433, CP-003 and CP-004

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A fresh Opus 5.5 review of phase 12 returned REQUESTED_CHANGES with one P1 and nine P2 findings, and the orchestrator confirmed the P1 and eight of the P2s against the files. Scenario 433 still runs the pid-signalling teardown that phase 12 rejected. The teardown phase 12 shipped reads a missing or blocked `lsof` as "nothing open", CP-004 step 5 reports success in a shell that lost step 2's variables, and the Codex testers could not run its `rm -rf`. Several phase 12 records overstate or misstate what their evidence shows. Phase 12's commit also broke sk-doc's frozen README manifest test on main until another session repaired it.

### Purpose
Every confirmed finding is closed with evidence, and the three scenarios pass again in the five CLIs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **F1 (P1), scenario 433's teardown.** `system-spec-kit/manual-testing-playbook/ux-hooks/cli-hook-transport-down-fail-open.md:61-78` matches the lease socket path as text, sends `kill -TERM` to the lease pids and runs `rm -rf` without waiting for the daemon. GPT-6 Luna failed this design twice in phase 12 (`../012-reverify-follow-ups/evidence/luna-verify/report-1.txt`, `report-2.txt`). The default-budget hook call starts a sandbox launcher on every run, as all five phase 11 reports show. 433 gets the signal-free wait with a 12-second idle timeout. Three scenarios point the advisor database at a sandbox, and 433 is the only one left that signals.
- **F2, case B's proof.** Case B's daemon exited at 16.6 seconds, before the wait's 25-second floor. The wait without the open-file test would therefore have removed that sandbox at the same moment (`../012-reverify-follow-ups/evidence/teardown-check/open-file-result.txt:21`). So the claim that the open-file test covers a crashed launcher rests on code reading and case A2. On the operator's yes, one watched crash test kills a sandbox launcher. It then samples the sandbox socket, the daemon's open database and the live advisor every 0.1 seconds.
- **F3, `lsof` fails open.** `global-disable-flag.md:53` and `daemon-absent-fallback.md:81` read an empty `lsof` result as "no file open". So a missing or blocked `lsof` lets the block remove the sandbox without the open-file test. Each block now first checks that `lsof` can list its own shell's open files, and keeps the sandbox with a message when it cannot.
- **F4, lost variables.** With step 2's variables gone, `daemon-absent-fallback.md:84` prints `live generation file unchanged`, as confirmed in an empty environment. `rm -rf ""` exits 0 per `man rm`, so line 89 would print `sandbox removed`. Each block now checks its variables before the teardown and prints a rerun message when one is missing.
- **F5, the live-launcher note.** `../012-reverify-follow-ups/evidence/live-launcher-change.txt` leaves out `idle-result.txt` case 2, where a killed sandbox launcher left live launcher 97186 running. Its reap sentence also leaves out the legacy lease fallback (`runtime/lib/daemon/lease.ts:260-289`). That fallback finds nothing today, because the legacy file at `.skilled/skills/.state/advisor/skill-graph-daemon-lease.sqlite` has no lease table.
- **F6, the carry-over record.** `../012-reverify-follow-ups/evidence/goal-reverify/changes-since-phase-11.txt` and the claims built on it miss the sk-doc route manifest change in `666abc1a22` and `bec26045d0`, and phase 12's own cli-external-orchestration re-mint. The advisor attaches a compiled route to a hub recommendation as extra metadata (`runtime/handlers/advisor-recommend.ts:348-378`). None of the seven carried scenarios checks one, so their verdicts stand.
- **F7, parent status.** `../graph-metadata.json` reads `in_progress`. Phase 12 refreshed the parent before its own metadata, and a phase parent takes its status from its children (`runtime/lib/graph/graph-metadata-parser.ts:1406-1412`).
- **F9, the removal command.** Codex's command guard refuses a literal `rm -rf`. So both phase 12 Codex testers used `rm -r` or `shutil.rmtree` instead (`../012-reverify-follow-ups/evidence/teardown-reruns/reports/codex-CP-003.md:12`, `codex-CP-004.md:13`), where their brief calls for BLOCKED. The blocks now use `rm -r`, which the Codex testers ran successfully and which fails on an empty path.
- **F10, record accuracy.** Each item below is corrected where it stands:
  - `../012-reverify-follow-ups/goal.md:99` says the six other round 2a testers saw a live brief, but the two Cursor testers saw none.
  - REQ-005 at `../012-reverify-follow-ups/spec.md:123` says the diff changes nothing else, but step 4 gained the idle timeout.
  - The FU2 bullet at `../012-reverify-follow-ups/spec.md:76` still reads as the plan in force. It gets a pointer to the bullets that replaced it.
  - "20 evidence entries" in phase 12's implementation summary and goal log are 10 byte and SHA-256 pairs listed twice. The review said they cover 6 files. They cover 10, and the five adapter summaries are byte-identical, so the pairs hold 6 distinct hashes.
  - The kept-sandbox message says "after 60s", but its 60 checks took 67 seconds in case A2 (`open-file-result.txt:14`), because each check runs `lsof`. The message now says "after the wait".
- **F11, the frozen manifest.** Commit `5a37ff619b` added the 457 record's two folders without updating sk-doc's frozen directory manifest. sk-doc Script Tests then failed on main until another session's `fda380addc`. This phase runs `test_readme_manifest.py` before it pushes.
- **F12, found in the reruns: the generation check reads a live reindex as a leak.** The live daemon republishes `skill-graph-generation.json` about three seconds after any skill file it watches changes (`runtime/lib/daemon/watcher.ts:103-104`, `runtime/lib/daemon/watcher-orchestrator.ts:86-124`). Another session edited watched files during OpenCode's and Devin's 433 reruns, so both printed `live generation file CHANGED`, although a sandbox daemon publishes only under its own database folder (`runtime/lib/freshness/generation.ts:31-46`). CP-004 step 5 makes the same check. The check stays as written. The file records no writer, and the live daemon also writes it when it starts, stops, scans or rebuilds, so the test left is a rerun with no watched file changing, the live advisor's pids unchanged and no skill-graph scan or advisor rebuild running. The failure triage in both files says so. A read-only monitor times every change to the live file during the reruns, each run that prints `CHANGED` is traced and rerun once, and a rerun that meets another edit is recorded as a FAIL traced to that edit. GPT-6 Luna verifies the trace.

### Out of Scope
- **F8, the undefined "task" in cli-devin's approval rule.** The operator approved the per-task wording on 2026-09-27. Line 343's "reserve `dangerous` for throwaway isolated runners" predates phase 12 and sits in the MCP allowlist gotcha. No change.
- **Scenario 433's `gtimeout` calls.** `gtimeout` is not installed on this machine. The phase 11 testers ran the three hook calls without it, as their brief allowed. The reruns here drop it too. The dependency is recorded rather than changed, since no finding named it.
- **The scenarios that sandbox only the socket**, `skill-advisor-cli-fallback.md`, `cli-trusted-gate-refusal.md` and `cli-warm-only-no-spawn.md`. Each calls the CLI with `--warm-only`, which never starts a daemon, so removing their folder at once is safe.
- **A writer field in the generation file.** It would let the check in F12 name the process that wrote the file, but it changes the advisor runtime, which no finding covers.
- **The live advisor's restart at 07:51:42Z.** The monitor recorded the live daemon shutting down on a SIGTERM twice within two seconds while no sandbox existed and no command of this phase sent a signal. The likely path is the launcher's dead-socket respawn, which is advisor runtime code. It is recorded in `evidence/live-advisor-restart.txt` for the operator and not changed here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/cli-hook-transport-down-fail-open.md` | Modify | The signal-free teardown with a 12-second idle timeout, the `lsof` self-check, the variable check and `rm -r`, and F12's triage line |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md` | Modify | Step 1 gains the `lsof` self-check, the variable check, `rm -r` and the new kept-sandbox message |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/daemon-absent-fallback.md` | Modify | Step 5 gains the same four changes, and the file gains F12's triage line |
| `../012-reverify-follow-ups/` `spec.md`, `goal.md`, `implementation-summary.md` and two evidence notes | Modify | The corrections in F2, F5, F6, F9 and F10 |
| `../goal.md`, `../spec.md` and `../graph-metadata.json` | Modify | The phase 13 binding and phase row, the corrected carry-over claim and the refreshed status |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Scenario 433 sends no signal and removes its sandbox only after the wait | The block has no `kill` line and exports `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0.2`. It removes its sandbox only once the lease, the socket and every open file in it are gone and at least 25 seconds have passed. 433 reports PASS in cli-pi, cli-opencode, cli-devin, cli-cursor and cli-codex, and no `/tmp/cli-playbook.*` folder remains |
| REQ-002 | A teardown that cannot check keeps its sandbox and says why | With `lsof` hidden from `PATH`, each of the three blocks keeps its sandbox and prints `lsof cannot list open files here`, where the phase 12 block removes it. With a variable missing, each block prints its rerun message and removes nothing, and CP-004 step 5 prints neither success line |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every CLI runs the teardown as written | The blocks use `rm -r`. CP-003 and CP-004 report PASS in the five CLIs with no teardown command changed by a tester, and no `/tmp/cp003.*` or `/tmp/cp004.*` folder remains |
| REQ-004 | The crash path has a direct observation | The watched crash test kills its own sandbox launcher only after checking the lease socket, the pid and the command. It then records at 0.1-second resolution when the sandbox socket goes, when the daemon's database closes and when the daemon exits, along with the live advisor's pid throughout |
| REQ-005 | GPT-6 Luna verifies the three blocks | GPT-6 Luna max fast through cli-codex returns PASS on scenario 433, CP-003 step 1 and CP-004 step 5 |
| REQ-006 | The phase 12 records match their evidence | Each correction in F2, F5, F6, F9 and F10 is made, and the parent `graph-metadata.json` reads `complete` at close |
| REQ-007 | The push leaves main green for the checks this phase touches | `test_readme_manifest.py` reproduces its manifest, and `validate.sh --strict --recursive` prints `RESULT: PASSED` for every folder of packet 030 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three blocks pass the local checks and GPT-6 Luna's verify, and 433, CP-003 and CP-004 pass in all five CLIs.
- **SC-002**: The phase 12 records and the parent metadata agree with their evidence, and every gate passes from the final state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The watched crash test kills a sandbox launcher, and phase 12's third live advisor restart happened while case B ran | Med | It kills only a launcher whose lease socket lies inside its sandbox, whose pid is not a live advisor pid and whose command is a launcher. It samples the live advisor's pid every 0.1 seconds, so any change is timed |
| Risk | Cursor's sandbox may block `lsof` | Med | The self-check keeps the sandbox and says so, and the run is traced to that named limit |
| Risk | Exporting the idle timeout in 433 could reach a live advisor started later from the same shell | Low | The block unsets it at the end, with the sandbox variables |
| Risk | Another session commits on main | Med | Stage only this phase's paths, and check what a push would publish before pushing |
| Dependency | The operator's choices of 2026-09-28 | Given | None needed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. On 2026-09-28 the operator chose to fix every confirmed finding in this phase and approved one watched crash test.
<!-- /ANCHOR:questions -->

---
