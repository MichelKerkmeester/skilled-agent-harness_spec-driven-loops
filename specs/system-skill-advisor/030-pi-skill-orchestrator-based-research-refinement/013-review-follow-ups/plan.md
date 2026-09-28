---
title: "Implementation Plan: Closing the Phase 12 Review Findings"
description: "The orchestrator edits the three teardown blocks and the phase 12 records, since each change is a few lines with its own check, and GPT-6 Luna through cli-codex verifies the blocks. Local checks prove the new guards before one watched crash test and fifteen CLI reruns."
trigger_phrases:
  - "phase 12 review findings plan"
  - "teardown guard checks"
  - "watched crash test plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Closing the Phase 12 Review Findings

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash blocks inside three playbook scenarios, Markdown spec docs and evidence notes |
| **Framework** | The phase 12 tester pool scripts, the goal packet command, `validate.sh` and sk-doc's README manifest test |
| **Storage** | Sandbox folders under `/tmp`, and the parent's derived `graph-metadata.json` |
| **Testing** | Local runs of each block, the watched crash test, a GPT-6 Luna verify and five CLI reruns each of 433, CP-003 and CP-004 |

### Overview
Every change is a few lines with its own check, so under the amended parent D1 the orchestrator writes them and GPT-6 Luna max fast through cli-codex verifies the three blocks. Each block gets four changes. It checks its variables, checks that `lsof` can list the shell's own files, removes with `rm -r` and names the kept-sandbox case without a time it does not keep. Scenario 433 also gets the signal-free wait and a 12-second idle timeout. Local runs prove each guard against its phase 12 form before the reruns start.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Each finding confirmed in its file, with path and line (`spec.md` §3)
- [ ] Baselines recorded before any edit: the live advisor, the generation file, the route guard, the Hermes check, the README manifest test and strict validation

### Definition of Done
- [ ] With `lsof` hidden, each new block keeps its sandbox where its phase 12 form removes it, and with a variable missing it removes nothing
- [ ] GPT-6 Luna returns PASS on the three blocks, and 433, CP-003 and CP-004 pass in the five CLIs
- [ ] The watched crash test has run once, with the live advisor's pid sampled throughout
- [ ] `validate.sh --strict --recursive` prints `RESULT: PASSED` for packet 030, and the README manifest test reproduces
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One orchestrator writes every edit. GPT-6 Luna verifies the three blocks once they are written and again after any fix. The five CLI testers run the finished scenarios through the phase 12 pool scripts, copied into this phase's evidence folder.

### Key Components
- **Teardown block** (433, CP-003 step 1, CP-004 step 5): checks its variables first and prints a rerun message when one is missing. It waits until the lease is gone, the socket folder is empty and no process holds a file open in the sandbox, from 25 seconds on, for up to 60 checks. It then checks that `lsof -t -p $$` lists the shell itself. A shell where `lsof` cannot list its own files keeps the sandbox and says so, and so does a sandbox something still holds. Otherwise it removes the sandbox with `rm -r`.
- **Scenario 433's cold start**: the block exports `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=0.2` with its sandbox variables, so the hook's CLI hands the 12-second idle timeout to the sandbox launcher it starts, and unsets all four at the end.
- **Watched crash test**: cold-starts a sandbox, kills its launcher once the checks pass and removes both lease files as the crash handler would. It then samples every 0.1 seconds until the daemon exits.

### Data Flow
Finding, then a check that shows it, then the edit, then the same check again. The folder validators, the goal checks and the README manifest test run last, from the final state.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The proof plan, fixed before the first scenario edit:

1. **`lsof` self-check.** Run the phase 12 wait and the new wait on an idle sandbox with `/usr/sbin` left out of `PATH`, so `lsof` cannot run. The phase 12 wait removes the sandbox and the new one keeps it with the `lsof` message.
2. **Variable check.** Run the new CP-004 step 5 in an empty environment. It prints the rerun message and neither success line. The phase 12 form printed `live generation file unchanged` in the same environment. Its `rm -rf ""` is not rerun, because a safety check refuses it.
3. **Each block as written.** Run 433, CP-003 step 1 and CP-004 steps 2 to 5 locally. Each prints its expected lines, removes its sandbox and leaves no folder that comes back within 60 seconds.
4. **Watched crash test.** Kill one sandbox launcher behind the three checks and record when the socket goes, when the database closes and when the daemon exits, with the live advisor's pid in every sample.
5. **Scenario 433's old teardown.** Its negative control is not run, because the committed block signals lease pids. What stands in for it: the block's `kill` lines, read in the file, and phase 12's negative control and Luna reports on the identical design.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The operator's choices of 2026-09-28: fix every confirmed finding here, and run one watched crash test.
- The phase 12 pool scripts and the five CLI logins they use.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Scenario files, records and goals: revert the phase commit.
- Sandboxes: a folder left under `/tmp/cp003.*`, `/tmp/cp004.*` or `/tmp/cli-playbook.*` is removed by hand once no process holds a file in it.
- The watched crash test changes nothing outside its own sandbox. If the live advisor changes during it, the next advisor call starts a new one, and the sample log times the change.
<!-- /ANCHOR:rollback -->

---
