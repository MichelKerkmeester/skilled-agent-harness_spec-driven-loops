---
title: "Implementation Plan: Phase 9: pi-arm-on-agent-settled"
description: "Moves the Pi extension arm and killer restart from agent_end to agent_settled, keeps the held nudge on agent_end, and updates tests and README."
trigger_phrases:
  - "pi arm on agent settled plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: pi-arm-on-agent-settled

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript Pi extension over CommonJS hook modules |
| **Framework** | Pi coding agent 1.4.0 extension API |
| **Storage** | Relaunch records on disk, unchanged |
| **Testing** | vitest for the Pi extension, node:test for the shared hooks |

### Overview
The `agent_end` handler at `pi/session-relaunch.ts:526` calls `armRelaunch` and then sends the held nudge. This plan splits it: a new `agent_settled` handler calls `armRelaunch` (which also restarts a killer for an unowned armed record), skips the arm when the event says `aborted`, and `agent_end` keeps only the held nudge.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Baseline of both test commands captured
- [ ] Two failing-first tests written and seen red
- [ ] `.pi/extensions/session-relaunch.ts` confirmed a symlink (it is, to `../../.skilled/hooks/session-relaunch/pi/session-relaunch.ts`)

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` Met with evidence
- [ ] Both test commands pass with no new failures against the baseline
- [ ] Held-nudge decision recorded with its Pi source line
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Event handlers registered on the Pi extension API.

### Key Components
- **`AgentSettledRegistrar` type (new)**: the ambient shim `.pi/types/pi-coding-agent.d.ts` declares only `before_agent_start`, so the file declares a local registrar with an `{ aborted?: boolean }` event, the same way `AgentStartRegistrar` and the `session_compact` registrar are declared (`session-relaunch.ts:143-159`).
- **`agent_settled` handler (new)**: loads config and modules, resolves the session id, returns when `event.aborted` is true, then calls `armRelaunch`. Its comment says why: Pi emits this event once per run from the `finally` block of `_startRun` (`agent-session.js:1471`, `:683-690`), after every retry, compaction or queued continuation (`:1450-1462`), so a continuation's `agent_start` cannot withdraw the arm.
- **`agent_end` handler**: keeps the held nudge. Decision: the nudge stays on `agent_end`, because a follow-up queued there becomes a continuation inside the same run (`agent-session.js:1562-1564`), and `agent_settled` fires only after that continuation. AC-007 checks it by a test.
- **Arm log event**: `agent-end-arm-error` (`session-relaunch.ts:323`) is renamed `agent-settled-arm-error`, with its two test assertions (`session-relaunch.test.ts:553,591`), because after the move it fires from `agent_settled` and no other file reads the name.
- **Doc comment** at `session-relaunch.ts:462`: lists `agent_settled` among the registered hooks.
- **`agent_start` handler**: unchanged. It withdraws an arm on a real operator turn.
- **`agent_start` handler**: unchanged. It withdraws an arm on a real operator turn.

### Data Flow
`message_end` holds the nudge, `agent_end` sends it as a follow-up, the model runs the prepare turn, and `agent_settled` arms the pending record and starts the killer.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `pi/session-relaunch.ts` `agent_end` | Arms and sends the held nudge | Update: nudge only | AC-001 test |
| `pi/session-relaunch.ts` `agent_settled` | Absent | Create: `AgentSettledRegistrar`, arm and killer restart | AC-001, AC-002, AC-006 tests; `tsc -p tsconfig.pi.json` |
| `pi/session-relaunch.ts` log event `agent-end-arm-error` (:323) | Logs a failed arm spawn | Rename to `agent-settled-arm-error` | Test asserts at :553, :591 |
| `pi/session-relaunch.test.ts` | 36 `'agent_end'` hits: arm-expecting ones run 364-1272, nudge-only ones 188-311 | Sort each hit into "arm: add agent_settled" or "nudge: leave"; update the arm ones | vitest run |
| `README.md` lines ~138, ~223 | Name `agent_end` as Pi's arm event | Update | `rg -n "agent_end\|agent_settled" .skilled/hooks/session-relaunch/README.md` |
| `README.md` line ~126 | Describes the held nudge on `agent_end` | Leave, the nudge stays | Same `rg` |
| `.pi/extensions/session-relaunch.ts` | Symlink | Not a consumer to edit | `ls -l` |

Required inventories:
- Test hits to sort: `rg -n "'agent_end'" .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts`, each marked "arm: add agent_settled" or "nudge: leave".
- Same-class producers: `rg -n "agent_end" .skilled/hooks/session-relaunch`.
- Consumers: `rg -n "armRelaunch|agent_settled" .skilled/hooks .pi`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Baseline before the change, rerun after, report the delta:

```bash
node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs
npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts
npx tsc -p tsconfig.pi.json
```

vitest does not type-check, so the `tsc` run is what proves the new registrar type compiles (README.md:126 names `tsconfig.pi.json` as the extension's type check).

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | "arms on agent_settled and not on agent_end", "a continuation before agent_settled leaves the record armed" (the proof of the change), an aborted settle, the held nudge sent on `agent_end` alone | vitest |
| Type check | `AgentSettledRegistrar` and the new handler | `tsc -p tsconfig.pi.json` |
| Integration | Shared hook modules unchanged | node:test |
| Manual, no-regression | One live Pi 1.4.0 hop through `skilled-loop` with `openai/gpt-6-luna`, `PI_BLACKHOLE_PASSIVE=true`. A hop succeeds on either arm event, so it shows nothing regressed, not that the change works | 031 harness `run-pi-effort.sh`, commands in `tasks.md` T010 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Pi 1.4.0 `agent_settled` | External | Green | No arm event to move to |
| 031 harness `run-pi-effort.sh` | Internal | Green | AC-005 lacks its live proof |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Pi sessions stop hopping, or the vitest suite fails after the change.
- **Procedure**: Revert the commit that touched the three files; the arm returns to `agent_end`. Phase 007 edits the same two Pi files in other regions, so revert only this phase's hunks if 007 landed after it.
<!-- /ANCHOR:rollback -->

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
| Core Implementation | Med | 1-2 hours |
| Verification | Med | 1 hour, mostly the live hop |
| **Total** | | **2.5-3.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline test output saved under `scratch/`
- [ ] No armed record left from a test run in the live loop state

### Rollback Procedure
1. Revert the commit that moved the arm.
2. Rerun the vitest suite and confirm the baseline count.
3. Run one live Pi hop to confirm the old path still arms.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
