# Iteration 3: Judge default that permits local accepts

## Focus

Reconcile a local-permissive judge default with the reject-only safety contract. Ground the spec's claim that "the default judge is reject-only so even a good rewrite is rejected" against the shipped judge, validator, and plugin `judgeMode`.

## Actions Taken

- Read `src/fidelity/reject-only-judge.ts` in full.
- Read `src/runtime/project-message.ts` judge composition (`judgeMode === 'required'`).
- Read `src/fidelity/validator.ts` judgeMode `'required'` vs `'disabled'` branch.
- Read `test/fidelity/reject-only-judge.test.ts` and `test/runtime/project-message.test.ts` local-accept / meaning-loss cases.
- Re-read plugin `judgeMode: 'disabled'`.

## Findings

1. **The shipped default judge already accepts a good local rewrite.** Token coverage >= 0.5 → `'accept'`; coverage below that → `'reject'`; sources with fewer than 6 content tokens `'accept'` so deterministic checks decide. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/fidelity/reject-only-judge.ts:7-27] Tests confirm accept of a near-paraphrase and reject of a meaning-stripped stub. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/test/fidelity/reject-only-judge.test.ts:19-36]

2. **"Reject-only" means the judge cannot override a deterministic rejection, not that it always rejects.** The module comment states it "cannot authorize a candidate that deterministic checks already rejected and cannot rank variants." Restored plaintext stays in-process; the judge never issues a network request. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/fidelity/reject-only-judge.ts:10-14]

3. **`projectMessage` composes that default judge only when `judgeMode === 'required'`.** Otherwise `judge` is `undefined` and the validator skips the meaning check. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/runtime/project-message.ts:192-203] [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/src/fidelity/validator.ts:229-244]

4. **The plugin sets `judgeMode: 'disabled'`.** Combined with empty providers, the meaning judge never runs. The no-op is privacy `invalid-input`, not a judge veto of a good rewrite. [SOURCE: file:.opencode/plugins/mk-communication-projection.js:258] Runtime tests show `judgeMode: 'required'` + default judge + local Ollama fixture → `status: 'projection'`. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/test/runtime/project-message.test.ts:144-153] Meaning-loss under the same mode returns exact-original `judge-rejected`. [SOURCE: file:.opencode/skills/sk-communication/cli-communication-projection/test/runtime/project-message.test.ts:155-166]

5. **The spec's "good rewrites are rejected to the exact original" is therefore a glue-gap description, not a judge-algorithm fact.** Once a local provider is constructed and `judgeMode` is `'required'`, the existing default judge already permits local accepts. No new judge implementation is required for the easy-config design.

6. **Recommended local default:** the loader sets `judgeMode: 'required'` and does not inject a custom judge, so `createRejectOnlyMeaningJudge()` is used. Deterministic fidelity validators still run first (protected spans, structure). Hosted projection, when later configured, keeps the same reject-only judge — it does not become auto-accept. Hosted safety is `egressConsent` + allowed privacy classes + fresh facts, not a harsher judge.

7. **Do not use `judgeMode: 'disabled'` as the local easy-config default.** Disabled skips meaning coverage. A local model that drops facts would pass if deterministic span checks pass. Required + default judge is the local-permissive *and* fail-closed combination the tests already prove.

8. **Do not add a second "accept-only" judge for local.** That would authorize candidates the deterministic checks rejected, violating the reject-only contract. Local permissiveness is coverage-threshold accept, not bypass.

## Questions Answered

- Q3 (answered): Keep the shipped reject-only judge. Local easy-config sets `judgeMode: 'required'` with no custom judge. Good local rewrites already accept (coverage >= 0.5). Hosted stays reject-only by remaining behind egress consent and class policy, not by swapping the judge.

## Questions Remaining

- Q4: Privacy policy the loader must attach (allowed classes, egressConsent, loopback vs LAN).
- Q5: Plugin/wrapper auto-pickup, including empty `systemInstruction`.

## Next Focus

Local-only privacy defaults: allowedPrivacyClasses, egressConsent, fallbackPolicy none, loopback vs non-loopback host, and the hosted-cascade prohibition.

## Assessment

- newInfoRatio: 0.70
- noveltyJustification: Corrected the spec's reject-always reading against tests and the judge implementation; the design implication is reuse, not a new judge.
- Confidence: High. The spec wording overstates the judge; the code and tests are the ground truth.

## Reflection

What worked: reading the accept/reject tests before designing a new judge.
What failed: taking the phase spec's "even a good rewrite is rejected" as an algorithm fact — it describes the unwired entry points.
Ruled out: a new local-accept judge; defaulting local easy-config to `judgeMode: 'disabled'`.

## Dead Ends

- "Accept-only" local judge that bypasses deterministic checks.
- Leaving plugin `judgeMode: 'disabled'` after wiring a provider.

## Ruled Out

- New judge implementation for local.
- Using disabled-judge as the easy-config default.
