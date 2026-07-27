---
title: "Tasks: Pi hook extension layer"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "pi hook extension tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/008-pi-hook-extension-layer"
    last_updated_at: "2026-07-27T08:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored tasks.md sequencing the live probe before adapter authoring"
    next_safe_action: "Author checklist.md next"
    blockers:
      - "depends on 001-pi-contract-pin and 003-cli-pi-skill-packet landing first"
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: pi-hook-extension-layer

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

All tasks below are **Pending**, gated on phase 001 (`pi-contract-pin`) landing first; none can start in this environment as of authoring time (`command -v pi` empty, no `.pi/` directory).

- [ ] T001 Re-read `pi.dev/docs/latest/extensions` live at execution time; diff against this phase's cached findings and note any drift (`plan.md` §4 Phase 1)
- [ ] T002 Locate and type-introspect the extension registration surface shipped with the installed `@earendil-works/pi-coding-agent` package once phase 001 has installed it
- [ ] T003 Author one minimal instrumented `.pi/extensions/*.ts` probe module that logs every lifecycle callback name/payload it receives
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Run a real interactive `pi` session and the phase-001-confirmed headless dispatch surface, exercising session start, at least one tool call, and session end; capture which callbacks actually fire
- [ ] T005 Record the confirmed lifecycle surface (names, payload shapes, block-capability) — this is the required input to T006
- [ ] T006 Choose Shape A (in-process direct-call) or Shape B (`spawnSync` delegate), or a hybrid, based on T004/T005's findings; record rationale
- [ ] T007 [P] Author `mcp-server/hooks/pi/**` (shared module + per-guard adapters + `README.md`), mirroring `hooks/codex/`, `hooks/devin/`, `hooks/cursor/`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Fixture-based unit probing of fail-open behavior (malformed/missing input) for each bridged guard
- [ ] T009 Live smoke test each wired lifecycle point against a real `pi` session, capturing stdin/stdout (or equivalent in-process) evidence
- [ ] T010 Update documentation — author `README.md` in each new `hooks/pi/` sibling directory, cross-referencing the Codex/Devin/Cursor precedent; document any guard core the probe shows cannot be bridged as an explicit, named gap
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (live `pi` session smoke test evidence captured per wired lifecycle point)

This phase's own `spec.md`/`plan.md`/`tasks.md`/`checklist.md` authoring pass is separate from — and precedes — every task above; none of T001-T010 are performed by this authoring pass. This phase's status remains **Planned**, and no `implementation-summary.md` is authored until a future pass actually executes T001-T010.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- Depends on `../001-pi-contract-pin/` (live extension-loading + headless dispatch confirmation) and `../003-cli-pi-skill-packet/` (hub registration); sequenced after `../007-pi-mcp-host-integration/`.
- Precedes `../009-pi-model-registry-and-routing/`.
- Structural precedent: `.opencode/skills/system-spec-kit/mcp-server/hooks/{codex,devin,cursor}/`, `.opencode/skills/system-spec-kit/runtime/hooks/{codex,devin,cursor}/`.
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
