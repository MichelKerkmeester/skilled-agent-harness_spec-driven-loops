---
title: "Feature Specification: Phase 5: docs-governance-and-closeout"
description: "The closeout phase for cli-jev creation: roster and hub-catalog mentions, the parent's completion metadata, the recursive strict gate over the packet, and the trigger-index and continuity refresh."
trigger_phrases:
  - "cli-jev closeout"
  - "docs governance"
  - "recursive strict validation"
  - "roster mentions"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: docs-governance-and-closeout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-20 |
| **Branch** | `scaffold/005-docs-governance-and-closeout` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-catalog-and-playbook |
| **Successor** | None |
| **Handoff Criteria** | Every reader-facing surface that enumerates the hub's modes names the transport; the hub catalog no longer claims "zero extension axes"; the parent's spec and goal carry the phase map and decisions; `validate.sh --recursive --strict` prints `RESULT: PASSED`; the trigger index is regenerated and continuity is saved |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the cli-jev creation: add Jev as the eighth cli-external-orchestration mode, a transport packet that bridges the jev CLI and its judgment contract specification.

**Scope Boundary**: Documentation and governance only. No mode behavior, no dispatch rule, no routing surface and no alias changes in this phase; a change to any of those belongs to the phase that owns it.

**Dependencies**:
- Phases 001 to 004 Complete: the contract is pinned, the packet exists, every routing surface is registered, both routing stages replay, the compiled manifest is fresh, and both package validators pass.
- The hub gate (`parent-skill-check` on the hub path) is green at eight modes.
- The two dispatch suites pass, including the declared/implemented bijection.

**Deliverables**:
- Roster mentions where the repository enumerates the hub's modes: `.skilled/agents/orchestrate.md` (Rule 7 and the anti-pattern table), `.skilled/agents/prompt-improver.md` (the eligibility note) and `.skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md` (the persona-attachment table).
- Correction of the hub's own feature catalog, which still asserted the hub had no transport axis — a claim the registration falsified.
- The parent `074-cli-jev-creation/spec.md` and `goal.md` completed with the phase map, the decisions and the completion state.
- The recursive strict gate over the parent and the five children, the regenerated trigger index and the continuity save.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The mode is registered, routed and guarded, but the documents a reader consults first were written before it existed. Three roster documents still describe a hub of seven executors with no transport, and the hub's own feature catalog still asserts "no transport axis" in the same file that lists `cli-jev`'s siblings. The parent `spec.md` is still the scaffold create.sh produced, so the phase map and handoff criteria exist only in the child folders. Nothing had run the recursive gate over the packet as an integrated whole, so no single command proved the five children agree.

### Purpose
Leave every reader-facing surface true, complete the parent metadata, and produce the gate result that closes the packet — without changing any mode's behavior, contract or routing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Roster mentions in the three documents that enumerate the hub's modes, each written so a transport is not mistaken for an executor.
- The hub catalog's falsified claims: `feature-catalog/feature-catalog.md` and `feature-catalog/cli-executor-dispatch-routing/cli-executor-dispatch-routing.md`.
- The parent `spec.md` and `goal.md`.
- The five documents of this phase, and the recursive strict validation of the packet.
- Regeneration of the trigger index and the continuity save for the packet.

### Out of Scope
- Any behavior, rule, alias or routing change; the seven existing modes and the transport's own contract stay exactly as phases 002 and 003 shipped them.
- Any packet-local `description.json` or `graph-metadata.json`; the hub stays the single advisor identity.
- Repairing pre-existing advisory findings outside this packet's reach (for example the hub catalog's warn-tier title/description mismatches documented before this phase existed).
- A provider credential or a live judgment call; both remain operator steps.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/agents/orchestrate.md` | Modify | Rule 7 trigger, the transport anti-pattern row and the related-resource line |
| `.skilled/agents/prompt-improver.md` | Modify | A note that the transport needs no eligibility row because it runs nothing |
| `.skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md` | Modify | The persona-attachment table gains a transport row |
| `.skilled/skills/cli-external-orchestration/feature-catalog/feature-catalog.md` | Modify | Mode counts, the transport paragraph and the inspector line |
| `.skilled/skills/cli-external-orchestration/feature-catalog/cli-executor-dispatch-routing/cli-executor-dispatch-routing.md` | Modify | The same corrections at the leaf that owns the routing description |
| `specs/cli-external-orchestration/074-cli-jev-creation/spec.md` | Modify | Parent phase map, handoff criteria and metadata |
| `specs/cli-external-orchestration/074-cli-jev-creation/goal.md` | Create | Parent durable directive, decisions and completion criteria |
| `specs/cli-external-orchestration/074-cli-jev-creation/005-docs-governance-and-closeout/**` | Modify | This phase's five documents |
| `specs/cli-external-orchestration/074-cli-jev-creation/004-catalog-and-playbook/{spec.md,plan.md}` | Modify | Complete the phase-004 pair left at scaffold |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Modify | Regenerated after the spec docs landed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every document that enumerates the hub's modes names `cli-jev` as a transport rather than leaving it out or calling it an executor | The three roster documents and both hub catalog files carry the transport, with a reader able to tell that it runs nothing |
| REQ-002 | The parent `spec.md` carries the phase map with real statuses and the handoff criteria table, and `goal.md` carries the decisions and completion criteria | `validate.sh --strict` on the parent reports no error for either file |
| REQ-003 | The recursive strict gate over the parent and the five children prints an explicit `RESULT: PASSED` | `validate.sh specs/cli-external-orchestration/074-cli-jev-creation --recursive --strict` output read in full |
| REQ-004 | Every child's five documents are authored rather than scaffold, including the phase-004 pair | A scaffold-token scan over the five children returns empty |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The trigger index is regenerated after the spec docs land and a lookup for the packet surfaces it | `generate-trigger-index.mjs` then `lookup-trigger-index.mjs --json -- "typesafe jev judgment"` |
| REQ-006 | Continuity is saved for the packet through the continuity writer, and the operator steps are named rather than silently skipped | The save runs through `/speckit:save`; the operator steps appear in the phase's implementation summary |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No reader-facing surface in or around the hub still claims the hub has no transport axis.
- **SC-002**: The parent spec and goal describe the packet as delivered, with phase statuses that match the children's own documents.
- **SC-003**: The recursive gate prints `RESULT: PASSED` with the parent and all five children in scope.
- **SC-004**: The one thing only the operator can do — supply a Jev provider credential — is stated as an open step with its exact variable names, not as a deferred defect.

### Requirement Traceability

| SC | REQ |
|----|-----|
| SC-001 | REQ-001, REQ-004 |
| SC-002 | REQ-002, REQ-004 |
| SC-003 | REQ-003 |
| SC-004 | REQ-005, REQ-006 |
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A roster edit changes a contract instead of a mention | A behavior change shipped under a docs phase | Every edit is prose that names the transport; no rule, alias, table row or command changes |
| Risk | The hub catalog correction trips its package validator | A previously passing package fails | The validator was run after the edit; the pre-existing warn-tier findings were recorded as out of scope before the edit |
| Risk | The trigger-index regeneration produces a large diff | Reviewers read it as a regression | The diff is verified path by path: removed paths that do not resolve, added paths that do |
| Dependency | Phases 001-004 complete | The closeout has nothing to close | Each child's own strict gate ran before this phase started |
| Dependency | The hub gate stays green at eight modes | Registration evidence would be stale | Re-run after the catalog edit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **The provider credential.** Unresolved by design: no Jev credential exists in this workspace, so the two authenticated playbook scenarios stay SKIP. The operator supplies `TYPESAFE_API_KEY`, `AI_GATEWAY_API_KEY`, `OPENROUTER_API_KEY` or `JEV_API_KEY` (with `JEV_ENDPOINT` for `custom`), or accepts the unauthenticated evidence set as final.
- **The gateway-key question.** Answered in the packet, not here: the existing gateway credential cannot front jev without a translating proxy, and none was built.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The phase adds no runtime work; the only executable it runs is the validation and index regeneration, both one-shot.

### Security
- **NFR-S01**: No credential value appears in any document this phase touches; the redaction check from phase 001 stays the evidence.

### Reliability
- **NFR-R01**: Every claim in this phase's documents was produced by a command run in this session, not quoted from an earlier one.
- **NFR-R02**: The recursive gate is re-run after the last write, so the recorded result matches the final tree.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8b. EDGE CASES

### Data Boundaries
- A document that enumerates modes in more than one place: each occurrence is checked, not just the first.
- A scaffold-token scan that matches legitimate square brackets: the scan targets the template phrases, not bracket characters.

### Error Scenarios
- External service failure: not applicable — the phase makes no network call.
- Network timeout: not applicable for the same reason.
- Concurrent access: the trigger index and continuity save are single-writer operations run by this session.

### State Transitions
- Partial completion: if the recursive gate fails, the phase stays open with the failing rule named rather than the result softened.
- Session expiry: the continuity save runs before the report, so the state survives the session.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Nine documents edited or created, no code |
| Risk | 6/25 | Docs only; the risks are stale claims and a noisy index diff |
| Research | 4/20 | The facts were established in phases 001-004 |
| **Total** | **18/25** | **Level 2** |

The scorer's Level 2 matches the scaffolded level, so no upgrade applied here.
<!-- /ANCHOR:complexity -->
