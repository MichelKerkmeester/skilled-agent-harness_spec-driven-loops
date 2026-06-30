---
title: "Feature Specification: sk-design two real bugs (md-generator manifest and audit router)"
description: "Planned Level-2 implementation phase: fix the two concrete bugs the 014 and 015 work surfaced. The md-generator backend ships a package-lock.json with no package.json, breaking the documented npm install. The audit router scoring loop iterates a plain keyword list as if it held (keyword, weight) tuples, so it ignores weights and will not run, and router-replay never loads the shared register that scoring and remediation require. Not started."
trigger_phrases:
  - "sk-design real bugs phase"
  - "md-generator missing package.json"
  - "audit router keyword weight bug"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/017-real-bugs"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the two-real-bugs phase from the 014 and 015 findings"
    next_safe_action: "Regenerate the backend package.json, then fix the audit router loop"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-017-real-bugs"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-design two real bugs (md-generator manifest and audit router)

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
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
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned (not started) |
| **Created** | 2026-06-27 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../016-register-loader-contract/spec.md |
| **Successor** | ../018-routing-wiring/spec.md |
| **Handoff Criteria** | The md-generator backend has a `package.json` regenerated from the lockfile plus the documented dependencies and `npm install` succeeds in `backend/`, the audit router scoring loop iterates `(keyword, weight)` correctly so weights apply and the router parses and runs, the audit router-replay loads `../shared/register.md`, and `validate.sh --strict` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two concrete bugs block documented behavior in the sk-design family. First, the md-generator backend ships a `package-lock.json` with no `package.json` in this checkout, so the documented `cd backend && npm install` setup is broken: even perfect docs cannot make install, test, or bin execution work without the manifest (`../015-per-skill-improvement-research/005-md-generator/research/lineages/gpt55fast/research.md`, P1 "Restore backend setup viability"; corroborated by `../015-per-skill-improvement-research/implementation-summary.md`, "One real bug"). Second, the audit router scoring loop iterates a plain keyword list as if it were a list of `(keyword, weight)` tuples (`for keyword, weight in cfg["keywords"]:` over a list of strings), so it ignores the configured weight field and will not run as written, and router-replay never loads `../shared/register.md` even though audit scoring and transform remediation require register posture (`../015-per-skill-improvement-research/004-audit/research/lineages/gpt55fast/research.md`, R1).

### Purpose
Fix both real bugs so the documented setup and the audit router actually work. Regenerate the md-generator backend `package.json` from the lockfile plus the documented dependencies so `npm install` succeeds, and correct the audit router scoring loop so it iterates keywords and applies their weights, and ensure the audit router-replay loads the shared register that scoring and remediation require.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Regenerate the md-generator backend `package.json` from `package-lock.json` plus the documented dependencies, so `cd backend && npm install` succeeds.
- Fix the audit router scoring loop so it iterates the keyword list and applies each intent's configured weight, making the router parseable and runnable as written.
- Ensure the audit router-replay loads `../shared/register.md` so register-gated scoring and transform remediation have the posture they require.

### Out of Scope
- The broader shared-register loader mechanism for motion and interface, which is `../016-register-loader-contract`. This phase only ensures the audit replay loads the register, consistent with that loader work.
- Any md-generator workflow, alias, or fixture additions, which are `../018-routing-wiring`, `../020-benchmark-fixtures`, and `../021-content-topups`.
- A second backend or crawler, and any change to extraction fidelity.

### Inputs (read-only)
- The bug evidence: `../015-per-skill-improvement-research/005-md-generator/research/lineages/gpt55fast/research.md` (P1 setup viability), `../015-per-skill-improvement-research/004-audit/research/lineages/gpt55fast/research.md` (R1 keyword loop and register), and `../015-per-skill-improvement-research/implementation-summary.md` ("One real bug").
- The live md-generator `backend/package-lock.json` and `backend/README.md`, and the live `design-audit/SKILL.md` router pseudocode.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-md-generator/backend/package.json` | Created | Regenerated from `package-lock.json` root metadata plus the documented dependencies, devDependencies, and bin, so `npm install` succeeds |
| `.opencode/skills/sk-design/design-audit/SKILL.md` | Updated | Fix the scoring loop to iterate `(keyword, weight)` correctly and ensure the router-replay loads `../shared/register.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The md-generator backend setup works | `.opencode/skills/sk-design/design-md-generator/backend/package.json` exists, is consistent with the lockfile, and `cd backend && npm install` succeeds |
| REQ-002 | The audit router scoring loop runs and applies weights | The loop iterates the keyword list and adds each intent's configured weight, so the router parses and runs as written rather than crashing on tuple unpacking |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The audit router-replay loads the shared register | A router-replay of register-gated audit prompts includes `../shared/register.md` in the loaded resources |
| REQ-004 | The fixes validate cleanly | `validate.sh --strict` passes on this packet, and the audit router change is consistent with the `../016-register-loader-contract` loader mechanism |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npm install` succeeds in the md-generator backend because `package.json` is regenerated from the lockfile and documented dependencies.
- **SC-002**: The audit router parses and runs with a correct `(keyword, weight)` scoring loop, the router-replay loads the shared register, and `validate.sh --strict` passes on this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The regenerated `package.json` drifts from the lockfile | `npm ci` or install fails or pulls wrong versions | Derive name, version, dependencies, devDependencies, and bin from the lockfile root metadata and the documented dependency list, then run install to confirm |
| Risk | The scoring-loop fix changes routing outcomes unexpectedly | Audit intents reorder or misroute | Preserve the configured weights exactly and confirm the five representative audit prompts still route to the same intents |
| Risk | The register-load fix duplicates the 016 loader | Double-load or conflicting mechanisms | Use the same loader mechanism 016 establishes, do not add a second one |
| Dependency | `../015-per-skill-improvement-research/004-audit/research/lineages/gpt55fast/research.md` (R1) | The audit bug shape cannot be grounded | Read R1 for the loop defect and the register-load gap |
| Dependency | `../016-register-loader-contract` | The register-load fix needs the shared loader | Sequence after or alongside 016 and reuse its mechanism |
| Dependency | The live md-generator `backend/package-lock.json` | The manifest cannot be regenerated faithfully | Read the lockfile root metadata and the backend README dependency list before authoring `package.json` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

| Category | Requirement |
|----------|-------------|
| Reliability | The regenerated manifest must produce a reproducible install that matches the committed lockfile, not a floating dependency set |
| Correctness | The scoring loop must apply each intent's configured weight, not treat all keywords as weight one |
| Maintainability | The audit register-load reuses the 016 loader mechanism rather than introducing a parallel path |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A lockfile that declares dependencies the README does not list, or vice versa, must be reconciled rather than silently dropped.
- An audit intent whose keyword list is empty must not crash the corrected loop.
- A non-register audit route (a focused a11y or anti-pattern prompt) must still route correctly after the scoring-loop fix.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

Low. Two isolated, well-characterized bugs: a regenerated manifest file and a small router-loop correction plus a register-load that reuses the 016 mechanism. The care points are matching the lockfile faithfully and preserving the configured intent weights.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Whether `package.json` should be regenerated from the lockfile alone or reconciled against the backend README dependency list when the two differ: the implementing subagent reconciles both sources and confirms with a clean install.
- Whether the audit register-load lands here or is fully delegated to `../016-register-loader-contract`: this phase ensures the audit replay loads the register and reuses 016's mechanism, avoiding a second loader.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
