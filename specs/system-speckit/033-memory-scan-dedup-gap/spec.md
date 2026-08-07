---
title: "Feature Specification: Memory-Index Scan-Path Same-Path Dedup Gap"
description: "A missing branch in memory-save.ts's same-path insert logic conflates 'no existing row' with 'existing row found, content unchanged,' so an unchanged re-scan of a file whose only prior row is tier-exempted (deprecated/archived) creates a fresh duplicate row instead of a no-op."
trigger_phrases:
  - "memory scan dedup gap"
  - "same-path duplicate row"
  - "scan-path indexing bug"
  - "deprecated tier duplicate row"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-memory-scan-dedup-gap"
    last_updated_at: "2026-08-07T19:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Root-caused via direct code read to an exact file:line; scoped, not yet fixed"
    next_safe_action: "Execute plan.md's confirm-then-fix sequence"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-system-speckit-033-memory-scan-dedup-gap"
      parent_session_id: null
    completion_pct: 15
    open_questions:
      - "Does the same conflation exist on the interactive memory_save path, or only reached in practice via scan (since interactive saves rarely target an already-deprecated predecessor)?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Memory-Index Scan-Path Same-Path Dedup Gap

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft — root-caused, not yet fixed |
| **Created** | 2026-08-07 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`memory-save.ts`'s same-path insert logic (~line 2696-2731) computes `samePathSupersededPredecessorId` as `existing && !hashesMatch(...) ? existing.id : null` — set only when a prior row exists AND its content differs. The very next block then branches purely on that value: `samePathSupersededPredecessorId != null ? createAppendOnlyMemoryRecord(...) : createMemoryRecord(...)`. This conflates two genuinely different cases into the same `createMemoryRecord` (plain INSERT) branch: "no prior row exists at all" and "a prior row exists but its content is unchanged" (`hashesMatch` returned true). Both should not behave the same way — the first is a legitimate new file; the second should be a no-op that returns the existing row.

For most rows this stays invisible: `idx_memory_logical_key_active_unique` (the partial unique index enforcing one active row per logical key) throws on the second INSERT and something downstream presumably catches or avoids it. But that index's `WHERE` clause explicitly excludes rows with `importance_tier IN ('constitutional', 'deprecated', 'archived')` — a correct, intentional exemption so a retired predecessor can coexist with its live successor. When the ONLY prior row for a given path happens to already be in one of those exempted tiers (for any reason — a prior retirement, a manual reclassification), the plain INSERT hits no constraint at all and silently succeeds, minting a genuine duplicate: two rows, same path, same byte-identical content, one deprecated and one live.

Reproduced directly: `specs/cli-external-orchestration/029-cli-devin-revival/001-devin-contract-pin/implementation-summary.md` has two rows (ids 11274 and 11394), created 7 minutes apart, with byte-identical `content_hash` — confirming this isn't a content-drift edge case, it's the exact conflation described above.

`checkContentHashDedup` (the earlier, cheaper dedup check that runs before this) cannot catch this either: it deliberately excludes same-path rows from its lookup (`file_path != ?` / `canonical_file_path != ?`) by design, correctly deferring same-path handling to the logic downstream — the logic that has this gap.

### Purpose

An unchanged re-scan of a file whose only prior row is `deprecated`/`archived`/`constitutional` returns a no-op referencing the existing row, the same way it already does for active-tier rows, instead of minting a new duplicate.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `memory-save.ts`'s same-path branch (~line 2696-2731): add a third outcome — `existing` found AND content unchanged (`samePathSupersededPredecessorId == null` but `existing != null`) returns the existing row as a no-op, distinct from `existing == null` (genuinely new, insert) and `existing` found with changed content (retire + insert, unchanged today).
- T001 confirmation of whether the same conflation is reachable via the interactive `memory_save` MCP path, not just scan-triggered indexing (both call the same function; they differ in `indexingOrigin`, which only gates the earlier reconsolidation block, not this same-path branch).
- A verification pass covering all three same-path outcomes: new file (insert), changed content (retire+insert, must stay unchanged), unchanged content against an active-tier predecessor (must stay a no-op, must not regress), unchanged content against a deprecated/archived/constitutional predecessor (the fix — must become a no-op instead of a duplicate insert).

### Out of Scope

- Cleaning up already-accumulated duplicate rows in the live index — a data migration, not a code fix; can follow this packet as a separate, explicitly-scoped cleanup once the insert-time gap is closed (no point draining a bucket that's still leaking).
- `idx_memory_logical_key_active_unique`'s tier exemption itself — confirmed correct and intentional (lets a retired predecessor coexist with its live successor); not the bug, not touched.
- `checkContentHashDedup`'s same-path exclusion — confirmed correct and intentional (defers same-path handling downstream by design); not touched.
- The closed `028-memory-search-intelligence/002-speckit-memory` 13-phase remediation program — Complete, fixed the interactive save path's reconsolidation/PE-gate lanes specifically; this packet's finding is a distinct gap in a branch that program's fixes don't reach (confirmed: `indexingOrigin !== 'scan'` only gates reconsolidation, several hundred lines above the branch this packet targets).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts` | Modify | Add the missing "existing, unchanged" no-op branch around line 2707-2731 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | T001 confirms the exact reproduction against current code (not just the historical row pair) before any fix lands | A fresh, controlled repro (index a file, retire its row to a tier-exempted state, re-scan unchanged) produces a second row on current `HEAD`, confirmed via a failing test written before the fix |
| REQ-002 | An unchanged re-scan of a file whose only prior row is tier-exempted (`deprecated`/`archived`/`constitutional`) returns a no-op referencing the existing row, not a new row | The red-before test from REQ-001 goes green; `memory_index` row count for that path stays at 1 after the re-scan |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The three existing same-path outcomes (new file, changed content, unchanged content against an active-tier predecessor) are unchanged by the fix | Existing tests covering these paths in `memory-save-integration.vitest.ts`/`handler-memory-save.vitest.ts` pass unmodified, or are updated only if their assertions were already wrong |
| REQ-004 | T001 determines whether the interactive `memory_save` MCP path can reach the same gap, and the fix (or its verification) covers whichever paths are actually reachable | Documented finding either way, with evidence (not asserted without a check) |
| REQ-005 | Every downstream consumer of the new no-op result shape is inventoried and confirmed to handle it, so it isn't silently miscounted as a failure or a fresh index by `memory_index_scan`'s batch aggregation or `memory_save`'s response formatting | `plan.md` §4 Step 5's consumer grep is run and its findings are cited, not assumed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Re-scanning a file whose only prior row is tier-exempted, with unchanged content, produces zero new rows.
- **SC-002**: All three pre-existing same-path behaviors (new/changed/unchanged-active) are unchanged, proven by the existing test suite passing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The "no-op" branch returns a shape downstream callers don't expect (e.g. `IndexResult` variants used by `memory_index_scan`'s result aggregation) | Medium — could surface as a scan-summary miscount rather than a crash | Match `checkContentHashDedup`'s existing `{status: 'duplicate', ...}` shape as the template; check every caller of this function for a `status` switch that needs the new case |
| Risk | T001 finds the interactive path can also reach this gap, widening the fix's blast radius into code the closed 028 program already touched | Low-Medium | If confirmed, treat as new evidence for that closed program rather than reopening it — coordinate via a cross-reference, not a silent edit to its files |
| Dependency | None | — | Self-contained; no other open packet depends on this landing first |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The fix must not change behavior for any row whose predecessor is in an active (non-exempted) tier — those already correctly no-op or retire+insert today.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A predecessor row with `content_hash IS NULL` (never successfully hashed): `hashesMatch` behavior against a null stored hash needs an explicit check — likely already falls through to "changed," which is the safe default (retire+insert, not silently no-op on unknown state).
- A predecessor row that is itself a chunk (`parent_id IS NOT NULL`): `findSamePathExistingMemory` already filters `parent_id IS NULL`, so chunk rows are out of this function's consideration entirely — confirm the new no-op branch doesn't need chunk-aware handling.

### Error Scenarios
- The no-op branch fires but the caller (`memory_index_scan`'s batch loop) doesn't have a code path for it: verify `IndexResult`'s type union already includes a shape this can return, or add one deliberately rather than reusing an unrelated status value.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | 1 file, ~10-20 LOC changed, 1 system (mcp-server save/index path) |
| Risk | 8/25 | No auth/API surface; breaking-change risk is narrow (result shape for one new case) |
| Research | 4/20 | Root cause already confirmed to file:line; T001 is a controlled-repro confirmation, not open-ended investigation |
| **Total** | **18/70** | **Level 2** (verification-weighted given this touches a live shared production index) |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Does the interactive `memory_save` MCP path ever realistically hit this same branch with an already-tier-exempted predecessor (an agent explicitly re-saving a doc it doesn't know is deprecated), or is this practically scan-only? T001 answers this with evidence.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
