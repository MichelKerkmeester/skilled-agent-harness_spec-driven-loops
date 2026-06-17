---
title: "Tasks: Phase 10: decouple-from-open-design [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "decouple open design tasks"
  - "phase 010 tasks"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/148-sk-interface-design/010-decouple-from-open-design"
    last_updated_at: "2026-06-17T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Split parity doc, stripped Open Design naming, repointed consumers"
    next_safe_action: "Strict-validate and close"
    blockers: []
    key_files:
      - ".opencode/skills/sk-interface-design/references/design-process/real_ui_loop.md"
      - ".opencode/skills/mcp-open-design/references/design_parity_transport.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-010-decouple-from-open-design"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 10: decouple-from-open-design

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

> Split the seam doc.

- [x] T001 `git mv` claude_design_parity.md -> real_ui_loop.md and rewrite it vendor-neutral (strip Open Design transport; keep §6/§7/§8)
- [x] T002 Create `mcp-open-design/references/design_parity_transport.md` (transport half, points to real_ui_loop.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Strip naming and repoint consumers.

- [x] T003 Strip Open Design naming from sk-interface-design SKILL.md, README.md, design_inventory.md, design_references_mcp.md, variation_diversity.md, graph-metadata.json
- [x] T004 [P] Generalize feature_catalog + manual_testing_playbook (rename the open-design-grounding feature + the claude-design-parity group; strip naming)
- [x] T005 Repoint mcp-open-design (SKILL.md, README, INSTALL_GUIDE, feature_catalog) and sk-prompt (design_generation_patterns.md)
- [x] T006 Version bumps + changelogs (sk-interface-design v1.4.0.0, mcp-open-design v1.4.0.0)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> Prove standalone and unbroken.

- [x] T007 grep: zero Open Design naming in sk-interface-design live content; reverse coupling intact in mcp-open-design
- [x] T008 No dangling `claude_design_parity` links repo-wide; sk-doc validators green
- [x] T009 Strict-validate this phase; reconcile parent map + children_ids
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
