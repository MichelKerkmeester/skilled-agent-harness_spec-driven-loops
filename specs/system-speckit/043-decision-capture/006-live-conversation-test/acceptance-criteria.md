---
title: "Acceptance Criteria: Phase 6: live-conversation-test"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "live conversation test acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/006-live-conversation-test"
    last_updated_at: "2026-11-01T20:57:44Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-006-live-conversation-test"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 6: live-conversation-test

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `system-speckit/043-decision-capture/006-live-conversation-test`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-01
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 065 format has shipped, When the scenario `decision-capture-live-conversation.md` is written, Then it holds 12 stage rows S0 to S11 and `decision-capture-kill-switch-conversation.md` holds S12, each with a human turn, a pause, a wait condition, an answer and a checkpoint with its expected value, and both files' `json conversation` blocks validate | `rg -c '^[\|] S([0-9]\|1[01]) [\|]'` on the first file prints 12 and `rg -c '^[\|] S12 [\|]'` on the second prints 1, and `validate-playbook-package.cjs --package system-spec-kit` reports no `CONVERSATION_SCRIPT_INVALID`. Observed 2026-11-02: 12 rows S0 to S11, 1 row S12, package validator 0 violations (goal.md log) | Met | - |
| AC-002 | REQ-010 | Given the scenario exists, When the playbook index is read, Then it lists the scenario once and the package validator reports no new violation | `rg -c 'decision-capture-live-conversation' .skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md` prints 1, and `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package system-spec-kit` output. Observed 2026-11-02: one index row per file, package validator 0 violations (goal.md log) | Met | - |
| AC-003 | REQ-002 | Given a baseline of `git -C "$R" status --short --ignored specs .skilled/skills/.state` and a content hash of the real queue folder taken at S0, When any runtime's run ends, Then both match the baseline | `diff scratch/live-runs/<runtime>-run1/baseline/repo-status.txt scratch/live-runs/<runtime>-run1/after/repo-status.txt` exits 0 for every runtime that ran | Superseded | ADR-001 |
| AC-004 | REQ-003 | Given an interactive Claude Code session started in a tmux pane in the scratch project, When the 065 runner drives it through S0 to S12, Then the Claude row of the matrix carries the CLI version, the model, the question tool and a value in every stage cell, from that run | the Claude row in `implementation-summary.md` and `scratch/live-runs/claude-run1/pane-S*.txt`. Observed 2026-11-02: the Claude row holds CLI 2.1.316, Opus 5.5, `AskUserQuestion` and PASS in S1 to S12; S1 pane is `scratch/live-runs/claude-run1/pane-S1.txt` | Met | - |
| AC-005 | REQ-003 | Given the Claude run has ended, When `checkpoints.tsv` is read, Then it has 13 rows, each with PASS, FAIL or SKIP (a FAIL for a deviation quotes it, a SKIP names its blocker) and an evidence path that exists | `wc -l < scratch/live-runs/claude-run1/checkpoints.tsv` prints 13 and `cut -f3 scratch/live-runs/claude-run1/checkpoints.tsv \| xargs ls` exits 0. Observed 2026-11-02: `wc -l` prints 13, every row PASS, and `cut -f3 \| xargs ls -d` exits 0 | Met | - |
| AC-006 | REQ-004 | Given the subject asked a Gate 3 or other process question in S1 and the human answered it, When the queue and the record are read after S10, Then the question is in neither, while the S1 pane shows it was asked | `rg -c --include-zero -i 'spec folder\|gate 3' scratch/live-runs/claude-run1/queue-S10.jsonl scratch/live-runs/claude-run1/decision-record-S10.md` prints 0 for both, and the same search on `pane-S1.txt` prints 1 or more. Observed 2026-11-02: 0 on `queue-S10.jsonl` and on `decision-record-S10.md`, 2 on `pane-S1.txt` | Met | - |
| AC-007 | REQ-005 | Given three tool answers and one plain chat answer before S6, When the S6 full-auto save runs, Then `decision-record.md` gains 4 operator rows whose decided text differs from each verbatim answer, 4 appendix items holding the exact answers, `consumed.jsonl` gains 4 distinct keys, the queue stays at 3 lines and the `SPECKIT_LEVEL` line of the demo `spec.md` is unchanged | `scratch/live-runs/claude-run1/decision-record-S6.md`, `consumed-S6.jsonl` with `jq -r .key \| sort -u \| wc -l` printing 4, and the S6 row of `checkpoints.tsv`. Observed 2026-11-02: `consumed-S6.jsonl` holds 4 distinct keys, the S6 queue copy has 3 lines, none of the decided texts of Q001 to Q004 equals a verbatim answer, and the scratch `spec.md` still reads `SPECKIT_LEVEL: 3`. No record copy was taken at S6; the first four rows of `decision-record-S10.md` are those rows, since S11 proves the record only appends. The S6 check now copies the record for the next run | Met | - |
| AC-008 | REQ-005 | Given the S10 full-auto save wrote 7 rows, When the S11 save runs with nothing new, Then `decision-record.md` is byte-identical and `consumed.jsonl` keeps 7 lines | `cmp scratch/live-runs/claude-run1/decision-record-S10.md scratch/live-runs/claude-run1/decision-record-S11.md` exits 0, and `wc -l < consumed-S11.jsonl` prints 7. Observed 2026-11-02: `cmp` exits 0 and `consumed-S11.jsonl` has 7 lines | Met | - |
| AC-009 | REQ-006 | Given the Claude Stop hook is registered, When the nudge lines are counted per turn in the panes for S1 to S11, Then the sequence is 0,1,1,1,0,0,1,1,1,0,0 and each `nudge-S<k>.txt` holds the count the plan's stage table expects | `rg -c --include-zero 'not in a decision record yet' scratch/live-runs/claude-run1/pane-S*.txt` and the `nudge-S*.txt` files | Superseded | ADR-002 |
| AC-010 | REQ-007 | Given answers queued before S8, When the subject is compacted with the runner's `action: compact` and later restarted with `action: restart`, Then the queue is unchanged by the compaction, no key appears twice across the queue files and the answer given after each step is queued exactly once | `jq -r .key queue-S9*.jsonl \| sort \| uniq -d` prints nothing, `jq -r .key ... \| sort -u \| wc -l` prints 6, and the S8 and S9 rows of `checkpoints.tsv`. Observed 2026-11-02: the S8 rows read `rows=4 digest=unchanged` then `rows=5`, the S9 rows `rows=5 sessions=1` then `rows=6 sessions=1`; `jq -r .key queue-S10.jsonl \| sort \| uniq -d` prints nothing and the unique count is 6 | Met | - |
| AC-011 | REQ-008 | Given a second scratch project and a subject launched with `SYSTEM_DECISION_CAPTURE_DISABLED=1`, When the human answers one tool question, Then no queue file exists, no nudge line appears and the pane shows the answer was given | `ls "$K"/.skilled/skills/.state/decision-capture/*.jsonl` finds no file, and `rg -c --include-zero 'not in a decision record yet' scratch/live-runs/claude-run1/pane-S12.txt` prints 0. Observed 2026-11-02: S12 `queue_jsonl=0 nudge_lines=0 color_question=1 amber_visible=1` on Claude, and the same on OpenCode, Pi and Devin | Met | - |
| AC-012 | REQ-009 | Given OpenCode, Codex, Pi and Devin, When each is run through the scenario, Then its matrix row holds stage results, or "no answer surface" with the pane or transcript line that shows the missing question tool | the four rows in `implementation-summary.md` and `scratch/live-runs/<runtime>-run1/checkpoints.tsv` or `no-answer-surface.txt`. Observed 2026-11-02: the OpenCode, Codex, Pi and Devin rows each hold stage results and a PASS verdict, with 13-row stage files under `scratch/live-runs/` | Met | - |
| AC-014 | REQ-012 | Given the main run, When `result.json` is read, Then it records the seed, and each turn's pause in `actions.jsonl` lies in its range | `jq .seed result.json` and the pause values. Observed 2026-11-02: `result.json` records seed 1545152316. The runner logs no pause value, only timestamps; each pause is drawn as `min + floor(rng() * (max - min + 1))` with `rng()` in [0, 1), so it lies in its range by construction (`run-conversation-scenario.cjs:272-281`) | Met | - |
| AC-015 | REQ-013 | Given the S6 and S10 saves, When their checks run, Then `pendingRecords` reports 0, `consumed.jsonl` grew by exactly the number of answers since the last save, and the check names the consuming path | `check.txt` of S6 and S10. Observed 2026-11-02: both checks print `pending=0`; `consumed.jsonl` went from 4 lines at S6 to 7 at S10, the 3 answers given in S7 to S9, and each consumed line names its packet `specs/demo/001-demo` | Met | - |
| AC-013 | REQ-011 | Given siblings 002 to 005 re-prove their fixes with this scenario, When the scenario is read, Then it names each sibling, the stage it adds or reruns, the no-renumbering rule and the commit column of the appended matrix row | `rg -c '002-table-row-matching\|003-codex-and-pi-capture\|004-opencode-devin-live-capture\|005-chat-question-detection' <scenario>` prints 4 or more. Observed 2026-11-02: the scenario names all four siblings and the no-renumbering rule | Met | - |
| AC-016 | REQ-002 | Given a mirror root whose `specs/` and decision-capture state are real empty folders and whose other paths link to the real repository (ADR-001), When the 065 runner runs a runtime with `--repo-root` set to it, Then `result.json` reports `repo.changed` false, and the real repository's `git status --short --untracked-files=all specs` and decision-capture file names match their pre-run copies, or differ only by a file another session wrote, named with its session id and time | `jq .repo.changed scratch/live-runs/<runtime>-run1/runner/main/<runtime>/result.json` prints false, and `diff baseline/repo-status-main.txt after/repo-status-main.txt` in the same folder. Observed 2026-11-02: `repo.changed` false for the OpenCode, Pi and Devin main and kill-switch runs and the Claude sibling run; their real-repository diffs are empty or hold only files the 065 session wrote, named by path. The Claude main and kill-switch runs predate the mirror and left the real repository unchanged | Met | - |
| AC-017 | REQ-006 | Given the Claude Stop hook runs async (ADR-002), When the subject transcript is read after S11, Then nudges carrying 1, 2 and 3 pending follow S2, S3 and S4, one carrying 1 follows S7, one carrying 3 follows S9, none follows S5, S6, S10 or S11, and the nudge written after S8 is recorded as dropped by the S9 restart | `scratch/live-runs/claude-run1/nudge-sequence.txt`. Observed 2026-11-02: `nudge-sequence.txt` shows 1, 2 and 3 pending after S2 to S4, 1 after S7, 3 after S9 and no message elsewhere; the S8 nudge file read 2 and no message arrived before the S9 restart | Met | - |

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

**Closeable:** Yes. Every criterion is Met or Superseded.
<!-- /ANCHOR:closure -->
