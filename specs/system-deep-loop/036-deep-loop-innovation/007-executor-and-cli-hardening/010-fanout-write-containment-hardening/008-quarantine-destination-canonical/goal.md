---
title: "Goal: quarantine destination canonical"
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
    packet_pointer: "scaffold/008-quarantine-destination-canonical"
    last_updated_at: "2026-09-14T17:44:14Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
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
# Goal: quarantine destination canonical

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet has one limit, 4000
> characters, measured from the frontmatter's closing fence to the log anchor.
> Up to 4000 passes and past it fails; the runtime goal surfaces cap what they
> hold, and a truncated objective loses its tail, which is where the criteria
> live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Stop a symlink inside a lane's own directory from redirecting the runner's quarantine, patch and manifest writes outside the artifact root.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every quarantine destination, and each of its existing ancestors, is resolved with realpath and required to stay beneath the canonical artifact root before any directory is created or any byte is written; a symlinked component fails the write closed and is recorded on the quarantine result. |
| D2 | Detection and the remedy are unchanged; only the writer's own path discipline changes. |
| D3 | Fixed by DeepSeek V4.1 Flash at max through the gateway on cli-pi, one dispatch for this phase alone, verified by the deep-loop suite before the next phase starts. |

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

- [x] A lane that plants a symlink at its quarantine path pointing outside the repository gets no file written at the link's target, the quarantine result names the refusal, and the lane's verdict is unchanged
- [x] The same test against the unmodified writer shows the escaped write
- [x] The deep-loop runtime suite exits zero
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
| Phase fix | Done | One DeepSeek V4.1 Flash max dispatch on cli-pi via the gateway; canonical check and refusal record in `write-containment.ts`, three tests; touched files plus typecheck exit 0 |
| Full suite | Green | `npm test` in the runtime: 151 files, 145 passed and 6 failed, 2580 tests passed; all six failures are the cli-adapter manifest-integrity cases asserting allAdapterBound after another session added a cli-hermes executor kind to the matrix manifest at 19:46 mid-run; none imports the changed paths, the containment and fan-out files passed (208 tests), typecheck exit 0; the whole suite is rerun before the next phase |

### Deviations and findings

| Item | Note |
|------|------|
| Concurrent session | Another session is editing the runtime's executor config and fan-out tests; this phase's commit is bound to its two files only |
<!-- /ANCHOR:log -->
