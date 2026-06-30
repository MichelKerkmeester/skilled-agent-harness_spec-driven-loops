---
title: "Feature Specification: deep-loop parent-skill alignment"
description: "Closure deep-loop parent-skill alignment record. R1-R5, the deep-ai-council rename, the keep-all feature-catalog ruling, the merged-identity keep, and NFR-S01 per-mode allowed-tools contract are done; full live-loop e2e remains optional and was not run."
trigger_phrases:
  - "deep-loop parent skill alignment"
  - "deep-loop invokable hub routing"
  - "ai-council name folder mismatch"
  - "deep-loop feature catalog hygiene"
  - "align deep-loop with sk-design parent pattern"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/119-parent-skill-native-invocability/003-deep-loop-alignment"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "R5 gates green; runtime reachability confirmed by registration; optional live-loop e2e not run"
    next_safe_action: "Optional: run a full live deep-loop e2e; refresh metadata separately"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/SKILL.md"
      - ".opencode/skills/deep-loop-workflows/mode-registry.json"
      - ".opencode/skills/deep-loop-runtime/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-155-003-deep-loop-alignment"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "R1 is done: Skill(deep-loop-workflows) is documented as the invokable hub and routes via mode-registry.json."
      - "R2 is done: the packet folder is deep-ai-council and the legacy ai-council public surfaces are preserved."
      - "R3 is done: all five feature_catalog directories earn keep status and stay."
      - "R4 is done: the merged-identity layer is kept by maintainer sign-off; the drift-guard is green."
      - "NFR-S01 is resolved in ADR-004: per-mode allowed-tools is the authoritative contract; the hub's allowed-tools is its own grant, not the union of mode tools."
      - "R5 is done: strict recursive validation passed for parent plus the then-current child phases, package checks passed for hub plus all five packets, routing fixtures passed, parent-skill invariants passed, and runtime registration confirms reachability; the full live-loop e2e remains optional and was not run."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: deep-loop parent-skill alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

`deep-loop-workflows` was the canonical parent-skill example, and the alignment is now closed against the required R5 evidence. R1 is done: the hub documents Option E invokable-hub routing through `Skill(deep-loop-workflows)`, with `mode-registry.json` as the routing source of truth. R2 is done: the nested packet folder is `deep-ai-council`, matching the packet name, while `/deep:ai-council` and the `ai-council` agent remain legacy public surfaces. R3 is done as keep-all earned: all five mode catalogs are substantial and stay. R4 is done as keep: maintainer sign-off plus a green drift-guard keeps the merged-identity layer. NFR-S01 is resolved in ADR-004: per-mode allowed-tools is the authoritative contract; the hub's allowed-tools is its own grant, not the union of mode tools. R5 is done: strict recursive spec validation, family package checks, routing fixtures, parent-skill invariants, and runtime-registration reachability are green. A full live-loop e2e was deliberately not run and remains optional.

**Key Decisions**: ADR-001 is executed for the rename. ADR-002 keeps the merged-identity layer by maintainer sign-off, with the routing-registry drift-guard green. ADR-003 keeps all five `feature_catalog/` directories as earned. ADR-004 accepts NFR-S01 on the basis that per-mode allowed-tools is authoritative at dispatch; the hub's allowed-tools is its own grant, not the union of mode tools.

**Critical Dependencies**: Phase 002's Option E mechanism is the invocation precedent; the 154 staged conversion is the execution precedent. deep-loop is the most-used skill family, so the work is high blast and must be staged.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../002-invocability-mechanism/spec.md` |
| **Successor** | N/A |
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete (~95%; optional live-loop e2e not run) |
| **Created** | 2026-06-26 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`deep-loop-workflows` was the canonical parent-skill example, but the sk-design conversion (spec 154) advanced the pattern beyond it. Current alignment is complete against the required gates:

- **R1 done: invokable hub.** `Skill(deep-loop-workflows)` is the hub invocation surface; the hub classifies a request, resolves `workflowMode`, and loads the nested packet from `mode-registry.json`. `/deep:*` commands and agents remain complementary surfaces.
- **R2 done: `name == folder` for the council packet.** The packet folder is now `deep-ai-council`, matching `SKILL.md` name `deep-ai-council`; the public command/agent identity remains `ai-council` by design.
- **R3 done: feature-catalog hygiene.** All five deep modes (`deep-research`, `deep-review`, `deep-improvement`, `deep-context`, `deep-ai-council`) keep their `feature_catalog/` directories because the per-mode earned-keep assessment found every catalog substantial.
- **R4 done: merged identity kept.** The deep-loop-specific advisor merged-identity projection stays by maintainer sign-off; the routing-registry drift-guard is green and fixture comparison is optional hardening.
- **R5 done: validation.** The recorded validation passed on the parent plus the then-current child phases with 0 errors and 0 warnings; `package_skill.py --check` passed on the hub and all five packets; routing fixtures passed across 3 files/19 tests; `parent-skill-check.cjs` passed all invariants with 0 warnings; runtime registration confirms `Skill(deep-loop-workflows)` reachability, `/deep:*` command availability, and `ai-council` agent availability. `advisor_rebuild` was not run and is not required because routing data was unchanged. The full live-loop e2e remains optional and was not run.

### Purpose
Align the deep-loop parent-skill family with the phase-002 invokable-hub mechanism and the sk-design parent-skill conventions, without changing deep-loop's workflow behavior, while preserving exactly one `graph-metadata.json` for the family.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Alignment of `deep-loop-workflows` (hub `SKILL.md`, `mode-registry.json`, the five mode packets, `shared/`) with the phase-002 mechanism and the sk-design parent-skill conventions.
- Alignment of `deep-loop-runtime` (executor-config, fanout, advisor projection) where path/identity assumptions or the merged-identity layer are affected.
- A recorded decision on the `ai-council` rename, the merged-identity keep call, the per-mode feature-catalog ruling, and the NFR-S01 hub permission contract.

### Out of Scope
- Changing deep-loop's *workflow behavior* (the loops, convergence, fanout semantics themselves).
- Any runtime or binary change; building new deep modes.
- The `sk-design` Model-A conversion itself (spec 154, tracked separately). This packet reuses its conventions but does not re-do it.

### Files to Change
This doc-reconciliation pass edits only authored markdown. Earlier alignment work already changed live deep-loop surfaces for R1/R2; R3/R4/NFR-S01 are decision-closed, and R5 validation is closed by the recorded gate evidence. The table below lists this packet's authored docs.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/003-deep-loop-alignment/spec.md` | Create | This specification |
| `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/003-deep-loop-alignment/plan.md` | Create | Staged, gated alignment plan |
| `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/003-deep-loop-alignment/tasks.md` | Create | R1-R5 task breakdown |
| `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/003-deep-loop-alignment/decision-record.md` | Create | ai-council rename, merged-identity, and feature-catalog decisions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R1 | **Invokable-hub routing.** Retrofit Option E onto `deep-loop-workflows`: `Skill(deep-loop-workflows[, "<mode>: ..."])` loads the hub, whose router resolves and loads the nested mode packet. Keep the existing `/deep:*` commands + agents as complementary surfaces. | DONE: static hub docs/routing contract is in place; runtime registration confirms the hub is reachable and `/deep:*` commands plus agents are available; full live-loop e2e not run |
| R2 | **`name == folder`.** Resolve the `ai-council` / `deep-ai-council` mismatch so the packet folder and SKILL name match while legacy public command/agent surfaces remain. | DONE for folder/name identity; package checks pass on the hub and all five packets |
| R3 | **Feature-catalog hygiene.** Assess each of the five deep modes; keep `feature_catalog/` only where it earns its place, remove the rest, repoint references. | DONE: all five catalogs earned keep status; no deletion or repointing needed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R4 | **Runtime reconciliation.** Confirm `deep-loop-runtime` path/identity assumptions still hold after R1-R3; evaluate whether the deep-loop-specific advisor merged-identity layer stays required. | DONE: merged-identity layer kept by maintainer sign-off; routing-registry drift-guard green; fixture comparison optional |
| R5 | **Validation.** `package_skill.py --check` on the hub + all packets; advisor/graph consistency; routing fixtures; recursive `validate.sh`; operator reachability. | DONE: package checks passed; advisor/graph consistency is confirmed by drift-guard, routing parity, and parent-skill invariants; routing fixtures passed; recursive validation passed; runtime registration confirms reachability. Forced `advisor_rebuild` was not run/not required, and full live-loop e2e remains optional/not run |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `Skill(deep-loop-workflows)` reaches the hub (Option E), with exactly one `graph-metadata.json` preserved. Runtime registration confirms the top-level skill, hub metadata, `/deep:*` commands, and the `ai-council` agent are available; the optional full live-loop e2e was not run.
- **SC-002**: Every deep packet passes `package_skill.py --check` (`name == folder`); the feature-catalog footprint matches the recorded keep-all ruling; `deep-loop-runtime` is reconciled and the merged-identity keep decision is recorded; all required gates are green and `/deep:*` commands plus agents remain registered/available.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | deep-loop is the most-used skill family (`/deep:*`, agents, fanout) — high blast | High. A regression hits the most-exercised workflow surface | Stage and gate like the 154 conversion; record a recovery baseline before each stage |
| Risk | `ai-council` rename ripples across commands, agents, registry, runtime, and cross-refs | Medium. A missed reference leaves a broken load path | Inventory every `ai-council` reference first; rename in one pass; verify zero broken refs |
| Risk | Removing the merged-identity layer could regress deep-loop advisor routing | Medium. Per-mode routing strength may drop | R4 keeps the layer; optional fixture comparison remains future hardening |
| Risk | Hub `allowed-tools` is mistaken for the union of per-mode tool contracts | Medium. A reviewer could assume modes are widened by the hub or that the hub carries tools only declared by modes | NFR-S01 is accepted on the corrected contract: each mode packet declares its own authoritative allowed-tools; the hub's allowed-tools is the hub's own grant, not the union of mode tools; per-mode frontmatter governs at dispatch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The alignment must not add runtime cross-skill import coupling to the advisor hot path. If the merged-identity projection is kept, it stays a code-resident map guarded by a test, not a runtime registry load.

### Security
- **NFR-S01**: Resolved as documentation of the per-mode allowed-tools contract, not by stripping tools. Each mode packet declares its own allowed-tools, which is the authoritative per-mode contract; the hub's allowed-tools is the hub's own grant, not the union of mode tools. Modes are not widened by the hub because per-mode frontmatter governs at dispatch. Residual risk: this depends on dispatch loading the selected mode packet before mode execution; a future runtime probe can harden that evidence.

### Reliability
- **NFR-R01**: The family must keep exactly one advisor identity (one `graph-metadata.json`) so routing-parity fixtures that assert a single skill-to-mode mapping stay valid.

---

## 8. EDGE CASES

### Data Boundaries
- Legacy public identity: `/deep:ai-council` and the `ai-council` agent remain public surfaces even though the packet folder/name is now `deep-ai-council`.
- A packet that hosts several modes (`deep-improvement` hosts four) keeps one packet skill name. Feature-catalog hygiene keeps the earned packet catalogs and must not assume one mode per packet.

### Error Scenarios
- A missed `ai-council` reference after the rename could leave a broken load path or command/agent binding. Legacy public surfaces are intentional; stale filesystem paths are not.
- Removing a `feature_catalog/` without repointing its `SKILL.md`/reference pointers would leave a dangling reference. Stage 2 chose keep-all, so this deletion branch did not trigger.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Hub + five packets + runtime; rename, catalog hygiene, and routing retrofit |
| Risk | 18/25 | Auth: N, API: N, Breaking: Y if a reference is missed; most-used skill family |
| Research | 10/20 | Mechanism is known (Option E); merged-identity keep/simplify needs evidence |
| Multi-Agent | 6/15 | Single staged workstream |
| Coordination | 12/15 | Depends on phase 002 mechanism and the 154 conversion precedent |
| **Total** | **62/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A missed `ai-council` reference breaks a load path or binding | H | M | Stage 0 inventory; rename in one pass; zero-broken-refs gate |
| R-002 | Routing retrofit accidentally adds a second `graph-metadata.json` | H | L | Single-identity gate after Stage 3; preserve exactly one hub graph-metadata |
| R-003 | Simplifying the merged-identity layer regresses per-mode routing | M | M | R4 keeps the layer; fixture comparison is optional future hardening |

---

## 11. USER STORIES

### US-001: Operator invokes a deep-loop mode natively (Priority: P0)

**As an** operator, **I want** to reach a deep-loop mode through `Skill(deep-loop-workflows)`, **so that** the family matches the invokable-hub pattern phase 002 established.

**Acceptance Criteria**:
1. Given the aligned deep-loop hub, When the operator invokes `Skill(deep-loop-workflows)` with a mode hint, Then the hub router loads the matching nested mode packet and the existing `/deep:*` commands and agents still work.

### US-002: Maintainer keeps the family check-clean (Priority: P1)

**As a** maintainer, **I want** every deep packet to pass `package_skill.py --check`, **so that** the `ai-council` grandfather no longer blocks a clean family validation.

**Acceptance Criteria**:
1. Given the resolved rename, When `package_skill.py --check` runs on the hub and all packets, Then it passes with zero broken `ai-council` references.

---

## 12. OPEN QUESTIONS

- No blocking open questions. The full live-loop e2e remains optional evidence and was deliberately not run.
<!-- /ANCHOR:questions -->

---

## 13. DEPENDENCIES AND RELATED PACKETS

- **Depends on**: phase 002 (`002-invocability-mechanism`) supplies Option E, the invokable-hub mechanism this packet retrofits onto deep-loop.
- **Mirrors**: spec 154's staged nested-parent conversion is the execution precedent (staged, gated, recovery baseline per stage) and the source of the sk-design parent-skill conventions.
- **Related**: spec 147 (deep-loop-workflows) is the family being aligned and the canonical example whose `/deep:*` commands and agent types are the current non-`Skill()` invocation surface.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Phase-002 mechanism**: `../002-invocability-mechanism/decision-record.md`
- **Canonical parent skill**: `.opencode/skills/deep-loop-workflows/SKILL.md`
