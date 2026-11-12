---
title: "Resource Map — Which automated tests, CI workflows and git hook checks in this repository are bloat or overengineered, and what should be deleted, merged, narrowed or moved off the commit and push path to shorten test and workflow run time? Read the inventory and CI run times in specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research/spec.md first. Subjects: .github/workflows/, .skilled/scripts/git-hooks/, the vitest and node:test suites under .skilled/skills/*/runtime, and test files under specs/. Settled and not to repeat: caching, trigger hygiene and workflow consolidation in specs/system-speckit/repo-operations/002-ci-workflow-efficiency, and the per-file splits and CI timing in phases 001 to 005 of specs/system-speckit/runtime-and-release/006-test-cycle-speed. For each proposed cut give the file path, the time it saves, and the regression it would stop catching. Research only: change no test, workflow, hook or source file."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 84
- **By category**: READMEs=3, Documents=6, Commands=3, Agents=0, Skills=29, Specs=10, Scripts=8, Tests=3, Config=22, Meta=0
- **Missing on disk**: 2
- **Scope**: research convergence output for 007-test-and-ci-bloat-research
- **Generated**: 2026-11-12T07:54:42.804Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/scripts/git-hooks/lib/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/scripts/git-hooks/README.md | Cited | OK | Citations=1; Iterations=1 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/scripts/git-hooks/lib/gates.tsv | Cited | OK | Citations=2; Iterations=2 |
| .skilled/scripts/git-hooks/pre-commit | Cited | OK | Citations=6; Iterations=6 |
| .skilled/scripts/git-hooks/pre-push | Cited | OK | Citations=2; Iterations=2 |
| gh api branches/main/protection | Cited | MISSING | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/doctor/scripts/check-mcp-mutation-class.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/tests/agent-roster-mirror-check.test.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/tests/run-all.sh | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/skills/sk-doc/scripts/validate-doc-model-refs.js | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/_support/hermetic-opencode-path.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/vitest.config.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/package.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/compat/python-compat.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/vitest.config.ts | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-skill-advisor/runtime/vitest.stress.config.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/progressive-validation.vitest.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/test-validation-system.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/unactioned-recorded-failure-audit.test.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/package.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/scripts/run-tests-sharded.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/tests/progressive-validation.vitest.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/vitest.config.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/vitest.stress.config.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/vitest.config.ts | Cited | OK | Citations=3; Iterations=3 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/cli-classifier/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm/scratch/w3-build/logs/02.vitest.txt | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-classifier/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm/scratch/w3-build/logs/14.pre.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-classifier/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm/scratch/w3-build/logs/15.pre.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-orca/002-consolidate-official-orca-skills/context/orca-main/package.json | Cited | OK | Citations=1; Iterations=1 |
| specs/hooks-plugins-extensions/hook-injection-pipeline/002-injection-bloat-reduction/007-guardrail-controls-and-activation/ | Cited | OK | Citations=1; Iterations=1 |
| specs/hooks-plugins-extensions/hook-injection-pipeline/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.test.mjs | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-git/commit-standards/001-crawlable-commit-history/005-history-rewrite/scripts/tests/test_build_commit_plan.py | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/021-stress-test-enterprise-wiring-expansion/measurements/phase-h-stress.test.ts | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/repo-operations/002-ci-workflow-efficiency/008-consolidation-decision/scratch/d8-answer.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research/spec.md | Cited | OK | Citations=7; Iterations=7 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/scripts/check-gate-inputs.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/check-agent-mirror-sync.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/compiled-route-guard.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/003-mcp-tooling/harness/build-artifacts.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/vitest.config.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/scripts/git-hooks/lib/bounded-git.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/scripts/run-node-tests.mjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/vitest.config.bin.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 8. Tests

> Test files, fixtures, and snapshots. Tests take precedence over `Scripts`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/scripts/git-hooks/tests/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/scripts/git-hooks/tests/pre-commit.test.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/scripts/git-hooks/tests/source-root-selection.test.sh | Cited | OK | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows/*.yml | Cited | MISSING | Citations=1; Iterations=1 |
| .github/workflows/advisory-checks.yml | Cited | OK | Citations=3; Iterations=3 |
| .github/workflows/agent-mirror-sync.yml | Cited | OK | Citations=4; Iterations=4 |
| .github/workflows/changed-packet-validation.yml | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/command-tree-parity.yml | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/comment-hygiene.yml | Cited | OK | Citations=5; Iterations=5 |
| .github/workflows/deep-loop-runtime.yml | Cited | OK | Citations=3; Iterations=3 |
| .github/workflows/dispatch-enforcement-guard.yml | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/gate-inputs.yml | Cited | OK | Citations=2; Iterations=2 |
| .github/workflows/markdown-link-integrity.yml | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/message-contract.yml | Cited | OK | Citations=3; Iterations=3 |
| .github/workflows/naming-standard-guard.yml | Cited | OK | Citations=5; Iterations=5 |
| .github/workflows/opencode-dual-version.yml | Cited | OK | Citations=2; Iterations=2 |
| .github/workflows/playbook-operator-contract.yml | Cited | OK | Citations=2; Iterations=2 |
| .github/workflows/routing-registry-drift.yml | Cited | OK | Citations=6; Iterations=6 |
| .github/workflows/rule-canary-sync.yml | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/sk-doc-script-tests.yml | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/skill-advisor-stress.yml | Cited | OK | Citations=3; Iterations=3 |
| .github/workflows/skill-doc-frontmatter.yml | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/spec-kit-check.yml | Cited | OK | Citations=6; Iterations=6 |
| .github/workflows/trigger-index-rebuild.yml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/package.json | Cited | OK | Citations=1; Iterations=1 |

---

---

## Lineage Delta Sources

| Lineage | Delta |
|---------|-------|
| opencode-go | lineages/opencode-go/deltas/iter-001.jsonl |
| opencode-go | lineages/opencode-go/deltas/iter-002.jsonl |
| opencode-go | lineages/opencode-go/deltas/iter-003.jsonl |
| opencode-go | lineages/opencode-go/deltas/iter-004.jsonl |
| opencode-go | lineages/opencode-go/deltas/iter-005.jsonl |
| opencode-go | lineages/opencode-go/deltas/iter-006.jsonl |
| opencode-go | lineages/opencode-go/deltas/iter-007.jsonl |
| opencode-go | lineages/opencode-go/deltas/iter-008.jsonl |
| opencode-go | lineages/opencode-go/deltas/iter-009.jsonl |
| opencode-go | lineages/opencode-go/deltas/iter-010.jsonl |
| pi-llmgateway | lineages/pi-llmgateway/deltas/iter-001.jsonl |
| pi-llmgateway | lineages/pi-llmgateway/deltas/iter-002.jsonl |
| pi-llmgateway | lineages/pi-llmgateway/deltas/iter-003.jsonl |
| pi-llmgateway | lineages/pi-llmgateway/deltas/iter-004.jsonl |
| pi-llmgateway | lineages/pi-llmgateway/deltas/iter-005.jsonl |
| pi-llmgateway | lineages/pi-llmgateway/deltas/iter-006.jsonl |
| pi-llmgateway | lineages/pi-llmgateway/deltas/iter-007.jsonl |
| pi-llmgateway | lineages/pi-llmgateway/deltas/iter-008.jsonl |
| pi-llmgateway | lineages/pi-llmgateway/deltas/iter-009.jsonl |
| pi-llmgateway | lineages/pi-llmgateway/deltas/iter-010.jsonl |
