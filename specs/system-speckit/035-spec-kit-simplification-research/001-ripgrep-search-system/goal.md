---
title: "Goal: Ripgrep search system"
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
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/001-ripgrep-search-system"
    last_updated_at: "2026-09-06T17:40:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed every criterion after remediation"
    next_safe_action: "None; the lane is closed"
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
# Goal: Ripgrep search system

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Establish, with file:line evidence, whether the lexical retrieval system (trigger index, ripgrep recipes, /speckit:search, Gate 1, references and root-document mentions) is correct, integrated, used and no larger than it needs to be, and whether a repo rule should own it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Research is read-only; remediation lands in a sibling child created after synthesis |
| D2 | Every finding cites the doc or code line and the runtime behavior it contradicts |
| D3 | The retrieval-conventions concept-lane discrepancy is settled by evidence, not assumption |

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

- [x] 10 iteration files and 10 state events exist under research/lineages/glm-5-3-flash-ripgrep-search/
- [x] research.md ranks findings with path:line on both sides
- [x] Every P0 and P1 finding reproduces in-session before remediation is planned
- [x] A written verdict on whether a retrieval repo rule should exist, with the root-document lines it would absorb
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
| Lane ran 10/10, synthesis written | Done | `research/lineages/glm-5-3-flash-ripgrep-search/research.md`, stop reason maxIterationsReached, 16:36 to 17:15 |
| Reproduction | Done | `research/confirmed-findings.md`: 8 P1 confirmed, 1 dropped (L5), 8 P2 fixed or recorded, 1 dropped |
| Remediation | Done | `../006-retrieval-drift-remediation` closed every row |

### Deviations and findings

| Item | Note |
|------|------|
| L5 dropped | The hook-system table column is "Manual fallback"; the lookup is documented as the manual Gate 1 step, so no contradiction exists. |
| No repo rule | Gate 5 loads on first write, Gate 1 fires per prompt; the root-document footprint is five lines and stays inline. |
<!-- /ANCHOR:log -->
