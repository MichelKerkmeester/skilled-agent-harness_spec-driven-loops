---
title: "Implementation Summary"
description: "Packet scaffolded and In Progress. Remediates the independent Opus 4.8 cross-review of the deployed 013 runtime and docs: 4 P1 correctness fixes (checkpoint-restore data-loss crash window, front-proxy UTF-8 frame corruption, reconcileMoves spec_folder omission, version/tool-count doc sweep) plus 17 P2 advisories. No fixes landed yet."
trigger_phrases:
  - "opus review remediation implementation summary"
  - "013 cross-review fix status"
  - "restore crash window progress"
  - "front-proxy utf-8 frame progress"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/015-opus-review-runtime-remediation"
    last_updated_at: "2026-06-02T16:07:14Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded 015 remediation packet from validated 013/002 sibling"
    next_safe_action: "Fix P1-1 checkpoint-restore data-loss crash window first"
    blockers: []
    key_files:
      - "lib/storage/checkpoints.ts"
      - ".opencode/bin/lib/launcher-session-proxy.cjs"
      - "lib/storage/incremental-index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "opus-review-remediation-setup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-opus-review-runtime-remediation |
| **Completed** | In Progress — scaffolded 2026-06-02 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing implemented yet — this packet is scaffolded and In Progress. It will remediate the independent Opus 4.8 cross-review of the deployed 013 runtime (checkpoint v2, MCP front-proxy, memory_save enrichment, needs-rebuild sentinel) and its docs: 4 P1 correctness fixes plus 17 P2 advisories, each fixed surgically and verified against the deployed source.

### Phase Status

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 0 | Packet setup (docs + metadata) | Done |
| Phase 1 | P1 correctness fixes (restore crash window, front-proxy UTF-8 frame, reconcileMoves spec_folder) + proving vitests | Pending |
| Phase 2 | P1-4 version/tool-count documentation sweep | Pending |
| Phase 3 | 17 P2 advisories resolved or deferred | Pending |

### Planned fixes

- **P1-1 — checkpoint-restore data-loss crash window.** Reorder the restore swap so the snapshot is in place before the live file is retired, and harden boot recovery to reconstruct one consistent live DB from any partial on-disk state, preserving the two-phase journal. Proven by a crash-window vitest.
- **P1-2 — front-proxy UTF-8 frame corruption.** Buffer raw bytes across socket reads and decode UTF-8 only on complete-frame boundaries, with a bounded accumulator, so split multi-byte sequences decode byte-identical. Proven by a split-sequence vitest.
- **P1-3 — reconcileMoves spec_folder omission.** Carry `spec_folder` through the moved-row rewrite verbatim (NULL included). Proven by a reconcile vitest.
- **P1-4 — version/tool-count doc sweep.** Reconcile stale `SCHEMA_VERSION` and tool-count claims to the deployed values at every cited doc location. Doc-only; no runtime effect.
- **17 P2 advisories.** Lower-severity hardening, error-message, and clarity items, each fixed at its cited line or explicitly deferred with rationale (recorded below as fixes land).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. Per-fix code implementation will run through cli-opencode (`openai/gpt-5.5-fast --variant high`) in a worktree, each gated by `npm run typecheck` (0 new errors) plus the targeted vitest that proves the fix, with the orchestrator owning all git writes. Every fix is verified against the deployed source before editing; any finding that does not match the current source is reported rather than blindly applied.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Surgical per-finding fixes over a runtime refactor | The cross-review found discrete defects in a live runtime; a minimal diff is sufficient and lowest-risk. |
| Crash-safe restore-swap ordering | The cited window can leave no live database; reordering plus recovery hardening closes it while preserving the journal. |
| Buffer-then-decode front-proxy frames | Per-chunk decode corrupts multi-byte sequences split across reads; decoding whole frames is the direct fix. |
| Preserve spec_folder through the reconcileMoves rewrite | The bug is an omission; carry the field forward verbatim rather than re-derive it from the new path. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Packet docs authored (spec, plan, tasks, checklist, decision-record, summary) | PASS |
| `npm run typecheck` | Pending |
| P1-1 crash-window vitest | Pending |
| P1-2 split-sequence vitest | Pending |
| P1-3 reconcile vitest | Pending |
| P1-4 doc sweep (no stale value at cited locations) | Pending |
| 17 P2 advisories resolved or deferred | Pending |
| `validate.sh --strict` on this packet | Pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No fixes landed yet.** This packet is scaffolded only; all findings remain open.
2. **Finding accuracy is a dependency.** Each cited finding must be verified against the deployed source before editing; a finding that does not match the current source will be reported, not fixed.
3. **P2 deferrals not yet decided.** Which of the 17 P2 advisories (if any) are deferred is an open question; deferrals will be recorded here with rationale as triage completes.
<!-- /ANCHOR:limitations -->
