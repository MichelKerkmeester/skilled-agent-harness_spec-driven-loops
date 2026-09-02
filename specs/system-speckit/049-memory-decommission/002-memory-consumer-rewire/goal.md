---
title: "Goal: Phase 2: memory-consumer-rewire"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-memory-decommission/002-memory-consumer-rewire"
    last_updated_at: "2026-09-02T12:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Inventory the external consumers, then rewire AGENTS.md Gate 1 first"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-049-memory-decommission"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 2: memory-consumer-rewire

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Repoint AGENTS.md Gate 1 and every external consumer of the memory MCP surface at the phase-001 index and ripgrep contract while the old surface still runs.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Rewire before deleting, so a wrong rewire is a wrong answer and not a missing tool |
| D2 | The 260 in-subsystem references are deletions for phase 003, not rewrites here |
| D3 | Nothing is deleted in this phase and the server keeps running |
| D4 | The continuity frontmatter gets a named writer that does not depend on the MCP server |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] `rg mcp__system_spec_memory__` returns no hits outside the mcp-server tree
- [ ] None of the 41 memory tool names appears as a live instruction outside the mcp-server tree
- [ ] AGENTS.md Gate 1 names a mechanism that works with no daemon running
- [ ] The continuity frontmatter writer is named, wired and exercised once without the MCP server
- [ ] No command allowed-tools frontmatter grants a removed tool
- [ ] The residue sweep script is committed and its empty result recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| This phase | Pending | - |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | - |
<!-- /ANCHOR:log -->
