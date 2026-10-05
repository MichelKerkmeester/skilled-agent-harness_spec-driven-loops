---
title: "Implementation Summary: Table wording experiment"
description: "Decided, adoption pending. The pre-registered rule adopts the short no-table wording: once communication.md was read, neither wording produced a table in 216 long replies. The wording goes live after the 006 window is measured."
trigger_phrases:
  - "table wording experiment summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/007-table-wording-experiment"
    last_updated_at: "2026-10-05T09:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Decided by rule 2: adopt the short wording (6ffe5e5514)"
    next_safe_action: "Commit the short wording with its ledger entry after the 006 window (T010)"
    blockers:
      - "Live adoption waits on the 006 post-change window measurement"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "preregistration.md"
      - "results/decision.md"
      - "results/deviations.md"
      - "results/final-scores.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "repo-rule-advisor-2026-10-04"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Does the short wording lower the table rate? No measurable difference. Both arms are 0 of 108 once the rule is read, so rule 2 adopts the shorter text"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Table wording experiment

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-table-wording-experiment |
| **Completed** | Decided 2026-10-05, adoption pending |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The experiment ran and is decided. It compared the current table block in `communication.md` with a 152-byte imperative in isolated test environments, so the live rule files stayed unchanged and the 006 window stayed clean.

### Phase 7: table-wording-experiment

Two arms built by `rule-experiment.py` from commit `edba53daeb` took 625 scored runs across five executor strata, arm-balanced by the seed-16 order, with no unscorable run. Rule 2 of `preregistration.md` §4 applies: the short arm minus the current arm is +0.0 points, 95% Newcombe interval -3.4 to +3.4, so the short wording is no worse and 460 bytes smaller. Both arms were 0 of 108 long replies with a table once `communication.md` had been read. Every table in the intention-to-treat rates (15.8% and 21.0%) came from a run that never read the rule, so delivery decides the table rate, not wording. Phase 009 takes up delivery.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md` | Created, then amended | Planning documents, amended for isolated environments |
| `preregistration.md` | Created | Metric, sample, schedule and decision rule, committed in `edba53daeb` |
| `experiment/arms.json`, `experiment/prompts.json` | Created | The two arms and the 30 prompts |
| `results/` | Created | Run index, scored rows without reply text, final scores, deviations and the decision, committed in `6ffe5e5514` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Planned with `/speckit:plan` in auto mode after a four-agent codebase exploration shared across phases 003 to 008. The pre-registration landed in `edba53daeb` at 23:39:41 on 2026-10-04, and the first scored transcript started at 23:39:55. A 16-run pilot, excluded from the result, set the run counts. `rule-experiment.py score` produced `results/final-scores.txt`, and the decision rule was applied as written.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Phase order 003 to 008 | Measurement and gates land before any rule or loading change |
| Isolated environments instead of live blocks | The operator asked to run now. Environments leave the live rule files unchanged, so the 006 window and the experiment no longer compete |
| Adopt the short wording | Rule 2 of the pre-registration: the upper bound of d is +3.4, below +5. Rule 1 does not apply because the interval includes 0 |
| Deviation 1, SWE-2 Max as second executor | Devin's daily quota blocked DeepSeek after 5 scored runs. Recorded before any SWE-2 run |
| Deviation 2, DeepSeek through OpenCode Go | Devin rate-limited SWE-2 Max after 171 scored runs. This returned the seat to the pre-registered model through another CLI |
| Deviation 3, schedule cut to a top-up | The full schedule would take most of a day under rate limits. A 60-run top-up replaced it, and the decision pools every stratum collected |
| Deviation 4, DeepSeek through Cline | The operator asked for the Cline provider as well. It ran the same 60-run top-up as its own pooled stratum |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Pre-registration before the first scored run | `edba53daeb` committed 2026-10-04 23:39:41, earliest run transcript `rollout-2026-10-04T23-39-55` |
| Live rule files unchanged | `git log edba53daeb..6ffe5e5514` on `communication.md`, `AGENTS.md`, `REPO RULES.md` and `.skilled/repo-rules/` lists no commit |
| Sample size | 309 current and 316 short runs against 300 per arm. Delivered long replies were 108 per arm, short of the roughly 190 the pilot projected |
| Decision rule | `results/final-scores.txt`: short minus current +0.0 points, -3.4 to +3.4. Rule 2 applies |
| Drift control | Semicolons in 70.0% and 68.8% of long replies, level across the arms |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Adoption pending.** REQ-004 and T010 stay open until the 006 post-change window is measured. The short wording then lands with its ledger entry.
2. **Fewer delivered replies than planned.** 108 per arm read the rule, against about 190 projected, because delivery ran near 35%. The interval still sits inside the +5 margin.
3. **Fixture, not live use.** The result covers five executor strata on a fixture project. Phase 009 measures live delivery.
<!-- /ANCHOR:limitations -->

---
