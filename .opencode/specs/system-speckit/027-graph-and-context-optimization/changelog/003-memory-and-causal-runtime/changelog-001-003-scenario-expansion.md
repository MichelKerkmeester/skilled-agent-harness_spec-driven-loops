---
title: "017/003: Scenario Expansion for Playbook Quality Audit"
description: "15 new scenarios plus 3 repaired cat-24 calibration scenarios shipped to fill tool-coverage gaps identified by phases 001 and 002. B-RETRY validation against the live MCP server returned 10/18 PASS with a root-cause table covering SCENARIO_BUG, IMPLEMENTATION_GAP, FIXTURE_DRIFT classes."
trigger_phrases:
  - "017/003 scenario expansion"
  - "playbook quality audit scenario expansion"
  - "mk-spec-memory scenario coverage gaps"
  - "embedder tooling playbook scenarios"
  - "cat-24 calibration repair"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-17

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/001-playbook-quality-audit/003-scenario-expansion` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/001-playbook-quality-audit`

### Summary

The mk-spec-memory manual testing playbook had no coverage for session bootstrap, session resume, session health, retention sweep dry-run, eval ablation edge cases, embedder list/set/status tooling. Governance tools introduced in 016/003 were also uncovered. The cat-24 quality scenarios had stale example displays and a threshold mismatch.

15 new scenarios were authored across 7 playbook categories (discovery, maintenance, analysis, evaluation, tooling-and-scripts, governance) filling the gaps identified by the 017/001 fairness audit and the 017/002 tool-coverage audit. Three cat-24 scenarios were repaired to align example display and calibrate the 8/10 threshold with 016/004 empirical evidence. B-RETRY validation (codex `b855znbsv`) executed all 18 scenarios against the live MCP server and produced a PASS/FAIL result table: 10/18 PASS. The 8 FAILs were classified into three root-cause categories, two of which expose handler implementation gaps filed as follow-ons.

### Added

- 15 new playbook scenarios across categories 03--discovery (scenarios 015-017), 04--maintenance (279), 06--analysis (027), 07--evaluation (028-029), 16--tooling-and-scripts (281-283), 17--governance (274-278)
- Reproducible evidence infrastructure: `evidence/generate-playbook-quality-audit.js` (~55KB regeneration script)
- Per-scenario PASS/FAIL validation log at `evidence/017-scenario-validation.jsonl` (18 rows)
- Validation synthesis report at `evidence/017-scenario-validation-report.md`
- Phase evidence summary at `evidence/scenario-expansion-summary.csv`

### Changed

- Cat-24 scenario 402 (synonymy-across-vocabularies): example display corrected
- Cat-24 scenario 408 (compound-concept-synthesis): example display corrected
- Cat-24 scenario 409 (llm-made-memory-recall): threshold calibrated to 8/10 matching 016/004 empirical evidence

### Fixed

- Stale example payloads in cat-24 scenarios 402 and 408 that no longer matched the live response shape
- Over-tight threshold in cat-24 scenario 409 that caused false FAIL when the rescue layer was active

### Verification

| Check | Result |
|---|---|
| Scenarios 03/015-017, 04/279, 07/029, 16/281, 17/274-277 | 10/10 PASS |
| 06/027 `memory_causal_stats` | FAIL (SCENARIO_BUG: no `scope` param in live schema) |
| 07/028 `eval_run_ablation` | FAIL (SCENARIO_BUG: no dataset selector in live schema) |
| 17/278 governed-ingest cancel | FAIL (SCENARIO_BUG: `/tmp` path rejected by memory-roots policy) |
| 16/282 `embedder_set` dry-run | FAIL (IMPLEMENTATION_GAP: handler missing `dryRun` flag) |
| 16/283 `embedder_status` active pointer | FAIL (IMPLEMENTATION_GAP: returns idle-job state only) |
| 24/402, 24/408, 24/409 | FAIL (FIXTURE_DRIFT. Later root-caused: stale dist pre-16:27 rebuild. D-RETRY reached 8/10 on 409.) |
| `validate.sh --strict` on 017/003 | PASSED |

### Files Changed

| File | What changed |
|---|---|
| `.opencode/skills/system-spec-kit/manual_testing_playbook/03--discovery/015-session-bootstrap-reader-ready-context.md` (NEW) | Session bootstrap reader-ready context scenario |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/03--discovery/016-session-resume-continuity-ladder.md` (NEW) | Session resume continuity ladder scenario |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/03--discovery/017-session-health-shared-payload.md` (NEW) | Session health shared payload scenario |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/04--maintenance/279-retention-sweep-dry-run-no-op.md` (NEW) | Retention sweep dry-run no-op scenario |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/06--analysis/027-causal-stats-empty-graph-edge.md` (NEW) | Causal stats empty-graph edge-case scenario |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/07--evaluation/028-eval-ablation-edge-empty-dataset.md` (NEW) | Eval ablation edge empty-dataset scenario |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/07--evaluation/029-eval-dashboard-health-and-empty-state.md` (NEW) | Eval dashboard health and empty state scenario |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/281-embedder-list-registry-inventory.md` (NEW) | Embedder list registry inventory scenario |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/282-embedder-set-dry-run-and-validation.md` (NEW) | Embedder set dry-run and validation scenario |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/283-embedder-status-job-and-active-pointer.md` (NEW) | Embedder status job and active pointer scenario |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/17--governance/274-council-graph-upsert-status-query.md` (NEW) | Council graph upsert and status query scenario |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/17--governance/275-council-graph-convergence-edge-cases.md` (NEW) | Council graph convergence edge-cases scenario |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/17--governance/276-deep-loop-graph-upsert-status-query.md` (NEW) | Deep-loop graph upsert and status query scenario |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/17--governance/277-deep-loop-graph-convergence-edge-cases.md` (NEW) | Deep-loop graph convergence edge-cases scenario |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/17--governance/governed-ingest-cancel-lifecycle.md` (NEW) | Governed ingest cancel lifecycle scenario |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/402-synonymy-across-vocabularies.md` | Example display corrected |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/408-compound-concept-synthesis.md` | Example display corrected |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/409-llm-made-memory-recall.md` | Threshold calibrated to 8/10 |

### Follow-Ups

- Add `dryRun: true` path to the `embedder_set` handler to validate provider availability and report projected actions without queuing reindex work.
- Expose `vec_metadata.active_embedder_name` and embedding dimension in the `embedder_status` handler response alongside job state.
- Update scenario 06/027 to remove the `scope` parameter or add a scoped handler to the `memory_causal_stats` contract.
- Update scenario 07/028 to remove the dataset selector or add a handler-supported empty-fixture path.
- Update scenario 17/278 to use an allowed memory-root path or document the policy rejection as the expected outcome.
