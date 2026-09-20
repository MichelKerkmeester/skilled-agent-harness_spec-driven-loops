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

- [x] T-01 Reused the `findAdvisorWorkspaceRoot`/pinned-regime pattern [evidence: vitest mirrors the parity suites' workspace-root resolution + the 002 force-local env]
- [x] T-02 Existing fixtures read; P0 ids sourced [evidence: `skill-advisor-regression-cases.jsonl` P0 skill rows referenced via `sourceCaseId`]
- [x] T-03 F22 re-probed against v4 [evidence: pinned-regime scorer ranks sk-doc top-1 here, not the 029 rank-3; encoded as a top-3 floor with a note]
- [x] T-04 `compiledRoute` shape confirmed [evidence: `compiled-route.cjs` → `{action, targets[].workflowMode}` for compiled hubs, `{servingAuthority:legacy}` otherwise]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-05 Authored the fixture spanning sk-doc/sk-git/system-deep-loop (+ system-spec-kit/mcp-tooling/sk-prompt) [evidence: `gate2-golden-prompts.jsonl`, 9 cases]
- [x] T-06 F22 case added [evidence: `golden-f22-parent-hub-scaffold`, top-3, `expectedSkillAny:["sk-doc"]`, `notes`; `expectedMode` omitted — sk-doc serves legacy]
- [x] T-07 P0 skill-kind ids via `sourceCaseId` [evidence: GIT/MEM/SPEC/CHROME rows]
- [x] T-08 Authored the vitest — **A' amendment**: real unmocked `scoreAdvisorPrompt` (pinned regime), not `handleAdvisorRecommend` (lean CI job has no deps); joined `compiled-route.cjs` mode assertion **skip-on-legacy** [evidence: 10/10 pass]
- [x] T-09 Wired as a **separate** `golden-prompt-gate` CI job (A' amendment: the lean step stays byte-identical) [evidence: `routing-registry-drift.yml` +1 job]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-10 Golden suite green [evidence: `npx vitest run tests/routing-golden-prompts.vitest.ts` → 10 passed (10), F22 at its true top-3]
- [x] T-11 Full four-file set green [evidence: combined run → 31 passed (31), no regression to the three pre-existing]
- [x] T-12 Not passing only on local state [evidence: real scorer + fresh symlinked build; CI job `npm ci`s from scratch — confirmable on first push]
- [ ] T-13 `validate.sh --strict` — **BLOCKED**: spec-kit orchestrator build broken repo-wide by a concurrent session's incomplete pi-hook relocation; verified by the direct vitest runs instead [documented]
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
