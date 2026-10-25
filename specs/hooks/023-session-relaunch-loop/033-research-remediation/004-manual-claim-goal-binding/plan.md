---
title: "Implementation Plan: Phase 4: manual-claim-goal-binding"
description: "Bind the handoff note goal packet on a seeded manual first launch by parsing the claim seed in the core and reusing a core usableGoalPacket."
trigger_phrases:
  - "manual claim goal binding plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: manual-claim-goal-binding

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash wrapper plus Node.js CommonJS |
| **Framework** | None |
| **Storage** | Handoff notes on disk, frontmatter only |
| **Testing** | `node --test`, vitest for the Pi extension |

### Overview
The core gains `parseClaimSeed`, the inverse of `specFolderSuffix`, and takes over `usableGoalPacket` from the CLI. After the wrapper unsets inherited values at `skilled-loop:473-474` and finishes the `--no-daemon` and `--standalone` prepends at `:609-635`, a first launch scans `launch_arguments` for the claim seed, asks the CLI for the named note's packet and, when one comes back, exports it the way the hop branch at `:755-784` does. On a first launch the wrapper passes the operator's arguments through unchanged; `build_relaunch_arguments` (`:320`) runs only on a hop and is never called here.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Phase 002 Complete

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Both test commands pass with the baseline delta recorded
- [ ] Docs updated (spec/plan/tasks and README)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared core library with thin callers: the wrapper and the CLI both ask `relaunch-core.cjs`.

### Key Components
- **`parseClaimSeed(prompt)`**: returns `{ notePath, specFolder }` or `null`; strips the claim prefix, then splits on `SPEC_FOLDER_MARKER` and removes `SPEC_FOLDER_SUFFIX` or `SPEC_FOLDER_SKIP_SUFFIX`.
- **`usableGoalPacket(frontmatter, switches, roots)`**: moved unchanged in logic from `session-relaunch.cjs:376-381`; the CLI passes its `resolvedSwitches()` and `goalRoots(noteCwd)`.
- **Wrapper seed step**: the seed's position differs by runtime (positional on Claude, Codex and Cursor, after `--prompt` on OpenCode, after `-q` on Hermes, after `--` on Devin), and indices move when `--no-daemon` or `--standalone` is prepended (`:609-635`). After `:635`, scan `launch_arguments` for an element that starts with the claim prefix and record its index. Run one node call only when one is found; it prints a packet only for an open note inside the repository. Export `SESSION_RELAUNCH_GOAL_PACKET`, and on Hermes `HERMES_SPEC_FOLDER`. For Claude with a renderable slice, replace that element with `/goal <slice>` and export `SKILLED_LOOP_CLAIM_SEED`. Never call `build_relaunch_arguments` on a first launch: it rebuilds `launch_arguments` and would drop the operator's own.

### Data Flow
Prompt, then `parseClaimSeed`, then note path check (inside repo, state open), then frontmatter, then `usableGoalPacket`, then the wrapper exports `SESSION_RELAUNCH_GOAL_PACKET`, sets `HERMES_SPEC_FOLDER` on Hermes and, on Claude, swaps the recorded seed element for `/goal <slice>` in place. The hop goal branch is not reused. Any failure prints nothing and the launch goes on unbound. Code comments added here state the why only and carry no spec or phase ids.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `relaunch-core.cjs` `specFolderSuffix` | Builds the seed suffix | Unchanged; parser inverts it | Round-trip test |
| `session-relaunch.cjs` `usableGoalPacket` | Picks the packet on consume | Move to core, import back | `rg -n "function usableGoalPacket"` shows only the core |
| `skilled-loop` first launch | Unsets inherited packet, passes operator arguments through | Add seed scan and step after `:635`; edit only the seed element | `skilled-loop.test.cjs` table tests, one per seed position plus `--standalone` |
| `skilled-loop` hop goal branch `:755-784` and `build_relaunch_arguments` `:320` | Exports packet and rebuilds arguments on hops | Unchanged, not called on a first launch | Inherited-packet test stays green |
| `usableGoalPacket` consumers in phase 006 | Phase 006, built after this one, changes goal-switch handling around consume | This phase moves the helper with unchanged logic; 006 edits the moved copy in the core | `goal-handover.test.cjs` green here |
| README `:193` and `:164-174` | Says manual claim carries no goal | Update | Read after edit |

Required inventories:
- Same-class producers: `rg -n 'claim and continue handoff|SPEC_FOLDER_MARKER' .skilled .opencode`.
- Consumers of changed symbols: `rg -n 'usableGoalPacket|parseClaimSeed' . --glob '*.cjs' --glob '*.ts' --glob '*.md'`.
- Matrix axes: runtime (Pi, OpenCode, Codex, Devin, Cursor, Hermes, Claude) by note state (open, claimed, outside repo, no usable packet), plus the no-seed row.
- Algorithm invariant: `parseClaimSeed(seed(path, folder))` returns `path` and `folder` for valid folders and `none`; adversarial cases cover a path holding the marker text, a missing prefix and a relative path.
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
| Unit | `parseClaimSeed` round trip, `usableGoalPacket` export | `relaunch-core.test.cjs` |
| Integration | Seeded first launch per runtime with a stub runtime: one test per seed position (at least Claude positional and one flag form: OpenCode `--prompt`, Hermes `-q` or Devin `--`) plus one with `--standalone` prepended, each asserting the operator's other arguments survive; consume goal switch | `skilled-loop.test.cjs`, `goal-handover.test.cjs` |
| Manual | Optional Pi claim of a goal-bearing note | Terminal |

Baseline before the first edit, rerun after, report the delta:

```bash
node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs
npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 consume-locked-withdraw | Internal | Yellow | This phase cannot start |
| `goalPacketProblem`, `goalSwitchOn` in the core | Internal | Green | None; already exported |
| Phase 006 (built after this one) | Internal, downstream | Planned | 006 changes goal-switch handling around consume and `usableGoalPacket`; it edits the copy this phase moves into the core |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a regression in consume's goal switch or the inherited-packet test.
- **Procedure**: revert the phase commit; the wrapper falls back to unbound manual launches.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (baseline + red tests) ──► Core (parser, helper move, wrapper step) ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 002 Complete | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Core Implementation | Med | 3-4 hours |
| Verification | Low | 1 hour |
| **Total** | | **5-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline test counts recorded
- [ ] No feature flag needed; the step only runs on seeded starts
- [ ] Inherited-packet test green

### Rollback Procedure
1. Revert the phase commit.
2. Rerun both test commands.
3. Confirm the inherited-packet test passes.
4. No stakeholder notice; the change is local tooling.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
