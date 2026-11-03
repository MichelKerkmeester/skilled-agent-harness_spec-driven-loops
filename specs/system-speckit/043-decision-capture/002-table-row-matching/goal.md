---
title: "Goal: Table row matching"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "table row matching goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/043-decision-capture/002-table-row-matching"
    last_updated_at: "2026-11-01T21:30:00Z"
    last_updated_by: "series-planner"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fe0c9990-06d3-454e-a8e7-7c7bc649bc49"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Table row matching

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Count an answer that already has a row in a hand-written decision table as consumed under that row's Q id, with no new row and no byte added to the hand-written record.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The matcher only reads a hand-written record. A match is written as a row in `consumed.jsonl`, never into the record itself. |
| D2 | A record matches a row only when its normalized answer equals the row's answer cell and its score clears the threshold. A tie within the margin is refused and the record stays pending. |
| D3 | Tests read a redacted fixture copy of the table. No test opens the live Barter decision record. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `npx vitest run .skilled/skills/system-spec-kit/runtime/cli/tests/decision-table-matcher.vitest.ts` exits 0, with read-only, mapping, tie, no-row, one-row-one-answer, rebuild, orphan-scan and release cases.
- [ ] For session `fe0c9990-06d3-454e-a8e7-7c7bc649bc49`, queue records 1 to 11 and 13 to 28 are consumed as Q67 to Q93 of `barter/ai-speckit/specs/barter-framework/001-coder-skilled-v4-conversion/decision-record.md`, and `rg -c '^\| Q[0-9]+ \|'` on that file prints the same count immediately before and after the run.
- [ ] Queue record 12 has exactly one row and one appendix item in a decision record, and every queue record from 1 to 30 for that session is consumed or named in the matcher's `refused` count with its reason.
- [ ] A second `--apply` run adds no line to `consumed.jsonl`, and `shasum -a 256` of `barter/ai-speckit/specs/barter-framework/001-coder-skilled-v4-conversion/decision-record.md` and of `001-decision-capture-build/decision-record.md` prints the same values as before the run.
- [ ] `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts` prints no `operator answer(s) captured this session` line for that session once no later record is pending.
- [ ] The 002 row in the 006 results matrix is marked pass.
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
| Planning docs | Done | `validate.sh --strict` on this folder printed `RESULT: PASSED`, 2026-11-01 |
| Matcher build | Done | 2026-11-01: 34 tests pass, real run `consumed 31, refused 0, pending 2`, Barter 99 rows before and after with the same sha256, record 12 saved as 001 Q008 |
| 006 re-proof | Blocked | Waits for the 065 runner |
| Start count and Barter hash (T001, T002) | done | consumed log 2 lines (records 29, 30), records 1-28 pending; Barter 99 rows, sha256 f25074d57968e7d61e8af488f5d899d49fbe6d3e0ea2b0170f130b47e6257867; scratch/real-run/before.txt |
| Real run T011-T014 | done | dry run consumed 31 refused 0 pending 2; first --apply log 2->33; second --apply consumed 0; record 12 saved as 001 Q008; records 1-30 pending 0, rerun 2026-11-02 still 1-30 consumed; scratch/real-run/ |
| 006 re-proof and AC-019 | done | Claude sibling S6 n=Q050 amber_rows=1, S14 n=0; save-writer scenario intact PASS, with recordConsumedKeys stubbed steps 3-5 fail; scratch/save-writer-*.txt |
| Barter record changed outside this packet | note | 2026-11-02 09:08 local: rows Q100-Q111 hand-written, no source comments, sha256 now f9f2885e...7681; the matcher has no write call |
| Operator answers Q001-Q003; 002 closed | done | tableless record exits 0 (2 new CLI cases, 64/64), record 12 stays 001 Q008, CHK-051 amended; decision-record.md written by the save |

### Deviations and findings

| Item | Note |
|------|------|
| Answer count | The operator's brief said 28 answers resolve to Barter rows. The queue shows 27 that map to Q67 to Q93, while record 12, the child-guard answer, has no row in any record. Its target is an open question in spec.md. |
| Records after the plan | Records 32 to 35 matched Barter Q96 to Q99. Record 31 (065 Q003) stays pending; see open-questions.md |
| Luna quota | Ran out at about 22:40 UTC; the CLI was written by DeepSeek through cli-pi |
<!-- /ANCHOR:log -->
