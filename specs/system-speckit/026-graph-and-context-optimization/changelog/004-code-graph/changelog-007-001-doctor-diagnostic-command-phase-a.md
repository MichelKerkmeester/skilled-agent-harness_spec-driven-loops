---
title: "Code Graph Doctor Command Phase A: Diagnostic-Only /doctor:code-graph"
description: "New /doctor:code-graph slash command shipped in diagnostic-only mode. The command audits code-graph index health, detects stale files, missed files, bloat directories. It produces a markdown report with proposed exclude-rule recommendations. No source files are mutated in Phase A."
trigger_phrases:
  - "doctor code-graph command"
  - "/doctor:code-graph implementation"
  - "code graph diagnostic command"
  - "code graph doctor phase a"
  - "doctor code-graph auto confirm yaml"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-25

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/007-docs-and-readmes/001-doctor-diagnostic-command-phase-a` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/007-docs-and-readmes`

### Summary

Code-graph operators had no dedicated diagnostic surface. When the index went stale or accumulated bloat from `node_modules/`, `dist/`, generated artifacts, the only path was to manually inspect `code_graph_status`, eyeball `detect_changes`, then grep for bloat directories. There was no equivalent to `/doctor:skill-advisor` for the graph index.

Phase A ships a diagnostic-only `/doctor:code-graph` command that covers the full audit workflow in three phases: Discovery (index status), Analysis (stale file delta plus bloat detection), then Proposal-as-report (a markdown report with proposed exclude rules). Two YAML workflow assets cover autonomous and interactive modes. A user-facing install guide plus a Doctor Commands section update in the main README round out the delivery. Phase B (apply mode with automatic re-scan) is explicitly gated on the verification battery plus staleness model produced by the sibling research packet.

### Added

- `/doctor:code-graph` command markdown at `.opencode/commands/doctor/code-graph.md` with `:auto` and `:confirm` modes. The file lists the `code_graph_*` MCP tools in `allowed-tools` and sets `argument-hint: "[:auto|:confirm] [--scope=stale|missed|bloat|all]"`
- `doctor_code-graph_auto.yaml` workflow asset with three phases (Discovery, Analysis, Proposal-as-report) and end-to-end self-validation
- `doctor_code-graph_confirm.yaml` workflow asset with a `pre_phase_2` approval gate so the user can review the analysis before the proposal is generated
- `SET-UP - Code Graph.md` install guide with AI-first copy-paste prompt, prerequisite checklist, scope flag table, 3-phase diagram, plus a troubleshooting matrix
- Doctor Commands section in `.opencode/README.md` updated to list four commands (mcp_install, mcp_debug, skill-advisor, code-graph) with counts bumped from 22/30 to 23/32

### Changed

- Both YAML workflow assets declare `mutation_boundaries.allowed_targets: []` as a structural Phase A invariant. The field prevents any apply step from being added by accident in future edits.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| Both YAML workflows parse via `python3 yaml.safe_load` | PASS |
| Command markdown frontmatter parses (description, argument-hint, allowed-tools) | PASS |
| Command appears in runtime skill list as `doctor:code-graph` | PASS. Visible in skills list after creation. |
| Strict spec-folder validation on `001-doctor-diagnostic-command-phase-a/` | PASS. 0 errors, 0 warnings. |
| `mutation_boundaries.allowed_targets` is empty `[]` in both YAMLs | PASS. Phase A invariant enforced. |
| `description.json` and `graph-metadata.json` present | PASS |
| Cross-references to research packet present in spec, plan, command markdown | PASS |
| Install guide DQI baseline | Not yet measured. Tracked as follow-up. |
| End-to-end smoke test (`/doctor:code-graph:auto` against this repo) | DEFERRED. First invocation runs after merge. |

### Files Changed

| File | Action | What changed |
|------|--------|-------------|
| `.opencode/commands/doctor/assets/doctor_code-graph_auto.yaml` (NEW) | Created | Autonomous 3-phase diagnostic workflow |
| `.opencode/commands/doctor/assets/doctor_code-graph_confirm.yaml` (NEW) | Created | Interactive workflow with one pre_phase_2 approval gate |
| `.opencode/install_guides/SET-UP - Code Graph.md` (NEW) | Created | User-facing diagnostic guide with install, usage, troubleshooting sections |
| `.opencode/README.md` | Modified | Doctor Commands section updated from 3 to 4 commands. Counts updated from 22/30 to 23/32. |

### Follow-Ups

- Promote Phase A to Phase B (apply mode) by consuming the verification battery, staleness model, recovery playbook, plus exclude-rule confidence tiers produced by the sibling research packet. A follow-up packet would add the apply step, verification battery harness, plus auto-rollback flow.
- Update both YAML workflow assets to reference the authoritative bloat-dir tier definitions from the research packet's `assets/exclude-rule-confidence.json` instead of the current placeholder defaults.
- Surface `fresh`, `soft-stale`, plus `hard-stale` classification tiers in the Phase A diagnostic report by consuming the staleness threshold model defined in the research packet's `assets/staleness-model.md`.
- Smoke-test the MCP tool fallback paths (git status and glob comparison) against a real degraded state where `code_graph_status` or `detect_changes` are unavailable.
- Measure the install guide DQI baseline and record the score in the packet checklist.
