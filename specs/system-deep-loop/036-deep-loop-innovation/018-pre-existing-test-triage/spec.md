---
title: "Feature Specification: Pre-Existing Runtime Test-Failure Triage"
description: "Triage the 10 pre-existing system-deep-loop runtime test failures that predate the 016/017 work: fix the one cleanly-correct data drift (a stale sk-prompt census path), and classify the rest as environment-only or risky-unrelated with recommendations."
trigger_phrases:
  - "pre-existing test failures triage"
  - "deep-loop baseline test failures"
  - "sk-prompt census path fix"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/018-pre-existing-test-triage"
    last_updated_at: "2026-08-26T10:03:52.975Z"
    last_updated_by: "claude"
    recent_action: "Triaged the pre-existing failures; fixed the sk-prompt census drift"
    next_safe_action: "Commit the census fix + triage; push"
    blockers: []
    key_files:
      - "implementation-summary.md"
    completion_pct: 80
    open_questions: []
    answered_questions:
      - "Fix all pre-existing? No — operator chose to fix the clean one and scope the rest separately."
---
# Feature Specification: Pre-Existing Runtime Test-Failure Triage

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-26 |
| **Baseline** | 10 test files failing before the 016/017 work |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 017 remediation established a clean whole-suite gate but left 10 pre-existing test failures untouched — they were failing before any of that work and are independent of it. They are a mix: some are environment-only (a locale not installed, live-CLI stress tests, timeout and temp-dir-race flakes) and cannot be fixed by code here; others are real but sit in unrelated subsystems (an sk-prompt census path, a command rollout-mode config, a cross-skill dependency-version pin) where a blind fix is risky.

### Purpose

Investigate all 10, fix the one that is cleanly correct and low-risk (a stale `sk-prompt` census path), and record a precise, actionable classification of the rest so they can be tackled deliberately rather than rushed before a push.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Fix the stale `sk-prompt/prompt-models` → `sk-prompt/sk-prompt-models` path in `001-.../003-baseline-taxonomy-and-state-census/state-backend-census.json` (matches disk + the projection manifest).
- Classify the remaining 9 failures as environment-only or risky-unrelated, with the specific root cause and a recommendation each.

### Out of Scope

- The dependency-version alignment (better-sqlite3 12.10.0 vs system-spec-kit 12.11.1) — a cross-skill npm change.
- The command rollout-mode question (`fix` vs `fallback`) — recompiling flips it; needs a decision.
- Environment remediation (installing the `tr_TR` locale, authing the devin/CLI binaries, bumping test timeouts).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-.../003-baseline-taxonomy-and-state-census/state-backend-census.json` | Modify | Correct the stale sk-prompt path |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The sk-prompt census path matches disk and the manifest | `legacy-projections.test.ts` passes; the census `resolvedPath` equals the manifest `pathTemplate`. |
| REQ-002 | The remaining 9 failures are classified with root cause | Each is labelled environment-only or risky-unrelated with a specific cause and recommendation. |
| REQ-003 | No unrelated file is changed | The scoped diff is the single census string plus this packet's docs; no runtime code is touched. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `legacy-projections.test.ts` passes (15/15) after the census fix.
- **SC-002**: The census JSON remains valid.
- **SC-003**: The triage of the other 9 failures is recorded with actionable detail.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing a census file in another packet | Cross-packet change | The change is a data correction matching disk + manifest; verified by the test |
| Dependency | The projection manifest as source of truth | Defines the correct path | Confirmed disk and manifest both use `sk-prompt-models` |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether to pursue the deferred risky fixes (dependency alignment, rollout mode) is an operator decision for a follow-up.

<!-- /ANCHOR:questions -->
