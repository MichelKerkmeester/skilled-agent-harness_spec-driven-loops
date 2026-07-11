# Deep Review Iteration 004 — Traceability Pass

**Dimension:** Traceability (core: spec_code + checklist_evidence; overlay: skill_agent, feature_catalog_code, playbook_capability)
**Iteration:** 4 of 10
**Date:** 2026-05-11
**Prior Findings:** P0=0 P1=1 P2=10

---

## Files Reviewed

| File | Lines Reviewed | Purpose |
|------|---------------|---------|
| `spec.md` | 1-234 (full) | REQ-001..REQ-008 source of truth |
| `checklist.md` | 1-166 (full) | CHK-001..CHK-053 evidence verification |
| `resource-map.md` | 1-85 (full) | On-disk existence cross-check |
| `implementation-summary.md` | 1-152 (full) | Supplemental traceability claims |
| `query-router.ts` | 1-396 (full) | REQ-001, REQ-002, REQ-008 implementation |
| `entity-density.ts` | 1-172 (full) | REQ-003, REQ-006 implementation |
| `routing-telemetry.ts` | 1-93 (full) | REQ-004 implementation |
| `memory-crud-health.ts` | 600-678 (routing block) | REQ-004 telemetry exposure |
| `query-plan.ts` | 40-115 (partial) | REQ-007 routingReasons pipeline |
| `search-decision-envelope.ts` | 44-105 (partial) | REQ-007 envelope→jsonl flow |
| `decision-audit.ts` | 33-59 (partial) | REQ-007 jsonl write path |
| `12-graph-channel-preservation.md` | 1-79 (full) | Feature-catalog traceability table |
| `03-health-diagnostics-memoryhealth.md` | 1-62 (full) | data.routing block documentation |
| `272-routing-telemetry-and-graph-channel-invocation.md` | 1-88 (full) | Playbook expected-rate claims |
| `routing-telemetry-stress.vitest.ts` | 1-275 (full) | REQ-005 stress test; resource-map gap |

---

## 1. Spec/Code Traceability (REQ-001..REQ-008)

Every REQ maps to concrete implementation `file:line`. No unverified claims.

| REQ | Summary | Implementation | Test Evidence |
|-----|---------|---------------|---------------|
| REQ-001 | shouldPreserveGraph returns true for find_decision/find_spec | `query-router.ts:191-195` (intent gate in shouldPreserveGraph) | `query-router.vitest.ts` 012-T1.1, 012-T1.2 |
| REQ-002 | selectedChannels includes graph regardless of tier | `query-router.ts:325-335` (graph preservation override branch in routeQuery) | `query-router.vitest.ts` 012-T2.1, 012-T2.2 |
| REQ-003 | entity-density ≥2 terms + ≥3 edges → graph+degree | `entity-density.ts:128-143` (getEntityDensityScore), `query-router.ts:197-202` (entity-density gate), `query-router.ts:85` (ENTITY_DENSITY_ACTIVATION_THRESHOLD=2), `entity-density.ts:20` (MIN_OUTGOING_EDGES=3) | `entity-density.vitest.ts` 012-ED-1.*, `query-router.vitest.ts` 012-T2.3 |
| REQ-004 | graphChannelInvocationRate in memory_health | `routing-telemetry.ts:50-74` (getSnapshot), `memory-crud-health.ts:626` (import+call), `memory-crud-health.ts:662-667` (data.routing block) | `query-router.vitest.ts` 012-T3.1 |
| REQ-005 | <5ms p99 routing latency | `routing-telemetry-stress.vitest.ts:133-160` (012-S2.1, 1000-iter burst); `query-router.vitest.ts` 012-T4.1 (200-iter) | Both P99 < 5ms |
| REQ-006 | cold-start safety (empty edges → entity-density inactive) | `entity-density.ts:95-116` (refreshIfStale null-DB/empty-edges handling) | `entity-density.vitest.ts` 012-ED-2.*; `query-router.vitest.ts` 012-T1.5 |
| REQ-007 | routingReasons in search-decisions.jsonl | Pipeline: `query-router.ts:311-348` → `query-plan.ts:110` (QueryPlan.routingReasons) → `search-decision-envelope.ts:85` (queryPlan on envelope) → `decision-audit.ts:51` (appendFileSync to jsonl) | `query-router.vitest.ts` 012-T2.1/.2/.5 assert reasons on queryPlan; envelope integration test in handler-memory-search-live-envelope.vitest.ts:210 |
| REQ-008 | SPECKIT_GRAPH_CHANNEL_PRESERVATION feature flag | `query-router.ts:160-163` (isGraphChannelPreservationEnabled), `query-router.ts:325` (flag check in routeQuery) | `query-router.vitest.ts` 012-T2.5; `routing-telemetry-stress.vitest.ts` 012-S4.* |

---

## 2. Checklist Evidence Audit (CHK-001..CHK-053)

All 24 checklist items have concrete evidence cited. Three items merit annotation:

| CHK | Evidence Quality | Note |
|-----|-----------------|------|
| CHK-002 | Adequate | Cites `plan.md` sections 3+4 which exist on disk; not verified for content accuracy |
| CHK-010 | Adequate | Claims `tsc --build` exit 0; cannot re-verify from review context |
| CHK-041 | Adequate | Implementation-summary contains before/after rates; live-smoke procedure documented in scratch/post-change.md which exists on disk |

No CHK item lacks concrete evidence. Every evidence string references either a file path, a test ID, or a command with expected output. No HARD BLOCKER evidence gaps.

---

## 3. Resource-Map Coverage

18 entries in resource-map.md. Cross-checked each against disk:

### MISSING ON DISK (1 entry)

| Path in resource-map | Status | Notes |
|---------------------|--------|-------|
| `changelog/changelog-026-009-causal-graph-channel-routing.md` | **MISSING** | Glob of `changelog/*012*` returns zero files. Resource-map claims status OK. |

### PATH MISMATCH (1 entry)

| Path in resource-map | Actual path on disk |
|---------------------|-------------------|
| `manual_testing_playbook/pipeline-architecture/210-routing-telemetry-and-graph-channel-invocation.md` | `272-routing-telemetry-and-graph-channel-invocation.md` |

### CREATED FILE NOT IN RESOURCE-MAP (1 entry)

| File on disk | Listed in resource-map? | Notes |
|-------------|------------------------|-------|
| `mcp_server/tests/routing-telemetry-stress.vitest.ts` | No | Listed in implementation-summary:89 as Created with 11 tests. Resource-map summary claims "All files created, updated, or analyzed during packet 012" but omits this file. |

### ALL OTHER 15 ENTRIES: present on disk, status OK.

---

## 4. Overlay: Skill/Agent Impact

- **skill_agent overlay**: No skill or agent definitions modified. The packet touches only `mcp_server/lib/search/` (query-router, entity-density, routing-telemetry) and `mcp_server/handlers/memory-crud-health.ts`. These are library and handler files within `system-spec-kit` skill infrastructure — not agent definitions. No new skill or agent folder created. **PASS — no overlay concern.**

- **agent_cross_runtime**: Not applicable (per packet scope statement). **SKIPPED.**

---

## 5. Overlay: Feature-Catalog Coverage

### 12-graph-channel-preservation.md

- **Exists on disk**: YES
- **Content matches code**: YES — accurately describes shouldPreserveGraph, entity-density gate, routing-telemetry, feature flag
- **Source files table**: Accurate — query-router.ts, entity-density.ts, routing-telemetry.ts, intent-classifier.ts, memory-crud-health.ts all correctly cited
- **TRACEABILITY table line numbers**: STALE — 4 of 8 line-number references are significantly off:
  - `shouldPreserveGraph` cited at `query-router.ts:139-180` → actually `183-205`
  - Override cited at `query-router.ts:routeQuery:233-249` → actually `325-335`
  - `data.routing` cited at `memory-crud-health.ts:624-650` → actually `662-667`
  - Default-on flag cited at `query-router.ts:isGraphChannelPreservationEnabled:132-135` → actually `160-163`
  - (4 remaining entries are accurate or within 3-line tolerance)

### 03-health-diagnostics-memoryhealth.md

- **Exists on disk**: YES
- **data.routing block documented**: YES — line 28 describes `graphChannelInvocationRate`, `channelInvocationRates`, `totalRecorded`, `windowSize`
- **routing-telemetry.ts in source files table**: YES — line 47
- **Content matches code**: YES

---

## 6. Overlay: Playbook Capability

### 272-routing-telemetry-and-graph-channel-invocation.md

- **Exists on disk**: YES (but at `272-*` not `210-*` as resource-map claims)
- **Describes correct scenario**: YES (validate graphChannelInvocationRate via memory_health)
- **Expected rate claim**: **INACCURATE** — playbook line 55 says `graphChannelInvocationRate ≈ 0.6` (3/5). The implementation-summary:143 documents that "alternatives considered for caching" classifies as `understand` (not `find_decision`), producing 2/5 graph-included → rate ≈ 0.4. The playbook was written expecting the intent classifier to label query 3 as `find_decision`, but the actual classifier behavior contradicts this.
- **Other claims**: `data.routing` shape, flag opt-out, search-decisions.jsonl reasons — all match code

---

## 7. Findings by Severity

### P1 (New)

| ID | Title | File:Line | Description |
|----|-------|-----------|-------------|
| **P1-002** | Resource-map playbook path wrong — `210` should be `272` | `resource-map.md:55` | Lists `210-routing-telemetry-and-graph-channel-invocation.md` but on-disk file is `272-*.` The prompt and playbook file itself also use `272`. Automated path validators relying on resource-map would miss the playbook. |
| **P1-003** | Resource-map changelog entry missing on disk | `resource-map.md:73` | `changelog/changelog-026-009-causal-graph-channel-routing.md` listed with status OK but no file found under any variant in the changelog directory. Resource-map integrity broken. |

#### Claim Adjudication: P1-002

- **claim**: Resource-map.md references playbook at path `210-*` but the file was created as `272-*`.
- **evidenceRefs**: `resource-map.md:55`, glob `272-*` → FOUND, glob `210-*` → NOT FOUND, playbook line 6 (`Playbook ID: 272`), prompt reference ("playbook 272")
- **counterevidenceSought**: Checked if `210-*` existed under a different group; checked if the playbook itself claimed ID 210 (it claims 272). No counterevidence found.
- **alternativeExplanation**: The playbook may have been drafted with placeholder ID 210 and renumbered to 272 at commit time, but resource-map was not refreshed.
- **finalSeverity**: P1 — breaks resource-map as a reliable path catalog.
- **confidence**: 0.95
- **downgradeTrigger**: If `210-*` exists at a different path not covered by glob patterns, or if the resource-map is explicitly known to be stale and marked as such (it is not — it claims "Missing on disk: 0").

#### Claim Adjudication: P1-003

- **claim**: Resource-map.md claims changelog `changelog-026-009-causal-graph-channel-routing.md` exists with status OK, but no such file exists on disk.
- **evidenceRefs**: `resource-map.md:73`, glob `changelog/*012*` → 0 results
- **counterevidenceSought**: Searched changelog directory for any file matching `*012*` (case-insensitive variants too). None found.
- **alternativeExplanation**: The changelog may have been authored in a branch that was never merged, or was deleted after resource-map was written.
- **finalSeverity**: P1 — resource-map claims 0 missing files but has a false claim.
- **confidence**: 0.92
- **downgradeTrigger**: If the file exists in an index or was intentionally excluded from disk (e.g., gitignored), or if resource-map summary note acknowledges this as PLANNED rather than OK.

### P2 (New)

| ID | Title | File:Line | Description |
|----|-------|-----------|-------------|
| **P2-014** | Playbook 272 expected rate 0.6 contradicts actual classifier behavior | `playbook 272:55` | Playbook expects 3/5 queries to trigger graph (rate ≈ 0.6), but query 3 ("alternatives considered for caching") classifies as `understand`, making actual rate 2/5 = 0.4. Implementation-summary:143 documented this as limitation #3. |
| **P2-015** | routing-telemetry-stress.vitest.ts not listed in resource-map.md | `resource-map.md` (missing entry) | File exists on disk (`mcp_server/tests/routing-telemetry-stress.vitest.ts`, 275 lines, 11 tests). Implementation-summary:89 documents it as Created. Resource-map summary claims "All files created, updated, or analyzed" but omits this file. |
| **P2-016** | Feature catalog 12-graph-channel-preservation.md traceability table line numbers stale | `12-graph-channel-preservation.md:59-67` | 4 of 8 line references are offset by 20+ lines (e.g., shouldPreserveGraph cited at 139-180, actually 183-205; isGraphChannelPreservationEnabled cited at 132-135, actually 160-163; routeQuery override cited at 233-249, actually 325-335; data.routing cited at 624-650, actually 662-667). |

---

## 8. Verdict

**CONDITIONAL** — `hasAdvisories=true`

- **Core traceability**: PASS — All REQ-001..REQ-008 have concrete `file:line` implementation evidence. All CHK-001..CHK-053 have cited evidence. No unverified spec claims.
- **Resource-map**: FAIL — 1 missing-on-disk entry (changelog), 1 path mismatch (playbook 210→272), 1 omitted file (stress test). Resource-map summary claims 0 missing but has demonstrable gaps.
- **Feature-catalog**: PASS with advisories — Both entries exist with correct content; traceability table line numbers are stale (P2-016).
- **Playbook**: PASS with advisories — Scenario is correct; expected-rate claim is inaccurate (P2-014), but the limitation was already acknowledged in implementation-summary.

**New ratio**: 5 new findings / (11 prior + 5 new) = 5/16 ≈ 0.31 — elevated from last ratio of 0.36, reflecting substantial traceability surface.

---

## 9. Next Dimension

**Maintainability** (iteration 5) — Evaluate code duplication (ChannelName type duplicated), error-swallowing (safeGetDb), ring-buffer Array.shift() pattern, unbounded routingReasons string persistence, and feature-flag self-gating. Several existing P2 findings (P2-001..P2-013) cluster around maintainability concerns that warrant consolidated evaluation.
