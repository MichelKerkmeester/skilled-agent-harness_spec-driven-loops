---
title: "Resource Map — sk-code round three (r3-dsflash-llmgw lineage)"
description: "Evidence-derived resource map for the detached round-three lineage: shared layer, review mode and agent, and the remaining hub surfaces."
trigger_phrases: []
---

# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

## Summary

- Scope: the `sk-code` shared layer and its loaders against the repository rules; `sk-code-review` and `.skilled/agents/review.md` as a codebase-agnostic contract; `sk-code-quality`, `sk-code-webflow`, `sk-code-opencode`, `sk-code-obsidian`, the six hub files, `benchmark/`, `feature-catalog/` and the playbooks.
- Generated from: twenty iteration deltas (73 findings) in this lineage.
- Status is an evidence snapshot of the run at `2026-10-10`; nothing outside the lineage directory was written.

## Round one and two authorities read as fixed context

- `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/research.md` — rounds one and two.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/lineages/r2-dsflash-llmgw/research.md` — round two lineage.
- Phase implementation summaries 002–008 under `specs/sk-code/011-sk-code-poinytail-based-refinement/`.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/spec.md` — in-flight scope.

## Shared layer sources

- `.skilled/skills/sk-code/shared/README.md` and the thirteen files under `shared/references/` and `shared/assets/patterns/`.
- `.skilled/skills/sk-code/SKILL.md`, `ROUTER.md`, `hub-router.json`, `mode-registry.json`, `description.json`, `graph-metadata.json`, `leaf-manifest.json`.
- `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs` and `scripts/run-all-drift-guards.sh`.

## Review sources

- `.skilled/skills/sk-code/sk-code-review/SKILL.md`, `README.md`, the four references, six asset checklists, three scripts and the playbook (27 scenario files plus the index).
- `.skilled/agents/review.md`, `.claude/agents/review.md` and the Codex/Pi/Hermes/OpenCode mirrors.
- `.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml`.

## Part 3 sources

- `.skilled/skills/sk-code/sk-code-quality/` (SKILL, README, five scripts, playbook).
- `.skilled/skills/sk-code/sk-code-webflow/` (SKILL, templates, scripts and fixtures, HTML/JS guides).
- `.skilled/skills/sk-code/sk-code-obsidian/` (SKILL, assets, 22 references, 27-scenario playbook, source-gate runner).
- `.skilled/skills/sk-code/benchmark/README.md`, `feature-catalog/`, `manual-testing-playbook/` (31 IDs), `.github/workflows/routing-registry-drift.yml`.
- `.skilled/repo-rules/root-cause-and-debugging.md`, `.skilled/repo-rules/evidence-and-proof.md`, `AGENTS.md`.
- `.skilled/skills/system-spec-kit/references/validation/validation-rules.md`.

## Runtime evidence captured

- Router-sync guard run: 4/4 PASS, exit 0.
- Webflow runtime checker: known-bad 4/4 fail (exit 1), known-good 2/2 pass (exit 0), no-files path exit 1.
- Review checkers on crafted inputs under `scratch/`: final-line trailing-space rejection, double-space `Not checked:` rejection, review-core-shape vacuous pass, template-shape numbering failure, `Review status: APPROVE` rejection.
- Pseudocode executions: the review detector on three foreign inputs; the hub check-5k legs; the playbook ID set differences; the version-pair comparisons.
