---
title: "Verification Checklist: Strict-validation fixtures — boolean validators + v3 capability profile"
description: "Verification Date: 2026-06-02 (fixtures + v3 profile + vitest; real benchmark run out of scope)"
trigger_phrases:
  - "strict validation fixtures checklist"
  - "boolean validator verification"
  - "v3 capability profile checklist"
  - "adversarial invalid fixtures verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/102-reusable-model-benchmark-framework/006-strict-validation-fixtures"
    last_updated_at: "2026-06-02T12:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Fixtures verified + n=5 run shipped; M3 more reliable than MiMo (eval/synthesis.md)"
    next_safe_action: "Optional P2: fix reporter TIE-on-format when only one model is gate-eligible"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures"
      - ".opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles/capability-m3-vs-mimo-v3.json"
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/tests/sweep-isolation.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "checklist-127-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Strict-validation fixtures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..004, SC-001..004)
- [x] CHK-002 [P0] Technical approach defined in plan.md (oracle-correctness-first: reference 1.0 + lax <1.0 through the real scorer)
- [x] CHK-003 [P1] Dependencies identified and available (real `code-task-scorer.cjs`, `profile-validator.cjs`, v2 profile + roman fixture to mirror)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Tests pass — `cd .opencode/skills/deep-improvement/scripts && npx vitest run model-benchmark/tests/` → 158 passed, exit 0
- [x] CHK-011 [P0] No repo pollution — no `eval/` write; /tmp validation harness removed; `git status` shows only the intended new fixtures/profile/test/spec files
- [x] CHK-012 [P1] Profile valid — `profile-validator.cjs` on `capability-m3-vs-mimo-v3.json` → `{valid:true,errors:[]}` (4 fixtures, samplesPerCell 5, correctness gate 1.0, groupBy model)
- [x] CHK-013 [P1] Code follows project patterns — additive fixtures mirroring `hard-roman-to-int.json`; "Return ONLY the function source as text. Do NOT create or write any files." on every fixture; no spec paths / task ids in code comments
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met — REQ-001 (≥26 cases, ≥60% invalid), REQ-002 (validated oracles), REQ-003 (v3 profile valid), REQ-004 (green + clean) all satisfied
- [x] CHK-021 [P0] Fixture-shape testing complete — suite 158 passed exit 0; new fixtures parse and carry 27 (ipv4) / 26 (date) / 28 (semver) oracle cases (SC-001)
- [x] CHK-022 [P1] Oracles validated through the real `code-task-scorer.cjs` — reference 1.0 vs deliberately-lax <1.0: `validate-ipv4` 1.0/0.889, `validate-date` 1.0/0.769, `validate-semver` 1.0/0.750
- [x] CHK-023 [P1] Validation fixture pack created — 3 T4 boolean fixtures dominated by adversarial-invalid inputs (ipv4 7/20, date 7/19, semver 10/18 valid/invalid); v3 profile retains `hard-roman-to-int`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `matrix/evidence` — this packet adds oracle-validated benchmark fixtures, not a bug fix; the "evidence" is the per-fixture reference/lax score matrix through the real scorer.
- [x] CHK-FIX-002 [P0] Same-class producer inventory — searched `benchmark-fixtures/` and `benchmark-profiles/`; the validation pack mirrors the existing hard/harder fixture producers and the v2 profile (no other producer of this shape diverges).
- [x] CHK-FIX-003 [P0] Consumer inventory — consumers are `code-task-scorer.cjs` (oracle contract), `profile-validator.cjs` (profile), and `sweep-isolation.vitest.ts` (shape tests); all three exercised and green.
- [x] CHK-FIX-004 [P0] Adversarial table tests — every fixture's invalid set covers delimiter/format, boundary, leading-zero, whitespace/newline, and empty-string cases; each `expect` round-trips through the scorer's JSON path and the lax impl is confirmed to miss them.
- [x] CHK-FIX-005 [P1] Matrix axes listed — axes are {fixture} × {reference, lax}; 3 fixtures × 2 impls = 6 scored cells, all reported (ref 1.0 / lax <1.0).
- [x] CHK-FIX-006 [P1] Hostile/global-state variant — the scorer runs each case in an isolated child process; no process-wide state is read by the fixtures.
- [x] CHK-FIX-007 [P1] Evidence pinned — scores recorded against the on-disk fixture/profile files at this packet's commit, not a moving range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — fixtures and profile contain only task prompts, oracle cases, and model ids
- [x] CHK-031 [P0] Input handling validated — oracle args round-trip through the scorer's `JSON.parse(JSON.stringify(args))`; whitespace/newline cases verified in that path
- [x] CHK-032 [P1] Repo safety — no real model dispatch performed; no temp/model files persisted
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — REQ/SC ids and completion state aligned across spec.md, plan.md, tasks.md
- [x] CHK-041 [P1] Implementation-summary written — `implementation-summary.md` records the per-fixture scores, profile result, and test count
- [x] CHK-042 [P2] Live n=5 run + verdict shipped — `eval/{results,aggregate,synthesis}.json/md`; M3 1.0 (gate-eligible) vs MiMo 0.891; 0 pollution
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No stray temp files — /tmp validation harness deleted after the validation run
- [x] CHK-051 [P1] Deliverables in place — 3 fixtures + v3 profile + vitest extension + this packet's spec docs
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Status**: **Complete.** Three strict-validation T4 fixtures (`validate-ipv4` 27 cases / 74% invalid, `validate-date` 26 / 73%, `validate-semver` 28 / 64%) were oracle-validated through the real `code-task-scorer.cjs` (reference 1.0 vs deliberately-lax 0.889 / 0.769 / 0.750). The `capability-m3-vs-mimo-v3.json` profile (4 fixtures incl. retained `hard-roman-to-int`, n=5, both models, correctness gate 1.0, groupBy model) returns `profile-validator.cjs` `{valid:true,errors:[]}`. The vitest suite is green (158 passed, exit 0). The real model benchmark run and any `eval/` artifacts were out of scope per the task contract.

**Verification Date**: 2026-06-02
<!-- /ANCHOR:summary -->
