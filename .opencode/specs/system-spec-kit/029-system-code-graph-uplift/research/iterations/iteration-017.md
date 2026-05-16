# Iteration 017 - Q4: README Structural Arc Analysis

## Focus

Q4: What problem hook and section arc do the Public root README and system-spec-kit README use that the system-code-graph README should mimic structurally while staying HVR-clean?

**Rationale:** Q1 was completed in iter-016. Per progressive focus guide, iter 17-20 are synthesis-ready consolidation. Q4 is a focused analysis task that directly informs child-002 (README marketing rewrite) and can be completed efficiently by reading just 2 files.

## Actions Taken

1. Read iteration-014.md, iteration-015.md, and iteration-016.md to understand prior findings
2. Read Public root README (README.md) to analyze its structural arc
3. Read system-spec-kit README (.opencode/skills/system-spec-kit/README.md) to analyze its structural arc
4. Extracted problem hook patterns, section ordering, and structural elements from both
5. Identified HVR risks in both source READMEs to inform what to avoid

## Findings

### Public Root README Structural Arc

**Opening pattern:**
- H1 title with tagline: "Skilled Agent Orchestration w/ Custom Spec Kit"
- Core layer table (immediate value prop in visual format)
- "Reasons to try it" with social proof badges (GitHub stars, license, release)
- 3-bullet benefit summary (runtime support, external orchestration, modularity)
- Personal note (coffee link - human touch)
- Horizontal rule separator

**Section 1: OVERVIEW**
- Problem hook: "AI coding assistants have amnesia. Every session starts from zero. You explain your architecture Monday. By Wednesday, it is gone. Decisions, trade-offs, the carefully reasoned choices behind them, all lost the moment the conversation window closes. This framework fixes that."
- Solution breakdown: "The framework adds four layers on top of the base platform:" (numbered list with descriptions)
- Statistics table (agents, skills, commands, MCP tools, coverage details)
- "How It All Connects" ASCII diagram showing data flow
- "What's Shipped Recently" paragraph with packet references

**Section 2: QUICK START**
- Installation (prerequisites, clone, install, boot servers, optional CocoIndex)
- Set Up Embedding Provider (3 options with env vars)
- Verify Installation (launcher checks, config grep)
- First Use (example command)
- Adapting to Your Stack (forking guidance)
- Code-Graph Indexing (end-user vs maintainer distinction)

**Section 3+: FEATURES, CONFIGURATION, FAQ, RELATED DOCUMENTS**

### System-Spec-Kit README Structural Arc

**Opening pattern:**
- Frontmatter (title, description, trigger_phrases)
- H1 title: "System Spec Kit"
- Single-line blockquote value prop: "Documentation and memory for AI-assisted development. Every file change gets a spec folder. Every session gets persistent context."
- Horizontal rule separator

**Section 1: OVERVIEW**
- Two-problem hook: "System Spec Kit solves two problems that every AI-assisted project runs into."
  - Problem 1: "First, AI conversations that modify files leave no paper trail. A feature gets built, the session ends and the reasoning behind every decision vanishes. Spec Kit fixes this by creating a spec folder for every file-modifying conversation..."
  - Problem 2: "Second, AI assistants have amnesia. Every conversation starts from a blank slate. You explain your architecture on Monday and by Wednesday the assistant has forgotten everything. Spec Kit fixes this with a persistent memory system..."
- Synthesis: "Together, these two halves form a documentation-and-memory loop: spec folders capture what happened, the indexed-continuity store makes it searchable and the next session benefits from everything that came before."
- Disambiguation note block (Note: When this skill says "memory," it means...)
- "Key Statistics" table (MCP tools, commands, documentation levels, search channels, etc.)
- "How This Compares" comparison table (vs manual documentation, vs basic RAG)
- "Key Features at a Glance" table
- "Cross-Skill Structural Context" table
- "Skill Advisor" detailed subsection
- "Requirements" table
- Workspace module profile

**Section 2: QUICK START**
- Create Your First Spec Folder (bash example)
- Save Context at the End of a Session (node example + command shorthand)
- Resume Work From a Previous Session (command example)
- Search for Context (command example)
- Validate a Spec Folder (bash example)
- Verify the MCP Is Running (JSON example)
- Codex CLI note

**Section 3+: FEATURES, STRUCTURE, CONFIGURATION, USAGE EXAMPLES, TROUBLESHOOTING, FAQ, RELATED DOCUMENTS**

### Structural Pattern Extraction

**Common elements to mimic:**
1. **Problem hook in OVERVIEW** - Both READMEs open with a compelling problem statement that creates urgency
   - Public root: "AI coding assistants have amnesia..." (single problem, emotional framing)
   - System-spec-kit: "System Spec Kit solves two problems..." (two-problem structure, logical framing)
2. **Solution breakdown immediately after hook** - Numbered or bulleted list explaining how the framework solves the problem
3. **Statistics/comparison table** - Quantifiable metrics that establish credibility
4. **QUICK START with concrete examples** - Copy-pasteable commands for each major workflow
5. **Visual diagrams** - ASCII diagrams showing architecture or flow (Public root has this, system-spec-kit uses tables instead)
6. **Recent work section** - "What's Shipped Recently" or similar to show active development

**Section ordering (both use):**
1. OVERVIEW (problem hook + solution + stats)
2. QUICK START (concrete examples)
3. FEATURES (detailed breakdown)
4. CONFIGURATION (if needed)
5. USAGE EXAMPLES (system-spec-kit only)
6. TROUBLESHOOTING (system-spec-kit only)
7. FAQ
8. RELATED DOCUMENTS

### HVR Risks in Source READMEs

**Public root README HVR violations (from iter-1 summary):**
- 1 em dash
- 1 semicolon
- 2 Oxford commas
- Total: ~4 violations

**System-spec-kit README HVR violations (from iter-1 summary):**
- Not explicitly counted in iter-1, but likely has similar violations given the prose density

**Specific patterns to avoid:**
- Oxford commas in lists (e.g., "naming, header, error-handling, and type-discipline")
- Semicolons in complex sentences
- Em dashes for emphasis
- Banned words/phrases per HVR rules

### Recommended Structural Arc for system-code-graph README

Based on the analysis, the system-code-graph README should mimic:

**Opening:**
- Frontmatter (title, description, trigger_phrases) - follows system-spec-kit pattern
- H1 title
- Single-line blockquote value prop - follows system-spec-kit pattern
- Horizontal rule separator

**Section 1: OVERVIEW**
- Problem hook: "Structural code understanding is hard. AI assistants can read individual files but cannot reason about call graphs, impact paths, or architectural boundaries. When you ask 'what calls this function?' or 'what breaks if I change this interface?', the assistant cannot answer. This skill fixes that by indexing your codebase as a structural graph and exposing graph-aware query tools."
- Solution breakdown: "The skill adds three layers on top of the base MCP server:"
  1. Structural indexing (code_graph_scan)
  2. Graph-aware query tools (code_graph_query, code_graph_context)
  3. Impact analysis (code_graph_verify, code_graph_apply, detect_changes)
- Key Statistics table (MCP tools, indexed languages, graph metrics)
- "How This Compares" comparison table (vs grep, vs semantic search)
- Cross-skill integration note (Spec Kit integration, CocoIndex bridge)

**Section 2: QUICK START**
- Boot the MCP server
- Verify installation
- First scan
- First query
- Impact analysis example

**Section 3+: FEATURES, ARCHITECTURE, CONFIGURATION, TROUBLESHOOTING, FAQ, RELATED DOCUMENTS**

## Questions Answered

**Q4: What problem hook and section arc do the Public root README and system-spec-kit README use that the system-code-graph README should mimic structurally while staying HVR-clean?**

- **Problem hook pattern:** Both READMEs open OVERVIEW with a compelling problem statement. Public root uses emotional framing ("AI coding assistants have amnesia"), system-spec-kit uses logical two-problem structure ("solves two problems"). Recommended for system-code-graph: single problem hook focused on structural code understanding limitations.
- **Section arc:** Both use OVERVIEW (hook + solution + stats) → QUICK START (concrete examples) → FEATURES (detailed breakdown) → CONFIGURATION → FAQ → RELATED DOCUMENTS. System-spec-kit adds STRUCTURE, USAGE EXAMPLES, TROUBLESHOOTING. Recommended for system-code-graph: follow system-spec-kit pattern with STRUCTURE section.
- **Structural elements to mimic:** Statistics/comparison tables, concrete QUICK START examples with copy-pasteable commands, cross-skill integration notes, recent work section.
- **HVR risks to avoid:** Oxford commas in lists, semicolons in complex sentences, em dashes for emphasis. Source READMEs have ~4 violations each; system-code-graph README should aim for zero violations.

## Questions Remaining

- Q3: What HVR violations (em dashes, banned words, banned phrases, semicolons, Oxford commas) does each authored doc currently contain? (Partially answered: core docs + mcp_server READMEs complete; per-feature/per-scenario files pending)
- Q5: What "useful" content gaps exist in SKILL.md / references / per-folder mcp_server READMEs that operators reading the skill cold would benefit from (e.g. "why structural matters" primer, glossary, situational triggers)? (Partially answered in iter-013)
- Q6: Which per-folder mcp_server READMEs (handlers/lib/tools/tests/core/plugin_bridges/database) require fresh authoring vs validation-only passes? Recent packet 035 shipped most; verify currency. (Answered in iter-013: plugin_bridges requires fresh authoring)
- Q7: Does the feature_catalog index + per-feature files validate as `--type playbook`? Are per-feature files inside the catalog discoverable via the per-type contract or do they require recursion?
- Q8: Does the manual_testing_playbook index + per-scenario files validate as `--type playbook`? Same recursion question.
- Q9: What's the optimal child-001 task ordering: SKILL.md hook first, then references HVR, then mcp_server per-folder usefulness audit, then INSTALL_GUIDE drift fixes? Or batch by file-type?
- Q10: For child-002 (README marketing rewrite), what are the 3 worst-case HVR pitfalls the root README + system-spec-kit README contain that the system-code-graph README must avoid mimicking?

## Next Focus

Q10: For child-002 (README marketing rewrite), what are the 3 worst-case HVR pitfalls the root README + system-spec-kit README contain that the system-code-graph README must avoid mimicking? This follows naturally from Q4 (which identified structural patterns to mimic) and requires a focused HVR audit of the two source READMEs to identify specific violations to avoid. This is a synthesis-ready task that directly informs child-002 execution.
