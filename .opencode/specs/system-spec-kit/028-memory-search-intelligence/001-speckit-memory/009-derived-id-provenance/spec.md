---
title: "Feature Specification: Content-Addressed derived_id for Derived Causal Artifacts (C4-B)"
description: "Give DERIVED memory artifacts (causal edges first) a content-addressed derived_id = sha256(canonical-triple + source + rule_version), as an additive TEXT identity column with a partial UNIQUE index that survives crash-replay and tombstone-restore. The id MUST include anchors or the legacy anchor-inclusive UNIQUE constraint rejects the backfill. Consumes the shipped two-primitive content-id module."
trigger_phrases:
  - "C4-B"
  - "derived_id"
  - "content-addressed identity"
  - "derived causal artifact"
  - "rule_version provenance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/009-derived-id-provenance"
    last_updated_at: "2026-06-19T15:44:13Z"
    last_updated_by: "codex"
    recent_action: "Implemented C4-B derived-id provenance with default-off flag and v40 migration"
    next_safe_action: "Keep benchmark-only performance promotion pending until a measured run exists"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - ".opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/research/research.md"
      - ".opencode/specs/system-spec-kit/028-memory-search-intelligence/research/synthesis/01-go-candidates.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-c4b-replan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Canonical field order is kind, source_id, target_id, relation, source_anchor, target_anchor, source, rule_version."
      - "Source value is explicit derivedSource when supplied, otherwise non-manual extraction_method, otherwise created_by."
      - "Legacy backfill rule_version sentinel is legacy-pre-derived-id."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: Content-Addressed derived_id for Derived Causal Artifacts (C4-B)

## EXECUTIVE SUMMARY

Derived memory artifacts — starting with generated causal edges — currently have no content-addressed identity. Their identity is the sequential `causal_edges.id` autoincrement, with logical uniqueness enforced by the anchor-inclusive `UNIQUE(source_id, target_id, relation, source_anchor, target_anchor)` constraint. A crash-replay or tombstone-restore of the same derived artifact therefore cannot prove it is the same artifact, and a rule-version change is invisible to identity. C4-B adds an additive, content-addressed `derived_id = sha256(canonical-triple + source + rule_version)` as a `TEXT` identity column with a partial `UNIQUE` index for derived rows, reusing the shipped two-primitive content-id module so a crash-replay reconstructs the identical id.

**Key Decisions**: additive `TEXT` identity column + partial `UNIQUE` index (NOT `AUTOINCREMENT`); the `derived_id` input MUST include anchors so the legacy anchor-inclusive UNIQUE backfill does not reject; reuse `lib/content-id.ts`, do not author a third hash.

**Critical Dependencies**: the shipped two-primitive content-id module (`lib/content-id.ts`, 030 commit `18c8582e33`); a `causal_edges` schema migration with a `SCHEMA_VERSION` bump.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Done |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Candidate** | C4-B (content-addressed `derived_id`) |
| **Wave** | Wave-2 (schema-migration / SCHEMA_VERSION bump / gated) |
| **Source research** | `../research/research.md` + `../../research/synthesis/01-go-candidates.md` §Wave-2 + `../../research/synthesis/04-sibling-and-cross-cutting.md` §C4-B + `../../research/roadmap.md` §1 + §027-REVISIT edit #1/#4b |
| **Parent phase** | `system-spec-kit/028-memory-search-intelligence/001-speckit-memory` (Memory MCP, PRIMARY) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Generated (DERIVED) causal edges have no content-addressed identity. Identity is the sequential `causal_edges.id` autoincrement; logical uniqueness is the anchor-inclusive `UNIQUE(source_id, target_id, relation, source_anchor, target_anchor)` constraint [CONFIRMED: `lib/search/vector-index-schema.ts:1121`]. Because identity is not derived from content, a crash-replay or tombstone-restore of the same derived artifact cannot prove byte-for-byte that it is the same artifact, and a change in the derivation `rule_version` is invisible to identity — the same triple under a new rule re-uses the old row. aionforge's consolidation uses a content-addressed `fact_id` (canonical triple + episode + rule version) so a crash-replay reconstructs identical artifacts; the internal Memory MCP has no equivalent for its derived causal layer.

### Purpose
Give derived causal edges a content-addressed `derived_id = sha256(canonical-triple + source + rule_version)` — an additive `TEXT` identity column with a partial `UNIQUE` index — so the same derived artifact reconstructs the identical id under crash-replay and tombstone-restore, and a `rule_version` change produces a new, distinct id rather than silently re-using the old row.

### Critical context (from the 028 research, authoritative)
- **C4-B is the only genuinely net-new content-addressed id** in the Memory candidate set. The other content-hash uses are already shipped: `computeContentHash`/`hashContentBody` (content-body) and `hashJson`/`hashCanonicalJson` (canonical-field) [CONFIRMED: roadmap §027-REVISIT edit #1; `lib/content-id.ts`].
- The roadmap's original `memory-index.ts:281` seam citation for "the sha256 base" was a **mis-citation** — `:281` is `createScanKey` (a 16-char scan-options hash), NOT a content base [CONFIRMED: roadmap §027-REVISIT edit #1; research.md `Internal Baseline` line on `createScanKey`]. The real bases are the two `lib/content-id.ts` primitives.
- The `derived_id` **MUST include anchors** or the legacy anchor-inclusive UNIQUE backfill rejects [CONFIRMED: synthesis `01-go-candidates.md:44`, `04-sibling-and-cross-cutting.md:24`, roadmap §027-REVISIT edit #4b; legacy UNIQUE at `vector-index-schema.ts:1121`].
- The add is **confirmed clean-additive**: restore preserves id; implemented as a SQLite-compatible additive `TEXT` identity column with partial `UNIQUE` index, NOT `AUTOINCREMENT`.
- **No measured before/after benefit number exists** — all leverage/effort are structural inference. Ship for correctness (crash-replay idempotency + rule-version provenance), not a promised delta [CONFIRMED: roadmap §6 GO-evidence caveats].
- Provenance/write-safety EXTENDS packet 027: content-addressed `derived_id` strengthens a base 027 only partially covers (receipts flag-OFF + CRUD-only, none in the causal path) — zero supersedes, zero contradicts [CONFIRMED: `02-cross-packet-reconciliation.md:18`].
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new content-id helper that composes the derived-artifact identity input — the canonical triple plus `source` plus `rule_version`, **anchor-inclusive** — and hashes it via the shipped `lib/content-id.ts` `hashCanonicalJson` primitive (with an explicit canonical-field order + kind-tag). NO third hash.
- An additive `derived_id TEXT` column on `causal_edges` for derived/generated rows with a partial `CREATE UNIQUE INDEX` (NOT `AUTOINCREMENT`).
- A schema migration (with `SCHEMA_VERSION` bump) that adds the column and index additively, and backfills `derived_id` for existing derived rows from their already-stored canonical fields **without** violating the legacy anchor-inclusive UNIQUE.
- The derived-edge write path (`insertEdge`/`insertEdgesBatch` for generated edges) computing and persisting `derived_id` on insert, so crash-replay and tombstone-restore reconstruct the identical id.
- Unit tests proving: identical canonical-triple+source+rule_version → identical `derived_id`; a `rule_version` change → a distinct `derived_id`; anchors are part of the input; backfill does not reject against the legacy UNIQUE; restore preserves the id.

### Out of Scope
- Manual/curated causal edges — C4-B is for DERIVED artifacts; the canonical triple + `rule_version` only have meaning for rule-generated rows. (Manual edges keep the sequential id + the anchor-inclusive UNIQUE.)
- Extending `derived_id` to other derived artifacts beyond causal edges (e.g. derived summaries, consolidation outputs) — "causal edges first"; later derived stores are a follow-on.
- Bi-temporal validity-window unification (C3-B) and edge-presence currentness (C3-A/C3-C) — separate Wave-2 candidates with their own schema reconciliation.
- C4-A idempotency-receipts default-on — a separate Memory candidate (deferred in 030 as a regressing flip); C4-B does not depend on C4-A's flag.
- Any benchmark or measured-delta claim — none exists; this packet ships for correctness only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/content-id.ts` | Modify | Add a derived-artifact id helper that composes the anchor-inclusive canonical input + kind-tag and calls `hashCanonicalJson`; no new hash primitive |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Modify | Additive `derived_id TEXT` column + partial `CREATE UNIQUE INDEX`; migration step + `SCHEMA_VERSION` bump to 40; anchor-safe backfill pre-pass |
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts` | Modify | Derived-edge write path computes and persists `derived_id` on `insertEdge`/`insertEdgesBatch` for generated rows |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Modify | Add default-off `SPECKIT_DERIVED_ID_PROVENANCE` write-path flag |
| `.opencode/skills/system-spec-kit/mcp_server/lib/causal/sweep.ts` | Modify | Preserve `derived_id` in causal-edge tombstone restore metadata when present |
| `.opencode/skills/system-spec-kit/mcp_server/tests/derived-id-provenance.vitest.ts` | Create | Unit tests: id stability, rule_version distinctness, anchor-inclusion, backfill-no-reject, replay-preserves-id, tombstone metadata |
| `.opencode/skills/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts` | Modify | Register `SPECKIT_DERIVED_ID_PROVENANCE` in the known default-off flag list |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `derived_id` is content-addressed over the canonical triple + source + rule_version | Two derived edges with identical canonical-triple, source, and rule_version produce an identical `derived_id`; a unit test asserts byte equality |
| REQ-002 | The `derived_id` input includes anchors | Changing `source_anchor` or `target_anchor` changes the `derived_id`; the backfill against existing derived rows does NOT violate the legacy anchor-inclusive `UNIQUE(source_id,target_id,relation,source_anchor,target_anchor)` |
| REQ-003 | `derived_id` is an additive `TEXT` identity column with a partial `UNIQUE` index, not `AUTOINCREMENT` | Schema migration adds the column + `CREATE UNIQUE INDEX` additively; existing rows and the manual-edge path are unaffected; `SCHEMA_VERSION` bumped exactly once for the cluster |
| REQ-004 | Reuse the shipped two-primitive content-id module | The derived-id helper calls `hashCanonicalJson` from `lib/content-id.ts`; no new sha256 primitive is introduced |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | A `rule_version` change yields a distinct identity | Same triple + source, different `rule_version` → different `derived_id`; unit test asserts inequality |
| REQ-006 | Crash-replay / tombstone-restore reconstructs the identical id | Restoring a tombstoned derived edge from its stored canonical fields reproduces the same `derived_id` (no new sequential id needed for identity) |
| REQ-007 | Canonical-field order + kind-tag are explicit and documented | The helper fixes a deterministic field order and a derived-artifact kind-tag (aionforge identifier recipe); documented in `decision-record.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Identical canonical-triple + source + rule_version (anchors included) deterministically produces the identical `derived_id` across processes (crash-replay safe).
- **SC-002**: The additive migration applies cleanly on a real DB: column + unique index added, existing derived rows backfilled, zero legacy-UNIQUE rejections, manual edges untouched.
- **SC-003**: A `rule_version` change produces a new distinct `derived_id` rather than silently re-using the prior row.
- **SC-004**: Memory MCP typecheck, build, the focused causal/derived-id test suite, and strict packet validation pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Shipped two-primitive content-id module (`lib/content-id.ts`, 030 `18c8582e33`) | Without it, C4-B would author a third hash (forbidden) | Confirm module present and `hashCanonicalJson` signature before build |
| Dependency | `causal_edges` schema migration + `SCHEMA_VERSION` bump | A wedged migration rolls back the whole upgrade batch (shared transaction) | Anchor-safe backfill pre-pass; additive-only column + index; test on a real DB copy |
| Risk | `derived_id` input omits anchors | Backfill rejects against the legacy anchor-inclusive UNIQUE; migration wedges | REQ-002 makes anchor-inclusion a P0 with a backfill-no-reject test (the single most-cited C4-B caveat) |
| Risk | Wrong/ambiguous canonical-field order or `source` definition | Non-reproducible ids across processes; crash-replay produces a different id | Fix a deterministic field order + kind-tag + `source` definition in `decision-record.md`; assert cross-process stability |
| Risk | Migration is not atomic with the broader bi-temporal/generation cluster | Re-pays migration cost (roadmap §Sequencing) | Land the column additively and independently; bi-temporal unify (C3-B) is explicitly out of scope here |
| Risk | No measured benefit number | Cannot claim a performance delta | Ship for correctness (idempotency + provenance) only; record the no-benchmark caveat |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The derived-id hash is computed once per derived-edge insert; no measurable hot-path regression on the manual-edge path (which does not compute `derived_id`).

### Security
- **NFR-S01**: No secrets or client tokens enter the hash input; the canonical input is derived-artifact content only (consistent with the content-id module's identity rules).

### Reliability
- **NFR-R01**: The migration is additive and reversible (drop column + index); manual-edge behavior is byte-identical to today.

## 8. EDGE CASES

### Data Boundaries
- Null/empty anchors: the canonical input normalizes the same way the legacy UNIQUE COALESCEs `source_anchor`/`target_anchor` to `''`, so an absent anchor is part of the deterministic input rather than a divergence.
- A pre-existing duplicate derived row (same canonical input) on an older DB: the migration must not throw building the UNIQUE index; reuse the deprecate-before-create pre-pass pattern (`deprecateDuplicateActiveLogicalKeysBeforeUniqueIndex`) shape if duplicates exist.

### Error Scenarios
- Migration build of the unique index throws: the whole shared-transaction upgrade rolls back; the anchor-safe pre-pass must retire/dedup losers (deprecate, never delete) before the index is created.
- `rule_version` absent on legacy derived rows during backfill: define a default/sentinel `rule_version` for pre-C4-B rows so their `derived_id` is still deterministic.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | 3 production files + 1 test file; one derived store (causal edges) |
| Risk | 18/25 | Schema migration + SCHEMA_VERSION bump; shared-transaction wedge risk; anchor-inclusion correctness |
| Research | 8/20 | Research is complete (200-iter campaign); residual = canonical-field order + source definition |
| Multi-Agent | 4/15 | Single-stream implementation |
| Coordination | 8/15 | Depends on shipped content-id module; coordinate with the broader Wave-2 schema cluster (kept independent) |
| **Total** | **50/100** | **Level 3** |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | `derived_id` omits anchors → backfill rejects against legacy UNIQUE | H | M | Anchor-inclusion is P0 (REQ-002) with a backfill-no-reject test |
| R-002 | Non-deterministic canonical-field order → ids not reproducible | H | M | Fix order + kind-tag in decision-record; cross-process stability test |
| R-003 | Migration wedges the shared upgrade transaction | H | L | Additive column/index; anchor-safe dedup pre-pass; real-DB-copy test |
| R-004 | Identity confused between manual and derived edges | M | L | Scope `derived_id` to derived rows only; manual path unchanged |

## 11. USER STORIES

### US-001: Crash-replay reconstructs identical derived identity (Priority: P0)

**As a** consolidation/derivation pipeline, **I want** a content-addressed `derived_id`, **so that** a crash-replay of the same derived causal edge reconstructs the identical artifact id instead of a fresh sequential one.

**Acceptance Criteria**:
1. Given an identical canonical-triple + source + rule_version (anchors included), When the derived-id helper runs in a second process, Then it produces the identical `derived_id`.

### US-002: Rule-version change is visible to identity (Priority: P1)

**As a** maintainer evolving the derivation rules, **I want** a `rule_version` change to produce a new `derived_id`, **so that** artifacts from a new rule version are distinct rather than silently overwriting the old row.

**Acceptance Criteria**:
1. Given the same triple + source under a new `rule_version`, When the edge is written, Then its `derived_id` differs from the prior version's id.

### US-003: Additive migration leaves manual edges untouched (Priority: P0)

**As a** memory-DB owner, **I want** the `derived_id` migration to be additive, **so that** existing rows, the manual-edge path, and the legacy UNIQUE keep working.

**Acceptance Criteria**:
1. Given an existing causal_edges table, When the migration runs, Then the `derived_id` column + unique index are added, derived rows are backfilled with zero legacy-UNIQUE rejections, and manual edges are unchanged.

## 12. OPEN QUESTIONS

- **Answered**: canonical field order is `kind`, `source_id`, `target_id`, `relation`, `source_anchor`, `target_anchor`, `source`, `rule_version`; `kind = causal-edge`.
- **Answered**: `source` is explicit `derivedSource` when supplied, otherwise a non-manual `extraction_method`, otherwise `created_by`.
- **Answered**: pre-C4-B derived rows use `legacy-pre-derived-id` as the deterministic `rule_version` sentinel.
- **Pending benchmark-only**: derived-edge insert cost remains unmeasured; no performance delta is claimed.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Source research**: `../research/research.md`, `../../research/synthesis/01-go-candidates.md`, `../../research/synthesis/04-sibling-and-cross-cutting.md`, `../../research/roadmap.md`
- **Shipped-record cross-reference (Wave-0, NOT this packet)**: `../../../030-memory-search-intelligence-impl/spec.md` §3 Out-of-Scope (C4-B listed as Wave-2), §14 Candidate Status

---

<!--
LEVEL 3 SPEC
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories, Full Complexity Assessment
-->
