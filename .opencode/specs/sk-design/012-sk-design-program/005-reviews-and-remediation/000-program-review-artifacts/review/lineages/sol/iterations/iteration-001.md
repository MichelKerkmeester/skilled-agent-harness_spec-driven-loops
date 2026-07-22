# Deep Review Iteration 001 — Correctness

## Dispatcher

- Resolved route: `mode=review target_agent=deep-review`
- Session: `fanout-sol-1784457701676-6nfth8`; generation 1; lineage mode `new`
- Budget profile: `scan` (direct reads, exact searches, and focused tests)
- Scope: phase-001 style-database design, phase-003 requirements/evidence, and the `_db` / `_engine` implementation surfaces named by the rendered prompt

## Files Reviewed

- `.opencode/specs/sk-design/012-style-database-and-interface-commands/001-research-style-database/research/research.md:24-64`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/003-style-database/spec.md:64-119`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/003-style-database/checklist.md:50-100`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/003-style-database/implementation-summary.md:47-98`
- `.opencode/skills/sk-design/styles/_db/indexer.mjs:181-218,618-1002`
- `.opencode/skills/sk-design/styles/_db/retrieval.mjs:81-467`
- `.opencode/skills/sk-design/styles/_db/vectors.mjs:128-346`
- `.opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:98-358`
- `.opencode/skills/sk-design/styles/_db/__tests__/indexer.test.mjs:45-254`
- `.opencode/skills/sk-design/styles/_db/__tests__/retrieval.test.mjs:18-180`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **A worker crash permanently strands a vector job in `running`** -- `.opencode/skills/sk-design/styles/_db/vectors.mjs:154-176` -- The drain selects only `pending|failed` jobs and changes the claim to `running` before awaiting the embedder. If the process exits after that update, no lease timeout or startup reconciliation returns the row to a selectable state. Incremental indexing also treats the non-superseded `running` row as an existing job, so an unchanged style remains lexically available but permanently loses its vector lane until an explicit projection rebuild. [SOURCE: `.opencode/skills/sk-design/styles/_db/vectors.mjs:154-176`] [SOURCE: `.opencode/skills/sk-design/styles/_db/indexer.mjs:773-789`]
   - Finding class: class-of-bug
   - Scope proof: Exact search across `_db` found the only `running` claim at vectors.mjs:172-176 and no stale-running lease/recovery path; the only broad reset is the operator-invoked `rebuildVectorProjection` at vectors.mjs:296-341.
   - Affected surface hints: vector worker restart, incremental indexer, vector degradation telemetry, projection rebuild

```json
{"type":"claim-adjudication","findingId":"SOL-I001-P1-001","claim":"A process exit after a vector job is claimed leaves that job permanently unselectable during normal drains and unchanged incremental scans.","evidenceRefs":[".opencode/skills/sk-design/styles/_db/vectors.mjs:154-176",".opencode/skills/sk-design/styles/_db/indexer.mjs:773-789",".opencode/skills/sk-design/styles/_db/vectors.mjs:296-341"],"counterevidenceSought":"Searched all _db/_engine modules and tests for running-job lease expiry, startup reconciliation, stale claim reset, and worker-crash coverage; none exists.","alternativeExplanation":"An operator can call rebuildVectorProjection, but that is explicit maintenance rather than crash recovery and is not invoked by normal indexing or draining.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"A bounded lease/reconciliation path demonstrably requeues stale running jobs, with a process-interruption regression test."}
```

2. **Persistent queries ignore an explicitly requested generation** -- `.opencode/skills/sk-design/styles/_db/retrieval.mjs:338-363` -- The query always validates the current published generation and checks generation identity only when decoding a cursor. `request.generationHash` is absent from both the request fingerprint and the generation comparison, so a stale-generation request can silently run against current data rather than fail closed or reopen its retained generation. Hydration does enforce the requested generation, making query and hydrate generation semantics inconsistent. [SOURCE: `.opencode/skills/sk-design/styles/_db/retrieval.mjs:81-97`] [SOURCE: `.opencode/skills/sk-design/styles/_db/retrieval.mjs:338-363`] [SOURCE: `.opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:190-200`]
   - Finding class: cross-consumer
   - Scope proof: Exact search found requested-generation enforcement only in hydration and cursor handling; no persistent-query check or test passes `generationHash` to `queryPersistentStyles`.
   - Affected surface hints: persistent query API, migration adapter, query cursor, hydration generation guard

```json
{"type":"claim-adjudication","findingId":"SOL-I001-P1-002","claim":"The persistent query path silently substitutes the current generation for a caller-supplied generationHash.","evidenceRefs":[".opencode/skills/sk-design/styles/_db/retrieval.mjs:81-97",".opencode/skills/sk-design/styles/_db/retrieval.mjs:338-363",".opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:190-200",".opencode/specs/sk-design/012-style-database-and-interface-commands/001-research-style-database/research/research.md:60-64"],"counterevidenceSought":"Searched the query, adapter, hydration, and test surfaces for generation-mismatch or retained-generation query handling; only cursors and hydration enforce identity.","alternativeExplanation":"The public v1 query may intend to expose only the current generation, but the phase-001 native contract includes a caller generation pin and phase 003 adopts that design without documenting a narrower exception.","finalSeverity":"P1","confidence":0.91,"downgradeTrigger":"The governing contract explicitly removes caller generation pins, or the query validates/reopens the requested retained generation and tests stale requests."}
```

### P2 Findings

1. **The aggregate hash includes the mutable slug locator** -- `.opencode/skills/sk-design/styles/_db/indexer.mjs:181-186` -- Artifact paths are stored as `${slug}/${file}` and fed directly into `computeAggregateHash`, although phase-001 research specifies paths relative to the style directory so locator-only renames do not change content identity. A slug-only move therefore rotates the generation and invalidates cursors despite unchanged artifact bytes. [SOURCE: `.opencode/skills/sk-design/styles/_db/indexer.mjs:181-186`] [SOURCE: `.opencode/skills/sk-design/styles/_db/indexer.mjs:250-258`] [SOURCE: `.opencode/specs/sk-design/012-style-database-and-interface-commands/001-research-style-database/research/research.md:42-44`]
   - Finding class: algorithmic
   - Scope proof: The single aggregate-hash producer and its artifact-path producer were traced; retrieval hashes remain separately semantic, limiting this defect to aggregate/generation churn.
   - Affected surface hints: aggregate hash, slug rename, generation cursor, incremental publication

## Traceability Checks

- `spec_code` (core): **fail with findings** — phase-001 generation/vector contracts and phase-003 REQ-001/REQ-005 were compared directly to implementation; P1-001, P1-002, and P2-001 remain active.
- `checklist_evidence` (core): **partial** — focused P0 checklist claims for crash safety, RRF, adapter modes, and fail-closed behavior were checked, but the complete four-phase checklist matrix is deferred to the traceability iteration.
- Focused tests: `node --test styles/_db/__tests__/indexer.test.mjs styles/_db/__tests__/retrieval.test.mjs` passed 17/17; this is counterevidence for transaction rollback, tombstone sequencing, RRF ordering, cursor stability, and lexical degradation, but contains no worker-process crash or requested-generation query case.

## Integration Evidence

- `.opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:153-166` was reviewed as the exact `legacy|shadow|persistent` query integration surface.
- `.opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:176-293` was reviewed as the exact persistent hydration integration surface and supplies counterevidence that hydration does fail on generation mismatch.
- Phase-003 `spec.md:110-119`, `checklist.md:50-100`, and `implementation-summary.md:47-98` were checked as the named requirement/evidence surfaces.

## Edge Cases

- Code-graph readiness was recorded unavailable in strategy, so structural-impact analysis was unavailable; direct exact searches and reads supplied evidence.
- The selected 17 tests pass, but they run in-process and cannot prove recovery after process death between the durable `running` claim and job completion.
- Existing unrelated dirty/untracked workspace paths were observed before writes and were not modified by this iteration.
- Scope stayed on correctness; full checklist traceability and command/registration surfaces remain unverified.

## Confirmed-Clean Surfaces

- Mid-transaction failures roll back style mutation, generation publication, and success markers (`indexer.mjs:805-998`; focused crash test passed).
- Missing styles quarantine before a later tombstone and the focused two-observation test passed (`indexer.mjs:913-940`).
- Eligibility is computed before all three ranking lanes, RRF uses ranks rather than raw scores, and deterministic cursor tests passed (`retrieval.mjs:99-265,364-435`).
- Invalid or internally inconsistent current generations fail closed (`retrieval.mjs:267-289`).
- Vector writes recheck retrieval hash and profile dimensions before publication (`vectors.mjs:203-268`).

## Ruled Out

- **Partial relational generation after a mid-commit exception** — ruled out by the single `BEGIN IMMEDIATE`/rollback boundary and passing failure-injection test.
- **One missing scan immediately tombstones an active style** — ruled out; active rows first become quarantined and require a later observation.
- **Stale vector output overwrites a newer retrieval document** — ruled out by the in-transaction current hash/lifecycle check at `vectors.mjs:205-217`.
- **Raw-score fusion** — ruled out; `weightedRrf` uses channel rank and deterministic UUID tie-breaking.

## Next Focus

- Dimension: security
- Focus area: SQLite/file trust boundaries, pointer/rollback validation, corpus symlink containment, hydration path and rights guards, and hostile query/vector inputs
- Reason: correctness found no P0 but left two active P1s; rotation should now test whether any trust-boundary defect raises the release gate.
- Rotation status: correctness completed; security is the first unchecked dimension.
- Blocked/productive carry-forward: direct reads and exact searches were productive; code-graph structural analysis remains unavailable and must not block review.
- Required evidence: direct file:line proof from schema/indexer/retrieval/vector/adapter code plus focused boundary tests and one counterevidence search for any P0/P1 candidate.

Review verdict: CONDITIONAL
