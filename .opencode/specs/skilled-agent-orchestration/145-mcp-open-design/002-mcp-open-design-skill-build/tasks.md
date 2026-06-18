---
title: "Tasks: mcp-open-design skill build"
description: "Task record for the shipped mcp-open-design v1.0.0 build: wiring, the gated ~18-tool surface, and the headless od verbs, modeled on mcp-magicpath. All tasks complete and the deliverable is the skill at .opencode/skills/mcp-open-design/."
trigger_phrases:
  - "mcp-open-design build tasks"
  - "open design skill build tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-mcp-open-design/002-mcp-open-design-skill-build"
    last_updated_at: "2026-06-14T16:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All build tasks complete and shipped in commit 0508518ac9"
    next_safe_action: "Operator reviews the record, then phase 003 de-vendor follows"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:57adbd39b5e4543cbc9b46a64a6a988e2afd16f250d75ce66c783f29f55e3875"
      session_id: "session-150-002-mcp-open-design-skill-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: mcp-open-design skill build

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

- [x] Read the phase 001 research ground-truth: terminal surface, tool tiers, transport
- [x] Read the `mcp-magicpath` package as the structural model
- [x] Fix the surface, gate, and omit policy for every verb class
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] Author SKILL.md: wire, read, and run directions, the ALWAYS/NEVER rules, and version 1.0.0
- [x] [P] Author references/mcp_wiring.md: `od mcp install` wiring, config shape, socket discovery
- [x] [P] Author references/tool_surface.md: the ~18 MCP tools and the surface/gate/omit policy
- [x] [P] Author references/od_cli_reference.md: the headless `od` verbs and transport
- [x] Author the feature catalog and the manual testing playbook across wiring, reading, runs, transport
- [x] Author the README, add changelog/v1.0.0.0.md, write graph-metadata, add the mcp-magicpath reciprocal edge
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] `package_skill.py --check` PASS with no word-count warning
- [x] Confirm every mutating verb is gated and every destructive verb is omitted from the default path
- [x] Voice sweep: no em dashes, no prose semicolons in new prose
- [x] Shipped as commit `0508518ac9`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] The skill wires Open Design into the terminal agent via `od mcp install opencode` / `od mcp install claude`
- [x] The ~18-tool MCP surface is mapped with a surface, gate, and omit policy
- [x] The headless `od` verbs are documented
- [x] The package follows the `mcp-magicpath` structure
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Deliverable skill: `.opencode/skills/mcp-open-design/`
- Changelog: `.opencode/skills/mcp-open-design/changelog/v1.0.0.0.md`
- Commit: `0508518ac9`
- Parent: `../spec.md` (150 phase map)
<!-- /ANCHOR:cross-refs -->
