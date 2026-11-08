---
title: "Ask-surface guard"
description: "Sends a turn that ends in a typed option menu, with no question-tool call, back once to ask through the runtime's question tool, and logs an advisory where a runtime cannot send a turn back."
trigger_phrases:
  - "ask surface guard"
  - "prose option menu guard"
  - "question tool enforcement"
  - "typed option menu"
version: 1.0.0.0
---

# Ask-surface guard

This catalog entry maps the ask-surface guard's behavior to its implementation files, validation tests and operator reference.

## 1. OVERVIEW

An operator decision belongs in the runtime's question tool, where the answer is structured and decision capture can record it. A reply that ends in a typed A/B/C or 1/2/3 menu asks the same question in a form neither has. The guard catches that turn as it ends and sends it back once with one instruction: ask that question through the tool. `communication-handoff.md` §4 states the rule, and §5 names each runtime's tool.

This feature is cataloged under UX hooks because it is a turn-end hook on every runtime.

---

## 2. HOW IT WORKS

### Detection

The shared core reads the closing lines of the turn. A menu is two or more sequential labels starting at A or 1, closing the message, with a question on the line just above or after them. Code fences, inline code, quotes, tables and headings are stripped first, so an example menu inside them never counts. A turn that called the runtime's question tool passes, and so does a session with no question tool.

### Send-back

Claude Code's synchronous Stop hook returns `decision: "block"` with the instruction as its reason, and does nothing when `stop_hook_active` is set. A slash command counts as the operator's prompt, so a question asked in an earlier turn never excuses this one. DSH steers the agent at `agent/turn-stopping` and skips headless, fan-out leaf and child sessions. OpenCode re-prompts through `session.promptAsync` on `session.idle`. Pi starts one follow-up turn from `agent_end`, only in a session with a UI. Codex and Devin cannot block a finished turn, so they write an advisory to stderr only.

Each enforcing runtime sends a turn back at most once. Claude Code relies on `stop_hook_active`, and DSH, OpenCode and Pi key a marker on the operator's turn, so a model that repeats the menu still ends its turn.

### Fire log and kill switch

Every fire appends one line to the gitignored `.skilled/skills/.state/ask-surface/fires.jsonl`, with the runtime and whether it sent the turn back or only advised. `SYSTEM_ASK_SURFACE_DISABLED=1` turns the guard off on every runtime.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs` | Hook core | Menu detector, verdict, per-turn marker, fire log and the instruction text per runtime. |
| `.skilled/hooks/ask-surface-guard/lib/advisory-stop.cjs` | Hook core | Codex and Devin Stop runner: stderr advisory and a fire line, never a block. |
| `.skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs` | Claude adapter | Synchronous Stop guard that reads the turn from the transcript. |
| `.skilled/hooks/ask-surface-guard/codex/ask-surface-stop.cjs` | Codex adapter | Advisory Stop entry point. |
| `.skilled/hooks/ask-surface-guard/devin/ask-surface-stop.cjs` | Devin adapter | Advisory Stop entry point. |
| `.skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs` | DSH adapter | `agent/turn-stopping` steer, linked from `.dsh/plugins/repo-guards/adapters/`. |
| `.skilled/hooks/ask-surface-guard/pi/ask-surface-guard.ts` | Pi extension | `agent_end` follow-up turn, linked from `.pi/extensions/`. |
| `.opencode/plugins/ask-surface-guard.js` | OpenCode plugin | `session.idle` re-prompt through `session.promptAsync`. |
| `.opencode/plugins/lib/v2-bridge.js` | OpenCode bridge | Carries OpenCode 2 tool parts into the v1 message shape, so the plugin sees a `question` call. |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Registry | The Claude, Codex and Devin Stop entries and the Pi extension. |
| `.skilled/repo-rules/communication-handoff.md` | Rule | §4 structured-choice rule and §5 question tool per runtime. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/hooks/ask-surface-guard/lib/ask-surface-core.test.mjs` | Automated test | The ten detector fixtures, the marker and the fire log. |
| `.skilled/hooks/ask-surface-guard/lib/advisory-stop.test.mjs` | Automated test | Codex and Devin advise and never block; kill switch and bad payload stay silent. |
| `.skilled/hooks/ask-surface-guard/claude/ask-surface-stop.test.mjs` | Automated test | Block once, re-entrant stop, slash-command and earlier-turn boundaries, kill switch. |
| `.skilled/hooks/ask-surface-guard/tests/dsh-ask-surface-guard.test.mjs` | Automated test | Steer once per turn, headless sessions skipped, kill switch, fail open. |
| `.skilled/hooks/ask-surface-guard/pi/ask-surface-guard.test.ts` | Automated test | One follow-up per operator turn across loops, no UI skipped, kill switch. |
| `.opencode/plugins/tests/ask-surface-guard.test.cjs` | Automated test | Prompt once, a question call passes, kill switch and failing client. |
| `.opencode/plugins/tests/v2-bridge.test.cjs` | Automated test | OpenCode 2 tool parts reach the v1 message shape. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/ask-surface-guard-live-conversation.md` | Manual playbook | A live decision reaches the question tool on Claude Code, OpenCode and Pi. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/ask-surface-guard-devin-advisory-conversation.md` | Manual playbook | Devin only advises, and the decision still reaches the pane. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/ask-surface-guard-kill-switch-conversation.md` | Manual playbook | The kill switch leaves no fire on four runtimes. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/ask-surface-guard-no-false-positive-conversation.md` | Manual playbook | A numbered summary records no fire. |

---

## 4. SOURCE METADATA

- Group: UX Hooks
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `ux-hooks/ask-surface-guard.md`
- Related reference: `.skilled/hooks/README.md`
