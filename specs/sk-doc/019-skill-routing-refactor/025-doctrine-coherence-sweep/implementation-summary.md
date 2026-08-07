---
title: "Implementation Summary: Doctrine Coherence Sweep"
description: "Delivered: seventeen files aligned to the metadata contract — no doc calls description.json advisor-facing, the overlay era is fully retired from prose, shape trees state complete class sets, and advisor maintenance docs link the canonical contract."
trigger_phrases:
  - "doctrine coherence sweep summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/025-doctrine-coherence-sweep"
    last_updated_at: "2026-07-28T16:27:03Z"
    last_updated_by: "claude-code"
    recent_action: "Delivered the sweep with stale-phrase probes at zero"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "025-doctrine-coherence-sweep"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Historical changelogs keep period wording by design; probes exempt them"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Doctrine Coherence Sweep

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Delivered** | 2026-07-28 |
| **Execution model** | LUNA xhigh sweeps from lens-1 evidence with re-verification; orchestrator adjudicates and verifies |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A seventeen-file prose alignment: every claim that `description.json` is advisor-facing corrected to its real role (hub-doctor metadata, with `graph-metadata.json` as the sole advisor identity input), the graph template's derived lists no longer feed the pipeline a file nothing reads, the retired overlay wording for `command-metadata.json` replaced by the class-H rule with the canonical link, the create-skill shape trees and README completed to the full class file sets, and the advisor's feature-catalog, graph, and mcp-server docs linking the contract where they previously restated fragments of it.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Probe-driven: the lens-1 findings became greppable stale-phrase probes that must return zero, which made the sweep's completeness checkable rather than judged. One adjudication surfaced mid-run: a probe hit inside a historical sk-git changelog — changelogs are immutable history and stay exempt.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

Link, never restate: each corrected doc points at the canonical contract instead of carrying its own copy of the matrix, so the next contract change has one home. Changelog exemption recorded as policy, not oversight.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Stale-phrase probes | zero hits outside immutable changelogs |
| Graph template derived lists | no description.json reference remains |
| Fleet gate / freshness | 11/11 both after regeneration |
| Diff nature | prose + version bumps only |

Commands: `grep -ri "advisor-facing" .opencode/skills/sk-doc/create-skill | grep -v changelog` (0 hits) · `node .opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs` (checked=11 passed=11).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

Doctor validation blind spots that the templates previously over-promised about are now described honestly but remain unvalidated by the doctor itself — widening the doctor is future work, catalogued in the swarm evidence.
<!-- /ANCHOR:limitations -->
