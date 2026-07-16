# METADATA

- Iteration: 2 of 5
- Focus dimension: Dimension 2 - Advisor + skill graph integrity
- Executor: cli-codex / gpt-5.5 / high reasoning / fast tier
- Spec folder: `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename`
- Review target write boundary: source/read-only; wrote only this iteration artifact and `review/deltas/iter-002.jsonl`

# SUMMARY

Found 3 new findings: 0 P0, 3 P1, 0 P2. The advisor graph has the new skill IDs in `signals`, adjacency, SQLite nodes, SQLite edges, and direct deep-research probes; it also reports `rejectedEdges: 0`. The gaps are narrower but release-relevant: one required deep-review probe ranks `sk-code-review` ahead of `deep-review`, the deep-loop family is still named `sk-deep` across JSON/metadata/schema surfaces, and strict advisor validation currently exits non-zero on unrelated `sk-code` graph metadata.

# P0 FINDINGS

None.

# P1 FINDINGS

## P1-002 - Required iterative-review probe routes to `sk-code-review` instead of `deep-review`

- Evidence:
  - Probe command: `skill_advisor.py "iterative review loop for spec folder audit" --threshold 0.0`
  - Observed top 3: `1. sk-code-review: 0.942`, `2. deep-review: 0.925`, `3. system-spec-kit: 0.764`
  - `deep-review` does have the intended graph signals: `.opencode/skills/deep-review/graph-metadata.json:32` lists `intent_signals`, including `review loop`, `iterative review`, and `spec folder review` at `.opencode/skills/deep-review/graph-metadata.json:33`.
  - `sk-code-review` carries broad overlapping domains and triggers: `.opencode/skills/sk-code-review/graph-metadata.json:31` includes `review`, `audit`, and `security`; `.opencode/skills/sk-code-review/graph-metadata.json:39` includes `code review`, `security review`, `quality gate`, and `findings`.
- Why this is an advisor integrity issue: the iteration-2 charter says each relevant probe should return the new deep-loop names as top-1. This prompt is explicitly about an iterative review loop for a spec folder audit, but the advisor chooses the single-pass review baseline first.
- Impact: users asking for a deep review loop with "iterative review loop" language can be routed to `sk-code-review`, bypassing the `/speckit:deep-review` state machine and its iteration artifacts.
- Concrete fix: add or tune a deep-review routing bridge/boost for combined `iterative` + `review loop` + `spec folder audit` prompts, and add a regression fixture asserting `deep-review` top-1 for this exact prompt family. If needed, add anti-signal handling so `sk-code-review` loses to `deep-review` when loop/state-machine terms are present.

## P1-003 - Deep-loop family identity still uses old `sk-deep` naming

- Evidence:
  - `skill-graph.json` still has a family key named `sk-deep` containing the renamed skills: `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json:22`.
  - Both renamed skill metadata files still set `"family": "sk-deep"`: `.opencode/skills/deep-review/graph-metadata.json:4` and `.opencode/skills/deep-research/graph-metadata.json:4`.
  - The SQLite graph code hard-codes `sk-deep` as the only deep-loop family in the type, allow-list, and table check constraint: `.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:23`, `.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:94`, and `.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:126`.
  - Tool input schemas also expose `sk-deep` as the query family: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:714` and `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:150`.
- Why this is a rename-completeness issue: the focus dimension explicitly includes families in the "new names exclusively" check. Skill IDs were renamed, but the family name remains anchored to the old `sk-deep-*` namespace.
- Impact: graph APIs and database records still surface the old naming family for the renamed skills. Consumers querying family members must still ask for `sk-deep`, which contradicts the packet goal of completing the public `sk-deep-*` to `deep-*` rename.
- Concrete fix: choose the canonical new family ID, likely `deep` or `deep-loop`, then update graph metadata, `skill-graph.json`, TS schema/type allow-lists, Python compiler allow-lists, tool schemas, tests, and rebuild `skill-graph.sqlite`.

## P1-004 - Strict advisor graph validation currently fails

- Evidence:
  - Command: `skill_advisor.py --validate-only --show-rejections`
  - Observed failure: `ERRORS in sk-code (1): derived.entities[1].kind must be one of ['agent', 'config', 'reference', 'script', 'skill'], got 'reference-category'`
  - The invalid value is present in `.opencode/skills/sk-code/graph-metadata.json:201`.
  - The compiler rejects entity kinds outside the allowed set at `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_graph_compiler.py:386`.
- Why this matters here: this is not a stale `sk-deep-*` rename miss, but it is a skill graph integrity failure in the same advisor surface being audited. A final advisor sign-off cannot claim strict graph validation passes while this command exits 2.
- Impact: strict validation of the advisor graph fails before release, even though the live SQLite graph still loads and routes many prompts correctly.
- Concrete fix: either change the `sk-code` entity kind to an allowed kind such as `reference`, or deliberately extend the compiler's allowed entity kind contract and matching tests to include `reference-category`.

# P2 FINDINGS

None.

# POSITIVE OBSERVATIONS

- `skill-graph.json` signal keys use new deep-loop skill IDs: `deep-review` and `deep-research` are present, and there are no `sk-deep-*` signal keys.
- `anti_signals` contains no deep-loop old names; its keys are only `mcp-coco-index`, `sk-code`, and `system-spec-kit`.
- Adjacency uses new skill IDs: `deep-review` depends on `sk-code-review` and siblings `deep-research`; `deep-research` siblings `deep-review`.
- SQLite advisor nodes know both renamed skills: `deep-review` and `deep-research` are present in `skill_nodes`; there are 0 `sk-deep-%` nodes and 0 `sk-deep-%` edges.
- SQLite advisor metadata reports `rejectedEdges: 0`; the only current warning is a skipped non-skill test fixture metadata file.
- Three of the four requested probes pass top-1:
  - `deep review the auth flow for security issues` -> `deep-review` `0.883`
  - `deep research the new typing api` -> `deep-research` `0.834`
  - `investigate convergence patterns in autonomous research loops` -> `deep-research` `0.838`

# DIMENSION COVERAGE

Reviewed advisor JSON, renamed skill graph metadata, SQLite graph state, advisor CLI health/validation, and the four requested probe prompts.

Commands/checks executed:

- Parsed `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` and printed `signals`, `anti_signals`, family entries, adjacency, hub skills, and old signal-key residue.
- Ran all four requested advisor probes with `--threshold 0.0` and captured top rankings.
- Queried `skill-graph.sqlite` read-only for deep-loop node IDs, families, old node counts, old edge counts, deep-loop edges, and `last_scan_summary`.
- Ran `skill_advisor.py --health` to confirm the advisor loads from SQLite and reports both `deep-review` and `deep-research` as discovered skills.
- Ran `skill_advisor.py --validate-only --show-rejections`; this produced P1-004.
- Searched source surfaces for `sk-deep` family schema residues in graph metadata, compiler, TS graph DB, tool schemas, and query schemas.

Ruled out:

- No `sk-deep-review` or `sk-deep-research` signal keys in `skill-graph.json`.
- No old deep-loop node IDs or old deep-loop edge endpoints in `skill-graph.sqlite`.
- No `UNKNOWN_TARGET` or `UNKNOWN-NODE` strings were observed in the current advisor rebuild metadata or Packet 070 review outputs; SQLite `last_scan_summary` reports `rejectedEdges: 0`.
- Iteration 1's changelog symlink finding was not re-counted.

# NEXT ITERATION RECOMMENDATIONS

- Iteration 3 should include graph API/tool-schema references in its "broken references" pass because P1-003 means family-member query callers may still depend on `sk-deep`.
- Also re-check whether any docs or tests assert `skill_graph_query` family enum values; those will need coordinated changes if the family is renamed from `sk-deep` to `deep` or `deep-loop`.
