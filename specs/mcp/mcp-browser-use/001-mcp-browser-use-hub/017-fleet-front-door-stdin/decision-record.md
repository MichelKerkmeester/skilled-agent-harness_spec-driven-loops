---
title: "Decision Record: Phase 17: fleet-front-door-stdin"
description: "Why every hub passes the task to the compiled front door on stdin through a quoted heredoc."
trigger_phrases:
  - "fleet front door stdin decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/017-fleet-front-door-stdin"
    last_updated_at: "2026-11-24T12:00:00Z"
    last_updated_by: "claude"
    recent_action: "Recorded ADR-001 and Q011"
    next_safe_action: "Triage the generation-4 P2 findings in phase 018"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-017-fleet-front-door-stdin"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 17: fleet-front-door-stdin

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Every hub passes the task on stdin through a quoted heredoc

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-24 |
| **Deciders** | Operator (Q011), Claude |

---

<!-- ANCHOR:adr-001-context -->
### Context

The hubs told agents to run `compiled-route.cjs --hub <hub> --prompt "<task>"`. An agent filling that slot with a user's task gives the shell any quote, `$()` or backtick in it. 016 moved one hub to stdin and left the rest for the operator.

### Constraints

- `compiled-route.cjs` already reads `--prompt-stdin`.
- New hubs come from the sk-doc template and `init_skill.py`, so those change too.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: `--prompt-stdin <<'TASK'`, the task on the next lines, then `TASK`, on every live surface.

**How it works**: the quoted delimiter stops the shell from expanding anything in the body, which it passes unchanged on stdin.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Quoted heredoc on stdin** | Nothing expands; multi-line tasks pass whole | A line reading exactly `TASK` ends it early | 8/10 |
| Single quotes around `--prompt` | One line | A task holding `'` still breaks out | 4/10 |
| Leave the other hubs as they were | No change | Seven hubs keep the injection path | 2/10 |

**Why this one**: it closes the path on every hub with a flag that already existed.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- No hub hands a task to the shell for expansion.

**What it costs**:
- Seven activation manifests re-minted. Mitigation: guard 8 fresh, canaries green.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A task line equal to `TASK` | L | Noted in the summary; rare in real prompts |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The generation-4 review confirmed the injection path |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared above |
| 3 | **Sufficient?** | PASS | One instruction per surface, no code change in the front door |
| 4 | **Fits Goal?** | PASS | The operator chose the fleet-wide switch |
| 5 | **Open Horizons?** | PASS | New hubs inherit it from the scaffold |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- 32 instruction lines, seven manifests and their archive copies.

**How to roll back**: revert the phase commit, then re-mint each hub's activation manifest and copy it to its archive path.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q011 | Move the whole fleet to `--prompt-stdin`, then fix and build every other open item: the 24 P2 findings, the advisor lexical-anchor packet and the sk-doc drift. Layout: phases 017 and 018 here, the advisor in its packet 014, the drift folded into 017. | Not stated. | 016 D2 | spec.md scope, ADR-001, 018 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q011
<!-- source: claude:f7099de4-e8ec-43e6-a849-849dabb1c94c:fleet-stdin-017:0 -->

Question (condensed from the text asked):
```text
Should I move the whole fleet to `--prompt-stdin`? Then, which open item should come next?
Then, where should each of the four items be documented?
```

Options:
```text
Fleet-wide switch (Recommended) | Leave the fleet as is | Revert to the pinned wording
Stop here | Triage the 24 P2s | Build advisor 014 | Fix sk-doc drift
Use proposed layout (Recommended) | Fleet switch under sk-doc | One new phase for all
```

Answer:
```text
Fleet-wide switch (Recommended)
fix build all
Use proposed layout (Recommended)
```
<!-- /ANCHOR:operator-answers-verbatim -->
