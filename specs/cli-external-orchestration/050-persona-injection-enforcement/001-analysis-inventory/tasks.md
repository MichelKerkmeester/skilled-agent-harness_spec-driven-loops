---
title: "Tasks: Persona-Injection Gap Analysis & Dispatch-Point Inventory"
description: "Task breakdown for the read-only cli-devin inventory sweep and orchestrator verification."
trigger_phrases:
  - "persona injection analysis tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/050-persona-injection-enforcement/001-analysis-inventory"
    last_updated_at: "2026-08-19T09:25:00Z"
    last_updated_by: "claude"
    recent_action: "All inventory + verification tasks complete"
    next_safe_action: "Author P2 persona-injection contract"
    blockers: []
    key_files:
      - "scratch/dispatch-point-inventory.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-050-001-analysis"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Persona-Injection Gap Analysis & Dispatch-Point Inventory

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

**Task Format**: `T### [P?] Description (target)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Verify devin availability + auth (`command -v devin`; dispatch exit 0)
- [x] T002 Read `cli-devin/SKILL.md` (CLI dispatch preload rule)
- [x] T003 Read `cli-prompt-quality-card.md` + cli-devin `providers-and-models.md` for model id + prompt-craft
- [x] T004 Compose the persona-injected dispatch prompt (inline `context` persona + file list + output schema)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Dispatch cli-devin (`gemini-3-7-flash-high`) to read the 6 modes + hub + sk-prompt + agents roster and write the inventory to `scratch/`
- [x] T006 Inventory: agent-persona roster + persona-to-intent mapping (`dispatch-point-inventory.md` §A, REQ-001)
- [x] T007 Inventory: every dispatch/prompt-composition point per mode + hub + sk-prompt with `file:line` (`§B`, REQ-002)
- [x] T008 Inventory: per-mode native-load-vs-inline classification with evidence (`dispatch-point-inventory.md` §C, REQ-003)
- [x] T009 Inventory: explicit gap statement — which paths attach NO persona today (`dispatch-point-inventory.md` §D, REQ-004)
- [x] T010 Inventory: catalogue existing precedents (`§E`: Rule 12/13/14, `--agent`, auto-import, `.toml` TUI-only, opencode subagent, `orchestrate.md` protocol) (REQ-005)
- [x] T011 Inventory: identify sk-prompt doc(s) owning CLI prompt construction (`dispatch-point-inventory.md` §F, REQ-006)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Orchestrator verifies a sample of cited `file:line` claims against source (deterministic; no hallucination found)
- [x] T013 Confirm all 6 modes + hub + sk-prompt covered (cross-check `mode-registry.json` + `rg` completeness sweep)
- [x] T014 Record findings summary in `implementation-summary.md`
- [x] T015 Run `validate.sh` on the phase folder with `--strict` (Errors:0)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (`T001`–`T015`)
- [x] No `[B]` blocked tasks remaining (`git status` clean)
- [x] Every native-vs-inline verdict cites `file:line` (`§C` table)
- [x] Manual verification passed (deterministic; `cline` cross-check inconclusive — documented)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
