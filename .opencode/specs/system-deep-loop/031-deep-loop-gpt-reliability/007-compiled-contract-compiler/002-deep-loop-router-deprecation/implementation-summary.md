---
title: "Implementation Summary: Deep-Loop Router Agent Deprecation"
description: "Phase 002 of the compiled-contract-compiler track (007) — deleted the dead deep-loop primary router agent (3 mirrors) and reworded the orchestrate boundary lines that named it; parity + mirror-sync + reference sweep green."
trigger_phrases:
  - "036 phase 002 summary"
  - "deep-loop router deprecation summary"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-deep-loop-gpt-reliability/007-compiled-contract-compiler/002-deep-loop-router-deprecation"
    last_updated_at: "2026-07-04T12:55:17Z"
    last_updated_by: "claude-code"
    recent_action: "Router deleted, orchestrate reworded, verified"
    next_safe_action: "None -- phase complete"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "036-002-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Deep-Loop Router Agent Deprecation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Complete |
| **Completed** | 2026-07-04 |
| **Parent Packet** | ../ (036-command-contract-compiler) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Retired the `deep-loop` primary router agent. Removed:

- `.opencode/agents/deep-loop.md` (tracked, `git rm`)
- `.claude/agents/deep-loop.md` (tracked, `git rm` — same commit for mirror-sync parity)
- `.codex/agents/deep-loop.md` (untracked local runtime mirror, `rm`)

Reworded, in all three `orchestrate.md` mirrors (`.opencode`, `.claude`, `.codex`):

- Deleted the `ILLEGAL: Orch(0) → @deep-loop(1)` example from the illegal-chains block (the three generic examples remain).
- Rewrote the `@deep-loop is never a Task-dispatch target` paragraph into a positive, agent-agnostic rule: *resolve the `/deep:*` leaf directly from the priority table and dispatch it at depth 1; do not route through any intermediary primary agent.* No routing capability is lost — that rule already lives in the priority table and the registry-backed `Deep Route` resolution rule.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A read-only dependency investigation mapped the router's surface before any deletion, confirming it vestigial. The two tracked mirrors were deleted in one commit to satisfy the agent-mirror-sync gate; the `.codex` mirror (untracked, maintained on disk by a local sync hook) was removed for runtime parity.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Full delete over tombstone.** The router is off every live path and git-recoverable; a tombstone would keep a dead agent auto-discoverable as a `mode: primary` entrypoint.
- **Preserve the positive orchestrate rule.** The prohibition lines existed to stop routing through the router; generalizing them to a no-intermediary guardrail keeps the guidance and prevents re-introducing the anti-pattern without naming a deleted agent.
- **`.codex` handled on disk only.** It is untracked (git-invisible, hook-synced from `.opencode`), so it is not part of the commit.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|---|---|
| Live-dispatch sweep before deletion (`@deep-loop`, `subagent_type`/`agentType`, `Task(...deep-loop)`) | Only the two orchestrate prohibition lines matched — no live dispatcher |
| `.opencode`↔`.claude` basename-parity diff | Identical agent sets; `deep-loop.md` absent from both |
| `check-agent-mirror-sync.cjs` on changed paths | `2 agent(s) checked — all mirrors in sync — OK`, exit 0 |
| Post-change reference sweep | Router fully dereferenced outside historical spec artifacts |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Historical spec artifacts still name the router** (packets `029`, `037`, and this packet's own docs) — these are point-in-time records, intentionally left unedited.
2. **The 14-agent pointer rewrite and AGENTS.md thinning are out of scope** — tracked as a separate follow-up; neither documents the router as a routing mechanism, so nothing there is stale as a result of this deletion.
<!-- /ANCHOR:limitations -->
