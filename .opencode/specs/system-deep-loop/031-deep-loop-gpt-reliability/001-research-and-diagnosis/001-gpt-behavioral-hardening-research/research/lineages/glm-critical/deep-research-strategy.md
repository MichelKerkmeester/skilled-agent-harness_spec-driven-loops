---
title: Deep Research Strategy - Critical Re-Review of GPT Behavioral Hardening (glm-critical lineage)
importance_tier: important
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy — Critical Re-Review (glm-critical lineage)

> Fresh fan-out lineage. Mission (research-prompt.md §9): be CRITICAL, not confirmatory. The operator has first-hand confirmed all four symptoms (§9.1) — do NOT re-litigate whether the problem exists. Stress-test the consolidated synthesis as a draft, correct for GPT-self-assessment bias (§9.2), produce implementation-ready improvements (§9.3.3), and update any "not proven" verdicts the operator evidence now settles (§9.3.4).

## 2. TOPIC
Critical re-review of the packet-031 GPT-behavioral-hardening consolidated synthesis. Two prior lineages (glm-max, gpt-fast-high) produced `research/research.md`. This round + sibling `sonnet-critical` re-review it for: GPT-investigating-GPT bias, watered-down recommendations, "wait-for-evidence" escape hatches, and wrong-reason agreement between the originals; then sharpen toward concrete fixes.

## 4. NON-GOALS
- Do NOT re-litigate whether GPT misbehaves (operator confirmed all 4 symptoms first-hand, §9.1).
- Do NOT implement code (research-only; fixes are design + evidence for a follow-up phase).
- Do NOT re-derive the modes A/B/C taxonomy or route-proof validator mechanics (established in 001/002).
- Do NOT hedge with "not yet proven" / "awaiting external smoke" to AVOID a harder conclusion about whether the problem exists (that evidentiary bar was for route-proof-level evidence, not symptom existence — §9.1).

## 5. STOP CONDITIONS
- 10 iterations reached (stop policy = max-iterations). Convergence signals before iter 10 are TELEMETRY ONLY — broaden the critical angle, do not synthesize early (§9.4).
- All 5 CR-questions (below) answered with file:line evidence AND a per-KQ verdict of confirmed / sharpened / overturned for the consolidated synthesis.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- **CR-1 (§9.2 — GPT bias lens):** Name every place where gpt-fast-high's framing is softer, more deferential, or more self-protective than the evidence supports (esp. "not yet a route-proof failure artifact", "require decisive external evidence", folding stuck→stuck_latency). For each, state the corrected (harder) conclusion.
- **CR-2 (§9.3.2 — mechanism from confirmed symptoms):** Given GPT really does misroute / get stuck / run slow / overthink — what is the concrete mechanism and concrete fix for EACH, cited file:line? Do not stop at "a mix of mechanisms."
- **CR-3 (§9.3.3 — implementation-ready):** Take each consolidated KQ answer; for each, either sharpen it, find its weak point, or confirm it survives adversarial pressure with reasons. No unchanged restatements.
- **CR-4 (§9.3.4 — verdict updates):** Which prior "not proven" / "inferred" verdicts does the operator's first-hand confirmation now settle? Update each and say the verdict changed.
- **CR-5 (shared blind spots):** Where did glm-max and gpt-fast-high AGREE for the wrong reason (shared blind spot) rather than independent confirmation? Test the cross-lineage "full agreement" claims in research.md §0/§2.
<!-- /ANCHOR:key-questions -->

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
(none yet — populated as iterations close CR-questions)
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
(populated by reducer)
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
(populated by reducer)
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
(populated by reducer)
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
(populated by reducer)
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
**Iteration 1:** Establish the critical-evidence baseline. Re-read the consolidated `research/research.md` and both prior lineage syntheses through the §9.2 lens; inventory (a) every soft/deferential/self-protective framing in gpt-fast-high, (b) every "wait-for-evidence" escape hatch, (c) every cross-lineage agreement claim that should be tested for shared-blind-spot. Anchor the council route-proof three-way contradiction (registry vs orchestrate-topic.cjs vs YAML self-contradiction) as the first concrete sharpening.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT
- **Ground truth (§9.1):** Operator PERSONALLY confirmed all four symptoms (slow @orchestrate, wrong sub-agent, stuck on pre-defined flows, overthink/needs literal instructions). These are CONFIRMED, not hypotheses. Do not re-litigate.
- **The flaw being corrected (§9.2):** gpt-fast-high = GPT investigating GPT failures → structural conflict of interest (understate severity, prefer self-exonerating conclusions, over-hedge to "insufficient evidence"). Read gpt-fast-high's research.md with this lens.
- **Required inputs (§9.4):** consolidated `research/research.md`, `lineages/glm-max/research.md`, `lineages/gpt-fast-high/research.md` already read pre-loop.
- **Confirmed core evidence handles (read pre-loop):**
  - Root cause: `subagent_type` normalized to `"general"` for all custom agents [orchestrate.md:162,208; deep.md:57].
  - `deep.md` is the literal-safe pattern: registry table + bounded clarification gate + structured Deep Route header with `do_not_infer_or_switch_deep_mode=true` + fail-closed consistency check [deep.md:34-79, esp. 72-78].
  - `orchestrate.md` Deep Route field is judgment-grade: free-text `mode=/execution=` self-derived from a Priority table that does NOT list deep-context/deep-review as rows [orchestrate.md:95-105,207]. It also LACKS deep.md's `do_not_infer_or_switch_deep_mode` guard.
  - **Council route-proof THREE-WAY contradiction (CONFIRMED pre-loop, sharpens prior "naming drift"):** registry canonical = `ai-council`/`ai-council` [mode-registry.json:66-80]; runtime code HARDCODES `council`/`deep-ai-council` [orchestrate-topic.cjs:310-313]; the council YAML's own build step emits `ai-council`/`@ai-council` [deep_ai-council_auto.yaml:117-118] while its post_dispatch_validate asserts `council`/`deep-ai-council` [deep_ai-council_auto.yaml:132-136] — the YAML contradicts ITSELF, and the validate step asserts values that disagree with the registry deep.md reads. Latent false-pass: route-proof "succeeds" against wrong values.
  - cli-opencode self-invocation guard = 3-layer (env/ancestry/lock), trip on any positive [cli-opencode/SKILL.md:319].
  - Phase 005 inconclusive: 0/4 command-owned smokes reached a real leaf [005/implementation-summary.md:99-115]. Phase 006/FIX-5 parked on that [006/decision-record.md:20-22].
- resource-map.md NOT present at spec root; `resource_map_present = false`; skipping coverage gate.

## 13. RESEARCH BOUNDARIES
- Max iterations: 10 | Convergence threshold: 0.05 (telemetry only; stop policy = max-iterations; minIterations = 10).
- Generation: 1 | Sibling lineage: sonnet-critical | Do NOT touch lineages/glm-max/, lineages/gpt-fast-high/, lineages/sonnet-critical/, or any path outside this lineage dir.
