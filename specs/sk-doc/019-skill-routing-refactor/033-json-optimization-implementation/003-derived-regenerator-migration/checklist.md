---
title: "Verification Checklist: Derived Regenerator + Fleet Migration + Freshness Gate"
description: "Level-2 verification checklist for the skill-root derived regenerator, the corpus-neutral fleet pass, and the CI freshness gate; verified complete on v4's 033/sk-create-skill structure."
trigger_phrases:
  - "derived regenerator migration checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/003-derived-regenerator-migration"
    last_updated_at: "2026-07-29T14:03:10Z"
    last_updated_by: "claude-code"
    recent_action: "Verified regenerator + gate + corpus-neutral fleet pass"
    next_safe_action: "Phase 004 scaffold-journey delta"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation-003-derived-regenerator-migration-20260729"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Derived Regenerator + Fleet Migration + Freshness Gate

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Meaning | Rule |
|----------|---------|------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase 001's canonical `derived` decision read [evidence: `033/001` decision-record confirmed byte-identical to the authoring line — Python-core + TS-additive, ADR-001 Accepted]
- [x] CHK-002 [P0] Phase 002's pinned baseline confirmed [evidence: corpus hash `9f30cc5e…` matches; used as the corpus-neutrality gate]
- [x] CHK-003 [P1] All 11 roots inventoried as `schema_version: 2` [evidence: `regenerate-skill-derived.cjs --all` enumerated + processed all 11]
- [x] CHK-004 [P1] Pre-migration baseline clean [evidence: worktree `git status` clean on all `graph-metadata.json` before `--write`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Atomic per-root write [evidence: `writeJsonAtomic` tmp-file + rename in `regenerate-skill-derived.cjs`]
- [x] CHK-011 [P0] Preserve-first — authored fields never dropped/replaced [evidence: `repairDerived` preserves all keys verbatim, prunes only unresolved structural refs; `causal_summary` untouched]
- [x] CHK-012 [P1] `--dry-run` default, `--write` explicit [evidence: run showed dry-run report by default; `--write` required to touch disk]
- [x] CHK-013 [P1] Gate exit convention 0/1/2 [evidence: `ci-skill-derived-freshness.cjs` returned exit 0 fresh; mirrors `ci-leaf-manifest-freshness.cjs`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Compiler `validate_derived_metadata` 0 errors across 11 [evidence: `skill_graph_compiler.py --validate-only` → "VALIDATION PASSED: all metadata files are valid"]
- [x] CHK-021 [P0] Idempotency — second run 0 writes [evidence: post-`--write` dry-run reports all 11 unchanged]
- [x] CHK-022 [P0] Gate negative test [evidence: `skill-derived-regenerator.test.cjs` staled-fixture case asserts nonzero exit; suite passes]
- [x] CHK-023 [P1] Gate positive test [evidence: clean fleet → `checked=11 fresh=11 stale=0`, exit 0]
- [x] CHK-024 [P1] Preservation round-trip [evidence: `skill-derived-regenerator.test.cjs` preserve-authored-fields case passes]
- [x] CHK-025 [P1] Extraction/repair unit coverage [evidence: `skill-derived-regenerator.test.cjs` passes (repair + gate cases)]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] All 11 roots processed to canonical shape [evidence: `--all` pass — 10 unchanged, mcp-code-mode 1 prune; none skipped]
- [x] CHK-031 [P1] Dry-run diffs reviewed before `--write`; changes corpus-verified [evidence: top-3 capture identical 176/195, 53/72 with change applied vs reverted]
- [x] CHK-032 [P2] `init_skill.py` scaffold `derived` noted as follow-up [evidence: deferred to phase 004 scaffold-journey, recorded in impl-summary]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] Path-traversal guarded [evidence: `keyFileExists`/`skillFileExists` reject absolute paths + assert resolved path stays under the repo/skill root prefix]
- [x] CHK-041 [P1] No credentials/proprietary data introduced [evidence: only a dead-reference prune; no new content authored]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] spec/plan/tasks in sync on the 001/002 dependency [evidence: docs reference the confirmed 001 decision + 002 baseline]
- [ ] CHK-051 [P1] Post-migration daemon/SQLite reindex documented in a runbook — DEFERRED to phase `012-integration-verification-rollout`, which owns the daemon-reindex proof for the whole program [approved deferral: no fleet data changed here beyond one prune]
- [x] CHK-052 [P2] Packet continuity updated [evidence: spec.md + implementation-summary.md → Complete, completion_pct 100]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] New scripts under `sk-doc/sk-create-skill/scripts/` [evidence: `regenerate-skill-derived.cjs`, `ci-skill-derived-freshness.cjs`, `tests/skill-derived-regenerator.test.cjs` — path adapted from the authoring line's `create-skill` to v4's `sk-create-skill`]
- [x] CHK-061 [P1] Scope contained [evidence: diff = 3 new scripts + one `routing-registry-drift.yml` line + one `mcp-code-mode/graph-metadata.json` prune]
- [x] CHK-062 [P2] Temp/scratch cleaned [evidence: worktree build symlinks used only for corpus capture, removed before commit]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 10 | 9/10 (CHK-051 deferred to phase 012) |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-07-29
<!-- /ANCHOR:summary -->
