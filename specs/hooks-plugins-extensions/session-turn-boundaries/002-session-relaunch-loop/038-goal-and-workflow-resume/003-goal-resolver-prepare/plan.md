---
title: "Implementation Plan: Phase 3: goal-resolver-prepare"
description: "Add a hand-over packet fallback for Devin and Cursor, a reason sibling that lets prepare print why a goal was not carried, a bounded headline search outside the lineage, and a manual-route text for the two runtimes with no relaunch hook. Prove it with the two session-relaunch suites and strict validation."
trigger_phrases:
  - "goal resolver prepare plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: goal-resolver-prepare

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`) |
| **Framework** | None, Node built-ins and `node:test` |
| **Storage** | None, the goal record and the handoff note are files |
| **Testing** | `node --test` |

### Overview
Extend `resolveGoalPacket` with a Devin and Cursor hand-over fallback and a bounded headline search, and add a sibling that reports why no packet was found. Print that reason on stderr from the shared goal-recording helper and branch the prepared text for the two runtimes with no relaunch hook. Prove it with the two session-relaunch suites and strict validation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with `fail 0`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/003-goal-resolver-prepare --strict` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two resolver readers, one reason sibling.

### Key Components
- **`resolveGoalPacket` and its reason sibling**: own the record lookup, the Claude log read, the Devin and Cursor hand-over fallback and the bounded headline search. A sibling is added rather than a changed return type, because the CLI path and the existing cases read a string, so a changed type would break them. They fail today because the hand-over variable is not read, the search stops at the lineage and every failure collapses to `''`.
- **`recordGoalPacket` in the CLI**: writes the resolved packet into the note and prints the reason when a known goal was not found. It fails today because it drops the reason and prints nothing.
- **`prepare` text**: names the manual route for Cursor and Devin. It fails today because one text serves every runtime.
- **The two test files**: hold the must-fail cases and the guards.

### Data Flow
`prepare` or `keep` resolves the sending session's goal from a record, a Claude log, the hand-over variable or the headline search. The packet is written into the note. When a known goal cannot be carried and the switch is on, one `goal not carried:` line goes to stderr. `prepare` then writes the runtime's prepared text, which names the manual route for Cursor and Devin.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `relaunch-core.cjs` `resolveGoalPacket` | Producer of the goal packet. | update | `relaunch-core.test.cjs` fallback and headline cases. |
| `relaunch-core.cjs` `goalPacketProblem` | Policy that accepts a packet path. | unchanged | `goalPacketProblem` cases. |
| `relaunch-core.cjs` `recordGoalPacket` | Writes the goal field into a note. | unchanged | Existing record cases. |
| `session-relaunch.cjs` `recordGoalPacket` | Resolves and records the goal for prepare and keep. | update, prints the reason | `session-relaunch-cli.test.cjs` reason cases. |
| `session-relaunch.cjs` `prepare` text | Prints one prepared text for every runtime. | update | The exact-stdout cases. |
| `session-relaunch.cjs` `keep` | Shares the goal-recording helper. | update through the helper | Existing prepare and keep goal cases. |
| `nudge.cjs` and `handoff.md` | Carry the Codex note prose. | not a consumer, phase 001 owns it | `rg -n 'Active goal' .skilled/hooks/session-relaunch/lib/nudge.cjs`. |
| The relaunch record | Carries hop state. | not a consumer, no field change | Existing record cases. |

Finding classes: F4 is `class-of-bug` because two runtimes share the record-keyed lookup, F6 is `algorithmic` because a bounded search replaces a lookup, F7 is `cross-consumer`, F1's signal half is `instance-only`, and N6 is `class-of-bug` because one prepared text serves every runtime.

Required inventories:
- Same-class producers: `rg -n 'resolveGoalPacket|goalPacketProblem' .skilled/hooks/session-relaunch` lists the resolver, its callers and the validator.
- Consumers of changed symbols: `rg -n 'resolveGoalPacket|recordGoalPacket' .skilled .opencode --glob '*.cjs' --glob '*.mjs' --glob '*.ts'` lists the CLI and the tests. The string return stays, so no consumer signature changes.
- Matrix axes: runtime (claude, codex, pi, opencode, devin, cursor) x record (present, absent) x variable (set, unset, bad) x goal source (record, Claude log, Codex none) x packet location (lineage, outside lineage, duplicate headline) x loop (inside, outside). The new cases cover the Devin and Cursor absent-record row with a set variable, the four-runtime guard row, the Claude free-text row, the Codex row, the unique outside headline row, the duplicate headline row and the Cursor and Devin inside-loop text row.
- Algorithm invariant: a packet is returned only when `goalPacketProblem` accepts it and, for the headline search, exactly one `goal.md` under `specs/` carries the headline. The walk skips `scratch/`, `lineages/` and `z_archive/` and never accepts a path that resolves outside a root.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the resolver and the prepare text and records the baseline of both suites. Implementation adds one failing case per change, then the change, in `relaunch-core.cjs` and `session-relaunch.cjs`. Verification runs both suites, the guard cases and strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `resolveGoalPacket`, the reason sibling and the headline search | `node --test` |
| Integration | `prepare` and `keep` stdout and stderr | `node --test` |
| Manual | None, every case is a string or exit-code assertion | n/a |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node.js with `node --test` | Internal | Green | The suites cannot run. |
| `goal-core.cjs` record readers | Internal | Green | The fallback cannot prove a record miss. |
| No new package | External | Green | None. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The headline search returns a packet that two packets share, or prepare prints a reason when the sender had no goal.
- **Procedure**: Revert the one commit. No record, schema or generated file changed.
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
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | 004-claude-start-claim |
<!-- /ANCHOR:phase-deps -->

---
