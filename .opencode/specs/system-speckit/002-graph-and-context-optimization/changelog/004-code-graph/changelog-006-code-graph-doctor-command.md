---
title: "Code Graph Phase 006: Doctor Command"
description: "Phase A diagnostic-only /doctor:code-graph command shipped. Command markdown, auto workflow, confirm workflow, install guide, and Doctor Commands section update all landed. Phase B (apply mode with auto-fix operations) is explicitly gated on research packet 007."
trigger_phrases:
  - "phase 006 changelog"
  - "doctor code graph command"
  - "/doctor:code-graph"
  - "code graph diagnostics"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-25

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph` (Level 2)
> Parent packet: `002-graph-and-context-optimization/004-code-graph`

### Summary

Operators had no quick way to check the health of the code-graph system. The status handler exposed metrics but required knowing which MCP tool to call and how to interpret the response. The scan handler could rebuild the graph but required operator knowledge of scope and stale-gate behavior.

A `/doctor:code-graph` slash command was built following the same pattern as the existing `/doctor:skill-advisor` command. The command has two modes: `auto` (runs diagnostics and prints a summary) and `confirm` (requires operator confirmation before any action). Phase A shipped diagnostic-only. Phase B (apply mode with auto-fix operations) is explicitly gated on research packet 007 producing the verification battery, staleness model, recovery playbook, and exclude-rule confidence tiers.

Phase A deliverables:
- **Command markdown** at `.opencode/commands/doctor-code-graph.md` with the full slash-command definition, description, argument schema, and mode descriptions.
- **Auto workflow YAML** at `.opencode/commands/doctor-code-graph/auto.yaml` that runs diagnostics (status, readiness, bloat-check) and prints a summary.
- **Confirm workflow YAML** at `.opencode/commands/doctor-code-graph/confirm.yaml` that runs diagnostics, prints the summary, and waits for operator confirmation before proceeding.
- **Install guide** documenting the command's installation, usage, and diagnostic output format.
- **Doctor Commands section** in the README listing the new command alongside the existing skill-advisor doctor command.

The command mirrors the `/doctor:skill-advisor` pattern in structure, voice, and workflow design. Bloat-dir defaults are placeholders. Authoritative tiers come from research packet 007.

### Added

- `.opencode/commands/doctor-code-graph.md` command markdown
- `.opencode/commands/doctor-code-graph/auto.yaml` diagnostic-only auto workflow
- `.opencode/commands/doctor-code-graph/confirm.yaml` diagnostic + confirmation workflow
- `docs/install-guide-doctor-code-graph.md` install guide
- README Doctor Commands section entry for `/doctor:code-graph`

### Changed

- None. Additive-only phase.

### Fixed

- None. Additive-only phase.

### Verification

- Command markdown: passes slash-command validation (required sections present: description, argument schema, modes).
- Auto workflow YAML: valid YAML syntax, references existing MCP tools.
- Confirm workflow YAML: valid YAML syntax, includes confirmation gate.
- Install guide: follows the existing doctor-command guide template.
- Strict packet validation (`validate.sh --strict`): passed.

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/commands/doctor-code-graph.md` (NEW) | Slash-command markdown definition |
| `.opencode/commands/doctor-code-graph/auto.yaml` (NEW) | Diagnostic-only auto workflow |
| `.opencode/commands/doctor-code-graph/confirm.yaml` (NEW) | Diagnostic + confirmation workflow |
| `docs/install-guide-doctor-code-graph.md` (NEW) | Operator install guide |
| `README.md` | Doctor Commands section expanded |

### Follow-Ups

- **Phase B promotion.** Apply-mode operations (auto-fix) are gated on research packet 007 producing the verification battery, staleness model, recovery playbook, and exclude-rule confidence tiers. Once 007 converges, Phase B can be implemented.
- **Bloat-dir authoritative tiers.** The current bloat-dir defaults are placeholders. Research packet 007 will produce calibrated tiers.
