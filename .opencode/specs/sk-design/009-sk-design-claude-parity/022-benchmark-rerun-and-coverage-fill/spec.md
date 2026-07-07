---
title: "Feature Specification: Phase 022 - Benchmark Rerun & Manual-Testing Coverage Fill"
description: "Reruns the sk-design Lane C skill-benchmark (router + live mode) after phase 021's validator/agent fixes, then audits manual_testing_playbook coverage per mode and parent hub, authoring 4 new scenarios for confirmed real gaps."
trigger_phrases:
  - "benchmark rerun coverage fill"
  - "phase 022 sk-design"
  - "manual testing playbook coverage audit"
  - "PB-007 AI-004 MG-004 HM-004"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/022-benchmark-rerun-and-coverage-fill"
    last_updated_at: "2026-07-07T13:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec.md"
    next_safe_action: "Author plan.md, tasks.md, checklist.md, implementation-summary.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "benchmark-coverage-022"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 022 - Benchmark Rerun & Manual-Testing Coverage Fill

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 021 rewrote `design-command-surface-check.mjs` and fixed the remaining 020 deep-research findings, but the Lane C skill-benchmark had not been re-run since before that work, so there was no fresh evidence it didn't regress anything. Separately, the operator asked whether the `manual_testing_playbook` has enough scenarios per mode and the parent hub to manually test through `cli-opencode` — a question no one had answered rigorously since the transport mode was added in phase 018.

### Purpose

Rerun both benchmark trace modes (router for a fast deterministic confirmation, live for the real dispatch baseline) to confirm phase 021 introduced no regression, then run a genuine coverage audit — one independent agent per mode plus one for the parent hub, each judging adequacy against the mode's own registry properties and documented boundaries, not just scenario count — and author new scenarios only for confirmed real gaps.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rerun the router-mode and live-mode Lane C skill-benchmark against sk-design, twice for live mode (once before, once after the coverage-fill additions) to capture both the phase-021 regression check and the final post-coverage-fill baseline.
- Run a 7-way parallel coverage audit (one agent per registry mode + one for the parent hub) judging whether `manual_testing_playbook` scenarios are adequate for manual `cli-opencode` testing of that target, using each mode's actual registry properties (toolSurface, backendKind, aliases, documented boundaries) as the adequacy bar, not scenario count alone.
- Synthesize the 7 raw audit reports into one deduplicated, non-colliding final scenario list, rejecting weak or already-covered recommendations.
- Author the confirmed new scenarios, matching each category folder's exact existing contract shape.
- Sync the root index (`manual_testing_playbook.md`): category tables, cross-reference index, critical-path list, totals, and `README.md`'s stale scenario-count line.

### Out of Scope

- Re-litigating the phase-018/019 architecture decisions (transport packetKind, mandatory-pairing mechanism) — this phase only tests them are documented, not decided.
- Fixing `MR-002`/`MR-003`/`MR-004`'s live-mode `modeAScore: 50` — an already-investigated, pre-existing browser-harness-availability artifact per phase 019's implementation-summary, unrelated to this phase's work.
- Adding scenarios for gaps judged NOT real by the synthesis step (see Known Limitations in `implementation-summary.md` for the one dropped recommendation and why).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/sk-design/manual_testing_playbook/06--parity-behavior/interface-variation-set-selection-proof.md` | Create | `PB-007` |
| `.opencode/skills/sk-design/manual_testing_playbook/02--advisor-integration/code-review-routes-skcode.md` | Create | `AI-004` |
| `.opencode/skills/sk-design/manual_testing_playbook/04--md-generator-pipeline/brief-only-authoring-boundary.md` | Create | `MG-004` |
| `.opencode/skills/sk-design/manual_testing_playbook/08--hub-manager-intake/design-mode-pairing-before-run.md` | Create | `HM-004` |
| `.opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md` | Edit | Category tables, cross-reference index, critical-path list, totals, coverage notes; version bump |
| `.opencode/skills/sk-design/README.md` | Edit | Stale "33-scenario" playbook description line |
| `.opencode/skills/sk-design/benchmark/after-021-validator-rewrite/` | Create | Fresh live-mode + router-mode baseline |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Router-mode benchmark confirms no regression from phase 021 | `PASS`, aggregate unchanged at 100/100 |
| REQ-002 | Live-mode benchmark confirms no regression from phase 021 | `PASS`, aggregate consistent with phase 019's prior baseline (93/100) |
| REQ-003 | Every mode + the parent hub gets an independent adequacy judgment | 7 completed audit reports, each with `adequate` boolean and reasoning grounded in real registry/SKILL.md reads |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | New scenarios only for genuine, real gaps | Synthesis step explicitly rejects redundant/weak recommendations with a documented reason |
| REQ-005 | New scenarios match the exact existing contract shape per category | Each authoring agent reads 2+ real sibling files before writing, not assumed |
| REQ-006 | Root index stays internally consistent after the additions | Totals, critical-path list, and cross-reference index all recompute correctly (37 total, 16 critical-path, 10 candidates) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** both benchmark trace modes re-run, **Then** neither regresses versus its last known baseline.
- **SC-002**: **Given** the coverage audit completes, **Then** every mode + parent hub has a documented adequacy judgment, and every authored scenario traces to a specific, real, cited gap.
- **SC-003**: **Given** the root index is read after the update, **Then** its totals and cross-reference index are internally consistent with the 4 new files on disk.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Parallel audit agents propose colliding scenario IDs | Low | Synthesis step explicitly resolves collisions before authoring; confirmed zero collisions in the actual run (one candidate PB-007 dropped as redundant, freeing the ID for the other) |
| Risk | New scenarios test a gap that isn't actually real (audit agent overreach) | Low-Medium | Synthesis step is adversarial by design ("be skeptical — more coverage alone is not a justification") and did reject one full recommendation as duplicate of an already-existing nested-packet scenario |
| Dependency | Phase 021's validator rewrite and finding fixes | High | This phase's benchmark rerun is specifically to confirm that work didn't regress anything |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- `PB-007` and `HM-004` are marked "Candidate for operator confirmation" for critical-path status, matching the existing convention for `PB-004`-`PB-006` and `HM-001`-`HM-003` (all Candidate). Promoting them to confirmed critical-path is an operator decision, not made in this phase.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: The 7-agent-audit-then-synthesize pattern used here (independent judgment per target, adversarial reconciliation, author-only-confirmed-gaps) is reusable precedent for future coverage audits on this or other parent-hub skills.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### State Transitions
- A future 7th mode would need its own audit agent added to the same pattern; nothing here hardcodes "6 modes" beyond the explicit `MODES` list a maintainer would extend.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 4 new scenario files + root-index sync + 2 benchmark reruns |
| Risk | 4/25 | Additive-only playbook work; no registry or runtime logic touched |
| Research | 8/20 | 7-way independent coverage audit against real registry/SKILL.md sources, synthesized and deduplicated |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None - see section 7.

---

## RELATED DOCUMENTS

- **Predecessor Phase**: `../021-command-surface-validator-and-agent-parity/` (the fixes this phase's benchmark rerun confirms)
- **Precedent**: `../019-transport-mode-benchmark-coverage/` (the last playbook-coverage phase, same benchmark rerun pattern)
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
