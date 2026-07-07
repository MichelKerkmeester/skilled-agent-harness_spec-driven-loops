---
title: "Implementation Plan: Phase 4 — onboard implement"
description: "Relocate the flat sk-code references, assets, and scripts into shared and mode packets with deterministic git-mv movement, deterministic link repair, and link-resolution verification."
trigger_phrases:
  - "sk-code onboard implement plan"
  - "sk-code relocation plan"
  - "sk-code deterministic link repair plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/004-onboard-implement"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Documented the completed onboard-implement relocation plan"
    next_safe_action: "Proceed to 005 foldin-review to fold sk-code-review into code-review"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4 — onboard implement

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode skill markdown, assets, and scripts relocation |
| **Framework** | Claude designed the file-by-file split map and ran deterministic `git mv` relocation plus deterministic link repair; GPT-5.5 did the initial repoint pass; Claude verified with link-resolution |
| **Storage** | `.opencode/skills/sk-code/shared/` and mode packet folders under `.opencode/skills/sk-code/code-*` |
| **Testing** | Git rename tracking verification, full markdown link-resolution, non-markdown asset path spot checks, and package side-effect reversion |

### Overview
Move the existing flat `sk-code` content into the phase 003 parent-hub scaffold without authoring new content. Claude designed the file-by-file split map and executed deterministic `git mv` relocation. GPT-5.5 performed an initial repointing pass, but cross-packet relative paths remained broken. Claude then ran a deterministic old-structure-aware repair pass and verified the result with full markdown link-resolution.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 003 scaffold exists with hub and mode-packet folders.
- [x] Relocation scope isolated to flat `references/`, `assets/`, and `scripts/` content.
- [x] `benchmark/` and `manual_testing_playbook/` identified as hub-level routing test artifacts that intentionally stay at the hub.
- [x] Contract authoring and review fold-in explicitly deferred to phases 006 and 005.

### Definition of Done
- [x] All 128 files moved by `git mv` and tracked as renames.
- [x] Flat top-level `references/`, `assets/`, and `scripts/` directories removed.
- [x] Deterministic link repair fixed 111 links across 43 files.
- [x] Full markdown link-resolution reports zero broken content links.
- [x] Non-markdown asset path references spot-checked valid.
- [x] Out-of-scope `package.json` runtime side effect reverted.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Move-map-driven packet onboarding: preserve file history with `git mv`, split content by ownership into shared and mode packets, then repair links by reconstructing old source locations and mapping targets through the move-map.

### Key Components
- **Shared packet**: routing, surface detection, phase detection, universal cross-cutting rules, shared webflow/opencode rules, and universal asset patterns.
- **Implement packet**: surface authoring references and build assets for webflow, opencode, and motion.dev.
- **Quality packet**: author-side quality checks, comment hygiene, dist-staleness scripts, hooks, and checklists.
- **Verify packet**: verification references, alignment/stack-folder scripts, and verification checklists.
- **Debug packet**: debugging references and debug checklists.

### Data Flow
Old flat path -> split-map destination -> `git mv` relocation -> initial link repoint -> deterministic old-structure-aware repair -> full markdown link-resolution verification.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase affects only relocated content under `.opencode/skills/sk-code/` and removes the flat top-level source directories after movement.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-code/references/` | Flat source references | relocate and remove empty flat source | 128 total moved files tracked as renames |
| `.opencode/skills/sk-code/assets/` | Flat source assets | relocate and remove empty flat source | 128 total moved files tracked as renames |
| `.opencode/skills/sk-code/scripts/` | Flat source scripts | relocate and remove empty flat source | 128 total moved files tracked as renames |
| `.opencode/skills/sk-code/shared/` | Shared hub packet | receive 17 shared files | relocation split count |
| `.opencode/skills/sk-code/code-implement/` | Implement mode packet | receive 82 authoring/build files | relocation split count |
| `.opencode/skills/sk-code/code-quality/` | Quality mode packet | receive 16 quality files | relocation split count |
| `.opencode/skills/sk-code/code-verify/` | Verify mode packet | receive 9 verification files | relocation split count |
| `.opencode/skills/sk-code/code-debug/` | Debug mode packet | receive 4 debugging files | relocation split count |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Design the file-by-file split map for all flat references, assets, and scripts.
- [x] Mark `benchmark/` and `manual_testing_playbook/` as hub-level routing test artifacts that stay in place.
- [x] Bind phase boundaries: contract authoring belongs to phase 006 and review fold-in belongs to phase 005.

### Phase 2: Core
- [x] Move 128 files with `git mv` into `shared/`, `code-implement/`, `code-quality/`, `code-verify/`, and `code-debug/`.
- [x] Remove the now-empty flat top-level `references/`, `assets/`, and `scripts/` directories.
- [x] Run the initial GPT-5.5 repointing pass.
- [x] Run deterministic old-structure-aware link repair after the initial pass left cross-packet relative paths unresolved.

### Phase 3: Verification
- [x] Verify all 128 moves are tracked by git as renames.
- [x] Verify full markdown link-resolution reports zero broken content links.
- [x] Spot-check non-markdown asset path references as valid.
- [x] Revert the out-of-scope `package.json` runtime side effect.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Rename tracking | All 128 moved files | Git rename verification from completed relocation |
| Markdown links | Internal content links after relocation | Full markdown link-resolution check |
| Link repair | Cross-packet relative paths | Deterministic old-structure-aware repair pass |
| Asset paths | Non-markdown asset path references | Spot-checks from completed relocation |
| Scope | Package runtime side effect | Reversion verified after side effect was found |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 scaffold | Internal | Complete | Destination packets would not exist |
| Claude split-map and deterministic relocation | Internal | Complete | File ownership and history preservation would be unbound |
| GPT-5.5 initial repointing pass | Internal | Complete | Initial link repair attempt would not exist |
| Claude deterministic repair and link-resolution | Internal | Complete | Cross-packet broken links would remain |
| Phase 005 fold-in | Internal | Pending | `sk-code-review` remains standalone until next phase |
| Phase 006 contract authoring | Internal | Pending | Mode-packet `SKILL.md` files remain skeleton contracts |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Relocation or link repair fails and the content layout must return to the flat pre-move state.
- **Procedure**: Reverse the `git mv` relocation using the move map, restore the flat top-level `references/`, `assets/`, and `scripts/` directories, and restore pre-relocation relative links. Because phase 004 authored no new content, rollback is a structural move reversal plus link restoration.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
