---
title: "Implementation Plan: deep-loop parent-skill alignment"
description: "Staged, gated plan to align the deep-loop parent-skill family with the phase-001 mechanism and the sk-design parent-skill conventions. Mirrors the staged 154 conversion: recovery baseline per stage, lowest-blast structural fixes first, invokable-hub routing and runtime reconciliation last, validation gate at the end."
trigger_phrases:
  - "deep-loop alignment plan"
  - "deep-loop staged conversion"
  - "ai-council rename plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the staged alignment plan"
    next_safe_action: "Gate, then run Stage 0 inventory + recovery baseline"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-155-002-deep-loop-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: deep-loop parent-skill alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
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
| **Language/Stack** | Skill markdown + JSON (`SKILL.md`, `mode-registry.json`); TypeScript + Python advisor projection; YAML command/agent assets |
| **Framework** | OpenCode / Claude-Code runtime skill discovery; Skill Advisor; the deep-loop parent-skill pattern |
| **Storage** | None |
| **Testing** | `package_skill.py --check`; advisor + skill-graph rebuilds; routing-parity fixtures; `validate.sh --recursive`; manual `Skill()` + `/deep:*` probes |

### Overview
Mirror the proven 154 conversion: staged, each stage gated, a recovery baseline before each mutation, lowest-blast structural fixes first, the higher-blast routing/runtime work last, one validation gate at the end. Do not change deep-loop's workflow behavior — only its parent-skill structure and invocation surface. Work in a worktree if the owner's branch is active.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified (phase 001 mechanism; 154 precedent)

### Definition of Done
- [ ] All acceptance criteria (R1–R5) met
- [ ] All gates green (`--check`, advisor/skill-graph rebuild, routing fixtures, `validate.sh`)
- [ ] Docs updated (spec/plan/tasks/decision-record)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parent skill with nested mode packets: one advisor-routable hub `SKILL.md`, one declarative `mode-registry.json`, exactly one hub `graph-metadata.json`, N self-contained mode packets with zero `graph-metadata.json`, and a non-discoverable `shared/` helper layer. deep-loop already follows this shape; the alignment retrofits invokable-hub routing and resolves the `name == folder` and feature-catalog deviations.

### Key Components
- **deep-loop hub** (`deep-loop-workflows/SKILL.md` + `mode-registry.json`): the invocable identity; gains Option E routing so `Skill(deep-loop-workflows[,hint])` resolves a nested mode.
- **Five mode packets** (`deep-research`, `deep-review`, `deep-improvement`, `deep-context`, `ai-council`): each must reach `name == folder`; `ai-council` is the grandfathered exception R2 resolves.
- **deep-loop-runtime**: executor-config, fanout, and the deep-loop-specific advisor merged-identity projection (`lib/scorer/aliases.ts` + `skill_advisor.py`); reconciled in R4.

### Data Flow
Today an operator request reaches a deep mode through a `/deep:*` command or an agent type, not through `Skill()`. After Stage 3, `Skill(deep-loop-workflows)` with a mode hint routes through the hub to the nested packet, while `/deep:*` commands and agents remain as complementary surfaces and the single advisor identity is preserved.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

This packet is plan-only, so no surface changes here. The table records the surfaces the staged execution will touch so each stage can scope them.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deep-loop-workflows/SKILL.md` + `mode-registry.json` | Hub identity and declarative mode source of truth | Stage 3 adds Option E hub routing | `Skill(deep-loop-workflows)` reaches a mode; `package_skill.py --check` |
| `ai-council` packet folder + `SKILL.md` name | Grandfathered `name != folder` | Stage 1 renames folder → `deep-ai-council` (ADR-001) | `package_skill.py --check`; `rg -n "ai-council" .opencode` zero broken refs |
| Per-mode `feature_catalog/` (five modes) | Catalog docs, some unearned | Stage 2 keeps where earned, removes the rest (ADR-003) | No dangling `feature_catalog` refs; `--check` green |
| `deep-loop-runtime` (executor-config, fanout, advisor projection) | Runtime config + merged-identity layer | Stage 4 verifies assumptions; evaluates merged-identity keep/simplify (ADR-002) | Runtime path/identity assumptions hold; `advisor_rebuild` + `skill_graph_validate` clean |
| Advisor projection maps (Python + TypeScript) | Drift-guarded merged-identity maps | Stage 4 keeps or simplifies per ADR-002 | Routing-parity fixtures; drift-guard test |

Required inventories (for Stage 0, not run here):
- Every `ai-council` reference: `rg -n "ai-council" .opencode/skills .opencode/commands .opencode/agents`.
- Per-mode feature-catalog contents: enumerate each `feature_catalog/` under the five mode packets.
- Runtime assumptions: `rg -n "deep-loop-workflows|ai-council|graph-metadata" .opencode/skills/deep-loop-runtime`.
- Invariant: exactly one `graph-metadata.json` per parent skill, `skill_id == folder`, zero below it.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Structural alignment (Stages 0–2; lowest blast first)
- [ ] Stage 0 — Inventory + baseline: record a recovery baseline; inventory every `ai-council` reference, each mode's `feature_catalog/` contents, and `deep-loop-runtime` path/identity assumptions + the merged-identity projection sites.
- [ ] Stage 1 — `name == folder` (R2): resolve the `ai-council`/`deep-ai-council` mismatch (preferred: rename folder → `deep-ai-council`); rewire every reference from Stage 0's inventory.
- [ ] Stage 2 — feature-catalog hygiene (R3): apply the ADR-003 ruling; keep `feature_catalog/` only where earned, remove the rest, repoint references.

### Phase 2: Routing + runtime (Stages 3–4; higher blast)
- [ ] Stage 3 — invokable-hub routing (R1): retrofit Option E onto the deep-loop hub `SKILL.md` + `mode-registry.json` routing so `Skill(deep-loop-workflows[,hint])` resolves a mode; keep `/deep:*` + agents.
- [ ] Stage 4 — runtime reconciliation (R4): verify `deep-loop-runtime` assumptions post-1–3; evaluate the merged-identity layer (keep vs simplify) and record the decision (ADR-002).

### Phase 3: Validation (Stage 5)
- [ ] Stage 5 — validation (R5): `package_skill.py --check` (hub + packets); `advisor_rebuild` + `skill_graph_validate`; routing fixtures; `validate.sh --recursive`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Advisor projection maps equal registry projection (if merged-identity kept) | vitest drift-guard fixture |
| Integration | A deep-loop query routes to `deep-loop-workflows`; single skill-to-mode mapping | routing-parity vitest fixtures |
| Packaging | `name == folder` for hub + all packets | `package_skill.py --check` |
| Manual | `Skill(deep-loop-workflows[,hint])` reaches a mode; `/deep:*` + agents still function | Runtime probe |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 Option E mechanism | Internal | Green | Defines the invokable-hub routing this packet retrofits |
| Spec 154 staged conversion | Internal | Green | Execution precedent and source of the sk-design conventions |
| deep-loop-runtime current assumptions | Internal | Amber | R4 must verify them before any simplification |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A stage gate fails (broken `ai-council` ref, lost single identity, regressed routing, or a red validation gate).
- **Procedure**: Restore the per-stage recovery baseline recorded in Stage 0 / before the failing stage. Because each stage is gated and baselined, rollback is to the last green stage rather than a full revert.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Stage 0 (Inventory+baseline) ──► Stage 1 (name==folder) ──► Stage 2 (catalog) ──► Stage 3 (routing) ──► Stage 4 (runtime) ──► Stage 5 (validation)
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| 0 Inventory + baseline | User gate | All later stages |
| 1 name==folder (R2) | Stage 0 | Stage 2, Stage 3 |
| 2 feature-catalog (R3) | Stage 1 | Stage 5 |
| 3 invokable-hub (R1) | Stage 1 | Stage 4 |
| 4 runtime (R4) | Stage 3 | Stage 5 |
| 5 validation (R5) | Stages 1–4 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| 0 Inventory + baseline | Low | Bounded recon sweep + baseline |
| 1 name==folder | Med | Rename plus reference rewire across commands/agents/registry/runtime |
| 2 feature-catalog | Low | Per-mode keep/remove + repoint |
| 3 invokable-hub routing | Med | Hub router + registry routing retrofit |
| 4 runtime reconciliation | Med | Assumption check + merged-identity evaluation |
| 5 validation | Low | Gate re-runs |
| **Total** | | **Dominated by the rename rewire (Stage 1) and the routing retrofit (Stage 3)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Recovery baseline recorded before each mutating stage
- [ ] Worktree used if the owner's branch is active
- [ ] Single-identity invariant confirmed before and after Stage 3

### Rollback Procedure
1. Identify the failing stage from its exit gate.
2. Restore the recovery baseline recorded before that stage.
3. Re-run the prior stage's exit gate to confirm the last green state.
4. Re-scope the failing stage before retrying; no user-facing rollout occurs.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (skill/doc structure only)
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│ Stage 1          │──►│ Stage 3          │──►│ Stage 4          │
│ name==folder     │   │ invokable-hub    │   │ runtime reconcile│
└──────────────────┘   └──────────────────┘   └──────────────────┘
        │                                              │
        ▼                                              ▼
┌──────────────────┐                          ┌──────────────────┐
│ Stage 2          │─────────────────────────►│ Stage 5          │
│ feature-catalog  │                          │ validation       │
└──────────────────┘                          └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Inventory + baseline | User gate | Reference + catalog + runtime inventory | All stages |
| name==folder rename | Inventory | Check-clean packets | Catalog, routing |
| invokable-hub routing | Rename | `Skill()` reachability | Runtime reconcile |
| Runtime reconciliation | Routing | Merged-identity decision | Validation |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Stage 0 inventory + baseline** - bounded - CRITICAL
2. **Stage 1 name==folder rename + rewire** - bounded - CRITICAL
3. **Stage 3 invokable-hub routing retrofit** - bounded - CRITICAL
4. **Stage 5 validation gate** - bounded - CRITICAL

**Total Critical Path**: Stage 0 → 1 → 3 → 5 is the spine; Stage 2 and Stage 4 branch off and rejoin at Stage 5.

**Parallel Opportunities**:
- Stage 2 (feature-catalog hygiene) can run alongside Stage 3 once Stage 1 is green.
- The ADR-002 merged-identity evidence-gathering can begin while Stage 3 routing is in progress.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Family is check-clean | `package_skill.py --check` passes for hub + all packets; zero broken `ai-council` refs | Stage 1 |
| M2 | Native reachability | `Skill(deep-loop-workflows)` reaches a mode with one graph-metadata preserved | Stage 3 |
| M3 | Aligned + validated | All gates green; `/deep:*` + agents still function; merged-identity decision recorded | Stage 5 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: ai-council name/folder resolution (see decision-record.md)

**Status**: Proposed (gated to execution)

**Context**: The `ai-council` packet has `name == deep-ai-council` but folder `ai-council`, failing `package_skill.py --check`. The full framing and the two other alignment decisions live in `decision-record.md`.

**Decision**: Rename the folder to `deep-ai-council` (recommended); finalized at the gate. The merged-identity keep/simplify call (ADR-002) and the feature-catalog ruling (ADR-003) are recorded there too.

**Consequences**:
- Resolving the rename unblocks a clean family `--check`.
- The cost is a one-pass reference rewire across commands, agents, registry, and runtime.

**Alternatives Rejected**:
- Renaming the packet to `ai-council`: rejected because it breaks the `deep-<mode>` convention and the established `deep-ai-council` identity the advisor and agents already use.
