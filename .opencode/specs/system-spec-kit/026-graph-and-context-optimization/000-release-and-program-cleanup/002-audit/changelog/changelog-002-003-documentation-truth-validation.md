---
title: "Audit Phase 003: Documentation Truth Validation"
description: "Doc-only remediation that replaced stale automation claims in operator-facing docs with explicit trigger columns plus accurate hook contracts for Copilot, Codex, CCC validation gates."
trigger_phrases:
  - "003 documentation truth validation"
  - "doc truth pass"
  - "automation trigger columns"
  - "hook contract remediation"
  - "copilot codex hook docs fix"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/002-audit/003-documentation-truth-validation` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/002-audit`

### Summary

Several operator-facing docs described automation more broadly than the implementation supported. The 013 supplemental research identified five high-leverage Tier A issues: the shared hook reference mentioned a stale Claude-style Copilot wrapper that Copilot does not use. Codex docs blurred example templates with live user-runtime registration paths. The CCC command home and architecture handler paths were stale. Validation docs used "automatic" wording where the real gate requires explicitly running `validate.sh --strict`.

This phase applied documentation-only fixes across seven files. Each automation claim now names a real trigger: runtime hook, slash command, direct MCP call, feature flag, none. A trigger column was added wherever broad automation claims were summarized. No runtime code was changed. Strict packet validation exited 0 with zero errors and zero warnings.

### Added

- Trigger columns in `hook_system.md` listing per-runtime registration path and live-trigger contract for Copilot and Codex
- `/memory:manage ccc ...` routing entry in `manage.md` to align the command surface with the CCC tool set
- Automation trigger table in `SKILL.md` and `CLAUDE.md` distinguishing runtime-hooked from workflow-required from manual fallback paths

### Changed

- `hook_system.md` Copilot section now defers registration to the Copilot-local README and removes the stale `.claude/settings.local.json` wrapper claim
- `hook_system.md` Codex section now separates `.codex/settings.json` example template from the live user-runtime contract (`~/.codex/config.toml` and `~/.codex/hooks.json`)
- `ARCHITECTURE.md` CCC handler rows updated to point at actual `mcp_server/code_graph/handlers/*.ts` paths and the correct `index.ts` export
- `AGENTS.md` and `SKILL.md` validation wording changed from "automatically" to a workflow-required gate with the explicit `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` command
- `mcp_server/README.md` watcher and CCC wording updated to name trigger conditions rather than imply always-on automation

### Fixed

- Copilot hook docs previously directed operators to a stale Claude settings wrapper path that Copilot does not use. The shared reference now points at the Copilot-local README.
- Codex hook docs previously implied `.codex/settings.json` was a live runtime file. Docs now distinguish it as an example template.
- CCC architecture handler paths were stale. Paths now reflect the actual `code_graph/handlers/` locations committed to the repo.

### Verification

| Check | Command or Artifact | Result |
|-------|---------------------|--------|
| Strict validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/.../003-documentation-truth-validation --strict` | PASS: 0 errors, 0 warnings |
| Runtime-code scope | targeted `git diff --name-only` review | PASS: no `.ts` `.js` `.py` runtime files edited |
| Stale wording check | `rg` for Copilot wrapper and validation auto-run claims | PASS: stale claims replaced with trigger-specific wording |
| Checklist P0 items | 8 CHK-P0 items in `checklist.md` | 8/8 verified |
| Checklist P1 items | 12 CHK-P1 items in `checklist.md` | 12/12 verified |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/references/config/hook_system.md` | Modified | Copilot defers to local README. Codex separates template from live registration. Trigger columns added. |
| `.opencode/commands/memory/manage.md` | Modified | CCC routing entry added for `/memory:manage ccc ...` |
| `.opencode/skills/system-spec-kit/ARCHITECTURE.md` | Modified | CCC handler rows point at actual `code_graph/handlers/*.ts` paths. |
| `.opencode/skills/system-spec-kit/SKILL.md` | Modified | Validation wording changed to workflow-required gate. Hook trigger table added. CCC triggers updated. |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Modified | Trigger columns and watcher/CCC wording updated to name real activation paths. |
| `AGENTS.md` and `CLAUDE.md` | Modified | Validation wording updated. Automation trigger table added. |

### Follow-Ups

- Runtime automation behavior remains unchanged by design. Packets 032-035 must decide implementation changes for watcher, retention, half-auto upgrades plus matrix execution.
- Existing working-tree changes outside this packet were left untouched.
