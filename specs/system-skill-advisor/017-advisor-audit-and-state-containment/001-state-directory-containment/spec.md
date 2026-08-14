---
title: "Feature Specification: Stray State-Directory Containment"
description: "Runtime writers resolve their state root from the current working directory, so any process running inside a skill or spec folder plants a nested .opencode tree there. Forty exist and 160 of their files are committed."
trigger_phrases:
  - "stray opencode directory"
  - "nested opencode state leak"
  - "advisor state containment"
  - "spec gate state leak"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/017-advisor-audit-and-state-containment/001-state-directory-containment"
    last_updated_at: "2026-07-27T17:20:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the spec from GPT-5.6-SOL research with three claims independently verified"
    next_safe_action: "Decide the anchoring strategy, then fix the shared resolver before the call sites"
    blockers: []
    key_files:
      - "spec.md"
      - "../research/leak-research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-advisor-018-001"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which anchor: repo-root marker discovery, git toplevel, or an explicit env var?"
    answered_questions:
      - "A deny-list guard is the wrong shape; the leak must be impossible into any subtree."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Stray State-Directory Containment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 001 of 002 |
| **Successor** | ../002-advisor-surface-audit/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Several runtime writers resolve their state directory from the current working directory rather than from the repository root. Any process whose CWD is inside a skill or spec folder therefore plants a nested `.opencode/` tree at that location. Forty such directories exist below the repository root and 160 of their files are tracked by git, so the leak is committed history rather than local litter.

This was already fixed once. `system-spec-kit/changelog/v3.6.0.0.md:153` records that the advisor resolver "refuses to land inside a `specs/` subtree" and that a regression test pins the behaviour. The fix and its test were both written as a deny-list for one subtree, so leaks into `skills/` were never in scope and continue today.

### Purpose

Make it structurally impossible for a runtime writer to place state anywhere except the repository root, and replace the deny-list test with one that pins the actual boundary.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Every writer that can create a nested `.opencode/` tree, not only the advisor.
- A single anchoring strategy applied through one shared helper.
- A regression test that fails on a leak into any subtree, not an enumerated set.
- Cleanup of the 40 existing directories, tracked ones first.
- A `.gitignore` backstop that catches a nested `.opencode` without ignoring the legitimate root one.

### Out of Scope

- The advisor's own surface audit, which phase 002 owns.
- Changing what state these writers persist; only where it lands.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-skill-advisor/mcp-server/lib/utils/workspace-root.ts` | Modify | Replace the specs-only guard with a repo-root anchor |
| `plugins/mk-spec-gate.js` | Modify | Stop deriving the state root from raw CWD |
| `plugins/mk-cli-dispatch-audit.js` | Modify | Same |
| `bin/mk-skill-advisor-launcher.cjs` | Modify | Close the self-perpetuating startup root path |
| `system-skill-advisor/mcp-server/tests/utils/workspace-root.vitest.ts` | Modify | Pin the real boundary |
| `.gitignore` | Modify | Nested-`.opencode` backstop |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:evidence -->
## 4. VERIFIED EVIDENCE

Three findings were independently re-verified by the orchestrator; the rest come from the research pass and carry its own file:line citations in `../research/leak-research.md`.

### The guard is a deny-list, not a boundary

`system-skill-advisor/mcp-server/lib/utils/workspace-root.ts` tests only for `specs` path segments at lines 44 and 49. A CWD anywhere under `skills/` passes straight through. Strays exist in `skills/system-spec-kit/`, `skills/sk-doc/create-diff/` and `skills/cli-external-orchestration/cli-opencode/`.

### The regression test encodes the wrong contract

`mcp-server/tests/utils/workspace-root.vitest.ts` opens by stating the resolver "must never hand back a directory inside a `specs/` packet tree", and its describe block is named `fallback never lands inside a specs/ tree`. The test cannot catch a `skills/` leak because it was written to assert only the `specs/` case. It does not merely miss the bug; it ratifies the narrow contract that permits it.

### The same idiom repeats across plugins

Two plugins derive a write root from the working directory with no repository anchoring:

- `plugins/mk-spec-gate.js:160` — `const projectDir = ctx?.directory || process.cwd();` then `resolveGuardPaths(projectDir)`
- `plugins/mk-cli-dispatch-audit.js:45` — the same expression, then `join(projectDir, DEFAULT_LOG_RELATIVE_PATH)`

This is a repeated idiom rather than one subsystem's mistake, which is why fixing the advisor alone did not stop the leak.

### Additional writers named by the research

`bin/mk-skill-advisor-launcher.cjs`, `cli-opencode/scripts/lib/dispatch-audit.mjs`, `system-code-graph/runtime/lib/code-graph/freshness-core.cjs`, `system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs`, and `system-deep-loop/runtime/lib/legacy-projections/legacy-projection-manifest.ts`. Each must be confirmed at its cited line before any edit.
<!-- /ANCHOR:evidence -->

---

<!-- ANCHOR:requirements -->
## 5. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | State resolution is anchored to the repository root, not to CWD | No writer derives a write root from `process.cwd()` without anchoring |
| REQ-002 | The guard forbids every nested location, not an enumerated set | A leak attempt from any subtree fails, including ones nobody listed |
| REQ-003 | The regression test pins the boundary rather than one subtree | The test fails if a leak lands under `skills/`, `commands/`, `bin/` or a path invented after the test was written |
| REQ-004 | Every writer named in the evidence is confirmed at its cited line before edit | Each change cites a re-run of its own evidence command |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The 40 existing directories are removed, tracked ones untracked first | `find` for nested `.opencode` returns zero |
| REQ-006 | A `.gitignore` backstop catches recurrence without ignoring the root `.opencode/` | `git check-ignore` proves both behaviours |
| REQ-007 | One shared helper owns the anchoring, so a new writer inherits it | New call sites cannot reintroduce the raw-CWD idiom by copying a neighbour |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- **SC-001**: Zero nested `.opencode/` directories exist and none can be recreated by running a writer from inside a skill folder.
- **SC-002**: The regression test fails when a leak is introduced into a subtree that did not exist when the test was written.
- **SC-003**: Every writer resolves its state root through one shared, anchored helper.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An anchor that walks up for a marker finds the wrong root inside a git worktree or a vendored subtree | High | Test explicitly against `.worktrees/` and a vendored `node_modules` tree |
| Risk | Deleting tracked state files breaks a daemon holding a lease | Medium | Untrack before deleting; stop daemons or verify they recreate state at the correct root |
| Risk | A `.gitignore` pattern broad enough to catch nested `.opencode` also ignores the root one | High | Prove both cases with `git check-ignore` before committing |
| Risk | Fixing writers piecemeal leaves the idiom copyable | Medium | Land the shared helper first, then convert call sites to it |
| Dependency | The research report's writer list | Blocks a complete fix | `../research/leak-research.md` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- Which anchor is correct: walking up for a repository marker, `git rev-parse --show-toplevel`, or an explicit environment variable set by the launcher? Each fails differently inside worktrees and vendored trees, and the research compares them.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research**: `../research/leak-research.md`
- **Phase parent**: `../spec.md`
- **Prior fix that regressed**: `system-spec-kit/changelog/v3.6.0.0.md:153`
