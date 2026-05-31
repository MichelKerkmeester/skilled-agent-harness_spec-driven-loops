---
title: "Code Graph Phase 010-004: Hook Registration + Playbook Doc-Sync Fixes"
description: "The Devin SessionStart hook registration path was corrected to point at the real compiled artifact. Four stale manual-testing playbook scenario docs were reconciled to match runtime reality."
trigger_phrases:
  - "devin sessionstart hook fix"
  - "playbook doc sync fixes"
  - "hooks.v1.json session start path"
  - "code graph playbook remediation 004"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-27

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening/004-hook-and-doc-fixes` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening`

### Summary

The Devin SessionStart hook in `.devin/hooks.v1.json` registered a non-existent artifact path, so the hook never fired during agent sessions. Four playbook scenario docs had drifted from runtime reality: an incorrect tool count (11 instead of 8), a stale `verify` sub-check referencing a nonexistent `rating` field, a mismatched scenario index label. Outdated YAML line ranges also needed correction.

The hook registration was corrected to point at `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/devin/session-start.js`, verified by invoking the path with a startup payload and confirming the `## Session Context` block is emitted. The four playbook docs were updated to match observed runtime state from the 029 validation run. All seven acceptance checks passed.

### Added

- None.

### Changed

- `.devin/hooks.v1.json` SessionStart `command` path now points at the real compiled system-spec-kit artifact instead of a non-existent system-code-graph path.
- `020-typescript-build-and-entry-point.md` tool count corrected from 11 to 8 (three occurrences).
- `011-tool-call-shape-validation.md` stale `code_graph_verify` sub-check replaced with `code_graph_apply({})` missing-`operation` check (the `rating` field does not exist on `verify`).
- `manual_testing_playbook.md` scenario 021 index row relabeled to "root dist cleanup verification" to match actual content.
- `010-deep-loop-graph-upsert-conditional.md` cited YAML line ranges updated from 817-836/841-863 to 854-865/1032-1051.

### Fixed

- Devin SessionStart hook never fired because `.devin/hooks.v1.json` pointed at a path that did not exist. Correcting the path restored hook execution.
- Playbook run findings F-025-1, F-020-1, F-011-1 and F-021-1 are now resolved. Re-running the affected scenarios would no longer surface these failures.

### Verification

| Check | Result |
|-------|--------|
| `.devin/hooks.v1.json` valid JSON (`jq` parses) | PASS |
| Registered hook path exists (`test -f`) | PASS |
| Hook emits payload on startup (`## Session Context`, exit 0, `status:ok`) | PASS |
| 020 "11 tools" removed (0 left, 3x "8 tools") | PASS |
| 011 verify-rating removed (apply-operation present) | PASS |
| 010 line ranges updated | PASS |
| 021 index relabeled | PASS |

### Files Changed

| File | What changed |
|------|--------------|
| `.devin/hooks.v1.json` | SessionStart `command` path corrected to system-spec-kit compiled artifact |
| `.opencode/skills/system-code-graph/manual_testing_playbook/09--post-rename-infrastructure/020-typescript-build-and-entry-point.md` | Tool count 11 changed to 8 in three places |
| `.opencode/skills/system-code-graph/manual_testing_playbook/06--mcp-tool-surface/011-tool-call-shape-validation.md` | Stale `verify` sub-check replaced with `apply-operation` missing-field check |
| `.opencode/skills/system-code-graph/manual_testing_playbook/05--coverage-graph/010-deep-loop-graph-upsert-conditional.md` | Cited YAML line ranges updated to current positions |
| `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md` | Scenario 021 index row relabeled to match actual content |

### Follow-Ups

- Resolve the ownership-doc discrepancy: `deferred_decisions.md` and four `mcp_server/hooks/<runtime>/README.md` deprecation notices still cite the non-existent `system-code-graph/dist/system-spec-kit/...` artifact path. A follow-on packet should either build the hook to that path or correct those docs to match the system-spec-kit ownership that is now in production.
