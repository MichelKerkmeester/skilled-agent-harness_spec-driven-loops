---
title: "Feature Specification: Phase 3: hub mode registration"
description: "A packet that no routing surface names is a folder; a routing surface that names a mode nothing enforces is a comment — this phase makes cli-jev reachable, enforced and served, on every surface, with a gate behind each layer."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/001-cli-jev-creation/003-hub-mode-registration"
    last_updated_at: "2026-09-20T10:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Phase specification authored at closeout from the landed registration"
    next_safe_action: "None; the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-074-003-hub-mode-registration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: hub mode registration

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-20 |
| **Branch** | `scaffold/003-hub-mode-registration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-cli-jev-skill-packet |
| **Successor** | 004-catalog-and-playbook |
| **Handoff Criteria** | The per-hub gate is green at eight modes; both dispatch suites pass; the compiled policy serves the new hash and the canary fixture covers the transport |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the cli-jev creation: add Jev as the eighth cli-external-orchestration mode, a transport packet that bridges the jev CLI and its judgment contract specification.

**Scope Boundary**: Registration and wiring. The packet's own text was authored in phase 002 and is not revisited here beyond the one prose correction the new mode falsified.

**Dependencies**:
- Phase 002's packet, whose rules this phase implements
- The compiled-routing toolchain, whose hub compiler had to learn the transport role

**Deliverables**:
- The transport entry and `transport-axis` extension, and the mode on every routing surface
- The dispatch-audit shape and eight implemented checks with fixture pairs
- A rebuilt compiled policy, a re-minted serving manifest and a regenerated trigger index

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Four independent mechanisms decide whether a mode is reachable: the per-hub gate reads the registry, the hub router scores signals, the dispatch audit decides which packet governs a command, and the compiled policy is what the runtime actually serves. A mode registered in one and absent from another is reachable in a document and unreachable in practice — and the failure is silent, because each mechanism has its own green light.

### Purpose

Register the mode on all four, with a gate behind each. The registration also carried a design question the hub had never answered: what a mode that returns a value looks like in a policy whose destinations are all actors. The answer was already in the runtime's schema, and finding it was the phase's main discovery.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The registry entry, the `transport-axis` extension, and the discriminator prose the new mode falsified
- Router signals, vocabulary classes, tie-break position, intent map and resource map
- The mode table, roster, leaves, description, graph intent signals and hub changelog
- The dispatch-audit shape and the eight checks with their fixtures
- The hub compiler's transport support, the harness source list, the canary cases, the serving re-mint and the trigger index

### Out of Scope

- The packet's own documents, authored in phase 002
- The feature catalog and the scenario files, phase 004's
- Any change to the seven existing modes' contracts or routing behavior

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/mode-registry.json` | Modify | Transport entry, axis extension, prose |
| `.skilled/skills/cli-external-orchestration/hub-router.json` | Modify | Signal, vocabulary classes, tie-break |
| `.skilled/skills/cli-external-orchestration/ROUTER.md` | Modify | Intent row and resource map |
| `.skilled/skills/cli-external-orchestration/SKILL.md` | Modify | Mode table, two-axis model, layout, references |
| `.skilled/skills/cli-external-orchestration/README.md` | Modify | Roster, routing chain, default correction |
| `.skilled/skills/cli-external-orchestration/leaf-manifest.json` | Modify | Five leaves |
| `.skilled/skills/cli-external-orchestration/description.json` | Modify | Advisor identity |
| `.skilled/skills/cli-external-orchestration/graph-metadata.json` | Modify | Intent signals |
| `.skilled/skills/cli-external-orchestration/changelog/v1.6.0.0.md` | Create | Release entry |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Modify | Shape, executor basenames, branch, text fallback |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Modify | Eight checks |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Modify | Fixtures and the transport governance test |
| `.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` | Modify | Shape and negative rows |
| `.skilled/bin/lib/compiled-routing/.../lib/registry-compiler.cjs` | Modify | Transport role and authority relation |
| `.skilled/bin/lib/compiled-routing/.../harness/build-artifacts.cjs` | Modify | Source inputs and the gold assertion |
| `.skilled/bin/lib/compiled-routing/.../fixtures/canary-cases.v1.json` | Modify | Transport route and defer cases |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-external-orchestration/manifest.json` | Modify | Re-mint |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Modify | Regeneration |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Register the mode as a transport satisfying the gate's transport contract | Per-hub gate green at eight modes, with a negative control proving the rule fires |
| REQ-002 | Make the dispatch audit and the hard-rule engine recognize a jev dispatch | The command resolves and the prose does not; eight checks with fixtures |
| REQ-003 | Put the mode on every routing surface | Registry, router, tie-break, intent map, resource map, leaves, mode table, roster |
| REQ-004 | Compile and serve the new policy | The compiled route resolves the mode and the manifest is fresh |
| REQ-005 | Keep the transport out of the executor paths | The scorer does not resolve it; the compiled destination carries role `transport` and no commit authority |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Keep the new alias narrow | An out-of-domain prompt defers at the hub and resolves elsewhere at stage one |
| REQ-007 | Regenerate the derived artifacts from their generators | Leaf manifest byte-identical; intent signals missing=0; trigger index paths all resolve |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every gate reports the mode after the change, and each gate was run from the final state rather than inferred from an earlier run
- **SC-002**: The seven existing modes route exactly as before on the prompts that were replayed
- **SC-003**: A transport cannot be compiled into the policy as an actor, and cannot be routed to by an alias that also matches ordinary prose
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The compiled-routing toolchain | Without compiler support the mode cannot be served | The compiler was taught the role the shared schema already declares |
| Risk | A new alias that is too broad | Captures unrelated prompts | A narrowness fixture and an out-of-domain replay at both routing stages |
| Risk | A registration that leaves the manifest stale | The runtime serves the old policy while the files claim otherwise | The freshness probe was re-run after the last edit |
| Risk | Editing a generated artifact by hand | The next regeneration silently reverts it | Generators were used, and their outputs checked |
| Risk | The loaded hook holding a cached library | The new checks appear inert | Recorded as a limitation with the reason |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None outstanding. Whether a second transport would need a second axis entry is a question for the next mode, not this one; the extension is an array precisely so that it does not need re-deciding.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Routing cost is unchanged for the existing modes; one weight-4 signal and two classes are added
- **NFR-P02**: The check registry stays dependency-free, so the preflight cost does not grow with the mode count

### Security

- **NFR-S01**: The transport cannot write and holds no commit authority in the compiled policy
- **NFR-S02**: The inline-credential rule advises against a key on a command line

### Reliability

- **NFR-R01**: Every check fails open, and the bijection guard is what keeps a fail-open path from hiding a missing implementation
- **NFR-R02**: The compiled policy is content-addressed, so a stale manifest is detected rather than served silently
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8b. EDGE CASES

### Data Boundaries

- Registry with a transport: the compiler previously refused to load it at all, which is the failure this phase removed
- Router signal with no tie-break entry: the registry compiler refuses the drift outright

### Error Scenarios

- A transport holding commit authority: the decision contract refuses the policy, which is why the authority edge is `evidenceOnly`
- A missing implementation for a declared rule: the bijection guard fails the suite

### State Transitions

- Policy change: the manifest goes stale immediately, and the freshness probe reports the new hash as `currentPolicyHash` while the served one is unchanged
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Eighteen files across the hub, the hooks and the compiled-routing toolchain |
| Risk | 12/25 | Routing surfaces shared by seven other modes; a compiler change on the serving path |
| Research | 12/20 | Required reading the compiler, the decision contract and the schema to find the transport role |
| Multi-Agent | 2/15 | One workstream |
| Coordination | 6/15 | Depends on the packet's rules and the toolchain's compile path |
| **Total** | **47/100** | **Level 3 by the packet's declared level; the recommend-level scorer returned Level 2** |
<!-- /ANCHOR:complexity -->
