---
title: "Task Breakdown: Derived Regenerator + Fleet Migration + Freshness Gate"
description: "Tasks for building the skill-root derived regenerator, migrating all 11 existing skill roots, and wiring the new CI freshness gate."
trigger_phrases:
  - "derived regenerator migration tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/003-derived-regenerator-migration"
    last_updated_at: "2026-07-29T09:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "Depends on phase 001 (canonical derived-schema decision) and phase 002 (schema implementation)"
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "030-json-optimization-implementation-003-derived-regenerator-migration-20260729"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Task Breakdown: Derived Regenerator + Fleet Migration + Freshness Gate

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T-01 Read phase 001's canonical `derived` schema/producer decision and phase 002's schema implementation as the input contract for this phase
- [ ] T-02 Inventory the 11 existing skill roots' current `derived` blocks (`cli-external-orchestration`, `mcp-code-mode`, `mcp-tooling`, `sk-code`, `sk-design`, `sk-doc`, `sk-git`, `sk-prompt`, `system-deep-loop`, `system-skill-advisor`, `system-spec-kit`) and confirm all are `schema_version: 2` and Python-shaped
- [ ] T-03 Snapshot originals for rollback (confirm the 11 `graph-metadata.json` paths are clean in git before touching them) and confirm `skill_graph_compiler.py`'s `validate_derived_metadata` as the acceptance oracle
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T-04 Build `regenerate-skill-derived.cjs` under `sk-doc/create-skill/scripts/`: extract `trigger_phrases`/`key_topics`/`key_files`/`source_docs` from each root's corpus (SKILL.md, README.md, declared source docs)
- [ ] T-05 Derive typed `entities` objects (`name`/`kind`/`path`/`source`, `kind` constrained to `ALLOWED_ENTITY_KINDS`) with on-disk path existence checks
- [ ] T-06 Preserve authored `causal_summary` and any existing `lifecycle_status`/`redirect_from`/`redirect_to` via additive merge (never a full-object replace)
- [ ] T-07 Write atomically (tmp-file + rename) per root; skip the write when content is unchanged (diff excludes only the timestamp field)
- [ ] T-08 Dry-run across all 11 roots and review diffs against current hand-authored content
- [ ] T-09 Run `--write` to migrate the fleet in one reviewed pass
- [ ] T-10 Build `ci-skill-derived-freshness.cjs`, mirroring `ci-leaf-manifest-freshness.cjs`'s regenerate-and-byte-diff pattern and exit-code convention
- [ ] T-11 Wire the new gate into `routing-registry-drift.yml` alongside the existing `ci-skill-root-metadata.cjs`/`ci-leaf-manifest-freshness.cjs` calls
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-12 Run `skill_graph_compiler.py`'s `validate_derived_metadata` across all 11 migrated roots — confirm 0 errors
- [ ] T-13 Re-run the regenerator a second time against the migrated fleet — confirm 0 additional writes (idempotency)
- [ ] T-14 Run the new CI gate locally against a deliberately staled fixture (confirm nonzero exit) and the clean migrated fleet (confirm 0 exit)
- [ ] T-15 Execute the post-migration daemon/SQLite reindex (or documented restart) and confirm the live advisor projection reflects the migrated roots
- [ ] T-16 Rehearse the rollback path on one fixture root (`git checkout --`) and record the result
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 11 roots migrated to the canonical shape and pass `validate_derived_metadata` with 0 errors; the regenerator is idempotent; the CI freshness gate is wired into `routing-registry-drift.yml` and both the positive and negative cases are confirmed; the post-migration daemon/SQLite reindex is executed; the rollback path is rehearsed and recorded before the fleet-wide write.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

Spec `spec.md` · Plan `plan.md` · QA `checklist.md` · Predecessor phases 001/002 · Research `../../029-skill-json-optimization-research/research/research.md` §3 O1
<!-- /ANCHOR:cross-refs -->
