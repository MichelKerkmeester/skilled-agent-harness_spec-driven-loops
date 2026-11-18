---
title: "Implementation Summary"
description: "Measured in worktree 474, not committed: the calibration bench counts floored top-1 passes and scores nine follow-up pairs; the decision rule closed the phase without a guard (over-suppresses)."
trigger_phrases:
  - "follow-up routing benchmark implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/003-follow-up-routing-benchmark"
    last_updated_at: "2026-11-18T12:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Bench measured; rule applied"
    next_safe_action: "Operator decides on stored route receipts"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "db37536c-37e4-472c-8a05-521b8fec328d"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-follow-up-routing-benchmark |
| **Completed** | 2026-11-18. Measured in worktree 474, not committed. Closed without a guard |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Phase 3: follow-up-routing-benchmark

The calibration bench now reports how often the confidence floor alone decides a top-1 pass on the labeled corpus, and scores nine session-task and follow-up pairs. Weak follow-ups do route away from their session task, but the guard that would stop them would also hide 19 correct corpus routes, so the rule closed the phase without it. The flag pass-through and the guard were not built.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/bench/scorer-calibration.bench.ts` | Modify | Floored-pass counts and the `C` row ids on the `advisor-scorer-calibration` line; the `FOLLOW_UP_PAIRS` constant; `logFollowUpRouting`, which prints the `advisor-follow-up-routing` line. No new assertion |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The conductor confirmed phases 002 and 004 had no open task and ran the bench once before any edit. Three GPT-6 Luna `xhigh` `fast` briefs then edited the bench in series: the floored counts, the pairs, and the follow-up scoring. The conductor diffed each edit against its brief, ran the typecheck and the bench, and applied the rule. Ship-only tasks T009 to T014 were skipped, as the rule directs.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Measure inside the existing calibration bench, with the pairs inline | The bench already scores every corpus row with `scoreAdvisorPrompt`, and inline pairs move no pinned corpus hash |
| Build the flag pass-through only on a ship decision | The bench reads the flag from the scorer directly. Only the guard needs the flag in the public output |
| Count collateral `C` as well as harm `H` | The planning probe shows a complete refactor task meets the same guard condition as "fix that too" |
| Decision rule outcome: over-suppresses | `N` = 9, `H` = 5, so `H >= ceil(N / 2)` holds; `C` = 19, so `C = 0` fails. The phase closes with the guard not built, and the deferral condition for stored route receipts is met. That build needs an operator decision; this phase does not start it |
| `BENCH` runs with `--reporter=verbose` | The default reporter does not print a passing test's console output, so the `advisor-scorer-calibration` and `advisor-follow-up-routing` lines only appear with this flag |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Floor flag on the planning probes | Run during planning on 2026-11-18: "fix that too" and the refactor task both route `sk-code` at 0.82 with the flag set, and the public CLI output has no such field |
| T001 phases 002 and 004 done | `grep -c '^- \[ \] T[0-9]'` prints `:0` for both `tasks.md` files |
| T002 baseline bench | Exit 0, 1 of 1; `advisor-scorer-calibration` Brier 0.214279, ECE 0.136108, deltas inside tolerance |
| Typecheck | `npm run typecheck` exit 0 after the three edits |
| T003 floored counts | Floored top-1 passes: 29 correct, 11 wrong, 27 on work-intent text, 19 of those correct |
| `C` rows (19) | rr-iter2-008, rr-iter2-028, rr-iter2-032, rr-iter2-034, rr-iter2-041, rr-iter3-073, rr-iter3-075, rr-iter3-078, rr-iter3-079, rr-iter3-081, rr-iter3-090, rr-iter3-130, rr-iter3-131, rr-iter3-133, rr-iter3-141, rr-iter3-147, rr-iter3-170, rr-iter3-179, rr-paste-208 |
| T005 follow-up line | `N` 9, `H` 5, `Hsame` 2. Guarded and routed away: pair 1 (`sk-doc` to `sk-code`), 3 (`system-spec-kit` to `cli-external-orchestration`), 5 (`mcp-tooling` to `sk-code`), 6 (`system-deep-loop` to `sk-code`), 9 (`sk-doc` to `sk-code`). Guarded but same top-1: pairs 7 and 8. Negative controls: pair 2 not floored (`length_and_token_threshold`), pair 4 no top-1 (`below_prompt_policy_threshold`). Pair 9 scores the same as pair 1, so the pasted-reply strip runs before the policy call |
| T006 pinned values | `scorer-calibration-baseline.json` is byte-identical to phase 002's recapture; `git diff --stat -- lib/metrics.ts` prints nothing |
| T007 comment hygiene | `rg` printed nothing |
| `npx vitest run tests/hooks tests/parity` | Exit 0, 235 of 235 |
| Refutation pass (Luna `xhigh`, read-only) | One finding, confirmed and kept as a sensitivity note: today's live hook reads the policy reason from the raw prompt, where pair 9 gives `explicit_skill_or_governance_marker` (checked through `dist/`; the stripped text gives `work_intent_with_meaningful_tokens`). The frozen rule and the planned guard both read the stripped text, so the outcome stands. On raw text `H` would be 4 and `C` 18 (`rr-paste-208` drops out), which takes the no-guard branch; neither branch ships a guard. The other attacks failed: the top-1 is the first passing recommendation, `confidenceFloored` is set only when a floor raised the value, and a gold `none` row cannot enter `C` |
| Drift guards | `run-all-drift-guards.sh` exits 1 on 11 errors, all in unrelated spec probe scripts and `.vibe` fixtures; primary `main` fails the same way |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The pairs are a small hand-written set.** Nine pairs show direction, not a rate. The decision rule and the list were fixed before the first run so the result could not reshape them.
2. **The outcome sits on the bar.** `H` is exactly 5 and pair 9 is one of the five. Read on raw text instead of stripped text, `H` is 4 and the rule takes the no-guard branch. Either way no guard ships; only the deferral flag for stored route receipts differs.
3. **Weak follow-ups still route away from their session task.** Five of nine pairs do. Fixing it without hiding correct routes needs session state, such as stored route receipts, which the operator has to approve first.
<!-- /ANCHOR:limitations -->

---
