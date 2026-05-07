---
title: "Implementation Plan: Phase 072 sk-code scripts relocation"
description: "Move scoped sk-code root scripts into the surface-owned Webflow asset scripts folder, update textual references, and verify stale paths are removed without changing script behavior."
trigger_phrases:
  - "phase 072 plan"
  - "sk-code scripts relocation plan"
  - "webflow asset scripts"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/072-sk-code-scripts-relocation"
    last_updated_at: "2026-05-05T20:52:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed relocation plan"
    next_safe_action: "Review final diff"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/SKILL.md"
      - ".opencode/skills/sk-code/assets/webflow/scripts/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000072"
      session_id: "phase-072-sk-code-scripts-relocation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Alignment-drift scripts are generic/OpenCode alignment tooling."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 072 sk-code scripts relocation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript `.mjs`, Python, Markdown, JSON |
| **Framework** | OpenCode skill asset tree |
| **Storage** | File system only |
| **Testing** | grep inventory, path existence checks, strict spec validation |

### Overview
Relocate the targeted `sk-code` script utilities with `git mv`, using inspection to decide whether alignment-drift belongs with Webflow scripts or in a generic asset scripts folder. Then update exact textual references from the inventory and verify the old root script path is gone.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec folder selected by user: `specs/skilled-agent-orchestration/072-sk-code-scripts-relocation/`.
- [x] Scope is limited to five scripts plus old-path reference updates.
- [x] Verification commands are defined by the prompt.

### Definition of Done
- [x] All five scripts relocated.
- [x] Old root `sk-code/scripts/` directory removed.
- [x] No old-path references remain outside this packet.
- [x] `validate.sh --strict` exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surface-owned asset placement.

### Key Components
- **Webflow script assets**: Own Webflow minification and runtime verification helpers.
- **Alignment-drift validator**: Generic/OpenCode alignment tooling that belongs in a neutral asset scripts folder.
- **Reference inventory**: Drives textual path updates and stale-reference verification.

### Data Flow
The relocation flow is file-system based: inventory old references, inspect scripts, create destination, move files with `git mv`, replace exact path strings, and verify by grep plus directory checks.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-code/scripts/` | Old mixed root script folder | Remove after moving scoped files | `ls .opencode/skills/sk-code/scripts/ 2>&1` |
| `.opencode/skills/sk-code/assets/webflow/scripts/` | New Webflow script asset home | Create and receive Webflow minification scripts | `ls -la .opencode/skills/sk-code/assets/webflow/scripts/` |
| `.opencode/skills/sk-code/assets/scripts/` | Generic sk-code script asset home | Create and receive alignment-drift validator scripts | `ls -la .opencode/skills/sk-code/assets/scripts/` |
| `.opencode/` references | Consumers of script paths | Exact textual path updates only | stale-reference grep from prompt |
| Phase 072 spec packet | Audit trail and verification evidence | Create/update docs and scratch inventory | strict spec validation |

Required inventories:
- Old-path consumers: `grep -rln "sk-code/scripts/\|skill/sk-code/scripts" .opencode/ ...`.
- Destination contents: `ls -la .opencode/skills/sk-code/assets/webflow/scripts/` and `ls -la .opencode/skills/sk-code/assets/scripts/`.
- Stale path check: same grep excluding this packet.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold Level 2 packet from system-spec-kit templates.
- [x] Save initial old-path reference inventory to `scratch/initial-inventory.md`.
- [x] Inspect alignment-drift validator and test heads.

### Phase 2: Core Implementation
- [x] Create destination script folder.
- [x] Move minification scripts to Webflow asset scripts destination.
- [x] Move alignment-drift scripts to generic asset scripts destination.
- [x] Remove empty old root `scripts/` directory.
- [x] Update references in inventory batches.

### Phase 3: Verification
- [x] Verify zero stale old-path references outside this packet.
- [x] Verify scripts exist at new locations.
- [x] Verify old root script folder is removed.
- [x] Verify file modes at destination.
- [x] Run strict spec validation.
- [x] Check `SKILL.md` script/resource references still parse.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Reference scan | Old `sk-code/scripts/` strings | grep command from prompt |
| File-system verification | New and old script directories | `ls`, `rmdir` |
| Metadata validation | Phase 072 docs | `validate.sh --strict` |
| Guidance sanity | `SKILL.md` script/resource lines | `grep -E "scripts|RESOURCE_MAP" ... | head -5` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Git index | Internal | Green | `git mv` is required to preserve rename tracking. |
| system-spec-kit templates | Internal | Green | Required for packet docs and strict validation. |
| Existing `.opencode/` references | Internal | Pending inventory | Determines reference update file count. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Script paths fail verification, old folder cannot be removed, or references cannot be updated safely.
- **Procedure**: Reverse this packet's `git mv` operations, revert only this packet's textual path updates, and restore docs to "failed" status with evidence.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ----> Phase 2 (Core) ----> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20-30 minutes |
| Core Implementation | Medium | 30-60 minutes |
| Verification | Medium | 20-40 minutes |
| **Total** | | **70-130 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No runtime deployment is involved.
- [x] Scope is file relocation plus textual references.
- [ ] Initial inventory saved before replacements.

### Rollback Procedure
1. Move the five files back with `git mv`.
2. Replace new-path strings back to old paths only in files changed by this packet.
3. Restore `.opencode/skills/sk-code/scripts/` if needed.
4. Run stale-reference and strict validation checks again.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
