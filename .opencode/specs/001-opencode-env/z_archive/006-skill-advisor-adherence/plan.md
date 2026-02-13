# Plan: Improve skill_advisor.py Adherence

## Phase 1: AGENTS.md Gate 3 Rewording

### Task 1.1: Rewrite Gate 3 Box
- Location: AGENTS.md §2 MANDATORY GATES, Gate 3
- Change: Replace current Gate 3 with expanded version that:
  - Removes ambiguous escape clause
  - Adds explicit "Option A" (script) and "Option B" (cite user) paths
  - Adds output format requirement
  - Defines "trivial query" skip condition

### Task 1.2: Update Self-Verification Checklist
- Location: AGENTS.md §2, "Self-Verification (MANDATORY)" section
- Add: `□ Skill routing verified? → Script output OR user direction citation required`

### Task 1.3: Add Failure Pattern Row
- Location: AGENTS.md §4, "Common Failure Patterns" table
- Add row #16: Skip Skill Routing pattern with trigger and response

## Phase 2: First Message Protocol Enhancement

### Task 2.1: Add Skill Routing Step
- Location: AGENTS.md §2, "First Message Protocol" section
- Add step 6 for skill routing verification requirement

## Phase 3: Validation

### Task 3.1: Manual Test Cases
Test the changes by simulating conversations:
1. Task without skill specified → Verify script would run
2. Task with explicit skill → Verify citation format
3. Trivial query → Verify skip is appropriate

### Task 3.2: Review Changes
- Ensure no contradictions introduced
- Verify gate flow still makes sense
- Check that changes are minimal and targeted

## Dependencies

```
Phase 1 ──────────────────────────────────────────────────────────►
  Task 1.1 (Gate 3) ────► Task 1.2 (Checklist) ────► Task 1.3 (Pattern)
                                                            │
Phase 2 ─────────────────────────────────────────────────────┼────►
  Task 2.1 (First Message) ─────────────────────────────────►│
                                                            │
Phase 3 ────────────────────────────────────────────────────┼────►
                                                      Task 3.1, 3.2
```

## Estimated Scope

| Phase | Files | LOC Changes |
|-------|-------|-------------|
| Phase 1 | 1 (AGENTS.md) | ~40 lines |
| Phase 2 | 1 (AGENTS.md) | ~5 lines |
| Phase 3 | 0 | Testing only |

**Total**: ~45 LOC changes in AGENTS.md

## Risks

| Risk | Mitigation |
|------|------------|
| Changes may conflict with other gate logic | Review full gate flow after changes |
| Output format may feel bureaucratic | Make it minimal ("SKILL ROUTING: ...") |
| Agents may still skip despite changes | Multi-layer defense provides redundancy |

## Rollback

If changes cause issues:
1. Revert AGENTS.md to previous version
2. All changes are in one file, easy to rollback
