---
title: "Implementation Summary"
description: "A CLI deep-loop lineage now receives its mode's output contract and is held to it at every iteration, so a run can no longer pass every iteration and then fail its closeout on findings it claimed and never listed."
trigger_phrases:
  - "cli lineage findings contract summary"
  - "findings not enumerated shipped"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-review-and-cli-lineage/005-cli-lineage-findings-contract"
    last_updated_at: "2026-10-04T15:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Fixed the merge regression the proof run exposed, proved SC-002 with synthesis_complete"
    next_safe_action: "None. The packet is closed"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs"
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/iteration-findings.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "5347dbce-12b3-4d28-9826-cfbf11c6be1d"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-cli-lineage-findings-contract |
| **Completed** | 2026-10-04 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A CLI lineage in a deep-research or deep-review fan-out now gets told what each iteration must contain, and it gets stopped at the iteration that leaves its findings out. Before this, a DeepSeek lineage could claim 46 findings, list 22, pass all five iteration checks and only fail at the closeout, when the run was already over.

### Give CLI deep-loop lineages the findings output contract and gate it per iteration

You get three things. The CLI prompt for a research or review lineage now carries a short contract taken from that mode's own template and agent file (`runtime/scripts/fanout-run.cjs:1483-1504`). The iteration check fails a claim with nothing behind it, so the existing redispatch-once rule repairs the iteration while it is fresh. And the merge and the closeout count each iteration once, using its latest record, so a backfilled iteration no longer counts twice.

The gate reads exactly what the reducers read. For research, that is the structured list, the `## Findings` lines, graph events and the delta rows filed under the iteration. For review, the claim is the iteration's own `findingsNew`, because `findingsCount` is the running total (`deep-review/references/state/state-jsonl.md:108-110`). The evidence is complete `findingDetails`, a ranked delta finding row whose numeric `iteration` is this one, or bullets in a narrative named exactly `iteration-NNN.md`, parsed by the review reducer's own `parseIterationFile`. Each source is read the way the reducer reads it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/scripts/fanout-run.cjs` | Modified | CLI OUTPUT CONTRACT block per loop type |
| `runtime/scripts/verify-iteration.cjs` | Modified | `findings_not_enumerated` for research and review |
| `runtime/lib/deep-loop/iteration-findings.cjs` | Created | Shared Markdown parser, `latestIterationRecords`, `deltaRowIteration`, `findingKeys` |
| `runtime/scripts/fanout-merge.cjs` | Modified | Latest record per iteration, registry list guards, shared helpers |
| `runtime/scripts/synthesis-closeout.cjs` | Modified | Latest record per iteration |
| `runtime/tests/unit/verify-iteration.vitest.ts` | Modified | Research and review gate cases |
| `runtime/tests/fanout-loop-prompt-in-process.test.ts` | Modified | Contract present for CLI lineages, absent for native |
| `runtime/tests/unit/synthesis-closeout-latest-record.vitest.ts` | Created | Closeout counts one record per iteration |
| `runtime/tests/unit/fanout-merge-latest-record.vitest.ts` | Created | Merge counts one record per iteration |
| `runtime/tests/unit/fanout-merge-question-shape.vitest.ts` | Created | A number where a list belongs no longer aborts the merge |
| `runtime/tests/unit/fanout-merge-structured-missing.vitest.ts` | Created | A registry missing a finding the state names is completed, and the closeout passes |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GPT-6 Luna max wrote the first version through cli-codex. SWE 2 max then reviewed it through cli-devin and asked for changes: the gate counted delta rows the merge files under another iteration, and `latestIterationRecords` existed twice. Both were fixed. DeepSeek V4.1 Flash max reviewed next, through cli-devin, and found the review gate demanded `findingDetails.length` equal `findingsCount`, which 547 real records break, and ignored `finalSeverity`. The review gate was reworked to gate the iteration's own claim against the three sources the reducer reads. DeepSeek reviewed that rework and asked for five more corrections, all taken: a list-shaped `findingsNew` claims its length, delta rows follow the reducer's numeric attribution, Markdown counts only under the file name the reducer loads, a details list with a bad entry no longer blocks the other sources, and a test for each. Every new rule was disabled in turn to prove its test fails. The final gate, replayed over all 491 review state logs in this repository, rejects 110 of the 926 records that claim new findings, down from 385 under the first version, and none of the 110 is newer than June 2026.

The proof run then exposed a regression of this change. OpenCode Go refused DeepSeek V4.1 Flash for a workspace region setting, so with the operator's choice the DeepSeek lineage reran through cli-devin on `deepseek-v4-1-flash-max`, the same model at the same effort. All five new iterations passed the gate, each claimed count matched by its finding rows: 7, 9, 9, 9 and 10. The combined closeout still failed, now with `structured_state_findings_missing_from_registry`. Luna's state names 15 findings in `findings` lists that its own registry lacks. Before this change, Luna's iteration 1 was counted twice, which pushed its count-only total past its registry size and triggered a rebuild that carried those 15 in. Counting it once removed that accidental trigger. The merge now rebuilds whenever state findings are missing from the registry, by the same keys the closeout uses, and appends the missing ones when the rebuild is the smaller of the two. Replayed on copies, Luna alone closes at 36 findings as it did before this change, DeepSeek alone at 44, and both at 80. DeepSeek reviewed that fix through cli-devin and found three more ways it could pass a closeout it should fail, all taken: the append path now keeps the rebuild's gap and adds only what it appends to the source count, a failed rebuild never lowers a gap the registry already recorded, and an entry the cross-lineage merge would drop no longer counts as holding a finding.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Review gates on `findingsNew`, a list by its length or a count object by its sum, falling back to `findingsCount` only when `findingsNew` is absent | `findingsCount` is the running total of active findings, so an iteration that adds nothing still carries a positive count that earlier iterations listed. The contract allows both `findingsNew` shapes (`reduce-state.cjs:1516-1519`) |
| Review accepts `findingDetails`, ranked delta rows or reducer-parsed Markdown, each under the reducer's own rule | These are the three sources the review reducer reads (`reduce-state.cjs:885-913`), with numeric attribution (`:891`) and exact file names (`:2137`). The gate must not reject a finding the reducer keeps or accept one it drops |
| Review details need not equal the count | Details list every active finding while the count is narrower, and the reducer pads totals the details miss (`reduce-state.cjs:743-766`) |
| The merge and the closeout share `findingKeys` | The closeout fails a registry that lacks a finding the state names, so the merge must judge "missing" by the same keys or it will keep a registry the closeout rejects |
| A non-empty research structured list with unreadable entries does not fall back to other sources | It mirrors the merge's structured-authority rule, so the gate and the merge agree |
| Council is unchanged | Its CLI gets a fully rendered round prompt with the required sections (`deep-ai-council/scripts/orchestrate-session.cjs:145-173,262-295`), and its finding count is derived from headings |
| Improvement is unchanged | `deep-improvement/scripts/shared/loop-host.cjs:134-181` runs deterministic helpers with no findings count and no iteration gate |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted tests, six files | PASS, see the full suite row |
| Unpatched code against the new tests | 9 failed, as required |
| Each review gate branch disabled in turn | Its test failed, then passed on restore |
| Gate over the AI Systems research run | DeepSeek iterations 1-5 fail `findings_not_enumerated`, Luna 1-5 pass |
| Corpus replay, review, shipped rule | 110 of 926 claiming records rejected, 76 of them archived, newest June 2026 |
| Full runtime suite | PASS: 168 files, 2,821 passed, 8 skipped, exit 0. Baseline 164 files, 2,799 passed, 8 skipped, so 4 new files and 22 new tests with no failure |
| SC-002, the AI Systems research rerun | DeepSeek lineage rerun through cli-devin, merged with Luna at 80 findings and gap 0, closeout `synthesis_complete` at ledger sequence 4 |
| `validate.sh --strict` | `RESULT: PASSED`, 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **An existing review registry is never rebuilt from state.** The research merge now completes a registry that lacks findings its state names. The review merge rebuilds only when a lineage has no registry at all, so a review registry missing some `findingDetails` entries would still fail the closeout. This was true before this packet and is left for its own fix.
2. **The review agent's Markdown shape is not the shape the reducer parses.** `.skilled/agents/deep-review.md:212` asks for `N. **Title** -- file:line -- Description`, while `reduce-state.cjs:258-268` reads only `- **F001**:` bullets. Review findings still reach the reducer through `findingDetails` and delta rows, so nothing is lost, but Markdown alone never enumerates an agent-format review. This predates this packet and is left for its own fix.
3. **34 live review records from April to June 2026 would now fail.** They list findings in shapes no reducer reads. The gate only runs on new iterations, so these records are untouched.
<!-- /ANCHOR:limitations -->

---
