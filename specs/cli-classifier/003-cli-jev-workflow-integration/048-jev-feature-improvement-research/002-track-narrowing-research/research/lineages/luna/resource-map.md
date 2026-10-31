---
title: "Resource Map — Improve, refine and expand the Jev spec-track narrowing (cli-jev feature 017). Its scorer is .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs in system-spec-kit, and it measures Gate 1 retrieval, where ripgrep and the committed trigger-index lookup find which specs/<track>/ a request belongs to. Measured result: verdict jev: keep K=256 M=256 A=97 B=68 W=78 L=49 F=47 p=0.006330, p50 330 ms, p95 391 ms. Real data. Jev names the right track more often than ripgrep, but both are right on well under half of the 256 questions. Answer five questions with file:line evidence: what drove this result, how to raise its accuracy or lower its cost, how to make the measurement more trustworthy, where else in .skilled the same judgment would pay off, and what a default-on integration would need, cost and risk."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 11
- **By category**: READMEs=0, Documents=0, Commands=0, Agents=0, Skills=6, Specs=5, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 002-track-narrowing-research
- **Generated**: 2026-10-02T23:09:05.523Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/system-skill-advisor/ARCHITECTURE.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs | Cited | OK | Citations=3; Iterations=3 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/calls.jsonl | Cited | OK | Citations=2; Iterations=2 |
| specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/out/report.json | Cited | OK | Citations=3; Iterations=3 |
| specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/runs/jev-live-1/stdout.txt | Cited | OK | Citations=2; Iterations=2 |
| specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md | Cited | OK | Citations=3; Iterations=3 |

---

---

## Lineage Delta Sources

| Lineage | Delta |
|---------|-------|
| root | deltas/iter-001.jsonl |
| root | deltas/iter-002.jsonl |
| root | deltas/iter-003.jsonl |
