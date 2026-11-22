# Deep Review Strategy - Session Tracking

## 1. REVIEW CHARTER

- **Target**: `specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/056-worktree-goal-carry` (spec-folder)
- **Dimensions**: correctness, security, traceability, maintainability
- **Operator review focus**: the uncommitted goal carry-over change for worktree-only packets (relaunch-core.cjs, session-handover.cjs, `.skilled/bin/skilled-loop`, their three test files, goal-carry-over.md, troubleshooting.md), checked against packet 056's spec, tasks and implementation-summary claims, and checked for a goal set in a worktree-only packet being carried across a hop without being lost or misrouted.
- **Stop conditions**: `stopPolicy=max-iterations`, so the loop runs to `maxIterations=5`. Convergence at `0.10` is telemetry only.
- **Success criteria**: every configured dimension covered, every P0/P1 carrying file:line evidence, and the worktree goal-carry path proven end to end or its gaps named.

---

## 2. TOPIC

Review of Phase 56 `worktree-goal-carry`: a Claude hand-over carries a goal whose packet lives only in a linked git worktree, records that worktree as `goal_root`, and renders the receiver's `/goal` slice from it.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Re-running the repository's test suites or `validate.sh`; this lineage is read-only outside its own directory.
- Reviewing the Pi, OpenCode, Devin or Cursor goal readers beyond the parity claim the spec makes about them.
- Reviewing the parent packet 002 beyond the one line it adds about this phase.
- Judging whether the change should be committed; commit authority stays with the operator (D5).

---

## 5. STOP CONDITIONS

- `maxIterations=5` reached (the configured stop policy).
- All four dimensions covered and no new evidence-bearing angle remains.
- A hard blocker that makes further review impossible.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 1
- P2 (Suggestions): 6
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Comparing two reads of the same session log (`logTailText` against `latestGoalLogEntry`) exposed the bounded-tail asymmetry that neither read shows alone (iteration 1).
- Reading the wrapper hop path end to end (`consume_record` at :1391 before the render at :1460) proved `goal_root` is populated before it is read (iteration 1).
- Probing a suspected gap in a throwaway repository instead of reasoning about it settled the `GIT_CONFIG_*` question in one command and turned a candidate finding into a ruled-out direction (iteration 2).
- Reconciling the packet's own test count (1065 to 1073) against the diff settled whether the prose or the count was wrong, and named the stale side with arithmetic rather than opinion (iteration 3).
- Searching for an existing helper before accepting a new one found `readLogTail` and turned the P1 into a named duplication with a one-place fix (iteration 4).
- Tracing the cwd source rather than assuming it ruled out a suspected `noteCwd` misrouting instead of raising a phantom finding (iteration 5).

## 9. WHAT FAILED
- Treating the packet verification table as reproducible: the real session log and the 26-worktree repository are absent, so SC-001 and the 14-second walk stay packet evidence (iteration 1).
- Reading the strip list as obviously incomplete: the seven stripped variables are the ones that move `worktree list`, and the unstripped `GIT_CONFIG_*` family does not (iteration 2).
- Reading `spec.md` section 3 as the authoritative test list: it was written before two later tests landed, so the diff is the authority (iteration 3).
- Reading the new helpers in isolation: `logTailText` looks reasonable alone and only looks wrong beside `readLogTail` (iteration 4).
- Reading the `noteCwd` branch as a gap before tracing where `cwd` comes from: the branch is safe because the wrapper runs in the sender's directory (iteration 5).

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`GIT_CONFIG_*` redirecting the worktree list.** Probed in a throwaway repository: `core.worktree` injected through `GIT_CONFIG_COUNT`/`GIT_CONFIG_KEY_0`/`GIT_CONFIG_VALUE_0` and through `GIT_CONFIG_PARAMETERS` leaves the listing unchanged. `GIT_DIR` does redirect it and is stripped at `:74-77`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`GIT_CONFIG_*` redirecting the worktree list.** Probed in a throwaway repository: `core.worktree` injected through `GIT_CONFIG_COUNT`/`GIT_CONFIG_KEY_0`/`GIT_CONFIG_VALUE_0` and through `GIT_CONFIG_PARAMETERS` leaves the listing unchanged. `GIT_DIR` does redirect it and is stripped at `:74-77`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`GIT_CONFIG_*` redirecting the worktree list.** Probed in a throwaway repository: `core.worktree` injected through `GIT_CONFIG_COUNT`/`GIT_CONFIG_KEY_0`/`GIT_CONFIG_VALUE_0` and through `GIT_CONFIG_PARAMETERS` leaves the listing unchanged. `GIT_DIR` does redirect it and is stripped at `:74-77`.

### **`GIT_REPOSITORY_VARIABLES` being rebuilt per call.** It is a module-level frozen array; only the `env` copy is per call, which is required. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`GIT_REPOSITORY_VARIABLES` being rebuilt per call.** It is a module-level frozen array; only the `env` copy is per call, which is required.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`GIT_REPOSITORY_VARIABLES` being rebuilt per call.** It is a module-level frozen array; only the `env` copy is per call, which is required.

### **`goal_root` surviving a packet that moved back to the usual roots.** `recordGoalPacket:1513-1517` removes the field whenever the packet is found without a root, and the core test at `relaunch-core.test.cjs:3305-3323` asserts it. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **`goal_root` surviving a packet that moved back to the usual roots.** `recordGoalPacket:1513-1517` removes the field whenever the packet is found without a root, and the core test at `relaunch-core.test.cjs:3305-3323` asserts it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`goal_root` surviving a packet that moved back to the usual roots.** `recordGoalPacket:1513-1517` removes the field whenever the packet is found without a root, and the core test at `relaunch-core.test.cjs:3305-3323` asserts it.

### **`goal_root` written unquoted into the frontmatter.** `updateFrontmatter:256` writes `${key}: ${value}` with no quoting, but `cwd` is an absolute path written the same way and read back the same way (`usableGoal:585`), so `goal_root` follows an established convention rather than introducing a parsing risk. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`goal_root` written unquoted into the frontmatter.** `updateFrontmatter:256` writes `${key}: ${value}` with no quoting, but `cwd` is an absolute path written the same way and read back the same way (`usableGoal:585`), so `goal_root` follows an established convention rather than introducing a parsing risk.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`goal_root` written unquoted into the frontmatter.** `updateFrontmatter:256` writes `${key}: ${value}` with no quoting, but `cwd` is an absolute path written the same way and read back the same way (`usableGoal:585`), so `goal_root` follows an established convention rather than introducing a parsing risk.

### **`goalPacketProblem` not using `realPathOrNull`.** It needs the throw to distinguish "outside the repository" from "no goal.md", which a null-returning helper would erase. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`goalPacketProblem` not using `realPathOrNull`.** It needs the throw to distinguish "outside the repository" from "no goal.md", which a null-returning helper would erase.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`goalPacketProblem` not using `realPathOrNull`.** It needs the throw to distinguish "outside the repository" from "no goal.md", which a null-returning helper would erase.

### **`implementation-summary.md` Known Limitations 3 being a defect.** It labels the Pi and OpenCode behaviour as inferred and untested, which matches `spec.md:112` putting those receivers out of scope. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`implementation-summary.md` Known Limitations 3 being a defect.** It labels the Pi and OpenCode behaviour as inferred and untested, which matches `spec.md:112` putting those receivers out of scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`implementation-summary.md` Known Limitations 3 being a defect.** It labels the Pi and OpenCode behaviour as inferred and untested, which matches `spec.md:112` putting those receivers out of scope.

### **`lib/README.md` omitting the newly exported `usableGoal`.** The entrypoint table is curated, not exhaustive: it never listed `usableGoalPacket`, which pre-existed, so the omission is the table's existing shape rather than drift from this change. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`lib/README.md` omitting the newly exported `usableGoal`.** The entrypoint table is curated, not exhaustive: it never listed `usableGoalPacket`, which pre-existed, so the omission is the table's existing shape rather than drift from this change.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`lib/README.md` omitting the newly exported `usableGoal`.** The entrypoint table is curated, not exhaustive: it never listed `usableGoalPacket`, which pre-existed, so the omission is the table's existing shape rather than drift from this change.

### **`realPathOrNull` being an unnecessary helper.** It is used at `:530`, `:535`, `:550` and `:938`, four call sites, so it earns its place. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`realPathOrNull` being an unnecessary helper.** It is used at `:530`, `:535`, `:550` and `:938`, four call sites, so it earns its place.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`realPathOrNull` being an unnecessary helper.** It is used at `:530`, `:535`, `:550` and `:938`, four call sites, so it earns its place.

### **`render_goal_slice`'s new second argument breaking another caller.** `:1240` and `:1460` are its only call sites and both pass it. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`render_goal_slice`'s new second argument breaking another caller.** `:1240` and `:1460` are its only call sites and both pass it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`render_goal_slice`'s new second argument breaking another caller.** `:1240` and `:1460` are its only call sites and both pass it.

### **`seeded_goal_packet`'s widened return breaking another caller.** `skilled-loop:1237` is its only call site. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`seeded_goal_packet`'s widened return breaking another caller.** `skilled-loop:1237` is its only call site.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`seeded_goal_packet`'s widened return breaking another caller.** `skilled-loop:1237` is its only call site.

### **`spec.md` section 3 omitting `goal-handover.cjs`.** `renderGoalSlice` already accepted `roots` before this change (`goal-handover.test.cjs:173`), so no edit to that file was needed and its absence from the file list is correct. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`spec.md` section 3 omitting `goal-handover.cjs`.** `renderGoalSlice` already accepted `roots` before this change (`goal-handover.test.cjs:173`), so no edit to that file was needed and its absence from the file list is correct.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`spec.md` section 3 omitting `goal-handover.cjs`.** `renderGoalSlice` already accepted `roots` before this change (`goal-handover.test.cjs:173`), so no edit to that file was needed and its absence from the file list is correct.

### **`tests/README.md` being stale.** Its wrapper-test description ("Covers the claim state, the withdrawn hand-overs and the goal packets") still holds for the two new worktree tests. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`tests/README.md` being stale.** Its wrapper-test description ("Covers the claim state, the withdrawn hand-overs and the goal packets") still holds for the two new worktree tests.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`tests/README.md` being stale.** Its wrapper-test description ("Covers the claim state, the withdrawn hand-overs and the goal packets") still holds for the two new worktree tests.

### **A `goal_root` of `/` or a home directory.** `repositoryWorktrees` returns only git-listed checkouts, so neither matches. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A `goal_root` of `/` or a home directory.** `repositoryWorktrees` returns only git-listed checkouts, so neither matches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A `goal_root` of `/` or a home directory.** `repositoryWorktrees` returns only git-listed checkouts, so neither matches.

### **A `goal_root` that points at a worktree of another repository.** `repositoryWorktrees` runs `git -C <repoRoot> worktree list`, which lists only this repository's checkouts, so a foreign worktree never matches. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A `goal_root` that points at a worktree of another repository.** `repositoryWorktrees` runs `git -C <repoRoot> worktree list`, which lists only this repository's checkouts, so a foreign worktree never matches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A `goal_root` that points at a worktree of another repository.** `repositoryWorktrees` runs `git -C <repoRoot> worktree list`, which lists only this repository's checkouts, so a foreign worktree never matches.

### **A `noteCwd` match being misrouted to the wrong checkout.** `prepare` writes `cwd` from the sender's working directory and the wrapper runs there, so `renderGoalSlice`'s default roots already include it; no `--cwd` flag exists to separate them. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A `noteCwd` match being misrouted to the wrong checkout.** `prepare` writes `cwd` from the sender's working directory and the wrapper runs there, so `renderGoalSlice`'s default roots already include it; no `--cwd` flag exists to separate them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A `noteCwd` match being misrouted to the wrong checkout.** `prepare` writes `cwd` from the sender's working directory and the wrapper runs there, so `renderGoalSlice`'s default roots already include it; no `--cwd` flag exists to separate them.

### **A P0 hiding in the unverified suite claims.** No code path was found that fails on an input the code's own contract allows, so the unverified claims limit confidence rather than raise severity. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A P0 hiding in the unverified suite claims.** No code path was found that fails on an input the code's own contract allows, so the unverified claims limit confidence rather than raise severity.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A P0 hiding in the unverified suite claims.** No code path was found that fails on an input the code's own contract allows, so the unverified claims limit confidence rather than raise severity.

### **A packet that exists on main and in a worktree being resolved from the worktree.** `claudeGoalPacketResult:888-893` returns the usual-roots match before the worktree search runs, which is the documented Key Decision. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A packet that exists on main and in a worktree being resolved from the worktree.** `claudeGoalPacketResult:888-893` returns the usual-roots match before the worktree search runs, which is the documented Key Decision.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A packet that exists on main and in a worktree being resolved from the worktree.** `claudeGoalPacketResult:888-893` returns the usual-roots match before the worktree search runs, which is the documented Key Decision.

### **A symlinked `goal.md` inside a worktree pointing outside it.** `goalPacketProblem:457-459` realpaths the file and requires it inside the real root. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A symlinked `goal.md` inside a worktree pointing outside it.** `goalPacketProblem:457-459` realpaths the file and requires it inside the real root.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A symlinked `goal.md` inside a worktree pointing outside it.** `goalPacketProblem:457-459` realpaths the file and requires it inside the real root.

### **Git config variables redirecting the worktree list.** `GIT_REPOSITORY_VARIABLES:74-77` strips the seven variables that move git's repository, work tree, common dir, index, namespace, ceiling and filesystem discovery. `GIT_CONFIG_*` cannot redirect `worktree list` away from the repository `-C` names, so no exploit path was found. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Git config variables redirecting the worktree list.** `GIT_REPOSITORY_VARIABLES:74-77` strips the seven variables that move git's repository, work tree, common dir, index, namespace, ceiling and filesystem discovery. `GIT_CONFIG_*` cannot redirect `worktree list` away from the repository `-C` names, so no exploit path was found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Git config variables redirecting the worktree list.** `GIT_REPOSITORY_VARIABLES:74-77` strips the seven variables that move git's repository, work tree, common dir, index, namespace, ceiling and filesystem discovery. `GIT_CONFIG_*` cannot redirect `worktree list` away from the repository `-C` names, so no exploit path was found.

### **Secret exposure through the new field.** `goal_root` is a filesystem path already visible to the operator and the model; `claim` and `consume` disclose nothing the session did not already know. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Secret exposure through the new field.** `goal_root` is a filesystem path already visible to the operator and the model; `claim` and `consume` disclose nothing the session did not already know.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Secret exposure through the new field.** `goal_root` is a filesystem path already visible to the operator and the model; `claim` and `consume` disclose nothing the session did not already know.

### **Shell injection through `goal_root`.** Every hop from the note to the subprocess passes the value as a quoted argument or a separate argv element (`skilled-loop:1460`, `:1240`, `goal-handover.cjs:104-118`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Shell injection through `goal_root`.** Every hop from the note to the subprocess passes the value as a quoted argument or a separate argv element (`skilled-loop:1460`, `:1240`, `goal-handover.cjs:104-118`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Shell injection through `goal_root`.** Every hop from the note to the subprocess passes the value as a quoted argument or a separate argv element (`skilled-loop:1460`, `:1240`, `goal-handover.cjs:104-118`).

### **The local `recordGoalPacket` in `session-handover.cjs:407` shadowing `core.recordGoalPacket`.** The shadow predates this change and the local function's body already calls `core.recordGoalPacket` explicitly. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The local `recordGoalPacket` in `session-handover.cjs:407` shadowing `core.recordGoalPacket`.** The shadow predates this change and the local function's body already calls `core.recordGoalPacket` explicitly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The local `recordGoalPacket` in `session-handover.cjs:407` shadowing `core.recordGoalPacket`.** The shadow predates this change and the local function's body already calls `core.recordGoalPacket` explicitly.

### **The seeded two-line protocol breaking on a packet-only reply.** `seeded_goal_packet:511` emits the root line only when the root is non-empty, and `skilled-loop:1239-1243` leaves `goal_root` empty when no newline is present. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The seeded two-line protocol breaking on a packet-only reply.** `seeded_goal_packet:511` emits the root line only when the root is non-empty, and `skilled-loop:1239-1243` leaves `goal_root` empty when no newline is present.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The seeded two-line protocol breaking on a packet-only reply.** `seeded_goal_packet:511` emits the root line only when the root is non-empty, and `skilled-loop:1239-1243` leaves `goal_root` empty when no newline is present.

### **The two-worktree refusal being bypassed by a claimed note.** `worktreeHeadlinePackets:948-951` treats the claimed root as one more named worktree, so two matching pairs still refuse. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The two-worktree refusal being bypassed by a claimed note.** `worktreeHeadlinePackets:948-951` treats the claimed root as one more named worktree, so two matching pairs still refuse.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The two-worktree refusal being bypassed by a claimed note.** `worktreeHeadlinePackets:948-951` treats the claimed root as one more named worktree, so two matching pairs still refuse.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- `goal_root` written unquoted into the frontmatter: `cwd` is an absolute path written the same way, and `parseHandoff:338-343` splits on the first colon (iteration 1, evidence: `relaunch-core.cjs:256`, `:585`, `:338-343`).
- `GIT_CONFIG_*` redirecting the worktree list: probed, no effect; `GIT_DIR` does redirect it and is stripped (iteration 2, evidence: `relaunch-core.cjs:74-77`).
- A `goal_root` naming a foreign repository worktree: `git -C <repoRoot> worktree list` lists only this repository (iteration 1, evidence: `relaunch-core.cjs:521`).
- The seeded two-line protocol breaking on a packet-only reply: the root line is emitted only when non-empty (iteration 1, evidence: `skilled-loop:511`, `:1239-1243`).
- A symlinked `goal.md` escaping the worktree: `goalPacketProblem:457-459` realpaths the file and requires it inside the real root (iteration 2).
- Shell injection through `goal_root`: every hop passes a quoted argument or a separate argv element (iteration 2, evidence: `skilled-loop:1460`, `:1240`, `goal-handover.cjs:104-118`).
- `lib/README.md` omitting `usableGoal`: the entrypoint table is curated and never listed `usableGoalPacket` either (iteration 3).
- `spec.md` section 3 omitting `goal-handover.cjs`: `renderGoalSlice` already accepted `roots` before this change (iteration 3, evidence: `goal-handover.test.cjs:173`).
- `seeded_goal_packet` and `render_goal_slice` signature changes breaking callers: each has one or two call sites and all are updated (iteration 4).
- `realPathOrNull` being unnecessary: four call sites (iteration 4).
- A `noteCwd` match being misrouted: `prepare` writes `cwd` from the sender's directory and the wrapper runs there; no `--cwd` flag exists (iteration 5).
- A packet on main and in a worktree resolving from the worktree: the usual-roots match returns first by design (iteration 5).
- The two-worktree refusal being bypassed by a claimed note: the claimed root is one more named worktree (iteration 5).
- `goal_root` surviving a packet that moved back to the usual roots: `recordGoalPacket:1513-1517` removes it (iteration 5).

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining; all four configured dimensions are covered and this consolidation pass is the terminal iteration - Focus area: remediation of R1-P1-001 by reusing `readLogTail` and its widening, which also closes R4-P2-001; then the four documentation findings - Reason: `stopPolicy=max-iterations` reached iteration 5 of 5 - Rotation status: complete - Blocked/productive carry-forward: productive -- the two-reads comparison and the existing-helper search were the two highest-yield moves; a future review of this path should start there - Required evidence: none outstanding for this run - Recovery note: not applicable Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- **Target pointers**: `.skilled/hooks/session-handover/lib/relaunch-core.cjs` (`repositoryWorktrees` :513, `noteGoalRoot` :547, `usableGoal` :568, `worktreeHeadlinePackets` :936, `claudeGoalPacketResult` :819, `recordGoalPacket` :1501), `.skilled/hooks/session-handover/bin/session-handover.cjs` (`noteGoal` :390, `recordGoalPacket` :407, `claim` :749, `consume` :859), `.skilled/bin/skilled-loop` (`render_goal_slice` :452, `seeded_goal_packet` :481, hop render :1460), `.skilled/hooks/session-handover/lib/goal-handover.cjs` (`renderGoalSlice` :95).
- **Behavior claims**: spec.md REQ-001..REQ-005, SC-001, SC-002; tasks.md T001..T010; implementation-summary.md verification table and Known Limitations 1-3; goal-carry-over.md section 3 and section 4; troubleshooting.md "The receiver shows no goal packet".
- **Reuse and conventions**: `goalPacketProblem` containment check, `realPathOrNull`, `spawnSync` with an explicit timeout, fail-closed readers that never fail a hand-over, `withAppendLock` for note writes.
- **Review risks and gaps**: no `resource-map.md` in the packet, so the resource-map coverage gate is skipped. The real session log and the 26-worktree repository are not reproducible here, so SC-001 and the 14-second walk measurement are taken from the packet's own record rather than re-measured.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1, 2, 3, 4, 5 | REQ-001..REQ-004 implemented and the security mitigation matches `spec.md:150`; the bounded tail narrows REQ-001 and the three-CLI-tests prose is stale. |
| `checklist_evidence` | core | partial | 1, 2, 3, 4, 5 | T003 names three tests where five exist; T005 and T010 are claims without artifacts in this lineage. |
| `skill_agent` | overlay | notApplicable | 3, 5 | No SKILL.md or agent definition is touched; `goal-carry-over.md` is accurate. |
| `agent_cross_runtime` | overlay | notApplicable | 3, 5 | No `.claude/agents` or `.opencode/agents` file is in the diff or the declared scope. |
| `feature_catalog_code` | overlay | fail | 3, 5 | `session-handover-loop.md:98` omits `goal_root` and the worktree search. |
| `playbook_capability` | overlay | partial | 3, 5 | `session-handover-claude.md:758` has no worktree-only case; out of the declared change scope, recorded as follow-up. |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/hooks/session-handover/lib/relaunch-core.cjs` | D1, D2, D4, X | 5 | 1 P1, 4 P2 | partial |
| `.skilled/hooks/session-handover/bin/session-handover.cjs` | D1, D2, D4, X | 5 | 0 | complete |
| `.skilled/bin/skilled-loop` | D1, D2, D4, X | 5 | 0 | complete |
| `.skilled/hooks/session-handover/lib/goal-handover.cjs` | D1, D2, X | 5 | 0 | complete |
| `.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs` | D1, D2, D3, D4 | 4 | 0 | complete |
| `.skilled/hooks/session-handover/tests/skilled-loop-wrapper-claim-goal.test.cjs` | D1, D2, D4 | 4 | 0 | complete |
| `.skilled/hooks/session-handover/tests/relaunch-core.test.cjs` | D1, D2, D4 | 4 | 0 | complete |
| `.skilled/hooks/session-handover/goal-carry-over.md` | D1, D3, X | 5 | 0 | complete |
| `.skilled/hooks/session-handover/troubleshooting.md` | D1, D3 | 3 | 1 P2 | partial |
| `specs/.../056-worktree-goal-carry/spec.md` | D3, X | 5 | 1 P2 | partial |
| `specs/.../056-worktree-goal-carry/tasks.md` | D3, X | 5 | 1 P2 | partial |
| `specs/.../056-worktree-goal-carry/implementation-summary.md` | D3, X | 5 | 0 | complete |
| `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-handover-loop.md` | D3, X | 5 | 1 P2 | partial |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-vibe-1795297959308-ycf8yr, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-21T21:54:19Z
<!-- MACHINE-OWNED: END -->
