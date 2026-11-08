---
title: "Implementation Plan: Phase 11: post-fix-remediation"
description: "Fix the twenty post-fix research findings, the two frontier items and the follow-ups with failing-first tests, in three disjoint lanes: core and adapters, the wrapper, and docs."
trigger_phrases:
  - "post fix remediation plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 11: post-fix-remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS and ESM, Pi TypeScript, Bash wrapper, Node built-ins only |
| **Framework** | None; one core with thin per-runtime adapters |
| **Storage** | Relaunch records and `relaunch.log` in the runtime state directory |
| **Testing** | `node --test` on the concern's test files, vitest for Pi, shellcheck |

### Overview
Three lanes on disjoint files: the core, CLI, killer and adapters; the wrapper and its tests; the docs. Each lane writes its test first. The orchestrator reruns the whole gate, then swaps in the pre-phase sources to prove the tests red.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A decision more than one adapter makes lives in the core. This phase adds the arm guard, the payload-event rule, the process-table read, the entrypoint check and the template check there.

### Key Components
- **`armableRecord`**: one answer, with a reason, to whether a record may arm.
- **`arm`**: restamps `armedAt` and the cwd when it re-arms a record whose killer is gone.
- **The killer's freshness check**: applies the wrapper's age rule at the end of the grace period before signalling.

### Data Flow
An arm event asks `armableRecord`, then `arm`. The killer waits for idle, checks the hop cap and then freshness, and signals only a record the wrapper will accept. The wrapper and the CLI print the manual command from the core.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `arm` (core) | Arms a pending record | update: restamp on re-arm | core test |
| `armableRecord` (core) | New | create; five arm paths and `handoffPending` call it | conformance arm cases |
| Killer signal path | Signals an armed record under the hop cap | update: freshness check | killer test |
| `refuseForShellChild` (CLI) | Shell-child check | update: `CLAUDE_PID` only while it descends | CLI test |
| `skilled-loop` manual command | Built its own command | update: from the core, visible template error | wrapper tests |
| Entrypoints | Ran on import | update: `isEntrypoint` guard | adapter tests |

Required inventories:
- Same-class producers: `rg -n "armableRecord\(" .skilled/hooks/session-relaunch .opencode/plugins` lists five arm paths and the nudge.
- Consumers of changed symbols: `rg -n "manualClaimCommand\(|readProcessTable\(|HANDOFF_SECTIONS|RUNTIMES" .skilled .opencode`.
- Matrix axes: five arm cases by five adapters, with the no-target case skipped for OpenCode and Pi, which signal their own process.
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
| Unit | Core, nudge, killer, CLI | `node --test` |
| Integration | Adapters, the OpenCode plugin, the wrapper with stub runtimes | `node --test` |
| Conformance | Seed, nudge and arm cases across adapters, mirrored for Pi | `node --test`, vitest |
| Red proof | Every pre-phase source swapped in, then restored | `git show`, `cmp` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 010's verified report | Internal | Green | The fix list would rest on unverified claims |
| `ps` for the process table | External | Green | Arm paths would leave records pending |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a suite fails after merge, or a live hop regresses.
- **Procedure**: revert the phase commit. Records and notes keep their format.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Red tests ──► Core and adapters ┐
Red tests ──► Wrapper          ├──► Docs ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Core and adapters | Red tests | Docs, Verify |
| Wrapper | Red tests | Docs, Verify |
| Docs | Both lanes | Verify |
| Verify | All above | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | The verified report |
| Core Implementation | Med | Two parallel lanes |
| Verification | Med | One gate run and a red swap |
| **Total** | | **About half a day** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): no data changes
- [x] Feature flag configured: `SYSTEM_SESSION_RELAUNCH_DISABLED` already turns the concern off
- [x] Monitoring alerts set: `killer-stale` and `killer-manual-template` appear in `relaunch.log`

### Rollback Procedure
1. Set `SYSTEM_SESSION_RELAUNCH_DISABLED=1` if a hop misbehaves.
2. Revert the phase commit.
3. Rerun the session-relaunch suites and the Pi suite.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
