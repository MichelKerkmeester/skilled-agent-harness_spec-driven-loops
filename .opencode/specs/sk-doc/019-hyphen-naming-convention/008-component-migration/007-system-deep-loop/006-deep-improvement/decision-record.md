---
title: "Decision Record: system-deep-loop deep-improvement names (017 phase 007/006)"
description: "L2 design decisions for the deep-improvement multi-lane naming phase, including Python/package boundaries, generated artifacts, shared loop-host closure, and benchmark ownership."
trigger_phrases:
  - "system-deep-loop improvement decisions"
  - "deep-improvement naming decision record"
  - "improvement lane boundary decision"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/007-system-deep-loop/006-deep-improvement"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/007-system-deep-loop/006-deep-improvement"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored improvement decisions"
    next_safe_action: "Verify improvement lane closure"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: System-deep-loop deep-improvement names

<!-- ANCHOR:context -->
## Context

The deep-improvement surface spans 22 underscore-bearing directory families and 250 underscore-bearing files across multiple improvement, benchmark, workflow, scanning, and runtime-truth lanes. Python imports, package directories, generated outputs, and shared loop hosts create distinct boundaries that a single mechanical substitution would not preserve.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — Map the component by lane while closing shared loop-host references
The candidate map is organized by the four major lane families and their supporting workflow/scanning/runtime-truth areas, but shared loop hosts, registries, fixtures, profiles, and cross-lane references move in the same dependency closure.

### DR-002 — Keep Python, package, generated, and tool-mandated boundaries explicit
Python .py files and Python package directories remain exact. Package manifests, generated outputs, serialized keys, and tool-mandated names are classified separately. A non-.py asset such as .py.template is not silently granted the Python exemption.

### DR-003 — Keep component benchmarks separate from the root benchmark phase
Benchmark fixtures and profiles owned by deep-improvement remain in this phase. The root system-deep-loop/benchmark storage labels belong to phase 009 and are excluded from this map, even when a runner references both surfaces.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

- Lane-specific evidence makes ownership and rollback legible while the shared closure prevents stale cross-lane paths.
- The explicit Python/package boundary avoids breaking imports, but it requires a manifest that distinguishes physical names from path values.
- The benchmark ownership split avoids duplicate edits and requires cross-phase reference evidence at the boundary.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- Governing convention decisions: ../../../001-convention-policy-and-scope/decision-record.md.
- Phase specification and lane inventory: spec.md.
<!-- /ANCHOR:references -->
