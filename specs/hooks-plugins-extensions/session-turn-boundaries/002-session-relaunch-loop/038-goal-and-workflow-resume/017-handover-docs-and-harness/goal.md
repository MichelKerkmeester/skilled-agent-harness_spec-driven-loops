---
title: "Goal: Phase 17: handover-docs-and-harness"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "handover docs and harness goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/017-handover-docs-and-harness"
    last_updated_at: "2026-11-13T13:50:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Documented phases 009 to 016 in the README and the playbook and fixed the harness late write"
    next_safe_action: "None, the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-017-handover-docs-and-harness"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 17: handover-docs-and-harness

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** The session-relaunch README and the Claude relaunch playbook describe exactly what phases 009 to 016 shipped or declined, and a live hop harness run leaves no sandbox session folder behind.

### Decisions

Frozen choices. Changing one is an amendment. The parent's decisions bind here, and the child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | No behaviour change. The only files changed outside spec folders are the README, the Claude playbook, `finish-run.sh` and the new `test-finish-run.sh`. |
| D2 | Docs follow outcomes. Each README or playbook section is written from its phase's closed `acceptance-criteria.md`, and a phase that ends in a decline is documented as declined with the reason it records. Nothing is written for an open phase. |
| D3 | The background-worker hop is made repeatable by applying the recorded diff to a copy with `patch -o`, so `run-hop.sh` itself does not change. |
| D4 | The wrong iteration timestamp in `research/deep-research-state.jsonl:6` (09:30Z for a record committed at 08:15Z, research.md section 15) is out of scope. The deep-research iteration writer in `system-deep-loop` stamps it, so a fix belongs to that skill, it is not a hop harness defect, and rewriting a closed research record would change evidence. research.md section 15 already discloses it. |
| D5 | `finish-run.sh` guards the late write with a settle window and a second removal, not a pid wait, because the pid list `run-hop.sh:183` keeps is likely empty for a Claude run. |
| D6 | Local commits only. Nothing is pushed or merged without the operator, and nothing is built before the operator's greenlight. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `rg -c '\| Met \|' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/017-handover-docs-and-harness/acceptance-criteria.md` prints 11.
- [x] `bash specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/test-finish-run.sh` exits 0 and prints `ok`.
- [x] `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py` prints `Total issues: 0` for `.skilled/hooks/session-relaunch/README.md` and for `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md`.
- [x] `node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs bump --base HEAD --check` exits 0 with the playbook version above 1.0.21.0.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/017-handover-docs-and-harness --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents | Done | Five documents written on 2026-11-13 from research.md sections 6, 7, 9 and 15 and the 2026-11-13 goal log rows. Status planned, nothing built |
| Operator greenlight | Done | 2026-11-13, verbatim: "Implement using deepseek v4.1 flash max cli opencode with opencode go provider, max parallel". The builds later moved to `dsh` on the LLM Gateway route on the operator's word |
| Shipped behaviours for the HS checks | Done | Seven, each with a suite check: the three note lines (phase 009, `nudge.test.cjs`), the runner stop before the lock release (009, `nudge.test.cjs`), the fan-out re-run refusal (010, `fanout.vitest.ts`), the permission mode carry (011, `skilled-loop-wrapper-model-effort.test.cjs`), the session name carry (012, `skilled-loop-wrapper-launch-arguments.test.cjs`), the deferred-hop notice (014, `claude-adapters.test.cjs`) and the cron count log (014, `claude-adapters.test.cjs`). HS-8 is the live worker check. The OpenCode and Pi behaviours of phases 013 and 015 are named for the Pi and OpenCode playbook, and the two declined changes have no check |
| Late-write cause (T002) | Done | Not reproduced in one no-goal hop with the old script: `No such file` 15 s later (`scratch/late-write.txt`). Seen live the same day in three of phase 016's ten goal hops, where the project folder came back with one receiver transcript written in the second of the delete |
| Harness fix | Done | `finish-run.sh` watches the removed folder for `FINISH_SETTLE_S` seconds and removes it again. `test-finish-run.sh` failed first (`scratch/red.txt`), passes both cases now, and fails again against the old script |
| README | Done | Sections for phases 009 to 016 written from each phase's closed documents by `dsh` briefs, each claim checked against the source by the orchestrator. `Total issues: 0` |
| Playbook | Done | `Hand-Over State Checks` with HS-1 to HS-8, the harness rows and the GR-1 sentence. Version 1.0.21.0 to 1.0.22.0. `Total issues: 0` |
| Live worker hop (T020) | Done | `scratch/live-worker-hop/`: `PREPARE.exit: 0`, worker on parent pid 1, note claimed and done, no project folder 15 s after the fixed `finish-run.sh`, no worker process left |
| Evidence commit | Done | Taken on the tree at `fc606ad8d8` plus this phase's edits |

### Deviations and findings

| Item | Note |
|------|------|
| Harness defect 2 | Out of scope per D4. The record defect is in `research/deep-research-state.jsonl:6`, owned by the deep-research writer |
| Open question: does the receiver write its session log after the tmux kill? | The leftover of 2026-11-13 is the only evidence and no in-repo record names its folder. T002 settles it live before the fix |
| Open question: which `PREPARE.exit` does the worker check expect? | 0 on the 2026-11-13 tree. Phase 009 plans a required `Running workers:` line and adds `Running workers: none` to the harness note at `run-hop.sh:151-152`, so T003 must show the recorded diff still applies, and phase 015 may refuse a live descendant. The check states the value once those phases close |
| T002 ran after the fix was written | The task asks for the live look before the fix. The fix was built while phase 016's hops ran, so the look used an export of the harness from the commit before it. The old script is what ran |
| T002 did not reproduce the write | The harness waits 25 s after the note is done and then stops its tmux server, so the receiver had probably exited before the old script ran. Suspected, not checked. The three reappearing folders of phase 016 are the live evidence for the cause |
| The harness note has a `Running workers:` line | The task text expects a note with no such line. Phase 009 added `Running workers: none` to `run-hop.sh:153`, so the check names exit 0 for a note that says `none` while a worker runs. `prepare` reads only the note text, so it cannot see the worker |
| HS count | The criterion compares the HS count with the shipped behaviours. The section holds eight checks: seven shipped behaviours and the live worker check the same task list asks for |
| HS-3 runner | The fan-out test is a Vitest file, so its command uses the runtime's Vitest runner and not `node --test` |
| T020 helper lookup | The live run placed the patched script in a temporary copy of the harness folder. The playbook links `goal-records.cjs` into the out folder. Both give the script its one helper. The linked form was not run live |
| README word `declined` | The phase check looks for the word, and the briefs wrote "not built". The orchestrator changed the two sentences |
| Second test case | The first brief wrote one case, and the checklist asks for the empty `project-dir.txt` case too. A follow-up brief added it |
| README written by briefs, not by hand | Each brief got one closed phase's documents as its source and the rule that code wins over a document. The fan-out exit code 3 was taken from phase 010's summary and its passing test, not from a rerun of the runner by hand |
<!-- /ANCHOR:log -->
