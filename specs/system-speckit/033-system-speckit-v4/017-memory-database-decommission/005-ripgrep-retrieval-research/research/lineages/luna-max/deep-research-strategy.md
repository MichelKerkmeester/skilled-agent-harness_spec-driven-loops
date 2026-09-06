---
title: Deep Research Strategy Template
description: Runtime template copied to research/ during initialization to track research progress, focus decisions, and outcomes across iterations.
trigger_phrases:
  - "ripgrep-first retrieval"
  - "generated trigger index"
  - "exact trigger search parity"
  - "memory search replacement"
  - "grep convention retrofit"
  - "retrieval parity harness"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking Template

Runtime template copied to `{spec_folder}/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `{spec_folder}/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `operator`, or `legacy-import`
- `injectedAtIteration`: iteration number when the question was introduced
- `promotedQuestionId`: promoted registry question id, or `null` until promotion

The reducer reads the inbox on every reduce step and carries `origin` into the question registry and dashboard badges. Direct edits to Section 3 still work as a compatibility path, but they are attributed as `legacy-import`.

Question ownership is explicit:

- Inbox rows are immutable input.
- The reducer registry is canonical question state.
- Section 3 is rendered only from the registry view.

When an inbox row targets an existing registry question but carries different text, the reducer keeps the registry value, records `operatorDecision: needs_decision`, and appends a `question_conflict` event with both `inboxValue` and `registryValue`.

---

## 2. TOPIC
Optimize the ripgrep-first retrieval design that replaces the system-spec-memory MCP database, with amendment-ready recommendations for phases `001-trigger-index-replacement` and `004-grep-convention-doc-retrofit` before implementation.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] What exact trigger-index shape, normalization, matching, and lookup contract preserves or exceeds `exactTriggerSearch` and its `LOWER(trigger_phrases) LIKE` behavior?
- [ ] Which ripgrep flags and invocation recipes replace `memory_search`, `memory_context`, and `memory_quick_search`, including deterministic ranking and ignore rules?
- [ ] Which frontmatter, one-fact-per-line, ANCHOR, naming, and trigger-phrase conventions make the corpus grep-precise without rewriting bodies?
- [ ] Which continuity, graph, resource-map, and reporting capabilities are lost with MCP retirement, and what explicit replacements preserve their useful contracts?
- [ ] What frozen prompts, parity harness, latency measurements, malformed-input reports, and acceptance thresholds make the replacement safe to build?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Do not implement or modify the trigger-index generator, retrieval conventions, validators, or phase specs in this lineage.
- Do not redesign semantic/embedding retrieval, the retired MCP server, or unrelated repository search behavior.
- Do not rewrite active document bodies, touch `z_archive`, run validation/writeback tooling, or create a competing persistence system.

---

## 5. STOP CONDITIONS
- Run exactly five iterations because `stopPolicy` is `max-iterations`; convergence below `.05` is telemetry only until iteration 5.
- Stop earlier only for an operator pause, an integrity failure in the lineage state, or a scope violation; record the reason in lineage artifacts.
- Synthesis must distinguish confirmed repository/source evidence from inference and list unresolved questions rather than silently filling gaps.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `--sort=path` as relevance ranking: it is path ordering, single-threaded, and cannot express field/phrase priority. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:6207-6240,6289-6340]` -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `--sort=path` as relevance ranking: it is path ordering, single-threaded, and cannot express field/phrase priority. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:6207-6240,6289-6340]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `--sort=path` as relevance ranking: it is path ordering, single-threaded, and cannot express field/phrase priority. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:6207-6240,6289-6340]`

### `-w` as trigger substring parity. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:804-819; https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:7436-7473]` -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `-w` as trigger substring parity. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:804-819; https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:7436-7473]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `-w` as trigger substring parity. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:804-819; https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:7436-7473]`

### `rg --sort=path` as relevance ranking, default multiline/preprocessing, and `--json` combined with `-l`/`-c`. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:3593-3655,4238-4294,5489-5527,6207-6240,6289-6340]` -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `rg --sort=path` as relevance ranking, default multiline/preprocessing, and `--json` combined with `-l`/`-c`. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:3593-3655,4238-4294,5489-5527,6207-6240,6289-6340]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `rg --sort=path` as relevance ranking, default multiline/preprocessing, and `--json` combined with `-l`/`-c`. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:3593-3655,4238-4294,5489-5527,6207-6240,6289-6340]`

### A phrase-only index without substring postings. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:804-819]` -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A phrase-only index without substring postings. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:804-819]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A phrase-only index without substring postings. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:804-819]`

### A phrase-only map with no substring postings is ruled out for parity because SQL uses `%token%` and admits partial tokens. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:817-819]` -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A phrase-only map with no substring postings is ruled out for parity because SQL uses `%token%` and admits partial tokens. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:817-819]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A phrase-only map with no substring postings is ruled out for parity because SQL uses `%token%` and admits partial tokens. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:817-819]`

### Claiming `rg` replaces continuity writes, causal traversal, or session state is ruled out because the commands are read-only and the phase-002/handler contracts are stateful. `[SOURCE: specs/system-speckit/049-memory-decommission/002-memory-consumer-rewire/spec.md:96-123; .opencode/skills/system-spec-kit/mcp-server/handlers/causal-graph.ts:624-712]` -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Claiming `rg` replaces continuity writes, causal traversal, or session state is ruled out because the commands are read-only and the phase-002/handler contracts are stateful. `[SOURCE: specs/system-speckit/049-memory-decommission/002-memory-consumer-rewire/spec.md:96-123; .opencode/skills/system-spec-kit/mcp-server/handlers/causal-graph.ts:624-712]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming `rg` replaces continuity writes, causal traversal, or session state is ruled out because the commands are read-only and the phase-002/handler contracts are stateful. `[SOURCE: specs/system-speckit/049-memory-decommission/002-memory-consumer-rewire/spec.md:96-123; .opencode/skills/system-spec-kit/mcp-server/handlers/causal-graph.ts:624-712]`

### Combining `--json` with `-l` or `-c`. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:3593-3655]` -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Combining `--json` with `-l` or `-c`. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:3593-3655]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Combining `--json` with `-l` or `-c`. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:3593-3655]`

### Default `--multiline` or `--pre` for Markdown. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:4238-4294,5489-5527]` -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Default `--multiline` or `--pre` for Markdown. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:4238-4294,5489-5527]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Default `--multiline` or `--pre` for Markdown. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:4238-4294,5489-5527]`

### Embeddings, stemming, stop-word expansion, or semantic paraphrase recovery in lexical v1. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:742-764; specs/system-speckit/049-memory-decommission/goal.md:43-55]` -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Embeddings, stemming, stop-word expansion, or semantic paraphrase recovery in lexical v1. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:742-764; specs/system-speckit/049-memory-decommission/goal.md:43-55]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Embeddings, stemming, stop-word expansion, or semantic paraphrase recovery in lexical v1. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:742-764; specs/system-speckit/049-memory-decommission/goal.md:43-55]`

### Re-running the body-based automatic trigger extractor during index generation is ruled out: it has its own stop-word/n-gram policy and would change an author-controlled frontmatter contract. `[SOURCE: .opencode/skills/system-spec-kit/shared/trigger-extractor.ts:571-658]` -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Re-running the body-based automatic trigger extractor during index generation is ruled out: it has its own stop-word/n-gram policy and would change an author-controlled frontmatter contract. `[SOURCE: .opencode/skills/system-spec-kit/shared/trigger-extractor.ts:571-658]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-running the body-based automatic trigger extractor during index generation is ruled out: it has its own stop-word/n-gram policy and would change an author-controlled frontmatter contract. `[SOURCE: .opencode/skills/system-spec-kit/shared/trigger-extractor.ts:571-658]`

### Reflowing every legacy body to one fact per line is ruled out by phase 004's no-body-rewrite boundary. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:108-123]` -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Reflowing every legacy body to one fact per line is ruled out by phase 004's no-body-rewrite boundary. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:108-123]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reflowing every legacy body to one fact per line is ruled out by phase 004's no-body-rewrite boundary. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:108-123]`

### Reflowing legacy bodies or silently injecting generic `session`/`context` triggers. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:108-123; .opencode/skills/system-spec-kit/scripts/core/frontmatter-editor.ts:141-166]` -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Reflowing legacy bodies or silently injecting generic `session`/`context` triggers. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:108-123; .opencode/skills/system-spec-kit/scripts/core/frontmatter-editor.ts:141-166]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reflowing legacy bodies or silently injecting generic `session`/`context` triggers. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:108-123; .opencode/skills/system-spec-kit/scripts/core/frontmatter-editor.ts:141-166]`

### Silently adding `session`/`context` to sparse documents is ruled out for a grep-precision corpus because the editor currently uses those as generic fallbacks. `[SOURCE: .opencode/skills/system-spec-kit/scripts/core/frontmatter-editor.ts:141-166]` -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Silently adding `session`/`context` to sparse documents is ruled out for a grep-precision corpus because the editor currently uses those as generic fallbacks. `[SOURCE: .opencode/skills/system-spec-kit/scripts/core/frontmatter-editor.ts:141-166]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Silently adding `session`/`context` to sparse documents is ruled out for a grep-precision corpus because the editor currently uses those as generic fallbacks. `[SOURCE: .opencode/skills/system-spec-kit/scripts/core/frontmatter-editor.ts:141-166]`

### Stop-word removal and stemming are ruled out for v1 because neither exists in the baseline trigger lane and both alter the required superset relation. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:742-764]` -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Stop-word removal and stemming are ruled out for v1 because neither exists in the baseline trigger lane and both alter the required superset relation. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:742-764]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Stop-word removal and stemming are ruled out for v1 because neither exists in the baseline trigger lane and both alter the required superset relation. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:742-764]`

### The planned root-level `retrieval/generate-trigger-index.mjs`, `retrieval/parity-check.mjs`, and `retrieval/fixtures/prompt-set.json` are not present in this checkout; their intended work is described by phase 001 instead. I did not create them because this run is research-only and lineage-scoped. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/plan.md:66-104; specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:44-63]` -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The planned root-level `retrieval/generate-trigger-index.mjs`, `retrieval/parity-check.mjs`, and `retrieval/fixtures/prompt-set.json` are not present in this checkout; their intended work is described by phase 001 instead. I did not create them because this run is research-only and lineage-scoped. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/plan.md:66-104; specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:44-63]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The planned root-level `retrieval/generate-trigger-index.mjs`, `retrieval/parity-check.mjs`, and `retrieval/fixtures/prompt-set.json` are not present in this checkout; their intended work is described by phase 001 instead. I did not create them because this run is research-only and lineage-scoped. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/plan.md:66-104; specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:44-63]`

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- A phrase-only map with no substring postings is ruled out for parity because SQL uses `%token%` and admits partial tokens. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:817-819]` (iteration 1)
- Stop-word removal and stemming are ruled out for v1 because neither exists in the baseline trigger lane and both alter the required superset relation. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:742-764]` (iteration 1)
- The planned root-level `retrieval/generate-trigger-index.mjs`, `retrieval/parity-check.mjs`, and `retrieval/fixtures/prompt-set.json` are not present in this checkout; their intended work is described by phase 001 instead. I did not create them because this run is research-only and lineage-scoped. `[SOURCE: specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/plan.md:66-104; specs/system-speckit/049-memory-decommission/001-trigger-index-replacement/tasks.md:44-63]` (iteration 1)
- `--sort=path` as relevance ranking: it is path ordering, single-threaded, and cannot express field/phrase priority. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:6207-6240,6289-6340]` (iteration 2)
- `-w` as trigger substring parity. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:804-819; https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:7436-7473]` (iteration 2)
- Combining `--json` with `-l` or `-c`. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:3593-3655]` (iteration 2)
- Default `--multiline` or `--pre` for Markdown. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:4238-4294,5489-5527]` (iteration 2)
- Claiming `rg` replaces continuity writes, causal traversal, or session state is ruled out because the commands are read-only and the phase-002/handler contracts are stateful. `[SOURCE: specs/system-speckit/049-memory-decommission/002-memory-consumer-rewire/spec.md:96-123; .opencode/skills/system-spec-kit/mcp-server/handlers/causal-graph.ts:624-712]` (iteration 3)
- Re-running the body-based automatic trigger extractor during index generation is ruled out: it has its own stop-word/n-gram policy and would change an author-controlled frontmatter contract. `[SOURCE: .opencode/skills/system-spec-kit/shared/trigger-extractor.ts:571-658]` (iteration 3)
- Reflowing every legacy body to one fact per line is ruled out by phase 004's no-body-rewrite boundary. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:108-123]` (iteration 3)
- Silently adding `session`/`context` to sparse documents is ruled out for a grep-precision corpus because the editor currently uses those as generic fallbacks. `[SOURCE: .opencode/skills/system-spec-kit/scripts/core/frontmatter-editor.ts:141-166]` (iteration 3)
- `rg --sort=path` as relevance ranking, default multiline/preprocessing, and `--json` combined with `-l`/`-c`. `[SOURCE: https://raw.githubusercontent.com/BurntSushi/ripgrep/master/crates/core/flags/defs.rs:3593-3655,4238-4294,5489-5527,6207-6240,6289-6340]` (iteration 5)
- A phrase-only index without substring postings. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:804-819]` (iteration 5)
- Embeddings, stemming, stop-word expansion, or semantic paraphrase recovery in lexical v1. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/hybrid-search.ts:742-764; specs/system-speckit/049-memory-decommission/goal.md:43-55]` (iteration 5)
- Reflowing legacy bodies or silently injecting generic `session`/`context` triggers. `[SOURCE: specs/system-speckit/049-memory-decommission/004-grep-convention-doc-retrofit/spec.md:108-123; .opencode/skills/system-spec-kit/scripts/core/frontmatter-editor.ts:141-166]` (iteration 5)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
What exact trigger-index shape, normalization, matching, and lookup contract preserves or exceeds `exactTriggerSearch` and its `LOWER(trigger_phrases) LIKE` behavior?

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
No memory-context call is used in this detached run; the authoritative context is the read-only parent/phase packet and repository source.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: parent `spec.md`, `goal.md`; phase 001/004 `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`; `mcp-server/lib/search/hybrid-search.ts`; `retrieval/generate-trigger-index.mjs`; `retrieval/parity-check.mjs`; `retrieval/fixtures/prompt-set.json`.
- Reuse candidates: existing trigger-index generator, committed index, retrieval convention, parity fixture, frontmatter parser, ANCHOR conventions, and phase acceptance criteria.
- Integration points: `exactTriggerSearch`, future replacement callers for the three memory tools, phase 001 generator/index/parity work, phase 004 validator/retrofit/templates.
- Constraints and risks: lineage-only writes; no parent spec writeback, `validate.sh`, generator execution, graph/MCP writes, or git mutation; `z_archive` and `node_modules` remain excluded.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05 (telemetry only before the hard cap)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: none for this detached run; only lineage-local files may be written
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `.deep-research-pause` in this lineage
- Capability matrix: `.opencode/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.opencode/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.opencode/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-09-02T17:10:52.423Z
