---
title: "Feature Specification: Parent-skill native invocability"
description: "Phase parent. Make nested parent-skill mode packets natively reachable without breaking the one-graph-metadata single-identity invariant, then propagate the resulting parent-skill optimizations across the skill system. Phase 001 decides and proves the mechanism (invokable-hub routing); phase 002 aligns the deep-loop parent-skill family with it."
trigger_phrases:
  - "parent skill native invocability"
  - "nested packet skill invocation"
  - "invokable hub routing parent skill"
  - "deep-loop parent skill alignment"
  - "parent skill phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/155-parent-skill-native-invocability"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Restructured 155 into a phase parent (001 invocability, 002 deep-loop alignment)"
    next_safe_action: "Author and gate execution of 002 (deep-loop parent-skill alignment)"
    blockers: []
    key_files:
      - "001-invocability-mechanism/decision-record.md"
      - "002-deep-loop-alignment/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "restructure-155-phase-parent"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
# Feature Specification: Parent-skill native invocability

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

## Root Purpose

Make a parent skill's nested mode packets natively reachable without breaking the one-`graph-metadata.json` single-identity invariant, then propagate the resulting parent-skill optimizations across the skill system. This is a **phase parent**: the mechanism decision and each per-family alignment live in phase children; this root carries only the shared purpose and the phase map.

---

## Phase Documentation Map

| Phase | Purpose | Level | Status |
|-------|---------|-------|--------|
| **001-invocability-mechanism** | The invocability gap and the chosen mechanism — Option E, invokable-hub routing: `Skill(<parent>)` loads the hub (the one top-level identity), and the hub's router loads the matching nested mode packet. No runtime change, no advisor merged-identity required. | 3 | Mechanism **accepted** (ADR-001); validated in practice by the 154 sk-design conversion |
| **002-deep-loop-alignment** | Align the deep-loop parent-skill family (`deep-loop-workflows` + `deep-loop-runtime`) with the sk-design parent-skill optimizations: invokable-hub routing, `name == folder` (resolve the `ai-council`/`deep-ai-council` grandfather), feature-catalog hygiene, and runtime reconciliation. | 3 | Planned (gated) |

---

## Scope

**In scope:** the invocability mechanism (001) and its propagation to the deep-loop parent-skill family (002).

**Out of scope:** building net-new design sub-skills (that belongs to the 154 family's gap work); any runtime/binary change (Option D was rejected as out-of-repo); the advisor merged-identity layer except where 002 explicitly evaluates it for deep-loop routing strength.

---

## Success Criteria

- A nested mode is reachable through its invokable parent hub, with exactly one advisor identity preserved (001).
- The deep-loop parent-skill family either matches the sk-design parent-skill conventions, or each deliberate divergence is recorded with its rationale (002).
- `validate.sh --recursive` passes for the parent and both phase children.
