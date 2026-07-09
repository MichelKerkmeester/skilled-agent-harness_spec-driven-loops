---
title: "Tasks: Presentation-Layer Quick Wins: Breadcrumbs, Result Floor, Field-Shape Parity"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "presentation layer quick wins"
  - "breadcrumb suppression fix"
  - "memory context result floor"
  - "dead tokenbudget parameter"
  - "compactdirectresult minimalresults parity"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/006-presentation-layer-fixes"
    last_updated_at: "2026-07-09T11:15:00.000Z"
    last_updated_by: "opencode-gpt-5.5"
    recent_action: "Implemented fixes, ran targeted verification, and documented broad-suite timeout/failures"
    next_safe_action: "Resolve package-wide npm test failures/timeouts before making a global no-regressions claim"
    blockers: []
    key_files:
      - ".opencode/commands/memory/assets/search_presentation.txt"
      - ".claude/commands/memory/assets/search_presentation.txt"
      - ".opencode/commands/memory/search.md"
      - ".claude/commands/memory/search.md"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-006-presentation-layer-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Presentation-Layer Quick Wins: Breadcrumbs, Result Floor, Field-Shape Parity

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

- [x] T001 Confirm `.opencode/` and `.claude/` copies of `search_presentation.txt` and `search.md` are byte-identical before editing (baseline `diff`; both exit 0, no output)
- [x] T002 Decide the concrete minimum-rows floor value for `enforceTokenBudget` and record the rationale (`10`, matching memory_search confidence-truncation floor behavior)
- [x] T003 Decide the `tokenBudget` caller-override design: wired a real override through schemas, handler args, and effective budget resolution
- [x] T004 [P] Grep sweep for any other template rendering `<leaf-folder>/` or the leaf-only rule beyond `search.md`/`search_presentation.txt` (only command presentation/template targets found)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Edit folder display rules in `.opencode/commands/memory/assets/search_presentation.txt` to render the full `specFolder` breadcrumb instead of the leaf-only name
- [x] T006 Mirror T005 in `.claude/commands/memory/assets/search_presentation.txt`
- [x] T007 Update the inline result-block templates (`<specFolder>/` placeholder, verdict-slot example) in `.opencode/commands/memory/search.md` to match the breadcrumb rendering
- [x] T008 Mirror T007 in `.claude/commands/memory/search.md`
- [x] T009 Add the T002-decided minimum-rows floor to `enforceTokenBudget`'s `compactDirectResult` pop loop
- [x] T010 Add the same floor to `enforceTokenBudget`'s structured-result pop loop
- [x] T011 Fix the `effectiveBudget` resolution per the T003 decision
- [x] T012 Drop `includeContent: true` and add explicit `limit: 10` to the default `memory_context` call in `.opencode/commands/memory/search.md`
- [x] T013 Mirror T012 in `.claude/commands/memory/search.md`
- [x] T014 [P] Align `compactDirectResult`, `minimalResults`, and the dropped-results metadata mapper so `specFolder` and `filePath` both survive every truncation path (additive only)
- [x] T015 [P] Add the command-contract doc note / correct the surface-parity claim in `search.md` and `search_presentation.txt` (both copies)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Vitest: `npx vitest run tests/memory-context-token-budget.vitest.ts tests/tool-input-schema.vitest.ts` proved the floor for both pop loops (64/64 passed)
- [x] T017 Vitest: `memory-context-token-budget.vitest.ts` proved a caller-supplied `tokenBudget` reaches `effectiveBudget`; `tool-input-schema.vitest.ts` proved schema acceptance
- [x] T018 Manual: `memory_context` deep query for this packet returned 4 rows, full `specFolder` values, and `originalResultCount=4` / `returnedResultCount=4`
- [x] T019 Diff-check: post-edit `diff -u` for both `.opencode/` and `.claude/` command files returned exit 0, no output
- [x] T020 Ran `npm run build`, `npm run rebuild`, targeted dist freshness, typecheck, targeted Vitest, and strict packet validation (`validate.sh ... --strict`: Errors 0, Warnings 0, RESULT PASSED); broad `npm test` timed out after 1800s with observed failures, documented in implementation-summary.md
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed for the packet-specific row-count and breadcrumb spot check
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
