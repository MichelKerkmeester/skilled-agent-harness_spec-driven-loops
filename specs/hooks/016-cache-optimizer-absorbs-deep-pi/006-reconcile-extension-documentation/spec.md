---
title: "Feature Specification: Phase 6: documentation matches what ships"
description: "Once the extension is gone and its capabilities live elsewhere, the documents that describe the Pi extension surface still describe the old arrangement. This phase reconciles them against the shipped tree, and answers whether the root README should carry a Pi-extension section at all, since today it carries none."
trigger_phrases:
  - "reconcile pi extension documentation"
  - "plugins inventory update"
  - "root readme pi extensions"
  - "documentation matches shipped state"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/016-cache-optimizer-absorbs-deep-pi/006-reconcile-extension-documentation"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored against a measured documentation surface"
    next_safe_action: "Execute once 001-005 are done and tested"
    blockers: []
    key_files:
      - ".pi/PLUGINS.md"
      - ".pi/extensions/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-016-006-reconcile-extension-documentation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The root README carries no Pi-extension content today, so this phase decides whether it should rather than assuming there is text to correct"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 6: documentation matches what ships

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

After 001-005 the Pi extension surface is materially different: one cache extension instead of two,
carrying capabilities it did not have. The documents describing that surface were written for the
old arrangement. This phase reconciles them against the tree as it actually ships.

**Key Decisions**: verify every claim against the tree rather than editing around the old wording; run last, so it documents behavior rather than intent.

**Critical Dependencies**: 001-005 done AND tested.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-09-08 |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 005-remove-deep-pi |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the parent decomposition, and the last.

**Scope Boundary**: documentation only. No behavior change; if this phase wants one, that is a
finding for a new packet, not an edit here.

**Dependencies**: 001-005 shipped and verified. Documentation written before the behavior is tested
documents an intention, which is the failure this ordering avoids.

**Deliverables**: every live document describing Pi extensions matches the shipped tree.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Measured before this phase was written, the documentation surface is not where one would guess:

| Document | Pi-extension mentions | Role |
|----------|----------------------|------|
| `.pi/extensions/README.md` | 16 | The extensions inventory |
| `.pi/PLUGINS.md` | 13 | The installed-plugin roster |
| `.pi/SYNC.md` | 6 | How `.pi/` derives from `.opencode/` |
| Root `README.md` | **0** | Carries no Pi-extension content at all |
| `.opencode/skills/README.txt` | 0 | Mentions runtime plugins generically |

So "update the root README" is not a correction task: there is nothing there to correct. The phase
has to answer a different question — whether the root README *should* describe the Pi extension
surface, given it never has — and then either add a section deliberately or record that the
inventory lives under `.pi/` and the root correctly stays silent.

The three `.pi/` documents do carry stale content, and they are the substance of this phase.

### Purpose

Every live document that describes Pi extensions describes the ones that exist and what they now
do, and the root README's silence on the subject is a decision rather than an oversight.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `.pi/extensions/README.md`, `.pi/PLUGINS.md`, `.pi/SYNC.md`.
- `.pi/extensions/pi-cache-optimizer/README.md`, where capabilities gained in 002-004 are described.
- A decision on whether the root `README.md` should carry a Pi-extension section, recorded either way.
- Any other README the residue sweep in 005 surfaced as live.

### Out of Scope

- **Historical records.** Unchanged, per the parent decision.
- **Behavior.** If reconciling reveals a behavior gap, it is reported as a finding, not fixed here.
- **`.opencode/skills/README.txt`**, already reconciled and carrying no extension-specific claim.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/extensions/README.md` | Modify | Inventory of what is installed and what each extension does |
| `.pi/PLUGINS.md` | Modify | Roster reconciled against `.pi/settings.json` |
| `.pi/SYNC.md` | Modify | Derivation and drift-checking description, where it names the retired extension |
| `.pi/extensions/pi-cache-optimizer/README.md` | Modify | Economics, retry guard and verified-edit behavior as shipped |
| `README.md` | Modify or unchanged | Whichever the recorded decision selects |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No live document lists a retired extension as installed |
| REQ-002 | The surviving extension's documented capabilities match what it does, checked against the code |
| REQ-003 | The root README question is answered explicitly, either by adding a section or recording why not |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The plugin roster matches `.pi/settings.json` entry for entry |
| REQ-005 | Documentation validators pass on every changed file |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A residue sweep over live documents finds no retired extension named as current.
- **SC-002**: Each documented capability is traceable to code that implements it.
- **SC-003**: `validate_document.py` passes on every changed file.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Documentation written from the spec rather than the code | High — describes intent, not behavior | Every claim traced to the implementing code; the phase runs after the behavior is tested |
| Risk | Editing around old wording instead of re-reading it | Medium — stale claims survive a rewrite | Each document is re-derived from the tree, not patched sentence by sentence |
| Risk | The root README grows a section nobody maintains | Medium | The decision is recorded with its reason, so a later reader can revisit it deliberately |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the root README describe the Pi extension surface at all? It never has. Adding a section creates a maintenance obligation at the most-read file in the repo; leaving it silent keeps the inventory where the runtime lives. Decide and record, do not drift.
<!-- /ANCHOR:questions -->
