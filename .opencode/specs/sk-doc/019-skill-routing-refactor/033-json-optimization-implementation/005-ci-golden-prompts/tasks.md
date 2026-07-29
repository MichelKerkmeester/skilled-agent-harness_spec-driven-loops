---
title: "Tasks: Gate-2 Golden-Prompt Acceptance Suite"
description: "Task breakdown for authoring the golden-prompt fixture, the joined parent-then-mode vitest suite, and wiring it into routing-registry-drift.yml."
trigger_phrases:
  - "gate-2 golden prompt suite tasks"
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
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/005-ci-golden-prompts"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Gate-2 Golden-Prompt Acceptance Suite

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T-01 Read the three already-wired vitest files (`routing-registry-drift-guard.vitest.ts`, `routing-parity-deep-skills.vitest.ts`, `routing-parity-deep-council.vitest.ts`) to reuse their `findAdvisorWorkspaceRoot`/repo-root-resolution pattern rather than re-deriving it
- [ ] T-02 Read the existing fixtures (`skill-advisor-regression-cases.jsonl`, `labeled-prompts.jsonl`, `007-sk-doc/fixtures/canary-cases.v1.json`) to confirm the new fixture schema does not duplicate an existing one, and to pull the P0 case ids to reference via `sourceCaseId`
- [ ] T-03 Re-run a live `advisor_recommend` probe on `scaffold a new parent skill hub with mode-registry` against the checked-out tree to re-confirm F22 (sk-prompt/sk-code above sk-doc, sk-doc rank 3, `ambiguous: true`) before encoding it as a fixture row — a research finding is a hypothesis until re-verified against current source
- [ ] T-04 Confirm the `compiledRoute` shape end to end (`advisor-recommend.ts` → `.opencode/bin/compiled-route.cjs` → `lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` → the target hub's `router.cjs`) so the joined assertion's field path (`compiledRoute.action`, `compiledRoute.targets[].workflowMode`) targets real, current fields
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T-05 Author `mcp-server/scripts/fixtures/gate2-golden-prompts.jsonl`: representative multi-hub cases spanning at minimum `sk-doc` (create-skill), `sk-git`, and `system-deep-loop` (research)
- [ ] T-06 Add the reproduced live-miss case (`scaffold a new parent skill hub with mode-registry`) to the fixture at `tier: "top3"` with `expectedSkillAny: ["sk-doc"]`, `expectedMode: "create-skill-parent"`, and a `notes` field citing the 3/3-agreed research finding
- [ ] T-07 Add every existing P0-priority case id from `skill-advisor-regression-cases.jsonl` to the fixture via `sourceCaseId` (no re-authoring of the prompt text)
- [ ] T-08 Author `mcp-server/tests/routing-golden-prompts.vitest.ts`: load the fixture, call the real unmocked `handleAdvisorRecommend` per case, assert top-1/top-3 per case `tier`, and assert the joined `compiledRoute.action === 'route'` + `compiledRoute.targets[].workflowMode === expectedMode` for every case that declares `expectedMode`
- [ ] T-09 Extend `routing-registry-drift.yml`'s "Routing-registry drift-guard + parity suites" step to append `tests/routing-golden-prompts.vitest.ts` to the existing `npx --yes vitest@4.0.18 run` invocation
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-10 Run `npx vitest run tests/routing-golden-prompts.vitest.ts` locally from `mcp-server/`; confirm every fixture case passes against the current fleet, including the F22 case at its true top-3 (not top-1) rank
- [ ] T-11 Run the full four-file `routing-drift` vitest set together (`routing-registry-drift-guard.vitest.ts routing-parity-deep-skills.vitest.ts routing-parity-deep-council.vitest.ts routing-golden-prompts.vitest.ts`); confirm no regression to the three pre-existing suites
- [ ] T-12 Dry-run the exact CI command from a clean `mcp-server` working directory (no dev-session cache/state) to confirm the suite is not passing only because of local state
- [ ] T-13 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` on this phase folder; confirm Errors:0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

`gate2-golden-prompts.jsonl` and `tests/routing-golden-prompts.vitest.ts` exist and pass locally against the current fleet; the new suite is wired into `routing-registry-drift.yml`'s existing `routing-drift` job with no `paths:` trigger edit needed; the three pre-existing vitest files in the same step still pass; the reproduced live-miss case asserts top-3 (not top-1) with cited evidence; every reused fixture case carries a `sourceCaseId`; `validate.sh --strict` on this folder reports Errors:0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

Spec `spec.md` · Plan `plan.md` · QA `checklist.md` · Research `../../029-skill-json-optimization-research/research/research.md` (§2 theme 3, §3 O3) · Live-miss evidence `../../029-skill-json-optimization-research/research/lineages/grok-high/iterations/iteration-004.md` (F22)
<!-- /ANCHOR:cross-refs -->
