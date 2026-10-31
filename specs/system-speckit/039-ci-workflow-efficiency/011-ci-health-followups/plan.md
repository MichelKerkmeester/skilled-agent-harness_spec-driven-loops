---
title: "Implementation Plan: Phase 11: ci-health-followups"
description: "Fix two flaky tests at their cause and measure the Dependabot pi-coding-agent bump. One test assertion, one additive watcher promise with a probe handshake in its test, and two lockfile updates to pi-coding-agent 1.4.0 checked by npm audit."
trigger_phrases:
  - "ci health followups plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 11: ci-health-followups

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS (Node 26), TypeScript |
| **Framework** | node:test, vitest, chokidar |
| **Storage** | None |
| **Testing** | `node --test`, `npx vitest run`, `npm test`, `npm audit` |

### Overview
The goal-core assertion moves from the full state path to its basename. The watcher gains a `ready` promise, and its real-chokidar test awaits it and then creates hidden probe directories until the watcher reports one, because chokidar's `ready` fires before macOS fs.watch delivers events. The lockfiles move to pi-coding-agent 1.4.0, the host version, with an `undici` override in the fast-mode extension, and each extension runs its CI steps and `npm audit`.
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
- [x] `node --test .skilled/hooks/goal/lib/goal-core.test.cjs` prints `fail 0`; the watcher suite prints `Tests  5 passed (5)` five runs in a row
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: test fixes plus one additive watcher member.

### Key Components
- **`createSkillGraphWatcher`**: returns `ready`, settled by the fs watcher's `ready` event, registered right after the watcher is created.
- **Real-chokidar test**: wraps the watch factory to listen for `.armed-probe-*` directories and writes the skill only after one is seen.

### Data Flow
chokidar `ready` settles `watcher.ready`; the test then makes probe directories under the skills root; the first reported probe sets `probeSeen`; the test writes the skill and waits for the reindex as before.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/daemon/watcher.ts` `SkillGraphWatcher` | Public watcher contract | update (additive `ready`) | `npm run typecheck` exit 0 |
| `lib/daemon/lifecycle.ts` | Holds a `SkillGraphWatcher` | not a consumer of `ready` | `rg -n "SkillGraphWatcher\b"` shows it only creates the watcher through `createSkillGraphWatcher` |
| Fake fs watchers in 4 watcher test suites | Store listeners per event | unchanged; they never emit `ready` | 47 tests across the 3 sibling suites pass |

Required inventories:
- Same-class producers: `rg -n "statePath.includes" .skilled/hooks/goal` shows one assertion.
- Consumers of changed symbols: every `SkillGraphWatcher` value comes from `createSkillGraphWatcher`, so no hand-built object misses `ready`.
- Matrix axes: N/A, no input matrix.
- Algorithm invariant: N/A, no parser or path fix.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the baselines, Implementation makes the three changes, Verification reruns every suite and the audit.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | goal-core suite, with and without a `pi`-bearing `TMPDIR` | `node --test` |
| Integration | real-chokidar watcher test, 5 runs in a row, plus the 3 sibling watcher suites | `npx vitest run` |
| Manual | `npm test`, typecheck and `npm audit` in both extensions | npm |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| npm registry and advisory database | External | Green | No bump and no audit result |
| chokidar in `system-spec-kit/runtime/node_modules` | Internal | Green | The real-chokidar test throws before it runs |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a watcher consumer fails on the new `ready` member, or a test regresses.
- **Procedure**: revert the flake-fix commit or the lockfile commit on its own; the two are independent.
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
| Implementation | Setup baselines | Verification |
| Verification | Implementation | Commit |
<!-- /ANCHOR:phase-deps -->

---
