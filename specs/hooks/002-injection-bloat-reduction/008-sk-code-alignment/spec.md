---
title: "Feature Specification: sk-code Alignment and README Freshness Audit"
description: "Research spec: audit whether the injection-bloat shadow-program code changes align with sk-code opencode-surface standards, and identify which code READMEs and adjacent READMEs are now stale, via a bounded 5-iteration deep-research loop."
status: complete
completion_pct: 100
trigger_phrases:
  - "sk-code alignment audit"
  - "code readme freshness"
  - "injection bloat readme sweep"
  - "opencode surface standards check"
importance_tier: "important"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/008-sk-code-alignment"
    last_updated_at: "2026-08-07T05:00:00Z"
    last_updated_by: "claude"
    recent_action: "Seeded research spec for the sk-code alignment and README freshness audit"
    next_safe_action: "Optionally apply the deferred polish items (shared candidate constant, adjacent README notes)"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs"
    session_dedup:
      fingerprint: "sha256:a78fdde9e616ab1d7e175ff50d08ebc62f5dc28006440e21c6a6857e87301cd9"
      session_id: "2026-08-07-hooks-002-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Authoritative READMEs for the changed directories are the in-directory lib/README.md, spec-gate/README.md, and ENV-REFERENCE.md; adjacent hook READMEs merely reference the behavior and were judged under-specified but not false."
---
# Feature Specification: sk-code Alignment and README Freshness Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete (audit done; must-fix findings implemented and verified) |
| **Created** | 2026-08-07 |
| **Branch** | `sk-code/0131-injection-bloat-impl` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | 007-guardrail-controls-and-activation |
| **Successor** | 009-testing-doc-alignment |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The injection-bloat shadow program (packet 002, phases 001-007) landed roughly sixteen changed code files across the `system-skill-advisor` runtime, the `system-spec-kit` Gate-3 hook adapters, and the OpenCode plugins. That code was verified for behavioral correctness (byte-parity, fail-open, epoch-floored delivery confirmation), but it has not been checked against the `sk-code` opencode-surface authoring standards, and the READMEs describing those directories may now describe stale behavior. Without an audit, alignment drift and stale documentation ship silently.

### Purpose
Run a bounded five-iteration deep-research audit that produces actionable findings on three questions: whether the changed code aligns with the `sk-code` opencode-surface standards, which code READMEs in the changed directories are now stale, and which adjacent READMEs that reference the changed behavior need updating. The audit produces findings only; the follow-on implementation applies the fixes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The code files changed by this session's injection-bloat work, checked against the `sk-code` opencode-surface standards (TypeScript/mjs/cjs authoring, comment hygiene, error handling, fail-open discipline)
- The README files that live in the changed directories, checked for statements now contradicted by the changed behavior
- Adjacent READMEs that describe the shadow-delivery or Gate-3 delivery behavior and reference it by contract

### Out of Scope
- A repo-wide README sweep beyond the changed surface and its direct references
- Changing the shadow-delivery or Gate-3 code behavior itself — it is frozen and already verified
- Activating any candidate flag or altering the fail-open defaults

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create | Synthesized findings on alignment gaps and stale READMEs |
| `research/deep-research-state.jsonl` | Create | Per-iteration externalized loop state |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The audit enumerates each changed code file and states whether it aligns with the sk-code opencode-surface standards | Every changed file has a verdict with file:line evidence for any gap |
| REQ-002 | The audit identifies every README in a changed directory that is now stale | Each stale README named with the specific statement contradicted by current behavior |
| REQ-003 | The audit identifies adjacent READMEs that reference the changed behavior and need updating | Each adjacent README named with the referenced contract and why it is now inaccurate |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Findings are categorized and prioritized for a follow-on implementation pass | Findings grouped by surface with a clear must-fix versus optional split |
| REQ-005 | The audit run is bounded and reproducible | Five iterations under `--stop-policy max-iterations`, executor and model recorded in the packet, no early convergence |
| REQ-006 | The implemented fixes leave the frozen shadow-delivery behavior unchanged | Code edits are comment-only and README edits additive; `node --check`, `spec-gate-core.test.mjs`, and the advisor policy suites pass from the final state |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` names every changed code file with an sk-code alignment verdict and file:line evidence for any gap
- **SC-002**: Every stale README in a changed directory is named with the specific contradicted statement
- **SC-003**: Every adjacent README that references the changed behavior is named with the reason it is now inaccurate
- **SC-004**: Findings are prioritized into a must-fix versus optional split ready for a follow-on implementation pass
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A small fast executor produces shallow or generic findings | Medium | Five forced iterations plus orchestrator synthesis and verification before any fix is applied |
| Risk | The audit drifts into changing frozen shadow-delivery behavior | Medium | Scope explicitly excludes behavior changes; the code is frozen and already verified |
| Dependency | The changed surface is committed and stable | High | This session's changes are committed at `78ef96ae6b` before the audit begins |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which READMEs are authoritative for each changed directory, and which merely reference the changed behavior from elsewhere?
- Does any sk-code opencode-surface standard conflict with a deliberate shadow-delivery pattern (for example, the fail-open empty catch), which should then be documented rather than "fixed"?
<!-- /ANCHOR:questions -->
