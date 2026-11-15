---
title: "Feature Specification: Phase 7: loop-start-record-cleanup"
description: "The skilled-loop wrapper sets its loop id to its own process id and never removes a relaunch record that already carries that id, so a record left behind by a closed terminal survives. A later wrapper that receives the same process id reads that unrelated record when its runtime exits and prints a warning or a claim command for it. Phase 7 removes the wrapper's own leftover record before the first launch."
trigger_phrases:
  - "loop start record cleanup"
  - "phase 7 loop start record cleanup"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: loop-start-record-cleanup

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/351-session-relaunch-review-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-append-lock-stale-reclaim |
| **Successor** | None |
| **Handoff Criteria** | `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 with a case where a planted `relaunch-<pid>.json` is gone before the first launch. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Remediate the eight findings of the in-session handover review of the session relaunch loop specification.

**Scope Boundary**: One cleanup step at wrapper start in `.skilled/bin/skilled-loop`. Loop id generation is not changed.

**Dependencies**:
- Phase 003 edits the same file and lands first.

**Deliverables**:
- The start-up cleanup and a test with a planted leftover record that fails today.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.skilled/bin/skilled-loop` exports `SKILLED_LOOP_ID="$$"` at line 799 and never removes the record file `relaunch-<loop id>.json` that carries that id. When a terminal closes while such a record exists, for example after a withdrawn hand-over, the record stays in the per-user state directory. A later wrapper that receives the same process id then reads that unrelated record when its runtime exits and prints a warning or a claim command for a note it never handled.

### Purpose
The wrapper removes its own leftover record before the first launch, so a wrapper never reads a record that predates its loop.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ rg -n 'SKILLED_LOOP_ID="\$\$"|relaunch-' .skilled/bin/skilled-loop
32:relaunch_core="$script_directory/../hooks/session-relaunch/lib/relaunch-core.cjs"
799:export SKILLED_LOOP_ID="$$"
```

Line 799 sets the loop id from the wrapper's process id. The only other match is the core module path at line 32, so the file holds no line that removes a record named `relaunch-<loop id>.json`.
<!-- /ANCHOR:measured-behavior -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove `relaunch-<loop id>.json` from the per-user state directory before the first launch in `.skilled/bin/skilled-loop`.
- Remove only the wrapper's own record file, leaving every other loop's record in place.
- Add a regression case with a planted leftover record to `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`.

### Out of Scope
- Loop id generation, because the fix keeps the process id as the loop id.
- A signal trap, because this phase adds none.
- Records of other loops, because a live wrapper may still own one.
- The relaunch record format and the CLI, because the cleanup removes one file and reads no field.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/bin/skilled-loop | Modify | Remove the wrapper's own leftover relaunch record before the first launch |
| .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs | Modify | Add a case with a planted leftover record and a guard for another loop's record |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Before the first launch, the wrapper removes `relaunch-<its process id>.json` from the per-user state directory. Verify: `node --test --test-name-pattern 'own leftover relaunch record' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# pass 1` and `# fail 0`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The cleanup removes only the wrapper's own record file, so a planted `relaunch-<other loop id>.json` stays. Verify: `node --test --test-name-pattern 'record for another loop is kept' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# pass 1` and `# fail 0`. |
| REQ-003 | The rest of the wrapper suite keeps its behavior. Verify: `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 and prints `# fail 0`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test --test-name-pattern 'own leftover relaunch record' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# pass 1` and `# fail 0`.
- **SC-002**: `node --test --test-name-pattern 'record for another loop is kept' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# pass 1` and `# fail 0`.
- **SC-003**: `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 and prints `# fail 0`.
- **SC-004**: `rg -n 'relaunchFilePath' .skilled/bin/skilled-loop` prints one line, the cleanup's path lookup.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003's edits to `.skilled/bin/skilled-loop` | The cleanup rebases onto a changed startup section | Land after phase 003 and rerun the full wrapper suite |
| Dependency | `node` with `node --test` for the wrapper suite | No regression case can run | The handoff criterion cannot be met until the runtime is installed |
| Risk | A path mistake removes another loop's record | Med | Build the path through `relaunchFilePath` from the wrapper's own loop id and assert that a second planted record survives |
| Risk | `set -euo pipefail` turns a failed removal into a failed launch | Med | Remove with `rm -f --` and ignore a removal failure, so a record that cannot be removed leaves the launch intact |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The cleanup adds at most one `node -e` path lookup and one file removal before the first launch.
- **NFR-P02**: N/A: the wrapper starts once per operator launch, so no throughput target applies.

### Security
- **NFR-S01**: N/A: the wrapper authenticates no user.
- **NFR-S02**: The cleanup removes only `relaunch-<loop id>.json`, and the loop id comes from the wrapper's own process id.

### Reliability
- **NFR-R01**: N/A: no uptime target applies to a local wrapper.
- **NFR-R02**: A record that is absent or cannot be removed does not stop the launch.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no `relaunch-<loop id>.json` exists, so `rm -f --` removes nothing and the launch proceeds.
- Maximum input: the loop id is the decimal process id, so the file name is bounded and only that exact name is removed.
- Failure path: a record that cannot be removed stays in place and the wrapper still launches the runtime.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | One cleanup step in `.skilled/bin/skilled-loop` and one test file |
| Risk | 3/25 | Removes one file and adds no trap, record field or interface |
| Research | 2/20 | The loop id export and `relaunchFilePath` are read in full |
| **Total** | **9/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None
<!-- /ANCHOR:questions -->

---
