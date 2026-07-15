---
title: "Feature Specification: Presentation-Layer Quick Wins: Breadcrumbs, Result Floor, Field-Shape Parity"
description: "Three independent presentation/formatting-layer defects in memory_context and /memory:search: a deliberate leaf-only folder-name rule suppresses the specFolder breadcrumb (P1), enforceTokenBudget has no minimum-rows floor and a dead tokenBudget override collapses deep-mode results toward ~3 (P2), and compactDirectResult/minimalResults carry asymmetric field shapes plus an undocumented --command-form requirement (P3)."
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
    packet_pointer: "system-speckit/004-memory-search-intelligence/006-presentation-layer-fixes"
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
answered_questions:
  - "Minimum floor: 10, matching the existing memory_search DEFAULT_MIN_RESULTS behavior."
  - "tokenBudget design: wired as an optional caller override through schemas, handler args, and effective budget resolution."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Presentation-Layer Quick Wins: Breadcrumbs, Result Floor, Field-Shape Parity

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Implemented, with broad-suite caveat documented in implementation-summary.md |
| **Created** | 2026-07-09 |
| **Branch** | `system-speckit/004-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Handoff Criteria** | implementation landed; targeted tests/build/typecheck/dist freshness and strict packet validation recorded; broad `npm test` timed out with unrelated failures |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is a Track 2 (Presentation UX) phase of the memory-search-intelligence review remediation. It covers findings P1, P2, and P3 from the review digest and is text-only/small-logic, entirely inside the presentation/formatting layer — independent of the parallel Track 1 (data-quality / search-index) findings that other 028 phases cover.

**Scope Boundary**: `search_presentation.txt` and `search.md` folder-display and result-block rendering (both `.opencode/` and `.claude/` copies), `memory-context.ts`'s `enforceTokenBudget` truncation paths and `effectiveBudget` resolution, and the field shapes the truncation paths emit. No ranking, retrieval, embedding, or search-index changes.

**Dependencies**: None upstream. Per the master plan this phase has no dependency on any other phase and ships first; two empty sibling folders (`007-search-index-integrity-sweep`, `010-query-channel-calibration`) are reserved for separate, independent Track 1 findings from the same review round and are not a dependency of this phase.

**Deliverables**:
- Full `specFolder` breadcrumb rendered instead of the leaf-only folder name, in both `search_presentation.txt` copies and `search.md`'s inline templates.
- A minimum-rows floor in `enforceTokenBudget` so `memory_context` stops silently collapsing toward ~3 (or fewer) survivors.
- The dead `tokenBudget` resolution fixed so a caller override is either honored or explicitly not accepted, never silently discarded.
- `/memory:search`'s default retrieval call no longer combines `includeContent: true` with no `limit`.
- `compactDirectResult` / `minimalResults` / the dropped-results metadata mapper carry both `specFolder` and `filePath` (optional hardening).
- A doc note correcting the surface-parity claim for one-shot raw-text opencode dispatch (optional hardening).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

**P1 — breadcrumb suppression is a deliberate rule, not a data gap.** `specFolder` (the full nested path) flows intact through the DB, the formatter, and token-budget compaction — nothing strips it upstream. The suppression is a text rule in the presentation contract: `search_presentation.txt:121` ("Show only the leaf folder name unless two leaves collide.") and `:123` ("Render the leaf folder name or a short title for `<title>`, never the full folder path, so long paths do not force a `(truncated)` cut."). Both `.opencode/commands/memory/assets/search_presentation.txt` and `.claude/commands/memory/assets/search_presentation.txt` are byte-identical (332 lines each, confirmed via `diff`) and carry the identical rule at the identical lines. `search.md` inlines the same leaf-only placeholder in its result-block templates (`<leaf-folder>/`, `search.md:58-64` and `:107-108`-equivalent verdict-slot example). Nested-path context (which distinguishes similarly-named leaves under different parents) is lost at render time even though the data carries it.

**P2 — result count collapses toward ~3, with two compounding root causes, both already diagnosed.**
1. `enforceTokenBudget` (`memory-context.ts:623`) has no configurable minimum-rows floor. Its structured-result truncation path pops the lowest-scored row one at a time — `while (currentResults.length > 1 && currentTokens > budgetTokens) { currentResults.pop(); ... }` (`memory-context.ts:997`) — down to a hardcoded floor of 1. `compactDirectResult`'s parallel loop (`memory-context.ts:713`) does the same. `deep` mode's 3500-token budget (`memory-context.ts:1141`) is easily exhausted once full content is included, so real queries degrade toward a small handful of rows well before any explicit floor would trigger. This is the exact gap `memory_search`'s sibling `confidence-truncation.ts` already closes for its own truncation: `TruncationOptions.minResults` (`confidence-truncation.ts:31`) defaults to `DEFAULT_MIN_RESULTS = 10` (`:35`), and `truncateByConfidence` returns the result set unchanged whenever `validResults.length <= minResults` (`:130`) — `memory_context`'s `enforceTokenBudget` has no equivalent guard.
2. The budget that feeds `enforceTokenBudget` is resolved via a fallback that is dead for every concrete mode: `memory-context.ts:1949-1950` — `const modeTokenBudget = CONTEXT_MODES[effectiveMode]?.tokenBudget; const effectiveBudget = modeTokenBudget || tokenBudget;`. Every named mode (`quick`=800, `deep`=3500, `focused`=3000, `resume`=2000 — `memory-context.ts:1133/1141/1149/1157`) hardcodes its own `tokenBudget`, so `modeTokenBudget` always wins; the `auto` mode entry (`:1122-1126`) is the only one without a `tokenBudget` field, which is the sole case where the `tokenBudget` local (itself sourced from `layerDefs.getLayerInfo('memory_context')`, `:1774`, a server-side default — never from caller input) can matter. Separately, the `memory_context` MCP tool schema explicitly allows unknown parameters (`tool-schemas.ts:217`, `additionalProperties: ALLOW_UNKNOWN_PARAMETERS`) but declares no `tokenBudget` property, and `ContextArgs` (`memory-context.ts:124-142`) has no `tokenBudget` field either — a caller who supplies `tokenBudget` in the call is silently ignored end to end, not merely overridden by mode.
3. Compounding both: `/memory:search`'s default retrieval call (`search.md:46`) is `memory_context({ input: query, mode: "auto", intent, includeContent: true, enableDedup: true })` — `includeContent: true` with no `limit`, even though the tool schema's own default for `includeContent` is `false`. Larger per-row payloads exhaust the token budget faster, pushing the pop-loop harder.

**P3 — field-shape asymmetry and an undocumented surface gap, both minor.** The three row shapes `enforceTokenBudget` can emit disagree on which identifying fields survive: `compactDirectResult` (`memory-context.ts:693-701`) emits `{id, title, filePath, score, importanceTier, snippet}` — no `specFolder`. `minimalResults` (`:781-790`) and the dropped-results metadata-only mapper (`:1007-1016`) both emit `{id, title, similarity, specFolder, confidence, importanceTier, isConstitutional, metadataOnly}` — no `filePath`. Depending on which truncation path fires, a caller gets one identifying field or the other, never both. Separately, `search.md:74`'s surface-parity clause claims the rendered contract holds "regardless of how this command was reached — `--command` dispatch, a direct prompt, or natural conversation," but a one-shot opencode invocation using the raw natural-language form bypasses the router (and its mandated read of `search_presentation.txt` at `search.md:36`) entirely — the parity claim does not hold for that surface today, and nothing documents the caveat.

### Purpose
Fix all three defects entirely within the presentation/formatting layer: render the full breadcrumb, guarantee a minimum result count survives token-budget truncation and stop discarding a caller's budget override silently, and (as hardening) align the truncation-path field shapes and document the real `--command`-form requirement — with zero changes to ranking, retrieval, or the underlying data.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Edit the "Folder display rules" section (`search_presentation.txt:119-124`) in both `.opencode/` and `.claude/` copies to render a full `specFolder` breadcrumb group header instead of the leaf-only name.
- Update `search.md`'s inline result-block templates (the `<leaf-folder>/` placeholder in §3 RETRIEVAL MODE and the verdict-slot example) to match, in both `.opencode/` and `.claude/` copies.
- Add a minimum-rows floor to `enforceTokenBudget`'s two pop loops (`compactDirectResult` at `:713`, the structured-result path at `:997`), mirroring `confidence-truncation.ts`'s `minResults`/`DEFAULT_MIN_RESULTS` pattern.
- Fix the dead `tokenBudget` resolution (`:1949-1950`) per the Phase 1 design decision recorded in `plan.md` — either wire a real caller override through `ContextArgs` and the tool schema, or remove the misleading unreachable fallback and document `layerInfo`/mode budgets as the sole authority.
- Fix `/memory:search`'s default retrieval call (`search.md:46`): drop `includeContent: true` or add an explicit `limit`, in both `.opencode/` and `.claude/` copies.
- (P3, optional hardening) Align `compactDirectResult`, `minimalResults`, and the dropped-results metadata mapper so `specFolder` and `filePath` both survive every truncation path — additive field changes only.
- (P3, optional hardening) Add a doc note in `search.md` and/or `search_presentation.txt` correcting the surface-parity claim for one-shot raw-text opencode dispatch.

### Out of Scope
- Track 1 data-quality and search-index findings (F1-F14): JSON metadata drift, source-fingerprint staleness, index-to-deleted-file pointers, embedding/enrichment pipeline health, channel-skip calibration. These are separate 028 phases (including the reserved `007-search-index-integrity-sweep` and `010-query-channel-calibration` sibling folders).
- Any change to ranking, retrieval scoring, embedding, or the underlying SQLite schema.
- Any change to `truncateByConfidence`/`confidence-truncation.ts` itself — it is read-only reference for the floor pattern, not a target of this phase.
- Rebuilding or auditing sibling CLI shims beyond what `mcp_server`'s normal build picks up.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/memory/assets/search_presentation.txt` | Modify | Folder display rules (`:119-124`) — full breadcrumb instead of leaf-only |
| `.claude/commands/memory/assets/search_presentation.txt` | Modify | Mirror the same edit (currently byte-identical to the `.opencode/` copy) |
| `.opencode/commands/memory/search.md` | Modify | Inline result-block templates, default `memory_context` call (`:46`), surface-parity doc note |
| `.claude/commands/memory/search.md` | Modify | Mirror the same edits (currently byte-identical to the `.opencode/` copy) |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts` | Modify | `enforceTokenBudget` min-rows floor, `effectiveBudget` resolution fix, `compactDirectResult`/`minimalResults`/dropped-results field-shape parity |

### Phase R Addendum: Cross-Cutting MCP Public-Contract Parity (Audit Remediation)

`tasks.md`'s Phase R records eight tasks (T021-T028) from the 2026-07-09 10-slice parallel audit of the 028 wave. That audit assigned this packet ownership of cross-cutting MCP public-contract parity work — `memory_context`'s token-budget/envelope truncation contract plus the broader tool-schema/dispatch-parity surface — because no dedicated surface child in the 028 wave carries a `tasks.md` for that work. This extends the packet's scope boundary and files-to-change ledger beyond the P1/P2/P3 presentation-layer scope above:

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts` | Modify | T021: explicit `floorExceededBudget`/`droppedAllResultsReason` states replacing the silent budget-fit claim; T023: shared `toMetadataOnlyContextRow` mapper with `?? r.spec_folder` fallback; T028: `includeConstitutional` consistency fix |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modify | T022: `resolveEnvelopeTokenBudget()` (`:678`) so the outer envelope honors a handler-validated `memory_context` `tokenBudget` override instead of re-trimming it to the fixed per-tool budget |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Modify | T024: advertise `embedder_set.dryRun` in the public MCP schema to match the existing Zod/handler support |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Modify | T024: `dryRun` parity; T025: remove four dead `skill_graph_*` Zod registrations (migrated tools, no dispatcher); T028: `includeConstitutional` added to the public schema |
| `.opencode/skills/system-spec-kit/mcp_server/tools/types.ts` | Modify | T027: complete lagging dispatch-arg interfaces (`EmbedderSetArgs`, `SearchArgs`, `HealthArgs`, `SaveArgs`, `SessionResumeArgs`, `CheckpointCreateArgs`, `CausalStatsArgs`, `IngestStartArgs`) and add compile-time `Assert<HasExactSchemaKeys<...>>` parity assertions |
| `.opencode/skills/system-spec-kit/mcp_server/tests/mcp-tool-dispatch.vitest.ts` | Modify | T026: drive the real `dispatchTool` for all 41 `TOOL_DEFINITIONS` entries (was 24 of 41, never calling `dispatchTool`), asserting exactly one dispatcher owner per tool name |

Verified against the merged tree (commit `f9afa7a76c`, "fix(spec-kit): 028 Phase R audit remediation"): `floorExceededBudget`/`droppedAllResultsReason` exist in `memory-context.ts`; `resolveEnvelopeTokenBudget` exists in `context-server.ts:678`; `toMetadataOnlyContextRow` exists in `memory-context.ts:1166`; `tool-schemas.ts` advertises `dryRun` for `embedder_set`; `schemas/tool-input-schemas.ts` carries no remaining `skill_graph_*` registrations and lists `includeConstitutional` in its public key sets; `tools/types.ts` defines `Assert`/`HasExactSchemaKeys` and the eight named interfaces; `tests/mcp-tool-dispatch.vitest.ts` asserts `TOOL_DEFINITIONS` has length `41` and calls `dispatchTool(definition.name, ...)` for every entry.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The presentation contract SHALL render the full `specFolder` breadcrumb instead of the leaf-only folder name, in both `search_presentation.txt` copies and `search.md`'s inline templates. | A result whose `specFolder` is a multi-segment nested path renders the full path (or an equivalent breadcrumb group header) in the rendered block, not just the leaf segment; both `.opencode/` and `.claude/` copies stay byte-identical after the edit. |
| REQ-002 | `enforceTokenBudget` SHALL enforce a minimum-rows floor so truncation never collapses a multi-result response toward the current unintentional ~3-row (or fewer) outcome. | A synthetic over-budget input with N results (N greater than the floor) returns at least `floor` rows after truncation; a Vitest unit test proves the floor holds for both the `compactDirectResult` and structured-result pop loops. |
| REQ-003 | `/memory:search`'s default retrieval call SHALL NOT combine `includeContent: true` with an unbounded `limit`. | `search.md:46`'s default `memory_context` call either omits `includeContent: true` or carries an explicit `limit`; both `.opencode/` and `.claude/` copies match. |
| REQ-004 | The `effectiveBudget` resolution (`memory-context.ts:1949-1950`) SHALL NOT silently discard a caller-supplied token-budget override; the resolution path is either wired to honor a real override or the dead fallback is removed and the authoritative source is documented. | Per the Phase 1 design decision: either a caller-supplied override reaches `enforceTokenBudget` (proven by a unit test), or the code and tool-schema description no longer imply an override is accepted when none is honored. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `compactDirectResult`, `minimalResults`, and the dropped-results metadata-only mapper SHOULD emit a consistent field shape carrying both `specFolder` and `filePath`. | All three row shapes in `memory-context.ts` (`:693-701`, `:781-790`, `:1007-1016`) carry both fields after the change; existing fields are not removed (additive only). |
| REQ-006 | The `/memory:search` presentation contract SHOULD document that raw natural-language one-shot opencode dispatch does not guarantee the presentation contract applies, correcting the current unconditional surface-parity claim. | `search.md` and/or `search_presentation.txt` states the `--command`-form requirement explicitly, with the surface-parity clause (`search.md:74`) no longer implying unconditional parity for the raw-text one-shot surface. |

### Acceptance Criteria (Given/When/Then)

- **Given** a `memory_context` `deep`-mode query whose results include multiple spec folders sharing a leaf folder name, **When** the response is rendered through the presentation contract, **Then** each result's breadcrumb disambiguates the folders by their full `specFolder` path, not just the leaf name (REQ-001).
- **Given** a content-heavy `deep`-mode query that would have collapsed to 1-3 survivors under the current unfloored pop loop, **When** `enforceTokenBudget` truncates the response, **Then** the returned row count is at least the configured floor, with lower-priority rows demoted to metadata-only entries rather than dropped entirely where the pop loop already supports it (REQ-002).
- **Given** the `/memory:search` router's default retrieval call, **When** it invokes `memory_context`, **Then** the call no longer pairs `includeContent: true` with an unbounded `limit` (REQ-003).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A representative multi-result query rendered through `/memory:search` (or a direct `memory_context` call) shows each result's full `specFolder` breadcrumb in both `.opencode/` and `.claude/` dispatch surfaces.
- **SC-002**: A query whose `enforceTokenBudget` truncation path fires returns at least the configured floor of rows instead of collapsing toward ~3 (or fewer) survivors, verified against both a synthetic reproduction and a real corpus query.
- **SC-003**: `memory-context.ts`'s `effectiveBudget` resolution no longer silently discards a caller-supplied `tokenBudget` value — the resolution path is exercised by a unit test proving the Phase 1 design decision is actually implemented, not just described.
- **SC-004**: The `/memory:search` router's default retrieval call no longer combines `includeContent: true` with an unbounded `limit`; both `.opencode/` and `.claude/` copies of `search.md` match.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A hardcoded minimum-rows floor could push a floored response over its token budget on content-heavy queries. | Med | `enforceTokenBudget` already truncates each row's `content` field to `MAX_CONTENT_CHARS = 500` before any row is popped (`memory-context.ts:984-990`); the floor is bounded and per-row size is already capped, so the worst case is well-understood before implementation. |
| Risk | `.opencode/` and `.claude/` copies of `search_presentation.txt` and `search.md` are dual-maintained and already byte-identical; an edit to only one copy silently reintroduces drift. | Med | Both copies are edited in the same change; a diff-byte-identity check is a named task in `tasks.md` and a verification step in `plan.md`. |
| Risk | The P3 field-shape unification could break a downstream consumer relying on the current narrower shape. | Low | Additive-only field changes — no existing field name is removed or renamed. |
| Dependency | `mcp_server`'s dist-freshness build gate: `memory-context.ts` changes require `npm run build` in `mcp_server` before the compiled handler reflects them. | Low | Named as a task in `tasks.md`; not a blocker, just an ordering step before verification. |
| Dependency | None on any other 028 phase. | — | This phase ships first per the master plan; the two empty reserved sibling folders (`007`, `010`) belong to independent Track 1 findings. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What concrete minimum-rows floor should `enforceTokenBudget` enforce? The digest cites the observed ~3-row symptom as the current unintentional outcome, not a target number. `plan.md` records a concrete default and its rationale before Phase 2 starts.
- Should the caller-supplied `tokenBudget` become a documented, wired MCP tool-schema field (added to `tool-schemas.ts` and `ContextArgs`), or should the dead fallback simply be removed and `layerInfo`/per-mode budgets declared the sole authority? `plan.md` records the decision before Phase 2 starts.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
