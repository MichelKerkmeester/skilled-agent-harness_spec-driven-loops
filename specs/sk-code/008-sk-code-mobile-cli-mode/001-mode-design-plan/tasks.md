---
title: "Tasks — sk-code Mobile-CLI mode — design plan [sk-code/008-sk-code-mobile-cli-mode/001-mode-design-plan/tasks]"
description: "Task ledger for sk-code Mobile-CLI mode — design plan (plan-only)."
trigger_phrases:
  - "tasks"
  - "code"
  - "mobile"
  - "cli"
  - "mode"
  - "001"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/008-sk-code-mobile-cli-mode/001-mode-design-plan"
    last_updated_at: "2026-08-24T12:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Reconciled to the Level 1 template contract"
    next_safe_action: "Implement the plan when this workstream is scheduled"
    blockers: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks — sk-code Mobile-CLI mode — design plan (plan-only)

<!-- ANCHOR:notation -->
## TASK NOTATION

`[ ]` open · `[x]` complete · `[~]` deferred with a stated reason. This packet is planned; all items are open.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [ ] Read the spec and confirm the frozen scope.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] Read and cite the hub contract: `sk-code/SKILL.md` §2 Smart Routing, `mode-registry.json`,
- [ ] Align the plan with the `sk-create-skill` mode-creation standards and templates. — read and cited
- [ ] Specify the packet identity: folder `sk-code-mobile-cli` (folder == `packetSkillName`) and its
- [ ] Specify the `mode-registry.json` entry (`workflowMode`, `packetKind: "surface"`,
- [ ] Specify the new `PI_REMOTE`/`MOBILE_CLI` surface-detection marker in `shared/` that matches
- [ ] Specify how the packet folds in the shared implement → debug → verify workflow doctrine via
- [ ] Specify how the packet encodes the token library layering, the `@ds` inline-comment grammar,
- [ ] State the out-of-scope boundary and enumerate the exact files a follow-on build packet creates. —
- [ ] Run the documentary grounding check and record evidence in `checklist.md`. Author **no** files
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] Run the plan's quality gate and record the evidence.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

Every Phase 2 item is done and the plan's quality gate is green from the final state.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- `spec.md` — the requirements. `plan.md` — the delivery plan.
<!-- /ANCHOR:cross-refs -->

---

