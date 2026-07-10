---
title: "Implementation Plan: card-relocation-and-guard"
description: "Move the canonical card to the hub, repoint consumers + the card's links + the guard, leaving sk-prompt forkable-clean."
trigger_phrases:
  - "card relocation plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/105-prompt-knowledge-layering/013-card-relocation-and-guard"
    last_updated_at: "2026-06-03T11:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored phase 013 plan"
    next_safe_action: "Validate then commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e02c3e95-f865-4fec-8ff8-0a7907486924"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: card-relocation-and-guard

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown card + JSON metadata + one Bash guard |
| **Framework** | git rename; the phase-009 sync guard |
| **Storage** | None |
| **Testing** | guard + ref-resolution grep + JSON parse + validate.sh --strict |

### Overview
Relocate the canonical card to the hub and repoint everything that pointed at it (consumers, the
card's own links, the guard's canonical-path comment), leaving sk-prompt as a pure forkable engine.
The guard from phase 009 is rewritten (its canonical path), not discarded.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Full ripple mapped (consumers, card links, guard, graph-metadata)

### Definition of Done
- [ ] Card moved; all refs repointed; guard green; sk-prompt forkable-clean; validate --strict exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single canonical home. The CLI quality card lives with the model-craft hub; sk-prompt owns only the
generic framework engine.

### Key Components
- **hub/assets/cli_prompt_quality_card.md** — the relocated canonical card.
- **consumers** — 5 cli SKILL.md + 5 cards + hub SKILL.md + context-budget, pointing at the hub.
- **guard** — path-agnostic; only its canonical-path comment changes.

### Data Flow
cli-* cards delegate the framework/CLEAR tables to the hub card; the hub card delegates framework definitions to sk-prompt.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Map the inbound refs, the card's outbound links, the guard's path, sk-prompt graph-metadata.

### Phase 2: Core Implementation
- [x] `git mv` the card to the hub
- [x] Repoint 11 cli-* consumer refs (sibling path swap)
- [x] Fix hub SKILL.md (local), the card's own links, the guard comment, sk-prompt graph-metadata
- [x] Version bumps + changelogs (sk-prompt, hub, advisor)

### Phase 3: Verification
- [ ] guard green + no stale card refs + JSON valid + validate --strict + commit
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | Cards still point at the card filename; no table inlined | card-sync guard |
| Refs | No stale card path; all links resolve | grep + test -f |
| Registry | sk-prompt graph-metadata valid + card-free | python3 -m json.tool |
| Doc | Spec-folder integrity | validate.sh --recursive --strict |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 009 guard | Internal | Rewritten here | — |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a consumer ref breaks or the guard cannot go green.
- **Procedure**: `git mv` the card back + revert the repoint commit; all changes are isolated on `main`.
<!-- /ANCHOR:rollback -->
