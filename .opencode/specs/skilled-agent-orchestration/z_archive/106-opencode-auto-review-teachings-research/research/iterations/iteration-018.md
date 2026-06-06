<!-- PINNED_UPSTREAM_SHA: cc613a1b4d447b9c5f34e7dec2a1e8478e0572d9 -->

# Iteration 018 — Gap analysis vs mk-skill-advisor + mk-code-graph plugin ecosystem

## Summary
Both mk-skill-advisor and mk-code-graph are advisory plugins that inject context into OpenCode sessions without spawning child sessions or dispatching to external models. The upstream auto-review plugin requires fundamentally different mechanisms: event-driven activation on session.idle, cross-model selection and dispatch, loop prevention via markers and session tracking, and structured LLM prompt templates for review generation. Neither existing plugin has these capabilities, and extending them would mix responsibilities (routing/review for advisor, context injection/review for code-graph). A new mk-auto-review.js plugin is recommended to match the upstream pattern while maintaining clean separation of concerns.

## Findings

### Plugin Shapes
| Aspect | mk-skill-advisor | mk-code-graph |
|--------|------------------|---------------|
| Language | JavaScript (ES modules) | JavaScript (ES modules) |
| Plugin id | `'mk-skill-advisor'` (line 28) | `'mk-code-graph'` (line 36) |
| Default export shape | async function returning {event, experimental.chat.system.transform, tool} (lines 387-718) | async function returning {event, tool, experimental.chat.system.transform, experimental.chat.messages.transform, experimental.session.compacting} (lines 361-507) |
| Events listened | session.created, session.deleted, server.instance.disposed, global.disposed (lines 655-678) | session.*, message.* events (lines 332-335, 366-371) |
| Config loading | env-only (process.env) + options parameter (lines 107-128) | env-only (process.env) + options parameter (lines 122-143) |
| Diagnostic logging | n/a (no diagnostic logging) | stderr write via emitRuntimeDiagnostic (lines 200-202) |
| Child sessions used? | YES - uses ctx.client.session.messages to fetch session data (lines 598-601) | NO - doesn't use ctx.client.session |
| Cross-model dispatch? | NO - doesn't dispatch to other models | NO - doesn't dispatch to other models |

### Gap Matrix
| Mechanism | mk-skill-advisor | mk-code-graph |
|-----------|------------------|---------------|
| Event-driven activation (session.idle) | DON'T HAVE (listens to session.created/deleted only) | DON'T HAVE (listens to session.* for cache invalidation only) |
| Cross-model selection algorithm | n/a (no LLM dispatch) | n/a (no LLM dispatch) |
| Cross-AI family bias | n/a (no LLM dispatch) | n/a (no LLM dispatch) |
| Loop-prevention markers | n/a (no LLM dispatch) | n/a (no LLM dispatch) |
| Loop-prevention session-set | n/a (no LLM dispatch) | n/a (no LLM dispatch) |
| Loop-prevention dedup map | n/a (no LLM dispatch) | n/a (no LLM dispatch) |
| Boundary detection | n/a (no LLM dispatch) | n/a (no LLM dispatch) |
| Min-evidence gate | n/a (no LLM dispatch) | n/a (no LLM dispatch) |
| Structured prompt template | n/a (no LLM dispatch) | n/a (no LLM dispatch) |
| PASS/FAIL/UNKNOWN severity | n/a (no LLM dispatch) | n/a (no LLM dispatch) |
| Final-line exact-string contract | n/a (no LLM dispatch) | n/a (no LLM dispatch) |
| Anti-repetition rule | n/a (no LLM dispatch) | n/a (no LLM dispatch) |
| Bounded evidence interpolation | n/a (no LLM dispatch) | n/a (no LLM dispatch) |
| 3-tier config (file/env/default) | DON'T HAVE (env + options only, no file config) | DON'T HAVE (env + options only, no file config) |
| Dynamic model discovery | n/a (no LLM dispatch) | n/a (no LLM dispatch) |
| Diagnostic logging (per-workspace) | DON'T HAVE (no diagnostic logging) | DON'T HAVE (diagnostic to stderr only, not per-workspace) |
| Child-session isolation | n/a (no child sessions) | n/a (no child sessions) |

### mk-auto-review Hypothesis
**Recommendation**: new plugin

**Pros of new plugin**:
- Clean separation of concerns: review logic isolated from routing (advisor) and context injection (code-graph)
- Independent enable/disable via plugin config
- Matches upstream pattern directly, making future upstream sync easier
- Can have own config schema without polluting existing plugin namespaces
- Resource isolation: only loads when needed, doesn't add overhead to advisory plugins
- Clear ownership: review-specific logic lives in one place

**Cons of new plugin**:
- Plugin count grows (3 instead of 2)
- Each plugin reloads on its own session.idle (resource cost)
- Additional install/config surface for users
- Duplicates some infrastructure (bridge pattern, config normalization)

**Pros of extending mk-skill-advisor**:
- Shares advisor infrastructure (skill-graph lookup could inform review relevance)
- Single plugin install/config story
- Leverages existing session.message fetching logic
- Could reuse advisor's cache and dedup mechanisms

**Cons of extending mk-skill-advisor**:
- Mixes review with routing — different responsibilities
- Advisor runs on experimental.chat.system.transform (early), auto-review runs on session.idle (late) — timing mismatch
- Advisor is advisory (context injection), auto-review is evaluative (child session dispatch) — semantic mismatch
- Would need conditional activation logic based on event type, increasing complexity
- Violates single responsibility principle
- Makes advisor plugin heavier and harder to reason about

### Design Sketch (if new plugin)
```
.opencode/plugins/mk-auto-review.js (~300 lines)
├── CONSTANTS
│   ├── PLUGIN_ID = 'mk-auto-review'
│   ├── DISABLED_ENV = 'MK_AUTO_REVIEW_HOOK_DISABLED'
│   ├── DISABLED_ENV_PLUGIN = 'MK_AUTO_REVIEW_PLUGIN_DISABLED'
│   ├── MIN_TOOL_CALLS_DEFAULT = 3
│   ├── ABORT_WAIT_MS_DEFAULT = 1500
│   ├── REVIEW_MARKERS = ['AUTO-REVIEW', 'MK-AUTO-REVIEW']
│   ├── DEDUP_SESSION_SET = new Set()
│   └── DEDUP_MAP = new Map()
├── CONFIG LOADING
│   ├── loadConfig() — reads ~/.config/opencode/plugin/mk-auto-review.json
│   ├── normalizeOptions(rawOptions) — merges file + env + defaults
│   └── envDisablesPlugin() — checks MK_AUTO_REVIEW_* env vars
├── SESSION ANALYSIS
│   ├── isChildSession(sessionID) — checks parentID via ctx.client.session
│   ├── hasReviewMarkers(message) — scans for REVIEW_MARKERS
│   ├── countToolCalls(sessionID) — fetches session messages, counts tool invocations
│   └── extractWorkModel(sessionID) — infers model from session metadata
├── MODEL SELECTION
│   ├── inferReviewModels(workModel) — adapts to our model fleet
│   ├── selectReviewer(candidates) — picks first available, respects family bias
│   └── MODEL_HIERARCHY = ['cli-codex', 'cli-gemini', 'cli-claude-code', 'cli-devin']
├── REVIEW EXECUTION
│   ├── runReview(sessionID, workModel, reviewerModel) — spawns child session
│   ├── buildReviewPrompt(sessionID, workModel) — constructs structured prompt
│   ├── parseReviewOutput(childSessionOutput) — extracts PASS/FAIL/UNKNOWN
│   └── emitDiagnostics(reviewResult) — writes to JSONL log
├── LOOP PREVENTION
│   ├── DEDUP_SESSION_SET.add(sessionID) — tracks reviewed sessions
│   ├── DEDUP_MAP.set(messageSignature, timestamp) — message deduplication
│   └── shouldSkipSession(sessionID) — checks child status + markers + dedup
├── EVENT HANDLERS
│   ├── handleSessionIdle(event) — main trigger gate
│   ├── handleSessionError(event) — cleanup on error
│   └── handleSessionCreated(event) — initialize tracking
└── PLUGIN EXPORT
    ├── default export: { id: "mk-auto-review", event: ..., tool: {...} }
    └── tool: mk_auto_review_status() — diagnostic status output
```

Key adaptations:
- Config path: `~/.config/opencode/plugin/mk-auto-review.json` (NOT auto-review.json — avoid colliding with upstream if user installs both)
- Env-var prefix: `MK_AUTO_REVIEW_*` (e.g., MK_AUTO_REVIEW_MODEL, MK_AUTO_REVIEW_DEBUG, MK_AUTO_REVIEW_MIN_TOOL_CALLS)
- Diagnostic log: `<workspace>/.mk-auto-review-diagnostics.jsonl` (JSONL for queryability, matching our existing pattern from code-graph)
- Marker strings: distinct prefix (`MK-AUTO-REVIEW`) for isolation from upstream, but can optionally recognize upstream markers for compatibility
- Model selection: adapted to our model fleet (cli-devin, cli-codex, cli-gemini, cli-claude-code) instead of upstream's opus/codex/sonnet/pro hierarchy
- Bridge pattern: follow mk-skill-advisor's subprocess bridge pattern for safety (avoid loading native modules in host process)
- Config schema: 3-tier (file → env → default) unlike existing plugins which only support env + options
- Session API usage: leverage ctx.client.session for child session creation (following mk-skill-advisor's pattern at lines 598-601)
- Cache strategy: reuse mk-skill-advisor's LRU cache pattern (lines 327-333) for review result caching
- Abort detection: implement 1.5s wait before spawning review (matching upstream, lines 655-678 in advisor show session lifecycle handling)
- Tool call counting: fetch session messages via ctx.client.session.messages (advisor pattern lines 598-627)
- Status tool: follow advisor's status tool pattern (lines 684-715) for diagnostic visibility

## Convergence Signal
`newInfoRatio: 1.00` — high. First analysis of our plugin ecosystem vs upstream auto-review; all gap matrix entries are new information. Plugin shapes documented from source files; gap analysis reveals fundamental architectural differences (advisory vs evaluative, no LLM dispatch vs cross-model dispatch).
