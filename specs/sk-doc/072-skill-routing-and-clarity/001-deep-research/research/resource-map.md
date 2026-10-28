---
title: "Resource Map — Skill routing shape and doc clarity across every skill and hub under .skilled/skills, plus the command and agent docs that teach routing. Starting hypothesis to test, not assume: the sk-code advisor report at specs/sk-doc/072-skill-routing-and-clarity/001-deep-research/scratch/sk-code-advisor-report.md (JSON decides stage one, one hub ROUTER.md decides leaf files, script resolvers handle the rest, each mode SKILL.md keeps a short routing section with the machine block moved to an appendix, no ROUTER.md per mode, JSON-only viable only as a hybrid). Answer with path:line evidence: (a) per skill, every routing mechanism and every place one routing decision is restated, and where copies have drifted; (b) which checks, parsers, templates, generators, benchmarks and runtime mirrors enforce the current shape, and what each proposed change would break; (c) a verdict on per-mode ROUTER.md versus one hub ROUTER.md versus the advisor hybrid versus JSON-only, separately for hubs, mode packets and standalone skills; (d) readability findings per skill with quoted passages; (e) a phased implementation plan with order, risk and rollback. Read-only research: change no file outside your lineage directory."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 80
- **By category**: READMEs=0, Documents=6, Commands=2, Agents=2, Skills=62, Specs=4, Scripts=3, Tests=0, Config=1, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 001-deep-research
- **Generated**: 2026-10-28T06:34:08.485Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/SYNC.md | Cited | OK | Citations=1; Iterations=1 |
| .codex/SYNC.md | Cited | OK | Citations=1; Iterations=1 |
| .cursor/rules/skill-routing.md | Cited | OK | Citations=1; Iterations=1 |
| .cursor/SYNC.md | Cited | OK | Citations=2; Iterations=2 |
| .devin/SYNC.md | Cited | OK | Citations=1; Iterations=1 |
| .hermes/SYNC.md | Cited | OK | Citations=2; Iterations=2 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/doctor/assets/doctor-router-reach.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/scripts/parent-skill-check.cjs | Cited | OK | Citations=2; Iterations=2 |

---

## 4. Agents

> `.skilled/agents/**`, `.claude/agents/**`, `.skilled/agents/**`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/agents/code.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/agents/orchestrate.md | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/cli-classifier/cli-jev/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/cli-classifier/graph-metadata.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-classifier/hub-router.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-classifier/ROUTER.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/benchmark/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/cli-external-orchestration/cli-hermes/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/graph-metadata.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/hub-router.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/cli-external-orchestration/leaf-manifest.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/mode-registry.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/cli-external-orchestration/ROUTER.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/cli-external-orchestration/SKILL.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/cli-orca/graph-metadata.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-orca/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/mcp-code-mode/leaf-manifest.config.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/mcp-code-mode/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/mcp-tooling/hub-router.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/mcp-tooling/mcp-figma/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/mcp-tooling/mcp-obsidian/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/mcp-tooling/mode-registry.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/mcp-tooling/ROUTER.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/mcp-tooling/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/hub-router.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/leaf-manifest.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/mode-registry.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/ROUTER.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/sk-code-ci/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-quality/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/sk-code-review/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/sk-code-skilled/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/SKILL.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-design/hub-router.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-design/mode-registry.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-design/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/hub-router.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/leaf-aliases.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/mode-registry.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/ROUTER.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-doc/scripts/package_skill.py | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/sk-create-diff/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-frontmatter/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-readme/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-root-router-template.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/SKILL.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-git/graph-metadata.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-prompt/graph-metadata.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-prompt/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-vision/graph-metadata.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-vision/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/hub-router.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/mode-registry.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/references/cli/shared-smart-router.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/SKILL.md | Cited | OK | Citations=2; Iterations=2 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/sk-doc/072-skill-routing-and-clarity/001-deep-research/research/lineages/devin/iterations/iteration-001.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-doc/072-skill-routing-and-clarity/001-deep-research/research/lineages/devin/iterations/iteration-002.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-doc/072-skill-routing-and-clarity/001-deep-research/research/lineages/devin/iterations/iteration-003.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-doc/072-skill-routing-and-clarity/001-deep-research/research/lineages/devin/iterations/iteration-004.md | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/compiled-route-guard.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/compiled-route-sync.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs | Cited | OK | Citations=2; Iterations=2 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/lib/compiled-routing/serving-closure.manifest.json | Cited | OK | Citations=1; Iterations=1 |

---

---

## Lineage Delta Sources

| Lineage | Delta |
|---------|-------|
| devin | lineages/devin/deltas/iter-001.jsonl |
| devin | lineages/devin/deltas/iter-002.jsonl |
| devin | lineages/devin/deltas/iter-003.jsonl |
| devin | lineages/devin/deltas/iter-004.jsonl |
| devin | lineages/devin/deltas/iter-005.jsonl |
| pi | lineages/pi/deltas/iter-001.jsonl |
| pi | lineages/pi/deltas/iter-002.jsonl |
| pi | lineages/pi/deltas/iter-003.jsonl |
| pi | lineages/pi/deltas/iter-004.jsonl |
| pi | lineages/pi/deltas/iter-005.jsonl |
