---
title: "Feature Specification: card-relocation-and-guard"
description: "Relocate the canonical cli_prompt_quality_card.md from sk-prompt to the sk-prompt-small-model hub, repoint ~15 consumer references, fix the card's own links, and update the sync guard's canonical path."
trigger_phrases:
  - "card relocation"
  - "canonical card hub"
  - "sync guard canonical path"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "130-prompt-knowledge-layering/013-card-relocation-and-guard"
    last_updated_at: "2026-06-03T11:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Card moved to hub; refs + guard repointed"
    next_safe_action: "Validate then commit phase 013"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-small-model/assets/cli_prompt_quality_card.md"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e02c3e95-f865-4fec-8ff8-0a7907486924"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Card destination = the hub (single canonical), locked at plan approval"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: card-relocation-and-guard

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-03 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 012-cli-doc-alignment |
| **Successor** | None |
| **Handoff Criteria** | Card lives in the hub; ~15 consumers + the card's own links + the guard's canonical path repointed; sk-prompt forkable-clean; guard green; validate --strict exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Phase 13 (final) of spec 130. The canonical CLI quality card lived in `sk-prompt`, which is meant
to be a forkable, generic framework engine. The card is CLI-dispatch-specific, so it moves to the
`sk-prompt-small-model` hub. This phase reverses what phase 009 pointed at sk-prompt and rewrites
(does not discard) the sync guard 009 built.

**Scope boundary**: the card file (git rename), the ~15 consumer references, the card's own
outbound links, `sk-prompt`'s graph-metadata, and the guard's canonical-path comment.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`cli_prompt_quality_card.md` (model overrides, precedence, per-cli mirrors) lived inside `sk-prompt`,
coupling the generic framework engine to CLI-dispatch specifics and blocking a clean fork. ~15
active files pointed at the sk-prompt path; the guard's canonical-location comment named sk-prompt.

### Purpose
Make `sk-prompt` forkable-clean (generic frameworks + CLEAR + DEPTH only) by relocating the card to
the hub, with every consumer + the card's own links + the guard repointed and still green.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `git mv` `sk-prompt/assets/cli_prompt_quality_card.md` → `sk-prompt-small-model/assets/cli_prompt_quality_card.md`.
- Repoint ~15 consumer refs (5 cli SKILL.md, 5 cli cards, hub SKILL.md, `cli-devin/references/context-budget.md`).
- Fix the card's own outbound links (framework defs → `../../sk-prompt/references/`).
- Clean `sk-prompt/graph-metadata.json` of the card (enhance_when, key_files, entities, source_docs).
- Update the guard's canonical-path comment; version bumps + changelogs (sk-prompt, hub, advisor).

### Out of Scope
- The 5 cli skills' version bumps for the mechanical pointer repoint (recorded in the card-move changelog).
- Hub/cli structural alignment (phases 010-012).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
None.

### P1 - Required
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Card relocated | Card at the hub; git tracks a rename; sk-prompt no longer carries it |
| REQ-002 | All refs repointed | No active skill file references the old sk-prompt card path; card's own links resolve |
| REQ-003 | Guard still works | Guard green; canonical-path comment updated; hook + CI unchanged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep` finds 0 active skill files referencing `sk-prompt/assets/cli_prompt_quality_card`.
- **SC-002**: card + its links resolve; `sk-prompt/graph-metadata.json` valid + card-free.
- **SC-003**: card-sync guard green; `validate.sh --recursive --strict` exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Repoint misses a consumer or the card's own links break | Med | Comprehensive grep + per-link resolution check; all verified |
| Risk | Guard logic depends on the card's path | Low | Guard is path-agnostic (filename + table-absence checks); only the comment changed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Card destination (hub) locked at plan approval.
<!-- /ANCHOR:questions -->
