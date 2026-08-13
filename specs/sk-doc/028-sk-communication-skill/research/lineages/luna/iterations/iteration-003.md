# Iteration 3: Judge wiring and evaluation boundaries

## Focus

Follow candidate production, deterministic fidelity validation, optional meaning judging, render selection, runtime presentation, offline evaluation, and release readiness as separate call paths.

## Actions Taken

- Re-read the iteration state and strategy before tracing the evaluation seam.
- Searched the production source for imports and calls of the validator, fidelity veto, proxy reviewer, and release gate.
- Read the validator's judge stages, the evaluation fidelity/proxy/gate modules, corpus and pilot contracts, runtime presentation, and release readiness checks.
- Read the corresponding integration and release tests to distinguish injected test composition from production wiring.

## Findings

1. The package does not wire a meaning-preservation judge into the provider-to-runtime path. `executeProviderRoute` returns a `candidate` after transport and records its text; it does not call `validateProjectionCandidate`. `decideRender` accepts a validation result, checks its status and hashes, and selects a display mode, while the runtime adapter accepts that already-decided result and only enforces capability, presentation tier, and atomic ownership. A source search found no production call/import of `validateProjectionCandidate`, `evaluateFidelityVeto`, or `runProxyReviewers` outside the evaluation modules; the only non-evaluation references are release-time type/provenance checks. [SOURCE: packages/cli-communication-projection/src/providers/executor.ts:102-147] [SOURCE: packages/cli-communication-projection/src/render/decision.ts:39-90] [SOURCE: packages/cli-communication-projection/src/runtimes/codex.ts:311-338] [SOURCE: source search: `rg` over `packages/cli-communication-projection/src` excluding `evaluation/`]

2. The validator has a correct explicit judge seam, but it is opt-in and reject-only. It runs source-digest, provider/completeness, output, restoration, structure, and deterministic semantic checks first; only `judgeMode: 'required'` invokes the injected judge, and missing, failed, timed-out, or cancelled judging falls back to the exact original. The judge receives `sourceText` decoded from the exact original and `restored.text`, so it sees real protected values after restoration. [SOURCE: packages/cli-communication-projection/src/fidelity/validator.ts:59-84,113-244] [SOURCE: packages/cli-communication-projection/src/fidelity/validator.ts:315-370] [INFERENCE: wiring a hosted judge at this seam would create a second egress of the restored original unless the judge is local or receives a deliberately redacted representation]

3. The evaluation fidelity-veto path intentionally disables the meaning judge. Its candidate type omits `judgeMode`, and `evaluateFidelityVeto` passes `judgeMode: 'disabled'` to `validateProjectionCandidate`; the resulting decision is a content-free deterministic pass/veto for the release gate. This is useful as an absolute safety veto but cannot detect every meaning error that the optional judge might catch. [SOURCE: packages/cli-communication-projection/src/evaluation/fidelity-veto.ts:12-50]

4. The LLM proxy reviewer is a different, offline evidence lane rather than the missing runtime judge. `ProxyJudgeScorer` is caller-owned, receives a masked review packet, and returns numeric scores for directness, fluency, meaning-preservation, and reference-likeness; transport and model access remain outside the module. The release gate can combine those ratings with fidelity vetoes, but any `llm-proxy` result is marked provisional. [SOURCE: packages/cli-communication-projection/src/evaluation/proxy-judge.ts:18-57,60-84] [SOURCE: packages/cli-communication-projection/src/evaluation/gate.ts:83-145,216-225] [SOURCE: packages/cli-communication-projection/test/evaluation/proxy-judge.test.ts:183-231]

5. The offline evaluation infrastructure is deliberately content-free and injected at the edges. The built-in corpus has five synthetic case identities with categories, privacy classes, and expected span-kind counts, but no prompt or candidate text. The variance pilot accepts injected candidate producers and scorers, retains only numeric samples, and labels its output variance-planning-only. This makes it safe and reproducible, but it does not by itself exercise a live provider, prompt profile, meaning judge, or runtime render decision. [SOURCE: packages/cli-communication-projection/src/evaluation/corpus.ts:18-66] [SOURCE: packages/cli-communication-projection/src/evaluation/types.ts:40-67,96-138] [SOURCE: packages/cli-communication-projection/src/evaluation/pilot.ts:14-70] [SOURCE: packages/cli-communication-projection/test/evaluation/run-manifest.test.ts:69-83]

6. Release policy intentionally prevents the evaluation seam from becoming an unreviewed quality shortcut. The release gate accepts a full-projection claim only when the evaluation is human-certifiable, non-provisional, passing, and approved; the skill explicitly says provisional or LLM-judge evidence cannot authorize release and requires a powered blind human non-inferiority study plus a live credentialed smoke. Thus wiring a judge may improve per-request safety, but it does not replace the offline human quality gate. [SOURCE: packages/cli-communication-projection/src/release/release-gate.ts:303-357] [SOURCE: packages/cli-communication-projection/test/release/release-gate.test.ts:42-80] [SOURCE: .opencode/skills/sk-communication/SKILL.md:154-165,189-195]

## Concrete Wiring Recommendation

- Add one explicit composition boundary between provider candidate output and `decideRender`. It should receive the protected document, provider terminal state, completion state, candidate text, and a privacy-approved judge policy; it should call deterministic validation first and pass `judgeMode: 'required'` only when the policy requires it.
- Keep the judge local for any path where the source/candidate are restored with protected values. If a hosted meaning judge is ever considered, classify it as a new egress and send only tokenized or structurally redacted text plus safe metadata; never rely on the current `RejectOnlyJudge` signature as proof of privacy.
- Preserve the current fail-closed result: missing judge, judge failure, timeout, cancellation, deterministic semantic veto, or token failure selects exact original. Keep the judge reject-only in the runtime; use the separate blinded evaluation system to rank prompts/models and measure readability.
- Add an end-to-end test that executes a candidate through provider result -> validation with required judge -> render decision -> runtime presentation. The test must prove the judge was invoked, real protected bytes were not sent to a non-local scorer, and every judge failure returns original-only.

## Ruled Out

- Treating `evaluateFidelityVeto` as proof that meaning judging is wired: it explicitly disables the judge.
- Treating the masked LLM proxy reviewer as a drop-in runtime validator: it returns comparative numeric ratings and is intentionally provisional for release.
- Calling the judge after runtime presentation: by then a client may have already suppressed the original, violating the fail-closed ordering.

## Dead Ends

- No production composition function was found to modify; this iteration remains source and test analysis only.

## Edge Cases

- `decideRender` verifies projection hashes and accepted status, so a caller can still construct a safe render result if it obtains a validated input elsewhere; the absence of an in-package composition call is a wiring gap, not proof that every external integration is unsafe.
- A local judge can inspect restored source/candidate without a new network egress, but its latency and resource use must be added to the bounded timeout/fallback budget.
- A tokenized judge can assess prose around protected values but cannot independently judge whether the protected values themselves were semantically substituted; local restoration and ordered token checks remain authoritative for those values.

## Sources Consulted

- [SOURCE: packages/cli-communication-projection/src/providers/executor.ts:102-147]
- [SOURCE: packages/cli-communication-projection/src/fidelity/validator.ts:59-84,113-244,315-370]
- [SOURCE: packages/cli-communication-projection/src/evaluation/fidelity-veto.ts:12-50]
- [SOURCE: packages/cli-communication-projection/src/evaluation/proxy-judge.ts:18-84]
- [SOURCE: packages/cli-communication-projection/src/evaluation/gate.ts:83-145,216-225]
- [SOURCE: packages/cli-communication-projection/src/evaluation/corpus.ts:18-66]
- [SOURCE: packages/cli-communication-projection/src/evaluation/types.ts:40-67,96-138]
- [SOURCE: packages/cli-communication-projection/src/evaluation/pilot.ts:14-70]
- [SOURCE: packages/cli-communication-projection/src/render/decision.ts:39-90]
- [SOURCE: packages/cli-communication-projection/src/runtimes/codex.ts:311-338]
- [SOURCE: packages/cli-communication-projection/src/release/release-gate.ts:303-357]
- [SOURCE: .opencode/skills/sk-communication/SKILL.md:117-160,189-195]
- [SOURCE: source search: no validator/evaluation call outside evaluation modules]

## Assessment

- New information ratio: 0.82
- Questions addressed: actual judge wiring, restored-value privacy exposure, offline evaluation boundaries, proxy/human evidence, and release gating
- Questions answered: the missing meaning judge is confirmed as a composition gap; the safe wiring point is before render selection, with a local or redacted judge and exact-original fallback

## Reflection

- What worked and why: the negative import/call search combined with the runtime presentation signatures separated a documented pipeline from actual in-package composition.
- What did not work and why: no live integration caller exists in the package to validate end-to-end judge behavior; the proposed boundary remains a design recommendation.
- What I would do differently: trace structured event assembly and render ownership next to compare a deterministic or hybrid alternative against whole-message rewriting.

## Recommended Next Focus

Iteration 4: inspect canonical event assembly, render/client contracts, runtime ownership, and presentation tiers to evaluate structured, templated, semantic-diff, and hybrid architectures against the current local-tokenize/model/restore design.
