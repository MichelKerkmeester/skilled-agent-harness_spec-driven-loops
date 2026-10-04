---
title: "Resource Map — Research, without editing anything, three connected questions about the doctor commands in this repository (.skilled/commands/doctor/). (1) Two contract gaps. First: /doctor:speckit (doctor-speckit-retrieval.yaml) reports corpus_pollution at medium severity whenever the phraseQuality bucket in .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json has any non-zero class, and the current corpus always has some (about 251 of 33,700 phrases), so status=OK is unreachable. Decide the right fix: re-rank pollution as advisory outside severity_max, a share threshold, a corpus clean-up, a generator change, or a mix, citing how the lookup ranks such phrases and which tests and playbook scenarios (DOC-349, DOC-350) change. Second: /doctor:mcp (mcp.md, doctor-mcp-presentation.txt) defines a cross-sub-action flag error but no error for an unknown flag such as --server; design the missing unknown-flag error and say how other doctor commands handle unknown flags today. (2) A long-lived local test environment for /doctor:update (update.md, release-update.cjs, doctor-update-*.yaml): a git worktree at .worktrees/.doctor-update-test-environment, local only and never pushed, checked out at an older release tag (v4.0.0.0, v4.0.0.1 or v4.0.0.2), carrying local overrides so check, align, apply, rollback and record-base each have real customized, conflict, removed and local-only units to act on. For sk-code, compare stripping every mode except sk-code-opencode and sk-code-webflow and then editing sk-code-webflow, against adding a custom sk-code-web-dev packet derived from sk-code-webflow without Webflow references; recommend one. For sk-git, plan replacing it with the older Barter sk-git at barter/ai-speckit/coder-backup/ai-speckit-main/coder/.opencode/skills/sk-git (10 files). Establish from release-update.cjs whether overrides must be committed or may stay uncommitted, how the engine classifies each unit, what record-base and the release state need, how to reset the environment after an apply or rollback, and how a worktree whose directory name does not follow the sk-git worktrees/NNN-slug grammar should be created under the sk-git rules (worktree-naming.sh, detached HEAD versus a local branch). Keep the token cost of building it low. (3) Which other doctor commands (/doctor:git, /doctor:mcp, /doctor:env, /doctor:runtime-mirrors, /doctor:skill-advisor, /doctor:deep-loop, /doctor:speckit) would gain from running their manual testing scenarios against the same environment instead of a throwaway disposable copy, and list exactly which scenario files in the doctor-commands folders of the system-spec-kit, system-skill-advisor, system-deep-loop, sk-git and mcp-code-mode manual testing playbooks need updating, plus any new scenarios to create. Cite a file and line for every claim and end with an ordered implementation plan."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 37
- **By category**: READMEs=0, Documents=2, Commands=16, Agents=0, Skills=19, Specs=0, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 019-doctor-test-environment-research
- **Generated**: 2026-10-04T16:48:00.482Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .gitignore | Cited | OK | Citations=1; Iterations=1 |
| .skilled/release/.gitignore | Cited | OK | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/doctor/_routes.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-mcp-presentation.txt | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/assets/doctor-update-apply.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-update-check.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-update-record-base.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-update-rollback.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/deep-loop.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/env.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/git.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/mcp.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/runtime-mirrors.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/release-update.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/skill-advisor.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/speckit.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/update.md | Cited | OK | Citations=2; Iterations=2 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/mcp-code-mode/manual-testing-playbook/doctor-commands/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/mode-registry.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-hooks-switch-gate.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-git/references/worktree-workflows.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/worktree-naming.sh | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/manual-testing-playbook/doctor-commands/doctor-deep-loop-lazy-init.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/manual-testing-playbook/doctor-commands/doctor-deep-loop-scope.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/manual-testing-playbook/doctor-commands/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-speckit-retrieval-healthy.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-speckit-stale-index.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/normalize.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts | Cited | OK | Citations=1; Iterations=1 |

---

---

## Lineage Delta Sources

| Lineage | Delta |
|---------|-------|
| deepseek-v4-1-flash-cline | lineages/deepseek-v4-1-flash-cline/deltas/iter-001.jsonl |
| deepseek-v4-1-flash-cline | lineages/deepseek-v4-1-flash-cline/deltas/iter-002.jsonl |
| deepseek-v4-1-flash-cline | lineages/deepseek-v4-1-flash-cline/deltas/iter-003.jsonl |
| luna-6-max-fast | lineages/luna-6-max-fast/deltas/iter-001.jsonl |
| luna-6-max-fast | lineages/luna-6-max-fast/deltas/iter-002.jsonl |
