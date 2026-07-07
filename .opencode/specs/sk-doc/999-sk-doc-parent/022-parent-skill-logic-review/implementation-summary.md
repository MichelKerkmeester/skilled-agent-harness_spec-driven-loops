---
title: "Implementation Summary: Parent-skill logic deep review"
description: "One Fable-5 xhigh review round produced review-report.md — 18 findings (1 P0, 7 P1, 10 P2) across the parent-hub doctrine, its four implementations, and the advisor integration; the P0 (sk-design canon fail) was independently re-confirmed."
trigger_phrases:
  - "parent skill logic review summary"
  - "999 sk-doc phase 022 summary"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-sk-doc-parent/022-parent-skill-logic-review"
    last_updated_at: "2026-07-07T15:48:20.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Fable-5 review complete; P0 re-confirmed"
    next_safe_action: "Triage findings into follow-up phases"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/999-sk-doc-parent/022-parent-skill-logic-review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 022-parent-skill-logic-review |
| **Completed** | 2026-07-07 |
| **Level** | 1 |
| **Deliverable** | `review-report.md` (370 lines, 18 findings) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

A single Fable-5 xhigh deep-review round over the parent-hub (parent-skill) pattern, delivered as `review-report.md`: an executive verdict, an 18-row findings table, per-finding evidence with file:line, a 30-row cross-hub consistency matrix, an advisor-integration section, and a 9-step prioritized fix list. Coverage: the create-skill doctrine (2 references + 5 templates + SKILL.md), all four hubs' SKILL/registry/router/graph/description files, the enforcement scripts, and the advisor's scorer/discovery/drift-guard layer — plus a live `parent-skill-check.cjs` run on all four hubs.

### Findings: 18 total — 1 P0, 7 P1, 10 P2

- **PS-01 (P0)** — sk-design fails the canon checker today: `packetKind: "transport"` is outside the doctrine's + checker's `workflow|surface` enum, and `feature_catalog/` is an unregistered hub-root dir. The transport axis shipped without being canonized. **Independently re-confirmed:** `parent-skill-check.cjs` exits 1 on sk-design (4 fails) while sk-doc/sk-code/deep-loop exit 0.
- **PS-02 (P1)** — `surfaceBundle` router outcome: doctrine demands it unconditionally, 3/4 hubs omit it, sk-doc's SKILL.md forbids it, the checker only requires it with surfaces — three conflicting canons.
- **PS-03 (P1)** — the one-identity invariant has no ingestion-time enforcement; only the manually-run doctor script guards it.
- **PS-06/PS-07 (P1)** — advisor command-bridge lanes contradict the hub registries (a "never advisor-scored" mode gets negative-boost lexical phrases keyed on a dead legacy id; sk-doc `create:*` bridges are partial + TS/Python-divergent).
- **PS-04/PS-05 (P1)** — sk-code tool-contract contradictions (`code-review` allows `Write` but declares `mutatesWorkspace:false`; hub grants `Task` though every mode forbids it).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `review-report.md` | Add | The Fable-5 review deliverable |
| `spec.md`, `plan.md`, `tasks.md`, this file | Add | Level-1 packet docs |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A Fable-5 subagent ran one exhaustive review round at maximum reasoning depth, reading the doctrine, all four hubs, and the advisor end-to-end, and verifying every load-bearing claim against the source (file:line), distinguishing CONFIRMED from SUSPECTED. The highest-stakes finding was proven by executing the checker rather than inferred. The parent (opus) independently re-ran `parent-skill-check.cjs` across all four hubs and confirmed the P0 (sk-design exit 1; the other three exit 0) and the two P0 specifics (transport `packetKind`, `feature_catalog/` hub-root dir).

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Single Fable-5 xhigh round (deep-review style) | Operator's explicit request; one comprehensive pass over analysis-only scope |
| Analysis only — no fixes applied | Each P0/P1 becomes a triaged follow-up phase, not a same-run change |
| Re-confirm the P0 independently | It is the headline, action-driving finding; verified by live checker + direct evidence |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Report completeness | Pass | Verdict + 18-row table + per-finding evidence + 30-row matrix + advisor section + fix list |
| Evidence discipline | Pass | Load-bearing claims carry file:line; CONFIRMED vs SUSPECTED separated |
| P0 re-confirmation | Pass | `parent-skill-check.cjs`: sk-design exit 1 (4 fails), other 3 exit 0; transport packetKind + feature_catalog dir present |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Findings are analysis, not fixes** — the 1 P0 + 7 P1 each warrant a triaged follow-up phase; none were applied here.
2. **SUSPECTED findings need runtime checks** — items the review could not execute are flagged as SUSPECTED in the report and should be confirmed before acting.

<!-- /ANCHOR:limitations -->
