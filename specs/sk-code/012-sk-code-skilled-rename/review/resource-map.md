---
title: "Resource Map — Double-check the staged (uncommitted) rename in this worktree of sk-code-opencode to sk-code-skilled, code-opencode to code-skilled, and the sk-code surface id OPENCODE to SKILLED. Verify against `git diff --cached HEAD`: (1) no OpenCode runtime name was rewritten (.opencode/, cli-opencode, the opencode binary, the runtime id OPENCODE outside the sk-code hub); (2) no live reference to the old identity remains outside the documented exclusions (this packet's docs, .jsonl/.out/.err/.log machine records in specs/, benchmark JSON reports, OPENCODE in spec history); (3) hub routing (mode-registry.json, hub-router.json, graph-metadata.json, leaf-manifest.json, SKILL.md, ROUTER.md), the advisor plugin surface detection, doctor pins, tests and fixtures are mutually consistent; (4) renamed spec folders have consistent description.json/graph-metadata.json identity and no broken relative links; (5) the changelog symlink and hermes mirror are correct. Report P0/P1/P2 findings with path:line evidence."
description: "Auto-generated review resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 4
- **By category**: READMEs=0, Documents=0, Commands=0, Agents=0, Skills=2, Specs=2, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: review convergence output for 012-sk-code-skilled-rename
- **Generated**: 2026-10-18T20:28:48.013Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/001-shared-and-hub-docs/scratch/dispatch-units-extra.json | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| specs/sk-code/012-sk-code-skilled-rename/002-skill-and-routing-rename/implementation-summary.md | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |

---
