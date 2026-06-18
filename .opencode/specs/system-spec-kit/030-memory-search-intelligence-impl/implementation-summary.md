---
title: "Implementation Summary: Memory Search Intelligence Wave-0 closeout"
description: "Closeout summary for packet 030: 11 Wave-0 candidates shipped, 2 candidates deferred with evidence, touched-subsystem verification completed, and Level-3 packet docs authored."
trigger_phrases:
  - "implementation summary memory search intelligence wave 0"
  - "030 wave 0 closeout"
  - "memory search intelligence shipped deferred"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/030-memory-search-intelligence-impl"
    last_updated_at: "2026-06-18T23:20:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Closed Wave-0 implementation packet."
    next_safe_action: "Create Wave-1 packet for Candidate 6 and Candidate 11 if prioritized."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-18-wave-0-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | system-spec-kit/030-memory-search-intelligence-impl |
| **Completed** | 2026-06-18 |
| **Level** | 3 |
| **Scope** | Wave-0 implementation closeout |
| **Branch** | system-speckit/028-memory-search-intelligence |
| **HEAD** | `e21caf5de6` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Wave-0 shipped 11 small retrieval-system improvements without a schema migration. The packet improves graceful fallback, deterministic ranking, content identity, health visibility, causal cleanup, protected writes, Deep Loop fanout behavior, and Code Graph impact ranking. Two candidate ideas were deliberately not shipped because tests and live data showed they were not safe Wave-0 changes.

### Shipped Candidates

| # | Candidate | Commit | Result |
|---|-----------|--------|--------|
| 1 | Q6-anchor FIX | `738e118751` | Added the 7 reducer-required strategy anchor pairs. |
| 2 | C9 embedder-degrade | `484b77b589` | Embedder unavailable now degrades to lexical search with `embedder_available:false`; typed Stage 1 input validation remains in scope. |
| 3 | ANN tie-stable ORDER BY | `bec0eed27f` | Added deterministic ID tiebreaks to ranked vector queries. |
| 4 | C5-B content-derived tiebreak | `bec0eed27f` | Added content-hash deterministic tiebreaking in comparator and RRF output sorts. |
| 5 | C-X1 plus C6-A | `65cfcea513` | Added `bonusOverChannels` option and pure rank-time decay clock while preserving default behavior. |
| 7 | Content-id module | `18c8582e33` | Centralized SHA-256 body and canonical JSON hashing with byte-identical parity. |
| 8 | Enrichment gauges | `e1c6a3c793` | Exposed pending and failed background-enrichment gauges. |
| 9 | Skip closed in sweep | `e1c6a3c793` | Cleanup skips already-invalidated generated causal edges. |
| 10 | Constitutional CAS guard | `e1c6a3c793` | Rejects protection-removing edits and stale `expectedHash` writes. |
| 12 | Deep-Loop trio plus graceful-self-stop | `46812f12a8` | Added deterministic fanout merge ordering, fanout pool gauges, graceful stop summary, and empty-tick convergence. |
| 13 | Code-Graph Q4-C1 | `e21caf5de6` | Added RRF-additive rank-time trust in impact context while preserving neutral peer order. |

### Deferred Candidates

| # | Candidate | Wave-1 Path | Evidence |
|---|-----------|-------------|----------|
| 6 | C4-A idempotency default-on | Scope save/update path behavior before default flip | Default-on regression breaks 11 `handleMemoryUpdate` tests. |
| 11 | M-system-kind-exclusion | Build true substrate signal plus constitutional/spec-doc short-circuit | Live DB review found 9,592 `source_kind='system'` spec-doc rows including 29 constitutional rules. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work landed as scoped candidate commits on `system-speckit/028-memory-search-intelligence`. Candidate implementation followed a tight loop: read the seam, patch only that seam, add focused tests, run candidate verification, request opus review for higher-risk changes, then commit the candidate or batch.

The closeout did not regenerate `description.json` or `graph-metadata.json`; the user explicitly reserved those files for a separate regeneration path. The stale 8-11 companion docs were replaced with Level-3 docs covering all shipped and deferred candidates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:arch-decisions -->
## Architecture Decisions Summary

| ADR | Decision | Status | Impact |
|-----|----------|--------|--------|
| ADR-001 | Ship only Wave-0-ready candidates | Accepted | Keeps packet scoped to additive, reversible changes. |
| ADR-002 | Drop Candidate 6 from Wave-0 | Accepted | Prevents known `memory_update` regression. |
| ADR-003 | Drop Candidate 11 from Wave-0 | Accepted | Prevents hiding canonical spec docs and constitutional rules. |
| ADR-004 | Preserve byte-identical defaults | Accepted | Allows ranking seams without unmeasured default drift. |
| ADR-005 | Keep C9 input-validation expansion in scope | Accepted | Keeps reviewed Stage 1 validation behavior local to the touched seam. |
<!-- /ANCHOR:arch-decisions -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat packet 028 as research input only | Implementation needed its own packet, verification, and commit trail. |
| Ship 11 candidates, not all 13 | Candidate 6 and Candidate 11 had concrete evidence against safe Wave-0 shipment. |
| Keep defaults byte-identical where adding knobs | Retrieval order regressions are easy to create and hard to notice without parity tests. |
| Defer Q4-C1 magnitude tuning | Neutral-order preservation was verified; relevance magnitude still needs benchmark data. |
| Preserve metadata JSON files | User requested `description.json` and `graph-metadata.json` be kept for separate regeneration. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Subsystem | Command | Result |
|-----------|---------|--------|
| Memory MCP | `npm run typecheck` | PASS, exit 0 |
| Memory MCP | `npm run build` | PASS, exit 0 |
| Memory MCP broad suite | `npx vitest run` | FAIL/HANG in broad historical areas; no reliable final total because the run stopped emitting output in launcher/IPC tests and could not be killed by process enumeration in the sandbox |
| Memory MCP touched suite | `npx vitest run` with search, CRUD, fusion, decay, idempotency, causal, health, and formatter tests | PASS: 23 files, 666 passed, 23 skipped |
| Memory MCP baseline classification | `git archive 1ecc531431` baseline with representative failure files | PRE-EXISTING: adaptive-ranking schema drift, flag/env docs drift, dist-freshness in unbuilt archive, launcher lease failures, reconsolidation/source_kind fixture drift, index cooldown, modularization, and related broad-suite failures reproduced on baseline |
| Code Graph | `npm run typecheck` | PASS, exit 0 |
| Code Graph | `npm run build` | PASS, exit 0 |
| Code Graph ranking/impact | `npx vitest run` focused context/query/budget/resolver/verify tests | PASS: 5 files, 80 passed |
| Deep Loop | `node --check scripts/fanout-merge.cjs scripts/fanout-pool.cjs scripts/fanout-run.cjs` | PASS, exit 0 |
| Deep Loop fanout | `npx vitest run tests/unit/fanout-*.vitest.ts` | PASS: 4 files, 58 passed |
| Packet docs | `validate.sh --strict` | PASS, exit 0 with 0 errors and 0 warnings |

### Commands

```bash
cd .opencode/skills/system-spec-kit/mcp_server
npm run typecheck
npm run build
npx vitest run
npx vitest run mcp_server/tests/stage1-embedder-degrade.vitest.ts mcp_server/tests/hybrid-search.vitest.ts mcp_server/tests/hybrid-search-flags.vitest.ts mcp_server/tests/rrf-fusion.vitest.ts mcp_server/tests/unit-rrf-fusion.vitest.ts mcp_server/tests/stage2-fusion.vitest.ts mcp_server/tests/attention-decay.vitest.ts mcp_server/tests/hybrid-decay-policy.vitest.ts mcp_server/tests/fsrs-hybrid-decay.vitest.ts mcp_server/tests/memory-idempotency-and-near-duplicate.vitest.ts mcp_server/tests/handler-memory-crud.vitest.ts mcp_server/tests/memory-crud-extended.vitest.ts mcp_server/tests/memory-crud-update-constitutional-guard.vitest.ts mcp_server/tests/content-hash-dedup.vitest.ts mcp_server/tests/search-results-format.vitest.ts mcp_server/tests/handler-memory-search.vitest.ts mcp_server/tests/handler-memory-health-edge.vitest.ts mcp_server/tests/frontmatter-promoter.vitest.ts mcp_server/tests/causal-edge-tombstones.vitest.ts mcp_server/tests/causal-edges-unit.vitest.ts mcp_server/tests/causal-edges-write-safety.vitest.ts mcp_server/tests/causal-fixes.vitest.ts mcp_server/tests/integration-causal-graph.vitest.ts

cd .opencode/skills/system-code-graph
npm run typecheck
npm run build
npx vitest run .opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-handler.vitest.ts .opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts .opencode/skills/system-code-graph/mcp_server/tests/budget-allocator.vitest.ts .opencode/skills/system-code-graph/mcp_server/tests/code-graph-resolve-subject-typed.vitest.ts .opencode/skills/system-code-graph/mcp_server/tests/code-graph-verify.vitest.ts

cd .opencode/skills/deep-loop-runtime
for file in scripts/fanout-merge.cjs scripts/fanout-pool.cjs scripts/fanout-run.cjs; do node --check "$file"; done
npx vitest run tests/unit/fanout-merge.vitest.ts tests/unit/fanout-pool.vitest.ts tests/unit/fanout-run.vitest.ts tests/unit/fanout-salvage.vitest.ts

bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/030-memory-search-intelligence-impl --strict
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Memory MCP full broad suite is not green.** The broad run emitted many failures and stalled in the known IPC/launcher region. Representative baseline checks at `1ecc531431` reproduced the major failure classes, so this packet uses the touched-area composition suite as the reliable gate.
2. **Candidate 6 remains unshipped.** It needs Wave-1 save/update-path scoping before idempotency can default on.
3. **Candidate 11 remains unshipped.** It needs a real substrate signal and live-DB validation before default recall filtering.
4. **Q4-C1 boost magnitude is unbenchmarked.** Neutral order is verified; ranking magnitude tuning is a follow-up.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:risks-realized -->
## Risks Realized

| Risk | Occurred | Impact | Resolution |
|------|----------|--------|------------|
| Idempotency default flip regresses update path | Yes | Candidate 6 cannot ship in Wave-0 | Deferred to Wave-1+ |
| `source_kind='system'` is not substrate noise | Yes | Candidate 11 cheap filter would damage recall | Deferred to Wave-1 |
| Broad Memory MCP suite red from historical drift | Yes | Full-suite totals unavailable | Baseline representative failures and focused touched-suite pass recorded |
| Code Graph package path differs from prompt | Yes | `package.json` is at `.opencode/skills/system-code-graph` | Ran commands from actual package root |
| Stale 8-11 docs underrepresent packet | Yes | Packet docs would mislead resume and validation | Rewrote Level-3 docs for all candidates |
<!-- /ANCHOR:risks-realized -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Run Code Graph from `mcp_server` | Ran from `.opencode/skills/system-code-graph` | Actual package root contains `package.json`, `tsconfig.json`, and `vitest.config.ts`. |
| Report Memory MCP full-suite totals | Reported broad-suite failure/hang plus focused-suite totals | Full broad run stopped emitting output in IPC/launcher tests and process enumeration is blocked in this sandbox. |
| Keep old companion docs and patch sections | Replaced docs from template structure | Old docs covered only Candidates 8-11 and were no longer truthful. |
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:follow-up -->
## Follow-Up Items

- [ ] Benchmark Q4-C1 boost magnitude against a real Code Graph relevance set.
- [ ] Create Wave-1 work for Candidate 6 with save/update-path idempotency scoping and `handleMemoryUpdate` regression gates.
- [ ] Create Wave-1 work for Candidate 11 with true substrate signal, constitutional/spec-doc short-circuit, and live-DB validation.
- [ ] Address pre-existing Memory MCP broad-suite failures outside packet 030.
<!-- /ANCHOR:follow-up -->
