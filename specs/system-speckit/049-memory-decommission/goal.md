---
title: "Goal: Memory DB Decommission"
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
    packet_pointer: "system-speckit/049-memory-decommission"
    last_updated_at: "2026-09-02T12:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive and its phase binding"
    next_safe_action: "Execute 001-trigger-index-replacement against its goal"
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
# Goal: Memory DB Decommission

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Remove the system-spec-memory MCP subsystem outright and carry its load with a committed trigger index plus ripgrep over a corpus shaped to be grepped.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Delete the subsystem, do not shrink or deprecate it in place |
| D2 | Scope is system-spec-memory only; system_skill_advisor and council-graph.sqlite are untouched |
| D3 | The replacement is a generated, committed trigger index plus ripgrep; no embedding path is rebuilt |
| D4 | Order is load-bearing: build the replacement, rewire every consumer, then delete, then retrofit |
| D5 | The doc convention is retrofitted across all active spec docs; z_archive is excluded and bodies stay untouched |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-trigger-index-replacement | `001-trigger-index-replacement/goal.md` |
| 002-memory-consumer-rewire | `002-memory-consumer-rewire/goal.md` |
| 003-spec-memory-server-removal | `003-spec-memory-server-removal/goal.md` |
| 004-grep-convention-doc-retrofit | `004-grep-convention-doc-retrofit/goal.md` |
| 005-ripgrep-retrieval-research | `005-ripgrep-retrieval-research/goal.md` |
| 006-legacy-memory-surface-inventory | `006-legacy-memory-surface-inventory/goal.md` |

**Precedence.** Decisions above outrank child detail; child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] `validate.sh --strict` recursive over this packet exits 0
- [ ] Every phase reports its acceptance criteria closeable
- [ ] No MCP client config in any runtime declares a system-spec-memory server
- [ ] `rg mcp__system_spec_memory__` over the repository returns no hits
- [ ] A session starts with no memory daemon and Gate 1 still returns trigger matches
- [ ] The trigger index regenerates byte-identical on a second run
- [ ] The grep convention is enforced by validate.sh and the retrofit rescan reports no residue
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
| 005 ripgrep retrieval research | Done | five iterations and synthesis under `005-ripgrep-retrieval-research/research/lineages/luna-max/` |
| 006 legacy memory surface inventory | Done | five iterations, synthesis and row-level inventory under `006-legacy-memory-surface-inventory/research/lineages/luna-max/` |
| Research folded into phases 001 to 004 | Done | amended spec, plan, tasks and acceptance docs validate `--recursive --strict` with 0 errors |
| 001 to 004 build | Pending | - |

### Deviations and findings

| Item | Note |
|------|------|
| Two research phases added after the packet was planned | The operator asked for evidence before the build; the research runs are phases 005 and 006 and feed the build phases rather than following them |
| Both research drivers reported rejected | Sibling-phase containment false positive while the two lineages ran concurrently; all artifacts intact, recorded in system-deep-loop packet 040 |
<!-- /ANCHOR:log -->
