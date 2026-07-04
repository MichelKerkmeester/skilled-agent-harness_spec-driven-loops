# Deep Review Strategy — minimax-review lineage

> Detached fan-out lineage targeting the OpenCode /goal plugin spec packet
> (`.opencode/specs/deep-loops/032-goal-opencode-plugin`). Writes are confined to
> `.opencode/specs/deep-loops/032-goal-opencode-plugin/review/lineages/minimax-review/`.
> Parallel lineage: `kimi-review`. Convergence before `maxIterations=10` is treated as
> telemetry; review angles are broadened instead of synthesizing early.

## Topic

Read-only deep review of packet 032 (the /goal OpenCode plugin spec folder).
Goal: produce a release-readiness verdict, an active finding registry, remediation
workstreams, spec/plan seeds, and a traceability status — using P0/P1/P2 severities
mapped to concrete `file:line` evidence. Reuses the audit dossier
(`../scratch/2026-07-03-four-reviewer-audit-findings.md`) as a known-context pointer
rather than re-deriving its findings, and complements the archived
`review_archive/2026-07-04-documentation-staleness-audit/` (which focused on
documentation surfaces) with structural angles the previous lineage did not cover.

## Review Dimensions

- [ ] correctness — packet, plan, tasks, checklist, implementation-summary alignment with shipped code
- [ ] security — mk-goal.js injection clamp, verifier env-gate, sanitize/role-neutralize, secret redaction
- [ ] traceability — spec → plan → tasks → checklist → implementation-summary → graph-metadata → git chain
- [ ] maintainability — test architecture (node:test vs cjs), fixtures, helpers, naming, cross-runtime agents

## Files Under Review

| Path | In scope | Notes |
|------|----------|-------|
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md` | yes | phase-parent spec.md (227 lines) |
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/description.json` | yes | packet metadata |
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/graph-metadata.json` | yes | derived packet status |
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/before-vs-after.md` | yes | narrative integrity |
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/timeline.md` | yes | packet timeline |
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/changelog/` | yes | per-phase + root changelog |
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/scratch/2026-07-03-four-reviewer-audit-findings.md` | yes | source-of-truth audit dossier |
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/001-state-store/` ... `021-completion-verifier-wiring/` | yes | each phase folder: spec.md, plan.md, tasks.md, implementation-summary.md, description.json, graph-metadata.json |
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/review_archive/2026-07-01-plugin-implementation-review/` | read-only context | previous review archive |
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/review_archive/2026-07-04-documentation-staleness-audit/` | read-only context | sibling review archive |
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/research/` and `research_archive/` | read-only context | design research |
| `.opencode/plugins/mk-goal.js` (2657 lines) | yes | shipped implementation under review |
| `.opencode/plugins/tests/*.cjs` (10 test files) | yes | shipped test suite |
| `.opencode/commands/goal_opencode.md` | yes | live command router |
| `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md` | yes | primary goal-plugin reference |
| `.opencode/skills/system-spec-kit/references/config/hook_system.md` | yes | hook taxonomy (DOC-1 finding target) |
| `.opencode/skills/system-spec-kit/feature_catalog/18--ux-hooks/goal-opencode-plugin.md` | yes | feature catalog row |
| `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md` | yes | mirror feature catalog |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/goal-opencode-plugin.md` | yes | playbook scenario |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/goal-opencode-plugin.md` | yes | mirror playbook |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | yes | central env table |

## Cross-Reference Status

| Protocol | Level | Gate | Status (init) |
|----------|-------|------|---------------|
| spec_code | core | hard | not run |
| checklist_evidence | core | hard | not run |
| skill_agent | overlay | advisory | not run |
| agent_cross_runtime | overlay | advisory | not run |
| feature_catalog_code | overlay | advisory | not run |
| playbook_capability | overlay | advisory | not run |
| resource_map_coverage | conditional | advisory | skipped — `resource_map_present: false` |

## Known Context

- Packet has 21 phase sub-folders (`001-` ... `021-`); phases 001-008 and 010-014 are
  reported Complete in the parent's phase-map. Phase 009 is owned by a separate
  in-flight session. Phases 015 and 021 are Planned and originate from the
  four-reviewer audit dossier (sections C/D and §B respectively).
- `mk-goal.js` is 2657 lines; the audit dossier enumerates F1-F12 (correctness),
  D1-D3 (docs/contract), e-1.x (hot-path), e-2.x (refactor), e-3.x (capability)
  findings with line refs.
- Test surface: 10 cjs test files under `.opencode/plugins/tests/`; phase 018 plans
  node:test conversion.
- Verifier seam (phase 021): operator has chosen option (c) hybrid
  `MK_GOAL_VERIFIER=heuristic|llm`, default `heuristic`.
- Previous parallel/sequential reviews:
  - `review_archive/2026-07-01-plugin-implementation-review/` (early implementation)
  - `review_archive/2026-07-04-documentation-staleness-audit/` (doc surfaces only)
- This lineage is parallel to `kimi-review` and shares the same packet but writes to
  `lineages/minimax-review/` exclusively.
- Resource-map.md: not present at init (`resource_map_present: false`). Coverage gate
  skipped per SKILL.md §3 protocol.
- Audit dossier lines cited inline in iteration files use `../scratch/...` paths.

## Non-Goals

- Do not modify code under review; the loop is observation-only.
- Do not re-derive audit-dossier findings line-by-line; reuse the dossier as
  known context and focus on coverage gaps, structural angles, and post-dossier drift.
- Do not propose fixes in iteration files; remediation lives in workstreams.
- Do not synthesize before `maxIterations=10`; if convergence signals appear earlier,
  the next iteration broadens the review angle instead of stopping.

## Stop Conditions

- Hard stop: all 10 iterations completed.
- Soft stop signals (telemetry only, not synthesized): rolling-average
  `newFindingsRatio` below 0.10, all four dimensions covered, stuck count below 2.
- Pre-max convergence triggers an angle-broadening iteration (next-focus rotated to a
  less-covered sub-area), not synthesis.

## Review Boundaries

- `maxIterations: 10`, `convergenceThreshold: 0.10`, `stuckThreshold: 2`.
- `severityThreshold: P2` (all findings reported; P2 are advisories).
- `executionMode: auto`, `stopPolicy: max-iterations`.
- `reviewDimensions: [correctness, security, traceability, maintainability]`.
- All four core/overlay cross-reference protocols scheduled; agent cross-runtime and
  skill_agent are scheduled only when the iteration's focus implies them.

## Running Findings

(empty at init — populated by reducer after each iteration)

## What Worked

(empty at init)

## What Failed

(empty at init)

## Exhausted Approaches

(empty at init)

## Ruled-Out Directions

- Re-running the documentation-staleness audit: already executed in
  `review_archive/2026-07-04-documentation-staleness-audit/`; this lineage picks up
  structural angles the doc audit did not cover.

## Next Focus

Iteration 001: inventory + scope discovery (correctness dimension). Build the file
map, confirm packet structure, and seed the iteration log.