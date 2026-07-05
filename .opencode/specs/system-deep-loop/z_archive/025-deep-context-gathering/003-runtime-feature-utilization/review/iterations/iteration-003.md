# Deep Review — Iteration 003

**Dimension**: correctness
**Scope**: deep-improvement: scripts/shared/reduce-state.cjs, improvement-journal.cjs
**Executor**: cli-opencode openai/gpt-5.5-fast --variant xhigh (read-only)
**Raw output**: /tmp/dr-r3.out

## Findings

- **[P1] R3-1** `.opencode/skills/deep-improvement/scripts/shared/reduce-state.cjs:1326`
  - Issue: main() runs unconditionally instead of being guarded by require.main === module
  - Impact: requiring the file as a module executes CLI logic and can exit the host process or operate on process.argv[2]; dual-use safety broken
  - Fix: wrap main() in if (require.main === module) and export the intended module API
- **[P2] R3-2** `.opencode/skills/deep-improvement/scripts/shared/improvement-journal.cjs:192`
  - Issue: corruption warning line numbers are computed after blank lines are filtered out
  - Impact: warnings can point to the wrong physical JSONL line when blanks precede a corrupt record
  - Fix: iterate over split lines with the original index and skip blanks inside the loop
