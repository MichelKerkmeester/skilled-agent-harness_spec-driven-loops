---
title: "Feature Specification: 002 Deep-Review Remediation for 012 Causal Graph Channel Routing"
description: "Close 3 P1 and 39 P2 findings from the 2026-05-11 10-iteration deep review (cli-opencode + deepseek/deepseek-v4-pro) of 012/001-initial-delivery. Tier-1 wires invalidateEntityDensityCache + fixes resource-map drift; Tier-2 ships ~19 code/test polish items; Tier-3 cleans graph-metadata.json + doc-staleness."
trigger_phrases:
  - "002-deep-review-remediation"
  - "012 deep-review remediation"
  - "P1-C-001 cache wiring"
  - "entity-density cache invalidation hooks"
  - "resource-map drift fix 012"
  - "012 P2 polish"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation"
    last_updated_at: "2026-05-11T10:35:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 remediation spec"
    next_safe_action: "Track final closure in implementation-summary.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/routing-telemetry.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-deep-review-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should P1-001 (redundant classifyIntent) stay downgraded to P2 or be re-raised to P1 once the perf cost is measured under burst load?"
      - "Should env-flag parsing (ADV-001) treat '1'/'true'/'yes'/'on' as the ONLY enabled values, or also accept 'TRUE'/'YES' (current behavior)?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 002 Deep-Review Remediation for 012 Causal Graph Channel Routing

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

This packet closes all P1 and P2 findings from the 012/001 deep review. Final target state: P0=0, P1=0, P2=0.

## 1. METADATA

Canonical metadata lives in the anchored metadata table below.

## 2. PROBLEM & PURPOSE

The 012/001 delivery needed post-review remediation before the phase parent could move to clean PASS.

## 3. SCOPE

Scope covers cache invalidation wiring, code/test polish, traceability docs, metadata cleanup, and T4 template closure.

## 4. REQUIREMENTS

Requirements are tracked in the anchored requirements table below.

## 5. SUCCESS CRITERIA

Success requires all findings CLOSED plus strict validation and targeted tests passing.

## 6. RISKS & DEPENDENCIES

Primary risks were stale cache behavior, env-flag ambiguity, and doc drift.

## 7. NON-FUNCTIONAL REQUIREMENTS

Non-functional constraints cover performance, observability, compatibility, and telemetry stability.

## 8. EDGE CASES

Edge cases cover partial bulk-delete invalidation, legacy env values, warn-once behavior, telemetry fallback, and changelog verification.

## 9. COMPLEXITY ASSESSMENT

The packet remains Level 3 because it coordinates source, tests, docs, and metadata across 21 batches.

## 10. RISK MATRIX

| Risk | Final Handling |
|------|----------------|
| Stale entity-density cache | Closed by post-commit invalidation wiring and integration tests. |
| Env flag ambiguity | Closed by explicit boolean parsing and tests. |
| Spec-doc drift | Closed by T4 template and synthesis pass. |

## 11. USER STORIES

- As an operator, I can trust entity-density scoring after write commits.
- As a reviewer, I can trace every finding to CLOSED evidence.
- As a maintainer, I can resume the packet from canonical continuity metadata.

## 12. OPEN QUESTIONS

No open questions remain after T4 synthesis.

## RELATED DOCUMENTS

- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `implementation-summary.md`

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 (release-readiness for 012 parent) |
| **Status** | Draft |
| **Created** | 2026-05-11 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (phase parent: 012) |
| **Predecessor** | `001-initial-delivery` |
| **Successor** | None planned |
| **Executor** | cli-codex `gpt-5.5` reasoning=high service_tier=fast |
| **Source of Findings** | `001-initial-delivery/review/review-report.md` (10-iteration deep review, 2026-05-11, cli-opencode + deepseek/deepseek-v4-pro) |
| **Handoff Criteria** | All P1 findings RESOLVED with file:line evidence; all P2 findings either RESOLVED or explicitly accepted in `implementation-summary.md`; `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` exits 0; `npm run build` exits 0; full vitest regresses 0 tests vs pre-002 baseline. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Phase 002 of the 012 phase parent. 001 shipped the channel-routing override on 2026-05-08 and was deep-reviewed on 2026-05-11; verdict was CONDITIONAL with 0 P0, 3 P1, 39 P2 findings. This phase closes all of them.

**Scope Boundary:** Modify only the surfaces named below. Do NOT redesign the routing override, the channel-selector algorithm, or the causal-edge creation pathways. Doc/test/metadata-only changes are in scope when they close a finding.

**Dependencies:**
- The full deep-review packet at `../001-initial-delivery/review/` is the source of truth.
- All 4 implementation files from 001 are still in their original locations (no moves).

**Deliverables:** see §3 SCOPE and §4 REQUIREMENTS below.

**Changelog:** create `changelog.md` at packet completion.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## PROBLEM & PURPOSE

### Problem Statement

The 2026-05-11 deep review of `001-initial-delivery` produced a CONDITIONAL verdict because of two release-blocking P1s and 39 P2 polish items. Specifically:

- **P1-C-001:** `invalidateEntityDensityCache()` is exported but never wired into `memory_save` or `memory_bulk_delete` commit hooks. The entity-density signal can sit stale for the 60s TTL after row mutations, weakening REQ-003 in burst-write scenarios.
- **P1-002:** `001-initial-delivery/resource-map.md:55` points to playbook `210-...` but the actual file is `272-routing-telemetry-and-graph-channel-invocation.md`.
- **P1-003:** `001-initial-delivery/resource-map.md:73` changelog entry may be missing on disk (flagged "likely OBE" — verify).

The 39 P2 findings cluster across docs (12), maintainability (8), reliability (5), defensive (5), tests (5), env-flag/security (3), perf (1, downgraded), metadata (1). None are correctness-blocking individually, but cumulatively they degrade trust in the resource-map, leave defensive coding gaps, and let cosmetic doc drift accumulate.

### Purpose

Close every P1 and P2 finding so the 012 phase parent moves from CONDITIONAL to clean PASS, the resource-map and feature catalog accurately reflect the shipped code, and downstream search-decision navigation works end-to-end.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## SCOPE

### In Scope (Tier 1 — Release Blockers)

- **Cache wiring:** call `invalidateEntityDensityCache()` from the post-commit branches of `memory-save.ts` (single-row save) and `memory-bulk-delete.ts` (bulk delete). Add one integration test asserting that the entity-density score reflects a row delete without waiting for TTL.
- **Resource-map cleanup:** in `001-initial-delivery/resource-map.md`, fix playbook path 210 → 272 (P1-002); verify/resolve changelog row (P1-003); add missing `routing-telemetry-stress.vitest.ts` row (P2-015); add `scratch/live-smoke-results.md` + `scratch/stress-test-results.md` rows (P2-TR-002); fix Skills 8/9 and total 18/19 count mismatch (P2-TR-005).

### In Scope (Tier 2 — Code / Test Polish)

Entity-density module:
- Preserve cached state on transient build failures (P2-008, P2-C-001, ADV-003).
- Document concurrency assumption (P2-010 — Node single-threaded; no guard needed but state the invariant).
- Add explicit upper-bound size guard or comment for cache size (S7-001).
- Tighten `parseTriggerPhrases` fallback documentation (P2-021).
- Add a test for rebuild failure after successful cache population (P2-C-002).
- Make `invalidateEntityDensityCache` module-private OR document the public-export rationale (P2-011).
- Add runtime shape validation (or documented unsafe-cast comment) on `HighDegreeRow[]` (F10-004).

Query-router / routing-telemetry:
- Either deduplicate `ChannelName` to a shared module OR keep the duplication with a typed reference comment (P2-001).
- Decide: rename `recordInvocation` impl docs to "rolling window" OR refactor to true ring buffer (P2-002).
- Make `shouldPreserveGraph` either module-private OR add an internal flag check (P2-003).
- Wrap `getRoutingTelemetrySnapshot()` in try/catch in `memory-crud-health.ts:626` with a zero-value fallback (P2-004).
- Fix `routingReasons` BM25 label so it does NOT use authority-artifact (P2-009).
- Bound `routingReasons` string length on disk persistence (P2-012).
- Surface `safeGetDb` error class via `warn-once` instrumentation (P2-013).
- Pass pre-computed intent into `shouldPreserveBm25` / `shouldPreserveGraph` to remove redundant `classifyIntent` calls (P1-001 / downgraded).
- Add JSDoc to all exported helpers: `getSnapshot` (P2-017), `shouldPreserveBm25` (P2-018), `isGraphChannelPreservationEnabled` (P2-019); refresh module header on `query-router.ts` to mention preservation overrides (P2-020).
- Tighten env-flag parsing: treat `"0"`, `"no"`, `"off"`, `""` as DISABLED, not enabled (ADV-001).
- Remove redundant `[...new Set(channels)]` after upstream `enforceMinimumChannels` dedup (F10-005).
- Wire or remove the unused `withFeatureFlag` helper in `query-router.vitest.ts` (ADV-002).
- Dedup the env-flag constant in `query-router.vitest.ts` (P2-022).
- Extract `setEnv`/`restoreEnv` test helpers to a shared module (P2-023).

Docs/traceability:
- Fix all stale line numbers and missing references in `001-initial-delivery/`:
  - `implementation-summary.md` test-count consistency 27 vs 15 vs 25 (P2-TR-001).
  - `scratch/live-smoke-results.md` shouldPreserveGraph line ref 167-189 → 183-205 (P2-TR-003).
  - `feature_catalog/12-graph-channel-preservation.md` line refs + add `routing-telemetry-stress.vitest.ts` to validation table (P2-016, P2-TR-004).
  - `playbooks/272-routing-telemetry-and-graph-channel-invocation.md` expected rate 0.6 → 0.4 with classifier-mix note (P2-14).
  - `spec.md` Status field `Draft` → `Shipped` (F10-001).
  - `plan.md` Definition-of-Done checkboxes update (F10-002).
  - `handover.md` completion_pct 95 → 100 (F10-003).
  - `implementation-summary.md` Q2 (rate band) full answer (P2-TR-006).
  - `checklist.md:142` CHK-052 evidence enumeration include `routing-telemetry-stress.vitest.ts` (P2-TR-007).

### In Scope (Tier 3 — Metadata)

- Dedup `001-initial-delivery/graph-metadata.json` `derived.key_files` duplicate entries with different path prefixes (F10-006).

### Out of Scope

- Redesigning the routing-override algorithm.
- Changing the channel-selector tier classification.
- Reweighting `causal_boost.ts`.
- Live re-baseline of `graphChannelInvocationRate`.
- Any change to the 001 implementation files' contracts (`shouldPreserveGraph`/`shouldPreserveBm25`/`getEntityDensityScore` signatures stay stable).
- Reopening the deep-review session — these findings ARE the source of truth.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/handlers/memory-save.ts` | Modify | Call `invalidateEntityDensityCache()` post-commit (P1-C-001) |
| `mcp_server/handlers/memory-bulk-delete.ts` | Modify | Call `invalidateEntityDensityCache()` post-commit (P1-C-001) |
| `mcp_server/lib/search/entity-density.ts` | Modify | Preserve cached state on transient failures; document concurrency invariant; size-bound; runtime shape validation; access-control note (P2-008/010/011, P2-C-001, ADV-003, F10-004, S7-001, P2-021) |
| `mcp_server/lib/search/query-router.ts` | Modify | Pass pre-computed intent; flag self-gate; JSDoc; module header; env-flag tightening; routingReasons BM25 label; safeGetDb warn-once (P1-001, P2-003/004/009/012/013, P2-018/019/020, ADV-001) |
| `mcp_server/lib/search/routing-telemetry.ts` | Modify | ChannelName dedup decision; ring-buffer rename or refactor; JSDoc on getSnapshot; remove redundant Set dedup (P2-001/002/017, F10-005) |
| `mcp_server/handlers/memory-crud-health.ts` | Modify | try/catch + zero fallback around getRoutingTelemetrySnapshot (P2-004) |
| `mcp_server/tests/entity-density.vitest.ts` | Modify | Add rebuild-after-success-failure test (P2-C-002) |
| `mcp_server/tests/query-router.vitest.ts` | Modify | Dedup env-flag constant; use withFeatureFlag OR remove it (P2-022, ADV-002) |
| `mcp_server/tests/routing-telemetry-stress.vitest.ts` | Modify | Use shared setEnv/restoreEnv helpers (P2-023) |
| `mcp_server/tests/__helpers__/test-env.ts` (new) | Create | Shared `setEnv`/`restoreEnv` helpers (P2-023) |
| `mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts` (new) | Create | Integration test for P1-C-001 |
| `001-initial-delivery/resource-map.md` | Modify | Fix playbook path 210→272; verify changelog row; add 3 missing rows; fix count mismatch (P1-002/003, P2-015, P2-TR-002, P2-TR-005) |
| `001-initial-delivery/implementation-summary.md` | Modify | Test-count consistency; Q2 full answer (P2-TR-001, P2-TR-006) |
| `001-initial-delivery/spec.md` | Modify | Status field Draft→Shipped (F10-001) |
| `001-initial-delivery/plan.md` | Modify | DoD checkboxes update (F10-002) |
| `001-initial-delivery/handover.md` | Modify | completion_pct 95→100 (F10-003) |
| `001-initial-delivery/checklist.md` | Modify | CHK-052 evidence (P2-TR-007) |
| `001-initial-delivery/scratch/live-smoke-results.md` | Modify | Line ref 167-189→183-205 (P2-TR-003) |
| `001-initial-delivery/graph-metadata.json` | Modify | Dedup key_files entries (F10-006) |
| `feature_catalog/12-graph-channel-preservation.md` | Modify | Line refs + validation table (P2-016, P2-TR-004) |
| `playbooks/272-routing-telemetry-and-graph-channel-invocation.md` | Modify | Rate 0.6→0.4 with classifier note (P2-14) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-T1-001 | `invalidateEntityDensityCache()` is called from `memory-save.ts` after a successful single-row save (P1-C-001) | Unit/integration test: save a row, call `getEntityDensityScore` once (warm cache), update the row's trigger-phrase / increase its causal-edge count, call again — score reflects new state WITHOUT waiting for 60s TTL. |
| REQ-T1-002 | `invalidateEntityDensityCache()` is called from `memory-bulk-delete.ts` after a successful bulk delete (P1-C-001) | Integration test: seed N high-degree rows, score reflects N. Bulk-delete some. Score reflects remaining count without TTL wait. |
| REQ-T1-003 | `001-initial-delivery/resource-map.md:55` playbook path is corrected (P1-002) | `rg -n '272-routing-telemetry-and-graph-channel-invocation' 001-initial-delivery/resource-map.md` finds row 55; no remaining `210-graph-channel-utilization` references in the file. |
| REQ-T1-004 | `001-initial-delivery/resource-map.md:73` changelog row is resolved (P1-003) | Either (a) the referenced changelog file exists on disk AND the row's status reads `OK`, OR (b) the changelog file is created from `001-initial-delivery/changelog.md` so the row reference resolves. |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-T2-001 | All Tier-2 code findings closed (19 items) | Each finding ID from §3 has either a closing diff (file:line evidence) OR an explicit accept entry in `implementation-summary.md` §Known Limitations with rationale. |
| REQ-T2-002 | All Tier-2 doc findings closed (16 items) | Each finding ID has a closing edit in the named file, verifiable by `git diff`. |
| REQ-T2-003 | Env-flag parsing tightened (ADV-001) | New unit test asserts `"0"`, `"no"`, `"off"`, `""`, `undefined` → DISABLED; `"1"`, `"true"`, `"yes"`, `"on"` (case-insensitive) → ENABLED. |
| REQ-T2-004 | No new test regressions | Full `npm run vitest` baseline before 002 (record passing count) ≤ count after 002. |
| REQ-T2-005 | `npm run build` exits 0 | `tsc --build` clean across the project. |

### P2 — Optional (track for future)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-T3-001 | `graph-metadata.json` key_files dedup (F10-006) | No duplicate paths (case-insensitive, prefix-normalized) in `derived.key_files`. |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## SUCCESS CRITERIA

- **SC-001:** All 3 P1 findings have a CLOSED status in `implementation-summary.md` with file:line evidence.
- **SC-002:** All 39 P2 findings have a CLOSED or ACCEPTED status in `implementation-summary.md`.
- **SC-003:** `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation --strict` exits 0.
- **SC-004:** `npm run build` exits 0; full vitest run regresses 0 tests vs pre-002 baseline; new tests added for REQ-T1-001/002 and REQ-T2-003.
- **SC-005:** A follow-up `/spec_kit:deep-review:auto` (or single-pass `@review` agent dispatch) reports `Verdict: PASS` with `hasAdvisories=false` (or hasAdvisories=true ONLY for accepted P2s).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `memory_save` / `memory_bulk_delete` is a hot path; adding a cache-invalidate call could add latency | Low | `invalidateEntityDensityCache()` is an in-process state mutation (~µs); call it AFTER commit so a failed save does not invalidate the cache |
| Risk | Tightening env-flag parsing (ADV-001) breaks consumers that set `SPECKIT_GRAPH_CHANNEL_PRESERVATION=0` expecting `enabled` | Low | Document the change in `changelog.md`; the existing default is ON, and "0" being treated as enabled was a bug, not a documented contract |
| Risk | Resource-map fixes (P1-002, P1-003, P2-015, P2-TR-002, P2-TR-005) touch the file deep-review found inconsistencies in; risk of new drift while editing | Low | Run `find 001-initial-delivery -type f | sort` and reconcile against resource-map.md row list before commit |
| Risk | cli-codex dispatches sometimes silently fail under heavy parallelism (per memory `feedback_cli_dispatch_unreliability.md`) | Med | Run one cli-codex dispatch at a time; verify each diff before moving to the next; do not run parallel dispatches |
| Dependency | The 001-initial-delivery code surface stays unchanged in signatures | Required | Spec-coupled by REQ-001..REQ-008 contract; do not change exported function shapes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## NON-FUNCTIONAL REQUIREMENTS

- **Performance:** post-commit invalidation latency adds ≤1 ms p99 to `memory_save` / `memory_bulk_delete`. Microbench in the new integration test verifies.
- **Observability:** every code change preserves existing `routingReasons` semantics; new behavior surfaces via existing `search-decisions.jsonl` channel.
- **Backward Compatibility:** all existing tests pass without modification (except the dedup work in P2-022/023 which is a test-internal refactor).
- **Telemetry:** no new telemetry endpoints; existing `memory_health.data.routing` block stays stable.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:complexity -->
## 7a. COMPLEXITY ASSESSMENT

| Dimension | Rating | Notes |
|-----------|--------|-------|
| **Code surface** | Low–Medium | ~250–350 LOC across 6 source files + 3 test files + 1 new helper. No new modules with novel logic. |
| **Cross-file coupling** | Medium | Cache wiring touches 2 handlers + 1 lib. Resource-map drift touches 5+ docs in `001-initial-delivery/`. |
| **Risk of regression** | Low | All changes are additive (new calls, new tests) or local refactors (JSDoc, helper extraction). The behavior contract from 001 is unchanged. |
| **Operational complexity** | Low | No new infra. |
| **Time-to-value** | Fast | ~1 day Tier 1, ½ day Tier 2 code, ½ day Tier 2 docs, 10 min Tier 3. |
| **Reversibility** | High | Each finding is independently revertable. Cache-wiring is one ~5-line patch per file. |

Overall complexity: **Medium-Low**. Warrants Level 3 (decision-record.md) only because the finding density across multiple files needs explicit sequencing rationale.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:edge-cases -->
## EDGE CASES

- **Cache invalidation after partially failed bulk delete:** if `memory_bulk_delete` partially fails (some rows deleted, some not), still invalidate the cache — TTL re-fetch will rebuild against actual DB state. Test seeds this case.
- **Env-flag legacy value:** if a user has `SPECKIT_GRAPH_CHANNEL_PRESERVATION=0` set, the override goes from "enabled" to "disabled" after ADV-001 fix. Changelog must document this. Default remains ON, so unset users see no behavior change.
- **`safeGetDb` returns null on warn-once path:** ensure the warn fires AT MOST once per process lifetime; do not spam the log.
- **`getRoutingTelemetrySnapshot` try/catch fallback:** the fallback `{ graphChannelInvocationRate: 0, channelInvocationRates: {...zeroed}, totalRecorded: 0, windowSize: WINDOW_SIZE }` must round-trip through the existing `memory_health.data.routing` schema.
- **Resource-map row 73 verification:** before writing, run `ls -la 001-initial-delivery/changelog/` to determine OBE vs missing-file before deciding which fix branch to take.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## OPEN QUESTIONS

- Should P1-001 (redundant `classifyIntent`) stay downgraded to P2 (perf advisory) or be re-raised to P1 once burst-load perf is measured? Default: ship the dedup fix and keep severity at P2.
- Should the new shared `test-env.ts` helper live at `mcp_server/tests/__helpers__/` or `mcp_server/tests/_helpers/`? Default: `__helpers__/` matches Jest/Vitest convention.
- Should the changelog row 73 fix branch (P1-003) verify by `ls` first OR always create the file regardless? Default: `ls` first; create only if missing.
<!-- /ANCHOR:questions -->

---

## EXECUTIVE SUMMARY

The 002 packet closes the 012/001 deep-review debt by resolving all P1 and P2 findings. The final state is P0=0, P1=0, P2=0.

## COMPLEXITY ASSESSMENT

The remediation remained Level 3 because it coordinated source, tests, resource maps, feature catalog entries, and packet metadata across 21 batches.

## RISK MATRIX

| Risk | Final Handling |
|------|----------------|
| Stale entity-density cache | Closed by post-commit invalidation wiring and integration tests. |
| Env flag ambiguity | Closed by explicit boolean parsing and tests. |
| Spec-doc drift | Closed by T4 template and synthesis pass. |

## USER STORIES

- As an operator, I can trust entity-density scoring after write commits.
- As a reviewer, I can trace every finding to CLOSED evidence.
- As a maintainer, I can resume the packet from canonical continuity metadata.

## RELATED DOCUMENTS

- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `implementation-summary.md`
