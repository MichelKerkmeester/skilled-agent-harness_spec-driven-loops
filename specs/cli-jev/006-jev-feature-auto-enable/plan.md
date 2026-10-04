---
title: "Implementation Plan: Jev features on by default when a key is stored"
description: "One shared helper decides whether a Jev feature runs: its env switch, then the stored credential. The citation advisory, the model benchmark's new auto grader and a WebFetch hook all ask it, and each asks the question its keep was measured with."
trigger_phrases:
  - "jev feature auto enable plan"
  - "jev-features helper"
  - "auto grader plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Jev features on by default when a key is stored

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM and CommonJS, Python 3 for `validate_document.py` |
| **Framework** | None. Claude Code hooks for the WebFetch screen |
| **Storage** | None. `hook-flags.env` is read, never written |
| **Testing** | `node --test`, vitest, pytest |

### Overview
`cli-classifier/shared/scripts/jev-features.mjs` resolves each feature's switch from the environment and then `hook-flags.env`, and checks that `jev` is on PATH with `jev auth status` passing. Each live path asks it before any call: the citation advisory, the reviewer verdict fallback and the D4 hallucination grader under a new `auto` grader default, and a new Claude Code PostToolUse hook that screens WebFetch text. Every call goes through `jev-transport.mjs` with the scorer's own question constants.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing at or above their baselines
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A shared gate in front of four existing or new call sites. Each site keeps its own fallback, so a closed gate means today's behavior.

### Key Components
- **`jev-features.mjs`**: `featureEnabled(name, env)` reads `JEV_FEATURES` and `JEV_FEATURE_<NAME>`, plus the `SKDOC_CITE_DRIFT_CHECK` alias. `jevReady(env)` returns the jev path and provider or a skip reason. `featureReady(name, env)` combines both.
- **Citation advisory**: `cite-drift-scan.mjs --advise` replaces its own gate with `featureReady('cite-drift')`, and `validate_document.py` skips the spawn when a switch is off.
- **Model benchmark `auto` grader**: the default for `run-benchmark.cjs` and `reviewer-scorer.cjs`. It resolves to `jev` when the matching feature is ready and to `noop` otherwise, and the report records the resolved grader and why.
- **Injection screen hook**: `.skilled/hooks/injection-screen/` splits WebFetch text into sections, asks the measured instruction twice per section with a third call on a split, and adds one advisory line when a section's mean reaches 0.60.

### Data Flow
A live path calls `featureReady`. A closed gate returns today's result. An open gate sends the scorer's question and the text through `spawnClassifierCall`, reads the typed answer, and an unreadable or failed answer counts as unmeasured, never as a flag or verdict.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `cite-drift-scan.mjs` `adviseGate` | Gates the only live Jev path | Replace with the shared gate | Its advisory tests and the pytest advisory suite |
| `validate_document.py` `print_cite_drift_advisory` | Skips on `SKDOC_CITE_DRIFT_CHECK=0` | Also skips on the new switches | pytest advisory suite |
| `reviewer-scorer.cjs` `classifyWithGrader` | Asks an unmeasured inline question | Ask `score-verdict-fallback.cjs`'s question and options | Reviewer scorer tests |
| `score-model-variant.cjs` `buildGraderFn` | noop, mock, llm | Add `jev` with the cascade rule | Scorer tests |
| `run-benchmark.cjs` grader default | `noop` | `auto` | Runner tests |
| `/deep:model-benchmark` grader input | Default `noop` | Default `auto`, enum gains `jev` and `auto` | Command doc read |

Required inventories:
- Same-class producers: `rg -n "spawnClassifierCall|'jev'" .skilled --glob '!**/tests/**'` lists every Jev caller.
- Consumers of changed symbols: `rg -n "grader" .skilled/commands/deep .skilled/skills/system-deep-loop/deep-improvement`.
- Matrix axes: switch state (unset, off by master, off by feature, off in file, env overrides file) × readiness (no jev, auth fails, ready).
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Switch resolution, readiness, each grader and the hook's flag rule | `node --test`, vitest, pytest |
| Integration | Each path with a logging `jev` stub first on PATH | The same runners |
| Manual | One real WebFetch with the hook registered | Claude Code |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `jev` 0.6.2 with a stored credential | External | Green | Every feature stays off, which is today's behavior |
| DeepSeek V4.1 Flash on OpenCode Go for code, Luna 6 for review | External | Green | The orchestrator waits or switches provider |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A live path misbehaves with a key stored.
- **Procedure**: Set `JEV_FEATURES=0` at once, then revert the packet's commits.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Helper ──► Citation switch ─┐
       ├─► Auto graders ────┼──► Docs and sweep ──► Research ──► Changelog
       └─► Injection hook ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Helper | None | Every wiring task |
| Wiring | Helper | Docs |
| Docs and sweep | Wiring | Research |
| Research | The Pi provider fix | Changelog |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Core Implementation | Med | 4 to 6 hours of worker time |
| Verification | Med | 2 hours plus the research run |
| **Total** | | **8 to 10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No backup needed, nothing persists
- [ ] `JEV_FEATURES` documented as the master switch
- [ ] Each path reports its resolved state

### Rollback Procedure
1. Set `JEV_FEATURES=0` in the shell or in `hook-flags.env`.
2. Revert the packet's commits.
3. Rerun the suites the changed files belong to.
4. Tell the operator which feature misbehaved.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

