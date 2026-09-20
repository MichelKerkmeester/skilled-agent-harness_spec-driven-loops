---
title: "Tasks: Phase 3 — trim duplicated provider/model enumerations"
description: "Task list for trimming redundant model enumerations to residue + pointer across six modes (Complete)."
trigger_phrases:
  - "trim cli reference model tables tasks"
  - "compact residue plus pointer task list"
  - "de-duplicate provider model docs tasks"
  - "self-sufficiency dispatch gate tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-per-mode-provider-model-reference/003-trim-duplicates"
    last_updated_at: "2026-07-29T09:18:42Z"
    last_updated_by: "implementer"
    recent_action: "Trimmed duplicated enumerations across six modes, preserved routing JSON"
    next_safe_action: "Hub reconcile + adjacent fixes + validate (phase 004)"
    blockers: []
    key_files:
      - "cli-opencode/references/cli-reference.md"
      - "cli-cursor/references/cli-reference.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "tasks-033-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3 — trim duplicated provider/model enumerations

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

- [x] T001 Confirm phase 2 wiring complete (pointers resolvable, six leaves registered) — [evidence: `leaf-manifest.json` six catalog leaves registered; pointers resolve]
- [x] T002 Define per-mode trim rules + the self-sufficiency gate (default id + runnable invocation must survive) — [evidence: gate later verified — each `SKILL.md` retained default id + runnable invocation 6/6]
- [x] T003 [P] Enumerate the three routing JSON classes to exclude from all edits — [evidence: excluded `description.json` / `graph-metadata.json` / `hub-router.json`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Trim each mode's `cli-reference.md` model section to residue + pointer (six parallel agents, one mode each)
- [x] T005 [P] Trim each mode's `SKILL.md` roster to default + effort + invocation + parse table + pointer
- [x] T006 Preserve mode-specific mechanics inline (opencode auth pre-flight, codex `-c` syntax, cursor's full 10-id allowlist) — [evidence: cursor 10-id allowlist kept inline (10 ids); codex `-c model_reasoning_effort=` retained]
- [x] T007 Grep-sweep `integration-patterns.md` / `prompt-templates.md` / `agent-delegation.md` — remove standalone enumeration tables only, keep runnable pins
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Self-sufficiency gate — each `SKILL.md` retains a concrete default id + runnable invocation (6/6)
- [x] T009 `git diff` confirms zero changes to `description.json` / `graph-metadata.json` / `hub-router.json`; cursor 10 ids still inline; links resolve
- [x] T010 Advisor routing smoke — provider-named prompts route to the correct mode (6/6 at 0.95) — [evidence: 6/6 provider-named prompts routed to correct mode at 0.95; routing per `smart-routing.md`]
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

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
