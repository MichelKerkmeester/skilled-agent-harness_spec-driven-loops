# Iteration 4: grok-04 — Egress, secrets, budgets and review funnels

## Focus

Angle `grok-04`. Secret patterns, a planned-call line, refuse-versus-truncate, and whether archived review narratives hold rejected-P0 gold for R10. Wave W2. Question 7.

## Sibling check

- Newest sibling file is still `research/lineages/deepseek/iterations/iteration-001.md`. No iteration 2 there.
- `research/lineages/mimo/iterations/` has no iteration file.
- `research/lineages/swe/iterations/` has no iteration file.
- Nothing new to push past on egress. DeepSeek's version literal was already reopened in iteration 3.

## Findings

### F1. The path-refuse rule does not catch the two assignment strings both local regexes miss

`secret-scrubber.ts:128` names a credential only when the word at the boundary is `api`, `access`, `auth`, `client` or `secret`, then an optional separator, then `key`, `token` or `secret`, or when the word is `password`, `passwd` or `credentials`. A digit and a letter are required, and the value must be at least 20 of the allowed characters. `opencode-goal.js:474` matches `api` plus optional separator plus `key`, or the words `token`, `password` or `secret`, at a word boundary.

A local check of those two expressions, using a 32-character stand-in with letters and digits, printed:

| Sample | scrubber match | goal match |
|---|---|---|
| `TYPESAFE_API_KEY=` plus the stand-in | false | false |
| `SERVICE_TOKEN=` plus the stand-in | false | false |
| `API_KEY=` plus the stand-in | true | true |
| `token=` plus the stand-in | false | true |

Underscore is a word character, so the boundary sits at the start of `TYPESAFE` and of `SERVICE`, not in front of `API_KEY` or `TOKEN`.

claude-jev refuses path segments, not assignment text (`fs-source-reader.ts:16-33`, applied at `:83-86`). The same check against three of those patterns matched `.env` and `secrets.json`, and did not match `service_token.txt` or `app.ts`. A source file that contains `TYPESAFE_API_KEY=` or `SERVICE_TOKEN=` is read. The refuse-the-file rule does not close the gap the two local regexes leave.

**Adopt, as a local scrub, not as a Jev call:** allow a prefix of word characters before the existing name class, so those two assignments redact. This runs whenever text is prepared, including the no-key path. It is not behind `--jev`. **Printed kill:** the same check still prints false for both prefixed samples after the change.

Do not copy a sample value into a fixture that looks like a live key. The stand-in above is enough.

### F2. Print the call count, then refuse. Do not clamp the prompt with `...`

`jev-review` logs the file count before screening (`workflow.ts:47-48`) and the follow-up count before locate (`:76-78`). It then drops signals past `MAX_FOLLOW_UPS` of 8 (`config.ts:15`, `workflow.ts:76`). That is a cap by omission, not a budget refuse. Screening still calls once per file. There is no dry-run and no abort-on-cost in `workflow.ts`.

supercov prints an estimate before sending. The documented shape is a request count and an input-token estimate (`docs/quality.md:191-195`). The dollar figure on that line is the vendor's example. It is not a measurement of this repository. `--dry-run` prints the requests and sends nothing (`:35-36`, `:215-216`). Assessing requires `TYPESAFE_API_KEY` (`:15-16`). Reading a saved assessment does not. The on-disk answer cache (`:197-199`) would zero a flip rate if R1 reused it across reruns. Do not point R1 or R21 at it.

pi-jev-context stops the batch when the next body would pass 28,000 bytes or 12 questions, and if the batch is empty it throws and saves nothing (`src/jev.ts:4-5`, `:89-96`). claude-jev throws `BudgetError` when the state plus the longest question exceeds 32,000 estimated tokens, or when the batch count exceeds `maxRequests` (`budget.ts:6-7`, `:75-78`, `:96-99`). Its estimator is letters/3, not the npm `estimateTokens` from iteration 1. npm `jevctl` `validateAnswers` throws on a missing answer and says treating that miss as probability 0 would let a screen pass (`provider.ts:116-120`, `:134-137`). That is the same defect iteration 3 named in `rerank.ts:77`, now in the transport.

`clampText` keeps a head and writes `...` (`opencode-goal.js:382-388`). That is the truncate this angle was asked to set beside "refuse". A Jev prompt that has been cut and marked with `...` is a different question from the one the harness scored. **Adopt the throw.** If the planned body does not fit, print `jev arm skipped: budget` and make no call. Do not send the clamped string.

**Printed line, before any billed call, only when `--jev` is on and the three D5 checks passed:** `planned calls: N, about T input tokens`. N and T come from the local plan, the way supercov's line does, with no dollar amount until a local price table exists. **Printed kill:** on a dry run, N differs from the requests that would be sent.

### F3. Question 7: the narrative pass did not find 20 rejected-P0 rows

Search, read-only, `followlinks` false, OSError skipped. Scope: `iteration-*.md` under a path containing both `/review/` and `/iterations`. Files: 3,271.

Phrases and counts:

| Phrase | Count |
|---|---|
| `downgraded from P0` | 0 |
| `from P0 to P1` | 1 |
| `from P0 to P2` | 1 |
| `retracted from P0` | 1 |
| `P0 was retracted` | 1 |
| same-line severity field `P0` and `finalSeverity` `P1` or `P2` | 0 |

The `from P0 to P2` line and the retraction line are the same quoted changelog sentence inside a source dump at `specs/system-deep-loop/z_archive/009-deep-loop-parallel-fanout/008-deep-review/review/iterations/iteration-002.md:2374`. It describes another review. It is not a claim-adjudication of a finding in that file. The `from P0 to P1` line is a focus heading that asks the reviewer to look for counterevidence (`specs/system-skill-advisor/z_archive/004-skill-graph/001-skill-graph-metadata-routing-boosts/review/review_archive/gen1-2026-04-13/iterations/iteration-017.md:4`). No downgrade is recorded there.

`finalSeverity` values of `P1` that this pass opened are findings that stayed `P1`, with a `downgradeTrigger` about a possible later drop. Those are not rejected P0s. Example shape: `specs/system-speckit/z_archive/023-hybrid-rag-fusion-refinement/012-memory-save-quality-pipeline/review/iterations/iteration-005.md:46`.

BASE says the transition corpus has 0 P0 downgrades (not reopened here) and that a seat reported 41 of 4,236 iteration files with downgrade wording and false positives in a sample. This pass used a different file set (3,271, not 4,236) and a stricter phrase list. It does not confirm the 41. It does show that a strict reading yields **0** usable labeled negatives. The promote bar BASE names is 20. **Printed result:** `r10 not promoted: narrative_p0_negatives=0`. R10 stays later. jev-review's screen-at-0.7 then follow-8 funnel (`config.ts:5`, `:15`) is a different product. It does not manufacture those negatives.

### Adopt or anti-pattern

| Pattern | Where | Under the key gate |
|---|---|---|
| Prefix before the credential name | Gap at `secret-scrubber.ts:128` and `opencode-goal.js:474` | Adopt as a local scrub. Runs with no key. Not a judgment. |
| Refuse secret-named path segments | `fs-source-reader.ts:16-33` | Already the right behavior for `.env`. Does not catch the two assignment strings inside `app.ts`. |
| Log counts before the billed loop | `workflow.ts:47`, `:77` | Adopt the print. Do not adopt the silent slice at 8. |
| Estimate line before send, dry-run sends nothing | `docs/quality.md:191-195`, `:215-216` | Adopt the line shape without the vendor's dollar example. |
| Throw when the body does not fit, save nothing | `jev.ts:95-96`, `budget.ts:75-78` | Adopt. |
| `clampText` writes `...` | `opencode-goal.js:388` | Anti-pattern for a Jev prompt. |
| Answer cache under `.supercov/quality/requests/` | `docs/quality.md:197-199` | Anti-pattern for R1 reruns. Zeroes flip rate. |
| Missing answer as probability 0 | `provider.ts:119` | Anti-pattern. Confirms iteration 3. The transport throws instead, which is the part to copy. |

## Per-idea records

### N-grok-04-1

| Field | Record |
|---|---|
| **Idea** | `N-grok-04-1`. Let the credential-name class match after a word-character prefix. Type: none. No judgment. |
| **Builds on** | The two local regexes. Question of whether claude-jev's path rule covers them. |
| **Value** | An assignment of the Jev key's own env name, or of `SERVICE_TOKEN`, no longer survives into a prompt. |
| **Seam** | `secret-scrubber.ts:128`. The goal plugin's copy is `opencode-goal.js:474`. |
| **Metric, baseline, harness** | The four-row boolean check above. Baseline: both prefixed rows false. Harness: that check, with a stand-in value, asserted in the existing scrubber tests if they already load the regex. |
| **Cost, latency, privacy** | No call. The scrub runs locally on the no-key path too. |
| **Key gate and no-key behavior** | No switch. Redaction is not a Jev feature. No key: still redact, still no call. |
| **Rough LOC** | A prefix group on two expressions, on the order of 10 lines, plus the boolean check. |
| **Verdict** | build-now, as a precondition of any later arm that sends text. |
| **Confidence** | The four booleans were printed by running the expressions. The surrounding call sites were not all re-traced. |

### N-grok-04-2

| Field | Record |
|---|---|
| **Idea** | `N-grok-04-2`. Print `planned calls: N, about T input tokens`, then refuse with `jev arm skipped: budget` if the body does not fit. Type: none. The line gates a later `choice` or `noul`. |
| **Builds on** | R1's first billed call. supercov's estimate line. pi-jev's throw. |
| **Value** | The operator sees the bill before it starts, and a cut prompt is not sent. |
| **Seam** | Print shape: `docs/quality.md:195`. Throw: `jev.ts:96`. Truncate to refuse: `opencode-goal.js:388`. |
| **Metric, baseline, harness** | Dry-run N equals the request list length. Baseline UNKNOWN until an arm exists. |
| **Cost, latency, privacy** | The line is local. No call on skip. Prompt text leaves only after the three D5 checks. |
| **Key gate and no-key behavior** | The arm's own `--jev`. No key: one skip line, the planned-call line is not printed, because there is no plan to send. Exit 3 stops. Exit 4 and a malformed answer mark the row unmeasured (iteration 3). Python exit 2 stops the arm. |
| **Rough LOC** | A print and a budget branch, on the order of 40 lines, inside the arm that first calls. |
| **Verdict** | next, attached to R1, not its own phase. |
| **Confidence** | The vendor lines were opened. No dry run of a local arm exists. |

### R10

| Field | Record |
|---|---|
| **Idea** | R10 stays later. No new judgment type. |
| **Builds on** | BASE's promote bar of 20 narrative negatives. Question 7. |
| **Value** | Unchanged, and unavailable until the gold exists. |
| **Seam** | `completion-criteria.md:63` states the duty. The narratives searched did not discharge it as labeled rows. |
| **Metric, baseline, harness** | `narrative_p0_negatives=0` on 3,271 files under the phrase list above. |
| **Cost, latency, privacy** | Zero calls. The mining pass read files only. |
| **Key gate and no-key behavior** | Not built, so the no-key path is today's path. |
| **Rough LOC** | None in this round. |
| **Verdict** | later. |
| **Confidence** | The phrase counts were printed by the walk. A looser wording search would find more files and more false positives, which is what BASE already says a seat reported. This pass did not repeat that looser search. |

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| `TYPESAFE_API_KEY=` and `SERVICE_TOKEN=` miss both local assignment regexes | new | Printed booleans against `secret-scrubber.ts:128` and `opencode-goal.js:474` |
| claude-jev's path rule does not catch those strings inside a normal source file | new | `fs-source-reader.ts:16-33`; path check printed false for `app.ts` |
| A planned-call line already exists in two vendors, and one of them throws instead of truncating | new | `quality.md:191-195`, `jev.ts:95-96`, `budget.ts:75-78`, `opencode-goal.js:388` |
| jev-review is not an R10 gold source | new | `workflow.ts:76-80`, `config.ts:5` |
| Narrative-mined P0 negatives under a strict phrase list | new count | 0 usable rows in 3,271 iteration files. The one retraction sentence is a quoted changelog at `iteration-002.md:2374` |
| Missing answer must not become 0 | confirms iteration 3 | `provider.ts:119` |
| Transition corpus has 0 P0 downgrades | restated, BASE says | Not reopened |

## Sources Consulted

- `.skilled/skills/system-spec-kit/shared/parsing/secret-scrubber.ts`
- `.opencode/plugins/opencode-goal.js`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/claude-jev-main/src/infrastructure/fs-source-reader.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/claude-jev-main/src/domain/budget.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-review-main/src/review/workflow.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-review-main/src/domain/config.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/src/provider.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/pi-jev-context-main/src/jev.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/supercov-main/docs/quality.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/supercov-main/crates/supercov-cli/src/quality/properties.json`
- `.skilled/skills/system-deep-loop/deep-review/references/protocol/completion-criteria.md`
- Archived `iteration-*.md` files under `specs/**/review/**/iterations/`, counted, not copied

## Assessment

newInfoRatio: 0.81. Seven rows, five new, one confirmation, one BASE restatement. Novelty justification: the boolean misses, the 0-row narrative count, and the refuse-versus-`...` pair are not in BASE's R10 paragraph. Confidence: high on the regex check and the phrase counts; the walk skipped unreadable paths and did not follow links, so a file behind a symlink is absent from the 3,271. Convergence is telemetry only.

## Reflection

What worked: running the expressions and counting phrases instead of trusting the seat's 41. What failed: the first pattern, `downgraded to P1`, matched P1 findings that stayed P1. Ruled out: adopting claude-jev's path refuse as the fix for the two assignment strings, and promoting R10 on this corpus.

## Recommended Next Focus

grok-05: contrarian build order and a printed kill for every build-now and next item.

## Hand-off

- R10 does not promote. `narrative_p0_negatives=0` under the strict list.
- The scrub change is build-now and has no Jev switch.
- The planned-call line is next, on R1's arm, and a non-fitting body skips rather than sending `...`.
- Question 21 is still UNKNOWN. mimo-01 still has no file.
