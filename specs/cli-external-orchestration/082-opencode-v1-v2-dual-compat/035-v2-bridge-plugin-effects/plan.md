---
title: "Implementation Plan: OpenCode 2 bridge delivers the tool names and session events plugins act on"
description: "Adds tool aliases, a once-per-session synthesized session.created and richer message events to the v2 bridge, then reruns the live plugin playbook on both versions."
trigger_phrases:
  - "v2 bridge plugin effects plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: OpenCode 2 bridge delivers the tool names and session events plugins act on

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (ES modules) |
| **Framework** | OpenCode 2.0.32 plugin API through `dualPlugin` |
| **Storage** | None |
| **Testing** | `node --test`, the plugin purity vitest, live `opencode run` and `opencode2 run --standalone` |

### Overview
Every repository plugin is a v1 server wrapped by `dualPlugin`, so the v1 shapes a plugin reads can be supplied in one place. The bridge renames two v2 tools for the hooks and maps argument changes back, delivers `session.created` once per session from whichever path sees the session first, and gives the mapped message events the fields the v1 events carry. The live playbook from 034 then reruns on both versions.
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
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other - an adapter between the OpenCode 2 plugin API and v1 plugin hooks.

### Key Components
- **Tool aliases**: `shell` is reported as `bash`, with the shell result's text as a string `output`; `subagent` is reported as `task` with `subagent_type` beside `agent`. On the way back, the added field is removed and a changed value lands on `agent`.
- **Session start**: a per-setup map of session ids. The first session-scoped event, or the first system transform, for an unseen id delivers `session.created` with `{ sessionID, info: { id } }` before anything else. A real `session.created` for a seen id is dropped; one for an unseen id is delivered and recorded.
- **Message events**: the `session.step.ended` mapping adds a top-level `sessionID` and `info.time.completed` from the event's `created` time; the text mapping adds a top-level `sessionID`; a `session.inbox.enqueued` user item maps to a user `message.updated` and a text `message.part.updated` that share the inbox id.

### Data Flow
v2 event stream and hooks, then the bridge (aliases, session start, mappings), then the unchanged v1 plugin hooks, then any argument change back to v2 under the v2 names.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Unit tests in `.opencode/plugins/tests/v2-bridge.test.cjs` cover each mapping with a happy path and one edge. The full plugin suite and the purity vitest run before and after. The live playbook from 034 reruns all 17 scenarios on OpenCode 1 and 2 with `llmgateway/deepseek-v4.1-flash` at high effort, and the matrix is rewritten from that evidence.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

OpenCode 2.0.32's event envelope (`created`), its `session.inbox.enqueued` user item, and its `execute.before` and `execute.after` hook events, all observed in the 2026-10-20 probe under `scratch/live-runs/raw-probe.txt`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commits. Only the bridge, its tests, the plugin docs and the playbook runner change, so a revert restores 034's behaviour, where the seven plugins load on v2 and do nothing.
<!-- /ANCHOR:rollback -->

---

