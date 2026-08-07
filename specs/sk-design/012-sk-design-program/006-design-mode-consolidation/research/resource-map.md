---
title: "Resource Map — Research refinement opportunities for the sk-design skill hub as it now stands after retiring the /interface:audit and /interface:foundations commands and deleting the commandSubworkflows machinery. Current shape: four registered modes (interface, motion, md-generator, design-mcp-open-design), three commands (/interface:design, /interface:motion, /interface:design-reference), foundations capability folded flat into design-interface, anti-slop essentials reduced to seven binary checks in the interface mechanical preflight card, and a 7812-file styles package shared behind a storage-neutral facade. Identify concrete, high-value refinements: simplifications, removable ceremony, structural drift against sk-doc create-skill doctrine, and capability gaps the retirement created. HARD CONSTRAINT: the operator has explicitly rejected over-engineering. Every recommendation must be justified against a CURRENT problem with evidence, must state its cost, and must be the smallest change that solves it. Reject any proposal that adds new abstraction, new schema constructs, new ceremony, or speculative future-proofing. Prefer deleting over adding. Rank recommendations by value-to-cost and state explicitly which ones are NOT worth doing. Iterations 1-0 are already complete. Continue from iteration 1. Do not repeat an earlier iteration's focus."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 29
- **By category**: READMEs=0, Documents=3, Commands=6, Agents=0, Skills=18, Specs=0, Scripts=1, Tests=1, Config=0, Meta=0
- **Missing on disk**: 5
- **Scope**: research convergence output for 006-design-mode-consolidation
- **Generated**: 2026-07-27T06:16:01.892Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| compiled-route.cjs probes | Cited | MISSING | Citations=1; Iterations=1 |
| direct old/new path existence checks | Cited | MISSING | Citations=1; Iterations=1 |
| validate_skill_package.py .opencode/skills/sk-design | Cited | MISSING | Citations=1; Iterations=1 |

---

## 3. Commands

> `.opencode/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/commands/interface/assets/interface-design-auto.yaml | Cited | OK | Citations=1; Iterations=1 |
| .opencode/commands/interface/assets/interface-design-confirm.yaml | Cited | OK | Citations=1; Iterations=1 |
| .opencode/commands/interface/assets/interface-design-presentation.txt | Cited | OK | Citations=1; Iterations=1 |
| .opencode/commands/interface/design-reference.md | Cited | OK | Citations=2; Iterations=2 |
| .opencode/commands/interface/design.md | Cited | OK | Citations=3; Iterations=3 |
| .opencode/commands/interface/motion.md | Cited | OK | Citations=3; Iterations=3 |

---

## 5. Skills

> `.opencode/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `mcp-server/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/skills/sk-design/design-interface/assets/interface-preflight-card.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/sk-design/design-interface/references/design-process/mechanical-defaults.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/sk-design/design-interface/references/design-process/ux-quality-reference.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/sk-design/design-interface/references/foundations/corpus-map.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/sk-design/design-interface/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/sk-design/hub-router.json | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/sk-design/mode-registry.json | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/sk-design/README.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/sk-design/shared/anti-slop-principles.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/sk-design/shared/creation-contract.md | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skills/sk-design/shared/procedures/polish-gate-orchestration.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/sk-design/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skills/sk-design/styles/database/README.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/sk-design/styles/lib/paths.mjs | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/sk-design/styles/library/bundles/README.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/sk-design/styles/library/README.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/sk-design/styles/README.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/sk-doc/create-skill/SKILL.md | Cited | OK | Citations=2; Iterations=2 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| validate_skill_package.py | Cited | MISSING | Citations=1; Iterations=1 |

---

## 8. Tests

> Test files, fixtures, and snapshots. Tests take precedence over `Scripts`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| interface-command-contract.test.mjs | Cited | MISSING | Citations=2; Iterations=2 |

---

---

## Lineage Delta Sources

| Lineage | Delta |
|---------|-------|
| sol | lineages/sol/deltas/iter-001.jsonl |
| sol | lineages/sol/deltas/iter-002.jsonl |
| sol | lineages/sol/deltas/iter-003.jsonl |
| sol | lineages/sol/deltas/iter-004.jsonl |
| sol | lineages/sol/deltas/iter-005.jsonl |
