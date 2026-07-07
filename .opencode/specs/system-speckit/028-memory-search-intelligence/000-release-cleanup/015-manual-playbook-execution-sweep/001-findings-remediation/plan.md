---
title: "Implementation Plan: Manual Playbook Sweep Findings Remediation [template:level_2/plan.md]"
description: "Per-finding root-cause hypotheses and proposed fixes, grouped by theme, updated dynamically as new FAILs are confirmed."
trigger_phrases:
  - "playbook sweep findings remediation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/000-release-cleanup/015-manual-playbook-execution-sweep/001-findings-remediation"
    last_updated_at: "2026-07-06T19:16:27.470Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Grouped per-finding fix plans by shared root-cause theme"
    next_safe_action: "Re-verify each root-cause hypothesis against real code before fixing"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-06-plan-001-findings-remediation"
      parent_session_id: null
    completion_pct: 98
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Manual Playbook Sweep Findings Remediation

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript / Node.js MCP servers, Python skill-advisor |
| **Framework** | Spec Kit memory, code-graph and skill-advisor subsystems |
| **Storage** | SQLite memory and eval databases |
| **Testing** | Vitest suites, git-diff and git-stash baselines, live re-runs |

### Overview

For each FAIL scenario, this plan states: the observed symptom (from the scenario's own Evidence/VERDICT text), a root-cause hypothesis, the files most likely responsible (per the scenario's own Failure Triage pointers where present), and a proposed fix direction. Entries are grouped by theme where a shared root cause is plausible. **No fix has been implemented yet** — this is planning only, per REQ scope. Each hypothesis must be re-verified against real code before any change lands (a dispatch's self-reported root cause is a hypothesis, not a fact).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Every confirmed FAIL scenario has a plan entry with a root-cause hypothesis.
- [ ] Findings with thin evidence are flagged for re-verification before a fix is proposed.

### Definition of Done
- [ ] Each proposed fix's root cause is re-verified against real code before the change lands.
- [ ] Each fixed scenario is re-run and its affected Vitest suite stays green.
- [ ] Strict validation exits 0 for this child phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evidence-first remediation planning: symptom, root-cause hypothesis, affected files and proposed fix per finding, with shared root causes grouped into one fix entry.

### Key Components
- **Feature-flag propagation**: kill-switches and default-on flags that must apply at request time.
- **Read-only index paths**: deferred indexing that must not mutate existing rows.
- **Scoring/fusion pipeline**: Stage-2 score synchronization, channel min-representation and truncation metadata.
- **Individual subsystem findings**: BM25 gate, bounded-graph trace, trigger cache and context routing.

### Data Flow
Each 031 sweep FAIL feeds one plan entry; entries sharing a root cause fold into a single grouped fix that the implementation phase re-verifies against real code before touching it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Group A: Feature-flag / kill-switch propagation bugs

FIVE findings now show the same shape: a boolean env flag doesn't actually control its feature's effect, despite unit tests passing. This is a strong signal there may be ONE shared root cause (e.g. a common flag-reading utility that's broken, or a caching layer that ignores flag state) rather than 5 independent bugs -- worth checking for a shared pattern before fixing each individually. Members: REQ-110 (SPECKIT_GRAPH_UNIFIED), REQ-113 (SPECKIT_MEMORY_ADAPTIVE_RANKING), REQ-200 (ENABLE_BM25), REQ-211 (SPECKIT_CAUSAL_BOOST / isCausalBoostEnabled), REQ-212 (SPECKIT_COMMUNITY_SEARCH_FALLBACK), REQ-214 (isContextHeadersEnabled / contextual tree injection) -- SIX findings now, strong signal of a shared root cause worth investigating as ONE fix before touching each site individually.

#### REQ-110 — `SPECKIT_GRAPH_UNIFIED=false` doesn't disable graph signals
- **Symptom**: `meta.cacheHit: true`, `killSwitchActive:false`, `graphSignalsApplied:true`, `selectedChannels` still includes `graph`/`degree` even with the flag off.
- **Root-cause hypothesis**: Stage 2 of the unified retrieval pipeline reads a cached result computed while the flag was on, or checks the flag at the wrong stage boundary (a caching/staleness issue, not a missing flag-check).
- **Affected files**: graph contribution trace metadata path (`graphContribution` in the unified retrieval Stage 2 code), CTE/query-plan construction for graph channels.
- **Proposed fix**: Ensure the flag is re-checked (not just cached) at Stage 2 entry; invalidate `cacheHit` when the flag state differs from the cached computation's flag state.

#### REQ-113 — `SPECKIT_MEMORY_ADAPTIVE_RANKING=true` doesn't emit `adaptiveShadow` proposal
- **Symptom**: Flag-on run produces no `adaptiveShadow` proposal payload; flag-off run also produces no proposal output (expected — but flag-on should differ from flag-off and doesn't).
- **Root-cause hypothesis**: The proposal-emission code path is gated on a second condition beyond the flag (e.g. a minimum access/validation signal count) that isn't being met in the test scenario, OR the emission path was never wired to this flag.
- **Affected files**: Adaptive-ranking proposal emission logic; bounded delta cap check.
- **Proposed fix**: Verify adaptive signals are actually being recorded from access/validation events first (per the scenario's own triage); if they are, trace why the bounded delta cap or emission gate suppresses output.

### Group B: "Read-only" paths that mutate data

#### REQ-156 — `indexMemoryDeferred` "read-only" same-path update mutates `encoding_intent`
- **Symptom**: Correct intent labels assigned/persisted for document/code/structured examples, but a same-path update changed row `id: 2`'s `encoding_intent` from `"code"` to `"document"` — this path is documented/expected to be read-only for existing rows.
- **Root-cause hypothesis**: The deferred indexing path recomputes `encoding_intent` on every pass (including for already-indexed rows) instead of only computing it once at first-index time, and the recompute uses a different/updated classification heuristic than the original.
- **Affected files**: Intent classification rules, metadata persistence in the deferred-indexing write path.
- **Proposed fix**: Gate the `encoding_intent` write behind an "is this a first-time index" check, or make the deferred path explicitly skip re-classification of fields that already have a value (true read-only-on-existing-rows semantics).

### Group C: Scoring / fusion pipeline gaps

Three findings all touch the Stage-2 scoring/fusion pipeline; worth investigating as one connected root cause before assuming three separate bugs.

#### REQ-129 — Stage-2 score sync missing for non-hybrid path
- **Symptom**: `searchType: "hybrid"`, `isHybrid: true`, `intentWeightsApplied: "off"`, no Step 4 `intentAdjustedScore`, no trace-level Math.max sync progression — for a request expected to take the non-hybrid path.
- **Root-cause hypothesis**: The request is being routed into the hybrid path even when non-hybrid was expected/requested, OR the non-hybrid path exists but never runs the Math.max score-sync step that the hybrid path does.
- **Affected files**: Stage-2 intent weighting logic, `resolveEffectiveScore` fallback chain.
- **Proposed fix**: First confirm routing (is this scenario actually reaching non-hybrid code, or mis-routed into hybrid?) — the fix branches depending on that answer.

#### REQ-133 — Channel min-representation ignores `QUALITY_FLOOR=0.005`
- **Symptom**: Top-k representation logic present, but channels scoring `0.004`/`0.001` (below the `0.005` floor) still receive representative slots/promotions.
- **Root-cause hypothesis**: The quality-floor check is applied before min-representation guarantees are computed, so min-representation's "ensure every channel gets ≥1 slot" logic overrides the floor instead of being bounded by it.
- **Affected files**: Channel min-representation algorithm, quality-floor threshold check ordering.
- **Proposed fix**: Apply the quality floor as a hard filter before min-representation selection, not after (or make min-representation floor-aware).

#### REQ-134 — `confidenceTruncation` metadata missing from real traces
- **Symptom**: Synthetic long-tail test passes (cliff detection + documented tests), but a real long-tail query's trace doesn't expose `thresholdMultiplier`/`medianGap`/`cutoffGap`/`minResultsGuaranteed`.
- **Root-cause hypothesis**: The metadata is computed but only attached to the trace object in the synthetic-test code path, not in the real query execution path (a wiring gap between test harness and production trace assembly).
- **Affected files**: Cliff-detection algorithm's trace-metadata emission.
- **Proposed fix**: Confirm the metadata computation itself runs on real queries (add a log/assert), then trace why it isn't reaching the trace object that ships to callers.

### Group D: Individual findings (no shared theme identified yet)

#### REQ-003 — BM25 re-index gate
- **Symptom**: Gate doesn't reliably detect trigger mutations vs FTS5-only lexical updates.
- **Fix direction**: Inspect `syncChangedRows()`; ensure BM25 enablement state is checked separately from generic FTS5 sync evidence.

#### REQ-004 — Bounded graph walk trace fields missing
- **Fix direction**: `mcp_server/formatters/search-results.ts`, `mcp_server/lib/search/hybrid-search.ts` — confirm bounded-graph fields are populated in the trace envelope; cross-check against `search-results-format.vitest.ts`.

#### REQ-015 — Trigger-phrase matching cache/reload issue
- **Fix direction**: Verify `idx_trigger_cache_source` index exists; confirm reload query filters to successful rows with non-empty trigger phrases.

#### REQ-016 — `memory_context` specFolder/intent mismatch
- **Fix direction**: Check intent resolution when specFolder is provided without explicit intent.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Root-cause re-verification | Each finding before its fix | Direct code read, git blame |
| Targeted regression | Each fixed scenario's own suite | Vitest |
| Baseline comparison | Pre-existing failures vs new | git-stash baselines |
| Scenario re-run | The finding's own playbook file | Manual playbook re-run |
| Spec validation | Child phase docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 031 manual sweep manifest | Internal | Green | Findings list stays incomplete |
| Subsystem source trees | Internal | Green | Cannot re-verify root causes |
| Vitest suites | Internal | Green | Cannot confirm fixes without regressions |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fix targets the wrong root cause or introduces a regression.
- **Procedure**: Revert the specific fix commit via git and re-run the affected suite and scenario.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Reason |
|-------|------------|--------|
| 001 | `../spec.md` | Parent sweep owns finding discovery and ordering |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| Per-finding planning | Small | One entry per confirmed FAIL |
| Fix implementation | Large | Multi-session, dispatched and verified |
| Verification | Medium | Targeted suites plus scenario re-runs |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- Keep each fix as an isolated commit so a single revert removes it cleanly.
- Re-run the affected subsystem suite after any revert.
- Re-run `validate.sh --strict` after rollback.
<!-- /ANCHOR:enhanced-rollback -->
