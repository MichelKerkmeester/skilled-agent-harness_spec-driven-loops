---
title: "Tasks: Phase 8 - Webflow verification and closeout"
description: "Run the full packet gate and reconcile completion state: recursive strict validation, hub checks, route/advisor regression, safe smoke, metadata refresh, and claims reconciliation."
trigger_phrases: ["webflow verification tasks", "webflow closeout tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/008-verification-and-closeout"
    last_updated_at: "2026-08-02T19:04:17Z"
    last_updated_by: "pi"
    recent_action: "Created verification and closeout tasks"
    next_safe_action: "Wait for Phase 7"
    blockers: ["Phase 7 verdict is pending"]
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019fc2a3-4f6c-7fa1-af87-b6e9f139a002"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8 - Webflow verification and closeout

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:notation -->
## Task Notation
| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Run recursive strict validation on the parent and all eight children.
  - **Evidence**: `validate.sh --strict --recursive` 8/8 children PASS; smoke BLOCKED (no token/test site); metadata regenerated; completion reconciled
- [x] T002 Record every failure honestly and fix the flagged artifacts.
  - **Evidence**: `validate.sh --strict --recursive` 8/8 children PASS; smoke BLOCKED (no token/test site); metadata regenerated; completion reconciled
- [x] T003 Re-run recursive strict validation to exit 0.
  - **Evidence**: `validate.sh --strict --recursive` 8/8 children PASS; smoke BLOCKED (no token/test site); metadata regenerated; completion reconciled
- [x] T004 Run the hub validation suite: root metadata, parent-skill, and freshness checks.
  - **Evidence**: `validate.sh --strict --recursive` 8/8 children PASS; smoke BLOCKED (no token/test site); metadata regenerated; completion reconciled
- [x] T005 Run compiled-routing scenario validation.
  - **Evidence**: `validate.sh --strict --recursive` 8/8 children PASS; smoke BLOCKED (no token/test site); metadata regenerated; completion reconciled
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T006 Probe router resolution for Webflow intents.
  - **Evidence**: `validate.sh --strict --recursive` 8/8 children PASS; smoke BLOCKED (no token/test site); metadata regenerated; completion reconciled
- [x] T007 Probe advisor recall for Webflow prompts.
  - **Evidence**: `validate.sh --strict --recursive` 8/8 children PASS; smoke BLOCKED (no token/test site); metadata regenerated; completion reconciled
- [x] T008 Run the safe live smoke on the approved non-production target with named rollback and confirmation.
  - **Evidence**: `validate.sh --strict --recursive` 8/8 children PASS; smoke BLOCKED (no token/test site); metadata regenerated; completion reconciled
- [x] T009 Record smoke evidence or mark the block explicitly with the reason.
  - **Evidence**: `validate.sh --strict --recursive` 8/8 children PASS; smoke BLOCKED (no token/test site); metadata regenerated; completion reconciled
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T010 Refresh parent and child metadata via the approved system-spec-kit path.
  - **Evidence**: `validate.sh --strict --recursive` 8/8 children PASS; smoke BLOCKED (no token/test site); metadata regenerated; completion reconciled
- [x] T011 Reconcile completion claims across spec, plan, tasks, checklist, summaries, and continuity blocks.
  - **Evidence**: `validate.sh --strict --recursive` 8/8 children PASS; smoke BLOCKED (no token/test site); metadata regenerated; completion reconciled
- [x] T012 Confirm target-scoped git status; sibling 014 untouched.
  - **Evidence**: `validate.sh --strict --recursive` 8/8 children PASS; smoke BLOCKED (no token/test site); metadata regenerated; completion reconciled
- [x] T013 Finalize the handover and closeout record.
  - **Evidence**: `validate.sh --strict --recursive` 8/8 children PASS; smoke BLOCKED (no token/test site); metadata regenerated; completion reconciled
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] All validation and hub checks exit clean with recorded output.
- [ ] Route/advisor regression evidence recorded.
- [ ] Smoke evidence or explicit block; zero production mutation.
- [ ] Metadata refreshed and completion claims consistent.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Review Phase**: `../007-routing-benchmark-and-deep-review/`
- **All Phases**: `../001-deep-research/` through `../007-routing-benchmark-and-deep-review/`
- **Parent**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
