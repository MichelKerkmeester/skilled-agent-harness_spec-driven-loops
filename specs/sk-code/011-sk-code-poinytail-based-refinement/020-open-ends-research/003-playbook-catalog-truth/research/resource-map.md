---
title: "Resource Map — Find the lightest way to make manual-testing playbook scenarios and feature catalog entries check themselves against the code, through the sk-create-manual-testing-playbook and sk-create-feature-catalog modes and their validators: where they drift from the code today and what catches it, the lightest self-check that tests a scenario options and expected answers and a catalog entry code anchors against the code, and which drift classes that check would still miss"
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 60
- **By category**: READMEs=0, Documents=2, Commands=1, Agents=0, Skills=48, Specs=4, Scripts=1, Tests=0, Config=4, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 003-playbook-catalog-truth
- **Generated**: 2026-10-11T17:25:07.996Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .pi/extensions/pi-fast-mode-w-subagent-support/manual-testing-playbook/persistence-and-startup/fast-startup-flag.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/specs/system-speckit/z_archive/022-hybrid-rag-fusion/system-spec-kit/feature-catalog/tooling-and-scripts/canonical-first-spec-root-resolution.md | Cited | OK | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/create/assets/create-agent-auto.yaml | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/cli-orca/manual-testing-playbook/routing/orca-positive-route.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-design/sk-design-diagram/feature-catalog/diagram-generation/type-selection-and-routing.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-design/sk-design-diagram/manual-testing-playbook/command-and-hub-integration/design-diagram-command.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/feature-catalog/packet-authored-registry-routing/packet-authored-registry-routing.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/manual-testing-playbook/document-validation/citation-drift-scan.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/scripts/validate_document.py | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/scripts/validate-doc-model-refs.js | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs | Cited | OK | Citations=7; Iterations=7 |
| .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/tests/test_validator_fixtures.py | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py | Cited | OK | Citations=9; Iterations=9 |
| .skilled/skills/sk-doc/sk-create-feature-catalog/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs | Cited | OK | Citations=9; Iterations=9 |
| .skilled/skills/sk-git/feature-catalog/feature-catalog.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/manual-testing-playbook/recovery-and-edge-cases/empty-commit-or-no-changes.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-git/manual-testing-playbook/safety-refusals/no-verify-bypass-refused.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-prompt/manual-testing-playbook/depth-clear-loop/depth-five-phases-order.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-vision/feature-catalog/feature-catalog.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-vision/manual-testing-playbook/manual-testing-playbook.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-vision/manual-testing-playbook/scene-understanding/detect.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-ai-council/manual-testing-playbook/council-graph-integration/council-graph-query-five-modes-prompt-safe-context.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/manual-testing-playbook/doctor-commands/doctor-deep-loop-lazy-init.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/mode-registry.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/state-safety/atomic-state-deferred-writer.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-rebuild.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/skill-advisor-cli.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/tools/index.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/canonical-first-spec-root-resolution.md | Cited | OK | Citations=5; Iterations=5 |
| .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/code-standards-alignment.md | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/core-workflow-infrastructure.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/json-primary-deprecation-posture.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/markdown-link-integrity-guard.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/nested-changelog-generator.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md | Cited | OK | Citations=7; Iterations=7 |
| .skilled/skills/system-spec-kit/runtime/cli/core/spec-root-canonical-resolver.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs | Cited | OK | Citations=6; Iterations=6 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh | Cited | OK | Citations=7; Iterations=7 |
| .skilled/skills/system-spec-kit/runtime/handlers/save/spec-folder-mutex.ts | Cited | OK | Citations=2; Iterations=2 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/sk-code/011-sk-code-poinytail-based-refinement/018-create-sh-unknown-options/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/003-playbook-catalog-truth/research/deep-research-strategy.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/003-playbook-catalog-truth/research/iterations/iteration-007.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/003-playbook-catalog-truth/research/iterations/iteration-008.md | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/worktree-session.sh | Cited | OK | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows/advisory-checks.yml | Cited | OK | Citations=2; Iterations=2 |
| .github/workflows/playbook-operator-contract.yml | Cited | OK | Citations=5; Iterations=5 |
| .github/workflows/routing-registry-drift.yml | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/sk-doc-script-tests.yml | Cited | OK | Citations=4; Iterations=4 |

---
