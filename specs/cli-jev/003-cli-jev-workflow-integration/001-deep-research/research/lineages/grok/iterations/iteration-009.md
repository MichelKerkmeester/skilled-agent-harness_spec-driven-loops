# Iteration 9: grok-09 — Survivors against the fitness checklist

## Focus

Run every survivor through questions 1 to 15 and the red-flag list in the repo-rules digest. Focus Area is `grok-09`. A fail that is "no baseline yet" keeps the idea at `later`. A fail that is "this replaces a fact" or "this invents a score" stays a drop.

## Actions Taken

Opened the digest's checklist and red-flag sections. Scored the hand-off list from iteration 8 against lines already cited. No live `jev` call. Sibling set is unchanged from iteration 8.

## Findings

The checklist says every proposal must answer yes, or state which question it fails. Question 1 requires a metric, a baseline, and a harness before the change. Question 7 requires that no key leaves today's behavior, with no silent default score. Question 11 requires one lens, not a verdict. The red-flag list rejects a default that papers over a missing value, and it rejects averaging disagreeing judgments. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/context/repo-rules-digest.md:54-70] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/context/repo-rules-digest.md:102-105]

### Pass and fail

| Idea | Fails | Result |
|---|---|---|
| Offline Python `jev-cli` `choice` on the advisor ambiguity cluster, eval arm only | Question 1 is partial. The routing harness and the similarity baseline exist. The Jev arm has not been run. Question 9 needs the cluster text treated as published. | **next**. The only survivor that fails nothing structural. The proof plan is one extra arm that must not write the ratchet. |
| Shadow D4 `noul` grader | Question 1. H9 agreement baseline is UNKNOWN (digest claim, not re-derived here). | **later** |
| Stop-shadow `noul` that cannot move `authoritative` | Question 1. Also question 11 if any stop path reads it. Red flag: averaging. | **later**, and the authoritative version stays **drop** |
| Severity `choice` beside a P0 | Question 1. Question 11 if PASS, CONDITIONAL, or FAIL reads it. | **later** |
| Injection `noul` on fetched text | Question 3 and question 8. No fetch caller was found. Question 7 fails if a missing `noul` becomes 0, which `runScreen` does. | **later** only as a fail-closed design. The coerce-to-0 function is **drop** |
| `next_check` `choice` | Question 1 and question 3. The debug skill already orders the work. Question 8. No caller line opened. | **later** |
| OpenCode goal `choice` | Question 1. No labeled transcript set. Question 11 if it can return `met` while `goal-core.cjs:603` would return `not-met`. | **later**, with the wrapper rule from iteration 8. Not `next`. |
| Live route, live drop at 0.5, live prune, `noop` as the no-key path, second hub mode, smell command, Jaccard replacement, stop authority | Red flags: silent default, averaging, new mode, replacing a fact. | **drop** |

Question 13 (hub routing replay) is vacuous for the `next` item because iteration 7 dropped a new mode. Question 12 (new dependency) is a pass only if the arm shells out to the `jev` binary `cli-usage` already documents, and does not add an npm package. Question 15's edge case is the no-key skip.

## Sources Consulted

- `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/context/repo-rules-digest.md`
- Iterations 1 through 8 of this lineage
- DeepSeek iterations 2 and 3, already read

## Assessment

newInfoRatio: 0.40

Novelty justification: The pass/fail table is new as a filter. The underlying seams are not.

Convergence telemetry: 0.40 is a real decline, not the inert band at or above 0.9. Mode is off. One iteration remains, and it is the ordering, not a new seam.

## Reflection

What worked: question 1 separates "we know where it would plug in" from "we know it is better."

What failed: hoping several laters would become next once they shared an opt-in flag. The flag does not create a baseline.

Ruled out for this quarter: every row except the offline routing arm.

## Recommended Next Focus

`grok-10`: if only one integration ships, which, and which ideas die when that slice loses.

## Hand-off

- Build-now: none. No survivor has a measured Jev delta.
- Next: one offline `choice` arm on the existing routing-accuracy script.
- Later: grader shadow, stop shadow, severity `choice`, fail-closed screen, `next_check`, goal `choice` that cannot override blocking language.
- What not to build: live calls inside hook deadlines, any missing-answer coerced to 0 or 1, any Jev field with stop or verdict authority, a second hub mode, smell questions that ask for a count or sit near chance.
