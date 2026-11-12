---
title: "Feature Specification: Phase 1: shim-wrapper-trust"
description: "The shell shim runs any `.skilled/bin/skilled-loop` it finds at or above `$PWD`, so a cloned repository or unpacked archive can execute code as the operator before the runtime starts. One resolver serves all six runtime functions, so one trust check covers them."
trigger_phrases:
  - "shim wrapper trust"
  - "phase 1 shim wrapper trust"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: shim-wrapper-trust

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/351-session-relaunch-review-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 7 |
| **Predecessor** | None |
| **Successor** | 002-state-dir-read-check |
| **Handoff Criteria** | `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 0 and holds a test where a wrapper outside the sourced checkout is not run. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Remediate the eight findings of the in-session handover review of the session relaunch loop specification.

**Scope Boundary**: Wrapper trust in `.skilled/bin/skilled-loop-shell.sh` only. The wrapper `.skilled/bin/skilled-loop` is not changed.

**Dependencies**:
- None. This phase runs first.

**Deliverables**:
- A trust check in the shim, a failing-then-passing test, and the shim paragraph in `.skilled/bin/README.md` and `.skilled/hooks/session-relaunch/README.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`skilled_loop_find_wrapper` walks up from `$PWD` and prints the first `.skilled/bin/skilled-loop` it finds, and `skilled_loop_launch` runs that file with `bash` at line 189. Nothing checks whose file it is, so a cloned repository or unpacked archive that holds `.skilled/bin/skilled-loop` runs code as the operator before the runtime starts. One resolver serves all six runtime functions.

### Purpose
Run a wrapper only when it belongs to the checkout the shim was sourced from, and run the plain runtime binary otherwise.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ rg -n 'skilled_loop_find_wrapper|bash "\$wrapper"' .skilled/bin/skilled-loop-shell.sh
48:  skilled_loop_find_wrapper
160:skilled_loop_find_wrapper() {
189:    bash "$wrapper" "$runtime" "$@"
```

The first line is the resolver's summary. The second is the resolver definition at line 160. The third is the unguarded launch at line 189, which is the call the trust check must guard.
<!-- /ANCHOR:measured-behavior -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record the real path of the checkout the shim was sourced from once at source time.
- Run a wrapper only when its real path is inside that checkout.
- Trust a wrapper inside a linked git worktree of the sourced checkout, listed by `git -C <sourced checkout> worktree list --porcelain`.
- Trust a wrapper inside a checkout named in `SKILLED_LOOP_TRUSTED_CHECKOUTS`, a colon-separated list of absolute paths the operator sets.
- Ignore any other wrapper and run the plain runtime binary.
- Add a test that fails before the fix and passes after it.
- Document the trust rule in `.skilled/bin/README.md` and `.skilled/hooks/session-relaunch/README.md`.

### Out of Scope
- `.skilled/bin/skilled-loop` - the wrapper is not changed.
- Any runtime adapter or hook - the finding names the shim resolver only.
- A file that stores trusted checkouts - the environment variable is enough, and no current install needs a file.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/skilled-loop-shell.sh` | Modify | Capture the sourced checkout and guard `skilled_loop_find_wrapper` with a real-path check. |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` | Modify | Add a failing-then-passing case for a wrapper outside the sourced checkout. |
| `.skilled/bin/README.md` | Modify | State the trust rule in the shell shim row. |
| `.skilled/hooks/session-relaunch/README.md` | Modify | State the trust rule in the shim paragraph. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A wrapper whose real path is outside the checkout the shim was sourced from is not run. `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 0 and holds a case where the planted wrapper is ignored and the plain binary runs. |
| REQ-005 | A wrapper inside a linked git worktree of the sourced checkout runs, and the worktree list is read from the sourced checkout, never from the directory being judged. `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 0 and holds a case where a registered worktree's wrapper resolves and a directory that only claims to be a worktree does not. |
| REQ-002 | A wrapper whose real path is inside the sourced checkout still runs, including when the repository's `.skilled` is a symlink to that checkout. `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 0 under bash and zsh. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The shim still parses under bash 3.2 and zsh and sets no shell option. `/bin/bash -n .skilled/bin/skilled-loop-shell.sh` and `/bin/zsh -n .skilled/bin/skilled-loop-shell.sh` both exit 0, and `rg -n 'setopt\|set -[a-z]' .skilled/bin/skilled-loop-shell.sh` prints only the line inside the `skilled_loop_resolve` subshell. |
| REQ-008 | The worktree query ignores an inherited `GIT_DIR`, `GIT_COMMON_DIR` or `GIT_WORK_TREE`, and the shim prints and launches the real path it checked, not the path through a symlink that can change after the check. `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 0 and holds a case with `GIT_DIR` pointing at the planted repository. |
| REQ-007 | A shim that cannot name its own checkout trusts nothing through it and never asks git. That covers a shim sourced through a symlinked file under zsh, a shim outside a `.skilled/bin` directory, and a copy of the shell that kept the functions and lost the stored checkout. `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 0 and holds a case for the symlinked shim file and one for the lost value. |
| REQ-006 | A wrapper inside a checkout listed in `SKILLED_LOOP_TRUSTED_CHECKOUTS` runs, and an empty or unset variable trusts nothing extra. `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 0 and holds both cases. |
| REQ-004 | Both README files name the trust rule. `rg -l 'sourced checkout' .skilled/bin/README.md .skilled/hooks/session-relaunch/README.md` prints both paths. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 0 with the outside-wrapper case passing.
- **SC-002**: `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` fails on the outside-wrapper case before the fix and exits 0 after it.
- **SC-003**: `/bin/bash -n .skilled/bin/skilled-loop-shell.sh` and `/bin/zsh -n .skilled/bin/skilled-loop-shell.sh` both exit 0.
- **SC-004**: `rg -l 'sourced checkout' .skilled/bin/README.md .skilled/hooks/session-relaunch/README.md` prints both README paths.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `/bin/bash` and `/bin/zsh` on the operator's machine | The cross-shell cases cannot run | Keep the case in the file and let the test harness skip a missing shell |
| Risk | Real-path resolution rejects the legitimate symlinked `.skilled` case | High: a linking repository stops hopping | Test both the planted outside wrapper and the symlinked inside wrapper in the same suite |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A launch adds one real-path resolution and no package install or network call.
- **NFR-P02**: N/A: the suite is a local `node --test` run with no throughput target.

### Security
- **NFR-S01**: A wrapper outside the sourced checkout never runs, proven by an adversarial test that plants one.
- **NFR-S02**: A repository whose `.skilled` is a symlink to the sourced checkout still qualifies, because the check compares real paths.

### Reliability
- **NFR-R01**: N/A: the shim runs no service and has no uptime target.
- **NFR-R02**: N/A: the shim makes no requests and has no error-rate target.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no `.skilled/bin/skilled-loop` exists at or above `$PWD`, so the resolver prints nothing and the plain binary runs.
- Maximum input: a wrapper reached through a repository whose `.skilled` is a symlink to the sourced checkout resolves inside it and still runs.
- Failure path: a wrapper outside the sourced checkout is ignored and `command "$binary" "$@"` runs, so the runtime's own exit code stands.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One shim, one test file and two README paragraphs |
| Risk | 12/25 | Security boundary in code sourced into the operator's shell |
| Research | 6/20 | Real-path resolution that reads the same in bash 3.2 and zsh |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Decided on 2026-11-12 before implementation: the operator's extra trusted checkouts live in the environment variable `SKILLED_LOOP_TRUSTED_CHECKOUTS`, and linked worktrees of the sourced checkout are trusted without configuration, because every worktree session would otherwise lose the loop.
<!-- /ANCHOR:questions -->

---
