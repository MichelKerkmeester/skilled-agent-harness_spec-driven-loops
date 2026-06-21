---
title: "Implementation Plan: sk-design-interface evolution"
description: "Plan record for the shipped sk-design-interface v1.1.0 de-vendor: remove the MIT ui-ux-pro-max data and scripts, drop the MIT notices (data first, notices second), keep the Apache-2.0 base, and wire the Open Design integration through the live-read-only claude_design_parity.md loop. Already delivered as commit b12ffd3d76."
trigger_phrases:
  - "sk-design-interface de-vendor plan"
  - "ui-ux-pro-max removal plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-mcp-open-design/003-sk-design-interface-evolution"
    last_updated_at: "2026-06-14T16:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded the executed approach for the shipped v1.1.0 de-vendor"
    next_safe_action: "Operator reviews the record, then phase 004 validation follows"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:35ccd786a12fcbb1e6385af41ae5cac63dd570cd1368369af76ec4ca912b0295"
      session_id: "session-150-003-sk-design-interface-evolution"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-design-interface evolution

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs plus removed Python scripts and CSV data |
| **Framework** | OpenCode skill structure, sk-doc templates, house voice |
| **Storage** | `.opencode/skills/sk-design-interface/` |
| **Testing** | `package_skill.py --check`, grep for MIT residue, `validate.sh --strict` on this packet |

### Overview
De-vendor `sk-design-interface` from the MIT `ui-ux-pro-max` repo and integrate it with `mcp-open-design`. Run the licensing cleanup in the legally safe order: delete the MIT-derived data and scripts first, then remove the MIT notices, keeping the Apache-2.0 base and `LICENSE.txt`. Reframe the grounding around live Open Design reads through the shared `claude_design_parity.md` loop, never caching that content. Bump to v1.1.0 with a changelog. This plan records the approach that shipped as commit `b12ffd3d76`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The de-vendor sequence (data first, notices second) is fixed
- [x] The `mcp-open-design` skill exists to ground live reads against
- [x] The kept-Apache-base requirement is confirmed (design_principles.md is Apache content)

### Definition of Done
- [x] No MIT-derived data, scripts, or notices remain, and the skill is Apache-2.0 only
- [x] The Open Design integration reads live and caches nothing
- [x] `package_skill.py --check` PASS and the skill validates clean, version 1.1.0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Ordered de-vendor plus shared-loop integration. The licensing-safe order drives the removal, and the cross-skill `claude_design_parity.md` loop is the seam through which the judgment skill consumes the transport skill's live reads.

### Key Components
- **The removal set**: the nine MIT CSVs, the data README, and the `design_search` scripts (deleted first), then `LICENSE-ui-ux-pro-max.txt` and `THIRD-PARTY-NOTICES.md`.
- **The kept Apache base**: `LICENSE.txt` and the verbatim `design_principles.md`.
- **The integration seam**: `claude_design_parity.md`, reframed so grounding reads Open Design systems live via `mcp-open-design` and never caches them, with `design_inventory.md` updated to match.

### Data Flow
Delete data and scripts to delete MIT notices to reframe parity loop and inventory to update SKILL.md, catalog, playbook to bump version and changelog to graph-metadata, then validation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The only writes were to the `sk-design-interface` skill and (in this packet) its control docs. No application code outside the skill was touched.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-design-interface/assets/data/` | Vendored MIT data | Deleted first | files gone, grep clean |
| `.opencode/skills/sk-design-interface/scripts/` | Scripts over vendored data | Deleted | files gone |
| `.opencode/skills/sk-design-interface/LICENSE-ui-ux-pro-max.txt`, `THIRD-PARTY-NOTICES.md` | MIT notices | Deleted after the data | files gone |
| `.opencode/skills/sk-design-interface/references/claude_design_parity.md` | Cross-skill integration seam | Open Design live-read integration | grep clean, package check PASS |
| `.opencode/skills/sk-design-interface/SKILL.md` | Runtime contract | Apache-2.0 only, version 1.1.0 | package check PASS |
| `.opencode/skills/sk-design-interface/changelog/` | Version history | v1.1.0.0 added | file present |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the de-vendor sequence (data first, MIT notices second) from phase 001
- [x] Confirm the Apache base must be kept (design_principles.md is verbatim Apache content)
- [x] Confirm `mcp-open-design` is available to ground live reads against

### Phase 2: Core Implementation
- [x] Delete the nine MIT CSVs, the data README, and the `design_search` scripts
- [x] Delete `LICENSE-ui-ux-pro-max.txt` and `THIRD-PARTY-NOTICES.md` after the data
- [x] Reframe `claude_design_parity.md` and `design_inventory.md` to live Open Design reads, update SKILL.md, catalog, playbook, bump to 1.1.0, add the changelog and graph-metadata

### Phase 3: Verification
- [x] `package_skill.py --check` PASS
- [x] Grep confirms no MIT-derived data, script, or notice residue
- [x] `validate.sh --strict` on this packet reports zero errors
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Skill structure | The whole skill package | `package_skill.py --check` |
| Licensing grep | MIT residue (data, scripts, notices) | `grep -rniE` over the skill |
| Integration review | Live-read-only Open Design grounding | manual review of claude_design_parity.md |
| Spec validation | This packet's docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `mcp-open-design` skill (phase 002) | Internal | Green | The live-read integration has nothing to ground against |
| The shared `claude_design_parity.md` loop | Internal | Green | No seam between the judgment and transport skills |
| `package_skill.py` | Internal | Green | No skill-structure check |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The de-vendor is found incorrect or the skill fails its structure check and cannot be fixed.
- **Procedure**: Revert commit `b12ffd3d76`, which restores the removed data, scripts, and MIT notices and reverts the integration. The change is documentation and asset removal only, so there is no runtime or data state to unwind.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Implementation) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 001 research, phase 002 skill | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Confirm the sequence and the kept base |
| Implementation | Medium | Delete the MIT set in order and reframe the integration |
| Verification | Low | Package check, licensing grep, strict validate |
| **Total** | Medium | One focused session |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migrations, so no backup needed (verified) asset removal plus doc edits
- [x] No feature flag involved (verified) skill markdown has no runtime gate
- [x] The Apache base is retained (verified) LICENSE.txt and design_principles.md kept

### Rollback Procedure
1. Revert commit `b12ffd3d76` to restore the removed data, scripts, and MIT notices.
2. Re-run `package_skill.py --check` to confirm the skill is valid again.
3. Confirm the parity-loop integration reverted with it.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change is documentation and asset removal only
<!-- /ANCHOR:enhanced-rollback -->
