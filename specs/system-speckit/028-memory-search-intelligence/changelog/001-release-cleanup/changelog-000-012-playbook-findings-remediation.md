---
title: "Changelog: Playbook Findings Remediation [000-release-cleanup/012-playbook-findings-remediation]"
description: "Chronological changelog for the playbook findings remediation phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-25

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/000-release-cleanup/012-playbook-findings-remediation` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/000-release-cleanup`

### Summary

The daemon-skills playbook validation (packet 011) plus the core memory-search re-run surfaced about twenty-two real product findings across the four subsystems. This phase remediated them. gpt-5.5-fast high fixed the findings in eight clusters A through H in an isolated worktree, each cluster verified by a vitest blast-radius sweep plus typecheck plus mutation checks on the risky fixes plus comment hygiene plus alignment drift, then committed one cluster per commit. Six isolation and harness artifacts were excluded as not bugs. The fixes are verified per cluster and live on branch wt/0008-findings-remediation pending a full-suite run and merge.

### Added

- Added the schema-contract and merge-contract tests for cluster A.
- Added the dedicated wiring-invocation tests for cluster B at five call sites.
- Added the metadata-sanitizer boundary test for cluster E F2.
- Added the follow-up B4 surrogate index-time, B5 contextual-tree header and C strict-schema tests in commit `374ca93caa`.

### Changed

- Re-parented the post-phase-6 phases under their relevant parents in commit `64d064d868`.
- Routing re-mapped so deep-research and deep-review go to leaf skills and `:review:auto` to the review leaf, measured top-1 back to 0.92 to 0.95 against the 0.92 gate.
- DB-path resolution standardized through one env-respecting helper across the runtime and migration entry points.

### Fixed

- Cluster A schema drift, the F11 source_kind select guarded on narrow schemas and the F12 consumption_log insert aligned to query_hash (commit `adbcc65e83`, 80 passed).
- Cluster B wiring, five implemented-but-dead memory-search features wired into the runtime, scoring observability, LLM backfill registration, llm-reformulation, query-surrogates and the contextual-tree header (commit `e5b4735c4b`, 1165 passed across 47 files).
- Cluster C retrievalLevel honored local, global and auto end to end with the missing strict input-schema field added (commit `f0e063eed4`, 155 passed).
- Cluster D ordering, folder rank primary sort plus a guaranteed top-k slot per active channel (commit `cbf4f4d111`, 98 passed).
- Cluster E advisor persistence hardening F1 through F6, routing, the skill-metadata sanitizer, the validate-scorer, the rollback lifecycle-field cleanup, the non-zero bench exit and the disabled force-native error (commit `917ad633a3`, 61 passed).
- Cluster F DB lifecycle, the cross-process rebind, the db-path standardization and the embedding-retry e2e (commit `f27945593e`, 63 passed, retry-manager 60/60).
- Clusters G and H code-graph write-local refresh plus quality cleanup, the duplicate scope helper, two stale tests, entity dedup normalization and the 7-layer metadata (commit `3291c05389`, 421 passed on spec-kit plus 17 on code-graph).

### Verification

| Check | Result |
|-------|--------|
| Cluster A | PASS, 3 files 80 passed, both contract tests mutation-checked, typecheck exit 0 |
| Cluster B | PASS, 47 files 1165 passed 0 failed, alignment drift 0 errors |
| Cluster C | PASS, 6 files 155 passed, global-branch mutation check, typecheck exit 0 |
| Cluster D | PASS, 5 files 98 passed, both assertions mutation-checked |
| Cluster E | PASS, 7 files 61 passed, tsc exit 0, security and rollback mutation-checked |
| Cluster F | PASS, 3 files 63 passed, retry-manager 60/60, F1 and F2 True-RED |
| Clusters G and H | PASS, spec-kit 11 files 421 passed, code-graph ensure-ready 17 passed |
| Comment hygiene and alignment drift | PASS, clean on every touched surface |
| Strict validation | PASS, 0 errors and 0 warnings |
| Full-suite run and merge | OPEN, held as the next safe action |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `spec.md` | Created | Remediation objective and scope across the eight clusters |
| `plan.md` | Created | Cluster-by-cluster approach and the per-cluster verification gate |
| `tasks.md` | Created | The eight clusters as completed task groups plus the open merge task |
| `checklist.md` | Created | QA items with per-cluster vitest and mutation evidence |
| `implementation-summary.md` | Created | Full results, the excluded artifacts and the commit list |
| `findings-registry.md` | Present | Source registry of every cluster's findings, fix, files and evidence |
| `description.json` | Generated | Metadata refreshed via generate-description |
| `graph-metadata.json` | Generated | Graph metadata backfilled scoped to this packet |

### Follow-Ups

- Run the full suite on branch wt/0008-findings-remediation and merge. The code is verified per cluster.
- The advisor warm-latency gate question is surfaced honestly rather than closed, since E5 F5 made the bench fail loudly but left the latency unchanged and unfaked.
