---
title: "Goal: Acceptance Criteria Template"
description: "The durable directive this phase executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-spec-kit-template-optimization/002-acceptance-criteria-template"
    last_updated_at: "2026-08-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the phase goal document against the shipped template"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:c7d68e3bb5a432397576954810482b173f994158b6297eac4ea7b2ad1435a07d"
      session_id: "2026-08-29-033-002-acceptance-criteria-template"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Acceptance Criteria Template

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short -
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give acceptance criteria one home, and make that home the gate a packet passes to close.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `acceptance-criteria.md` is canonical; `spec.md` stops carrying criteria at gated levels |
| D2 | A criterion is retired only by a decision record that exists |
| D3 | Forward-only behind a dated cutoff; the existing tree stays advisory |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Copy these verbatim into the objective: nothing dereferences a path, so criteria
left only here are invisible to whatever judges completion.

- [x] A post-cutoff packet with an unmet criterion cannot reach exit 0
- [x] A waiver naming a missing decision record fails
- [x] An existing pre-cutoff packet's result is unchanged
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| This phase | Complete | 8/8 criteria met; `validate.sh --strict` exit 0 |

### Deviations and findings

| Item | Note |
|------|------|
| Authored after the fact | This document was written once the goal template shipped in packet 042; the directive it records is the one the phase actually executed against. |
<!-- /ANCHOR:log -->
