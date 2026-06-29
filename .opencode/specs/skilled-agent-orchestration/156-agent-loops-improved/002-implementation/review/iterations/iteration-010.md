# Dimension

correctness: logic correctness: decay/fuzzy scoring, query edges, jsonl round-state

# Files Reviewed

- `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts:1` - full file, schema/lifecycle/upsert/snapshot/stat contracts.
- `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts:1` - full file, query edge direction, fuzzy similarity, unverified-claim semantics.
- `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:1` - full file, time decay, novelty, signal scoring, snapshot creation.
- `.opencode/skills/deep-loop-runtime/lib/council/convergence.cjs:1` - full file, council convergence scoring and bridge payload.
- `.opencode/skills/deep-loop-runtime/lib/council/round-state-jsonl.cjs:1` - full file, JSONL repair, locking, append/read contracts.
- Coupled surfaces inspected: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:1`, `.opencode/skills/deep-loop-runtime/scripts/query.cjs:1`, `.opencode/skills/deep-loop-runtime/tests/unit/coverage-graph-query.vitest.ts:1`, `.opencode/skills/deep-loop-runtime/tests/unit/coverage-graph-signals.vitest.ts:1`, `.opencode/skills/deep-loop-runtime/tests/council/round-state-jsonl.vitest.ts:1`, `.opencode/commands/deep/assets/deep_review_auto.yaml:413`, `.opencode/commands/deep/assets/deep_review_confirm.yaml:975`, `.opencode/skills/deep-loop-workflows/deep-review/references/state/state_jsonl.md:149`, `.opencode/skills/deep-loop-runtime/references/coverage_graph_schema.md:52`.

# Findings by Severity

## P0

None.

## P1

### R10-P1-001 - Review FILE coverage gaps use the wrong edge direction

- Evidence: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts:462`, `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts:480`, `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts:482`, `.opencode/commands/deep/assets/deep_review_auto.yaml:416`, `.opencode/commands/deep/assets/deep_review_auto.yaml:419`, `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:480`, `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:485`, `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:301`, `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:304`.
- Why: `findCoverageGaps()` includes `FILE` nodes in the review target set, but then treats every review target as covered only by outgoing `COVERS` or `EVIDENCE_FOR` edges from the node. The review seed path emits `SLICE -> FILE` `COVERS` edges, and the hotspot/scoring path also treats files as covered when the file is the edge target. A normal review graph with a seeded file grouping can therefore still report the file as uncovered through `query.cjs --query-type coverage_gaps`.
- Suggested fix direction: Split review gap logic by kind. Keep dimensions aligned with dimension coverage, but treat files as covered by inbound `COVERS` from a slice/dimension and/or inbound `IN_FILE`, then add an integration test with a `SLICE/DIMENSION -> FILE` edge that must not produce a `FILE` gap.

### R10-P1-002 - Research claim verification query disagrees with convergence scoring

- Evidence: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts:634`, `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts:669`, `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts:670`, `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:567`, `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:589`, `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:641`, `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:681`.
- Why: `computeResearchClaimVerificationRateFromData()` counts any present `verification_status` other than `unresolved` as verified, but `findUnverifiedClaims()` only accepts literal `verified`. A claim with `verification_status: "supported"` or `"confirmed"` passes the convergence score and still appears in `unverified_claims`, giving query output and convergence warning blockers that contradict the score.
- Suggested fix direction: Use one shared verification predicate in query and signal code. Either make both exact-`verified`, or make both "present and not unresolved", then add a test for a non-`unresolved` status that exercises both `claimVerificationRate` and `unverified_claims`.

### R10-P1-003 - Round-state append corrupts a valid final JSONL line without a newline

- Evidence: `.opencode/skills/deep-loop-runtime/lib/council/round-state-jsonl.cjs:66`, `.opencode/skills/deep-loop-runtime/lib/council/round-state-jsonl.cjs:69`, `.opencode/skills/deep-loop-runtime/lib/council/round-state-jsonl.cjs:71`, `.opencode/skills/deep-loop-runtime/lib/council/round-state-jsonl.cjs:254`, `.opencode/skills/deep-loop-runtime/lib/council/round-state-jsonl.cjs:257`, `.opencode/skills/deep-loop-runtime/lib/council/round-state-jsonl.cjs:265`, `.opencode/skills/deep-loop-runtime/tests/council/round-state-jsonl.vitest.ts:48`, `.opencode/skills/deep-loop-runtime/tests/council/round-state-jsonl.vitest.ts:72`.
- Why: `repairRoundStateJsonl()` treats a trailing valid JSON object without a newline as clean, returning the full byte length. `appendRoundStateRecord()` then appends the next JSON object immediately after it, producing `}{` concatenation on one line. The next repair pass sees that line as invalid and truncates back to the prior newline, which can drop both the previously valid tail record and the new append.
- Suggested fix direction: Under the append lock, ensure a non-empty state file ends with `\n` before appending, or have repair normalize a valid no-newline tail by preserving it and adding the separator. Add a regression where the file starts as `{"type":"round_started"}` with no trailing newline and the next append yields two readable records.

### R10-P1-004 - Read-side JSONL repair ignores the writer lock

- Evidence: `.opencode/skills/deep-loop-runtime/lib/council/round-state-jsonl.cjs:164`, `.opencode/skills/deep-loop-runtime/lib/council/round-state-jsonl.cjs:251`, `.opencode/skills/deep-loop-runtime/lib/council/round-state-jsonl.cjs:252`, `.opencode/skills/deep-loop-runtime/lib/council/round-state-jsonl.cjs:263`, `.opencode/skills/deep-loop-runtime/lib/council/round-state-jsonl.cjs:290`, `.opencode/skills/deep-loop-runtime/lib/council/round-state-jsonl.cjs:292`, `.opencode/skills/deep-loop-runtime/lib/council/round-state-jsonl.cjs:293`.
- Why: Appends acquire a `.lock` file before repairing and writing, but `readRoundStateRecords()` repairs by default without acquiring or honoring that same lock. A concurrent reader can observe a partially written trailing line, call `repairRoundStateJsonl()`, and truncate the file while the writer still holds the cooperative write lock.
- Suggested fix direction: Do not mutate from the read path unless the reader first acquires the same lock, or make `repair: false` the read default and expose a separate locked repair operation for resume recovery. Add a regression that simulates a held lock plus partial tail and verifies readers do not truncate.

## P2

### R10-P2-001 - Fuzzy substring scoring lets very short aliases match at the default merge threshold

- Evidence: `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts:106`, `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts:107`, `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts:244`, `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts:249`, `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts:388`, `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts:401`.
- Why: `calculateNameSimilarity()` returns `0.85` for any substring match, and the default consolidation threshold is also `0.85`. Because the substring branch runs before the fuzzy-word minimum length gate, short same-kind names like `io` can cluster with unrelated names containing those letters. The operation is query-only, so this is not immediate state corruption, but it can produce bad consolidation candidates.
- Suggested fix direction: Require a minimum substring length and token boundary for the `SUBSTRING_SIMILARITY_SCORE` path, or lower substring-only matches below the default threshold. Add tests for two-character aliases and punctuation-heavy names.

# Verdict

CONDITIONAL

# Notes

No P0 found in this pass. The strongest issues are query/scoring contract drift and JSONL repair edge cases that can produce false graph state or data loss under plausible recovery/concurrency conditions. The council convergence scoring path itself looked internally consistent for the inspected signals.
