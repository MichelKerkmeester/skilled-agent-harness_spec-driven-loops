---
title: "Decision Record: Graph Preservation Quality Benchmark"
description: "Four implementation-approach ADRs: reuse the existing per-flag eval harness rather than building a parallel one, author a classifier-verified labeled fixture rather than reusing the unlabeled existing corpus, treat F15's memory_health wiring as an independent in-packet sub-task, and amend REQ-003 from causal-edge regeneration (unsatisfiable with any shipped tool) to quiescence-verification."
trigger_phrases:
  - "graph preservation quality benchmark decisions"
  - "reuse retrieval flag eval harness"
  - "classifier verified fixture"
  - "F15 counter wiring decision"
  - "quiescence verification reindex decision"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/021-graph-preservation-quality-benchmark"
    last_updated_at: "2026-07-10T14:30:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Added ADR-004 (REQ-003 amendment) and confirmed all four ADRs implemented and verified."
    next_safe_action: "None -- packet complete."
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-021-graph-preservation-quality-benchmark"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Graph Preservation Quality Benchmark

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Extend the Existing Per-Flag Eval Harness Rather Than Build a New One

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-09 |
| **Deciders** | Planning session (this packet) |

---

<!-- ANCHOR:adr-001-context -->
### Context

This repo already ships a per-flag before/after eval harness,
`run-retrieval-flag-eval.mjs`, that backs up a copy of the live database
(`prepareEvalDatabase()`, `run-retrieval-flag-eval.mjs:200-224`), toggles one flag at a time via
`forceFlag()`/`restoreEnv()`, runs real `hybridSearchEnhanced()` queries through it, and scores
Recall@K/nDCG@10/MRR per query-class dimension against a labeled ground-truth corpus
(`computeMeanMetrics()`, `groupQueriesByClass()`, `:270-352`). Neither
`SPECKIT_RETRIEVAL_CLASS_ROUTING` nor `SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION` is
currently listed in its `FLAG_SPECS` array (`:49-92`).

### Constraints
- This packet's mandate is to build the missing benchmark, not a second parallel benchmarking system.
- The existing harness's reindexed-copy, per-class-metric, and reconciliation-check machinery
  (`:330-352`) already solves exactly the problem this packet needs solved.
- A second harness with its own backup/restore and metric logic would drift out of sync with the
  first over time, doubling maintenance for no measurable benefit.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Extend `run-retrieval-flag-eval.mjs` (either by adding both flags directly to its
`FLAG_SPECS` array, or by building a thin sibling driver that imports and reuses its exported
helpers) rather than building an independent benchmarking pipeline.

**How it works**: The exact file-layout choice (in-place `FLAG_SPECS` addition vs. a sibling driver
importing the harness's exported functions) is deferred to implementation time — plan.md leaves it as
an open question — but the underlying mechanism is fixed by this ADR: reuse
`prepareEvalDatabase()`, `buildPerFlagSearchOptions()`, `computeMeanMetrics()`, and
`groupQueriesByClass()` verbatim.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Extend the existing harness** | No duplicated backup/restore or metric logic, benefits from its existing reconciliation-check safety net (`:330-352`), matches this repo's established pattern for `040-flag-graduation-benchmark` | Existing harness's `FLAG_SPECS` shape is generic per-flag, not purpose-built for slice-level (content-rich-short/SingleHop/control) reporting, so the slicing logic still needs new code | 9/10 |
| Build a standalone benchmark script from scratch | Full control over slicing and reporting shape | Duplicates the eval-DB backup/restore logic, the metric computation, and the reconciliation-check invariant, all of which already work correctly | 3/10 |
| Extend `groupQueriesByClass()`'s existing `category` dimension in place, adding `content_rich_short`/`single_hop` as new `QueryCategory` values | Reuses the exact grouping mechanism the harness already has, no separate slicing logic needed | Couples this packet's fixture semantics to the shared `QueryCategory` union other packets also read; a naming collision risk if a future packet independently adds a similar category | 7/10 |

**Why this one**: Extending the harness is the option that both minimizes duplicated infrastructure and
keeps the new slicing logic separate from the shared `QueryCategory` union, reducing coupling to other
packets' use of that type.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- No new backup/restore or metric-computation code to maintain in parallel.
- Inherits the existing reconciliation-check safety net for free.
- Matches the shape of the `040-flag-graduation-benchmark` sibling precedent, keeping this parent's
  benchmark-packet convention consistent.

**What it costs**:
- The harness's `FLAG_SPECS` array grows, and if the file-layout decision favors direct addition over
  a sibling driver, the file's blast radius (any change to it) grows slightly. Mitigation: prefer the
  sibling-driver layout unless direct addition proves clearly simpler during implementation.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future change to `run-retrieval-flag-eval.mjs`'s internals breaks this packet's extension silently | M | The Verification phase's regression check re-runs the harness's existing test coverage alongside this packet's new tests |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Both flags' own docstrings name a reindexed before/after benchmark as the graduation bar (`search-flags.ts:443-444,459-460`) and neither has one; the need is stated in the flags' own shipped code, not invented for this packet |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives compared (extend harness, build standalone, extend the shared `QueryCategory` union in place); the shared-union option was seriously considered, not dismissed by default |
| 3 | **Sufficient?** | PASS | Reuses `prepareEvalDatabase()`/`buildPerFlagSearchOptions()`/`computeMeanMetrics()`/`groupQueriesByClass()` verbatim; no new backup/restore or metric-computation logic is built |
| 4 | **Fits Goal?** | PASS | Directly targets this packet's stated deliverable (a real evaluation harness with labeled ground truth), not a tangential improvement |
| 5 | **Open Horizons?** | PASS | Extension approach keeps the two eval harnesses (retrieval-flag, graph-preservation) on a shared, maintained code path rather than forking, so future flag families can follow the same pattern |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `run-retrieval-flag-eval.mjs` (or a new sibling driver importing from it) with specific change: `FLAG_SPECS` additions or exported-helper reuse
- The new fixture file with specific change: created, not modified

**How to roll back**: `git revert` (or delete) the new driver file, or revert the `FLAG_SPECS` diff
hunk in `run-retrieval-flag-eval.mjs`; no other code imports either, so no downstream cleanup is
needed.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Author a Classifier-Verified Labeled Fixture Rather Than Reuse the Existing Corpus As-Is

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-09 |
| **Deciders** | Planning session (this packet) |

---

### Context

The existing `ground-truth.json` corpus carries 103 queries and 275 relevance rows, but only 18
queries at `simple` complexity tier, and no label distinguishing a content-rich-short query
(`isContentRichShortQuery()`'s exact predicate, `query-classifier.ts:174-183`) or a SingleHop query
(`SINGLE_HOP_PATTERNS`, `retrieval-class-classifier.ts:53-58`) from any other query in the set. The
prior 7-query spot-check that motivated this packet failed to produce a verdict specifically because
it had no labeled ground truth to score against — repeating that mistake at a larger scale (e.g.
picking 50 queries from the existing corpus "that seem simple") would not actually fix the underlying
problem if those queries do not reliably trip the two flags' real activation predicates.

### Constraints
- The benchmark's verdict is only as trustworthy as its fixture's fidelity to the flags' real
  activation logic.
- Hand-labeling by inspection is exactly the kind of unverified-assumption failure mode this repo's
  `CLAUDE.md` "Reason from actual data, not assumptions" mandate calls out.
- 50+ queries is a meaningful authoring cost (see plan.md's effort estimate, 6-10 hours for this phase
  alone) and re-authoring after discovering the fixture does not actually trip the target predicate
  would be wasted work.

---

### Decision

**Summary**: Every fixture query is run through the real, live `isContentRichShortQuery()` or
`classifyRetrievalClass()` function at fixture-build time, and only queries that actually trip the
intended predicate are kept in that slice. The control slice is verified the same way, in reverse
(confirmed to trip neither predicate).

**Details**: This is not a new classifier or a new verification framework — it is calling the same
functions `query-router.ts` already calls in production, from the fixture-authoring script/test, so a
fixture query's labeled slice membership is a runtime-verified fact, not an author's assumption.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Classifier-verified authoring** | Fixture membership is a proven fact, not an assumption; catches authoring mistakes before they corrupt the benchmark's verdict | Requires running the classifiers during fixture authoring, a small extra step per query | 9/10 |
| Hand-label by inspection (author's judgment only) | Faster to author | Exactly the failure mode that made the prior 7-query spot-check inconclusive; a mislabeled query silently corrupts the slice's delta | 2/10 |
| Reuse the existing 18 simple-tier queries unmodified, accept whatever predicate mix they happen to have | Zero new authoring cost | No control over slice composition or count; likely far short of the required 50+ and the required per-predicate coverage | 3/10 |

**Why Chosen**: Classifier-verified authoring directly closes the exact gap (no labeled ground truth,
no confirmed predicate membership) that made the prior spot-check inconclusive, at an acceptable
extra cost given the packet is already budgeting significant authoring time.

---

### Consequences

**Positive**:
- The benchmark's verdict is traceable to a real, reproducible predicate match, not an assumption.
- The fixture-shape test (REQ-001) can assert predicate membership programmatically, catching future
  classifier drift automatically rather than only at fixture-authoring time.

**Negative**:
- Some hand-authored candidate queries will fail verification and be discarded, so the effective
  authoring cost is higher than 50 queries' worth of writing — Mitigation: already reflected in
  plan.md's 6-10 hour estimate for this phase.

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| A future classifier change silently invalidates a previously-verified fixture query's slice membership | M | REQ-001's programmatic verification re-runs at benchmark-run time, not just once at authoring time, so drift is caught automatically |

---

### Implementation

**Affected Systems**:
- The new fixture file
- The fixture-shape test

**Rollback**: Delete or revert the fixture file; no other code depends on it.

<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: F15 Counter Wiring Is an Independent Sub-Task Inside This Packet, Not a Separate Phase or Packet

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-09 |
| **Deciders** | Planning session (this packet) |

---

### Context

The parent task's scope explicitly names wiring the F15 counter into `memory_health`'s reporting
surface as part of this packet ("Also wire the existing but currently in-process-only F15
exception/skip-channel counter into memory_health's persistent reporting surface before any soak
testing begins"). The counter itself already exists and is already exported
(`query-router.ts:376-378,550-551`), shipped by sibling packet `016-cross-package-flag-governance`.
`memory_health` already has an established, precedented pattern for this exact kind of in-process
telemetry field (`routingTelemetry`, `graphChannelMetrics`,
`memory-crud-health.ts:1417-1457,1517-1538`).

### Constraints
- The counter wiring shares no code path, no data, and no fixture with the benchmark half of this
  packet.
- It is small (one import, one guarded read, one object-literal field) relative to the benchmark
  half's fixture-authoring cost.
- The parent scope groups it with this packet rather than a separate one.

---

### Decision

**Summary**: Implement the F15 counter wiring as Phase 4 of this packet's plan, independent of and
parallelizable with the benchmark fixture/driver phases (Phase 2-3), rather than splitting it into a
separate packet or deferring it to a follow-up.

**Details**: Because it shares no dependency with the benchmark half, it can be built, tested, and
verified on its own schedule without blocking or being blocked by the fixture-authoring or driver
work — reflected in plan.md's phase-dependency diagram, where Phase 4 depends only on Phase 1 (Setup),
not on Phase 2 or 3.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Independent Phase 4 inside this packet** | Matches the parent scope's explicit grouping, small and low-risk, can land independently of the benchmark's larger fixture-authoring effort | Slightly widens this single packet's blast radius across two unrelated surfaces (eval harness + memory_health handler) | 8/10 |
| A separate sibling packet | Cleaner single-responsibility packet boundary | Contradicts the parent task's explicit scope, which groups both under one packet; adds spec-folder overhead for a change this small | 4/10 |
| Defer to a future soak-testing packet | Avoids touching memory_health now | The parent scope explicitly requires the counter be wired in "before any soak testing begins" — deferring it would leave soak testing with no visibility exactly when it is needed most | 2/10 |

**Why Chosen**: The parent scope explicitly asks for this grouping, and the wiring's independence from
the benchmark half means grouping it does not create a false coupling — the two can still be verified,
reviewed, and (if needed) rolled back separately.

---

### Consequences

**Positive**:
- Matches the parent task's explicit scope grouping.
- No artificial packet-boundary overhead for a small, well-precedented change.
- Delivers the counter's visibility ahead of any future soak test, as required.

**Negative**:
- This packet's diff touches two unrelated subsystems (eval harness, `memory_health` handler) instead
  of one — Mitigation: the two halves are implemented, tested, and can be reverted independently per
  plan.md's rollback section, so the coupling is organizational only, not technical.

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Reviewers conflate the two halves' risk profiles (the benchmark half is exploratory/measurement, the wiring half is a small production code change) | L | plan.md's Phase 4 and Phase 5 checklist items keep the wiring's verification (REQ-006/REQ-007, additive-only diff) explicit and separate from the benchmark's findings-record verification |

---

### Implementation

**Affected Systems**:
- `query-router.ts` (export only, already done by the prior packet)
- `memory-crud-health.ts` (new import, new guarded read, new field)

**Rollback**: Revert the `memory-crud-health.ts` diff; `query-router.ts` is untouched by this packet.

<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: REQ-003 Amended to Quiescence-Verification, Not Causal-Edge Regeneration

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-10 |
| **Deciders** | Implementation session (this packet), grounded in a dedicated pre-implementation feasibility investigation |

---

### Context

Before implementation began, a read-only feasibility investigation was run to check whether this
packet's original plan was actually buildable. It found that the original REQ-003 wording ("a freshly
reindexed snapshot -- embeddings and causal_edges regenerated") is unsatisfiable with any tool this
repo currently ships: the existing reindex tooling forces an embedding rescan but only creates causal
edges for changed folders, and can still classify unchanged rows as unchanged. No shipped tool performs
a full causal-edge regeneration from scratch. Requiring it as written would make Phase 3 permanently
blocked.

### Constraints
- The benchmark still needs the entity-density signal `shouldPreserveGraph()` reads to reflect a
  coherent, non-mid-scan graph state, or the measurement is meaningless.
- Building a true clone-only causal-edge rebuild (preserving intentional/manual edges) is a
  substantial undertaking on its own, out of proportion to this packet's scope.
- A manual source-database reindex would contradict this packet's own claim that mutation stays
  confined to the temp snapshot.

---

### Decision

**Summary**: Amend REQ-003 from "regenerate embeddings and causal edges" to "verify the source is
quiescent (no pending/failed embeddings, no active scan/embedder job) before copying it read-only into
the eval temp root."

**Details**: The benchmark driver's pre-flight (`assertSourceQuiescent`) reads the source database
directly and refuses to proceed if it finds pending, retry-queued, or failed embeddings, or an active
scan/embedder job. This does not guarantee a *freshly regenerated* graph, but it does guarantee a
*coherent* one -- no mid-write state gets copied into the snapshot the benchmark measures against.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Quiescence-verification (chosen)** | Buildable today with existing schema/table reads; keeps the driver fail-closed; matches what the source database can actually promise | Does not force a *fresher* graph state than whatever the source already has | 8/10 |
| Build a new clone-only causal-edge rebuild | Would satisfy the original wording literally | A substantial new subsystem, disproportionate to this packet's scope; risks silently diverging from the production edge-derivation logic it would have to duplicate | 3/10 |
| Keep the original wording, block on it | No implementation deviation | Makes Phase 3 permanently unbuildable with today's tooling -- the packet would never ship | 0/10 |

**Why Chosen**: Quiescence-verification is the only option that is both buildable now and honest about
what it actually guarantees. The alternative of building full causal-edge regeneration was explicitly
weighed and rejected as disproportionate; a future packet can revisit it if a benchmark specifically
needs freshly-regenerated (not just quiescent) edges.

---

### Consequences

**Positive**:
- Phase 3 is buildable and was actually run end to end against the live corpus.
- The pre-flight is a real, testable safety property (6 test cases in
  `graph-preservation-flag-eval-driver.vitest.ts`), not an unverifiable claim.

**Negative**:
- The benchmark measures whatever graph state the source database happens to be in at run time, not a
  guaranteed-fresh one. Mitigation: the pre-flight records and reports the exact quiescence state
  checked (embedding counts, scan/embedder job state) in `benchmark-results.md`, so this limitation is
  visible, not hidden.

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| A future reader assumes "quiescent" means "fully up to date" | M | `benchmark-results.md` and this ADR both state the distinction explicitly |

---

### Implementation

**Affected Systems**:
- `spec.md` REQ-003 (amended wording, acceptance criteria)
- `plan.md` (Reindex step architecture section rewritten, both open decisions resolved)
- `scripts/evals/run-graph-preservation-flag-eval.mjs` (`assertSourceQuiescent`, `assertWithinEvalRoot`)

**Rollback**: Revert the driver's pre-flight functions; the spec/plan wording changes are documentation
only and carry no code dependency to unwind.

<!-- /ANCHOR:adr-004 -->

---

<!--
Level 3 Decision Record
Document significant technical decisions
One ADR per major decision
All ADRs should have Accepted/Rejected status before completion
-->
