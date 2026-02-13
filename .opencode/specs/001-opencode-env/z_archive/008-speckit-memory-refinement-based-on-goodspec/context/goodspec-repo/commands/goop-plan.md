---
name: goop-plan
description: Start the Planning Phase
phase: plan
next-step: "When planning is complete and requirements are clear, lock the specification"
next-command: /goop-specify
alternatives:
  - command: /goop-research
    when: "If there are unknowns or technology questions to investigate"
  - command: /goop-pause
    when: "To save progress and continue later"
---

# /goop-plan

**Start the Planning Phase.** Capture intent, clarify requirements, and prepare for execution.

## Usage

```bash
/goop-plan [brief description of task]
```

## Orchestrator Role

**YOU conduct the interview directly.** Do NOT spawn agents for conversation. Only spawn agents when it's time to BUILD documents.

Why: The interview builds shared understanding. That understanding stays in YOUR context and informs how you delegate. Spawning for conversation fragments knowledge.

## Process

### Phase 1: Setup

**Execute these checks BEFORE any user interaction:**

**1.1 Check for existing project documents:**
```
goop_status()
Read(".goopspec/SPEC.md")
Read(".goopspec/BLUEPRINT.md")
Read(".goopspec/CHRONICLE.md")
```

**1.2 If documents exist, offer archive:**

Use `question` tool:
- header: "Existing Project"
- question: "I found existing project documents. How would you like to proceed?"
- options:
  - "Archive and start fresh (Recommended)" — Move current docs to archive, extract learnings, start new project
  - "Continue existing project" — Resume work on current spec (exit planning, run /goop-status)
  - "Overwrite without archiving" — Replace documents (loses history)

**On "Archive and start fresh":**
```
task({
  subagent_type: "goop-writer",
  description: "Archive current milestone",
  prompt: `
    Archive the current project:
    1. Read .goopspec/SPEC.md and .goopspec/CHRONICLE.md
    2. Generate RETROSPECTIVE.md summarizing:
       - What was built
       - Key decisions made
       - Learnings for next time
    3. Move all documents to .goopspec/archive/[milestone-name]/
    4. Clear working documents (keep archive/)
    5. Return ARCHIVE COMPLETE with summary
  `
})
```
Then continue to Phase 2.

**On "Continue existing":** Exit command. Suggest `/goop-status` for current state.

**On "Overwrite":** Warn user, then continue to Phase 2.

**1.3 Initialize if needed:**
```bash
mkdir -p .goopspec
```

**1.4 Search memory for context:**
```
memory_search({ query: "project preferences architecture decisions [user's topic]", limit: 5 })
```

Store any relevant findings - use them to skip questions you already know answers to.

### Phase 2: Deep Questioning

**Display stage banner:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GOOPSPEC ▸ PLANNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**2.1 Open the conversation:**

If `$ARGUMENTS` provided:
> "You want to **[argument]**. Let me understand this better."

Otherwise:
> "What do you want to build?"

Wait for response. This gives context for intelligent follow-ups.

**2.2 Follow the thread:**

Based on their response, ask follow-up questions. Use the `question` tool with options that probe what they mentioned.

Keep following threads. Each answer opens new areas:
- What excited them about this idea
- What problem sparked it
- What vague terms mean concretely
- What it would look like in use
- What's already decided vs open

**2.3 Memory-first questioning protocol:**

Before asking ANYTHING:
1. Check memory: `memory_search({ query: "[topic] preference" })`
2. If found with high confidence: "I recall you prefer X for this. Still true? [Y/n]"
3. If not found: Ask, then SAVE the answer with `memory_note`

**Never ask what you already know.**

**2.4 Context checklist (gather all of these):**

| Category | Questions to Answer |
|----------|-------------------|
| **Goal** | What is the ONE thing that must work? |
| **Context** | Why now? What problem does this solve? |
| **Success** | How do we know it's done? Observable outcomes? |
| **Constraints** | Tech stack? Performance? Security? Timeline? |
| **Scope** | What's explicitly NOT included? |
| **UI/UX** | Visual direction? Key patterns? States to handle? |

Don't ask all at once. Weave naturally through conversation.

**2.5 Strategy decision gate:**

When you could write a clear SPEC.md, use `question` tool:

- header: "Strategy"
- question: "I understand what you're building. How should we proceed?"
- options:
  - "Create specification (Recommended)" — I'll create SPEC.md and BLUEPRINT.md now
  - "Research first" — Investigate unknowns before planning (/goop-research)
  - "Map codebase first" — Understand existing code before planning (/goop-map-codebase)
  - "Keep exploring" — I want to share more context

**On "Keep exploring":** Ask what they want to add, identify gaps, continue conversation.

**On "Research first":** 
```
Suggest: "Run `/goop-research [topic]` to investigate, then return to `/goop-plan`"
```
Exit command.

**On "Map codebase":**
```
Suggest: "Run `/goop-map-codebase` to understand the existing code, then return to `/goop-plan`"
```
Exit command.

**On "Create specification":** Continue to Phase 3.

### Phase 3: Document Creation

**Display stage banner:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GOOPSPEC ▸ CREATING DOCUMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

◆ Spawning planner to create SPEC.md and BLUEPRINT.md...
```

**Spawn goop-planner with full interview context:**

```
task({
  subagent_type: "goop-planner",
  description: "Create SPEC and BLUEPRINT",
  prompt: `
## TASK
Create specification and blueprint for: [feature name]

## CONTEXT FROM INTERVIEW

### User Intent
[The core "why" - what problem this solves, why now]

### Requirements Gathered

**Must Have:**
- [Requirement 1 from interview]
- [Requirement 2 from interview]
- [Requirement 3 from interview]

**Nice to Have:**
- [If mentioned]

**Out of Scope:**
- [Explicit exclusions from interview]

### Technical Constraints
- Stack: [from interview]
- Performance: [from interview]
- Security: [from interview]

### Success Criteria
- [Observable outcome 1]
- [Observable outcome 2]

### UI/UX Requirements (if applicable)
- Visual direction: [from interview]
- Key patterns: [from interview]
- States to handle: [loading, empty, error, success]

## INSTRUCTIONS
1. Load templates:
   - goop_reference({ name: "spec", type: "template" })
   - goop_reference({ name: "blueprint", type: "template" })

2. Create .goopspec/SPEC.md with:
   - All must-haves as checkboxes with IDs (MH-01, MH-02)
   - Nice-to-haves marked separately
   - Clear out-of-scope section
   - Success criteria

3. Create .goopspec/BLUEPRINT.md with:
   - Wave-based execution plan
   - Each task is atomic and verifiable
   - Dependencies mapped
   - Estimated effort per wave

4. Initialize .goopspec/CHRONICLE.md with:
   - Phase: plan → ready for specify
   - Documents created with timestamps

5. Save key decisions to memory:
   memory_decision({
     decision: "[key architectural choice]",
     reasoning: "[why]",
     impact: "medium"
   })

6. Return: ## PLANNING COMPLETE with summary

Write files IMMEDIATELY. Don't draft - commit to disk.
  `
})
```

### Phase 4: Handle Response

**On `## PLANNING COMPLETE`:**

Read created documents and present:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GOOPSPEC ▸ PLANNING COMPLETE ✓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Feature:** [Name from SPEC.md]

| Artifact   | Status  | Location               |
|------------|---------|------------------------|
| Spec       | Created | .goopspec/SPEC.md      |
| Blueprint  | Created | .goopspec/BLUEPRINT.md |
| Chronicle  | Created | .goopspec/CHRONICLE.md |

**[N] must-haves** | **[M] waves** | **[P] tasks**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ▸ Next Up

**Lock the specification** — Confirm requirements before execution

`/goop-specify`

---

**Also available:**
- `/goop-research [topic]` — Investigate unknowns before specifying
- `cat .goopspec/SPEC.md` — Review the specification
- `cat .goopspec/BLUEPRINT.md` — Review the execution plan

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**On `## PLANNING BLOCKED`:**

Present blocker to user:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GOOPSPEC ▸ PLANNING BLOCKED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Blocker:** [From planner response]

**Options:**
1. Provide more context → continue planning
2. Research the unknown → /goop-research
3. Abort → /goop-pause
```

Use `question` tool to get user choice.

**On `## PLANNING PARTIAL`:**

Present what was created, explain gaps, offer to continue or restart.

### Phase 5: Memory Persistence

After successful planning, persist key context:

```
memory_save({
  type: "note",
  title: "Project: [Feature Name]",
  content: "Building [summary]. Key decisions: [list]. Success = [criteria].",
  concepts: ["project", "planning", "[domain]"],
  importance: 0.8
})
```

## Output

| File | Purpose |
|------|---------|
| `.goopspec/SPEC.md` | Requirements specification (Draft) |
| `.goopspec/BLUEPRINT.md` | Wave-based execution plan |
| `.goopspec/CHRONICLE.md` | Progress tracking |
| `.goopspec/state.json` | Workflow state |

## Transitions

| Outcome | Next Step |
|---------|-----------|
| Planning complete | `/goop-specify` to lock the specification |
| Unknowns remain | `/goop-research` to investigate |
| Need to pause | `/goop-pause` to save checkpoint |
| Existing project | `/goop-status` to see current state |

## Examples

**Simple Feature:**
```
User: /goop-plan add a dark mode toggle

Orchestrator: "Dark mode toggle. A few questions:

1. Should it persist to localStorage across sessions?
2. Auto-detect system preference (prefers-color-scheme)?
3. Animate the transition, or instant switch?

[Uses question tool with options for each]"

... gathers answers ...

Orchestrator: "Got it. Creating specification..."
[Spawns goop-planner]
```

**Complex Feature:**
```
User: /goop-plan refactor the authentication system

Orchestrator: "Auth refactor is significant. Let me understand the scope.

I found 3 auth-related modules in the codebase:
- src/auth/ (main auth logic)
- src/middleware/auth.ts (route protection)  
- src/utils/jwt.ts (token handling)

What's driving this refactor?

[Uses question tool]:
- Security vulnerability found
- Adding new auth method (OAuth, SSO)
- Performance issues
- Technical debt cleanup
- Other (describe)"
```

**Existing Project Detected:**
```
User: /goop-plan new dashboard widgets

Orchestrator: "I found existing project documents:
- SPEC.md: 'User Authentication System'
- Status: Execute phase, Wave 2 of 3

[Uses question tool]:
- Archive auth project and start fresh on widgets
- Continue auth project (run /goop-status)
- Overwrite without archiving"
```

## Success Criteria

- [ ] Existing documents detected and handled (archive/continue/overwrite)
- [ ] Memory searched before asking questions
- [ ] Interview conducted by orchestrator directly (no agent spawn for conversation)
- [ ] All context checklist categories gathered
- [ ] User confirmed strategy (create/research/map/explore)
- [ ] goop-planner spawned with complete interview context
- [ ] SPEC.md created with must-haves, nice-to-haves, out-of-scope
- [ ] BLUEPRINT.md created with waves and tasks
- [ ] CHRONICLE.md initialized
- [ ] Key decisions saved to memory
- [ ] User knows next step is `/goop-specify`

## Anti-Patterns

**DON'T:**
- Spawn an agent to conduct the interview
- Ask questions you found answers to in memory
- Skip the archive check when existing docs exist
- Create documents without user confirming strategy
- Leave user without clear next steps
- Rush through questioning to get to document creation

**DO:**
- Search memory before every question category
- Follow conversation threads naturally
- Challenge vague requirements ("what do you mean by fast?")
- Save new preferences to memory immediately
- Present clear "Next Up" section with copy-paste commands
- Take time to understand - planning is the highest leverage phase
