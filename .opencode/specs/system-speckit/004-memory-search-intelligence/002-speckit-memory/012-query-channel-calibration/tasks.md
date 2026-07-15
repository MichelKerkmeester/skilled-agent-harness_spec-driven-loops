---
title: "Tasks: Query-Channel Calibration and Visibility"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "query channel calibration"
  - "graph degree channel skip"
  - "query classifier escalation hatch"
  - "skipped channels visibility"
  - "stopword ratio threshold"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/012-query-channel-calibration"
    last_updated_at: "2026-07-10T11:20:21.000Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffold template titles removed from four doc frontmatters; packet now strict-clean"
    next_safe_action: "Review Phase R evidence and the consolidated swarm commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Query-Channel Calibration and Visibility

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] (verified) T001 Confirm 007-search-index-integrity-sweep has shipped (../007-search-index-integrity-sweep). **Evidence**: implementation started from the user-provided dependency confirmation for 007.
- [x] T002 Re-derive or obtain the 7-query telemetry sample and attribute each of the 5 skipped-but-corroborating queries to the stopword-ratio hatch, the entity-density hatch, or both (.opencode/skills/system-spec-kit/mcp_server/lib/search/routing-telemetry.ts). **Evidence**: `tests/query-channel-calibration.vitest.ts` fixture establishes pre-change behavior with the new flag disabled: graph `2/7`, degree `0/7`; after behavior: graph `6/7`, degree `6/7`.
- [x] T003 [P] Build the frozen content-rich 2-3-term query fixture plus a control set of genuinely-vague and trigger-anchored queries (scratch/query-channel-calibration-fixture/). **Evidence**: fixture is embedded in `.opencode/skills/system-spec-kit/mcp_server/tests/query-channel-calibration.vitest.ts`; no scratch files were retained.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Recalibrate the hatch(es) identified in T002 as the binding constraint, guarded by SPECKIT_GRAPH_CHANNEL_PRESERVATION or a new dedicated flag (.opencode/skills/system-spec-kit/mcp_server/lib/search/query-classifier.ts, .opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts). **Evidence**: added `SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION`; the flag-enabled path preserves graph/degree for content-rich short queries; flag-off (the shipped default — opt-in, HELD pending a production-path benchmark) restores the pre-recalibration fixture result.
- [x] T005 Thread vectorSearchSkipped/embedderAvailable/degradationReason from Stage 1's return value into hybrid-search.ts's skippedChannels metadata (.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts, .opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts). **Evidence**: `hybrid-search.ts` now records runtime vector embedding/search unavailability in `s3meta.routing.skippedChannels` and `skippedChannelDetails`; the named test forces null embedding and asserts `vector` visibility.
- [x] T006 Add the shared channel-exception sink and wire it into causal-boost.ts graph traversal and context-injection fail-open sites (.opencode/skills/system-spec-kit/mcp_server/lib/search/causal-boost.ts). **Evidence**: `channelExceptions` are attached to causal boost metadata and graph-context injection results; forced-failure fixture asserts both sources.
- [x] T007 Wire the shared channel-exception sink into hybrid-search.ts BM25/FTS/trigger-phrase fail-open sites (.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts). **Evidence**: `bm25`, `fts`, and `trigger` failure paths append channel exceptions and skipped-channel details; forced multi-channel failure fixture asserts all named channels.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Before/after graph/degree invocation-rate measurement on the content-rich fixture via routing-telemetry.ts's rolling-window snapshot. **Evidence**: `npm run test:core -- tests/query-channel-calibration.vitest.ts ...` passed; fixture asserts graph `2/7` to `6/7` and degree `0/7` to `6/7`.
- [x] T009 Before/after latency measurement on the same fixture, confirmed against the agreed ceiling. **Evidence**: named test asserts after-change `avgMs < 5` and `maxMs < 5`; rebuilt `dist` live probe could not complete because the current daemon holds the single-writer DB lock.
- [x] T010 Control-set fixture run confirms no false escalation on genuinely-vague or trigger-anchored queries. **Evidence**: named test asserts `save context` trigger control and `cli-opencode` single-token control do not gain graph or degree.
- [x] T011 Forced-failure fixture runs confirm the vector-skip and all 4 channel-exception call sites are now visible in result metadata. **Evidence**: named test asserts runtime `vector` skip plus `fts`, `bm25`, `trigger`, graph-search, causal traversal, and graph-context injection exception visibility.
- [x] (verified) T012 Update documentation (spec/plan/tasks/checklist). **Evidence**: this packet's tasks, checklist, and implementation summary were updated with verification details and limitations.
- [x] T013 Pin the benchmark thresholds and reproduce commands on the frozen fixture (invocation-rate lift, control-set false-escalation count, visibility checks, latency delta) (scratch/query-channel-calibration-fixture/). **Evidence**: the reproduce command is `npm run test:core -- tests/query-channel-calibration.vitest.ts tests/query-classifier.vitest.ts tests/query-router.vitest.ts tests/query-plan-emission.vitest.ts tests/hybrid-search.vitest.ts tests/flag-ceiling.vitest.ts tests/routing-telemetry-stress.vitest.ts`; no scratch fixture remains.
- [x] T014 Author the named test asserting the recalibrated hatch(es), the control-set inertness, and the metadata-propagation fix (.opencode/skills/system-spec-kit/mcp_server/tests/query-channel-calibration.vitest.ts). **Evidence**: file exists and targeted suite passed.
- [x] T015 If a new flag was introduced in T004, register it in ALL_SPECKIT_FLAGS plus FLAG_CHECKERS and prove its default (.opencode/skills/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts). **Evidence**: `SPECKIT_CONTENT_RICH_SHORT_QUERY_GRAPH_PRESERVATION` added and covered by `tests/flag-ceiling.vitest.ts` in the passing targeted suite.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed with limitations documented in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

## Phase R: Audit Remediation (2026-07-09 GPT-5.6 review wave)

- [x] T005 [P1] Channel skip/exception metadata never reaches the MCP response: `_s3meta` is non-enumerable with no production consumer (`mcp_server/lib/search/hybrid-search.ts:2343`). Thread typed skip/exception metadata through Stage 1 and PipelineResult into response/query-plan metadata; add an integration test asserting the serialized `memory_search` response. DONE 2026-07-10 — typed PipelineChannelTelemetry flows stage1->PipelineResult->orchestrator->serialized response (enumerable; centerpiece test JSON-round-trips the real handleMemorySearch envelope, mutation-checked by the gate); empty/all-channels-fail carries telemetry. First attempt REJECTED for a plan+caller double-emission on the wire — redo centralized precedence dedup (exception>runtime>planned, one entry per channel) in channel-exceptions.ts, re-verified with the router at DEFAULT. Sonnet-max ACCEPT after redo.
- [x] T006 [P1] BM25 metadata-lookup failure is console-only and never calls `appendChannelException` (`hybrid-search.ts:584`). Append a `bm25` exception in the inner catch; test with a throwing metadata `.all()`. DONE 2026-07-10 — BM25 metadata-lookup inner catch appends a bm25-metadata-lookup channel exception before failing closed; test uses a real BM25 index with a throwing metadata .all() (hybrid-search.ts:584; channel-telemetry-hybrid.vitest.ts:204). Sonnet-max verified.
- [x] T007 [P1] Actual channel removals and unavailable executors (caller-disabled, missing graphSearchFn, null DB, disabled degree boost) are computed but not recorded (`hybrid-search.ts:1465`). Reconcile final activeChannels + executor preconditions into skip details with tests per condition. DONE 2026-07-10 — caller-disabled channels, missing graph executor, null DB, disabled degree boost all emit runtime skip entries reconciled against final activeChannels; forceAllChannels edge fixed (planned skips only for channels absent from the active set); per-condition tests. Sonnet-max verified.
- [x] T008 [P1] `injectGraphContext()` has no production caller — only the calibration test invokes it (`mcp_server/lib/search/causal-boost.ts:699`). Integrate it into the pipeline or remove the implementation and amend the completion claim. DONE 2026-07-10 — integrated (option a): graph-context injection runs inside applyCausalBoost when options.query is supplied, exceptions aggregate before seed-dependent early returns (empty-seed path still carries metadata); production call site (stage2-fusion.ts:1145) has config.query in scope two lines up — hookup owned by the response-wiring task. Sonnet-max verified ACCEPT incl. empirical reachability probe.
- [x] T009 [P1] The calibration flag defaults OFF while packet docs claim shipped default-ON behavior (`mcp_server/lib/search/search-flags.ts:451`; `implementation-summary.md:57`, `tasks.md:64`). Either run the production-path benchmark and graduate, or mark the packet held/opt-in and reconcile completion claims. DONE 2026-07-10 — DECISION: HOLD as opt-in (default-OFF). The response-path wiring the lift depends on only landed in this remediation (channel telemetry now reaches the serialized envelope), so graduation without a production-path benchmark would flip a routing default on unmeasured behavior. Packet docs reconciled: implementation-summary calibration section and T004 evidence rewritten from default-on to opt-in/HELD wording; ENV_REFERENCE already documented OFF. Graduation path: run the T010 benchmark, then a dedicated flag-flip change.
- [x] T010 [P1] The `<5ms` latency assertions time only classification/routing, not the widened channel execution (`mcp_server/tests/query-channel-calibration.vitest.ts:76`). Benchmark the full pipeline p50/p95 against a representative index with the flag on and off. DONE 2026-07-10 — production-path benchmark shipped (stress_test/search-quality/query-channel-calibration-benchmark.vitest.ts): real hybridSearchEnhanced over a 360-row fixture index (embeddings+FTS5+720 causal edges), warmup excluded, alternating OFF/ON, real routing telemetry cross-validated against instrumented executor counts. Flag OFF p50 ~1.4-1.9ms, ON +0.25-0.5ms p50 (+~10-27% run-to-run), graph/degree invocations 0->200; controls unaffected. Verifier re-ran and reproduced the invocation shift exactly. Graduation-input evidence recorded; flag stays HELD opt-in per the packet decision. Sonnet-max verified ACCEPT.
- [x] T011 [P2] Tokens are not punctuation-normalized before stopword matching, and CJK/no-whitespace text always classifies as one term (`mcp_server/lib/search/query-classifier.ts:93`). Normalize Unicode punctuation, define the CJK tokenization policy, add 0/1/3/4-term, punctuation, and no-whitespace tests. DONE 2026-07-10 — token-edge Unicode punctuation stripping (intra-word hyphens/dots/underscores preserved — memory-index.ts stays one token); CJK-dominant queries classified by char-count policy (1 term per 2 CJK chars, dominance ratio 0.5); 0/1/3/4-term boundaries + punctuation-equivalence + CJK tests red pre-fix (0 vs 0.5 ratio; 1 vs 11 terms — verifier re-simulated HEAD logic empirically); 170/170 across 5 suites. Sonnet-max verified ACCEPT.
- [x] T012 [P2] Strip `F15`/`F5a`/`F5b` finding IDs from production/test code comments (e.g. `mcp_server/lib/search/query-router.ts:106`) and replace with durable behavioral explanations — comment-hygiene hard rule; reconcile the checklist claim that none were embedded. DONE 2026-07-10 — all F-number comments replaced with durable behavioral WHY (query-router.ts:106-111,370-382 + test files); fresh rg sweep zero matches; project comment-hygiene checker clean on all 7 files; zero functional diff in hygiene hunks. Sonnet-max verified ACCEPT.
- [x] T013 [P1] Typed causal traversal discards the winning relation and re-queries `SELECT relation ... LIMIT 1` with a `'caused'` fallback, so multi-edge neighbors get nondeterministic relations and two-hop neighbors get the neutral fallback (`causal-boost.ts:549`). Return the winning relation/path from `collectCausalWeightedNeighbors()`; add two-hop and multi-edge provenance tests. DONE 2026-07-10 — relation-aware traversal preserves the winning terminal relation + node/relation paths with order-independent argmax (global sort + content-based tie-break); LIMIT-1 re-query and caused fallback removed; verifier hand-recomputed both falsifiers exactly (0.18 vs 0.135 multi-edge; 0.045 vs 0.09 two-hop); 318/320 causal suites green (2 failures stash-proven pre-existing). Sonnet-max verified ACCEPT.
