---
title: "Changelog: Operate Like Fable 5 Root Rollup [144-operate-like-fable-5/root]"
description: "Chronological root changelog for the Operate Like Fable-5 phased packet."
trigger_phrases:
  - "144 root changelog"
  - "fable 5 rollup"
  - "operate like fable 5"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5` (Level Phase Parent)

### Summary

Spec 144 moved Fable-5 from doctrine into operating machinery. The packet starts by distributing the discipline across always-read surfaces, then maps the cheapest high-leverage implementation targets, defines measurement, lands low-blast doctrine repairs, opens governor channels and hardens the dispatch boundary with provenance and evidence checks. The result is a phase-local record of how the framework learned to measure, enforce and explain the behavior it asks agents to follow.

### Included Phases

| Phase | Status | Summary |
|-------|--------|---------|
| [`001-initial-refinement`](./changelog-144-001-initial-refinement.md) | Complete | Distributed the Fable-5 operating doctrine across AGENTS, constitutional memory, `sk-code` and mirrors. |
| [`002-fable-mode-efficiency-research`](./changelog-144-002-fable-mode-efficiency-research.md) | Complete | Produced the ranked recommendation map that drove phases 003 through 009. |
| [`003-measurement-baseline`](./changelog-144-003-measurement-baseline.md) | Gates defined | Defined the fable-metrics baseline, post-dispatch advisories and read-only delivery route. |
| [`004-doctrine-quick-wins`](./changelog-144-004-doctrine-quick-wins.md) | Gates defined | Repaired the dead hook pointer, added a fail-loud pointer check and added handoff discipline. |
| [`005-governor-capsule-hook`](./changelog-144-005-governor-capsule-hook.md) | Gates defined | Added the compact governor capsule to the live per-turn skill-advisor reminder path. |
| [`006-subagent-governor-recursion`](./changelog-144-006-subagent-governor-recursion.md) | Gates defined | Opened the subagent governor channel and added recursion-control coverage. |
| [`007-sk-code-rituals`](./changelog-144-007-sk-code-rituals.md) | Gates defined | Added mutation-check, verification ladder and decision-economy rituals to `sk-code`. |
| [`008-fail-loud-provenance`](./changelog-144-008-fail-loud-provenance.md) | Complete | Made detectable requested-versus-actual model mismatches fail loud at the executor audit seam. |
| [`009-evidence-contract`](./changelog-144-009-evidence-contract.md) | Complete | Added a machine-checkable evidence contract schema and documented it in the agent IO contract. |

### Added

- A parent-level changelog structure for nine phase children and this root rollup.
- The doctrine distribution from phase 001: Operating Discipline text, two constitutional rules and the `sk-code` baseline line.
- The phase 002 recommendation map that tiers fable-5 implementation opportunities by leverage, blast radius, convergence and duplication against round 1.
- Phase 003 measurement definitions for five metrics and the C1, C2 and C3 scope.
- Phase 004 pointer-resolution check coverage and the scar-tissue handoff discipline.
- Phase 005 governor capsule record and render-path hook plan.
- Phase 006 subagent-visible governor injection and executor config governor field plan.
- Phase 007 verification rituals for mutation-check, rung-by-rung blind spots and fail-closed construction.
- Phase 008 `model_mismatch` provenance failure handling and the executor mismatch test suite.
- Phase 009 `validateEvidenceContract(input)` and the optional `AGENT_IO_EVIDENCE` v1 group.

### Changed

- The packet shifted from doctrine-only prose to a staged operating system for Fable-5 behavior.
- Research moved from a hypothesis into an approved ranked plan for phases 003 through 009.
- Verification language moved closer to the surfaces where agents actually claim work is safe.
- Dispatch validation gained a path to warn on malformed evidence while keeping absent evidence green by design.

### Fixed

- Phase 001 closed the doctrine-distribution class across AGENTS, constitutional memory, mirrors and `sk-code`.
- Phase 004 identified the dead `AGENTS.md` hook pointer as load-bearing and planned a fail-loud pointer check.
- Phase 008 closed the detectable silent substitution class at the provenance recording seam.
- Phase 009 closed the unstructured evidence class by defining a fixed advisory schema.
- No security, path, parser or redaction logic was in scope for phase 001.

### Verification

| Check | Result |
|-------|--------|
| Phase 001 distribution checks | PASS: AGENTS and CLAUDE byte-identical, all doctrine surfaces present and line budgets under the soft limit. |
| Phase 002 research merge | PASS: six lineages synthesized with attribution and implementation traceability to phases 003 through 009. |
| Phase 003 gates | PENDING: checklist defines `validate.sh`, fable-metrics, route validation and advisory fixture checks. |
| Phase 004 gates | PENDING: checklist defines strict validation, pointer checks, byte sync, line budget and vitest coverage. |
| Phase 005 gates | PENDING: checklist defines strict validation, render vitest, capsule length and existing render-suite checks. |
| Phase 006 gates | PENDING: checklist defines prompt-pack, executor-config and mirror consistency checks. |
| Phase 007 gates | PLANNED: checklist defines strict validation, comment hygiene, grep proof and smart-router confinement checks. |
| Phase 008 runtime checks | PASS: full deep-loop-runtime suite passed with 376 tests, mismatch cases passed and mutation check bit. |
| Phase 009 schema checks | PASS: strict validation exited 0, evidence-contract tests passed and full deep-loop-runtime suite passed with 376 tests. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `AGENTS.md` | Updated | Added Operating Discipline and repaired the hook pointer in later doctrine work. |
| `CLAUDE.md` | Updated | Stayed byte-identical with the Public AGENTS surface. |
| `Barter/ai-speckit/coder/AGENTS.md` | Updated | Added the read-only-git Operating Discipline variant. |
| `.opencode/skills/system-spec-kit/constitutional/regression-baseline-and-delta.md` | Created | Added the baseline-before-no-regressions rule. |
| `.opencode/skills/system-spec-kit/constitutional/finding-is-a-hypothesis.md` | Created | Added the finding-is-a-hypothesis rule. |
| `.opencode/skills/system-spec-kit/constitutional/main-branch-direct-push.md` | Updated | Added the non-git outward and irreversible action step. |
| `.opencode/skills/sk-code/SKILL.md` | Updated | Added baseline, blast-radius and later verification ritual language. |
| `.opencode/skills/system-spec-kit/scripts/rules/check-doc-pointers.sh` | Created | Planned fail-loud AGENTS pointer-resolution check. |
| `.opencode/skills/system-spec-kit/templates/manifest/handover.md.tmpl` | Updated | Planned scar-tissue ledger and numbered cold-read order. |
| `.opencode/skills/system-spec-kit/constitutional/fable-governor.md` | Created | Durable governor doctrine record. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/render.ts` | Updated | Render-path hook for the compact governor capsule. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts` | Updated | Added actual-model extraction, normalization and mismatch failure handling. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` | Updated | Added approved-model guard for fallback routing. |
| `.opencode/skills/deep-loop-runtime/tests/unit/executor-provenance-mismatch.vitest.ts` | Created | Added mismatch, match, native, fallback and compatibility coverage. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/evidence-contract.ts` | Created | Added the evidence contract validator. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` | Updated | Added advisory evidence-contract validation. |
| `.opencode/skills/deep-loop-runtime/tests/unit/post-dispatch-validate.vitest.ts` | Updated | Added malformed-warns and absent-stays-green cases. |
| `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md` | Updated | Added the optional `AGENT_IO_EVIDENCE` v1 group. |

### Follow-Ups

- Phase 001 deferred constitutional re-index until the next daemon scan because spec-memory dist was stale from pre-existing work.
- Phase 001 left the Barter git-posture contradiction for owner decision by design.
- Phase 002 produced the approved implementation map for phases 003 through 009.
- Phase 008 notes that detectable model mismatches only fire when the CLI reports an actual model on success.
- Phase 008 leaves codex and claude actual-model extraction out of scope because reliable stdout provenance was not present.
- Phase 009 names producer retrofit as a follow-on phase and keeps the schema advisory-only.
