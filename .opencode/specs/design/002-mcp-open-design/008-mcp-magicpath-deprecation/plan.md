---
title: "Implementation Plan: mcp-magicpath deprecation"
description: "Plan for deprecating the mcp-magicpath skill: delete the skill folder, rewrite the two shared design docs onto mcp-open-design, sweep remaining live references, drop the graph sibling edges, mark the 147 install packet superseded, and validate."
trigger_phrases:
  - "mcp-magicpath deprecation plan"
  - "deprecate magicpath plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/002-mcp-open-design/008-mcp-magicpath-deprecation"
    last_updated_at: "2026-06-14T17:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Deprecated mcp-magicpath and re-centered the design protocol on mcp-open-design"
    next_safe_action: "Operator reviews the deprecation and the four skill version bumps"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-150-008-mcp-magicpath-deprecation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: mcp-magicpath deprecation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs and graph-metadata across five skills plus the skills index and one spec packet |
| **Framework** | OpenCode skill structure, sk-doc templates, house voice |
| **Storage** | `.opencode/skills/` and `.opencode/specs/skilled-agent-orchestration/147-mcp-magicpath/` |
| **Testing** | `package_skill.py --check` on the three bumped skills, grep sweeps, `validate.sh --strict` on this packet |

### Overview
Deprecate in dependency order: rewrite the two shared design docs onto mcp-open-design first so the protocol target is settled, then delete the mcp-magicpath skill folder, then sweep the remaining live references and drop the graph sibling edges, then mark the 147 install packet superseded. The three skills that change behavior or routing are version-bumped with a matching changelog each. Historical records stay untouched. The superseding transport is already proven, so this is a removal and re-centering, not an investigation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The superseding transport (mcp-open-design) is confirmed live-verified and corrected
- [x] Every live magicpath reference is located by grep across the skills and the index
- [x] Live references are separated from historical records to preserve

### Definition of Done
- [x] The mcp-magicpath skill folder is gone and no live reference remains
- [x] `package_skill.py --check` PASS on each bumped skill and `validate.sh --strict` zero errors
- [x] Three version bumps with matching changelogs and the 147 packet marked superseded
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Supersede and re-center. mcp-open-design is the single live design transport, mcp-magicpath is removed, and the shared protocol docs are rewritten so the one surviving member of the parity pair is the terminal Open Design transport. Each swept reference is classified live or historical before action.

### Key Components
- **The deleted skill**: `mcp-magicpath/` (16 files), the hosted-canvas transport that mcp-open-design supersedes.
- **The two shared design docs**: `claude_design_parity.md` (the parity protocol) and `design_generation_patterns.md` (the prompt usecase), both rewritten onto mcp-open-design.
- **The reference sweep surface**: sk-design-interface, sk-prompt, mcp-open-design, mcp-figma, and the skills index README.
- **Graph metadata**: the reciprocal sibling edges between mcp-magicpath and the other skills, dropped, with mcp-figma repointed to mcp-open-design.

### Data Flow
Rewrite the two shared docs onto mcp-open-design, delete the skill folder, sweep references and drop sibling edges across the skills and the index, mark the 147 packet superseded, then validate.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## DEPRECATION ADDENDUM: AFFECTED SURFACES

The writes are to five skills, the skills index, and one historical spec packet. No application code is touched and the MagicPath product is untouched.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/mcp-magicpath/` | Hosted-canvas design transport | Deleted | Folder absent |
| `.opencode/skills/sk-design-interface/` | Design judgment and parity protocol | Re-centered onto mcp-open-design, v1.3.0 | package check PASS, grep clean |
| `.opencode/skills/sk-prompt/` | Prompt patterns | design usecase to mcp-open-design only, v2.3.0 | package check PASS, grep clean |
| `.opencode/skills/mcp-open-design/` | Terminal design transport | magicpath mentions dropped, v1.2.0 | package check PASS, grep clean |
| `.opencode/skills/mcp-figma/` | Figma transport sibling | sibling repointed to mcp-open-design | grep clean |
| `.opencode/skills/README.md` | Skills index | magicpath entry dropped | grep clean |
| `.opencode/specs/skilled-agent-orchestration/147-mcp-magicpath/spec.md` | Install packet history | Marked superseded by 150 | supersede note present |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm mcp-open-design is the live-verified, corrected design transport to re-center onto
- [x] Grep every magicpath reference across the skills and the skills index
- [x] Classify each reference live or historical and capture the baseline package checks

### Phase 2: Implementation
- [x] Rewrite `claude_design_parity.md` onto mcp-open-design (previewUrl, get_artifact) and `design_generation_patterns.md` onto the mcp-open-design start_run usecase
- [x] Delete the mcp-magicpath skill folder
- [x] Sweep the remaining live references, drop the graph sibling edges, repoint mcp-figma to mcp-open-design, bump the three skills with changelogs, and mark the 147 packet superseded

### Phase 3: Verification
- [x] `package_skill.py --check` PASS on sk-design-interface, sk-prompt, and mcp-open-design
- [x] Grep sweep confirms no live magicpath reference, only historical records
- [x] `validate.sh --strict` on this packet reports zero errors
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Skill structure | The three bumped skill packages | `package_skill.py --check` |
| Deprecation grep | Live magicpath references across the skills and index | `grep -rniE` over `.opencode/skills/` |
| Voice | No em dashes, no prose semicolons in new prose | targeted grep |
| Spec validation | This packet's docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| mcp-open-design live transport | Input | Green | Without a live target the re-centering has nowhere to land |
| `package_skill.py` | Internal | Green | No skill-structure check |
| `validate.sh` and template-structure helper | Internal | Green | No spec validation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A live reference is found broken, a validator fails and cannot be fixed, or the deprecation is reversed.
- **Procedure**: Restore the deleted `mcp-magicpath/` folder from version control, revert the swept references and the three version bumps, and revert this packet. The change is documentation and skill-metadata only, so there is no runtime or data state to unwind.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Implementation) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Grep and classify every magicpath reference |
| Implementation | Medium | Rewrite two docs, delete one folder, sweep five skills plus the index |
| Verification | Low | Package checks, grep sweep, strict validate |
| **Total** | Medium | One focused session |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes, so no backup needed (verified) docs and metadata only deprecation
- [x] No feature flag involved (verified) skill markdown has no runtime gate
- [x] The deleted folder is recoverable from version control (verified) tracked before deletion

### Rollback Procedure
1. Restore `.opencode/skills/mcp-magicpath/` from version control.
2. Revert the swept references, the three version bumps, and the 147 supersede note.
3. Revert this packet folder and re-run `package_skill.py --check` on the affected skills.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change is documentation and skill-metadata only
<!-- /ANCHOR:enhanced-rollback -->
