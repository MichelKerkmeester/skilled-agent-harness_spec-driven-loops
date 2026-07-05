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
| `005-spec-data-quality/045-drift-audit-remediation` (re-nested 2026-07-04, formerly top-level `008`) | Completed | A GPT-5.5-fast (high) audit surfaced 75 findings across 63 files, 24 confirmed high/critical drift/bug issues plus 51 unverified medium/low findings. This phase fixed all of them across 42 directories via a worktree-isolated pipeline (MiMo v2.5 Pro Hyperspeed to fix, GPT-5.5-fast high to independently re-verify), caught and corrected a verify-logic bug that had let 11 directories slip through as false "resolved" and confirmed 4 code-gap findings were genuinely absent from the current tree. Documentation and metadata only, no application code changed. |
| `005-spec-data-quality/046-drift-audit-deep-history-correction` (re-nested 2026-07-04, formerly top-level `009`) | Completed | Deep research into 008's 4 code-gap findings found the fuller truth: all four features were built, shadow-shipped, benchmarked and deliberately deleted for cause, not simply never built (summary/community fusion lane, seeded-PPR ranking, C4 shadow-weight promoter, outcome-weighted ranking). Supplements 008's docs with that history and fixes 2 places where 008's own correction had wrongly said the code was never committed. |

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

---

## 2026-07-04

### Summary

The 016 deep-dive remediation program shipped. Thirteen phases fixed the P0 through P2 findings from the mk-spec-memory deep dive, running from corpus identity and read-exclusions through save-dedup, embedding coverage, trigger quality, the eval-production parity harness, ranking gates, causal-graph hygiene, the learning loop, search hot-path performance, daemon freshness, envelope and command-doc alignment and a doc-only closeout. Every phase was implemented, adversarially reviewed at xhigh, remediated and Opus final-verified. Six phases ran live data migrations under atomic backups. Recursive `validate.sh --strict` across the program returned 14 folders clean and 0 errors. About 2,500 tests passed across the phases. All 13 are complete, committed and pushed. See the [016 program rollup](./016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/changelog-016-root.md).

### Included Phases

| Phase | Status | Summary |
|---|---|---|
| `001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory` (spec folder re-nested 2026-07-04, formerly top-level `016`) | Phase Parent (13/13 Complete) | The deep-dive remediation program. Thirteen phases that fixed the mk-spec-memory P0 through P2 findings across corpus identity, read-exclusions, save-dedup, embeddings, trigger quality, ranking, causal-graph hygiene, the learning loop, search performance, daemon health, envelope presentation and the review-remediation closeout. Rollup: [changelog-016-root.md](./016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/changelog-016-root.md). |

### Follow-Ups

- Several daemon-side captures are pending a daemon restart: the live p50 from phase 010, the live envelope bytes from phase 012, the embedding reconcile from phase 004, the eval-delta from phases 006 and 007, trackAccess production enablement from phase 009 and the memory-index of the phase 013 closeout.

---

## 2026-07-05

> Spec folder: `.opencode/specs/system-speckit/028-memory-search-intelligence/008-speckit-surface-alignment` (Phase Parent)

### Summary

The 008 surface-alignment remediation converted the audit record into a closed documentation and process arc. The initial surface-alignment audit identified documentation-vs-implementation drift, the Fable review narrowed the record to citation-backed issues, phases 011 and 012 delivered the code-graph and stress/SKILL.md audits, the paired 011 and 012 fix phases shipped the documentation corrections, phase 013 shipped the inert-novelty detector warning for flat-high `newInfoRatio`, and phase 014 shipped recorded-failure closure through cap reconciliation, a constitutional route and a RED/GREEN surfacer.

### Included Phases

| Phase | Status | Summary |
|---|---|---|
| `008-speckit-surface-alignment/002-false-now-doc-corrections` | Complete | Corrected false-now doc drift (Track-C supersession pointer + live retention flag name in `benchmark-status.md`); confirmed three cited surfaces already in place. |
| `008-speckit-surface-alignment/011-code-graph-doc-audit` | Complete | Read-only audit of system-code-graph docs with six confirmed findings and zero inferred findings. |
| `008-speckit-surface-alignment/011-fix-code-graph-docs` | Complete | Corrected the code-graph documentation findings surfaced by the audit. |
| `008-speckit-surface-alignment/012-stress-and-skillmd-audit` | Complete | Read-only audit of stress-test docs plus system-spec-kit SKILL.md and changelog surfaces. |
| `008-speckit-surface-alignment/012-fix-stress-docs` | Complete | Corrected stress catalog, playbook and stress-test README drift against the shipped harness. |
| `008-speckit-surface-alignment/013-deep-research-loop-instrumentation` | Complete | Shipped the inert-novelty detector warning and focused RED/GREEN coverage. |
| `008-speckit-surface-alignment/014-recorded-failure-closure` | Complete | Reconciled the cap record and shipped the recorded-failure closure route. |

### Added

- Program-level 008 remediation changelog coverage in the 028 changelog tree.

### Changed

- The 028 root changelog now records the 008 surface-alignment audit, Fable review, audit/fix phases and process-closure phases.

### Fixed

- Closed the changelog gap for the 008 remediation sequence.

### Verification

- Strict validation for `.opencode/specs/system-speckit/028-memory-search-intelligence/008-speckit-surface-alignment` is the acceptance gate for this entry.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `changelog/changelog-028-root.md` | Modified | Adds the 2026-07-05 entry for 008 remediation. |

### Follow-Ups

- None recorded.
