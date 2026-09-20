---
title: "Task Breakdown: Derived Regenerator + Fleet Migration + Freshness Gate"
description: "Tasks for building the skill-root derived regenerator, migrating all 11 existing skill roots, and wiring the new CI freshness gate."
trigger_phrases:
  - "derived regenerator migration tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/003-derived-regenerator-migration"
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
      session_id: "033-json-optimization-implementation-003-derived-regenerator-migration-20260729"
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

- [x] T-01 Read 001's decision + 002's baseline as the input contract [evidence: confirmed byte-identical to authoring line; corpus hash matches]
- [x] T-02 Inventory the 11 roots as `schema_version: 2` Python-shaped [evidence: `--all` enumerated + processed all 11]
- [x] T-03 Clean git baseline + compiler as acceptance oracle [evidence: worktree clean pre-write; `skill_graph_compiler.py --validate-only` used as oracle]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-04 Build `regenerate-skill-derived.cjs` under `sk-doc/sk-create-skill/scripts/` [evidence: present; path adapted to v4's `sk-create-skill`; preserve-first extraction]
- [x] T-05 Typed `entities` with on-disk path checks [evidence: `keyFileExists`-validated entity paths, now gitignore-tolerant]
- [x] T-06 Preserve authored `causal_summary`/lifecycle/redirect fields [evidence: `repairDerived` preserves all keys verbatim, prunes only dead structural refs]
- [x] T-07 Atomic write + skip-when-unchanged [evidence: `writeJsonAtomic` tmp+rename; 10/11 roots unchanged → no write]
- [x] T-08 Dry-run across 11 roots, diffs reviewed [evidence: dry-run → 10 unchanged + mcp-code-mode prune; reviewed]
- [x] T-09 `--write` fleet pass [evidence: 1 root written (mcp-code-mode untracked-ref prune); corpus neutral 176/195, 53/72]
- [x] T-10 Build `ci-skill-derived-freshness.cjs` [evidence: mirrors leaf-manifest freshness pattern + exit codes; exit 0 on clean fleet]
- [x] T-11 Wire the gate into `routing-registry-drift.yml` [evidence: added after the `ci-leaf-manifest-freshness.cjs` line in the class-contract step]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-12 Compiler `validate_derived_metadata` across 11 → 0 errors [evidence: "VALIDATION PASSED: all metadata files are valid"]
- [x] T-13 Idempotency [evidence: post-`--write` dry-run reports all 11 unchanged]
- [x] T-14 Gate negative + positive [evidence: `skill-derived-regenerator.test.cjs` staled-fixture case + clean fleet `fresh=11` exit 0]
- [ ] T-15 Post-migration daemon/SQLite reindex — DEFERRED to phase `012-integration-verification-rollout` (owns the program-wide daemon-reindex proof); no fleet data changed here beyond one prune
- [x] T-16 Rollback path rehearsed [evidence: `git checkout HEAD -- graph-metadata.json` used repeatedly during corpus isolation — clean restore confirmed]
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
