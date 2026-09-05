---
title: "Deep Review Report - system-spec-kit runtime rename"
description: "Synthesis of the ten-iteration detached luna-max-pass3 review lineage."
version: "1.0.0"
mode: review
sessionId: fanout-luna-max-pass3-1788565027234-d7pbnn
target: .opencode/specs/system-speckit/053-spec-kit-runtime-rename
targetType: spec-folder
lineageMode: new
requestedLineageMode: auto
status: complete
verdict: PASS
activeP0: 0
activeP1: 0
activeP2: 2
stopReason: maxIterationsReached
releaseReadinessState: in-progress
---

# Deep Review Report

## Executive Summary

The detached `luna-max-pass3` lineage completed all 10 requested review iterations inline in the current session. Correctness, security, traceability, and maintainability were all exercised through direct source reads and exact-search ledgers over the bounded 453-file scope. The review raised no P0 or P1 findings and retains two P2 advisories:

- F001: live operator documentation still labels the renamed runtime destination as an MCP server.
- F002: the implementation summary's dependency counts disagree with the current runtime manifest, lockfile, and its own dependency decision table.

The review verdict is `PASS` under the review quality gate because active P0 and P1 counts are zero. This is not a release-readiness claim. Release readiness remains `in-progress`: external validation, clean-install execution, test execution, and continuity save were not run because the user-bound lineage permits writes only under this artifact directory.

## Planning Trigger / Planning Packet

No P0/P1 planning trigger fired. The two active P2 findings are suitable for a follow-up documentation/evidence reconciliation workstream, but they do not establish a blocking runtime or security defect.

```json
{
  "mode": "review",
  "target": ".opencode/specs/system-speckit/053-spec-kit-runtime-rename",
  "activeP0": 0,
  "activeP1": 0,
  "activeP2": 2,
  "findingIds": ["F001", "F002"],
  "planningTrigger": false,
  "nextActions": [
    "Rename the two live operator labels that retain MCP-server identity for the runtime package.",
    "Reconcile dependency counts in implementation-summary.md with runtime/package.json and package-lock.json.",
    "Run the packet's external gates, clean-install check, tests, and continuity reconciliation after those edits."
  ]
}
```

Claim-adjudication packets were not required: every iteration ended with zero active P0/P1 findings, and all 10 claim-adjudication events passed with `missingPackets: []`.

## Review Setup and Execution Contract

| Binding | Value |
|---|---|
| Review target | `.opencode/specs/system-speckit/053-spec-kit-runtime-rename` |
| Target type | `spec-folder` |
| Dimensions | `all` → correctness, security, traceability, maintainability |
| Artifact directory | `.opencode/specs/system-speckit/053-spec-kit-runtime-rename/review/lineages/luna-max-pass3` |
| Session | `fanout-luna-max-pass3-1788565027234-d7pbnn` |
| Executor | `cli-codex`, model `gpt-5.6-luna` |
| Execution | autonomous, inline, nested dispatch false |
| Lineage | requested `auto`, resolved `new`, generation 1 |
| Stop policy | `max-iterations` |
| Max iterations | 10 |
| Convergence threshold | 3, telemetry only before the terminal iteration |
| Graph/resource state | graphless fallback; no resource map present or emitted |

The artifact root was bound directly from `config.fanout_lineage_artifact_dir`; the resolve-artifact-root command was not run. No nested CLI, agent, task dispatch, repository validation, build, generated-context, or git write command was used.

## Active Finding Registry

| ID | Severity | Category | Dimension | Status | Primary evidence |
|---|---|---|---|---|---|
| F001 | P2 | maintainability | maintainability | open / active | `README.md:771`; `.opencode/bin/README.md:183` |
| F002 | P2 | traceability | traceability | open / active | `implementation-summary.md:54-57,77,89-109`; `runtime/package.json:41-44`; `package-lock.json:1176-1184` |

No findings were classified P0 or P1. No finding was resolved during this run, and no severity change or repeated-finding event was needed.

## Detailed Findings

### F001 — Live operator documentation retains an MCP identity label for the runtime package

Severity: `P2` · Dimension: maintainability · Class: documentation drift · Status: active

Evidence:

- `README.md:771` links to `.opencode/skills/system-spec-kit/runtime/stress-test/` but labels the package root `[mcp-server/]`.
- `.opencode/bin/README.md:183` says the runtime package's `ENV-REFERENCE.md` is the MCP server's document.
- `.opencode/skills/system-spec-kit/runtime/README.md:14,28` identifies `@spec-kit/runtime` as a compiled library, explicitly says it is not run as a service, and says it has no server process or transport of its own.

Impact: operators following the live documentation can infer that the renamed package still owns an MCP server or transport. That is a maintainability and naming-integrity defect, not evidence of an executable transport regression. MCP references belonging to the separate skill-advisor integration were not treated as runtime-rename residue.

Recommendation: change the two live labels to runtime/package language, keeping MCP terminology only where the referenced component is actually the skill-advisor MCP integration. Re-run the exact old-identity search after the edit.

Source content hashes:

- `README.md`: `sha256:d2b8192d2d4b337c0a04be8a5c150d95ffc8ab8ddbb3c2f2d470f3ce8e4735ec`
- `.opencode/bin/README.md`: `sha256:6fb96d12a1c052c9d3d0e483a98e1c6126f5ab4ed694d632413b24d485ceb3a1`

### F002 — Dependency audit arithmetic disagrees with the current runtime manifest

Severity: `P2` · Dimension: traceability · Class: evidence mismatch · Status: active

Evidence:

- `implementation-summary.md:54-57` says the package declares four dependencies instead of twelve.
- `implementation-summary.md:77` says eight of twelve entries went.
- `implementation-summary.md:89-102` contains three kept dependency rows and nine removed rows.
- `implementation-summary.md:109` repeats that twelve dependencies were cut to four.
- `runtime/package.json:41-44` currently declares three runtime dependencies: `@spec-kit/shared`, `better-sqlite3`, and `zod`.
- `package-lock.json:1176-1184` records the same three runtime dependencies.

Impact: the implementation packet is internally inconsistent about the final dependency state. The current manifest and lockfile are mutually aligned, so this finding does not by itself show a dependency-resolution failure; it weakens the packet's evidence trail and can mislead a later reviewer about what was removed.

Recommendation: reconcile the prose and file-action table with the current three-dependency manifest and nine-entry removal table, or state the counting convention if four refers to a different dependency set. Re-run the packet's evidence/metadata checks after the correction.

Source content hashes:

- `.opencode/specs/system-speckit/053-spec-kit-runtime-rename/implementation-summary.md`: `sha256:85e9843f7ba6d30ccc2918bfb3d2c4ea8f5e89dd1b2e977065af1ab7c2fc194b`
- `.opencode/skills/system-spec-kit/runtime/package.json`: `sha256:ee390d8ead51de2c02e34ac252b66a3090987a0a6a59e4c629a494b108d4023b`
- `.opencode/skills/system-spec-kit/package-lock.json`: `sha256:bff82ff61b4f26f2452ce9f09a74788f0160e1399af7eb7623314f7e50561a3b`

## Remediation Workstreams

### Workstream A — Operator terminology

Owner surface: `README.md` and `.opencode/bin/README.md`.

1. Replace the stale `[mcp-server/]` label and the “MCP server's” ownership phrase with package/runtime wording.
2. Preserve references that explicitly belong to `system-skill-advisor/mcp-server`.
3. Re-run the exact old path/name search against live in-scope surfaces and inspect the diff.

### Workstream B — Dependency evidence

Owner surface: `.opencode/specs/system-speckit/053-spec-kit-runtime-rename/implementation-summary.md`.

1. Align “four dependencies” and “eight of twelve” with the three runtime dependencies and nine removed rows, or add an explicit counting explanation.
2. Keep the manifest and lockfile as the authoritative current-state evidence.
3. Reconcile packet completion metadata only after the authoritative packet checks pass.

## Spec Seed

The review supports the packet's central rename claim: the runtime package is currently named `@spec-kit/runtime`, the workspace lockfile agrees, the scripts consumer and hook registrations use the runtime path, and the runtime README describes a library rather than a server. The seed for a follow-up spec update is limited to evidence/documentation reconciliation:

```yaml
review_follow_up:
  target: .opencode/specs/system-speckit/053-spec-kit-runtime-rename
  required:
    - resolve F001 live operator terminology drift
    - resolve F002 dependency count mismatch
    - preserve the runtime package/library contract
  non_goals:
    - redesign runtime hooks
    - change dependency ownership without fresh resolution evidence
    - remove skill-advisor MCP references that belong to that separate component
  gate:
    blocking_severity: P1
    current_blockers: 0
```

The target packet's own open completion context remains relevant: `AC-010` and `T009` were not marked complete by this review.

## Plan Seed

| Step | Observable result | Evidence |
|---|---|---|
| 1 | Live operator labels use runtime/package terminology | Updated `README.md` and `.opencode/bin/README.md`; exact-search output |
| 2 | Dependency prose and table match the final manifest | Updated implementation summary; manifest/lockfile comparison |
| 3 | Packet metadata is reconciled after the edits | Packet validation output and updated completion evidence |
| 4 | Runtime behavior remains supported | Authoritative tests, clean-install check, and external gates |
| 5 | Continuity state is current | Packet-scoped continuity save and freshness check |

The plan seed is a follow-up handoff, not work performed by this lineage. No source, packet, or continuity file outside the lineage was changed.

## Traceability Status

| Protocol | Status | Evidence/limit |
|---|---|---|
| `spec_code` | partial | Requirements and current implementation were compared; packet completion remains open for AC-010/T009. |
| `checklist_evidence` | partial | `checklist.md` is absent; no defect was created solely from that exemption. |
| `feature_catalog_code` | partial | Feature catalog is excluded from the bounded target scope. |
| `playbook_capability` | partial | Playbook content is excluded from the bounded target scope. |
| `skill_agent` | notApplicable | This target is a runtime package/spec folder, not a skill-agent contract. |
| `agent_cross_runtime` | notApplicable | No agent runtime implementation is in scope. |

## Deferred Items and Verification Limitations

The following are intentionally deferred and are not represented as claims of completion:

- external packet gates and completion validation;
- clean-install execution;
- test execution and build execution;
- generated-output or continuity metadata regeneration;
- continuity save, because the user prohibited writes outside the lineage and prohibited `generate-context.js`.

The graph/resource resolver was unavailable for this detached run. Coverage therefore uses graphless fallback: bounded direct reads, explicit target selection, and exact-search ledgers. No `resource-map.md` was present at initialization and none was emitted. Generated output, dependency trees, historical evidence, review trees, benchmarks, feature-catalog content, playbook content, and the data trigger index were excluded according to the configured reading budget.

## Dimension Expansion Map

| Dimension | Iterations | Review angles | Final result |
|---|---|---|---|
| Correctness | 1, 2, 3, 5, 9 | workspace identity, API/exports, consumers, build order, freshness traversal, manifest/lockfile alignment | no P0/P1; F002 remains traceability-adjacent |
| Security | 3, 4, 8, 10 | symlink/dangling-link boundaries, canonical path containment, hook target resolution, fail-closed permissions, socket/model-server perimeter | no active security finding |
| Traceability | 2, 5, 7, 10 | project references, spec/plan/tasks/AC evidence, dependency arithmetic, completion boundaries | F002 active P2 |
| Maintainability | 6, 8, 10 | retired identity residue, operator documentation, test isolation, follow-on change safety | F001 active P2 |

## Search Ledger

The ten deltas contain the full per-iteration ledgers. The final consolidated ledger is:

| Bug class / candidate | Disposition | Basis |
|---|---|---|
| workspace path resolution | ruled out | Current workspace and export inputs agree on the runtime location. |
| API contract and exports | ruled out | Runtime API barrel and known consumers use the renamed package surface. |
| dependency manifest alignment | finding | Current manifest/lockfile align, but packet arithmetic does not; linked to F002. |
| dist freshness boundary | ruled out | Freshness walker and focused tests handle generated directory and dangling symlinks. |
| hook target resolution | ruled out | Absolute regular-file overrides and normal walks are bounded and anchored. |
| path traversal / symlink escape | ruled out | Realpath containment and in-repository/symlink-escape cases are covered. |
| bounded process input | ruled out | Hook input/output/time limits and finite parsing behavior were reviewed. |
| permission fail-closed behavior | ruled out | Malformed, unknown, and failure paths deny by policy. |
| network/model-server bind perimeter | ruled out | Socket symlink and reclaim cases were covered in the relevant supervision tests. |
| retired identity residue | ruled out for tracked live runtime surfaces | Exact old path/name search returned no matching live in-scope references; dependency, generated, historical, and review trees were excluded. |
| operator documentation drift | finding | Two live labels retain MCP-server wording for the runtime destination; linked to F001. |
| verification evidence alignment | finding | Packet counts conflict with current manifest evidence; linked to F002. |
| test isolation | ruled out by source/test inspection; execution deferred | Helper cleanup and focused isolation boundaries were inspected, but tests were not run. |

## Audit Appendix

### Iteration record

| Run | Focus | Findings | New findings | Score | Decision |
|---:|---|---:|---:|---:|---|
| 1 | workspace/package identity and API surface | 2 | 2 | 0.42 | continue |
| 2 | consumer wiring and project-reference closure | 2 | 0 | 0.25 | continue |
| 3 | freshness traversal and symlink boundaries | 2 | 0 | 0.18 | continue |
| 4 | hook target resolution and containment | 2 | 0 | 0.14 | continue |
| 5 | manifest, lockfile, and dependency ownership | 2 | 0 | 0.11 | continue |
| 6 | live old-identity residue and operator docs | 2 | 0 | 0.08 | continue |
| 7 | packet evidence alignment | 2 | 0 | 0.06 | continue |
| 8 | test isolation and cross-runtime boundaries | 2 | 0 | 0.04 | continue |
| 9 | adversarial manifest/export/freshness replay | 2 | 0 | 0.03 | continue |
| 10 | terminal security and synthesis readiness | 2 | 0 | 0.02 | stop: maxIterationsReached |

All ten iterations were written as `iterations/iteration-001.md` through `iteration-010.md`, with matching `prompts/iteration-1.md` through `iteration-10.md` and `deltas/iter-001.jsonl` through `iter-010.jsonl`. Each iteration file ends with `Review verdict: PASS`.

### Route and scope proof

- Resolved route: `mode=review target_agent=deep-review`.
- Executor: `cli-codex:gpt-5.6-luna`.
- Execution: inline; nested dispatch false.
- Scope class: complex; 453 bounded files listed by `.opencode/specs/system-speckit/053-spec-kit-runtime-rename/scratch/review-scope.txt`.
- Review target was read-only. The only write surface was this lineage directory.
- The direct old-identity search covered live operator and runtime surfaces while excluding generated, dependency, historical, benchmark, and review trees.

### State and claim adjudication

`deep-review-state.jsonl` contains the initialization/config record, ten complete iteration records, ten passing claim-adjudication events, and one terminal `synthesis_complete` event. Every claim event reports `activeP0P1: 0` and `missingPackets: []`. Since no P0/P1 finding was active, typed claim-adjudication packets were not required.

### Convergence and terminal decision

Convergence telemetry declined from `0.42` to `0.02`, with full dimension coverage reached. The supplied threshold was preserved as `3`, but convergence was telemetry only until the terminal run. The `max-iterations` stop policy therefore ran all ten iterations and stopped at `maxIterationsReached`. The final review verdict is `PASS`, with two active P2 advisories and release readiness still `in-progress`.

### Lineage artifact inventory

- `deep-review-config.json`
- `deep-review-state.jsonl`
- `deep-review-findings-registry.json`
- `deep-review-strategy.md`
- `deep-review-dashboard.md`
- `review-report.md`
- `prompts/iteration-1.md` through `prompts/iteration-10.md`
- `iterations/iteration-001.md` through `iteration-010.md`
- `deltas/iter-001.jsonl` through `iter-010.jsonl`

No `resource-map.md` was created.

Review verdict: PASS
