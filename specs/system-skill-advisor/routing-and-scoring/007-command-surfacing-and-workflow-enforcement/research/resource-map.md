---
title: "Resource Map — How should the skill advisor surface slash commands (all 45 under .skilled/commands, not only /doctor) so a model either runs the matching command workflow by itself or asks the user first, and how does a request typed as plain chat with no slash command still reach the proper command workflow on every runtime? Work through the ten research angles in section 3 of specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/spec.md: inventory, scoring, output contract, run or ask, invocation mechanics, chat-only users, skill and command linkage, measurement, prior art, failure modes. Start from the advisor runtime in .skilled/skills/system-skill-advisor (command-bridges, scorer projection and fusion, render.ts), the commands tree, AGENTS.md gates 2 and 4, and the prior packets 003-doctor-command-surfacing and system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review. Cite path:line for every claim and name evidence that contradicts a recommendation as well as evidence that supports it."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 122
- **By category**: READMEs=6, Documents=14, Commands=30, Agents=1, Skills=53, Specs=16, Scripts=1, Tests=0, Config=0, Meta=1
- **Missing on disk**: 11
- **Scope**: research convergence output for 007-command-surfacing-and-workflow-enforcement
- **Generated**: 2026-11-12T10:34:10.085Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| .codex/README.md | Cited | OK | Citations=1; Iterations=1 |
| .cursor/README.md | Cited | OK | Citations=1; Iterations=1 |
| .devin/README.md | Cited | OK | Citations=1; Iterations=1 |
| .dsh/README.md | Cited | OK | Citations=2; Iterations=2 |
| .pi/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/skill-advisor/dsh/README.md | Cited | OK | Citations=1; Iterations=1 |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .claude/commands | Cited | OK | Citations=1; Iterations=1 |
| .codex/prompts | Cited | OK | Citations=1; Iterations=1 |
| .cursor/commands | Cited | OK | Citations=1; Iterations=1 |
| .cursor/rules/skill-routing.md | Cited | OK | Citations=2; Iterations=2 |
| .devin | Cited | OK | Citations=1; Iterations=1 |
| .devin/ | Cited | OK | Citations=1; Iterations=1 |
| .devin/SYNC.md | Cited | OK | Citations=1; Iterations=1 |
| .dsh/prompts | Cited | OK | Citations=1; Iterations=1 |
| .dsh/SYNC.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/commands | Cited | OK | Citations=1; Iterations=1 |
| .pi/prompts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands | Cited | OK | Citations=1; Iterations=1 |
| .skilled/repo-rules/blast-radius.md | Cited | OK | Citations=1; Iterations=1 |
| spec.md | Cited | MISSING | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/commands/create | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/create/agent.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/create/assets/create-skill-auto.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/create/README.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/create/skill.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/deep/assets/deep-research-auto.yaml | Cited | OK | Citations=3; Iterations=3 |
| .skilled/commands/deep/assets/deep-research-confirm.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/deep/research.md | Cited | OK | Citations=4; Iterations=4 |
| .skilled/commands/deep/review.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/design/diagram.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/design/extract.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/_routes.yaml | Cited | OK | Citations=5; Iterations=5 |
| .skilled/commands/doctor/assets/agents-md-manifest.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/git.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/install.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/mcp.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/tests/fixtures/sk-skill-check/hubs/hub-gap/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/setup.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/skill-advisor.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/update.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/local-skilled-alignment.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/prompt/improve.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/README.txt | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/speckit/assets/speckit-plan.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/speckit/complete.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/speckit/handoff.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/speckit/implement.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/speckit/plan.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/commands/speckit/save.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/speckit/search.md | Cited | OK | Citations=1; Iterations=1 |

---

## 4. Agents

> `.skilled/agents/**`, `.claude/agents/**`, `.skilled/agents/**`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/agents/deep-research.md | Cited | OK | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-design/command-metadata.json | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-doc/command-metadata.json | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-doc/mode-registry.json | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-git/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/command-metadata.json | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/system-deep-loop/deep-research/SKILL.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-deep-loop/mode-registry.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook-validation.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md | Cited | OK | Citations=5; Iterations=5 |
| .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:21-25,33-60 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/hooks/tests/dsh-prompt-advisor.test.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:75-84,303-314 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration-baseline.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/advisor-runtime-values.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/compat/contract.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/render.ts | Cited | OK | Citations=6; Iterations=6 |
| .skilled/skills/system-skill-advisor/runtime/lib/render.ts:97-100,185-191,517-563 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/allow-list.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json | Cited | OK | Citations=6; Iterations=6 |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs | Cited | OK | Citations=5; Iterations=5 |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md | Cited | OK | Citations=5; Iterations=5 |
| .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/ambiguity-prompts.jsonl | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/derive-ambiguity-slice.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/doctor-prompts.jsonl | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-routing-corpus.py | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/tests/command-binding-existence.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/command-bridge-resolution-guard.vitest.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/tests/command-bridges-drift-guard.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/command-metadata-e2e.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts:57-64,103-112 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/hooks/runtime-parity.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/prompt-policy-gold-replay.vitest.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/tests/scorer/typed-command-routing.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/tests/hook-adapter-path-parity.vitest.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/SKILL.md | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/system-skill-advisor/routing-and-scoring/003-doctor-command-surfacing/001-doctor-command-guidance/research/research.md | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skill-advisor/routing-and-scoring/003-doctor-command-surfacing/001-doctor-command-guidance/research/research.md:206,217-231 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-config.json | Cited | OK | Citations=9; Iterations=9 |
| specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-config.json:3-9,96 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-state.jsonl | Cited | OK | Citations=3; Iterations=3 |
| specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md | Cited | OK | Citations=8; Iterations=8 |
| specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:123-132,293-296 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:123-165,293-296 | Cited | MISSING | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/iterations/iteration-001.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/iterations/iteration-005.md | Cited | OK | Citations=2; Iterations=2 |
| specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/iterations/iteration-008.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/steer.md (absent) | Cited | MISSING | Citations=2; Iterations=2 |
| specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/opencode-deepseek/iterations/iteration-003.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/pi-deepseek/iterations/iteration-001.md | Cited | OK | Citations=1; Iterations=1 |
| specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/spec.md | Cited | OK | Citations=4; Iterations=4 |
| specs/system-spec-kit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review | Cited | MISSING | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/skill-advisor.cjs | Cited | OK | Citations=1; Iterations=1 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| AGENTS.md | Cited | OK | Citations=8; Iterations=8 |

---

---

## Lineage Delta Sources

| Lineage | Delta |
|---------|-------|
| codex-luna | lineages/codex-luna/deltas/iter-001.jsonl |
| codex-luna | lineages/codex-luna/deltas/iter-002.jsonl |
| codex-luna | lineages/codex-luna/deltas/iter-003.jsonl |
| codex-luna | lineages/codex-luna/deltas/iter-004.jsonl |
| codex-luna | lineages/codex-luna/deltas/iter-005.jsonl |
| codex-luna | lineages/codex-luna/deltas/iter-006.jsonl |
| codex-luna | lineages/codex-luna/deltas/iter-007.jsonl |
| codex-luna | lineages/codex-luna/deltas/iter-008.jsonl |
| codex-luna | lineages/codex-luna/deltas/iter-009.jsonl |
| codex-luna | lineages/codex-luna/deltas/iter-010.jsonl |
| opencode-deepseek | lineages/opencode-deepseek/deltas/iter-001.jsonl |
| opencode-deepseek | lineages/opencode-deepseek/deltas/iter-002.jsonl |
| opencode-deepseek | lineages/opencode-deepseek/deltas/iter-003.jsonl |
| opencode-deepseek | lineages/opencode-deepseek/deltas/iter-004.jsonl |
| opencode-deepseek | lineages/opencode-deepseek/deltas/iter-005.jsonl |
| opencode-deepseek | lineages/opencode-deepseek/deltas/iter-006.jsonl |
| opencode-deepseek | lineages/opencode-deepseek/deltas/iter-007.jsonl |
| opencode-deepseek | lineages/opencode-deepseek/deltas/iter-008.jsonl |
| opencode-deepseek | lineages/opencode-deepseek/deltas/iter-009.jsonl |
| opencode-deepseek | lineages/opencode-deepseek/deltas/iter-010.jsonl |
| pi-deepseek | lineages/pi-deepseek/deltas/iter-001.jsonl |
| pi-deepseek | lineages/pi-deepseek/deltas/iter-002.jsonl |
| pi-deepseek | lineages/pi-deepseek/deltas/iter-003.jsonl |
| pi-deepseek | lineages/pi-deepseek/deltas/iter-004.jsonl |
| pi-deepseek | lineages/pi-deepseek/deltas/iter-005.jsonl |
| pi-deepseek | lineages/pi-deepseek/deltas/iter-006.jsonl |
| pi-deepseek | lineages/pi-deepseek/deltas/iter-007.jsonl |
| pi-deepseek | lineages/pi-deepseek/deltas/iter-008.jsonl |
| pi-deepseek | lineages/pi-deepseek/deltas/iter-009.jsonl |
| pi-deepseek | lineages/pi-deepseek/deltas/iter-010.jsonl |
