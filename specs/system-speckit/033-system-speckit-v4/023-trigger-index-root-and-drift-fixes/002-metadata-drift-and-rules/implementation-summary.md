---
title: "Implementation Summary"
description: "Graph metadata refreshes now drop children that belong to a packet's former identity, a validator rule reports any that remain, and a sweep reaches the track roots ordinary validation never visits."
trigger_phrases:
  - "graph metadata child identity"
  - "phantom children pruning merge"
  - "GRAPH_METADATA_CHILD_IDENTITY rule"
  - "track root sweep script"
  - "backfill prediction apply parity"
  - "twelve foreign children gone"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/023-trigger-index-root-and-drift-fixes/002-metadata-drift-and-rules"
    last_updated_at: "2026-09-05T21:16:57Z"
    last_updated_by: "template-author"
    recent_action: "Identity pruning, rule, sweep"
    next_safe_action: "None; phase complete, proceed to 003"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:2c160fc0b359a72a0d6f4768b42d4ce45aedfe32dc00778da4caf58465367538"
      session_id: "scaffold-002-metadata-drift-and-rules"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-metadata-drift-and-rules |
| **Status** | Complete |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The graph-metadata writer unioned derived children and never pruned, so a renamed packet kept its old identity's children forever. The merge now drops any `children_ids` entry whose leading identity is not the packet's own while keeping every derived on-disk child, and the CLI's prune prediction mirrors it so report and apply agree. A new registry rule, `GRAPH_METADATA_CHILD_IDENTITY`, reports entries the writer has not yet touched. A read-only sweep walks every `specs/*/graph-metadata.json` that has no `spec.md` and prints declared versus actual children, exiting non-zero on drift. The proof packet lost its twelve foreign children in one refresh.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/graph/graph-metadata-parser.ts` | Modify | Identity-aware pruning in the merge |
| `runtime/cli/graph/backfill-graph-metadata.ts` | Modify | Prediction matches the merge |
| `runtime/cli/rules/check-graph-metadata-child-identity.sh` | Add | The reporting rule |
| `runtime/cli/lib/validator-registry.json` | Modify | Register the rule |
| `runtime/cli/spec/sweep-track-roots.mjs`, `runtime/cli/spec/README.md` | Add, Modify | Track-root sweep and its invocation |
| `runtime/cli/tests/graph-metadata-refresh.vitest.ts`, `runtime/cli/tests/backfill-prune-report-gate.vitest.ts` | Modify | Prune test; fixture reshaped to the new contract |
| `specs/system-deep-loop/030-deep-loop-unification/graph-metadata.json` | Regenerate | Proof case |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A GLM 5.3 Flash lane through OpenRouter, prompted with the finding, the fix sketch and verification commands; every claim rerun here before commit `5a74f07c88`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Prune by identity, not by disk presence | Disk presence is the union the writer already keeps; identity is the one signal that separates a former packet's children from missing folders |
| Report-only sweep | The 14 drifted track roots and 127 packets are an operator regeneration; a sweep that rewrote them would hide the scale |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Proof packet foreign children | 12 → 0 after one refresh |
| Strict validate on 054 | rule listed, `RESULT: PASSED` |
| Sweep | 14 drifted track roots, exit 1 |
| Writer and registry suites | 16 of 16 (1 skipped) and 115 of 115; shell rule tests 12 and 2 |
| Typecheck, builds, freshness | exit 0, rebuilt, fresh |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- 127 packets and 14 track roots still carry drift until an operator-run regeneration pass; the sweep and the rule report them.
- `runtime/tests/validation-orchestrator-bridge.vitest.ts` expects the retired `scripts/dist` path for compiled rules and stays red; it predates this phase.
- The proof packet keeps a stale `last_active_child_id`; the canonical save path owns that pointer.
<!-- /ANCHOR:limitations -->
