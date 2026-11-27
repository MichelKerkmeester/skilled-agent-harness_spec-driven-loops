---
title: "Implementation Plan: Phase 1: chat-ux-and-pane-map"
description: "Seven design documents and one sample payload in design/, written against the terminal screen's frame grammar and key map and against the packet contracts, so the runtime child and the pane child build without a design decision of their own."
trigger_phrases:
  - "chat ux plan"
  - "chat pane design plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: chat-ux-and-pane-map

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and one JSON file. No code |
| **Framework** | None |
| **Storage** | `design/` in this child folder |
| **Testing** | `perl`, `rg`, `awk` and `node -e` checks that run without a tty |

### Overview
The chat surface is designed in the screen's own terms. The frames reuse the seven bands and the 72 and 47 column split, the keys add one context to the six and the component rows extend the screen's inventory with the same closed-state rule. The pane contract fixes the two calls and the one thing the screen's architecture cannot carry, a call that lasts a whole bot run, by giving the send a worker thread of its own. The runtime-facing documents, the loop, the routing grammar and the conversation block, are written against `contracts/` and decide only what those contracts leave to 010.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `rg -n '^\| 6 \| Chat' specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/design/component-inventory.md` prints the placeholder row, the gap this phase closes
- [x] The ten files in `specs/system-skilled-bots/003-openbot-parity-build/contracts/` exist, and `contracts/decisions.md` row D2 reads `Taken`

### Definition of Done
- [x] The frame check in `tasks.md` prints `frames=26 bad=0`
- [x] The label check in `tasks.md` prints `0`
- [x] Every acceptance criterion reads `Met`, or `Unmet` only for AC-008 while the operator's approval is outstanding
- [x] `validate.sh --strict` on this folder prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Design contract: each document owns one subject, and a build child that disagrees with one names the conflict rather than resolving it silently.

### Key Components
- **`design/mockups.md`**: the frames. Owns the layout of the Chat tab body and the drawing rule per message.
- **`design/key-map-delta.md`**: the keys. Owns the `chat` context, every chat key, its label and its footer line.
- **`design/component-rows.md`**: the states. Owns the closed state list of each chat component.
- **`design/pane-contract.md`**: the pane's calls, payload, send worker and the screen edits it needs.
- **`design/loop-transcript.md`**: the loop's printed form and the text forms of the verb.
- **`design/routing-grammar.md`**: the `@<bot-id>` grammar and the defaults.
- **`design/prompt-boundary.md`**: the conversation block, its cap, the overflow example and the injection boundary.

### Data Flow
`002-conversation-runtime-and-chat-verb` reads the routing grammar, the loop transcript and the prompt boundary, and builds the verb and the renderer to them. `003-chat-pane-and-proof` reads the mockups, the key map delta, the component rows and the pane contract and asserts its buffers against the frames.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification checkboxes and task state.

Setup confirms the screen's design documents and the contracts this phase reads. Implementation writes the seven documents and the sample. Verification runs the frame check, the label check, the payload check and the validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Shape | Every frame is 24 or 40 lines and exactly its width | The `perl` frame check in `tasks.md`, which counts characters |
| Coverage | Every drawn label of the key map delta appears in a frame | The label check in `tasks.md` |
| Shape | The sample payload is the three-key envelope with nine-key messages | `node -e` in `tasks.md` |
| Count | Thirteen state headings, thirteen index rows | `rg -c` |
| Arithmetic | The worked overflow in `design/prompt-boundary.md` section 3 adds up | `node -e` in `tasks.md`, which recomputes the four totals |
| Packet | The child validates | `validate.sh --strict` |

The frame check is Perl because `awk` here counts bytes, and the box-drawing rule is three bytes per character. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/001-ux-and-component-map/tasks.md:41]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The screen's design documents in `003-terminal-screen/001-ux-and-component-map/design/` | Internal | Green | The frames would have no grammar to follow |
| The screen's `design/architecture.md` | Internal | Green | The worker rule would have no baseline to change |
| `contracts/` | Internal | Green, frozen | The payload, record, refusal and prompt rules would be undecided |
| The gitignored `specs/system-skilled-bots/context/` | External | Present in this worktree | The turnstone and openhuman pointers cannot be followed. The documents still stand |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the operator rejects the key map delta, or a build child finds a frame it cannot draw.
- **Procedure**: revert the commit that adds `design/`. Nothing else reads it until the two build children start, so no code depends on it.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The screen's design documents and the contracts | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | The handoff to `003-chat-pane-and-proof`, which also waits on the key map approval |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:external-orchestration -->
## 8. External orchestration

The executor roster, the effort policy, the fallback ladder, the dispatch rules and the self-invocation guards are the ones `../002-conversation-runtime-and-chat-verb/plan.md` section 8 writes out for this phase parent. This child adds one wave table.

| Wave | Task ids | Files | Executor | Effort | Workers | Verify |
|------|----------|-------|----------|--------|---------|--------|
| 0 | T001 to T003 | none, three reads | `cli-mistral-vibe` at `deepseek-flash` | `max (fixed)`, fallback at `high` | 1 | The three setup checks print what they say |
| 1 | T004 to T007 | `design/mockups.md`, `design/key-map-delta.md`, `design/component-rows.md` | `cli-mistral-vibe` at `deepseek-flash` | `max (fixed)`, fallback at `max` | 1, because the three files share one state index | The frame check and the label check |
| 2 | T008 to T011 | `design/pane-contract.md` with its sample, `design/loop-transcript.md`, `design/routing-grammar.md`, `design/prompt-boundary.md` | `cli-mistral-vibe` at `deepseek-flash` | `max (fixed)`, fallback at `max` | 2: the pane contract with its sample, and the three runtime-facing files | The payload check and the arithmetic check |
| 3 | T012 to T016 | none | the orchestrator | none | 1 | The validator |
<!-- /ANCHOR:external-orchestration -->
