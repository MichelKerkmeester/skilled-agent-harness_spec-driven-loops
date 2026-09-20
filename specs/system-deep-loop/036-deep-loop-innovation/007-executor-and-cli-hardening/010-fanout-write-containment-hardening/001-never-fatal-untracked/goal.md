---
title: "Goal: never fatal untracked"
description: "Phase 001 of the fan-out containment work: Stop a neighbour's new file from halting a fan-out lane: under preserve, an out-of-scope untracked path is advisory, never fatal."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/001-never-fatal-untracked"
    last_updated_at: "2026-09-14T09:09:01Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Phase fix landed and criteria checked"
    next_safe_action: "Commit once the full suite exits zero"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-14-001-never-fatal-untracked"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: never fatal untracked

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
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

**Objective:** Stop a neighbour's new file from halting a fan-out lane: under preserve, an out-of-scope untracked path is advisory, never fatal.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Under the preserve remedy an untracked out-of-scope path is recorded as an advisory and the lane's own verdict stands. Preservation already guarantees nothing is lost; failing the iteration bought nothing but a false halt from another session's write. |
| D2 | In-HEAD breaches and escaping symlinks keep their current classification; only the untracked class changes. |
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

- [x] A stub lane runs while a second process drops a new untracked file outside the packet mid-run; the lane settles completed with advisory, the file is byte-identical, and the ledger names it
- [x] The same run under restore still fails as before, proving the change is scoped to preserve
- [x] The test fails against the current guard
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
| Phase fix | Done | One DeepSeek V4.1 Flash max dispatch on cli-pi via the gateway; partition changed in `write-containment.ts`, tests added in both vitest files; touched files plus typecheck exit 0 (199 tests) |
| Full suite | Green | `npm test` in the runtime: 156 files, 2657 passed, 7 skipped, exit 0, 1262 s |

### Deviations and findings

| Item | Note |
|------|------|
| Graceful self-stop fixture | Was red at HEAD from the worktree default flip; the delegate made the fixture ask for a tree explicitly, assertions kept |
| Lane status | Settles `fulfilled` plus a `containment_advisory` ledger event; the dedicated advisory status string stays reserved for the violations partition |
<!-- /ANCHOR:log -->
