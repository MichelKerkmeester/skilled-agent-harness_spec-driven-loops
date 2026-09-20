---
title: "Implementation Plan: Gate-2 Golden-Prompt Acceptance Suite"
description: "Architecture and phased approach for a new joined parent-then-mode golden-prompt vitest suite, wired into the existing routing-registry-drift.yml CI job, with a rollback plan for the CI-blocking change."
trigger_phrases:
  - "gate-2 golden prompt suite plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/005-ci-golden-prompts"
    last_updated_at: "2026-07-29T09:05:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "Depends on 002 (routing-accuracy corpus hash pinned) for fixture provenance only"
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/005-ci-golden-prompts"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Gate-2 Golden-Prompt Acceptance Suite

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Add one new fixture file and one new vitest file that together prove a golden set of representative prompts route to the correct parent hub (top-1 or top-3, per case) and — for compiled-routing-eligible hubs — to the correct compiled mode, in a single joined test. Wire the new vitest file into the existing `routing-drift` CI job's already-established multi-file vitest step. No production code, scorer, or compiled-routing engine is touched; this phase is additive test/fixture infrastructure only, grounded in the 029 research's 3/3-agreed "no Gate-2 golden-prompt tests in CI" finding and its live-miss reproduction.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Bar |
|------|-----|
| Real-path assertion | The suite calls `handleAdvisorRecommend` unmocked; no scorer or compiled-route stub |
| Joined proof | Every compiled-routing-eligible fixture case asserts BOTH the winning skill AND its `compiledRoute.targets[].workflowMode` in one test, not two separate suites |
| Regression floor, not a fix | The reproduced live-miss case asserts the fleet's true current rank (top-3); it is not weakened to "any rank" nor tightened to top-1 |
| No duplicate fixture authority | Every case reused from `skill-advisor-regression-cases.jsonl` or `labeled-prompts.jsonl` carries a `sourceCaseId`; only genuinely new joined-mode cases are freshly authored |
| CI parity | The three pre-existing vitest files in the same step (`routing-registry-drift-guard`, `routing-parity-deep-skills`, `routing-parity-deep-council`) still pass unchanged |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Two new files, one one-line CI-step edit:

1. **Fixture** — `.opencode/skills/system-skill-advisor/mcp-server/scripts/fixtures/gate2-golden-prompts.jsonl`. One JSON object per line: `{id, prompt, tier: "top1"|"top3", expectedSkillAny: string[], expectedMode?: string, sourceCaseId?: string, priority: "P0"|"P1", notes?: string}`. `expectedMode` is set only when `expectedSkillAny`'s skill is in `COMPILED_ROUTING_HUBS` (`sk-code`, `mcp-tooling`, `system-deep-loop`, `cli-external-orchestration`, `sk-prompt`, `sk-design`, `sk-doc`); it names the expected `workflowMode`, e.g. `create-skill-parent` for the reproduced scaffold prompt or `research` for a deep-research prompt (mirrors the `DeepMode` union already used by `routing-parity-deep-skills.vitest.ts`).

2. **Vitest suite** — `.opencode/skills/system-skill-advisor/mcp-server/tests/routing-golden-prompts.vitest.ts`. For each fixture row: call `handleAdvisorRecommend({ prompt, workspaceRoot: repoRoot })` (the same handler `advisor_recommend` calls in production), parse the JSON response body, then:
   - `tier: "top1"` → `recommendations[0].skillId` must be in `expectedSkillAny`.
   - `tier: "top3"` → `recommendations.slice(0, 3).map(r => r.skillId)` must intersect `expectedSkillAny`.
   - `expectedMode` present → locate the recommendation whose `skillId` is in `expectedSkillAny`; assert `recommendation.compiledRoute?.action === 'route'` and `recommendation.compiledRoute.targets.some(t => t.workflowMode === expectedMode)`. This exercises the exact chain `advisor-recommend.ts` → `.opencode/bin/compiled-route.cjs` → `lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` → the per-hub compiled `router.cjs`'s `route()` function, which returns `decision.route.targets[].destinationId.workflowMode`, normalized by `compiled-route.cjs`'s `normalizeTargets` into the `targets` array the test reads.

3. **CI wiring** — one line added to `routing-registry-drift.yml`'s existing `npx --yes vitest@4.0.18 run tests/routing-registry-drift-guard.vitest.ts tests/routing-parity-deep-skills.vitest.ts tests/routing-parity-deep-council.vitest.ts` invocation, appending `tests/routing-golden-prompts.vitest.ts`. No `paths:` trigger edit — both new files already fall under the existing `.opencode/skills/system-skill-advisor/mcp-server/**` glob present in both the `push` and `pull_request` blocks.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Read the three already-wired vitest files plus the existing fixtures (`skill-advisor-regression-cases.jsonl`, `labeled-prompts.jsonl`, `007-sk-doc/fixtures/canary-cases.v1.json`) so the new fixture schema does not duplicate an existing one; re-confirm the F22 live-miss citation with a fresh `advisor_recommend` probe against the checked-out tree (findings are hypotheses until re-verified against current source); re-confirm the `compiledRoute` shape (`compiled-route.cjs`, `resolve.cjs`, the target hub's `router.cjs`) so the joined assertion targets real fields.

### Phase 2: Implementation

Author `gate2-golden-prompts.jsonl` with representative multi-hub cases (`sk-doc`/create-skill, `sk-git`, `system-deep-loop`/research, at minimum) plus the reproduced F22 case at its true top-3 rank plus every P0 id already in `skill-advisor-regression-cases.jsonl` referenced by `sourceCaseId`; author `tests/routing-golden-prompts.vitest.ts` implementing the per-tier and joined-mode assertions described in §3; extend the CI step's vitest invocation with the new file.

### Phase 3: Verification

Run `npx vitest run tests/routing-golden-prompts.vitest.ts` locally and confirm every case passes against the current fleet, including the intentionally-top-3-not-top-1 F22 case; run the full existing four-file `routing-drift` vitest set together to confirm no regression to the three pre-existing suites; run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` on the phase folder itself.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The deliverable IS the test suite, so "testing" here means proving the suite itself is trustworthy before it goes CI-blocking: (1) every fixture case is run once against the live fleet and its actual outcome recorded before the assertion is written, so no case asserts an aspirational outcome the fleet does not currently produce; (2) the reproduced live-miss case is deliberately run to confirm it currently lands at rank 3 (not rank 1, not outside top-3) before locking in the top-3 assertion, so the floor is calibrated to reality rather than guessed; (3) the full four-file vitest set (three pre-existing + this new one) is run together locally to catch any cross-file interference (shared temp dirs, cache state) before the CI edit lands; (4) a manual dry run of the exact CI command (`npx --yes vitest@4.0.18 run <four files>`) from a clean `mcp-server` working directory confirms the suite passes outside the author's dev-session state.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`002-baseline-capture` for fixture provenance (referencing pinned `labeled-prompts.jsonl` rows by id rather than re-authoring); the existing `routing-drift` CI job in `routing-registry-drift.yml`; `handleAdvisorRecommend` (`handlers/advisor-recommend.ts`) and its compiled-routing enrichment path (`.opencode/bin/compiled-route.cjs` → `lib/compiled-routing/014-runtime-engine/`); no dependency on Phase 1 (derived-authority decision) or on `006-ci-compiler-accuracy-gates`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase is CI-blocking (a bad assertion can stall any PR that touches the routing surface), so it ships with an explicit, single-step rollback: revert the one line added to `routing-registry-drift.yml`'s vitest invocation (removing `tests/routing-golden-prompts.vitest.ts` from the run list restores the job to exactly its pre-phase three-file behavior with no other edit). The fixture and vitest files themselves are net-new and can be deleted independently without touching any of the three pre-existing gates, the advisor scorer, the compiled-routing engine, or any hub's `mode-registry.json`. Because no production or runtime code is modified by this phase, rollback carries zero risk to `advisor_recommend`'s live behavior — only to whether this specific regression floor is enforced in CI.
<!-- /ANCHOR:rollback -->
