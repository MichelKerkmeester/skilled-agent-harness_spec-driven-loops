---
title: "Goal: Phase 7: status-index"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/007-status-index"
    last_updated_at: "2026-11-22T16:57:30Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-007-status-index"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 7: status-index

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Make `bots status` answer from one derived index that can be deleted and rebuilt to the same rows, say when it is stale, and show every installed bot and open needs-you item, including bots whose checkout moved or vanished.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The index is SQLite through `better-sqlite3`, in WAL mode with a 5000 ms busy timeout and `synchronous = FULL` (ADR-001). |
| D2 | Rows are keyed by repository identity plus last known path, and a checkout is relinked only from the `missing` state (ADR-003). |
| D3 | A generation stamp tells status the index is stale, and `builtAt` is recorded on every build (ADR-004). |
| D4 | Retention numbers are read from `bots/config.json`, and needs-you retention never deletes an open item (ADR-002, ADR-005). |
| D5 | Unregister hides a repository's rows and deletes no file. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] With three recorded runs, `bots status --json` before and after deleting the index and running `bots status --rebuild` prints identical rows, ignoring `builtAt`
- [ ] A fixture with one installed never-run bot, one launchd-failed bot, one missing checkout and one unreadable checkout prints four rows with the states `never-run`, `launchd-failed`, `missing` and `unreadable`, and a checkout moved with the same identity shows its new and previous paths
- [ ] After writing more runs than the retention bound, the index row count equals the bound and every remaining terminal row is byte-identical to its first write
- [ ] A fixture with one deleted run folder, one open needs-you item and one install record whose runner path was retargeted prints the row states `run-folder-gone`, `needs-you` and `needs-reinstall`, the open item's bot row prints `held`, and status exits 0
- [ ] The pragma test reads back `journal_mode` `wal`, `busy_timeout` `5000` and `synchronous` `2` from a freshly opened index
- [ ] `bots status --unregister <identity>` hides that identity's rows, and `find <state root> -type f | wc -l` prints the same count before and after
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
| Goal authored | Done | Criteria drawn from spec.md section 5 and acceptance-criteria.md |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
