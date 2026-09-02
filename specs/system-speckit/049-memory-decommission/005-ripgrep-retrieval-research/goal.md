---
title: "Goal: Phase 5: ripgrep-retrieval-research"
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
    packet_pointer: "system-speckit/049-memory-decommission/005-ripgrep-retrieval-research"
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
# Goal: Phase 5: ripgrep-retrieval-research

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Research, before any build, how the trigger index and ripgrep conventions must be designed so phases 001 and 004 are specified against evidence rather than assumption.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Five forced iterations on one executor, convergence used as telemetry only |
| D2 | Research only: no consumer, server or spec-doc change outside this phase |
| D3 | Output is a ranked amendment brief for phases 001 and 004, each item citing file and line |
| D4 | The live substring lane is the parity baseline; no stemming, stop-words or semantic claims in v1 |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] Five iteration files exist on disk and the synthesis research.md names its stop reason
- [ ] The synthesis gives a versioned index shape, a lookup contract and a cold-start measurement protocol
- [ ] The synthesis gives runnable ripgrep recipes for structured, path-only and count retrieval with exit mapping
- [ ] The synthesis lists ranked amendments to phase 001 and phase 004 with file and line citations
- [ ] Phase 001 and 004 spec, plan, tasks and acceptance docs cite this research where they changed
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
| Synthesis | Done | `research/lineages/luna-max/research.md`, stop reason maxIterationsReached, ratios 0.92 to 0.68 |
| Fold into 001 and 004 | In Progress | amended docs validate --strict |

### Deviations and findings

| Item | Note |
|------|------|
| Driver verdict was rejected on containment | The sibling research phase ran concurrently and its untracked files were counted as this lineage's breach; all five iterations and the synthesis are intact on disk |
<!-- /ANCHOR:log -->
