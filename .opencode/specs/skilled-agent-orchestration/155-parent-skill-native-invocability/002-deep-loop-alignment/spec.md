---
title: "Feature Specification: deep-loop parent-skill alignment"
description: "Align the deep-loop parent-skill family (deep-loop-workflows + deep-loop-runtime) with the parent-skill optimizations proven on the sk-design conversion: invokable-hub routing (Option E from phase 001), name==folder for every mode packet (resolve the ai-council/deep-ai-council grandfather), feature-catalog hygiene, and runtime reconciliation. Planning only; execution gated."
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
    packet_pointer: "skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scoped the deep-loop alignment against current deep-loop-workflows state"
    next_safe_action: "Gate, then execute R1-R5 staged like the 154 conversion"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/SKILL.md"
      - ".opencode/skills/deep-loop-workflows/mode-registry.json"
      - ".opencode/skills/deep-loop-runtime/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-155-002-deep-loop-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "ai-council: rename folder to deep-ai-council, or keep folder and rename the packet to ai-council?"
      - "Does the deep-loop-specific advisor merged-identity layer stay required once Option E exists?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: deep-loop parent-skill alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

`deep-loop-workflows` was the canonical parent-skill example, but the sk-design conversion (spec 154) advanced the pattern beyond it. This packet aligns the deep-loop parent-skill family with the conventions it inspired: invokable-hub routing (Option E from phase 001), `name == folder` for every mode packet (resolving the grandfathered `ai-council`/`deep-ai-council` mismatch), feature-catalog hygiene, and a runtime reconciliation pass over `deep-loop-runtime`. It is plan-only; execution is gated and staged like the 154 conversion.

**Key Decisions**: The `ai-council` rename direction, the keep-or-simplify call on the deep-loop-specific advisor merged-identity layer, and the per-mode feature-catalog ruling are framed in `decision-record.md` with recommendations, and finalized at the execution gate.

**Critical Dependencies**: Phase 001's Option E mechanism is the invocation precedent; the 154 staged conversion is the execution precedent. deep-loop is the most-used skill family, so the work is high blast and must be staged.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-26 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`deep-loop-workflows` was the canonical parent-skill example, but the sk-design conversion (spec 154) advanced the pattern beyond it. deep-loop now lags the conventions it inspired:

- **Not `Skill()`-invokable.** `Skill(deep-loop-workflows)` / `Skill(ai-council)` does not resolve a mode; modes are reached only through `/deep:*` commands and agent types. The phase-001 mechanism (Option E — invokable-hub routing) is not retrofitted onto deep-loop.
- **`name != folder`.** The `ai-council` packet has folder `ai-council` but `SKILL.md` name `deep-ai-council`, so it fails `package_skill.py --check`. The sk-design conversion aligned every packet to `name == folder`.
- **Feature-catalog drift.** All five deep modes (`deep-research`, `deep-review`, `deep-improvement`, `deep-context`, `ai-council`) carry a `feature_catalog/`; the sk-design conversion pared these to only the mode that genuinely needs one. deep-loop's actual need is unassessed.
- **Runtime predates the conventions.** `deep-loop-runtime` (executor-config, fanout, the deep-loop-specific advisor merged-identity projection) was authored before phase 001. Some of its assumptions — notably the merged-identity layer — may be simplifiable now that invokable-hub routing exists.

### Purpose
Align the deep-loop parent-skill family with the phase-001 invokable-hub mechanism and the sk-design parent-skill conventions, without changing deep-loop's workflow behavior, while preserving exactly one `graph-metadata.json` for the family.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Alignment of `deep-loop-workflows` (hub `SKILL.md`, `mode-registry.json`, the five mode packets, `shared/`) with the phase-001 mechanism and the sk-design parent-skill conventions.
- Alignment of `deep-loop-runtime` (executor-config, fanout, advisor projection) where path/identity assumptions or the merged-identity layer are affected.
- A recorded decision on the `ai-council` rename, the merged-identity keep/simplify call, and the per-mode feature-catalog ruling.

### Out of Scope
- Changing deep-loop's *workflow behavior* (the loops, convergence, fanout semantics themselves).
- Any runtime or binary change; building new deep modes.
- The `sk-design` Model-A conversion itself (spec 154, tracked separately). This packet reuses its conventions but does not re-do it.

### Files to Change
This packet authors documentation only. No source, runtime, or configuration files change in this packet; the listed surfaces are the execution targets the staged plan will touch.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment/spec.md` | Create | This specification |
| `.opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment/plan.md` | Create | Staged, gated alignment plan |
| `.opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment/tasks.md` | Create | R1-R5 task breakdown |
| `.opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment/decision-record.md` | Create | ai-council rename, merged-identity, and feature-catalog decisions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R1 | **Invokable-hub routing.** Retrofit Option E onto `deep-loop-workflows`: `Skill(deep-loop-workflows[, "<mode>: …"])` loads the hub, whose router resolves and loads the nested mode packet. Keep the existing `/deep:*` commands + agents as complementary surfaces. | `Skill(deep-loop-workflows)` reaches a mode through the hub; one `graph-metadata.json` preserved; `/deep:*` + agents still function |
| R2 | **`name == folder`.** Resolve the `ai-council` / `deep-ai-council` mismatch so every packet passes `package_skill.py --check` — rename the folder to `deep-ai-council` (preferred, matches the `deep-<mode>` convention) or the packet name to `ai-council`; record the choice and rewire every reference. | `package_skill.py --check` passes for the hub + all five packets; zero broken `ai-council` references |
| R3 | **Feature-catalog hygiene.** Assess each of the five deep modes; keep `feature_catalog/` only where it earns its place (mirror the sk-design ruling), remove the rest, repoint references. | Feature-catalog footprint matches the recorded ADR-003 ruling; zero dangling `feature_catalog` references |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| R4 | **Runtime reconciliation.** Confirm `deep-loop-runtime` path/identity assumptions still hold after R1–R3; evaluate whether the deep-loop-specific advisor merged-identity layer (`lib/scorer/aliases.ts` + `skill_advisor.py` projection) stays required, or can be simplified now that Option E provides invocation independently of advisor projection. | `deep-loop-runtime` assumptions verified; merged-identity keep/simplify decision recorded with evidence (ADR-002) |
| R5 | **Validation.** `package_skill.py --check` on the hub + all packets; `advisor_rebuild` + `skill_graph_validate`; routing fixtures; `validate.sh`. | All gates green; `/deep:*` commands + agents still function |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `Skill(deep-loop-workflows)` reaches a mode through the hub (Option E), with exactly one `graph-metadata.json` preserved.
- **SC-002**: Every deep packet passes `package_skill.py --check` (`name == folder`); the feature-catalog footprint matches the recorded ruling; `deep-loop-runtime` is reconciled and the merged-identity keep/simplify decision is recorded; all gates green and `/deep:*` commands + agents still function.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | deep-loop is the most-used skill family (`/deep:*`, agents, fanout) — high blast | High. A regression hits the most-exercised workflow surface | Stage and gate like the 154 conversion; record a recovery baseline before each stage |
| Risk | `ai-council` rename ripples across commands, agents, registry, runtime, and cross-refs | Medium. A missed reference leaves a broken load path | Inventory every `ai-council` reference first; rename in one pass; verify zero broken refs |
| Risk | Removing the merged-identity layer could regress deep-loop advisor routing | Medium. Per-mode routing strength may drop | R4 evaluates and records before touching it; default to keep unless evidence shows it is redundant |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The alignment must not add runtime cross-skill import coupling to the advisor hot path. If the merged-identity projection is kept, it stays a code-resident map guarded by a test, not a runtime registry load.

### Security
- **NFR-S01**: No alignment step may widen a packet's tool-permission contract as a side effect of becoming invocable or being renamed.

### Reliability
- **NFR-R01**: The family must keep exactly one advisor identity (one `graph-metadata.json`) so routing-parity fixtures that assert a single skill-to-mode mapping stay valid.

---

## 8. EDGE CASES

### Data Boundaries
- Grandfathered folder-vs-name mismatch: the `ai-council` packet has folder `ai-council` and packet name `deep-ai-council`. R2 resolves this recorded mismatch rather than assuming folder equals name.
- A packet that hosts several modes (`deep-improvement` hosts four) keeps one packet skill name. Feature-catalog hygiene and rename work must not assume one mode per packet.

### Error Scenarios
- A missed `ai-council` reference after the rename leaves a broken load path or command/agent binding. The Stage 0 inventory plus a zero-broken-refs gate guards this.
- Removing a `feature_catalog/` without repointing its `SKILL.md`/reference pointers leaves a dangling reference. Stage 2 repoints before the gate.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Hub + five packets + runtime; rename, catalog hygiene, and routing retrofit |
| Risk | 18/25 | Auth: N, API: N, Breaking: Y if a reference is missed; most-used skill family |
| Research | 10/20 | Mechanism is known (Option E); merged-identity keep/simplify needs evidence |
| Multi-Agent | 6/15 | Single staged workstream |
| Coordination | 12/15 | Depends on phase 001 mechanism and the 154 conversion precedent |
| **Total** | **62/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A missed `ai-council` reference breaks a load path or binding | H | M | Stage 0 inventory; rename in one pass; zero-broken-refs gate |
| R-002 | Routing retrofit accidentally adds a second `graph-metadata.json` | H | L | Single-identity gate after Stage 3; preserve exactly one hub graph-metadata |
| R-003 | Simplifying the merged-identity layer regresses per-mode routing | M | M | R4 evaluates against fixtures first; default to keep |

---

## 11. USER STORIES

### US-001: Operator invokes a deep-loop mode natively (Priority: P0)

**As an** operator, **I want** to reach a deep-loop mode through `Skill(deep-loop-workflows)`, **so that** the family matches the invokable-hub pattern phase 001 established.

**Acceptance Criteria**:
1. Given the aligned deep-loop hub, When the operator invokes `Skill(deep-loop-workflows)` with a mode hint, Then the hub router loads the matching nested mode packet and the existing `/deep:*` commands and agents still work.

### US-002: Maintainer keeps the family check-clean (Priority: P1)

**As a** maintainer, **I want** every deep packet to pass `package_skill.py --check`, **so that** the `ai-council` grandfather no longer blocks a clean family validation.

**Acceptance Criteria**:
1. Given the resolved rename, When `package_skill.py --check` runs on the hub and all packets, Then it passes with zero broken `ai-council` references.

---

## 12. OPEN QUESTIONS

- `ai-council` rename direction: rename the folder to `deep-ai-council` (recommended, matches `deep-<mode>`), or rename the packet to `ai-council`? ADR-001 records the recommendation; finalized at the gate.
- Does the deep-loop-specific advisor merged-identity layer stay required once Option E exists? ADR-002 defers this to Stage 4 evaluation against routing fixtures.
<!-- /ANCHOR:questions -->

---

## 13. DEPENDENCIES AND RELATED PACKETS

- **Depends on**: phase 001 (`001-invocability-mechanism`) supplies Option E, the invokable-hub mechanism this packet retrofits onto deep-loop.
- **Mirrors**: spec 154's staged nested-parent conversion is the execution precedent (staged, gated, recovery baseline per stage) and the source of the sk-design parent-skill conventions.
- **Related**: spec 147 (deep-loop-workflows) is the family being aligned and the canonical example whose `/deep:*` commands and agent types are the current non-`Skill()` invocation surface.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Phase-001 mechanism**: `../001-invocability-mechanism/decision-record.md`
- **Canonical parent skill**: `.opencode/skills/deep-loop-workflows/SKILL.md`
