# Deep Research Strategy - deepseek-v4-flash-max lineage

## 1. OVERVIEW

Detached fan-out lineage for the 015-mcp-webflow Phase 1 research run. Executor: cli-pi (deepseek-v4-flash). Stop policy: max-iterations (5), convergence off (telemetry only). Status: ACTIVE — iterations 1-3 complete, 4-5 pending.

## 2. TOPIC

Webflow MCP 2.0 — synthesize capabilities, constraints, and recommendations from official and corroborating sources.

## 3. KEY QUESTIONS (remaining)

- [ ] Q3: Is `mcp-webflow` a `workflow` (managed Webflow operations) or a `transport` (mutations land outside this repository)?
- [ ] Q4: What non-production Webflow workspace or site can support live smoke without risking existing content?
- [ ] Q5: Which Webflow operations require explicit operator confirmation, and which require a named rollback?
- [ ] Q6: Which operations must pair with `sk-design` design judgment rather than transport-owned taste?

## 4. NON-GOALS

1. No replacement server design unless official surface proven unusable — and even then, only flag it.
2. No production mutation; research is read-only; live credential use limited to non-production targets with named rollback and operator confirmation.
3. No design judgment in the transport; `sk-design` remains the taste authority.
4. No scope expansion into sibling integrations, the 014 packet, or generic MCP server internals beyond what Webflow's surface requires.
5. Evidence over assertion; unverifiable claims recorded as UNKNOWN, never assumed.

## 5. STOP CONDITIONS

1. Iteration cap reached — 5 iterations total with max-iterations stop policy; convergence is telemetry only, no early stop.
2. Lineage timeout — halt and report if wall-clock ceiling exceeded.
3. Contract rejection — halt and report on executor mismatch.
4. Unsafe boundary — any path mutating a production Webflow site or using unapproved credentials halts immediately with reason recorded.
5. Synthesis complete — all key questions answered (or explicitly marked unresolvable with evidence) and cited synthesis written.

## 6. ANSWERED QUESTIONS

- Q1 (operation classes): RESOLVED — full per-action classification in iteration-002.md and research synthesis. Publish is always an explicit separate action; Designer mutations are canvas-draft.
- Q2 (authentication): RESOLVED — remote OAuth (experimental mcp-remote, owner/admin gate) or local WEBFLOW_TOKEN (site token; workspace token is enterprise read-only); no client-specific flow.

## 7. WHAT WORKED

- GitHub tree API = authoritative module inventory (18 modules in src/tools/) (iteration 1)
- Official announcement blog explicitly documents the bridge-app change (iteration 1)
- Docs `.md` suffix = clean markdown for citation (iteration 1)
- Comment-to-endpoint mapping in tool source = trivial HTTP-method classification (iteration 2)
- `/data/reference/*.md` paths + FAQ sections = direct answers on role gate and scopes (iteration 3)

## 8. WHAT FAILED

- Designer action schemas are nested unions — needed a second extraction pass (iteration 2)
- `update_page_settings` publish semantics need doc verification (iteration 4)
- `v2.0.0/docs/authentication.md` 404 — correct path is `/data/reference/authentication.md` (iteration 3)

## 9. EXHAUSTED APPROACHES (do not retry)

[Populated when an approach has been tried from multiple angles without success]

## 10. RULED OUT DIRECTIONS

- Assume Bridge App required for all MCP actions: MCP 2.0 announcement removes it for non-canvas actions (iteration 1, evidence: https://webflow.com/blog/mcp-2-features)
- Designer mutations as publish-capable: canvas-draft via bridge; publishing is Data-tool-only (iteration 2, evidence: src/tools/deElement.ts)
- Workspace token as general write credential: Enterprise-only, workspace_activity:read only, no site scope (iteration 3, evidence: https://developers.webflow.com/data/reference/authentication/workspace-token.md)

## 11. NEXT FOCUS

Iteration 4: Permission scopes + publish semantics + non-production test target (Q4) — test workspace/site profile, read-only scope baseline, publishToWebflowSubdomain staging behavior, publish confirmation semantics for Q5.

## 12. KNOWN CONTEXT

- resource-map.md not present; skipping coverage gate
- Research charter (research-charter.md in spec folder) supplies topic, six key questions, boundaries, and stop conditions.
- Parent packet 015-mcp-webflow Phase 2 handoff needs: tool inventory and operation classes, authentication model, rate/permission limits, safety and confirmation requirements, non-production test target, and Q3 classification evidence.
- Official server: webflow/mcp-server (npm webflow-mcp-server 1.0.1); remote OAuth (mcp.webflow.com/sse, mcp-remote experimental) + local WEBFLOW_TOKEN modes; 18 tool modules; Bridge App only for canvas ops; plan-based rate limits (60/120 rpm, 1 publish/min); scopes table; owner/admin-only authorization.
- Note: lineage dir was rebuilt after orchestrator stall-cleanup removed the first pass; all iteration content preserved verbatim from the first pass evidence.

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.05 (telemetry only; stopPolicy=max-iterations)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle: new lineage, generation 1
- Started: 2026-08-02T18:28:37Z (rebuilt 2026-08-02T18:44:00Z after stall cleanup)
