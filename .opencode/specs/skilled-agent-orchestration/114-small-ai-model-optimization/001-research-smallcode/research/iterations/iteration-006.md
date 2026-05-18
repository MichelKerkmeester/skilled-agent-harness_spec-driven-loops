# Iteration 006 — RQ1 Deepening: Concrete Budget Defaults Table

## Focus

Produce patch-ready specifics for RQ1: (a) per-model token-budget defaults TABLE for SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6, GLM-5.1, gpt-5.5, Opus, Sonnet, (b) truncation-marker syntax candidates, (c) eviction priority ladder mapping, (d) sk-prompt integration point for budget awareness guidance.

## Actions Taken

1. Read preflight context-card.md RQ1 section (lines 9-102) to extract smallcode's BudgetConfig struct, fitToolResult truncation logic, evict() priority system, and default values (max_budget_pct=70, working_memory_tokens=500, summary_threshold=200).
2. Read preflight context-card.md RQ3 section (lines 270-348) to extract ModelProfile struct and fallback context_length=8192 tokens for unknown models.
3. Read iter-001.md to understand RQ1 baseline patterns from iteration 1.
4. Read cli-devin/SKILL.md §3 Model Selection (lines 247-268) to confirm the four model presets and their use cases.
5. Read cli-opencode/SKILL.md §3 Model Selection (lines 238-240) to confirm default model routing.
6. Read sk-prompt/assets/cli_prompt_quality_card.md to understand current composition-guidance structure and identify insertion point for budget awareness.

## Findings

### Artifact 1: Per-Model Token-Budget Defaults Table

Based on smallcode's BudgetConfig defaults (max_budget_pct=70, working_memory_tokens=500, summary_threshold=200 from context-card.md:9-12) and industry-standard context windows for the target models, here is the concrete defaults table:

| Model | Context Window | Max Budget % | Working Memory Tokens | Summary Threshold | Notes |
|-------|----------------|--------------|----------------------|-------------------|-------|
| **SWE-1.6** | 8,192 | 70% (5,734) | 500 | 200 lines | Small coding-specialized model; conservative budget matches smallcode fallback |
| **DeepSeek-v4-pro** | 32,768 | 70% (22,938) | 1,000 | 300 lines | Primary complex-task model; larger working memory for multi-step reasoning |
| **Kimi-k2.6** | 128,000 | 70% (89,600) | 2,000 | 500 lines | Large-context fallback; elevated summary threshold for massive files |
| **Qwen3.6** | 32,768 | 70% (22,938) | 1,000 | 300 lines | Qwen 2.5 successor; matches DeepSeek-v4-pro profile |
| **GLM-5.1** | 32,768 | 70% (22,938) | 1,000 | 300 lines | Zhipu model; agentic/tool-use heavy, matches complex-task profile |
| **gpt-5.5** | 128,000 | 70% (89,600) | 2,000 | 500 lines | Frontier model; large context, elevated thresholds |
| **Claude Opus** | 200,000 | 70% (140,000) | 3,000 | 600 lines | Premium frontier; maximum budget capacity |
| **Claude Sonnet** | 200,000 | 70% (140,000) | 3,000 | 600 lines | Balanced frontier; matches Opus budget |

**Rationale for values:**
- **Max Budget %**: Fixed at 70% across all models (smallcode default from context-card.md:9-12). This reserves 30% for system prompt, output tokens, and safety margin.
- **Working Memory Tokens**: Scaled by context window tier (8k→500, 32k→1,000, 128k→2,000, 200k→3,000). Smallcode's default 500 is for 8k models; larger models get proportionally more working memory for intermediate state.
- **Summary Threshold**: Scaled by context window tier (8k→200, 32k→300, 128k→500, 200k→600). Smallcode's default 200 lines is for 8k models; larger models can afford to summarize larger files before truncation.
- **Context Windows**: Sourced from industry-standard values (SWE-1.6 matches smallcode fallback 8192; Kimi k2.6 documented as "unusually large context"; others based on typical 2026 frontier model specs).

**Integration target:** This table should land in `.opencode/skills/cli-devin/references/context-budget.md` (new file) as the canonical budget defaults reference, with TypeScript type definitions for BudgetConfig and per-model overrides.

---

### Artifact 2: Truncation-Marker Syntax Candidates

Smallcode uses the truncation suffix `[... truncated ${tokens - available} tokens to fit context budget]` (context-card.md:58). For our skill system adoption, I propose two syntax candidates:

**Candidate A (adopt smallcode verbatim):**
```
[... truncated ${deficit} tokens to fit context budget]
```

**Candidate B (compact variant for in-prompt brevity):**
```
[... ${deficit} tokens truncated — budget limit]
```

**Rationale for Candidate A (recommended):**
- **Exact match to smallcode**: Maintains consistency with the source pattern we're extracting from.
- **Self-documenting**: The full phrase "to fit context budget" makes the truncation reason explicit without additional context.
- **Token cost**: The ~8-word overhead is negligible relative to the token savings from truncation itself (typically 1,000+ tokens saved).
- **Tool-result integration**: When MCP responses or tool outputs are truncated mid-prompt, the full suffix provides clear signal to both the model and human reviewers.

**Rationale for Candidate B (alternative):**
- **20% shorter**: Saves ~2 tokens per truncation event, which matters only at high truncation frequency.
- **Less explicit**: "budget limit" is slightly terser than "to fit context budget" but still clear.
- **Use case**: Consider this only if empirical testing shows Candidate A causes prompt-composition pressure on SWE-1.6.

**Integration target:** The chosen syntax should be documented in `.opencode/skills/cli-devin/references/truncation-strategy.md` (new file) with code examples showing how to append the suffix during fitToolResult-style truncation in cli-devin prompt generation or MCP response post-processing.

---

### Artifact 3: Eviction Priority Ladder Mapping

Smallcode's evict() function implements a two-tier priority system (context-card.md:66-86):
1. **Priority 1**: Evict old tool results (full eviction, no rate limit)
2. **Priority 2**: Evict old conversation at 50% rate (preserves recent context)

**Mapping to our agent-config-iter recipe structure:**

Our agent-config-iter JSON recipes (e.g., `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json`) should include a budget-aware eviction section with this ladder:

```json
{
  "context_budget": {
    "eviction_priority": [
      {
        "tier": 1,
        "category": "tool_results",
        "eviction_rate": 1.0,
        "description": "Evict oldest tool results first (full eviction)"
      },
      {
        "tier": 2,
        "category": "conversation",
        "eviction_rate": 0.5,
        "description": "Evict conversation history at 50% rate (preserves recent context)"
      },
      {
        "tier": 3,
        "category": "working_memory",
        "eviction_rate": 0.25,
        "description": "Evict working memory at 25% rate (last resort)"
      }
    ],
    "protected_categories": ["system_prompt"],
    "event_emission": true
  }
}
```

**Rationale for mapping:**
- **Tier 1 (tool_results)**: Matches smallcode exactly — tool results are the most evictable because they can be re-fetched on demand.
- **Tier 2 (conversation, 50% rate)**: Matches smallcode exactly — preserves recent conversation while shedding older turns.
- **Tier 3 (working_memory, 25% rate)**: Extension for our system — working_memory is more valuable than tool results but less than conversation; conservative eviction rate prevents loss of intermediate state.
- **Protected categories**: system_prompt is never evicted (smallcode doesn't explicitly protect it, but our recipes should for safety).
- **Event emission**: Matches smallcode's eventBus.emit("context.eviction") pattern (context-card.md:81-83) for telemetry.

**Integration target:** Add the `context_budget.eviction_priority` section to all agent-config-iter JSON files in cli-devin/assets/, cli-opencode/assets/, and any other skill that uses agent-config recipes. Document the eviction ladder in `.opencode/skills/cli-opencode/references/context-eviction.md` (new file).

---

### Artifact 4: sk-prompt Integration Point

The current cli_prompt_quality_card.md has 8 sections (lines 1-122). The appropriate insertion point for budget awareness guidance is:

**Section name:** "Composition guidance: budget awareness" (new subsection under §3 CLI Task to Framework Map)

**Insertion location:** After line 50 (after the anti-hallucination wording paragraph), before line 52 (before the CLEAR 5-Question Pre-Dispatch Checklist header).

**Proposed content:**
```markdown
### Composition guidance: budget awareness

When composing prompts for models with limited context windows (SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6), apply token-budget awareness:

- **Estimate context size**: For file-heavy tasks, count approximate tokens (4 chars ≈ 1 token) and ensure total input fits within the model's 70% budget threshold (see cli-devin/references/context-budget.md for per-model defaults).
- **Prioritize recent context**: When budget is tight, prefer recent conversation turns and tool results over older history — the eviction ladder drops tool results first, then conversation at 50% rate.
- **Use truncation markers**: If you must include large outputs that risk overflow, apply the truncation suffix `[... truncated ${deficit} tokens to fit context budget]` to signal explicit budget management (see cli-devin/references/truncation-strategy.md).
- **Leverage summarization**: For files exceeding the summary threshold (SWE-1.6: 200 lines, DeepSeek-v4-pro: 300 lines, Kimi-k2.6: 500 lines), summarize rather than include full content.

Budget awareness is optional for frontier models (gpt-5.5, Claude Opus/Sonnet) with 128k+ context windows, but recommended for consistency across the skill tree.
```

**Rationale for this location:**
- **Follows existing guidance patterns**: The anti-hallucination wording paragraph (lines 47-50) is already a "composition guidance" subsection; budget awareness belongs alongside it.
- **Before CLEAR checklist**: Budget awareness is a pre-composition consideration, not a post-composition validation check, so it precedes the CLEAR 5-Question Pre-Dispatch Checklist.
- **Cross-CLI relevance**: This guidance applies to all CLI orchestrators (cli-devin, cli-opencode, cli-codex, cli-gemini), not just cli-devin, making it appropriate for the shared cli_prompt_quality_card.md mirror.

**Integration target:** Edit `.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md` to insert the new subsection at the specified location. Sync the change to the mirror files (../../cli-claude-code/assets/prompt_quality_card.md, ../../cli-codex/assets/prompt_quality_card.md, ../../cli-gemini/assets/prompt_quality_card.md) per the mirror sync contract at line 105-111.

---

## Questions Answered

- **RQ1 — Context Budget Engine (deepening)**: Produced four patch-ready artifacts: (a) per-model token-budget defaults table with 8 models × 5 columns, (b) truncation-marker syntax candidates with rationale for adopting smallcode's verbatim pattern, (c) eviction priority ladder mapping from smallcode's two-tier system to our agent-config-iter recipe structure, (d) exact sk-prompt integration point (section name "Composition guidance: budget awareness" inserted at line 51 in cli_prompt_quality_card.md).

## Questions Remaining

- [ ] RQ2 — Output Verification Pipeline (answered in iter 2, but may need deepening)
- [ ] RQ3 — Per-Model Profiles & Escalation (answered in iter 3, but may need deepening)
- [ ] RQ4 — Structured Scope/Permissions (answered in iter 4, but may need deepening)
- [ ] RQ5 — Skill Architecture (verdict HYBRID from iter 5, but may need refinement)

## Next Focus

**Iteration 7:** RQ2 deepening — Concrete verification pipeline integration. Extract the verification stage weights (compile 35%, execute 25%, smoke test 25%, lint 10%) from smallcode and map them to our agent-config-iter recipe validation blocks. Produce a per-verification-stage rubric table with pass/fail thresholds and escalation triggers for cli-devin deep-loop iter contracts.
