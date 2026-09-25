---
title: "Goal: symlink contained paths"
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
    packet_pointer: "scaffold/015-symlink-contained-paths"
    last_updated_at: "2026-09-15T00:02:08Z"
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
# Goal: symlink contained paths

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

**Objective:** Close the three residual symlink gaps the fresh review found: a restore that follows a symlinked ancestor, baseline capture and read paths that are not symlink-contained, and a quarantine check that can be raced between check and create.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every filesystem write or read the guard makes on a repository path (baseline capture, baseline read, restore write, quarantine write) resolves the path's parent with realpath, requires it beneath the real repository or artifact root, and refuses any symlinked component; the final component is never followed. The refusal is recorded, never thrown. |
| D2 | Quarantine and patch files are claimed with an exclusive open and directories are created with the same component check immediately before use, so a link planted between check and create is caught by the create itself. |
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

- [x] Under restore, a tracked file whose parent directory the lane replaced with a symlink to an outside directory is not written through; the outside directory is unchanged and the action names the refusal
- [x] A baseline entry whose path passes through a symlinked component is neither captured from nor restored to the link's target; the entry is marked and the reason recorded
- [x] A symlink planted at the quarantine pass directory between the check and the create yields a refusal, not a write at the link's target
- [x] Each test fails against the current guard, and the deep-loop runtime suite exits zero
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
| Phase fix | Done | One DeepSeek V4.1 Flash max dispatch on cli-pi via the gateway; helper set and wiring in `write-containment.ts`, four tests; touched files, a stress runner case and typecheck exit 0 |
| Full suite | Green | `npm test` in the runtime: 152 files, 2623 passed, 8 skipped, exit 0, 1229 s |

### Deviations and findings

| Item | Note |
|------|------|
| Existence probes and log append | Left unguarded on purpose: they move no bytes and detection semantics are frozen; recorded as reviewed |
| Baseline entry reason | A refused capture is marked truncated without a reason field; additive follow-up |
<!-- /ANCHOR:log -->
