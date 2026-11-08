---
title: "Resource Map — Audit whether the CI red-check repair work on main is fully and correctly documented. Commits in scope: 190b103dd8 (history-locator test state dir), 509c2d707c (snake_case guard exempts research_archive), 8da131af09 (OpenCode version battery names a v1 command by its frontmatter name), 95f704cfc0 (19 workflows skip the onnxruntime CUDA download), cdd3c27db4 (leaf-aliases regen), 9932b52352 (mcp-tooling drops the isolated chrome routing phrase), 67fc950028 (sk-code drift guard skips TS module header on compiler-emitted .d.ts), a65d573299 (track roots count a numbered folder as a packet only with spec.md), b8d66a38f7 (gitignore coverage-graph-db), 478cdec696 (links repointed after the specs/hooks -> specs/hooks-plugins-extensions track rename). For each change find every doc that describes the touched behavior (skill SKILL.md, READMEs, references, feature catalogs, manual testing playbooks, skill changelogs, the release notes .skilled/changelog/skilled/v4.0.2.0.md, root README.md, INSTALL-SKILLED.md, AGENTS.md/CLAUDE.md) and report what is missing, stale or misaligned, with file:line. Also sweep for remaining stale references to specs/hooks/ and SETUP.md. Known already: no changelog entries for these fixes; track-root-children-lists.md §2 and runtime/cli/spec/README.md rows lack the spec.md rule; filesystem-naming-convention.md §3 omits research_archive; session-relaunch README lines 25-30 link the old hooks path; system-skilled-doctor changelog v1.1.1.0 names SETUP.md. Find anything beyond these. Read-only outside the spec folder; never open any .env file or anything under barter/."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 47
- **By category**: READMEs=1, Documents=3, Commands=2, Agents=0, Skills=38, Specs=2, Scripts=0, Tests=0, Config=1, Meta=0
- **Missing on disk**: 1
- **Scope**: research convergence output for 016-ci-red-check-repairs
- **Generated**: 2026-11-08T17:07:51.412Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/hooks/session-relaunch/README.md | Cited | OK | Citations=2; Iterations=2 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .gitignore | Cited | OK | Citations=2; Iterations=2 |
| .skilled/changelog/skilled/v4.0.2.0.md | Cited | OK | Citations=4; Iterations=4 |
| Command evidence: git merge-base --is-ancestor for the ten commits; git rev-list --count v4.0.2.0..HEAD = 60 | Cited | MISSING | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/doctor/ci.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/README.markdown | Cited | OK | Citations=2; Iterations=2 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/cli-external-orchestration/cli-cursor/benchmark/reports/2026-07-29--manual-testing-playbook--goal-hook/source.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/mcp-tooling/changelog/v1.9.7.0.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/mcp-tooling/description.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/mcp-tooling/hub-router.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/mcp-tooling/manual-testing-playbook/manual-testing-playbook.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/mcp-tooling/mcp-aside-devtools/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/mcp-tooling/mcp-chrome-devtools/assets/utcp-chrome-devtools-manuals.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/mcp-tooling/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/mcp-tooling/ROUTER.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/sk-code-skilled/assets/checklists/typescript-checklist.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/formatting-imports-and-coexistence.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/overview-strict-and-naming.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/changelog/v2.3.22.0.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/leaf-aliases.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/shared/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/shared/references/filesystem-naming-convention.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-doc/shared/scripts/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/sk-create-changelog/changelog/v1.4.3.0.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/release-line/extend-open-release.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-changelog/SKILL.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skilled-doctor/changelog/v1.1.1.0.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skilled-doctor/leaf-aliases.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/track-root-children-lists.md | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/references/structure/folder-structure.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/runtime/cli/lib/README.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/README.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/runtime/tests/history-locator.vitest.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/hooks-plugins-extensions/023-session-relaunch-loop/011-post-fix-remediation/goal.md | Cited | OK | Citations=2; Iterations=2 |
| specs/hooks-plugins-extensions/023-session-relaunch-loop/034-default-off-opt-in/goal.md | Cited | OK | Citations=2; Iterations=2 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows/opencode-plugin-tests.yml | Cited | OK | Citations=1; Iterations=1 |

---
