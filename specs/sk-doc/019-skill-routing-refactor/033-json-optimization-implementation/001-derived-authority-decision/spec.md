---
title: "Feature Specification: Derived Schema Authority Decision"
description: "Decision-only phase naming the single canonical authority for graph-metadata.json's derived block, reconciling the live 11-root Python-compiler shape against the TS Zod SkillDerivedV2 schema used by the lifecycle subsystem."
trigger_phrases:
  - "derived schema authority decision"
  - "graph-metadata derived canonical schema"
  - "skill derived v2 vs python compiler"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/001-derived-authority-decision"
    last_updated_at: "2026-07-29T10:44:35Z"
    last_updated_by: "claude-code"
    recent_action: "Accepted ADR-001/ADR-002; verified claims vs source"
    next_safe_action: "Phase 003 builds against the accepted merged shape"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "001-derived-authority-decision"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Nested vs top-level intent_signals duplicate deferred to a later cleanup phase (out of scope here)"
    answered_questions:
      - "Canonical derived shape = Python-compiler core + TS lifecycle fields additive (ADR-001, Accepted)"
      - "On-disk derived is uniformly the Python shape across 11/11 roots; 0 carry any TS-only field (re-verified)"
      - "syncDerivedMetadata/backfillDerivedV2 have zero production invocations (extract.ts ref is a comment) — repurpose as the phase-003 regenerator entry point (ADR-002)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Derived Schema Authority Decision

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-29 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor/033-json-optimization-implementation` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 029 research packet's highest-agreement finding (3/3 lineages) is that `graph-metadata.json`'s `derived` block is defined incompatibly in two places at once. The TypeScript Zod schema (`schemas/skill-derived-v2.ts:42-55`) declares `trigger_phrases`, `keywords`, `provenance_fingerprint`, `generated_at`, `source_docs`, `key_files`, `demotion`, `trust_lane`, `sanitizer_version`, `lifecycle_status`, `redirect_from`, `redirect_to` — a lifecycle-aware shape imported by three live modules: `lib/derived/sync.ts` (the only writer of this shape), `lib/lifecycle/schema-migration.ts` (a schema-version backfill helper), and `handlers/skill-graph/validate.ts` (wired into the live MCP handler dispatch via `handlers/skill-graph/index.ts`, emitting `DERIVED-FRESHNESS` warnings). The Python compiler's validator (`scripts/skill_graph_compiler.py`, `validate_derived_metadata()` around lines 300-325) requires a materially different shape: `trigger_phrases`, `key_topics`, `key_files`, `entities`, `source_docs` as non-empty arrays, `causal_summary` as a non-empty string, and `created_at`/`last_updated_at` as ISO timestamps.

Direct inspection of a live root (`sk-git/graph-metadata.json`) confirms the Python shape is what is actually on disk on all 11 `schema_version: 2` roots today — `causal_summary`, `created_at`, `entities`, `intent_signals`, `key_files`, `key_topics`, `last_updated_at`, `source_docs`, `trigger_phrases` — and none of the seven TS-schema-only fields (`keywords`, `provenance_fingerprint`, `demotion`, `trust_lane`, `sanitizer_version`, `lifecycle_status`, `redirect_from`/`redirect_to`) are present on any of them. The scorer's production read path (`lib/scorer/projection.ts:658-685`) reads `derived.key_topics`, `derived.entities`, `derived.key_files`, `derived.source_docs` for `derivedKeywords` — the Python-style vocabulary — and never reads the TS writer's `keywords` field at all, even though it defensively also reaches for `derived.demotion` and `derived.lifecycle_status`. Meanwhile `syncDerivedMetadata` (the only TS-shape writer) and `backfillDerivedV2` (the schema-version-2 backfill helper) are each called exclusively from test files (`tests/lifecycle-derived-metadata.vitest.ts`, `stress-test/skill-advisor/auto-indexing-derived-sync-stress.vitest.ts`, `stress-test/skill-advisor/lifecycle-routing-stress.vitest.ts`) — zero production call sites exist for either. Three follow-on phases (003, 007, 009) need one unambiguous target shape to build a skill-root regenerator, a freshness gate, and CI wiring against; this phase makes that decision before any of them can start.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope — reading and reconciling the two `derived` schema definitions and every production writer/reader/validator of the `derived` block (`system-skill-advisor/mcp-server/schemas/skill-derived-v2.ts`, `mcp-server/lib/derived/sync.ts`, `mcp-server/lib/derived/sanitizer.ts`, `mcp-server/lib/lifecycle/schema-migration.ts`, `mcp-server/handlers/skill-graph/validate.ts`, `mcp-server/lib/scorer/projection.ts`, `mcp-server/scripts/skill_graph_compiler.py`); naming the single canonical `derived` producer/schema; classifying every field (both schemas' union) as machine-derivable vs authored-preserved; deciding the disposition of the production-orphaned `syncDerivedMetadata` writer and `backfillDerivedV2` helper; recording the decision as one or more ADRs in `decision-record.md` with alternatives scored.

Out of scope — building the regenerator itself (phase 003 per the 029 research's proposed sequence), building the `derived` freshness gate, wiring `skill_graph_compiler.py` or `score-routing-corpus.py` into CI (phase 009's territory per 029 research O4), migrating any of the 11 live `graph-metadata.json` files, and changing the H/S class contract or any field outside the `derived` block (e.g. `manual.*`, `intent_signals` at the metadata top level, `command-metadata.json`). No code, schema, or generated JSON is modified by this phase.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Name a single canonical `derived` schema authority | `decision-record.md` ADR-001 names exactly one canonical shape (or an explicitly-merged shape) with a field-by-field mapping table covering every field present in the TS Zod schema, the Python validator, or on any live on-disk root today |
| REQ-002 | Decide the fate of the TS-only lifecycle fields | ADR-001 states, per field (`lifecycle_status`, `redirect_from`, `redirect_to`, `demotion`, `trust_lane`, `provenance_fingerprint`, `sanitizer_version`), whether it is adopted into the canonical shape, deferred, or dropped, with rationale citing that 0/11 live roots currently populate any of them |
| REQ-003 | Classify every field as machine-derivable vs authored-preserved | ADR-002 (or a table in ADR-001) marks each field derivable-by-regenerator vs must-survive-a-regenerator-rerun-untouched, explicitly marking `causal_summary` as authored-preserved (prose, not extractable) per the phase brief |
| REQ-004 | Decide the disposition of `syncDerivedMetadata` and `backfillDerivedV2` | The decision record states whether each is repurposed as the future regenerator's entry point, rewritten, or deprecated, citing their current test-only call sites as evidence |
| REQ-005 | Record the decision as ADR(s) with alternatives weighed | `decision-record.md` contains at least one ADR (anchor `adr-001`) with an Alternatives Considered table (>=2 scored options), a Consequences section, and a Five Checks Evaluation table, mirroring `system-spec-kit/templates/manifest/decision-record.md.tmpl` |
| REQ-006 | Unblock the dependent build phases with an unambiguous target | The decision names the exact field set and shape that phases 003 (regenerator + freshness gate), 007, and 009 (CI wiring) build and validate against, so none of them re-litigate schema authority |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

`decision-record.md` records a recommended canonical `derived` schema with a complete field-disposition table (derivable vs authored-preserved) and an explicit call on `syncDerivedMetadata`/`backfillDerivedV2`; the recommendation is cross-checked against all 11 live `derived` blocks for zero data loss (every field currently on disk maps to a field in the recommended shape); `validate.sh --strict` passes clean on this phase folder; phases 003/007/009 can start their build against the named shape without an additional schema-authority conversation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | A hasty "adopt the TS schema wholesale" call would require migrating all 11 live roots, rewriting the CI-facing Python validator, and rewiring the scorer's read path in one change | Recommendation favors the lowest-blast-radius option: Python shape as the authored core (already on disk, already CI-validated), TS lifecycle fields folded in as additive/optional |
| Risk | A hasty "adopt the Python shape wholesale" call would strand the already-built lifecycle capability (`lifecycle_status`/`redirect_from`/`redirect_to`) that a future skill-deprecation/redirect workflow needs | ADR-001 requires an explicit per-field disposition, not a blanket pick-one-schema-and-drop-the-rest verdict |
| Risk | This decision, once made, blocks three downstream phases from starting | The ADR is written to be immediately actionable (named field list, named shape) rather than open-ended, so downstream phases can start build work without waiting on a second round |
| Dependency | Phase 003 (regenerator + freshness gate build) | Cannot start until this phase names the target schema |
| Dependency | Phase 007 | Depends on the same canonical shape for its own consumption of `derived` |
| Dependency | Phase 009 (CI wiring for `skill_graph_compiler.py` / `score-routing-corpus.py`) | Needs the final field list to know what the CI validator should enforce |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- ADR-001/ADR-002 are Accepted (autonomously, under the 030 implementation goal) after every load-bearing claim was re-verified against the current tree; the real schema/code change stays phase 003's guarded, reversible work. If a later phase surfaces a production consumer of the TS-only lifecycle fields that this verification missed, ADR-001 is revised before 003 acts on it.
- The duplicate `intent_signals` field (present both at `graph-metadata.json` top level and nested inside `derived` on all 11 live roots) is deferred to a later cleanup phase — flagged, not resolved, per this phase's scope lock to the `derived`-authority question only.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Program predecessor**: `../029-skill-json-optimization-research` (`research/research.md` §2-3, theme #1, 3/3 agreement)
- **Contract under study**: `.opencode/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md`
- **Decision Record**: See `decision-record.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **QA**: See `checklist.md`

## Structural phase links

| **Parent Spec** | `../spec.md` |
| **Predecessor** | none (first child) |
| **Successor** | `002-baseline-capture` |
