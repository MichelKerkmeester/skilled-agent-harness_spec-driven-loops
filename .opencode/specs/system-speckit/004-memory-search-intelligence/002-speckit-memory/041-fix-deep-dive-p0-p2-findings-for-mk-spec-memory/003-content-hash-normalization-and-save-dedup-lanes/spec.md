---
title: "Feature Specification: Phase 3: content-hash-normalization-and-save-dedup-lanes [template:level_3/spec.md]"
description: "Stops save-path snapshot churn in mk-spec-memory: normalizes content-hash input with a dual-compare migration, unifies the two continuity-fingerprint builders, makes PE-gate UPDATE/REINFORCE lanes reachable, fixes the P0 full-auto canonical save self-reject, and gates the save dedup lanes so unchanged re-saves return unchanged instead of minting deprecated snapshots."
trigger_phrases:
  - "content hash normalization"
  - "save dedup lanes"
  - "snapshot churn supersede"
  - "pe-gate update reinforce lanes"
  - "full-auto canonical save self-reject"
  - "post save fingerprint ordering"
  - "buildContinuityFingerprint unification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/041-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/003-content-hash-normalization-and-save-dedup-lanes"
    last_updated_at: "2026-07-04T17:51:09.403Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 3 planning docs (spec, plan, tasks, checklist, decision-record)"
    next_safe_action: "Program complete (016 shipped + pushed)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-content-hash-normalization-and-save-dedup-lanes"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Exact set of continuity lines to zero during hash normalization (fingerprint + last_updated_at confirmed; verify no other churn-only lines during T001)"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 3: content-hash-normalization-and-save-dedup-lanes

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

Every save into mk-spec-memory hashes raw bytes, so CRLF, trailing whitespace, or a continuity-timestamp refresh counts as "new content" and mints a deprecated snapshot of the same document (deep-dive-report Chain A). On top of that source churn, the save dedup lanes are broken: PE-gate UPDATE/REINFORCE are structurally unreachable (#26), the full-auto canonical save always self-rejects (P0 #2), and the complement/quality-gate/preflight checks reject legitimate re-saves as duplicates of themselves (#21, #22). This phase normalizes the hash input at the source, unifies the duplicated continuity-fingerprint builders, and repairs every save dedup lane so unchanged re-saves report `unchanged` and edited re-saves route through UPDATE/REINFORCE.

**Key Decisions**: Normalize hash input at the parser with a dual-compare migration (ADR-001); open PE lanes at the call site while keeping the cross-file canonical-path guard (ADR-002); reorder POST_SAVE_FINGERPRINT and route full-auto through the canonical writer (ADR-003).

**Critical Dependencies**: Phase 002 shared active-row predicate (deprecated/tombstone visibility interplay); program execution order places this phase after 011, 001, and 002.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-07-03 |
| **Branch** | `system-speckit/004-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 13 |
| **Predecessor** | 002-archived-tier-and-tombstone-read-exclusions |
| **Successor** | 004-embedding-coverage-and-vector-shard-consistency |
| **Handoff Criteria** | All P0/P1 REQs verified with evidence; parity tests un-skipped and green; vitest baseline delta clean; success gates SC-001..SC-005 measured live; `validate.sh --strict` exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Deep dive remediation phase children specification.

**Scope Boundary**: Save-path dedup correctness only — content-hash computation, continuity-fingerprint builders, PE-gate lane reachability, canonical full-auto save, complement/quality-gate/preflight/recon/retire-carry lanes, and a result-time file-identity collapse as belt-and-braces. Corpus repair of already-accumulated duplicate rows belongs to phase 001; channel-level deprecated/archived exclusion belongs to phase 002.

**Dependencies**:
- Phase 002 shared active-row predicate (`deleted_at IS NULL AND tier NOT IN (deprecated, archived)`) for tombstone/deprecated visibility in dedup and save results.
- Program execution order: 011 → 001 → 002 → **003** (research/phase-decomposition.md, RECOMMENDED EXECUTION ORDER).
- Ordering honesty: 003 is the durable root-cause fix (Chain A), but it runs after 001's dup-collapse and 002. 001's "one active row per logical key" invariant is therefore not durable at 001-completion — between 001 and 003, ongoing timestamp/CRLF churn keeps minting deprecated snapshots of the same logical key (bounded by the re-save rate). Treat 001's post-collapse state as transient until 003 lands.

**Deliverables**:
- Normalized `computeContentHash` input with dual-compare migration for existing hashes.
- One canonical `buildContinuityFingerprint` builder.
- Reachable PE-gate UPDATE/REINFORCE lanes plus SUPERSEDE canonical-path guard.
- Full-auto canonical save that completes without self-reject, with parity tests un-skipped.
- Gated complement recheck, quality-gate predecessor exclusion, benign preflight self-dup, recon conflict ordering, retire-carry fix, and result-time file-identity collapse.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`content_hash` is a raw sha256 with no normalization (`memory-parser.ts:914`; deep-dive-report Chain A step 1 cites :913), so any CRLF/trailing-whitespace or `_memory.continuity.last_updated_at` churn registers as new content; each same-path re-save then retires the predecessor to `tier='deprecated'` and inserts a new row, accumulating snapshots unboundedly (Chain A steps 2-3). The lanes that should absorb these re-saves are all broken: PE-gate UPDATE/REINFORCE are unreachable because the orchestration call excludes same-path candidates (`pe-orchestration.ts:66-67`, report §3 #26), the transactional complement recheck aborts legitimate re-saves even with reconsolidation disabled (`memory-save.ts:2618`, #21), the quality-gate semantic dedup rejects a re-save as a near-dup of its own predecessor (`memory-save.ts:2398` + `lib/validation/save-quality-gate.ts:704`, #22), and the full-auto canonical routed save structurally self-rejects because POST_SAVE_FINGERPRINT is validated pre-promotion and the advertised apply follow-up never dispatches the canonical writer (`memory-save.ts:1803,3200` + `atomic-index-memory.ts:360` + `spec-doc-structure.ts:1105`, P0 #2).

### Purpose
A re-save of an unchanged file returns `unchanged`, an edited same-path re-save routes through UPDATE/REINFORCE, and continuity-timestamp churn stops minting deprecated snapshots at the source.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Content-hash input normalization (CRLF/trailing-whitespace; zero continuity fingerprint/timestamp lines) with a dual-compare migration for existing hashes, exposed as one shared `hashesMatch(content, storedHash)` helper used at every comparison site (preflight, PE gate, quality gate, v28 lineage) (Chain A; ledger Agent H P2 root cause of L1).
- Unification of the two `buildContinuityFingerprint` builders (`memory-save.ts:1078` local vs `spec-doc-structure.ts:580` exported; ledger Agent H CONTRACT).
- PE-gate lane reachability: drop same-path exclusion params at `pe-orchestration.ts:66-67`; fix tests that mock `findSimilarMemories` to mask it; extend the canonical-path guard to SUPERSEDE (ledger Agent G P1); wire PE audit init (dead T-09 logging).
- P0 full-auto canonical save: POST_SAVE_FINGERPRINT ordering and apply follow-up dispatch (`memory-save.ts:1803/3200`, `atomic-index-memory.ts:360`, `spec-doc-structure.ts:1105`); un-skip the `describe.skip`'d parity tests (`memory-save-integration.vitest.ts:526`).
- Complement recheck gating on recon-enabled + `!force` with same-path predecessor exclusion (`memory-save.ts:2618`, #21).
- Quality-gate Layer-3 dedup predecessor exclusion (`lib/validation/save-quality-gate.ts:704`, #22).
- Preflight exact-dup same-path exclusion returning benign `unchanged` (ledger Agent H P2).
- Content-router Tier-1 transcript-wrapper correctness: anchor `assistant:`/`user:`/`tool:` speaker cues to line-start instead of matching anywhere in normalized text, so save/index chunks that merely mention those tokens are not silently dropped (report Systemic #4 item 3, Agent F P2; `lib/routing/content-router.ts:410-414`).
- Recon conflict ordering: retire predecessor before insert (unique-index collision; ledger Agent H P1).
- Retire-carry: stop re-stamping `deprecated` onto the successor; dedup/tombstone visibility in save results (resurrect path) (ledger Agent H P2).
- Governance rollback re-activating the retired predecessor; chunked-save rollback transactional note; spec-folder mutex reclaim rename-verify; BM25 add post-commit (ledger Agent H P2 batch).
- Result-time file-identity collapse in the pipeline (same canonical path keeps best; `hybrid-search.ts:949`) as belt-and-braces (ledger L1: dedup key is row id only).

### Out of Scope
- Draining or collapsing already-accumulated duplicate/dead rows - phase 001 owns corpus identity repair and dup-hash collapse.
- Channel-level deprecated/archived/tombstone exclusion predicates - phase 002 owns the shared active-row predicate.
- Ranking behavior, rescue layer, or score-scale changes - phases 006/007 own ranking work.
- Chunking engagement on the scan path and safe-swap self-delete - phase 004 owns chunking disposition (P0 #3).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts | Modify | Normalize `computeContentHash` input at :914 (CRLF→LF, strip trailing whitespace, zero continuity fingerprint/timestamp lines); this wrapper over `hashContentBody` is the single normalization point |
| .opencode/skills/system-spec-kit/mcp_server/lib/content-id.ts | Modify | `hashContentBody` (:14) is the raw sha256 primitive wrapped by `computeContentHash`; add the shared `hashesMatch(content, storedHash)` dual-compare helper consumed at every comparison site (preflight, PE gate, quality gate, v28 lineage) |
| .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts | Modify | Remove local fingerprint builder (:1078); POST_SAVE_FINGERPRINT plan ordering (:1803); quality-gate wiring (:2398); complement recheck gating (:2618); canonical-writer dispatch for full-auto (:3200); preflight/retire-carry/recon-conflict/governance-rollback lanes |
| .opencode/skills/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts | Modify | Canonical `buildContinuityFingerprint` home (:580); post-save fingerprint validation input (:1105) |
| .opencode/skills/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts | Modify | Drop `excludeFilePath`/`excludeCanonicalFilePath` from the `findSimilarMemories` call (:66-67); add the SUPERSEDE case to the cross-file canonical-path guard condition at :80-82 (guard body rewrites cross-file targets to CREATE at :84-97) |
| .opencode/skills/system-spec-kit/mcp_server/handlers/pe-gating.ts | Modify | Same-path candidate exclusion filters (:172-174); wire `predictionErrorGate.init(db)` for PE audit logging. NOTE: :293-298 is `markMemorySuperseded` (the UPDATE mutation), not the cross-file guard — the SUPERSEDE guard extension lives in pe-orchestration.ts:80-97 |
| .opencode/skills/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts | Modify | Pending-file write/promotion ordering relative to fingerprint validation (:360 area) |
| .opencode/skills/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts | Modify | Layer-3 semantic dedup predecessor exclusion (`checkSemanticDedup` :704) |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | Modify | Result-time dedup key: canonical file identity, keep best (:949) |
| .opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts | Modify | Anchor the Tier-1 `tier1.transcript.wrapper` speaker cues to line-start (:410-414; `assistant:`/`user:`/`tool:` currently match anywhere in normalized text, category `drop`) |
| .opencode/skills/system-spec-kit/mcp_server/lib/storage (migration surface, e.g. vector-index-schema.ts) | Modify | Dual-compare content-hash migration (idempotent, non-destructive) via the shared `hashesMatch` helper; no stored-hash rewrite |
| .opencode/skills/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts | Modify | Un-skip `describe.skip('planner-first and fallback parity')` (:526); rewrite stale assertions to the current planner-default contract |
| .opencode/skills/system-spec-kit/mcp_server/tests/pe-orchestration.vitest.ts, tests/pe-gating.vitest.ts, tests/handler-memory-save.vitest.ts | Modify | Stop mocking `findSimilarMemories` in ways that hide same-path candidates; add same-path lane coverage |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Normalize content-hash input (CRLF→LF, strip trailing whitespace, zero `_memory.continuity` fingerprint/timestamp lines) with a dual-compare migration so legacy raw hashes stay matchable (deep-dive-report Chain A step 1; ledger Agent H P2 "ROOT CAUSE of L1 churn", `memory-parser.ts:914`) | **Given** an indexed doc, **When** it is re-saved with only CRLF/trailing-ws/continuity-timestamp changes, **Then** the computed hash equals the stored (or legacy dual-compared) hash and no supersede chain is created |
| REQ-002 | Fix the full-auto canonical save self-reject: run POST_SAVE_FINGERPRINT post-promotion (or validate against pending content) and make the apply follow-up dispatch the canonical writer (report §3 P0 #2; `memory-save.ts:1803,3200`, `atomic-index-memory.ts:360`, `spec-doc-structure.ts:1105`) | **Given** `plannerMode='full-auto'` with a routed canonical save, **When** the save runs end to end, **Then** it completes without a POST_SAVE_FINGERPRINT rejection and the canonical writer has a real non-test call path |
| REQ-003 | Make PE-gate UPDATE/REINFORCE lanes reachable by dropping the same-path exclusion params from the `findSimilarMemories` call, and fix the tests that mock it to mask the gap (report §3 #26 and Chain E; `pe-orchestration.ts:66-67`, `pe-gating.ts:172-174`) | **Given** an edited doc re-saved at the same path, **When** the PE gate evaluates candidates, **Then** the same-path predecessor is a candidate and the decision is UPDATE or REINFORCE, not CREATE |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Unify the two `buildContinuityFingerprint` builders onto one exported implementation (ledger Agent H CONTRACT; `memory-save.ts:1078` vs `spec-doc-structure.ts:580`) | **Given** identical doc content, **When** both former call sites compute a fingerprint, **Then** they produce byte-identical output from the single shared builder and CONTINUITY_FRESHNESS cannot mismatch by construction |
| REQ-005 | Gate the transactional complement recheck on reconsolidation-enabled and `!force`, excluding the same-path predecessor (report §3 #21; `memory-save.ts:2618`) | **Given** recon disabled or `force=true`, **When** a same-path re-save runs, **Then** no E088 `candidate_changed` abort fires from the complement recheck |
| REQ-006 | Exclude the doc's own predecessor from quality-gate Layer-3 semantic dedup (report §3 #22; `memory-save.ts:2398` + `lib/validation/save-quality-gate.ts:704`) | **Given** a lightly edited same-path re-save in enforce mode, **When** the quality gate runs, **Then** the save is not rejected as a near-duplicate of its own predecessor |
| REQ-007 | Fix recon conflict ordering (retire predecessor before insert; ledger Agent H P1 unique-index collision) and extend the cross-file canonical-path guard to SUPERSEDE so cross-file regex matches cannot deprecate sibling docs (ledger Agent G P1; the guard is `pe-orchestration.ts:84-97`, condition at :80-82 tests only UPDATE/REINFORCE today — `pe-gating.ts:293-298` is `markMemorySuperseded`, the UPDATE mutation, not the guard) | **Given** a same-path conflict-tier re-save, **When** the recon path inserts the successor, **Then** no `idx_memory_logical_key_active_unique` collision occurs; **Given** a cross-file SUPERSEDE candidate, **When** its canonical path differs from the save target, **Then** no sibling doc is marked deprecated |

### P2 - Optional (defer with documented reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Save-path P2 batch (ledger Agent H P2): preflight exact-dup same-path returns benign `unchanged`; retire-carry stops re-stamping `deprecated` onto the successor and save results surface dedup/tombstone hits (resurrect path); governance rollback re-activates the retired predecessor; spec-folder mutex reclaim verifies rename; BM25 in-memory add moves post-commit; chunked-save rollback transactional note | **Given** each listed lane, **When** its trigger scenario is replayed from the T001 confirmation probes, **Then** the corrected behavior is observed and covered by a test |
| REQ-009 | Result-time file-identity collapse: dedup pipeline candidates by canonical file identity (keep best), not row id alone (ledger L1; `hybrid-search.ts:949`) as belt-and-braces behind the source fix | **Given** multiple rows for one canonical path in a candidate set, **When** fusion dedup runs, **Then** one result per canonical path survives with the best score retained |
| REQ-010 | Anchor the content-router Tier-1 transcript-wrapper speaker cues to line-start (`^\s*(user|assistant|tool):`) or require ≥2 speaker turns instead of a substring match, so save/index chunks that merely mention `tool:`/`user:`/`assistant:` are not silently dropped (report Systemic #4 item 3, Agent F P2; `lib/routing/content-router.ts:410-414` `tier1.transcript.wrapper`, category `drop`) | **Given** a chunk whose body mentions `tool:` or `user:` mid-line but is not a transcript, **When** Tier-1 routing runs, **Then** the chunk is not dropped by `tier1.transcript.wrapper`; **Given** an actual multi-turn transcript, **When** Tier-1 routing runs, **Then** it is still dropped |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Re-saving an unchanged file returns status `unchanged`; no new row, no predecessor retirement (decomposition §003 success gate).
- **SC-002**: An edited same-path re-save routes through the UPDATE or REINFORCE lane instead of CREATE + supersede.
- **SC-003**: Continuity-timestamp-only churn produces zero new `deprecated` snapshots (Chain A killed at source).
- **SC-004**: The "packet 028 memory search intelligence status" query returns one row per logical doc from the save/dedup side (ledger L1 live repro showed 4 snapshots of one spec.md; full corpus effect also depends on phases 001/002).
- **SC-005**: Full-auto canonical save completes without self-reject; `planner-first and fallback parity` tests are un-skipped and green.
- **SC-006**: Full vitest gate re-run matches or improves the T002 baseline (no regressions, reported as a delta).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 shared active-row predicate | Tombstone/deprecated visibility in dedup and save results diverges if 002 lands differently | Consume the 002 predicate helper; if 002 is not yet merged, scope retire/tombstone visibility behind the same predicate signature |
| Dependency | 001 dup-collapse precedes 003 | 001's "one active row per logical key" is not durable until 003 stops the churn; timestamp/CRLF re-saves keep minting deprecated snapshots between 001 and 003 (bounded by re-save rate) | 003 is the durable fix; treat 001's collapsed state as transient and re-verify one-active-row after 003 merges |
| Dependency | Migration surface (`vector-index-schema.ts` migration registry) | Dual-compare migration must be idempotent and versioned | Follow the v28-style migration pattern; add an idempotency test |
| Risk | Hash normalization invalidates existing dedup identity | High | Dual-compare: accept legacy raw hash OR normalized hash during the transition window; no destructive rewrite of stored hashes |
| Risk | Opening PE lanes causes wrong-direction cross-file merges | Medium | Keep the existing cross-file CREATE rewrite guard; extend it to SUPERSEDE (REQ-007) |
| Risk | Reordering fingerprint validation breaks atomic rollback | Medium | Preserve pending-file rollback semantics in `atomic-index-memory.ts`; matrix-test failure injection paths |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Hash normalization adds no measurable save latency (target <1ms per document hash; no full-corpus re-hash at migration time).

### Security
- **NFR-S01**: Normalization only zeroes continuity lines inside the `_memory.continuity` frontmatter block; body text that merely resembles fingerprint/timestamp lines is never rewritten.

### Reliability
- **NFR-R01**: The dual-compare migration is idempotent and non-destructive; re-running it changes nothing, and reverting the code restores the prior comparison behavior without data repair.

---

## 8. EDGE CASES

### Data Boundaries
- Empty or zero-length content: hash computed over the normalized empty string; preflight returns a validation error, not a dedup verdict.
- CRLF inside fenced code blocks: normalized for hashing only; stored document bytes are untouched.
- A body line that looks like a continuity fingerprint outside the frontmatter continuity block: not zeroed (NFR-S01).
- Mixed legacy/normalized hashes during the dual-compare window: both compare as equal for the same logical content.

### Error Scenarios
- `force=true`: bypasses complement recheck and PE gating as documented; still writes atomically.
- Reconsolidation disabled (default): complement recheck must not fire (REQ-005).
- Tombstoned predecessor at the same path: save result surfaces the tombstone hit and the resurrect path instead of a silent no-op (REQ-008).
- Atomic index failure mid-save: pending file cleanup and predecessor state restore exactly as before the fix (regression-tested via failure injection).

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: ~13, LOC: 500+, Systems: parser, content identity, save orchestration, PE gate, atomic index, quality gate, content router, search pipeline |
| Risk | 18/25 | Auth: N, API: N, Breaking: potential dedup-identity break without dual-compare |
| Research | 12/20 | 🟡 findings need confirm-before-fix probes; parity-test contract needs re-derivation |
| Multi-Agent | 5/15 | Single workstream; test fixes parallelizable |
| Coordination | 8/15 | Depends on phases 001/002 ordering and shared predicate |
| **Total** | **61/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Normalized hashes orphan existing rows from dedup identity | H | M | Dual-compare migration (REQ-001); idempotency test |
| R-002 | Reachable PE lanes trigger unintended cross-file UPDATE/SUPERSEDE | H | M | Canonical-path guard kept and extended to SUPERSEDE (REQ-007) |
| R-003 | Fingerprint-ordering change breaks atomic save rollback | M | L | Failure-injection tests on `atomic-index-memory.ts` paths |
| R-004 | Un-skipped parity tests encode a stale contract | M | H | Rewrite assertions to the current planner-default contract before un-skipping; do not weaken the parity claim |
| R-005 | File-identity collapse hides legitimately distinct rows (chunks) | M | L | Collapse keys on canonical path + parent identity; chunk children excluded |

---

## 11. USER STORIES

### US-001: Unchanged re-save is benign (Priority: P0)

**As a** spec-kit operator, **I want** re-saving an unmodified document to report `unchanged`, **so that** routine memory saves stop minting deprecated snapshots.

**Acceptance Criteria**:
1. Given an indexed unchanged doc, When `memory_save` runs on it, Then the result is `unchanged` with no new row and no retirement.

### US-002: Edited re-save reinforces instead of forking (Priority: P0)

**As a** session agent saving context, **I want** an edited same-path save to route UPDATE/REINFORCE, **so that** the document keeps one lineage and FSRS reinforcement fires.

**Acceptance Criteria**:
1. Given an edited doc at the same canonical path, When the PE gate evaluates it, Then the decision is UPDATE or REINFORCE with the predecessor as target.

### US-003: Search shows one row per document (Priority: P1)

**As a** memory-search user, **I want** result dedup keyed on file identity, **so that** top-K slots are not spent on snapshots of the same file.

**Acceptance Criteria**:
1. Given multiple candidate rows sharing a canonical path, When fusion dedup runs, Then exactly one result for that path survives with the best score.

---

## 12. OPEN QUESTIONS

- Which continuity lines beyond `session_dedup.fingerprint` and `last_updated_at` churn on no-op saves? Confirm the full zeroing set during T001 probes.
- Does the dual-compare window need an explicit retirement milestone (e.g., after phase 001's dup-hash collapse re-hashes winners), or can it remain permanent read-side behavior? Decide during implementation; record in decision-record.md if it changes ADR-001.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Program Sources**: `../research/phase-decomposition.md` (§ 003), `../research/deep-dive-report.md` (Chain A; §3 P0 #2, P1 #21/#22/#26), `../research/findings-ledger.md` (Agent H)

---

<!--
LEVEL 3 SPEC
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->
