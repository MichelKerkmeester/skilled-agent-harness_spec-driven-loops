---
title: "Feature Specification: sk-create-diagram benchmark artifact embedding"
description: "Copy each manual-testing-playbook scenario's real HTML/SVG output into its benchmark report folder, per create-benchmark's copied-artifact contract."
trigger_phrases:
  - "benchmark report artifact embedding"
  - "diagram playbook artifact copy"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/010-benchmark-artifact-embedding"
    last_updated_at: "2026-08-12T18:40:07.000Z"
    last_updated_by: "claude"
    recent_action: "Copied 7 artifacts into report folders, documented 2 omissions"
    next_safe_action: "Move to phase 011 (reference template alignment)"
    blockers: []
    key_files:
      - "spec.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Artifact goes into the folder as artifact.<ext> (matches the source file's own extension), not renamed to a generic name — keeps the 1:1 mapping to skill-benchmark-report.json obvious."
      - "2 of 9 scenarios produce no diagram output (hub-registration verifies registry facts; onboarding-flow's correct outcome is a refusal) — documented as an intentional omission in source.md rather than silently skipped."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-create-diagram benchmark artifact embedding

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-12 |
| **Branch** | `sk-doc/0145-sk-create-diagram` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 10 of 12 |
| **Predecessor** | `../009-manual-playbook-execution/spec.md` |
| **Successor** | `../011-reference-template-alignment/spec.md` |
| **Handoff Criteria** | Every report folder with a produced diagram carries a byte-identical copy of that output; every folder without one documents why, per `create-benchmark`'s copied-artifact contract |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## PHASE CONTEXT

**Scope Boundary**: Only the 9 existing `benchmark/reports/` folders and their `source.md` files. No re-run of scenarios, no change to verdicts or evidence already recorded.

**Dependencies**: Phase 009 produced the 9 report folders and the `docs/*.html`/`.svg` output files this phase copies from.

**Deliverables**: 7 `artifact.<ext>` files (one per scenario that produced output), 9 updated `source.md` files (7 pointing at the new artifact, 2 documenting why none exists).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The operator reviewed the 9 benchmark report folders and found no copy of the actual HTML/SVG output each scenario produced — every `source.md` pointed only at `docs/*.html`, a path outside the skill package. `create-benchmark`'s own storage contract requires produced artifacts to be "copied or intentionally omitted with a documented reason" inside the report folder; this packet's reports did neither.

### Purpose

Copy each scenario's real output artifact into its own report folder as `artifact.<ext>`, and for the 2 scenarios that legitimately produce no diagram output, document that omission explicitly in `source.md` instead of leaving a silent gap.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Copy `docs/checkout-architecture.html` → `type-selection-and-routing/artifact.html`.
- Copy `docs/system-redrawn.html` → `drawio-import/artifact.html`.
- Copy `docs/support-handoff.html` → `editorial-style-and-connectors/artifact.html`.
- Copy `docs/checkout-architecture.svg` → `export-guidance/artifact.svg`.
- Copy `docs/onboarding-flow.html` → `mermaid-import/artifact.html`.
- Copy `docs/compounding-loop.html` → `primitive-variants/artifact.html`.
- Copy `docs/order-flow.html` → `create-diagram-command/artifact.html`.
- Add a `Produced artifact` row to all 9 `source.md` files (7 linking the copy, 2 documenting the omission with a stated reason).
- Independently verify every copy is byte-identical to its source.

### Out of Scope

- Re-running any of the 9 scenarios or changing any recorded verdict/evidence.
- `hub-registration` and `onboarding-flow` — no diagram output exists for either, by design (registry-verification scenario and correct-refusal scenario respectively).
- The 2 previously-documented follow-ups from phase 009 (SVG `&` escaping, missing hub-router alias).

### Aggregate File Scope

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/sk-doc/sk-create-diagram/benchmark/reports/*/artifact.{html,svg}` | Create | 7 byte-identical copies of the real scenario outputs |
| `.opencode/skills/sk-doc/sk-create-diagram/benchmark/reports/*/source.md` | Edit | 9 files — `Produced artifact` row added |
| `010-benchmark-artifact-embedding/` | Create | This phase's spec-folder history |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every report folder for a scenario that produced a diagram carries a copy of that exact output. | 7/7 `artifact.<ext>` files exist; SHA-256 matches the `docs/` source file exactly. |
| REQ-002 | Every report folder for a scenario that produced no diagram documents why, in `source.md`. | 2/2 folders (`hub-registration`, `onboarding-flow`) carry a `Produced artifact` row stating "none" plus a Boundary-section sentence naming the reason. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No existing report content (verdicts, evidence, JSON records) is altered. | `git diff` on `skill-benchmark-report.json`/`.md`, `results.csv`, `failed-runs.md`, `findings-and-recommendations.md`, `README.md` per folder shows no changes — only `source.md` and the new `artifact.*` files. |
| REQ-004 | Artifact filenames use the source's own extension, not a generic name. | `artifact.html` for HTML outputs, `artifact.svg` for the one SVG output — matches the extension of the file it was copied from. |
| REQ-005 | Every claimed copy is independently re-verified, not accepted on `cp`'s exit code alone. | SHA-256 recomputed by the orchestrator for all 7 pairs, matching phase 009/011's established evidence discipline. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 7/7 artifact copies verified byte-identical via independent SHA-256 recomputation.
- **SC-002**: 9/9 `source.md` files carry a `Produced artifact` row (7 linked, 2 documented-omission).
- **SC-003**: No pre-existing report file (JSON/CSV/MD other than `source.md`) shows a diff.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A copy could silently diverge from its source over time if `docs/*.html` is later edited. | Low | The report folder is a curated snapshot by design (per the storage contract, "a run whose result changes gets a new folder") — divergence from a later `docs/` edit is expected and correct, not a defect. |
| Dependency | Phase 009's 9 report folders and 7 real output files under `docs/` | High | All 7 source files independently confirmed to exist and match their recorded byte counts before copying. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — artifact naming and the omission-documentation approach are both resolved above.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Plan: `plan.md`
- Tasks: `tasks.md`
- Checklist: `checklist.md`
- Packet root: `../spec.md`
- Storage contract: `.opencode/skills/sk-doc/sk-create-benchmark/SKILL.md`
