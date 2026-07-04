---
title: "Implementation Plan: Content-Addressed derived_id for Derived Causal Artifacts (C4-B)"
description: "Plan to add a content-addressed derived_id to derived causal edges: a derived-id helper over the shipped content-id module, an additive TEXT identity column with a partial UNIQUE index, an anchor-safe backfill, a SCHEMA_VERSION bump and derived-edge write-path wiring."
trigger_phrases:
  - "C4-B implementation plan"
  - "derived_id migration plan"
  - "content-addressed causal edge plan"
  - "rule_version provenance plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/009-derived-id-provenance"
    last_updated_at: "2026-07-04T17:51:03.790Z"
    last_updated_by: "codex"
    recent_action: "Implemented the C4-B plan as v40 with focused tests"
    next_safe_action: "Keep only benchmark-cost measurement pending until a measured run exists"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-c4b-replan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Content-Addressed derived_id for Derived Causal Artifacts (C4-B)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, CommonJS build |
| **Framework** | Spec Kit Memory MCP (`.opencode/skills/system-spec-kit/mcp_server`) |
| **Storage** | SQLite-backed memory index + `causal_edges` table |
| **Testing** | `npm run typecheck`, `npm run build`, Vitest (focused causal/derived-id suite), `validate.sh --strict` |

### Overview
C4-B adds a content-addressed `derived_id = sha256(canonical-triple + source + rule_version)` to derived causal edges as an additive `TEXT` identity column with a partial `UNIQUE` index. The implementation reuses the already-shipped two-primitive content-id module (`lib/content-id.ts`) rather than authoring a third hash, lands the column + unique index through additive schema migration v40, backfills existing generated rows from their stored canonical fields without violating the legacy anchor-inclusive UNIQUE and wires the generated-edge write path to compute and persist `derived_id` behind `SPECKIT_DERIVED_ID_PROVENANCE`. The candidate is **DONE** for correctness. Benchmark-only cost measurement remains pending with no performance delta claimed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Two-primitive content-id module confirmed present with the `hashCanonicalJson` signature. Evidence: `lib/content-id.ts`.
- [x] Legacy causal_edges UNIQUE confirmed anchor-inclusive. Evidence: `vector-index-schema.ts`.
- [x] Canonical-field order, kind-tag and `source` definition decided. Evidence: `decision-record.md` ADR-002.
- [x] Default/sentinel `rule_version` for legacy derived rows decided. Evidence: `decision-record.md` ADR-003.

### Definition of Done
- [x] `derived_id` is content-addressed, anchor-inclusive and reproducible cross-process. Evidence: `tests/derived-id-provenance.vitest.ts`.
- [x] Migration is additive, bumps `SCHEMA_VERSION` once and backfills with zero legacy-UNIQUE rejections. Evidence: v40 migration tests in `tests/derived-id-provenance.vitest.ts`.
- [x] Derived-edge write path persists `derived_id`, manual-edge path unchanged. Evidence: write-path and manual-null tests.
- [x] Typecheck, build, focused suite and strict packet validation pass. Evidence: command output recorded in `implementation-summary.md`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A single derived-store identity addition at three existing seams: the content-id module (compose the input + reuse the hash), the schema (additive column + index + migration) and the derived-edge write path (compute + persist). No shared-infrastructure rewrite, no bi-temporal window, no currentness model, those are sibling Wave-2 candidates kept out of scope.

### Key Components
- **`lib/content-id.ts`**: a new derived-artifact id helper that composes the anchor-inclusive canonical triple + `source` + `rule_version` + kind-tag into a deterministic value and calls the shipped `hashCanonicalJson`. No new sha256.
- **`lib/search/vector-index-schema.ts`**: an additive `derived_id TEXT` column (NOT `AUTOINCREMENT`), a partial `CREATE UNIQUE INDEX`, a migration step inside the existing transaction, a `SCHEMA_VERSION` bump to 40 and an anchor-safe backfill / duplicate pre-pass.
- **`lib/storage/causal-edges.ts`**: `insertEdge`/`insertEdgesBatch` compute and persist `derived_id` for generated (derived) rows so crash-replay and tombstone-restore reproduce the same id.

### Data Flow
On a generated-edge write with `SPECKIT_DERIVED_ID_PROVENANCE=true`, the canonical input (triple + source + rule_version, anchors included) is composed and hashed via the content-id module, and the resulting `derived_id` is persisted on the row. On migration, existing generated rows are backfilled by computing the same `derived_id` from their already-stored canonical fields. Duplicate computed identities are left `NULL` before the partial unique index is created so the migration remains idempotent. The manual-edge path is unchanged, it keeps the sequential id and the anchor-inclusive UNIQUE and does not compute a `derived_id`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/content-id.ts` | Two-primitive hash module (body + canonical-field) | Add derived-artifact id helper (compose + reuse `hashCanonicalJson`) | New unit test: stability + rule_version distinctness + anchor inclusion |
| `lib/search/vector-index-schema.ts` | Causal_edges schema + migrations | Additive `derived_id TEXT` column + partial unique index + migration + `SCHEMA_VERSION` bump + anchor-safe backfill | Real-DB-copy migration test: additive, no legacy-UNIQUE reject |
| `lib/storage/causal-edges.ts` | Derived + manual edge write/upsert | Derived path computes + persists `derived_id`, manual path untouched | Write-path test + manual-path byte-identical assertion |

Consumer inventory is scoped to the derived-edge identity surface: the causal-edge insert/upsert path, the schema migration site and any reader that selects `causal_edges.*` (must tolerate the additive column).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm `lib/content-id.ts` exports `hashCanonicalJson` and is the only hash module to reuse.
- [x] Read the legacy UNIQUE and migration transaction shape (`vector-index-schema.ts`).
- [x] Decide canonical-field order + kind-tag + `source` definition + legacy `rule_version` sentinel (ADR-002/003).

### Phase 2: Core Implementation
- [x] Add the derived-artifact id helper to `lib/content-id.ts` (compose anchor-inclusive input + kind-tag, call `hashCanonicalJson`).
- [x] Add the additive `derived_id TEXT` column + partial `CREATE UNIQUE INDEX` to the schema.
- [x] Add the migration step + `SCHEMA_VERSION` bump + anchor-safe backfill / dedup pre-pass.
- [x] Wire `insertEdge`/`insertEdgesBatch` to compute + persist `derived_id` for derived rows only.

### Phase 3: Verification
- [x] Unit tests: id stability, rule_version distinctness, anchor inclusion, backfill-no-reject, restore-preserves-id.
- [x] Run Memory MCP typecheck + build.
- [x] Run the focused causal/derived-id Vitest suite, then classify any broad-suite failures against the baseline.
- [x] Run `validate.sh --strict` on this packet and fix structure issues.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Memory MCP TypeScript contracts | `npm run typecheck` |
| Build | Memory MCP package build | `npm run build` |
| Unit (identity) | derived-id stability, rule_version distinctness, anchor inclusion | `npx vitest run` (focused) |
| Migration | additive column + index, anchor-safe backfill, no legacy-UNIQUE reject, restore-preserves-id | `npx vitest run` on a real DB copy |
| Packet docs | Level-3 structure, anchors, frontmatter, required files | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Two-primitive content-id module (`lib/content-id.ts`) | Internal (shipped 030 `18c8582e33`) | Green | Without it C4-B would have to author a forbidden third hash |
| `causal_edges` schema + migration transaction | Internal | Green (additive) | Required for the column, index and backfill |
| Legacy anchor-inclusive UNIQUE | Internal constraint | Green | Drives the anchor-inclusion requirement on the derived-id input |
| Canonical-field order / source / rule_version sentinel decisions | Design | Green (ADR-002/003 accepted) | Wrong choices would break cross-process reproducibility |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The migration wedges, the backfill collides against the legacy UNIQUE or derived-edge writes regress.
- **Procedure**: Revert the C4-B commit(s). The migration is additive (column + index). A forward-only reversal drops the `derived_id` column + unique index. Manual-edge behavior is byte-identical, so reverting does not touch the curated causal path.
- **Data reversal**: No data is destroyed by C4-B. `derived_id` is an additive column, reverting removes it and the index without affecting existing rows' content.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (decisions) | content-id module + legacy UNIQUE read | Helper + migration |
| Helper + migration | Setup decisions | Write-path wiring |
| Write-path wiring | Helper (id recipe) | Verification |
| Verification | All implementation | Strict validation + closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Complexity | Notes |
|-----------|------------|-------|
| Derived-id helper | Low | Compose input + reuse `hashCanonicalJson` |
| Schema migration + backfill | Medium | Anchor-safe, shared-transaction wedge risk, SCHEMA_VERSION bump |
| Write-path wiring | Low-Medium | Derived rows only, manual path untouched |
| Tests | Medium | Cross-process stability + real-DB migration |
| **Overall** | **M (matches roadmap effort tag)** | Gated on schema-migration, content-id dep already shipped |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Change | Rollback |
|--------|----------|
| Derived-id helper | Remove the helper export. No callers remain after write-path revert. |
| Schema column + index | Forward-only drop of `derived_id` column + unique index. Existing row content untouched. |
| SCHEMA_VERSION bump | Revert the version constant with the migration step. |
| Write-path wiring | Revert `insertEdge`/`insertEdgesBatch` derived-id computation. Manual path already unchanged. |
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Shipped content-id module (lib/content-id.ts)
  -> derived-artifact id helper (anchor-inclusive input + kind-tag)
  -> additive derived_id TEXT column + partial UNIQUE index + migration + SCHEMA_VERSION bump
  -> anchor-safe backfill of existing derived rows
  -> derived-edge write-path wiring (insertEdge / insertEdgesBatch)
  -> identity + migration tests
  -> strict packet validation
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

The critical path is the anchor-inclusive backfill, not the hash. The single highest-cited C4-B caveat is that the `derived_id` input MUST include anchors or the legacy anchor-inclusive UNIQUE rejects the backfill and wedges the shared-transaction migration. Get the canonical input (triple + source + rule_version + anchors + kind-tag) and the deterministic field order right first. The column, index and write-path wiring are mechanical once the recipe is fixed.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Evidence |
|-----------|----------|
| M1 Recipe fixed | ADR-002 records canonical-field order + kind-tag + source, ADR-003 records rule_version sentinel |
| M2 Helper + migration landed | Additive column + index + backfill, SCHEMA_VERSION bump |
| M3 Write-path wired | Derived rows persist `derived_id`, manual path byte-identical |
| M4 Verified | Cross-process stability + real-DB migration tests pass |
| M5 Packet validated | `validate.sh --strict` exit 0 |
<!-- /ANCHOR:milestones -->
