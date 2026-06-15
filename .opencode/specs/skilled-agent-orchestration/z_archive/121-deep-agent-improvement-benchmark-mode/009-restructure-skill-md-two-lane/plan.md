---
title: "Implementation Plan: SKILL.md two-lane restructure"
description: "Lift the model-benchmark Mode 4 content out of the agent-improvement lane into a co-equal Lane B section, fix the SKILL.md lane cross-references, and confirm the smart-router MODEL_BENCHMARK intent has a matching RESOURCE_MAP entry, all inside SKILL.md with no runtime change."
trigger_phrases:
  - "skill-md two-lane plan"
  - "co-equal lane restructure plan"
  - "model-benchmark router intent plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/009-restructure-skill-md-two-lane"
    last_updated_at: "2026-05-29T10:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase 009 plan"
    next_safe_action: "Restructure SKILL.md into two co-equal lanes + align router"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-009-docs"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: SKILL.md two-lane restructure

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Skill documentation (markdown) with an embedded Python smart-router pseudocode block |
| **Framework** | deep-agent-improvement skill plus sk-doc DQI and HVR conventions |
| **Storage** | None (single SKILL.md edit, no runtime state) |
| **Testing** | sk-doc DQI score, HVR scan, validate.sh strict, router self-consistency read-through |

### Overview
This phase aligns SKILL.md with the two-lane reality the command layer already ships. The "Mode 4: Model-Benchmark" content currently nested inside the agent-improvement lane section is lifted into a co-equal Lane B section, the §1 lane cross-references are corrected to point at the real Lane B section, and the smart-router keeps its MODEL_BENCHMARK intent with a matching RESOURCE_MAP entry. All work stays inside SKILL.md, and no script, reference, asset, or runtime contract changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Current SKILL.md structure and router pseudocode read as the input baseline

### Definition of Done
- [ ] Two co-equal lanes present, lane cross-references correct, MODEL_BENCHMARK router intent confirmed
- [ ] DQI excellent (>=90), HVR clean, no ToC, no content regression
- [ ] Docs updated (spec/plan/tasks/checklist) and validate.sh strict passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation restructure with router-key alignment. The lane content is reorganized into peer sections, and the smart-router intent map is confirmed to carry MODEL_BENCHMARK as a first-class key with a matching RESOURCE_MAP entry.

### Key Components
- **Lane A section (agent-improvement)**: The proposal-first loop, modes, 5-dimension framework, and promotion/recovery guidance for improving a bounded agent `.md` file.
- **Lane B section (model-benchmark)**: A co-equal peer section that describes benchmarking a model or prompt framework via `loop-host.cjs --mode=model-benchmark`, the dispatcher, scorer selection, mode-aware records, and hardening env gates. This is the lifted-and-promoted Mode 4 content.
- **Shared runtime-contract sections**: Stop-reason taxonomy, journal protocol, legal-stop gates, and rules that both lanes reuse, kept once and referenced by both lanes.
- **Smart-router intent map**: INTENT_SIGNALS and RESOURCE_MAP carry a MODEL_BENCHMARK key whose resources exist, kept internally consistent after the restructure.

### Data Flow
A reader or the router enters SKILL.md, sees two co-equal lanes in §1, and follows either Lane A or Lane B. The router scores intents, selects MODEL_BENCHMARK for benchmark-phrased tasks, and loads the matching RESOURCE_MAP entry. Lane-specific guidance loads only when its intent matches, while shared runtime contracts stay available to both lanes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase is a documentation restructure, not a bug fix, but SKILL.md is the live skill surface and the router pseudocode is read by the loader, so the inventory below pins what moves and what must stay internally consistent.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| SKILL.md §1 lane table + cross-reference | Declares two lanes, points Lane B at a wrong section | update | §1 "Lane B is detailed in §N" resolves to the real Lane B section |
| SKILL.md §3 "Mode 4: Model-Benchmark" block | Bolt-on inside the agent-improvement lane | lift to co-equal Lane B section | model-benchmark is no longer nested under the agent-improvement lane |
| SKILL.md smart-router INTENT_SIGNALS + RESOURCE_MAP | Carries a MODEL_BENCHMARK key | verify/keep consistent | MODEL_BENCHMARK intent has a matching RESOURCE_MAP entry pointing at existing references |
| SKILL.md runtime-contract + rules sections | Shared by both lanes | unchanged (preserve) | grep confirms stop-reason taxonomy, journal, legal-stop, and rules content is retained |

Required inventories:
- Same-class producers: `rg -n 'Mode 4|Lane A|Lane B|co-equal' .opencode/skills/deep-agent-improvement/SKILL.md`.
- Consumers of changed symbols: `rg -n 'MODEL_BENCHMARK|INTENT_SIGNALS|RESOURCE_MAP' .opencode/skills/deep-agent-improvement/SKILL.md`.
- Matrix axes: lane (A, B) x router intent (MODEL_BENCHMARK present, RESOURCE_MAP entry present). The read-through confirms both lanes resolve and the router key is consistent.
- Algorithm invariant: no content regression. Every runtime contract, rule, and reference present before the restructure is still present after it, only reorganized.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read the current SKILL.md structure, the §1 lane table, the §3 Mode 4 block, and the smart-router pseudocode as the input baseline
- [ ] Confirm the phase 008 two-lane command reality so the doc matches the shipped commands
- [ ] Confirm the MODEL_BENCHMARK RESOURCE_MAP targets exist before the phase 010 reorg

### Phase 2: Core Implementation
- [ ] Restructure §1 so Lane A and Lane B read as co-equal and the Lane B cross-reference points at the real section
- [ ] Lift the Mode 4 content into a co-equal Lane B section, preserving its entry point, dispatcher, scorer, records, and env-gate detail
- [ ] Confirm the smart-router MODEL_BENCHMARK intent and its RESOURCE_MAP entry stay internally consistent after the restructure
- [ ] Keep shared runtime-contract and rules sections intact and referenced by both lanes

### Phase 3: Verification
- [ ] Two co-equal lanes present and cross-references correct (REQ-001, REQ-003)
- [ ] MODEL_BENCHMARK router intent plus RESOURCE_MAP entry present (REQ-002)
- [ ] DQI excellent, HVR clean, no ToC, no content regression, and validate.sh strict passes
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Doc quality | SKILL.md DQI score | sk-doc DQI check (target >=90) |
| Static | HVR conventions and no ToC | HVR scan (no em-dashes, no semicolons in prose, no Table-of-Contents) |
| Manual | Two-lane structure, lane cross-references, router self-consistency | Read-through plus grep of lane and router keys |
| Validation | Packet docs and placeholders | `validate.sh <009-folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Two-lane command layer (phase 008) | Internal | Green | The doc would describe a reality the commands do not ship |
| MODEL_BENCHMARK RESOURCE_MAP targets (current references) | Internal | Green | The router would point at a missing reference |
| sk-doc DQI + HVR conventions | Internal | Green | Cannot confirm DQI excellent or HVR cleanliness |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: DQI regresses below excellent, content is dropped, or the router intent map becomes internally inconsistent.
- **Procedure**: Revert the SKILL.md edit to its pre-phase DQI-97 form. No other files are touched, so rollback is confined to a single document.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Restructure) ──► Phase 3 (Verification)
```

Within Phase 2, the §1 cross-reference fix and the Lane B lift touch the same file and must proceed in order: lift the Lane B section first, then fix the §1 pointer to its new location.

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Restructure |
| Lane B lift | Setup | §1 cross-reference fix, router consistency |
| §1 cross-reference fix | Lane B lift | Verification (REQ-003) |
| Router consistency | Lane B lift | Verification (REQ-002) |
| Verification | Restructure | Done |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 to 20 min |
| Lane B lift | Med | 1 to 1.5 h (preserve all Mode 4 detail) |
| §1 cross-reference fix | Low | 15 min |
| Router consistency | Low | 20 to 30 min |
| Verification | Low | 30 to 45 min (DQI + HVR + validate) |
| **Total** | | **2.5 to 3.5 h** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Capture the current SKILL.md DQI score (97) as the baseline to beat
- [ ] Inventory the Mode 4 content (entry point, dispatcher, scorer, records, env gates) before lifting it
- [ ] Confirm the MODEL_BENCHMARK RESOURCE_MAP targets resolve before the restructure

### Rollback Procedure
1. Revert the SKILL.md edit to the pre-phase form
2. Re-run the DQI check to confirm the baseline score is restored
3. Confirm no other packet file was touched

### Data Reversal
- **Has data migrations?** No. This phase edits a single documentation file and touches no runtime state or schema.
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
