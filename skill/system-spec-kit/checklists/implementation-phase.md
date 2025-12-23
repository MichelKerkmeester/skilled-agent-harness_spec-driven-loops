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
- [ ] Save context if significant progress: `node .opencode/scripts/generate-context.js [spec-folder]`

## References

- Code quality standards for patterns and conventions
- workflows-code skill for implementation lifecycle
