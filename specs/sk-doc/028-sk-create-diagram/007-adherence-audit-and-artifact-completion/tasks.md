---
title: "Tasks: sk-create-diagram adherence audit and artifact completion"
description: "Task queue for the audit-and-fix pass and the two new packages."
trigger_phrases:
  - "diagram adherence audit tasks"
importance_tier: "important"
contextType: "planning"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/007-adherence-audit-and-artifact-completion"
    last_updated_at: "2026-08-12T18:40:07.000Z"
    last_updated_by: "claude"
    recent_action: "Authored task queue"
    next_safe_action: "Run T002 (dispatch 1)"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-create-diagram adherence audit and artifact completion

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after dependencies are satisfied |
| `[B]` | Blocked by an explicit gate |

**Task Format**: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read all four standards documents; decide asset-template applicability, package placement, and taxonomy in `decision-record.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [B] Dispatch 1 (Deepseek v4 Flash via cli-opencode): audit SKILL.md + 37 references vs. sk-create-skill templates, 2 Python scripts + config/YAML vs. sk-code-opencode standards; fix findings in place [EVIDENCE: 47/47 files checked, 26/47 fixed (missing H2 numbering on 21 references, SKILL.md section reorder, missing docstrings on 2 scripts), 21/47 clean — `phase-007-audit-dispatch.log`.]
- [x] T003 Independently verify dispatch 1's claimed findings and fixes against the real files [EVIDENCE: mtime diff confirmed exactly the 26 claimed files changed; spot-checked 3 files; `validate_skill_package.py --strict` = PASS.]
- [x] T004 [B] Dispatch 2 (Deepseek v4 Flash via cli-opencode): author `manual-testing-playbook/` per the decided taxonomy [EVIDENCE: 10 files created (root + 9 scenarios across 3 categories).]
- [x] T005 Independently verify dispatch 2's output with `validate-playbook-package.cjs` [EVIDENCE: independently re-run — `PASS scenarios=9 categories=3 violations=0 warnings=0 exit=0`.]
- [x] T006 [B] Dispatch 3 (Deepseek v4 Flash via cli-opencode): author `feature-catalog/` per the decided taxonomy, cross-referenced to the playbook [EVIDENCE: dispatch stopped after 8/9 leaves (session ended mid-work); orchestrator authored the missing `hub-registration.md` leaf directly from real registry-file content.]
- [x] T007 Independently verify dispatch 3's output with `validate_document.py` [EVIDENCE: root + 9 leaves = 0 issues each; `validate_catalog_package.py` found 3 description-parity violations, fixed, re-run = 0 violations.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run `validate.sh --recursive --strict` on packet 028 (parent + all 7 children); fix findings; rerun until clean
- [ ] T009 `git status --short` residue sweep against the declared file scope
- [ ] T010 Write `implementation-summary.md`
- [ ] T011 Write `checklist.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All required tasks marked [x]
- [ ] No [B] tasks remain
- [ ] All gates clean; no undocumented residue
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Decision record**: `decision-record.md`
- **Packet root**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
