---
title: "Goal: Phase 5: docs-governance-and-closeout"
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
    packet_pointer: "cli-external-orchestration/074-cli-jev-creation/005-docs-governance-and-closeout"
    last_updated_at: "2026-09-20T11:30:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
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
# Goal: Phase 5: docs-governance-and-closeout

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

**Objective:** Every mode list in the repository names the transport, the parent metadata is complete, and the recursive strict gate closes the packet.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The transport is named wherever modes are enumerated, but never authorized: mode lists gain the row, executor-only surfaces keep an accurate absence |
| D2 | The credential is the operator's to supply: the packet records SKIP with the blocker named rather than a fabricated pass, and the authenticated verification records PASS once a key exists |

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

- [x] Every mode enumeration in the repository names the cli-jev transport, and every executor-only surface keeps an accurate absence
- [x] The hub catalog's falsified zero-axis claims are corrected, so the packet's documentation matches its own registry
- [x] The parent carries its phase map, handoff criteria and decisions, and its five children carry their own goal documents
- [x] `validate.sh --recursive --strict` prints `RESULT: PASSED` over the parent and the five children
- [x] The authenticated verification ran on the operator's `official` key and closed `JEV-021` and `JEV-022` with observed output
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
| Phase 005 closed: roster and catalog truth, parent metadata, recursive gate | complete | validate.sh --recursive --strict: all six folders RESULT: PASSED (0 errors, 0 warnings); hub gate 0 warnings; manifest fresh:true; suites 20/20 + 74/74 |
| Authenticated verification closed JEV-021 and JEV-022 | complete | operator stored an official key; both scenarios PASS with observed output; no key value in any stream; report under cli-jev/benchmark/reports/2026-09-20-authenticated-verification/ |

### Deviations and findings

| Item | Note |
|------|------|
| The playbook was re-shaped mid-phase | The operator-scenario contract rejected the multi-scenario layout authored in phase 004, so the scenarios were split to one file per id and both package validators were re-run |
<!-- /ANCHOR:log -->
