# Iteration 1: grok-01 — Vendored compaction against R19

## Focus

Angle `grok-01`. Vendored npm `jevctl` compaction (`compact`, `fitState`, `worth_it`), the `session.compact` hook, pi-jev-context's reversible filter, and the two posts, read against R19's census and later deletion arm. Wave W1.

## Sibling check

Independent: no round-2 sibling file read.

## Findings

### F1. The 25,000-token budget is the judgment state, not the compacted transcript

BASE says every host compaction started at 450,019 tokens or more, so a deletion pass fitting a 25,000-token state budget is in doubt (BASE §6 and R19). Those two numbers are different objects.

The npm `jevctl` 0.2.3 library never sends the raw transcript. `docs/compact.md:36-37` says tool outputs are replaced by a one-line note before any budget check, and shrinking that state "never changes the output; it only shapes what Jev reads." `resultNote` is `` `${call.isError ? 'error' : 'ok'}, ${call.resultChars} chars (omitted)` `` at `src/vendor/compaction/state.ts:108-109`. `fitState` (`state.ts:198-306`) then shrinks in this order, returning the first stage that fits `maxStateTokens` (default 25,000 at `src/vendor/compaction/compact.ts:24`):

1. `full` — tool inputs capped at 1,000 characters (`state.ts:235-236`, `INPUT_CHARS` at `:18`)
2. `inputs<=200`, then `inputs<=60` (`:238-241`)
3. `texts abridged` — head 400 and tail 150 (`:19-20`, `:251-257`)
4. `old messages collapsed` — unpinned text becomes `[… N chars omitted …]` (`:260-267`)
5. `old calls compacted` — one line per call (`:271-278`, `compactCall` at `:113-122`)
6. `old messages left out` — unpinned entries with no call are dropped from the state (`:281-293`)
7. `old calls merged` (`:296-302`)

If that still exceeds the budget, `fitState` throws (`:304-306`). `compact` documents that throw as the caller's fallback (`src/vendor/compaction/compact.ts:257-258`). The hook catches it and calls `next(event)`, which is the built-in summary (`plugin/hooks/fast-jev.ts:283-285`).

A session whose bulk is tool-result text can therefore fit at `full` even when host `preTokens` is 450,019. A session whose bulk is user and assistant prose can throw, or fit only after prose is collapsed in the *judgment* state. The output still keeps that prose: `docs/compact.md:3` says user and assistant text is never touched, and `applyDecisions` copies `message.text` through (`src/vendor/compaction/compact.ts:222`).

**Census change (N-grok-01-1).** R19's fit column should print `estimateTokens` (`state.ts:31-41`) and `stateStage`, including a counted throw. It should not print raw `preTokens` divided into 25,000. The estimator is local and sends nothing. The token formula is words at one token per six letters, digits at half a token, other symbols at 0.9, then `Math.ceil` (`:31-40`). The file says that lands 2–18% above Jev's reported usage and that a plain characters-per-token ratio undercounts JSON-heavy states by up to 40% (`:25-29`). That calibration is a vendor claim inside the vendored source, not a local measurement.

### F2. `worth_it` is a character-reduction ratio, independent of fit

`runCompact` sets `worth_it: reduction >= minReduction` (`src/core/compact.ts:68-75`). `reductionRatio` is `(charsBefore - charsAfter) / charsBefore` on message characters (`src/vendor/compaction/compact.ts:244-246`, `messageChars` at `:231-241`). The default threshold is 0.25 (`docs/compact.md:30`, `src/core/compact.ts:24`). The hook uses the same comparison and falls back when reduction is below `minReductionRatio` (`plugin/hooks/fast-jev.ts:277-279`). `--fail-on low-reduction` exits 2 on the npm package (`docs/compact.md:33`, `src/core/compact.ts:84-88`). On the Python `jev-cli` 0.6.2, exit 2 is a usage error. A port must not treat exit 2 as "not worth applying."

A transcript can fit the judgment budget and still be `worth_it: false` when pinned messages (first message, or any call whose call or result sits in the newest 6 — `state.ts:53-58` and `:89-91`, default `preserveRecentMessages: 6` at `compact.ts:23`) and untouched prose dominate the character count. The opposite also holds: a throw means "no decision," not `worth_it: false`.

**Arm kill (printed result).** Do not build the Jev arm if the census line is `arm not built: fit_throws>=50% OR offline_reduction_upper_bound<0.25`. The upper bound is local: drop every unpinned tool result to `truncateHeadChars` (default 300, `compact.ts:26` and `truncatedResultText` at `:138-143`) and leave prose and pinned messages unchanged. That bound needs no model. BASE's stop boundary ("fewer than half the points fit 25,000 tokens without collapse") should be restated as "fewer than half return a stage strictly before `old messages collapsed`, and none throw." Collapse is a legal fit, not a failure; the throw is the failure.

### F3. The keep-result question is asked about a body the model does not see

`questionsFor` asks two `noul` questions: keep the call, and keep the full output verbatim (`src/vendor/compaction/compact.ts:58-69`). The result question names the tool and `resultChars`. The state that travels with it contains `resultNote`, not the body (`state.ts:108-109`, `docs/compact.md:36`). A reviewer on the Hermes thread planted marker strings and reported the same replacement, quoted here as a user report, not as a measurement of this repository: "tool result bodies are replaced with 'ok, 51 chars (omitted)'. Jev is asked whether to keep a result whose contents it never sees" (`context/social posts/Reddit - Integrated the Jev context engine into Hermes.md:651-653`).

That does not make the census unnecessary. It changes what the later arm can honestly claim. Must-survive items that live only inside a tool-result body (a path printed by a command, an error string) are invisible to the keep-result question. Items the census can see in record fields — a Write or Edit path, a user instruction — can still be scored offline. The arm's keep-result `noul` cannot be the recall mechanism for body-only items.

The strongest outside claim that would make the *census* unnecessary is the Hermes post's paired measurement: three compactions on ~75k-character contexts, +13,200 tokens freed, and a stated ~$0.002 per compaction (`Hermes.md:20-25`, `:63`). Those figures are a user report on a different host and a different size. The local number that tests them is the census stage histogram plus the offline reduction upper bound, not another reading of the post. The same thread's comment that "dead-end reasoning tokens fill a context window" (`Hermes.md:597`) is the prose case F2 already encodes: verbatim user and assistant text is never deleted (`docs/compact.md:3`).

### F4. D5 port: the Python package has no `compact` subcommand

`docs/compact.md:11` names "audit what a compaction would drop" as a use, and the input form is a Claude Code session log (`:17`). That command is npm `jevctl`. The Python `jev-cli` 0.6.2 surface wrapped here is `jev noul`, `jev choice`, `jev score` and `jev run` (`.skilled/skills/cli-jev/cli-usage/SKILL.md:146-151`). A search of that skill for a compact subcommand hits only "compact JSON" as an output shape (`SKILL.md:162`).

An offline audit ported onto `jev run` is the right shape for R19's later arm, and only after the census. D5 requires, before any `jev run`:

- the arm's own switch, proposed `--jev`, default off
- `command -v jev`, then `jev --version` printing `jev 0.6.2`, then `jev auth status` exiting 0
- on any failed check: print `jev arm skipped: <check>` and leave the census report unchanged
- a missing or non-numeric `noul` throws in the vendored parser (`src/vendor/compaction/request.ts:68-82`) and the hook falls back (`fast-jev.ts:283-285`). The port must do the same: one bad answer marks that call unmeasured and continues the census. It must not substitute 0 or 1. Pinned calls with no answer are treated as keep at `compact.ts:284-285` (`keepCall: 1, keepResult: 1`). That default is safe only because pinned calls are already excluded from questions. A missing answer on a *candidate* throws via `noulAnswer` before `decideCall`. Do not copy the pinned default onto candidates.
- npm `jevctl` exit 2 means `--fail-on low-reduction` (`src/core/compact.ts:87-88`). Python exit 2 stops the arm as a usage error and prints `jev arm skipped: exit 2`. Exit 3 and exit 4 stop the arm the same way, with the census rows already printed left as-is.
- The census script never spawns `jev`. It may copy `estimateTokens` and the stage ladder. It must not import `plugin/hooks/fast-jev.ts`, which enables compaction unless `compaction === false` (`fast-jev.ts:75`) and reads `TYPESAFE_API_KEY` from plugin options, the environment, or settings `env` (`:237-253`).

**Census kill (printed result).** Drop the census script if a dry run on the operator-named directory prints `census dropped: unknown_record_shape` on more than half the sessions, or if the report contains any transcript text. Until that run exists, the census stays build-now. This iteration does not change R19's rank. It changes the fit column and the arm's claim about result bodies.

### F5. pi-jev-context hides by filtering the model request, and says it breaks the prompt cache

`prune` returns a new message array with dropped tool blocks and result messages removed (`pi-jev-context-main/src/context.ts:115-141`). The session store is not rewritten: `context` returns `{ messages: prune(...) }` only when `settings.enabled` (`src/index.ts:264-270`). `/rejev` can rescan because judgments are cached on the branch (`README.md:78-79`, cache filter at `src/index.ts:167-168`). Default config is `"enabled": false` (`README.md:95-98`), which is the opt-in shape the npm hook lacks.

The vendor's own limit line: "filtering can invalidate your model provider's prompt cache" (`README.md:85`). That is the concrete answer to BASE question 11 for this pattern: a live filter on Pi's `context` event changes the prefix, so a provider prompt cache keyed on that prefix misses. On an API error, "previously saved pruning still applies" (`README.md:87`). That is fail-open under D5: a later request with no key still hides history. Anti-pattern for this repository. Reversible hiding is a better fit than permanent deletion only for a future Pi-local experiment, and only if an error clears the applied prune instead of keeping it. It is not R19's arm. R19 audits host `compactMetadata`. Pi's own compaction is a separate path the vendor says Jev cannot undo (`README.md:87`).

The blog file is a pasted article whose first line is only the URL `https://www.explainx.ai/blog/fast-jev-compaction-claude-code-plugin-2026` (`context/social posts/Blog - Claude Code Compaction Without a Lossy Summary.md:1`). Star counts and upvote counts in that file are vendor or publisher claims. They do not move the census.

### Adopt or anti-pattern

| Pattern | Where | Under the key gate |
|---|---|---|
| Staged `fitState`, local `estimateTokens`, throw when unsqueezable | `state.ts:191-306` | Adopt inside the zero-call census. No key, no spawn. |
| `worth_it` as character reduction ≥ 0.25 | `src/core/compact.ts:75` | Adopt as the arm's offline upper-bound kill, computed with no model. |
| Two `noul` questions per old call, results omitted from state | `compact.ts:58-69`, `state.ts:108-109` | Adopt only as the later `jev run` shape, after the census, behind `--jev`. Do not claim the keep-result question saw the body. |
| `session.compact` hook, on unless `compaction` is false, key from settings `env`, auto-compact at 60% | `fast-jev.ts:75`, `:237-253`, `:26-31`, `:289-296` | Anti-pattern. Do not install. Restates BASE rows 6 and 43. |
| `--fail-on` exit 2 | `src/core/compact.ts:84-88` | Anti-pattern to copy onto the Python package. Exit 2 there is usage. |
| Pinned-call default probability 1 when no answer was asked | `compact.ts:284-285` | Adopt only for pinned calls. A missing candidate answer throws (`request.ts:68-82`). |
| pi-jev `context` filter, branch cache, `/rejev` | `index.ts:264-270`, `README.md:78-85` | Anti-pattern as a live install here: prompt-cache invalidation is the vendor's own limit, and saved pruning survives an API error (`README.md:87`). |

## Per-idea records

### N-grok-01-1

| Field | Record |
|---|---|
| **Idea** | `N-grok-01-1`. The census fit column is `estimateTokens` plus `stateStage`, including throws. No judgment type; the census sends nothing. |
| **Builds on** | R19. Question 30 on R19's rank. Question 24 in BASE §12 (fit against 25,000). |
| **Value** | The operator learns whether these sessions can be *decided* inside the judgment budget, which raw `preTokens` cannot say. |
| **Seam** | `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/src/vendor/compaction/state.ts:198` (`fitState`). Census script still proposed; not in the tree. |
| **Metric, baseline, harness** | Stage histogram and throw count. Baseline today is BASE's raw minimum 450,019, which is the wrong unit. Harness: R19's proposed `score-compaction-recall.mjs`, extended with the stage ladder. H-number: none; this is the harness. |
| **Cost, latency, privacy** | Zero calls. Nothing leaves the machine. Deadline: none; it is a batch script. |
| **Key gate and no-key behavior** | No switch and no `jev` spawn. With no key the script behaves as specified, because it never looked for a key. Exit 3, exit 4 and a malformed answer cannot occur. |
| **Rough LOC** | The stage replay is on the order of the vendored `fitState` (about 110 lines, `state.ts:198-306`) plus a transcript walker. Inside BASE's 200–300 LOC census estimate. No rank change. |
| **Verdict** | build-now, as a column on R19's census. The census rank stays build-now. |
| **Confidence** | Confirmed from the vendored source. What would confirm the histogram is the census run, which this iteration did not execute. |

### N-grok-01-2

| Field | Record |
|---|---|
| **Idea** | `N-grok-01-2`. R19's later arm is two `noul` questions per old tool call via Python `jev run`, and the keep-result question does not see the result body. Type: `noul`. |
| **Builds on** | R19's later arm. `docs/compact.md:11` audit use. |
| **Value** | Stops the arm from being scored as if it had read tool output. |
| **Seam** | `src/vendor/compaction/compact.ts:58` and `state.ts:108`. Python dispatch shape: `.skilled/skills/cli-jev/cli-usage/SKILL.md:151`. |
| **Metric, baseline, harness** | Same recall metrics as R19, split into field-visible items and body-only items. Body-only recall against this arm is not a valid metric. Baseline UNKNOWN until the census splits them. |
| **Cost, latency, privacy** | Two `noul` questions per unpinned call, state resent per batch (`compact.ts:254-256`). The state includes abridged user and assistant text (`state.ts:251-267`) and truncated tool inputs (`:98-105`). That is the high payload class BASE already names. Deadline: not a hook. The vendored hook's wall time is not reused; question 18's production budget was not in the files opened here. `fast-jev.ts:9-10` says the checked-in types were written by Claude Code 2.1.274. |
| **Key gate and no-key behavior** | Own switch `--jev`, default off. Three D5 checks before the first `jev run`. Failed check, exit 3, exit 4, or a thrown invalid `noul` (`request.ts:80`): print `jev arm skipped: <reason>`, do not invent a probability, census unchanged. Python exit 2 is usage, not low-reduction. |
| **Rough LOC** | Arm is later. The skip-line and answer parser are tens of lines once the census exists. Not sized as a build-now slice. |
| **Verdict** | later. The census can kill it with the printed line in F2. |
| **Confidence** | The omitted body is confirmed in source. The Hermes marker test is a user report. |

### R19

| Field | Record |
|---|---|
| **Idea** | R19, unchanged in rank. Census build-now; deletion arm later. The census's fit question is N-grok-01-1. The arm's judgment type is `noul`. |
| **Builds on** | BASE R19. This iteration contests the fit inference and confirms the census-before-arm order with new evidence. |
| **Value** | Same operator decision BASE names: whether idea 4 needs any Jev code. |
| **Seam** | Judgment procedure: `src/vendor/compaction/compact.ts:260`. Hook anti-pattern: `plugin/hooks/fast-jev.ts:269`. |
| **Metric, baseline, harness** | BASE's proof plan, with the fit cell replaced by stage and throw count, and an offline reduction upper bound beside `worth_it`'s 0.25. |
| **Cost, latency, privacy** | Census: zero. Arm: whole-session prose and truncated tool inputs leave the machine; result bodies do not, which is the gap in F3. |
| **Key gate and no-key behavior** | Census: no key. Arm: F4. |
| **Rough LOC** | Census remains BASE's 200–300 estimate. The stage function is ~110 of that. |
| **Verdict** | build-now for the census. Later for the arm. Rank unchanged. |
| **Confidence** | Mechanism confirmed. The local histogram is not yet counted. |

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| `fitState` has seven stages and throws only after old call-less messages are dropped from the judgment state | new | `state.ts:235-306` |
| Host `preTokens` ≥ 450,019 does not answer whether the judgment state fits 25,000 | contests BASE | BASE §6 versus `docs/compact.md:36-37` and `state.ts:108-109` |
| `worth_it` is output character reduction ≥ 0.25, not a fit flag | new | `src/core/compact.ts:68-75`, `compact.ts:244-246` |
| Keep-result `noul` is asked without the result body | new | `compact.ts:64-68`, `state.ts:108-109`, Hermes post `:651-653` (user report) |
| Python `jev-cli` 0.6.2 has no `compact` subcommand; the port is `jev run` after a local fit | new | `cli-usage/SKILL.md:146-151`, `:162` |
| pi-jev filtering invalidates the provider prompt cache, and saved pruning survives an API error | new | `README.md:85`, `:87`, `index.ts:264-270` |
| The npm hook runs unless disabled and reads a key from settings `env` | restated | `fast-jev.ts:75`, `:237-253`. BASE rows 6 and 43 |
| R19 census stays build-now and the arm stays later | confirms BASE with new evidence | F2 kill line. Rank not moved |

## Sources Consulted

- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/docs/compact.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/src/vendor/compaction/state.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/src/vendor/compaction/compact.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/src/vendor/compaction/request.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/src/core/compact.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/plugin/hooks/fast-jev.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/pi-jev-context-main/README.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/pi-jev-context-main/src/index.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/pi-jev-context-main/src/context.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/social posts/Reddit - Integrated the Jev context engine into Hermes.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/social posts/Blog - Claude Code Compaction Without a Lossy Summary.md` (line 1 is a URL only; the rest is a pasted article, claims labeled)
- `.skilled/skills/cli-jev/cli-usage/SKILL.md`
- BASE R19 and rows 5, 6 and 43, quoted as BASE, not re-derived

## Assessment

newInfoRatio: 0.75. Seven claims, four fully new, one contesting BASE with new evidence, one confirming BASE's rank with a new kill line, one restated hook fact that scores 0. Novelty justification: the stage ladder, the separation of fit from `worth_it`, and the omitted result body are mechanisms BASE's fit sentence does not use. Confidence: high on the vendored control flow; the local stage histogram is uncounted. Convergence before the cap is telemetry only (`convergenceMode: off`).

## Reflection

What worked: reading `fitState` and `runCompact` rather than the doc's one-paragraph shrink list. What failed: a first reading that treated 450,019 and 25,000 as the same unit. Ruled out: installing the npm hook; using pi-jev's live filter as R19's arm; copying npm exit 2 onto the Python package.

## Recommended Next Focus

grok-02: done gates and verification outside, against R2 and R20.

## Hand-off

- grok-02 should not reopen the compaction stage ladder except where a verifier pattern copies `worth_it` or a default probability.
- The census fit column is now stage plus throw, and the arm's keep-result question is blind to result bodies.
- Question 18's production seconds were not in the files this iteration opened; `fast-jev.ts:9-10` only names Claude Code 2.1.274 as the type-reference writer.
- Question 25 (whether the transcript stores the injected brief) was not opened here.
