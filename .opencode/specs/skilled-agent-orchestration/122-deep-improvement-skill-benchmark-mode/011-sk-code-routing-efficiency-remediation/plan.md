---
title: "Plan: sk-code Routing-Efficiency and Usefulness Remediation"
description: "Research plan and candidate remediation hypotheses for sk-code over-routing (D3) and task-dependent usefulness (D4), to be investigated by a 5-iteration MiniMax deep-research pass before any router change."
trigger_phrases:
  - "sk-code remediation plan"
  - "surface-slice research plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/011-sk-code-routing-efficiency-remediation"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Drafted research plan + candidate remediation hypotheses"
    next_safe_action: "Run the 5-iteration MiniMax deep-research loop"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-routing-efficiency-remediation"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Plan: sk-code Routing-Efficiency and Usefulness Remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:approach -->
## 1. APPROACH

Research first, change second. A 5-iteration deep-research pass investigates how to tighten sk-code's resource loading before any router edit. The research consumes the live benchmark evidence and the documented surface-flattening tradeoff, then recommends one approach with a recall-vs-efficiency frontier and a D1/D2 regression guard.

The research is dispatched through `cli-opencode` to `minimax-coding-plan/MiniMax-M2.7-highspeed` (omit `--agent`, Token Plan quota pool), prompted per `sk-prompt-small-model` (bounded context budget, explicit output contract, output verification).
<!-- /ANCHOR:approach -->

---

<!-- ANCHOR:research-question -->
## 2. RESEARCH QUESTION

How can sk-code load a tighter, task-appropriate resource slice — cutting over-routing (D3) and lifting routine-task usefulness (D4) — without regressing routing recall (D1) or discovery (D2)?

### Candidate hypotheses for the loop to weigh

| # | Approach | Premise | Risk |
|---|----------|---------|------|
| H1 | Surface×concern slicing | Load only the detected surface's slice for the matched concern, not the unioned set | May starve cross-surface tasks |
| H2 | Phase-gated loading | Gate heavy implementation refs behind the routing phase the §2 algorithm already detects | Phase detection must be reliable |
| H3 | Lazy / progressive loading | Load the preamble plus the top-ranked slice first, fetch more only on demand | Adds a round-trip on genuinely broad tasks |
| H4 | Anti-over-routing heuristic | Cap or rank resources per intent, drop low-signal docs for narrow tasks | Risk of dropping a needed doc (recall hit) |
<!-- /ANCHOR:research-question -->

---

<!-- ANCHOR:evidence -->
## 3. EVIDENCE BASELINE

| Signal | Value | Source |
|--------|-------|--------|
| D3 efficiency (live) | 42 | `benchmark/live-final/skill-benchmark-report.md` |
| Routed vs gold | ~16-20 vs ~5-8 | live scenario rows |
| D4 usefulness (approximate) | ~49 | `benchmark/live-final/d4-ablation.json` |
| D4 split | CS-001 helped (0.88 vs 0.78), LS-001 hurt (0.82 vs 0.95) | d4-ablation.json |
| D1-intra / D2 (must not regress) | 92 / 87 | live report |
<!-- /ANCHOR:evidence -->

---

<!-- ANCHOR:verification -->
## 4. VERIFICATION

- Research converges or completes 5 iterations with a ranked approach set and one recommendation.
- The recommendation states a D1/D2 regression guard and the cross-surface non-starvation safeguard.
- A follow-on phase implements the recommended approach and re-runs the live subset to confirm D3 improves while D1/D2 hold.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:risks -->
## 5. RISKS

| Risk | Mitigation |
|------|------------|
| Tighter slicing drops a needed doc (recall regression) | the frontier + regression guard are research deliverables, gating the code change |
| Thin D4 signal (n=2) | corroborate with D3 over-routing; treat D4 as directional |
| MiniMax dispatch compatibility on the local opencode | use `minimax-coding-plan/MiniMax-M2.7-highspeed`, omit `--agent`; the loop degrades to recorded errors on failure |
<!-- /ANCHOR:risks -->
