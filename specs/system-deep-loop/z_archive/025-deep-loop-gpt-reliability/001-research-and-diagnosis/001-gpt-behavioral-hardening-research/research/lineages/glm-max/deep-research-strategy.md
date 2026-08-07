---
title: Deep Research Strategy - GPT Behavioral Hardening (glm-max lineage) - SYNTHESIZED
importance_tier: important
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy — GPT Behavioral Hardening (glm-max lineage) — SYNTHESIZED

> Reducer-refreshed after 30 iterations. Status: complete (synthesized).

## 2. TOPIC
GPT behavioral hardening follow-up for packet 031 (see init strategy / research-prompt.md).

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
All KQ1-KQ9 resolved. See Section 6.
<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS
Do NOT implement code; do NOT re-derive mis-route taxonomy/validator; do NOT over-constrain Claude.

## 5. STOP CONDITIONS
Met: 30 iterations reached (stop policy max-iterations); all 9 KQs answered with citations.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- **KQ1** (iter 5): Decisive external smoke (8-run, route-proof-augmented, baseline-controlled) — iter 5
- **KQ2** (iter 8): Symptoms = MIX: mis-routing (A/B/C, orchestrate rows incomplete) + new mode D (GPT-vs-state-machine literalism) + latency (role-resolution overhead) — iter 6,7,8
- **KQ3** (iter 11): Keep ai-council mode:all; do NOT convert; add route-proof header — iter 9,10,11
- **KQ4** (iter 13): Orchestrate delegates deep-dispatch to deep.md via single deterministic rule (dispatch @deep + STOP) — iter 12,13
- **KQ5** (iter 15): Feasible hook-based enforcement plugin in system-skill-advisor; detection-layer, not hard identity — iter 14,15
- **KQ6** (iter 17): 8-run, 2-metric benchmark (latency + route-proof) reusable as baseline now + regression gate after fixes — iter 16,17
- **KQ7** (iter 19): Literal-safe pattern = table + bounded clarification + structured header + hard boundaries; apply to ROUTING surfaces only — iter 18,19
- **KQ8** (iter 22): 6 in-scope paths (orchestrate, 4 command seams, CLI seam, advisor plugin) + .claude mirrors; Codex + improvement-family deferred — iter 20,21,22
- **KQ9** (iter 24): WAIT on KQ1 external smoke + cheaper layers; unpark FIX-5 only on measured negative-gate (GPT<4/4 vs Claude=4/4 after KQ4+KQ5) — iter 23,24
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reading primary agent/command files directly for exact line citations (iter 1-3).
- Per-symptom mechanism mapping separating latency from routing (iter 6).
- Detection-vs-prevention framing for plugin vs FIX-5 scope (iter 15).
- Risk-asymmetry arguments for KQ3 no-conversion and KQ9 wait (iter 11,24).
- Dependency analysis converting 9 KQ answers into a buildable sequence (iter 27).
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- (none: every iteration produced evidence; no approach exhausted without a documented ruling)
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
- Smoke-from-inside-OpenCode -- BLOCKED (iter 5): OPENCODE_PID guard structurally trips; do NOT retry nested smokes.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **Re-running the smoke from inside an OpenCode session** (iter 5): OPENCODE_PID guard structurally trips [SOURCE: 005:120; cli-opencode/SKILL.md:319]
- **Treating all operator symptoms as one mis-routing class** (iter 6): conflates latency, routing, and state-machine literalism [SOURCE: iter 6]
- **Converting ai-council to subagent-only now** (iter 11): removes non-broken depth-0 parallel feature; symptoms do not involve council [SOURCE: ai-council.md:55-60; research-prompt.md:21]
- **Applying the literal-safe table pattern to leaf/execution surfaces** (iter 19): harms Claude evidence-response (mode D) and removes controlled flex-escape [SOURCE: deep.md:51-59,66]
- **Codex parity in this work** (iter 20): TOML-location contradiction unresolved [SOURCE: ../001 §8]
- **Unparking FIX-5 immediately on operator evidence alone** (iter 24): architectural blast radius; cheaper layers unproven-insufficient; wait is reversible [SOURCE: ../001 §8b; iter 23]
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Calibrate KQ6 latency-ratio threshold from the baseline run (iter 17).
- Validate KQ2 mode-D magnitude once GPT-vs-Claude telemetry exists (iter 8,29).
- Confirm an OPENCODE_PID-free external shell is available to the operator (KQ9 gate runnability, iter 29).
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
SYNTHESIS COMPLETE. Next: /speckit:plan on the proposed 008-012 phase breakdown (see research.md).
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT
(see init strategy; unchanged — root cause, phases 002-006 status, deep.md/orchestrate/ai-council modes, operator symptoms, no resource-map.md)

## 13. RESEARCH BOUNDARIES
- Max iterations: 30 (reached) | Convergence threshold: 0.05 (telemetry only; stop policy = max-iterations)
- Average newInfoRatio: 0.488 | Generation: 1
