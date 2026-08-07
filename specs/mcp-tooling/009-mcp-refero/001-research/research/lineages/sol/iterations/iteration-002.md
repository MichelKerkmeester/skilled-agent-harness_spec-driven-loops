# Iteration 2: Limits, plan gating, batch behavior, and current data shapes

## Focus

Separate explicit Refero entitlements and quotas from undocumented rate behavior, then inventory pagination, batching, image, identifier, and response-shape constraints across the current official documentation and official skill repository.

## Actions Taken

1. Searched official documentation for rate-limit, plan, and quota language; treated stale search-index snippets as non-authoritative.
2. Opened the current Data Model, Examples, Refero for Business, and Plans pages directly.
3. Retrieved the official repository tree and current `references/mcp-tools.md` with quote-safe read-only GitHub requests.
4. Read the repository README and full example workflow to capture installation, no-account fallback, research-layer sequence, and synthesis artifacts.
5. Opened the public pricing URL; the page renderer returned no structured lines, so plan claims remain grounded in the dedicated Help/Plans documentation.

## Findings

- F-007: Free accounts have limited website search results but no MCP, Refero Skill, or Figma plugin access. Pro is the first tier with MCP and Skill access; therefore there is no reduced free MCP tool surface to model—free is access-denied, not a smaller tools list. Team inherits Pro, and Business/volume access is separately negotiated. [SOURCE: https://doc.refero.design/help/plans]
- F-008: The only published individual MCP quota found is 8,000 tool calls per month for Pro. No official page reviewed publishes per-second, per-minute, concurrency, retry-after, or burst limits. The transport packet must call the monthly figure a quota and keep runtime rate-limit behavior `UNKNOWN` until an authenticated 429 can be observed or Refero documents it. [SOURCE: https://doc.refero.design/mcp/getting-started]
- F-009: Business documents volume pricing scaled to usage and an example of $0.001/request with a $2,000 minimum commitment (2,000,000 initial requests), plus weekly screen/flow updates. This is a commercial integration example, not a generic MCP rate-limit contract. [SOURCE: https://doc.refero.design/mcp/business]
- F-010: Search pagination is page-based. Style search takes `query`, optional `page`, optional schema-dependent `response_format`; screen and flow searches require `query` plus platform `web|ios`, optional `page`, and schema-dependent `response_format`. Search responses expose `count`, `page`, `next_page`, `total_count`, and `total_pages`. [SOURCE: https://doc.refero.design/mcp/tools]
- F-011: Detail tools support exclusive single-or-batch identifiers: styles and screens use UUID strings; flows use numeric IDs. Official examples say keep batches modest; full style guidance suggests 3–4 styles per batch, while screen batches should be retried with fewer IDs on failure. No hard maximum is documented for screen/flow batch arrays. [SOURCE: https://doc.refero.design/mcp/tools] [SOURCE: https://doc.refero.design/mcp/examples] [SOURCE: https://github.com/referodesign/refero_skill/blob/master/references/mcp-tools.md]
- F-012: Images are deliberately split from screen metadata. `refero_get_screen_image` accepts one screen UUID and `image_size: thumbnail|full`, defaulting to thumbnail; metadata-first is the recommended path to control context, with full images reserved for fine visual inspection. Similar screens are also split into `refero_get_similar_screens`, whose `limit` is 1–20 and defaults to 10. [SOURCE: https://doc.refero.design/mcp/tools] [SOURCE: https://doc.refero.design/mcp/data-model]
- F-013: Response shapes are intentionally evolvable: the Data Model says exact fields can grow. A transport wrapper should preserve returned structured content and avoid closed-world decoding that drops future fields. Core discriminators remain stable: screen UUIDs vs numeric flow IDs, `site` metadata, screen `content`, and flow steps with goal/action/system response. [SOURCE: https://doc.refero.design/mcp/data-model]
- F-014: The official repository is a methodology plus conditional references, not a transport implementation. Its tree has one `SKILL.md`, ten focused reference guides, and an image asset. It explicitly says the craft methodology works without an account, whereas live MCP research requires a configured paid Refero connection. [SOURCE: https://github.com/referodesign/refero_skill] [SOURCE: https://github.com/referodesign/refero_skill/blob/master/README.md]

## Questions Answered

- What rate, pagination, result, image, and free-versus-paid limits are documented or observable, and which claims remain unknown? Documented monthly quota, page/batch/image constraints, and plan gates are separated from unknown burst limits.
- How does the official `referodesign/refero_skill` repository structure UI-reference search workflows, prompts, output handling, and failure guidance? The tree and core MCP reference establish its methodology/reference split and fallback contract.

## Questions Remaining

- Verify `mcp-remote` OAuth/browser behavior, token persistence implications, and failure presentation for the existing manual.
- Define Code Mode function signatures without duplicating the eight remote tools or exposing arbitrary generic MCP calls.
- Specify the handoff between retrieval evidence and `sk-design` taste/mode decisions.
- Identify exact packet verification cases for auth-required, free/no-access, stale tool names, pagination, batch reduction, images, and evolving response fields.

## Sources Consulted

- https://doc.refero.design/mcp/getting-started
- https://doc.refero.design/mcp/tools
- https://doc.refero.design/mcp/data-model
- https://doc.refero.design/mcp/examples
- https://doc.refero.design/mcp/business
- https://doc.refero.design/help/plans
- https://github.com/referodesign/refero_skill/blob/master/README.md
- https://github.com/referodesign/refero_skill/blob/master/references/mcp-tools.md
- https://github.com/referodesign/refero_skill/blob/master/references/example-workflow.md

## Assessment

- newInfoRatio: 0.78
- Novelty justification: This pass converted broad plan/tool findings into precise gating, pagination, batch, image, identifier, and forward-compatibility constraints while proving that burst limits remain undocumented.
- Confidence: High for official entitlements and schemas; medium for runtime rate behavior because authenticated quota exhaustion was not available.

## Reflection

- What worked and why: Directly opening canonical documentation avoided stale search-index copies and the quoted GitHub API call exposed every official repository reference file.
- What did not work and why: The public pricing page produced no structured extract, so it could not independently validate current prices or entitlements.
- What I would do differently: Use the dedicated Help/Plans and Business pages as the stable entitlement sources and keep price amounts out of the transport contract.

## Ruled Out

- Model Free as a smaller MCP plan: official Plans documentation states that Free has no MCP access. [SOURCE: https://doc.refero.design/help/plans]
- Encode 8,000 calls/month as a request-rate limit: it is a monthly quota; no burst/window rate is published. [SOURCE: https://doc.refero.design/mcp/getting-started]
- Strip unknown response fields into a rigid local model: official Data Model documentation says exact fields can grow over time. [SOURCE: https://doc.refero.design/mcp/data-model]

## Dead Ends

- Derive per-minute or concurrency limits from unauthenticated responses: the 401 responses expose no rate headers and cannot establish authenticated runtime limits. [SOURCE: https://api.refero.design/mcp]

## Recommended Next Focus

Trace the existing `mcp-remote` bridge and Refero OAuth/Bearer flows, including what can be confirmed from the installed package and live metadata without writing credentials or changing configuration; design an explicit auth/error boundary for Code Mode.
