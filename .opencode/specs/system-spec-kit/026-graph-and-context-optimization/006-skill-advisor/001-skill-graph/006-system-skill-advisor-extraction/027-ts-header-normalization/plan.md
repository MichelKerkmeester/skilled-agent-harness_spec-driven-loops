---
title: "Implementation Plan: TypeScript Header Normalization"
description: "Normalize TypeScript source module headers found by the packet 026 sk-code audit."
trigger_phrases:
  - "027"
  - "ts header normalization"
  - "plan"
importance_tier: "high"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/027-ts-header-normalization"
    last_updated_at: "2026-05-15T12:04:51Z"
    last_updated_by: "codex"
    recent_action: "Closed packet 026 sk-code follow-on ledger"
    next_safe_action: "Use verification evidence before any future expansion"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: TypeScript Header Normalization

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Close packet 027 by applying the smallest code or evidence change that satisfies the packet 026 audit ledger. The implementation is annotation/header-oriented and avoids functional refactors.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Command / Evidence | Required Result |
|------|--------------------|-----------------|
| Audit ledger | Parsed `audit-report.md` | Packet bucket count captured. |
| Typecheck | Advisor and spec-kit TypeScript checks | PASS. |
| Ledger closure | Local 121-row checker | Packet 027 failures = 0. |
| Spec validation | `validate.sh <packet> --strict` | PASS. |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

No architecture changes. The packet modifies file prologues or classification evidence only; tool boundaries and package imports remain intact.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work | Status |
|-------|------|--------|
| 1 | Read audit and sk-code references. | Complete |
| 2 | Apply scoped packet edits or evidence review. | Complete |
| 3 | Run typecheck, tests, ledger checker, and strict validation. | Complete except parent validation final pass runs after parent metadata update. |
| 4 | Commit packet-specific scope. | Pending until staging. |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Run `npm run typecheck` in `system-skill-advisor/mcp_server`.
- Run `npx tsc --noEmit` in `system-spec-kit/mcp_server`.
- Run advisor vitest and memory vitest regression checks.
- Run packet strict validation after doc metadata refresh.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Use | Status |
|------------|-----|--------|
| sk-code OpenCode references | Header/type policy | Read |
| packet 026 audit report | Violation source of truth | Read |
| system-spec-kit templates | Level 2 docs | Used |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the packet commit to remove only this packet's docs and scoped code prologue changes. No database or generated runtime state is part of the packet commit.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

- Packet 027 runs before 028 because TypeScript headers may affect declaration/source alignment.
- Packet 030 runs after header packets because it is a semantic review of explicit type usage.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Effort | Notes |
|-----------|--------|-------|
| Audit bucketing | Medium | 121 findings parsed from markdown table. |
| Code edits | Medium | Mechanical but broad. |
| Verification | Medium | Multi-package test/typecheck gates. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Rollback is packet-local: reset the specific commit and rerun the two typechecks to confirm the prior baseline.
<!-- /ANCHOR:enhanced-rollback -->
