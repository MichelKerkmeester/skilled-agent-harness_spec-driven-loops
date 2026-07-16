---
title: "Tasks: Deep Commands Presentation Workflow Separation"
description: "Task breakdown for extracting presentation from the six mode-based deep commands and aligning the sk-doc command standard."
trigger_phrases:
  - "deep commands split tasks"
  - "deep presentation tasks"
  - "deep router tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/005-deep-commands"
    last_updated_at: "2026-06-11T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All tasks complete: 6 splits + sk-doc alignment + parity verification"
    next_safe_action: "None; phase complete"
---
# Tasks: Deep Commands Presentation Workflow Separation

<!-- SPECKIT_LEVEL: 1 -->
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

> Inventory and extract: catalog the inline presentation in each in-scope command before authoring.

- [x] T001 [P] Inventory inline presentation in `ask-ai-council.md`
- [x] T002 [P] Inventory inline presentation in `start-agent-improvement-loop.md`
- [x] T003 [P] Inventory inline presentation in `start-context-loop.md`
- [x] T004 [P] Inventory inline presentation in `start-model-benchmark-loop.md`
- [x] T005 [P] Inventory inline presentation in `start-research-loop.md`
- [x] T006 [P] Inventory inline presentation in `start-review-loop.md`

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 [P] Author + rewire `ask-ai-council` (`deep_ask-ai-council_presentation.md` + thin `ask-ai-council.md`)
- [x] T008 [P] Author + rewire `start-agent-improvement-loop`
- [x] T009 [P] Author + rewire `start-context-loop`
- [x] T010 [P] Author + rewire `start-model-benchmark-loop`
- [x] T011 [P] Author + rewire `start-research-loop`
- [x] T012 [P] Author + rewire `start-review-loop`
- [x] T013 Align `command_template.md` to document the presentation/router split standard
- [x] T014 Add `command_presentation_template.md` template asset

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Content-parity diff per command (every inline presentation block present in the asset)
- [x] T016 Verify each router references all three owned assets and carries no inline presentation contract
- [x] T017 Verify + document the thin `start-skill-benchmark-loop` command as out of split scope
- [x] T018 `validate.sh --strict`, Fable parity pass, deep review, remediate
- [x] T019 Scoped commit

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All six commands split; routers thin; behavior preserved
- [x] No `[B]` blocked tasks remaining
- [x] sk-doc standard + presentation template asset shipped
- [x] Strict validation, Fable parity, and deep review passed

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Reference router**: `.opencode/commands/speckit/plan.md`

<!-- /ANCHOR:cross-refs -->
