---
title: "Resource Map — DECISION RESEARCH: Decide the best next move for the compiled-routing subsystem from the supplied verified state."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 24
- **By category**: READMEs=2, Documents=6, Commands=0, Agents=0, Skills=2, Specs=4, Scripts=7, Tests=1, Config=2, Meta=0
- **Missing on disk**: 6
- **Scope**: research convergence output for 020-compiled-routing-next-move
- **Generated**: 2026-07-27T03:49:06.221Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows/README.md | Cited | OK | Citations=2; Iterations=2 |
| .opencode/hooks/README.md | Cited | OK | Citations=1; Iterations=1 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| command: cmp authored/runtime manifests for seven hubs | Cited | MISSING | Citations=1; Iterations=1 |
| command: direct authored/runtime resolveRoute comparison | Cited | MISSING | Citations=1; Iterations=1 |
| command: git ls-files .opencode/bin/compiled-route-sync.cjs .opencode/bin/lib/compiled-routing | Cited | MISSING | Citations=1; Iterations=1 |
| command: git show 19b87f67a1 -- .opencode/bin/compiled-route-sync.cjs \| rg -n -C 10 "rmSync/(RUNTIME_ROOT" | Cited | MISSING | Citations=1; Iterations=1 |
| command: node .opencode/bin/compiled-route-guard.cjs --json | Cited | MISSING | Citations=3; Iterations=3 |
| command: node .opencode/bin/compiled-route-sync.cjs --verify | Cited | MISSING | Citations=1; Iterations=1 |

---

## 5. Skills

> `.opencode/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `mcp-server/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/skills/cli-external-orchestration/mode-registry.json | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skills/sk-design/mode-registry.json | Cited | OK | Citations=2; Iterations=2 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs | Cited | OK | Citations=2; Iterations=2 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/006-sk-design/harness/build-artifacts.cjs | Cited | OK | Citations=1; Iterations=1 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/006-sk-design/lib/registry-compiler.cjs | Cited | OK | Citations=2; Iterations=2 |
| .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-003.md | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/bin/check-git-hooks.sh | Cited | OK | Citations=1; Iterations=1 |
| .opencode/bin/compiled-route-guard.cjs | Cited | OK | Citations=3; Iterations=3 |
| .opencode/bin/compiled-route-sync.cjs | Cited | OK | Citations=3; Iterations=3 |
| .opencode/bin/lib/compiled-route-manifest.cjs | Cited | OK | Citations=2; Iterations=2 |
| .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs | Cited | OK | Citations=1; Iterations=1 |
| .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs | Cited | OK | Citations=1; Iterations=1 |
| .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs | Cited | OK | Citations=1; Iterations=1 |

---

## 8. Tests

> Test files, fixtures, and snapshots. Tests take precedence over `Scripts`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/bin/tests/compiled-route-manifest.test.cjs | Cited | OK | Citations=2; Iterations=2 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows/routing-registry-drift.yml | Cited | OK | Citations=2; Iterations=2 |
| .github/workflows/runtime-no-spec-import.yml | Cited | OK | Citations=2; Iterations=2 |

---
