---
title: "Feature Specification: Memory-Index Scan-Path Same-Path Dedup Gap"
description: "Investigated a suspected memory-index duplicate-row bug through two hypotheses (a same-path insert conflation, then a cross-process TOCTOU race), refuted both against real evidence, and landed the regression test the investigation produced. No confirmed code defect; no fix shipped."
trigger_phrases:
  - "memory scan dedup gap"
  - "same-path duplicate row"
  - "scan-path indexing investigation"
  - "deprecated tier duplicate row"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-memory-scan-dedup-gap"
    last_updated_at: "2026-08-07T19:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Investigation closed, no confirmed defect, test landed"
    next_safe_action: "None — packet closed. Reopen only if a fresh duplicate-row pair is found for a different file"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/tests/memory-save-supersede-reindex.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-system-speckit-033-memory-scan-dedup-gap"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Was the one concrete reproduction pair a genuine edit-then-revert, or something else? Not proven, only the most parsimonious explanation given the memory_history timestamps."
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
| **Status** | Complete — investigated, no confirmed defect, no fix warranted; regression test landed |
| **Created** | 2026-08-07 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

**Revised twice after real evidence. Both prior hypotheses in this section are kept struck through for the record, not as the live diagnosis. Current conclusion: this is very likely NOT a code bug.**

~~`memory-save.ts`'s same-path insert logic (~line 2696-2731) conflates "no prior row exists" with "a prior row exists but its content is unchanged" into the same plain-INSERT branch.~~ A controlled test reproducing this exact scenario (index a file, mark its row `deprecated`, re-index unchanged content via the real `index_memory_file_from_scan` entry point) **passed against current `HEAD`** — the single-threaded logic is correct. `checkExistingRow` (`handlers/save/dedup.ts`), an earlier gate at `memory-save.ts:2394` missed on the first pass, already finds the deprecated predecessor and returns an `'unchanged'` no-op before the originally-targeted branch is ever reached.

~~The duplicate is a cross-process TOCTOU race: `checkExistingRow` runs outside any `BEGIN IMMEDIATE` transaction, so two concurrent indexing passes could both read stale state.~~ Checked `memory_history` for the reproduction pair (`specs/cli-external-orchestration/029-cli-devin-revival/001-devin-contract-pin/implementation-summary.md`, ids 11274/11394) and found the actual event log: row 11274 has an `ADD` at `05:46:36`, then an `UPDATE` at `05:53:43` — the **exact same timestamp** row 11394's `ADD` event carries. A same-timestamp UPDATE-on-predecessor plus ADD-of-successor is precisely the signature of `retirePredecessorForActiveReindex` firing — the already-tested-and-correct "content genuinely changed" branch (proven by this file's first test in this suite, written well before this investigation). The most parsimonious explanation: the file's on-disk content actually differed between the two scans (a real edit), triggering a legitimate retire+insert, and was later edited back to byte-identical content — coincidentally producing two rows with matching `content_hash` today that look like a duplicate but are actually correct historical lineage from a genuine, if since-reverted, change.

This does not prove the negative (a real gap could still exist and simply not be what produced this specific pair), but every mechanism traced so far — the exemption, the same-path branch, `checkExistingRow`, and now the audit trail on the one concrete reproduction available — turned out to be either working as designed or insufficient evidence of a defect. Continuing to chase this without a second concrete reproduction is guessing, not investigating.

### Purpose

Close this packet's investigation honestly: land the regression test the T004 work already produced (a genuine, previously-missing coverage gap for "unchanged re-scan against a tier-exempted predecessor," which now correctly passes), and do not ship a fix for a mechanism no confirmed evidence says is broken.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Land the T004 regression test as real, permanent coverage: it fills a genuine, previously-missing gap ("unchanged re-scan against a tier-exempted predecessor") and currently passes — keep it regardless of the fix question.
- Document the full investigation chain honestly in this packet, including both refuted hypotheses, so a future session with a fresh concrete reproduction doesn't have to re-derive this.

### Out of Scope

- Any code fix to `memory-save.ts` — no confirmed defect. Both hypotheses that would have justified a fix (the same-path branch conflation, the cross-process TOCTOU race) were checked against real evidence and did not hold up; the one concrete reproduction available has an audit-trail signature matching correct, already-tested behavior.
- Cleaning up already-accumulated duplicate-looking rows in the live index — even if some are genuine accumulation rather than edit-then-revert lineage, this is a data question, not a code defect; would need its own evidence-gathering, not a blind cleanup.
- `idx_memory_logical_key_active_unique`'s tier exemption itself — confirmed correct and intentional (lets a retired predecessor coexist with its live successor); not touched.
- `checkContentHashDedup`'s same-path exclusion — confirmed correct and intentional (defers same-path handling downstream by design); not touched.
- The closed `028-memory-search-intelligence/002-speckit-memory` 13-phase remediation program — Complete; not reopened, not touched.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp-server/tests/memory-save-supersede-reindex.vitest.ts` | Modify (already done) | Added a regression test for the unchanged-content-against-deprecated-predecessor case; passes against current `HEAD` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A controlled repro of the originally-hypothesized conflation is written and run against current `HEAD` before any fix is considered | Done — the test in `memory-save-supersede-reindex.vitest.ts` passed, refuting the hypothesis |
| REQ-002 | No fix lands against an unconfirmed root cause | Done — investigation closed without a source change; both hypotheses documented as refuted with evidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The regression test added during investigation lands as permanent coverage, not thrown away | Test committed and passing in `memory-save-supersede-reindex.vitest.ts` |
| REQ-004 | The audit-trail evidence (memory_history timestamps) for the one concrete reproduction is documented, not just asserted | Cited directly in `spec.md`'s Problem Statement with the exact timestamps and event types |
| REQ-005 | Both refuted hypotheses are kept in the record (struck through), not deleted, so a future session doesn't re-derive the same dead ends from scratch | `spec.md`'s Problem Statement preserves both original hypotheses with strikethrough plus the evidence that refuted each |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The new regression test passes and is committed.
- **SC-002**: The investigation's full chain of evidence (three hypotheses, two refuted, one closing conclusion) is documented well enough that a future session with a fresh concrete reproduction doesn't repeat this work from zero.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The edit-then-revert explanation is plausible but not proven for certain — a real gap could still exist and simply not be what produced this specific reproduction pair | Low-Medium | Documented as an open question, not closed as definitively resolved; a fresh reproduction with a tighter time window (or direct instrumentation) would settle it for real |
| Dependency | None | — | Self-contained; no other open packet depends on this |
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

- Was `specs/cli-external-orchestration/029-cli-devin-revival/001-devin-contract-pin/implementation-summary.md` genuinely edited and reverted between 05:46:36 and 05:53:43 on 2026-08-07? The `memory_history` timestamps are consistent with this but don't prove it directly (no git history was cross-checked against those exact minutes). Would settle the remaining uncertainty in the Risks section if answered.
- If a future session finds a NEW, fresh duplicate-row pair (not this historical one), re-run T004's test methodology against it before assuming the same "edit-then-revert" explanation applies — this conclusion is specific to the one reproduction available, not a general proof.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
