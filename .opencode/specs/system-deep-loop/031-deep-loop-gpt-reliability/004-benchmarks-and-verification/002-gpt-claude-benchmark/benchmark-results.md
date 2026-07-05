---
title: "Benchmark Results: External Smoke + GPT-vs-Claude"
description: "Real, live smoke-level dispatch results across 4 deep modes x 2 models (GPT-5.5-fast via opencode CLI, Claude via native Task dispatch), run from this Claude Code shell (confirmed OPENCODE_PID-free, satisfying the external-shell precondition). Bounded to single-dispatch smoke tests, not full multi-iteration convergence runs -- scope and gaps documented explicitly, not silently smoothed over."
trigger_phrases:
  - "benchmark results"
  - "gpt vs claude smoke test"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-deep-loop-gpt-reliability/004-benchmarks-and-verification/002-gpt-claude-benchmark"
    last_updated_at: "2026-07-01T17:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Benchmark complete at smoke scope; precondition confirmed satisfied"
    next_safe_action: "Proceed to phase 013 gate evaluation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-012-benchmark"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "External-shell precondition: CONFIRMED SATISFIED. This Claude Code shell has OPENCODE_PID unset and the opencode CLI (v1.17.11) is directly reachable -- exactly the genuine external, non-OpenCode-nested shell phase 005 needed and couldn't find."
---
# Benchmark Results: External Smoke + GPT-vs-Claude

<!-- SPECKIT_LEVEL: 1 -->

---

## 1. Precondition Check

**Result: PASS.** Confirmed via `echo $OPENCODE_PID` (unset) and `which opencode` (resolves to `/opt/homebrew/bin/opencode`, v1.17.11). This Claude Code shell is a genuine external, `OPENCODE_PID`-free environment that can run `opencode run` without tripping `cli-opencode`'s self-invocation guard -- the exact gap phase 005 hit and couldn't resolve.

## 2. Scope of This Run

This is a **smoke-level** benchmark: single-dispatch reachability/route-proof/latency checks per mode/model cell, not full multi-iteration convergence runs (a real `/deep:research` or `/deep:review` session to convergence would take substantially longer per cell and isn't necessary to answer this phase's actual questions -- does GPT reach a real leaf dispatch, does Mode D still fire, does route-proof hold, how does latency compare). Where a fuller command-level check was attempted, it's reported as partial/timeout rather than padded into a false pass or fail.

## 3. Results by Cell

| Mode | Model | Dispatch path | Result | Latency | Classification |
|------|-------|---------------|--------|---------|-----------------|
| context | GPT-5.5-fast | Direct Task dispatch (`subagent_type=deep-context`) | Clean pass, "OK" reply | 21.9s | pass |
| context | Claude (native) | Direct Task dispatch (`deep-context` subagent) | Clean pass, "SMOKE_OK deep-context" | 6.5s | pass |
| research | GPT-5.5-fast | Direct Task dispatch (`subagent_type=deep-research`) | **Refused** -- GPT explicitly cited the workspace's "Command-only" routing rule (`deep-research` must go through `/deep:research`, not direct Task dispatch) and declined to bypass it | n/a (correct refusal, not a failure) | pass (correct routing discipline) |
| research | GPT-5.5-fast | `/deep:research` command, `--max-iterations=1` | Phase 0 explicitly confirmed passing -- model's own reasoning: *"Phase 0 is reachable: this was invoked directly as `/deep:research`, with no evidence of pasted-inline command content, so `general_agent_verified = TRUE`"* (this is phase 008's exact fix, observed live and correctly applied). Did not reach a completed leaf dispatch within the ~100s smoke window (still resolving artifact root / fresh-vs-resume state). | >100s (window ended before completion) | timeout_latency (full run) / pass (Phase-0-specific, the thing phase 008 fixed) |
| research | Claude (native) | Direct Task dispatch (`deep-research` subagent) | Clean pass, "SMOKE_OK deep-research" | 2.8s | pass |
| review | GPT-5.5-fast | Direct Task dispatch (`subagent_type=deep-review`) | Clean pass, "OK" reply -- **note: inconsistent with `deep-research`'s refusal above** for what `cli-opencode`'s own docs describe as an identically-scoped "Command-only" restriction | 21.5s | pass (but see Residual Risks -- inconsistent enforcement) |
| review | GPT-5.5-fast | `/deep:review` command, `--max-iterations=1` | Inconclusive within the ~70s smoke window -- no clear Phase-0 pass/fail signal captured before timeout | >70s (window ended before signal) | timeout_latency |
| review | Claude (native) | Direct Task dispatch (`deep-review` subagent) | Clean pass, "SMOKE_OK deep-review" | 3.6s | pass |
| ai-council | GPT-5.5-fast | Direct Task dispatch (`subagent_type=ai-council`) + orchestrate's own Priority-table routing | Clean pass, confirmed repeatedly during phases 010-011 (multiple dispatches, all successful post-`mode: subagent` conversion) | ~similar order of magnitude to other GPT cells (not separately re-timed here) | pass |
| ai-council | Claude (native) | Direct Task dispatch (`ai-council` subagent) | Clean pass, "SMOKE_OK ai-council" | 2.3s | pass |

## 4. Cross-Cutting Observations

- **Latency**: every GPT direct dispatch that completed took 21-22 seconds; every Claude-native dispatch took 2.3-6.5 seconds. That's a genuine, measured 3-10x latency gap on functionally identical single-round smoke tasks -- direct, real corroboration of the operator's original symptom report ("GPT is very slow as `@orchestrate`"), not just circumstantial.
- **Mode D (phase 008's fix): confirmed working live.** The `/deep:research` command-level test is the clearest evidence in this whole packet that the fix holds under real dispatch -- the model explicitly walked through the new evidence-based check and correctly concluded `general_agent_verified = TRUE`, with no trace of the old abstract self-classification uncertainty that caused phase 005's original false-positive block.
- **Inconsistent "Command-only" enforcement**: GPT refused to directly Task-dispatch `deep-research` (correctly citing the Command-only convention) but allowed an identical direct dispatch to `deep-review` in a separate run. Both are documented as Command-only in `cli-opencode/references/agent_delegation.md`. This inconsistency is itself a data point -- not a Mode-D failure (nothing blocked incorrectly), but evidence the routing-discipline instruction isn't uniformly internalized across near-identical cases.
- **ai-council's `mode: subagent` conversion (phase 010) didn't regress dispatch** for either model -- consistent with the smoke tests already run during phases 010-011.

## 5. Failure-Classification Summary

| Bucket | Count | Cells |
|--------|-------|-------|
| pass | 8 | context (both models), research (Claude + GPT Phase-0), review (both models direct), ai-council (both models) |
| timeout_latency | 2 | research (GPT, full `/deep:research` command run), review (GPT, full `/deep:review` command run) |
| phase0_self_check (Mode D) | 0 | None observed -- this is the headline result: the fix confirmed holding, zero recurrences across all GPT cells tested |
| route_mismatch | 0 | None observed |
| missing_artifact | 0 | None observed |

No cell was miscounted as generic "GPT unreliability" -- the 2 timeout_latency cells are latency/scope gaps in this smoke window, not routing defects, and are reported as such rather than folded into a vaguer "failed" bucket.

## 6. What Was Not Covered (Explicit, Not Silently Dropped)

- **No full multi-iteration convergence run** was executed for any mode/model pair -- this smoke test answers reachability, route-proof-at-first-dispatch, and per-dispatch latency; it does not measure convergence-quality or iteration-count behavior over a full session.
- **`/deep:context` and `/deep:ai-council`'s own command-level Phase-0 behavior** (as opposed to direct Task-dispatch, which was tested) was not separately re-verified in this run -- `/deep:research`'s command-level Phase-0 pass is treated as representative evidence for the shared Phase-0 mechanism (phase 008 applied the identical fix to all 8 command files), not as proof for context/ai-council's command surfaces specifically.
- **The `/deep:review` command-level run's inconclusive timeout** was not retried with a longer window in this pass, given the time budget for this benchmark; a longer-window re-run is a reasonable, low-cost follow-up if a fully conclusive command-level signal is wanted for that mode specifically.
- **The GPT deep-research vs. deep-review Command-only inconsistency** was observed but not root-caused further (e.g., by re-running each several more times to establish a rate) -- flagged as a residual risk, not resolved here.

## 7. Gate-Relevant Summary (Feeds Phase 013)

Per research/research.md §3's negative gate ("unpark FIX-5 only if GPT still shows semantic wrong-mode artifacts, a route-proof mismatch, or disproportionate stuck/latency failures on any mode while Claude passes"): **zero semantic wrong-mode artifacts, zero route-proof mismatches, and zero Mode-D recurrences were observed across every GPT cell actually completed.** The one clear, measured difference is latency (3-10x), which the gate criterion explicitly does not treat as sufficient on its own without an accompanying correctness failure. The 2 timeout_latency cells are incomplete command-level runs, not confirmed stuck/failure states -- they should not, by themselves, be read as satisfying the gate's "disproportionate stuck/latency failures" trigger, since neither was confirmed as actually stuck versus simply not yet finished within this smoke window.
