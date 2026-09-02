---
title: "Goal: Phase 3: spec-memory-server-removal"
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
    packet_pointer: "system-speckit/049-memory-decommission/003-spec-memory-server-removal"
    last_updated_at: "2026-09-02T20:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Criteria re-baselined against the surface inventory"
    next_safe_action: "Confirm the residue sweep is empty, then delete the tree"
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
# Goal: Phase 3: spec-memory-server-removal

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Delete the system-spec-memory server package, its transport entries in all five runtime configs, the launcher, plugin, bridge, hook, commands, flags and documentation, once nothing external calls it and every preserve-set item has a surviving owner.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Delete rather than deprecate; git holds the history |
| D2 | Deletion order is the server tree, then bins, plugin and hooks, then config roots and env rows, then catalogs and playbooks, with a seam check before each stage |
| D3 | A mixed row in a shared file gets a source-level edit, never a token deletion |
| D4 | The preserve set survives: skill advisor, shared HF model server and socket, shared embeddings and IPC, deep-loop state, historical evidence, generic graph and council infrastructure |
| D5 | Any consumer that needs editing here is a phase 002 gap and is fixed there |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] None of .claude/mcp.json, .codex/config.toml, .cursor/mcp.json, .pi/mcp.json or opencode.json declares a system-spec-memory server
- [ ] A session in every runtime starts with no memory daemon, no launcher lock directory and no orphan process
- [ ] The skill advisor still resolves its embedder over the shared socket after the removal
- [ ] `validate.sh --strict` still runs on an existing packet and exits 0
- [ ] `.env.example` and the env reference carry no flag for the removed subsystem
- [ ] The residue sweep finds no documentation describing the removed tools as available
- [ ] Every preserve-set item is still present and each of the five seams was handled by a source-level edit
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
| Research input | Done | `../006-legacy-memory-surface-inventory/research/lineages/luna-max/research.md` sections 3, 5, 8, 9 and 11 |
| Spec, plan, tasks and acceptance amended | Done | tree census corrected, 41 tools listed, worklist W1 to W4, preserve set, five seams, AC-001 to AC-014; validate --strict 0 errors |
| Build | Pending | - |

### Deviations and findings

| Item | Note |
|------|------|
| Flag count not reproducible | The 373-flag figure matches neither the target-tree scope of 410 nor the external scope of 872; both include shared advisor aliases, so flags are removed by owner, never by count |
<!-- /ANCHOR:log -->
