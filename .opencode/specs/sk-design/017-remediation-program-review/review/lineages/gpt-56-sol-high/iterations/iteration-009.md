# Deep Review Iteration 009 — Correctness Adversarial Parity/Performance

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Session: `fanout-gpt-56-sol-high-1784650021792-031fvi`
- Generation / lineage: `1` / `new`
- Budget profile: `verify`
- Scope: validated 118-file `goal-file-manifest.txt` at pinned HEAD `7b9d3b6b71`
- Structural caveat: Code Graph was unavailable by dispatch contract; direct manifest-scoped reads and read-only fixture tests were used.

## Files Reviewed

- `.opencode/specs/sk-design/017-remediation-program-review/{spec.md,goal-file-manifest.txt}`
- `.opencode/specs/sk-design/015-styles-database-evolution/006-persistent-db-activation/{spec.md,plan.md,tasks.md,checklist.md,implementation-summary.md}`
- `.opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs`
- `.opencode/skills/sk-design/styles/lib/database/{operator,stage-telemetry}.mjs`
- `.opencode/skills/sk-design/styles/tests/database/{adapter,oracle,telemetry}.test.mjs`
- `.opencode/skills/sk-design/styles/tests/oracle/{query-set,differential-oracle,replay-fixtures,relevance-judgments}.mjs`
- `.opencode/skills/sk-design/styles/tests/oracle/relevance-judgments.seed.json`

## Findings - New

This iteration emitted two required stable-ID refinements and two new findings.

### P0 Findings

None.

### P1 Findings

1. **P1-007 — Operator options with missing values silently target defaults (refined)** -- `.opencode/skills/sk-design/styles/lib/database/operator.mjs:49` -- `optionValue` still returns `null` for a trailing option and the dispatcher still substitutes the default database path; direct reread found no command-specific missing-value or unknown-option validation [SOURCE: `.opencode/skills/sk-design/styles/lib/database/operator.mjs:49-52`] [SOURCE: `.opencode/skills/sk-design/styles/lib/database/operator.mjs:213-252`].
   - Finding class: class-of-bug
   - Scope proof: Every path/profile/generation option uses `optionValue`; the shared parser has no value-shape or unknown-option pass, while command branches only validate selected required values.
   - Affected surface hints: operator argument parser; database targeting; unknown-option rejection; CLI exits
   - Content hash: `sha256:b83769ba38909d56d9a79277ebbe722f0957864c12cc3ffbcb1b98505659f750`
   - Recommendation: Validate command-specific option schemas before applying defaults and add missing-value/unknown-option subprocess tests.

```json
{"findingId":"P1-007","type":"operator-input-contract","claim":"Missing option values and unknown flags are accepted; a trailing --database silently selects the default database despite the invalid-input failure contract.","evidenceRefs":[".opencode/skills/sk-design/styles/lib/database/operator.mjs:49-52",".opencode/skills/sk-design/styles/lib/database/operator.mjs:213-252"],"counterevidenceSought":"Re-read the shared parser and every command branch after 11 focused parity/oracle tests passed. Required corpus/generation checks exist, but no branch validates a missing database value or unknown option.","alternativeExplanation":"Permissive parsing may be intentional and omission legitimately uses the default.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"A governing contract permits unknown flags and proves valueless path options cannot reach state-changing commands."}
```

2. **P1-008 — Status cannot report an uninitialized clean-checkout database root (refined)** -- `.opencode/skills/sk-design/styles/lib/database/operator.mjs:61` -- `listGenerationPaths` still calls `readdir` before `getStyleDatabaseStatus` checks for a publication pointer, so an absent database directory escapes as `ENOENT` rather than the modeled unpublished DTO [SOURCE: `.opencode/skills/sk-design/styles/lib/database/operator.mjs:58-95`].
   - Finding class: instance-only
   - Scope proof: The empty-directory branch is modeled at lines 85-94, but no catch or existence guard precedes `readdir`; focused tests create fixture roots before status.
   - Affected surface hints: clean-checkout status; absent-generation JSON; operator exit classification; prewarm diagnostics
   - Content hash: `sha256:fa994be79568147be456da0bbb25341fdd6897f6a7bd0e969ec0e50fe1cde133`
   - Recommendation: Treat an absent generation directory as empty and test missing-directory plus existing-empty-directory status.

```json
{"findingId":"P1-008","type":"operator-absence-contract","claim":"Status throws internal ENOENT when the database root has never been created instead of returning the modeled unpublished status.","evidenceRefs":[".opencode/skills/sk-design/styles/lib/database/operator.mjs:58-95"],"counterevidenceSought":"Re-read the status path and focused tests. Existing empty directories return published:false, but no pre-readdir guard handles a missing parent.","alternativeExplanation":"Directory creation could be an undocumented operator precondition.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"A governing contract requires pre-creation and an owned bootstrap guarantees it before every status call."}
```

3. **P1-009 — The 10/10 shadow result does not prove full facade DTO parity** -- `.opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs:115` -- `compareQueryResults` compares projected cards and eligibility only, expressly tolerating generation/content hashes, score values, and ranking mode. The committed test exercises one fixture query and asserts cards plus `shadow.ok`, while the nine-scenario differential oracle replays persistent output against persistent goldens rather than legacy-vs-persistent facade DTOs [SOURCE: `.opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs:115-141`] [SOURCE: `.opencode/skills/sk-design/styles/tests/database/adapter.test.mjs:42-61`] [SOURCE: `.opencode/skills/sk-design/styles/tests/oracle/differential-oracle.mjs:74-103`] [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/006-persistent-db-activation/checklist.md:64-67`].
   - Finding class: matrix/evidence
   - Scope proof: Manifest-listed parity surfaces include one shadow fixture assertion and a nine-scenario persistent golden oracle; no committed ten-query legacy/persistent result artifact or full-DTO comparator was found.
   - Affected surface hints: shadow comparator; facade DTO contract; ten-query evidence; cutover parity gate
   - Content hash: `sha256:1266283898ea8cf75f46b9740c2f1b6233f605808034fd9b582e709205ebd378`
   - Recommendation: Either narrow packet claims to card/eligibility projection parity or commit a ten-query comparator artifact that checks every contractually relevant facade field and names tolerated differences.

```json
{"findingId":"P1-009","type":"parity-claim-overstatement","claim":"The recorded 10/10 result cannot establish full facade DTO parity because the comparator projects cards and eligibility while tolerating score, ranking, content-hash, and generation differences.","evidenceRefs":[".opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs:115-141",".opencode/skills/sk-design/styles/tests/database/adapter.test.mjs:42-61",".opencode/skills/sk-design/styles/tests/oracle/differential-oracle.mjs:74-103",".opencode/specs/sk-design/015-styles-database-evolution/006-persistent-db-activation/checklist.md:64-67"],"counterevidenceSought":"Ran 11/11 adapter/oracle tests and inspected the nine-scenario oracle. They prove stable persistent output, scale replay, and one fixture shadow case, but not full legacy-vs-persistent DTO equality over ten real queries.","alternativeExplanation":"Facade parity may intentionally mean only card projection and eligibility, with ranking internals declared non-contractual.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"Packet authorities narrow the claim to projected fields, or a committed ten-query artifact proves equality for every contractually relevant facade DTO field."}
```

4. **P1-010 — The p95 1150→53 ms gate is asserted without reproducible measurement evidence** -- `.opencode/specs/sk-design/015-styles-database-evolution/006-persistent-db-activation/checklist.md:66` -- The packet marks a representative-trace p95 gate complete, but the manifest contains no raw trace, sample counts, percentile calculation, warm/cold policy, or benchmark output. The executable timing test warms both paths and compares median-of-three timings for one request over 20 synthetic styles; it cannot reproduce the claimed full-corpus p95 values [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/006-persistent-db-activation/checklist.md:64-67`] [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/006-persistent-db-activation/implementation-summary.md:94-111`] [SOURCE: `.opencode/skills/sk-design/styles/tests/database/adapter.test.mjs:31-40`] [SOURCE: `.opencode/skills/sk-design/styles/tests/database/adapter.test.mjs:107-132`].
   - Finding class: matrix/evidence
   - Scope proof: The 118-file manifest contains telemetry implementation/tests and deterministic oracle fixtures, but no performance trace or p95 harness; the only executable latency assertion is the warmed median-of-three 20-style test.
   - Affected surface hints: performance gate; benchmark trace; warm/cold policy; percentile evidence; cutover readiness
   - Content hash: `sha256:1b794e560d8acb2b82ea9a54a3ca55f09a8e590e47ef06943e555d94ac02f47c`
   - Recommendation: Commit an immutable benchmark artifact with query set, environment, sample count, warm-up policy, timing boundaries, raw durations, percentile method, and legacy/persistent summaries; until then mark the numerical gate indicative/unverified.

```json
{"findingId":"P1-010","type":"performance-evidence-gap","claim":"The completed p95 1150-to-53 ms gate is not independently reproducible from the frozen manifest because no trace, samples, percentile method, warm/cold policy, or matching harness is present.","evidenceRefs":[".opencode/specs/sk-design/015-styles-database-evolution/006-persistent-db-activation/checklist.md:64-67",".opencode/specs/sk-design/015-styles-database-evolution/006-persistent-db-activation/implementation-summary.md:94-111",".opencode/skills/sk-design/styles/tests/database/adapter.test.mjs:31-40",".opencode/skills/sk-design/styles/tests/database/adapter.test.mjs:107-132"],"counterevidenceSought":"Ran the focused adapter/oracle suites and inspected telemetry, oracle, replay, and packet surfaces. The fixture benchmark confirms persistent is faster after warming, but measures a median of three for one synthetic request, not a representative-trace p95.","alternativeExplanation":"The raw benchmark may have been run manually and intentionally omitted because the default cutover remains human-gated.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"A manifest-listed immutable trace and harness reproduce the stated p95 values and disclose sample, warm-up, environment, and timing-boundary methodology."}
```

### P2 Findings

None.

## Traceability Checks

| Surface | Status | Evidence |
|---|---|---|
| Shadow 10/10 denominator and comparison semantics | Fail | The comparator checks card projection plus eligibility and tolerates four field classes; only one fixture shadow query is executable [SOURCE: `.opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs:115-141`] [SOURCE: `.opencode/skills/sk-design/styles/tests/database/adapter.test.mjs:42-61`]. |
| Differential oracle breadth | Pass with limit | Nine scenarios cover structured, FTS, facet, exclusion, vector, hybrid, degraded, exact-reuse, and paging paths, including scaled persistent replay; it is not a legacy/persistent ten-query comparator [SOURCE: `.opencode/skills/sk-design/styles/tests/oracle/query-set.mjs:29-42`] [SOURCE: `.opencode/skills/sk-design/styles/tests/database/oracle.test.mjs:131-157`]. |
| p95 methodology and artifact | Fail | Packet numbers lack raw samples/methodology; executable timing evidence is warmed median-of-three on 20 synthetic styles [SOURCE: `.opencode/skills/sk-design/styles/tests/database/adapter.test.mjs:31-40`] [SOURCE: `.opencode/skills/sk-design/styles/tests/database/adapter.test.mjs:107-132`]. |
| Human relevance / cutover | Open by design | Seed explicitly requires human labels and packet authorities leave cutover open [SOURCE: `.opencode/skills/sk-design/styles/tests/oracle/relevance-judgments.seed.json:1-12`] [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/006-persistent-db-activation/checklist.md:67`] [SOURCE: `.opencode/specs/sk-design/015-styles-database-evolution/006-persistent-db-activation/checklist.md:109`]. |
| Stable-ID hash repair | Pass | `P1-007` and `P1-008` use distinct canonical hashes derived from path, line range, finding type, and normalized description prefix. |

## Integration Evidence

- Exact surfaces reviewed: `compareQueryResults`, `dispatchStyleQuery`, `ORACLE_QUERY_SET`, `captureOracle`/`replayOracle`, scaled replay fixtures, stage telemetry, packet 015/006 acceptance/checklist/summary, and the operator parser/status path.
- `node --test styles/tests/database/{adapter,oracle}.test.mjs`: 11/11 passed; the run used temporary fixture databases and did not generate target database state.
- Code Graph remained unavailable by dispatch contract; structural-impact analysis is unavailable.

## Edge Cases

- The initial exact search against the manifest path unexpectedly returned lineage-local review hits as well as manifest evidence. Review-output hits were discarded; every active finding anchor was re-read directly from a manifest-listed target file.
- The nine oracle scenarios include a paged follow-up, but that does not turn the set into the asserted ten-query shadow trace.
- Warmed fixture timing proves directionality only; it neither disproves the stated speedup nor validates a full-corpus p95.
- Human relevance and default cutover remain intentionally open and were not converted into findings.
- Refining `P1-007`/`P1-008` repairs reducer identity only; their evidence and P1 severity remain unchanged.

## Confirmed-Clean Surfaces

- The persistent oracle replay is deterministic across nine ranking scenarios and 13/130/1,300-style scales; 11 focused tests passed.
- Telemetry brackets native, JS-resident, elapsed, and unattributed timing, and does not alter retrieval DTO bytes [SOURCE: `.opencode/skills/sk-design/styles/lib/database/stage-telemetry.mjs:99-128`] [SOURCE: `.opencode/skills/sk-design/styles/tests/database/telemetry.test.mjs:109-180`].
- Relevance seed provenance is honest about authored-similar and silver labels and explicitly requires human gold.

## Ruled Out

- P0 escalation for parity/performance evidence: default remains `legacy`, cutover remains open, and no destructive or security-critical path is active.
- Treating nine persistent oracle scenarios as the missing ten-query shadow trace: they have different comparison semantics and no legacy result side.
- Treating the warmed median-of-three fixture assertion as p95 counterevidence: it establishes only relative direction on a synthetic 20-style fixture.
- Retrying exhausted operator behavior beyond the mandatory stable-ID reread: no changed implementation evidence was found.

## Next Focus

- Dimension: correctness (final adversarial stabilization/replay)
- Focus area: replay all active P1 claim packets, stable hashes, counterevidence, severity, and release-readiness implications without opening new broad discovery
- Reason: iteration 10 is the forced final stabilization pass and must test whether any active claim can be disproved, merged, downgraded, or resolved
- Rotation status: correctness third-pass complete; final cross-reference stabilization is the only remaining iteration
- Blocked/productive carry-forward: Code Graph remains unavailable; direct anchor rereads, focused tests, canonical hash checks, and packet-state reconciliation remain productive
- Required evidence: all ten active stable IDs, distinct canonical hashes, current source anchors, typed adjudication packets, verdict-lock replay, and explicit human-gated boundaries

Review verdict: CONDITIONAL
