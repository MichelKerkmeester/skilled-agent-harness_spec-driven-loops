# Iteration 016: Q1 Bug/Drift/Weak Prose Audit

## Focus
Q1: What specific bugs, drift, or weak prose exist in each authored doc under `.opencode/skills/system-code-graph/` beyond the 3 known INSTALL_GUIDE drifts (`:49`, `:56`, `:195`)?

## Actions Taken
1. Listed all markdown files under `.opencode/skills/system-code-graph/` to identify authored docs
2. Read 4 main skill docs: SKILL.md, README.md, ARCHITECTURE.md, INSTALL_GUIDE.md
3. Read 3 reference docs: code-graph-readiness-check.md, database-path-policy.md, ownership-boundary.md
4. Read 4 key mcp_server READMEs: mcp_server/README.md, handlers/README.md, lib/README.md, database/README.md
5. Analyzed for bugs, drift, and weak prose beyond the 3 known INSTALL_GUIDE drifts

## Findings

### INSTALL_GUIDE.md - Additional Drifts Beyond Known 3

**Version drift at line 49:**
- INSTALL_GUIDE.md:49 shows `Skill version: 1.0.0.0`
- Should be `1.0.3.1` to match SKILL.md:5 and README.md:48
- This is a documentation drift from the actual skill version

**Tool count drift at lines 56 and 195:**
- INSTALL_GUIDE.md:56 states `MCP tools: 10 (see [README.md](./README.md) §3.2)`
- INSTALL_GUIDE.md:195 states `Active MCP tools: 10`
- Actual tool count is 11 tools per ARCHITECTURE.md:49-64, README.md:52, and SKILL.md:4 (allowed-tools count)
- The 11 tools are: code_graph_scan, code_graph_query, code_graph_classify_query_intent, code_graph_status, code_graph_context, code_graph_verify, code_graph_apply, detect_changes, ccc_status, ccc_reindex, ccc_feedback
- This is a count drift from the actual MCP tool surface

**Database path discrepancy at line 43:**
- INSTALL_GUIDE.md:43 states database lives at `.opencode/.spec-kit/code-graph/database/code-graph.sqlite`
- This conflicts with references/database-path-policy.md:31 which shows the package-local path as `.opencode/skills/system-code-graph/mcp_server/database/`
- Also conflicts with database/README.md:53 which confirms the package-local location
- The INSTALL_GUIDE describes the post-migration standalone location but references/database-path-policy.md still documents the package-local policy
- This is a policy/location drift between migration docs and current policy docs

### SKILL.md - Continuity Drift

**Packet pointer drift at line 8:**
- SKILL.md:8 shows `packet_pointer: "system-spec-kit/028-system-code-graph-doc-alignment"`
- Current research packet is 029-system-code-graph-uplift
- This is a continuity drift that should be updated to point to the current packet

### Version Inconsistencies Across Docs

**Version reference inconsistencies:**
- SKILL.md:5 shows `version: 1.0.3.1`
- README.md:48 shows `Skill version: 1.0.3.1`
- INSTALL_GUIDE.md:49 shows `Skill version: 1.0.0.0` (drift)
- ARCHITECTURE.md:29 shows `Created: 2026-05-14 (014 extraction); architecture doc 2026-05-14 (014/014); reconstructed 2026-05-14 (014/019)` - no version field
- Changelog files show v1.0.0.0, v1.0.2.0, v1.0.3.0 but no v1.0.3.1 entry
- This creates version confusion across the documentation surface

### Weak Prose Issues

**INSTALL_GUIDE.md:43 - Ambiguous database location description:**
- States "The server is fully standalone: it does not depend on mk-spec-memory being installed first. Its database lives at `.opencode/.spec-kit/code-graph/database/code-graph.sqlite`, shared across runtimes and auto-migrated from the legacy skill-local location on first launch."
- This conflates the current standalone location with migration behavior without clearly distinguishing policy vs runtime
- Should separate: (1) current policy location, (2) migration behavior, (3) runtime override behavior

**references/database-path-policy.md:31-32 - Policy vs runtime ambiguity:**
- States policy path as `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite`
- But INSTALL_GUIDE.md:43 describes the standalone shared location
- The policy doc doesn't acknowledge the migration to the standalone location or explain when each path applies
- This creates operator confusion about which path is authoritative

**ownership-boundary.md:63-66 - Integration path description could be clearer:**
- Describes four integration contracts but doesn't clearly distinguish which are used by which consumer types
- Could benefit from a consumer-type mapping table similar to ARCHITECTURE.md:171-177

## Questions Answered
- **Q1**: What specific bugs, drift, or weak prose exist in each authored doc under `.opencode/skills/system-code-graph/` beyond the 3 known INSTALL_GUIDE drifts (`:49`, `:56`, `:195`)?
  - Answered: Found 5 additional issues (version drift at INSTALL_GUIDE:49, tool count drift at INSTALL_GUIDE:56/195, database path discrepancy at INSTALL_GUIDE:43, packet pointer drift at SKILL.md:8, version inconsistencies across docs, and weak prose in database path policy descriptions)

## Questions Remaining
- Q2: What sk-doc `--type` does each authored doc match, and what mandatory anchors / H2 cases / TOC requirements does each per-type contract impose?
- Q3: What HVR violations (em dashes, banned words, banned phrases, semicolons, Oxford commas) does each authored doc currently contain? Itemize per-file with line numbers.
- Q4: What problem hook and section arc do the Public root README and system-spec-kit README use that the system-code-graph README should mimic structurally while staying HVR-clean?
- Q5: What "useful" content gaps exist in SKILL.md / references / per-folder mcp_server READMEs that operators reading the skill cold would benefit from (e.g. "why structural matters" primer, glossary, situational triggers)?
- Q6: Which per-folder mcp_server READMEs (handlers/lib/tools/tests/core/plugin_bridges/database) require fresh authoring vs validation-only passes? Recent packet 035 shipped most; verify currency.
- Q7: Does the feature_catalog index + per-feature files validate as `--type playbook`? Are per-feature files inside the catalog discoverable via the per-type contract or do they require recursion?
- Q8: Does the manual_testing_playbook index + per-scenario files validate as `--type playbook`? Same recursion question.
- Q9: What's the optimal child-001 task ordering: SKILL.md hook first, then references HVR, then mcp_server per-folder usefulness audit, then INSTALL_GUIDE drift fixes? Or batch by file-type?
- Q10: For child-002 (README marketing rewrite), what are the 3 worst-case HVR pitfalls the root README + system-spec-kit README contain that the system-code-graph README must avoid mimicking?

## Next Focus
Q2: Map each authored doc to its sk-doc `--type` and identify mandatory anchors, H2 cases, and TOC requirements per the sk-doc contract. This will help identify structural compliance issues before addressing HVR violations in Q3.
