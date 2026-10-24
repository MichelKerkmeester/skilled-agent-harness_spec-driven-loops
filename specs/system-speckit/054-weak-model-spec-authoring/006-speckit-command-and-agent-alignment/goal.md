---
title: "Goal: Phase 6: speckit-command-and-agent-alignment"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "speckit command and agent alignment goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/006-speckit-command-and-agent-alignment"
    last_updated_at: "2026-10-23T13:10:00Z"
    last_updated_by: "author"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-weak-model-spec-authoring-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 6: speckit-command-and-agent-alignment

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Bring every speckit command and every doc-authoring agent in line with the templates, the placeholder gate and the authoring card that phases 2 to 5 change, then leave every runtime mirror regenerated from those corrected sources.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Writes land on the 12 audited command and agent files, the 4 authored Claude siblings, the generated mirror trees and this phase folder. No template, validator, runtime source or reference file changes. |
| D2 | The audit is frozen at authoring time as 27 exact rows. The executor applies text and does not judge it. |
| D3 | Every row is applied by `apply_row.py`, which refuses unless the locator occurs exactly once in its file. |
| D4 | Generated mirrors are rebuilt by their own generators. `.claude/agents` is the one authored sibling, edited by six MIRROR rows. |
| D5 | The suite and the trigger index are compared with the phase start, not with phase 1. The cumulative difference is recorded as information, not as a pass condition. |
| D6 | One read-only review runs through `cli-devin` with `swe-2-max`. No writer worker runs in this phase, because every text change is frozen in a row. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `scratch/audit/rows.jsonl` holds 27 lines, `jq -c .` parses every line, and T004 prints `27 1`
- [ ] T006 prints `27`, `27` and `27`, which means every row applied and changed only the file it names
- [ ] `scratch/audit/searches.txt` holds `A1_rc=1`, `A2_rc=1`, `A3_rc=1`, `A4_rc=1` and `GUARD_REFS=6`
- [ ] `scratch/mirrors/summary.txt` holds eight lines that end in `rc=0`
- [ ] T009 prints `INDEX_STALENESS_SAME`, `gate1_exit=0` and a lookup exit of 0 or 1
- [ ] T012 prints `SUITE_MATCH`, and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` on this phase with `--strict` prints `RESULT: PASSED` with no changed path outside the rows, the generated trees and this phase folder
- [ ] `scratch/review/T013.txt` holds only `P0`, `P1` or `P2` lines or the single line `NO FINDINGS`, and each finding is applied or recorded in section 4
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase opened | Pending | |
| Phases 1, 4 and 5 checked (T001) | Pending | |
| Tools checked (T002) | Pending | |
| Phase start commit | Pending | |
| Suite and doctor baseline (T003) | Pending | |
| 27 rows saved (T004) | Pending | |
| Tools saved and applier self-tested (T005) | Pending | |
| 27 rows applied (T006) | Pending | |
| Four search gates (T007) | Pending | |
| Mirrors regenerated and eight checks run (T008) | Pending | |
| Doctor:speckit checks and index comparison (T009) | Pending | |
| Owner 006 ledger rows recorded (T010) | Pending | |
| Scope check (T011) | Pending | |
| Suite compared with the phase start (T012) | Pending | |
| Frontier review and findings (T013) | Pending | |
| Phase closed and committed (T014) | Pending | |

### Deviations and findings

| Item | Note |
|------|------|
| check-placeholders C3 | The nine hits are the literal token `[SPEC_FOLDER]` inside fenced YAML and JSONL rows. This is the known scanner false positive class, so no text changes. |
| Suite comparison C8 | ADR-003 is approved by the orchestrator: compare the suite with the phase start, not with phase 001's `suite-start.txt`. Phase 001 records that file when it runs. |
| Shared template text | The `../changelog/` line in `spec.md` and the `decision-record.md` waiver line in `acceptance-criteria.md` are fixed template text shared by every phase. Left unchanged. |
| Generated metadata | Editing the six docs changed `graph-metadata.json`'s `source_fingerprint`, so `repair-derived.cjs --apply` re-derived that generated file. `validate.sh --strict` enforces the match. No authored content changed. |
| Takeover on 2026-10-24 | The parent moved every remaining run to cli-codex gpt-6-luna max fast and cli-devin swe-2-max, and every review to swe-2-max (parent D4, D7, D8). A task that names the Task tool runs as that CLI dispatch with the same brief and reply file. |
<!-- /ANCHOR:log -->

