---
title: "Implementation Plan: Phase 5 — foldin review"
description: "Adapt the folded review package identity to code-review mode, preserve the review doctrine, retain the legacy alias, and document the completed phase."
trigger_phrases:
  - "sk-code foldin review plan"
  - "code-review mode identity plan"
  - "sk-code-review alias plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/005-foldin-review"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Documented the completed review fold-in plan"
    next_safe_action: "phase 006 build-remaining-modes"
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
# Implementation Plan: Phase 5 — foldin review

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
| **Language/Stack** | OpenCode skill markdown and JSON routing metadata |
| **Framework** | `sk-code` parent hub with nested mode packets |
| **Storage** | `.opencode/skills/sk-code/code-review/` and hub routing metadata |
| **Testing** | Manual self-check only; command validation intentionally not run in this phase per instruction |

### Overview
Adapt the folded review package from standalone `sk-code-review` identity to the nested `code-review` mode identity. Preserve the review doctrine verbatim, drop `Edit` from the mode's allowed tools, keep `Write` for review cache outputs, retain `sk-code-review` as a legacy alias in three hub routing surfaces, and document the phase with completed Level 1 artifacts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `sk-code/code-review/` already contains the folded review package.
- [x] Standalone `sk-code-review/graph-metadata.json` is already deleted.
- [x] Doctrine-preservation boundary is explicit: identity and cross-reference edits only.
- [x] The legacy alias needs preservation until phase 009 cutover.

### Definition of Done
- [x] `SKILL.md` frontmatter and self-identity use `code-review` mode.
- [x] `README.md` human-facing identity and paths use `code-review` mode.
- [x] Review mode `allowed-tools` excludes `Edit` and no doctrine/Edit conflict is present.
- [x] `sk-code-review` alias is present in mode registry aliases, hub router review aliases, and hub trigger phrases.
- [x] Phase 005 docs record the cohesive fold-in facts and the untouched pre-existing playbook typo.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Identity adaptation after cohesive fold-in: keep the review package content intact, update only the mode-facing identity surfaces, and retain the retired standalone name as a legacy alias until cutover.

### Key Components
- **Review mode packet**: `code-review/SKILL.md`, `README.md`, references, assets, scripts, changelog, and manual-testing-playbook content.
- **Hub registry**: `mode-registry.json` carries the review mode alias list.
- **Hub router**: `hub-router.json` carries lexical review alias keywords.
- **Hub graph metadata**: `graph-metadata.json` carries trigger phrases for the single advisor identity.

### Data Flow
Standalone `sk-code-review` package -> cohesive physical move into `sk-code/code-review/` -> standalone graph metadata deletion -> mode identity adaptation -> legacy alias preservation -> phase documentation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase affects only the folded review mode packet, the three requested hub alias surfaces, and the approved 005 phase docs.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-code/code-review/SKILL.md` | Runtime review mode contract | adapt identity/frontmatter/cross-references | self-check for identity and allowed-tools |
| `.opencode/skills/sk-code/code-review/README.md` | Human-facing review mode guide | adapt identity and current paths | self-check for legacy standalone path removal outside alias/cache names |
| `.opencode/skills/sk-code/mode-registry.json` | Mode registry | append legacy alias | `sk-code-review` appears in review aliases |
| `.opencode/skills/sk-code/hub-router.json` | Hub lexical router | append legacy alias keyword | `sk-code-review` appears in review-aliases keywords |
| `.opencode/skills/sk-code/graph-metadata.json` | Single hub advisor identity | append trigger phrase only | `sk-code-review` appears in derived trigger phrases |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the physical fold-in is already complete.
- [x] Confirm the standalone advisor identity is already de-registered by deleting `sk-code-review/graph-metadata.json`.
- [x] Bind the doctrine-preservation and scope-lock constraints.

### Phase 2: Core
- [x] Adapt `code-review/SKILL.md` frontmatter, keywords, self-identity, allowed tools, and sibling cross-references.
- [x] Adapt `code-review/README.md` identity, usage text, related-sibling navigation, and path examples.
- [x] Add the legacy `sk-code-review` alias in the registry, router, and hub trigger phrases.

### Phase 3: Verification
- [x] Confirm the review doctrine still describes findings-first, non-mutating review.
- [x] Confirm no body rule requires applying edits.
- [x] Confirm the pre-existing playbook typo is recorded and untouched.
- [x] Confirm no forbidden validation, build, npm, or git command was run.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Identity self-check | `SKILL.md` and `README.md` | Direct read and targeted text search |
| Alias self-check | Registry, router, hub graph metadata | Direct read and targeted text search |
| Doctrine preservation | Review body and README substance | Manual comparison against allowed identity/cross-reference edits |
| Scope lock | Changelog and playbook typo | No edit performed to excluded surfaces |
| Command restraint | User-forbidden commands | No git, build, validation, or npm command executed |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 004 relocation | Internal | Complete | Review fold-in would not have a populated parent-hub layout |
| Cohesive review package move | Internal | Complete | `code-review` mode would lack the folded doctrine package |
| Standalone graph metadata deletion | Internal | Complete | Advisor would still see two review identities |
| Phase 006 build-remaining-modes | Internal | Pending | Remaining mode contracts still need build-out |
| Phase 009 cutover | Internal | Pending | Legacy alias must remain until cutover |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Identity adaptation causes routing or documentation confusion before phase 006.
- **Procedure**: Revert the identity and alias edits in the five touched hub/review files while leaving the physical fold-in and de-registration state unchanged unless a later rollback explicitly approves restoring the standalone skill identity.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
