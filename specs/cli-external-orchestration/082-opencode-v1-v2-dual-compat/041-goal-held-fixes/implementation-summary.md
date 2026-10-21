---
title: "Implementation Summary"
description: "All nine goal plugin and goal core findings the alignment audit held are fixed, each with a test that fails under a mutation restoring the old code, and goal writes are now locked per session across processes."
trigger_phrases:
  - "goal held fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/041-goal-held-fixes"
    last_updated_at: "2026-10-21T06:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Pushed to main at 3504edde0e; all 15 CI workflows passed"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/plugins/opencode-goal.js"
      - ".skilled/hooks/goal/lib/goal-core.cjs"
      - ".skilled/hooks/goal/bin/goal.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-041-goal-held-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 041-goal-held-fixes |
| **Completed** | 2026-10-21 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A goal no longer disappears because a mutator found nothing to change, and replacing, clearing or rebinding a goal keeps the old record in history. The verifier then showed that a second OpenCode process could still slip a goal in between an archive and the write after it. So each session's goal writes now hold a lock across processes, and a lock left by a crashed run is broken at once.

### Fix the goal plugin and goal core findings the alignment audit held for the operator

| Finding | Fix commit | Test that fails without it | Mutation |
|---------|-----------|----------------------------|----------|
| b01-plugins-goal-003 null deletes the goal | `a9a6f2fc68` | state: 'accountUsage keeps a goal another process wrote after the read' | m-b01-003 |
| b01-plugins-goal-004 stale continuation objective | `6676301298` | continuation: 'continuation prompt carries the current packet criteria, not the bind-time copy' | m-b01-004 |
| b01-plugins-goal-005 replace not archived | `92e6379de5` | capabilities: 'replacing and clearing a goal leaves both records in history' | m-b01-005 |
| b01-plugins-goal-N01 clear not archived | `92e6379de5`, revision `0a9a6a1023` | same test, plus the cleared revision assertion | m-b01-N01, m-revision |
| b01-plugins-goal-001 archive name collision | `d43b94c624`, `ae7a4ce68f` | lifecycle: 'session.deleted archives a second goal for the same session without overwriting', plus the rebind, race and restore tests | m-b01-001, m-dedupe, m-race |
| b01-plugins-goal-008 null status candidate | `8fd6199a68`, `39a3259022` | capabilities: the `statusCodeFromError` cases for `null`, `''` and `false` before a 429 | m-b01-008, m-b01-008b |
| b08-hooks-goal-006 parse error falls through | `23a69afbd7` | goal-core: 'a malformed current record never falls through to the legacy scoped record' | m-b08-006 |
| b08-hooks-goal-007 JSON null archive | `fe63af3f0a` | goal-core: 'listArchivedGoals skips archive files whose JSON is not a plain object' | m-b08-007 |
| b08-hooks-goal-N01 cwd without `--workspace` | `651ca91307` | goal CLI: 'session actions without a workspace fail with MISSING_WORKSPACE and write nothing' | m-b08-N01 |

The verifier's later rounds added three fixes. `0a9a6a1023` locks each session's mutation across processes and stops archive pruning from deleting a staged goal. `1277f2ec9a` takes the rebind snapshot inside that lock. `cce87d388f` breaks a lock whose owner process is gone. Their mutations are m-lock, m-prune, m-bind and m-deadowner. Every mutation in `scratch/mutations/summary.txt` fails at least one test.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/opencode-goal.js` | Modified | Delete sentinel, archive on replace, clear and rebind, collision-free archive placement, continuation objective, status parsing, session lock |
| `.skilled/hooks/goal/lib/goal-core.cjs` | Modified | Stop at an unreadable current record; skip non-object archives |
| `.skilled/hooks/goal/bin/goal.cjs` | Modified | `MISSING_WORKSPACE` for session actions without `--workspace` |
| `.opencode/plugins/tests/opencode-goal-*.test.cjs`, `.skilled/hooks/goal/**/*.test.cjs` | Modified | A test per finding |
| `.hermes/SYNC.md`, cli-hermes goal-hook playbooks, speckit yaml notes, system-spec-kit `SKILL.md` and its Hermes copy | Modified | Every caller and doc passes or documents `--workspace` |
| cli-opencode `goal-hook.md` playbook | Modified | Suite count 139/139 to 152/152 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 flash wrote each change through cli-pi from a one-change brief. Each fix was then checked by restoring its old line and confirming its test fails. Luna reviewed read-only in four rounds and one narrow confirm pass. The plugin, hooks node and battery unit suites were rerun after the last change, and the live opencode-goal scenario ran on OpenCode 1 and 2 at the final plugin code.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A `DELETE_GOAL` sentinel instead of `null` | Event mutators return `null` to mean "no goal here", so only an explicit sentinel may remove a record |
| A cleared record goes to the archive with status `cleared`, which stays out of the transition table | It matches the core's history while keeping `cleared` from ever being an active state |
| The active file is renamed into the archive folder before it is linked to its final name | Link then unlink could delete a goal written in between; a rename moves exactly the bytes being archived |
| A per-session lock is a symlink naming the owner pid, beside the in-process queue | The queue cannot stop another process; a pid lets a crashed owner's lock be broken at once instead of failing writes for the 120 s stale window |
| When the state root refuses the lock with EACCES, EPERM or EROFS, the mutation runs and reports its own write error | A root that refuses the lock almost always refuses the write too, and an existing test expects `WRITE_GOAL_FAILED` there |
| A fifth, narrow verifier pass after round four | The live v1 rerun after round four found the lock left behind by a mid-write exit, which does damage, so it was fixed and confirmed rather than shipped unverified |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Plugin suite | PASS, 481/481 before, 494/494 after (`scratch/baseline.txt`, `scratch/after.txt`) |
| Hooks node tests (goal CLI and core included) | PASS, 836/836 before, 840/840 after |
| Battery unit | PASS, 51/51 before and after |
| Mutations | 17 of 17 fail at least one test (`scratch/mutations/summary.txt`) |
| Live opencode-goal, OpenCode 1 and 2 | PASS on both: `STATUS=OK ACTION=set`, one 64-hex state file holding `7Q4Z`, `[active_goal:goal-…]` injected (`scratch/live-goal/`) |
| 039 path-escape tests | PASS inside the plugin suite |
| Luna | Rounds 1 to 3 FAIL with each finding fixed; round 4 PASS; the confirm pass raised one P1 that cannot occur, see Known Limitations (`scratch/luna/`) |
| Recursive strict validation of 082 | PASS, 42 folders `RESULT: PASSED` after the merge |
| Suites after merging main | PASS, plugins 516/516, hooks node 856/856, battery unit 51/51 |
| CI on `3504edde0e` | 15 of 15 success: Markdown Link Integrity 39556537145, Advisory Checks 39556537214, OpenCode Plugin Tests 39556537139, Message Contract 39556537200, Trigger Index Rebuild 39556537253, Dispatch Enforcement Guard 39556537260, Gate Inputs 39556537158, Rule Canary Sync 39556537251, Playbook Operator Contract 39556537206, Command Tree Parity 39556537144, Changed Packet Validation 39556537146, sk-doc Script Tests 39556537137, OpenCode Dual-Version Battery 39556537219, Routing Registry Drift Guard 39556537201, Spec-Kit Check 39556537168 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Directory locks from the interim format.** The confirm pass found that a `.lock-` directory, the format before `cce87d388f`, cannot be removed by the symlink code. That format existed only in this worktree between two local commits. No remote branch or main ever held it, so no such lock can exist outside a test temp folder.
2. **Check-then-remove window.** Two waiters can both judge one lock abandoned, and the slower can remove the lock the faster just took. The shared core's lock has the same window.
3. **Unlocked fallback.** Under an ACL that refuses the lock entry but allows files, or on Windows without symlink privilege, mutations run without the cross-process lock.
4. **Legacy-name migration.** The active-file and archive migrations still link and then unlink the legacy name. Only an older plugin writing that name could race them; current code never writes it.
5. **Leftover temp file.** A v1 run that exits mid-write leaves a `writeGoalAtomic` `.tmp` file behind. This predates the phase.
6. **Plugin size.** The plugin is still one file of 3,727 lines; splitting it is a separate change.
<!-- /ANCHOR:limitations -->

---
