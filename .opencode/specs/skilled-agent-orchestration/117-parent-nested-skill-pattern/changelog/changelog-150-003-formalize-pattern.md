---
title: "Changelog: Formalize the parent-nested-skill pattern [117-parent-nested-skill-pattern/003-formalize-pattern]"
description: "Chronological changelog for the parent-nested-skill pattern formalization phase."
trigger_phrases:
  - "phase changelog"
  - "parent skill pattern"
  - "nested mode packets"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern/003-formalize-pattern` (Level 2)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern`

### Summary

This phase turned the repaired and guarded pattern into reusable operator machinery. It shipped four additive deliverables: `/create:parent-skill`, sk-doc guidance and templates, `/doctor:parent-skill` and benchmark fixtures.

The work also reconciled the parent research with the implemented routing class. The result is a pattern that can be created, documented, checked and dogfooded through the existing skill-benchmark corpus.

### Added

- Added `/create:parent-skill`, 3 assets and README plus agent mirror registration through the markdown agent at `.opencode/commands/create/parent-skill.md` and assets.
- Reconciled `research.md` from `routingClass` 3 to 4 by adding alias-fold in `../research/research.md`.
- Confirmed sk-doc validator clean with 0 new warnings, section 10 present and templates parse.
- Confirmed `/create` YAML files parse and 3 agent mirrors are consistent, with 2 hits each.
- `CHK-001 Pattern defined + implemented (research + 002) before formalizing` was recorded.
- `CHK-010 Each deliverable mirrors an existing convention (no new mechanism invented)` was recorded.

### Changed

- Added sk-doc section 10, `Parent Skills with Nested Mode Packets`, plus hub and registry templates through the markdown agent in `.opencode/skills/sk-doc/references/skill_creation.md` and `.opencode/skills/sk-doc/assets/skill/parent_skill_*`.
- Added `/doctor:parent-skill` route, `parent-skill-check.cjs`, workflow asset and router row through the general agent in `.opencode/commands/doctor/`.
- Confirmed `/doctor` check passes on `deep-loop-workflows` with exit 0, the broken negative path exits 1, the missing path exits 2 and hygiene exits 0.
- Ran `validate.sh --strict` on this phase folder.
- Committed the scoped work.
- Shipped and independently verified all four deliverables.

### Fixed

- Gathered target shapes for sk-doc structure, the create trio, doctor route and skill-benchmark fixtures.
- Added benchmark fixtures, 5 mode scenarios and routing-precision scorecard under `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/deep-loop-workflows/`.
- Confirmed benchmark fixtures valid, 10 files, and advisor-probe routing 3 of 3 lexical modes. The harness scores skill-id, while mode precision is covered through parity fixtures.
- `CHK-023 /doctor check is meaningful`, with broken fixture exit 1 and missing directory exit 2.
- `CHK-024 Benchmark fixtures valid`, with 10 files and scorecard routes the lexical modes correctly.
- `CHK-051 Benchmark fixtures under the skill-benchmark corpus (dogfood)` was recorded.

### Verification

| Check | Result |
|-------|--------|
| Task completion | PASS: 16 completed task item(s) recorded. |
| Pattern precondition | PASS: `CHK-001` recorded, with research and phase 002 in place before formalizing. |
| Convention fit | PASS: `CHK-010` recorded, with no new mechanism invented. |
| sk-doc validator | PASS: 0 new warnings, section 10 present and templates parse. |
| `/create` assets | PASS: YAML files parse and 3 agent mirrors are consistent, with 2 hits each. |
| `/doctor:parent-skill` positive path | PASS: `deep-loop-workflows` exits 0. |
| `/doctor:parent-skill` negative paths | PASS: Broken fixture exits 1 and missing directory exits 2. |
| Phase validation | PASS: `validate.sh --strict` ran on this phase folder. |
| Benchmark fixtures | PASS: 10 files valid, and routing scorecard routes lexical modes correctly. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/commands/create/parent-skill.md` | Created | Added `/create:parent-skill` command. |
| `.opencode/commands/create/assets/` | Created | Added 3 parent-skill create assets. |
| `.opencode/commands/create/README.md` | Updated | Registered the parent-skill create surface. |
| `.opencode/agents/` | Updated | Added agent mirror registration for the create surface. |
| `.opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern/research/research.md` | Updated | Reconciled routing class from 3 to 4 by adding alias-fold. |
| `.opencode/skills/sk-doc/references/skill_creation.md` | Updated | Added section 10 for parent skills with nested mode packets. |
| `.opencode/skills/sk-doc/assets/skill/parent_skill_*` | Created | Added hub and registry templates. |
| `.opencode/commands/doctor/` | Updated | Added `/doctor:parent-skill` route, checker, workflow asset and router row. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/deep-loop-workflows/` | Created | Added 5 mode scenarios and routing-precision scorecard. |

### Follow-Ups

- The `/create:sk-skill-parent` update branch, revising an existing parent skill, is a reasonable extrapolation from sibling create commands. The research specified only the create path, so update-merge semantics are not a research-defined contract.
- The benchmark dogfood seeds fixtures and a deterministic routing scorecard. The skill-benchmark harness usefulness ablation, D4 live mode and the not-yet-runtime-consumed profile loader remain follow-ons.
- The sk-doc validator's 7 `non_sequential_numbering` warnings are pre-existing fenced example headings in section 5, unchanged by this phase.
