---
title: "Code Graph Phase 008/002: Native Rerun of Deferred Usefulness Cells"
description: "Native re-execution of usefulness cells deferred by the Phase 008/001 sandbox campaign. Logged 13 native trial rows, validated three advisor probes, verified two prior backlog fixes. The code-graph verdict was updated to OVERHEAD based on scope drift, zero-node persistence plus parser crash failure modes observed on the real MCP path."
trigger_phrases:
  - "native rerun deferred usefulness cells"
  - "code graph verdict overhead"
  - "native trial log 13 rows"
  - "scope drift zero node parser crash"
  - "advisor probes 3 of 3 correct"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-06

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning/002-native-deferred-trial-rerun` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/008-real-world-usefulness-test-planning`

### Summary

The Phase 008/001 sandbox campaign deferred a set of usefulness cells that required live MCP access, native runtime hooks, real file-system state. None of those were available in the sandbox. The sandbox verdict treated code-graph overhead as sandbox-bound rather than a native product finding.

This packet re-ran those deferred cells against a live environment. The first scan indexed 9,280 files and produced 56,843 nodes and 36,347 edges. Three follow-up queries were blocked by candidate manifest drift. A scope-mismatched scan wiped the live index to zero nodes. A recovery scan did not restore the graph. These are native product failure modes, not sandbox limits. The code-graph usefulness verdict was updated to OVERHEAD. Advisor routing passed 3 of 3 probes. Two prior backlog fixes from the sandbox synthesis were verified against live outputs. A synthesis report records the updated verdict and a three-item P0 backlog for the code-graph defects.

### Added

- `synthesis-report-native-rerun.md` with the updated verdict per axis (code-graph OVERHEAD, hooks USEFUL, plugin/runtime integration DEFERRED) and a four-item backlog.
- `trials/trial-log.jsonl` rows for 13 native measurements: code-graph scan, query, wipe, recovery, advisor probes, compaction formatting, backlog-fix verification.
- Raw evidence files in `trials/raw/` for seven measurement classes: first scan, drift blocks, zero-node scans, advisor probes, compaction hook cache, backlog fixes.

### Changed

- Usefulness verdict for code-graph: downgraded from sandbox-provisional to OVERHEAD based on scope drift, zero-node wipe plus parser crash evidence from the native run.
- Parent `graph-metadata.json` `children_ids` updated to include `002-native-deferred-trial-rerun`.

### Fixed

- Codex session-start smoke mode: `node session-start.js --smoke` confirmed to return a valid envelope. Prior backlog item closed.
- Copilot offline preflight: two `SPEC-KIT-COPILOT-CONTEXT` markers confirmed in the live native run. Prior backlog item closed.

### Verification

| Check | Result |
|-------|--------|
| Native trial rows | PASS: 13 rows written to `trials/trial-log.jsonl`. |
| P0 prior backlog fixes | PASS: Codex smoke envelope and Copilot offline preflight markers recorded in `trials/raw/backlog-fixes.json`. |
| New P0 backlog | PASS: 3 native-derived P0 items listed in `synthesis-report-native-rerun.md`. |
| Parent metadata | PASS: `children_ids` includes `002-native-deferred-trial-rerun` in parent `graph-metadata.json`. |
| Strict validation | PASS: `validate.sh --strict` exited 0 after packet authoring. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `synthesis-report-native-rerun.md` | Created | Updated verdict table per axis. Native-derived P0 backlog. Interim workflow recommendation. |
| `trials/trial-log.jsonl` | Updated | 13 native measurement rows added. One row per measured cell. |
| `trials/raw/code-graph-first-scan.json` | Created | First scan evidence: 9,280 files, 56,843 nodes, 36,347 edges, 13,376 ms. |
| `trials/raw/code-graph-drift-blocks.json` | Created | Three query results blocked by candidate manifest drift. |
| `trials/raw/code-graph-zero-node-scans.json` | Created | Zero-node wipe and failed recovery scan evidence. |
| `trials/raw/advisor-frontend-motion.json` | Created | Advisor probe result: top-1 sk-code, score 0.86. |
| `trials/raw/advisor-save-context.json` | Created | Advisor probe result: system-spec-kit then memory:save. |
| `trials/raw/advisor-create-spec-folder.json` | Created | Advisor probe result: top-1 system-spec-kit, score 0.80. |
| `trials/raw/compaction-hook-cache.json` | Created | Compaction recovery formatting confirmed. Relevance scoring not measured. |
| `trials/raw/backlog-fixes.json` | Created | Codex smoke envelope and Copilot preflight marker evidence. |
| `../graph-metadata.json` | Updated | `children_ids` now includes `002-native-deferred-trial-rerun`. |

### Follow-Ups

- Plugin/runtime integration remains unmeasured. A separate authenticated campaign is needed before that verdict can move from DEFERRED. Candidate runtimes: cli-gemini, Claude Code native, OpenCode native.
- Compaction recovery relevance scoring was not measured. A controlled trigger is needed to confirm that hook-cache content is not just formatted but actually relevant.
- Parser crash file:line details are recorded at the class and count level only. Exact file:line citations should be extracted from the native raw transcript when fixing `structural-indexer.ts`.
