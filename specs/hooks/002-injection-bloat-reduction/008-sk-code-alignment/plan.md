---
title: "Implementation Plan: sk-code Alignment and README Freshness Audit"
description: "Plan to run a bounded 5-iteration deep-research audit of the injection-bloat code's sk-code opencode-surface alignment and README freshness, then implement the verified must-fix findings (comment-hygiene label strips and three README updates)."
trigger_phrases:
  - "sk-code alignment plan"
  - "readme freshness plan"
  - "injection bloat audit plan"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/008-sk-code-alignment"
    last_updated_at: "2026-08-07T05:30:00Z"
    last_updated_by: "claude"
    recent_action: "Ran the 5-iteration audit and implemented the verified must-fix findings"
    next_safe_action: "Optionally apply the deferred polish items (shared candidate constant, adjacent README notes)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/README.md"
      - ".opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md"
    session_dedup:
      fingerprint: "sha256:c3d2bd92d76912b1a3bd03270c51da380d92e2e884bc131b3f8ae86502d8587b"
      session_id: "2026-08-07-hooks-002-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-code Alignment and README Freshness Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript / `.mjs` / `.cjs` (the injection-bloat changed surface) plus Markdown READMEs |
| **Framework** | Deep-research loop (`system-deep-loop` fan-out) with a `cli-opencode` `deepseek/deepseek-v4-flash` executor for the audit; direct edits for the fixes |
| **Storage** | Research artifacts under `research/`; no database |
| **Testing** | `node --check`, the existing `spec-gate-core` suite, and the advisor policy vitest suites confirm behavior is unchanged |

### Overview
Audit whether this session's twelve changed injection-bloat code files align with the sk-code opencode-surface standards and identify which READMEs are stale, using a bounded five-iteration deep-research loop. Then verify each finding against the real files and implement only the confirmed must-fix set: strip ephemeral fix-round labels from code comments (constitutional comment hygiene) and correct three stale-by-omission READMEs. The frozen shadow-delivery behavior is out of scope and is not modified.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Changed surface committed and stable (`78ef96ae6b`)
- [x] Audit scope bounded to this session's twelve changed files and their READMEs
- [x] Executor and iteration count fixed (deepseek-v4-flash, 5 iterations, no early convergence)

### Definition of Done
- [x] Every must-fix finding verified against the real file before any edit
- [x] Comment-hygiene labels stripped; three READMEs corrected; behavior unchanged
- [x] Syntax, `spec-gate-core`, and policy suites pass from the final state
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Audit-then-fix with per-finding verification: a fast small-model loop produces candidate findings; the orchestrator treats each as a hypothesis and confirms it against the real file (grep/read) before implementing, so a fabricated finding cannot drive a change.

### Key Components
- **Deep-research audit (new)**: Five `deepseek-v4-flash` iterations produce per-file alignment verdicts and README-freshness findings synthesized into `research/lineages/deepseek-flash/research.md`.
- **Verification pass**: Each must-fix finding re-checked against the real file (labels present, READMEs actually missing the entries, cited API/env names real).
- **Fix implementation**: Comment-only label strips plus additive README corrections.

### Data Flow
1. The loop audits the twelve changed files against sk-code opencode-surface standards and scans READMEs.
2. Findings are synthesized and categorized must-fix vs optional.
3. The orchestrator verifies each must-fix finding against the real file.
4. Confirmed must-fix items are implemented; behavior-preserving verification follows.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Seed the packet spec and launch the bounded deep-research loop over the committed surface
- [x] Collect the synthesized findings and per-iteration state

### Phase 2: Core Implementation
- [x] Verify each must-fix finding against the real file (labels, README omissions, real API/env names)
- [x] Strip the four ephemeral `(fix N)` / `(P1 fix)` comment labels, keeping the durable WHY
- [x] Correct `lib/README.md`, `lib/spec-gate/README.md`, and `ENV-REFERENCE.md`

### Phase 3: Verification
- [x] `node --check` the two edited code files
- [x] Confirm zero ephemeral labels remain across the changed surface
- [x] Re-run the `spec-gate-core` and advisor policy suites and confirm no behavior change
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | The two comment-edited code files parse | `node --check` |
| Behavior-unchanged | Gate-3 core and advisor policy contracts hold after comment-only edits | `spec-gate-core.test.mjs`, `policy-plan*.vitest.ts` |
| Hygiene | No ephemeral fix-round labels remain in code comments | `grep` sweep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Committed changed surface (`78ef96ae6b`) | Internal | Committed | The audit needs a stable target to reference by line |
| `cli-opencode` deepseek provider auth | External | Confirmed configured | The loop cannot dispatch without an authenticated provider |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A comment-only edit is found to alter behavior, or a README correction is inaccurate.
- **Procedure**: `git revert` this packet's implementation commit; the edits are comment-only and additive-Markdown, so a revert restores the prior state with no data or behavior loss.
<!-- /ANCHOR:rollback -->
