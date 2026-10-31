---
title: "Iteration 6: Validation triage, routing clarify and defer, verdicts"
trigger_phrases: []
---
# Iteration 6: Validation triage, routing clarify and defer, verdicts

**Angle:** deepseek-06 · **Lens:** integration engineer · **Wave 2 closes** · **Jev package under study:** Python `jev-cli` 0.6.2

## Focus

Which of the spec-kit validation, compiled-routing clarify and defer, and playbook or benchmark verdict seams accept a Jev call without touching a frozen contract? Hand-off target: the seams whose contract permits an extra advisory field, and a combined shortlist across wave 2 ranked by wiring cost.

## Sibling check (required from wave 2)

Read `research/lineages/grok/iterations/iteration-010.md` (grok is complete at 10) and `research/lineages/mimo/iterations/iteration-001.md` (mimo's first).

- **Grok-010:** single first build = the offline routing arm (a `choice` over one ambiguity cluster plus a `none` key, MRR and right@3 beside the similarity arm). It explicitly names my iteration 2 as having reached the same first slice, so that agreement is *after cross-reading, not independent*. Its kill criterion is sound: if the arm loses on the held-out split, closed-set `choice` ideas (severity, next_check, goal) are unsupported. I accept that; it is also the reason my wave-2 replay items are ranked behind the routing arm.
- **Mimo-001:** D4 `jev` grader = build-now, with a catch I did not have: an unknown grader kind silently falls through to `mock` (`score-model-variant.cjs:211`), and the exception path returns `score 0.0 / parse_status 'failed'` (`:222-224`), which reads as "maximally hallucinated" rather than "not measured". Its additions are stronger than my iteration 1 note. Position update: the *first slice* (grader kind plus agreement run) is build-now eligible, not next — the gold set exists; I previously ranked the feature while mimo ranked the slice. Divergence resolved in favor of the slice, with the silent-mock fallthrough and silent-0.0 as required fixes.

## Actions Taken (opened this iteration)

- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:20-70`
- `.skilled/bin/compiled-route.cjs:20-50`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/lib/router.cjs:155-220`
- `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts:65-80`, `:500-521`

## Per-Idea Records

### Idea 6.1 — Jev suggestion on compiled-routing clarify or defer

| Field | Content |
|---|---|
| **Idea** | `choice` over the clarify alternatives (or the hub's modes plus `other` for a defer) recorded as a suggested default. |
| **Seam** | `router.cjs:164-169` (defer on no match), `:199-218` (clarify within `ambiguityDelta`); front door `compiled-route.cjs:25-47`; flag `resolve.cjs:26-27`, `:54-64`. |
| **Contract blockers** | The front door is synchronous and stdout is the routing channel: `route || {servingAuthority:'legacy'}` is the only thing it may print (`compiled-route.cjs:47`), and any error must fall back to the legacy sentinel (`:39-46`). A network subprocess inside it breaks the deadline-free-but-instant promise of every dispatch, and a Jev field would have to be added to a JSON contract consumed by every hub. The clarify contract fixes two-to-four alternatives; a suggestion is a new outcome shape. |
| **Gold** | H7 counts 62 route, 10 defer, 9 reject and 3 clarify expectations across all seven hubs (digest); a Jev clarify/defer judgment cannot be proven on 13 rows. |
| **Verdict** | **drop** (live). No frozen-contract change is justified, the front door has no latency budget to spare, and the gold set is too small to prove a win. |
| **Confidence** | Confirmed from code: front door shape, stdout contract, clarify/defer construction, flag fallback. |

### Idea 6.2 — Jev suggestion below the spec-folder alignment threshold

| Field | Content |
|---|---|
| **Idea** | `choice` over the listed alternative spec folders when the topic-overlap score falls under 50. |
| **Seam** | `alignment-validator.ts:73-75` (`THRESHOLD 70`, `WARNING_THRESHOLD 50`), `:503-521` (proceed/warn/alternatives). Save CLI, no hook deadline; the existing `SPECKIT_FOLDER_DISCOVERY_TOKEN_THRESHOLD` numeric override is the flag family. |
| **Value** | Below 50 the save already lists alternatives and the operator picks; a suggestion would pre-answer a choice the operator must make anyway. |
| **Metric, baseline, harness** | UNKNOWN. Smallest: replay archived saves that scored under 50 and compare a Jev pick against the folder the operator actually chose (final state on disk). Whether history records enough of those cases is unopened. |
| **Contract** | CLI console output, not a frozen JSON schema; an advisory line is permitted. |
| **Verdict** | **later** — the lowest-risk contract of wave 2, but no gold was found and the operator choice is rare (score < 50). |
| **Confidence** | Confirmed from code: thresholds, alternatives flow. UNKNOWN: the archived gold count. |

### Idea 6.3 — Jev risk flags for spec-level recommendation

| Field | Content |
|---|---|
| **Idea** | `noul` per risk flag ("does this task change authentication / APIs / data / architecture") so `recommend-level.sh` stops depending on the caller's memory. |
| **Seam** | S24 `recommend-level.sh:19-22`, `:42-47`, `:106-109` (digest); offline CLI, points map to Levels 0-3. |
| **Value** | Wrong flags produce a wrong process level; a judgment over the task text could reduce operator bookkeeping. |
| **Metric, baseline, harness** | Compare Jev flags against archived packet assignments (level vs signals) as weak gold; no harness. |
| **Verdict** | **later** — real operator value, but the flag semantics are repository policy the script owns, and the gold is weak. |
| **Confidence** | Digest claim for the seam (not reopened); inferred value. |

### Idea 6.4 — Jev retrievability score beside the post-save density gate

| Content |
|---|
| `score` "how retrievable is this title and trigger set" beside the calibrated 0.4 signal-density gate (S25 `save-workflow.md:577-598`, digest). Offline; no gold on retrievability; a second unvalidated number beside a calibrated gate is a report to ignore. **drop** until a retrieval-outcome gold exists. |

### Idea 6.5 — Jev second opinion on manual playbook verdicts

| Content |
|---|
| `choice` `pass/fail/skip` beside a human verdict (S26 `manual-testing-playbook.md:24`). H8 records 22 PASS / 0 FAIL / 0 SKIP on the latest transport run (digest): there is nothing to disagree with, and the human verdict wins by contract. **drop**. mimo-001 reached the same drop; because we cross-read, that is agreement after the fact, not corroboration. |

## Findings

1. **The compiled-routing front door is the least Jev-compatible seam in the repository.** Its stdout is a routing channel with a single legal shape (`compiled-route.cjs:47`), it fails to a legacy sentinel on any error (`:39-46`), and it is synchronous on the path of every dispatch. A suggestion field is a contract change for all hubs and a latency addition to every clarify/defer.
2. **The clarify contract is bounded and already complete.** Modes within `ambiguityDelta` form the clarify set (`router.cjs:199-218`); the decision contract requires two-to-four alternatives (digest). An extra Jev default does not remove the operator's step; it adds a line to a prompt that already works.
3. **Only 13 clarify/defer gold rows exist across the hubs** (digest H7); even a perfect Jev arm could not be shown to beat the engine on that sample.
4. **The save CLI seams are the opposite: offline, console-output, and contract-permissive.** Below-50 alignment and level recommendation both end in a human choice on an offline flow (`alignment-validator.ts:503-521`), so an advisory line is technically permitted. What they lack is gold and frequency, not permission.
5. **Wave 2's combined shortlist, ranked by wiring cost (cheapest first):**
   1. Advisor offline `choice` arm (iteration 2.1): a script-only arm on an existing split and existing metrics; no runtime change, no new flag beyond the script. *First build per grok-010, and my iteration 2.*
   2. Stop second-rater replay (iteration 4.1): a script arm plus the replay gold definition; the corroboration slot exists (`convergence.cjs:506-549`).
   3. Severity replay via H14 (iteration 5.1): the service and adapter exist; the cost is extracting the adjudicated gold from archived reviews.
   4. Goal verifier `jev` mode (iteration 3.1): a real runtime flag addition on two surfaces plus the labeled set; most expensive of the wave-2 `next` items.
   5. Below-50 alignment suggestion (6.2): contract-permissive but gold-less and rare.
   6. Level risk flags (6.3): weak gold, policy semantics owned by the script.
   - Dropped: live clarify/defer (6.1), retrievability score (6.4), playbook verdict (6.5), guards, PreCompact, completion sentinel live path.

## Ruled Out

- **Live Jev call or field in the compiled-routing front door** (6.1): stdout contract, synchronous path, 13-row gold.
- **Jev retrievability score** (6.4): no retrieval gold, unvalidated number beside a calibrated gate.
- **Playbook verdict second opinion** (6.5): no disagreements in the recorded set, human verdict wins by contract.

## Questions Answered

- The seams whose contract permits an extra advisory field: the offline CLI surfaces (alignment below 50, level flags, post-save review) and the offline replay runners; the frozen contracts (routing decision JSON, review verdict logic) do not.
- Combined wave-2 shortlist ranked by wiring cost: above.

## Questions Remaining

- How many archived saves scored under 50, and does the final folder read back as gold? (unopened)
- Does the routing arm (adaption 2.1) win before any of these get built? (decides the whole `choice` family)

## Hand-off (for iteration 7)

- Wave 3 should build only on the ranked shortlist and must not re-derive it; the routing arm remains the gate for every closed-set `choice`.
- If the below-50 alignment idea survives, its first slice includes the archived-save gold count; without it the item has no metric.
- Next iteration (deepseek-07) plans the smallest new surface: helper, command or skill over direct transport calls, using the shortlist above.

## Assessment

- `newInfoRatio`: `0.68`
- Novelty justification: Ruled the routing front door out on its stdout contract and gold count, classified the offline CLI seams as permission-ok but gold-poor, and produced the wave-2 shortlist ranked by wiring cost. Sibling reads added mimo's silent-mock catch and grok's kill criterion; both were incorporated with attribution.
- Confidence: high for the front door and alignment contracts; medium for archived-gold availability; UNKNOWN for routing-arm outcome.

## Sources Consulted

- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs`
- `.skilled/bin/compiled-route.cjs`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/lib/router.cjs`
- `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts`
- Siblings: `research/lineages/grok/iterations/iteration-010.md`, `research/lineages/mimo/iterations/iteration-001.md`
- Digest claims (not reopened): `context/seam-map.md` (S06, S07, S23-S26), `context/measurement-digest.md` (H7, H8, H14)
