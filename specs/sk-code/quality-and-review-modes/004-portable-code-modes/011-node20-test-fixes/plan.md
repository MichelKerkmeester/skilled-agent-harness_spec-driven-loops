---
title: "Implementation Plan: Node 20 test fixes for the advisor plugin suite and the parallel node check helper"
description: "Give the plugin suite a module.register fallback for its import stubs, and route each node --check child's stderr through a file so Node 20 keeps the whole report."
trigger_phrases:
  - "node20 test fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Node 20 test fixes for the advisor plugin suite and the parallel node check helper

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS and ES modules |
| **Framework** | None |
| **Storage** | None, temp files under `os.tmpdir()` |
| **Testing** | `node:test` on Node 20.19.5, 22.23.1 and 26.8.2 |

### Overview
The plugin suite keeps `module.registerHooks` where it exists and otherwise registers one data-URL hooks module through `module.register`, passing the stubs as data. The syntax helper hands each child a file descriptor for stderr and reads the file back inside the existing budget. Each fix is proven by running the file three times on each Node version.
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
- [x] Both test files print `fail 0` and exit 0 on Node 20.19.5, 22.23.1 and 26.8.2, three runs each
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Feature detection with fallback.

### Key Components
- **`stubModuleResolution` in the plugin suite**: one stub list, applied in-thread by `registerHooks` or off-thread by `register`.
- **`stderrFile` and `readStderr` in the syntax helper**: a per-child stderr file and its budgeted read-back.

### Data Flow
The helper opens a file, spawns `node --check` with that descriptor as stderr, closes its own copy, and after the child exits streams the file through the head-and-tail capture into the record, then deletes it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `parallel-node-check.cjs` | Produces the per-file records | update | `parallel-node-check.test.cjs` on three Node versions |
| `quality-gate.cjs` `runNodeCheck` | Reads `record.stderr` for the line and message | unchanged, the record format is the same | Node 20 quality gate run on a long-line file quotes the message |
| `system-skill-advisor.test.cjs` | Stubs plugin imports | update | the suite on three Node versions |
| `.skilled/plugins/system-skill-advisor.js` | Code under test | not a consumer, never calls `registerHooks` | `rg -n registerHooks .opencode/plugins` hits only the test |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup reproduces both failures, Implementation fixes each at its cause, and Verification reruns both files three times per Node version.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Both test files, three runs per Node version | `node --test` with the absolute Node binary |
| Integration | The quality gate's `syntax-node` check under Node 20 on a long-line file | `quality-gate.cjs --files` |
| Manual | None | None |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node 20.19.5, 22.23.1, 26.8.2 under `~/.nvm/versions/node/` | External | Green | No cross-version proof |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Either suite fails on Node 22 or later, or the quality gate's `syntax-node` records change shape.
- **Procedure**: Revert the commit that carries these three code files.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Closure |
<!-- /ANCHOR:phase-deps -->

---
