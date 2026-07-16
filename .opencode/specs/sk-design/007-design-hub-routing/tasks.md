---
title: "Tasks: Reconstruct the sk-design hub routing layer"
description: "Task breakdown for rebuilding the missing hub routing packet from the intact sk-design hub, mode registry, router policy, and required Level-2 document structure. Tasks preserve the single advisor identity and do not introduce runtime work."
trigger_phrases:
  - "hub routing reconstruction tasks"
  - "mode registry routing tasks"
  - "router vocabulary task breakdown"
  - "sk-design hub source traceability tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/007-design-hub-routing"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Drafted hub routing reconstruction tasks"
    next_safe_action: "Execute packet structure checks"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/SKILL.md"
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/sk-design/hub-router.json"
      - ".opencode/specs/sk-design/007-design-hub-routing/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-hub-routing-reconstruction-20260716"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Reconstruct the sk-design hub routing layer
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| [ ] | Pending |
| [x] | Completed |
| [P] | Parallelizable |
| [B] | Blocked |

Task Format: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the complete `.opencode/skills/sk-design/SKILL.md` and capture the hub identity, intake order, proof gates, and boundaries
- [ ] T002 [P] Read the complete `.opencode/skills/sk-design/mode-registry.json` and capture the discriminator, six entries, advisor routing, and transform extension
- [ ] T003 [P] Read the complete `.opencode/skills/sk-design/hub-router.json` and capture policy, signal groups, resources, and vocabulary classes
- [ ] T004 Read the four Level-2 manifest templates and the validated Level-2 reference packet
- [ ] T005 Record real shared, child-packet, reference, and asset paths named by the hub for traceability
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Author spec.md with the reconstruction banner, exact metadata row, one-identity contract, registry table, policy, signals, vocabulary, fallback, proof, and traceability
- [ ] T007 Author plan.md with source-first architecture, affected surfaces, bounded phases, testing strategy, dependencies, and rollback
- [ ] T008 Author tasks.md with bounded setup, authoring, and verification work for the hub layer
- [ ] T009 Author checklist.md with Level-2 protocol, source-fidelity checks, non-runtime boundaries, and summary
- [ ] T010 Preserve the required frontmatter fields, exactly four trigger phrases, continuity values, Level-2 markers, and anchor structure in all four files
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Confirm spec.md has the reconstruction banner before section 1 and the exact `Spec Folder` metadata row
- [ ] T012 Confirm the registry summary contains all six modes, their packet kinds, backends, commands, tool surfaces, mutability, and metadata routing
- [ ] T013 Confirm the router summary contains default mode, ambiguity delta, tie-break order, outcomes, default resources, signal groups, vocabulary classes, and the UI build bundle
- [ ] T014 Confirm every required template anchor has one matching close and markdown remains well formed
- [ ] T015 Confirm Sources / Traceability cites the three hub sources plus real child, shared, reference, and asset paths
- [ ] T016 Confirm only spec.md, plan.md, tasks.md, and checklist.md exist in the target packet without running a generator, validator, node/npm command, or git command
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked [x]
- [ ] No [B] blocked tasks remaining
- [ ] Manual source-fidelity and structure verification passed
- [ ] The packet remains explicitly marked as a reconstruction draft
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Specification: See spec.md
- Plan: See plan.md
- Verification Checklist: See checklist.md
<!-- /ANCHOR:cross-refs -->
