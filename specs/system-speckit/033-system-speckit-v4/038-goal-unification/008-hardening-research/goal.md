---
title: "Goal: Hardening research"
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
    packet_pointer: "system-speckit/033-system-speckit-v4/036-goal-unification/008-hardening-research"
    last_updated_at: "2026-09-11T10:52:14Z"
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
# Goal: Hardening research

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

**Objective:** Find and build what makes the shipped goal system more robust, better integrated, easier to operate and smaller, without reopening the eight frozen decisions.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Research and a second review run first; only rows both call small and certain are built here. |
| D2 | Rows that need a decision, a harness or an injection-shape change are recorded, not built. |

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

- [ ] `research/lineages/deepseek/research.md` exists with five tables and five iterations in the ledger
- [ ] The do-now rows are built or deferred with a reason, and every suite passes afterwards
- [ ] The do-next rows are listed in the implementation summary as the backlog
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
| Research lineage | Done | 5 of 5 iterations, maxIterationsReached, research.md 16 KB |
| Review lineage 2 | Done | 007/review/lineages/deepseek-review-2, 0 P0, 0 P1, 7 P2 |
| Do-now build | Done | Hook 122/122, plugin 137/137, validator 26/26, drift PASS |
| Review pass 3 fixes | Done | Eight built, one rejected with probe evidence (lock root), one live-run unknown |
| Backlog closed | Done | Renderer parity test (negative-control verified), brief cache key sensitivity (collision proven then fixed), goal phrasings indexed and lookup-verified |

### Deviations and findings

| Item | Note |
|------|------|
| Lock-root advisory rejected | Implementing it split the lock across record stores and lost 4 of 10 rows in a two-process probe; the workspace root is restored and pinned by a regression test |
| Two rows re-judged rather than deferred | The envelope aliases and the unused timestamp stay: a shipped test and the record schema depend on them, confirmed by the third review |
<!-- /ANCHOR:log -->
