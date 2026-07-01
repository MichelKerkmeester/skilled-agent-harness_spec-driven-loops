---
title: "Feature Specification: Edge-Presence Currentness & Temporal Recall (028/001 impl phase)"
description: "Make bi-temporal edge-presence the live currentness path for the Spec-Kit Memory MCP: wire the already-ON temporal-edge substrate into the read side (C3-A), add TemporalMode recall (C3-C), expose the lib-only as-of lineage resolver as a memory_history tool, parse a time range from the NL query (CG-temporal-query-extraction) and extend the C3-D 2-channel revision matrix to a 4-channel unforget-disjointness invariant. C3-A shipped then was kept off, the other four candidates remain PENDING behind their gates."
trigger_phrases:
  - "edge presence currentness"
  - "temporal mode recall"
  - "memory history as-of tool"
  - "temporal query extraction"
  - "unforget channel disjointness"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/008-edge-presence-currentness"
    last_updated_at: "2026-06-19T06:00:00+02:00"
    last_updated_by: "claude-opus-4-8"
    recent_action: "C3-A shipped then kept off as integrity-only, 4 candidates pending"
    next_safe_action: "Land C3-C TemporalMode and memory_history after the C3-B substrate lands"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "../research/research.md"
      - "../../research/roadmap.md"
      - "../../research/synthesis/01-go-candidates.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-008-replan"
      parent_session_id: null
    completion_pct: 20
    open_questions:
      - "Does C3-C Current replace active_memory_projection (L) or read alongside it (M)?"
      - "Is the C3-B four-timestamp window additive with no reader rewrites (unverified at source)?"
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: Edge-Presence Currentness & Temporal Recall (028/001 impl phase)

## EXECUTIVE SUMMARY

This implementation phase turns the Spec-Kit Memory MCP's bi-temporal substrate from a build-side, read-unwired feature into the **live currentness path**, and layers temporal recall capability on top of it. It covers five candidates from packet 028's Memory research: **C3-A** (edge-presence currentness as the live retirement path), **C3-C** (TemporalMode recall: Current / AsOf / AsKnownAt / History), **memory_history** (expose the lib-only as-of lineage resolver as a tool), **CG-temporal-query-extraction** (parse a time range from the NL query) and **M-unforget-channel-disjointness** (extend the C3-D 2-channel revision matrix to a 4-channel disjointness invariant). C3-A is now implemented in the current working tree, the remaining four candidates stay PENDING behind schema, benchmark or shared-infra gates.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | in-progress |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Packet** | system-spec-kit/028-memory-search-intelligence/001-speckit-memory |
| **Source roadmap** | `../../research/roadmap.md` (BROADENING + 027-REVISIT + MEMORY-SYSTEMS addenda, authoritative) |
| **Source synthesis** | `../../research/synthesis/01-go-candidates.md`, `03-corrections-caveats-and-residuals.md` |
| **Source research** | `../research/research.md`, `../research/cross-packet-027-reconciliation/research.md`, `../research/external-memory-systems/research.md` |
| **Wave-0 shipped record** | Wave-0 record (none of these five) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The Memory MCP already ships the machinery for bi-temporal, edge-presence currentness, but it is **build-side only and unwired on the read path**. `SPECKIT_TEMPORAL_EDGES` is **already ON** (not a flag to flip, `ENV_REFERENCE.md:296`, `search-flags.ts:706`), and `lib/graph/temporal-edges.ts` (`valid_at`/`invalid_at` columns, `invalidateEdge()`) plus `lib/graph/contradiction-detection.ts` (queries only live edges, auto-invalidates on `supersedes`/conflicting pairs) exist and compile [CONFIRMED: `temporal-edges.ts:35-80`, `contradiction-detection.ts:75-77, 85-90, 99-110`, research.md:22]. What is missing is the **read-side wiring** that makes "currentness = edge presence" the live retirement path, plus the **store reconciliation** that prevents the causal-edge `invalid_at` projection and the canonical lineage writer from forking into a third source of truth [CONFIRMED: `vector-index-schema.ts:184-185`, roadmap §BROADENING-2 "C3-A KILLED as a flip → reclassified read-side build"].

Beyond making currentness live, the subsystem has **no temporal recall UX**: the as-of lineage resolver (`resolveLineageAsOf` / `inspectLineageChain`) is **lib-only with zero non-test callers** [CONFIRMED: `lineage-state.ts:1025-1043`, 005-revisit Q9], there is **no query-time temporal parsing** (recency is only a decay/boost weight, records carry timestamps but are never searched by an extracted time range) [CONFIRMED: 007 iter-013 "CG-temporal-query-extraction → GO", iter-008:16], and the revision model documents only a **2-channel** soft-forget/temporal-close base where a safe `unforget(id)` bare-key removal needs **4 disjoint `(expired_at, status, edge)` fingerprints** [CONFIRMED: `temporal-edges.ts`, 001 iter-012:13, iter-016].

### Purpose

Land the edge-presence currentness path and its temporal-recall surface as a **sequenced, schema-aware build**, not a flag flip, with the four-timestamp window (C3-B, a prerequisite owned by a sibling phase) as the substrate, the read-side `getValidEdges` filter and lineage/causal-edge store reconciliation as C3-A's core and TemporalMode + memory_history + query-range extraction as the capability layer. Extend the revision-channel matrix to the 4-channel disjointness invariant so unforget is provably a safe bare-key operation.

### Critical context (from the 028 broadening + 027-revisit addenda, authoritative)

- **C3-A is NOT a flag flip.** `SPECKIT_TEMPORAL_EDGES` is already ON, edge-presence currentness still needs a read-side build + store reconciliation [roadmap §BROADENING-2, 001 iter-037].
- **No candidate has a measured before/after benefit number**, all leverage/effort are structural inference, never benchmarked [roadmap §BROADENING-6, synthesis/03 §B].
- **Bi-temporal scoping:** consumers are causal + lineage (+ code_edges in the sibling Code Graph phase), **exclude retention TTL** (physical deletion is the category-opposite of edge-presence currentness). The canonical supersede writer is **lineage**, causal `invalid_at` is a derived projection, the real "current memory" read store is **`active_memory_projection`** [CONFIRMED: 005-revisit edit #4, synthesis/01 Wave-2].
- **C3-C cost is conditional:** if "Current" reads stay on `active_memory_projection` it is M, if "Current" replaces the projection with causal edge-presence reads it crosses to **L** (~12 JOIN sites / 2 writers) [005-revisit edit #4, synthesis/03 §C].
- **memory_history** is a ~5-surface parity add, full **AsKnownAt** (transaction-time recall) is gated on C3-B [005-revisit Q9 GO additions].
- **M-unforget-channel-disjointness is NEEDS-BENCHMARK (defer)**, it is a cross-channel invariant that depends on **both** an unforget channel AND erasure, only one half of which is present today [CONFIRMED: 001 iter-016:13].
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope, five candidates (all PENDING, status detailed in §14)

| # | Candidate | One-line change | Seam (file:line) | Lev | Eff | Class |
|---|-----------|-----------------|------------------|-----|-----|-------|
| 1 | **C3-A** edge-presence currentness | Make "currentness = edge presence" the live retirement path: read-side `getValidEdges` filter (`AND invalid_at IS NULL`) + lineage↔causal-edge store reconciliation (no third source of truth) | `contradiction-detection.ts:75-77, 99-110`, `vector-index-schema.ts:184-185` | H | M (med-high, live-store fork) | BUILD (read-side, flag already ON) |
| 2 | **C3-C** TemporalMode | `TemporalMode` enum (Current / AsOf / AsKnownAt / History) on recall + a maintained `current-support` provider | `contradiction-detection.ts` (new enum/provider), `active_memory_projection` reads | M | M (L if it replaces the projection) | BUILD-new |
| 3 | **memory_history** as-of tool | Wire the lib-only `resolveLineageAsOf` / `inspectLineageChain` to a new MCP tool (~5-surface parity add), exposes a never-surfaced valid-time as-of capability | `lineage-state.ts:1025-1043` (zero non-test callers) | M | M | BUILD-new (tool surface) |
| 4 | **CG-temporal-query-extraction** | Parse a structured time interval (`QueryInterval`) from the NL query, filter graph events by the extracted range, then vector-rank the filtered set, fall back to normal search when no bounds found | new query-time parser, read-path search wiring | H | M | BUILD-new (Memory-home, NO-TRANSFER cross-cut) |
| 5 | **M-unforget-channel-disjointness** | Extend the C3-D 2-channel revision matrix to 4 channels that leave disjoint `(expired_at, status, edge)` fingerprints, so `unforget(id)` is a safe bare-key removal + a status-ownership write-refusal guard | `temporal-edges.ts`, `contradiction-detection.ts` | M | M | BUILD-new (extends C3-D 2→4) |

### Sequencing dependency (in scope to reference, owned elsewhere)

- **C3-B four-timestamp window** (event-time `valid_from`/`valid_to` + txn-time `ingested_at`/`expired_at` replacing the single `valid_at`/`invalid_at` pair) is the **schema prerequisite** for C3-C AsKnownAt and the 4-channel disjointness matrix. It is a sibling Wave-2 candidate (`temporal-edges.ts:35-54`), this phase consumes it, it is not re-authored here. Its additivity is **UNVERIFIED at source** (no migration spec exists to read) [synthesis/03 §C].

### Out of Scope (documented, NOT built this phase)

- **C3-B itself** (the four-timestamp schema migration), owned by a sibling phase, consumed here.
- **C4-B `derived_id`** content-addressed identity, a separate Wave-2 candidate (`causal-edges.ts:348-358`).
- **Retention TTL / physical deletion**, explicitly excluded from the bi-temporal currentness model (category error) [005-revisit edit #4].
- **Code Graph Q1-C1 code-edge bi-temporal**, DEFER-speculative, owned by `002-code-graph` [synthesis/01 Wave-2].
- **Full erasure cascade / `unforget` channel construction** beyond the disjointness invariant, `M-erasure-cascade-refuse-whole` is its own GDPR packet [001 iter-016:12].
- Modifying any external reference system under `external/`.

### Files to Change

Per-candidate seams above. Production code under `.opencode/skills/system-spec-kit/mcp_server/` (`lib/graph/`, `lib/search/`, `lib/storage/`, `handlers/`, `tools/`). Tests alongside each change. No edits to the Wave-0 implementation record (Wave-0 shipped record, read-only evidence).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1 (C3-A):** Recall's currentness decision MUST derive from edge presence (`invalid_at IS NULL`) on the read path, not from a flag or physical deletion, the lineage canonical writer and the causal-edge `invalid_at` projection MUST reconcile to one source of truth (no third fork).
- **R2 (C3-C):** Recall MUST accept a `TemporalMode` (Current / AsOf / AsKnownAt / History), Current MUST preserve today's `active_memory_projection` behavior byte-for-byte unless explicitly migrated, AsKnownAt MUST be gated on the C3-B four-timestamp window.
- **R3 (memory_history):** A new tool MUST expose `resolveLineageAsOf` / `inspectLineageChain` with full I/O parity to the lib functions, it MUST NOT change any existing recall path.
- **R4 (temporal-query-extraction):** Query parsing MUST extract a structured time interval when present, filter events by that range before vector ranking and fall back to the existing search unchanged when no bounds are found (no regression for non-temporal queries).
- **R5 (unforget-disjointness):** The four revision channels MUST leave disjoint `(expired_at, status, edge)` fingerprints such that `unforget(id)` is a safe bare-key removal, a status-ownership write MUST be refused when it would violate channel disjointness.
- **R6 (cross-cutting):** No retention-TTL coupling, no physical deletion introduced, every change independently reversible.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Edge-presence currentness is the live read-path retirement mechanism, a superseded fact is closed (History-readable) rather than destroyed.
- TemporalMode Current is verified byte-identical to current recall, AsOf / History return correct closed-window results, AsKnownAt is present once C3-B lands.
- `memory_history` returns the same lineage chains as the lib functions for the same inputs, with no change to default recall.
- A temporal NL query (e.g. "decisions before commit X") filters by the extracted range, a non-temporal query is byte-identical to baseline.
- `unforget(id)` is provably a safe bare-key removal under the 4-channel disjointness invariant (property test), a disjointness-violating status write is refused.
- Typecheck, build, focused tests and `validate.sh --strict` on this phase all pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk or Dependency | Impact | Handling |
|--------------------|--------|----------|
| C3-B four-timestamp window not yet landed | C3-C AsKnownAt + 4-channel matrix blocked | Sequence C3-B first (sibling phase), gate AsKnownAt + R5 on it, ship C3-A + Current + AsOf/History + memory_history + query-extraction without it |
| Live-store fork (lineage vs causal-edge `invalid_at` vs `active_memory_projection`) | C3-A reconciliation could create a third source of truth | Designate lineage canonical, causal `invalid_at` derived, reconcile at `vector-index-schema.ts:184-185`, reconciliation test |
| C3-C "Current" replacing the projection | Cost crosses M→L (~12 JOIN sites / 2 writers) | Default to reading alongside `active_memory_projection`, treat projection-replacement as a separate decision (open question) |
| No measured benefit number for any candidate | Cannot promise a delta | Ship for correctness/reversibility, a single benefit micro-benchmark is a separate follow-up |
| Unforget-disjointness depends on both an unforget channel AND erasure (only one half present) | R5 may be unbuildable as-scoped | Treat as NEEDS-BENCHMARK/defer, build the invariant + property test against the channels that exist, flag the missing half |
| Temporal-query-extraction false-positive range parse | Non-temporal queries could regress | Strict bounds-detection, fall back to existing search when no bounds, baseline byte-check on non-temporal queries |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- No retention-TTL coupling and no physical deletion introduced by any candidate.
- Current-mode recall stays byte-identical to today unless an explicit projection migration is approved.
- Non-temporal queries are byte-identical to baseline (temporal-query-extraction is additive).
- Every candidate hunk is independently reversible.
- Store reconciliation keeps exactly one canonical supersede writer (lineage).

## 8. EDGE CASES

- A fact with no closing edge reads as Current under every TemporalMode.
- AsKnownAt requested before C3-B lands returns a typed "capability gated on four-timestamp window" error, not a silent wrong answer.
- A query with no parseable time bounds falls through to normal search unchanged.
- An `unforget(id)` on a key whose channels are not disjoint is refused, not partially applied.
- The causal-edge `invalid_at` projection and the lineage canonical disagree → reconciliation favors lineage and logs the divergence.
- `memory_history` for an id with no lineage chain returns an empty chain, not an error.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Assessment |
|-----------|------------|
| Code surface | Medium, read-path search wiring, a new tool surface, a query parser and a temporal-mode provider |
| Data migration | None directly here, consumes C3-B's migration (sibling phase) |
| Runtime risk | Medium, C3-A changes the live retirement path, C3-C touches recall mode selection |
| Reversibility | High per-candidate, C3-A's store reconciliation is the riskiest to unwind |

## 10. RISK MATRIX

| Candidate | Severity if wrong | Likelihood | Mitigation |
|-----------|-------------------|------------|------------|
| C3-A | High | Medium | Reconciliation test, lineage-canonical invariant, read-side filter byte-check |
| C3-C | Medium | Medium | Current byte-identical, AsKnownAt gated on C3-B, mode-specific tests |
| memory_history | Low | Low | Parity test against the lib functions, no default-recall change |
| temporal-query-extraction | Medium | Medium | Strict bounds detection + fallthrough, non-temporal baseline byte-check |
| unforget-disjointness | Medium | Medium | Property test over the 4 channels, refuse-on-violation, defer if the unforget/erasure half is absent |

## 11. USER STORIES

- As a recall caller, a superseded fact is hidden by default (Current) but still recoverable via History rather than destroyed.
- As an investigator, I can ask "what was current as of commit X" (AsOf) and "what did we believe at time T" (AsKnownAt, once C3-B lands).
- As an operator, I can call `memory_history` to inspect a memory's lineage chain without reading the lib internals.
- As a user, a temporal NL query filters by the time range I named instead of treating recency as a soft boost.
- As a governance maintainer, `unforget(id)` is a provably safe bare-key removal under the disjointness invariant.

## 12. OPEN QUESTIONS

1. Does C3-C "Current" read alongside `active_memory_projection` (M) or replace it with causal edge-presence reads (L, ~12 JOIN sites / 2 writers)? Default to alongside, replacement is a separate decision.
2. Is the C3-B four-timestamp window genuinely additive with no reader rewrites? Unverified at source, no migration spec exists to read.
3. Is the unforget channel + erasure half present enough to build R5 fully, or does it stay a partial invariant + property test until the erasure packet lands?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:approach -->
## 13. EXECUTION APPROACH

- **Sequence on the substrate.** C3-B (sibling) first → C3-A read-side `getValidEdges` + store reconciliation → C3-C TemporalMode (Current/AsOf/History without C3-B, AsKnownAt after) → memory_history tool (independent, can land in parallel) → temporal-query-extraction (additive, fallthrough-safe) → unforget-disjointness invariant + property test (deferred/benchmark-gated).
- **One candidate at a time**, each a self-contained reversible change with its own focused test and scoped commit.
- **Per-candidate gate:** read the seam → implement → unit/property test → `tsc`/build + existing suite green → `validate.sh --strict` on this phase → adversarial review (independent seat trying to refute) → fix findings → scoped commit.
- **Executor:** `cli-codex` `gpt-5.5` `xhigh` `fast` for substantial code, native `opus` fallback, mechanical edits direct.
- **Reversibility:** branch-only, nothing pushed or deployed without explicit user go.
- **Honesty:** ship for correctness/reversibility, not a promised delta, flag any leverage claim as structural inference.
<!-- /ANCHOR:approach -->

---

<!-- ANCHOR:status -->
## 14. CANDIDATE STATUS

> Cross-checked against the Wave-0 shipped record and the Wave-0 commit range (`git log --oneline 1ecc531431..ab5459fb6d`): **none of these five candidates shipped in Wave-0** (zero temporal/history/unforget/currentness commits in range). Current working-tree status: C3-A is **DONE**, the other four candidates remain **PENDING**.

| # | Candidate | Status | Gate | 030 evidence | Notes |
|---|-----------|--------|------|--------------|-------|
| 1 | **C3-A** edge-presence currentness | DONE (shipped then kept off) | none for the implemented gated slice | Not in 030 §14, current working tree only (no commit per user request) | Implemented in `temporal-edges.ts`, `vector-index-schema.ts` and `search-flags.ts`, verified by `tests/edge-presence-currentness.vitest.ts` (3/3), `tests/flag-ceiling.vitest.ts` (6/6) and `npm run typecheck` (0). The flag and code were later removed in the kept-off flag-resolution reckoning (reconciliation repaired 0 rows, integrity-only). See `../../007-kept-off-flag-resolution/` |
| 2 | **C3-C** TemporalMode | PENDING | schema-migration (AsKnownAt needs C3-B) + implementation not started | Not in 030 §14 | Pending until the TemporalMode read surface is implemented, Current must remain byte-identical via `active_memory_projection` |
| 3 | **memory_history** as-of tool | PENDING | shared-infra-dep (depends on currentness-correct chains) + tool surface not started | Not in 030 §14 | Lib-only `resolveLineageAsOf`/`inspectLineageChain` still need MCP tool parity |
| 4 | **CG-temporal-query-extraction** | PENDING | needs-benchmark (precision of range-filter vs current recency boost) | Not in 030 §14 | Benchmark-blocked, do not ship range filtering without a precision/fallthrough check |
| 5 | **M-unforget-channel-disjointness** | PENDING | needs-benchmark + shared-infra-dep (needs both an unforget channel AND erasure, only one half present) | Not in 030 §14 | Benchmark/shared-infra blocked, leave deferred until the missing erasure half exists |

**Pending count: 4. Done count: 1.**
<!-- /ANCHOR:status -->

---

## RELATED DOCUMENTS

- **Phase research (PRIMARY):** `../research/research.md` (Memory MCP external mining).
- **Cross-cutting roadmap (authoritative):** `../../research/roadmap.md` (BROADENING + 027-REVISIT + MEMORY-SYSTEMS addenda).
- **Synthesis:** `../../research/synthesis/01-go-candidates.md`, `03-corrections-caveats-and-residuals.md`, `04-sibling-and-cross-cutting.md`.
- **027 reconciliation (memory_history + bi-temporal scoping):** `../research/cross-packet-027-reconciliation/research.md`.
- **Memory-systems mining (temporal-query-extraction):** `../research/external-memory-systems/research.md`.
