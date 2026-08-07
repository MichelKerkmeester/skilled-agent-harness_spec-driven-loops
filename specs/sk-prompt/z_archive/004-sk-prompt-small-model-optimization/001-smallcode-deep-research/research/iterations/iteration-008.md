# Iteration 008 — RQ3 Deepening: Concrete Model-Profile Schema + Escalation Matrix

## Focus
RQ3 deepening — Concrete model-profile.json schema + escalation decision matrix. Iter 3 surfaced principles; this iter produces patch-ready specifics: (a) JSON schema for `model-profile.json` covering ≥6 of our models, (b) escalation decision matrix (when_to_downgrade rules, when_to_escalate rules, quota_aware rules — concrete IF/THEN clauses), (c) registry location verdict (Option A vs B), (d) bayesian tool-scoring placement decision.

## Actions Taken

1. **Read baseline iter-003.md** — Reviewed ModelProfile struct pattern, Bayesian scoring with Laplace smoothing, tool demotion thresholds, escalation provider config, and conversation format conversion logic
2. **Read CLI skill files** — Reviewed cli-devin SKILL.md §3 Model Selection, cli-opencode SKILL.md §3 Model Selection, sk-prompt/assets/cli_prompt_quality_card.md (cross-CLI master location), and mcp-code-mode SKILL.md for tool-registry context
3. **Synthesized concrete artifacts** — Built JSON schema, escalation matrix, registry location verdict, and bayesian placement verdict based on smallcode patterns adapted to OpenCode skill tree structure

## Findings

### Artifact 1: Model-Profile JSON Schema

**Schema design rationale**: Adapted from smallcode's ModelProfile struct (iter-003.md:22-35) with OpenCode-specific extensions. The schema lives at `.opencode/skills/sk-prompt/assets/model-profile.json` as the cross-CLI master (Option A — see Artifact 3). Fields include all smallcode primitives plus OpenCode-relevant metadata (provider, tiering, escalation targets, wall-clock timing).

**Full JSON schema with 8 model profiles**:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Model Profile Registry",
  "description": "Per-model capability profiles for CLI orchestrator routing and escalation decisions",
  "type": "object",
  "properties": {
    "models": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Model identifier used in CLI dispatch (e.g., 'swe-1.6', 'deepseek-v4-pro')"
          },
          "provider": {
            "type": "string",
            "description": "Provider name (e.g., 'cognition', 'deepseek', 'moonshot', 'alibaba', 'zhipu', 'openai', 'anthropic')"
          },
          "context_length": {
            "type": "integer",
            "description": "Maximum context window in tokens"
          },
          "max_output_tokens": {
            "type": "integer",
            "description": "Maximum output tokens per completion"
          },
          "tool_calling_support": {
            "type": "boolean",
            "description": "Whether the model supports native tool calling"
          },
          "tool_format": {
            "type": "string",
            "enum": ["native", "hermes", "json", "xml", "text"],
            "description": "Tool calling format (from smallcode ModelProfile)"
          },
          "supports_json_mode": {
            "type": "boolean",
            "description": "Whether the model supports JSON mode"
          },
          "supports_system_message": {
            "type": "boolean",
            "description": "Whether the model supports system messages"
          },
          "chat_template": {
            "type": "string",
            "enum": ["chatml", "llama3", "mistral", "gemma", "phi", "generic", "openai", "anthropic"],
            "description": "Chat template format (from smallcode ModelProfile.template)"
          },
          "strengths": {
            "type": "array",
            "items": {"type": "string"},
            "description": "Model strength tags"
          },
          "weaknesses": {
            "type": "array",
            "items": {"type": "string"},
            "description": "Model weakness tags"
          },
          "stop_sequences": {
            "type": "array",
            "items": {"type": "string"},
            "description": "Stop sequences for generation control"
          },
          "free_tier": {
            "type": "boolean",
            "description": "Whether free tier access is available"
          },
          "pro_tier": {
            "type": "boolean",
            "description": "Whether pro tier access is available"
          },
          "escalation_target": {
            "type": "string",
            "description": "Model ID to escalate to when this model fails (null = no escalation path)"
          },
          "average_iter_wall_clock_min": {
            "type": "number",
            "description": "Average wall-clock minutes per iteration for typical coding tasks"
          }
        },
        "required": ["id", "provider", "context_length", "tool_calling_support", "chat_template", "strengths", "weaknesses", "free_tier", "pro_tier", "escalation_target", "average_iter_wall_clock_min"]
      }
    }
  },
  "required": ["models"],
  "models": [
    {
      "id": "swe-1.6",
      "provider": "cognition",
      "context_length": 128000,
      "max_output_tokens": 8192,
      "tool_calling_support": true,
      "tool_format": "native",
      "supports_json_mode": true,
      "supports_system_message": true,
      "chat_template": "generic",
      "strengths": ["coding-specialized", "fast", "tool-use", "context-gathering"],
      "weaknesses": ["small-model", "requires-clear-prompts", "struggles-with-ambiguous-tasks"],
      "stop_sequences": [],
      "free_tier": true,
      "pro_tier": true,
      "escalation_target": "deepseek-v4-pro",
      "average_iter_wall_clock_min": 2.5
    },
    {
      "id": "deepseek-v4-pro",
      "provider": "deepseek",
      "context_length": 128000,
      "max_output_tokens": 8192,
      "tool_calling_support": true,
      "tool_format": "native",
      "supports_json_mode": true,
      "supports_system_message": true,
      "chat_template": "chatml",
      "strengths": ["complex-reasoning", "coding", "cost-effective", "tool-use"],
      "weaknesses": ["can-hallucinate-on-unfamiliar-apis", "requires-structured-prompts"],
      "stop_sequences": [],
      "free_tier": true,
      "pro_tier": true,
      "escalation_target": "kimi-k2.6",
      "average_iter_wall_clock_min": 4.0
    },
    {
      "id": "kimi-k2.6",
      "provider": "moonshot",
      "context_length": 128000,
      "max_output_tokens": 8192,
      "tool_calling_support": true,
      "tool_format": "native",
      "supports_json_mode": true,
      "supports_system_message": true,
      "chat_template": "chatml",
      "strengths": ["complex-reasoning", "long-context", "chinese-english-bilingual"],
      "weaknesses": ["slower-than-deepseek", "costlier-than-deepseek"],
      "stop_sequences": [],
      "free_tier": false,
      "pro_tier": true,
      "escalation_target": "glm-5.1",
      "average_iter_wall_clock_min": 5.5
    },
    {
      "id": "qwen3.6",
      "provider": "alibaba",
      "context_length": 32768,
      "max_output_tokens": 8192,
      "tool_calling_support": true,
      "tool_format": "hermes",
      "supports_json_mode": false,
      "supports_system_message": true,
      "chat_template": "chatml",
      "strengths": ["coding", "fast", "cost-effective"],
      "weaknesses": ["smaller-context", "less-complex-reasoning-than-frontier"],
      "stop_sequences": [],
      "free_tier": true,
      "pro_tier": true,
      "escalation_target": "swe-1.6",
      "average_iter_wall_clock_min": 2.0
    },
    {
      "id": "glm-5.1",
      "provider": "zhipu",
      "context_length": 128000,
      "max_output_tokens": 8192,
      "tool_calling_support": true,
      "tool_format": "native",
      "supports_json_mode": true,
      "supports_system_message": true,
      "chat_template": "generic",
      "strengths": ["complex-reasoning", "chinese-english-bilingual", "long-context"],
      "weaknesses": ["can-hallucinate", "slower-than-deepseek"],
      "stop_sequences": [],
      "free_tier": false,
      "pro_tier": true,
      "escalation_target": "deepseek-v4-pro",
      "average_iter_wall_clock_min": 4.5
    },
    {
      "id": "gpt-5.5",
      "provider": "openai",
      "context_length": 200000,
      "max_output_tokens": 8192,
      "tool_calling_support": true,
      "tool_format": "native",
      "supports_json_mode": true,
      "supports_system_message": true,
      "chat_template": "openai",
      "strengths": ["frontier-reasoning", "tool-use", "low-hallucination", "broad-knowledge"],
      "weaknesses": ["expensive", "slower-than-small-models"],
      "stop_sequences": [],
      "free_tier": false,
      "pro_tier": true,
      "escalation_target": null,
      "average_iter_wall_clock_min": 6.0
    },
    {
      "id": "claude-opus-4.7",
      "provider": "anthropic",
      "context_length": 200000,
      "max_output_tokens": 8192,
      "tool_calling_support": true,
      "tool_format": "native",
      "supports_json_mode": true,
      "supports_system_message": true,
      "chat_template": "anthropic",
      "strengths": ["frontier-reasoning", "tool-use", "low-hallucination", "excellent-at-ambiguous-tasks"],
      "weaknesses": ["expensive", "slower-than-small-models"],
      "stop_sequences": [],
      "free_tier": false,
      "pro_tier": true,
      "escalation_target": null,
      "average_iter_wall_clock_min": 7.0
    },
    {
      "id": "claude-sonnet-4.7",
      "provider": "anthropic",
      "context_length": 200000,
      "max_output_tokens": 8192,
      "tool_calling_support": true,
      "tool_format": "native",
      "supports_json_mode": true,
      "supports_system_message": true,
      "chat_template": "anthropic",
      "strengths": ["balanced-reasoning", "tool-use", "good-value-frontier", "fast-for-frontier"],
      "weaknesses": ["more-expensive-than-small-models"],
      "stop_sequences": [],
      "free_tier": false,
      "pro_tier": true,
      "escalation_target": "claude-opus-4.7",
      "average_iter_wall_clock_min": 5.0
    }
  ]
}
```

**Field mapping to smallcode ModelProfile**:
- `context_length`, `max_output_tokens`, `tool_calling_support`, `tool_format`, `supports_json_mode`, `supports_system_message`, `chat_template` (was `template`), `strengths`, `weaknesses`, `stop_sequences` — direct from smallcode ModelProfile (iter-003.md:22-35)
- `id`, `provider`, `free_tier`, `pro_tier`, `escalation_target`, `average_iter_wall_clock_min` — OpenCode extensions for routing and escalation

---

### Artifact 2: Escalation Decision Matrix

**Design rationale**: Adapted from smallcode's escalation.js provider config (iter-003.md:168-190) and canEscalate() gate (iter-003.md:226). The matrix defines concrete IF/THEN rules for downgrade, escalate, and quota-aware scenarios.

**Escalation Decision Matrix**:

```yaml
# Escalation Decision Matrix for CLI Orchestrators
# Based on smallcode escalation.js patterns (iter-003.md:168-227)

downgrade_rules:
  # When to downgrade from current model to a smaller/cheaper model
  - condition: "task_complexity_score <= 3 AND current_model_tier == 'frontier'"
    action: "downgrade_to_small_model"
    target_model: "swe-1.6"
    rationale: "Simple tasks don't need frontier reasoning; SWE-1.6 is faster and cheaper"

  - condition: "task_is_context_gathering_only AND current_model != 'swe-1.6'"
    action: "downgrade_to_swe_1_6"
    target_model: "swe-1.6"
    rationale: "Context gathering is SWE-1.6's strength; no need for larger models"

  - condition: "iteration_count >= 3 AND success_rate < 0.4 AND current_model_tier == 'frontier'"
    action: "downgrade_to_mid_tier"
    target_model: "deepseek-v4-pro"
    rationale: "Frontier model struggling on this task; try mid-tier before giving up"

  - condition: "quota_remaining < 0.2 AND current_model_tier == 'frontier'"
    action: "downgrade_to_conserve_quota"
    target_model: "deepseek-v4-pro"
    rationale: "Low quota remaining; conserve frontier model for truly complex tasks"

escalate_rules:
  # When to escalate from current model to a larger/better model
  - condition: "iteration_count >= 2 AND success_rate == 0 AND current_model != profile.escalation_target"
    action: "escalate_to_profile_target"
    target_model: "profile.escalation_target"
    rationale: "Current model failing completely; follow profile escalation chain"

  - condition: "task_complexity_score >= 7 AND current_model_tier == 'small'"
    action: "escalate_to_mid_tier"
    target_model: "deepseek-v4-pro"
    rationale: "Small model insufficient for complex task; escalate to mid-tier"

  - condition: "task_complexity_score >= 9 AND current_model_tier != 'frontier'"
    action: "escalate_to_frontier"
    target_model: "claude-opus-4.7"
    rationale: "Highly complex task requires frontier reasoning"

  - condition: "hallucination_risk_score >= 8 AND current_model in ['deepseek-v4-pro', 'kimi-k2.6', 'glm-5.1']"
    action: "escalate_to_low_hallucination_model"
    target_model: "claude-sonnet-4.7"
    rationale: "High hallucination risk on task; switch to model with better grounding"

  - condition: "ambiguous_requirements_detected AND current_model in ['swe-1.6', 'qwen3.6']"
    action: "escalate_to_ambiguous_task_specialist"
    target_model: "claude-sonnet-4.7"
    rationale: "Ambiguous tasks require models that excel at clarification"

  - condition: "iteration_count >= 5 AND success_rate < 0.3 AND current_model_tier != 'frontier'"
    action: "escalate_to_frontier_as_last_resort"
    target_model: "claude-opus-4.7"
    rationale: "Multiple attempts failing; escalate to frontier as last resort"

quota_aware_rules:
  # When to make decisions based on quota/usage limits
  - condition: "quota_remaining < 0.1 AND task_complexity_score <= 5"
    action: "use_free_tier_only"
    target_model: "swe-1.6"
    rationale: "Critical quota levels; restrict to free tier for non-complex tasks"

  - condition: "quota_remaining < 0.1 AND task_complexity_score >= 6"
    action: "ask_user_for_quota_decision"
    target_model: null
    rationale: "Critical quota but complex task; require user decision on quota vs quality"

  - condition: "quota_remaining >= 0.5 AND task_complexity_score >= 8"
    action: "use_frontier_freely"
    target_model: "claude-opus-4.7"
    rationale: "Ample quota available; use best model for complex tasks"

  - condition: "free_tier_exhausted AND pro_tier_available AND task_complexity_score >= 4"
    action: "switch_to_pro_tier"
    target_model: "deepseek-v4-pro"
    rationale: "Free tier exhausted; switch to pro tier for non-trivial tasks"

  - condition: "session_escalation_count >= 5"
    action: "block_escalation"
    target_model: null
    rationale: "Too many escalations in session; block further escalation (smallcode canEscalate gate: iter-003.md:226)"

session_gates:
  # Session-level escalation limits (from smallcode canEscalate: iter-003.md:226)
  max_escalations_per_session: 5
  max_downgrades_per_session: 10
  escalation_cooldown_min: 5  # Minimum minutes between escalation decisions

conversation_format_conversion:
  # Bidirectional OpenAI <-> Anthropic format conversion (from smallcode escalation.js: iter-003.md:194-214)
  openai_to_anthropic:
    system_message: "Map OpenAI system message to Anthropic system block"
    tool_calls: "Convert OpenAI tool_calls to Anthropic tool_use blocks with tool_use_id"
    tool_results: "Convert OpenAI tool responses to Anthropic tool_result blocks with tool_use_id reference"
  anthropic_to_openai:
    system_message: "Map Anthropic system block to OpenAI system message"
    tool_calls: "Convert Anthropic tool_use blocks to OpenAI tool_calls with function.name and arguments"
    tool_results: "Convert Anthropic tool_result blocks to OpenAI tool responses"
```

**Rule priority order** (evaluated top-to-bottom, first match wins):
1. Session gates (max escalations, cooldown) — checked first
2. Quota-aware rules — checked second
3. Escalate rules — checked third
4. Downgrade rules — checked last (most conservative)

**Implementation note**: The `profile.escalation_target` field in escalate_rules references the model-profile.json escalation_target field, enabling automatic escalation chain following (e.g., swe-1.6 → deepseek-v4-pro → kimi-k2.6 → glm-5.1).

---

### Artifact 3: Registry Location Verdict

**Decision**: Option A — `.opencode/skills/sk-prompt/assets/model-profile.json`

**Rationale**:

1. **Cross-CLI master location**: sk-prompt is the cross-CLI master for prompt quality guidance (evidenced by cli_prompt_quality_card.md mirror sync to cli-claude-code, cli-codex, cli-gemini at lines 105-111). Placing model-profile.json in sk-prompt/assets makes it a shared asset accessible to all CLI orchestrators.

2. **Logical cohesion**: Model profiles inform prompt construction decisions (framework selection, pre-planning density, bundle-gate strictness). sk-prompt already owns the CLI Prompt Quality Card (cli_prompt_quality_card.md) which documents framework selection and pre-planning density rules (lines 22-51). Model profiles extend this guidance by adding model-specific capability metadata.

3. **Avoids duplication**: A top-level config file (Option B) would require each CLI skill to implement its own loading logic and risk drift. By centralizing in sk-prompt/assets, all CLI skills can reference the same source of truth via the existing mirror sync pattern.

4. **Consistent with existing patterns**: sk-prompt/assets already contains cli_prompt_quality_card.md as a shared asset. Adding model-profile.json follows the same pattern and leverages the existing mirror sync infrastructure.

5. **Skill tree hygiene**: sk-prompt is a cross-cutting skill focused on prompt quality across all CLI orchestrators. Model profiles are fundamentally about understanding model capabilities to construct better prompts — this aligns with sk-prompt's mission.

**Implementation path**:
- Create `.opencode/skills/sk-prompt/assets/model-profile.json` with the schema from Artifact 1
- Add mirror sync entries to cli_prompt_quality_card.md mirror section for cli-devin, cli-opencode, cli-codex, cli-gemini, cli-claude-code
- Update each CLI skill's SKILL.md to reference the shared model-profile.json path for model selection logic

---

### Artifact 4: Bayesian Tool-Scoring Placement Verdict

**Decision**: cli-* iter recipes per-call (NOT mcp-code-mode tool-registry layer)

**Rationale**:

1. **Per-iteration model selection is a CLI orchestrator concern**: Bayesian tool scoring informs which model to select for a specific dispatch based on historical performance. This is a routing decision made by the CLI skill (cli-devin, cli-opencode, etc.) before composing the dispatch prompt. It is NOT an external MCP tool concern.

2. **mcp-code-mode is for external API integration**: mcp-code-mode's purpose is orchestrating external MCP tools (ClickUp, Notion, Figma, Chrome DevTools, etc.) through TypeScript execution (SKILL.md lines 1-13). It is not designed for internal routing decisions within the OpenCode skill tree. Placing bayesian scoring there would conflate external API orchestration with internal model selection.

3. **Historical state belongs in the skill tree**: Tool success/failure tracking requires persistent state across sessions. The natural location for this state is within the skill tree (e.g., `.opencode/skills/cli-devin/state/tool_scores.json`), not in the mcp-code-mode layer which is focused on external tool execution.

4. **Per-call flexibility**: cli-* iter recipes can apply bayesian scoring differently per CLI based on their specific model portfolios and use cases. For example:
   - cli-devin: score SWE-1.6 vs DeepSeek v4 for coding tasks
   - cli-opencode: score deepseek-v4-pro vs kimi-k2.6 vs glm-5.1 for complex reasoning tasks
   - cli-codex: score gpt-5.5 vs claude-sonnet-4.7 for review tasks

   A centralized mcp-code-mode layer would lose this per-CLI flexibility.

5. **Laplace smoothing formula is simple enough to inline**: The core formula `(successes + 1) / (total + 2)` (iter-003.md:119-121) is trivial to implement in each CLI skill's iter recipe. There's no complexity that warrants a centralized abstraction layer.

6. **Tool demotion thresholds are CLI-specific**: The demotion threshold `total_calls >= 3 AND confidence < 0.35` (iter-003.md:142-147) may need tuning per CLI based on their model behavior. A centralized layer would make per-CLI tuning harder.

**Implementation path**:
- Each CLI skill (cli-devin, cli-opencode, cli-codex, cli-gemini, cli-claude-code) implements its own tool scoring state file at `<skill>/state/tool_scores.json`
- Each CLI skill's iter recipe includes a bayesian_scoring() helper function implementing Laplace smoothing: `confidence = (successes + 1) / (total + 2)`
- Each CLI skill's iter recipe includes a should_demote() helper implementing the demotion threshold: `total_calls >= 3 AND confidence < 0.35`
- Each CLI skill's iter recipe loads tool_scores.json at dispatch start, updates after each tool call, and persists before session end
- The scoring state is NOT shared across CLI skills — each maintains its own historical data per its model portfolio

**Why NOT mcp-code-mode tool-registry**:
- mcp-code-mode's tool-registry layer is for discovering and calling external MCP tools (MyService, Figma, etc.), not for internal routing decisions
- Adding internal model selection logic to mcp-code-mode would violate its single responsibility (external API orchestration)
- The context reduction benefit of mcp-code-mode (98% reduction: SKILL.md line 26) applies to external MCP tool schemas, not to internal model selection logic which is already small

---

## Questions Answered

- **RQ3.6**: What is the concrete JSON schema for model-profile.json? → Full schema provided with 8 model profiles covering SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6, GLM-5.1, gpt-5.5, Opus, Sonnet with all required fields
- **RQ3.7**: What are the concrete escalation decision matrix rules? → IF/THEN rules provided for downgrade, escalate, and quota-aware scenarios with session gates and conversation format conversion
- **RQ3.8**: Where should the model-profile.json registry live? → Option A: `.opencode/skills/sk-prompt/assets/model-profile.json` as cross-CLI master location
- **RQ3.9**: Where should bayesian tool-scoring logic live? → cli-* iter recipes per-call, NOT in mcp-code-mode tool-registry layer

## Questions Remaining

- RQ4 — Structured Scope/Permissions (next iteration)
- RQ5 — Skill Architecture (synthesis iteration)

## Next Focus

RQ4 — Structured Scope/Permissions. Investigate smallcode's tool registry patterns for structural tool contracts, category-based permissions, and 2-stage routing that halves schema context overhead. (Note: smallcode source files not available in external/; will work from iter-003 baseline principles and investigate OpenCode's existing permission systems.)
