---
title: "Feature Specification: Closing the Goal Re-verification Follow-ups"
description: "The goal re-verification after phase 11 left four follow-ups. This phase records the operator's Devin approval and aligns the cli-devin rule with it, gives CP-003 a teardown, removes CP-004's July record and writes the scenario 457 benchmark record."
trigger_phrases:
  - "goal re-verification follow-ups"
  - "devin dangerous mode approval"
  - "cp-003 sandbox teardown"
  - "scenario 457 benchmark record"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Closing the Goal Re-verification Follow-ups

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-27 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 12 |
| **Predecessor** | 011-observation-fixes |
| **Successor** | None |
| **Handoff Criteria** | Each follow-up below is closed with its check, CP-003 and CP-004 pass again in the five CLIs and the parent goal carries D5 with a chat slice at `packet_budget=ok` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the Pi skill orchestrator research for skill advisor refinement specification. It closes the four follow-ups that the goal re-verification after phase 11 left for the operator, so none of them stays open.

**Scope Boundary**: The four follow-ups FU1 to FU4 below. A defect found while closing them is added here before any work on it starts.

**Dependencies**:
- 011-observation-fixes, soft. Its re-verification evidence in `evidence/goal-reverify/` names the follow-ups and holds the scenario 457 evidence.
- The operator's approval of D5 and of the rule rewording, given on 2026-09-27.

**Deliverables**:
- D5 in the parent goal, and the reworded cli-devin rule with its release entry, its Hermes copy and the re-minted hub manifests
- A CP-003 teardown with the same fix in CP-004, proven by a negative control and by five CLI reruns of each scenario
- The CP-004 file without its July record, and the scenario 457 benchmark record for 2026-09-27

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The goal re-verification after phase 11 proved all six criteria but left four things for the operator. The Devin scenario runs used `--permission-mode dangerous`, which the operator had approved only as Codex's danger-full-access, and the cli-devin contract makes `dangerous` its default invocation while its NEVER rule forbids it without explicit approval. CP-003's first block deletes its sandbox while the sandbox daemon still runs, so the daemon recreates the folder when it later stops. The CP-004 file still carries a July run's evidence and BLOCKED verdict in two sections the playbook contract does not allow. And step 6 of scenario 457 asks for a benchmark record of each run, which the re-verification did not write.

### Purpose
Each follow-up is closed with evidence, so the re-verification leaves nothing open.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **FU1, Devin approval.** On 2026-09-27 the operator approved `--permission-mode dangerous` for cli-devin scenario test runs, recorded as D5 in the parent goal beside D4. The operator also approved rewording the cli-devin rule. NEVER rule 1 at `cli-devin/SKILL.md:379` forbids `dangerous` "without explicit user approval", while the default invocation at line 200, ALWAYS rules 3 and 7 and the user-override table all resolve to it. The reworded rule asks for one approval per task, which then covers every dispatch in that task, the default invocation included. ESCALATE IF rule 4 at line 390 states the same rule and moves with it. The edit bumps cli-devin to 1.4.5.0 with a release entry and rebuilds its Hermes copy. It also re-mints the `cli-external-orchestration` route manifest and its authored copy, because the hub compiler hashes every packet `SKILL.md`.
- **FU2, CP-003 teardown.** Step 1 of `compat-and-disable/global-disable-flag.md` cold-starts a sandbox launcher and daemon, then runs `rm -rf "$SANDBOX"` while both still run. The daemon then recreates the deleted folder the next time it writes to it. Ten such folders were removed from `/tmp` after the re-verification. Step 1 gets the teardown that CP-004 step 5 already uses, which stops only a launcher whose recorded socket lies inside the sandbox. CP-003 then reruns in the five CLIs, so criterion 4 of the parent goal still holds.
- **Found while closing FU2.** GPT-6 Luna's first verify of the new teardown returned FAIL, and CP-004 step 5 runs the same code. The socket check compared text, so a lease path such as `$SANDBOX/../x` passed it, the block signalled the lease pids without checking what they ran and it removed the sandbox without waiting for the daemon. A hardened version still trusted pids, and the second verify showed that a lease left behind by a killed launcher can name a pid that another process takes later. So both teardowns now send no signal. The sandbox daemon gets a 12-second idle timeout, the launcher removes its lease only after that daemon has exited and the block removes the sandbox only once the lease and the socket are gone and at least 25 seconds have passed. CP-004 reruns in the five CLIs too, because criterion 4 of the parent goal lists it.
- **Third verify.** GPT-6 Luna's verify of the signal-free teardown returned FAIL on two checks (`evidence/luna-verify/report-3.txt`). The launcher clears its lease without waiting for its daemon when it dies of an uncaught exception or exits for any reason other than its child's exit. The daemon opens its socket only after its startup scan, and it closes the socket before it drains its watcher and closes its database. So after such a launcher fault the block can find the lease and the socket gone while the daemon still writes, and the 25-second floor bounds neither window. The step text in both files also says the lease goes only after the daemon exits, which holds only while the launcher does not fail. The operator chose to close both windows. The wait now also requires that no process holds a file open in the sandbox, read with `lsof`, so it still sends no signal. Two probes show the sandbox daemon holds its database open from its startup scan until it exits (`evidence/teardown-check/probe-open-files.txt`, `probe-open-files-startup.txt`).
- **FU3, CP-004 record.** `compat-and-disable/daemon-absent-fallback.md` carries `## 6. EVIDENCE` and `## 7. PASS/FAIL` from a 2026-07-03 run, which read BLOCKED. The playbook contract allows five sections and says a run never edits the corpus, so both sections go. Removing them changes no step.
- **FU4, scenario 457 record.** Step 6 of scenario 457 asks for each run's verdict, reason and evidence paths with byte counts and SHA-256 under the system-spec-kit benchmark reports. The five runs of 2026-09-27 get a dated folder modeled on the 2026-09-26 record, plus a row in the reports index.

### Out of Scope
- The other `dangerous` mentions in cli-devin's README, CLI reference, model reference and prompt templates. Each says the mode needs explicit approval, which the reworded rule still requires, so none of them contradicts it.
- The `Observed on 2026-09-26` block inside CP-003 step 4. It shows the expected output shape, and no follow-up named it.
- The advisor playbook validator's routing-gold skip and its missing persistence-marker warning, both of which predate this phase.
- A supersession mapping for the 2026-09-26 record. The 2026-09-27 run is a later run on newer code rather than a correction, and the reports index lists runs newest first.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-devin/SKILL.md` | Modify | NEVER rule 1 and ESCALATE IF rule 4 ask for one approval per task, and the version reads 1.4.5.0 |
| `.skilled/skills/cli-external-orchestration/cli-devin/changelog/v1.4.5.0.md` | Create | The release entry |
| `.hermes/skills/cli-devin/SKILL.md` | Modify | The regenerated Hermes copy |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-external-orchestration/manifest.json` | Modify | Re-minted to the new policy hash |
| `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/cli-external-orchestration/manifest.json` | Modify | The authored copy, resynced to the runtime manifest |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md` | Modify | Step 1 waits for its sandbox launcher and daemon to exit before removing the sandbox |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/daemon-absent-fallback.md` | Modify | Sections 6 and 7 removed, and step 5 gets the same teardown fix as CP-003 |
| `.skilled/skills/system-spec-kit/benchmark/reports/2026-09-27--manual-testing-playbook--directive-lifecycle-dedup-five-cli/` | Create | README, results table, one outcome per runtime and a source pointer |
| `.skilled/skills/system-spec-kit/benchmark/reports/README.md` | Modify | The new row |
| `../goal.md` | Modify | D5 and the phase 12 binding row |
| `../spec.md` and `../graph-metadata.json` | Modify | The phase 12 row, its handoff and the child list |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The Devin approval is recorded and the cli-devin rule agrees with its default | Parent goal D5 reads that `--permission-mode dangerous` for cli-devin applies to scenario test runs only. NEVER rule 1 and ESCALATE IF rule 4 ask for one approval per task, and no rule in `cli-devin/SKILL.md` still forbids the default after that approval. `goal.cjs packet` reports `packet_budget=ok`, and the operator has the new chat slice |
| REQ-002 | CP-003 and CP-004 leave no sandbox or sandbox process behind | Under a one-minute idle timeout, the committed CP-003 step 1 leaves a recreated `/tmp/cp003.*` folder and the new block leaves none. The new block prints `sandbox advisor exited; sandbox removed` and sends no signal, so decoy pids named in a lease survive it. When the sandbox launcher is killed, the block keeps the sandbox and says so instead of removing it under a live daemon. When a process still holds a file open in the sandbox, as a daemon does after its launcher crashes, the block keeps waiting and then keeps the sandbox, where the block without the open-file test removes it. CP-003 and CP-004 report PASS in cli-pi, cli-opencode, cli-devin, cli-cursor and cli-codex, no `/tmp/cp003.*` or `/tmp/cp004.*` folder remains afterward and the teardown stops no process |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The hub keeps serving compiled routing after the cli-devin edit | `compiled-route-guard.cjs` prints every hub fresh, and a Devin dispatch prompt through `compiled-route.cjs --hub cli-external-orchestration` returns a route rather than the legacy sentinel |
| REQ-004 | The release entry and the Hermes copy follow the edit | `validate_document.py` reports no issue for `v1.4.5.0.md`, `SKILL.md` reads 1.4.5.0 and `sync-skills-hermes.cjs --check` passes |
| REQ-005 | CP-004 follows the five-section contract | Sections 6 and 7 are gone, step 5's teardown matches CP-003's, the diff changes nothing else and `validate_document.py` still reports 0 issues. The package validator skips all 47 advisor scenarios as routing gold, so it never opens this file |
| REQ-006 | Scenario 457's 2026-09-27 runs have their benchmark record | The dated folder holds a README, `results.csv`, five outcomes and `source.md`. Every evidence path exists with the byte count and SHA-256 the record states, and the reports index lists the folder first |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The negative control shows the committed CP-003 block leaving a folder and the new block leaving none, and CP-003 and CP-004 pass in all five CLIs.
- **SC-002**: The parent goal, cli-devin's rules and its default invocation agree, and every gate passes from the final state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing `cli-devin/SKILL.md` changes the hub's policy hash, and a stale manifest drops the whole hub to legacy routing | High | Refresh the runtime manifest and resync its authored copy in the same commit, then run the guard and replay a Devin prompt |
| Risk | A teardown that stops the wrong launcher would take down the live advisor | High | The teardown sends no signal, because the sandbox daemon exits on its own short idle timeout. Check the live launcher after every run |
| Risk | Rebuilding the whole Hermes mirror would also write other sessions' pending skill changes | Med | Generate into a scratch folder and copy back only the cli-devin file |
| Risk | Another session commits on main, and its commits may still be unpushed when this phase pushes | Med | Stage only this phase's paths, and check what a push would publish before pushing |
| Dependency | The operator's approval of D5 and of the rewording | Given 2026-09-27 | None needed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. On 2026-09-27 the operator chose to fix the three items as one phase and approved D5 with the rule rewording.
<!-- /ANCHOR:questions -->

---
