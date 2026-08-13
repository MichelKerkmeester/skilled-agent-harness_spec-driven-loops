# Iteration 10: Assess concurrent-agent cache sharing

## Focus

Test the claim that concurrent Pi agents can share cached content, using Pi session boundaries, provider affinity controls, and the community package's documented behavior.

## Findings

- Pi persists sessions as JSONL trees and supports fork/clone operations. Separate sessions provide a durable coordination boundary, but the session tree itself is not a provider prompt-cache namespace. [SOURCE: https://pi.dev/docs/latest/sessions; https://pi.dev/docs/latest/session-format]
- Pi's OpenAI-compatible affinity option and the package README's proxy guidance can improve the chance that requests reach a compatible cache locality. Neither source establishes that two concurrent agents with different mutable tails will receive shared cached tokens. [SOURCE: https://pi.dev/docs/latest/models; https://github.com/jiangge/pi-cache-optimizer]
- Sharing a stable prefix across agents is technically plausible when provider, model, serialization, tool definitions, and cache namespace all match. Any agent-specific prompt content inserted before that prefix, or any provider routing change, can reduce the common cached region. [INFERENCE: https://api-docs.deepseek.com/guides/kv_cache; https://platform.openai.com/docs/api-reference/responses-streaming/response/refusal/delta]
- The lumo statement that concurrent agents share a cache should be treated as a conditional design goal, not a Pi capability claim. A plugin can offer explicit namespaces and warnings, but it should default to isolation to avoid cross-task leakage and misleading hit-rate attribution. [SOURCE: .opencode/specs/hooks/008-pi-caching-like-reasonix/lumo.md:12-19; INFERENCE: https://pi.dev/docs/latest/sessions]

## Ruled Out

- Assuming that Pi session persistence alone makes concurrent agents share provider cache state is ruled out.

## Dead Ends

- A global cache namespace shared by all projects and agents is a dead end for correctness and privacy; sharing must be explicit and scoped.

## Questions Remaining

- Are the claimed Pi feature gaps about core functionality, package availability, or this specific cache policy?
- What is the smallest plugin contract that remains useful with default isolation?

## Sources Consulted

- `https://pi.dev/docs/latest/sessions`
- `https://pi.dev/docs/latest/session-format`
- `https://pi.dev/docs/latest/models`
- `https://github.com/jiangge/pi-cache-optimizer`
- `https://api-docs.deepseek.com/guides/kv_cache`
- `.opencode/specs/hooks/008-pi-caching-like-reasonix/lumo.md:12-19`

## Assessment

- newInfoRatio: 0.55
- Novelty justification: The concurrency claim is narrowed to explicit provider/model/prefix/namespace conditions and separated from Pi's session persistence.
- Confidence: High for Pi session behavior; medium for package proxy behavior and provider cache sharing because both depend on deployment.

## Reflection

- What worked and why: Combining session docs with provider affinity controls exposed the missing namespace and routing assumptions.
- What did not work and why: No public source proves cross-agent shared hits under concurrent mutable requests.
- What I would do differently: Benchmark one shared-prefix namespace against isolated namespaces with provider usage counters.

## Recommended Next Focus

Audit `lumo.md`'s “Context Engine v2,” MCP, plan mode, checkpoint, and rewind gap claims against Pi core documentation and extension/package boundaries.

