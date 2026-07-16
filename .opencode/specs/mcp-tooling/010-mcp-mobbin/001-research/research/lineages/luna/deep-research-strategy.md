# Deep Research Strategy: Mobbin MCP developer surface

## Research Topic

Verify the official Mobbin MCP server and official Mobbin skills well enough to author a read-only, Code Mode-only `mcp-mobbin` transport packet, pair it with `sk-design` for judgment, and supply a paste-ready `mobbin` UTCP manual.

## Known Context

- The detached lineage is bound directly to `config.fanout_lineage_artifact_dir`; the `resolveArtifactRoot` node is intentionally skipped.
- All writes are bounded to this lineage directory. Spec writeback, parent/shared telemetry, continuity/memory save, and git staging are out of scope.
- `resource-map.md` was not present at initialization; this lineage emits its own resource map from the completed deltas.
- The official GitHub server manifest and Mobbin docs are first-party evidence. The public repository does not expose a complete authenticated `tools/list` schema.

## Key Questions

- [x] What endpoint and MCP transport does the official server expose?
- [x] Does MCP use an API key, OAuth, or another authorization model?
- [x] Which Mobbin plans can use MCP, and how does that differ from the REST API?
- [x] What search workflow and concrete MCP tool does the official skills repo document?
- [x] How should the remote server be represented in Code Mode's UTCP configuration?
- [x] What read-only, Code Mode, and `sk-design` pairing constraints belong in the transport packet?
- [x] Which tool schemas and app/screen/flow/element distinctions remain unverified?

## Answered Questions

All questions above were answered or explicitly bounded as unknown by the three required iterations. The exact authenticated `tools/list` result remains a runtime validation task rather than a public-source claim.

## What Worked

- Triangulating the official server README, `mcp.json`, and `server.json` established the hosted Streamable HTTP endpoint.
- Mobbin's MCP introduction, integration guide, client guide, overview, API quickstart, rate-limit, and disconnect pages established OAuth, plan gating, REST/MCP credential differences, operational limits, and revocation.
- The official `mobbin-search` skill provided the concrete `search_screens` workflow, response shape, query planning, visual inspection behavior, and install paths.
- Local Code Mode configuration validation and the existing `mcp-remote` pattern provided a compatible UTCP adapter for an HTTP MCP endpoint.

## What Failed

- A detached CLI child could not complete its own backend connection in this environment. The bounded lineage was completed from first-party web evidence and local read-only configuration inspection.
- The public server repository does not publish the complete authenticated tool inventory or JSON schemas, so a full tool list cannot be responsibly reconstructed from source alone.

## Exhausted Approaches

- Searching the public Mobbin server repository for a local package, executable, or stdio launch command was exhausted; the public manifests identify a hosted remote endpoint instead.
- Treating the MCP server as API-key-only was exhausted and contradicted by the official OAuth/DCR documentation and live protected-resource response.
- Treating app, screen, flow, and element as four confirmed tool names was rejected because the official skill documents one concrete `search_screens` call and query dimensions, not four separate public schemas.

## Ruled-Out Directions

- Local stdio as the external Mobbin transport: unsupported by the official server metadata; only a local `mcp-remote` adapter is proposed for Code Mode compatibility.
- Free-plan MCP access: unsupported; official MCP docs require Pro, Team, or Enterprise.
- Supplying a Mobbin API key for MCP: wrong credential model; API keys belong to the separate Team/Enterprise REST API.
- Writing evidence boards or design artifacts from the transport: excluded by the read-only packet boundary; the official skill's optional `.mobbin` board flow is not part of this transport.
- Letting the transport make visual/design judgments: excluded; retrieval is paired with `sk-design` for judgment.

## Next Focus

Max-iterations policy required all three iterations. Follow-up implementation should live-discover and record `tools/list` after OAuth, confirm the `mcp-remote` adapter with Code Mode, and add the packet/manual only after those runtime checks pass.
