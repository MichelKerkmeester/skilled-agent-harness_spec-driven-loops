# Deep Research Strategy - luna-fast lineage

## 1. OVERVIEW

Detached fan-out lineage for the 015-mcp-webflow Phase 1 research run. Executor: cli-opencode (openai/gpt-5.6-luna-fast, xhigh). Stop policy: max-iterations (5), convergence off (telemetry only). All artifacts are confined to this lineage directory.

## 2. TOPIC

Webflow MCP 2.0 features, followed by official Webflow MCP, developer, API, authentication, and changelog documentation.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: What did the MCP 2.0 announcement add, and which claims are confirmed by official implementation or developer docs?
- [x] Q2: What is the official MCP server surface, transport, client setup, and supported capability boundary?
- [x] Q3: What authentication, OAuth, token, scope, role, and secret-handling rules apply?
- [x] Q4: What operational constraints exist for rate limits, pagination, errors, retries, publishing, and changelog evolution?
- [x] Q5: What safe integration and confirmation model follows for mcp-tooling, including sk-design pairing?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

1. No tool installation, registration, or repository implementation.
2. No Webflow create, update, delete, publish, deploy, or other mutating calls.
3. No credentials, tokens, private site data, or production connections.
4. No unsupported capability claims based only on marketing language.
5. No edits outside this detached lineage directory.

## 5. STOP CONDITIONS

1. Run exactly five evidence-gathering iterations; convergence is telemetry only.
2. Stop early only for an unrecoverable state or safety failure, not low novelty.
3. Synthesis must preserve source citations, contradictions, negative knowledge, and open questions.
4. Resource map and final synthesis must be written inside this lineage directory.

## 6. KNOWN CONTEXT

- resource-map.md not present at init; skipping pre-existing resource-map coverage gate.
- The sibling deepseek-max lineage is a separate evidence stream and is not treated as authoritative for this lineage.
- Required starting source: https://webflow.com/blog/mcp-2-features
- Official documentation families to follow: https://developers.webflow.com/data/docs/ai-tools, https://developers.webflow.com/data/reference, https://developers.webflow.com/changelog, and the official https://github.com/webflow/mcp-server repository.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: What did the MCP 2.0 announcement add, and which claims are confirmed by official implementation or developer docs?
- Q2: What is the official MCP server surface, transport, client setup, and supported capability boundary?
- Q3: What authentication, OAuth, token, scope, role, and secret-handling rules apply?
- Q4: What operational constraints exist for rate limits, pagination, errors, retries, publishing, and changelog evolution?
- Q5: What safe integration and confirmation model follows for mcp-tooling, including sk-design pairing?

<!-- /ANCHOR:answered-questions -->

<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Fetching the supplied announcement alongside the current MCP “How it works” page, AI-tools page, and official repository separated marketing-level claims from documented capability boundaries. (iteration 1)
- Pairing current Webflow setup pages and registry metadata with the repository entrypoint, package metadata, and `mcp.ts` exposed both the deployed remote contract and the local OSS architecture. (iteration 2)
- starting from the official documentation index and following its versioned authentication references avoided stale unversioned paths and exposed the distinct OAuth, site-token, and workspace-token models. (iteration 3)
- Following the official REST introduction and endpoint links recovered from invalid guessed paths and triangulating rate-limit, error, publish, CMS, and dated changelog pages produced a coherent operational model. (iteration 4)
- combining official Webflow architecture/publish/error evidence with the local transport taxonomy exposed a clear separation between evidence retrieval, draft mutation, destructive mutation, and deployment approval. (iteration 5)

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- The repository landing page was too high-level to confirm individual MCP 2.0 tools; it links to the tool directory without presenting that inventory inline. (iteration 1)
- The repository README and current docs are version-skewed on transport and resources, so neither can independently establish complete current parity. (iteration 2)
- the initial unversioned authentication URL guesses were obsolete and returned Page Not Found; they did not provide evidence about current auth behavior. (iteration 3)
- Standalone pagination and errors URL guesses were stale or nonexistent; the current documentation uses linked reference pages and endpoint-local guidance. (iteration 4)
- live capability and staging verification were unavailable by policy, so the model cannot claim endpoint-complete behavior or a real non-production boundary. (iteration 5)

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **Idempotency certainty:** official retry/error sources describe rate-limit handling but do not establish replay safety; the smallest next evidence is endpoint-specific idempotency/replay documentation or a vendor-confirmed contract. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Idempotency certainty:** official retry/error sources describe rate-limit handling but do not establish replay safety; the smallest next evidence is endpoint-specific idempotency/replay documentation or a vendor-confirmed contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Idempotency certainty:** official retry/error sources describe rate-limit handling but do not establish replay safety; the smallest next evidence is endpoint-specific idempotency/replay documentation or a vendor-confirmed contract.

### **Staging certainty:** official setup material names a Beta server but does not document it as a production-like isolated staging environment; the smallest next evidence is a versioned Webflow environment/isolation contract. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Staging certainty:** official setup material names a Beta server but does not document it as a production-like isolated staging environment; the smallest next evidence is a versioned Webflow environment/isolation contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Staging certainty:** official setup material names a Beta server but does not document it as a production-like isolated staging environment; the smallest next evidence is a versioned Webflow environment/isolation contract.

### **Universal pagination:** the CMS guide is endpoint-scoped; the smallest next evidence is an MCP tool inventory or endpoint matrix documenting continuation semantics for each list operation. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Universal pagination:** the CMS guide is endpoint-scoped; the smallest next evidence is an MCP tool inventory or endpoint matrix documenting continuation semantics for each list operation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Universal pagination:** the CMS guide is endpoint-scoped; the smallest next evidence is an MCP tool inventory or endpoint matrix documenting continuation semantics for each list operation.

### A generic Webflow staging sandbox, idempotency key, replay guarantee, or universal pagination contract was not inferred from Beta, CMS pagination, or general API language. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A generic Webflow staging sandbox, idempotency key, replay guarantee, or universal pagination contract was not inferred from Beta, CMS pagination, or general API language.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A generic Webflow staging sandbox, idempotency key, replay guarantee, or universal pagination contract was not inferred from Beta, CMS pagination, or general API language.

### Authentication, scopes, roles, token handling, rate limits, and operational retry analysis were not expanded because they belong to later strategy questions. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Authentication, scopes, roles, token handling, rate limits, and operational retry analysis were not expanded because they belong to later strategy questions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Authentication, scopes, roles, token handling, rate limits, and operational retry analysis were not expanded because they belong to later strategy questions.

### Automatic retries for non-idempotent writes and automatic publish-after-write were rejected as unsafe without stronger Webflow guarantees. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Automatic retries for non-idempotent writes and automatic publish-after-write were rejected as unsafe without stronger Webflow guarantees.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Automatic retries for non-idempotent writes and automatic publish-after-write were rejected as unsafe without stronger Webflow guarantees.

### Calling Webflow MCP mutation tools was not attempted because the prompt explicitly forbids tool invocation; therefore no runtime mutation evidence was collected. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Calling Webflow MCP mutation tools was not attempted because the prompt explicitly forbids tool invocation; therefore no runtime mutation evidence was collected.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Calling Webflow MCP mutation tools was not attempted because the prompt explicitly forbids tool invocation; therefore no runtime mutation evidence was collected.

### Client setup, authentication, transport, rate limits, and safe integration design were deferred because they are separate strategy questions rather than this iteration's announcement-confirmation focus. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Client setup, authentication, transport, rate limits, and safe integration design were deferred because they are separate strategy questions rather than this iteration's announcement-confirmation focus.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Client setup, authentication, transport, rate limits, and safe integration design were deferred because they are separate strategy questions rather than this iteration's announcement-confirmation focus.

### Invoking remote or local Webflow MCP tools was not attempted because the dispatch forbids mutation and repository/Webflow changes; therefore no live tool inventory or runtime transport handshake was collected. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Invoking remote or local Webflow MCP tools was not attempted because the dispatch forbids mutation and repository/Webflow changes; therefore no live tool inventory or runtime transport handshake was collected.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Invoking remote or local Webflow MCP tools was not attempted because the dispatch forbids mutation and repository/Webflow changes; therefore no live tool inventory or runtime transport handshake was collected.

### Live Webflow MCP discovery, tool invocation, OAuth handshakes, credential use, mutation, publish, and deployment testing were not attempted because the dispatch forbids them. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Live Webflow MCP discovery, tool invocation, OAuth handshakes, credential use, mutation, publish, and deployment testing were not attempted because the dispatch forbids them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Live Webflow MCP discovery, tool invocation, OAuth handshakes, credential use, mutation, publish, and deployment testing were not attempted because the dispatch forbids them.

### No implementation, registry edit, `.utcp_config.json` edit, or hub packet was created; this iteration only records the model. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: No implementation, registry edit, `.utcp_config.json` edit, or hub packet was created; this iteration only records the model.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No implementation, registry edit, `.utcp_config.json` edit, or hub packet was created; this iteration only records the model.

### No non-official article, client guide, or community source was used. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No non-official article, client guide, or community source was used.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No non-official article, client guide, or community source was used.

### No Webflow MCP tool was invoked, no credential was used, and no Webflow mutation or publish call was made, per dispatch constraints. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No Webflow MCP tool was invoked, no credential was used, and no Webflow mutation or publish call was made, per dispatch constraints.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No Webflow MCP tool was invoked, no credential was used, and no Webflow mutation or publish call was made, per dispatch constraints.

### Non-official articles, community reports, and broad implementation research were excluded to preserve the supplied official-primary-source scope. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Non-official articles, community reports, and broad implementation research were excluded to preserve the supplied official-primary-source scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Non-official articles, community reports, and broad implementation research were excluded to preserve the supplied official-primary-source scope.

### Non-official authentication articles, community guidance, and third-party repositories were excluded to preserve the official Webflow-source boundary. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Non-official authentication articles, community guidance, and third-party repositories were excluded to preserve the official Webflow-source boundary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Non-official authentication articles, community guidance, and third-party repositories were excluded to preserve the official Webflow-source boundary.

### Non-official client documentation and third-party bridge repositories were excluded; only Webflow developer documentation and the official `webflow/mcp-server` repository were used. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Non-official client documentation and third-party bridge repositories were excluded; only Webflow developer documentation and the official `webflow/mcp-server` repository were used.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Non-official client documentation and third-party bridge repositories were excluded; only Webflow developer documentation and the official `webflow/mcp-server` repository were used.

### The guessed `https://developers.webflow.com/mcp/docs/quickstart` path returned “Page Not Found”; the official getting-started page linked by Webflow was used instead. `[SOURCE: https://developers.webflow.com/mcp/docs/quickstart]` -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The guessed `https://developers.webflow.com/mcp/docs/quickstart` path returned “Page Not Found”; the official getting-started page linked by Webflow was used instead. `[SOURCE: https://developers.webflow.com/mcp/docs/quickstart]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The guessed `https://developers.webflow.com/mcp/docs/quickstart` path returned “Page Not Found”; the official getting-started page linked by Webflow was used instead. `[SOURCE: https://developers.webflow.com/mcp/docs/quickstart]`

### The guessed standalone `https://developers.webflow.com/data/reference/pagination` and `/data/reference/errors` pages returned Page Not Found. The official REST introduction linked the canonical error-handling page, and the CMS workflow supplied the scoped pagination evidence. `[SOURCE: https://developers.webflow.com/data/reference/rest-introduction.md]` `[SOURCE: https://developers.webflow.com/data/reference/pagination]` `[SOURCE: https://developers.webflow.com/data/reference/errors]` -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The guessed standalone `https://developers.webflow.com/data/reference/pagination` and `/data/reference/errors` pages returned Page Not Found. The official REST introduction linked the canonical error-handling page, and the CMS workflow supplied the scoped pagination evidence. `[SOURCE: https://developers.webflow.com/data/reference/rest-introduction.md]` `[SOURCE: https://developers.webflow.com/data/reference/pagination]` `[SOURCE: https://developers.webflow.com/data/reference/errors]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The guessed standalone `https://developers.webflow.com/data/reference/pagination` and `/data/reference/errors` pages returned Page Not Found. The official REST introduction linked the canonical error-handling page, and the CMS workflow supplied the scoped pagination evidence. `[SOURCE: https://developers.webflow.com/data/reference/rest-introduction.md]` `[SOURCE: https://developers.webflow.com/data/reference/pagination]` `[SOURCE: https://developers.webflow.com/data/reference/errors]`

### Three guessed unversioned Data API auth URLs returned official “Page Not Found” responses; the official `llms.txt` index was used to locate the canonical versioned OAuth, site-token, workspace-token, and scopes references. `[SOURCE: https://developers.webflow.com/data/docs/authenticating]` `[SOURCE: https://developers.webflow.com/data/docs/oauth]` `[SOURCE: https://developers.webflow.com/data/docs/authorization]` `[SOURCE: https://developers.webflow.com/llms.txt]` -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Three guessed unversioned Data API auth URLs returned official “Page Not Found” responses; the official `llms.txt` index was used to locate the canonical versioned OAuth, site-token, workspace-token, and scopes references. `[SOURCE: https://developers.webflow.com/data/docs/authenticating]` `[SOURCE: https://developers.webflow.com/data/docs/oauth]` `[SOURCE: https://developers.webflow.com/data/docs/authorization]` `[SOURCE: https://developers.webflow.com/llms.txt]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Three guessed unversioned Data API auth URLs returned official “Page Not Found” responses; the official `llms.txt` index was used to locate the canonical versioned OAuth, site-token, workspace-token, and scopes references. `[SOURCE: https://developers.webflow.com/data/docs/authenticating]` `[SOURCE: https://developers.webflow.com/data/docs/oauth]` `[SOURCE: https://developers.webflow.com/data/docs/authorization]` `[SOURCE: https://developers.webflow.com/llms.txt]`

### Webflow MCP tool calls, OAuth handshakes, token generation, and credential testing were not attempted because the dispatch explicitly forbids MCP tool invocation and credential use. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Webflow MCP tool calls, OAuth handshakes, token generation, and credential testing were not attempted because the dispatch explicitly forbids MCP tool invocation and credential use.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Webflow MCP tool calls, OAuth handshakes, token generation, and credential testing were not attempted because the dispatch explicitly forbids MCP tool invocation and credential use.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Calling Webflow MCP mutation tools was not attempted because the prompt explicitly forbids tool invocation; therefore no runtime mutation evidence was collected. (iteration 1)
- Client setup, authentication, transport, rate limits, and safe integration design were deferred because they are separate strategy questions rather than this iteration's announcement-confirmation focus. (iteration 1)
- Non-official articles, community reports, and broad implementation research were excluded to preserve the supplied official-primary-source scope. (iteration 1)
- Authentication, scopes, roles, token handling, rate limits, and operational retry analysis were not expanded because they belong to later strategy questions. (iteration 2)
- Invoking remote or local Webflow MCP tools was not attempted because the dispatch forbids mutation and repository/Webflow changes; therefore no live tool inventory or runtime transport handshake was collected. (iteration 2)
- Non-official client documentation and third-party bridge repositories were excluded; only Webflow developer documentation and the official `webflow/mcp-server` repository were used. (iteration 2)
- The guessed `https://developers.webflow.com/mcp/docs/quickstart` path returned “Page Not Found”; the official getting-started page linked by Webflow was used instead. `[SOURCE: https://developers.webflow.com/mcp/docs/quickstart]` (iteration 2)
- Non-official authentication articles, community guidance, and third-party repositories were excluded to preserve the official Webflow-source boundary. (iteration 3)
- Three guessed unversioned Data API auth URLs returned official “Page Not Found” responses; the official `llms.txt` index was used to locate the canonical versioned OAuth, site-token, workspace-token, and scopes references. `[SOURCE: https://developers.webflow.com/data/docs/authenticating]` `[SOURCE: https://developers.webflow.com/data/docs/oauth]` `[SOURCE: https://developers.webflow.com/data/docs/authorization]` `[SOURCE: https://developers.webflow.com/llms.txt]` (iteration 3)
- Webflow MCP tool calls, OAuth handshakes, token generation, and credential testing were not attempted because the dispatch explicitly forbids MCP tool invocation and credential use. (iteration 3)
- No non-official article, client guide, or community source was used. (iteration 4)
- No Webflow MCP tool was invoked, no credential was used, and no Webflow mutation or publish call was made, per dispatch constraints. (iteration 4)
- The guessed standalone `https://developers.webflow.com/data/reference/pagination` and `/data/reference/errors` pages returned Page Not Found. The official REST introduction linked the canonical error-handling page, and the CMS workflow supplied the scoped pagination evidence. `[SOURCE: https://developers.webflow.com/data/reference/rest-introduction.md]` `[SOURCE: https://developers.webflow.com/data/reference/pagination]` `[SOURCE: https://developers.webflow.com/data/reference/errors]` (iteration 4)
- **Idempotency certainty:** official retry/error sources describe rate-limit handling but do not establish replay safety; the smallest next evidence is endpoint-specific idempotency/replay documentation or a vendor-confirmed contract. (iteration 5)
- **Staging certainty:** official setup material names a Beta server but does not document it as a production-like isolated staging environment; the smallest next evidence is a versioned Webflow environment/isolation contract. (iteration 5)
- **Universal pagination:** the CMS guide is endpoint-scoped; the smallest next evidence is an MCP tool inventory or endpoint matrix documenting continuation semantics for each list operation. (iteration 5)
- A generic Webflow staging sandbox, idempotency key, replay guarantee, or universal pagination contract was not inferred from Beta, CMS pagination, or general API language. (iteration 5)
- Automatic retries for non-idempotent writes and automatic publish-after-write were rejected as unsafe without stronger Webflow guarantees. (iteration 5)
- Live Webflow MCP discovery, tool invocation, OAuth handshakes, credential use, mutation, publish, and deployment testing were not attempted because the dispatch forbids them. (iteration 5)
- No implementation, registry edit, `.utcp_config.json` edit, or hub packet was created; this iteration only records the model. (iteration 5)

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
