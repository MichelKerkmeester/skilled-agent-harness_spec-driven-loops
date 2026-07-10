# Research Resource Map

## Scorer Code

| Path | Role | Used For |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` | Explicit author lane | Hardcoded token/phrase boosts and metadata consumption |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Fusion/ranking | Query class, primary intent bonuses, ambiguity/ranking, conflict seam |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts` | Advisor projection | Graph metadata to scoring projection mapping and command bridges |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/derived.ts` | Derived lane | Scoring behavior for triggers and keyword fields |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts` | Graph causal lane | `conflicts_with` propagation semantics |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts` | Semantic lane | Embedding hygiene and false-fire analysis |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts` | Metadata-derived alias precedent | Safe exclusion of derived keywords from alias derivation |

## Parent Hub Metadata

| Path | Role | Used For |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/graph-metadata.json` | Deep-loop parent metadata | Layer-1b stale code-audit vocabulary |
| `.opencode/skills/sk-code/graph-metadata.json` | Code parent metadata | Single-pass code review/audit ownership |
| `.opencode/skills/sk-design/graph-metadata.json` | Design parent metadata | Design audit ownership |
| `.opencode/skills/deep-loop-runtime/graph-metadata.json` | Runtime parent metadata | Runtime-vs-workflow ambiguity |

## Existing Measurement Packets

| Path | Role | Used For |
|---|---|---|
| `003-advisor-rrf-fusion/results/metrics.json` | RRF/conflict evidence | Conflict overlay and read-only projection precedent |
| `007-eval-hardening/implementation-summary.md` | Ratchet evidence | Ambiguity slice and recapture protocol |
| `008-semantic-shadow-prove-or-freeze/implementation-summary.md` | Semantic evidence | Freeze decision and mcp false-fire evidence |

## Guard Code

| Path | Role | Used For |
|---|---|---|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs` | Parent-hub guard | Existing single-hub guard and normalization precedent |

## Coverage Summary

- READMEs: 1 scorer README read.
- Documents: 3 implementation summaries and 1 charter read.
- Commands: command bridges inspected through `projection.ts`.
- Agents: not relevant to this read-only scorer research.
- Skills: 4 parent-hub graph metadata files read.
- Specs: 3 child packets used as measurement context.
- Scripts: 1 parent-hub guard script inspected.
- Tests: ratchet and semantic cosine tests inspected.
- Config: graph metadata and scorer constants inspected.
- Meta: no memory or code edits outside lineage.
