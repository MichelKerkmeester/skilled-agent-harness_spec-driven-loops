# Iteration 19: Build the feasibility matrix and proof plan

## Focus

Classify each proposed capability by evidence-backed feasibility and define the checks required before implementation.

## Findings

- Low-risk and directly supported: provider/model/namespace diagnostics, stable-prefix fingerprints, cache-generation invalidation, provider usage capture where exposed, and read-only stats. These fit Pi's documented extension and session hooks. [SOURCE: https://pi.dev/docs/latest/extensions; https://pi.dev/docs/latest/compaction; https://pi.dev/docs/latest/settings]
- Medium-risk and test-dependent: stable-content reordering, OpenAI-compatible cache-key fallback, long-retention requests, session-affinity headers, and Anthropic TTL repair. Pi and the existing package expose the controls, but each requires provider/proxy compatibility tests and a fail-open path. [SOURCE: https://pi.dev/docs/latest/models; https://github.com/jiangge/pi-cache-optimizer]
- High-risk or out of scope: raw KV persistence, guaranteed cache sharing across agents, universal provider-neutral cache semantics, and guaranteed 70–90% savings. No reviewed API exposes the needed guarantees, and provider documentation explicitly retains best-effort behavior. [SOURCE: https://api-docs.deepseek.com/guides/kv_cache; https://platform.openai.com/docs/api-reference/responses-streaming/response/refusal/delta]
- The proof plan should include repeated identical-prefix requests, dynamic-tail changes, compaction, branch navigation, model/provider switches, concurrent namespaces, unsupported proxy parameters, and cost reconciliation. A successful extension build is not evidence of savings; provider usage and controlled comparisons are required. [INFERENCE: https://pi.dev/docs/latest/compaction; https://api-docs.deepseek.com/guides/kv_cache]

## Ruled Out

- Approving the lumo roadmap's time/overhead targets as commitments is ruled out; no implementation estimate or benchmark evidence was found in the reviewed sources.

## Dead Ends

- A single “works on DeepSeek” smoke test is insufficient for the proposed provider-agnostic wording and would not test Pi's Anthropic/OpenAI compatibility paths.

## Questions Remaining

- Which recommendation should the final synthesis make: adopt/audit the existing package, contribute upstream, or build a separate narrow plugin?
- Which lumo claims remain unknown rather than false?

## Sources Consulted

- `https://pi.dev/docs/latest/extensions`
- `https://pi.dev/docs/latest/compaction`
- `https://pi.dev/docs/latest/settings`
- `https://pi.dev/docs/latest/models`
- `https://github.com/jiangge/pi-cache-optimizer`
- `https://api-docs.deepseek.com/guides/kv_cache`
- `https://platform.openai.com/docs/api-reference/responses-streaming/response/refusal/delta`

## Assessment

- newInfoRatio: 0.29
- Novelty justification: The research now separates documented feasibility from live-test requirements and identifies the minimum proof matrix.
- Confidence: High for the risk classification; low for the final build-versus-adopt decision without a source audit and benchmark.

## Reflection

- What worked and why: Classifying by API boundary and test dependency prevents unsupported implementation promises.
- What did not work and why: The public package page cannot answer maintenance, compatibility, or benchmark questions.
- What I would do differently: Make package audit and provider wire tests explicit entry criteria for the next phase.

## Recommended Next Focus

Perform the final adversarial claim audit and record verified, partially supported, unsupported, and unknown statements without synthesizing early.

