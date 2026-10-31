---
title: "Resource Map — Improve, refine and expand the Jev citation drift scan (cli-jev feature 032). Its scorer is .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs in sk-doc, and it measures sk-doc document validation, which resolves path:line citations in tracked skill docs and reports dead ones with zero calls. Measured result: verdict jev: keep K=40 M=40 A=35 B=13 W=22 L=0 TP=26 FP=0 F=3 p=2.384e-7. Real data on a small sample of 40. Jev judges whether a live citation still supports its claim, which the zero-call check cannot. Answer five questions with file:line evidence: what drove this result, how to raise its accuracy or lower its cost, how to make the measurement more trustworthy, where else in .skilled the same judgment would pay off, and what a default-on integration would need, cost and risk."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 11
- **By category**: READMEs=0, Documents=0, Commands=0, Agents=0, Skills=8, Specs=3, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 9
- **Scope**: research convergence output for 003-citation-drift-research
- **Generated**: 2026-10-02T22:48:43.366Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-doc/feature-catalog/document-validation/citation-drift-scan.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-doc/feature-catalog/document-validation/goal-criteria-lint.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:75-76,82,954-1005,1008-1036,1047-1071,1081-1105,1127-1139,1177-1188,1261-1263,1336-1363 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:82,607-630,674-707,1009-1014,1157-1174 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:314-344,371-419,422-479,574-585,748-767,1008-1139,1177-1188 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs@177c0fbd703b:82,1304-1319 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/references/validation/validation-rules.md:95,99-103 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh:438-457,567-589 | Cited | MISSING | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/goal.md:44,90,119,122 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/goal.md:55,122 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/goal.md:90,119,122 | Cited | MISSING | Citations=1; Iterations=1 |

---
