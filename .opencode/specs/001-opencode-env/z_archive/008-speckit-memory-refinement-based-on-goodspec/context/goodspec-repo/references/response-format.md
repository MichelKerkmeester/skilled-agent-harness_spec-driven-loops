# Agent Response Format

All GoopSpec subagents MUST return structured responses to the orchestrator. This enables clean handoffs, progress tracking, and next-step clarity.

## Core Principle

```
╔════════════════════════════════════════════════════════════════╗
║  EVERY RESPONSE MUST ANSWER THREE QUESTIONS:                   ║
║  1. What did I do?                                              ║
║  2. What is the current state?                                  ║
║  3. What should happen next?                                    ║
╚════════════════════════════════════════════════════════════════╝
```

## Response Structure

Every subagent response follows this structure:

```markdown
## [STATUS INDICATOR]

**Agent:** [agent-name]
**Task:** [task description from prompt]
**Duration:** [~X minutes]

### Summary
[1-3 sentences on what was accomplished]

### Work Completed

| Item | Details |
|------|---------|
| [Action 1] | [Specifics] |
| [Action 2] | [Specifics] |

### Files Modified
- `path/to/file.ts` - [what changed]
- `path/to/other.ts` - [what changed]

### Commits (if applicable)
- `abc123` - feat(scope): description

### Decisions Made
- **[Decision]**: [Reasoning]

### Memory Persisted
- Saved: "[memory title]"
- Concepts: [tags]

### Current State
- Phase: [from state.json]
- Spec locked: [yes/no]
- Wave: [N of M] (if executing)

---

## NEXT STEPS

[Clear guidance for orchestrator]
```

## Status Indicators

Use these exact headers:

| Status | Header | When |
|--------|--------|------|
| Complete | `## TASK COMPLETE` | Work finished successfully |
| Partial | `## TASK PARTIAL` | Some progress, more needed |
| Blocked | `## TASK BLOCKED` | Cannot proceed, need help |
| Failed | `## TASK FAILED` | Cannot complete task |
| Checkpoint | `## CHECKPOINT REACHED` | Need user decision/verification |

## Next Steps Format

The "NEXT STEPS" section is MANDATORY. Use this format:

### For Orchestrator (Most Common)

```markdown
## NEXT STEPS

**For Orchestrator:**
1. [Immediate next action]
2. [Follow-up action if applicable]

**Suggested delegation:**
- Agent: `goop-[agent]`
- Task: "[specific task description]"
```

### When User Action Needed

```markdown
## NEXT STEPS

**User action required:**
- [What user needs to do]

**After user completes:**
- Run: `/goop-[command]`
- Or: Orchestrator continues with [task]
```

### When Work Is Complete

```markdown
## NEXT STEPS

**Wave [N] complete.** Ready to proceed.

**Options:**
1. Continue to Wave [N+1]: [brief description]
2. Run verification: `bun test`
3. Review changes before proceeding

**Recommended:** [specific recommendation]
```

## Agent-Specific Formats

### goop-executor

```markdown
## TASK COMPLETE

**Agent:** goop-executor
**Task:** [task from BLUEPRINT.md]
**Duration:** ~X minutes

### Summary
Implemented [feature] following existing patterns. All tests pass.

### Work Completed

| Task | Status | Commit |
|------|--------|--------|
| [Task 1] | Done | `abc123` |
| [Task 2] | Done | `def456` |

### Files Modified
- `src/feature/index.ts` - Added main implementation
- `src/feature/index.test.ts` - Added unit tests

### Commits
- `abc123` - feat(feature): add main implementation
- `def456` - test(feature): add unit tests

### Verification
- [x] `bun test` - All 42 tests pass
- [x] `bun run typecheck` - No errors
- [x] Manual verification - Works as expected

### Decisions Made
- **Used X over Y**: Consistent with existing patterns in `src/other/`

### Memory Persisted
- Saved: "Implemented [feature] using [pattern]"
- Concepts: [feature, pattern, typescript]

### Current State
- Phase: execute
- Wave: 2 of 3
- Tasks remaining: 4

---

## NEXT STEPS

**For Orchestrator:**
Wave 2 Task 1 complete. Continue with Task 2.

**Next task:**
- Task 2.2: [name from BLUEPRINT.md]
- Agent: `goop-executor`
- Files: `src/next/file.ts`
```

### goop-researcher

```markdown
## TASK COMPLETE

**Agent:** goop-researcher
**Task:** Research [topic]
**Duration:** ~X minutes
**Sources:** N analyzed

### Summary
Researched [topic]. Found [key insight]. Recommend [approach].

### Key Findings

| Category | Finding | Confidence |
|----------|---------|------------|
| [Area 1] | [Finding] | High |
| [Area 2] | [Finding] | Medium |

### Recommendations
1. **Use [X]** - [rationale]
2. **Avoid [Y]** - [rationale]
3. **Consider [Z]** - [when applicable]

### Files Created
- `.goopspec/RESEARCH.md` - Full research findings

### Memory Persisted
- Saved: "Research: [topic]"
- Facts: ["fact 1", "fact 2"]
- Concepts: [topic, technology, domain]

---

## NEXT STEPS

**Research complete.** Ready to inform planning.

**For Orchestrator:**
1. Review RESEARCH.md with user
2. Proceed to `/goop-specify` to lock specification
3. Or request additional research on [gap area]
```

### goop-verifier

```markdown
## VERIFICATION COMPLETE

**Agent:** goop-verifier
**Scope:** [what was verified]
**Result:** [PASSED | GAPS FOUND | SECURITY ISSUE]

### Verification Summary

| Requirement | Status | Evidence |
|-------------|--------|----------|
| [Must-have 1] | PASS | [proof] |
| [Must-have 2] | FAIL | [gap detail] |

### Security Audit
- [x] No hardcoded secrets
- [x] Input validation present
- [ ] **ISSUE:** [security concern]

### Gaps Found (if any)

**Gap 1: [Title]**
- Expected: [from SPEC.md]
- Actual: [what code does]
- Fix: [specific remediation]

### Memory Persisted
- Saved: "Verification: [scope]"
- Concepts: [verification, security, quality]

---

## NEXT STEPS

**[If PASSED]:**
Ready for acceptance. Run `/goop-accept`.

**[If GAPS FOUND]:**
1. Fix gaps before proceeding
2. Delegate to `goop-executor` with specific fixes
3. Re-verify after fixes

**[If SECURITY ISSUE]:**
STOP. Address security issues before any further work.
- Issue: [description]
- Severity: [Critical/High/Medium]
- Action: [remediation]
```

### goop-explorer

```markdown
## EXPLORATION COMPLETE

**Agent:** goop-explorer
**Scope:** [what was mapped]
**Duration:** ~X minutes

### Codebase Summary
- **Stack:** [language, framework, runtime]
- **Structure:** [architecture pattern]
- **Size:** N files, M directories

### Key Discoveries

| Area | Finding |
|------|---------|
| Entry points | [files] |
| Patterns | [patterns found] |
| Conventions | [naming, style] |
| Concerns | [issues noted] |

### Directory Map
```
project/
├── src/           # [description]
├── tests/         # [description]
└── config/        # [description]
```

### Memory Persisted
- Saved: "Codebase map: [project]"
- Concepts: [stack, patterns, structure]

---

## NEXT STEPS

**Exploration complete.** Codebase mapped.

**For Orchestrator:**
1. Use findings to inform BLUEPRINT.md
2. Note conventions for executor guidance
3. Address concerns: [list if any]
```

## Checkpoint Format

When a checkpoint is needed (user decision, verification, or manual action):

```markdown
## CHECKPOINT REACHED

**Agent:** [agent-name]
**Type:** [decision | verify | action]
**Task:** [current task]
**Progress:** [N/M tasks complete]

### Completed So Far

| Task | Status | Details |
|------|--------|---------|
| [Task 1] | Done | [summary] |
| [Task 2] | Done | [summary] |

### Current Task
**Task [N]:** [name]
**Status:** Awaiting [decision/verification/action]

### Checkpoint Details

**[For decision checkpoints]:**
| Option | Pros | Cons |
|--------|------|------|
| A: [option] | [benefits] | [tradeoffs] |
| B: [option] | [benefits] | [tradeoffs] |

**[For verification checkpoints]:**
- URL to check: [url]
- What to verify: [criteria]
- Expected behavior: [description]

**[For action checkpoints]:**
- What you need to do: [action]
- I'll verify by: [check]

---

## AWAITING

**[For decision]:** Select option A or B
**[For verification]:** Type "approved" or describe issues
**[For action]:** Type "done" when complete
```

## Anti-Patterns

**NEVER return:**
- "Done" (no context)
- "It works now" (no verification)
- Responses without NEXT STEPS
- Unstructured text walls
- Missing status indicators

**ALWAYS include:**
- Clear status header
- Summary of work
- Files touched
- Memory persistence
- NEXT STEPS section
