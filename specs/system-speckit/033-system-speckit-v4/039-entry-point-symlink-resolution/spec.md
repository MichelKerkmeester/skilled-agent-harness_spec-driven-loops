---
title: "Feature Specification: A script reached through a link should still know it was run"
description: "Scripts decide whether to do their work by comparing the path they were launched with against the location they derive from their own file. Node canonicalizes the second and not the first, so reaching one through a symlink makes the two disagree, the work is skipped, and the process exits 0. One shared helper carries the comparison for most callers and has the same defect."
trigger_phrases:
  - "generator exits 0 without writing"
  - "validate passes but touched 0 files"
  - "isMainModule symlink"
  - "entry point guard worktree"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: A script reached through a link should still know it was run

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-09-12 |
| **Branch** | `skilled/v4.0.0.0` |
| **Origin** | Operator, after being shown the reproduction: "Fix it properly, own packet" |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

An executable module decides whether to run its work by asking whether it is the process
entrypoint. It answers by comparing the path it was launched with against the location it derives
from its own file. Node canonicalizes the second and leaves the first as typed, so any launch path
that passes through a symlink makes the two disagree. The module loads, the comparison reads
false, the work never runs, and the process exits 0.

Nothing errors and nothing is logged. The only symptom is absence, which is why the repository
already documents the effect without naming the cause: generators "silently no-op — exit 0, zero
output", and a triage row reads "strict-validate passes but touched 0 files".

Reproduced against this repository. The same generator, invoked with the same arguments, wrote its
output from the main checkout and produced nothing from a worktree whose build directory was a
link, exiting 0 both times.

The condition is ordinary rather than exotic. A worktree that shares a build directory, a checkout
reached through a symlinked parent, and a temporary directory under an aliased root all produce
it.

### Purpose

Make the comparison ask the question it means to ask: are these two names the same file. Fix it in
the one helper most callers already share, and move the callers that hand-rolled it onto that
helper, so a later reader finds one answer rather than five spellings of it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `isMainModule` in the shared ESM entry helper, which carries the comparison for its callers and
  has the defect.
- The modules that hand-roll the same comparison inline, migrated onto that helper.
- Coverage that fails when a module is reached through a link and passes when it is not.

### Out of Scope

- How worktrees share dependency roots. That was settled separately, and the runtime that provisions
  them already invokes these scripts by their canonical path.
- The guard's purpose. Whether a module should gate its work on being the entrypoint is unchanged;
  only the comparison is wrong.
- Compiled output under build directories, which is regenerated from the sources changed here.

### Files to Change

| File | Change |
|------|--------|
| `runtime/cli/lib/esm-entry.ts` | Compare canonical paths, so a link cannot make a file differ from itself |
| Modules with the comparison inline | Call the shared helper instead of restating it |
| Tests | A module reached through a link reports itself as the entrypoint |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

- **REQ-001**: `isMainModule` returns true when the module is the entrypoint, whether or not the
  launch path passed through a symlink, and false when it is merely imported.
- **REQ-002**: A launch path that does not exist, or that cannot be resolved, leaves the result
  false rather than raising. These modules run inside hooks and validators where a throw is worse
  than a wrong answer.

### P1 - Required (complete OR user-approved deferral)

- **REQ-003**: Modules carrying the comparison inline call the shared helper. Shapes that are
  already immune, such as matching on a filename, are left alone and the reason recorded.
- **REQ-004**: Coverage asserts the behaviour through a real symlink, and fails against the
  previous implementation.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success -->
## 5. SUCCESS CRITERIA

- **SC-001**: A module executed through a symlinked path performs its work, where it previously
  exited 0 having done nothing.
- **SC-002**: The same module, imported rather than executed, still does nothing.
- **SC-003**: The spec-kit suite passes, with the delta accounted for by the added cases.
<!-- /ANCHOR:success -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| A module that should stay dormant starts running | A hook or library executes work on import | Assert both directions: entrypoint true, imported false |
| Resolution throws on a path that no longer exists | A hook crashes where it previously returned false | Catch and fall back to the unresolved comparison |
| The failure mode is silence | A regression here announces nothing | Every case carries a negative control against the previous implementation |

**Critical Dependencies**: none. The change is local to the comparison and its callers.
<!-- /ANCHOR:risks -->

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

One filesystem resolution per process at startup. Not on any hot path.

### Reliability

The helper must not raise. A module that cannot resolve its launch path returns false, which is the
conservative answer and the one it already gives when no launch path exists.
