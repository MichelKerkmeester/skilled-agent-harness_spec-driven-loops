---
title: "Acceptance Criteria: Phase 3: Goal Authoring Standards and Exemplars"
description: "These criteria require the goal-authoring rubric, its corpus controls, HVR review and strict phase validation."
trigger_phrases:
  - "goal standards acceptance"
  - "goal rubric closure"
  - "goal exemplar status"
  - "phase 3 goal criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/003-authoring-standards-and-exemplars"
    last_updated_at: "2026-09-25T21:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed all six criteria with evidence"
    next_safe_action: "Execute phase 004"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-authoring-standards-and-exemplars"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: Goal Authoring Standards and Exemplars

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is Met, Waived or Superseded. A Waived or Superseded row must
> name an ADR that exists in decision-record.md.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/060-create-goal-mode/003-authoring-standards-and-exemplars
**Level:** 2
**Status:** Complete
**Date:** 2026-09-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. AC-ID is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the five goal-content standards, When a reader applies each check, Then every standard states its failure, gives a reader test and cites a real goal example | Five standards with a failure, check and verified source citation in references/authoring-standards.md. Observed 2026-09-25: five standards at `.skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md:22`, `.skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md:34`, `.skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md:46`, `.skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md:58` and `.skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md:70`, each with failure, reader check and a re-opened citation | Met | - |
| AC-002 | REQ-002, REQ-004 | Given the four cited corpus examples, When the same rubric is applied, Then all three bad examples fail and the known-good child objective passes | 3/3 failures and 1/1 pass, with verified path:line citations, in assets/goal-exemplars.md. Observed: FAIL at `.skilled/skills/sk-doc/sk-create-goal/assets/goal-exemplars.md:23`, `.skilled/skills/sk-doc/sk-create-goal/assets/goal-exemplars.md:33` and `.skilled/skills/sk-doc/sk-create-goal/assets/goal-exemplars.md:43`; PASS at `.skilled/skills/sk-doc/sk-create-goal/assets/goal-exemplars.md:55`; all eleven cited source lines re-opened and matched | Met | - |
| AC-003 | REQ-003 | Given the standards and exemplar documents, When the HVR publish checklist is applied, Then both score at least 85 and have no hard blockers | HVR score and hard-blocker count recorded for each document. Observed: `hvr_scan.py` gives both files 0 hard blockers and a 100/100 mechanical ceiling, exit 0 (`.skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md:1`) | Met | - |
| AC-004 | REQ-005 | Given the sk-create-goal packet, When an author enters the authoring workflow, Then its skill loads the standards and its reference index lists the standards and examples | references/README.md and SKILL.md contain the expected links and load point. Observed: `.skilled/skills/sk-doc/sk-create-goal/references/README.md:24` lists the standards and exemplars; `.skilled/skills/sk-doc/sk-create-goal/SKILL.md:106` loads both at the authoring step | Met | - |
| AC-005 | REQ-006 | Given the shared goal template and parent goal, When phase 3 completes, Then the phase uses the shared template and leaves D1-D6 unchanged | No goal-template fork is added; parent decisions remain unchanged. Observed: no `goal.md.tmpl` in the mode; parent durable slice unchanged at 3,735 characters (`specs/sk-doc/060-create-goal-mode/goal.md:49`) | Met | - |
| AC-006 | REQ-001, REQ-004 | Given the phase planning packet, When strict validation runs after metadata refresh, Then the validator prints RESULT: PASSED | bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode/003-authoring-standards-and-exemplars --strict. Observed: `RESULT: PASSED`, 0 errors and 0 warnings (`specs/sk-doc/060-create-goal-mode/003-authoring-standards-and-exemplars/implementation-summary.md:1`) | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| Met | Verified. The Verification cell names evidence that was actually observed. |
| Unmet | Not yet satisfied. Blocks closure. |
| Waived | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| Superseded | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write - when the row is Met or Unmet. Write ADR-NNN when the row is Waived or Superseded, naming a decision record that exists in decision-record.md. A waiver naming an ADR that is not there fails validation: the point of a waiver is that someone recorded the reasoning, so an unbacked waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All six criteria are Met with observed evidence. No waiver or superseding decision is recorded.
<!-- /ANCHOR:closure -->
