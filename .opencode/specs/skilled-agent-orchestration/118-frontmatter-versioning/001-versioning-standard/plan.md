---
title: "Implementation Plan: Phase 1 - Versioning Standard"
description: "Phase 1 planned the 4-part frontmatter version standard, sk-doc template updates, create-command generator updates, and validator format checks. The phase is complete and its quality gates are recorded below."
trigger_phrases:
  - "versioning standard plan"
  - "phase 1 version plan"
  - "sk-doc version field plan"
  - "frontmatter version rollout"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/118-frontmatter-versioning/001-versioning-standard"
    last_updated_at: "2026-07-02T05:45:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold frontmatter with authored phase plan"
    next_safe_action: "Run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/references/frontmatter_versioning.md"
      - ".opencode/skills/sk-doc/assets/frontmatter_templates.md"
      - ".opencode/skills/sk-doc/scripts/quick_validate.py"
      - ".opencode/skills/sk-doc/scripts/package_skill.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediated-001-versioning-standard-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Version is 4-part X.Y.Z.W; missing-version enforcement is deferred to phase 5."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1 - Versioning Standard

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
| **Language/Stack** | Python validators, Markdown templates and references |
| **Framework** | sk-doc documentation tooling |
| **Storage** | None (files on disk) |
| **Testing** | pytest validator suites |

### Overview
This phase wrote the single source-of-truth standard for the 4-part `version` field and taught every sk-doc surface that creates or checks a skill doc about it. The approach was to author one reference doc, add `version` to the template contract and example blocks, and extend the existing validators to format-check the field when present, leaving the hard required gate for the last phase so the un-versioned corpus would not turn red mid-migration.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (sk-doc owns the standard but `version` was only an optional SKILL.md field)
- [x] Success criteria measurable (generators emit a `version` line; validators reject malformed values)
- [x] Dependencies identified (first phase; reads the existing templates and validators only)

### Definition of Done
- [x] All acceptance criteria met (standard authored, templates emit version, validators format-check)
- [x] Tests passing (validator suites green; format-check fixture moved to 4-part)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One canonical standard doc, with every template and reference pointing to it rather than restating the rules.

### Key Components
- **Versioning standard reference**: defines the `X.Y.Z.W` format, the changelog-anchored derivation (`anchor = max(frontmatter, changelog)`), the numstat-gated build segment, line-wise insertion, and the staged enforcement rollout.
- **Born-versioned templates and generators**: `frontmatter_templates.md` lists `version` as required for SKILL.md and skill reference/asset docs; nine template example blocks carry `version: 1.0.0.0`; the skill generator emits it.
- **Format-checking validators**: the quick validator and the packaging validator reject any `version` that is not 4-part `X.Y.Z.W`, while absence stays allowed until the final phase.

### Data Flow
A doc author or generator emits a `version` line from the template; the validators read it on validate/package and either accept a well-formed 4-part value, reject a malformed one, or allow absence during migration.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the existing template contract and the two validators to extend rather than rewrite them
- [x] Locked the format (`X.Y.Z.W`) and the staged-enforcement decision before touching files

### Phase 2: Core Implementation
- [x] Authored the versioning standard reference (format, derivation, rollout)
- [x] Added `version` to the field tables, templates, and validation rules of the frontmatter contract; placed `version: 1.0.0.0` in nine template example blocks; made the skill generator emit it
- [x] Added a 4-part format-check to the quick validator and the packaging validator (validation when present; absence still allowed)

### Phase 3: Verification
- [x] Compiled both validators and confirmed a 3-part value is rejected and a 4-part value is accepted
- [x] Ran the validator suites and the real sk-doc doc through the quick validator; updated the format-check fixture to 4-part
- [x] Grepped the nine templates to confirm the version example is present with no leftover 3-part in skill docs
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Validator format-check (3-part rejected, 4-part accepted) | pytest |
| Integration | Real sk-doc doc + package regression + validator suites | pytest |
| Manual | Grep that nine template example blocks carry the version key | rg / spot-check |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing frontmatter template contract | Internal | Green | Extended in place; permissive parsers left untouched |
| The two sk-doc validators | Internal | Green | Extended with a format-check; behavior preserved when version absent |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A format-check or generator change breaks an existing validator suite or scaffolding flow.
- **Procedure**: Revert the validator and template changes; the standard reference is additive and can stay. Absence remained allowed in this phase, so reverting the format-check cannot retroactively fail the corpus.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
