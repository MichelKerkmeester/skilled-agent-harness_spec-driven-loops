---
title: "Implementation Plan: Command lane-asking for the model-benchmark lane"
description: "Additive lane resolution in the agent-improvement command plus two Lane B workflow YAMLs, a dedicated model-benchmark command, a gemini mirror, and README/advisor registration, all reusing the shipped model-benchmark runtime contract."
trigger_phrases:
  - "command lane-asking plan"
  - "model-benchmark command plan"
  - "lane resolution branch"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/008-command-lane-asking"
    last_updated_at: "2026-05-29T09:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase 008 plan"
    next_safe_action: "Build the lane-asking branch + Lane B YAMLs + dedicated command"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-008-docs"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Command lane-asking for the model-benchmark lane

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Command markdown, YAML workflow assets, TOML gemini mirror, TypeScript advisor scorer |
| **Framework** | deep-agent-improvement skill + deep-loop-runtime; command-spec-kit command layer |
| **Storage** | None (command and YAML surfaces; runtime state owned by the existing loop-host) |
| **Testing** | `skill_advisor.py` routing check, loop-host model-benchmark end-to-end run, validate.sh strict |

### Overview
This phase wires the model-benchmark lane into the command layer without touching the runtime. The agent-improvement command gains an additive use-case lane question that branches to either lane, two new Lane B workflow YAMLs drive the existing `loop-host.cjs --mode=model-benchmark` contract, a dedicated `/deep:start-model-benchmark-loop` command and gemini mirror give the lane a direct entry, and the README plus advisor are registered so both lanes are discoverable.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Lane A behavioral identity confirmed and Lane B reaches benchmark-complete
- [ ] Docs updated (spec/plan/tasks/checklist)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive command-layer routing. The agent-improvement command resolves a use-case lane and dispatches into one of two workflow YAMLs. The model-benchmark workflow YAMLs are thin drivers over the already-shipped loop-host runtime contract.

### Key Components
- **Lane-asking branch (`start-agent-improvement-loop.md`)**: Asks the use-case lane and routes additively to Lane A (agent-improvement) or Lane B (model-benchmark) so neither lane is silently defaulted.
- **Lane B workflow YAMLs (`deep_start-model-benchmark-loop_auto.yaml`, `_confirm.yaml`)**: Drive `node loop-host.cjs --mode=model-benchmark --profile <profile.json> --outputs-dir <dir> --scorer <pattern|5dim> --grader <noop|mock|llm>`, mirroring the structure of the Lane A YAMLs.
- **Dedicated command (`start-model-benchmark-loop.md`) + gemini mirror (`.toml`)**: A direct `/deep:start-model-benchmark-loop` entry that routes into the same Lane B workflow.
- **Advisor + README registration**: `aliases.ts` and `lanes/explicit.ts` route the new command to the deep-model-benchmark skill, and `README.txt` lists both lanes.

### Data Flow
User invokes a command. The agent-improvement command asks the use-case lane and branches, or the dedicated command enters Lane B directly. The selected Lane B YAML runs loop-host with `--mode=model-benchmark`, which executes `materialize-benchmark-fixtures.cjs` then `run-benchmark.cjs` (EC-5 ordering), scores with the chosen scorer, and on promotion calls `promote-candidate.cjs --benchmark-report`. State records carry `mode: model-benchmark` and reports carry `scoringMethod: pattern|5dim`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase is additive command-layer wiring, not a bug fix, but the agent-improvement command is a shared surface whose Lane A behavior must stay identical, so the producer/consumer inventory below pins what changes and what must not.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `start-agent-improvement-loop.md` | Lane A command entry | update (add additive lane question + branch) | CMD-1 behavioral identity: Lane A workflow unchanged |
| `deep_start-agent-improvement-loop_{auto,confirm}.yaml` | Lane A workflow YAMLs | unchanged (template for the Lane B copies) | grep diff shows no change to Lane A YAMLs |
| `deep_start-model-benchmark-loop_{auto,confirm}.yaml` | Lane B workflow YAMLs | create | Lane B end-to-end reaches benchmark-complete |
| `aliases.ts` + `lanes/explicit.ts` | Advisor routing | verify/update | `skill_advisor.py` routes both commands to their skills |
| `README.txt` + `start-model-benchmark-loop.toml` | Discovery surfaces | create/update | README lists both lanes; gemini mirror present |

Required inventories:
- Same-class producers: `rg -n 'start-agent-improvement-loop|start-model-benchmark-loop' .opencode/commands .gemini/commands`.
- Consumers of changed symbols: `rg -n 'start-model-benchmark-loop|deep-model-benchmark' . --glob '*.ts' --glob '*.md' --glob '*.txt' --glob '*.toml'`.
- Matrix axes: lane (A, B) x mode (auto, confirm) x scorer (pattern, 5dim) x grader (noop, mock, llm); the end-to-end gate exercises Lane B auto with the default profile, pattern scorer, noop grader.
- Algorithm invariant: lane resolution is additive; selecting Lane A must reproduce the pre-phase Lane A workflow exactly.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the model-benchmark runtime contract (loop-host flags, default profile, fixtures) from phases 003 to 005
- [ ] Read the Lane A command and both Lane A YAMLs as the structural template
- [ ] Confirm the advisor source already references the new command and decide verify-vs-edit

### Phase 2: Core Implementation
- [ ] Add the use-case lane question plus additive lane-resolution branch to `start-agent-improvement-loop.md`
- [ ] Create the two Lane B workflow YAMLs driving `loop-host.cjs --mode=model-benchmark`
- [ ] Create the dedicated `start-model-benchmark-loop.md` command and the gemini `.toml` mirror
- [ ] Register the command in `README.txt` and confirm advisor routing for both lanes

### Phase 3: Verification
- [ ] CMD-1 Lane A behavioral identity confirmed
- [ ] Lane B end-to-end run reaches benchmark-complete
- [ ] Advisor routes both lanes; README and gemini mirror present; no placeholders remain
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Advisor routing for both commands | `skill_advisor.py "[command]" --threshold 0.8` |
| Integration | Lane B end-to-end benchmark-complete | `node loop-host.cjs --mode=model-benchmark` with default profile |
| Manual | Lane A behavioral identity and lane-asking branch | Read-through plus diff of the Lane A workflow |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Model-benchmark runtime contract (phases 003 to 005) | Internal | Green | No Lane B run; this phase only wires the command surface |
| Lane A command + YAML assets | Internal | Green | No structural template for the Lane B copies |
| skill-advisor scorer source | Internal | Green | Cannot verify or register two-lane routing |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Lane A behavioral identity fails, or Lane B cannot reach benchmark-complete.
- **Procedure**: Revert the new command, the two Lane B YAMLs, the gemini mirror, and the README/advisor edits. The agent-improvement command reverts to its pre-phase single-lane form. No runtime files are touched, so rollback is confined to command-layer surfaces.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Implementation) ──► Phase 3 (Verification)
```

Within Phase 2, the Lane B YAMLs, the dedicated command plus gemini mirror, and the README/advisor registration touch disjoint files and can proceed in parallel once the lane-asking branch is in place.

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Lane-asking branch | Setup | CMD-1 identity, dedicated-command routing |
| Lane B YAMLs | Setup | Lane B end-to-end (REQ-002) |
| Dedicated command + gemini mirror | Lane B YAMLs | README/advisor registration |
| README + advisor registration | Dedicated command | Verify REQ-004, REQ-005 |
| Verification | Implementation | Done |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 to 30 min |
| Lane-asking branch | Med | 1 to 1.5 h (preserve Lane A identity) |
| Lane B YAMLs | Med | 1 to 1.5 h (mirror Lane A structure) |
| Dedicated command + gemini mirror | Low | 30 to 45 min |
| README + advisor registration | Low | 30 min |
| Verification | Low | 30 to 45 min (CMD-1 plus one Lane B end-to-end run) |
| **Total** | | **4 to 5.5 h** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Capture the current Lane A workflow as the behavioral-identity baseline before editing the command
- [ ] Confirm the advisor source state for `/deep:start-model-benchmark-loop` before deciding verify-vs-edit
- [ ] Confirm a clean Lane B end-to-end run exists from the runtime before wiring the command driver

### Rollback Procedure
1. Revert the feature commit covering the command, YAMLs, gemini mirror, and README/advisor edits
2. Re-run the Lane A behavioral-identity check to confirm the pre-phase workflow is restored
3. Recompile the advisor if its source was edited, otherwise confirm no advisor change is left behind

### Data Reversal
- **Has data migrations?** No. This phase touches only command-layer surfaces, and the loop-host runtime, its state, and its profiles are untouched.
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
