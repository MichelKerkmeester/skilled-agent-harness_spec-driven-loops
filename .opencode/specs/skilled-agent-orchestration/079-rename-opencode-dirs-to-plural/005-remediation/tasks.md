---
title: "Tasks: 100 - 099 deep-review remediation"
description: "Task list for the 12-P1 remediation"
trigger_phrases:
  - "100 tasks"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/005-remediation"
    last_updated_at: "2026-05-07T20:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored task list"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: 100 - 099 deep-review remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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
- [x] T001 Inventory 13 P1 findings from 099 review-report.md
- [x] T002 Decide deferral target (P1-026 reducer findings extraction; observability concern)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T010 P1-015 source default plural in handlers/skill-graph/scan.ts:40
- [x] T011 P1-016 npm run build in scripts/ — regenerate scripts/dist
- [x] T012 P1-019 add shell-metachar guard to resolveArtifactRoot
- [x] T013 P1-020 add zero-inventory exit-2 to audit_descriptions.py
- [x] T014 P1-021 add sibling-skill fallback resolver to check-smart-router.sh
- [x] T015 P1-025 add deep-review/deep-research aliases to advisor + rebuild
- [x] T016 P1-022 repair 096/004 anchor pairs
- [x] T017 P1-024 canonicalize 7 098 sub-phase docs (script: /tmp/fix-098-anchors.py)
- [x] T018 P1-018 add Manual Testing Playbook block to sk-code-review + sk-git SKILL.md
- [x] T019 P1-007 bulk-mark unchecked CHK-* across 7 adjacent checklists
- [x] T020 P1-017 reconcile 095 implementation-summary contradictions
- [x] T021 P1-023 backfill _memory.continuity.blockers in 5 098 deferral specs
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T030 validate.sh --strict 098-097-remediation recursive PASS
- [x] T031 validate.sh --strict 096-rename-opencode-dirs-to-plural recursive PASS
- [x] T032 validate.sh --strict 100-099-remediation PASS
- [x] T033 Adjacent packets 093/094/095 still PASS
- [x] T034 Smart-router smoke: PATHS PASS (was 8 errors pre-fix)
- [x] T035 audit_descriptions.py zero-inventory smoke: exit 2
- [x] T036 Native advisor /speckit:deep-review smoke: confidence 0.82
- [x] T037 resolveArtifactRoot adversarial smoke: BLOCKED on metacharacters
- [x] T038 Author implementation-summary.md
- [x] T039 Update graph-metadata.json status: complete
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] P1-026 deferral documented in continuity blockers
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Implementation Summary**: `implementation-summary.md`
- **Driving findings**: `../099-track-rereview/review/review-report.md`
<!-- /ANCHOR:cross-refs -->
