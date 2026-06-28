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
    recent_action: "Phase map reconciled; 001 done and 002 R1-R5 complete with optional live-loop e2e not run"
    next_safe_action: "Optional: run a full live deep-loop e2e; refresh metadata separately"
    blockers: []
    key_files:
      - "001-invocability-mechanism/decision-record.md"
      - "002-deep-loop-alignment/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "restructure-155-phase-parent"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "001 ADR-001 accepted Option E invokable-hub routing."
      - "002 R1-R5 are done: static hub routing, deep-ai-council rename, keep-all feature catalogs, merged-identity keep, and required R5 gates are closed."
      - "NFR-S01 is documented as a hub union-grant pattern; WebFetch stays on the hub."
      - "002 reachability is confirmed by runtime registration; /deep:* commands and the ai-council agent are registered/available; full live-loop e2e remains optional and was not run."
---
# Feature Specification: Parent-skill native invocability

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->

---

## Root Purpose

Make a parent skill's nested mode packets natively reachable without breaking the one-`graph-metadata.json` single-identity invariant, then propagate the resulting parent-skill optimizations across the skill system. This is a **phase parent**: the mechanism decision and each per-family alignment live in phase children; this root carries only the shared purpose and the phase map.

---

## Phase Documentation Map

| Phase | Purpose | Level | Status |
|-------|---------|-------|--------|
| **001-invocability-mechanism** | The invocability gap and the chosen mechanism: Option E, invokable-hub routing. `Skill(<parent>)` loads the hub (the one top-level identity), and the hub router loads the matching nested mode packet. | 3 | Decision complete: ADR-001 Accepted; no source build in 001; NFR-S01 carried to 002 |
| **002-deep-loop-alignment** | Align the deep-loop parent-skill family (`deep-loop-workflows` + `deep-loop-runtime`) with the accepted mechanism: invokable-hub routing, `deep-ai-council` folder/name identity, feature-catalog hygiene, runtime reconciliation, and validation. | 3 | Complete: R1-R5 done; all required gates green; live-loop e2e optional/not run |

---

## Scope

**In scope:** the invocability mechanism (001) and its propagation to the deep-loop parent-skill family (002).

**Out of scope:** building net-new design sub-skills (that belongs to the 154 family's gap work); any runtime/binary change (Option D was rejected as out-of-repo); the advisor merged-identity layer except where 002 explicitly evaluates it for deep-loop routing strength.

---

## Success Criteria

- A nested mode is reachable through its invokable parent hub, with exactly one advisor identity preserved (001).
- The deep-loop parent-skill family either matches the sk-design parent-skill conventions, or each deliberate divergence is recorded with its rationale (002).
- `validate.sh --recursive` passes for the parent and both phase children as a structural gate; semantic review findings close only when child docs and evidence explicitly satisfy them.
