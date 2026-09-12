---
title: "Goal: Runtime surfaces"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/036-goal-unification/005-runtime-surfaces"
    last_updated_at: "2026-09-11T07:40:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-system-spec-kit-goals"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Runtime surfaces

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give pi, opencode, cursor and devin a goal command over the packet goal.md, and give Claude Code and Codex nesting without a new /goal.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Claude Code and Codex keep their native goal command; nothing named /goal is added there. |
| D2 | Every command file is authored through sk-create-command templates. |
| D3 | opencode-goal.js is either converged with goal-core or declared a thin client, never a second implementation. |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the durable slice
of this file in chat, frontmatter excluded, so the operator can update their copy. A child goal change
that alters a parent decision or criterion is an amendment to the parent: apply
it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] Four runtime playbooks pass and are recorded
- [ ] Adapter and plugin test suites pass
- [ ] No adapter emits frontmatter, proven by a test per adapter
- [ ] `validate.sh --strict` on this folder reports RESULT: PASSED
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase scaffolded and directive authored | Done | This file, 2026-09-11 |
| OpenCode | Done | `opencode-goal.js` imports `goal-slice.cjs` (CommonJS require from ESM works, no build step); bind, resent, packet actions; packet-aware injection; 134/134 plugin tests |
| Pi | Done | `goal-context.ts` packet-aware render plus resend reminder on `input`; `/goal-pi` passes bind, resent, log, packet through the CLI |
| Cursor | Done | `goal-inject.mjs` reminder; `/goal-cursor packet <path>` session-free read; management still refused |
| Devin | Done | New `devin/goal-inject.mjs` on SessionStart and UserPromptSubmit in `.devin/hooks.v1.json`; 3 tests |
| Claude Code and Codex | Done | No `/goal`; nesting reaches them through the speckit workflows and the AGENTS.md posture row (006) |
| Playbook | Done | CLI bind, show, resent, unbind and both hook binaries run against the real 036 packet in an isolated state dir; no frontmatter in any output |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
