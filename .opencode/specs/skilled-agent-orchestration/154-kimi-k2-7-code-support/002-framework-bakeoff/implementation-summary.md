---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "Status: DONE (interim, superseded by phase 004). Bakeoff 006 ran 30/30 real Kimi dispatches; verdict TIE - correctness saturated; RCAF retained as interim default. Phase 004 run 007 promoted COSTAR (empirical)."
trigger_phrases:
  - "kimi bakeoff status"
  - "framework bakeoff complete"
  - "run 006 tie saturated"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-kimi-k2-7-code-support/002-framework-bakeoff"
    last_updated_at: "2026-06-15T11:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Ran bakeoff 006; verdict TIE, RCAF retained"
    next_safe_action: "Phase 003 promotes the TIE finding into registry"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-profiles/kimi-k2.7-frameworks.json"
      - ".opencode/skills/sk-prompt-small-model/benchmarks/006-kimi-k2.7-prompt-framework/synthesis.md"
      - ".opencode/specs/skilled-agent-orchestration/154-kimi-k2-7-code-support/002-framework-bakeoff/improvement/model-benchmark-state.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-framework-bakeoff"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

> **SUPERSEDED BY PHASE 004 (run 007).** Run 006 documented here truly ran and truly returned a TIE; its easy fixtures saturated the correctness gate, so the result was inconclusive and could not name a best framework. The authoritative verdict is phase 004's run 007 on strict adversarial validators: **COSTAR promoted (primary), TIDD-EC fallback, RCAF retired**, status **empirical** — which is what the registry, `kimi-k2.7-code.md`, and `_index.md` now hold. Read the RCAF-retained finding below as the **interim/historical** outcome of this inconclusive run, not the packet's final state.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-framework-bakeoff |
| **Status** | DONE - bakeoff 006 ran; verdict TIE (correctness saturated) |
| **Created** | 2026-06-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

> **Status: DONE.** A full 5-framework prompt bakeoff for `kimi-for-coding/k2p7` ran through the deep-loop sweep engine and completed with 30/30 real Kimi dispatches. The verdict was a **TIE — correctness saturated**, captured in the run outputs and folded into the Phase 003 hand-off.

### Built: kimi-k2.7-code prompt-framework bakeoff

The phase created one bakeoff profile, `.opencode/skills/deep-loop-workflows/deep-improvement/assets/model_benchmark/benchmark-profiles/kimi-k2.7-frameworks.json`, cloned from `framework-bakeoff.json` and retargeted to a single model (`kimi-for-coding/k2p7`) across the full five-framework set (`rcaf`, `race`, `cidi`, `tidd-ec`, `costar`) over two T3 coding fixtures × 3 samples. The bakeoff then ran via the deep-loop **sweep** engine (run label `006-kimi-k2.7-prompt-framework`), producing a per-framework leaderboard and verdict under `benchmarks/006-kimi-k2.7-prompt-framework/`. A gpt-5.5 LLM-judge ran as a standalone secondary pass over Kimi's real generations for a subjective clarity tie-break.

**Result.** Every framework scored correctness 1.0 + format 1.0 on the deterministic oracle, so correctness could not rank them. The saturation guard fell to efficiency, where the top-pair margin (0.5 words) sat inside the noise floor (90% CI [-4.67, 5.17] overlaps zero). Verdict: **TIE**, with the engine prescribing "demote-to-smoke" for these fixtures. The secondary gpt-5.5 judge (subjective, not a correctness verdict) ranked cidi 0.989 ≈ costar 0.989 > tidd-ec 0.983 ≫ race 0.881 > rcaf 0.726; that judge misread some oracle-confirmed-correct code as buggy, a known LLM-judge failure mode. The verdict is the input Phase 003 promoted into the registry.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `kimi-k2.7-frameworks.json` | Created | Bakeoff profile: kimi-only model, five frameworks, real T3 fixtures, 5dim + correctness gate threshold 1.0 |
| `benchmarks/006-kimi-k2.7-prompt-framework/` (`aggregate.json`, `results.json`, `synthesis.md`) | Created | Authoritative sweep outputs: per-framework leaderboard + TIE verdict |
| `benchmarks/006-kimi-k2.7-prompt-framework/` (`llm-judge-board.json`, `llm-judge-results.json`, `llm-judge-synthesis.md`) | Created | Secondary gpt-5.5 clarity tie-break (subjective; not a correctness verdict) |
| `002-framework-bakeoff/improvement/` (`model-benchmark-state.jsonl`, `benchmark-run-pointer.json`) | Created | Run state + pointer recording the deterministic TIE and the judge top/bottom |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The bakeoff ran through the deep-loop **sweep** engine (`sweep-benchmark.cjs`), driven programmatically with the correct `registryPath` to sidestep a registry-path bug in the engine, with no engine edit (scope lock held). The sweep scored each framework × fixture cell through a deterministic code oracle behind a correctness gate (threshold 1.0); when correctness saturated, the engine fell to efficiency as the ranking key and reported the TIE inside the noise floor. A gpt-5.5 LLM-judge then ran as a standalone secondary pass over Kimi's real generations to give a subjective clarity ranking. Confidence comes from the leaderboard and the named discriminator (efficiency) in `synthesis.md`, mirroring how runs `003` and `004` reported their results.

**Machinery deviation (recorded honestly).** The plan named `--grader=llm`, but that flag is architecturally incompatible with the framework-bakeoff engine: `sweep-benchmark.cjs` scores via the deterministic oracle and has no LLM-judge hook, while the `--grader llm` path lives on a different engine (loop-host / `run-benchmark`) that does NOT sweep frameworks and does NOT dispatch the model-under-test. This was code-verified. Resolution was to run the real bakeoff via the sweep engine and run the gpt-5.5 judge as a separate secondary pass — a documented deviation, not a silent substitution.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Benchmark all five frameworks (`rcaf`, `race`, `cidi`, `tidd-ec`, `costar`) | Operator-confirmed full set; the kimi default RCAF must be tested against every alternative, not just spot-checked |
| Use a non-Kimi LLM judge (`openai/gpt-5.5`) | Avoids self-grading bias - a Kimi judge scoring Kimi candidates would not be trustworthy |
| Retarget fixtures to real T3 coding files | Pointing at fixtures that actually resolve kept the run from failing on missing inputs; the sweep engine reports the two it ran as `t3-lower-bound` / `t3-compare-versions` |
| Run via the sweep engine, not `--grader=llm` | The plan's `--grader=llm` flag does not exist on the framework-bakeoff engine (code-verified); the sweep scores via a deterministic oracle. Ran the real bakeoff on the sweep engine and the gpt-5.5 judge as a separate secondary pass |
| Drive `runSweep` programmatically with the right `registryPath` | A registry-path bug in `sweep-benchmark.cjs` blocked the normal path; driving it programmatically fixed the lookup without editing the engine, holding scope lock |
| Defer registry edits to Phase 003 | Kept this phase a clean read-only-generation benchmark; promotion is a separate, reversible step Phase 003 owns |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <002 folder> --strict` | PASS (exit 0; reconciled on close) |
| Run `006-kimi-k2.7-prompt-framework` writes `aggregate.json` / `results.json` / `synthesis.md` | PASS (all three present under `benchmarks/006-kimi-k2.7-prompt-framework/`) |
| Correctness gate did not silently saturate | PASS (saturation surfaced explicitly: `correctness_saturated: true`; engine fell to `efficiency` as the ranking key) |
| Verdict + per-framework leaderboard present in `synthesis.md` | PASS (verdict TIE inside the noise floor; 5-row leaderboard cidi > costar > race > rcaf > tidd-ec on efficiency) |
| 30/30 real `kimi-for-coding/k2p7` dispatches succeeded | PASS (no fallback used; all cells generated) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Verdict is a TIE, not a winner.** Correctness saturated across all five frameworks, so this run could not name an empirically-best framework for this model. The result was an interim finding (framework choice did not appear to affect correctness on these easy fixtures), not a ranking; RCAF was retained only as an interim default after this inconclusive run. Phase 004 superseded this with run 007 on strict validators (COSTAR promoted, RCAF retired, status empirical).
2. **Fixtures too easy to discriminate.** The two T3 coding fixtures were too easy for this strong model (engine action: "demote-to-smoke"). A sharper recommendation would need harder, less-saturating fixtures and ideally a correctness-anchored judge.
3. **Secondary judge is subjective.** The gpt-5.5 clarity ranking flagged some oracle-confirmed-correct code as buggy (a known LLM-judge failure mode), so it ranks perceived clarity, not correctness, and is not load-bearing for the verdict.
4. **No fallback pool.** `kimi-k2.7-code` has `fallback_target: null`; the run completed on the `kimi-for-coding` pool with no fallback needed, but a future re-run must defer rather than retry the same pool if it is exhausted.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
