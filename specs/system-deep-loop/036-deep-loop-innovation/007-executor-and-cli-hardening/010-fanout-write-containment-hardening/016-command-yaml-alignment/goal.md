---
title: "Goal: command yaml alignment"
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
    packet_pointer: "scaffold/016-command-yaml-alignment"
    last_updated_at: "2026-09-15T00:55:22Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Phase fix landed and criteria checked"
    next_safe_action: "Commit once the full suite exits zero"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: command yaml alignment

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

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

**Objective:** Make the four deep-loop command YAMLs drive the fan-out runner with the same flags and the same native path, and make the prompt pack describe the state-log mechanism the runtime actually implements.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every fan-out call site in the four command YAMLs passes the convergence threshold, the stop policy and the convergence mode to the runner; the confirm review YAML's native fan-out branch runs native lineages through the runner like the auto YAML, never by dispatching the leaf agent as a full-loop sub-agent. |
| D2 | The prompt-pack templates and the YAML state-log contract say the same thing about how a record reaches the state log, matching what the append gateway does; wording that claims a mechanism the runtime lacks is corrected on whichever side is wrong. |
| D3 | The compiled contracts are regenerated in the same change and the contract drift tests pass. |
| D4 | Fixed by DeepSeek V4.1 Flash at max through the gateway on cli-pi, one dispatch for this phase alone, verified by the deep-loop suite before the next phase starts. |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the durable
slice of this file in chat, frontmatter excluded, so the operator can update
their copy. Keep reminding while it stays unset; never stop work for it. A
child goal change that alters a parent decision or criterion is an amendment
to the parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] Each of the four YAML fan-out call sites passes convergence threshold, stop policy and convergence mode, proven by a contract test that renders the call and asserts the flags
- [x] The confirm review YAML has no native fan-out branch that dispatches the leaf agent as a full-loop executor
- [x] The prompt pack and the YAML agree on the state-log mechanism, and the gateway script does what they describe
- [x] Contract drift and render tests exit zero and the deep-loop suite exits zero
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
| Phase fix | Done | One DeepSeek V4.1 Flash max dispatch on cli-pi via the gateway; four YAMLs, two prompt packs, two contracts, eight contract cases; contract tests and typecheck exit 0 |
| Full suite | Green | `npm test` in the runtime: 152 files, 2631 passed, 8 skipped, exit 0, 1222 s |

### Deviations and findings

| Item | Note |
|------|------|
| Premise corrected | The brief said the gateway has no projection; the delegate found the projection contract in the gateway library and fixed the wording rather than the mechanism |
| Observed, bound separately | The review auto YAML still direct-appends error and adjudication records that the projection rewrite could replace |
<!-- /ANCHOR:log -->
