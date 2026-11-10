# Iteration 9: The migration mechanics, record instead of invent

## Focus

Design the old-repo migration flow from the code that already implements it: `upgrade-legacy.mjs` apply semantics, the `upgrade-baseline.json` grandfathering ledger, the validator's read of it, and the reversibility properties. This is the core of Q3's answer.

## Actions Taken

- Read `upgrade-legacy.mjs` `findingsOf`, `recordFindings` and the apply branch of `main`.
- Read the `NEVER_RECORDED_RULES` set and the orchestrator's `UPGRADE_BASELINE_FILE` reading.
- Confirmed there is no committed `upgrade-baseline.json` in this tree, only its test.

## Findings

1. The apply flow is fail-closed and staged: validate every packet first; if `--apply` and any packet is unreadable, write NOTHING and exit 2; then repair only non-archived failing packets; re-validate; then record remaining findings only for packets that were already failing at the start. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:497] CONFIRMED
2. The recorded findings live in `upgrade-baseline.json` beside the packet's documents, written atomically with `{schema, recordedBy, recordedAt, findings:[{rule, detail}]}`; the write refuses to leave the roots; an identical existing finding set returns `unchanged` instead of rewriting, so re-recording is idempotent. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:442] CONFIRMED
3. The validator reads that baseline: a finding listed in it is reported with a recorded note and relaxed to a warning; a finding the file does not name stays an error. The grandfathering is therefore per-detail, and every copy of a repeated detail must be listed or the entry flips back to an error. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:930] CONFIRMED
4. The never-recorded set is exactly the derivable class: GENERATED_METADATA_INTEGRITY, GENERATED_METADATA_DRIFT, METADATA_DISK_PATH_CONSISTENCY, CANONICAL_SAVE_LINEAGE_REQUIRED, GRAPH_METADATA_CHILD_IDENTITY. For live packets these can never become warnings; they must be repaired. Authored findings may be recorded. Archived packets are exempt from the never-recorded filter because their repairs are out of scope by default. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:94] CONFIRMED
5. Damage protection is built in: a packet that passed before a repair step and fails after it is never recorded, so a regression caused by the pipeline itself stays an error and is reported instead of hidden. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:509] CONFIRMED
6. Archived packets are recorded only, never repaired, unless `--include-archive` is passed deliberately; their findings can still be recorded because they are historical snapshots, which is how the archive stays passable without being rewritten. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:203] CONFIRMED
7. Reversibility properties follow from the writes: dry run is the default; repairs change structure, derived fields and paths only (with the two tools' refusal boundaries); every write lands in tracked files, so git restores it; and deleting a baseline entry re-raises its error rather than losing it, so the baseline cannot silently absorb a regression. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:12] CONFIRMED as design, INFERRED as a documented operator contract (no operator-facing doc of the baseline lifecycle was found in this iteration)

## Ruled Out

- Satisfying the operator constraint "never inventing history" by leaving old packets failing: the pipeline records unresolved authored findings instead, which keeps the error visible as a warning and leaves a ledger entry naming exactly what is unresolved.
- Auto-fixing never-recorded rules via the baseline: the code refuses, by design, for the five derivable rules.

## Dead Ends

- Searching for committed baseline examples: none exist in this tree yet, only the unit test, so the baseline remains an unexercised production path here.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: finding 6 (archive findings recordable) could read as contradicting "archived snapshots are only recorded, never rewritten"; it is the same policy, since recording writes the baseline beside the packet without touching the packet's documents.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs`
- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts`

## Assessment

- New information ratio: 0.90 (6 of 7 findings fully new; 1 documents the reversibility contract and counts as half new)
- Questions addressed: Q3 mechanics (detect, heal, record, reverse), Q2 (the derivable/authored line made precise)
- Questions answered: none yet

## Recommendations

| ID | Recommendation | Question | Where it lives | Effort | Risk | Files touched | Evidence | Standing | Idempotent? | Reversed by | Changes document prose? |
|----|----------------|----------|----------------|--------|------|---------------|----------|----------|-------------|-------------|--------------------------|
| R-023 | Document the migration as a three-stage operator procedure: detect (read-only census), dry-run heal (upgrade-legacy without --apply), apply with approval (--apply, then re-validate), with the baseline as the grandfathering ledger and a stated rule that deleting an entry re-raises its error | Q3 | `upgrade-legacy.mjs` header docs plus the doctor corpus check presentation | S | Low; docs plus existing behavior | Docs | Apply flow at upgrade-legacy.mjs:497, baseline at :442, validator read at orchestrator.ts:930 | CONFIRMED behavior, INFERRED doc shape | Yes (dry run first; re-record unchanged) | Delete the baseline file | No |
| R-024 | Make the census stage report per class before any write: failing packets, never-recorded (must-repair) findings, authored (recordable) findings, and per-rule counts, so an external user sees exactly what a heal would and would not change | Q3, Q5 | A `--json`/census mode beside `upgrade-legacy.mjs` | S | Low; read-only | New mode or script | The apply flow already computes both sets; only the presentation is missing | CONFIRMED data exists, INFERRED mode shape | Yes (read-only) | Delete the script | No |
| R-025 | Keep the archive contract explicit in the procedure: archived packets are recorded, not repaired, unless the operator opts in with `--include-archive`; when opted in, repairs remain structural/derived only | Q3, Q4 | Same docs and doctor presentation | S | Low | Docs | upgrade-legacy.mjs:203 and the archive policy tension from iteration 7 | CONFIRMED | n/a | n/a | No |

## Reflection

- What worked and why: the apply branch and the baseline writer are small, self-documenting functions; reading them together produced the full migration lifecycle with exact refusal semantics.
- What did not work and why: nothing failed. The absence of any committed baseline example is itself informative (the path is new).
- What I would do differently: pair this with a real old-packet fixture walkthrough in an adversarial pass, since no production baseline exists yet to observe.

## Recommended Next Focus

Iteration 10: pin down pre-v4 layout evidence: find real old-template artifacts in the corpus (template header versions, docs without frontmatter, packets without generated metadata) and classify which pipeline stage each maps to, so the detection census in R-021/R-024 has concrete classes.
