---
title: "Goal: Phase 5: mcp-transport-removal"
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
    packet_pointer: "system-skill-advisor/025-mcp-decommission-cli-front-door/005-mcp-transport-removal"
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
# Goal: Phase 5: mcp-transport-removal

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Delete the skill advisor's MCP transport and everything that exists only to serve it, and reduce the launcher to a daemon supervisor.

### Decisions

Frozen choices. Changing one is an amendment. The parent directive in
`../goal.md` outranks everything here; name a conflict rather than resolving it.

| ID | Decision |
|----|----------|
| D1 | Delete rather than deprecate. The deletion set is the stdio server, the SDK dependency, the plugin bridge, the MCP JSON-RPC framing and the five runtime declarations |
| D2 | A mixed row in a shared config file gets a source-level edit, never a blind token deletion |
| D3 | Every preserve-set item from phase 001 is checked after the deletion, not assumed to have survived |
| D4 | The launcher keeps daemon supervision, the lease and the model-server responsibility, and loses only its MCP role |
| D5 | A consumer that still needs editing here is a phase 004 gap and is fixed in phase 004 |

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

- [ ] No runtime config root declares a skill advisor MCP server
- [ ] The MCP SDK has no importer left in the advisor package and is gone from its dependency list
- [ ] The stdio server file and the OpenCode plugin bridge are deleted
- [ ] Every runtime starts with no advisor MCP process, no stale lock directory and no orphan child
- [ ] The advisor still resolves its embedder over the shared socket after the removal
- [ ] Every preserve-set item is present and was checked rather than assumed
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
| Deletion blockers identified by the phase 4 sweep | Done | Three test files depend on the plugin bridge and will break when it is deleted: `.opencode/bin/cli-offline-smoke.test.cjs:58` imports it outright, `system-spec-kit/runtime/tests/hook-adapter-path-parity.vitest.ts:141` asserts its path, and `.opencode/plugins/tests/system-skill-advisor.test.cjs:27` names the file. Each must be retired or repointed in the same change that deletes the bridge, not after |
| Retrieval fixture carries a retired id | Noted | `system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json` holds a `mcp__system_skill_advisor__skill_graph` phrase. Data rather than a caller; handed to phase 7 |
| Deregistration | Done | All five runtimes; every other server survived, cursor kept sk-vision. Brief byte-identical with zero advisor declarations anywhere |
| Plugin bridge | Deleted | Three dependent test surfaces retired in the same change; one lost its whole reason to exist and was removed rather than hollowed out |
| Transport strip | BLOCKED, then unblocked by decision | The MCP Server object is the socket's request handler, not only the stdio transport: `advisor-server.ts` passes it to `startIpcSocketServer` as a `createServer` factory, and the shared bridge builds an SDK transport per connection. Deleting it destroys the socket. The executor refused the edit and was right to. Operator chose to extend the shared bridge additively with a non-MCP frame handler, so the advisor can serve its own protocol while existing callers keep the MCP factory |
| Phase planned | Pending | |
| Phase executed | Pending | |
| Acceptance rows closed | Pending | |

### Deviations and findings

| Item | Note |
|------|------|
| | |
<!-- /ANCHOR:log -->
