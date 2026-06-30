---
title: "Implementation Summary: Parity baseline and runtime-ownership ADR"
description: "Phase 001 of the deep-loop-workflows merge: captured the pristine parity baseline (924 files + advisor routing), authored the runtime-ownership ADR, and resolved the B5 nested-graph-metadata discovery keystone."
trigger_phrases:
  - "deep-loop-workflows phase 001 summary"
  - "parity baseline captured"
  - "runtime ownership adr complete"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/029-deep-loop-workflows/001-parity-baseline-and-runtime-ownership-adr"
    last_updated_at: "2026-06-15T05:56:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Captured parity baseline + advisor routing; authored ownership ADR; resolved B5"
    next_safe_action: "Execute phase 002 runtime backend promotions"
    blockers: []
    key_files:
      - "baseline/file-hashes.txt"
      - "baseline/advisor-routing.txt"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-001-implementation-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "B5: does the advisor discover nested SKILL.md as separate skills? (No — it keys on graph-metadata.json; drop nested copies)"
---
# Implementation Summary: Parity baseline and runtime-ownership ADR

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 001 of 009 (foundation) |
| **Status** | Complete |
| **Date** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Depends on** | none (first phase) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

This foundation phase produced the artifacts every later phase verifies against, with no change to any live skill:

- **Pristine parity baseline** — `baseline/file-hashes.txt`: SHA-256 of 924 files across the five source skills, `deep-loop-runtime`, and the eight `/deep:*` commands + assets. Manifest digest `6bbdfa273d422bb3f5bd77d14fac0e89dbe0f51f85a405766335e86d59052d9b`. This is the "before" reference for byte-identical per-mode parity.
- **Advisor routing baseline** — `baseline/advisor-routing.txt`: the standalone advisor's winning skill for one representative prompt per mode (deep-research MED, deep-review HIGH, deep-context, deep-ai-council HIGH, deep-improvement). Phase 006 must reproduce these as `deep-loop-workflows` + the concrete mode.
- **Runtime-ownership ADR** — `decision-record.md` (ADR-001): authorizes the phase-002 promotions and names `deep-loop-workflows` the single runtime consumer, per the runtime's ESCALATE rule.
- **B5 keystone resolution** — recorded in the ADR: the advisor scanner recursively discovers every `graph-metadata.json` and throws on `skill_id ≠ folder`; the mode packets must drop their per-mode `graph-metadata.json`. The whole single-skill-multi-mode layout is now de-risked.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baseline was captured directly by the orchestrator (`find` + `shasum` for the file manifest; the standalone Python advisor for routing, since the advisor daemon CLI was cold this session). The ADR and this summary were authored against the canonical spec-kit templates. No worker-fleet dispatch was needed for this read-only/additive phase.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

- Promote only generic plumbing into the runtime; keep the four reduce-state reducer bodies per-mode; add no `improvement` `loopType` (ADR-001).
- Drop per-mode `graph-metadata.json` in the merged packets; keep only the hub's (B5).
- Capture Lane D parity dry-run-only (blocker B8), so phase-009 acceptance compares on the same basis.

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

- `baseline/file-hashes.txt` present, 924 entries, reproducible (`shasum -a 256` over the documented file set).
- `baseline/advisor-routing.txt` present, five mode prompts each routing to the expected current skill.
- `decision-record.md` authored (ADR-001 Accepted).
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` — run after this summary lands; expected green at Level 2.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

- The parity baseline is a file-content + advisor-routing snapshot, not a full runtime-artifact replay of every loop; for a move-and-rewrite refactor this is the appropriate parity reference, but any phase that changes runtime behavior (none are intended to) would need an artifact-level replay.
- The advisor routing baseline used the standalone Python advisor because the daemon CLI was cold; the warm-daemon routing should match but is re-confirmed in phase 006.

<!-- /ANCHOR:limitations -->
