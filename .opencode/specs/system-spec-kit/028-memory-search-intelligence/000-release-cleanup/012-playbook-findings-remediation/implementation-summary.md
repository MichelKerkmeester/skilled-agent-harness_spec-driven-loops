---
title: "Implementation Summary: 028 Playbook Findings Remediation"
description: "Results report for the playbook findings remediation. Eight clusters A through H fixed by gpt-5.5-fast high and verified per cluster: cluster A 80 passed, cluster B 1165 passed, cluster C 155 passed, cluster D 98 passed, cluster E 61 passed, cluster F 63 passed, clusters G and H 421 plus 17 passed. Risky fixes mutation-checked True-RED. Six isolation artifacts excluded. The code lives on branch wt/0008-findings-remediation and the full-suite run plus merge are open."
trigger_phrases:
  - "playbook findings remediation results"
  - "028 remediation cluster results"
  - "remediation fixes verification report"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/000-release-cleanup/012-playbook-findings-remediation"
    last_updated_at: "2026-06-25T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the results report with the eight clusters, the excluded artifacts and the commit list"
    next_safe_action: "Run the full suite on branch wt/0008-findings-remediation then merge"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-25-summary-012-playbook-findings-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Full-suite run and merge of wt/0008-findings-remediation held open as the next safe action. The code is verified per cluster."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

# Implementation Summary

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | system-spec-kit/028-memory-search-intelligence/000-release-cleanup/012-playbook-findings-remediation |
| **Completed** | 2026-06-25 |
| **Level** | 2 |
| **Status** | Complete, code verified per cluster, not yet merged |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The remediation of the real product findings the daemon-skills playbook validation surfaced. gpt-5.5-fast high fixed the findings in eight clusters A through H in an isolated worktree, each cluster verified by vitest plus typecheck plus mutation checks on the risky fixes plus the comment-hygiene and alignment-drift gates, then committed. The deliverable is the remediated code on branch wt/0008-findings-remediation plus this report. The six isolation and harness artifacts were excluded as not bugs.

### Cluster A. Schema drift (P0)

Production code referenced columns the schema lacks.

- A1 F11 the `source_kind` select in `lib/storage/lineage-state.ts` failed when `memory_index` lacks the column. The select is now guarded to emit `NULL AS source_kind` on narrow and legacy schemas via a `PRAGMA table_info` probe, and a reconsolidation merge-contract test was added.
- A2 F12 the adaptive-ranking consumption insert wrote `query_text` while `consumption_log` has only `query_hash`. The adaptive insert now hashes the query and writes `query_hash`, and a schema-contract test was added.
- Verification: `adaptive-ranking-e2e`, `adaptive-ranking` and `reconsolidation` = 3 files, 80 passed. Both contract tests fail under a mutation check when the bad column is reintroduced. Real-repo typecheck exit 0. Comment hygiene clean. Commit `adbcc65e83`.

### Cluster B. Wiring gaps (P1, dominant theme)

Five features were implemented and unit-tested but never hooked into the runtime, so they were dead at runtime.

- B1 F8 scoring observability is now invoked from the live scoring path (`lib/scoring/composite-scoring.ts`, `handlers/memory-search.ts`) with a dedicated invocation test.
- B2 F10 the LLM backfill is registered at bootstrap (`lib/search/graph-lifecycle.ts`) with a structural test that fails if the registration is dropped.
- B3 llm-reformulation is wired into the deep pipeline (`lib/search/pipeline/stage1-candidate-gen.ts`, `hybrid-search.ts`) with a trace test.
- B4 query-surrogates wiring landed in `stage1-candidate-gen.ts` and the existing surrogate suite stays green. The dedicated index-time invocation test was carried as a follow-up.
- B5 the contextual-tree header is wired via `applyContextualTreeHeader` and its call site in `formatters/search-results.ts`. The dedicated header-by-mode test was carried as a follow-up.
- Verification: the full blast-radius sweep over memory-search, search-results, hybrid-search, stage1, graph-lifecycle, scoring, composite, surrogates, reconsolidation and adaptive = 47 files, 1165 passed, 0 failed. Comment hygiene clean. Alignment drift 0 errors. The gpt-5.5 dispatch was cut at the cap mid-B5 but all five call sites landed, and the worktree node_modules workspace resolution was repaired to run the integration suites. Commit `e5b4735c4b`.

### Cluster C. retrievalLevel not honored (P1)

`retrievalLevel: local|global|auto` is now honored end to end. The handler and pipeline branch on it (`handlers/memory-search.ts`, `lib/search/pipeline/stage1-candidate-gen.ts`, `types.ts`, `search-utils.ts`), cache keys include retrievalLevel so levels cannot cross-contaminate, and an omitted value defaults to auto. The strict public input schema (`schemas/tool-input-schemas.ts`) was missing the param so strict validation rejected it pre-handler, so the zod field plus an allow-list entry were added. This two-line mirror was closed directly rather than re-dispatched, because gpt-5.5 had correctly flagged it as out of its granted scope. Verification: retrieval-level, handler, tool-input-schema and memory-search suites = 6 files, 155 passed. A mutation check confirmed the distinguishing test fails when the global branch is disabled. Typecheck exit 0. Comment hygiene clean. Commit `f0e063eed4`.

### Cluster D. Ordering (P1)

Two ordering contracts were violated.

- D1 F13 folder rank is now the primary sort key with individual score secondary within a folder (`lib/search/folder-relevance.ts`), with a test that orders by folder rank before individual score.
- D2 channel minimum-representation now reserves a top-k slot for each active channel's best candidate even below the quality floor, without breaking the floor for the rest (`lib/search/channel-enforcement.ts`, `channel-representation.ts`), with a test for the reserved slots.
- Verification: folder-relevance, channel-enforcement, channel-representation, query-router-channel-interaction and feature-eval-query-intelligence = 5 files, 98 passed. Mutation checks confirm both assertions fail when the fix is reverted. Typecheck exit 0. Comment hygiene clean. Commit `cbf4f4d111`.

### Cluster E. Advisor persistence (P0/P1)

Six advisor lifecycle, persistence and routing regressions.

- E1 F1 routing is re-mapped, deep-research and deep-review to leaf skills, `:review:auto` to the review leaf, null phrases handled, across `lib/scorer/lanes/*`, `fusion.ts`, `projection.ts` and `skill-graph-db.ts`. Measured top-1 accuracy is now 0.92 to 0.95 against the 0.92 gate.
- E2 F2 the skill-metadata write path is now sanitized by a new `lib/skill-graph/metadata-sanitizer.ts` that rejects traversal, strips instruction-shaped values and bounds paths, wired into `skill-graph-db.ts`, with a sanitizer-boundary test.
- E3 F3 validate-scorer now awaits outcome persistence, un-gates totals from the debug flag and accepts outcomeEvents in the CLI manifest (`handlers/advisor-validate.ts`, `tools/advisor-validate.ts`, `skill-advisor-cli-manifest.ts`).
- E4 F4 the rollback transaction now also clears lifecycleStatus and redirectTo (`lib/lifecycle/rollback.ts`), with a test that asserts lifecycle-field cleanup.
- E5 F5 the bench now exits non-zero when overall_pass is false (`lib/metrics.ts`), with latency itself unchanged and not faked.
- E6 F6 the disabled-hook `--force-native` now errors native-unavailable with a non-zero exit (`scripts/skill_advisor.py`).
- Verification: routing-parity-deep-skills, skill-graph-db, advisor-validate, lifecycle-derived-metadata, compat/shim and cli-help-aliases-errors = 7 files, 61 passed. tsc exit 0 direct against tsconfig.build.json. Comment hygiene clean. Security and rollback mutation-checked. Commit `917ad633a3`.

### Cluster F. DB lifecycle (P2)

Three cross-process and retry gaps.

- F1c cross-process DB hot-rebinding now completes the contract: after an external `.db-updated` marker the DB reinits and a follow-up stats or health reflects the new DB, non-stale and healthy (`spec-memory-cli.ts`, `hooks/spec-memory-cli-fallback.ts`), with a test that rebounds stats and health after an external marker update.
- F2c DB-path resolution is standardized through one helper respecting env precedence, with divergent runtime and migration entry points routed through it and hardcoded fallbacks removed (`core/config.ts`, `scripts/migrations/*-checkpoint.ts`), with a test that resolves the same path across runtime and migration.
- F3c the embedding-retry orchestrator e2e now passes end to end: pending rows stay lexical-only until processed, failures record retry and backoff metadata, and success uses the embedding cache and refreshes both vector and lexical surfaces (`lib/providers/retry-manager.ts`, `lib/search/vector-index-store.ts`). The cause was implementation, not a stale test. retry-manager 60/60.
- Verification: db-lifecycle-paths plus retry-manager = 3 files, 63 passed. Typecheck exit 0. Comment hygiene clean. F1 and F2 mutation-checked True-RED. Commit `f27945593e`.

### Clusters G and H. Code-graph and quality (P2)

One code-graph refresh gap plus four quality items.

- G1 the code-graph write-local refresh now recomputes the detected stale files (`system-code-graph/mcp_server/lib/ensure-ready.ts`). ensure-ready 17 passed.
- H1 F7 `normalizeScopeValue` was extracted to a single shared util (`lib/utils/scope-normalization.ts`), imported by near-duplicate.ts and scope-governance.ts, with the copies removed.
- H2 F9 the two stale tests were updated to the current impl shapes, the causal-edges `skippedManual` count and the mutation-hooks `semantic-trigger-cache`. 94 passed.
- H3 F14 entity-extractor dedup now uses the canonical `normalizeEntityName()` so the extractor and linker agree (`lib/extraction/entity-extractor.ts`). 50 passed.
- H4 the 7-layer metadata passes its documented validation surface, with two stale test expectations corrected, the memory_health budget 1500 and the dispatch truncation assertion. 136 passed.
- Verification: the spec-kit H1 to H4 suites = 11 files, 421 passed, the code-graph G1 ensure-ready = 17 passed, spec-kit typecheck exit 0, comment hygiene clean on both surfaces, alignment drift clean on both surfaces. Commit `3291c05389`.

### Follow-up tests and re-parenting

The dedicated tests that B4, B5 and the C strict schema were carrying as test holes were added: the B4 surrogate index-time invocation test, the B5 contextual-tree header-by-mode test and the C strict-schema-accepts-retrievalLevel assertion. Commit `374ca93caa`. The post-phase-6 phases were then re-parented under their relevant parents. Commit `64d064d868`.

### Commit list

| Commit | Cluster | What |
|--------|---------|------|
| `adbcc65e83` | A | schema drift, F11 source_kind select guard, F12 consumption_log query_hash alignment |
| `e5b4735c4b` | B | wire five implemented-but-dead memory-search features into the runtime |
| `f0e063eed4` | C | honor retrievalLevel local, global and auto end to end |
| `cbf4f4d111` | D | folder rank primary sort plus guaranteed top-k channel representation |
| `917ad633a3` | E | advisor persistence hardening, F1 through F6 |
| `f27945593e` | F | DB lifecycle, cross-process rebind, db-path standardization, embedding-retry e2e |
| `3291c05389` | G and H | code-graph write-local refresh plus quality cleanup |
| `374ca93caa` | follow-up | B4, B5 and C strict-schema tests |
| `64d064d868` | migration | re-parent the post-phase-6 phases under their relevant parents |

### Excluded as isolation and harness artifacts (not bugs)

Six items were excluded because they were environment or harness artifacts, not product failures: causal-stats-empty (clone DB seeded), causal-coverage-under-bulk-save (spec-folder gate), paraphrase-recall (clone embedding), code-intent and adversarial-near-miss (clone index state) and the trigger-phrase cognitive-null (documented identity-gating, working as intended).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The findings were triaged into eight clusters by failure mode, then gpt-5.5-fast high took one cluster at a time in an isolated worktree. Each cluster landed its source fix plus a distinguishing test, then ran a per-cluster verification gate before it was committed. The gate is a vitest sweep over the cluster's full blast radius rather than the single changed file, a real-repo typecheck, a mutation check on each risky fix that reintroduces the bug and confirms the distinguishing test goes red, and the comment-hygiene and alignment-drift gates. Each cluster became one commit so the remediation reads finding by finding. The worktree node_modules workspace resolution had to be repaired during cluster B so the integration suites could run. Two follow-up commits then added the dedicated invocation tests B4, B5 and the C strict schema had carried as test holes, and a migration commit re-parented the post-phase-6 phases.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Cluster by failure mode, not by file | The findings share root causes across files, so a per-mode fix and a blast-radius sweep close a whole class at once |
| Mutation-check the risky fixes | A green test can hide a fix that never proved the bug, so reverting the fix must turn the distinguishing test red |
| One commit per cluster | The remediation reads finding by finding and any single cluster can be reverted in isolation |
| Close the C two-line schema mirror directly | gpt-5.5 correctly flagged it as out of its granted scope, so re-dispatching for two lines added cost with no benefit |
| Exclude the six isolation artifacts | They were clone-DB, clone-embedding, clone-index or documented identity-gating, not product failures |
| Hold the full suite and merge open | Per-cluster green is not merge-ready, so the full-suite run on the branch is the next safe action before merge |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Cluster A | 3 files, 80 passed, both contract tests mutation-checked, typecheck exit 0 |
| Cluster B | 47 files, 1165 passed, 0 failed, alignment drift 0 errors |
| Cluster C | 6 files, 155 passed, global-branch mutation check, typecheck exit 0 |
| Cluster D | 5 files, 98 passed, both assertions mutation-checked |
| Cluster E | 7 files, 61 passed, tsc exit 0, security and rollback mutation-checked, routing 0.92 to 0.95 |
| Cluster F | 3 files, 63 passed, retry-manager 60/60, F1 and F2 True-RED, typecheck exit 0 |
| Clusters G and H | spec-kit 11 files 421 passed, code-graph ensure-ready 17 passed, typecheck exit 0 both surfaces |
| Comment hygiene and alignment drift | Clean on every touched surface |
| Strict validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/028-memory-search-intelligence/000-release-cleanup/012-playbook-findings-remediation --strict` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The fixes are not merged.** All eight clusters live on branch wt/0008-findings-remediation across seven fix commits plus a follow-up test commit and a re-parenting commit. The code is verified per cluster, but the full suite has not been run across all clusters at once and the branch is not merged. The full-suite run is the next safe action before merge.

2. **Verification is per cluster, not whole-suite.** Each cluster was swept over its own blast radius. A whole-repo run that exercises every touched surface together has not yet run, so a cross-cluster interaction would only surface in that full-suite pass.

3. **Two B fixes carried test holes that the follow-up commit closed.** B4 surrogate index-time and B5 contextual-tree header landed as fixed with their dedicated invocation tests added later in commit `374ca93caa`. The C strict-schema-accepts-retrievalLevel assertion was added in the same commit.

4. **The excluded artifacts are excluded by judgment.** The six isolation and harness artifacts were read as environment or documented-intent rather than product bugs. That call rests on the clone-environment caveats recorded in the packet 011 validation.

5. **Some advisor latency was not re-baselined here.** E5 F5 made the bench exit non-zero on failure but left the latency itself unchanged and unfaked, so the warm-latency gate question raised in the validation is surfaced honestly rather than closed by a re-baseline.
<!-- /ANCHOR:limitations -->
