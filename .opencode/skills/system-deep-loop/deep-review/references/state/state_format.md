---
title: Deep Review State Format
description: State file schemas for the autonomous deep review loop, config, JSONL log, strategy, iteration files, and review report.
trigger_phrases:
  - "deep review state format"
  - "deep review config schema"
  - "review severity weights"
  - "file protection levels"
  - "review iteration file structure"
importance_tier: important
contextType: implementation
version: 1.11.0.28
---

# Deep Review State Format

State file schemas for the autonomous deep review loop.

---

## 1. OVERVIEW

The deep review loop uses 8 state files under the resolved `{artifact_dir}/` owned by the target spec:

| File | Format | Mutability |
|------|--------|------------|
| `deep-review-config.json` | JSON | Immutable after init |
| `deep-review-state.jsonl` | JSON Lines | Append-only |
| `deep-review-findings-registry.json` | JSON | Auto-generated reducer state |
| `deep-review-strategy.md` | Markdown | Updated each iteration |
| `deep-review-dashboard.md` | Markdown | Auto-generated (read-only) |
| `.deep-review-pause` | Sentinel | Created/deleted by user |
| `review-report.md` | Markdown | Updated at synthesis |
| `iterations/iteration-NNN.md` | Markdown | Write-once |

```text
{artifact_dir}/
  deep-review-config.json
  deep-review-state.jsonl
  deep-review-findings-registry.json
  deep-review-strategy.md
  deep-review-dashboard.md
  .deep-review-pause
  review-report.md
  iterations/
    iteration-001.md
    iteration-002.md
    ...
```

`{artifact_dir}` comes from `resolveArtifactRoot(specFolder, 'review')`. Root-spec runs resolve directly to `{spec_folder}/review/`. Child-phase and sub-phase runs use **flat-first**: a first run with an empty `review/` resolves directly to `{spec_folder}/review/` (no `pt-NN` wrapper). A `pt-NN` packet is allocated only when prior content for a non-matching target already exists. Continuation runs reuse the existing flat artifact (or matching `pt-NN` packet).

### When to Use

- Validating deep-review state files emitted by an iteration or by the reducer.
- Implementing a state consumer (e.g. dashboard, advisor probe, downstream packet).
- Debugging JSONL reducer output or auditing schema-version transitions.
- Authoring fixtures that need to round-trip through the reducer.

---

## 2. CONFIG FILE (deep-review-config.json)

Created during initialization. Not modified after creation.

```json
{
  "topic": "Review of deep-review skill package",
  "mode": "review",
  "reviewTarget": "specs/030-deep-review-review-mode",
  "reviewTargetType": "spec-folder",
  "reviewDimensions": ["correctness", "security", "traceability", "maintainability"],
  "resource_map_present": false,
  "sessionId": "rvw-2026-04-03T12-00-00Z",
  "parentSessionId": null,
  "lineageMode": "new",
  "generation": 1,
  "continuedFromRun": null,
  "maxIterations": 7,
  "convergenceThreshold": 0.10,
  "stuckThreshold": 2,
  "severityThreshold": "P2",
  "crossReference": {
    "core": ["spec_code", "checklist_evidence"],
    "overlay": ["feature_catalog_code", "playbook_capability"]
  },
  "qualityGateThreshold": true,
  "releaseReadinessState": "in-progress",
  "specFolder": "030-deep-review-review-mode",
  "createdAt": "2026-03-24T14:00:00Z",
  "status": "initialized",
  "executionMode": "auto",
  "fileProtection": {
    "deep-review-config.json": "immutable",
    "deep-review-state.jsonl": "append-only",
    "deep-review-findings-registry.json": "auto-generated",
    "deep-review-strategy.md": "mutable",
    "deep-review-dashboard.md": "auto-generated",
    ".deep-review-pause": "operator-controlled",
    "review-report.md": "mutable",
    "review-report-v*.md": "write-once",
    "iteration-*.md": "write-once"
  },
  "reducer": {
    "enabled": true,
    "inputs": ["latestJSONLDelta", "newIterationFile", "priorReducedState"],
    "outputs": ["findingsRegistry", "dashboardMetrics", "strategyUpdates"],
    "metrics": [
      "dimensionsCovered",
      "findingsBySeverity",
      "openFindings",
      "resolvedFindings",
      "convergenceScore"
    ]
  }
}
```

### Field Reference

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| mode | `"review"` | -- | Session mode discriminator (required) |
| reviewTarget | string | -- | Path or identifier of the review target |
| reviewTargetType | string | `"spec-folder"` | `spec-folder`, `skill`, `agent`, `track`, `files` |
| reviewDimensions | string[] | all 4 | Dimensions to evaluate |
| resource_map_present | boolean | false | True only when `{specFolder}/resource-map.md` existed during init, enables the Resource Map Coverage audit pass and conditional report section |
| sessionId | string | -- | Stable identifier for the current review lineage |
| parentSessionId | string \| null | `null` | Parent lineage reference for restart flows |
| lineageMode | string | `"new"` | `new`, `resume`, `restart`. `fork` and `completed-continue` are deferred and not emitted by the current runtime |
| generation | number | 1 | Lineage generation number, incremented on `restart`, unchanged on `resume` |
| continuedFromRun | number \| null | `null` | Count of completed iteration records at the lifecycle boundary (set on `resume` and `restart`) |
| maxIterations | number | 7 | Hard cap on loop iterations |
| convergenceThreshold | number | 0.10 | Stop when severity-weighted new findings ratio below this |
| stuckThreshold | number | 2 | Consecutive no-progress iterations before recovery |
| severityThreshold | string | `"P2"` | Minimum severity to report: `P0`, `P1`, `P2` |
| crossReference | object | -- | Core (hard-gated) and overlay (advisory) protocol sets |
| qualityGateThreshold | boolean | true | Whether binary quality gates are enforced |
| specFolder | string | -- | Spec folder path (relative to specs/) |
| status | string | `"initialized"` | `initialized`, `running`, `converged`, `stuck`, `complete`, `error` |
| releaseReadinessState | string | `"in-progress"` | `in-progress`, `converged`, `release-blocking` |
| fileProtection | object | -- | Mutability declarations (see protection levels below) |
| reducer | object | -- | Canonical reducer inputs, outputs, and metrics names |

### File Protection Levels

| Level | Meaning |
|-------|---------|
| immutable | Cannot be modified after creation |
| append-only | New content added at end only |
| mutable | Can be read, edited, overwritten |
| write-once | Created once, never modified |
| auto-generated | System-managed, overwritten each refresh |
| operator-controlled | Created or deleted only by the human/operator to control loop state |

### Review Dimensions

| Dimension | Priority | Required for Coverage |
|-----------|----------|---------------------|
| correctness | 1 | Yes |
| security | 2 | Yes |
| traceability | 3 | Yes |
| maintainability | 4 | Yes |

### Severity Weights

| Severity | Weight | Label | Requires file:line |
|----------|--------|-------|--------------------|
| P0 | 10.0 | Blocker | Yes |
| P1 | 5.0 | Required | Yes |
| P2 | 1.0 | Suggestion | Yes |

---

## 3. STATE LOG

The `deep-review-state.jsonl` record schemas (config, iteration, event, lineage) and the Review Depth Schema (v2) live in `state_jsonl.md` for navigability.

---

## 4. STRATEGY FILE (deep-review-strategy.md)

Updated at the end of each iteration. Serves as the persistent brain across fresh-context iterations.

### Required Sections

| Section | Updated By | Purpose |
|---------|-----------|---------|
| topic | Init only | Review topic from config |
| review-dimensions | Each iteration | Unchecked dimensions drive next focus |
| completed-dimensions | Each iteration | Checked dimensions with verdict summary |
| running-findings | Each iteration | P0/P1/P2 active counts + deltas |
| what-worked | Each iteration | Successful approaches for reuse |
| what-failed | Each iteration | Failed approaches to avoid |
| exhausted-approaches | When fully tried | "Do not retry" registry |
| ruled-out-directions | Each iteration | Eliminated directions with reasons |
| next-focus | Each iteration | Recommended direction for next iteration |
| known-context | Init only | Prior work from memory context |
| cross-reference-status | Each iteration | Core vs overlay protocol status |
| files-under-review | Each iteration | Per-file coverage state table |
| review-boundaries | Init only | Max iterations, thresholds, config |

### Mapping from Research Mode

| Review Section | Research Equivalent |
|---------------|-------------------|
| review-dimensions | Key Questions (remaining) |
| completed-dimensions | Answered Questions |
| running-findings | _(none, review-specific)_ |
| cross-reference-status | _(none, review-specific)_ |
| files-under-review | _(none, review-specific)_ |
| review-boundaries | Research Boundaries |

Sections unchanged from research: topic, what-worked, what-failed, exhausted-approaches, ruled-out-directions, next-focus, known-context.

### Update Protocol

1. Read current strategy file
2. Move completed dimensions from "remaining" to "completed" with `[x]` and verdict
3. Update running-findings with P0/P1/P2 counts and deltas
4. Add to what-worked / what-failed with iteration number
5. Move exhausted approaches. Update cross-reference-status and files-under-review
6. Set next-focus based on remaining dimensions and open findings

---

## 5. FINDINGS REGISTRY (deep-review-findings-registry.json)

Reducer-owned JSON document regenerated after every iteration and lifecycle transition.

```json
{
  "sessionId": "rvw-2026-04-03T12-00-00Z",
  "generation": 1,
  "lineageMode": "resume",
  "openFindings": [],
  "resolvedFindings": [],
  "blockedStopHistory": [],
  "persistentSameSeverity": [],
  "severityChanged": [],
  "repeatedFindings": [],
  "dimensionCoverage": {
    "correctness": true,
    "security": true,
    "traceability": false,
    "maintainability": false
  },
  "findingsBySeverity": {
    "P0": 0,
    "P1": 1,
    "P2": 2
  },
  "openFindingsCount": 3,
  "resolvedFindingsCount": 1,
  "convergenceScore": 0.44,
  "graphConvergenceScore": 1.01,
  "graphDecision": "STOP_ALLOWED",
  "graphBlockers": [],
  "corruptionWarnings": []
}
```

This file is machine-owned and must stay synchronized with the latest iteration delta, dashboard metrics, and synthesized review report.

### Blocked-Stop and Corruption-Tracking Additions

| Field | Type | Description |
|-------|------|-------------|
| `blockedStopHistory` | array | One entry per `blocked_stop` JSONL event: `{run, blockedBy, gateResults, recoveryStrategy, timestamp}`. Rendered in the dashboard `BLOCKED STOPS` section and can drive the strategy `next-focus` anchor when blocked-stop is the most recent loop event. |
| `persistentSameSeverity` | array | Findings observed in ≥2 iterations with NO severity transitions beyond initial discovery. REQ-018 split of the deprecated `repeatedFindings` bucket. |
| `severityChanged` | array | Findings that went through at least one severity transition (P0↔P1↔P2) in their `transitions` history. |
| `repeatedFindings` | array | **Deprecated.** Union of `persistentSameSeverity` and `severityChanged`. Retained for backward compatibility, new code should read the split arrays. |
| `corruptionWarnings` | array | Per-line corruption reports from `parseJsonlDetailed()`: `{line, raw, error}`. Non-empty means the reducer detected malformed JSONL. |

### Default Values

When no `graph_convergence` event has been recorded yet, defaults are `graphConvergenceScore: 0`, `graphDecision: null`, and `graphBlockers: []`.
When no `blocked_stop` event has been recorded yet, `blockedStopHistory: []`.
When JSONL parses cleanly, `corruptionWarnings: []`.

### Fail-Closed Semantics (REQ-015, REQ-016)

- **Malformed JSONL**: The reducer CLI exits with code `2` and writes a warning to stderr when `corruptionWarnings.length > 0`. Pass `--lenient` (or `lenient:true` to `reduceReviewState`) to escape-hatch out and preserve the v1.2.0.0 fail-open behavior for legacy packets.
- **Missing machine-owned anchors**: `replaceAnchorSection()` throws `Error('Missing machine-owned anchor "<id>" in deep-review strategy file.')` when the strategy file is present but lacks one of the required anchors. Pass `--create-missing-anchors` (or `createMissingAnchors:true`) to bootstrap empty strategy files by appending the missing anchor blocks.
- **Dashboard surfaces**: `CORRUPTION WARNINGS` section lists detected lines. `BLOCKED STOPS` section lists `blockedStopHistory` entries. `GRAPH CONVERGENCE` section reports `graphConvergenceScore` / `graphDecision` / `graphBlockers`.
- **Strategy next-focus override**: When the latest `blocked_stop` event timestamp is newer than the latest iteration timestamp, the reducer rewrites the strategy `next-focus` anchor to surface the blocking gates and recovery hint so operators see the blocker before choosing the next iteration direction.

---

## 6. ITERATION FILES (review/iterations/iteration-NNN.md)

Write-once files. One per iteration, zero-padded 3-digit naming.

### Structure

```markdown
# Iteration [N]: [Focus Area]

## Focus
[Dimension(s), files, scope investigated]

## Scorecard
- Dimensions covered: [list]
- Files reviewed: [count]
- New findings: P0=[n] P1=[n] P2=[n]
- Refined findings: P0=[n] P1=[n] P2=[n]
- New findings ratio: [0.0-1.0]

## Findings

### P0, Blocker
- **F[NNN]**: [Title], `file:line`, [Description with evidence]

### P1, Required
- **F[NNN]**: [Title], `file:line`, [Description with evidence]

### P2, Suggestion
- **F[NNN]**: [Title], `file:line`, [Description with evidence]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass/partial/fail | hard | file:line | ... |

## Assessment
- New findings ratio: [0.0-1.0]
- Dimensions addressed: [list]
- Novelty justification: [breakdown]

## Ruled Out
- [Approach]: [Why], [Evidence]

## Dead Ends
- [Direction]: [Why]

## Recommended Next Focus
[What to investigate next]
```

Every finding must include: unique ID (`F001`...), severity (`P0`/`P1`/`P2`), concrete `file:line` evidence, and dimension tag.

---

## 7. REVIEW REPORT (review/review-report.md)

The review synthesis output contains 9 core sections plus a conditional `## Resource Map Coverage Gate` section when `resource_map_present` is true:

| # | Section | Description |
|---|---------|-------------|
| 1 | Executive Summary | Verdict, active P0/P1/P2 counts, scope, `hasAdvisories` flag |
| 2 | Planning Trigger | Why result routes to planning or changelog |
| 3 | Active Finding Registry | Deduped active findings with evidence, severity, dimension |
| 4 | Remediation Workstreams | Ordered lanes grouped by dependency or area |
| 5 | Spec Seed | Minimal spec updates implied by findings |
| 6 | Plan Seed | Initial remediation tasks from findings |
| 7 | Traceability Status | Core vs overlay protocol outcomes and gaps |
| 8 | Resource Map Coverage Gate | Present only when `{spec_folder}/resource-map.md` existed at init, contains touched entries, untouched entries (`expected-by-scope` vs `gap`), and implementation paths absent from the map |
| 9 | Deferred Items | Advisory findings, blocked items, follow-up checks |
| 10 | Audit Appendix | Coverage, convergence replay, audit detail |

**Executive Summary** includes verdict (`PASS`/`CONDITIONAL`/`FAIL`), active finding counts, `hasAdvisories` boolean (PASS + P2 > 0), scope description, and convergence reason.

**Planning Trigger** routes FAIL/CONDITIONAL to remediation planning, PASS to changelog creation.

**Active Finding Registry** lists each active finding with findingId, severity, dimension, title, file:line evidence, first/last seen iteration, and status.

**Remediation Workstreams** group related findings into ordered lanes with constituent finding IDs and execution order.

**Spec Seed / Plan Seed** provide minimal spec updates and initial remediation tasks referencing finding IDs and target files.

**Traceability Status** reports per-protocol pass/partial/fail with gating class and evidence.

**Resource Map Coverage Gate** is emitted only when `resource_map_present` is true and MUST contain exactly three bullets: touched entries, untouched entries (`expected-by-scope` vs `gap`), and implementation paths absent from the map.

**Deferred Items** captures advisory findings, blocked protocols, and future follow-up checks.

**Audit Appendix** contains iteration table, convergence signal replay, file coverage matrix, and dimension breakdown.

---

## 8. DASHBOARD (review/deep-review-dashboard.md)

Auto-generated summary. Never manually edited.

- **Path**: `{artifact_dir}/deep-review-dashboard.md`
- **Generated from**: JSONL state log + strategy + findings registry
- **Refresh**: Regenerated after every iteration
- **Protection**: `auto-generated` in fileProtection

### Sections

| Section | Source | Description |
|---------|--------|-------------|
| Findings Summary | JSONL | Active P0/P1/P2 counts, new vs refined |
| Progress Table | JSONL | Run, status, focus, dimensions, ratio, duration |
| Coverage | Strategy + JSONL | Dimension completion, file coverage, protocol status |
| Trend | JSONL signals | Rolling average, composite stop score, trajectory |

**Rules:** Sole inputs are JSONL + strategy. Overwrite entirely on refresh. Read-only for all agents.

---

## 9. CLAIM ADJUDICATION

Every new P0/P1 finding must carry a **typed claim-adjudication packet**. The packet is parsed by `step_post_iteration_claim_adjudication` in the review workflow and its pass/fail result is persisted as a `claim_adjudication` event in `deep-review-state.jsonl`. The next iteration's `step_check_convergence` legal-stop decision tree reads the latest event via `claimAdjudicationGate` (gate `f`), a missing or failed packet vetoes STOP even if every other gate passes. Prose-only adjudication blocks are no longer accepted.

### Typed Packet Schema (required)

Embed the packet inside the iteration file for each new P0/P1 finding. The orchestrator parses it after evaluation and persists the validation result.

```json
{
  "findingId": "F003",
  "claim": "Coverage-graph upsert identity is bare `id`, so cross-session collisions overwrite prior rows.",
  "evidenceRefs": [
    ".opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts:154",
    ".opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts:292-302"
  ],
  "counterevidenceSought": "Grepped the module for compound-key upserts, checked migration scripts, and inspected session-isolation.vitest.ts for a collision regression, none found.",
  "alternativeExplanation": "Could be intentional single-tenant design, but REQ-024 explicitly requires session isolation, so this is rejected.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "If a composite primary key `(spec_folder, loop_type, session_id, id)` lands and a collision regression covers the ID-reuse path, downgrade to P2 tech-debt.",
  "transitions": [
    { "iteration": 2, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `findingId` | string | Must match the finding ID in the iteration body and registry |
| `claim` | string | The single assertion the finding makes (one sentence, evidence-backed) |
| `evidenceRefs` | string[] | `file:line` or `file:range` citations that substantiate the claim (at least one entry) |
| `counterevidenceSought` | string | Where the reviewer looked for contradicting evidence (commands, paths, docs), blank string is not acceptable |
| `alternativeExplanation` | string | An alternative reading of the evidence, even if the reviewer rejects it |
| `finalSeverity` | `"P0"` \| `"P1"` \| `"P2"` | Severity after adjudication (may differ from the severity originally asserted) |
| `confidence` | number `[0, 1]` | Reviewer confidence in `finalSeverity` |
| `downgradeTrigger` | string | The concrete condition under which this finding should be downgraded in a future iteration |
| `transitions` | object[] | Optional severity transition log, required when `finalSeverity` differs from the originally asserted severity |

### Validation Rules (enforced by `step_post_iteration_claim_adjudication`)

1. A packet MUST exist for every new P0/P1 finding introduced in this iteration. Carried-forward findings reuse the previous packet unless severity transitioned.
2. All required fields MUST be present and non-empty. `confidence` MUST be a number in `[0, 1]`.
3. Each `evidenceRefs` entry MUST contain a `:` separating the path from a line or range.
4. `finalSeverity` MUST match the severity the finding is registered under in the iteration's `Findings` section and in `deep-review-findings-registry.json`.
5. When any rule fails, the workflow appends `{"event":"claim_adjudication","passed":false,"missingPackets":[...]}` to the state log. The next `step_check_convergence` call reads that event and sets `claimAdjudicationGate` = `false`, producing a `blockedStop` event with `blockedBy: ["claimAdjudicationGate"]` until a follow-up iteration rewrites the packet.

### Severity Transition Rules

- **P2 → P1**: confirmed exploitable impact or spec violation with direct evidence
- **P1 → P0**: demonstrated data loss, security breach, or hard-gate failure
- **Downgrade**: requires explicit counterevidence or a confirmed alternative explanation
- Every transition is recorded in the packet's `transitions` array and mirrored into the finding registry's `transitions` field

---

## 10. FINDING REGISTRY

Each finding is tracked with a unique identifier enabling deduplication, severity transitions, and status lifecycle.

### Schema

```json
{
  "findingId": "F003",
  "severity": "P1",
  "category": "resource-map-coverage",
  "status": "active",
  "dimension": "traceability",
  "title": "Applied target file missing from resource-map inventory",
  "file": ".opencode/commands/deep/assets/deep_review_auto.yaml",
  "line": 955,
  "firstSeen": 2,
  "lastSeen": 4,
  "transitions": [
    { "iteration": 2, "from": null, "to": "P2", "reason": "Initial discovery" },
    { "iteration": 4, "from": "P2", "to": "P1", "reason": "Confirmed real coverage gap against applied target inventory" }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| findingId | string | Sequential unique ID: `F001`, `F002`, ... |
| severity | `"P0"` / `"P1"` / `"P2"` | Current severity |
| category | `"correctness"` / `"security"` / `"traceability"` / `"maintainability"` / `"resource-map-coverage"` | Primary audit category for the finding, `resource-map-coverage` is reserved for implementation-vs-map coverage gaps |
| status | `"active"` / `"resolved"` / `"deferred"` / `"disproved"` | Current status |
| dimension | string | Primary dimension: correctness, security, traceability, maintainability |
| title | string | Short description |
| file | string | File path |
| line | number | Line number (approximate) |
| firstSeen / lastSeen | number | Iteration where first discovered / last referenced |
| transitions | array | Severity and status change history |

### Status Lifecycle

```text
[discovered] --> active --> resolved    (fixed or confirmed non-issue)
                  |
                  +--> deferred    (advisory, below threshold)
                  |
                  +--> disproved   (counterevidence invalidated)
```

| Status | Counts Toward Verdict |
|--------|----------------------|
| active | Yes |
| resolved | No |
| deferred | No (listed in Deferred Items) |
| disproved | No |

### Deduplication

Same file + line range + root cause as an existing finding = **refinement**, not new. The existing findingId is updated. Refinements count at half weight (`refinementMultiplier: 0.5`) and are tracked via `findingsRefined` in JSONL.

### Cross-Reference Protocols

| Protocol | Level | Applies To | Gate |
|----------|-------|------------|------|
| spec_code | core | all types | hard |
| checklist_evidence | core | all types | hard |
| skill_agent | overlay | skill | advisory |
| agent_cross_runtime | overlay | agent | advisory |
| feature_catalog_code | overlay | skill, spec-folder, track, files | advisory |
| playbook_capability | overlay | skill, agent, spec-folder | advisory |

Severity for `resource-map-coverage` findings is calibrated to the coverage-gate outcome:
- `P2` when an untouched map entry is explicitly `expected-by-scope`
- `P1` when an untouched or absent path represents a real coverage gap
- `P0` only when the missing coverage masks a release-blocking correctness or security risk

### Quality Gates

| Gate | Rule |
|------|------|
| Evidence | Every active finding backed by concrete file:line evidence |
| Scope | Reviewed files and conclusions stay inside declared scope |
| Coverage | Required dimensions and required protocols covered |

All three gates must pass before STOP. Gate failure forces `verdict: "FAIL"` regardless of finding counts.