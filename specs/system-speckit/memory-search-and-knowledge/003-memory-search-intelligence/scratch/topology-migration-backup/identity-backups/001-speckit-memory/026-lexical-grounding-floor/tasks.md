---
title: "Tasks: Lexical-Grounding Floor and Single-Hit Corroboration [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "lexical grounding floor"
  - "single hit corroboration"
  - "off corpus false relevance"
  - "citation grounding floor"
  - "assess request quality corroboration"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/026-lexical-grounding-floor"
    last_updated_at: "2026-07-04T17:50:59.665Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed all floor, corroboration, flag and vitest tasks"
    next_safe_action: "Graduate the flag after a wider validation pass"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/lexical-grounding-floor.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-026-lexical-grounding-floor"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Lexical-Grounding Floor and Single-Hit Corroboration

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

- [x] T001 Confirm the lexical signal `fts_score`/`bm25_score`/`keyword` reaches the scored results in `assessRequestQuality` and decide how the floor reads it off the top hit (`.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts`)
- [x] T002 Add the `SPECKIT_LEXICAL_GROUNDING_V1` default-OFF flag reader, resolving an unparseable value to OFF (`.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts`)
- [x] T003 [P] Confirm `deriveCitationPolicy` needs no edit because cite_results already follows the label (`.opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts`)
- [x] T004 [P] Pull the 030 off-corpus anchor, the aligned good queries and the correctly-weak authentication case as the validation set
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add the lexical-grounding floor to `assessRequestQuality`, denying good when the top hit carries no overlap above the floor, gated by the flag, failing closed on an absent or zero signal (`.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts`)
- [x] T006 Add the single-hit corroboration guard requiring a second above-threshold hit before good is reachable through the margin path or the `qualityRatio`-on-a-lone-hit path, gated by the flag (`.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts`)
- [x] T007 Keep the flag-OFF path byte-for-byte the shipped verdict, with the new branches reachable only when the flag is ON (`.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts`)
- [x] T008 Author the verdict-level vitest over the off-corpus anchor, the aligned good queries, the weak case and the lone-hit path, asserting a cosine profile, flag ON and flag OFF (`.opencode/skills/system-spec-kit/mcp_server/tests/lexical-grounding-floor.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Confirm with the flag ON the kubernetes off-corpus sample scores weak or gap and returns do_not_cite_results, a single-result zero-margin sample scores weak, and a two-hit corroborated query at the same top score scores good
- [x] T010 Confirm with the flag OFF the kubernetes sample still scores good, the aligned good queries still score good with the flag ON, and the authentication case still scores weak
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
