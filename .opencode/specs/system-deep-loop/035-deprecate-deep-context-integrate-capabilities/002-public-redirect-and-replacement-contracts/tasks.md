---
title: "Tasks: Public Redirect And Replacement Context Contracts"
description: "Task breakdown for resolving /deep:context source authority, adding replacement context snapshot contracts, and closing the public standalone route."
trigger_phrases:
  - "deep-context redirect tasks"
  - "replacement context contract tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-deprecate-deep-context-integrate-capabilities/002-public-redirect-and-replacement-contracts"
    last_updated_at: "2026-07-04T17:50:32Z"
    last_updated_by: "opencode"
    recent_action: "Validated phase 002 redirect"
    next_safe_action: "Begin phase 003 discoverability cleanup"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-phase-002-tasks"
      parent_session_id: "2026-07-04-phase-002-contract-authoring"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Do not hard-delete standalone deep-context in this phase."
      - "Source authority resolved through maintained command wrapper plus compiler source mapping."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Public Redirect And Replacement Context Contracts

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after source authority is resolved |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (primary file or surface)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read phase 002 scaffold docs before editing.
- [x] T002 Inspect current deep command assets with Glob.
- [x] T003 Inspect compiled `/deep:context` contract header and source-authority chain.
- [x] T004 Record observed missing `.opencode/commands/deep/context.md` source mismatch.
- [x] T005 Capture fresh targeted grep inventory immediately before runtime edits.
- [x] T006 Resolve command source authority for `/deep:context`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Add bounded context snapshot contract to `deep-research` docs/templates.
- [x] T008 Add bounded context snapshot contract to `deep-review` docs/templates.
- [x] T009 Update maintained `/deep:context` source or source-generation mapping with deprecation guidance.
- [x] T010 Add early halt guards to `deep_context_auto.yaml` and `deep_context_confirm.yaml`.
- [x] T011 Update presentation text with replacement guidance for `@context`, `/deep:research`, `/deep:review`, and `/speckit:plan`.
- [x] T012 Regenerate compiled command contracts and manifest.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Verify `/deep:context:auto` stops before legacy YAML dispatch.
- [x] T014 Verify `/deep:context:confirm` stops before legacy YAML dispatch.
- [x] T015 Verify generated contract source digests match maintained sources.
- [x] T016 Run deep command YAML/script path checks.
- [x] T017 Refresh `description.json` and `graph-metadata.json`.
- [x] T018 Run strict validation for phase 002.
- [x] T019 Run recursive strict validation from the parent packet.
- [x] T020 Update `implementation-summary.md` with validation evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Command source authority is resolved.
- [x] New standalone context-loop runs fail closed with replacement guidance.
- [x] Research/review replacement context snapshot contracts exist.
- [x] Generated command contracts are regenerated, not hand-edited.
- [x] Phase and recursive parent validation pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Research Baseline**: `../001-research-baseline-and-inventory/research/research.md`
<!-- /ANCHOR:cross-refs -->
