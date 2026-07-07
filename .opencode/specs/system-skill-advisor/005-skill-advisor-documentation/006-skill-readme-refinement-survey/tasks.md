---
title: "Tasks: 17-skill README refinement"
description: "Per-wave dispatch breakdown."
trigger_phrases:
  - "006 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-skill-advisor-documentation/006-skill-readme-refinement-survey"
    last_updated_at: "2026-05-16T13:25:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored task list"
    next_safe_action: "Commit packet"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0060000000000000000000000000000000000000000000000000000000000008"
      session_id: "006-skill-readme-refinement-tasks"
      parent_session_id: null
    completion_pct: 98
    open_questions: []
    answered_questions: []
---
# Tasks: 17-Skill README Refinement

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

**Task Format**: `T### Description`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T101 Scaffold packet skeleton and research subdirs
- [x] T102 Render audit prompt + agent-config
- [x] T103 Confirm devin auth + 17-target inventory
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Phase A: audit
- [x] T201 cli-devin audit dispatch (~100s) producing `research/audit-report.{json,md}`

### Phase B: review
- [x] T202 Read audit report; flag 3 false-negatives (sk-git, sk-prompt, mcp-coco-index)

### Phase C: remediation
- [x] T211 Render 15 per-skill remediation prompts + recipes
- [x] T212 Wave 1: cli-devin, cli-opencode, cli-codex, cli-claude-code
- [x] T213 Wave 2: cli-gemini, sk-code, sk-code-review, sk-doc (+ serial retry for sk-doc)
- [x] T214 Wave 3: deep-agent-improvement, deep-review, deep-ai-council, deep-research
- [x] T215 Wave 4: mcp-chrome-devtools, mcp-coco-index, mcp-code-mode
- [x] T216 Wave 5 cleanup: mcp-coco-index v2 + sk-git v2 + sk-prompt v2
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T301 All 17 READMEs em=0, §1 tables=0
- [ ] T302 Strict-validate child 006 exit 0
- [ ] T303 Fill implementation-summary
- [ ] T304 Commit on main
- [ ] T305 Push to origin/main
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All Phase 2 + 3 tasks marked `[x]`
- [ ] Strict-validate exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `../005-cross-skill-documentation-decoupling/`
<!-- /ANCHOR:cross-refs -->
