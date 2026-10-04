# Iteration 003 — Routing clarify default: the 3-of-365 base rate, the refusal, and the power wall

- **Focus:** The fixture keep (28 vs 15 of 54) against the live router clarifying 3 of 359 committed prompts; the scorer's refusal of rows the router no longer clarifies; what corpus, labels, keep rule and power would prove a live win or settle a kill; accuracy changes; hardening; the live-path seam; tests. (Q3)
- **Read first:** no `steer.md` exists in this lineage yet (checked at iteration start, absent).
- **Lens:** every claim gets a `file:line` or a named command; every "confirmed" names the check that produced it.

## Actions Taken

1. Read the 049/007 build record: `049-jev-feature-improvement-build/007-clarify-default-improvements/{implementation-summary.md,goal.md}` (what shipped, verification, limitations).
2. Ran the scorer's census read-only (zero model calls, writes nothing without `--report`): `node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` → 365 prompts replayed, `clarify=3` (2 mode + 1 checklist).
3. Ran the fixture replay read-only: `score-clarify-default.cjs --score ~/.skilled/.labels/020-rows.jsonl` → 42 refused (route), 12 labeled, `stop: fewer than 30 labeled rows`.
4. Read the scorer's replay/refusal, label gate, baselines and early-stop code (`score-clarify-default.cjs:45,82-156,632-695,1532-1560`).
5. Read the routing seam: `014-runtime-engine/lib/compiled-route.cjs:96-108` and `resolve.cjs:106-127`.
6. Computed exact sign-test power for the clarify keep rule's sign test.

## Findings

### F-001 — Today's committed-prompt census: 3 clarifications in 365 prompts, and only 2 are mode clarifications (P0, Q3)

The census (zero model calls) printed `total prompts=365 unparsed=24 route=241 clarify=3 defer=90 reject=7 clarify_mode=2 clarify_checklist=1` — the operator's "3 of 359" holds in substance on today's tree (the denominator moved 359 → 365). The clarifications sit in three canary sources: `sk-doc source=canary clarify=1 clarify_mode=1`, `cli-external-orchestration source=canary clarify=1 clarify_mode=1`, `system-deep-loop source=canary clarify=1 clarify_checklist=1`. The surface this feature would serve is 2 mode clarifications in 365 prompts (0.55%), and the census ends with `real clarify rate: not measured` because `--transcripts` was not pointed at real session logs.

- **Confirmed by:** running the census command read-only and reading its totals; cross-checked against the scorer's `transcriptLines` path (`score-clarify-default.cjs:417-429`) which exists to measure the rate but was not run.
- **Implication:** the base rate caps the value of any live suggestion, and any "prove a live win" corpus must be collected from real sessions (shadow logging), not constructed fixtures.

### F-002 — The replay refusal is live: 42 of 54 fixture rows are refused today, and the scorer stops at its 30-row label gate (P0, Q3)

`--score ~/.skilled/.labels/020-rows.jsonl` printed 42 `replay refused: f020-0XX (route)` lines, then `rows: 54 labeled=12 operator=12 committed_gold=0`, then `stop: fewer than 30 labeled rows (12 labeled)`, exit 0. The refusal runs before any model call (`replayRows` at `:632-695`; `LABEL_GATE = 30` at `:45`). This matches the 049/007 record exactly ("12 of 54 rows still clarify at HEAD; 42 now route", `goal.md:83`).

- **Confirmed by:** running the replay and reading the code path; the 049 record agrees with today's run.
- **Implication:** the fixture keep (28 vs 15 of 54) is a historical record on rows the current router mostly no longer asks; the current build cannot even reach the keep rule. The refused-row reporting is the R1 hardening working as designed.

### F-003 — The power wall: proving a named-mode win needs hundreds of discordant pairs, and the base rate makes that ~32k prompts without shadow collection (P0, Q3)

Exact one-sided sign-test power (alpha 0.05) over discordant pairs:

| True discordant win rate | Min discordant pairs for 80% power |
|---|---|
| 0.60 | 158 |
| 0.65 | 69 |
| 0.70 | 37 |

The fixture held 21 discordant pairs (W=17, L=4). At the fixture's 21/54 discordant rate, 69 discordant pairs ≈ 177 clarify rows ≈ **~32,000 committed prompts at today's 2-per-365 mode rate**. Meanwhile the keep rule compares against the first alternative (B=15/54) while **always-none scores 34/54 and beats Jev's 28** — the scorer now *prints* the strongest simple policy (`:1573-1580` baselines) but the verdict does not require beating it.

- **Confirmed by:** exact binomial computation from the fixture counts; the always-none figure from prior research (`048.../007-clarify-default-research/research/research.md:53`) and the scorer's own baseline line.
- **Implication:** a live-win proof at this base rate is infeasible from committed prompts alone; the only viable corpus is shadow-collected real clarifications with the user's pick as a free label, and the keep rule needs class floors plus a strongest-policy bar before any keep can mean "beats doing nothing".

### F-004 — The 049 trust upgrades landed: digests, class/hub results, baselines, early stop (P1, Q3)

The scorer now records rows/labels/options/scorer digests and build identity in `report.json` (`:1625-1653`), prints class and hub results plus first/second/always-none/strongest baselines (`:1570-1596`), accepts label approver and decision reference (`:353-357`), and early-stops after two agreeing orders with the third only on disagreement — the recorded replay matched all 54 modal picks in 118 calls against the 047 run's 163 (`implementation-summary.md:94`; `goal.md:82`). Tests grew to 31 from 22, including a recorded-run replay and a refusal-before-any-call test (`implementation-summary.md:93`).

- **Confirmed by:** reading the code sites and the 049 verification table.
- **Implication:** the measurement kit is in good shape; the remaining gaps are the corpus, the rule floors, and the seam — not instrumentation.

### F-005 — The seam is confirmed: the engine has the alternatives, the normalized route drops them (P1, Q3)

The census and scorer read `decision.clarify.alternatives` directly from `evaluate()` (`:143-144`, `:662`), but the runtime's normalized route returns `{hubId, action, selectionKind, targets, effectivePolicyHash, generation}` with `targets` empty on a clarify action (`014-runtime-engine/lib/compiled-route.cjs:96-108`), and `resolveRoute` serves only that shape, identity-bound to the manifest's selected policy (`resolve.cjs:106-127`). So a suggestion has nowhere to live in the served contract until the normalized output carries the alternatives (or a parallel consumer contract is added).

- **Confirmed by:** reading both files end to end at the clarify branch; the census's `gold_in_alternatives=0` on all cells shows even the raw alternatives rarely contain the gold.
- **Implication:** any live path is a routing-owner contract change first; the prior research's "no seam, no reader" conclusion still holds on today's build.

### F-006 — Integration shape: FEATURES entry plus an advisory beside `action: clarify` (P2, Q3)

Add `'clarify-default': { env: 'JEV_FEATURE_CLARIFY_DEFAULT', aliases: [] }` to `FEATURES` and a live call site beside a clarify decision that asks `featureReady('clarify-default')`, suggests one alternative (never replaces the clarification), and fails open to the plain clarification on `none_of_these`, timeout, error, missing credentials or a generation mismatch. Prerequisites per prior research: a named reader and a scope amendment (020 says the keep serves nothing), shadow logging first (T1), and a payload decision for sending prompt text.

- **Confirmed by:** the gate contract from iteration 1; the seam read (F-005); prior research's T0-T3 tiers (`048.../007/research/research.md:93-108`).
- **Implication:** ranked next step is T0/T1 (shadow logging + transcript rate), not a served suggestion.

### F-007 — Tests to cover (P2, Q3)

Covered today: refusal before any call, recorded-run replay, digests, baselines, early stop, class/hub totals (`implementation-summary.md:63,93`). Missing and needed: a shadow-log capture test (user pick recorded as label), a normalized-route alternatives contract test (consumer side of F-005), class-floor assertions (named-mode accuracy + abstention precision/recall), a strongest-policy-bar verdict case, and a `--transcripts` end-to-end rate test (the path exists but was never run).

- **Confirmed by:** reading the 049 files-changed table and the test file inventory via the scorer's own test run record.
- **Implication:** the tests follow the same stub/recorded-run pattern as track narrowing; none needs a live call.

## Ruled Out

- **Scoring the supplied 54 rows as-is.** 42 of 54 no longer clarify; the refusal is correct (F-002).
- **Reading the fixture keep as mode-selection skill.** 12 of 17 wins are abstentions; always-none beats Jev (prior research, reconfirmed as the printed strongest policy).
- **A served suggestion on the current contract.** The normalized route drops the alternatives (F-005).

## Dead Ends

None. All six research actions produced evidence.

## Edge Cases

- Ambiguous input: none; the topic names the scorer, the fixture and the counts.
- Contradictory evidence: the topic says 359 prompts, today's census says 365 — recorded both; the count of clarifications (3) agrees, the denominator moved with the tree.
- Missing dependencies: `steer.md` absent; `--transcripts` logs not available in this lineage.
- Partial success: none; the read-only runs completed with exit 0.

## Sources Consulted

- Command: `node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` (census, zero model calls) → `clarify=3` of 365
- Command: `node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --score ~/.skilled/.labels/020-rows.jsonl` → 42 refused, 12 labeled
- `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:45,82-156,417-429,632-695,1532-1600,1625-1653`
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:96-108`; `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:106-127`
- `specs/cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/007-clarify-default-improvements/implementation-summary.md:52,63,93-96,104-105`; `goal.md:82-84`
- `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/007-clarify-default-research/research/research.md:51-57,93-108,123`

## Assessment

- New information ratio: 0.9 (the fresh census, the fresh refusal replay, the power numbers and the seam read are new; the class-split critique carries forward with the strongest-policy baseline now printed in code)
- Questions addressed: Q3
- Questions answered: Q3 in all five sub-parts — corpus/labels/keep-rule/power (F-001..F-003), accuracy changes (F-004: early stop, digests, baselines), hardening (F-002, F-003), integration (F-005, F-006), tests (F-007).

## Reflection

- What worked and why: running the census and the replay read-only converted the topic's summary numbers into today's measured numbers (3 of 365; 42 of 54 refused), which is the strongest evidence class available without model calls.
- What did not work and why: `timeout` is not available on this macOS shell; the node commands were run with the exec tool's own timeout instead. No impact on results.
- What I would do differently: for the alignment iteration, look for an equivalent read-only replay I can run to get today's numbers before reading prose.

## Recommended Next Focus

Iteration 4 — alignment folder suggestion (Q4): read `score-alignment-suggestion.ts` (the distractor-state control, the one-loss describer bug fix status, W+L/interval reporting), the 049/008 improvements, and today's recorded run if one exists. Deliverable: corpus/labels/keep-rule/power, accuracy changes, hardening, integration shape (save-flow suggestion), tests.
