---
title: "Implementation Plan: Phase 13: opencode-child-and-title"
description: "Settle two OpenCode 2.2.7 behaviours live in a throwaway copy, then build each change that survives test first in the OpenCode relaunch plugin: a parent arm that waits for its busy children, and a session title set from the launch name at the claim seed."
trigger_phrases:
  - "opencode child and title plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 13: opencode-child-and-title

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript, ESM plugin loaded by OpenCode, CommonJS tests |
| **Framework** | OpenCode plugin API, through `dualPlugin` in `.opencode/plugins/lib/v2-bridge.js` |
| **Storage** | None new. The relaunch record stays as it is |
| **Testing** | `node:test` with `node:assert/strict` |

### Overview
Two live checks on OpenCode 2.2.7 come first, because both changes rest on runtime behaviour no repository code can prove. Each change that the checks confirm gets a failing test in `.opencode/plugins/tests/session-relaunch.test.cjs`, then the smallest edit in `.opencode/plugins/session-relaunch.js`. A change the checks refute is dropped, and its evidence goes to `goal.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] The operator gave the green light to implement
- [ ] `node --test .opencode/plugins/tests/session-relaunch.test.cjs` exits 0 with 65 pass at baseline

### Definition of Done
- [ ] All acceptance criteria met, waived or superseded
- [ ] `node --test .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`
- [ ] `scratch/trace-child-idle.md` and `scratch/live-title.md` each hold a verdict
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Live check, then test-first edit.

### Key Components
- **Child tracking in `.opencode/plugins/session-relaunch.js`**: today `trackChildSession` (`:158` to `:164`) keeps a set of child ids and line 341 drops their events. The change adds a map from child id to its parent id and busy flag, updated from the child's status events before the skip at line 341.
- **The idle arm in `.opencode/plugins/session-relaunch.js`** (`:418` to `:435`): returns early while a child of this session is busy, and remembers the deferral. A child's idle runs the parent's arm check when the parent was deferred and no other child is busy.
- **The seed branch in `.opencode/plugins/session-relaunch.js`** (`:407` to `:414`): on a new seed, calls `ctx.client.session.update` once with the launch name as the title, without awaiting it in the event path.

### Data Flow
OpenCode sends events to the plugin's `event` hook. A child's creation records its parent, the child's status marks it busy or idle, and the parent's idle checks that map before it reads the record and arms. A seed message makes the plugin read `SKILLED_LOOP_NAME` and send one title update to the local OpenCode server.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/plugins/session-relaunch.js` | Drops child events and arms on parent idle with no child check | update | `node --test .opencode/plugins/tests/session-relaunch.test.cjs` |
| `.opencode/plugins/tests/session-relaunch.test.cjs` | Pins child skip, seed and idle arm behaviour | update | the same command |
| `.opencode/plugins/lib/v2-bridge.js` | Delivers v2 events raw and aliases `session.execution.succeeded` to `session.idle` (`:25` to `:28`). Its v1 client has no `update` (`:218` to `:279`) | unchanged | `node --test .opencode/plugins/tests/v2-bridge.test.cjs` |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | `armableRecord` and `arm`, called by the idle branch | not a consumer | `rg -n 'armableRecord\|core.arm' .opencode/plugins/session-relaunch.js` |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | `consume` deletes the record before the receiver starts (`:735` to `:739`) | unchanged | read only |

Required inventories:
- Finding classes: the child idle gap is `instance-only`, since only this plugin arms on an OpenCode idle. The dropped name is `cross-consumer`, since phase 012 owns the producer and this phase owns the OpenCode consumer.
- Same-class producers: `rg -n "session.idle|childSessions" .opencode/plugins/session-relaunch.js` lists every child skip and the one idle arm.
- Consumers of changed symbols: `rg -n 'trackChildSession|childSessions|SKILLED_LOOP_NAME' .opencode/plugins .skilled/hooks/session-relaunch`.
- Matrix axes: event source (v1 `session.status`, v2 events the trace names), child state (none, busy, idle, two children with one busy), parent record (pending, none), name (set, unset, empty), client (has `update`, lacks it, rejects).
- Algorithm invariant: a parent never arms while a tracked child of it is busy, and a title call never blocks or breaks the seed.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup runs the event trace and the live title call in a throwaway copy and records both verdicts. Implementation builds each confirmed change in `.opencode/plugins/session-relaunch.js` after its failing test in `.opencode/plugins/tests/session-relaunch.test.cjs`, or records the drop. Verification runs the plugin suites and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The child busy gate, the deferred arm, the title call and its fail-open path | `node:test` |
| Integration | The plugin suites with the v2 bridge suite | `node:test` |
| Manual | The event trace and the live title call on OpenCode 2.2.7 in a throwaway copy | `opencode`, `curl` |

Each must-fail test runs first as `node --test --test-name-pattern '<title>' .opencode/plugins/tests/session-relaunch.test.cjs` and must exit 1 with its assertion failure, saved to `scratch/red.txt`. After the edit the same command exits 0 with `fail 0`, saved to `scratch/green.txt`. The guard tests may pass at once. The full gate is `node --test .opencode/plugins/tests/*.test.cjs`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| OpenCode 2.2.7 and one provider and model | External | Yellow | Neither live check can run, so no code changes |
| Phase 012 name carry | Internal | Yellow | The title change has no name source beyond `SKILLED_LOOP_NAME` |
| Node.js test runner | Internal | Green | No test can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a guard test fails, or a live hop shows a parent that never arms after its child finished.
- **Procedure**: revert the one local commit that changed `.opencode/plugins/session-relaunch.js` and its test file. No data or config is migrated, and the throwaway copy is deleted with `rm -rf` on its scratch path.
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
| Setup | Operator green light, OpenCode 2.2.7 | Implementation |
| Implementation | Both verdicts recorded | Verification |
| Verification | Every confirmed change built or dropped | Close |
<!-- /ANCHOR:phase-deps -->

---
