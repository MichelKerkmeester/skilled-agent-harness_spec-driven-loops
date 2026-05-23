# Iter 001 — Documentation-code drift in reduce-state.cjs

## Question

What behaviors documented in `.opencode/skills/deep-review/SKILL.md` (§3 HOW IT WORKS + §4 RULES + §8 FINDING DEDUPLICATION) and in `.opencode/skills/deep-review/references/state_format.md` (§3 STATE LOG through §10 CLAIM ADJUDICATION) do NOT match the actual implementation in `.opencode/skills/deep-review/scripts/reduce-state.cjs`? Equivalently, what code-level behaviors in `reduce-state.cjs` are NOT documented in either surface? Each drift MUST cite both surfaces with `file:line`.

## Evidence (file:line citations required)

### Documentation: SKILL.md §3 HOW IT WORKS

- **Reducer contract**: SKILL.md §3 line 320 states "The reducer consumes the latest JSONL delta, the new iteration file, and prior reduced state, then emits finding registry, dashboard metrics, and strategy updates." <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/SKILL.md" lines="320" />
- **JSONL required fields**: SKILL.md §3 line 365-366 lists required JSONL delta fields: `type`, `iteration`, `dimensions`, `filesReviewed`, `findingsSummary`, `findingsNew`, `findingDetails`, `newFindingsRatio`. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/SKILL.md" lines="365-366" />
- **Finding deduplication**: SKILL.md §8 lines 514-538 describe two-tier deduplication using `content_hash` and synthesis behavior. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/SKILL.md" lines="514-538" />

### Documentation: state_format.md §3 STATE LOG

- **Event types**: state_format.md §3 lines 299-407 document multiple event types: `synthesis_complete`, `blocked_stop`, `graph_convergence`, `userPaused`, `stuckRecovery`. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="299-407" />
- **Blocked-stop gates**: state_format.md §3 lines 319-329 document specific gate names: `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, `hotspotSaturationGate`. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="319-329" />
- **Convergence signals**: state_format.md §3 lines 229-238 document convergence signal fields: `rollingAvg`, `madScore`, `dimensionCoverage`, `compositeStop`. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="229-238" />
- **Graph events**: state_format.md §3 lines 242-294 document `graphEvents` array for coverage graph mutations. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="242-294" />
- **Finding detail fields**: state_format.md §3 lines 203-204, 226 document `scopeProof` and `affectedSurfaceHints` as required finding detail fields. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="203-204" />
- **Traceability checks**: state_format.md §3 lines 421-447 document `traceabilityChecks` schema. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="421-447" />

### Code: reduce-state.cjs implementation

- **Event types implemented**: reduce-state.cjs only implements `synthesis_complete` (line 437), `resumed`/`restarted` (lines 389, 441), `graph_convergence` (line 779), `blocked_stop` (line 842), `claim_adjudication` (lines 361, 1433). <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="361" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="389" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="437" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="779" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="842" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="1433" />
- **Convergence signals**: reduce-state.cjs only reads `compositeStop` (line 745), not `rollingAvg` or `madScore`. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="745" />
- **Finding detail fields**: reduce-state.cjs reads `findingClass` (line 538) but does not read `scopeProof` or `affectedSurfaceHints`. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="538" />
- **Search depth fields**: reduce-state.cjs implements `searchCoverage`, `searchLedger`, `reviewDepthSchemaVersion` (lines 924-955, 934, 939-952, 955) which are not documented in state_format.md. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="924-955" />
- **Graph events**: reduce-state.cjs has no implementation for `graphEvents` array processing. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="1-1657" />
- **Traceability checks**: reduce-state.cjs has no implementation for `traceabilityChecks` field processing. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="1-1657" />

## Findings (numbered)

### Finding 1: Missing event type handling in reducer
- **Doc claim**: state_format.md §3 lines 382-407 document `userPaused` and `stuckRecovery` as legal stop-reason enum values that MUST be used at emission time. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="382-407" />
- **Code reality**: reduce-state.cjs only handles `resumed` and `restarted` lifecycle events (lines 389, 441). No code paths for `userPaused` or `stuckRecovery` event processing exist. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="389" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="441" />
- **Severity**: P1 - The reducer cannot process these documented event types, breaking the documented stop-reason enum contract.

### Finding 2: Missing gate name references in reducer
- **Doc claim**: state_format.md §3 lines 319-329 document specific gate names in `blockedBy` array: `dimensionCoverageGate`, `p0ResolutionGate`, `evidenceDensityGate`, `hotspotSaturationGate`. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="319-329" />
- **Code reality**: reduce-state.cjs normalizes `blockedBy` entries generically (lines 807-823) but has no specific handling or validation for these documented gate names. The gate names are treated as opaque strings. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="807-823" />
- **Severity**: P2 - The reducer does not validate gate names against the documented set, but this is cosmetic since the normalization logic is functional.

### Finding 3: Missing convergence signal fields in reducer
- **Doc claim**: state_format.md §3 lines 229-238 document convergence signals with specific fields: `rollingAvg` (weight 0.30), `madScore` (weight 0.25), `dimensionCoverage` (weight 0.45), `compositeStop`. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="229-238" />
- **Code reality**: reduce-state.cjs only reads `compositeStop` from `convergenceSignals` (line 745). No code reads `rollingAvg` or `madScore`. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="745" />
- **Severity**: P1 - The reducer cannot compute the documented weighted convergence score because it ignores 2 of 3 signal components.

### Finding 4: Missing graph events processing in reducer
- **Doc claim**: state_format.md §3 lines 242-294 document `graphEvents` array as an optional iteration record field that records coverage graph mutations, with detailed event payload shape and namespace rules. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="242-294" />
- **Code reality**: reduce-state.cjs has no implementation for `graphEvents` array processing. Grep search returns zero matches for `graphEvents` in the reducer. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="1-1657" />
- **Severity**: P1 - The reducer cannot process or validate graph events, breaking the documented coverage graph integration contract.

### Finding 5: Missing finding detail fields in reducer
- **Doc claim**: state_format.md §3 lines 203-204, 226, 459 document `scopeProof` and `affectedSurfaceHints` as required fields in `findingDetails` array items. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="203-204" />
- **Code reality**: reduce-state.cjs `deltaRecordToFinding` function (lines 505-541) reads `findingClass` (line 538) but does not read or preserve `scopeProof` or `affectedSurfaceHints`. These fields are lost during reduction. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="505-541" />
- **Severity**: P1 - The reducer drops documented required fields from finding details, breaking the schema contract.

### Finding 6: Missing traceability checks processing in reducer
- **Doc claim**: state_format.md §3 lines 421-447 document `traceabilityChecks` as an optional iteration record field with detailed schema for protocol execution results. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="421-447" />
- **Code reality**: reduce-state.cjs has no implementation for `traceabilityChecks` field processing. Grep search returns zero matches for `traceabilityChecks` in the reducer. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="1-1657" />
- **Severity**: P1 - The reducer cannot process or surface traceability check results, breaking the documented protocol integration contract.

### Finding 7: Undocumented search depth fields in reducer
- **Doc claim**: state_format.md does not document `searchCoverage`, `searchLedger`, or `reviewDepthSchemaVersion` fields in the iteration record schema. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="166-447" />
- **Code reality**: reduce-state.cjs implements comprehensive search depth processing with `searchCoverage` (lines 924-931, 939-952), `searchLedger` (lines 955-996), and `reviewDepthSchemaVersion` (line 934). These fields are read, processed, and surfaced in the registry and dashboard. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="924-996" />
- **Severity**: P2 - The reducer implements search depth features that are not documented in the canonical state format spec, creating a documentation gap but no functional breakage.

### Finding 8: Missing content_hash deduplication in reducer
- **Doc claim**: SKILL.md §8 lines 514-538 describe two-tier finding deduplication using `content_hash` as the primary key, with synthesis collapsing behavior. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/SKILL.md" lines="514-538" />
- **Code reality**: reduce-state.cjs finding registry uses `findingId` (line 311) for deduplication and has no implementation for `content_hash` computation or synthesis collapsing. Grep search returns zero matches for `content_hash` in the reducer. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/scripts/reduce-state.cjs" lines="306-319" />
- **Severity**: P1 - The reducer does not implement the documented two-tier deduplication algorithm, breaking the finding deduplication contract.

## Gaps for next iter

1. Investigate whether the missing event types (`userPaused`, `stuckRecovery`) are handled elsewhere in the workflow (YAML, dispatch scripts) or if the reducer is the intended processor.
2. Determine if the missing convergence signal fields (`rollingAvg`, `madScore`) are computed by the workflow and only `compositeStop` is passed to the reducer, or if the reducer should compute the weighted score.
3. Verify if `graphEvents` processing is intended to be handled by the MCP coverage graph handlers exclusively, or if the reducer should validate/roll forward these events.
4. Confirm whether `scopeProof` and `affectedSurfaceHints` are required for reducer functionality or if they are workflow-only fields.
5. Determine if `traceabilityChecks` processing is workflow-only or if the reducer should surface these results in the dashboard.
6. Investigate whether the search depth fields (`searchCoverage`, `searchLedger`, `reviewDepthSchemaVersion`) should be documented in state_format.md or if they are implementation-private to the reducer.
7. Determine if finding deduplication via `content_hash` is a workflow responsibility (synthesis phase) or if the reducer should implement this algorithm.

## JSONL delta row

```json
{"iter_id":"001","timestamp_utc":"2026-05-23T17:17:00.000Z","executor":"cli-devin","model":"swe-1.6","status":"complete","findings_count":8,"gaps_count":7,"primary_evidence_files":[".opencode/skills/deep-review/SKILL.md",".opencode/skills/deep-review/references/state_format.md",".opencode/skills/deep-review/scripts/reduce-state.cjs"]}
```