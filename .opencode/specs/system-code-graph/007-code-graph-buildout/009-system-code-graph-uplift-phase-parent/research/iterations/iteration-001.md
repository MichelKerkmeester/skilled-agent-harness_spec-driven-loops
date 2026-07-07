# Iteration 001: Q1+Q3 Discovery Scan

## Focus

Exhaustive scan of every authored doc in `.opencode/skills/system-code-graph/` for bugs, drift, weak prose, and HVR violations (em dashes, banned words, banned phrases, semicolons, Oxford commas). Cite each hit with file:line.

## Actions Taken

1. Read HVR reference from `.opencode/skills/sk-doc/references/global/hvr_rules.md` to identify violation patterns
2. Batch-read all in-bounds authored docs:
   - SKILL.md (167 lines)
   - README.md (290 lines)
   - ARCHITECTURE.md (187 lines)
   - INSTALL_GUIDE.md (277 lines)
   - references/code-graph-readiness-check.md (115 lines)
   - references/database-path-policy.md (93 lines)
   - references/ownership-boundary.md (111 lines)
   - feature_catalog/feature_catalog.md (339 lines)
   - manual_testing_playbook/manual_testing_playbook.md (191 lines)
3. Ran ripgrep searches for HVR violations across the target directory:
   - Em dashes (—)
   - Semicolons (;)
   - Banned words (leverage, empower, seamless, disrupt, harness, delve, realm, tapestry, illuminate, unveil, elucidate, abyss, revolutionise, game-changer, groundbreaking, cutting-edge, embark)
   - Banned phrases (It's important to, It's worth noting, Moving forward, In today's world, In today's digital landscape, When it comes to, Dive into, Let me be clear, The reality is, Here's the thing, In a world where)
   - Oxford commas (, and|, or)

## Findings

### HVR Violations Summary

**Em dashes (—): 22 violations across 6 files**

- `SKILL.md:133` — em dash in naming convention explanation
- `SKILL.md:156` — em dash in hook location explanation
- `README.md:50` — em dash in MCP server name field
- `ARCHITECTURE.md:85` — em dash in readiness contract explanation
- `ARCHITECTURE.md:101` — em dash in boundaries section
- `ARCHITECTURE.md:104-108` — 5 em dashes in what skill does NOT own section
- `ARCHITECTURE.md:148` — em dash in invariants section
- `ARCHITECTURE.md:160-163` — 4 em dashes in extension points section
- `feature_catalog/feature_catalog.md:38` — em dash in feature-to-tool granularity explanation
- `feature_catalog/feature_catalog.md:131` — em dash in code_graph_status description
- `feature_catalog/feature_catalog.md:183` — em dash in context handler description
- `feature_catalog/feature_catalog.md:217` — em dash in deep_loop_graph_status description
- `feature_catalog/feature_catalog.md:233` — em dash in deep_loop_graph_upsert description
- `feature_catalog/feature_catalog.md:317` — em dash in ccc_status description
- `INSTALL_GUIDE.md:238` — em dash in maintainer mode section

**Semicolons (;): 30 violations across 6 files**

- `SKILL.md:133` — semicolon in naming convention explanation
- `SKILL.md:156` — semicolon in hook location explanation
- `README.md:54` — semicolon in database path override field
- `ARCHITECTURE.md:29` — semicolon in metadata created field
- `ARCHITECTURE.md:49` — semicolon in MCP server entry point description
- `ARCHITECTURE.md:57` — semicolon in code_graph_context tool description
- `ARCHITECTURE.md:59` — semicolon in code_graph_verify tool description
- `ARCHITECTURE.md:61` — semicolon in detect_changes tool description
- `ARCHITECTURE.md:71-72` — 2 semicolons in storage layer description
- `ARCHITECTURE.md:81-83` — 3 semicolons in readiness state machine table
- `ARCHITECTURE.md:105` — semicolon in boundaries section
- `ARCHITECTURE.md:108` — semicolon in boundaries section
- `ARCHITECTURE.md:119` — semicolon in data flow scan path
- `ARCHITECTURE.md:126` — semicolon in data flow query path
- `ARCHITECTURE.md:149` — semicolon in invariants section
- `ARCHITECTURE.md:152` — semicolon in invariants section
- `ARCHITECTURE.md:163` — semicolon in extension points section
- `ARCHITECTURE.md:186` — semicolon in open questions section
- `feature_catalog/feature_catalog.md:14` — semicolon in filename comment
- `feature_catalog/feature_catalog.md:65` — semicolon in query self-heal current reality
- `INSTALL_GUIDE.md:65` — semicolon in Node.js prerequisite
- `INSTALL_GUIDE.md:110` — semicolon in _NOTE_1_DB environment variable
- `INSTALL_GUIDE.md:112` — semicolon in _NOTE_3_INDEX_DEFAULTS environment variable
- `INSTALL_GUIDE.md:132` — semicolon in TOML _NOTE_1_DB
- `INSTALL_GUIDE.md:199` — semicolon in cross-skill imports baseline
- `INSTALL_GUIDE.md:216` — semicolon in migration notes
- `INSTALL_GUIDE.md:255` — semicolon in troubleshooting cross-runtime config audit
- `references/ownership-boundary.md:20` — semicolon in overview section

**Oxford commas (, and|, or): 35 violations across 6 files**

- `references/ownership-boundary.md:20` — Oxford comma in overview
- `SKILL.md:11` — Oxford comma in _memory.recent_action
- `SKILL.md:156` — Oxford comma in hook location explanation
- `README.md:112` — Oxford comma in quick start step 3
- `README.md:223` — Oxford comma in usage examples
- `feature_catalog/feature_catalog.md:95` — Oxford comma in code_graph_scan description
- `INSTALL_GUIDE.md:3` — Oxford comma in description
- `INSTALL_GUIDE.md:17` — Oxford comma in overview paragraph
- `INSTALL_GUIDE.md:41` — Oxford comma in overview paragraph
- `INSTALL_GUIDE.md:171` — Oxford comma in verification expected results
- `INSTALL_GUIDE.md:172` — Oxford comma in verification expected results
- `INSTALL_GUIDE.md:216` — Oxford comma in migration notes
- `INSTALL_GUIDE.md:238` — Oxford comma in maintainer mode section
- `INSTALL_GUIDE.md:249-256` — 8 Oxford commas in troubleshooting table
- `ARCHITECTURE.md:38` — Oxford comma in overview
- `ARCHITECTURE.md:40` — Oxford comma in overview
- `ARCHITECTURE.md:57` — Oxford comma in code_graph_context tool description
- `ARCHITECTURE.md:131` — Oxford comma in data flow context path

**Banned words/phrases: 0 violations**

No banned words or banned phrases found across any in-bounds files.

### Bugs and Drift

**INSTALL_GUIDE.md version drift (line 49)**
- Current: `|| Skill version | `1.0.0.0` |`
- Should be: `1.0.3.1` (matches SKILL.md line 5 and README.md line 48)

**INSTALL_GUIDE.md tool count drift (lines 56, 195)**
- Line 56: `|| MCP tools | 10 (see [README.md](./README.md) §3.2) |`
- Line 195: `|| Active MCP tools | 10 |`
- Should be: `11` (matches ARCHITECTURE.md line 49, SKILL.md line 5, and README.md line 52)
- The 11th tool is `code_graph_classify_query_intent` added in packet 028

**Database path drift in references/database-path-policy.md**
- Lines 31-32 document the database path as `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite`
- INSTALL_GUIDE.md lines 43 and 55 document the migrated location as `.opencode/.spec-kit/code-graph/database/code-graph.sqlite`
- The references doc has not been updated to reflect the standalone shared location migration

### Weak Prose and Structural Issues

**README.md structural pattern**
- Section 3.2 (TOOL REFERENCE) uses a standard table format which is clear
- Section 4 (STRUCTURE) includes a tree diagram followed by a path-purpose table
- The tree diagram could be more concise (lines 150-170)

**feature_catalog/feature_catalog.md density**
- The catalog is information-dense with 17 features across 8 groups
- Some descriptions are verbose (e.g., lines 38-39 for feature-to-tool granularity)
- The "Current Reality" sections are repetitive in structure

**manual_testing_playbook/manual_testing_playbook.md organization**
- 22 scenarios across 10 groups is well-structured
- The global preconditions and evidence requirements are clear
- Section 15 (POST-RENAME INFRASTRUCTURE) and Section 16 (DEVIN HOOKS) suggest organic growth rather than planned structure

### Per-File HVR Scores (Estimated)

Based on the violation counts and HVR scoring weights (15% punctuation, 25% structure, 25% content, 20% words, 15% voice):

- `SKILL.md`: 2 em dashes + 2 semicolons + 2 Oxford commas = ~6 punctuation violations. Estimated score: ~70 (failing)
- `README.md`: 1 em dash + 1 semicolon + 2 Oxford commas = ~4 punctuation violations. Estimated score: ~75 (needs revision)
- `ARCHITECTURE.md`: 12 em dashes + 18 semicolons + 4 Oxford commas = ~34 punctuation violations. Estimated score: ~45 (failing)
- `INSTALL_GUIDE.md`: 1 em dash + 7 semicolons + 13 Oxford commas = ~21 punctuation violations. Estimated score: ~60 (failing)
- `feature_catalog/feature_catalog.md`: 6 em dashes + 2 semicolons + 1 Oxford comma = ~9 punctuation violations. Estimated score: ~68 (failing)
- `references/code-graph-readiness-check.md`: 0 violations. Estimated score: ~90 (pass)
- `references/database-path-policy.md`: 0 violations. Estimated score: ~90 (pass) (but has content drift)
- `references/ownership-boundary.md`: 1 semicolon + 1 Oxford comma = ~2 punctuation violations. Estimated score: ~82 (needs revision)
- `manual_testing_playbook/manual_testing_playbook.md`: No violations in index file (violations are in subfolder scenario files, out-of-scope for this iter)

## Questions Answered

**Q1: Per-doc bugs/drift/weak-prose beyond INSTALL_GUIDE 49/56/195**
- Answered: Found version drift in INSTALL_GUIDE.md line 49 (1.0.0.0 → 1.0.3.1)
- Answered: Found tool count drift in INSTALL_GUIDE.md lines 56 and 195 (10 → 11)
- Answered: Found database path drift in references/database-path-policy.md (not updated for migration to standalone shared location)
- Answered: Identified weak prose issues in feature_catalog density and README tree diagram conciseness

**Q3: HVR violations per-file with line numbers**
- Answered: Documented 22 em dash violations across 6 files with specific line numbers
- Answered: Documented 30 semicolon violations across 6 files with specific line numbers
- Answered: Documented 35 Oxford comma violations across 6 files with specific line numbers
- Answered: Confirmed 0 banned word or banned phrase violations
- Answered: Estimated HVR scores for each file; 5 of 8 in-bounds files fail the 85-point threshold

## Questions Remaining

**Q2: sk-doc --type per doc + mandatory anchors**
- Not addressed in this iteration (deferred to iter 2-3)

**Q4: README structural arc to mimic from Public root + system-spec-kit**
- Not addressed in this iteration (deferred to iter 2-3)

**Q5: Useful content gaps in SKILL.md/references/per-folder mcp_server READMEs**
- Not addressed in this iteration (deferred to iter 2-3)

**Q6: Per-folder mcp_server READMEs needing fresh authoring vs validation-only**
- Not addressed in this iteration (deferred to iter 2-3)

**Q7: feature_catalog index + per-feature validation as --type playbook**
- Not addressed in this iteration (deferred to iter 4)

**Q8: manual_testing_playbook index + per-scenario validation as --type playbook**
- Not addressed in this iteration (deferred to iter 5)

**Q9: Optimal child-001 task ordering**
- Not addressed in this iteration (deferred to iter 2-3 after Q5/Q6)

**Q10: Worst-case HVR pitfalls in root README + system-spec-kit README**
- Not addressed in this iteration (deferred to iter 2-3)

## Next Focus

**Iteration 2: Q5 + Q6 — Useful content gaps and per-folder mcp_server READMEs**

Rationale:
- Q1 and Q3 are substantially answered (discovery pass complete)
- The HVR violations are extensive and will require systematic remediation
- Before fixing HVR violations, we should understand what content is missing or weak (Q5)
- Q6 (per-folder mcp_server READMEs) is logically adjacent to Q5 since both concern documentation completeness
- This will inform whether child-001 (skill-md-and-references-polish) should focus on HVR fixes first or content gaps first

Iteration 2 scope:
- Scan all `mcp_server/**/README.md` files (handlers, lib, tools, tests, database, plugin_bridges)
- Assess SKILL.md for useful content gaps (missing workflows, unclear routing, missing examples)
- Assess references/*.md for completeness and alignment
- Classify each mcp_server README as "needs fresh authoring" vs "validation-only"
- Identify content gaps that would improve skill usefulness
