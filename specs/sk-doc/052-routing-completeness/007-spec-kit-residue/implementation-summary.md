---
title: "Implementation Summary [template:level-3/implementation-summary.md]"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation summary"
  - "adr disposition"
  - "coverage graph repoint"
  - "injectable project root"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/007-spec-kit-residue"
    last_updated_at: "2026-09-03T05:00:00Z"
    last_updated_by: "spec-kit-residue-implementer"
    recent_action: "Resolved adjacent findings A1, A2 and A3. The coverage-graph suite is fully green"
    next_safe_action: "Close the packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/memory/generate-context.ts"
      - ".opencode/skills/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts"
      - ".opencode/skills/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts"
      - ".opencode/skills/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-kit-residue-decisions"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-spec-kit-residue |
| **Completed** | 2026-09-02 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Eight recorded decisions went in, two pieces of code came out, and the difference is the point.
Five of the eight would have edited files that `049-memory-decommission` deletes outright, so
they are closed as superseded with the paths that prove it rather than implemented into a tree
with a delete order against it. The two that survive that test are done: a family of tests that
had been dark for three and a half months runs again, and the save-path CLI test stopped writing
into the repository every time it ran.

### Coverage-graph tests, restored

Four test files under `scripts/tests/` imported `../../mcp-server/lib/coverage-graph/*`, which
has not existed since the modules were renamed out of the memory server in May and moved again
in July. A static ESM import that cannot resolve kills the whole file, so each of the four
collected zero tests and reported as a failure with no diagnosis.

Three of them needed one changed import specifier each, because the subject was moved, not
deleted, and `system-deep-loop/runtime/lib/coverage-graph/` still exports every symbol they
name. The fourth, `session-isolation.vitest.ts`, also imported five `handlers/coverage-graph/*`
modules that were genuinely retired with no aliases and no relocated equivalent, so it was
deleted.

Forty-seven assertions came back. Two failed, and both were real drift that accumulated while
the tests were dark, an empty-graph verification rate and the direction of a review coverage
gap. They were written up as contract questions rather than silenced.

### The two contract questions, ruled

The operator ruled that the tests follow the producer, and that no `system-deep-loop` runtime
code changes. Both producers were read first, and both already document the behaviour the tests
were contradicting. `computeResearchClaimVerificationRateFromData` carries a doc comment saying
an empty claim set is a vacuous pass returning `1.0`, because scoring it `0` would raise a
blocker no unverified claim can clear and loop a converged graph forever.
`getCoverageGapRequirements` pairs `{ DIMENSION, outgoing }` with `{ FILE, incoming }`, and the
runtime's own `tests/unit/coverage-graph-query.vitest.ts:182` asserts that direction on purpose.
The cross-layer fixture's single `review-dimension --COVERS--> review-file` edge satisfies both
requirements at once, so the right expectation there is no gap at all.

Neither assertion was loosened. Each now states the current contract with its reason in a
one-line comment, and the empty-graph test was renamed to name the vacuous pass it checks. The
parity comment in `lib/coverage-graph-convergence.cjs` still pointed at the pre-move MCP handler
path, so that dangling pointer was repaired in the same pass. It is comment-only, in the file
both repaired tests load as their parity subject.

### A project root you can point somewhere else

`generate-context.ts`'s `main()` acquires a lock directory inside the packet it resolves and
rewrites the parent's pointer metadata. Its test named a packet that had been archived under a
different track, so the write guard rejected it and seven tests died on `process.exit(1)`. The
cheap fix, repoint the fixture at the packet's current home, would have turned seven tests
green by having every run mutate a real archived packet.

Instead `main()` now takes the project root the way it already takes `argv` and `stdinReader`:
a third parameter with today's value as its default. One assignment binds it into `CONFIG`
before parsing, which is enough because every resolver downstream already reads the root from
there. The test builds a throwaway packet under a temp root per case and deletes it afterwards.
Production behavior is unchanged, and the suite no longer depends on the shape of the real
`specs/` tree.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/scripts/tests/coverage-graph-integration.vitest.ts` | Modified | Repoint one import at the deep-loop runtime. Correct the stale layer name in the header |
| `.opencode/skills/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts` | Modified | Repoint three imports at the deep-loop runtime. Align the two drifted expectations with their producers |
| `.opencode/skills/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs` | Modified | Repoint the stale parity comment at the deep-loop runtime. Comment only |
| `.opencode/skills/system-spec-kit/scripts/tests/graph-convergence-parity.vitest.ts` | Modified | Repoint one import at the deep-loop runtime |
| `.opencode/skills/system-spec-kit/scripts/tests/session-isolation.vitest.ts` | Deleted | Depends on five MCP handler modules retired with no relocated equivalent |
| `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts` | Modified | `main()` takes a defaulted project root and binds it before parsing |
| `.opencode/skills/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts` | Modified | Fixture becomes a throwaway packet under a temp root, track metadata included |
| `specs/sk-doc/052-routing-completeness/007-spec-kit-residue/decision-record.md` | Modified | Eight resolutions, two outcomes, the daemon-recycle entry, four adjacent findings |
| `specs/sk-doc/052-routing-completeness/007-spec-kit-residue/tasks.md` | Modified | Real task ledger and verification checklist |
| `specs/sk-doc/052-routing-completeness/007-spec-kit-residue/acceptance-criteria.md` | Modified | AC-004 met, AC-005 and AC-006 added, closure statement written |
| `specs/sk-doc/052-routing-completeness/007-spec-kit-residue/spec.md` | Modified | Status, scope and files-to-change reconciled |
| `specs/sk-doc/052-routing-completeness/007-spec-kit-residue/implementation-summary.md` | Modified | This document |
| `specs/sk-doc/052-routing-completeness/007-spec-kit-residue/goal.md` | Modified | Log updated with the dispositions and the evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each ADR was checked path by path against the `Delete` list in
`049-memory-decommission/003-spec-memory-server-removal/spec.md` §3 before any edit, and every
subject path was confirmed to exist on disk first, so the supersession rests on the current tree
rather than on the ADR's own prose.

Both implemented decisions were run red first with the workspace's own vitest invocation
(`npx vitest run --config ../mcp-server/vitest.config.ts <file>` from `scripts/`), so the same
command proves the change. Output and exit status were read on every run.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Supersede rather than implement five ADRs | Every file they would edit is inside the 1,480-file `mcp-server/` tree that 049 deletes. A green check the delete throws away is not worth the edit, and 049 being Draft does not change that |
| Bind the injected root through `CONFIG` rather than thread a parameter | Four downstream resolvers already read the root from `CONFIG`, which the module documents as mutable runtime config. Threading would have changed four exported helpers to serve one seam |
| Give the ADR-008 fixture a track-level `graph-metadata.json` | A track folder holding `NNN-` children is a phase parent, so the save path rewrites its pointers. Without that file the temp workspace was not a faithful replica and the run failed on ENOENT |
| Leave the two repointed failures red | They are genuine drift in a tree outside this scope, and which side is right is a contract question. Editing the assertions would have written the drift down as the specification |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| ADR-005 baseline, four files | FAIL as expected, `Test Files 4 failed (4)`, `Tests no tests`, each `Cannot find module '../../mcp-server/lib/coverage-graph/…'` |
| ADR-005 after repoint, three files | `Test Files 1 failed \| 2 passed (3)`, `Tests 2 failed \| 47 passed (49)`. The two failures are adjacent findings A1 and A2 |
| A1 and A2, three files plus the ADR-008 control | PASS, `Test Files 4 passed (4)`, `Tests 60 passed (60)`, exit 0 |
| Deep-loop runtime coverage-graph suite, query, signals and db | PASS, `Tests 42 passed (42)`, exit 0. Runtime assertions unchanged |
| ADR-008 baseline | FAIL as expected, `Tests 7 failed \| 4 passed (11)`, all seven `process.exit unexpectedly called with "1"` |
| ADR-008 after change | PASS, `Tests 11 passed (11)`, exit 0 |
| `npm run typecheck` (`system-spec-kit/scripts`) | PASS, exit 0 |
| Repository writes from the ADR-008 suite | None. `git status` shows no lock directory and no packet metadata churn from the run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Six documents still print the pre-move coverage-graph path.** Only the parity comment in
   `lib/coverage-graph-convergence.cjs` was repaired. The prose copies are recorded, not fixed.
2. **The workspace typecheck lane does not cover test files.** `scripts/tsconfig.json` excludes
   `tests/**/*.vitest.ts`, so the two edited test files were verified by running them, not by
   type-checking them. Adjacent finding A4.
3. **A timed-out `main()` can cascade.** On a loaded machine one combined run had the first
   CLI-authority test exceed the 30s bound during module import, and its still-running `main()`
   left a canonical save lock that failed the next test. A rerun of the same four files finished
   in 8 seconds with 58 of 60 passing. The window is new, because before this change `main()`
   aborted at the write guard and never took a lock. It is a flake under contention, not a
   failure of the fixture, and it is recorded rather than engineered around.
4. **Five ADRs are closed without their fix.** If 049 is abandoned, ADR-001 to ADR-004 and
   ADR-007 come back with their decisions intact, the resolutions deliberately keep the
   operator's decision text.
<!-- /ANCHOR:limitations -->

---


