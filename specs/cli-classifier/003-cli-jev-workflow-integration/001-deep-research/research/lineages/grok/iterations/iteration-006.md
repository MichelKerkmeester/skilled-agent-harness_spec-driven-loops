# Iteration 6: grok-06 — Guards, validation and routing, where Jev is the wrong tool

## Focus

Which wave-2 seams are repository facts that Jev must not replace, and which bold idea survives. The candidate bold idea is a `screen`-style injection gate on fetched content. Focus Area is `grok-06`. At most two bold ideas leave this iteration for wave 3.

## Actions Taken

Opened npm `jevctl` `screen`, its recipe, the Python `jev-cli` skill's NEVER list, the dispatch guard's "text is not proof" check, and the Pi spec-gate sanitizer. No live `jev` call. MiMo still has no iteration file. DeepSeek's newest file remains `iteration-002.md`, already used.

## Findings

The Python `jev-cli` contract this repository wraps says a judgment must never stand in for a repository fact this repo can answer directly, and a judgment is input to a decision, not the decision. [SOURCE: .skilled/skills/cli-jev/cli-usage/SKILL.md:210-211] [SOURCE: .skilled/skills/cli-jev/cli-usage/SKILL.md:219]

npm `jevctl` `buildScreenRequest` asks a `noul` for injection: the text contains instructions addressed to an agent that try to change its behavior, with criteria that name "ignore previous instructions" and exfiltration. `runScreen` then turns numbers into an action in code. A missing injection answer is coerced to 0. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/src/core/screen.ts:22-30] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/src/core/screen.ts:47-68]

That coercion is the trap from iteration 1's `noop` score of 1.0, in the other direction. Zero means "not an injection" if the block threshold sits above zero. A transport failure that drops the field would let the page through.

The recipe pipes a fetched page through `jev screen` and only then into an agent, with `--fail-on block,review,skip`. The binary in that recipe is npm `jevctl`, because `screen` is a jevctl command. The Python `jev-cli` that `cli-usage` wraps has `noul`, `choice`, `score`, and `run`, not a `screen` subcommand. A port has to ask the `noul` itself. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/docs/recipes.md:14-18]

This repository already refuses to trust prompt text when a filesystem fact can settle it. The dispatch guard says a bare iteration marker can be forged by untrusted content, and it requires a `Config:` path that resolves to a real file. [SOURCE: .skilled/hooks/task-dispatch/lib/dispatch-guard.cjs:124-131]

The Pi spec gate strips injected prose with `sanitizePromptForClassify` before classification, because injected words such as "write" would reopen the gate. That strip is code. [SOURCE: .skilled/hooks/spec-gate/pi/spec-gate-classify.ts:22-29]

### Drop list

| Seam | Why Jev is the wrong tool | Evidence |
|---|---|---|
| Dispatch mode match and hard-rule checks | The guard compares the prompt with registry modes and with a file on disk. Text cannot forge the file. | `dispatch-guard.cjs:124-131` |
| Prompt sanitizer for the spec gate | The defect is literal trigger words in injected prose. A probability does not strip them. | `spec-gate-classify.ts:29` |
| Fan-out near-duplicate collapse | Body key plus Jaccard 0.15 is a pure function. | `fanout-merge.cjs:348-350`, iteration 5 |
| Goal blocking-language check | The heuristic forces `not-met` on a regex. A `noul` that can say met anyway fails the kill criterion from iteration 3. | `goal-core.cjs:603-604` |
| Stop arithmetic | `newInfoRatio`, agreement rate, and counts are the jaggedness list. | `convergence.cjs:481`, `README.md:271`, iteration 4 |
| Live advisor route | The child is SIGKILL'd at 2500 ms and the shim returns `{}`. | `user-prompt-submit.ts:114`, iteration 2 |
| compact-inject prune | 1800 ms budget, and rewriting history is the cache break. | `shared.ts:12`, iteration 3 |
| Verdict counts | `riskScore` is advisory. PASS, CONDITIONAL, and FAIL ignore it. | `completion-criteria.md:62` |

### Idea: Python `jev-cli` `noul` screen on fetched page text

| Field | Content |
|---|---|
| **Idea** | Before fetched page text is passed on, ask the injection `noul` from `buildScreenRequest`. Code applies block and review thresholds. A missing number is an error, not 0. |
| **Value** | A page that says "ignore previous instructions" can be held back from the context that will treat it as data-plus-instructions. |
| **Seam** | There is no fetch function in the hooks opened here. The local fact-check that must stay in front of any screen is `dispatch-guard.cjs:131`. The outside call shape is `screen.ts:25` and `recipes.md:17`. |
| **Metric, baseline, harness** | False block rate on a labeled set of ordinary pages versus planted instruction pages. Baseline UNKNOWN. No harness in the measurement digest scores injection text. The smallest harness is a fixture directory of pages and a script that records the `noul` without feeding it to an agent. |
| **Cost, latency, privacy** | One `noul` per fetched page. The page body leaves the machine. That is the privacy cost, and it is the point of the attack the screen is trying to catch, so the page has to be stripped of secrets first. |
| **Opt-in and no key** | Default off. No key, exit 3, or a missing `noul`: do not pass the page, and do not treat it as clean. Say the fetch was skipped. Do not copy `runScreen`'s coercion to 0. |
| **Complexity** | About 70 lines once a fetch caller exists. Today the caller does not, so the lines would be a new command, which is wave 3. |
| **Verdict** | later. The question is a real `noul` with criteria. The missing-as-0 bug means jevctl's `runScreen` is not safe to copy. There is no local fetch seam to wrap yet. |
| **Confidence** | Confirmed for the coercion and for the absence of a fetch wrapper in the files opened. Whether the `noul` separates planted instructions from ordinary docs is inferred. |
| **Kill criterion** | A missing answer becomes 0, the screen replaces `dispatch-guard` or `sanitizePromptForClassify`, or a planted ordinary document (the cat case from iteration 1) blocks because extra purpose text was included. |

### Idea kept from earlier waves, not restated as new

The offline Python `jev-cli` `choice` over an ambiguity cluster, measured on the routing-accuracy split, remains the other survivor. DeepSeek iteration 2 ranks that offline arm `next` and the cached shadow lane `later`. This lineage agrees. It is not a guard, and it is not a replacement of `ambiguousWith`.

## Sources Consulted

- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/src/core/screen.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/docs/recipes.md`
- `.skilled/skills/cli-jev/cli-usage/SKILL.md`
- `.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs`
- `.skilled/hooks/spec-gate/pi/spec-gate-classify.ts`
- Iterations 1 through 5

## Assessment

newInfoRatio: 0.55

Novelty justification: The injection `noul` criteria and the coerce-missing-to-0 line are new. The drop list mostly names seams already killed, collected so wave 3 does not reopen them.

Convergence telemetry: ratios through 0.55. Mode is off. The loop widens into new surfaces rather than stopping.

## Reflection

What worked: reading `runScreen`'s default of 0 next to the skill's "not a repository fact" line. One is a bug to refuse. The other is the drop rule for the rest of the table.

What failed: finding a fetch function to attach the screen to. The bold idea has a question and no caller.

Ruled out: every row in the drop list. Two ideas remain for wave 3: the offline routing `choice`, and a screen that fails closed on a missing number and does not replace a filesystem check.

## Recommended Next Focus

`grok-07`: which vendored surface would be worth a new skill mode or command, and the case against each.

## Hand-off

- Drop list is closed: guards, Jaccard, goal regex, stop math, live routing, compaction prune, verdict counts.
- Bold idea 1: offline ambiguity-cluster `choice` (Python `jev-cli`), eval only.
- Bold idea 2: injection `noul` on fetched text, missing answer is a skip not a 0, and it does not replace `dispatch-guard.cjs:131`.
- Kill the screen if it blocks ordinary text once purpose text is added, the iteration 1 cat failure in a new costume.
