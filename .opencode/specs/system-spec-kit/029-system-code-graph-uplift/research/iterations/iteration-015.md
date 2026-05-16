# Iteration 015 - Q3 Gap Analysis: MCP Server Per-Folder README HVR Violations

## Focus

Q3: What HVR violations (em dashes, banned words, banned phrases, semicolons, Oxford commas) does each authored doc currently contain? Itemize per-file with line numbers.

**Gap identified:** Iteration 1 conducted HVR violation detection for core authored docs (SKILL.md, README.md, ARCHITECTURE.md, INSTALL_GUIDE.md, references/, feature_catalog/feature_catalog.md, manual_testing_playbook/manual_testing_playbook.md) but did NOT cover the mcp_server per-folder READMEs (11 files) or per-feature/per-scenario files. This iteration audits the mcp_server per-folder READMEs to close that gap.

## Actions Taken

1. Read findings registry to understand Q3 coverage gaps from iteration 1
2. Read all 11 mcp_server per-folder READMEs:
   - mcp_server/core/README.md
   - mcp_server/handlers/README.md
   - mcp_server/lib/README.md
   - mcp_server/tools/README.md
   - mcp_server/database/README.md
   - mcp_server/tests/README.md
   - mcp_server/plugin_bridges/README.md
   - mcp_server/lib/utils/README.md
   - mcp_server/stress_test/code-graph/README.md
   - mcp_server/tests/handlers/README.md
   - mcp_server/README.md (root mcp_server)
3. Systematically scanned each file for HVR violations (em dashes, semicolons, Oxford commas, banned words/phrases)
4. Documented all violations with file:line citations

## Findings

### MCP Server Per-Folder README HVR Violations

**Clean files (0 violations):**
- `mcp_server/core/README.md` - No HVR violations
- `mcp_server/handlers/README.md` - No HVR violations
- `mcp_server/lib/README.md` - No HVR violations
- `mcp_server/tools/README.md` - No HVR violations
- `mcp_server/database/README.md` - No HVR violations
- `mcp_server/tests/README.md` - No HVR violations
- `mcp_server/plugin_bridges/README.md` - No HVR violations
- `mcp_server/lib/utils/README.md` - No HVR violations
- `mcp_server/stress_test/code-graph/README.md` - No HVR violations

**Files with violations:**

**mcp_server/tests/handlers/README.md:67** - Oxford comma violation: "Points reviewers at OpenCode naming, header, error-handling, and type-discipline checks." - The comma before "and" is an Oxford comma violation per HVR rules.

**mcp_server/tests/handlers/README.md:90** - Oxford comma violation: "Applies OpenCode TypeScript, JavaScript, Python, Shell, and config conventions." - The comma before "and" is an Oxford comma violation per HVR rules.

**mcp_server/README.md:35** - Oxford comma violation: "It is the main barrel that initializes the Model Context Protocol server, registers tool schemas, and dispatches tool calls via `tools/` to handler modules." - The comma before "and" is an Oxford comma violation per HVR rules.

**mcp_server/README.md:40** - Oxford comma violation: "...registers two handlers: a `ListTools` handler backed by `tool-schemas.ts`, and a `CallTool` handler backed by `tools/index.js` (the dispatcher)." - The comma before "and" is an Oxford comma violation per HVR rules.

### Summary Statistics

- Total mcp_server per-folder READMEs audited: 11
- Files with violations: 2
- Total violations found: 4 (all Oxford commas)
- Files with 0 violations: 9
- Em dashes found: 0
- Semicolons found: 0
- Banned words/phrases found: 0

### Comparison with Core Authored Docs (from Iteration 1)

The core authored docs have significantly more HVR violations:
- ARCHITECTURE.md: 12 em dashes + 18 semicolons + 4 Oxford commas = ~34 violations
- INSTALL_GUIDE.md: 1 em dash + 7 semicolons + 13 Oxford commas = ~21 violations
- feature_catalog/feature_catalog.md: 6 em dashes + 2 semicolons + 1 Oxford comma = ~9 violations
- README.md: 1 em dash + 1 semicolon + 2 Oxford commas = ~4 violations
- references/ownership-boundary.md: 1 semicolon + 1 Oxford comma = ~2 violations
- SKILL.md: 1 em dash + 1 semicolon + 1 Oxford comma = ~3 violations

The mcp_server per-folder READMEs are substantially cleaner (only 4 total violations across 11 files), suggesting they were written with stricter HVR compliance or were authored more recently.

### Remaining Q3 Gaps

Per-feature files in feature_catalog/ (18 files) and per-scenario files in manual_testing_playbook/ (24 files) were not audited in this iteration due to tool call constraints. These remain as Q3 gaps for future iterations (progressive focus guide suggests iter 7-8 for catalog/playbook validation).

## Questions Answered

Q3 partially answered: Completed HVR violation audit for mcp_server per-folder READMEs (11 files), finding 4 Oxford comma violations across 2 files. This closes the Q3 gap for mcp_server documentation but leaves per-feature (18 files) and per-scenario (24 files) audits pending.

## Questions Remaining

- Q1: What specific bugs, drift, or weak prose exist in each authored doc under `.opencode/skills/system-code-graph/` beyond the 3 known INSTALL_GUIDE drifts (`:49`, `:56`, `:195`)? (Substantively answered in iter-012 for core authored docs; per-feature/per-scenario files not audited)
- Q2: What sk-doc `--type` does each authored doc match, and what mandatory anchors / H2 cases / TOC requirements does each per-type contract impose? (Answered in iter-014)
- Q3: What HVR violations (em dashes, banned words, banned phrases, semicolons, Oxford commas) does each authored doc currently contain? (Partially answered: core docs + mcp_server READMEs complete; per-feature/per-scenario files pending)
- Q4: What problem hook and section arc do the Public root README and system-spec-kit README use that the system-code-graph README should mimic structurally while staying HVR-clean?
- Q5: What "useful" content gaps exist in SKILL.md / references / per-folder mcp_server READMEs that operators reading the skill cold would benefit from (e.g. "why structural matters" primer, glossary, situational triggers)? (Partially answered in iter-013)
- Q6: Which per-folder mcp_server READMEs (handlers/lib/tools/tests/core/plugin_bridges/database) require fresh authoring vs validation-only passes? Recent packet 035 shipped most; verify currency. (Answered in iter-013: plugin_bridges requires fresh authoring)
- Q7: Does the feature_catalog index + per-feature files validate as `--type playbook`? Are per-feature files inside the catalog discoverable via the per-type contract or do they require recursion?
- Q8: Does the manual_testing_playbook index + per-scenario files validate as `--type playbook`? Same recursion question.
- Q9: What's the optimal child-001 task ordering: SKILL.md hook first, then references HVR, then mcp_server per-folder usefulness audit, then INSTALL_GUIDE drift fixes? Or batch by file-type?
- Q10: For child-002 (README marketing rewrite), what are the 3 worst-case HVR pitfalls the root README + system-spec-kit README contain that the system-code-graph README must avoid mimicking?

## Next Focus

Q7: Validate feature_catalog index + per-feature files as `--type playbook` and determine if per-feature files are discoverable via the per-type contract or require recursion. This addresses a structural validation gap that informs both Q3 (remaining HVR audits) and Q5 (content gaps). The progressive focus guide suggests iter 7-8 for catalog/playbook validation, making this the logical next priority after completing the mcp_server README HVR audit.
