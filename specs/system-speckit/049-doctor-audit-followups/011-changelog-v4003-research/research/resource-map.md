---
title: "Resource Map — What must be added to or corrected in .skilled/changelog/skilled/v4.0.0.3.md so it covers (a) the doctor command changes in specs/system-speckit/049-doctor-audit-followups phases 001-010: trigger-index freshness, release/update customization signals, doctor gates and drift, doctor script conformance, the /doctor:update research and fixes, the speckit router contract drift, the ownership split of /doctor:speckit into /doctor:skill-advisor, /doctor:deep-loop and /doctor:runtime-mirrors with /doctor:rebuild and the fable-mode target deleted, the new /doctor:git <hooks|standards> command, and the mandatory input gates added to /doctor:skill-advisor and /doctor:mcp; and (b) the git workflow and hook changes: the speckit.hooks.<key> gate settings read by .skilled/scripts/git-hooks/lib/gate-config.sh from lib/gates.tsv, .sk-git/ rule overrides edited by .skilled/commands/doctor/scripts/git-standards.cjs, and the earlier hook hardening in specs/sk-git/032-template-driven-message-enforcement and its children 001-003 (commits e5b1ea84c7, 9c99983374, d1fe481584, f7316afc6a). Compare against what the v4.0.0.3 entry already says, separate missing items from items it states wrongly or that later work made stale (for example references to /doctor:rebuild or /doctor:speckit), and cite a commit, file or spec for each item. Research only; do not edit the changelog."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 41
- **By category**: READMEs=2, Documents=6, Commands=7, Agents=0, Skills=6, Specs=19, Scripts=1, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 011-changelog-v4003-research
- **Generated**: 2026-10-04T08:35:41.035Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/changelog/skilled/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/scripts/git-hooks/README.md | Cited | OK | Citations=2; Iterations=2 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/changelog/skilled/v4.0.0.0.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.1.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.2.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/changelog/skilled/v4.0.0.3.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/scripts/git-hooks/lib/gates.tsv | Cited | OK | Citations=3; Iterations=3 |
| .skilled/scripts/git-hooks/pre-commit | Cited | OK | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/doctor/_routes.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/git.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/mcp.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/release-update.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/tests/run-all.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/skill-advisor.md | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-changelog/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md | Cited | OK | Citations=3; Iterations=3 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/cli-jev/003-cli-jev-workflow-integration/010-trigger-index-search-fixes/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-git/032-template-driven-message-enforcement/001-git-hook-review-fixes/implementation-summary.md | Cited | OK | Citations=2; Iterations=2 |
| specs/sk-git/032-template-driven-message-enforcement/003-hook-docs-and-standards-alignment/implementation-summary.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-speckit/049-doctor-audit-followups/001-trigger-index-freshness/acceptance-criteria.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/049-doctor-audit-followups/001-trigger-index-freshness/implementation-summary.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-speckit/049-doctor-audit-followups/001-trigger-index-freshness/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/049-doctor-audit-followups/001-trigger-index-freshness/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/049-doctor-audit-followups/002-release-update-customization-signals/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/049-doctor-audit-followups/003-doctor-gates-and-drift/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/049-doctor-audit-followups/004-doctor-scripts-conformance/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/049-doctor-audit-followups/005-doctor-update-research/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/049-doctor-audit-followups/006-doctor-update-fixes/implementation-summary.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-speckit/049-doctor-audit-followups/007-speckit-router-contract-drift/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/049-doctor-audit-followups/008-doctor-ownership-split/implementation-summary.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-speckit/049-doctor-audit-followups/009-doctor-git/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/049-doctor-audit-followups/010-doctor-router-gates/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/049-doctor-audit-followups/011-changelog-v4003-research/research/deep-research-strategy.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/049-doctor-audit-followups/011-changelog-v4003-research/research/deltas/iter-001.jsonl | Cited | OK | Citations=1; Iterations=1 |
| specs/system-speckit/049-doctor-audit-followups/spec.md | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/scripts/git-hooks/lib/gate-config.sh | Cited | OK | Citations=3; Iterations=3 |

---
