---
title: "Verification Checklist: activate the persistent styles database (build, shadow, prove, flip)"
description: "Verification for the persistent DB activation — facade frozen, first full-corpus generation published to a git-ignored install-time/prewarm database, shadow parity via the differential oracle, the §9 perf gate measured, scenarios exercised, and the default kept legacy until all eight reactivation gates pass."
trigger_phrases:
  - "persistent styles db activation checklist"
  - "shadow parity perf gate verification"
  - "eight reactivation gates kill switch checklist"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution/006-persistent-db-activation"
    last_updated_at: "2026-07-21T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 checklist for the persistent DB activation build."
    next_safe_action: "Mark items with evidence during the shadow and cutover gates."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_engine/style-library.mjs"
      - ".opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs"
      - ".opencode/skills/sk-design/styles/_db/oracle/differential-oracle.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-dbbuild-plan-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: activate the persistent styles database (build, shadow, prove, flip)

<!-- ANCHOR:protocol -->
## Verification Protocol

- Verify each item against real files + real command output. Mark `[x]` only with cited evidence (`[SOURCE: file]`, `[TESTED: ...]`). The differential oracle, the DB test aggregator, and the measured perf trace are authoritative; `rg`/listing and scenario evidence corroborate. The default read path stays `legacy` until all eight reactivation gates pass.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The `001-foundation` measurement/contract/rollback plane is present and green before any build. [SOURCE: `001-foundation` implementation-summary.md — 69/69 tests, validate --strict Errors:0]
- [ ] CHK-002 [P0] `005-library-restructure` has landed and the restructured corpus is available as the generation input. [SOURCE: `../005-library-restructure/`]
- [ ] CHK-003 [P0] Metadata (`description.json`, `graph-metadata.json`) and `validate.sh --strict` are deferred to the parent/orchestrator session for this planning packet. [SOURCE: parent session ownership]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The facade is frozen: all four corpus modules call `runQuery`/`runHydrate` and none imports the DB. [TESTED: no-DB-import scan of the corpus modules]
- [ ] CHK-011 [P0] No lazy query-time build path exists anywhere; a clean checkout resolves `legacy` until an owned prewarm bootstrap runs. [TESTED: clean-checkout scenario resolves legacy]
- [ ] CHK-012 [P1] Comment hygiene holds: no spec/packet/phase/REQ ids in build scripts, adapters, or test comments.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] SHADOW mode reports 100% facade DTO/refusal/generation parity via a green differential oracle before any flip. [TESTED: `_db/oracle/differential-oracle.mjs` green in shadow]
- [ ] CHK-021 [P0] The DB test aggregator is green, including the 69/69 Phase-0 set. [TESTED: DB aggregator green]
- [ ] CHK-022 [P0] The §9 perf gate is measured on a real representative trace — ≥30% and ≥25 ms absolute p95 improvement, or an approved-SLO breach; both proposed thresholds confirmed on shadow data. [TESTED: perf trace over the request corpus]
- [ ] CHK-023 [P1] Relevance acceptance holds: no material regression against the human relevance judgments across all four design modes. [TESTED: relevance eval vs human labels]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-025 [P0] The first full-corpus generation of all 1,290 styles is published into the git-ignored `database/` with captured size/build-time/RSS + manifest-recorded status + rollback evidence. [SOURCE: manifest + stage telemetry]
- [ ] CHK-026 [P1] Extraction is wired to an authoritative rebuild/reconciliation workflow; watchers only trigger and reconciliation owns correctness. [SOURCE: reconciliation workflow]
- [ ] CHK-027 [P0] All seven scenarios pass: clean-checkout, stale-corpus, interrupted-build, pointer-mismatch, missing-artifact, repair, rollback. [TESTED: scenario matrix]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No binary is committed; the DB is present only under the git-ignored `database/` directory. [SOURCE: `.gitignore` + scope diff]
- [ ] CHK-031 [P1] Changes scoped to the sk-design styles engine/db surfaces + the git-ignored `database/`; no unrelated or predecessor-owned files touched (scope-diff before any completion claim). [SOURCE: scope diff]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] Docs authored at Level 2 (spec/plan/tasks/checklist/implementation-summary) matching the parent packet's template conventions. [SOURCE: `SPECKIT_LEVEL: 2` + `SPECKIT_TEMPLATE_SOURCE` markers in all five files]
- [ ] CHK-041 [P1] Each of REQ-001 through REQ-010 is represented consistently across spec.md, plan.md, and tasks.md. [SOURCE: cross-referenced REQ IDs]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P0] The default read path stays `legacy` until all eight conjunctive gates pass; the flip is behind a retained kill switch + a bounded observation window; no unguarded default flip is committed. [SOURCE: `SK_DESIGN_STYLE_DB_MODE` default legacy + gate evidence]
- [ ] CHK-051 [P1] Rollback is a kill-switch mode flip + a manifest-pointer rollback, not a data migration; the flat files remain the content authority. [SOURCE: rollback plan]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-060 [P0] Executable contract satisfied: the differential oracle is green in shadow, the DB aggregator (incl. 69/69 Phase-0) is green, and the §9 perf gate is confirmed on a real representative trace — the activation is provably parity-safe.
- [ ] CHK-061 [P1] `validate.sh --strict` on this phase = 0 errors; spec/plan/tasks/checklist synchronized. The kill-switch + manifest-pointer rollback is recorded as the failure path.
<!-- /ANCHOR:summary -->
