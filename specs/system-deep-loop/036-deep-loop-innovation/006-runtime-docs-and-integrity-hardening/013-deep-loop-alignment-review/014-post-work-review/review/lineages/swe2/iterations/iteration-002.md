# Iteration 2 — Ledger Stem Census Audit

**Focus:** D3 Traceability + D1 Correctness — Angle 2: does the 61-stem census hold against the emitter surface, and does `check-ledger-stem-producers.cjs` catch the drift it claims to catch?
**Phase record audited:** `007-ledger-stem-producers`

## Method

1. Recomputed the census totals from both types files rather than trusting the phase's numbers.
2. Ran the checker itself against the committed tree (read-only: it scans files and prints JSON; writes nothing).
3. Grepped the whole `.opencode` tree for `stem:`-key emissions outside the 9-file producer surface, and for dotted `deep_review.*`/`deep_research.*` spellings riding any non-`stem` key.
4. Spot-checked reserved reasons against the mechanisms they name (pause sentinel, blocked_stop flat rows, migration staging, recovery_baseline branch).
5. Built a fixture repo inside this lineage's scratch dir (copies of all 11 census-relevant files), verified it reproduces the clean baseline, then mutated it to test four violation rules.

## Evidence

### Census totals — verified

- Review lane: `DeepReviewEventStems` holds 32 stems [SOURCE: deep-review-ledger-types.ts:540-573]; census declares 4 spoken / 28 reserved [SOURCE: deep-review-ledger-types.ts:586-619].
- Research lane: census declares 1 spoken / 28 reserved across 29 stems [SOURCE: deep-research-ledger-types.ts:453].
- Combined: 61 registered, 5 spoken, 56 reserved — matching SC-001 exactly.

### Live checker run — verified

`node check-ledger-stem-producers.cjs` on the real tree: `{"ok":true, "registered":61, "spoken":5, "reserved":56, emitters: 10 occurrences over 5 stems, "violations":[]}`, exit 0. Matches the implementation summary's verification row verbatim [SOURCE: 007-ledger-stem-producers/implementation-summary.md:118].

### Spoken stems — every declared producer emits literally

- `deep_review.migration` — staged via mktemp + append-mode-event gateway in both review workflows [SOURCE: deep-review-auto.yaml:293, deep-review-confirm.yaml:275].
- `deep_review.recovery_baseline` — emitted only inside review-auto's detached `cli-opencode` recovery branch; absent from confirm because that branch is executor-gated [SOURCE: deep-review-auto.yaml:~1715; cross-checks F001's site census].
- `deep_review.claim_adjudication` — two emission sites per review workflow (checker reports 4 emitter occurrences over 2 files).
- `deep_review.iteration_error` — one site per review workflow.
- `deep_research.run_now_restored` — emitted at research-auto:1747 inside the run-now restore step; declared producer is that same file [SOURCE: deep-research-ledger-types.ts:453].

### Reserved reasons — mechanisms exist where the reasons say they do

- `pause_recorded`: "a pause is a sentinel file" — `state_paths.pause_sentinel` and `step_check_pause_sentinel`/`step_normalize_pause_events` exist [SOURCE: deep-review-auto.yaml:133,571,968].
- `blocked_stop_recorded`: "blocked stops are flat events the reducer reads" — flat `event:"blocked_stop"` appends exist in both review workflows [SOURCE: deep-review-auto.yaml:745, deep-review-confirm.yaml:747].
- `recovery_started`: "recovery runs through the detached-dispatch branch" — the cli-opencode-only branch exists and is census-documented as auto-only.

### Emitter-surface completeness — no shadow producers found

Repo-wide grep for `stem:`-keyed `deep_review.*`/`deep_research.*` emissions outside the 9-file `PRODUCER_SURFACE`: zero hits. The only dotted spelling on a non-`stem` key anywhere in the surface is census prose itself [SOURCE: deep-review-confirm.yaml:2121]. `append-mode-event.cjs`, both reducers, `verify-iteration.cjs`, `fanout-run.cjs` emit no literal stems — consistent with the census naming only workflow YAMLs as producers.

### Checker adversarial testing — all four tested rules fire

Fixture root under `lineages/swe2/scratch/stem-fixture/` (copies of both types files + all 9 producer files):

| Test | Mutation | Result |
|------|----------|--------|
| T1 | none | `ok:true`, 61/5/56 — baseline reproduces |
| T2 | flip `iteration_error` to `reserved` | `RESERVED_STEM_EMITTED` on deep-review-auto.yaml, exit 2 |
| T3 | append `stem:"deep_review.forged_stem"` to a producer | `UNREGISTERED_EMITTER`, exit 2 |
| T4 | delete the `migration` census entry | `UNDECLARED_STEM`, exit 2 |
| T5 | add `verify-iteration.cjs` as a producer of `migration` | `SPOKEN_WITHOUT_EMITTER`, exit 2 |

## Findings

### F003 (P2 — maintainability): literal-spelling scan cannot see computed stem emissions

`EMITTED_STEM_PATTERN` requires a literal dotted spelling in quotes after a `stem` key [SOURCE: check-ledger-stem-producers.cjs:67]. A producer that emits `stem: ${variable}` or builds the record dynamically produces no match — invisible to `RESERVED_STEM_EMITTED` and `UNREGISTERED_EMITTER` alike. The drift the census exists to catch would pass silently. No producer does this today (verified: zero templated `stem:` keys in the surface), and the checker header honestly scopes the model to "the structured `stem` key a producer writes" [SOURCE: check-ledger-stem-producers.cjs:19-20] — so this is a coverage-limitation advisory, not a live defect.

*Adjudication:* claim = "the scan misses non-literal emissions"; evidence = regex at :67 requires `[A-Za-z0-9_]+\.[A-Za-z0-9_]+` inside quotes; counterevidence sought = templated stem emission in any producer (none found); alternative = computed stems would still fail at append-gateway validation downstream, but that's a different gate; severity P2; confidence high; downgrade trigger = a fixture proving a computed spelling is caught anyway.

## Claims refuted

- "A reserved stem has a producer" — refuted: all 56 reserved stems have zero literal emitters (checker + independent grep agree).
- "The census misses an emitter outside the declared surface" — refuted: repo-wide scan found no `stem:` emissions outside the 9 files.
- "The checker rubber-stamps" — refuted: all four tested drift classes produce named violations at exit 2.

## Notes (not findings)

- `claim_adjudication` is emitted at two sites per review workflow while the census lists each file once — file-granularity is the declared model, consistent.
- A spoken stem emitted by a file other than the declared producer is still caught, via `SPOKEN_WITHOUT_EMITTER` on the declared file — the extra emitter file goes unnamed, but drift still fails loudly.

## Verdict rationale

Census totals, spoken-stem declarations, reserved reasons, and checker enforcement all verified against ground truth. One coverage-limitation advisory (P2). No P0/P1.

Review verdict: PASS
