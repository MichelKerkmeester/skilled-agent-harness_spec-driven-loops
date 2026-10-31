---
title: "Implementation Plan: Memory-Index Scan-Path Same-Path Dedup Gap"
description: "Confirm-first plan executed as designed: T004's red-before test came back green, refuting the hypothesis; a second hypothesis (a TOCTOU race) was also checked against audit-trail evidence and didn't hold up either. Closed without a source fix."
trigger_phrases:
  - "memory scan dedup gap plan"
  - "confirm-first investigation closed"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder/006-memory-scan-dedup-gap"
    last_updated_at: "2026-08-08T10:58:46Z"
    last_updated_by: "claude-code"
    recent_action: "Executed as planned; stop condition fired at Step 1"
    next_safe_action: "None — packet closed"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/tests/memory-save-supersede-reindex.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-system-speckit-033-memory-scan-dedup-gap"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Memory-Index Scan-Path Same-Path Dedup Gap

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (`handlers/memory-save.ts`) |
| **Framework** | `@spec-kit/mcp-server` |
| **Storage** | `context-index.sqlite` (`memory_index` table, `better-sqlite3`) |
| **Testing** | `vitest` (`memory-save-integration.vitest.ts`, `handler-memory-save.vitest.ts`) |

### Overview
The same-path insert branch in `memory-save.ts` (~line 2696-2731) has a two-way ternary where a three-way decision belongs: it only distinguishes "content changed" (retire + insert) from everything else (plain insert), silently treating "no prior row" and "prior row found but unchanged" as the same case. Add the missing third branch — existing row found, content unchanged, return it as a no-op — confirmed first with a red test against current `HEAD`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause confirmed to exact file:line via direct code read, not inference
- [x] Reproduced against live data (two rows, byte-identical `content_hash`, 7 minutes apart)
- [x] Confirmed `checkContentHashDedup`'s same-path exclusion and the unique index's tier exemption are both intentional, correct, and not the bug

### Definition of Done
- [x] T001's controlled repro was run against current `HEAD` — it did NOT go red, it passed. Per this plan's own designed stop condition (§4 Step 1), this refutes the hypothesis rather than confirming the gap
- [x] No no-op branch was added — nothing to fix once the hypothesis was refuted; a second hypothesis (TOCTOU race) was checked against `memory_history` audit-trail evidence and also didn't hold up
- [x] The pre-existing same-path outcome test (`'supersedes a changed doc...'`) still passes unmodified — no source change means no regression risk existed to begin with
- [x] `tsc --noEmit` not applicable — no source file was modified
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-function branch fix, confirmed by a red-before/green-after test — no architectural change, no new component.

### Key Components
- **`memory-save.ts`'s same-path branch**: computes `existing` (via `findSamePathExistingMemory`, no tier filter) and `samePathSupersededPredecessorId` (non-null only when content changed), then picks retire+insert vs plain insert. Gets a third outcome: `existing` found, `samePathSupersededPredecessorId` null → return existing as unchanged.
- **`IndexResult` type**: whatever shape the new no-op case returns must already exist in this union, or be added deliberately — not smuggled in as an unrelated status value.

### Data Flow
No change to how rows are read. On write: a same-path re-scan with unchanged content against a tier-exempted predecessor now returns early with the existing row's identity instead of reaching `createMemoryRecord`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `memory-save.ts` same-path branch (~2696-2731) | Decides retire+insert vs plain insert on same-path re-index | Update — add the no-op branch | Red-before/green-after test (T001/T003) |
| `checkContentHashDedup` (`handlers/save/dedup.ts`) | Cross-file content-hash dedup, deliberately excludes same-path | Not a consumer — confirmed correct, unchanged | Read confirmed the exclusion is intentional (comment + code match) |
| `idx_memory_logical_key_active_unique` (schema) | DB-level backstop for one active row per logical key | Not a consumer — confirmed correct, unchanged | Schema read confirmed the tier exemption is intentional (lets retired predecessors coexist with successors) |
| Every caller of the same-path branch's return value (`memory_index_scan` batch aggregation, `memory_save` MCP tool response) | Consumes the `IndexResult` this branch returns | Verify — the new no-op shape must be handled, not silently miscounted | Grep every `switch`/`if` on `IndexResult.status` for exhaustiveness after the change |

Required inventories:
- Same-class producers: `rg -n "samePathSupersededPredecessorId" .opencode/skills/system-spec-kit/mcp-server/handlers/` — confirm this is the only site with this exact conflation before declaring the fix complete.
- Consumers of changed symbols: `rg -n "createMemoryRecord\(|createAppendOnlyMemoryRecord\(" .opencode/skills/system-spec-kit/mcp-server --glob '*.ts'` — confirm no other caller relies on the old two-way behavior.
- Matrix axes: `existing` (none / found-unchanged / found-changed) × predecessor tier (active / deprecated-archived-constitutional) × origin (`scan` / `direct`) = up to 12 cells; only "found-unchanged × exempted-tier" is currently wrong, but all cells need a passing test to prove the fix didn't touch the others.
- Algorithm invariant: for any same-path re-index, exactly one active row must exist afterward with `content_hash` equal to the file's current computed hash — true before AND after this fix for every matrix cell except the one being corrected.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm (T001, red-before)

#### Step 1 — Reproduce against current HEAD with a controlled test, not just the historical row pair
Write a test that: indexes a file, marks its row `importance_tier = 'deprecated'` directly (simulating any prior retirement, not depending on how it got there), then re-indexes the same unchanged content via the same code path production uses (`fromScan: true`, matching the real scan trigger).
**Check**: the test fails on current `HEAD` — a second row is created. If it does NOT fail, the hypothesis is wrong and this plan stops here for re-diagnosis before touching any source.
**Rollback**: N/A — a test-only step, nothing to revert.

#### Step 2 — Confirm REQ-004: does the interactive `memory_save` path reach the same branch the same way?
Read (or write a second, interactive-path variant of the Step 1 test) to determine whether `memory_save` (not scan-triggered) can hit the same conflation. `indexingOrigin` only gates the earlier reconsolidation block — the same-path branch itself doesn't check origin at all — so the honest expectation going in is "yes, reachable both ways," but confirm rather than assert.
**Check**: documented finding, evidence attached (test result or code citation), either way.
**Rollback**: N/A — investigation only.

### Phase 2: Fix

#### Step 3 — Add the missing no-op branch
In the same-path block, change the two-way decision to three-way: `existing == null` → insert (unchanged); `existing != null && content changed` → retire + insert (unchanged); `existing != null && content unchanged` → return existing as a no-op (new). Match `checkContentHashDedup`'s existing `{status: 'duplicate', id, ...}` result shape as the template for the new branch's return value, so downstream callers that already handle that status don't need their own new case.
**Check**: Step 1's test goes green. `tsc --noEmit` on the `mcp-server` package shows 0 new errors.
**Rollback**: `git checkout -- <path>` before commit; `git revert` after.

### Phase 3: Verify the untouched cells

#### Step 4 — Confirm the three pre-existing outcomes are unchanged
Run the existing `memory-save-integration.vitest.ts`/`handler-memory-save.vitest.ts` suites. If any test specifically covers "same-path, content changed, active-tier predecessor" or "same-path, unchanged, active-tier predecessor," confirm both still pass with the same assertions — not just a green run, read the actual assertions to confirm they weren't loosened.
**Check**: 0 new test failures; the specific same-path tests (if they exist) pass with unchanged assertions.
**Rollback**: `git checkout -- <path>` before commit; `git revert` after.

#### Step 5 — Downstream consumer check
Grep every consumer of this function's `IndexResult` return value (`memory_index_scan`'s batch-result aggregation, `memory_save`'s MCP response formatting) for a `status`-based switch. Confirm the new no-op status is either already handled by an existing case or gets an explicit new one — not silently falling into a catch-all that miscounts it as a failure or a fresh index.
**Check**: every consumer site inventoried in the FIX ADDENDUM above is confirmed handled, with the grep output cited as evidence.
**Rollback**: N/A — this is a verification step, not a mutating one.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Red-before/green-after | The exact conflation, controlled repro | `vitest` |
| Regression | The three pre-existing same-path outcomes | `vitest` (existing suites) |
| Type check | `mcp-server` package | `tsc --noEmit` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | — | — | Self-contained; the closed 028 program is prior art, not a blocking dependency |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Step 4's regression check finds any of the three pre-existing outcomes changed behavior, or Step 5 finds an unhandled downstream consumer.
- **Procedure**: `git checkout -- <path>` before commit; `git revert <sha>` after. No data migration involved — this is an insert-time code fix, not a schema or corpus change, so rollback is a plain code revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Step 1 (repro) ──► Step 2 (origin check) ──► Step 3 (fix) ──► Step 4 (regression) ──► Step 5 (consumers)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Confirm (1-2) | None | Fix |
| Fix (3) | Confirm | Verify |
| Verify (4-5) | Fix | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Confirm | Low | 30-60 min |
| Fix | Low | 30-60 min |
| Verify | Low-Med | 30-60 min |
| **Total** | | **1.5-3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Red-before test committed alongside the fix, not left uncommitted
- [ ] `mcp-server/dist` rebuilt so any standalone CLI reindex picks up the fix

### Rollback Procedure
1. `git revert <fix-sha>`
2. Rebuild `mcp-server/dist`
3. Re-run the red-before test to confirm it fails again (proving the revert actually removed the fix, not just the test)

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
