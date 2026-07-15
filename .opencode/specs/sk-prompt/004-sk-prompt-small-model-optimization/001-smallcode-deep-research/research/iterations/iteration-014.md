# Iteration 014 — Adversarial: Verdict Challenge (HYBRID vs New Skill)

**Iteration:** 14 of 20  
**Focus:** Adversarial — Challenge the HYBRID verdict in favor of a dedicated sk-small-model skill  
**Status:** Insight  
**New Info Ratio:** 0.18

---

## Focus

Steelman the OPPOSITE of the HYBRID verdict from iter-005 and iter-12: argue that a dedicated `sk-small-model` skill is BETTER than distributed references + enhances edges. Make the strongest possible case for the new skill, then steelman HYBRID back. Verdict at the end: STICK with HYBRID, FLIP to dedicated skill, or HYBRID-with-Anchor (a sentinel small-model skill that holds ONLY enhances edges + AGENTS.md rule pointer + 1-2 paragraph philosophy, with all actual patterns staying distributed).

---

## Actions Taken

1. **Read research.md §RQ5 + §Executive Summary** to understand the current HYBRID verdict and rationale.
2. **Read iter-005.md (original HYBRID verdict)** to understand the synthesis reasoning and target path distribution.
3. **Read iter-010.md (cross-cutting wiring)** to understand the enhances-edge proposal and skill-advisor co-surfacing mechanism.
4. **Read iter-011.md (gap audit)** to confirm coverage and understand the artifact inventory.
5. **Read spec.md §2 Purpose** to extract the user's original goal: "when you call cli-devin it will also automatically prompt to check skill that has logic, workflows etc for smaller models".
6. **Read sk-prompt/SKILL.md + graph-metadata.json** to understand the enhances precedent (enhances edges to all CLI skills with weight 0.4).
7. **Read system-skill-advisor/SKILL.md + fusion.ts lines 41-200** to understand the 5-lane scoring mechanics and the 0.8 confidence threshold.
8. **Composed adversarial analysis**: steelman PRO-new-skill (7 specific advantages), steelman PRO-HYBRID rebuttal, user-goal mapping table, and final verdict with research.md edit recommendations.

---

## Findings

### Steelman PRO-New-Skill: Why a Dedicated sk-small-model Skill is Better

**Advantage 1: Single Source of Truth for Small-Model Logic**

A dedicated `sk-small-model` skill would centralize all small-model optimization patterns in one location. Instead of distributed references across 5+ skills (cli-devin, cli-opencode, sk-prompt, sk-code, mcp-code-mode), operators would have a single canonical source for small-model context budgets, verification pipelines, model profiles, escalation config, and permissions matrices. This reduces cognitive load and eliminates the "where is the small-model pattern for X?" search problem.

**Citation:** spec.md §2 Purpose lines 83-85 state the user's goal: "when you call cli-devin it will also automatically prompt to check skill that has logic, workflows etc for smaller models". A dedicated skill maps directly to this goal — the advisor would surface `sk-small-model` on any small-model dispatch, providing a clear "check this skill for small-model logic" signal.

---

**Advantage 2: Lower Discovery Friction via Skill-Advisor Routing**

The HYBRID approach requires the advisor to route to cli-devin, cli-opencode, sk-prompt, sk-code, or mcp-code-mode depending on the specific small-model keyword in the prompt. This creates discovery friction: a prompt about "SWE-1.6 context budget" routes to cli-devin, while a prompt about "DeepSeek permissions matrix" routes to cli-opencode, and a prompt about "small-model verification" might route to sk-prompt or sk-code. A dedicated `sk-small-model` skill would have a single, unambiguous routing target for ALL small-model prompts, eliminating the need for complex enhances-edge wiring and trigger_phrase proliferation across 5 skills.

**Citation:** system-skill-advisor/SKILL.md lines 90-127 show the multi-tier fallback routing pseudocode. The current HYBRID proposal (iter-010) requires 5 enhances edges (cli-devin↔cli-opencode at 0.5, cli-devin→sk-prompt at 0.4, sk-code→cli-devin at 0.4, cli-devin→mcp-code-mode at 0.3) plus 50+ trigger_phrases across 4 skills to achieve routing. A dedicated skill would require only 1 skill entry in the advisor inventory with 10-15 trigger_phrases.

---

**Advantage 3: Better User-Goal Alignment**

The user's stated goal (spec.md §2 Purpose) is: "when you call cli-devin it will also automatically prompt to check skill that has logic, workflows etc for smaller models". The HYBRID approach fails this goal because it doesn't create a single skill to "check" — instead, it scatters small-model logic across existing CLI skills. When a user calls cli-devin with SWE-1.6, the advisor might surface cli-devin itself (since it's the named skill), but there's no clear signal to "also check the small-model patterns". A dedicated `sk-small-model` skill would be surfaced as a co-skill on any cli-devin/cli-opencode dispatch involving small models, explicitly satisfying the "automatically prompt to check skill" requirement.

**Citation:** spec.md §2 Purpose lines 83-85; iter-010 lines 88-143 show the HYBRID trigger_phrases additions, but these are distributed across skills rather than centralized in a single checkable skill.

---

**Advantage 4: Simplified Maintenance and Evolution**

The HYBRID approach requires maintaining 41 artifacts across 7 target locations (cli-devin/references/, cli-opencode/references/, cli-devin/assets/, cli-opencode/assets/, AGENTS.md, 4 graph-metadata.json files). When small-model patterns evolve (e.g., new model profiles added, verification pipeline updated), changes must be coordinated across multiple skills. A dedicated `sk-small-model` skill would contain all small-model artifacts in one place (references/, assets/, graph-metadata.json), with a single enhances edge to cli-devin and cli-opencode for co-surfacing. This reduces coordination overhead and prevents drift between distributed implementations.

**Citation:** iter-011 lines 32-46 show the audit table with 41 artifacts across iters 1-10. iter-005 lines 47-80 show the target path distribution across cli-devin and cli-opencode.

---

**Advantage 5: Cleaner Separation of Concerns**

The HYBRID rationale (iter-005 lines 32-34) argues that small-model patterns are "CLI-specific with different runtime defaults and integration points", making a unified skill impractical. However, this conflates implementation details with architectural boundaries. A dedicated `sk-small-model` skill can provide model-agnostic patterns (budget allocation formulas, verification pipeline stages, escalation decision matrices) while delegating CLI-specific integration to the consuming skills via clear integration contracts. This separation mirrors the sk-prompt precedent: sk-prompt provides framework-agnostic prompt engineering patterns, and CLI skills consume them via the cli_prompt_quality_card.md fast-path asset. A `sk-small-model` skill would provide small-model-agnostic optimization patterns, and CLI skills would consume them via integration contracts.

**Citation:** sk-prompt/graph-metadata.json lines 8-34 show the enhances precedent: sk-prompt enhances all CLI skills with weight 0.4 and context "prompt quality card". This demonstrates that framework-agnostic utilities can successfully use enhances edges without duplicating CLI-specific logic.

---

**Advantage 6: Stronger Skill-Advisor Signal via Single Skill Entry**

The skill-advisor's 5-lane scorer (fusion.ts lines 41-200) assigns confidence based on multiple signals. A dedicated `sk-small-model` skill would have a strong derived.trigger_phrases signal for all small-model keywords, a strong causal_summary describing small-model optimization patterns, and strong key_topics coverage. This would produce higher advisor scores for small-model prompts compared to the HYBRID approach, where the signal is diluted across 5 skills. The HYBRID approach relies on enhances edges to boost graph_causal lane scores, but this is a secondary signal compared to direct lexical/semantic matching on a single skill.

**Citation:** fusion.ts lines 181-200 show the buildLaneScores function, which combines explicit_author, lexical, derived_generated, semantic_shadow, and graph_causal lanes. A single skill with strong lexical/semantic signals would score higher than distributed skills relying on graph_causal boosts.

---

**Advantage 7: Patterns That Only Work Cleanly as a Unified Skill**

Three specific patterns from RQ1-4 work best as a unified skill rather than distributed refs:

1. **Model Profile Registry (RQ3 Artifact 1a)**: A unified model-profile.json schema covering 8 models (SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6, GLM-5.1, gpt-5.5, Claude Opus, Claude Sonnet) with context windows, tool calling support, and escalation thresholds. As a centralized asset in `sk-small-model/assets/`, this provides a single source of truth for model-specific defaults. Distributed across cli-devin/assets/ and cli-opencode/assets/, it risks divergence (e.g., cli-devin adds a new model profile that cli-opencode doesn't mirror).

2. **Escalation Decision Matrix (RQ3 Artifact 2b)**: A unified escalation matrix defining when_to_downgrade, when_to_escalate, and quota_aware rules across all small models. This matrix applies equally to cli-devin and cli-opencode dispatches. As a centralized asset in `sk-small-model/assets/escalation-matrix.json`, it ensures consistent escalation behavior. Distributed across cli-devin/assets/ and cli-opencode/assets/, it risks inconsistent escalation policies.

3. **Bayesian Tool Scoring with Laplace Smoothing (RQ3 Pattern 3)**: The Bayesian tool scorer (smallcode src/governor/tool_scorer.ms) is a sophisticated algorithm that applies equally to all small models regardless of CLI orchestrator. As a centralized reference in `sk-small-model/references/bayesian-tool-scoring.md`, it provides a single implementation reference. Distributed across cli-devin/references/ and cli-opencode/references/, it risks divergent interpretations or duplicate implementation work.

**Citation:** iter-008 lines 14-422 show RQ3 deepening artifacts including model-profile JSON schema (8 models), escalation decision matrix, and Bayesian tool-scoring placement verdict. iter-003 lines 17-229 show RQ3 baseline patterns including Bayesian tool scoring with Laplace smoothing.

---

### Steelman PRO-HYBRID: Why Distributed References + Enhances Edges is Better

**Rebuttal 1: CLI-Specific Runtime Defaults Cannot Be Abstracted**

The HYBRID rationale (iter-005 lines 32-34) correctly identifies that small-model patterns are CLI-specific with different runtime defaults and integration points. For example:
- cli-devin needs SWE-1.6 budget defaults (128K context window, file-summarization truncation at 200 lines)
- cli-opencode needs DeepSeek-specific permissions matrix (two-stage routing, write approval gate)
- cli-devin's deep-loop iter contract differs from cli-opencode's opencode-go provider contract

A dedicated `sk-small-model` skill would either need to duplicate CLI-specific logic in references/ (defeating the purpose of a unified skill) or provide only abstract patterns that lack concrete integration guidance. The HYBRID approach places patterns where they're used, with concrete integration contracts per skill.

**Citation:** iter-001.md lines 34, 66, 104, 129, 161 show cli-devin/references/ target paths for RQ1 patterns. iter-004.md lines 48, 78, 128, 180, 233 show cli-opencode/assets/ JSON schemas for RQ4 patterns.

---

**Rebuttal 2: sk-prompt Precedent Does Not Apply**

The sk-prompt precedent (enhances edges to all CLI skills with weight 0.4) is cited as a model for a unified skill, but sk-prompt is fundamentally different: it's a framework-agnostic utility that applies identically to all CLI skills (prompt engineering frameworks, CLEAR scoring, DEPTH thinking). Small-model patterns are NOT framework-agnostic — they are runtime-environment-specific with different defaults per model and per CLI orchestrator. sk-prompt provides the same cli_prompt_quality_card.md to all CLI skills; a `sk-small-model` skill would need to provide different context-budget defaults to cli-devin vs cli-opencode, different permissions schemas to cli-opencode vs cli-devin, etc.

**Citation:** sk-prompt/graph-metadata.json lines 8-34 show enhances edges with identical context "prompt quality card" for all CLI skills. iter-005 lines 32-34 explicitly state that sk-prompt is "framework-agnostic" whereas small-model patterns are "runtime-environment-specific".

---

**Rebuttal 3: Discovery Friction is Solved by Enhances Edges + Trigger Phrases**

The HYBRID approach solves discovery friction through the skill-advisor's enhances-edge mechanism (iter-010 lines 44-86). The proposed wiring includes:
- cli-devin↔cli-opencode bidirectional enhances at 0.5 (shared model profiles and verification pipeline)
- cli-devin→sk-prompt at 0.4 (prompt quality for small-model dispatch)
- sk-code→cli-devin at 0.4 (code standards for small-model work)
- cli-devin→mcp-code-mode at 0.3 (tool scoring and provider config)

Plus 50+ trigger_phrases across 4 skills to ensure lexical/semantic matching. The 5-lane scoring simulation (iter-010 lines 153-204) confirms that all 3 sample prompts clear the 0.8 confidence threshold with this wiring. A dedicated skill would not materially improve routing — the HYBRID approach already achieves automatic routing without disambiguation.

**Citation:** iter-010 lines 153-204 show 5-lane scoring simulation for 3 sample prompts, all clearing 0.8 threshold. iter-010 lines 88-143 show trigger_phrases additions across cli-devin, cli-opencode, sk-code, and mcp-code-mode.

---

**Rebuttal 4: Maintenance Cost is Lower for Distributed Patterns**

The HYBRID approach's maintenance cost is actually LOWER than a dedicated skill because patterns live where they're used:
- Context budget patterns live in cli-devin/references/ because cli-devin owns SWE-1.6 dispatch
- Permissions matrix patterns live in cli-opencode/references/ because cli-opencode owns DeepSeek dispatch
- Model profiles live in cli-devin/assets/ as a shared asset that both CLI skills reference via enhances edges

A dedicated `sk-small-model` skill would create a maintenance burden: every time a CLI skill changes its integration contract (e.g., cli-devin updates its deep-loop iter recipe), the `sk-small-model` skill would need corresponding updates to its integration contracts. This creates tight coupling between the dedicated skill and consuming skills, defeating the purpose of separation.

**Citation:** iter-005 lines 47-80 show target path distribution with shared assets in cli-devin/assets/ referenced via enhances edges. iter-008 lines 14-422 show registry location verdict: model profiles in sk-prompt/assets/ (later changed to cli-devin/assets/ per iter-008).

---

**Rebuttal 5: User Goal is Satisfied by AGENTS.md Rule + Enhances Edges**

The user's goal (spec.md §2 Purpose) is: "when you call cli-devin it will also automatically prompt to check skill that has logic, workflows etc for smaller models". The HYBRID approach satisfies this goal through two mechanisms:
1. **AGENTS.md rule addition** (iter-010 lines 28-40): A sibling rule to the CLI dispatch rule requiring consultation of skill-specific small-model references before dispatching to small models.
2. **Enhances-edge co-surfacing** (iter-010 lines 44-86): When cli-devin is dispatched for SWE-1.6, the advisor's graph_causal lane boosts cli-opencode (via bidirectional enhances at 0.5) and sk-prompt (via enhances at 0.4), surfacing the relevant small-model patterns as co-skills.

A dedicated skill is not required to satisfy the user's goal — the HYBRID approach provides the "check skill" signal via AGENTS.md rule and enhances-edge co-surfacing.

**Citation:** iter-010 lines 28-40 show AGENTS.md addition with exact literal text. iter-010 lines 44-86 show enhances-edge additions with weights and rationale.

---

### User-Goal Mapping Table

| Option | User Goal Satisfaction | Discovery Friction | Maintenance Cost | Routing Signal Strength |
|--------|------------------------|--------------------|------------------|------------------------|
| **HYBRID** (distributed refs + enhances edges) | **MEDIUM-HIGH** — Satisfied via AGENTS.md rule + enhances-edge co-surfacing, but requires operator to check multiple skills | **MEDIUM** — Requires 5 enhances edges + 50+ trigger_phrases across 4 skills; routing works but complex | **LOW** — Patterns live where they're used; minimal cross-skill coordination | **MEDIUM-HIGH** — Relies on graph_causal lane boosts; clears 0.8 threshold per simulation |
| **Dedicated sk-small-model skill** | **HIGH** — Single skill to "check" for small-model logic; maps directly to user's mental model | **LOW** — Single skill entry with 10-15 trigger_phrases; unambiguous routing | **HIGH** — Centralized skill requires coordination with all consuming CLI skills; tight coupling | **HIGH** — Strong lexical/semantic signals from single skill; higher advisor scores |
| **HYBRID-with-Anchor** (sentinel skill with enhances edges + AGENTS.md pointer) | **MEDIUM-HIGH** — Sentinel skill provides clear "check this skill" signal; patterns still distributed where used | **LOW-MEDIUM** — Sentinel skill provides single routing target; enhances edges still needed for co-surfacing | **MEDIUM** — Sentinel skill holds minimal state (enhances edges + AGENTS.md pointer); patterns distributed where used | **HIGH** — Sentinel skill provides strong routing signal; enhances edges provide co-surfacing |

**User Goal from spec.md §2 Purpose (lines 83-85):** "when you call cli-devin it will also automatically prompt to check skill that has logic, workflows etc for smaller models"

**Analysis:** The dedicated skill option best satisfies the user's goal because it provides a single, unambiguous skill to "check". HYBRID satisfies the goal indirectly via AGENTS.md rule and enhances edges, but this requires operator awareness of the rule and multi-skill pattern distribution. HYBRID-with-Anchor provides a middle ground: a sentinel skill that satisfies the "check skill" mental model while keeping patterns distributed where they're used.

---

### Final Verdict: HYBRID-with-Anchor

**Verdict:** **HYBRID-with-Anchor** — Create a sentinel `sk-small-model` skill that holds ONLY enhances edges + AGENTS.md rule pointer + 1-2 paragraph philosophy, with all actual patterns staying distributed across cli-devin and cli-opencode per the HYBRID approach.

**Rationale:**

The adversarial analysis revealed that the HYBRID approach has a genuine weakness: it does not clearly satisfy the user's stated goal of "automatically prompt to check skill that has logic for smaller models". The distributed pattern approach is technically sound (lower maintenance cost, CLI-specific integration contracts), but it fails the user's mental model test — operators expect a single skill to check for small-model logic, not a distributed set of references across 5 skills.

However, the PRO-HYBRID rebuttal correctly identifies that a full dedicated skill would create maintenance burden and tight coupling. The sk-prompt precedent does not apply because small-model patterns are runtime-environment-specific, not framework-agnostic.

HYBRID-with-Anchor provides the best of both worlds:
1. **Satisfies user goal:** A sentinel `sk-small-model` skill provides a single, unambiguous skill to "check" for small-model logic. The advisor will surface this skill on any small-model dispatch, meeting the user's mental model.
2. **Minimizes maintenance burden:** The sentinel skill holds minimal state (enhances edges to cli-devin/cli-opencode, AGENTS.md rule pointer, 1-2 paragraph philosophy). All actual patterns (context budget, verification pipeline, model profiles, permissions matrix) stay distributed in cli-devin/references/, cli-opencode/references/, and shared assets in cli-devin/assets/.
3. **Preserves CLI-specific integration:** Patterns live where they're used, with concrete integration contracts per skill. The sentinel skill does not duplicate CLI-specific logic.
4. **Reduces discovery friction:** The sentinel skill provides a single routing target with 10-15 trigger_phrases. Enhances edges from the sentinel skill to cli-devin/cli-opencode ensure co-surfacing of distributed patterns.

**Sentinel Skill Structure:**

```
.opencode/skills/sk-small-model/
├── SKILL.md (1-2 paragraph philosophy + AGENTS.md rule pointer)
├── graph-metadata.json (enhances edges to cli-devin at 0.5, cli-opencode at 0.5)
├── README.md (overview of distributed pattern locations)
└── references/
    └── pattern-index.md (index of all small-model patterns across cli-devin/cli-opencode with file paths)
```

**Enhances Edges from Sentinel Skill:**
- sk-small-model → cli-devin (weight 0.5, context: "SWE-1.6 budget defaults, verification pipeline patterns")
- sk-small-model → cli-opencode (weight 0.5, context: "DeepSeek permissions matrix, two-stage routing")

**Trigger Phrases in Sentinel Skill:**
- "small model"
- "small-model logic"
- "swe-1.6 optimization"
- "context budget"
- "verification pipeline"
- "model profile"
- "escalation"
- "permissions matrix"
- "tool scoring"
- "small-model dispatch"

**AGENTS.md Rule Addition (unchanged from iter-010):**
Add at line 39 as a sibling to the CLI dispatch rule:
```markdown
- **Small-model dispatch rule** — Before dispatching to small models (SWE-1.6, DeepSeek-V4, GLM-5.1, Kimi-K2.6) for autonomous coding work, you MUST consult the skill-specific small-model references for context budget defaults, verification pipeline requirements, and escalation provider config. Skills carry model-specific optimization contracts (e.g., SWE-1.6's 128K context budget with file-summarization truncation, DeepSeek's permissions matrix with two-stage routing) that are not in the binary's `--help` and easy to miss. Any `<binary> --model <X>` invocation for a small model requires the corresponding `references/small-model-*.md` files in context.
```

**Pattern Index in Sentinel Skill:**
The `references/pattern-index.md` file provides a centralized index of all small-model patterns with their distributed locations:
- RQ1 patterns → cli-devin/references/context-budget.md, truncation-strategy.md, file-summarization.md, token-usage-display.md; cli-opencode/references/context-eviction.md
- RQ2 patterns → cli-devin/references/verification-pipeline.md, confidence-scoring.md, hard-fail-policy.md, language-commands.md; cli-opencode/references/structural-validation.md
- RQ3 patterns → cli-devin/references/model-profile-schema.md, tool-scoring.md, tool-demotion.md, escalation-engine.md; cli-opencode/references/model-detection.md; cli-devin/assets/model-profiles.json, escalation-providers.json
- RQ4 patterns → cli-opencode/assets/tool-category-schema.json, tool-allowlist-schema.json, write-approval-gate-schema.json, permissions-matrix.schema.json; cli-opencode/references/two-stage-routing.md

This index allows operators to "check the skill" (sk-small-model) and then navigate to the distributed pattern locations.

---

### Research.md Edit Recommendations

If the verdict is HYBRID-with-Anchor, the following edits to research.md are required:

**Edit 1: Executive Summary (lines 7-9)**
Change from:
> **Architecture Verdict (HYBRID):** The patterns from RQ1-4 should land as distributed references/ files across existing CLI skills (cli-devin, cli-opencode) with cross-cutting shared assets (model profiles, escalation config) placed in cli-devin/assets/ and referenced via graph-metadata enhances edges. A new sk-small-model skill is NOT warranted because the patterns are CLI-specific with different runtime defaults and integration points (e.g., cli-devin needs SWE-1.6 budget defaults while cli-opencode needs DeepSeek-specific permissions). The sk-prompt precedent (enhances edges to all CLI skills with weight 0.4) does not apply because sk-prompt is a framework-agnostic utility that applies identically to all CLI skills, whereas small-model patterns are runtime-environment-specific.

To:
> **Architecture Verdict (HYBRID-with-Anchor):** The patterns from RQ1-4 should land as distributed references/ files across existing CLI skills (cli-devin, cli-opencode) with cross-cutting shared assets (model profiles, escalation config) placed in cli-devin/assets/ and referenced via graph-metadata enhances edges. A sentinel `sk-small-model` skill IS warranted to provide a single "check this skill" signal for small-model logic (satisfying the user's stated goal), but the sentinel skill holds ONLY enhances edges + AGENTS.md rule pointer + pattern index, with all actual patterns staying distributed. The sentinel skill reduces discovery friction while preserving CLI-specific integration contracts.

**Edit 2: Add Section after RQ5 Synthesis**
Add a new section "Sentinel Skill Specification" after the RQ5 synthesis section, documenting:
- Sentinel skill structure (SKILL.md, graph-metadata.json, pattern-index.md)
- Enhances edges from sentinel skill to cli-devin/cli-opencode
- Trigger phrases in sentinel skill
- Pattern index content
- Integration with AGENTS.md rule

**Edit 3: Update Target Path Distribution**
Add sentinel skill target paths to the distribution table:
- `.opencode/skills/sk-small-model/SKILL.md` (new)
- `.opencode/skills/sk-small-model/graph-metadata.json` (new)
- `.opencode/skills/sk-small-model/references/pattern-index.md` (new)

**Edit 4: Update Implementation Priority Ranking**
Add P0.5: "Create sentinel sk-small-model skill with enhances edges + pattern index" between P0 (AGENTS.md + graph-metadata enhances edges) and P1 (cli-devin references/).

**Citations for Edits:**
- spec.md §2 Purpose lines 83-85 (user goal)
- iter-005 lines 28-44 (original HYBRID verdict)
- iter-010 lines 28-40 (AGENTS.md addition)
- iter-010 lines 44-86 (enhances-edge wiring)
- sk-prompt/graph-metadata.json lines 8-34 (enhances precedent)

---

## Questions Answered

- **Adversarial Challenge:** Does a dedicated sk-small-model skill provide advantages over HYBRID that justify flipping the verdict? → YES, a dedicated skill provides 7 specific advantages (single source of truth, lower discovery friction, better user-goal alignment, simplified maintenance, cleaner separation of concerns, stronger advisor signal, unified patterns). However, a full dedicated skill creates maintenance burden.

- **HYBRID Rebuttal:** Does HYBRID withstand the adversarial challenge? → PARTIALLY. HYBRID's CLI-specific integration argument is sound, and the sk-prompt precedent does not apply. However, HYBRID fails the user's mental model test for "check skill" signal.

- **User-Goal Mapping:** Which option best satisfies "when you call cli-devin it will also automatically prompt to check skill that has logic for smaller models"? → DEDICATED skill best satisfies the goal, but HYBRID-with-Anchor provides a middle ground that satisfies the goal while preserving HYBRID's maintenance advantages.

- **Final Verdict:** STICK / FLIP / HYBRID-with-Anchor? → HYBRID-with-Anchor. Create a sentinel sk-small-model skill with enhances edges + AGENTS.md rule pointer + pattern index, while keeping all actual patterns distributed.

---

## Questions Remaining

- None — the adversarial analysis produced a clear verdict with concrete implementation guidance.

---

## Next Focus

**Implementation readiness** — The deep-research loop has produced a refined architecture verdict (HYBRID-with-Anchor) that addresses the user's goal while preserving HYBRID's maintenance advantages. The next step is to synthesize all findings into a canonical research output (research/research.md) with the sentinel skill specification and updated target path distribution. After synthesis, prepare the implementation plan for the follow-on packet (002-implement-small-model-optimization) with delta inventory including the sentinel skill creation.

---

## Citations

- research.md lines 7-9 (HYBRID verdict in Executive Summary)
- iter-005.md lines 28-44 (original HYBRID verdict with rationale)
- iter-010.md lines 28-40 (AGENTS.md addition)
- iter-010.md lines 44-86 (enhances-edge wiring)
- iter-010.md lines 88-143 (trigger_phrases additions)
- iter-010.md lines 153-204 (5-lane scoring simulation)
- iter-011.md lines 32-46 (audit table with 41 artifacts)
- spec.md §2 Purpose lines 83-85 (user goal)
- sk-prompt/SKILL.md lines 1-457 (sk-prompt precedent)
- sk-prompt/graph-metadata.json lines 8-34 (enhances edges to all CLI skills)
- system-skill-advisor/SKILL.md lines 90-127 (smart routing pseudocode)
- fusion.ts lines 41-200 (5-lane scoring mechanics, DEFAULT_CONFIDENCE_THRESHOLD = 0.8)
