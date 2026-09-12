---
title: "Decision Record: The DevPass DeepSeek route moves to V4.1 Flash"
description: "Why the two sibling DeepSeek routes the first pass excluded were reopened, and why one of them could only be recorded as listing-only."
trigger_phrases:
  - "sibling route reopen decision"
  - "cline-pass listing-only rationale"
  - "scope reversal adr"
  - "opencode-go v4.1 swap"
  - "deepseek route repoint decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash"
    last_updated_at: "2026-09-11T10:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Recorded the scope reversal that reopened the sibling routes"
    next_safe_action: "Reference during the deferred live gates"
    blockers: []
    completion_pct: 100
---
# Decision Record: The DevPass DeepSeek route moves to V4.1 Flash

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001 — Reopen the sibling DeepSeek routes, and record one of them as listing-only

<!-- ANCHOR:adr-001-context -->
**Context.** The first pass was scoped by the operator to the LLM Gateway ("Only llm gateway tho"), and it
excluded the `opencode-go` and `cline-pass` DeepSeek routes on a recorded basis: they were different routes
that still resolved. On 2026-09-11 the operator reversed that scope, asking for the same V4.1 Flash
replacement on `opencode-go/deepseek-v4-flash-vision-exp` and
`cline-pass/cline-pass/deepseek-v4-flash`, on the stated premise that "cline and opencode go both support
it already."

Probing split that premise in half.

- **`opencode-go` supports it.** The catalog carries `deepseek-v4.1-flash`, a live `opencode run` turn
  returned a reply, and the catalog record matches the id it replaces on every axis that matters: $0.15 in
  and $0.60 out per million tokens with $0.003 cached reads, 1M context, 384K output, image input, and the
  same `low`/`high`/`max` effort variants.
- **`cline-pass` does not, on the evidence available.** Cline's own API lists
  `deepseek/deepseek-v4.1-flash`, but opencode resolves provider models from models.dev, which carries no
  cline-pass V4.1 entry — so the id fails at resolution before any request is sent. On top of that the
  account's monthly quota answers `429 "You have reached your monthly Clinepass limit"` for every Cline
  model, which blocks the live gate on both the new id and the older one.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
**Decision.** Reopen the packet and take both routes in, but not on the same footing.

- The `opencode-go` route moves completely, including the cli-opencode mode default, and is
  **dispatch-verified**.
- The `cline-pass` route moves in the rosters and in the Pi config, and is recorded as **listing-only**:
  no dispatch claim, the `429` blocker named in the row, and
  `cline-pass/cline-pass/deepseek-v4-flash` — still offered upstream and live-verified on 2026-08-18 —
  retained as the fallback. Its live gate is deferred to the operator after the quota window resets.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
**Alternatives declined.**

- **Wiring `cline-pass` as verified.** It would advertise a route that fails on first dispatch. That is the
  exact class of defect this packet exists to remove, so repeating it to satisfy a premise would invert the
  point of the work.
- **Leaving `cline-pass` untouched.** It would leave a row naming an id the operator has asked to move, and
  would hide both the models.dev gap and the quota block.
- **Holding the whole change until the quota resets.** It would delay a verified, zero-risk `opencode-go`
  swap for a route that is independent of it.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
**Consequence.** AC-013 ("the sibling routes are untouched") is superseded: it was true of the first pass and
is false of the current state. The packet reopens as In Progress and stays open until the two deferred live
gates pass — the pi-side turn on the new id, and the post-quota `cline-pass` turn.
<!-- /ANCHOR:adr-001-consequences -->
<!-- /ANCHOR:adr-001 -->

---
