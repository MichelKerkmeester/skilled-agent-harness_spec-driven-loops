---
title: "Implementation Summary: AGENTS.md Bloat Audit"
description: "A 5-iteration read-only deep-research loop audited the root AGENTS.md and produced a ranked bloat-reduction report; the safe subset was later applied ad-hoc outside this packet's scope."
trigger_phrases:
  - "implementation summary"
  - "agents.md bloat audit"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/004-agents-md-bloat-audit"
    last_updated_at: "2026-08-08T08:58:31Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Closed the audit packet; recorded deliverable and ad-hoc follow-up"
    next_safe_action: "Packet complete; no further action pending"
    blockers: []
    key_files:
      - "AGENTS.md"
      - "specs/agents/004-agents-md-bloat-audit/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "close-004-bloat-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: AGENTS.md Bloat Audit

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-agents-md-bloat-audit |
| **Completed** | 2026-08-08 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A read-only deep-research loop audited the root `AGENTS.md` (555 lines) for removable/reducible bloat and produced a ranked findings report. Five iterations ran via a single `pi` lineage on `deepseek-v4-flash` (routed through opencode-go); new-info ratio declined 1.00 → 0.15, so the search genuinely exhausted its axis by iteration 5.

The deliverable is `research/research.md`: 40 machine-tracked findings consolidated into Tier 1/2/3 candidates (~75 removable physical lines ≈ 13.5%), a baseline section map, an eliminated-alternatives set (negative knowledge), a preserve set protecting every unique normative constraint, and a convergence report.

### Follow-up (applied ad-hoc, outside this packet's read-only scope)
This packet was scoped read-only; implementation was flagged as a separate follow-up. In practice the operator directed the safe subset directly on `AGENTS.md` in the same session:
- **Fixed all 7 broken `constitutional/*.md` links** (finding F1-1) → real path under `.opencode/skills/system-spec-kit/constitutional/`.
- **Applied 3 verified duplicate-removal trims** (memory_search note, §5 daemon-CLI subsection, §9 validate.sh block) — each removed fact preserved elsewhere; −9 net lines.
- The remaining Tier 1/2/3 candidates were **held** after verification (unique content or preserve-set conflicts), not cut.
These edits landed on `skilled/v4.0.0.0` (commit `c20561d5d0`), not in this packet.

### Files Changed (this packet)

| File | Action | Purpose |
|------|--------|---------|
| `research/**` | Created | Deep-research lineage, iterations, deltas, registries, `research.md` |
| `spec.md` | Created | Seeded by the loop with the generated findings fence |
| `plan.md` / `tasks.md` / `implementation-summary.md` | Created | Level-1 doc set for closure |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The `/deep:research` loop ran headless in the background (executor cli-pi/deepseek-v4-flash), initialized externalized state under `research/`, dispatched 5 leaf iterations, reduced state between them, and synthesized `research.md`. Init health and progress were monitored; the loop exited 0.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Read-only audit, implementation separate | Keeps the audit evidence clean; edits verified individually before applying |
| Forced 5 iterations (max-iterations) | Operator wanted exhaustive discovery, not early convergence |
| Applied only the verified-safe subset | The audit's line estimates are candidates; each was diffed before cutting |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Loop completion | PASS — 5 iterations, exit 0 |
| `research/research.md` synthesized | PASS — Tier 1/2/3 + preserve set + convergence report |
| Convergence | PASS — new-info ratio 1.00 → 0.15 (exhausted) |
| `validate.sh --strict` | PASS — recorded in this session (0 errors) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Line-savings are estimates** — the audit's spans/savings are candidates; only the diffed-and-verified subset was applied.
2. **F2-6 open** — whether §2 Post-Save Review is stale (vs the MCP `memory_save` path) still needs human verification; ~4 lines at risk. Not resolved here.
3. **Practitioner-quality findings** — DeepSeek-generated; file existence was verified, but each candidate remains a hypothesis until diffed.
<!-- /ANCHOR:limitations -->
