---
title: "Tasks: Envelope-Fidelity Enforcement [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "envelope fidelity enforcement"
  - "mandatory render slots verdict"
  - "post render envelope fidelity check"
  - "pre rendered verdict fragment"
  - "requestQuality citationPolicy render"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/027-envelope-fidelity-enforcement"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the build tasks from recs 5, 6, 9, all unchecked"
    next_safe_action: "Hold for implementation, no task has started yet"
    blockers: []
    key_files:
      - ".opencode/commands/memory/search.md"
      - ".opencode/commands/memory/assets/search_presentation.txt"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/check-envelope-fidelity.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-027-envelope-fidelity-enforcement"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Envelope-Fidelity Enforcement

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

- [ ] T001 Confirm the shipped verdict shape at `handlers/memory-search.ts:1325-1327` and the field set `assessRequestQuality` returns, with no edit to the verdict logic (`.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`)
- [ ] T002 Confirm the render contract names the two fields as the only sanctioned extras and their absence is valid (`.opencode/commands/memory/search.md`)
- [ ] T003 [P] Define the default-OFF flag name for the render mandate and the fragment emit, and the grandfather report mode for the fidelity check
- [ ] T004 [P] Enumerate the matrix axes the fidelity check and the vitest must cover, dropped field, renamed field, altered value, empty result, confidence disabled
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Reclassify `requestQuality` and `citationPolicy` to conditionally-mandatory required-when-present render slots and extend the render self-check to re-emit a tool-present field absent from the render, behind a default-OFF flag (`.opencode/commands/memory/search.md`)
- [ ] T006 Mirror the conditionally-mandatory rule and the re-emit rule in the presentation asset so the contract and asset agree (`.opencode/commands/memory/assets/search_presentation.txt`)
- [ ] T007 Build the deterministic check that replays the tool verdict against a rendered block, asserts each shipped field is present and unmodified, with a fail mode and a grandfather report mode (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/check-envelope-fidelity.mjs`)
- [ ] T008 Emit a pre-rendered verdict fragment from the handler, rendered from the shipped verdict object, behind a default-OFF flag, with the verdict logic unchanged (`.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts`)
- [ ] T009 Author the vitest proving the check fails a dropped-field render, passes a faithful render, and the grandfather report mode does not fail a pre-existing non-conforming render (`.opencode/skills/system-spec-kit/mcp_server/tests/envelope-fidelity.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Confirm a dropped-field render fails the fidelity check in fail mode and lists in grandfather report mode with a zero exit, a renamed field and an altered value also fail in fail mode, and a confidence-disabled run is nothing-to-replay
- [ ] T011 Confirm the render contract and asset describe the two fields as conditionally-mandatory required-when-present with a re-emit rule behind a default-OFF flag, and the handler fragment emit is default-OFF and renders the verdict verbatim with the verdict logic unchanged
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
