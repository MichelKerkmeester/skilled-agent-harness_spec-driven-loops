---
title: "Implementation Summary: Route-Only Activation for [SYS] Runtimes"
description: "Completed implementation summary for evidence-gated candidate 004 route-only delivery on four system runtimes."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "route-only activation sys runtimes implementation"
  - "candidate 004 activation summary"
importance_tier: "high"
contextType: "implementation"
parent: "hooks/002-injection-bloat-reduction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/017-route-only-activation-sys-runtimes"
    last_updated_at: "2026-08-09T14:52:56Z"
    last_updated_by: "sol"
    recent_action: "Reconciled four-runtime route-only activation"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts"
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
      - ".opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts"
      - ".opencode/plugins/mk-skill-advisor.js"
      - "specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.json"
    session_dedup:
      fingerprint: "sha256:a78ca114553002e95984bb480256e8aa95ab11354e419d3313521c199e51e153"
      session_id: "2026-08-09-route-only-activation-sys-runtimes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Route-Only Activation for [SYS] Runtimes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-route-only-activation-sys-runtimes |
| **Status** | Complete |
| **Created** | 2026-08-09 |
| **Level** | 2 |
| **Completion** | 100% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Candidate 004 route-only delivery was activated for Claude Code, Codex, Devin, and OpenCode. `render.ts` and `policy-plan.ts` exposed the decision, while `user-prompt-submit.ts` and `mk-skill-advisor.js` consumed it.

The consumers emitted the approximately 43-byte route-only result only for a confirmed same-epoch `SUPPRESSED_SAME` repeat. First delivery, unknown identity, advisor failure, changed content, and lifecycle replay remained full. Pi and Cursor were not activated.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The runtime consumers were wired to the evidence-gated policy decision, and `tests/route-only-activation-negative-controls.vitest.ts` covered the fail-open boundary. The four candidate-004 cells in `activation-matrix.json` changed from `emit` to `activated` with behavioral and delivery evidence, and `activationState` became `evidence-gated`.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Consume route-only only for confirmed same-epoch `SUPPRESSED_SAME` | This preserved full delivery on first, unknown, failed, changed-content, and lifecycle paths. |
| Activate exactly four candidate-004 cells | Claude Code, Codex, Devin, and OpenCode had behavioral and delivery evidence; Pi and Cursor did not activate. |
| Baseline the red full suite with and without the change | The repeated approximately 20 failures established that the phase introduced zero new failures. |
| Keep rollback cell-scoped | One runtime can return to `emit` without disabling unrelated activations. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Focused runtime suites | Negative-controls, Claude user-prompt-submit hook, and mk-skill-advisor plugin suites passed 86 tests. |
| Activation matrix | `activation-matrix.test.mjs` passed 5/5. |
| Fail-open byte checks | First delivery was 806 bytes, repeat was 43 bytes, advisor failure was 763 bytes full, and unknown identity was 806 bytes full. |
| Regression baseline | Approximately 20 unrelated advisor-suite failures reproduced both with and without this change; the phase introduced zero new failures. |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The full advisor Vitest suite remained red because of pre-existing environmental failures in launcher, daemon, scorer, vocabulary, parity, and corpus areas. Those failures reproduced with and without this phase. Pi and Cursor remained outside the activation set.

<!-- /ANCHOR:limitations -->
