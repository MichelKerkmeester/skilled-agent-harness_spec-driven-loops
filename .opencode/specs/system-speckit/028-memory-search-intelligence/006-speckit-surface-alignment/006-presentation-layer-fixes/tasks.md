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
    packet_pointer: "system-speckit/028-memory-search-intelligence/006-speckit-surface-alignment/006-presentation-layer-fixes"
    last_updated_at: "2026-07-10T08:09:04.000Z"
    last_updated_by: "claude-code"
    recent_action: "Phase R audit remediation completed: swarm-implemented, Sonnet-verified, all tasks evidenced"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
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

## Phase R: Audit Remediation (2026-07-09 GPT-5.6 review wave)

> Source: 10-slice parallel audit of the 028 wave; findings verified against the working tree. This child owns its own presentation fixes plus the cross-cutting MCP public-contract parity items (no dedicated surface child carries a tasks.md). The expanded file footprint (`context-server.ts`, `tool-schemas.ts`, `schemas/tool-input-schemas.ts`, `tools/types.ts`, `tests/mcp-tool-dispatch.vitest.ts`) is reconciled into `spec.md`'s "Phase R Addendum" scope table and `implementation-summary.md`'s Files Changed / Phase R sections.

- [x] T021 [P1] Stop claiming budget fit when the 10-row compaction floor exceeds the caller budget: enforce a minimum accepted `tokenBudget`, compact floored rows further, or return an explicit `floorExceededBudget` state (`mcp_server/handlers/memory-context.ts:718-726`). Evidence: matrix test with budgets below/at/above the minimum 10-row payload. DONE 2026-07-10 — enforceTokenBudget now has explicit states: impossible budget (droppedAllResultsReason), floor overflow (floorExceededBudget computed live from the actual serialized object at every exit), true fit; response can never claim fit while actualTokens>budget (verifier traced every return path + matrix tests). Sonnet-max verified ACCEPT.
- [x] T022 [P1] Upward `tokenBudget` overrides are undone by the outer envelope re-trim to the fixed per-tool budget (`mcp_server/context-server.ts:1475`). Give one layer ownership of enforcement or make the envelope honor the validated override. Evidence: MCP-dispatch-level test with an override above 3500 asserting the serialized response size. DONE 2026-07-10 — envelope honors handler-owned memory_context tokenBudget both directions via resolveEnvelopeTokenBudget with a strict name===memory_context guard (other tools provably unaffected — verifier probe + untouched constitutional-sync suite 24/24); dispatch-level test proves a 12000-token envelope survives (old logic re-trimmed to 3500). Sonnet-max verified ACCEPT.
- [x] T023 [P2] Metadata-only compaction drops snake-case `spec_folder`: add the `?? r.spec_folder` fallback used by direct compaction to both metadata-only mappers (`mcp_server/handlers/memory-context.ts:785-795`). Evidence: snake-case and mixed-shape fixture coverage. DONE 2026-07-10 — shared toMetadataOnlyContextRow mapper with ?? r.spec_folder fallback at both call sites + snake-case fixtures. Sonnet-max verified ACCEPT.
- [x] T024 [P1] `embedder_set.dryRun` is implemented (Zod + handler) but absent from the advertised MCP schema (`mcp_server/tool-schemas.ts:858` vs `schemas/tool-input-schemas.ts:566-569`). Add it and a parity test asserting every Zod property is publicly advertised. DONE 2026-07-10 — embedder_set.dryRun advertised; new parity test asserts every tool public schema equals its Zod shape keys (all 41 tools). Sonnet-max verified ACCEPT.
- [x] T025 [P2] Remove the four dead `skill_graph_*` registrations from `schemas/tool-input-schemas.ts:637` (migrated tools, no dispatcher); assert exact name-set equality across TOOL_DEFINITIONS, TOOL_SCHEMAS, and dispatcher TOOL_NAMES. DONE 2026-07-10 — four dead skill_graph_* Zod registrations + two supporting enums removed; exact 41-name set equality asserted across TOOL_DEFINITIONS/TOOL_SCHEMAS/dispatchers. Sonnet-max verified ACCEPT.
- [x] T026 [P2] The dispatch test covers 24 of 41 advertised tools and never calls `dispatchTool` (`mcp_server/tests/mcp-tool-dispatch.vitest.ts:72`). Iterate TOOL_DEFINITIONS, dispatch each, assert one-and-only-one dispatcher per name. DONE 2026-07-10 — dispatch test drives the real dispatchTool for all 41 tools with exactly-one-owner + one-handler-invocation assertions; Zod throwing .parse ensures stubs cannot fake ownership. Sonnet-max verified ACCEPT.
- [x] T027 [P2] `tools/types.ts` dispatch interfaces lag the schemas (EmbedderSetArgs, SearchArgs, HealthArgs, SaveArgs, SessionResumeArgs, CheckpointCreateArgs, CausalStatsArgs, IngestStartArgs). Generate/infer from Zod or add compile-time parity assertions (`mcp_server/tools/types.ts:178`). DONE 2026-07-10 — tools/types.ts interfaces completed; bidirectional compile-time parity assertions (Assert/HasExactSchemaKeys) — verifier reproduced the mechanism failing tsc on a dropped field in isolation. Sonnet-max verified ACCEPT.
- [x] T028 [P2] `memory_context.includeConstitutional` is consumed by the handler and allow-listed but missing from the Zod/public schema, so strict validation rejects it (`schemas/tool-input-schemas.ts:182` vs `:653`, `handlers/memory-context.ts:1860`). Add it consistently or remove the dead option. DONE 2026-07-10 — includeConstitutional consistent across Zod + public schema + ContextArgs; strict-schema sweep test green; resolved a pre-existing budget-0 test failure (230/231→green) via a principled impossible-budget fast path, assertions untouched. Sonnet-max verified ACCEPT.
