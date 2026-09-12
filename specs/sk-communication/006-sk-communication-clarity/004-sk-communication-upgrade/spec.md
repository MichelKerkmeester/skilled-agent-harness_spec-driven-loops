---
title: "Feature Specification: Phase 4: sk-communication-upgrade"
description: "Execute the adopted allocations that land in the sk-communication skill, its two rewrite commands, and its routing to the wording standard."
trigger_phrases:
  - "sk-communication upgrade"
  - "rewrite response contract"
  - "wording standard routing"
  - "cut and reorder pass"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: sk-communication-upgrade

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-12 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-root-doc-and-repo-rules |
| **Successor** | 005-verification-and-rollout |
| **Handoff Criteria** | All eight items land, the package gate passes, and the standard still has one home |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the sk-communication clarity program.

**Scope Boundary**: Only the allocations phase 002 assigned to the skill, its commands, or the
wording standard. The projection package's byte-safety, privacy and provider invariants are frozen
by the packet that built them and are not reopened here.

**Dependencies**:
- Phase 002's decision record, which authorises all eight items below.
- Phase 007, which is now a hard prerequisite: the decision to send the wording standard as the
  provider instruction means this phase needs the standard's reply base, and that base is phase
  007's output.

**Deliverables**:
- The provider-facing instruction declared once instead of twice, with the test fixture's literal
  reading the same declaration.
- The instruction's target noun corrected, since it names a role the profiles do not.
- The validator's five unconditional pass markers moved inside the guard whose comparisons they
  describe, or the comparisons run unconditionally.
- The accept record carrying what kind of change a candidate made, from values already computed.
- Each rewrite command stating which pass it performs.
- The provider instruction resolving to the wording standard's reply base rather than a literal
  sentence, which is the decision that closes the program's largest single finding.
- A claim-based omission comparison joining the existing semantic checks inside the same guard.
- A no-op value on the change-kind field, so an unchanged candidate stops hiding inside a pass.
- Both provider profiles aligned on provider-default thinking mode.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

This phase's own research run replaced its premise. The skill's documentation says plain English is
the wording standard and that every rewrite path routes there rather than carrying a private
rubric. The engine does not carry that standard at runtime. The whole instruction a rewriting
provider receives is thirteen words, declared twice as a literal with a third copy in a test
fixture, and nothing composes standard content onto it before it is sent. The operator commands do
load the standard correctly, so the gap is a split between two paths rather than an omission.

Three smaller defects sit beside it. The instruction names a role the profiles do not declare. The
fidelity validator stamps five pass markers for comparisons that a guard skipped, so the evidence
record asserts checks that never ran. And the accept record says a candidate passed without saying
what it changed.

### Purpose

Land the four fixes that need no design decision, keep the standard's single home intact, and leave
the five open engine decisions to phase 002 rather than settling them here.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The skill's wording-standard section and the exclusions it currently maintains by hand.
- `/rewrite:response`: which pass it performs, and whether cutting and reordering is in that pass.
- `/rewrite:response-by-external-agent`: the same declaration, and its engine-selection text where allocated.
- The skill's own feature catalog and changelog entries for whatever changes.
- The reply half of the wording standard, if phase 002 allocated a split.

### Out of Scope
- The projection package's byte-safety, privacy, provider and telemetry invariants.
- The default-off enablement flag and the advisor route exclusion, both deliberate and unchanged.
- Reviving the retired explanation lane.
- The document-scoring half of the wording standard, which stays `sk-doc`'s.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-communication/SKILL.md` | Modify | Wording-standard routing and the rewrite contract |
| `.opencode/commands/rewrite/response.md` | Modify | Declare the pass performed |
| `.opencode/commands/rewrite/response-by-external-agent.md` | Modify | Declare the pass performed |
| `.claude/commands/rewrite/*.md` | Modify | The Claude-runtime mirrors of both commands, kept in step |
| `.opencode/skills/sk-communication/feature-catalog/` | Modify | Record the changed capability |
| `.opencode/skills/sk-communication/changelog/` | Create | A version entry for the change |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/references/` | Modify | Only if phase 002 allocated a reply-scope split |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The wording standard has exactly one home, and no voice or tone rubric is written into a command, an asset or a presentation contract |
| REQ-002 | Every change traces to an adopted row in phase 002's allocation table |
| REQ-003 | The projection invariants are unchanged: the canonical original is preserved, privacy runs before ranking, and every failed path returns exact-original bytes |
| REQ-004 | Each rewrite command states which pass it performs, and states it as rewording without reordering, per the lane decision |
| REQ-008 | The provider instruction resolves to the standard's reply base, and no code path composes a private rubric onto it |
| REQ-009 | The omission comparison runs inside the existing guard, so an unchanged candidate still skips it |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The hand-maintained exclusion list is exactly one row shorter after phase 007 restructures the standard, and the surviving row's reason is ownership rather than documentness. It cannot be replaced outright, which this phase's research established |
| REQ-006 | The skill stays off advisor routing and off by default, and the change does not quietly alter either |
| REQ-007 | The feature catalog and changelog record what changed, so the skill's own documentation does not drift from its behavior |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A search for voice or tone rubric text across the skill's commands and assets finds pointers to one home and no second copy.
- **SC-002**: Both rewrite command documents name their pass in their own text.
- **SC-003**: The package gate runs green from the final state, with its output and exit status both read.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 allocation table | No authorized scope | The phase does not open until the table is complete |
| Dependency | Phase 003 | The skill would route to rule text still being edited | Sequence after phase 003 closes |
| Risk | A rubric copied into a command | Two copies that drift the moment either is edited | The skill's own rule already forbids it, and SC-001 checks for it |
| Risk | Widening the rewrite pass to reordering changes what the projection may touch | A reorder can change what the original claimed, which is a fidelity failure rather than a voice improvement | Keep the protected spans and the meaning check binding, and treat a claim change as a rejected candidate |
| Risk | Editing the wording standard for the reply case degrades the document case | Documents are the standard's original consumer | Any split keeps the document half intact and names which consumer reads which half |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The rewrite path's latency budget is unchanged by this phase.
- **NFR-P02**: The skill's document set stays within the size that loads without displacing task context.

### Security
- **NFR-S01**: Credentials stay references rather than values, unchanged by this phase.
- **NFR-S02**: Telemetry stays content-free, unchanged by this phase.

### Reliability
- **NFR-R01**: Every unsupported, unsafe, timed-out, cancelled or failed path still returns the exact original bytes.
- **NFR-R02**: Unknown or stale facts still fail closed to original-only.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a rewrite of an empty or whitespace-only target returns the original rather than inventing a reply.
- Maximum length: a target longer than the bounded context window is projected within the bound or returned unchanged.
- Invalid format: a target whose protected spans cannot be restored is rejected and the original is returned.

### Error Scenarios
- External service failure: the external-agent command returns the original rather than a partial projection.
- Network timeout: the same, and the inline enablement flag falls away so the default-off invariant holds even on error.
- Concurrent access: two rewrite invocations share no mutable state, because neither writes canonical bytes.

### State Transitions
- Partial completion: a candidate that fails the meaning check is discarded whole, never merged into the original.
- Session expiry: an expired external credential returns the original and surfaces the provider requirement.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Skill document, two commands, catalog and changelog |
| Risk | 12/25 | The frozen invariants bound the risk, but a reorder touches fidelity |
| Research | 6/20 | The investigation happened in phases 001 and 002 |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Does a cut-and-reorder pass stay inside the projection contract, or does reordering count as changing what the original claimed?
- If the wording standard splits, which consumer owns the reply half: `sk-doc` as today's owner, or this skill as its only reply-side consumer?
<!-- /ANCHOR:questions -->

---

