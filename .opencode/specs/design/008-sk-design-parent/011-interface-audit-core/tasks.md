---
title: "Tasks: sk-design interface and audit core asset build"
description: "Task list for building the seven interface and audit references and assets from the 009 expansion research. All build tasks are done and the phase is executed. The sk-design hub check passes."
trigger_phrases:
  - "design interface audit core build tasks"
  - "sk-design preflight audit report tasks"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/011-interface-audit-core"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed all build tasks and wired the seven files into the routers"
    next_safe_action: "Execute 012-foundations-motion-audit (next phase)"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-011-interface-audit-core"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-design interface and audit core asset build

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Build `010-shared-register` first so the transform verbs have a register gate (predecessor phase)
- [x] T002 Re-read the 009 expansion research sections 3.2, 3.5, and 4 to ground each addition (`../009-reference-asset-expansion/research/research.md`)
- [x] T003 Confirm the live `design-interface` and `design-audit` trees so additions do not duplicate existing references
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author the N1 content gate once in interface (`.opencode/skills/sk-design/design-interface/references/design-process/copy_and_mock_data.md`)
- [x] T005 Author the N2 mechanical gate once in interface (`.opencode/skills/sk-design/design-interface/references/design-process/mechanical_defaults.md`)
- [x] T006 [P] Author the mechanical pre-flight card asset (`.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md`)
- [x] T007 [P] Author the brief-to-dials intake reference (`.opencode/skills/sk-design/design-interface/references/design-process/brief_to_dials.md`)
- [x] T008 [P] Author the audit report template asset (`.opencode/skills/sk-design/design-audit/assets/audit_report_template.md`)
- [x] T009 [P] Author the AI-fingerprint tells catalog (`.opencode/skills/sk-design/design-audit/references/ai_fingerprint_tells.md`)
- [x] T010 Author the register-gated transform/remediation reference, pointing N1/N2 back to interface (`.opencode/skills/sk-design/design-audit/references/transform_remediation.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Verify all seven references and assets exist at their named paths with their full sections
- [x] T012 Verify the audit N1/N2 references point to the interface gates and no gate content is duplicated
- [x] T013 Verify `transform_remediation.md` cites the `010-shared-register` register; update the implementation summary and run `validate.sh --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All build tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining (the `010-shared-register` dependency is satisfied)
- [x] All seven references and assets present, N1/N2 authored once, and the transform reference register-gated

### Status note

This packet is EXECUTED. All build tasks are done. Seven files are built and verified. Interface gained `assets/interface_preflight_card.md` (168 lines), `references/design-process/mechanical_defaults.md` (146), `copy_and_mock_data.md` (163) and `brief_to_dials.md` (144). Audit gained `assets/audit_report_template.md` (162), `references/ai_fingerprint_tells.md` (129) and `transform_remediation.md` (108). The N1 (`copy_and_mock_data.md`) and N2 (`mechanical_defaults.md`) gates are authored once in interface and referenced by audit, not duplicated. The interface router was wired by adding the four files plus the shared register to design-interface SKILL.md Section 2 loading table and Section 5 references. The audit router auto-discovers its own references, and the shared register plus the three audit files were added to design-audit SKILL.md Section 2. `010-shared-register` is built, so the transform-verb register gate is satisfied. `package_skill --check .opencode/skills/sk-design` returns exit 0 and `validate.sh --strict` passes on this packet.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source research**: See `../009-reference-asset-expansion/research/research.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
