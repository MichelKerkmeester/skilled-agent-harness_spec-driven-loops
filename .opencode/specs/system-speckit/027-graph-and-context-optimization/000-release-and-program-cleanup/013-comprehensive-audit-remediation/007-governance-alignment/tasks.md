---
title: "Tasks: 013/007 Governance Alignment"
description: "Task list for the 10 G-cluster governance drift findings: sk-doc, sk-code, and constitutional doc corrections plus enforcement tool fixes."
trigger_phrases:
  - "governance alignment tasks"
  - "comment hygiene tasks"
  - "verify alignment drift tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation/007-governance-alignment"
    last_updated_at: "2026-06-04T22:00:00Z"
    last_updated_by: "claude-sonnet-4-6"
    recent_action: "All 10 G-cluster findings implemented and verified"
    next_safe_action: "run validate.sh --strict"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/assets/frontmatter_templates.md"
      - ".opencode/skills/sk-doc/references/global/quick_reference.md"
      - ".opencode/skills/sk-doc/references/global/core_standards.md"
      - ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh"
      - ".opencode/skills/system-spec-kit/constitutional/comment-hygiene.md"
      - ".opencode/skills/system-spec-kit/constitutional/gate-tool-routing.md"
      - ".opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py"
      - ".opencode/skills/sk-code/assets/scripts/test_verify_alignment_drift.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-007-governance-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 013/007 Governance Alignment

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Read verified-backlog.json and extract G-cluster findings
- [x] T002 Read all target files before editing
- [x] T003 [P] Fill spec docs (spec.md, plan.md, tasks.md, implementation-summary.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] G1: Fix Spec row in frontmatter_templates.md
- [x] T005 [P] G2: Align command required sections in quick_reference.md
- [x] T006 [P] G2+G3: Align command sections + add filename exception in core_standards.md
- [x] T007 [P] G7: Fix Semantic fallback cell in gate-tool-routing.md
- [x] T008 [P] G8: Remove bash prefix from SKILL.md, code_quality_standards.md, universal_checklist.md
- [x] T009 G5+G6: Update comment-hygiene.md enforcement section (Three gates + hygiene-ok + bypass)
- [x] T010 G9: Add python3 shebang early-return to check_shell in verify_alignment_drift.py
- [x] T011 G4: Broaden VIOLATION_PATTERNS in check-comment-hygiene.sh
- [x] T012 G10: Promote header/shebang rules to ERROR in verify_alignment_drift.py + update test
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run check-comment-hygiene.sh scratch test (forbidden patterns → exit 1; clean file → exit 0)
- [x] T014 Run pytest test_verify_alignment_drift.py -v (all 11 tests pass)
- [x] T015 Run verify_alignment_drift.py on sk-code/scripts (no false SH-SHEBANG findings)
- [x] T016 Run validate.sh --strict on this spec folder (Errors: 0)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
