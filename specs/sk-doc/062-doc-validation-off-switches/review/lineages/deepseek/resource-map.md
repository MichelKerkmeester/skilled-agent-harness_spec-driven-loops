---
title: "Resource Map — specs/sk-doc/062-doc-validation-off-switches (lineage: deepseek)"
description: "Auto-generated review resource map from convergence evidence."
trigger_phrases: []
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 46
- **By category**: Scripts=12, Tests=4, Documents=17, Changelogs=5, Specs=7, Config=3
- **Missing on disk**: 0
- **Scope**: review convergence output for specs/sk-doc/062-doc-validation-off-switches (lineage deepseek, 5 iterations, verdict PASS with 4 P2 advisories)
- **Generated**: 2026-09-28T12:33:00Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 3. Scripts

> `.skilled/**/scripts/**` and runtime CLI paths.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/hooks/shared/hook-flags.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=1 |
| .skilled/hooks/shared/hook-flags.sh | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=1 |
| .skilled/skills/sk-doc/shared/scripts/validation-switch.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=1 |
| .skilled/skills/sk-doc/shared/scripts/validation_switch.py | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/sk-doc/shared/scripts/validate_document.py | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=4 |
| .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=5 |
| .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=5 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=5 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs | Cited | OK | Findings P0=0 P1=0 P2=0; Iterations=1 |

---

## 4. Tests

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/hooks/shared/hook-flags.test.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/validate-skip-switch.vitest.ts | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/repair-derived.vitest.ts | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=1 |
| .skilled/skills/sk-doc/scripts/tests/test_validation_switch.py | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=1 |

---

## 5. Documents

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=3 |
| .skilled/skills/system-spec-kit/references/validation/path-scoped-rules.md | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=3 |
| .skilled/skills/system-spec-kit/references/validation/validation-rules.md | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=3 |
| .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=4 |
| .skilled/skills/sk-doc/feature-catalog/document-validation/changelog-entry-frontmatter-check.md | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=4 |
| .skilled/skills/sk-doc/shared/references/core-standards.md | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=3 |
| .skilled/skills/sk-doc/sk-create-quality-control/references/validation-and-enforcement.md | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=4 |
| .skilled/skills/sk-doc/shared/scripts/README.md | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=4 |
| .skilled/hooks/README.md | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=4 |
| .skilled/hooks/shared/README.md | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=4 |
| .skilled/hooks/hook-flags.env.example | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=2 |
| .env.example | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=2 |
| .skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/search-metadata/write-global-entry-metadata.md | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=4 |
| .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/nested-changelog-generator.md | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=4 |
| .skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=5 |
| .skilled/skills/sk-git/references/finish-workflows.md | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=5 |
| .skilled/commands/create/README.txt | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=5 |

---

## 6. Changelogs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/changelog/skilled/README.md | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=3 |
| .skilled/changelog/skilled/v4.0.0.2.md | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=3 |
| .skilled/changelog/skilled/v4.0.0.1.md | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=3 |
| .skilled/skills/system-spec-kit/changelog/v4.1.3.0.md | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=3 |
| .skilled/skills/sk-doc/changelog/v2.2.2.0.md | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=3 |

---

## 7. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/sk-doc/062-doc-validation-off-switches/spec.md | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=3 |
| specs/sk-doc/062-doc-validation-off-switches/plan.md | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=3 |
| specs/sk-doc/062-doc-validation-off-switches/tasks.md | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=3 |
| specs/sk-doc/062-doc-validation-off-switches/acceptance-criteria.md | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=3 |
| specs/sk-doc/062-doc-validation-off-switches/implementation-summary.md | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=3 |
| specs/sk-doc/061-skilled-release-changelog/spec.md | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=3 |
| specs/sk-doc/061-skilled-release-changelog/003-adjacent-alignment/implementation-summary.md | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=5 |

---

## 8. Config

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-doc/shared/assets/template-rules.json | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=4 |
| specs/sk-doc/062-doc-validation-off-switches/description.json | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=5 |
| specs/sk-doc/062-doc-validation-off-switches/graph-metadata.json | Analyzed | OK | Findings P0=0 P1=0 P2=0; Iterations=5 |

---
