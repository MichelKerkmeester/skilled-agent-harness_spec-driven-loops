# Implementation Phase Checklist

Phase-specific validation checklist for the implementation/coding phase.

---

## P0 - Critical (Must Complete)

- [ ] Code follows existing patterns (check code quality standards)
- [ ] Changes stay within spec.md scope (no scope creep)
- [ ] Unit tests written and passing
- [ ] No console errors in browser DevTools
- [ ] Bash 3.2 compatible (for shell scripts)
- [ ] checklist.md updated with progress

## P1 - High Priority

- [ ] Integration tests pass
- [ ] Documentation updated (plan.md reflects actual implementation)
- [ ] ShellCheck compliant (for shell scripts)
- [ ] Error handling implemented
- [ ] Edge cases covered
- [ ] Browser verification completed (frontend changes)

### Debug Escalation
- [ ] If stuck on same error 3+ times, run `/spec_kit:debug`
- [ ] If debugging > 15 minutes without progress, consider delegation

## P2 - Medium Priority

- [ ] Code comments added where non-obvious
- [ ] Performance optimized (no premature optimization)
- [ ] Logging implemented for debugging
- [ ] Configuration externalized

## Implementation Workflow

### Before Coding
- [ ] Read existing code first (understand before modify)
- [ ] Verify approach aligns with code quality standards
- [ ] Confirm simplest solution selected (KISS principle)

### During Coding
- [ ] Update checklist.md as items complete
- [ ] Test incrementally (don't batch all testing to end)
- [ ] Keep changes minimal and focused

### Before Claiming Complete
- [ ] All P0 items verified with evidence
- [ ] Browser tested if frontend (Gate 6 requirement)
- [ ] Save context if significant progress: `node .opencode/skill/system-memory/scripts/generate-context.js [spec-folder]`

## Debug Escalation Protocol

When debugging becomes prolonged or repetitive:

**Trigger Conditions:**
- Same error after 3+ fix attempts
- Debugging session > 15 minutes without resolution
- Frustration indicators ("stuck", "tried everything")

**Action:**
1. Run `/spec_kit:debug` command
2. Select AI model when prompted (Claude/Gemini/Codex)
3. Review sub-agent findings
4. Apply fix or iterate

**Benefits:**
- Fresh perspective from parallel agent
- Structured context handoff
- Documented debugging history

## References

- Code quality standards for patterns and conventions
- workflows-code skill for implementation lifecycle
