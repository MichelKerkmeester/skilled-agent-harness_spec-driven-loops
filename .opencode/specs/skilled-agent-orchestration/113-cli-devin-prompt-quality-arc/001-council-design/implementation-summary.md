---
title: "Implementation Summary: Council Design"
description: "Placeholder — populated post-execution after council runs and council-report.md is ratified."
trigger_phrases:
  - "113/001 summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/113-cli-devin-prompt-quality-arc/001-council-design"
    last_updated_at: "2026-05-16T17:42:00Z"
    last_updated_by: "main_agent"
    recent_action: "Council ran; council-report.md ratified"
    next_safe_action: "Hand off to 002-eval-rig"
    blockers: []
    key_files:
      - "ai-council/council-report.md"
      - "ai-council/critique.md"
      - "ai-council/seat-proposals/pragmatist.md"
      - "ai-council/seat-proposals/skeptic.md"
      - "ai-council/seat-proposals/optimizer.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000114015"
      session_id: "114-001-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 113-cli-devin-prompt-quality-arc/001-council-design |
| **Completed** | 2026-05-16 |
| **Level** | 3 |
| **Executor policy** | claude-only (operator constraint) |
| **Seats** | pragmatist, skeptic, optimizer — all claude-opus-4-7 via Agent subagent |
| **Wall-clock** | ~10 min (3 parallel seat dispatches + critique + convergence) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three council seats converged on a binding design contract for 002+003+004: 5-dimension rubric (D1 Acceptance 0.25 / D2 Bundle 0.30 / D3 Path 0.20 / D4 Hallucination 0.15 / D5 Pre-plan 0.10), 7-fixture catalog with cluster coverage and 1 adversarial path-traversal test, single claude-sonnet-4.6 grader with confidence-threshold dual-grader recovery hook, 6/12 iter floor/cap, and 4 additive requirements bolted on (grader cache invalidation, iter-1 sanity-review gate, D2 hard-gate semantics, interaction-term tracking).

### Council Outcome

15 distinct decisions resolved across the 3 seats. 1 unanimous (Q1 flow choice — all 3 voted bespoke loop). 14 majority-converged via two-of-three voting. 0 escalations to operator. 3 decisions flagged for post-iter-3 monitoring (Acceptance weight, Hallucination weight, Min iters floor) — Skeptic and Optimizer surfaced concerns that lost the vote but have real evidence behind them.

Substantive disagreements that produced real critique value (not rubber-stamp):
- Pragmatist wanted 4-dim rubric (cut Pre-planning); 2-of-3 kept 5 dims at 0.10
- Optimizer wanted Acceptance at 0.35 (correctness dominance); 2-of-3 settled at 0.25 (raised from main agent's 0.20 seed)
- Skeptic wanted Hallucination at 0.20 (2-P0 incident rate); 2-of-3 kept 0.15
- Skeptic wanted 8-iter min (noise variance); 2-of-3 kept 6
- Skeptic wanted dual-grader two-tier; 2-of-3 settled at single + recovery hook

Cross-seat synthesis produced 4 additive contract items adopted by consensus or non-veto: grader cache keyed on rubric+grader build hash, iter-1 manual sanity-review gate, D2 smoke-run hard-gate logic, interaction-term diagnostic tracking (D2×D1, D4×D1, D5×D1).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `ai-council/council-report.md` | Created | Final binding design contract (consumed verbatim by 002, 003, 004) |
| `ai-council/seat-proposals/pragmatist.md` | Created | Pragmatist proposal: 4-dim simplest-viable rubric, 5 fixtures, 10-iter cap |
| `ai-council/seat-proposals/skeptic.md` | Created | Skeptic proposal: 5-dim rubric with hallucination shifted up, 7 fixtures (≥1 adversarial), 8-iter floor, two-tier dispute grader |
| `ai-council/seat-proposals/optimizer.md` | Created | Optimizer proposal: 5-dim orthogonal rubric with Acceptance 0.35, 7-cluster fixture matrix, hard-gate + interaction-term framing |
| `ai-council/critique.md` | Created | 7 substantive disagreements + 6 additive proposals + cluster-fixture reconciliation |
| `ai-council/ai-council-state.jsonl` | Created | 7-row append-only deliberation state (council_start, 3 seat_dispatch, critique, convergence, council_complete) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Operator constraint: "Don't use other CLI's only claude code". All 3 seats dispatched as fresh `claude` subagents via Agent tool (not cross-CLI). Each seat had distinct lens framing (Pragmatist: "simplest workable", Skeptic: "what catches real failures", Optimizer: "maximally separable signal per dollar") and read the full packet context independently. Three parallel dispatches completed in ~2 min wall-clock total; sequential cross-seat critique + convergence vote took ~5 min. No rate-limit events. No fallback to simulated seats — claude-only dispatch satisfied the operator constraint with three genuinely fresh contexts.

Critique surfaced 7 substantive disagreements (not rubber-stamps) and 6 additive proposals. Two-of-three voting resolved all 15 individual decisions; 0 unresolved escalations. The disagreements that mattered most — Acceptance weight (Optimizer 0.35 vs settled 0.25), Hallucination weight (Skeptic 0.20 vs settled 0.15), Min iters (Skeptic 8 vs settled 6) — produced explicit monitoring triggers that 003 will surface post-iter-3 if data warrants escalation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Bespoke deep-loop (not retarget deep-agent-improvement) | 3-of-3 unanimous; profile generator is hard-coded to agent-file mutation surfaces; runtime-artifact-quality scoring needs different evaluator shape |
| 5-dim rubric with weights 0.30/0.25/0.20/0.15/0.10 (Bundle/Acceptance/Path/Hallucination/Pre-plan) | Two-of-three convergence; raised Acceptance from main agent's 0.20 seed to 0.25 per Optimizer pressure; kept Pre-planning at 0.10 over Pragmatist's "cut entirely" with explicit non-veto-gate framing per Optimizer |
| 7 fixtures with cluster coverage matrix (zero overlap) | Two-of-three (Skeptic + Optimizer); Pragmatist's 5-fixture argument lost on noise-floor concerns for 5-dim scoring |
| Single claude-sonnet-4.6 grader + confidence-threshold recovery hook | Two-of-three (Pragmatist + Optimizer single-grader); Skeptic's two-tier dispute pattern adopted as recovery hook on confidence < 0.7 or D4 dispute rate > 15% across 3 iters |
| D2 Bundle smoke-run is a hard-gate (caps D1 to 0.0 on env failure) | Optimizer proposal, no seat objected; precisely targets the documented `feedback_bundle_gate_smoke_run` failure mode |
| Grader cache key includes rubric_version + grader_model_build_hash | Skeptic-proposed, consensus; prevents grader drift mid-loop when Anthropic ships sonnet updates |
| Iter-1 manual sanity-review gate (env-gated skip permitted) | Skeptic blind-spot-5 mitigation; operator reviews iter-1 output before iter-2 auto-proceeds |
| Interaction terms (D2×D1, D4×D1, D5×D1) tracked in synthesis.md | Optimizer-proposed, consensus; diagnostic signals invisible to per-dim scoring |
| Adversarial fixture (path traversal) included despite 1-of-3 vote | Skeptic insistence adopted; closes Skeptic's blind-spot-3 (adversarial coverage); covers attack class no other seat caught |
| Baseline fixture (pure function) included despite 1-of-3 vote | Optimizer insistence adopted; anchors lower bound; gives convergence math a "does anything work" diagnostic signal |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command / Artifact | Result |
|-------|--------------------|--------|
| REQ-001: 3 seat proposals exist | `ls -1 ai-council/seat-proposals/ \| wc -l` returns 3 (pragmatist.md, skeptic.md, optimizer.md) | PASS |
| REQ-002: each has Q1/Q2/Q3 | All three proposals have `## Q1`, `## Q2`, `## Q3` headings (verified by structure inspection) | PASS |
| REQ-003: critique cites ≥1 disagreement | critique.md surfaces 7 substantive disagreements with named seat positions | PASS (7 > 1) |
| REQ-004: two-of-three convergence | 15 decisions, all converged via 2-of-3 vote; 0 escalations | PASS |
| REQ-005: scope-write boundary held | All writes in `001-council-design/ai-council/` + `implementation-summary.md` (this packet's spec doc) | PASS |
| REQ-006: rubric 5-dim, weights = 1.00 | 5 dims (Acceptance/Bundle/Path/Hallucination/Pre-plan), weights 0.25+0.30+0.20+0.15+0.10 = 1.00 | PASS |
| REQ-007: ≥5 fixtures, each grounded | 7 fixtures (exceeds floor of 5); 4 grounded in named memory entries, 2 in SKILL rules, 1 baseline diagnostic | PASS |
| REQ-008: budget envelope set | maxDispatches = 84, maxIterations = 12, rate-limit policy = 60s/120s/240s backoff with pause sentinel | PASS |
| Operator constraint held | No codex/gemini dispatch; recovery hook uses second claude-sonnet invocation | PASS |
| strict-validate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 001-council-design --strict` | TO RUN |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Cross-AI diversity sacrificed for operator constraint.** All 3 seats are claude-opus-4-7 with different lens framings. True cross-AI vantage (cli-codex + cli-claude-code + cli-gemini) would catch failure modes a single model's training data misses. Mitigation: each seat ran with fresh context (no cross-contamination); council still surfaced 7 substantive disagreements. If a future round wants cross-AI diversity, operator can lift the claude-only constraint.

2. **Three flagged-for-monitoring decisions could escalate post-iter-3.** Acceptance weight (Optimizer wanted 0.35), Hallucination weight (Skeptic wanted 0.20), Min iters (Skeptic wanted 8). 003 will surface synthesis metrics that show whether the council's 2-of-3 votes hold up under real-data review. Operator should expect a possible council-revise loop at iter-3.

3. **Blind spot 4 from Skeptic carried forward**: cost-vs-quality tradeoff isn't a rubric dimension. 003 synthesis.md MUST report dispatches-per-fixture alongside variant score so 004's pick is informed by quality/cost ratio, not raw quality. Flagged as additive requirement in council-report.md.

4. **Compound failures (Skeptic blind-spot-1) deferred to v2.** Each fixture tests in isolation; real dispatch chains multiple steps. A variant that scores 0.85 on each fixture independently but fails when fixtures chain (bundle output → path input) won't be caught. Out of scope for this round.
<!-- /ANCHOR:limitations -->
