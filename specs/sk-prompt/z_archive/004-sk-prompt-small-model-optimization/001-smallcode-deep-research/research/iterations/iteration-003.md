# Iteration 003 — RQ3: Per-Model Profiles & Escalation

## Focus
RQ3 — Per-Model Profiles & Escalation. Identify reusable patterns from smallcode's per-model profile system, Bayesian tool scorer, and local→cloud escalation engine.

## Actions Taken

1. **Read preflight context-card §RQ3** — Reviewed structured pattern map of profiles + Bayesian scoring + escalation with 34 citations
2. **Read source files** — 
   - `src/model/profiles.ms` (202 lines) — ModelProfile struct, BUILTIN_PROFILES map, loadProfile() lookup
   - `src/governor/tool_scorer.ms` (142 lines) — ToolScore struct, Bayesian confidence with Laplace smoothing, shouldAvoid() demotion
   - `bin/escalation.js` (244 lines) — ESCALATION_PROVIDERS config, conversation format conversion, canEscalate() gate
3. **Read target skill tree** — Reviewed cli-devin SKILL.md Model Selection table (§3) and mcp-code-mode SKILL.md for integration context

## Findings

### Pattern 1: Per-Model Profile Schema

**Smallcode primitive:**
```ms
// src/model/profiles.ms:7-19
pub struct ModelProfile {
  name: String
  context_length: Int
  max_output_tokens: Int
  supports_tool_calling: Bool
  tool_format: String           // "native" | "hermes" | "json" | "xml" | "text"
  supports_json_mode: Bool
  supports_system_message: Bool
  template: String              // "chatml" | "llama3" | "mistral" | "gemma" | "phi" | "generic"
  strengths: List<String>
  weaknesses: List<String>
  stop_sequences: List<String>
}
```

**Candidate target path:** `.opencode/skills/cli-devin/references/model-profile-schema.md` (new reference doc) OR `.opencode/skills/sk-small-model/assets/model-profile.json` (shared asset if we create a small-model optimization skill)

**Patch shape:** Add JSON schema extending cli-devin's existing Model Selection table (§3) to include small-model-specific fields: `tool_format`, `template`, `strengths`, `weaknesses`, `stop_sequences`. Current cli-devin model table only has Model ID and Use Case.

**Acceptance criteria:** 
- JSON schema validates all 12 ModelProfile fields
- Includes example profiles for 3 common small models (Qwen 2.5 Coder, Phi-3 Mini, DeepSeek Coder v2 Lite)
- Maps tool_format enum to Devin's tool-calling modes
- Documents template mapping to chat template formats

---

### Pattern 2: Profile Lookup with Substring Matching

**Smallcode primitive:**
```ms
// src/model/profiles.ms:156-187
pub fn loadProfile(modelName: String): ModelProfile {
  // Check for custom profile file
  let profilePath = "profiles/${modelName}.toml"
  if pathExists(profilePath) {
    let raw = readFile(profilePath)
    let parsed = parseToml(raw)
    return parsed as ModelProfile
  }

  // Check built-in profiles (match by substring for flexibility)
  for (key, profile) in BUILTIN_PROFILES {
    if modelName.contains(key) || key.contains(modelName) {
      return profile
    }
  }

  // Default fallback profile for unknown models
  return ModelProfile {
    name: modelName,
    context_length: 8192,       // Conservative default
    max_output_tokens: 4096,
    supports_tool_calling: false,
    tool_format: "text",        // Safest default
    supports_json_mode: false,
    supports_system_message: true,
    template: "chatml",         // Most common
    strengths: [],
    weaknesses: ["unknown_capabilities"],
    stop_sequences: [],
  }
}
```

**Candidate target path:** `.opencode/skills/cli-opencode/references/model-detection.md` (new reference doc) OR integrate into cli-devin's Model Selection logic

**Patch shape:** Add lookup function that implements 3-tier fallback: custom config → built-in registry (substring match) → conservative default. Document substring matching heuristic for flexible model name matching (e.g., "qwen2.5-coder-7b-instruct" matches "qwen2.5-coder-7b").

**Acceptance criteria:**
- Implements 3-tier fallback: custom → built-in (substring) → default
- Substring matching is bidirectional (modelName.contains(key) || key.contains(modelName))
- Default profile uses conservative assumptions (8192 context, no tool calling, text format)
- Returns structured ModelProfile object with all 12 fields populated

---

### Pattern 3: Bayesian Tool Scoring with Laplace Smoothing

**Smallcode primitive:**
```ms
// src/governor/tool_scorer.ms:14-23
pub struct ToolScore {
  tool_name: String
  task_type: String
  success_count: Int
  failure_count: Int
  total_calls: Int
  avg_latency_ms: Int
  confidence: Float      // Bayesian: success / (success + failure + 2) — Laplace smoothed
  last_error: String?
}
```

```ms
// src/governor/tool_scorer.ms:106-109
fn computeConfidence(self, score: ToolScore): Float {
  // (successes + 1) / (total + 2) — Laplace smoothing
  return (score.success_count + 1).toFloat() / (score.total_calls + 2).toFloat()
}
```

**Candidate target path:** `.opencode/skills/cli-devin/references/tool-scoring.md` (new reference doc) OR integrate into mcp-code-mode's tool orchestration logic

**Patch shape:** Add Bayesian confidence calculation using Laplace smoothing: `confidence = (successes + 1) / (total + 2)`. This prevents division by zero and gives unknown tools a baseline 0.5 confidence. Include exploration bonus (0.15) and confidence cap (0.95) to prevent lockout.

**Acceptance criteria:**
- Implements Laplace smoothing formula: (successes + 1) / (total + 2)
- Unknown tools (0 calls) return baseline confidence 0.5 + exploration_bonus (0.15) = 0.65
- Confidence capped at 0.95 to prevent tools from being permanently locked out
- Tracks success/failure per (tool_name, task_type) tuple
- Persists scores across sessions via JSON file (`.smallcode/tool_scores.json` in smallcode; adapt to skill tree location)

---

### Pattern 4: Tool Demotion Thresholds

**Smallcode primitive:**
```ms
// src/governor/tool_scorer.ms:85-91
pub fn shouldAvoid(self, toolName: String, taskType: String): Bool {
  let key = "${toolName}:${taskType}"
  if !self.scores.has(key) { return false }
  let score = self.scores.get(key)
  return score.total_calls >= 3 && score.confidence < 0.35
}
```

**Candidate target path:** `.opencode/skills/cli-devin/references/tool-demotion.md` (new reference doc) OR integrate into cli-devin's tool selection logic

**Patch shape:** Add demotion logic that flags tools for avoidance when: (1) minimum data threshold (≥3 calls) AND (2) confidence below threshold (<0.35). This prevents premature demotion while reliably filtering out broken tools.

**Acceptance criteria:**
- Implements two-condition demotion: total_calls >= 3 AND confidence < 0.35
- Returns false for unknown tools (no data yet)
- Returns false for tools with insufficient data (<3 calls) even if confidence is low
- Returns true only when both conditions are met (enough data + poor performance)
- Documented threshold rationale: 3 calls = minimum sample size, 0.35 = ~30% success rate after Laplace smoothing

---

### Pattern 5: Escalation Provider Config + Conversation Format Conversion

**Smallcode primitive:**
```js
// bin/escalation.js:12-35
const ESCALATION_PROVIDERS = {
  anthropic: {
    name: 'Claude',
    baseUrl: 'https://api.anthropic.com/v1',
    envKey: 'ANTHROPIC_API_KEY',
    defaultModel: 'claude-sonnet-4-20250514',
    models: ['claude-sonnet-4-20250514', 'claude-haiku-4-20250514', 'claude-opus-4-20250514'],
  },
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    envKey: 'OPENAI_API_KEY',
    defaultModel: 'gpt-4o-mini',
    models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo'],
  },
  deepseek: {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    envKey: 'DEEPSEEK_API_KEY',
    defaultModel: 'deepseek-coder',
    models: ['deepseek-coder', 'deepseek-chat'],
  },
};
```

```js
// bin/escalation.js:154-181 (Anthropic format conversion)
const anthropicMessages = nonSystem.map(m => {
  if (m.role === 'tool') {
    return {
      role: 'user',
      content: [{ type: 'tool_result', tool_use_id: m.tool_call_id, content: m.content }],
    };
  }
  if (m.tool_calls) {
    return {
      role: 'assistant',
      content: m.tool_calls.map(tc => ({
        type: 'tool_use',
        id: tc.id,
        name: tc.function.name,
        input: JSON.parse(tc.function.arguments || '{}'),
      })),
    };
  }
  return { role: m.role, content: m.content };
});
```

**Candidate target path:** `.opencode/skills/cli-devin/references/escalation-engine.md` (extend existing cloud_handoff.md) OR `.opencode/skills/mcp-code-mode/references/provider-config.md` (for multi-provider MCP orchestration)

**Patch shape:** Extend cli-devin's existing cloud_handoff reference to include: (1) provider config schema (name, baseUrl, envKey, defaultModel, models), (2) OpenAI ↔ Anthropic conversation format conversion for tool calls and tool results, (3) canEscalate() gate with session limits (default 5 per session), (4) auto-detection from env vars in preference order.

**Acceptance criteria:**
- Provider config includes: name, baseUrl, envKey, defaultModel, models array
- Implements OpenAI → Anthropic format conversion for: system messages, tool calls, tool results
- Implements Anthropic → OpenAI format conversion for response handling
- canEscalate() checks: enabled flag AND session count < max_per_session (default 5)
- Auto-detects providers from env vars in preference order: ANTHROPIC_API_KEY → OPENAI_API_KEY → DEEPSEEK_API_KEY
- Includes escalation-specific system prompt template ("expert coding assistant called in as escalation support")

---

## Questions Answered

- **RQ3.1:** What is the structure of smallcode's per-model profile system? → ModelProfile struct with 12 fields (context_length, tool_format, template, strengths/weaknesses, stop_sequences)
- **RQ3.2:** How does profile lookup handle unknown models? → 3-tier fallback: custom file → built-in substring match → conservative default
- **RQ3.3:** How does Bayesian tool scoring work? → Laplace smoothing: (successes + 1) / (total + 2), with exploration bonus (0.15) and confidence cap (0.95)
- **RQ3.4:** What are the tool demotion thresholds? → total_calls >= 3 AND confidence < 0.35
- **RQ3.5:** How does escalation conversation format conversion work? → Bidirectional OpenAI ↔ Anthropic conversion for tool calls/results, with provider config schema

## Questions Remaining

- RQ4 — Structured Scope/Permissions (next iteration)
- RQ5 — Skill Architecture (synthesis iteration)

## Next Focus

RQ4 — Structured Scope/Permissions. Read smallcode's tool registry (`src/tools/registry.ms`) to identify patterns for structural tool contracts, category-based permissions, and 2-stage routing that halves schema context overhead.
