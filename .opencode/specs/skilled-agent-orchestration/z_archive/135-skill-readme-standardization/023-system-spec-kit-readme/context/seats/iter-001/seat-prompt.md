Spec folder: skilled-agent-orchestration/135-skill-readme-standardization/023-system-spec-kit-readme (pre-approved, skip Gate 3). READ-ONLY: do not write, create or edit any file, and do not run the skill or its MCP tools. Return findings as your final assistant message only.

Role: You are a documentation analyst producing a faithful inventory of one large skill so its README can be restyled into a narrative voice WITHOUT losing reference depth.

Context: The skill lives at `.opencode/skills/system-spec-kit/`. It is the largest skill in the repo and its README is a 1084-line reference manual. Read its `SKILL.md` in full, its current `README.md` (all nine sections), `ARCHITECTURE.md`, `mcp_server/ENV_REFERENCE.md`, and skim the `references/`, `templates/`, `scripts/` and `mcp_server/` trees. This skill orchestrates mandatory spec-folder documentation (levels 1 to 3+), template enforcement and validation, plus the `mk-spec-memory` MCP server for context preservation (hybrid search, decay, constitutional memory, continuity). The README rewrite will KEEP this reference depth and only restyle the voice and framing, so your inventory must capture every real topic, not summarize them away.

Action: Produce a reference inventory for a depth-preserving restyle. Report under exactly these eight headings:

1. PURPOSE — one sentence: what the skill does.
2. PROBLEM — 2 to 4 sentences, problem-first: why ad-hoc undocumented file changes lose context across sessions, why a runtime needs an enforced documentation level and template, and why memory of prior decisions matters when work resumes.
3. CAPABILITY SURFACE (the depth) — inventory every major capability the README documents, each one or two lines: the documentation levels (1, 2, 3, 3+) and when each applies, template enforcement and validation (`validate.sh`), the spec-folder lifecycle, phase parents, the `mk-spec-memory` MCP server and its tool families, hybrid retrieval (BM25 plus vector plus RRF fusion), decay or FSRS, importance tiers, constitutional memory, continuity and handover, checkpoints, and any code-graph or deep-loop integration. Do not omit a documented topic.
4. THE MCP SURFACE — the `mk-spec-memory` tool families and roughly how many tools, plus the canonical entry commands (`/memory:save`, `/speckit:resume`, `validate.sh`, `generate-context.js`). Note the exact count is drift-prone, so describe families.
5. KEY FILES & DIRECTORIES — a table of the real top-level files and subfolders (path + one-line purpose): SKILL.md, ARCHITECTURE.md, README.md, `templates/`, `references/`, `scripts/`, `assets/`, `config/`, `constitutional/`, `feature_catalog/`, `manual_testing_playbook/`, `mcp_server/` (note `ENV_REFERENCE.md`).
6. SECTION MAP OF THE CURRENT README — list the nine current sections and, for each, one line on what reference content it holds, so the restyle can preserve each block while renaming and reframing it.
7. TROUBLESHOOTING & FAQ MATERIAL — the real failure modes and the questions a user actually asks (from the current README sections 7 and 8), so the restyle keeps them.
8. STALE FACTS — anything in the current README that is inaccurate versus SKILL.md and the real files (version, tool counts, env var names, paths, command names). The SKILL.md version is 3.4.1.0. Write "none found" if clean.

Format: Return one structured markdown report under those eight numbered headings. Cite real file paths verbatim. Mark anything you cannot verify as UNKNOWN. No preamble, no closing commentary.
