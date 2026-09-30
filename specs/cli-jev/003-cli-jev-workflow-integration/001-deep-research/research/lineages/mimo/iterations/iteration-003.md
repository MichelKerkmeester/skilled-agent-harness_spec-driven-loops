# Iteration 3 — mimo-03: The goal hook and compaction, friction and proof

**Lineage:** `mimo` (UX and measurement lens)
**Session:** `fanout-mimo-1790438758756-5mso8j`
**Focus Area:** `mimo-03` — The goal hook and compaction, friction and proof
**Angle question:** Would a Jev goal verdict or a Jev compaction pass reduce operator nudges, lost context or repeated work, and how would either be measured with no labeled set today?

## Grounding opened this iteration

- `.skilled/hooks/goal/README.md:19-80` — goal machinery, injection, verifier, per-runtime delivery table.
- `.skilled/hooks/goal/lib/goal-core.cjs:560-620` — `last_check` rendering and `verifyGoalHeuristic`.
- `.skilled/hooks/goal/lib/goal-core.test.cjs:631-656` — the three verifier tests.
- `.skilled/skills/system-spec-kit/runtime/tests/hook-precompact.vitest.ts:1-60` — what the precompact tests actually check.
- Digest claims used with attribution: H12 baseline, the compaction gap row, S08 and S14 seam descriptions including deadlines, the Hermes post's cache and lost-state warnings.

## What the operator actually experiences at each seam

Goal verdict. The verifier runs on Pi `turn_end` and a non-`met` verdict sends an observe-only nudge to the model (`goal/README.md:77`, opened: "heuristic verify, observe-only nudge via pi.sendMessage when not met"). The verdict also lands in the injected block as `last_check: <verdict> ; <reason>` (`goal-core.cjs:560-562`, opened). So the operator never reads the verdict; they feel its errors as model behavior: a false `not-met` nudges the agent to keep working on a finished goal (repeated work), and a false `met` or chronic `unclear` lets the goal drift without a nudge (the operator re-explains the goal later). The heuristic is a regex plus keyword-overlap ladder (`goal-core.cjs:596-620`, opened): evidence under 24 chars or without an explicit completion signal stays `unclear`, blocking language forces `not-met`, and `met` needs a completion pattern plus one or two objective-keyword matches at a fixed confidence 0.72 (`:613-619`). The result shape already carries `source: 'heuristic'` (`:586-588`), so a non-heuristic verifier is representable without a schema change.

Compaction. The precompact tests check mechanics: payload caching, overwrite, token budget (`hook-precompact.vitest.ts:29-60`, opened). Nothing checks what survives a compaction, matching the measurement digest gaps row ("check mechanics, not what survives"). The operator's felt failure is lost context and repeated work after a compaction, and the Jev-shaped fix (a keep-or-drop pass over history) has two recorded hazards in the vendored material: it can drop critical state and it breaks the provider prompt cache (jev-material digest anti-pattern 2; the pi-jev-context author concedes cache invalidation, jev-material digest §4.4).

## Per-idea records

### Idea 1: Jev `choice` goal-verifier arm, shadow only, heuristic stays authoritative

| Field | Record |
|---|---|
| **Idea** | `jev choice` over keys `met`, `not_met`, `unclear` given the goal objective and the turn transcript, recorded beside the heuristic verdict with `source` distinguishing them. The heuristic's verdict is what the nudge and `last_check` use. |
| **Value** | Fewer spurious nudges and less goal drift: the decision is whether to nudge the model to continue, made on every Pi turn (`goal/README.md:77`). The heuristic's known error surface is wording: "done" without objective keywords reads `unclear`, and a summary that quotes a blocker while reporting it resolved reads `not-met` (`goal-core.cjs:603-605`, blocking pattern fires on any mention). A semantic judge could separate "reports a blocker it cleared" from "is blocked". |
| **Seam** | `.skilled/hooks/goal/lib/goal-core.cjs:586-620` (verifier result shape and ladder; the `source` field is the seam). Opened this iteration. |
| **Metric, baseline, harness** | Metric: three-class accuracy and per-class error rates (especially false `not-met`, the repeated-work driver) for heuristic versus Jev on the same excerpts. Baseline: UNKNOWN; H12 has three unit cases (`goal-core.test.cjs:631-656`, opened) and no accuracy number. Harness: H12 plus a labeled transcript set; the gaps table names exactly that ("30 to 50 labeled transcript excerpts (met, not-met, unclear) scored for both the heuristic and a Jev arm", measurement digest §3). |
| **Cost, latency, privacy** | One billed `jev choice` per turn_end where the shadow runs, which is every turn on opted-in sessions. The transcript excerpt is capped at 1200 chars for the heuristic (seam-map S08 claim); a Jev arm would send similar text plus the objective off the machine every turn. No deadline on Pi (seam-map S08: "none declared in the Pi hook"), so latency is tolerable but cost is per-turn and permanent. |
| **Opt-in and no key** | Default OFF, shadow-only, following the repo's opt-in flag shape (seam-map "Env flag conventions"; no rule file names a Jev flag, so the exact name must be verified in cli-jev before any proposal cites one). No key: `verifyGoalHeuristic` alone, which is today's behavior exactly; the arm logs `skipped: no key`. |
| **Complexity** | Roughly 120-180 lines in a verifier module beside `goal-core.cjs` plus the Pi adapter hook-up and tests; the shared contract touched is the verifier result shape, whose owner is the goal core and whose other caller is the OpenCode plugin's separate verifier (README `:34` says the plugin has its own native verifier). |
| **Verdict** | **next,** gated on the labeled set existing first: a shadow with no gold produces disagreement counts nobody can adjudicate. The label set is check 1 of this idea's proof plan. |
| **Confidence** | Confirmed from code: verifier ladder, fixed 0.72, `source` field, nudge shape (`goal-core.cjs:596-620`, `README.md:77`). Inferred: that a semantic judge beats the regex ladder; would confirm by scoring both arms on the labeled set. |

### Idea 2: Jev keep-or-drop pass at compaction, precomputed only

| Field | Record |
|---|---|
| **Idea** | Before or during compaction, `jev noul` per candidate history fragment "keep this for the next context", as the jevctl compaction hook and pi-jev-context do (jev-material digest §4.2, §4.4 claims). In this repository the only feasible shape is a precomputed or offline pass: the hook's internal budget is 1800 ms inside a 3 s hook (seam-map S14) against a 60 s client timeout (seam-map preamble). |
| **Value** | Less lost context after compaction at equal or shorter surviving output. The decision it changes is what the model sees after a compaction, which the operator experiences as "forgot X" versus "remembered X". |
| **Seam** | `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:144-160,325-350` and `shared.ts:12-14` (seam-map S14 claims, not opened this iteration). The measurement seam is the precompact test file's surface (`hook-precompact.vitest.ts:8-11`, opened: `mergeCompactBrief`, `buildCompactContext`, `truncateToTokenBudget`). |
| **Metric, baseline, harness** | Metric: must-survive fact recall at equal output length, plus output length itself. Baseline: UNKNOWN; no test measures recall (gap row). Harness: none today; the smallest one is the gaps-table design: "a fixed set of transcripts, each with 5 to 10 must-survive facts, compacted with and without a Jev keep-or-drop pass, scored by fact recall and output length" (measurement digest §3). |
| **Cost, latency, privacy** | Batched `jev run` over candidate fragments; the Hermes user report claims about $0.002 per compaction and 5.6 s versus 44.8 s for an LLM summarizer (jev-material digest §2 vendor/user claims). Privacy: history fragments, potentially the most sensitive state any idea touches, leave the machine. The vendored author warns the pass can break prompt caching (jev-material digest §4.4), which would raise every subsequent request's cost, and cache breakage has no recorded measurement. |
| **Opt-in and no key** | Default OFF. No key: the stock compaction runs unchanged, which is today's behavior. pi-jev-context's pattern is the one to copy: pause judging on error, keep prior state, commit only complete scans (jev-material digest §4.4). |
| **Complexity** | The harness first (roughly 200 lines: transcript fixtures, fact scorer, two compaction arms); the in-product pass is larger and crosses the 1800 ms budget, so it does not exist in-hook at all in v1. |
| **Verdict** | **later.** The labeled harness is more work than either wave-1 slice and the cache-breakage risk is unmeasured; it also competes with simply enlarging the 4000-token budget (`shared.ts:12-14`, seam-map S14) which is the cheaper move the reversal-cost order asks about first. |
| **Confidence** | Confirmed from the test file that only mechanics are covered; inferred everything about recall and cache cost; the Hermes numbers are user reports, not measurements here. |

### Idea 3: In-hook live Jev verdict at the hook deadlines

| Field | Record |
|---|---|
| **Idea** | Call Jev synchronously inside the goal turn_end flow or the precompact hook. |
| **Value** | The freshest judgment, but at the wrong price. |
| **Seam** | Pi turn_end has no declared deadline (seam-map S08) but fires every turn; precompact has 1800 ms internal, 3 s hook (seam-map S14). |
| **Metric, baseline, harness** | Latency budget itself is the metric and it already fails on paper. |
| **Cost, latency, privacy** | 60 s client timeout (seam-map preamble) against a 3 s hook ceiling: no measured latency exists to even argue it fits (seam-map: "any seam with a deadline under 10 s needs a shadow, cached or async shape"). Per-turn billing on top. |
| **Opt-in and no key** | Irrelevant: it cannot ship either way. |
| **Complexity** | Small code, impossible timing. |
| **Verdict** | **drop.** Fails the deadline before any usefulness question is reached. |
| **Confidence** | Confirmed deadline numbers from seam-map and the cli-usage client timeout (seam-map "The Jev contract as used here"); no measurement contradicts it. |

### Idea 4: Jev verdict served as the authoritative goal verdict

| Field | Record |
|---|---|
| **Idea** | Replace `verifyGoalHeuristic`'s verdict with Jev's when they disagree. |
| **Value** | None measurable after the fact: serving before measuring destroys the comparison, and a single numeric judge steering nudges violates the one-lens rule (repo-rules-digest §2 item 9: a Jev probability or score is one lens and cannot close a judgment question alone). |
| **Seam** | `goal-core.cjs:586-588` (`source` field would flip to a Jev source). |
| **Metric, baseline, harness** | None after serving. |
| **Cost, latency, privacy** | As Idea 1. |
| **Opt-in and no key** | Even opt-in, authority transfer is the forbidden step (judgment-as-authorization anti-pattern family, jev-material digest anti-pattern 9). |
| **Complexity** | Small, and wrong. |
| **Verdict** | **drop,** permanently unless a measured arm shows a large, stable gain and even then the rule is a second lens, not a replacement. |
| **Confidence** | Doctrine-level plus the delegation rule's "one model is one opinion". |

## Ruled out this iteration

- Mining the goal state files for free labels: the record keeps liveness, telemetry and slice hash (`README.md:32`), not verdict histories, so no cheap labels hide there. (What would confirm: a `history` read of a real state file; deferred.)
- A Jev arm on the OpenCode plugin's native verifier: it is a separate implementation that shares only the kill switch, state contract and slice module (`README.md:34`), so parity would double the surface for one measured win. Out of scope for a first slice.

## Hand-off

- Smallest labeled set, goal verdict: 30 to 50 turn excerpts (met, not-met, unclear), drawn from the operator's own sessions because "was my goal met at this turn" is the operator's judgment; 10 per class is enough for a first signal. The heuristic and the Jev arm are both scored on it (H12 extension).
- Smallest labeled set, compaction: 10 to 15 real transcripts each with 5 to 10 operator-marked must-survive facts (50 to 150 facts total), scored by fact recall at equal output length.
- Defaults both features ship with: goal arm default OFF, shadow-only, heuristic authoritative; compaction pass default OFF and precomputed only, never in the 3 s hook.
- For mimo-08's proof plans: the goal proof's check 1 is the labeled set existing with per-class counts; the compaction proof's check 1 is the cache-cost question answered (does a keep-or-drop pass break provider prompt caching, and what does that cost per day) before any product slice.
- Open thread carried from iteration 1: the done-gate idea and S09's completion seam meet the goal verifier's question ("did the turn finish the work") at mimo-06; that iteration should decide whether one labeled set can serve both seams.
