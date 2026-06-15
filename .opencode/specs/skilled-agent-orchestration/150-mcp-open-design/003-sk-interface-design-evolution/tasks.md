---
title: "Tasks: sk-interface-design evolution"
description: "Task record for the shipped sk-interface-design v1.1.0 de-vendor: remove the MIT ui-ux-pro-max data, scripts, and notices (data first), keep the Apache base, and wire the live-read-only Open Design integration. All tasks complete and the deliverable is the skill at .opencode/skills/sk-interface-design/."
trigger_phrases:
  - "sk-interface-design de-vendor tasks"
  - "ui-ux-pro-max removal tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/150-mcp-open-design/003-sk-interface-design-evolution"
    last_updated_at: "2026-06-14T16:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All de-vendor tasks complete and shipped in commit b12ffd3d76"
    next_safe_action: "Operator reviews the record, then phase 004 validation follows"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:c478e5ce0339e9b7ffc0971999f439d7aafa7910c18bc90932df4a0ff6c28c7a"
      session_id: "session-150-003-sk-interface-design-evolution"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: sk-interface-design evolution

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete · `[ ]` pending
- `[P]` parallelizable
- Evidence in parentheses where applicable.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] Confirm the de-vendor sequence: data first, MIT notices second
- [x] Confirm the Apache base must be kept (design_principles.md is verbatim Apache content)
- [x] Confirm `mcp-open-design` is available to ground live reads against
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] Delete the nine MIT CSVs, the data README, and the `design_search` scripts (data first)
- [x] Delete `LICENSE-ui-ux-pro-max.txt` and `THIRD-PARTY-NOTICES.md` after the data
- [x] [P] Reframe references/claude_design_parity.md to live Open Design reads, never cached
- [x] [P] Reframe references/design_inventory.md around live Open Design systems
- [x] Update SKILL.md to Apache-2.0 only and version 1.1.0, then reframe the feature catalog and playbook
- [x] Add changelog/v1.1.0.0.md and update graph-metadata.json
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] `package_skill.py --check` PASS
- [x] Grep sweep: no MIT-derived data, script, or notice residue remains
- [x] Voice sweep: no em dashes, no prose semicolons in new prose
- [x] Shipped as commit `b12ffd3d76`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] The MIT-derived data, scripts, and notices are removed, and the skill is Apache-2.0 only
- [x] The MIT notices were removed after the data (legally safe order)
- [x] The Apache base (LICENSE.txt, design_principles.md) is kept
- [x] The Open Design integration reads live via `mcp-open-design` and caches nothing
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Deliverable skill: `.opencode/skills/sk-interface-design/`
- Changelog: `.opencode/skills/sk-interface-design/changelog/v1.1.0.0.md`
- Integration seam: `.opencode/skills/sk-interface-design/references/claude_design_parity.md`
- Commit: `b12ffd3d76`
- Parent: `../spec.md` (150 phase map)
<!-- /ANCHOR:cross-refs -->
