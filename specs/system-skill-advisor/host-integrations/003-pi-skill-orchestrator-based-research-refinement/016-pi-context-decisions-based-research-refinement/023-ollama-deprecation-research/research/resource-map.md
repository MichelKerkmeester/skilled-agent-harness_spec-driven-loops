---
title: "Resource Map — How to fully deprecate and remove the skill advisor Ollama and embedding semantic lane with zero remnants: code, tests, docs, doctor routes, env vars, launcher, database tables, the shared embeddings package, changelog and playbook references, and leftovers on repo users machines (pulled model, vectors, background server). Delete, never back up. Produce a complete file:line inventory, a safe removal order with gates, a user-machine cleanup design and a residue check that proves nothing is left."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 174
- **By category**: READMEs=2, Documents=5, Commands=28, Agents=0, Skills=126, Specs=0, Scripts=6, Tests=1, Config=5, Meta=1
- **Missing on disk**: 0
- **Scope**: research convergence output for 023-ollama-deprecation-research
- **Generated**: 2026-11-20T19:53:53.830Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/lib/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/README.md | Cited | OK | Citations=1; Iterations=1 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/commands/doctor/skill-advisor.md | Cited | OK | Citations=1; Iterations=1 |
| .cursor/commands/doctor-skill-advisor.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.1.0.0.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.2.0.0.md | Cited | OK | Citations=2; Iterations=2 |
| INSTALL-SKILLED.md | Cited | OK | Citations=2; Iterations=2 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/create/assets/create-command-auto.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/_routes.yaml | Cited | OK | Citations=3; Iterations=3 |
| .skilled/commands/doctor/assets/doctor-install-presentation.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-install.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-overlay-apply.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-overlay-presentation.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-overlay-repin.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-setup-presentation.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-setup.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/assets/doctor-skill-advisor-rebuild.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-symlink-link.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-symlink-presentation.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-update-apply.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/assets/doctor-update-presentation.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/orphan-process-check.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/scripts/README.markdown | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/tests/doctor-helper-match.test.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/scripts/tests/fixtures/doctor-helper/heldout.jsonl | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/tests/fixtures/doctor-helper/tune.jsonl | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/tests/orphan-process-check.test.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/tests/README.markdown | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/setup.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/skill-advisor.md | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/cli-external-orchestration/cli-codex/references/cli-reference.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/mcp-tooling/mcp-click-up/feature-catalog/cupt-task-completion/auto-note.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/mcp-tooling/mcp-figma/references/figma-cli-reference.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-design/sk-design-md-generator/styles/lib/database/vectors.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/scripts/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/scripts/tests/test_validation_switch.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/scripts/validate-doc-model-refs.js | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-benchmark/references/shared/case-studies.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/tests/typo-flags.test.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/package-lock.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/semantic-communities/community-projection.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/tests/unit/coverage-graph-db.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/ARCHITECTURE.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/changelog/v1.3.0.0.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-status.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/five-lane-fusion.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/weights-config.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/graph-metadata.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/INSTALL-GUIDE.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/leaf-manifest.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/native-status-transitions.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/operator-h5/degraded-daemon.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/five-lane-fusion.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/references/config/db-path-policy.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/references/runtime/daemon-lease-contract.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/references/runtime/freshness-contract.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/ROUTER.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/advisor-server.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/database/.gitignore | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/handlers/advisor-validate.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/embedders/embeddings-health.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/lib/embedders/registry.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/embedders/schema.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/runtime/lib/ipc/socket-server.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/types.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/doc-frontmatter.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/runtime/package.json | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-skill-advisor/runtime/scripts/measure-embedder-cost.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-routing-corpus.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor_bench.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/command-bridges-drift-guard.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/command-meaning-anchor.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/embedders/registry.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-corpus-parity.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/conflict-query-rerank.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/lane-registry-env-override.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/lane-weight-sweep.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/semantic-shadow-ablation.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/skill-graph/refresh-in-background.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tsconfig.build.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/scripts/doctor.sh | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skilled-doctor/changelog/v1.1.7.0.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/ARCHITECTURE.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/leaf-manifest.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/package.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/references/config/environment-variables.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/references/memory/embedder-pluggability.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/ROUTER.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/residue-allowlist.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-memory-residue.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/memory-pipeline-regressions.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/sweep-memory-residue.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/data/trigger-index.json | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/tests/api-validation.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/tests/chunking-semantic.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/tests/embedders/hf-local-client.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/tests/factory-auto-resolution.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/tests/launcher-ipc-bridge-probe.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/tests/local-llm-features/default-model-selection.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/tests/model-server-demand-probe.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/shared/chunking.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/shared/embeddings/auto-select.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/shared/embeddings/factory.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/shared/embeddings/providers/openai.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/shared/embeddings/registry.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/shared/package.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/shared/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/shared/scripts/env-reader-table.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/shared/tests/auto-select.test.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/shared/tests/model-server-constants.test.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/shared/tests/profile.test.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/shared/tests/registry.test.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/shared/tests/retry.test.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/shared/tsconfig.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/shared/types.ts | Cited | OK | Citations=2; Iterations=2 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/hf-model-server.cjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/bin/lib/model-server-supervision.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/system-skill-advisor-launcher.cjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/bin/worktree-session.sh | Cited | OK | Citations=2; Iterations=2 |
| .skilled/hooks/env-secret-guard/cli/env-secret.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/scripts/orphan-mcp-sweeper.sh | Cited | OK | Citations=4; Iterations=4 |

---

## 8. Tests

> Test files, fixtures, and snapshots. Tests take precedence over `Scripts`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/launcher-threshold-env.vitest.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .env.example | Cited | OK | Citations=2; Iterations=2 |
| .github/workflows/advisory-checks.yml | Cited | OK | Citations=2; Iterations=2 |
| .github/workflows/markdown-link-integrity.yml | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/routing-registry-drift.yml | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/skill-advisor-stress.yml | Cited | OK | Citations=2; Iterations=2 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| README.md | Cited | OK | Citations=1; Iterations=1 |

---
