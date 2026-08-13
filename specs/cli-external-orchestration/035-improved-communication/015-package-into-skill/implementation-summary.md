---
title: "Implementation Status: Phase 015 Package Relocation Into Skill"
description: "The CLI communication projection package now lives inside its owning sk-communication skill, with rename history preserved and every skill-doc reference updated."
trigger_phrases:
  - "package-into-skill"
  - "implementation status"
  - "current state"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/015-package-into-skill"
    last_updated_at: "2026-08-13T17:10:00.000Z"
    last_updated_by: "claude"
    recent_action: "Completed the relocation evidence packet and parent wiring."
    next_safe_action: "Preserve the relocation and reference gates when the package or skill docs change."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "../spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-015-relocation-20260813"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The move renamed exactly 207 tracked package files with R-status, 0 additions, and 0 deletions."
      - "All 140 in-scope path references across 24 sk-communication documents now point to the new location."
      - "The package gate passes 289 of 289 tests from the new location."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Status: Phase 015 Package Relocation Into Skill

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-package-into-skill |
| **Status** | Complete |
| **Completed** | 2026-08-13 |
| **Completion** | 100% |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The CLI communication projection package now lives at `.opencode/skills/sk-communication/cli-communication-projection`, nested inside the skill that owns and exclusively consumes it, mirroring how system skills such as system-spec-kit bundle their code inside the skill directory. The move preserved git rename history for all 207 tracked files with zero additions and zero deletions, and every one of the 24 sk-communication skill documents now points at the new path.

### Rename-Preserving Relocation

`git mv packages/cli-communication-projection .opencode/skills/sk-communication/cli-communication-projection` renamed 207 tracked files with R-status, 0 deletions, 0 additions. The now-empty `packages/` directory was removed. `node_modules`, `dist`, and `coverage` moved with the package and remain covered by the repository's generic gitignore patterns, so no `.gitignore` change was needed.

### Skill Documentation Reference Updates

24 sk-communication documents (140 path references) were updated from `packages/cli-communication-projection` to `.opencode/skills/sk-communication/cli-communication-projection`: `README.md`, `SKILL.md`, `benchmark/README.md`, `references/package-map.md`, and the `feature-catalog/` and `manual-testing-playbook/` trees. Existing historical references under `specs/` were intentionally left unchanged as an append-only record of prior state.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `packages/cli-communication-projection/**` -> `.opencode/skills/sk-communication/cli-communication-projection/**` | Renamed (`git mv`) | Nest the package inside its owning skill; 207 files, 0 additions, 0 deletions |
| `packages/` | Removed | Delete the now-empty legacy root |
| `.opencode/skills/sk-communication/README.md`, `SKILL.md`, `benchmark/README.md`, `references/package-map.md` | Modified | Update path references to the new nested location |
| `.opencode/skills/sk-communication/feature-catalog/**`, `manual-testing-playbook/**` | Modified | Update path references to the new nested location |
| `015-package-into-skill/` | Created | Preserve complete Level-2 evidence and continuity |
| Parent and Phase 014 link surfaces | Modified | Add Phase 015 to navigation and graph truth |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The move used `git mv` to preserve rename history in one operation, then a scoped reference sweep updated every sk-communication document that named the old path. The package's completed `npm run check` receipt covers typecheck, build, public-import smoke, and 289 of 289 tests, all run from the new location, confirming no package config references a path outside the package. System-spec-kit templates and sibling packets shape this final Level-2 completion record.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Nest the package inside sk-communication rather than leave it in `packages/` | The package is owned and consumed exclusively by that skill, matching how system skills bundle their code |
| Use `git mv` instead of copy-then-delete | Preserves rename history across all 207 files instead of presenting the move as an unrelated delete and add |
| Leave historical `specs/` references unchanged | Those records are append-only and describe the package's state at the time they were written |
| Verify from the new location only | Confirming the completed gate after the move is the evidence that the relocation is functionally transparent |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Rename inventory | PASS: 207 files renamed R-status, 0 additions, 0 deletions |
| Legacy directory removal | PASS: `packages/` no longer exists |
| Skill-doc reference sweep | PASS: 140/140 references across 24 documents point to the new path |
| Historical-record integrity | PASS: existing references under `specs/` remain unchanged |
| Package alignment gate | PASS: typecheck, build, public-import smoke, and 289/289 tests from the new location; the fidelity-pipeline latency test is intermittent only under full-gate concurrent load and passed when re-run in isolation |
| Move-safety check | PASS: no package config references a path outside the package |
| Phase 015 strict validation | PASS: zero errors and zero warnings |
| Parent strict validation | PASS: zero errors and zero warnings after phase-map, transition-chain, and graph backfill |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Reference sweep is scoped to sk-communication skill documents**: Historical spec and research references under `specs/` were intentionally excluded because they are append-only prior-state records; any future documentation citing the package must use the new path.
2. **Relocation must stay in sync with future package moves**: If the package moves again, the same rename-preserving procedure and full skill-doc reference sweep apply.
3. **Full-gate latency test under concurrent load**: The fidelity-pipeline benchmark's p95 timing assertion is known-flaky when the full test gate runs under concurrent load (unrelated to this phase's changes); it passes reliably when run in isolation. Reproduce a deterministic failure in isolation before classifying it as a code defect.
<!-- /ANCHOR:limitations -->
