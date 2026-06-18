READ-ONLY deep-context verification seat. Read/Grep only. Return ONLY findings JSON after BINDING lines. Never write files.

## gather-subject
Deprecate `.opencode/skills/cli-devin`; remove all ACTIVE references. THIS iteration = the skill-graph / skill-advisor cluster + the reciprocal sibling graph-metadata edges (the registration graph that must be pruned, and the sqlite rebuild path).

## shared current_focus — iteration 5 of 10 — SLICE cluster 5+7: skill-graph + sibling edges
1. Reciprocal sibling edges in each sibling's graph-metadata.json — find the exact cli-devin entry (edges.siblings + manual.related_to) and line numbers:
   - `.opencode/skills/cli-opencode/graph-metadata.json`
   - `.opencode/skills/cli-claude-code/graph-metadata.json`
   - `.opencode/skills/cli-codex/graph-metadata.json`
2. Skill-advisor graph artifacts (the runtime graph the advisor loads):
   - `.opencode/skills/system-skill-advisor/graph-metadata.json` — any edges → cli-devin.
   - `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json` — the cli-devin node + all edges (in/out).
   - `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.json` — same.
   - Is there a `skill-graph.sqlite`? (memory note: the advisor loads ONLY from skill-graph.sqlite at runtime; JSON is ignored for runtime). Locate it and identify the rebuild mechanism (indexSkillMetadata / skill_graph_scan / a daemon rebuild on start). State exactly HOW to rebuild it after graph-metadata.json edits.
3. The Devin-specific skill-advisor hook test:
   - `.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/devin-user-prompt-submit.md` — confirm; note the hard-coded file-count self-check in `manual_testing_playbook.md` (~L166 `-ne N` + prose L140/L173) that must be decremented (memory: feature-catalog-playbook-count-governance).
4. Grep `.opencode/skills/system-skill-advisor/` for any other cli-devin reference (advisor model/dispatch tables, scripts, hooks).

## known-context
Iter1 (agreement) flagged sibling reciprocal edges + skill-graph.json copies + the devin hook playbook. Memory: skill advisor graph loads ONLY from skill-graph.sqlite (JSON export "ignored for runtime"); rebuild via indexSkillMetadata() ESM shim (chdir to coder-root, skip refreshSkillEmbeddings) OR let the daemon rebuild on start. The skill-graph.sqlite (binary) is NOT grep-able — it must be REBUILT, not edited.

## output schema — ONLY this JSON after BINDING lines
```json
{ "findings": [
  { "path":"...", "symbol":"edge/node/key/rebuild-step", "kind":"integration_point|dependency|gap", "reuse":"remove|rebuild|leave",
    "evidence":"path:line(s)", "relevance":0.0, "classification":"active-wiring", "verified":true,
    "editType":"delete-map-entry|delete-node|inline-edit|rebuild|decrement-count",
    "notes":"exact edit OR the sqlite rebuild command/mechanism" } ] }
```
BINDING lines first (slice=skill-graph). Tool budget ~10-12.
