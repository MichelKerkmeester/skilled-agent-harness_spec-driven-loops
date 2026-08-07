---
title: "Feature Specification: AGENTS.md Communication Quality Section"
description: "Add a curated Communication Quality section to the universal AGENTS.md and reconcile the Codex voice spec, lifting only net-new communication-craft principles from the 003 context."
trigger_phrases:
  - "communication quality"
  - "agents.md"
  - "voice"
  - "tone"
  - "specification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/003-communication-quality"
    last_updated_at: "2026-08-07T08:44:03Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level 2 specification for the AGENTS.md communication-quality change"
    next_safe_action: "Packet complete; no further action pending"
    blockers: []
    key_files:
      - "AGENTS.md"
      - ".codex/AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: AGENTS.md Communication Quality Section

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-07 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Communication guidance in the root `AGENTS.md` is scattered and compressed across §1 (Two registers, Communication, Documentation & Honesty), §4, and §7, with no single home. The `context/` folder in this packet holds a practitioner source (a Reddit r/codex thread) with concrete communication-craft heuristics that are not yet reflected in the framework. Most of that source already exists — more thoroughly — in the dedicated `.codex/AGENTS.md` voice spec, so a naive copy would duplicate rather than improve.

### Purpose
Add a dedicated Communication Quality section to the universal `AGENTS.md` carrying only the genuinely net-new principles, and reconcile `.codex/AGENTS.md` so the two files agree, making AI-to-user communication measurably clearer without contradiction or bloat.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New `## 8. COMMUNICATION QUALITY` section in root `AGENTS.md` (Writing, Recommendations & Honesty, Turn Framing, closing caveat).
- Renumber existing §8 Agent & Skill Routing → §9 and §9 Quick Reference → §10.
- Minimal additive reconciliation edits in `.codex/AGENTS.md` (register, sentence construction, required/optional, best-practice honesty, early-commitment caveat).
- Level 2 spec docs + metadata for this packet.

### Out of Scope
- Model-internals claims from the source ("LLMs can't count", "reasoning in a separate call") - practitioner opinion, not authority.
- Hard word budgets ("~250 words") - soft/contested and already handled by `.codex` per-mode length.
- Rewriting or relocating existing §1 communication material - referenced, not moved.
- Any runtime/agent-definition or code change - this is a governance-doc change only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `AGENTS.md` | Modify | New §8 Communication Quality; renumber §8→§9, §9→§10 |
| `.codex/AGENTS.md` | Modify | 4 additive edits reconciling net-new principles |
| `specs/agents/003-communication-quality/*` | Create | Level 2 spec docs + description.json + graph-metadata.json |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Root `AGENTS.md` carries a dedicated Communication Quality section | `## 8. 🗣️ COMMUNICATION QUALITY` present with Writing, Recommendations & Honesty, Turn Framing subsections |
| REQ-002 | Section headers remain sequential and cross-refs intact | Headers read 1..10 in order; no in-doc `§8/§9/§10` reference points at the wrong section |
| REQ-003 | New principles are net-new, not duplicates | Each added bullet is absent from §1 (L50-55, L80-82, L115-119) and from `.codex/AGENTS.md`, or is an explicit cross-link |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `.codex/AGENTS.md` reconciled without contradiction | 4 additive edits present; no rule contradicts root §8 (notably: no "keep it short" added against `.codex`'s varied-medium-rhythm rule) |
| REQ-005 | Packet passes strict spec validation | `validate.sh <folder> --strict` exits 0 or 1 (warnings only), no errors |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader can find all cross-runtime communication rules in one section of `AGENTS.md`.
- **SC-002**: Root §8 and `.codex/AGENTS.md` state compatible, non-overlapping guidance.
- **SC-003**: The change adds ~35 lines to `AGENTS.md` and ~12 to `.codex/AGENTS.md` - curated, not bloated.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Duplication with `.codex` or §1 | Bloat, conflicting rules | Lift only net-new principles; cross-link the rest |
| Risk | Renumber breaks a cross-reference | Broken navigation | Grep §8/§9/§10 before and after; confirm the lone hit is an external-file ref |
| Risk | Contradiction with `.codex` rhythm rules | Confusing guidance | Import one-idea/SVO/atomic, but NOT "keep it short" |
| Dependency | `CLAUDE.md` symlink → `AGENTS.md` | Both must stay in sync | Symlink confirmed; single edit covers both |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: New section matches house style (`## N. EMOJI TITLE`, `- **Term** — explanation.`).
- **NFR-M02**: No ephemeral artifact ids (spec paths, REQ/task ids) embedded in the instruction prose of either AGENTS.md file.

### Consistency
- **NFR-C01**: Root §8 is framed as the cross-runtime core; `.codex/AGENTS.md` remains the Codex-specific deep spec, cross-referenced.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Runtime Coverage
- **Root vs Codex**: Root `AGENTS.md` is read by every runtime; `.codex/AGENTS.md` only by Codex. Net-new principles land in root so all runtimes benefit.
- **Symlinks**: `CLAUDE.md → AGENTS.md` and `~/.codex/AGENTS.md → .codex/AGENTS.md`; edits propagate without duplicate files.

### Source Reliability
- **Forum provenance**: The source is a Reddit thread. Only communication-craft heuristics are lifted; model-internals claims are excluded.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Should the sentence-craft rules also propagate to other runtime agent dirs (`.opencode/`, `.pi/`)? **RESOLVED: Out of scope; root `AGENTS.md` already covers all runtimes.**
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Source material**: See `context/`
<!-- /ANCHOR:related-docs -->
