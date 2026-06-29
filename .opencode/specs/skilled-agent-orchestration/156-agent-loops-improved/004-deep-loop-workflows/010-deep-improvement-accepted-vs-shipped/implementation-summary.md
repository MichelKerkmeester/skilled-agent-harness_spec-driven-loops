---
title: "Implementation Summary: accepted-vs-shipped promotion split"
description: "Two-phase promotion (accept vs ship) with branch-preserved failure + a new rollback-candidate.cjs, in promote-candidate.cjs (+ promotion gate/rules docs + config). 388 deep-improvement tests pass; hygiene/drift clean."
trigger_phrases:
  - "010-deep-improvement-accepted-vs-shipped summary"
  - "010-deep-improvement-accepted-vs-shipped"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/004-deep-loop-workflows/010-deep-improvement-accepted-vs-shipped"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Two-phase promotion (accept vs ship) with branch-preserved failure + a new rollback-candid"
    next_safe_action: "Proceed to the next phase in the dependency order"
    blockers: []
    key_files: [".opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs",".opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/rollback-candidate.cjs",".opencode/skills/deep-loop-workflows/deep-improvement/references/shared/promotion_gate_contract.md",".opencode/skills/deep-loop-workflows/deep-improvement/references/shared/promotion_rules.md",".opencode/skills/deep-loop-workflows/deep-improvement/assets/agent_improvement/improvement_config.json",".opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/tests/promote-candidate-benchmark.vitest.ts"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-deep-improvement-accepted-vs-shipped |
| **Completed** | 2026-06-28 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two-phase promotion (accept vs ship) with branch-preserved failure + a new rollback-candidate.cjs, in promote-candidate.cjs (+ promotion gate/rules docs + config). 388 deep-improvement tests pass; hygiene/drift clean.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs` | Modified | accepted-vs-shipped promotion split |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/rollback-candidate.cjs` | Modified | accepted-vs-shipped promotion split |
| `.opencode/skills/deep-loop-workflows/deep-improvement/references/shared/promotion_gate_contract.md` | Modified | accepted-vs-shipped promotion split |
| `.opencode/skills/deep-loop-workflows/deep-improvement/references/shared/promotion_rules.md` | Modified | accepted-vs-shipped promotion split |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/agent_improvement/improvement_config.json` | Modified | accepted-vs-shipped promotion split |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/tests/promote-candidate-benchmark.vitest.ts` | Modified | accepted-vs-shipped promotion split |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented by cli-codex (gpt-5.5 xhigh fast), scope-locked to the files above; verified with vitest + validate.sh --strict.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Followed the phase spec scope exactly | Keeps the change minimal, reviewable, and revertible per the roadmap |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Unit tests (vitest) | PASS |
| validate.sh --strict | PASS |
| Scope | Only the files above changed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

None identified.
<!-- /ANCHOR:limitations -->
