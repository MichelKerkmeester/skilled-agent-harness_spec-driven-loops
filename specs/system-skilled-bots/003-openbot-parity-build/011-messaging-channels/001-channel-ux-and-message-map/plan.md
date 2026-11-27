---
title: "Implementation Plan: Phase 1: channel-ux-and-message-map"
description: "Three design documents and 23 golden files in design/, written against deliveryMessage(), the frozen contracts and the capability matrix, so the build children compare every channel message byte for byte."
trigger_phrases:
  - "channel ux plan"
  - "channel message catalog plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: channel-ux-and-message-map

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and plain text. No code |
| **Framework** | None |
| **Storage** | `design/` in this child folder |
| **Testing** | `rg`, `perl`, `ls` and `node -e` checks that run without a tty |

### Overview
Every run message is `deliveryMessage()`'s title and body, unchanged, so the catalog starts from that function and adds only what a channel must: the choice block or the buttons, the echo, the link lines and the refusal replies. Each reply is a constant with named fields and no bot-authored text. The mockups put that text into each surface's wire shape and draw what a person sees. The reply grammar closes the one input a person types. The goldens are the catalog in files, so a test compares bytes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `rg -n 'export function deliveryMessage' .skilled/skills/system-skilled-bots/runtime/lib/delivery.ts` prints line 171, the source of every run message
- [x] The nine contract files in `specs/system-skilled-bots/003-openbot-parity-build/contracts/` exist beside its `README.md`

### Definition of Done
- [x] The catalog check in `tasks.md` prints 40 and 23 and its loops print nothing
- [x] The mockup check in `tasks.md` prints 12, 0 and no `MISSING` line for the six chunk numbers
- [x] Every acceptance criterion reads `Met`
- [x] `validate.sh --strict` on this folder prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Design contract: each document owns one subject, and a build child that disagrees with one names the conflict rather than resolving it silently.

### Key Components
- **`design/message-catalog.md`**: owns the text. Every channel message and host line, its producer and its golden.
- **`design/mockups.md`**: owns the surface forms. The wire payload and the view per surface and situation, and the chunk rule.
- **`design/reply-grammar.md`**: owns what a person may type back.
- **`design/golden/`**: the catalog's text in 23 files, the input `tests/channel-transports.vitest.ts` compares against.

### Data Flow
`003-link-roster-and-answer-gate` builds the reply table in `channel.ts` from catalog rows M07 to M20 and M22 to M23 and prints M09. `004-approval-index-and-send-queue` builds the choice block of M01 and M03 and the grammar, and prints M21. `005-polling-transports` and `006-daemon-and-webhook-transports` build the wire forms of `mockups.md` and assert every chat message against its golden.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification checkboxes and task state.

Setup confirms the runtime function and the contracts this phase reads. Implementation writes the catalog, the goldens, the mockups and the grammar. Verification runs the catalog check, the mockup check, the grammar check and the validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Count | 23 catalog rows plus 17 one-line rows, 23 goldens | `rg -c`, `ls` |
| Coverage | Every chat refusal has a row | The refusal loop in `tasks.md` |
| Drift | Every golden's first line is in the catalog | The drift loop in `tasks.md` |
| Shape | Twelve mockups, every view line at most 73 columns | The mockup check in `tasks.md`, which counts characters with Perl |
| Arithmetic | The chunk sizes add up | `node -e` in `tasks.md` |
| Packet | The child validates | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `delivery.ts` | Internal | Green | The run messages would have no source |
| `contracts/` | Internal | Green, frozen | The refusal list and the answer sequence would be undecided |
| `../002-adapter-and-record-contracts/design/capabilities.md` | Internal | Written beside this child | The chunk limits and the button column would be undecided |
| The gitignored `specs/system-skilled-bots/context/` | External | Present in this worktree | The tinychannels pointers cannot be followed. The documents still stand |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the operator rejects the catalog's text, or a build child finds a message it cannot send as written.
- **Procedure**: revert the commit that adds `design/`. Nothing reads it until child 003 starts.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | `delivery.ts` and the contracts | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | The handoff to `003-link-roster-and-answer-gate` |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:external-orchestration -->
## 8. External orchestration

The executor roster, the effort policy, the fallback ladder, the dispatch rules and the self-invocation guards are the ones `../003-link-roster-and-answer-gate/plan.md` section 8 writes out for this phase parent. This child adds one wave table.

| Wave | Task ids | Files | Executor | Effort | Workers | Verify |
|------|----------|-------|----------|--------|---------|--------|
| 0 | T001 to T003 | none, three reads | `cli-mistral-vibe` at `deepseek-flash` | `max (fixed)`, fallback at `high` | 1 | The three setup checks print what they say |
| 1 | T004 to T007 | `design/message-catalog.md`, `design/golden/` | `cli-mistral-vibe` at `deepseek-flash` | `max (fixed)`, fallback at `max` | 1, because the goldens are the catalog in files | The catalog check |
| 2 | T008, T009 | `design/mockups.md`, `design/reply-grammar.md` | `cli-mistral-vibe` at `deepseek-flash` | `max (fixed)`, fallback at `max` | 2: one per file | The mockup check and the grammar check |
| 3 | T010 to T014 | none | the orchestrator | none | 1 | The validator |
<!-- /ANCHOR:external-orchestration -->
