---
title: "Goal: Phase 1: trigger-index-replacement"
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
    packet_pointer: "system-speckit/049-memory-decommission/001-trigger-index-replacement"
    last_updated_at: "2026-09-02T12:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Build the generator and the parity harness"
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
# Goal: Phase 1: trigger-index-replacement

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Build a generated trigger index and a written ripgrep contract, proven at parity against the live substring lane before anything is removed.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The index is a JSON artifact committed to the repository, not gitignored and not built on clone |
| D2 | Free-text retrieval is ripgrep with no index at all |
| D3 | This phase adds files only: no consumer is repointed and nothing is deleted, so both mechanisms stay live for comparison |
| D4 | No embedding or semantic path is rebuilt |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] The parity harness reports `missing: 0` against the frozen prompt set and its baseline is committed
- [ ] A second generator run leaves the index byte-identical under `git diff --exit-code`
- [ ] The generator completes with exit 0 with the MCP server stopped and no network
- [ ] The retrieval conventions doc gives a runnable ripgrep invocation for memory_search, memory_context and memory_quick_search
- [ ] A malformed trigger_phrases block is reported by path, not skipped
- [ ] Gate 1 returns trigger matches in a session with the daemon stopped
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
