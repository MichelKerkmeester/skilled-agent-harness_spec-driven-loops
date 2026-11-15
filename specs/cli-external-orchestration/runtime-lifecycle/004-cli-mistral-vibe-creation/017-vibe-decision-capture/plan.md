---
title: "Implementation Plan: Phase 17: vibe-decision-capture"
description: "Map Vibe's ask_user_question answer list into the shared decision queue through a silent post_tool adapter and a save-time journal sweep that share one mapper, and add a turn-start save nudge. Prove it with fixture tests and one operator-run interactive session."
trigger_phrases:
  - "vibe decision capture plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 17: vibe-decision-capture

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ES modules, TOML hook registration |
| **Framework** | Vibe 3.1.2 `post_tool` hooks and the shared queue core `.skilled/hooks/decision-capture/lib/capture-core.mjs` |
| **Storage** | The existing gitignored decision queue the core writes; no new store |
| **Testing** | `node --test` fixture tests and one operator-run interactive session |

### Overview
One mapper in `bin/sweep-vibe.mjs` turns Vibe's `answers` list into the question-keyed object `normalizeAskUserQuestion` reads, so the live adapter and the sweep write the same keys, which is how the Devin and DSH adapters share their mappers. The live adapter mirrors `claude/ask-capture-posttooluse.mjs:41-69`: silent, fail-open, `appendRecords` on a match. The nudge rides on the phase 015 turn-start composer through `takeNudge` (`capture-core.mjs:419`).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 014 records whether `post_tool` fires for `ask_user_question` and its `tool_output` shape, or names the TUI procedure that will (`rg -n 'ask_user_question' ../014-vibe-journal-fixture-and-reader/implementation-summary.md` prints the finding)
- [ ] The 014 journal reader exists (`ls .skilled/hooks/shared/session-readers/vibe.mjs` prints the path)
- [ ] `node --test .skilled/hooks/decision-capture/lib/capture-core.test.mjs` prints `fail 0` before any change

### Definition of Done
- [ ] `node --test .skilled/hooks/decision-capture/vibe/ask-capture-post-tool.test.mjs .skilled/hooks/decision-capture/bin/sweep-vibe.test.mjs` prints `fail 0`
- [ ] `node --test .skilled/hooks/decision-capture/lib/capture-core.test.mjs` prints `fail 0`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared mapper, two producers.

### Key Components
- **Answer mapper** (`bin/sweep-vibe.mjs`, `vibeAnswerRecords`): list to question-keyed object, then the shared normalizer. Without it the normalizer returns zero records for every Vibe answer.
- **Live adapter** (`vibe/ask-capture-post-tool.mjs`): appends records the moment the operator answers. Without it, capture waits for a save.
- **Sweep** (`bin/sweep-vibe.mjs` CLI): replays the journal at save time. Without it, an answer the hook missed is lost.
- **Nudge part** (inside `session-lifecycle/vibe/turn-start.mjs`): reminds the model to save. Without it, the queue fills silently.

### Data Flow
The operator answers `ask_user_question`. Vibe runs the `post_tool` entry with `tool_call_id`, `tool_input.questions` and `tool_output.answers`. The adapter maps the list, normalizes it with `runtime: 'vibe'` and the call id as the tool-use id, and appends. At save time the sweep reads the journal's question tool calls through the 014 reader and appends the same keys, which the core skips as duplicates. On the next operator turn, the nudge part calls `takeNudge` and adds one line when the count rose.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the phase 014 item (d) finding and runs the core suite for a baseline. Implementation adds the mapper and sweep, the live adapter, the nudge part and its test cases, the tests, the `hooks.toml` entry, the README rows and the save-command and save-workflow lines that call the sweep. Verification runs the fixture tests, the core suite and one operator-run interactive session. `tasks.md` holds the ordered steps.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`sweep-vibe.test.mjs` covers the mapper (one answer, an `is_other` answer, a multi-select answer joined with `, `, `cancelled: true`) and the sweep (a journal whose answer the hook already queued produces no duplicate). `ask-capture-post-tool.test.mjs` spawns the adapter against a temp project directory with the Measured Behavior payload, a payload for another tool, a qualified tool name and malformed stdin. The interactive session is the only proof that the hook fires on the real tool. `turn-start.test.mjs` gains two save-nudge cases: a rise injects one reminder line, and the next turn at the same count injects nothing.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`vibe 3.1.2`, Node.js, `.skilled/hooks/decision-capture/lib/capture-core.mjs`, the phase 014 journal reader and item (d) finding, and the phase 015 turn-start composer. The operator for the interactive session. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the adapter slows the question tool or writes malformed records. Remove the `ask_user_question` entry from `.vibe/hooks.toml`, then revert the phase's commit. `isHookEnabled('decision-capture')` is checked first, so the `decision-capture` concern switch disables the adapter and the nudge without a revert.
<!-- /ANCHOR:rollback -->

---
