---
title: "Feature Specification: New-Feature Research and Build"
description: "The TRACK B arc: the deleted-10 teachings drove research that found 4 candidates, eval-v2 was built and kept as the measurability gate, 3 features were built default-off and fresh-Opus held, and the append-not-displace truncation finding deferred the only path to a tail-additive flip."
trigger_phrases:
  - "028 new feature research build"
  - "028 track b new feature outcome"
  - "028 eval-v2 measurability gate"
  - "028 append not displace truncation finding"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/001-speckit-memory/023-new-feature-research-build"
    last_updated_at: "2026-07-04T17:51:04.915Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Created the new-feature phase folder, eval-v2 kept and 3 features held"
    next_safe_action: "Use this phase as the authoritative TRACK B new-feature outcome for 028"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-20-028-023-new-feature-research-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The deleted-10 teachings drove the research that found the 4 candidates."
      - "eval-v2 was built and kept as measurability infrastructure independent of any feature flip."
      - "The 3 built features are held default-off, none flips on prod-mode evidence."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: New-Feature Research and Build

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-20 |
| **Parent Spec** | ../spec.md |
| **Parent Packet** | `system-speckit/029-memory-search-intelligence` |
| **Phase** | 008 of 008 |
| **Predecessor** | ../007-kept-off-flag-resolution/spec.md |
| **Source decisions** | `../benchmark-status.md`, `../feature-flags.md`, `../before-vs-after.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The flag-resolution reckoning deleted ten default-off switches, and each deletion taught something specific about why a lever fails to move live recall. Those teachings were a research input, not a dead end. They pointed at a small set of new candidate features that might earn a flip where the deleted ten did not. The campaign needed a fair way to measure a new candidate before trusting it, and the old eval harness had hidden the deleted features behind eval-saturation, so a measurement built on it would repeat the same mistake.

### Purpose
Record the research-to-eval-v2-to-build-to-benchmark-to-fresh-Opus-hold arc for the TRACK B new features. Document the eval-v2 measurability gate that was built and kept, the three features that were built default-off and fresh-Opus held, the prod-mode numbers that held each one, the per-feature next step and the append-not-displace truncation finding that explains why a tail-additive feature reads as zero at prod K by construction.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The research arc that turned the deleted-10 teachings into 4 candidate features.
- eval-v2 as built-and-kept measurability infrastructure: the three non-self-recall classes, the completeRecall@K metric and the dual-mode eval-vs-prod fidelity that exposed the eval-saturation gap.
- The three features built default-off and fresh-Opus held, each with its prod-mode number and next step.
- The append-not-displace truncation finding and why it makes tail-additive recall zero at prod K.
- The documentation reconciliation of the root child map, the feature-flags doc, the 001-speckit-memory changelog and the timeline to this outcome.

### Out of Scope
- Flipping any of the three held features default-on.
- The eval-v2 implementation code, which shipped during the build and is unchanged here.
- The truncation-exemption probe, the citation-emitter label fix and the lane-champion retirement, which are recorded as next steps not executed here.
- Packet 030 and any concurrent-session files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `../graph-metadata.json` | Modify | Add 008 to the parent children_ids |
| `../spec.md` | Modify | Add 008 to the phase documentation map |
| `../feature-flags.md` | Modify | Add the 3 built-but-held flags and note eval-v2 as kept infrastructure |
| `../changelog/001-speckit-memory/changelog-001-root.md` | Modify | Add the TRACK B new-feature milestone row |
| `../changelog/001-speckit-memory/changelog-001-023-new-feature-research-build.md` | Create | Leaf changelog for the TRACK B arc |
| `../changelog/README.md` | Modify | Reflect the new TRACK B leaf in the memory-track count and narrative |
| `../timeline.md` | Modify | Add the TRACK B research-and-build arc as a new section |
| `spec.md` | Create | Defines the new-feature outcome scope and the per-feature disposition |
| `plan.md` | Create | Defines the research-to-build-to-hold method and verification route |
| `tasks.md` | Create | Records the build and documentation tasks |
| `checklist.md` | Create | Records the verification items |
| `implementation-summary.md` | Create | Records the executed arc and its evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | eval-v2 is recorded as built and kept | The three non-self-recall classes, the completeRecall@K metric and the dual-mode fidelity gap are documented as kept infrastructure |
| REQ-002 | Every new feature has a final disposition | Each of the three built features is recorded HELD default-off with its prod-mode number |
| REQ-003 | The truncation finding is prominent | The append-not-displace pattern and the zero-at-prod-K-by-construction consequence are documented as the key architectural finding |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Each disposition carries a next step | Multihop, lane-champion and citation-emitter each have a one-line next step |
| REQ-005 | The eval-saturation headline is recorded | The eval-mode 0.212 versus prod-mode 0.036 completeRecall@8 gap is documented as the fidelity finding |
| REQ-006 | The honest framing holds | A held feature reads as held on a measured zero or an under-counted label, not as a failure to build |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- eval-v2 is documented as kept measurability infrastructure with its three classes, the completeRecall@K metric and the eval-vs-prod fidelity gap.
- The three built features are each recorded HELD default-off with a prod-mode number and a next step.
- The append-not-displace truncation finding is documented prominently as the reason tail-additive recall is zero at prod K.
- The root child map, the feature-flags doc, the 001-speckit-memory changelog and the timeline agree with this outcome.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/029-memory-search-intelligence --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A held feature reads as a build failure | A reader discards usable infrastructure | Frame each hold on its measured zero or under-counted label, keep eval-v2 as a kept win |
| Risk | The truncation finding reads as a bug | A reader treats a by-construction zero as a defect | Record it as an architectural property of the append-not-displace pattern at prod K |
| Dependency | eval-v2 and the prod-mode benchmark | The dispositions rest on them | Both ran before the fresh-Opus hold decided |
| Dependency | The deleted-10 teachings | The research input came from them | The flag-resolution reckoning closed before this research opened |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- Every disposition must trace to a prod-mode number or a structural fact, not an eval-mode number that eval-saturation inflates.
- The eval-vs-prod fidelity gap must stay visible so no held feature is re-read as a flip on eval-mode evidence.
- All docs follow the HVR voice: no em-dashes, no prose semicolons, no Oxford commas, no artifact ids in prose.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- A feature whose appended hop-2 docs land at the tail reads as zero at prod K. Deterministic multihop is the case, prod completeRecall delta 0.000 because prod truncation cuts the tail.
- A feature that duplicates an existing reducer earns no keep. Lane-champion backfill is the case, structurally redundant with RRF which already absorbs every lane champion.
- A feature that produces the right shadow output but cannot be scored positive reads as held, not failed. The true-citation emitter is the case, a clean default-off shadow whose positive label depends on the assistant echoing the memory id so positives are under-counted.
- A measurability tool earns a keep on its own merit even when no feature it measured flips. eval-v2 is the case, kept for the fidelity gap it exposed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Rating | Notes |
|-----------|--------|-------|
| File count | Medium | One new changelog leaf plus the root child map, feature-flags, changelog index and timeline |
| Risk | Low | Documentation over a committed build-and-hold code state |
| Verification | Medium | Strict validation plus an HVR scan across the reconciled surfaces |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None for this phase. Whether a tail-additive feature can earn a flip through an injection-ahead-of-truncation displacement decision is the open question carried into the multihop next step, deferred out of this phase.
<!-- /ANCHOR:questions -->
