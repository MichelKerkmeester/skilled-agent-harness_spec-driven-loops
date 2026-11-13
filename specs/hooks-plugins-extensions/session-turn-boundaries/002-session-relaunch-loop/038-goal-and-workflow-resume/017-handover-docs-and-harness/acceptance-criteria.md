---
title: "Acceptance Criteria: Phase 17: handover-docs-and-harness"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "handover docs and harness acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/017-handover-docs-and-harness"
    last_updated_at: "2026-11-13T13:50:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Marked every criterion Met with observed evidence"
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
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 17: handover-docs-and-harness

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 017-handover-docs-and-harness
**Level:** 2
**Status:** Complete
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given phase 009 closed, When an operator reads the README hand-over section, Then it names each of `Running workers:`, `Scheduled:` and `Added directories:` with what the receiver does, or gives the decline reason phase 009 records for a missing line | `rg -c 'Running workers:\|Scheduled:\|Added directories:' .skilled/hooks/session-relaunch/README.md` prints at least 3, or `rg -n 'declined' .skilled/hooks/session-relaunch/README.md` names each missing line Observed: the count prints 4. | Met | - |
| AC-002 | REQ-002 | Given phases 009 and 010 closed, When the README describes the deep-loop step and the fan-out requeue, Then the step matches the text `lib/nudge.cjs` prints after phase 009 and one sentence states the liveness check or its decline | `rg -n 'deep-loop lock' .skilled/hooks/session-relaunch/README.md` prints the step and `rg -n 'fanout-pool.cjs' .skilled/hooks/session-relaunch/README.md` prints 1 line Observed: the deep-loop lock sentence names the runner stop, and `fanout-pool.cjs` prints 1 line. | Met | - |
| AC-003 | REQ-003 | Given phases 011 and 012 closed, When the README describes permission mode and session name across a hop, Then each runtime's carry-over and the hop suffix are stated as shipped, and line 83 names the name source the wrapper uses | `rg -n 'permission' .skilled/hooks/session-relaunch/README.md` prints the new sentence, and `rg -n 'name, provider and Pi extension settings come from the relaunch record' .skilled/hooks/session-relaunch/README.md` prints nothing unless `rg -n 'consumed_field name' .skilled/bin/skilled-loop` prints a line Observed: the permission mode paragraph is in section 1, the old sentence prints nothing, and the new one names the record or the launch line per setting. | Met | - |
| AC-004 | REQ-004 | Given phases 013 and 014 closed, When the README describes OpenCode children and titles and a deferred Claude hop, Then each shipped change or its decline reason is stated with its runtime | `rg -n 'parentID\|title\|session_crons\|deferred' .skilled/hooks/session-relaunch/README.md` prints the new sentences Observed: 9 matching lines, with the child-session hold, the title sentence, the deferred notice and the cron count among them. | Met | - |
| AC-005 | REQ-005 | Given phases 015 and 016 closed, When the README describes the Pi mode, the descendant walk and the receiver claim under a goal, Then each is stated as shipped or as declined with the reason its phase records | `rg -n 'declined' .skilled/hooks/session-relaunch/README.md` names every phase of 009 to 016 that ended in a decline, checked against `rg -L 'Closeable:\*\* Yes' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/0{09,10,11,12,13,14,15,16}-*/acceptance-criteria.md` Observed: `declined` names the descendant walk and the claim line, the two changes phases 015 and 016 did not build. `rg -L` lists no file, because both phases closed with a recorded decline and a closure line that reads Yes. | Met | - |
| AC-006 | REQ-006 | Given the shipped behaviours listed in `goal.md`, When the playbook is read, Then each has one `HS-` check with its command, expected signal and pass or fail line, and each automatable command exits 0 | `rg -c '^#### HS-' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` equals the shipped count in `goal.md`, and each HS command exits 0 with `fail 0` Observed: prints 8, seven shipped behaviours plus the live worker check, and the seven commands each exit 0 with `fail 0` (`scratch/hs-checks.txt`). | Met | - |
| AC-007 | REQ-007 | Given the recorded worker diff, When the background-worker check runs as the playbook writes it, Then `PREPARE.exit` holds the value the check names (0 on the 2026-11-13 tree, a refusal only if phase 009 or 015 ships one for this note or this worker), the worker survives with parent pid 1 when prepare passed, and the evidence lands in `scratch/live-worker-hop/` | `rg -n 'run-hop-variant.diff' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` prints a line in the check, `rg -n 'PREPARE.exit: ' scratch/live-worker-hop/summary.txt` prints the value the check names, and when it is 0, `rg -n 'RECEIVER.marker: [0-9]+ +1 ' scratch/live-worker-hop/summary.txt` prints 1 line Observed: the diff is named in HS-8, `PREPARE.exit: 0` matches the value the check names, and the marker line shows parent pid 1. | Met | - |
| AC-008 | REQ-008 | Given a writer that recreates the project folder 2 s after `finish-run.sh` starts, When `finish-run.sh` runs with `FINISH_SETTLE_S=5`, Then the folder is absent 3 s after it returns. Test `a late write after finish-run leaves no project folder` in `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/test-finish-run.sh` | `bash specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/test-finish-run.sh` exits 1 before the fix with `FAIL: project folder still present` saved in `scratch/red.txt`, and exits 0 with `ok` after it. After the live run, `ls -d "$(cat scratch/live-worker-hop/project-dir.txt)"` prints `No such file` Observed: `scratch/red.txt` holds the failing run, the test now exits 0 with `ok`, and `ls -d` printed `No such file` after the live run. | Met | - |
| AC-009 | REQ-009 | Given the playbook staged with its changes, When `frontmatter-version.mjs bump --base HEAD` runs, Then the version rises above 1.0.21.0 and the check mode passes | `rg -n '^version:' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` prints a value above 1.0.21.0 and `node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs bump --base HEAD --check` exits 0 Observed: `version: 1.0.22.0`, and the check exits 0. | Met | - |
| AC-010 | REQ-010 | Given the phase's edits, When the changed paths are listed, Then only the README, the playbook, `finish-run.sh` and `test-finish-run.sh` changed outside the spec folders | `git diff --name-only -- .skilled .opencode specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness` and `git status --short specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness` list only those four files Observed: only the README, the playbook, `finish-run.sh` and `test-finish-run.sh`. | Met | - |
| AC-011 | REQ-011 | Given both documents after the edits, When the sk-doc validator runs, Then each is valid with no issue, as at baseline | `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/hooks/session-relaunch/README.md` and the same for `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` each print `VALID` and `Total issues: 0` Observed: both print `VALID` and `Total issues: 0`. | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Every row is Met with observed evidence.
<!-- /ANCHOR:closure -->
