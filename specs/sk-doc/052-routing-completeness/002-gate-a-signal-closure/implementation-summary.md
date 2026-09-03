---
title: "Implementation Summary: Gate A signal closure"
description: "Every signal the five parent hubs declare was swept through the daemon and classified into one bucket. The baseline came out at 234 of 444 resolved, one hub had never been measured at all, and the follow-up fix moved the total to 328 against the same frozen corpus."
trigger_phrases:
  - "gate a summary"
  - "declared signal closure"
  - "444 signal sweep"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/002-gate-a-signal-closure"
    last_updated_at: "2026-09-03T22:40:00Z"
    last_updated_by: "phase-2-gate-a-signal-closure"
    recent_action: "Re-swept at HEAD and closed AC-003 with a decision per signal"
    next_safe_action: "Hand the sk-doc activation-pin defect to its owner"
    blockers: []
    key_files:
      - "research/unresolved-signal-decisions.md"
      - "research/gate-a-rerun-2026-09-03.tsv"
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
      - "sk-doc serves legacy on a stale activation pin, which costs 96 signals their mode"
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
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

**`sk-doc` is serving legacy, and this phase does not fix it.** The defect is recorded in
`research/unresolved-signal-decisions.md` with its cause commit, its mechanism and the file a
re-pin lands in. It is not one of the fifty and it does not bear on the three criteria, but it
is the largest live routing problem the closure sweep found and it needs an owner.

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
