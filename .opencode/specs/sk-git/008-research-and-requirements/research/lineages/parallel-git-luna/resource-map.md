---
title: "Resource Map — What system lets many concurrent AI coding sessions commit and push to one shared long-lived branch (e.g. v4) continuously, with zero operator-visible divergence blockers (no 'N commits behind', no non-fast-forward rejections), an always-current local checkout in the IDE, and no loss of any session's concurrent uncommitted work? Investigate and compare: (RQ1) integration strategies — auto-rebase-and-retry push loops, serialized push multiplexing/daemon, merge queues, and ref-level fast-forward publishing via a scratch index / commit-tree without touching the working tree; (RQ2) workspace models — one shared working tree vs one isolated git worktree/clone per session; (RQ3) staying current safely — pull --rebase --autostash, watch-based auto-fetch, fast-forward-only updates without disturbing uncommitted changes; (RQ4) safety guarantees against orphaned autostashes, overwritten uncommitted files, force-push loss, plus rollback; (RQ5) automation surface — git hooks vs background sync daemon vs launch wrapper vs remote-side bot; (RQ6) conflict handling and avoidance — path partitioning, per-session subtrees, additive-only commits; (RQ7) existing art — git-sync, git-autosync, mob, syncthing-style mirroring, GitHub merge queue, git-town, Gerrit. Deliver an evidence-backed recommended default architecture with trade-offs and testable acceptance conditions. Cite sources."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 0
- **By category**: READMEs=0, Documents=0, Commands=0, Agents=0, Skills=0, Specs=0, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 001-research-and-requirements
- **Generated**: 2026-07-14T05:10:18.919Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.
