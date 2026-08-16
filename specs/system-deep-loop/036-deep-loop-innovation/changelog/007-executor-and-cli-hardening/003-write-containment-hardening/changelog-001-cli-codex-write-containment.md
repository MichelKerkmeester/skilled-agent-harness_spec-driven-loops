---
title: "Changelog: codex Write-Containment Guard for Deep-Loop Dispatches [007-executor-and-cli-hardening/003-write-containment-hardening/001-cli-codex-write-containment]"
description: "Structural post-dispatch guard that reverts and fails any codex leaf write outside its artifact directory, closing the asymmetry with the cli-opencode dispatch branch."
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

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/003-write-containment-hardening/001-cli-codex-write-containment` (Level 2)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/003-write-containment-hardening`

### Summary

This phase adds a structural post-dispatch write-containment guard for `cli-codex` leaves, which previously had only prose in the prompt to keep them inside their artifact directory while the cli-opencode branch carried structural guards. After each codex iteration the guard computes git working-tree changes outside the artifact dir, subtracts paths already dirty before dispatch, and for any new out-of-scope change reverts exactly those paths, records a `containment_violation` event, and fails the iteration fail-closed. The motivating incident was a real deep-review run in which a codex leaf deleted 351 lines from an out-of-scope file. The spec records its status as Complete with regression tests over a temp git repo.
