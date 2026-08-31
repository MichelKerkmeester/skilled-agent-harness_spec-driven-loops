---
title: "Implementation Summary: Orchestrator Inline Authority"
description: "Bounded write capability for the orchestrator, and a caller gate that no longer refuses the operator who invoked it."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/008-orchestrator-inline-authority"
    last_updated_at: "2026-08-31T06:37:55Z"
    last_updated_by: "claude-code"
    recent_action: "Granted bounded inline authority and opened the caller gate to operators"
    next_safe_action: "Decide whether the phantom agent name in prompt-improver is worth a follow-up"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-orchestrator-inline-authority"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

**Status:** Complete

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-orchestrator-inline-authority |
| **Completed** | 2026-08-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The orchestrator can now write, in all four runtime dialects, each saying the same thing in its own syntax: a tool list in `.claude/agents/orchestrate.md`, a permission block in `.opencode/agents/orchestrate.md`, `sandbox_mode` in `.codex/agents/orchestrate.toml`, and a tool array in `.pi/agents/orchestrate.md`. The prose that previously forbade direct execution now permits a small inline fix where dispatching would cost a fresh agent reloading context the orchestrator already holds, and keeps everything with design content, real breadth, or its own verification burden delegated.

The caller gate in `.claude/agents/code.md` — and its three siblings under `.opencode/`, `.codex/` and `.pi/` — now treats a direct operator invocation as satisfying it. The gate was built to stop an agent dispatching without an orchestrator's brief; an operator asking directly is not that failure, and refusing them inverted the repository's own precedence. A direct invocation must state the packet and frozen scope in its return, so the missing brief stays visible.

Two smaller corrections: the dispatch protocol named a subagent type this runtime does not register, and the nesting examples referenced an agent absent from the roster.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

[How was this tested, verified and shipped? What was the rollout approach?]
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Bound the grant in prose rather than withholding the tools.** An independent review argued against granting write at all, on the grounds that the orchestrator becomes author and reviewer of its own work. That risk is real, but it was weighed against a cost the review did not price: a fresh agent reloading context to change one line. The delegation rule already calls that a restraint failure. Tools plus a stated threshold keeps both.
- **Renamed the phantom agent instead of deleting its references.** The recommendation was to delete them; reading them showed they are illustrative placeholders in the nesting examples, and deletion would have removed working examples to fix a name.
- **Left the roster checker alone.** Its presence-only semantics is a real gap and it belongs to whoever owns that checker, not to this ask.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Each edit was checked for symmetry across the eight authored files: the orchestrate-only changes appear in exactly the four orchestrate copies and none of the code copies, and the gate amendment exactly the reverse. That pattern is the evidence, because the roster checker states in its own comment that it verifies presence and never content equality — it would have stayed green on a change that reached one runtime and missed three.

No obsolete subagent type and no phantom agent reference survives in any orchestrate copy. Roster mirror check reports STATUS=OK across five runtimes, which confirms nothing was lost but cannot confirm what was changed.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The boundary on the orchestrator's new capability is prose, not a permission. A missing tool refuses; a sentence persuades. If the orchestrator drifts into being the implementer, this is where it will show, and the fix would be to withdraw the tools rather than to write a firmer sentence.

The same phantom agent name survives in the prompt-improver definition — four occurrences across its copies. Real, adjacent, and deliberately left for its own change.

The roster checker still cannot detect content drift between runtime copies. Everything here depended on catching that by hand.
<!-- /ANCHOR:limitations -->

---


