---
title: "Implementation Plan: Phase 5: backfill-remaining-profiles"
description: "Author 6 remaining per-model prompt-craft profiles under sk-prompt-models/references/models/: minimax-2.7 (TIDD-EC empirical), swe-1.6 (RCAF + pre-planning contract), and deepseek-v4-pro, kimi-k2.6, qwen3.6, glm-5.1 (RCAF/medium default-unverified). All follow the canonical 6-section template; framework choices mirror model-profiles.json."
trigger_phrases:
  - "backfill profiles plan"
  - "small model profiles implementation plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/130-prompt-knowledge-layering/005-backfill-remaining-profiles"
    last_updated_at: "2026-06-02T18:04:14Z"
    last_updated_by: "agent"
    recent_action: "Phase complete"
    next_safe_action: "Proceed to phase 006-thin-and-standardize-cli-cards"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "005-backfill-remaining-profiles"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: backfill-remaining-profiles

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (documentation authoring) |
| **Framework** | 6-section per-model profile template from sk-prompt-models hub |
| **Storage** | File-based: `.opencode/skills/sk-prompt-models/references/models/` |
| **Testing** | Manual validation: file presence, frontmatter, section count, round-trip check against `model-profiles.json` |

### Overview

Phase 5 authored the 6 remaining per-model prompt-craft profiles that complete the sk-prompt-models model-craft hub. The approach was evidence-first: each profile mirrors `model-profiles.json` `recommended_frameworks` data for its model, then adds rationale, a tuned template scaffold, and per-model dispatch gotchas. One profile (minimax-2.7) is empirical, based on benchmark 120/003; the other five are default-unverified using the RCAF/medium convention default.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation hub — per-model profile files following a fixed 6-section template

### Key Components
- **minimax-2.7.md**: Empirical profile; carries the TIDD-EC + DENSE benchmark finding from 120/003; links to the minimax-m3 sibling
- **swe-1.6.md**: Defines the mandatory caller-side pre-planning contract as a hard requirement, not a suggestion
- **deepseek-v4-pro.md / kimi-k2.6.md / qwen3.6.md / glm-5.1.md**: Convention-default profiles; each tailored to its model's context window, quota pool, and per-model nuances

### Data Flow

`model-profiles.json` (DATA source of truth) → profile `recommended_frameworks` section → profile `Benchmark Evidence` section → profile `Tuned Template Snippet` → profile `Dispatch Gotchas` → caller dispatch
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-prompt-models/references/models/` | Profile directory | Added 6 new profile files | `ls` confirms all 6 files present |
| `sk-prompt/assets/model-profiles.json` | DATA source for framework choices | Unchanged (read-only for this phase) | No modifications; profiles mirror it |
| `cli-devin`, `cli-opencode` SKILL.md | Executor mechanics owner | Unchanged | Referenced via See Also; not edited |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Verified hub scaffold and `references/models/` directory in place
- [x] Read `model-profiles.json` entries for all 6 target models
- [x] Confirmed 6-section template structure from existing priority profiles

### Phase 2: Core Implementation
- [x] Authored `minimax-2.7.md` (TIDD-EC empirical, benchmark 120/003)
- [x] Authored `swe-1.6.md` (RCAF + mandatory pre-planning contract)
- [x] Authored `deepseek-v4-pro.md` (RCAF/medium, --pure flag, 64k window)
- [x] Authored `kimi-k2.6.md` (RCAF/medium, 200k large-context, hang rate)
- [x] Authored `qwen3.6.md` (RCAF/medium, 32k window, budget discipline)
- [x] Authored `glm-5.1.md` (RCAF/medium, dual-pool dispatch)

### Phase 3: Verification
- [x] Confirmed all 6 files present
- [x] Spot-checked frontmatter, H1 heading, 6 sections in each file
- [x] Verified model_id round-trip to model-profiles.json for each
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | File presence and structure | `ls`, visual inspection |
| Manual | Frontmatter validation | YAML frontmatter check per file |
| Manual | Data round-trip check | Compare `model_id` + framework values against `model-profiles.json` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sk-prompt/assets/model-profiles.json` | Internal | Green | Profiles cannot be written without accurate framework data |
| Phase 4 hub scaffold | Internal | Green | `references/models/` directory must exist before files can be added |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Profile content found to be inaccurate relative to `model-profiles.json`
- **Procedure**: Update the specific profile's sections 2–3 to match the corrected registry values; no code rollback required (documentation only)
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
