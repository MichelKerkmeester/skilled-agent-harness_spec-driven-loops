---
title: Install Guide Section and Configuration Examples
description: Worked Section 0/1/2 examples plus multi-platform and tool-specific configuration patterns for install guides.
trigger_phrases:
  - "install guide section examples"
  - "ai-first install prompt"
  - "install guide prerequisites example"
  - "install guide platform configuration"
  - "opencode mcp config example"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Install Guide Section and Configuration Examples

Overflow detail behind `SKILL.md` Section 7 (install-guide workflow). Use it while writing the opening sections or the platform configuration of a guide. `SKILL.md` carries the phase flow, the 11-section table and the validation-checkpoint format; this file carries the worked examples.

---

## 1. OVERVIEW

The examples below show what the AI-First prompt, Overview, Prerequisites and platform-configuration blocks look like in a finished guide. Copy the shape, then fill it with tool-specific detail confirmed from local evidence.

**Core Principle**: Install once, verify at each step. Every phase carries its own validation checkpoint.

**When to Use**:
- Writing Section 0 (AI-First prompt), Section 1 (Overview) or Section 2 (Prerequisites)
- Adding multi-platform or tool-specific configuration blocks

> **Note on examples below**: illustrative section headings inside the fenced examples are written `\##` (not `##`) so the section-numbering validator, which scans `## N.` lines regardless of code fences, does not count them as this document's own sections. Drop the leading `\` when copying a heading into a real install guide.

---

## 2. SECTION EXAMPLES

**Section 0 - AI-First Install Guide** (copy-paste prompt):

```markdown
\## AI-FIRST INSTALL GUIDE

**Copy and paste this prompt to your AI assistant:**
I want to install [Tool] from [URL]. Please help me...
```

**Section 1 - Overview** (must include a Core Principle blockquote):

```markdown
\## 1. OVERVIEW

[Tool] is [description]. It provides [benefits].

### Core Principle

> **Install once, verify at each step.** Each phase has a validation checkpoint - do not proceed until the checkpoint passes.
```

**Section 2 - Prerequisites** (checklist format required):

```markdown
\## 2. PREREQUISITES
- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm v9+ installed (`npm --version`)
- [ ] Terminal access with standard permissions

### Validation: `phase_1_complete`
...
❌ **STOP if validation fails** - Fix prerequisites before continuing.
```

Each validation checkpoint MUST be followed by a STOP block:

```markdown
❌ **STOP if validation fails** - [Brief instruction on what to check]
```

Install guides should contain 5+ STOP blocks across all validation checkpoints.

---

## 3. PLATFORM CONFIGURATION

### Multi-Platform Instructions

Use conditional blocks when environments differ:

```markdown
**macOS/Linux**:
```bash
export MCP_PATH="$HOME/.mcp"
```

**Windows (PowerShell)**:
```powershell
$env:MCP_PATH = "$HOME\.mcp"
```
```

### Tool-Specific Config Patterns

**OpenCode** (`opencode.json`):

```json
{
  "mcp": {
    "server-name": {
      "type": "local",
      "command": ["/path/to/binary"],
      "environment": {
        "_NOTE_TOOLS": "Description of what this provides"
      },
      "enabled": true
    }
  }
}
```

**Claude Desktop** (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@example/server"]
    }
  }
}
```

Include platform-specific configuration only when it is real for the tool.

---

## 4. CROSS-REFERENCES

- [quality_and_standards.md](quality_and_standards.md) - Troubleshooting standards, quality criteria and checklist
- [install_guide_template.md](../../assets/readme/install_guide_template.md) - Full install-guide scaffold
- [core_standards.md](../../../shared/references/core_standards.md) - Document formatting rules
