---
title: "Implementation Summary: terminal-control-and-integration-research"
description: "A wave-1 read-only research fleet (2x claude2-opus + 1x gpt-5.5-fast) produced a cross-checked recommendation: drive Open Design via its stdio MCP server plus headless od verbs, build mcp-open-design on the mcp-magicpath model with a strict gate policy, and de-vendor sk-design-interface data-first then notices while keeping the Apache-2.0 base. A live license-deletion defect was found and restored."
trigger_phrases:
  - "open design terminal research outcome"
  - "mcp-open-design research summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/002-mcp-open-design/001-terminal-control-and-integration-research"
    last_updated_at: "2026-06-14T12:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Research synthesized; license defect restored to baseline"
    next_safe_action: "Operator reviews research.md; start phase 002 skill build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-150-001-terminal-control-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-terminal-control-and-integration-research |
| **Completed** | 2026-06-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet is research, not code. It produced a cross-checked answer to three questions: how to drive the installed Open Design app from a terminal, how to design the `mcp-open-design` skill, and how to de-vendor plus integrate `sk-design-interface`. The deliverable is `research/research.md` with a prioritized, phaseable recommendation. No skill or app surface was changed beyond restoring files that were already broken in the working tree.

### The recommendation
Open Design is driven by wiring its stdio MCP server into the terminal agent and calling its headless `od` verbs, with no in-app chat needed. The `mcp-open-design` skill follows the `mcp-magicpath` model and carries a strict tool-exposure policy: surface read-only verbs freely, gate every mutating verb behind explicit confirmation, and omit destructive verbs from the default path. The `sk-design-interface` de-vendor runs data-first then notices-second, replacing the vendored CSVs with live Open Design reads where they are richer, keeping the paraphrased quality-floor reference, and retaining the Apache-2.0 base and Anthropic attribution.

### A live defect, found and fixed
Seat B found that all three license files in `sk-design-interface` had been deleted in the working tree, out of the legally safe order. They were restored to clean baseline this session via `git checkout HEAD --`. `LICENSE.txt` must stay because the kept `design_principles.md` is verbatim Apache-2.0 Anthropic content.

### Three seats, reconciled
The fleet ran as three independent read-only seats so the recommendation does not rest on one model's judgment. Seat A read the bundled code; Seat C reached the same terminal-surface corrections adversarially, a strong cross-validation. The two diverged only on how strictly to gate tools, resolved in favor of the stricter policy.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | Canonical cross-checked recommendation |
| `research/seats/{seat-a,seat-b,seat-c}` | Created | Per-seat findings and raw output |
| `spec.md`, `plan.md`, `tasks.md`, this file | Created | Packet control docs |
| `.opencode/skills/sk-design-interface/` license files | Restored | Reverted an out-of-order deletion to clean baseline |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Via a wave-1 read-only research fleet: two `claude2-opus` seats (one on the Open Design terminal-control surface read straight from the bundled code, one on the `sk-design-interface` de-vendor, integration, and licensing) plus one `openai/gpt-5.5-fast` seat (the `mcp-open-design` skill design and an adversarial cross-check of the terminal surface). The orchestrator ground-truthed the live-observed transport and tool-tier facts, restored the license defect, and authored the canonical synthesis from the per-seat findings.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Drive Open Design via MCP plus headless `od` verbs | The stdio server and CLI cover generation, automation, and reads without touching the in-app chat UI |
| Model `mcp-open-design` on `mcp-magicpath` with a strict gate policy | A consistent house shape plus gating keeps mutating and destructive verbs off the default path |
| De-vendor data first, notices second | Removing the MIT-derived data before the MIT notices keeps the licensing cleanup legally ordered |
| Keep the Apache-2.0 base and live-read-only sourcing | The kept `design_principles.md` is Apache content, and never caching Open Design output means no new license attaches |
| Stop at a recommendation | The skill build and de-vendor are separate follow-up phases (002, 003, 004) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fleet completion | PASS, three read-only seats produced findings |
| Terminal-surface cross-check | PASS, Seat A (code read) and Seat C (adversarial) agreed on the corrections |
| License defect restore | PASS, three files restored to clean baseline, verified via git status |
| De-vendor ordering | PASS, data-first then notices-second sequence documented with a risk table |
| `validate.sh --strict` | PASS (recorded at packet completion) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Recommendation only.** No skill is built and no de-vendor is executed in this packet; those are phases 002, 003, and 004.
2. **No web access.** The fleet ran on local source and the bundled app only; upstream behavior is cited from the code and model knowledge, not re-fetched.
3. **Live items deferred.** The exact installer-written MCP entry, whether the daemon dies on app close, whether `od --no-open` gives a working headless daemon, and per-verb auth are carried into phases 002 and 004 for live confirmation.
<!-- /ANCHOR:limitations -->
