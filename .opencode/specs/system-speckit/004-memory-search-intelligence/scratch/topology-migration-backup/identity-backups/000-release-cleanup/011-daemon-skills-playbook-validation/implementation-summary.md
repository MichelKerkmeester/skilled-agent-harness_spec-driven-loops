---
title: "Implementation Summary: 028 Daemon Skills Playbook Validation"
description: "Results and findings report for the daemon-skills playbook validation. Stress suites passed (spec-kit 130/130, code-graph 45/45, advisor 57/58). 222 of 471 playbook scenarios ran across three cli models. 14 real product findings documented with remediation, two re-confirmed against the live DB. Report salvaged from the session transcript after the benchmark workspace was wiped."
trigger_phrases:
  - "daemon skills playbook validation results"
  - "028 playbook benchmark findings report"
  - "spec-kit advisor code-graph validation findings"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/000-release-cleanup/011-daemon-skills-playbook-validation"
    last_updated_at: "2026-07-06T19:16:26.550Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the salvaged results and findings report with 14 findings and remediation"
    next_safe_action: "Operator decides whether to re-run the remaining 249 spec-kit scenarios"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-25-summary-011-daemon-skills-playbook-validation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Coverage frozen at 222 of 471 by the workspace wipe. Operator chose salvage over re-run."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

# Implementation Summary

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-daemon-skills-playbook-validation |
| **Completed** | 2026-06-25 |
| **Level** | 2 |
| **Status** | Complete, salvaged, partial coverage (222 of 471) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A validation run of the three daemon-backed system skills and this report. The deliverable is the results and the 14 findings below, not a code change. Nothing in the product was modified.

### 1. Stress results (vitest, run directly)

Stress suites are deterministic code so they ran directly, not through a model.

| Skill | Result |
|-------|--------|
| system-spec-kit | 130/130 pass |
| system-code-graph | 45/45 pass |
| system-skill-advisor | 57/58 pass (the 1 fail is a pre-existing hooks-parity test, not introduced here) |

### 2. Playbook coverage

Each scenario ran once, split across the two active models by index parity, no double-runs. The run reached 222 of 471 (47 percent) before the workspace was wiped.

| Skill | Scenarios run | Total | State |
|-------|---------------|-------|-------|
| system-skill-advisor | 47 | 47 | Complete |
| system-code-graph | 21 | 21 | Complete |
| system-spec-kit | 154 | 403 | Partial, 249 not run |
| **Total** | **222** | **471** | **47 percent** |

code-graph produced zero findings. It is clean across all 21 scenarios.

### 3. Model phases

The run had two model phases because opencode-go billing was blocked and the operator later dropped MiMo.

| Phase | Models | Scenarios |
|-------|--------|-----------|
| 1 | MiMo v2.5 Pro (`xiaomi/mimo-v2.5-pro`) plus Kimi k2.7 (`kimi-for-coding/k2p7`) | first ~130, kept via index-resume |
| 2 | Kimi k2.7 plus gpt-5.5 medium fast (`openai/gpt-5.5-fast --variant medium`) | remaining ~92 |

### 4. Phase-2 verdict tally (authoritative, last poll before the wipe)

| Bucket | Count |
|--------|-------|
| PASS | 56 |
| FAIL | 11 |
| UNCLEAR | 25 |
| timeout | 1 |

Per-model in phase 2: k2p7 32 PASS, 2 FAIL, 12 UNCLEAR. gpt-5.5-fast 24 PASS, 9 FAIL, 13 UNCLEAR.

Critical caveat on the UNCLEAR bucket. Roughly 20 of those 25 are not real verdicts. They are fast-fail junk (scenarios #196 through #217, each 5 seconds, 0 tools, 98 characters) caused by opencode session-DB contention. A concurrent operator opencode session triggered repeated `DELETE FROM session_context_epoch` errors that fast-failed the dispatches. Real UNCLEAR in phase 2 is about 5.

Phase 1 (the kept ~130) was dominated by justified PASSes. The advisor batch alone was 15 PASS and 1 FAIL, with real execution on every spot-check.

### 5. Cross-model comparison

| Model | FAIL rate | Strength |
|-------|-----------|----------|
| gpt-5.5-fast | about a third of classified runs | Broad end-to-end and integration coverage. Found the wiring and schema-drift gaps (F8, F10, F11, F12, F13) |
| Kimi k2.7 | about 12 to 13 percent | Precise single-path verification. Traced the exact line for F14 |
| MiMo v2.5 Pro | about 8 percent | Verbose but efficient at reaching a verdict. Found the rollback atomicity gap (F4) |

Read: gpt-5.5-fast finds roughly three times more real gaps because it runs broad suites and exercises integration paths. k2p7 finds fewer but traces them precisely. k2p7 over-explores heavy stateful daemon scenarios (40 to 49 tools, 400k to 900k characters) and is timeout-prone there. gpt-5.5-fast and MiMo converge faster on that scenario class. For a routine pass, gpt-5.5-fast surfaces the most real product gaps per run.

### 6. Findings (14 real product findings, with remediation)

Severity is the original triage. Each finding lists the scenario, the root cause, the fix, and the test-coverage hole.

#### Advisor persistence and routing cluster

**F1 Routing regression (#65), P0.** Top-1 routing accuracy 0.889 against the 0.92 gate (82 of 100 cases). deep-research and deep-review prompts misroute to the parent deep-loop-workflows skill, `:review:auto` misroutes to sk-code, and several phrases return null. This is the advisor core function regressing. Fix: re-map the deep-research and deep-review trigger phrases to their leaf skills, restore `:review:auto` to the review leaf, handle the null-returning phrases. Test hole: the regression suite caught it but its gate is not wired to a CI exit code. Wire it.

**F2 Input-sanitization gap (#52), P0, security.** Path-traversal and prompt-injection strings persist into SQLite and graph-metadata.json and return unsanitized in the advisor_recommend envelope. The edge-metadata write path is sanitized (it rejects control chars and oversized values), but the skill-metadata write path lacks the same guard. Fix: validate skill metadata at the persistence boundary with the existing edge sanitizer, reject traversal, strip instruction-shaped values, bound paths to the workspace. Test hole: add a sanitizer-boundary test asserting malicious fixtures are rejected or sanitized.

**F3 Validate-scorer regression (#26), P1.** Parity accuracy 50.8 and 42.5 against an 80.5 and 77.5 baseline. The CLI rejects outcomeEvents (exit 64) and outcome totals do not increment because of an un-awaited persist plus debug gating. Fix: investigate the accuracy drop, await the outcome persistence, un-gate totals from the debug flag, accept outcomeEvents in the CLI manifest. Test hole: the validate-slices baseline assertions are not gating.

**F4 Rollback non-atomic (#55), P1.** Rollback removes derived state and resets schema_version but leaves lifecycleStatus and redirectTo behind. Fix: include the lifecycle fields in the rollback transaction. Test hole: extend the rollback acceptance test to assert lifecycle-field cleanup, not just derived removal.

**F5 Warm-latency regression (#63), P2.** In-process warm p95 is 63 milliseconds against the 50 millisecond blocking gate, overall_pass false. The bench still exits 0. Fix: profile the warm path or re-baseline the gate, and make the bench exit non-zero when overall_pass is false.

**F6 Disabled force-native silently succeeds (#64), P2.** With the advisor hook disabled, `--force-native` returns source native exit 0 instead of erroring. Fix: when the hook is disabled, `--force-native` should error with native-unavailable and a non-zero exit.

#### Spec-kit wiring and schema cluster

**F7 Duplicate helper normalizeScopeValue (#139), P2, code quality.** The near-duplicate detector flags a live duplicate of `normalizeScopeValue` across more than one module. Fix: extract it to one shared util and import it. The detection itself works.

**F8 Scoring-observability not wired into memory_search (#155), P2.** The observability logger is implemented and unit-tested (36 tests pass) but the live memory_search pipeline never invokes it, so no search-time observations are recorded in production. Fix: call the post-processing observer from the memory_search scoring path. Test hole: add an integration test asserting a memory_search run records an observation.

**F9 Stale tests lag the implementation (#163), P2, test debt.** Two tests assert old shapes the implementation has moved past (a causal-edges return that now includes a skipped-manual count, and a subscriber list that now includes a semantic-trigger cache). The implementation is correct. Fix: update the two test expectations. Cross-model note: gpt-5.5-fast runs the broad suites and catches this, k2p7 verifies the documented path and passes.

**F10 LLM backfill never registered at bootstrap (#169), P2.** The backfill registrar is defined, exported, and unit-tested, but nothing calls it at startup, so the backfill is dead at runtime even though the scheduling and async invocation exist. Fix: register the backfill function during bootstrap. Test hole: add an integration test asserting it is registered at bootstrap.

**F11 Merge references a missing column source_kind (#133), P1, confirmed real.** The reconsolidation merge query references source_kind, which is absent from the memory and causal-edge tables, so the merge fails at runtime. Re-confirmed against the live DB read-only: source_kind is not present on memories, memory_records, or causal_edges. Fix: add source_kind via migration if intended, or correct the merge query to the actual column. Add a schema-versus-query contract test.

**F12 Consumption logging references a missing column query_text (#177), P1, confirmed real.** The adaptive-ranking path inserts query_text into consumption_log, which fails because that table has query_hash and no query_text. Re-confirmed against the live DB read-only: consumption_log columns are id, event_type, query_hash, intent, mode, result_count, result_ids, session_id, timestamp, latency_ms, spec_folder_filter, metadata. The base logger passes because it uses query_hash, the adaptive path diverges. Fix: align the adaptive insert to query_hash or add query_text via migration. Test hole: a schema contract check never caught the drift.

**F13 Folder rank not applied to final ordering (#183), P2.** Folder relevance computes folder scores and ranks and filters to top folders, but sorts the returned memories by individual score, so a lower-folder-rank memory with a higher individual score can precede higher-folder-rank memories. This violates the documented folder-results-rank-first contract. Fix: make folder rank the primary sort key, then individual score within a folder. Test hole: assert cross-folder ordering by folder rank.

**F14 Entity dedup uses naive normalization (#218), P2.** The entity extractor deduplicates with `item.text.toLowerCase().trim()` instead of the canonical Unicode-aware `normalizeEntityName()` that the linker uses, so the extractor keeps "TF-IDF" and "tf idf" as two entities while the linker consolidates them. Fix: use `normalizeEntityName` in the extractor dedup path so extractor and linker agree. Test hole: assert the extractor and linker normalize entity names consistently. This was one of two real k2p7 finds, traced to the exact line.

### 7. Finding themes

- Wiring gaps: F8 and F10 are the same failure mode. Code plus unit tests present, never hooked into the runtime. A bootstrap-wiring audit with integration tests that assert each registered callback is actually invoked would catch this class.
- Schema and code drift: F11 and F12 are the same failure mode. Production code references DB columns the schema lacks, surfacing only on the exercised path. A schema-versus-query contract test across the write paths would catch this class.
- Advisor persistence hardening: F1 through F6 cluster in the advisor lifecycle, persistence, and routing layer, each with a matching test-coverage hole. They warrant a focused advisor-persistence hardening packet.

### 8. Needs-verify carry-forward

These were flagged but not confirmed product-versus-artifact. They are not counted in the 14.

- memory_causal_stats backend recycling (#115, #119): the tool reported recycling and the model fell back to direct SQLite. Could be clone-daemon recycling under isolation or a real stability bug.
- Ablation ground-truth not aligned (#150): likely a clone-DB artifact (missing eval ground-truth), confirm against real before treating as product.
- Re-evaluation trigger doc stale (#151): the documented "2,412 versus 10,000 memories no-go" basis is outdated, the corpus is now 17,716, past the 10K trigger. Update the doc premise. Also flagged a memory_quick_search latency of 3,345 milliseconds worth a perf check.
- Stale playbook doc anchors the models caught (doc debt, not model error): #32 a codex_hooks assertion that should read hooks after a rename, and #37 a hook path documented under system-spec-kit that actually lives under system-skill-advisor.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Stress ran directly through vitest per skill. Playbook scenarios ran through a small async driver that dispatched each scenario to a cli model on one of three disposable copy-on-write clones, captured the json stream, and classified the verdict from a forced marker in the final assistant message. Resume was by scenario index, so a scenario whose transcript already existed was skipped across the model swap. Each run was scored by a critical read against the expected signals, not by trusting its verdict string. A run with a PASS string but 0 tools and 98 characters was treated as a non-run. Findings and remediations were written live during the loop. After the workspace was wiped, the report was reconstructed from the surviving session transcript by replaying every recorded Write and Edit to rebuild the two eval logs and by parsing the verdict lines and tallies back out. The two schema findings were re-confirmed against the live DB read-only.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Run stress directly, not through a model | The suites are deterministic code. A model adds noise and cost with no benefit |
| Score each run, do not trust the verdict string | A fast-fail or an over-explored timeout can carry a misleading marker. Critical reads separate real verdicts from artifacts |
| Per-clone daemon isolation plus killing the global daemon | The daemons resolve workspace from cwd and pin a global socket, so naive sandboxing leaks to the real repo. This recipe held it at 0 changes |
| Discount isolation-artifact failures | Fresh clone DBs make db, health, status, and zero-state scenarios report empty or degraded. Those are environment, not product |
| Salvage the report rather than re-run | The operator chose salvage. A re-run would be multi-hour, paid, and contaminated by the concurrent operator opencode session |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Stress suites | spec-kit 130/130, code-graph 45/45, advisor 57/58 (1 pre-existing) |
| Playbook coverage | 222 of 471 recorded with per-skill and per-model buckets |
| Real repo cleanliness | Held at 0 benchmark changes through the run, including descriptions.json, verified each poll |
| F11 schema claim | Confirmed against the live DB: source_kind absent from memories, memory_records, causal_edges |
| F12 schema claim | Confirmed against the live DB: consumption_log has query_hash, no query_text |
| Strict validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/000-release-cleanup/011-daemon-skills-playbook-validation --strict` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This report is a salvage.** The benchmark scratchpad workspace and all three worker clones lived under the system temp tree and were cleared when the previous process exited. The driver, the raw transcripts, the results json, and the live eval logs were lost. The report was reconstructed faithfully from the surviving session transcript and the two recovered eval logs. The real repository was never polluted by the benchmark.

2. **Coverage is frozen at 222 of 471.** The two smaller skills are complete (advisor 47 of 47, code-graph 21 of 21). The spec-kit playbook reached 154 of 403, so 249 spec-kit scenarios were not run. The operator chose to salvage now rather than re-run from scratch.

3. **Isolation caveats.** Verdicts from the isolated run must be read with the clone environment in mind. Discount db, health, status, and zero-state failures (the clone daemon DB is fresh). Discount daemon-config and offline-smoke failures (they read the clone's modified opencode.json, not the real config). Timeouts near the cap are over-exploration, not failures. The 14 findings were all runtime-grounded against real source, and F11 and F12 were confirmed against the live DB.

4. **Phase-2 UNCLEAR is inflated.** About 20 of the 25 phase-2 UNCLEAR runs are session-DB contention fast-fails from a concurrent operator opencode session, not product behavior.

5. **Remediations are planned, not applied.** Each finding carries a fix and a test-coverage hole. None were implemented in this packet.
<!-- /ANCHOR:limitations -->
