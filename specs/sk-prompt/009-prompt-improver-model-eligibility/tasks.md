---
title: "Tasks: Restrict which models may act as the prompt-improve agent"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Restrict which models may act as the prompt-improve agent

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

- [x] T001 Establish which agent file is canonical and how the mirrors are produced (`.git/hooks/pre-commit`, `check-agent-mirror-sync.cjs`, `sync-runtime-mirrors.cjs`, `sync-agents-pi.cjs`)
- [x] T002 Capture the negative control: probe the live agent surface for a model-eligibility rule before any edit
- [x] T003 [P] Confirm the command layer selects no model, so the contract needs no third placement (`prompt_improve_auto.yaml`, `prompt_improve_confirm.yaml`, `prompt_improve_presentation.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the eligibility contract into the canonical agent definition (`.opencode/agents/prompt-improver.md`)
- [x] T005 Carry the same body into the Claude mirror in its own frontmatter dialect (`.claude/agents/prompt-improver.md`)
- [x] T006 Regenerate the Pi mirror from the canonical (`.pi/agents/prompt-improver.md`)
- [x] T007 Write the caller-facing copy into the skill, naming the agent definition as canonical (`.opencode/skills/sk-prompt/SKILL.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Re-run the behavioral probe against the live agent surface and compare with the negative control
- [x] T009 Run the agent-mirror gate and the mirror-parity checks over the working tree
- [x] T010 Independent review of contract fidelity by a second model family, with objections fixed and re-verified
- [x] T011 Run `validate.sh` on this folder with `--strict` and confirm an explicit `RESULT: PASSED`
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
