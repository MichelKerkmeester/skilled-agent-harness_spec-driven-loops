---
title: "Plan: Launcher Race-Window Tightening + Debug-Log Hygiene"
description: "Implementation plan for closing 2 P2 findings on the skill-advisor launcher."
trigger_phrases:
  - "008 plan race window debug"
  - "skill-advisor 008 plan"
importance_tier: "useful"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/008-launcher-race-window-and-debug-log-hygiene"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Plan written"
    next_safe_action: "Execute per tasks.md"
    blockers: []
---
# Plan: Launcher Race-Window Tightening + Debug-Log Hygiene

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Two scoped edits in a single file (`.opencode/bin/mk-skill-advisor-launcher.cjs`) close both P2 findings from 007's deep-review. No new files, no test additions, no API changes.

**Language/Stack**: Node.js CommonJS (.cjs)
**Framework**: stdlib only (fs, path, child_process)
**Storage**: existing skill-graph SQLite + lease PID file (unchanged)
**Testing**: Vitest (existing 21 launcher tests cover the surface)
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Threshold | Verification |
|------|-----------|--------------|
| Syntax | exit 0 | `node --check .opencode/bin/mk-skill-advisor-launcher.cjs` |
| Typecheck | exit 0 | `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` |
| Vitest | 21/21 PASS | `npx vitest --run launcher-lease launcher-bootstrap` |
| Strict spec validate | `RESULT: PASSED` | `validate.sh <abs 008 path> --strict` |
| Scope | only the 1 launcher file + 008 packet docs touched | `git diff --cached --name-only` review |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### P2-1: PID guard inside bootstrap-lock critical section

Move `writeLeaseFile()` + `readLeaseFile()` reprobe + early-return-on-contention from the outer `try` body INTO the `if (lockHeld) {...}` block. The bootstrap lock is held throughout the `try` body via the `finally { releaseBootstrapLock() }` pattern, so this is a structural clarity fix: the visual lock-held region now equals the actual lock-held region.

### P2-2: Debug-log gate

Add a `debug(message)` helper near `log()`:

```text
function debug(message) {
  if (process.env.MK_SKILL_ADVISOR_DEBUG === '1') {
    process.stderr.write(`[mk-skill-advisor-launcher] [debug] ${message}\n`);
  }
}
```

Route 4 sensitive log sites through `debug()`. Lines 384 + 478 (childProcess on('error') + main catch) keep a one-line `log()` summary so operators see *that* something failed, with full stacks moved to `debug()`.

<!-- ANCHOR:affected-surfaces -->
### Affected surfaces

- `.opencode/bin/mk-skill-advisor-launcher.cjs`: ~30 line delta (helper add + 4 log-site changes + structural reflow).
<!-- /ANCHOR:affected-surfaces -->
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | What | Output |
|-------|------|--------|
| 1 | Add `debug()` helper | new function near `log()` |
| 2 | Route 4 log sites to `debug()` | 4 surgical edits |
| 3 | Restructure `main()` to move PID guard into `if (lockHeld)` | one block move |
| 4 | Verify: syntax, typecheck, vitest | green |
| 5 | Strict-validate 008 packet | `RESULT: PASSED` |
| 6 | Commit + push on `main` | single conventional commit |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No new tests. The existing launcher-lease.vitest.ts (11 tests) and launcher-bootstrap.vitest.ts (10 tests) cover the entire single-writer + lock + lease surface. The 008 changes:

- Don't change observable behavior — the lock semantics are identical, only the code structure is tightened.
- Don't change observable log content for the *log() operational lines* — those keep the same format.
- Do suppress debug-only stderr lines that no test ever asserted on.

If a future regression is needed in this area, add a `MK_SKILL_ADVISOR_DEBUG=1` capture test that asserts the debug() helper emits its lines.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Source dependencies: none new.
- Build dependencies: none new.
- Runtime dependencies: none new.
- Spec-folder dependencies: predecessor 007 supplies the P2 findings (verbatim file:line refs in `007/review/iterations/iteration-001.md` + `iteration-002-security.md`).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Single commit, single file. Revert via `git revert <008-commit-sha>` if either of the P2 fixes introduces observable regressions in operator workflows. The reverted state would simply restore 007's already-working behavior.
<!-- /ANCHOR:rollback -->
