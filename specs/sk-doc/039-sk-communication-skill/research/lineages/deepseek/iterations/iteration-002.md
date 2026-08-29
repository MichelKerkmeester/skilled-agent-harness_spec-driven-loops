# Iteration 2: Prompt profile contract and the fail-closed control-evidence gate

## Focus

Establish which quality levers are actually wired into the DeepSeek path and which are gated fail-closed. The selected angle is IMPROVE QUALITY: the prompt profile contract, per-model prompt profiles, and the model-tier/control evidence boundary.

## Actions Taken

- Read the prompt profile contract (`PromptProfileRecord`) and the prompt-control compiler (`compilePromptControls`).
- Read the provider presets (`baseCapabilities`, `createOpenCodeGoDeepSeekV4FlashRecord`) and the provider executor's attempt loop.
- Compared the reference-like prompt fixture's control mappings against the preset's declared capabilities.

## Findings

1. The prompt profile has no few-shot or token-rubric field. `PromptProfileRecord` carries only `promptVersion`, `systemInstruction`, `copyEditingScope`, `protectedValuePolicyVersion`, `temperature`, `thinkingMode`, `providerControlMappings`, and `unsupportedControlBehavior`. Adding before/after examples or a token-contract rubric is therefore a versioned contract revision plus profile/assembler work, not a string tweak. [SOURCE: packages/cli-communication-projection/src/contracts/prompt.ts:21-32]

2. Temperature and thinking controls are gated fail-closed for the DeepSeek preset. `baseCapabilities(true)` declares `temperature-control` and `thinking-control` as `state: 'unknown', confidence: 'unknown'`. `compilePromptControls` requires `hasCapability` (`state === 'yes'` AND `confidence === 'confirmed'`) and an `isSupportedMapping` with `support === 'yes'` AND `confidence === 'confirmed'` plus a wire field. [SOURCE: packages/cli-communication-projection/src/providers/presets.ts:171-179] [SOURCE: packages/cli-communication-projection/src/providers/controls.ts:100-116]

3. Consequence of (2): with the shipped `deepseek-v4-flash` preset and the reference-like profile (whose DeepSeek temperature/thinking mappings are `support: 'unknown'`), `compilePromptControls` returns `unsupported('temperature')`, so `adapter.prepare` yields `unsupported` and `executeProviderRoute` returns exact-original **without calling the model**. The profile even sets `temperature: 0.3` and `thinkingMode: 'disabled'`, but neither can be applied until fresh confirmed capability evidence is supplied. [SOURCE: packages/cli-communication-projection/src/providers/executor.ts:150-185] [SOURCE: packages/cli-communication-projection/test/fixtures/prompt-profiles.json:22-57]

4. The live smoke is therefore not reproducible through the shipped preset as-is. Any quality experiment that "just sets temperature/thinking" through the DeepSeek preset currently fails closed to the exact original. The reported "modest improvement" implies the smoke supplied fresh confirmed capability evidence (or a distinct profile), which is not checked into the package. This is a hard blocker for model-tier and sampling tuning, not a soft one. [SOURCE: packages/cli-communication-projection/src/providers/controls.ts:71-76] [INFERENCE: the smoke's evidence profile is the missing artifact needed to reproduce its quality]

5. The only model preset with dated privacy facts is `deepseek-v4-flash`, whose `HOSTED_ZDR` privacy class is backed by confirmed 0-day retention and training-use `not-used` facts, but residency remains unknown and the capability evidence `expiresAt` is `2026-08-31`. There is no source-backed quality tier for any model; the "flash" vs "pro" tier difference is a hypothesis, not a confirmed capability. [SOURCE: packages/cli-communication-projection/src/providers/presets.ts:43-84]

6. Adjacent spans are not coalesced. `addRange` rejects only overlapping ranges; `collectInlineRanges` runs each regex independently, so a flag, a number, and a path that sit next to each other in one prose clause each become a separate ~48-character token even though they are one syntactic unit. This multiplies the exact strings the model must carry while providing no adjacent-span context. [SOURCE: packages/cli-communication-projection/src/fidelity/dialect.ts:37-46,265-288]

## Ruled Out

- Assuming temperature alone fixes readability: temperature cannot even be applied through the shipped DeepSeek preset without fresh confirmed capability evidence.
- Assuming a model tier upgrade is confirmed: no package source establishes a quality ranking across tiers.

## Dead Ends

- No live provider call was needed; the control-compiler trace is deterministic and sufficient to prove the exact-original short-circuit for the shipped preset.

## Edge Cases

- The DeepSeek preset is hosted (`HOSTED_ZDR`) despite the "local" framing in the research brief; hosted routing requires explicit consent and fresh retention/training facts, so model-tier experiments on hosted DeepSeek are also privacy-gated, not just capability-gated.

## Sources Consulted

- [SOURCE: packages/cli-communication-projection/src/contracts/prompt.ts:21-32]
- [SOURCE: packages/cli-communication-projection/src/providers/controls.ts:29-116]
- [SOURCE: packages/cli-communication-projection/src/providers/presets.ts:43-84,171-179]
- [SOURCE: packages/cli-communication-projection/src/providers/executor.ts:150-185]
- [SOURCE: packages/cli-communication-projection/test/fixtures/prompt-profiles.json:22-57]
- [SOURCE: packages/cli-communication-projection/src/fidelity/dialect.ts:37-46,265-288]

## Assessment

- New information ratio: 0.84
- Novelty justification: the deterministic proof that the shipped DeepSeek preset + reference-like profile returns exact-original before transport (temperature/thinking gated by unknown capability evidence) is a new, load-bearing finding for any quality roadmap.

## Reflection

- What worked: tracing the control compiler against the preset's declared capabilities turned a vague "model controls are uncertain" into a concrete fail-closed short-circuit.
- What did not work: the smoke's actual evidence profile remains unavailable; its reproducibility gap is now explicit.
- What I would do differently: next, verify whether the meaning-preservation judge is composed into the production path and what its input boundary exposes.

## Recommended Next Focus

Iteration 3: trace whether the optional meaning-preservation judge is composed into the provider/runtime/render path, what plaintext it receives, and how the reject-only semantic layer interacts with the unchanged-echo short-circuit.
