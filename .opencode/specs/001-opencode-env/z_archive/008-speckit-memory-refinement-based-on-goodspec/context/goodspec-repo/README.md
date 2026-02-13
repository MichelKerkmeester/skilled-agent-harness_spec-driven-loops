# GoopSpec v0.1.3

<div align="center">

**Spec-Driven Development for AI-Assisted Coding**

*The Orchestrator that turns vague ideas into shipped software*

[![Version](https://img.shields.io/badge/version-0.1.3-blue.svg)](https://github.com/hffmnnj/opencode-goopspec)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-936%20passing-green.svg)](./TEST-SUMMARY.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

</div>

---

## What is GoopSpec?

GoopSpec is a plugin for [OpenCode](https://opencode.ai) that transforms how you work with AI coding assistants. Instead of chaotic back-and-forth, GoopSpec enforces a disciplined **spec-driven workflow** that captures your intent, creates binding specifications, and delivers verified results.

**The Problem:** AI assistants are powerful but unpredictable. They start coding before understanding requirements, miss edge cases, forget context, and deliver work that doesn't match what you actually wanted.

**The Solution:** GoopSpec introduces **interactive questioning**, **contracts**, and **verification gates** that ensure the AI understands what you want before it writes a single line of code.

```
Your Idea → Interactive Plan → Research (Opt-in) → Specify → Execute → Accept
```

---

## Core Philosophy

### "Ask, Don't Assume"
GoopSpec is interactive by default. It interviews you to uncover hidden requirements and ambiguities. If something is unclear, it asks clarifying questions rather than guessing.

### "Spec as Contract"
The specification is a binding agreement. Once locked, both you and the AI know exactly what will be delivered. No scope creep. No surprises.

### "Memory-First"
Every agent searches memory before starting work, saves decisions during work, and persists learnings after. GoopSpec gets smarter with every project you complete.

### "Unified Experience"
A consistent, rich terminal UI (powered by Clack) keeps you informed with clear status indicators, spinners for long tasks, and human-friendly prompts.

### "Scale to the Task"
Quick bug fix? GoopSpec routes to a lightweight path. Major feature? Full 5-phase workflow. The system detects task complexity and adapts.

---

## The Workflow

```
┌─────────────┐     ┌─────────────┐
│    PLAN     │ ◀──▶ │  RESEARCH   │
│ (Interview) │     │  (Opt-in)   │
└─────────────┘     └─────────────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│   SPECIFY   │ ──▶ │   EXECUTE   │ ──▶ │   ACCEPT    │
│ (Contract)  │     │   (Build)   │     │  (Verify)   │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Phase 1: Plan (Interactive)
Capture your intent. GoopSpec acts as a product manager, conducting an interview to:
- Clarify ambiguous requirements
- Identify edge cases
- Suggest technical approaches
- confirm the "Definition of Done"

### Phase 2: Research (Opt-in)
Triggered only when needed or requested. Specialized agents explore:
- **Researcher** - Deep domain knowledge & options
- **Explorer** - Existing codebase patterns
- **Librarian** - Documentation & APIs

### Phase 3: Specify (CONTRACT GATE)
Lock the specification. This is the contract:
- **Must-Haves** - Non-negotiable requirements
- **Out of Scope** - Explicit exclusions
- **You must confirm before execution begins.**

### Phase 4: Execute
Wave-based implementation with atomic commits:
- Tasks grouped into sequential waves
- Real-time progress tracking via Unified UI
- Checkpoints for pausing/resuming

### Phase 5: Accept (ACCEPTANCE GATE)
Verify the implementation:
- Automated tests run
- Security audit performed
- **You must confirm completion**

---

## Quick Start

### Installation

Add `opencode-goopspec` to your OpenCode configuration (`opencode.json` in your project root or `~/.config/opencode/opencode.json`):

```json
{
  "plugins": ["opencode-goopspec"]
}
```

### Build From Source

```bash
# Clone the repository
git clone https://github.com/hffmnnj/opencode-goopspec.git
cd opencode-goopspec

# Install dependencies
bun install

# Build
bun run build
```

Then add the local path to your OpenCode configuration:

```json
{
  "plugins": ["./path/to/opencode-goopspec"]
}
```

### First-Time Setup

```
/goop-setup
```

This wizard configures:
- Model preferences for orchestrator and agents
- MCP server connections
- Memory system settings

### Start Your First Project

```
/goop-plan "Add user authentication with OAuth"
```

GoopSpec will guide you through the entire workflow.

---

## Task Modes

GoopSpec scales to any task size:

| Mode | When to Use | Workflow |
|------|-------------|----------|
| **Quick** | Bug fixes, typos, small tweaks | Plan → Execute → Accept |
| **Standard** | Features, moderate complexity | Full 5-phase workflow |
| **Comprehensive** | System redesigns, major refactors | Extended research + multiple waves |
| **Milestone** | Major releases, multi-feature work | Multiple cycles + archive with learnings |

### Quick Mode Example
```
/goop-quick "Fix the typo in the login button"
```
Skip Research and Specify phases. Ship fast.

### Milestone Mode Example
```
/goop-milestone "v1.0 Authentication System"
```
Groups related work, archives on completion, extracts learnings.

---

## Commands Reference

### Workflow Commands

| Command | Description |
|---------|-------------|
| `/goop-plan [intent]` | Start Plan phase - capture intent and requirements |
| `/goop-research` | Start Research phase - parallel exploration |
| `/goop-specify` | Lock specification (CONTRACT GATE) |
| `/goop-execute` | Start Execute phase - wave-based implementation |
| `/goop-accept` | Verify and accept (ACCEPTANCE GATE) |

### Task Mode Commands

| Command | Description |
|---------|-------------|
| `/goop-quick [task]` | Fast-track small tasks |
| `/goop-milestone [name]` | Start versioned milestone |
| `/goop-complete` | Complete and archive milestone |

### Utility Commands

| Command | Description |
|---------|-------------|
| `/goop-status` | Show comprehensive workflow status |
| `/goop-amend [change]` | Propose spec changes after lock |
| `/goop-pause` | Save checkpoint to pause work |
| `/goop-resume [id]` | Resume from checkpoint |
| `/goop-recall [query]` | Search past work and memory |
| `/goop-debug` | Scientific debugging workflow |
| `/goop-map-codebase` | Analyze existing codebase |

---

## The Orchestrator

The GoopSpec Orchestrator is your primary interface. It's a **conductor**, not a player:

### What It Does
- Coordinates all work through delegation
- Maintains clean context for consistent quality
- Tracks progress via CHRONICLE.md
- Applies deviation rules automatically
- Presents gates for user confirmation

### What It Never Does
- Write implementation code directly
- Make architectural decisions alone
- "Quickly fix" things itself
- Modify files outside spec scope

### Delegation to Specialists

The Orchestrator delegates to 12 specialized agents:

| Agent | Role | Use Case |
|-------|------|----------|
| `goop-executor` | The Builder | Implementation tasks |
| `goop-planner` | The Architect | Creating blueprints |
| `goop-researcher` | The Scholar | Deep domain research |
| `goop-explorer` | The Scout | Fast codebase mapping |
| `goop-librarian` | The Archivist | Documentation lookup |
| `goop-verifier` | The Auditor | Spec compliance checking |
| `goop-debugger` | The Detective | Scientific debugging |
| `goop-designer` | The Artisan | UI/UX design |
| `goop-tester` | The Guardian | Test writing |
| `goop-writer` | The Scribe | Documentation |
| `goop-librarian` | The Archivist | Code/doc search |
| `memory-distiller` | The Curator | Knowledge extraction |

---

## Planning Files

GoopSpec uses markdown files to track state:

| File | Purpose |
|------|---------|
| `SPEC.md` | Locked specification with must-haves |
| `BLUEPRINT.md` | Execution plan with waves and tasks |
| `CHRONICLE.md` | Journey log tracking progress |
| `RESEARCH.md` | Research findings from exploration |
| `RETROSPECTIVE.md` | Post-completion analysis |
| `LEARNINGS.md` | Extracted patterns and insights |

### Directory Structure

```
.goopspec/
├── SPEC.md              # Current specification
├── BLUEPRINT.md         # Current execution plan
├── CHRONICLE.md         # Current journey log
├── RESEARCH.md          # Current research findings
├── config.json          # Project configuration
├── quick/               # Quick task history
│   └── 001-fix-typo/
│       └── SUMMARY.md
├── milestones/          # Active milestones
│   └── v1.0-auth/
└── archive/             # Completed milestones
    └── v0.9-setup/
        ├── RETROSPECTIVE.md
        └── LEARNINGS.md
```

---

## Deviation Rules

GoopSpec uses a 4-rule system for handling unexpected situations:

### Rule 1: Auto-Fix Bugs
Fix immediately without asking:
- Type errors, logic bugs, runtime errors
- Security vulnerabilities (SQL injection, XSS)
- Memory leaks, race conditions

### Rule 2: Auto-Add Critical Functionality
Add immediately without asking:
- Error handling (try-catch, promise rejection)
- Input validation and sanitization
- Authentication/authorization checks

### Rule 3: Auto-Fix Blocking Issues
Fix immediately without asking:
- Missing dependencies
- Broken import paths
- Configuration errors

### Rule 4: Ask About Architectural Changes
**STOP and ask** before:
- Database schema changes
- Framework/library switches
- Breaking API changes
- New infrastructure

All deviations are logged to the Automated Decision Log (ADL).

---

## Memory System

GoopSpec remembers everything important:

### Automatic Capture
- Decisions and their reasoning
- Patterns that worked well
- Gotchas and pitfalls encountered
- User preferences discovered

### Recall
```
/goop-recall "how did we handle auth before?"
```

Returns relevant learnings from past projects.

### Archive-to-Memory Pipeline
When milestones complete:
1. Generate RETROSPECTIVE.md
2. Extract LEARNINGS.md (patterns, decisions, gotchas)
3. Persist learnings to memory with semantic concepts
4. Future projects benefit from past experience

---

## Known Limitations

- Memory system is disabled by default; the worker architecture needs rework for bundled plugins
- Parallel research is planned for v0.2; current implementation does not spawn agents yet

---

## Contract Gates

Two mandatory confirmation points ensure alignment:

### Specify Gate (Pre-Execution)
```
╭─ ⬢ GoopSpec ───────────────────────────────────────╮
│                                                    │
│  🔒 CONTRACT GATE                                  │
│                                                    │
│  MUST HAVES (I commit to delivering):              │
│  • User can log in with email/password             │
│  • Session persists across refresh                 │
│  • Error messages shown on failure                 │
│                                                    │
│  OUT OF SCOPE:                                     │
│  • OAuth integration (future milestone)            │
│                                                    │
│  ─────────────────────────────────────────────     │
│  Type "confirm" to lock the specification.         │
│                                                    │
╰────────────────────────────────────────────────────╯
```

### Accept Gate (Post-Execution)
```
╭─ ⬢ GoopSpec ───────────────────────────────────────╮
│                                                    │
│  ✓ ACCEPTANCE GATE                                 │
│                                                    │
│  VERIFICATION RESULTS:                             │
│  ☑ User can log in - VERIFIED                      │
│     (test: auth.test.ts:15)                        │
│  ☑ Session persists - VERIFIED                     │
│     (test: session.test.ts:42)                     │
│  ☑ Error messages - VERIFIED (manual)              │
│                                                    │
│  Tests: 24/24 passing                              │
│  Build: Successful                                 │
│                                                    │
│  ─────────────────────────────────────────────     │
│  Type "accept" to confirm completion.              │
│                                                    │
╰────────────────────────────────────────────────────╯
```

---

## Use Cases

### 1. Building a New Feature

```
You: "I need to add a notification system to my app"

GoopSpec: "Let me understand what you need..."
         → Asks about notification types, delivery methods, UI
         → Creates SPEC.md with must-haves
         → Researches best practices
         → Presents plan for approval
         → Implements in waves with atomic commits
         → Verifies against spec
         → You confirm completion
```

### 2. Quick Bug Fix

```
/goop-quick "Fix the date formatting bug in the dashboard"
```

Skips research/specify, ships the fix fast, still creates atomic commit.

### 3. Major Refactor

```
/goop-milestone "v2.0 Database Migration"

GoopSpec: Creates milestone tracking
         → Deep research on migration strategies
         → Locked spec with rollback plan
         → Multi-wave execution with checkpoints
         → Comprehensive verification
         → Archives with extracted learnings
```

### 4. Brownfield Project

```
/goop-map-codebase
```

Analyzes existing codebase:
- Stack detection (frameworks, libraries)
- Pattern discovery (conventions, architecture)
- Integration point mapping
- Technical debt identification

### 5. Systematic Debugging

```
/goop-debug "Users are getting logged out randomly"
```

Scientific method approach:
1. Form hypothesis
2. Design experiment
3. Execute test
4. Analyze results
5. Iterate until root cause found

---

## Configuration

### Project Configuration

`.goopspec/config.json`:

```json
{
  "version": "0.1.0",
  "projectName": "my-project",
  "enforcement": "warn",
  "orchestrator": {
    "enableAsDefault": true,
    "model": "anthropic/claude-opus-4-5",
    "thinkingBudget": 32000,
    "phaseGates": "ask",
    "waveExecution": "sequential"
  },
  "memory": {
    "enabled": true,
    "capture": {
      "captureToolUse": true,
      "capturePhaseChanges": true
    }
  },
  "agents": {
    "goop-executor": { "model": "anthropic/claude-sonnet-4-5" },
    "goop-researcher": { "model": "anthropic/claude-sonnet-4-5" }
  }
}
```

### Enforcement Levels

| Level | Behavior |
|-------|----------|
| `assist` | Suggestions only |
| `warn` | Warn on scope violations |
| `strict` | Block modifications outside spec |

---

## Hooks & Tools

### Hooks

| Hook | Purpose |
|------|---------|
| `continuation-enforcer` | Prevents stopping with incomplete todos |
| `comment-checker` | Detects excessive AI comments in code |
| `system-transform` | Injects context into conversations |
| `tool-lifecycle` | Tracks tool usage and modifications |

### Tools

| Tool | Purpose |
|------|---------|
| `goop_status` | Show workflow state, phases, progress |
| `goop_checkpoint` | Save/load/list execution checkpoints |
| `task` | Delegate tasks to specialized subagents |
| `goop_skill` | Load domain knowledge |
| `goop_adl` | Read/append Automated Decision Log |
| `goop_spec` | Read/validate spec and plan files |
| `session_search` | Search past session history |
| `memory_*` | Save, search, note, decision, forget |

---

## Best Practices

### Do
- Let GoopSpec ask clarifying questions
- Define clear success criteria
- Review the spec before confirming
- Use checkpoints for long tasks
- Let it learn from completed work

### Don't
- Skip the Plan phase for non-trivial work
- Approve specs you haven't read
- Interrupt during wave execution
- Ignore deviation warnings
- Forget to confirm at gates

---

## Comparison

| Feature | Traditional AI | GoopSpec |
|---------|---------------|----------|
| Requirements | Inferred/assumed | Explicitly captured |
| Scope | Often creeps | Locked in spec |
| Verification | Manual | Automated + gates |
| Memory | Per-session | Persistent |
| Context | Degrading | Fresh per agent |
| Commits | Variable | Atomic per task |

---

## Contributing

We welcome contributions! Please read our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development

```bash
# Install dependencies
bun install

# Run tests
bun test

# Type check
bun run typecheck

# Build
bun run build
```

### Project Structure

```
opencode-goopspec/
├── agents/           # Agent markdown definitions
├── commands/         # Command markdown definitions
├── references/       # Reference documentation
├── skills/           # Loadable skill modules
├── templates/        # File templates
└── src/
    ├── agents/       # Agent factory
    ├── core/         # Core types and config
    ├── features/     # Feature modules
    │   ├── archive/
    │   ├── memory/
    │   ├── mode-detection/
    │   ├── parallel-research/
    │   ├── routing/
    │   ├── setup/
    │   ├── state-manager/
    │   └── workflow-memory/
    ├── hooks/        # OpenCode hooks
    ├── plugin-handlers/
    ├── shared/       # Utilities
    └── tools/        # MCP tools
```

---

## License

MIT License. See [LICENSE](./LICENSE) for details.

---

## Acknowledgments

GoopSpec builds on ideas from:
- [OpenCode](https://opencode.ai) - The AI coding assistant platform
- GSD (Get Stuff Done) - Structured task execution patterns
- oh-my-opencode - Plugin architecture patterns

---

<div align="center">

**Built with care by developers, for developers.**

[Issues](https://github.com/hffmnnj/opencode-goopspec/issues)

</div>
