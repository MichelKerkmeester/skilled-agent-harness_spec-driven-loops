---
title: "Decision Record: Phase 3: nudge-parity-and-hop-scoring"
description: "Why the nudge claim moved from the Vibe adapter into the shared nudge module, so Claude Code and Codex deliver one nudge when two hooks race."
trigger_phrases:
  - "nudge parity decision record"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/002-session-handover-loop/048-cross-runtime-handover-parity-fixes/003-nudge-parity-and-hop-scoring"
    last_updated_at: "2026-11-15T21:40:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialized decision record template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-nudge-parity-and-hop-scoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 3: nudge-parity-and-hop-scoring

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Move the nudge claim into the shared nudge module

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-15 |
| **Deciders** | Operator, orchestrator |

---

<!-- ANCHOR:adr-001-context -->
### Context

Phase 047's ADR-001 kept the nudge claim inside the Vibe adapter, on the reading that only Vibe runs hooks side by side. Session logs show the same race on two other runtimes. A Claude Code transcript from 2026-10-22 carries the same nudge on two tool calls 16 ms apart, and one from 2026-11-14 carries it on a tool hook and a prompt hook 115 ms apart. A Codex rollout from 2026-11-15 carries two identical developer nudges 12 ms apart after two completed items. Of 391 Claude nudge deliveries scanned, 5 pairs on distinct tools fell within one second.

### Constraints

- The operator asked for the findings fixed on every runtime they reach.
- The existing Vibe claim tests must pass unedited.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: one `commitNudge` in `lib/nudge.cjs` that claims the session's nudge with a claim file, decides again under the claim and writes the level. The Claude, Codex and Vibe nudge paths call it, and the Vibe adapter's own copy is gone.

**How it works**: a hook creates `nudge-<session>.claim` with an exclusive open. A hook that finds the claim held stays quiet. The holder decides again, because a hook that delivered first has already written its level, and releases the claim when done. A claim older than 10 seconds was left by a hook that died and is taken over. This supersedes the nudge half of 047's ADR-001. The killer's folder branch from that ADR stays as it was.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared claim in `nudge.cjs`** | One mechanism, one set of tests, every racing runtime covered | Touches the Claude and Codex nudge paths | 8/10 |
| A copy of the Vibe claim in each adapter | No shared change | Three copies to keep in step | 4/10 |
| Leave Claude and Codex as they are | No change | The duplicate nudge stays on the two runtimes with the most use | 2/10 |

**Why this one**: the race is in the shared decide-then-write sequence, so the fix belongs where that sequence lives.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Two racing hooks on Claude Code, Codex or Vibe deliver one nudge.
- The handover suite passes 1037 of 1037, with the Vibe claim tests unedited.

**What it costs**:
- Two hooks that both find a claim left by a dead hook can both deliver. Mitigation: the cost is one repeated nudge, as before on Vibe.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A claim file that cannot be removed silences the nudge | L | A claim older than 10 seconds is taken over, and a missing state directory skips the claim |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Duplicate nudges found in Claude and Codex session logs |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared above |
| 3 | **Sufficient?** | PASS | One function and three call sites |
| 4 | **Fits Goal?** | PASS | The session handover loop goal is reliable hand-over on every runtime |
| 5 | **Open Horizons?** | PASS | A new runtime adapter calls the same function |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `lib/nudge.cjs`: `claimNudge` and the exported `commitNudge`.
- `claude/context-nudge.mjs`, `codex/shared.mjs` and `vibe/handover-parts.mjs`: deliver through `commitNudge`.

**How to roll back**: `git revert` the phase's feature commit. No state file format changes, and a leftover claim file is ignored after 10 seconds.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
