---
title: "Release-Readiness Audit: Code Graph Readiness Contract"
description: "Read-only audit of the post-032 code graph readiness contract. Produced a 9-section severity-classified review-report.md with one P0 finding: the readiness debounce allows stale graph rows to answer queries when a fresh result was cached within the last five seconds."
trigger_phrases:
  - "code graph readiness audit"
  - "ensure-ready debounce stale read"
  - "release readiness code graph review"
  - "readiness contract deep review"
  - "code graph readiness P0"
importance_tier: "important"
contextType: "review"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits/004-code-graph-readiness-audit`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/001-release-readiness/003-release-readiness-deep-review-audits`

### Summary

The release-readiness program needed a truth check for the post-032 code graph readiness contract. The contract was audited for honest watcher claims, selective self-heal correctness on read paths, status-path side effects, verify-state behavior and degraded stress coverage. The `ensureCodeGraphReady` function in `lib/ensure-ready.ts` caches readiness by root and options only, not by tracked-file freshness. A fresh result is reused for up to five seconds, which means an operator who edits files immediately after a fresh `code_graph_query` call can receive stale graph rows without triggering self-heal or blocking. This is the active P0. Two P1 findings cover README vocabulary drift and a missing integration test path. One P2 finding covers a minor doc cleanup. The audit produced a 9-section `review-report.md` with verdict FAIL and remediation seeds for each finding.

### Added

- None. Review-only phase.

### Changed

- None. Review-only phase.

### Fixed

- None. Review-only phase.

### Verification

- Watcher regex sweep: PASS. Current `code_graph` operator docs contain only negative or no-watcher claims, not real-time structural watching claims.
- CocoIndex semantic search: FAIL (`ccc search` could not connect to daemon due to sandbox permission on daemon log). Fallback used direct reads and `rg`.
- Packet strict validation: PASS. `validate.sh` exited 0.
- `review-report.md` produced with verdict FAIL. Active findings: P0=1, P1=2, P2=1.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `review-report.md` | Created | 9-section severity-classified audit report. P0=1, P1=2, P2=1, verdict FAIL. |
| `spec.md` | Created | Scope and acceptance criteria for the audit packet. |
| `plan.md` | Created | Audit execution plan with evidence strategy. |
| `tasks.md` | Created | Completed audit task ledger, 17 tasks. |
| `checklist.md` | Created | Verification checklist with evidence rows. |
| `implementation-summary.md` | Created | Summary of the audit deliverable and key decisions. |
| `description.json` | Created | Packet discovery metadata. |
| `graph-metadata.json` | Created | Graph metadata and dependency links. |

### Follow-Ups

- Plan remediation for P0-001: the readiness debounce in `lib/ensure-ready.ts` must either be removed for graph-answering read paths or keyed on a cheap tracked-file freshness fingerprint so fresh-to-stale transitions cannot be hidden.
- Update README to distinguish `canonicalReadiness` values (`ready`, `stale`, `missing`) from `trustState` values (`live`, `stale`, `absent`, `unavailable`) to resolve P1-001.
- Add an integration test covering the same-root fresh-then-edit transition in the degraded stress suite to resolve P1-002.
