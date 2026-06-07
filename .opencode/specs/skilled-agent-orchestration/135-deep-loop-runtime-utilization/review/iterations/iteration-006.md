# Deep Review — Iteration 006

**Dimension**: maintainability
**Scope**: the .cjs scripts (tsx-import duplication, inline fallbacks, dual-use safety, comment hygiene)
**Executor**: cli-opencode openai/gpt-5.5-fast --variant xhigh (read-only)
**Raw output**: /tmp/dr-r6.out

## Findings

- **[P1] R6-1** `.opencode/skills/deep-improvement/scripts/shared/reduce-state.cjs:416`
  - Issue: code comments embed ephemeral IDs at lines 416, 712, and 900
  - Impact: violates comment-hygiene HARD BLOCK; can block pre-commit/CI and ties durable code to temporary review/task labels
  - Fix: remove the IDs and keep only the durable rationale — VERIFY exact lines+tokens before editing
  - Note: INTRODUCED this session in commit 55fd158 — HARD BLOCK
- **[P1] R6-2** `.opencode/skills/deep-improvement/scripts/shared/improvement-journal.cjs:18`
  - Issue: code comments embed ephemeral finding/requirement IDs at lines 18, 32, 159, and 168
  - Impact: violates comment-hygiene HARD BLOCK; can block pre-commit/CI
  - Fix: rewrite comments to state the stable behavior/why without P0/NFR-*/REQ-* labels — VERIFY exact lines+tokens before editing
  - Note: INTRODUCED this session in commit 55fd158 — HARD BLOCK
- **[P2] R6-3** `.opencode/skills/deep-context/scripts/reduce-state.cjs:120`
  - Issue: loadStateSafety + inline writeTextAtomic/repairJsonlTailInline is duplicated in deep-improvement/scripts/shared/reduce-state.cjs:111
  - Impact: safety-critical fallback behavior now has two CJS mirrors plus the TS runtime source, increasing drift risk
  - Fix: extract a shared CJS state-safety adapter and import it in both reducers with parity tests
- **[P2] R6-4** `.opencode/skills/deep-context/scripts/reduce-state.cjs:70`
  - Issue: inline atomic fallback omits the runtime helper's post-rename directory fsync (also at deep-improvement/reduce-state.cjs:61)
  - Impact: fallback mode is weaker than the runtime contract it claims to mirror after crash/restart boundaries
  - Fix: add best-effort fsync on path.dirname(filePath) after rename, or eliminate the inline copy via the shared adapter
- **[P2] R6-5** `.opencode/skills/deep-context/scripts/loop-lock.cjs:110`
  - Issue: main() runs unguarded despite the file describing dual-use/module-safe behavior
  - Impact: require() would parse caller argv and can process.exit, making tests or module reuse unsafe
  - Fix: wrap CLI execution in if (require.main === module) and export the reusable helpers
