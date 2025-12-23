# OpenCode Skills Plugin Installation Guide

A comprehensive guide to installing, configuring, and using the OpenCode Skills plugin system with **OpenSkills** - the universal skills loader for AI coding agents.

> **Note for OpenCode users**: This guide references `.claude/skills/` paths which are for Claude Code compatibility. OpenCode uses `.opencode/skills/` as its primary skills location. The opencode-skills plugin automatically detects and uses the correct path based on your environment.

---

## 🤖 AI-FIRST INSTALL GUIDE

**Copy and paste this prompt to your AI assistant to get installation help:**

```
I want to set up the OpenSkills plugin system in my project.

Please help me:
1. Install openskills globally (npm i -g openskills)
2. Install skills from Anthropic's marketplace (openskills install anthropics/skills)
3. Sync skills to AGENTS.md (openskills sync)
4. Verify the installation is working correctly (openskills list)

My project is located at: [your project path]

Guide me through each step and show me what commands to run.
```

**What the AI will do:**
- Install the OpenSkills CLI globally
- Help you select and install skills from GitHub repositories
- Sync the skills to your AGENTS.md with the `<available_skills>` format
- Test that skills are loading correctly with `openskills read <skill-name>`
- Provide next steps for adding custom skills

---

#### 📋 TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 📋 PREREQUISITES](#2--prerequisites)
- [3. 📦 INSTALLATION](#3--installation)
- [4. ⚙️ CONFIGURATION](#4-️-configuration)
- [5. ✅ VERIFICATION](#5--verification)
- [6. 🚀 USAGE](#6--usage)
- [7. 🎯 FEATURES](#7--features)
- [8. 🛠️ CREATING CUSTOM SKILLS](#8-️-creating-custom-skills)
- [9. 🔧 TROUBLESHOOTING](#9--troubleshooting)
- [10. 📚 RESOURCES](#10--resources)

---

## 1. 📖 OVERVIEW

### What is OpenSkills?

**OpenSkills** is the closest implementation matching Claude Code's skills system - same prompt format, same marketplace, same folders, just using CLI instead of tools.

[![npm version](https://img.shields.io/npm/v/openskills.svg)](https://www.npmjs.com/package/openskills)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

**Repository**: https://github.com/numman-ali/openskills

### Key Benefits

| For Claude Code Users | For Other Agents (Cursor, Windsurf, Aider, OpenCode) |
|-----------------------|------------------------------------------------------|
| Install skills from any GitHub repo | Get Claude Code's skills system universally |
| Share skills across multiple agents | Access Anthropic's marketplace skills via GitHub |
| Version control your skills in your repo | Use progressive disclosure (load skills on demand) |

### How It Matches Claude Code Exactly

OpenSkills replicates Claude Code's skills system with **100% compatibility**:

- **Same prompt format** - `<available_skills>` XML with skill tags
- **Same marketplace** - Install from [anthropics/skills](https://github.com/anthropics/skills)
- **Same folders** - Uses `.claude/skills/` by default
- **Same SKILL.md format** - YAML frontmatter + markdown instructions
- **Same progressive disclosure** - Load skills on demand, not upfront

**Only difference:** Claude Code uses `Skill` tool, OpenSkills uses `openskills read <name>` CLI command.

### Skill vs Hook vs Knowledge

| Type | Purpose | Execution | Examples |
|------|---------|-----------|----------|
| **Skill** | Multi-step workflow orchestration | AI-invoked when needed | `workflows-code`, `workflows-documentation` |
| **Hook** | Automated quality checks | System-triggered (before/after operations) | `enforce-spec-folder`, `validate-bash` |
| **Knowledge** | Reference documentation | AI-referenced during responses | Code standards, MCP patterns |

---

## 2. 📋 PREREQUISITES

Before installing the Skills plugin system, ensure you have:

### Required

- **Node.js 20.6+** (for OpenSkills CLI)
  ```bash
  node --version
  # Should be v20.6.0 or higher
  ```

- **Git** (for cloning skill repositories)
  ```bash
  git --version
  ```

- **OpenCode CLI** (recommended) or any AI coding agent
  ```bash
  which opencode
  ```

### Optional but Recommended

- **AGENTS.md** file in your project root (required for `openskills sync`)
- **Python 3.8+** for documentation validation scripts
- **MCP servers** configured (for MCP integration skills)

---

## 3. 📦 INSTALLATION

### Quick Start (3 Commands)

```bash
# 1. Install OpenSkills globally
npm i -g openskills

# 2. Install skills from Anthropic's marketplace (interactive selection)
openskills install anthropics/skills

# 3. Sync to AGENTS.md
openskills sync
```

Done! Your agent now has skills with the same `<available_skills>` format as Claude Code.

### Installation Options

#### Install from Anthropic's Marketplace

```bash
# Interactive selection of skills
openskills install anthropics/skills
```

#### Install from Any GitHub Repository

```bash
# Install from custom repository
openskills install your-org/custom-skills

# Install from any Git URL
openskills install https://github.com/user/skills-repo.git
```

#### Installation Modes

| Mode | Command | Location |
|------|---------|----------|
| **Project (default)** | `openskills install anthropics/skills` | `./.claude/skills/` |
| **Global** | `openskills install anthropics/skills --global` | `~/.claude/skills/` |
| **Universal** | `openskills install anthropics/skills --universal` | `./.agent/skills/` |

### Priority Order

OpenSkills searches 4 locations in priority order:

1. `./.agent/skills/` (project universal)
2. `~/.agent/skills/` (global universal)
3. `./.claude/skills/` (project) ← **Default**
4. `~/.claude/skills/` (global)

Skills with same name only appear once (highest priority wins).

### Universal Mode (Advanced)

Use `--universal` when you have Claude Code + other agents sharing one AGENTS.md:

```bash
openskills install anthropics/skills --universal
# → Installs to ./.agent/skills/
```

This prevents duplicate skill definitions between Claude Code's native plugins and AGENTS.md skills.

---

## 4. ⚙️ CONFIGURATION

### What OpenSkills Adds to AGENTS.md

After running `openskills sync`, your AGENTS.md will contain:

```xml
<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively.

How to use skills:
- Invoke: Bash("openskills read <skill-name>")
- The skill content will load with detailed instructions
- Base directory provided in output for resolving bundled resources

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
</usage>

<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit...</description>
<location>project</location>
</skill>

<skill>
<name>xlsx</name>
<description>Comprehensive spreadsheet creation...</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

### How Agents Use It

1. User asks: "Extract data from this PDF"
2. Agent scans `<available_skills>` → finds "pdf" skill
3. Agent invokes: `openskills read pdf`
4. SKILL.md content is output to agent's context
5. Agent follows instructions to complete task

---

## 5. ✅ VERIFICATION

### Check 1: Verify Installation

```bash
# Check openskills is installed
which openskills
openskills --version
```

### Check 2: List Installed Skills

```bash
openskills list
```

Expected output:
```
Available Skills:

  pdf                       (project)
    Comprehensive PDF manipulation toolkit for extracting text...

  xlsx                      (project)
    Comprehensive spreadsheet creation, editing, and analysis...

Summary: 10 project, 0 global (10 total)
```

### Check 3: Test Reading a Skill

```bash
openskills read pdf
```

Expected: The full SKILL.md content loads with instructions.

### Check 4: Verify AGENTS.md Sync

```bash
grep "SKILLS_TABLE_START" AGENTS.md
```

Should show the skills section was added.

---

## 6. 🚀 USAGE

### CLI Commands

| Command | Description |
|---------|-------------|
| `openskills install <source>` | Install from GitHub (interactive) |
| `openskills sync [-y]` | Update AGENTS.md (interactive) |
| `openskills list` | Show installed skills |
| `openskills read <name>` | Load skill (for agents) |
| `openskills manage` | Remove skills (interactive) |
| `openskills remove <name>` | Remove specific skill |

### Flags

| Flag | Description |
|------|-------------|
| `--global` | Install globally to `~/.claude/skills` |
| `--universal` | Install to `.agent/skills/` instead of `.claude/skills/` |
| `-y` | Skip interactive selection (for scripts/CI) |

### How AI Agents Use Skills

#### Explicit Skill Invocation

Tell your AI agent:
```
Use the pdf skill to extract text from document.pdf
```

The agent will run:
```bash
openskills read pdf
```

#### Automatic Skill Detection

AI agents scan `<available_skills>` in AGENTS.md and automatically invoke relevant skills based on:
- Keywords in your prompt
- File types you're working with
- Intent patterns detected

### Side-by-Side Comparison

| Aspect | Claude Code | OpenSkills |
|--------|-------------|------------|
| **System Prompt** | Built into Claude Code | In AGENTS.md |
| **Invocation** | `Skill("pdf")` tool | `openskills read pdf` CLI |
| **Prompt Format** | `<available_skills>` XML | `<available_skills>` XML (identical) |
| **Folder Structure** | `.claude/skills/` | `.claude/skills/` (identical) |
| **SKILL.md Format** | YAML + markdown | YAML + markdown (identical) |
| **Progressive Disclosure** | Yes | Yes |
| **Bundled Resources** | `references/`, `scripts/`, `assets/` | `references/`, `scripts/`, `assets/` (identical) |

**Everything is identical except the invocation method.**

---

## 7. 🎯 FEATURES

### Available Skills from Anthropic's Marketplace

From [github.com/anthropics/skills](https://github.com/anthropics/skills):

| Skill | Description |
|-------|-------------|
| **xlsx** | Spreadsheet creation, editing, formulas, data analysis |
| **docx** | Document creation with tracked changes and comments |
| **pdf** | PDF manipulation (extract, merge, split, forms) |
| **pptx** | Presentation creation and editing |
| **canvas-design** | Create posters and visual designs |
| **mcp-builder** | Build Model Context Protocol servers |
| **skill-creator** | Detailed guide for authoring skills |

### Your Installed Skills (Project-Specific)

| Skill | Purpose |
|-------|---------|
| **workflows-code** | Development lifecycle (implementing, debugging, verifying) |
| **workflows-git** | Git operations (commits, PRs, worktrees) |
| **system-spec-kit** | Spec folder documentation workflow |
| **workflows-save-context** | Context preservation across sessions |
| **workflows-documentation** | Document creation and validation |
| **mcp-code-mode** | MCP tool orchestration via TypeScript |
| **mcp-semantic-search** | Intent-based code discovery |
| **workflows-chrome-devtools** | Browser debugging via bdg CLI |

---

## 8. 🛠️ CREATING CUSTOM SKILLS

### Minimal Structure

```
my-skill/
└── SKILL.md
```

### SKILL.md Format

```markdown
---
name: my-skill
description: What this does and when to use it
---

# Instructions in imperative form

When the user asks you to X, do Y...

1. First step
2. Second step
3. Final step
```

### With Bundled Resources

```
my-skill/
├── SKILL.md
├── references/
│   └── api-docs.md      # Supporting documentation
├── scripts/
│   └── process.py       # Helper scripts
└── assets/
    └── template.json    # Templates, configs
```

Reference resources in SKILL.md:
```markdown
1. Read the API documentation in references/api-docs.md
2. Run the process.py script from scripts/
3. Use the template from assets/template.json
```

### Publishing to GitHub

1. Push to GitHub: `your-username/my-skill`
2. Users install with: `openskills install your-username/my-skill`

### Authoring Guide

Use Anthropic's skill-creator for detailed guidance:

```bash
openskills install anthropics/skills
openskills read skill-creator
```

---

## 9. 🔧 TROUBLESHOOTING

### Skill Not Found

**Problem**: `openskills read skill-name` returns "not found"

**Solutions**:
```bash
# List available skills
openskills list

# Check skill directories
ls -la .claude/skills/
ls -la .agent/skills/
```

### AGENTS.md Not Updated

**Problem**: `openskills sync` doesn't update AGENTS.md

**Solutions**:
1. Ensure AGENTS.md exists in project root
2. Run `openskills sync -y` to skip interactive mode
3. Check file permissions

### Installation Fails

**Problem**: `npm i -g openskills` fails

**Solutions**:
```bash
# Check Node.js version (needs 20.6+)
node --version

# Try with sudo (macOS/Linux)
sudo npm i -g openskills

# Or use npx directly
npx openskills list
```

### Skills in Wrong Location

**Problem**: Skills installed but not detected

**Solutions**:
```bash
# Check priority order
openskills list

# Skills should be in one of:
# ./.agent/skills/    (project universal)
# ~/.agent/skills/    (global universal)
# ./.claude/skills/   (project) ← default
# ~/.claude/skills/   (global)
```

### Why CLI Instead of MCP?

**MCP (Model Context Protocol)** is for:
- Database connections
- API integrations
- Real-time data fetching

**Skills (SKILL.md format)** are for:
- Specialized workflows (PDF manipulation, spreadsheet editing)
- Bundled resources (scripts, templates, references)
- Progressive disclosure (load instructions only when needed)
- Static, reusable patterns

OpenSkills implements Anthropic's skills spec the way it was designed - as progressively-loaded markdown instructions.

---

## 10. 📚 RESOURCES

### Official Links

- **OpenSkills Repository**: https://github.com/numman-ali/openskills
- **Anthropic Skills Marketplace**: https://github.com/anthropics/skills
- **OpenCode Docs**: https://opencode.ai/docs
- **OpenCode Plugins**: https://opencode.ai/docs/plugins/

### Quick Reference Commands

```bash
# Install OpenSkills
npm i -g openskills

# Install skills from GitHub
openskills install anthropics/skills
openskills install your-org/custom-skills

# Sync to AGENTS.md
openskills sync
openskills sync -y  # Non-interactive

# List installed skills
openskills list

# Read/load a skill (what AI agents call)
openskills read pdf
openskills read xlsx

# Manage skills
openskills manage     # Interactive removal
openskills remove pdf # Remove specific skill
```

### File Locations

| Item | Default Location |
|------|------------------|
| **Project Skills** | `./.claude/skills/` |
| **Global Skills** | `~/.claude/skills/` |
| **Universal Skills** | `./.agent/skills/` |
| **Skills Section** | `AGENTS.md` (between `<!-- SKILLS_TABLE_START -->` and `<!-- SKILLS_TABLE_END -->`) |

### Claude Code Compatibility

You can use **both** Claude Code plugins and OpenSkills project skills together:

```xml
<skill>
<name>pdf</name>
<description>...</description>
<location>plugin</location>  <!-- Claude Code marketplace -->
</skill>

<skill>
<name>custom-skill</name>
<description>...</description>
<location>project</location>  <!-- OpenSkills from GitHub -->
</skill>
```

They coexist perfectly. Claude invokes marketplace plugins via `Skill` tool, OpenSkills skills via CLI.

---

## Quick Reference

### Essential Commands

```bash
# Install globally
npm i -g openskills

# Install skills
openskills install anthropics/skills

# Sync to AGENTS.md
openskills sync

# List skills
openskills list

# Load a skill (AI agents use this)
openskills read <skill-name>
```

### Common Patterns

**Ask AI to use a skill:**
```
Use the workflows-code skill to implement authentication
```

**Check installed skills:**
```
What skills are installed?
```

**AI will run:**
```bash
openskills list
```

**Load skill for instructions:**
```bash
openskills read workflows-code
```

---

**Installation Complete!**

You now have the OpenSkills plugin system installed and configured. Start using skills by requesting them in your AI coding sessions or letting them activate automatically based on the `<available_skills>` section in your AGENTS.md.

For more information, see the [OpenSkills GitHub repository](https://github.com/numman-ali/openskills).
