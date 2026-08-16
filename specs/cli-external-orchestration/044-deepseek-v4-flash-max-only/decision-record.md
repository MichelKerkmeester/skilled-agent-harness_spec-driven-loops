---
title: "Decision Record: DeepSeek V4 Flash max-thinking pin"
description: "Why Flash Max is an effort pin (not a model removal or a fabricated id), and how it maps onto four uneven CLI surfaces."
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/044-deepseek-v4-flash-max-only"
    last_updated_at: "2026-08-16T17:34:05Z"
    last_updated_by: "implementer"
    recent_action: "Recorded corrected decisions after live capability verification"
    next_safe_action: "None; reference during implementation"
    blockers: []
    completion_pct: 100
---
# Decision Record: DeepSeek V4 Flash max-thinking pin

<!-- SPECKIT_LEVEL: 2 -->

---

## ADR-001 — "Flash Max" is an effort/thinking level, not a model id

**Context.** The operator asked that DeepSeek V4 Flash only ever run at "max" — never "flash high" or "non thinking" — and to "remove those lower effort levels." An initial reading treated "Flash Max" as a distinct model id and removed the Flash model on pi/opencode. Live verification corrected that:
- `~/.pi/agent/models-store.json`, `opencode models deepseek`, and `opencode models opencode-go` all report DeepSeek V4 Flash as `reasoning: true` with a `max` entry in `thinkingLevelMap`.
- No `deepseek-v4-flash-max` **id** exists on the DeepSeek direct API or the opencode-go gateway (count 0). The `-max` id exists only on cli-devin, which bakes the thinking tier into the uid.

**Decision.** "Flash Max" = `deepseek-v4-flash` dispatched at the **max thinking level**. Keep the Flash model; pin its effort to `max` in the fan-out command builders (pi `--thinking max`, opencode `--variant max`). The earlier removal was reverted.

**Consequence.** The catalogs that called Flash "non-reasoning" were factually wrong and were corrected.

---

## ADR-002 — Force to max (operator choice)

**Context.** When a fan-out lineage requests Flash at a lower effort (high/low/off) or none, the pin must decide what to do.

**Decision.** **Force to max** (operator selected): any Flash dispatch is upgraded to max thinking, and the recorded `reasoningEffort` reflects the pinned value. This never fails a dispatch and guarantees "Flash always runs at max." The alternative (reject below max) was declined.

**Consequence.** A caller that names Flash at `high` silently runs at `max`; the receipt shows `max`, so the behavior is observable, not hidden.

---

## ADR-003 — Do not fabricate a `-max` id; do not touch cursor or raw dispatch

**Context.** Adding `deepseek-v4-flash-max` to the pi/opencode allowlists/rosters would create an id the providers do not serve. cli-cursor has no DeepSeek. The pin lives in the fan-out builders.

**Decision.** No fabricated id. cli-cursor untouched. cli-devin already max-only (uid-baked); it gets only a policy note. Raw `pi`/`opencode` binary invocations (outside the fan-out) are not gated — documented as a boundary, not worked around.

**Why.** The allowlists carry a "read from live, never fabricated" contract; the fan-out builders are the single command-construction point where the pin belongs.
