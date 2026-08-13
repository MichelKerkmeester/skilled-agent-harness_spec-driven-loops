# Iteration 2: Granularity, prompt profiles, and model controls

## Focus

Trace how the dialect fragments ordinary technical prose, quantify the wire-size effect of adjacent protected values, and determine which prompt and model controls are genuinely available to a per-model quality experiment.

## Actions Taken

- Re-read the iteration state and strategy before extending the loop.
- Inspected the dialect range collector, protected-span codec, provider adapter, prompt contract/validator, provider presets, and provider fixtures.
- Ran a read-only probe against the built package with short CLI sentences containing paths, flags, identifiers, and numbers.
- Inspected adapter tests to distinguish confirmed synthetic controls from the dated DeepSeek preset's unknown controls.

## Findings

1. The protection pass does not coalesce neighboring technical values into a single semantic unit. `collectProtectedRanges` accepts a range only when it does not overlap an earlier range; it sorts accepted ranges but has no adjacent-range merge. `protectMarkdown` then emits one fresh indexed token for every range. The probe measured `Run --flag=fast /srv/app 3 times.` growing from 33 to 157 characters with three spans (`flag`, `path`, `number`), and `Use fooBar foo_bar foo.bar and 1234.` growing from 36 to 204 characters with four identifier/number spans. [SOURCE: packages/cli-communication-projection/src/fidelity/dialect.ts:26-53,246-301] [SOURCE: packages/cli-communication-projection/src/fidelity/protected-spans.ts:70-114] [SOURCE: probe: protectMarkdown on the two sentences above]

2. The dialect's precedence protects whole structural units before inline values, but prose containing technical fragments is still split into separate opaque tokens. Fenced code, tables, commands, and headings are claimed as block ranges first; inline patterns subsequently cover paths, URLs, flags, variables, hashes, numbers, and several identifier styles only where they do not overlap an earlier range. This is conservative for fidelity, but it leaves a quality tradeoff: a model must copy multiple long opaque markers in a sentence while receiving no semantic relation between them. [SOURCE: packages/cli-communication-projection/src/fidelity/dialect.ts:134-243,265-288] [INFERENCE: the absence of a merge or relation layer makes token count, rather than meaning-bearing chunk count, the model-facing complexity metric]

3. A safer granularity improvement is to change the model-facing representation, not the local preservation set. Candidate strategies are (a) coalesce bounded runs of protected ranges within one prose clause while retaining the original bytes and member order in the local span map, or (b) replace the current 48-character canonical wire token with a short, collision-free alias such as a neutral ordinal or an explicitly privacy-approved type-plus-ordinal alias. In both cases the local document must keep canonical digest/byte records, and restoration must still require every alias/member exactly once and in order. Removing protection for identifiers or values merely to improve prose would send those values to the model and violates the current privacy boundary. [SOURCE: packages/cli-communication-projection/src/fidelity/protected-spans.ts:77-112,133-181,396-415] [INFERENCE: grouping or aliasing can lower copying burden without reducing exactness, but typed aliases would disclose span categories and therefore require an explicit privacy-policy decision]

4. The current prompt profile has no few-shot or token-schema field. `PromptProfileRecord` contains one system instruction, copy-editing scope, protected-value policy version, temperature, thinking mode, provider mappings, and unsupported-control behavior; `validatePromptProfile` validates exactly those concerns. The adapter sends only that system instruction and the complete encoded text as the user message. The reference-like fixture asks for simpler English and preservation of facts/names/numbers/paths, but contains no token checklist, protected-span inventory, rewrite rubric, or before/after example. [SOURCE: packages/cli-communication-projection/src/contracts/prompt.ts:11-32] [SOURCE: packages/cli-communication-projection/src/contracts/validate-policy.ts:124-221] [SOURCE: packages/cli-communication-projection/src/providers/adapters.ts:96-100] [SOURCE: packages/cli-communication-projection/test/fixtures/prompt-profiles.json:13-56]

5. Per-model prompt profiles are structurally compatible with the existing versioned contract, but quality tuning cannot be treated as a string-only edit. A useful profile revision would carry a prompt version/digest plus a short synthetic-token example set and explicit instructions to preserve each marker once, avoid commentary, keep Markdown structure, and rewrite only surrounding prose. Examples must use synthetic values and must never include the local span map or real protected bytes. The profile and its fixtures should be versioned alongside the protected-value policy so a rendered projection records which behavior was tested. [SOURCE: packages/cli-communication-projection/src/contracts/prompt.ts:21-32] [SOURCE: packages/cli-communication-projection/src/contracts/validate-policy.ts:134-153] [SOURCE: packages/cli-communication-projection/src/contracts/projection.ts:1-33] [INFERENCE: adding few-shot examples needs a contract/schema change or a separately versioned prompt assembler; it cannot be inferred from the existing `systemInstruction` field]

6. The provider-control layer deliberately blocks quality experiments when model capability evidence is not confirmed. `compilePromptControls` requires fresh capability evidence, confirmed chat capability, confirmed provider/model mapping, and confirmed capability state before it wires temperature; non-default thinking requires the same proof. The OpenCode Go DeepSeek V4 Flash preset labels temperature and thinking controls unknown, and the reference-like fixture also marks its DeepSeek mappings unknown. The adapter tests show that this state returns `unsupported-control` before transport, while synthetic local/hosted test records explicitly confirm controls and therefore exercise a different path. [SOURCE: packages/cli-communication-projection/src/providers/controls.ts:29-68,71-116] [SOURCE: packages/cli-communication-projection/src/providers/presets.ts:43-83,171-178] [SOURCE: packages/cli-communication-projection/test/fixtures/prompt-profiles.json:22-56] [SOURCE: packages/cli-communication-projection/test/providers/adapters.test.ts:20-67,71-89]

7. There is no source-backed model quality tier or benchmark result from which to choose a larger model. Provider records describe privacy class, controls, freshness, cost, and routing, while the DeepSeek preset has unknown cost and model controls; execution returns a candidate but does not score readability. A higher-capacity instruction-tuned model is a plausible hypothesis for carrying opaque markers and producing better prose, but it remains an inference. The responsible model-tier experiment is a fixed synthetic corpus with paired outputs, exact-token acceptance, deterministic semantic veto, meaning-judge result, readability rubric, latency, and fallback rate, run only against providers whose privacy and control evidence is fresh. [SOURCE: packages/cli-communication-projection/src/providers/presets.ts:43-83,171-178] [SOURCE: packages/cli-communication-projection/src/providers/types.ts:150-218] [SOURCE: packages/cli-communication-projection/src/providers/executor.ts:102-147] [INFERENCE: model tier should be selected by measured quality-per-cost under the same privacy/fidelity gates, not by the provider name or the smoke anecdote]

## Concrete Quality Recommendations

- Keep the strict protection policy as the default. Add an explicitly named projection granularity policy that can merge only bounded, local technical runs or use short wire aliases while retaining canonical local bytes, digests, ordinals, and ordered restoration checks.
- Add a model-facing token-handling rubric and two or three synthetic before/after examples to a versioned per-model prompt profile. Test unchanged output, token copying, Markdown preservation, and prose-only rewriting separately.
- Refresh provider/model capability evidence before enabling temperature or thinking controls. If evidence is unknown, retain the current exact-original/reject-provider behavior; do not claim that a requested temperature reached the model.
- Compare model tiers on a corpus that reports readability and artifact rate in addition to fidelity. A larger model is a candidate optimization, not a confirmed fix.

## Ruled Out

- Removing broad protection categories without a replacement privacy classification: it would expose values that the current adapter intentionally keeps out of the request.
- Treating the synthetic confirmed-control adapter tests as evidence that the OpenCode Go DeepSeek route accepts those controls.
- Assuming that a shorter prompt or lower temperature alone will cure unchanged/prose-artifact outputs without a measured quality gate.

## Dead Ends

- No package or skill implementation changes were attempted; all source reads and the probe were read-only.

## Edge Cases

- Whole command lines and fenced blocks remain single protected structural ranges, so the fragmentation finding applies primarily to inline technical prose rather than every CLI line.
- A typed wire alias would reduce opacity but leak a category such as `PATH`; that tradeoff is unresolved and must be decided by the privacy policy.
- The supplied DeepSeek smoke is not attributed to this package's current unknown-control preset; the source proves only what this package would permit under that evidence state.

## Sources Consulted

- [SOURCE: packages/cli-communication-projection/src/fidelity/dialect.ts:26-53,134-243,246-301]
- [SOURCE: packages/cli-communication-projection/src/fidelity/protected-spans.ts:70-114,117-181,396-415]
- [SOURCE: packages/cli-communication-projection/src/contracts/prompt.ts:11-32]
- [SOURCE: packages/cli-communication-projection/src/contracts/validate-policy.ts:124-221]
- [SOURCE: packages/cli-communication-projection/src/providers/adapters.ts:96-100]
- [SOURCE: packages/cli-communication-projection/src/providers/controls.ts:29-116]
- [SOURCE: packages/cli-communication-projection/src/providers/presets.ts:43-83,171-178]
- [SOURCE: packages/cli-communication-projection/src/providers/executor.ts:102-147]
- [SOURCE: packages/cli-communication-projection/test/fixtures/prompt-profiles.json:13-56]
- [SOURCE: packages/cli-communication-projection/test/providers/adapters.test.ts:20-67,71-89]
- [SOURCE: probe: built `protectMarkdown` measurement recorded in the iteration actions]

## Assessment

- New information ratio: 0.86
- Questions addressed: granularity, adjacent-span handling, prompt/profile schema, provider control availability, and model-tier evidence
- Questions answered: the first concrete quality levers are representation granularity, prompt examples/rubrics, fresh per-model controls, and measured tier selection; efficacy still requires evaluation and judge wiring

## Reflection

- What worked and why: a small local probe made the copying burden observable, while reading the control compiler beside its fixtures prevented synthetic test capability from being mistaken for DeepSeek evidence.
- What did not work and why: the repository has no product quality tier or live model comparison, so the model recommendation remains a testable hypothesis.
- What I would do differently: inspect the evaluation seam next and verify whether the optional meaning judge is actually connected to runtime projection decisions.

## Recommended Next Focus

Iteration 3: trace the meaning-preservation judge, deterministic semantic veto, evaluation corpus, pilot, and release gate from exported functions to the actual provider/runtime projection path; determine exactly what is wired, what is test-only, and what quality metric is missing.
