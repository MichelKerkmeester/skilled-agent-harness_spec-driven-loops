---
title: "Feature Specification: Gate-2 Golden-Prompt Acceptance Suite"
description: "Add a joined parent-then-mode golden-prompt acceptance suite to routing-registry-drift.yml, grounded in a live 029 research miss (a parent-hub scaffold prompt ranked sk-prompt above sk-doc); asserts top-1/top-3 skill selection plus compiled-route mode selection for representative prompts (create-skill, git, deep-research), independent of the O1 derived-authority decision."
trigger_phrases:
  - "gate-2 golden prompt suite"
  - "golden prompt acceptance ci"
  - "joined parent mode routing test"
importance_tier: "important"
contextType: "specification"
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
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/005-ci-golden-prompts"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Exact fixture case count and the full representative-hub list beyond the three named here (sk-doc, sk-git, system-deep-loop) — left to implementation time"
      - "Whether to mirror the regression corpus's expect_kind/allow_command_bridge fields or keep the new fixture schema minimal — resolved at implementation time"
    answered_questions:
      - "This phase does NOT need Phase 1's derived-authority decision and can be built against the current fleet immediately, per the 029 research O3 framing"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Gate-2 Golden-Prompt Acceptance Suite

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-29 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor/033-json-optimization-implementation` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

`routing-registry-drift.yml`'s `routing-drift` job already gates the H/S class presence contract, generated-manifest freshness, and compiled-routing freshness — but no CI step ever calls `advisor_recommend` against a labeled prompt and asserts the outcome. The 029 research packet found this gap independently in all three lineages (3/3 agreement, research theme 3: "no Gate-2 acceptance/golden-prompt tests in CI (joined parent→mode); a live selection miss exists") and grok-high grounded it in a concrete symptom: a live `advisor_recommend` probe on `scaffold a new parent skill hub with mode-registry` ranked `sk-prompt` first (0.691, `explicit_author` lane) and `sk-code` second (0.687), with the correct hub `sk-doc` only third (0.654, `ambiguous: true`) — even though `sk-doc`'s compiled route correctly resolves to `create-skill-parent` once selected. The existing test surface only partially covers this: `skill-advisor-regression-cases.jsonl` has one generic sk-doc case (`P1-DOC-001`, a plain documentation prompt, not a parent-hub scaffold prompt) and asserts top-1 skill only, never the downstream mode; the per-hub `canary-cases.v1.json` fixtures (e.g. `007-sk-doc/fixtures/canary-cases.v1.json`) do assert joined parent→mode outcomes but are a local dev harness under a spec-folder tree that no GitHub workflow ever invokes. This phase closes that seam: it adds a CI-wired golden-prompt suite that (a) asserts top-1/top-3 skill selection for representative prompts across multiple hubs, and (b) for compiled-routing-eligible hubs, asserts the joined mode-level outcome in the same test — including a fixture case that reproduces the live miss as an explicit regression floor.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope — a new fixture file of representative golden prompts spanning multiple hubs (at minimum `sk-doc`/create-skill, `sk-git`, and `system-deep-loop`/research, per the task framing "create-skill, git, deep-research, etc."); a new vitest suite that loads the fixture and calls the real, unmocked `handleAdvisorRecommend` handler for each case, asserting top-1 or top-3 skill selection per case and — for cases whose expected skill is in `COMPILED_ROUTING_HUBS` and that declare an `expectedMode` — asserting the joined mode-level outcome via the recommendation's attached `compiledRoute`; a fixture case that reproduces the 029 live miss (the `scaffold a new parent skill hub with mode-registry` prompt) as a top-3 regression floor; wiring the new suite into `routing-registry-drift.yml`'s existing `routing-drift` job so it runs on every push/PR that already triggers that job.

Out of scope — fixing the ranking itself (moving `sk-doc` from #3 to #1 on the reproduced prompt is 029's O6, intent-signal quality, a separate phase); picking the canonical `derived` producer (029's O1, Phase 1 of this program — this phase explicitly does not depend on it); wiring `skill_graph_compiler.py` or `score-routing-corpus.py` into CI (029's O4, phase `006-ci-compiler-accuracy-gates`); changing the advisor scorer, the compiled-routing engine, or any hub's `mode-registry.json`/`hub-router.json`; adding new corpus rows to the pinned `labeled-prompts.jsonl` (that is 002's territory — this phase only references existing rows by id).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A new Gate-2 golden-prompt fixture covers representative multi-hub prompts | `gate2-golden-prompts.jsonl` (new file under `mcp-server/scripts/fixtures/`) contains cases whose expected skill spans at least `sk-doc`, `sk-git`, and `system-deep-loop`, plus every existing P0-priority case id already present in `skill-advisor-regression-cases.jsonl` — referenced by a `sourceCaseId` field, not re-authored |
| REQ-002 | The live parent-hub selection miss is reproduced as a regression floor, not silently re-baselined away | A fixture case using the exact F22 probe prompt (`scaffold a new parent skill hub with mode-registry`) asserts `sk-doc` is in the recommendation **top-3**, with an inline `notes` field citing the 3/3-agreed research finding; it is deliberately NOT asserted top-1 in this phase, because tightening the ranking itself is 029's O6 (intent-signal quality), out of scope here |
| REQ-003 | Joined parent-then-mode selection is proven, not just parent selection | For every fixture case whose expected skill is in `COMPILED_ROUTING_HUBS` (`lib/compiled-routing-flag.ts`) and declares an `expectedMode`, the suite asserts the matching recommendation's `compiledRoute.action === 'route'` and `compiledRoute.targets` contains an entry whose `workflowMode` equals `expectedMode` |
| REQ-004 | The suite exercises the real, unmocked routing path | `tests/routing-golden-prompts.vitest.ts` imports and calls `handleAdvisorRecommend` directly with no `vi.mock` on the scorer (`lib/scorer/fusion.js`) or the compiled-route subprocess, so it runs the identical code path production `advisor_recommend` calls use — the same shape of real-path test `routing-parity-deep-skills.vitest.ts` already uses for the deep-loop hub |
| REQ-005 | The suite runs in CI on every relevant push/PR | `routing-registry-drift.yml`'s `routing-drift` job's existing "Routing-registry drift-guard + parity suites" step is extended to include `tests/routing-golden-prompts.vitest.ts` alongside the three already-wired files; no `paths:` trigger edit is required because both new files fall under the existing `.opencode/skills/system-skill-advisor/mcp-server/**` glob already present in both the `push` and `pull_request` trigger blocks |
| REQ-006 | No regression to already-wired CI suites | `routing-registry-drift-guard.vitest.ts`, `routing-parity-deep-skills.vitest.ts`, and `routing-parity-deep-council.vitest.ts` continue to pass unchanged after this phase lands |
| REQ-007 | Fixture provenance is documented, not duplicated | Every fixture case lifted from `skill-advisor-regression-cases.jsonl` or the pinned `labeled-prompts.jsonl` carries a `sourceCaseId` pointing at the original row; only the joined-mode assertion cases (which no existing fixture covers) are newly authored prompts |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

`tests/routing-golden-prompts.vitest.ts` exists, runs the unmocked `handleAdvisorRecommend` path, and passes locally against the current fleet for every fixture case — including the reproduced live-miss case at its true current top-3 (not top-1) rank; the suite is wired into `routing-registry-drift.yml`'s `routing-drift` job and runs alongside the three pre-existing vitest files with no `paths:` trigger change needed; every joined-mode case's `compiledRoute.targets[].workflowMode` assertion is verified against the real compiled-routing engine output, not a mocked stand-in; the three pre-existing CI suites remain green; fixture provenance (`sourceCaseId`) is traceable for every reused case.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | `compiled-route.cjs` subprocess spawn (5s timeout per recommendation, per `advisor-recommend.ts`) adds latency/flakiness to the CI job | The same subprocess path is already unmocked in production `advisor_recommend`; keep the fixture representative rather than exhaustive so total suite runtime stays comparable to the three existing vitest files in the same step |
| Risk | Locking in the current "top-3, not top-1" F22 ranking could later be misread as accepting a known-wrong #1 as final | REQ-002's acceptance criteria and the fixture row's `notes` field both cite the 3/3-agreed research finding and name O6 as the actual fix; this phase ships a floor against future regression, not a ranking fix |
| Risk | A future scorer/derived change (O1/O5/O6/O8) could move `COMPILED_ROUTING_HUBS` membership or rename a `workflowMode`, silently breaking the joined assertions | The suite imports `COMPILED_ROUTING_HUBS` from `lib/compiled-routing-flag.ts` at test time rather than hardcoding a duplicate hub list, so hub-membership drift fails the assertion loudly instead of silently no-op'ing |
| Risk | A miscalibrated fixture case could block unrelated PRs that merely touch the routing surface | Fully additive change (new fixture + new test file + one line in an existing CI step); see the rollback plan in `plan.md` §7 for a single-line revert that removes the new suite from the CI gate without touching the three pre-existing steps |
| Dependency | `002-baseline-capture` (pinned routing-accuracy corpus) | Reused for fixture provenance only — cases sourced from `labeled-prompts.jsonl`/`skill-advisor-regression-cases.jsonl` are referenced by `sourceCaseId` rather than re-authored, so this suite does not become a second, independently-drifting definition of "golden" (per 029 §4's warning that unpinned baselines are version-sensitive) |
| Dependency | The existing `routing-drift` CI job and its three already-wired vitest files | This phase extends that job's existing step rather than adding a new CI job, matching the established pattern |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Exact fixture case count and the full representative-hub list beyond the three named here (`sk-doc`, `sk-git`, `system-deep-loop`) — left to implementation time, informed by the P0 rows already present in `skill-advisor-regression-cases.jsonl`.
- Whether to mirror the regression corpus's `expect_kind`/`allow_command_bridge`-style fields in the new fixture schema, or keep it minimal to just `{id, prompt, tier, expectedSkillAny, expectedMode?, sourceCaseId?, priority, notes}` — resolved at implementation time.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research this phase implements**: `../../029-skill-json-optimization-research/research/research.md` (§2 theme 3, §3 O3)
- **Live-miss source evidence**: `../../029-skill-json-optimization-research/research/lineages/grok-high/iterations/iteration-004.md` (F22)
- **Program parent**: `sk-doc/019-skill-routing-refactor/033-json-optimization-implementation`
- **Existing pattern to mirror**: `.opencode/skills/system-skill-advisor/mcp-server/tests/routing-parity-deep-skills.vitest.ts`
- **Workflow under change**: `.github/workflows/routing-registry-drift.yml`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **QA**: See `checklist.md`

## Structural phase links

| **Parent Spec** | `../spec.md` |
| **Predecessor** | `004-scaffold-journey` |
| **Successor** | `006-ci-compiler-accuracy-gates` |
