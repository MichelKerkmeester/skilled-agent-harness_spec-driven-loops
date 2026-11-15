# Review brief: gate DeepSeek cache-compat advice on a declared wire format

You are an adversarial reviewer. Your job is to find what is wrong, unsupported or
overclaimed in the change described here — not to praise it, and not to rewrite it.

## Read-only contract (hard)

- You are a **read-only reviewer**. Do not create, edit, move or delete any file.
- Do not dispatch any other CLI or agent. You are the terminal reviewer.
- Do not run commands that mutate state. You may read files.
- Print your findings to stdout. That is your only deliverable.
- Distinguish **verified** (you read it in a file) from **inferred** (you reasoned it) from
  **unknown** (you could not check). Never present an inference as a verified fact.

## What is under review

Commit `80576ef8aa` in this repository — "fix(pi-cache-optimizer): require a declared wire
format before giving DeepSeek compat advice".

- `review/change-under-review.diff` — the full diff for the code and config files.
- `.pi/extensions/pi-cache-optimizer/index.ts` — the extension (the changed regions are the
  `describeMissingDeepSeekCompat`, `isDeepSeekWireCompatApplicable`,
  `isDeepSeekCompatCheckApplicable`, `describeMissingCacheCompatForModel`,
  `buildDeepSeekCompatSuggestion` and `appendDeepSeekCompatAdviceLines` functions).
- `.pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts` — the extension's test suite
  (`describe('DeepSeek compat classification')` and the `/cache-optimizer fix` command test).
- `.pi/models.json` — the `llmgateway` provider entry.
- `specs/hooks/021-compat-opt-in-and-image-declaration/` — the change's own spec packet:
  `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, and `scratch/` evidence.

## The claims being made

Judge each one. Say whether the reviewer can confirm it from the repository.

1. The DeepSeek-specific compat advice can no longer fire on a model name alone; applicability
   now requires an explicit effective `compat.thinkingFormat: "deepseek"`.
2. `thinkingFormat` is never reported as missing, never suggested, and never written by
   `/cache-optimizer fix`.
3. Session affinity keeps its explicit-`false` opt-out, and moving it to the generic proxy path
   loses no advice for an opted-in channel.
4. The tests that pinned the old behavior were updated, and the new tests are not vacuous —
   i.e. they would fail against the pre-change code.
5. `models.json` declares `sendSessionAffinityHeaders` for the provider and
   `input: ["text","image"]` for the DeepSeek entry, and both were proven live before being
   written (see `scratch/live-affinity-probe.md`, `scratch/live-image-probe.md`).
6. The verification harness (`scratch/verify-no-warning.mjs`) exercises the real notification
   path and its positive controls would catch a silent detector
   (see `scratch/verify-no-warning.txt`).
7. `scratch/check-run.txt` supports its claim that the full check suite passed.

## Specific questions to answer

- Is `isDeepSeekWireCompatApplicable()` the right applicability set? It uses
  `isOpenAICompatibleProxyApi(model.api)` where the previous predicate used
  `isOpenAICompatibleApi(model.api)`. Does that change behavior for a DeepSeek-named model on
  `openai-responses`, on an official OpenAI base URL, or on a built-in llama.cpp model — and is
  the change defensible?
- Affinity moved from the DeepSeek branch to the generic path. Trace every caller of
  `describeMissingDeepSeekCompat`, `describeMissingCacheCompatForModel`, `buildFixSuggestion` and
  `buildCompatDiagnosis` and say whether anything now under- or over-reports.
- The DeepSeek adapter's `warningText` returns `undefined` early when the check does not apply.
  What does an operator lose by that short-circuit, and where else can they see it?
- Is any code left inconsistent — for example provider-placement safety rules that still
  special-case `thinkingFormat`, or repair logic that still mentions it?
- Are the new assertions meaningful? Look for assertions that pass for the wrong reason,
  especially around `assert.deepEqual` with an empty list.
- Does the probe evidence actually support the two config declarations? Is the image probe's
  ground truth trustworthy? Does the affinity probe prove what the summary says it proves — no
  more and no less?
- The packet's `implementation-summary.md` lists known limitations. Is anything missing from
  that list — a real limitation the author did not notice?
- Any correctness, safety or scope problem not covered by the questions above.

## Output format

```
## Verdict
<one line: the strongest objection you can substantiate, or "no substantive objection">

## Findings
### F1 — <severity: blocker|major|minor|nit> — <title>
- Claim: <what is wrong>
- Evidence: <file:line, or the diff hunk, or the probe file you read>
- Basis: verified | inferred | unknown
- Why it matters / what you would do instead

## Claim-by-claim
<CLAIM-1..CLAIM-7>: confirmed | partly confirmed | not confirmed — <one line of evidence>

## What I could not check
<explicit unknowns; say "nothing" if there are none>
```
