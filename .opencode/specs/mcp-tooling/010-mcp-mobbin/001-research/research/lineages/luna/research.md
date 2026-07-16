# Mobbin MCP developer surface — detached research synthesis

**Lineage:** `luna`  
**Session:** `fanout-luna-1784199634206-lfqjyo`  
**Loop:** `research`, 3 iterations, `max-iterations`  
**Artifact root:** `.opencode/specs/mcp-tooling/010-mcp-mobbin/001-research/research/lineages/luna`

## 1. Executive Summary

Mobbin's official design-reference MCP is a hosted Streamable HTTP server at `https://api.mobbin.com/mcp`. Its documented authorization model is browser OAuth, not a static Mobbin API key. MCP access is documented for Pro, Team, and Enterprise; Free is not documented as eligible. [SOURCE: https://github.com/mobbin/mobbin-mcp-server/blob/main/server.json] [SOURCE: https://docs.mobbin.com/mcp/introduction] [SOURCE: https://docs.mobbin.com/mcp/build-an-integration]

The official `mobbin/skills` repository currently documents `mobbin-search`. Its concrete MCP operation is `search_screens`, which returns screen metadata, Mobbin/image links, failure entries, and inline image blocks for visual inspection. App, screen, flow, and element intent should be expressed through precise query terms unless authenticated discovery proves additional tools. [SOURCE: https://github.com/mobbin/skills/blob/main/skills/mobbin-search/SKILL.md]

For this repository, author `mcp-mobbin` as a read-only transport whose only execution surface is Code Mode's `mcp__code_mode__call_tool_chain`. Register a `mobbin` MCP manual using the local `mcp-remote` adapter to the official URL, with no API-key environment variable. Discover the live prefixed tool name and schema after OAuth before invoking it. Pair retrieved evidence with `sk-design` for judgment; the transport must never make design decisions or write an evidence board.

## 2. Scope and Boundary

This synthesis covers only the developer surface needed for the `mcp-mobbin` transport packet and a future `mobbin` entry in `.utcp_config.json`:

- official server identity, endpoint, transport, auth, installation, and plan gate;
- official skill workflow for app/screen/flow/element design research;
- a Code Mode-compatible UTCP manual shape;
- read-only and `sk-design` pairing invariants;
- runtime validation gates and explicit unknowns.

This detached lineage wrote only under its bound artifact root. It did not modify `.utcp_config.json`, the parent spec, `.opencode/skills`, continuity/memory state, shared telemetry, or git state. The `resolveArtifactRoot` node was skipped because the configured fan-out override bound `artifact_dir` directly.

## 3. Research Questions

1. What official Mobbin MCP endpoint and transport must the packet target?
2. Does MCP use OAuth or an API key, and what plans are eligible?
3. What concrete search workflow and response shape does the official skills repo publish?
4. How should app, screen, flow, and element research be represented without inventing tools?
5. What UTCP shape is accepted by this repository's Code Mode configuration?
6. What read-only, Code Mode-only, and `sk-design` pairing rules belong in the packet?
7. Which facts still require an authenticated live MCP discovery call?

## 4. Method and Source Quality

The loop used three broadened evidence passes:

1. first-party GitHub repository files plus read-only endpoint/discovery probes;
2. first-party Mobbin MCP documentation and the raw official skills file;
3. local Code Mode validation/configuration and mcp-tooling transport exemplars, reconciled against the official sources.

The endpoint, manifest, OAuth, plan, skill, and installation claims are first-party. Local packet invariants are repository contract evidence. No unauthenticated probe was treated as proof of the authenticated tool inventory: the `401` response confirms protected-resource behavior only. Exact `tools/list` schemas remain explicitly unknown.

## 5. Source Inventory

The emitted [resource map](./resource-map.md) records the full source inventory. The highest-value sources are:

- official server manifest and client config: [server.json](https://github.com/mobbin/mobbin-mcp-server/blob/main/server.json), [mcp.json](https://github.com/mobbin/mobbin-mcp-server/blob/main/mcp.json);
- official OAuth integration guide: [Mobbin MCP integration](https://docs.mobbin.com/mcp/build-an-integration);
- official plan overview: [Mobbin MCP introduction](https://docs.mobbin.com/mcp/introduction);
- official workflow: [mobbin-search SKILL.md](https://github.com/mobbin/skills/blob/main/skills/mobbin-search/SKILL.md);
- local Code Mode shape: `file:.opencode/skills/mcp-code-mode/references/configuration.md` and `file:.opencode/skills/mcp-code-mode/scripts/validate_config.py`;
- local transport/pairing contract: `file:.opencode/skills/mcp-tooling/mode-registry.json` and `file:.opencode/skills/mcp-tooling/SKILL.md`.

## 6. Official Server Identity

The official server manifest names the server `com.mobbin/mobbin`, version `1.0.1`, and describes searching real-world UI/UX references for mobile apps, web apps, and sites. Its only published remote is:

```text
https://api.mobbin.com/mcp
```

The repository's `mcp.json` repeats the same URL in a minimal `mcpServers.mobbin.url` configuration. There is no published local npm executable or stdio command in the official server repository. [SOURCE: https://github.com/mobbin/mobbin-mcp-server/blob/main/server.json] [SOURCE: https://github.com/mobbin/mobbin-mcp-server/blob/main/mcp.json]

## 7. Transport

The external Mobbin transport is Streamable HTTP, as declared in `server.json`. Do not label the official endpoint as SSE or stdio. A client that supports remote MCP can use the URL directly. [SOURCE: https://github.com/mobbin/mobbin-mcp-server/blob/main/server.json] [SOURCE: https://docs.mobbin.com/mcp/clients/other]

The current local Code Mode configuration guide and validator document `mcpServers` entries with `stdio` and `sse` shapes, and the repository's remote-MCP examples use `mcp-remote` from a stdio entry. Therefore the proposed UTCP registration uses a local stdio adapter:

```text
Code Mode stdio process: npx -y mcp-remote https://api.mobbin.com/mcp
External hop: Streamable HTTP + Mobbin OAuth
```

This is an adapter for the current Code Mode config surface, not a claim that Mobbin itself serves stdio. If Code Mode later accepts direct Streamable HTTP, prefer the direct URL after validating its OAuth behavior.

## 8. Authorization and Credential Model

Mobbin's MCP integration guide describes OAuth protected-resource metadata, Dynamic Client Registration under RFC 7591, PKCE with `S256`, and the `openid` scope. The client guide instructs a user to add the remote URL and complete browser sign-in on first connection. [SOURCE: https://docs.mobbin.com/mcp/build-an-integration] [SOURCE: https://docs.mobbin.com/mcp/clients/other]

A read-only request without authorization returned `401` with a `WWW-Authenticate` reference to `https://api.mobbin.com/.well-known/oauth-protected-resource/mcp`; the metadata names the endpoint and `openid` as a supported scope. This supports the protected-resource/OAuth path but is not an authenticated handshake. [SOURCE: https://api.mobbin.com/mcp] [SOURCE: https://api.mobbin.com/.well-known/oauth-protected-resource/mcp]

Do not put `MOBBIN_API_KEY`, `mobbin_MOBBIN_API_KEY`, or an Authorization header in the MCP manual. Mobbin's API-key Bearer model is documented for the separate REST API, which is available to Team and Enterprise workspaces. [SOURCE: https://docs.mobbin.com/overview] [SOURCE: https://docs.mobbin.com/api/quickstart]

## 9. Plan Gating, Limits, and Revocation

The official MCP introduction and integration guide document MCP for Pro, Team, and Enterprise. They do not list Free as an eligible MCP plan. The packet should therefore fail with a clear plan-gate message for Free users and direct them to upgrade or use an eligible workspace. This is an MCP entitlement statement; it must not be generalized to every Mobbin website feature. [SOURCE: https://docs.mobbin.com/mcp/introduction] [SOURCE: https://docs.mobbin.com/mcp/build-an-integration]

Mobbin documents a per-user MCP limit of 60 requests per 60 seconds. On `429`, honor `Retry-After` and use exponential backoff. Access can be revoked from Mobbin Account Settings → MCP. [SOURCE: https://docs.mobbin.com/rate-limits] [SOURCE: https://docs.mobbin.com/mcp/disconnect]

## 10. Tool Surface and Search Workflow

The only concrete design-reference operation published by the official skill is `search_screens`. Its documented result contains screen entries with `index`, `id`, `app_name`, `mobbin_url`, `image_url`, and `platform`, plus a `failed` list and inline image content blocks. The agent is expected to visually inspect returned images and ground observations in Mobbin links. [SOURCE: https://github.com/mobbin/skills/blob/main/skills/mobbin-search/SKILL.md]

The workflow is:

1. derive query terms from the user's actual question;
2. infer iOS versus web when possible;
3. announce a short search plan;
4. call `search_screens` in the same turn, normally with a limit of five and no more than roughly fifteen unless the live schema says otherwise;
5. visually inspect the returned references;
6. answer from evidence or offer the optional evidence-board path.

App, screen, flow, and element are research dimensions, not four separately confirmed public tools. Query terms may name an app, a screen state, a multi-step flow, or a UI element. The full authenticated `tools/list` inventory is not published; never hardcode extra tool names from this synthesis.

## 11. Recommendations

1. Create `mcp-mobbin` as a transport packet with `mutatesWorkspace: false` and Code Mode as its only execution surface.
2. Register the `mobbin` manual using the adapter in Section 13, with an empty `env` object and no API-key variable.
3. Treat `search_screens` as the only publicly confirmed logical operation; discover and record the live Code Mode-prefixed name/schema at runtime.
4. Keep image/link retrieval ephemeral and exclude the official skill's optional `.mobbin` evidence-board writer from this packet.
5. Require `sk-design` before visual/design judgment; mcp-mobbin supplies references, not taste.
6. Gate enablement on a paid MCP plan, browser OAuth, one authenticated discovery call, and a limit-five search smoke test.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---:|
| Local Mobbin stdio server package | Official manifests publish a hosted endpoint and no local launch command. | [server.json](https://github.com/mobbin/mobbin-mcp-server/blob/main/server.json) | 1 |
| API-key-only MCP authentication | MCP docs describe OAuth; API keys are for the separate REST API. | [MCP integration](https://docs.mobbin.com/mcp/build-an-integration), [REST quickstart](https://docs.mobbin.com/api/quickstart) | 1 |
| Free-plan MCP entitlement | Official MCP plan list is Pro, Team, and Enterprise; Free is not listed. | [MCP introduction](https://docs.mobbin.com/mcp/introduction) | 1 |
| Four separate app/screen/flow/element tools | The published skill documents `search_screens` and query dimensions, not four public schemas. | [mobbin-search](https://github.com/mobbin/skills/blob/main/skills/mobbin-search/SKILL.md) | 2 |
| Automatic evidence-board writes | Board creation is optional and violates this transport's read-only boundary. | [mobbin-search](https://github.com/mobbin/skills/blob/main/skills/mobbin-search/SKILL.md) | 2 |
| Direct SSE registration | Official server metadata says Streamable HTTP. | [server.json](https://github.com/mobbin/mobbin-mcp-server/blob/main/server.json) | 3 |
| Hardcoded complete authenticated tool inventory | Public sources do not expose the authenticated `tools/list` schemas. | [official server repo](https://github.com/mobbin/mobbin-mcp-server) | 3 |

## Divergence Map

| Review angle | Evidence found | Result |
|---|---|---|
| Server metadata | GitHub manifest, README, and `mcp.json` | Hosted Streamable HTTP endpoint confirmed |
| Auth and entitlement | Mobbin MCP docs, REST docs, protected-resource probe | OAuth/no MCP API key; Pro/Team/Enterprise gate; REST key kept separate |
| Design workflow | Official skills repo and raw `mobbin-search` skill | `search_screens`, query dimensions, visual inspection, optional board |
| Code Mode integration | Local config validator and mcp-remote examples | `mobbin` mcp manual with stdio adapter is the compatible current shape |
| Safety and judgment | Local mcp-tooling transport and sk-design contracts | No workspace writes; pair with sk-design |
| Remaining frontier | No authenticated tools/list in public sources | Runtime discovery and smoke test required |

## 12. Open Questions

- What exact tools and schemas are returned by the authenticated server's `tools/list` today?
- Does the live Code Mode version's `mcp-remote` release negotiate Mobbin's Streamable HTTP and OAuth flow without additional flags?
- Is the runtime call name exactly `mobbin.mobbin_search_screens`, or does this Code Mode version expose a different prefix/alias?
- Does the live `search_screens` schema expose optional fields beyond query, platform, and limit? Do not assume them until `tool_info()` confirms them.
- Are there account/workspace edge cases within the documented Pro/Team/Enterprise gate that require a more specific error message?

## 13. Paste-Ready UTCP Manual

Add this object to the `manual_call_templates` array in the real `.utcp_config.json` during the later registration phase. It is intentionally not applied by this research lineage:

```json
{
  "name": "mobbin",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "mobbin": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "mcp-remote", "https://api.mobbin.com/mcp"],
        "env": {}
      }
    }
  }
}
```

The manual namespace is `mobbin`, so Code Mode's normal naming convention will expose calls under a `mobbin.mobbin_<tool>` namespace. The logical published operation is `search_screens`; confirm the exact prefixed name with `search_tools()` and `tool_info()` after OAuth. No `.env` line is required for this manual because there is no static MCP API key.

## 14. Read-Only and Code Mode-Only Transport Contract

The packet should carry this contract:

```yaml
workflowMode: mcp-mobbin
packetKind: transport
backendKind: mobbin-remote-mcp
toolSurface:
  allowed:
    - Read
    - mcp__code_mode__call_tool_chain
  forbidden:
    - Write
    - Edit
    - Bash
    - Task
  mutatesWorkspace: false
```

The transport may return structured metadata, Mobbin URLs, image URLs, and inline image content as ephemeral context. It must not write `.mobbin` boards, download assets into the workspace, modify specs, or expose a non-Code-Mode fallback. Any write-capable tool discovered at runtime must be excluded from the route and reported as an integration risk. [SOURCE: file:.opencode/skills/mcp-tooling/mode-registry.json] [SOURCE: file:.opencode/skills/mcp-tooling/mcp-figma/SKILL.md]

## 15. `sk-design` Judgment Pairing

`mcp-mobbin` is evidence transport, not a design authority. When a user asks what to choose, what looks distinctive, whether a pattern is appropriate, or how to turn references into a design direction, load the relevant `sk-design` workflow and use the Mobbin results as evidence. The transport must not independently decide palette, typography, hierarchy, interaction direction, or “good taste.”

The mode registry should add `mcp-mobbin` to the transport axis and declare the cross-hub pairing:

```json
{
  "transport-axis": {
    "transports": ["mcp-figma", "mcp-mobbin"],
    "crossHubPairing": {
      "mcp-figma": "sk-design",
      "mcp-mobbin": "sk-design"
    }
  }
}
```

This follows the existing local transport convention; it is packet-authoring guidance, not a write made by this research lineage. [SOURCE: file:.opencode/skills/mcp-tooling/SKILL.md] [SOURCE: file:.opencode/skills/mcp-tooling/mode-registry.json]

## 16. Install and Validation Runbook

### Install the official skill, if the workflow needs the skill bundle

```bash
npx skills add mobbin/skills
```

The official repository also documents a manual clone/copy path for clients without the installer. This installs the skill guidance; it does not replace the MCP manual or OAuth setup. [SOURCE: https://github.com/mobbin/skills]

### Configure and authorize

1. Add the Section 13 manual to `.utcp_config.json` in the later implementation phase.
2. Start a Code Mode discovery call; allow `mcp-remote` to open the browser OAuth flow.
3. Confirm the account is on Pro, Team, or Enterprise and that the remote authorization succeeds.
4. Do not create or request a Mobbin API key for this MCP path.

### Discover and smoke-test

1. Run `search_tools()` with a Mobbin/screenshot/search query.
2. Run `tool_info()` on the discovered candidate and record the live input/output schema.
3. Confirm the logical `search_screens` operation is present and map its exact Code Mode namespace.
4. Call one narrow query with a limit of five, inspect returned metadata and inline images, and verify Mobbin/image URLs.
5. Confirm no write-capable tool is routed by the read-only packet.
6. Exercise `429` handling with `Retry-After`/backoff in an integration test rather than by deliberately stressing production.
7. Test revocation from Mobbin Account Settings → MCP and ensure the client reports reauthorization clearly.

## 17. References

- [Official Mobbin MCP server](https://github.com/mobbin/mobbin-mcp-server)
- [Official Mobbin MCP manifest](https://github.com/mobbin/mobbin-mcp-server/blob/main/server.json)
- [Official Mobbin MCP client config](https://github.com/mobbin/mobbin-mcp-server/blob/main/mcp.json)
- [Mobbin MCP introduction](https://docs.mobbin.com/mcp/introduction)
- [Mobbin build an integration](https://docs.mobbin.com/mcp/build-an-integration)
- [Mobbin other clients](https://docs.mobbin.com/mcp/clients/other)
- [Mobbin overview](https://docs.mobbin.com/overview)
- [Mobbin REST API quickstart](https://docs.mobbin.com/api/quickstart)
- [Mobbin rate limits](https://docs.mobbin.com/rate-limits)
- [Mobbin MCP disconnect](https://docs.mobbin.com/mcp/disconnect)
- [Official Mobbin skills repo](https://github.com/mobbin/skills)
- [Official mobbin-search skill](https://github.com/mobbin/skills/blob/main/skills/mobbin-search/SKILL.md)
- `file:.opencode/skills/mcp-code-mode/references/configuration.md`
- `file:.opencode/skills/mcp-code-mode/scripts/validate_config.py`
- `file:.opencode/skills/mcp-code-mode/references/naming_convention.md`
- `file:.opencode/skills/mcp-tooling/mode-registry.json`
- `file:.opencode/skills/mcp-tooling/SKILL.md`
- `file:.opencode/skills/mcp-tooling/mcp-figma/SKILL.md`
- `file:.opencode/skills/mcp-tooling/mcp-figma/assets/utcp_figma_manual.md`
- `file:.opencode/skills/sk-design/design-md-generator/SKILL.md`

## Convergence Report

- Stop reason: `maxIterationsReached`.
- Total iterations: 3.
- Questions addressed: 7/7 research questions; 3 runtime validation gates remain.
- Remaining questions: authenticated tool inventory/schema, adapter negotiation, and exact Code Mode-prefixed runtime name.
- Last 3 iteration summaries: run 1 server/auth/plan (`0.95`); run 2 skills/search workflow (`0.80`); run 3 packet/manual/pairing (`0.62`).
- Convergence threshold: `0.05`.
- Rolling average of the three ratios: `0.79`; convergence was telemetry only under the max-iterations stop policy, and the loop did not synthesize early.
- Divergence summary: the review broadened from server metadata to official workflow and local packet safety, eliminating local stdio, API-key MCP auth, Free-plan assumptions, direct SSE claims, hardcoded schemas, board writes, and transport-owned design judgment.

