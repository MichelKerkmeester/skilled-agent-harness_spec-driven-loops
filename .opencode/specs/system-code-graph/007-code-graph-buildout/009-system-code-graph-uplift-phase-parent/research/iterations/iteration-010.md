# Iteration 010 - Q1 Deep Dive: Bugs, Drift, and Weak Prose in Authored Docs

## Focus

Q1: What specific bugs, drift, or weak prose exist in each authored doc under `.opencode/skills/system-code-graph/` beyond the 3 known INSTALL_GUIDE drifts (`:49`, `:56`, `:195`)?

## Actions Taken

1. Read all core authored docs: SKILL.md, README.md, INSTALL_GUIDE.md, ARCHITECTURE.md
2. Read all per-folder READMEs: mcp_server/README.md, handlers/README.md, lib/README.md, database/README.md, tools/README.md, tests/README.md, utils/README.md, plugin_bridges/README.md, core/README.md, stress_test/code-graph/README.md
3. Read catalog index files: feature_catalog/feature_catalog.md, manual_testing_playbook/manual_testing_playbook.md
4. Cross-referenced version numbers, tool counts, database paths, and launcher references across documents
5. Identified inconsistencies, outdated references, and weak prose

## Findings

### Known INSTALL_GUIDE Drifts (Pre-identified)

**INSTALL_GUIDE.md:49** - Version drift: "Skill version | `1.0.0.0`" should be `1.0.3.1` to match SKILL.md and README.md

**INSTALL_GUIDE.md:56** - Tool count drift: "MCP tools | 10" should be 11 to match current tool surface

**INSTALL_GUIDE.md:195** - Tool count drift: "Active MCP tools | 10" should be 11

### Additional Bugs and Drift Found

**ARCHITECTURE.md:29** - Date drift: "Created 2026-05-14 (014 extraction); architecture doc 2026-05-14 (014/014); reconstructed 2026-05-14 (014/019)" - All three dates are identical (2026-05-14), which appears incorrect. The reconstruction date (014/019) should likely differ from the creation date (014/014).

**ARCHITECTURE.md:72** - Database path drift: "Database file: `mcp_server/database/code-graph.sqlite` by default" - This is the legacy default location. INSTALL_GUIDE.md:43 correctly states the new default is `.opencode/.spec-kit/code-graph/database/code-graph.sqlite` after migration. This is a cross-document drift.

**ARCHITECTURE.md:72** - Launcher reference bug: "must stay inside workspace per standalone-storage guard in `mk-spec-memory-launcher.cjs`" - References wrong launcher. Should be `mk-code-index-launcher.cjs` per INSTALL_GUIDE.md:53 and README.md:50.

**plugin_bridges/README.md:37** - Import path drift: "It imports from `../dist/handlers/session-resume.js`, `../dist/lib/search/vector-index.js` and `../dist/lib/session/session-manager.js`" - These import paths reference modules that no longer exist in the code-graph package post-extraction. The session-resume functionality lives in system-spec-kit, not system-code-graph. This is post-extraction drift.

**plugin_bridges/README.md:85-90** - Flow diagram drift: The flow diagram references `vector-index.js` for runtime initialization and `session-manager.js` for loading session state. These modules are not in the code-graph package. The actual runtime initialization goes through the MCP server entrypoint, not a vector-index module.

### Weak Prose Issues

**SKILL.md:56** - Weak reference notation: "Classify natural-language queries into structural/semantic/hybrid intent | `mcp__mk_code_index__code_graph_classify_query_intent` | n/a (no dedicated reference)" - The "n/a (no dedicated reference)" is weak prose. Could reference the implementation location (mcp_server/handlers/classify-query-intent.ts and mcp_server/lib/query-intent-classifier.ts) for operators who want to understand the classifier behavior.

**SKILL.md:90** - Unclear boundary explanation: "Deep-loop coverage graph tools still live in `system-spec-kit` because those workflows own the research and review loop state." - This is accurate but could be clearer about WHY this separation exists (research/review state ownership vs structural indexing ownership).

**ARCHITECTURE.md:38** - Redundant phrasing: "It does NOT do semantic search (that's CocoIndex's job) or persistent continuity (that's mk-spec-memory)." - The parenthetical explanations are conversational and could be tightened for a more professional tone.

### Cross-Document Inconsistencies

**Tool count consistency**: Most docs correctly state 11 tools (README.md:52, ARCHITECTURE.md:51, SKILL.md recent_action), but INSTALL_GUIDE has drift at lines 56 and 195.

**Version consistency**: SKILL.md:5 and README.md:48 correctly state version 1.0.3.1, but INSTALL_GUIDE:49 drifts to 1.0.0.0.

**Database path consistency**: INSTALL_GUIDE correctly states the new default (.opencode/.spec-kit/code-graph/database/), but ARCHITECTURE.md:72 still references the old default (mcp_server/database/).

**Launcher reference consistency**: Most docs correctly reference mk-code-index-launcher.cjs, but ARCHITECTURE.md:72 incorrectly references mk-spec-memory-launcher.cjs.

## Questions Answered

Q1 partially answered: Identified 6 additional bugs/drift beyond the 3 known INSTALL_GUIDE issues, plus 4 weak prose items and cross-document inconsistency patterns. Full per-file audit would require checking all feature_catalog and manual_testing_playbook per-feature files (deferred to future iteration given scope).

## Questions Remaining

- Q2: What sk-doc `--type` does each authored doc match, and what mandatory anchors / H2 cases / TOC requirements does each per-type contract impose?
- Q3: What HVR violations (em dashes, banned words, banned phrases, semicolons, Oxford commas) does each authored doc currently contain?
- Q4: What problem hook and section arc do the Public root README and system-spec-kit README use that the system-code-graph README should mimic structurally?
- Q5: What "useful" content gaps exist in SKILL.md / references / per-folder mcp_server READMEs?
- Q6: Which per-folder mcp_server READMEs require fresh authoring vs validation-only passes?
- Q7: Does the feature_catalog index + per-feature files validate as `--type playbook`?
- Q8: Does the manual_testing_playbook index + per-scenario files validate as `--type playbook`?
- Q9: What's the optimal child-001 task ordering?
- Q10: For child-002 (README marketing rewrite), what are the 3 worst-case HVR pitfalls to avoid?

## Next Focus

Q2: Determine sk-doc `--type` for each authored doc and validate mandatory anchors / H2 cases / TOC requirements per type contract. This will establish the baseline for Q3 (HVR violations) and inform Q5 (content gaps).
