---
title: "Independent adversarial verification — shadow-parity independent derivation"
trigger_phrases: []
---
# Independent adversarial verification — shadow-parity independent derivation

Performed 2026-08-19 by a different actor than the builder, as REQ-U04 requires.
The posture was refutation: every check below was built to make the packet's
central claim fail, and is reported whether or not it did.

**Claim under attack.** Each of the six modes derives its ledger side and its
legacy side by genuinely different code paths, so the shadow-parity harness can
actually fail — the defect recorded as `F-006-01` was a harness comparing a
projection to a near-copy of itself.

**Verdict: the independence claim HOLDS on all six modes.** Two direct
refutation attempts failed to break it. A third measured how much of the event
surface the proof actually covers, and a fourth re-enabled every disabled test to
see what the green run was hiding — which confirmed that no planted divergence
goes undetected.

Two real findings came out of it, neither a refutation. The gate is **narrower**
than "six modes verified" suggests: on the modes that can be measured exactly,
roughly half the event surface is never compared. And the suite carries **ten
non-functioning tests** that read as coverage — seven of them disabled with no
recorded reason. The packet's own limitation text is also stale.

Reproduction scripts sit beside this file: `independence-audit.py.txt` and
`cross-file-audit.py.txt`.

## Attempt 1 — in-file call-graph reachability

Rather than read imports and trust them, this builds each adapter's own call
graph and asks two questions by transitive reachability: does the legacy entry
point reach the reducer fold, and does the ledger entry point reach back into
the raw-event scan?

| Mode | Verdict |
|---|---|
| deep-ai-council | HOLDS — legacy never reaches `foldDeepAiCouncilEvents`; ledger folds and never re-enters `councilProjectionFromEvents` / `councilLegacyProjection` |
| agent-improvement | HOLDS — legacy never reaches `foldAgentImprovementEvents`; ledger folds and never re-enters `legacyProjection` |
| model-benchmark | HOLDS — legacy never reaches `foldModelBenchmarkEvents`; ledger folds and never re-enters `legacyProjection` |
| skill-benchmark | HOLDS — legacy never reaches `foldSkillBenchmarkEvents`; ledger folds and never re-enters `legacyProjection` |
| deep-alignment | HOLDS — legacy never reaches `foldDeepAlignmentEvents`; ledger folds and never re-enters `legacyProjection` |
| deep-review | HOLDS — legacy never reaches `foldDeepReviewEvents`; ledger folds and never re-enters `legacyProjection` |

The audit also asserts the ledger side *does* reach a fold, so a mode cannot
pass by deriving from neither source.

**Negative control.** A green instrument that cannot go red proves nothing, so
the same audit was run against the pre-fix council adapter (`8b6b7b1f7e^`). It
reports `REFUTED — ledger side reaches raw-event scan: councilProjectionFromEvents`,
which is exactly the `F-006-01` defect. The instrument detects the thing it
claims to detect.

## Attempt 2 — cross-file laundering

Attempt 1 only sees calls inside the adapter file, so an obvious evasion
remains: the legacy side could reach the fold through an imported module. This
resolves every value import the legacy side actually reaches and follows those
modules transitively.

All six modes HOLD. On every mode the legacy side reaches exactly three external
symbols — `canonicalBytes`, `sha256Bytes`, and the mode's resume-decision parser
— and none of them reaches a fold.

**Negative control.** Run against the ledger side of the same file, the detector
resolves `foldDeepAiCouncilEvents` to `lib/deep-ai-council-reducers/index.ts`.
It fires when a fold is reachable, so the legacy-side silence is a real result
and not a parsing failure. 41 value imports were parsed in that file.

## Attempt 3 — how much of the event surface the proof actually covers

Independence holding does not mean the divergence proof is broad. The packet
records a REQ-005 surface-coverage gap but never quantifies it, so this measures
it directly: stems handled by the legacy oracle versus distinct stems the parity
fixture actually emits.

| Mode | Handled by the oracle | Never compared | Method |
|---|---|---|---|
| deep-alignment | 41 | **21** | exact — fixture selects indices from a named catalogue |
| deep-review | 19 | 4 | exact — same index-selection idiom |
| agent-improvement | 12 | **>= 6** | conservative — stems never named anywhere in the suite |
| model-benchmark | 19 | >= 3 | conservative |
| skill-benchmark | 17 | >= 3 | conservative |
| deep-ai-council | 13 | >= 0 | conservative — every handled stem is named somewhere in the suite |

Two measurement methods, because the modes build fixtures differently, and the
weaker one is labelled as such rather than presented as equivalent.

**Exact**, for the two modes whose fixtures pick indices out of a named event
catalogue: the distinct stems those picks actually resolve to. deep-alignment's
21 unexercised stems include load-bearing lifecycle events — `run_completed`,
`convergence_evaluated`, `graph_convergence_evaluated`, `finding_state_changed`,
`review_report_committed`, and both continuity-save stems.

**Conservative**, for the other four: stems the oracle handles that are never
named *anywhere* in the suite, not even in an unrelated assertion. A stem can be
named and still never reach the compared fixture, so each of these is a floor on
the real gap, never a ceiling. agent-improvement is the notable one — at least
half of its twelve oracle branches are never mentioned in its own suite,
including `ablation_completed`, `counterfactual_replayed`, `mutation_rejected`
and `known_defect_injected`.

For every stem in that column the two derivations are never compared against
each other, so a divergence there would not be caught by this gate today.

This is a **narrowness finding, not a refutation**: the harness is genuinely
capable of failing, and does fail on planted divergences, but the surface it is
proven to cover is materially smaller than "six modes verified" suggests.

Per this packet's own severity calibration, read it as cutover-readiness risk,
not breach risk.

## Attempt 4 — what the green run is not running

The six suites pass at HEAD: **6 files, 266 passed, 32 skipped, exit 0, 1300.74s**.
A green run with 32 skips invites the obvious question — is the gate green because
it passes, or because the hard cases are switched off? Every skip was classified,
and the ones with real bodies were re-enabled and executed.

The 32 split three ways: **20 documented no-ops**, empty bodies whose only
content is a comment explaining why that field cannot be divergence-tested this
way (the executor's closed-terminal gate re-reads the field and fails closed
before the comparator; the fixture never populates a resume digest; the reducer
never persists an ablation digest); **5 that carry both a body and a rationale**;
and **7 that carry a full body and no rationale at all** — three in
agent-improvement, four in deep-alignment. The first group are honest markers,
not evasion.

All ten bodied skips were re-enabled and executed, the seven undocumented ones
plus the three that had a rationale, so the result below does not depend on my
classification being right.

| Group | Result when re-enabled |
|---|---|
| agent-improvement (5) | Fail in 1-3 ms with `EnvelopeValidationError: Payload validator rejected the event` — the fixture builds events the current schema rejects, at `push` -> `createEvent` -> `prepareAgentImprovementEvent`. They have never worked; git shows them authored already-skipped in `a9dbf88154` and never once enabled |
| deep-alignment (5) | Run for real (7-12 s each) and fail with `AssertionError: expected 'execution-outcome' to be 'projection-semantic'` |

**Neither group shows a divergence going undetected**, which is the claim that
mattered. The deep-alignment five prove the opposite: the harness *does* catch
the planted corruption, and classifies it `execution-outcome` rather than
`projection-semantic` — the same fail-closed behaviour that is explicitly
documented in the council, agent-improvement and model-benchmark no-op comments.
Those five were disabled for a reason that other modes wrote down and this one
did not.

The agent-improvement five are weaker than they look in a different way: they are
not disabled tests, they are unfinished ones. A reader skimming the file sees ten
named per-field divergence assertions and would reasonably assume the fields are
covered.

**Recommendation.** Give the deep-alignment five the one-line rationale their
siblings already carry, or re-point them at `execution-outcome` and enable them.
Either fix the agent-improvement five's fixture payloads or delete them; leaving
a test that cannot construct its own fixture is worse than having no test, because
it reads as coverage.

**Attribution note.** The same re-enabled run also showed three previously-green
tests failing (`candidate-ids`, `raw-trial-digests`, `score-policy-versions`),
all with `Test timed out in 30000ms`. Those are load artifacts from running heavy
suites concurrently on a working machine, not defects: the same three passed in
the clean six-suite run on identical code. They are recorded here so the number
is not mistaken for a regression.

## Finding: the packet's own limitation text is stale

`implementation-summary.md` states that empirical verification "covers only the
9 event stems the current fixture emits" for deep-alignment. The fixture now
runs 10 scenarios covering 20 distinct stems, so the recorded figure understates
current coverage by more than half — while the *gap* it warns about is real and
larger in absolute terms (21 stems) than the sentence suggests.

Either way, a reader deciding whether shadow parity is a strong enough cutover
precondition would be reasoning from a number that no longer matches the code.

## What was not attacked

- Field-level correctness of each converter against its reducer schema. The
  builder verified this empirically per mode; re-deriving it independently was
  out of scope for this pass and is not claimed here.
- Exact surface coverage for the four modes without an index-selected fixture.
  They were measured only by the conservative method above, which yields a floor
  on the gap rather than the number itself.
- Runtime behaviour beyond the suite results recorded in the checklist.
