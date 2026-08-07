# Resource Map — Health.md plugin deep dive

## Primary Sources

| Resource | Role | Topics covered |
| --- | --- | --- |
| https://github.com/CodyBontecou/health-md-visualizations | Canonical plugin repository | Formats, schema compatibility, settings, render grammar, platform matrix, mock fallback |
| https://community.obsidian.md/plugins/health-md | Obsidian Community listing | Release/runtime metadata and mirrored operational contract |
| https://github.com/CodyBontecou/health-md | Canonical Health.md monorepo | Public contracts, Apple/Android profile independence, exporter semantics |
| https://github.com/CodyBontecou/health-md-android | Android exporter repository | Health Connect exports, raw snapshots, entry notes, destinations, automation |

## Lineage Artifacts

| Artifact | Purpose |
| --- | --- |
| `deep-research-config.json` | Frozen loop configuration and lineage provenance |
| `deep-research-state.jsonl` | Append-only canonical events and iteration state |
| `iterations/iteration-001.md` through `iteration-006.md` | Full cited research record |
| `deltas/iter-001.jsonl` through `iter-006.jsonl` | Reducer-ready per-iteration deltas |
| `findings-registry.json` | Resolved questions, stable findings, ruled-out directions |
| `deep-research-dashboard.md` | Progress and quality-guard summary |
| `research.md` | Canonical synthesis and remediation order |
| `convergence-report.md` | Legal stop decision and evidence |

## Read-Only Local Audit Inputs

- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/health-md/health-md.md`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/health-md/data-model.md`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/health-md/workflows.md`
- `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/health-md/troubleshooting.md`

These local inputs were inspected but not modified by this detached lineage.
