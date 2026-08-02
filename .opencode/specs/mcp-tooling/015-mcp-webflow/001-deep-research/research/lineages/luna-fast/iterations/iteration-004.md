# Iteration 4: Official Webflow operational constraints and change history

## Focus
Investigated only official Webflow documentation for Data API rate limits, pagination, errors, retries/idempotency, publishing constraints, and changelog evolution. The selected interpretation is the documented Data API/MCP integration boundary; endpoint-specific behavior is not generalized beyond the official pages that describe it.

## Findings
1. Webflow documents plan-based Data API ceilings: Starter/Basic sites receive 60 requests per minute, CMS/eCommerce/Business sites receive 120, and Enterprise is custom. Responses expose `X-RateLimit-Remaining`, `X-RateLimit-Limit`, and `Retry-After`; exceeding the limit returns HTTP 429, with a typical 60-second reset. The limit is described as per API key, and endpoint-specific limits can be stricter. `[SOURCE: https://developers.webflow.com/data/reference/rate-limits]`
2. The official CMS collection-item workflow uses offset pagination: `limit` is capped at 100, `offset` skips items, and the response contains `pagination.total`, `pagination.limit`, and `pagination.offset`. The guide explicitly says to advance the offset for later pages; this establishes the CMS item-list contract but does not prove identical pagination semantics for every Webflow endpoint. `[SOURCE: https://developers.webflow.com/data/docs/working-with-the-cms/manage-collections-and-items.md]`
3. Data API errors use standard HTTP classes: 2xx success, 4xx client/request or authorization failures, and 5xx server failures. The documented JSON body contains machine-readable `code`, human-readable `message`, `externalReference`, and `details`; common codes cover malformed requests, authorization, permissions, missing resources, conflicts, rate limits, and internal errors. `[SOURCE: https://developers.webflow.com/data/reference/error-handling.md]`
4. Official retry guidance is narrow but actionable: SDKs provide exponential backoff, while custom clients should implement retry logic that honors `Retry-After` for 429 responses. Webflow also recommends webhooks instead of aggressive polling to reduce rate-limit pressure. The consulted official documentation does not specify an idempotency-key mechanism, replay guarantee, or endpoint-by-endpoint retryability matrix; consequently, automatic replay of non-idempotent writes remains an integration policy decision rather than documented Webflow behavior. `[SOURCE: https://developers.webflow.com/data/reference/error-handling.md]` `[SOURCE: https://developers.webflow.com/data/reference/rate-limits]` `[INFERENCE: absence of idempotency-key and replay semantics in the consulted official retry, error, rate-limit, and publish references]`
5. Publishing is an explicit, permissioned boundary. The site publish endpoint is `POST /v2/sites/{site_id}/publish`, requires `sites:write`, requires at least one custom domain or the Webflow subdomain flag, can target a page with `pageId`, returns 202 when accepted, and is limited to one successful publish queue per minute. Publishing multiple pages from staging to production publishes all staged changes, so a retry or publish decision must account for that broader deployment effect. `[SOURCE: https://developers.webflow.com/data/reference/sites/publish]` `[SOURCE: https://developers.webflow.com/data/docs/working-with-the-cms/manage-collections-and-items.md]`
6. The official changelog demonstrates breaking API evolution within days: the July 27 entry introduced `translatable=true` for page, component, and CMS content reads, while the July 29 entry changed the parameter to a target secondary-locale ID. The newer contract makes boolean values return 400, requires a valid secondary locale, can return 403 when translation exclusions are disabled, and returns 500 rather than unfiltered content when exclusion rules cannot be resolved. Integrations therefore need changelog monitoring and version-aware request construction rather than assuming recently introduced parameters remain stable. `[SOURCE: https://developers.webflow.com/home/changelog/2026/7/27.md]` `[SOURCE: https://developers.webflow.com/home/changelog/2026/7/29.md]`

## Ruled Out
- The guessed standalone `https://developers.webflow.com/data/reference/pagination` and `/data/reference/errors` pages returned Page Not Found. The official REST introduction linked the canonical error-handling page, and the CMS workflow supplied the scoped pagination evidence. `[SOURCE: https://developers.webflow.com/data/reference/rest-introduction.md]` `[SOURCE: https://developers.webflow.com/data/reference/pagination]` `[SOURCE: https://developers.webflow.com/data/reference/errors]`
- No Webflow MCP tool was invoked, no credential was used, and no Webflow mutation or publish call was made, per dispatch constraints.
- No non-official article, client guide, or community source was used.

## Dead Ends
The standalone pagination and errors URL guesses were exhausted after official Page Not Found responses; future work should follow the official documentation index or endpoint links instead of guessing paths. `[SOURCE: https://developers.webflow.com/llms.txt]`

## Edge Cases
- Ambiguous input: “pagination” was interpreted narrowly using the official CMS collection-item contract; other endpoint families remain unverified.
- Contradictory evidence: none found among the consulted official operational pages.
- Missing dependencies: the guessed pagination and errors pages were unavailable; official linked alternatives were used.
- Partial success: rate limits, pagination, errors, retries, publishing, and changelog behavior were documented successfully, but Webflow’s idempotency guarantees and universal pagination rules remain undocumented in the consulted sources; status remains complete because the in-scope documented constraints were answered.

## Sources Consulted
- https://developers.webflow.com/data/reference/rate-limits
- https://developers.webflow.com/data/reference/error-handling.md
- https://developers.webflow.com/data/reference/rest-introduction.md
- https://developers.webflow.com/data/reference/sites/publish
- https://developers.webflow.com/data/docs/working-with-the-cms/manage-collections-and-items.md
- https://developers.webflow.com/home/changelog.md
- https://developers.webflow.com/home/changelog/2026/7/27.md
- https://developers.webflow.com/home/changelog/2026/7/29.md
- https://developers.webflow.com/llms.txt

## Assessment
- New information ratio: 1.0
- Questions addressed: Q4: What operational constraints exist for rate limits, pagination, errors, retries, publishing, and changelog evolution?
- Questions answered: Q4 substantially answered for documented constraints; idempotency guarantees and universal pagination semantics remain open.

## Reflection
- What worked and why: Following the official REST introduction and endpoint links recovered from invalid guessed paths and triangulating rate-limit, error, publish, CMS, and dated changelog pages produced a coherent operational model.
- What did not work and why: Standalone pagination and errors URL guesses were stale or nonexistent; the current documentation uses linked reference pages and endpoint-local guidance.
- What I would do differently: Start from `llms.txt` or the REST introduction for every subtopic, then verify endpoint-local constraints before making cross-endpoint claims.

## Recommended Next Focus
Investigate Q5: derive the safe integration and confirmation model for mcp-tooling, including the boundary between read-only planning, user confirmation, Webflow MCP actions, publishing, and sk-design pairing. Preserve the Q4 gaps around idempotency and endpoint-wide pagination as explicit unknowns rather than inferring them.
