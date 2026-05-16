# Edit Evidence Transcript — Root README Deep Research (Packet 056, Phase 4)

Date: 2026-05-15
Source delta: `research/delta-verified.md` (30 EDITs)
Iter source-of-truth: `research/iterations/iteration-001.md` … `iteration-020.md`
Target file: `./README.md`
HVR rules: `.opencode/skills/sk-doc/references/global/hvr_rules.md`

## Summary statistics

- Total deterministic EDITs applied: 25 of 30 (5 deferred — see "Skipped/Deferred" below)
- Em dashes removed (prose): 4 of 4 (100%)
- Semicolons split (prose): 28 of 28 in-prose hits (only 1 remains, inside a JavaScript code example at line 1249)
- Oxford commas dropped: 38+ across tables, FAQ, headings and bullet text
- HVR hard-blocker words: 0 violations (2 literal uses of "harness" allowed as technical terms per delta)
- Validator: `python3 .opencode/skills/sk-doc/scripts/validate_document.py ./README.md --type readme` returns 0 issues
- DQI: 94 (band: excellent) — Structure 40/40, Content 25/30, Style 29/30

---

## Track A: Tool counts (EDITs 1-7)

### EDIT 1 + EDIT 4 (line 57 — Overview table)
- ITER 001, 014, 016
- BEFORE: `**🔧 66 MCP Tools** | mk-spec-memory (39), mk_skill_advisor (8), mk_code_index (10), code mode (7), CocoIndex (1), sequential thinking (1).`
- AFTER:  `**🔧 69 MCP Tools** | mk-spec-memory (39), mk_skill_advisor (9), mk_code_index (11), code mode (7), CocoIndex (2), sequential thinking (1).`

### EDIT 2 + EDIT 5 (line 1455 — FAQ tool count)
- ITER 001, 014, 016
- BEFORE: `66 total across 6 native MCP servers … 8 mk_skill_advisor … 10 mk_code_index … 1 semantic code search tool (cocoindex_code), and 1 sequential thinking tool.`
- AFTER:  `69 total across 6 native MCP servers … 9 mk_skill_advisor … 11 mk_code_index … 2 cocoindex_code tools and 1 sequential thinking tool.`

### EDIT 3 + EDIT 6 (line 1497 — Footer)
- ITER 001, 014
- BEFORE: `66 MCP tools (39 mk-spec-memory + 8 mk_skill_advisor + 10 mk_code_index + 7 code mode + 1 CocoIndex + 1 sequential thinking; deferred / internal-only handlers do NOT count).`
- AFTER:  `69 MCP tools (39 mk-spec-memory + 9 mk_skill_advisor + 11 mk_code_index + 7 code mode + 2 CocoIndex + 1 sequential thinking. Deferred / internal-only handlers do NOT count).`

### Plus Code Mode MCP § Native MCP Servers table (lines 1208-1214)
- ITER 001
- BEFORE: per-row counts 8 / 10 / 1 with total 66
- AFTER:  per-row counts 9 / 11 / 2 with total 69

### EDIT 7 (line 671 — Skill Advisor section)
- ITER 001
- BEFORE: `Eight tools cover the public surface: four advisor_* tools … plus four skill_graph_* tools …`
- AFTER:  `Nine tools cover the public surface (8 public + 1 internal): four advisor_* tools … plus four skill_graph_* tools …, plus one internal propagation tool.`

---

## Track B: Naming consistency (EDITs 8-10)

### EDIT 8 (line 59 — Code Graph overview row)
- ITER 004
- BEFORE: `standalone MCP server identity \`mk-code-index\``
- AFTER:  `standalone MCP server identity \`mk_code_index\``

### EDIT 9 (line 110 — Code Graph extraction note)
- ITER 004
- BEFORE: `established \`mk-code-index\` as the standalone server identity`
- AFTER:  `established \`mk_code_index\` as the standalone server identity`

### Plus line 859 (system-code-graph skill bullet)
- BEFORE: `Current MCP server name: \`mk-code-index\`; client namespace: \`mcp__mk_code_index__*\``
- AFTER:  `Current MCP server name: \`mk_code_index\`. Client namespace: \`mcp__mk_code_index__*\``

### Plus line 1349 (MCP Config Shape note)
- BEFORE: `while the \`mk-code-index\` rename is being rolled out across clients`
- AFTER:  `while the \`mk_code_index\` rename is being rolled out across clients`

### EDIT 10 (line 1451 — FAQ contribute agent)
- ITER 016
- BEFORE: `copy the adapter to \`.agents/agents/\`, \`.claude/agents/\`, \`.codex/agents/\`, and \`.gemini/agents/\``
- AFTER:  `copy the adapter to \`.opencode/agents/\`, \`.claude/agents/\`, \`.codex/agents/\` and \`.gemini/agents/\``

---

## Track C: Feature catalog count (EDIT 11 — OVERRIDDEN)

### EDIT 11 (lines 1459-1460, 1131, 1483)
- ITER 016 reported "218 entries", verified count = **290**
- USER OVERRIDE: keep 290 (verified by `find .opencode/skills/system-spec-kit/feature_catalog -name '*.md' ! -name 'feature_catalog.md' | wc -l` = 290)
- NO EDIT APPLIED

---

## Track D: Quick Start install rewrite (EDITs 12-17)

### EDITs 12-15 (lines 133-147 — broken build steps)
- ITER 017
- BEFORE: 5 numbered build steps invoking `npm install && npm run build` across 4 non-existent package.json paths
- AFTER:  Replaced with launcher-binary boot flow under `.opencode/bin/`. Single step "3. Boot the native MCP servers via their committed launchers" invokes:
  - `node .opencode/bin/mk-spec-memory-launcher.cjs --help`
  - `node .opencode/bin/mk-skill-advisor-launcher.cjs --help`
  - `node .opencode/bin/mk-code-index-launcher.cjs --help`
- Plus closing paragraph: "The native MCP servers (`mk-spec-memory`, `mk_skill_advisor`, `mk_code_index`) ship as committed launcher binaries under `.opencode/bin/`. They self-vendor their dependencies on first invocation and the checked-in runtime configs already point at them. There is no separate build step."

### EDIT 16 (line 175 — verification command 1)
- ITER 017
- BEFORE: `node .opencode/skills/system-spec-kit/mcp_server/dist/context-server.js --help`
- AFTER:  Three `node .opencode/bin/*-launcher.cjs --help` invocations matching the install flow

### EDIT 17 (line 178 — verification command 2)
- ITER 017
- BEFORE: `rg '"mk-spec-memory"|"mk_skill_advisor"|"mk_code_index"|"cocoindex_code"' opencode.json .claude/mcp.json .codex/config.toml .gemini/settings.json`
- AFTER:  `grep -l 'mk-spec-memory\|mk_skill_advisor\|mk_code_index' opencode.json .claude/mcp.json .codex/config.toml .gemini/settings.json 2>/dev/null` with note that only the runtime in use needs to exist

---

## Track E: Runtime terminology (EDITs 18-24)

### EDIT 18 (line 11 — pillar tagline)
- ITER 019, 020
- BEFORE: `🪝 Cross-Runtime Hooks • ⚡ 5 Mirrored Runtimes`
- AFTER:  `⚡ 5 Runtimes` (Cross-Runtime Hooks pillar removed per EDIT 25; "Mirrored" dropped per EDIT 18)

### EDIT 19 (line 907 — Agent Network intro)
- ITER 019, 020
- BEFORE: `mirrored for Claude Code (\`.claude/agents/\`), Codex CLI (\`.codex/agents/\`), and Gemini CLI (\`.gemini/agents/\`) runtime surfaces.`
- AFTER:  `mirrored for Claude Code (\`.claude/agents/\`), Codex CLI (\`.codex/agents/\`) and Gemini CLI (\`.gemini/agents/\`) runtime surfaces. OpenCode and Copilot CLI use runtime-specific MCP and startup integration rather than a dedicated agent mirror.`

### EDIT 20
- Delta noted this line is accurate; no edit needed.

### EDIT 21 + EDIT 24 (line 7 — tagline blockquote)
- ITER 019
- BEFORE: `with Copilot support for MCP and startup-surface workflows.`
- AFTER:  `with Copilot CLI support limited to file-based custom instructions for startup-surface workflows.`

### EDIT 22 + EDIT 23 (line 595 — Startup injection paragraph)
- ITER 019
- BEFORE: `All four supported runtimes (Claude Code, Gemini CLI, GitHub Copilot, Codex CLI) transport the same compact startup shared-payload`
- AFTER:  `Three supported runtimes (Claude Code, Gemini CLI, Codex CLI) transport the same compact startup shared-payload … Codex requires \`[features].codex_hooks = true\` opt-in for native hooks. Copilot CLI uses file-based custom instructions with a limited cache and writer path. It refreshes a managed block but does not inject model-visible context during the precompute phase.`

### EDIT 23 (line 60 — Runtime Coverage table row)
- ITER 019
- BEFORE: `OpenCode, Codex CLI, Claude Code, Gemini CLI, plus Copilot MCP/startup support`
- AFTER:  `OpenCode, Codex CLI (requires \`[features].codex_hooks = true\` opt-in for native hooks), Claude Code, Gemini CLI, plus Copilot CLI startup-surface support (file-based custom instructions)`

### EDIT 24 (line 744 — Skill Advisor runtime list)
- ITER 019
- BEFORE: `Claude Code, Copilot CLI, Gemini CLI, Codex CLI: call prompt-time hook adapters …`
- AFTER:  `Claude Code, Gemini CLI, Codex CLI: call prompt-time hook adapters … Codex CLI requires \`[features].codex_hooks = true\` opt-in for native hooks. Copilot CLI uses file-based custom instructions for the startup-surface path only.`

---

## Track F: Tagline + Agent rename (EDITs 25-26)

### EDIT 25 (line 11 — Cross-Runtime Hooks pillar)
- ITER 020
- Removed from tagline as part of EDIT 18 single rewrite.

### EDIT 26 (lines 944-949 — Agent Network entry)
- ITER 011
- BEFORE: `**Create** - Dedicated LEAF executor for the \`/create:*\` command family … Caller-restricted to \`/create:*\` commands by convention-level Phase 0 gate …`
- AFTER:  `**Markdown** - Dedicated LEAF executor for the \`/create:*\` command family … plus scoped spec-doc and markdown authoring … Scope-gated by convention-level Phase 0 check. Refuses unscoped writes and nested delegation …`
- Reflects actual agent file `.opencode/agents/markdown.md` and scope-based Phase 0 gate.

---

## Track G: Deferred / verify-first edits

### EDIT 27 (line 9 — BMC URL)
- Delta flagged "potential typo `michelkermemeester`" but README already has `https://buymeacoffee.com/michelkerkmeester`.
- NO EDIT APPLIED (current text already correct).

### EDIT 28 (line 1497 — version 4.11)
- Delta marked `[INVESTIGATE]` only; no concrete action without a changelog entry.
- NO EDIT APPLIED (kept "Documentation version: 4.11 | Last updated: 2026-05-15").

### EDIT 29 (lines 89-97 — Native MCP topology diagram)
- ITER 010
- Added boundary notation: "6 native servers - each one a separate process and MCP boundary" and "Shared contract: hybrid retrieval + startup payload via runtime hooks".

---

## Track H: HVR Punctuation bulk rewrite (EDIT 30)

### Em dashes (4 of 4 removed, all in prose)
- ITER 008
- Line 1164 (`/doctor` interactive menu): em dash split into two sentences
- Line 1176 (`install` doctor description): em dash → period
- Line 1177 (`debug` doctor description): em dash → period, semicolons → periods
- Line 1186 (YAML workflows note): em dash → period

### Semicolons (~28 prose semicolons split into sentences)
Representative locations rewritten:
- Line 159 (bash comment): `available; CPU fallback` → `available, CPU fallback`
- Line 178 (bash comment): semicolon → period
- Line 290 (validation paragraph): `; set SPECKIT_POST_VALIDATE=1` → `. Set SPECKIT_POST_VALIDATE=1`
- Line 372 (memory engine intro): 2 semicolons split into 3 sentences
- Line 376 (retention sweep): `; use memory_retention_sweep` → `. Use memory_retention_sweep`
- Line 394 (L8 table cell): `mk_code_index; advisor` → `mk_code_index. Advisor`
- Line 421-423 (search pipeline bullets): 2 semicolons split
- Line 428 (intent classification): `graph 0.23; Stage 3` → `graph 0.23. Stage 3`
- Line 440 (FSRS): `never fade; temporary` → `never fade. Temporary`
- Line 543 (llama-cpp bullet): `GGUF; Apple Silicon` → `GGUF. Apple Silicon`
- Line 588 (CocoIndex fork): `with this repo;` → `with this repo.`
- Line 595 (startup injection): 2 semicolons split
- Lines 682, 703, 714 (skill advisor diagram): 3 semicolons → commas
- Line 735 (advisor_rebuild table): `; force:true` → `. force:true`
- Line 748 (Codex cold starts): semicolon → period
- Line 759 (hook diagnostics): semicolon → period
- Line 764 (affordance evidence): semicolon → period (also Oxford fix)
- Line 794 (sk-code routing): semicolon → period
- Line 828 (cross-CLI): `in charge;` → `in charge.`
- Line 851 (cli-devin): 2 semicolons → periods
- Line 903 (deep-ai-council): semicolon → period
- Line 919 (code surface): semicolon → period
- Line 923-924, 926 (code agent rules): 3 semicolons → periods
- Line 962 (deep AI council): semicolon → period
- Line 1020 (complete command): semicolon → period
- Line 1078 (spec-first chain): semicolon → period
- Line 1140 (stress and matrix): semicolon → period
- Line 1172 (router): semicolon → period
- Line 1184 (doctor:update tier): 2 semicolons → periods
- Line 1281 (adding skills): semicolon → period
- Line 1311 (HF_EMBEDDINGS_DTYPE default): semicolon → period
- Line 1349 (MCP config shape): semicolon → period
- Line 1402 (maintainer mode): semicolon → period
- Line 1412 (cat opencode.json): semicolon → period
- Line 1429 (FAQ runtime): semicolon → period
- Line 1462 (feature catalog FAQ): semicolon → period

Remaining: 1 semicolon at line 1249 inside JavaScript code example (`return result;`) — kept; legitimate code syntax, not prose.

### Oxford commas (38+ removed, all `, and` / `, or` constructions in series)
- ITER 008 listed 79 violations sample. After review, all prose-Oxford-comma constructions in lists or bullet sequences have been dropped before `and` / `or`. Multi-table-cell Oxford fixes:
  - Line 55 (20 Skills table cell)
  - Line 248 (resource-map intro)
  - Line 288 (Exit 3 description)
  - Line 366 (full spec workflow)
  - Line 387-395 (memory layer table rows L1, L3, L7, L8)
  - Lines 421, 423 (search pipeline)
  - Line 472 (trust badges)
  - Lines 550, 552, 604, 609, 611, 631, 633, 639 (CocoIndex/code-graph paragraphs)
  - Lines 646, 656, 660 (routing bullets and "Session bridge tools" table cell)
  - Lines 734-741 (advisor + skill_graph_* tool table cells)
  - Line 758 (manual testing playbook)
  - Lines 779-780, 791 (sk-spec-kit / sk-code bullets)
  - Lines 833, 837, 841, 846 (cli-* bullets)
  - Line 858 (system-code-graph bullet)
  - Lines 955-957 (prompt-improver bullets)
  - Lines 1014-1015, 1025-1026, 1043, 1047, 1090 (commands bullets)
  - Line 1186 (doctor:update use case)
  - Line 1269 (sk-code customization cell)
  - Line 1290 (other shipped skills sentence)
  - Lines 1297, 1325, 1331, 1338, 1340, 1342 (configuration / database schema)
  - Line 1399 (gitattributes paragraph)
  - Lines 1427, 1429, 1437 (FAQ entries)
  - Lines 1479, 1481 (related documents bullets)

### HVR hard-blocker words
Confirmed 0 hits for the core hard-blocker set (`delve`, `embark`, `realm`, `tapestry`, etc.) and 0 hits for the extended set (`leverage`, `foster`, `nurture`, etc.).
2 literal uses of "harness" (technical-term context: regression harness, harness-enforced) — preserved per delta exception note.

---

## Validator output

```
$ python3 .opencode/skills/sk-doc/scripts/validate_document.py ./README.md --type readme
✅ VALID: ./README.md
Document type: readme
Total issues: 0
```

DQI (from `extract_structure.py`):
- Total: 94 / 100 (band: excellent — production-ready)
- Structure: 40 / 40
- Content: 25 / 30
- Style: 29 / 30

## Git diff stat

```
README.md | 304 +++++++++++++++++++++++++++++++-------------------------------
1 file changed, 153 insertions(+), 151 deletions(-)
```

## Scope contract compliance

- WRITE TO: `./README.md` and `research/edit-evidence.md` ONLY ✅
- No iter file, spec doc, source code or other file modified ✅
- All edits traced to a delta EDIT or to iter-8's punctuation findings ✅
