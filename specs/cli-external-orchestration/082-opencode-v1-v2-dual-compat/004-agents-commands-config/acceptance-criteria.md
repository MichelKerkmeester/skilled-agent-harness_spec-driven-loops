---
title: "Acceptance Criteria: Phase 4: agents-commands-config"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "agents commands config acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/004-agents-commands-config"
    last_updated_at: "2026-10-18T12:45:04Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-agents-commands-config"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 4: agents-commands-config

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/082-opencode-v1-v2-dual-compat/004-agents-commands-config
**Level:** 2
**Status:** Complete
**Date:** 2026-10-18
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the agent mirror set, When `node .opencode/bin/check-agent-mirror-sync.cjs` runs, Then it exits 0 and reports 11 agents checked | `scratch/mirror-check-after.txt:2` records `agent-mirror-sync: 11 agent(s) checked` with `OK` and `exit=0` at `:3`, and all five checks exit 0 at `:1-15`. | Met | - |
| AC-002 | REQ-002 | Given the ten agents that carry `chrome_devtools: deny`, When their frontmatter is read, Then each also carries `browser: deny`, and no other frontmatter key changes | `scratch/browser-key-check.txt:12` records `count=10`, and `scratch/frontmatter-diff.txt:2-12` shows each of the ten agents gained only `browser: deny` with `orchestrate.md` unchanged at `:10`. | Met | - |
| AC-003 | REQ-003 | Given the eleven agent bodies that name the `Task` tool, When the review marks each remaining mention, Then each mention is a prohibition or a named example, and no runtime-only name is universal | `scratch/review-004.txt:5` marks the wording and frontmatter check PASS and `:43` records the PASS verdict with no open P0 or P1. The per-line rulings sit at `scratch/decisions.txt:19-22`, which keeps the five `subagent_type` lines to avoid a behaviour change. | Met | - |
| AC-004 | REQ-004 | Given the runtime table in `orchestrate.md`, When it is read, Then it lists Devin's `run_subagent`, and it lists UNKNOWN for each runtime with no evidence | The original `grep -n 'UNKNOWN'` half no longer matches anything, and decision 9 records why: the line is a prose sentence, not a table, and every runtime has a stated name, so no UNKNOWN entry was needed (`scratch/decisions.txt:23`). The three names with their cited sources sit at `scratch/runtime-tool-names.txt:3-4` (Devin `run_subagent`), `:11` (Cursor `Task`) and `:16` (Hermes `delegate_task`). | Met | - |
| AC-005 | REQ-005 | Given the twelve moved files, When `.skilled/commands` is searched, Then no moved file remains there | `scratch/scope-check.txt:65-76` records the twelve renames out of `.skilled/commands`, and `scratch/stale-paths.txt:24` records `moved-file path (stale): 0`. The closeout re-run of the `find` prints no line. | Met | - |
| AC-006 | REQ-006 | Given the v1 command listing and `opencode2 api GET /api/command`, When each is read after the move, Then neither lists a moved file | The original grep no longer prints 0, because `scratch/command-listing-after.txt:41-94` is this nested worktree's v2 listing, which still shows the twelve. Decision 13 explains that v2 merges the ancestor main checkout's `.opencode` folder above the worktree (`scratch/decisions.txt:27`). The v1 half holds at `:1` (39 commands, none moved), and the isolated v2 copy lists 41 with `moved-file entries: []` at `scratch/v2-command-isolated.txt:2-3`. | Met | - |
| AC-007 | REQ-007 | Given the contract compiler and drift tests, When they run from the new paths, Then they show the same pass count as the baseline, with no new failure | `scratch/contract-tests-after.txt:6` records 55 passed, matching `scratch/contract-tests-before.txt:6` with no new failure. | Met | - |
| AC-008 | REQ-008 | Given `opencode.json`, When `opencode debug config </dev/null` runs on v1 1.19.3, Then it exits without error | `scratch/config-load-after.txt:2` records `exit=0` and `:3` records 0 stderr lines. The `grep -c -i 'error'` half now prints 1 rather than 0, because `:4` records 29 error-word matches inside embedded prompt text in stdout and states that stderr is empty. | Met | - |
| AC-009 | REQ-009 | Given the config shape test, When it runs, Then both cases pass, and the negative case fails on the copy that carries a v2-only key | `scratch/config-shape.txt:5-6` records `pass 2` and `fail 0`. The capture comes from the symbol reporter, so the `^# (pass\|fail)` grep no longer matches. The test sits at `.skilled/bin/tests/opencode-config-shape.test.cjs`, which the spec's `.opencode/bin/tests/` path reaches through the `.opencode/bin` link (`scratch/review-004.txt:24`). | Met | - |
| AC-010 | REQ-010 | Given the consumers of the moved files, When they are searched for old paths, Then only recorded exceptions remain | `scratch/stale-paths.txt:24` records 0 moved-file paths, and `:25` and `:26` classify the remaining matches as 13 live folder or script matches that did not move and 3 unchanged manifest path matches (decision 7). The implementation summary records these exceptions. | Met | - |
| AC-011 | REQ-011 | Given the phase, When `git status --porcelain` is compared with the snapshot, Then every new or changed path falls inside the file list in `spec.md` section 3 | `scratch/scope-check.txt:1-76` is the comm output. Every tracked path sits in `spec.md` section 3 or is ruled in by decision 4 (the Hermes skill copies) and decision 10 (the crosswalk) at `scratch/decisions.txt:14` and `:24`, and the untracked lines are this phase's own captures under `scratch/`. | Met | - |
| AC-012 | REQ-012 | Given the diff, When DeepSeek reviews it against `sk-doc` agent mode and `sk-code/sk-code-opencode`, Then the review lists no open P0 or P1 item | `scratch/review-004.txt:2` reports PASS with two P2s and no P0 or P1, and `:12-13` records no P0 and no P1. The two P2 fixes sit at `scratch/decisions.txt:29-31`, and the post-fix reruns are at `scratch/contract-tests-after.txt:5-6` and `scratch/mirror-check-after.txt:2-3`. | Met | - |

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

### Row sources and evidence

Each row AC-n maps to REQ-n in `spec.md` section 4, so the two lists stay in step. AC-011 checks the file list in `spec.md` section 3, and AC-012 checks the review that decision D7 requires for the agent bodies and the config test.

The template has no separate evidence column. The Verification column names the check, and it takes the observed evidence once the check runs. Each row stays `Unmet` until that evidence sits in its Verification cell.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All 12 rows are `Met`, each with observed evidence in its Verification cell. Five rows carry an amendment because the original check no longer matched the delivered capture: AC-004 carries decision 9 (every runtime has a stated name, so no UNKNOWN entry was needed), AC-006 carries decision 13 (the nested worktree's v2 listing merges the parent checkout, and the isolated copy proves the move), AC-008 and AC-009 carry the capture's own reporter format (the stderr count and the symbol reporter), and AC-010 carries the decision 7 classification of the remaining matches. AC-005 and AC-011 cite the rename record and the scope comparison. The strict validator runs last, in T023.
<!-- /ANCHOR:closure -->
