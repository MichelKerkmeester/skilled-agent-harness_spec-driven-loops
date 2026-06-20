---
title: "Decision Record: Code-Graph Seeded-PPR Impact Ranking (Q3-C1 cluster)"
description: "Architectural decisions for the net-new Code Graph seeded-PPR impact-ranking cluster: REUSE 027's already-shipped weighted-walk traversal substrate (do not stand up a second walker); GATE PPR to impact/multi-hop modes only and ship the mechanism while deferring the damping/cap/decay parameter VALUES to a code-graph retrieval benchmark that does not yet exist; CG-lexical-vector-seed-union is CUT (NO-GO) — the code-graph deliberately disowned its semantic/vector backend."
trigger_phrases:
  - "seeded ppr impact ranking decisions"
  - "q3-c1 reuse 027 weighted walk"
  - "gate ppr impact multi hop decision"
  - "lexical vector seed union no-go"
  - "code graph personalized pagerank adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/005-seeded-ppr-ranking"
    last_updated_at: "2026-06-19T08:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author seeded-PPR decision record from 028/002 research"
    next_safe_action: "Confirm 027 collectWeightedWalk reuse before building PPR (ADR-001)"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-005-seeded-ppr-ranking-replan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Code-Graph Seeded-PPR Impact Ranking (Q3-C1 cluster)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

> DELETED, superseded by measurement. The `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` flag and its code were removed in the flag-resolution reckoning because PPR went negative on the real forward-CALLS graph where uniform edges make it equal to the prior ranking. See [`../../007-kept-off-flag-resolution/`](../../007-kept-off-flag-resolution/). The ADRs below are retained as the design-of-record for why the mechanism was built and gated.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Reuse 027's weighted-walk traversal substrate; do NOT stand up a second graph-walk engine

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | 028/002 research (synthesis 04 sibling-and-cross-cutting, iter-14), Code Graph + Memory MCP maintainers |

---

<!-- ANCHOR:adr-001-context -->
### Context

Q3-C1 needs a multi-hop spread engine to push seed mass across the structural graph. The impact walk is UNBUILT for this — it is a flat reverse-`CALLS`/`IMPORTS` enumeration in DB iteration order (`code-graph-context.ts:668-676`), and `rg pagerank|personaliz|teleport|damping|ppr|random-walk` over the live `system-code-graph/mcp_server/` returns ZERO hits (re-confirmed at plan time). 027 already ships a causal-edge weighted-walk traversal in the Memory MCP — `collectWeightedWalk`(seeds + maxHops + weighted frontier) / `collectCausalWeightedNeighbors` in `system-spec-kit/mcp_server/lib/graph/bfs-traversal.ts` (confirmed present at plan time). The synthesis explicitly directs reusing that traversal rather than authoring a second walker, and to confirm-before-building. A correction sits underneath this: the roadmap/synthesis line "027 has only edge-count/degree; the old PageRank helper was 'never wired'" does NOT hold against the live tree — there is no PageRank helper in either MCP (`rg pagerank` empty in both `lib/graph/`). The real, existing reuse target is the weighted-walk substrate, not a dormant helper to wire.

### Constraints
- The spread must run inside the existing 400ms `expandAnchor` budget (`code-graph-context.ts:401-403`).
- Two divergent graph walkers would drift; the campaign's "build once, reuse N" discipline applies.
- The 027 substrate lives in a different subsystem (Memory MCP) than the consumer (Code Graph) — cross-subsystem reuse may need a thin adapter.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: drive the PPR spread over 027's already-shipped `collectWeightedWalk`/`collectCausalWeightedNeighbors` traversal after a reuse-confirmation gate. If the API does not cross subsystems cleanly, define a minimal adapter rather than forking a parallel walker.

**How it works**: a reuse-confirmation gate (read the signatures, confirm the node/edge shapes are reusable from the code-graph context path) is the critical-path FIRST step. It FAILS CLOSED — if the API is not reusable, Q3-C1 is blocked and escalated, never silently forked into a second walker. The bounded PPR primitive (seed vector, teleport weights, power-method) then layers on top of the reused frontier.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Reuse 027's weighted-walk substrate (chosen)** | One traversal substrate, no walker drift; realizes the synthesis directive; less net-new code | Cross-subsystem reuse may need a thin adapter | 9/10 |
| Author a code-graph-specific PPR walker | No cross-subsystem coupling | Duplicates traversal logic; contradicts the synthesis directive; two walkers drift | 2/10 |
| Hunt for and wire the "never-wired PageRank helper" | Would be cheap IF it existed | The helper does NOT exist in either MCP (`rg pagerank` empty); chasing it is wasted effort | 1/10 |

**Why this one**: the weighted-walk substrate is the real, existing, cross-subsystem reuse target; reusing it avoids a second walker and the non-existent-helper dead end.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- One traversal substrate; no drift between two walkers; less net-new code to maintain.

**What it costs**:
- A reuse-confirmation gate is the critical-path first step (a small upfront read). Mitigation: it is also the de-risk — it catches a shape mismatch before any PPR code is written.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The 027 API couples to Memory-specific node/edge shapes | M | The reuse gate defines a minimal adapter; it does not fork a walker |
| Someone forks a second walker under time pressure | M | This ADR + REQ-001 record the reuse directive; review gate |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Q3-C1 needs a spread engine; 027 already ships one |
| 2 | **Beyond Local Maxima?** | PASS | Second-walker and wire-the-helper alternatives weighed (helper does not exist) |
| 3 | **Sufficient?** | PASS | Reuse-confirm gate + the bounded PPR primitive on top |
| 4 | **Fits Goal?** | PASS | Realizes the synthesis "reuse, do not rebuild" directive |
| 5 | **Open Horizons?** | PASS | One substrate underpins both Memory and Code Graph multi-hop ranking |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes (IF built)**:
- `code-graph-context.ts`: a new bounded-PPR primitive whose spread runs over 027's `collectWeightedWalk` (consumed, after the reuse gate).
- `system-spec-kit/.../lib/graph/bfs-traversal.ts`: CONSUMED only — not modified, not re-implemented.

**How to roll back**: PPR is reversible by a default-off flag; with it off, the flat enumeration returns byte-identical. The 027 substrate is untouched, so there is nothing to revert there.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: GATE PPR to impact/multi-hop modes; ship the mechanism, defer parameter VALUES to a benchmark

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | 028/002 research (iter-2 finding 14, iter-14 CAUTION; roadmap §3 Query-Class Routing), Code Graph maintainers |

---

<!-- ANCHOR:adr-002-context -->
### Context

aionforge's hard, named lesson is that indiscriminate graph expansion measurably hurts single-hop precision while it helps multi-hop recall (`retrieval.md:108-118`) — so it GATES Personalized PageRank to `MultiHop`/`Entity` query classes only. The code-graph has no such shape taxonomy: the live `query-intent-classifier.ts` emits only `QueryIntent='structural'` and explicitly disowned its semantic backend (`:6,:82-92`). Separately, no candidate anywhere in the 200-iteration campaign has a measured before/after benefit number — every leverage/effort tag is structural inference (research §6) — and NO code-graph retrieval benchmark exists to validate PPR ranking quality or to tune the damping factor, the power-method cap, and the decay magnitudes.

### Constraints
- Running PPR on the cheap single-hop neighborhood/outline default re-introduces the named precision-loss failure mode.
- The 028 program forbids fabricated benefit numbers; the regression-baseline discipline requires a measured before/after.
- A budget cut must return the best PPR-ranked prefix, never arbitrary DB-order truncation (NFR-P01).
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: build a SingleHop/MultiHop/Entity query-class taxonomy and GATE PPR ON for impact/multi-hop modes only (OFF for the single-hop default; fail-safe toward OFF on an ambiguous class); land the PPR MECHANISM with safe defaults and treat the tuned damping factor, power-method cap, and decay magnitudes as a separate benchmark follow-up.

**How it works**: the gate short-circuits the single-hop path before any walk (zero PPR cost, byte-identical default). For impact/multi-hop, the bounded power-method runs inside the 400ms budget and a budget cut returns the best-ranked prefix. The ranking-quality CLAIM and the parameter VALUES are explicitly NOT asserted until a code-graph retrieval benchmark is built.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Mode-gate + ship-mechanism / defer-parameters (chosen)** | Single-hop precision structurally protected; mechanism reversible now; honest about un-measured quality | Needs a new taxonomy; quality claim waits for a benchmark | 9/10 |
| PPR default-on for all modes | No taxonomy to build | Re-introduces the named single-hop precision-loss failure mode | 2/10 |
| Ship guessed damping/cap/decay VALUES as a quality claim | "Done" sooner | Fabricated benefit number; violates the 028 no-fabrication + regression-baseline discipline | 1/10 |

**Why this one**: gating protects precision and shipping the mechanism while deferring the parameters is the only honest path when no benchmark exists.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Single-hop precision is structurally protected; the cheap default is byte-identical and zero-cost.
- The mechanism ships reversibly now; the quality claim and parameter tuning wait for a measured benchmark.

**What it costs**:
- A new SingleHop/MultiHop/Entity taxonomy must be built (the structural classifier has none). Mitigation: a heuristic taxonomy is in scope; new semantic signals are an open question, not a blocker.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The gate leaks PPR onto the single-hop default | H | Fail-safe toward PPR-OFF on ambiguity; single-hop byte-identity regression test |
| Unbounded power-method blows the 400ms budget | H | Hard iteration cap; termination property test; best-prefix fallback |
| The mechanism ships and is read as a measured quality win | M | The benchmark caveat is recorded in spec §2, checklist CHK-113, and this ADR |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Indiscriminate expansion hurts single-hop precision (named aionforge failure mode) |
| 2 | **Beyond Local Maxima?** | PASS | Default-on and ship-guessed-values alternatives weighed and rejected |
| 3 | **Sufficient?** | PASS | Taxonomy + mode-gate + bounded cap + best-prefix fallback |
| 4 | **Fits Goal?** | PASS | Keeps the 028 program honest (no fabricated benefit number) |
| 5 | **Open Horizons?** | PASS | The mechanism lands now; the quality claim + tuning follow a benchmark |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes (IF built)**:
- `query-intent-classifier.ts`: add a SingleHop/MultiHop/Entity taxonomy on top of `QueryIntent='structural'`.
- `code-graph-context.ts`: the gate routes PPR ON for impact/multi-hop, OFF for the single-hop default; the bounded power-method runs inside the 400ms budget with a best-prefix fallback.

**How to roll back**: disable the PPR default-off flag (the flat enumeration returns byte-identical); the gate failing OFF on ambiguity is the safe default.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: CG-lexical-vector-seed-union is CUT (NO-GO) — a scope violation against the structural-only design, not deferred work

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-19 |
| **Deciders** | 028/002 research (iter-14 NO-GO), Code Graph maintainers |

---

<!-- ANCHOR:adr-003-context -->
### Context

CG-lexical-vector-seed-union proposed seeding the graph expansion from BM25 seeds UNION vector seeds, so lexical seeds keep expansion alive when the embedder is down. The lexical seed half exists (a disabled fallback in `seed-resolver.ts`), but the VECTOR half does NOT: the code-graph module explicitly disowned its semantic/vector backend — the query classifier disowned its semantic backend (`query-intent-classifier.ts:82-92`) and the seed resolver is lexical/structural-only with no vector provider (`seed-resolver.ts`). Building a vector-seed union would mean re-introducing a semantic/vector backend the module deliberately removed.

### Constraints
- The code-graph is structural-only by design; a vector backend is out of its scope.
- The candidate must be recorded so it is not silently dropped, but it must not be mistaken for deferred work someone later "un-defers".
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: CUT CG-lexical-vector-seed-union as NO-GO. It is recorded here (so nothing is silently dropped) as a SCOPE VIOLATION against the code-graph's deliberate structural-only design — not as deferred or gated work.

**How it works**: no vector backend is introduced. If a future need for semantic seeding ever appears, it is a new scope decision about the code-graph's identity, not an un-deferral of this candidate.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **CUT / NO-GO (chosen)** | Honors the structural-only design; records the candidate without inviting a scope violation | The lexical-fallback resilience idea is not pursued | 9/10 |
| Defer it (gated) | Leaves a door open | Mislabels a scope violation as deferrable work; invites someone to wire a vector backend later | 2/10 |
| Build the vector-seed union | Lexical keeps expansion alive when the embedder is down | Re-introduces the semantic/vector backend the module deliberately removed; scope violation | 1/10 |

**Why this one**: a vector-seed union contradicts the code-graph's deliberate structural-only design; recording it CUT prevents both silent loss and a future scope violation.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- The code-graph stays structural-only; no vector backend is re-introduced.
- The candidate is recorded with its NO-GO rationale — nothing silently dropped.

**What it costs**:
- The lexical-fallback resilience idea is not pursued. Mitigation: it is recorded; it can be re-raised as a new scope decision if ever needed.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Someone reads CUT as deferred and tries to wire a vector backend | M | This ADR records it as a SCOPE VIOLATION, not deferred; review gate |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Prevents a scope violation against the structural-only design |
| 2 | **Beyond Local Maxima?** | PASS | Defer and build alternatives weighed and rejected |
| 3 | **Sufficient?** | PASS | A CUT/NO-GO record is the deliverable |
| 4 | **Fits Goal?** | PASS | Keeps the cluster scope honest; nothing silently dropped |
| 5 | **Open Horizons?** | PASS | A future semantic-seeding need is a fresh scope decision, not an un-defer |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- No code — the candidate is CUT. The spec §3 candidate table and tasks T050 record the NO-GO; no vector backend is introduced.

**How to roll back**: N/A — a non-coding CUT decision.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
