# Resource Map — luna detached lineage

This map was emitted at synthesis. No parent `resource-map.md` was present at phase initialization, so this lineage treated the source inventory below as newly discovered evidence rather than as a pre-existing exclusion set.

## Official Mobbin server

| Resource | Role | Iterations |
|---|---|---:|
| https://github.com/mobbin/mobbin-mcp-server | Official server repository | 1, 3 |
| https://github.com/mobbin/mobbin-mcp-server/blob/main/README.md | Hosted endpoint README | 1 |
| https://github.com/mobbin/mobbin-mcp-server/blob/main/mcp.json | Minimal remote client configuration | 1, 3 |
| https://github.com/mobbin/mobbin-mcp-server/blob/main/server.json | MCP manifest, version, Streamable HTTP remote | 1, 3 |
| https://api.mobbin.com/mcp | Protected remote endpoint probe | 1 |
| https://api.mobbin.com/.well-known/oauth-protected-resource/mcp | Protected-resource metadata | 1 |

## Official Mobbin documentation

| Resource | Role | Iterations |
|---|---|---:|
| https://docs.mobbin.com/mcp/introduction | MCP overview and plan gate | 1 |
| https://docs.mobbin.com/mcp/build-an-integration | OAuth/DCR/PKCE integration flow | 1, 3 |
| https://docs.mobbin.com/mcp/clients/other | Remote client setup and browser sign-in | 1, 3 |
| https://docs.mobbin.com/mcp/clients/overview | Supported client context | 1 |
| https://docs.mobbin.com/overview | MCP versus REST plan/credential overview | 1 |
| https://docs.mobbin.com/api/quickstart | REST API-key distinction | 1, 3 |
| https://docs.mobbin.com/rate-limits | MCP/API limits and 429 behavior | 1, 3 |
| https://docs.mobbin.com/mcp/disconnect | OAuth revocation path | 3 |

## Official Mobbin skills

| Resource | Role | Iterations |
|---|---|---:|
| https://github.com/mobbin/skills | Skill inventory, prerequisite, install | 2 |
| https://github.com/mobbin/skills/blob/main/skills/mobbin-search/SKILL.md | search_screens workflow and result contract | 2, 3 |

## Local implementation references

| Resource | Role | Iterations |
|---|---|---:|
| file:.opencode/skills/mcp-code-mode/references/configuration.md | UTCP and mcp-remote configuration shape | 3 |
| file:.opencode/skills/mcp-code-mode/scripts/validate_config.py | Current MCP config validation constraints | 3 |
| file:.opencode/skills/mcp-code-mode/references/naming_convention.md | Manual namespace convention | 3 |
| file:.opencode/skills/mcp-tooling/mode-registry.json | Transport/read-only registry pattern | 3 |
| file:.opencode/skills/mcp-tooling/SKILL.md | Cross-hub transport and judgment rule | 2, 3 |
| file:.opencode/skills/mcp-tooling/mcp-figma/SKILL.md | Read-only transport exemplar | 3 |
| file:.opencode/skills/mcp-tooling/mcp-figma/assets/utcp_figma_manual.md | Paste-ready UTCP manual exemplar | 3 |
| file:.opencode/skills/sk-design/design-md-generator/SKILL.md | Design judgment boundary | 3 |

## Lineage outputs

`iterations/iteration-001.md`, `iterations/iteration-002.md`, `iterations/iteration-003.md`, matching `deltas/iter-00N.jsonl`, prompt packs, dispatch receipts, `findings-registry.json`, `deep-research-dashboard.md`, `deep-research-strategy.md`, `deep-research-state.jsonl`, and `research.md` are the bounded outputs of this lineage.

