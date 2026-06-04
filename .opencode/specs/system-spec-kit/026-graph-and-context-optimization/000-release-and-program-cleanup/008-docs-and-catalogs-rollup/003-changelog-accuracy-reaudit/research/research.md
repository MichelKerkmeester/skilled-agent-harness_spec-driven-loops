---
title: "Deep Research: 026 Changelog Accuracy and Folder-Alignment Audit"
description: "20-iteration, 5-way-parallel gpt-5.5-fast-high audit of changelog-to-spec-folder accuracy in the 003-memory-and-causal-runtime track. Verdicts plus verified findings split by ownership."
importance_tier: "important"
contextType: "research"
---

# Deep Research: 026 Changelog Accuracy Audit

<!-- ANCHOR:convergence-report -->
## Summary

20 iterations, 5 concurrent gpt-5.5-fast (high) executors via cli-opencode --pure, one changelog audited per iteration. Each executor read the changelog, resolved its Spec-folder line, read the packet docs, and checked whether Summary, Added, Changed, Fixed, Files Changed, and Verification claims match the real docs and shipped files.

Verdict tally: ACCURATE 3, MINOR-DRIFT 8, MAJOR-DRIFT 9.

The findings split into two cohorts: the 7 just-authored changelogs (020 through 026, the priority set) and 13 older sidecar-reaper changelogs (016 through 019 series).
<!-- /ANCHOR:convergence-report -->

---

<!-- ANCHOR:findings -->
## Cohort A: the 7 authored changelogs (020 through 026)

| Changelog | Verdict | Verified finding | Action |
|-----------|---------|------------------|--------|
| 020-lease-socket-path | MINOR | Records 34 passed / 16 skipped, which was correct at its ship time. Packet 024 later un-skipped the launcher-lease suite, so a re-run now reports 43 / 8. Historical accuracy holds. | Left as historical, note added |
| 021-relation-inference-backfill | MINOR | The packet implementation-summary description frontmatter still said "deploy pending" although the work shipped and deployed as d32d90c3f1. The changelog itself was accurate. | Fixed the stale packet doc |
| 022-readme-doc-sync | ACCURATE | No drift. | None |
| 023-semantic-relation-inference | MINOR | Verification said 166 passed, the committed state is 169 after the polish added three tests. Commit b834150fe5 also changed lib/causal/README.md, omitted from Files Changed. | Fixed the count and the file list |
| 024-launcher-lease-integration-test | MAJOR (not reproduced) | The auditor reported an orphan process from its own test run. No orphan process or test temp dir exists now. The zero-orphan claim was independently verified three times during the original work and again here. | No change, watch-item |
| 025-tool-layer-map-unlink | ACCURATE | No drift. | None |
| 026-relation-backfill-review-remediation | MINOR | Files Changed used mcp_server/... shorthand that does not resolve from the workspace root. The cross-model verification note lives only in the changelog, not the packet docs. | Normalized paths to full .opencode/skills/... form |

## Cohort B: 13 sidecar-reaper changelogs (016 through 019 series)

Mostly MAJOR or MINOR drift, but the root cause is consistent and not a changelog-authoring defect: these changelogs are historical records of work whose files were later removed in cleanup commits (for example 696c889887 deleted the rerank-sidecar Python and launcher files), and several parent spec.md and graph-metadata.json files still carry stale Draft or Planned status from before the work shipped. The changelogs faithfully record what changed at the time. The drift is the codebase moving past the historical record plus pre-existing stale parent metadata.

These were not authored in this session and are out of scope for this audit's remediation. Recommended follow-up for that track's owner: refresh the stale parent spec statuses, and decide whether deleted-file changelogs should carry a later-removed marker.
<!-- /ANCHOR:findings -->

---

## Method and Convergence

- maxIterations 20, all 20 ran (the manifest held exactly 20 distinct changelogs, so no early convergence stop).
- Executor cli-opencode openai/gpt-5.5-fast --variant high --pure, read-only, 5-way concurrent via an xargs pool.
- State: deep-research-state.jsonl plus iterations/iteration-001 through 020 plus deltas/.
- Note on tool accuracy: gpt-5.5-fast verdicts were treated as leads, not ground truth. Every Cohort-A finding was re-verified by direct file read and git before any fix. The 024 MAJOR finding did not reproduce.

## Next Steps

- Cohort A real drift fixed in this session (021 packet doc, 023 changelog, 026 changelog paths).
- Cohort B is a separate follow-up for the sidecar-reaper track owner.

STATUS=OK
