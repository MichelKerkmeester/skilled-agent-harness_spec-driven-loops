---
title: "Changelog: Memory Search Intelligence Phase Parent [028-memory-search-intelligence/root]"
description: "Chronological changelog for the Memory Search Intelligence Phase Parent spec root."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence` (Level 2)

### Summary

> Phase-parent note: This spec.md is the only authored document at this parent level. Detailed planning lives in the child phase folders listed below. <!-- /ANCHOR:problem -->

### Included Phases

| Phase | Status | Summary |
|---|---|---|
| `001-speckit-memory` | Phase Parent | > Phase-parent note: This spec.md is the only authored document at this parent level. Detailed planning lives in the child phase folders listed below. <!-- /ANCHOR:problem --> |
| `002-code-graph` | Phase Parent | > Phase-parent note: This spec.md is the only authored document at this parent level. Detailed planning lives in the child phase folders listed below. <!-- /ANCHOR:problem --> |
| `003-skill-advisor` | Phase Parent | > Phase-parent note: This spec.md is the only authored document at this parent level. Detailed planning lives in the child phase folders listed below. <!-- /ANCHOR:problem --> |
| `004-deep-loop` | Phase Parent | > Phase-parent note: This spec.md is the only authored document at this parent level. Detailed planning lives in the child phase folders listed below. <!-- /ANCHOR:problem --> |
| `000-release-cleanup` | Phase Parent | > Phase-parent note: This spec.md is the only authored document at this parent level. Detailed planning lives in the child phase folders listed below. <!-- /ANCHOR:problem --> |
| `005-spec-data-quality` | Phase Parent | Data-quality research that then shipped. 40 phases spanning the go/no-go research, the generated-metadata build, the full-repo JSON migration and the flag-graduation benchmark that kept twelve flags and deleted one. Rollup: [changelog-005-root.md](./005-spec-data-quality/changelog-005-root.md). |
| `006-review-remediation` | Phase Parent | Scoped remediation of the epic deep review across four children: eval-benchmark fidelity, memory schema and concurrency, doc accuracy and P2 triage. Rollup: [changelog-006-root.md](./006-review-remediation/changelog-006-root.md). |
| `007-dark-flag-graduation` | Phase Parent | The dark-flag graduation program. Twelve phases that benchmarked eight default-off flag families on the production path and returned graduate, refine or cut, then cleaned up flag names, validated byte-identity, shipped the production-readiness follow-ups and closed a deep review. Rollup: [changelog-007-root.md](./007-dark-flag-graduation/changelog-007-root.md). |
| `008-drift-audit-remediation` | Completed | A GPT-5.5-fast (high) audit surfaced 75 findings across 63 files, 24 confirmed high/critical drift/bug issues plus 51 unverified medium/low findings. This phase fixed all of them across 42 directories via a worktree-isolated pipeline (MiMo v2.5 Pro Hyperspeed to fix, GPT-5.5-fast high to independently re-verify), caught and corrected a verify-logic bug that had let 11 directories slip through as false "resolved" and confirmed 4 code-gap findings were genuinely absent from the current tree. Documentation and metadata only, no application code changed. |
| `009-drift-audit-deep-history-correction` | Completed | Deep research into 008's 4 code-gap findings found the fuller truth: all four features were built, shadow-shipped, benchmarked and deliberately deleted for cause, not simply never built (summary/community fusion lane, seeded-PPR ranking, C4 shadow-weight promoter, outcome-weighted ranking). Supplements 008's docs with that history and fixes 2 places where 008's own correction had wrongly said the code was never committed. |

### Added

- No new additions recorded.

### Changed

- > Phase-parent note: This spec.md is the only authored document at this parent level. Detailed planning lives in the child phase folders listed below. <!-- /ANCHOR:problem -->

### Fixed

- No fixes recorded.

### Verification

- No explicit verification recorded.

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- None recorded.

---

## 2026-06-29

### Summary

A code-graph daemon-reliability phase, `002-code-graph/009-daemon-reclaim-hardening`, landed after the `mk_code_index` MCP server failed to reconnect with `-32000` on an unclean daemon crash (orphan PID alive, IPC socket never re-created, lease file gone, 17 MB orphaned WAL). The launcher now decides liveness tridimensionally (PID + socket-serving + heartbeat) and self-heals: a compound socket-vetoed reclaim predicate (never a probe-failure count, so a busy `code_graph_scan` is not false-killed), uid + PID-identity kill-guards, startup WAL hygiene, a conditional CAS, and a crash-surviving daemon-PID registry — all gated by `reclaimDeadSocketEnabled()` (kill-switch, default on). Designed by a 10-iteration GLM-5.2 deep research, adversarially verified by 5 GPT-5.5 xhigh iterations (sound-with-fixes), implemented by GPT-5.5 high/fast in nine individually-verified chunks; 31 tests pass with no regression. See the [002-009 changelog](./002-code-graph/changelog-002-009-daemon-reclaim-hardening.md), `before-vs-after.md` Section 13, and the 2026-06-29 `timeline.md` entry.

### Follow-Ups

- Production soak (new launcher activates on the next daemon launch) and the better-sqlite3 ABI realignment (the sqlite3-CLI fallback works meanwhile).

---

## 2026-07-01

### Summary

A GPT-5.5-fast (high) audit of the packet had surfaced 75 findings across 63 files, 24 confirmed high/critical drift/bug issues plus 51 unverified medium/low findings from a single sweep. Phase `008-drift-audit-remediation` fixed all of them across 42 directories through a worktree-isolated pipeline, MiMo v2.5 Pro Hyperspeed to fix and GPT-5.5-fast (high) to independently re-verify against the post-edit files, catching and fixing a verify-logic bug that had let 11 directories slip through as false "resolved" and confirmed 4 code-gap findings as genuinely absent from the current tree, docs and metadata only, zero application code changed. The user then asked to go further on those 4 code-gap findings, and phase `009-drift-audit-deep-history-correction` ran deep research (3 Explore plus 2 Plan agents, all commit hashes independently re-verified) that found the fuller history: all four features (summary/community fusion lane, seeded-PPR ranking, the C4 shadow-weight promoter and outcome-weighted ranking) were actually built, shadow-shipped, benchmarked and deliberately deleted for cause, and it corrected 2 places where 008's own pass had wrongly said the code was never committed. Of the four, seeded-PPR carried an explicit revisit signal because every CALLS edge shared identical confidence, leaving PPR nothing to differentiate on, so `002-code-graph/010-edge-confidence-and-ppr-revisit` built real per-edge confidence differentiation behind a new default-off flag, recovered the deleted PPR module byte-for-byte from git history, caught and fixed a real ADR-001 deviation during recovery, then re-ran the original unmodified benchmark harness against the same 20 labeled queries with a real confidence gradient now landed in the database. The verdict: the cut stands and the gap widened, PPR now loses on every metric rather than tying the flat walk as before, both flags stay default-off and no production behavior changed.

### Follow-Ups

- No further seeded-PPR revisit is planned, the open question is now answered.
- Nothing has been committed to git, every change described above is an uncommitted diff in the live tree pending operator review.
