---
title: "Implementation Plan: Phase 43: v2-default-model-and-follow-ups"
description: "Switch the OpenCode 2 default model to llmgateway in the fan-out runtime and the cli-opencode docs, add a blocking CI job for the hook node:test suites, and close the recorded doc and comment follow-ups, one small change each."
trigger_phrases:
  - "v2 default model and follow ups plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 43: v2-default-model-and-follow-ups

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (CommonJS and ES modules), TypeScript tests, Markdown, GitHub Actions YAML |
| **Framework** | The deep-loop fan-out runner and the cli-opencode skill |
| **Storage** | None |
| **Testing** | `node --test`, vitest, the playbook package validator, actionlint |

### Overview
The fan-out runner already branches on the OpenCode major for the argv; the default model joins that branch. The docs change only where they show the default dispatch, so rows that describe the opencode-go route itself keep that route's own v2 form. The CI job mirrors the plugin-test workflow: provision the worktree, then run every hook test file that does not import vitest, plus the installer test.
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
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted changes inside existing files plus one new workflow; no new module.

### Key Components
- **Fan-out runner**: `buildOpencodeLineageCommand` picks the per-version default
- **cli-opencode docs**: SKILL.md Default Invocation, README, the roster and the playbook examples
- **Default-model test**: holds `--model` selectors to the v1 default and `-m` selectors to the v2 default
- **Hooks workflow**: provisions, then runs the hook node:test files and the installer test

### Data Flow
An unpinned lineage reaches `buildOpencodeLineageCommand`, which resolves the binary's major and then the default for that major. Nothing else in the flow changes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The runtime change gets unit tests for both versions' argv. The doc change is held by the default-model test. The v2-bridge timeout is proven by removing the stream announcement and showing the suite fail instead of hang. The workflow is proven on CI by its run id and test count. A live unpinned dispatch on each version shows the default resolves and runs.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The operator's `llmgateway` credential on OpenCode 2, confirmed by `opencode2 models --standalone` listing `llmgateway/deepseek-v4.1-flash`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each item is its own commit, so any one can be reverted alone. Reverting the runtime commit restores `opencode-go` as the v2 fallback.
<!-- /ANCHOR:rollback -->

---
