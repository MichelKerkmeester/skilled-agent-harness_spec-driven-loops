---
title: "Code Graph Playbook 010-002: Devin Static Scenarios"
description: "7 static/build/infrastructure code-graph playbook scenarios dispatched to cli-devin SWE-1.6 via RCAF prompts with scoped agent-config recipes. 5 of 7 passed. Two P1 findings surfaced: a legacy DB binding that may explain an empty-graph appearance plus a broken Devin SessionStart hook registration path."
trigger_phrases:
  - "devin static scenarios"
  - "code graph playbook 002 static"
  - "SWE-1.6 static infra scenarios"
  - "F-019-1 legacy db binding"
  - "F-025-1 devin hook registration broken"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-26

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening/002-devin-static-scenarios` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/010-playbook-validation-and-hardening`

### Summary

Seven of the 22 code-graph manual-testing playbook scenarios had never been run against the renamed (post-`mk-code-index`) surface. These static/build/infrastructure scenarios did not require a live MCP runtime, making them suitable for dispatch to cli-devin SWE-1.6 with RCAF framing and a scoped agent-config recipe.

Three dispatch batches ran sequentially. Scenarios 016, 017, 018, 020, 021 passed. Two P1 findings were surfaced and logged for follow-on remediation. Finding F-019-1 identified a legacy SQLite database at `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite` (106 KB) that persists alongside the canonical 68 MB database, matching the size the runtime reported during an empty-graph smoke run, suggesting the runtime may be bound to the empty legacy file. Finding F-025-1 confirmed the Devin CLI SessionStart hook code is correct. The registration path in `.devin/hooks.v1.json` points to a non-existent path under the old `system-code-graph` layout. Neither finding was fixed in this phase. Both were recorded for dedicated remediation.

### Added

- `evidence.md` with a 7-row verdict table, per-scenario PASS/FAIL verdicts, finding references
- `scratch/devin-prompt-F-016-019.md` RCAF dispatch prompt covering scenarios 016 through 019
- `scratch/devin-prompt-020.md` RCAF dispatch prompt for scenario 020
- `scratch/devin-prompt-G-021-025.md` RCAF dispatch prompt covering scenarios 021 and 025
- `scratch/agent-config-F.json` and `scratch/agent-config-F.resolved.json` for batch F dispatch
- `scratch/agent-config-020.json` and `scratch/agent-config-020.resolved.json` for scenario 020
- `scratch/agent-config-G.json` and `scratch/agent-config-G.resolved.json` for batch G dispatch
- `scratch/evidence-F-stdout.log`, `scratch/evidence-020-stdout.log`, `scratch/evidence-G-stdout.log` raw captured output

### Changed

- None

### Fixed

- None

### Verification

| Check | Result |
|-------|--------|
| 016 MCP tool manifest post-rename | PASS. Exactly 8 distinct tools, no legacy `system_code_graph` names. |
| 017 Launcher startup prefix | PASS. stderr shows `[mk-code-index-launcher]` prefix, no legacy prefix, no unhandled exception. |
| 018 mcp.json server key rename | PASS. `.claude/mcp.json` has `mk_code_index` key, `system_code_graph` absent. |
| 019 Database path verification | FAIL (F-019-1). Canonical 68 MB DB exists, but legacy 106 KB DB still present, matching empty-graph runtime size. |
| 020 TypeScript build and entry point | PASS (finding F-020-1: playbook documents 11 tools, runtime exposes 8). |
| 021 Root dist cleanup | PASS. Clean build, `mcp_server/dist/index.js` present, root-level `dist/` absent. |
| 025 Devin CLI SessionStart hook | FAIL (F-025-1). Hook code is correct, but `.devin/hooks.v1.json` registration path does not exist. |
| Agent-config recipe parse | PASS. 5-key read-only recipe accepted by `devin` binary with no parse errors. |
| validate.sh --strict (packet) | PENDING. Completion at authoring time: 7/7 verdicts recorded. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `002-devin-static-scenarios/evidence.md` | Created | 7-row verdict table with command proof, 4 surfaced findings |
| `002-devin-static-scenarios/scratch/devin-prompt-F-016-019.md` | Created | RCAF prompt for scenarios 016-019 batch F |
| `002-devin-static-scenarios/scratch/devin-prompt-020.md` | Created | RCAF prompt for scenario 020 |
| `002-devin-static-scenarios/scratch/devin-prompt-G-021-025.md` | Created | RCAF prompt for scenarios 021 and 025 batch G |
| `002-devin-static-scenarios/scratch/agent-config-F.json` | Created | SWE-1.6 scoped permission recipe for batch F |
| `002-devin-static-scenarios/scratch/agent-config-F.resolved.json` | Created | Resolved agent-config for batch F |
| `002-devin-static-scenarios/scratch/agent-config-020.json` | Created | SWE-1.6 scoped permission recipe for scenario 020 |
| `002-devin-static-scenarios/scratch/agent-config-020.resolved.json` | Created | Resolved agent-config for scenario 020 |
| `002-devin-static-scenarios/scratch/agent-config-G.json` | Created | SWE-1.6 scoped permission recipe for batch G |
| `002-devin-static-scenarios/scratch/agent-config-G.resolved.json` | Created | Resolved agent-config for batch G |
| `002-devin-static-scenarios/scratch/evidence-F-stdout.log` | Created | Raw stdout for batch F dispatch |
| `002-devin-static-scenarios/scratch/evidence-020-stdout.log` | Created | Raw stdout for scenario 020 dispatch |
| `002-devin-static-scenarios/scratch/evidence-G-stdout.log` | Created | Raw stdout for batch G dispatch |

### Follow-Ups

- Fix the `command` path in `.devin/hooks.v1.json` to point to `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/devin/session-start.js` (F-025-1 remediation).
- Verify the active MCP runtime DB binding and remove the legacy `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite` file (F-019-1 remediation).
- Reconcile scenario 020 expected tool count from 11 to 8 in the playbook doc (F-020-1 follow-on).
- Correct the playbook index label for scenario 021 from "unicode-normalization fix from 009" to "root dist cleanup verification" (F-021-1 follow-on).
