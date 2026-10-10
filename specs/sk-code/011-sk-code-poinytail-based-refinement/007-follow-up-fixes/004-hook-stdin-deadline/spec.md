---
title: "Feature Specification: Phase 4: hook-stdin-deadline"
description: "The shared CommonJS stdin reader waits for a host that never closes stdin, so a hook runs until the host's own timeout kills it. This phase gives the reader one deadline and points the three post-edit adapters that carry their own copy at the shared helper."
trigger_phrases:
  - "hook stdin deadline"
  - "phase 4 hook stdin deadline"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: hook-stdin-deadline

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
| **Branch** | `scaffold/004-hook-stdin-deadline` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-codex-mirror-gate |
| **Successor** | 005-router-sync-guard |
| **Handoff Criteria** | The shared reader resolves at its deadline, the three post-edit adapters load it, and every suite named in the goal's completion criteria passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Follow-up fixes for the sk-code Ponytail refinement specification.

**Scope Boundary**: The stdin reader in the shared CommonJS hook helper, and the three post-edit adapters that carry their own copy of it. The ESM sibling and the other stdin readers are named follow-ups, not part of this phase.

**Dependencies**:
- No code dependency on 003-codex-mirror-gate. It is the predecessor in the sequence only.
- The hook suites listed in `plan.md` section 5 must keep passing.

**Deliverables**:
- One deadline in `readStdin` in the shared helper
- A two-case test file beside the helper
- The three post-edit adapters switched to the shared helper
- The shared README describes the deadline and lists the test file

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`readStdin` in `.skilled/hooks/shared/hook-adapter-shared.cjs` reads with `for await` until the stream closes, and it has no deadline (lines 14-18). A host that leaves a hook's stdin open keeps that hook running until the host's own timeout kills it. Measured on the unchanged helper with a writer that holds the pipe open for 8 seconds, the read returned after 7980 ms. Three post-edit adapters carry identical copies of the reader (`post-edit-quality/claude/claude-posttooluse.cjs` lines 43-47, `post-edit-quality/codex/post-edit-quality.cjs` lines 35-39, `post-edit-quality/devin/post-edit-quality.cjs` lines 36-40), so a fix in the shared helper alone would not reach them.

### Purpose
A CommonJS hook returns within a fixed deadline with whatever stdin it has read, and its existing fail-open parse decides what that partial input means.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Give `readStdin` a 3000 ms deadline that resolves with the bytes read so far, then clears its timer and releases stdin
- Add `hook-adapter-shared.test.cjs` with a never-closed case and a complete-input case
- Remove the local `readStdin` from the three post-edit adapters and require the shared helper instead
- Update the deadline wording in `.skilled/hooks/shared/README.md`

### Out of Scope
- The ESM sibling at `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs`: it serves system-spec-kit's own spec-gate adapters, stays unchanged, and is a named follow-up
- The other stdin readers under `.skilled/hooks/` and `.skilled/skills/system-spec-kit/runtime/hooks/` that use the same unbounded pattern, and the synchronous reader in `task-dispatch/claude/fable-subagent-guard.mjs`: separate change, listed in `plan.md` section 6
- Parse behavior on bad input: each adapter keeps its current handling

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/shared/hook-adapter-shared.cjs` | Modify | Replace `readStdin` (lines 14-18) with the deadline version |
| `.skilled/hooks/shared/hook-adapter-shared.test.cjs` | Create | Never-closed stdin case and complete-input case |
| `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs` | Modify | Delete local `readStdin` (lines 43-47); require the shared helper after line 33 |
| `.skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs` | Modify | Delete local `readStdin` (lines 35-39); require the shared helper after line 22 |
| `.skilled/hooks/post-edit-quality/devin/post-edit-quality.cjs` | Modify | Delete local `readStdin` (lines 36-40); require the shared helper after line 23 |
| `.skilled/hooks/shared/README.md` | Modify | Describe the deadline (line 29 and the table row at line 74); add the test file row |
| `scratch/` inside this packet | Create | Before snapshots and probe files only; not product files |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `readStdin({ timeoutMs = 3000 } = {})` resolves at the deadline with the text read so far | The never-closed case in `hook-adapter-shared.test.cjs` passes, and its `text` equals the bytes written before the deadline |
| REQ-002 | Input that ends before the deadline resolves with the full text, unchanged | The complete-input case passes: `text` equals the input and `elapsedMs` is below 3000 |
| REQ-003 | After either path the timer is cleared, the listeners are removed and stdin is paused, so the process exits on its own | The never-closed child exits with status 0 and no signal, before the test's kill timer fires |
| REQ-004 | The three post-edit adapters require the shared helper and keep their current bad-input handling | `grep -n "async function readStdin"` over the three files prints nothing and exits 1; their suites pass |
| REQ-005 | The helper keeps zero dependencies | `grep -n "require("` over the helper prints nothing and exits 1 |
| REQ-006 | Every existing hook suite that touches these files keeps passing | The four-suite command in `plan.md` section 5 reports 66 pass and 0 fail with exit 0; the shell parse test prints its pass line with exit 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | A stream error still rejects, as the current loop does | `grep -n "reject(error)"` over the helper prints one line and exits 0 |
| REQ-008 | The shared README describes the deadline and lists the new test file | `grep -c "3000"` over the README prints 2 or more |
| REQ-009 | The ESM sibling stays byte-identical to its snapshot | `cmp` against the copy in `scratch/before/` exits 0 with no output |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A CommonJS hook whose host never closes stdin exits with status 0 about 3 seconds after it starts, not at the host's timeout.
- **SC-002**: All eight CommonJS adapters under `.skilled/hooks/` that read stdin use the one shared `readStdin`: the five that already require the helper and the three post-edit adapters.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A host writes its payload slower than 3000 ms. The read is cut, the fail-open parse returns `null`, and a task-dispatch or MCP guard approves a call it would have checked | Med | No measurement of host write latency was taken, so 3000 ms is a judgment. The complete-input case pins whole-input return, and the implementation summary names this residual risk |
| Dependency | Node stream behavior: pausing `process.stdin` after the deadline lets the process exit | Low | Probed in `scratch/probe/`: a never-closed pipe resolved at 3001 ms and the process exited with status 0 and no signal |
| Risk | Deleting the three copies changes which module the adapters load at startup | Low | Each adapter already requires `../../shared/hook-flags.cjs` from the same folder depth, so `../../shared/hook-adapter-shared.cjs` resolves the same way |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The 3000 ms default and the reject-on-error behavior are fixed by this spec.
<!-- /ANCHOR:questions -->

---
