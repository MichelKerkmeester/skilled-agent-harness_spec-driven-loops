---
title: "Implementation Summary: Phase 8: nested-parent-conversion"
description: "Honest plan-only summary: this packet authored the decision record, staged plan, and supporting docs for converting the flat sk-design family into one nested-packet parent skill. The conversion itself is NOT implemented here (completion_pct 0); it is staged and gated for a future, operator-approved execution."
trigger_phrases:
  - "sk-design conversion plan summary"
  - "sk-design nested parent plan outcome"
  - "sk-design model A plan-only"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/008-nested-parent-conversion"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded the plan-only conversion deliverables; nothing built"
    next_safe_action: "Operator review of ADR-001/ADR-002, then approve staged execution"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skilled-agent-orchestration/154-sk-design-parent/008-nested-parent-conversion"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Worktree vs committed-baseline for the irreversible Stage 2 move"
      - "Ship optional /design:* commands + agents now or defer (Stage 4)"
    answered_questions:
      - "Structural model: Model A (one nested-packet parent), reversing 002 Model B"
      - "Invocation: invokable hub routes to modes; advisor merged-identity avoided"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

<!-- HONEST STATUS: plan-only packet. completion_pct = 0. What was "built" is the plan,
the decision record, and the supporting docs - not the conversion. -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-nested-parent-conversion |
| **Completed** | n/a - plan-only, completion_pct 0 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet is plan-only. It produced the decision and the plan for converting the flat `sk-design` family (one umbrella router plus five independent top-level siblings) into a single nested-packet parent skill (Model A), reversing the binding 002 Model-B decision, and it settled the invocation mechanism so the conversion does not need the deep-loop-specific advisor merged-identity layer. No conversion was executed: no folder moves, no `graph-metadata.json` deletions, no content moves, no reference rewrites, no advisor/skill-graph/code changes.

### Decision record
ADR-001 records the 002 Model-B → Model-A reversal (one nested-packet parent) with rationale, the rejected "keep Model B" alternative, a five-checks pass, and consequences. ADR-002 records the invocation mechanism: modes are reached through the invokable hub (`Skill(sk-design[, args])` → hub smart router → Read `sk-design/<mode>/SKILL.md`), and the advisor merged-identity extension is deliberately avoided (no Python `nl_ID`/`nl` map, no TS analog, no drift-guard).

### Staged plan
`plan.md` defines five gated stages (1 scaffold, 2 nest [irreversible], 3 rewire, 4 commands/agents [optional], 5 validate), each with entry/exit gates and rollback, plus the dependency graph, critical path, and milestones. The irreversible structural move is isolated behind a recovery baseline.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Created | Plan-only Level-3 spec |
| `plan.md` | Created | Staged, gated conversion plan |
| `tasks.md` | Created | Planning + future-stage tasks |
| `decision-record.md` | Created | ADR-001 reversal + ADR-002 invocation mechanism |
| `checklist.md` | Created | Plan-only verification |
| `implementation-summary.md` | Created | This summary |
| `description.json` | Generated | `generate-description.js` |
| `graph-metadata.json` | Generated + edited | `backfill-graph-metadata.js` + manual edges (155, 002, 147, 150) |
| `../spec.md` | Modified (append-only) | Phase 008 row added to the parent map |

Nothing under `.opencode/skills/**`, no advisor maps, no `CLAUDE.md`/`AGENTS.md` were touched - those are the FUTURE conversion's change surface.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The deliverables were authored against the manifest Level-3 templates (`templates/manifest/*.tmpl`), not the drifted `examples/` copies, so anchors and headers match the validator contract. The pattern, the one-graph-metadata invariant, the three parent-skill templates, the canonical `deep-loop-workflows` example, the prior 002 decision, and the blast-radius facts were all read first and folded into the plan and decision record. Confidence that the plan is sound comes from mirroring the only working precedent (`deep-loop-workflows`) and from staging the one irreversible step behind a recovery baseline. The packet was validated with `validate.sh --strict` on itself and on the parent 154 after the append-only phase-map row.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat this packet as plan-only | The dispatch says "PLAN ONLY (do NOT implement)"; the reversal needs operator review before any build |
| Isolate Stage 2 behind a recovery baseline | The content move + child graph-metadata deletion is the only irreversible part; everything else is additive/text |
| Set `advisorRouting.routingClass = metadata` for the modes | No merged-identity layer is built; the single advisor entry is the hub, so modes resolve by skill membership |
| Keep 002 `complete`; add 008 as a distinct row | A reversal recorded as a new decision keeps the packet history legible rather than editing the prior phase |
| Treat 155 as satisfied, not blocking | The invocation mechanism is now decided (hub routing), which answers 155's native-invocability research question |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Templates used | PASS - all six docs carry manifest `SPECKIT_TEMPLATE_SOURCE` headers; anchors + headers match the Level-3 contract |
| Plan-only constraint | PASS - no `.opencode/skills/**` change; completion_pct 0 |
| Decision completeness | PASS - ADR-001 + ADR-002 each with chosen + rejected options, rationale, five-checks, consequences |
| Stage gating | PASS - five stages each with entry/exit gate + rollback; irreversible move isolated |
| `validate.sh --strict` (this packet) | Recorded in the delivery report (exit code) |
| `validate.sh --strict` (parent 154) | Recorded in the delivery report (exit code), after the append-only map row |
| Parent map append-only | PASS - 008 row added; 001-007 unchanged |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Plan-only.** No conversion is executed; the family remains flat (six advisor identities) until a future packet runs the stages.
2. **Indicative effort only.** `plan.md` does not commit to a schedule because nothing is built here.
3. **Stage 2 is irreversible mid-flight.** The plan mitigates with a recovery baseline, but the structural move remains the inherent risk of the conversion.
4. **Optional surfaces undecided.** Whether to ship `/design:*` commands + agents (Stage 4) is deferred; the primary invocation does not depend on them.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation.
Write in human voice: active, direct, specific.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
