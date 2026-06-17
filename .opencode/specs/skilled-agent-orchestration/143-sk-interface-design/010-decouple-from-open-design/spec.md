---
title: "Feature Specification: Phase 10: decouple-from-open-design [template:level_1/spec.md]"
description: "Make sk-interface-design a standalone skill by removing every mention of the internal mcp-open-design skill and the Open Design app from its live content. Split the shared parity doc: the generic real-UI loop stays here (renamed real_ui_loop.md, vendor-neutral); the Open Design transport mechanics move into mcp-open-design as design_parity_transport.md. The reverse coupling (mcp-open-design -> sk-interface-design) is preserved."
trigger_phrases:
  - "sk-interface-design decouple open design"
  - "standalone interface design skill"
  - "real_ui_loop split parity doc"
  - "phase 010 spec"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/143-sk-interface-design/010-decouple-from-open-design"
    last_updated_at: "2026-06-17T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Split parity doc, stripped Open Design naming from sk-interface-design, repointed consumers"
    next_safe_action: "Strict-validate and close; run sk-doc validators"
    blockers: []
    key_files:
      - ".opencode/skills/sk-interface-design/references/design-process/real_ui_loop.md"
      - ".opencode/skills/mcp-open-design/references/design_parity_transport.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-010-decouple-from-open-design"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "How to decouple? Relocate + split the parity doc (generic loop stays vendor-neutral here; Open Design transport moves to mcp-open-design)."
      - "Reference scope? Skill + live wiring; historical changelogs left as point-in-time records."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 10: decouple-from-open-design

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-17 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 |
| **Predecessor** | 009-mobbin-refero-design-reference-integration |
| **Successor** | 011-mobbin-refero-smart-routing |
| **Handoff Criteria** | Zero `mcp-open-design`/Open Design mentions in sk-interface-design live content; the reverse coupling from mcp-open-design stays intact; all repointed links resolve; `validate.sh --strict` exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the sk-interface-design specification.

**Scope Boundary**: Remove Open Design coupling from `sk-interface-design` so it reads as a standalone skill, and split the shared parity doc. Edits `sk-interface-design` (its content), plus cross-skill repoints in `mcp-open-design` and `sk-prompt`. No change to `mcp-open-design`'s mandatory `sk-interface-design` coupling logic. Mobbin/Refero stay (the routing upgrade is phase 011).

**Decision (relocate + split)**: The shared `claude_design_parity.md` mixed generic design judgment with Open-Design transport. The generic half stays here renamed `real_ui_loop.md` (vendor-neutral); the transport half moves to `mcp-open-design/references/design_parity_transport.md`, which points back to `real_ui_loop.md`. Section numbers (§6/§7/§8) preserved so external citations survive.

**Dependencies**:
- `mcp-open-design` (the one-way consumer that keeps naming this skill) and `sk-prompt` (one parity-doc citation).

**Deliverables**:
- `real_ui_loop.md` (generic), `mcp-open-design/references/design_parity_transport.md` (transport), all Open Design naming stripped from sk-interface-design content, repointed consumers, version bump + changelog.

**Changelog**:
- `sk-interface-design/changelog/v1.4.0.0.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-interface-design` is vendored from Anthropic's Apache-2.0 `frontend-design` skill and is meant to be reusable standalone, but it accumulated ~101 references to the internal `mcp-open-design` skill and the Open Design app across 23 files. An external user adopting it alone sees an internal sibling skill and an app they do not have. The shared `claude_design_parity.md` is the crux: it lives here but is the Open Design integration protocol.

### Purpose
Make `sk-interface-design` standalone: it names neither `mcp-open-design` nor the Open Design app. Keep the integration one-way — `mcp-open-design` still names this skill as its mandatory judgment partner (150/011), but this skill knows nothing about it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Split `claude_design_parity.md` -> generic `real_ui_loop.md` (here) + `design_parity_transport.md` (mcp-open-design).
- Strip all `mcp-open-design`/Open Design naming from sk-interface-design content (SKILL.md, README, design_inventory.md, design_references_mcp.md, variation_diversity.md, feature_catalog, manual_testing_playbook, graph-metadata.json).
- Repoint consumers: `mcp-open-design` (5 refs), `sk-prompt` (1 ref), internal refs.
- Version bump + changelog (both skills).

### Out of Scope
- The Mobbin/Refero routing upgrade (phase 011).
- `mcp-open-design`'s mandatory-coupling logic (only the parity-doc path moves).
- `mcp-figma` references (the user scoped this to Open Design only).
- Historical changelogs (left as point-in-time records).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-interface-design/references/design-process/claude_design_parity.md` | Rename+rewrite | -> `real_ui_loop.md`, vendor-neutral, transport stripped |
| `mcp-open-design/references/design_parity_transport.md` | Create | The Open Design transport half, points back to real_ui_loop.md |
| `sk-interface-design/{SKILL.md,README.md,graph-metadata.json}` + `references/**` + `feature_catalog/**` + `manual_testing_playbook/**` | Modify | Strip Open Design naming; repoint links |
| `mcp-open-design/{SKILL.md,README.md,INSTALL_GUIDE.md}` + `feature_catalog/03--grounding/design-system-grounding.md` | Modify | Repoint the 5 parity-doc references |
| `sk-prompt/references/design_generation_patterns.md` | Modify | Repoint claude_design_parity.md citations to real_ui_loop.md |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Standalone | Live-content grep over sk-interface-design (excl. changelog) finds zero `mcp-open-design` / "Open Design" / `od mcp` hits |
| REQ-002 | Parity doc split | `real_ui_loop.md` exists (vendor-neutral, §6/§7/§8 preserved); `mcp-open-design/references/design_parity_transport.md` exists and references real_ui_loop.md |
| REQ-003 | Reverse coupling intact | `mcp-open-design` SKILL.md still carries the MANDATORY PAIRING banner, hard gate, RULES, and success-criteria naming `sk-interface-design` |
| REQ-004 | No broken links | Every repointed `claude_design_parity.md` reference now resolves (real_ui_loop.md or design_parity_transport.md); no dangling path |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Doc validators pass | sk-doc validators on the changed README/feature_catalog/playbook indexes report 0 issues |
| REQ-006 | Strict validate | `validate.sh --strict` exits 0 on this phase; parent map + children_ids reconciled |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -i 'mcp-open-design|open design|\bod mcp\b' sk-interface-design --glob '!changelog/**'` returns zero hits.
- **SC-002**: The split docs exist and cross-reference correctly; `claude_design_parity.md` no longer exists.
- **SC-003**: `mcp-open-design` still mandates `sk-interface-design` (reverse coupling unbroken).
- **SC-004**: `validate.sh --strict` exits 0 on this phase folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Breaking the reverse coupling | mcp-open-design would lose its mandatory judgment partner | Only repoint the parity-doc path in mcp-open-design; leave the coupling logic untouched and verify it |
| Risk | Dangling links after the split | Consumers point at a moved/renamed doc | Repoint all 5 mcp-open-design refs + 1 sk-prompt ref + internal refs; grep for `claude_design_parity` after |
| Risk | Losing the generic judgment in the move | variation_diversity / sk-prompt cite §7/§8 | Keep the generic sections (and their numbers) in `real_ui_loop.md`; only transport mechanics move |
| Dependency | sk-prompt design_generation_patterns | Cites the parity doc | Repoint to real_ui_loop.md (generic sections preserved) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The decouple approach (relocate + split) and reference scope were resolved with the user before implementation.
<!-- /ANCHOR:questions -->
