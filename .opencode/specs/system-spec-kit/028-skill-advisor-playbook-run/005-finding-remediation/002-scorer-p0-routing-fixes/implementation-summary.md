---
title: "Implementation Summary: Scorer P0 Routing Fixes (F1b) — Pending"
description: "Planned, not yet implemented. Specifies the ambiguity-abstention and /speckit:plan intent-bonus scorer fixes for the genuine P0 routing failures."
trigger_phrases:
  - "F1b implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/002-scorer-p0-routing-fixes"
    last_updated_at: "2026-05-26T20:40:00Z"
    last_updated_by: "deep-research-remediation"
    recent_action: "Specced F1b; pending implementation"
    next_safe_action: "Implement via /speckit:implement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-skill-advisor-playbook-run/005-finding-remediation/002-scorer-p0-routing-fixes |
| **Completed** | Pending |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Not yet implemented. Specified and ready for `/speckit:implement`. When implemented it adds (1) a low-information abstention/route rule in `ambiguity.ts` so prompts like "api chain mcp" abstain or route to `mcp-code-mode` rather than falsely picking `sk-code` (fixes P0-UNC-001/002), and (2) a bounded `/speckit:plan` command-intent bonus in `projection.ts`/`fusion.ts` mirroring the `/speckit:resume` special case (fixes P0-CMD-002), lifting the regression P0 pass rate from 50% toward ≥92%.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.../lib/scorer/ambiguity.ts` | Modify (planned) | Low-info abstention/route rule |
| `.../lib/scorer/projection.ts` + `fusion.ts` | Modify (planned) | /speckit:plan command-intent bonus |
| regression fixtures | Add (planned) | Cover the ambiguity rule |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Pending. Delivery: `/speckit:implement`, then `skill_advisor_regression.py` to confirm P0 ≥ 0.92 with no regression + scorer vitest.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Separate phase from F1a | Scorer-layer behavior vs metric-layer matching; different risk profiles |
| Mirror /speckit:resume special case for /speckit:plan | Proven bounded pattern; avoids broad command-bridge retuning |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| P0 pass rate ≥ 0.92 | Pending |
| No previously-passing P0 regresses | Pending |
| tsc + scorer vitest | Pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not yet implemented.** Root cause verified in `../research/research.md` §3 F1b.
2. **mcp-code-mode route decision is open** — route-vs-relabel for P0-UNC-002 resolved during implementation.
<!-- /ANCHOR:limitations -->
