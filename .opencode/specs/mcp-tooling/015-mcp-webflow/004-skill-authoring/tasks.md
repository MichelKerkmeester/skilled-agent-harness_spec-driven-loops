---
title: "Tasks: Phase 4 - Author the mcp-webflow skill"
description: "Author and validate the nested Webflow mode package from verified evidence."
trigger_phrases: ["mcp-webflow authoring tasks", "webflow skill tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/004-skill-authoring"
    last_updated_at: "2026-08-02T14:00:00Z"
    last_updated_by: "pi"
    recent_action: "Created skill-authoring tasks"
    next_safe_action: "Wait for Phase 3"
    blockers: ["Integration evidence is pending"]
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019fc2a3-4f6c-7fa1-af87-b6e9f139a002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4 - Author the mcp-webflow skill

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
- [ ] T001 Load sk-create-skill and nested parent-hub rules.
- [ ] T002 Read Phases 1-3 evidence and freeze the document map.
- [ ] T003 Verify packet name, folder, tool surface, and no local advisor metadata.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T004 Author `SKILL.md` routing and rules.
- [ ] T005 Author README and install/connection guide.
- [ ] T006 Author tool-domain, auth, safety, and troubleshooting references.
- [ ] T007 Author safe examples and operation-class guidance.
- [ ] T008 Author packet changelog and cross-links.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T009 Run package and document validators.
- [ ] T010 Check links, placeholders, comments, and duplicate metadata.
- [ ] T011 Trace all claims to research or discovery evidence.
- [ ] T012 Audit examples for confirmation, rollback, production, and `sk-design` rules.
- [ ] T013 Update summary and hand off to Phase 5.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] Packet docs are complete, linked, evidence-backed, and safe.
- [ ] No packet-local advisor metadata exists.
- [ ] All validators pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Integration**: `../003-webflow-mcp-integration/`
- **Next Phase**: `../005-feature-catalog-and-playbook/`
<!-- /ANCHOR:cross-refs -->
