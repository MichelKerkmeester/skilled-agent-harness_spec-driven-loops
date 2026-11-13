---
title: "Resource Map — Cross-CLI command surfacing after planned phases 005-008: per-runtime (claude, codex, opencode, pi, devin, dsh) evidence of whether a model starts an offered advisor command, what stops it, and which fix raises start rate."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 29
- **By category**: READMEs=3, Documents=5, Commands=0, Agents=0, Skills=7, Specs=8, Scripts=4, Tests=0, Config=2, Meta=0
- **Missing on disk**: 1
- **Scope**: research convergence output for 009-ux-performance-cross-cli-research
- **Generated**: 2026-11-12T23:06:17.183Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .codex/README.md | Cited | OK | Citations=2; Iterations=2 |
| .dsh/plugins/repo-guards/README.md | Cited | OK | Citations=1; Iterations=1 |
| .pi/extensions/README.md | Cited | OK | Citations=1; Iterations=1 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/commands/create/skill.md | Cited | OK | Citations=2; Iterations=2 |
| .codex/prompts/create-readme.md | Cited | OK | Citations=1; Iterations=1 |
| .dsh/prompts/create-readme.md | Cited | OK | Citations=1; Iterations=1 |
| .pi/prompts/create-readme.md | Cited | OK | Citations=1; Iterations=1 |
| INSTALL-SKILLED.md | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/render.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/devin/user-prompt-submit.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/005-recommendation-contract-and-brief/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers/tasks.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/g5/listing-a.txt | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/g5/listing-b.txt | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/g5/result.txt | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/tasks.md | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .dsh/plugins/repo-guards/adapters/prompt-advisor.mjs | Cited | OK | Citations=1; Iterations=1 |
| .dsh/plugins/repo-guards/index.mjs | Cited | OK | Citations=2; Iterations=2 |
| .pi/extensions/prompt-advisor.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/shared/session-readers/index.mjs | Cited | OK | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .codex/config.toml | Cited | OK | Citations=1; Iterations=1 |
| ~/.codex/config.toml | Cited | MISSING | Citations=1; Iterations=1 |

---
