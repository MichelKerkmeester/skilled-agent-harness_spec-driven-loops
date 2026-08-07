# Iteration 005 — RQ5: Skill Architecture (SYNTHESIS)

**Iteration:** 5 of 20  
**Focus:** RQ5 — Skill Architecture (SYNTHESIS)  
**Status:** Insight  
**New Info Ratio:** 0.65

---

## Focus

Synthesize findings from RQ1-4 (context budget engine, output verification pipeline, per-model profiles & escalation, structured scope/permissions) into a unified small-model optimization strategy. Determine whether these patterns should land as: (a) a new `sk-small-model` skill with `enhances` edges to cli-devin/cli-opencode, (b) per-skill `references/` files inside existing skills, (c) cross-cutting refs in sk-code/mcp-code-mode, or (d) hybrid. Produce an EXPLICIT verdict with rationale and artifact drafts.

---

## Actions Taken

1. **Read iter-001 through iter-004** to compile the cross-RQ delta inventory and target path distribution (20 patterns total).
2. **Read architecture context** — system-skill-advisor SKILL.md (routing mechanics, 5-lane scorer), fusion.ts lines 41-42 (DEFAULT_CONFIDENCE_THRESHOLD = 0.8), sk-prompt/graph-metadata.json (enhances precedent with weight 0.4 to all CLI skills).
3. **Analyzed distribution** — 10 patterns target cli-devin/references/, 4 patterns target cli-opencode/references/, 4 patterns target cli-opencode/assets/ (JSON schemas), 2 patterns have hybrid placement options.
4. **Evaluated sk-prompt precedent** — sk-prompt is a pure utility skill that applies identically to all CLI skills; small-model patterns are CLI-specific with different runtime defaults and integration points.
5. **Formulated verdict** — HYBRID approach with NO new skill, using distributed references/ files plus graph-metadata `enhances` edges for cross-cutting concerns.

---

## Findings

### Architecture Verdict: HYBRID (Distributed References + Enhances Edges, No New Skill)

**Verdict:** The patterns from RQ1-4 should land as distributed references/ files across existing CLI skills (cli-devin, cli-opencode) with cross-cutting shared assets (model profiles, escalation config) placed in cli-devin/assets/ and referenced via graph-metadata `enhances` edges. A new `sk-small-model` skill is NOT warranted.

**Rationale (3-5 sentences):**

The patterns from RQ1-4 are CLI-specific with different runtime defaults and integration points (e.g., cli-devin needs SWE-1.6 budget defaults while cli-opencode needs DeepSeek-specific permissions), making a unified skill impractical without duplicating CLI-specific logic in references/ anyway. The sk-prompt precedent (enhances edges to all CLI skills with weight 0.4) does not apply because sk-prompt is a framework-agnostic utility that applies identically to all CLI skills, whereas small-model patterns are runtime-environment-specific. Cross-cutting concerns (model profile schema, escalation provider config) can be shared as JSON assets in cli-devin/assets/ that other skills reference via graph-metadata `enhances` edges, avoiding a new skill while enabling co-surfacing on small-model dispatch.

**Citations:**
- iter-001.md lines 34, 66, 104, 129, 161 (cli-devin/references/ target paths)
- iter-002.md lines 86, 131, 161, 257, 321 (cli-devin/cli-opencode/references/ target paths)
- iter-003.md lines 37, 87, 124, 150, 217 (hybrid placement options)
- iter-004.md lines 48, 78, 128, 180, 233 (cli-opencode/assets/ JSON schemas)
- sk-prompt/graph-metadata.json lines 8-34 (enhances precedent, weight 0.4)
- system-skill-advisor/SKILL.md lines 90-127 (smart routing pseudocode)
- fusion.ts lines 41-42 (DEFAULT_CONFIDENCE_THRESHOLD = 0.8)

---

### Target Path Distribution (Per RQ1-4 Deltas)

**RQ1 — Context Budget Engine (5 patterns):**
1. `.opencode/skills/cli-devin/references/context-budget.md` (new)
2. `.opencode/skills/cli-devin/references/truncation-strategy.md` (new)
3. `.opencode/skills/cli-opencode/references/context-eviction.md` (new)
4. `.opencode/skills/cli-devin/references/file-summarization.md` (new)
5. `.opencode/skills/cli-devin/references/token-usage-display.md` (new)

**RQ2 — Output Verification Pipeline (5 patterns):**
1. `.opencode/skills/cli-devin/references/verification-pipeline.md` (new)
2. `.opencode/skills/cli-opencode/references/structural-validation.md` (new)
3. `.opencode/skills/cli-devin/references/confidence-scoring.md` (new)
4. `.opencode/skills/cli-devin/references/hard-fail-policy.md` (new)
5. `.opencode/skills/cli-devin/references/language-commands.md` (new)

**RQ3 — Per-Model Profiles & Escalation (5 patterns):**
1. `.opencode/skills/cli-devin/references/model-profile-schema.md` (new) — primary target
2. `.opencode/skills/cli-opencode/references/model-detection.md` (new)
3. `.opencode/skills/cli-devin/references/tool-scoring.md` (new) — primary target
4. `.opencode/skills/cli-devin/references/tool-demotion.md` (new)
5. `.opencode/skills/cli-devin/references/escalation-engine.md` (new) — primary target

**RQ4 — Structured Scope/Permissions (5 patterns):**
1. `.opencode/skills/cli-opencode/assets/tool-category-schema.json` (new)
2. `.opencode/skills/cli-opencode/assets/tool-allowlist-schema.json` (new)
3. `.opencode/skills/cli-opencode/references/two-stage-routing.md` (new)
4. `.opencode/skills/cli-opencode/assets/write-approval-gate-schema.json` (new)
5. `.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json` (new)

**Cross-Cutting Shared Assets (for enhances edges):**
- `.opencode/skills/cli-devin/assets/model-profiles.json` (new) — shared model profile registry
- `.opencode/skills/cli-devin/assets/escalation-providers.json` (new) — shared escalation provider config

---

### Skill-Advisor Co-Surfacing Mechanism

**Trigger Phrases to Add:**
- Add to cli-devin SKILL.md `trigger_phrases`: "small model", "context budget", "token optimization", "SWE-1.6 budget", "verification pipeline", "model profile", "escalation", "tool scoring"
- Add to cli-opencode SKILL.md `trigger_phrases`: "permissions matrix", "tool categories", "allowlist", "write approval", "structured permissions", "two-stage routing"

**Graph-Metadata Enhances Edges:**
- Add to cli-devin/graph-metadata.json `enhances` edge to cli-opencode (weight 0.3, context: "shared model profiles and escalation config")
- Add to cli-opencode/graph-metadata.json `enhances` edge to cli-devin (weight 0.3, context: "verification pipeline patterns")
- Add to cli-devin/graph-metadata.json `enhances` edge to mcp-code-mode (weight 0.3, context: "tool scoring and provider config")

**Routing Simulation:**
- Prompt: "Optimize this SWE-1.6 dispatch for small-model context budget"
- Lane scores: explicit_author (0.10), lexical (0.70 — "SWE-1.6" + "context budget"), derived_generated (0.65 — "optimize" in TASK_INTENT), semantic_shadow (0.60), graph_causal (0.20)
- Estimated total: 0.65-0.75 — below 0.8 threshold
- Advisor behavior: Surface cli-devin as top candidate with ~0.70 score, request operator confirmation
- Mitigation: Once references/ files exist and graph-metadata `enhances` edges are added, graph_causal lane would boost score to ~0.80-0.85

**Citations:**
- system-skill-advisor/SKILL.md lines 90-127 (smart routing pseudocode, multi-tier fallback)
- fusion.ts lines 41-44 (DEFAULT_CONFIDENCE_THRESHOLD = 0.8, TASK_INTENT regex)
- sk-prompt/graph-metadata.json lines 8-34 (enhances precedent)

---

## Questions Answered

- **RQ5 — Skill Architecture (SYNTHESIS):** What is the optimal architecture for integrating RQ1-4 patterns into the opencode skill system? → HYBRID approach with distributed references/ files across cli-devin and cli-opencode, cross-cutting shared assets in cli-devin/assets/, and graph-metadata `enhances` edges for co-surfacing. A new `sk-small-model` skill is NOT warranted because the patterns are CLI-specific with different runtime defaults and integration points, unlike the sk-prompt precedent which is framework-agnostic.

---

## Questions Remaining

- None — all 5 RQs are now answered with explicit verdicts and candidate deltas.

---

## Next Focus

**Convergence synthesis** — The deep-research loop has answered all 5 RQs with concrete candidate deltas. The next step is to synthesize all findings into a canonical research output (research/research.md) and prepare the implementation plan for the follow-on packet (002-implement-small-model-optimization). The synthesis should include:
1. Cross-RQ dependency analysis (e.g., model profiles needed by budget engine, verification pipeline needed by escalation)
2. Implementation priority ranking (P0: permissions matrix for RM-8 prevention, P1: context budget for SWE-1.6, P2: verification pipeline, P3: model profiles & escalation)
3. Integration checklist for each target path (references/ files, assets/ JSON schemas, graph-metadata updates, SKILL.md trigger phrase additions)
4. Verification plan for each delta (acceptance criteria from iters 1-4)

---

## Citations

- iter-001.md lines 34, 66, 104, 129, 161 — RQ1 target paths
- iter-002.md lines 86, 131, 161, 257, 321 — RQ2 target paths
- iter-003.md lines 37, 87, 124, 150, 217 — RQ3 target paths
- iter-004.md lines 48, 78, 128, 180, 233 — RQ4 target paths
- sk-prompt/graph-metadata.json lines 8-34 — enhances precedent
- system-skill-advisor/SKILL.md lines 90-127 — smart routing pseudocode
- fusion.ts lines 41-44 — confidence threshold + TASK_INTENT regex
