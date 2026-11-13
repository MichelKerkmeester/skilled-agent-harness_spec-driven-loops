---
title: "Implementation Plan: Phase 1: workflow-reentry-seed"
description: "Change two prose builders in nudge.cjs and the manual command doc. Add one failing case per builder change to nudge.test.cjs first. Prove it with the nudge suite, the claim guard and strict validation."
trigger_phrases:
  - "workflow reentry seed plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: workflow-reentry-seed

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`) and Markdown |
| **Framework** | None, Node built-ins and `node:test` |
| **Storage** | None, the handoff note is a Markdown file |
| **Testing** | `node --test` |

### Overview
Change two prose builders in `nudge.cjs` and the manual command doc. Add one failing case per builder change to `nudge.test.cjs` first. Prove it with the nudge suite, the claim guard and strict validation.
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
- [ ] `node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 with `fail 0`
- [ ] `node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two prose builders, one note shape.

### Key Components
- **`handoffText`**: builds the sender steps and the note shape. It fails today because the note has no `Active command:` line or Codex goal.
- **`seedText`**: builds the receiver steps. It fails today because the only work step is Continue the work.
- **`handoff.md`**: mirrors both for the manual command. It fails today because it describes the old shape.

### Data Flow
The sender writes the note with the command under In-flight state. `prepare` records the note for the hop. `claim` prints the body. The seed reads the line and tells the receiver to run the command again. The command's own state detection picks the step.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `nudge.cjs` `handoffText` | Producer of the sender text and the note shape. | update | `nudge.test.cjs` active command, lock and Codex cases. |
| `nudge.cjs` `seedText` | Producer of the receiver text. | update | `nudge.test.cjs` re-run and goal read cases. |
| `handoff.md` | Manual mirror of the note and the steps. | update | The `rg` check in REQ-006. |
| `session-relaunch.cjs` `claim` | Prints the note body verbatim. | unchanged | `session-relaunch-cli.test.cjs` claim case. |
| `relaunch-core.cjs` `parseHandoff` and `validateHandoff` | Accept unknown keys and unknown body lines. | unchanged | `relaunch-core.test.cjs` suite. |
| `nudge.test.cjs` | Test harness and the pinned note shape. | update | The five new cases. |
| `.skilled/commands/deep/assets/*.yaml` | Acquire the deep-loop lock. | unchanged, the sender releases it | `rg -n 'loop-lock.cjs acquire' .skilled/commands/deep/assets`. |
| The relaunch record | Carries hop state. | not a consumer | `session-relaunch-cli.test.cjs` record cases. |

Required inventories:
- Same-class producers: `rg -n 'In-flight state|Remaining work' .skilled/hooks/session-relaunch/lib/nudge.cjs .skilled/commands/speckit/handoff.md` lists both producers and the shape text.
- Consumers of changed symbols: `rg -n 'handoffText|seedText' .skilled .opencode --glob '*.cjs' --glob '*.mjs' --glob '*.ts'` lists the adapters and the tests. No signature changes, so no consumer edits.
- Matrix axes: runtime (claude, pi, opencode, codex, cursor, devin) x loop state (inside, outside) x spec folder (bound, none, empty) x command presence (named, none) x goal presence (`goal.md`, no `goal.md`, Codex `Active goal:` line). The new cases cover the Codex inside-loop row, a non-Codex inside-loop row, the bound and skipped seed rows, and the no-command and no-goal edge rows.
- Algorithm invariant: prose only. No parser, path or redaction is added. `parseHandoff` keeps unknown keys and `validateHandoff` keeps unknown body lines. The seed instruction never reads a file in code.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup reads the two builders and records the pinned step counts. Implementation adds one failing case per change, then the line or step, in `nudge.cjs` and `handoff.md`. Verification runs the nudge suite, the claim guard and strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `handoffText` and `seedText` string cases | `node --test` |
| Integration | `claim` prints the note body and `prepare` records the note | `node --test` |
| Manual | None, every claim is a string assertion | n/a |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node.js with `node --test` | Internal | Green | The suite cannot run. |
| `loop-lock.cjs` release CLI | Internal | Green | The lock step names a command that does not exist. |
| No new package | External | Green | None. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A new step makes the note invalid or a deep loop worsens.
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
| Verification | Implementation | 002-pi-bind-once |
<!-- /ANCHOR:phase-deps -->

---
