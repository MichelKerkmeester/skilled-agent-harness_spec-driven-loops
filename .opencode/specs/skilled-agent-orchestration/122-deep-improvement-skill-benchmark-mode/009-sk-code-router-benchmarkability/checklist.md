---
title: "Verification Checklist: sk-code Router Benchmarkability"
description: "QA checklist verifying the Lane C reference-following fallback, sk-code router projection, fixtures, backward-compat, and before/after benchmark evidence."
trigger_phrases:
  - "sk-code router benchmarkability checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/009-sk-code-router-benchmarkability"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Checklist verified against shipped change"
    next_safe_action: "validate.sh --strict"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-router-benchmarkability"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-code Router Benchmarkability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

- Run from `.opencode/skills/deep-improvement/scripts`: `npx vitest run`.
- Benchmark (fixtures are skill-local, so `--fixtures-dir` is required): `node .opencode/skills/deep-improvement/scripts/shared/loop-host.cjs --mode=skill-benchmark --skill=sk-code --fixtures-dir=.opencode/skills/sk-code/benchmark/fixtures/sk-code --outputs-dir=.opencode/skills/sk-code/benchmark/full --trace-mode=router --advisor-mode=python`. See `sk-code/benchmark/README.md`.
- Every item below is marked `[x]` only with cited evidence.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-01 [P1] Baseline captured before any change — `sk-code/benchmark/baseline/` (BLOCKED-BY-STRUCTURE, D5=0).
- [x] CHK-02 [P1] Backward-compat contract read from existing `skill-benchmark.vitest.ts`.
- [x] CHK-03 [P1] Full sk-code reference inventory enumerated (94 md files).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-04 [P1] Fallback is additive — inline parse remains the primary path.
- [x] CHK-05 [P1] `skillRoot` threaded to all 3 `parseRouter` call sites (`rg parseRouter`).
- [x] CHK-06 [P1] Code comments carry no spec-folder paths / packet ids (comment-hygiene clean).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-07 [P0] Full `deep-improvement` vitest suite green — **214 tests / 20 files**.
- [x] CHK-08 [P0] +4 reference-following tests added and passing.
- [x] CHK-09 [P1] `loop-host` plan for `skill-benchmark` unchanged; Lane A/B modes unaffected.
- [x] CHK-24 [P1] Drift guard `sk-code-router-sync.vitest.ts` added (no dead paths, full coverage, prose explicit paths present); full suite 218 passing.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-10 [P0] **REQ-001** sk-code parses via reference-following (`routerSource` contains `smart_routing.md`).
- [x] CHK-11 [P0] **REQ-002** Inline-router skills unchanged (`cli-codex` `routerSource === 'inline'`).
- [x] CHK-12 [P0] **REQ-003** Router-less skills still gate (throwaway stays `parseable:false`).
- [x] CHK-13 [P0] **REQ-004** No dead paths — D5 `deadResourcePaths === []`, `gateFailed === false`.
- [x] CHK-14 [P1] **REQ-005** sk-code scores end-to-end — verdict `CONDITIONAL`, 2 scored scenarios.
- [x] CHK-15 [P1] **REQ-006** Fixtures contamination-clean — both prompts pass `lintFixture`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-16 [P1] No new shell/exec paths; parser reads files within the skill root only.
- [x] CHK-17 [P1] `findReferencedRouterDoc` is existence-guarded and stays under `skillRoot`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-18 [P2] `smart_routing.md` §11 documents surface-flatten / no-phase-boost / no-anti-signal limits.
- [x] CHK-19 [P2] Empty-gold rationale + D3=0 artifact documented in fixtures + decision-record.
- [x] CHK-20 [P2] spec/plan/tasks/checklist/impl-summary/decision-record present.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-21 [P2] Harness edits confined to `scripts/skill-benchmark/`.
- [x] CHK-22 [P2] Fixtures under `sk-code/benchmark/fixtures/sk-code/` (skill-local; runs pass `--fixtures-dir`).
- [x] CHK-23 [P2] Reports + README under `sk-code/benchmark/{baseline,after,full}/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- Before → After: verdict BLOCKED→CONDITIONAL; D5 0→91; router_unparseable 1→0; orphans 94→3; scenarios 0→2.
- 6/6 requirements met; 214/214 tests pass; 0 dead paths; 0 inline-router regressions.
<!-- /ANCHOR:summary -->
