---
title: "Deep Research Dashboard - swe2 lineage"
trigger_phrases: []
---
# Deep Research Dashboard - swe2 lineage

**Session:** `fanout-swe2-1789363775244-64o2qi` · **Executor:** `cli-devin / swe-2-max` · **Stop policy:** `max-iterations (max 3)` — **REACHED** · **Convergence:** `off` (telemetry only)

_Reducer-style dashboard for the detached lineage; all writes are bounded to this directory._

## Status

- Phase init: complete.
- Main loop: complete, 3/3 iterations recorded.
- Synthesis: complete.
- Stop reason: `maxIterationsReached`.
- Direct artifact binding: `config.fanout_lineage_artifact_dir`; `resolveArtifactRoot` skipped.
- Parent spec writeback, continuity/memory save, shared telemetry, and git staging: skipped by boundary.
- Execution: all iterations performed inline by this session; no nested dispatch.

## Iteration Table

| run | focus | newInfoRatio | findings | status |
|-----|-------|--------------|----------|--------|
| 1 | Cost decomposition of provisioning; git-native reductions (sparse/partial/shallow/reference) | 0.90 | 8 | complete |
| 2 | Filesystem-level sharing under registration: APFS clonefile, overlayfs, sandboxed dirs | 0.85 | 10 | complete |
| 3 | Single-checkout mechanisms, churn detector, relocation matrix, ranked verdict | 0.70 | 9 | complete |

## Question Status

**Addressed:** 6/6 research questions · **Runtime follow-up gates:** 2

- [x] Where the 22 s / 1.6 GB goes: working-tree materialization + index; objects already shared.
- [x] Git-native reductions: sparse cones and no-checkout restore keep attribution; clones ruled out.
- [x] Filesystem-level sharing: `--no-checkout` + APFS clonefile ≈ 1–4 s / ~0 disk / exact attribution, and dissolves self-link + entry-guard hazards.
- [x] Single-checkout attribution: only via OS write denial (prevention) or privileged observe-by-PID; tree-diff on shared bytes is unsound.
- [x] Breakage surfaces mapped per mechanism (dep roots, self-links, entry guards, churn detector).
- [x] Relocation: `git worktree move` survives all registered variants; enclosing-checkout move breaks all equally.
- [~] Clonefile setup estimate (~1–4 s) is reasoned, not measured — prototype gate.
- [~] Dep-root write-escape and missing cumulative churn arm are candidate findings to file upstream.

## Verdict

Ranked: (a) `git worktree add --no-checkout` + `cp -Rc` clonefile incl. dep roots; (b) sparse-cone worktree as portable fallback; (c) seatbelt-style write denial as optional complement on degraded paths. Full synthesis in `research.md`.
