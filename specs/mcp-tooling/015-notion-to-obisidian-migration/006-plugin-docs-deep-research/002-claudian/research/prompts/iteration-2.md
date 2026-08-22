DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 2 of 4
Questions: 5/5 answered | Last focus: Map real schemas from source and compiled plugin
Last 2 ratios: N/A -> 0.81 | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Memory context refresh: none loaded yet.
Next focus: Reconcile the discovered schema facts against the four shipped reference docs and produce concrete, line-targeted doc updates: (1) correct data-model.md §5 and workflows.md §5 to state Claudian deletes .claude/mcp.json and wires MCP via ACP; (2) add the full claudian-settings.json schema + defaults and the .claudian/ (current) vs .claude/claudian-settings.json (legacy) path split; (3) document the command ID reversible encoding and skill name-must-match-folder + lowercase-hyphen validation; (4) record the narrow .claude/settings.json write scope (permissions + plugin enablement only). Also verify the operator vault's actual on-disk .claudian/ vs .claude/ state as a live confirmation.

Research Topic: Optimize the mcp-obsidian claudian file-layer reference docs for AI operation. Research the real plugin (repo YishenTu/claudian, id realclaudian, docs, and the installed main.js v2.2.4) to confirm the in-vault .claude config schemas (mcp.json, claudian-settings.json, settings.json, commands, skills), provider setup, and MCP wiring currently flagged VERIFY. Recommend concrete additions or updates to references/plugins/claudian/.

Iteration: 2 of 4
Focus Area: Reconcile the discovered schema facts against the four shipped reference docs and produce concrete, line-targeted doc updates. Verify the operator's actual on-disk .claudian/ vs .claude/ vault state as live confirmation of the path migration behavior.
Remaining Key Questions:
[All 5 key questions answered in iteration 1]
Carried-Forward Open Questions:
[None yet]
Last 3 Iterations Summary: run 1: Map real schemas from source and compiled plugin (0.81)
Pivot Lineage: none yet
Saturated Directions: none yet

## KEY FINDINGS FROM ITERATION 1

1. Claudian settings path migrated to .claudian/ (current) from .claude/claudian-settings.json (legacy). Docs only show legacy path.
2. Complete claudian-settings.json schema mapped from ClaudianSettings interface + DEFAULT_CLAUDIAN_SETTINGS.
3. Claudian does NOT write mcp.json — it DELETES it (LegacyMcpConfigCleanup.ts). MCP wired via ACP sessions. Contradicts shipped docs.
4. Claudian writes .claude/settings.json but ONLY for permissions + plugin enablement (narrow scope).
5. Command schema: .claude/commands/<safeName>.md with reversible ID encoding. Full frontmatter keys documented.
6. Skill schema: .claude/skills/<name>/SKILL.md with name-must-match-folder validation.
7. Five providers (claude, codex, grok, opencode, pi) with opaque per-provider configs.
8. Sessions also moved: .claude/sessions -> .claudian/sessions.

## STATE FILES

All paths are relative to the repo root.

- Config: specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/002-claudian/research/deep-research-config.json
- State Log: specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/002-claudian/research/deep-research-state.jsonl
- Strategy: specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/002-claudian/research/deep-research-strategy.md
- Registry: specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/002-claudian/research/findings-registry.json
- Write iteration narrative to: specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/002-claudian/research/iterations/iteration-002.md
- Write per-iteration delta file to: specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/002-claudian/research/deltas/iter-002.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- Write ALL findings to files. Do not hold in context.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard synchronization. Treat those reducer-owned files as read-only.
- Do not implement fixes during review. Report findings only. Do NOT edit the shipped reference docs under references/plugins/claudian/ — this run is RESEARCH ONLY.
- Researched files and paths are READ-ONLY. Do not modify anything you are investigating.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/002-claudian/research/iterations/iteration-002.md
  - specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/002-claudian/research/deep-research-state.jsonl
  - specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/002-claudian/research/deltas/iter-002.jsonl
- **BANNED OPERATIONS**: rm, rm -rf, git rm, mv, sed -i, rmdir, find ... -delete, shell output-redirect truncate > against any file not in the allowed-write list
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, STOP and emit a finding instead.

## OUTPUT CONTRACT

You MUST produce THREE artifacts:
1. **Iteration narrative markdown** at specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/002-claudian/research/iterations/iteration-002.md
2. **Canonical JSONL iteration record** APPENDED to specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/002-claudian/research/deep-research-state.jsonl with type:"iteration"
3. **Per-iteration delta file** at specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/002-claudian/research/deltas/iter-002.jsonl
