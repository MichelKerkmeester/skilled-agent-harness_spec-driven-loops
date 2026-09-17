---
title: "Implementation Plan: Phase 13: goal-chat-send-shape"
description: "Teach the chat slice renderer to drop heading section numbers, then state the chat slice and the 4,000-character send cap on every surface an agent reads before it sends a goal, and regenerate the snapshot, mirror, index and metadata those edits touch."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 13: goal-chat-send-shape

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS goal hook library, Markdown docs, YAML workflow assets |
| **Framework** | spec-kit goal contract, speckit lifecycle commands |
| **Storage** | None. The packet `goal.md` stays the only source of goal state |
| **Testing** | `node --test` goal suites, vitest golden snapshots, trigger index vitest, `validate.sh --strict` |

### Overview

One regex in `renderChatSlice` drops heading section numbers, so the existing `chat_slice` output
already matches the copy the operator set. The rest is wording: every surface that tells an agent
what goal text to send now names that chat slice and the 4,000-character cap, and the injected
resend reminder carries both. No length enforcement code is added. The proof is a test that failed
before the change, the real `goal.cjs packet` output on the parent, and the suites that pin the
template and the workflow block.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (the operator's decisions and the audit of every goal send surface)

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One shared projection module, several instruction surfaces. `goal-slice.cjs` is the only place the
chat slice is drawn, and the prose surfaces point agents at it instead of describing a second shape.

### Key Components
- **Chat slice renderer**: `renderChatSlice` removes HTML comments, `---` dividers and heading section numbers from the durable slice.
- **Packet read**: `goal.cjs packet` and the OpenCode plugin's packet action print the rendered slice as `chat_slice`.
- **Resend reminder**: `renderResendReminderText` is the one line Pi, Cursor, Devin and OpenCode inject while a resend is pending.
- **Instruction surfaces**: the `AGENTS.md` posture row, the spec-kit `SKILL.md`, the set-string playbook, the goal template and the speckit workflow assets.

### Data Flow

An agent edits a parent `goal.md` above its log. The slice hash changes, so the runtime injects the
reminder, or the speckit workflow reads `packet_slice_hash` at command entry. The agent runs the
packet read, takes `chat_slice`, checks it is at most 4,000 characters, and sends it in chat.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `renderChatSlice` | Producer of every chat slice | update | goal-slice suite, packet read on the parent |
| `renderResendReminderText` | Producer of the injected reminder | update | reminder assertion, hook and plugin suites |
| `goal.cjs packet`, OpenCode packet action | Consumers printing `chat_slice` | unchanged | packet read output on the parent |
| Posture row, `SKILL.md`, playbook, template, five YAML assets | Instruction surfaces | update | grep for the chat slice and the cap |

Required inventories:
- Same-class producers: `rg -n "chatSlice|renderChatSlice|renderResendReminderText" .opencode` → one renderer, two packet printers, two reminder callers (`goal-core.cjs:1178`, `opencode-goal.js:2913`).
- Consumers of changed symbols: the only test that pinned numbered headings in the chat slice is `goal-slice.test.cjs`.
- Matrix axes: heading level one to six, single and dotted numbers, a numeric heading with no section prefix.
- Algorithm invariant: only a heading whose first token is a dotted section number ending in a dot loses that token.
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
| Unit | Chat slice renderer and reminder text | `node --test .opencode/hooks/goal/lib/goal-slice.test.cjs` |
| Integration | Goal hook and plugin suites, the lifecycle workflow block | `node --test` over the goal hook and plugin tests |
| Snapshot | Goal template render | `scaffold-golden-snapshots.vitest.ts` |
| Manual | Real packet read on the parent | `node .opencode/hooks/goal/bin/goal.cjs packet <parent> --workspace <repo root>` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator decisions on the chat slice and the cap | Internal | Green | The wording would have no agreed definition |
| `sync-skills-hermes.cjs` | Internal | Green | The Hermes copy of `SKILL.md` would drift |
| `generate-trigger-index.mjs` | Internal | Green | The committed index would not reflect the edited corpus |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The operator rejects the chat slice definition or the posture wording.
- **Procedure**: `git checkout --` the edited files, then rerun the snapshot update, `sync-skills-hermes.cjs` and `generate-trigger-index.mjs` so the derived files match again.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 min |
| Implementation | Low | 45 min |
| Verification | Medium | 45 min |
| **Total** | | **~2 hours** |
<!-- /ANCHOR:effort -->

---
