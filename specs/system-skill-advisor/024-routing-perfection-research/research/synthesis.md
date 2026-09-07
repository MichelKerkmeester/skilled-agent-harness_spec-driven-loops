# Synthesis — routing perfection research

One lineage produced output (`luna`, GPT-5.6-luna, 5 iterations). The second (`glm`) died at 0
iterations and is ignored. Everything below was re-run against the live advisor daemon at
generations 684–688, including a full independent 439-phrase fleet probe (zero probe errors).
Luna could not reach the daemon at all (`EPERM` on
`/tmp/system-skill-advisor/697296aed00e/daemon-ipc.sock`) and worked from the checked-in built
scorer. Where luna's built-scorer numbers could be compared to the live daemon they matched
exactly, so its caution about "implementation-state drift" was unnecessary — but its inability to
probe live is why it missed the mechanism this document reports.

The supplied baseline is confirmed, not assumed: **439 / 19 / 136 reproduced cell for cell**, nine
generations on.

---

## Verdict

The routers already declare the right phrases and 438 of 439 are uniquely owned; the defect is
that stage 1 never reads them, so a declared phrase absent from `graph-metadata.json`
`intent_signals` never fires the `explicit_author` lane — and across all 439 phrases that
membership is the difference between routing 97.8% of the time and 34.7%. Absence does not merely
lower a score: the candidate still reaches confidence `0.82` on a bare two-token lexical hit and is
then deleted by an uncertainty gate whose no-evidence default (`0.42`) sits above the surfacing
threshold (`0.35`), which is why `review the documentation` scores `sk-doc` at `0.7856` and returns
`sk-design` at `0.2978`, and why `font size` and `type scale` — one line apart in
`sk-design/ROUTER.md:64` — fail and route respectively. Generate stage-1 `intent_signals` from the
routers' declared `INTENT_SIGNALS`, fix the lexical lane's score/evidence inconsistency that
manufactures those confident evidence-free candidates, and make the reach gate fail closed — it
currently prints `RESULT: PASSED` with the advisor completely unreachable, and its
presence-not-rank predicate hides 18 further failures.

---

## The position, adjudicated

### 1. "The 136 no-reach and the 19 wrong-hub are different failure classes needing different fixes" — **OVERTURNED**

They share one precondition and one mechanism. I probed all 19 wrong-hub phrases from the
gen-679 scan against their declaring hub's `graph-metadata.json`:

```
0 of 19 wrong-hub phrases already carry stage-1 membership
```

Every wrong-hub case is *also* a stage-1 vocabulary miss — the same miss that produces no-reach.
My full 439-phrase re-run confirms it holds for the other class too: **135 of 136 no-reach rows
are non-members as well**. What differs between the two labels is only whether some **other** hub
happened to survive the gates, which is an accident of the neighbourhood, not a distinct defect.

The mechanism is identical in both. Relaxing **only** the uncertainty threshold (the `0.8`
confidence bar untouched) recovers the declaring hub in both classes:

```
### review the documentation          (wrong-hub)
  default          : sk-design=0.82/u0.28, system-deep-loop=0.82/u0.22
  unc-gate relaxed : sk-doc=0.9423/u0.42, sk-code=0.9323/u0.42, sk-design=0.82/u0.28
### iterative review                  (wrong-hub)
  default          : sk-design=0.82/u0.24
  unc-gate relaxed : sk-code=0.9285/u0.42, system-deep-loop=0.8918/u0.42, sk-design=0.82/u0.24
### font size                         (no-reach)
  default          : NONE
  unc-gate relaxed : sk-design=0.82/u0.42
```

`font size` — the canonical "unfixable length case" — **already clears the confidence bar** at
`0.82`. It is not failing on length or on the bar. It is failing on uncertainty, exactly as
`review the documentation` is.

The real partition is: (i) the declaring hub has `explicit_author` evidence → it routes;
(ii) it has only lexical evidence → confidence is floored to `0.82` but uncertainty stays at the
no-evidence default `0.42` → it is deleted. Conflating *that* is why adding vocabulary to the
wrong field kept not working — not conflating no-reach with wrong-hub.

### 2. "Highest leverage is a deterministic exact-phrase path in front of the scorer — which compiled routing already is" — **OVERTURNED on the vehicle, confirmed on the lever**

Compiled routing is **behind** the scorer, not in front of it. The front door requires the hub as
an input — `.opencode/bin/compiled-route.cjs:27` reads `--hub` and `:32` exits 2 without it, and
`resolveRoute(hub, prompt)` (`:38`) takes the already-chosen hub. Live confirmation: the compiled
decision arrives as a **field inside an advisor recommendation**:

```json
{ "skillId": "system-deep-loop", "score": 0.238728, "confidence": 0.82,
  "compiledRoute": { "hubId": "system-deep-loop", "action": "defer", "generation": 4 } }
```

The advisor picked the hub; compiled routing then deferred inside it. It cannot repair a hub
choice it is handed.

`sk-design` returning `{"servingAuthority":"legacy","hubId":"sk-design"}` is confirmed, and is a
membership fact: `DEFAULT_ON_HUBS` at
`.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:34-40` lists five hubs and
omits `sk-design`. (Its own comment says "All seven compiled-eligible hubs" over a set of five —
a stale comment worth a one-line fix, not a finding.)

The *lever* in the position is right, though: a deterministic exact-phrase path is what works.
It already exists — it is the `explicit_author` lane matching `projection.intentSignals` — and
point 3 is how to populate it.

### 3. "That table should be generated from the router's declared INTENT_SIGNALS" — **CONFIRMED**, and I can now say why it works

The scorer never reads stage-2. `grep -rn "hub-router\|ROUTER.md" lib/` across the whole scorer
returns nothing; the projection is built from a SQLite `skill_nodes` row
(`projection.ts:1122-1126`) whose `intent_signals` column becomes `projection.intentSignals`
(`projection.ts:751`). Luna's claim, confirmed.

The generated table works because exact `intent_signals` membership is what makes the
`explicit_author` lane fire, and that lane both raises the score *and* emits the evidence entries
that drop uncertainty under `0.35`. The controlled experiment is already in the repository —
three phrases on one router line, separated only by stage-1 membership:

| phrase (all from `sk-design/ROUTER.md:64`) | in `intent_signals` | live result | lane | uncertainty |
|---|---|---|---|---|
| `type scale` | yes | **sk-design 0.8829** | `explicit_author` | 0.16 |
| `font size` | no | returns nothing | `lexical` | 0.42 |
| `corner radius` | no | returns nothing | `lexical` | 0.50 |

This is not a sample effect. Cross-tabulating my full 439-phrase re-run against stage-1
membership gives the whole population:

```
stage-1 members: 180, routed to declaring hub as rank 1: 176   (97.8%)
non-members:     259, routed to declaring hub as rank 1:  90   (34.7%)

 176  OK (top)                                   | stage-1 YES
  90  OK (top)                                   | stage-1 no
   1  no-reach                                   | stage-1 YES
 135  no-reach                                   | stage-1 no
   3  passes checker, other hub ranked first     | stage-1 YES
  15  passes checker, other hub ranked first     | stage-1 no
  19  wrong-hub                                  | stage-1 no
```

**Membership moves the routing rate from 34.7% to 97.8%.** All 19 wrong-hub rows, 135 of 136
no-reach rows and 15 of the 18 hidden losses are non-members. The single stage-1 member that
reaches nobody is `dom inspect`, and that one has a separate cause (see the last section).

*Honest caveat on causality:* this is an association over the existing population, and there is a
plausible selection effect — a phrase may be in `intent_signals` because someone previously noticed
it failing and added it. The causal argument is the mechanism trace (exact membership → the
`explicit_author` lane fires → evidence entries exist → uncertainty drops below 0.35) plus the
controlled triple above, where three phrases from one router line separate exactly on membership.
The 97.8% / 34.7% split is the magnitude, not the proof.

The standard objection — that importing stage-2 prose would flood stage 1 with ambiguous
vocabulary — is measurably false. Across all 439 declarations there is exactly **one** phrase
declared by two hubs:

```
phrases declared by MORE THAN ONE hub: 1
   design tokens -> mcp-tooling + sk-design
```

438 of 439 are uniquely owned. The declarations are already an ownership partition; they are
simply not wired to the stage that uses them.

### 4. "The 19 wrong-hub cases should be arbitrated on the artifact noun, not the verb" — **UNSETTLED, and it addresses a minority at best**

I diagnosed all 19 mechanically (rank of the declaring hub among all candidates, and why it lost):

| declaring hub | phrase | rank | mechanism |
|---|---|---:|---|
| sk-doc | review the documentation | **1** | rank-1, deleted by uncertainty gate |
| sk-code | motion principles | **1** | rank-1, confidence 0.7357 (genuine deficit) |
| system-deep-loop | iterative review | 2 | conf 0.8918, deleted by uncertainty gate |
| system-deep-loop | review convergence | 2 | conf 0.8918, deleted by uncertainty gate |
| sk-doc | pass review | 4 | conf 0.82, deleted by uncertainty gate |
| mcp-tooling | create note | 4 | surfaces at 0.82, outranked by system-spec-kit |
| cli-external-orchestration | pi multi-provider | – | absent from candidates entirely |
| sk-doc | review bar / quality bar | 5 / 2 | conf 0.57–0.58, genuine evidence deficit |
| system-deep-loop | audit the diff | 5 | conf 0.5368, genuine evidence deficit |
| sk-design | decision branch | 3 | conf 0.5702, genuine evidence deficit |
| sk-code | plugin data layer | 2 | conf 0.6419 — *nothing* surfaces for this phrase |
| mcp-tooling | browser agent | 2 | conf 0.6063 |
| cli-external-orchestration | codex diff review | 3 | conf 0.6484 |
| cli-external-orchestration | full plugin and memory stack | 4 | conf 0.72 |
| cli-external-orchestration | pi print mode | 7 | conf 0.5795 |
| sk-doc | nested packet | 4 | conf 0.5579 |
| sk-doc | model benchmark | 4 | conf 0.6066, loses to `deep-model-benchmark` |
| sk-doc | skill benchmark | 2 | conf 0.6228, loses to `system-deep-loop` |

Only about six are verb-collision shaped (`review bar`, `pass review`, `quality bar`,
`review the documentation`, `audit the diff`, `decision branch`). The rest are noun-on-noun, and
several are arguable ownership disputes rather than defects — `model benchmark` reaching
`deep-model-benchmark` and `skill benchmark` reaching `system-deep-loop` are where those modes
actually live. An artifact-noun discriminator does nothing for those. And in two cases the
declaring hub already wins on score, so **no arbitration rule is needed at all** — only the
suppressor must be removed.

Luna reached the same "no general cross-hub ownership rule exists" conclusion and I confirm the
substrate: arbitration today is a hand-written ladder. `TOKEN_BOOSTS`
(`lanes/explicit.ts:18-99`) is a hardcoded single-word→skill map — `review: [['sk-code', 0.85]]`
(`:62`), `audit: [['sk-code', 0.75]]` (`:19`), `branch: [['sk-git', 0.45]]` (`:20`),
`documentation: [['sk-doc', 0.85]]` (`:34`) — and `primaryIntentBonus` (`fusion.ts:542-620`) is
roughly fifteen hardcoded regex special cases (`/\bcode audit\b/`, `/:review:(auto|confirm)\b/`,
`/\bdeep[- ]review\b/` …). Each wrong-hub case fixed this way costs one more rung.

### 5. "Adding vocabulary is the wrong lever; membership in `intent_signals` is neither necessary nor sufficient" — **OVERTURNED as stated**

Membership is **not necessary** — confirmed. 259 of 439 declared phrases have no stage-1
counterpart, yet only 155 fail, so ~104 route through other lanes.

Membership is, in the failing class, **effectively sufficient** — contradicted, over the full
population: **176 of 180 stage-1 members (97.8%) route to their declaring hub as rank 1**, against
90 of 259 (34.7%) for non-members. That includes two-word phrases like `feels off` (`0.8382`) and
`hover state` (`0.8286`) that the prior work classed as categorically unfixable.

The position conflates two different levers. The measured facts behind it — "keywords in
`description.json` do not reliably move a score", "adding them was tried twice and moved
nothing" — are about **`description.json`**, a different field. `intent_signals` is what the
`explicit_author` lane matches. That is why one moved nothing and the other moves everything.

The brief's constraint still stands, and for a better reason than the position gives: hand-adding
259 phrases across six hubs is unmaintainable and would drift the moment a router changed.
**Generate them** (point 3). That is the same lever with a maintainable mechanism, not the
hand-authoring the constraint rules out.

---

## What I verified, and what I could not

Every row was checked by me against the live daemon or by opening the cited file.

| luna's load-bearing claim | verdict | what settles it |
|---|---|---|
| Daemon unreachable; used built scorer instead | **contradicted (for me)** | daemon is live: `advisor_recommend` returns `"freshness":"live"`, generation 684–687. Luna's `EPERM` was real for its sandbox. |
| Built-scorer probes match daemon behaviour | **confirmed** | `plot this`→none, `plot this data`→sk-design 0.82, `review this screen`→sk-code 0.9349, `decision branch`→sk-git 0.9451, `review bar`/`pass review`→sk-code 0.9285 — all reproduced live, identical |
| `tokenize` drops stop words and tokens ≤2 chars | **confirmed** | `text.ts:29-34` |
| `scoreTokenOverlap` divides by `max(3, denominatorBasis)` | **confirmed** | `text.ts:100` |
| `phraseSpecificity` = 0.88 for 2 tokens, 1.0 for ≥3 | **confirmed** | `text.ts:74-77` — `Math.min(0.7 + 0.18*(count-1), 1)` |
| Lane weights: explicit 0.42 / lexical 0.28 / graph 0.13 / derived 0.12 / semantic 0.05 | **confirmed** | `lane-registry.ts:8-13` |
| Short no-reach is "a normalization/representation effect" of the `max(3,·)` denominator | **contradicted** | `font size` and `plot this data` have the *same* 0.6667 overlap; one returns nothing, the other routes at 0.82. The denominator is not the discriminator — lane membership is. |
| Confidence floors "amplify direct evidence but cannot create a recommendation"; the 0.8 bar is not the seam | **confirmed, and understated** | `directScore = max(explicit.raw, lexical.raw)` (`fusion.ts:700-703`); `directScore ≥ 0.65 → confidence = max(base, 0.82)` (`fusion.ts:436-437`, `scoring-constants.ts:180-183`). A bare two-token lexical hit = `2/3 = 0.6667` clears `0.65`. **The whole 0.82 cohort is a floor artifact**, which is why "many passing scores sit at exactly 0.82". Luna never explained that supplied fact. |
| The scorer never reads `hub-router.json` / `ROUTER.md` | **confirmed** | `grep -rn "hub-router\|ROUTER.md" lib/` → no matches; projection from `skill_nodes.intent_signals` (`projection.ts:751, 1122-1126`) |
| `review`→sk-code 0.85, `audit`→sk-code 0.75, `branch`→sk-git 0.45 are hardcoded token boosts | **confirmed** | `lanes/explicit.ts:62, 19, 20` |
| `primaryIntentBonus` has no general cross-hub ownership rule, only special cases | **confirmed** | `fusion.ts:542-620`, ~15 hardcoded branches |
| Stage-1 coverage join: 77/54, 169/46, 41/6, 76/53, 25/3(4), 51/17 | **confirmed, one cell off** | re-derived: identical except `mcp-tooling` exact = **52**, not 53 (normalized 53 matches) |
| 439 declared multi-word phrases across exactly six hubs | **confirmed** | re-derived with the checker's own extractor: 51+76+41+77+169+25 = 439; `hubs()` discovers exactly six |
| Compiled routing is a within-hub layer that cannot repair hub discovery | **confirmed** | `compiled-route.cjs:27-37` requires `--hub`; `compiledRoute` appears *inside* an advisor recommendation |
| `sk-design` returns the legacy sentinel; five hubs compiled | **confirmed** | ran all six; `resolve.cjs:34-40` `DEFAULT_ON_HUBS` = 5, no `sk-design` |
| Guard reports all five fresh, `failures: 0` | **confirmed** | `compiled-route-guard.cjs --json --warn-only` → 5× `"reason":"fresh"`, `"failures": 0`, exit 0 — while 155 phrases are broken |
| Checker drops probe errors to `null` → false green | **confirmed by negative control** | pointed the checker at a nonexistent advisor: `declared=77 wrong-hub=0 no-reach=0 / RESULT: PASSED / EXIT=0`. It proved nothing and reported success. (`ci-router-vocabulary-reach.cjs:60,62,81`) |
| `--limit` silently truncates the inventory | **confirmed** | `--limit 3` → `declared=3`, still `RESULT: PASSED` (`:71,77`) |
| "The existing dynamic taxonomy is the right semantic gate" | **contradicted, and now quantified** | `hit` is `above.some(r => r.skillId === hub)` (`:65`) — *presence*, not rank. My full re-run found **18 further phrases** where the declaring hub surfaces above the bar but another hub is ranked first, all scored as passes today. True failures under a rank-1 predicate: **173, not 155**. |
| "no-reach is almost always length; no amount of vocabulary changes that" (prior work, inherited by luna) | **contradicted** | 20/21 two- and three-word stage-1 members route, incl. `feels off` 0.8382, `hover state` 0.8286, `shade ramp` 0.8382 |
| A generated stage-1 table would flood the advisor with ambiguous vocabulary | **contradicted** | 438 of 439 declarations are uniquely owned; the only collision is `design tokens` (mcp-tooling + sk-design) |
| Fleet totals 19 wrong-hub / 136 no-reach at gen 679 | **confirmed, cell for cell** | I re-ran all 439 probes independently at generations 684–688, zero probe errors. Every per-hub cell reproduces the supplied table exactly: `sk-design` 77/1/10, `system-deep-loop` 25/3/8, `mcp-tooling` 76/2/11, `cli-external-orchestration` 51/4/10, `sk-code` 41/2/25, `sk-doc` 169/7/72 → **439 / 19 / 136**. Nine generations on, the numbers have not moved at all. |
| Which recommendations survive under relaxed thresholds | **partially confounded — labelled, and bounded** | `options.confidenceThreshold`/`uncertaintyThreshold` feed `passes_threshold`, which feeds `ambiguousCluster` (`ambiguity.ts:25`), which feeds the low-info floor — so a relaxed probe *can* perturb uncertainty. `score` is **not** threshold-dependent: `review the documentation` returns `sk-design score=0.297825` under default, under `uncertaintyThreshold:0.99`, and under `{confidenceThreshold:0.01, uncertaintyThreshold:0.99}` — identical to 6 dp across all three. All score-rank claims above are therefore safe; confidence/uncertainty from relaxed probes are indicative. The single-variable probes in §1 vary only `uncertaintyThreshold` and leave the 0.8 bar untouched. |
| A third gate exists that neither luna nor the position accounts for | **confirmed** | `readOnlyExplainerFloor: 0.25` (`scoring-constants.ts:171`) pins confidence to 0.25 for a read-only verb unless a hand-written bypass matches. `dom inspect` → **nothing**; `inspect the dom` → **mcp-tooling 0.82**. Same two words, reversed. The bypass regex (`fusion.ts:529`) matches `inspect (the )?dom` but not `dom inspect`, while mcp-tooling scores 0.6613 rank-1 with uncertainty 0.28 in both cases. |

### The compounding chain, and where it starts

Luna's iteration 1 concluded the short-phrase failure is "a normalization/representation effect,
not a low phrase-specificity score", and iterations 2–5 all inherit it — iteration 5's safe-negative
set lists `font size`, `critique this` and `stack trace` as "no-reach informational cases **until
the scorer shape is repaired**", which encodes the unverified premise as a fixture. That premise
is contradicted (`font size` clears the bar), so every downstream recommendation that treats the
short-phrase cohort as a scorer-shape problem is unverified. The `--limit`, probe-error and
compiled-routing findings are independent of the chain and stand.

### Where luna went quiet

Iteration 1 spent four sentences on the confidence floors and then dropped them; it never
explained the supplied fact that "many passing scores sit at exactly 0.82" even though the
mechanism is two lines from the code it read. It never opened `ambiguity.ts` or the low-info
abstention block (`fusion.ts:790-825`), so the uncertainty gate — the thing actually rejecting
these phrases — appears nowhere in five iterations. And it never probed a phrase that *is* a
stage-1 member, which is the one experiment that separates its hypothesis from mine.

---

## What to build, ranked

**1. Generate stage-1 `intent_signals` from each router's declared `INTENT_SIGNALS`.**
*What it is:* the multi-word extractor that `ci-router-vocabulary-reach.cjs:37-52` already
implements, run as a generator into each hub's `graph-metadata.json`, re-run on rebuild so the
invariant holds by construction.
*What it fixes:* the `explicit_author` miss — the precondition shared by every failure class.
Measured over all 439: **169 of the 173 rank-1 failures are stage-1 non-members** (19 wrong-hub +
135 no-reach + 15 hidden losses). Members route at 97.8%, non-members at 34.7%. If generation
moves the 259 non-members to anything near the member rate, the expected residue is single digits.
Of the 155 the checker currently reports, this addresses the 154 that are non-members.
*Implementable today:* yes — metadata generation plus an advisor rebuild. No scorer change.
*Cost:* one generator, wired into the rebuild path; ~259 new signals across six hubs, precedented
(`sk-design` already carries 159).
*What it could break:* one measured conflict (`design tokens`, mcp-tooling + sk-design — today
sk-design wins it at 0.9173). Beyond that, promoting a declaration to a first-class stage-1 signal
makes the hub compete fleet-wide on a phrase its modes may only use locally; the multi-word-only
filter is the existing mitigation and should not be loosened. **Unverified:** whether a generated
signal beats a competing hardcoded `TOKEN_BOOSTS` entry — `decision branch` vs `branch→sk-git 0.45`
is the test case, and it needs a scratch projection rebuild to answer.

**2. Make the reach gate fail closed.**
*What it is:* promote probe execution and JSON errors to first-class `probe-error` records that
fail the run; require the untruncated inventory (reject `--limit` in CI, assert a nonzero declared
count per hub); record daemon generation in the report.
*What it fixes:* zero phrases — and it is second because every number in this document depends on
it. Demonstrated failure: with the advisor unreachable the checker printed
`declared=77 wrong-hub=0 no-reach=0 / RESULT: PASSED / exit 0`.
*Implementable today:* yes, ~30 lines in `ci-router-vocabulary-reach.cjs`.
*Cost:* trivial. *What it could break:* CI runs that currently pass because the daemon was cold.
That is the point.

**3. Change the checker's `hit` predicate from presence to rank.**
*What it is:* `hit: above.some(r => r.skillId === hub)` (`:65`) counts a hub that placed second at
`0.82` behind a `0.944` winner as a pass. Assert instead that the declaring hub is the top
above-bar recommendation, with near-ties reported separately.
*What it fixes:* the measurement, not the routing — but the current 19 is a floor, and I measured
by how much. My full re-run found **18 additional phrases** the checker passes while another hub
is ranked first. True failures: **173, not 155**. The hidden 18:

```
cli-external-orchestration  spec kit runtime       -> system-spec-kit 0.9500
cli-external-orchestration  spec kit memory        -> system-spec-kit 0.9500
mcp-tooling                 browser debug          -> sk-code 0.9132
mcp-tooling                 design tokens          -> sk-design 0.9173
sk-design                   design review          -> sk-code 0.9440
sk-design                   review this screen     -> sk-code 0.9349
sk-design                   design review of this slide deck -> sk-code 0.9378
sk-design                   review this deck       -> sk-code 0.9285
sk-design                   review this layout     -> sk-code 0.9285
sk-doc                      doc quality            -> sk-code 0.8200
sk-doc                      review the docs        -> sk-code 0.9387
sk-doc                      audit the docs         -> sk-code 0.8977
sk-doc                      create sk-             -> system-spec-kit 0.8200
sk-doc                      create a skill         -> system-spec-kit 0.8200
sk-doc                      create an agent        -> system-spec-kit 0.8200
sk-doc                      create agent           -> create:agent 0.8200
sk-doc                      paired /create         -> system-spec-kit 0.8200
system-deep-loop            review request         -> sk-code 0.9439
```

Two things stand out. Five of the eighteen are the `sk-design` review-verb collisions the dispatch
prompt names as wrong-hub cases (`review this screen`, `design review of this slide deck`) — the
brief describes reality, the checker calls them passes, and nobody noticed the gap. And six of the
eighteen are decided by a **three-way tie at exactly 0.8200** (`create a skill`, `create an agent`,
`paired /create`, `create sk-`, `doc quality`), where the winner is arbitrary among candidates that
all reached the floor rather than the score. That is the 0.82 floor cohort picking routing outcomes.
*Implementable today:* yes, a one-line predicate change plus a new report column.
*Cost:* trivial. *What it could break:* the wrong-hub count jumps from 19 to 37 immediately and the
gate goes red. Land it with item 1, not before.

**4. Fix the lexical lane's score/evidence inconsistency.** *(needs a scorer change)*
*What it is:* `lanes/lexical.ts:64-72` computes `score` over
`{id, name, description, domains, intentSignals, keywords}`, but `:81-85` harvests `evidence` only
from `{id, name, description, domains}` — `intentSignals` and `keywords` contribute score and no
evidence. A candidate can therefore reach `directScore ≥ 0.65`, be floored to confidence `0.82`
(`fusion.ts:436`), and simultaneously carry `evidenceCount = 0` → `uncertainty = 0.42`
(`noEvidenceDefault`, `scoring-constants.ts:187`) → deleted by the `0.35` gate. That is `font
size` exactly.
*What it fixes:* the residue of the no-reach cohort that item 1 does not reach, and it removes the
class of "confident but evidence-free" candidates that currently occupy the 0.82 band.
*Implementable today:* no — it is a scorer edit, and it must be a **correctness** fix (harvest
evidence from the same candidate set the score is computed over), **not** a threshold change.
Moving `0.35` or `0.42` would be lowering the bar in a different costume and is out of scope by
the same reasoning that rules out lowering `0.8`.
*Cost:* small edit, large blast radius — it changes uncertainty for every candidate whose lexical
match lands in `intentSignals`/`keywords`, which after item 1 is many of them.
*What it could break:* candidates that were correctly abstained on will start surfacing. Requires
a before/after over the full 439 plus the advisor's own regression corpus. **Do item 1 first and
re-measure** — item 1 may make most of this moot by moving those matches into the explicit lane,
which already emits evidence.

**5. Artifact-noun arbitration for the residual collisions.** *(needs a scorer change)*
*What it fixes:* at most ~6 of 19, and only after items 1 and 3 re-baseline which 6 those are.
Two of the current 19 need no arbitration at all (the declaring hub already wins on score), and
several are genuine ownership questions, not defects.
*Implementable today:* no. *Cost:* it replaces one hand-written ladder (`primaryIntentBonus`,
`fusion.ts:542-620`) with a general rule — worth doing, but only against a list that item 1 has
already shortened. *What it could break:* the ~15 existing special cases encode real decisions
(`code audit`→sk-code, `:review:auto`→system-deep-loop); a general rule must preserve them.

**6. `sk-design` compiled-routing rollout.** *(orthogonal)*
*What it fixes:* **zero** of the 155. Compiled routing runs after hub selection and cannot affect
reach. Do it if deterministic within-hub mode selection for design is wanted on its own merits.
*Cost:* a full rollout child plus registrations in `HUB_CHILD`, `DEFAULT_ON_HUBS`, the guard
inventory, the activation manifest and the serving closure, with parity proof.
*What it could break:* nothing in reach — which is also the problem with treating it as the fix.
Worth one line now: the guard reports `failures: 0` and all five hubs `fresh` while 155 phrases
are broken, so compiled freshness must never be read as routing health.

---

## What one lineage could not settle

**A second model would most likely have challenged luna's iteration-1 conclusion**, because it is
the load-bearing premise of everything downstream and it was reached without a single probe of a
phrase that *is* in `intent_signals`. Luna had `plot this` vs `plot this data` (differ in length
*and* in vocabulary) and treated the length difference as causal. The controlled pair is
`type scale` vs `font size` — same router line, same length, differing only in stage-1 membership —
and it points the other way. *I closed this one:* the full partition over all 439 phrases gives
97.8% routing for members against 34.7% for non-members. What a second model would still be needed
for is the **selection effect** — whether members route because membership works, or membership was
granted because someone noticed those phrases failing. *Measurement:* add one absent phrase
(`corner radius`) to a scratch projection, rebuild, re-probe. A single before/after on one phrase
converts the association into a causal claim, and it is cheap.

**The 19/136 split is now re-derived and closed** — it reproduced cell for cell at generations
684–688 with zero probe errors, nine generations after the baseline. What replaced it as an open
question is the number *behind* it: under a rank-1 predicate the true count is 173, and nobody has
yet decided whether the 18 hidden rows are defects or acceptable near-ties. Six of them are
three-way ties at exactly `0.8200`, which is not a ranking at all. *Measurement:* re-run item 3's
predicate after item 1 lands and classify the residue by score gap, not by presence.

**Whether a generated stage-1 signal beats a competing hardcoded token boost is untested.**
`decision branch` is the case: adding it to `sk-design`'s `intent_signals` would give an
`explicit_author` phrase hit with specificity 0.88 against `branch → sk-git 0.45`. Nothing in the
evidence says which wins. *Measurement:* build a scratch projection with that one signal added and
re-probe. This is the highest-value cheap experiment remaining and it decides how much of item 1's
benefit reaches the wrong-hub class as opposed to the no-reach class.

**Whether removing the evidence inconsistency (item 4) causes over-routing is unmeasured.** It
would surface candidates the system currently abstains on, and abstention is sometimes correct.
*Measurement:* a before/after over all 439 plus the advisor's regression corpus, counting new
above-bar recommendations that reach a hub which does **not** declare the phrase.

**`dom inspect` — the one exception in 21 — turned out to be a third gate, and it is a warning
about the whole ladder.** `mcp-tooling` scores it rank-1 at `0.6613` with uncertainty `0.28`, and
confidence is pinned to `0.25` by `readOnlyExplainerFloor` (`scoring-constants.ts:171`) because
"inspect" is a read-only verb. The bypass that would lift it (`fusion.ts:529`) matches
`inspect (the )?dom` but not `dom inspect`, so:

```
dom inspect     -> NONE
inspect the dom -> mcp-tooling=0.82
```

Same two words, reversed, opposite outcome. That is a hand-written regex ladder deciding routing
by word order — a fourth mechanism, independent of the three above, that no amount of vocabulary
or arbitration touches.

I sized it rather than leaving it open: of the 439 declared phrases, exactly **2** carry a
read-only verb (`text.ts:102-113`) with no matching `readOnlyRouteAllowed` bypass
(`fusion.ts:499-535`) — `mcp-tooling: dom inspect` and `sk-doc: show the full`. So this class is
small and should **not** be built for. It earns its place here only as the reason my 21-phrase
sufficiency sample is 20/21 rather than 21/21, and as evidence for how the existing ladder fails:
by word order, silently, with the correct hub sitting at rank 1 the whole time.
