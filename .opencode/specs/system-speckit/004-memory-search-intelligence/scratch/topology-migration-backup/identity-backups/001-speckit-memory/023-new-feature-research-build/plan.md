---
title: "Implementation Plan: New-Feature Research and Build"
description: "Method and verification route for the TRACK B new-feature arc: deleted-10 teachings drive research, eval-v2 is built as the measurability gate, 3 features are built default-off, the prod-mode benchmark runs and a fresh-Opus gate holds each one."
trigger_phrases:
  - "028 new feature build plan"
  - "028 eval-v2 build method"
  - "028 research to hold method"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/001-speckit-memory/023-new-feature-research-build"
    last_updated_at: "2026-07-04T17:51:04.915Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Created the new-feature build plan"
    next_safe_action: "Reconcile the cross-cutting docs to the build-and-hold outcome"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-20-plan-028-023-new-feature-research-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: New-Feature Research and Build

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript memory-search engine plus markdown documentation over a committed code state |
| **Framework** | Spec Kit spec-folder docs, the eval-v2 harness, changelogs and the timeline |
| **Storage** | Repository files, the eval corpus, git history |
| **Testing** | The eval-v2 prod-mode benchmark, strict spec validation, an HVR voice scan |

### Overview
This phase records the TRACK B arc end to end. The deleted-10 teachings from the flag-resolution reckoning were read as a research input and produced four candidate features. eval-v2 was built first as the measurability gate, because the old harness had hidden the deleted features behind eval-saturation and a new candidate measured on it would repeat that mistake. Three of the four candidates were then built default-off, benchmarked in prod mode and taken through a fresh-Opus hold decision. None earned a flip on prod-mode evidence. The plan documents that method, records the prod-mode number and next step for each held feature, surfaces the append-not-displace truncation finding and reconciles the root child map, the feature-flags doc, the changelog and the timeline to this outcome. The eval-v2 harness and the three feature implementations shipped during the build before this phase recorded the outcome.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The deleted-10 teachings are recorded and read as a research input.
- [x] eval-v2 is built with its three non-self-recall classes, the completeRecall@K metric and the dual-mode fidelity path.
- [x] The three candidate features are built default-off behind their flags.

### Definition of Done
- [x] eval-v2 is documented as built-and-kept measurability infrastructure.
- [x] Each of the three built features has a HELD disposition with a prod-mode number and a next step.
- [x] The append-not-displace truncation finding is documented prominently.
- [x] Strict validation exits 0 for the 028 root and this child.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A research-and-build arc recorded as documentation over an already-committed build-and-hold code state, with a measurability gate that is kept on its own merit.

### Key Components
- **eval-v2, the measurability gate**: three non-self-recall classes (thematic_multi_target, causal_chain, hard_negative), a completeRecall@K metric at K of 3, 5 and 8 and a dual-mode eval-vs-prod fidelity that exposed the eval-saturation gap.
- **The three built features**: deterministic-multihop, lane-champion-backfill and true-citation-emitter, each shipped default-off.
- **The fresh-Opus hold gate**: a per-feature decision on the prod-mode number that held all three.
- **The truncation finding**: the append-not-displace pattern appends to the tail and prod confidence-truncation cuts the tail, so tail-additive recall is zero at prod K.
- **The documentation reconciliation**: the root child map, the feature-flags doc, the changelog and the timeline.

### Data Flow
The deleted-10 teachings feed the research that names the candidates. eval-v2 measures each candidate in prod mode, the fresh-Opus gate reads the prod-mode number and decides hold, and the decision plus its next step propagate into the feature-flags doc, the changelog and the timeline so every surface tells the same story.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `../graph-metadata.json` | Parent child map | Add 008 to children_ids | 008 present in the children list |
| `../spec.md` | Parent phase map | Add the 008 row | Phase map lists 008 |
| `../feature-flags.md` | The five surviving switches | Add the 3 built-but-held flags and the eval-v2 note | The 3 held flags and eval-v2 appear with reasons and next steps |
| `../changelog/001-speckit-memory/changelog-001-root.md` | Memory-track rollup | Add the TRACK B milestone row | Row present with status and summary |
| `../changelog/001-speckit-memory/changelog-001-023-new-feature-research-build.md` | New | Create the TRACK B leaf | Leaf follows the canonical template |
| `../changelog/README.md` | Changelog index | Reflect the new leaf in the memory-track count and narrative | Memory-track count and narrative match |
| `../timeline.md` | Build chronology | Add the TRACK B section | The arc reads after Section G |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the deleted-10 teachings and derive the four candidate features.
- [x] Confirm eval-v2 is built with its three classes, the completeRecall@K metric and the dual-mode path.
- [x] Confirm the three feature builds are committed default-off.

### Phase 2: Core Reconciliation
- [x] Add 008 to the parent graph-metadata children_ids and the spec phase map.
- [x] Add the three built-but-held flags and the eval-v2 kept-infrastructure note to feature-flags.
- [x] Create the TRACK B leaf changelog and add the milestone row to the memory-track rollup.
- [x] Update the changelog index for the new leaf.
- [x] Add the TRACK B research-and-build arc to the timeline.

### Phase 3: Verification
- [x] Confirm every disposition traces to a prod-mode number or a structural fact.
- [x] Confirm the truncation finding reads as an architectural property, not a defect.
- [x] Run an HVR scan across the reconciled surfaces.
- [x] Run strict validation for the 028 root and this child.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Disposition trace | Per-feature prod-mode number | Read against the eval-v2 benchmark output |
| Fidelity trace | The eval-vs-prod gap | Read the eval-mode and prod-mode completeRecall@8 figures |
| HVR voice scan | Reconciled docs | Em-dash, semicolon and Oxford-comma scan |
| Cross-doc consistency | Child map, feature-flags, changelog, timeline | Read each surface for the same outcome |
| Spec validation | This child and the 028 root | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Committed eval-v2 build | Internal | Green | No measurability gate to record |
| Committed feature builds default-off | Internal | Green | The docs would describe an unbuilt state |
| The prod-mode benchmark | Internal | Green | No measured signal to hold on |
| Spec-kit validator | Internal | Green | Cannot claim phase validation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A disposition cites an eval-mode number instead of a prod-mode number, or the truncation finding reads as a defect.
- **Procedure**: Restore the prior doc text for that surface, re-trace the feature to its prod-mode benchmark figure, then re-apply the corrected disposition.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Reason |
|-------|------------|--------|
| 008 | `../007-kept-off-flag-resolution/spec.md` | The deleted-10 teachings are the research input |
| 008 | `../benchmark-status.md` | The prod-mode measurement is the deciding evidence baseline |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| eval-v2 documentation | Medium | The three classes, the metric and the fidelity gap |
| Per-feature dispositions | Medium | Three held features with prod numbers and next steps |
| Changelog and timeline | Medium | One leaf plus the rollup row and a timeline section |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- Keep the prior doc text before each reconciliation edit.
- Revert any disposition that cites an eval-mode number where a prod-mode number is the deciding evidence.
- Re-run `validate.sh --strict` on the 028 root after rollback.
<!-- /ANCHOR:enhanced-rollback -->
