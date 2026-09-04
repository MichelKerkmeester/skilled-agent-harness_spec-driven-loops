---
title: "Implementation Summary: Gate A signal closure"
description: "Every signal the five parent hubs declare was swept through the daemon and classified into one bucket, and the fix each unresolved signal was given has now been applied. The baseline came out at 234 of 444, and the closing measurement reads 345 of 388 with no hub losing a signal."
trigger_phrases:
  - "gate a summary"
  - "declared signal closure"
  - "444 signal sweep"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/002-gate-a-signal-closure"
    last_updated_at: "2026-09-04T12:15:00Z"
    last_updated_by: "phase-2-gate-a-signal-closure"
    recent_action: "Applied the seven named fixes and measured the sweep on both sides"
    next_safe_action: "Hand the four scorer-held signals to the scorer owner"
    blockers: []
    key_files:
      - "research/unresolved-signal-decisions.md"
      - "research/gate-a-fix-before-2026-09-04.tsv"
      - "research/gate-a-fix-after-2026-09-04.tsv"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-002-gate-a-signal-closure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate A baseline is 234 of 444 across five hubs"
      - "The executor hub resolved 7 of its 115 signals and had never been measured"
      - "All 50 unresolved signals carry a decision, grouped by twelve distinct mechanisms"
      - "sk-doc served legacy on a stale activation pin; it was re-pinned before the fix pass"
      - "Raising a phrase means declaring it in the hub's top-level intent_signals, not editing a weight"
      - "Four signals are held by scorer abstention gates no hub metadata can reach"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/052-routing-completeness/002-gate-a-signal-closure |
| **Level** | 3 |
| **Status** | Complete |
| **Delivery** | Shipped. The parent goal LOG records this phase Done |
| **Date** | 2026-09-03 (closure re-sweep at HEAD `fe1ec30fe8`) |
| **Register findings** | 3 reads Fixed. 4, 5, 6, 7 and 8 are owned by this phase |
| **Gate** | `research/gate-a-rerun-2026-09-03.tsv`, 389 rows, one bucket per row |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Gate A asks a narrow question: does a signal a hub declares reach exactly one mode. Nobody
had asked it across all five hubs before. This phase swept every declared signal through the
daemon-backed advisor, classified each reply into one of five buckets, and committed the raw
replies so the number can be re-derived rather than trusted.

**The baseline is 234 of 444 resolved.** That figure comes from
`research/gate-a-measurement.md`, and the parent goal LOG cites the same commit for it. No
routing file was touched to produce it.

### The distribution mattered more than the total

| Hub | Total | Resolved | No recommendation | Wrong hub | Deferred | Multi |
|---|---|---|---|---|---|---|
| sk-doc | 97 | 87 | 1 | 6 | 3 | 0 |
| sk-code | 93 | 42 | 1 | 3 | 41 | 6 |
| mcp-tooling | 109 | 84 | 7 | 4 | 14 | 0 |
| cli-external-orchestration | 115 | 7 | 47 | 55 | 6 | 0 |
| system-deep-loop | 30 | 14 | 3 | 4 | 9 | 0 |
| **All hubs** | **444** | **234** | **59** | **72** | **73** | **6** |

The documentation hub sat at 87 of 97 and had drawn every previous audit. The executor hub
sat at 7 of 115 and had drawn none. A headline of 234 of 444 hides that entirely, which is
why the per-hub table is the part worth reading.

Seventy-three signals reached their owning hub and were then dropped with no target, and
fifty-nine surfaced no recommendation at all. Both read as routing successes anywhere except
at the point of use.

### What the follow-up fix moved

Commit `08eb67a0de` acted on the sweep against the same frozen corpus. Its message records
**Gate A moving from 234 to 328 of 444**, with the executor hub going from 7 of 115 to 66 and
no signal left surfacing nothing at all. Sixty-seven signals were retired, each audited
first: forty-one returned nothing, six went elsewhere, twenty landed on their hub and
dropped, and none was resolving. The largest retired group was model names for a scoring lane
that no longer exists.

The brief's premise about the executor hub was wrong and worth recording. There was no
leftover data row. Bare executor names were synthesized at run time by a deliberate, tested
override that inserted them at rank one with no compiled route, which contradicted the hub
doctrine sitting beside it. The override now lifts the hub instead, and every gold label was
re-captured to match.

### What the closure re-sweep found

The phase closed on 2026-09-03 by re-sweeping all 389 declared signals at HEAD `fe1ec30fe8`
and writing a decision for every signal outside RESOLVED. Two findings came out of it.

**The fifty are the same fifty.** Holding the sk-doc defect below aside, the unresolved set
matches the 2026-09-02 capture member for member, in the same four buckets. Nothing drifted.
`research/unresolved-signal-decisions.md` groups them into twelve mechanisms, each verified
against the file that implements it rather than inferred from the bucket. Twenty-one are
correct as they stand, fourteen have a named fix and a named file, fourteen are cross-hub
boundaries for phase 004, and one is an artefact of the bucket rule.

The largest single finding is that most of the deferrals were never open. Nineteen of the
twenty-one are keywords of a vocabulary class each hub names in its own
`routerPolicy.discoveryClasses`, which exists so that hub-identity-only prompts defer to the
prose router. Reading `hub-router.json` turned what looked like an unexplained bucket into a
contract behaving as written.

**`sk-doc` is serving legacy.** `compiled-route-status.cjs --all` reports it at
`causeCode: stale-manifest`, with a pinned policy hash of `60f98f69…` against a current hash
of `d3d026c8…`. Commit `756a7fcd4c` edited `sk-create-chart/SKILL.md`, one of the byte sources
the sk-doc snapshot hashes, without re-pinning the activation manifest, and five later commits
touched the same file. The advisor still ranks sk-doc first for its own vocabulary, so nothing
looks wrong at the recommendation, but no `compiledRoute` is attached and no mode is named.
Ninety-six sk-doc signals that route to exactly one mode under an engine-direct probe are
served as a bare hub recommendation today. The fix is a re-pin of
`013-live-activation/activation/sk-doc/manifest.json` through the sync tooling, which is a
compiled-routing change this phase does not own.

### What the fixes did

The decision table named seven fixes and the file each one lands in. They were applied on
2026-09-04 at HEAD `81d439f764`, with the full declared-signal sweep run on both sides of the
change so the claim is a measurement rather than a prediction.

Seven signals moved from NO_RECOMMENDATION to exactly one mode: `dqi score` to
`sk-create-quality-control`, `ink-on-parchment retint` to `sk-code-mobile-cli`, `magicpath`,
`magicpath ai` and `magicpath canvas` to `mcp-magicpath`, `swe-1.7 dispatch` to `cli-devin`,
and `evaluate agent` to `agent-improvement`. `benchmark a model or prompt framework` was
retired and left the denominator. Two hub-identity phrases were named in sk-code's
`hub-router.json` and still defer, which is what that row asked for: the declaration now
matches the behaviour it always served. RESOLVED goes 338 to 345, NO_RECOMMENDATION 13 to 6,
and no hub loses a signal.

**What "raise the stage-one weight" turned out to mean.** The table named the field's effect
without naming the field. A phrase declared only in `derived.trigger_phrases` reaches the
scorer through the derived lane, and `confidenceFor` in `lib/scorer/fusion.ts` returns a flat
0.72 when that lane dominates and the direct score is under 0.2, which is below the 0.80 gate.
Declaring the same phrase in the hub's top-level `intent_signals` also puts it in the explicit
lane, whose `author:` match feeds the direct score, and a direct score at or above 0.65 floors
confidence at 0.82. So each fix is one line, and the derived copy stays where it is.

**The measurement instrument had to be fixed first.** The sweep driver named each reply file
after a slug of its signal, and sixteen slugs collide: `deep-review` and `deep review` land on
the same name, as do `chrome devtools` and `chrome-devtools`, `cli-codex` and `cli codex`, and
thirteen more pairs. Whichever call finished last owned the file, so one member of each pair
was scored against the other's reply. Replies are now indexed by position in the denominator.
The repair reversed one row: `deep-review` had been reading `deep review`'s answer and
reporting RESOLVED, and on its own reply it reaches `sk-design` and is WRONG_HUB.

**Four of the fourteen named signals are held by scorer code, not by vocabulary.**
`dom inspect` and `task list` already sit in their hub's `intent_signals`, reach mcp-tooling at
rank one with the explicit lane dominant, and are capped at confidence 0.25 by
`isReadOnlyExplainer` in `lib/scorer/text.ts`, which floors a prompt whose verb is `inspect` or
`list` with no write verb beside it. `lighthouse` clears confidence and fails uncertainty: it
ties sk-code at 0.82 on the confidence margin, and a two-member cluster on a one-word prompt
trips the low-information abstention that floors uncertainty at 0.42 against a 0.35 threshold.
Adding it to `derived.key_topics` raised the hub's score from 0.456 to 0.520 and changed
nothing, so that line was reverted rather than shipped. `deep-review` fails the same gate for
the same reason, which is why D-07's prescribed fix was not made: the phrase is already
declared in both fields and the hyphen costs it a spaced evidence anchor, not a match.

**The routing input carried its refresh.** `hub-router.json` is one of the bytes sk-code's
compiled route hashes, so the edit moved its policy hash from `241349267d47f6c4` to
`73625b574f1612d9`. Left unpinned, that is exactly the failure this packet recorded against
sk-doc two days earlier. Both manifests were refreshed, sync check and verify exit 0, the guard
reports five hubs fresh, and all five canaries were rebuilt and re-pinned green.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/gate-a-measurement.md` | Created (`dbc8678c9d`, 315 lines) | Method, per-hub distribution, every non-resolved signal and the reproduction commands |
| `research/gate-a-raw.tsv` | Created (`dbc8678c9d`, 445 lines) | One row per declared signal with its bucket, so the number can be re-derived |
| `research/gate-a-rerun-2026-09-03.tsv` | Created (390 lines) | The closure re-sweep, with an engine-direct column that separates a stale serving pin from a signal that reaches no mode |
| `research/declared-signals-2026-09-03.tsv` | Created (390 lines) | The denominator behind that sweep, so 389 is re-derivable rather than asserted |
| `research/unresolved-signal-decisions.md` | Created | A decision for each of the 50 unresolved signals, grouped by mechanism, with the fix and its file where one exists |
| `spec.md` | Modified (`dbc8678c9d`) | Scope narrowed to what the measurement showed |
| `.opencode/skills/cli-external-orchestration/hub-router.json` | Modified (`08eb67a0de`) | Stage-two classes for signals that reached the hub and dropped |
| `.opencode/skills/cli-external-orchestration/mode-registry.json` | Modified (`08eb67a0de`) | Mode declarations aligned with the router |
| `.opencode/skills/cli-external-orchestration/graph-metadata.json` | Modified (`08eb67a0de`, 68 lines touched) | Retired vocabulary removed from the advisor projection |
| `.../mcp-server/lib/scorer/executor-delegation.ts` | Modified (`08eb67a0de`) | The run-time override now lifts the hub instead of inserting a routeless entry |
| `.../scripts/routing-accuracy/scorer-eval-baseline.json` and the holdout corpus | Modified (`08eb67a0de`) | Gold labels re-captured after the override change |
| `.opencode/skills/sk-code/hub-router.json` | Modified (2026-09-04) | `sk-code hub` and `language-specific verification commands` named in the `hub-identity` class |
| `.opencode/skills/sk-doc/graph-metadata.json` | Modified (2026-09-04) | `dqi score` declared in the hub's top-level `intent_signals` |
| `.opencode/skills/sk-code/graph-metadata.json` | Modified (2026-09-04) | `ink-on-parchment retint` declared in the hub's top-level `intent_signals` |
| `.opencode/skills/mcp-tooling/graph-metadata.json` | Modified (2026-09-04) | `magicpath`, `magicpath ai` and `magicpath canvas` declared in the hub's top-level `intent_signals` |
| `.opencode/skills/cli-external-orchestration/graph-metadata.json` | Modified (2026-09-04) | `swe-1.7 dispatch` declared in the hub's top-level `intent_signals` |
| `.opencode/skills/system-deep-loop/graph-metadata.json` | Modified (2026-09-04) | `evaluate agent` declared in `intent_signals`, `benchmark a model or prompt framework` retired |
| `.opencode/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` and its authored copy | Modified (2026-09-04) | Re-pinned to the policy hash the `hub-router.json` edit produced |
| `009-parent-hub-rollout/001-sk-code/compiled/` and `activation/` | Modified (2026-09-04) | sk-code canary rebuilt and re-pinned through its own build and validate scripts |
| `.../mcp-server/scripts/skill-graph.json` | Modified (2026-09-04) | Diagnostic export regenerated by the skill-graph rebuild |
| `research/gate-a-fix-before-2026-09-04.tsv` | Created (390 lines) | The baseline sweep, taken with every change reverted and the graph rebuilt |
| `research/gate-a-fix-after-2026-09-04.tsv` | Created (389 lines) | The same sweep after the fixes, on the repaired driver |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Declared signals came from two sources per hub, unioned and de-duplicated by exact string:
the `intent_signals` column on that hub's row in the advisor graph database, and
`derived.trigger_phrases` in that hub's `graph-metadata.json`. Cross-hub overlap was checked
and found to be zero.

Each signal went to the daemon-backed CLI rather than the Python scorer, because phase 001
established the daemon as the transport that governs automatic routing. The sweep ran as a
background script batching twenty concurrent daemon requests, writing one JSON reply per
signal to its own file, and reading exit status from a `.exit` file per signal rather than
through a pipe.

Classification then read `recommendations[0]` from each reply. Rank was taken from the
array's own order, which matters: a first attempt re-sorted by the bare `score` field and
inflated the executor hub from 7 resolved to 44 on tied scores alone. Reading the sort
implementation in `lib/scorer/fusion.ts` is what caught that.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Gate A is measured across all five hubs, not only the hub under audit | The audited hub sat at 90 percent while the unaudited one sat at 6 percent. Measuring one hub would have confirmed a comfortable number and missed the real one |
| Rank is read from the comparator output | Re-sorting by `score` inflated one hub from 7 to 44, and the true sort key blends bonuses the reply does not expose |
| A signal that cannot resolve is retired, not parked | Sixty-seven were retired after audit rather than left in an unexplained bucket |
| Collisions were decided by each losing hub's own written boundary | Preference is not evidence. One attempted fix was reverted because it cost the owning hub a signal and moved nothing on the corpus |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Every command below was run and its output read.

| Check | Result |
|-------|--------|
| Declared-signal extraction, `sqlite3 .../skill-graph.sqlite "select intent_signals from skill_nodes where id='<hub>';"` unioned with each `graph-metadata.json` | 444 unique signals across five hubs, zero cross-hub overlap |
| Per-signal measurement, `node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<signal>"}' --format json --timeout-ms 60000` | 444 replies captured, one file each, exit status read from a `.exit` file rather than a pipe |
| Independent double tally of `gate-a-raw.tsv`, one Python pass and one `jq` pass over the same raw replies | Both returned 234 RESOLVED of 444 and agreed per hub. This satisfies AC-002 |
| Bucket completeness in `gate-a-raw.tsv` | 444 rows, every row carrying one of the five bucket values. This satisfies AC-001 |
| Post-fix re-measurement recorded in `08eb67a0de` | 328 of 444, executor hub 7 to 66, no signal surfacing nothing |
| Regression control across three suites in `08eb67a0de` | 444 signals, 180 realistic prompts and 224 controls on the five hubs outside scope. No hub lost a prompt it owned |
| Canary fixtures during the fix | Caught two real regressions mid-flight, both reverted |
| `validate.sh specs/sk-doc/052-routing-completeness --strict --recursive` | PASS for this folder, Errors 0 |
| `hvr_scan.py` on this document | 0 hard blockers |
| Closure re-sweep, 389 signals at HEAD `fe1ec30fe8` | 243 RESOLVED as served, 339 with the sk-doc pin held aside, all 389 calls exit 0 after 51 back-pressure failures were re-run at 4 concurrent |
| Exact-set check over the decision groups | 50 unresolved signals, 50 claimed, twelve groups summing to 50, no duplicate member and no ungrouped signal |
| Unresolved set compared against the 2026-09-02 capture as `hub` plus `signal` plus `bucket` triples | Identical, with `comm` reporting nothing on either side |
| `node .opencode/bin/compiled-route-status.cjs --all --pretty` | Four hubs `compiled-serving` and `fresh`, with sk-doc `legacy` on `causeCode: stale-manifest` |
| Before-and-after sweep of every declared signal, one reply and one `.exit` file each | 389 rows before and 388 after, all calls exit 0, RESOLVED 338 to 345, NO_RECOMMENDATION 13 to 6 |
| Per-hub RESOLVED delta | sk-code 58 to 59, sk-doc 96 to 97, mcp-tooling 96 to 99, system-deep-loop 19 to 20, cli-external-orchestration 69 to 70. No hub falls |
| Bucket-change audit across the whole sweep | Every change is one of the seven target signals. Nothing else moved |
| `python3 .../routing-accuracy/score-routing-corpus.py` before and after | `overall_pass: true` both times, advisor 112 of 195 at 0.5744, Gate 3 F1 0.9843, no threshold failure, numbers identical |
| `npx vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts` before and after | 7 of 7 passed both times |
| `python3 .../scripts/skill_graph_compiler.py --validate-only` | VALIDATION PASSED after each metadata edit |
| `node .opencode/bin/compiled-route-manifest.cjs refresh` for all five hubs, runtime and authored | Exit 0 and `fresh: true` on all ten calls |
| `node .opencode/bin/compiled-route-sync.cjs --check` and `--verify` | Exit 0, all 5 hubs resolve, move-simulation clean with 0 reads under `.opencode/specs` |
| `node .opencode/bin/compiled-route-guard.cjs` | Exit 0, all five hubs fresh |
| All five canary harnesses rebuilt and validated | sk-code, mcp-tooling and cli-external-orchestration `GREEN`, system-deep-loop `real-green`, sk-doc `REAL-GREEN`. The four hubs whose byte sources did not move rebuilt byte-identically |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

**`sk-doc` was serving legacy, and this phase did not fix it.** The defect is recorded in
`research/unresolved-signal-decisions.md` with its cause commit, its mechanism and the file a
re-pin lands in. It was fixed elsewhere before the 2026-09-04 pass, and sk-doc now reports
`compiled-serving` and `fresh` with its 96 signals carrying a mode again.

**Four signals stay open and none of them is a vocabulary problem.** `deep-review`,
`dom inspect`, `task list` and `lighthouse` are each held by an abstention gate in
`lib/scorer/`, which no hub's `graph-metadata.json` can reach. The read-only explainer floor and
the low-information ambiguity floor are both named with their file in the decision document.
Whoever owns the scorer owns these four.

**The 328 figure comes from a commit message, not from a committed corpus file.** The 234
baseline is re-derivable from `research/gate-a-raw.tsv`. The post-fix total is recorded in
`08eb67a0de` and was not written back into the raw file, so reproducing it means re-running
the sweep.

**`score` cannot reconstruct rank from outside the process.** The daemon's sort key adds
bonuses the reply does not expose. Any later probe against `gate-a-raw.tsv` has to treat
`recommendations[0]` as the only source of truth for rank.

**A few declared signals are single tokens rather than full prompts.** Short executor names
under `cli-external-orchestration` are the main case, and the advisor's low-information
abstention path can treat them differently from a sentence. They were measured as-is, with
nothing excluded or rephrased.
<!-- /ANCHOR:limitations -->
