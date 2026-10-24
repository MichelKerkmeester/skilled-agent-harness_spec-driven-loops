---
title: "Implementation Plan: Phase 25: goal-binding-record-and-launcher"
description: "Add an optional goal_packet field to the hand-over note, resolve it per sender runtime at prepare and keep, carry it through claim and the launcher environment, and add the SESSION_RELAUNCH_GOAL switch."
trigger_phrases:
  - "goal binding record launcher plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 25: goal-binding-record-and-launcher

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS), Bash wrapper |
| **Framework** | The shared relaunch core, the relaunch CLI and the `skilled-loop` wrapper |
| **Storage** | Handoff note frontmatter and the goal records under the runtime state directory |
| **Testing** | `node --test` over the relaunch suites, with the loop environment set and unset |

### Overview
Resolve the packet once at prepare and keep, write it as an optional note field, print it at claim and export it from the wrapper. The switch turns off the print and the export.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] Phase 024 verdicts read if they are in, though they are not required

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
- [ ] The gate passes in all three environments against the recorded baseline
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared core library with thin runtime adapters and a CLI the wrapper calls.

### Key Components
- **relaunch-core.cjs**: Owns the field, its validation and the per-runtime resolver.
- **session-relaunch.cjs**: Writes the field at prepare and keep and prints it at claim.
- **skilled-loop**: Exports the packet to the receiver and honors the switch.

### Data Flow
Prepare resolves the packet and writes it into the note. The wrapper reads the note on relaunch and exports `SESSION_RELAUNCH_GOAL_PACKET`. The receiver adapters read it in phases 26 and 27.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| lib/relaunch-core.cjs | Owns note validation | Update | Table tests for valid, missing, outside-root and no-goal.md cases |
| bin/session-relaunch.cjs prepare, keep and claim | Write and print the note | Update | CLI tests over each runtime value |
| bin/skilled-loop | Starts the receiver | Update | Wrapper runtime suite with the switch on and off |
| claude/, codex/, pi/, opencode/, hermes/ adapters | Read the claim output | Unchanged here | The conformance suite still passes |

Required inventories:
- Same-class producers: `rg -n "spec_folder" .skilled/hooks/session-relaunch .skilled/bin/skilled-loop` lists every place the note field is read or written.
- Consumers of the note frontmatter: the CLI, the nudge text, the compaction pointer and `/speckit:handoff`.
- Matrix axes: sender runtime (seven), goal present or absent, switch on or off.
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
| Unit | Field validation and the resolver | `node --test` |
| Integration | Prepare to claim to launcher export | `node --test` with a stub runtime |
| Manual | One wrapper hop printing the packet | tmux |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 023 hand-over path | Internal | Green | The wrapper cannot read the packet |
| Claude session log format | External | Yellow | Claude falls back to `spec_folder` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A note with the new field fails to claim on any runtime, or the relaunch gate drops below baseline.
- **Procedure**: Revert the phase diff. Older notes never carried the field, so nothing needs migrating.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Resolver ──► Note field ──► Claim output ──► Launcher export
                    └──► Switch ─────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Resolver and field | None | Claim output |
| Claim output | Field | Launcher export |
| Launcher export | Claim output | Phases 26 and 27 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Core Implementation | Med | 4 to 6 hours |
| Verification | Med | 2 hours |
| **Total** |  | **7 to 9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline gate numbers recorded in all three environments
- [ ] Claude log format re-read

### Rollback Procedure
1. Revert the diff for the core, CLI, wrapper, command and tests.
2. Rerun the relaunch gate.
3. Confirm an older note still claims.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the field is optional and older notes never carried it.
<!-- /ANCHOR:enhanced-rollback -->

---
