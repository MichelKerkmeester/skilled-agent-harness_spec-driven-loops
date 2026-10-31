---
title: "Goal: Checklist Deprecation Closure"
description: "The durable directive this phase executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/008-template-contracts-and-acceptance-criteria/004-checklist-deprecation-closure"
    last_updated_at: "2026-08-30T04:17:55Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the phase goal document against the shipped template"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:338ecb5ba53eb06b2ab7c4fc9c98d8cad208cde216d6bcf5a633376ddfa86673"
      session_id: "2026-08-29-033-004-checklist-deprecation-closure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Checklist Deprecation Closure

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short -
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the coverage advisory read its evidence from the document it counts from.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The evidence source follows the count: canonical when present, legacy otherwise |
| D2 | A retired criterion needs no citation; its decision record is the evidence |
| D3 | The pre-merge document stays optional in the contract so legacy packets keep validating |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Copy these verbatim into the objective: nothing dereferences a path, so criteria
left only here are invisible to whatever judges completion.

- [x] A packet whose criteria carry citations is scored as having them
- [x] A pre-merge packet resolves to the source it always did
- [x] The rule has a suite that fails if count and evidence separate again
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| This phase | Complete | 14/14 suite; four packets moved 0/5 to 5/5 |

### Deviations and findings

| Item | Note |
|------|------|
| Authored after the fact | This document was written once the goal template shipped in packet 042; the directive it records is the one the phase actually executed against. |
<!-- /ANCHOR:log -->
