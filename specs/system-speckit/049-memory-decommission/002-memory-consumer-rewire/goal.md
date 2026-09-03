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
    last_updated_at: "2026-09-02T20:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Criteria re-baselined against the surface inventory"
    next_safe_action: "Start phase 003 after the package decision"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-049-memory-decommission"
      parent_session_id: null
    completion_pct: 100
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

**Objective:** Repoint AGENTS.md Gate 1 and every external consumer of the memory MCP surface at the phase 001 index and ripgrep contract while the old surface still runs, and split every shared seam so the skill advisor keeps working.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Rewire before deleting, so a wrong rewire is a wrong answer and not a missing tool |
| D2 | Order is live consumers first, then shared seams, then the residue sweep |
| D3 | The continuity frontmatter gets a standalone packet-local writer that keeps atomic same-directory update and lock semantics |
| D4 | Semantic paraphrase, vector and BM25 fusion, decay, access tracking, session dedup and causal traversal are declared as honest lexical-only loss, not silently dropped |
| D5 | The preserve set is out of scope: advisor registration and database, the shared HF model server and hf-embed socket, shared embedding adapters and IPC, deep-loop locks and projections, historical evidence |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] The residue sweep with `rg --json --ignore-case --no-ignore-global` returns no hit outside the mcp-server tree, excluding .git, node_modules and z_archive
- [ ] No allowed-tools frontmatter in any runtime agent or command directory grants a removed tool
- [ ] AGENTS.md Gate 1 names a mechanism that works with no daemon running
- [ ] The continuity writer is named, wired and exercised once with the MCP server stopped
- [ ] The skill advisor still resolves its embedder after the shared embedding, HF and IPC branches are split
- [ ] Each of the five break-risk seams has a named replacement or an explicit retain decision
- [ ] The roughly 167 logical consumers are reconciled owner by owner against the row inventory and the reconciliation is recorded
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
| Research input | Done | `../006-legacy-memory-surface-inventory/research/lineages/luna-max/research.md` sections 6, 7, 9 and 11 |
| Spec, plan, tasks and acceptance amended | Done | worklist W1 to W6, preserve set, seams S-001 to S-005, REQ-007 to REQ-014, AC-001 to AC-012; validate --strict 0 errors |
| Rewire | Done | 588 consumer files reconciled, residue sweep live 0, AC-001 to AC-012 Met |
| Verification | Done | targeted suites green, whole suites recorded in implementation-summary.md |

### Deviations and findings

| Item | Note |
|------|------|
| MCP package fate is a logic-sync decision | Validation, metadata refresh and the continuity writer run from modules inside the package; delete the engine and keep the package is the recommended amendment, recorded in the parent |
| Consumer count corrected | The 167 figure is a logical-owner estimate; the row inventory holds 9,016 live paths with a rewire row, and both must be reconciled rather than one replacing the other |
<!-- /ANCHOR:log -->
