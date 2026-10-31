---
title: "Implementation Summary"
description: "The three unproven Jev features now share one keep rule, the folder suggestion keep did not survive a masked-state ablation, and the clarify census measured the real clarify rate."
trigger_phrases:
  - "unproven feature proof implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/052-unproven-feature-proof"
    last_updated_at: "2026-10-05T07:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Aligned three keep rules, ran the masked-state ablation and the clarify census"
    next_safe_action: "None; phase complete. Next proof steps are in plan.md section 8"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-052-unproven-feature-proof"
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
| **Spec Folder** | 052-unproven-feature-proof |
| **Completed** | 2026-10-05 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The three unproven Jev features now face one keep rule, and the folder suggestion feature has its decisive experiment on record: once the session state stops copying the options' own words, Jev no longer beats the comparator. Spec-track narrowing and clarify default each have a written proof plan with a power target, and the clarify census now counts the real clarify rate from local transcripts.

### One keep rule across three scorers

`scorer-report.mjs` gained the exact kill tail (`.skilled/skills/cli-classifier/shared/scripts/scorer-report.mjs:289`), the strongest-policy bar (`.skilled/skills/cli-classifier/shared/scripts/scorer-report.mjs:331`), the per-class floor (`.skilled/skills/cli-classifier/shared/scripts/scorer-report.mjs:343`) and a sign-test power line (`.skilled/skills/cli-classifier/shared/scripts/scorer-report.mjs:481`). Each scorer now decides in the order coverage, kill, margin, sign test, strongest policy, class floor, flips, keep: spec-track narrowing at `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:922`, which also gained the kill branch it lacked, clarify default at `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:880` and folder suggestion at `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:830`. A registry guard keeps `jev-features.mjs` at the four proven features (`.skilled/skills/cli-classifier/shared/scripts/tests/jev-features.test.mjs:62`).

### Masked-state ablation

`maskState` drops the lead sentence that names the session, every sentence copied from an option description, and every folder name and slug (`.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:1038`). `--arm masked-state` runs only the Jev gate and that arm (`.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:1892`).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scorer-report.mjs` and `tests/scorer-report.test.mjs` | Modified | Shared gates, power helpers and report lines |
| `tests/jev-features.test.mjs` | Modified | Registry guard |
| `score-track-narrowing.mjs` and its vitest file | Modified | Kill branch and both gates |
| `score-clarify-default.cjs` and its test file | Modified | Both gates and the Codex mirror-line fix in the census |
| `score-alignment-suggestion.ts` and its vitest file | Modified | Both gates and the masked-state arm |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash max on cli-pi wrote every code change from short briefs, kit first, then the three scorers in parallel. The orchestrator read each diff, reran each suite and removed every new gate in place one at a time: each removal failed at least one test, and the files were restored byte for byte. The power helper first scanned every pair count with a fresh exact search, so a win rate near 0.5 would hang a report. A second brief made the scan incremental and bounded before any scorer used it. Luna 6 max then reviewed the diff read-only, and three more DeepSeek briefs fixed its findings.

The masked-state rule was written into `plan.md` before the run, and a zero-call preview on the 40 rows confirmed it removes every verbatim copy of a label description: 8 sat in the lead sentence and 15 in later sentences. The live run then made 121 calls.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Relative bars, not absolute floors | The operator chose them: the model must beat the strongest simple policy and hold the baseline in every class, with no invented accuracy number |
| An absent gate result skips its gate | Existing unit calls keep working, while every production call passes both results |
| Count every simple policy on the measured rows | A counts measured rows only, so a bar counted on all rows could stop a column for rows the model never answered |
| Retire the folder suggestion question shape on this fixture | The masked run stopped on margin, and the rule fixed before the run says a stop retires it |
| Fix the census mirror lines in the scorer | Codex logs record most tool outputs twice, which nearly doubled every census count |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Kit tests | PASS. 81 (baseline 68) |
| Spec-track narrowing and folder suggestion vitest | PASS. 95 (baseline 79) |
| Clarify default and leaf route | PASS. 64 (baseline 58) |
| Every other suite | PASS, equal to baseline. Model benchmark failed 1 of 273 once under the full parallel run, then passed 273 in four standalone runs; no file under it changed, and the flaky test was not captured |
| Gate mutations | PASS. Removing the 017 kill, each strongest gate, each floor gate, the lead mask or the 022 gate wiring fails at least one test |
| Luna 6 max read-only review | No P0. Two P1 and three P2 fixed: policy bars now count measured rows only, 022 tails are exact BigInt, an unpunctuated lead masks fully, `pairsForPower` honours a target below alpha, and call-site tests cover both gates. One P2 declined: the worst power scan, at a 0.501 win rate, takes 2.1 seconds at the 20,000 cap |
| Live masked-state run | `verdict jev: stop (margin) K=40 M=40 A=29 B=30 W=8 L=9 F=4 p=0.6855`, 121 calls, no state text in any output |
| Clarify census | Claude Code: `real clarify rate: 6/315`. Codex after the mirror fix: `real clarify rate: 41/773` with `mirror_lines_skipped=979`, against 77 of 1,313 before the fix |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The masked run used the same 40 synthetic rows.** Their states were written from each folder's own spec, so the result retires this fixture's question shape, not every future folder suggestion design.
2. **Clarify default needs months of shadow data.** About 47 real clarifications came in from July to early October, roughly 15 a month. At a 0.65 win rate the sign test needs 69 discordant pairs, so collection takes at least 4.6 months even if every clarification were discordant.
3. **Spec-track narrowing still needs labels nobody has gathered.** Its plan needs 205 decided pairs at the repeat's 0.588 win rate.
<!-- /ANCHOR:limitations -->

---


