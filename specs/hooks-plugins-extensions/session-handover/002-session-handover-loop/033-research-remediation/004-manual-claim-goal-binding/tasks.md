---
title: "Tasks: Phase 4: manual-claim-goal-binding"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "manual claim goal binding tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: manual-claim-goal-binding

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phase 002 is Complete (`../002-consume-locked-withdraw/`). Evidence: its spec.md and acceptance-criteria.md read Status Complete, Closeable Yes
- [x] T002 Record the baseline of both test commands in `plan.md` section 5. Evidence: node 907/907, vitest 59/59 (`scratch/evidence/baseline-node.txt`, `baseline-vitest.txt`)
- [x] T003 [P] Write failing tests "claim seed parser inverts the seed suffix" and "usableGoalPacket is exported by the core" (`.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`). Evidence: red with `TypeError: parseClaimSeed is not a function` and `usableGoalPacket is not a function` (`scratch/evidence/red-core.txt`)
- [x] T004 [P] Write failing tests "manual first launch with a claim seed exports the note goal packet" and "manual first launch ignores a seed for a claimed or outside note", plus one seed-position test each for Claude positional, one flag form (OpenCode `--prompt`, Hermes `-q` or Devin `--`) and an OpenCode launch with `--standalone` prepended, each asserting the operator's other arguments survive (`.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`). Evidence: 5 of 6 red on the missing packet with the argument assertions passing (`scratch/evidence/red-wrapper.txt`); the ignore test passes before and after, and fails when the open-state or containment guard is removed (`scratch/evidence/negative-control-*.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add `parseClaimSeed` and export it (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`)
- [x] T006 Move `usableGoalPacket` into the core and export it (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`)
- [x] T007 Import the core helper and delete the local copy (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`)
- [x] T008 After `:635`, scan `launch_arguments` for the claim-prefix element and record its index; export the packet, set `HERMES_SPEC_FOLDER` on Hermes, and on Claude with a renderable slice replace that element with `/goal <slice>` and export `SKILLED_LOOP_CLAIM_SEED`; never call `build_relaunch_arguments` on a first launch (`.skilled/bin/skilled-loop`). Evidence: `seeded_goal_packet` plus the scan loop after the OpenCode `--standalone` prepend; no call to `build_relaunch_arguments` outside the hop branch and the subshell template builders
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs` and `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts`; record the delta against T002. Evidence: node 915/915 (+8 new, 0 fail), vitest 59/59 (`scratch/evidence/final-node.txt`, `final-vitest.txt`)
- [x] T010 Confirm the inherited-packet test passes unedited and `goal-handover.test.cjs` is green. Evidence: both green in `final-node.txt`; the inherited test body is unchanged in the diff
- [ ] T011 Optional live proof: one manual Pi claim with a goal-bearing note. Not run: optional, and the stub-runtime table tests cover the export
- [x] T012 Update README line 193 and the goal section near 164-174 (`.skilled/hooks/session-relaunch/README.md`). Evidence: the goal paragraph (now line 176) and the Devin and Cursor bullet (now line 195) describe the seeded first launch
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (T011, the optional live Pi claim, was not run)
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (stub-runtime table tests; live run not done)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: spec.md section 4, REQ-001 to REQ-005
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan.md section 3
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: phase 002 Complete; `goalPacketProblem` and `goalSwitchOn` exported by the core
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: `bash -n` exit 0 and `shellcheck -S warning` exit 0 on skilled-loop; no new JS line over 100 columns
- [x] CHK-011 [P0] No console errors or warnings. Evidence: full node suite 915/915 and vitest 59/59 with no new stderr; the seeded Claude case asserts no goal warning line
- [x] CHK-012 [P1] Error handling implemented. Evidence: `seeded_goal_packet` wraps the read in try/catch, discards stderr and prints nothing on any failure, so the launch goes on unbound
- [x] CHK-013 [P1] Code follows project patterns. Evidence: same inline `node -e` helper shape as `render_goal_slice` and `handoff_note_state`; the hop's Claude and Hermes export rules reused
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria.md AC-001 to AC-006 Met
- [x] CHK-021 [P0] Manual testing complete. Evidence: stub-runtime table tests drive the real wrapper for all seven runtimes; the optional live Pi claim (T011) was not run
- [x] CHK-022 [P1] Edge cases tested. Evidence: path holding the marker text, invalid folder in the suffix, Skip suffix with a non-none folder, relative path, missing prefix, line break, no-slice Claude fallback, OpenCode 2 `--standalone` prepend
- [x] CHK-023 [P1] Error scenarios validated. Evidence: claimed, missing and symlinked-outside notes, a note outside the handoffs directory, a packet that lost goal.md, the switch off
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.. Evidence: `cross-consumer`: the seed builder, the receiving adapters and the wrapper all read the same seed text
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.. Evidence: `scratch/evidence/inventories.txt`: seed producers are the core `manualClaimCommand`, `specFolderSuffix` and the wrapper's hop and template seeds; `nudge.cjs` parses seeds with its own first-marker split
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.. Evidence: `scratch/evidence/inventories.txt`: `usableGoalPacket` is defined only in the core and called by the CLI's claim and consume through `noteGoalPacket`; `parseClaimSeed` is called only by the wrapper
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.. Evidence: `claim seed parser inverts the seed suffix` covers delimiter-in-path, missing prefix, relative path, leading space, empty path, joined lines and non-string input; the wrapper ignore test covers outside-root by symlink and by path, and the no-op fallback
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.. Evidence: runtime (7) by note state (open, claimed, missing, outside by link, outside by path, packet without goal.md, switch off): open on all 7, claimed, missing, linked-outside and lost goal.md on Claude and Hermes, switch off and outside-path on Claude; the no-seed row is the inherited-packet test
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.. Evidence: the inherited-packet test sets an outer `SESSION_RELAUNCH_GOAL_PACKET`; the Hermes case sets an operator `HERMES_SPEC_FOLDER`, which the seeded packet replaces
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.. Evidence: working tree on HEAD `20dfa9fec6`, uncommitted; files listed in implementation-summary.md
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: none added
- [x] CHK-031 [P0] Input validation implemented. Evidence: `parseClaimSeed` refuses non-absolute and malformed paths; the wrapper reads only a real path inside the handoffs directory; `goalPacketProblem` gates the packet
- [x] CHK-032 [P1] Auth/authz working correctly. Evidence: not applicable, local tooling with no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: deviations recorded in implementation-summary.md Key Decisions
- [x] CHK-041 [P1] Code comments adequate. Evidence: comments state the why only, no spec or phase ids
- [x] CHK-042 [P2] README updated (if applicable). Evidence: README goal paragraph and Devin and Cursor bullet
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: evidence under `scratch/evidence/`
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: only evidence files remain in scratch/
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---



