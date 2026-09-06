---
title: "Acceptance Criteria: Phase 5: routing-integration"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/005-routing-integration"
    last_updated_at: "2026-09-02T07:56:52Z"
    last_updated_by: "implementation"
    recent_action: "Met every criterion and recorded the evidence per row"
    next_safe_action: "Proceed to phase 006, the playbook and closeout"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "005-routing-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 5: routing-integration

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-design/018-sk-design-parent-v2/001-sk-create-chart/005-routing-integration
**Level:** 3
**Status:** Complete
**Date:** 2026-09-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a chart request in the mode's own vocabulary, When the live advisor scores it, Then `sk-doc` is the top recommendation | `skill-advisor.cjs advisor_recommend` returns `sk-doc` for all six chart phrasings, at confidence 0.82 to 0.9049, where three of the six previously returned no recommendation at all | Met | - |
| AC-002 | REQ-002 | Given the same request, When the hub router resolves it, Then it names `sk-create-chart` and its leaves exist on disk | The advisor result carries `compiledRoute.action=route` with `targets=['sk-create-chart']`, and `router-replay.cjs` resolves `sk-create-chart/SKILL.md`, which is on disk | Met | - |
| AC-003 | REQ-003 | Given that the effective keyword set is a union, When vocabulary is added, Then every contributing file carries it | The same 33 keywords are in `mode-registry.json` aliases and in the `create-chart-aliases` class of `hub-router.json`, plus a `CHART` entry in `ROUTER.md`, and the union is confirmed by a replay rather than by reading | Met | - |
| AC-004 | REQ-004 | Given a change to a compiled-policy input, When the hub is checked, Then it reports compiled and fresh rather than legacy or stale | `compiled-route-manifest.cjs freshness` reports `fresh=true`, and `compiled-route-status.cjs --all` reports all five hubs `compiled-serving` | Met | - |
| AC-005 | REQ-005 | Given the new route, When the registration is withdrawn, Then the canary fails | With the mode removed from both routing files and every digest refreshed so nothing could mask it, the canary failed with `single-create-chart action: 'defer' !== 'route'`, then returned to `REAL-GREEN` on a byte-exact restore | Met | - |
| AC-006 | REQ-006 | Given a vocabulary change, When the neighbouring modes are replayed, Then none of them loses a request | Twelve neighbour phrasings resolve identically before and after at both stages, and the canary's fifteen pre-existing single-route cases still resolve to their own modes | Met | - |
| AC-007 | REQ-001 | Given the hub gate that has failed since the directory appeared, When it runs against the hub, Then it exits 0 | `parent-skill-check.cjs .opencode/skills/sk-doc` reports invariant 6a as PASS and exits 0 with zero warnings | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Both routing stages carried this packet, each proved on its own evidence rather than inferred from the other, with a canary that was shown red under a withdrawn registration before it was trusted green. What was consciously left out is the bare type names the neighbouring diagram packet documents, so a one-word "bar chart" still reaches neither mode, and a command surface, which the mode does not have and did not need.
<!-- /ANCHOR:closure -->
