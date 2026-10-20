---
title: "Resource Map — What drift, bugs and refinements remain in the work four branches merged to main on 2026-10-19 (OpenCode v1/v2 dual compatibility, the Pi fast-mode copy claim, worktree dependency provisioning and the dispatch adapter suite runner), what is the best dual-version architecture, and where do the changed code and docs miss the sk-code-skilled and sk-doc contracts"
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 50
- **By category**: READMEs=3, Documents=2, Commands=2, Agents=0, Skills=15, Specs=10, Scripts=12, Tests=4, Config=2, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 014-post-merge-deep-research
- **Generated**: 2026-10-19T19:59:52.555Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/plugins/README.md | Cited | OK | Citations=2; Iterations=2 |
| .pi/extensions/pi-fast-mode-w-subagent-support/tests/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/command-support/deep/assets/compiled/README.md | Cited | OK | Citations=2; Iterations=2 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .gitignore | Cited | OK | Citations=2; Iterations=2 |
| .hermes/SYNC.md | Cited | OK | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/scripts/fixtures/broken-command-refs.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/scripts/validate-command-references.cjs | Cited | OK | Citations=2; Iterations=2 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/worktree-naming.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/worktree-provision-paths.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-vision/hooks/opencode/sk-vision.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-vision/vision-runtime/src | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-vision/vision-runtime/src/plugin.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-vision/vision-runtime/src/runtime/client.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/legacy-projection-manifest.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs | Cited | OK | Citations=2; Iterations=2 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/004-agents-commands-config/scratch/v2-command-isolated.txt | Cited | OK | Citations=2; Iterations=2 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/004-agents-commands-config/spec.md | Cited | OK | Citations=2; Iterations=2 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/009-sk-code-opencode-alignment/scratch/gates/render-manifest-live.txt | Cited | OK | Citations=2; Iterations=2 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/014-post-merge-deep-research/research/iterations/iteration-001.md | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/014-post-merge-deep-research/research/iterations/iteration-002.md | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/014-post-merge-deep-research/research/iterations/iteration-003.md | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/015-post-merge-research-sk-vision/research/research.md | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/016-post-merge-research-cli-opencode-ci/research/research.md | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/017-post-merge-research-provisioning/research/research.md | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/018-post-merge-research-conformance/research/research.md | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/plugins/lib/v2-bridge.js | Cited | OK | Citations=2; Iterations=2 |
| .opencode/plugins/session-cleanup.js | Cited | OK | Citations=1; Iterations=1 |
| .opencode/plugins/session-relaunch.js | Cited | OK | Citations=1; Iterations=1 |
| .pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/scripts/run-node-tests.mjs | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/agent-session.js | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/extensions/loader.js | Cited | OK | Citations=2; Iterations=2 |
| /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/package-manager.js | Cited | OK | Citations=2; Iterations=2 |
| /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/resource-loader.js | Cited | OK | Citations=2; Iterations=2 |
| /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/main.js | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/utils/paths.js | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 8. Tests

> Test files, fixtures, and snapshots. Tests take precedence over `Scripts`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/plugins/tests/v2-bridge.test.cjs | Cited | OK | Citations=2; Iterations=2 |
| .opencode/plugins/tests/v2-hard-plugins.test.cjs | Cited | OK | Citations=2; Iterations=2 |
| .opencode/plugins/tests/v2-registration.test.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/tests/opencode-config-shape.test.cjs | Cited | OK | Citations=2; Iterations=2 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows/dispatch-enforcement-guard.yml | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/opencode-dual-version.yml | Cited | OK | Citations=1; Iterations=1 |

---
