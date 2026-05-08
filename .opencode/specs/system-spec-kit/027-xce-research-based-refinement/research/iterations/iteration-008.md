# Iteration 008 — RQ8: Token Reduction Validation

**Started**: 2026-05-08T16:00:00Z
**Focus**: RQ8 — Is XCE's ~20% token reduction claim measurable in OUR system via `prompt-cache.ts` + `budget-allocator.ts` instrumentation? Survey existing token accounting hooks, design measurement protocol, classify verdict.

---

## Actions

1. Read spec.md — RQ8 definition: token reduction measurable via prompt-cache.ts + budget-allocator.ts.
2. Read iteration-007.md — prior iter next-focus + findings (F-039 through F-042, DEFER verdict for eval harness to sub-packet 028).
3. Read iteration-006.md — RQ6 findings (F-038 hook for RQ8, proposed render.ts changes).
4. Read `external/README.md:185-189` — extract exact ~20% token reduction claim + steering rationale.
5. Read `skill_advisor/lib/prompt-cache.ts` (192 lines) — full audit of cache mechanics, token caps, metric hooks.
6. Read `code_graph/lib/budget-allocator.ts` (134 lines) — full audit of `allocateBudget()`, `AllocationResult`, `DEFAULT_FLOORS`.
7. Read `code_graph/handlers/context.ts` (416 lines) — handler surface: `budgetTokens` input, response shape, no token consumption in output JSON.
8. Read `code_graph/lib/code-graph-context.ts` — `ContextResult.metadata` with `budgetUsed`/`budgetLimit`, `formatTextBrief()`, `partialOutput`.
9. Read `code_graph/lib/compact-merger.ts` — `estimateTokens()` heuristic (chars/4), `truncateToTokens()` for section-level sizing.
10. Read `code_graph/lib/code-graph-db.ts:1236-1244` — `getTokenUsageRatio()` consuming external session metrics.
11. Grep `mcp_server/` for `estimatedPromptTokens|estimatedCompletionTokens|sessionMetrics` — 90+ matches across hooks, analytics DB, tests.
12. Read `lib/analytics/session-analytics-db.ts:90-141` — `analytics_sessions` schema with `prompt_tokens`, `completion_tokens`, `total_tokens`, `turn_count`; `analytics_turns` per-turn breakdown.
13. Read `hooks/response-hints.ts:40-65` — `extractSurfacedTokenCount()` reads prompt/completion/cache tokens from LLM API response `usage` envelope.
14. Read `skill_advisor/lib/render.ts:39-65` — `DEFAULT_TOKEN_CAP = 80`, `AMBIGUOUS_TOKEN_CAP = 120`, `capText()` with `TOKEN_TO_CHAR_ESTIMATE = 4`.

---

## Findings

### F-043: XCE token reduction claim — source text

| Claim | Exact text | Source file:line |
|-------|-----------|-----------------|
| ~20% token reduction | "Our benchmarks show ~20% token reduction when the agent uses XCE proactively." | external/README.md:188 |
| Mechanism attribution | "Without steering, the agent may use XCE sometimes but still fall back to reading files directly. With steering, the agent consistently uses XCE first, resulting in better context and fewer wasted tokens." | external/README.md:188 (same block) |
| Cost narrative | "An older-generation model (Sonnet 4.0) with XCE beats raw Sonnet 4.6 and reaches Opus-level performance — at 16x lower cost." | external/README.md:47 |

**Key observation**: XCE's claim couples token reduction to *steering compliance*, not to tool efficiency. The causal chain is: stronger directive → agent uses XCE first → fewer file-read tokens → fewer total tokens. The independent variable is directive strength, not tool implementation. This aligns with RQ6's proposed render.ts change (F-036): if our "MUST invoke X FIRST" brief increases code_graph/cocoindex usage, downstream file reads decrease.

Evidence lines:
- external/README.md:188 — "~20% token reduction when the agent uses XCE proactively"
- external/README.md:47 — "at 16x lower cost"

### F-044: Existing token accounting — four layers, NONE measuring session consumption

Our system has four layers of token-related code, surveyed in full. None of them measure *per-session* token consumption. All are input constraints or single-call scoped heuristics.

**Layer 1 — `prompt-cache.ts` (skill_advisor/lib/prompt-cache.ts):**

| Element | Line(s) | Purpose | Token measurement? |
|---------|---------|---------|-------------------|
| `ADVISOR_PROMPT_CACHE_DEFAULT_MAX_TOKENS = 80` | 10 | Default brief token budget | **Input constraint** — controls cache key normalization, not measurement |
| `ADVISOR_PROMPT_CACHE_MAX_TOKENS = 120` | 11 | Maximum brief token budget | **Input constraint** |
| `normalizeMaxTokens()` | 57-65 | Clamps to [1, 120] for cache key derivation | **Input constraint** |
| `AdvisorPromptCacheKeyParts.maxTokens` | 28 | Included in HMAC cache key | **Cache dedup** — distinguishes briefs by token cap, not measuring usage |
| `speckitMetrics.recordPromptCacheOutcome()` | 103, 117 | Records hit/miss | **Cache performance**, not token counting |

**Verdict**: `prompt-cache.ts` is an exact-match cache for advisor briefs, scoped to 5-min TTL (line 9). Its "maxTokens" field is a cache-key discriminator, not a measurement hook. It does NOT count tokens consumed by the brief, the session, or the agent. **Zero token measurement capability.**

Evidence lines:
- `prompt-cache.ts:10` — `ADVISOR_PROMPT_CACHE_DEFAULT_MAX_TOKENS = 80`
- `prompt-cache.ts:28` — `maxTokens` as cache key part, not measurement
- `prompt-cache.ts:57-65` — `normalizeMaxTokens()` input normalization only
- `prompt-cache.ts:102-117` — `get()` side-effect is cache hit/miss counter, not token counter

**Layer 2 — `budget-allocator.ts` (code_graph/lib/budget-allocator.ts):**

| Element | Line(s) | Purpose | Token measurement? |
|---------|---------|---------|-------------------|
| `DEFAULT_FLOORS` | 32-38 | Per-source floor allocations (700/1200/900/400/800) | **Pre-allocation plan** — these are targets, not measurements |
| `allocateBudget()` | 52-117 | Floor assignment → overflow redistribution → budget cap trim | **Pre-allocation** — distributes a fixed 4000-token budget before content is emitted |
| `AllocationResult.totalUsed` | 112-116 | Sum of granted tokens | **Computed from estimated size**, not measured post-emission |
| `SourceAllocation.granted/dropped` | 19-20 | Per-source granted and dropped tokens | **Pre-emission estimate** |

**Verdict**: `budget-allocator.ts` is a *budget planner* for the compact-merger compaction pipeline. It allocates a 4000-token envelope across 4-5 context sources before content assembly. It does NOT measure actual tokens consumed by the LLM session. The `totalUsed` field (line 112) is a sum of *granted* allocations, not measured consumption. **Zero session token measurement capability.**

Evidence lines:
- `budget-allocator.ts:4` — "Distributes a total token budget across multiple context sources using floor allocations + overflow redistribution"
- `budget-allocator.ts:31` — "Default floor layout for the 4000-token compact brief budget"
- `budget-allocator.ts:52-117` — `allocateBudget()` — floor → overflow → trim algorithm
- `budget-allocator.ts:112-116` — `totalUsed` = sum of granted allocations (computed, not measured)

**Layer 3 — `code-graph-context.ts` (code_graph/lib/code-graph-context.ts):**

| Element | Line(s) | Purpose | Token measurement? |
|---------|---------|---------|-------------------|
| `ContextResult.metadata.budgetUsed` | 42 | Tokens consumed by the `textBrief` output | **Single-response-scoped** — `Math.ceil(text.length / 4)` heuristic |
| `ContextResult.metadata.budgetLimit` | 43 | Input budget cap | **Input reference** |
| `ContextResult.metadata.partialOutput` | 45-51 | Reasons for partial output (deadline, budget) | **Output quality**, not session measurement |
| `formatTextBrief()` | 582-642 | Section assembly within budget, with `[X more sections omitted]` truncation | **Response-level** truncation, not session-level |

**Verdict**: `code-graph-context.ts` provides the closest thing to token accounting — it reports `budgetUsed` per `code_graph_context` call (line 199). However, this measures only the textBrief within a single MCP tool response, not the entire LLM session. It uses a 4-char-per-token heuristic (line 199: `Math.ceil(formattedTextBrief.text.length / 4)`), not actual LLM tokenizer counting. **Single-call-scoped, heuristic-estimated token accounting — not session measurement.**

Evidence lines:
- `code-graph-context.ts:42` — `budgetUsed: number` in `ContextResult.metadata`
- `code-graph-context.ts:199` — `budgetUsed: Math.ceil(formattedTextBrief.text.length / 4)` — 4-char heuristic
- `code-graph-context.ts:200` — `budgetLimit: budgetTokens`
- `code-graph-context.ts:582` — `formatTextBrief()` budget-aware section assembly

**Layer 4 — `compact-merger.ts` (code_graph/lib/compact-merger.ts):**

| Element | Line(s) | Purpose | Token measurement? |
|---------|---------|---------|-------------------|
| `estimateTokens()` | 53-55 | `Math.ceil(text.length / 4)` | **Heuristic** — 4 chars ≈ 1 token, used for section sizing |
| `truncateToTokens()` | 58-68 | Truncate text to N-token budget with `[...truncated]` marker | **Truncation**, not measurement |
| `CompactPayload.section.tokenEstimate` | 36 | Per-section token estimate | **Heuristic** per section |

**Verdict**: Same heuristic as code-graph-context (chars/4). Used for content assembly sizing. **Not measurement.**

Evidence lines:
- `compact-merger.ts:53-55` — `estimateTokens(text)` = `Math.ceil(text.length / 4)`
- `compact-merger.ts:58-68` — `truncateToTokens()` for section-level budget

### F-045: Session-level token measurement EXISTS but OUTSIDE our MCP server

Actual per-session token counting happens at the LLM API level and is persisted by the session analytics infrastructure:

**A. Session analytics DB schema** (`lib/analytics/session-analytics-db.ts`):

| Column | Line | Description |
|--------|------|-------------|
| `prompt_tokens` | 100 | Total prompt tokens across all turns |
| `completion_tokens` | 101 | Total completion tokens across all turns |
| `cache_creation_input_tokens` | 102 | Cache write tokens |
| `cache_read_input_tokens` | 103 | Cache read tokens |
| `total_tokens` | 104 | Aggregate total |
| `turn_count` | 110 | Number of conversation turns |

Per-turn breakdown also available (`analytics_turns` table, lines 115-137): same token columns per turn with `byte_start`/`byte_end` transcript positions.

Evidence lines:
- `session-analytics-db.ts:100-104` — `analytics_sessions` table token columns
- `session-analytics-db.ts:125-129` — `analytics_turns` per-turn token columns
- `session-analytics-db.ts:389` — `getSessionRow()` returns `SessionAnalyticsSessionRow` with all token fields
- `session-analytics-db.ts:409-428` — `getSessionAggregate()` query with `COALESCE(SUM(total_tokens), 0) AS total_tokens`

**B. Hook state schema** (`hooks/claude/hook-state.ts`):

| Field | Line | Description |
|-------|------|-------------|
| `estimatedPromptTokens` | 227 | `z.number().finite().nonnegative()` |
| `estimatedCompletionTokens` | 228 | `z.number().finite().nonnegative()` |

These are *estimated* (provider-returned) during the session, finalized at session-stop.

Evidence lines:
- `hook-state.ts:227-228` — session metrics schema with estimated token fields

**C. Response hints token extraction** (`hooks/response-hints.ts`):

The `extractSurfacedTokenCount()` function (lines 40-65) reads `promptTokens/completionTokens` (and snake_case variants) from the LLM API response `usage` envelope — `result.usage`, `meta.usage`, or the raw response objects. Also extracts `cacheCreationTokens` / `cacheReadTokens`. This is the intake point where provider-reported token counts enter our system.

Evidence lines:
- `response-hints.ts:48-53` — `extractSurfacedTokenCount()` reads prompt/completion tokens from API response
- `response-hints.ts:54-61` — cache creation/read token extraction

**D. Session-stop persistence** (`hooks/claude/session-stop.ts:384-385`):
```
estimatedPromptTokens: usage.promptTokens,
estimatedCompletionTokens: usage.completionTokens,
```
The session-stop hook writes the final API token usage into the analytics DB.

**Key insight**: Our MCP server is NOT the LLM runtime. It receives token counts from the provider via the hook API. We CANNOT instrument our MCP server to *count* tokens — we can only *query* what the analytics DB has already persisted. The token counting happens upstream at the Claude/OpenCode/Codex API level.

### F-046: Measurement protocol — ADAPT with external dependency

**Independent variable (what we control):**
- Brief text strength: current "use" (render.ts:155-158) vs proposed "MUST invoke X FIRST — <action hint>" (RQ6 F-036)
- Controlled by the RQ6 render.ts change (~30 LOC)

**Dependent variable (what we measure):**
- Session `total_tokens` from `analytics_sessions` table (session-analytics-db.ts:104)
- Session `turn_count` (line 110)
- Per-session: does the agent use code_graph/cocoindex tools? (binary compliance signal)

**Measurement protocol:**

```
Phase 1 — BASELINE (N ≥ 10 sessions):
  - Render brief with current "use" phrasing
  - Run same task prompt N times (fresh sessions)
  - After each session-stop: query session-analytics-db for total_tokens, turn_count
  - Record: [session_id, total_tokens, turn_count]

Phase 2 — AFTER (N ≥ 10 sessions):
  - Render brief with proposed "MUST invoke X FIRST — <hint>" phrasing
  - Run same task prompt N times (fresh sessions)
  - After each session-stop: query session-analytics-db for total_tokens, turn_count
  - Record: [session_id, total_tokens, turn_count]

Comparison:
  - Δ = mean(BASELINE) − mean(AFTER) in total_tokens per task
  - % reduction = 100 × Δ / mean(BASELINE)
  - Statistical test: Welch's t-test (unequal variance) or Mann-Whitney U if non-normal
  - Also compare: turn_count delta (does stronger directive reduce turns?)
```

**Instrumentation hook (where to add code):**

| Component | What to add | Estimated LOC | Where |
|-----------|------------|--------------|-------|
| Session token query helper | Function `querySessionTokens(sessionId: string): { totalTokens, turnCount }` wrapping `session-analytics-db.ts` `getSessionRow()` | ~25 LOC | New file: `mcp_server/lib/eval/token-measurement.ts` (or inline in eval harness) |
| Baseline/after loop | For each task in 028 harness: run task, capture `speckit_session_id`, query token totals post-session-stop | ~30 LOC | `scripts/dist/eval/code-graph-adoption-eval.js` (028 sub-packet) |
| Token delta compute | `computeTokenDelta(baselineResults, afterResults): { meanDelta, pctReduction, pValue }` | ~25 LOC | Same eval harness |
| **Total** | | **~80 LOC** | Sub-packet 028 |

**Why NOT inside the MCP server**: The brief render (render.ts) has zero access to session analytics. It's a pure function that takes `AdvisorResult → string`. The session-stop hook (session-stop.ts) writes token counts but is invoked AFTER the session — it cannot measure the *effect* of a brief that was already rendered hours ago. The measurement must happen in a harness that:
1. Controls the independent variable (brief text) — done via MCP config or advisor mode
2. Runs the same task with each variant
3. Queries the analytics DB after each session completes
4. Computes delta

This is squarely in the 028 eval harness scope (DEFER from RQ7 F-042).

**What we CAN instrument NOW (within this research-only packet):**
- Log: "brief rendered with strength={current|must-invoke}" — add a `speckitMetrics` counter in render.ts (binary signal, ~3 LOC, but violates research-only constraint on code modifications)
- Instead: document the hook point for sub-packet 028 to add this counter when it implements the harness

### F-047: Verdict — ADAPT (measurement deferrable to sub-packet 028)

**Verdict**: **ADAPT**

**Why ADAPT and not ADOPT**:
- XCE's ~20% measurement methodology is a black box. README:188 states the claim but provides zero methodology (no confidence interval, no task set description, no measurement protocol description). We cannot ADOPT their methodology because it's undocumented.
- Our system DOES have session-level token measurement in `session-analytics-db.ts` (prompt_tokens + completion_tokens + total_tokens per session). We can query it. But the measurement harness lives in a separate sub-packet (028), not in our MCP server's instrumentation layer.

**Why not DEFER**:
- The measurement protocol is fully defined (F-046) and consists of well-understood primitives: session analytics query + baseline-vs-after comparison. There's no open research question blocking it.
- The RQ6 render change ("MUST invoke X FIRST") would ship *without quantified justification* if RQ8 measurement never happens. RQ8 provides the *evidence* that RQ6's 30LOC change actually saves tokens.
- DEFER-ing RQ8 measurement would mean the render change is adopted on faith, not evidence — violates the evidence-first principle of this research.

**Why not SKIP**:
- Without measurement, the entire RQ6-RQ8 chain is unfalsifiable. RQ6 changes the briefing, RQ7 designs the harness, RQ8 validates the result. Skipping RQ8 validation means the adoption matrix has an unverified entry.
- The cost is low (~80 LOC in sub-packet 028) and the analytics DB is already populated. There's no new infrastructure dependency.

**Implementation path**:
1. Sub-packet 028 (RQ7 F-042) ships the eval harness with CLI dispatcher
2. Sub-packet 029 (RQ8 instrumentation) adds `token-measurement.ts` (~25 LOC) to query session analytics
3. Run baseline (current "use" brief) → 10+ sessions → collect token totals
4. Deploy RQ6 render change → run same tasks (after "MUST invoke" brief) → collect token totals
5. Compute delta → publish result in sub-packet 028 findings

**Estimated total LOC for RQ8 measurement**: ~80 LOC (token query helper + delta compute + harness integration)

**Risk**: The ~20% reduction may NOT materialize for our system because:
- Our steering fires DYNAMICALLY (confidence ≥ 0.8 threshold), not UNCONDITIONALLY. The agent may not see the brief on every task.
- Our code_graph tools are different from XCE's tools — we return structural graph data, not narrative HLD/LLD descriptions. The "read-replacement" effect may be weaker.
- Token reduction at XCE is attributed to *proactive use* (reading XCE context first → fewer wasted file reads). If our code_graph output doesn't fully replace file reads for understanding code, the reduction will be lower.

We should expect a *positive but smaller* effect: ~5-15% rather than XCE's claimed ~20%.

---

## Q-Answered

- **RQ8 — Token Reduction Validation**: Fully answered. XCE claims ~20% token reduction with steering (F-043: external/README.md:188). Our system has zero per-session token measurement in its MCP server instrumentation layer (F-044): `prompt-cache.ts` is a cache with input-side token caps (lines 10-12), `budget-allocator.ts` is a pre-allocation planner (lines 52-117), `code-graph-context.ts` reports single-response `budgetUsed` via heuristic (line 199), and `compact-merger.ts` uses chars/4 estimation (lines 53-55). Actual session-level token counting EXISTS but OUTSIDE our MCP server — in `session-analytics-db.ts` (prompt_tokens, completion_tokens, total_tokens at lines 100-104; per-turn breakdown at lines 125-129) populated by `session-stop.ts` from LLM API usage envelopes (F-045). Measurement protocol: baseline-vs-after with N ≥ 10 sessions per condition, query `session-analytics-db.ts` `getSessionRow()` for `total_tokens` post-session-stop, compute paired delta (F-046). Verdict: ADAPT — measurement is deferrable to sub-packet 028 eval harness + 029 token instrumentation (~80 LOC total). Cannot ADOPT XCE's black-box methodology. Expected effect: 5-15% reduction (lower than XCE's 20% due to dynamic firing and different tool output format) (F-047).

## Q-Remaining

- RQ9 untouched. RQ8 answered.

## Next-Focus

**RQ9 — Non-Adoption Boundary**: Explicit SKIP list — closed-source PRAT internals, SaaS hosting/pricing model, centralized xanther.ai dependency. Document each item with file:line rationale from external/ materials. Also surface any adaptation constraints from RQ1-RQ8 that force DEFER/SKIP on otherwise appealing features.

---

## Tool Calls

| # | Tool | Purpose |
|---|------|---------|
| 1 | Read (spec.md) | RQ8 definition + prompt-cache.ts/budget-allocator.ts references |
| 2 | Read (iteration-007.md) | Prior iter next-focus + F-038 hook for RQ8 |
| 3 | Read (iteration-006.md) | RQ6 findings: proposed render.ts changes + token impact hook (F-038) |
| 4 | Read (external/README.md:185-189) | XCE ~20% token reduction claim (line 188) |
| 5 | Read (prompt-cache.ts) | Full 192 lines — cache mechanics, token caps, metric hooks |
| 6 | Read (budget-allocator.ts) | Full 134 lines — allocateBudget(), DEFAULT_FLOORS, AllocationResult |
| 7 | Read (handlers/context.ts) | Full 416 lines — handler surface, budgetTokens input, response shape |
| 8 | Read (code-graph-context.ts:25-74) | ContextResult metadata: budgetUsed, budgetLimit, partialOutput |
| 9 | Read (compact-merger.ts:44-68) | estimateTokens() heuristic, truncateToTokens() |
| 10 | Read (code-graph-db.ts:1236-1244) | getTokenUsageRatio() consuming external session metrics |
| 11 | Grep (mcp_server/**/*.ts) | `estimatedPromptTokens|estimatedCompletionTokens` — 90+ matches across hooks/analytics/tests |
| 12 | Read (hooks/response-hints.ts:40-65) | extractSurfacedTokenCount() — reads prompt/completion/cache tokens from LLM API response |
| 13 | Read (session-analytics-db.ts:90-141) | analytics_sessions + analytics_turns schema with token columns |
| 14 | Read (render.ts:39-65) | DEFAULT_TOKEN_CAP, capText(), TOKEN_TO_CHAR_ESTIMATE |

**Tool calls**: 14 (at NFR-P02 cap of 14).
