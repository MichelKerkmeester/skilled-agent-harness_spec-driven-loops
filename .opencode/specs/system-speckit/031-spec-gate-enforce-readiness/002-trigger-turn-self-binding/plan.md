---
title: "Implementation Plan: Trigger-turn self-binding for the spec-gate"
description: "Bind the spec-gate as satisfied on the triggering turn when the prompt already names a valid folder, and thread ClassificationOptions into classifyPrompt so prebound/command-contract contexts resolve. Core-only change in spec-gate-core.mjs plus tests; the shared classifier and dist are untouched."
trigger_phrases:
  - "spec gate self binding plan"
  - "classifyIntent options threading"
  - "trigger turn binding approach"
  - "gate-3 satisfiedBy resolution"
  - "spec-gate-core plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/031-spec-gate-enforce-readiness/002-trigger-turn-self-binding"
    last_updated_at: "2026-07-11T11:05:57.148Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level-2 plan for trigger-turn self-binding"
    next_safe_action: "Implement the self-binding block and options threading in classifyIntent"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs"
      - ".opencode/skills/system-spec-kit/shared/gate-3-classifier.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-trigger-turn-self-binding"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Trigger-turn self-binding for the spec-gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM (`.mjs`) |
| **Framework** | node:test runner; shared Gate-3 classifier (TS compiled to dist ESM) |
| **Storage** | Atomic per-session JSON state files under `.opencode/skills/.spec-gate-state` |
| **Testing** | `node --test spec-gate-core.test.mjs` (`--experimental-test-module-mocks` for mock cases) |

### Overview
In `classifyIntent`, after `classifyPrompt` reports `triggersGate3`, resolve a binding on the SAME turn two ways before falling back to opening the gate: (1) extract a spec-path or `NNN-slug` token from the triggering prompt and, if `validateSpecFolderBinding` accepts it, persist `satisfied`; (2) thread the request's `ClassificationOptions` into `classifyPrompt` and, when the classifier returns `triggersGate3` true with `requiresGate3Prompt` false (non-null `satisfiedBy`), persist `satisfied`. Both are additive to the existing open path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Runtime-neutral core policy consumed by thin transport adapters (OpenCode plugin + two Claude hooks). This phase touches only the core classify entrypoint.

### Key Components
- **`classifyIntent()` (`spec-gate-core.mjs:481-542`)**: the one classify entrypoint; the self-binding block and options threading go inside its existing `try` (lines 489-530), immediately after `classifyPrompt` reports `triggersGate3` (currently lines 522-528).
- **`extractSpecFolderCandidate()` (new core helper)**: returns a spec-path token (`SPEC_PATH_REGEX`, `spec-gate-core.mjs:331`) or a bare `NNN-slug` token (`BARE_FOLDER_TOKEN_REGEX`, `spec-gate-core.mjs:332`) from a trigger prompt, with no letter/skip logic - distinct from `answerParse` (`spec-gate-core.mjs:354-380`).
- **`validateSpecFolderBinding()` (shared, `gate-3-classifier.ts:595-618`)**: the sole authority that decides whether a token binds; called with `{ workspaceRoot: dir }` so it resolves against the core's `projectDir`.
- **`classifyPrompt(prompt, options)` / `applyGate3Satisfaction` (shared, `gate-3-classifier.ts:838-844,652-684`)**: consumed as-is to resolve prebound/command-contract satisfaction.

### Data Flow
Prompt -> `classifyPrompt(prompt, options)` -> if `triggersGate3`: (A) if `requiresGate3Prompt` false and `satisfiedBy` set -> persist `satisfied`; else (B) `extractSpecFolderCandidate(prompt)` -> `validateSpecFolderBinding` valid -> persist `satisfied`; else persist `open` and return the question. Non-triggering prompts and already-satisfied/skipped/open states keep their current paths.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `classifyIntent()` `spec-gate-core.mjs:481-542` | On trigger opens gate (`:523-528`); calls `classifyPrompt(prompt)` with no options (`:522`) | update: add self-binding + thread options | new unit + module-mock tests; existing golden loop (`spec-gate-core.test.mjs:48-90`) |
| new `extractSpecFolderCandidate()` (core) | none | create: token extractor for trigger prompts | new unit test; adversarial token cases |
| `answerParse()` `spec-gate-core.mjs:354-380` | Parses answers only when `isOpen` | unchanged: `isOpen` contract preserved | corpus tests stay green (`spec-gate-core.test.mjs:514-538,694-702`) |
| `evaluateMutation()` `spec-gate-core.mjs:557-590` | Deny only open+enforce+write/edit+non-exempt | unchanged (not a consumer of this change) | deny-matrix `denyCount==2` (`spec-gate-core.test.mjs:306-347`); HIGHEST BLAST proof |
| `gate-3-classifier.ts` / `shared/dist` | Exposes `classifyPrompt(prompt, options)`, `validateSpecFolderBinding`, `applyGate3Satisfaction` | not a consumer to change - used as-is, no rebuild | `git diff` shows no `shared/` edits |
| `mk-spec-gate.js:208-213`, `spec-gate-classify.mjs:38` | Pass `{prompt,sessionID,projectDir,env}` | unchanged in this phase; options population is follow-on | plugin/hook behavior unchanged; default-export-only + no stdout |

Required inventories:
- Same-class producers: `rg -n "status: 'satisfied'" .opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs` (today one site at `:507`; after the fix, the self-binding and options-satisfied sites are added).
- Consumers of changed symbols: `rg -n 'classifyIntent|classifyPrompt|validateSpecFolderBinding' .opencode/skills/system-spec-kit/runtime .opencode/plugins/mk-spec-gate.js --glob '*.mjs' --glob '*.js'`.
- Matrix axes: `triggersGate3` x prompt-token {none, path-valid, path-invalid, NNN-valid, NNN-invalid, traversal, ambiguous} x options {none, INTERACTIVE+prior_answer, AUTONOMOUS+contract, invalid} x prior-state {fresh, open, satisfied, skipped}.
- Algorithm invariant: `extractSpecFolderCandidate` may surface a token, but only `validateSpecFolderBinding` decides a bind; any token that does not resolve to a real, valid, in-tree, non-deprecated spec folder MUST fall through to opening the gate. Adversarial cases: `404-not-found` false positive, `../etc` traversal, ambiguous bare slug, deprecated/superseded status, phase-parent without active child.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the classifier dist already exports `classifyPrompt(prompt, options)` and `validateSpecFolderBinding` (no rebuild needed)
- [ ] Confirm the baseline test suite is green before changes
- [ ] Confirm `answerParse` and `SPEC_PATH_REGEX`/`BARE_FOLDER_TOKEN_REGEX` reuse boundaries

### Phase 2: Core Implementation
- [ ] Add `extractSpecFolderCandidate()` helper (path token, then bare `NNN-slug`; no letter/skip logic)
- [ ] Thread `request.classificationOptions` into `classifyPrompt` and map `triggersGate3 && !requiresGate3Prompt && satisfiedBy` to a `satisfied` persist
- [ ] Add the self-binding branch: on `triggersGate3`, try options-satisfaction, then token self-binding via `validateSpecFolderBinding`, else open as today

### Phase 3: Verification
- [ ] Extend `spec-gate-core.test.mjs` with self-binding, options-threading (module-mock), and regression cases
- [ ] Run `node --test` and `node --experimental-test-module-mocks --test`
- [ ] Confirm no `shared/`/`mcp_server/` edits and comment hygiene
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `extractSpecFolderCandidate`, self-binding via real classifier + tmpdir folder | node:test |
| Integration | Golden loop: trigger+folder -> satisfied -> Write allowed under enforce | node:test |
| Manual | Module-mock of classifier for the options `satisfiedBy` mapping | node --experimental-test-module-mocks |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Shared Gate-3 classifier dist | Internal | Green | Options threading needs the already-compiled `classifyPrompt(prompt, options)`; no rebuild required |
| Phase 003 `prior_answer` acceptance | Internal | Yellow | Shared binding-validation entrypoint; strictness of self-binding tracks 003 |
| Phase 001 telemetry | Internal | Yellow | Must tolerate a satisfied-on-trigger outcome with no advise/deny event |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A self-binding regression denies or wrongly closes a real flow, or a test fails post-merge.
- **Procedure**: `git revert` the phase commit; `classifyIntent` reverts to open-on-trigger with no options threading. Because the change only closes the gate more often, reverting cannot introduce a new deny.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5-1 hour |
| Core Implementation | Med | 2-4 hours |
| Verification | Med | 1-2 hours |
| **Total** | | **3.5-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline test suite green captured before changes
- [ ] `MK_SPEC_GATE_ENFORCE` kept default-off during rollout
- [ ] Kill-switch `MK_SPEC_GATE_DISABLED=1` verified as a full no-op

### Rollback Procedure
1. Leave `MK_SPEC_GATE_ENFORCE` unset (advise-only) so no deny is possible during investigation.
2. `git revert` the phase commit for `spec-gate-core.mjs` and its test.
3. Re-run `node --test spec-gate-core.test.mjs` to confirm the reverted baseline.
4. No stakeholder notification needed; behavior returns to open-on-trigger.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - only per-session state files are written, which age out via the existing sweep.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
