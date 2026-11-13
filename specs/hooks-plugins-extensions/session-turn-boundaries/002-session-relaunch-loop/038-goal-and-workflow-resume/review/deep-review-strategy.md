---
title: Deep Review Strategy Template
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking Template

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
Review of spec folder `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume` (type spec-folder): the code and test change that carries the goal and the active command across a session relaunch hop, commit `ef4b41e69b` against `8b4e1d88bc`, with the seven child packets as the stated intent.

Dimension queue: correctness, security, traceability, maintainability. Max iterations 3, convergence threshold 0.10, stop policy max-iterations.

Scope files:
- `.opencode/plugins/opencode-goal.js`
- `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs`
- `.skilled/bin/skilled-loop-shell.sh`
- `.skilled/commands/speckit/handoff.md`
- `.skilled/hooks/goal/pi/goal-context.ts`
- `.skilled/hooks/goal/pi/goal-pi.test.mjs`
- `.skilled/hooks/hook-flags.env.example`
- `.skilled/hooks/session-relaunch/README.md`
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`
- `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs`
- `.skilled/hooks/session-relaunch/lib/nudge.cjs`
- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`
- `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs`
- `.skilled/hooks/session-relaunch/tests/nudge.test.cjs`
- `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`
- `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs`
- `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs`
- `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md`

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Fixing anything: the review is report only.
- Relaunch behaviour that this change did not touch.
- Live behaviour of each runtime, which no suite here exercises.

---

## 5. STOP CONDITIONS
- Three iterations have run (stop policy max-iterations).
- The pause sentinel appears, or the executor is unavailable.

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
- P2 (Suggestions): 8
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Full read of `lib/relaunch-core.cjs` then targeted symbol reads of its two consumers (`opencode-goal.js`, `goal-core.cjs`): the producer/consumer pair exposed the duplicated OpenCode record layout (iteration 1).
- Reading the module's own stated contract comments (`MISSING_EVENT_POLICIES`, `HANDOFF_SECTIONS`, the `usableGoalPacket` switch note) before judging behaviour: the event-name finding turns on the contract the module itself claims (iteration 1).
- Checking every sibling mutator of a shared file (frontmatter writers) to see whether a missing guard is a class or a one-off (iteration 1).
- Reading the producer/consumer pairs for the security pass: shim `skilled-loop` function ↔ CLI `manualClaimCommand`, and Pi `bindHandOverGoal` ↔ OpenCode `session.created` delete. Both pairs produced a finding or a clean ruling on the first read (iteration 2).
- Full reads of `nudge.cjs` and `session-relaunch.cjs` side by side: the duplicated `SESSION_RELAUNCH_*` resolution rule and the invalid-`SKILLED_LOOP_HOPS` divergence were visible only when both copies were compared (iteration 3).
- Reading `payloadEventName` with the startup fixture rather than trusting the registry anchor: the P1 re-anchored from stale line 198 to the current emit at 152-155 and the untested inference branch was confirmed (iteration 3).

---

## 9. WHAT FAILED
- Attempting to prove the OpenCode record shape from greps alone: `normalizeStoredGoal`'s full return object and the atomic write were not traced field-by-field, so the shape claim could not be promoted past an edge case (iteration 1).
- Judging the claim-seed round trip from `manualClaimCommand` alone without reading `nudge.seedInstructions`: the rendering half of the contract stayed unverified (iteration 1).
- Following the dispatch's security focus to the cap: 13 analysis actions were consumed by the four named surfaces, leaving four child packets and every acceptance row unread with only iteration 3 remaining (iteration 2).
- Leaving traceability overlay and checklist evidence unread through all three iterations: the maintainability dispatch consumed the final iteration, so `commands/speckit/handoff.md`, the goal-hook playbook, packets 001/003/004/007 and every acceptance row remain deferred rather than passed (iteration 3).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`claim` duplicating `sessionIdFor`**: `claim` repeats the source selection and error text (`[SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:661]`), but the two implementations agree and the seed always passes `--session`; no reachable wrong result today. It is a cleanup candidate, not an active finding. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`claim` duplicating `sessionIdFor`**: `claim` repeats the source selection and error text (`[SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:661]`), but the two implementations agree and the seed always passes `--session`; no reachable wrong result today. It is a cleanup candidate, not an active finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`claim` duplicating `sessionIdFor`**: `claim` repeats the source selection and error text (`[SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:661]`), but the two implementations agree and the seed always passes `--session`; no reachable wrong result today. It is a cleanup candidate, not an active finding.

### **`dropNestedLoop` deleting `SKILLED_LOOP_CLAIM_SEED`**: `dropNestedLoop` removes every `SKILLED_LOOP_` key (`relaunch-core.cjs:2044-2046`), which includes the claim seed, but `claimAfterGoalStart` reads the seed after that call and returns `done()` when it is gone (`compact-pointer.mjs:187-193`). Intentional, per the surrounding comment. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`dropNestedLoop` deleting `SKILLED_LOOP_CLAIM_SEED`**: `dropNestedLoop` removes every `SKILLED_LOOP_` key (`relaunch-core.cjs:2044-2046`), which includes the claim seed, but `claimAfterGoalStart` reads the seed after that call and returns `done()` when it is gone (`compact-pointer.mjs:187-193`). Intentional, per the surrounding comment.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`dropNestedLoop` deleting `SKILLED_LOOP_CLAIM_SEED`**: `dropNestedLoop` removes every `SKILLED_LOOP_` key (`relaunch-core.cjs:2044-2046`), which includes the claim seed, but `claimAfterGoalStart` reads the seed after that call and returns `done()` when it is gone (`compact-pointer.mjs:187-193`). Intentional, per the surrounding comment.

### **`handoffText` step-numbering drift**: all four folder states were walked end to end (`[SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:118]`); the `step` counter and the tests agree, so no duplicate or skipped step number exists. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`handoffText` step-numbering drift**: all four folder states were walked end to end (`[SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:118]`); the `step` counter and the tests agree, so no duplicate or skipped step number exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`handoffText` step-numbering drift**: all four folder states were walked end to end (`[SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:118]`); the `step` counter and the tests agree, so no duplicate or skipped step number exists.

### **`hook-flags.env.example` precedence drift**: the documented order (master kill switch, then per-runtime value, then global enable) matches the refusal messages in `relaunchRefusal` (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:462-473`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`hook-flags.env.example` precedence drift**: the documented order (master kill switch, then per-runtime value, then global enable) matches the refusal messages in `relaunchRefusal` (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:462-473`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`hook-flags.env.example` precedence drift**: the documented order (master kill switch, then per-runtime value, then global enable) matches the refusal messages in `relaunchRefusal` (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:462-473`).

### **`nudgeDecision` re-arm floor**: a pending grant writes the floor and stays quiet, and the delivered grant advances the level past the spent ceiling (`[SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:620]`); the tests at `nudge.test.cjs:1502-1594` cover the pending, fixed and cap-behind cases. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`nudgeDecision` re-arm floor**: a pending grant writes the floor and stays quiet, and the delivered grant advances the level past the spent ceiling (`[SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:620]`); the tests at `nudge.test.cjs:1502-1594` cover the pending, fixed and cap-behind cases.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`nudgeDecision` re-arm floor**: a pending grant writes the floor and stays quiet, and the delivered grant advances the level past the spent ceiling (`[SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:620]`); the tests at `nudge.test.cjs:1502-1594` cover the pending, fixed and cap-behind cases.

### **`parseArgs` rejecting a value that starts with `--`**: the CLI owns the note-path shape and the handoffs directory; a path beginning with `--` is outside the accepted invocation, not a hidden truncation. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`parseArgs` rejecting a value that starts with `--`**: the CLI owns the note-path shape and the handoffs directory; a path beginning with `--` is outside the accepted invocation, not a hidden truncation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`parseArgs` rejecting a value that starts with `--`**: the CLI owns the note-path shape and the handoffs directory; a path beginning with `--` is outside the accepted invocation, not a hidden truncation.

### **`recordGoalPacket` mutating the note before a shell-child refusal**: the write is the idempotent, prepare-owned `goal_packet` field, and the refusal leaves the note as the sending session wrote it; no wrong result. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`recordGoalPacket` mutating the note before a shell-child refusal**: the write is the idempotent, prepare-owned `goal_packet` field, and the refusal leaves the note as the sending session wrote it; no wrong result.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`recordGoalPacket` mutating the note before a shell-child refusal**: the write is the idempotent, prepare-owned `goal_packet` field, and the refusal leaves the note as the sending session wrote it; no wrong result.

### **`SKILLED_LOOP_TRUSTED_CHECKOUTS` colon splitting**: the value is operator-supplied; a path containing `:` can only truncate or rename an entry, never widen trust to a checkout the operator did not list (`.skilled/bin/skilled-loop-shell.sh:243-260`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`SKILLED_LOOP_TRUSTED_CHECKOUTS` colon splitting**: the value is operator-supplied; a path containing `:` can only truncate or rename an entry, never widen trust to a checkout the operator did not list (`.skilled/bin/skilled-loop-shell.sh:243-260`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`SKILLED_LOOP_TRUSTED_CHECKOUTS` colon splitting**: the value is operator-supplied; a path containing `:` can only truncate or rename an entry, never widen trust to a checkout the operator did not list (`.skilled/bin/skilled-loop-shell.sh:243-260`).

### **Goal switch default-on**: `goalSwitchOn` returns true unless the value is one of `0/false/off/no` (`relaunch-core.cjs:466-469`), which matches the documented "on unless the operator turned it off" contract. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Goal switch default-on**: `goalSwitchOn` returns true unless the value is one of `0/false/off/no` (`relaunch-core.cjs:466-469`), which matches the documented "on unless the operator turned it off" contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Goal switch default-on**: `goalSwitchOn` returns true unless the value is one of `0/false/off/no` (`relaunch-core.cjs:466-469`), which matches the documented "on unless the operator turned it off" contract.

### **Hop-cap off-by-one**: `hops >= hopLimit` (`:1257-1267`) with `DEFAULT_MAX_HOPS = 10` allows the tenth hop and refuses the eleventh, consistent with `hops` counting completed hops. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Hop-cap off-by-one**: `hops >= hopLimit` (`:1257-1267`) with `DEFAULT_MAX_HOPS = 10` allows the tenth hop and refuses the eleventh, consistent with `hops` counting completed hops.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Hop-cap off-by-one**: `hops >= hopLimit` (`:1257-1267`) with `DEFAULT_MAX_HOPS = 10` allows the tenth hop and refuses the eleventh, consistent with `hops` counting completed hops.

### **Manual `skilled-loop` skipping `skilled_loop_real_path` containment**: the function runs `${skilled_loop_sourced_checkout}/.skilled/bin/skilled-loop`, and the checkout is the canonical real path of the sourced shim (`.skilled/bin/skilled-loop-shell.sh:52-69`), so no current-directory path is trusted. Child packet 006 NFR-S01 holds; not a finding. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Manual `skilled-loop` skipping `skilled_loop_real_path` containment**: the function runs `${skilled_loop_sourced_checkout}/.skilled/bin/skilled-loop`, and the checkout is the canonical real path of the sourced shim (`.skilled/bin/skilled-loop-shell.sh:52-69`), so no current-directory path is trusted. Child packet 006 NFR-S01 holds; not a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Manual `skilled-loop` skipping `skilled_loop_real_path` containment**: the function runs `${skilled_loop_sourced_checkout}/.skilled/bin/skilled-loop`, and the checkout is the canonical real path of the sourced shim (`.skilled/bin/skilled-loop-shell.sh:52-69`), so no current-directory path is trusted. Child packet 006 NFR-S01 holds; not a finding.

### **Master/concern switch ordering for the startup claim**: the startup branch returns before `decision.enabled` (`compact-pointer.mjs:169-174`), which is the documented "claim survives the per-runtime switch" behavior; not a bypass of the master or concern kill switch. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Master/concern switch ordering for the startup claim**: the startup branch returns before `decision.enabled` (`compact-pointer.mjs:169-174`), which is the documented "claim survives the per-runtime switch" behavior; not a bypass of the master or concern kill switch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Master/concern switch ordering for the startup claim**: the startup branch returns before `decision.enabled` (`compact-pointer.mjs:169-174`), which is the documented "claim survives the per-runtime switch" behavior; not a bypass of the master or concern kill switch.

### **Pi fail-open `catch` masking goal-state errors**: documented and required at all three lifecycle points (`.skilled/hooks/goal/pi/goal-context.ts:262-265`, `:285-288`, `:316-319`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Pi fail-open `catch` masking goal-state errors**: documented and required at all three lifecycle points (`.skilled/hooks/goal/pi/goal-context.ts:262-265`, `:285-288`, `:316-319`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Pi fail-open `catch` masking goal-state errors**: documented and required at all three lifecycle points (`.skilled/hooks/goal/pi/goal-context.ts:262-265`, `:285-288`, `:316-319`).

### **Pi leaving `SESSION_RELAUNCH_GOAL_PACKET` set when the session id is empty**: intentional deferral to the first attempt that has an id (`.skilled/hooks/goal/pi/goal-context.ts:99-107`), and NFR-R01 defines the empty-id case as unchanged. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Pi leaving `SESSION_RELAUNCH_GOAL_PACKET` set when the session id is empty**: intentional deferral to the first attempt that has an id (`.skilled/hooks/goal/pi/goal-context.ts:99-107`), and NFR-R01 defines the empty-id case as unchanged.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Pi leaving `SESSION_RELAUNCH_GOAL_PACKET` set when the session id is empty**: intentional deferral to the first attempt that has an id (`.skilled/hooks/goal/pi/goal-context.ts:99-107`), and NFR-R01 defines the empty-id case as unchanged.

### **README's "prepare exits 2 before reading the note when the concern is off"**: the flag decision runs at `session-relaunch.cjs:513` before `validatedNote` at `:516`, so the note is not read or mutated on that path. The statement is accurate. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **README's "prepare exits 2 before reading the note when the concern is off"**: the flag decision runs at `session-relaunch.cjs:513` before `validatedNote` at `:516`, so the note is not read or mutated on that path. The statement is accurate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **README's "prepare exits 2 before reading the note when the concern is off"**: the flag decision runs at `session-relaunch.cjs:513` before `validatedNote` at `:516`, so the note is not read or mutated on that path. The statement is accurate.

### **Terminal-escape injection through `goal not carried:`**: the reason comes from two fixed strings and a count (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:644-647`), not from goal or packet text. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Terminal-escape injection through `goal not carried:`**: the reason comes from two fixed strings and a count (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:644-647`), not from goal or packet text.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Terminal-escape injection through `goal not carried:`**: the reason comes from two fixed strings and a count (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:644-647`), not from goal or packet text.

### **Unquoted `git log --since` in the compaction seed**: the timestamp already goes through `shellQuote` (`.skilled/hooks/session-relaunch/lib/nudge.cjs:274-275`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Unquoted `git log --since` in the compaction seed**: the timestamp already goes through `shellQuote` (`.skilled/hooks/session-relaunch/lib/nudge.cjs:274-275`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Unquoted `git log --since` in the compaction seed**: the timestamp already goes through `shellQuote` (`.skilled/hooks/session-relaunch/lib/nudge.cjs:274-275`).

### `002` NFR-R01: a missing or empty variable and an empty session id return before the bind; a bind error can escape `bindHandOverGoal` because it is `try/finally` without `catch`, but both Pi call sites wrap it in fail-open `catch` blocks (`:262-265`, `:285-288`), so no turn or session start is blocked. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `002` NFR-R01: a missing or empty variable and an empty session id return before the bind; a bind error can escape `bindHandOverGoal` because it is `try/finally` without `catch`, but both Pi call sites wrap it in fail-open `catch` blocks (`:262-265`, `:285-288`), so no turn or session start is blocked.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `002` NFR-R01: a missing or empty variable and an empty session id return before the bind; a bind error can escape `bindHandOverGoal` because it is `try/finally` without `catch`, but both Pi call sites wrap it in fail-open `catch` blocks (`:262-265`, `:285-288`), so no turn or session start is blocked.

### `002` SC-003: `SESSION_RELAUNCH_GOAL_PACKET` is deleted after the first id-bearing attempt on Pi — `goal-context.ts:104-113`, with the empty-id case exempted by NFR-R01. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `002` SC-003: `SESSION_RELAUNCH_GOAL_PACKET` is deleted after the first id-bearing attempt on Pi — `goal-context.ts:104-113`, with the empty-id case exempted by NFR-R01.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `002` SC-003: `SESSION_RELAUNCH_GOAL_PACKET` is deleted after the first id-bearing attempt on Pi — `goal-context.ts:104-113`, with the empty-id case exempted by NFR-R01.

### `005` SC-002: normal path only; the error path is finding 7. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `005` SC-002: normal path only; the error path is finding 7.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `005` SC-002: normal path only; the error path is finding 7.

### `006` NFR-S01: satisfied — the manual function runs the wrapper from `${skilled_loop_sourced_checkout}/.skilled/bin/skilled-loop`, where the checkout is the real path of the sourced shim (`:57-69`), so it adds no cwd-derived trust decision (see Ruled Out). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `006` NFR-S01: satisfied — the manual function runs the wrapper from `${skilled_loop_sourced_checkout}/.skilled/bin/skilled-loop`, where the checkout is the real path of the sourced shim (`:57-69`), so it adds no cwd-derived trust decision (see Ruled Out).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `006` NFR-S01: satisfied — the manual function runs the wrapper from `${skilled_loop_sourced_checkout}/.skilled/bin/skilled-loop`, where the checkout is the real path of the sourced shim (`:57-69`), so it adds no cwd-derived trust decision (see Ruled Out).

### `006` SC-001: a bash function is printed by `command -v`, so the definition at `skilled-loop-shell.sh:325` satisfies the criterion on inspection; it was not executed. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `006` SC-001: a bash function is printed by `command -v`, so the definition at `skilled-loop-shell.sh:325` satisfies the criterion on inspection; it was not executed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `006` SC-001: a bash function is printed by `command -v`, so the definition at `skilled-loop-shell.sh:325` satisfies the criterion on inspection; it was not executed.

### `006` SC-002 and SC-003: both test files exist (`.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs`, `skilled-loop-wrapper-claim-goal.test.cjs`) but neither was run, so the exit-0 evidence is unverified. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `006` SC-002 and SC-003: both test files exist (`.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs`, `skilled-loop-wrapper-claim-goal.test.cjs`) but neither was run, so the exit-0 evidence is unverified.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `006` SC-002 and SC-003: both test files exist (`.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs`, `skilled-loop-wrapper-claim-goal.test.cjs`) but neither was run, so the exit-0 evidence is unverified.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- `dropNestedLoop` deleting `SKILLED_LOOP_CLAIM_SEED`: the seed is re-read after the drop and the hook exits when it is gone, which the comment at `compact-pointer.mjs:187-193` states is intended (iteration 1, evidence: `relaunch-core.cjs:2044-2046`).
- Goal switch default-on semantics: `goalSwitchOn` treats only `0/false/off/no` as off, matching its documented contract (iteration 1, evidence: `relaunch-core.cjs:466-469`).
- Hop-cap off-by-one: `hops >= hopLimit` matches the completed-hop meaning of the field (iteration 1, evidence: `relaunch-core.cjs:1257-1267`).
- `resolveSessionSettings` calling a missing reader: both `readClaudeSettings` and `readCodexSettings` are exported (iteration 1, evidence: `context-usage.cjs:395-398`).
- Manual `skilled-loop` bypassing wrapper containment: the wrapper path is derived from the sourced shim's canonical checkout, not from `$PWD` (iteration 2, evidence: `skilled-loop-shell.sh:52-69`, `:325-335`).
- Terminal-escape injection through `goal not carried:`: the reason is a fixed vocabulary plus a match count, not goal or packet text (iteration 2, evidence: `relaunch-core.cjs:644-647`).
- `SKILLED_LOOP_TRUSTED_CHECKOUTS` colon splitting widening trust: the value is operator-supplied and a `:` can only truncate or rename an entry (iteration 2, evidence: `skilled-loop-shell.sh:243-260`).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining — maintainability (D4) completed this iteration; max iterations reached. - Focus area: none for this run. - Reason: `maxIterations: 3` is exhausted. The terminal synthesis should treat R1-P1-001 as open, finding 8 as the duplication follow-up, and finding 9 as the documentation follow-up. - Rotation status: correctness `partial`; security `partial`; traceability `partial` (core); maintainability `covered` (this iteration). - Blocked/productive carry-forward: productive = full reads of the nudge/CLI pair and the producer/consumer event-name path; blocked = none. - Required evidence for a future run: the unchecked child packets 001/003/004/007, every `acceptance-criteria.md` row, `commands/speckit/handoff.md`, the goal-hook playbook, and a captured Claude startup payload set. - Recovery note: the overlays and checklist evidence remain deferred rather than silently passed; a resumed run must start there, not at the dimensions already recorded. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Prior review and verification of the behaviour before this change are in `scratch/review-1.md` and `scratch/verify-1.md` of the spec folder. The build diff is `scratch/build.diff`. Each child holds a failing run in `scratch/red.txt` and a passing run in `scratch/green.txt`. The parent `goal.md` records decisions D1 to D5 and the progress log. No hop was run live on any runtime.

resource-map.md not present; skipping coverage gate

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 3 | 002/005/006 checked against code in iterations 1-2; the Claude start-claim path rechecked against `README.md:183-184` and `compact-pointer.mjs:169-174`; 001/003/004/007 still unchecked |
| `checklist_evidence` | core | deferred | 3 | no `acceptance-criteria.md` opened; no Met row claimed |
| `skill_agent` | overlay | deferred | 3 | `commands/speckit/handoff.md` not read |
| `agent_cross_runtime` | overlay | notApplicable | 3 | no agent definition in scope; the Claude event-policy comparison is recorded under `spec_code` |
| `feature_catalog_code` | overlay | deferred | 3 | not reached |
| `playbook_capability` | overlay | deferred | 3 | goal-hook playbook not read |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [path/to/file] | [D1, D3] | [N] | [0 P0, 1 P1, 2 P2] | [partial/complete] |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: [from config]
- Convergence threshold: [from config]
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=[from config.sessionId], parentSessionId=[from config.parentSessionId], generation=[from config.generation], lineageMode=[from config.lineageMode]
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: [from config.maxToolCallsPerIteration] tool calls, [from config.maxMinutesPerIteration] minutes
- Severity threshold: [from config.severityThreshold]
- Review target type: [from config.reviewTargetType]
- Cross-reference checks: core=[from config.crossReference.core], overlay=[from config.crossReference.overlay]
- Started: [timestamp]
<!-- MACHINE-OWNED: END -->

---

## 17. EXAMPLE (POPULATED)

Reference snippet showing a partially populated strategy file mid-review. Use this as a visual anchor when opening a live strategy doc.

```markdown
## 1. REVIEW CHARTER
- Target: .skilled/skills/system-deep-loop/deep-research (skill, v1.4.0)
- Dimensions: correctness, test-coverage, cross-runtime-parity, observability
- Stop conditions: rolling newInfoRatio < 0.08 for 2 iterations OR all dimensions converged OR max=7 reached
- Success criteria: zero P0 in correctness; test-coverage P0 resolved or deferred with rationale

## 4. NEXT FOCUS
- Dimension: test-coverage
- Files: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-contract-parity.vitest.ts
- Why: Iteration 2 surfaced a P0 (convergence-path coverage gap); needs a focused follow-up before correctness can terminate PASS.

## 9. COVERAGE MATRIX
| Dimension            | Status     | Iterations touched |
|----------------------|------------|--------------------|
| correctness          | converged  | 1                  |
| test-coverage        | converging | 2, 4               |
| cross-runtime-parity | converging | 3                  |
| observability        | converging | 4                  |
```
