# SET-UP - Skill Creation

> Create AI agent skills with native OpenCode discovery. Complete workflow from concept to deployment.

**Part of OpenCode Installation** - See [Master Installation Guide](./README.md) for complete setup.

---

## TABLE OF CONTENTS

- [0. 🤖 AI INSTALL GUIDE](#0--ai-install-guide)
- [1. 🚀 QUICK START](#1--quick-start)
- [2. 📋 PREREQUISITES](#2--prerequisites)
- [3. 🔄 THE 6-STEP WORKFLOW](#3--the-6-step-workflow)
- [4. 📝 SKILL.MD REFERENCE](#4--skillmd-reference)
- [5. 📦 BUNDLED RESOURCES](#5--bundled-resources)
- [6. ✅ VALIDATION AND TESTING](#6--validation-and-testing)
- [7. 💡 EXAMPLES](#7--examples)
- [8. 🛠️ TROUBLESHOOTING](#8--troubleshooting)
- [9. 🔧 DISCOVERY MECHANICS](#9--discovery-mechanics)
- [10. 📚 RESOURCES](#10--resources)
- [11. ✅ FINAL CHECKLIST](#11--final-checklist)

---

## 0. 🤖 AI INSTALL GUIDE

### ⛔ HARD BLOCK: Write Agent Required

> **⚠️ CRITICAL:** Skill creation REQUIRES the `@write` agent to be active.

**Why @write is mandatory:**
- Loads `skill_md_template.md` BEFORE creating (template-first workflow)
- Validates template alignment AFTER creating
- Runs DQI scoring (target: 90+ Excellent)
- Invokes `workflows-documentation` skill for standards
- Ensures proper use of `init_skill.py` and `package_skill.py`

**Verification (MUST pass before proceeding):**
- [ ] Write agent exists: `ls .opencode/agent/write.md`
- [ ] Use `@write` prefix when invoking the prompt below

**❌ DO NOT** create skills without the @write agent — manual creation bypasses quality gates and template alignment.

**Reference:** `.opencode/agent/write.md` → Section 4 (Mode 2: Skill Creation)

---

**Copy and paste this prompt for interactive skill creation:**

```text
@write I want to create a new skill for OpenCode. Please guide me through the process interactively by asking me questions one at a time.

**PREREQUISITE CHECK (you MUST verify before proceeding):**
- [ ] You are operating as the @write agent (Mode 2: Skill Creation)
- [ ] workflows-documentation skill is accessible

⚠️ If you are NOT the @write agent: STOP immediately and instruct the user to restart with the "@write" prefix. Do NOT proceed with skill creation.

**Questions to ask me (one at a time, wait for my answer):**

1. **Purpose**: What is the skill's purpose? What problem does it solve?

2. **Use Cases**: Give me 2-3 concrete examples of when this skill would be triggered.
   (e.g., "When user asks to create documentation", "When user needs to debug browser issues")

3. **Required Tools**: What tools will the skill need access to?
   - Read (examine files)
   - Write (create files)
   - Edit (modify files)
   - Bash (run commands)
   - Glob (find files)
   - Grep (search content)
   - Task (delegate to agents)
   - WebFetch (fetch URLs)

4. **Bundled Resources**: Will the skill need bundled resources?
   - scripts/ (Python/bash automation)
   - references/ (detailed documentation)
   - assets/ (templates, examples)

5. **Skill Name**: What should we name this skill?
   (Format: lowercase-hyphenated, e.g., "my-custom-skill")

**After gathering my answers, please:**

1. Run: `python .opencode/skill/workflows-documentation/scripts/init_skill.py <skill-name> --path .opencode/skill`
2. Help me populate the SKILL.md template with my answers
3. Guide me through creating any bundled resources
4. Run: `python .opencode/skill/workflows-documentation/scripts/package_skill.py .opencode/skill/<skill-name>` to validate
5. Help me test the skill with a real example
6. Iterate and refine based on testing

My project is at: [your project path]
```

**What the AI will do:**
- Ask questions one at a time to understand your skill requirements
- Scaffold the structure using init_skill.py
- Generate SKILL.md based on your answers
- Guide you through adding scripts, references, or assets
- Validate with package_skill.py
- Help you test with real examples

**Expected creation time:** 20-30 minutes

---

## 1. 🚀 QUICK START

**Time estimate: 20-30 minutes**

```bash
# Step 1: Initialize skill structure (~2 min)
python .opencode/skill/workflows-documentation/scripts/init_skill.py my-skill --path .opencode/skill

# Step 2: Edit SKILL.md with your content (~15 min)
# Required: name (must match folder), description
# Recommended: allowed-tools, version
# Required sections: WHEN TO USE, HOW IT WORKS (or HOW TO USE), RULES

# Step 3: Add bundled resources as needed (~5 min)
# scripts/ → automation, references/ → documentation, assets/ → templates

# Step 4: Validate (~1 min)
python .opencode/skill/workflows-documentation/scripts/package_skill.py .opencode/skill/my-skill --check

# Step 5: Package (~1 min)
python .opencode/skill/workflows-documentation/scripts/package_skill.py .opencode/skill/my-skill

# Step 6: Test - restart OpenCode, skill appears as skills_my_skill
```

**Result:** Skill auto-discovered by OpenCode v1.0.190+ as `skills_my_skill()` function.

---

## 2. 📋 PREREQUISITES

### Required Software

| Software                      | Version   | Verification Command                          |
| ----------------------------- | --------- | --------------------------------------------- |
| Python                        | 3.10+     | `python3 --version`                           |
| workflows-documentation skill | Latest    | `ls .opencode/skill/workflows-documentation/` |
| OpenCode                      | v1.0.190+ | Native skill discovery built-in               |
| **@write agent**              | -         | `ls .opencode/agent/write.md`                 |

### Required Files

| File                          | Purpose                        |
| ----------------------------- | ------------------------------ |
| `scripts/init_skill.py`       | Initialize new skill structure |
| `scripts/package_skill.py`    | Validate and package skill     |
| `assets/skill_md_template.md` | SKILL.md template              |

### Validation: `phase_1_complete`

```bash
python3 --version && \
ls .opencode/skill/workflows-documentation/scripts/init_skill.py && \
ls .opencode/agent/write.md && \
echo "Prerequisites OK (including @write agent)"
```

**Checklist:**
- [ ] Python 3.10+ installed?
- [ ] workflows-documentation skill exists?
- [ ] init_skill.py and package_skill.py accessible?
- [ ] **@write agent exists (.opencode/agent/write.md)?**

❌ **STOP if validation fails** - Install prerequisites before creating skills.

---

## 3. 🔄 THE 6-STEP WORKFLOW

### Workflow Overview

```text
[PREREQUISITE: Invoke with @write agent - see HARD BLOCK in Section 0]
            ↓
Step 1: UNDERSTANDING (~5 min)
    └─► Define purpose, use cases, trigger conditions
            ↓
Step 2: PLANNING (~5 min)
    └─► Identify resources: scripts, references, assets
            ↓
Step 3: INITIALIZING (~2 min)
    └─► Run init_skill.py to scaffold structure
            ↓
Step 4: EDITING (~10-15 min)
    └─► Populate SKILL.md and bundled resources
            ↓
Step 5: PACKAGING (~2 min)
    └─► Validate with package_skill.py
            ↓
Step 6: ITERATING (ongoing)
    └─► Test, refine, re-validate
```

---

### Step 1: Understanding (~5 min)

**Goal:** Define the skill's purpose with concrete examples.

**Questions to answer:**

| Question                                      | Purpose              |
| --------------------------------------------- | -------------------- |
| What problem does this skill solve?           | Core value           |
| When would an AI agent need this?             | Trigger conditions   |
| What are 2-3 specific use cases?              | Grounds in reality   |
| What distinguishes this from existing skills? | Prevents duplication |

**Example:**
```markdown
Purpose: Help users create ASCII flowcharts for documentation

Use Cases:
1. "Create a flowchart for user authentication flow"
2. "Visualize this decision tree as ASCII art"
3. "Draw the data flow diagram for the payment system"

Triggers: "flowchart", "diagram", "visualize", "ASCII art"
```

---

### Step 2: Planning (~5 min)

**Goal:** Identify what resources the skill needs.

**Resource Decision Matrix:**

| Need       | Resource Type | When to Include                           |
| ---------- | ------------- | ----------------------------------------- |
| Automation | `scripts/`    | Repetitive tasks, validation, scaffolding |
| Deep docs  | `references/` | Content > 500 words, API details          |
| Templates  | `assets/`     | Reusable patterns, examples               |
| Data files | `assets/`     | Static data, configurations               |

**Planning Checklist:**
- [ ] Does the skill need automation scripts?
- [ ] Does the skill need detailed documentation?
- [ ] Does the skill need templates or examples?
- [ ] What tools will the skill use? (Read, Write, Edit, Bash, Glob, Grep, Task, WebFetch)

---

### Step 3: Initializing (~2 min)

**Goal:** Scaffold the skill structure.

**Command:**
```bash
python .opencode/skill/workflows-documentation/scripts/init_skill.py <skill-name> --path .opencode/skill
```

**Example:**
```bash
python .opencode/skill/workflows-documentation/scripts/init_skill.py my-flowchart-skill --path .opencode/skill
```

**Expected Output:**
```text
Creating skill: my-flowchart-skill
Location: .opencode/skill/my-flowchart-skill/

Created:
  ✓ SKILL.md (template)
  ✓ references/ (directory)
  ✓ scripts/ (directory)
  ✓ assets/ (directory)
```

**Resulting Structure:**
```text
.opencode/skill/my-flowchart-skill/
├── SKILL.md          # Main orchestrator (template)
├── references/       # Detailed documentation
├── scripts/          # Automation scripts
└── assets/           # Templates and examples
```

---

### Step 4: Editing (~10-15 min)

**Goal:** Populate the templates with skill-specific content.

**Edit Order:**
1. **SKILL.md** - Main orchestrator (required)
2. **scripts/** - Automation if needed
3. **references/** - Deep documentation if needed
4. **assets/** - Templates and examples if needed

**SKILL.md Editing Checklist:**

**Frontmatter (Required):**
- [ ] `name` - hyphen-case, matches folder name exactly
- [ ] `description` - single-line, no `<>` characters

**Frontmatter (Recommended):**
- [ ] `allowed-tools` - array format `[Read, Write, Edit]`
- [ ] `version` - semantic versioning

**Required Sections:**
- [ ] WHEN TO USE - trigger conditions and use cases
- [ ] HOW IT WORKS or HOW TO USE - step-by-step execution patterns
- [ ] RULES with subsections: ✅ ALWAYS, ❌ NEVER, ⚠️ ESCALATE IF

**Recommended Sections:**
- [ ] SMART ROUTING - resource router tables
- [ ] SUCCESS CRITERIA - completion checklists
- [ ] INTEGRATION POINTS - related skills

See [Section 4: SKILL.md Reference](#4--skillmd-reference) for the canonical template.

---

### Step 5: Packaging (~2 min)

**Goal:** Validate the skill meets all requirements.

**Quick Validation (check mode):**
```bash
python .opencode/skill/workflows-documentation/scripts/package_skill.py .opencode/skill/my-skill --check
```

**Full Packaging:**
```bash
python .opencode/skill/workflows-documentation/scripts/package_skill.py .opencode/skill/my-skill
```

**Expected Output (Success):**
```text
Validating skill: my-skill

Checks:
  ✓ YAML frontmatter valid
  ✓ Required fields present (name, description)
  ✓ Name matches folder (hyphen-case)
  ✓ Description is single-line, no <> characters
  ✓ Required sections present (WHEN TO USE, HOW IT WORKS/HOW TO USE, RULES)
  ✓ RULES section has ALWAYS/NEVER/ESCALATE subsections
  ✓ Word count under 5k (current: 2,341)

Validation: PASSED
DQI Score: 82/100 (Good)
```

**Expected Output (Failure):**
```text
Validating skill: my-skill

Checks:
  ✓ YAML frontmatter valid
  ✗ Name not hyphen-case or doesn't match folder
  ✗ Missing required section: HOW IT WORKS

Validation: FAILED
Fix the errors above and re-run validation.
```

---

### Step 6: Iterating (ongoing)

**Goal:** Test the skill with real use cases and refine.

**Testing Process:**

1. **Restart OpenCode** - Required for discovery rescan
2. **Verify skill appears** - Check for `skills_my_skill` in available tools
3. **Try each use case** - Test with real requests
4. **Document issues** - What was unclear? What was missing?
5. **Refine and re-validate** - Fix issues and run package_skill.py again

**Iteration Checklist:**
- [ ] Skill invokes correctly (native discovery or Read tool)
- [ ] Skill triggers on expected keywords
- [ ] Instructions are clear and actionable
- [ ] Scripts execute without errors
- [ ] Resources are accessible and helpful
- [ ] Use cases produce expected results

---

## 4. 📝 SKILL.MD REFERENCE

> **CRITICAL:** The `name` field in frontmatter **MUST match the folder name exactly** (case-sensitive, hyphen-case). This is the #1 cause of discovery failures.

### Canonical Template

```yaml
---
name: my-skill-name
description: "Brief description without special characters. Use when X. Provides Y."
version: 1.0.0
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
---

# Skill Title - Clear Purpose Statement

Brief overview paragraph explaining what this skill does and why it exists.

---

## WHEN TO USE

Trigger conditions and use cases:
- "User asks for X..."
- "When task involves Y..."
- Keywords: term1, term2, term3

---

## HOW IT WORKS

Step-by-step execution patterns:

1. First step
2. Second step
3. Third step

---

## RULES

### ✅ ALWAYS
- Rule 1
- Rule 2

### ❌ NEVER
- Rule 1
- Rule 2

### ⚠️ ESCALATE IF
- Condition 1
- Condition 2

---

## SMART ROUTING

| Resource | Path                              | Purpose       |
| -------- | --------------------------------- | ------------- |
| Guide    | [guide.md](./references/guide.md) | Detailed docs |
| Script   | `scripts/main.py`                 | Automation    |

---

## SUCCESS CRITERIA

- [ ] Criterion 1
- [ ] Criterion 2
```

### Frontmatter Field Reference

| Field           | Required    | Format        | Notes                                                      |
| --------------- | ----------- | ------------- | ---------------------------------------------------------- |
| `name`          | **Yes**     | `hyphen-case` | **Must match folder name exactly**                         |
| `description`   | **Yes**     | Single line   | No `<>` characters, no multi-line                          |
| `allowed-tools` | Recommended | Array         | Valid: Read, Write, Edit, Bash, Glob, Grep, Task, WebFetch |
| `version`       | Recommended | Semver        | e.g., `1.0.0`, `2.1.3`                                     |
| `triggers`      | Optional    | Array         | Keywords that activate the skill                           |

### Section Requirements

**Required Sections (must have):**

| Section                    | Required Content                                          |
| -------------------------- | --------------------------------------------------------- |
| WHEN TO USE                | Trigger conditions and use cases                          |
| HOW IT WORKS or HOW TO USE | Step-by-step execution patterns (either heading accepted) |
| RULES                      | Must have ✅ ALWAYS, ❌ NEVER, ⚠️ ESCALATE IF subsections    |

**Recommended Sections:**

| Section            | Purpose                                      |
| ------------------ | -------------------------------------------- |
| SMART ROUTING      | Resource router tables and file references   |
| SUCCESS CRITERIA   | Completion checklists and verification steps |
| INTEGRATION POINTS | Related skills and tools                     |

### Size Constraints

| Location       | Limit           | Recommendation                 |
| -------------- | --------------- | ------------------------------ |
| Description    | Single line     | Keep concise for skill routing |
| SKILL.md total | Max 5,000 words | 3,000 words recommended        |
| Line count     | Max 3,000 lines | Move excess to references/     |

---

## 5. 📦 BUNDLED RESOURCES

### When to Create Each Type

| Type            | Create When                                                      | Examples                    |
| --------------- | ---------------------------------------------------------------- | --------------------------- |
| **scripts/**    | Same code rewritten repeatedly, deterministic reliability needed | `validate.py`, `init.sh`    |
| **references/** | Documentation > 500 words, API specs, detailed guides            | `workflow.md`, `api.md`     |
| **assets/**     | Templates for output, reusable patterns, examples                | `template.md`, `example.md` |

### scripts/

**Purpose:** Automation scripts for repetitive or complex tasks.

**Naming:** snake_case, extensions `.py`, `.sh`, `.bash`, `.js`

**Python Script Template:**
```python
#!/usr/bin/env python3
"""Brief description of what this script does.

Usage:
    python script_name.py <arg1> [--option]
"""

import argparse

def main():
    parser = argparse.ArgumentParser(description="Script description")
    parser.add_argument("input", help="Input description")
    args = parser.parse_args()
    
    # Implementation
    print(f"Processing: {args.input}")

if __name__ == "__main__":
    main()
```

### references/

**Purpose:** Detailed documentation that doesn't fit in SKILL.md.

**Naming:** snake_case, only `.md` files

**Best Practices:**
- If content exceeds 500 words, move to references/
- Include grep search patterns in SKILL.md for large files
- Avoid duplication between SKILL.md and references

### assets/

**Purpose:** Templates, examples, and data files used in output.

**Naming:** snake_case

**Best Practices:**
- Use `[PLACEHOLDER]` format for replaceable content
- Include usage instructions in template files
- Organize complex assets in subdirectories

### Referencing Resources in SKILL.md

```markdown
## SMART ROUTING

| Resource       | Path                                | Purpose            |
| -------------- | ----------------------------------- | ------------------ |
| Detailed Guide | [guide.md](./references/guide.md)   | Full documentation |
| Template       | [template.md](./assets/template.md) | Starting point     |
| Script         | `scripts/main.py`                   | Automation         |
```

---

## 6. ✅ VALIDATION AND TESTING

### Validation Commands

| Command                    | Purpose                     | When to Use         |
| -------------------------- | --------------------------- | ------------------- |
| `package_skill.py --check` | Validation only             | During development  |
| `package_skill.py`         | Full validation + packaging | Before distribution |
| `extract_structure.py`     | DQI scoring                 | Quality assessment  |

### DQI Score Interpretation

| Score  | Rating    | Action                      |
| ------ | --------- | --------------------------- |
| 90-100 | Excellent | Production ready            |
| 75-89  | Good      | Minor improvements          |
| 60-74  | Fair      | Needs work                  |
| <60    | Poor      | Significant revision needed |

**Target: DQI >= 75 (Good)**

### Test Matrix

| Test                 | Command/Action               | Expected Result                      |
| -------------------- | ---------------------------- | ------------------------------------ |
| Frontmatter valid    | `head -10 SKILL.md`          | Valid YAML with `---` delimiters     |
| Name matches folder  | `grep "^name:" SKILL.md`     | Matches folder name exactly          |
| Skill discoverable   | Restart OpenCode             | `skills_my_skill` in available tools |
| Triggers correctly   | Request matching description | Skill invokes                        |
| Resources accessible | Follow SMART ROUTING links   | All paths resolve                    |

### Complete Validation Checklist

**YAML Frontmatter:**
- [ ] `---` delimiters present at start and end
- [ ] `name` is hyphen-case and matches folder name
- [ ] `description` is single-line, no `<>` characters
- [ ] `allowed-tools` is valid array format
- [ ] `version` follows semantic versioning

**Required Sections:**
- [ ] WHEN TO USE present
- [ ] HOW IT WORKS present
- [ ] RULES present with ALWAYS/NEVER/ESCALATE IF subsections

**Resources:**
- [ ] All referenced files exist
- [ ] Relative paths are correct
- [ ] Scripts are executable

❌ **STOP if validation fails** - Fix errors before proceeding to testing.

---

## 7. 💡 EXAMPLES

### Example 1: Minimal Skill (Complete)

A simple skill with no bundled resources:

```text
.opencode/skill/greeting-formatter/
└── SKILL.md
```

**SKILL.md:**
```yaml
---
name: greeting-formatter
description: "Format greetings for different contexts. Use when creating welcome messages, email salutations, or chat introductions."
allowed-tools: [Read, Write, Edit]
version: 1.0.0
---

# Greeting Formatter - Context-Aware Salutations

Format greetings appropriately for emails, chat, formal documents, and casual conversations.

---

## WHEN TO USE

- "Write a greeting for..."
- "How should I start this email..."
- "Create a welcome message..."

Keywords: greeting, salutation, welcome, email opening

---

## HOW IT WORKS

1. Identify the context (email, chat, formal, casual)
2. Determine the audience (colleague, client, friend)
3. Select appropriate formality level
4. Generate greeting with proper formatting

---

## RULES

### ✅ ALWAYS
- Match formality to context
- Use appropriate cultural conventions

### ❌ NEVER
- Mix formal and casual in same greeting
- Use gendered assumptions without context

### ⚠️ ESCALATE IF
- Unsure about cultural appropriateness
- Multiple conflicting contexts

---

## SUCCESS CRITERIA

- [ ] Greeting matches requested context
- [ ] Tone is appropriate for audience
```

### Production Examples

For comprehensive real-world examples, examine these production skills:

| Skill               | Path                                       | Highlights                                                                       |
| ------------------- | ------------------------------------------ | -------------------------------------------------------------------------------- |
| **mcp-narsil**      | `.opencode/skill/mcp-narsil/SKILL.md`      | Native MCP tool integration, semantic + structural search, SMART ROUTING         |
| **system-spec-kit** | `.opencode/skill/system-spec-kit/SKILL.md` | Complex skill with multiple references, checkpoint system, context preservation  |

**To examine:**
```bash
cat .opencode/skill/mcp-narsil/SKILL.md | head -100
cat .opencode/skill/system-spec-kit/SKILL.md | head -100
```

---

## 8. 🛠️ TROUBLESHOOTING

### Common Errors and Fixes

**"Skill not found" / Not appearing in tools**

| Cause                      | Fix                                                               |
| -------------------------- | ----------------------------------------------------------------- |
| Name doesn't match folder  | Ensure `name:` field exactly matches folder name (case-sensitive) |
| Invalid YAML frontmatter   | Check `---` delimiters, use spaces not tabs                       |
| OpenCode not restarted     | Restart OpenCode to trigger discovery scan                        |
| Description has `<>` chars | Remove angle brackets from description                            |

**Verification:**
```bash
# Check frontmatter
head -10 .opencode/skill/my-skill/SKILL.md

# Get folder name
ls -d .opencode/skill/my-skill

# Get frontmatter name
grep "^name:" .opencode/skill/my-skill/SKILL.md
```

---

**"YAML frontmatter invalid"**

| Cause                       | Fix                                        |
| --------------------------- | ------------------------------------------ |
| Missing `---` delimiters    | Add `---` at start and after frontmatter   |
| Tabs instead of spaces      | YAML requires spaces for indentation       |
| Unquoted special characters | Quote strings with colons or special chars |

**Invalid:**
```yaml
---
name: my-skill
description: Use when "things" happen  # Unquoted inner quotes
---
```

**Valid:**
```yaml
---
name: my-skill
description: "Use when things happen. Provides X."
---
```

---

**"Missing required section"**

| Section                    | Required Content                                 |
| -------------------------- | ------------------------------------------------ |
| WHEN TO USE                | Trigger conditions                               |
| HOW IT WORKS or HOW TO USE | Step-by-step execution (either heading accepted) |
| RULES                      | Must have ✅ ALWAYS, ❌ NEVER, ⚠️ ESCALATE IF       |

❌ **STOP** - Add all required sections before re-validating.

---

**"Description invalid"**

| Cause                    | Fix                    |
| ------------------------ | ---------------------- |
| Contains `<>` characters | Remove angle brackets  |
| Multi-line format        | Convert to single line |

**Invalid:**
```yaml
description: "Use when <condition> occurs"
description: |
  Multi-line description
```

**Valid:**
```yaml
description: "Use when generating reports. Provides automated analysis."
```

---

**"Skill not triggering"**

| Cause                    | Fix                                   |
| ------------------------ | ------------------------------------- |
| Description too generic  | Add specific keywords and use cases   |
| Missing trigger keywords | Include relevant terms in description |

**Before (generic):**
```yaml
description: "Creates visual representations of processes."
```

**After (specific):**
```yaml
description: "Create ASCII flowcharts and diagrams. Use when visualizing workflows, decision trees, or process flows."
```

---

**"Resource not found"**

| Cause               | Fix                                       |
| ------------------- | ----------------------------------------- |
| Incorrect path      | Use relative paths from SKILL.md location |
| Missing `./` prefix | Add `./` for relative paths               |

**Invalid:**
```markdown
[guide](references/guide.md)
```

**Valid:**
```markdown
[guide](./references/guide.md)
```

---

**"DQI score too low"**

Run diagnostics:
```bash
python .opencode/skill/workflows-documentation/scripts/extract_structure.py \
  .opencode/skill/my-skill/SKILL.md
```

**Common fixes:**
- Add content to thin sections
- Ensure all RULES subsections present
- Add concrete examples
- Fix header formatting

---

## 9. 🔧 DISCOVERY MECHANICS

> This section explains internal mechanics for advanced users. Not required for basic skill creation.

### How Native Discovery Works

OpenCode has built-in skill discovery - **no plugin required**. Skills are auto-discovered from `.opencode/skill/*/SKILL.md` frontmatter.

### Discovery Process

```text
Step 1: STARTUP SCAN
    └─► OpenCode scans .opencode/skill/*/SKILL.md
            ↓
Step 2: FRONTMATTER PARSING
    └─► Extract name, description, allowed-tools from YAML
            ↓
Step 3: FUNCTION REGISTRATION
    └─► Register as skills_<name> function
    └─► Hyphens → underscores (my-skill → skills_my_skill)
            ↓
Step 4: AVAILABILITY
    └─► Skill accessible via:
        - Direct call: skills_my_skill()
        - Read tool: Read(".opencode/skill/my-skill/SKILL.md")
        - Natural language matching description
```

### Discovery Requirements

| Requirement                         | Details                         | Failure Mode                      |
| ----------------------------------- | ------------------------------- | --------------------------------- |
| Valid YAML frontmatter              | Opening and closing `---`       | Skill not found                   |
| `name` field present                | Must match folder name exactly  | Skill not found                   |
| `description` field                 | Single line, no `<>` characters | Parse error                       |
| `allowed-tools` array (recommended) | Bracket format `[Read, Write]`  | Validation warning (non-blocking) |

### Function Naming

```text
Folder: .opencode/skill/mcp-narsil/
    → Function: skills_mcp_narsil()

Folder: .opencode/skill/workflows-code/
    → Function: skills_workflows_code()

Folder: .opencode/skill/system-spec-kit/
    → Function: skills_system_spec_kit()
```

### Quick Verification

```bash
# 1. Check frontmatter is valid
head -10 .opencode/skill/my-skill/SKILL.md

# 2. Restart OpenCode (required for discovery rescan)

# 3. Skill appears as skills_my_skill in available tools
```

---

## 10. 📚 RESOURCES

### File Locations

| Path                                                                  | Purpose              |
| --------------------------------------------------------------------- | -------------------- |
| `.opencode/skill/`                                                    | Skills directory     |
| `.opencode/skill/workflows-documentation/scripts/init_skill.py`       | Initialize skill     |
| `.opencode/skill/workflows-documentation/scripts/package_skill.py`    | Validate and package |
| `.opencode/skill/workflows-documentation/assets/skill_md_template.md` | SKILL.md template    |

### Scripts Reference

```bash
# Initialize new skill
python .opencode/skill/workflows-documentation/scripts/init_skill.py \
  <skill-name> --path .opencode/skill

# Validation only (check mode)
python .opencode/skill/workflows-documentation/scripts/package_skill.py \
  <skill-path> --check

# Full packaging and validation
python .opencode/skill/workflows-documentation/scripts/package_skill.py \
  <skill-path>
```

### Related Guides

| Guide                                          | Purpose                           |
| ---------------------------------------------- | --------------------------------- |
| [SET-UP - AGENTS.md](./SET-UP%20-%20AGENTS.md) | Add skills to agent config        |
| [Master Installation Guide](./README.md)       | OpenCode setup overview           |
| [@write Agent](../../agent/write.md)           | Write agent (Mode 2: Skill Creation) |

### External Resources

| Resource               | URL                             |
| ---------------------- | ------------------------------- |
| OpenCode Documentation | https://opencode.ai/docs        |
| OpenCode Skills Docs   | https://opencode.ai/docs/skills |

---

## 11. ✅ FINAL CHECKLIST

- [ ] **Step 1:** Purpose and use cases defined
- [ ] **Step 2:** Resource plan documented (scripts/references/assets needed)
- [ ] **Step 3:** Skill structure initialized with init_skill.py
- [ ] **Step 4:** SKILL.md populated:
  - [ ] Frontmatter (required): name (matches folder), description (single-line)
  - [ ] Frontmatter (recommended): allowed-tools, version
  - [ ] Required sections: WHEN TO USE, HOW IT WORKS (or HOW TO USE), RULES
  - [ ] RULES subsections: ✅ ALWAYS, ❌ NEVER, ⚠️ ESCALATE IF
- [ ] **Step 5:** Validation passed (package_skill.py --check)
- [ ] **Step 6:** Tested with real use cases
- [ ] **Optional:** DQI score >= 75 (Good)

---

**Skill Creation Complete!**

Your skill is now ready. OpenCode v1.0.190+ will auto-discover it from `.opencode/skill/*/SKILL.md` frontmatter. Skills appear as `skills_*` functions in available tools.