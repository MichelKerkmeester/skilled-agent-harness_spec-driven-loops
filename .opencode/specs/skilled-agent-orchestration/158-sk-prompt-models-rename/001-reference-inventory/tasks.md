---
title: "Tasks: Phase 1: reference-inventory"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "sk-prompt-models inventory tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/158-sk-prompt-models-rename/001-reference-inventory"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Task list scaffolded; not started"
    next_safe_action: "Begin T001 (rg sweep)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/001-reference-inventory"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: reference-inventory

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

- [ ] T001 Sweep: `rg -l "sk-prompt-small-model" | wc -l` + `rg -c` totals; bucket by top-level dir + extension (no `-E`)
- [ ] T002 Enumerate binary/generated: `*.sqlite`, compiled `skill-graph.json`, derived `description.json`/`graph-metadata.json` blocks → REGENERATE set
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Classify every file into TEXT-REPLACE / REGENERATE / GIT-MV / HISTORY-CARE
- [ ] T004 Cross-check vs the known high-risk hardcoded list (card-sync guard `.sh`, deep_*.yaml, reviewer-regression.json, secret-scrubber test, model_profiles profile_refs, models/*.md back-links)
- [ ] T005 Identify the rename-documenting changelog line(s) → HISTORY-CARE
- [ ] T006 Write `001-reference-inventory/reference-map.md` (buckets + counts + exclusions + replace command)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Reconcile map count vs a fresh `rg -l ... | wc -l`
- [ ] T008 Dry-run the replace command (no write); confirm hit counts; write implementation-summary.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Map reconciles 100%
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
