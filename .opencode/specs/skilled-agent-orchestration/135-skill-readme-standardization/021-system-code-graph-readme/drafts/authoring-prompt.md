Spec folder: skilled-agent-orchestration/135-skill-readme-standardization/021-system-code-graph-readme (pre-approved, skip Gate 3). OUTPUT-ONLY task: do NOT write, create or edit any file. Return ONLY the finished README markdown in a single fenced ```markdown block as your final message. No preamble, no commentary.

Role: You are a technical writer rewriting the README for the `system-code-graph` skill in a specific house voice.

Context you must use:
- The factual map is in `.opencode/specs/skilled-agent-orchestration/135-skill-readme-standardization/021-system-code-graph-readme/context/context-report.md`. Read it. Every fact, path and command must come from it (or from re-reading `.opencode/skills/system-code-graph/` to confirm). The current README is factually accurate, so preserve the facts and change the voice and structure.
- The required structure and voice are in `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md`. Read it and follow the fillable scaffold exactly.
- The golden example is `.opencode/skills/sk-git/README.md`. Read it; yours should read like it.
- The voice rules are in `.opencode/skills/sk-doc/references/global/hvr_rules.md`. Read and obey them.

Hard requirements on facts:
- There are eight MCP tools on the `mk-code-index` server (namespace `mcp__mk_code_index__*`): `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`, `code_graph_classify_query_intent`, `code_graph_verify`, `code_graph_apply` and `detect_changes`. `code_graph_query` operations are `outline`, `calls_from`, `calls_to`, `imports_from`, `imports_to` and `blast_radius`.
- Freshness has four values (fresh, stale, empty, error). `blocked` is the refusal payload a read tool returns when the graph is not fresh, NOT a freshness value. The false-safe guarantee is the defining property: a non-fresh read returns a blocked payload with a required action, never a silently-empty result. It is a hard refuse, not a soft degrade.
- The three workflows: blast-radius refactor preflight (`code_graph_query operation: blast_radius`), patch change-detection (`detect_changes` with a unified diff), incident neighborhood (`code_graph_context` with seeds).
- Boundary: structural, not text (Grep) and not semantic (Grep plus iteration, since this indexes structure not embeddings) and not spec-docs (memory_search). It boots independently of mk-spec-memory.
- Do NOT cite a version number (the README does not). You may state there are eight MCP tools (stable). Do NOT pin drift-prone counts (node-kind totals, feature-catalog or scenario totals). Every cited path must resolve.

Structure and voice:
- Numbered ALL-CAPS H2 sections with `---` dividers, a numbered OVERVIEW section, sequential numbering. No table of contents.
- Frontmatter (title `system-code-graph`, one-sentence description, trigger_phrases such as "code graph", "blast radius", "impact analysis", "structural search", "code_graph_query"), then H1, then a one-line `>` blockquote pitch.
- Section 1 = AT A GLANCE (4-row table). Section 2 = OVERVIEW with "Why This Skill Exists" (problem-first) then "What It Does". Then QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, an optional VERIFICATION, and a final RELATED DOCUMENTS section. Drop any section that does not fit and renumber.
- Voice: no em dashes, no semicolons, no Oxford commas, no banned words, no setup phrases. Lead with the reader. Prose carries the explanation; tables only for genuine 4-plus-item lookups. Vary subsection counts.
- Lead the distinctive value: this is the structural half of code intelligence, the one that answers "what does this code touch" rather than "what does it mean", and it gates every read behind a false-safe readiness contract so an agent never acts on a stale blast-radius. In QUICK START show a `code_graph_status` then `code_graph_scan` then a `code_graph_query blast_radius` sequence with expected output. In HOW IT WORKS cover the structural index, the readiness and false-safe contract, blast radius and change detection, and neighborhood retrieval. INTEGRATION states the boundary with Grep and memory_search.
- Target length roughly 240 to 340 lines. Every command shows its expected output.

Return the complete README as one ```markdown fenced block. Nothing else.
