# Tasks: Skill Advisor Adherence Improvement

## Task Breakdown

### TASK-001: Rewrite Gate 3 Box in AGENTS.md

**File**: `AGENTS.md`
**Section**: §2 MANDATORY GATES → Gate 3
**Priority**: P0

**Before** (current):
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

**After** (proposed):
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

**Acceptance Criteria**:
- [ ] Old Gate 3 text removed
- [ ] New Gate 3 text added
- [ ] Box borders properly aligned
- [ ] No syntax errors in markdown

---

### TASK-002: Add Self-Verification Checkbox

**File**: `AGENTS.md`
**Section**: §2 → "Self-Verification (MANDATORY)" subsection
**Priority**: P0

**Current checklist**:
```
□ File modification detected? Did I ask spec folder question? If NO → Ask NOW.
□ Am I saving memory/context? → Use generate-context.js script (not Write tool)
□ Aligned with ORIGINAL request? → Check for scope drift from Turn 1 intent
□ Claiming completion? → Verify checklist.md items first
```

**Add after line 2**:
```
□ Skill routing verified? → Script output OR user direction citation required
```

**Acceptance Criteria**:
- [ ] New checkbox added
- [ ] Positioned logically in checklist
- [ ] Formatting matches existing items

---

### TASK-003: Add Failure Pattern Row

**File**: `AGENTS.md`
**Section**: §4 → "Common Failure Patterns" table
**Priority**: P0

**New row to add**:
```
| 16  | Understanding  | Skip Skill Routing         | "obvious which skill", "user specified"      | STOP → Run skill_advisor.py OR cite user direction explicitly |
```

**Acceptance Criteria**:
- [ ] Row added with correct number (16)
- [ ] Stage: "Understanding"
- [ ] Pattern: "Skip Skill Routing"
- [ ] Trigger phrase provided
- [ ] Response action provided
- [ ] Table alignment preserved

---

### TASK-004: Update First Message Protocol

**File**: `AGENTS.md`
**Section**: §2 → "First Message Protocol" subsection
**Priority**: P1

**Current protocol ends with**:
```
5. Wait for answer, THEN proceed
```

**Add**:
```
6. For non-trivial tasks, verify skill routing (Gate 3):
   - Run `python3 .opencode/scripts/skill_advisor.py "[request]" --threshold 0.8`
   - OR cite user's explicit direction if provided
```

**Acceptance Criteria**:
- [ ] Step 6 added
- [ ] Follows existing formatting
- [ ] References Gate 3 for consistency

---

### TASK-005: Validation Testing

**Priority**: P1

**Test scenarios**:

1. **No skill specified**: "Fix the authentication bug"
   - Expected: Agent runs skill_advisor.py
   - Expected output: `SKILL ROUTING: [{"skill": "...", "confidence": ...}]`

2. **Skill explicitly specified**: "Use workflows-git to create a commit"
   - Expected: Agent cites user direction
   - Expected output: `SKILL ROUTING: User directed → workflows-git`

3. **Agent explicitly specified**: "Act as orchestrate.md and decompose this task"
   - Expected: Agent cites user direction
   - Expected output: `SKILL ROUTING: User directed → orchestrate agent`

4. **Trivial query**: "Hello"
   - Expected: Agent skips skill routing (trivial)
   - No SKILL ROUTING output needed

**Acceptance Criteria**:
- [ ] All 4 test scenarios produce expected behavior
- [ ] Output format is consistent
- [ ] No false positives (trivial queries don't trigger)

---

## Dependency Graph

```
TASK-001 (Gate 3 rewrite)
    │
    ├──► TASK-002 (Self-verification) ──┐
    │                                   │
    └──► TASK-003 (Failure pattern) ────┼──► TASK-005 (Validation)
                                        │
TASK-004 (First Message Protocol) ──────┘
```

## Summary

| Task | Description | Priority | Est. LOC |
|------|-------------|----------|----------|
| TASK-001 | Rewrite Gate 3 | P0 | ~15 |
| TASK-002 | Add self-verification checkbox | P0 | ~1 |
| TASK-003 | Add failure pattern row | P0 | ~1 |
| TASK-004 | Update First Message Protocol | P1 | ~4 |
| TASK-005 | Validation testing | P1 | 0 |
| **Total** | | | **~21** |
