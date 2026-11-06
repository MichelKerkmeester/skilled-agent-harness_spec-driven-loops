---
title: "Implementation Plan: Phase 11: hub-registration-and-routing"
description: "Register cli-deepseek-harness as the eighth cli-external-orchestration mode on the hub, advisor, compiled-routing, sk-prompt and agent-table surfaces. Docs are written by the orchestrating Claude session under sk-doc, and JSON, fixtures and tests by cli-codex under sk-code, then every generator reruns and every routing check must exit 0."
trigger_phrases:
  - "hub registration and routing plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 11: hub-registration-and-routing

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, Node.js scripts, bash |
| **Framework** | cli-external-orchestration parent hub, skill advisor, compiled routing |
| **Storage** | None. Registry and fixture JSON files in the repository |
| **Testing** | vitest for advisor suites, `build-artifacts.cjs` drift check, `check-agent-mirror-sync.cjs` |

### Overview
This phase adds `cli-deepseek-harness` to every surface that selects a hub mode, from `mode-registry.json` through the advisor graph to the agent executor tables. Docs follow `sk-doc` (`sk-create-skill` hub conventions, `sk-create-feature-catalog`, `sk-create-changelog`) in the orchestrating Claude session, and JSON, fixtures and tests follow `sk-code` `sk-code-skilled` through `cli-codex gpt-6-luna xhigh fast`. Proof is the registry count of 8, an advisor call that names the hub for a dsh prompt and zero drift after every generator reruns.
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
- [ ] The registry count command prints `8`, `check-prompt-quality-card-sync.sh` and `check-agent-mirror-sync.cjs` exit 0, and `git diff --exit-code` after `build-artifacts.cjs` exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Registry-driven hub routing.

### Key Components
- **`mode-registry.json`**: the source of mode ids and aliases that the hub router, leaf manifest and advisor read.
- **Compiled-routing harness**: `build-artifacts.cjs` enumerates packet sources by hand and emits the manifest the front door serves.
- **Skill advisor**: `skill-graph.json` plus the parity and scorer fixtures decide stage-one routing to the hub.

### Data Flow
A prompt reaches the advisor, which scores the hub from `skill-graph.json`. The hub router then matches aliases from `mode-registry.json` and `hub-router.json` and resolves the leaf from `leaf-manifest.json`. Agent tables and the sk-prompt card tell a calling agent which executor and model to name.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A: this phase adds a new mode and fixes no reported finding, so no fix surface applies.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup records the seven-mode baseline. Implementation edits registry, docs, fixtures and tables in that order. Verification reruns every generator and check.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Advisor parity fixtures and the executor-delegation scorer | vitest |
| Integration | Compiled-routing build and canary cases, card sync and agent mirror sync | `build-artifacts.cjs` with `git diff --exit-code`, `check-prompt-quality-card-sync.sh`, `check-agent-mirror-sync.cjs` |
| Manual | Advisor call for "run this task through dsh headless" and for a `cli-pi` prompt | `node .skilled/bin/skill-advisor.cjs advisor_recommend --format json` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `003-cli-deepseek-harness-skill-packet` | Internal | Red | The hub points at a packet that does not exist |
| `006-deep-loop-executor-kind` | Internal | Red | Agent tables name a kind the runtime does not accept |
| `cli-codex gpt-6-luna xhigh fast` | External | Yellow | JSON and test edits fall back to the orchestrating session |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: an existing mode stops resolving for its own canary, or a generator cannot reproduce a committed artifact.
- **Procedure**: revert the phase commit with `git revert <sha>` and rerun `build-artifacts.cjs` and the agent mirror generator so generated files match the reverted sources.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (baseline counts and suite runs) | Phases 003 and 006 validated | Implementation |
| Implementation (registry, docs, fixtures, tables) | Setup | Verification |
| Verification (generators and checks) | Implementation | Phase 012 and close |
<!-- /ANCHOR:phase-deps -->

---
