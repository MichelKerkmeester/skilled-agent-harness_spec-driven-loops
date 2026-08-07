===FINDINGS START===

## ReuseInventory

| Component | File:Line | How deep-context reuses it |
|---|---|---|
| `LoopType` union + `VALID_KINDS` / `VALID_RELATIONS` maps | `coverage-graph-db.ts:10,130-149` | **Extend** — add `'context'` to `LoopType`, add `ContextNodeKind` / `ContextRelation` arrays |
| `SCHEMA_SQL` CHECK constraint on `loop_type` | `coverage-graph-db.ts:157` | **Extend** — add `'context'` to `CHECK(loop_type IN ('research','review'))` |
| `upsertNode`, `upsertEdge`, `batchUpsert`, `getNodes`, `getEdges`, `createSnapshot` | `coverage-graph-db.ts:404-829` | **As-is** — namespace-scoped by `(spec_folder, loop_type, session_id)`; context rows just use `loop_type='context'` |
| `computeSignals()` dispatch | `coverage-graph-signals.ts:565-570` | **Extend** — add `if (ns.loopType === 'context') return computeContextSignals(ns)` branch |
| `computeNodeSignals()`, `computeDepths()`, `createSignalSnapshot()`, `computeMomentum()` | `coverage-graph-signals.ts:248-639` | **As-is** — loop-type-agnostic graph analytics |
| `findCoverageGaps()`, `findContradictions()`, `findProvenanceChain()`, `rankHotNodes()` | `coverage-graph-query.ts:130-438` | **Extend** — `findCoverageGaps` needs a `context` branch mapping `targetKinds` → `['MODULE']` and `coverageRelations` → `['MAPS_TO','DEPENDS_ON']` |
| `convergence.cjs` composite score + evaluate dispatch | `convergence.cjs:116-249` | **Extend** — add `if (loopType === 'context')` branch with context-specific thresholds and blocker logic |
| `upsert.cjs`, `query.cjs`, `status.cjs` | `deep-loop-runtime/scripts/` | **As-is** — generic entry points; pass `--loop-type context` |
| `executor-config.ts` (parse, resolve, fan-out) | `executor-config.ts:1-393` | **As-is** — deep-context is small-model-native; uses existing `native` / `cli-*` kinds |
| `prompt-pack.ts` (renderPromptPack) | `prompt-pack.ts:55-73` | **As-is** — deep-context provides its own `prompt_pack_iteration.md.tmpl`; renderer is generic |
| `post-dispatch-validate.ts` | `post-dispatch-validate.ts:515-713` | **Extend** — add `CONTEXT_ITERATION_FIELDS` constant; the validate function already accepts `requiredJsonlFields` param so mostly as-is |
| `atomic-state.ts` (writeStateAtomic) | `atomic-state.ts:36-54` | **As-is** |
| `jsonl-repair.ts` (repairJsonlTail, appendJsonlRecord) | `deep-loop-runtime/lib/deep-loop/jsonl-repair.ts` | **As-is** |
| `loop-lock.ts` | `deep-loop-runtime/lib/deep-loop/loop-lock.ts` | **As-is** |
| `bayesian-scorer.ts` | `deep-loop-runtime/lib/deep-loop/bayesian-scorer.ts` | **As-is** — convergence scoring primitive |
| `fallback-router.ts` | `deep-loop-runtime/lib/deep-loop/fallback-router.ts` | **As-is** — executor fallback matrix |
| `reduce-state.cjs` (parseJsonl, parseIterationFile, registry/dashboard rendering) | `reduce-state.cjs:80-1072` | **Fork+adapt** — new `reduce-context-state.cjs` reusing `parseJsonl`, `parseJsonlDetailed`, `parseIterationFile` (sections differ), `buildRegistry` skeleton, `renderDashboard` skeleton. Registry keys change: `modulesAnalyzed` / `patternsFound` / `dependenciesMapped` instead of `openQuestions` / `keyFindings` |
| `deep-research-config.json` schema | `deep_research_config.json:1-77` | **Fork+adapt** — `deep-context-config.json` with fields: `scope` (replaces `topic`), `sweepStrategy` (directory / module / concept), `maxIterations`, `convergenceThreshold` (0.08), `maxToolCallsPerIteration` (10), `executor`, `lineage`, `reducer` |
| `deep-research-strategy.md` template | `deep_research_strategy.md:1-109` | **Fork+adapt** — `deep-context-strategy.md` with sections: Scope, Modules Remaining, Patterns Found, Dependencies Mapped, Dead Ends, Next Sweep Focus |
| `prompt_pack_iteration.md.tmpl` | `prompt_pack_iteration.md.tmpl:1-65` | **Fork+adapt** — `prompt_pack_context_iteration.md.tmpl` with context-specific STATE/CONSTRAINTS/OUTPUT CONTRACT. Key difference: output is `iteration-NNN.md` with sections for Modules Analyzed, Patterns Discovered, Dependencies Found, Gaps Identified |
| `deep-research-dashboard.md` template | `deep_research_dashboard.md:1-118` | **Fork+adapt** — `deep-context-dashboard.md` with progress table columns: Sweep Focus, Modules Covered, New Patterns, Coverage % |
| `@context` agent's Context Package format | `context.md:234-272` | **Adapt sections** — deep-context iteration output mirrors the 6-section Context Package but per-iteration, with cumulative synthesis in `context/context-report.md` |
| `@context` agent's 3-layer retrieval strategy | `context.md:156-199` | **Directly instructs** the deep-context LEAF agent per-iteration — Layer 1 continuity, Layer 2 codebase/graph, Layer 3 memory |
| `@context` agent's query routing matrix | `context.md:92-104` | **Embed** in the deep-context iteration prompt as the agent's tool-selection guidance |

## ContextPackageStructure

The existing `@context` agent (`context.md:234-272`) produces a **single-pass** Context Package with 6 required sections:

1. **Memory Context** (`context.md:237-241`) — prior decisions, spec-doc records via `memory_match_triggers` + `memory_context`/`memory_search`
2. **Codebase Findings** (`context.md:243-247`) — file locations with `path:line`, patterns found, via `code_graph_query` + `Grep` + `Read`
3. **Pattern Analysis** (`context.md:249-253`) — naming conventions, architecture patterns, detected conventions
4. **Nested Dispatch Status** (`context.md:255-259`) — boundary enforcement (LEAF-only)
5. **Gaps & Unknowns** (`context.md:261-265`) — what could not be found/verified
6. **Recommendation** (`context.md:267-271`) — proceed / research-deeper / ask-user verdict

**Retrieval steps** per `context.md:148`:
- Scope lock → continuity `Read` → `memory_match_triggers` → `code_graph_status()` → `memory_context`/`memory_search` → `code_graph_query`/`code_graph_context` → `Grep`/`Glob`/`List` → `Read` for verification

**Key limitation**: one-shot, ~4K tokens, 10-20 tool calls. Deep-context iterates this across N sweeps, each producing a slice-bound Context Package that accumulates into a full `context/context-report.md`.

## ReuseMapFirstCut (Q7)

### Runtime libs: as-is vs extension

**As-is (zero changes):**
- `executor-config.ts` — deep-context uses existing `native`/`cli-*` executor kinds
- `prompt-pack.ts` — generic `{token}` template renderer
- `atomic-state.ts` — atomic JSON state writes
- `jsonl-repair.ts` — JSONL corruption recovery
- `loop-lock.ts` — single-writer locking
- `permissions-gate.ts` — capability checks
- `bayesian-scorer.ts` — convergence scoring primitive
- `fallback-router.ts` — executor fallback matrix
- `coverage-graph-db.ts` core CRUD (`upsertNode`, `upsertEdge`, `batchUpsert`, `getNodes`, `getEdges`, `createSnapshot`, `getStats`) — namespace-scoped, just uses `loop_type='context'`
- `coverage-graph-signals.ts` primitives (`computeNodeSignals`, `computeDepths`, `createSignalSnapshot`, `computeMomentum`)
- `coverage-graph-query.ts` (`findContradictions`, `findProvenanceChain`, `rankHotNodes`)
- All 4 runtime scripts (`convergence.cjs`, `upsert.cjs`, `query.cjs`, `status.cjs`) — pass `--loop-type context`

**Extend (add `context` branch to existing code):**
- `coverage-graph-db.ts:10` — `LoopType = 'research' | 'review' | 'context'`
- `coverage-graph-db.ts:130-149` — `VALID_KINDS['context']` and `VALID_RELATIONS['context']`
- `coverage-graph-db.ts:157` — CHECK constraint: `CHECK(loop_type IN ('research','review','context'))`
- `coverage-graph-signals.ts:565-570` — `computeSignals()` dispatch for `'context'`
- `coverage-graph-query.ts:130-209` — `findCoverageGaps()` context branch
- `convergence.cjs:268` — accept `'context'` in loopType validation
- `convergence.cjs:116-139` — `computeCompositeScore()` context weights
- `convergence.cjs:189-221` — `evaluateContext()` function with context-specific thresholds
- `post-dispatch-validate.ts:568-575` — `CONTEXT_ITERATION_FIELDS` constant

**New files (fork+adapt from deep-research):**
- `.opencode/skills/deep-context/SKILL.md` — skill definition
- `.opencode/skills/deep-context/assets/deep-context-config.json`
- `.opencode/skills/deep-context/assets/deep-context-strategy.md`
- `.opencode/skills/deep-context/assets/prompt_pack_context_iteration.md.tmpl`
- `.opencode/skills/deep-context/assets/deep-context-dashboard.md`
- `.opencode/skills/deep-context/scripts/reduce-context-state.cjs` — reuses `parseJsonl`, `parseIterationFile` from `reduce-state.cjs`
- `.opencode/skills/deep-context/references/` — protocol, convergence, state docs

### Ownership ADR scope

Per `deep-loop-runtime/SKILL.md:210`: *"ESCALATE to a new ownership ADR if a new consumer skill (beyond deep-review and deep-research) needs deep-loop runtime — extension requires a new ownership ADR."*

The ADR must cover:
1. **Consumer declaration** — `deep-context` as 3rd consumer of `deep-loop-runtime`
2. **Schema migration** — `LoopType` union extension, CHECK constraint update, new `VALID_KINDS`/`VALID_RELATIONS` entries (schema version bump from 2 → 3)
3. **Signal ownership** — `ContextConvergenceSignals` type + `computeContextSignals()` function owned by deep-context but living in `coverage-graph-signals.ts`
4. **Script contract** — `convergence.cjs` gains a `context` branch; no stdout JSON shape change
5. **Reducer ownership** — `reduce-context-state.cjs` owned by deep-context; no changes to `reduce-state.cjs`
6. **coexistence** — context rows are namespace-isolated by `loop_type='context'`; no collision with research/review rows

### Proposed coverage-graph delta for `loop_type='context'`

**Node kinds** (`ContextNodeKind`):
- `MODULE` — codebase unit (file, directory, component)
- `PATTERN` — architectural/design pattern detected
- `DEPENDENCY` — external or internal dependency
- `INTERFACE` — public API surface / exported symbol
- `CONSTRAINT` — detected invariant, config requirement, or behavioral constraint

**Relations** (`ContextRelation`):
- `MAPS_TO` — pattern applies to module (PATTERN → MODULE)
- `DEPENDS_ON` — module depends on dependency (MODULE → DEPENDENCY)
- `EXPOSES` — module exposes interface (MODULE → INTERFACE)
- `CONSTRAINS` — constraint governs module (CONSTRAINT → MODULE)
- `CONTRADICTS` — pattern or constraint conflicts (reused from research)
- `COVERS` — sweep coverage edge (reused)
- `DERIVED_FROM` — pattern derived from module analysis (reused)

**One convergence signal** (`ContextConvergenceSignals`):
```
moduleCoverage: number      // % of in-scope MODULE nodes with ≥1 outgoing MAPS_TO or DEPENDS_ON edge
patternStability: number    // % of PATTERN nodes with no CONTRADICTS edges
interfaceCompleteness: number // % of INTERFACE nodes with ≥1 EXPOSES edge
dependencyResolution: number  // % of DEPENDENCY nodes with resolved type (internal/external/unknown)
constraintCoverage: number    // % of CONSTRAINT nodes with ≥1 CONSTRAINS edge
```

**Composite score weights** (context):
```
moduleCoverage        × 0.30
patternStability      × 0.25
interfaceCompleteness × 0.20
dependencyResolution  × 0.15
constraintCoverage    × 0.10
```

**Proposed convergence threshold**: 0.08 on `newInfoRatio` (between research's 0.05 and review's 0.10 — context sweeps discover less net-new per iteration than research but more than review).

## OpenQuestions

1. **Spec-folder requirement** — deep-research/deep-review both operate against an existing spec folder. deep-context runs BEFORE `/speckit:plan`, so there may be no spec folder yet. Does deep-context create a lightweight `context/` packet directory, or does it need a new packet-local convention outside the spec-folder hierarchy?
2. **Sweep strategy** — how does the iteration agent decide which slice of the codebase to analyze next? The strategy.md "Next Focus" pattern works for research (question-driven) and review (dimension-driven); context needs a directory/module/concept sweep heuristic. Is this purely LLM-decided or does the coverage graph drive it (e.g., pick the MODULE node with lowest degree)?
3. **Integration with `/speckit:plan`** — does the context report become input to plan, or does it write findings directly into a spec.md? The `spec_check_protocol.md` fence-write pattern from deep-research could apply.
4. **resource-map.md interaction** — deep-research emits `resource-map.md` from convergence deltas. deep-context's sweep naturally produces a codebase inventory; should it emit or extend resource-map.md?
5. **Council integration** — `deep-loop-runtime/lib/council/` exists for deep-ai-council. Does deep-context need council primitives or is it strictly single-agent LEAF?
===FINDINGS END===
