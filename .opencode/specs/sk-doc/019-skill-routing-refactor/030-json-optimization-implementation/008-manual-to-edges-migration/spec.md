---
title: "Feature Specification: Migrate manual.* into Typed Edges (Gated)"
description: "Migrate graph-metadata.manual.* (depends_on/related_to) into typed edges.* across the ~10 fleet roots that carry it, reconcile the live cli-external-orchestration drift, and add an unknown-key lint so manual.* cannot silently return. Routing-changing; gated behind the 006 routing-accuracy CI gate."
trigger_phrases:
  - "manual to edges migration"
  - "graph-metadata manual field migration"
  - "skill graph unknown-key lint"
  - "manual depends_on drift"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/008-manual-to-edges-migration"
    last_updated_at: "2026-07-29T12:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "006 routing-accuracy CI gate not yet landed (this phase's mandatory prerequisite)"
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "008-manual-to-edges-migration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Migrate manual.* into Typed Edges (Gated)

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-29 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor/030-json-optimization-implementation` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 029 research program's cross-lineage synthesis (3/3 lineage agreement) found `graph-metadata.manual.*` is a dead, orphaned field: `parseSkillMetadata` (`system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:757-829`) parses `schema_version`, `skill_id`, `family`, `category`, `domains`, `intent_signals`, `derived`, and `edges` — it never reads `manual` at all. Ten fleet roots still carry a top-level `manual: { depends_on, related_to }` block that once fed relationships into the graph but no longer does. Worse, the field has live drift: `cli-external-orchestration/graph-metadata.json` carries `manual.depends_on: ["system-spec-kit"]` while its real `edges.depends_on` is `[]` — the dependency the authors intended is invisible to the scorer's `graph_causal` lane (`lib/scorer/lane-registry.ts:11`, default weight 0.13, shadow weight 0.20) and to every BFS/graph query built on `skill_edges`. Nothing currently prevents `manual.*` from being re-authored after cleanup: `parseSkillMetadata`'s only unknown-key rejection is scoped to `edges.*` sub-keys (`skill-graph-db.ts:809-813`), not the graph-metadata.json root, and the fleet gate `ci-skill-root-metadata.cjs` (460 lines) has no top-level unknown-key check at all.

This phase migrates the authored relationship data into the schema that actually drives routing (`edges.depends_on` / `edges.siblings`), reconciles the one confirmed drift case, deletes the dead field fleet-wide, and adds a lint that fails closed if `manual` reappears. Because `edges.*` feeds the scorer's `graph_causal` lane directly and this surface has zero current test coverage, the migration is gated to land only after the sibling 006 phase's routing-accuracy CI gate exists, so any routing regression the migration introduces is caught before merge rather than discovered live.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**: the top-level `manual` key (`depends_on`, `related_to`) in `graph-metadata.json` for the ten roots that carry it — `cli-external-orchestration`, `mcp-code-mode`, `mcp-tooling`, `sk-code`, `sk-design`, `sk-doc`, `sk-git`, `sk-prompt`, `system-deep-loop`, `system-spec-kit` (confirmed by direct inspection of every `.opencode/skills/*/graph-metadata.json`); migrating each root's `manual.depends_on`/`manual.related_to` targets into `edges.depends_on`/`edges.siblings` (or an already-present edge type to the same target); removing the `manual` key once migrated; adding an unknown-key lint (extending the existing `edges.*` unknown-edge-type pattern at `skill-graph-db.ts:809-813`, and/or `ci-skill-root-metadata.cjs`) that fails when a root's `graph-metadata.json` carries `manual` (or any key outside the confirmed-legitimate allowlist); rebuilding `skill-graph.sqlite` so the scorer reflects the migrated edges.

**Out of scope**: the routing-neutral half of research finding O5 — `description.json` unread extras (`trigger_examples`/`supported_surfaces`/`opencode_languages`) and `derived.causal_summary` (validated but no skill-root consumer) are a separate, non-routing-changing cleanup and are NOT touched here. The `derived` block canonicalization (O1) and its regenerator/freshness gate are a separate prerequisite phase and are not re-litigated here. The unrelated `EdgeSourceKind = 'automated' | 'manual' | 'trusted'` provenance tag used by `lib/cross-skill-edges/apply-graph-metadata-patch.ts` and `types.ts` is a different "manual" concept (per-edge authorship provenance for the edge-suggestion tooling, not the graph-metadata.json root field) and is explicitly not modified by this phase. Scorer lane weights, `WEIGHT_BANDS` values, and the edge-type taxonomy itself (`EDGE_TYPES` at `skill-graph-db.ts:158-164`) are not changed — only new edge instances are added within the existing bands.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Migrate `manual.depends_on` into `edges.depends_on` | For each of the 10 roots, every `manual.depends_on` target is present in `edges.depends_on` with a weight inside the `[0.7, 1.0]` band (`skill-graph-db.ts:167`) and a non-empty `context` string; no target is silently dropped |
| REQ-002 | Migrate `manual.related_to` into `edges.siblings` | For each of the 10 roots, every `manual.related_to` target not already represented by another edge type is present in `edges.siblings` with weight inside `[0.4, 0.6]` (`skill-graph-db.ts:170`) and a non-empty `context`; no target is silently dropped |
| REQ-003 | Reconcile the confirmed live drift | `cli-external-orchestration/graph-metadata.json`'s `edges.depends_on` contains a `system-spec-kit` entry (closing the gap vs. the pre-migration empty array) and, after a `skill-graph` scan, the `skill_edges` SQLite table shows a matching `depends_on` row |
| REQ-004 | Remove the dead field | After migration, no `.opencode/skills/*/graph-metadata.json` contains a top-level `manual` key; `git diff --stat` for the migration commit(s) touches exactly the 10 root files plus the lint change (no unrelated file) |
| REQ-005 | Add an unknown-key lint | A lint fails when a root's `graph-metadata.json` carries `manual` or any key outside the confirmed allowlist (`schema_version`, `skill_id`, `family`, `category`, `edges`, `domains`, `intent_signals`, `derived`, plus the confirmed-legitimate extras `deprecated`, `importance_tier`, `enhance_when`); a regression fixture that reintroduces `manual` fails the lint, and the 4 roots carrying a legitimate extra key (`sk-code`: `deprecated`; `sk-design`/`system-deep-loop`: `importance_tier`; `system-skill-advisor`: `enhance_when`) still pass |
| REQ-006 | No duplicate or conflicting edges introduced | After migration, no `(source_id, target_id)` pair appears more than once across all edge types for a migrated root (verified via a `skill_edges` grouped-count query) |
| REQ-007 | Land only behind the 006 routing-accuracy gate | The migration is not merged until the 006 phase's routing-accuracy CI harness is runnable; a routing-accuracy corpus run is executed both before (baseline) and after the migration, and the checklist records either zero regression or an explicit operator-approved delta |
| REQ-008 | Leave the unrelated provenance concept untouched | `git diff` for this phase touches no file under `lib/cross-skill-edges/`; `apply-graph-metadata-patch.ts` and `types.ts` remain byte-identical to their pre-phase state |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

All 10 roots have their `manual.depends_on`/`manual.related_to` content fully represented in `edges.*` (or explicitly justified as intentionally dropped, e.g. a dangling target with no matching skill), the `manual` key no longer exists anywhere in the fleet, the confirmed `cli-external-orchestration` drift is closed, an unknown-key lint blocks any future reintroduction of `manual` without false-positiving on the four confirmed-legitimate extra top-level keys, `skill-graph.sqlite` is rebuilt and reflects the new edges, `ci-skill-root-metadata.cjs` and a `skill-graph` scan both report 0 errors fleet-wide, and a post-migration routing-accuracy run (via the 006 gate) shows no unapproved regression against the pre-migration baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | **HIGH BLAST**: `edges.*` feeds `skill_edges` → the scorer's `graph_causal` lane (`lane-registry.ts:11`, weight 0.13/shadow 0.20) directly, and this surface has 0 current tests, so a bad migration can silently shift live routing | Gate behind the 006 routing-accuracy CI harness; run the corpus before and after; keep the migration in a single revertible commit per root or one atomic commit for the whole set |
| Risk | Weight-band misassignment for newly added edges skews scoring | Use the documented `WEIGHT_BANDS` (`depends_on`/`prerequisite_for` 0.7-1.0, `enhances` 0.3-0.7, `siblings` 0.4-0.6, `conflicts_with` 0.5-1.0) exactly; spot-check every new edge against the band before commit |
| Risk | Confusing this migration's `manual.*` field with the unrelated `EdgeSourceKind = 'manual'` provenance tag in `lib/cross-skill-edges/` | Explicit non-goal in Scope; tasks include a read-and-confirm step before any edit; `git diff --stat` check in Phase 3 confirms `lib/cross-skill-edges/` is untouched |
| Risk | The new unknown-key lint over-triggers on legitimate extra keys (`deprecated` on `sk-code`, `importance_tier` on `sk-design`/`system-deep-loop`, `enhance_when` on `system-skill-advisor`) | Allowlist confirmed by direct inspection of all 11 roots' key sets before the lint is written; regression fixture per legitimate-extra root |
| Risk | Stale `skill-graph.sqlite` masks the migration's effect (scorer keeps reading pre-migration edges from a cached DB) | Explicit rebuild/scan step in Phase 2, verified in Phase 3 via `skill_edges` row diff |
| Dependency | 006 routing-accuracy CI gate (sibling phase, prerequisite) | This phase's Setup phase confirms 006 has landed before any edit begins; blocked otherwise |
| Dependency | `system-skill-advisor` fleet gate `ci-skill-root-metadata.cjs` and the `skill-graph` scan/rebuild path | Both re-run in Phase 3 verification |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Where should the unknown-key lint live: extend `parseSkillMetadata`'s existing top-level validation in `skill-graph-db.ts` (fails at scan/scorer-rebuild time), extend the fleet gate `ci-skill-root-metadata.cjs` (fails at CI/pre-push time), or both? Recommendation for Phase 2: implement in both — `skill-graph-db.ts` for runtime honesty, `ci-skill-root-metadata.cjs` for fast fleet-wide CI feedback — final call is an implementation-time decision, not a spec blocker.
- For `manual.related_to` targets that already appear under a *different* edge type (e.g. already an `enhances` target), should the migration add a redundant `siblings` edge or skip it? Default per REQ-002/REQ-006: skip — no duplicate `(source, target)` pair regardless of type, since the existing edge already carries the relationship into the graph.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research source**: `../../029-skill-json-optimization-research/research/research.md` §3 (finding O5), evidence at `research.md:65`
- **Program parent**: `../spec.md`
- **Prerequisite phase**: `../006-*` (routing-accuracy CI gate)
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **QA**: See `checklist.md`

## Structural phase links

| **Parent Spec** | `../spec.md` |
| **Predecessor** | `007-dead-field-deletes` |
| **Successor** | `009-signal-quality` |
