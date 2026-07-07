---
title: "Decision Record: deep-context loop ownership"
description: "Ownership decision record for deep-context: 3rd deep-loop-runtime consumer, loop_type='context' schema bump, by-model shared-scope convergence, native-parallel dispatch, read-only analyzer contract, and the no-new-MCP boundary."
trigger_phrases:
  - "deep-context decision"
  - "ownership adr"
  - "loop_type context"
  - "schema version bump"
  - "third runtime consumer"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/025-deep-context-gathering/001-context-loop-foundation"
    last_updated_at: "2026-06-06T18:05:22Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored ownership ADR for deep-context runtime consumer"
    next_safe_action: "Cross-check plan/tasks/checklist evidence against ADR decisions"
    blockers: []
    key_files:
      - "specs/system-deep-loop/z_archive/025-deep-context-gathering/001-context-loop-foundation/research/research.md"
      - ".opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts"
    session_dedup:
      fingerprint: "sha256:1aecb6c05c8afddbea2821d951fa97eec42d3241a133b2c0cd0c60677edc6667"
      session_id: "dc-134-20260606"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "Final slice granularity + convergence thresholds (calibration against real runs)"
      - "Backport of native-parallel dispatch to research/review fan-out"
    answered_questions:
      - "deep-context registers as the 3rd deep-loop-runtime consumer"
      - "loop_type='context' is an additive schema extension at SCHEMA_VERSION 3"
      - "Convergence is by-model shared-scope cross-executor agreement plus a relevance gate"
---
# Decision Record: deep-context loop ownership

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Register deep-context as the 3rd deep-loop-runtime consumer

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-06 |
| **Deciders** | deep-context owner, runtime maintainer |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed an inward "understand the codebase" loop that runs before `/speckit:plan` and `/speckit:implement`, and we had to decide whether to build it standalone or as another consumer of the shared `deep-loop-runtime`. The runtime already powers deep-research and deep-review, and its `SKILL.md` §4 mandates an ownership ADR before a third consumer can extend shared schema or convergence. Building standalone would have duplicated the executor pool, atomic-state, prompt-pack, and coverage-graph machinery we already trust.

### Constraints

- `deep-loop-runtime/SKILL.md` §4 requires a sign-off ADR before any third consumer touches shared schema or convergence.
- The runtime's 10 core libs (`executor-config`, `executor-audit`, `prompt-pack`, `post-dispatch-validate`, `atomic-state`, `jsonl-repair`, `loop-lock`, `permissions-gate`, `bayesian-scorer`, `fallback-router`) plus the `fanout-*.cjs` and `upsert/query/status` scripts must keep working unchanged for research and review.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Register deep-context as the third `deep-loop-runtime` consumer, reusing the 10 core libs as-is and extending only the coverage-graph layer plus `convergence.cjs`.

**How it works**: deep-context mirrors the deep-research skill tree (SKILL.md, assets, references, `reduce-state.cjs`) and drives the shared executor pool. It passes `--loop-type context` through the existing scripts and adds a context branch to the coverage-graph modules. Research and review consume the runtime untouched.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **3rd runtime consumer (chosen)** | Reuses 10 tested libs; one convergence engine; one coverage graph | Requires an ownership ADR and careful additive schema change | 9/10 |
| Standalone context tool | No shared-schema risk | Duplicates executor pool, atomic-state, prompt-pack, graph; divergent convergence math | 4/10 |
| Extend the one-shot `@context` agent | Smallest surface | No convergence gate, no fan-out, no saturation signal; hits its ~50K-token ceiling | 3/10 |

**Why this one**: Reusing the runtime gives us a proven executor pool and a single coverage-graph contract, and the additive schema bump keeps research/review intact at a far lower cost than rebuilding the machinery.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- deep-context inherits atomic state, loop-lock, prompt-pack validation, and fallback routing without new code.
- A single coverage-graph schema now serves three loop types, so signal math and tests stay centralized.

**What it costs**:
- The runtime now has a third dependent, so schema and convergence changes need wider regression coverage. Mitigation: keep all context additions behind `loop_type='context'` branches and gate on the full runtime test suite.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A context-branch change leaks into research/review paths | H | All context logic dispatches on `loop_type`; 99/99 coverage-graph tests + 36/36 executor-config tests gate every change |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | No convergence-gated codebase-context loop exists; plan Step 5 uses ad-hoc one-shot exploration |
| 2 | **Beyond Local Maxima?** | PASS | Standalone and `@context`-extension alternatives evaluated and scored |
| 3 | **Sufficient?** | PASS | Reuses 10 libs; only the coverage-graph layer + convergence are extended |
| 4 | **Fits Goal?** | PASS | Directly serves the reuse-first planning/implementation goal |
| 5 | **Open Horizons?** | PASS | Additive consumer model leaves room for a 4th consumer later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.opencode/skills/deep-context/**` created as a new runtime consumer mirroring deep-research.
- The shared `fanout-*.cjs` and `upsert/query/status` scripts accept `--loop-type context` with no signature changes.

**How to roll back**: Delete the `deep-context` skill, command, and agent directories; the runtime reverts to two consumers. The `loop_type='context'` schema rows are an isolated, regenerable cache (see ADR-002) and need no separate revert.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Extend the coverage graph with loop_type='context' and bump SCHEMA_VERSION 2 to 3

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-06 |
| **Deciders** | deep-context owner, runtime maintainer |

---

<!-- ANCHOR:adr-002-context -->
### Context

We needed the coverage graph to store context-loop nodes (slices, reuse candidates, gaps) and relations (frontier/explored bookkeeping, reuse edges) without breaking the research and review graphs that share the same SQLite tables. The graph's `coverage_nodes` and `coverage_edges` tables carry a `loop_type` column with a CHECK constraint, so adding a third loop value is a schema change that the version gate must recognize.

### Constraints

- The coverage graph is a regenerable per-session cache, not a system of record. Every run rebuilds it from lineage JSONL.
- Existing research/review rows must remain valid; the change must be additive at the CHECK-constraint level.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Add `'context'` to the `LoopType` union, `VALID_KINDS`, `VALID_RELATIONS`, and the CHECK constraints, define `ContextNodeKind`/`ContextRelation` and `CONTEXT_WEIGHTS`, and bump `SCHEMA_VERSION` from 2 to 3 using the runtime's existing drop-and-recreate migration.

**How it works**: On open, when the stored version is below 3 the runtime drops and recreates `coverage_nodes`, `coverage_edges`, and `coverage_snapshots`, then records version 3. Because the graph is a regenerable cache, the drop loses no durable data — the next run repopulates it from lineage state.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Additive CHECK + drop/recreate migration (chosen)** | Simple; matches existing migration path; zero durable-data loss since the graph is a cache | Touches a shared schema; needs a version bump | 9/10 |
| Separate context-only SQLite file | No shared-schema risk | Forks signal/query code; loses one centralized graph contract | 5/10 |
| In-place ALTER without version bump | No table recreate | SQLite CHECK constraints are not alterable in place; version drift goes undetected | 2/10 |

**Why this one**: The graph is a per-session cache, so the cheapest correct migration is the runtime's existing drop-and-recreate keyed on a single version bump, with no durable data at risk.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- One graph schema now expresses context node kinds and reuse-weighted edges alongside research and review.
- Context signal math reads the same tables the other loops use, so the query and upsert scripts stay shared.

**What it costs**:
- Opening an older graph triggers a one-time recreate. Mitigation: the recreate is silent and lossless because the cache rebuilds from lineage JSONL on the next run.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Schema change regresses research/review graphs | H | Additive CHECK only; SCHEMA_VERSION gate; 99/99 coverage-graph tests pass post-change |
| A future caller assumes the graph is durable | M | ADR records the cache contract; migration relies on regeneration, not preservation |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Context nodes/relations cannot be stored without the schema extension |
| 2 | **Beyond Local Maxima?** | PASS | Separate-file and in-place-ALTER options evaluated |
| 3 | **Sufficient?** | PASS | Minimal additive set; reuses the existing migration path |
| 4 | **Fits Goal?** | PASS | Enables saturation/reuse signals the report depends on |
| 5 | **Open Horizons?** | PASS | Version gate supports future schema growth |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `coverage-graph-db.ts`: `LoopType` union, `VALID_KINDS`/`VALID_RELATIONS`, CHECK constraints, `ContextNodeKind`/`ContextRelation`, `CONTEXT_WEIGHTS`, `SCHEMA_VERSION` 2 to 3.
- `coverage-graph-signals.ts` and `coverage-graph-query.ts`: context node kinds and the gap query branch read the recreated tables.

**How to roll back**: Revert `SCHEMA_VERSION` to 2 and remove the `'context'` CHECK values; the next graph open recreates clean v2 tables. No durable data is lost because the graph is a cache.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Converge on by-model shared-scope cross-executor agreement plus a relevance gate

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-06 |
| **Deciders** | deep-context owner |

---

<!-- ANCHOR:adr-003-context -->
### Context

Each deep loop needs its own convergence definition. Research stops on `newInfoRatio` (novelty) and review stops on severity-weighted P0/P1/P2 findings. deep-context is neither: it is an inward sweep where "enough context" means a heterogeneous pool of executors has independently agreed on the relevant surface and noise is not masquerading as progress. We had to pick a signal set that captures cross-executor agreement over a shared scope while keeping low-relevance collection from blocking saturation.

### Constraints

- Raw coverage ("% slices visited") is a known trap because coverage does not equal utility.
- Convergence must produce a defensible stop reason and a deadlock escape, mirroring the runtime's rolling-average pattern.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Drive convergence with five context signals computed by `computeContextSignals`/`computeContextSignalsFromData` and evaluated by `evaluateContext`: `sliceCoverage`, `reuseCatalogCoverage` (weighted highest), `agreementRate` (blocking guard), `relevanceFloor` (blocking guard, gate 0.55), and `dependencyCompleteness`. The saturation threshold is 0.10 and agreement requires a minimum of 2 executors.

**How it works**: A pool of heterogeneous executors works the same shared scope by-model. The loop stops when new relevant coverage flattens below 0.10 over the evidence window AND both blocking guards pass: `agreementRate` clears its floor with at least 2 executors agreeing, and `relevanceFloor` stays at or above 0.55. Max-iteration cap and a deadlock detector provide legal stops.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **By-model agreement + relevance gate (chosen)** | Cross-executor agreement is a strong "we understand this" signal; relevance gate blocks noise | Needs >=2 executors to be meaningful | 9/10 |
| Reuse research's `newInfoRatio` | Already implemented | Novelty is the wrong signal for an inward saturation task | 3/10 |
| Reuse review's severity weighting | Already implemented | Context has no severity axis; would misrank reuse candidates | 2/10 |
| Raw slice-coverage percentage | Trivial to compute | Coverage != utility; over-collection looks like progress | 2/10 |

**Why this one**: Agreement across a heterogeneous pool plus a relevance floor directly answers "is the relevant surface understood," which neither novelty nor severity captures.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Convergence reflects genuine cross-executor agreement on the relevant surface, not raw visit counts.
- The relevance floor stops low-value collection from inflating the saturation delta.

**What it costs**:
- Agreement needs at least two executors to be meaningful, so a single-executor run falls back to coverage-and-relevance only. Mitigation: the default pool is heterogeneous; single-lineage is reserved for trivial scopes.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Convergence never triggers | M | Saturation delta + agreement/relevance guards + max-iter cap + deadlock detector |
| Threshold mis-tuned for real repos | M | 0.10 is a calibration default; final value set against 2-3 real runs |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Research/review signals do not fit an inward saturation task |
| 2 | **Beyond Local Maxima?** | PASS | Novelty, severity, and raw-coverage options rejected with rationale |
| 3 | **Sufficient?** | PASS | Five signals + two guards + cap + deadlock cover the stop space |
| 4 | **Fits Goal?** | PASS | Agreement-on-relevant-surface is exactly "enough context" |
| 5 | **Open Horizons?** | PASS | Threshold is calibratable; embedding relevance is a v2 add |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `coverage-graph-signals.ts`: `computeContextSignals` / `computeContextSignalsFromData` emit the five signals.
- `convergence.cjs`: `evaluateContext` applies the 0.10 threshold, the agreement guard (min 2 executors), and the relevance gate (0.55).

**How to roll back**: Remove the context branch from `convergence.cjs` and the context signal functions; no research/review convergence path is touched.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Realize native-parallel dispatch via the council scaffold concurrent with the CLI pool

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-06 |
| **Deciders** | deep-context owner, runtime maintainer |

---

<!-- ANCHOR:adr-004-context -->
### Context

deep-context runs a heterogeneous executor pool (native Task seats plus cli-opencode, cli-codex, and others) over a shared scope, and the value depends on those executors running in parallel rather than one at a time. Research and review currently fan out their native seats sequentially. We had to decide how to get true native parallelism for deep-context without rewriting the fan-out path that research and review already rely on.

### Constraints

- Research and review have tested, working sequential-native fan-out; regressing them is unacceptable in this packet.
- A native-parallel primitive already exists: the council scaffold `dispatchCouncilSeats` in `multi-seat-dispatch.cjs`.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Realize native parallelism for deep-context by reusing the council parallel scaffold `dispatchCouncilSeats`, with the host dispatching native Task seats as a parallel batch concurrently with the CLI executor pool.

**How it works**: The host launches the native Task seats as one parallel batch through the council scaffold and runs the cli-opencode/cli-codex pool at the same time, so native and CLI executors work the shared scope concurrently. Research and review keep their current sequential-native fan-out unchanged.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Council scaffold + concurrent CLI pool (chosen)** | Reuses a tested parallel primitive; no change to research/review fan-out | Two dispatch paths coexist until the backport | 8/10 |
| Backport native-parallel into the shared fan-out now | One unified path | Risks regressing research/review's tested sequential workflows in this packet | 4/10 |
| Keep deep-context native dispatch sequential | Simplest | Defeats the heterogeneous-parallel premise; slow convergence | 3/10 |

**Why this one**: It delivers true native parallelism for deep-context immediately using an existing scaffold, while leaving research and review's tested behavior untouched.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- deep-context native seats run concurrently with the CLI pool, so a heterogeneous sweep finishes in roughly the slowest-executor time, not the sum.
- Research and review fan-out behavior is provably unchanged.

**What it costs**:
- Two native-dispatch paths exist until the shared backport lands. Mitigation: the backport to research/review is recorded as an explicit follow-up, deliberately out of scope here to avoid regressing tested workflows.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Divergence between deep-context and shared fan-out paths | M | Follow-up backport tracked; council scaffold is already tested |
| Concurrent native+CLI dispatch overruns a budget | M | Concurrency cap reused from `fanout-pool.cjs`; per-slice token budget |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Heterogeneous-parallel sweep is the core premise of deep-context |
| 2 | **Beyond Local Maxima?** | PASS | Shared-backport-now and sequential options weighed |
| 3 | **Sufficient?** | PASS | Council scaffold supplies the parallel primitive; no new dispatcher |
| 4 | **Fits Goal?** | PASS | Parallel native+CLI execution is what makes the loop fast enough to use |
| 5 | **Open Horizons?** | PASS | Backport path keeps a single future dispatch model open |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- The host dispatches native Task seats as a parallel batch via `dispatchCouncilSeats` concurrently with the CLI pool.
- Research and review fan-out paths are not modified.

**How to roll back**: Have the host dispatch native seats sequentially; the CLI pool path is unaffected. The shared backport is not part of this packet, so there is nothing to revert there.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Add a promptFramework lineage field for per-model framing

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-06 |
| **Deciders** | deep-context owner |

---

<!-- ANCHOR:adr-005-context -->
### Context

The heterogeneous pool mixes models with different prompt-craft sweet spots: MiMo-V2.5-Pro performs best with COSTAR framing while MiniMax-M3 performs best with TIDD-EC. A single shared prompt framing underserves at least one model. We needed a per-lineage way to select the framing without forking the prompt pack per model.

### Constraints

- The framing selector must live in the lineage/executor config so the prompt pack can read it at render time.
- It must default to null so research and review lineages are unaffected.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: Add a `promptFramework` lineage field (the optional per-model framing key `n` in `executor-config.ts`, e.g. "costar") that the prompt pack consumes to frame each model's dispatch.

**How it works**: Each lineage entry carries an optional framing key. When set, the prompt pack applies that framing for the lineage; when null, the default framing applies. The field is stripped from the executor subset so it never leaks into the spawn arguments.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Per-lineage promptFramework field (chosen)** | One config knob; per-model framing; null default is inert | Adds a field to the lineage schema | 9/10 |
| One framing for all models | No schema change | Underserves models with different prompt sweet spots | 4/10 |
| A separate prompt pack per model | Maximal control | Duplicates and de-syncs prompt assets | 3/10 |

**Why this one**: A single nullable field gives per-model framing with no duplication and zero impact on the other loops.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- Each model can be framed with its best-fit prompt structure, raising schema fidelity and `file:line` accuracy.
- The prompt pack stays single; framing is data, not a fork.

**What it costs**:
- The lineage schema gains one field. Mitigation: it defaults to null and is validated, so existing configs are unaffected.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Framing key typo selects no framing | L | Field is schema-validated (min length, nullable); 36/36 executor-config tests pass |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Mixed-model pool needs per-model framing to perform |
| 2 | **Beyond Local Maxima?** | PASS | Single-framing and per-model-pack options rejected |
| 3 | **Sufficient?** | PASS | One nullable field covers the need |
| 4 | **Fits Goal?** | PASS | Better framing raises analyzer output quality |
| 5 | **Open Horizons?** | PASS | New framings are added as data, not code |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `executor-config.ts`: the optional `n` framing key is parsed, defaulted to null, and excluded from the executor subset.

**How to roll back**: Remove the `n` field from the lineage schema; lineages fall back to the default framing.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Read-only analyzer seat contract with host-writes-state

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-06 |
| **Deciders** | deep-context owner, runtime maintainer |

---

<!-- ANCHOR:adr-006-context -->
### Context

The merged Context Report is what `/speckit:plan` and `/speckit:implement` consume, so it must never be corrupted by a sub-agent, and only the host holds the all-lineages view needed for dedup and rollup. We also operate under a Gate-3 write boundary: dispatching a model to edit files writes nothing because the project Gate-3 hard block intercepts it. The seats therefore have to be read-only analyzers by contract.

### Constraints

- Sub-agents must not write the merged report, the cross-lineage graph, or convergence state.
- The lineage prompt must carry the gather-subject, slice boundary, known context, and output schema, validated before spawn.
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: A read-only analyzer seat contract paired with host-writes-state. Each seat writes only inside its own artifact dir (write-once iteration files, append-only slice JSONL); the host writes every merged surface (the report, attribution, cross-lineage graph upserts, convergence).

**How it works**: The lineage prompt declares `read_only:true` and carries `gather_subject`, `slice_boundary`, `known_context`, and `output_schema` as mandatory fields validated at render time so a missing field throws before spawn. Seats emit schema-bound findings; the host merges, deduplicates, resolves refs, and writes all shared state.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Read-only seats + host-writes-state (chosen)** | Report cannot be corrupted by a seat; Gate-3-safe; only host has the merge view | Host carries all write responsibility | 9/10 |
| Let seats write merged state directly | Less host code | Race-prone; Gate-3 blocks model writes anyway; corrupts the consumed report | 2/10 |
| Seats write per-lineage merged reports | Parallel write | No single all-lineages dedup; conflicting reports for the consumer | 3/10 |

**Why this one**: It is the reducer-owned-files pattern reused verbatim, it is Gate-3-safe, and it guarantees a single uncorrupted report for downstream consumers.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- The merged report has one writer, so dedup and rollup are consistent and uncorruptible.
- A missing dispatch field fails fast at render time instead of producing a blind worker.

**What it costs**:
- The host owns all merge and write logic. Mitigation: this is the same reducer-owned-files pattern already proven in research/review.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A seat attempts an out-of-scope write | M | `read_only:true` contract; no write tools granted; Gate-3 hard block as backstop |
| Lineage dispatched with a missing field | M | `renderPromptPack`-time validation throws before spawn |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The consumed report must have a single uncorrupted writer |
| 2 | **Beyond Local Maxima?** | PASS | Seat-writes and per-lineage-report options rejected |
| 3 | **Sufficient?** | PASS | Read-only + host-writes + pre-spawn validation covers the contract |
| 4 | **Fits Goal?** | PASS | Guarantees the report planning/implementation depends on |
| 5 | **Open Horizons?** | PASS | Pattern matches the other loops; extensible |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- The `@deep-context` agent is a LEAF read-only analyzer (code-graph/grep/read tools, no WebFetch, no write tools).
- The lineage prompt validates `gather_subject`, `slice_boundary`, `known_context`, `output_schema`, and `read_only:true` before spawn.

**How to roll back**: Not applicable as a standalone revert; removing the deep-context skill (ADR-001) removes the contract with it.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: Ship no new MCP tools

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-06 |
| **Deciders** | deep-context owner, runtime maintainer |

---

<!-- ANCHOR:adr-007-context -->
### Context

The runtime isolation ADR for `deep-loop-runtime` prohibits consumers from registering new MCP tools, so the platform's MCP surface stays stable across loop types. deep-context needs code-graph queries and file reads, both of which the existing Code Graph MCP and read tools already provide. We had to confirm that the loop adds zero MCP tools.

### Constraints

- The runtime isolation ADR forbids new MCP tools for runtime consumers.
- All context retrieval must use existing Code Graph MCP queries plus Grep/Read.
<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We chose**: Ship deep-context with no new MCP tools.

**How it works**: Frontier seeding uses the existing `code_graph_query` calls; reference resolution and reads use the existing Code Graph and file-read tools. The loop adds a skill, a command, and an agent, but registers nothing on the MCP surface.
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **No new MCP tools (chosen)** | Honors the isolation ADR; stable MCP surface; reuses Code Graph | Bound to existing query shapes | 9/10 |
| Add a context-specific MCP tool | Bespoke query ergonomics | Violates the isolation ADR; grows the MCP surface per consumer | 2/10 |

**Why this one**: The existing Code Graph MCP plus Grep/Read fully cover frontier seeding and ref resolution, so a new tool would add surface area for no capability the isolation ADR allows.
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

**What improves**:
- The MCP surface stays identical across all three loop types.
- deep-context inherits Code Graph improvements without its own tool maintenance.

**What it costs**:
- deep-context is bound to existing Code Graph query shapes. Mitigation: Glob+Grep fallback covers cases the graph cannot serve.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Existing queries miss a needed shape | L | Glob+Grep fallback; future Code Graph additions are shared, not consumer-specific |
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The isolation ADR requires confirming zero new MCP tools |
| 2 | **Beyond Local Maxima?** | PASS | A bespoke MCP tool was considered and rejected |
| 3 | **Sufficient?** | PASS | Code Graph MCP + Grep/Read cover seeding and resolution |
| 4 | **Fits Goal?** | PASS | Keeps the platform MCP surface stable |
| 5 | **Open Horizons?** | PASS | Shared Code Graph growth benefits all loops |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-007-five-checks -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**:
- No MCP registration. Frontier seeding and ref resolution call existing `code_graph_query` plus Grep/Read.

**How to roll back**: Not applicable; there is nothing registered to remove.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: Defer cli-devin agent-config wiring out of the default pool

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-06 |
| **Deciders** | deep-context owner |

---

<!-- ANCHOR:adr-008-context -->
### Context

The heterogeneous pool ships with native Task seats plus cli-opencode and cli-codex executors. cli-devin is another available executor, but wiring its agent-config into the default pool adds dispatch and permission surface we have not yet validated for a read-only analyzer role. We had to decide whether cli-devin belongs in the v1 default pool.

### Constraints

- The default pool must be executors we have validated for the read-only analyzer contract.
- Adding an unvalidated executor risks dispatch or permission regressions in the first real runs.
<!-- /ANCHOR:adr-008-context -->

---

<!-- ANCHOR:adr-008-decision -->
### Decision

**We chose**: Defer cli-devin agent-config wiring; it is not in the default deep-context pool.

**How it works**: The default pool is native + cli-opencode + cli-codex. cli-devin remains available for later wiring once its agent-config and read-only behavior are validated, but it is excluded from the shipped default configuration.
<!-- /ANCHOR:adr-008-decision -->

---

<!-- ANCHOR:adr-008-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Defer cli-devin (chosen)** | Default pool stays validated; smaller first-run surface | One fewer lens in v1 | 8/10 |
| Wire cli-devin into the default pool now | More model diversity immediately | Unvalidated dispatch/permission surface for a read-only seat | 4/10 |

**Why this one**: A validated default pool matters more than maximal model diversity for the first real runs, and cli-devin can be added later without redesign.
<!-- /ANCHOR:adr-008-alternatives -->

---

<!-- ANCHOR:adr-008-consequences -->
### Consequences

**What improves**:
- The shipped default pool is limited to executors validated for read-only analysis.
- First-run dispatch and permission behavior stays predictable.

**What it costs**:
- v1 runs with one fewer model lens. Mitigation: native + cli-opencode + cli-codex already satisfy the minimum-2-executor agreement requirement.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Later cli-devin wiring needs rework | L | The pool is config-driven; adding an executor is additive, not a redesign |
<!-- /ANCHOR:adr-008-consequences -->

---

<!-- ANCHOR:adr-008-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The default pool composition must be decided for v1 |
| 2 | **Beyond Local Maxima?** | PASS | Wiring-now option evaluated and rejected |
| 3 | **Sufficient?** | PASS | Three executors satisfy the agreement minimum |
| 4 | **Fits Goal?** | PASS | A validated pool protects the first real runs |
| 5 | **Open Horizons?** | PASS | cli-devin can be wired later with no redesign |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-008-five-checks -->

---

<!-- ANCHOR:adr-008-impl -->
### Implementation

**What changes**:
- The default deep-context pool config lists native + cli-opencode + cli-codex; cli-devin is omitted.

**How to roll back**: Not applicable; cli-devin is simply absent from the default config and can be added when validated.
<!-- /ANCHOR:adr-008-impl -->
<!-- /ANCHOR:adr-008 -->

---

<!--
Level 3 Decision Record: One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
