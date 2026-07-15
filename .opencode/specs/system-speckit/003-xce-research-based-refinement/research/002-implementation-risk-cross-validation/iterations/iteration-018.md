# Iteration 009 - IRQ9 LLM-Enrichment Dispatch Shape

## Focus

IRQ9 cross-validated Phase 003 P1 REQ-007: optional `enrichWithLLM: true` narrative generation for `code_graph_impact_analysis`. The core question is where the LLM call belongs without leaking the rejected XCE-style SaaS dependency back into a local-first MCP server.

## Actions Taken

- Read Phase 003's impact-analysis contract: deterministic risk signals plus optional LLM enrichment are named in the executive summary and key decisions (`003-code-graph-impact-analysis/spec.md:35-59`), scope includes a new `code-graph-llm-risk-enrich.ts` adapter (`003-code-graph-impact-analysis/spec.md:92-102`), REQ-007 says `enrichWithLLM: true` adds a narrative (`003-code-graph-impact-analysis/spec.md:125-129`), success criteria require zero LLM dependency by default (`003-code-graph-impact-analysis/spec.md:135-140`), and open questions still ask cli-opencode vs direct API (`003-code-graph-impact-analysis/spec.md:192-196`).
- Read Phase 003 plan Phase 6: it currently says the adapter calls a cli-opencode subprocess with the risk-signal payload (`003-code-graph-impact-analysis/plan.md:36-39`), while dependencies label Phase 001/002 as optional context for enrichment only (`003-code-graph-impact-analysis/plan.md:46-50`).
- Read cli-opencode provider/auth and invocation rules: configured providers include `opencode-go` as DEFAULT, `deepseek` fallback, and `openai` premium (`.opencode/skills/cli-opencode/SKILL.md:174-179`); provider preflight is mandatory before dispatch (`.opencode/skills/cli-opencode/SKILL.md:180-222`); the default invocation uses `opencode-go/deepseek-v4-pro` through the OpenCode Go gateway (`.opencode/skills/cli-opencode/SKILL.md:224-240`); `</dev/null` is mandatory for non-interactive redirected calls (`.opencode/skills/cli-opencode/SKILL.md:281-292`).
- Read the 097 stdin fix: `opencode run` blocks on startup stdin without `</dev/null` under redirected automation (`.opencode/skills/cli-opencode/CHANGELOG-2026-05-08-stdin-redirect-fix.md:7-12`, `.opencode/skills/cli-opencode/CHANGELOG-2026-05-08-stdin-redirect-fix.md:45-59`), and the fix was verified with real output after adding the redirect (`.opencode/skills/cli-opencode/CHANGELOG-2026-05-08-stdin-redirect-fix.md:117-146`).
- Read the tool-name regex fix: both `opencode-go` gateway and direct `deepseek/*` provider were affected by strict provider tool-name validation (`.opencode/skills/cli-opencode/CHANGELOG-2026-05-08-tool-name-regex-fix.md:7-14`), and post-fix direct DeepSeek smoke tests succeeded (`.opencode/skills/cli-opencode/CHANGELOG-2026-05-08-tool-name-regex-fix.md:150-166`).
- Read prior subprocess reliability findings: iter 005 confirms `</dev/null` fixes startup deadlock but not lifecycle cleanup, auth preflight, mixed failure schema, or scale testing for repeated subprocesses (`027-xce-research-based-refinement-pt-02/iterations/iteration-005.md:20-48`).
- Read parent findings SKIP decisions: XCE's SaaS MCP endpoint and centralized xanther.ai dependency were explicitly rejected because context resolution should stay local Stdio + SQLite with zero external service dependency (`research/findings.md:58-62`).
- Read local inference and existing MCP-server ML surfaces: `@huggingface/transformers` is a hard dependency and `node-llama-cpp` is optional (`mcp_server/package.json:49-64`); the local GGUF reranker dynamically imports `node-llama-cpp` (`mcp_server/lib/search/local-reranker.ts:84-90`) and only runs when `RERANKER_LOCAL=true`, enough RAM exists, and the model file is present (`mcp_server/lib/search/local-reranker.ts:206-232`); cross-encoder reranking can use Voyage/Cohere SaaS or local (`mcp_server/lib/search/cross-encoder.ts:1-19`, `mcp_server/lib/search/cross-encoder.ts:219-230`); graph lifecycle exposes an LLM backfill callback but defaults to no-op unless registered (`mcp_server/lib/search/graph-lifecycle.ts:617-650`); the public provider API exports embeddings only (`mcp_server/api/providers.ts:7-13`).

## Findings

### f-iter009-001 - BLOCKING - cli-opencode must not be the implicit default for `enrichWithLLM`

Evidence: Phase 003 currently says the LLM adapter calls cli-opencode (`003-code-graph-impact-analysis/plan.md:36-39`), and cli-opencode's default model is `opencode-go/deepseek-v4-pro` through the OpenCode Go gateway (`.opencode/skills/cli-opencode/SKILL.md:224-240`). The parent findings explicitly rejected a remote MCP endpoint and centralized SaaS dependency for context resolution (`research/findings.md:58-62`). Even though cli-opencode is consistent with the broader stack, making it the implicit enrichment route introduces a network dependency on every opted-in impact call.

Verdict: BLOCKING. Amend Phase 003 so `enrichWithLLM: true` does not imply a default remote provider. The contract should require explicit provider configuration, or return `llmEnrichment: {status:"skipped", reason:"provider_not_configured"}`.

### f-iter009-002 - BLOCKING - `opencode-go` is a SaaS gateway, not local-first

Evidence: cli-opencode documents `opencode-go` as the default API provider and says it routes DeepSeek and other open models through a single gateway (`.opencode/skills/cli-opencode/SKILL.md:174-179`, `.opencode/skills/cli-opencode/SKILL.md:224-240`). That gateway is operationally useful for external dispatch, but it is still a hosted intermediary between the MCP server and the model.

Verdict: BLOCKING for default selection. Option A contradicts local-first if used automatically. It can remain an explicit operator-selected remote mode with provider preflight, timeout, redaction, and cost budget.

### f-iter009-003 - BLOCKING - Direct `deepseek/*` avoids the gateway but not SaaS

Evidence: cli-opencode lists direct `deepseek/*` as a fallback requiring user approval when the default is missing (`.opencode/skills/cli-opencode/SKILL.md:192-210`) and says direct `deepseek/*` remains available when explicitly requested (`.opencode/skills/cli-opencode/SKILL.md:238-240`). The regex fix verified direct DeepSeek dispatch after cleanup (`.opencode/skills/cli-opencode/CHANGELOG-2026-05-08-tool-name-regex-fix.md:150-166`), but that still calls DeepSeek's hosted API.

Verdict: BLOCKING for default selection. Option B is less gateway-coupled than Option A but remains a hosted-provider dependency. Treat it as explicit opt-in, not local-first.

### f-iter009-004 - CONFIRMED - The MCP server has local ML primitives, not a reusable narrative LLM client

Evidence: the public provider surface exports embedding functions only (`mcp_server/api/providers.ts:7-13`). Graph lifecycle can schedule LLM backfill, but it only calls a registered callback and is a no-op without one (`mcp_server/lib/search/graph-lifecycle.ts:617-650`). Local inference exists as a GGUF reranking path via `node-llama-cpp`, but it is scoring-oriented and heavily precondition-gated (`mcp_server/lib/search/local-reranker.ts:84-90`, `mcp_server/lib/search/local-reranker.ts:206-232`). Cross-encoder reranking supports external rerank APIs or local rerank provider selection, not general text generation (`mcp_server/lib/search/cross-encoder.ts:1-19`, `mcp_server/lib/search/cross-encoder.ts:219-230`).

Verdict: CONFIRMED. Option C is directionally correct for SaaS-free enrichment, but it is not already available as a drop-in narrative client. Phase 003 should define an `LlmNarrativeProvider` interface and implement `none` plus optionally `local` later, rather than trying to reuse reranker internals.

### f-iter009-005 - BLOCKING - `enrichWithLLM` needs auth, provider, and budget fields in the contract

Evidence: cli-opencode requires provider auth preflight before dispatch and asks before substituting configured fallbacks (`.opencode/skills/cli-opencode/SKILL.md:180-222`). Iteration 005 already found missing preflight and result schemas to be blocking for repeated subprocess dispatch (`027-xce-research-based-refinement-pt-02/iterations/iteration-005.md:26-36`). Phase 003 only has a boolean flag and a narrative acceptance criterion (`003-code-graph-impact-analysis/spec.md:125-129`), while its risk table only mentions latency and cost mitigated by opt-in (`003-code-graph-impact-analysis/spec.md:148-153`).

Verdict: BLOCKING. Replace the boolean-only contract with an explicit enrichment options object: `{enabled, provider, model?, maxCallsPerSession?, timeoutMs?, maxInputBytes?, cacheKey?}`. The handler should enforce a default session budget of zero or one unless configured.

### f-iter009-006 - CONFIRMED - Remote LLM calls are different from adopting XCE's SaaS endpoint, but they still leak dependency if automatic

Evidence: SKIP-2 and SKIP-3 reject XCE's hosted MCP endpoint and centralized xanther.ai dependency for context resolution (`research/findings.md:58-62`). A provider call for a single narrative is not the same architecture as replacing local graph search with `mcp.xanther.ai`, because deterministic risk scoring remains local (`003-code-graph-impact-analysis/spec.md:56-59`, `003-code-graph-impact-analysis/spec.md:135-140`). The contradiction appears only if the remote call is hidden behind a default or required for useful output.

Verdict: CONFIRMED with boundary. Remote enrichment is acceptable only as explicit, auditable, optional augmentation. It must never be required for the tool's core answer, and disabled/unconfigured runs must still return complete deterministic output.

### f-iter009-007 - BLOCKING - Subprocess enrichment inherits 097 and iter-005 reliability requirements

Evidence: cli-opencode requires `</dev/null` on non-interactive redirected invocations (`.opencode/skills/cli-opencode/SKILL.md:281-292`), and 097 explains that this fixes a startup stdin deadlock (`.opencode/skills/cli-opencode/CHANGELOG-2026-05-08-stdin-redirect-fix.md:45-59`). Iter 005 shows this does not cover lifecycle cleanup, close-event waiting, auth preflight, or mixed timeout/failure records (`027-xce-research-based-refinement-pt-02/iterations/iteration-005.md:20-48`). Phase 003's current adapter line is too small to carry those requirements (`003-code-graph-impact-analysis/plan.md:36-39`).

Verdict: BLOCKING if cli-opencode remains an option. Add a subprocess helper contract with `stdio: ['ignore', ...]` or `</dev/null`, provider preflight, timeout, SIGTERM/SIGKILL cleanup, bounded payload, structured skipped/failed enrichment result, and redaction of file contents/secrets before prompt construction.

## Questions Answered

- Where does the LLM call go? Default path: nowhere. The tool should ship deterministic output first. `enrichWithLLM` should route through an explicit `LlmNarrativeProvider` interface and return skipped unless a provider is configured.
- Is `opencode-go` SaaS? Yes. It is a hosted gateway provider documented as routing DeepSeek and other open models through a single gateway (`.opencode/skills/cli-opencode/SKILL.md:224-240`).
- Is direct `deepseek/deepseek-v4-pro` local-first? No. It bypasses the opencode-go gateway but still calls DeepSeek's hosted API.
- Does Option A/B contradict SKIP-2/SKIP-3? As defaults, yes. As explicit opt-in narrative augmentation, no, provided deterministic local output remains complete and the remote call is auditable/skippable.
- Is there an existing MCP-server LLM client? Not a general narrative client. Existing surfaces are embeddings, callback-only graph backfill, cross-encoder/reranker infrastructure, and optional local GGUF reranking.
- What is the right default? Option D: no default provider. If the spec wants a SaaS-free enrichment default later, make it Option C-local only after a dedicated local narrative adapter exists and gracefully skips when model prerequisites are absent.
- Where should auth live? Remote auth should remain in the chosen provider layer, preferably cli-opencode preflight for cli-opencode mode or env vars for direct APIs. The MCP handler should not scrape `~/.local/share/opencode/auth.json`; it should only observe configured provider status or receive env-backed config.
- How to avoid 100 impact calls causing 100 LLM calls? Make enrichment opt-in plus budgeted, cached, and bounded: session call limit, payload hash cache, timeout, max payload bytes, and a structured `skipped: budget_exhausted` result.

## Questions Remaining

- Should Phase 003 expose `provider` in the MCP tool schema, or read provider config only from env/server config to avoid clients choosing remote providers ad hoc?
- Should local narrative generation use a small GGUF through `node-llama-cpp`, a transformers.js text-generation model, or remain deferred until Phase 005 can evaluate latency and quality?
- Should narrative enrichment include source snippets, or only risk signals and file paths? Signals-only is safer for secret leakage but weaker semantically.

## Next Focus

IRQ10 - Phasing-order optimization: recommended order 004 -> 001 -> {002,003} parallel -> 005; verify hidden coupling and whether Phase 003 actually needs Phase 001's HLD layer info.
