---
title: "Plan: Route-Only Activation for [SYS] Runtimes"
description: "Completed delivery plan for evidence-gated candidate 004 route-only consumption on four system runtimes."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "route-only activation sys runtimes plan"
  - "candidate 004 activation plan"
  - "four runtime suppression gate"
importance_tier: "high"
contextType: "plan"
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
      - "specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.test.mjs"
    session_dedup:
      fingerprint: "sha256:9446904b87d49ff0ad19d63897a0536d1fd21536cb7d1a5e439f56108faf04d7"
      session_id: "2026-08-09-route-only-activation-sys-runtimes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: Route-Only Activation for [SYS] Runtimes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Candidate 004 exposed full-first and route-only-repeat decisions. The missing step was consumption at the Claude Code, Codex, Devin, and OpenCode output boundaries.

### Overview

The phase exposed and consumed the decision, added focused negative controls, activated exactly four evidence-backed matrix cells, and retained full delivery for uncertainty, failure, and lifecycle boundaries.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Identify the four eligible runtime consumers.
- Define `SUPPRESSED_SAME` as the only route-only state.
- Record the fail-open cases and exact activation set.

### Definition of Done

- 86 focused tests pass.
- The activation matrix passes 5/5.
- First, failure, unknown, changed-content, and lifecycle paths remain full.
- Exactly four candidate-004 cells are activated.
- Pi and Cursor remain unactivated.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

`render.ts` and `policy-plan.ts` exposed the decision. Runtime consumers selected the approximately 43-byte route-only result only for a confirmed same-epoch `SUPPRESSED_SAME` repeat and otherwise retained the full block.

### Key Components

- Claude/Codex/Devin `user-prompt-submit.ts` consumer path.
- OpenCode `mk-skill-advisor.js` consumer.
- `tests/route-only-activation-negative-controls.vitest.ts`.
- Candidate-004 cells in `activation-matrix.json`.

### Data Flow

| State | Output |
|-------|--------|
| First delivery | 806-byte full output |
| Confirmed same-epoch repeat | Approximately 43-byte route-only output |
| Advisor failure | 763-byte full fallback |
| Unknown identity | 806-byte full output |
| Lifecycle replay or changed content | Full output |

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline

The existing shadow decision, runtime consumers, matrix cells, and fail-open byte outputs were recorded.

### Phase 2: Consumer Wiring

The policy decision was exposed and consumed in the system-runtime hooks and OpenCode plugin.

### Phase 3: Negative Controls

The focused route-only activation suite covered the repeat and fail-open boundaries.

### Phase 4: Matrix Activation

Claude Code/004, Codex/004, Devin/004, and OpenCode/004 changed from `emit` to `activated` with behavioral and delivery evidence.

### Phase 5: Verification

The focused suites passed 86 tests, the matrix passed 5/5, and the unrelated full-suite failures reproduced on the baseline.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The negative-control, Claude user-prompt-submit hook, and mk-skill-advisor plugin suites passed 86 tests. `activation-matrix.test.mjs` passed 5/5. Direct byte checks confirmed first=806, repeat=43, advisor-failure=763 full, and unknown=806 full.

The full advisor suite's approximately 20 launcher, daemon, scorer, vocabulary, parity, and corpus failures reproduced both with and without the phase, so the phase introduced zero new failures.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Existing candidate 004 decision in `render.ts` and `policy-plan.ts`.
- Claude/Codex/Devin prompt-submit consumers.
- OpenCode `mk-skill-advisor.js`.
- The phase-007 activation matrix and matrix test.
- No Pi or Cursor activation dependency.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

A runtime can return to full delivery by changing its candidate-004 cell back to `emit` and clearing its delivery state. Uncertain, failed, and unactivated paths already fail open to full output. Pi and Cursor require no rollback because they were not activated.

<!-- /ANCHOR:rollback -->
