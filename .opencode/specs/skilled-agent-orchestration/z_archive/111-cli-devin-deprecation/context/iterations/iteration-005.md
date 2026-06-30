# Iteration 005

**Pool:** native-a + native-b (sonnet) · **Focus:** skill-graph + advisor + sibling edges; sqlite rebuild mechanism; 2 CI scripts

## Findings (15)
- `.opencode/skills/cli-opencode/graph-metadata.json` — siblings edge + related_to (27-31,45) → delete-map-entry — sibling edge {target:cli-devin,0.5} + related_to string
- `.opencode/skills/cli-claude-code/graph-metadata.json` — siblings edge + related_to (21-25,38) → delete-map-entry — sibling edge + related_to string
- `.opencode/skills/cli-codex/graph-metadata.json` — siblings edge + related_to (21-25,38) → delete-map-entry — sibling edge + related_to string
- `.opencode/skills/system-skill-advisor/graph-metadata.json` — edges.uses/enhances cli-devin (80-84) → delete-map-entry — {target:cli-devin,0.7,'routes devin delegation requests'}
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json` — cli-devin node+edges (1) → rebuild — auto-generated export; regenerate after sqlite rebuild (skill_graph_compiler.py)
- `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.json` — cli-devin node+edges (1) → rebuild — export copy; regenerate
- `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite` — cli-devin node + all edges (binary) → rebuild — RUNTIME graph (JSON ignored). Rebuild: advisor_rebuild MCP {force:true} OR daemon restart OR indexSkillMetadata() shim (skill-graph-db.ts:621 cascade-cleans). +WAL/SHM regen.
- `.opencode/skills/system-skill-advisor/manual_testing_playbook/02--cli-hooks-and-plugin/devin-user-prompt-submit.md` — CL-006 scenario file (1-132) → delete-file — whole file (Devin hook test)
- `.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md` — CL-006 row + counts + wave note (32,36,151,182,190) → decrement-count — delete CL-006 row(190); range label(182); wave note(151); decrement scenario counts(32:46->45,36:43->42/42files->41)
- `.opencode/skills/system-skill-advisor/mcp_server/tests/manual-testing-playbook.vitest.ts` — scenario-count assertion (~count literal) → decrement-count — decrement enforced count after CL-006 removal (verify file)
- `.opencode/skills/system-skill-advisor/SKILL.md` — HOOKS keyword/key_files/deferred F4 (118,150,350) → inline-edit — remove devin keyword, devin playbook key_file, F4 Devin hooks ref
- `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` — Devin CLI hook rows (135,198,398) → inline-edit — remove Devin hook registration row + disable-env row + hook ref
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh` — cli_skills array + prompt_quality_card path (63,93) → inline-edit — [HARD/CI] remove cli-devin/assets/prompt_quality_card.md path(63) + 'cli-devin' from cli_skills array(93); CI-wired -> patch BEFORE skill dir delete or CI fails
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/run-deep-review-arc.sh` — cli-devin dispatch (6,51,339,374) → inline-edit — active dispatch of kind:cli-devin (900s); decide remove-block vs swap executor to cli-opencode
- `.opencode/skills/system-skill-advisor/changelog/v0.4.0.md` (11,23) → leave — historical changelog; leave

See `../seats/iter-005/` for the full per-seat finding sets.
