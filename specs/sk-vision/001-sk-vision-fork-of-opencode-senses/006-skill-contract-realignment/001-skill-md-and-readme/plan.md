---
title: "Implementation Plan: sk-vision 006-001 SKILL.md contract, README, references"
description: "Rewrite the three doc surfaces from the copy pack, then regenerate manifests and run the doc gates."
trigger_phrases:
  - "sk-vision SKILL.md contract"
  - "sk-vision readme rewrite"
  - "sk-vision runtime reference"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/006-skill-contract-realignment/001-skill-md-and-readme"
    last_updated_at: "2026-08-16T12:00:00.000Z"
    last_updated_by: "pi"
    recent_action: "Created 006-001 plan skeleton."
    next_safe_action: "Implement per spec.md copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/sk-vision/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-006-001-skill-md-and-readme"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-vision 006-001 SKILL.md contract, README, references

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
| **Language/Stack** | Markdown skill docs |
| **Framework** | sk-create-skill templates + shared validators |
| **Storage** | None |
| **Testing** | validate_document.py, package_skill.py --check, ci-skill-root-metadata.cjs |

### Overview
Replace the scaffold stub with a truthful contract. Read the existing runtime sources first (pi factory tool bodies, photon.ts, runtime.py, types.ts, opencode tools/attachments) so every claim in the docs matches shipped behavior.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met — evidence: REQ-001..REQ-005 satisfied; see `implementation-summary.md`
- [ ] Docs updated (spec/plan/tasks) — evidence: closeout refresh
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Truth-first rewrite: read shipped code, then write docs, then regenerate manifests.

### Key Components
- **SKILL.md**: executable contract (tools, env vars, adapters, rules, success criteria)
- **README.md**: operator quick start + layout
- **references/runtime-reference.md**: overflow detail anchored to source

### Data Flow
SKILL.md routes → references/ on demand → operator reads README → advisor reads SKILL.md keywords.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| SKILL.md | stale stub | rewrite | validate_document.py exit 0 |
| README.md | stale stub framing | rewrite | no stub strings |
| references/ | empty | add runtime-reference.md | leaf-manifest lists it |
| leaf manifests | stale | regenerate | ci-skill-root-metadata.cjs OK |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Read shipped truth
- [ ] Read `pi/sk-vision.ts` (tool bodies), `src/providers/photon.ts`, `src/providers/types.ts`, `python/runtime.py` (methods + env vars), `src/opencode/tools.ts` + `attachments.ts` (auto-inspect grace)
- [ ] Inventory env vars and defaults; inventory tool semantics

### Phase 2: Author
- [ ] Write File 1 (SKILL.md) per spec copy pack
- [ ] Write File 2 (README.md) per spec copy pack
- [ ] Write File 3 (references/runtime-reference.md) per spec copy pack

### Phase 3: Verify
- [ ] `ci-skill-root-metadata.cjs --fix` then plain run
- [ ] `validate_document.py --type skill` exit 0
- [ ] `package_skill.py --check` PASS
- [ ] grep no stub language
- [ ] `validate.sh --strict` on this child
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Validation | SKILL.md structure | validate_document.py |
| Package | Skill root | package_skill.py --check |
| Fleet | Metadata | ci-skill-root-metadata.cjs |
| Manual | Doc truth vs disk | grep + read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 002-005 shipped files | Internal | Complete | No truth to document |
| sk-create-skill scripts | Internal | Available | No validation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Validator failures or doc claims contradicted by source.
- **Procedure**: Restore prior SKILL.md/README.md from git (untracked — recover from session history or rewrite); delete references/runtime-reference.md; rerun `--fix`. Do not touch `context/`.
<!-- /ANCHOR:rollback -->
