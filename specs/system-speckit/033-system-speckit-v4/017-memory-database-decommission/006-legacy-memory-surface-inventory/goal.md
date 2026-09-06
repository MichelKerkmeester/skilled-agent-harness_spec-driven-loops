---
title: "Goal: Phase 6: legacy-memory-surface-inventory"
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
    packet_pointer: "system-speckit/033-system-speckit-v4/017-memory-database-decommission/006-legacy-memory-surface-inventory"
    last_updated_at: "2026-09-02T18:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Research run complete; folding findings into the build phases"
    next_safe_action: "Verify the amended build-phase docs cite this research"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-049-memory-decommission"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Goal: Phase 6: legacy-memory-surface-inventory

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Inventory, before any rewire or deletion, every surface that references or integrates the system-spec-memory subsystem, classified so phases 002 and 003 miss nothing and break nothing that still speaks the old contract.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Five forced iterations on one executor, convergence used as telemetry only |
| D2 | Research only: nothing outside this phase is modified and the memory MCP is never called |
| D3 | The row-level artifact inventory.external.json is authoritative; the synthesis tables are summaries |
| D4 | The mcp-server tree is one aggregate entry; z_archive is excluded; lifecycle is classified by path structure |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] Five iteration files exist on disk and the synthesis research.md names its stop reason
- [ ] Every inventory row carries path, line, surface type, reference kind, lifecycle, owning phase and action
- [ ] The synthesis reports counts per surface type, reference kind and owning phase
- [ ] The synthesis names every seam that still speaks the old contract and the preserve set that must survive deletion
- [ ] Phase 002 and 003 spec, plan, tasks and acceptance docs carry the worklists and the preserve set
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
| Five iterations | Done | `research/lineages/luna-max/iterations/iteration-001.md` to `iteration-005.md` |
| Synthesis | Done | `research/lineages/luna-max/research.md`, 18,799 paths and 92,554 hit lines classified |
| Row-level inventory | Done | `research/lineages/luna-max/inventory.external.json`, 69 MB, kept out of git |
| Fold into 002 and 003 | In Progress | amended docs validate --strict |

### Deviations and findings

| Item | Note |
|------|------|
| Driver verdict was rejected on containment | The sibling research phase ran concurrently and its untracked files were counted as this lineage's breach; all five iterations and the synthesis are intact on disk |
<!-- /ANCHOR:log -->
