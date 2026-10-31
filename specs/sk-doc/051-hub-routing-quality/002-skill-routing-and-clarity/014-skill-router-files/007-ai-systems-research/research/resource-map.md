---
title: "Resource Map — Moving the machine router of each of the 16 skills in the AI Systems repository at /Users/michelkerkmeester/MEGA/Development/AI Systems (folder 'AI Systems/', ignore specs/, runtime/, scratch/ and node_modules/) into a sibling ROUTER.md, following this repository's new canon (machine router under a final '## MACHINE ROUTER' heading in ROUTER.md, a link from SKILL.md). Answer RQ-1 to RQ-5 in the spec: per-skill split of routing prose versus machine data with word counts; what loads these skills (opencode.json, .claude/, the Claude Project sync loop in 'AI Systems/z — Claude Project Sync Loop' and its hand-written knowledge files) and whether each loads a sibling file; every check or benchmark gate in that repository that reads a routing section or ROUTER.md, with file:line; the four existing ROUTER.md files against the new canon; a per-skill migration with Claude Project changes, token savings and an order that avoids other sessions' uncommitted edits. Read only in that repository, never open a .env file, write only in this phase's research folder."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 38
- **By category**: READMEs=0, Documents=27, Commands=0, Agents=0, Skills=3, Specs=0, Scripts=6, Tests=0, Config=1, Meta=1
- **Missing on disk**: 31
- **Scope**: research convergence output for 007-ai-systems-research
- **Generated**: 2026-10-29T11:49:45.283Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/skills | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills | Cited | OK | Citations=1; Iterations=1 |
| AI Systems/Barter - Copywriter/sk-barter-copywriter/SKILL.md | Cited | MISSING | Citations=2; Iterations=2 |
| AI Systems/Barter - Deal Templates/sk-barter-deal-templates/SKILL.md | Cited | MISSING | Citations=1; Iterations=1 |
| AI Systems/Media Editor/sk-media-editor/SKILL.md | Cited | MISSING | Citations=1; Iterations=1 |
| AI Systems/Moneybird Accountant/cli-jortt/ROUTER.md | Cited | MISSING | Citations=1; Iterations=1 |
| AI Systems/Moneybird Accountant/cli-jortt/SKILL.md | Cited | MISSING | Citations=2; Iterations=2 |
| AI Systems/Moneybird Accountant/cli-moneybird/SKILL.md | Cited | MISSING | Citations=1; Iterations=1 |
| AI Systems/Moneybird Accountant/sk-moneybird-accountant/ROUTER.md | Cited | MISSING | Citations=1; Iterations=1 |
| AI Systems/Moneybird Accountant/sk-moneybird-accountant/SKILL.md | Cited | MISSING | Citations=2; Iterations=2 |
| AI Systems/Moneybird Accountant/SKILL.md | Cited | MISSING | Citations=1; Iterations=1 |
| AI Systems/Product Owner/claude project/knowledge | Cited | MISSING | Citations=1; Iterations=1 |
| AI Systems/Product Owner/mcp-click-up/SKILL.md | Cited | MISSING | Citations=1; Iterations=1 |
| AI Systems/Product Owner/mcp-code-mode/SKILL.md | Cited | MISSING | Citations=1; Iterations=1 |
| AI Systems/Product Owner/mcp-figma/SKILL.md | Cited | MISSING | Citations=1; Iterations=1 |
| AI Systems/Product Owner/ROUTER.md | Cited | MISSING | Citations=1; Iterations=1 |
| AI Systems/Product Owner/sk-create-figjam/SKILL.md | Cited | MISSING | Citations=1; Iterations=1 |
| AI Systems/Product Owner/sk-prompt-improver/SKILL.md | Cited | MISSING | Citations=1; Iterations=1 |
| AI Systems/Product Owner/SKILL.md | Cited | MISSING | Citations=2; Iterations=2 |
| AI Systems/Prompt Improver/claude project/Custom Instructions.md | Cited | MISSING | Citations=1; Iterations=1 |
| AI Systems/Prompt Improver/sk-prompt-improver/SKILL.md | Cited | MISSING | Citations=1; Iterations=1 |
| AI Systems/Sales - Direct Communication/claude project/Custom Instructions.md | Cited | MISSING | Citations=2; Iterations=2 |
| AI Systems/Sales - Direct Communication/claude project/knowledge | Cited | MISSING | Citations=1; Iterations=1 |
| AI Systems/Sales - Direct Communication/sk-sales-communication/SKILL.md | Cited | MISSING | Citations=1; Iterations=1 |
| AI Systems/Sales - HubSpot & Automation/sk-sales-hubspot-automation/SKILL.md | Cited | MISSING | Citations=2; Iterations=2 |
| AI Systems/z — Claude Project Sync Loop/residency/counts.md | Cited | MISSING | Citations=1; Iterations=1 |
| Commands/agent-router.md | Cited | MISSING | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| AI Systems/Barter - Deal Templates/benchmark/router/differential.py | Cited | MISSING | Citations=1; Iterations=1 |
| AI Systems/Moneybird Accountant/cli-moneybird/scripts/exit-code-parity.sh | Cited | MISSING | Citations=1; Iterations=1 |
| AI Systems/Moneybird Accountant/sk-moneybird-accountant/scripts/check-route-table.py | Cited | MISSING | Citations=2; Iterations=2 |
| AI Systems/Product Owner/benchmark/gates/check_hub.py | Cited | MISSING | Citations=2; Iterations=2 |
| AI Systems/Product Owner/benchmark/gates/check_leaf_map_parity.py | Cited | MISSING | Citations=1; Iterations=1 |
| AI Systems/Sales - Direct Communication/benchmark/router/differential.py | Cited | MISSING | Citations=2; Iterations=2 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| opencode.json | Cited | OK | Citations=1; Iterations=1 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| AGENTS.md | Cited | OK | Citations=2; Iterations=2 |

---

---

## Lineage Delta Sources

| Lineage | Delta |
|---------|-------|
| deepseek | lineages/deepseek/deltas/iter-001.jsonl |
| deepseek | lineages/deepseek/deltas/iter-002.jsonl |
| deepseek | lineages/deepseek/deltas/iter-003.jsonl |
