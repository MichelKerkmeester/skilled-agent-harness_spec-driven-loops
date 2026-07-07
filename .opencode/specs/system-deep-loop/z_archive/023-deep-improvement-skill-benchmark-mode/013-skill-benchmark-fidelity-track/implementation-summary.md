---
title: "Implementation Summary: Skill-Benchmark D3/D4 Fidelity Track (planned)"
description: "Build record for the fidelity-track phase: D4-R task-outcome instrument + deferred-asset lane + intent-synonym reconciliation. Planned from the 011 round-2 gpt-5.5 research; implementation pending, sequenced cheap-and-safe before the paid D4-R live runs."
trigger_phrases:
  - "skill-benchmark fidelity track summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/023-deep-improvement-skill-benchmark-mode/013-skill-benchmark-fidelity-track"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Complete: Phases 1-3 shipped; D4-R measured 54/100 (n=5); suite 295 green; strict-clean"
    next_safe_action: "Awaiting commit decision; optional follow-on D3 work motivated by the D4-R noise finding"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs"
      - ".opencode/skills/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs"
      - ".opencode/skills/sk-code/benchmark/d4r-live/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-benchmark-fidelity-track"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Skill-Benchmark D3/D4 Fidelity Track (planned)

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete — Phases 1–3 shipped + verified; D4-R measured (n=5) |
| **Date** | 2026-06-02 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Fidelity-first build, three phases, all shipped.

**Phase 1 — intent synonyms (real recall fix):** added distinctive real-phrasing synonyms — `MOTION_DEV` gains `in-view`/`motion cdn`, `IMPLEMENTATION` gains `smooth-scroll`/`intersectionobserver` — so the router recognizes realistic CS-001/SD-001 wording. SD-001 D2 0.455→0.636 and CS-001 D2 0.200→0.500 (CS-001 D3 also 0.286→0.417), with zero D2 regressions across all 24 scenarios. The D2-for-D3 trade is small and conscious (agg D2 44→47, D3 33→32).

**Phase 2 — asset lane + D4-R harness (deterministic):** `expectedAssets` is now scored on its own `assetRecall` lane (live: recall vs stated assets; router: deferred + visible), and `live-executor.parseLiveResult` un-merges assets from `observedResources` so a stated, useful asset no longer reads as D3 waste. The D4-R task-outcome instrument (a no-write "patch plan + verification" dispatch, graded by a new task-outcome rubric reusing the grader harness) is integrated into the orchestrator behind an opt-in `--d4` flag and reported as a separate advisory `D4_task_outcome` — never collapsed with `D4_hallucination`. All additive (report schema v1 preserved).

**Phase 3 — D4-R measured (paid live, n=5):** ran the task-outcome ablation on LS-001/002/003/004 + SD-002 with gpt-5.5-fast (skill on/off) graded by claude-sonnet. Result: **D4_task_outcome aggregate 54/100**, replacing the meaningless hallucination-proxy 49. Per scenario: LS-001 0.685 (on .72/off .35), LS-004 0.61 (.44/.22), LS-003 0.55 (.80/.70), LS-002 0.435 (.72/.85), SD-002 0.41 (.27/.45). The finding: **the skill helps most where the base model is weak and can hurt where it is already strong** (over-routing noise) — the n=2 round-1 hypothesis confirmed at n=5 with a real instrument. Base-live on the 5 was strong (agg 88, D2 100, D3 60); `assetRecall` 90.

### Files Changed (this build)
`sk-code/references/smart_routing.md` (§11 INTENT_SIGNALS + §2 table — synonyms; `router-replay.cjs` parses §11 directly). `scripts/skill-benchmark/live-executor.cjs` (separate `observedAssets` channel), `score-skill-benchmark.cjs` (`assetRecall` lane + advisory aggregates), `d4-ablation.cjs` (`buildTaskOutcomePrompt`/`gradeTaskOutcome`/`runD4RAblation`), `run-skill-benchmark.cjs` (opt-in `--d4` → `augmentWithD4R`), `build-report.cjs` (advisory-signals section), `scripts/skill-benchmark/tests/playbook-mode.vitest.ts` (+5 tests, 1 updated), new `scripts/model-benchmark/scorer/grader/prompts/system-grader-task-outcome.md`. Live result artifact: `sk-code/benchmark/d4r-live/`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Spec + plan + tasks + checklist authored from the converged-enough 011 round-2 research (5 gpt-5.5 iterations; did not fully converge — newInfoRatio 0.48 at the planned stop). The build is sequenced so the cheap, deterministic, no-cost work (synonyms, asset lane, mock-grader tests) lands and is verified before the paid D4-R live ablation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Synonyms, not prompt-doctoring.** The realistic per-feature wording stays; the router learns to recognize it — a real recall gain, not an artifact lift.
- **Two D4 numbers, never collapsed.** `D4_hallucination` and `D4_task_outcome` measure different things and ship as separate fields.
- **Asset lane, not asset-into-D3.** The router intentionally defers assets; they get their own `assetRecall` signal rather than punishing a deliberate design inside D3.
- **Additive schema only.** All report changes preserve `skill-benchmark-report.v1`; absent D4-R data renders `unscored`, never fabricated.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| Deterministic suite | `cd .opencode/skills/deep-improvement/scripts && npx vitest run` | PASS — 295/295 green (24 files; +5 new). Prior "251" was a stale pre-compaction baseline; true baseline 290. |
| Drift guard | `npx vitest run skill-benchmark/tests/sk-code-router-sync.vitest.ts` | PASS — 4/4 green |
| Synonym D2 floors | `node scripts/skill-benchmark/run-skill-benchmark.cjs --skill sk-code --trace-mode router` | PASS — SD-001 D2 0.455→0.636, CS-001 0.200→0.500; 0 regressions/24; agg D2 44→47, D3 33→32 |
| D4-R live ablation | `… --trace-mode live --d4 --scenarios LS-001,LS-002,LS-003,LS-004,SD-002 --grader-mode real` | PASS — D4_task_outcome **54/100** (n=5); base-live agg 88, D2 100, D3 60; assetRecall 90. Artifact: `sk-code/benchmark/d4r-live/` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The D4-R task-outcome grader is itself an LLM judge (claude-sonnet); per-axis sub-scores + raw grader objects are kept for audit, and it is reported as a separate advisory number, never folded into the weighted aggregate.
- Skill-off remains an *approximation* (hook disabled + preamble + contamination guard); attribution stays `approximate`. The on/off responses are truncated to 2000 chars by `parseLiveResult`, so a very long patch plan is graded on its head.
- n=5 is directional, not a stable point estimate. The task-dependent pattern (helps weak-baseline tasks, hurts strong-baseline ones) is the durable finding; the aggregate 54 will move with the scenario mix. SD-002/LS-002 "skill hurt" is a real over-routing-noise signal, not a grader error.
- The live observed-cost D3 gap (broad-glob reads) is explicitly out of scope here — a larger separate instrument noted in 011 §14.3.
<!-- /ANCHOR:limitations -->
