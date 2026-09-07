---
title: "Goal: Overengineering simplification"
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
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/005-overengineering-simplification"
    last_updated_at: "2026-09-07T03:45:00Z"
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
# Goal: Overengineering simplification

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Establish, across the whole skill and its root-document footprint, what can be simplified, merged or removed for better output, better adherence and lower maintenance without losing a documented capability.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Research is read-only; remediation lands in sibling children created after synthesis |
| D2 | Every simplification names the capability preserved, the files touched and the risk |
| D3 | Adherence evidence comes from real packets under specs/, not from opinion |

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

- [x] 10 iteration files and 10 state events exist under research/lineages/glm-5-3-flash-overengineering/
- [x] research.md carries a ranked simplification plan with capability, files, risk and expected gain per item
- [x] Every P1 item reproduces in-session
- [x] The plan names which items become remediation children
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
| Lane ran 10/10, synthesis written | Done | `research/lineages/glm-5-3-flash-overengineering/research.md`, stop reason maxIterationsReached, 03:55 to 05:16 |
| Census | Done | `research/confirmed-findings.md`: 5 P1 and 25 P2 rows censused in the main checkout; one missed finding added |
| Remediation | Done | `../011-command-surface-contract-realignment` closed every row that called for a change |

### Deviations and findings

| Item | Note |
|------|------|
| The lane counted files, not entries | The `opencode/` adapter directory holds a documented symlink; the "empty" finding was dropped. |
| The fingerprint collision was a worktree artifact | Both cited summaries carry the zero placeholder in the main checkout; the undefined-input half of the finding held and was fixed. |
| The command surface outranked the synthesis | The eight workflow assets still scaffolded the retired checklist; the lane read them for dashboards and naming and did not weigh the level system they describe. |
<!-- /ANCHOR:log -->
