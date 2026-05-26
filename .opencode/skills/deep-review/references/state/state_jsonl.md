---
title: Deep Review State Log Records
description: JSONL state-log record schemas (config, iteration, event, lineage) and the Review Depth Schema v2 for the deep review loop.
---

# Deep Review State Log Records

The `deep-review-state.jsonl` log is the append-only source of truth for a review run. This reference documents the config, iteration, event, and lineage record schemas plus the Review Depth Schema (v2) that the reducer consumes.

---

## 1. OVERVIEW

### Purpose

This reference defines the append-only JSONL records that preserve deep-review run state. It covers config, iteration, event, lineage, graph, verdict, traceability, and Review Depth Schema v2 records so reducers and validators can replay the loop deterministically.

### When to Use

- Validating `deep-review-state.jsonl` shape before changing reducers, dashboards, or workflow emission.
- Debugging malformed state records, blocked-stop events, graph convergence events, or lineage fields.
- Adding or checking Review Depth Schema v2 target selection, search coverage, and ledger fields.
- Confirming which fields are required before writing iteration, synthesis, pause, or recovery events.

### Key Sources

| Source | Purpose |
|--------|---------|
| Config record | Establishes session identity, lineage, thresholds, and spec folder routing. |
| Iteration record | Captures focus, reviewed files, findings, convergence ratios, and graph events. |
| Event records | Persist synthesis, blocked-stop, graph convergence, pause, and stuck-recovery decisions. |
| Review Depth Schema v2 | Adds target selection, search coverage, and ledger proof for deeper review iterations. |

---

## 2. STATE LOG (DEEP-REVIEW-STATE.JSONL)

Append-only JSON Lines file. One JSON object per line.

### Line 1: Config Record

```json
{"type":"config","mode":"review","topic":"...","reviewTarget":"...","sessionId":"rvw-...","parentSessionId":null,"lineageMode":"new","generation":1,"continuedFromRun":null,"maxIterations":7,"convergenceThreshold":0.10,"createdAt":"2026-03-24T14:00:00Z","specFolder":"..."}
```

### Iteration Records

```json
{
  "type": "iteration", "mode": "review", "run": 3, "status": "complete",
  "focus": "D3 Traceability - skill/runtime alignment",
  "dimensions": ["traceability", "maintainability"],
  "filesReviewed": [".opencode/skills/deep-research/README.md"],
  "sessionId": "rvw-2026-04-03T12-00-00Z",
  "parentSessionId": null,
  "lineageMode": "resume",
  "generation": 1,
  "continuedFromRun": null,
  "findingsCount": 4,
  "findingsSummary": { "P0": 0, "P1": 1, "P2": 3 },
  "findingsNew": { "P0": 0, "P1": 1, "P2": 1 },
  "findingDetails": [
    {
      "id": "P1-001",
      "severity": "P1",
      "title": "Missing consumer update",
      "dimension": "correctness",
      "file": "path/to/file.ts:42",
      "evidence": "Observed consumer still reads the old field.",
      "recommendation": "Update the consumer and add verification.",
      "disposition": "active",
      "findingClass": "cross-consumer",
      "scopeProof": "rg evidence covering producers and consumers",
      "affectedSurfaceHints": ["producer/helper", "consumer/status"]
    }
  ],
  "newFindingsRatio": 0.32,
  "timestamp": "2026-03-24T14:30:00Z", "durationMs": 52000
}
```

**Required fields:** `type`, `mode`, `run`, `status`, `focus`, `dimensions`, `filesReviewed`, `findingsCount`, `findingsSummary`, `findingsNew`, `findingDetails`, `newFindingsRatio`, `sessionId`, `generation`, `lineageMode`, `timestamp`, `durationMs`

**Optional fields:** `parentSessionId`, `continuedFromRun`, `findingsRefined`, `findingRefs`, `traceabilityChecks`, `coverage`, `noveltyJustification`, `ruledOut`, `focusTrack`, `scoreEstimate`, `segment`, `convergenceSignals`, `graphEvents`

| Required Field | Type | Description |
|---------------|------|-------------|
| mode | `"review"` | Session mode discriminator |
| dimensions | string[] | Review dimensions addressed this iteration |
| filesReviewed | string[] | Files examined |
| sessionId | string | Current lineage session identifier |
| generation | number | Lineage generation number |
| lineageMode | string | Lifecycle mode used for this run |
| findingsSummary | object | Total active findings: `{ P0, P1, P2 }` |
| findingsNew | object | Net-new findings this iteration: `{ P0, P1, P2 }` |
| findingDetails | array | Active findings with `id`, `severity`, `title`, `dimension`, `file`, `evidence`, `recommendation`, `disposition`, `findingClass`, `scopeProof`, and `affectedSurfaceHints`, use `[]` when there are no findings |
| newFindingsRatio | number | Severity-weighted new findings ratio (0.0-1.0) |

### Convergence Signals

| Signal | Weight | Description |
|--------|--------|-------------|
| rollingAvg | 0.30 | Rolling average of severity-weighted new findings |
| madScore | 0.25 | Noise-floor test against MAD-derived churn |
| dimensionCoverage | 0.45 | Required dimension + protocol coverage stability |
| compositeStop | -- | Weighted stop score (stop if > 0.60) |

**Severity math:** `refinementMultiplier: 0.5`, `p0OverrideMinRatio: 0.50`, `noFindingsRatio: 0.0`

### Graph Events

The optional `graphEvents` array records coverage graph mutations emitted by a review iteration. The MCP coverage graph handlers (`mcp_server/handlers/coverage-graph/upsert.ts`) consume these events and persist them into `deep-loop-graph.sqlite`, where they become the source of truth for graph-assisted convergence, hotspot saturation, and blocked-stop evidence.

```json
{
  "type": "iteration", "mode": "review", "run": 4, "status": "complete",
  "focus": "correctness",
  "dimensions": ["correctness"],
  "filesReviewed": ["src/api/session.ts"],
  "findingsSummary": { "P0": 0, "P1": 1, "P2": 0 },
  "findingsNew": { "P0": 0, "P1": 1, "P2": 0 },
  "newFindingsRatio": 0.18,
  "sessionId": "rvw-2026-03-24T10-00-00Z",
  "generation": 1,
  "lineageMode": "new",
  "graphEvents": [
    { "type": "dimension", "id": "d-correctness", "label": "correctness" },
    { "type": "file", "id": "file-session-ts", "label": "src/api/session.ts" },
    { "type": "finding", "id": "f-001", "label": "Missing CSRF token check on session POST" },
    { "type": "evidence", "id": "ev-001", "label": "src/api/session.ts:42" },
    { "type": "edge", "id": "e-in-dim-f-001", "relation": "IN_DIMENSION", "source": "f-001", "target": "d-correctness" },
    { "type": "edge", "id": "e-in-file-f-001", "relation": "IN_FILE", "source": "f-001", "target": "file-session-ts" },
    { "type": "edge", "id": "e-evidence-f-001", "relation": "EVIDENCE_FOR", "source": "ev-001", "target": "f-001" }
  ],
  "timestamp": "2026-03-24T10:12:00Z",
  "durationMs": 51000
}
```

#### Event payload shape

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | `"dimension"` \| `"file"` \| `"finding"` \| `"evidence"` \| `"remediation"` \| `"edge"` | Yes | Review-loop node kind or the literal `"edge"` for relation rows |
| id | string | Yes | Caller-chosen logical id. Must be unique **within** a single `(specFolder, loopType, sessionId)` namespace, see Namespace Rules below |
| label | string | Yes | Human-readable name/caption (dimension, path, finding title, evidence anchor, etc.) |
| relation | `"COVERS"` \| `"EVIDENCE_FOR"` \| `"CONTRADICTS"` \| `"RESOLVES"` \| `"CONFIRMS"` \| `"ESCALATES"` \| `"IN_DIMENSION"` \| `"IN_FILE"` | edges only | Review relation type. Required when `type == "edge"` |
| source | string | edges only | `id` of the source node inside the current namespace |
| target | string | edges only | `id` of the target node inside the current namespace. Self-loops are rejected by the upsert handler |
| metadata | object | No | Optional free-form metadata persisted alongside the row (e.g. `{ "hotspot_score": 2 }`) |

#### Namespace Rules (REQ-028, REQ-029)

`graphEvents` entries are scoped by the session that emits them. The coverage graph DB uses a composite primary key of `(spec_folder, loop_type, session_id, id)`, so two independent review sessions in the same spec folder MAY reuse the same logical `id` without collision, each session gets its own row.

Concrete obligations for producers:

1. **Session-local uniqueness**: within one session, an `id` must resolve to exactly one node (or edge) for its entire lifetime. Re-emitting the same `id` is an upsert against the existing row in that session only.
2. **No cross-session global uniqueness requirement**: callers MUST NOT prefix ids with the session id or random salt to "avoid collisions". The DB layer handles namespace isolation. Salting ids only makes provenance harder to read.
3. **Edge source/target locality**: `source` and `target` in an edge event must name nodes already present in the same namespace. Cross-session edges are not a supported shape.
4. **Persistence gate**: the reducer refuses to roll graph events forward when a record is missing `sessionId` on the surrounding iteration record, because the DB cannot route the write.

The collision regression in `.opencode/skills/system-spec-kit/scripts/tests/session-isolation.vitest.ts` ("shared-ID collisions" block) exercises this contract directly: two sessions upsert identical node and edge ids, and both rows must survive independently.

### Synthesis Event

```json
{
  "type": "event", "event": "synthesis_complete", "mode": "review",
  "totalIterations": 6, "verdict": "PASS",
  "activeP0": 0, "activeP1": 0, "activeP2": 2,
  "dimensionCoverage": 1.0, "stopReason": "composite_converged",
  "timestamp": "2026-03-24T15:02:00Z"
}
```

**Required:** `type`, `event`, `mode`, `totalIterations`, `verdict`, `activeP0`, `activeP1`, `activeP2`, `dimensionCoverage`, `stopReason`, `timestamp`

### Blocked-Stop Event

When the review legal-stop decision tree returns `blocked`, append a first-class `blocked_stop` event instead of silently overriding STOP to CONTINUE.

```json
{
  "type": "event",
  "event": "blocked_stop",
  "mode": "review",
  "run": 4,
  "blockedBy": ["dimensionCoverageGate", "p0ResolutionGate"],
  "gateResults": {
    "convergenceGate": { "pass": true, "score": 0.72 },
    "dimensionCoverageGate": {
      "pass": false,
      "covered": ["correctness", "security"],
      "missing": ["traceability", "maintainability"]
    },
    "p0ResolutionGate": { "pass": false, "activeP0": 1 },
    "evidenceDensityGate": { "pass": true, "avgEvidencePerFinding": 1.5 },
    "hotspotSaturationGate": { "pass": true },
    "claimAdjudicationGate": { "pass": true, "activeP0P1": 2 },
    "fixCompletenessReplayGate": { "pass": true, "securitySensitive": false, "requiredRows": 0, "passingRows": 0 },
    "candidateCoverageGate": { "pass": true, "searchDebt": [], "missing": [] },
    "graphlessFallbackGate": { "pass": true, "mode": "graph_available", "missing": [], "unavailabilityReason": "" }
  },
  "recoveryStrategy": "Cover the missing review dimensions, then resolve the active P0.",
  "timestamp": "2026-04-11T09:45:00Z",
  "sessionId": "rvw-2026-04-11T09-00-00Z",
  "generation": 1
}
```

`gateResults` carries the full 9-gate set emitted by `step_emit_blocked_stop` in both `deep_start-review-loop_{auto,confirm}.yaml`: `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, `hotspotSaturationGate`, `claimAdjudicationGate`, `fixCompletenessReplayGate`, `candidateCoverageGate`, and `graphlessFallbackGate`. The last two are v2-rollout gates that pass trivially when the review-depth-v2 search path is inactive. See `../convergence/convergence.md` §Section-1 for the authoritative shape.

**Required:** `type`, `event`, `mode`, `run`, `blockedBy`, `gateResults`, `recoveryStrategy`, `timestamp`, `sessionId`, `generation`

### Graph Convergence Event

Before the inline 3-signal review vote is allowed to finalize STOP, the workflow must append a `graph_convergence` event for the current review lineage.

```json
{
  "type": "event",
  "event": "graph_convergence",
  "mode": "review",
  "run": 4,
  "decision": "STOP_ALLOWED",
  "signals": {
    "dimensionCoverage": 1,
    "findingStability": 0.88,
    "p0ResolutionRate": 1,
    "evidenceDensity": 1.4,
    "hotspotSaturation": 0.75
  },
  "blockers": [],
  "timestamp": "2026-04-11T09:44:00Z",
  "sessionId": "rvw-2026-04-11T09-00-00Z",
  "generation": 1
}
```

**Required:** `type`, `event`, `mode`, `run`, `decision`, `signals`, `blockers`, `timestamp`, `sessionId`, `generation`

**Decision enum:** `CONTINUE`, `STOP_ALLOWED`, `STOP_BLOCKED`

**Combined-stop rule:** Final STOP is legal only when the inline review convergence decision says STOP and the latest `graph_convergence.decision == "STOP_ALLOWED"`. If the latest graph decision is `STOP_BLOCKED`, set `stop_blocked=true`, emit `blocked_stop`, and continue recovery instead of stopping. If the latest graph decision is `CONTINUE`, downgrade the inline STOP candidate to CONTINUE.

### Normalized Pause and Recovery Events

Pause and recovery events MUST use the frozen shared stop-reason enum at emission time:

`converged`, `maxIterationsReached`, `blockedStop`, `stuckRecovery`, `error`, `manualStop`, `userPaused`

Raw `paused` and `stuck_recovery` labels are not legal persisted event names in the review JSONL contract. The workflow must rewrite them before appending JSONL rows.

```json
{
  "type": "event",
  "event": "userPaused",
  "mode": "review",
  "stopReason": "userPaused",
  "reason": "sentinel file detected",
  "timestamp": "2026-04-11T09:32:00Z",
  "sessionId": "rvw-2026-04-11T09-00-00Z",
  "generation": 1
}
```

```json
{
  "type": "event",
  "event": "stuckRecovery",
  "mode": "review",
  "stopReason": "stuckRecovery",
  "fromIteration": 5,
  "strategy": "Traceability protocol replay: re-run unresolved core or overlay checks",
  "targetDimension": "traceability",
  "outcome": "pending",
  "reason": "Recovery path activated after repeated no-progress iterations",
  "timestamp": "2026-04-11T09:40:00Z",
  "sessionId": "rvw-2026-04-11T09-00-00Z",
  "generation": 1
}
```

**Emission rule:** If runtime logic first identifies a raw `paused` or `stuck_recovery` condition, the workflow MUST normalize it to `userPaused` or `stuckRecovery` before writing the JSONL line. Reducers and dashboards may assume persisted event names are already normalized.

### Verdict Rules

| Verdict | Condition | Next Command |
|---------|-----------|--------------|
| FAIL | `activeP0 > 0` OR quality gate failure | `/speckit:plan` |
| CONDITIONAL | `activeP0 == 0` AND `activeP1 > 0` | `/speckit:plan` |
| PASS | `activeP0 == 0` AND `activeP1 == 0` | `/create:changelog` |

When `activeP2 > 0` on PASS, set `hasAdvisories: true`.

### traceabilityChecks Schema

```json
{
  "traceabilityChecks": {
    "summary": {
      "required": 2, "executed": 3, "pass": 1, "partial": 1,
      "fail": 1, "blocked": 0, "notApplicable": 0, "gatingFailures": 1
    },
    "results": [{
      "protocolId": "spec_code", "status": "fail", "gateClass": "hard",
      "applicable": true, "counts": { "pass": 0, "partial": 0, "fail": 1 },
      "evidence": ["README.md:48"], "findingRefs": ["F004"],
      "summary": "README claimed the old report contract."
    }]
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| summary.required / executed / pass / partial / fail / blocked / notApplicable | number | Yes | Protocol execution counts |
| summary.gatingFailures | number | Yes | Hard-gate failures blocking STOP |
| results[].protocolId | string | Yes | Canonical protocol identifier |
| results[].status | string | Yes | `pass`, `partial`, `fail`, `blocked`, `notApplicable` |
| results[].gateClass | string | Yes | `hard` or `advisory` |
| results[].applicable | boolean | Yes | Whether the protocol applied |
| results[].counts | object | Yes | Protocol-local summary counts |
| results[].evidence | string[] | No | Supporting file:line refs |
| results[].findingRefs | string[] | No | Related finding identifiers |
| results[].summary | string | Yes | Human-readable one-line result |

### Validation Rules

- Each line must be valid JSON with a `type` field
- `mode` must be `"review"` on all iteration and synthesis records
- `run` values must be sequential. `newFindingsRatio` must be 0.0-1.0
- `findingsSummary` and `findingsNew` must each contain `P0`, `P1`, `P2` keys
- `findingDetails` must be an array. Each active item must include `findingClass`, `scopeProof`, and `affectedSurfaceHints`

## 3. REVIEW DEPTH SCHEMA (V2)

`reviewDepthSchemaVersion: 2` is the discriminator for the v2 search-depth contract. Absent values, `null`, or any value other than `2` mean v1 legacy: readers keep today's behavior, and validator hard enforcement applies only when the discriminator is present.

Frozen v2 contract:

Top-level review iteration fields when `reviewDepthSchemaVersion: 2`:
- `reviewDepthSchemaVersion: 2`, discriminator
- `reviewDepthApplicability`, `{ scopeClass: 'trivial'|'standard'|'complex', enforcement: 'strict'|'warn'|'skip', reason: string, evidenceRefs: string[] }`
- `targetSelection`, `{ selectedTargets: string[], selectionReason: string, discoveryMethods: string[], omittedHighRiskTargets: string[], graphStatus: 'available'|'unavailable'|'partial', semanticSearchStatus: 'available'|'unavailable'|'partial', evidenceRefs: string[] }`
- `searchCoverage`, `{ requiredBugClasses: string[], covered: string[], ruledOut: string[], deferred: string[], blocked: string[], graphCoverageMode: 'graph'|'graphless_fallback'|'unavailable_blocked' }`
- `searchLedger[]`, array of ledger rows

Ledger row fields:
- Required: `id, dimension, targetRefs, bugClass, disposition, rationale`
- `hypothesis` (string) OR `invariant` (string), at least one
- `searchActions[]`, `{ method: string, queryOrPath: string, result: string, evidenceRefs: string[] }`
- Disposition-specific link (exactly one):
  - `finding` → `linkedFindingId` (must reference an id present in `findingDetails[]`)
  - `ruled_out` → `ruledOutReason`
  - `deferred` → `deferredReason`
  - `blocked` → `blockedReason`
  - `not_applicable` → `notApplicableReason`

Trivial-scope exemption: when `reviewDepthApplicability.scopeClass === 'trivial'` AND `reviewDepthApplicability.enforcement === 'skip'`, ledger may be `[]` with cited scope proof in `reviewDepthApplicability.evidenceRefs`.

### Applicability

| Field | Type | Required | Semantics |
|-------|------|----------|-----------|
| `scopeClass` | `'trivial' \| 'standard' \| 'complex'` | Yes | Classifies how much depth proof the review target warrants. |
| `enforcement` | `'strict' \| 'warn' \| 'skip'` | Yes | `strict` means v2 validators fail shallow records, `warn` emits advisory rollout feedback, `skip` is valid only for trivial scope with proof. |
| `reason` | string | Yes | Human-readable justification for the chosen scope/enforcement pair. |
| `evidenceRefs` | string[] | Yes | File/path refs proving scope classification, required even for skipped trivial ledgers. |

### Target Selection

| Field | Type | Required | Semantics |
|-------|------|----------|-----------|
| `selectedTargets` | string[] | Yes | Files, folders, specs, or surfaces actually searched this iteration. |
| `selectionReason` | string | Yes | Why these targets were highest-value for the dimension or bug class. |
| `discoveryMethods` | string[] | Yes | Methods such as direct read, exact search, semantic search, graph query, producer trace, consumer trace, or negative-test search. |
| `omittedHighRiskTargets` | string[] | Yes | High-risk targets not searched, use `[]` when none were identified. |
| `graphStatus` | `'available' \| 'unavailable' \| 'partial'` | Yes | Code/coverage graph availability for this iteration's target selection. |
| `semanticSearchStatus` | `'available' \| 'unavailable' \| 'partial'` | Yes | Semantic/code search availability for this iteration. |
| `evidenceRefs` | string[] | Yes | Evidence for target selection and omitted-target claims. |

### Search Coverage

| Field | Type | Required | Semantics |
|-------|------|----------|-----------|
| `requiredBugClasses` | string[] | Yes | Bug classes or invariant families that should be searched for this scope. |
| `covered` | string[] | Yes | Required classes searched with conclusive finding or clean proof. |
| `ruledOut` | string[] | Yes | Required classes searched and explicitly ruled out. |
| `deferred` | string[] | Yes | Required classes postponed with a reason in ledger rows. |
| `blocked` | string[] | Yes | Required classes blocked by missing access, graph/search outage, ambiguity, or scope conflict. |
| `graphCoverageMode` | `'graph' \| 'graphless_fallback' \| 'unavailable_blocked'` | Yes | `graph` uses graph evidence, `graphless_fallback` uses direct text/JSON proof, and `unavailable_blocked` records insufficient fallback proof. |

### Search Ledger

| Field | Type | Required | Semantics |
|-------|------|----------|-----------|
| `id` | string | Yes | Stable ledger-row id unique within the iteration record. |
| `dimension` | string | Yes | Review dimension addressed by this row. |
| `targetRefs` | string[] | Yes | Targets searched, should overlap `targetSelection.selectedTargets`. |
| `bugClass` | string | Yes | Candidate bug class or invariant family. |
| `hypothesis` / `invariant` | string | Conditional | At least one must be present and non-empty. |
| `searchActions` | array | Yes | Each action has `method`, `queryOrPath`, `result`, and `evidenceRefs`. |
| `disposition` | string | Yes | One of `finding`, `ruled_out`, `deferred`, `blocked`, `not_applicable`. |
| `rationale` | string | Yes | Why this disposition follows from the evidence. |

| Disposition | Required link | Rule |
|-------------|---------------|------|
| `finding` | `linkedFindingId` | Must reference an `id` present in `findingDetails[]`. |
| `ruled_out` | `ruledOutReason` | Must explain the negative evidence. |
| `deferred` | `deferredReason` | Must explain why later search is acceptable. |
| `blocked` | `blockedReason` | Must name the blocker and expected recovery path. |
| `not_applicable` | `notApplicableReason` | Must explain why the bug class does not apply to this target. |

Representative v2 record:

```json
{
  "type": "iteration",
  "mode": "review",
  "iteration": 3,
  "run": 3,
  "status": "complete",
  "dimensions": ["correctness"],
  "filesReviewed": ["src/review-target.ts"],
  "findingsSummary": { "P0": 0, "P1": 0, "P2": 0 },
  "findingsNew": { "P0": 0, "P1": 0, "P2": 0 },
  "findingDetails": [],
  "newFindingsRatio": 0,
  "sessionId": "rvw-example",
  "generation": 1,
  "lineageMode": "new",
  "timestamp": "2026-05-22T00:00:00Z",
  "durationMs": 120000,
  "reviewDepthSchemaVersion": 2,
  "reviewDepthApplicability": { "scopeClass": "standard", "enforcement": "strict", "reason": "non-trivial state transition target", "evidenceRefs": ["src/review-target.ts:1"] },
  "targetSelection": { "selectedTargets": ["src/review-target.ts"], "selectionReason": "state mutation path under review", "discoveryMethods": ["direct_read", "exact_search"], "omittedHighRiskTargets": [], "graphStatus": "unavailable", "semanticSearchStatus": "partial", "evidenceRefs": ["src/review-target.ts:1"] },
  "searchCoverage": { "requiredBugClasses": ["state_transition"], "covered": [], "ruledOut": ["state_transition"], "deferred": [], "blocked": [], "graphCoverageMode": "graphless_fallback" },
  "searchLedger": [{ "id": "SL-001", "dimension": "correctness", "targetRefs": ["src/review-target.ts"], "bugClass": "state_transition", "hypothesis": "state transition can skip validation", "searchActions": [{ "method": "direct_read", "queryOrPath": "src/review-target.ts", "result": "validation guard present on all branches", "evidenceRefs": ["src/review-target.ts:42"] }], "disposition": "ruled_out", "rationale": "all mutation branches call the validator", "ruledOutReason": "guard verified by direct read" }]
}
```

### Compatibility and Downstream Obligations

| Record Shape | Reader Behavior | Validator Behavior |
|--------------|-----------------|--------------------|
| v1 legacy: discriminator absent or not `2` | Parse as today's iteration record. | Phase D may warn, but must not hard-fail only because v2 fields are absent. |
| v2 trivial+skip | Parse v2 applicability, `searchLedger: []` allowed with cited scope proof. | Validate `reviewDepthApplicability.evidenceRefs`, skip ledger-depth requirements. |
| v2 standard/complex | Parse v2 fields in addition to v1 required fields. | Enforce v2 shape, ledger linkage, coverage reconciliation, and evidence refs. |

Phase E reducer/dashboard/report work must preserve and expose `candidateCoverage`, `searchDebt`, `ruledOutCandidates`, `cleanSearchProof`, and `searchCoverage`. Until Phase E ships, these are contract obligations only. `deep-review-findings-registry.json`, `deep-review-dashboard.md`, and `review-report.md` are not expected to persist them.

---
