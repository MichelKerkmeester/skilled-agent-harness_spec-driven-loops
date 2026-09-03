---
title: "Implementation Summary: Runtime Agent Gateway Alignment"
description: "Migrated the four deep-loop leaf agent prompts across all six runtimes from a direct *-state.jsonl append to the append gateway; the gateway --event-json contract (one record, not the multi-line delta) was corrected during verification."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-runtime-agent-gateway-alignment"
    last_updated_at: "2026-08-25T07:26:58Z"
    last_updated_by: "claude"
    recent_action: "Migrated all 24 leaf-agent copies to the append gateway; guard 24/24 green"
    next_safe_action: "Hold for the operator's commit/push instruction"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
      - "scripts/check-agent-gateway.sh"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does the leaf call the gateway or write state directly? Calls the gateway."
      - "What does --event-json take? One JSON record, not the multi-line delta."
trigger_phrases: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-runtime-agent-gateway-alignment |
| **Completed** | 2026-08-25 |
| **Level** | 2 |
| **Actual Effort** | ~2 hours (guard-first, four parallel sub-agents, one verification correction) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

**The deep-loop leaf agent prompts now record iteration state through the append gateway, not by writing the projection file.** Four agents — `deep-research`, `deep-review`, `deep-alignment`, `ai-council` — were migrated across all six runtimes. Each now invokes `append-mode-event.cjs --mode <mode>`; the gateway authorizes, fences, receipts, and refreshes the `*-state.jsonl` projection from the ledger. The projection is reclassified read-only in every agent's path tables; exit 0 = durable, exit 2 = refused (halt, name the check), no direct-write fallback.

24 logical agent copies resolve to **16 physical files** — `.cursor/agents/*` and `.devin/agents/*/AGENT.md` are symlinks into `.claude/agents/*`, so editing the Claude copy carries three runtimes at once. `deep-improvement` was left untouched: it is proposal-only and appends no iteration state.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Guard-first. A doc-level guard (`scripts/check-agent-gateway.sh`) was written to fail on any affected agent that omits the gateway, keeps a raw `>> *-state.jsonl` redirect, carries residual direct-write prose, or points `--event-json` at a multi-line delta/state file. The negative control fired on all 24. The `.claude/agents/deep-research.md` copy was migrated by hand as the canonical pattern, then four parallel sub-agents mirrored the transformation across the remaining files (disjoint file sets), each gated by the guard. A verification pass caught the `--event-json` defect and corrected it across every file.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

- **The leaf calls the gateway.** The shipped contract (state-jsonl.md, the orchestrator YAML, the 012 post-flip fan-out test) says leaves record through the gateway; a direct projection write is unauthorized and is what the direct-append guard exists to catch.
- **Four agents, not five.** `deep-improvement` is proposal-only and out of scope.
- **`--event-json` takes one record, not the multi-line delta.** The gateway `JSON.parse`s the file whole; the multi-line `deltas/iter-NNN.jsonl` stays a separate reducer artifact. See `decision-record.md` Decision 5.
- **Agent prompts only.** The runtime and orchestrator already enforce the gateway; the mode SKILLs are silent (not contradictory), so no runtime code, YAML, or SKILL was touched.

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

- **Negative control**: guard on the pre-fix tree `checked=24 failing=24`, exit 2 — every affected file flagged. Rule D (the `--event-json` correction) flagged 18 files before it was fixed.
- **Final guard**: `checked=24 failing=0`, exit 0 across rules A–D, all six runtimes.
- **Residual sweeps**: 0 direct-write prose to `*-state.jsonl`; 0 `--event-json` pointing at `deltas/` or `-state.jsonl`; the `deep-alignment` `printf >> …-state.jsonl` redirect is gone.
- **TOML integrity**: all four `.codex/agents/*.toml` have exactly 2 `'''` delimiters and 6 top-level keys.
- **Scope**: `git status` shows 16 modified agent files (4 agents × `.claude`/`.opencode`/`.pi`/`.codex`; cursor+devin via symlink) plus this spec folder; no runtime code, YAML, SKILL.md, sqlite, or jsonl in the tracked diff.
- **Authoritative gate**: `validate.sh 013-runtime-agent-gateway-alignment --strict` Errors: 0.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Prompt-level change, not a runtime test.** The migration corrects what a dispatched leaf is told to do. It is proven by the doc-level guard, not by a live fan-out that dispatches every migrated agent; the underlying gateway path was already proven under 012.
- **ai-council keeps a `<event payload file>` placeholder.** It names a single event file (not a delta path, so rule D passes) and is coherent, but the placeholder wording differs from the `<record file>` used by the other three agents. Cosmetic only.
- **Mode SKILL docs not updated.** review/alignment/council SKILLs stay silent on the write mechanism. Adding gateway language there is a related follow-up, deliberately out of this packet.

<!-- /ANCHOR:limitations -->
