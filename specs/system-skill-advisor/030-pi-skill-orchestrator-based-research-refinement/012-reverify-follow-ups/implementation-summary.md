---
title: "Implementation Summary: Closing the Goal Re-verification Follow-ups"
description: "The four follow-ups the phase 11 re-verification left are closed. One approval now covers a task of Devin dangerous-mode runs, CP-003 and CP-004 end with a sandbox teardown that sends no signal, CP-004's July record is gone and scenario 457 has its 2026-09-27 record."
trigger_phrases:
  - "goal re-verification follow-ups summary"
  - "signal-free sandbox teardown"
  - "devin approval per task"
  - "scenario 457 benchmark record"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/012-reverify-follow-ups"
    last_updated_at: "2026-09-28T05:36:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Proved the parent goal's six criteria again from the final state"
    next_safe_action: "None. Phase 12 is complete"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-devin/SKILL.md"
      - ".skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md"
      - ".skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/daemon-absent-fallback.md"
      - ".skilled/skills/system-spec-kit/benchmark/reports/2026-09-27--manual-testing-playbook--directive-lifecycle-dedup-five-cli/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-27-030-phase-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Closing the Goal Re-verification Follow-ups

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-reverify-follow-ups |
| **Completed** | 2026-09-28 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The goal re-verification after phase 11 left four things for the operator. Devin's dangerous mode now has a recorded approval and a rule that agrees with the skill's own default. Two advisor scenarios no longer leave a sandbox folder in `/tmp`, and their teardown signals no process. CP-004 has lost its stale July verdict, and the five latest runs of scenario 457 have their benchmark record.

### Phase 12: reverify-follow-ups

**Devin approval (FU1).** The operator approved `--permission-mode dangerous` for cli-devin scenario runs, and the parent goal records it as D5 beside Codex's D4. cli-devin's NEVER rule 1 and ESCALATE IF rule 4 now say that one approval covers a whole task, the default invocation included, so the rules and the default no longer contradict each other. The skill reads 1.4.5.0 with a release entry. Its Hermes copy was rebuilt, and both `cli-external-orchestration` route manifests were re-minted because the hub compiler hashes every packet `SKILL.md`.

**Sandbox teardown (FU2).** CP-003 step 1 cold-starts a sandbox advisor and used to delete its folder while the daemon still ran, so the daemon wrote the folder back later. The first fix copied CP-004's teardown, which signalled the pids recorded in the launcher's lease. GPT-6 Luna failed that twice. The socket check compared text, the pids went unchecked and a lease left by a killed launcher can name a pid that another process takes later. So the teardown stopped sending signals. The cold start gives the sandbox daemon a 12-second idle timeout, and the block waited for the lease file and the socket to go. Luna failed that as well, because a launcher that crashes deletes its lease without waiting for its daemon, and the daemon has no socket during its startup scan and closes it before its last database writes. On the operator's choice the wait now also needs `lsof` to find no process holding a file open in the sandbox. The daemon keeps its database open from the start of its main function until it exits, so the block waits out the daemon of a crashed launcher too, and the fourth verify passed. When something is still there after 60 seconds, the block keeps the sandbox and says so. CP-004 step 5 carries the same wait.

**CP-004 record (FU3).** CP-004 lost its `## 6. EVIDENCE` and `## 7. PASS/FAIL` sections from a July run, since the playbook contract allows five sections and a run never edits the corpus.

**Scenario 457 record (FU4).** The five 2026-09-27 runs of scenario 457 have a dated folder under the system-spec-kit benchmark reports, holding a README, a results table, one outcome per runtime and a source map. The reports index lists it first.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-external-orchestration/cli-devin/SKILL.md` | Modified | NEVER rule 1 and ESCALATE IF rule 4 ask for one approval per task, version 1.4.5.0 |
| `.skilled/skills/cli-external-orchestration/cli-devin/changelog/v1.4.5.0.md` | Created | The release entry |
| `.hermes/skills/cli-devin/SKILL.md` | Modified | The regenerated Hermes copy |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-external-orchestration/manifest.json` | Modified | Re-minted to policy hash `13d5747d…` |
| `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/cli-external-orchestration/manifest.json` | Modified | The authored copy, resynced to the runtime bytes |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md` | Modified | CP-003 step 1 removes the sandbox only once its lease, its socket and every open file in it are gone |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/daemon-absent-fallback.md` | Modified | Sections 6 and 7 removed, and step 4 and step 5 use the same teardown |
| `.skilled/skills/system-spec-kit/benchmark/reports/2026-09-27--manual-testing-playbook--directive-lifecycle-dedup-five-cli/` | Created | README, `results.csv`, five outcomes and `source.md` |
| `.skilled/skills/system-spec-kit/benchmark/reports/README.md` | Modified | The new first row |
| `../goal.md`, `../spec.md`, `../graph-metadata.json` | Modified | D5, the phase 12 binding and phase row, the child list |
| `evidence/` | Created | Baselines, the negative controls, the teardown tests, the four Luna reports, the reruns and the parent goal's proof under `goal-reverify/` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator wrote every edit under the amended D1, because each was a few lines with its own check, and GPT-6 Luna max fast through cli-codex verified the teardown four times. Baselines came first. The route guard, a replayed Devin prompt and the Hermes check proved FU1. A negative control proved the signal-free teardown: with the daemon's idle timeout cut to one minute, the committed step 1 left a folder that came back and the new block left none. Behaviour tests then ran it against a lease with an escaping socket path, a lease naming decoy processes, a launcher killed without its handler and the normal path, and a timed probe showed the daemon's shutdown write lands before the lease goes. After the third verify, two probes sampled which sandbox files the daemon holds from its cold start to its exit, and a second behaviour test ran the old and the new wait against a held file, the daemon of a crashed launcher and the normal path. Round 1 reran CP-003 on the first teardown in the five CLIs, round 2 reran both scenarios on the signal-free teardown in four CLIs before the Codex limit, and round 3 reran both on the final teardown in all five. Last, the parent goal's six criteria were proved again from the final state, since this phase changed two of its scenarios.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The teardown sends no signal | Any teardown that trusts lease pids can hit a pid another process took after a crash. A launcher that runs normally removes its lease only after its daemon exits, so waiting on the lease needs no pid at all |
| A 25-second floor on the wait | It outlasts the 12-second idle timeout and its 6-second check, so the normal path never races the daemon's exit, and it covers the moment before a new daemon opens its database |
| An open-file test read with `lsof` | A launcher that crashes deletes its lease at once, but its daemon holds its sandbox database open until it exits, so the test still sees it. `lsof` only reads, so the block still sends no signal |
| Keep the sandbox when the wait runs out | Removing it under a live daemon would bring the folder back unseen. A kept folder with a message is a leftover the tester can see |
| CP-004 got the same teardown | It ran the same code, and parent criterion 4 lists it, so it reran in the five CLIs too |
| The Hermes copy was built in a scratch folder at the mirror's own depth | The sync script rewrites relative links against its output folder, and a full rebuild would also have written other sessions' pending skill changes |
| No supersession mapping for the 2026-09-26 record | The 2026-09-27 runs are a later run on newer code, not a correction |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Route guard | Exit 0, every hub fresh, before and after the re-mint (`evidence/routing-after-remint.txt`) |
| Devin prompt replay | Stage 2 routes to cli-devin at policy hash `13d5747d…`, and stage 1 picks `cli-external-orchestration` at 0.95 |
| Hermes check | PASS, 71 copies in sync |
| `validate_document.py` | 0 issues on the cli-devin skill and release entry, CP-003, CP-004, the 457 README and its source map |
| Negative control | The committed step 1's folder came back about 30 seconds later, and the signal-free block's folder did not come back within 200 seconds (`evidence/cp003-negative-control-3-idle.txt`). The final block's normal path left nothing that came back within 60 seconds (`evidence/teardown-check/open-file-result.txt`, case C) |
| Behaviour test, signal-free teardown | Decoy pids survive a hostile lease, a killed launcher's sandbox is kept with a message while its orphaned daemon exits on its own, and the normal path removes the sandbox in 27 seconds with no return (`evidence/teardown-check/idle-result.txt`) |
| Open-file probes | The daemon held `db/skill-graph.sqlite` open at +0.6 seconds, before its socket existed, and held its files until the second its lease and socket went. `lsof` finds a held file through `/tmp` and `/private/tmp` alike (`evidence/teardown-check/probe-open-files-startup.txt`, `probe-open-files.txt`, `lsof-symlink-check.txt`) |
| Behaviour test, final teardown | The old wait removed a sandbox while a process held a file in it, and the new wait kept it and left that process running. With the launcher killed and both lease files removed, the daemon exited at +16.6 seconds and the block removed the sandbox at +25.6 seconds. The normal path took 27 seconds and nothing came back (`evidence/teardown-check/open-file-result.txt`) |
| GPT-6 Luna verify | FAIL on the first three teardowns and PASS on the final one, five checks of five. Its one text finding, a stray period in CP-003 step 1, was removed afterwards (`evidence/luna-verify/report-1.txt` to `report-4.txt`) |
| Round 1, first teardown | CP-003 PASS in all five CLIs, no sandbox left |
| Round 2, signal-free teardown | CP-003 and CP-004 PASS in cli-pi, cli-opencode, cli-devin and cli-cursor, eight of eight, before the Codex limit and the open-file test (`evidence/teardown-reruns/round-2a/`) |
| Round 3, final teardown | CP-003 and CP-004 PASS in cli-pi, cli-opencode, cli-devin, cli-cursor and cli-codex, ten of ten. Every tester quoted `sandbox advisor exited; sandbox removed`, and every CP-004 tester quoted `live generation file unchanged` with matching hash pairs. No sandbox was left, and the live advisor, generation file and lease matched their snapshot. Both Codex testers met Codex's command guard, which refuses a literal `rm -rf` as in phase 11, and removed the sandbox by an equivalent command under the same condition. The cli-devin shell kept no exports between calls, so its CP-004 tester reran steps 3 to 5 with them inline (`evidence/teardown-reruns/`) |
| Scenario 457 record | 20 evidence entries recomputed, 0 mismatches, five outcomes, all PASS |
| Parent goal: OpenCode plugin live load | PASS. `opencode run --print-logs` exits 0 with no `failed to load plugin` line, and the session lists `spec_kit_skill_advisor_status` (`evidence/goal-reverify/opencode-plugin-live-load.txt`) |
| Parent goal: the four suites | PASS with the counts phase 11 recorded. Advisor 129 files with 971 passed and 6 skipped. Spec-kit hook files 237 passed and 7 skipped, with the Copilot file skipping itself. Pi dispatch 50 of 50. Plugin 35 of 35 (`evidence/goal-reverify/`) |
| Parent goal: sandboxed daemon | PASS. CP-004 steps 2 to 5 as written answered live from the sandbox, left the live generation file and lease unchanged and removed the sandbox (`evidence/goal-reverify/crit3-sandbox-daemon.txt`) |
| Parent goal: the nine scenarios | PASS. Round 3 covers CP-003 and CP-004, ten of ten. The other seven keep their phase 11 result, 35 of 35, because every commit since that matrix changed only changelog entries in the paths they run through (`evidence/goal-reverify/changes-since-phase-11.txt`) |
| Parent goal: `install-codex-hooks.mjs --check` | PASS, `install-codex-hooks: OK ~/.codex/hooks.json` (`evidence/goal-reverify/install-codex-hooks-check.txt`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The open-file test needs `lsof`.** macOS ships it. On a machine without it the test prints nothing, and the wait falls back to the lease and the socket, which leaves open the crash windows the third verify named.
2. **The live advisor changed three times during the phase.** Launcher 79958 exited between 15:34:28Z and 15:35:57Z, and 97186 exited after round 2a. Each time the last request that reached the daemon came more than 30 minutes before, so its idle exit is the likely cause, but no launcher log confirms it. The third change is not explained. Launcher 92477 was replaced by 40890 at 05:02:08Z on 2026-09-28, two to four minutes after 92477 started, during the open-file behaviour test. The code gives a sandbox daemon no way to reach the live advisor, but that test's crashed-launcher case ran in the same window and is not ruled out, so it does not run again without the operator (`evidence/live-launcher-change.txt`).
3. **Seven scenarios were not rerun after this phase.** CL-001, CL-005, CL-006, NC-001, NC-004, 433 and 457 keep their phase 11 results. No commit since then changed the code they run through, but CLI updates or skill content changed since then could still move a result, and only a rerun would show that.
<!-- /ANCHOR:limitations -->

---
