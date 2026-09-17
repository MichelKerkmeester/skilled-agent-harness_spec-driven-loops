---
title: Sub-Agent Verification Pattern
description: Systematic debugging with four-phase investigation, root cause tracing, and performance profiling. — Sub-Agent Verification Pattern.
trigger_phrases:
  - "sub agent verification"
  - "sub agent verification webflow"
  - "sub agent verification reference"
importance_tier: normal
contextType: implementation
version: 3.5.0.18
---


# Sub-Agent Verification Pattern

Systematic debugging with four-phase investigation, root cause tracing, and performance profiling.

---

## 1. OVERVIEW

### Purpose

Provides the detailed sub-agent verification pattern guidance for the broader Webflow workflow.

### When to Use

- Use this reference when applying or troubleshooting the documented sub-agent verification pattern practices.

---

## 2. SUB-AGENT VERIFICATION PATTERN

**When to use**: Complex debugging tasks, verifying assumptions before implementation, when you need a second perspective on root cause analysis

### Core Principle

Validate before implement. Use sub-agents to verify assumptions, test hypotheses, and gather evidence before committing to a fix.

### The Pattern

```
Main Agent (debugging):
├── IDENTIFY: Form hypothesis about root cause
├── DISPATCH: Task tool with verification sub-agent
│   ├── Sub-agent gathers evidence
│   ├── Sub-agent tests hypothesis
│   └── Sub-agent returns JSON result
├── EVALUATE: Check if hypothesis confirmed
│   ├── CONFIRMED: Proceed with fix
│   └── REJECTED: Form new hypothesis, repeat
└── IMPLEMENT: Fix with confidence
```

### When to Use Sub-Agent Verification

**Use sub-agents when:**
- 3+ fix attempts have failed (avoid "fix-try-fix" cycles)
- Root cause is unclear despite investigation
- Multiple hypotheses exist and you need evidence
- The fix has high risk of side effects
- You need to verify behavior across different conditions

**Skip sub-agents when:**
- Root cause is obvious from error message
- Single, isolated bug with clear fix
- Quick verification possible in main context

### Sub-Agent Prompt Structure

**Verification Task:**
```markdown
TASK: Verify hypothesis about [issue description]

HYPOTHESIS: [Your hypothesis about root cause]

EVIDENCE TO GATHER:
1. [Specific check 1]
2. [Specific check 2]
3. [Specific check 3]

RETURN (JSON):
{
  "hypothesis_confirmed": true | false,
  "evidence": [
    { "check": "...", "result": "...", "supports_hypothesis": true|false }
  ],
  "alternative_causes": ["...", "..."],
  "recommended_fix": "..." | null,
  "confidence": 0.0-1.0
}

Tools you can use: Read, Grep, Glob, Bash (for git log, npm test)
```

### Example: Debugging a Scroll Position Bug

**Main agent forms hypothesis:**
```markdown
HYPOTHESIS: ToC scroll position is off by 90px because Lenis's built-in
anchor handler is overriding our custom scroll with offset.
```

**Sub-agent verification task:**
```markdown
TASK: Verify Lenis anchor conflict hypothesis

HYPOTHESIS: Lenis's `anchors: true` option is causing double-scroll

EVIDENCE TO GATHER:
1. Check if Lenis is initialized with anchors: true
2. Check if our handler uses stopImmediatePropagation
3. Check if our handler uses capturing phase (true)
4. Search for any other scroll handlers on anchor clicks

RETURN (JSON):
{
  "hypothesis_confirmed": true | false,
  "evidence": [...],
  "alternative_causes": [...],
  "recommended_fix": "...",
  "confidence": 0.0-1.0
}

Tools: Read, Grep, Bash (for search)
```

**Sub-agent response:**
```json
{
  "hypothesis_confirmed": true,
  "evidence": [
    {
      "check": "Lenis initialization",
      "result": "Found 'anchors: true' in site scripts",
      "supports_hypothesis": true
    },
    {
      "check": "Handler uses stopImmediatePropagation",
      "result": "Only stopPropagation used, not stopImmediatePropagation",
      "supports_hypothesis": true
    },
    {
      "check": "Capturing phase",
      "result": "Handler registered with capture: false",
      "supports_hypothesis": true
    }
  ],
  "alternative_causes": [],
  "recommended_fix": "Change to stopImmediatePropagation() and capture: true",
  "confidence": 0.95
}
```

### Integration with Task-tool Debug Dispatch

For complex debugging sessions, dispatch the debug specialist through the Task tool:

```markdown
After 3+ failed fix attempts:
1. Main agent packages the current error state and prior attempts
2. Task tool dispatches `@debug` with:
   - Current error state
   - Previous fix attempts
   - Relevant file context
3. Sub-agent returns structured analysis
4. Main agent applies the recommended fix
```

**Debug sub-agent template:**
```markdown
DEBUG TASK: [Issue description]

CONTEXT:
- Error: [error message]
- File: [file path]
- Previous attempts: [list of failed fixes]

INVESTIGATION STEPS:
1. Reproduce the issue
2. Trace execution flow
3. Identify root cause
4. Propose fix with evidence

RETURN (JSON):
{
  "root_cause": "...",
  "evidence": [...],
  "fix": {
    "file": "...",
    "change": "...",
    "rationale": "..."
  },
  "verification_steps": ["..."]
}
```

### Fallback Behavior

```
FALLBACK triggers if:
├── Task tool returns error
├── Task tool times out
├── Sub-agent returns confidence < 0.5
└── Sub-agent returns hypothesis_confirmed: false with no alternatives

FALLBACK behavior:
├── Log: "Sub-agent verification inconclusive"
├── Return to main agent investigation
├── Form new hypothesis based on sub-agent evidence
└── Consider manual debugging with DevTools
```

### Rules

**ALWAYS:**
- Include clear hypothesis in sub-agent prompt
- Request structured JSON response
- Specify what tools sub-agent can use
- Include fallback plan if verification fails
- Use sub-agent evidence to inform fix, not just confirm bias

**NEVER:**
- Dispatch sub-agent without clear hypothesis
- Ignore sub-agent's alternative causes
- Skip verification for high-risk fixes
- Dispatch multiple sub-agents simultaneously (token waste)
- Use sub-agents for simple, obvious bugs

**See also:** `.opencode/commands/speckit/debug.md` for debug delegation command

---
