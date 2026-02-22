---
description: Retrieve context with intent awareness - combines search + load with task-specific weights
argument-hint: "<query> [--intent:<type>]"
allowed-tools: Read, spec_kit_memory_memory_context, spec_kit_memory_memory_search, spec_kit_memory_memory_match_triggers
---

# 🚨 MANDATORY FIRST ACTION - DO NOT SKIP

**BEFORE READING ANYTHING ELSE IN THIS FILE, CHECK `$ARGUMENTS`:**

```
IF $ARGUMENTS is empty, undefined, or contains only whitespace:
    → STOP IMMEDIATELY
    → Present the user with this question:
        question: "What would you like to retrieve context for?"
        options:
          - label: "Add feature"
            description: "Context for implementing a new feature"
          - label: "Fix bug"
            description: "Context for debugging and fixing an issue"
          - label: "Refactor"
            description: "Context for code restructuring"
          - label: "Security audit"
            description: "Context for security review"
          - label: "Understand"
            description: "Context for learning existing code"
          - label: "Find spec"
            description: "Context for spec document retrieval"
          - label: "Find decision"
            description: "Context for decision rationale lookup"
    → WAIT for user response
    → Use their response to determine the intent and query
    → Only THEN continue with this workflow

IF $ARGUMENTS contains a query:
    → Continue reading this file
```

**CRITICAL RULES:**
- **DO NOT** infer query from conversation context
- **DO NOT** assume the user's intent without explicit input
- **DO NOT** proceed past this point without explicit query from user
- The query and intent MUST come from `$ARGUMENTS` or user's answer above

---

# Memory Context Command

Unified entry point for context retrieval with intent awareness. Automatically detects task intent and applies task-specific weights for optimal context relevance.

---

```yaml
role: Intent-Aware Context Retrieval Specialist
purpose: Unified entry point combining search + load with intent-specific optimization
action: Detect intent, apply task-specific weights, return optimized context

operating_mode:
  workflow: intent_aware_retrieval
  workflow_compliance: MANDATORY
  workflow_execution: single_unified_call
  approvals: none_required
  tracking: intent_classification
```

---

## 1. PURPOSE

> **L1 Orchestration Layer**: This command operates at the top layer of the context retrieval architecture. It orchestrates lower-level memory operations (L2: search, load, match) and provides intent-aware optimization. L1 commands combine multiple L2 operations into unified workflows with token budget management.

Provide a unified entry point for context retrieval that:
- Automatically detects task intent from the query
- Applies task-specific weights for search optimization
- Combines search + load in a single operation
- Returns context with relevance explanation
- Enforces L1 token budget constraints (target: ~2000 tokens per call)
- Handles session deduplication for cross-session queries

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` — Query with optional intent override
**Outputs:** Context with relevance scores and intent explanation

### Argument Patterns

| Pattern                   | Mode        | Example                                           |
| ------------------------- | ----------- | ------------------------------------------------- |
| `<query>`                 | Auto-detect | `/memory:context "oauth implementation"`          |
| `<query> --intent:<type>` | Explicit    | `/memory:context "auth flow" --intent:understand` |

---

## 3. INTENT TYPES AND WEIGHTS

### Intent Classification

The system detects one of seven intent types:

| Intent Type        | Description                    | Weight Adjustments                                        |
| ------------------ | ------------------------------ | --------------------------------------------------------- |
| **add_feature**    | Implementing new functionality | implementation: 1.5x, architecture: 1.3x, patterns: 1.2x |
| **fix_bug**        | Debugging and fixing issues    | decisions: 1.4x, implementation: 1.3x, errors: 1.5x      |
| **refactor**       | Code restructuring             | architecture: 1.5x, patterns: 1.4x, decisions: 1.2x      |
| **security_audit** | Security review                | decisions: 1.4x, implementation: 1.3x, security: 1.5x    |
| **understand**     | Learning existing code         | architecture: 1.4x, decisions: 1.3x, overview: 1.5x      |
| **find_spec**      | Spec document retrieval        | spec-doc: 1.5x, architecture: 1.3x, overview: 1.2x       |
| **find_decision**  | Decision rationale lookup      | decisions: 1.5x, rationale: 1.4x, architecture: 1.2x     |

### Detection Logic

Intent is detected via keyword matching against the query. Keywords are phrase-based to avoid false positives:

| Intent           | Keywords                                                                      |
| ---------------- | ----------------------------------------------------------------------------- |
| `add_feature`    | 'implement', 'add feature', 'add new', 'add a', 'create new', 'build new'    |
| `fix_bug`        | 'bug', 'error', 'fix', 'broken', 'issue', 'debug'                            |
| `refactor`       | 'refactor', 'restructure', 'improve', 'clean up', 'optimize'                 |
| `security_audit` | 'security', 'vulnerability', 'auth', 'sanitize', 'xss', 'csrf'              |
| `understand`     | 'how', 'why', 'what', 'explain', 'understand', 'learn'                       |
| `find_spec`      | 'spec', 'specification', 'spec folder', 'spec document', 'find spec'         |
| `find_decision`  | 'decision', 'rationale', 'why did we', 'chose', 'decision record'            |

**Default fallback:** If no keywords match, defaults to `understand`.

---

## 4. WORKFLOW

### Step 1: Parse Query and Detect Intent

```
Input: $ARGUMENTS
    ↓
Extract Query + Intent Override (if --intent: flag)
    ↓
IF intent override provided:
    → Use explicit intent
ELSE:
    → Auto-detect via keyword matching
    ↓
Store: query, intent
```

### Step 2: Apply Intent-Specific Weights

```
Based on detected intent:
    ↓
Select appropriate anchors:
    - add_feature: ['implementation', 'architecture', 'patterns']
    - fix_bug: ['decisions', 'implementation', 'errors', 'debugging']
    - refactor: ['architecture', 'patterns', 'decisions']
    - security_audit: ['decisions', 'implementation', 'security']
    - understand: ['architecture', 'decisions', 'summary', 'overview']
    - find_spec: ['spec-doc', 'architecture', 'overview', 'specification']
    - find_decision: ['decisions', 'rationale', 'architecture', 'context']
    ↓
Adjust search parameters:
    - Weight boost for relevant context types
    - Anchor filtering for targeted retrieval
```

### Step 3: Execute Search with Optimizations

```javascript
memory_search({
  query: query,
  anchors: intentAnchors[intent],
  limit: 10,
  includeContent: true,
  useDecay: true,
  contextType: intentFilters[intent], // e.g., 'implementation' for add_feature
});
```

### Step 4: Return Context with Explanation

Format response:

```
MEMORY:CONTEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Query       "<query>"
  Intent      <detected-intent> (auto)
  Weights     <anchor1> ×1.5 · <anchor2> ×1.3 · <anchor3> ×1.2

→ Results ──────────────────────────────── <N> found

  #<id>  <title>
         █████████░  <score>%  ·  <spec-folder>  ·  <context_type>
         <content-preview>

  #<id>  <title>
         ███████░░░  <score>%  ·  <spec-folder>  ·  <context_type>
         <content-preview>

→ Token Budget ──────────────────────────────────────

  ████████████░░░░░░░░  <used> / <budget> tokens (<percentage>%)

STATUS=OK INTENT=<intent> RESULTS=<count>
```

---

## 5. INTENT-SPECIFIC ANCHOR SELECTION

### Anchor Mapping by Intent

| Intent             | Primary Anchors                        | Secondary Anchors              | Why These?                                    |
| ------------------ | -------------------------------------- | ------------------------------ | --------------------------------------------- |
| **add_feature**    | implementation, architecture, patterns | decisions, code-examples       | Need existing patterns + structure            |
| **fix_bug**        | decisions, implementation, errors      | debugging, troubleshooting     | Need decision history + error context         |
| **refactor**       | architecture, patterns, decisions      | technical-specs, code-quality  | Need structure understanding + rationale      |
| **security_audit** | decisions, implementation, security    | validation, auth, sanitization | Need security decisions + validation patterns |
| **understand**     | architecture, decisions, summary       | overview, context, background  | Need high-level understanding first           |
| **find_spec**      | spec-doc, architecture, overview       | specification, structure       | Need spec document content + structure        |
| **find_decision**  | decisions, rationale, architecture     | context, background, history   | Need decision records + rationale context     |

### Example: add_feature Intent

```
Query: "implement oauth token refresh"
Intent: add_feature (detected)

Anchors Selected:
  1. implementation (1.5x weight)
  2. architecture (1.3x weight)
  3. patterns (1.2x weight)

Reasoning:
  - Need existing OAuth implementation patterns
  - Need architecture understanding for integration points
  - Need code examples for token handling
```

---

## 6. INTENT DETECTION EXAMPLES

### Example 1: Auto-Detect add_feature

```
/memory:context "implement JWT token validation"

Detection:
  Keyword: "implement" → add_feature intent

Weights Applied:
  - implementation: 1.5x
  - architecture: 1.3x
  - patterns: 1.2x

Anchors:
  ['implementation', 'architecture', 'patterns']
```

### Example 2: Explicit Intent Override

```
/memory:context "auth system" --intent:security_audit

Detection:
  Explicit override: security_audit

Weights Applied:
  - decisions: 1.4x
  - implementation: 1.3x
  - security: 1.5x

Anchors:
  ['decisions', 'implementation', 'security']
```

---

## 7. TOKEN BUDGET ENFORCEMENT

**memory_context L1 Budget:** ~2000 tokens total (mode-managed)

### Budget Guidance by Mode

| Mode      | Target Budget | Typical Use                                  |
| --------- | ------------- | -------------------------------------------- |
| `quick`   | ~800          | Fast trigger/context lookup                  |
| `focused` | ~1500         | Intent-optimized retrieval (`fix_bug`, etc.) |
| `resume`  | ~1200         | Session recovery (`state`, `next-steps`)     |
| `deep`    | ~2000         | Broader context for complex work             |
| `auto`    | mode-routed   | Server selects mode from detected intent     |

### Truncation Logic

When results exceed token budget:
1. Sort results by intent-specific relevance score
2. Include results until budget reached
3. If last result causes overage but >90% budget used, truncate to fit remaining budget
4. Output includes: `Token Budget: ~<tokens> / <budget> tokens (<percentage>% used)` and `Truncation: <none|partial|significant>`

---

## 8. SESSION DEDUPLICATION

### Purpose

Prevent duplicate context when the same query spans multiple sessions or when overlapping sessions contain redundant information.

### Strategy

- Content hashing: Each result is hashed; duplicates with same hash are merged (keeping most recent version)
- Cross-session detection via `sessionId` metadata and content hash comparison
- Timestamp-based recency preference when duplicates found

### Deduplication Metadata

When deduplication occurs, the response includes:

```yaml
deduplication:
  enabled: true
  original_count: <N>
  deduplicated_count: <M>
  duplicates_removed: <N - M>
  session_dedup_applied: true
```

---

## 9. MCP ENFORCEMENT MATRIX

**CRITICAL:** Use the correct MCP tools for each step.

| STEP            | REQUIRED CALLS                                           | PATTERN  | ON FAILURE                |
| --------------- | -------------------------------------------------------- | -------- | ------------------------- |
| INTENT DETECT   | Parse query, match keywords                              | LOCAL    | Default to 'understand'   |
| CONTEXT (PREF)  | `spec_kit_memory_memory_context({ input, ... })`         | SINGLE   | Fall back to manual search |
| TRIGGER CHECK   | `spec_kit_memory_memory_match_triggers({ prompt: query })`| OPTIONAL | Continue without          |
| SEARCH (MANUAL) | `spec_kit_memory_memory_search({ query, anchors, includeContent: true })` | SINGLE | Show error msg |

### MCP Tool Signature

> **Note:** The dedicated `spec_kit_memory_memory_context()` tool provides unified intent-aware retrieval server-side. It accepts `input`, `mode`, `intent`, `specFolder`, `limit`, `sessionId`, `enableDedup`, `includeContent`, and `anchors` params. This is the recommended unified approach. The manual orchestration below is for advanced use cases requiring fine-grained control.

> **Adaptive Fusion & Telemetry:** When `SPECKIT_ADAPTIVE_FUSION` is enabled, fusion weights adapt dynamically to the detected intent — anchor boosts and context-type filters are adjusted at query time rather than using static multipliers. Search results may also be routed through artifact-class classification before scoring. When `SPECKIT_EXTENDED_TELEMETRY` is enabled, extended telemetry is captured alongside results (query timing, score distributions, fusion decisions) and written to the telemetry log.
>
> **Evidence Gap Prevention:** Low-confidence retrieval can trigger an early evidence-gap warning in the response so sparse results are treated cautiously.

```javascript
// Option 1: Dedicated context tool (preferred — single call)
spec_kit_memory_memory_context({
  input: "<query>",
  intent: "<add_feature|fix_bug|refactor|security_audit|understand|find_spec|find_decision>",  // Optional, auto-detected if omitted
  specFolder: "<folder>",  // Optional
  includeContent: true,
  anchors: ["<anchor1>", "<anchor2>"],  // Intent-specific
})

// Option 2: Manual search with anchors (advanced — fine-grained control)
spec_kit_memory_memory_search({
  query: "<query>",
  anchors: ["<anchor1>", "<anchor2>", ...],  // Intent-specific
  limit: 10,
  includeContent: true,  // Single call, no separate load
  useDecay: true,
  contextType: "<type>",  // e.g., "implementation", "decision"
})
```

---

## 10. ERROR HANDLING

| Condition      | Response                                  |
| -------------- | ----------------------------------------- |
| Query empty    | Ask user for query (see top of file)      |
| Intent invalid | Default to 'understand' with warning      |
| No results     | Suggest broader query or different intent |
| Search fails   | Fall back to unweighted search            |

---

## 11. QUICK REFERENCE

| Command                                       | Result                                 |
| --------------------------------------------- | -------------------------------------- |
| `/memory:context "implement auth"`            | Auto-detect add_feature, apply weights |
| `/memory:context "auth bug" --intent:fix_bug` | Explicit fix_bug intent                |
| `/memory:context "how does auth work?"`       | Auto-detect understand intent          |
| `/memory:context "optimize auth code"`        | Auto-detect refactor intent            |
| `/memory:context "auth security review"`      | Auto-detect security_audit intent      |
| `/memory:context "find the spec for auth"`    | Auto-detect find_spec intent           |
| `/memory:context "why did we choose JWT"`     | Auto-detect find_decision intent       |

---

## 12. RELATED COMMANDS

- `/memory:save` - Save current conversation context
- `/memory:manage` - Database management operations
- `/memory:continue` - Resume interrupted session
- `/memory:learn` - Save explicit correction or preference
