# Iteration 5: Safe mcp-tooling integration and confirmation model

## Focus
Investigate Q5: derive a safe integration and confirmation model for a future Webflow MCP transport in `mcp-tooling`, including the mandatory `sk-design` pairing. The selected interpretation is an adapter-governance model, not an implementation or live Webflow verification. Staging isolation, idempotency semantics, and universal pagination remain explicitly unresolved.

## Findings

### Source-backed facts

1. **Webflow's remote MCP is a privileged, externally governed transport.** The documented remote server uses OAuth, avoids local API-key storage, and routes most work through the Data API; the Bridge App is only required for live Designer state such as snapshots, selection, page/mode/branch, canvas navigation, and breakpoints. Webflow says MCP operations are bounded by the user's permissions, roles, and custom roles, and records agent changes in the site's activity log. The setup documentation also distinguishes the main server from a Beta server for in-development functionality, without describing Beta as an isolated staging environment. `[SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md]` `[SOURCE: https://developers.webflow.com/mcp/reference/getting-started.md]`

2. **Publishing is a separate, high-blast-radius deployment boundary.** The official publish endpoint requires `sites:write`, accepts a site or page scope and explicit domain/subdomain inputs, returns `202` when the request is accepted, and limits successful publish queues to one per minute. Publishing staged pages to production publishes all staged changes, so a page-level write does not by itself imply a page-level production deployment. `[SOURCE: https://developers.webflow.com/data/reference/sites/publish]` `[SOURCE: https://developers.webflow.com/data/docs/working-with-the-cms/manage-collections-and-items.md]`

3. **The repository's integration conventions already separate transport, judgment, and mutation authority.** `mcp-tooling` is a registry-driven hub with thin routing logic; transport packets are declared `mutatesWorkspace:false`, forbid `Write`/`Edit`/`Task`, and require `sk-design` for design decisions. The `sk-design` hub requires intake, a visible plan, proof expectations, and a return of transport evidence to the selected judgment mode; its transport packets never own taste or readiness acceptance. `[SOURCE: .opencode/skills/mcp-tooling/SKILL.md:13-15]` `[SOURCE: .opencode/skills/mcp-tooling/SKILL.md:51-66]` `[SOURCE: .opencode/skills/mcp-tooling/SKILL.md:138-161]` `[SOURCE: .opencode/skills/mcp-tooling/mode-registry.json:17-29]` `[SOURCE: .opencode/skills/sk-design/SKILL.md:56-67]` `[SOURCE: .opencode/skills/sk-design/SKILL.md:181-191]`

### Integration recommendations

4. **Use a five-level action taxonomy and a confirmation state machine.** Classify Webflow calls as: (a) **read-only** — resources, guide/schema reads, list/get/inspect, and read-back verification; (b) **draft/write** — create/update content, styles, pages, assets, CMS data, or other site state without publishing; (c) **destructive** — delete, clear, bulk replacement, or irreversible custom-code/content operations; (d) **publish** — any call that queues a Webflow publish; and (e) **deployment** — the production-facing consequence of publish, treated as a distinct gate rather than an automatic follow-on. The adapter should freely expose only read-only calls after exact tool/schema discovery; generate a write preview for draft/write calls; require confirmation containing the exact target, scope, parameters, expected postcondition, and rollback/read-back plan; require a stronger confirmation with explicit identifiers and duplicate/snapshot or other rollback for destructive calls; and require a fresh, separate confirmation for publish/deployment naming the site/page scope and domains. This is an inference from Webflow's publish boundary and the repository's established read-only/mutating/destructive taxonomy, explicit-target rule, rollback ceremony, and dry-run-before-write pattern. `[INFERENCE: based on https://developers.webflow.com/data/reference/sites/publish, .opencode/skills/mcp-tooling/mcp-figma/references/tool-surface.md:46-55, .opencode/skills/mcp-tooling/mcp-figma/references/tool-surface.md:169-205, and .opencode/skills/mcp-tooling/mcp-click-up/examples/README.md:89-98]`

5. **Fail closed on the three safety gaps rather than inventing guarantees.** Treat the absence of an official staging-sandbox/non-production credential contract as unresolved: require an explicitly operator-selected test site/workspace or approved staging domain, and never infer that the Beta server is isolated. Treat idempotency as unresolved: the consulted Webflow error, retry, and publish material documents `Retry-After` and SDK exponential backoff but no idempotency-key or replay guarantee. Therefore retry only bounded, clearly retryable transport/rate-limit failures, honor `Retry-After`, and after an ambiguous timeout perform a read-back or stop for operator review instead of replaying a non-idempotent write. Keep OAuth as the default remote path; do not place tokens in manuals, source, logs, or user-facing output, and if a local stdio path is ever supported, inject its token through the runtime secret mechanism rather than packet files. `[SOURCE: https://developers.webflow.com/mcp/reference/getting-started.md]` `[SOURCE: https://developers.webflow.com/data/reference/error-handling.md]` `[SOURCE: https://developers.webflow.com/data/reference/rate-limits]` `[SOURCE: https://github.com/webflow/mcp-server]` `[INFERENCE: no staging-isolation, idempotency-key, or replay guarantee is established by the consulted official sources]`

6. **Make pagination and capability drift tool-specific, observable, and conservative.** The official CMS workflow establishes offset pagination with `limit` capped at 100 for that workflow, but does not establish one pagination contract for every MCP/Data API operation. The adapter should require per-tool pagination metadata or a discovered continuation schema, stop when the schema is absent or contradictory, and never claim universal pagination. It should also keep a version/changelog check in the preflight because the consulted changelog changed the `translatable` contract within two days; a successful request today is not proof that a recently changed parameter is stable. `[SOURCE: https://developers.webflow.com/data/docs/working-with-the-cms/manage-collections-and-items.md]` `[SOURCE: https://developers.webflow.com/home/changelog/2026/7/27.md]` `[SOURCE: https://developers.webflow.com/home/changelog/2026/7/29.md]` `[INFERENCE: endpoint-scoped pagination evidence and rapid documented contract evolution require capability-specific discovery and version-aware preflight]`

## Action classification and confirmation model

| Class | Default posture | Required confirmation/evidence |
|---|---|---|
| Read-only | Allow after discovery; no external mutation | Exact callable/schema, target site/workspace, bounded result set, and read-back citations |
| Draft/write | Preview first; never silently batch | Exact target and fields, scope, expected postcondition, rollback/read-back plan, then explicit approval |
| Destructive | Omit from default route | Explicit identifiers, effect summary, duplicate/snapshot or stated rollback, then explicit approval; no active-target fallback |
| Publish | Separate gate after writes verify | Site/page scope, all domains, staged-change blast radius, `sites:write`, and fresh approval; `202` means queued, not completed |
| Deployment | Never infer from write success | Separate production decision, publish-status verification, and operator-visible completion evidence |

The table is a recommended adapter policy, not a claim that every Webflow MCP tool has been inventoried. `[INFERENCE: based on Webflow's documented role/publish/error boundaries and local mcp-tooling confirmation conventions]`

## Ruled Out

- Live Webflow MCP discovery, tool invocation, OAuth handshakes, credential use, mutation, publish, and deployment testing were not attempted because the dispatch forbids them.
- No implementation, registry edit, `.utcp_config.json` edit, or hub packet was created; this iteration only records the model.
- A generic Webflow staging sandbox, idempotency key, replay guarantee, or universal pagination contract was not inferred from Beta, CMS pagination, or general API language.
- Automatic retries for non-idempotent writes and automatic publish-after-write were rejected as unsafe without stronger Webflow guarantees.

## Dead Ends

- **Staging certainty:** official setup material names a Beta server but does not document it as a production-like isolated staging environment; the smallest next evidence is a versioned Webflow environment/isolation contract.
- **Idempotency certainty:** official retry/error sources describe rate-limit handling but do not establish replay safety; the smallest next evidence is endpoint-specific idempotency/replay documentation or a vendor-confirmed contract.
- **Universal pagination:** the CMS guide is endpoint-scoped; the smallest next evidence is an MCP tool inventory or endpoint matrix documenting continuation semantics for each list operation.

## Edge Cases

- Ambiguous input: “safe integration” was interpreted as adapter governance and confirmation policy, not code architecture or live setup.
- Contradictory evidence: none introduced in this iteration; prior transport/version contradictions remain outside this focus and are not silently resolved.
- Missing dependencies: live Webflow tool inventory and credentials were intentionally unavailable; official docs and local conventions were used as the fallback evidence.
- Partial success: the action model is evidence-backed, but staging isolation, idempotency/replay, and universal pagination remain open; status is complete for the in-scope recommendation with these limits preserved.

## Sources Consulted

- https://developers.webflow.com/mcp/reference/how-it-works.md
- https://developers.webflow.com/mcp/reference/getting-started.md
- https://developers.webflow.com/data/reference/sites/publish
- https://developers.webflow.com/data/reference/error-handling.md
- https://developers.webflow.com/data/reference/rate-limits
- https://developers.webflow.com/data/docs/working-with-the-cms/manage-collections-and-items.md
- https://developers.webflow.com/home/changelog/2026/7/27.md
- https://developers.webflow.com/home/changelog/2026/7/29.md
- https://github.com/webflow/mcp-server
- `.opencode/skills/mcp-tooling/SKILL.md:13-15,51-66,138-161`
- `.opencode/skills/mcp-tooling/mode-registry.json:17-29,137-229`
- `.opencode/skills/mcp-tooling/mcp-figma/references/tool-surface.md:46-55,169-205,209-229`
- `.opencode/skills/mcp-tooling/mcp-click-up/examples/README.md:89-98`
- `.opencode/skills/sk-design/SKILL.md:56-67,164-191,219-237,279-285`
- `.opencode/skills/mcp-tooling/mcp-mobbin/manual-testing-playbook/pairing/sk-design-pairing.md:13-33,39-55`

## Assessment

- New information ratio: **0.93** (four model findings are fully new, two extend prior Webflow operational facts; a +0.10 simplicity bonus is applied for consolidating the evidence into a staged confirmation model, capped below 1.0).
- Questions addressed: Q5 safe action classification, confirmation gates, permission/secret posture, retry limits, staging handling, idempotency handling, pagination handling, and `sk-design` pairing.
- Questions answered: Q5 substantially answered for the recommended governance model; staging isolation, idempotency/replay, and universal pagination remain unanswered.

## Reflection

- What worked and why: combining official Webflow architecture/publish/error evidence with the local transport taxonomy exposed a clear separation between evidence retrieval, draft mutation, destructive mutation, and deployment approval.
- What did not work and why: live capability and staging verification were unavailable by policy, so the model cannot claim endpoint-complete behavior or a real non-production boundary.
- What I would do differently: next verification should obtain a versioned Webflow staging/isolation statement and endpoint-specific idempotency/pagination contracts before any implementation plan treats them as guarantees.

## Recommended Next Focus

The research loop is at its configured maximum. Handoff to synthesis should preserve the five-level action taxonomy, separate draft/write from publish/deployment, require `sk-design` before design-affecting work, and list staging isolation, idempotency/replay, and universal pagination as explicit implementation blockers rather than silently filling them with defaults.
