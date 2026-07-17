---
title: "Implementation Plan: Presentation-Layer Quick Wins: Breadcrumbs, Result Floor, Field-Shape Parity"
description: "Text-only template edits for the breadcrumb fix, a parameterized minimum-rows floor plus effectiveBudget threading fix for the result-count collapse, and additive field-shape parity for the truncation-path row shapes — all inside memory_context's presentation/formatting layer, no ranking or retrieval changes."
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Presentation-Layer Quick Wins: Breadcrumbs, Result Floor, Field-Shape Parity

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (handler) + Markdown/plain-text (command router and presentation contract) |
| **Framework** | Spec Kit Memory MCP server (`mcp_server`) |
| **Storage** | None new — reads existing `ContextResult`/row payloads already in memory |
| **Testing** | Vitest (handler), manual CLI spot checks (rendered output) |

### Overview
Three independent, structurally separate fixes, all inside the presentation/formatting layer: (1) a text-only edit to the folder-display rule in `search_presentation.txt` (both copies) and `search.md`'s inline templates, rendering the full `specFolder` breadcrumb instead of the leaf-only name; (2) a parameterized minimum-rows floor added to `enforceTokenBudget`'s two pop loops in `memory-context.ts`, plus a fix to the `effectiveBudget` resolution so a caller-supplied token budget is no longer silently discarded, plus dropping `includeContent: true` (or adding a `limit`) from `search.md`'s default retrieval call; (3) additive field-shape alignment across the three truncation-path row shapes, plus a doc note correcting the surface-parity claim for one-shot raw-text dispatch. None of the three touches ranking, retrieval, embedding, or the DB schema — every fix operates on rows already fetched and scored.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (spec.md SC-001 through SC-004)
- [x] Dependencies identified (none upstream; dist-rebuild ordering only)

### Definition of Done
- [x] All P0 acceptance criteria met (REQ-001 through REQ-004) by code/template inspection and targeted tests
- [x] Vitest passing for the floor and effectiveBudget-resolution tests (`npx vitest run tests/memory-context-token-budget.vitest.ts tests/tool-input-schema.vitest.ts`: 64 passed)
- [x] Docs updated (spec/plan/tasks/implementation-summary, this folder)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Presentation/template edit (P1) + parameterized truncation-floor and argument-threading fix (P2) + additive row-shape unification (P3) — no new components, no new data flow, all changes are inside existing render/truncation functions.

### Key Components
- **Folder display rules** (`search_presentation.txt:119-124`, both copies): the text rule callers read before rendering any result block. Changed to render the full breadcrumb.
- **`search.md` inline templates** (§3 RETRIEVAL MODE result-block shape, `:58-64`; verdict-slot example): the router's own hard render reminder, kept in sync with the presentation asset per `search.md:139`'s stated boundary ("this router may only inline the compressed retrieval result shape above as a hard render reminder").
- **`enforceTokenBudget`** (`memory-context.ts:623`): the single function that truncates `ContextResult` payloads to fit a token budget. Gains a `minResults`-style floor constant/parameter applied to both its pop loops.
- **`effectiveBudget` resolution** (`memory-context.ts:1949-1950`): the line that currently always prefers `CONTEXT_MODES[effectiveMode]?.tokenBudget` over the caller-oriented `tokenBudget` local. Fixed per the Phase 1 decision below.
- **Row-shape builders**: `compactDirectResult` (`:693-701`), `minimalResults` (`:781-790`), the dropped-results metadata mapper (`:1007-1016`) — three separate inline object literals that currently disagree on field membership.

### Data Flow
Unchanged upstream: `memory_context`/`memory_search` continue to query, rank, and return rows exactly as today. The fix is entirely in how already-fetched rows are (a) labeled at render time (breadcrumb), (b) trimmed to fit a token budget (floor + budget resolution), and (c) shaped into a compact/metadata-only row (field parity). No new query, no new index, no new score.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase is a fix_bug-shaped remediation (spec.md's P1/P2/P3 findings) touching public MCP tool responses and a shared dual-copy presentation policy, so this addendum applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `search_presentation.txt` folder display rules (`:119-124`, both `.opencode/` and `.claude/` copies) | Mandates leaf-only folder-name rendering | update | Both copies re-diffed for byte-identity after the edit; a rendered sample shows the full breadcrumb |
| `search.md` inline result-block templates (`:58-64`, verdict-slot example, both copies) | Hard render reminder mirroring the presentation asset | update | Grep confirms the `<leaf-folder>/` placeholder wording matches the updated presentation asset's rule |
| `enforceTokenBudget` pop loops (`memory-context.ts:713`, `:997`) | Truncate rows to fit budget with an implicit floor of 1 | update | Vitest: synthetic N-result over-budget input returns >= floor rows |
| `effectiveBudget` resolution (`memory-context.ts:1949-1950`) | Always prefers `CONTEXT_MODES[effectiveMode]?.tokenBudget`; caller override never reaches this line today | update | Vitest per the Phase 1 decision (override honored, or code/schema no longer implies one is accepted) |
| `search.md`'s default `memory_context` call (`:46`) | `includeContent: true`, no `limit` | update | Grep confirms the call no longer pairs both; both copies match |
| `compactDirectResult` / `minimalResults` / dropped-results mapper (`:693-701`, `:781-790`, `:1007-1016`) | Three disagreeing row shapes | update (additive) | Grep/test confirms all three carry both `specFolder` and `filePath`; no existing field removed |

Required inventories:
- Same-class producers of the leaf-only rule: `rg -n "leaf folder|leaf-folder" .opencode/commands/memory .claude/commands/memory`.
- Consumers of the row shapes: `rg -n "compactDirectResult|minimalResults|metadataOnly" .opencode/skills/system-spec-kit/mcp_server --glob '*.ts'` (confirm nothing downstream hard-depends on the current narrower shape before adding fields).
- Consumers of `tokenBudget`/`effectiveBudget`: `rg -n "effectiveBudget|tokenBudget" .opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts` (already run during planning; re-run after the fix to confirm no other call site still reads the dead fallback).
- Matrix axes: breadcrumb rendering (single-segment vs multi-segment `specFolder`, colliding-leaf case); floor behavior (result count below floor, at floor, above floor, all-identical-score edge case already handled by `confidence-truncation.ts`'s pattern); `effectiveBudget` (no override supplied, override supplied for a named mode, override supplied for `auto`); row shape (each of the three builders, before/after).
- Algorithm invariant: the floor never causes `enforceTokenBudget` to exceed its budget by more than the already-truncated per-row `content` cap allows (`MAX_CONTENT_CHARS = 500`, `memory-context.ts:984`); a genuinely tiny result set (fewer results than the floor) is returned unchanged, mirroring `confidence-truncation.ts:130`'s `validResults.length <= minResults` short-circuit.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup / Design Decisions
- [x] Confirm `.opencode/` and `.claude/` copies of `search_presentation.txt` and `search.md` are still byte-identical (baseline diff, before any edit)
- [x] Decide the concrete minimum-rows floor value for `enforceTokenBudget` (spec.md open question 1) and record the rationale inline in this plan: floor is `10`, matching the existing `DEFAULT_MIN_RESULTS` behavior used by memory_search confidence truncation.
- [x] Decide the `tokenBudget` caller-override design: wire a real override through `ContextArgs`, tool schemas, runtime schema allowlists, and effective budget resolution. The override takes precedence over per-mode defaults when it is a positive finite number.
- [x] Grep sweep for any other template rendering `<leaf-folder>/` or the leaf-only rule beyond `search.md`/`search_presentation.txt`; only the command presentation/template targets were found.

### Phase 2: Core Implementation
- [x] P1: edit folder display rules in both `search_presentation.txt` copies (`:119-124`) to render the full `specFolder` breadcrumb
- [x] P1: update `search.md`'s inline result-block templates in both copies to match
- [x] P2a: add the Phase-1-decided minimum-rows floor to `enforceTokenBudget`'s two pop loops (`compactDirectResult` and structured path)
- [x] P2b: fix the `effectiveBudget` resolution per the Phase 1 decision
- [x] P2c: drop `includeContent: true` and add explicit `limit: 10` to `search.md`'s default retrieval call, both copies
- [x] P3a: align `compactDirectResult`/`minimalResults`/dropped-results-mapper field shapes so `specFolder` and `filePath` both survive every truncation path
- [x] P3b: add the command-contract doc note / correct the surface-parity claim in `search.md` and `search_presentation.txt`

### Phase 3: Verification
- [x] Vitest: `enforceTokenBudget` never drops below the floor on a synthetic over-budget input (both pop loops)
- [x] Vitest: a caller-supplied `tokenBudget` reaches `effectiveBudget`
- [x] Manual: run a real `deep`-mode query; live MCP returned 4 rows, `originalResultCount=4`, `returnedResultCount=4`, and full `specFolder` breadcrumbs in result data
- [x] Diff-check: `.opencode/` and `.claude/` copies of `search_presentation.txt` and `search.md` stay byte-identical post-edit
- [x] `npm run rebuild` in `mcp_server`, targeted dist freshness passed; strict packet validation recorded in implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `enforceTokenBudget` floor behavior (both pop loops), `effectiveBudget` resolution | Vitest |
| Integration | `memory_context` `deep`-mode call against a content-heavy fixture, row-count and breadcrumb assertions | Vitest |
| Manual | `/memory:search` live query, breadcrumb + row-count spot check, both `.opencode/` and `.claude/` dispatch surfaces | CLI |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `mcp_server` dist rebuild | Internal | Green | `memory-context.ts` changes require `npm run build` in `mcp_server` before the compiled handler reflects them (dist-freshness gate) |
| Upstream 028 phase | Internal | Green (none) | This phase has no dependency on any other 028 phase and ships first per the master plan |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the breadcrumb change produces unreadable/overly long result lines in practice, or the min-rows floor causes a real query to exceed the context budget it feeds into downstream.
- **Procedure**: the three fixes (P1 breadcrumb, P2 floor/budget/limit, P3 field-shape/doc) are structurally independent — revert the `search_presentation.txt`/`search.md` template edits (both copies) and the `memory-context.ts` floor/threading/field-shape changes independently, without needing to touch the others.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
