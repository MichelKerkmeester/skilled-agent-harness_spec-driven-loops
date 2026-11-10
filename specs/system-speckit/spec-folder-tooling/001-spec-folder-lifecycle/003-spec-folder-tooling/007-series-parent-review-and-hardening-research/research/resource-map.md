---
title: "Resource Map — How to harden the series parent rule, the recent-packets listing in create.sh and the seeded trigger phrases shipped in phase 006 of specs/system-speckit/034-spec-folder-tooling, and how to improve the UX so agents group related work into phase parents instead of opening many small singleton packets, using the existing related logic (Gate 3 options and gate-3-classifier, phase thresholds, recommend-level.sh, sub-folder versioning, folder routing, trigger index and phrase judge, skill advisor, the speckit plan and complete commands) as the baseline"
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 59
- **By category**: READMEs=1, Documents=1, Commands=6, Agents=1, Skills=34, Specs=13, Scripts=1, Tests=0, Config=1, Meta=1
- **Missing on disk**: 0
- **Scope**: research convergence output for 007-series-parent-review-and-hardening-research
- **Generated**: 2026-10-07T07:53:32.553Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows/README.md | Cited | OK | Citations=1; Iterations=1 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs | Cited | OK | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/commands/speckit/plan.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/speckit/assets/speckit-complete-presentation.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/speckit/assets/speckit-plan-presentation.txt | Cited | OK | Citations=4; Iterations=4 |
| .skilled/commands/speckit/assets/speckit-plan.yaml | Cited | OK | Citations=3; Iterations=3 |
| .skilled/commands/speckit/assets/speckit-resume-auto.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/speckit/plan.md | Cited | OK | Citations=1; Iterations=1 |

---

## 4. Agents

> `.skilled/agents/**`, `.claude/agents/**`, `.skilled/agents/**`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/agents/deep-research.md | Cited | OK | Citations=2; Iterations=2 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/system-skill-advisor/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/references/structure/folder-routing.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/references/structure/phase-definitions.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/references/validation/template-compliance-contract.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/references/validation/validation-rules.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/references/workflows/quick-reference.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/continuity/migrate-trigger-phrase-residual.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/lib/trigger-phrase-sanitizer.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/normalize.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs | Cited | OK | Citations=6; Iterations=6 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh | Cited | OK | Citations=12; Iterations=12 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/refresh-track-roots.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-phrase-sanitizer-manual-preservation.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/data/trigger-index.json | Cited | OK | Citations=5; Iterations=5 |
| .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/lib/description/description-schema.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-schema.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/lib/spec/is-phase-parent.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/lib/spec/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl | Cited | OK | Citations=2; Iterations=2 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/sk-design/019-sk-design-diagram-upgrade/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-design/020-chart-and-diagram-review/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing/implementation-summary.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing/spec.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-speckit/034-spec-folder-tooling/007-series-parent-review-and-hardening-research/research/deep-research-strategy.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/034-spec-folder-tooling/007-series-parent-review-and-hardening-research/research/deltas/iter-002.jsonl | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/034-spec-folder-tooling/007-series-parent-review-and-hardening-research/research/deltas/iter-004.jsonl | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/034-spec-folder-tooling/007-series-parent-review-and-hardening-research/research/deltas/iter-007.jsonl | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/034-spec-folder-tooling/007-series-parent-review-and-hardening-research/research/iterations/iteration-002.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/034-spec-folder-tooling/007-series-parent-review-and-hardening-research/research/iterations/iteration-008.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/034-spec-folder-tooling/007-series-parent-review-and-hardening-research/review/deep-review-findings-registry.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/034-spec-folder-tooling/007-series-parent-review-and-hardening-research/review/review-report.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-speckit/034-spec-folder-tooling/graph-metadata.json | Cited | OK | Citations=2; Iterations=2 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .pi/extensions/spec-gate-enforce.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows/advisory-checks.yml | Cited | OK | Citations=2; Iterations=2 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| AGENTS.md | Cited | OK | Citations=5; Iterations=5 |

---
