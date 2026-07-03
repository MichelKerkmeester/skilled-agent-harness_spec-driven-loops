---
title: "Feature Specification: Manual Playbook Sweep Findings Remediation [template:level_2/spec.md]"
description: "Fix planning for confirmed FAIL findings surfaced by the 031 manual testing playbook sweep, updated dynamically as the sweep discovers new failures."
trigger_phrases:
  - "playbook sweep findings remediation"
  - "031 findings fixes"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/014-manual-playbook-execution-sweep/001-findings-remediation"
    last_updated_at: "2026-07-02T13:45:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Scaffolded remediation packet with fix plans for 26 findings confirmed so far"
    next_safe_action: "Append new finding entries to spec.md/plan.md/tasks.md as the sweep confirms more FAILs; begin implementation once sweep completes"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-02-031-findings-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Manual Playbook Sweep Findings Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress (growing dynamically) |
| **Created** | 2026-07-02 |
| **Parent packet** | `system-speckit/028-memory-search-intelligence/014-manual-playbook-execution-sweep` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 485-scenario manual testing playbook sweep (packet `031-manual-playbook-execution-sweep`) is confirming real, reproducible bugs across the spec-kit/code-graph/skill-advisor stack — feature-flag kill-switches that don't disable their feature, a "read-only" indexing path that mutates data, scoring-pipeline synchronization gaps, and more. Packet 031's own spec.md explicitly scopes bug-fixing OUT of that packet (it is sweep-execution only). Without a dedicated place to plan fixes, findings would accumulate with no path to remediation.

### Purpose
Provide a living, incrementally-updated fix plan for every FAIL scenario the sweep confirms — root-cause hypothesis (grounded in the scenario's own Evidence/Failure Triage), affected files, and a proposed fix approach — so that once the sweep completes (or at natural checkpoints), a future implementation session can work through this list without re-deriving root causes from scratch.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root-cause hypothesis and proposed fix approach for every scenario the sweep manifest records as `FAIL`
- Grouping findings by subsystem/theme where a single root cause likely explains multiple failures
- Flagging findings that need more investigation before a fix can be proposed (insufficient evidence in the scenario file)
- Dynamic updates: new FAIL findings get a new entry appended here as the sweep confirms them, without needing to re-open Gate 3

### Out of Scope
- Actual code changes / implementation (tracked as pending tasks in `tasks.md`, executed in a future session)
- BLOCKED-verdict scenarios (infrastructure/environment gaps like the recurring `database is locked` contention — those are packet 031's own finding, not a remediation target here, since they are not code bugs)
- PASS-verdict scenarios
- The sweep's own execution, concurrency, or resumability (owned entirely by 031)

### Files to Change

Deferred to implementation phase — see per-finding "Affected Files" in `plan.md`. No code has been changed by this planning packet.

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required (complete OR user-approved deferral)

| ID | Finding | Symptom | Proposed Fix Area |
|----|---------|---------|--------------------|
| REQ-003 | 0003 bm25-trigger-phrase-re-index-gate | Re-index gate doesn't reliably detect trigger mutations vs FTS5-only lexical updates | BM25 re-index gate detection logic |
| REQ-004 | 0004 bounded-graph-walk-rollout-and-diagnostics | Bounded graph trace fields missing from result envelope | `formatters/search-results.ts` / `lib/search/hybrid-search.ts` |
| REQ-015 | 0015 trigger-phrase-matching-memory-match-triggers | Trigger-cache reload/index issue | Trigger cache reload query + `idx_trigger_cache_source` |
| REQ-016 | 0016 unified-context-retrieval-memory-context | specFolder/intent mismatch on `memory_context` | Intent resolution/specFolder handling |
| REQ-030 | 0030 memory-browser-memory-list | `memory_list` filter/specFolder path issue | `memory_list` filter handling |
| REQ-032 | 0032 session-health-shared-payload | `session_health` backend unavailable (ECONNREFUSED/exitCode 75) | Spec Memory daemon warm-path / session_health fallback |
| REQ-033 | 0033 session-resume-continuity-ladder | Phase-parent redirect/listing not visible in `session_resume` | `session_resume` phase-parent handling |
| REQ-039 | 0039 startup-runtime-compatibility-guards | `detectRuntimeMismatch` assertion/count drift | `startup-checks.ts` |
| REQ-040 | 0040 workspace-scanning-and-indexing-memory-index-scan | Spec docs disappear under `qualityGateMode: 'warn-only'` | `handlers/memory-index.ts` |
| REQ-048 | 0048 checkpoint-v2-needs-rebuild-self-heal | needs-rebuild sentinel survives successful boot rebuild | `runCheckpointNeedsRebuildRepair` / `repairNeedsRebuildSentinel` |
| REQ-056 | 0056 causal-stats-empty-graph-edge | `memory_causal_stats` rejects `scope` parameter (schema validation) | `memory_causal_stats` parameter schema |
| REQ-059 | 0059 learning-history-memory-get-learning-history | Empty `learningHistory`/`count:0` when history expected | `memory_get_learning_history` query/filter |
| REQ-062 | 0062 eval-ablation-edge-empty-dataset | Terse FAIL, no cited evidence (dispatch quality issue, not necessarily a code bug) | Needs re-verification before a fix is proposed |
| REQ-064 | 0064 reporting-dashboard-eval-reporting-dashboard | Report succeeds but returns 0 eval runs/sprint groups | `handlers/eval-reporting.ts` / `lib/eval/reporting-dashboard.ts` |
| REQ-074 | 0074 math-max-min-stack-overflow-elimination | `Math.max/min` spread still throws `RangeError` on large arrays | Residual unreplaced spread call site(s) |
| REQ-077 | 0077 sha-256-content-hash-deduplication-tm-02 | Dedup writes 5 DB rows instead of 1; dedup lookup predicate shape wrong | Dedup lookup query (`canonical_file_path`/`file_path` OR-predicate) |
| REQ-079 | 0079 agent-consumption-instrumentation-g-new-2 | `E_SESSION_SCOPE`, `runtime_ready=false`, logger gate active when expected inert | Logger gate / inert-mode toggle |
| REQ-085 | 0085 evaluation-database-and-schema-r13-s1 | Retrieval events not logged to eval tables | Eval DB write path for `memory_search`/`memory_context` events |
| REQ-087 | 0087 int8-quantization-evaluation-r5 | No-go criteria not reaffirmed with current data | Re-run benchmark, update no-go decision record with current numbers |
| REQ-110 | 0110 unified-graph-rollback-and-explainability-phase-3 | `SPECKIT_GRAPH_UNIFIED=false` kill-switch does not disable graph signals | Stage 2 graph-flag propagation |
| REQ-113 | 0113 adaptive-shadow-proposal-and-rollback-phase-4 | `SPECKIT_MEMORY_ADAPTIVE_RANKING=true` does not emit expected `adaptiveShadow` proposal | Adaptive-ranking proposal emission path |
| REQ-126 | 0126 scoring-and-fusion-corrections | Vitest baseline count mismatch (expected 350, got 365) | Likely stale doc expectation from test-suite growth — verify, then correct the scenario doc rather than code |
| REQ-129 | 0129 stage-2-score-field-synchronization-p0-8 | Stage-2 score sync missing for non-hybrid path | `resolveEffectiveScore` fallback chain / Math.max sync placement |
| REQ-133 | 0133 channel-min-representation-r2 | Min-representation ignores `QUALITY_FLOOR=0.005` | Channel min-representation quality-floor check |
| REQ-134 | 0134 confidence-based-result-truncation-r15-ext | `confidenceTruncation` metadata missing on real traces (passes only on synthetic tests) | Cliff-detection trace metadata emission |
| REQ-156 | 0156 encoding-intent-capture-at-index-time-r16 | "Read-only" `indexMemoryDeferred` same-path update mutates `encoding_intent` on existing row | Read-only enforcement in `indexMemoryDeferred` |
| REQ-174 | 0174 spec-folder-description-discovery-pi-b3 | `memory_context` folder-routing check fails with `E_SESSION_SCOPE` instead of routing evidence | `generateFolderDescriptions` preference/repair logic |
| REQ-175 | 0175 vec-memories-knn-and-factory-shard-fallback | `vec_memories` has 17 rows vs `vec_768`'s 18464 (18456 missing); rank-1 KNN distance is 1.37 not 0; factory log missing | Dual-write transaction in `reindex.ts` (`writeVectorsToShard`/`writeVectorsToKnn`) |
| REQ-176 | 0176 verify-fix-verify-memory-quality-loop-pi-a5 | Rejection reason says "after 1 auto-fix attempt(s)" but `maxRetries: 2` was submitted — retry count not honored | Quality-check retry loop's max-retries wiring |
| REQ-183 | 0183 cross-process-db-hot-rebinding | Mutation fails with "Invalid tier scratch"; `.db-updated` marker absent; `memory_health()` reports degraded | DB_UPDATED_FILE marker + tier enum validation |
| REQ-185 | 0185 db-path-extraction-and-import-standardization | Eval entry points resolve a different DB path (`.../database/...`) than the shared resolver (`.../database/spec-kit-a/...`) for the same env vars | Shared DB-path resolver not consistently imported by all consumers |
| REQ-188 | 0188 embeddings-and-retry-api | Expected model IDs `unsloth/bge-base-en-v1.5-GGUF`/`onnx-community/bge-base-en-v1.5-ONNX`, actual local defaults are `nomic-embed-text-v1.5` | Stale scenario-doc expectation (model catalog changed) or provider config drift — needs disambiguation |
| REQ-190 | 0190 learned-relevance-feedback-r11 | `memory_validate` returns `applied:false, reason:"shadow_period"` — learned triggers never persisted from helpful validation | Trigger-learning pipeline shadow-period gating |
| REQ-192 | 0192 legacy-v1-pipeline-removal | Zero-V1-reference expectation not met — `postSearchPipeline`/`isPipelineV2Enabled()` still present, `memory-search.ts` calls `executePipeline()` | Incomplete V1→V2 pipeline migration cleanup |
| REQ-193 | 0193 lineage-backfill-rollback-drill | Vitest suite passes, but transcript lacks required execution/rollback evidence | Test coverage gap, not necessarily a code bug — needs re-verification |
| REQ-194 | 0194 lineage-state-active-projection-and-asof-resolution | Vitest suite passes, but transcript lacks valid/malformed lineage + timestamp-order coverage | Test coverage gap, not necessarily a code bug — needs re-verification |
| REQ-200 | 0200 performance-improvements | `bm25-index.ts` returns `true` when `ENABLE_BM25` is unset — contradicts documented opt-in/default-disabled behavior | BM25 enablement default check |
| REQ-205 | 0205 strict-zod-schema-validation-p0-1 | `SPECKIT_STRICT_SCHEMAS=false` did not allow an extra `bogus` parameter — strict mode still rejects unknown params | `tool-schemas.ts` `.strict()` vs `.passthrough()` branching |
| REQ-208 | 0208 tri-daemon-spawn-drill | Gated run fails: `expected [1,1,1] to deeply equal [+0,+0,+0]` — respawn-lock serialization or reap-divergence in daemon launcher | Daemon launcher SIGTERM/respawn-lock handling |
| REQ-211 | 0211 causal-boost-graduated | Default-on `memory_search` never applies causal boost (`causalBoostApplied: "off"`, `causalBoosted: 0`) despite Vitest passing | `isCausalBoostEnabled()` flag read at request time |
| REQ-212 | 0212 community-search-fallback | Default-on `memory_search` doesn't surface community fallback (`communityInjected: 0`, `fallbackPolicy.mode: "none"`) despite scoring showing a relevant community exists | `SPECKIT_COMMUNITY_SEARCH_FALLBACK` flag read at request time |
| REQ-214 | 0214 contextual-tree-injection-p1-4 | Enabled/default mode returns `content: null`/`contentError: "File not found"` instead of `[parent > child — description]` header injection | `injectContextualTree`/`isContextHeadersEnabled` in `hybrid-search.ts`/`search-flags.ts` -- likely Group A pattern |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every FAIL-verdict scenario in the 031 manifest has a corresponding entry in this packet's `plan.md` with a root-cause hypothesis and proposed fix (or an explicit "needs re-verification" flag)
- **SC-002**: This packet stays in sync with 031's manifest as the sweep progresses — no confirmed FAIL is left undocumented once the sweep finishes
- **SC-003**: Each entry cites concrete evidence (the scenario's own Evidence/Failure Triage text or a direct log excerpt), not speculation

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 031 sweep still running | Findings list is incomplete until the sweep finishes | This packet updates incrementally; final reconciliation happens after 031 completes |
| Risk | Root-cause hypotheses are inferred from a single dispatch's self-report, not independently verified | A proposed fix could target the wrong cause | Implementation phase must re-verify each root cause against real code/behavior before changing anything (Finding = hypothesis principle) |
| Risk | Some findings (e.g. 0032, 0033) have thin evidence in their scenario file (template variant without dedicated Evidence/Pass-Fail sections) | Fix hypothesis may be shallow | Flagged explicitly in `plan.md`; recommend re-running these scenarios with a stricter evidence requirement before fixing |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

N/A — this packet is documentation/planning only, no runtime surface.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Duplicate root cause across findings**: where multiple REQ rows plausibly share one root cause (e.g. flag-propagation bugs), `plan.md` groups them under one fix entry rather than duplicating work
- **Finding turns out to be a stale doc, not a code bug** (e.g. REQ-126): fix is a doc correction to the scenario file, not a code change — tracked as such in `tasks.md`
- **New FAIL confirmed after this spec was last touched**: append a new REQ row + `plan.md` entry + `tasks.md` task in the same update, don't wait for a full doc rewrite

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

None — scope confirmed by operator (phase child under 031, dynamic updates as sweep progresses).

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent packet**: `../spec.md` (031 sweep execution)
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

<!-- /ANCHOR:related-docs -->
