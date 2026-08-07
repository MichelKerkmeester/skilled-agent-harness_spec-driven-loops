# Deep Research Strategy — Refero MCP developer surface

## 2. TOPIC

Refero MCP developer surface for a read-only `mcp-refero` transport packet: live MCP tools and schemas, authentication and `mcp-remote` transport behavior, limits and plan gating, official `refero_skill` workflows, and the boundary between Code Mode transport and `sk-design` judgment.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What tools does the live Refero MCP expose for apps, screens, flows, and elements, with which parameters, defaults, and response shapes?
- [x] What authentication, session, transport, and error behavior applies when the existing `.utcp_config.json` manual launches `mcp-remote` against `https://api.refero.design/mcp`?
- [x] What rate, pagination, result, image, and free-versus-paid limits are documented or observable, and which claims remain unknown?
- [x] How does the official `referodesign/refero_skill` repository structure UI-reference search workflows, prompts, output handling, and failure guidance?
- [x] What exact read-only Code Mode surface, `sk-design` judgment pairing, safety boundary, and verification plan should the downstream `mcp-refero` packet adopt?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Do not implement or modify the transport packet, `.utcp_config.json`, `sk-design`, or any existing skill.
- Do not treat Refero search results as design judgment or generate UI decisions without `sk-design` pairing.
- Do not claim undocumented paid-plan entitlements, rate limits, or response fields as facts.
- Do not modify `spec.md` or any continuity/memory surface outside this detached lineage.

---

## 5. STOP CONDITIONS

- Run exactly 5 iterations because `stopPolicy` is `max-iterations`; convergence before iteration 5 is telemetry only.
- Stop early only for an unrecoverable state error, explicit pause sentinel, or three consecutive failed iterations.
- Synthesis must distinguish confirmed, inferred, contradictory, and unknown claims and preserve eliminated alternatives.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What tools does the live Refero MCP expose for apps, screens, flows, and elements, with which parameters, defaults, and response shapes?
- What authentication, session, transport, and error behavior applies when the existing `.utcp_config.json` manual launches `mcp-remote` against `https://api.refero.design/mcp`?
- What rate, pagination, result, image, and free-versus-paid limits are documented or observable, and which claims remain unknown?
- How does the official `referodesign/refero_skill` repository structure UI-reference search workflows, prompts, output handling, and failure guidance?
- What exact read-only Code Mode surface, `sk-design` judgment pairing, safety boundary, and verification plan should the downstream `mcp-refero` packet adopt?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Current Mintlify documentation plus direct unauthenticated HTTP probes provided authoritative schemas and observable auth behavior without mutating the remote service. (iteration 1)
- Directly opening canonical documentation avoided stale search-index copies and the quoted GitHub API call exposed every official repository reference file. (iteration 2)
- Reading the package’s current source clarified persistent credential state and 404 fallback behavior that the README alone did not fully specify. (iteration 3)
- The existing Figma transport and design hub establish a clear transport-versus-taste precedent, while Code Mode provides the exact execution and discovery boundary. (iteration 4)
- A contradiction-oriented comparison prevented the official skill’s broad design-authority and direct-bearer setup from leaking into a deliberately narrow local transport packet. (iteration 5)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- The recursive GitHub tree query was unquoted, so zsh rejected the URL before the read-only request ran. (iteration 1)
- The public pricing page produced no structured extract, so it could not independently validate current prices or entitlements. (iteration 2)
- A credential-free research session cannot prove successful Refero token exchange, refresh, or authenticated tool listing. (iteration 3)
- Static inspection cannot prove the live authenticated Code Mode catalog or OAuth callback because doing so would create operator auth state outside this lineage. (iteration 4)
- Current public sources still cannot establish authenticated schemas, page size, burst limits, or successful token refresh. (iteration 5)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Add generic “design” as a strong Refero router keyword: it would collide with Figma and the design hub; narrow Refero/reference-research phrases are safer. [SOURCE: file:.opencode/skills/mcp-tooling/hub-router.json] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Add generic “design” as a strong Refero router keyword: it would collide with Figma and the design hub; narrow Refero/reference-research phrases are safer. [SOURCE: file:.opencode/skills/mcp-tooling/hub-router.json]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Add generic “design” as a strong Refero router keyword: it would collide with Figma and the design hub; narrow Refero/reference-research phrases are safer. [SOURCE: file:.opencode/skills/mcp-tooling/hub-router.json]

### Allow Bash because `mcp-remote` is launched with `npx`: Code Mode owns launching the existing stdio manual; the packet itself has no shell responsibility. [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:269] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Allow Bash because `mcp-remote` is launched with `npx`: Code Mode owns launching the existing stdio manual; the packet itself has no shell responsibility. [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:269]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Allow Bash because `mcp-remote` is launched with `npx`: Code Mode owns launching the existing stdio manual; the packet itself has no shell responsibility. [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:269]

### Automatically delete `~/.mcp-auth` on failures: it is credential state and destructive cleanup requires operator intent. [SOURCE: https://github.com/geelen/mcp-remote#troubleshooting] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Automatically delete `~/.mcp-auth` on failures: it is credential state and destructive cleanup requires operator intent. [SOURCE: https://github.com/geelen/mcp-remote#troubleshooting]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Automatically delete `~/.mcp-auth` on failures: it is credential state and destructive cleanup requires operator intent. [SOURCE: https://github.com/geelen/mcp-remote#troubleshooting]

### Create a standalone Refero hub or embed Refero in `sk-design`: it is an MCP bridge and belongs as a transport mode under `mcp-tooling`; design judgment remains in `sk-design`. [SOURCE: file:.opencode/skills/mcp-tooling/SKILL.md] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Create a standalone Refero hub or embed Refero in `sk-design`: it is an MCP bridge and belongs as a transport mode under `mcp-tooling`; design judgment remains in `sk-design`. [SOURCE: file:.opencode/skills/mcp-tooling/SKILL.md]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Create a standalone Refero hub or embed Refero in `sk-design`: it is an MCP bridge and belongs as a transport mode under `mcp-tooling`; design judgment remains in `sk-design`. [SOURCE: file:.opencode/skills/mcp-tooling/SKILL.md]

### Credential-free confirmation of Refero OAuth success: browser authorization and token exchange require a Refero account and would write local auth state outside the lineage. [SOURCE: https://doc.refero.design/mcp/getting-started] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Credential-free confirmation of Refero OAuth success: browser authorization and token exchange require a Refero account and would write local auth state outside the lineage. [SOURCE: https://doc.refero.design/mcp/getting-started]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Credential-free confirmation of Refero OAuth success: browser authorization and token exchange require a Refero account and would write local auth state outside the lineage. [SOURCE: https://doc.refero.design/mcp/getting-started]

### Credential-free tests cannot validate paid tool execution or OAuth refresh without violating the lineage’s no-outside-write boundary. [SOURCE: https://github.com/geelen/mcp-remote] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Credential-free tests cannot validate paid tool execution or OAuth refresh without violating the lineage’s no-outside-write boundary. [SOURCE: https://github.com/geelen/mcp-remote]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Credential-free tests cannot validate paid tool execution or OAuth refresh without violating the lineage’s no-outside-write boundary. [SOURCE: https://github.com/geelen/mcp-remote]

### Derive per-minute or concurrency limits from unauthenticated responses: the 401 responses expose no rate headers and cannot establish authenticated runtime limits. [SOURCE: https://api.refero.design/mcp] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Derive per-minute or concurrency limits from unauthenticated responses: the 401 responses expose no rate headers and cannot establish authenticated runtime limits. [SOURCE: https://api.refero.design/mcp]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Derive per-minute or concurrency limits from unauthenticated responses: the 401 responses expose no rate headers and cannot establish authenticated runtime limits. [SOURCE: https://api.refero.design/mcp]

### Encode 8,000 calls/month as a request-rate limit: it is a monthly quota; no burst/window rate is published. [SOURCE: https://doc.refero.design/mcp/getting-started] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Encode 8,000 calls/month as a request-rate limit: it is a monthly quota; no burst/window rate is published. [SOURCE: https://doc.refero.design/mcp/getting-started]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Encode 8,000 calls/month as a request-rate limit: it is a monthly quota; no burst/window rate is published. [SOURCE: https://doc.refero.design/mcp/getting-started]

### Force SSE for Refero: official Refero docs specify HTTP and `mcp-remote` already defaults to HTTP-first. [SOURCE: https://doc.refero.design/mcp/getting-started] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Force SSE for Refero: official Refero docs specify HTTP and `mcp-remote` already defaults to HTTP-first. [SOURCE: https://doc.refero.design/mcp/getting-started]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Force SSE for Refero: official Refero docs specify HTTP and `mcp-remote` already defaults to HTTP-first. [SOURCE: https://doc.refero.design/mcp/getting-started]

### Hardcode a single authenticated schema snapshot: Code Mode discovery and `tool_info` are the runtime authority, with the official docs as expected baseline. [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:285] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Hardcode a single authenticated schema snapshot: Code Mode discovery and `tool_info` are the runtime authority, with the official docs as expected baseline. [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:285]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hardcode a single authenticated schema snapshot: Code Mode discovery and `tool_info` are the runtime authority, with the official docs as expected baseline. [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:285]

### Live Code Mode tool discovery was intentionally not invoked: it can launch `mcp-remote`, trigger browser OAuth, and write credential state outside the bound artifact directory. [SOURCE: https://github.com/geelen/mcp-remote] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Live Code Mode tool discovery was intentionally not invoked: it can launch `mcp-remote`, trigger browser OAuth, and write credential state outside the bound artifact directory. [SOURCE: https://github.com/geelen/mcp-remote]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Live Code Mode tool discovery was intentionally not invoked: it can launch `mcp-remote`, trigger browser OAuth, and write credential state outside the bound artifact directory. [SOURCE: https://github.com/geelen/mcp-remote]

### Model Free as a smaller MCP plan: official Plans documentation states that Free has no MCP access. [SOURCE: https://doc.refero.design/help/plans] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Model Free as a smaller MCP plan: official Plans documentation states that Free has no MCP access. [SOURCE: https://doc.refero.design/help/plans]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Model Free as a smaller MCP plan: official Plans documentation states that Free has no MCP access. [SOURCE: https://doc.refero.design/help/plans]

### Public documentation does not disclose per-second, burst, concurrency, or retry-header behavior. [SOURCE: https://doc.refero.design/mcp/tools] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Public documentation does not disclose per-second, burst, concurrency, or retry-header behavior. [SOURCE: https://doc.refero.design/mcp/tools]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Public documentation does not disclose per-second, burst, concurrency, or retry-header behavior. [SOURCE: https://doc.refero.design/mcp/tools]

### Put bearer tokens in Code Mode calls or skill files: secrets belong in operator-controlled environment/manual configuration. [SOURCE: https://github.com/geelen/mcp-remote#custom-headers] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Put bearer tokens in Code Mode calls or skill files: secrets belong in operator-controlled environment/manual configuration. [SOURCE: https://github.com/geelen/mcp-remote#custom-headers]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Put bearer tokens in Code Mode calls or skill files: secrets belong in operator-controlled environment/manual configuration. [SOURCE: https://github.com/geelen/mcp-remote#custom-headers]

### Replace the existing manual with the upstream bearer-header example: the operator explicitly scoped the packet atop the existing `mcp-remote` manual. [SOURCE: file:.utcp_config.json:148] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Replace the existing manual with the upstream bearer-header example: the operator explicitly scoped the packet atop the existing `mcp-remote` manual. [SOURCE: file:.utcp_config.json:148]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replace the existing manual with the upstream bearer-header example: the operator explicitly scoped the packet atop the existing `mcp-remote` manual. [SOURCE: file:.utcp_config.json:148]

### Strip unknown response fields into a rigid local model: official Data Model documentation says exact fields can grow over time. [SOURCE: https://doc.refero.design/mcp/data-model] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Strip unknown response fields into a rigid local model: official Data Model documentation says exact fields can grow over time. [SOURCE: https://doc.refero.design/mcp/data-model]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Strip unknown response fields into a rigid local model: official Data Model documentation says exact fields can grow over time. [SOURCE: https://doc.refero.design/mcp/data-model]

### Treat Refero MCP as anonymously usable: the live endpoint rejects both GET and `initialize` without Bearer authorization. [SOURCE: https://api.refero.design/mcp] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treat Refero MCP as anonymously usable: the live endpoint rejects both GET and `initialize` without Bearer authorization. [SOURCE: https://api.refero.design/mcp]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treat Refero MCP as anonymously usable: the live endpoint rejects both GET and `initialize` without Bearer authorization. [SOURCE: https://api.refero.design/mcp]

### Treat search rank or image similarity as a design verdict: Refero supplies reference evidence and `sk-design` owns acceptance. [SOURCE: file:.opencode/skills/sk-design/SKILL.md:263] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treat search rank or image similarity as a design verdict: Refero supplies reference evidence and `sk-design` owns acceptance. [SOURCE: file:.opencode/skills/sk-design/SKILL.md:263]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treat search rank or image similarity as a design verdict: Refero supplies reference evidence and `sk-design` owns acceptance. [SOURCE: file:.opencode/skills/sk-design/SKILL.md:263]

### Treat the cached four-tool, numeric-ID, `limit`/`offset` documentation as current: the current official Tools page explicitly defines an eight-tool UUID/page-based surface and lists the older patterns as mistakes. [SOURCE: https://doc.refero.design/mcp/tools] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treat the cached four-tool, numeric-ID, `limit`/`offset` documentation as current: the current official Tools page explicitly defines an eight-tool UUID/page-based surface and lists the older patterns as mistakes. [SOURCE: https://doc.refero.design/mcp/tools]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treat the cached four-tool, numeric-ID, `limit`/`offset` documentation as current: the current official Tools page explicitly defines an eight-tool UUID/page-based surface and lists the older patterns as mistakes. [SOURCE: https://doc.refero.design/mcp/tools]

### Unauthenticated `tools/list`: authentication blocks live tool enumeration, so official schemas are the authoritative source until a credentialed verification is available. [SOURCE: https://api.refero.design/mcp] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Unauthenticated `tools/list`: authentication blocks live tool enumeration, so official schemas are the authoritative source until a credentialed verification is available. [SOURCE: https://api.refero.design/mcp]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Unauthenticated `tools/list`: authentication blocks live tool enumeration, so official schemas are the authoritative source until a credentialed verification is available. [SOURCE: https://api.refero.design/mcp]

### Vendor or install the upstream Refero Skill wholesale: its authority, implementation, image-generation, and QA scope conflicts with the local transport/taste separation. [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/SKILL.md] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Vendor or install the upstream Refero Skill wholesale: its authority, implementation, image-generation, and QA scope conflicts with the local transport/taste separation. [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/SKILL.md]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Vendor or install the upstream Refero Skill wholesale: its authority, implementation, image-generation, and QA scope conflicts with the local transport/taste separation. [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/SKILL.md]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Treat Refero MCP as anonymously usable: the live endpoint rejects both GET and `initialize` without Bearer authorization. [SOURCE: https://api.refero.design/mcp] (iteration 1)
- Treat the cached four-tool, numeric-ID, `limit`/`offset` documentation as current: the current official Tools page explicitly defines an eight-tool UUID/page-based surface and lists the older patterns as mistakes. [SOURCE: https://doc.refero.design/mcp/tools] (iteration 1)
- Unauthenticated `tools/list`: authentication blocks live tool enumeration, so official schemas are the authoritative source until a credentialed verification is available. [SOURCE: https://api.refero.design/mcp] (iteration 1)
- Derive per-minute or concurrency limits from unauthenticated responses: the 401 responses expose no rate headers and cannot establish authenticated runtime limits. [SOURCE: https://api.refero.design/mcp] (iteration 2)
- Encode 8,000 calls/month as a request-rate limit: it is a monthly quota; no burst/window rate is published. [SOURCE: https://doc.refero.design/mcp/getting-started] (iteration 2)
- Model Free as a smaller MCP plan: official Plans documentation states that Free has no MCP access. [SOURCE: https://doc.refero.design/help/plans] (iteration 2)
- Strip unknown response fields into a rigid local model: official Data Model documentation says exact fields can grow over time. [SOURCE: https://doc.refero.design/mcp/data-model] (iteration 2)
- Automatically delete `~/.mcp-auth` on failures: it is credential state and destructive cleanup requires operator intent. [SOURCE: https://github.com/geelen/mcp-remote#troubleshooting] (iteration 3)
- Credential-free confirmation of Refero OAuth success: browser authorization and token exchange require a Refero account and would write local auth state outside the lineage. [SOURCE: https://doc.refero.design/mcp/getting-started] (iteration 3)
- Force SSE for Refero: official Refero docs specify HTTP and `mcp-remote` already defaults to HTTP-first. [SOURCE: https://doc.refero.design/mcp/getting-started] (iteration 3)
- Put bearer tokens in Code Mode calls or skill files: secrets belong in operator-controlled environment/manual configuration. [SOURCE: https://github.com/geelen/mcp-remote#custom-headers] (iteration 3)
- Allow Bash because `mcp-remote` is launched with `npx`: Code Mode owns launching the existing stdio manual; the packet itself has no shell responsibility. [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:269] (iteration 4)
- Create a standalone Refero hub or embed Refero in `sk-design`: it is an MCP bridge and belongs as a transport mode under `mcp-tooling`; design judgment remains in `sk-design`. [SOURCE: file:.opencode/skills/mcp-tooling/SKILL.md] (iteration 4)
- Live Code Mode tool discovery was intentionally not invoked: it can launch `mcp-remote`, trigger browser OAuth, and write credential state outside the bound artifact directory. [SOURCE: https://github.com/geelen/mcp-remote] (iteration 4)
- Treat search rank or image similarity as a design verdict: Refero supplies reference evidence and `sk-design` owns acceptance. [SOURCE: file:.opencode/skills/sk-design/SKILL.md:263] (iteration 4)
- Add generic “design” as a strong Refero router keyword: it would collide with Figma and the design hub; narrow Refero/reference-research phrases are safer. [SOURCE: file:.opencode/skills/mcp-tooling/hub-router.json] (iteration 5)
- Credential-free tests cannot validate paid tool execution or OAuth refresh without violating the lineage’s no-outside-write boundary. [SOURCE: https://github.com/geelen/mcp-remote] (iteration 5)
- Hardcode a single authenticated schema snapshot: Code Mode discovery and `tool_info` are the runtime authority, with the official docs as expected baseline. [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:285] (iteration 5)
- Public documentation does not disclose per-second, burst, concurrency, or retry-header behavior. [SOURCE: https://doc.refero.design/mcp/tools] (iteration 5)
- Replace the existing manual with the upstream bearer-header example: the operator explicitly scoped the packet atop the existing `mcp-remote` manual. [SOURCE: file:.utcp_config.json:148] (iteration 5)
- Vendor or install the upstream Refero Skill wholesale: its authority, implementation, image-generation, and QA scope conflicts with the local transport/taste separation. [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/SKILL.md] (iteration 5)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Map current tools into a minimal Code Mode API and error contract. (iteration 1)
- Determine how `mcp-remote` handles Refero OAuth in the existing stdio manual and how bearer-token setups should be represented without secrets. (iteration 1)
- Inventory the repository's reference files and translate its methodology into a non-overlapping `sk-design` pairing. (iteration 1)
- Confirm all parameter constraints and detailed response fields against Data Model and Examples pages. (iteration 1)
- Separate documented monthly call quota from undocumented burst/rate limits and batch/image constraints. (iteration 1)
- Identify exact packet verification cases for auth-required, free/no-access, stale tool names, pagination, batch reduction, images, and evolving response fields. (iteration 2)
- Define Code Mode function signatures without duplicating the eight remote tools or exposing arbitrary generic MCP calls. (iteration 2)
- Specify the handoff between retrieval evidence and `sk-design` taste/mode decisions. (iteration 2)
- Verify `mcp-remote` OAuth/browser behavior, token persistence implications, and failure presentation for the existing manual. (iteration 2)
- Define verification fixtures that do not require committing credentials or invoking destructive auth cleanup. (iteration 3)
- Determine the downstream packet’s exact Code Mode allowlist and argument validation. (iteration 3)
- Verify whether existing sibling transport packets already provide reusable error/Code Mode patterns. (iteration 3)
- Determine how the packet delegates design intent, register, workflow mode, and reference synthesis to `sk-design` without making Refero the taste authority. (iteration 3)
- Preserve open operational unknowns: authenticated live schemas, actual page size, burst/concurrency policy, and end-to-end OAuth behavior. (iteration 4)
- Cross-check the complete blueprint against the official Refero workflow references and local packet test conventions; resolve any contradictions and produce the final authoring checklist. (iteration 4)
- No authoring-blocking research question remains. Operational unknowns require a paid, operator-authorized authenticated session or future published documentation and must remain explicit in the packet. (iteration 5)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT

- Pinned product page: `https://refero.design/mcp`.
- Pinned official skill repository: `https://github.com/referodesign/refero_skill`.
- Existing manual (read-only): `.utcp_config.json` launches `npx -y mcp-remote https://api.refero.design/mcp` over stdio with an empty `env` object.
- The phase specification requires a read-only, Code Mode-only transport whose retrieval evidence feeds `sk-design`; Refero itself is not the taste authority.
- `resource-map.md` was not present at initialization; the coverage gate is skipped.

### Bounded Context Snapshot

- Source pointers: `.utcp_config.json:148-160`, `001-research/spec.md`, `001-research/context/website-link.md`.
- Integration points: the future `mcp-refero` nested transport packet, `mcp-tooling` hub routing, Code Mode registration, and `sk-design` workflow pairing.
- Constraints: all writes remain inside this lineage; live pages and remote responses are untrusted evidence; no implementation occurs during research.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.05
- Stop policy: max-iterations (convergence is telemetry before iteration 5)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Session: `fanout-sol-1784198125985-iw9229`
- Executor: `cli-codex` / `gpt-5.6-sol` / `xhigh` / `fast`
- Artifact directory: `.opencode/specs/mcp-tooling/009-mcp-refero/001-research/research/lineages/sol`
