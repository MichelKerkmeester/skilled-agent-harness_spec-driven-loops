---
title: "Implementation Plan: Phase 5: deep-review-remediation"
description: "Fix the twelve deep-review advisories in four workstreams on disjoint files, tests first, then align the code with sk-code-opencode and refresh the touched docs."
trigger_phrases:
  - "deep review remediation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: deep-review-remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS and ES modules (built-ins only), Pi TypeScript, bash |
| **Framework** | None; hook adapters for Claude, Codex, Hermes, OpenCode and Pi |
| **Storage** | Files under the relaunch state dir and `.skilled/skills/.state/session-relaunch/` |
| **Testing** | `node --test`, Pi vitest, pytest, shellcheck, tsc |

### Overview
Four workstreams fix the review's advisories on disjoint files. Each code fix starts with a test that fails on today's code. After the fixes, a fresh SWE session reviews the packet's code against the sk-code-opencode checklists, and markdown agents update the docs the fixes change through their sk-doc modes.
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
- [ ] Tests passing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Runtime-neutral core with thin per-runtime adapters. The fixes move duplicated adapter logic into the core.

### Key Components
- **`lib/relaunch-core.cjs`**: state, notes, log, and after this phase the shared `plannedNotePath`, threshold and seed helpers.
- **`lib/killer.cjs`**: idle wait, lock and signalling.
- **Adapters**: Claude, Codex, Hermes, OpenCode and Pi, which call the core.

### Data Flow
An adapter reads usage, nudges, and on stop arms the relaunch record and spawns the killer. The killer waits for idle, takes the lock and signals the runtime. The wrapper reads the record and relaunches with the seed, which the next session's adapter parses.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `appendLog` in the core | Only writer of `relaunch.log` | Update to an O_APPEND write | Concurrent-writer test |
| `transcriptMtime`, `waitForIdle` in the killer | Idle detection | Update: stat errors go to give-up | Unreadable-transcript test |
| Lock takeover in the killer | Single-killer guarantee | Update to an atomic takeover | Two-takeover race test |
| Killer state dir creation | Creates the state dir | Update: route through `ensureStateDir` | Mode 0700 test |
| `plannedNotePath`, `relaunchThreshold`, `notePathFromSeed` in five adapters | Duplicated helpers | Update: one core export each | `rg` shows one definition; adapter tests |
| `findCodexPid`, `findHermesPid` | Identical pid lookups | Update: one helper | Adapter tests |
| Claude `stop-arm.mjs` | Arms and spawns the killer | Update: skip an armed record | Double-stop test |
| Skip suffix in the core, wrapper, `nudge.cjs` | Printer and parser | Update printers; parser accepts both | Old and new suffix tests |
| `.skilled/bin/README.md`, command-runtimes playbook | Document the wrapper exit contract | Update from `skilled-loop` | Read against the code |
| Concern README, contract, tests that quote the suffix | Consumers of the suffix text | Update | `rg` for the old text shows only the compatibility path |

Required inventories:
- Same-class producers: `rg -n "Gate 3 answered D" .skilled` and `rg -n "plannedNotePath|relaunchThreshold|notePathFromSeed|SEED_COMMAND|findCodexPid|findHermesPid" .skilled/hooks/session-relaunch`.
- Consumers of changed symbols: `rg -n "appendLog|ensureStateDir|transcriptMtime|specFolderFromSeed" .skilled`.
- Matrix axes: runtime (5 adapters) by helper (3), and suffix spelling (old, new, none) by reader (core, nudge, wrapper).
- Algorithm invariant: at most one killer holds the lock for a loop id, and it signals only descendants of the wrapper.
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
| Unit | Core, killer, nudge and adapter helpers | `node --test` on explicit files |
| Integration | Wrapper with a stub runtime, Pi adapter | `node --test`, Pi vitest, shellcheck |
| Manual | None new; the phase 004 live runs stand | n/a |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-devin `swe-2-max` | External | Green | Builds and reviews wait |
| cli-codex `gpt-6-luna` | External | Red until Oct 22 | None; SWE builds under parent D5 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a fix breaks the gate and three repair attempts fail.
- **Procedure**: the closed phases are committed as `b830fd0276`; compare the file against that commit and re-dispatch a narrower fix. Never use checkout, restore, reset or stash.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
WS1 killer and log ──┐
WS2 adapter helpers ─┼──► Alignment review ──► Docs ──► Final gate
WS3 suffix text ─────┤
WS4 docs and evidence┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| WS1 to WS4 | None (disjoint files; WS2 and WS3 both touch the core, so they run in sequence) | Alignment review |
| Alignment review | WS1 to WS4 | Docs |
| Docs | Alignment review | Final gate |
| Final gate | Docs | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Done |
| Core Implementation | Med | 4 build lanes and reviews |
| Verification | Med | Alignment review, docs, final gate |
| **Total** | | **One working session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created: the prior state is commit `b830fd0276`
- [ ] Feature flag configured: `SYSTEM_SESSION_RELAUNCH_DISABLED` already disables the concern
- [ ] Monitoring alerts set: not applicable to a local hook

### Rollback Procedure
1. Set `SYSTEM_SESSION_RELAUNCH_DISABLED=1` to stop the loop.
2. Re-dispatch a fix against the failing file, compared with `b830fd0276`.
3. Rerun the gate.
4. Report to the operator.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
