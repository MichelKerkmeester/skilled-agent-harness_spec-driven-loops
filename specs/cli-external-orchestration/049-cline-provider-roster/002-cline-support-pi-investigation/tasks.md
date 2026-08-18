---
title: "Tasks: Cline provider support for cli pi (investigation)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cline pi investigation tasks"
  - "pi cline provider tasks"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/002-cline-support-pi-investigation"
    last_updated_at: "2026-08-18T12:45:30Z"
    last_updated_by: "claude"
    recent_action: "All investigation tasks complete"
    next_safe_action: "Phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Cline provider support for cli pi (investigation)

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

- [x] T001 Read `.pi/models.json` + `.pi/settings.json` + cli-pi provider reference doc
- [x] T002 Observe live pi `/login` provider list and current provider/model listing
- [x] T003 [P] Capture the Phase 1 Cline facts to test against (id, base URL, model, tiers) (`cline-pass`, `deepseek-v4-flash`, xhigh)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Determine whether pi shares opencode's models.dev provider registry or its own list (pi-own catalog; `0 models.dev` refs in pi dist)
- [x] T005 Probe (sandboxed) whether a `cline-pass` provider block + `enabledModels` resolves in pi
- [x] T006 Resolve the auth path (reuse opencode Cline credential vs pi login) (pi-local `~/.pi/agent/auth.json`; not shared)
- [x] T007 Classify the mechanism: config-only / extension / not feasible (result: `config-only-feasible`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Record the feasibility verdict + evidence in `implementation-summary.md`
- [x] T009 If feasible, name the exact mechanism for a follow-on implementation phase (`cline-pass` block, `api:openai-completions`, `.pi/models.json`)
- [x] T010 Confirm no `.pi` runtime file was modified during the investigation (`git status .pi/` clean)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Feasibility verdict recorded with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
