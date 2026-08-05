---
title: "Implementation Summary: Pi Directive Enforcement — tool_call Deny"
description: "Implemented and verified the Pi-default dispatch deny matrix with deep-loop and explicit-mode exemptions."
status: complete
completion_pct: 100
trigger_phrases:
  - "pi directive enforcement summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/038-fable-governor-pi-hook/004-pi-directive-enforcement"
    last_updated_at: "2026-08-05T00:56:22.374Z"
    last_updated_by: "pi-phase-state-reconciliation"
    recent_action: "Reconciled completed Pi dispatch deny evidence"
    next_safe_action: "Continue with Phase 005 follow-up"
    blockers: []
    key_files:
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts"
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts"
    session_dedup:
      fingerprint: "sha256:a217153880d8afebe2294d32c6631b418146eff2d70fca36b1df3040e7c410ac"
      session_id: "2026-08-04-cli-038-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Pi Directive Enforcement — tool_call Deny

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-pi-directive-enforcement |
| **Status** | Complete |
| **Completion** | 100% policy-matrix evidence; registered factory coverage is separately attributed to Phase 007 |
| **Completed** | 2026-08-04 (via cli-codex, gpt-5.6-luna max fast) |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Implemented the Pi-default deny policy in `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts`: dispatch-shaped calls are denied unless a matching explicit cli-* authorization or deep-loop executor is present, while native subagent tools remain unaffected. The phase matrix and focused receipts are retained below; the registered factory boundary is separately evidenced by Phase 007.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented from the research synthesis and verified through the phase matrix and dispatch suite. Phase 007 later adds registered-factory and transform-order evidence without changing this policy scope.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse DISPATCH_SHAPES, don't build a new detector | The detector already exists; the missing piece is the deny |
| Deep-loop executors exempt | They are the sanctioned cross-AI route, not ad-hoc cli-* spawning |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Matrix tests | PASS — 13/13 after review round |
| Cross-AI review (gpt-5.6-sol high) | REQUEST-CHANGES → 4 policy findings were addressed: cli-pi self-recursion is unconditionally denied; deep-loop exemption requires `--executor` == matched skill; authorization uses user-authored text and rejects negated mentions. This phase's 13-test helper matrix did not exercise extension registration order; the registered two-order and injected-text evidence is in the Phase 007 Pi suite command. |
| Dispatch suite | PASS — 54/54 real tests |
| Dispatch suite | PASS — 48/48 real tests (1 collection quirk pre-existing, unrelated file) |
| Shared detector | PASS — `git diff` on `dispatch-audit.mjs` empty |

---

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Registered-factory and transform-order evidence is intentionally attributed to Phase 007; this phase retains its original matrix and dispatch-suite receipts.
<!-- /ANCHOR:limitations -->
