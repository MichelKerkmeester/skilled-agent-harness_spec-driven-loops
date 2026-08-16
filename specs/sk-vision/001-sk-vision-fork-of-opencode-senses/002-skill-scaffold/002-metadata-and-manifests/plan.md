---
title: "Implementation Plan: sk-vision Class S metadata"
description: "Write identity JSON and README, then --fix. Prove hub JSON is absent and vision-runtime is empty."
trigger_phrases:
  - "sk-vision graph-metadata"
  - "sk-vision leaf manifest"
  - "sk-vision class S"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/002-skill-scaffold/002-metadata-and-manifests"
    last_updated_at: "2026-08-16T07:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Authored nested-phase copy pack and L1 suite."
    next_safe_action: "Implement files from this child's spec.md copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/sk-vision/graph-metadata.json"
      - ".opencode/skills/sk-vision/leaf-manifest.config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-002-skill-scaffold-002-metadata-and-manifests"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-vision Class S metadata

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
| **Language/Stack** | JSON + Node generator |
| **Framework** | Class S ci-skill-root-metadata.cjs |
| **Storage** | None |
| **Testing** | ci-skill-root-metadata.cjs; package_skill.py --check |

### Overview
Write identity JSON and README, then --fix. Prove hub JSON is absent and vision-runtime is empty.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Authored config in, generated manifests out

### Key Components
- **graph-metadata.json**: skill_id sk-vision
- **leaf-manifest.config.json**: workflowMode sk-vision
- **ci-skill-root-metadata.cjs --fix**: generates leaf files

### Data Flow
Write config. Run --fix. Generator emits leaf-manifest.json and leaf-aliases.json.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| graph-metadata.json | missing | create | skill_id equals sk-vision |
| hub JSON names | must be absent | unchanged | ls fails |
| vision-runtime | must stay empty | unchanged | test ! -e |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm SKILL.md exists
- [ ] Do not copy a hub skill

### Phase 2: Core Implementation
- [ ] Write File 2 and File 3
- [ ] Write README
- [ ] Run --fix

### Phase 3: Verification
- [ ] ls hub JSON fails
- [ ] package_skill.py --check
- [ ] validate.sh --strict
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | N/A | None |
| Integration | Class S gate | ci-skill-root-metadata.cjs / package_skill.py |
| Manual | ls skill root | Shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001-skill-md | Internal | Yellow until Complete | No SKILL.md for package_skill.py |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Wrong files, hub JSON, dump edits, or invented tool names.
- **Procedure**: Delete only this child's created files. Do not edit `context/`. Restore any modified README rows.
<!-- /ANCHOR:rollback -->
