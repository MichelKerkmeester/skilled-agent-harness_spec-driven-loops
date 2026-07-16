---
title: "Implementation Plan: Phase 3: content-hash-normalization-and-save-dedup-lanes [template:level_3/plan.md]"
description: "Normalize content-hash input with a dual-compare migration, unify the continuity-fingerprint builders, open the PE-gate UPDATE/REINFORCE lanes, fix the P0 full-auto canonical save self-reject, and gate the remaining save dedup lanes; verified by baseline-before-delta vitest runs and un-skipped memory-save parity tests."
trigger_phrases:
  - "content hash normalization plan"
  - "save dedup lanes plan"
  - "snapshot churn supersede fix"
  - "dual-compare hash migration"
  - "un-skip memory save parity tests"
  - "pe orchestration exclusion params"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/041-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/003-content-hash-normalization-and-save-dedup-lanes"
    last_updated_at: "2026-07-04T17:51:09.403Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 3 planning docs (spec, plan, tasks, checklist, decision-record)"
    next_safe_action: "Run T001 confirm-before-fix probes and T002 vitest baseline before any code change"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/memory-save-integration.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-content-hash-normalization-and-save-dedup-lanes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: content-hash-normalization-and-save-dedup-lanes

<!-- SPECKIT_LEVEL: 3 -->
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
| **Language/Stack** | TypeScript (Node 20+), CommonJS dist via tsc |
| **Framework** | None (MCP server handlers + lib modules) |
| **Storage** | better-sqlite3 + sqlite-vec (`memory_index` schema, versioned migrations in `vector-index-schema.ts`) |
| **Testing** | vitest (`mcp_server/tests/*.vitest.ts`) |

### Overview
Kill snapshot churn at its source by normalizing the `computeContentHash` input (CRLF/trailing-whitespace, zeroed continuity fingerprint/timestamp lines) behind a dual-compare migration, then repair every save dedup lane that currently misroutes legitimate re-saves: PE-gate UPDATE/REINFORCE reachability, the P0 full-auto canonical save self-reject, complement recheck gating, quality-gate predecessor exclusion, preflight self-dup, recon conflict ordering, and retire-carry. Finish with a result-time file-identity collapse in the search pipeline as belt-and-braces. Verification is baseline-before-delta: full vitest gate captured before any change, re-run whole after, with the skipped memory-save parity tests un-skipped as part of the phase.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md §2-3)
- [ ] Success criteria measurable (spec.md §5, SC-001..SC-006)
- [ ] Dependencies identified (phase 002 predicate; migration registry)

### Definition of Done
- [ ] All P0/P1 acceptance criteria met with evidence in checklist.md
- [ ] Full vitest gate re-run; delta vs T002 baseline reported and clean
- [ ] Parity tests un-skipped and green; docs updated (spec/plan/tasks/checklist)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Handler + lib module architecture inside the mk-spec-memory MCP server; save flow is an orchestrated pipeline (parse → dedup lanes → PE gate → atomic index → post-save validation).

### Key Components
- **memory-parser (`lib/parsing/memory-parser.ts`)**: owns `computeContentHash` (:914) — the single hash producer to normalize.
- **memory-save handler (`handlers/memory-save.ts`)**: orchestrates preflight, quality gate (:2398), complement recheck (:2618), planner/full-auto routing (:3200), post-save plan (:1803), and hosts the duplicate local fingerprint builder (:1078).
- **PE gate (`handlers/save/pe-orchestration.ts` + `handlers/pe-gating.ts`)**: candidate discovery and the cross-file canonical-path guard live in pe-orchestration.ts (:66-67 exclusion params; guard condition :80-82, body :84-97 — extend to SUPERSEDE); pe-gating.ts holds the same-path exclusion filters (:172-174) and `predictionErrorGate.init(db)`. NOTE: pe-gating.ts:293-298 is `markMemorySuperseded` (the UPDATE mutation), not the guard.
- **Atomic index (`handlers/save/atomic-index-memory.ts`)**: pending-file write → indexPrepared → promotion (:360 area); fingerprint validation ordering lives against this lifecycle.
- **Validation (`lib/validation/spec-doc-structure.ts`)**: canonical `buildContinuityFingerprint` (:580) and POST_SAVE_FINGERPRINT rule (:1105).
- **Search pipeline (`lib/search/hybrid-search.ts`)**: result-time dedup key (:949) for the belt-and-braces collapse.

### Data Flow
Content enters via `memory_save` → parsed (frontmatter + `contentHash`) → preflight exact-dup → quality gate Layer-3 dedup → PE gate (findSimilarMemories candidates → UPDATE/REINFORCE/SUPERSEDE/CREATE) → complement recheck inside the write transaction → atomic index (pending file → index → promote) → POST_SAVE_FINGERPRINT validation → save result. Hash normalization changes the identity used by every dedup lane; the dual-compare shim sits where stored hashes are compared to computed ones.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `computeContentHash` (memory-parser.ts:914, wraps `hashContentBody` @ content-id.ts:14) | Sole hash producer for parse-time identity; the wrapper is the single normalization point | update (normalize input inside the wrapper) | `rg -n "computeContentHash\|hashContentBody" .opencode/skills/system-spec-kit/mcp_server --type ts` — every caller inherits normalization; confirm no direct `createHash('sha256')` content-identity producer bypasses it |
| Stored `content_hash` comparisons (preflight, PE gate, quality gate, migration v28 lineage) | Consumers of the hash for equality checks | update (route every site through the shared `hashesMatch(content, storedHash)` dual-compare helper: legacy raw OR normalized) | Migration idempotency test + matrix rows for legacy-hash docs; `rg -n "hashesMatch" .opencode/skills/system-spec-kit/mcp_server --type ts` shows one helper, N call sites |
| `buildContinuityFingerprint` ×2 (memory-save.ts:1078 local; spec-doc-structure.ts:580 exported) | Two divergent producers of the continuity fingerprint | update (delete local, import canonical) | `rg -n "buildContinuityFingerprint" .opencode/skills/system-spec-kit --type ts` returns one definition, N imports |
| `findSimilarMemories` call sites (pe-orchestration.ts:66-67; quality gate memory-save.ts:2398; complement recheck :2618; preflight) | Candidate discovery feeding every dedup lane | update (exclusion params per lane contract) | `rg -n "findSimilarMemories\(" .opencode/skills/system-spec-kit/mcp_server --type ts` — audit each call's exclusions |
| POST_SAVE_FINGERPRINT rule + postSavePlan (spec-doc-structure.ts:1105; memory-save.ts:1803) | Post-save validator currently fed pre-promotion content | update (ordering/input) | `rg -n "POST_SAVE_FINGERPRINT\|postSavePlan" .opencode/skills/system-spec-kit/mcp_server --type ts` |
| Canonical writer dispatch (memory-save.ts:3200 `shouldPlanCanonicalSave`) | Excludes full-auto from canonical planning | update (full-auto dispatches canonical writer) | Parity tests T511+ un-skipped (memory-save-integration.vitest.ts:526) |
| `retirePredecessorForActiveReindex` / retire-carry / recon conflict lanes (memory-save.ts) | Predecessor retirement + successor stamping | update (ordering; stop deprecated re-stamp) | `rg -n "retirePredecessor\|'deprecated'" .opencode/skills/system-spec-kit/mcp_server/handlers --type ts` |
| Result dedup key (hybrid-search.ts:949 `canonicalResultId`) | Row-id-only collapse at fusion time | update (canonical path identity, keep best) | `rg -n "canonicalResultId" .opencode/skills/system-spec-kit/mcp_server --type ts` + pipeline test |
| Content-router Tier-1 transcript-wrapper (content-router.ts:410-414 `tier1.transcript.wrapper`, category `drop`) | Substring-matches `assistant:`/`user:`/`tool:` anywhere in normalized text, silently dropping legitimate save/index chunks | update (anchor cues to line-start `^\s*(user|assistant|tool):` or require ≥2 speaker turns) | Fixture: mid-line mention survives, real transcript still drops; `rg -n "tier1.transcript.wrapper" .opencode/skills/system-spec-kit/mcp_server --type ts` |
| Tests mocking `findSimilarMemories` (pe-orchestration.vitest.ts, pe-gating.vitest.ts, handler-memory-save.vitest.ts, memory-save-integration.vitest.ts) | Mask same-path candidates today | update (same-path fixtures; un-skip parity) | `rg -n "findSimilarMemories" .opencode/skills/system-spec-kit/mcp_server/tests` |
| Downstream channels/stats reading `tier='deprecated'` rows | Observers of churn volume | unchanged (phase 002 owns exclusion predicates) | Note in checklist; no predicate edits here |
| Chunked-doc identity (parent/child rows) | Distinct rows sharing a path | unchanged (collapse excludes chunk children) | Pipeline test with chunk fixtures |

Required inventories:
- Same-class producers: `rg -n "createHash\('sha256'\)|sha256" .opencode/skills/system-spec-kit/mcp_server/lib/parsing .opencode/skills/system-spec-kit/mcp_server/handlers/save --type ts` (confirm no second content-hash producer bypasses normalization; the sweep of lib/parsing + handlers/save returns no direct producer — the sole sha256 primitive lives one level up in `lib/content-id.ts:14` `hashContentBody`, wrapped by `computeContentHash`).
- Consumers of changed symbols: `rg -n "computeContentHash|buildContinuityFingerprint|canonicalResultId|excludeFilePath|excludeCanonicalFilePath" .opencode/skills/system-spec-kit --type ts --type js -g '!dist' -g '!node_modules'`.
- Matrix axes (independent input axes): save mode {planner-first, full-auto} × content change {none, whitespace/CRLF-only, continuity-stamp-only, semantic edit} × reconsolidation {on, off} × force {true, false} × predecessor state {active, deprecated, tombstoned, none}. Full cross = 128; required rows = 16 pairwise-selected covering every axis value plus the four named regression scenarios (#2, #21, #22, #26).
- Algorithm invariant: `normalize(content)` is stable under CRLF/trailing-whitespace mutation and under `_memory.continuity` fingerprint/timestamp churn, and touches nothing outside the frontmatter continuity block. Adversarial cases: CRLF inside fenced code blocks; a fingerprint-shaped line in body text (must not be zeroed); frontmatter without a continuity block; empty content; a doc whose only change is a reordered continuity key.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm + Baseline (gate for everything)
- [ ] T001 confirm-before-fix probes for every 🟡 finding (finding-is-a-hypothesis)
- [ ] T002 vitest full-gate baseline + live save-behavior probes captured
- [ ] T003 affected-surfaces rg inventories recorded in scratch/

### Phase 2: Core Implementation
- [ ] Hash normalization + dual-compare migration (T004-T005, REQ-001)
- [ ] Fingerprint builder unification (T006, REQ-004)
- [ ] PE lanes + SUPERSEDE guard + PE audit init (T007-T008, REQ-003/REQ-007)
- [ ] P0 canonical save ordering + dispatch (T009-T010, REQ-002)
- [ ] Dedup lane gating: complement, quality gate, preflight, recon conflict, retire-carry, rollback/mutex/BM25 batch (T011-T017, REQ-005/006/007/008)
- [ ] Result-time file-identity collapse (T018, REQ-009)
- [ ] Content-router Tier-1 transcript-wrapper line-start anchoring (T025, REQ-010)

### Phase 3: Verification
- [ ] Un-skip parity tests; fix findSimilarMemories-mocking tests (T019-T020)
- [ ] Matrix tests per the 16-row inventory (T021)
- [ ] Full vitest gate re-run + baseline delta report (T022)
- [ ] Live success gates SC-001..SC-005 (T023)
- [ ] Docs sync + `validate.sh --strict` (T024)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Baseline (MANDATORY, before any change) | Full `mcp_server` vitest gate: capture pass/fail/skip counts and the current `describe.skip` inventory; live probes of re-save behavior (unchanged file, timestamp-churn file) recorded as the starting numbers | vitest, node CLI probes |
| Unit | Hash normalization invariant + adversarial table (CRLF-in-fence, fingerprint-shaped body line, no continuity block, empty content); dual-compare equality; single fingerprint builder | vitest |
| Integration | Save matrix (16 pairwise rows): planner/full-auto × change type × recon × force × predecessor state; PE lane routing (UPDATE/REINFORCE reachable, cross-file SUPERSEDE blocked); atomic failure injection around the reordered fingerprint validation | vitest |
| Un-skip (explicit) | `memory-save-integration.vitest.ts:526` `describe.skip('planner-first and fallback parity')` — rewrite the stale assertions to the current planner-default contract (the skip note says the contract intentionally diverged), then remove the `.skip` and keep T511+ active as the REQ-002 regression net. Do NOT delete or weaken the parity claims to make them pass | vitest |
| Mock hygiene | pe-orchestration.vitest.ts, pe-gating.vitest.ts, handler-memory-save.vitest.ts: replace `findSimilarMemories` mocks that omit same-path candidates with fixtures that include them, so #26 cannot regress silently | vitest |
| Delta (MANDATORY, after changes) | Re-run the WHOLE vitest gate; report pass/fail/skip delta against the T002 baseline — no "no regressions" claim without both numbers | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 shared active-row predicate | Internal (program) | Yellow (002 planned, not merged) | Retire/tombstone visibility lands behind a locally-scoped predicate matching 002's signature; reconcile when 002 merges |
| Phase 001 dup-collapse ordering | Internal (program) | Yellow (001 runs before 003) | 001's "one active row per logical key" is not durable until 003 stops the churn; between 001 and 003, timestamp/CRLF re-saves keep minting deprecated snapshots (bounded by re-save rate) — treat 001's collapsed state as transient |
| Migration registry (`vector-index-schema.ts`) | Internal | Green | Dual-compare shim ships read-side only until a migration slot is available |
| vitest + fixture DBs (`mcp_server/tests`) | Internal | Green | Matrix rows fall back to in-memory DB fixtures |
| better-sqlite3 / sqlite-vec native modules | External | Green | Only affects live probes, not unit coverage |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Save-path regressions (new E088/E-class aborts, parity tests red, atomic rollback failures), dedup misses creating duplicate active rows, or baseline delta showing regressions that cannot be fixed forward within the phase.
- **Procedure**: `git revert` the phase commits (code-only change set). The dual-compare migration is read-side and non-destructive, so no data repair is needed; legacy raw hashes remain valid throughout.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm + Baseline) ──► Phase 2 (Core Implementation) ──► Phase 3 (Verification)
        T001-T003                        T004-T018                        T019-T024
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Confirm + Baseline | None | Core Implementation |
| Core Implementation | Confirm + Baseline (🟡 findings confirmed; baseline numbers captured) | Verification |
| Verification | Core Implementation | Phase close-out |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Confirm + Baseline | Low | 2-3 hours |
| Core Implementation | High | 10-16 hours |
| Verification | Medium | 4-6 hours |
| **Total** | | **16-25 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] T002 baseline captured (vitest counts + live save probes) — the rollback comparison point
- [ ] Dual-compare confirmed read-side only (no stored-hash rewrites)
- [ ] Parity/matrix tests green before merge

### Rollback Procedure
1. `git revert` the phase commit range (or drop the branch commits before merge).
2. Rebuild dist (`npm run build` in `mcp_server`) so the daemon serves reverted behavior.
3. Re-run the vitest gate and the two live probes (unchanged re-save, timestamp-churn re-save) to confirm pre-phase behavior.
4. Note the rollback and its cause in implementation-summary.md.

### Data Reversal
- **Has data migrations?** Yes, but non-destructive: the dual-compare migration adds comparison behavior only and rewrites no stored hashes.
- **Reversal procedure**: Revert code; stored `content_hash` values were never mutated, so no data repair is required.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌────────────────────┐     ┌─────────────────────────┐     ┌────────────────────┐
│ T001-T003          │────►│ T004-T005 hash+migration │────►│ T011-T017 lanes    │
│ confirm + baseline │     │ T006 fingerprint unify   │     │ T018 collapse      │
└────────────────────┘     │ T007-T008 PE lanes       │     └─────────┬──────────┘
                           │ T009-T010 canonical P0   │               │
                           └────────────┬─────────────┘         ┌─────▼──────────┐
                                        │                       │ T019-T024      │
                                        └──────────────────────►│ verification   │
                                                                └────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Hash normalization (T004-T005) | T001-T003 | Stable content identity | All dedup-lane assertions |
| Fingerprint unify (T006) | T001 | One canonical builder | REQ-002 fingerprint input |
| PE lanes (T007-T008) | T001-T003 | Reachable UPDATE/REINFORCE | SC-002, T020-T021 |
| Canonical save P0 (T009-T010) | T006 | Non-self-rejecting full-auto | T019 parity un-skip |
| Lane gating (T011-T017) | T004-T005 | Benign unchanged/self-dup handling | SC-001, SC-003 |
| Identity collapse (T018) | none (parallel) | One row per canonical path | SC-004 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **T001-T002 confirm + baseline** - 2-3 hours - CRITICAL
2. **T004-T005 hash normalization + dual-compare** - 4-6 hours - CRITICAL
3. **T009-T010 canonical save P0** - 3-4 hours - CRITICAL
4. **T019/T021-T022 parity un-skip + matrix + delta** - 3-4 hours - CRITICAL

**Total Critical Path**: 12-17 hours

**Parallel Opportunities**:
- T018 (pipeline collapse) and T006 (fingerprint unify) can run alongside T004-T005
- T020 (mock hygiene) can run alongside T011-T017
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Findings confirmed, baseline captured | Every 🟡 item verified against live code; vitest + probe numbers recorded | End of Phase 1 |
| M2 | Churn source killed | Timestamp-churn re-save produces no supersede (SC-003); dual-compare tests green | Mid Phase 2 |
| M3 | All dedup lanes routed correctly | SC-001/SC-002/SC-005 pass; parity tests un-skipped and green | End of Phase 2 / Phase 3 |
| M4 | Phase close-out | Baseline delta clean; checklist evidenced; `validate.sh --strict` exit 0 | End of Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR summary (full records in decision-record.md)

**ADR-001**: Normalize content-hash input at the parser with a dual-compare migration - Accepted.

**ADR-002**: Open PE UPDATE/REINFORCE lanes at the orchestration call site; keep and extend the canonical-path guard to SUPERSEDE - Accepted.

**ADR-003**: Validate POST_SAVE_FINGERPRINT against promoted/pending content and make the apply follow-up dispatch the canonical writer for full-auto - Accepted.

---

## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Read spec.md, this plan, tasks.md, and the three research sources before touching code
- [ ] T001 confirm-before-fix probes complete for every 🟡 finding named in the task
- [ ] T002 baseline numbers captured and stored before the first code change
- [ ] Scope check: only files listed in spec.md "Files to Change" are writable

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute tasks in order T001 → T024; T025 is a Phase-2 implementation task (content-router) that runs with T011-T018 despite its trailing number; Phase 2 tasks must not start before T001/T002 complete |
| TASK-SCOPE | One task per change set; no adjacent-code cleanup; finding IDs stay out of code comments |
| TASK-EVIDENCE | Every completed task records file:line evidence or a test name in tasks.md/checklist.md |
| TASK-VERIFY | `npm run build` + targeted vitest must pass before marking any implementation task `[x]` |

### Status Reporting Format
Report per task: `T### | status (done/blocked/in-progress) | evidence (test name or file:line) | baseline delta if tests ran`.

### Blocked Task Protocol
Mark the task `[B]` with the blocking reason in tasks.md, halt dependent tasks, and escalate per the Logic-Sync protocol if implementation evidence contradicts this plan (amendment decision, not a silent workaround). BLOCKED tasks never get skipped silently.

---

<!--
LEVEL 3 PLAN
- Core + L2 + L3 addendums
-->
