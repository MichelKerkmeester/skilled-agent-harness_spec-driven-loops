# Iteration 15: Fan-in Verification and Deterministic Branch-to-Join Replay

## Focus
Verify `fanout-merge.cjs` as the fan-in boundary: stable merge ordering, duplicate and conflict semantics, registry/state-log write boundaries, and the DB-independent contract. Then specify how a deterministic branch-to-join replay should reconstruct a run from merged registry data plus lineage-local state/delta evidence, and how a graph join can add ordered merge edges and finding provenance without becoming a second authority plane.

## Actions Taken
- Read the authoritative iteration prompt pack and the required config, state log, strategy, and registry before selecting the focus.
- Verified that the write-once iteration and delta targets were absent and remained packet-local.
- Read `fanout-merge.cjs` directly, including its ordering, conflict, lineage reconstruction, and output paths.
- Inspected the `deep-research-auto.yaml` synthesis sequence for fan-out merge, stable lineage-state counting, iteration-file identity, delta/resource-map handling, and final research synthesis.
- Read iteration 14 to close its explicitly recorded direct-verification gap rather than reopening saturated graph-database work.

## Findings
1. **[P1] Fan-in output order is deterministic and is not arrival-order dependent.** `fanout-merge.cjs` sorts lineage directory labels before loading them, sorts each merged record by normalized content and then the selected ID keys, and applies the same comparator to the final flattened finding arrays. Research `mergedFrom`, question collections, and ruled-out directions are therefore emitted in stable order; each `_lineages` array is also sorted. The ordering contract is content-first/ID-tiebreak, not “first branch wins.” [SOURCE: `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:332-352,350-362,479-493,543-557,632-712,1080-1089`]

2. **[P1] Duplicate and conflict semantics preserve both same-ID claims when content differs.** In the default merge mode, findings are bucketed by `id` (or `findingId` for review); same-content duplicates collapse and union sorted lineage labels. Same-ID/different-content variants are content-sorted, receive deterministic synthetic IDs containing a short content digest, retain `_conflictOf`/`_conflict_id`, and receive reciprocal `_conflicts` entries with `relation: 'CONTRADICTS'`, peer IDs, peer lineages, and the `same-id-different-content` basis. Optional near-duplicate mode adds title-aware matching; review merge additionally chooses the strongest severity for an equivalent active finding and computes P0→`FAIL`, P1→`CONDITIONAL`, otherwise `PASS`. [SOURCE: `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:249-267,318-326,382-420,428-476,496-541,742-823`]

3. **[P1] The merge consolidates registries and attribution, while lineage state logs remain read-only evidence inputs.** The main path reads each lineage registry, compatibility registry, state log, and iteration markdown; if a leaf lineage lacks a usable registry, it reconstructs a minimal registry from its state/iteration evidence. It then writes only the base merged registry (plus the research compatibility registry) and `fanout-attribution.md` atomically. There is no state-log write in this script: `deep-research-state.jsonl` and lineage iteration files are consumed to reconstruct findings and metrics, not rewritten by fan-in. [SOURCE: `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:146-205,1057-1140,1142-1169`]

4. **[P1] A deterministic branch-to-join replay should treat the merged registry as a projection, not as the event ledger.** Replay should enumerate lineage labels in sorted order, read each lineage's state log and iteration files without renumbering or collapsing source paths, normalize/reconstruct the lineage registry, merge findings/questions/directions with the comparator and conflict rules above, and retain `_lineages` plus conflict peers as provenance. The graph join can represent `branch -> lineage delta -> normalized registry -> merged registry` edges and attach each finding to its source lineage; it must not infer missing execution events from a merged finding or replace the append-only lineage records. This follows the workflow's stable lineage-state counting and full-source-path preservation requirements. [SOURCE: `.opencode/commands/deep/assets/deep-research-auto.yaml:1594-1626`; SOURCE: `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:667-729,1096-1127`; [INFERENCE: based on the explicit read-only state inputs, sorted merge comparator, `_lineages`, and conflict markers]]

5. **[P2] The fan-in contract is DB-independent.** `fanout-merge.cjs` depends on filesystem validation, JSON/JSONL parsing, hashing, and atomic state/text writers; it does not import or call the coverage-graph database or the graph-convergence command. The workflow invokes coverage-graph convergence separately before the inline vote, while synthesis invokes fan-in as its own completed command. Therefore registry merge, conflict preservation, lineage attribution, and replay-fixture parity can be tested with graph storage unavailable; DB availability remains optional telemetry rather than a correctness precondition. [SOURCE: `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:24-38,1057-1059,1149-1169`; SOURCE: `.opencode/commands/deep/assets/deep-research-auto.yaml:608-619,1584-1592`; [INFERENCE: comparing the independent filesystem merge path with the separately invoked graph-convergence step]]

## Questions Answered
- Q5 fan-in portion: exact stable ordering, duplicate/conflict behavior, lineage provenance, and a graph-safe branch-to-join replay contract.
- Q1/Q5 runtime boundary refinement: fan-in is a registry/attribution projection over lineage artifacts, not a replacement for append-only state or graph-database control.

## Questions Remaining
- An implementation owner still needs to execute a small deterministic replay fixture with two or more lineages, same-content duplicates, same-ID conflicts, missing registries, salvaged findings, and shuffled input order.
- Canonical reducer snapshot serialization and production parity remain unexecuted; graph-database unavailability must be covered as a graph-off fixture case.
- The complete 024 caller-migration verification and owner-approved accounting for 034 and 036-046 remain outside this focus.

## Ruled Out
- Treating input/arrival order as the canonical merge order; the implementation sorts content, IDs, labels, and final output arrays. [SOURCE: `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:332-352,350-362`]
- Treating the merged registry as a rewriteable substitute for lineage state logs or append-only deltas. [SOURCE: `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1096-1127,1149-1169`; [INFERENCE: based on read-only state consumption and registry-only output writes]]
- Making coverage-graph DB availability a prerequisite for fan-in correctness or replay parity. [SOURCE: `.opencode/commands/deep/assets/deep-research-auto.yaml:608-619,1584-1592`; [INFERENCE: based on separate graph-convergence and filesystem fan-in commands]]

## Dead Ends
- None newly introduced. The prior iteration's direct-read gap for `fanout-merge.cjs` was resolved; the previously blocked database-first/live-graph path was not retried.

## Edge Cases
- Ambiguous input: none; the prompt's direct merge-verification focus took precedence over broader residual questions.
- Contradictory evidence: none newly found. The implementation's default ID-conflict path and optional near-duplicate path are distinct modes, not contradictory claims.
- Missing dependencies: the coverage-graph DB remains unavailable per prior state events, but it is not required by the fan-in implementation; static source verification was sufficient for this iteration.
- Partial success: static contract verification is complete, but no live multi-lineage replay fixture was executed; the fixture remains the smallest next implementation-owned validation.

## Sources Consulted
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:146-205,249-267,318-420,428-557,632-729,742-823,1057-1169`
- `.opencode/commands/deep/assets/deep-research-auto.yaml:608-619,1584-1667,1818-1868`
- `specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-014.md`
- `specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl: prior graph-convergence and graph-upsert skipped events`

## Assessment
- New information ratio: **0.90** (four findings are fully new direct merge-contract evidence; one is a partially new replay/DB-boundary synthesis; no simplicity bonus claimed).
- Questions addressed: Q5 fan-in verification and branch-to-join replay; Q1/Q5 registry/state/graph boundary.
- Questions answered: exact ordering and conflict behavior, registry versus state-log write boundary, DB-independent fan-in, and the deterministic replay model.

## Reflection
- What worked and why: reading the merge implementation's pure helpers and main output path together with the synthesis YAML made the ordering, provenance, and non-rewrite guarantees directly verifiable instead of inferred from the fan-out runner.
- What did not work and why: no executable multi-lineage fixture was run in this bounded research iteration; source evidence established the contract but not runtime parity under shuffled or damaged inputs.
- What I would do differently: next implementation pass should build the smallest fixture first, assert byte-stable merged output across lineage permutations, then repeat with graph convergence disabled and with a missing registry reconstructed from state.

## Recommended Next Focus
Build and execute the deterministic branch-to-join replay fixture: permute lineage/input order, assert stable merged registry bytes and `_lineages`, verify same-ID conflict edges and salvage/reconstruction cases, and run the exact test with graph storage unavailable. Keep lineage state logs and append-only deltas authoritative; treat the merged registry and attribution markdown as derived join outputs.

## SCOPE VIOLATIONS
None. No researched target or reducer-owned file was modified.
