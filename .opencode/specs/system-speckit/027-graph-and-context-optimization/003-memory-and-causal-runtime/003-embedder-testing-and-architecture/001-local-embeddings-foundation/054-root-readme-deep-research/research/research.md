# Root README Deep-Research — Consolidated Findings (056)

## Summary
- Total iterations: 20
- Total findings: 263
- Per-track breakdown:
  - Track 1 (counts/inventories): 17 findings (3 drifted, 14 current)
  - Track 2 (claim accuracy): 7 findings (3 naming inconsistencies, 4 current)
  - Track 3 (HVR voice): 185 findings (183 punctuation, 2 banned-word literal uses allowed)
  - Track 4 (diagrams): 6 findings (3 topology oversimplifications, 1 naming, 2 current)
  - Track 5 (external refs/footer): 6 findings (1 potential typo, 3 drifted, 2 current)
  - Track 6 (FAQ/Quick Start): 16 findings (7 critical install issues, 3 FAQ errors, 6 bin/env current)
  - Track 7 (cross-runtime/residual): 7 findings (5 runtime mischaracterizations, 2 terminology gaps)

## Findings by Severity

### P0 — Drift requiring immediate edit

**Tool count drifts (Iter 001):**
- Line 57, 1455, 1497: "66 MCP Tools" → "69 MCP Tools" (actual: 39+9+11+7+2+1=69)
- Line 671: "mk_skill_advisor (8)" → "mk_skill_advisor (9)" or clarify "8 public + 1 internal"
- Line 57, 1455, 1497: "mk_code_index (10)" → "mk_code_index (11)"
- Line 57, 1455, 1497: "CocoIndex (1)" → "CocoIndex (2)"

**FAQ tool count drift (Iter 016):**
- Line 1455: FAQ claims "66 total" but actual is 69; breakdown incorrect

**Footer drift (Iter 014):**
- Line 1497: Footer claims "66 MCP tools" → "69 MCP tools"
- Line 1497: Footer breakdown "39 mk-spec-memory + 8 mk_skill_advisor + 10 mk_code_index + 7 code mode + 1 CocoIndex + 1 sequential thinking" → "39 mk-spec-memory + 9 mk_skill_advisor + 11 mk_code_index + 7 code mode + 2 CocoIndex + 1 sequential thinking"

**FAQ broken path (Iter 016):**
- Line 1451: ".agents/agents/" directory does not exist; should reference `.opencode/agents/` only

**FAQ feature catalog count drift (Iter 016):**
- Line 1459: "290-entry reference" → "218-entry reference"

**Quick Start critical failures (Iter 017):**
- Lines 133-135: Step 3 build command references non-existent package.json in mcp_server
- Lines 137-139: Step 4 build command references non-existent package.json in skill-advisor
- Lines 141-143: Step 5 build command references non-existent package.json in system-code-graph
- Lines 145-147: Step 6 build command references non-existent package.json in scripts
- Line 175: Verification command references non-existent dist/context-server.js
- Line 178: rg command assumes ripgrep installed and configs exist (won't work on fresh system)
- Line 131: Root npm install insufficient for framework dependencies

**Runtime mischaracterizations (Iter 019):**
- Line 11: "5 Mirrored Runtimes" is misleading - only 3 have mirrored agents, 2 use MCP/startup integration
- Line 7: "Copilot support for MCP and startup-surface workflows" mischaracterizes limited Copilot support
- Line 595: "All four supported runtimes transport the same compact startup shared-payload" is false for Copilot
- Line 60, 744: Codex requires explicit opt-in for native hooks (not documented)
- Lines 7, 60, 595, 744: Inconsistent runtime naming (Copilot CLI vs GitHub Copilot vs Copilot)

### P1 — Voice/HVR violations

**Em dash violations (Iter 008):**
- Line 1164: Prose em dash in doctor description
- Line 1176: Prose em dash in install description list
- Line 1177: Prose em dash in debug description list
- Line 1186: Prose em dash in YAML workflows description

**Semicolon violations (Iter 008):**
- 100+ semicolon violations in prose across README (no legitimate bash flag separators found)
- Sample locations: 159, 288, 372, 375, 394, 420-422, 428, 541-542, 588, 595, 607-609, 629

**Oxford comma violations (Iter 008):**
- 79 violations (68 ", and" + 11 ", or") in prose across README
- Sample locations: 7, 55, 112, 246, 286, 370, 387-389, 420-422, 472, 550, 552, 588, 733, 955, 1013, 1024, 1267, 1425

**Banned words (Iter 007):**
- Line 754: "harness" (allowed - literal technical use for test harness)
- Line 924: "harness" (allowed - literal technical use for test harness enforcement)

**Banned phrases (Iter 009):**
- None found

### P2 — Polish / clarification

**Naming inconsistencies (Iter 004):**
- Line 59, 110: "mk-code-index" (hyphen) → "mk_code_index" (underscore) to match opencode.json
- Line 27, 864, 1249, 1273, 1296: "code-mode" / "mcp-code-mode" (hyphen in skill names) vs "code_mode" (underscore in server registration) - mixed convention
- Line 1497: "Documentation version: 4.11" does not correspond to any changelog entry (Iter 004, 014)

**Agent naming (Iter 011):**
- Lines 944-949: README lists "Create" agent but actual file is "markdown.md"

**Potential typo (Iter 013):**
- Line 9: "https://buymeacoffee.com/michelkermemeester" (double 'me') - may be intentional if username differs

**Documentation gaps (Iter 010):**
- Native MCP Topology diagram oversimplifies architecture (no boundary relationships, shared contracts, pending migrations shown)

**Tagline terminology (Iter 020):**
- Line 11: "Cross-Runtime Hooks" listed as pillar but has no dedicated section
- Line 11: "5 Mirrored Runtimes" is misleading (only 3 use agent mirroring)

**Runtime coverage accurate but nuanced (Iter 019):**
- Lines 7, 60, 595, 744: Runtime names inconsistent (Copilot CLI vs GitHub Copilot vs Copilot)

## De-duplicated edit list (preview)

**Tool count edits (Iter 001, 014, 016):**
- EDIT: Change "66" → "69" in lines 57, 1455, 1497
- EDIT: Update MCP tool breakdown from "39+8+10+7+1+1" to "39+9+11+7+2+1" in lines 57, 1455, 1497
- EDIT: Clarify mk_skill_advisor count as "8 public + 1 internal" or update to 9 (line 671, 1455, 1497)

**Naming consistency edits (Iter 004):**
- EDIT: Change "mk-code-index" → "mk_code_index" in lines 59, 110
- EDIT: Consider standardizing code_mode references (lines 27, 864, 1249, 1273, 1296)

**HVR punctuation edits (Iter 008):**
- EDIT: HVR-PUNCT-FIX bucket (183 violations: 4 em dashes, 100+ semicolons, 79 Oxford commas) - use iter 8 findings file for per-occurrence rewrites

**FAQ edits (Iter 016):**
- EDIT: Fix tool count in FAQ (line 1455) to match actual 69
- EDIT: Fix broken path ".agents/agents/" → ".opencode/agents/" (line 1451)
- EDIT: Fix feature catalog count "290-entry" → "218-entry" (line 1459)

**Quick Start edits (Iter 017):**
- EDIT: Rewrite entire Quick Start installation section to match actual deployment model (launcher scripts vs build-from-source)
- EDIT: Remove or fix broken npm build commands (lines 133-147)
- EDIT: Fix verification commands (lines 175, 178)

**Runtime terminology edits (Iter 019, 020):**
- EDIT: Change "5 Mirrored Runtimes" → "5 Runtimes" or "5 Runtime Coverage" (line 11, 907, 1427)
- EDIT: Clarify Copilot support is limited, not full MCP/startup parity (line 7)
- EDIT: Add Codex opt-in requirement documentation (lines 60, 744)
- EDIT: Standardize runtime naming to "Copilot CLI" consistently
- EDIT: Remove "Cross-Runtime Hooks" from tagline or add dedicated section

**Agent naming edit (Iter 011):**
- EDIT: Change "Create" → "Markdown" in agent network section (lines 944-949)

**Doc version edit (Iter 014, 004):**
- EDIT: Investigate and fix "Documentation version: 4.11" (line 1497) - either create changelog entry or explain scheme

**Potential typo edit (Iter 013):**
- EDIT: Verify and fix Buy Me A Coffee URL if typo confirmed (line 9)

**Topology diagram edit (Iter 010):**
- EDIT: Add boundary notation or notes to Native MCP Topology diagram (lines 89-97)

---

<!-- ANCHOR:citations -->
## Citations

All findings in this consolidation trace back to specific iteration files. Reference list:

- [Iter 001 — tool surface count](iterations/iteration-001.md)
- [Iter 002 — agent + skill + command counts](iterations/iteration-002.md)
- [Iter 003 — MCP server registration inventory](iterations/iteration-003.md)
- [Iter 004 — MCP server names + versions](iterations/iteration-004.md)
- [Iter 005 — file paths + env vars](iterations/iteration-005.md)
- [Iter 006 — install steps + Quick Start](iterations/iteration-006.md)
- [Iter 007 — banned HVR words](iterations/iteration-007.md)
- [Iter 008 — HVR punctuation hard blockers](iterations/iteration-008.md) (183 occurrences cataloged)
- [Iter 009 — banned HVR phrases](iterations/iteration-009.md)
- [Iter 010 — Native MCP topology diagram](iterations/iteration-010.md)
- [Iter 011 — Agent Network diagram](iterations/iteration-011.md)
- [Iter 012 — runtime arrows + extraction boundaries](iterations/iteration-012.md)
- [Iter 013 — NOTICE files + fork links](iterations/iteration-013.md)
- [Iter 014 — doc version + framework footer](iterations/iteration-014.md)
- [Iter 015 — Apache 2.0 + license references](iterations/iteration-015.md)
- [Iter 016 — FAQ Q&A accuracy](iterations/iteration-016.md)
- [Iter 017 — Quick Start install-step usability](iterations/iteration-017.md)
- [Iter 018 — bin paths + .env example](iterations/iteration-018.md)
- [Iter 019 — Copilot support + hook coverage per runtime](iterations/iteration-019.md)
- [Iter 020 — residual catch-all](iterations/iteration-020.md)

State machine: `research/deep-research-state.jsonl` records per-iter status + newInfoRatio + timestamp.
Delta: `research/delta-verified.md` is the surgical edit list passed to Phase 4 sonnet @markdown.
Evidence: `research/edit-evidence.md` is the Phase 4 before/after transcript.
<!-- /ANCHOR:citations -->
