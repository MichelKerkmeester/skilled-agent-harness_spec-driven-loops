---
title: "Tasks: AI Deploy and Onboarding"
description: "Dependency-ordered task ledger for the one-command AI boot and the deterministic AI deploy playbook."
trigger_phrases:
  - "pi remote ai deploy and onboarding"
  - "pi mobile phase 16"
  - "ai deploy and onboarding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/001-pi-remote-mobile-agent-like-cc/016-ai-deploy-and-onboarding"
    last_updated_at: "2026-08-14T04:44:41Z"
    last_updated_by: "deepseek-v4-flash"
    recent_action: "Authored phase 016 ai-deploy-and-onboarding planning set as Draft"
    next_safe_action: "Run validate.sh on phase 016 and reconcile the parent packet map"
    blockers:
      - "Draft planning phase with implementation evidence pending"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 0
---

# Tasks: AI Deploy and Onboarding

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after its dependency |
| `[B]` | Blocked with an explicit reason |

**Task Format**: `T### [P?] Description (owned path or evidence surface)`

The planned deliverables live under `Apps/Pi Mobile/`. Unchecked rows remain pending implementation work and do not mean the phase is complete.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm active instructions, repository surface, workspace choice, owned paths, consumers, and authoritative gate.
- [ ] T002 Re-run predecessor and version-drift checks; capture the exact negative control for each prerequisite.
- [ ] T003 Freeze rollback, capability-disable, evidence, and secret-handling paths.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Inventory every boot stage, playbook step, and handoff consumer under `Apps/Pi Mobile/`.
- [ ] T005 [P] Author the fail-closed preflight stage for node, npm, the pi binary, and tailscale.
- [ ] T006 Author the build stage and the supervised relay start with mutation DEFAULT-OFF.
- [ ] T007 [P] Author the Serve verify-or-configure stage via `deploy/setup-tailscale-serve.sh` with no Funnel.
- [ ] T008 [P] Author the enrollment payload stage and the handoff print with the tailnet HTTPS URL, a QR or enrollment code, and copy-paste user instructions.
- [ ] T009 Author `docs/ai-deploy-playbook.md` with ordered steps, exact commands, expected outputs, decision points, the handoff message, and operator-only caveats.
- [ ] T010 Exercise the full boot twice on the target host and confirm idempotent convergence.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Run focused checks and retain exact command, output, exit, version, and environment evidence.
- [ ] T012 Run the authoritative phase gate and safe rollback or recovery exercise.
- [ ] T013 Reconcile checklist, current state, parent map, limitations, and scoped status.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements and non-deferred P1 requirements have objective evidence.
- [ ] No blocked task, failing gate, secret, temporary output, or unrelated edit remains.
- [ ] Dependent capabilities remain disabled whenever their required gate is absent or failing.
- [ ] Parent and operator statuses plus the handoff describe the same final state.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Parent map**: [../spec.md](../spec.md)
- **Specification**: [spec.md](spec.md)
- **Plan**: [plan.md](plan.md)
- **Verification**: [checklist.md](checklist.md)
- **Current state**: [implementation-summary.md](implementation-summary.md)
<!-- /ANCHOR:cross-refs -->
