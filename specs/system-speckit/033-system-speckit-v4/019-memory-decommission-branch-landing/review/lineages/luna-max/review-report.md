---
title: "Deep Review Report: memory decommission landing"
description: "Terminal inline fan-out lineage review for the memory decommission landing."
loop_type: review
review_target: ".opencode/specs/system-speckit/052-memory-decommission-landing"
session_id: "fanout-luna-max-1788546796271-oyeo9p"
---

# Deep Review Report: memory decommission landing

## Executive Summary

The detached inline review lineage completed all 10 required iterations under
`stopPolicy=max-iterations`. It reviewed four dimensions across rotating source
slices and performed adversarial replay of the active registry. The terminal
registry contains 0 P0, 5 P1 and 5 P2 findings; no finding was resolved by this
review because the lineage is read-only against the target.

Final review verdict: **CONDITIONAL**. Release readiness remains
`in-progress`: five P1 findings remain active, all four packet acceptance rows
are `Unmet`, and authoritative validators, tests, graph coverage and continuity
receipts were not run under the explicit lineage-only write boundary. The
lineage execution itself is complete; that execution status must not be
mistaken for packet closure.

## Planning Trigger

This report was produced for the following pre-bound setup:

| Binding | Value |
|---------|-------|
| Review target | `.opencode/specs/system-speckit/052-memory-decommission-landing` |
| Target type | `spec-folder` |
| Dimensions | `all` = correctness, security, traceability, maintainability |
| Execution mode | `AUTONOMOUS` |
| Lineage mode | `auto` |
| Session | `fanout-luna-max-1788546796271-oyeo9p` |
| Executor | `cli-codex model=gpt-5.6-luna` |
| Loop type | `review` |
| Stop policy | `max-iterations` |
| Iteration cap | 10 |
| Convergence threshold | 3; telemetry only until the cap |
| Artifact directory | `.opencode/specs/system-speckit/052-memory-decommission-landing/review/lineages/luna-max` |

The artifact root was bound directly to the supplied fan-out override. No
artifact-root resolver was run, and no nested CLI, agent, task dispatch or
subprocess executed an iteration.

## Active Finding Registry

All findings below are active in `deep-review-findings-registry.json`; each has
an evidence hash, scope proof and affected-surface hints in that registry.

| ID | Severity | Dimension | Finding | Primary source |
|----|----------|-----------|---------|----------------|
| F001 | P1 | correctness | Free-text ripgrep recipes omit hidden documentation beneath the advertised `.opencode` root | `.opencode/skills/system-spec-kit/scripts/retrieval/lib/rg-lane.mjs:28-43` |
| F002 | P2 | correctness | `lookup --limit` accepts malformed values despite its non-negative integer contract | `.opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs:254-261` |
| F003 | P1 | security | Remote HF model-server auth token gates binding but is not enforced at the HTTP request boundary | `.opencode/bin/hf-model-server.cjs:166-193,827-909,942-955` |
| F004 | P1 | traceability | `doctor-memory` names an absent `checklist.md#doctor-memory` evidence artifact | `.opencode/commands/doctor/assets/doctor-memory.yaml:34-40` |
| F005 | P2 | maintainability | cli-codex stdin hard rule and default non-interactive example disagree | `.opencode/skills/cli-external-orchestration/cli-codex/SKILL.md:7-10,207-218` |
| F006 | P1 | correctness | Forced-depth completion accepts a gapped iteration filename set because it checks only count | `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:675-683,779-789,827-834` |
| F007 | P1 | security | Post-dispatch write containment can be bypassed through a symlink beneath the artifact directory | `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:282-287,307-323,423-450` |
| F008 | P2 | correctness | Doc-frontmatter harvest accepts a non-fence line as the closing delimiter | `.opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/doc-frontmatter.ts:93-98` |
| F009 | P2 | maintainability | Advisor-local shared payload retains producer values absent from the canonical context contract | `.opencode/skills/system-skill-advisor/mcp-server/lib/shared/shared-payload.ts:291-299` |
| F010 | P2 | maintainability | Current plugin documentation advertises the retired memory-plugin kill switch | `.opencode/plugins/README.md:90-100` |

### Severity interpretation

P1 findings are required remediation or explicit user-approved deferral before
closure. P2 findings are advisory but remain useful decommission and
maintainability debt. No P0 blocker was found. The final replay did not invent a
ranking finding: lexical and trigger-index lanes have explicit stable tuples,
the legacy replay has an SQL `id` tie-break, and the zvec lane's external rank
boundary is explicitly documented `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/rg-lane.mjs:346-394]`
`[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lookup-trigger-index.mjs:166-203]`
`[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/lib/legacy-lane.mjs:295-305,337-343]`
`[SOURCE: .opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:192-202,310-319]`.

## Remediation Workstreams

| Workstream | Findings | Required next action | Closure evidence |
|------------|----------|----------------------|------------------|
| Retrieval corpus and CLI | F001, F002 | Align hidden-file behavior with the advertised corpus and validate `--limit` as a whole non-negative integer | Focused edge-case tests plus a read-only recipe/trigger-index replay |
| Remote embedding boundary | F003 | Enforce the documented credential at the HTTP boundary or remove remote-bind opt-in | Missing, wrong and valid credential HTTP cases; client/server contract evidence |
| Packet evidence and doctor route | F004 | Create/anchor the named checklist or point the workflow at actual acceptance evidence; map AC-001 through AC-004 | Existing artifact and acceptance rows `Met`, `Waived` with ADR, or `Superseded` with ADR |
| Executor contract documentation | F005 | Make the cli-codex example obey the stdin hard rule or state its interactive exception | Updated canonical example and contract review |
| Review runtime boundary | F006, F007 | Validate contiguous iteration sequence/state reconciliation and physically canonicalize descendant artifact paths | Adversarial gapped-sequence and symlink-component tests |
| Preserved advisor contracts | F008, F009 | Require a complete frontmatter fence and reconcile/document local producer vocabulary | Malformed-delimiter fixture and shared-payload parity fixture |
| Decommission documentation | F010 | Remove or explicitly mark retired plugin flags and memory-plugin references as historical | Current plugin/hook inventory and tests README no longer present retired config as live |

## Spec Seed

The packet requires the decommission to remove live memory server, hook, plugin,
launcher and retired-command surfaces; strict validation to pass; changed
documents to validate by class; and a ten-iteration `gpt-5.6-luna` review with
no P0/P1 findings `[SOURCE: .opencode/specs/system-speckit/052-memory-decommission-landing/spec.md:100-115]`.
Its success criteria require residue/trigger-index/doctor/audit evidence and a
final report with zero P0/P1 `[SOURCE: .opencode/specs/system-speckit/052-memory-decommission-landing/spec.md:120-125]`.

The acceptance document is the closure authority. It states that every row must
be `Met`, `Waived` or `Superseded`, with an existing ADR for the latter two
statuses `[SOURCE: .opencode/specs/system-speckit/052-memory-decommission-landing/acceptance-criteria.md:33-35]`.
AC-001 through AC-004 are currently `Unmet`
`[SOURCE: .opencode/specs/system-speckit/052-memory-decommission-landing/acceptance-criteria.md:55-60]`.

## Plan Seed

The implementation plan expects branch-side landing, class-specific document
validation, residue sweep, trigger-index determinism, doctor-route validation,
skill-root audit and the bounded review loop `[SOURCE: .opencode/specs/system-speckit/052-memory-decommission-landing/plan.md:19-32,53-65,98-106]`.
It explicitly models ten review iterations with `max-iterations`
`[SOURCE: .opencode/specs/system-speckit/052-memory-decommission-landing/plan.md:56-65]`.

This lineage performed only the review phase and wrote only lineage artifacts.
It did not execute or claim the plan's external validation commands. The
implementation summary remains a template scaffold rather than a completed
verification record `[SOURCE: .opencode/specs/system-speckit/052-memory-decommission-landing/implementation-summary.md:48-70,85-99]`.

## Traceability Status

| Protocol | Status | Evidence | Closure impact |
|----------|--------|----------|----------------|
| `spec_code` | partial | Active findings F001–F010 and packet requirements/acceptance evidence | Blocks a clean release verdict until findings are fixed or explicitly deferred |
| `checklist_evidence` | blocked | `doctor-memory.yaml` points to absent `checklist.md#doctor-memory`; authoritative gate was not run | Blocks packet closure |
| `feature_catalog_code` | pending | Overlay protocol was not applicable to this spec-folder-only lineage execution | Not adjudicated here |
| `playbook_capability` | pending | Overlay protocol was not applicable to this spec-folder-only lineage execution | Not adjudicated here |

The traceability limitation is deliberate and bounded. No `validate.sh`,
generator, doctor route validator, residue sweep, skill-root audit, test suite,
continuity writer or graph upsert was run because those workflows can write
outside the requested lineage directory. The absence of those receipts is
reported as blocked/not run, never as a pass.

## Deferred Items

The following remain search debt or blocked external evidence rather than hidden
claims of completion:

- Authoritative repository validation and graph coverage.
- Packet checklist mapping and acceptance-row closure.
- Direct CLI example audit, live symlink escape reproduction, malformed
  frontmatter fixture and payload duplicate parity fixture.
- A permissive embedding-timeout parser review remains deferred as a duplicate
  candidate of F002, not as a separate finding.
- Plugin inventory/documentation residue cleanup.
- Fix commits and post-fix reruns for F001–F010.

The cross-lane ranking-determinism candidate is no longer deferred: iteration 9
covered it and ruled it out as a defect under the documented lane boundary.

## Dimension Expansion Map

| Iteration | Focus | Files | New P0/P1/P2 | Result |
|-----------|-------|-------:|--------------|--------|
| 1 | Retrieval coverage and CLI boundaries | 13 | 0/1/1 | F001, F002 |
| 2 | Embedding and IPC perimeters | 7 | 0/1/0 | F003 |
| 3 | Decommission proof and workflow links | 13 | 0/1/0 | F004 |
| 4 | Mirrors and executor contracts | 10 | 0/0/1 | F005 |
| 5 | Forced-depth proof and containment boundary | 8 | 0/2/0 | F006, F007 |
| 6 | Preserved advisor and doc-harvest trust boundaries | 18 | 0/0/1 | F008 |
| 7 | Shared engine, templates and payload parity | 19 | 0/0/1 | F009 |
| 8 | Command, doctor, hook and plugin registration residue | 22 | 0/0/1 | F010 |
| 9 | Cross-lane ranking determinism and active-finding replay | 23 | 0/0/0 | Candidate ruled out; active registry unchanged |
| 10 | Final max-depth closure and traceability | 20 | 0/0/0 | Active registry replayed; cap reached |

The lineage accounting is 153 reviewed entries out of the 438-file bounded
scope. The scope list, not an unbounded directory walk, was the target selector.
High-risk exclusions such as `node_modules`, `dist`, `z_archive`, fixture trees
and scratch inputs were not treated as review targets.

## Search Ledger

The append-only state log records the full iteration history and each delta
records the selected source slice, evidence refs, ruled-out candidates and
coverage state. The final ledger state is:

- Required bug classes covered: hidden-path omission, malformed CLI input,
  malformed index artifact, execution-status conflation, ranking determinism,
  forced-depth iteration sequence, physical artifact-path escape, remote-bind
  authorization, IPC path ownership, workflow evidence-link integrity, executor
  documentation coherence, doc-frontmatter delimiter handling, payload contract
  parity and decommission registration residue.
- Candidate coverage: all listed candidate groups covered; no missing candidate
  group remains.
- Ruled out: malformed index artifact, execution-status conflation, IPC path
  ownership, missing doctor assets, runtime mirror drift, recursion/dispatch
  gaps, database path symlink escape, cross-lane ranking determinism defect and
  premature convergence termination.
- Blocked: authoritative tests/validators, live symlink escape reproduction and
  malformed-input fixture execution.
- Graph mode: `graphless_fallback`; semantic search: not run.

## Audit Appendix

### Lineage artifact receipts

The bound directory contains:

- `deep-review-config.json` — immutable run binding and write-boundary config.
- `deep-review-state.jsonl` — initialization, ten iteration records,
  `synthesis_started`, `synthesis_complete` and `run_completed` events.
- `deep-review-findings-registry.json` — ten active findings, counts and final
  coverage state.
- `deep-review-strategy.md` and `deep-review-dashboard.md` — terminal strategy
  and dashboard projections.
- `prompts/iteration-001.md` through `prompts/iteration-010.md`.
- `iterations/iteration-001.md` through `iterations/iteration-010.md`.
- `deltas/iter-001.jsonl` through `deltas/iter-010.jsonl`.
- This `review-report.md` synthesis artifact.

The iteration narratives end with an allowed verdict line. The ten state
iteration records and ten delta records parse as JSON; the observed iteration
sequence is exactly 1 through 10. Convergence telemetry did not terminate the
run early.

### Boundary receipt

Every write made by this detached executor was confined to the supplied lineage
artifact directory. Target source files were read-only. No repository tooling,
git write, checkout, commit, generated metadata refresh or continuity save was
performed.

## Resource Map Coverage

No target `resource-map.md` was present at initialization. Resource-map coverage
was therefore skipped and is reported as unavailable, not inferred from the
438-file scope list.

## Final Verdict

**CONDITIONAL** — the requested ten-iteration inline review lineage completed,
but the target packet is not release-ready: five P1 and five P2 findings remain
active, acceptance rows are `Unmet`, and authoritative validation receipts are
blocked by the explicit lineage-only boundary.

Review verdict: CONDITIONAL
