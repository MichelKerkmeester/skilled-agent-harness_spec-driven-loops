---
title: "Tasks: cli-devin skill — Devin CLI peer executor [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path). 18 tasks across 5 phases."
trigger_phrases:
  - "cli-devin tasks"
  - "104 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/084-cli-devin-creation"
    last_updated_at: "2026-05-15T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author tasks.md"
    next_safe_action: "Implement T001-T018"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "104-cli-devin-init"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
# Tasks: cli-devin skill — Devin CLI peer executor

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

- [x] T001 Create cli-devin directory tree (.opencode/skills/cli-devin/{references,assets,changelog,manual_testing_playbook/01--cli-invocation})
- [x] T002 Write SKILL.md with 8 family-standard sections (.opencode/skills/cli-devin/SKILL.md)
- [x] T003 [P] Write README.md with 9-section TOC (.opencode/skills/cli-devin/README.md)
- [x] T004 [P] Write graph-metadata.json with sibling edges (.opencode/skills/cli-devin/graph-metadata.json)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P] Write references/cli_reference.md — command/flag/slash-command surface
- [x] T006 [P] Write references/integration_patterns.md — 3 use cases
- [x] T007 [P] Write references/agent_delegation.md — (model, permission-mode, prompt-file) routing
- [x] T008 [P] Write references/devin_tools.md — capability comparison
- [x] T009 [P] Write references/cloud_handoff.md — Devin-unique handoff narrative + gate
- [x] T010 [P] Write assets/prompt_quality_card.md — CLEAR card
- [x] T011 [P] Write assets/prompt_templates.md — 6 templates
- [x] T012 [P] Write changelog/v1.0.0.0.md — per-version release notes in cli-codex prose style (family canonical shape)
- [x] T013 [P] Write manual_testing_playbook/manual_testing_playbook.md (root) + 25 per-feature scenario files across 9 numbered category folders (family canonical shape)
- [x] T014 [P] Patch cli-claude-code/graph-metadata.json — add cli-devin sibling edge
- [x] T015 [P] Patch cli-codex/graph-metadata.json — add cli-devin sibling edge
- [x] T016 [P] Patch cli-gemini/graph-metadata.json — add cli-devin sibling edge
- [x] T017 [P] Patch cli-opencode/graph-metadata.json — add cli-devin sibling edge
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Run validate.sh --strict + verify SKILL.md section count = 8 + verify sibling edge symmetry + run generate-context.js
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (SKILL.md sections, sibling edges, cloud_handoff.md LOC)
- [x] Strict spec validation passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
