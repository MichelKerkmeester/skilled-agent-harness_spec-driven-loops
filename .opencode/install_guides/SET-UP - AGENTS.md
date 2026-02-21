# AGENTS.md Customization Guide

Comprehensive guide for customizing the AI agent configuration file (AGENTS.md) for your specific project type, installed MCP tools, and available skills. Covers front-end, back-end, and full-stack configurations with interactive AI-assisted setup.

> **Part of OpenCode Installation** - See [Master Installation Guide](./README.md) for complete setup.
> **Scope**: AGENTS.md

---

## TABLE OF CONTENTS

1. [OVERVIEW](#1--overview)
2. [AGENTS.md GATES REFERENCE](#2--agentsmd-gates-reference)
3. [FILE NAMING CONVENTION](#3--file-naming-convention)
4. [PROJECT TYPE CUSTOMIZATION](#4--project-type-customization)
5. [MCP TOOLING ALIGNMENT](#5--mcp-tooling-alignment)
6. [SKILLS ALIGNMENT](#6--skills-alignment)
7. [COMMANDS REFERENCE](#7--commands-reference)
8. [PROJECT-SPECIFIC ADDITIONS](#8--project-specific-additions)
9. [VALIDATION CHECKLIST](#9--validation-checklist)

---

## AI-FIRST SET-UP GUIDE

**Copy and paste this prompt for interactive AGENTS.md customization:**

```
I need to customize the AGENTS.md file for my project. Please guide me through an interactive setup by asking me questions one at a time.

**Questions to ask me (one at a time, wait for my answer):**

1. **Project Type**: What type of project is this?
   - Front-end (Webflow, CSS, JavaScript, browser-focused)
   - Back-end (API, database, server-side)
   - Full-stack (both front-end and back-end)

2. **MCP Servers**: What MCP servers are installed? 
   (Please check my opencode.json and .utcp_config.json to verify)

3. **Available Skills**: What skills exist in my .opencode/skill/ directory?
   (Please list what you find)

4. **AI Client**: Which AI client am I using?
   - OpenCode CLI
   - Claude Code
   - Cursor
   - Other

5. **Project Conventions**: Are there any project-specific patterns or conventions I should include?
   (e.g., Webflow/Finsweet patterns, API naming conventions, testing requirements)

**After gathering my answers, please:**

1. Generate a customized Tool Routing Decision Tree based on my installed MCP servers
2. Generate a customized Skills Table based on my available skills
3. Suggest Confidence Weight adjustments for my project type
4. Identify any sections to remove (tools/skills I don't have)
5. Suggest project-specific additions

Provide copy-paste ready sections I can use to replace parts of my AGENTS.md.

My project is at: [your project path]
```

**What the AI will do:**
- Ask you questions one at a time to understand your setup
- Audit your installed MCP servers by reading your config files
- Check your available skills in .opencode/skill/
- Generate customized AGENTS.md sections tailored to your project
- Provide copy-paste ready configuration blocks

**Expected customization time:** 10-15 minutes

---

## 1. OVERVIEW

### What is AGENTS.md?

AGENTS.md is an AI agent configuration file that defines behavior guardrails, standards, and decision frameworks for AI assistants working on your project. It serves as the "operating manual" that AI agents read before executing any task.

**Core Functions:**
- **Behavior guardrails** - Mandatory gates that prevent common mistakes
- **Tool routing** - Decision trees for selecting the right tool for each task
- **Skills system** - On-demand specialized capabilities for complex workflows
- **Confidence framework** - When to proceed vs. ask for clarification
- **Documentation standards** - Spec folder requirements and templates

### Why Customize It?

The universal template (`AGENTS (Universal).md`) includes ALL possible tools, skills, and patterns. Your project likely uses a subset:

| Scenario               | Customization Needed                      |
| ---------------------- | ----------------------------------------- |
| Front-end only project | Remove backend tools, database references |
| Backend API project    | Remove Webflow, Figma, browser tools      |
| Missing MCP servers    | Remove references to uninstalled tools    |
| Custom skills          | Add project-specific skill definitions    |
| Team conventions       | Add coding standards, review requirements |

### When to Customize vs Use As-Is

**Customize when:**
- Your project type differs from full-stack (front-end only, backend only)
- You haven't installed all MCP servers referenced in the template
- You have project-specific conventions or requirements
- AI agents are trying to use tools that don't exist

**Use as-is when:**
- Full-stack project with all MCP servers installed
- Getting started quickly (customize later)
- Using as reference documentation only

---

## 2. AGENTS.md GATES REFERENCE

Quick reference for the mandatory gates defined in AGENTS.md. Gates are checkpoints that AI agents must pass before taking actions.

### Gate Summary Table

| Gate/Rule                          | Trigger                               | Action                                             | Block Type |
| ---------------------------------- | ------------------------------------- | -------------------------------------------------- | ---------- |
| **Gate 1:** Understanding          | Each new user message                 | `memory_match_triggers()` → Classify intent        | SOFT       |
| **Gate 2:** Skill Routing          | Every task                            | Run `skill_advisor.py` → Route if confidence > 0.8 | REQUIRED   |
| **Gate 3:** Spec Folder            | File modification detected            | Ask A/B/C/D options before tools                   | HARD BLOCK |
| **Memory Context Loading** (rule)  | User selects A or C in Gate 3         | Load memory when using existing spec folder        | SOFT       |
| **Memory Save Rule** (post-exec)   | "save context", "/memory:save"        | Validate folder → Execute `generate-context.js`    | HARD       |
| **Completion Verification** (post-exec) | Claiming "done", "complete"      | Load checklist.md → Verify all items               | HARD       |

### Gate Flow Diagram

```
User Message
     ↓
┌──────────────────────────┐
│ Gate 1: Understanding    │──→ memory_match_triggers() → Classify intent
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ Gate 2: Skill Routing    │──→ skill_advisor.py → Route if >0.8
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ Gate 3: Spec Folder      │──→ File modification? → Ask A/B/C/D
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ Memory Context Loading   │──→ Load memory for existing spec folder
└────────────┬─────────────┘
             ↓
        ✅ EXECUTE TASK
             ↓
┌──────────────────────────┐
│ Memory Save Rule         │──→ generate-context.js required
└────────────┬─────────────┘
             ↓
┌──────────────────────────┐
│ Completion Verification  │──→ Verify checklist.md
└────────────┬─────────────┘
             ↓
        ✅ CLAIM DONE
```

### Block Types Explained

| Block Type    | Meaning                           | User Action               |
| ------------- | --------------------------------- | ------------------------- |
| **HARD**      | Cannot proceed without resolution | Must respond or fix issue |
| **SOFT**      | Can be bypassed with [skip]       | Optional engagement       |
| **MANDATORY** | Always runs, cannot skip          | Automatic                 |

---

## 3. FILE NAMING CONVENTION

### Remove "(Universal)" for Project-Specific Use

The template file is named `AGENTS (Universal).md` to indicate it's a starting point. For your project:

```bash
# Step 1: Rename for your project
mv "AGENTS (Universal).md" "AGENTS.md"

# Step 2: Keep original as reference (optional)
cp "AGENTS.md" "AGENTS (Template).md"
```

### Why This Matters

AI assistants automatically read `AGENTS.md` from the project root:

| Tool            | File Detection                                     |
| --------------- | -------------------------------------------------- |
| **OpenCode**    | Reads `AGENTS.md` from project root on startup     |
| **Claude Code** | Reads `AGENTS.md` from project root |
| **Cursor**      | Reads `.cursorrules` or `AGENTS.md`                |
| **Windsurf**    | Reads `.windsurfrules` or `AGENTS.md`              |

### File Location

```
your-project/
├── AGENTS.md              ← AI agents read this
├── AGENTS (Template).md   ← Reference copy (optional)
├── .opencode/
│   └── skill/
└── src/
```

---

## 4. PROJECT TYPE CUSTOMIZATION

### 4.1 Front-end Projects (Webflow, CSS, JavaScript)

Front-end projects emphasize visual development, browser tools, and design integration.

#### Tool Emphasis

| Keep/Emphasize    | Remove/De-emphasize  |
| ----------------- | -------------------- |
| Chrome DevTools   | Database tools       |
| Webflow MCP       | API testing tools    |
| Figma MCP         | Security scanners    |
| CSS/JS patterns   | Backend frameworks   |
| Visual regression | Server configuration |

#### Primary Skills

| Skill                       | Purpose                                           |
| --------------------------- | ------------------------------------------------- |
| `mcp-chrome-devtools` | Browser debugging, visual testing, DOM inspection |
| `mcp-code-mode`             | Webflow, Figma integration via Code Mode          |

#### Confidence Weight Adjustments

Update §4 with front-end focused weights:

```markdown
| Weight Category      | Frontend |
| -------------------- | -------- |
| Requirements clarity | 25%      |
| API/Component design | 15%      |
| State/Data flow      | 15%      |
| Type safety/Security | 10%      |
| Performance          | 10%      |
| Accessibility        | 15%      | ← Increased (visual focus) |
| Tooling/Risk         | 10%      |
```

#### Code Focus Areas

Add to §5 or create new section:

```markdown
### Front-end Code Standards
- CSS: BEM naming, Webflow class conventions
- JavaScript: ES6+, no jQuery unless existing
- HTML: Semantic elements, ARIA attributes
- Animations: GSAP or CSS transitions
- Testing: Visual regression, cross-browser
```

---

### 4.2 Back-end Projects (API, Database, Server)

Backend projects emphasize data integrity, security, and API design.

#### Tool Emphasis

| Keep/Emphasize    | Remove/De-emphasize |
| ----------------- | ------------------- |
| Database tools    | Chrome DevTools     |
| API testing       | Webflow MCP         |
| Security patterns | Figma MCP           |
| Unit testing      | CSS patterns        |
| CI/CD integration | Visual testing      |

#### Primary Skills

| Skill            | Purpose                                                      |
| ---------------- | ------------------------------------------------------------ |
| `sk-code--web` | Implementation, debugging, verification lifecycle            |

#### Confidence Weight Adjustments

Update §4 with backend focused weights:

```markdown
| Weight Category       | Backend |
| --------------------- | ------- |
| Requirements clarity  | 25%     |
| API/Component design  | 20%     | ← Increased (API focus)         |
| State/Data flow       | 15%     |
| Type safety/Security  | 20%     | ← Increased (security critical) |
| Performance           | 10%     |
| Accessibility/Testing | 5%      | ← Decreased                     |
| Tooling/Risk          | 5%      |
```

#### Code Focus Areas

```markdown
### Backend Code Standards
- API: RESTful conventions, OpenAPI specs
- Database: Migration-first, no raw queries
- Security: Input validation, auth middleware
- Testing: Unit tests required, integration optional
- Logging: Structured JSON, correlation IDs
```

---

### 4.3 Full-stack Projects

Full-stack projects use the complete template with balanced weights.

#### Tool Emphasis

Include all tool types with contextual routing:

```markdown
### Tool Routing by Layer
- **Frontend work** → Chrome DevTools, Webflow, Figma
- **Backend work** → Database tools, API testing
- **Both** → Grep/Glob, Memory
```

#### Balanced Weight Distribution

Use the default weights from the template:

```markdown
| Weight Category       | Full-stack |
| --------------------- | ---------- |
| Requirements clarity  | 25%        |
| API/Component design  | 17%        |
| State/Data flow       | 15%        |
| Type safety/Security  | 15%        |
| Performance           | 10%        |
| Accessibility/Testing | 10%        |
| Tooling/Risk          | 8%         |
```

---

### 4.4 Before/After Customization Examples

Concrete examples showing how to customize from Universal to project-specific.

#### Example: Frontend Project (Webflow/CSS/JS)

**Before (Universal Template):**
- All 9 skills installed
- All 3 MCP servers configured
- All 19 commands available

**After (Frontend-Optimized):**

| Component             | Status | Items                     | Reason                          |
| --------------------- | ------ | ------------------------- | ------------------------------- |
| **Skills - Keep**     | ✅      | system-spec-kit           | Context preservation needed     |
|                       | ✅      | mcp-chrome-devtools | Browser debugging essential     |
|                       | ✅      | sk-code--web            | Implementation workflow         |
|                       | ✅      | mcp-code-mode             | Webflow/Figma integration       |
| **Skills - Remove**   | ❌      | sk-git             | Optional for solo projects      |
| **MCP - Keep**        | ✅      | spec_kit_memory           | Required for spec-kit skill     |
|                       | ✅      | code_mode                 | External tool access            |
| **MCP - Remove**      | ❌      | sequential_thinking       | Overkill for frontend           |
| **Commands - Keep**   | ✅      | /memory:*                 | Context preservation            |
|                       | ✅      | /spec_kit:*               | Documentation workflow          |
| **Commands - Remove** | ❌      | /search:*                 | Using simple grep instead       |

#### Example: Backend API Project

**Before (Universal Template):**
- All 9 skills installed
- All 3 MCP servers configured

**After (Backend-Optimized):**

| Component           | Status | Items                     | Reason                                   |
| ------------------- | ------ | ------------------------- | ---------------------------------------- |
| **Skills - Keep**   | ✅      | system-spec-kit           | Research context preservation            |
|                     | ✅      | sk-code--web            | Implementation lifecycle                 |
|                     | ✅      | sk-git             | PR/commit workflows                      |
| **Skills - Remove** | ❌      | mcp-chrome-devtools | No browser UI                            |
|                     | ❌      | mcp-code-mode             | No Webflow/Figma needed                  |
| **MCP - Keep**      | ✅      | spec_kit_memory           | Context preservation                     |
|                     | ✅      | sequential_thinking       | Complex reasoning                        |
| **MCP - Remove**    | ❌      | code_mode                 | No external design tools                 |

---

## 5. MCP TOOLING ALIGNMENT

### 5.1 Audit Installed Components

Before customizing, audit what's actually installed:

<details>
<summary><strong>Audit Commands</strong></summary>

```bash
# Check opencode.json for Native MCP servers
cat opencode.json | jq '.mcp'

# Example output:
# {
#   "servers": {
#     "sequential-thinking": { ... },
#     "semantic-memory": { ... },
#     "code-mode": { ... }
#   }
# }

# Check .utcp_config.json for Code Mode tools
cat .utcp_config.json | jq '.manuals'

# Example output:
# {
#   "webflow": { ... },
#   "figma": { ... },
#   "clickup": { ... }
# }

# List available skills
ls -la .opencode/skill/

# Example output:
# mcp-code-mode/
# mcp-figma/
# system-spec-kit/
# mcp-chrome-devtools/
# sk-code--web/
# sk-git/
```

</details>

### 5.2 Native MCP Servers Reference

**Current Installation (3 servers):**

| Server                | Tool Prefix             | Purpose                                                        |
| --------------------- | ----------------------- | -------------------------------------------------------------- |
| `sequential-thinking` | `sequential_thinking_*` | Complex multi-step reasoning                                   |
| `spec-kit-memory`     | `memory_*`              | Context preservation                                           |
| `code-mode`           | `call_tool_chain()`     | External tool orchestration                                    |

### 5.3 Update Tool Routing Decision Tree

Remove lines for tools you haven't installed:

<details>
<summary><strong>Original (All Tools)</strong></summary>

```markdown
### Tool Routing Decision Tree

Known file path? → Read()
Research/prior work? → memory_search() [NATIVE MCP]
Text pattern? → Grep()
File structure? → Glob()
Complex reasoning? → sequential_thinking_sequentialthinking() [NATIVE MCP]
Browser debugging? → mcp-chrome-devtools skill
External MCP tools? → call_tool_chain() [Webflow, Figma, ClickUp]
Multi-step workflow? → Read skill SKILL.md [see §7 Skills]
```

</details>

<details>
<summary><strong>Front-end Customization (No Sequential Thinking)</strong></summary>

```markdown
### Tool Routing Decision Tree

Known file path? → Read()
Research/prior work? → memory_search() [NATIVE MCP]
Text pattern? → Grep()
File structure? → Glob()
Browser debugging? → mcp-chrome-devtools skill
External MCP tools? → call_tool_chain() [Webflow, Figma]
Multi-step workflow? → Read skill SKILL.md [see §7 Skills]
```

</details>

<details>
<summary><strong>Backend Customization (No Browser Tools, No Figma)</strong></summary>

```markdown
### Tool Routing Decision Tree

Known file path? → Read()
Research/prior work? → memory_search() [NATIVE MCP]
Text pattern? → Grep()
File structure? → Glob()
Complex reasoning? → sequential_thinking_sequentialthinking() [NATIVE MCP]
Multi-step workflow? → Read skill SKILL.md [see §7 Skills]
```

</details>

### 5.4 Update Native MCP Tools Reference

Only include tools configured in `opencode.json`:

<details>
<summary><strong>Full Reference (All Native Tools)</strong></summary>

```markdown
### Native MCP Tools Reference

SEMANTIC MEMORY (context/research):
  memory_search()         # Hybrid search (use includeContent: true for full content)
  memory_match_triggers() # Fast trigger matching
  memory_list()           # Browse memories
  memory_save()           # Index memory file
  memory_index_scan()     # Bulk indexing

SEQUENTIAL THINKING (optional):
  sequential_thinking_sequentialthinking()
```

</details>

<details>
<summary><strong>Minimal Reference (Memory Only)</strong></summary>

```markdown
### Native MCP Tools Reference

SEMANTIC MEMORY (context/research):
  memory_search()         # Hybrid search (use includeContent: true for full content)
  memory_match_triggers() # Fast trigger matching
  memory_list()           # Browse memories
  memory_save()           # Index memory file
  memory_index_scan()     # Bulk indexing
```

</details>

### 5.5 Update Code Mode Tools Reference

Only include tools in `.utcp_config.json`:

<details>
<summary><strong>Front-end Tools (Webflow + Figma)</strong></summary>

```markdown
### Code Mode Tools Reference

External tools accessed via `call_tool_chain()`:

WEBFLOW:
  call_tool_chain(`webflow.webflow_sites_list({})`)
  call_tool_chain(`webflow.webflow_get_site({ site_id: "..." })`)

FIGMA:
  call_tool_chain(`figma.figma_get_file({ file_key: "..." })`)
  call_tool_chain(`figma.figma_get_styles({ file_key: "..." })`)

Discovery: search_tools(), list_tools(), or read .utcp_config.json
```

</details>

<details>
<summary><strong>Project Management Tools (ClickUp Only)</strong></summary>

```markdown
### Code Mode Tools Reference

External tools accessed via `call_tool_chain()`:

CLICKUP:
  call_tool_chain(`clickup.clickup_get_tasks({ list_id: "..." })`)
  call_tool_chain(`clickup.clickup_create_task({ list_id: "...", name: "..." })`)

Discovery: search_tools(), list_tools(), or read .utcp_config.json
```

</details>

---

## 6. SKILLS ALIGNMENT

### 6.1 Complete Skills Reference

**Current Installation (9 skills):**

| Skill                       | Version  | Primary Triggers                                                 | Purpose                                               |
| --------------------------- | -------- | ---------------------------------------------------------------- | ----------------------------------------------------- |
| `mcp-figma`                 | v1.0.0   | "Figma", "design", "component", "style"                          | Figma design tool integration                         |
| `mcp-code-mode`             | v1.2.0   | "ClickUp", "Figma", "Webflow", "external tool"                   | MCP orchestration for external tools                  |
| `system-spec-kit`           | v2.2.0   | "save context", "/memory:save", "spec folder", "plan"            | Context preservation and spec workflow                |
| `mcp-chrome-devtools` | v2.1.0   | "screenshot", "bdg", "browser debug", "DOM"                      | Chrome DevTools Protocol debugging                    |
| `sk-code--full-stack`| v1.0.0   | "implement", "debug", "verify", "refactor" (full-stack)          | Full-stack implementation lifecycle orchestrator      |
| `sk-code--opencode`  | v1.3.2   | "opencode code", "system code", "TypeScript", "Python"           | OpenCode system code standards                        |
| `sk-code--web`   | v1.0.9   | "implement", "debug", "verify", "refactor" (frontend)            | Web development implementation lifecycle              |
| `sk-documentation`   | v5.2.0   | "skill", "markdown", "flowchart", "documentation"                | Unified markdown and skill management                 |
| `sk-git`             | v1.5.0   | "commit", "branch", "PR", "push", "git"                          | Git workflow orchestration                            |

### 6.2 Skill Routing Table

When Gate 2 runs `skill_advisor.py`, it maps user intent to skills:

| User Says                         | Skill Triggered           | Confidence |
| --------------------------------- | ------------------------- | ---------- |
| "save this context"               | system-spec-kit           | 0.95       |
| "/memory:save"                    | system-spec-kit           | 0.98       |
| "remember this decision"          | system-spec-kit           | 0.85       |
| "take a screenshot"               | mcp-chrome-devtools | 0.95       |
| "debug in browser"                | mcp-chrome-devtools | 0.88       |
| "check the DOM"                   | mcp-chrome-devtools | 0.82       |
| "implement the login feature"     | sk-code--web            | 0.90       |
| "help me debug this error"        | sk-code--web            | 0.85       |
| "verify the changes work"         | sk-code--web            | 0.82       |
| "create a commit"                 | sk-git             | 0.95       |
| "open a PR"                       | sk-git             | 0.92       |
| "push to remote"                  | sk-git             | 0.90       |
| "get Webflow site data"           | mcp-code-mode             | 0.90       |
| "update Figma component"          | mcp-code-mode             | 0.88       |
| "check ClickUp tasks"             | mcp-code-mode             | 0.85       |

### 6.3 Native Skill Discovery (OpenCode v1.0.190+)

OpenCode now has **built-in skill discovery** - no manual skills table needed!

<details>
<summary><strong>How Native Skills Work</strong></summary>

**Automatic Discovery:**
- OpenCode scans `.opencode/skill/*/SKILL.md` on startup
- Skills are surfaced via `skills_*` functions (e.g., `skills_workflows_code`, `skills_system_spec_kit`)
- Frontmatter fields (`name`, `description`, `allowed-tools`) provide metadata

**No Manual List Required:**
- The old `<available_skills>` XML block is no longer needed
- Skills are auto-indexed from SKILL.md frontmatter
- Just ensure your skills are in `.opencode/skill/` with valid SKILL.md files

**Simplified AGENTS.md Section:**
```markdown
### Skill Routing (Gate 2)

Gate 2 routes tasks to skills via `skill_advisor.py`. When confidence > 0.8, you MUST invoke the recommended skill.

**How to use skills:**
- OpenCode v1.0.190+ auto-discovers skills from `.opencode/skill/*/SKILL.md` frontmatter
- Skills appear as `skills_*` functions in your available tools
- When a task matches a skill, read the SKILL.md directly: `Read(".opencode/skill/<skill-name>/SKILL.md")`
- Base directory provided for resolving bundled resources (`references/`, `scripts/`, `assets/`)

**Usage notes:**
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
- Skills are auto-indexed from SKILL.md frontmatter - no manual list maintenance required
```

</details>

### 6.4 Example: Front-end Project Skills

<details>
<summary><strong>Front-end Skills (Typical)</strong></summary>

For a front-end project, you would typically have these skills in `.opencode/skill/`:

| Skill                       | Purpose                                             |
| --------------------------- | --------------------------------------------------- |
| `mcp-code-mode`             | MCP orchestration for Webflow and Figma integration |
| `mcp-chrome-devtools` | Browser debugging via Chrome DevTools Protocol      |
| `system-spec-kit`           | Context preservation across sessions                |

**Skills to consider removing:**
- `sk-git` - Optional for solo/simple projects

**Verify your skills:**
```bash
ls -la .opencode/skill/
```

**Skills are auto-discovered** - no XML configuration needed!

</details>

### 6.5 Example: Backend Project Skills

<details>
<summary><strong>Backend Skills (Typical)</strong></summary>

For a backend/API project, you would typically have these skills in `.opencode/skill/`:

| Skill             | Purpose                                                                              |
| ----------------- | ------------------------------------------------------------------------------------ |
| `sk-code--web`  | Implementation lifecycle orchestrator for complex multi-file changes and refactoring |
| `system-spec-kit` | Context preservation for research tasks and finding prior architectural decisions    |
| `sk-git`   | Git workflow for PRs, commits, branches                                              |

**Skills to consider removing:**
- `mcp-chrome-devtools` - No browser UI to debug
- `mcp-code-mode` - No Webflow/Figma integration needed

**Verify your skills:**
```bash
ls -la .opencode/skill/
```

**Skills are auto-discovered** - no XML configuration needed!

</details>

---

## 7. COMMANDS REFERENCE

### 7.1 All Available Commands (19 total)

Commands are slash-prefixed shortcuts for common workflows.

#### Create Commands (6)

| Command                   | Description                  | Output                         |
| ------------------------- | ---------------------------- | ------------------------------ |
| `/create:agent`           | Create new agent             | Agent file in .opencode/agent/ |
| `/create:folder_readme`   | Generate README for a folder | README.md in target folder     |
| `/create:install_guide`   | Create installation guide    | Install guide document         |
| `/create:skill`           | Scaffold new skill           | Skill folder structure         |
| `/create:skill_asset`     | Create skill asset file      | Asset in skill/assets/         |
| `/create:skill_reference` | Create skill reference doc   | Reference in skill/references/ |

#### Memory Commands (4)

| Command              | Description                | Output                      |
| -------------------- | -------------------------- | --------------------------- |
| `/memory:checkpoint` | Create context checkpoint  | Checkpoint for restoration  |
| `/memory:database`   | Manage memory database     | Database operations         |
| `/memory:save`       | Save current context       | Memory file in spec folder  |
| `/memory:search`     | Search saved memories      | Matching memories list      |

#### Search Commands (2)

| Command         | Description               | Output                 |
| --------------- | ------------------------- | ---------------------- |
| `/search:code`  | Semantic code search      | Matching code snippets |
| `/search:index` | Build/manage search index | Index status/results   |

#### SpecKit Commands (7)

| Command               | Description                           | Output                      |
| --------------------- | ------------------------------------- | --------------------------- |
| `/spec_kit:complete`  | Full spec workflow (plan + implement) | Complete implementation     |
| `/spec_kit:debug`     | Debug mode for troubleshooting        | Debug session               |
| `/spec_kit:handover`  | Session handover documentation        | Handover document           |
| `/spec_kit:implement` | Execute pre-planned work              | Implementation from plan    |
| `/spec_kit:plan`      | Planning phase only                   | Plan without implementation |
| `/spec_kit:research`  | Technical investigation               | Research findings           |
| `/spec_kit:resume`    | Resume previous session               | Continued work              |

### 7.2 Command Usage Examples

```bash
# Save context before ending session
/memory:save

# Search for prior work on authentication
/memory:search auth implementation

# Start a new feature with full workflow
/spec_kit:complete

# Resume work from yesterday
/spec_kit:resume

# Find code related to payments
/search:code payment processing
```

### 7.3 Customizing Commands for Project Type

**Front-end projects - essential commands:**
- `/memory:save` - Preserve design decisions
- `/spec_kit:*` - Documentation workflow
- `/create:*` - Asset creation

**Backend projects - essential commands:**
- `/memory:*` - All memory commands for research
- `/search:*` - Code discovery
- `/spec_kit:*` - Full workflow

**Remove commands** by not referencing them in your AGENTS.md. Commands are defined in `.opencode/commands/`.

---

## 8. PROJECT-SPECIFIC ADDITIONS

### 8.1 Custom Commands

Add project-specific slash commands:

```markdown
### Project Commands

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `/deploy:staging` | Deploy to staging environment            |
| `/deploy:prod`    | Deploy to production (requires approval) |
| `/test:visual`    | Run visual regression tests              |
| `/sync:webflow`   | Sync changes with Webflow                |
```

### 8.2 Project Conventions

Document team conventions:

```markdown
### Code Conventions

#### Naming
- CSS classes: BEM with `c-` prefix (e.g., `c-card__title`)
- JavaScript: camelCase for variables, PascalCase for classes
- Files: kebab-case (e.g., `user-profile.js`)

#### Git
- Branch format: `feature/XXX-description` or `fix/XXX-description`
- Commit format: `type(scope): description`
- PR requires: 1 approval, passing tests

#### Documentation
- All new features require spec folder
- API changes require decision-record.md
- Breaking changes require migration guide
```

### 8.3 Code Quality Standards Links

Reference external documentation:

```markdown
### Code Quality Standards

Project standards are defined in:
- **CSS**: `docs/standards/css-conventions.md`
- **JavaScript**: `docs/standards/js-conventions.md`
- **Testing**: `docs/standards/testing-requirements.md`
- **Accessibility**: `docs/standards/a11y-checklist.md`

**Enforcement:** These standards override general practices. Check before proposing solutions.
```

### 8.4 Webflow-Specific Patterns (Front-end)

```markdown
### Webflow Integration

#### Class Naming
- Client classes: No prefix (Webflow default)
- Custom classes: `c-` prefix
- Utility classes: `u-` prefix
- State classes: `is-` or `has-` prefix

#### CMS Patterns
- Collection items: `[collection-name]_item`
- Dynamic content: Use embed blocks for custom JS
- Conditional visibility: Prefer Webflow native over JS

#### JavaScript Loading
- Global scripts: In project settings
- Page-specific: In page settings footer
- CMS template: In embed within collection
```

### 8.5 API Conventions (Backend)

```markdown
### API Standards

#### Endpoint Design
- RESTful: `/api/v1/[resource]/[id]/[sub-resource]`
- Use plural nouns: `/users` not `/user`
- Actions as verbs: `/users/:id/activate`

#### Response Format
```json
{
  "data": { ... },
  "meta": { "page": 1, "total": 100 },
  "errors": []
}
```

#### Error Handling
- 4xx: Client errors with actionable message
- 5xx: Server errors with correlation ID
- Always include `error_code` for programmatic handling
```

---

## 9. VALIDATION CHECKLIST

Use this checklist after customizing AGENTS.md:

### Pre-Customization Verification

```markdown
## Pre-Customization Checklist

### Environment Audit
- [ ] Verified opencode.json exists and contains MCP configuration
- [ ] Verified .utcp_config.json exists (if using Code Mode)
- [ ] Listed all skills in .opencode/skill/ directory
- [ ] Identified project type: [ ] Front-end [ ] Backend [ ] Full-stack
```

### Post-Customization Verification

```markdown
## AGENTS.md Customization Checklist

### File Setup
- [ ] Renamed to AGENTS.md (removed "Universal")
- [ ] Original saved as AGENTS (Template).md for reference
- [ ] File located in project root directory
- [ ] File readable by AI agent (test with simple query)

### Gates Configuration
- [ ] All 3 gates + behavioral rules documented with correct triggers
- [ ] Gate flow diagram accurate for project
- [ ] Block types (HARD/SOFT/MANDATORY) correctly labeled

### Project Type Configuration
- [ ] Identified project type: [ ] Front-end [ ] Backend [ ] Full-stack
- [ ] Updated confidence weights in §4 for project type
- [ ] Added project-specific code standards to §5
- [ ] Removed irrelevant patterns and examples

### MCP Tooling Alignment
- [ ] Audited opencode.json - listed installed MCP servers
- [ ] Audited .utcp_config.json - listed Code Mode tools
- [ ] Updated Tool Routing Decision Tree (removed missing tools)
- [ ] Updated Native MCP Tools Reference (only installed tools)
- [ ] Updated Code Mode Tools Reference (only configured tools)
- [ ] Verified tool references don't point to non-existent tools

### Skills Alignment
- [ ] Verified all 9 skills or documented which are removed
- [ ] Skills table has correct versions and triggers
- [ ] Skill routing table reflects actual routing behavior
- [ ] skill_advisor.py routes correctly (test with sample)

### Commands Alignment
- [ ] All 19 commands documented or subset specified
- [ ] Command categories match installed commands
- [ ] Usage examples work in current environment

### Project-Specific Content
- [ ] Added custom commands (if any)
- [ ] Documented project conventions
- [ ] Added links to code quality standards
- [ ] Included platform-specific patterns (Webflow/API/etc.)

### Testing & Verification
- [ ] AI agent reads AGENTS.md on session start
- [ ] Skill routing works (test Gate 2 with sample request)
- [ ] Tool references resolve to actual tools
- [ ] Memory system functions correctly
- [ ] Spec folder workflow operates as expected
```

### Quick Validation Commands

```bash
# Verify AGENTS.md exists and is readable
cat AGENTS.md | head -20

# Verify skill routing
python .opencode/skill/scripts/skill_advisor.py "help me debug CSS"

# Verify MCP tools
cat opencode.json | jq '.mcp.servers | keys'

# Verify skills directory
ls .opencode/skill/

# Verify commands directory
ls .opencode/commands/

# Test memory system (run in AI session)
# memory_search("test query")
```

### Common Issues & Fixes

| Issue                   | Cause                                 | Fix                              |
| ----------------------- | ------------------------------------- | -------------------------------- |
| "Tool not found" errors | AGENTS.md references uninstalled tool | Remove from Tool Routing section |
| Skill routing fails     | Skill not in .opencode/skill/         | Remove from Skills Table         |
| Wrong weights applied   | Project type mismatch                 | Update confidence weights        |
| Memory not surfacing    | Triggers not matching                 | Check memory_match_triggers()    |
| Gate 2 skipped          | skill_advisor.py missing              | Verify script exists and runs    |
| Command not recognized  | Command not in .opencode/commands/    | Verify command exists            |
| Gate flow broken        | Missing gate documentation            | Verify all 3 gates + rules listed |

---

## Appendix: Quick Reference

### Current Installation Summary

| Category        | Count | Items                                                                                                                                                     |
| --------------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Skills**      | 9     | mcp-figma, mcp-code-mode, system-spec-kit, mcp-chrome-devtools, sk-code--full-stack, sk-code--opencode, sk-code--web, sk-documentation, sk-git |
| **MCP Servers** | 3     | sequential-thinking, spec-kit-memory, code-mode                                                                                                           |
| **Commands**    | 19    | /create:* (6), /memory:* (5), /spec_kit:* (7), agent_router (1)                                                                                           |
| **Gates + Rules** | 3 + 3 | Gate 1-3 (Understanding, Skill Routing, Spec Folder) + Behavioral Rules (Memory Context Loading, Memory Save Rule, Completion Verification)               |

### Minimal AGENTS.md Structure

```markdown
# AI Agent Framework

## 1. CRITICAL RULES
[Keep: Core rules, gates, mandatory behaviors]

## 2. MANDATORY GATES
[Keep: All gates - these are universal]

## 3. DOCUMENTATION
[Customize: Spec folder paths, templates]

## 4. CONFIDENCE FRAMEWORK
[Customize: Weights for project type]

## 5. SOLUTION FRAMEWORK
[Customize: Project-specific standards]

## 6. TOOL SYSTEM
[Customize: Only installed tools]

## 7. SKILLS SYSTEM
[Customize: Only available skills]
```

### File Size Guidelines

| Section           | Recommended Lines |
| ----------------- | ----------------- |
| §1 Critical Rules | 40-60             |
| §2 Gates          | 80-100            |
| §3 Documentation  | 60-80             |
| §4 Confidence     | 50-70             |
| §5 Solution       | 80-100            |
| §6 Tools          | 80-120            |
| §7 Skills         | 60-100            |
| **Total**         | **450-630**       |

---

*Last updated: January 2025*
