# Iteration 001 — RQ1: Context Budget Engine

## Focus

Extract reusable patterns from SmallCode's context budget engine (`src/context/budget.ms`) for integration into our skill tree, focusing on budget allocation, truncation strategy, eviction priority, file summarization, and usage tracking.

## Actions Taken

1. Read preflight context-card §RQ1 to understand the structured pattern map and identify the 5 KEY FILES bullets for budget.ms (lines 9-13, 55-67, 109-126, 140-163, 176-193).
2. Read `external/smallcode-master/src/context/budget.ms` end-to-end (204 lines) to confirm patterns and extract actual code quotes.
3. Read `external/smallcode-master/smallcode.toml` lines 9-12 to cross-reference BudgetConfig defaults (max_budget_pct=70, working_memory_tokens=500, summary_threshold=200).
4. Read skill tree files (cli-devin/SKILL.md, cli-opencode/SKILL.md, sk-prompt/SKILL.md) to identify candidate target paths for integration.
5. Extracted 5 patterns with file:line citations, code quotes, candidate target paths, patch shapes, and acceptance criteria.

## Findings

### Pattern 1: Percentage-Based Budget Allocation

**Smallcode primitive:**
```ms
// src/context/budget.ms:9-13
pub struct BudgetConfig {
  max_budget_pct: Int       // % of context window for tool results + content
  working_memory_tokens: Int
  summary_threshold: Int    // line count above which files get summarized
}

// src/context/budget.ms:55-58
pub fn totalBudget(self): Int {
  return (self.model_context_length * self.config.max_budget_pct) / 100
}
```

**Candidate target path:** `.opencode/skills/cli-devin/references/context-budget.md` (new file)

**Patch shape:** New file documenting the BudgetConfig struct, totalBudget() calculation, and integration guidance for SWE-1.6 context window management.

**Acceptance criteria:** A follow-on packet can implement a TypeScript/JavaScript budget calculator that: (1) accepts model context length and max_budget_pct parameters, (2) returns total budget tokens, (3) provides per-category allocation breakdown (system_prompt, working_memory, conversation, tool_results), (4) integrates with cli-devin's prompt-file generation to inject budget-aware context sizing hints.

---

### Pattern 2: Tool Result Truncation with Informative Suffix

**Smallcode primitive:**
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

  // Truncate to fit
  let maxChars = available * CHARS_PER_TOKEN
  let truncated = text.slice(0, maxChars)
  let suffix = "\n\n[... truncated ${tokens - available} tokens to fit context budget]"
  self.current_usage.tool_results += available
  return truncated + suffix
}
```

**Candidate target path:** `.opencode/skills/cli-devin/references/truncation-strategy.md` (new file)

**Patch shape:** New file documenting the fitToolResult pattern: percentage-based per-tool cap (default 40%), character-to-token approximation (4 chars ≈ 1 token), and informative truncation suffix showing exact token deficit.

**Acceptance criteria:** A follow-on packet can implement a truncation utility that: (1) approximates tokens via char count (4:1 ratio), (2) respects both total budget and per-tool percentage cap, (3) appends informative suffix with exact token deficit, (4) updates usage tracking after truncation, (5) can be integrated into cli-devin's MCP response handling or tool result post-processing.

---

### Pattern 3: Priority-Based Eviction System

**Smallcode primitive:**
```ms
// src/context/budget.ms:140-163
pub fn evict(self, needed: Int): Int {
  let freed = 0

  // Priority 1: Evict old tool results
  if self.current_usage.tool_results > 0 {
    let evictable = min(self.current_usage.tool_results, needed - freed)
    self.current_usage.tool_results -= evictable
    freed += evictable
  }

  // Priority 2: Evict old conversation
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

**Candidate target path:** `.opencode/skills/cli-opencode/references/context-eviction.md` (new file)

**Patch shape:** New file documenting the eviction priority order (tool results first, then conversation at 50% rate), event bus integration for eviction notifications, and partial eviction semantics.

**Acceptance criteria:** A follow-on packet can implement an eviction policy that: (1) prioritizes tool results over conversation history, (2) evicts conversation at 50% rate (preserves recent context), (3) emits structured events for eviction telemetry, (4) returns actual tokens freed vs requested, (5) integrates with OpenCode's memory system or MCP server state management.

---

### Pattern 4: File Summarization Threshold

**Smallcode primitive:**
```ms
// src/context/budget.ms:128-131
pub fn shouldSummarize(self, lineCount: Int): Bool {
  return lineCount > self.config.summary_threshold
}

// src/context/budget.ms:134-138
pub fn maxAffordableLines(self): Int {
  let availableChars = self.available() * CHARS_PER_TOKEN
  // Assume ~60 chars per line average for code
  return availableChars / 60
}
```

**Candidate target path:** `.opencode/skills/cli-devin/references/file-summarization.md` (new file)

**Patch shape:** New file documenting the shouldSummarize pattern (line count threshold, default 200 lines) and maxAffordableLines calculation (available tokens * 4 chars/token / 60 chars/line).

**Acceptance criteria:** A follow-on packet can implement a file summarization gate that: (1) checks line count against configurable threshold, (2) calculates max affordable lines based on available budget, (3) triggers summarization when threshold exceeded, (4) preserves line-range capability for targeted reads, (5) integrates with cli-devin's file reading workflow or CocoIndex semantic search result sizing.

---

### Pattern 5: Usage Tracking and Display

**Smallcode primitive:**
```ms
// src/context/budget.ms:176-193
pub fn usagePct(self): Int {
  let total = self.current_usage.system_prompt
    + self.current_usage.working_memory
    + self.current_usage.conversation
    + self.current_usage.tool_results
  if self.model_context_length == 0 { return 0 }
  return (total * 100) / self.model_context_length
}

pub fn formatUsage(self): String {
  let pct = self.usagePct()
  let total = self.current_usage.system_prompt
    + self.current_usage.working_memory
    + self.current_usage.conversation
    + self.current_usage.tool_results
  return "${total}/${self.model_context_length} tokens (${pct}%)"
}
```

**Candidate target path:** `.opencode/skills/cli-devin/references/token-usage-display.md` (new file)

**Patch shape:** New file documenting the usage tracking pattern (per-category token counts, percentage calculation against model context length) and formatUsage string template for status bar display.

**Acceptance criteria:** A follow-on packet can implement a usage tracker that: (1) maintains per-category token counts (system_prompt, working_memory, conversation, tool_results), (2) calculates percentage against model context length, (3) formats usage as "total/context_length tokens (pct%)", (4) provides allocation breakdown visibility, (5) integrates with cli-devin's prompt-file generation or TUI status display.

## Questions Answered

- **RQ1 — Context Budget Engine**: Identified 5 reusable patterns from SmallCode's budget engine: (1) percentage-based budget allocation with BudgetConfig struct, (2) tool result truncation with informative suffix, (3) priority-based eviction system, (4) file summarization threshold, (5) usage tracking and display. Each pattern includes the smallcode primitive (file:line + code quote), candidate target path in our skill tree, one-line patch shape, and executable acceptance criteria.

## Questions Remaining

- [ ] RQ2 — Output Verification Pipeline
- [ ] RQ3 — Per-Model Profiles & Escalation
- [ ] RQ4 — Structured Scope/Permissions
- [ ] RQ5 — Skill Architecture (synthesis)

## Next Focus

**Iteration 2:** RQ2 — Output Verification Pipeline. Read smallcode's `src/governor/verifier.ms` end-to-end via the preflight context-card pointer (`../preflight/context-card.md` §RQ2, ~45 prior citations). Identify 3–5 reusable patterns from the multi-stage verification pipeline (structural validation, compilation, execution, smoke tests, linting, confidence scoring, hard-fail gatekeeper). For each pattern emit: (a) the smallcode primitive (file:line + 3–10 line code quote), (b) candidate target path in our skill tree, (c) a one-line "patch shape" describing the integration form, (d) acceptance criteria executable by a follow-on packet.
