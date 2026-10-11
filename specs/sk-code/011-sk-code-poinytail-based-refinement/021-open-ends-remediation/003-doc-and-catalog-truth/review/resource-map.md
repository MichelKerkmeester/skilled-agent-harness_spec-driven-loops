---
title: "Resource Map — The ten commits on worktrees/114-rem-doc-catalog-truth since 0039903bde: the frontmatter-version engine, packager and post-edit router now treat only SKILL.md as a versioned doc; the version line was dropped from 2,845 child docs; the versioning standard and templates were rewritten; the catalog validator checks two-column File tables; the citation scanner resolves skill runtime/ and scripts/ paths and prints an overlap advisory; the playbook validator reports unresolved backticked paths and keeps its whole report when piped; stale anchors and paths in playbooks and catalogs were corrected; five skills were bumped"
description: "Auto-generated review resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 21
- **By category**: READMEs=1, Documents=14, Commands=0, Agents=0, Skills=3, Specs=2, Scripts=1, Tests=0, Config=0, Meta=0
- **Missing on disk**: 14
- **Scope**: review convergence output for 003-doc-and-catalog-truth
- **Generated**: 2026-10-11T20:29:46.242Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/hooks/post-edit-quality/README.md | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| dim-correctness-5 | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=2 |
| dim-maintainability-4 | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=2 |
| dim-traceability-3 | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=2 |
| file-frontmatter-version-engine | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| file-frontmatter-versioning | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| file-goal-claims | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| file-goal-md | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| file-impl-summary | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| file-post-edit-router | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| finding-R3-P1-001 | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=4 |
| finding-R3-P2-001 | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| inv-bump-per-touched-skill | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| invariant-skill-md-only | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |
| test-root-name-consumer-matrix | Validated | MISSING | Findings P0=0 P1=0 P2=0; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs | Analyzed | OK | Findings P0=0 P1=0 P2=2; Iterations=2 |
| .skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md | Analyzed | OK | Findings P0=0 P1=0 P2=2; Iterations=2 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/goal.md | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=2 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/implementation-summary.md | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |

---
