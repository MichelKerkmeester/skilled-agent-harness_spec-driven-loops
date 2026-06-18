---
title: "Feature Specification: Memory Search Intelligence — Implementation (028 roadmap Wave-0)"
description: "Implement the ship-ready Wave-0 spearhead from packet 028's research roadmap: additive, reversible, no-benchmark improvements across the four retrieval subsystems (Memory MCP, Code Graph, Skill Advisor, Deep Loop). Wave-1/Wave-2 (shared-infra, schema-migration) and the benchmark-gated/NO-GO cluster are explicitly out of scope and documented for a later decision."
trigger_phrases:
  - "028 implementation"
  - "memory search intelligence implementation"
  - "wave-0 spearhead"
  - "retrieval subsystem improvements"
  - "implement 028 roadmap"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/030-memory-search-intelligence-impl"
    last_updated_at: "2026-06-18T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Packet created; scope = 028 Wave-0 spearhead; branch system-speckit/028-memory-search-intelligence"
    next_safe_action: "Implement candidate 1 (Q6-anchor FIX), then proceed down the Wave-0 list"
    blockers: []
    key_files:
      - "spec.md"
      - "../028-memory-search-intelligence/research/roadmap.md"
      - "../028-memory-search-intelligence/research/synthesis/01-go-candidates.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: Memory Search Intelligence — Implementation (028 roadmap Wave-0)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-18 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Source roadmap** | `../028-memory-search-intelligence/research/roadmap.md` + `research/synthesis/01-go-candidates.md` |
| **Parent Packet** | system-spec-kit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 028 ran a 200-iteration deep-research campaign mining two external memory systems (aionforge-memory, galadriel) plus four agent-memory systems, and produced a ranked improvement roadmap for the four internal retrieval subsystems (Memory MCP, Code Graph, Skill Advisor, Deep Loop). 028 is research-only; its spec defers implementation to a separate later packet. This packet is that implementation, scoped to the roadmap's **Wave-0 spearhead** — the candidates the broadening pass confirmed are additive, reversible, S-effort, and require no benchmark to ship safely.

### Purpose
Land the Wave-0 candidates as small, independently reversible, individually tested and reviewed changes, each committed in isolation on the 028 branch. Everything that needs a schema migration, shared infrastructure build, or a measured baseline before it can ship is left documented and out of scope.

### Critical context (from the 028 broadening addendum, authoritative)
- **No candidate has a measured before/after benefit number** — all leverage/effort are structural inference. Ship for correctness/reversibility, not a promised delta.
- The "promote-the-off-state-flag" meta-headline was **tempered to 0-of-4 clean flips**; only C4-A is a literal flip (and even that needs deferred-save wiring care).
- The reliability-weighted-learning cluster (D2/D3/Q2) is **NO-GO** until built + benchmarked (no reliability data exists; every input is r=0.5).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope — Wave-0 spearhead (ship-ready: additive, reversible, no benchmark)

| # | Candidate | Subsystem | One-line | Seam | Eff |
|---|-----------|-----------|----------|------|-----|
| 1 | **Q6-anchor FIX** | Deep Loop | add the 7 `<!-- ANCHOR:* -->` marker pairs the deep-research `reduce-state.cjs` requires to the shipped strategy template (reducer hard-fails on first reduce today) | `deep-loop-workflows/deep-research/assets/deep_research_strategy.md` | S |
| 2 | **C9** graceful embedder-degrade | Memory | recall THROWS on null embedding; detect-unavailable → lexical (`useVector=false`) + report `embedder_available:false` | `stage1-candidate-gen.ts:705-706`; substrate `hybrid-search.ts:931-947` | S |
| 3 | **ANN tie-stable ORDER BY** | Memory | append `, m.id ASC` (COALESCE) to the 4 ranked ANN `ORDER BY distance` so which rows survive the LIMIT into fusion is run-stable | `vector-index-queries.ts:169,199,458,570` | S |
| 4 | **C5-B** content-derived tiebreak | Memory | `content_hash`-asc tiebreak (COALESCE to id for BM25/nullable) for content-derived ordering *stability* | `ranking-contract.ts:46-53`; `rrf-fusion.ts:255` | S |
| 5 | **C-X1 'active' + C6-A** | Memory | expose active-channel bonus denominator as named param + always-on rank-time decay vs caller `nowMs` | `rrf-fusion.ts:296-371`; `stage2-fusion.ts:897-908` | S→M |
| 6 | **C4-A** idempotency-receipts default-on | Memory | flip receipt default-on (surviving value = receipt-default-on + content-addressed ids; the deferred-save replay/conflict leg was REFUTED — do NOT build it) | `idempotency-receipts.ts`; `memory-save.ts:3547,3655` | S→M |
| 7 | **two-primitive content-id module** | Memory | centralize `computeContentHash` (content-body) + `hashJson` (canonical-field) formula; parameterize identity (legacy hashes bare-hex) | `memory-parser.ts:914-916`; `idempotency-receipts.ts:59-102` | S→M |
| 8 | **gauge pending/failed** | Memory | alias onto `getBackgroundEnrichmentStats` (no new state) | `memory-save.ts:2954-2972` | S |
| 9 | **skip-closed-in-sweep** | Memory causal | `AND invalid_at IS NULL` on the promoter cleanup (defensive hardening, not a gate) | `frontmatter-promoter.ts:304-318` | S |
| 10 | **Constitutional self-edit / CAS guard** | Memory | non-self-edit assertion + `expectedHash` precondition on the constitutional edit path | `memory-crud-update.ts:94-97` | S |
| 11 | **M-system-kind-exclusion** | Memory | exclude `system`-kind/substrate-internal rows from default recall (admin path to surface) | `formatters/search-results.ts`; `write-provenance.ts:7` | S |
| 12 | **Deep-Loop trio + graceful-self-stop** | Deep Loop | merge-tiebreak (keys id‖title) / failure-class (computed upstream) / pool gauges; + flush partial summary with `stopped` marker on SIGINT/SIGTERM and treat empty tick as valid convergence | `fanout-merge.cjs`; `fanout-pool.cjs`; `fanout-run.cjs:354,370-373` | S |
| 13 | **Code-Graph Q4-C1** rank-time trust | Code Graph | **RRF-additive** trust blend (NOT multiplicative-neutral — that re-orders ties vs the rowid baseline). ⚠ needs a before/after order check vs baseline | `code-graph-context.ts:350-356` | M |

> Candidate 13 (Q4-C1) is the one Wave-0 item the broadening flagged as needs-benchmark/effort-M; it ships last with an explicit order-stability check against the rowid baseline, or is deferred if the check is inconclusive.

### Out of Scope (documented, NOT built this packet)
- **Wave-1** (depends on Wave-0 shared infra, no migration): C2-C class-gating, `memory_history` as-of tool, gauge `lag`, forget-allowlist, source_kind render escaper (real C8), fan-out transient/fatal retry, advisor embedding-staleness, red-team probe-gate, CG dependency-transitivity edge-staleness.
- **Wave-2** (schema migration / SCHEMA_VERSION bump / gated): C4-B `derived_id`, bi-temporal unify (C3-B), C3-A edge-presence currentness, C3-C TemporalMode, Q1-C1 code-edge bi-temporal (DEFER-speculative), C8 render-escaper, transport idempotency, fingerprint-absence→WARN (needs ~667 backfill), enrichment retry-budget, Q3-C1 seeded PPR, closed-vocab edge_type.
- **NO-GO until benchmarked/built:** reliability-weighted learning (D2/D3/Q2), Advisor C4 (Beta build) / C5 (unsourced 13%, needs baseline + lane-health signal), Code-Graph bi-temporal/PPR.
- Modifying the external reference systems under `external/`.

### Files to Change
Per-candidate; each candidate's seam is in the Wave-0 table above. Production code under `.opencode/skills/system-spec-kit/mcp_server/`, `system-code-graph/`, `deep-loop-workflows/`. Tests alongside each change.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:approach -->
## 4. EXECUTION APPROACH

- **One candidate at a time**, each a self-contained, reversible change with its own unit test and its own scoped commit. Order = the Wave-0 table (safest/highest-confidence first; Q4-C1 last).
- **Executor:** `cli-codex` `gpt-5.5` `xhigh` reasoning `fast` tier (`codex exec --model gpt-5.5 -c model_reasoning_effort="xhigh" -c service_tier="fast" --full-auto`, spec-folder pre-approved in the brief, `</dev/null`) for substantial code changes; native `opus` agents as fallback; trivial mechanical edits done directly.
- **Per-candidate gate:** read the seam → implement → unit test → `tsc`/build + existing suite green → `validate.sh --strict` on this packet → adversarial deep review (independent cli-codex/opus seat trying to refute the change) → fix findings → scoped commit.
- **Deep review loops** after each subsystem group and a final whole-packet adversarial pass until confident.
- **Reversibility:** branch-only; nothing pushed to main or deployed without explicit user go.
<!-- /ANCHOR:approach -->

---

<!-- ANCHOR:status -->
## 5. CANDIDATE STATUS

| # | Candidate | Status | Commit | Notes |
|---|-----------|--------|--------|-------|
| 1 | Q6-anchor FIX | In progress | — | template needs 7 anchor pairs |
| 2-13 | (Wave-0 remainder) | Pending | — | — |
<!-- /ANCHOR:status -->

---

## RELATED DOCUMENTS
- **Source research:** `../028-memory-search-intelligence/research/roadmap.md`, `.../synthesis/01-go-candidates.md`, `.../synthesis/03-corrections-caveats-and-residuals.md`.
- **Per-subsystem detail:** `../028-memory-search-intelligence/00{1..4}/research/research.md`.
