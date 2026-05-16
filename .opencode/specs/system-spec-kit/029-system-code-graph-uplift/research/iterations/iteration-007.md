# Iteration 007

## Focus

Q1: What specific bugs, drift, or weak prose exist in each authored doc under `.opencode/skills/system-code-graph/` beyond the 3 known INSTALL_GUIDE drifts (`:49`, `:56`, `:195`)?

## Actions Taken

1. Identified all authored docs under `.opencode/skills/system-code-graph/` using glob pattern search
2. Read main authored docs: ARCHITECTURE.md, INSTALL_GUIDE.md, README.md, SKILL.md
3. Read references docs: code-graph-readiness-check.md, database-path-policy.md, ownership-boundary.md
4. Read index docs: mcp_server/README.md, feature_catalog/feature_catalog.md, manual_testing_playbook/manual_testing_playbook.md
5. Cross-referenced version numbers, tool counts, and database path defaults across docs and source code (config.ts, readiness-marker.ts)

## Findings

### INSTALL_GUIDE.md

**Version drift (line 49):**
- `INSTALL_GUIDE.md:49` states "Skill version | `1.0.0.0`"
- `README.md:48` states version `1.0.3.1`
- `SKILL.md:5` states version `1.0.3.1`
- **Bug:** INSTALL_GUIDE version is outdated by 3 minor versions

**Tool count drift (known, lines 56, 195):**
- `INSTALL_GUIDE.md:56` states "MCP tools | 10"
- `INSTALL_GUIDE.md:195` states "Active MCP tools | 10"
- `ARCHITECTURE.md:51` correctly states "Tool surface (11 tools)"
- `README.md:52` correctly states "Active MCP tools | 11"
- **Drift:** INSTALL_GUIDE undercounts tools by 1 (missing `code_graph_classify_query_intent` added in packet 028)

**Database path drift (lines 55, 110, 132, 210, 216):**
- `INSTALL_GUIDE.md:55` states default: `.opencode/.spec-kit/code-graph/database/code-graph.sqlite`
- `INSTALL_GUIDE.md:110, 132` config notes repeat this default
- `INSTALL_GUIDE.md:210` reiterates this default
- `INSTALL_GUIDE.md:216` claims "legacy installs (database at `.opencode/skills/system-code-graph/mcp_server/database/`) are auto-migrated to the standalone shared location"
- **However**, `mcp_server/core/config.ts:13` uses `resolve(__dirname, '..', 'database')` which resolves to `.opencode/skills/system-code-graph/mcp_server/database/`
- `README.md:54` states default: `.opencode/skills/system-code-graph/mcp_server/database/`
- `database-path-policy.md:31` states policy: `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite`
- `ARCHITECTURE.md:72` states: "Database file: `mcp_server/database/code-graph.sqlite` by default"
- **Drift:** INSTALL_GUIDE claims the default is the standalone shared location (`.opencode/.spec-kit/code-graph/database/`) but the actual code default and 3 other docs say it's skill-local (`mcp_server/database/`). The migration claim in line 216 may be inverted or outdated.

**Weak prose (line 199):**
- `INSTALL_GUIDE.md:199` cross-skill imports section mentions "46 imports across 23 files" with detailed breakdown
- This level of implementation detail in an operator-facing install guide is weak prose - it's more appropriate for ARCHITECTURE.md or a dedicated coupling analysis doc
- **Weak prose:** Implementation coupling detail doesn't serve install guide audience

### README.md

**Database path cross-doc drift (line 54):**
- `README.md:54` states default: `.opencode/skills/system-code-graph/mcp_server/database/`
- This matches the code default in `config.ts` and `database-path-policy.md`
- But conflicts with `INSTALL_GUIDE.md` which claims the default is `.opencode/.spec-kit/code-graph/database/code-graph.sqlite`
- **Cross-doc drift:** README is correct per code, but conflicts with INSTALL_GUIDE

**Weak prose (line 48):**
- `README.md:48` version field shows `1.0.3.1` with no context about versioning scheme or when it changes
- No explanation of semantic versioning for this skill package
- **Weak prose:** Version field lacks context about versioning policy

### references/database-path-policy.md

**Potential implementation drift (line 31):**
- `database-path-policy.md:31` states policy: `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite`
- This matches config.ts, README.md, and ARCHITECTURE.md
- But conflicts with INSTALL_GUIDE.md and readiness-marker.ts which reference `.opencode/.spec-kit/code-graph/database/`
- **Potential drift:** Policy doc may not reflect actual migration status if readiness-marker.ts still uses the shared location

### mcp_server/lib/readiness-marker.ts

**Code drift (line 20):**
- `readiness-marker.ts:20` uses fallback: `.opencode/.spec-kit/code-graph/database`
- This conflicts with config.ts which uses skill-local `database/` as default
- **Code drift:** Readiness marker uses shared location fallback while config uses skill-local

### ARCHITECTURE.md

**No bugs or drift found**
- Tool count correctly states 11 tools (line 51)
- Database path correctly states skill-local default (line 72)
- Version not mentioned (appropriate for architecture doc)

### SKILL.md

**No bugs or drift found**
- Version correctly states 1.0.3.1 (line 5)
- Tool count implied through routing table (11 tools)
- No database path claims (appropriate for skill routing doc)

### feature_catalog/feature_catalog.md

**No bugs or drift found**
- Correctly states 11 MCP tools (line 38)
- No version claims (appropriate for feature catalog)
- No database path claims (appropriate for feature catalog)

### manual_testing_playbook/manual_testing_playbook.md

**No bugs or drift found**
- No tool count claims (appropriate for test playbook)
- No version claims (appropriate for test playbook)
- No database path claims (appropriate for test playbook)

### mcp_server/README.md

**No bugs or drift found**
- No tool count claims (appropriate for package README)
- No version claims (appropriate for package README)
- No database path claims (appropriate for package README)

### references/code-graph-readiness-check.md

**No bugs or drift found**
- Implementation reference doc with file:line citations
- No version or tool count claims (appropriate for reference)

### references/ownership-boundary.md

**No bugs or drift found**
- Correctly states 11 tools in system-code-graph (line 50)
- No version claims (appropriate for boundary doc)
- No database path claims (appropriate for boundary doc)

## Questions Answered

**Q1:** What specific bugs, drift, or weak prose exist in each authored doc under `.opencode/skills/system-code-graph/` beyond the 3 known INSTALL_GUIDE drifts (`:49`, `:56`, `:195`)?

Answered in this iteration. Key findings:
- INSTALL_GUIDE.md has 6 additional issues (1 version bug, 2 known tool count drifts, 3 database path drifts, 1 weak prose)
- README.md has 1 cross-doc drift and 1 weak prose
- database-path-policy.md has potential implementation drift
- readiness-marker.ts has code drift vs config.ts
- All other authored docs (ARCHITECTURE.md, SKILL.md, feature_catalog.md, manual_testing_playbook.md, mcp_server/README.md, code-graph-readiness-check.md, ownership-boundary.md) are clean

## Questions Remaining

- Q2: What sk-doc `--type` does each authored doc match, and what mandatory anchors / H2 cases / TOC requirements does each per-type contract impose?
- Q3: What HVR violations (em dashes, banned words, banned phrases, semicolons, Oxford commas) does each authored doc currently contain?
- Q4: What problem hook and section arc do the Public root README and system-spec-kit README use that the system-code-graph README should mimic structurally while staying HVR-clean?
- Q5: What "useful" content gaps exist in SKILL.md / references / per-folder mcp_server READMEs that operators reading the skill cold would benefit from?
- Q6: Which per-folder mcp_server READMEs require fresh authoring vs validation-only passes?
- Q7: Does the feature_catalog index + per-feature files validate as `--type playbook`?
- Q8: Does the manual_testing_playbook index + per-scenario files validate as `--type playbook`?
- Q9: What's the optimal child-001 task ordering?
- Q10: For child-002 (README marketing rewrite), what are the 3 worst-case HVR pitfalls the root README + system-spec-kit README contain that the system-code-graph README must avoid mimicking?

## Next Focus

Q2: sk-doc `--type` classification and mandatory requirements per authored doc. This will help establish the validation contract for each doc type before addressing HVR violations in Q3.
