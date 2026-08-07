---
title: "Tasks: Phase 002 - Transport and Negative-Control Dispatches"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase 002 tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/002-transport-and-negative-controls"
    last_updated_at: "2026-07-07T15:25:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All implementation tasks completed"
    next_safe_action: "Write checklist.md and implementation-summary.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "playbook-wave-002-transport-negative"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 002 - Transport and Negative-Control Dispatches

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

- [x] T001 Read all 5 scenario files in full (`mcp-open-design-mode.md`, `pure-code-routes-skcode.md`, `doc-write-routes-elsewhere.md`, `code-review-routes-skcode.md`, `interface-shared-references.md`)
- [x] T002 Read `022-benchmark-rerun-and-coverage-fill/` as the exact Level 2 structural template
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Advisor probe `MR-007` -> `/tmp/skd-MR007-advisor.txt`
- [x] T004 [P] Advisor probe `AI-002` -> `/tmp/skd-AI002-advisor.txt`
- [x] T005 [P] Advisor probe `AI-003` -> `/tmp/skd-AI003-advisor.txt`
- [x] T006 [P] Advisor probe `AI-004` -> `/tmp/skd-AI004-advisor.txt`
- [x] T007 [P] Advisor probe `SR-001` -> `/tmp/skd-SR001-advisor.txt`
- [x] T008 Real dispatch `MR-007` (Open Design MCP wiring) -> `/tmp/skd-MR007-response.jsonl`; awaited completion via `Monitor`
- [x] T009 Detect + document `MR-007`'s `apply_patch` mutation of `~/.config/opencode/opencode.json`
- [x] T010 Real dispatch `AI-002` (TypeScript refactor) -> `/tmp/skd-AI002-response.jsonl`
- [x] T011 Detect `AI-002`'s unintended mutation of `deep-loop-runtime/lib/deep-loop/executor-config.ts` + its vitest; revert via `git restore`; confirm clean via `git status --short`
- [x] T012 Real dispatch `AI-003` (README section write) -> `/tmp/skd-AI003-response.jsonl`; confirm no mutation (all `read`-only tool calls)
- [x] T013 Real dispatch `AI-004` (checkout API review) -> `/tmp/skd-AI004-response.jsonl`; confirm no mutation, no fabricated findings for the absent target
- [x] T014 Real dispatch `SR-001` (landing-page register-first request, `NO_TARGET_CLAUSE` included) -> `/tmp/skd-SR001-response.jsonl`
- [x] T015 Grep the full `SR-001` transcript for `context_loading_contract`/`interface_preflight_card` read calls; confirm neither was loaded despite both being marked `ALWAYS`/"not optional" in `design-interface/SKILL.md`'s own Resource Loading Levels table
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Grade all 5 dispatches strictly against each scenario file's own Pass/Fail Criteria, citing the specific line
- [x] T017 Write `dispatch-log.md` (one row per dispatch: id, prompt, advisor top-1/confidence, resolved mode/packet/resources, verdict, rationale)
- [x] T018 Write this phase's own `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 5 dispatches have a verdict citing the specific scenario criterion
- [x] The one reversible in-repo side effect is reverted and confirmed clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Phase Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
