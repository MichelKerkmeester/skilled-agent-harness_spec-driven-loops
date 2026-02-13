---
name: goop-map-codebase
description: Map an existing codebase for brownfield projects - understand architecture, stack, and conventions
tools:
  read: true
  write: true
  bash: true
  task: true
  glob: true
  grep: true
---

<objective>
Map an existing codebase for brownfield projects.

Analyzes codebase with parallel Explore agents. Creates `.goopspec/codebase/` with 7 focused documents covering stack, architecture, structure, conventions, testing, integrations, and concerns.

Use before `/goop-setup` on existing codebases. Provides the context needed to extend rather than replace.

**Creates:**
- `.goopspec/codebase/STACK.md` - Technology stack
- `.goopspec/codebase/ARCHITECTURE.md` - Architecture overview
- `.goopspec/codebase/STRUCTURE.md` - Directory structure
- `.goopspec/codebase/CONVENTIONS.md` - Code conventions
- `.goopspec/codebase/TESTING.md` - Testing approach
- `.goopspec/codebase/INTEGRATIONS.md` - External integrations
- `.goopspec/codebase/CONCERNS.md` - Known issues and tech debt
</objective>

<execution_context>
@/home/james/Documents/opencode-goopspec/templates/codebase/stack.md
@/home/james/Documents/opencode-goopspec/templates/codebase/architecture.md
@/home/james/Documents/opencode-goopspec/templates/codebase/conventions.md
</execution_context>

<process>
## Phase 1: Setup

1. **Check for existing codebase map**
   ```bash
   [ -d .goopspec/codebase ] && echo "Codebase map already exists"
   ```

2. **Initialize .goopspec if needed**
   ```bash
   mkdir -p .goopspec/codebase
   ```

3. **Detect project type**
   ```bash
   # Check for common project indicators
   [ -f package.json ] && echo "Node.js project"
   [ -f requirements.txt ] && echo "Python project"
   [ -f Cargo.toml ] && echo "Rust project"
   [ -f go.mod ] && echo "Go project"
   [ -f pom.xml ] && echo "Java/Maven project"
   [ -f build.gradle ] && echo "Java/Gradle project"
   ls -la
   ```

## Phase 2: Parallel Exploration

Spawn 7 parallel explore agents via `task` tool:

### Explorer 1: Stack Detection
```
Analyze the technology stack of this codebase.
- Programming languages
- Frameworks and libraries
- Build tools
- Database
- Testing frameworks
- Dev tools (linting, formatting, etc.)

Create .goopspec/codebase/STACK.md
```

### Explorer 2: Architecture Analysis
```
Analyze the architecture of this codebase.
- Overall pattern (MVC, layered, hexagonal, etc.)
- Component relationships
- Data flow
- Key abstractions
- Design patterns used

Create .goopspec/codebase/ARCHITECTURE.md
```

### Explorer 3: Structure Mapping
```
Map the directory and file structure.
- Top-level organization
- Module/package boundaries
- Where different types of code live
- Configuration locations
- Asset locations

Create .goopspec/codebase/STRUCTURE.md
```

### Explorer 4: Conventions Discovery
```
Identify code conventions and patterns.
- Naming conventions
- File organization
- Code style
- Import patterns
- Error handling patterns
- Documentation style

Create .goopspec/codebase/CONVENTIONS.md
```

### Explorer 5: Testing Analysis
```
Analyze the testing approach.
- Testing frameworks used
- Test organization
- Coverage patterns
- Test types (unit, integration, e2e)
- Testing gaps

Create .goopspec/codebase/TESTING.md
```

### Explorer 6: Integrations Inventory
```
Identify external integrations.
- APIs consumed
- Services used
- Third-party dependencies
- Environment requirements
- Secrets/configuration needed

Create .goopspec/codebase/INTEGRATIONS.md
```

### Explorer 7: Concerns & Debt
```
Identify issues, concerns, and tech debt.
- Code smells
- Security concerns
- Performance issues
- Outdated dependencies
- Known bugs or limitations
- Areas needing attention

Create .goopspec/codebase/CONCERNS.md
```

Wait for all explorers to complete.

## Phase 3: Synthesize Findings

Collect and organize findings from all 7 explorers:

1. Check for conflicts between explorers
2. Identify the most critical insights
3. Summarize for quick reference
4. Flag areas needing clarification

## Phase 4: Write Codebase Documents

### STACK.md
```markdown
# Technology Stack

**Analyzed:** [Date]
**Project Type:** [Detected type]

## Languages
- [Language] [version] - [Primary use]

## Frameworks & Libraries
### Core
- [Framework] [version] - [Purpose]

### Supporting
- [Library] [version] - [Purpose]

## Build & Dev Tools
- [Tool] - [Purpose]

## Database
- [Database] [version] - [Usage pattern]

## Testing
- [Framework] - [Test types]

## Key Dependencies
```json
{
  "critical": ["dep1", "dep2"],
  "utility": ["dep3", "dep4"]
}
```

## Version Info
- Node/Python/Rust/etc: [version]
- Package manager: [npm/pip/cargo/etc]
```

### ARCHITECTURE.md
```markdown
# Architecture Overview

**Pattern:** [MVC/Layered/Hexagonal/etc]
**Complexity:** [Simple/Moderate/Complex]

## High-Level Structure

[Diagram or description of major components]

## Component Relationships

### [Component A]
- **Responsibility:** [What it does]
- **Depends on:** [Other components]
- **Used by:** [Other components]

### [Component B]
- **Responsibility:** [What it does]
- **Depends on:** [Other components]
- **Used by:** [Other components]

## Data Flow

[Description of how data moves through the system]

## Key Abstractions

1. **[Abstraction]** - [Purpose and usage]
2. **[Abstraction]** - [Purpose and usage]

## Design Patterns

- **[Pattern]** - [Where used and why]

## Entry Points

- [Entry 1] - [Purpose]
- [Entry 2] - [Purpose]
```

### STRUCTURE.md
```markdown
# Directory Structure

```
project/
├── [dir]/          # [Purpose]
│   ├── [subdir]/   # [Purpose]
│   └── ...
├── [dir]/          # [Purpose]
└── ...
```

## Directory Purposes

### /[directory]
- **Contains:** [What lives here]
- **Convention:** [How files organized]
- **Examples:** [Key files]

## File Organization Patterns

- [Pattern 1]
- [Pattern 2]

## Configuration Locations

- [Config 1] - [Purpose]
- [Config 2] - [Purpose]
```

### CONVENTIONS.md
```markdown
# Code Conventions

## Naming
- **Variables:** [convention]
- **Functions:** [convention]
- **Classes:** [convention]
- **Files:** [convention]

## Code Style
- **Indentation:** [spaces/tabs, count]
- **Line length:** [max]
- **Quotes:** [single/double]
- **Semicolons:** [required/optional]

## Organization
- **Imports:** [order and style]
- **Exports:** [pattern]
- **File length:** [typical max]

## Patterns
- **Error handling:** [pattern]
- **Async:** [pattern - callbacks/promises/async-await]
- **Null checking:** [pattern]
- **Comments:** [style and when used]

## Documentation
- **Required:** [what must be documented]
- **Style:** [JSDoc/TSDoc/etc]

## Anti-Patterns Present
- [Anti-pattern] - [Where found]
```

### TESTING.md
```markdown
# Testing Approach

## Frameworks
- **[Framework]** - [Unit/Integration/E2E]

## Test Organization
- **Location:** [Where tests live]
- **Naming:** [Test file naming]
- **Structure:** [Describe/It blocks, etc.]

## Coverage
- **Current:** [Estimated % or "unknown"]
- **Gaps:** [Areas lacking tests]

## Test Types
- **Unit:** [What gets unit tested]
- **Integration:** [What gets integration tested]
- **E2E:** [What gets E2E tested]

## Running Tests
```bash
[Command to run tests]
```

## Testing Gaps
- [Gap 1] - [Impact]
- [Gap 2] - [Impact]
```

### INTEGRATIONS.md
```markdown
# External Integrations

## APIs Consumed

### [API Name]
- **Endpoint:** [URL]
- **Auth:** [Method]
- **Usage:** [How used in codebase]
- **Env vars:** [Required variables]

## Services

### [Service Name]
- **Type:** [Database/Cache/Queue/etc]
- **Provider:** [AWS/Railway/etc]
- **Connection:** [How connected]

## Third-Party Libraries

### Critical
- [Library] - [Purpose] - [Version constraint]

### Nice-to-Have
- [Library] - [Purpose]

## Environment Requirements

### Required Variables
```
VARIABLE_NAME=[description]
```

### Optional Variables
```
OPTIONAL_VAR=[description]
```

## Secrets Management
- **Approach:** [How secrets handled]
- **Location:** [Where stored]
```

### CONCERNS.md
```markdown
# Known Issues & Concerns

## Code Smells

### [Concern 1]
- **Location:** [Files affected]
- **Issue:** [Description]
- **Impact:** [Severity]
- **Recommendation:** [What to do]

## Security Concerns

### [Security Issue]
- **Risk:** [Description]
- **Severity:** [Critical/High/Medium/Low]
- **Mitigation:** [If any]

## Performance Issues

### [Performance Issue]
- **Symptom:** [What happens]
- **Cause:** [Root cause]
- **Impact:** [How bad]

## Outdated Dependencies

- **[Dependency]** [current] -> [latest] - [Risk level]

## Tech Debt

### [Debt Item]
- **Description:** [What needs refactoring]
- **Effort:** [Estimated]
- **Priority:** [When to address]

## Recommended Priorities

1. **[Priority 1]** - [Why urgent]
2. **[Priority 2]** - [Why important]
```

## Phase 5: Update State

Update `.goopspec/state.json`:
- Mark codebase as mapped
- Add timestamp
- Link to codebase docs

## Phase 6: Offer Next Steps

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  GOOPSPEC > CODEBASE MAPPED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Codebase Analysis Complete**

7 explorers analyzed your codebase:
- Stack identified
- Architecture mapped
- Structure documented
- Conventions discovered
- Testing analyzed
- Integrations inventoried
- Concerns flagged

Created in .goopspec/codebase/:
- STACK.md
- ARCHITECTURE.md
- STRUCTURE.md
- CONVENTIONS.md
- TESTING.md
- INTEGRATIONS.md
- CONCERNS.md

───────────────────────────────────────────────────────────────

## Next Up

**Initialize GoopSpec project** with brownfield context

/goop-setup

<sub>Will use codebase map to understand existing code</sub>

───────────────────────────────────────────────────────────────

**Also available:**
- cat .goopspec/codebase/CONCERNS.md - Review issues first
- cat .goopspec/codebase/ARCHITECTURE.md - Understand structure

───────────────────────────────────────────────────────────────
```
</process>

<notes>
**When to map codebase:**
- Joining an existing project
- Before extending unfamiliar code
- When inheriting a codebase
- Before major refactoring

**What to do with concerns:**
- Review CONCERNS.md before planning
- Address critical security issues first
- Factor tech debt into phase planning
- Use as context for estimates

**Updating the map:**
- Re-run `/goop-map-codebase` periodically
- Update after major refactors
- Keep as living documentation
</notes>
