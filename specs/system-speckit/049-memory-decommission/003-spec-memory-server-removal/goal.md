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
    last_updated_at: "2026-09-02T12:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Confirm the phase-002 residue sweep is empty, then delete the tree"
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

**Objective:** Delete the system-spec-memory server package, its transport entries, plugin, bridge, hook, commands, flags and documentation, once nothing external calls it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Delete rather than deprecate; git holds the history |
| D2 | Deletion only: a consumer that needs editing here is a phase-002 gap and is fixed there |
| D3 | system_skill_advisor code is untouched; only its shared hf-embed socket assumption is checked |
| D4 | scripts/spec validation and scaffolding survive; historical packets 026, 027 and 028 remain |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] No MCP client config in any runtime declares a system-spec-memory server
- [ ] A session starts with no memory daemon, no launcher lock directory and no orphan process
- [ ] system_skill_advisor still resolves its embedder after the removal
- [ ] `validate.sh --strict` still runs on an existing packet and exits 0
- [ ] `.env.example` and the env reference carry no flag for the removed subsystem
- [ ] `rg system-spec-memory` finds no documentation describing the removed tools as available
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
