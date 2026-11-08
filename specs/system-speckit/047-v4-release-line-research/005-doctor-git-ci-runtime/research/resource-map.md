---
title: "Resource Map — Audit the Skilled v4 doctor, git, CI and runtime layer across releases v4.0.0.0 to v4.0.2.0: .skilled/skills/system-skilled-doctor/** and .skilled/commands/doctor/, Skilled in your project and vendored overlays, .skilled/skills/sk-git/** and its git hooks, .github/workflows, .skilled/agents and the runtime mirrors in .claude/ .opencode/ .codex/ .cursor/ .pi/ .devin/ .dsh/, .skilled/repo-rules/** and AGENTS.md. Releases: notes in .skilled/changelog/skilled/v4.0.*.md. Tags: v4.0.0.0-beta.1 (baseline), v4.0.0.0 3fed08373e, v4.0.0.1 bcb775402e, v4.0.0.2 7980001709, v4.0.0.3 c9bd4b156c, v4.0.0.4 to v4.0.0.10 all 4d8f403355 (one commit: use each note plus git log --since/--until by date, not tag diffs), v4.0.0.11 e2b2e393fa, v4.0.0.12 7fecd5f219, v4.0.0.13 42b41dd286, v4.0.0.14 bb9b9d1c09, v4.0.0.15 22c3a9b2c7, v4.0.0.16 f459b06479, v4.0.1.0 6a93a2cfeb, v4.0.2.0 51f70a0317. Always path-limit git diff: git diff <prev>..<tag> -- <cluster path>; the unlimited diff times out. Finding types: 1 drift (note vs code vs docs disagree), 2 misalignment with sk-code, sk-doc or Skilled canon, 3 bug, 4 improvement, 5 UX for the operator and the AI user, 6 over-engineering (say what breaks if removed, or that nothing does), 7 extension (a concrete way to extend the logic). Evidence bar for every finding: type, severity P0/P1/P2, [SOURCE: path:line] for a line you read this iteration, the release that introduced it, confidence, and a verify command. A bug needs a repro command or a failing check you ran. Read code, not only release notes. Read-only research: never edit, stage or commit repository files, and run commands only in read-only, check, plan or dry-run modes."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 162
- **By category**: READMEs=4, Documents=38, Commands=56, Agents=6, Skills=32, Specs=1, Scripts=13, Tests=1, Config=9, Meta=2
- **Missing on disk**: 1
- **Scope**: research convergence output for 005-doctor-git-ci-runtime
- **Generated**: 2026-11-08T22:31:31.350Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .codex/hooks/README.md | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/README.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/scripts/git-hooks/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/README.md | Cited | OK | Citations=1; Iterations=1 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/agents | Cited | OK | Citations=1; Iterations=1 |
| .cursor/agents | Cited | OK | Citations=1; Iterations=1 |
| .cursor/agents/code.md | Cited | OK | Citations=1; Iterations=1 |
| .devin/agents/code/AGENT.md | Cited | OK | Citations=1; Iterations=1 |
| .dsh/agents | Cited | OK | Citations=1; Iterations=1 |
| .dsh/SYNC.md | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows | Cited | OK | Citations=4; Iterations=4 |
| .gitignore | Cited | OK | Citations=1; Iterations=1 |
| .opencode/agents | Cited | OK | Citations=2; Iterations=2 |
| .opencode/bin | Cited | OK | Citations=1; Iterations=1 |
| .opencode/commands | Cited | OK | Citations=1; Iterations=1 |
| .opencode/scripts | Cited | OK | Citations=2; Iterations=2 |
| .opencode/scripts/git-hooks | Cited | OK | Citations=1; Iterations=1 |
| .opencode/scripts/git-hooks/commit-msg | Cited | OK | Citations=1; Iterations=1 |
| .opencode/scripts/git-hooks/tests | Cited | OK | Citations=1; Iterations=1 |
| .pi/agents/code.md | Cited | OK | Citations=1; Iterations=1 |
| .pi/agents/debug.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/agents | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/agent-mirror-crosswalk.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/changelog/skilled/v4.0.0.2.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.3.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.5.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.6.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.7.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.8.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.11.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.12.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.14.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.16.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.1.0.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/repo-rules/blast-radius.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/repo-rules/evidence-and-proof.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/repo-rules/uncertainty-and-honesty.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/scripts/git-hooks/commit-msg | Cited | OK | Citations=2; Iterations=2 |
| .skilled/scripts/git-hooks/pre-commit | Cited | OK | Citations=1; Iterations=1 |
| .skilled/scripts/git-hooks/prepare-commit-msg | Cited | OK | Citations=1; Iterations=1 |
| INSTALL-SKILLED.md | Cited | OK | Citations=3; Iterations=3 |
| REPO RULES.md | Cited | OK | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/doctor | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/_routes.yaml | Cited | OK | Citations=7; Iterations=7 |
| .skilled/commands/doctor/agents-md.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/agents-md-manifest.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-ci-report.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-ci-toggle.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/assets/doctor-env.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/assets/doctor-git-hooks.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-git-setup.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-install.yaml | Cited | OK | Citations=4; Iterations=4 |
| .skilled/commands/doctor/assets/doctor-overlay-apply.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-overlay-presentation.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-overlay-status.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml | Cited | OK | Citations=6; Iterations=6 |
| .skilled/commands/doctor/assets/doctor-setup-presentation.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-setup.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/assets/doctor-symlink-check.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-update-check.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/symlink-manifest.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/ci.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/commands/doctor/env.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/git.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/helper.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/install.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/runtime-mirrors.md | Cited | OK | Citations=4; Iterations=4 |
| .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs | Cited | OK | Citations=5; Iterations=5 |
| .skilled/commands/doctor/scripts/agents-md-manifest.cjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/commands/doctor/scripts/check-mcp-mutation-class.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/ci-report.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/ci-toggle.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/scripts/doctor-helper-match.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/git-setup-check.cjs | Cited | OK | Citations=9; Iterations=9 |
| .skilled/commands/doctor/scripts/git-standards.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/lib/ci-report-sources.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/lib/ci-report-workflows.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/mcp-doctor-lib.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/mcp-doctor.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/orphan-process-check.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/overlay-engine.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/scripts/parent-skill-check.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/README.markdown | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/release-update.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/scripts/route-validate.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/route-validate.sh | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/scripts/sk-code-quality-config.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/sk-code-setup-check.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/sk-skill-check.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/scripts/symlink-engine.cjs | Cited | OK | Citations=10; Iterations=10 |
| .skilled/commands/doctor/scripts/tests | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/tests/git-hook-gates.test.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/setup.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/speckit.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/symlink.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/update.md | Cited | OK | Citations=1; Iterations=1 |

---

## 4. Agents

> `.skilled/agents/**`, `.claude/agents/**`, `.skilled/agents/**`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/agents/code.md | Cited | OK | Citations=1; Iterations=1 |
| .claude/agents/Explore.md | Cited | OK | Citations=1; Iterations=1 |
| .claude/agents/README.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/agents/code.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/agents/debug.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/agents/README.txt | Cited | OK | Citations=3; Iterations=3 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/cli-external-orchestration/cli-claude-code/references/agent-delegation.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-claude-code/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-codex/references/agent-delegation.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/manual-testing-playbook.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-pi/benchmark/reports/2026-08-08--manual-testing-playbook--pi-10/skill-benchmark-report.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-ci/repository/ci.json | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-command/assets/command-template.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/assets/commit-message-template.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/feature-catalog/workflow-playbooks/message-contract-enforcement.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/references/continuous-integration.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/hooks/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-git/scripts/tests | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/tests/commit-id-naming.test.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/tests/migrate-legacy-branch-names.test.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/tests/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/tests/stamp-branch.test.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/tests/validate-message-git-timeout.test.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/worktree-naming.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/validator-git-fsmonitor.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/data/trigger-index.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/tests/hook-adapter-path-parity.vitest.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-speckit/047-v4-release-line-research/005-doctor-git-ci-runtime/research/deltas | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/bin/check-agent-mirror-sync.cjs | Cited | OK | Citations=1; Iterations=1 |
| .opencode/plugins/sk-git-preflight-advisory.js | Cited | OK | Citations=1; Iterations=1 |
| .opencode/scripts/git-hooks/lib/message-contract-gate.sh | Cited | OK | Citations=1; Iterations=1 |
| .opencode/scripts/install-git-hooks.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/check-agent-mirror-sync.cjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/bin/check-git-hooks.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/lib/mirror-sync-verify.cjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/bin/worktree-session.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/worktree-status.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/shared/hook-flags.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/scripts/git-hooks/lib/commit-id-policy.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/scripts/git-hooks/lib/message-contract-gate.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/scripts/install-git-hooks.sh | Cited | OK | Citations=2; Iterations=2 |

---

## 8. Tests

> Test files, fixtures, and snapshots. Tests take precedence over `Scripts`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/scripts/git-hooks/tests/pre-commit.test.sh | Cited | OK | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .env.example | Cited | OK | Citations=2; Iterations=2 |
| .github/workflows/agent-mirror-sync.yml | Cited | OK | Citations=3; Iterations=3 |
| .github/workflows/comment-hygiene.yml | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/dependabot-auto-merge.yml | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/message-contract.yml | Cited | OK | Citations=2; Iterations=2 |
| .github/workflows/sk-code-script-tests.yml | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/sk-git-script-tests.yml | Cited | OK | Citations=6; Iterations=6 |
| .github/workflows/trigger-index-rebuild.yml | Cited | OK | Citations=1; Iterations=1 |
| symlink-manifest.json | Cited | MISSING | Citations=1; Iterations=1 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| AGENTS.md | Cited | OK | Citations=3; Iterations=3 |
| README.md | Cited | OK | Citations=1; Iterations=1 |

---
