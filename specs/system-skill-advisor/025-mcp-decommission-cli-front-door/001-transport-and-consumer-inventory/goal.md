---
title: "Goal: Phase 1: transport-and-consumer-inventory"
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
    packet_pointer: "system-skill-advisor/025-mcp-decommission-cli-front-door/001-transport-and-consumer-inventory"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Plan this phase against its completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-025-advisor-mcp-decommission"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: transport-and-consumer-inventory

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Produce the classified inventory of every surface that reaches the skill advisor through MCP, every caller of any advisor capability, every flag and every document that names a retired tool id, with each row assigned to rewire, delete or preserve.

### Decisions

Frozen choices. Changing one is an amendment. The parent directive in
`../goal.md` outranks everything here; name a conflict rather than resolving it.

| ID | Decision |
|----|----------|
| D1 | Research only. Nothing outside this phase's own folder is edited, and no finding is acted on here |
| D2 | Classification is exhaustive. Every row lands in rewire, delete or preserve, and an unclassified row blocks the handoff |
| D3 | The preserve set is written down explicitly and includes the shared HF model server and its socket, the shared IPC socket bridge, the skill graph and its schema, the scorer and its lanes, and every MCP server that is not the advisor |
| D4 | The inventory records behavior, not only files. What happens automatically today, in which runtime, on which trigger, and what the operator sees, so phase 008 can prove the same thing still happens |
| D5 | The Python compatibility shim's reason to exist is answered here, since it exists to cover callers that cannot reach the native MCP path |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the full text
of this file in chat so the operator can update their copy. A child goal change
that alters a parent decision or criterion is an amendment to the parent: apply
it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] Every file importing the MCP SDK inside the advisor package is listed with its owning phase
- [x] Every runtime config root declaring the advisor server is listed with its exact key and env block
- [x] Every caller of an advisor capability is listed with the transport it uses and its owning phase
- [ ] Every document naming a retired tool id is listed and split into live instruction surface and historical evidence
- [x] The preserve set is written down and every item carries a named owner
- [x] The automatic behaviors are recorded as a table of runtime, trigger and observable output
- [x] No row in the inventory is unclassified
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
| Inventory taken and classified | Done | `inventory.md` at freeze `6012ec5c7d`: 5 SDK sites, 5 declarations, 13 executable callers, 4 automatic behaviors, 63 flags, 7 preserve-set items, 0 unclassified |
| Claude automatic chain traced end to end | Done | settings hook to spec-kit runtime shim to the advisor's compiled hook to library import with CLI fallback. No MCP hop anywhere |
| Retired-id document split | Deferred to 007 | 35 files counted, 17 outside the spec corpus and 18 under it. The live-versus-historical call inside the 17 is a documentation judgment, and 007 owns the exemption list |

### Deviations and findings

| Item | Note |
|------|------|
| F1. The Python shim question had a wrong premise | It was framed as a fallback for callers that cannot reach MCP. It is called in production by the OpenCode plugin, the doctor parent-skill check, the deep-loop benchmark probe, two create-skill assets and four modules inside the package, and it never touched the transport. Verdict: preserve unchanged. The parent spec question was amended to record the answer |
| F2. The architecture document misplaces the shim | It documents `compat/skill_advisor.py`; the file is at `mcp-server/scripts/skill_advisor.py`, and `compat/` holds a TypeScript entrypoint instead. Handed to 007 |
| F3. The env blocks outlive the declarations that hold them | The five MCP server blocks also carry the database directory, socket directory, doc-trigger flag and trust default. The trust default grants trust to callers whose MCP metadata omits transport markers, so deleting it without a CLI equivalent fails mutation commands closed. Handed to 005 and added to the parent open questions |
| F4. A cross-package path pins the old directory name | The registered Claude hook is a spec-kit file that hardcodes the advisor's `mcp-server/dist/...` hook path. The 006 rename has to carry a string that lives in a different package. Handed to 006 |
| One criterion deferred rather than closed | The retired-id live-versus-historical split needs documentation judgment about what counts as a live instruction surface, which is phase 007's decision. The counts are recorded so 007 starts from measured numbers |
<!-- /ANCHOR:log -->
