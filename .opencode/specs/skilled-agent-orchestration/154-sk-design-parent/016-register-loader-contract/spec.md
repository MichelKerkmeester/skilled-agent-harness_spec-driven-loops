---
title: "Feature Specification: sk-design shared-register loader contract"
description: "Planned Level-2 implementation phase: make the parent ../shared/register.md loadable by the motion, audit, and interface mode routers, which today declare it mandatory on every task but cannot load it because it sits outside each mode's packet-local path guard. The highest-leverage family fix named by the 015 research synthesis. Not started."
trigger_phrases:
  - "sk-design shared register loader contract"
  - "design mode router register preload"
  - "parent-shared allowlist sk-design"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/016-register-loader-contract"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the register-loader-contract phase from the 015 highest-leverage finding"
    next_safe_action: "Implement the register preload or allowlist, then rerun the routing benchmark"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-016-register-loader-contract"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-design shared-register loader contract

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
| **Predecessor** | ../015-per-skill-improvement-research/spec.md |
| **Successor** | ../017-real-bugs/spec.md |
| **Handoff Criteria** | The motion, audit, and interface mode routers load `../shared/register.md` on every task that their prose marks mandatory, achieved either through a sk-design hub routing preamble that pre-loads the shared register or an explicit parent-shared allowlist scoped to the register path only, the routing benchmark reruns clean for the three modes and confirms the register loads on every task, `validate.sh --strict` passes, and `package_skill.py --check` passes on every touched skill |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-design mode packets declare the shared register `../shared/register.md` mandatory on every task, but the router path-guard cannot load it because it lives outside each mode's skill root. The motion lineage confirmed it directly: the SKILL prose says every motion task starts with the shared Brand-vs-Product register, yet the router pseudocode defaults to `corpus_map.md` and the guard only allows markdown under `SKILL_ROOT`, so the parent register never loads (`../015-per-skill-improvement-research/003-motion/research/lineages/gpt55fast/research.md`, section 5.1). The audit lineage found the same gap: router replay across five representative audit prompts never loaded `../shared/register.md` even though audit scoring and transform remediation require register posture, and `_guard_in_skill()` is scoped to `SKILL_ROOT` so a naive path entry will not work (`../015-per-skill-improvement-research/004-audit/research/lineages/gpt55fast/research.md`, R1). The interface lineage flagged it partially through its grounding and preflight routing branches (`../015-per-skill-improvement-research/001-interface/research/lineages/gpt55fast/research.md`, section 5). Because the broken contract appears in more than one mode, the 015 synthesis ranked it the single highest-leverage family fix: one shared fix repairs motion, audit, and partly interface at once.

### Purpose
Make the shared register loadable for the modes whose prose mandates it, so the router and the documented workflow agree and every register-gated task starts from the correct Brand-vs-Product posture. This phase implements the fix the 015 decision-record named (ADR-002): a sk-design hub routing preamble that pre-loads the shared register, or an explicit parent-shared allowlist scoped to the register path only, applied to the motion, audit, and interface routers and loaders so they match their stated contract.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A loader mechanism that lets the motion, audit, and interface mode routers load the parent `../shared/register.md`, implemented as either a sk-design hub routing preamble that pre-loads the shared register or an explicit parent-shared allowlist scoped to the register path only.
- Updating the motion, audit, and interface routers and resource-loading tables so the mandatory shared-register load matches the prose contract.
- Rerunning the routing benchmark for the three affected modes to confirm the register loads on every task it marks mandatory.

### Out of Scope
- Broadening the packet-local path guard beyond the explicit shared-register path. The allowlist, if chosen, stays scoped to `../shared/register.md` only and preserves the existing security posture.
- The foundations and md-generator routing and alias work, which is its own phase (`../018-routing-wiring`).
- Any change to the content of `shared/register.md` itself. This phase fixes loading, not register content.

### Inputs (read-only)
- The highest-leverage finding and decision: `../015-per-skill-improvement-research/implementation-summary.md` (synthesis) and `../015-per-skill-improvement-research/decision-record.md` (ADR-002).
- The per-mode evidence: `../015-per-skill-improvement-research/003-motion/research/lineages/gpt55fast/research.md` (section 5.1), `../015-per-skill-improvement-research/004-audit/research/lineages/gpt55fast/research.md` (R1), `../015-per-skill-improvement-research/001-interface/research/lineages/gpt55fast/research.md` (section 5).
- The live `sk-design/` hub, `mode-registry.json`, and the motion, audit, and interface SKILL.md routers, to confirm the guard scope and the loading tables.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/SKILL.md` or `.opencode/skills/sk-design/mode-registry.json` | Update (if hub-preamble chosen) | Add a routing preamble that pre-loads `../shared/register.md` before mode routing, or register the explicit parent-shared allowlist entry |
| `.opencode/skills/sk-design/design-motion/SKILL.md` | Update | Align the router resource loading with the ALWAYS contract so the shared register loads on every motion task |
| `.opencode/skills/sk-design/design-audit/SKILL.md` | Update | Make the router load `../shared/register.md` for register-gated audit scoring and transform remediation |
| `.opencode/skills/sk-design/design-interface/SKILL.md` | Update | Make the affected interface routing branches load the shared register per the documented contract |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The shared register loads for the modes whose prose mandates it | The motion, audit, and interface routers load `../shared/register.md` on every task their prose marks mandatory, verified by a rerun of the routing benchmark for the three modes |
| REQ-002 | The path-guard security posture is preserved | The fix is a sk-design hub preamble pre-load or an allowlist scoped to the `../shared/register.md` path only, with no broad relaxation of the packet-local guard |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The router prose and the loader agree | Each touched mode's resource-loading table and router pseudocode state the shared register as loaded, with no remaining mismatch between the ALWAYS contract and the router default |
| REQ-004 | Packaging stays clean on touched skills | `package_skill.py --check` passes (exit 0) on every touched sk-design skill, and `validate.sh --strict` passes on this packet |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The motion, audit, and interface routers load the shared register on every task their prose marks mandatory, achieved with a sk-design hub preamble or a register-scoped parent-shared allowlist, with the packet-local guard otherwise unchanged.
- **SC-002**: The routing benchmark rerun for the three modes confirms the register loads on every mandatory task, `package_skill.py --check` passes on every touched skill, and `validate.sh --strict` passes on this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The allowlist widens into a general guard bypass | The path-guard security posture weakens | Scope the allowlist to the explicit `../shared/register.md` path only, or prefer the hub-preamble approach that needs no guard change |
| Risk | The loader fix lands but the playbook expected-resources stay stale | Benchmark and manual checks disagree with the corrected router | Update each affected mode's manual playbook expected resources after the loader is corrected |
| Risk | One mode regresses routing economy when the register is added | Wasted-load counts rise | Rerun the benchmark per mode and confirm the register load is the mandated one, not an extra |
| Dependency | `../015-per-skill-improvement-research/decision-record.md` (ADR-002) | Direction cannot be grounded | Implement the allowlisted parent pre-load shape the decision-record ranks highest |
| Dependency | The live `sk-design` hub and `_guard_in_skill()` scope | The guard mechanism is unconfirmed | Read the hub router and the guard before choosing the preamble or allowlist mechanism |
| Dependency | The routing benchmark harness | The acceptance evidence cannot be produced | Rerun the benchmark for motion, audit, and interface after the loader change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

| Category | Requirement |
|----------|-------------|
| Security | The path-guard relaxation, if any, stays scoped to the single `../shared/register.md` path and does not open the packet-local guard to arbitrary parent reads |
| Performance | The shared-register pre-load adds at most one mandated resource load per task, not a per-intent fan-out that raises wasted-load counts |
| Maintainability | One shared loader mechanism serves the three affected modes, so the contract is fixed in one place rather than duplicated per router |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A mode task that does not mandate the register (a pure non-design route-away) must not be forced to load it, so the pre-load applies to register-gated intents, not every prompt.
- The hub preamble and the per-mode loader must not double-load the register and inflate the routed-resource count when both paths are present.
- If `../shared/register.md` is ever missing, the loader must fail visibly rather than silently skip the mandated posture.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

Low-to-moderate. The change is routing and resource-loading configuration in the hub and three mode routers, with no design content or register content change. The main care points are keeping the guard tight (single-path allowlist or guard-free hub preamble) and confirming the benchmark shows the register loading without a wasteful fan-out.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Hub preamble versus parent-shared allowlist: the 015 decision-record ranks the allowlisted parent pre-load highest, but the hub preamble may need no guard change at all. The implementing subagent picks the shape that keeps the guard tightest against the live hub.
- Whether the same loader mechanism should also be offered to foundations and md-generator: this phase scopes to the three modes whose prose mandates the register, and the broader registry and alias work stays in `../018-routing-wiring`.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
