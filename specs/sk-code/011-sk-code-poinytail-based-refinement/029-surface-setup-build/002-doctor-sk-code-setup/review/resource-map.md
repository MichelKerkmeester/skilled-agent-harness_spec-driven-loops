---
title: "Resource Map — commit 79f5dacc52 on origin/main (diff 49cfd5c89f..79f5dacc52), merged in c5b3bd9355: a new read-only /doctor:sk-code command with one target, setup. sk-code-setup-check.cjs runs eight legs from the repository root (provisioning precheck via require.resolve of @spec-kit/shared, parent-skill-check on sk-code, ci-skill-root-metadata, compiled-route-guard --json, compiled-route-sync --check, the sk-code drift guards, ci-skill-derived-freshness --format json, and a compiled-route probe that passes only on a parsed action route), prints one repair line per failing leg, skips the two provision-dependent legs when the precheck fails, and writes nothing; a nine-case node:test suite drives it against stub roots; the command doc, its _routes.yaml route (mutating read-only), workflow YAML and presentation; the command-contract router list; index rows and one reference line each in the root README, the sk-code README and SKILL.md; regenerated runtime mirrors"
description: "Auto-generated review resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 3
- **By category**: READMEs=0, Documents=0, Commands=2, Agents=0, Skills=0, Specs=1, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: review convergence output for 002-doctor-sk-code-setup
- **Generated**: 2026-10-13T21:34:17.312Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/doctor/scripts/sk-code-setup-check.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=9; Iterations=4 |
| .skilled/commands/doctor/scripts/tests/sk-code-setup-check.test.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/sk-code/011-sk-code-poinytail-based-refinement/029-surface-setup-build/002-doctor-sk-code-setup/spec.md | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |

---
