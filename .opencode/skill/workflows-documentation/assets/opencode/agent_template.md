# Agent Template

> Template for creating OpenCode agent files with proper frontmatter, permissions, and behavioral structure.

---

## 1. 📖 OVERVIEW

Agents are specialized AI personas with defined authorities, tool permissions, and behavioral rules. Unlike skills (which provide knowledge and workflows), agents have **authority** to act and **tools** to execute.

### Key Characteristics

| Aspect          | Agent                                   | Skill                        |
| --------------- | --------------------------------------- | ---------------------------- |
| **Purpose**     | Persona with authority to act           | Knowledge/workflow bundle    |
| **Location**    | `.opencode/agent/`                      | `.opencode/skill/`           |
| **Invocation**  | `@agent-name` or automatic routing      | `skill("name")` or automatic |
| **Has Tools**   | Yes (permission object)                 | No (uses agent's tools)      |
| **Frontmatter** | name, mode, temperature, permission     | name, allowed-tools          |

### When to Create an Agent

Create an agent when you need:
- **Specific tool permissions** - Fine-grained control over which tools are available
- **Behavioral constraints** - Rules that govern how the agent operates
- **Delegation capability** - Ability to spawn sub-agents (orchestrator pattern)
- **Specialized persona** - A distinct role with defined authority

**Do NOT create an agent when:**
- You only need knowledge/workflows → Create a skill instead
- You need templates/standards → Create a skill instead
- The task doesn't require tool restrictions → Use existing agents

---

## 2. 📋 FRONTMATTER REFERENCE

### Required Fields (v1.1.1+ Format)

```yaml
---
name: agent-name                    # REQUIRED: Identifier (must match filename)
description: One-line description   # REQUIRED: Purpose statement
mode: primary                       # REQUIRED: primary | secondary
temperature: 0.1                    # REQUIRED: 0.0-1.0 (lower = deterministic)
permission:                         # REQUIRED: Unified permission object (v1.1.1+)
  read: allow
  write: allow
  edit: allow
  bash: allow
  grep: allow
  glob: allow
  webfetch: deny
  narsil: allow
  memory: allow
  chrome_devtools: deny
  task: deny
  external_directory: allow
---
```

> **Note:** The separate `tools:` object is deprecated as of OpenCode v1.1.1. Use the unified `permission:` object with `allow`/`deny`/`ask` values instead. The old format still works for backwards compatibility but should not be used for new agents.

### Field Reference

| Field         | Type   | Required | Description                                         |
| ------------- | ------ | -------- | --------------------------------------------------- |
| `name`        | string | Yes      | Agent identifier (used in `@name` invocation)       |
| `description` | string | Yes      | One-line purpose description                        |
| `mode`        | string | Yes      | `primary` (full authority) or `secondary` (limited) |
| `temperature` | float  | Yes      | 0.0-1.0, lower = more deterministic                 |
| `permission`  | object | Yes      | Unified tool & action permissions (allow/deny/ask)  |
| `steps`       | int    | No       | Max agentic iterations (replaces deprecated maxSteps) |

### Permission Reference

| Permission          | Purpose                             | Typical Setting  |
| ------------------- | ----------------------------------- | ---------------- |
| `read`              | Read files                          | allow            |
| `write`             | Create files                        | allow            |
| `edit`              | Modify files                        | allow            |
| `bash`              | Execute commands                    | allow (caution)  |
| `grep`              | Search content                      | allow            |
| `glob`              | Find files                          | allow            |
| `webfetch`          | Fetch URLs                          | deny (unless needed) |
| `narsil`            | Semantic + structural code analysis | allow            |
| `memory`            | Spec Kit Memory                     | allow            |
| `chrome_devtools`   | Browser debugging                   | deny (unless needed) |
| `task`              | Delegate to sub-agents              | deny (orchestrators only) |
| `list`              | List directory contents             | allow            |
| `patch`             | Apply patches                       | deny (unless needed) |
| `external_directory`| Access files outside project        | allow            |

### Permission Values

| Value   | Behavior                                    |
| ------- | ------------------------------------------- |
| `allow` | Automatically approve (no prompt)           |
| `deny`  | Automatically reject (blocked)              |
| `ask`   | Prompt the user for approval each time      |

### Granular Permissions (Advanced)

v1.1.1+ supports pattern-based granular control:

```yaml
permission:
  bash:
    "npm *": allow      # Allow npm commands
    "git *": allow      # Allow git commands
    "rm -rf *": deny    # Block dangerous deletions
    "*": ask            # Ask for all other commands
  edit:
    "*.md": allow       # Allow markdown edits
    "*.ts": ask         # Ask for TypeScript edits
    "*": deny           # Block all other edits
```

---

## 3. 🏗️ REQUIRED SECTIONS

Every agent file MUST include these sections:

### Section 1: Core Workflow

```markdown
## 1. 🔄 CORE WORKFLOW

[Numbered steps the agent follows for every task]

1. **STEP** → Description
2. **STEP** → Description
3. **STEP** → Description
```

### Section 2: Capability Scan

```markdown
## 2. 🔍 CAPABILITY SCAN

### Skills

| Skill | Domain | Use When | Key Features |
| ----- | ------ | -------- | ------------ |
| ...   | ...    | ...      | ...          |

### Tools

| Tool | Purpose | When to Use |
| ---- | ------- | ----------- |
| ...  | ...     | ...         |
```

### Section N-1: Anti-Patterns

```markdown
## N. 🚫 ANTI-PATTERNS

❌ **Never do X**
- Reason why this is problematic

❌ **Never do Y**
- Reason why this is problematic
```

### Section N: Related Resources

```markdown
## N. 🔗 RELATED RESOURCES

| Resource | Location | Purpose |
| -------- | -------- | ------- |
| ...      | ...      | ...     |
```

---

## 4. 📦 OPTIONAL SECTIONS

Include these sections based on agent type:

### For Orchestrator Agents (task: true)

```markdown
## N. 🗺️ AGENT CAPABILITY MAP

[Description of available sub-agents and their roles]

## N. 📋 TASK DECOMPOSITION FORMAT

[Template for structuring delegated tasks]

## N. ⚡ PARALLEL VS SEQUENTIAL

[Guidelines for parallel vs sequential execution]

## N. 🔧 FAILURE HANDLING

[Retry → Reassign → Escalate protocol]
```

### For Specialist Agents

```markdown
## N. 🗺️ [DOMAIN] MODES

[Different operational modes for the specialist]

## N. 📋 [DOMAIN] ROUTING

[Decision tree for handling different request types]

## N. 📝 OUTPUT FORMAT

[Standard output format for deliverables]
```

### For All Agents (Recommended)

```markdown
## N. 📝 CONTEXT PRESERVATION

[How to save and restore context]

## N. 📊 SUMMARY

[ASCII box summarizing agent capabilities]
```

---

## 5. 📝 COMPLETE TEMPLATE

Copy this template to create a new agent:

```markdown
---
name: [agent-name]
description: [One-line description of agent purpose and authority]
mode: primary
temperature: 0.1
permission:
  read: allow
  write: allow
  edit: allow
  bash: allow
  grep: allow
  glob: allow
  webfetch: deny
  narsil: allow
  memory: allow
  chrome_devtools: deny
  task: deny
  external_directory: allow
---

# The [Role Name]: [Subtitle]

[1-2 sentence description of the agent's purpose and authority.]

---

## 1. 🔄 CORE WORKFLOW

1. **RECEIVE** → Parse request, identify intent
2. **ANALYZE** → Gather context, check constraints
3. **EXECUTE** → Perform task using permitted tools
4. **VALIDATE** → Verify output meets requirements
5. **DELIVER** → Present results to user

---

## 2. 🔍 CAPABILITY SCAN

### Skills

| Skill          | Domain   | Use When            | Key Features   |
| -------------- | -------- | ------------------- | -------------- |
| `[skill-name]` | [Domain] | [Trigger condition] | [Key features] |

### Tools

| Tool          | Purpose   | When to Use |
| ------------- | --------- | ----------- |
| `[tool-name]` | [Purpose] | [Condition] |

---

## 3. 🗺️ [DOMAIN] ROUTING

```text
[ASCII flowchart or decision tree for routing]
```

---

## 4. 📋 RULES

### ✅ ALWAYS

- [Rule 1]
- [Rule 2]

### ❌ NEVER

- [Rule 1]
- [Rule 2]

### ⚠️ ESCALATE IF

- [Condition 1]
- [Condition 2]

---

## 5. 🚫 ANTI-PATTERNS

❌ **Never [anti-pattern]**
- [Reason]

❌ **Never [anti-pattern]**
- [Reason]

---

## 6. 🔗 RELATED RESOURCES

### Skills

| Skill        | Location                        | Purpose   |
| ------------ | ------------------------------- | --------- |
| [skill-name] | `.opencode/skill/[skill-name]/` | [Purpose] |

### Agents

| Agent        | Location                          | Purpose   |
| ------------ | --------------------------------- | --------- |
| [agent-name] | `.opencode/agent/[agent-name].md` | [Purpose] |
```

---

## 6. 💡 EXAMPLES

### Production Agents

| Agent           | File             | Type         | Key Pattern                         |
| --------------- | ---------------- | ------------ | ----------------------------------- |
| **orchestrate** | `orchestrate.md` | Orchestrator | Task delegation, parallel execution |
| **write**       | `write.md`       | Specialist   | Template-first, DQI scoring         |

### Examine Existing Agents

```bash
# View orchestrator pattern
cat .opencode/agent/orchestrate.md | head -100

# View specialist pattern
cat .opencode/agent/write.md | head -100
```

---

## 7. ✅ VALIDATION CHECKLIST

Before deploying an agent, verify:

**Frontmatter:**
- [ ] `name` matches filename (without .md)
- [ ] `description` is one-line, specific
- [ ] `mode` is `primary` or `secondary`
- [ ] `temperature` is 0.0-1.0
- [ ] `permission` object has all tool/action settings (v1.1.1+ format)
- [ ] No deprecated `tools` object present

**Structure:**
- [ ] H1 title follows "# The [Role]: [Subtitle]" pattern
- [ ] Section 1 is "🔄 CORE WORKFLOW"
- [ ] Has "🔍 CAPABILITY SCAN" section
- [ ] Has "🚫 ANTI-PATTERNS" section
- [ ] Last section is "🔗 RELATED RESOURCES"
- [ ] All H2 sections have emoji and number

**Content:**
- [ ] Core workflow has numbered steps
- [ ] Skills and tools tables are populated
- [ ] Anti-patterns explain WHY (not just WHAT)
- [ ] Related resources link to actual files

---

## 8. 🔗 RELATED RESOURCES

### Templates

| Template               | Purpose            | Path                                                     |
| ---------------------- | ------------------ | -------------------------------------------------------- |
| `skill_md_template.md` | SKILL.md structure | `workflows-documentation/assets/opencode/`    |
| `command_template.md`  | Command files      | `workflows-documentation/assets/opencode/`    |

### Agent Files

| Agent       | Location                         | Purpose                         |
| ----------- | -------------------------------- | ------------------------------- |
| orchestrate | `.opencode/agent/orchestrate.md` | Task decomposition & delegation |
| write       | `.opencode/agent/write.md`       | Documentation creation          |

### Documentation

| Document           | Location                                               | Purpose            |
| ------------------ | ------------------------------------------------------ | ------------------ |
| Agent System Guide | `.opencode/install_guides/SET-UP - Opencode Agents.md` | Setup and usage    |
| AGENTS.md          | `AGENTS.md`                                            | AI behavior config |