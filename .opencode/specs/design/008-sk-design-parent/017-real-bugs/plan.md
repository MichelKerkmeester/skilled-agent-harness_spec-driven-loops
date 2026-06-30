---
title: "Plan: sk-design two real bugs (md-generator manifest and audit router)"
description: "Execution plan for the two real bugs: regenerate the md-generator backend package.json from the lockfile so npm install works, and fix the audit router scoring loop so it iterates (keyword, weight) and loads the shared register. Not started."
trigger_phrases:
  - "sk-design real bugs plan"
  - "md-generator manifest fix plan"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/017-real-bugs"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Drafted the two-bug fix approach from the 015 evidence"
    next_safe_action: "Regenerate the backend manifest, then patch the audit router loop"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-017-real-bugs"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: sk-design two real bugs (md-generator manifest and audit router)

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
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
| **Language/Stack** | Node package manifest (JSON) plus the audit SKILL.md router pseudocode |
| **Framework** | md-generator backend npm project and the design-audit mode router |
| **Storage** | `.opencode/skills/sk-design/design-md-generator/backend/` and `design-audit/SKILL.md` |
| **Testing** | `npm install` in the backend, an audit router parse and replay, `validate.sh --strict` |

### Overview
Two small, isolated fixes. Regenerate the md-generator backend `package.json` from the lockfile root metadata and the documented dependency list so `cd backend && npm install` succeeds. Then fix the audit router scoring loop so it iterates the keyword list and applies each intent's configured weight, and ensure the router-replay loads `../shared/register.md` using the loader mechanism that `../016-register-loader-contract` establishes. Both fixes restore documented behavior without expanding scope.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The md-generator `backend/package-lock.json` root metadata and `backend/README.md` dependency list read
- [ ] The audit router scoring loop and its keyword/weight config confirmed in `design-audit/SKILL.md`
- [ ] The `../016-register-loader-contract` loader mechanism confirmed so the audit register-load reuses it

### Definition of Done
- [ ] `package.json` exists in the backend and `npm install` succeeds
- [ ] The audit scoring loop iterates `(keyword, weight)` and the router parses and runs
- [ ] The audit router-replay loads `../shared/register.md`
- [ ] `validate.sh --strict` passes on this packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two surgical bug fixes: regenerate one missing manifest file, and correct one router loop plus its register load. No new capability, no new workflow.

### Key Components
- **backend/package.json** (created): name, version, dependencies, devDependencies, and bin reconciled from the lockfile and the documented dependency list.
- **design-audit scoring loop** (fixed): iterates the keyword list and applies each intent's configured weight.
- **design-audit register load** (fixed): the router-replay loads `../shared/register.md` through the 016 loader mechanism.

### Data Flow
`lockfile root metadata + README dependency list` -> author `package.json` -> `npm install` to confirm. `audit router config` -> correct the scoring loop and the register load -> parse and replay to confirm.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase fixes two concrete bugs. It adds one backend manifest and corrects one router loop plus its register load. No extraction fidelity or design content changes.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `design-md-generator/backend/package.json` | missing in this checkout | create | file present, consistent with lockfile, `npm install` succeeds |
| `design-audit/SKILL.md` scoring loop | iterates a string list as tuples | edit | loop iterates `(keyword, weight)`, router parses and runs |
| `design-audit/SKILL.md` register load | replay omits the shared register | edit | replay loads `../shared/register.md` via the 016 mechanism |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read the backend `package-lock.json` root metadata and `backend/README.md` dependency list
- [ ] Read the audit router scoring loop and its keyword/weight config in `design-audit/SKILL.md`
- [ ] Confirm the `../016-register-loader-contract` loader mechanism to reuse for the audit register load

### Phase 2: Core Implementation
- [ ] Author `backend/package.json` reconciled from the lockfile and the documented dependencies
- [ ] Fix the audit scoring loop to iterate the keyword list and apply each intent's configured weight
- [ ] Ensure the audit router-replay loads `../shared/register.md` via the 016 loader mechanism

### Phase 3: Verification
- [ ] Run `cd backend && npm install` and confirm it succeeds
- [ ] Parse the audit router and replay the five representative audit prompts, confirming the register loads and weights apply
- [ ] Run `validate.sh --strict` on this packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Setup | md-generator backend install | `npm install` in `backend/` |
| Routing | Audit router parse and replay | Router-replay of the five representative audit prompts |
| Static | This packet's spec docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The md-generator `backend/package-lock.json` | Internal | Green | The manifest cannot be regenerated faithfully |
| `../016-register-loader-contract` loader | Internal | Planned | The audit register-load has no shared mechanism to reuse |
| `../015-per-skill-improvement-research/004-audit` research | Internal | Green | The audit bug shape cannot be grounded |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:phase-deps -->
## 7. PHASE DEPENDENCIES

| Phase | Depends On | Why |
|-------|-----------|-----|
| Phase 1 Setup | `../015-per-skill-improvement-research` | The bug shapes come from the md-generator and audit lineages |
| Phase 2 Implementation | Phase 1, `../016-register-loader-contract` | The audit register-load reuses the 016 loader mechanism |
| Phase 3 Verification | Phase 2 | Install and router replay need the fixes in place |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 8. EFFORT ESTIMATE

| Phase | Effort | Notes |
|-------|--------|-------|
| Phase 1 Setup | S | Read the lockfile, README, and audit router config |
| Phase 2 Implementation | S | One manifest file plus one router-loop correction and the register load |
| Phase 3 Verification | S | `npm install`, audit router replay, `validate.sh --strict` |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:rollback -->
## 9. ROLLBACK PLAN

- **Trigger**: `npm install` still fails, the scoring-loop fix changes routing outcomes, or the register load conflicts with 016.
- **Procedure**: The manifest is additive, so deleting it reverts that change. The router edit is a localized loop and load correction, so restoring the prior pseudocode reverts it. No extraction or design content is mutated.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

| Trigger | Detection | Action | Owner |
|---------|-----------|--------|-------|
| Regenerated manifest mismatches the lockfile | `npm install` errors or version drift | Re-derive the manifest fields from the lockfile root metadata and reinstall | implementing subagent |
| Scoring-loop fix reorders audit intents | Router replay routes a prompt to a different intent | Restore the configured weights exactly and rerun the replay | implementing subagent |
| Register load conflicts with the 016 mechanism | Double-load or guard error in replay | Reuse the single 016 loader path and remove any local duplicate | implementing subagent |
<!-- /ANCHOR:enhanced-rollback -->
