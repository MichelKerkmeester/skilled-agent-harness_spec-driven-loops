---
title: "Resource Map — SEGMENT TWO offer-reach lane: find the next improvements to command surfacing now that phases 005, 006, 008 and 010 are built and committed and phase 011 (typed command delivery 44 of 44, policy on hub-attached commands, visibility guard, hook health, brief cost script) is being built, without re-recommending what those phases built or plan. Explain and improve the measured offer bottleneck: the expected command was offered on only 3 of the 16 plain tune rows, /doctor:helper on 2 more and nothing on 11, while a command that was offered was usually taken; plain recall on the tune split is 9 of 45 on phrases and 14 of 45 with the real embedder. Lane label offer-reach covers hub mode vocabulary and deferral (/deep:review and /deep:research defer, so three runtimes improvise), a default command for a hub that defers, semantic lane weight and embedding text, the doctor family, and scoring thresholds, while false offers stay 0 of 35 and typed recall stays at least 24 of 44 and the scorer floors stay [159,50,20,5]."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 20
- **By category**: READMEs=0, Documents=0, Commands=2, Agents=0, Skills=12, Specs=3, Scripts=2, Tests=0, Config=1, Meta=0
- **Missing on disk**: 0
- **Scope**: research convergence output for 009-ux-performance-cross-cli-research
- **Generated**: 2026-11-13T03:26:45.374Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/doctor/_routes.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/doctor-helper-match.cjs | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-doc/hub-router.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/hub-router.json | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/lib/render.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json | Cited | OK | Citations=2; Iterations=2 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/003-plain-chat-command-reach/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-post-final.jsonl | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/real-embedding-after.json | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/compiled-route.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs | Cited | OK | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/fixtures/canary-cases.v1.json | Cited | OK | Citations=1; Iterations=1 |

---
