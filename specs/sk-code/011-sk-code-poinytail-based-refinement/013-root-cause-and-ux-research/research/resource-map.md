---
title: "Resource Map — Root causes, hardening and external-user experience for the sk-code Ponytail refinement epic (packet specs/sk-code/011-sk-code-poinytail-based-refinement, children 001 to 011). Research only: change no product file. Mine the packet first: every child implementation-summary.md Known Limitations and Deviations, every round goal.md log, and 001-ponytail-deep-research/research/research.md. Part 1, process errors during the epic, trace each to the producing mechanism (file:line) not the symptom: (a) a helper used String.replace with a check string containing the dollar-apostrophe sequence, which JavaScript reads as a replacement pattern, and pasted a tasks.md tail twice; (b) the spec validator tried to resolve link-shaped text (close-bracket open-paren) inside task text as a link; (c) a reviewer wildcard rm deleted scratch helpers; (d) a regenerated scratch tree got committed; (e) claims were made before being verified; (f) generated artifacts drifted and needed orchestrator re-mints: the trigger index, Hermes agent copies, compiled-route manifests, leaf manifests; (g) a changelog version collided at merge because main and the branch both minted system-spec-kit v2.7.1.0. Part 2, open product issues, confirm each by reading code or running the test and name the root cause: the jev-transport-single canary defers; the compiled-route-admission test pins LIVE_CORPUS_SIZE 80 against 86 scenarios; manifest tests report 26 pass and 16 fail; the advisor battery scores 13 of 17 with 2 of 5 false positives where a file path in the prompt pulls routing toward the skill that owns the path; 36 HVR hard blockers in .skilled/skills/sk-code/SKILL.md; a 500 ms hook stdin deadline on hosts with a 3 s hook budget and no late-write test; a reducer change lowered open findings in 146 review folders; the advisor never passes --surface-hint, so keyword ties fall back to a fixed surface order. Part 3, above all, the external-user lens: what breaks or confuses a person who clones or installs this framework into their own repository: setup and install steps, generated artifacts they must regenerate and how they learn that, version numbering and changelog collisions, hook timing on slower hosts, routing surprises, error messages that do not say what to do, and recovery from a half-applied state. For every finding give path:line evidence, mark it CONFIRMED (you ran or read it) or INFERRED, give P0/P1/P2 by external-user impact, and a smallest fix. Apply .skilled/repo-rules/prevent-overengineering.md to every proposed fix: start from build nothing, and reject ideas that add an option, layer or dependency with no caller today, recording why. End with proposed implementation phases ranked by external-user impact against cost, each small, each naming the one file it changes and the command that would prove it."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 79
- **By category**: READMEs=0, Documents=2, Commands=0, Agents=0, Skills=24, Specs=37, Scripts=7, Tests=4, Config=4, Meta=1
- **Missing on disk**: 2
- **Scope**: research convergence output for 013-root-cause-and-ux-research
- **Generated**: 2026-10-10T19:11:26.045Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/scripts/git-hooks/pre-commit | Cited | OK | Citations=2; Iterations=2 |
| command:python3 hvr_scan.py .skilled/skills/sk-code/SKILL.md -> hard blockers 36 | Cited | MISSING | Citations=1; Iterations=1 |

---

## 5. Skills

> `.skilled/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `runtime/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/skills/cli-external-orchestration/mode-registry.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/ | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/sk-code/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/changelog/v1.9.4.0.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/lib/deep-loop/iteration-findings.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/changelog/v2.1.3.0.md | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/changelog/v2.7.2.0.md | Cited | OK | Citations=3; Iterations=3 |
| .skilled/skills/system-spec-kit/package.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/hooks/README.md | Cited | OK | Citations=2; Iterations=2 |
| .skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts | Cited | OK | Citations=1; Iterations=1 |
| .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| specs/sk-code/011-sk-code-poinytail-based-refinement/002-surface-contract-alignment/goal.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/002-surface-contract-alignment/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/002-surface-contract-alignment/scratch/after-sa001.tsv | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/002-surface-contract-alignment/tasks.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/004-webflow-checker-fix/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/002-leaf-generator-ignores/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/003-codex-mirror-gate/tasks.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/005-router-sync-guard/tasks.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/001-restraint-routing/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/goal.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/001-shared-and-hub-docs/scratch/gen_extra2.py | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/003-quality-mode/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/005-opencode-and-guards/goal.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/006-deep-loop-follow-ups/goal.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/001-review-canary-pins/goal.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/001-review-canary-pins/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/004-quality-obsidian-coverage/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/goal.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/scratch/check-units.cjs | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/scratch/fix-chain.json | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/tasks.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/goal.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/implementation-summary.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/probe/handoff-review-yield.cjs | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/reducer-yield-after-review.txt | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/reducer-yield-after.txt | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/reducer-yield-before.txt | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins/implementation-summary.md | Cited | OK | Citations=3; Iterations=3 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/goal.md | Cited | OK | Citations=2; Iterations=2 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/plan.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/scratch/build_tasks.py | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/goal.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-code/011-sk-code-poinytail-based-refinement/spec.md | Cited | OK | Citations=1; Iterations=1 |
| specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/compiled/route-gold.typed.json | Cited | OK | Citations=1; Iterations=1 |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/compiled-route-guard.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/compiled-route-sync.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/compiled-route.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs | Cited | OK | Citations=1; Iterations=1 |
| .skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts | Cited | OK | Citations=2; Iterations=2 |
| .skilled/scripts/install-git-hooks.sh | Cited | OK | Citations=1; Iterations=1 |

---

## 8. Tests

> Test files, fixtures, and snapshots. Tests take precedence over `Scripts`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/tests/compiled-route-admission.test.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/tests/compiled-route-manifest.test.cjs | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/tests/compiled-route-surface-hint.test.cjs | Cited | OK | Citations=1; Iterations=1 |
| command:node --test .skilled/bin/tests/compiled-route-admission.test.cjs | Cited | MISSING | Citations=1; Iterations=1 |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json | Cited | OK | Citations=1; Iterations=1 |
| .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/fixtures/canary-cases.v1.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/fixtures/canary-cases.v1.json | Cited | OK | Citations=2; Iterations=2 |
| .skilled/package-lock.json | Cited | OK | Citations=2; Iterations=2 |

---

## 10. Meta

> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `LICENSE`, and root `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| README.md | Cited | OK | Citations=3; Iterations=3 |

---

---

## Lineage Delta Sources

| Lineage | Delta |
|---------|-------|
| dsflash-llmgw | lineages/dsflash-llmgw/deltas/iter-001.jsonl |
| dsflash-llmgw | lineages/dsflash-llmgw/deltas/iter-002.jsonl |
| dsflash-llmgw | lineages/dsflash-llmgw/deltas/iter-003.jsonl |
| dsflash-llmgw | lineages/dsflash-llmgw/deltas/iter-004.jsonl |
| dsflash-llmgw | lineages/dsflash-llmgw/deltas/iter-005.jsonl |
| dsflash-llmgw | lineages/dsflash-llmgw/deltas/iter-006.jsonl |
| dsflash-llmgw | lineages/dsflash-llmgw/deltas/iter-007.jsonl |
| dsflash-llmgw | lineages/dsflash-llmgw/deltas/iter-008.jsonl |
| dsflash-llmgw | lineages/dsflash-llmgw/deltas/iter-009.jsonl |
| dsflash-llmgw | lineages/dsflash-llmgw/deltas/iter-010.jsonl |
