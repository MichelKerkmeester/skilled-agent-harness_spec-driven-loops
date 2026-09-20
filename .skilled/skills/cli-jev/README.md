# cli-jev

The hub for Jev typed judgments. One public skill identity, one `packetKind: "transport"` packet,
and no packet-local logic: the hub routes a request to `cli-usage` through `mode-registry.json` and
`hub-router.json`, and the transport bridges the `jev` CLI and MCP surface.

## What The Hub Owns

| File | Purpose |
|------|---------|
| `SKILL.md` | Thin routing entry point |
| `mode-registry.json` | The packet registry: `workflowMode`, `packetKind`, `backendKind`, `toolSurface`, `advisorRouting` |
| `hub-router.json` | Router policy, signals, vocabulary classes and outcomes |
| `ROUTER.md` | Stage-two control document, `router_state: stage1-only` |
| `description.json` | Hub-doctor metadata and trigger examples |
| `graph-metadata.json` | The one skill-graph identity node |
| `leaf-manifest.json` | Generated inventory of the hub's routed leaves |

## The Transport

`cli-usage/` bridges the `jev` CLI/MCP surface: `noul`, `choice`, `score` and `run` return one typed
value from a state, and the mode writes nothing into this workspace. `Write`, `Edit` and `Task` are
forbidden and `mutatesWorkspace` is `false`, so the transport selects while a workflow acts.

Start with [`cli-usage/SKILL.md`](./cli-usage/SKILL.md) for the judgment contract, the eight hard
rules, the CLI reference, the providers and the MCP surface.

## History

The hub was split out of `cli-external-orchestration`, where Jev had lived as the eighth mode. The
transport keeps its `cli-jev` alias, its scenarios and its recorded evidence; only its home changed.
See [`changelog/v1.0.0.0.md`](./changelog/v1.0.0.0.md).
