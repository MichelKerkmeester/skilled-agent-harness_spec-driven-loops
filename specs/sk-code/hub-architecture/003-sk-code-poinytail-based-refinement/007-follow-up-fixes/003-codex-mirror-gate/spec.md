---
title: "Feature Specification: Phase 3: codex-mirror-gate"
description: "The agent-mirror gate skips a commit that changes only a Codex agent mirror, so a Codex-only desync or orphan passes unchecked."
trigger_phrases:
  - "codex mirror gate"
  - "phase 3 codex mirror gate"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: codex-mirror-gate

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/092-sk-code-ponytail-refinement` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-leaf-generator-ignores |
| **Successor** | 004-hook-stdin-deadline |
| **Handoff Criteria** | The six completion criteria in goal.md pass, and validate.sh --strict prints RESULT: PASSED |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Follow-up fixes for the sk-code Ponytail refinement specification.

**Scope Boundary**: The agent-mirror checker's path pattern and orphan check, and the staged-path filter in each of the two pre-commit hooks. The shared verifier library and the Codex content comparison do not change.

**Dependencies**:
- None within the phase set. Phase 002 edits a different generator and shares no file with this phase.
- The twelve Codex mirrors in `.codex/agents/` stay as they are. All twelve match their canonical bodies today, as `--all` shows.

**Deliverables**:
- A `.codex/agents/<name>.toml` path names agent `<name>` for the checker
- A Codex mirror whose canonical is missing is reported as an orphan
- Both pre-commit hooks pass staged `.codex/agents/` paths to the checker
- Three Codex regression cases in the checker's existing Vitest file

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The agent-mirror gate recognizes three roots: `.opencode/agents/`, `.skilled/agents/` and `.claude/agents/`. Both pre-commit hooks filter staged paths with the same three-root pattern before they call the checker, so a commit that changes only `.codex/agents/<name>.toml` never reaches the checker and passes unchecked. When the checker is called with a Codex path directly, it prints `no agent files to check` and exits 0. The orphan check also looks only for the Claude mirror, so a Codex mirror left behind after its canonical is deleted is never reported.

### Purpose
A commit that touches a Codex agent mirror is compared with its canonical body, and a Codex mirror whose canonical is gone blocks the commit.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `codex` to the checker's agent path pattern.
- Add `codex` to the staged-path filter in both pre-commit hooks.
- Add the Codex mirror to the checker's orphan check, beside the Claude mirror.
- Add three Codex regression cases to the existing Vitest file for the checker.

### Out of Scope
- `.pi/agents/`, `.cursor/agents/`, `.devin/agents/` and `.hermes/agents/` have the same gap. This phase records it in plan.md and does not fix it, because each one needs a decision on whether it is a repo-managed mirror.
- `--all` lists canonical names only, so it never reports an orphan mirror, for `.claude` or for `.codex`. Changing that is a separate fix.
- The shared verifier library. Its runtime list already includes Codex, and its Codex comparison already runs under `--all`.
- A hook-level case in `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`. It is not in the Files to Change table, so it is a proposed follow-up.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs` | Modify | Codex in the agent path pattern (line 32), the comment above it, and the orphan check (lines 82 to 88) |
| `.skilled/hooks/git/pre-commit` | Modify | Codex in the staged-path filter (line 87) |
| `.skilled/scripts/git-hooks/pre-commit` | Modify | Codex in the staged-path filter (line 170) |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/shared/tests/check-agent-mirror-sync.vitest.ts` | Modify | Three Codex regression cases added inside the existing describe block |
| `scratch/before/` inside this folder | Create | Pre-edit copies of the five files above, used by the diff checks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The checker names agent `<name>` from a `.codex/agents/<name>.toml` path | `node <checker> .codex/agents/code.toml` prints a line containing `1 agent(s) checked` and exits 0. Before the fix it prints `no agent files to check` and exits 0 |
| REQ-002 | A Codex mirror with no `.opencode` canonical is reported as an orphan and blocks | With the canonical absent, the checker prints a `DRIFT` line that names the Codex path and exits 1. Proven by the orphan Vitest case |
| REQ-003 | Both pre-commit hooks pass staged `.codex/agents/` paths to the checker | `grep -n 'claude|codex)/agents' .skilled/hooks/git/pre-commit .skilled/scripts/git-hooks/pre-commit` prints two lines, at lines 87 and 170, and exits 0 |
| REQ-004 | `--all` still checks every canonical agent and exits 0 | `node <checker> --all` prints `12 agent(s) checked` and exits 0 |
| REQ-005 | Both hook scripts still parse | `bash -n` exits 0 on each hook |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Three Codex regression cases in the checker's Vitest file | The Vitest file reports 6 passed, and the three new cases fail before the checker edit |
| REQ-007 | The shared library and the Codex content comparison do not change | `diff` of the library against `scratch/before/mirror-sync-verify.cjs` prints nothing and exits 0 |
| REQ-008 | The `.pi/agents/` gap is recorded in plan.md and not fixed | plan.md names `.pi/agents/`, and `node <checker> .pi/agents/code.md` still prints `no agent files to check` and exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A commit that stages only `.codex/agents/<name>.toml` reaches the checker from both hooks.
- **SC-002**: A Codex mirror with no canonical blocks the commit with exit 1.
- **SC-003**: The 12-agent `--all` result is unchanged, and both hooks still parse.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The global hook path runs the main checkout's copy of the second hook | High | `core.hooksPath` resolves to `~/.config/git/hooks`, and its `pre-commit` links to `Public/.skilled/scripts/git-hooks/pre-commit` in the main checkout. That copy still has the old filter at line 170. Commits made in this worktree keep the old filter until this change reaches that checkout. Running the worktree hook by hand proves the file, not the live gate |
| Risk | Deleting an agent now blocks unless its `.codex` mirror is deleted in the same commit | Medium | This is the rule the Claude mirror already follows. Delete every mirror of an agent together |
| Risk | `--all` never reports an orphan mirror | Medium | The orphan proof runs in path mode only (REQ-002). Recorded as out of scope |
| Risk | The Vitest binary is not on PATH | Medium | It is at `.skilled/skills/system-spec-kit/node_modules/.bin/vitest` (4.1.11). The comment in `vitest.config.mjs` says the binary resolves from the repo-root install, which is not true in this worktree |
| Risk | `README.txt` in a mirror folder is counted as an agent named `README` | Low | Already true for `.claude/agents/README.txt`, which prints `1 agent(s) checked`. Not changed here |
| Dependency | `system-deep-loop/node_modules` provides `@spec-kit/shared` | Medium | Present in this worktree. Without it the checker fails with MODULE_NOT_FOUND |

## 7. OPEN QUESTIONS

- Should `.pi/agents/`, `.cursor/agents/`, `.devin/agents/` and `.hermes/agents/` join the gate? That needs the operator's decision. This phase does not decide it.
- Should the orphan check read its mirror list from `RUNTIME_MIRRORS` in the library instead of a literal list? That is a proposed follow-up, not part of this phase.
<!-- /ANCHOR:risks -->

---
