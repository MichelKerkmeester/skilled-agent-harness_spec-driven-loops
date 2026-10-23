---
title: "Resource Map — Coverage audit of packet sk-code/013-private-surface-skills (five phases moving sk-code-webflow and sk-code-obsidian into ignored private local-* skills). Q1 leak coverage: does 013 cover every tracked or generated surface that can leak or route the two surfaces (committed trigger index, Hermes sync and .hermes/skills, runtime mirrors, compiled routing and activation manifests, skill-graph.json from --export-json, advisor DB and scorer vocabulary, OpenCode plugins incl. system-skill-advisor.js surface detection, doctor checks, description/graph-metadata/changelog/README generators, CI artifacts, pre-commit and pre-push hooks)? Q2 phase correctness: do the phase-2 removal steps cover a fresh grep of tracked files naming the surfaces; are the ignore patterns right for a real folder and a symlink; is the advisor symlink-follow change safe; does the commit guard catch git add -f and renames? Q3 executability by a DeepSeek writer: exact files, one change per task, proving commands, acceptance criteria, rollback; flag vague tasks. Q4 is phase 5's fresh-clone proof sufficient? Q5 risks: git history retention, other repos that symlink this checkout (Obsidian Plugin project), CI drift checks. Label every claim confirmed, documented or inferred, with file:line. Output: research.md plus P0/P1/P2 amendments each naming the phase file. Do not edit phase docs."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 39
- **By category**: READMEs=1, Documents=2, Commands=1, Agents=0, Skills=15, Specs=19, Scripts=0, Tests=0, Config=1, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 013-private-surface-skills
- **Generated**: 2026-10-23T09:31:28.053Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows/README.md | Cited | OK | Citations=2; Iterations=2 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .gitignore | Cited | OK | Citations=1; Iterations=1 |
| .skilled/scripts/git-hooks/pre-commit | Cited | OK | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/doctor/scripts/skill-graph-freshness.cjs | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-code/shared/references/stack-detection.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-obsidian/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/freshness.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/data/trigger-index.json | Cited | OK | Citations=3; Iterations=3 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/tasks.md | Cited | OK | Citations=3; Iterations=3 |
| specs/sk-code/013-private-surface-skills/002-hub-surface-removal/acceptance-criteria.md | Cited | OK | Citations=2; Iterations=2 |
| specs/sk-code/013-private-surface-skills/002-hub-surface-removal/plan.md | Cited | OK | Citations=2; Iterations=2 |
| specs/sk-code/013-private-surface-skills/002-hub-surface-removal/tasks.md | Cited | OK | Citations=3; Iterations=3 |
| specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/acceptance-criteria.md | Cited | OK | Citations=2; Iterations=2 |
| specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/plan.md | Cited | OK | Citations=3; Iterations=3 |
| specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/tasks.md | Cited | OK | Citations=3; Iterations=3 |
| specs/sk-code/013-private-surface-skills/004-private-local-skills/plan.md | Cited | OK | Citations=2; Iterations=2 |
| specs/sk-code/013-private-surface-skills/004-private-local-skills/tasks.md | Cited | OK | Citations=2; Iterations=2 |
| specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/acceptance-criteria.md | Cited | OK | Citations=3; Iterations=3 |
| specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/spec.md | Cited | OK | Citations=3; Iterations=3 |
| specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md | Cited | OK | Citations=4; Iterations=4 |
| specs/sk-code/013-private-surface-skills/research/deep-research-ledger/frames/0000000000000008.frame | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/013-private-surface-skills/research/deep-research-state.jsonl | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/013-private-surface-skills/research/deltas/iter-005.jsonl | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/013-private-surface-skills/research/iterations/iteration-001.md | Cited | OK | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows/routing-registry-drift.yml | Cited | OK | Citations=1; Iterations=1 |

---
