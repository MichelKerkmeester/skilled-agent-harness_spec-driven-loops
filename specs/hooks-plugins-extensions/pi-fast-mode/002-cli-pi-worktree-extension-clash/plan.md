---
title: "Implementation Plan: Let a second copy of the Pi fast-mode extension stand down, so cli-pi runs from a git worktree"
description: "A load-time claim in the fast-mode extension: the first copy in a Pi load claims the package on the event bus that load shares, and a later copy registers nothing. Pi's loader is left as it is, because its own rule for a conflict is load order."
trigger_phrases:
  - "cli pi worktree extension clash plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Let a second copy of the Pi fast-mode extension stand down, so cli-pi runs from a git worktree

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, loaded by Pi 1.3.0 through jiti |
| **Framework** | Pi extension API (`registerFlag`, `registerCommand`, `on`, `events`) |
| **Storage** | None |
| **Testing** | Vitest in the extension package, deep-loop Vitest for the regression guard |

### Overview
Pi drops a duplicate extension only when two paths share a canonical real path, then fails the load when two extensions register one flag. Every extension in one load gets the same event bus as `pi.events`, and Pi drops a finished load's listeners before it reloads or switches sessions. So the first copy to load emits a probe, finds no answer, subscribes an answer and registers; a later copy's probe is answered and it returns before registering anything.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The crash is reproduced from a worktree and the main checkout control exits 0 (`scratch/repro-worktree.txt`, `scratch/repro-main.txt`)
- [x] The root cause is read from Pi's installed loader
- [x] Baselines are captured before any change

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Extension tests, typecheck, `fanout-run.vitest.ts` and the deep-loop suite at or above baseline
- [ ] Luna's review passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A load-time claim on the shared extension event bus.

### Key Components
- **`claimPackage(pi)`** in `src/index.ts`: emits `{ claimed: false }` on `pi-fast-mode-w-subagent-support:copy-claim`. If a listener set `claimed`, it returns false. Otherwise it subscribes a listener that sets `claimed` on later probes and returns true.
- **The factory** in `src/index.ts`: returns before any registration when the claim fails.

### Data Flow
Pi resolves both copies and calls each factory in load order with one bus. The first copy claims and registers. The second copy's probe is answered synchronously inside `emit`, so it registers nothing, and Pi's conflict check sees one owner of `--fast`.

### Design history
The first version chose the winner by working directory: a copy outside `process.cwd()`'s project stood down. Luna found that Pi resolves resources against the session's cwd, which `--session` and `--resume` can move, so that check could leave no copy registered. The extension API gives no cwd at load time, and the claim needs none.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `src/index.ts` factory | Registers the flag, the command and four event handlers | Update: claim first, stand down when claimed | `tests/extension.test.ts` |
| Test fakes in `extension.test.ts` and `precedence.test.ts` | Stand in for the Pi API | Update: add a synchronous `events` bus | Both suites pass |
| `fanout-run.cjs` cli-pi builder | Builds `pi -p --offline --model ... --thinking ...` | Unchanged: not a consumer of the change | `tests/unit/fanout-run.vitest.ts` baseline vs after |
| Other `.pi/extensions/*` | Repo hooks with distinct flags and tools | Unchanged: only fast-mode has a user-scope twin | `ls ~/.pi/agent/extensions` |

Inventories:
- Same-class producers: `ls ~/.pi/agent/extensions` lists one repo package with a project twin, `pi-fast-mode-w-subagent-support`. The orca files have no project copy.
- Consumers of the new helper: `rg -n 'claimPackage|COPY_CLAIM_CHANNEL' .pi/extensions/pi-fast-mode-w-subagent-support`.
- Matrix axes: one load or two, a second copy present or absent, a stale listener cleared or not, the second copy fixed or unfixed. Rows: one copy; two copies on one bus; two copies on two buses; second copy after the bus is cleared; live with two fixed copies; live with an unfixed second copy.
- Invariant: within one load at most one fixed copy registers, and with no other fixed copy present a copy always registers.
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
| Unit | One bus, two buses, and a cleared bus | Vitest in the extension package |
| Integration | `fanout-run.vitest.ts` and the deep-loop suite against their baselines | Deep-loop Vitest |
| Manual | cli-pi dispatches through the real builder: from the worktree with the global copy as is, with two fixed copies through a `PI_CODING_AGENT_DIR` overlay, with an unfixed overlay copy as the control, and from the main checkout | `pi`, `scratch/pi-builder-smoke.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Pi 1.3.0 loader behavior (dedup by real path, flag conflicts fatal, one bus per load) | External | Green | A Pi release that dedups by package name would make the guard redundant, not wrong |
| This change reaching `main` | Internal | Yellow | The operator's global link targets the main checkout's copy, so worktrees fail until then |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Fast Mode missing in a session where it should be on, or a new load error.
- **Procedure**: `git revert` the change commit. The extension then registers on every load, as before.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Core Implementation | Low | 1 hour |
| Verification | Med | 1 to 2 hours |
| **Total** | | **2.5 to 3.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created: not needed, no data changes
- [x] Feature flag configured: not needed, the guard only acts when two copies load together
- [x] Monitoring alerts set: not applicable to a local extension

### Rollback Procedure
1. Revert the change commit.
2. Rerun the extension tests.
3. Run `pi -p --offline` from the main checkout and confirm the reply.
4. Tell the operator that worktree runs need `pi -ne` again.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
