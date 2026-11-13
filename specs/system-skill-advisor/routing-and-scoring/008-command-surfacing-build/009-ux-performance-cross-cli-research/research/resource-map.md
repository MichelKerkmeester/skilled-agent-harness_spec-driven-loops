---
title: "Resource Map — Find further improvements to command surfacing after the planned phases 005 to 008: better UX for the person and the model (what the hook brief says, when a command is offered, asked or started, the install and setup path for an external repository), better performance (hook time, embedder cost, cold start, token cost of the brief) and above all usefulness across the six CLIs (claude, codex, opencode, pi, devin, dsh): whether a model on each runtime actually starts an offered command, and what stops it. EVIDENCE TO READ FIRST (P = specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build): P/spec.md, P/decision-record.md, P/goal.md, and plan.md + tasks.md of children P/005-recommendation-contract-and-brief, P/006-gate-2-binding-and-runtime-pointers, P/007-per-runtime-behaviour-proof, P/008-embedder-setup-and-cost. Phases 005-008 are PLANNED, not built: do not re-recommend anything they already plan; recommend only what comes after or what they miss. Before-arm behaviour log P/007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl (still growing, six runtimes), scored with: node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs --summary <that file> (baseline 2026-11-12: claude start 3/12, codex 0/12, pi 0/12, devin 2/11, opencode 3/7, dsh 2/7; COMMAND: line 0 on every runtime). P/007-per-runtime-behaviour-proof/scratch/g5/result.txt: a command file named skill.md makes Claude Code list the whole create folder as one Skill entry, hiding every sibling command. Embedder cost: P/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt and node .skilled/skills/system-skill-advisor/runtime/scripts/measure-embedder-cost.mjs. OUTPUT RULE: every recommendation names the exact file it changes, the measurable gain, and how to verify it. HARD RULES: NEVER read or print rows of command-prompts.jsonl (or any corpus file) whose split is holdout; read-only git only; do not run pi, do not start/stop/reconfigure ollama, do not kill any process; do not run the full vitest suite; write only inside your lineage directory."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 73
- **By category**: READMEs=3, Documents=7, Commands=8, Agents=0, Skills=28, Specs=18, Scripts=5, Tests=0, Config=3, Meta=1
- **Missing on disk**: 7
- **Scope**: research convergence output for 009-ux-performance-cross-cli-research
- **Generated**: 2026-11-12T23:17:49.989Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .codex/README.md | Cited | OK | Citations=2; Iterations=2 |
| .dsh/plugins/repo-guards/README.md | Cited | OK | Citations=1; Iterations=1 |
| .pi/extensions/README.md | Cited | OK | Citations=1; Iterations=1 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/commands/create/skill.md | Cited | OK | Citations=2; Iterations=2 |
| .codex/prompts/create-readme.md | Cited | OK | Citations=1; Iterations=1 |
| .dsh/prompts/create-readme.md | Cited | OK | Citations=1; Iterations=1 |
| .pi/prompts/create-readme.md | Cited | OK | Citations=1; Iterations=1 |
| INSTALL-SKILLED.md | Cited | OK | Citations=2; Iterations=2 |
| node -e 0 x15 median 36.85ms | Cited | MISSING | Citations=1; Iterations=1 |
| steer.md | Cited | MISSING | Citations=3; Iterations=3 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/create/skill.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/deep/research.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/_routes.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-setup.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/overlay.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/symlink-engine.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/speckit/handoff.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/speckit/save.md | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-doc/command-metadata.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/INSTALL-GUIDE.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/handlers/advisor-validate.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/embedders/registry.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:319,487 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/prompt-cache.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/lib/render.ts | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-skill-advisor/runtime/lib/render.ts:100,162,557 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/shared.js | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/user-prompt-submit.js | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/devin/user-prompt-submit.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:125-149,343 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/shared/embeddings/auto-select.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/shared/embeddings/registry.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/011-observation-fixes/evidence/goal-reverify/reports/pi-433.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/004-command-meaning-matching/scratch/hook-latency-after-3.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/005-recommendation-contract-and-brief/plan.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers/scratch/bullet-draft.txt | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers/spec.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers/tasks.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/plan.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/g5/listing-a.txt | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/g5/listing-b.txt | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/g5/result.txt | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl | Cited | OK | Citations=4; Iterations=4 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/tasks.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt | Cited | OK | Citations=4; Iterations=4 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/spec.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/spec.md:130,174 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/ux/steer.md | Cited | OK | Citations=5; Iterations=5 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .dsh/plugins/repo-guards/adapters/prompt-advisor.mjs | Cited | OK | Citations=2; Iterations=2 |
| .dsh/plugins/repo-guards/index.mjs | Cited | OK | Citations=2; Iterations=2 |
| .pi/extensions/prompt-advisor.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/system-skill-advisor-launcher.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/shared/session-readers/index.mjs | Cited | OK | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/settings.json | Cited | OK | Citations=1; Iterations=1 |
| .codex/config.toml | Cited | OK | Citations=2; Iterations=2 |
| ~/.codex/config.toml | Cited | MISSING | Citations=2; Iterations=2 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| AGENTS.md | Cited | OK | Citations=1; Iterations=1 |

---

---

## Lineage Delta Sources

| Lineage | Delta |
|---------|-------|
| cross-cli | lineages/cross-cli/deltas/iter-001.jsonl |
| cross-cli | lineages/cross-cli/deltas/iter-002.jsonl |
| cross-cli | lineages/cross-cli/deltas/iter-003.jsonl |
| performance | lineages/performance/deltas/iter-001.jsonl |
| performance | lineages/performance/deltas/iter-002.jsonl |
| performance | lineages/performance/deltas/iter-003.jsonl |
| performance | lineages/performance/deltas/iter-004.jsonl |
| performance | lineages/performance/deltas/iter-005.jsonl |
| ux | lineages/ux/deltas/iter-001.jsonl |
| ux | lineages/ux/deltas/iter-002.jsonl |
| ux | lineages/ux/deltas/iter-003.jsonl |
| ux | lineages/ux/deltas/iter-004.jsonl |
| ux | lineages/ux/deltas/iter-005.jsonl |
