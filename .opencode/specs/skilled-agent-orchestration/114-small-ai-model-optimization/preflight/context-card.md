## Overview

SmallCode is a terminal-native AI coding agent purpose-built for 7B–20B local models, designed to extract useful work from models with limited context windows (4k-32k tokens) and unreliable tool calling. It achieves 87% single-file task success on Gemma 4 E4B (4B active parameters) — outperforming OpenCode and Pi Agent running on models 3-4x larger (COMPARISON.md:49-62). The architecture compensates for small model limitations through a context budget engine, forgiving multi-format tool call parser, 2-stage tool routing, TODO-driven planning, and patch-first editing (README.md:5-16, PLAN.md:52-60).

The v0.2.2 release (May 2026) shipped three major features: BoneScript integration (one `.bone` file → complete Node.js/TypeScript backend), model escalation engine (auto-fallback to Claude/OpenAI/DeepSeek on hard fail), and a fullscreen TUI with alternate buffer (CHANGELOG.md:3-38). SmallCode uses a dual-layer architecture: a MarrowScript system declaration that compiles to a deterministic runtime, plus an imperative JavaScript layer for TUI, tool implementations, and the context budget engine (PLAN.md:23-48). The system is fully local-first with no network required by default, though escalation to cloud models is opt-in (README.md:32-59, smallcode.toml:32-39).

Key architectural differentiators include: token budget management that never exceeds 70% of context window (smallcode.toml:9-12), compound tools that reduce call chains for tiny models, a Bayesian tool scorer with Laplace smoothing that learns what works over time, and a hard-fail gatekeeper that refuses to deliver broken code after verification failures (README.md:91-108, PLAN.md:330-343). The tool registry uses a simple category-based structure (read/write/search/run/plan/web) with 2-stage routing to halve schema context overhead (PLAN.md:164-172, src/tools/registry.ms:8-14).

## RQ1 — Context Budget Engine

The context budget engine is SmallCode's core differentiator for small models, managing token allocation across system prompt, working memory, conversation history, and tool results to prevent context overflow. It uses percentage-based budgeting (default 70% of context window), automatic truncation with informative suffixes, and eviction priority (old tool results → old conversation → system prompt sections) (src/context/budget.ms:9-13, PLAN.md:119-124). The engine tracks approximate token counts (4 chars ≈ 1 token), provides per-category allocation visibility, and integrates with an event bus for eviction notifications (src/context/budget.ms:6-8, 80-83).

**Key files:**
- src/context/budget.ms:9-13 — BudgetConfig struct with max_budget_pct, working_memory_tokens, summary_threshold
- src/context/budget.ms:55-67 — totalBudget() and available() calculations
- src/context/budget.ms:109-126 — fitToolResult() with truncation logic
- src/context/budget.ms:140-163 — evict() with priority-based cleanup
- src/context/budget.ms:176-193 — usagePct() and formatUsage() for status display

```ms
// src/context/budget.ms:9-13
pub struct BudgetConfig {
  max_budget_pct: Int       // % of context window for tool results + content
  working_memory_tokens: Int
  summary_threshold: Int    // line count above which files get summarized
}
```

```ms
// src/context/budget.ms:55-67
pub fn totalBudget(self): Int {
  return (self.model_context_length * self.config.max_budget_pct) / 100
}

pub fn available(self): Int {
  let used = self.current_usage.system_prompt
    + self.current_usage.working_memory
    + self.current_usage.conversation
    + self.current_usage.tool_results
  return max(0, self.totalBudget() - used)
}
```

```ms
// src/context/budget.ms:109-126
pub fn fitToolResult(self, text: String, maxPct: Int = 40): String {
  let maxTokens = (self.totalBudget() * maxPct) / 100
  let available = min(maxTokens, self.available())
  let tokens = countTokens(text)

  if tokens <= available {
    self.current_usage.tool_results += tokens
    return text
  }

  let maxChars = available * CHARS_PER_TOKEN
  let truncated = text.slice(0, maxChars)
  let suffix = "\n\n[... truncated ${tokens - available} tokens to fit context budget]"
  self.current_usage.tool_results += available
  return truncated + suffix
}
```

```ms
// src/context/budget.ms:140-163
pub fn evict(self, needed: Int): Int {
  let freed = 0

  if self.current_usage.tool_results > 0 {
    let evictable = min(self.current_usage.tool_results, needed - freed)
    self.current_usage.tool_results -= evictable
    freed += evictable
  }

  if freed < needed && self.current_usage.conversation > 0 {
    let evictable = min(self.current_usage.conversation / 2, needed - freed)
    self.current_usage.conversation -= evictable
    freed += evictable
  }

  if self.eventBus {
    self.eventBus.emit("context.eviction", { freed: freed, needed: needed })
  }

  return freed
}
```

```ms
// src/context/budget.ms:128-131
pub fn shouldSummarize(self, lineCount: Int): Bool {
  return lineCount > self.config.summary_threshold
}
```

**Mapping to our skill system:**
- BudgetConfig + allocation logic → candidate target: cli-devin/references/context-budget.md
- fitToolResult truncation → candidate target: cli-devin/references/truncation-strategy.md
- evict() priority system → candidate target: cli-opencode/references/context-eviction.md
- shouldSummarize file summarization → candidate target: cli-devin/references/file-summarization.md
- Usage tracking + formatUsage → candidate target: cli-devin/references/token-usage-display.md

## RQ2 — Output Verification Pipeline

The verification pipeline implements an ARK-inspired multi-stage check: structural validation (placeholders, truncation, balanced braces), compilation, execution with timeout, auto-generated smoke tests, and linting (src/governor/verifier.ms:1-3, 119-145). Each stage returns a StageResult with pass/fail status and error list; the pipeline computes a calibrated confidence score (0.0-1.0) weighted by compile (35%), execute (25%), smoke test (25%), lint (10%), with a slight penalty for auto-fixes (src/governor/verifier.ms:252-260). The hard-fail gatekeeper refuses to deliver code when all attempts fail to compile or execute after max retries, returning a GovernorAction.HardFail with a formatted error message instead of claiming success (src/governor/hard_fail.ms:89-105, bin/governor.js:129-164).

**Key files:**
- src/governor/verifier.ms:10-20 — VerificationResult struct with confidence, compiled, executed, tests_passed, hard_fail
- src/governor/verifier.ms:32-102 — verify() full pipeline with 5 stages
- src/governor/verifier.ms:121-145 — checkStructural() for placeholders, truncation, balanced braces
- src/governor/verifier.ms:147-171 — compile() with language-specific commands
- src/governor/hard_fail.ms:29-70 — checkOutput() with retry/decompose/hard_fail logic

```ms
// src/governor/verifier.ms:10-20
pub struct VerificationResult {
  passed: Bool
  confidence: Float           // 0.0 - 1.0 calibrated
  compiled: Bool
  executed: Bool
  tests_passed: Bool
  lint_clean: Bool
  auto_fixed: Bool
  errors: List<String>
  hard_fail: Bool             // true = refuse to deliver
}
```

```ms
// src/governor/verifier.ms:32-102
pub fn verify(self, filePath: String): VerificationResult {
  let result = VerificationResult {
    passed: false,
    confidence: 0.0,
    compiled: false,
    executed: false,
    tests_passed: false,
    lint_clean: false,
    auto_fixed: false,
    errors: [],
    hard_fail: false,
  }

  let structural = self.checkStructural(content)
  if !structural.passed {
    result.errors.append(structural.errors)
    let fixed = self.autoFix(content, ext)
    if fixed != content {
      writeFile(fullPath, fixed)
      content = fixed
      result.auto_fixed = true
    }
  }

  let compileResult = self.compile(filePath, ext)
  result.compiled = compileResult.passed
  if !compileResult.passed {
    result.errors.append(compileResult.errors)
  }

  if result.compiled {
    let execResult = self.execute(filePath, ext)
    result.executed = execResult.passed
    if !execResult.passed {
      result.errors.append(execResult.errors)
    }
  }

  if result.compiled && result.executed {
    let testResult = self.smokeTest(filePath, ext, content)
    result.tests_passed = testResult.passed
    if !testResult.passed {
      result.errors.append(testResult.errors)
    }
  }

  let lintResult = self.lint(filePath, ext)
  result.lint_clean = lintResult.passed

  result.confidence = self.computeConfidence(result)
  result.passed = result.compiled && result.executed
  return result
}
```

```ms
// src/governor/verifier.ms:121-145
fn checkStructural(self, content: String): StageResult {
  let errors = []

  let placeholders = ["// TODO", "// ...", "/* ... */", "pass  # placeholder", "raise NotImplementedError"]
  for p in placeholders {
    if content.contains(p) {
      errors.push("Contains placeholder: ${p}")
    }
  }

  if content.contains("// ... rest of") || content.contains("# ... more") {
    errors.push("Appears truncated")
  }

  let openBraces = content.chars().filter(|c| c == '{').length
  let closeBraces = content.chars().filter(|c| c == '}').length
  if openBraces != closeBraces {
    errors.push("Unbalanced braces: ${openBraces} open, ${closeBraces} close")
  }

  return StageResult { passed: errors.isEmpty(), errors: errors }
}
```

```ms
// src/governor/verifier.ms:252-260
fn computeConfidence(self, result: VerificationResult): Float {
  let score = 0.0
  if result.compiled { score += 0.35 }
  if result.executed { score += 0.25 }
  if result.tests_passed { score += 0.25 }
  if result.lint_clean { score += 0.10 }
  if result.auto_fixed { score -= 0.05 }
  return score
}
```

```ms
// src/governor/hard_fail.ms:29-70
pub fn checkOutput(self, filePath: String, taskType: String, toolUsed: String): GovernorAction {
  let result = self.verifier.verify(filePath)
  self.history.push(result)

  if result.passed {
    self.scorer.recordSuccess(toolUsed, taskType, 0)
    self.eventBus.emit("governor.verified", {
      file: filePath,
      confidence: result.confidence,
      compiled: result.compiled,
      executed: result.executed,
    })
    return GovernorAction.Accept { confidence: result.confidence }
  }

  if self.verifier.shouldHardFail(self.history) {
    self.scorer.recordFailure(toolUsed, taskType, result.errors.first() ?? "verification failed")
    self.eventBus.emit("governor.hard_fail", {
      file: filePath,
      attempts: self.history.length,
      errors: result.errors,
    })
    return GovernorAction.HardFail {
      reason: formatHardFail(filePath, result, self.history.length),
    }
  }

  return GovernorAction.Retry {
    errors: result.errors,
    attempt: self.history.length,
    maxAttempts: self.maxRetries,
    escalate: self.history.length >= 2,
  }
}
```

**Mapping to our skill system:**
- Multi-stage verification pipeline → candidate target: cli-devin/references/verification-pipeline.md
- Structural checks (placeholders, truncation, braces) → candidate target: cli-opencode/references/structural-validation.md
- Language-specific compile/execute commands → candidate target: cli-devin/references/language-commands.md
- Auto-generated smoke tests → candidate target: cli-devin/references/smoke-tests.md
- Hard fail gatekeeper logic → candidate target: cli-devin/references/hard-fail-policy.md

## RQ3 — Per-Model Profiles & Escalation

Model profiles encode per-model capabilities including context length, tool format (native/hermes/json/xml/text), chat template, strengths/weaknesses, and stop sequences (src/model/profiles.ms:7-19). Built-in profiles cover popular small coding models (Qwen 2.5, DeepSeek Coder, CodeLlama, StarCoder2, Mistral Nemo, Phi-3, etc.) with substring matching for flexible lookup, falling back to a conservative default profile for unknown models (src/model/profiles.ms:22-187). The Bayesian tool scorer tracks success/failure per tool per task type using Laplace smoothing: confidence = (successes + 1) / (total + 2), with an exploration bonus for unknown tools and a 95% confidence cap to prevent lockout (src/governor/tool_scorer.ms:10-22, 106-109). The escalation engine provides opt-in local→cloud fallback to Claude/OpenAI/DeepSeek when the local model hard fails after decompose attempts, with session limits (default 5) and confirmation prompts (bin/escalation.js:12-35, 97-118).

**Key files:**
- src/model/profiles.ms:7-19 — ModelProfile struct with context_length, tool_format, template, strengths/weaknesses
- src/model/profiles.ms:22-153 — BUILTIN_PROFILES map with 10+ model definitions
- src/model/profiles.ms:156-187 — loadProfile() with custom file → built-in → fallback lookup
- src/governor/tool_scorer.ms:14-23 — ToolScore struct with Laplace-smoothed confidence
- src/governor/tool_scorer.ms:36-57 — recordSuccess/recordFailure with Bayesian updates

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

```ms
// src/model/profiles.ms:22-35
const BUILTIN_PROFILES: Map<String, ModelProfile> = {
  "qwen2.5-coder-7b": ModelProfile {
    name: "qwen2.5-coder-7b",
    context_length: 32768,
    max_output_tokens: 8192,
    supports_tool_calling: true,
    tool_format: "hermes",
    supports_json_mode: true,
    supports_system_message: true,
    template: "chatml",
    strengths: ["code_completion", "refactoring", "python", "typescript"],
    weaknesses: ["long_planning", "multi_file_coordination"],
    stop_sequences: ["", "<|im_end|>"],
  },
  // ... more profiles
}
```

```ms
// src/model/profiles.ms:156-187
pub fn loadProfile(modelName: String): ModelProfile {
  let profilePath = "profiles/${modelName}.toml"
  if pathExists(profilePath) {
    let raw = readFile(profilePath)
    let parsed = parseToml(raw)
    return parsed as ModelProfile
  }

  for (key, profile) in BUILTIN_PROFILES {
    if modelName.contains(key) || key.contains(modelName) {
      return profile
    }
  }

  return ModelProfile {
    name: modelName,
    context_length: 8192,
    max_output_tokens: 4096,
    supports_tool_calling: false,
    tool_format: "text",
    supports_json_mode: false,
    supports_system_message: true,
    template: "chatml",
    strengths: [],
    weaknesses: ["unknown_capabilities"],
    stop_sequences: [],
  }
}
```

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
  return (score.success_count + 1).toFloat() / (score.total_calls + 2).toFloat()
}
```

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

**Mapping to our skill system:**
- ModelProfile struct + BUILTIN_PROFILES → candidate target: cli-devin/references/model-profiles.md
- loadProfile() lookup logic → candidate target: cli-opencode/references/model-detection.md
- Bayesian tool scoring with Laplace smoothing → candidate target: cli-devin/references/tool-scoring.md
- shouldAvoid() demotion logic → candidate target: cli-devin/references/tool-demotion.md
- Escalation provider config + canEscalate() → candidate target: cli-devin/references/escalation-engine.md

## RQ4 — Structured Scope/Permissions

SmallCode's tool registry uses a simple structural contract: each tool is a ToolDef with id, category (read/write/search/run/plan/web), description, parameters list, and execute function (src/tools/registry.ms:8-14). Permissions are encoded via enabled/disabled lists in the config rather than prose constraints — the registry filters active tools by checking both lists (src/tools/registry.ms:36-40, 66-70). The 2-stage routing system halves schema context overhead by first having the model pick a category, then injecting only that category's tool schemas (src/tools/registry.ms:116-131, PLAN.md:164-172). This structural approach contrasts with OpenCode's Effect-based system and is more robust for small models that struggle with complex permission prose (src/tools/registry.ms:1-4).

**Key files:**
- src/tools/registry.ms:8-14 — ToolDef, ToolParam, ToolContext, ToolResult structs
- src/tools/registry.ms:36-40 — ToolRegistry with enabled/disabled lists
- src/tools/registry.ms:66-70 — active() filtering logic
- src/tools/registry.ms:116-131 — categoryDescriptions() for 2-stage routing
- src/tools/registry.ms:133-277 — registerBuiltins() with 15+ tool definitions

```ms
// src/tools/registry.ms:8-14
pub struct ToolDef {
  id: String
  category: String            // "read" | "write" | "search" | "run" | "plan" | "web"
  description: String
  parameters: List<<ToolParam>
  execute: fn(Map<String, Any>, ToolContext) -> ToolResult
}

pub struct ToolParam {
  name: String
  type: String        // "string" | "int" | "bool" | "list"
  description: String
  required: Bool
  default: Any?
}
```

```ms
// src/tools/registry.ms:36-40
pub struct ToolRegistry {
  tools: Map<String, ToolDef>
  enabled: List<String>
  disabled: List<String>
}
```

```ms
// src/tools/registry.ms:66-70
pub fn active(self): List<<ToolDef> {
  return self.tools.values()
    .filter(|t| self.enabled.contains(t.id) && !self.disabled.contains(t.id))
    .toList()
}
```

```ms
// src/tools/registry.ms:116-131
pub fn categoryDescriptions(self): String {
  let cats = {
    "read": "Read files, view code, inspect content",
    "write": "Create or edit files (patch, write)",
    "search": "Find files or search code content",
    "run": "Execute shell commands",
    "plan": "Manage tasks, working memory, planning",
    "web": "Search the internet, fetch URLs",
  }

  return cats.entries()
    .filter(|(cat, _)| self.byCategory(cat).length > 0)
    .map(|(cat, desc)| "- ${cat}: ${desc}")
    .join("\n")
}
```

```ms
// src/tools/registry.ms:137-170
self.register(ToolDef {
  id: "read_file",
  category: "read",
  description: "Read file contents. Shows signatures for large files, full content for small ones. Use start_line/end_line for specific ranges.",
  parameters: [
    ToolParam { name: "path", type: "string", description: "File path to read", required: true, default: null },
    ToolParam { name: "start_line", type: "int", description: "Start line (1-indexed)", required: false, default: null },
    ToolParam { name: "end_line", type: "int", description: "End line (1-indexed)", required: false, default: null },
  ],
  execute: builtinReadFile,
})

self.register(ToolDef {
  id: "patch",
  category: "write",
  description: "Edit a file by replacing a specific string with new content. The old_str must match exactly one location in the file.",
  parameters: [
    ToolParam { name: "path", type: "string", description: "File to edit", required: true, default: null },
    ToolParam { name: "old_str", type: "string", description: "Exact text to find and replace", required: true, default: null },
    ToolParam { name: "new_str", type: "string", description: "Replacement text", required: true, default: null },
  ],
  execute: builtinPatch,
})
```

**Mapping to our skill system:**
- ToolDef structural contract → candidate target: cli-devin/references/tool-registry-struct.md
- Category-based permissions → candidate target: cli-opencode/references/tool-categories.md
- enabled/disabled filtering → candidate target: cli-devin/references/tool-filtering.md
- 2-stage routing system → candidate target: cli-devin/references/two-stage-routing.md
- Parameter schema generation → candidate target: cli-opencode/references/tool-schema-gen.md

## RQ5 — Architecture Synthesis

SmallCode's agent loop is wired through bin/smallcode.js as the bootstrap entry point, which initializes the governor (tool scoring + verification), escalation engine, plugin/skill systems, session persistence, and the budget-aware-mcp code graph (bin/smallcode.js:24-46, 57-109). The TUI layer (fullscreen or classic readline) captures user input and invokes runAgentLoop(), which orchestrates the model interaction, tool execution, and improvement cycle (bin/smallcode.js:359-471). The governor module (bin/governor.js) provides the checkAndEnforceHardFail() function that integrates verification results into the agent loop, implementing a decompose strategy when retries fail instead of hard failing immediately (bin/governor.js:129-164). This modular decomposition suggests that the new patterns from RQ1-4 could land as either a unified small-model optimization skill or as distributed references across existing CLI skills, with the context budget engine and verification pipeline being good candidates for cross-CLI reuse (PLAN.md:97-112, README.md:61-82).

**Key files:**
- bin/smallcode.js:24-46 — Component initialization (governor, escalation, plugins, memory, session)
- bin/smallcode.js:57-109 — Code graph MCP startup and mcpCall() wrapper
- bin/smallcode.js:359-471 — TUI setup and agent loop entry point
- bin/governor.js:129-164 — checkAndEnforceHardFail() with decompose strategy
- bin/governor.js:166-212 — pickDecomposeStrategy() with three fallback approaches

```js
// bin/smallcode.js:24-46
const { ToolScorer, checkAndEnforceHardFail, classifyTask } = require('./governor');
const { EscalationEngine } = require('./escalation');
const { PluginLoader } = require('../src/plugins/loader');
const { SkillManager } = require('../src/plugins/skills');
const { SessionStore } = require('../src/session/persistence');
const { TokenTracker } = require('../src/session/tokens');

const toolScorer = new ToolScorer();
let currentTaskType = 'coding';
let escalationEngine = null;
let pluginLoader = null;
let skillManager = null;
let sessionStore = null;
let tokenTracker = null;
```

```js
// bin/smallcode.js:57-109
function startCodeGraphMCP() {
  const possiblePaths = [
    path.join(__dirname, '..', '..', 'code-graph-mcp', 'dist', 'index.js'),
    path.join(__dirname, '..', 'node_modules', 'budget-aware-mcp', 'dist', 'index.js'),
  ];
  // ... path resolution logic
  const child = spawn('node', [mcpPath], {
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: process.cwd(),
  });
  mcpProcess = child;
  return child;
}
```

```js
// bin/smallcode.js:386-397
onSubmit: async (input) => {
  screen.setStreaming(true);
  await runAgentLoop(input, config);
  screen.setStreaming(false);
  if (tokenTracker) screen.setTokenInfo(tokenTracker.formatShort());
  const lastMsg = conversationHistory.filter(m => m.role === 'assistant').pop();
  if (lastMsg && lastMsg.content) {
    screen.addChat('assistant', lastMsg.content);
  }
}
```

```js
// bin/governor.js:129-164
function checkAndEnforceHardFail(filePath) {
  if (!verificationHistory[filePath]) verificationHistory[filePath] = [];
  
  const result = verifyCode(filePath);
  verificationHistory[filePath].push(result);
  
  if (result.passed) {
    verificationHistory[filePath] = [];
    return { action: 'accept', confidence: result.confidence };
  }

  const attempts = verificationHistory[filePath].length;
  if (attempts >= MAX_VERIFICATION_RETRIES) {
    verificationHistory[filePath] = [];
    return { 
      action: 'decompose', 
      errors,
      fileContent: content,
      lines,
      strategy: pickDecomposeStrategy(content, errors, filePath),
    };
  }

  return { action: 'retry', errors: result.errors, attempt: attempts, escalate: attempts >= 2 };
}
```

```js
// bin/governor.js:166-212
function pickDecomposeStrategy(content, errors, filePath) {
  const ext = require('path').extname(filePath);
  const lines = content.split('\n').length;
  const errorCount = errors.length;
  
  if (lines > 80) {
    return {
      type: 'split_file',
      reason: `File is ${lines} lines with ${errorCount} errors. Too much for one pass.`,
      instruction: `The file ${filePath} is too complex to fix in one go. Split it into smaller files...`,
    };
  }
  
  if (errorCount > 1) {
    return {
      type: 'one_error_at_a_time',
      reason: `${errorCount} errors found. Fix them one at a time.`,
      instruction: `Stop trying to fix everything at once. Focus on ONE error only...`,
    };
  }
  
  return {
    type: 'rewrite_section',
    reason: 'Same error persists after 2 attempts.',
    instruction: `The fix attempts aren't working. Try a completely different approach...`,
  };
}
```

**Mapping to our skill system:**
- Component initialization pattern → candidate target: cli-devin/references/component-bootstrap.md
- Code graph MCP integration → candidate target: cli-opencode/references/code-graph-mcp.md
- Agent loop wiring with TUI → candidate target: cli-devin/references/agent-loop-wiring.md
- Decompose strategy selection → candidate target: cli-devin/references/decompose-strategies.md
- Modular governor integration → candidate target: cli-opencode/references/governor-integration.md
