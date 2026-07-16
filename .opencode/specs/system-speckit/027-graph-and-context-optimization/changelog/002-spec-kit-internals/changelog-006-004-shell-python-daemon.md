

---
title: "Shell/Python/Daemon Wave Execution (Playbook Run Phase 004)"
description: "Delegated compat, operator-H5, auto-update-daemon, auto-indexing, lifecycle-routing, scorer-fusion and python-compat scenarios to CLI executors. The full 46-scenario playbook run completed, surfacing a corpus-accuracy regression and two python-suite failures that block release."
trigger_phrases:
  - "playbook shell python daemon waves"
  - "CP OP AU AI LC SC PC scenarios"
  - "028 phase 004"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation/004-shell-python-daemon` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/006-playbook-run-and-remediation`

### Summary

This phase finished the playbook run by delegating compat, auto-update-daemon, auto-indexing, lifecycle-routing, scorer-fusion and python-compat waves to CLI executors and running operator-H5 scenarios locally. The headline: the whole 46-scenario run is complete, and it surfaced real defects rather than a clean pass. Release is NOT READY due to a corpus-accuracy regression (corroborated across three independent harnesses) and two python-suite failures (PC-004, PC-005).

### Added

- Isolated worktree for Devin dangerous-mode dispatch with node_modules/dist symlinked
- CLI delegation framework for OpenCode (DeepSeek) and Devin (SWE-1.6) with RCAF-formatted pre-planned prompts
- Independent reproduction of PC-004 and PC-005 failures in the main environment against the live SQLite graph

### Changed

- Devin dispatched in dangerous mode confined to an isolated git worktree instead of the main repository- OpenCode run without dangerously-skip-permissions to keep the dispatch safe

### Fixed

- None.

### Verification

- SC wave (opencode) - 3 PASS, 2 PARTIAL
- AI wave (opencode) - 2 PASS, 1 PARTIAL, 2 SKIP
- LC wave (opencode) - 1 PASS, 1 PARTIAL, 3 SKIP
- PC wave (devin) - 1 PASS, 2 PARTIAL, 2 FAIL
- CP wave (devin) - 3 PASS, 1 PARTIAL
- AU wave (devin) - 5 SKIP
- OP wave (local) - 3 SKIP
- PC-004 reproduced in main env - FAIL confirmed (P0 50%, all gates fail)
- PC-005 reproduced in main env - FAIL confirmed (warm/cold p95 gates fail)
- Worktree git status post-Devin - PASS, clean (no tracked mutation)
- SC wave accuracy figure (50.78%) corroborated by NC-003 phase002 and PC-004 regression across three independent harnesses
- Phase-004 total - 10 PASS, 7 PARTIAL, 2 FAIL, 13 SKIP

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| Packet docs (spec, plan, tasks, checklist, implementation-summary) | Created | Scoped packet documentation |

### Follow-Ups

- 13 SKIPs are infrastructure-gated. AU (5), OP (3), AI-004/005, LC-002/004/005 all need a disposable repo copy with an active daemon watcher and fault injection, not stood up this session. The daemon healthy path is verified in phase 002, recovery paths are not.
- Findings are recorded but not fixed. The accuracy regression, PC-005 doc gap (missing --dataset flag), semantic_shadow drift (live weight 0.05 vs scenario assumption of shadow-only), and bridge native-route failure are all out of scope and flagged for a follow-on remediation packet.
- Working-tree graph-metadata churn (~1296 files) from routine context-server daemon activity during the session. These are timestamp bumps, not source edits, and were left untouched to avoid reverting 1296 files.
