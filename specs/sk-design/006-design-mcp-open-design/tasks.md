---
title: "Tasks: Reconstruct the sk-design Open Design transport mode"
description: "Bounded task breakdown for rebuilding the missing Open Design transport packet from its intact source, references, scripts, server pointer, registry entry, and Level-2 document structure."
trigger_phrases:
  - "Open Design transport reconstruction tasks"
  - "od CLI MCP task breakdown"
  - "design-mcp-open-design source tasks"
  - "guarded Open Design verification tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/006-design-mcp-open-design"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Captured reconstruction task boundaries"
    next_safe_action: "Run manual structure checks"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-mcp-open-design/SKILL.md"
      - ".opencode/skills/sk-design/design-mcp-open-design/references/"
      - ".opencode/skills/sk-design/design-mcp-open-design/scripts/"
      - ".opencode/skills/sk-design/design-mcp-open-design/mcp-servers/"
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/specs/sk-design/006-design-mcp-open-design/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-open-design-reconstruction-20260716"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Reconstruct the sk-design Open Design transport mode
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

- [ ] T001 Read the complete design-mcp-open-design SKILL.md and capture its transport contract
- [ ] T002 [P] Read every reference file under .opencode/skills/sk-design/design-mcp-open-design/references/
- [ ] T003 [P] Read every script and the Open Design server pointer under the source folder
- [ ] T004 Read mode-registry.json, the four Level-2 templates, and the validated Level-2 reference packet
- [ ] T005 Record WIRE/READ/RUN routing, daemon discovery, Code Mode wiring, surface classes, mandatory pairing, and multi-turn run states
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Author spec.md with source-faithful identity, scope, requirements, gates, edge cases, uncertainties, and traceability
- [ ] T007 Author plan.md with source-first architecture, affected surfaces, phases, testing, dependencies, and rollback
- [ ] T008 Author tasks.md with bounded setup, authoring, and manual verification work
- [ ] T009 Author checklist.md with Level-2 protocol, source checks, safety boundaries, and file organization
- [ ] T010 Preserve the required frontmatter fields, exactly four trigger phrases, compact continuity, markers, anchors, and metadata tables in all four files
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Confirm spec.md has the exact reconstruction banner before section 1 and the exact Spec Folder metadata row
- [ ] T012 Confirm every file has exactly four trigger phrases and the required continuity fields with compact action phrases
- [ ] T013 Confirm every Level-2 template anchor has one matching close and markdown tables remain well formed
- [ ] T014 Confirm source traceability covers the mode registry, SKILL.md, all nine references, three scripts, and the server pointer
- [ ] T015 Confirm the packet records unknown-as-guarded, target and rollback gates, live tools/list verification, and the multi-turn zero-file first turn
- [ ] T016 Confirm only the four requested files exist and no description.json, graph-metadata.json, generator, validator, Node/npm, or git command was used
- [ ] T017 Record line counts for the four authored files
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual source-fidelity and structure inspection passed
- [ ] The packet remains explicitly marked as a reconstruction draft
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
