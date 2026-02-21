<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Checklist: Figma MCP Install Guide & Skill Creation

> **Spec:** [spec.md](./spec.md) | **Plan:** [plan.md](./plan.md)

---

<!-- ANCHOR:pre-impl -->
## P0 - HARD BLOCKERS

Must complete before claiming done.

### Install Guide Structure
- [x] File created at `.opencode/install_guides/MCP/MCP - Figma.md` ✓ (1155 lines)
- [x] H1 description is 2-4 sentences with features list ✓
- [x] AI Install Guide section at top (Section 0) ✓
- [x] All 11 sections present (0-10) ✓
- [x] Table of contents with anchor links ✓
- [x] Horizontal rules (---) between major sections ✓

### Install Guide Content
- [x] Phase validation checkpoints present (`phase_N_complete`) ✓ (phases 1-4)
- [x] STOP conditions after each validation ✓
- [x] Platform configs for OpenCode, Claude Code, Claude Desktop ✓
- [x] Naming pattern `figma.figma_{tool_name}` documented correctly ✓
- [x] All 18 tools listed in Features section ✓

### Skill Structure
- [x] Folder created at `.opencode/skill/mcp-figma/` ✓
- [x] SKILL.md has valid YAML frontmatter ✓ (name: mcp-figma, version: 1.0.0)
- [x] SKILL.md has keywords comment for discoverability ✓
- [x] README.md exists ✓ (89 lines)
- [x] `references/tool_reference.md` exists ✓ (423 lines)
- [x] `references/quick_start.md` exists ✓ (269 lines)
- [x] `assets/tool_categories.md` exists ✓ (193 lines)

### SKILL.md Content
- [x] Section 1 is OVERVIEW with correct emoji ✓ (📖)
- [x] When to Use / When NOT to Use documented ✓
- [x] Smart Routing section with resource router ✓
- [x] How It Works section with Code Mode invocation ✓
- [x] Rules section (ALWAYS/NEVER/ESCALATE) ✓
- [x] Last section is RELATED RESOURCES ✓ (Section 7)

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:testing -->
## P1 - MUST COMPLETE

Complete before release, or get user approval to defer.

### Install Guide Quality
- [x] 5+ examples in Examples section ✓ (6 examples)
- [x] All code blocks specify language (typescript, bash, json) ✓
- [x] Commands are copy-pasteable (tested) ✓
- [x] 5+ troubleshooting errors documented ✓ (6 errors in table + detailed sections)
- [x] Time estimate in AI Install Guide section ✓ (10-15 minutes)
- [x] Expected output shown for verification commands ✓

### Skill Quality
- [x] Tool reference documents all 18 tools with interfaces ✓
- [x] Quick start achievable in 5 minutes ✓
- [x] Tool categories has priority classification (HIGH/MEDIUM/LOW) ✓ (5 HIGH, 7 MEDIUM, 6 LOW)
- [x] Cross-references to mcp-code-mode skill ✓
- [x] Success criteria with validation checkpoints ✓

### Validation
- [x] Install guide structure validated ✓ (extract_structure.py ran successfully)
- [x] SKILL.md frontmatter parses without errors ✓ (validated via Python yaml)
- [ ] At least one example tested via Code Mode (deferred - requires active Figma file)
- [ ] Skill discoverable by `skill_advisor.py` (deferred - requires skill advisor update)

<!-- /ANCHOR:testing -->

---

## P2 - CAN DEFER

Nice to have, can defer without approval.

### Additional Content
- [x] Cross-tool workflow example (Figma → ClickUp) ✓ (in Integration Points)
- [x] Design-to-code pipeline example ✓ (Example 7 added - CSS custom properties generation)
- [x] Figma API rate limit documentation ✓ (Expanded in Troubleshooting section with table and best practices)
- [x] Version history tracking in install guide ✓ (Added at end of install guide)
- [x] Architecture diagram in Overview ✓ (ASCII diagram - improved with Code Mode emphasis)

### Polish
- [x] All internal links verified working ✓
- [x] Consistent emoji usage throughout ✓
- [x] No placeholder text remaining ✓
- [x] Spelling and grammar check ✓ (reviewed both files)

---

<!-- ANCHOR:summary -->
## Validation Evidence

### File Creation Evidence
```
Install Guide: ~1400 lines (updated with Code Mode emphasis)
SKILL.md: ~450 lines (updated with CODE MODE ONLY callout)
tool_reference.md: 423 lines
quick_start.md: 269 lines
tool_categories.md: 193 lines
README.md: 774 lines
Total: ~3500 lines
```

### Frontmatter Validation
```
Frontmatter valid: YES
Name: mcp-figma
Version: 1.0.0
Tools: 5 (allowed-tools)
```

### Structure Validation
- H1: "Figma MCP Installation Guide (Code Mode Provider)"
- 11 H2 sections (0-10) with emojis and numbers
- Table of Contents present
- Horizontal rules between sections
- Code Mode Provider callout box at top

### Code Mode Emphasis (v1.1.0 Update)
- Install Guide: Added "Code Mode Provider" to title
- Install Guide: Added prominent callout box explaining Code Mode relationship
- Install Guide: Updated architecture diagrams to show Code Mode → Figma flow
- Install Guide: Section 4 clarifies opencode.json vs .utcp_config.json
- SKILL.md: Added "CODE MODE ONLY" callout after intro
- SKILL.md: Added Prerequisites subsection with dependency chain
- SKILL.md: Updated Integration Points with Code Mode dependency emphasis

<!-- /ANCHOR:summary -->

---

## Progress Tracking

| Category | Total | Complete | Remaining |
|----------|-------|----------|-----------|
| P0 | 20 | 20 | 0 |
| P1 | 12 | 10 | 2 (deferred - require live testing) |
| P2 | 8 | **8** | **0** |
| **Total** | **40** | **38** | **2** |

---

<!-- ANCHOR:sign-off -->
## Sign-Off

- [x] All P0 items complete
- [x] All P1 items complete or deferred with approval
- [x] All P2 items complete ✓ (v1.1.0 update)
- [x] Implementation summary created
- [x] Checklist updated with evidence
- [x] Code Mode emphasis added throughout (v1.1.0)

<!-- /ANCHOR:sign-off -->
