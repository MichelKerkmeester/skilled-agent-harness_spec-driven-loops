---
title: "Tasks: Phase 5: budget-and-chat-slice-handoff"
description: "Task Format: [ ] T### [P0|P1|P2] Description (file path)"
trigger_phrases:
  - "budget and handoff tasks"
  - "packet budget verification"
  - "chat slice handoff check"
  - "criterion count preserved"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: budget-and-chat-slice-handoff

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| [ ] | Pending |
| [x] | Completed |
| [B] | Blocked |
| [P0] | Blocker, cannot close while incomplete. |
| [P1] | Required, complete or defer with approval. |
| [P2] | Optional, defer with a reason. |

**Task Format**: [ ] T### [P0] Description (file path)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the frozen parent handoff and use the phase 004 entry condition and phase 006 exit check as setup and verification gates (specs/sk-doc/060-create-goal-mode/spec.md:145-146). Evidence: phase 004 closed with strict `RESULT: PASSED` and its fixture bound 3 of 3 phases.
- [x] T002 [P0] Confirm the 4,000-character setting, packet command fields and slice projections from the manifest, CLI and shared module (.skilled/skills/system-spec-kit/templates/spec-kit-docs.json:24-28, .skilled/hooks/goal/bin/goal.cjs:203-216, .skilled/hooks/goal/lib/goal-slice.cjs:59-79,96-118). Evidence: the reference cites the manifest limit, the packet output fields and both slice builders (`.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md:21`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P0] Create .skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md with the read-only command, output fields and set-string cut order (.skilled/hooks/goal/bin/goal.cjs:203-216, .skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:61-71). Evidence: `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md` created with the command, both output fields and the playbook cut order (`.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md:37`).
- [x] T004 [P0] Document chat_slice versus objective_slice, the six-runtime matrix and the rule that the mode prints chat_slice and stops without bind or set (.skilled/hooks/goal/lib/goal-slice.cjs:66-79,96-118, .skilled/hooks/goal/goal-plugin.md:151-170, specs/sk-doc/060-create-goal-mode/goal.md:51-54). Evidence: `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md:51` and `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md:61`; the file contains no `goal.cjs bind` or `goal.cjs set` (grep exit 1).
- [x] T005 [P1] Record that the fixed-text cost is not a system-spec-kit amendment on current evidence, cite the parent goal's 4,820-to-3,735 log and preserve the D4 escalation if a contract gap remains (specs/sk-doc/060-create-goal-mode/goal.md:52-54,136). Evidence: `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md:76` records the 4,820 to 3,735 parent cut and keeps the fixed-text cost out of system-spec-kit.
- [x] T006 [P0] Create a temporary top-level packet with an over-budget parent goal, trim it in order without dropping a completion criterion and retain before/after criterion counts for comparison (.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:61-71, specs/sk-doc/060-create-goal-mode/spec.md:146). Evidence: a temporary level 2 fixture measured 5,897 (`over`), was cut to 3,256 (`ok`) with 5 criteria before and after, then removed.
- [x] T010 [P1] Load `references/budget-and-handoff.md` from the `SKILL.md` budget and handoff steps and list it in `references/README.md` (operator-approved amendment). Evidence: `SKILL.md:109` loads the reference at the chat-slice step and `references/README.md:25` lists it.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 [P0] Run the packet command before and after trimming, require the final output to show packet_durable_chars, packet_budget=ok, objective_slice and chat_slice, and compare criterion counts (.skilled/hooks/goal/bin/goal.cjs:203-216, .skilled/hooks/goal/lib/goal-slice.cjs:399-428). Evidence: before `packet_durable_chars=5897` `packet_budget=over`; after `3256` `ok`; the final output has both `chat_slice` and `objective_slice` (`specs/sk-doc/060-create-goal-mode/005-budget-and-chat-slice-handoff/scratch/budget-fixture-evidence.md`).
- [x] T008 [P1] Check every repository fact in the new reference against a path:line citation and confirm the Cursor packet-read path is described separately from packet-log (.cursor/commands/goal-cursor.md:14-19, specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-mode-anatomy-audit.md:72). Evidence: every fact in the reference links its source file; the orchestrator removed a drifting log line-number cite.
- [x] T009 [P0] Run bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode/005-budget-and-chat-slice-handoff --strict and require an explicit RESULT: PASSED or report the generated metadata findings reserved for orchestration. Evidence: `RESULT: PASSED`, 0 errors and 0 warnings, on 2026-09-26.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] [P0] All implementation and verification tasks are complete with evidence recorded.
- [x] [P0] The temporary fixture ended within budget and retained the original criterion count.
- [x] [P1] The strict validator result and any generated-metadata findings are recorded.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See spec.md
- **Plan**: See plan.md
- **Acceptance criteria**: See acceptance-criteria.md
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

- [x] CHK-001 [P0] Requirements in spec.md state measurable budget, projection, runtime and fixture outcomes.
- [x] CHK-002 [P0] Plan names the exact packet command, workspace scope, retained file and observable fixture check.
- [x] CHK-003 [P1] Phase 004 incoming handoff is confirmed before implementation (specs/sk-doc/060-create-goal-mode/spec.md:145).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The reference uses the shared CLI's packet measurement rather than a second character counter (.skilled/hooks/goal/bin/goal.cjs:203-216, .skilled/hooks/goal/lib/goal-slice.cjs:268-285).
- [x] CHK-011 [P1] No code or runtime command is added by this phase, only the planned reference is retained (specs/sk-doc/060-create-goal-mode/spec.md:86,94-99).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] The fixture begins with packet_budget=over and ends with packet_budget=ok.
- [x] CHK-021 [P0] The fixture's completion-criterion count matches before and after the cut.
- [x] CHK-022 [P1] Packet output contains both objective_slice and chat_slice, and the reference names chat_slice as the handoff payload (.skilled/hooks/goal/bin/goal.cjs:208-216).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P1] If ordered cuts cannot fit a goal without dropping a criterion, leave the criterion intact and report the system-spec-kit gap under D4 (.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:68-71, specs/sk-doc/060-create-goal-mode/goal.md:52-54).
- [x] CHK-FIX-002 [P1] Confirm every observed command or projection claim in the reference cites its source path and line.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The handoff uses only the packet read action and never invokes bind or set (.skilled/hooks/goal/bin/goal.cjs:203-216,233-246, specs/sk-doc/060-create-goal-mode/goal.md:51-54).
- [x] CHK-031 [P1] Keep the temporary packet beneath the explicit workspace root passed to --workspace (.skilled/hooks/goal/bin/goal.cjs:33-75).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] The reference distinguishes the chat slice from the bind-time objective slice and cites both source paths (.skilled/hooks/goal/lib/goal-slice.cjs:66-79,96-118).
- [x] CHK-041 [P1] The runtime matrix records all six surfaces and the Cursor packet-log caveat (.skilled/hooks/goal/README.md:75-84, .cursor/commands/goal-cursor.md:14-19).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The fixture is created under a temporary directory within the workspace root.
- [x] CHK-051 [P1] The temporary fixture is removed after verification, only the planned reference remains as an implementation output (specs/sk-doc/060-create-goal-mode/spec.md:86,89,104).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 10 | 10/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-09-25
<!-- /ANCHOR:summary -->

---
