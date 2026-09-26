---
title: "Acceptance Criteria: Phase 2: mode-scaffold"
description: "These criteria decide when the packet may close. Each needs an observed result before closure and every waiver needs a decision record."
trigger_phrases:
  - "sk-create-goal acceptance criteria"
  - "mode scaffold closure gate"
  - "goal packet tree check"
  - "unregistered mode verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/002-mode-scaffold"
    last_updated_at: "2026-09-25T20:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed all five criteria with evidence"
    next_safe_action: "Execute phase 003"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "01a0da02-83bb-757d-8b3e-505d6ba489e8"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: mode-scaffold

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/060-create-goal-mode/002-mode-scaffold
**Level:** 2
**Status:** Complete
**Date:** 2026-09-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given phase 001's final target tree and checker decision, When the mode packet is scaffolded, Then its listing matches the target tree and creates `scripts/` only for the local-checker choice. | T001, T003, T006, T011. Run `find .skilled/skills/sk-doc/sk-create-goal -print \| sort` and compare it with phase 001's `target-tree.md` (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/spec.md:89-94`). Observed 2026-09-25: the listing matches the phase 002 subset of the target tree and includes `scripts/` for the selected checker (`.skilled/skills/sk-doc/sk-create-goal/SKILL.md:1`). | Met | - |
| AC-002 | REQ-002 | Given `SKILL.md` describes goal-file rendering, When its renderer instructions are inspected, Then they use system-spec-kit and the mode contains no copied goal template. | T004, T007, T011. Run `rg -n 'create.sh --with-goal\|inline-gate-renderer.sh\|goal.md.tmpl' .skilled/skills/sk-doc/sk-create-goal/SKILL.md` and `test ! -e .skilled/skills/sk-doc/sk-create-goal/goal.md.tmpl` (`specs/sk-doc/060-create-goal-mode/goal.md:50` and `specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:14-18`). Observed: `rg` finds the renderer path at `.skilled/skills/sk-doc/sk-create-goal/SKILL.md:105` and the no-copy rule at `.skilled/skills/sk-doc/sk-create-goal/SKILL.md:130`; `test ! -e` confirms no `goal.md.tmpl`. | Met | - |
| AC-003 | REQ-003 | Given the new packet directory remains unregistered, When the parent-skill check runs on sk-doc, Then its only failure is invariant `6a` for `sk-create-goal`. | T002, T007, T009. Run `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` (`specs/sk-doc/060-create-goal-mode/spec.md:143` and `specs/sk-doc/049-sk-create-frontmatter/002-mode-scaffold/implementation-summary.md:88-107`). Observed: exit 1 with the single failure `6a` for `sk-create-goal` (`.skilled/skills/sk-doc/sk-create-goal/SKILL.md:1`). | Met | - |
| AC-004 | REQ-004 | Given the nested packet is scaffolded, When the strict package check runs, Then it prints `Result: PASS`. | T008. Run `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py .skilled/skills/sk-doc/sk-create-goal --check --strict` (`specs/sk-doc/049-sk-create-frontmatter/README.md:168-171`). Observed: `Result: PASS`, exit 0, one advisory warning for `scripts/.gitkeep` (`.skilled/skills/sk-doc/sk-create-goal/SKILL.md:1`). | Met | - |
| AC-005 | REQ-005 | Given the phase documents and generated metadata are current, When the strict phase validator runs, Then it prints `RESULT: PASSED`. | T010. Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode/002-mode-scaffold --strict` (`specs/sk-doc/060-create-goal-mode/spec.md:131-136`). Observed: `RESULT: PASSED`, 0 errors and 0 warnings (`specs/sk-doc/060-create-goal-mode/002-mode-scaffold/implementation-summary.md:1`). | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All five criteria are `Met` with observed evidence: the scaffold matches its target-tree subset, the package check passes, the parent-skill check fails only on `6a`, and strict validation passed.
<!-- /ANCHOR:closure -->
