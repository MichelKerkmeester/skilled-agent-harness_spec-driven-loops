---
title: "Implementation Plan: mcp-open-design generation-flow correction"
description: "Plan for correcting the mcp-open-design skill to the live-verified multi-turn generation reality: rewrite the run flow, separate file-add from design creation, add od run verbs and the HTTP API surface, bump to v1.1.0, and validate."
trigger_phrases:
  - "mcp-open-design correction plan"
  - "open design generation flow plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-mcp-open-design/007-mcp-open-design-generation-flow-correction"
    last_updated_at: "2026-06-14T16:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Corrected mcp-open-design generation flow to multi-turn, bumped to v1.1.0"
    next_safe_action: "Operator reviews the corrected skill and v1.1.0.0 changelog"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:ad889ddd1028d3c07bc7e2c10cc5af101ea1757a4c9ebc2d57fe68017d68ffc5"
      session_id: "session-150-007-mcp-open-design-generation-flow-correction"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: mcp-open-design generation-flow correction

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs (SKILL.md, references, feature catalog, playbook, README, changelog, graph-metadata) |
| **Framework** | OpenCode skill structure, sk-doc templates, house voice |
| **Storage** | `.opencode/skills/mcp-open-design/` |
| **Testing** | `package_skill.py --check`, grep sweeps, `validate.sh --strict` on this packet |

### Overview
Correct the skill in priority order: generation-is-multi-turn plus artifacts-create separation first, then the `od ui respond` linkage, then the `od run` verbs, then the HTTP API surface. Preserve every confirmed fact. Bump to v1.1.0 and document the change in a changelog. The reality is supplied as proven live facts, so this is a documentation-correction task, not an investigation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The live-verified reality is enumerated as concrete facts
- [x] The skill's current (incorrect) claims are located by grep
- [x] The correction priority order is fixed

### Definition of Done
- [x] No doc claims a one-shot run yields a finished visible design
- [x] `package_skill.py --check` PASS and `validate.sh --strict` zero errors
- [x] Version bumped to 1.1.0 with a v1.1.0.0 changelog
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Source-of-truth correction. The live-verified facts are the source of truth, and each affected doc is edited to match, with confirmed and inferred claims tagged so a reader can tell them apart.

### Key Components
- **SKILL.md**: the runtime contract. Carries the multi-turn Run Direction, the artifacts callout, and the ALWAYS/NEVER rules that lock the correction in.
- **references/**: `od_cli_reference.md` (verbs, transport, HTTP), `tool_surface.md` (the tool surface and generation flow), `mcp_wiring.md` (the confirmed config shape).
- **feature_catalog/ and manual_testing_playbook/**: the capability inventory and the operator scenario, both moved to the multi-turn flow.

### Data Flow
Live-verified facts to SKILL.md and references to feature catalog and playbook to README and changelog to graph-metadata, then validation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The only writes are to the `mcp-open-design` skill and this packet's control docs. No application code is touched.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/mcp-open-design/SKILL.md` | Runtime contract | Corrected to multi-turn, version 1.1.0 | package check PASS, grep clean |
| `.opencode/skills/mcp-open-design/references/` | CLI, tools, wiring detail | Corrected and extended | grep clean, package check PASS |
| `.opencode/skills/mcp-open-design/feature_catalog/` | Capability inventory | Run feature corrected | package check PASS |
| `.opencode/skills/mcp-open-design/manual_testing_playbook/` | Operator scenario | RUN-001 to multi-turn | package check PASS |
| `.opencode/skills/mcp-open-design/changelog/` | Version history | v1.1.0.0 added | file present |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the skill in full and locate every one-shot and artifacts-create claim
- [x] Confirm the Level 2 template anchors and the fingerprint algorithm
- [x] Capture the baseline `package_skill.py --check` result

### Phase 2: Core Implementation
- [x] Correct SKILL.md, tool_surface.md, od_cli_reference.md, mcp_wiring.md
- [x] Correct the feature catalog and the manual testing playbook
- [x] Correct the README, add the v1.1.0.0 changelog, bump the version, update graph-metadata

### Phase 3: Verification
- [x] `package_skill.py --check` PASS and word-count clean
- [x] Grep sweep confirms no remaining one-shot claim
- [x] `validate.sh --strict` on this packet reports zero errors
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Skill structure | The whole skill package | `package_skill.py --check` |
| Regression grep | One-shot and artifacts-create claims | `grep -rniE` over the skill |
| Voice | No em dashes, no prose semicolons in new prose | targeted grep |
| Spec validation | This packet's docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Live generation test facts | Input | Green | Without them the correction has no source of truth |
| `package_skill.py` | Internal | Green | No skill-structure check |
| `validate.sh` and template-structure helper | Internal | Green | No spec validation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A correction is found inaccurate or the validators fail and cannot be fixed.
- **Procedure**: Revert the edited skill files and this packet to their pre-change state. The change is documentation only, so there is no runtime or data state to unwind. The v1.0.0 MCP wiring entry remains valid throughout.
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
| Setup | Low | Read the skill and locate every claim |
| Implementation | Medium | Edit eleven files to the multi-turn reality |
| Verification | Low | Package check, grep sweep, strict validate |
| **Total** | Medium | One focused session |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes, so no backup needed (verified) docs-only correction
- [x] No feature flag involved (verified) skill markdown has no runtime gate
- [x] v1.0.0 wiring entry stays valid (verified) config shape unchanged

### Rollback Procedure
1. Revert the eleven edited skill files to their v1.0.0 state.
2. Revert this packet folder.
3. Re-run `package_skill.py --check` to confirm the skill is valid again.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change is documentation only
<!-- /ANCHOR:enhanced-rollback -->
