---
title: "Feature Specification: A9 Read-Time Content-Hash Integrity Verification [template:level_2/spec.md]"
description: "Stored content_hash is a write-time cache and idempotency key that is never re-checked on read, so silent DB or migration corruption surfaces as bad recall instead of a detectable fault. This phase recomputes the hash on read to catch that drift inside the existing trust boundary."
trigger_phrases:
  - "content hash integrity"
  - "read time hash verify"
  - "storage drift guard"
  - "verify_integrity content hash"
  - "silent corruption detection"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/009-a9-content-hash-integrity"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the A9 read-time content-hash integrity build spec from the research verdict"
    next_safe_action: "Plan the verify_integrity hash-recompute extension if the operator approves a build"
    blockers: []
    key_files:
      - "../research/research.md"
      - "../../../../../skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts"
      - "../../../../../skills/system-spec-kit/mcp_server/lib/content-id.ts"
    session_dedup:
      fingerprint: "sha256:9a0c3f7e2d8b1465a7e0c93f5b62d418a0f7c9e1d4b83627a5f0c81e3d6492bf"
      session_id: "phase-spec-009-a9-content-hash-integrity"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether the read-time recompute runs on every read or only inside the on-demand integrity sweep"
    answered_questions:
      - "Whether content_hash is recomputed on read today: it is not"
---
# Feature Specification: A9 Read-Time Content-Hash Integrity Verification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope and verification evidence.
- Remove placeholders, stale status and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-21 |
| **Branch** | `009-a9-content-hash-integrity` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `content_hash` column on `memory_index` is written once at save time and used only as an embedding-cache key and an idempotency receipt key. It is never recomputed against the stored body on read. The existing `verify_integrity` function at `lib/search/vector-index-queries.ts:1524` checks for orphaned vectors, missing vectors and orphaned files, but it never re-hashes a row body to confirm the body still matches its stored hash. A SHA-256 helper already exists at `lib/content-id.ts:14` (`hashContentBody`). So silent DB or migration corruption of a stored body surfaces as degraded recall with no fault signal, when the stored hash is exactly the witness that could catch it.

### Purpose
Recompute `content_hash` on read so silent storage or migration drift becomes a detectable integrity fault instead of invisible bad recall, staying inside the trust boundary the hash already occupies.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extend the existing `verify_integrity` summary at `lib/search/vector-index-queries.ts:1524` with a content-hash recompute check that re-hashes each row body via `hashContentBody` and compares it to the stored `content_hash`
- Report hash-mismatch rows as a new `contentHashMismatches` field on the integrity summary, never auto-mutating the row
- Gate the recompute behind a default-off flag so the existing integrity sweep keeps its current cost profile until the check is opted in
- Register the check as the storage-drift entry in the four standing drift guards named in `research/research.md` section 5

### Out of Scope
- Auto-repair or re-save of a mismatched row. This phase is detect-and-report only, the row body is an authored or saved artifact and a body fix is never a safe-class auto-fix
- Re-hashing inside the hot search path. The recompute lives in the integrity sweep, not in every live query, so it never taxes the prod read floor
- The embedding-cache `content_hash` and the idempotency-receipt `content_hash`. Those keep their cache and idempotency roles unchanged
- Any retrieval-class change. This is a governance drift guard with zero ranking effect

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts` | Modify | Add the read-time content-hash recompute branch to `verify_integrity` and surface `contentHashMismatches` on the summary |
| `.opencode/skills/system-spec-kit/mcp_server/lib/content-id.ts` | Read-only reuse | Reuse `hashContentBody` for the recompute, no change to the helper |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | When the integrity check runs with the content-hash flag on, the system SHALL recompute each row body hash with `hashContentBody` and compare it to the stored `content_hash` | A corrupted scratch row whose body no longer matches its stored hash is reported in `contentHashMismatches` with its row id |
| REQ-002 | The recompute SHALL be detect-and-report only and SHALL never mutate a row body or stored hash | A mismatch leaves both the body and the stored hash untouched, confirmed by re-reading the row after the check |
| REQ-003 | When the content-hash flag is off, the system SHALL behave exactly as the current `verify_integrity`, with no extra reads and no new summary field populated | The integrity summary on a clean corpus with the flag off is byte-identical to the pre-change summary shape |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Rows with a null or absent stored `content_hash` SHALL be skipped, not counted as mismatches | A pre-migration row with `content_hash IS NULL` is absent from `contentHashMismatches` |
| REQ-005 | Keep the phase HVR clean | No em-dashes, no prose semicolons, no Oxford commas across the authored docs |
| REQ-006 | Pass strict validation | `validate.sh --strict` returns exit 0 on the phase folder |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A deliberately corrupted scratch row is caught by the recompute and reported with its id, while a clean corpus reports zero mismatches
- **SC-002**: The flag-off path keeps the current integrity cost and summary shape, and strict validation returns exit 0 with HVR-clean docs
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `verify_integrity` at `lib/search/vector-index-queries.ts:1524` and `hashContentBody` at `lib/content-id.ts:14` | The check extends one existing function and reuses one existing helper | Add a branch, do not fork a parallel integrity path |
| Risk | Full-corpus re-hash on every read taxes the hot path | High if mis-placed | Keep the recompute in the integrity sweep behind a default-off flag, never in the live query |
| Risk | A body and its stored hash are normalized differently than at write time, causing false mismatches | Med | Hash the same body form the write path hashes, confirmed against the save-side `content_hash` write at `lib/storage/checkpoints.ts:2145` |
| Dependency | This phase is a standing drift guard, not an A1/B1/B2 safe-fix-engine item, so it does NOT depend on `026-shared-safe-fix-engine` | Keeps the phase independently buildable | Implement as a read-side check, never a fix-class registry entry |
| Dependency | This is a governance check with zero ranking effect, so it does NOT depend on `015-c2-prodmode-recall-gate` or any 027 retrieval item | No prod-mode recall gate is required to ship it | Ship on cost and structural soundness, the floor never touches it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The recompute runs only inside the integrity sweep, so the live search path keeps its current latency with the flag in any state
- **NFR-P02**: With the flag off the sweep performs no extra row-body read versus the current `verify_integrity`

### Security
- **NFR-S01**: The recompute reads inside the same single-author local trust boundary the stored hash already occupies and adds no signing or external key

### Reliability
- **NFR-R01**: A detected mismatch is reported as a fault, never auto-corrected, so a corrupted body never silently propagates as a clean read
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a row with an empty body still has a stored hash, the recompute compares the empty-body hash and reports a mismatch only on genuine drift
- Maximum length: a very large body is hashed once per integrity run, never per live query, so length never reaches the hot path
- Invalid format: a row with a null or absent `content_hash` is skipped, not flagged

### Error Scenarios
- External service failure: not applicable, the check is a local SHA-256 recompute with no external dependency
- Network timeout: not applicable
- Concurrent access: a row mutated mid-sweep is reported against the body read in that sweep, the next sweep reconciles it

### State Transitions
- Partial completion: an aborted sweep leaves no mutation, so a re-run is safe and idempotent
- Pre-migration rows: rows written before the hash column existed carry a null hash and stay out of the mismatch count
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | One function extended, one helper reused, one new summary field |
| Risk | 8/25 | Read-only check, no ranking effect, no body mutation |
| Research | 6/20 | Seams already grounded to file:line in `research/research.md` |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether the recompute should run on every read or only inside the on-demand integrity sweep. The research verdict places it as a standing drift guard in the sweep, so the sweep is the default home and a per-read mode stays out of scope unless the operator asks for it.
- Whether `contentHashMismatches` should escalate to a non-zero exit code under a strict mode, matching the orphaned-row reporting, or stay report-only on the summary.
<!-- /ANCHOR:questions -->

---

<!--
VERDICT: A9 carries the research verdict GO-on-cost, the floor-bypassing governance class.
It is one of the four standing drift guards in research/research.md section 5 (storage drift
via read-time content_hash). It touches validation not ranking, so it has zero prod-retrieval
risk and ships on cost and structural soundness without the C2 prod-mode recall gate.
-->
