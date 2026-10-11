---
title: "Feature Specification: Routing parity CI"
description: "Block CI on the advisor divergence ratchet, pin its scoring clock, widen the holdout independence check, and state the ratchet regime; record R2, R4, R6, R7 and R9 as closed."
trigger_phrases:
  - "routing parity ci"
  - "phase 4 routing parity ci"
  - "divergence ratchet ci"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Routing parity CI

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-11 |
| **Branch** | `worktrees/111-open-ends-integration` (scaffold); the builder works in its own worktree branched from the scaffold commit |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-doc-and-catalog-truth |
| **Successor** | None |
| **Handoff Criteria** | Every criterion in `goal.md` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the open ends remediation. It builds R1, R3, R5 and R8 from `specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/004-routing-evaluation/research/research.md` and records R2, R4, R6, R7 and R9 as closed.

**Scope Boundary**: The `golden-prompt-gate` job in `.github/workflows/routing-registry-drift.yml` and the advisor's parity tests. No scorer, floor or ledger entry changes.

**Dependencies**:
- `local-native-divergence-ratchet.vitest.ts` and `holdout-independent.vitest.ts`, extended in place.

**Deliverables**:
- A blocking ratchet step, a pinned clock, a widened independence check run in CI, and a regime header.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
No workflow runs the divergence ratchet, so a new unledgered divergence between the Python and native scorers never fails a push. The ratchet's scoring clock is not pinned, the holdout independence check covers one tuning surface of several, and the ratchet's header does not say it shows harness-regime parity only.

### Purpose
A new scorer divergence or holdout overlap fails CI, and a reader of a green ratchet knows what it proves.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R1, R3, R5 and R8, as written in the ledger below.

### Out of Scope
- R2, R4, R6, R7 and R9: build-nothing decisions in the research. R7's advice to leave admission warn-only is partly superseded: since phase 019, the deep-loop hub's admission blocks in CI (`.github/workflows/routing-registry-drift.yml:181`), while the other hubs stay warn-only. Its other half still holds: no parity or evaluation gate goes behind the admission step.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/workflows/routing-registry-drift.yml` | Modify | R1 blocking ratchet step; R5 run the independence check |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts` | Modify | R3 pinned clock, R8 header |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts` | Modify | R5 every scoring surface, with an allowed-overlap map |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The ratchet blocks in the `golden-prompt-gate` job, outside the `--warn-only` admission step | The step has no `continue-on-error`, and `actionlint` is clean |
| REQ-002 | Every build row is Fixed | Each row's ledger line names the command that shows the change |
| REQ-003 | Every row in the recommendation ledger ends Fixed with a command proof or Closed with a written reason | The ledger lines in `implementation-summary.md` follow the format above, one per row |
| REQ-004 | Changed behavior has tests that fail before the change | Each Tests table line shows a non-zero exit before and exit 0 after |
| REQ-005 | Each touched skill is bumped once, with a changelog entry | One new file under `.skilled/skills/<skill>/changelog/` and one `version:` change in its `SKILL.md` per touched skill |

### Recommendation Ledger: Build (4 rows)

| ID | Recommendation | Evidence | Move |
|----|----------------|----------|------|
| R1 | Run the existing divergence ratchet as a blocking step in the `golden-prompt-gate` job, next to the baseline ratchet, and never behind the `--warn-only` admission step. It passes 6/6 today in 5.0 s, so wiring it starts green | `.github/workflows/routing-registry-drift.yml:268`, `.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:31`, `.skilled/bin/compiled-route-admission.cjs:104` | Extend in place |
| R3 | Pin the scoring clock in the divergence ratchet the way the baseline ratchet does, so a ledgered top-1 cannot flip with the calendar alone | `.skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:182`, `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs:60`, `.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:200` | Extend in place |
| R5 | Widen the independence check in `holdout-independent.vitest.ts` from one corpus to every surface that scores the holdout's source fixtures, with a declared allowed-overlap map (for example, holdout-harder may overlap the lane-weight sweep and the divergence ratchet), and run it in CI | `.skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:92`, `.skilled/skills/system-skill-advisor/runtime/tests/parity/holdout-independent.vitest.ts:108`, `.skilled/skills/system-skill-advisor/runtime/tests/scorer/lane-weight-sweep.vitest.ts:153` | Extend in place |
| R8 | State the regime in the divergence ratchet's header: it compares the local Python scorer with the in-process native scorer under VITEST fixture vectors, so a pass shows harness-regime parity, not live-daemon parity | `.skilled/skills/system-skill-advisor/runtime/tests/parity/local-native-divergence-ratchet.vitest.ts:5`, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:111` | Extend in place |

### Recommendation Ledger: Closed (5 rows)

| ID | Recommendation | Why it is closed |
|----|----------------|------------------|
| R2 | Keep the parity predicate as it is: strict top-1 with abstention normalized to `none`, failing on the ratchet's five ledger rules and on a missing Python. Do not add confidence or lower-rank comparison | Build nothing, per the research and prevent-overengineering: the predicate and its failure contract already exist |
| R4 | Treat `holdout-prompts.jsonl` and its floors as the held-out evaluation set, and keep the 17+5 battery as a smoke test only. Grow the holdout only through a reviewed re-baseline, with real hook telemetry as the next source | Build nothing, per the research and prevent-overengineering: the frozen holdout and its CI floor already exist |
| R6 | Record an exact 0.82 tie that flips top-1 as a reviewed ledger entry, and never move a floor to break it | Build nothing, per the research and prevent-overengineering: the ledger already absorbs exact tie flips |
| R7 | Leave hub admission warn-only and keep every parity or evaluation gate out of that step. Each gets its own blocking step | Build nothing, per the research and prevent-overengineering. Partly superseded: the deep-loop hub's admission already blocks in CI after phase 019; R1 still keeps the ratchet out of the warn-only step |
| R9 | Do not cite the battery's Python mode as cross-path parity: it calls `--force-native`, which compares two native clients. Use the ratchet, whose Python side is the local scorer | Build nothing, per the research and prevent-overengineering: only the reading of the battery changes |

### Ledger format

The builder records every row above in `implementation-summary.md`, one line each, in this shape, so the goal criteria can count them:

- `| <ID> | Fixed | <the command that proves it, in backticks, and what it printed> |`
- `| <ID> | Closed | <the written reason, naming prevent-overengineering or the operator decision> |`

Changed behavior gets a test that fails before the change and passes after it, recorded in a Tests table in the same file:

- `| T<n> | <test file or command> | before: exit <non-zero> | after: exit 0 |`
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 9 ledger rows are Fixed or Closed in `implementation-summary.md`.
- **SC-002**: The ratchet passes with the system clock moved forward, and the widened independence check fails on an injected overlap.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Python in the CI job | The ratchet fails on a missing Python by design | Use the job's existing Python setup, or add one in the same step |
| Risk | 001 changes `build-holdout.mjs` (F44) in the same skill | Low | Different files; each child bumps the skill once |
| Risk | Other 021 builders bump the same skill in parallel | Med | Version numbers collide when the four branches merge; the integrator renumbers, and each child still bumps once |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
