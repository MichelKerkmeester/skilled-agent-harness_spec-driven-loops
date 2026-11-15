---
title: "Implementation Plan: Phase 16: vibe-turn-end-guards"
description: "Register one Vibe post_agent composer that reads the turn from the session journal, sends a prose option menu back once through a deny with the ask-surface reprompt, and records a completion advisory the turn-start composer injects on the next turn. Prove it with fixture tests over recorded journals and one keyed run."
trigger_phrases:
  - "vibe turn end guards plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 16: vibe-turn-end-guards

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ES modules and one CommonJS adapter, TOML hook registration |
| **Framework** | Vibe 3.1.2 `post_agent` hooks, the ask-surface core and the completion-evidence sentinel core |
| **Storage** | Gitignored state only: the ask-surface turn markers and a pending completion advisory file under `.skilled/skills/.state/` |
| **Testing** | `node --test` fixture tests over recorded journals, and one keyed `vibe` run |

### Overview
One `post_agent` composer replaces two separate hooks, because the first deny skips every later `post_agent` hook (Vibe `SKILL.md`, deny table). It reads the finished turn through the phase 014 journal reader, runs the completion part first so its advisory is always written, then runs the ask-surface part and prints at most one deny. The completion advisory reaches the model through a part added to the phase 015 turn-start composer, which is pi's next-turn delivery.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 014 records that the final reply is on disk when `post_agent` starts (`rg -n 'post_agent' ../014-vibe-journal-fixture-and-reader/implementation-summary.md` prints the finding)
- [ ] The 014 reader exists (`ls .skilled/hooks/shared/session-readers/vibe.mjs` prints the path)
- [ ] The 015 composer exists (`ls .skilled/hooks/session-lifecycle/vibe/turn-start.mjs` prints the path)

### Definition of Done
- [ ] `node --test .skilled/hooks/session-lifecycle/vibe/turn-end.test.mjs` prints `fail 0`
- [ ] `node --test .skilled/hooks/ask-surface-guard/lib/ask-surface-core.test.mjs` prints `fail 0`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Turn-end composer.

### Key Components
- **Turn-end composer** (`session-lifecycle/vibe/turn-end.mjs`): the one registered `post_agent` entry. Without it, two hooks would race for the shared three-retry budget and a deny from one would silently skip the other.
- **Ask-surface part** (`ask-surface-guard/vibe/ask-surface-post-agent.mjs`): judges the last assistant text with the shared core. Without it, a prose menu reaches the operator.
- **Completion part** (`system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs`): runs the sentinel core and writes the pending advisory. Without it, a claim is never checked.
- **Advisory delivery part** (inside `session-lifecycle/vibe/turn-start.mjs`): injects the pending advisory once. Without it, the advisory stays in the log the model never reads.

### Data Flow
Vibe ends a main turn and runs the `post_agent` entry with `transcript_path`, the session root. The composer asks the 014 reader for the last assistant text, the turn's tool calls and the current `turn_id` through the `turnId` helper. The completion part runs `evaluateCompletionEvidence` and, on `advise`, logs and writes the pending file. The ask-surface part runs `evaluateTurn`; on `fire` and a first `markTurn`, the composer prints `{"decision":"deny","reason":<repromptFor('vibe')>}` and Vibe injects it as a retry user message. On the next operator turn, the turn-start part reads and deletes the pending file and adds it to `additional_context`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the 014 findings and confirms the reader and the 015 composer exist. Implementation adds the `vibe` question-tool row, the two parts, the composer, the advisory delivery part, the fixture tests, the `hooks.toml` entry and the README rows. Verification runs the fixture tests, the renderer test and one operator-run interactive session that shows a retry in the journal. `tasks.md` holds the ordered steps.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`node --test .skilled/hooks/session-lifecycle/vibe/turn-end.test.mjs` spawns the composer against recorded 014 journals copied into a temp session root and checks: a prose-menu turn prints one deny with the Vibe reprompt; the same turn key a second time prints nothing; a child, subagent or no-question-tool session prints nothing; a completion claim writes one pending file and no deny; malformed stdin and a missing journal exit 0 with empty stdout. The turn-start part gets one case: it injects the pending advisory and deletes the file. Phase 014's fixture hook proves a `post_agent` deny becomes a retry turn; this phase's live proof is an operator-run interactive session, because a print-mode run has no question tool and the ask-surface part passes it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`vibe 3.1.2`, Node.js, the phase 014 journal reader and fixture facts, the phase 015 turn-start composer, `.skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs` and `.skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs`. `MISTRAL_API_KEY` and the operator for the interactive run. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the composer loops a turn, retries a turn without a menu, or slows turn end. Remove the `post_agent` entry from `.vibe/hooks.toml`, which disables both parts at once, then revert the phase's commit. `SYSTEM_COMPLETION_DISABLED=1` turns the completion part off and the `ask-surface` concern switch turns the reprompt off, each without a revert, because both parts check `isHookEnabled` first.
<!-- /ANCHOR:rollback -->

---
