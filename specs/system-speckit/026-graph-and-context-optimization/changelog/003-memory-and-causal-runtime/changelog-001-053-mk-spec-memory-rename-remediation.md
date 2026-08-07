---
title: "053: MCP Namespace Remediation after mk-spec-memory Rename"
description: "Closed 11 conditional 052 deep-review findings by correcting MCP namespace ownership across command files and refreshing all 052 shipped packet documentation."
trigger_phrases:
  - "053 mk-spec-memory rename remediation"
  - "052 deep-review findings remediation"
  - "MCP namespace ownership fix"
  - "mk-code-index advisor namespace correction"
  - "052 rename packet doc refresh"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/053-mk-spec-memory-rename-remediation` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

The 052 mk-spec-memory rename shipped the server rename correctly but left command-layer tool allowlists still routing code-graph, `detect_changes`, CCC as well as advisor tools under `mk-spec-memory`. Deep review (052) produced 11 conditional findings covering namespace ownership regressions, stale packet metadata plus missing VS Code launcher parity.

This remediation corrected MCP namespace ownership across three command files, aligned `.vscode/mcp.json` to the `mk-spec-memory` launcher, replaced the 052 plan scaffold with the actual shipped rename plan. All 052 packet docs and the findings registry are marked resolved. The command layer now routes code-graph and `detect_changes` tools to `mk-code-index`, advisor tools to `mk-skill-advisor`. Memory, checkpoint, council and deep-loop tools stay under `mk-spec-memory`.

### Added

- 053 Level 1 remediation packet with spec, plan, tasks plus implementation summary

### Changed

- `/doctor` command allowlist split across `mk-code-index`, `mk-skill-advisor` plus `mk-spec-memory` by owning namespace
- `doctor/_routes.yaml` advisor tool routes moved from `mk-spec-memory` to `mk-skill-advisor`
- `/memory:manage` command CCC allowlist and examples moved to `mk-code-index`
- `.vscode/mcp.json` updated to use `mk-spec-memory` launcher instead of direct dist entrypoint
- 052 `resource-map.md` reconciled with `.mcp.json` and `.vscode/mcp.json` entries and updated counts

### Fixed

- Namespace leak: `mcp__mk_spec_memory__code_graph`, `mcp__mk_spec_memory__detect_changes` plus `mcp__mk_spec_memory__advisor` references removed from command files
- 052 `spec.md` marked shipped with completion 100 and corrected old-prefix acceptance language
- 052 `graph-metadata.json` status set to `complete` with refreshed key files
- 052 `plan.md` replaced scaffold placeholder with the actual shipped rename plan
- 052 `implementation-summary.md` pending validation row replaced with PASS evidence
- 052 `review/deep-review-findings-registry.json` findings marked resolved with 053 back-pointer

### Verification

| Test | Status | Command or Evidence |
|------|--------|---------------------|
| Namespace leak grep | PASS | `grep -E 'mcp__mk_spec_memory__(code_graph|ccc|advisor|detect_changes)'` across three command files returned zero matches |
| New namespace grep | PASS | Non-zero counts confirmed in `doctor.md` mk-code-index, `_routes.yaml` mk-skill-advisor plus `manage.md` mk-code-index CCC |
| JSON syntax | PASS | `node -e` parsed `.vscode/mcp.json`, both graph metadata files, `description.json` plus findings registry without error |
| Strict validation 052 | PASS | `validate.sh --strict` exited 0 with zero errors and zero warnings |
| Strict validation 053 | PASS | `validate.sh --strict` exited 0 with zero errors and zero warnings |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/commands/doctor/_routes.yaml` | Modified | Advisor tools routed to `mk-skill-advisor`. Ownership comments clarified. |
| `.opencode/commands/memory/manage.md` | Modified | CCC allowlist and examples moved to `mk-code-index`. |
| `.vscode/mcp.json` | Modified | Switched to `mk-spec-memory` launcher via `.opencode/bin/mk-spec-memory-launcher.cjs`. |
| `052-mk-spec-memory-rename/plan.md` | Rewritten | Scaffold replaced with actual shipped rename plan. |
| `052-mk-spec-memory-rename/spec.md` | Modified | Marked shipped, completion 100, corrected packet pointer, fixed old-prefix acceptance text. |
| `052-mk-spec-memory-rename/graph-metadata.json` | Modified | Derived status set to `complete`. Key files refreshed. |
| `052-mk-spec-memory-rename/resource-map.md` | Modified | Added `.mcp.json` and `.vscode/mcp.json` rows. Reconciled runtime surface counts. |
| `052-mk-spec-memory-rename/implementation-summary.md` | Modified | Replaced pending validation row with PASS evidence. |
| `052-mk-spec-memory-rename/review/deep-review-findings-registry.json` | Modified | All findings marked resolved with 053 back-pointer and resolution timestamp. |

### Follow-Ups

- The review registry on disk differed from the 11-finding contract in the 052 review prompt because the worktree already had registry edits from a parallel session. Current entries were preserved and annotated resolved rather than reverted.
- Historical packet docs outside the allowed 052 files were left untouched as an audit trail.
