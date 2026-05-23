---
title: "Resource Map — track:skilled-agent-orchestration (packets 093, 094, 095, 096 — architectural cross-phase audit)"
description: "Auto-generated review resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 21
- **By category**: READMEs=0, Documents=3, Commands=3, Agents=3, Skills=7, Specs=4, Scripts=0, Tests=0, Config=1, Meta=0
- **Missing on disk**: 0
- **Scope**: review convergence output for 097-track-review
- **Generated**: 2026-05-07T16:04:37.093Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/install_guides/SET-UP - AGENTS.md | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .opencode/install_guides/SET-UP - Code Graph.md | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .opencode/install_guides/SET-UP - Opencode Agents.md | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |

---

## 3. Commands

> `.opencode/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/commands/doctor/scripts/audit_descriptions.py | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |
| .opencode/commands/speckit/assets/speckit_deep-review_auto.yaml | Analyzed | OK | Findings P0=0 P1=1 P2=1; Iterations=2 |
| .opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |

---

## 4. Agents

> `.opencode/agents/**`, `.claude/agents/**`, `.codex/agents/**`, `.gemini/agents/**`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .codex/agents/review.toml | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |
| .opencode/agents/deep-review.md | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |
| .opencode/agents/orchestrate.md | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |

---

## 5. Skills

> `.opencode/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature_catalog/`, `manual_testing_playbook/`, `scripts/`, `shared/`, `mcp_server/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/skills/cli-opencode/manual_testing_playbook/04--agent-routing/006-deep-research-agent-iterations.md | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js | Analyzed | OK | Findings P0=1 P1=0 P2=0; Iterations=2 |
| .opencode/skills/system-spec-kit/mcp_server/dist/code_graph/tests/code-graph-indexer.vitest.js | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/dist/lib/search/intent-classifier.js | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |
| .opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |
| .opencode/skills/system-spec-kit/shared/review-research-paths.cjs | Validated | OK | Findings P0=0 P1=0 P2=0; Iterations=2 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/specs/skilled-agent-orchestration/093-testing-playbooks-code-review-and-git/001-sk-code-review-playbook/spec.md | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/checklist.md | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |
| .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/001-skills/spec.md | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |
| .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/spec.md | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/skill/.advisor-state/skill-graph-generation.json | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |

---
