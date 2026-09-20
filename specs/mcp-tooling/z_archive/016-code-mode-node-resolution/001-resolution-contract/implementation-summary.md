---
title: "Implementation Summary"
description: "The declared engine range is now answerable at runtime: a resolver reads engines.node from the server manifest and returns a satisfying interpreter, or nothing at all."
trigger_phrases:
  - "node engine resolver summary"
  - "resolution contract shipped"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/016-code-mode-node-resolution/001-resolution-contract"
    last_updated_at: "2026-08-29T10:02:02Z"
    last_updated_by: "session"
    recent_action: "Recorded the answers to this phase's open questions"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files:
      - ".opencode/bin/lib/node-engine-resolver.cjs"
      - ".opencode/bin/lib/node-engine-resolver.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 1 of 5 |
| **Status** | Complete |
| **Completed** | 2026-08-28 |
| **Branch** | `skilled/v4.0.0.0` |
| **Executor** | gpt-5.6-luna, xhigh reasoning, fast tier, via the runtime's single-shot codex adapter |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A resolver that turns a declared engine range into an interpreter path, or into a documented absence.

`resolveNodeInterpreter({ manifestPath })` returns `{ path, range, reason }`. On success `reason` is null and `range` reports what was satisfied. On failure `path` is null and `reason` distinguishes four cases: `unsatisfied` when candidates exist but none is in range, `unsupported-range` when the declared syntax is not one the parser implements, and `unreadable-manifest` or `missing-manifest` when the declaration cannot be read at all.

Candidate enumeration covers the running interpreter, the search path, and the nvm, fnm and volta version directories, tolerating absent ones. Nothing is executed to decide; the search reads directories only.

### Files Changed

| File | Change |
|------|--------|
| `.opencode/bin/lib/node-engine-resolver.cjs` | Created - range parsing, candidate enumeration, selection |
| `.opencode/bin/lib/node-engine-resolver.test.cjs` | Created - eight tests over fixture and real hosts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Dispatched to an external executor through the deep-loop runtime's single-shot codex adapter, with the code-agent persona inlined and the spec folder marked pre-approved. The returned work was then verified independently by the orchestrator rather than accepted on the executor's own report.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Refuse unknown range syntax rather than approximate it.** The downstream failure is an uncatchable segfault, so a parser that guesses is worse than one that declines. Anything outside the implemented syntax returns `unsupported-range`.
- **Injected host access.** Directory listing and file reading arrive as parameters, which is what makes the unsatisfiable case testable without uninstalling an interpreter.
- **No semver dependency.** The parser covers the range forms the manifest actually declares; a dependency would outweigh the parsing it replaces.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test` on the new suite | 8 pass, 0 fail |
| Workspace node gate | 74 files, 757 pass, 1 fail |
| `node --check` on the resolver | Clean |
| Real host answer | `/Users/michelkerkmeester/.nvm/versions/node/v24.9.0/bin/node`, matching the interpreter six host configs name today |
| Unsatisfiable fixture | `{ path: null, reason: 'unsatisfied' }` with the range reported |
| Range-change fixture | A `>=22 <23` manifest selects the v22 interpreter with no resolver edit |
| Unknown-syntax fixture | `{ path: null, reason: 'unsupported-range' }` |
| Comment hygiene | No spec paths or artifact ids in either file |

The single gate failure is `cache TTL starts when bridge work completes`, a timing-sensitive test that passes 28 of 28 in isolation and was already failing intermittently before this phase. The executor separately reported 36 failures; that run was made from inside its own live process and polluted the `session-cleanup live process tree` assertions, which is why the orchestrator re-ran the gate from a clean environment rather than accepting the number.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The parser implements a lower bound with an exclusive upper bound and a bare major shorthand. Any other range form is declined rather than interpreted, which is deliberate but means a future manifest using caret or tilde syntax needs a parser change rather than working by accident.
- Candidate enumeration is layout-based. A version manager that stores interpreters somewhere other than the three known layouts is invisible unless it also appears on the search path.
- The resolver reports what the manifest declares. It does not read the compiled addon's own ABI, so a manifest that drifts from the addon it ships alongside would be believed.
<!-- /ANCHOR:limitations -->

---
