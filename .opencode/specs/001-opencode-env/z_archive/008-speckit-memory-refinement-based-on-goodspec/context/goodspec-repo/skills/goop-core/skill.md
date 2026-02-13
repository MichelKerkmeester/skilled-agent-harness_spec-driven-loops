---
name: goop-core
description: Core GoopSpec 0.1.0 operations - the 5-phase spec-driven workflow
category: core
triggers:
  - goop
  - spec
  - workflow
  - plan
  - execute
version: 0.1.0
---

# GoopSpec 0.1.0 Core Operations

## The 5-Phase Workflow

GoopSpec follows a disciplined spec-driven development cycle:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Phase 1    │     │  Phase 2    │     │  Phase 3    │
│  DISCUSS    │ ──▶ │    PLAN     │ ──▶ │  EXECUTE    │
│ (Gather     │     │ (Create     │     │ (Wave-based │
│  reqs)      │     │  PLAN.md)   │     │  impl)      │
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
                                              ▼
                    ┌─────────────┐     ┌─────────────┐
                    │  Phase 5    │     │  Phase 4    │
                    │  CONFIRM    │ ◀── │   AUDIT     │
                    │ (User       │     │ (Verify     │
                    │  approval)  │     │  against    │
                    └─────────────┘     │  spec)      │
                                        └─────────────┘
```

**Phase 0**: Intent Gate (classify every incoming request)
**Phase 1**: Discuss (gather requirements, clarify scope)
**Phase 2**: Plan (create detailed execution plan)
**Phase 3**: Execute (wave-based implementation)
**Phase 4**: Audit (verify against requirements)
**Phase 5**: Confirm (get user approval)

### Phase 1: Discuss
- Gather requirements through conversation
- Ask clarifying questions
- Identify edge cases and constraints
- Challenge assumptions respectfully
- Output: Clear understanding of what to build

### Phase 2: Plan
- Create detailed PLAN.md with waves and tasks
- Break work into atomic, verifiable tasks
- Identify dependencies between tasks
- Define acceptance criteria for each task
- Output: PLAN.md ready for execution

### Phase 3: Execute
- Wave-based implementation
- Atomic commits per task
- Track progress with checkpoints
- Apply deviation rules (auto-fix vs ask)
- Output: Working code

### Phase 4: Audit
- Verify implementation against requirements
- Check all acceptance criteria are met
- Review code quality and security
- Identify any gaps or issues
- Output: Audit report

### Phase 5: Confirm (ACCEPTANCE GATE)
- Present summary to user
- Get explicit user approval
- Handle change requests if needed
- Archive completed work
- Output: Accepted deliverable

---

## Planning Markdown Files

GoopSpec uses markdown files for state and coordination:

| File | Purpose |
|------|---------|
| `SPEC.md` | Locked specification with must-haves and nice-to-haves |
| `BLUEPRINT.md` | Execution plan with waves and tasks |
| `CHRONICLE.md` | Journey log tracking progress and decisions |
| `RESEARCH.md` | Research findings from exploration phase |
| `RETROSPECTIVE.md` | Post-completion analysis (for milestones) |
| `LEARNINGS.md` | Extracted patterns and insights (archived) |

### Directory Structure

```
.goopspec/
├── SPEC.md              # Current specification
├── BLUEPRINT.md         # Current execution plan
├── CHRONICLE.md         # Current journey log
├── RESEARCH.md          # Current research findings
├── quick/               # Quick task history
│   └── 001-task-name/
│       └── SUMMARY.md
├── milestones/          # Active milestones
│   └── v1.0-feature/
└── archive/             # Completed milestones
    └── v0.9-setup/
        ├── RETROSPECTIVE.md
        └── LEARNINGS.md
```

---

## Task Modes

GoopSpec scales to the task size:

| Mode | When | Workflow |
|------|------|----------|
| **Quick** | Bug fixes, small changes | Plan → Execute → Accept |
| **Standard** | Features, moderate work | Full 5-phase workflow |
| **Comprehensive** | Complex systems | Full workflow + deep research |
| **Milestone** | Major releases | Multiple cycles + archive |

### Quick Mode
- Skip Research and Specify phases
- For tasks under ~30 minutes
- Still uses memory and atomic commits
- Tracked in `.goopspec/quick/`

### Standard Mode
- Full 5-phase workflow
- For features taking hours to a day
- Contract gate at Specify
- Acceptance gate at end

### Comprehensive Mode
- Extended research phase
- Multiple parallel research agents
- Detailed specification
- Multiple execution waves

### Milestone Mode
- Groups related work into versioned milestone
- Archives on completion
- Extracts learnings to memory
- Tags git with version

---

## Task Format

GoopSpec uses markdown for task definitions (not XML):

```markdown
### Task 1.1: [Action-oriented name]

**Files**: path/to/file.ext, other/file.ext
**Action**: [What to do, how, and why]
**Verify**: [Command or check to prove completion]
**Done**: [Measurable acceptance criteria]
```

### Wave Structure

```markdown
## Wave 1: [Theme]

### Task 1.1: [Name]
...

### Task 1.2: [Name]
...

## Wave 2: [Theme]
...
```

---

## Contract Gates

Two mandatory confirmation points:

### Specify Gate (Pre-Execution)
```
"I've captured the requirements in SPEC.md:
- Must have: [list]
- Nice to have: [list]
- Out of scope: [list]

Please confirm this specification before I proceed."
```

User must explicitly confirm before execution begins.

### Accept Gate (Post-Execution)
```
"Implementation complete. Verification against spec:
- [Requirement 1]: ✓ Implemented
- [Requirement 2]: ✓ Implemented

Please confirm acceptance or request changes."
```

User must explicitly accept before marking complete.

---

## Core Principles

### The Continuation Mandate
The agent continues until spec tasks are complete. If todos remain incomplete, enforced task continuation keeps work moving. Checkpoints allow pausing, but completion requires all must-haves delivered.

### Goal-Backward Verification
Don't just complete tasks - verify that the code delivers what was promised. Task completion ≠ Goal achievement. Always trace back to the original intent.

### Vertical Slices Over Horizontal Layers
```
PREFER: Wave 1 = Complete User Feature (model + API + UI)
AVOID:  Wave 1 = All Models, Wave 2 = All APIs, Wave 3 = All UIs
```

### Memory-First Protocol
All agents follow the memory protocol:
1. Search memory for relevant past decisions before starting
2. Save important observations and decisions during work
3. Persist learnings to memory after completion

### Orchestrator as Conductor
The orchestrator NEVER writes code. It coordinates, delegates, and maintains context. All implementation is delegated to specialized subagents.

---

## Deviation Rules

### Rule 1: Auto-fix Bugs
Fix immediately without asking:
- Wrong logic, type errors, infinite loops
- Security vulnerabilities (SQL injection, XSS)
- Broken validation, race conditions
- Memory/resource leaks

### Rule 2: Auto-add Missing Critical Functionality
Add immediately without asking:
- Error handling (try-catch, promise rejection)
- Input validation and sanitization
- Null/undefined checks
- Authentication/authorization checks
- Rate limiting on public APIs

### Rule 3: Auto-fix Blocking Issues
Fix immediately without asking:
- Missing dependencies
- Broken import paths
- Missing environment variables
- Config errors
- Circular dependencies

### Rule 4: Ask About Architectural Changes
STOP and ask user for:
- New database tables (not just columns)
- Schema changes (primary keys, table splits)
- Framework/library switches
- New infrastructure (queues, caches, CDNs)
- Breaking API changes
- New deployment environments

---

## Commands

### Workflow Commands
| Command | Description |
|---------|-------------|
| `/goop-discuss [description]` | Capture user vision, gather requirements |
| `/goop-plan [description]` | Create detailed execution plan |
| `/goop-execute` | Begin wave-based execution |
| `/goop-accept` | Verify and accept completion |

### Task Mode Commands
| Command | Description |
|---------|-------------|
| `/goop-quick [task]` | Fast-track small task |
| `/goop-milestone [name]` | Start versioned milestone |
| `/goop-complete` | Complete and archive milestone |

### Utility Commands
| Command | Description |
|---------|-------------|
| `/goop-status` | Show workflow status |
| `/goop-amend` | Propose spec changes |
| `/goop-recall [query]` | Search persistent memory |
| `/goop-remember [content]` | Save to persistent memory |
| `/goop-pause [name]` | Save checkpoint |
| `/goop-resume [id]` | Resume from checkpoint |

---

## Commit Format

```
type(wave-task): description

- Detail 1
- Detail 2
```

Types: `feat`, `fix`, `test`, `refactor`, `docs`, `perf`, `chore`

Example:
```
feat(w1-t2): implement user authentication API

- Add /auth/login and /auth/logout endpoints
- Integrate JWT token generation
- Add refresh token rotation
```

---

## Status Indicators

| Symbol | Meaning |
|--------|---------|
| `[OK]` | Complete/Passed |
| `[FAIL]` | Failed/Error |
| `[WARN]` | Warning/Attention Required |
| `[INFO]` | Informational |
| `[WORK]` | In Progress |
| `[WAIT]` | Waiting/Blocked |
| `[GATE]` | User Confirmation Required |

---

## Archive System

When a milestone completes:

1. **Move** milestone to `archive/`
2. **Generate** RETROSPECTIVE.md (what worked, what didn't)
3. **Extract** LEARNINGS.md (patterns, decisions, gotchas)
4. **Persist** learnings to memory for future recall
5. **Tag** git with milestone version

### Learning Extraction

Learnings are persisted with semantic concepts for search:

```
memory_save({
  type: "observation",
  title: "Milestone Learning: [name]",
  concepts: ["auth", "jwt", "security"],
  facts: ["jose library better than jsonwebtoken for ESM"],
  importance: 0.8
})
```

### Recall

Use `/goop-recall` to search past work:

```
/goop-recall "how did we handle auth?"
→ Returns relevant learnings from archived milestones
```

---

## Quick Reference

```
WORKFLOW:    Discuss → Plan → Execute → Audit → Confirm
FILES:       PLAN.md, SPEC.md, ADL.md (decisions), checkpoints
MODES:       Quick, Standard, Comprehensive, Milestone
GATES:       Confirm (user approval required)
RULES:       Auto-fix bugs/blocking, Ask for architecture
AGENTS:      Orchestrator coordinates, Subagents execute
MEMORY:      Search before, save during, persist after
```
