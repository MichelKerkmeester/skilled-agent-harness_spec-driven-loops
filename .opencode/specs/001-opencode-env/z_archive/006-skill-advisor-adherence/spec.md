# Spec: Improve skill_advisor.py Adherence Without Hooks

## Overview

| Field | Value |
|-------|-------|
| **Spec ID** | 006-skill-advisor-adherence |
| **Category** | System Instructions |
| **Level** | 2 (Verification) |
| **Status** | Draft |
| **Created** | 2025-01-21 |

## Problem Statement

Agents frequently skip running `skill_advisor.py` as required by Gate 3 in AGENTS.md, even when the gate is clearly defined. This was directly observed in the current conversation where the agent (me) rationalized skipping the script because the user explicitly mentioned "Act as orchestrate.md".

### Root Cause Analysis

**Why agents skip the gate:**

1. **Escape Clause Exploitation**: Gate 3 contains the note "Task-appropriate skills can be recognized without script call" - this provides an easy rationalization path

2. **User Direction Override Perception**: When users say "use X skill" or "act as Y agent", agents perceive this as superseding the verification requirement

3. **Urgency Bias**: Agents rush to execute valuable work rather than perform "administrative" verification steps

4. **Overhead Perception**: Running a Python script via Bash feels like unnecessary friction compared to just reading a file

5. **No Immediate Negative Feedback**: Nothing visibly breaks when the step is skipped, so there's no reinforcement loop

6. **Gate Position**: Gate 3 comes AFTER Gates 1 & 2, by which point the agent has already mentally "committed" to a course of action

7. **Attention Decay**: In long system prompts, specific rules lose salience as context competes for attention

### The Constraint

**Hooks are not available.** This means we cannot:
- Auto-run skill_advisor.py before tool calls
- Inject verification results into context
- Block actions programmatically

We must rely entirely on:
- Prompt engineering (AGENTS.md instructions)
- Self-verification patterns
- Constitutional rules
- Memory triggers
- Output format requirements

## Requirements

### Functional Requirements

1. **F1**: Agents MUST either run `skill_advisor.py` OR cite explicit user direction for every task that could benefit from skill routing
2. **F2**: The verification MUST be visible/auditable in the conversation
3. **F3**: The mechanism MUST NOT add significant friction to simple queries
4. **F4**: The mechanism MUST work even when users provide explicit skill directions

### Non-Functional Requirements

1. **NF1**: Changes should be minimal and targeted (avoid rewriting entire sections)
2. **NF2**: Changes should be self-reinforcing (multiple layers of defense)
3. **NF3**: Changes should be easy to verify compliance

## Proposed Solution: Multi-Layer Defense

### Layer 1: Reframe the Escape Clause

**Current (problematic):**
```
│ Note:    Task-appropriate skills can be recognized without script call.     │
```

**Proposed:**
```
│ Note:    If user explicitly specifies a skill/agent, cite their instruction │
│          as routing source. Otherwise, script output required.              │
```

**Rationale**: This acknowledges that user direction IS valid routing, but requires the agent to explicitly cite it rather than just skip silently.

### Layer 2: Add to Self-Verification Checklist

**Current checklist** (§2 bottom):
```
□ File modification detected? Did I ask spec folder question? If NO → Ask NOW.
□ Am I saving memory/context? → Use generate-context.js script (not Write tool)
□ Aligned with ORIGINAL request? → Check for scope drift from Turn 1 intent
□ Claiming completion? → Verify checklist.md items first
```

**Add:**
```
□ Skill routing verified? → Script output OR user direction citation required
```

### Layer 3: Add to Common Failure Patterns Table

**Add row to §4 Common Failure Patterns:**

| # | Stage | Pattern | Trigger Phrase | Response Action |
|---|-------|---------|----------------|-----------------|
| 16 | Understanding | Skip Skill Routing | "obvious which skill", "user specified" | STOP → Run skill_advisor.py OR cite user direction explicitly |

### Layer 4: First-Message Protocol Enhancement

**Add to First Message Protocol** (after spec folder question):

```
6. If task involves skill routing:
   - Run: python3 .opencode/scripts/skill_advisor.py "[user request]" --threshold 0.8
   - OR cite user's explicit skill direction: "User specified: [exact quote]"
```

### Layer 5: Gate 3 Rewording

**Current:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ GATE 3: SKILL ROUTING [MANDATORY when confidence > 0.8]                      │
│ Action:  Run: python3 .opencode/scripts/skill_advisor.py                    │
│ Logic:   IF task clearly matches a skill domain → invoke skill directly     │
│          IF uncertain → run skill_advisor.py for recommendation             │
│          IF confidence > 0.8 from advisor → MUST invoke recommended skill    │
│ Note:    Task-appropriate skills can be recognized without script call.     │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Proposed:**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ GATE 3: SKILL ROUTING [ALWAYS REQUIRED for non-trivial tasks]               │
│                                                                             │
│ Action:  Verify skill routing via ONE of:                                   │
│   A) Run: python3 .opencode/scripts/skill_advisor.py "[request]" --threshold 0.8   │
│   B) Cite user's explicit direction: "User specified: [exact quote]"        │
│                                                                             │
│ Logic:   Script returns confidence ≥ 0.8 → MUST invoke recommended skill    │
│          Script returns confidence < 0.8 → Proceed with general approach    │
│          User explicitly names skill/agent → Cite and proceed               │
│                                                                             │
│ Output:  First response MUST include either:                                │
│          "SKILL ROUTING: [script output]" OR                                │
│          "SKILL ROUTING: User directed → [skill name]"                      │
│                                                                             │
│ Skip:    Only for trivial queries (greetings, single-line questions)        │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Alternative Approaches Considered

### A: Hard Block (Rejected)
- Make skill_advisor.py absolutely mandatory with no exceptions
- **Rejected**: Too heavy-handed, adds friction to obviously-routed cases

### B: First-Response Template (Rejected)
- Require every response to begin with skill routing section
- **Rejected**: Adds noise to simple queries, feels bureaucratic

### C: Constitutional Memory (Considered)
- Create a constitutional-tier memory that surfaces on every conversation start
- **Status**: Could be added as additional layer, but relies on memory system working

### D: Gate Restructuring (Rejected)
- Merge Gate 3 into Gate 2 entirely
- **Rejected**: Significant rewrite, may introduce other issues

## Success Criteria

1. **SC1**: Agent includes skill routing verification in first substantive response
2. **SC2**: When user provides explicit direction, agent cites it explicitly
3. **SC3**: When user does NOT provide direction, agent runs script and shows output
4. **SC4**: Compliance is visible/auditable without reading agent's internal reasoning

## Implementation Notes

### Files to Modify

1. `AGENTS.md` - Gate 3 rewording, self-verification checklist, failure patterns table
2. Optionally: Create constitutional memory for reinforcement

### Testing

After implementation, test with:
1. "Fix the bug in auth.js" (no skill specified) → Should run script
2. "Use workflows-git to commit" (skill specified) → Should cite user direction
3. "Act as orchestrate.md and do X" (agent specified) → Should cite user direction
4. "Hello" (trivial) → Should skip routing entirely

## Open Questions

1. Should we add a constitutional memory as an additional layer?
2. Should the "SKILL ROUTING:" output be mandatory or just recommended?
3. Should we track compliance metrics somehow?

## References

- `AGENTS.md` §2 MANDATORY GATES
- `.opencode/scripts/skill_advisor.py`
- Gate 3 current implementation
