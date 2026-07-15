---
title: "Implementation Plan: deep-loop parent-skill alignment"
description: "Closure execution plan/status for deep-loop parent-skill alignment. R1-R5 are done; NFR-S01 per-mode allowed-tools contract is accepted; the full live-loop e2e remains optional and was not run."
trigger_phrases:
  - "deep-loop alignment plan"
  - "deep-loop staged conversion"
  - "ai-council rename plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/052-deep-loop-unification/010-deep-loop-parent-skill-alignment"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "R5 gates green; runtime reachability confirmed by registration; optional live-loop e2e not run"
    next_safe_action: "Optional: run a full live deep-loop e2e; refresh metadata separately"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-155-003-deep-loop-alignment"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "R1 invokable-hub routing static retrofit is done."
      - "R2 deep-ai-council rename is done."
      - "R3 feature_catalog hygiene is done as keep-all earned; no deletion or repointing needed."
      - "R4 merged-identity layer is kept by maintainer sign-off; drift-guard is green."
      - "NFR-S01 uses the accepted per-mode allowed-tools contract: mode frontmatter is authoritative at dispatch."
      - "R5 is done: strict recursive validation passed, package checks passed, routing fixtures passed, parent-skill invariants passed, and runtime registration confirms reachability; full live-loop e2e remains optional and was not run."
---
# Implementation Plan: deep-loop parent-skill alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->
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
This plan is now a closure execution/status record. R2 (`deep-ai-council` folder/name alignment) is done. R1 static invokable-hub routing is done in the hub docs/registry contract, and reachability is confirmed by runtime registration. R3 is done as keep-all earned: all five mode catalogs stay because each is substantial and warranted. R4 is done as keep: maintainer sign-off plus a green drift-guard keeps the merged-identity layer. NFR-S01 is accepted on the corrected per-mode allowed-tools contract: mode frontmatter is authoritative at dispatch, and the hub's allowed-tools is its own grant, not the union of mode tools. R5 is done: strict recursive validation, package checks, routing fixtures, parent-skill invariants, and runtime-registration reachability are green. The full live-loop e2e remains optional and was not run.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (phase 002 mechanism; 154 precedent)

### Definition of Done
- [x] All acceptance criteria (R1-R5) met; full live-loop e2e remains optional and was not run
- [x] All required gates green (`--check`, advisor/graph consistency by drift-guard + parity + parent-skill-check, routing fixtures, `validate.sh`)
- [x] Docs updated to closure state (spec/plan/tasks/decision-record/checklist/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parent skill with nested mode packets: one advisor-routable hub `SKILL.md`, one declarative `mode-registry.json`, exactly one hub `graph-metadata.json`, N self-contained mode packets with zero `graph-metadata.json`, and a non-discoverable `shared/` helper layer. deep-loop follows this shape. The alignment has retrofitted the static invokable-hub contract, resolved the council packet folder/name deviation, kept all five earned feature catalogs, kept the merged-identity layer by sign-off, and closed required R5 validation.

### Key Components
- **deep-loop hub** (`deep-loop-workflows/SKILL.md` + `mode-registry.json`): the invocable identity; static Option E routing is in place so `Skill(deep-loop-workflows[,hint])` resolves through the hub contract.
- **Five mode packets** (`deep-research`, `deep-review`, `deep-improvement`, `deep-context`, `deep-ai-council`): `name == folder` is resolved for the council packet; all five keep their earned `feature_catalog/` directories.
- **deep-loop-runtime**: executor-config, fanout, and the deep-loop-specific advisor merged-identity projection; keep by maintainer sign-off with the routing-registry drift-guard green.

### Data Flow
An operator request can reach a deep mode through `/deep:*`, an agent type, or the static Option E hub contract. R5 confirms this at registration level: `Skill(deep-loop-workflows)` is registered as the top-level hub, the hub metadata is present, and `/deep:*` commands plus the `ai-council` agent are registered/available. A full live-loop e2e remains optional and was not run.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

This doc pass edits markdown only. The table records the current state of the staged surfaces.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deep-loop-workflows/SKILL.md` + `mode-registry.json` | Hub identity and declarative mode source of truth | R1 static Option E routing done; runtime registration confirms reachability | `Skill(deep-loop-workflows)` registered; routing fixtures passed; full live-loop e2e not run |
| `deep-ai-council` packet folder + `SKILL.md` name | Former `ai-council` mismatch, now folder/name aligned | R2 done; legacy `/deep:ai-council` and agent surfaces preserved | Package checks passed |
| Per-mode `feature_catalog/` (five modes) | Catalog docs present in all five modes | R3 done: keep all five as earned; no deletions or repoints needed | Per-mode assessment table recorded in `decision-record.md` |
| `deep-loop-runtime` (executor-config, fanout, advisor projection) | Runtime config + merged-identity layer | R4 done: keep by maintainer sign-off | Drift-guard green; fixture comparison optional |
| Advisor projection maps (Python + TypeScript) | Drift-guarded merged-identity maps | Kept to preserve stronger per-mode routing | Drift-guard, routing parity, and parent-skill-check confirm consistency; forced `advisor_rebuild` not run/not required |

Required remaining inventories: none. Optional residual: a full live-loop e2e can still be run as extra confidence, but it was not required for R5 closure and was not executed.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Structural alignment (Stages 0-2; lowest blast first)
- [x] Stage 0 - Inventory + baseline for the rename/routing work recorded in prior remediation evidence.
- [x] Stage 1 - `name == folder` (R2): resolve the `ai-council`/`deep-ai-council` mismatch by using folder `deep-ai-council`.
- [x] Stage 2 - feature-catalog hygiene (R3): ADR-003 keep-all earned; all five `feature_catalog/` directories stay and no repointing is needed.

### Phase 2: Routing + runtime (Stages 3-4; higher blast)
- [x] Stage 3 - invokable-hub routing (R1): static Option E hub routing is in place; runtime registration confirms reachability; full live-loop e2e not run.
- [x] Stage 4 - runtime reconciliation (R4): keep merged identity by maintainer sign-off; drift-guard green and fixture comparison optional.

### Phase 3: Validation (Stage 5)
- [x] Stage 5 - validation (R5): complete for required gates. `package_skill.py --check`, strict recursive spec validation, routing fixtures, parent-skill invariants, and runtime-registration reachability are green; full live-loop e2e remains optional and was not run.

### Deferred-Item Closeout (decision-gated sequencing)

Closes the open items (R3, R4, R5, and the NFR-S01 carry-in from phase 002) in dependency order: cheap decisions and assessment first, reversible doc-only resolutions next, live-infra changes only where a decision requires them, full validation last. Recommended defaults are noted so a happy-path exists.

**C0 - Decisions & assessment (read-only, zero mutations):**
- [x] NFR-S01: accept the per-mode allowed-tools contract: each mode packet declares its authoritative allowed-tools; the hub's allowed-tools is its own grant, not the union of mode tools; residual dispatch evidence risk is documented.
- [x] R3: run the per-mode earned-keep assessment across all five `feature_catalog/` directories; verdict is keep all five.
- [x] R4: accept maintainer sign-off to keep merged identity; drift-guard is green.

**C1 - Doc-only resolutions (low blast, reversible, no live-infra):**
- [x] NFR-S01 (A): record the per-mode allowed-tools decision in `decision-record.md`; close the security checklist rows; flip NFR-S01 to resolved (accepted risk + hardening probe noted).
- [x] R3 keep-all branch: amend ADR-003, fill the assessment table, mark Stage 2 and its tasks complete.
- [x] R4 sign-off branch: record keep + rationale; ADR-002 accepted as kept.

**C2 - Live-infra execution (gated on a C0 sign-off; skip entirely if C1 closes everything):**
- [x] Not triggered - R3 remove branch (not triggered - skipped by decision): no unearned `feature_catalog/` directories were found.
- [x] Not triggered - NFR-S01 (B) branch (not triggered - skipped by decision): per-mode allowed-tools accepted; runtime dispatch probe is optional future hardening.
- [x] Not triggered - R4 fixture branch (not triggered - skipped by decision): sign-off keeps the layer; fixture comparison is optional.

**C3 - Full R5 validation & close-out:**
- [x] Routing-parity query fixtures passed; advisor/graph consistency confirmed by drift-guard, routing-parity fixtures, and `parent-skill-check.cjs`; forced `advisor_rebuild` was not run and is not required because routing data was unchanged.
- [x] Operator reachability confirmed by runtime registration: `Skill(deep-loop-workflows)` is registered as the top-level hub, hub metadata is present, and `/deep:*` commands plus the `ai-council` agent are registered/available. Full live-loop e2e was not run.
- [x] Final `validate.sh --strict --recursive` and `package_skill.py --check` passed. Stage 5/R5 is complete; child statuses and the parent phase map are reconciled.

**Out of this packet (separate follow-up):** two `system-spec-kit` test files still reference the pre-rename `deep-loop-workflows/ai-council/` path; confirm active-vs-fixture and fix in their own scope.

**Closeout dependency shape:** C0 -> C1 are complete; C2 did not trigger; C3 is complete for required R5 validation. The out-of-packet follow-up runs independently.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Advisor projection maps equal registry projection (if merged-identity kept) | vitest drift-guard fixture |
| Integration | A deep-loop query routes to `deep-loop-workflows`; single skill-to-mode mapping | routing-parity vitest fixtures |
| Packaging | `name == folder` for hub + all packets | `package_skill.py --check` |
| Manual | `Skill(deep-loop-workflows)` reachability and `/deep:*` + agent availability | Runtime registration confirmed; full live-loop e2e optional/not run |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 Option E mechanism | Internal | Green | Defines the invokable-hub routing this packet retrofits |
| Spec 154 staged conversion | Internal | Green | Execution precedent and source of the sk-design conventions |
| deep-loop-runtime current assumptions | Internal | Green | R4 is closed: keep merged identity by maintainer sign-off; drift-guard green; fixture comparison optional hardening |
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
Stage 0 (done) ──► Stage 1 (R2 done) ──► Stage 2 (R3 done: keep-all) ──► Stage 3 (R1 done) ──► Stage 4 (R4 done: keep) ──► Stage 5 (R5 done)
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| 0 Inventory + baseline | Prior remediation evidence | All later stages |
| 1 name==folder (R2) | Stage 0 | Stage 2, Stage 3 |
| 2 feature-catalog (R3) | Stage 1 | Stage 5 |
| 3 invokable-hub (R1) | Stage 1 | Stage 4 |
| 4 runtime (R4) | Stage 3 | Stage 5 |
| 5 validation (R5) | Stages 1-4 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| 0 Inventory + baseline | Low | Done in prior remediation evidence |
| 1 name==folder | Med | Done for `deep-ai-council` folder/name alignment |
| 2 feature-catalog | Low | Done: keep all five earned catalogs; no deletion/repoint |
| 3 invokable-hub routing | Med | Static retrofit done; runtime registration confirms reachability |
| 4 runtime reconciliation | Med | Done: keep merged identity by sign-off; drift-guard green |
| 5 validation | Low | Done for required gates; full live-loop e2e optional/not run |
| **Total** | | **About 95% complete: R1-R5 and NFR-S01 done; only optional live-loop e2e remains** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Recovery baseline recorded for prior mutating stages in remediation evidence
- [ ] Worktree used if the owner's branch is active
- [x] Single-identity invariant confirmed after R5 gates by `parent-skill-check.cjs`

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
| Inventory + baseline | Prior remediation evidence | Reference + catalog + runtime inventory | Remaining stages |
| name==folder rename | Inventory | `deep-ai-council` folder/name alignment | Catalog, routing |
| invokable-hub routing | Rename | Static hub routing contract | Runtime reconcile and operator probe |
| Runtime reconciliation | Routing | Accepted merged-identity keep decision | Validation |
| feature-catalog assessment | Existing five catalogs | ADR-003 keep-all earned result | Final validation |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Stage 5 non-package validation gates** - done for required evidence; optional full live-loop e2e not run

**Total Critical Path**: Complete for required packet closure. Stage 2 keep-all, Stage 4 keep, and Stage 5 validation are closed.

**Parallel Opportunities**:
- Optional live-loop e2e can run independently because R3/R4/R5 required gates no longer change semantics.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Family is package-checkable | `package_skill.py --check` passes for hub + all packets | Complete |
| M2 | Native reachability | Static hub routing done; runtime registration confirms reachability; full live-loop e2e optional/not run | Complete |
| M3 | Aligned + validated | R3 assessment complete, R4 keep recorded, required gates green | Complete |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: ai-council name/folder resolution (see decision-record.md)

**Status**: Accepted (executed)

**Context**: The former `ai-council` packet mismatch has been resolved on disk. The packet folder and SKILL name are now `deep-ai-council`; legacy public `/deep:ai-council` and agent surfaces remain intentional.

**Decision**: Rename the folder to `deep-ai-council`; executed. The merged-identity keep call (ADR-002), the feature-catalog keep-all ruling (ADR-003), and the NFR-S01 per-mode allowed-tools contract (ADR-004) remain separate decisions.

**Consequences**:
- Resolving the rename unblocks package checks; current evidence passes on the hub and all five packets.
- The cost is a one-pass reference rewire across commands, agents, registry, and runtime.

**Alternatives Rejected**:
- Renaming the packet to `ai-council`: rejected because it breaks the `deep-<mode>` convention and the established `deep-ai-council` identity the advisor and agents already use.

### ADR-002: merged-identity keep/simplify decision (see decision-record.md)

**Status**: Accepted - keep the merged-identity layer (sign-off; drift-guard green)

**Decision**: Keep the merged-identity layer because Option E solves invocation, not advisor routing strength. Maintainer sign-off closes the decision; fixture comparison is optional hardening.

### ADR-003: per-mode feature-catalog ruling (see decision-record.md)

**Status**: Accepted - keep all five (earned)

**Decision**: Apply the earned-keep test per mode and keep all five `feature_catalog/` directories. No deletion or repointing is needed.

### ADR-004: NFR-S01 hub tool-permission contract (see decision-record.md)

**Status**: Accepted - per-mode allowed-tools contract

**Decision**: Accept that each mode packet declares its own allowed-tools, which is the authoritative per-mode contract. The hub's allowed-tools is the hub's own grant, not the union of mode tools. Modes are not widened by the hub because per-mode frontmatter governs at dispatch; a runtime dispatch probe is optional future hardening.
