---
title: "Tasks: Injection Contract Directive Sync"
description: "Completed tasks for synchronizing the three shared advisor directives, OpenCode fallback parity, and Pi-only directive ownership in the injection contract."
status: complete
completion_pct: 100
trigger_phrases:
  - "injection contract sync tasks"
  - "directive inventory tasks"
  - "contract grep tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/038-fable-governor-pi-hook/009-injection-contract-directive-sync"
    last_updated_at: "2026-08-05T00:10:10Z"
    last_updated_by: "pi-phase-009-implementation"
    recent_action: "Completed contract synchronization tasks with final grep and bridge-test receipts"
    next_safe_action: "Phase 008 must consume the scoped handoff without changing this phase's contract evidence"
    blockers:
      - "Parent recursive strict validation remains blocked by pre-existing generated-metadata drift in phases 001-008."
    key_files:
      - "spec.md"
      - "plan.md"
      - ".opencode/hooks/injection-contract.md"
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
    session_dedup:
      fingerprint: "sha256:f4f7580719d74ebfcfda8274465eaa380b34f6f21aa993c7222207ca286dadd8"
      session_id: "2026-08-05-cli-038-009-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Injection Contract Directive Sync

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

Every completed task names its observed evidence command or artifact. A grep assertion is evidence only for the exact pattern it searches; it is never generalized into an unrun check.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read the live `injection-contract.md` Skill Advisor Brief entry and record which of the three directives (comment hygiene, governor, proof-over-appearance) it names, with or without owning modules. [EVIDENCE: pre-edit contract scan exited 0; it named all three shared directives and the render/bridge paths but had no Pi-only ownership row, while the safe negative control confirmed the Pi constant was absent from the contract.]
- [x] T002 [P0] Grep the advisor render core for `HYGIENE_DIRECTIVE`, `GOVERNOR_DIRECTIVE`, `TERMINAL_PROOF_DIRECTIVE`, and `renderAdvisorBrief`; grep the OpenCode bridge for the fallback emission of the same directives. [EVIDENCE: final render scan exited 0 at `render.ts:53,60,65,163,204,210,215`; bridge scan exited 0 at `mk-skill-advisor-bridge.mjs:320-322,339,369,374,377-379,452-454`.]
- [x] T003 [P1] Grep the Pi `prompt-advisor.ts` transform path and confirm whether the contract's Pi channel row (`[MSG]`, visible input transform) still matches. [EVIDENCE: final Pi source scan exited 0 at `prompt-advisor.ts:49-52,64,66,104-106`; the contract channel and ownership scan exited 0 with the `[MSG]` forwarder and Pi-only owner rows.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Align the Skill Advisor Brief entry in `injection-contract.md`: name all three directives, their owning module and constants (`render.ts`, `renderAdvisorBrief`), the OpenCode fallback emitter (`mk-skill-advisor-bridge.mjs`), and keep sample text clearly illustrative. [EVIDENCE: final directive, canonical-owner, and bridge-parity greps each exited 0; the sample now includes the proof prefix without republishing the full constant text.]
- [x] T005 [P1] Verify per-runtime channel rows and the forwarder role: Claude/Cursor/Devin/Codex `[SYS]`, OpenCode `[SYS]` via `experimental.chat.system.transform`, Pi `[MSG]` via `prompt-advisor.ts` as forwarder, not owner. [EVIDENCE: final per-runtime scan exited 0; Pi-only ownership scan exited 0; negative controls confirmed shared constants are absent from Pi and the Pi-only constant is absent from render/bridge.]
- [x] T006 [P1] Confirm no source file outside the contract changed and no contract wording claims a directive moved to a module the greps do not support. [EVIDENCE: targeted diff shows the contract edit plus Phase 009 docs only; source ownership and bridge scans exited 0, and no source/test file is in the Phase 009 diff.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 [P0] Run every objective grep assertion from the final state and record each command and exit status. [EVIDENCE: all seven directive/ownership/channel grep assertions in `spec.md` §5 exited 0; the bridge regression test passed 14/14; safe negative controls exited 0 as expected.]
- [x] T008 [P1] Run strict validation for this phase, fix every in-scope error, and report the user-required dirty-worktree freshness warning separately without committing. [EVIDENCE: final strict validation completed all structural checks with `Errors: 0`; exit code 2 is solely the `CONTINUITY_FRESHNESS` warning for uncommitted Phase 009 paths, which cannot be cleared without the forbidden commit.]
- [x] T009 [P1] Hand the dated verification row and any residual drift note to Phase 008 for final state reconciliation. [EVIDENCE: the implementation summary records the 2026-08-04 verification row, scoped rollback boundary, and the pre-existing parent recursive-validation blocker; no Phase 008 file was modified; handoff scan exit code 0.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All three shared directives are named in the contract with a documented canonical owner, fallback emitter, and channel row; the Pi-only directive owner and forwarder role are explicit. [EVIDENCE: final contract/source grep set exited 0.]
- [x] Every objective grep passes and strict validation completes with zero structural errors; the dirty-worktree freshness warning is separately reported. [EVIDENCE: final objective greps and bridge regression test pass; strict validator output is `Errors: 0`, `Warnings: 1`, exit code 2 solely for `CONTINUITY_FRESHNESS`.]
- [x] No render-core, bridge, or adapter file appears in the scoped diff. [EVIDENCE: targeted diff/name checks show the implementation contract and Phase 009 documentation only.]
- [x] Rollback boundary and residual limitations are recorded in `implementation-summary.md`. [EVIDENCE: final summary documents contract-only rollback, parent recursive blocker, and dirty-worktree caveat.]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See [spec.md](spec.md).
- **Plan**: See [plan.md](plan.md).
- **Checklist**: See [checklist.md](checklist.md).
- **Parent packet**: See [../spec.md](../spec.md).
- **Predecessor**: See [../008-phase-state-reconciliation/tasks.md](../008-phase-state-reconciliation/tasks.md).
<!-- /ANCHOR:cross-refs -->
