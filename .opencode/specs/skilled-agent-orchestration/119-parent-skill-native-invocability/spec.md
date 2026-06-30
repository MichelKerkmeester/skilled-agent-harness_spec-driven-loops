---
title: "Feature Specification: Parent-skill native invocability"
description: "Phase parent for parent-skill native invocability. Coordinates initial planning, the accepted invokable-hub mechanism, and deep-loop alignment while keeping the parent root lean."
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
    packet_pointer: "skilled-agent-orchestration/119-parent-skill-native-invocability"
    last_updated_at: "2026-06-30T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Parent kept as lean phase coordinator with child phases 001 through 003."
    next_safe_action: "Work in the relevant child phase; optional deep-loop live e2e remains in phase 003."
    blockers: []
    key_files:
      - "001-native-invocability-planning/spec.md"
      - "002-invocability-mechanism/decision-record.md"
      - "003-deep-loop-alignment/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "restructure-155-phase-parent"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "001 holds the initial planning and decision-framing record."
      - "002 records ADR-001 Accepted: Option E invokable-hub routing."
      - "003 records deep-loop alignment and required gate closure; full live-loop e2e remains optional."
---
# Feature Specification: Parent-skill native invocability

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent.spec | v2.2 -->

---

## Root Purpose

Coordinate the work that makes parent-skill nested mode packets reachable through an invokable parent hub while preserving the one-`graph-metadata.json` single-identity invariant.

This root is a phase parent. It owns the shared purpose, phase map, and indexing metadata only. Working documents live in child phases.

---

## Phase Documentation Map

| Phase | Folder | Status | Description |
|-------|--------|--------|-------------|
| 1 | `001-native-invocability-planning/` | complete | Initial planning and mechanism-framing record for the native invocability gap. |
| 2 | `002-invocability-mechanism/` | complete | Accepted mechanism decision: Option E, invokable-hub routing through the parent skill. |
| 3 | `003-deep-loop-alignment/` | complete | Deep-loop family alignment with the accepted mechanism; required gates are closed, with full live-loop e2e left as optional evidence. |

---

## Scope

**In scope:** parent-skill native invocability, the invokable-hub routing mechanism, and deep-loop alignment as the canonical high-blast parent-skill family.

**Out of scope:** unrelated parent-skill conversions, new runtime support for direct `Skill(mode)` resolution, and design-skill work tracked outside this packet.

---

## Parent Files

The parent root intentionally carries only:

| File | Purpose |
|------|---------|
| `spec.md` | Root purpose, scope, and phase map |
| `description.json` | Search and discovery metadata |
| `graph-metadata.json` | Parent-child graph and indexing rollup |

---

## Success Criteria

- Child phases are numbered sequentially as `001`, `002`, and `003`.
- Heavy working docs (`plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`) live in child phases, not the parent root.
- The parent `graph-metadata.json` lists all child phases and points to the latest active child.
- Recursive validation passes for the phase parent and all child phases.
