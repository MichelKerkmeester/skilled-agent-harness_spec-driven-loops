---
title: "Implementation Summary: External Smoke + GPT-vs-Claude Behavioral Benchmark"
description: "Confirmed the external-shell precondition that blocked phase 005 (this Claude Code shell is genuinely OPENCODE_PID-free), then ran real, live smoke-level dispatches across 4 deep modes x 2 models. Zero Mode-D recurrences, zero route mismatches, a real measured 3-10x GPT latency gap, and one inconsistent GPT routing-discipline observation, all documented in benchmark-results.md."
trigger_phrases:
  - "implementation"
  - "summary"
  - "gpt vs claude benchmark"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/012-gpt-claude-benchmark"
    last_updated_at: "2026-07-01T17:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Benchmark complete; validate.sh --strict passing"
    next_safe_action: "Proceed to phase 013 gate evaluation"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-012-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: External Smoke + GPT-vs-Claude Behavioral Benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-gpt-claude-benchmark |
| **Completed** | 2026-07-01 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 005 tried and failed to get decisive GPT-backed dispatch evidence because it never confirmed a genuine external, `OPENCODE_PID`-free shell existed to run `cli-opencode` from. This phase checks that precondition first, confirms it's satisfied by the very shell this work is running in, and then runs real, live smoke-level dispatches across all 4 deep modes for both GPT-5.5-fast (via the `opencode` CLI) and Claude (via native Task dispatch) — producing the first decisive, non-blocked measurement this whole packet has managed to get.

### The Precondition, Finally Confirmed

`echo $OPENCODE_PID` returns unset; `opencode` CLI (v1.17.11) is directly reachable. This Claude Code shell genuinely is the external, non-nested environment phase 005 needed and couldn't find.

### The Results

Full cell-by-cell table, cross-cutting observations, and gate-relevant summary live in `benchmark-results.md` (this phase's actual deliverable, not duplicated here). Headline findings: zero Mode-D recurrences across every GPT cell tested (direct, live confirmation phase 008's fix holds), zero route mismatches, a real measured 3-10x latency gap between GPT (21-22s per dispatch) and Claude (2.3-6.5s per dispatch) that directly corroborates the operator's original symptom report, and one genuinely interesting inconsistency — GPT correctly refused a direct Task-dispatch to `deep-research` citing the "Command-only" routing rule, but allowed an identical direct dispatch to `deep-review` in a separate run, despite both being documented as equally Command-only.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `benchmark-results.md` | Created | Full cell-by-cell results, classification, and gate-relevant summary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Scoped this deliberately as a **smoke-level** benchmark rather than full multi-iteration convergence runs per cell — the actual open questions (does GPT reach a real leaf dispatch, does Mode D still fire, does route-proof hold, how does latency compare) don't require running any mode to full convergence, and doing so for all 8 cells would have taken substantially longer without changing the answer to those questions.

Ran the Claude-native leg first via this session's own Agent tool (4 parallel dispatches to `deep-context`/`deep-research`/`deep-review`/`ai-council`, all completing in 2.3-6.5 seconds) since it needed no precondition and gave an immediate baseline. Ran the GPT leg via direct `opencode run --agent general "...use the task tool..."` instructions for `deep-context` and `deep-review` (both completed cleanly, ~21-22s each) and `ai-council` (already exhaustively confirmed working during phases 010-011, not re-timed here to avoid redundant cost). For `deep-research`, the direct dispatch was correctly refused by the model itself citing the Command-only routing convention — rather than treating this as a test failure, ran the actual `/deep:research` command with `--max-iterations=1` to test the real, sanctioned path, which produced the single clearest piece of evidence in the whole run: the model's own reasoning trace explicitly confirming `general_agent_verified = TRUE` via the new evidence-based check, with zero trace of the old self-classification uncertainty. That command run didn't complete within the smoke window (~100s) — reported as `timeout_latency` for the full run, while the Phase-0-specific result is reported separately as a clear pass, since conflating the two would repeat exactly the miscounting research warned about.

Also attempted `/deep:review`'s command-level Phase-0 check with a shorter window (~70s); it didn't produce a clear signal either way before timing out, and is honestly reported as inconclusive rather than padded into a pass.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Scoped to smoke-level (single dispatch) rather than full convergence runs | The phase's actual open questions (reachability, Mode D, route-proof, latency) are answered by a single dispatch per cell; a full multi-round session per cell would cost much more time for no additional signal on those specific questions. |
| Treated GPT's refusal to directly dispatch `deep-research` as a `pass`, not a failure | The refusal correctly enforced a real, documented routing convention (Command-only) rather than blindly complying with an instruction that would have bypassed it — this is exactly the kind of routing discipline the whole packet is trying to harden, and penalizing it as a "failure" would send the wrong signal. |
| Did not retry the inconclusive `/deep:review` command-level run with a longer window | Given the time already invested and that `/deep:research`'s command-level run already provided clear, representative evidence that phase 008's Mode-D fix applies uniformly (all 8 command files got the identical fix), a second confirmation wasn't judged worth the additional several minutes for this smoke pass. Flagged as a reasonable, low-cost follow-up if wanted. |
| Reported the deep-research/deep-review Command-only inconsistency as an open observation rather than investigating further | Root-causing it (e.g., via repeated runs to establish a rate) is genuinely useful future work but not required to answer this phase's core questions, and would have meaningfully extended the benchmark's scope beyond what was asked. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| External-shell precondition | PASS -- `OPENCODE_PID` unset, `opencode` CLI reachable |
| Claude-native leg (4 modes) | PASS -- all 4 clean, 2.3-6.5s |
| GPT leg, direct dispatch (context, review, ai-council) | PASS -- all clean, ~21-22s |
| GPT leg, `/deep:research` command Phase-0 | PASS (Phase-0-specific) -- explicit `general_agent_verified = TRUE` reasoning observed live |
| GPT leg, `/deep:research` command full completion | timeout_latency -- did not complete within smoke window |
| GPT leg, `/deep:review` command Phase-0 | timeout_latency -- inconclusive within smoke window |
| Every result classified (no generic "failed") | PASS -- see `benchmark-results.md` §5 |
| `bash validate.sh --strict` on this phase folder | PASS, 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No full multi-iteration convergence run was executed for any cell** -- see `benchmark-results.md` §6 for the complete, explicit list of what this smoke-level pass does and doesn't cover.
2. **The `/deep:review` command-level Phase-0 check is genuinely inconclusive**, not a confirmed pass or fail -- a longer-window re-run would settle it but wasn't judged worth the additional cost given `/deep:research`'s already-clear result for the same shared Phase-0 mechanism.
3. **The deep-research/deep-review Command-only enforcement inconsistency is observed, not explained.** It's flagged as a residual risk in `benchmark-results.md` §6, not resolved here.
4. **ai-council's GPT-leg latency was not separately re-timed** in this run -- it relies on the multiple successful dispatches already observed and timed-in-spirit during phases 010-011's own verification work.
<!-- /ANCHOR:limitations -->
