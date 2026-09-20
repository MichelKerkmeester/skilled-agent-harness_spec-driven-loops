---
title: "Goal: Phase 3: hub-mode-registration"
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
    packet_pointer: "cli-jev/001-cli-jev-creation/003-hub-mode-registration"
    last_updated_at: "2026-09-20T13:25:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Repointed after the packet move; the directive records the landed registration"
    next_safe_action: "None; the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: hub-mode-registration

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet warns past 3000
> characters and fails past 4000, measured from the frontmatter's closing fence
> to the log anchor; the runtime goal surfaces cap what they hold, and a
> truncated objective loses its tail, which is where the criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** `cli-jev` is reachable, enforced and served: the transport is registered on every routing surface, the hub gate holds at eight modes, and the compiled policy serves the rebuilt hash.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The transport selects and never authorizes: its authority edge is `evidenceOnly`, and commit authority stays with the actor modes |
| D2 | `tieBreak` places the transport after every workflow mode, so a workflow intent never loses to a judgment intent |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend this file's
chat slice so the operator can update their copy. The chat slice is the
durable slice without its frontmatter, HTML comments, anchor markers, `---`
dividers or heading section numbers, and `goal.cjs packet` prints it as
`chat_slice`. Never send more than 4000 characters: cut this file first. Keep
reminding while the copy stays unset, and never stop work for it. A child goal
change that alters a parent decision or criterion is an amendment to the
parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] `parent-skill-check.cjs .skilled/skills/cli-external-orchestration` reports all hard invariants passed at eight modes
- [x] `compiled-route-status.cjs --hub cli-external-orchestration` reports `compiled-serving` with the rebuilt policy hash
- [x] Both dispatch suites pass, including the fixture pairs for the jev shape
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
| Registration landed | Done | transport entry and `transport-axis` extension in `mode-registry.json`; `tieBreak` ordered after the workflows |
| Compiled policy rebuilt | Done | `build-artifacts.cjs` printed the new effective policy hash; the serving manifest was re-minted and reported fresh |
| Dispatch shape added | Done | the jev row in `dispatch-audit.mjs` plus fixture pairs; both suites green |

### Deviations and findings

| Item | Note |
|------|------|
| The compiled hub refused the registry entry on first build | It read `cli-jev` as a CLI workflow actor; the transport role was declared in the shared schema, so the registry compiler learned it rather than the schema bending |
| The decision contract refused a policy where a non-actor holds commit authority | The transport edge became `evidenceOnly`; it selects a target and does not authorize one |
<!-- /ANCHOR:log -->
