# Iteration 1: Tokenization granularity and the prompt-token mismatch

## Focus

Trace the real path from assembled source text to protected provider input and establish, from source, why the DeepSeek rewrite underwhelms. The selected angle is IMPROVE QUALITY, specifically the model-facing representation: how many opaque tokens a sentence becomes, and whether the wire prompt actually describes what the model receives.

## Actions Taken

- Read the conservative Markdown dialect (`collectProtectedRanges`) and the protected-span codec (`protectMarkdown`, `createToken`, `restoreProtectedSpans`).
- Read the provider wire adapter (`messages`) to see the exact request body the model receives.
- Read the versioned prompt profile fixture to compare the system instruction against the tokenized user content.
- Read the fidelity validator to see the acceptance short-circuit when output is unchanged.

## Findings

1. The protection policy is far broader than paths, numbers, codes, and secrets. `collectBlockRanges` protects fenced code, runtime-extension blocks, HTML, tables, indented code, headings, command lines, and list/quote markers, while `collectInlineRanges` adds inline code, links, URLs, Windows/POSIX/relative paths, quoted literals, variables, flags, hashes, multi-word and camelCase/snake_case/dotted/all-caps identifiers, and numbers with units. Overlapping ranges are rejected by `addRange`, but there is no merge of adjacent or near-adjacent spans. [SOURCE: packages/cli-communication-projection/src/fidelity/dialect.ts:134-288]

2. Every accepted range becomes one opaque token of the form `⟦pcp:v1:{24-hex-namespace}:{index}:{12-hex-digest}⟧` — approximately 48 characters regardless of whether it protected a 2-character flag or a 60-character path. The token carries no readable semantics; it is a collision-free, ordered placeholder. The model must reproduce these exactly once and in order. [SOURCE: packages/cli-communication-projection/src/fidelity/protected-spans.ts:396-415]

3. The wire body is exactly two messages: one system instruction and one user message whose content is the entire encoded text (prose interleaved with opaque tokens). There is no token inventory, no section schema, no few-shot example, and no instruction telling the model what the `⟦pcp:v1:...⟧` markers are or that they must be copied verbatim and in order. [SOURCE: packages/cli-communication-projection/src/providers/adapters.ts:96-100]

4. The system instruction is a prompt-token mismatch. It says: "You rewrite the assistant's message into much simpler, plain English. Keep every fact, name, number, and file path." But after protection the model does not see facts, names, numbers, or paths — it sees opaque `⟦pcp:v1:...⟧` tokens for those values. The instruction asks the model to preserve content it can no longer see, and never teaches it how to treat the placeholders. This is a concrete, source-backed root cause for both the "barely changed" and "prose artifact" smoke results: the model has no rubric for handling the tokens, so it either leaves everything alone (safest) or improvises prose around markers it does not understand. [SOURCE: packages/cli-communication-projection/test/fixtures/prompt-profiles.json:13-56] [INFERENCE: a prompt that names the token contract ("copy each ⟦…⟧ marker exactly once, in order; rewrite only the words between them") is a prerequisite for a confident rewrite]

5. The validator accepts an unchanged echo. `validateProjectionCandidateInternal` only runs the Markdown-structure and semantic-veto stages inside `if (restored.text !== sourceText)`. When the restored candidate equals the source byte-for-byte — i.e. the model copied the tokens and left the prose alone — the checks are skipped and the candidate is accepted. Nothing in the pipeline penalizes a no-op rewrite, so "some barely changed" is structurally rewarded, not detected. [SOURCE: packages/cli-communication-projection/src/fidelity/validator.ts:183-222]

6. Restoration is deliberately unforgiving: duplicate, changed, unexpected, missing, or reordered tokens all reject. This is the correct privacy/fidelity invariant, but it means the token granularity directly trades against model usability: more tokens = more exact strings to carry with no semantic help. [SOURCE: packages/cli-communication-projection/src/fidelity/protected-spans.ts:133-181]

## Ruled Out

- Relaxing token identity/order/count checks to make prompts easier: the exact ordered restoration is the fail-closed boundary and must remain.
- Treating the two-message wire body as a complete prompt: it lacks any token contract, so it cannot be assumed sufficient.

## Dead Ends

- No implementation change attempted; the package and skill were read-only inputs. The read-only token-length derivation was sufficient to establish the 48-character placeholder and the two-message wire shape.

## Edge Cases

- The supplied smoke result is treated as an observation, not a benchmark statistic.
- The "prose artifact" symptom is consistent with a model improvising prose around markers it is never told how to treat, but this is inference, not measured.

## Sources Consulted

- [SOURCE: packages/cli-communication-projection/src/fidelity/dialect.ts:23-53,134-288]
- [SOURCE: packages/cli-communication-projection/src/fidelity/protected-spans.ts:70-114,117-217,396-415]
- [SOURCE: packages/cli-communication-projection/src/providers/adapters.ts:65-101]
- [SOURCE: packages/cli-communication-projection/test/fixtures/prompt-profiles.json:13-56]
- [SOURCE: packages/cli-communication-projection/src/fidelity/validator.ts:183-244]

## Assessment

- New information ratio: 0.92
- Novelty justification: the prompt-token mismatch (instruction describes semantic values the model cannot see) and the unchanged-echo acceptance short-circuit are new, source-backed causal findings not captured by a superficial "tokenization is aggressive" summary.

## Reflection

- What worked: reading the codec, the wire adapter, and the prompt fixture together exposed a three-way mismatch — broad tokenization, a two-message wire body, and a value-centric instruction — that jointly explains the underwhelming rewrite.
- What did not work: the exact runtime the live smoke used is not reconstructable from source alone; which capability-evidence profile it supplied remains an open question for iteration 2.
- What I would do differently: next, quantify adjacent-span inflation and verify whether the DeepSeek preset's control evidence even permits the model to be reached.

## Recommended Next Focus

Iteration 2: quantify adjacent-span behavior and inspect the prompt profile contract, provider control compilation, and the DeepSeek preset's capability evidence to determine which quality levers (temperature, thinking, few-shot, per-model profiles) are actually wired and which are gated fail-closed.
