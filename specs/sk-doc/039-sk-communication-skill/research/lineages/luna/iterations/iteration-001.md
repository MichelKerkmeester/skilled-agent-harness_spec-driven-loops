# Iteration 1: Pipeline mechanics and the quality ceiling

## Focus

Trace the real path from assembled source text to protected provider input, local restoration, deterministic fidelity checks, and optional semantic judging. The selected angle is the mechanism behind the reported modest DeepSeek rewrites.

## Actions Taken

- Read the standalone skill contract and the package's core, context, fidelity, provider, and prompt surfaces.
- Inspected the protected-span dialect and restoration invariants with exact line anchors.
- Ran a read-only package probe using `protectMarkdown` on representative CLI prose to measure token inflation and span counts.

## Findings

1. The protection policy is broader than paths, numbers, codes, and secrets: the dialect also protects headings, fenced/indented code, commands, list markers, links, URLs, flags, hashes, multiword capitalized identifiers, camelCase, snake_case, dotted identifiers, and all-caps identifiers. `collectProtectedRanges` collects block ranges first and then many inline patterns, while overlapping ranges are discarded after the first accepted range. [SOURCE: packages/cli-communication-projection/src/fidelity/dialect.ts:23-53,134-243,246-288]

2. Every accepted span becomes an opaque 48-character token containing namespace, ordinal, and a digest prefix; the encoded message is rebuilt as prose plus those tokens. A read-only probe showed a 95-character sentence with five protected values becoming 270 characters, with five 48-character tokens. The model therefore has to preserve a long exact token sequence even when the protected values are semantically unrelated. [SOURCE: packages/cli-communication-projection/src/fidelity/protected-spans.ts:70-114,396-415] [INFERENCE: the measured inflation plus the exact token format explains why a small model has less usable context and more copying burden]

3. Restoration is intentionally unforgiving: duplicate, changed, unexpected, missing, or reordered tokens all return a rejection; only after the full ordered set passes are the original bytes restored locally. This is the correct privacy/fidelity invariant, but it means token granularity directly trades off against model usability rather than allowing a partial repair. [SOURCE: packages/cli-communication-projection/src/fidelity/protected-spans.ts:117-181,183-217]

4. The wire prompt is a single system instruction plus one user message containing the entire encoded text. The reference-like profile asks for simpler English, every fact/name/number/path, short sentences, unchanged fenced code, and output-only rewriting, but it supplies no token inventory, section schema, rewrite rubric, or few-shot before/after examples. [SOURCE: packages/cli-communication-projection/src/providers/adapters.ts:96-100] [SOURCE: packages/cli-communication-projection/test/fixtures/prompt-profiles.json:13-56]

5. The validator is fail-closed and staged: source digest, provider terminal state, completeness, output size, placeholder restoration, refusal/truncation, Markdown structure, deterministic semantic vetoes, and only then an optional reject-only judge. `judgeMode: required` fails exact-original when the judge is missing or rejects, while the normal test helper defaults it to `disabled`. That makes the judge an explicit integration choice, not an automatic meaning-preservation guarantee. [SOURCE: packages/cli-communication-projection/src/fidelity/validator.ts:113-172,183-244] [SOURCE: packages/cli-communication-projection/test/fidelity/helpers.ts:46-60]

6. The semantic layer is a narrow deterministic veto, not a readability or meaning score: it compares counted numbers/entities plus lexical buckets for polarity, requirement strength, priority, uncertainty, caveats, and directives, then returns the first mismatch. A rewrite can be unchanged and pass, or change prose in ways outside those signatures and still pass; the reported unchanged output and prose artifact are therefore not contradicted by this gate. [SOURCE: packages/cli-communication-projection/src/fidelity/semantics.ts:61-107,121-179] [INFERENCE: a reject-only semantic veto cannot select the clearest candidate or reward a better paraphrase]

## Ruled Out

- Treating the fidelity validator as a quality evaluator: its contract is acceptance/fallback, and the semantic comparator is deliberately content-free and veto-oriented.
- Relaxing token order/count checks: the exact restoration contract depends on those checks and the user request explicitly preserves the privacy and fidelity invariants.

## Dead Ends

- No implementation changes were attempted; the package and skill were read-only research inputs.

## Edge Cases

- Ambiguous input: the supplied smoke result is treated as an observation, not as a benchmark statistic.
- Contradictory evidence: none found in this iteration.
- Missing dependencies: no live provider call was needed; the local package probe was sufficient to measure token inflation.
- Partial success: all selected source surfaces were available.

## Sources Consulted

- [SOURCE: .opencode/skills/sk-communication/SKILL.md:117-160]
- [SOURCE: packages/cli-communication-projection/src/fidelity/dialect.ts:23-53,134-243,246-288]
- [SOURCE: packages/cli-communication-projection/src/fidelity/protected-spans.ts:70-114,117-217]
- [SOURCE: packages/cli-communication-projection/src/providers/adapters.ts:96-100]
- [SOURCE: packages/cli-communication-projection/src/fidelity/validator.ts:113-257]
- [SOURCE: packages/cli-communication-projection/src/fidelity/semantics.ts:61-179]
- [SOURCE: packages/cli-communication-projection/test/fixtures/prompt-profiles.json:13-56]

## Assessment

- New information ratio: 0.90
- Questions addressed: quality ceiling; fidelity and judge wiring constraints
- Questions answered: the token/prompt/validator mechanism explains the likely quality ceiling; concrete tuning remains for the next iteration

## Reflection

- What worked and why: reading the producer and consumer together exposed the causal chain from broad regex protection to opaque-token copying burden and then to fail-closed restoration.
- What did not work and why: no direct live smoke artifact was present in the package, so model-specific quality claims remain inferred.
- What I would do differently: quantify span granularity across fixture corpora and inspect provider control/profile wiring before recommending a particular model or prompt change.

## Recommended Next Focus

Iteration 2: quantify tokenization granularity and adjacent-span behavior, then inspect prompt profiles, provider controls, model tiers, and available few-shot/evaluation fixtures for changes that improve readability without changing the protected-value contract.
