---
title: "Resource Map — Round 2, building on round 1 (archived at specs/sk-code/019-surface-consistency-research/research_archive/20261019T081751Z; read its research.md first, especially §7 target layout, §8 gaps, §9 migration). Three questions: (Q1) Doctor alignment: what /doctor:sk-code (.skilled/commands/doctor/sk-code.md, assets/doctor-sk-code-setup.yaml, scripts/sk-code-setup-check.cjs and its legs, parent-skill-check.cjs) checks today, and what legs or checks should be added so the doctor enforces the shared surface contract from round 1 (section order, workflow-link trio, assets/checklists home, no flat topical references, version/changelog match, no surface graph-metadata.json) — name exact files, functions and new leg ids, and how each fails with a repair command. (Q2) A hub-level base architecture for creating a new sk-code mode/surface: what a new surface must touch today (mode-registry.json, hub-router.json, ROUTER.md, hub SKILL.md RESOURCE_MAP union, leaf-manifest.json, compiled route, shared/references/stack-detection.md and phase-detection.md, the advisor plugin surface detection in .opencode/plugins/system-skill-advisor.js, verify-router-sync.cjs which hard-codes SURFACES at line 33, parent-skill-check, playbooks, hermes mirror), and design a scaffold under the sk-code hub (e.g. shared/assets/surface-scaffold/ or similar) with template SKILL.md/README/references tree/§2b smart-routing block, plus a checklist or script that registers the new surface in every place; compare with the sk-doc create-skill canon (.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/hub-skill-scaffold.md, packet-skill-scaffold.md) and say whether the scaffold belongs in sk-code or should extend sk-create-skill. (Q3) Routing optimization: remove hard-coded surface lists (verify-router-sync.cjs SURFACES, the skilled/webflow union comments, any other) in favour of deriving surfaces from mode-registry.json packetKind: surface; check how intent signals, DEFAULT_RESOURCE and load tiers differ across the three §2b blocks and recommend one shape; check compiled-route and advisor surface-hint behaviour for all three surfaces. Deliver per question: findings with path:line evidence, a recommendation, and ordered remediation steps with the check that guards each, ready to be appended as steps 8+ to round 1's 7-step plan. Make research.md self-contained: summarize round 1 briefly and cite its archived path."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 27
- **By category**: READMEs=0, Documents=0, Commands=4, Agents=0, Skills=18, Specs=1, Scripts=3, Tests=1, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 019-surface-consistency-research
- **Generated**: 2026-10-19T08:50:27.456Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/parent-skill-check.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/scripts/sk-code-setup-check.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/sk-code.md | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-code/hub-router.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/leaf-manifest.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/mode-registry.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/ROUTER.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/shared/references/phase-detection.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/shared/references/stack-detection.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-obsidian/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-webflow/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/hub-skill-scaffold.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/packet-skill-scaffold.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/sk-code/019-surface-consistency-research/research_archive/20261019T081751Z/research.md | Cited | OK | Citations=3; Iterations=3 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/plugins/system-skill-advisor.js | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/compiled-route-manifest.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs | Cited | OK | Citations=1; Iterations=1 |

---

## 8. Tests

> Test files, fixtures, and snapshots. Tests take precedence over `Scripts`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/tests/compiled-route-surface-hint.test.cjs | Cited | OK | Citations=1; Iterations=1 |

---
