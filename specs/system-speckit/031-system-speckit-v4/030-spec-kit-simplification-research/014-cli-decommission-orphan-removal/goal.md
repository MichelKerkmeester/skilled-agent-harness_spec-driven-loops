---
title: "Goal: CLI decommission orphan removal"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/014-cli-decommission-orphan-removal"
    last_updated_at: "2026-09-07T06:45:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed every criterion"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: CLI decommission orphan removal

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close every confirmed finding from the CLI lane's second round so that the package holds only files something reaches or a document names as a tool, every line the decommission left behind matches the code, and every test lane the package declares runs green in CI, with nothing deferred.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A removal row holds only after a census that includes relative imports; a module a relative import reaches stays, and the census says the lane was wrong |
| D2 | A CLI entrypoint or a script a document names as a manual tool is not an orphan for having no importer |
| D3 | The frozen compliant fixture keeps its documents byte for byte; only its derived fingerprint is re-derived, and suite expectations follow the base suite's note |
| D4 | The runtime root project is recorded for its own child rather than pulled into CI red |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the full text
of this file in chat so the operator can update their copy. A child goal change
that alters a parent decision or criterion is an amendment to the parent: apply
it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] Every row of the CLI lane's round-two section names a removal, a fix, a kept reason or a dropped reason
- [x] The package rebuilds and the check gate passes with the orphans gone
- [x] test:legacy and test:validation exit zero locally and run in the CI workflow
- [x] validate.sh --strict prints RESULT: PASSED for this child
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
| Packet opened | Done | this file |
| Fifteen P1 and six P2 rows censused with relative imports | Done | `../002-cli-runtime-utilization/research/confirmed-findings.md` §6 |
| Removals, corrections, lane repairs and the workflow step | Done | `implementation-summary.md` Files Changed |
| Gates | Done | rebuild, check gate, dist freshness, three lanes, pinned suites, residue search, strict validation |

### Deviations and findings

| Item | Note |
|------|------|
| Two removal rows were wrong | `core/workflow.ts` and `utils/tool-sanitizer.ts` import the "orphans" relatively; the first rebuild caught it, the modules were restored, and the census records the lane's miss. |
| The lanes CI never ran had four separate faults | A test of a module child 009 removed, a pre-nesting path, a stale derived fingerprint on a frozen fixture, and two suites disagreeing about that fixture; all repaired before the lanes joined the workflow. |
| The runtime root project fails in seven files | Recorded, not pulled into CI; it is the next child. |
<!-- /ANCHOR:log -->
