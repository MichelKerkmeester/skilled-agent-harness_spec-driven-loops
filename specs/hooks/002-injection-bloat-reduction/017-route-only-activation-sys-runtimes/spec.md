---
title: "Spec: Route-Only Activation for [SYS] Runtimes"
description: "Activated evidence-gated candidate 004 route-only delivery for Claude Code, Codex, Devin, and OpenCode with fail-open negative controls."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "route-only activation sys runtimes"
  - "candidate 004 sys activation"
  - "full-first route-only repeats activation"
  - "four runtime route-only gate"
importance_tier: "high"
contextType: "spec"
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
      fingerprint: "sha256:0e5a7d4c9c64d63929db001be25c9fe96627d9fa181ac5c420c17ce78597966a"
      session_id: "2026-08-09-route-only-activation-sys-runtimes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: Route-Only Activation for [SYS] Runtimes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-route-only-activation-sys-runtimes |
| **Status** | Complete |
| **Created** | 2026-08-09 |
| **Level** | 2 |
| **Predecessor** | 007-guardrail-controls-and-activation; 004-full-first-route-only-repeats |
| **Successor** | Later Pi and Cursor phases |
| **Priority** | P0 — highest-risk activation phase |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Candidate 004 already produced a route-only decision, but Claude Code, Codex, Devin, and OpenCode still needed to consume it at their real output boundaries. The safe activation boundary was a confirmed same-epoch `SUPPRESSED_SAME` repeat; every uncertain or first-delivery path had to remain full.

The phase connected those consumers, added focused negative controls, and activated exactly the four supported candidate-004 cells. Pi and Cursor remained unactivated.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: exposing the route-only decision through `render.ts` and `policy-plan.ts`; consuming it in the Claude/Codex/Devin `user-prompt-submit.ts` path and `mk-skill-advisor.js`; adding `tests/route-only-activation-negative-controls.vitest.ts`; and changing exactly four candidate-004 activation-matrix cells to `activated` with behavioral and delivery evidence.

Out of scope: Pi, Cursor, other candidate cells, and unrelated advisor-suite environmental failures.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 [P0]** Route-only output had to occur only for a confirmed same-epoch `SUPPRESSED_SAME` repeat.
- **REQ-002 [P0]** First delivery, unknown identity, advisor failure, changed content, and lifecycle replay had to remain full.
- **REQ-003 [P0]** Claude Code, Codex, Devin, and OpenCode had to consume the same evidence-gated decision.
- **REQ-004 [P0]** Exactly those four candidate-004 cells had to become `activated`.
- **REQ-005 [P0]** Pi and Cursor had to remain unactivated.
- **REQ-006 [P1]** Focused negative controls and activation-matrix tests had to pass.
- **REQ-007 [P1]** Pre-existing full-suite environmental failures had to be baselined with and without the change.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** The focused negative-control, Claude hook, and OpenCode plugin suites pass 86 tests.
- **SC-002** `activation-matrix.test.mjs` passes 5/5.
- **SC-003** Byte checks show first=806, repeat=43, advisor-failure=763 full, and unknown=806 full.
- **SC-004** The matrix records exactly four activated candidate-004 cells with `activationState: "evidence-gated"`.
- **SC-005** The approximately 20 unrelated advisor-suite failures reproduce with and without the change, establishing zero new failures.
- **SC-006** Pi and Cursor remain unactivated.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Guardrail suppression risk.** Focused negative controls kept uncertain and fallback paths on full delivery.
- **Lifecycle leakage.** Route-only consumption required a confirmed same-epoch repeat.
- **Activation drift.** The matrix test asserted the exact four-cell activation set.
- **Environmental noise.** The full suite remained red on reproducible launcher, daemon, scorer, vocabulary, parity, and corpus failures unrelated to this phase.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None for the four activated runtimes. Pi and Cursor remain separate future decisions.

<!-- /ANCHOR:questions -->
