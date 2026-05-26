# Iteration 005 - README Structural Arc Analysis

## Focus
Q4: What problem hook and section arc do the Public root README and system-spec-kit README use that the system-code-graph README should mimic structurally while staying HVR-clean?

## Actions Taken
1. Read Public root README (`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/README.md`) to extract structural patterns
2. Read system-spec-kit README (`.opencode/skills/system-spec-kit/README.md`) for comparison
3. Read system-code-graph README (`.opencode/skills/system-code-graph/README.md`) to assess current state
4. Analyzed structural arc patterns across all three documents
5. Identified gaps and improvement opportunities for system-code-graph README

## Findings

### Public Root README Structural Pattern

**Opening Hook Table** (lines 3-10):
- Uses a core layer table establishing what the framework adds
- Columns: "Core layer" and "What it adds"
- Rows: Spec Kit Framework, Cognitive Memory, Hybrid RAG + Smart Graph, Code Index + Graph, 11 Specialized Agents, 20 On-Demand Skills

**Reasons to Try It** (lines 12-22):
- Badges section with GitHub stars, license, latest release
- Bullet points: runtime compatibility, external CLI support, modularity
- Personal note (coffee link)

**Problem Statement** (lines 53-55):
> "AI coding assistants have amnesia. Every session starts from zero. You explain your architecture Monday. By Wednesday, it is gone. Decisions, trade-offs, the carefully reasoned choices behind them, all lost the moment the conversation window closes. This framework fixes that."

**Solution Breakdown** (lines 57-63):
- Four-layer framework explained as numbered list
- Each layer has descriptive name and one-sentence function
- Establishes the "how" after establishing the "why"

### System-Spec-Kit README Structural Pattern

**Tagline** (line 17):
> "Documentation and memory for AI-assisted development. Every file change gets a spec folder. Every session gets persistent context."

**Problem Statement** (lines 50-54):
- Two-paragraph structure: "First, AI conversations that modify files leave no paper trail..." and "Second, AI assistants have amnesia..."
- Establishes two distinct problems the skill solves

**Solution Synthesis** (line 56):
> "Together, these two halves form a documentation-and-memory loop: spec folders capture what happened, the indexed-continuity store makes it searchable and the next session benefits from everything that came before."

**Key Statistics Table** (lines 62-74):
- Comprehensive metrics: MCP Tools, Commands, Documentation Levels, Feature Catalog Entries, Search Channels, Pipeline Stages, Importance Tiers, Memory States, Template Architecture, Script Modules, Requirements

**Comparison Table** (lines 78-86):
- Three-column comparison: Manual Documentation, Basic RAG, System Spec Kit
- Rows: Documentation, Search, Context across sessions, Quality control, "Why" queries, Forgetting curve, Access control

### System-Code-Graph README Current State

**Tagline** (line 14):
> "Structural code indexing, SQLite-backed graph storage and MCP-facing code intelligence for impact analysis, neighborhood retrieval, readiness checks and change detection."

**Purpose Section** (lines 38-42):
- Functional description: "`system-code-graph` is the standalone skill package for structural code intelligence..."
- Technical focus: scans source files, SQLite graph, MCP tools
- Lacks compelling problem-solution narrative

**Key Statistics Table** (lines 44-55):
- Technical metrics: Skill version, Runtime package, MCP server name, Client namespace, Active MCP tools, Storage, Database path override, Primary docs
- Missing operator-facing metrics like comparison counts, success rates, or adoption signals

**Comparison Table** (lines 59-65):
- Two-column format: "Use This Skill" vs "Use Another Surface"
- Focuses on technical routing rather than value proposition
- Could be expanded with more alternatives like Public root README does

### Structural Gaps Identified

1. **Missing Opening Hook**: No equivalent to Public root's core layer table (lines 3-10) or "reasons to try it" section (lines 12-22)

2. **Weak Problem Statement**: Purpose section (lines 38-42) is functional but lacks the compelling narrative arc found in:
   - Public root: "AI coding assistants have amnesia" (lines 53-55)
   - System-spec-kit: Two-problem structure (lines 50-54)

3. **No Solution Synthesis**: Missing a unified "together these form X" statement like system-spec-kit (line 56)

4. **Limited Comparison Scope**: Comparison table (lines 59-65) focuses on technical routing rather than comprehensive alternatives analysis

5. **Missing Operator Metrics**: Key statistics table (lines 44-55) is purely technical; could include metrics like:
   - Number of supported languages
   - Graph query success rates
   - Typical scan times
   - Index size benchmarks

### Recommended Structural Arc for System-Code-Graph README

**Paragraph 1 - Problem Hook**:
- Establish the pain: "Structural code understanding is trapped in IDEs and grep. When you need to know what depends on a file before changing it, or which symbols a diff touches, you're stuck with manual trace-throughs that miss cross-file relationships."

**Paragraph 2 - Solution Statement**:
- Present the approach: "System-code-graph extracts structure into a local SQLite graph, answers relationship queries, and blocks reads when the index is stale—so you get trustworthy impact analysis without treating code as plain text."

**Paragraph 3 - Integration Synthesis**:
- Connect to ecosystem: "Together with spec folders for documentation and memory for session continuity, this forms the structural intelligence layer of the framework—bridging semantic search (CocoIndex) with precise relationship queries."

## Questions Answered
- **Q4**: What problem hook and section arc do the Public root README and system-spec-kit README use that the system-code-graph README should mimic structurally while staying HVR-clean? (Answered in Findings section above)

## Questions Remaining
- Q1: What specific bugs, drift, or weak prose exist in each authored doc under `.opencode/skills/system-code-graph/` beyond the 3 known INSTALL_GUIDE drifts?
- Q2: What sk-doc `--type` does each authored doc match, and what mandatory anchors / H2 cases / TOC requirements does each per-type contract impose?
- Q3: What HVR violations (em dashes, banned words, banned phrases, semicolons, Oxford commas) does each authored doc currently contain?
- Q5: What "useful" content gaps exist in SKILL.md / references / per-folder mcp_server READMEs that operators reading the skill cold would benefit from?
- Q6: Which per-folder mcp_server READMEs require fresh authoring vs validation-only passes?
- Q7: Does the feature_catalog index + per-feature files validate as `--type playbook`?
- Q8: Does the manual_testing_playbook index + per-scenario files validate as `--type playbook`?
- Q9: What's the optimal child-001 task ordering?
- Q10: For child-002 (README marketing rewrite), what are the 3 worst-case HVR pitfalls the root README + system-spec-kit README contain that the system-code-graph README must avoid mimicking?

## Next Focus
Q10: For child-002 (README marketing rewrite), what are the 3 worst-case HVR pitfalls the root README + system-spec-kit README contain that the system-code-graph README must avoid mimicking?
