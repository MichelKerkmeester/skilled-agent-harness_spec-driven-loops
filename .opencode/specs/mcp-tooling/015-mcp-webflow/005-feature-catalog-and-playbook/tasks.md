---
title: "Tasks: Phase 5 - Webflow feature catalog and manual playbook"
description: "Inventory verified capabilities and author safety-aware manual scenarios with complete evidence contracts."
trigger_phrases: ["webflow catalog tasks", "webflow playbook tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/005-feature-catalog-and-playbook"
    last_updated_at: "2026-08-02T21:10:00Z"
    last_updated_by: "pi"
    recent_action: "Created catalog and playbook tasks"
    next_safe_action: "Wait for Phase 4"
    blockers: ["Skill package is pending"]
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019fc2a3-4f6c-7fa1-af87-b6e9f139a002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5 - Webflow feature catalog and manual playbook

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
- [x] T001 Load feature-catalog and playbook authoring contracts.
  - **Evidence**: `mcp-webflow/feature-catalog/feature-catalog.md`; `manual-testing-playbook/` scenarios; `validate.sh --strict` 0/0
- [x] T002 Build capability/risk/source matrix from verified package.
  - **Evidence**: `mcp-webflow/feature-catalog/feature-catalog.md`; `manual-testing-playbook/` scenarios; `validate.sh --strict` 0/0
- [x] T003 Define target, fixture, confirmation, rollback, cleanup, and evidence rules.
  - **Evidence**: `mcp-webflow/feature-catalog/feature-catalog.md`; `manual-testing-playbook/` scenarios; `validate.sh --strict` 0/0
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T004 Generate one canonical entry per shipped capability.
  - **Evidence**: `mcp-webflow/feature-catalog/feature-catalog.md`; `manual-testing-playbook/` scenarios; `validate.sh --strict` 0/0
- [x] T005 Author setup, auth, discovery, and read scenarios.
  - **Evidence**: `mcp-webflow/feature-catalog/feature-catalog.md`; `manual-testing-playbook/` scenarios; `validate.sh --strict` 0/0
- [x] T006 Author safe-write, error, permission, rate, and recovery scenarios.
  - **Evidence**: `mcp-webflow/feature-catalog/feature-catalog.md`; `manual-testing-playbook/` scenarios; `validate.sh --strict` 0/0
- [x] T007 Author destructive/publish/deploy confirmation and tabletop scenarios.
  - **Evidence**: `mcp-webflow/feature-catalog/feature-catalog.md`; `manual-testing-playbook/` scenarios; `validate.sh --strict` 0/0
- [x] T008 Author `sk-design` pairing and routing-boundary scenarios.
  - **Evidence**: `mcp-webflow/feature-catalog/feature-catalog.md`; `manual-testing-playbook/` scenarios; `validate.sh --strict` 0/0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T009 Run catalog and playbook validators.
  - **Evidence**: `mcp-webflow/feature-catalog/feature-catalog.md`; `manual-testing-playbook/` scenarios; `validate.sh --strict` 0/0
- [x] T010 Reconcile tool, doc, catalog, and scenario coverage.
  - **Evidence**: `mcp-webflow/feature-catalog/feature-catalog.md`; `manual-testing-playbook/` scenarios; `validate.sh --strict` 0/0
- [x] T011 Run eligible non-production scenarios and record evidence.
  - **Evidence**: `mcp-webflow/feature-catalog/feature-catalog.md`; `manual-testing-playbook/` scenarios; `validate.sh --strict` 0/0
- [x] T012 Verify cleanup/rollback and no production mutation.
  - **Evidence**: `mcp-webflow/feature-catalog/feature-catalog.md`; `manual-testing-playbook/` scenarios; `validate.sh --strict` 0/0
- [x] T013 Update summary and hand off to Phase 6.
  - **Evidence**: `mcp-webflow/feature-catalog/feature-catalog.md`; `manual-testing-playbook/` scenarios; `validate.sh --strict` 0/0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] Full capability and risk-class coverage exists. [evidence: `feature-catalog/feature-catalog.md` all operation classes mapped]
- [x] Scenario evidence and failure triage are complete. [evidence: `manual-testing-playbook/` scenario files + refusal/publish-gate tests]
- [x] Production mutation is absent. [evidence: scenarios staged-only; `customDomains` forbidden per Phase 2 D5]
- [x] Validators pass. [evidence: validate.sh --strict exit 0]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Skill Package Phase**: `../004-skill-authoring/`
- **Next Phase**: `../006-hub-registration-and-advisor/`
<!-- /ANCHOR:cross-refs -->
