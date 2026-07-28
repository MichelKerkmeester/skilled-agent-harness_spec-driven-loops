---
title: "Implementation Plan: Phase 16: deep-review"
description: "Two-lane external deep review of the executed decommission (Grok 4.5 High and DeepSeek v4 Pro, 5 forced iterations each), followed by verify-first triage and remediation of every confirmed finding in its owning surface."
trigger_phrases:
  - "implementation"
  - "plan"
  - "deep review"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/016-deep-review"
    last_updated_at: "2026-07-28T09:34:43Z"
    last_updated_by: "claude-code"
    recent_action: "Remediated confirmed review findings across all workstreams"
    next_safe_action: "Validate the packet and push"
    blockers: []
    key_files:
      - "review/lineages/grok/review-report.md"
      - "review/lineages/deepseek/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-28-036-016-deep-review"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 16: deep-review

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript/JavaScript (spec-kit mcp-server), Markdown/JSON (docs, metadata) |
| **Framework** | deep-loop fan-out runner, cli-cursor + cli-opencode executors, vitest |
| **Storage** | Lane state under `review/lineages/{grok,deepseek}/` |
| **Testing** | typecheck, targeted vitest runs, `rg --hidden --no-ignore` residual sweep |

### Overview
Two unrelated external models audited every decommission-touched surface at forced full depth (5 iterations each, no early convergence). The grok lane returned FAIL with 5 P0, 9 P1, and 3 P2 findings; every P0/P1 was re-verified against the repository before action and all 14 confirmed. The deepseek lane returned CONDITIONAL with 1 P1 and 16 P2; its framing of an external server was refuted, but its pointers to layer-definitions and the compact tokenizer were confirmed. A self-audit sweep during remediation then caught a further class of dead tests and dead code that both lanes missed. All confirmed findings were fixed in their owning surfaces.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met — both lanes 5/5, all confirmed findings fixed
- [x] Tests passing (if applicable) — typecheck 0 errors, affected suites green
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Adversarial two-lane review with verify-first triage: every reviewer claim is a hypothesis confirmed or refuted against the repository at cited lines before any fix lands.

### Key Components
- **Fan-out runner**: one command drives both lanes concurrently with lineage-scoped writes
- **Lane reports**: per-lane `review-report.md` with P0/P1/P2 registries and workstreams
- **Triage table**: each finding carries a confirmed/refuted verdict with file:line evidence
- **Remediation workstreams**: guidance scrub, hook cleanup, test/harness retirement, docs/metadata, completion honesty

### Data Flow
Lanes read the repository and write only inside their lineage directories. Findings flow into the triage table, and confirmed items flow into fixes in the owning surfaces, never into the review child itself.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffolded the review child and authored its spec
- [x] Synced the branch before launching the fan-out so lanes audited a fixed target

### Phase 2: Core Implementation
- [x] Ran the two-lane fan-out to 5/5 iterations per lane with `--stop-policy max-iterations`
- [x] Verified every grok P0/P1 at its cited line (14/14 confirmed)
- [x] Triaged deepseek findings (1 P1 wording confirmed; external-server framing refuted; 2 extra surfaces confirmed)
- [x] Fixed all confirmed findings across the five workstreams
- [x] Self-audit sweep caught and removed dead launcher tests and dead code both lanes missed

### Phase 3: Verification
- [x] Typecheck 0 errors after remediation
- [x] Affected test files green (compact-merger, hardening, m8, hook-precompact, context-server)
- [x] Residual sweep re-run with `--hidden --no-ignore`
- [x] Completion metadata reconciled in 015 and this child
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Typecheck | spec-kit mcp-server | `tsc` (0 errors) |
| Unit | changed test files | vitest, targeted runs |
| Integration | substrate harness | direct harness run + HEAD-baseline comparison |
| Manual | residual sweep | `rg --hidden --no-ignore` with archival exclusions |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001–015 complete | Internal | Green | Nothing to review otherwise |
| cli-cursor + cli-opencode executors | Internal | Green | Lanes cannot run |
| Branch synced before fan-out | Internal | Green | Lanes would audit a moving target |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A remediation fix breaks a suite that was previously green.
- **Procedure**: Revert the single owning-surface commit; the review artifacts and triage table are unaffected.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE: Keep the plan honest about what ran and what remains.
-->
