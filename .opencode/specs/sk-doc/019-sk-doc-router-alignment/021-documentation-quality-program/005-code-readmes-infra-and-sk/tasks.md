---
title: "Tasks: Code READMEs (Infra and SK Batch)"
description: "Write the code-README brief, author thirty-three per-folder READMEs across five family authors, then reconcile against the real folder listings and validate."
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/005-code-readmes-infra-and-sk"
    last_updated_at: "2026-07-22T13:09:59Z"
    last_updated_by: "claude"
    recent_action: "All thirty-three code READMEs authored and validated."
    next_safe_action: "Proceed to phase 006."
    blockers: []
    key_files: []
---

# Tasks: Code READMEs (Infra and SK Batch)

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

- [x] T001 Read `readme-code-template.md` and the `system-deep-loop/runtime/lib/council/README.md` exemplar, and confirm `validate_document.py --type readme` accepts a code README.
- [x] T002 Enumerate the thirty-three Phase-005 folders from the repo-wide scan (`find .opencode/skills`) and write the shared code-README brief.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Author READMEs for the 8 sk-doc folders (`create-benchmark/scripts`, `create-feature-catalog/scripts`, `create-flowchart/scripts`, `create-readme/scripts`, `create-skill/scripts`, `create-skill/scripts/lib`, `create-skill/scripts/tests`, `shared/scripts`).
- [x] T004 [P] Author READMEs for the 6 sk-code folders (`code-opencode/scripts`, `code-quality/scripts` and its `hooks`, `hooks/codex`, `lib`, `code-review/scripts`).
- [x] T005 [P] Author READMEs for the 6 system-code-graph folders (`mcp-server/lib/graph`, `mcp-server/scripts/eval`, `runtime/hooks/claude`, `runtime/hooks/codex`, `runtime/lib/code-graph`, `scripts`).
- [x] T006 [P] Author READMEs for the 9 `system-skill-advisor` and `mcp-code-mode` folders.
- [x] T007 [P] Author READMEs for the 4 `mcp-tooling` and `cli-external-orchestration` folders.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Floor-validate all thirty-three READMEs with `validate_document.py --type readme` and confirm each `README.md` exists.
- [x] T009 Cross-check every CONTENTS-table filename against the real folder listing (`contents-real-mismatch.txt`), and sweep all thirty-three for em dashes and semicolons.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All thirty-three READMEs report VALID and every CONTENTS entry is a real direct file
- [x] `checklist.md` verified with evidence

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
