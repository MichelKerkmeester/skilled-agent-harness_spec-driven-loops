---
title: "Resource Map — Every CLI script under .skilled/bin, .skilled/skills/**/scripts (nested mode packets included), .skilled/skills/*/runtime/cli and .skilled/commands/*/scripts (tests and node_modules excluded), checked for two defect classes: (1) unknown or misspelled options accepted silently; (2) exit 0 on a detected problem, or a header that documents an option the parser rejects"
description: "Auto-generated review resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 97
- **By category**: READMEs=0, Documents=26, Commands=1, Agents=0, Skills=66, Specs=0, Scripts=4, Tests=0, Config=0, Meta=0
- **Missing on disk**: 26
- **Scope**: review convergence output for 005-silent-input-sweep
- **Generated**: 2026-10-11T17:57:19.262Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| R6-BC-READONLY-FLIP | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=2 |
| R6-BC-UNKNOWN-OPT | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=3 |
| R6-DIM-SECURITY | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| R6-FILE-APPENDSR | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| R6-FILE-CONVERGENCE | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| R6-FILE-LOOPLOCK | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| R6-FILE-QUERY | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| R6-FILE-RENDER | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| R6-FIND-001 | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| R6-FIND-002 | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| R6-FIND-005 | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| R7-BC-TYPO-WRITE | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| R7-BC-UNKNOWN-OPT | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=6 |
| R7-BC-VALUELESS-FLAG | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| R7-DIM-TRACEABILITY | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| R7-FILE-BRIDGES | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=2 |
| R7-FILE-CARDSYNC | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| R7-FILE-FRONTMATTER | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| R7-FILE-INITGRAPH | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| R7-FILE-RA | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| R7-FILE-SOAK | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| R7-FILE-STATUS | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| R7-FILE-UPSERT | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| R7-FIND-001 | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=2 |
| R7-FIND-003 | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| R7-FIND-005 | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/doctor/scripts/parent-skill-check.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-webflow/assets/scripts/minify-webflow.mjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/sk-design/shared/scripts/render-screenshots.cjs | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |
| .skilled/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/sk-design/sk-design-md-generator/backend/scripts/build-write-prompt.ts | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/sk-design/sk-design-md-generator/backend/scripts/guided-run.ts | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |
| .skilled/skills/sk-design/sk-design-md-generator/backend/scripts/study-prepare.ts | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/sk-doc/scripts/validate-doc-model-refs.js | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-repo-rule/scripts/build-rule-cards.cjs | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/validate-playbook-topology.cjs | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |
| .skilled/skills/sk-git/scripts/migrate-legacy-branch-names.sh | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/sk-git/scripts/worktree-naming.sh | Analyzed | OK | Findings P0=0 P1=0 P2=2; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/append-state-record.cjs | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/check-ledger-stem-producers.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/codex-dispatch.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/query.cjs | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/status.cjs | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.mjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/init-skill-graph.sh | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/verify-zombie-soak.sh | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=2; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-analyze.ts | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-measurement.ts | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/ops/process-sweep.ts | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/rules/check-graph-metadata-child-drift.sh | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/setup/check-native-modules.sh | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/spec-folder/generate-description.ts | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/is-phase-parent.ts | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/sweep/strict-pass-freshness.ts | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.ts | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/validate-command-tree-parity.sh | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/validation/ephemeral-pointer-audit.mjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/validation/evidence-marker-audit.ts | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/validation/unactioned-recorded-failure-audit.mjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-spec-kit/shared/scripts/env-reader-table.mjs | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/check-agent-mirror-sync.cjs | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |
| .skilled/bin/compiled-route.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/bin/git-sync.sh | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/bin/speckit-completion.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |

---
