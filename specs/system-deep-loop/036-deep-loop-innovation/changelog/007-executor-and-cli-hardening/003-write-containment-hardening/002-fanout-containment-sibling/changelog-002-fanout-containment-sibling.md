---
title: "Changelog: fanout containment sibling lineage scope [007-executor-and-cli-hardening/003-write-containment-hardening/002-fanout-containment-sibling]"
description: "Stop the fan-out write-containment guard from reverting sibling lineages' artifacts under concurrency."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-08-13

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/003-write-containment-hardening/002-fanout-containment-sibling` (Level 2)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/003-write-containment-hardening`

### Summary

This phase confines the fan-out write-containment guard to writes it can actually attribute. Because the pre-dispatch baseline is captured before concurrent siblings write anything, the guard mis-classified every file siblings produced since dispatch as the policing leaf's violation and reverted it — an observed three-lane research fan-out reverted 39 sibling artifact paths, destroying a completed five-iteration lineage. The fix adds an `unattributableDirs` option resolved with the same repo-relative rules as `artifactDir`, excluding sibling lineage directories from both detection and revert. The spec records its status as In Progress, with handoff criteria that a leaf tripping containment reverts only its own out-of-scope writes, proven by regression test.
