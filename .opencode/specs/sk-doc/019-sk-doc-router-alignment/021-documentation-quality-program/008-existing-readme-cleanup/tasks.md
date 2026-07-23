---
title: "Tasks: Existing-README Cleanup"
description: "Triage the audit, dispatch six family agents to repair genuine READMEs, then reconcile by re-audit."
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/008-existing-readme-cleanup"
    last_updated_at: "2026-07-22T16:00:57Z"
    last_updated_by: "claude"
    recent_action: "All batches repaired and reconciled."
    next_safe_action: "Proceed to phase 009."
    blockers: []
    key_files: []
---

# Tasks: Existing-README Cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

- [x] T001 Run `audit_readmes.py` and classify its false-positive patterns (gitignored `dist`, NodeNext `.js`, self-refs, placeholders).
- [x] T002 Build the verified real-work list with a multi-root resolver and exclude spec-folder, archive and fixture files; split 100 genuine targets into six batches (`cleanup-batch-*.md`).

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Repair `system-spec-kit` batch A (19 files) via `cleanup-batch-ssk-a.md`.
- [x] T004 [P] Repair `system-spec-kit` batch B (19 files) via `cleanup-batch-ssk-b.md`.
- [x] T005 [P] Repair `sk-design` batch (19 files) via `cleanup-batch-design.md`.
- [x] T006 [P] Repair `system-code-graph` + `system-deep-loop` batch (19 files) via `cleanup-batch-graph-loop.md`.
- [x] T007 [P] Repair `sk-doc` + `sk-code` batch (13 files) via `cleanup-batch-doc-code.md`, including the operator-flagged `create-command/references` stale path.
- [x] T008 [P] Repair advisor + commands + install-guides + cli batch (11 files) via `cleanup-batch-misc.md`.
- [x] T009 Delete the operator-approved stale `design-mcp-open-design/__tests__` duplicate.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Re-run `audit_readmes.py` and confirm template-invalid 70 to 43 and broken-refs 177 to 119.
- [x] T011 Independently floor-validate the genuine targets with `validate_document.py --type readme` and confirm the two apparent INVALIDs are a case-fold phantom and a validator-exempt template dir.
- [x] T012 Confirm via `git diff` that em dashes in the touched files are pre-existing, not agent-added.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Audit counts dropped and every touched README is floor-VALID
- [x] `checklist.md` verified with evidence

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
