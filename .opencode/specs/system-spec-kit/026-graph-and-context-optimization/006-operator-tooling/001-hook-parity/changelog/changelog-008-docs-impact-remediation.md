---
title: "Hook Parity Phase 008: Documentation impact remediation"
description: "Updated 13 external documentation files to reflect the hook, advisor, plugin-loader, renderer, and Copilot wrapper behavior actually shipped across sub-packets 001-011. 151 insertions and 69 deletions across READMEs, install guides, architecture docs, feature catalogs, and testing playbooks."
trigger_phrases:
  - "phase 009/008 changelog"
  - "docs impact remediation"
  - "hook daemon docs alignment"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-23

> Spec folder: `026-graph-and-context-optimization/007-hook-parity/008-docs-impact-remediation` (Level 2)
> Parent packet: `026-graph-and-context-optimization/007-hook-parity`

### Summary

Sub-packets 001 through 011 changed runtime hook contracts, advisor delivery, plugin-loader semantics, Copilot wrapper schema, Codex startup parity, and Claude prompt-time hook registration. The shipped behavior diverged from what the checked-in documentation still described. Ten parallel `cli-codex` impact-analysis agents audited every referenced path and flagged 13 files for update (10 HIGH, 3 MED). This phase updated all 13 files to match the shipped behavior, with a post-05 Codex reconciliation rule embedded in every agent prompt to ensure no doc still said "Codex has no lifecycle hook."

### Added

- `references/config/hook_system.md`: refreshed canonical runtime hook matrix with Codex native `SessionStart`, Claude `UserPromptSubmit` in four-event example, OpenCode plugin bridge, and Copilot file-based parity via `.claude/settings.local.json`.
- `.opencode/install_guides/SET-UP - AGENTS.md`: Gate 2 setup now teaches runtime hook brief first with `skill_advisor.py` as diagnostic fallback. Added native-tool/bootstrap verification steps and `--force-native`/`--force-local`/disable-flag notes.
- `.opencode/skills/system-spec-kit/ARCHITECTURE.md`: Copilot file-based transport documented. OpenCode plugin bridge ESM default-export entrypoint documented. Per-instance state isolation, in-flight dedup, and cap/eviction documented.
- `mcp_server/hooks/copilot/README.md`: Registration example replaced to show `.claude/settings.local.json` wrapper contract instead of `.github/hooks/scripts/*.sh`. Claude nested commands noted as coexisting.
- `mcp_server/INSTALL_GUIDE.md`: Added `advisor_recommend`/`advisor_status`/`advisor_validate` to verification. Copilot row revised for merged wrapper execution and top-level fields.
- `mcp_server/ENV_REFERENCE.md`: Added `SPECKIT_CODEX_HOOK_TIMEOUT_MS` (default 3000 ms) with scope and timeout-fallback behavior.
- `mcp_server/README.md`: Added hook-surface summary with cross-links to runtime hook READMEs.

### Changed

- `.opencode/README.md`: Gate 2 prose and directory structure updated. Advisor surface pointer corrected to `mcp_server/skill-advisor/`. Hook-primary routing with `skill_advisor.py` described as compatibility/scripted fallback.
- `.opencode/skills/system-spec-kit/README.md`: Hook-primary skill-advisor section. `scripts/` ESM module profile. Copilot runtime-hooks summary. Prompt-vs-lifecycle split.
- `.opencode/skills/system-spec-kit/SKILL.md`: Startup/recovery split with Codex native `SessionStart`, Claude `UserPromptSubmit`, Copilot `.claude/settings.local.json` startup surface.
- `AGENTS.md`: Gate 2 anchored on hook brief primary with `skill_advisor.py` fallback. Codex `SessionStart` parity note. OpenCode plugin ESM exemption.
- `feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md`: Copilot entry now names `.claude/settings.local.json` as the effective wrapper surface and notes top-level writer commands.
- `manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md`: Copilot validation scenario inspects `.claude/settings.local.json` and smokes managed-block refresh.
- Net diff across 13 targets: +151 lines / -69 lines.

### Fixed

- No surviving reference to `skill_advisor.py` as *primary* Gate 2 routing surface in any updated file.
- No surviving reference to `.github/hooks/scripts/*.sh` as the Copilot prompt/startup execution surface.
- No surviving `no lifecycle hook` phrasing about Codex in `SKILL.md`, `hook_system.md`, or `AGENTS.md`.

### Verification

- All 13 target files modified with non-empty diffs.
- Per-file applied-change reports exist in `applied/01-*.md` through `applied/13-*.md`.
- Cross-file consistency gates pass: surviving `skill_advisor.py` references describe fallback context only. Zero `.github/hooks/scripts` references remain in Copilot hook README or INSTALL_GUIDE.
- `validate.sh --strict`: exit code 2 with 5 errors / 4 warnings (matches sibling baseline, all structural template-anchor issues).

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/README.md` | Gate 2 prose + directory-structure updated. |
| `.opencode/install_guides/SET-UP - AGENTS.md` | Gate 2 setup teaches hook-first path. |
| `.opencode/skills/system-spec-kit/ARCHITECTURE.md` | Copilot transport + OpenCode plugin bridge documented. |
| `.opencode/skills/system-spec-kit/README.md` | Hook-primary routing, ESM profile, Copilot section. |
| `.opencode/skills/system-spec-kit/SKILL.md` | Startup/recovery split for all runtimes. |
| `.opencode/skills/system-spec-kit/references/config/hook_system.md` | Canonical runtime matrix refreshed. |
| `AGENTS.md` | Gate 2 anchored on hook brief primary. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/README.md` | Registration example shows settings.local.json contract. |
| `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Advisor native tools + Copilot wrapper contract. |
| `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md` | Copilot wrapper surface documented. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md` | Copilot validation scenario updated. |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Added `SPECKIT_CODEX_HOOK_TIMEOUT_MS`. |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Hook-surface summary with cross-links. |

### Follow-Ups

- If `SPECKIT_CODEX_HOOK_TIMEOUT_MS` turns out to be internal-only after operator survey, consider moving it to a deprecated section or prefixing with "(internal)".
