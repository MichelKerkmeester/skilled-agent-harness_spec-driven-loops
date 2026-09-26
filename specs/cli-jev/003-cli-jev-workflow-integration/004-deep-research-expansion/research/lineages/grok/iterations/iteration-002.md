# Iteration 2: grok-02 — Done gates and verification outside

## Focus

Angle `grok-02`. What the Pi post, npm `jevctl` `verify` / `screen` / `classify`, and claude-jev's review catalogue teach R2 and R20. Wave W1. Question 30 on R2's reshaping, and question 22 from the contrarian side.

## Sibling check

Independent: no round-2 sibling file read.

## Findings

### F1. The reported done gate judged a reply, not a stored goal and not a diff

The Pi thread's working numbers sit in one comment, not in the original post. The post itself is a model-routing pitch (`context/social posts/Reddit - I think i found the best use case for JEV and PI.md:9-17`). The done-gate sentence is: "a done gate sent a plan-only answer back (0.16) and passed a concrete one (0.90)" (`:1121`). That judges the assistant reply (plan-only versus concrete). It does not name a stored goal string and it does not name a diff. The same comment's other gates are routing and a shell guard (`:1121`). A different commenter wrote only "My implementation was a confidence and done ness verification" (`:974`) with no object named. Another comment proposes grading the last user message plus assistant replies (`:231`) and, separately, an optional goal prompt (`:235`) and a post-response choice among prompt-user, incomplete-continue, and poor-quality (`:239`). Those are proposals. The only reported done gate in the file judges the reply.

Claude Code's completion judge in this repository sees the stored string. `goal-set-string-playbook.md:55` says nothing dereferences a path inside an objective string, and "whatever judges completion sees only the stored string." The criteria are copied into that string for that reason (`:49-57`). A reply-level done gate and a stored-string judge are different instruments. The Pi numbers are a user report. They do not measure either of this repository's judges.

### F2. `jevctl verify` is claim-versus-evidence, so it maps to R2's later arm and not to R20

`buildVerifyRequest` throws if `claims` is empty or if `evidence` is empty (`src/core/verify.ts:46-47`). Each claim becomes a `choice` with three keys: `supports`, `contradicts`, `says_nothing` (`:57-63`). A missing choice becomes verdict `unknown` because `RELATION_TO_VERDICT` has no default (`src/lib.ts:54-58`, applied at `verify.ts:94`). Null confidence becomes action `review` (`src/lib.ts:63-65`). Confidence at or above `autoAccept` (default 0.8, `docs/verify.md:21`) is `auto`. The doc's own uses are a PR description against a diff, a report against sources, or a summary against a document (`docs/verify.md:11`), and the example pipes `git diff` (`:39`).

R20's first slice has no second document. Rules 4 and 5 are "three to seven self-contained criteria" and "checkable without opening another file" (`.skilled/skills/sk-doc/sk-create-goal/SKILL.md:121-122`). The lint's input is the criterion line. `verify` cannot run on that line alone. Pairing a criterion (claim) with the last reply or a diff (evidence) is R2's later shape: did this evidence support this claim. It is not an authoring lint.

`says_nothing` is the unsure band R2's cascade table should copy: the evidence does not address the claim (`verify.ts:62`), mapped to `unsupported` (`lib.ts:57`), and `--fail-on` can treat `unsupported`, `review` and `unknown` as failures (`docs/verify.md:22`). On npm `jevctl`, those conditions exit 2. On the Python `jev-cli` 0.6.2, exit 2 is a usage error. A port uses `jev choice` or `jev run` (the skill's surface), not `jev verify`, and a failed check prints `jev arm skipped: <check>` without a verdict.

claude-jev's review catalogue is a third shape, a finding filter: three `noul` questions and one `score`, dropped below `real` 0.5, dropped at `alreadyHandled` ≥ 0.7, demoted below `reachable` 0.4 (`src/domain/catalog/review.ts:21-27`, `judgeFinding` at `:91-100`). A missing `noul` throws `MissingAnswerError` (`src/domain/question.ts:76-80`). The skill says a `noul` near 0.5 means yes and no are equally likely, not "medium" (`skills/jev/SKILL.md:75`). That catalogue does not judge goal completion. BASE row 8 already drops live finding-drops. This iteration adds the threshold triple and the throw, and does not revive the row.

### F3. Thresholds and unsure bands R2's cascade should copy, and the defaults it should not

`classifier dev.md` is one line, the URL `https://classifier.dev/` (`context/external websites/classifier dev.md:1`). No cascade parameters live in that file. The npm `jevctl` code is the local source for bands:

Copy into R2's offline cascade table, as labels, not as live calls:

- `verify`: `says_nothing` → unsupported; missing choice → `unknown`; null confidence → `review`; `auto` only at confidence ≥ 0.8 (`lib.ts:63-65`, `docs/verify.md:21`).
- `classify` single: `action` is `review` when confidence is null or below `minConfidence`, default 0.6 (`src/core/classify.ts:130`, `docs/classify.md:32`). `--other` is an explicit nothing-fits key (`docs/classify.md:30`).
- `existsVerdict`: `answered` at ≥ 0.7, `absent` below 0.35, `partial` in between (`src/lib.ts:113-115`). `partial` is the middle band a binary met/not-met table erases.

Avoid, because a missing answer becomes a number:

- `runScreen` sets a missing injection `noul` to 0 (`src/core/screen.ts:56`). `screenRecommendation` then does not block (`src/lib.ts:86-91`). A transport failure looks like a pass. BASE row 9 already names this line. The new detail is the direction: 0 is the safe side of the injection gate, so the default hides a hijack.
- `runClassifyMulti` sets a missing `noul` to 0, and `applies` is `p >= threshold` (`src/core/classify.ts:177-178`). Default threshold 0.5 (`docs/classify.md:33`), so the label silently does not apply. Same defect, opposite direction from screen.

`screen` also has a real three-way on injection: block at 0.75, review at 0.25, and skip when substance or relevance is below 0.3 (`docs/screen.md:19-20`, `lib.ts:85`). That band is for untrusted text, not for goal criteria. Do not reuse `screen` as the goal cascade. The recommendation is advisory and the CLI "never blocks anything itself" (`docs/screen.md:33`).

The skill's "$0.042 per million" input price (`claude-jev-main/skills/jev/SKILL.md:93`) is a vendor claim. It is not a local cost.

### F4. Contrarian: the lint serves the judge that actually runs; R2's Jev arm serves a reply the native judge never sees

Side for the lint. The native completion judge sees the stored string (`goal-set-string-playbook.md:55`). Rules 4 and 5 are properties of that string (`SKILL.md:121-122`). A verifier arm on a reply or a diff cannot repair a criterion the stored-string judge cannot check. R20's lexical slice is the check that judge can use. Question 22's base rate still decides whether the *Jev* arm on top of the lint is worth building. This iteration did not draw the sample. The contrarian input to that question: a `verify` run of a criterion against its own text is the wrong measurement, because `says_nothing` means "the evidence does not address the claim" (`verify.ts:62`), and the evidence would be the claim.

Side for R2's zero-call slice. That slice is not a Jev call. BASE already confines the Jev arm and plugin mode to later, behind recorded OpenCode or Pi verifier use. The OpenCode heuristic judges `lastEvidence`, not the stored goal: short evidence, blocking language, truncation, missing completion signal, weak reference to the objective (`.opencode/plugins/opencode-goal.js:2202-2220`). Those are reply-side checks. They match the Pi comment's reply-level done gate more than they match the native stored-string judge. Whether anyone runs them is question 19, which this wave does not count. Until that count exists, R2's zero-call slice stays next and its Jev arm stays later. This iteration does not swap R20 and R2. BASE already ranks the lint ahead of the verifier (ranks 3 and 4). The new reason is F2: `verify` cannot be the lint.

**Kill, R20's Jev arm (printed).** `r20 jev arm not built: labeled_violation_rate<0.05` (BASE's stop rule, not re-measured here) or `r20 jev arm not built: command was jev verify`. The arm, if it is ever built, is the two `noul` questions BASE names, behind its own `--jev`, after the three D5 checks. `jev verify` is the wrong command because it requires evidence (`verify.ts:47`).

**Kill, R2's Jev arm (printed).** `r2 jev arm not built: no recorded OpenCode or Pi verifier use` until question 19 says otherwise, and `r2 jev arm not built: evidence is the stored goal string`. If the evidence is only the string the native judge already sees, the arm duplicates R20 and sends the goal off-machine for no new fact. A reply or a diff is a different payload and stays later, with the two redaction cases BASE already requires.

### Adopt or anti-pattern

| Pattern | Where | Under the key gate |
|---|---|---|
| `says_nothing` / `unknown` / null confidence → `review` | `verify.ts:57-63`, `:94`, `lib.ts:63-65` | Adopt as labels in R2's offline cascade. No call in the zero-call slice. |
| `classify` `review` below `minConfidence`, and `--other` | `classify.ts:130`, `docs/classify.md:30-32` | Adopt as the unsure label. Do not auto-accept. |
| `existsVerdict` `partial` between 0.35 and 0.7 | `lib.ts:113-115` | Adopt as the middle band a met/not-met table should keep. |
| `verify` claim plus a separate evidence item, including a diff | `verify.ts:46-47`, `docs/verify.md:11`, `:39` | Later, and only as R2's arm, behind `--jev`. Not R20. Not a merge gate (BASE row 32 stands). |
| Missing `noul` becomes 0 | `screen.ts:56`, `classify.ts:177` | Anti-pattern. A port throws, as claude-jev does (`question.ts:76-80`). |
| Per-turn "good response" grade | Pi post `:231` | Anti-pattern. Restates BASE row 7. |
| claude-jev `judgeFinding` drop at 0.5 | `review.ts:91-92` | Anti-pattern as a live severity writer. Thresholds may inform a later review arm only. BASE row 8 stands. |
| npm `--fail-on` exit 2 | `docs/verify.md:22`, `docs/screen.md:21` | Anti-pattern on the Python package, where exit 2 is usage. |

## Per-idea records

### N-grok-02-1

| Field | Record |
|---|---|
| **Idea** | `N-grok-02-1`. R2's cascade table copies `unknown`/`review`/`partial` and refuses a missing-answer 0. Type of the later arm stays `noul` per criterion, not npm `verify`'s `choice`, unless a reply is the evidence. |
| **Builds on** | R2. BASE's offline cascade table. Question 30. |
| **Value** | A heuristic "unsure" stays unsure instead of becoming `not_met` or a fake probability. |
| **Seam** | `src/lib.ts:63` and `:113`. Local heuristic: `.opencode/plugins/opencode-goal.js:2202`. |
| **Metric, baseline, harness** | Share of rows the cascade labels `review` or `partial`. Baseline UNKNOWN until R2's zero-call slice. Harness is that slice. |
| **Cost, latency, privacy** | Zero while the table is offline. A later `choice` sends the claim and the evidence. |
| **Key gate and no-key behavior** | The table has no switch. The Jev arm's switch is `--jev`. Failed D5 check, exit 3, exit 4, malformed choice: print `jev arm skipped: <reason>` and keep the heuristic label. Never fill a probability with 0. |
| **Rough LOC** | A few dozen lines inside the proposed R2 scorer. Not a new package. |
| **Verdict** | next, as part of R2's zero-call slice. |
| **Confidence** | Bands confirmed in npm `jevctl` source. The local row share is uncounted. |

### N-grok-02-2

| Field | Record |
|---|---|
| **Idea** | `N-grok-02-2`. Do not implement R20 or R2 by shelling npm `jevctl verify`. Type: not a judgment; a command ban. |
| **Builds on** | R20 and R2. `docs/verify.md:11`. |
| **Value** | Avoids a command that exits 2 for judgment reasons on one package and for usage on the other, and that cannot lint a criterion with no evidence. |
| **Seam** | `src/core/verify.ts:46`. |
| **Metric, baseline, harness** | A stub `jev` logs no `verify` argv. Baseline: the command is absent from `.skilled/skills/cli-jev/cli-usage/SKILL.md` (confirmed in iteration 1). |
| **Cost, latency, privacy** | None if banned. |
| **Key gate and no-key behavior** | No path invokes it, with or without a key. |
| **Rough LOC** | Zero. A test that argv does not contain `verify`. |
| **Verdict** | drop, as a command. The underlying claim-versus-evidence shape stays inside N-grok-02-1. |
| **Confidence** | Confirmed from source. |

### R20

| Field | Record |
|---|---|
| **Idea** | R20 lexical lint, then a later two-`noul` arm. The lint is not `verify`. |
| **Builds on** | BASE R20. Question 22, unanswered here. |
| **Value** | The stored-string judge (`goal-set-string-playbook.md:55`) gets criteria that are self-contained (`SKILL.md:121-122`). |
| **Seam** | Authoring rules at `SKILL.md:121`. The runner line BASE cites (`create-goal-auto.yaml:221`) was not reopened. |
| **Metric, baseline, harness** | BASE's labeled violation rate. This iteration adds no rate. Stop remains under 5%. |
| **Cost, latency, privacy** | Lint: zero calls, committed text. Jev arm: later, criterion text only. |
| **Key gate and no-key behavior** | Lint has no key. Arm: own `--jev`, three D5 checks, skip line `jev arm skipped: <check>`, `check-goal.cjs` exit codes unchanged (BASE, not re-tested). |
| **Rough LOC** | Unchanged from BASE's 120–200 for the lint. |
| **Verdict** | next. Rank stays ahead of R2's Jev arm. |
| **Confidence** | The judge's input and the evidence requirement are confirmed. The base rate is still disputed (BASE D5). |

### R2

| Field | Record |
|---|---|
| **Idea** | R2 zero-call slice stays next. The Jev arm stays later and must not verify the stored string alone. Type of the later arm: `noul` or, if a reply is attached, the `choice` in F2. |
| **Builds on** | BASE R2. Question 30. Question 19 left open. |
| **Value** | Measures the OpenCode heuristic on `lastEvidence` (`opencode-goal.js:2202-2220`) before any call. |
| **Seam** | `opencode-goal.js:2202`. Vendored analogue: `verify.ts:57`. |
| **Metric, baseline, harness** | BASE's heuristic error rates. New label from N-grok-02-1: count `review`/`partial` instead of forcing `not_met`. |
| **Cost, latency, privacy** | Zero-call slice sends nothing. Later arm sends reply text, which is the high class relative to criterion text, and still needs the two redaction cases. |
| **Key gate and no-key behavior** | Own switch, separate from R20's. No key: heuristic only, one line that the Jev arm did not run. Exit 3, 4, malformed: skip line, heuristic stands. |
| **Rough LOC** | Not resized. The cascade labels are a small addition to the scorer BASE already proposes. |
| **Verdict** | next for the zero-call slice. Later for the Jev arm. |
| **Confidence** | Reply-versus-string split is confirmed. Verifier-in-use is UNKNOWN. |

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| The Pi post's reported done gate judged a plan-only versus concrete reply | new | Pi post `:1121`. The post body (`:9-17`) is routing |
| Native completion sees only the stored string | confirms BASE with new evidence | `goal-set-string-playbook.md:55`, opened this iteration |
| `jevctl verify` requires evidence and cannot lint a criterion alone | new | `verify.ts:46-47` |
| Unsure bands to copy: `unknown`/`review`, `--other`, `partial` between 0.35 and 0.7 | new | `lib.ts:63-65`, `:113-115`, `classify.ts:130`, `docs/classify.md:30-32` |
| Missing injection `noul` becomes 0 and then passes | confirms BASE row 9 with the direction | `screen.ts:56`, `lib.ts:86-91` |
| `runClassifyMulti` also fills a missing `noul` with 0 | new | `classify.ts:177-178` |
| `classifier dev.md` holds only a URL | confirms BASE | `classifier dev.md:1` |
| R20 stays ahead of R2's Jev arm | confirms BASE with new evidence | F2. Ranks not swapped |
| Per-turn good-response grade | restated | Pi post `:231`. BASE row 7 |

## Sources Consulted

- `specs/cli-jev/003-cli-jev-workflow-integration/context/social posts/Reddit - I think i found the best use case for JEV and PI.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/docs/verify.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/docs/screen.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/docs/classify.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/src/core/verify.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/src/core/screen.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/src/core/classify.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/src/lib.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/claude-jev-main/src/domain/catalog/review.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/claude-jev-main/src/domain/question.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/claude-jev-main/skills/jev/SKILL.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external websites/classifier dev.md`
- `.skilled/skills/sk-doc/sk-create-goal/SKILL.md`
- `.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md`
- `.opencode/plugins/opencode-goal.js`

## Assessment

newInfoRatio: 0.72. Nine rows, five new, three confirming with a file opened here, one restated. Novelty justification: `verify` cannot be the authoring lint, and the unsure bands plus the classify-multi zero default are mechanisms BASE's cascade sentence does not cite. Confidence: high on control flow; question 22's rate and question 19's usage count were not produced. Convergence is telemetry only.

## Reflection

What worked: separating the three objects a done gate might see (stored string, reply, diff) and matching each to a command that actually requires that object. What failed: looking for a done gate in the Pi post body; it is a comment. Ruled out: shelling `jev verify` for R20; copying `screen`'s 0 default; treating `:231` as a new grade product.

## Recommended Next Focus

grok-03: routing and ranking outside, against R1 and R21. Read sibling iterations first.

## Hand-off

- Question 22's base rate is still open. Do not invent one in grok-03.
- Question 19's verifier-in-use count is still open. R2's Jev arm stays later until a sibling counts records.
- The cascade labels to carry forward are `unknown`, `review`, and `partial`. The banned default is a missing `noul` stored as 0.
- npm exit 2 remains a judgment gate on `verify` and `screen`. Python exit 2 remains usage.
