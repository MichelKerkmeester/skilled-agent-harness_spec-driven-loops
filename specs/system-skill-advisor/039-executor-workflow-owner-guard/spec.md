---
title: "Feature Specification: Keep a workflow skill above the CLI hub when a request names an executor, and clear the advisor's failing ratchet and inventory test"
description: "The advisor ranked the CLI hub above the deep-loop workflow skill whenever a prompt named an executor, against the rule that the executor is the HOW. The packet fixes that ordering, and records why the divergence ratchet and the skill-root inventory test failed on this machine."
trigger_phrases:
  - "executor workflow owner guard"
  - "keep a workflow skill above the cli hub"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Keep a workflow skill above the CLI hub when a request names an executor, and clear the advisor's failing ratchet and inventory test

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A prompt such as "run a deep research loop with the cli-pi executor" made the advisor rank `cli-external-orchestration` (confidence 0.95) above `system-deep-loop` (0.9248). The repo rule says the executor CLI is the HOW, runs inside the workflow, and never overrides the skill-owned route, so the caller was told to start a CLI dispatch instead of the deep-loop workflow it asked for. The same ordering hit "run a deep review with cli-codex as the executor". Two further tests also failed on this machine: the local-versus-native divergence ratchet (76 current divergences against 74 ledger entries) and the skill-root reader inventory test.

### Purpose
A prompt that names a workflow-owned route and an executor keeps the workflow skill first and lists the CLI hub directly under it, and the ratchet and inventory test describe the real cause of their failures instead of a bumped number.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Command, run before the change (`node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<prompt>"}' --format json`), recommendations in order as `skillId confidence`:

```text
run a deep research loop with the cli-pi executor
  cli-external-orchestration 0.95
  system-deep-loop           0.9248
  mcp-tooling                0.82
run a deep review with cli-codex as the executor
  cli-external-orchestration 0.95
  system-deep-loop           0.9324
  sk-code                    0.8259
```

Same command after the change, once the daemon served the rebuilt `dist/`:

```text
run a deep research loop with the cli-pi executor
  system-deep-loop           0.9248   (workflowMode research)
  cli-external-orchestration 0.9238   (workflowMode cli-pi)
run a deep review with cli-codex as the executor
  system-deep-loop           0.9324   (workflowMode review)
  cli-external-orchestration 0.9314   (workflowMode cli-codex)
  sk-code                    0.8259
```

Prompt `delegate this refactor to codex using gpt-6.1 terra`, scored on the old `executor-delegation.ts` from `HEAD` and on the new one by the same temporary probe: both returned `cli-external-orchestration:0.82:0.26`, then `sk-code:0.82:0.34`. `resolveExecutorDelegation` returns `null` for it on both, because the cue `delegate to` does not match "delegate this refactor to" and `codex` alone is not an alias, so the override never runs and the 0.82 is the hub's own fusion score. The other two plain delegations scored 0.95 on both.

Ratchet before: `cd .skilled/skills/system-skill-advisor/runtime && ./node_modules/.bin/vitest run tests/parity/local-native-divergence-ratchet.vitest.ts` printed `{"corpusSize":217,"labeled":195,"harder":22,"currentDivergences":76,"ledgerEntries":74}` and named `rr-iter3-066` (local=sk-code native=sk-doc, gold sk-doc) and `rr-iter3-075` (local=none native=system-spec-kit, gold system-spec-kit). With `SPECKIT_PRIVATE_SKILL_ROOTS` unset the same file passes 9 of 9.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Keep `system-deep-loop` or `system-spec-kit` first, with a real explicit-lane workflow match, and place the lifted CLI hub directly below with a lower confidence that still passes the threshold.
- Add tests next to the existing executor-delegation tests for the two workflow prompts and three plain delegation prompts.
- Make the divergence ratchet, its ledger capture script and the five other suites that pin counts on a clean checkout ignore private `local-*` skills linked from outside it.
- Confirm whether the Task 1 change moved the confidence of `delegate this refactor to codex using gpt-6.1 terra` (it did not; see Measured Behavior).
- Record the skill-root reader inventory fix made by another agent (see Files to Change).

### Out of Scope
- Changing any delegation prompt that names no workflow owner - it must behave exactly as before.
- Editing the divergence ledger - the two divergences are not accepted drift.
- Widening the delegation cue so `delegate this refactor to codex` matches the resolver - that prompt scored 0.82 before this packet and the cue regex is not part of the ask.
- `advisor-graph-health` and the other tests that exercise private skills or the live graph - they keep the variable.
- Restarting or signalling the shared advisor daemon - it belongs to other sessions.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts` | Modify | Workflow-owner guard in the route path of `applyExecutorDelegationOverride` |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation.vitest.ts` | Modify | Five new tests: two workflow-owned prompts, three plain delegations |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts` | Modify | Unset the private skill roots variable for the run and restore it afterwards |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs` | Modify | Same variable cleared so a recapture cannot record machine-private skills |
| `.skilled/skills/system-skill-advisor/runtime/tests/doctor-routing-slice.vitest.ts`, `tests/legacy/advisor-corpus-parity.vitest.ts`, `tests/parity/python-ts-parity.vitest.ts`, `tests/parity/holdout-independent.vitest.ts`, `tests/parity/scorer-eval-baseline-ratchet.vitest.ts` | Modify | Clear the private skill roots variable for the run and restore it afterwards |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs` | Modify (other agent) | Rule comment above `outsideSurfaces()` stating that its readdir follows `local-*` links on purpose |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-reader-inventory.test.cjs` | Modify (other agent) | `router-replay-lib.cjs` added to `RULED` as `include` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `scoreAdvisorPrompt("run a deep research loop with the cli-pi executor")` and `("run a deep review with cli-codex as the executor")` return `system-deep-loop` first and `cli-external-orchestration` second, the second passing the threshold with confidence strictly below the first. |
| REQ-002 | `delegate this refactor to codex using gpt-6.1 terra`, `run this task through opencode with gpt-6.1 terra` and `dispatch a pi agent on gpt-6.1 terra to review this file` still return `cli-external-orchestration` first. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The two new workflow-owned tests fail on the old `executor-delegation.ts` and pass on the new one. |
| REQ-004 | `local-native-divergence-ratchet.vitest.ts` passes 9 of 9 on this machine without a ledger edit, and the cause of the two divergences is named. |
| REQ-005 | `skill-root-reader-inventory.test.cjs` passes, with the fix recorded in this packet. |
| REQ-006 | Typecheck and build of the advisor runtime succeed, and the live CLI shows the new ordering. |
| REQ-007 | The five suites `doctor-routing-slice`, `advisor-corpus-parity`, `python-ts-parity`, `holdout-independent` and `scorer-eval-baseline-ratchet` pass with `SPECKIT_PRIVATE_SKILL_ROOTS` exported and unset, and `advisor-graph-health` keeps working with it set. |
| REQ-008 | Non-workflow delegation prompts keep the confidence they had before this packet, except the split-handoff phrasings that REQ-009 resolves. |
| REQ-009 | `delegate <object> to <executor>` and `hand <object> off to <executor>` resolve the executor (the codex prompt reaches the 0.95 lift with target `cli-codex`), while ordinary prose handoffs such as `delegate the decision to the team` and `hand off to QA` lift no CLI hub. |
| REQ-010 | The scorer eval baseline capture scores at a pinned, recorded date instead of the wall clock, so a recapture on any day reproduces the same numbers, and the ratchet replays that date. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The two workflow prompts print `system-deep-loop` then `cli-external-orchestration` from `advisor_recommend`.
- **SC-002**: The routing drift guard and both deep routing parity suites pass 21 of 21.
- **SC-003**: The full advisor vitest run goes from 7 failed to 0 failed, both with the variable exported and unset.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The long-lived advisor daemon serves the built `dist/` | A stale daemon keeps printing the old order | Rebuild with `npm run build`; a fresh `SPECKIT_IPC_SOCKET_DIR` proved the new code, and the shared daemon later served it too |
| Risk | The guard also fires for prompts where deep-loop or spec-kit has a side mention | Low | It needs a passing recommendation, an explicit-lane score of at least 0.55 and phrase, author or explicit evidence, the same floor the fusion scorer uses |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

N/A: the change is a pure in-memory reordering inside one function, it adds no service, storage or authentication surface.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no executor named, so the override returns the ranking unchanged and the guard never runs.
- Maximum input: a prompt naming both owners picks the first passing owner in ranking order; the other stays in `rest`.
- Failure path: a workflow owner that does not pass the threshold, or has no explicit-lane evidence, is ignored and the CLI hub is lifted to 0.95 as before.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One function in one module, one test file, one test setup line, one script line |
| Risk | 8/25 | Shared scorer output, mitigated by the unchanged delegation fixtures |
| Research | 8/20 | Bisecting the ratchet divergence across scorer commits and the environment |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The five private-skill suites were fixed in this packet at the operator's request; none of them exists to cover private skills.
<!-- /ANCHOR:questions -->

---

