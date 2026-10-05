---
title: "Implementation Summary: Gate 5 card pilot"
description: "The pre-registered rule permits rule cards at Gate 5: no large harm on prohibitions or Gate 5 misses, and 29% less rule text read per run. The operator held them back from the live router (ADR-003)."
trigger_phrases:
  - "gate 5 card pilot summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/008-gate5-card-pilot"
    last_updated_at: "2026-10-05T09:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Held the cards back from the live router (ADR-003)"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
      - "preregistration.md"
      - "results/decision.md"
      - "results/deviations.md"
      - "results/final-scores.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "repo-rule-advisor-2026-10-04"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Should Gate 5 load cards with the full file on demand? Yes by the pre-registered rule: no large harm on the primary or Gate 5 miss rate, and fewer rule bytes per run"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Gate 5 card pilot

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-gate5-card-pilot |
| **Completed** | 2026-10-05 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The tooling is built and the pilot is decided. `build-rule-cards.cjs` writes a card per rule, check 11 fails when a card drifts from its rule, and `experiment/arms.json` defines the two arms. No live `cards/` directory exists yet, since the arm environments generated their own.

### Phase 8: gate5-card-pilot

The plan comes from the verdict in `../002-rule-concision-and-loading/research/research.md`. Arm C, the resident reply-rule cards, did not fit: `AGENTS.md` at 26,778 bytes plus 7,677 bytes of cards is 34,455 bytes, above the 32,768-byte cap.

The pilot took 318 scored runs across four executor strata, 162 cards and 156 full, with no unscorable run. Rule 1 of `preregistration.md` §4 applies, because all three conditions hold on the pooled data:

- **Primary**, long replies breaking a prohibition: cards minus full -4.0 points, 95% Newcombe interval -15.5 to +7.6, upper bound below +15.
- **Co-primary**, Gate 5 miss rate: +2.2 points, -3.3 to +7.9, upper bound below +15.
- **Bytes**: 42,064 bytes of rule text per run for cards against 59,620 for full files, 29% less.

The 15-point margin rules out a large harm, not a small one. Two secondary signals need watching after adoption. Reply rules were missed 6.5 points more often under cards (-4.3 to +17.2). After a card, the model opened the full rule file in 55.9% of runs, which is why the byte saving is 29% and not the 80% the card sizes alone suggest.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md` | Created, then amended | Planning documents, amended for two arms in isolated environments |
| `build-rule-cards.cjs`, `check-repo-rules.cjs`, `test_build_rule_cards.py` | Created, modified | Generator, check 11 and its tests, committed in `edba53daeb` |
| `experiment/arms.json`, `experiment/prompts.json` | Created | Arm edits, the arm C drop record and 15 write-task prompts |
| `preregistration.md` | Created | Metrics, sample size, schedule and decision rule, committed in `3990bc9fa5` |
| `results/` | Created | Run index, scored rows without reply text, final scores, deviations and the decision, committed in `6ffe5e5514` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Planned with `/speckit:plan` in auto mode after a four-agent codebase exploration shared across phases 003 to 008. The generator and check 11 landed with their pytest suite before any scored run. The pre-registration landed in `3990bc9fa5` at 23:58:14 on 2026-10-04, and the first scored transcript started at 23:58:29. `rule-experiment.py score` produced `results/final-scores.txt`, and the decision rule was applied as written.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Phase order 003 to 008 | Measurement and gates land before any rule or loading change |
| Arm C dropped | REQ-005: the resident cards would push `AGENTS.md` past 32,768 bytes |
| Isolated environments instead of live blocks | Same as 007: the live rule files stay unchanged, and a winner goes live only after 007 decides |
| Adopt cards at Gate 5 | Rule 1 of the pre-registration: both upper bounds sit below +15 points and the cards arm reads fewer rule bytes |
| Deviation 1, SWE-2 Max and the Luna stop | Devin's quota blocked DeepSeek before any scored run. Luna stopped at 235 of 360 runs on a Codex usage limit and was not resumed. The arms stayed balanced at 115 full and 120 cards |
| Deviation 2, DeepSeek through OpenCode Go | Devin rate-limited SWE-2 Max after 23 scored runs. This returned the seat to the pre-registered model through another CLI |
| Deviation 3, schedule cut to a top-up | The full schedule would take most of a day under rate limits. A 30-run top-up replaced it, and the decision pools every stratum collected |
| Deviation 4, DeepSeek through Cline | The operator asked for the Cline provider as well. It ran the same 30-run top-up as its own pooled stratum |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Planning docs | `validate.sh specs/agents/016-repo-rule-advisor-surfacing --strict --recursive` returned RESULT: PASSED on 2026-10-04 |
| Generator and check 11 | `test_build_rule_cards.py` 4 passed on 2026-10-04 |
| Card router against the checker | On a scratch copy with the arm `cards` edits, check 2 failed and check 10 reported bullets=0, as expected |
| Pre-registration before the first scored run | `3990bc9fa5` committed 2026-10-04 23:58:14, earliest run transcript `rollout-2026-10-04T23-58-29` |
| Decision rule | `results/final-scores.txt`: primary -4.0 (-15.5 to +7.6), Gate 5 miss +2.2 (-3.3 to +7.9), bytes 42,064 against 59,620. Rule 1 applies |
| Rejected-arm artifacts | None to remove. The full arm is the current repository and arm C was dropped before anything was built. No live `cards/` directory, and `git status` was clean on 2026-10-05 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Cards held, not adopted.** Checks 2 and 10 accept card links (793e65ece5), but the router still loads full files. ADR-003 holds the cards because the saving is modest after fallback and the reply-rule signal leans against them. `build-rule-cards.cjs` rebuilds them on demand.
2. **Sample short of the pre-registered size.** Deviation 3 cut the schedule, so the arms hold 162 and 156 runs against 180 per arm per executor. AC-003 stays Unmet. The decision rule was applied to the data collected, as deviation 3 states.
3. **Small harms pass unseen.** The 15-point margin rules out a large harm only. The reply-rule miss rate leans against cards, and any later adoption should track it.
<!-- /ANCHOR:limitations -->

---
