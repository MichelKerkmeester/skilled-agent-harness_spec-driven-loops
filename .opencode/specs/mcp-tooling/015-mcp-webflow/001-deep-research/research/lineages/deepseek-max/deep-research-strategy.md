# Deep Research Strategy - deepseek-max lineage

## 1. OVERVIEW

Detached fan-out lineage for the 015-mcp-webflow Phase 1 research run. Executor: cli-pi (deepseek-v4-flash). Stop policy: max-iterations (5), convergence off (telemetry only). Status: COMPLETE — synthesis written, config.status=complete.

## 2. TOPIC

Webflow MCP 2.0 — synthesize capabilities, constraints, and recommendations from official and corroborating sources.

## 3. KEY QUESTIONS (remaining)

(none — all six answered; see Section 7)

## 4. NON-GOALS

1. No replacement server design; official surface proven usable.
2. No production mutation; research read-only.
3. No design judgment in the transport; sk-design is the taste authority.
4. No scope expansion into sibling integrations or generic MCP internals.
5. Evidence over assertion; unverifiable claims marked UNKNOWN.

## 5. STOP CONDITIONS

1. Iteration cap reached (5) with max-iterations stop policy — SATISFIED (telemetry-only convergence, no early stop).
2. Lineage timeout — not triggered.
3. Contract rejection — not triggered.
4. Unsafe boundary — not triggered (research read-only; no credentials used).
5. Synthesis complete — SATISFIED (research/research.md written with all required coverage).

## 6. KNOWN CONTEXT

- resource-map.md not present; skipping coverage gate
- Official server: webflow/mcp-server (npm webflow-mcp-server 1.0.1); remote OAuth (mcp.webflow.com/sse, mcp-remote experimental) and local WEBFLOW_TOKEN modes; 18 tool modules; Bridge App only for canvas ops; plan-based rate limits (60/120 rpm, 1 publish/min); publish to webflow.io staging subdomain vs custom domains; scopes table; owner/admin-only authorization; hub transport-leaf layout.

## 7. ANSWERED QUESTIONS

- Q1: operation classes enumerated per module/action (research.md Section 4).
- Q2: remote OAuth (experimental) + local bearer token (site/workspace/OAuth); no client-specific flow.
- Q3: mcp-webflow is a TRANSPORT (hub leaf layout + mutations land in Webflow cloud).
- Q4: dedicated test workspace + test site; read-only scopes baseline; staging-subdomain publish.
- Q5: publish/destructive/deploy classes confirmation-gated; staged-first rollback; API restore UNKNOWN.
- Q6: Designer-family ops pair with sk-design; Data-family ops do not.

## 8. WHAT WORKED

- GitHub API tree + per-module zod-schema extraction = authoritative action inventory.
- Official docs .md suffix = clean markdown for citations.
- Scopes + publish references made Q4/Q5 concrete.
- Hub layout inspection grounded Q3 classification.

## 9. WHAT FAILED

- README `./tools` path stale (repo uses src/tools/).
- Several guessed doc slugs 404; sitemap + llms.txt needed for discovery.
- Single-page ai-tools doc hides per-section content behind JS; .md export fixed that.

## 10. EXHAUSTED APPROACHES

- npm webflow-mcp as server package (third-party).
- Workspace token as general write credential (no site scope).
- API site duplication/backup for test scaffolding (not in API).
- CMS mutations as implicitly draft-safe (live-site mutation possible).
- mcp-webflow as a workflow system (transport executes; hub orchestrates).

## 11. RULED-OUT DIRECTIONS

See Section 10 and research.md "Eliminated Alternatives".

## 12. NEXT FOCUS

None — lineage complete. Handoff: research/research.md feeds the 015 packet's Phase 2 architecture/safety contract (permission surface, auth choice, confirmation/rollback policy).
