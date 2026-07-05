---
title: "Implementation Plan: Command Pre-Route Headers"
description: "Plan and execution record for additive Resolved route headers across four deep modes."
trigger_phrases:
  - "plan"
  - "command-pre-route-headers"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/004-command-pre-route-headers"
    last_updated_at: "2026-06-30T18:37:51Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Plan executed; strict validation passed"
    next_safe_action: "Proceed to phase 004 GPT verification smoke"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-001-003-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Command Pre-Route Headers

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | OpenCode command and deep-loop workflow assets |
| **Languages** | Markdown templates, YAML workflow assets, CommonJS scripts, Vitest TypeScript tests |
| **Primary Risk** | Wrong-mode or slow role inference in GPT-backed CLI dispatch |
| **Verification** | Focused Vitest, syntax check, typecheck, static route checks, comment hygiene, alignment, strict spec validation |

### Overview

The implementation adds additive `Resolved route:` headers at the prompt seams mapped by research. Research and review use a template plus CLI positional-prompt pattern. Context uses inline prompt contracts. AI council uses a prompt-pack header and script-owned executor-config propagation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase 001 route-proof validation completed.
- [x] Phase 002 dispatch hardening completed.
- [x] Research edit map available in `../../research/research.md`.
- [x] Scope locked to phase 003 route headers and propagation.

### Definition of Done

- [x] All route-header seams updated.
- [x] Native `agent:` fields preserved.
- [x] Council route fields propagated through script-owned dispatch context.
- [x] Focused runtime checks passed.
- [x] Strict spec validation passed.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Additive prompt-contract hardening. The route is made explicit at the leaf prompt boundary without replacing native agent dispatch or removing the existing prompt body.

### Key Components

- **Research/review templates**: Carry route identity for rendered prompt packs.
- **Research/review CLI branches**: Prepend route identity to the positional `opencode run` prompt.
- **Context YAML prompt contracts**: Carry route identity for per-seat prompts and one-shot CLI seats.
- **Council round prompt**: Carries ai-council route identity before role prose.
- **Council orchestration scripts**: Default and forward route contract through `executor_config` into seat dispatch context.

### Data Flow

1. Workflow renders or assembles the mode-local prompt.
2. The route contract appears before the substantive body prose at the dispatch seam.
3. Native dispatch keeps existing `agent:` fields.
4. CLI OpenCode receives a positional prompt that begins with route identity.
5. Council script-owned dispatch receives `resolved_route_header` and `route_fields` in context.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Research and Review

- [x] Add research template route header.
- [x] Add research CLI OpenCode positional prompt prepend.
- [x] Add review template route header.
- [x] Add review CLI OpenCode positional prompt prepend.

### Phase 2: Context

- [x] Add context per-seat prompt contract route header.
- [x] Add context one-shot CLI prompt contract route header.

### Phase 3: Council

- [x] Add ai-council round prompt route header.
- [x] Add YAML executor-config route contract fields.
- [x] Add script defaults and dispatch-context propagation.
- [x] Add focused Vitest coverage for propagation.

### Phase 4: Verification

- [x] Run focused tests and static checks.
- [x] Run OpenCode quality gates.
- [x] Run strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Council route propagation through session/topic scripts | Vitest |
| Syntax | Modified CommonJS council scripts | `node --check` |
| Typecheck | Deep-loop runtime TypeScript package | `npm run typecheck` |
| Static | Header placement, context count, no council YAML `if_cli_opencode` | Node static check |
| Quality | Comment hygiene and OpenCode alignment | sk-code scripts |
| Spec | Level 2 packet validity | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 route-proof validation | Phase dependency | Complete | Phase 004 smoke would not catch wrong-mode false positives |
| Phase 002 agent dispatch hardening | Phase dependency | Complete | Prompt headers would still lack primary router reinforcement |
| `deep-loop-runtime` Vitest dependency root | Tooling | Available | Focused council tests could not run |
| Existing YAML prompt contracts | Internal | Available | Context and CLI seams could not be updated surgically |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Route headers break prompt rendering, council dispatch, or mode-local validation.
- **Procedure**: Revert only the phase 003 changes listed in `implementation-summary.md`; keep completed phase 001 and phase 002 changes intact.
- **Verification after rollback**: Rerun focused council tests, static route check adjusted for rollback expectation, and strict spec validation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Research/review headers | Phase 002 complete | Phase 004 GPT smoke |
| Context headers | Research edit map | Phase 004 GPT smoke |
| Council propagation | Council script seams available | Phase 004 council smoke |
| Verification | All edits complete | Phase 003 completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Actual Effort |
|-------|------------|---------------|
| Research/review headers | Low | Small template/YAML edits |
| Context headers | Low | Small YAML contract edits |
| Council propagation | Medium | Script defaults plus focused tests |
| Verification/docs | Medium | Template conformance plus quality gates |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-merge Checklist

- [x] Changes are confined to phase 003 scoped files and docs.
- [x] No data migration or destructive operation was introduced.
- [x] Rollback does not require reverting phase 001 or phase 002.

### Rollback Procedure

1. Remove route-header additions from the three prompt templates.
2. Restore CLI OpenCode positional prompts to direct `cat` usage for research/review.
3. Remove context prompt-contract route header lines.
4. Remove council executor-config route fields and script propagation defaults.
5. Remove focused propagation tests added for this phase.
6. Rerun the phase validation commands.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Source-only revert of the modified prompt, YAML, script, test, and spec-doc files.
<!-- /ANCHOR:enhanced-rollback -->
