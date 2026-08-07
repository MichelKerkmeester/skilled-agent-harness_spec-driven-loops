---
title: "Implementation Plan: Migrate manual.* into Typed Edges (Gated)"
description: "Phased plan to migrate graph-metadata.manual.* into edges.*, reconcile the cli-external-orchestration drift, add an unknown-key lint, and verify against the 006 routing-accuracy gate before merge."
trigger_phrases:
  - "manual to edges migration plan"
  - "graph-metadata manual migration rollback"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/008-manual-to-edges-migration"
    last_updated_at: "2026-07-29T12:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "006 routing-accuracy CI gate not yet landed"
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "008-manual-to-edges-migration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Migrate manual.* into Typed Edges (Gated)

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Migrate the dead `graph-metadata.manual.{depends_on,related_to}` field into the typed `edges.{depends_on,siblings}` schema that `parseSkillMetadata` and the scorer's `graph_causal` lane actually read, across the 10 fleet roots that carry it. Reconcile the one confirmed live drift (`cli-external-orchestration`), delete `manual` fleet-wide once migrated, and add an unknown-key lint so the field cannot silently reappear. Because this changes what the graph scorer sees, the change lands only after the sibling 006 phase's routing-accuracy CI gate exists, and is verified against a before/after routing-accuracy run.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Bar |
|------|-----|
| Prerequisite | 006 routing-accuracy CI gate lands and is runnable before Phase 1 begins |
| Coverage | All 10 roots' `manual.*` content migrated or explicitly justified as dropped — none silently lost |
| Weight fidelity | Every new edge's weight falls inside its type's documented `WEIGHT_BANDS` |
| No duplication | No `(source_id, target_id)` pair repeated across edge types after migration |
| Lint | Unknown-key lint fails on a reintroduced `manual` key; does not false-positive on the 4 confirmed-legitimate extra top-level keys |
| Regression | Post-migration routing-accuracy corpus run shows no unapproved delta vs. the pre-migration baseline |
| Isolation | `git diff` touches only the 10 root `graph-metadata.json` files, the lint change, and this packet's docs — nothing under `lib/cross-skill-edges/` |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

No new components. This is a data migration plus one validation addition across three existing surfaces:

| Surface | File | Role in this phase |
|---------|------|---------------------|
| Root metadata (source of truth) | `.opencode/skills/{root}/graph-metadata.json` (10 roots) | `manual.*` migrated into `edges.*`, then `manual` deleted |
| Parser / graph builder | `system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts` — `parseSkillMetadata` (`:757-829`), `EDGE_TYPES` (`:158-164`), `WEIGHT_BANDS` (`:166-172`) | Reads `edges.*` into the `skill_edges` SQLite table; unknown-key check extended from `edges.*`-scoped (`:809-813`) to also reject a root-level `manual` key |
| Fleet CI gate | `sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Optionally carries the same unknown-key check for fast CI/pre-push feedback, independent of a full scorer rebuild |
| Scorer graph lane | `lib/scorer/projection.ts`, `lib/scorer/fusion.ts`, `lib/scorer/lane-registry.ts` (`graph_causal`, weight 0.13 / shadow 0.20), `lib/scorer/lanes/graph-causal.ts` | Downstream consumer that must reflect the migrated edges after a `skill-graph` scan/rebuild — this is what the routing-accuracy verification checks |
| Unrelated (must stay untouched) | `lib/cross-skill-edges/types.ts` (`EdgeSourceKind = 'automated'\|'manual'\|'trusted'`), `apply-graph-metadata-patch.ts` | Different "manual" concept (per-edge authorship provenance); explicitly out of scope |

Migration mapping used for every root: `manual.depends_on[i]` → `edges.depends_on` entry (`target`, `weight` in `[0.7,1.0]`, authored `context`), skipping any target already present in `edges.depends_on`. `manual.related_to[i]` → `edges.siblings` entry (`target`, `weight` in `[0.4,0.6]`, default `0.5` unless a documented reason picks otherwise, authored `context`), skipping any target already present under *any* edge type for that source (no duplicate `(source, target)` pair, per REQ-006).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Confirm the 006 routing-accuracy gate is landed and runnable; capture the pre-migration baseline (per-root `manual`/`edges` content, `skill_edges` row counts by type, and a routing-accuracy corpus run) before any file is edited; confirm the unrelated `EdgeSourceKind` provenance concept is understood and will not be touched; build the confirmed top-level-key allowlist for the new lint.

### Phase 2: Implementation

For each of the 10 roots: migrate `manual.depends_on` into `edges.depends_on` and `manual.related_to` into `edges.siblings` per the mapping above, reconciling the `cli-external-orchestration` drift as part of the same pass; remove the `manual` key once migrated; add the unknown-key lint; rebuild `skill-graph.sqlite` so the scorer reflects the new edges.

### Phase 3: Verification

Re-run the routing-accuracy corpus (006 gate) and diff against the Phase 1 baseline; run `ci-skill-root-metadata.cjs` and a `skill-graph` scan fleet-wide (0 errors expected); confirm the lint fails a reintroduced-`manual` fixture and passes the 4 legitimate-extra-key roots; confirm `lib/cross-skill-edges/` is untouched; update packet continuity.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Primary safety net is the 006 routing-accuracy corpus, run once before and once after the migration — the diff is the regression signal for this HIGH BLAST change, since the edge schema has zero pre-existing unit tests. Structural correctness (no dropped targets, no duplicate `(source, target)` pairs, weights inside band) is verified per-root via a diff of `manual`/`edges` before and after, plus a `skill_edges` grouped-count query for duplicates. The new lint gets its own regression fixture (a root with a reintroduced `manual` key must fail) and a negative-control check against the 4 roots with legitimate extra top-level keys, so the lint's own correctness is verified independently of the data migration.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The 006 routing-accuracy CI gate (hard prerequisite — this phase does not start Phase 1 until it is runnable); the `system-skill-advisor` `skill-graph` scan/rebuild path (to refresh `skill-graph.sqlite` after the JSON edits); `ci-skill-root-metadata.cjs` (fleet gate, extended or re-run); the 10 target `graph-metadata.json` files.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This is a HIGH BLAST phase (routing-changing, zero pre-existing test coverage on the touched surface) — rollback is mandatory and kept simple by construction:

1. **Scope containment**: the migration touches only 10 `graph-metadata.json` files plus the lint addition (`skill-graph-db.ts` and/or `ci-skill-root-metadata.cjs`) and this packet's docs — no runtime behavior outside the advisor graph lane is touched, and `lib/cross-skill-edges/` is explicitly excluded.
2. **Revert path**: `git revert` of the migration commit(s) restores the prior `manual.*`/`edges.*` content byte-for-byte, since every change is a JSON edit plus one additive validation check — nothing destructive or irreversible is performed.
3. **DB resync**: after a revert, re-run the `skill-graph` scan/rebuild so `skill-graph.sqlite` re-derives from the reverted JSON, restoring the pre-migration `skill_edges` state (the DB is a derived cache, never hand-edited).
4. **Independent revert granularity**: the data migration (JSON edits) and the lint addition are kept separable — if the lint alone produces false positives fleet-wide post-merge, it can be reverted independently without touching the already-landed edge migration, and vice versa.
5. **Trigger condition**: revert if the post-migration routing-accuracy corpus run (006 gate) shows an unapproved regression, or if the lint false-positives on a root outside the confirmed 4-root allowlist.
<!-- /ANCHOR:rollback -->
