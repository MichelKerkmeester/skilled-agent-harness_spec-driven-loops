---
title: "Verification Checklist: Command Rollout-Mode Resolution"
description: "Verification evidence for deciding the deep/* rollout mode and clearing the stale contracts."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/019-risky-followup-remediation/002-command-rollout-mode-resolution"
    last_updated_at: "2026-08-26T11:05:01.338Z"
    last_updated_by: "claude"
    recent_action: "Authored the rollout-mode checklist"
    next_safe_action: "Execute Phase 1"
---
# Verification Checklist: Command Rollout-Mode Resolution

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `resolveMode` traced to its mode source
  - **Evidence**: the `fix`/`fallback` selector in `render-command-contract.cjs` identified
- [ ] CHK-002 [P0] Intended default decided with a cited source of truth
  - **Evidence**: a `decision` note names the mode + where it comes from
- [ ] CHK-003 [P1] Stale source docs confirmed as intended content
  - **Evidence**: the deep/* source docs' current body is the one to compile

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P1] The config/test edit is minimal and matches the decision
  - **Evidence**: only the mode default or the `resolveMode` expectation changes
- [ ] CHK-011 [P1] Recompile touches only the compiled contracts
  - **Evidence**: `git status` shows only `deep-*.contract.md` regenerated

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `check-contract-drift` passes
  - **Evidence**: `vitest run` green; no `STALE_SOURCE_DIGEST`
- [ ] CHK-021 [P0] `render-command-contract` passes
  - **Evidence**: `resolveMode('deep/review')` equals the decided mode
- [ ] CHK-022 [P1] `legacy-projections` still passes; whole-suite delta clean
  - **Evidence**: whole-suite run vs the 017 baseline

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-024 [P0] No unintended behavior change
  - **Evidence**: the rendered body matches the decided mode; any change is approved
- [ ] CHK-025 [P1] All three deep/* contracts fresh
  - **Evidence**: review, research, ai-council digests match after recompile

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P1] No unrelated file changed
  - **Evidence**: the staged diff is the compiled contracts + one config/test

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] The mode decision is recorded
  - **Evidence**: `plan.md` Phase 1 carries the decision + its source

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Scoped diff — compiled contracts + one config/test
  - **Evidence**: `git status` shows no unrelated change

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 0/5 |
| P1 Items | 6 | 0/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: TBD
**Verified By**: TBD

<!-- /ANCHOR:summary -->
