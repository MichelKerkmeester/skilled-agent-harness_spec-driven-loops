# Phase 007 — Live LLM-judge release-gate demo

> **PROVISIONAL SIGNAL — NOT the human non-inferiority study.** This run uses a real
> LLM (DeepSeek V4 Flash) as the reviewer. The framework permanently stamps such
> results `evidenceClass: 'llm-proxy'` / `isProvisional: true`, and
> `assertHumanCertifiable()` refuses to certify a release on this evidence. A real
> release still requires the operator-run powered blind **human** study (>=3
> independent reviewers, pre-registered protocol, frozen margins).

## What ran

A real DeepSeek V4 Flash judge scored two blind comparison pairs on the four
evaluation dimensions (directness, fluency, meaning-preservation, reference-likeness),
0-10, with no knowledge of which text was the reference and which the candidate.
Dispatch: `opencode run --model deepseek/deepseek-v4-flash --variant high`
(prompt in `judge-prompt.txt`, raw output in `deepseek-judge.log`, scores in `scores.json`).

## Real scores returned

| Comparison | Dimension | A | B |
|---|---|---|---|
| 1 (A=fluent prose, B=terse) | directness | 8 | 9 |
| | fluency | 9 | 5 |
| | meaning-preservation | 9 | 9 |
| | reference-likeness | 8 | 4 |
| 2 (A=terse, B=fluent prose) | directness | 9 | 7 |
| | fluency | 8 | 9 |
| | meaning-preservation | 8 | 9 |
| | reference-likeness | 7 | 9 |

The judge discriminates meaningfully: the fluent, careful prose scores higher on
fluency and reference-likeness, the terse form higher on directness — not a constant
rating. This is a genuine LLM judgment, captured verbatim, never fabricated.

## How it connects to the framework (already built + tested)

`src/evaluation/proxy-judge.ts` accepts exactly this shape of per-dimension A/B scores
through an injected scorer, unblinds only the numbers, and produces
`BlindReviewerRating`s tagged `evidenceClass: 'llm-proxy'`. Those flow through the same
`evaluateReleaseGate` -> `createReleaseReport` pipeline the human study uses (proven
end-to-end in `test/evaluation/integration.test.ts`), and every resulting decision and
report is marked provisional. The non-inferiority statistics are identical whether the
ratings are labeled human or proxy — only the provenance and the provisional flag differ.

## Scope of this demo

- Real LLM judge: yes (DeepSeek, live).
- Two comparisons, one reviewer pass: a demonstration, not the powered study.
- The full >=3-reviewer, pre-registered, stratified pipeline is verified by the
  framework's own tests; the operator runs the real human study to produce release evidence.
