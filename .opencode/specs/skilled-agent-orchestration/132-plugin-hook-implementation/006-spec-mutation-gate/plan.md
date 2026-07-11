---
title: "Implementation Plan: Spec Mutation Gate [template:level_3/plan.md]"
description: "Build a runtime-neutral ESM policy core (classifyIntent + evaluateMutation) plus two thin runtime adapters (OpenCode plugin, Claude hooks) that enforce Gate 3 on the Write/Edit hot path, advisory by default and deny opt-in behind MK_SPEC_GATE_ENFORCE."
trigger_phrases:
  - "spec mutation gate plan"
  - "gate 3 runtime guard"
  - "classify enforce adapters"
  - "mk-spec-gate plugin"
  - "answerParse corpus"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/006-spec-mutation-gate"
    last_updated_at: "2026-07-11T08:51:12.475Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 implementation plan mirroring the deep-loop core-plus-adapters shape"
    next_safe_action: "Build the shared ESM core and its vitest before wiring either adapter"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/006-spec-mutation-gate"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Spec Mutation Gate

<!-- SPECKIT_LEVEL: 3 -->
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
| **Language/Stack** | TypeScript compiled to ESM (`dist/.js`) for the core and Claude hooks; ESM JavaScript for the OpenCode plugin |
| **Framework** | OpenCode plugin hooks (`experimental.chat.system.transform`, `tool.execute.before`, `event`); Claude `UserPromptSubmit` / `PreToolUse` hooks |
| **Storage** | Session-scoped JSON under `.opencode/skills/.spec-gate-state/`, hex(sessionID)-keyed, atomic write with age sweep/archive/prune |
| **Testing** | vitest (golden loop plus `answerParse()` corpus), plus an end-to-end hook smoke test |

### Overview
Build a runtime-neutral ESM policy core that reuses `classifyPrompt` and `validateSpecFolderBinding` from the shared gate-3-classifier and exposes `classifyIntent()` and `evaluateMutation()`. Two thin adapters bind the core to each runtime: an OpenCode plugin (classify in the chat transform, enforce in the tool hook) and two Claude hooks (classify on `UserPromptSubmit`, enforce on `PreToolUse` Write/Edit). Advisory by default, deny opt-in behind `MK_SPEC_GATE_ENFORCE`, fail-open everywhere.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented in spec.md
- [ ] Success criteria measurable (SC-001..SC-004)
- [ ] Dependencies identified (shared classifier ESM module, settings.json multi-hook support)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001..REQ-008)
- [ ] Golden-loop vitest and `answerParse()` corpus passing
- [ ] Docs updated (spec/plan/tasks/checklist/decision-record synchronized)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Runtime-neutral policy/logic core plus two thin runtime adapters. This mirrors the repo's proven deep-loop shape: a transport-free core (`dispatch-guard.cjs`, `evaluateDispatch` at :489) plus thin adapters (the `mk-deep-loop-guard.js` OpenCode plugin and the `task-dispatch-guard.cjs` Claude hook). The one deliberate divergence is ESM: this core statically imports the ESM classifier, so it cannot use the deep-loop `.cjs require()` shape.

### Key Components
- **spec-gate-core (ESM)**: `classifyIntent({prompt,sessionID,projectDir})` reads state; when open it runs `answerParse()` first, validates a candidate via `validateSpecFolderBinding` (`source:'prior_answer'`), and persists `satisfied` / `skipped`; otherwise, on a Gate-3 trigger, it persists `open` and returns the question. `evaluateMutation({tool,filePath,sessionID,projectDir,env})` allows when status is satisfied/skipped or the path is exempt, denies only under the deterministic opt-in predicate, and otherwise advises. The core writes no stdout/stderr and appends no log; adapters own transport.
- **mk-spec-gate.js (OpenCode adapter)**: classify in `experimental.chat.system.transform` (prompt read via the `extractPrompt` pattern, because `tool.execute.before` has no user prompt), enforce in `tool.execute.before` on the `MUTATING_TOOLS` set, sweep/evict in `event`.
- **spec-gate-classify.ts / spec-gate-enforce.ts (Claude adapter)**: `UserPromptSubmit` classify emitting `additionalContext`, `PreToolUse` "Write\|Edit" enforce emitting deny-JSON, "Bash" advise-only.
- **.spec-gate-state**: hex(sessionID)-keyed JSON reusing the loop-guard-state atomic-write, sweep/archive/prune, and shared warning-log; caches the validated resolved path so enforce never re-walks the specs tree.

### Data Flow
User turn -> classify surface reads the prompt -> `classifyIntent()` -> persist state (open / satisfied / skipped) and, when open, return the bounded question -> adapter injects the question. Later, a Write/Edit -> enforce surface -> `evaluateMutation()` reads cached state -> allow / advise / deny. The answer arrives as a later prompt observed only by the classify surface, which is why classify must parse and persist it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase touches path handling (in-repo file detection, exempt-path classification), env precedence (`MK_SPEC_GATE_ENFORCE`), persistence (session state), and shared policy (first enforcement consumer of `classifyPrompt`), so the affected-surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `shared/gate-3-classifier.ts` (`classifyPrompt` :838, `validateSpecFolderBinding` :595, `applyGate3Satisfaction` :652) | Policy: classifies Gate-3 intent and validates spec-folder bindings; today a scorer input only | Not a consumer change - import and reuse unchanged | `rg -n 'classifyPrompt\|validateSpecFolderBinding' .opencode/skills/system-spec-kit/shared` plus core unit test |
| `shared/dist/gate-3-classifier.js` | Compiled ESM artifact the core imports (`import canonicalFold`) | Unchanged - static import target | `node --input-type=module -e "import('.../dist/gate-3-classifier.js')"` resolves |
| `mk-dist-freshness-guard.js` (`MUTATING_TOOLS` :30, filePath extraction :149-161, bash surface :176) | Producer of the mutating-tool set and filePath extraction pattern | Reuse the same set and extraction shape in the enforce adapter | `rg -n 'MUTATING_TOOLS\|args.filePath' .opencode/plugins/mk-dist-freshness-guard.js` |
| `dispatch-guard.cjs` (state dir :42, REJECT env gate :47-48, `evaluateDispatch` :489) | Exemplar core: atomic hex(sessionID) state, sweep/archive/prune, env-gated reject | Copy the state and retention pattern into the ESM core; adapt env name to `MK_SPEC_GATE_ENFORCE` | Core state test writes/reads/sweeps a temp dir |
| `task-dispatch-guard.cjs` (deny-JSON :55-58, additionalContext :67-69, `main().catch` :78) | Exemplar Claude PreToolUse twin: deny-JSON plus advisory, fail-open | Mirror the deny-JSON and fail-open shape in `spec-gate-enforce.ts` | Hook smoke test asserts deny-JSON and approve-on-error |
| `.claude/settings.json` (Task PreToolUse :26-34, UPS shim :36-47) | Consumer: registers hooks per event; already runs multiple UPS entries | Add a `UserPromptSubmit` classify entry and `PreToolUse` "Write\|Edit" + "Bash" entries | `node -e "JSON.parse(fs.readFileSync('.claude/settings.json'))"` parses |
| `mcp_server/hooks/claude/user-prompt-submit.ts` (existing UPS shim) | Consumer exemplar: reads stdin JSON, emits hookSpecificOutput | Author the classify hook alongside it, same ESM/dist convention | Compiled `dist/hooks/claude/spec-gate-classify.js` exists and runs |
| `.opencode/plugins/README.md` | Docs: plugin registry and contract (default-export-only, no stdout) | Add the `mk-spec-gate` entry | Diff review confirms the entry and contract note |

Required inventories:
- Same-class producers: `rg -n 'MUTATING_TOOLS|args.filePath|file_path' .opencode/plugins`.
- Consumers of changed symbols: `rg -n 'classifyPrompt|validateSpecFolderBinding|MK_SPEC_GATE_ENFORCE' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: `MK_SPEC_GATE_ENFORCE` (set/unset), tool (Write/Edit/Bash/other), gate status (open/satisfied/skipped), target class (in-repo source / exempt) - deny appears only for the single all-true row.
- Algorithm invariant: enforce never walks the specs tree; it reads only the validated path cached at classify time, so the hot path stays O(1) plus at most one `fs.stat`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Create the `mcp_server/lib/spec-gate/` directory and confirm the static import path to `shared/dist/gate-3-classifier.js`
- [ ] Confirm the loop-guard-state atomic-write, sweep/archive/prune, and shared warning-log helpers are reusable from the ESM core
- [ ] Confirm the compiled-dist build wiring so `dist/lib/spec-gate/` and `dist/hooks/claude/` targets emit

### Phase 2: Core Implementation
- [ ] Implement `classifyIntent()` with `answerParse()`, state persistence, and the bounded question
- [ ] Implement `evaluateMutation()` with the deterministic opt-in deny predicate, path-class exemptions, and the validated-path cache
- [ ] Implement the OpenCode adapter (`mk-spec-gate.js`) and the Claude adapter (`spec-gate-classify.ts`, `spec-gate-enforce.ts`), wire `.claude/settings.json`, and register the plugin in README

### Phase 3: Verification
- [ ] Golden-loop vitest and fail-open, read-only-guard, and exempt-path assertions pass
- [ ] `answerParse()` corpus measures the false-positive and false-negative rate
- [ ] Documentation updated and `validate.sh --strict` clean
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `classifyIntent`, `evaluateMutation`, `answerParse`, state read/write/sweep, path-class exemptions | vitest |
| Integration | End-to-end hook smoke: OpenCode chat/tool hooks and Claude UPS/PreToolUse hooks against the compiled core | vitest plus node hook invocation |
| Manual | Classify-only session in each runtime, observe the injected question with the deny env unset | OpenCode and Claude sessions |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `shared/dist/gate-3-classifier.js` (ESM) | Internal | Green | No classify or answer validation; guard cannot function |
| loop-guard-state atomic/sweep/log helpers | Internal | Green | Must reimplement state discipline; higher risk of a non-atomic write |
| `.claude/settings.json` multi-hook support | Internal | Green | Claude classify cannot co-exist with the skill-advisor shim |
| `MUTATING_TOOLS` set and filePath extraction (`mk-dist-freshness-guard.js`) | Internal | Green | Enforce must reinvent tool normalization and path extraction |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A false deny stalls correctly-scoped work, or the `answerParse()` false-positive rate exceeds the accepted threshold.
- **Procedure**: Unset `MK_SPEC_GATE_ENFORCE` for an instant no-op (classify stays observe-only), or remove the two `.claude/settings.json` entries and delete `.opencode/plugins/mk-spec-gate.js` to remove the feature entirely.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────► Phase 2 (Core + Adapters) ──────► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core (core then adapters) | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Confirm import path, state helpers, build wiring |
| Core Implementation | High | Core plus `answerParse()` plus two adapters plus settings.json wiring |
| Verification | High | Golden loop, fail-open matrix, and the `answerParse()` corpus |
| **Total** | High | Effort size L; the risk lives in tests, not lines |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Ship classify-only first (deny env unset) and confirm zero deny events
- [ ] `MK_SPEC_GATE_ENFORCE` documented as the deny kill-switch
- [ ] `answerParse()` corpus rate measured and accepted before the enforce flip

### Rollback Procedure
1. Unset `MK_SPEC_GATE_ENFORCE` - deny becomes an instant no-op, classify stays observe-only
2. If needed, remove the two `.claude/settings.json` entries and delete `.opencode/plugins/mk-spec-gate.js`
3. Confirm Write/Edit proceed with no guard involvement (smoke a scoped write)
4. No stakeholder notification needed - the guard is internal tooling

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Delete `.opencode/skills/.spec-gate-state/`; it is session-scoped, regenerated, and never authoritative
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│  Shared      │────►│  spec-gate-core  │────►│  Adapters    │
│  classifier  │     │  (ESM)           │     │  OC + Claude │
└──────────────┘     └────────┬─────────┘     └──────┬───────┘
                              │                       │
                     ┌────────▼─────────┐     ┌───────▼────────┐
                     │  .spec-gate-state│     │  settings.json │
                     │  (loop-guard fmt)│     │  + README      │
                     └──────────────────┘     └────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Shared classifier | None | `classifyPrompt`, `validateSpecFolderBinding` | Core |
| spec-gate-core | Shared classifier, state helpers | `classifyIntent`, `evaluateMutation` | Adapters, Tests |
| OpenCode adapter | Core | classify + enforce + sweep hooks | Verify |
| Claude adapter | Core, settings.json | classify + enforce hooks | Verify |
| Tests + corpus | Core | golden loop, `answerParse()` rate | Enforce flip |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **spec-gate-core (`classifyIntent` + `evaluateMutation` + `answerParse`)** - the whole feature depends on it - CRITICAL
2. **Golden-loop vitest + fail-open matrix** - proves correctness on the hot path - CRITICAL
3. **`answerParse()` corpus measurement** - gates the enforce flip - CRITICAL

**Total Critical Path**: Core -> tests -> corpus, then the enforce flip.

**Parallel Opportunities**:
- The OpenCode adapter and the Claude adapter can be built in parallel once the core is stable
- The `answerParse()` corpus can be assembled while the core is under test
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Core complete | `classifyIntent` / `evaluateMutation` pass the golden loop and fail-open matrix | Phase 2 |
| M2 | Classify-only rollout | Both runtimes surface the question with zero deny events (SC-001) | Phase 2 end |
| M3 | Enforce ready | `answerParse()` corpus rate accepted; `MK_SPEC_GATE_ENFORCE` flip validated (SC-002, SC-003) | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Runtime-neutral ESM core plus two thin adapters

**Status**: Proposed

**Context**: The guard must run in two runtimes and reuse an ESM classifier without duplicating policy logic.

**Decision**: Put all policy in one ESM core and keep each adapter thin; author the core and Claude hooks as ESM because the classifier is ESM.

**Consequences**:
- One place owns classify and enforce policy; adapters only translate transport.
- The deep-loop `.cjs require()` pattern does not transfer; use ESM imports (TS to `dist/.js`).

**Alternatives Rejected**:
- Copy `task-dispatch-guard.cjs`'s `require()` shape: rejected because a static `require()` of the ESM classifier fails at runtime.

> Full ADRs, alternatives, and Five Checks live in `decision-record.md` (ADR-001, ADR-002).

---
