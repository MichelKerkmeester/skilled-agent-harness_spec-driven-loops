---
title: "Changelog: Parent nested skill pattern root [150-parent-nested-skill-pattern/root]"
description: "Root rollup for the completed Spec 150 parent-nested-skill pattern packet."
trigger_phrases:
  - "150 root changelog"
  - "parent nested rollup"
  - "nested skill pattern"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/150-parent-nested-skill-pattern` (Level Phase Parent)

### Summary

Spec 150 made the parent-nested-skill pattern operational. It first repaired the deep-loop mode packet names, then made advisor routing drift visible, then formalized the pattern through create, doctor, documentation and benchmark fixtures, then implemented the improvement research findings that turned the C-plus routing guarantee into a real gate.

The packet stayed faithful to the parent purpose: define and optimize the pattern spec root for the Parent skill with nested sub-skills. The parent remained a lean phase parent, while the phase children carried planning, tasks, checklists and decisions, and the research evidence stayed at the parent level under `research/`.

### Included Phases

| Phase | Status | Summary |
|-------|--------|---------|
| [`001-rename-fix-and-shared-decision`](./changelog-150-001-rename-fix-and-shared-decision.md) | Completed | Renamed four deep-loop mode-packet folders to the deep-prefixed SKILL names, swept live references and recorded the `ai-council` exception. |
| [`002-advisor-routing-drift-guard`](./changelog-150-002-advisor-routing-drift-guard.md) | Completed | Added registry `advisorRouting`, exported advisor projection maps and introduced a drift-guard test without changing runtime routing behavior. |
| [`003-formalize-pattern`](./changelog-150-003-formalize-pattern.md) | Completed | Added `/create:parent-skill`, sk-doc guidance, `/doctor:parent-skill` and benchmark fixtures for the parent-nested-skill pattern. |
| [`004-improvement-implementation`](./changelog-150-004-improvement-implementation.md) | Completed | Implemented the improvement-research findings across CI, doctor coverage, runtime dependency seams, lifecycle guards and benchmark restore work. |

### Added

- Four phase-local changelog surfaces for the shipped child phases.
- A packet-level changelog index and root rollup.
- Registry-level `advisorRouting` for eight modes and an `advisorRoutingContract` legend in `.opencode/skills/deep-loop-workflows/mode-registry.json`.
- `--dump-routing-maps` support in `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`.
- `/create:parent-skill` with assets and README plus agent mirror registration.
- `/doctor:parent-skill` with `parent-skill-check.cjs`, workflow wiring and meaningful positive and negative checks.
- Parent-skill benchmark fixtures and a routing-precision scorecard under `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/deep-loop-workflows/`.
- PR CI coverage for routing registry drift.
- Standalone `deep-loop-runtime` package metadata, lockfile, vitest config and dependency seam guard.
- Doctor advisor-sync checks for canonical exact-match coverage and non-canonical lexical-mode warnings.

### Changed

- Four deep-loop mode packet folders now carry the deep-prefixed names that match their SKILL names: `deep-context`, `deep-research`, `deep-review` and `deep-improvement`.
- `/deep:*` command YAML assets, hub `graph-metadata.json`, hub `SKILL.md`, hub `README.md`, `mode-registry.json`, runtime prompt paths and straggler references now point at the corrected packet names.
- `DEEP_MODE_BY_CANONICAL` is exported from `aliases.ts`, and the drift-guard compares Python, TypeScript and registry projections.
- `sk-doc` now documents parent skills with nested mode packets and ships hub plus registry templates.
- The parent research was reconciled from `routingClass` 3 to 4 by adding alias-fold.
- Research, review and AI Council flows now route through the promoted `loop-lock.cjs`, with race-safe stale-lock reclaim and atomic fan-out merge writes.
- Twelve runtime reach-ins into `system-spec-kit/node_modules` were replaced with bare specifiers or `require.resolve('tsx')`.
- Lifecycle taxonomy, runtime capabilities, stale agent references and skill-benchmark path depth were hardened or restored.

### Fixed

- The Phase 1 reference-integrity sweep closed old bare-path hits, double-prefix hits and stale runtime references from the earlier rename.
- The C-plus routing guarantee now has both a drift guard and CI coverage instead of relying on an unrun test.
- The `/doctor:parent-skill` check fails meaningfully on broken and missing fixtures.
- `fanout-run.cjs` now uses corrected SKILL paths for context, research and review.
- The cross-reference straggler in `.opencode/skills/cli-opencode/references/destructive_scope_violations.md` was repointed.
- Skill-benchmark Lane C was restored by fixing skills-root depth resolution, the deep-improvement e2e fixture path and stale parser anchors.
- Phase 1 rename completion and Lane C restore landed green at HEAD.

### Verification

| Check | Result |
|-------|--------|
| Phase 001 tasks | PASS: 21 completed task item(s) recorded. |
| Phase 002 tasks | PASS: 15 completed task item(s) recorded. |
| Phase 002 routing tests | PASS: Drift-guard plus both parity suites green, 19 tests. |
| Phase 003 tasks | PASS: 16 completed task item(s) recorded. |
| Phase 003 doctor check | PASS: `deep-loop-workflows` exit 0, broken fixture exit 1, missing directory exit 2 and hygiene exit 0. |
| Phase 003 spec validation | PASS: `validate.sh --strict` ran on the phase folder. |
| Phase 004 tasks | PASS: 19 completed task item(s) recorded. |
| Phase 004 runtime suite | PASS: Deep-loop-runtime standalone suite expected 349 of 349 and system-spec-kit changed-import tests expected 17 green. |
| Security hygiene | PASS: `CHK-030 No secrets introduced` recorded in Phases 001, 002 and 004. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/deep-loop-workflows/deep-*` | Updated | Four mode packet folders and internal references now use deep-prefixed names. |
| `.opencode/commands/deep/assets/` | Updated | `/deep:*` command YAML assets reference the corrected packet paths. |
| `.opencode/skills/deep-loop-workflows/mode-registry.json` | Updated | Mode packet keys were repointed, `advisorRouting` was added and registry version moved to `1.1.0`. |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Updated | `buildLoopPrompt` SKILL paths were corrected. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Updated | `--dump-routing-maps` was added. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts` | Updated | `DEEP_MODE_BY_CANONICAL` was exported for drift-guard coverage. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts` | Created | Drift-guard coverage compares advisor maps and registry projection. |
| `.opencode/commands/create/parent-skill.md` | Created | `/create:parent-skill` command surface added. |
| `.opencode/commands/create/assets/` | Created | Parent-skill create assets added. |
| `.opencode/skills/sk-doc/references/skill_creation.md` | Updated | Parent skills with nested mode packets guidance added. |
| `.opencode/skills/sk-doc/assets/skill/parent_skill_*` | Created | Hub and registry templates added. |
| `.opencode/commands/doctor/` | Updated | `/doctor:parent-skill` route, workflow asset and checker added. |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/deep-loop-workflows/` | Created | Benchmark fixture corpus and routing-precision scorecard added. |
| `.github/workflows/routing-registry-drift.yml` | Created/Updated | Lightweight routing-registry drift gate added and then made CI-viable through `npx --yes vitest@4.1.6` and `actions/setup-python`. |
| `.opencode/skills/deep-loop-runtime/` | Updated | Runtime package metadata, lockfile, vitest config, dependency seams and runtime hardening added. |
| `.opencode/specs/skilled-agent-orchestration/150-parent-nested-skill-pattern/research/research.md` | Updated | Research routing class reconciled from 3 to 4 by adding alias-fold. |

### Follow-Ups

- Registry codegen remains deliberately deferred. The projection maps are still hand-maintained, but CI and doctor advisor-sync coverage now catch drift reliably.
- Non-canonical lexical mode advisor-sync coverage is a warning rather than a failure, because scaffolded parent skills can be structurally valid while advisor wiring is pending.
- CI exercises the routing surface, not the full advisor install or MCP server.
- The Phase 1 parity claim is reference-integrity plus runtime-test parity, not a full per-mode artifact replay.
- The `ai-council` folder-name exception remains documented and accepted.
