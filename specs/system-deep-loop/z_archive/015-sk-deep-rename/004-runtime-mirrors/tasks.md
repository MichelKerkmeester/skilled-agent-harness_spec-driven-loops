---
title: "Tasks: Phase 004 Runtime Mirrors"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "070 phase 004 tasks"
  - "runtime mirror rename tasks"
  - "claude codex gemini tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/015-sk-deep-rename/004-runtime-mirrors"
    last_updated_at: "2026-05-05T16:20:37Z"
    last_updated_by: "cli-codex"
    recent_action: "Created Phase 004 task list"
    next_safe_action: "Complete runtime mirror replacements"
    blockers: []
    key_files:
      - "tasks.md"
      - ".claude/agents"
      - ".codex/agents"
      - ".gemini/agents"
      - ".gemini/commands/speckit/deep-research.toml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 004 Runtime Mirrors

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

- [x] T001 Read parent rename context (`../spec.md`)
- [x] T002 Read parent resource map (`../resource-map.md`)
- [x] T003 Filter Phase 001 inventory for runtime mirror rows (`../001-discovery-impact-map/inventory.tsv`)
- [x] T004 Read runtime README files (`.claude/agents/README.txt`, `.codex/agents/README.txt`, `.gemini/agents/README.txt`)
- [x] T005 Identify old-name runtime occurrences (`.claude`, `.codex`, `.gemini`)
- [x] T006 Author Phase 004 Level 2 planning artifacts (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `graph-metadata.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Replace old review skill references in Claude runtime mirrors (`.claude/agents/deep-review.md`)
- [x] T008 Replace old research skill references in Claude runtime mirrors (`.claude/agents/deep-research.md`, `.claude/agents/orchestrate.md`)
- [B] T009 Replace old review skill references in Codex runtime mirrors (`.codex/agents/deep-review.toml`; evidence: `.codex` writes return `Operation not permitted`)
- [B] T010 Replace old research skill references in Codex runtime mirrors (`.codex/agents/deep-research.toml`, `.codex/agents/orchestrate.toml`; evidence: `.codex` writes return `Operation not permitted`)
- [x] T011 Replace old review skill references in Gemini runtime mirrors (`.gemini/agents/deep-review.md`, `.gemini/commands/speckit/deep-research.toml`)
- [x] T012 Replace old research skill references in Gemini runtime mirrors (`.gemini/agents/deep-research.md`, `.gemini/agents/orchestrate.md`, `.gemini/commands/speckit/deep-research.toml`)
- [x] T013 Remove replacement backup files if present (`.claude`, `.codex`, `.gemini`; evidence: backup-file find returned no rows)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [B] T014 Verify residual grep returns zero old-name rows (evidence: residual count 4, all under `.codex`)
- [x] T015 Verify touched/targeted TOML files parse (evidence: `/opt/homebrew/bin/python3.11` `tomllib` printed `toml ok`)
- [x] T016 Run child strict validation (evidence: strict validation exit 0)
- [x] T017 Run parent strict validation (evidence: strict validation exit 0)
- [x] T018 Record completion evidence in tasks, checklist, and implementation summary
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Runtime mirror residual grep returns zero rows
- [x] Child and parent strict validation exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent Resource Map**: See `../resource-map.md`
- **Phase 001 Inventory**: See `../001-discovery-impact-map/inventory.tsv`
<!-- /ANCHOR:cross-refs -->
