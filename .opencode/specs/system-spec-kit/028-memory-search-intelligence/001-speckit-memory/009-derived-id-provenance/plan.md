---
title: "Implementation Plan: Content-Addressed derived_id for Derived Causal Artifacts (C4-B)"
description: "Plan to add a content-addressed derived_id to derived causal edges: a derived-id helper over the shipped content-id module, an additive TEXT UNIQUE rowid-alias column with an anchor-safe backfill and SCHEMA_VERSION bump, and a derived-edge write-path wiring, sequenced as an independent Wave-2 schema slice."
trigger_phrases:
  - "C4-B implementation plan"
  - "derived_id migration plan"
  - "content-addressed causal edge plan"
  - "rule_version provenance plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/009-derived-id-provenance"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored C4-B implementation plan"
    next_safe_action: "Confirm canonical-field order + source definition before the migration step"
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
    completion_pct: 0
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
C4-B adds a content-addressed `derived_id = sha256(canonical-triple + source + rule_version)` to derived causal edges as an additive `TEXT UNIQUE` rowid-alias primary key. The approach reuses the already-shipped two-primitive content-id module (`lib/content-id.ts`) rather than authoring a third hash, lands the column + unique index through an additive schema migration with one `SCHEMA_VERSION` bump, backfills existing derived rows from their stored canonical fields without violating the legacy anchor-inclusive UNIQUE, and wires the derived-edge write path to compute and persist `derived_id` on insert. The status is PENDING; the gate is **schema-migration**, and the only shared-infra dependency (the content-id module) is already shipped (030 commit `18c8582e33`).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Two-primitive content-id module confirmed present with the `hashCanonicalJson` signature. Evidence: `lib/content-id.ts`.
- [ ] Legacy causal_edges UNIQUE confirmed anchor-inclusive. Evidence: `vector-index-schema.ts:1121`.
- [ ] Canonical-field order, kind-tag, and `source` definition decided. Evidence: `decision-record.md` ADR-002.
- [ ] Default/sentinel `rule_version` for legacy derived rows decided. Evidence: `decision-record.md` ADR-003.

### Definition of Done
- [ ] `derived_id` is content-addressed, anchor-inclusive, and reproducible cross-process. Evidence: unit tests.
- [ ] Migration is additive, bumps `SCHEMA_VERSION` once, and backfills with zero legacy-UNIQUE rejections. Evidence: real-DB-copy migration test.
- [ ] Derived-edge write path persists `derived_id`; manual-edge path unchanged. Evidence: write-path test + byte-identical manual-path assertion.
- [ ] Typecheck, build, focused suite, and strict packet validation pass. Evidence: command output recorded in `implementation-summary.md` at completion.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A single derived-store identity addition at three existing seams: the content-id module (compose the input + reuse the hash), the schema (additive column + index + migration), and the derived-edge write path (compute + persist). No shared-infrastructure rewrite, no bi-temporal window, no currentness model — those are sibling Wave-2 candidates kept out of scope.

### Key Components
- **`lib/content-id.ts`**: a new derived-artifact id helper that composes the anchor-inclusive canonical triple + `source` + `rule_version` + kind-tag into a deterministic value and calls the shipped `hashCanonicalJson`. No new sha256.
- **`lib/search/vector-index-schema.ts`**: an additive `derived_id TEXT UNIQUE` column (rowid alias, NOT `AUTOINCREMENT`), a `CREATE UNIQUE INDEX`, a migration step inside the existing transaction, a `SCHEMA_VERSION` bump, and an anchor-safe backfill / dedup pre-pass.
- **`lib/storage/causal-edges.ts`**: `insertEdge`/`insertEdgesBatch` compute and persist `derived_id` for generated (derived) rows so crash-replay and tombstone-restore reproduce the same id.

### Data Flow
On a derived-edge write, the canonical input (triple + source + rule_version, anchors included) is composed and hashed via the content-id module, and the resulting `derived_id` is persisted as the row's rowid-alias PK. On migration, existing derived rows are backfilled by computing the same `derived_id` from their already-stored canonical fields; the anchor-inclusive input guarantees the backfill does not collide against the legacy UNIQUE. The manual-edge path is unchanged — it keeps the sequential id and the anchor-inclusive UNIQUE and does not compute a `derived_id`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/content-id.ts` | Two-primitive hash module (body + canonical-field) | Add derived-artifact id helper (compose + reuse `hashCanonicalJson`) | New unit test: stability + rule_version distinctness + anchor inclusion |
| `lib/search/vector-index-schema.ts` | Causal_edges schema + migrations | Additive `derived_id TEXT UNIQUE` rowid-alias column + index + migration + `SCHEMA_VERSION` bump + anchor-safe backfill | Real-DB-copy migration test: additive, no legacy-UNIQUE reject |
| `lib/storage/causal-edges.ts` | Derived + manual edge write/upsert | Derived path computes + persists `derived_id`; manual path untouched | Write-path test + manual-path byte-identical assertion |

Consumer inventory is scoped to the derived-edge identity surface: the causal-edge insert/upsert path, the schema migration site, and any reader that selects `causal_edges.*` (must tolerate the additive column).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm `lib/content-id.ts` exports `hashCanonicalJson` and is the only hash module to reuse.
- [ ] Read the legacy UNIQUE and migration transaction shape (`vector-index-schema.ts:1104-1136`, `:838-926`).
- [ ] Decide canonical-field order + kind-tag + `source` definition + legacy `rule_version` sentinel (ADR-002/003).

### Phase 2: Core Implementation
- [ ] Add the derived-artifact id helper to `lib/content-id.ts` (compose anchor-inclusive input + kind-tag; call `hashCanonicalJson`).
- [ ] Add the additive `derived_id TEXT UNIQUE` rowid-alias column + `CREATE UNIQUE INDEX` to the schema.
- [ ] Add the migration step + `SCHEMA_VERSION` bump + anchor-safe backfill / dedup pre-pass.
- [ ] Wire `insertEdge`/`insertEdgesBatch` to compute + persist `derived_id` for derived rows only.

### Phase 3: Verification
- [ ] Unit tests: id stability (cross-process), rule_version distinctness, anchor inclusion, backfill-no-reject, restore-preserves-id.
- [ ] Run Memory MCP typecheck + build.
- [ ] Run the focused causal/derived-id Vitest suite; classify any broad-suite failures against the baseline.
- [ ] Run `validate.sh --strict` on this packet and fix structure issues.
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
| `causal_edges` schema + migration transaction | Internal | Green (additive) | Required for the column, index, and backfill |
| Legacy anchor-inclusive UNIQUE | Internal constraint | Green | Drives the anchor-inclusion requirement on the derived-id input |
| Canonical-field order / source / rule_version sentinel decisions | Design | Open (ADR-002/003) | Wrong choices break cross-process reproducibility |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The migration wedges, the backfill collides against the legacy UNIQUE, or derived-edge writes regress.
- **Procedure**: Revert the C4-B commit(s). The migration is additive (column + index); a forward-only reversal drops the `derived_id` column + unique index. Manual-edge behavior is byte-identical, so reverting does not touch the curated causal path.
- **Data reversal**: No data is destroyed by C4-B — `derived_id` is an additive column; reverting removes it and the index without affecting existing rows' content.
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
| Schema migration + backfill | Medium | Anchor-safe; shared-transaction wedge risk; SCHEMA_VERSION bump |
| Write-path wiring | Low-Medium | Derived rows only; manual path untouched |
| Tests | Medium | Cross-process stability + real-DB migration |
| **Overall** | **M (matches roadmap effort tag)** | Gated on schema-migration; content-id dep already shipped |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Change | Rollback |
|--------|----------|
| Derived-id helper | Remove the helper export; no callers remain after write-path revert. |
| Schema column + index | Forward-only drop of `derived_id` column + unique index; existing row content untouched. |
| SCHEMA_VERSION bump | Revert the version constant with the migration step. |
| Write-path wiring | Revert `insertEdge`/`insertEdgesBatch` derived-id computation; manual path already unchanged. |
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Shipped content-id module (lib/content-id.ts)
  -> derived-artifact id helper (anchor-inclusive input + kind-tag)
  -> additive derived_id TEXT UNIQUE column + index + migration + SCHEMA_VERSION bump
  -> anchor-safe backfill of existing derived rows
  -> derived-edge write-path wiring (insertEdge / insertEdgesBatch)
  -> identity + migration tests
  -> strict packet validation
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

The critical path is the anchor-inclusive backfill, not the hash. The single highest-cited C4-B caveat is that the `derived_id` input MUST include anchors or the legacy anchor-inclusive UNIQUE rejects the backfill and wedges the shared-transaction migration. Get the canonical input (triple + source + rule_version + anchors + kind-tag) and the deterministic field order right first; the column, index, and write-path wiring are mechanical once the recipe is fixed.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Evidence |
|-----------|----------|
| M1 Recipe fixed | ADR-002 records canonical-field order + kind-tag + source; ADR-003 records rule_version sentinel |
| M2 Helper + migration landed | Additive column + index + backfill, SCHEMA_VERSION bump |
| M3 Write-path wired | Derived rows persist `derived_id`; manual path byte-identical |
| M4 Verified | Cross-process stability + real-DB migration tests pass |
| M5 Packet validated | `validate.sh --strict` exit 0 |
<!-- /ANCHOR:milestones -->
