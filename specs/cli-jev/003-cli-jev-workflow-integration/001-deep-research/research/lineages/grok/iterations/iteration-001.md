# Iteration 1: grok-01 — Grading AI responses, outside patterns and the case against

## Focus

What the vendored integrations and the Pi post learned about grading with Jev, and when a grade is worse than no grade. Focus Area is `grok-01`. This iteration stays on that angle. The two packages stay named apart: the Python `jev-cli` that `.skilled/skills/cli-jev/cli-usage/` wraps, and the npm `jevctl` 0.2.3 vendored under `context/external repo's/jev-cli-main`. No live `jev` call was made.

## Actions Taken

Opened the claude-jev review catalogue and its published planted-finding example, the supercov quality write-up, the Pi post's done-gate comment, and this repository's D4 grader factory. The measurement digest's "baseline UNKNOWN" sentence is quoted as that digest's claim. It was not re-derived from a recorded agreement run.

## Findings

A grade that drops a finding before a person reads it is a policy decision sitting on a probability. claude-jev keeps that policy in code. `judgeFinding` drops when `real` is under 0.5, drops when `already_handled` is at least 0.7, demotes when `reachable` is under 0.4, and otherwise keeps, ranked by a `score` severity. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/claude-jev-main/src/domain/catalog/review.ts:21-28] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/claude-jev-main/src/domain/catalog/review.ts:78-100]

The published run shows why a near-threshold keep is worse than silence. `ceiling_bypass` was a real bug (`real` 0.92) and was fixed. `symlink_escape` was correctly dropped (`real` 0.25). `stale_end_line` was a planted false positive and Jev kept it at 0.57, just over the 0.5 line. The README states the consequence in its own words: the filter removes noise, it does not certify truth, and a value near the threshold is a weak signal you still have to read yourself. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/claude-jev-main/README.md:67-93]

A `noul` answer has no confidence field. A value near 0.5 means yes and no are about equally likely. It does not mean medium intensity. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/claude-jev-main/README.md:36-45]

Extra context can move a harmless case across a gate. A third-party comment on the Pi post reports a done gate that sent a plan-only answer back at 0.16 and passed a concrete one at 0.90, and a shell guard that scored `cat` at 0.22 on the command alone and 0.58 when the user request was passed alongside it, which blocked the harmless command. That report is a comment, not a measurement in this repository. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/social posts/Reddit - I think i found the best use case for JEV and PI.md:1121]

The same thread also proposes a yes/no grade of the last assistant reply, shown in the UI with a confidence score. That shape asks Jev for a confidence a `noul` does not return, and it grades "was this a good response" without an oracle. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/social posts/Reddit - I think i found the best use case for JEV and PI.md:231-232]

Supercov shows a different grade: twelve yes/no smell questions per file, with the mean computed by the command, not by the model. Snapshots can be read later with no key. `--dry-run` sends nothing. A content cache means a second run pays only for files that changed. The published prices ($42 per billion input tokens, about $0.0005 per changed file) are vendor claims in that document, not a measurement here. This catalogue grades source smells. It does not grade a model's output against an oracle. [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/supercov-main/docs/quality.md:1-8] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/supercov-main/docs/quality.md:35-36] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/supercov-main/docs/quality.md:177-203]

This repository already has a pluggable grader, and it already refuses to treat a missing grader as a real judgment in one branch and does the opposite in another. `buildGraderFn` accepts `llm`, `mock` (the default), or `noop`. `noop` returns score 1.0 and confidence 1.0 with the rationale "grader disabled". A failed `llm` or `mock` call returns score 0.0. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:197-224]

The harness that `llm` uses is Claude-only, with a 120 second dispatch timeout, and it caches by hash. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:8-14] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:42-44]

The runner already requires a different-family grader. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:16-18]

The Python `jev-cli` exit table, which is the package `cli-usage` wraps, says exit 0 is a judgment, exit 3 is a missing or rejected credential, and exit 4 is retryable transport that must never be read as a judgment. Exit 2 is a usage error and spends no quota. [SOURCE: .skilled/skills/cli-jev/cli-usage/SKILL.md:167-174]

The measurement digest claims the grader-agreement baseline on H9 is UNKNOWN, and that the best seam for a grade of model output is a `jev` grader kind beside `llm`, `mock` and `noop`. That sentence is the digest's claim. This iteration did not reopen a recorded agreement number, because the digest says none was found.

### Idea: shadow `noul` on D4, Python `jev-cli`

| Field | Content |
|---|---|
| **Idea** | Add a `jev` kind to `buildGraderFn` that asks the Python `jev-cli` a `noul`: the shown model output contains the defect or mismatch the fixture names. Record the probability beside the existing grader. Do not change `weightedScore` until a shadow run says so. |
| **Value** | The benchmark operator can see whether a different-family numeric judge agrees with the hidden oracle, on the same outputs the Claude grader already sees. |
| **Seam** | `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:207` |
| **Metric, baseline, harness** | Agreement with the fixture's expected verdict. Baseline is UNKNOWN. The measurement digest states that no recorded grader-versus-oracle agreement was found. Harness H9 (`run-benchmark.cjs`, `--grader` selector). |
| **Cost, latency, privacy** | One Python `jev-cli` call per graded output. The state that leaves the machine is the candidate text plus the question. The existing grader timeout is 120 seconds (`harness.cjs:44`), so a shadow call fits that budget. The ~150 ms and $0.042 per million input tokens in the claude-jev README are vendor claims. |
| **Opt-in and no key** | Switch is `--grader=jev`, default stays `mock`. With no key the Python `jev-cli` exits 3. The caller records `parse_status: skipped-no-key` and does not invent a score. It does not copy `noop`, which returns 1.0. |
| **Complexity** | About 60 lines in `score-model-variant.cjs` and a small argv builder. `harness.cjs` stays Claude-only. |
| **Verdict** | later. The factory is the right seam, and the planted 0.57 keep shows a live drop is not earned until the shadow run beats the oracle. |
| **Confidence** | Confirmed from code for the factory, the exit table, and the claude-jev thresholds. The agreement gain is inferred. A shadow run of H9 reviewer fixtures would confirm it. |

### Idea: live drop when `real` is under 0.5

| Field | Content |
|---|---|
| **Idea** | Use a Python `jev-cli` `noul` the way `judgeFinding` does, and drop a review finding or a benchmark dimension before a person reads it. |
| **Value** | Fewer false positives in the operator's queue, if the threshold is calibrated. |
| **Seam** | The tempting local site is the D4 score that already feeds `weightedScore` (`.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:26-27`). The outside policy is `judgeFinding` (`review.ts:91-99`). |
| **Metric, baseline, harness** | False-positive rate against planted findings. The only published point is one planted keep at 0.57. Baseline in this repository is UNKNOWN. Harness would be H9 only after a gold set of planted findings exists. |
| **Cost, latency, privacy** | Same call as the shadow idea, plus a wrong drop that hides a real defect. |
| **Opt-in and no key** | There is no honest default. A missing key must not drop and must not keep. Today's `noop` path scores 1.0, which would silently pass. |
| **Complexity** | Small at the factory, large in every consumer that treats the number as a decision. |
| **Verdict** | drop. A grade that removes an item at 0.57 kept a planted false positive, and a grade that removes an item under 0.5 will drop real bugs the same way. |
| **Confidence** | Confirmed from the published claude-jev run. Whether this repository's findings sit near 0.5 is inferred. |

### Idea: yes/no "good response" or done-gate on the last assistant turn

| Field | Content |
|---|---|
| **Idea** | A Python `jev-cli` `noul` after each assistant reply: was this a good response, or is the task done. |
| **Value** | The operator, or the loop, would retry or stop without reading the reply. |
| **Seam** | No local hook was opened for this angle. The pattern lives in the Pi thread (`Reddit - I think i found the best use case for JEV and PI.md:231` and `:1121`). Putting it on D4 would reuse `score-model-variant.cjs:207` for the wrong question. |
| **Metric, baseline, harness** | None. "Good" has no oracle in that post. The done-gate numbers (0.16 and 0.90) are a single anecdote. |
| **Cost, latency, privacy** | One call per assistant turn. The full reply leaves the machine. The cat example shows that adding the user request beside the thing being judged can flip the gate. |
| **Opt-in and no key** | The post treats it as optional. With no key the loop must keep today's behavior, which is to show the reply. |
| **Complexity** | A hook plus a prompt. The judgment itself is one `noul`. |
| **Verdict** | drop. It asks a vague question, it wants a confidence `noul` does not return, and the same thread shows context can push a harmless case over a threshold. |
| **Confidence** | Confirmed as a proposal in the post. Not confirmed as useful here. |

## Sources Consulted

- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/claude-jev-main/src/domain/catalog/review.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/claude-jev-main/README.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/supercov-main/docs/quality.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/social posts/Reddit - I think i found the best use case for JEV and PI.md`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs`
- `.skilled/skills/cli-jev/cli-usage/SKILL.md`
- Measurement digest H9, quoted as the digest's claim for the UNKNOWN baseline

## Assessment

newInfoRatio: 1.0

Novelty justification: First iteration of this lineage. The thresholds, the planted keep, the noop-as-1.0 path, and the context-steer anecdote were not yet in the lineage record.

Confidence: high on the outside catalogue and on the local grader factory. Low on whether a shadow `jev` kind would beat the Claude grader. That number does not exist yet.

Convergence is telemetry only (`convergenceMode: off`). The ratio does not stop the loop.

## Reflection

What worked: reading the verdict function beside the published numbers. The 0.57 keep is the kill story, and `noop` returning 1.0 is the local trap that matches it.

What failed: supercov's twelve smell questions do not answer "grade this model's output." Treating them as an RQ1 design wasted the comparison until that mismatch was named.

Ruled out: a live drop-before-read, a per-turn "good response" `noul`, and copying `noop`'s 1.0 as the no-key behavior of a Jev grader.

## Recommended Next Focus

`grok-02`: the boldest Jev role in skill routing, and why suggestion-only or nothing might beat it.

## Hand-off

- Kill criterion for any grading idea: on H9 reviewer fixtures, a shadow Python `jev-cli` `noul` agrees with the hidden oracle no better than the existing `llm` grader, or three reruns flip more often than the stability check allows. Either result drops grading.
- A keep or drop band around 0.5 to 0.7 stays human-read. The planted finding passed at 0.57.
- Judge the artifact alone. The cat anecdote flipped from 0.22 to 0.58 when the user request was added.
- Do not copy `noop`'s score of 1.0 as the missing-key path.
- npm `jevctl` exit codes are still unopened. Any later claim about `jev` on PATH has to say which binary.
