# Verification Checklist: Working Memory + Hybrid RAG Automation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

### P0

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001 through REQ-023, including quality gate requirements REQ-018–023 from research.md findings)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (Phase 0+1+2+3, ADRs, dependencies)

### P1

- [ ] CHK-003 [P1] Dependencies identified and available (RRF fusion, working_memory table, causal_edges table, context-server dispatch hook)
- [ ] CHK-004 [P1] Shadow evaluation Phase 0 gate prepared: 100 real queries from memory_search logs with baseline rankings, stored in scratch/eval-dataset-100.json; Phase 1.5 gate: expand to 1000 queries (scratch/eval-dataset-1000.json) before Phase 2
- [ ] CHK-005 [P1] Feature flag environment variables documented (defaults, examples)
- [ ] CHK-006 [P1] Phase 0 prerequisites complete (hook pipeline, tokenUsage contract, eval dataset) before Phase 1 begins
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

### P0

- [ ] CHK-010 [P0] Code passes TypeScript strict mode (no implicit any, null safety)
- [ ] CHK-011 [P0] No console errors or warnings in MCP server startup

### P1

- [ ] CHK-012 [P1] Error handling implemented (config validation, query failures, hook errors)
- [ ] CHK-013 [P1] Code follows project patterns (existing MCP handler structure)
- [ ] CHK-014 [P1] ESLint passes with no disabled rules

### P2

- [ ] CHK-015 [P2] Code comments adequate (complex algorithms documented: decay, boost, traversal)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

### P0

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-023 verified — P0: REQ-001–005, REQ-011–012, REQ-016–020; P1: REQ-006–010, REQ-013–015, REQ-021–023)
- [ ] CHK-021 [P0] Unit tests pass (decay, boost bounds, pressure thresholds, rule matching)
- [ ] CHK-022 [P0] Integration tests pass (RRF + boost, extraction -> search, causal traversal)

### P1

- [ ] CHK-023 [P1] Shadow evaluation complete (Phase 0: 100 queries indicative; Phase 1.5 gate: 1000 queries, rank correlation >= 0.90) [Evidence: scratch/phase1-eval-results.md, scratch/phase1-5-eval-results.md]
- [ ] CHK-024 [P1] Pressure simulation complete (50 sessions, zero context-exceeded errors)
- [ ] CHK-025 [P1] Extraction precision >= 85% (false positives measured on test set)
- [ ] CHK-026 [P1] Extraction recall >= 70% (false negatives measured on test set)
- [ ] CHK-027 [P1] Token waste <= 85% baseline (sessions >20 turns, payload size comparison)
- [ ] CHK-028 [P1] Context errors <= 75% baseline ("context exceeded" count in pressure simulation)

### P2

- [ ] CHK-029 [P2] Manual testing complete (multi-turn sessions, pause/resume, extraction verification)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

### P0

- [ ] CHK-030 [P0] No hardcoded secrets (config values from environment only)
- [ ] CHK-031 [P0] SQL injection prevention verified (parameterized queries in session-boost, causal-boost)
- [ ] CHK-035 [P0] PII/secret redaction gate implemented (lib/extraction/redaction-gate.ts) — API keys, bearer tokens, emails, PEM blocks, AWS/GCP key prefixes covered
- [ ] CHK-036 [P0] Extraction rule regexes validated at startup (no catastrophic backtracking / ReDoS-vulnerable patterns; validated via TypeScript polynomial-time safety check per ADR-006)

### P1

- [ ] CHK-032 [P1] Config validation prevents injection (Zod type coercion, no eval/exec)
- [ ] CHK-033 [P1] Working memory capacity enforced (max 7 items, LRU eviction)
- [ ] CHK-037 [P1] Redaction unit tests pass — 10 secret formats verified (API key, bearer token, email, PEM block, AWS AKIA, GCP service account, private key, JWT, URL with credentials, hex token)
- [ ] CHK-038 [P1] Provenance metadata attached to all extracted working_memory rows (source_tool, source_call_id, extraction_rule_id, redaction_applied)

### P2

- [ ] CHK-034 [P2] Logging sanitized (no PII, no sensitive tokens in debug output)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

### P1

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized (all cross-references valid)
- [ ] CHK-041 [P1] Decision records complete (ADR-001 through ADR-006 with Five Checks)
- [ ] CHK-042 [P1] API documentation updated (response metadata fields: applied_boosts, pressure_level, extraction_count, redaction_applied)

### P2

- [ ] CHK-043 [P2] User documentation updated (automatic memory management feature description)
- [ ] CHK-044 [P2] Feature flag documentation complete (environment variables, defaults, troubleshooting)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

### P1

- [ ] CHK-050 [P1] Temp files in scratch/ only (shadow eval results, test logs)
- [ ] CHK-051 [P1] scratch/ cleaned before completion (only final results retained; NOTE: `scratch/opencode-working-memory/` and `scratch/graphrag-hybrid/` contain `.git` directories with pack files — these must be removed before any commit)

### P2

- [ ] CHK-052 [P2] Analysis findings saved to memory/ (if any new patterns discovered)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 47 | [ ]/47 |
| P1 Items | 71 | [ ]/71 |
| P2 Items | 16 | [ ]/16 |

**Verification Date**: TBD
<!-- /ANCHOR:summary -->

---

<!-- Append to Level 2 checklist.md -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

### P0

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001 through ADR-006)

### P1

- [ ] CHK-101 [P1] All ADRs have status (Accepted for ADR-001 through ADR-006)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale (Python microservice, Neo4j, unbounded boosts, time-based decay, hardcoded rules, LLM extraction, no redaction gate, unbounded regex)
- [ ] CHK-103 [P1] Five Checks evaluation complete for each ADR (Necessary, Beyond Local Maxima, Sufficient, Fits Goal, Open Horizons)

### P2

- [ ] CHK-104 [P2] Migration path documented (schema migrations for event_counter, mention_count columns)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

### P1

- [ ] CHK-110 [P1] Response time targets met (NFR-P01: session boost <10ms p95)
- [ ] CHK-111 [P1] Throughput targets met (NFR-P02: causal traversal <20ms p95)
- [ ] CHK-112 [P1] Extraction latency acceptable (NFR-P03: hook adds <5ms per tool)

### P2

- [ ] CHK-113 [P2] Load testing completed (1000 concurrent searches with boost enabled)
- [ ] CHK-114 [P2] Performance benchmarks documented (baseline vs boosted latency comparison)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

### P0

- [ ] CHK-120 [P0] Rollback procedure documented and tested (flip flags, verify baseline, smoke tests)
- [ ] CHK-121 [P0] Feature flags configured (all flags OFF by default, gradual rollout percentages)

### P1

- [ ] CHK-122 [P1] Monitoring/alerting configured (telemetry dashboard for boost metrics)
- [ ] CHK-123 [P1] Runbook created (rollback steps, smoke test commands, troubleshooting)

### P2

- [ ] CHK-124 [P2] Deployment runbook reviewed by tech lead
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:phase1-verify -->
## Phase 0 Verification (Prerequisites)

### P0

- [ ] CHK-125 [P0] Hook pipeline implemented (`afterToolCallbacks` array + `registerAfterToolCallback()` in context-server.ts)
- [ ] CHK-126 [P0] Token-usage signal three-tier contract defined: (1) `tokenUsage?: number` in tool-schemas.ts schema; (2) server-side estimator fallback documented; (3) WARN log when neither available — no override (pass-through)
- [ ] CHK-127 [P0] Evaluation Phase 0 dataset created (scratch/eval-dataset-100.json, 100 queries with baseline rankings)

### P1

- [ ] CHK-128 [P1] Hook unit tests pass (registration, invocation, per-callback error isolation)
- [ ] CHK-129 [P1] tokenUsage three-tier unit tests pass: (1) 0.85 explicit → override active; (2) undefined + estimator available → override active; (3) undefined + estimator unavailable → WARN + no override; (4) out-of-range → clamped 0.0–1.0

---

## Phase 1 Verification (Core Automation)

### P0

- [ ] CHK-130 [P0] Config module created with Zod validation (configs/cognitive.ts)
- [ ] CHK-131 [P0] Schema migration applied (event_counter, mention_count columns added)
- [ ] CHK-132 [P0] Event-based decay implemented (lib/cache/cognitive/working-memory.ts, floor 0.05, delete 0.01)
- [ ] CHK-133 [P0] Session-attention boost integrated (handlers/memory-search.ts, bounded 0.20)
- [ ] CHK-134 [P0] Pressure monitor integrated (handlers/memory-context.ts, >80% -> quick, 60-80% -> focused; three-tier fallback: caller value → server-side estimator → WARN+no override)

### P1

- [ ] CHK-135 [P1] Shadow evaluation shows token waste <= 85% baseline [Evidence: scratch/phase1-eval-results.md]
- [ ] CHK-136 [P1] Shadow evaluation shows context errors <= 75% baseline [Evidence: scratch/phase1-eval-results.md]
- [ ] CHK-137 [P1] Shadow evaluation rank correlation >= 0.90 on 1000-query Phase 1.5 set (HARD GATE for Phase 2) [Evidence: scratch/phase1-5-eval-results.md]
- [ ] CHK-138 [P1] Unit tests pass for Phase 1 modules (decay, boost, pressure) [Evidence: npm test output]
- [ ] CHK-139 [P1] Integration tests pass for RRF + boost pipeline [Evidence: npm test output]
<!-- /ANCHOR:phase1-verify -->

---

<!-- ANCHOR:phase1-5-verify -->
## Phase 1.5 Verification (Hardening Gate)

### P0

- [ ] CHK-155 [P0] Eval dataset expanded to 1000 queries (scratch/eval-dataset-1000.json, 200 per intent type, ~10% human-reviewed) [Evidence: file + review log]
- [ ] CHK-156 [P0] Rank correlation >= 0.90 on 1000-query set (HARD GATE for Phase 2) [Evidence: scratch/phase1-5-eval-results.md]
- [ ] CHK-157 [P0] Redaction calibration complete: 50 real Bash outputs collected and processed (scratch/redaction-calibration.md) [Evidence: calibration file]
- [ ] CHK-158 [P0] Redaction FP rate <= 15% on 50 Bash outputs (HARD GATE for Phase 2) [Evidence: scratch/redaction-calibration.md]
- [ ] CHK-159 [P0] Commit-hash/UUID exclusion heuristics added to redaction-gate.ts (40-char hex SHA + UUID pattern excluded) [Evidence: code review]

### P1

- [ ] CHK-159a [P1] Session lifecycle contract defined: session_id scope, event_counter boundary on new vs resumed session, resume working_memory load behavior [Evidence: API schema + plan.md update]
- [ ] CHK-159b [P1] Session lifecycle integration test passes: new session → event_counter=0; resume → counter continues; working_memory survives resume [Evidence: npm test output]
<!-- /ANCHOR:phase1-5-verify -->

---

<!-- ANCHOR:phase2-verify -->
## Phase 2 Verification (Extraction & Causal)

### P0

- [ ] CHK-140 [P0] Extraction adapter created (lib/extraction/extraction-adapter.ts)
- [ ] CHK-141 [P0] Tool-class rules defined (Read spec.md -> 0.9, Grep error -> 0.8, Bash git commit -> 0.7)
- [ ] CHK-142 [P0] Extraction hook registered via registerAfterToolCallback() (tool completion triggers working_memory insert)
- [ ] CHK-143 [P0] Causal boost module created (lib/search/causal-boost.ts, traverses lib/storage/causal-edges.ts)
- [ ] CHK-144 [P0] 2-hop traversal implemented (causal_edges table query, bounded 0.05/hop)
- [ ] CHK-145 [P0] Causal boost integrated (handlers/memory-search.ts, combined with session boost, max 0.20 total)
- [ ] CHK-152 [P0] Redaction gate applied before all working_memory inserts [Evidence: code review + unit tests]
- [ ] CHK-153 [P0] Provenance metadata attached to all extracted rows (source_tool, source_call_id, extraction_rule_id, redaction_applied) [Evidence: DB schema + unit tests]
- [ ] CHK-154 [P0] Extraction rule regexes validated safe at startup (no ReDoS risk) [Evidence: startup log showing validation pass]

### P1

- [ ] CHK-146 [P1] Extraction precision >= 85% [Evidence: scratch/phase2-extraction-metrics.md]
- [ ] CHK-147 [P1] Extraction recall >= 70% [Evidence: scratch/phase2-extraction-metrics.md]
- [ ] CHK-148 [P1] Manual saves <= 40% baseline [Evidence: scratch/phase2-manual-save-comparison.md]
- [ ] CHK-149 [P1] Top-5 MRR >= 0.95x baseline [Evidence: scratch/phase2-mrr-results.md]
- [ ] CHK-150 [P1] Unit tests pass for Phase 2 modules (extraction, causal, redaction) [Evidence: npm test output]
- [ ] CHK-151 [P1] Integration tests pass for extraction -> redaction -> search -> boost [Evidence: npm test output]
<!-- /ANCHOR:phase2-verify -->

---

<!-- ANCHOR:phase3-verify -->
## Phase 3 Verification (Rollout)

### P0

- [ ] CHK-160 [P0] Telemetry dashboard live (boost rates, pressure activation, extraction counts)
- [ ] CHK-161 [P0] Response metadata fields added (applied_boosts, pressure_level, extraction_count)

### P1

- [ ] CHK-162 [P1] Gradual rollout complete (10% -> 50% -> 100% with 24-48hr monitoring per stage)
- [ ] CHK-163 [P1] User satisfaction survey complete (continuity, relevance, performance, trust) [Evidence: scratch/phase3-user-survey-results.md]
- [ ] CHK-164 [P1] User satisfaction >= 4.0/5.0 on continuity [Evidence: scratch/phase3-user-survey-results.md]

### P2

- [ ] CHK-165 [P2] Logging verified (extraction matches, pressure overrides, boost calculations captured)
- [ ] CHK-166 [P2] Runbook tested (rollback procedure executed in staging environment)
<!-- /ANCHOR:phase3-verify -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

### P1

- [ ] CHK-170 [P1] TypeScript strict mode enabled (tsconfig.json verified)
- [ ] CHK-171 [P1] No external dependencies added (Python, Docker, Neo4j, Qdrant confirmed absent)
- [ ] CHK-172 [P1] SQL injection prevention verified (parameterized queries in all boost/traversal modules)

### P2

- [ ] CHK-173 [P2] License compliance verified (no new licenses, reusing existing MIT/Apache)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:metrics-verify -->
## L3+: SUCCESS METRICS VERIFICATION

### P0

- [ ] CHK-180 [P0] SC-001: Token waste reduction >= 15% [Evidence: scratch/final-metrics.md]
- [ ] CHK-181 [P0] SC-002: Context errors <= 25% baseline [Evidence: scratch/final-metrics.md]

### P1

- [ ] CHK-182 [P1] SC-003: Manual saves <= 60% of baseline (40% reduction) [Evidence: scratch/final-metrics.md]
- [ ] CHK-183 [P1] SC-004: Top-5 MRR >= 0.95x baseline [Evidence: scratch/final-metrics.md]
- [ ] CHK-184 [P1] SC-005: User satisfaction >= 4.0/5.0 [Evidence: scratch/phase3-user-survey-results.md]
<!-- /ANCHOR:metrics-verify -->

---

<!-- ANCHOR:quality-verify -->
## Memory Content Quality Verification (research.md findings)

> **Research baseline** (n=50): 60% `[N/A]` leakage, 66% generic fallback, 34% empty `trigger_phrases`, 18% contamination. Targets derived from research.md P0/P1/P2 recommendations. See `research.md` for full root-cause attribution and evidence ledger.

### P0

- [ ] CHK-190 [P0] Quality benchmark suite created: 10 known-bad (one per defect class) + 10 known-good memory files committed to `scratch/quality-benchmarks/` [Evidence: file listing + git commit]
- [ ] CHK-191 [P0] Post-render quality validator implemented (`scripts/dist/memory/validate-memory-quality.js`): rules V1–V5 active (placeholder leakage, malformed spec_folder, fallback sentence, empty trigger_phrases) [Evidence: code review + unit tests]
- [ ] CHK-192 [P0] Benchmark fixture regression test passes: all 10 known-bad → FAIL; all 10 known-good → PASS [Evidence: test run output in scratch/quality-benchmark-results.md]
- [ ] CHK-193 [P0] Contamination filter implemented (`scripts/extractors/contamination-filter.ts`): orchestration phrase denylist applied before summary/trigger extraction [Evidence: code review + unit tests]
- [ ] CHK-194 [P0] Validator wired into `generate-context.js`: failed files not indexed to MCP production tier; `QUALITY_GATE_FAIL` logged with failing rules [Evidence: integration test log]
- [ ] CHK-195 [P0] Decision fallback sentence suppressed: `templates/context_template.md` updated — generic boilerplate removed; `decision_count: 0` emitted when no decisions found [Evidence: template diff + unit test]
- [ ] CHK-196 [P0] `[TBD]` / `[Not assessed]` emission eliminated from `collect-session-data.ts`: unavailable fields omitted or null, never placeholder strings [Evidence: code review + TQ027 unit tests]

### P1

- [ ] CHK-197 [P1] Decision extractor enhanced with lexical/rule-based cues: decision-indicating patterns detected from assistant/user turns [Evidence: TQ025 unit tests pass (>= 90% pass rate)]
- [ ] CHK-198 [P1] Semantic backfill active: `trigger_phrases` and `key_topics` populated via dominant nouns when extractor produces empty lists [Evidence: TQ026 unit tests pass]
- [ ] CHK-199 [P1] Quality score module implemented (`scripts/extractors/quality-scorer.ts`): `quality_score` (0.0–1.0) and `quality_flags` array computed and persisted in memory YAML front-matter [Evidence: TQ034 unit tests pass — deterministic output for all 5 test cases]
- [ ] CHK-200 [P1] `quality_score` + `quality_flags` exposed in MCP index (`memory_save` pipeline) [Evidence: DB schema + integration test]
- [ ] CHK-201 [P1] Retrieval filtering by `min_quality_score` supported in `memory_search` [Evidence: API test + code review]
- [ ] CHK-202 [P1] Daily KPI script operational (`scripts/kpi/quality-kpi.sh`): placeholder rate, fallback rate, contamination rate, empty `trigger_phrases` rate reported daily [Evidence: cron job + scratch/quality-kpi-sample.md]

### P1 — Quality KPI Targets (verified over 14-day rolling window)

- [ ] CHK-203 [P1] SC-006: Placeholder leakage rate in new files <= 2% over 14-day rolling window (baseline: 40–60%) [Evidence: scratch/quality-kpi-14day.md]
- [ ] CHK-204 [P1] SC-007: Generic fallback decision sentence in new files <= 10% (baseline: 66%) [Evidence: scratch/quality-kpi-14day.md]
- [ ] CHK-205 [P1] SC-008: Contamination phrase occurrence in new files <= 1% (baseline: 18%) [Evidence: scratch/quality-kpi-14day.md]
- [ ] CHK-206 [P1] SC-009: Empty `trigger_phrases` in new files <= 5% (baseline: 34%) [Evidence: scratch/quality-kpi-14day.md]
- [ ] CHK-207 [P1] SC-010: Empty `key_topics` in new files <= 5% (baseline: 10%) [Evidence: scratch/quality-kpi-14day.md]
- [ ] CHK-208 [P1] SC-011: Files with concrete decision (when session had design choices) >= 70% (baseline: ~34%) [Evidence: scratch/quality-kpi-14day.md]
- [ ] CHK-209 [P1] SC-012: Quality band A+B >= 70% of newly generated files (baseline: 50%) [Evidence: scratch/quality-kpi-14day.md]
- [ ] CHK-210 [P1] SC-013: 100% of new memories include `quality_score` and `quality_flags` [Evidence: DB query on memory table + spot check 10 recent files]

### P2

- [ ] CHK-211 [P2] Legacy path remediation complete (QP-4): active-tier files with `003-memory-and-spec-kit` references reduced from 55.6% to <= 2 files; shadow retrieval MRR maintained >= 0.98x [Evidence: scratch/quality-legacy-results.md]
- [ ] CHK-212 [P2] Fixture/test memories isolated from production ranking: `044-speckit-test-suite/` and `030-gate3-enforcement/` memory tiers downgraded to archived [Evidence: MCP index tier report]
<!-- /ANCHOR:quality-verify -->

---

<!-- ANCHOR:phase-packages-verify -->
## Phase Package Documentation Verification

### P1

- [ ] CHK-213 [P1] Foundation package docs exist (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) and map correctly to root ranges (`001-foundation-phases-0-1-1-5/` -> `T000a-T028`, `T027a-T027o`, `CHK-125-139`, `CHK-155-159b`) [Evidence: package file review]
- [ ] CHK-214 [P1] Extraction/Rollout package docs exist (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) and map correctly to root ranges (`002-extraction-rollout-phases-2-3/` -> `T029-T070`, `CHK-140-166`) [Evidence: package file review]
- [ ] CHK-215 [P1] Memory Quality package docs exist (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) and map correctly to root ranges (`003-memory-quality-qp-0-4/` -> `TQ001-TQ047`, `CHK-190-212`) [Evidence: package file review]

### P2

- [ ] CHK-216 [P2] Package docs and root docs stay synchronized when IDs change, including `research/` source-doc references and package-level omission of `decision-record.md`/`implementation-summary.md` (mapping updated in same change set) [Evidence: diff review]
<!-- /ANCHOR:phase-packages-verify -->

---

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Tech Lead | Engineering | [ ] Approved | |
| Data Reviewer | Analytics | [ ] Approved | |
| Product Owner | Product | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!--
Level 3+ checklist (v1.5 — 2026-02-18) - Full verification + architecture + metrics + memory quality
- 134 total verification items (47 P0, 71 P1, 16 P2) including all L3+ addendums and quality gates
- Phase-specific sections (Phase 0: CHK-125-129, Phase 1: CHK-130-139, Phase 1.5: CHK-155-159b, Phase 2: CHK-140-154, Phase 3: CHK-160-166)
- Success criteria mapped to CHK items (CHK-180-184 automation; CHK-203-213 quality)
- Memory quality section (CHK-190-212): benchmark suite, validator V1-V5, contamination filter, decision fallback suppression, quality score
- Security items expanded (CHK-035 PII redaction, CHK-036 regex safety, CHK-037-038 provenance)
- Evidence requirements explicit ([Evidence: file path])
- Explicit P0 and P1 section headers for all major sections (SECTIONS_PRESENT compliance)
- v1.4: Added CHK-190-212 (memory quality gates from research.md findings); updated summary counts (42→49 P0, 58→73 P1, 13→15 P2)
- v1.4.1: Added CHK-213-216 for phase package documentation verification
- v1.5: Reconciled summary totals with current checklist entries (P0/P1/P2 now 47/71/16)
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
