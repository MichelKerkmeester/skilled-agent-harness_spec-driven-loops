---
title: "Implementation Tasks: Migrate manual.* into Typed Edges (Gated)"
description: "Tasks for migrating graph-metadata.manual.* into edges.*, reconciling the cli-external-orchestration drift, adding an unknown-key lint, and verifying against the 006 routing-accuracy gate."
trigger_phrases:
  - "manual to edges migration tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/008-manual-to-edges-migration"
    last_updated_at: "2026-07-29T12:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "006 routing-accuracy CI gate not yet landed"
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "008-manual-to-edges-migration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Implementation Tasks: Migrate manual.* into Typed Edges (Gated)

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T-01 Confirm the 006 routing-accuracy CI gate has landed and its corpus runner is runnable; do not proceed past this task until confirmed
- [ ] T-02 Run the 006 routing-accuracy corpus once as the pre-migration baseline and preserve the output
- [ ] T-03 Snapshot the current `manual`/`edges` content of all 10 roots (`cli-external-orchestration`, `mcp-code-mode`, `mcp-tooling`, `sk-code`, `sk-design`, `sk-doc`, `sk-git`, `sk-prompt`, `system-deep-loop`, `system-spec-kit`) plus current `skill_edges` row counts by `edge_type` from `skill-graph.sqlite`
- [ ] T-04 Read `lib/cross-skill-edges/types.ts` and `apply-graph-metadata-patch.ts` to confirm the unrelated `EdgeSourceKind = 'automated'|'manual'|'trusted'` provenance concept is distinct from `graph-metadata.manual.*` and will not be touched
- [ ] T-05 Build and record the confirmed top-level-key allowlist for the new lint: `schema_version`, `skill_id`, `family`, `category`, `edges`, `domains`, `intent_signals`, `derived`, plus the 4 confirmed-legitimate extras (`deprecated` on `sk-code`; `importance_tier` on `sk-design`/`system-deep-loop`; `enhance_when` on `system-skill-advisor`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T-06 For each of the 10 roots, migrate `manual.depends_on` entries into `edges.depends_on` (weight in `[0.7, 1.0]`, authored `context`), skipping any target already present in `edges.depends_on`
- [ ] T-07 For each of the 10 roots, migrate `manual.related_to` entries into `edges.siblings` (weight in `[0.4, 0.6]`, default `0.5`, authored `context`), skipping any target already present under any edge type for that source
- [ ] T-08 Reconcile the confirmed live drift: add `system-spec-kit` to `cli-external-orchestration/graph-metadata.json`'s `edges.depends_on` (closing the gap vs. the pre-existing `manual.depends_on: ["system-spec-kit"]` / empty `edges.depends_on`)
- [ ] T-09 Remove the top-level `manual` key from all 10 roots once each root's migration is confirmed complete
- [ ] T-10 Add the unknown-key lint: extend `parseSkillMetadata`'s top-level validation in `skill-graph-db.ts` (mirroring the existing `edges.*` unknown-edge-type check at `:809-813`) and/or `ci-skill-root-metadata.cjs` to fail on `manual` or any key outside the T-05 allowlist
- [ ] T-11 Rebuild `skill-graph.sqlite` via the `skill-graph` scan so the scorer's `graph_causal` lane reflects the migrated edges
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-12 Re-run the 006 routing-accuracy corpus post-migration and diff against the T-02 baseline; confirm no regression, or record an explicit operator-approved delta
- [ ] T-13 Run `ci-skill-root-metadata.cjs` and a fleet-wide `skill-graph` scan; confirm 0 errors, including on the 10 migrated roots and the 4 legitimate-extra-key roots
- [ ] T-14 Add/confirm a regression fixture that reintroduces a `manual` key and assert the new lint fails it
- [ ] T-15 Query `skill_edges` grouped by `(source_id, target_id)` to confirm no duplicate pair was introduced by the migration
- [ ] T-16 Confirm via `git diff --stat` that no file under `lib/cross-skill-edges/` changed and that only the 10 root JSON files, the lint change, and this packet's docs were touched
- [ ] T-17 Update packet continuity (`spec.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`) and run `validate.sh --strict` on this folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 10 roots' `manual.*` content migrated into `edges.*` or explicitly justified as dropped; `manual` removed fleet-wide; `cli-external-orchestration` drift closed; unknown-key lint added and verified against both a reintroduction fixture and the 4 legitimate-extra-key roots; no duplicate edges; post-migration routing-accuracy run shows no unapproved regression; `lib/cross-skill-edges/` untouched; `validate.sh --strict` clean.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

Spec `spec.md` · Plan `plan.md` · QA `checklist.md` · Research source `../../029-skill-json-optimization-research/research/research.md` §3 (O5) · Prerequisite `../006-*` (routing-accuracy CI gate)
<!-- /ANCHOR:cross-refs -->
