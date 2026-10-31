---
title: "Iteration 4: Deep-loop stop and convergence"
trigger_phrases: []
---
# Iteration 4: Deep-loop stop and convergence

**Angle:** deepseek-04 · **Lens:** integration engineer · **Wave 2 begins** (read Grok first) · **Jev package under study:** Python `jev-cli` 0.6.2

## Focus

Where would a Jev second rater enter the stop decision without becoming authoritative, and how would the reducer carry its signal? Hand-off target: the one stop-path seam that already has a shadow slot, the state-file fields it would add, and the contract owners it touches.

## Sibling check (required from wave 2)

Read `research/lineages/grok/iterations/iteration-003.md` (newest existing sibling; mimo has no iterations yet). Grok concluded a goal `noul` verifier is `later`, with the kill criterion "any `met` on a transcript the heuristic marks `not-met` for blocking language", and it opened `compact-inject.ts:63`, `:447-448`, `:494` (deadline `performance.now() + HOOK_TIMEOUT_MS`). I agree with its goal verdict; iteration 3 of this lineage narrows the seam to the OpenCode plugin's existing `heuristic|llm` mode switch, which grok did not name. Grok's compaction findings (jevctl on by default, pi-jev off with pause-not-partial-commit) match what iteration 3 read. I push past grok here by finding the stop path's existing corroboration mechanism, which its planned `grok-04` angle is about to argue from the one-model rule.

## Actions Taken (opened this iteration)

- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:230-280`, `:380-560`, `:600-640`, `:750-820`
- `.skilled/skills/system-deep-loop/runtime/lib/stopping-clocks/stopping-clock-shadow.ts:1-60`
- `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:955-1000`, `:3006-3016`
- `.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence-signals.md:30-80`
- `.skilled/skills/system-deep-loop/runtime/lib/next-focus/next-focus-selection.ts:190-220`, `:340-365`

## Per-Idea Records

### Idea 4.1 — A Jev novelty second rater beside the existing corroboration guard

| Field | Content |
|---|---|
| **Idea** | `score` on the five-level novelty rubric (`1.0 / 0.7 / 0.5 / 0.2 / 0.0`, `convergence-signals.md:57-63`), asked over the iteration's findings versus accumulated knowledge, recorded as a second rating beside the agent's self-report. |
| **Value** | The stop model already distrusts the self-report and corroborates it with graph evidence (`convergence.cjs:506-549`); when the ratio sits flat at 0.9 the reducer calls the signal inert and untrustworthy (`reduce-state.cjs:965-989`). A different-family numeric judge is the second lens that case asks for, and it costs one offline call per iteration. |
| **Seam** | `buildNoveltyCorroboration` `convergence.cjs:506-549`; trace entry `:532-538` (`role: 'blocking_guard'`); guard application `:618-631`; wiring `:762-782`, `:805-808`. Shadow-pairing shape to copy: `stopping-clock-shadow.ts:11-19` (`authority: 'legacy-convergence'`, `authoritative`, `*_shadow`). |
| **Metric, baseline, harness** | H11 replay (gap row "Correct stop point for deep loops"): replay archived lineages, mark the last iteration adding a new cited finding, then compare recorded stop, heuristic stop and Jev stop. Baseline: none as accuracy; archived `specs/**/research/lineages/*/deep-research-state.jsonl` files exist as raw material. |
| **Cost, latency, privacy** | One billed call per evidence iteration, offline (no deadline on the convergence script). State sent: the iteration's findings text plus prior coverage; loop content can carry repository internals, so strip secrets (`cli-usage` rule) and announce egress. |
| **Opt-in and no key** | Offline `--jev-second-rater` flag on the convergence script (env `DEEP_LOOP_*` family already used at `convergence.cjs:246-257`); with no key the replay runs without the Jev arm and reports it skipped. Live `convergence.cjs` runs stay unchanged: shadow only, `authority` stays the self-report plus graph. |
| **Complexity** | ~60-100 LOC in the script plus one reducer field; touches `convergence.cjs` (args + trace entry), `convergence-signals.md` (rubric already documented), and the reducer's record handling. |
| **Verdict** | **next** — offline, no authority change, and it fills the one place the stop model already admits it cannot trust. First slice is the replay harness, not a build flag. |
| **Confidence** | Confirmed from code: corroboration mechanics, guard, trace, reducer flatline warning. Inferred: that a Jev rubric score agrees with the last-adding-iteration gold; would be confirmed by the replay. Known weakness to respect: Jev reads questions literally, cannot count, and the rubric's negative-knowledge rule may not translate. |

### Idea 4.2 — Jev as the shadow comparator on next-focus selection

| Field | Content |
|---|---|
| **Idea** | `choice` over the top next-focus candidates, compared through the existing shadow comparator. |
| **Value** | The scorer ranks by `scoreBps` (`next-focus-selection.ts:196-210`); a model pick over 2-4 candidates could be compared without touching selection. |
| **Seam** | `selectNextFocus` `:213-349`; shadow comparison `compareNextFocusShadow` `:351-365` (returns `matchesAuthority`). |
| **Metric, baseline, harness** | No harness for focus quality; UNKNOWN baseline. Replay over archived runs could count agreement, but agreement with the code order is not quality. |
| **Verdict** | **later** — the shadow comparator is ready, but there is no gold that says a different focus was better. |
| **Confidence** | Confirmed from code: comparator shape. UNKNOWN: any quality metric. |

### Idea 4.3 — Jev as the AI-Council verdict-delta judge (cross-reference)

| Content |
|---|
| The council stops when round-to-round adjudicator verdict delta falls under 0.20 (S19). A Jev `noul` "did the verdict materially change" would *replace* the adjudicator's delta, making a model answer the stop measure. That is the wrong direction; a shadow record beside the delta is the only conforming shape, and it duplicates idea 4.1's mechanism on a different loop. Deferred to the synthesis; not a separate build. |

## Findings

1. **The stop path already contains a second-rater mechanism.** `buildNoveltyCorroboration` compares the self-reported novelty against graph novelty, computes `effectiveNovelty = max(reported, graph)` and `shouldBlock` (`convergence.cjs:520-523`), and its trace entry is a `blocking_guard` (`:532-538`). `applyNoveltyCorroborationGuard` can escalate `STOP_ALLOWED` to `STOP_BLOCKED` with a `novelty_self_report_unverified` blocker (`:618-631`, `:539-547`). A Jev rating is a *third* input to the same comparison, and the only honest first shape is advisory: recorded beside, never in `shouldBlock`.
2. **The exact shadow-pairing contract already exists.** `createStoppingClocksShadowResult` freezes `{authority: 'legacy-convergence', authoritative, stopping_clocks_shadow}` (`stopping-clock-shadow.ts:11-19`). A Jev novelty record should carry the same three parts with `authority: 'self-report+graph'`, so no consumer can mistake the shadow for the verdict.
3. **The reducer is the carrier.** `reduce-state.cjs` reads `newInfoRatio` per record (`:928`, `:2385`, `:3007-3009`), builds trend advisories from the ratio history (`:3013-3016`), and already emits a `novelty_signal_inert` warning when a flat window sits at or above 0.9 (`:965-989`). A second-rating field on the iteration record would flow into the needledashboard without a new state file. Unknown fields on records are not silently accepted: the registry surfaces `rejectedPatternWarnings` (`:3002`), so the record schema in the state reference must be extended explicitly.
4. **The rubric is already a Jev-shaped scale.** Five ordered levels (`convergence-signals.md:57-63`), with a documented simplicity bonus capped at 0.10 (`:71`). The `score` command returns a zero-based position that may be fractional (`cli-usage/SKILL.md:162-164`); with five levels the wrapper maps position to the rubric values using its own legend, and the caller owns the mapping (`integration-patterns.md:43-44` per seam map).
5. **The self-report is explicitly excluded from trust.** The decision reason says STOP is "allowed pending newInfoRatio agreement" (`convergence.cjs:480-481`), and the corroboration blocker's text says "STOP is blocked until the self-report agrees with graph evidence" (`:541`). Any proposal that lets Jev *be* that agreement makes the model authoritative; any proposal that records it beside makes it a third lens. The repo's one-model rule can accept a different-family numeric judge as a second lens, but not as the verdict.
6. **Offline is the only deadline-free home for this.** `convergence.cjs` runs as a script, and the replay use needs no hook; the stop path itself has no parts per se to time. The constraint is cost per iteration and state egress, not latency.

## Ruled Out

- **Jev inside `shouldBlock`** as the stop corroborator: a model answer would become the blocking authority; contradicts "STOP is allowed pending newInfoRatio agreement" (`convergence.cjs:480-481`) and the one-lens rule.
- **A new state file for the second rating**: the reducer already carries novelty telemetry through iteration records; a second file fails smallest-first.
- **Jev as the council verdict-delta measure** (4.3): replaces an adjudicator signal instead of shadowing it.

## Questions Answered

- The seam with an existing shadow slot: the novelty corroboration guard (`convergence.cjs:506-549`) plus the shadow-pairing shape (`stopping-clock-shadow.ts:11-19`).
- State fields it would add: a second-rating record on the iteration record (`reportedNovelty`/`graphNoveltyDelta`/`effectiveNovelty` already exist at `convergence.cjs:776-782`), surfaced through the reducer's advisory events.
- Contract owners: `convergence.cjs` (script args and trace), `reduce-state.cjs` (record schema and dashboard), `convergence-signals.md` (documented model), the state JSONL reference (new field).

## Questions Remaining

- Does a Jev rubric score correlate with the replay gold (last iteration adding a cited finding)? (H11 gap; needs the replay run)
- Does it add signal where `novelty_signal_inert` fires, or echo the flat 0.9? (the precise case that matters)
- What is the measured cost per iteration? (latency/cost gap row)

## Hand-off (for iteration 5 and later)

- The stop-path proposal is replay-first: no runtime change until the archived-lineage replay produces an agreement number. The shadow record shape copies `{authority, authoritative, shadow}`.
- If a Jev second rating ever moves `shouldBlock`, that is a separate proposal with its own kill criterion (it would need a two-lens confirmation, not one model).
- Next iteration (deepseek-05) moves to finding triage and dispatch guards; the same authority question applies there (severity replay beside the reviewer, never instead).

## Assessment

- `newInfoRatio`: `0.72`
- Novelty justification: Found that the stop model already has a self-report-vs-graph corroboration guard, which is the natural shadow slot; established the reducer as the carrier and the replay as the required first slice. Grok's newest iteration (goals, compaction) was read and its verdicts confirmed, with a narrower seam surfaced this lineage.
- Confidence: high for the corroboration mechanics and reducer path; medium for the Jev-rubric agreement (unmeasured); UNKNOWN for cost.

## Sources Consulted

- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs`
- `.skilled/skills/system-deep-loop/runtime/lib/stopping-clocks/stopping-clock-shadow.ts`
- `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`
- `.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence-signals.md`
- `.skilled/skills/system-deep-loop/runtime/lib/next-focus/next-focus-selection.ts`
- Sibling: `research/lineages/grok/iterations/iteration-003.md`
- Digest claims (not reopened): `context/seam-map.md` (S15, S16, S19, S20), `context/measurement-digest.md` (H11, gaps)
