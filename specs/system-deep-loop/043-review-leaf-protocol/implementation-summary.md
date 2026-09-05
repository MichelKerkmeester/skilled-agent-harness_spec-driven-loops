---
title: "Implementation Summary"
description: "Review leaves are now told the two things the fan-out runner fails them for, and the runtime's determinism tests spawn the vitest binary that actually exists."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "review leaf protocol"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/043-review-leaf-protocol"
    last_updated_at: "2026-09-05T21:45:00Z"
    last_updated_by: "implementer"
    recent_action: "Leaf duties stated, tests repointed"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".opencode/agents/deep-review.md"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/event-envelope.vitest.ts"
    session_dedup:
      fingerprint: "sha256:390ae8998c26bf10cfd805af658001a0c2e88b4be2d4535124c7b3fed4096bbb"
      session_id: "2026-09-05-043-review-leaf-protocol"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 043-review-leaf-protocol |
| **Status** | Complete |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The lineage prompt the runner composes now ends with two duties: copy the artifact directory verbatim into every write, and, when the stop policy is max-iterations, record `stopReason: maxIterationsReached` on the terminal synthesis. The deep-review agent contract carries the same two bullets; the codex and pi mirrors were regenerated, the Claude copy's body synced, and the compiled review contract recompiled.

The three determinism tests that had been read as environment-dependent were spawning a nested vitest from `system-spec-kit/runtime/node_modules`, a path the workspace hoist removed. They now resolve the deep-loop runtime's own binary and pass.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/scripts/fanout-run.cjs` | Modify | Two prompt sentences |
| `runtime/tests/unit/fanout-run.vitest.ts` | Modify | Prompt test |
| `.opencode/agents/deep-review.md`, `.claude/agents/deep-review.md`, `.codex/agents/deep-review.toml`, `.pi/agents/deep-review.md` | Modify | Contract and mirrors |
| `.opencode/commands/deep/assets/compiled/deep-review.contract.md` | Regenerate | Compiled from the updated agent |
| `runtime/tests/unit/{event-envelope,replay-fingerprint,stream-fold-gauges}.vitest.ts` | Modify | Child vitest path |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Direct edits after the sixth nesting review pass; committed at `9f6b2dc2ae` (prompt, contract, mirrors) and the determinism-test commit that follows it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Instruct the leaf rather than relax the runner | The containment and stop-policy checks are the fail-closed contract; the defect was the leaf not knowing them |
| Keep the stop-reason sentence conditional on the policy | Under convergence the runner does not require it, and a false duty invites a false record |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tests/unit/fanout-run.vitest.ts` | 117 of 117 |
| Three determinism files | 132 of 132 |
| `check-agent-mirror-sync.cjs` | 12 agents in sync |
| `check-contract-drift.cjs` | OK, 3 commands |
| `sync-runtime-mirrors.cjs --check` | 169 of 169 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The whole deep-loop runtime suite hangs in this session's shell at zero CPU before printing results; the unit directory and the named files were run directly instead. The cause of the hang is not identified here.
<!-- /ANCHOR:limitations -->
