---
title: "Feature Specification: Phase 072 sk-code scripts relocation"
description: "Relocate root-level sk-code script utilities into the Webflow asset tree, inspect the alignment-drift validator scope, update path references, and verify no stale sk-code/scripts references remain."
trigger_phrases:
  - "phase 072"
  - "sk-code scripts relocation"
  - "webflow script assets"
  - "alignment drift validator"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/009-sk-code-scripts-relocation"
    last_updated_at: "2026-05-05T20:52:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed script relocation"
    next_safe_action: "Review final diff"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/scripts/minify-webflow.mjs"
      - ".opencode/skills/sk-code/scripts/test-minified-runtime.mjs"
      - ".opencode/skills/sk-code/scripts/verify-minification.mjs"
      - ".opencode/skills/sk-code/scripts/verify_alignment_drift.py"
      - ".opencode/skills/sk-code/scripts/test_verify_alignment_drift.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000072"
      session_id: "phase-072-sk-code-scripts-relocation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "verify_alignment_drift.py is generic/OpenCode alignment tooling, not Webflow/CDN-specific."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 072 sk-code scripts relocation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.opencode/skills/sk-code/scripts/` currently mixes stack-specific Webflow build utilities with the root of the `sk-code` skill. That makes the root harder to scan and weakens the existing `assets/<surface>/` ownership model for surface-specific tooling.

### Purpose
Move the five targeted script files to the correct asset-owned home, update all references to the new paths, and leave no stale references to the old root `sk-code/scripts/` path outside this packet's historical notes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create the Phase 072 Level 2 packet and ADR.
- Inventory references to `sk-code/scripts/` and `skill/sk-code/scripts`.
- Inspect `verify_alignment_drift.py` and its test to decide whether they are Webflow-specific or generic.
- Relocate the five named scripts with `git mv`.
- Update textual references to the old paths in `.opencode/` files discovered by inventory.
- Verify the old root scripts directory is removed.

### Out of Scope
- Refactoring script contents or behavior - the requested change is relocation only.
- Moving non-target scripts if additional files appear in the old folder - those are findings to surface.
- Updating unrelated documentation that does not reference the old script paths.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/scripts/minify-webflow.mjs` | Move | Relocate Webflow JS minification utility. |
| `.opencode/skills/sk-code/scripts/test-minified-runtime.mjs` | Move | Relocate minified runtime smoke test utility. |
| `.opencode/skills/sk-code/scripts/verify-minification.mjs` | Move | Relocate minification correctness verifier. |
| `.opencode/skills/sk-code/scripts/verify_alignment_drift.py` | Move | Relocate after inspection determines destination. |
| `.opencode/skills/sk-code/scripts/test_verify_alignment_drift.py` | Move | Relocate with the validator. |
| `.opencode/skills/sk-code/**` | Modify | Update references to moved scripts and script folder guidance. |
| `.opencode/**/*.md|json|yaml|toml|ts|js|mjs|py|sh` | Modify if matched | Update only old-path references from the inventory. |
| `specs/sk-code/z_archive/009-sk-code-scripts-relocation/*` | Create/Modify | Planning, ADR, scratch inventory, checklist, and completion summary. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Relocate the five scoped scripts with `git mv`. | `git status --short` shows renames from the old script folder to the chosen destination. |
| REQ-002 | Preserve script contents and executable bits. | `ls -la` at the destination shows files present with retained modes; no script content is intentionally deleted. |
| REQ-003 | Remove stale old-path references. | Verification grep for `sk-code/scripts/` and `skill/sk-code/scripts` returns zero hits outside this packet. |
| REQ-004 | Remove the old root scripts directory if empty. | `ls .opencode/skills/sk-code/scripts/` returns "No such file or directory". |
| REQ-005 | Validate the spec packet strictly. | `validate.sh specs/sk-code/z_archive/009-sk-code-scripts-relocation --strict` exits 0. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Document alignment-drift destination rationale in ADR-001. | `decision-record.md` records the inspection verdict and destination. |
| REQ-007 | Save initial reference inventory. | `scratch/initial-inventory.md` contains the command and matched files. |
| REQ-008 | Update sk-code routing and verification guidance. | `SKILL.md` no longer points to the old root script folder. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All five scoped scripts exist in their selected destination. Met.
- **SC-002**: `.opencode/skills/sk-code/scripts/` is gone. Met.
- **SC-003**: No old script-path references remain outside `072-sk-code-scripts-relocation`. Met.
- **SC-004**: ADR-001 explains why the selected destination is correct. Met.
- **SC-005**: Strict spec validation exits 0. Met.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing dirty worktree | Harder to isolate this packet's changes | Touch only scoped files and report changed files clearly. |
| Risk | Broad textual replacements | Could alter historical notes or unrelated paths | Replace only exact old path strings and exclude this packet from zero-hit verification. |
| Risk | Alignment validator scope unclear before inspection | Could land in wrong asset tree | Read validator/test heads before moving and document the evidence in ADR. |
| Risk | Spec folder symlink | User path `specs/` resolves to `.opencode/specs/` | Use the requested `specs/...` path in commands; report the symlinked physical path if relevant. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Relocation must preserve script contents and executable metadata.
- **NFR-R02**: Verification commands must be run from the repository root with current paths.

### Maintainability
- **NFR-M01**: Stack-specific tooling should be co-located under `assets/<surface>/scripts/`.
- **NFR-M02**: Root `sk-code` guidance should not advertise a generic `scripts/` folder after relocation.

### Scope Control
- **NFR-SC01**: Only path references and relocation metadata may change outside the spec packet.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### File System Boundaries
- Old `scripts/` folder contains unexpected files: stop removal, list contents, and report as a finding.
- `specs/` symlink resolves to `.opencode/specs/`: use the user-facing `specs/...` path consistently.

### Reference Boundaries
- Broad folder references without filenames: update to `sk-code/assets/webflow/scripts/` when they refer to the relocated tooling.
- Historical references inside this packet: allowed for inventory and ADR context, excluded from stale-reference verification.

### Metadata Boundaries
- `description.json` and `graph-metadata.json` must match the final packet path and status after completion.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Five script moves plus reference updates across `.opencode/`. |
| Risk | 14/25 | Path drift risk is real, but behavior should be unchanged. |
| Research | 8/20 | Requires inspection of alignment-drift purpose and reference inventory. |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. Alignment-drift destination resolved to `.opencode/skills/sk-code/assets/scripts/`, because the validator describes OpenCode codebases and recurring multi-language alignment checks rather than Webflow/CDN behavior.
<!-- /ANCHOR:questions -->
