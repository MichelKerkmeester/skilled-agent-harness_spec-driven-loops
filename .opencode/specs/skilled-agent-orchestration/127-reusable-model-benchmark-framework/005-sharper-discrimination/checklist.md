---
title: "Verification Checklist: Sharper discrimination — harder non-saturating fixtures + n=5 CI-certified M3-vs-MiMo margin"
description: "Verification Date: in progress (de-risk run + full run + synthesis pending)"
trigger_phrases:
  - "sharper discrimination checklist"
  - "harder fixtures verification"
  - "n=5 ci-certified verdict checklist"
  - "anti-saturation verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/127-reusable-model-benchmark-framework/005-sharper-discrimination"
    last_updated_at: "2026-06-02T10:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Fixture build verified: oracles 1.0 vs 0.33/0.79/0.42; profile valid; 153 tests green"
    next_safe_action: "Run de-risk sweep (n=2, 16 cells) to confirm non-saturation before the full run"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures"
      - ".opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles/capability-m3-vs-mimo-v2.json"
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/tests/sweep-isolation.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "checklist-127-005"
      parent_session_id: null
    completion_pct: 50
    open_questions:
      - "Will the harder fixtures discriminate on capability or only surface reliability variance? The de-risk run answers this."
      - "Is n=5 enough for the paired-bootstrap CI to certify, or is n=8+ needed?"
    answered_questions: []
---
# Verification Checklist: Sharper discrimination

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
- [x] CHK-002 [P0] Technical approach defined in plan.md (harder fixtures + n=5 profile + CI-gated sharper run)
- [x] CHK-003 [P1] Dependencies identified and available (004 fixtures + cwd-isolation; 003 paired-bootstrap CI; real `code-task-scorer.cjs`)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Tests pass — `cd .opencode/skills/deep-improvement/scripts && npx vitest run model-benchmark/tests/` → 153 passed, exit 0
- [ ] CHK-011 [P0] No new repo pollution from the live run — confirm `git status` untracked set unchanged after the full n=5 run (cwd-isolation inherited from 004) (pending the run)
- [x] CHK-012 [P1] Profile valid — `profile-validator.cjs` on `capability-m3-vs-mimo-v2.json` → valid (4 fixtures, samplesPerCell 5, correctness gate 1.0, groupBy model)
- [x] CHK-013 [P1] Code follows project patterns — additive fixture pack + profile reusing the 004 harness; "return ONLY the function source as text; do NOT write files" framing on every new fixture
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met — REQ-002 (validated oracles) done; REQ-001 (≥2 fixtures do not saturate), REQ-003 (n=5 CI verdict), REQ-004 (repo clean + green) pending the de-risk + full run
- [x] CHK-021 [P0] Build + fixture-shape testing complete — suite 153 passed exit 0; new fixtures parse and carry 24 oracle cases each (SC-001)
- [x] CHK-022 [P1] Oracle / partial-credit cases validated through the real `code-task-scorer.cjs` — reference 1.0 vs deliberately-wrong <1.0: `harder-semver-compare` 1.0/0.33, `harder-normalize-path` 1.0/0.79, `harder-int-to-words` 1.0/0.42
- [x] CHK-023 [P1] Harder fixture pack created — 3 T4 fixtures with 24 adversarial oracle cases each, kept `hard-roman-to-int` (the one that discriminated), dropped the 3 saturated 004 fixtures from the sharper profile
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] N/A — this phase is purely additive (new fixtures + profile), not a bug fix; no finding-class / producer / consumer inventory applies
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — fixtures and profile contain only task prompts, oracle cases, and model ids
- [x] CHK-031 [P0] Input handling validated — model responses scored by the real scorer; a write-only / non-extractable response scores as a correctness miss (honest)
- [ ] CHK-032 [P1] Repo safety enforced — confirm agentic model file-writes stay confined to the per-cell temp dir (before/after untracked diff) on the full run (pending the run)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — REQ/SC ids and build-vs-superseded state aligned across spec.md, plan.md, tasks.md
- [x] CHK-041 [P1] Implementation-summary written — `implementation-summary.md` records the saturation finding + the de-risk gate decision + the pivot to 006
- [x] CHK-042 [P2] Sharper synthesis — the negative-result synthesis lives in `implementation-summary.md` (no `eval/synthesis.md`; the CI-certified verdict is carried by 006 with the validation pack)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No stray temp files — de-risk confirmed model writes stay isolated (0 new untracked, before/after diff)
- [x] CHK-051 [P1] `eval/` — intentionally empty for this phase; no full run fired (de-risk gate → pivot to 006). The `eval/` artifacts live in 006
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 5/6 |
| P1 Items | 8 | 7/8 |
| P2 Items | 1 | 1/1 |

**Status**: **Complete — negative result.** Build verified: 3 harder T4 fixtures oracle-validated (semver 1.0/0.33, path 1.0/0.79, words 1.0/0.42), v2 profile valid, suite green (153). The **n=2 de-risk ran** (16 cells, **0 pollution, 0 orphans**) and all 3 computational fixtures **saturated** (both models 1.0). Per the de-risk gate, the full n=5 run was **deliberately NOT fired** (foregone tie) — the effort pivoted to validation-heavy fixtures in **006**. SC-002's gate fired with a negative answer (saturated → iterate); the CI verdict (SC-003) is carried by 006. `implementation-summary.md` records the full finding. The one open P0 (CHK-020 full acceptance) is intentionally superseded, not pending.

**Verification Date**: 2026-06-02 (build + de-risk; full run intentionally superseded by 006)
<!-- /ANCHOR:summary -->
