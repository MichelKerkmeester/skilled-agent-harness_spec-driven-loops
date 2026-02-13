---
name: debugging
description: Systematically diagnose and fix bugs using scientific method.
category: code
triggers:
  - debug
  - bug
  - diagnose
  - fix
version: 0.1.0
---

# Debugging Skill

## Purpose
Systematically diagnose and fix bugs using scientific method.

## The Scientific Method for Debugging

1. **Observe** - Gather symptoms and error messages
2. **Hypothesize** - Form theories about the cause
3. **Predict** - What would you expect if hypothesis is true?
4. **Experiment** - Test the hypothesis
5. **Analyze** - Interpret results
6. **Iterate** - Refine hypothesis or fix

## Debugging Strategies

### Binary Search
Narrow down the problem space by eliminating half at each step.

### Print/Log Debugging
Add strategic logging to trace execution flow.

### Rubber Duck Debugging
Explain the problem out loud, step by step.

### Minimal Reproduction
Create the smallest test case that reproduces the bug.

### Git Bisect
Find the commit that introduced the bug.

## Common Bug Categories

- **Logic errors** - Wrong algorithm or condition
- **State errors** - Unexpected state mutations
- **Race conditions** - Timing-dependent failures
- **Edge cases** - Unhandled boundary conditions
- **Type errors** - Wrong types or null values
- **Integration errors** - API contract mismatches

## Debugging Checklist

- [ ] Can I reproduce the bug consistently?
- [ ] What changed recently?
- [ ] What are the exact error messages?
- [ ] What is the expected vs actual behavior?
- [ ] What assumptions am I making?
