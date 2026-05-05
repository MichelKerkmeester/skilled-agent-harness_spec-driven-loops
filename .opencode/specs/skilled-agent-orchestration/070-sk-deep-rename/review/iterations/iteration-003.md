# METADATA

- Iteration: 3 of 5
- Focus dimension: Dimension 3 - No broken references
- Executor: cli-codex / gpt-5.5 / high reasoning / fast tier
- Spec folder: `specs/skilled-agent-orchestration/070-sk-deep-rename`
- Review target write boundary: source/read-only; wrote only this iteration artifact and `review/deltas/iter-003.jsonl`

# SUMMARY

Found 0 new findings: 0 P0, 0 P1, 0 P2. The focused broken-reference pass found no dangling renamed-skill edges, no stale `sk-deep-review` / `sk-deep-research` command references, no stale `.opencode/skill/sk-deep-*` relative links in active source, and no hardcoded old renamed skill IDs in the MCP TS/JS surfaces checked. Iteration 2's P1-003 remains active and relevant: the public skill-graph family is still named `sk-deep`, even though the skill IDs and path references now use `deep-review` / `deep-research`.

# P0 FINDINGS

None.

# P1 FINDINGS

No new P1 findings.

## Carried forward: P1-003 - Deep-loop family identity still uses old `sk-deep` naming

- Evidence:
  - `.opencode/skill/deep-review/graph-metadata.json:4` sets `"family": "sk-deep"` while `.opencode/skill/deep-review/graph-metadata.json:3` sets the skill ID to `deep-review`.
  - `.opencode/skill/deep-research/graph-metadata.json:4` sets `"family": "sk-deep"` while `.opencode/skill/deep-research/graph-metadata.json:3` sets the skill ID to `deep-research`.
  - `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json:22` keeps the compiled family key as `sk-deep`.
  - `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:23`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:98`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:126`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:714`, and `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:150` still expose `sk-deep` as the family enum.
- Why this remains a broken-reference risk: it is not a dangling file path or missing skill edge, but it is a public graph/query reference surface that still requires callers to use the old family name after the skill IDs were renamed.
- Recommended remediation: choose the canonical new family ID, likely `deep` or `deep-loop`, update graph metadata, compiler allow-lists, TS types, SQL check constraints, tool schemas, tests, and rebuild `skill-graph.json` / `skill-graph.sqlite`.

# P2 FINDINGS

None.

# POSITIVE OBSERVATIONS

- Cross-skill edges that mention renamed skills point to existing targets:
  - `.opencode/skill/deep-research/graph-metadata.json:11` targets `deep-review`.
  - `.opencode/skill/deep-review/graph-metadata.json:17` targets `deep-research`.
  - `.opencode/skill/sk-code-review/graph-metadata.json:25` targets `deep-review`.
- The broader graph edge existence check found no missing top-level skill targets except `skill_advisor`, which is an intentional nested pseudo-skill:
  - `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/graph-metadata.json:3` declares `"skill_id": "skill_advisor"`.
  - `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py:192` through `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py:206` inject that nested metadata into the graph.
  - `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py:336` through `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py:340` explicitly resolves `skill_advisor` to the nested advisor directory.
- SKILL.md routing references in other skills point at the renamed skills and existing paths:
  - `.opencode/skill/sk-code-review/SKILL.md:79` refers to `@deep-review`.
  - `.opencode/skill/system-spec-kit/SKILL.md:125` and `.opencode/skill/system-spec-kit/SKILL.md:455` point to `../deep-research/references/spec_check_protocol.md`, which resolves from `system-spec-kit` to the existing `.opencode/skill/deep-research/references/spec_check_protocol.md`.
- Command entrypoints and workflow assets use renamed targets:
  - `.opencode/command/spec_kit/deep-review.md:21` and `.opencode/command/spec_kit/deep-review.md:22` load `spec_kit_deep-review_auto.yaml` / `spec_kit_deep-review_confirm.yaml`.
  - `.opencode/command/spec_kit/deep-research.md:19` and `.opencode/command/spec_kit/deep-research.md:20` load `spec_kit_deep-research_auto.yaml` / `spec_kit_deep-research_confirm.yaml`.
  - `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:56` and `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:56` set `skill: deep-review`.
  - `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:67` and `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:53` set `skill: deep-research`.
- Focused stale-path searches found no active `sk-deep-review`, `sk-deep-research`, or `.opencode/skill/sk-deep-*` references in the command, skill, agent, runtime mirror, root-doc, or active-spec surfaces checked.

# DIMENSION COVERAGE

Commands/checks executed:

- Cross-skill graph edge grep: `grep -rn '"target":' .opencode/skill/*/graph-metadata.json | grep -E "sk-deep-(review|research)|deep-(review|research)"`.
- Full graph edge existence check against `.opencode/skill/*` plus manual verification of the nested `skill_advisor` pseudo-skill metadata and compiler injection.
- SKILL.md routing grep: `grep -rn "deep-review\|deep-research" .opencode/skill/*/SKILL.md | grep -E "skill:|references/|assets/" | head -20`.
- Command file inventory: `rg --files .opencode/command/spec_kit | rg 'deep-(review|research)|spec_kit_deep-(review|research)'`.
- Command/YAML old-name grep across `.opencode/command/spec_kit`.
- MCP TS/JS hardcode grep across `.opencode/skill/system-spec-kit/mcp_server/lib` and `dist`.
- Active spec old-name grep using the requested exclude list; no hits.
- Key-file existence check for `deep-review`, `deep-research`, `sk-code-review`, and `system-spec-kit` graph metadata paths; no missing paths.

Ruled out:

- No `sk-deep-review` or `sk-deep-research` graph edge targets in active `.opencode/skill/*/graph-metadata.json`.
- No missing `deep-review` / `deep-research` graph edge targets.
- No stale `.opencode/skill/sk-deep-review` or `.opencode/skill/sk-deep-research` relative path links in active command/skill/agent/runtime mirror surfaces after excluding historical changelogs, data logs, runs, and pre-promote backups.
- The requested `ls .opencode/command/spec_kit/spec_kit_deep-*` pattern does not match command markdown files in this repo because the command docs are `.opencode/command/spec_kit/deep-review.md` and `.opencode/command/spec_kit/deep-research.md`; the `spec_kit_deep-*` names are YAML assets under `.opencode/command/spec_kit/assets/`.

# NEXT ITERATION RECOMMENDATIONS

- Iteration 4 should preserve historical/narrative `sk-deep-*` references in Packet 070 docs and pre-promote backups while continuing to treat live family/query surfaces as active code, not historical narrative.
- Re-check P1-003 during the final behavior-parity pass if it remains unresolved, because changing the family ID will require coordinated tests and a graph rebuild.
