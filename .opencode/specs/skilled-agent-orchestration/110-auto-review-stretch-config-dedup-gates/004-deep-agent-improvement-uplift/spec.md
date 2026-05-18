---
title: "Phase 4: deep-agent-improvement uplift (M-3 mutation signature dedup)"
description: "Add mutation-signature dedup to deep-agent-improvement's mutation-coverage tracking. Prevents re-applying exhausted mutation types within a single packet's evaluation loop."
trigger_phrases:
  - "m3 mutation signature dedup"
  - "deep-agent-improvement uplift"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/110-auto-review-stretch-config-dedup-gates/004-deep-agent-improvement-uplift"
    last_updated_at: "2026-05-16T11:00:00Z"
    last_updated_by: "claude-opus-4-7-110-scaffold"
    recent_action: "phase_4_spec_scaffolded_awaiting_council"
    next_safe_action: "await_council"
    blockers:
      - "Awaiting council verdict"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-16-110-004-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: M-3 Mutation signature dedup for deep-agent-improvement

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned — gated on council approval |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Phase Parent** | `110-auto-review-stretch-config-dedup-gates` |
| **Source teaching** | M-3 from `106/research/review-report.md` §5 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
deep-agent-improvement evaluates candidate agent mutations across 5 dimensions × multiple mutation types per dimension. Without dedup, the same mutation (e.g. "expand error-handling rule in PROCESS dimension targeting Phase-2-execution section") can be re-attempted in subsequent iterations even after a prior iteration already tried and rejected it. This wastes evaluation compute and pollutes the candidate ranking with redundant attempts.

### Purpose (REVISED per council §10.6)

Adopt upstream auto-review's marker-based dedup pattern (same family as 110/003 H-7) but applied to mutation signatures: `sha256(dimension + mutationType + targetSection + normalized_body_64chars)`. **Authoritative storage: `mutation-coverage.json`** (where the existing `mutations` + `exhausted` arrays live per council §6 evidence at `mutation-coverage.cjs:59-67` and `:80-92`). The reducer at `reduce-state.cjs` MUST be updated to handle the new signature field; `manual_testing_playbook/07--runtime-truth/034-replay-consumer.md` MUST be updated to verify the replay consumer respects signatures.

Skip mutation types whose signature already appears in prior iterations of the SAME packet (not cross-packet).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (REVISED per council §10.6)

- Modify `.opencode/skills/deep-agent-improvement/scripts/mutation-coverage.cjs` to:
  - Compute mutation signature at proposal time
  - **Append signature to the existing `mutations` array entries in `mutation-coverage.json`** (NOT `agent-improvement-state.jsonl` — council §10.6: signature lives where coverage data lives)
  - Before proposing a new mutation, check prior signatures — skip if duplicate, with skip-reason `EXHAUSTED-FROM: iter-NNN`
- **Modify reducer `.opencode/skills/deep-agent-improvement/scripts/reduce-state.cjs`** to recognize the new signature field when consuming `mutation-coverage.json`
- Update `.opencode/skills/deep-agent-improvement/manual_testing_playbook/07--runtime-truth/034-replay-consumer.md` to verify replay consumer respects signature dedup
- Document signature scheme in `.opencode/skills/deep-agent-improvement/SKILL.md`
- Add env-var `DEEP_AGENT_IMPROVEMENT_SKIP_DEDUP=1` to disable dedup for forced re-evaluation

### Out of Scope
- Cross-packet mutation history (single-packet scope)
- Mutation type taxonomy expansion (use existing types)
- Touching the 5-dimension scoring rubric

### Files to Change

| File | Change Type | Description |
|------|-------------|-------------|
| `.opencode/skills/deep-agent-improvement/scripts/mutation-coverage.cjs` | Modify | Add signature compute + state-check + skip-with-reason; signature stored in `mutation-coverage.json` mutations array |
| `.opencode/skills/deep-agent-improvement/scripts/reduce-state.cjs` | Modify | Recognize new signature field when consuming `mutation-coverage.json` |
| `.opencode/skills/deep-agent-improvement/SKILL.md` | Modify | Document signature scheme + env-var bypass + skip-reason format + authoritative storage location |
| `.opencode/skills/deep-agent-improvement/manual_testing_playbook/07--runtime-truth/034-replay-consumer.md` | Modify | Verify replay consumer respects signature dedup |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Mutation signature deterministic + content-based | Same mutation in different iter → same hash |
| REQ-002 | Prior signatures aggregated from `agent-improvement-state.jsonl` | Pre-proposal check works |
| REQ-003 | Duplicate skipped with `EXHAUSTED-FROM: iter-NNN` skip-reason | Audit trail preserved |
| REQ-004 | Dedup bypass via env var | Operator can force re-evaluation |
| REQ-005 | Backward-compat: state records lacking signature field treated as legacy | No dedup applied to legacy records |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: mutation-coverage.cjs emits signature in state.
- **SC-002**: Pre-proposal check skips duplicates.
- **SC-003**: SKILL.md documents the scheme + bypass.
- **SC-004**: Smoke test: 2 iterations propose same mutation → 2nd marked EXHAUSTED.
- **SC-005**: Strict validate exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Risk | Impact | Mitigation |
|------|------|--------|-----------|
| Risk | Signature too aggressive (collides across slightly-different mutations) | False-positive skip of legitimate variants | Include 64 chars of mutation body in signature input |
| Risk | Dedup blocks legitimate retry after rule changes | Operator stuck | Env-var bypass `DEEP_AGENT_IMPROVEMENT_SKIP_DEDUP=1` |
| Risk | State file format change breaks existing tooling | Tooling breakage | Backward-compat: missing signature treated as legacy, no dedup |
| Risk | Cross-packet pollution (mutation tried in packet A then proposed in packet B) | Stale "exhausted" skip | Single-packet scope only; signatures isolated per-state-file |
| Dependency | Existing `agent-improvement-state.jsonl` writer | Need to append signature field | Backward-compat path covers absence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

1. **Q1**: Should signature include `outcome` (passed/failed) from prior iter? Currently no — dedup applies regardless of prior outcome.
2. **Q2**: Should "EXHAUSTED" status reset after N iterations or stay permanent within the packet? Council to advise.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:iteration-plan -->
## 8. ITERATION PLAN

| # | Step |
|---|------|
| 1 | Read mutation-coverage.cjs to understand current proposal flow |
| 2 | Add signature compute function + state-aware skip logic |
| 3 | Update agent-improvement-state.jsonl writer to include signature field |
| 4 | Document scheme + env-var bypass in SKILL.md |
| 5 | Smoke test: 2 iterations of same mutation → 2nd skipped |
| 6 | Strict validate + commit + push |
<!-- /ANCHOR:iteration-plan -->
