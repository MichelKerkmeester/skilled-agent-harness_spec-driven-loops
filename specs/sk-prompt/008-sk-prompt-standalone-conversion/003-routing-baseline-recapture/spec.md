---
title: "Feature Specification: Phase 3: routing-baseline-recapture"
description: "Recapture the scorer-eval ratchet pins and the routing-accuracy corpus hash that the model-alias deletion legitimately moved."
trigger_phrases:
  - "008 phase 003"
  - "sk-prompt routing-baseline-recapture"
  - "routing-baseline-recapture"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: routing-baseline-recapture

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-28 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 8 |
| **Predecessor** | 002-models-packet-deletion |
| **Successor** | 004-card-sync-guard-rewrite |
| **Handoff Criteria** | The ratchet passes at 7 of 7 and the corpus gate reports `overall_pass: true` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the sk-prompt standalone conversion.

**Scope Boundary**: The labeled corpus, which contains no small-model rows and is untouched

**Dependencies**:
- The capture script resolves the built shared dist, which is present in this checkout.
- CI has no skill-graph sqlite, so both capture and verification run in the filesystem-fallback regime the pins were taken in.

**Deliverables**:
- Remove the two model-alias rows from the holdout corpus
- Lower the delegation bucket minimum to the new fixture size
- Recapture the scorer-eval baseline through its own capture script

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The ratchet pins exact counts and the corpus files are sha256-pinned, so a deliberate capability removal reds two gates that are working correctly. Two holdout rows asserted that a bare model name routes to its executor, and the delegation bucket was pinned at 11 of 11 from a fixture that now has 9 cases.

### Purpose
Both gates are green again under pins that describe the tree as it now is, with the moved numbers recorded rather than quietly absorbed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove the two model-alias rows from the holdout corpus
- Lower the delegation bucket minimum to the new fixture size
- Recapture the scorer-eval baseline through its own capture script
- Re-pin the holdout corpus sha256 in the checked-in routing baseline

### Out of Scope
- The labeled corpus, which contains no small-model rows and is untouched
- The CI threshold arguments themselves, which are unchanged
- Any attempt to restore the removed routing capability

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/routing-accuracy/holdout-prompts.jsonl` | Modify | Remove the two rows asserting a retired capability (72 to 70) |
| `tests/parity/scorer-eval-baseline-ratchet.vitest.ts` | Modify | Lower `DELEGATION_MIN_N` from 11 to 9 |
| `scripts/routing-accuracy/scorer-eval-baseline.json` | Modify | Recaptured through the capture script |
| `.../002-baseline-capture/baseline/routing-baseline.json` | Modify | Re-pin the holdout sha256 and row count |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The ratchet passes under recaptured pins | `npx vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts` exits 0 |
| REQ-002 | Every corpus file matches its recorded hash | The CI hash-check loop reports no drift |
| REQ-003 | The routing-accuracy thresholds still hold unchanged | `score-routing-corpus.py` reports `overall_pass: true` with no threshold failures |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The zero-headroom joint counts are not spent | FT stays at 3 and FF at 1, their CI ceilings |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The ratchet passes at 7 of 7 and the corpus gate reports `overall_pass: true`
- **SC-002**: The recapture is a re-measurement, not a threshold relaxation - the CI arguments are byte-identical
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Recapturing a baseline can mask a real regression | A genuine routing loss is absorbed into a new pin | Only the two rows asserting the deleted capability were removed; the labeled corpus and its thresholds were left untouched as the independent check |
| Risk | FT and FF sit on their CI ceilings | Any added false fire fails CI | Both were re-measured after the change and are unchanged at 3 and 1 |
| Dependency | The corpus is hash-pinned in a separate spec packet | The gate exits before scoring if the pin is stale | Followed the established recapture pattern: update only the drifted hash, leave siblings untouched |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None; the phase closed against its recorded acceptance checks.
<!-- /ANCHOR:questions -->
