---
title: "Tasks: refine-hub-cli-connections"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "refine hub cli tasks"
  - "c1 c10 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/004-prompt-knowledge-layering/009-refine-hub-cli-connections"
    last_updated_at: "2026-06-03T06:14:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored phase 009 task list"
    next_safe_action: "Implement C3 STAR/fallback fix"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e02c3e95-f865-4fec-8ff8-0a7907486924"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: refine-hub-cli-connections

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

- [x] T001 Confirm C7 dispatch matrix — kimi/qwen/glm dispatch via cli-opencode; qwen exclusive (model-profiles.json)
- [x] T002 Read each target file's exact current state before editing (READ-FIRST law)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 C3 — relabel STAR/BUILD as cli-devin task-shapes; remove STAR from the sk-prompt framework list (sk-prompt-models/SKILL.md)
- [x] T004 C3 — fix "registry names…STAR as fallback" to match `fallback: null` (sk-prompt-models/references/models/swe-1.6.md)
- [x] T005 [P] C4 — fix swe-1.6 fallback mis-column (sk-prompt-models/references/models/_index.md)
- [x] T006 C1 — pointer-ize the Tier-3 precedence trigger, drop the enumeration (cli-opencode/SKILL.md)
- [x] T007 C1 — pointer-ize the Tier-3 precedence trigger (cli-codex/SKILL.md)
- [x] T008 C1 — pointer-ize the Tier-3 precedence trigger (cli-gemini/SKILL.md)
- [x] T009 C1 — pointer-ize the Tier-3 precedence trigger (cli-claude-code/SKILL.md)
- [x] T010 C1/C2 — pointer-ize the Tier-3 trigger + drop the RCAF/STAR/BUILD restatement (cli-devin/SKILL.md)
- [x] T011 [P] C5 — replace embedded opencode run wrapper with rule + pointer (sk-prompt-models/references/models/mimo-v2.5-pro.md)
- [x] T012 [P] C5 — replace embedded opencode run wrapper with rule + pointer (sk-prompt-models/references/models/minimax-m3.md)
- [x] T013 C8 — complete pattern-index §4 (author-profile + _index row + matrix row); delete/merge the divergent SKILL.md §3 copy (pattern-index.md + SKILL.md)
- [x] T014 C6 — shared default-unverified note + add bidirectional card↔profile links for the 4 clones (4 cluster profiles + cli-opencode/cli-devin cards)
- [x] T015 C7 — add kimi/qwen/glm trigger_phrases + intent_signals (cli-opencode/graph-metadata.json)
- [x] T016 C9 — extend the guard: pointer-only Tier-3 check incl. SKILL.md, registry↔profile↔_index completeness, discovery reachability (check-prompt-quality-card-sync.sh)
- [x] T017 C9 — wire the guard into CI/hook
- [x] T018 [P] C10 — refresh last_updated_at + intent_signals + enhances[].context (sk-prompt-models/graph-metadata.json)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 Run the extended guard: exit 0 on clean tree; non-zero on each planted regression
- [x] T020 grep invariants: no Tier-3 enumeration in cli-*/SKILL.md; STAR reads only as cli-devin task-shape; cluster card↔profile round-trip
- [x] T021 Advisor probe: a "qwen3.6" prompt surfaces cli-opencode
- [x] T022 `validate.sh --recursive --strict` on the 130 parent → exit 0; per-skill changelogs added
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Extended guard green; validate --strict exit 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision record**: See `../research/research.md` (the converged C1–C10 backlog)
<!-- /ANCHOR:cross-refs -->
