---
title: "Feature Specification: Compile current sk-design for compiled routing"
description: "The live four-mode sk-design hub has no compiled shadow, activation manifest, or cohort registration. Its registry and root router therefore cannot be replayed through the compiled front door, even though the runtime already serves compiled parent hubs."
trigger_phrases:
  - "sk-design compiled routing"
  - "design hub compiled router"
  - "compiled design routing"
  - "sk-design rollout"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Compile current sk-design for compiled routing

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The live `sk-design` parent has four workflow modes and a root router that owns the second routing stage, but the compiled runtime has no shadow child for it. This packet adapts the live registry and root router into a relationship-driven compiled snapshot, then connects that snapshot to the existing fail-safe runtime and advisor cohort.

**Key Decisions**: compile the current four-mode contract rather than revive the deleted historical generation; keep authority behind the existing manifest, flag, hash, and generation gates.

**Critical Dependencies**: the compiled runtime schemas, the live `sk-design` source tree, and the existing route-admission and foundation gates.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-21 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 13 |
| **Handoff Criteria** | The hub routes through both stages, passes its focused admission and serving checks, and fails closed when authority state drifts. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`sk-design` is a live parent hub with four registered workflows, five root-router intents, and a populated leaf manifest. The compiled front door returns the legacy sentinel because the engine map, activation state, resolver cohort, and advisor cohort do not know this hub.

The historical design rollout cannot be copied unchanged. It described retired modes and a different generation model, so using it directly would compile a contract the current hub no longer owns.

### Purpose

Make the current `sk-design` contract replayable through the compiled routing path while preserving legacy fallback whenever compiled authority is absent, stale, invalid, or broken.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A current `sk-design` shadow compiler, canary router, policy-card generator, build harness, route-gold fixture, and generated compiled and activation artifacts.
- Root-router compilation for `VALUES`, `REVIEW`, `CHART`, `FLOWCHART`, and `EXTRACT`, with leaf resources bound to their owning workflow mode.
- Runtime engine registration, resolver default-on membership, advisor source and dist membership, guard membership, and closure metadata needed by the existing serving gates.
- Updates to the live `sk-design/SKILL.md` compiled-routing contract so it describes the active front door and its fail-safe fallback.
- Focused verification of stage one mode selection, stage two leaf selection, negative and no-match behavior, admission, freshness, status, and serving authority.

### Out of Scope

- Re-homing or redesigning any `sk-design` mode. The current four-mode source is authoritative.
- Reusing retired generation-6 fixtures or restoring deleted historical packet trees.
- Repairing unrelated archived source-sync failures, stale playbooks outside the compiled-routing contract, or pre-existing failures outside this hub's gate.
- Changing the generic compiled-routing algebra, manifest schema, or fleet-wide flag semantics.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/**` | Create | Current-hub compiler, router, harness, fixture, policy card, and generated artifacts |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` | Modify | Register the shadow child with the runtime engine |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` | Modify | Add the hub to the default-on cohort |
| `.skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts` | Modify | Add advisor eligibility and default-on membership |
| `.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/compiled-routing-flag.js` | Modify | Keep advisor dist membership in lockstep |
| `.skilled/bin/compiled-route-guard.cjs` | Modify | Include the hub in freshness and drift checks |
| `.skilled/bin/compiled-routing-foundation.vitest.ts` | Modify | Update cohort and closure assertions for the new member |
| `.skilled/bin/tests/compiled-route-manifest.test.cjs` | Modify | Update the explicit cohort contract |
| `.skilled/skills/sk-design/SKILL.md` | Modify | Replace the stale legacy-only compiled-routing text |
| `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json` | Modify | Record the expanded promoted closure |
| `specs/sk-design/018-sk-design-parent-v2/013-fix-sk-design-for-compiled-routing/**` | Create/Modify | Packet documents, decision record, and evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The compiler accepts the current `sk-design` registry, hub router, root router, mode packets, and leaf manifest without retired-mode assumptions. |
| REQ-002 | The compiled canary reproduces stage-one mode selection and stage-two root-router leaf selection for direct, bundled, no-match, explicit-mode, and negative inputs. |
| REQ-003 | The generated policy, projection, route gold, policy card, and activation artifacts carry consistent source hashes, policy hash, graph identity, and generation. |
| REQ-004 | The runtime front door serves `sk-design` only when the flag, compiled manifest, policy hash, and generation all agree. Missing or drifted state returns the legacy sentinel. |
| REQ-005 | Engine, resolver, advisor source, advisor dist, guard, activation, and closure membership stay aligned for the new hub. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The focused admission corpus covers all four declared modes and includes a negative or defer case. |
| REQ-007 | A real request is replayed through both routing stages, with mode and leaf evidence recorded. |
| REQ-008 | Code comments introduced by this packet contain durable rationale only and no ephemeral ids or spec paths. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `compiled-route-admission.cjs --hub sk-design --json` reports a passing hub with no broken or drifted scenario.
- **SC-002**: A direct fundamentals, chart, diagram, and extraction request returns the expected workflow mode and stage-two leaf pair.
- **SC-003**: `compiled-route-status.cjs --hub sk-design` reports `compiled-serving` with a fresh manifest.
- **SC-004**: Invalid, missing, or mismatched authority state returns the legacy sentinel without throwing into the routing path.
- **SC-005**: The relevant foundation, package, syntax, and strict packet validation checks pass, with unrelated pre-existing failures reported separately.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Current four-mode registry and root router | Wrong source shape produces false routes | Validate source identity and compile the live bytes |
| Dependency | Runtime schema and route evaluator | Artifacts may be structurally valid but unservable | Build through the existing compiler and decision contract |
| Risk | Retired historical assumptions leak into the new child | High | Derive modes, weights, tie order, and resources from current source |
| Risk | Manifest or cohort drift makes the hub silently fall back | High | Run freshness, status, admission, and lockstep checks |
| Risk | Root stage-two resources are attributed to the wrong mode | High | Validate every mapped leaf against its packet prefix and leaf manifest |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Compiled route evaluation remains local and bounded by the existing in-memory snapshot path.

### Security

- **NFR-S01**: Route evaluation does not write workspace files, change manifests, or commit effects.

### Reliability

- **NFR-R01**: Any missing source, invalid flag, missing manifest, hash mismatch, generation mismatch, or engine exception falls back to legacy routing.

---

## 8. EDGE CASES

### Data Boundaries

- Empty prompt: use the live hub default only where stage one permits it, then return no stage-two leaf match rather than loading the whole tree.
- Near-tied modes: preserve declared tie order and only emit an ordered bundle when the current contract allows it.
- Root resource with no owning packet: compilation fails instead of emitting an orphan leaf.

### Error Scenarios

- Missing activation manifest: status reports `missing-manifest` and the front door returns the legacy sentinel.
- Stale policy hash or generation: status reports stale or identity drift and serving remains legacy.
- Router or registry source drift: build and freshness fail before activation.
<!-- /ANCHOR:questions -->

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 19/25 | Runtime, advisor, guard, artifacts, tests, and packet docs |
| Risk | 20/25 | Serving authority and cohort identity can silently fall back |
| Research | 14/20 | Historical rollout must be adapted to a changed live topology |
| Multi-Agent | 4/15 | One implementation stream with separate runtime and proof surfaces |
| Coordination | 12/15 | Engine, resolver, advisor, activation, closure, and gates must agree |
| **Total** | **69/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Current root-router resources do not map to declared packet leaves | H | M | Compile-time ownership and leaf-manifest checks |
| R-002 | One cohort copy omits `sk-design` | H | M | Foundation order and membership lockstep tests |
| R-003 | Activation points at a different generation than the snapshot | H | M | Freshness and status checks before authority |
| R-004 | Existing playbook gold reflects a retired topology | M | M | Report stale gold separately and keep source contract authoritative |

---

## 11. USER STORIES

### US-001: The design hub can use the compiled front door (Priority: P0)

**As a** routing runtime, **I want** the current design hub registered in the compiled engine, **so that** its decisions can be served without rebuilding the legacy path.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: A design request reaches the correct mode and leaves (Priority: P0)

**As a** design request, **I want** stage one and stage two to remain distinct, **so that** the selected mode loads only the resources that answer the request.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Whether the existing design playbook's cross-canvas scenario should be refreshed is outside this packet unless admission proves it is a current contract failure rather than stale gold.
- Whether the broader source-sync migration should be repaired belongs to a separate packet because its baseline failure predates this hub.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---
