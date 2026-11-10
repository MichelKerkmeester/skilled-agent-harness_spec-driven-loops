---
title: "Goal: Phase 1: recorded-adjacent-defects"
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
    packet_pointer: "scaffold/013-recorded-adjacent-defects"
    last_updated_at: "2026-09-16T06:55:32Z"
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
# Goal: Phase 1: recorded-adjacent-defects

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

**Objective:** [One sentence. What this packet is for. Not how, not progress.]

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | [The decision, stated so a reader can tell whether work honors it] |

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

- [x] [A check whose answer is an exit code, a count, or a named artifact]
- [x] [Another]
- [x] [Another]
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
| Phase fix | Done | Seven recorded defects closed at their producers, each reproduced before being touched and re-measured with the command that exposed it |
| Full suite | Green | 154 files, 2680 passed, 8 skipped, exit 0 |

### Deviations and findings

| Item | Note |
|------|------|
| The deferral was the deviation | Four phases recorded defects as another surface's problem while the packet's decision says nothing is deferred; this phase exists because that record was itself the gap |
| One needed no work | A scenario said to reference a pruned sentinel no longer does, resolved by the phase that recorded it |
| One could not be repointed | The diagram templates were merged into a form library with no one-to-one successor, so the dead declaration was removed rather than a mapping invented |
| An intermittent failure surfaced | A concurrent-append test in the jsonl repair suite lost a record once in five full runs; recorded with its reproduction rate rather than dismissed as flake or fixed blind |
<!-- /ANCHOR:log -->
