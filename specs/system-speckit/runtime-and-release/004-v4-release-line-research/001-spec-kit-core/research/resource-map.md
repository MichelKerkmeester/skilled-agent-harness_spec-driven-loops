---
title: "Resource Map — Audit the Skilled v4 spec-kit core, .skilled/skills/system-spec-kit/** and .skilled/commands/speckit/**, across releases v4.0.0.0 to v4.0.2.0. Surfaces: the Gate 3 classifier (system-spec-kit/shared/gate-3-classifier.ts), validate.sh and its rules (runtime/cli/spec/, runtime/cli/rules/), the trigger index and retrieval (runtime/cli/retrieval/), continuity save and resume (generate-context.js, /speckit:save, /speckit:resume), the goal system (goal.md, goal.cjs), upgrade and /doctor:update, the level templates and create.sh. Releases: notes in .skilled/changelog/skilled/v4.0.*.md. Tags: v4.0.0.0-beta.1 (baseline), v4.0.0.0 3fed08373e, v4.0.0.1 bcb775402e, v4.0.0.2 7980001709, v4.0.0.3 c9bd4b156c, v4.0.0.4 to v4.0.0.10 all 4d8f403355 (one commit: use each note plus git log --since/--until by date, not tag diffs), v4.0.0.11 e2b2e393fa, v4.0.0.12 7fecd5f219, v4.0.0.13 42b41dd286, v4.0.0.14 bb9b9d1c09, v4.0.0.15 22c3a9b2c7, v4.0.0.16 f459b06479, v4.0.1.0 6a93a2cfeb, v4.0.2.0 51f70a0317. Always path-limit git diff: git diff <prev>..<tag> -- <cluster path>; the unlimited diff times out. Finding types: 1 drift (note vs code vs docs disagree), 2 misalignment with sk-code, sk-doc or Skilled canon, 3 bug, 4 improvement, 5 UX for the operator and the AI user, 6 over-engineering (say what breaks if removed, or that nothing does), 7 extension (a concrete way to extend the logic). Evidence bar for every finding: type, severity P0/P1/P2, [SOURCE: path:line] for a line you read this iteration, the release that introduced it, confidence, and a verify command. A bug needs a repro command or a failing check you ran. Read code, not only release notes. Read-only research: never edit, stage or commit repository files, and run commands only in read-only, check, plan or dry-run modes."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 105
- **By category**: READMEs=0, Documents=11, Commands=13, Agents=0, Skills=72, Specs=2, Scripts=4, Tests=0, Config=2, Meta=1
- **Missing on disk**: 0
- **Scope**: research convergence output for 001-spec-kit-core
- **Generated**: 2026-11-08T22:33:43.217Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .cursor/rules/skill-routing.md | Cited | OK | Citations=1; Iterations=1 |
| .gitignore | Cited | OK | Citations=2; Iterations=2 |
| .skilled/changelog/skilled/v4.0.0.0.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/changelog/skilled/v4.0.0.2.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.4.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.5.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.11.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.15.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.16.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.1.0.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.2.0.md | Cited | OK | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/doctor/assets/doctor-install-presentation.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/release-update.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/tests/release-update.test.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/setup.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/update.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/speckit/assets/speckit-complete.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/speckit/assets/speckit-implement.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/speckit/assets/speckit-plan.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/speckit/assets/speckit-save-context-tail.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/speckit/handoff.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/speckit/README.txt | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/speckit/save.md | Cited | OK | Citations=2; Iterations=2 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/formatting-imports-and-coexistence.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/overview-strict-and-naming.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs | Cited | OK | Citations=7; Iterations=7 |
| .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/package.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/references/config/environment-variables.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/references/memory/memory-system.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/references/memory/save-workflow.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/references/structure/folder-structure.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/references/structure/phase-definitions.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/references/templates/level-specifications.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/references/templates/template-guide.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/references/validation/validation-rules.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/continuity/backfill-frontmatter.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/core/config.ts | Cited | OK | Citations=7; Iterations=7 |
| .skilled/skills/system-spec-kit/runtime/cli/core/spec-root-write-guard.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/dist/core/config.js | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/evals/check-source-dist-alignment.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-analyze.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/package.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/resource-map/extract-from-evidence.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/normalize.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs | Cited | OK | Citations=5; Iterations=5 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/measure-cold-lookup.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/rules/check-canonical-save-lineage.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/rules/check-canonical-save-root-spec.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/rules/check-measured-behavior.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags.sh | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/rules/check-spec-doc-integrity.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh | Cited | OK | Citations=7; Iterations=7 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/sync-phase-map-status.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/test-validation.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh | Cited | OK | Citations=5; Iterations=5 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/package-root-parity.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/tsconfig.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/data/trigger-index.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/dist/core/config.js | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/dist/hooks/lib/history/cli.js | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts | Cited | OK | Citations=6; Iterations=6 |
| .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/runtime/package.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/scripts/finalize-dist.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/tests/env-reference-drift.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/tests/spec-doc-structure.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/tsconfig.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts | Cited | OK | Citations=7; Iterations=7 |
| .skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/SKILL.md | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/templates/spec-kit-docs.json | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/001-test-feature/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/runtime-and-release/001-system-speckit-v4/035-v4-changelog-draft-update/scratch/changelog-digests/system-spec-kit.md | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/hooks/goal/bin/goal.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/goal/lib/goal-slice.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/shared/env-aliases.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/shared/hook-flags.cjs | Cited | OK | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .env.example | Cited | OK | Citations=1; Iterations=1 |
| .github/workflows/comment-hygiene.yml | Cited | OK | Citations=1; Iterations=1 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| AGENTS.md | Cited | OK | Citations=3; Iterations=3 |

---
