---
title: "Plan: sk-design shared-register loader contract"
description: "Execution plan for the highest-leverage family fix: make the parent ../shared/register.md loadable by the motion, audit, and interface routers through a sk-design hub preamble or a register-scoped parent-shared allowlist, then rerun the routing benchmark for the three modes. Not started."
trigger_phrases:
  - "sk-design register loader plan"
  - "shared register preload plan"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/016-register-loader-contract"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Drafted the loader-contract approach from ADR-002"
    next_safe_action: "A later subagent picks the preamble or allowlist shape and implements it"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-016-register-loader-contract"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: sk-design shared-register loader contract

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
| **Language/Stack** | sk-design hub and mode-packet routing config plus SKILL.md router pseudocode |
| **Framework** | sk-design nested-packet parent with a packet-local path guard, `package_skill.py` check |
| **Storage** | `.opencode/skills/sk-design/` hub and the design-motion, design-audit, design-interface packets |
| **Testing** | Routing benchmark rerun for the three modes, `package_skill.py --check`, `validate.sh --strict` |

### Overview
The 015 research synthesis found one fix that repairs several modes at once: the shared register the modes mandate cannot load through the packet-local guard. This plan implements the ADR-002 direction. It adds a loader mechanism, either a sk-design hub routing preamble that pre-loads `../shared/register.md` before mode routing or an explicit parent-shared allowlist scoped to the register path, then aligns the motion, audit, and interface routers and loading tables with their ALWAYS contract, and reruns the routing benchmark for the three modes to confirm the register loads on every mandatory task.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `../015-per-skill-improvement-research/decision-record.md` ADR-002 read as the grounding direction
- [ ] The live sk-design hub router and `_guard_in_skill()` scope confirmed on the tree
- [ ] The motion, audit, and interface SKILL.md resource-loading tables confirmed to mandate the shared register

### Definition of Done
- [ ] The motion, audit, and interface routers load `../shared/register.md` on every mandatory task
- [ ] The fix is a hub preamble or a register-scoped allowlist, with no broad guard relaxation
- [ ] The routing benchmark rerun for the three modes confirms the register loads on every mandatory task
- [ ] `package_skill.py --check` passes on every touched skill and `validate.sh --strict` passes on this packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared-layer loading fix: correct the resource-loading contract once at the hub or allowlist layer so the parent register reaches the three modes whose prose mandates it, rather than patching each mode router in isolation.

### Key Components
- **Loader mechanism**: a sk-design hub routing preamble that pre-loads `../shared/register.md`, or an explicit parent-shared allowlist entry scoped to that single path.
- **design-motion router**: aligned so the ALWAYS contract (register plus animation decision framework) loads on every motion task, not just `corpus_map.md`.
- **design-audit router**: aligned so register-gated scoring and transform remediation load the shared register.
- **design-interface router**: the affected grounding and preflight branches load the shared register per the documented contract.
- **Benchmark rerun**: the routing benchmark for motion, audit, and interface, confirming the register loads on every mandatory task.

### Data Flow
`015 decision-record (ADR-002)` plus the live hub guard and the three mode loading tables -> choose the preamble or allowlist mechanism -> wire the loader and align the three routers -> rerun the routing benchmark for the three modes -> record the register-loads-on-every-task evidence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase changes routing and resource-loading configuration so the parent shared register reaches the modes that mandate it. It changes no design content and no register content.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-design/SKILL.md` or `mode-registry.json` | hub router and registry | edit (preamble or allowlist) | shared-register pre-load present, guard otherwise unchanged |
| `design-motion/SKILL.md` | motion router and loading table | edit | register loads on every motion task per the ALWAYS contract |
| `design-audit/SKILL.md` | audit router and loading table | edit | register loads for scoring and transform remediation |
| `design-interface/SKILL.md` | interface router branches | edit | register loads on the affected grounding and preflight branches |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `../015-per-skill-improvement-research/decision-record.md` ADR-002 as the grounding direction
- [ ] Confirm the sk-design hub router and the `_guard_in_skill()` scope on the live tree
- [ ] Confirm the motion, audit, and interface loading tables mandate `../shared/register.md`

### Phase 2: Core Implementation
- [ ] Choose and wire the loader mechanism: a hub routing preamble that pre-loads the shared register, or a parent-shared allowlist scoped to the register path
- [ ] Align the design-motion router so the register plus animation decision framework load on every motion task
- [ ] Align the design-audit router so the register loads for scoring and transform remediation
- [ ] Align the affected design-interface routing branches so the register loads per contract

### Phase 3: Verification
- [ ] Rerun the routing benchmark for motion, audit, and interface and confirm the register loads on every mandatory task
- [ ] Run `package_skill.py --check` on every touched skill (exit 0)
- [ ] Run `validate.sh --strict` on this packet and update the affected manual playbook expected resources
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Routing | Motion, audit, interface register loading | Routing benchmark rerun for the three modes |
| Packaging | Every touched sk-design skill | `package_skill.py --check` (exit 0) |
| Static | This packet's spec docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../015-per-skill-improvement-research/decision-record.md` (ADR-002) | Internal | Green | Direction cannot be grounded |
| The live sk-design hub guard | Internal | Green | The loader mechanism cannot be chosen safely |
| The routing benchmark harness | Internal | Green | The acceptance evidence cannot be produced |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:phase-deps -->
## 7. PHASE DEPENDENCIES

| Phase | Depends On | Why |
|-------|-----------|-----|
| Phase 1 Setup | `../015-per-skill-improvement-research` (ADR-002) | The loader direction and the per-mode evidence come from the research synthesis |
| Phase 2 Implementation | Phase 1 | The loader mechanism choice needs the confirmed guard scope before any router edit |
| Phase 3 Verification | Phase 2 | The benchmark rerun and packaging checks need the loader and the three aligned routers in place |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 8. EFFORT ESTIMATE

| Phase | Effort | Notes |
|-------|--------|-------|
| Phase 1 Setup | S | Read ADR-002 and confirm the hub guard scope and the three loading tables |
| Phase 2 Implementation | M | One loader mechanism plus three router alignments and the playbook expected-resource updates |
| Phase 3 Verification | S | Benchmark rerun for three modes plus `package_skill.py --check` and `validate.sh --strict` |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:rollback -->
## 9. ROLLBACK PLAN

- **Trigger**: The allowlist widens the guard, a mode regresses on the benchmark, or the loader does not actually deliver the register.
- **Procedure**: The loader change is additive routing config. To revert, remove the allowlist entry or the hub preamble so the router falls back to packet-local loading. No design content or register content is mutated, so rollback is a config revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

| Trigger | Detection | Action | Owner |
|---------|-----------|--------|-------|
| Guard bypass widened beyond the register path | `package_skill.py --check` or a guard review flags a broad allowlist | Remove the allowlist entry, fall back to the hub-preamble approach | implementing subagent |
| A mode regresses routing economy | Benchmark wasted-load count rises for that mode | Scope the pre-load to register-gated intents only and rerun the benchmark | implementing subagent |
| The register fails to load despite the change | Benchmark shows the register absent on a mandatory task | Re-check the loader path resolution against the live guard, fix, and rerun | implementing subagent |
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
