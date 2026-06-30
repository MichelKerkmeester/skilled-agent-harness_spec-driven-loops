---
title: "Implementation Plan: A9 Read-Time Content-Hash Integrity Verification [template:level_2/plan.md]"
description: "Extend the existing verify_integrity summary with a read-time content-hash recompute that re-hashes each row body via hashContentBody and reports mismatches, gated behind a default-off flag so silent storage drift becomes a detectable fault."
trigger_phrases:
  - "content hash integrity"
  - "read time hash verify"
  - "storage drift guard"
  - "verify_integrity content hash"
  - "silent corruption detection"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/001-on-write-quality/009-content-hash-integrity"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Specified planted-mismatch catch-rate benchmark and named vitest for the A9 scaffold"
    next_safe_action: "Hold for implementation, no code has landed"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/content-id.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: A9 Read-Time Content-Hash Integrity Verification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript MCP server lib |
| **Framework** | spec-kit memory integrity sweep (`verify_integrity`) |
| **Storage** | SQLite `memory_index` rows read for the body and stored `content_hash` |
| **Testing** | `validate.sh --strict` plus a scratch-row corruption probe through the integrity sweep |

### Overview
This phase extends the existing `verify_integrity` summary at `lib/search/vector-index-queries.ts:1524` with a read-time content-hash recompute that re-hashes each row body via `hashContentBody` from `lib/content-id.ts:14` and compares it to the stored `content_hash`. The recompute runs only inside the integrity sweep behind a default-off flag, reports mismatch rows on a new `contentHashMismatches` field, and never mutates a body or hash, so silent DB or migration drift becomes a detectable fault instead of invisible bad recall.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-function extension plus one new summary field plus a default-off flag gate. No new abstraction, no parallel integrity path, and no helper change.

### Key Components
- **`verify_integrity`**: the existing integrity summary at `lib/search/vector-index-queries.ts:1524`, today checking orphaned vectors, missing vectors, and orphaned files, the target host of the new recompute branch.
- **`hashContentBody`**: the SHA-256 helper at `lib/content-id.ts:14`, reused verbatim for the recompute with no change.
- **`contentHashMismatches`**: the new report-only field on the integrity summary, carrying the row ids whose body no longer matches the stored hash.
- **Save-side `content_hash` write**: the write path at `lib/storage/checkpoints.ts:2145`, the reference for the exact body form the recompute must hash so the read form matches the write form.

### Data Flow
The integrity sweep reads each `memory_index` row. With the flag off the sweep behaves exactly as today. With the flag on the sweep re-hashes each row body via `hashContentBody`, compares the result to the stored `content_hash`, skips rows with a null or absent hash, and folds any mismatch into `contentHashMismatches` on the summary. The row body and stored hash are never written.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `verify_integrity` at `vector-index-queries.ts:1524` | Reports orphaned vectors, missing vectors, and orphaned files | add the read-time content-hash recompute branch and surface `contentHashMismatches` on the summary | grep shows the new branch and field, a clean corpus reports zero mismatches |
| `hashContentBody` at `content-id.ts:14` | Computes the SHA-256 body hash at write time | reuse verbatim for the recompute, no change to the helper | grep shows the helper is imported not redefined, no diff to `content-id.ts` |
| Save-side `content_hash` write at `checkpoints.ts:2145` | Writes the stored hash from the body at save time | not a consumer change, used only as the body-form reference | the recompute hashes the same body form the save path hashes, confirmed against this write site |
| Integrity summary consumers | Read the existing summary fields | the new field is additive and report-only | a flag-off summary keeps the current shape, the flag-on summary adds one field |

Required inventories:
- Same-class producers: `rg -n 'content_hash|hashContentBody' .opencode/skills/system-spec-kit/mcp_server/lib`.
- Consumers of changed symbols: `rg -n 'verify_integrity|contentHashMismatches' .opencode/skills/system-spec-kit --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: flag off, flag on with a clean row, flag on with a corrupted row, flag on with a null-hash pre-migration row, flag on with an empty body.
- Algorithm invariant: a body that no longer matches its stored hash is reported and never mutated, a null-hash row is skipped, and the flag-off path adds no read and no field.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm `hashContentBody` is exported and importable into `vector-index-queries.ts`
- [ ] Read the save-side `content_hash` write at `checkpoints.ts:2145` to pin the exact body form the recompute must hash
- [ ] Decide the default-off flag name and its read site, matching how the integrity sweep already gates optional work

### Phase 2: Core Implementation
- [ ] Add the read-time recompute branch to `verify_integrity`, re-hashing each row body via `hashContentBody` and comparing to the stored `content_hash`
- [ ] Skip rows with a null or absent `content_hash` so a pre-migration row is never counted as a mismatch
- [ ] Surface mismatch row ids on a new `contentHashMismatches` field, report-only with no body or hash mutation
- [ ] Gate the whole recompute behind the default-off flag so the flag-off sweep performs no extra row-body read

### Phase 3: Verification
- [ ] A deliberately corrupted scratch row is reported in `contentHashMismatches` with its id, while a clean corpus reports zero
- [ ] A re-read of a mismatched row confirms the body and stored hash are untouched
- [ ] The flag-off integrity summary keeps the current shape and `validate.sh --strict` exits 0

### Benchmark

The phase benchmark is a planted-mismatch catch-rate, not a recall number, because the recompute is a write-class drift detector with zero ranking effect and the prod search path truncates to a 3-result floor it never touches.

| Metric | Pass | Regress |
|--------|------|---------|
| Planted-mismatch catch-rate | 100 percent of planted corrupt-body rows reported in `contentHashMismatches` with their ids | any planted mismatch missed |
| Clean-corpus false-positive rate | 0 across clean rows and null-hash rows | any clean or null-hash row reported |
| Flag-off summary parity | byte-identical to the pre-change summary shape with no extra row-body read | any field or read added with the flag off |

Reproduce: `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/content-hash-integrity.vitest.ts`. The named test builds a scratch `memory_index`, plants a known corrupt-body set alongside clean and null-hash rows, runs `verify_integrity` at `lib/search/vector-index-queries.ts:1524` with `SPECKIT_CONTENT_HASH_INTEGRITY=true` and asserts four things: the planted ids appear in `contentHashMismatches`, a clean corpus reports zero, null-hash rows are skipped and a re-read proves the body and stored hash are untouched. A fifth case runs the sweep with the flag off and asserts the summary is byte-identical to the pre-change shape. Default-off is held by registering `SPECKIT_CONTENT_HASH_INTEGRITY` in the `flag-ceiling.vitest.ts` drift guard, and the flag is reversible at runtime through `SPECKIT_CONTENT_HASH_INTEGRITY=false`. Specified-not-run, no benchmark has executed and no code has landed.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | A clean row, a corrupted row, and a null-hash row through the recompute branch | direct `verify_integrity` invocation |
| Integration | The integrity sweep flag-on over a corrupted scratch row and flag-off over a clean corpus | integrity sweep run plus summary inspection |
| Manual | Re-read of a mismatched row to prove no body or hash mutation | row read plus diff evidence |
| Benchmark | Planted-mismatch catch-rate of 100 percent and a 0 false-positive rate on clean and null-hash rows | `tests/content-hash-integrity.vitest.ts` planted-corruption scratch DB |
| Regression | Flag-off integrity summary byte-identical to the pre-change shape with no `contentHashMismatches` populated and no extra row-body read | `tests/content-hash-integrity.vitest.ts` flag-off case |
| Default-off proof | `SPECKIT_CONTENT_HASH_INTEGRITY` defaults off and the new flag is registered in the flag-ceiling drift guard | `tests/flag-ceiling.vitest.ts` ALL_SPECKIT_FLAGS and FLAG_CHECKERS |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `verify_integrity` at `vector-index-queries.ts:1524` | Internal | Green | None, the function ships today and hosts the new branch |
| `hashContentBody` at `content-id.ts:14` | Internal | Green | None, the helper ships today and is reused verbatim |
| Save-side body-form reference at `checkpoints.ts:2145` | Internal | Green | A body-form mismatch would cause false mismatches if unpinned |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The recompute false-fires on a clean corpus, or the flag-on sweep cost regresses the integrity run beyond its budget.
- **Procedure**: Leave the flag default-off so the sweep behaves exactly as today, or revert the recompute branch while keeping the rest of `verify_integrity` unchanged.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 3-5 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **5-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Default-off flag confirmed so the sweep cost stays at the current floor
- [ ] Body-form reference pinned against the save-side write to avoid false mismatches
- [ ] Corrupted scratch-row regression proof staged

### Rollback Procedure
1. Keep the flag default-off so the integrity sweep behaves exactly as today
2. If the branch itself is at fault, revert the recompute branch in `verify_integrity`
3. Confirm the flag-off summary keeps the current shape
4. Re-attempt the branch once the false-mismatch source is fixed

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change reads rows and reports only, it never mutates a body or stored hash
<!-- /ANCHOR:enhanced-rollback -->

---
