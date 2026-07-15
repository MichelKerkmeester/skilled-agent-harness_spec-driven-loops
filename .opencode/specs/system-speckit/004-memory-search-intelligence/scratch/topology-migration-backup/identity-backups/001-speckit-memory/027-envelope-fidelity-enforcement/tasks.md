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
    packet_pointer: "system-speckit/004-memory-search-intelligence/001-speckit-memory/027-envelope-fidelity-enforcement"
    last_updated_at: "2026-07-04T17:51:01.493Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented recs 5, 6, 9 behind SPECKIT_ENVELOPE_FIDELITY_V1, all tasks checked"
    next_safe_action: "Run the grandfather report over a captured render corpus before the default-on flip follow-on"
    blockers: []
    key_files:
      - ".opencode/commands/memory/search.md"
      - ".opencode/commands/memory/assets/search_presentation.txt"
      - ".opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/check-envelope-fidelity.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-027-envelope-fidelity-enforcement"
      parent_session_id: null
    completion_pct: 100
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

- [x] T001 Confirmed the shipped verdict shape at the derive site `formatters/search-results.ts:1160-1179` (the handler delegates here, which is where `requestQuality` and `citationPolicy` are populated and shipped) and the `{ requestQuality: { label } }` field set `assessRequestQuality` returns, with no edit to the verdict logic (`.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts`)
- [x] T002 Confirmed the render contract named the two fields as the only sanctioned extras with absence valid at `search.md:76` and the asset at `search_presentation.txt:102-116` (`.opencode/commands/memory/search.md`)
- [x] T003 [P] Defined the single default-OFF flag `SPECKIT_ENVELOPE_FIDELITY_V1` for the render mandate and the fragment emit, and the grandfather report mode as a check argument rather than a flag
- [x] T004 [P] Enumerated the matrix axes the fidelity check and the vitest cover: dropped field, renamed field, altered value, empty result, confidence disabled, fail mode, grandfather mode
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Reclassified `requestQuality` and `citationPolicy` to conditionally-mandatory required-when-present render slots and extended the render self-check to re-emit a tool-present field absent from the render, behind the default-OFF `SPECKIT_ENVELOPE_FIDELITY_V1` flag (`.opencode/commands/memory/search.md`)
- [x] T006 Mirrored the conditionally-mandatory rule and the re-emit rule in the presentation asset so the contract and asset agree (`.opencode/commands/memory/assets/search_presentation.txt`)
- [x] T007 Built the deterministic check that replays the tool verdict against a rendered block, asserts each shipped field is present and unmodified, with a fail mode and a grandfather report mode (`.opencode/skills/system-spec-kit/mcp_server/scripts/evals/check-envelope-fidelity.mjs`)
- [x] T008 Emitted the pre-rendered `data.envelopeRender` fragment at the formatter derive site (the handler delegates to the formatter, which holds the shipped verdict object), behind the default-OFF flag, with the verdict logic unchanged (`.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts`)
- [x] T009 Authored the vitest proving the check fails a dropped-field render, passes a faithful render, the grandfather report mode does not fail a pre-existing non-conforming render, and the fragment survives the context passthrough (`.opencode/skills/system-spec-kit/mcp_server/tests/envelope-fidelity.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Confirmed a dropped-field render fails the fidelity check in fail mode (exit 1) and lists in grandfather report mode with a zero exit, a renamed field and an altered value also fail in fail mode, and a confidence-disabled run is nothing-to-replay (vitest 12/12 plus CLI smoke test)
- [x] T011 Confirmed the render contract and asset describe the two fields as conditionally-mandatory required-when-present with a re-emit rule behind the default-OFF flag, and the fragment emit is default-OFF and renders the verdict verbatim with the verdict logic in `confidence-scoring.ts` unchanged (flag-off byte-identical test passes)
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
