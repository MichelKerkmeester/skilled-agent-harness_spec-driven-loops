---
title: "Decision Record: Phase 3: content-hash-normalization-and-save-dedup-lanes [template:level_3/decision-record.md]"
description: "Architecture decisions for killing snapshot churn: normalize content-hash input behind a dual-compare migration, open the PE-gate UPDATE/REINFORCE lanes at the call site, and reorder the full-auto canonical save fingerprint validation with a real canonical-writer dispatch."
trigger_phrases:
  - "content hash normalization decision"
  - "save dedup lanes adr"
  - "dual-compare migration decision"
  - "pe lane exclusion decision"
  - "post save fingerprint ordering decision"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-speckit-memory/041-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/003-content-hash-normalization-and-save-dedup-lanes"
    last_updated_at: "2026-07-04T17:51:09.403Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 3 planning docs (spec, plan, tasks, checklist, decision-record)"
    next_safe_action: "Run T001 confirm-before-fix probes and T002 vitest baseline before any code change"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-content-hash-normalization-and-save-dedup-lanes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 3: content-hash-normalization-and-save-dedup-lanes

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Normalize content-hash input at the parser with a dual-compare migration

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-03 |
| **Deciders** | Michel Kerkmeester (program decomposition approval), deep-dive remediation program |

---

<!-- ANCHOR:adr-001-context -->
### Context

`content_hash` is a raw sha256 over document bytes (`memory-parser.ts:914`). Any CRLF conversion, trailing whitespace, or `_memory.continuity` timestamp refresh makes the same document hash differently, and each same-path re-save then retires the predecessor to `tier='deprecated'` and inserts a new row. The deep-dive report names this Chain A step 1 and the ledger calls it the root cause of L1: 12,280 duplicate-hash parents and live top-4 results that were four snapshots of one spec.md. We needed one place to make content identity stable without invalidating every stored hash at once.

### Constraints

- 33k stored hashes exist; a hard cutover would mark the entire corpus as changed on its next save.
- Normalization must not rewrite stored document bytes; it only changes what gets hashed.
- Continuity churn lives inside the frontmatter `_memory.continuity` block; body text that merely resembles it must stay untouched.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Normalize the hash input inside `computeContentHash` (CRLF to LF, strip trailing whitespace, zero the continuity fingerprint and timestamp lines) and ship a dual-compare migration that accepts the legacy raw hash or the normalized hash as equal for the same logical content.

**How it works**: The parser normalizes a copy of the content before hashing inside `computeContentHash` (the single wrapper over `hashContentBody` @ content-id.ts:14); stored bytes never change. Every dedup comparison routes through one shared `hashesMatch(content, storedHash)` helper that consults both forms during the transition window, so existing rows keep their identity. New saves write normalized hashes only.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Normalize at parser + dual-compare (chosen)** | Kills churn at the single producer; non-destructive; lazy adoption | Dual-compare shim adds one comparison branch until retired | 9/10 |
| Corpus-wide re-hash migration | Clean single-form state immediately | Rewrites 33k rows up front; risky inside a 1.3GB live DB; collides with phase 001 dup collapse | 5/10 |
| Result-side dedup only (no hash change) | No migration at all | Treats the symptom; supersede chains keep growing; write-path cost remains | 3/10 |

**Why this one**: The producer is a single function, so normalizing there fixes every consumer at once, and dual-compare removes the only real risk (identity break for existing rows).
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Timestamp-only and whitespace-only re-saves stop minting deprecated snapshots (spec SC-003).
- Phase 001's dup collapse works against a stable identity instead of a moving one. Ordering caveat: 003 runs after 001, so until 003 lands 001 collapses against a still-moving identity — 001's "one active row per logical key" is not durable until 003 stops the churn (timestamp/CRLF re-saves keep minting deprecated snapshots between 001 and 003, bounded by re-save rate).

**What it costs**:
- A dual-compare branch in dedup checks until retirement. Mitigation: document the retirement condition (spec.md open question) and keep the branch behind one helper.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Normalization zeroes a body line that looks like continuity data | M | Scope zeroing to the frontmatter continuity block; adversarial test row |
| Legacy hash misses a match during the window | M | Dual-compare covers both forms; matrix rows include legacy-hash docs |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Root cause of L1 churn, live-reproduced (ledger Agent H P2, 🟢 data) |
| 2 | **Beyond Local Maxima?** | PASS | Re-hash migration and result-side-only dedup both evaluated above |
| 3 | **Sufficient?** | PASS | One producer function plus a read-side shim; no schema change |
| 4 | **Fits Goal?** | PASS | Decomposition §003 lists it first; gates SC-001/SC-003 |
| 5 | **Open Horizons?** | PASS | Normalized identity is what reconsolidation's planned content-hash path expects |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `lib/parsing/memory-parser.ts:914` normalizes the hash input inside `computeContentHash` (the single wrapper over `hashContentBody` @ `lib/content-id.ts:14`).
- The shared `hashesMatch(content, storedHash)` helper (home: `lib/content-id.ts`) centralizes the legacy-or-normalized comparison for every consumer (preflight, PE gate, quality gate, v28 lineage).
- Migration surface (`vector-index-schema.ts` registry) adds the dual-compare behavior for stored-hash checks.

**How to roll back**: Revert the phase commits and rebuild dist; stored hashes were never rewritten, so prior behavior returns without data repair.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Open PE UPDATE/REINFORCE lanes at the orchestration call site, keep and extend the canonical-path guard

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-03 |
| **Deciders** | Michel Kerkmeester (program decomposition approval), deep-dive remediation program |

---

<!-- ANCHOR:adr-002-context -->
### Context

The PE gate can only return UPDATE or REINFORCE when a same-path predecessor is among its candidates, but the orchestration call excludes exactly those rows via `excludeFilePath`/`excludeCanonicalFilePath` (`pe-orchestration.ts:66-67`), and `pe-gating.ts:172-174` filters on the same params. Every save therefore becomes CREATE, FSRS reinforcement never fires, and supersede chains grow (report §3 #26, Chain E). Tests hide the gap by mocking `findSimilarMemories`. Separately, the cross-file SUPERSEDE path can deprecate sibling docs from regex matches because the canonical-path guard in `pe-orchestration.ts:84-97` (condition at :80-82) covers UPDATE/REINFORCE only (ledger Agent G P1). Note `pe-gating.ts:293-298` is `markMemorySuperseded` (the UPDATE mutation), not this guard.

### Constraints

- Cross-file UPDATE/REINFORCE must stay blocked; the existing CREATE rewrite guard in `pe-orchestration.ts` is correct and must survive.
- The fix must be visible to tests without mocks, or #26 regresses silently.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Remove the two same-path exclusion params from the orchestration `findSimilarMemories` call so predecessors become candidates, keep the cross-file CREATE rewrite guard, extend that canonical-path guard to SUPERSEDE, and rewrite the masking tests with same-path fixtures.

**How it works**: Candidate discovery returns the same-path predecessor; `pe-gating` compares content hashes and similarity to pick REINFORCE (unchanged meaning) or UPDATE (evolved content). The guard still rewrites any cross-file UPDATE/REINFORCE/SUPERSEDE target to CREATE, so sibling docs cannot be deprecated by lexical coincidence.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Drop exclusions at call site + extend guard (chosen)** | Two-line cause, small diff; guard already exists for direction safety | Slightly larger candidate sets per save | 9/10 |
| Rework `pe-gating` internals to fetch predecessors itself | Keeps call site untouched | Duplicates candidate discovery; two query paths to maintain | 5/10 |
| New dedicated same-path lane before the PE gate | Explicit contract | A third dedup lane when the PE gate already defines UPDATE/REINFORCE semantics | 4/10 |

**Why this one**: The exclusion params are the direct cause; removing them restores the gate's designed behavior with the smallest change surface.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Edited re-saves keep one lineage (SC-002); FSRS reinforcement gets fuel (Chain E).
- Cross-file regex deprecation of siblings stops (Agent G P1).

**What it costs**:
- Candidate sets include the predecessor on every same-path save. Mitigation: limit stays at 5; no extra query.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Unintended UPDATE merges across files | H | Canonical-path guard retained and extended to SUPERSEDE; matrix rows assert CREATE for cross-file |
| Existing mocked tests keep passing while behavior changed | M | T020 replaces mocks with same-path fixtures |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Every save is CREATE today; lanes structurally dead (#26, Chain E) |
| 2 | **Beyond Local Maxima?** | PASS | Internal rework and a new lane both considered above |
| 3 | **Sufficient?** | PASS | Removes the exact exclusion that blocks the lanes; guard covers direction risk |
| 4 | **Fits Goal?** | PASS | Decomposition §003 PE-gate bullet; gates SC-002 |
| 5 | **Open Horizons?** | PASS | Reachable lanes are prerequisites for phase 009 learning-loop repair |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `handlers/save/pe-orchestration.ts:66-67` drops the two exclusion params.
- `handlers/save/pe-orchestration.ts:84-97` (guard condition :80-82, which tests only UPDATE/REINFORCE today) extends the canonical-path rewrite to SUPERSEDE; `predictionErrorGate.init(db)` gets wired in pe-gating so PE audit logging works. (`pe-gating.ts:293-298` is `markMemorySuperseded`, the UPDATE mutation, not the guard.)
- Tests in pe-orchestration.vitest.ts, pe-gating.vitest.ts, handler-memory-save.vitest.ts gain same-path fixtures.

**How to roll back**: Revert the commits; the exclusion params return and the gate falls back to CREATE-only behavior.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Validate POST_SAVE_FINGERPRINT against promoted content and dispatch the canonical writer for full-auto

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-03 |
| **Deciders** | Michel Kerkmeester (program decomposition approval), deep-dive remediation program |

---

<!-- ANCHOR:adr-003-context -->
### Context

The full-auto canonical routed save structurally self-rejects (report §3 P0 #2): the POST_SAVE_FINGERPRINT plan is built and validated against the target file before `promotePendingFile` runs (`memory-save.ts:1803`, `atomic-index-memory.ts:360`, validator at `spec-doc-structure.ts:1105`), so the fingerprint never matches, and the validator even writes the snapshot back. The advertised apply follow-up never dispatches the canonical writer because `shouldPlanCanonicalSave` excludes `plannerMode='full-auto'` (`memory-save.ts:3200`); the canonical writer has no non-test caller. The parity tests that would have caught this are `describe.skip`'d (`memory-save-integration.vitest.ts:526`). Two divergent `buildContinuityFingerprint` builders (`memory-save.ts:1078` vs `spec-doc-structure.ts:580`) add a permanent mismatch risk on top.

### Constraints

- Atomic save semantics (pending file, rollback on rejection) must survive the reordering.
- The parity contract must be re-derived from the current planner-default behavior, not resurrected from stale assertions.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Run the POST_SAVE_FINGERPRINT check against the content that promotion actually produces (post-promotion read, or the pending content that will be promoted), make the full-auto apply follow-up dispatch the canonical writer, and unify both fingerprint call sites onto the exported builder in `spec-doc-structure.ts`.

**How it works**: The save pipeline writes the pending file, indexes, promotes, and only then validates the promoted bytes against the expected fingerprint from the same canonical builder. Full-auto flows through the same canonical writer that planner-first advertises, giving the writer a real production caller and making the un-skipped parity tests meaningful.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Reorder validation + dispatch canonical writer (chosen)** | Fixes both halves of #2; parity tests become truthful | Touches the atomic lifecycle, needs failure-injection coverage | 8/10 |
| Disable POST_SAVE_FINGERPRINT for full-auto | Tiny diff | Removes the only post-write integrity check exactly where routing is automatic | 2/10 |
| Remove full-auto canonical routing entirely | Simplifies modes | Amputates an advertised feature instead of fixing its ordering bug | 4/10 |

**Why this one**: The validation is right, its timing is wrong; fixing the ordering keeps the integrity check and makes the advertised behavior real.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Full-auto canonical saves complete (SC-005); the canonical writer gains a production caller.
- CONTINUITY_FRESHNESS mismatch risk from divergent builders disappears (one builder).

**What it costs**:
- Failure-injection tests must cover the new ordering. Mitigation: reuse the existing atomic-save injection harness in handler-memory-save.vitest.ts.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Post-promotion validation failure leaves a promoted file with a rejected index row | M | Keep rollback path symmetrical: restore original state on post-promotion mismatch; injection test |
| Un-skipped parity tests encode the old contract | M | Rewrite T511+ assertions to the planner-default contract before removing `.skip` |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | P0: every full-auto canonical save self-rejects today (#2) |
| 2 | **Beyond Local Maxima?** | PASS | Disable-check and remove-mode options rejected above |
| 3 | **Sufficient?** | PASS | Ordering plus dispatch fixes the failure without new subsystems |
| 4 | **Fits Goal?** | PASS | Decomposition §003 P0 bullet; gates SC-005 and the parity un-skip |
| 5 | **Open Horizons?** | PASS | A truthful canonical writer is the base for later save-routing work |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `handlers/memory-save.ts:1803` (postSavePlan input) and `:3200` (`shouldPlanCanonicalSave` full-auto dispatch).
- `handlers/save/atomic-index-memory.ts:360` area (validation ordering relative to promotion).
- `lib/validation/spec-doc-structure.ts:1105` (validator input; no snapshot write-back on mismatch).
- `handlers/memory-save.ts:1078` local builder deleted in favor of the exported one.
- `tests/memory-save-integration.vitest.ts:526` un-skipped with rewritten assertions.

**How to roll back**: Revert the commits and rebuild dist; the prior (self-rejecting) ordering returns, and the parity block can be re-skipped only with an explicit note in implementation-summary.md.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!--
Level 3 Decision Record: One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
