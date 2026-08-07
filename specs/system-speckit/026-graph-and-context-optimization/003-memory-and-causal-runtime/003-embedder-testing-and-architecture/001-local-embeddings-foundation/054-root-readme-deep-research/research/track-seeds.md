# 056 Track Seeds — 7 Thematic Tracks × 20 Iter

Each track owns ~3 iter. Per-iter RQs below seed the dispatch; cli-devin may follow related threads within the track as findings surface.

---

## Track 1: Counts and Inventories (iter 1-3)

**Iter 1** — RQ_SHORT: tool surface count and per-server breakdown
RQ_FULL: Walk every claim in `./README.md` about MCP tool counts (the "66 MCP Tools" line, the per-server breakdown "39 mk-spec-memory + 8 mk_skill_advisor + 10 mk_code_index + 7 code mode + 1 CocoIndex + 1 sequential thinking", and any per-section repeats). Verify each count by counting entries in `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` (look for the `TOOL_DEFINITIONS` array / `CODE_GRAPH_TOOL_SCHEMAS` const / similar), `opencode.json` server registrations, and the analogous configs in the other 3 runtimes. Report exact actual counts and any drift.

**Iter 2** — RQ_SHORT: agent + skill + command counts
RQ_FULL: Walk every claim about agent count (currently "11 agents"), skill count (currently "20 skills"), and command count (currently "22 commands"). Verify by counting `.opencode/agents/*.md` (exclude README.txt), `.opencode/skills/*/SKILL.md`, and `.opencode/commands/**/*.md`. Report exact counts and any drift.

**Iter 3** — RQ_SHORT: MCP server registration inventory
RQ_FULL: List every claim in `./README.md` about MCP servers (names, counts, registrations). Verify each appears identically in `opencode.json`, `.codex/config.toml`, `.claude/mcp.json`, `.gemini/settings.json`. Flag any drift in name (e.g., `mk-spec-memory` vs `mk_spec_memory`), missing registrations, or extra registrations not mentioned in README.

---

## Track 2: Claim Accuracy (iter 4-6)

**Iter 4** — RQ_SHORT: MCP server names, version numbers
RQ_FULL: For each MCP server (mk-spec-memory, mk_skill_advisor, mk_code_index, cocoindex_code, code_mode, sequential_thinking), grep the README for every mention. Cross-check naming consistency (underscore vs hyphen, prefix), version numbers cited (e.g., "v3.4.1.0"), and whether the cited version exists in the corresponding changelog. Report drift.

**Iter 5** — RQ_SHORT: file paths and env vars
RQ_FULL: For every file path cited in the README (`.opencode/...`, `./scripts/...`, `./README.md`, etc.), verify the path resolves with `ls`. For every env var cited (e.g., `SPECKIT_*`, `MK_*`, `VOYAGE_API_KEY`), verify it appears in the launcher binaries or skill code (grep for the env var name across the repo).

**Iter 6** — RQ_SHORT: install steps + Quick Start usability
RQ_FULL: Walk the Quick Start section step by step. For each step, verify the command exists (binary on PATH), the cited path resolves, and any flags mentioned are still supported. Report any step that would fail for a new user trying to follow the instructions today.

---

## Track 3: HVR Voice Violations (iter 7-9)

**Iter 7** — RQ_SHORT: banned HVR words scan
RQ_FULL: Read `.opencode/skills/sk-doc/references/global/hvr_rules.md` Section 6 (Hard Blocker Words). For each banned word (e.g., delve, embark, navigate-as-metaphor, leverage, journey-as-metaphor, realm, disrupt, ecosystem-as-metaphor), grep the README and report every occurrence with line number + context. Distinguish metaphor uses (banned) from literal uses (allowed where rules say so).

**Iter 8** — RQ_SHORT: punctuation hard blockers (em dashes, semicolons, oxford commas)
RQ_FULL: Grep the README for `—` (em dash), `;` (semicolon), and `, and ` / `, or ` (oxford comma) patterns. Report every occurrence with line number + context. For each, note whether it appears in prose (banned) vs code/bash flags (allowed).

**Iter 9** — RQ_SHORT: banned HVR phrases scan
RQ_FULL: Read `.opencode/skills/sk-doc/references/global/hvr_rules.md` Section 7 (Phrase Hard Blockers). For each banned phrase (e.g., "It's important to", "Moving forward", "When it comes to", "In today's digital landscape"), grep the README and report every occurrence with line number + context.

---

## Track 4: Diagrams and Topology (iter 10-12)

**Iter 10** — RQ_SHORT: native MCP topology box
RQ_FULL: Read the "Native MCP Topology" ASCII diagram in README (around line ~89-97). For each box / arrow / connection, verify it reflects the current state of `opencode.json` MCP registrations and the source-of-truth in the system-spec-kit / system-skill-advisor / system-code-graph extraction. Specifically check: post-extraction boundaries (mk-code-index, mk-skill-advisor are NOW separate from system-spec-kit), shared dependencies, label accuracy.

**Iter 11** — RQ_SHORT: agent network diagram
RQ_FULL: Read the "Agent Network" diagram / section in README (around line ~940-960). For each agent listed, verify it matches a file in `.opencode/agents/*.md`. Verify any arrows/edges (e.g., orchestrate dispatches @code, @markdown, etc.) match the agent definition files (look for `subagent_type` references and dispatch boundaries).

**Iter 12** — RQ_SHORT: runtime arrows + extraction boundaries
RQ_FULL: Walk any diagram or prose that describes which components live where after the recent extractions (mk-code-index, mk-skill-advisor extracted from system-spec-kit). Flag any diagram or text that still shows old (pre-extraction) boundaries. Cross-check against the 3 SKILL.md files in system-spec-kit, system-skill-advisor, system-code-graph.

---

## Track 5: External Refs + Footer (iter 13-15)

**Iter 13** — RQ_SHORT: NOTICE files + fork links
RQ_FULL: For every external reference in the README (NOTICE files, fork URLs like cocoindex-io/cocoindex-code, Apache 2.0 attribution), verify the file/URL exists and the cited license is accurate. Check that fork attribution language matches the actual fork relationships in the codebase.

**Iter 14** — RQ_SHORT: doc version + framework metric footer
RQ_FULL: Find the footer line (currently around line 1497 / 1494: "Documentation version: 4.11 | Last updated: 2026-05-15 | Framework: 11 agents, 20 skills, 22 commands, 66 MCP tools"). Verify each number against the Track 1 actuals. If Track 1 found drift, flag the footer accordingly.

**Iter 15** — RQ_SHORT: Apache 2.0 + license references
RQ_FULL: Grep the README for "Apache 2.0", "MIT", "GPL", and any other license names. For each occurrence, verify the cited license is accurate for the cited component (e.g., CocoIndex is Apache 2.0). Cross-check against `LICENSE` and `NOTICE` files.

---

## Track 6: FAQ + Quick Start (iter 16-18)

**Iter 16** — RQ_SHORT: FAQ Q&A accuracy
RQ_FULL: Walk every Q&A in the FAQ section. For each Q, verify the answer is current (no stale tool counts, no broken file paths, no superseded workflows). Flag any Q&A where the answer would mislead a current user.

**Iter 17** — RQ_SHORT: Quick Start install-step usability
RQ_FULL: Run-through the Quick Start as a new user would. For each step: does the prerequisite hold (binary installed, path exists)? Does the command produce the expected output? Are flags/args still supported? Flag steps that would silently fail or produce confusing output.

**Iter 18** — RQ_SHORT: bin paths + .env example
RQ_FULL: Grep the README for `.opencode/bin/` paths, npm scripts, and any `.env` example block. Verify each bin path resolves to an actual file, each npm script exists in `package.json`, and `.env` keys match what the launcher binaries actually read.

---

## Track 7: Cross-Runtime + Residual (iter 19-20)

**Iter 19** — RQ_SHORT: Copilot support + hook coverage per runtime
RQ_FULL: Walk every claim about runtime support (5 mirrored runtimes: OpenCode, Codex CLI, Claude Code, Gemini CLI, Copilot). For each: does the README accurately describe which features that runtime supports (full hook surface vs MCP-only vs startup-only)? Cross-check against the SKILL.md files for system-spec-kit + system-skill-advisor (they document per-runtime hook coverage).

**Iter 20** — RQ_SHORT: residual catch-all
RQ_FULL: With knowledge of all 19 prior iters' findings, scan the README one final time for drift Tracks 1-6 missed. Particular focus on: prose that describes the framework's "feel" or "what it does" — has the framework's actual capability outgrown or shrunk relative to the README's narrative? Are there sections describing features that no longer exist, or missing sections for features that exist but aren't documented? This is the catch-all for anything that didn't fit the prior 19 RQs.
