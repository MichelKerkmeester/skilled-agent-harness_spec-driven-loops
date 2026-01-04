# Changelog

All notable changes to the **agent** folder are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

Public Release: https://github.com/MichelKerkmeester/opencode-dev-environment

---

## orchestrate.md

### [**1.0.2.4**] - 2026-01-01

Infrastructure improvements release.

#### Added
- Section 4.5: Command Suggestions with auto-suggestion triggers
- Section 7.5: Failure Handling Workflow (Retry → Reassign → Escalate)
- Section 7.7: Synthesis Protocol for unified voice output
- Debug delegation trigger after 3 failed attempts
- Timeout handling guidelines

#### Changed
- Enhanced capability scan with complete skill reference table
- Added tool access patterns (Native MCP, Code Mode MCP, CLI)
- Expanded context preservation with health monitoring signals

---

### [**1.0.1.7**] - 2025-12-30

Agent command and documentation improvements.

#### Added
- Section 3.5: Available Agents with subagent types table
- Agent selection matrix for task routing
- Project-specific agent references

#### Changed
- Restructured capability scan with Core Tools table
- Added `/spec_kit:debug` suggestion for stuck sub-agents

---

### [**1.0.1.0**] - 2025-12-29

Initial release during Narsil migration.

#### Added
- Core workflow (9-step process)
- Capability scan with skill reference
- Agent capability map (@general, @research, @documentation-writer)
- Mandatory process enforcement (Research-First, Spec Folder, Context Preservation)
- Task decomposition format
- Parallel vs sequential analysis
- Routing logic priority order

---

## write.md

### [**1.0.2.8**] - 2026-01-02

Skill asset folder reorganization.

#### Changed
- Updated template paths from `assets/components/` to `assets/opencode/`
- Updated template paths from `assets/documents/` to `assets/documentation/`
- All template location references updated throughout

---

### [**1.0.2.4**] - 2026-01-01

Infrastructure improvements release.

#### Added
- Section 2: Template Mapping with complete lookup table
- Template Alignment Checklist (structure, H2 headers, frontmatter, content)
- Standard Section Emoji Mapping reference
- Section 5: Document Routing with decision tree
- Section 8: Output Format for document improvements
- Section 9: Anti-Patterns (template violations, process violations)

#### Changed
- Restructured as template-first workflow (10-step process)
- Added CRITICAL rules for template compliance
- Enhanced capability scan with scripts table

---

### [**1.0.1.7**] - 2025-12-30

Initial release with `/create:agent` command.

#### Added
- Core workflow for template-first document creation
- Capability scan with workflows-documentation skill
- Documentation modes (Quality, Component Creation, Flowcharts, Install Guides)
- DQI scoring system (Structure 40, Content 30, Style 30)
- Workflow patterns for document improvement and skill creation
- Related resources section with template references
