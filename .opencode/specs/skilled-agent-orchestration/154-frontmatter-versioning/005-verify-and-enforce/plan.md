---
title: "Implementation Plan: Phase 5: verify-and-enforce [template:level_1/plan.md]"
description: "[2-3 sentences: what this implements and the technical approach]"
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/005-verify-and-enforce"
    last_updated_at: "2026-06-23T07:33:12Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-verify-and-enforce"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: verify-and-enforce

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
| **Language/Stack** | Python validators, a shell gate wrapping the Node engine |
| **Framework** | sk-doc validators and versioning engine |
| **Storage** | None (files on disk) |
| **Testing** | Validator suites; a corpus-wide gate; a no-version fixture |

### Overview
This phase turned the standard from documented to enforced now that the corpus carried versions. The approach flipped the two validators to error on an absent version for skills, added a fast corpus-wide gate wrapping the engine's gate mode, recorded the owning skill's changelog and re-versioned that skill to dogfood the standard, then ran the full validation sweep green.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (without enforcement, new docs would drift back to no version)
- [x] Success criteria measurable (a gate blocks an in-scope doc with no version and passes once it has one; the full sweep is green)
- [x] Dependencies identified (phases 1-4 complete; the corpus is fully populated)

### Definition of Done
- [x] All acceptance criteria met (validators require version; gate added; changelog recorded; completion reconciled)
- [x] Tests passing (validator suites green; gate exit 0 over the full corpus)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Enforce-last: the hard required gate was deferred until the corpus carried versions, then flipped so the field cannot regress.

### Key Components
- **Required validators**: the quick validator and the packaging validator now error on an absent version for skills and on any non-4-part value; commands stay optional because they are out of scope.
- **Corpus CI gate**: a shell script wraps the engine's gate mode, discovers every in-scope doc without git, exits non-zero on any missing or malformed version, and skips frontmatter-less docs; it runs the whole corpus in a fraction of a second so it fits a pre-commit hook or CI step.
- **Self-dogfooding**: the skill that owns the standard gained a changelog entry for it and re-versioned its own docs to that anchor, so it exemplifies the contract it defines.

### Data Flow
A doc author or CI step runs the validators or the gate; an in-scope doc with no version or a malformed one fails, while a well-formed 4-part value passes; the gate enumerates the corpus from disk and reports the skip set rather than failing frontmatter-less docs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirmed phases 3-4 had populated every in-scope doc, making the required-flip safe
- [x] Chose to scope enforcement to in-scope classes only, leaving commands, agents, and standalone install guides out

### Phase 2: Core Implementation
- [x] Flipped the quick validator and the packaging validator to error on an absent version for skills
- [x] Added the corpus-wide gate script wrapping the engine's gate mode
- [x] Recorded the owning skill's changelog entry and re-versioned its docs to that anchor; marked the enforcement section of the standard active

### Phase 3: Verification
- [x] Verified the required-flip with a no-version fixture (fails) and a real skill (passes)
- [x] Confirmed the three existing validator suites stayed green
- [x] Confirmed the gate exits 0 on the full corpus both from the manifest and standalone
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Required-flip on a no-version fixture and a real skill | quick validator |
| Integration | The three existing validator suites | pytest |
| Manual | Corpus-wide gate, from the manifest and standalone | Gate script |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 1-4 complete (corpus populated) | Internal | Green | The hard required gate cannot flip until the corpus carries versions |
| Versioning engine gate mode | Internal | Green | The corpus CI gate wraps it to enumerate and check every in-scope doc |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The required-flip red-flags out-of-scope classes or a legitimate in-scope doc, or the gate misfires in CI.
- **Procedure**: Revert the validator flip to format-only and remove the gate from the pre-commit or CI wiring; the standard and the populated versions remain. The gate is a standalone script, so removing it from a workflow disables enforcement without touching any doc.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
