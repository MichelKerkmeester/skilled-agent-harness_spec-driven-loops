---
title: "Implementation Plan: sk-code-review follow-ups"
description: "Fix the path-only workflow route at the hub vocabulary, harden the final-line checker, document the cache-key fallback, the quality-evidence header and the user-mode contract, and measure finding accuracy live."
trigger_phrases:
  - "review mode followups plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: sk-code-review follow-ups

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (ESM and CommonJS), JSON, Markdown |
| **Framework** | sk-code hub compiled routing |
| **Storage** | None. The review cache stays in the user cache directory |
| **Testing** | `node --test`, the bash rule-canary harness, live `pi` review runs |

### Overview
One routing fix at the source, one checker change with a fixture and tests, and doc changes to the review mode, its playbook, its benchmark and the review agent. DeepSeek V4.1 Flash workers made each edit from a one-change brief, and the conductor read every diff and reran its check.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `node --test .skilled/bin/tests/compiled-route-*.test.cjs` reports `# fail 0` and the rule-canary harness ends `All rule-canary test cases passed`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Vocabulary-driven router

### Key Components
- **`hub-router.json` and `ROUTER.md`**: the two routing-stage vocabularies. The CI class counted the workflows path twice, so the CI surface outscored the review mode by more than the ambiguity delta.
- **`check-review-final-line.js`**: the parse contract for review output, now also comparing the Overall assessment with the status line.

### Data Flow
A prompt is scored per mode by keyword hits times weight. Modes within the ambiguity delta of the top score bundle, workflow first and surfaces after. With the path counted once, a path-only review ties review and CI at 4 and bundles them.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `code-ci-runtime` keyword `.github/workflows/` | Duplicate path signal | Removed | `rg -c -F '.github/workflows/' hub-router.json` finds none |
| `ROUTER.md` CI_WORKFLOW row and INTENT_SIGNALS | Stage-two copy of the vocabulary | Updated | `verify-router-sync.cjs` 5/5 |
| `graph-metadata.json` intent signals | Stage-one hub vocabulary | Unchanged, the generator only adds | `generate-router-intent-signals.cjs --check` PASSED |
| Quality prompt naming a workflow path | Consumer of the same scoring | Now `single` quality, matching its scenario | compiled-route replay |
| `check-review-final-line.js` consumers (canary, harness, README examples) | Read the checker | Unchanged contract for agreeing reports | harness passes |
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
| Unit | Final-line checker, compiled-route surface bundling | bash harness, `node --test` |
| Integration | Two-stage routing for a user surface | CR-028 command, skill advisor |
| Manual | Live finding accuracy | `pi` print mode on DeepSeek V4.1 Flash |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| llmgateway DeepSeek V4.1 Flash | External | Green | The live run would be NOT RUN |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a routing regression in the compiled-route tests or a review automation that breaks on the new checker failure.
- **Procedure**: revert the packet's commits, then rerun `compiled-route-manifest.cjs refresh --hub sk-code` and copy the manifest twin.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Research ranks and baseline gates | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Commit |
<!-- /ANCHOR:phase-deps -->

---
