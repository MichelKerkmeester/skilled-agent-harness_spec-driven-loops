# Iteration 004 — Doctrine/docs/commands residual + archival classification

## Focus

Residual command/install/advisor/enrichment surfaces and complete Q5 archival vs live mutation classification (broaden angle under max-iterations stopPolicy).

## Actions Taken

1. Listed `.opencode/commands/**` files referencing code-graph tools.
2. Sampled create-agent/skill templates and install-guides.
3. Swept skill-advisor index edges, regression fixtures, and a bench that **imports** system-code-graph TS (isolation risk).
4. Confirmed passive-enrichment + session-prime + memory-surface as boundary callers.
5. Bucketed the 384 filtered live-hit paths.

## Findings

### F17 — Command & template grant propagation
[SOURCE: .opencode/commands/create/agent.md:4]
[SOURCE: .opencode/commands/create/skill.md:4]
[SOURCE: .opencode/skills/sk-doc/create-agent/assets/agent-template.md:142]
Create-agent/skill command frontmatter **hard-codes** `mcp__mk_code_index__code_graph_query` in `allowed-tools`. Agent template documents sanctioned `code_graph_*` permission keys. Deep command docs (`research.md`, `review.md`, contracts, presentations) mention graph readiness / TrustState — mostly doctrine, still live edits.

### F18 — Install guides are operator-facing mutation targets
[SOURCE: .opencode/install-guides/README.md:84,699-753,855+]
Full §10.4 System Code Graph install, validation checklist `mk_code_index_check`, bundle tables. Skill-local `INSTALL-GUIDE.md` is owner package. **Mutation class:** rewrite/remove install sections when decommissioning (not archival).

### F19 — Skill-advisor must drop routing edges and fixtures
[SOURCE: system-skill-advisor/graph-metadata.json edge → system-code-graph]
[SOURCE: skill-advisor-regression-cases.jsonl P1-SEARCH-001/002, P1-PHRASE-006/007]
[SOURCE: SKILL.md / README routing tables]
After skill deletion, advisor will route to a missing skill until graph reindex + fixture updates. Regression cases currently **expect** `system-code-graph` top hit for structural search prompts — retarget to Grep/sk-code or retire cases.

### F20 — Advisor bench imports code-graph source (isolation-check cousin)
[SOURCE: .opencode/skills/system-skill-advisor/mcp-server/bench/code-graph-parse-latency.bench.ts:13]
Direct `import` from `../../../system-code-graph/mcp-server/lib/structural-indexer.js`. **Must remove or stub before skill delete** or advisor benches break; also conflicts with isolation doctrine spirit even if CI only audits spec-kit↔code-graph.

### F21 — Spec-kit enrichment/session surfaces (additional boundary callers)
[SOURCE: passive-enrichment.ts:16,114]
[SOURCE: hooks/claude/session-prime.ts:28,245]
[SOURCE: hooks/memory-surface.ts:12,429]
These call `callCodeGraphTool` / readiness markers and inject `code_graph_*` recommendations into session briefs. Stub-boundary-first strategy covers them if boundary returns unavailable cleanly.

### F22 — Bucketed occurrence classification (Q5)
From `logs/live-hit-paths-iter001.txt` (384 paths):

| Bucket | Count | Mutation stance |
|--------|------:|-----------------|
| spec-kit-consumer | 107 | Live — stub/rewrite |
| other-skills | 49 | Live docs/refs — audit case-by-case |
| owner-catalog-playbook | 48 | Goes with skill delete |
| owner-mcp-server | 45 | Goes with skill delete |
| agents | 32 | Live — rewrite grants |
| commands | 24 | Live — rewrite |
| owner-skill-other | 23 | Goes with skill delete |
| runtime-config-doctrine | 14 | Live — MCP/hooks/AGENTS/README |
| bin-launchers | 13 | Live — delete/retire |
| skill-changelog / owner-changelog | 14 | **ARCHIVAL** — inventory only |
| plugins | 7 | Live — delete |
| scripts | 4 | Live — cleanup patterns |
| deep-loop | 3 | Mostly false-positive / TrustState docs — preserve coverage-graph |
| `.opencode/specs/**` (outside this list) | 4364 | **ARCHIVAL** — never propose edits |
| `.worktrees/**`, logs, benchmark reports | excluded | Noise / **ARCHIVAL** benchmarks |

## Questions Answered

- Q5 (complete enough): archival buckets defined; symlink/worktree/benchmark/spec exclusions confirmed.
- Q2 residual: templates, install guides, advisor fixtures.

## Questions Remaining

- Q4: Ordering constraints and rollback risk (next iteration).

## Ruled Out

- Proposing edits under `.opencode/specs/**`, skill changelogs, or benchmark report JSON as decommission work.
- Leaving create-agent/skill `allowed-tools` MCP grants after MCP server removal (would strand new scaffolds).

## Next Focus

Ordering constraints and rollback risk: staged remove vs keep-behind-fallback recommendations (Q4).

## SCOPE VIOLATIONS

None.
