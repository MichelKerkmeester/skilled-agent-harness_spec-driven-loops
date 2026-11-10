---
title: "Resource Map — Analyze every change branch 091-consolidate-small-packets made to the spec folder tooling and the spec corpus (the commits in git log origin/main..HEAD plus the uncommitted corpus-wide repair of phase 013), then answer: how do we harden it, and how do we automate healing and fixing of specs in old formats, including pre-v4 repos, so external users on older versions are not burdened? Answer five questions with file:line evidence. (1) Which one-off repair fixes should become permanent idempotent tooling, and where should each live? (2) What causes each validation failure class at the source, and how do we stop new instances? (3) How should an older or pre-v4 repo be detected and migrated or healed safely (dry run first, idempotent, reversible, never changing what a document says, never inventing history), and how does that fit /doctor:update? (4) What should be hardened in this branch's own changes: the CI trigger-index rebuild job and its token push, the template phrase cleanup and census tools, the seeder and the Gate 3 wording? (5) Which checks belong in CI or pre-commit so drift is caught early and cheaply? The lead's full brief, evidence paths, write limits and output shape are in steer.md inside the lineage directory; read it before init and before every iteration."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 167
- **By category**: READMEs=3, Documents=44, Commands=9, Agents=0, Skills=52, Specs=11, Scripts=33, Tests=1, Config=14, Meta=0
- **Missing on disk**: 70
- **Scope**: research convergence output for 014-spec-auto-healing-research
- **Generated**: 2026-10-07T22:15:22.555Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows/README.md | Cited | OK | Citations=2; Iterations=2 |
| .opencode/scripts/git-hooks/README.md | Cited | OK | Citations=1; Iterations=1 |
| spec/README.md | Cited | MISSING | Citations=1; Iterations=1 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows/ | Cited | OK | Citations=1; Iterations=1 |
| .opencode/scripts/git-hooks/pre-commit | Cited | OK | Citations=3; Iterations=3 |
| .skilled/scripts/git-hooks/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/scripts/git-hooks/pre-commit | Cited | OK | Citations=2; Iterations=2 |
| .skilled/scripts/git-hooks/pre-push | Cited | OK | Citations=2; Iterations=2 |
| /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-baseline.tsv | Cited | OK | Citations=1; Iterations=1 |
| /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt | Cited | OK | Citations=3; Iterations=3 |
| /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-failed.txt | Cited | OK | Citations=1; Iterations=1 |
| /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/detail3.txt | Cited | OK | Citations=3; Iterations=3 |
| /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/fix-lanes/batch-01.task | Cited | OK | Citations=4; Iterations=4 |
| 013-corpus-wide-validation-repair/plan.md | Cited | MISSING | Citations=1; Iterations=1 |
| all-detail.txt vs detail3.txt recounts | Cited | MISSING | Citations=1; Iterations=1 |
| auto-mode-contract.md | Cited | MISSING | Citations=1; Iterations=1 |
| create.sh:390-479,1590-2100 | Cited | MISSING | Citations=1; Iterations=1 |
| deltas/iter-001.jsonl through iter-014.jsonl | Cited | MISSING | Citations=1; Iterations=1 |
| detail3.txt | Cited | MISSING | Citations=1; Iterations=1 |
| doctor/update.md | Cited | MISSING | Citations=1; Iterations=1 |
| find counts over specs/**/z_archive | Cited | MISSING | Citations=1; Iterations=1 |
| find counts over specs/**/z_archive/** | Cited | MISSING | Citations=1; Iterations=1 |
| fix-lanes/batch-*.task | Cited | MISSING | Citations=1; Iterations=1 |
| fix-lanes/batch-*.txt | Cited | MISSING | Citations=1; Iterations=1 |
| git log --stat origin/main..HEAD | Cited | MISSING | Citations=1; Iterations=1 |
| git log origin/main..HEAD | Cited | MISSING | Citations=1; Iterations=1 |
| git ls-files fixtures/ | Cited | MISSING | Citations=1; Iterations=1 |
| iterations/iteration-001.md through iteration-014.md | Cited | MISSING | Citations=1; Iterations=1 |
| iterations/iteration-013.md | Cited | MISSING | Citations=1; Iterations=1 |
| iterations/iteration-014.md | Cited | MISSING | Citations=1; Iterations=1 |
| pre-commit | Cited | MISSING | Citations=2; Iterations=2 |
| pre-push | Cited | MISSING | Citations=1; Iterations=1 |
| README-repair-derived.md | Cited | MISSING | Citations=1; Iterations=1 |
| rg -o 'SPECKIT_TEMPLATE_SOURCE: ...' over specs/**/*.md | Cited | MISSING | Citations=1; Iterations=1 |
| rg -o over specs/**/*.md (template headers) | Cited | MISSING | Citations=1; Iterations=1 |
| scaffold-sample/spec.md.txt | Cited | MISSING | Citations=1; Iterations=1 |
| scratchpad all-baseline.tsv/all-failed.txt/all-folders.txt | Cited | MISSING | Citations=1; Iterations=1 |
| scratchpad all-detail.txt/detail2.txt/detail3.txt | Cited | MISSING | Citations=1; Iterations=1 |
| scratchpad fix-lanes/batch-01.task | Cited | MISSING | Citations=1; Iterations=1 |
| spec-folder-write-recipe.md | Cited | MISSING | Citations=1; Iterations=1 |
| spec.md.tmpl | Cited | MISSING | Citations=1; Iterations=1 |
| steer.md | Cited | MISSING | Citations=15; Iterations=15 |
| templates/ grep | Cited | MISSING | Citations=1; Iterations=1 |
| templates/CONTRACT.md | Cited | MISSING | Citations=1; Iterations=1 |
| templates/core/spec.md.tmpl | Cited | MISSING | Citations=1; Iterations=1 |
| templates/MIGRATION.md | Cited | MISSING | Citations=1; Iterations=1 |
| validation-rules.md | Cited | MISSING | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/create/assets/create-feature-catalog-presentation.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/deep/assets/deep-research-presentation.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/_routes.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-update-apply.yaml | Cited | OK | Citations=3; Iterations=3 |
| .skilled/commands/doctor/assets/doctor-update-check.yaml | Cited | OK | Citations=4; Iterations=4 |
| .skilled/commands/doctor/scripts/release-update.cjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/commands/doctor/update.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/commands/speckit/assets/speckit-complete-presentation.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/speckit/assets/speckit-plan-presentation.txt | Cited | OK | Citations=2; Iterations=2 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/system-spec-kit/references/structure/phase-definitions.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/references/validation/template-compliance-contract.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/references/validation/validation-rules.md | Cited | OK | Citations=5; Iterations=5 |
| .skilled/skills/system-spec-kit/references/workflows/auto-mode-contract.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/references/workflows/spec-folder-authoring-checklist.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/graph/migrate-generated-json.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/lib/completion-state.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json | Cited | OK | Citations=7; Iterations=7 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/rules/check-files.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/rules/check-graph-metadata-child-drift.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/rules/check-grep-convention.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/rules/check-level-match.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/rules/check-metadata-disk-consistency-helper.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/rules/check-metadata-disk-consistency.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/rules/check-template-source.sh | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh | Cited | OK | Citations=6; Iterations=6 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs | Cited | OK | Citations=6; Iterations=6 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/README-repair-derived.md | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/README.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs | Cited | OK | Citations=5; Iterations=5 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-census.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs | Cited | OK | Citations=12; Iterations=12 |
| .skilled/skills/system-spec-kit/runtime/cli/sweep/strict-pass-freshness.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/template-structure.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/test-validation-extended.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/utils/template-structure.js | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/data/trigger-index.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/templates/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/templates/CONTRACT.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/templates/core/implementation-summary.md.tmpl | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl | Cited | OK | Citations=6; Iterations=6 |
| .skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/templates/MIGRATION.md | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/templates/spec-kit-docs.json | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/034-spec-folder-tooling/009-gate-3-menu-series-parent/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/034-spec-folder-tooling/011-template-phrase-census-and-cleanup/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/034-spec-folder-tooling/012-template-phrase-cleanup-round-two/implementation-summary.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md | Cited | OK | Citations=6; Iterations=6 |
| specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md | Cited | OK | Citations=5; Iterations=5 |
| specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/scaffold-sample/description.json.txt | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/scaffold-sample/graph-metadata.json.txt | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/scaffold-sample/implementation-summary.md.txt | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/scaffold-sample/spec.md.txt | Cited | OK | Citations=3; Iterations=3 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/scripts/install-git-hooks.sh | Cited | OK | Citations=3; Iterations=3 |
| /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/add-fm-fields.mjs | Cited | OK | Citations=3; Iterations=3 |
| /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/census.mjs | Cited | OK | Citations=1; Iterations=1 |
| /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/citecheck.mjs | Cited | OK | Citations=1; Iterations=1 |
| /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/dup-survey.mjs | Cited | OK | Citations=1; Iterations=1 |
| /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/fix-dup-anchors.mjs | Cited | OK | Citations=4; Iterations=4 |
| /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/fix-specfolder.mjs | Cited | OK | Citations=3; Iterations=3 |
| /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/val-detail.sh | Cited | OK | Citations=3; Iterations=3 |
| add-fm-fields.mjs | Cited | MISSING | Citations=1; Iterations=1 |
| archive.sh | Cited | MISSING | Citations=1; Iterations=1 |
| census.mjs | Cited | MISSING | Citations=1; Iterations=1 |
| check-template-staleness.sh | Cited | MISSING | Citations=1; Iterations=1 |
| citecheck.mjs | Cited | MISSING | Citations=1; Iterations=1 |
| completion-state.cjs | Cited | MISSING | Citations=1; Iterations=1 |
| create.sh | Cited | MISSING | Citations=1; Iterations=1 |
| dup-survey.mjs | Cited | MISSING | Citations=1; Iterations=1 |
| fix-dup-anchors.mjs | Cited | MISSING | Citations=1; Iterations=1 |
| fix-specfolder.mjs | Cited | MISSING | Citations=2; Iterations=2 |
| generate-trigger-index.mjs | Cited | MISSING | Citations=1; Iterations=1 |
| heal-spec-docs.cjs | Cited | MISSING | Citations=1; Iterations=1 |
| install-git-hooks.sh | Cited | MISSING | Citations=2; Iterations=2 |
| phrase-judge.mjs | Cited | MISSING | Citations=2; Iterations=2 |
| release-update.cjs | Cited | MISSING | Citations=1; Iterations=1 |
| repair-derived.cjs | Cited | MISSING | Citations=2; Iterations=2 |
| retrieval/lib/corpus.mjs | Cited | MISSING | Citations=1; Iterations=1 |
| rg-wrapper.mjs | Cited | MISSING | Citations=1; Iterations=1 |
| scratchpad fix-dup-anchors.mjs/add-fm-fields.mjs/fix-specfolder.mjs/dup-survey.mjs/fix-queue.sh/val-one.sh/val-detail.sh | Cited | MISSING | Citations=1; Iterations=1 |
| spec-doc-structure.ts | Cited | MISSING | Citations=1; Iterations=1 |
| strict-pass-freshness.ts | Cited | MISSING | Citations=2; Iterations=2 |
| template-phrase-census.mjs | Cited | MISSING | Citations=1; Iterations=1 |
| template-phrase-cleanup.mjs | Cited | MISSING | Citations=1; Iterations=1 |
| upgrade-legacy.mjs | Cited | MISSING | Citations=3; Iterations=3 |
| val-detail.sh | Cited | MISSING | Citations=1; Iterations=1 |

---

## 8. Tests

> Test files, fixtures, and snapshots. Tests take precedence over `Scripts`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| create-root-numbering.vitest.ts | Cited | MISSING | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows/advisory-checks.yml | Cited | OK | Citations=3; Iterations=3 |
| .github/workflows/changed-packet-validation.yml | Cited | OK | Citations=4; Iterations=4 |
| .github/workflows/spec-kit-check.yml | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/strict-pass-freshness-report.yml | Cited | OK | Citations=4; Iterations=4 |
| .github/workflows/trigger-index-rebuild.yml | Cited | OK | Citations=5; Iterations=5 |
| advisory-checks.yml | Cited | MISSING | Citations=1; Iterations=1 |
| changed-packet-validation.yml | Cited | MISSING | Citations=3; Iterations=3 |
| doctor-update-*.yaml | Cited | MISSING | Citations=1; Iterations=1 |
| doctor-update-apply.yaml | Cited | MISSING | Citations=1; Iterations=1 |
| doctor-update-check.yaml | Cited | MISSING | Citations=1; Iterations=1 |
| spec-kit-check.yml | Cited | MISSING | Citations=1; Iterations=1 |
| strict-pass-freshness-report.yml | Cited | MISSING | Citations=1; Iterations=1 |
| trigger-index-rebuild.yml | Cited | MISSING | Citations=1; Iterations=1 |
| validator-registry.json | Cited | MISSING | Citations=2; Iterations=2 |

---

---

## Lineage Delta Sources

| Lineage | Delta |
|---------|-------|
| codex-luna-6-max-fast | lineages/codex-luna-6-max-fast/deltas/iter-001.jsonl |
| codex-luna-6-max-fast | lineages/codex-luna-6-max-fast/deltas/iter-002.jsonl |
| codex-luna-6-max-fast | lineages/codex-luna-6-max-fast/deltas/iter-003.jsonl |
| codex-luna-6-max-fast | lineages/codex-luna-6-max-fast/deltas/iter-004.jsonl |
| codex-luna-6-max-fast | lineages/codex-luna-6-max-fast/deltas/iter-005.jsonl |
| codex-luna-6-max-fast | lineages/codex-luna-6-max-fast/deltas/iter-006.jsonl |
| codex-luna-6-max-fast | lineages/codex-luna-6-max-fast/deltas/iter-007.jsonl |
| codex-luna-6-max-fast | lineages/codex-luna-6-max-fast/deltas/iter-008.jsonl |
| codex-luna-6-max-fast | lineages/codex-luna-6-max-fast/deltas/iter-009.jsonl |
| codex-luna-6-max-fast | lineages/codex-luna-6-max-fast/deltas/iter-010.jsonl |
| codex-luna-6-max-fast | lineages/codex-luna-6-max-fast/deltas/iter-011.jsonl |
| codex-luna-6-max-fast | lineages/codex-luna-6-max-fast/deltas/iter-012.jsonl |
| codex-luna-6-max-fast | lineages/codex-luna-6-max-fast/deltas/iter-013.jsonl |
| codex-luna-6-max-fast | lineages/codex-luna-6-max-fast/deltas/iter-014.jsonl |
| codex-luna-6-max-fast | lineages/codex-luna-6-max-fast/deltas/iter-015.jsonl |
| devin-swe-2-max | lineages/devin-swe-2-max/deltas/iter-001.jsonl |
| devin-swe-2-max | lineages/devin-swe-2-max/deltas/iter-002.jsonl |
| devin-swe-2-max | lineages/devin-swe-2-max/deltas/iter-003.jsonl |
| devin-swe-2-max | lineages/devin-swe-2-max/deltas/iter-004.jsonl |
| devin-swe-2-max | lineages/devin-swe-2-max/deltas/iter-005.jsonl |
| devin-swe-2-max | lineages/devin-swe-2-max/deltas/iter-006.jsonl |
| devin-swe-2-max | lineages/devin-swe-2-max/deltas/iter-007.jsonl |
| devin-swe-2-max | lineages/devin-swe-2-max/deltas/iter-008.jsonl |
| devin-swe-2-max | lineages/devin-swe-2-max/deltas/iter-009.jsonl |
| devin-swe-2-max | lineages/devin-swe-2-max/deltas/iter-010.jsonl |
| devin-swe-2-max | lineages/devin-swe-2-max/deltas/iter-011.jsonl |
| devin-swe-2-max | lineages/devin-swe-2-max/deltas/iter-012.jsonl |
| devin-swe-2-max | lineages/devin-swe-2-max/deltas/iter-013.jsonl |
| devin-swe-2-max | lineages/devin-swe-2-max/deltas/iter-014.jsonl |
| devin-swe-2-max | lineages/devin-swe-2-max/deltas/iter-015.jsonl |
| pi-deepseek-flash-max | lineages/pi-deepseek-flash-max/deltas/iter-001.jsonl |
| pi-deepseek-flash-max | lineages/pi-deepseek-flash-max/deltas/iter-002.jsonl |
| pi-deepseek-flash-max | lineages/pi-deepseek-flash-max/deltas/iter-003.jsonl |
| pi-deepseek-flash-max | lineages/pi-deepseek-flash-max/deltas/iter-004.jsonl |
| pi-deepseek-flash-max | lineages/pi-deepseek-flash-max/deltas/iter-005.jsonl |
| pi-deepseek-flash-max | lineages/pi-deepseek-flash-max/deltas/iter-006.jsonl |
| pi-deepseek-flash-max | lineages/pi-deepseek-flash-max/deltas/iter-007.jsonl |
| pi-deepseek-flash-max | lineages/pi-deepseek-flash-max/deltas/iter-008.jsonl |
| pi-deepseek-flash-max | lineages/pi-deepseek-flash-max/deltas/iter-009.jsonl |
| pi-deepseek-flash-max | lineages/pi-deepseek-flash-max/deltas/iter-010.jsonl |
| pi-deepseek-flash-max | lineages/pi-deepseek-flash-max/deltas/iter-011.jsonl |
| pi-deepseek-flash-max | lineages/pi-deepseek-flash-max/deltas/iter-012.jsonl |
| pi-deepseek-flash-max | lineages/pi-deepseek-flash-max/deltas/iter-013.jsonl |
| pi-deepseek-flash-max | lineages/pi-deepseek-flash-max/deltas/iter-014.jsonl |
| pi-deepseek-flash-max | lineages/pi-deepseek-flash-max/deltas/iter-015.jsonl |
