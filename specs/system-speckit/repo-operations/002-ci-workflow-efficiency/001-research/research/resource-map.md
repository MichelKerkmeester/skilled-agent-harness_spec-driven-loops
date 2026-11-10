---
title: "Resource Map — Improve the efficiency and speed of every CI workflow in this repo (the 33 workflows in .github/workflows/, the README there, and the scripts and actions they call) and find overengineering, issues and optimization possibilities. Angles: (1) wall-clock and runner-minute cost per workflow measured from gh run list / gh run view --json jobs; (2) duplicate work across workflows, including the three workflows (opencode-dual-version.yml, opencode-plugin-tests.yml, hooks-node-tests.yml) that each source sk-git worktree-naming.sh and run provision_worktree with bun installed every time: measure cost per run and evaluate shared caching or one provisioning job feeding the others; (3) caching: npm, bun, provisioned trees, OpenCode installs, actions/cache and setup-node cache; (4) path filters and needless triggers, especially the Trigger Index Rebuild commit after every push to main that re-runs about 13 workflows; (5) parallelism, matrix design, fail-fast and concurrency cancel-in-progress groups; (6) flaky or slow tests and timeouts; (7) overengineering: duplicates of pre-commit hooks or each other, advisory jobs that never gate; (8) security and pinning hygiene; (9) an on/off control for clones and base repos: disable workflows or groups without editing YAML (vars.* in job-level if:, a committed config such as .skilled/ci.json or an env file read by a gate job, workflow_dispatch inputs), compare skipped-job branch-protection behavior, fork and clone defaults, pull_request_target security, reuse of hook-flags.env and .env.example, recommend one design defaulting to everything on; (10) a /doctor:ci command following the existing /doctor:* commands that lists workflows with on/off state, trigger and purpose, toggles them, customizes path filters, schedules and Node versions, and scaffolds a new pinned workflow with .skilled/ and .opencode/ path parity and a README row; specify its mode surface, safety rules (dry-run default, never edit a protected workflow without confirmation), advisor routing, and whether it lives with the doctor commands, sk-git, or splits between them; (11) a new sk-code mode sk-code-ci holding the standards for writing and reviewing workflow YAML (SHA-pinned actions, path parity per gate-inputs, README row, set -euo pipefail, timeouts, least-privilege permissions, fork and secret safety, caching, concurrency, matrix), registered in the sk-code hub (mode-registry.json, hub-router.json, leaf-manifest.json) with sk-code-review applying it, and /doctor:ci scaffolding from its templates. Every load-bearing claim cites file:line or a run id and is labelled confirmed, documented or inferred. End with ranked recommendations (saving, risk, effort) grouped into proposed implementation phases 002+."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 102
- **By category**: READMEs=2, Documents=7, Commands=11, Agents=0, Skills=23, Specs=20, Scripts=4, Tests=0, Config=35, Meta=0
- **Missing on disk**: 5
- **Scope**: research convergence output for 001-research
- **Generated**: 2026-10-23T07:43:02.615Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows/README.md | Cited | OK | Citations=12; Iterations=12 |
| .skilled/hooks/README.md | Cited | OK | Citations=1; Iterations=1 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/scripts | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows | Cited | OK | Citations=2; Iterations=2 |
| .gitignore | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/git/pre-commit | Cited | OK | Citations=1; Iterations=1 |
| .skilled/repo-rules/skill-hub-routing.md | Cited | OK | Citations=1; Iterations=1 |
| actions/setup-node README (gh api repos/actions/setup-node/contents/README.md) | Cited | MISSING | Citations=1; Iterations=1 |
| docs/ | Cited | MISSING | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/doctor/_routes.yaml | Cited | OK | Citations=4; Iterations=4 |
| .skilled/commands/doctor/assets/doctor-setup-presentation.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-setup.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/env.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/opencode-version-battery.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/parent-skill-check.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/scripts/route-validate.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/route-validate.sh | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/setup.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/sk-code.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/README.txt | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-code/hub-router.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/leaf-manifest.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/mode-registry.json | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/sk-code/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/shared/references/stack-detection.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-review/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/assets/checklists/shell-checklist.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/changelog/v1.8.0.0.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/worktree-naming.sh | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-git/scripts/worktree-provision-paths.txt | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-deep-loop/deep-research/scripts/compile-command-contracts.cjs | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/vitest.config.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/runtime/vitest.config.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/vitest.config.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/vitest.config.ts | Cited | OK | Citations=3; Iterations=3 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-001.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-003.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-004.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-012.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-017.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-018.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-019.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/jobs/39901840569.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/jobs/39909844384.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/jobs/39909844429.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/jobs/39910111430.json | Cited | OK | Citations=3; Iterations=3 |
| specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/jobs/39912381915.json | Cited | OK | Citations=2; Iterations=2 |
| specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/jobs/39912381951.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/jobs/39912381977.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/jobs/39912382147.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/per-workflow/diagram-corpus.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/runs-last-1000.json | Cited | OK | Citations=3; Iterations=3 |
| specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md | Cited | OK | Citations=11; Iterations=11 |
| specs/system-speckit/053-ci-workflow-efficiency/scratch/ci-run-data/runs-last-1000.json | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-speckit/053-ci-workflow-efficiency/scratch/ci-run-data/summary.json | Cited | MISSING | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/scripts/check-gate-inputs.sh | Cited | OK | Citations=4; Iterations=4 |
| .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/git/install-hooks.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/vitest.config.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .env.example | Cited | OK | Citations=2; Iterations=2 |
| .github/dependabot.yml | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/advisory-checks.yml | Cited | OK | Citations=6; Iterations=6 |
| .github/workflows/agent-mirror-sync.yml | Cited | OK | Citations=3; Iterations=3 |
| .github/workflows/changed-packet-validation.yml | Cited | OK | Citations=4; Iterations=4 |
| .github/workflows/chart-corpus.yml | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/command-tree-parity.yml | Cited | OK | Citations=4; Iterations=4 |
| .github/workflows/comment-hygiene.yml | Cited | OK | Citations=3; Iterations=3 |
| .github/workflows/deep-loop-runtime.yml | Cited | OK | Citations=3; Iterations=3 |
| .github/workflows/dependabot-auto-merge.yml | Cited | OK | Citations=4; Iterations=4 |
| .github/workflows/diagram-corpus.yml | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/dispatch-enforcement-guard.yml | Cited | OK | Citations=4; Iterations=4 |
| .github/workflows/gate-inputs.yml | Cited | OK | Citations=7; Iterations=7 |
| .github/workflows/hooks-node-tests.yml | Cited | OK | Citations=8; Iterations=8 |
| .github/workflows/markdown-link-integrity.yml | Cited | OK | Citations=3; Iterations=3 |
| .github/workflows/message-contract.yml | Cited | OK | Citations=5; Iterations=5 |
| .github/workflows/naming-standard-guard.yml | Cited | OK | Citations=2; Iterations=2 |
| .github/workflows/opencode-dual-version.yml | Cited | OK | Citations=5; Iterations=5 |
| .github/workflows/opencode-plugin-tests.yml | Cited | OK | Citations=6; Iterations=6 |
| .github/workflows/pi-extension-tests.yml | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/playbook-operator-contract.yml | Cited | OK | Citations=5; Iterations=5 |
| .github/workflows/prompt-card-sync.yml | Cited | OK | Citations=2; Iterations=2 |
| .github/workflows/repo-rules-corpus.yml | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/routing-registry-drift.yml | Cited | OK | Citations=2; Iterations=2 |
| .github/workflows/rule-canary-sync.yml | Cited | OK | Citations=3; Iterations=3 |
| .github/workflows/runtime-no-spec-import.yml | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/sk-doc-rename-harness.yml | Cited | OK | Citations=2; Iterations=2 |
| .github/workflows/sk-doc-script-tests.yml | Cited | OK | Citations=3; Iterations=3 |
| .github/workflows/skill-advisor-stress.yml | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/skill-doc-frontmatter.yml | Cited | OK | Citations=2; Iterations=2 |
| .github/workflows/spec-kit-check.yml | Cited | OK | Citations=11; Iterations=11 |
| .github/workflows/strict-pass-freshness-report.yml | Cited | OK | Citations=3; Iterations=3 |
| .github/workflows/trigger-index-rebuild.yml | Cited | OK | Citations=12; Iterations=12 |
| .skilled/hooks/hook-flags.env.example | Cited | OK | Citations=2; Iterations=2 |
| .skilled/package.json | Cited | OK | Citations=1; Iterations=1 |

---
