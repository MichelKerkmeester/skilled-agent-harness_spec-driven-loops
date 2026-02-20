# Research: Skill Graphs Integration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: research | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. Metadata
| Attribute | Details |
|-----------|---------|
| **Topic** | Skill Graphs and OpenCode Integration |
| **Date** | 2026-02-20 |
| **Status** | Complete |
| **Primary Authors** | OpenCode AI |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:investigation_report -->
## 2. Investigation Report
The research investigated the concept of "Skill Graphs" and how to utilize it for our OpenCode skill system. We analyzed the current structure of OpenCode skills (monolithic `SKILL.md` files) and compared it with the proposed "arscontexta" approach (interconnected markdown files, wikilinks, MOCs, YAML frontmatter, progressive disclosure).
<!-- /ANCHOR:investigation_report -->

---

<!-- ANCHOR:executive_overview -->
## 3. Executive Overview
Skill graphs are networks of skill files connected with wikilinks. Instead of one big file containing all capabilities and context (like our current `SKILL.md`), the system consists of many small, composable pieces. Each file captures one complete thought, technique, or skill. Agents traverse this graph using progressive disclosure: reading an index, scanning descriptions, following relevant links, and selectively reading full content. This approach enables highly scalable, deep domain expertise (e.g., 250+ connected files for a single domain) without exhausting token limits.
<!-- /ANCHOR:executive_overview -->

---

<!-- ANCHOR:core_architecture -->
## 4. Core Architecture
The architecture comprises five primitives:
1. **Nodes**: Standalone markdown files, each acting as a methodology claim or specific skill.
2. **Wikilinks**: Semantic links (`[[node-name]]`) woven into prose, providing context for *why* an agent should follow them.
3. **YAML Frontmatter**: Each node contains a `description` field in its frontmatter, allowing agents to scan purpose without reading the whole file.
4. **MOCs (Maps of Content)**: Intermediate index files that organize clusters of related skills.
5. **Index File**: The root entry point that points attention and describes the overall landscape.
<!-- /ANCHOR:core_architecture -->

---

<!-- ANCHOR:technical_specifications -->
## 5. Technical Specifications
- **File Format**: Markdown (`.md`).
- **Metadata Format**: YAML frontmatter (`--- \n description: "..." \n ---`).
- **Linking Syntax**: Standard wikilinks (`[[target-file]]` or `[[target-file|display text]]`).
- **Traversal Mechanism**: Agent uses `Read` (file contents) or `Glob` (directory listing) tools to follow links based on contextual relevance.
- **Entry Point Location**: Typically `.opencode/skill/<skill-name>/index.md`.
<!-- /ANCHOR:technical_specifications -->

---

<!-- ANCHOR:constraints_limitations -->
## 6. Constraints & Limitations
- **Latency**: Traversing the graph requires multiple sequential tool calls (e.g., `Read` index -> `Read` MOC -> `Read` skill node). This increases the time to first action.
- **Token Usage Over Time**: While initial prompt size is small, a deep traversal could eventually accumulate significant context if the agent does not summarize or drop older contexts.
- **Authoring Overhead**: Creating and maintaining a graph of 250+ files is complex without tooling.
<!-- /ANCHOR:constraints_limitations -->

---

<!-- ANCHOR:integration_patterns -->
## 7. Integration Patterns
- **Skill Initialization**: The agent is pointed to `index.md` instead of `SKILL.md`.
- **Progressive Disclosure**: The agent reads the index, encounters semantic links like "See [[error-handling]] for retry logic", and uses the `Read` tool to load `error-handling.md` if necessary.
- **Context Injection**: Links provide highly targeted knowledge injection, replacing the current "Smart Routing" python pseudocode in `SKILL.md`.
<!-- /ANCHOR:integration_patterns -->

---

<!-- ANCHOR:implementation_guide -->
## 8. Implementation Guide
1. Identify a large existing skill (e.g., `system-spec-kit`).
2. Extract distinct concepts into separate markdown files in an `assets/` or `nodes/` directory.
3. Add YAML frontmatter with a `description` to each file.
4. Replace the monolithic `SKILL.md` with an `index.md` containing Maps of Content (MOCs).
5. Use prose to embed wikilinks to the extracted nodes.
6. Instruct the agent to "Follow wikilinks relevant to the current task to build context."
<!-- /ANCHOR:implementation_guide -->

---

<!-- ANCHOR:code_examples -->
## 9. Code Examples
**Example Index (`index.md`)**:
```markdown
# OpenCode System Knowledge

Agents need structured knowledge. 

## Synthesis
- [[progressive-disclosure]] — how descriptions and search enable finding content
- [[agent-cognition]] — how agents think through external structures

## Topic MOCs
- [[memory-system]] — hybrid search, BM25, and RRF fusion
- [[validation-workflow]] — how validate.sh enforces completeness
```

**Example Node (`progressive-disclosure.md`)**:
```markdown
---
description: "How agents use index files and YAML frontmatter to avoid token exhaustion"
---
# Progressive Disclosure

Most decisions happen before reading a single full file. By reading descriptions in YAML frontmatter, the agent can decide whether to follow [[agent-cognition|cognitive paths]] or skip what doesn't matter.
```
<!-- /ANCHOR:code_examples -->

---

<!-- ANCHOR:testing_debugging -->
## 10. Testing & Debugging
- **Link Validation**: Need a script (e.g., `check-links.sh`) to ensure all wikilinks resolve to existing files.
- **Traversal Simulation**: Run a test agent prompt to verify it naturally follows the intended paths without getting stuck.
<!-- /ANCHOR:testing_debugging -->

---

<!-- ANCHOR:performance -->
## 11. Performance
- **Token Efficiency**: Massive improvement. An agent only loads the nodes it needs, reducing a 2000+ line `SKILL.md` to a 50-line index and 2-3 specific 30-line nodes.
- **Speed**: Slightly slower initial thought process due to tool call round-trips for reading links, but faster inference generation due to smaller context windows.
<!-- /ANCHOR:performance -->

---

<!-- ANCHOR:security -->
## 12. Security
- Skill graphs do not inherently introduce security risks. Standard file read permissions apply. Ensure no sensitive credentials are hardcoded in the skill graph nodes.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:maintenance -->
## 13. Maintenance
- **Graph Pruning**: Obsolete nodes can be archived without breaking the whole skill, provided wikilinks are updated.
- **Tooling**: Recommend porting or adopting the `arscontexta` plugin logic for scaffolding and managing these markdown graphs.
<!-- /ANCHOR:maintenance -->

---

<!-- ANCHOR:api_reference -->
## 14. API Reference
[CITATION: NONE] - Skill graphs use standard markdown and local file system reads; no external API is required.
<!-- /ANCHOR:api_reference -->

---

<!-- ANCHOR:troubleshooting -->
## 15. Troubleshooting
- **Agent ignores links**: Ensure the prompt explicitly instructs the agent that `[[link]]` syntax means a local file exists and should be read via the `Read` tool.
- **File not found**: Ensure the agent resolves the wikilink to the correct relative path (e.g., adding `.md` and resolving from the index's directory).
<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:acknowledgements -->
## 16. Acknowledgements
Based on the `arscontexta` Claude Code plugin concepts, Zettelkasten methodologies, and "Tools for Thought" principles.
<!-- /ANCHOR:acknowledgements -->

---

<!-- ANCHOR:appendix_changelog -->
## 17. Appendix & Changelog
- **2026-02-20**: Initial research document created.
<!-- /ANCHOR:appendix_changelog -->
