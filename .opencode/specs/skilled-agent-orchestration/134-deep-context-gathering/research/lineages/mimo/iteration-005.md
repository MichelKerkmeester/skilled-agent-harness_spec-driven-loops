===FINDINGS START===

## FileInventory (deep-context skill + command + agent files)

Mirroring deep-research tree exactly:

**Skill: `.opencode/skills/deep-context/`**
```
SKILL.md                                    # Skill definition (mirrors deep-research/SKILL.md structure)
assets/
  deep_context_config.json                  # Config template (mirrors deep_research_config.json)
  deep_context_strategy.md                  # Strategy template (mirrors deep_research_strategy.md)
  deep_context_dashboard.md                 # Dashboard template
  prompt_pack_iteration.md.tmpl             # Per-iteration prompt pack for @deep-context agent
  runtime_capabilities.json                 # Executor capability matrix
references/
  guides/
    quick_reference.md                      # Operator cheat sheet
  protocol/
    loop_protocol.md                        # Lifecycle, dispatch, reducer, state flow
  convergence/
    convergence.md                          # Stop contracts, coverage-saturation thresholds
    convergence_signals.md                  # 5 context-specific signal definitions
  state/
    state_format.md                         # Packet layout, JSONL records
    state_jsonl.md                          # JSONL record schemas
    state_outputs.md                        # Iteration markdown + context-report structure
    state_reducer_registry.md               # Reducer-owned sections
scripts/
  reduce-state.cjs                          # State reducer (extends deep-research/reduce-state.cjs pattern)
  runtime-capabilities.cjs                  # Capability resolver
```

**Command: `.opencode/commands/deep/start-context-loop.md`**
Mirrors `start-research-loop.md` structure: setup prompt, YAML reference, convergence semantics, examples. Key differences: topic is "codebase scope" (glob patterns, directories, modules), not a research question.

**Command YAML assets: `.opencode/commands/deep/assets/`**
```
deep_start-context-loop_auto.yaml           # Autonomous mode workflow
deep_start-context-loop_confirm.yaml        # Interactive mode workflow
```

**Agent: `.opencode/agents/deep-context.md`**
Mirrors `deep-research.md` structure: LEAF-only, read-only analyzer, single-iteration protocol, state-first, packet scope lock. Key difference: tools are codebase-only (no WebFetch), uses code_graph_query + code_graph_context + Grep + Glob + Read.

---

## RuntimeReuse (as-is vs extend per lib)

### AS-IS (no changes needed — 10 modules)
| Module | File | Why AS-IS |
|--------|------|-----------|
| executor-config | `lib/deep-loop/executor-config.ts` | Schema already supports all executor kinds; context uses same executor types |
| executor-audit | `lib/deep-loop/executor-audit.ts` | Provenance block is loop-type-agnostic |
| prompt-pack | `lib/deep-loop/prompt-pack.ts` | Generic `{variable}` substitution; context provides its own template |
| post-dispatch-validate | `lib/deep-loop/post-dispatch-validate.ts` | Validates iteration file + JSONL append + delta; field list is caller-supplied |
| atomic-state | `lib/deep-loop/atomic-state.ts` | Atomic JSONL writes are loop-type-agnostic |
| jsonl-repair | `lib/deep-loop/jsonl-repair.ts` | Tail repair is format-agnostic |
| loop-lock | `lib/deep-loop/loop-lock.ts` | Single-writer locking is loop-type-agnostic |
| permissions-gate | `lib/deep-loop/permissions-gate.ts` | Permission scope checks are loop-type-agnostic |
| bayesian-scorer | `lib/deep-loop/bayesian-scorer.ts` | Laplace-smoothed scoring is generic |
| fallback-router | `lib/deep-loop/fallback-router.ts` | Executor fallback matrix is loop-type-agnostic |

### EXTEND (3 modules)
| Module | File | Change Required |
|--------|------|-----------------|
| coverage-graph-db | `lib/coverage-graph/coverage-graph-db.ts` | Add `'context'` to `LoopType` union; add `ContextNodeKind`, `ContextRelation`, `CONTEXT_WEIGHTS`, `CONTEXT_VALID_KINDS`, `CONTEXT_VALID_RELATIONS`; update `SCHEMA_VERSION` to 3; update CHECK constraint on `loop_type` column |
| coverage-graph-signals | `lib/coverage-graph/coverage-graph-signals.ts` | Add `ContextConvergenceSignals` interface + `computeContextSignals()` function; wire into `computeSignals()` dispatch |
| coverage-graph-query | `lib/coverage-graph/coverage-graph-query.ts` | Add context-specific gap queries: `findUncoveredModules()`, `findUnmappedPatterns()`, `findReuseGaps()` |

### NEW (0 runtime modules)
No new runtime lib modules needed. The 10+3 existing modules cover all deep-loop primitives.

### Scripts: `.cjs` entry points
| Script | Reuse | Notes |
|--------|-------|-------|
| `convergence.cjs` | EXTEND | Add `context` branch to `loopType` check (line 268); add `evaluateContext()` function; add `computeCompositeScore` context branch |
| `upsert.cjs` | AS-IS | Already loop-type-agnostic (validates against `VALID_KINDS[loopType]`) |
| `query.cjs` | AS-IS | Already loop-type-agnostic |
| `status.cjs` | AS-IS | Already loop-type-agnostic |
| `fanout-*.cjs` (4) | AS-IS | Fan-out infrastructure is loop-type-agnostic |

### Skill-owned scripts (new, in deep-context/scripts/)
| Script | Purpose |
|--------|---------|
| `reduce-state.cjs` | Context-specific reducer: refreshes strategy machine-owned sections, reuse-catalog, dashboard from JSONL + iteration files. Extends pattern from `deep-research/scripts/reduce-state.cjs`. |

---

## OwnershipADRScope (decisions the ADR must record)

Per deep-loop-runtime SKILL.md §4 ESCALATE IF: "a new consumer skill (beyond deep-review and deep-research) needs deep-loop runtime — extension requires a new ownership ADR."

**ADR title**: "deep-context as 3rd deep-loop-runtime consumer"

**Decisions to record**:

1. **Consumer registration**: deep-context is the 3rd consumer of deep-loop-runtime, joining deep-research and deep-review. It uses the same script entry points (convergence.cjs, upsert.cjs, query.cjs, status.cjs) and lib imports (deep-loop/*.ts, coverage-graph/*.ts).

2. **Loop type extension**: `LoopType` union extends from `'research' | 'review'` to `'research' | 'review' | 'context'`. This is a backward-compatible union extension (existing consumers are unaffected; new CHECK constraint is additive).

3. **Schema version bump**: `SCHEMA_VERSION` increments from 2 to 3. Migration: additive only (new loop_type value 'context' allowed in CHECK constraint). No data loss for existing research/review graphs.

4. **Convergence semantics**: deep-context converges on context-coverage saturation (file coverage, pattern saturation, reuse-catalog density, dependency completeness, API surface coverage) — distinct from deep-research's newInfoRatio (0.05) and deep-review's severity ratio (0.10). Default threshold: **0.15** on composite context-coverage score.

5. **Node-kind ownership**: Context-specific node kinds (FILE, DIRECTORY, MODULE, PATTERN, REUSE_CANDIDATE, API_SURFACE, DEPENDENCY, CONSTRAINT) are owned by loop_type='context'. They do not collide with research (QUESTION, FINDING, CLAIM, SOURCE) or review (DIMENSION, FILE, FINDING, EVIDENCE, etc.) kinds because the PK includes loop_type.

6. **Read-only analyzer contract**: deep-context agents are READ-ONLY codebase analyzers (no WebFetch, no external research). They use code_graph_query, code_graph_context, Grep, Glob, Read. This is a narrower tool surface than deep-research.

7. **Downstream integration**: Context Report feeds `/speckit:plan` and `/speckit:implement`. The report's REUSE CATALOG section (existing functions/utilities to extend, with file:line) is the highest-value section per repo principle.

---

## CoverageGraphDelta (loop_type='context' schema)

### Node Kinds (8 kinds)
```typescript
export type ContextNodeKind =
  | 'FILE'              // Source file analyzed
  | 'DIRECTORY'         // Directory boundary
  | 'MODULE'            // Logical module/package
  | 'PATTERN'           // Architectural pattern or convention
  | 'REUSE_CANDIDATE'   // Existing function/utility extendable
  | 'API_SURFACE'       // Public interface/exported symbol
  | 'DEPENDENCY'        // Import/dependency relationship
  | 'CONSTRAINT';       // Rule, invariant, or guardrail
```

### Relations (7 relations)
```typescript
export type ContextRelation =
  | 'CONTAINS'        // Directory contains file/module
  | 'IMPORTS'         // File/module imports dependency
  | 'IMPLEMENTS'      // File implements pattern
  | 'EXPOSES'         // Module exports API surface
  | 'REUSES'          // Target reuses source (reuse candidate)
  | 'CONSTRAINS'      // Constraint applies to target
  | 'DEPENDS_ON';     // Runtime/build dependency
```

### Default Weights
```typescript
export const CONTEXT_WEIGHTS: Record<ContextRelation, number> = {
  CONTAINS: 1.0,      // Structural containment (low signal weight)
  IMPORTS: 1.2,       // Dependency edges are high-signal for planning
  IMPLEMENTS: 1.4,    // Pattern conformance is high-value for reuse
  EXPOSES: 1.3,       // API surface mapping is critical for integration
  REUSES: 1.5,        // Reuse candidates are highest-value (repo principle)
  CONSTRAINS: 1.1,    // Constraints shape implementation boundaries
  DEPENDS_ON: 1.2,    // Dependency chains affect implementation order
};
```

### Valid Kinds/Relations Registration (in coverage-graph-db.ts)
```typescript
// Add to VALID_KINDS:
context: [
  'FILE', 'DIRECTORY', 'MODULE', 'PATTERN',
  'REUSE_CANDIDATE', 'API_SURFACE', 'DEPENDENCY', 'CONSTRAINT',
] as const,

// Add to VALID_RELATIONS:
context: [
  'CONTAINS', 'IMPORTS', 'IMPLEMENTS', 'EXPOSES',
  'REUSES', 'CONSTRAINS', 'DEPENDS_ON',
] as const,
```

### LoopType Union Extension (in coverage-graph-db.ts)
```typescript
// FROM:
export type LoopType = 'research' | 'review';
// TO:
export type LoopType = 'research' | 'review' | 'context';
```

### Schema CHECK Constraint Update
```sql
-- FROM:
loop_type TEXT NOT NULL CHECK(loop_type IN ('research', 'review'))
-- TO:
loop_type TEXT NOT NULL CHECK(loop_type IN ('research', 'review', 'context'))
```

### Schema Version Bump
```typescript
// FROM:
export const SCHEMA_VERSION = 2;
// TO:
export const SCHEMA_VERSION = 3;
```

### New Convergence Signals (in coverage-graph-signals.ts)
```typescript
export interface ContextConvergenceSignals {
  fileCoverage: number;           // % of discovered source files analyzed (nodes:FILE with iteration set / total FILE nodes)
  patternSaturation: number;      // % of discovered patterns with ≥2 IMPLEMENTS edges
  reuseCatalogDensity: number;    // REUSE_CANDIDATE nodes per 100 source files
  dependencyCompleteness: number; // % of IMPORTS edges that form complete chains (no dangling targets)
  apiSurfaceCoverage: number;     // % of EXPOSED API_SURFACE nodes with documented signatures (metadata.present)
}
```

### Composite Score Weights (in convergence.cjs `computeCompositeScore`)
```javascript
// Context composite score:
const score =
  clamp(signals.fileCoverage) * 0.25 +
  clamp(signals.patternSaturation) * 0.20 +
  clamp(signals.reuseCatalogDensity) * 0.25 +  // Highest weight: repo principle
  clamp(signals.dependencyCompleteness) * 0.15 +
  clamp(signals.apiSurfaceCoverage) * 0.15;
```

### Convergence Thresholds (in convergence.cjs `evaluateContext`)
```javascript
const thresholds = {
  fileCoverage: 0.70,           // 70% of discovered files analyzed
  patternSaturation: 0.60,      // 60% of patterns have ≥2 implementations
  reuseCatalogDensity: 0.05,    // ≥5 reuse candidates per 100 files
  dependencyCompleteness: 0.80, // 80% of import chains complete
  apiSurfaceCoverage: 0.65,     // 65% of APIs documented
};
```

### New Signal Function (in coverage-graph-signals.ts)
```typescript
export function computeContextSignals(ns: Namespace): ContextConvergenceSignals {
  const nodes = getNodes(ns);
  const edges = getEdges(ns);
  // Implementation: compute 5 signals from node/edge data
  // fileCoverage: count FILE nodes with iteration != null / total FILE nodes
  // patternSaturation: PATTERN nodes with ≥2 IMPLEMENTS incoming edges / total PATTERN nodes
  // reuseCatalogDensity: REUSE_CANDIDATE count / (FILE count / 100)
  // dependencyCompleteness: IMPORTS edges where target exists / total IMPORTS edges
  // apiSurfaceCoverage: API_SURFACE nodes with metadata.present / total API_SURFACE nodes
  return { fileCoverage, patternSaturation, reuseCatalogDensity, dependencyCompleteness, apiSurfaceCoverage };
}
```

### Wire into computeSignals() dispatch
```typescript
export function computeSignals(ns: Namespace): ConvergenceSignals {
  if (ns.loopType === 'research') return computeResearchSignals(ns);
  if (ns.loopType === 'context') return computeContextSignals(ns);
  return computeReviewSignals(ns);
}
```

===FINDINGS END===
