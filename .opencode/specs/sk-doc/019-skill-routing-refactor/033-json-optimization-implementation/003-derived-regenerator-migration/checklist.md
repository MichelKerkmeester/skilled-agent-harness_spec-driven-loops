---
title: "Verification Checklist: Derived Regenerator + Fleet Migration + Freshness Gate"
description: "Planned Level-2 verification checklist for the skill-root derived regenerator, the 11-root fleet migration, and the new CI freshness gate; items are pending until the phase executes."
trigger_phrases:
  - "derived regenerator migration checklist"
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
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation-003-derived-regenerator-migration-20260729"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Derived Regenerator + Fleet Migration + Freshness Gate

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item is pending until the phase executes; run-dependent items stay `[ ]` until then.

| Priority | Meaning | Rule |
|----------|---------|------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 001's canonical `derived` schema/producer decision confirmed and read before implementation starts
- [ ] CHK-002 [P0] Phase 002's schema implementation confirmed to match the shape this regenerator will target
- [ ] CHK-003 [P1] All 11 existing skill roots inventoried and confirmed `schema_version: 2` with a Python-shaped `derived` block
- [ ] CHK-004 [P1] Pre-migration git baseline confirmed clean on all 11 `graph-metadata.json` paths
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `regenerate-skill-derived.cjs` writes atomically (tmp-file + rename) per root, never a partial write
- [ ] CHK-011 [P0] Regenerator merges additively into `derived` — `causal_summary`/`lifecycle_status`/`redirect_from`/`redirect_to` are never dropped or replaced wholesale
- [ ] CHK-012 [P1] `--dry-run` is the default mode; `--write` is explicit and required to touch disk
- [ ] CHK-013 [P1] `ci-skill-derived-freshness.cjs` follows the same exit-code convention as `ci-leaf-manifest-freshness.cjs` (0 fresh / 1 stale / 2 gate could not run)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `skill_graph_compiler.py`'s `validate_derived_metadata` reports 0 errors across all 11 migrated roots
- [ ] CHK-021 [P0] A second regenerator run against the migrated fleet produces 0 additional writes (idempotency confirmed)
- [ ] CHK-022 [P0] CI gate negative test: a deliberately staled `derived` fixture fails `ci-skill-derived-freshness.cjs` with a nonzero exit
- [ ] CHK-023 [P1] CI gate positive test: the clean migrated fleet passes `ci-skill-derived-freshness.cjs` with exit 0
- [ ] CHK-024 [P1] Preservation fixture test: a root with `lifecycle_status: "deprecated"` and `redirect_to` set round-trips through the regenerator byte-identical on those fields
- [ ] CHK-025 [P1] Extraction unit tests against SKILL.md/README fixtures produce the expected `trigger_phrases`/`key_topics`/`key_files`/`entities` sets
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] All 11 existing skill roots migrated to the canonical shape — none skipped or left in the pre-migration format
- [ ] CHK-031 [P1] Every dry-run diff reviewed before `--write`; any trigger-phrase/key-topic removal flagged and confirmed intentional
- [ ] CHK-032 [P2] `init_skill.py`'s incomplete scaffold `derived` block (missing `key_files`/`entities`/`causal_summary`) noted as a follow-up for a later phase, not fixed here
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] Every derived `key_files`/`source_docs`/`entities[].path` is validated to resolve inside the repo root (no path traversal), matching `skill_graph_compiler.py`'s existing checks
- [ ] CHK-041 [P1] No credentials, tokens, or proprietary data introduced into any regenerated `derived` block
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] spec.md, plan.md, tasks.md kept in sync on the canonical-schema dependency (phases 001/002) and the daemon-reload step
- [ ] CHK-051 [P1] The post-migration daemon/SQLite reindex step is documented in the migration runbook, not left implicit
- [ ] CHK-052 [P2] Packet continuity updated after execution (implementation-summary.md status, completion_pct)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] New scripts land under `sk-doc/create-skill/scripts/` only, alongside the existing `ci-*-freshness.cjs` gates
- [ ] CHK-061 [P1] No file outside the 11 target `graph-metadata.json` paths and the two new scripts (plus the one `routing-registry-drift.yml` edit) is touched by this phase
- [ ] CHK-062 [P2] Temp/scratch artifacts from dry-run review cleaned up before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 0/7 (planned) |
| P1 Items | 10 | 0/10 (planned) |
| P2 Items | 3 | 0/3 (planned) |

**Verification Date**: Pending (plan authored ahead of execution)
<!-- /ANCHOR:summary -->
