---
title: "Resource Map — How should Skilled treat the sk-code surfaces for external repository users? The v4.0.0.4 release note entry \"One Surface Order Everywhere\" (.skilled/changelog/skilled/v4.0.0.4.md) says every sk-code file that ranks the code surfaces lists OpenCode, then Obsidian, then Webflow; a prompt matching two surfaces lists them in that order; on a keyword tie the session's current surface can lead via `compiled-route.cjs --surface-hint`. The operator says this is wrong for external users: sk-code-obsidian and sk-code-webflow are the operator's personal surfaces and serve only as examples, which an external user deletes and replaces with an sk-code surface for their own project, so the doctor and everything else in Skilled should assume they are gone. sk-code-opencode is the one native surface and, for users other than the operator, should have the LOWEST priority: a user's own non-native surface outranks it. sk-code-review, sk-code-quality and the shared/ layer are stack-agnostic and serve every user. Answer with path:line or command evidence: (1) every place that encodes the surface order or treats obsidian or webflow as installed: sk-code hub-router.json tieBreak, mode-registry.json, SKILL.md, ROUTER.md, shared/references (stack-detection.md), the compiled-routing manifest and runtime (.skilled/bin/compiled-route.cjs, .skilled/bin/lib/compiled-routing/), canary fixtures, the skill advisor (graph metadata, scorer boosts, batteries), the doctor commands and checks (.skilled/commands/doctor/), install guides, READMEs and the v4.0.0.4 note; (2) what breaks today when an external user deletes sk-code-obsidian and sk-code-webflow, observed in a throwaway copy outside the worktree (doctor checks, compiled-route-guard, route sync, canaries, advisor, package and parent-skill checks), and what happens when they add their own surface packet; (3) how a user-added surface should outrank sk-code-opencode: a priority or rank field in mode-registry.json, a native or fallback flag on opencode, a tieBreak derived when the manifest is minted, the --surface-hint path, or something else, compared on cost and risk with one recommendation; (4) how the operator's own repository keeps its current order with obsidian and webflow present while the shipped default assumes they are gone: configuration versus data, example versus shipped; (5) doctor and documentation changes that tell external users obsidian and webflow are examples to delete or replace, and how to scaffold their own surface (sk-doc create-skill, parent-skill mode packets); (6) ideas to reject, with reasons. Every recommendation must pass .skilled/repo-rules/prevent-overengineering.md: name the cheaper move and why it fails."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 112
- **By category**: READMEs=0, Documents=14, Commands=25, Agents=0, Skills=38, Specs=12, Scripts=15, Tests=3, Config=4, Meta=1
- **Missing on disk**: 22
- **Scope**: research convergence output for 025-external-surface-priority-research
- **Generated**: 2026-10-12T18:34:24.748Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/changelog/skilled/v4.0.0.4.md | Cited | OK | Citations=5; Iterations=5 |
| .skilled/hooks/git/pre-commit | Cited | OK | Citations=1; Iterations=1 |
| .skilled/release/.gitignore | Cited | OK | Citations=1; Iterations=1 |
| .skilled/repo-rules/prevent-overengineering.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/repo-rules/prevent-overengineering.md:45-66,94-100,117-119 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/scripts/git-hooks/pre-commit | Cited | OK | Citations=1; Iterations=1 |
| /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/s025-dsflash-devin-i4.ot15 | Cited | OK | Citations=2; Iterations=2 |
| /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/s025-dsflash-devin-i10.ktXa | Cited | OK | Citations=1; Iterations=1 |
| /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/s025-luna-max-fast-i5.dHBY | Cited | OK | Citations=1; Iterations=1 |
| ci-skill-root-metadata | Cited | MISSING | Citations=1; Iterations=1 |
| compiled-route-guard | Cited | MISSING | Citations=1; Iterations=1 |
| parent-skill-check | Cited | MISSING | Citations=1; Iterations=1 |
| throwaway copy /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/s025-luna-max-fast-i7.GwNu | Cited | MISSING | Citations=1; Iterations=1 |
| throwaway-copy:/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/s025-luna-max-fast-i5.dHBY | Cited | MISSING | Citations=1; Iterations=1 |

---

## 3. Commands

> `.skilled/commands/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/commands/create/assets/create-skill-parent-auto.yaml | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/create/assets/create-skill-parent-confirm.yaml | Cited | OK | Citations=3; Iterations=3 |
| .skilled/commands/create/assets/create-skill-parent-confirm.yaml:147,461-467 | Cited | MISSING | Citations=2; Iterations=2 |
| .skilled/commands/create/assets/create-skill-parent-presentation.txt | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/create/skill-parent.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/create/skill.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/_routes.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-parent-skill.yaml | Cited | OK | Citations=4; Iterations=4 |
| .skilled/commands/doctor/assets/doctor-parent-skill.yaml:23-34,78-85 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-update-align.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-update-apply.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-update-check.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-update-record-base.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/doctor-update-rollback.yaml | Cited | OK | Citations=1; Iterations=1 |
| .skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml | Cited | OK | Citations=3; Iterations=3 |
| .skilled/commands/doctor/scripts/parent-skill-check.cjs | Cited | OK | Citations=6; Iterations=6 |
| .skilled/commands/doctor/scripts/parent-skill-check.cjs:490-497,1335-1342 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/parent-skill-check.cjs:495-497,1075-1088 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/release-update.cjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/commands/doctor/scripts/release-update.cjs:29,1086-1098 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/release-update.cjs:74-114,520-561,681-701,2268-2359 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/release-update.cjs:88-114,520-561 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/commands/doctor/update.md | Cited | OK | Citations=2; Iterations=2 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/sk-code/description.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/graph-metadata.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/hub-router.json | Cited | OK | Citations=9; Iterations=9 |
| .skilled/skills/sk-code/hub-router.json:4-12,31-46 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/leaf-manifest.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/mode-registry.json | Cited | OK | Citations=8; Iterations=8 |
| .skilled/skills/sk-code/mode-registry.json:16-20,61-114 | Cited | MISSING | Citations=2; Iterations=2 |
| .skilled/skills/sk-code/mode-registry.json:19,61,79,98 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/README.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-code/ROUTER.md | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/sk-code/shared/README.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/shared/references/stack-detection.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-obsidian/scripts/run-source-gates.sh | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-obsidian/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-opencode/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-quality/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-review/references/review-core.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-review/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-webflow/SKILL.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/SKILL.md | Cited | OK | Citations=6; Iterations=6 |
| .skilled/skills/sk-code/SKILL.md:15,32-42 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/SKILL.md:32-40,147-170 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:17,56-68,85-87 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/sk-doc/sk-create-skill/SKILL.md | Cited | OK | Citations=4; Iterations=4 |
| .skilled/skills/sk-doc/sk-create-skill/SKILL.md:20-27,63-80 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/sk-doc/sk-create-skill/SKILL.md:20-28,57-80 | Cited | MISSING | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/graph-metadata.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-skill-advisor/runtime/tests/advisor-surface-hint.vitest.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/dsflash-devin/deep-research-config.json | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/dsflash-devin/deep-research-strategy.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/dsflash-devin/iterations/iteration-003.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/dsflash-devin/iterations/iteration-004.md | Cited | OK | Citations=2; Iterations=2 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/dsflash-devin/iterations/iteration-004.md,iteration-005.md,iteration-006.md,iteration-007.md,iteration-008.md | Cited | MISSING | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/dsflash-devin/iterations/iteration-005.md | Cited | OK | Citations=4; Iterations=4 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/dsflash-devin/iterations/iteration-006.md | Cited | OK | Citations=2; Iterations=2 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/dsflash-devin/iterations/iteration-007.md | Cited | OK | Citations=2; Iterations=2 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/dsflash-devin/iterations/iteration-008.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast/iterations/iteration-003.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast/iterations/iteration-004.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/lineages/luna-max-fast/iterations/iteration-007.md | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/compiled-route-guard.cjs | Cited | OK | Citations=5; Iterations=5 |
| .skilled/bin/compiled-route-manifest.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/compiled-route-sync.cjs | Cited | OK | Citations=5; Iterations=5 |
| .skilled/bin/compiled-route.cjs | Cited | OK | Citations=6; Iterations=6 |
| .skilled/bin/lib/compiled-route-layout.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/lib/compiled-route-manifest.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/lib/compiled-routing/004-compiler-n1-shadow/compiler/order.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs | Cited | OK | Citations=5; Iterations=5 |
| .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/lib/registry-compiler.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs | Cited | OK | Citations=4; Iterations=4 |
| .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/skill-advisor.cjs | Cited | OK | Citations=3; Iterations=3 |

---

## 8. Tests

> Test files, fixtures, and snapshots. Tests take precedence over `Scripts`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/tests/compiled-route-front-door.test.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/tests/compiled-route-manifest.test.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/tests/compiled-route-surface-hint.test.cjs | Cited | OK | Citations=5; Iterations=5 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json | Cited | OK | Citations=3; Iterations=3 |
| .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/fence-state.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/lib/compiled-routing/serving-closure.manifest.json | Cited | OK | Citations=1; Iterations=1 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| README.md | Cited | OK | Citations=4; Iterations=4 |

---

---

## Lineage Delta Sources

| Lineage | Delta |
|---------|-------|
| dsflash-devin | lineages/dsflash-devin/deltas/iter-001.jsonl |
| dsflash-devin | lineages/dsflash-devin/deltas/iter-002.jsonl |
| dsflash-devin | lineages/dsflash-devin/deltas/iter-003.jsonl |
| dsflash-devin | lineages/dsflash-devin/deltas/iter-004.jsonl |
| dsflash-devin | lineages/dsflash-devin/deltas/iter-005.jsonl |
| dsflash-devin | lineages/dsflash-devin/deltas/iter-006.jsonl |
| dsflash-devin | lineages/dsflash-devin/deltas/iter-007.jsonl |
| dsflash-devin | lineages/dsflash-devin/deltas/iter-008.jsonl |
| dsflash-devin | lineages/dsflash-devin/deltas/iter-009.jsonl |
| dsflash-devin | lineages/dsflash-devin/deltas/iter-010.jsonl |
| luna-max-fast | lineages/luna-max-fast/deltas/iter-001.jsonl |
| luna-max-fast | lineages/luna-max-fast/deltas/iter-002.jsonl |
| luna-max-fast | lineages/luna-max-fast/deltas/iter-003.jsonl |
| luna-max-fast | lineages/luna-max-fast/deltas/iter-004.jsonl |
| luna-max-fast | lineages/luna-max-fast/deltas/iter-005.jsonl |
| luna-max-fast | lineages/luna-max-fast/deltas/iter-006.jsonl |
| luna-max-fast | lineages/luna-max-fast/deltas/iter-007.jsonl |
| luna-max-fast | lineages/luna-max-fast/deltas/iter-008.jsonl |
| luna-max-fast | lineages/luna-max-fast/deltas/iter-009.jsonl |
| luna-max-fast | lineages/luna-max-fast/deltas/iter-010.jsonl |
