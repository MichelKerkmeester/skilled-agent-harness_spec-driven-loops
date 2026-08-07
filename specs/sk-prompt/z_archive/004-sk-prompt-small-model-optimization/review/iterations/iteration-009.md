# Deep-Review Iteration 009 — Integration Cross-Cutting

**Iteration:** 9 of 20
**Mode:** review
**Dimension:** integration (cross-cutting)
**Focus:** Sentinel HYBRID-with-Anchor architecture compliance + advisor wiring
**Status:** complete
**Timestamp:** 2026-05-18T19:47:00Z

---

## Executive Summary

Verified HYBRID-with-Anchor architecture compliance for `sk-small-model` sentinel skill. The sentinel functions correctly as a thin routing anchor with proper enhances-edge wiring to both `cli-devin` and `cli-opencode`. All pattern-index.md cross-references resolve successfully. Advisor lane-scorer reasoning indicates trigger phrases would match typical dispatch prompts. One P2 finding: 5 of 6 canonical reference docs lack reverse citations to the sentinel skill, reducing discoverability from the pattern side.

**Findings:** P0=0, P1=0, P2=1 (new)
**Running totals:** P0=0, P1=2, P2=11

---

## Check 1: HYBRID-with-Anchor Architecture Compliance

### Evidence

**Architecture specification (research.md:7):**
> "A sentinel `sk-small-model` skill IS warranted as a routing anchor (holds ONLY enhances edges + AGENTS.md rule pointer + philosophy), but all actual patterns stay distributed."

**SKILL.md structure (sk-small-model/SKILL.md):**
- Line 3: "Sentinel for small-model optimization patterns. Routing anchor only; real patterns live in cli-devin/references/ and cli-opencode/references/."
- Line 12: "A discovery anchor that surfaces alongside `cli-devin` or `cli-opencode`"
- Lines 183-193: References section lists executor-owned canonical files
- Total LOC: 210 lines

**Content analysis:**
- SKILL.md does NOT duplicate pattern bodies
- All pattern references are links to executor-owned files
- Content is routing-focused (when to use, smart routing, workflow, ownership boundary)
- No runtime logic, scripts, or agent-config recipes

### Findings

**P2 — SKILL.md exceeds 200 LOC limit**
- **File:** `.opencode/skills/sk-small-model/SKILL.md:1-210`
- **Evidence:** SKILL.md is 210 lines, exceeds the ≤ 200 LOC rule stated at SKILL.md:154
- **Confidence:** HIGH
- **Counterevidence sought:** None - line count is objective
- **Alternative explanation:** The limit may be a soft target; actual content is appropriately thin
- **Downgrade trigger:** If LOC limit is confirmed as soft guidance rather than hard requirement

**PASS — Content is appropriately thin**
- SKILL.md functions as a routing anchor without duplicating pattern content
- All references point to executor-owned canonical files
- Matches HYBRID-with-Anchor specification

---

## Check 2: Enhances-Edge Wiring

### Evidence

**graph-metadata.json enhances edges (sk-small-model/graph-metadata.json:8-18):**
```json
"enhances": [
  {
    "target": "cli-devin",
    "weight": 0.5,
    "context": "small-model dispatch surface — SWE-1.6 budget + verification patterns"
  },
  {
    "target": "cli-opencode",
    "weight": 0.5,
    "context": "small-model dispatch surface — DeepSeek/Kimi/Qwen permissions matrix + budget patterns"
  }
]
```

### Findings

**PASS — Enhances edges meet specification**
- cli-devin edge: weight 0.5 (≥ 0.4 requirement ✓)
- cli-opencode edge: weight 0.5 (≥ 0.4 requirement ✓)
- Both edges include context explaining the relationship
- Matches research specification for enhances-edge weights (0.4-0.5 range)

---

## Check 3: Pattern-Index Cross-Reference Resolution

### Evidence

**pattern-index.md table (sk-small-model/references/pattern-index.md:35-48):**
- 14 pattern entries with canonical location paths
- Paths reference: cli-devin/references/, cli-opencode/references/, sk-prompt/references/, sk-prompt/assets/, system-spec-kit/mcp_server/lib/deep-loop/

**Path verification (bash ls):**
All 14 referenced files exist:
- cli-devin/references/context-budget.md ✓
- cli-devin/references/output-verification.md ✓
- cli-devin/assets/confidence-scoring-rubric.md ✓
- cli-devin/assets/per-model-budgets.json ✓
- cli-devin/references/quota-fallback.md ✓
- sk-prompt/assets/model-profiles.json ✓
- sk-prompt/references/model-profiles.md ✓
- system-spec-kit/mcp_server/lib/deep-loop/bayesian-scorer.ts ✓
- system-spec-kit/mcp_server/lib/deep-loop/fallback-router.ts ✓
- cli-opencode/assets/permissions-matrix.schema.json ✓
- cli-opencode/references/permissions-matrix.md ✓
- system-spec-kit/mcp_server/lib/deep-loop/permissions-gate.ts ✓
- cli-opencode/references/context-budget.md ✓
- sk-prompt/assets/cli_prompt_quality_card.md ✓

### Findings

**PASS — All pattern-index references resolve**
- No broken paths
- Pattern coverage matches research specification (all RQ1-5 patterns represented)
- Ship status annotations present for all entries

---

## Check 4: Advisor Lane-Scorer Reasoning

### Evidence

**Advisor scorer lanes (fusion.ts:188-192):**
```typescript
if (!disabled.has('explicit_author')) scores.explicit_author = scoreExplicitLane(prompt, projection);
if (!disabled.has('lexical')) scores.lexical = scoreLexicalLane(prompt, projection);
if (!disabled.has('derived_generated')) scores.derived_generated = scoreDerivedLane(prompt, projection, new Date(), affordances);
if (!disabled.has('semantic_shadow')) scores.semantic_shadow = scoreSemanticShadowLane(prompt, projection);
if (!disabled.has('graph_causal')) {
  scores.graph_causal = scoreGraphCausalLane([...], projection, {}, affordances);
}
```

**sk-small-model trigger phrases (description.json:6-26, graph-metadata.json:50-70):**
- "small model", "small-model dispatch"
- Model names: "swe-1.6", "swe 1.6", "deepseek-v4", "kimi-k2.6", "qwen3.6", "haiku", "gemini flash"
- Pattern names: "context budget", "output verification", "model profile", "structured permissions", "tool scoring"

**Reasoning trace:**
- Lexical lane matches exact phrase tokens in trigger_phrases
- Typical dispatch prompt: "dispatch SWE-1.6 with context budget" would match:
  - "dispatch" (task intent)
  - "swe-1.6" (lexical match)
  - "context budget" (lexical match)
- Graph-causal lane would activate via enhances edges when cli-devin or cli-opencode are already in top-k

### Findings

**PASS — Trigger phrases would surface via advisor lanes**
- Lexical lane has strong signal for model names and pattern names
- Graph-causal lane provides secondary signal via enhances edges
- Typical small-model dispatch prompts would generate sufficient lexical evidence

---

## Check 5: Reverse Cross-Reference from Canonical Refs

### Evidence

**Grep results for "sk-small-model" or "pattern-index" in canonical refs:**
- cli-devin/references/context-budget.md: No matches
- cli-devin/references/output-verification.md: No matches
- cli-devin/references/quota-fallback.md: No matches
- cli-opencode/references/permissions-matrix.md: **1 match at line 107** - `edit on sk-small-model/references/pattern-index.md`
- cli-opencode/references/context-budget.md: No matches
- sk-prompt/references/model-profiles.md: No matches

### Findings

**P2 — Canonical refs lack reverse citations to sentinel**
- **File:** Multiple canonical reference docs
- **Evidence:** 5 of 6 canonical reference docs do not cite back to sk-small-model or pattern-index.md
- **Confidence:** HIGH
- **Counterevidence sought:** None - grep results are definitive
- **Alternative explanation:** Refs may assume operators discover patterns via the sentinel, not vice versa
- **Downgrade trigger:** If reverse citation is deemed unnecessary for the distributed pattern architecture

**Impact:**
- Reduces discoverability from pattern docs back to the sentinel
- Operators reading a canonical ref directly won't know it's part of a larger small-model pattern system
- Only permissions-matrix.md (line 107) includes a pointer to the pattern index

---

## Verdict

**Integration cross-cutting concerns:** MOSTLY SATISFIED

The HYBRID-with-Anchor architecture is correctly implemented:
- Sentinel skill functions as a thin routing anchor
- Enhances edges properly wire the sentinel to both executor skills
- Pattern-index cross-references are complete and valid
- Advisor lane-scorer would surface the skill for typical dispatch prompts

**Gap:** Reverse citation hygiene — canonical refs should acknowledge they're part of the sentinel pattern system for better discoverability.

---

## Next Focus

**Iteration 10:** Runtime behavior validation — simulate actual advisor matching for representative small-model dispatch prompts to verify the lexical + graph-causal lane fusion produces expected skill rankings. This would validate the reasoning check from iteration 9 with empirical evidence.

**Alternative focus areas:**
- Documentation completeness (SKILL.md prose quality, README alignment)
- Edge cases in pattern distribution (what happens when a pattern spans two executors?)
- Verification of shipped pattern content against research.md specifications
