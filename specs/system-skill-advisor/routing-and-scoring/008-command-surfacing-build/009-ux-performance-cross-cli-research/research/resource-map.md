---
title: "Resource Map — Find further improvements to command surfacing after the planned phases 005 to 008: better UX for the person and the model (what the hook brief says, when a command is offered, asked or started, the install and setup path for an external repository), better performance (hook time, embedder cost, cold start, token cost of the brief) and above all usefulness across the six CLIs (claude, codex, opencode, pi, devin, dsh): whether a model on each runtime actually starts an offered command, and what stops it. EVIDENCE TO READ FIRST (P = specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build): P/spec.md, P/decision-record.md, P/goal.md, and plan.md + tasks.md of children P/005-recommendation-contract-and-brief, P/006-gate-2-binding-and-runtime-pointers, P/007-per-runtime-behaviour-proof, P/008-embedder-setup-and-cost. Phases 005-008 are PLANNED, not built: do not re-recommend anything they already plan; recommend only what comes after or what they miss. Before-arm behaviour log P/007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl (still growing, six runtimes), scored with: node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs --summary <that file> (baseline 2026-11-12: claude start 3/12, codex 0/12, pi 0/12, devin 2/11, opencode 3/7, dsh 2/7; COMMAND: line 0 on every runtime). P/007-per-runtime-behaviour-proof/scratch/g5/result.txt: a command file named skill.md makes Claude Code list the whole create folder as one Skill entry, hiding every sibling command. Embedder cost: P/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt and node .skilled/skills/system-skill-advisor/runtime/scripts/measure-embedder-cost.mjs. OUTPUT RULE: every recommendation names the exact file it changes, the measurable gain, and how to verify it. HARD RULES: NEVER read or print rows of command-prompts.jsonl (or any corpus file) whose split is holdout; read-only git only; do not run pi, do not start/stop/reconfigure ollama, do not kill any process; do not run the full vitest suite; write only inside your lineage directory."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 166
- **By category**: READMEs=4, Documents=11, Commands=18, Agents=0, Skills=52, Specs=53, Scripts=18, Tests=0, Config=7, Meta=3
- **Missing on disk**: 17
- **Scope**: research convergence output for 009-ux-performance-cross-cli-research
- **Generated**: 2026-11-13T06:27:42.629Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .codex/README.md | Cited | OK | Citations=2; Iterations=2 |
| .dsh/plugins/repo-guards/README.md | Cited | OK | Citations=1; Iterations=1 |
| .pi/extensions/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/shared/session-readers/README.md | Cited | OK | Citations=1; Iterations=1 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/commands/create | Cited | OK | Citations=1; Iterations=1 |
| .claude/commands/create/skill.md | Cited | OK | Citations=2; Iterations=2 |
| .claude/skills | Cited | OK | Citations=1; Iterations=1 |
| .codex/prompts/create-readme.md | Cited | OK | Citations=1; Iterations=1 |
| .dsh/prompts/create-readme.md | Cited | OK | Citations=1; Iterations=1 |
| .pi/prompts/create-readme.md | Cited | OK | Citations=1; Iterations=1 |
| /Users/michelkerkmeester/.claude/projects/-private-var-folders-3c-zfqcqsts0kn19cgblj82gqhm0000gn-T-skilled-behaviour-arenas-post-claude/5e8cf2c1-d314-46db-a861-f38c71ddce6a.jsonl | Cited | OK | Citations=1; Iterations=1 |
| $TMPDIR/speckit-skill-advisor-metrics | Cited | MISSING | Citations=1; Iterations=1 |
| INSTALL-SKILLED.md | Cited | OK | Citations=4; Iterations=4 |
| node -e 0 x15 median 36.85ms | Cited | MISSING | Citations=1; Iterations=1 |
| steer.md | Cited | MISSING | Citations=3; Iterations=3 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/create/skill.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/deep/research.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/_routes.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/assets/agents-md-manifest.json | Cited | OK | Citations=3; Iterations=3 |
| .skilled/commands/doctor/assets/doctor-agents-md-embed.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/assets/doctor-setup.yaml | Cited | OK | Citations=4; Iterations=4 |
| .skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-symlink-check.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/symlink-manifest.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/overlay.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/agents-md-check.cjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/commands/doctor/scripts/agents-md-embed.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/scripts/codex-hook-approval-check.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/scripts/doctor-helper-match.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/symlink-engine.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/speckit/handoff.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/speckit/save.md | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-doc/command-metadata.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/hub-router.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/hub-router.json | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/changelog/v0.3.0.0.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/INSTALL-GUIDE.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/handlers/advisor-validate.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/runtime/lib/embedders/registry.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:319,487 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/policy-plan.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/prompt-cache.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/lib/render.ts | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-skill-advisor/runtime/lib/render.ts:100,162,557 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/schemas/compat-contract.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/measure-embedder-cost.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/command-scope.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/shared.js | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/user-prompt-submit.js | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/devin/user-prompt-submit.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:125-149,343 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/shared/embeddings/auto-select.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/shared/embeddings/registry.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/011-observation-fixes/evidence/goal-reverify/reports/pi-433.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/003-plain-chat-command-reach/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/004-command-meaning-matching/scratch/hook-latency-after-3.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/005-recommendation-contract-and-brief/plan.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers/scratch/bullet-draft.txt | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers/spec.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers/tasks.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/plan.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/g5/listing-a.txt | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/g5/listing-b.txt | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/g5/result.txt | Cited | OK | Citations=4; Iterations=4 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-g2.jsonl | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-post-final.jsonl | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-pre-final.jsonl | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl | Cited | OK | Citations=4; Iterations=4 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/tasks.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/measured-2026-11-12.txt | Cited | OK | Citations=5; Iterations=5 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/real-embedding-after.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/spec.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/spec.md:130,174 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-2/iterations/iteration-002.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-2/iterations/iteration-003.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-2/iterations/iteration-004.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-3/iterations/iteration-002.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-3/scratch/degraded-parity.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-3/scratch/render-entries.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-3/scratch/render-parity.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-3/scratch/repeat-parity.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/degraded-readme.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/embedder-cost.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/real-embed-capture.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/tune-live.jsonl | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/ux/steer.md | Cited | OK | Citations=5; Iterations=5 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-2.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/010-reachability-and-attribution/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/011-typed-command-delivery-and-guards/scratch/brief-cost.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/011-typed-command-delivery-and-guards/scratch/hook-health.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/011-typed-command-delivery-and-guards/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/012-plain-offer-reach/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/012-plain-offer-reach/scratch/floorcheck.sh | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/012-plain-offer-reach/scratch/live-heads.txt | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach/implementation-summary.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach/scratch/after.txt | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach/scratch/planning/probe-opencode-brief.mjs | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach/scratch/runs-post-attributed.jsonl | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach/scratch/summary-post-after.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/013-attribution-and-install-reach/scratch/summary-post-before.json | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/decision-record.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md | Cited | OK | Citations=3; Iterations=3 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .dsh/plugins/repo-guards/adapters/prompt-advisor.mjs | Cited | OK | Citations=2; Iterations=2 |
| .dsh/plugins/repo-guards/index.mjs | Cited | OK | Citations=2; Iterations=2 |
| .opencode/plugins/lib/skill-advisor-render.js | Cited | OK | Citations=1; Iterations=1 |
| .opencode/plugins/system-skill-advisor.js | Cited | OK | Citations=4; Iterations=4 |
| .pi/extensions/prompt-advisor.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/compiled-route.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/system-skill-advisor-launcher.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/shared/session-readers/codex.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/shared/session-readers/devin.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/shared/session-readers/dsh.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/shared/session-readers/index.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/shared/session-readers/opencode.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/shared/session-readers/pi.mjs | Cited | OK | Citations=1; Iterations=1 |
| scratch/brief-ab.mjs | Cited | MISSING | Citations=1; Iterations=1 |
| scratch/diagnostic-write-cost.mjs | Cited | MISSING | Citations=1; Iterations=1 |
| scratch/hook-health-cost.mjs | Cited | MISSING | Citations=1; Iterations=1 |
| scratch/hook-latency-paired.mjs | Cited | MISSING | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/settings.json | Cited | OK | Citations=1; Iterations=1 |
| .codex/config.toml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/fixtures/canary-cases.v1.json | Cited | OK | Citations=1; Iterations=1 |
| ~/.codex/config.toml | Cited | MISSING | Citations=2; Iterations=2 |
| scratch/brief-cost-head.json | Cited | MISSING | Citations=1; Iterations=1 |
| scratch/embedder-cost-head.json | Cited | MISSING | Citations=1; Iterations=1 |
| scratch/live-brief-cost.json | Cited | MISSING | Citations=1; Iterations=1 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| /private/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/skilled-behaviour-arenas/post-claude/CLAUDE.md | Cited | MISSING | Citations=1; Iterations=1 |
| ~/.claude/CLAUDE.md | Cited | MISSING | Citations=2; Iterations=2 |
| AGENTS.md | Cited | OK | Citations=4; Iterations=4 |

---

---

## Lineage Delta Sources

| Lineage | Delta |
|---------|-------|
| cross-cli | lineages/cross-cli/deltas/iter-001.jsonl |
| cross-cli | lineages/cross-cli/deltas/iter-002.jsonl |
| cross-cli | lineages/cross-cli/deltas/iter-003.jsonl |
| cross-cli-2 | lineages/cross-cli-2/deltas/iter-001.jsonl |
| cross-cli-2 | lineages/cross-cli-2/deltas/iter-002.jsonl |
| cross-cli-2 | lineages/cross-cli-2/deltas/iter-003.jsonl |
| cross-cli-2 | lineages/cross-cli-2/deltas/iter-004.jsonl |
| cross-cli-3 | lineages/cross-cli-3/deltas/iter-001.jsonl |
| cross-cli-3 | lineages/cross-cli-3/deltas/iter-002.jsonl |
| cross-cli-3 | lineages/cross-cli-3/deltas/iter-003.jsonl |
| cross-cli-3 | lineages/cross-cli-3/deltas/iter-004.jsonl |
| cross-cli-3 | lineages/cross-cli-3/deltas/iter-005.jsonl |
| cross-cli-3 | lineages/cross-cli-3/deltas/iter-006.jsonl |
| offer-reach | lineages/offer-reach/deltas/iter-001.jsonl |
| offer-reach | lineages/offer-reach/deltas/iter-002.jsonl |
| offer-reach | lineages/offer-reach/deltas/iter-003.jsonl |
| offer-reach | lineages/offer-reach/deltas/iter-004.jsonl |
| offer-reach-3 | lineages/offer-reach-3/deltas/iter-001.jsonl |
| offer-reach-3 | lineages/offer-reach-3/deltas/iter-002.jsonl |
| offer-reach-3 | lineages/offer-reach-3/deltas/iter-003.jsonl |
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
| ux-cost-2 | lineages/ux-cost-2/deltas/iter-001.jsonl |
| ux-cost-2 | lineages/ux-cost-2/deltas/iter-002.jsonl |
| ux-cost-2 | lineages/ux-cost-2/deltas/iter-003.jsonl |
| ux-cost-3 | lineages/ux-cost-3/deltas/iter-001.jsonl |
| ux-cost-3 | lineages/ux-cost-3/deltas/iter-002.jsonl |
