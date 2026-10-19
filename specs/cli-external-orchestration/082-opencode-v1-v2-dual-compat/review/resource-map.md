---
title: "Resource Map — specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat"
description: "Auto-generated review resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 11
- **By category**: READMEs=0, Documents=0, Commands=0, Agents=0, Skills=1, Specs=3, Scripts=5, Tests=1, Config=1, Meta=0
- **Missing on disk**: 0
- **Scope**: review convergence output for 082-opencode-v1-v2-dual-compat
- **Generated**: 2026-10-19T07:02:17.226Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/001-unknowns-and-baseline/acceptance-criteria.md | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/011-two-version-proof-and-closeout/acceptance-criteria.md | Analyzed | OK | Findings P0=0 P1=1 P2=0; Iterations=1 |
| specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/011-two-version-proof-and-closeout/proof.md | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/plugins/cli-dispatch-audit.js | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .opencode/plugins/lib/v2-bridge.js | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/hooks/dispatch/lib/dispatch-audit.mjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |
| .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs | Analyzed | OK | Findings P0=0 P1=0 P2=2; Iterations=2 |
| .skilled/hooks/dispatch/lib/opencode-version.mjs | Analyzed | OK | Findings P0=0 P1=0 P2=2; Iterations=1 |

---

## 8. Tests

> Test files, fixtures, and snapshots. Tests take precedence over `Scripts`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/tests/opencode-config-shape.test.cjs | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .github/workflows/opencode-dual-version.yml | Analyzed | OK | Findings P0=0 P1=0 P2=1; Iterations=1 |

---
