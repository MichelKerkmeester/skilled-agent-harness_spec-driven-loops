---
title: "Implementation Summary"
description: "Planned, nothing built. This packet will let captured answers map to rows of a hand-written decision table so they stop counting as pending."
trigger_phrases:
  - "table row matching implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/004-decision-capture/002-table-row-matching"
    last_updated_at: "2026-11-02T14:35:24Z"
    last_updated_by: "generate-context"
    recent_action: "Closed 002 on the operator answers; CHK-012, CHK-023, CHK-051 amended"
    next_safe_action: "Verify CHK-FIX-007 against the commit SHA once the operator approves"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/match-decision-table.vitest.ts"
      - ".skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-save-writer.md"
    session_dedup:
      fingerprint: "sha256:a899f615df75aae4d83e43dc5ae8ad4a5fa85fea004aa88f9cb6b6ca0de91cea"
      session_id: "scaffold-002-table-row-matching"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-table-row-matching |
| **Status** | Complete |
| **Completed** | 2026-11-02, after the 006 re-proof and the operator's three answers |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An answer that already has a row in a hand-written decision table is now counted as consumed under that row's Q id, with no byte added to the hand-written record. A pure matcher scores queue records against the table, and a CLI applies the matches through the existing consumed log.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/continuity/decision-table-matcher.ts` | Created | Pure parse, normalize, score, refuse ties and second answers, summary line. No file access |
| `runtime/cli/continuity/match-decision-table.ts` | Created | Dry run by default, `--apply`, `--scan-orphans`, `--release <key>`; refuses a root that is not a directory |
| `runtime/api/index.ts` | Modified | Re-exports the matcher |
| `runtime/hooks/claude/session-stop.ts` | Modified | Nudge text names the transcript sweep and `match-decision-table` |
| `runtime/lib/continuity/decision-record-writer.ts` | Modified | Appendix labels may be bolded or indented, and a re-save with a changed answer rewrites the appendix item (D6, the operator's ruling) |
| `runtime/cli/tests/decision-table-matcher.vitest.ts`, `match-decision-table.vitest.ts`, `decision-record-writer.vitest.ts` | Created, Created, Modified | 34 tests across the three files |
| `runtime/cli/test-fixtures/decision-table/hand-written-record.md` | Created | Invented rows in the real nine-column shape |
| `.skilled/commands/speckit/save.md`, `references/memory/save-workflow.md` | Modified | When to run the matcher instead of a save |
| `manual-testing-playbook/plugins-and-hooks/decision-capture-save-writer.md` | Modified | Counts consumed lines, checks the consumed key and id, `--ignored` status before and after. Expects the next free `Q` id instead of a fixed `Q008`, and step 5 lists the same path as step 1 |
| `001-decision-capture-build/decision-record.md` | Written by a full-auto save | Q008, the child-guard answer |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Luna workers wrote the matcher, its tests and the calibration, and the writer and scenario edits, until Luna's quota ran out at about 22:40 UTC. A DeepSeek worker through cli-pi wrote the CLI, the re-export, the nudge text and the save-doc steps. The orchestrator ran every test, the real dry run, both `--apply` runs and both saves itself.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The fixture holds invented rows, not a redacted copy of Q67 to Q95 | Tests then carry no Barter text at all. The real rows were exercised read-only by the calibration and the real run |
| Records 32 to 35 were consumed as Barter Q96 to Q99 | They are Barter questions answered this session and recorded there by hand, so they belong to that record |
| Record 31 stays pending | It is 065's Q003, whose appendix holds a shortened question, so neither the matcher (no answer column) nor the writer (question differs) can claim it safely |
| Record 12 was saved into 001 as Q008 | The open-questions recommendation, recorded once |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `vitest run` on the three test files | `Test Files 3 passed (3)`, `Tests 34 passed (34)` |
| D6 fix, `vitest run` on writer, matcher, CLI and save-continuity suites | `Test Files 4 passed (4)`, `Tests 61 passed (61)`, `tsc` exit 0 |
| `tsc --noEmit -p tsconfig.json` | exit 0 |
| Barter rows and hash before the real run | `rows-before 99`, sha256 `f25074d5...6257867` (`scratch/real-run/before.txt`) |
| Dry run | 33 lines, `consumed 31, refused 0, pending 2`, consumed log 2 lines before and after |
| First `--apply` | `consumed 31, refused 0, pending 2`, consumed log 2 to 33 lines, every new row `{key,packet,id,at}` naming the Barter folder |
| Second `--apply` | `consumed 0, refused 0, pending 2`, consumed log still 33 |
| Barter rows and hash after | `rows-after 99`, sha256 unchanged (`scratch/real-run/after.txt`) |
| Record 12 save | `Wrote 1 operator decision(s)`, one `| Q008 |` row and one `### Q008` item, second save `DR_BYTE_IDENTICAL`, consumed log 34 both times |
| Pending after | `queue 35 pending 1 31 Runner`, `records 1-30 pending: 0` |
| `--scan-orphans` | one queue, this session's, 1 pending |
| Compiled Stop-hook nudge for this session | `nudge: null` |
| 006 re-proof, Claude sibling run, 2026-11-02 | S6 `n=Q050 amber_rows=1 chat_rows=1 pending=0 process_rows=0`, S14 `n=0` |
| Save-writer scenario, as written, 2026-11-02 | Every step passes; `NEXT=Q009` (`scratch/save-writer-intact.txt`) |
| Same scenario with `recordConsumedKeys` a no-op through a Node load hook | Steps 3, 4 and 5 fail on the missing consumed log; the stub line is in the save log (`scratch/save-writer-stubbed.txt`) |
| Missing record and unreadable table, CLI suite | missing record exits 2; no table or no answer column exits 0 with `pending 1` and no consumed log; 64 of 64 pass |
| Non-directory root (T022) | The new case fails before the change with `expected +0 to be 2`; after it, 62 of 62 pass across the matcher, CLI, writer and save suites |
| `npm run lint`, `npm run typecheck` in the runtime, 2026-11-02 | both exit 0 |
| Measured Behavior command, rerun 2026-11-02 | records 1 to 30 each print `consumed` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A record with no Q-id table exits 0.** Its answers stay pending for the save. The operator chose this over exit 2 on 2026-11-02, since the save step runs the matcher on every record.
2. **Record 31 is pending.** Its answer is recorded by hand as 065's Q003; see `../open-questions.md`.
3. **The Barter record changed after the real run.** At 09:08 local on 2026-11-02 it gained hand-written rows Q100 to Q111, with no writer source comments, so its sha256 no longer matches the run's. The matcher has no write call.
<!-- /ANCHOR:limitations -->

---
