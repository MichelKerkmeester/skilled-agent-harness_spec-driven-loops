# Review Iteration 005 — Stabilization Replay

## Dispatcher

- Resolved route: `mode=review target_agent=deep-review`
- Session: `fanout-sol-1784457701676-6nfth8`; generation 1; lineage mode `new`
- Budget profile: `verify`
- Focus: mandatory stabilization replay of all nine active P1 findings and one active P2 finding, including anchor freshness, counterevidence, deduplication, severity adjudication, and residual risk.

## Files Reviewed

- `.opencode/skills/sk-design/styles/_db/vectors.mjs:128-346`
- `.opencode/skills/sk-design/styles/_db/schema.mjs:17-48`
- `.opencode/skills/sk-design/styles/_db/retrieval.mjs:81-460`
- `.opencode/skills/sk-design/styles/_db/indexer.mjs:175-264,760-804,1004-1181`
- `.opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:145-216`
- `.opencode/skills/sk-design/styles/_engine/style-library.mjs:200-261`
- `.opencode/skills/sk-design/styles/_db/README.md:1-73`
- `.opencode/skills/sk-design/styles/_db/__tests__/retrieval.test.mjs:35-169`
- `.opencode/skills/sk-design/styles/_db/__tests__/indexer.test.mjs:45-134`
- `.opencode/skills/sk-design/styles/_db/__tests__/adapter.test.mjs:13-136`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/spec.md:40-134`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/001-research-style-database/{tasks.md:48-70,checklist.md:58-109,implementation-summary.md:31-95,research/research.md:38-64}`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/002-research-design-commands/{spec.md:92-119,tasks.md:48-70,checklist.md:58-109,implementation-summary.md:32-96}`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/003-style-database/{spec.md:103-154,checklist.md:58-110,implementation-summary.md:73-99}`

## Findings - New

### P0 Findings

None.

### P1 Findings

None. The nine active P1 findings below were stabilized without refinement, downgrade, resolution, or duplicate expansion.

### P2 Findings

None. The active P2 below was stabilized without refinement or resolution.

## Stabilized Active Findings

### P1 Findings

1. **A worker crash permanently strands a vector job in `running`** -- `.opencode/skills/sk-design/styles/_db/vectors.mjs:154-176` -- The normal drain still selects only `pending|failed`, durably claims `running` before awaiting the embedder, and has no stale-running lease/reconciliation. Incremental indexing still treats that job as existing; only explicit projection rebuild resets it. [SOURCE: `.opencode/skills/sk-design/styles/_db/vectors.mjs:154-176,274-282,296-341`] [SOURCE: `.opencode/skills/sk-design/styles/_db/indexer.mjs:773-789`]
   Finding class: class-of-bug
   Scope proof: Exact current search found the only running claim and no stale-running recovery; adjacent tests cover failed callbacks, supersession, cache, and explicit rebuild but not process interruption.
   Affected surface hints: vector worker restart, incremental indexer, vector degradation telemetry, projection rebuild

```json
{"type":"correctness-state-transition","claim":"A process exit after a vector job is claimed leaves it permanently unselectable during normal drains and unchanged incremental scans.","evidenceRefs":[".opencode/skills/sk-design/styles/_db/vectors.mjs:154-176",".opencode/skills/sk-design/styles/_db/vectors.mjs:274-282,296-341",".opencode/skills/sk-design/styles/_db/indexer.mjs:773-789",".opencode/skills/sk-design/styles/_db/__tests__/retrieval.test.mjs:63-169"],"counterevidenceSought":"Searched current DB/engine modules and tests for leases, stale-running reset, startup reconciliation, process-interruption coverage, and automatic rebuild; none exists.","alternativeExplanation":"An operator can explicitly rebuild the projection, but that is not automatic crash recovery and is not owned by the normal drain/index path.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"A bounded stale-claim reconciliation path and process-interruption regression test prove normal recovery."}
```

2. **Persistent queries ignore an explicitly requested generation** -- `.opencode/skills/sk-design/styles/_db/retrieval.mjs:338-363` -- `queryPersistentStyles` still opens and validates the current generation, and generation identity is checked only for cursors. The request generation is neither compared nor fingerprinted, while hydration explicitly rejects a mismatch. [SOURCE: `.opencode/skills/sk-design/styles/_db/retrieval.mjs:81-96,338-363`] [SOURCE: `.opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:176-201`]
   Finding class: cross-consumer
   Scope proof: Current exact search finds generation-pin enforcement in cursor/hydration paths but no direct-query generation check or query regression using a stale generationHash.
   Affected surface hints: persistent query API, migration adapter, query cursor, hydration generation guard

```json
{"type":"correctness-contract","claim":"The persistent query path silently substitutes the current generation for a caller-supplied generationHash.","evidenceRefs":[".opencode/skills/sk-design/styles/_db/retrieval.mjs:81-96,338-363",".opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:176-201",".opencode/specs/sk-design/012-style-database-and-interface-commands/001-research-style-database/research/research.md:58-64"],"counterevidenceSought":"Searched current query, adapter, hydration, and DB tests for direct-query generation mismatch handling; only cursor and hydration identity checks exist.","alternativeExplanation":"The public query could be intended to expose only current state, but the frozen research contract includes generation-pinned responses and no narrower query exception is documented.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"The governing contract explicitly removes caller generation pins, or direct queries enforce/reopen the requested generation with stale-generation tests."}
```

3. **The generation pointer accepts a symlinked database outside its publication directory** -- `.opencode/skills/sk-design/styles/_db/schema.mjs:23-48` -- Validation remains basename-only, `existsSync` follows a symlink, and the returned path is not realpath-contained or bound to `pointer.generationHash`. Persistent query and hydration both consume this resolver. [SOURCE: `.opencode/skills/sk-design/styles/_db/schema.mjs:23-48`] [SOURCE: `.opencode/skills/sk-design/styles/_db/retrieval.mjs:338-347`] [SOURCE: `.opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:184-200`]
   Finding class: cross-consumer
   Scope proof: Exact search finds realpath containment for corpus artifacts but none in the single published-pointer resolver; current indexer tests cover ordinary publication/rollback, not a pointer symlink or pointer/database hash mismatch.
   Affected surface hints: generation pointer reader, persistent query open, persistent hydration open, rollback publication, pointer boundary tests

```json
{"type":"trust-boundary","claim":"A basename-only pointer can resolve through a symlink outside the generation directory and its declared generationHash is not bound to the opened database.","evidenceRefs":[".opencode/skills/sk-design/styles/_db/schema.mjs:23-48",".opencode/skills/sk-design/styles/_db/retrieval.mjs:338-347",".opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:184-200",".opencode/skills/sk-design/styles/_db/__tests__/indexer.test.mjs:57-121"],"counterevidenceSought":"Re-read writer validation and searched schema/indexer tests for realpath containment, pointer symlinks, and pointer/database generation binding; ordinary sibling files are validated, but the reader boundary remains unchecked.","alternativeExplanation":"A locked-down deployment may limit pointer-directory writers to the same principal that can replace generation files, containing exploitability.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"Every caller proves an immutable trusted directory, or read-side realpath containment and pointer/database generation binding are enforced and tested."}
```

4. **Persistent retrieval accepts arbitrarily large query vectors** -- `.opencode/skills/sk-design/styles/_db/retrieval.mjs:81-96,210-230` -- The full caller vector is still serialized before validation and copied with `map(Number)`; query validation checks only non-empty finite values. The 16,384 cap remains limited to embedder output. [SOURCE: `.opencode/skills/sk-design/styles/_db/retrieval.mjs:81-96,210-230`] [SOURCE: `.opencode/skills/sk-design/styles/_db/vectors.mjs:5-21`]
   Finding class: class-of-bug
   Scope proof: Exact current search finds no upstream or query-side dimensional/byte bound; retrieval tests use only two-element vectors and have no oversized-input case.
   Affected surface hints: persistent retrieval API, request fingerprinting, vector lane, hostile-input tests

```json
{"type":"availability-input-validation","claim":"The synchronous persistent query path accepts and duplicates an unbounded caller-controlled queryVector.","evidenceRefs":[".opencode/skills/sk-design/styles/_db/retrieval.mjs:81-96,210-230",".opencode/skills/sk-design/styles/_db/vectors.mjs:5-21",".opencode/skills/sk-design/styles/_db/__tests__/retrieval.test.mjs:77-95,132-138"],"counterevidenceSought":"Searched all current queryVector and MAX_VECTOR_DIMENSIONS references and inspected retrieval negatives; only embedder output is capped and tests use two-dimensional inputs.","alternativeExplanation":"Current local callers may generate small vectors internally, reducing immediate exposure, but the reviewed synchronous API itself does not enforce that assumption.","finalSeverity":"P1","confidence":0.94,"downgradeTrigger":"An enforced cap exists on every caller before fingerprinting, or query type/dimensions/serialized size are bounded and regression-tested."}
```

5. **Phase 001 marks a ten-iteration research task complete after only seven iterations** -- `.opencode/specs/sk-design/012-style-database-and-interface-commands/001-research-style-database/tasks.md:48-61` -- T002 remains checked as ten iterations while the handoff states seven and a stall closure. The parent accurately records `ran 7`; it does not repair the frozen checked task claim. [SOURCE: `.opencode/specs/sk-design/012-style-database-and-interface-commands/001-research-style-database/tasks.md:48-61`] [SOURCE: `.opencode/specs/sk-design/012-style-database-and-interface-commands/001-research-style-database/implementation-summary.md:34-39,62-65,90-95`] [SOURCE: `.opencode/specs/sk-design/012-style-database-and-interface-commands/spec.md:114-119`]
   Finding class: matrix/evidence
   Scope proof: Current task, checklist, handoff, research synthesis, and parent map were cross-read; checked execution evidence still asserts the unexecuted count.
   Affected surface hints: phase-001 tasks, phase-001 checklist, convergence evidence, parent phase map

```json
{"type":"traceability-claim","claim":"Phase 001's checked execution evidence says the ten-iteration task completed, but its authoritative handoff records seven iterations and a stall closure.","evidenceRefs":[".opencode/specs/sk-design/012-style-database-and-interface-commands/001-research-style-database/tasks.md:48-61",".opencode/specs/sk-design/012-style-database-and-interface-commands/001-research-style-database/checklist.md:58-109",".opencode/specs/sk-design/012-style-database-and-interface-commands/001-research-style-database/implementation-summary.md:34-39,62-65,90-95",".opencode/specs/sk-design/012-style-database-and-interface-commands/spec.md:114-119"],"counterevidenceSought":"Re-read the promoted handoff and current packet-wide iteration-count references for a continuation or amended task meaning; all direct evidence still says seven, not ten.","alternativeExplanation":"Ten may have been intended as a ceiling, but T002 is phrased as an executed checked task and the handoff names a stall closure.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Reconcile task/checklist completion to the actual stop with cited legal convergence evidence."}
```

6. **Phase 002 checks both research lineages complete although GLM produced zero iterations** -- `.opencode/specs/sk-design/012-style-database-and-interface-commands/002-research-design-commands/tasks.md:48-70` -- T002/T004, CHK-020/070, and the success criterion still require both lineages, while the handoff still records GLM=0 and SOL-only synthesis. [SOURCE: `.opencode/specs/sk-design/012-style-database-and-interface-commands/002-research-design-commands/spec.md:103-119`] [SOURCE: `.opencode/specs/sk-design/012-style-database-and-interface-commands/002-research-design-commands/tasks.md:48-70`] [SOURCE: `.opencode/specs/sk-design/012-style-database-and-interface-commands/002-research-design-commands/checklist.md:58-62,103-109`] [SOURCE: `.opencode/specs/sk-design/012-style-database-and-interface-commands/002-research-design-commands/implementation-summary.md:35-40,62-65,91-96`]
   Finding class: matrix/evidence
   Scope proof: Frozen requirements, checked task/checklist rows, and current handoff remain contradictory; exact packet search confirms SOL=20 and GLM=0 without a secondary convergence record.
   Affected surface hints: phase-002 tasks, phase-002 checklist, REQ-006, cross-lineage convergence

```json
{"type":"traceability-claim","claim":"Phase 002's checked evidence claims SOL and GLM both completed and converged even though GLM failed before producing an iteration.","evidenceRefs":[".opencode/specs/sk-design/012-style-database-and-interface-commands/002-research-design-commands/spec.md:103-119",".opencode/specs/sk-design/012-style-database-and-interface-commands/002-research-design-commands/tasks.md:48-70",".opencode/specs/sk-design/012-style-database-and-interface-commands/002-research-design-commands/checklist.md:58-62,103-109",".opencode/specs/sk-design/012-style-database-and-interface-commands/002-research-design-commands/implementation-summary.md:35-40,62-65,91-96"],"counterevidenceSought":"Re-read current spec, checked matrices, handoff, and packet-wide lineage references for a successful GLM artifact or amended optional-lineage rule; none exists.","alternativeExplanation":"SOL is self-sufficient, but implementation success cannot silently amend the frozen two-lineage requirement and checked convergence claims.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Amend the frozen requirement and checked rows to permit the failed secondary lineage, or supply real GLM iterations plus merge/convergence evidence."}
```

7. **Phase 003 claims a corpus-scale SLO was measured from a 20-style fixture** -- `.opencode/specs/sk-design/012-style-database-and-interface-commands/003-style-database/checklist.md:61-64` -- CHK-022/070 remain checked as measured/proven, but the only timing test still creates 20 styles and the handoff still defers the 1,290-style same-corpus check. [SOURCE: `.opencode/specs/sk-design/012-style-database-and-interface-commands/003-style-database/spec.md:115-131,148-150`] [SOURCE: `.opencode/specs/sk-design/012-style-database-and-interface-commands/003-style-database/checklist.md:58-64,106-110`] [SOURCE: `.opencode/skills/sk-design/styles/_db/__tests__/adapter.test.mjs:13-39,107-135`] [SOURCE: `.opencode/specs/sk-design/012-style-database-and-interface-commands/003-style-database/implementation-summary.md:83-99`]
   Finding class: matrix/evidence
   Scope proof: Current exact search finds one timing fixture (`timingStyles(20)`) and no 1,290-style persistent benchmark; the 20 focused tests pass but do not supply missing scale evidence.
   Affected surface hints: REQ-007, adapter timing test, CHK-022, CHK-070, cutover evidence

```json
{"type":"performance-evidence","claim":"The checked phase-003 evidence overstates a 20-style relative timing test as proof against the same-corpus 1,290-style baseline.","evidenceRefs":[".opencode/specs/sk-design/012-style-database-and-interface-commands/003-style-database/spec.md:115-131,148-150",".opencode/specs/sk-design/012-style-database-and-interface-commands/003-style-database/checklist.md:58-64,106-110",".opencode/skills/sk-design/styles/_db/__tests__/adapter.test.mjs:13-39,107-135",".opencode/specs/sk-design/012-style-database-and-interface-commands/003-style-database/implementation-summary.md:83-99"],"counterevidenceSought":"Searched current DB code/tests for 1,290/1,291, 6,246, SLO, benchmark, and timing fixtures; only timingStyles(20) exists, and the handoff explicitly defers corpus scale.","alternativeExplanation":"The bounded test is useful green regression evidence, but it does not meet the frozen same-corpus acceptance criterion.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Record same-full-corpus persistent/legacy measurements, or amend the frozen SLO/checklist/completion claims without calling it proven."}
```

8. **The parent declares the four-phase program complete and verified while required evidence is false** -- `.opencode/specs/sk-design/012-style-database-and-interface-commands/spec.md:43-55` -- The status remains `Complete — all four phases built + verified` while the three traceability contradictions above and active implementation P1s remain. The phase map accurately discloses `ran 7` and `GLM lineage failed`, strengthening rather than resolving the parent-status contradiction. [SOURCE: `.opencode/specs/sk-design/012-style-database-and-interface-commands/spec.md:43-55,114-133`]
   Finding class: matrix/evidence
   Scope proof: Parent metadata/handoff criteria were reconciled against current child matrices, handoffs, stabilized active findings, and the green focused tests; delivered implementation does not make all claimed verification evidence true.
   Affected surface hints: parent status, phase documentation map, release readiness, recursive validation, child completion metadata

```json
{"type":"release-readiness","claim":"The parent Complete status is unsupported while mandatory child evidence is contradicted and active P1 findings remain.","evidenceRefs":[".opencode/specs/sk-design/012-style-database-and-interface-commands/spec.md:43-55,114-133",".opencode/specs/sk-design/012-style-database-and-interface-commands/001-research-style-database/implementation-summary.md:90-95",".opencode/specs/sk-design/012-style-database-and-interface-commands/002-research-design-commands/implementation-summary.md:91-96",".opencode/specs/sk-design/012-style-database-and-interface-commands/003-style-database/implementation-summary.md:94-99"],"counterevidenceSought":"Reconciled current parent language with all stabilized child evidence and reran the directly relevant 20 DB tests; implementation gates remain substantially green, but the claimed all-phase verification evidence is still false.","alternativeExplanation":"Complete may mean delivered rather than release-ready, but the parent explicitly says built and verified and defines child validation/convergence handoff gates.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"Reconcile child evidence and active required defects, or change parent lifecycle language to distinguish delivery from verified completion."}
```

9. **Persistent DB maintenance has no owned operator surface or bounded generation-retention path** -- `.opencode/skills/sk-design/styles/_db/indexer.mjs:1047-1125` -- Full builds still create unique immutable files and clean only temporary/building paths. Build, rollback, vector repair, and drain remain library/test surfaces; the production CLI still exposes only `build|query|hydrate`, where build is the legacy path, and README has no status/cutover/repair/prune runbook. [SOURCE: `.opencode/skills/sk-design/styles/_db/indexer.mjs:1047-1174`] [SOURCE: `.opencode/skills/sk-design/styles/_db/vectors.mjs:289-346`] [SOURCE: `.opencode/skills/sk-design/styles/_engine/style-library.mjs:220-245`] [SOURCE: `.opencode/skills/sk-design/styles/_db/README.md:23-46`]
   Finding class: cross-consumer
   Scope proof: Current producer/consumer search finds persistent maintenance exports only in defining modules and tests, no prune/retention implementation, and no production operator command beyond legacy build plus query/hydrate.
   Affected surface hints: persistent DB operator CLI, immutable generation retention, rollback selection, vector repair/drain, cutover runbook

```json
{"type":"maintenance-operability","claim":"Persistent DB publication and repair are library-only surfaces, and repeated full builds retain uniquely named generation files without a bounded retention or prune path.","evidenceRefs":[".opencode/skills/sk-design/styles/_db/indexer.mjs:1047-1174",".opencode/skills/sk-design/styles/_db/vectors.mjs:289-346",".opencode/skills/sk-design/styles/_engine/style-library.mjs:220-245",".opencode/skills/sk-design/styles/_db/README.md:23-46",".opencode/skills/sk-design/styles/_db/__tests__/indexer.test.mjs:57-99"],"counterevidenceSought":"Repeated exact export/consumer and prune/retention searches across styles code, CLI, README, and adjacent tests; only internal indexer drains and test callers exist, and two retained generations are explicitly observed.","alternativeExplanation":"Deployments can script exports and legacy remains default, containing immediate exposure, but neither establishes a stable tested maintenance owner nor bounded retention.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"Provide a documented/tested operator surface for persistent status/build/cutover/rollback/vector repair and a safe keep/prune invariant preserving current and rollback generations."}
```

### P2 Findings

1. **The aggregate hash includes the mutable slug locator** -- `.opencode/skills/sk-design/styles/_db/indexer.mjs:181-186` -- `readVerifiedArtifacts` still stores `${slug}/${entry.name}` and `computeAggregateHash` still hashes that path with bytes, so a locator-only slug rename rotates content/generation identity. [SOURCE: `.opencode/skills/sk-design/styles/_db/indexer.mjs:181-186,220-258`]
   Finding class: algorithmic
   Scope proof: Current exact search finds the same single aggregate-hash producer and slug-prefixed artifact producer; no alternate stable relative-path normalization exists.
   Affected surface hints: aggregate hash, slug rename, generation cursor, incremental publication

## Traceability Checks

- `spec_code` (core): **fail, stabilized** — direct current reads confirm the crash-recovery, generation-query, pointer trust-boundary, vector-bound, aggregate-hash, and operator-lifecycle gaps remain; no implementation evidence changed the frozen contracts.
- `checklist_evidence` (core): **fail, stabilized** — phases 001-003 retain false checked execution/SLO rows, and the parent still overstates all-phase verification.
- Focused current verification: `node --test` for indexer, retrieval, and adapter passed 20/20. This is counterevidence for broad regressions but includes no worker-process interruption, pointer symlink/hash binding, direct-query generation mismatch, oversized vector, full-corpus SLO, or operator retention case.

## Integration Evidence

- `.opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:153-166,176-201` was re-read as the exact persistent query/hydration consumer boundary.
- `.opencode/skills/sk-design/styles/_engine/style-library.mjs:220-245` was re-read as the exact production CLI boundary.
- `.opencode/skills/sk-design/styles/_db/indexer.mjs:1047-1174` and `.opencode/skills/sk-design/styles/_db/vectors.mjs:139-346` were re-traced as persistent publication, rollback, drain, and repair producers.
- Parent and child frozen spec/checklist/handoff surfaces were re-read directly; implementation evidence did not silently amend them.

## Edge Cases

- Graph and structural-impact tooling remained unavailable for this lineage; cited direct reads, exact searches, producer/consumer traces, and negative-test inspection supplied the required graphless fallback.
- Green focused tests constrain severity but do not cover any active bug class's missing negative case.
- The legacy default contains immediate operational exposure for persistent maintenance and hostile query inputs; P1 remains the supported severity.
- Retaining at least one prior generation is required for rollback; the maintenance defect remains absence of a bounded policy and owned surface, not retention itself.
- No active finding duplicates another root cause: automatic worker recovery, operator maintenance ownership, query pinning, pointer trust, input bounds, content identity, three child evidence contradictions, and parent release status remain distinct fix boundaries.
- Existing unrelated dirty/untracked workspace paths were observed and not modified.

## Confirmed-Clean Surfaces

- The directly relevant indexer/retrieval/adapter test set passed 20/20.
- Transaction rollback, ordinary immutable-generation publication/rollback, eligibility-first ranking, cursor projection invalidation, vector stale-job supersession, and legacy-default behavior remain green.
- The phase map accurately discloses `ran 7` and `GLM lineage failed`; the active traceability defects remain localized to checked evidence and parent completion language.

## Ruled Out

- **Artificial stabilization novelty** — no new or refined finding was recorded because current evidence reproduced the existing ten active root causes.
- **Finding collapse between crash recovery and operator maintenance** — ruled out: one requires automatic stale-running recovery, while the other requires owned lifecycle/retention operations.
- **Green focused tests resolve the active gaps** — ruled out by direct negative-test inspection; none exercises the missing cases.
- Previously exhausted registration drift, hidden full-corpus fixture, omitted GLM lineage, command-authority duplication, and supported-mode ambiguity were not re-entered because source did not change.

## Next Focus

- Dimension: synthesis
- Focus area: YAML-owned convergence evaluation and synthesis using the stabilized P0=0, P1=9, P2=1 active baseline
- Reason: all four dimensions and the mandatory stabilization replay are complete with no artificial novelty
- Rotation status: correctness, security, traceability, maintainability, and stabilization complete
- Blocked/productive carry-forward: graphless direct evidence remains authoritative; preserve all ten active findings and prior ruled-out directions
- Required evidence: reducer-confirmed registry/state consistency and synthesis verdict `CONDITIONAL`

Review verdict: CONDITIONAL
