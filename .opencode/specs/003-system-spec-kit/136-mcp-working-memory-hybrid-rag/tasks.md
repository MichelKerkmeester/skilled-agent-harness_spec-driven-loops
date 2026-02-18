# Tasks: Working Memory + Hybrid RAG Automation

<!-- SPECKIT_LEVEL: 3+ -->
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

<!-- ANCHOR:phase-0 -->
## Phase 0: Prerequisites (3-4 days)

### Hook Pipeline (3 days)
- [ ] T000a Create `afterToolCallbacks` array in `context-server.ts` (typed `Array<(tool: string, callId: string, result: unknown) => Promise<void>>`); callbacks are **enqueued and executed asynchronously** after `dispatchTool()` returns its response — **no `await` in the dispatch response path**
- [ ] T000b Invoke all registered callbacks after `dispatchTool()` returns using queued/non-blocking execution; **per-callback error isolation**: catch each callback independently, log failure, continue to next (callback N failure does NOT abort callbacks N+1…)
- [ ] T000c Export `registerAfterToolCallback(fn)` from context-server for modules to register hooks
- [ ] T000d [P] Write unit tests for callback registration and invocation (success path, per-callback error isolation)

### Token-Usage Signal Contract (2 days)
- [ ] T000e Add optional `tokenUsage` parameter to `tool-schemas.ts` tool schema for `memory_context` (type: `number | undefined`, range 0.0–1.0, represents caller's current usage ratio)
- [ ] T000f Document three-tier fallback behavior in code: **(1) Primary** — caller passes `tokenUsage` → use directly; **(2) Fallback** — server-side estimator derives ratio from runtime context stats (token count from most recent tool result metadata); **(3) Last resort** — neither available → no override (pass-through) + WARN log "tokenUsage not provided and estimator unavailable; pressure policy inactive". Ownership: Pressure Monitor consumes; caller or server-side estimator supplies
- [ ] T000g [P] Write unit tests for tokenUsage parameter (present=0.85 triggers override, absent=server-side estimator fallback, estimator unavailable=WARN+no override, out-of-range=clamped 0.0–1.0)

### Evaluation Dataset Bootstrap (Phase 0 gate — 100 queries)
- [ ] T000h Collect Phase 0 shadow set: sample **100 real queries** from existing `memory_search` call logs (or synthetic queries from spec/plan text); minimum 5 queries per intent type
- [ ] T000i Record baseline rankings for each query (top-10 results from RRF fusion, without any boost); derive ground truth from existing RRF ranking (proxy baseline) + ~10% targeted human review sample
- [ ] T000j Store Phase 0 dataset in `scratch/eval-dataset-100.json` (schema: `{ query, baselineRanks: string[], humanReviewed?: boolean }[]`)
- [ ] T000k [P] Validate Phase 0 dataset coverage (at least 5 queries per intent type: add_feature, fix_bug, refactor, understand, find_spec)

### Phase 0 Sign-Off
- [ ] T000l [B:T000a,T000e,T000j] Confirm hook pipeline, token-usage three-tier contract, and Phase 0 eval dataset (100 queries) ready before Phase 1 begins
<!-- /ANCHOR:phase-0 -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Core Cognitive Automation (1-2 weeks)

### Config & Schema (2 days)
- [ ] T001 Create `configs/cognitive.ts` with Zod schemas (`SPECKIT_SESSION_BOOST`, `SPECKIT_PRESSURE_POLICY`, `SPECKIT_EVENT_DECAY` defaults)
- [ ] T002 Add `event_counter` column to working_memory table (migration script, default=0, NOT NULL)
- [ ] T003 Add `mention_count` column to working_memory table (migration script, default=0, NOT NULL)
- [ ] T004 [P] Add startup validation for cognitive config (Zod parse, fail-fast on malformed values); validate all extraction rule regexes at startup (reject patterns with exponential backtracking via TypeScript polynomial-time safety check per ADR-006)

### Event Decay (3 days)
- [ ] T005 Implement event-based decay in `lib/cache/cognitive/working-memory.ts` (replace time-based logic — no stale line numbers; locate the `attentionDecayRate`/`decayInterval` block at runtime)
- [ ] T006 Add mention boost calculation (`mentionCount * 0.05`, applied after decay)
- [ ] T007 Update working memory access to increment `event_counter` and `mention_count`
- [ ] T008 Set decay floor to 0.05, delete threshold to 0.01 (separate constants)
- [ ] T009 [P] Write unit tests for decay calculation (event distance 0, 10, 100 with mention boost)

### Session Attention Boost (4 days)
- [ ] T010 Create `lib/search/session-boost.ts` module
- [ ] T011 Implement `getAttentionBoost(sessionId, memoryIds)` query against working_memory table
- [ ] T012 Calculate bounded boost (`attentionScore * 0.15`, max 0.20 combined with causal)
- [ ] T013 Integrate boost into `handlers/memory-search.ts` after RRF fusion (locate post-RRF block at runtime; no hardcoded line numbers)
- [ ] T014 [P] Write unit tests for boost bounds (0, 0.10, 0.20, 0.30 -> capped at 0.20)
- [ ] T015 [P] Write integration tests for RRF + boost pipeline (verify score order preserved)

### Pressure Monitor (3 days)
- [ ] T016 Create `lib/cache/cognitive/pressure-monitor.ts` module
- [ ] T017 Implement `getPressureLevel(tokenUsage: number | undefined, runtimeContextStats?: RuntimeContextStats)` calculator — three-tier: *(1)* `tokenUsage` defined → use directly; *(2)* `tokenUsage` undefined + `runtimeContextStats.tokenCount` available → derive ratio; *(3)* neither → return `none` + WARN; ratio thresholds: 0.6, 0.8
- [ ] T018 Integrate mode override in `handlers/memory-context.ts` after intent detection (locate intent-detection block at runtime; no hardcoded line numbers)
- [ ] T019 Add override logic (>80% -> quick, 60-80% -> focused, <60% -> no override)
- [ ] T020 Add warning message to response metadata when pressure override applied
- [ ] T021 [P] Write unit tests for threshold calculations (55%, 65%, 85%, 95%, undefined-with-estimator, undefined-without-estimator → WARN+no override)

### Shadow Evaluation — Phase 0 dataset (2 days)
- [ ] T022 [B:T000j] Load `scratch/eval-dataset-100.json`, run queries with and without boost enabled (Phase 0 evaluation)
- [ ] T023 Measure rank correlation (Spearman's rho) between baseline and boosted results
- [ ] T024 Measure token waste (payload size in sessions >20 turns, baseline vs boosted)
- [ ] T025 Measure context error rate (count "context exceeded" in pressure simulation)
- [ ] T026 Document Phase 0 results in `scratch/phase1-eval-results.md` (note: rank correlation on 100-query set is indicative only; definitive 0.90 gate runs at Phase 1.5 on 1000-query set)

### Phase 1 Sign-Off
- [ ] T027 [B:T000l] Review shadow eval results with tech lead (indicative go/no-go; definitive gate at Phase 1.5)
- [ ] T028 [B:T027] Deploy Phase 1 with feature flags OFF (dark launch)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-1-5 -->
## Phase 1.5: Hardening Gate (4-5 days)

### Evaluation Dataset Expansion
- [ ] T027a [B:T028] Expand eval dataset from 100 to 1000 queries: sample additional queries per intent type (200 per type), add to `scratch/eval-dataset-1000.json`
- [ ] T027b Apply full targeted review to ~10% of 1000-query set (human relevance judgments replacing proxy baseline for reviewed subset)
- [ ] T027c Run full 1000-query shadow evaluation (baseline vs Phase 1 boosted); measure rank correlation (Spearman's rho)
- [ ] T027d Verify rank correlation >= 0.90 on 1000-query set — **HARD GATE for Phase 2**; if fails, block Phase 2 and escalate

### Redaction Calibration (REQ-017)
- [ ] T027e Collect 50 real Bash tool outputs from existing logs/sessions (`scratch/redaction-calibration-inputs/`)
- [ ] T027f Run redaction gate on all 50 inputs; identify false positives (non-secret content redacted); measure FP rate (FPs / total non-secret tokens)
- [ ] T027g Document commit-hash/UUID over-redaction cases; add exclusion heuristics to `redaction-gate.ts`: exclude 40-char hex strings matching `/^[0-9a-f]{40}$/` (git SHA), exclude UUIDs matching `/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i`
- [ ] T027h Tune generic high-entropy token pattern if FP rate > 15% (raise minimum length threshold from 32 to 40 chars, or add content-type exclusions)
- [ ] T027i Re-run calibration after tuning; verify FP rate <= 15% — **HARD GATE for Phase 2 redaction implementation**
- [ ] T027j Document calibration results in `scratch/redaction-calibration.md` (input samples, FP analysis, pattern changes, final FP rate)

### Session Lifecycle Contract (REQ-016)
- [ ] T027k Define `session_id` scope: caller-supplied string in memory_context args; if absent, server generates ephemeral UUID (not persisted); document in API schema (tool-schemas.ts)
- [ ] T027l Define `event_counter` boundary: resets to 0 on new session (session_id not seen before); resumes from last stored value on session resume (session_id previously seen in working_memory)
- [ ] T027m Define resume behavior: on resume, load working_memory items for session_id with attention scores > floor (0.05); inject top-5 into system prompt context
- [ ] T027n Write integration test: new session → event_counter=0; resume → event_counter continues from stored value; verify working_memory items survive resume

### Phase 1.5 Sign-Off
- [ ] T027o [B:T027d,T027i,T027n] Phase 1.5 go/no-go: rank correlation >= 0.90 AND redaction FP <= 15% AND session lifecycle integration test passes → proceed to Phase 2
<!-- /ANCHOR:phase-1-5 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Extraction & Relationship Boost (2-4 weeks)

### Extraction Adapter (5 days)
- [ ] T029 [B:T027o] Create `lib/extraction/extraction-adapter.ts` module
- [ ] T030 Define extraction rule schema (`{ toolPattern: RegExp, contentPattern: RegExp, attention: number, summarizer: string }`)
- [ ] T031 Implement rule matching (priority order, first match wins); at startup validate all rule regexes via TypeScript polynomial-time safety check (reject nested quantifiers, backreferences with quantifiers per ADR-006) — abort with clear error if any rule is unsafe
- [ ] T032 Add tool-specific rules (Read spec.md -> 0.9, Grep error -> 0.8, Bash git commit -> 0.7)
- [ ] T033 Implement summarizers (`firstLast500`, `matchCountSummary`, `stdoutSummary`)
- [ ] T034 [B:T000c] Register extraction hook via `registerAfterToolCallback()` from context-server
- [ ] T035 Insert extracted items to working_memory with attention score, current `event_counter`, and provenance metadata (`source_tool`, `source_call_id`, `extraction_rule_id`, `redaction_applied`)

### PII / Secret Redaction Gate (2 days)
- [ ] T035a [B:T027o] Create `lib/extraction/redaction-gate.ts` module using calibrated patterns from Phase 1.5 (T027g-T027h); implement commit-hash/UUID exclusion heuristics; FP rate verified <= 15% (T027i)
- [ ] T035b Apply redaction gate to all extracted content BEFORE inserting into working_memory; replace matches with `[REDACTED]` placeholder
- [ ] T035c Set `redaction_applied: true` in provenance metadata when any pattern matched
- [ ] T035d [P] Write unit tests for redaction patterns (10 secret formats: API key, bearer token, email, PEM block, AWS AKIA prefix, GCP service account, etc.)
- [ ] T035e [P] Write unit tests for passthrough (normal code content not redacted)

### Extraction Tests
- [ ] T036 [P] Write unit tests for rule matching (10 test cases with different tool/content patterns)
- [ ] T037 [P] Write unit tests for summarizers (verify character limits, truncation)

### Causal Boost (4 days)
- [ ] T038 [B:T027o] Create `lib/search/causal-boost.ts` module (traverses `lib/storage/causal-edges.ts`)
- [ ] T039 Implement 2-hop traversal via causal_edges table (SQLite recursive CTE query)
- [ ] T040 Calculate causal boost (`0.05 / hopDistance` for each neighbor, max 0.05 per hop)
- [ ] T041 Implement deduplication (if neighbor already in semantic results, boost score instead of duplicate)
- [ ] T042 Integrate causal boost into `handlers/memory-search.ts` post-RRF (combine with session boost, max 0.20 total)
- [ ] T043 [P] Write unit tests for traversal (1-hop, 2-hop, no edges, cyclic edges)
- [ ] T044 [P] Write unit tests for deduplication (neighbor in top-20, neighbor not in top-20)

### System Prompt Injection (2 days)
- [ ] T045 [B:T035] Implement working memory auto-inclusion in system prompt (query top-5 by attention)
- [ ] T046 Add session resume detection (check for `session_id` in context, load working memory if present)
- [ ] T047 [P] Write integration tests for prompt injection (verify working memory appears in prompt)

### Integration Testing (3 days)
- [ ] T048 [B:T037,T044,T047] Write end-to-end extraction test (Read tool -> redaction gate -> working_memory -> search -> boosted rank)
- [ ] T049 Write end-to-end causal test (query with causal edges -> neighbors boosted -> top-5 includes related)
- [ ] T050 Measure extraction precision on 50-session test set (false positives <= 15%)
- [ ] T051 Measure extraction recall on 50-session test set (false negatives <= 30%)
- [ ] T052 Verify manual save reduction (count `/memory:save` calls in test sessions, target <= 40% baseline)
- [ ] T053 Verify top-5 MRR (Mean Reciprocal Rank >= 0.95x baseline)

### Phase 2 Sign-Off
- [ ] T054 [B:T053] Review Phase 2 metrics with tech lead (precision, recall, MRR, manual saves, redaction rate)
- [ ] T055 [B:T054] Deploy Phase 2 with feature flags OFF (dark launch)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Monitoring & Rollout (1 week)

### Telemetry & Logging (2 days)
- [ ] T056 [B:T055] Create telemetry dashboard for boost metrics (session boost rate, causal boost rate, pressure activation rate)
- [ ] T057 Add response metadata fields (`applied_boosts`, `pressure_level`, `extraction_count`)
- [ ] T058 Implement logging for extraction matches (tool, attention score, working_memory insert)
- [ ] T059 Implement logging for pressure overrides (original mode, override mode, token ratio)
- [ ] T060 Implement logging for boost calculations (session boost, causal boost, final multiplier)

### Gradual Rollout (3 days)
- [ ] T061 [B:T060] Enable feature flags for 10% users (SPECKIT_ROLLOUT_PERCENT=10)
- [ ] T062 Monitor telemetry for 24 hours (rank correlation, token waste, context errors)
- [ ] T063 Increase rollout to 50% users (SPECKIT_ROLLOUT_PERCENT=50)
- [ ] T064 Monitor telemetry for 48 hours (same metrics)
- [ ] T065 Increase rollout to 100% users (SPECKIT_ROLLOUT_PERCENT=100)
- [ ] T066 Run user satisfaction survey (continuity, relevance, performance, trust - target >= 4.0/5.0)

### Runbook & Documentation (2 days)
- [ ] T067 [P] Create rollback runbook (flip flags, verify baseline, smoke tests)
- [ ] T068 [P] Update API documentation with response metadata fields
- [ ] T069 [P] Update user documentation with "automatic memory management" feature description
- [ ] T070 [P] Document feature flag environment variables (defaults, examples, troubleshooting)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:quality-phases -->
## Memory Quality Phases (QP-0 → QP-4)

> **Source**: `research.md` 50-file audit, root causes RC1–RC5. These phases run in parallel with Phase 0–3 where feasible. QP-0 and QP-1 can begin immediately; QP-4 deferred until QP-2/QP-3 stable.

---

### QP-0: Baseline & Test Harness (1-2 days)

- [ ] TQ001 Create quality benchmark suite: 10 known-bad example memory files (one per defect class: `[TBD]` leakage, `[N/A]` leakage, malformed `spec_folder`, empty `trigger_phrases`, generic fallback sentence, contamination phrase, migration path artifact, `message_count: 0` + zero tool, mixed placeholder+boilerplate, nested/compound defects)
- [ ] TQ002 Create 10 known-good example memory files (high-signal, specific decisions, non-empty triggers, no orchestration chatter)
- [ ] TQ003 [P] Commit benchmark fixtures to `scratch/quality-benchmarks/good/` and `scratch/quality-benchmarks/bad/`
- [ ] TQ004 [P] Run current `generate-context.js` output through quality scorer on active 25 files; record baseline quality-band distribution (A/B/C/D counts and rates)
- [ ] TQ005 Document baseline in `scratch/quality-baseline.md` (band distribution, per-defect-class counts, reference to research.md prevalence rates)

**Pass/Fail Threshold**: All 10 known-bad fixtures produce validator FAIL; all 10 known-good fixtures produce PASS. Any regression in fixture outcomes blocks QP-1.

---

### QP-1: Post-Render Validator + Contamination Filter (2-3 days)

- [ ] TQ010 Implement `scripts/dist/memory/validate-memory-quality.js` with the following hard checks:
  - **Rule V1**: Any `[TBD]` in non-optional fields (`decisions`, `next_actions`, `blockers`, `readiness`) → FAIL with "placeholder leakage: field=[field_name]"
  - **Rule V2**: Any `[N/A]` in fields that should have values when session had tool executions → FAIL
  - **Rule V3**: `spec_folder` field contains markdown formatting (`**`, `*`, `[`) or gate-prompt string (`"Before I proceed"`) → FAIL with "malformed spec_folder"
  - **Rule V4**: Generic fallback sentence detected (match regex `/No (specific )?decisions were made/i`) → FAIL with "fallback decision text present"
  - **Rule V5**: `trigger_phrases` block is empty AND session had >= 5 tool executions → FAIL with "sparse semantic fields: trigger_phrases empty"
- [ ] TQ011 Wire `validate-memory-quality.js` into `generate-context.js` post-render hook: on FAIL → set quality flag, write to temporary tier (not MCP-indexed), log `QUALITY_GATE_FAIL: [rules_failed]`
- [ ] TQ012 Implement `scripts/extractors/contamination-filter.ts` with phrase denylist:
  - "I'll execute this step by step", "Let me analyze", "I'll now", "Step [0-9]+:", "Let me check", "I need to", "I'll start by"
  - Apply before summary text and trigger candidates are extracted from session narrative
- [ ] TQ013 [P] Write unit tests for validator (each V1–V5 rule: 1 passing and 1 failing case each = 10 tests minimum)
- [ ] TQ014 [P] Write unit tests for contamination filter (5 phrase patterns: 2 positive detections, 2 non-detections for similar-but-legitimate text, 1 edge case empty input)
- [ ] TQ015 [P] Run QP-0 benchmark fixtures through validator — verify: all 10 bad → FAIL, all 10 good → PASS

**Pass/Fail Thresholds**:
- V1-V5 unit tests: 100% pass rate required
- Benchmark fixture test: 0 regressions (all bad → FAIL, all good → PASS)
- On 50 new-file regression run: placeholder leakage <= 5%, malformed `spec_folder` = 0

---

### QP-2: Decision Extraction + Semantic Backfill (3-5 days)

- [ ] TQ020 Modify `scripts/extractors/decision-extractor.ts` — add lexical/rule-based decision cues:
  - Detect decision-indicating patterns in assistant + user turns: `/(decided|chose|will use|approach is|going with|rejected|we'll|selected|prefer|adopt)/i`
  - When cue detected: extract surrounding sentence as decision candidate (up to 200 chars)
  - **Suppression**: When `_manualDecisions` is empty AND no lexical cues found → emit `decision_count: 0` (not the generic fallback sentence)
- [ ] TQ021 Modify `templates/context_template.md` — replace generic fallback sentence at ~line 516–518:
  - Remove: hardcoded "No specific decisions were made during this session." text
  - Add: Handlebars conditional → `{{#if decisions.length}}[decisions list]{{else}}decision_count: 0{{/if}}`
- [ ] TQ022 Implement semantic backfill for `trigger_phrases` in `scripts/extractors/collect-session-data.ts`:
  - When extractor produces empty `trigger_phrases`: extract dominant nouns from changed file names (stem only, e.g., `memory-search.ts` → "memory", "search")
  - Augment with session topic string (split by `-`, remove stop words)
  - Minimum 2 entries after backfill; if still empty → log WARN and set `quality_flags: ['sparse_semantic_fields']`
- [ ] TQ023 Implement `key_topics` backfill with same strategy: dominant file path segments + session noun extraction; minimum 1 entry
- [ ] TQ024 Modify `scripts/extractors/collect-session-data.ts` — replace `[TBD]` / `[Not assessed]` emission:
  - RC1 fix: when data unavailable → omit field entirely (no key emitted) OR set to `null` (never emit `[TBD]` string)
  - Affected fields: `readiness`, `confidence`, preflight/postflight scores
- [ ] TQ025 [P] Write unit tests for decision extractor lexical cues (8 test cases: 4 should-detect patterns, 2 should-not-detect non-decisions, 1 empty session, 1 mixed explicit+lexical)
- [ ] TQ026 [P] Write unit tests for semantic backfill (4 cases: empty triggers → file names used; partial triggers → augmented; already 2+ triggers → untouched; no files changed → topic string used)
- [ ] TQ027 [P] Write unit tests for `[TBD]` suppression (3 cases: field available → value emitted; field unavailable → field omitted; `[Not assessed]` string never appears in output)
- [ ] TQ028 Run QP-0 benchmark fixtures through updated extractor+template: verify decision-fallback-sentence defect class moves from FAIL to PASS; no regressions in other known-good fixtures

**Pass/Fail Thresholds**:
- TQ025–TQ027 unit tests: >= 90% pass rate (allow 1 edge-case exemption with documented reason)
- On 50 new-file regression run: files with concrete decision >= 60% (when session had design choices); empty `trigger_phrases` <= 10%
- Benchmark fixtures: decision-fallback defect class PASS; no new regressions in good files

---

### QP-3: Quality Score Persistence + KPI (1-2 days)

- [ ] TQ030 Implement `scripts/extractors/quality-scorer.ts` module:
  - Inputs: rendered memory file content (post-filter, pre-write)
  - Outputs: `quality_score: number` (0.0–1.0) and `quality_flags: string[]`
  - Scoring logic:
    - Start at 1.0; deduct 0.25 for each failing validator rule (V1–V5, capped at 0.0)
    - `quality_flags` members: `has_placeholders`, `has_fallback_decision`, `has_contamination`, `sparse_semantic_fields`
  - Bonus: +0.05 for `message_count > 0`, +0.05 for `tool_count > 0`, +0.10 for >= 1 concrete decision
- [ ] TQ031 Persist `quality_score` and `quality_flags` in YAML front-matter of generated memory files
- [ ] TQ032 Expose `quality_score` and `quality_flags` fields in `memory_save` pipeline (write to MCP index alongside embedding)
- [ ] TQ033 Enable `memory_search` to filter by `min_quality_score` parameter (configurable, default: no filter; recommended threshold 0.3)
- [ ] TQ034 [P] Write unit tests for quality scorer (5 test cases: all-bad → score 0.0; all-good → score >= 0.9; mixed 2-failures → score 0.5; edge-case empty file → score 0.0 with all flags set; bonus conditions → score > 1.0 clamped to 1.0)
- [ ] TQ035 [P] Build daily KPI script (`scripts/kpi/quality-kpi.sh`): scan active memory files, compute: placeholder rate, fallback rate, contamination rate, empty `trigger_phrases` rate; output JSON + human summary; alert if any rate exceeds threshold

**Pass/Fail Thresholds**:
- TQ034 unit tests: 100% pass (quality scoring must be deterministic)
- 100% of new memories carry `quality_score` and `quality_flags` within 24h of QP-3 deployment
- KPI dashboard running daily with < 1min execution time

---

### QP-4: Legacy Remediation (2-4 days — deferred after QP-3 stable)

- [ ] TQ040 [B:TQ035] Identify all 104 files containing `003-memory-and-spec-kit` legacy path references (confirmed in research.md: 55.6% of 187 files)
- [ ] TQ041 Run shadow retrieval comparison BEFORE remediation: record top-5 results for 20 representative queries (store in `scratch/quality-legacy-baseline.json`)
- [ ] TQ042 Batch re-normalize stale path references in active tier (25 files): replace `003-memory-and-spec-kit` with `003-system-spec-kit` in all YAML fields and content paths
- [ ] TQ043 Isolate fixture/test memory files (`044-speckit-test-suite/`, `030-gate3-enforcement/`) — downgrade to `archived` importance tier; exclude from production ranking
- [ ] TQ044 Re-index all normalized active-tier files via `memory_index_scan`
- [ ] TQ045 Run shadow retrieval comparison AFTER remediation: re-run same 20 queries; compare MRR (target: >= 0.98x pre-remediation baseline)
- [ ] TQ046 Document results in `scratch/quality-legacy-results.md` (files changed, MRR comparison, any retrieval regressions)
- [ ] TQ047 [P] Archive remediation: for z_archive files (162 files) with legacy paths — do NOT rewrite; mark as archived tier in index; exclude from active search unless explicitly requested

**Pass/Fail Thresholds**:
- Shadow retrieval MRR after remediation >= 0.98x baseline (hard gate; rollback if fails)
- Legacy-path references in active tier (25 files): reduced to <= 2 remaining after TQ042
- Legacy-path references in z_archive tier: no change required (archived, not production-ranked)
<!-- /ANCHOR:quality-phases -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks marked `[x]` (T000a-T000l, T001-T070, TQ001-TQ035 except deferred TQ040-TQ047)
- [ ] No `[B]` blocked tasks remaining
- [ ] Shadow evaluation shows >= 15% token waste reduction, <= 25% baseline context errors
- [ ] Rank correlation >= 0.90 on 1000-query test set (Phase 1.5 hardening gate — eval-dataset-1000.json)
- [ ] Extraction precision >= 85%, recall >= 70%
- [ ] Manual saves <= 40% baseline
- [ ] Top-5 MRR >= 0.95x baseline
- [ ] User satisfaction >= 4.0/5.0 on continuity survey
- [ ] 100% rollout complete with telemetry dashboards live
- [ ] PII redaction gate passes all 10-format unit tests (no secrets in working_memory)
- [ ] Redaction FP rate <= 15% on 50 Bash outputs (Phase 1.5 calibration, T027i)
- [ ] Commit-hash/UUID exclusion heuristics implemented and tested (T027g)
- [ ] Session lifecycle contract implemented and integration-tested (T027k-T027n)
- [ ] All extraction rule regexes validated as safe at startup (no ReDoS-vulnerable patterns)
- [ ] Memory quality gates met (SC-006–SC-013 or user-approved deferral for SC-010–SC-013):
  - Placeholder leakage <= 2% over 14-day rolling window (TQ015, TQ011)
  - Generic fallback sentence in new files <= 10% (TQ021, TQ028)
  - Contamination phrase occurrence in new files <= 1% (TQ012, TQ014)
  - Empty `trigger_phrases` in new files <= 5% (TQ022, TQ026)
  - 100% of new memories carry `quality_score` and `quality_flags` (TQ031-TQ032)
- [ ] Benchmark fixture suite passing: all 10 known-bad → FAIL, all 10 known-good → PASS (TQ001-TQ015)
- [ ] Daily KPI script operational (TQ035)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:phase-package-tasks -->
## Phase Package Task Mapping

This section maps root tasks to dedicated subfolder planning packages.

| Package Folder | Root Task Coverage | Notes |
|----------------|--------------------|-------|
| `001-foundation-phases-0-1-1-5/` | `T000a-T028`, `T027a-T027o` | Foundation + hardening gate; blocks Phase 2 start |
| `002-extraction-rollout-phases-2-3/` | `T029-T070` | Depends on `T027o` go/no-go sign-off |
| `003-memory-quality-qp-0-4/` | `TQ001-TQ047` | Runs in parallel where possible; `TQ040-TQ047` deferred until QP-2/QP-3 stable |
| `research/` | N/A (source-only) | Contains source analysis and recommendation docs used as planning inputs |

Sync requirement:
- Keep this mapping aligned with package-local `tasks.md` files in the same commit.
- Keep requirement ownership aligned with root `plan.md` section `2.7. REQUIREMENT OWNERSHIP MATRIX (FROZEN)`; `REQ-014` and `REQ-017` are owned by package `001-foundation-phases-0-1-1-5/` and consumed by package `002-extraction-rollout-phases-2-3/`.
<!-- /ANCHOR:phase-package-tasks -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` for requirements (REQ-001 through REQ-023) and research findings (§3.5)
- **Plan**: See `plan.md` for architecture, phases (including Phase 1.5 and Memory Quality Phases QP-0 to QP-4), ADRs
- **Checklist**: See `checklist.md` for verification items (CHK-001 through CHK-200+)
- **Decisions**: See `decision-record.md` for ADR-001 through ADR-006
- **Research**: See `research.md` for 50-file memory quality audit, root causes RC1–RC5, P0/P1/P2 recommendations with acceptance metrics
- **Research Sources**: See `research/136 - analysis-working-memory-hybrid-rag-systems.md` and `research/136 - recommendations-working-memory-hybrid-rag-adoption.md`
- **Phase Packages**: See `001-foundation-phases-0-1-1-5/`, `002-extraction-rollout-phases-2-3/`, `003-memory-quality-qp-0-4/` for dedicated phase documentation
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 3+ TASKS (v1.4 — 2026-02-18)
- Phase 0: 12 tasks (T000a-T000l) — hook pipeline (non-blocking queued), token-usage three-tier contract, eval dataset (100 queries)
- Phase 1: T001-T028 — core cognitive automation (shadow eval on 100-query set, indicative)
- Phase 1.5: T027a-T027o — hardening gate (expand to 1000 queries, redaction calibration FP<=15%, session lifecycle contract)
- Phase 2: T029-T055 — extraction + PII redaction (calibrated patterns) + causal boost (T035a-T035e)
- Phase 3: T056-T070 — monitoring, rollout, documentation
- Quality Phases: TQ001-TQ047 — memory content quality (benchmark suite, validator, contamination filter, decision extraction, quality scoring, legacy remediation)
  - QP-0 (TQ001-TQ005): baseline + test harness
  - QP-1 (TQ010-TQ015): post-render validator + contamination filter; thresholds: leakage <= 5%, malformed spec_folder = 0
  - QP-2 (TQ020-TQ028): decision extraction (lexical cues) + semantic backfill; thresholds: decisions >= 60%, empty triggers <= 10%
  - QP-3 (TQ030-TQ035): quality score persistence + KPI dashboard; threshold: 100% coverage
  - QP-4 (TQ040-TQ047): legacy remediation (deferred); threshold: MRR >= 0.98x, active-tier legacy refs <= 2
- Blocked dependencies explicit (T000l gates Phase 1, T027o gates Phase 2, T055 gates Phase 3, TQ035 gates TQ040)
- Parallelizable tasks marked [P]
- Canonical paths: lib/cache/cognitive/working-memory.ts, lib/storage/causal-edges.ts
- No stale line number references — locate blocks at runtime
- REQ-016 (session lifecycle contract) → T027k-T027n
- REQ-017 (redaction calibration) → T027e-T027j
- REQ-018 (quality gate) → TQ010-TQ015
- REQ-019 (contamination filter) → TQ012-TQ014
- REQ-020 (decision fallback suppression) → TQ020-TQ021
- REQ-021 (semantic backfill) → TQ022-TQ023
- REQ-022 (quality score) → TQ030-TQ032
- REQ-023 (decision extraction) → TQ020, TQ025
-->
