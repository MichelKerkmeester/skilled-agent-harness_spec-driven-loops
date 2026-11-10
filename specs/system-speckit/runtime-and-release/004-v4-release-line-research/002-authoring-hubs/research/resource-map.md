---
title: "Resource Map — Audit the Skilled v4 authoring hubs, .skilled/skills/sk-doc/**, .skilled/skills/sk-code/**, .skilled/skills/sk-design/**, .skilled/skills/sk-prompt/** and the commands in .skilled/commands/create/, .skilled/commands/design/ and .skilled/commands/prompt/, across releases v4.0.0.0 to v4.0.2.0. Surfaces: hub routers and mode registries, sk-doc validators, templates, changelog and playbook modes, sk-code modes, surfaces, review and quality config, sk-design chart, diagram and extract modes, sk-prompt prompt-improve and prompt-models. Releases: notes in .skilled/changelog/skilled/v4.0.*.md. Tags: v4.0.0.0-beta.1 (baseline), v4.0.0.0 3fed08373e, v4.0.0.1 bcb775402e, v4.0.0.2 7980001709, v4.0.0.3 c9bd4b156c, v4.0.0.4 to v4.0.0.10 all 4d8f403355 (one commit: use each note plus git log --since/--until by date, not tag diffs), v4.0.0.11 e2b2e393fa, v4.0.0.12 7fecd5f219, v4.0.0.13 42b41dd286, v4.0.0.14 bb9b9d1c09, v4.0.0.15 22c3a9b2c7, v4.0.0.16 f459b06479, v4.0.1.0 6a93a2cfeb, v4.0.2.0 51f70a0317. Always path-limit git diff: git diff <prev>..<tag> -- <cluster path>; the unlimited diff times out. Finding types: 1 drift (note vs code vs docs disagree), 2 misalignment with sk-code, sk-doc or Skilled canon, 3 bug, 4 improvement, 5 UX for the operator and the AI user, 6 over-engineering (say what breaks if removed, or that nothing does), 7 extension (a concrete way to extend the logic). Evidence bar for every finding: type, severity P0/P1/P2, [SOURCE: path:line] for a line you read this iteration, the release that introduced it, confidence, and a verify command. A bug needs a repro command or a failing check you ran. Read code, not only release notes. Read-only research: never edit, stage or commit repository files, and run commands only in read-only, check, plan or dry-run modes."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 76
- **By category**: READMEs=0, Documents=9, Commands=14, Agents=0, Skills=51, Specs=1, Scripts=1, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 002-authoring-hubs
- **Generated**: 2026-11-08T21:25:11.924Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/changelog/skilled/v4.0.0.0.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/changelog/skilled/v4.0.0.2.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.6.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.9.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.10.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.11.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.13.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.16.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/changelog/skilled/v4.0.1.0.md | Cited | OK | Citations=2; Iterations=2 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/create/assets/create-benchmark-presentation.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/create/assets/create-changelog-auto.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/create/assets/create-readme-presentation.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/create/benchmark.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/create/changelog.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/create/readme.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/create/README.txt | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/design/chart.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/design/diagram.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/parent-skill-check.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/sk-skill-check.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/sk-code.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/sk-skill.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/prompt/improve.md | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/cli-external-orchestration/cli-claude-code/assets/prompt-quality-card.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/cli-external-orchestration/hub-router.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/hub-router.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/mode-registry.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-review/manual-testing-playbook/severity-and-evidence-discipline/report-summary-contract.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-design/changelog/v3.0.0.0.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-design/hub-router.json | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-design/manual-testing-playbook/manual-testing-playbook.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-design/sk-design-chart/assets/style-reference/evilcharts/palette-sheet-categorical.html | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-design/sk-design-chart/assets/style-reference/evilcharts/palette-sheet-ordered.html | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-design/sk-design-chart/assets/style-reference/evilcharts/source-globals.css | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-design/sk-design-chart/references/catalog.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-design/sk-design-chart/references/template-contract.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-design/sk-design-chart/scripts/tests/apply-design-md.test.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-design/sk-design-chart/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/hub-router.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/leaf-manifest.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/ROUTER.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-doc/scripts/package_skill.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/scripts/tests/render/web-markup-and-css.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/scripts/validate_document.py | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/scripts/validate_skill_package.py | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/shared/scripts/classifier-cite-drift-scan.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/shared/scripts/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/shared/scripts/validate_document.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/shared/scripts/validation-switch.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-changelog/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-diff/scripts/validate_report.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-prompt/changelog/v4.0.0.0.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-prompt/manual-testing-playbook/clear-scoring/forty-of-fifty-threshold.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-prompt/SKILL.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/event-envelope/event-type-registry.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/006-fanout-deep-review/review/lineages/deepseek/containment/quarantine/1/content/.hermes/skills/system-spec-kit/SKILL.md | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/compiled-route.cjs | Cited | OK | Citations=1; Iterations=1 |

---
