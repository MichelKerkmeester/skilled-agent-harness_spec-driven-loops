---
title: "Implementation Plan: sk-communication skill"
description: "Plan to scaffold, author, and validate the sk-communication standalone skill."
trigger_phrases:
  - "sk-communication plan"
importance_tier: "standard"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-communication-skill"
    last_updated_at: "2026-08-12T13:10:00Z"
    last_updated_by: "claude"
    recent_action: "Recorded the authoring plan."
    next_safe_action: "None; complete."
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-communication-skill-20260812"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The canonical create-skill workflow authors and validates the skill."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: sk-communication skill

<!-- ANCHOR:summary -->
## 1. SUMMARY

Scaffold with the create-skill initializer, author the runtime contract and advisor identity, generate the manifest, and validate through the canonical gates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Done

- [x] `ci-skill-root-metadata` exits clean for the class-S root.
- [x] `validate_skill_package.py` reports PASS.
- [x] The advisor recommends the skill for the projection intent.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One standalone advisor identity (class S) that owns a single runtime contract and points at an external package rather than duplicating it.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| `SKILL.md` | Executable routing contract and invariant enforcement. |
| `graph-metadata.json` | Advisor identity: domains, intent signals, sibling edges. |
| `leaf-manifest.config.json` | Names the single workflow mode and leaf roots. |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Author and Validate

- [x] Scaffold the standalone skill with `init_skill.py`.
- [x] Author `SKILL.md` as the package wrapper and fill the advisor vocabulary.
- [x] Generate the manifest and validate through the canonical gates.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool |
|-----------|-------|------|
| Structure | Class-S root metadata | `ci-skill-root-metadata.cjs` |
| Package | Frontmatter, sections, naming | `validate_skill_package.py` |
| Routing | Advisor recommends the skill | `advisor_recommend` smoke test |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| create-skill workflow (`sk-doc`) | Internal | Available |
| communication-projection package | Internal | On the same branch |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The skill misroutes or fails validation.
- **Procedure**: Remove `.opencode/skills/sk-communication/` and rescan the advisor; no package or runtime change is involved.
<!-- /ANCHOR:rollback -->
