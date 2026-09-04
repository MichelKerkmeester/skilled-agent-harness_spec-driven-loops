---
title: "Feature Specification: Phase 5: hub-surface-truth"
description: "Every automated gate reads the registries and nothing reads the documents. So a hub surface can contradict its own registry indefinitely, and three of them currently do."
trigger_phrases:
  - "hub surface truth"
  - "full inventory intent"
  - "command column invariant"
  - "document versus registry drift"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/005-hub-surface-truth"
    last_updated_at: "2026-09-02T18:54:23Z"
    last_updated_by: "claude-code"
    recent_action: "Filled the phase spec against shipped commits"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/ROUTER.md"
      - ".opencode/skills/sk-doc/README.md"
      - ".opencode/commands/doctor/scripts/parent-skill-check.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-005-hub-surface-truth"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The gap was that no check compared a document against the registry it describes"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 5: hub-surface-truth

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Three hub surfaces claimed something their registries contradicted, and every one of them was
found by hand. Correcting them was the small part. The lasting part is invariant 6c, the
first check that compares a document against the registry it describes, proven to fail four
ways before it was trusted.

**Key Decisions**: the registry is the source of truth and the document moves, and every fix
gets a check.

**Critical Dependencies**: the hub parent check in the doctor command surface, which is where
the new invariant lives.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 7 |
| **Predecessor** | 004-cross-hub-vocabulary |
| **Successor** | 006-validator-and-template-debt |
| **Handoff Criteria** | Invariant 6c green on the live tree, inventory complete at 252 leaves, readme surfaces on the current mode set |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the routing completeness phases specification.

**Scope Boundary**: hub-facing documents and the check that compares them to their
registries. The registries themselves are not edited to make a document right.

**Dependencies**:
- The hub leaf manifest, which supplies the count the inventory intent must match.
- The mode registry, which supplies the mode set the readme surfaces must name.
- The hub parent check, which is where a new invariant can live.

**Deliverables**:
- `FULL_INVENTORY` completed from 128 to 252 leaves, each resolving on disk.
- Readme description, trigger phrases and at-a-glance table on the current mode set.
- Invariant 6c, the command column check, with its five-case test file.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Three hub surfaces state something their registries contradict, and none of them has a gate.
The inventory intent claims to enumerate the whole toolkit and lists 128 of 252 leaves. The
hub manifest shows a mode as having no command while the command file exists in all five
runtime trees. The readme summary and its own frontmatter still describe a smaller hub than
the one that ships.

Each was found by hand. That is the actual defect: every automated check reads a registry,
and no check compares a document against the registry it describes.

### Purpose

The hub documents agree with the registries, and a check fails when they stop agreeing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The three surfaces above, corrected against the registries.
- A check that compares a document's enumerations against the registry, so this class cannot silently return.
- The link-label class as well, since a label naming a path it does not point at is the same failure.

### Out of Scope

- Rewriting the prose for style. This phase is about claims that are false, not sentences that read poorly.
- The voice backlog on those documents, which is measured in the hundreds and is a separate job.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/ROUTER.md` | Modify | `FULL_INVENTORY` completed from 128 to 252 leaves (`98a327edf9`, 128 lines) |
| `.opencode/skills/sk-doc/README.md` | Modify | Description, trigger phrases and at-a-glance table on the current mode set (`98a327edf9`) |
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | Modify | Invariant 6c, the command column check (`98a327edf9`, 22 lines) |
| `.../parent-skill-check-command-column.test.cjs` | Create | The four failure modes plus the restore case (`98a327edf9`, 285 lines) |
| `.opencode/skills/sk-doc/SKILL.md` | Modify | The hidden command restored to the mode table (`08eb67a0de`) |
| `.opencode/skills/sk-doc/sk-create-frontmatter/SKILL.md` | Modify | Keyword-triggers line the hub contract requires (`08eb67a0de`) |
| `.opencode/skills/sk-doc/sk-create-repo-rule/SKILL.md` | Modify | Keyword-triggers line the hub contract requires (`08eb67a0de`) |
| `research/findings-register.md` | Modify | Five findings recorded closed, and the check that keeps them closed (`8bb9011584`) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The inventory intent enumerates every leaf, or it drops the completeness claim |
| REQ-002 | A mode whose command file ships in every runtime tree is not reported commandless by the hub manifest |
| REQ-004 | A document that contradicts its registry fails a check, and that check is shown failing before it is trusted |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The readme summary and its frontmatter name the current mode set rather than a smaller hub |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `FULL_INVENTORY` holds 252 paths, matching the hub leaf manifest, each resolving
  on disk.
- **SC-002**: The hub manifest shows the declared command in the mode's own row rather than a
  dash.
- **SC-003**: The description, the trigger phrases and the at-a-glance table each name all six
  previously missing domains.
- **SC-004**: Invariant 6c fails on the dash form, on a wrong command string and on a deleted
  row, and passes on restore.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The hub leaf manifest | Without it the inventory has no count to match | Manifest freshness is a separate existing check |
| Dependency | The hub parent check | A new invariant needs a place to live | Invariant 6c added beside the existing ones |
| Risk | A check introduced green has never demonstrated it can fail | High | Ship the check red on the one real instance, and land the fix in the commit that owns the file |
| Risk | Appending to a truncating summary surface | Medium | Rewrite the description inside its budget rather than appending to its tail |
| Risk | A one-column check reads as full document coverage | Medium | State the limit in the known limitations rather than implying breadth |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Invariant 6c runs inside the existing hub parent check and adds no separate
  pass over the tree.

### Security
- **NFR-S01**: The check reads committed files only and writes nothing.

### Reliability
- **NFR-R01**: The check is deterministic: the same tree gives the same verdict, and a
  restored row returns it to green.

---

## 8. EDGE CASES

### Data Boundaries
- A mode with no command at all: the dash is correct, and the check must not fire.
- A leaf path present in the manifest but absent on disk: the inventory claim is false even
  though the count matches.

### Error Scenarios
- A wrong command string in the right row: caught, since a mention anywhere is not enough.
- A deleted row: caught, since the mode is declared in the registry and missing from the table.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | Files: 8, LOC: ~450, Systems: hub docs plus the doctor check |
| Risk | 12/25 | Auth: N, API: N, Breaking: N, though a red check blocks a gate |
| Research | 10/20 | The gap was found by inspection rather than by measurement |
| Multi-Agent | 5/15 | Workstreams: 1 |
| Coordination | 11/15 | Dependencies: the routing commit that owns the manifest file |
| **Total** | **53/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The new check ships green and is never proven able to fail | H | M | Shipped red on the one real instance, fixed in the commit owning that file |
| R-002 | The inventory count matches while a path does not resolve | M | L | Each of the 252 paths verified to resolve on disk |
| R-003 | A tail-appended readme fix disappears where the surface truncates | M | M | The description was rewritten inside its budget |

---

## 11. USER STORIES

### US-001: The full-toolkit intent actually enumerates the toolkit (Priority: P0)

**As a** reader routing through the hub, **I want** the one intent that promises a complete
enumeration to deliver one, **so that** a leaf I cannot see is not simply absent.

**Given** the inventory intent claims completeness, **When** it is compared to the leaf
manifest, **Then** it enumerates every leaf or drops the claim.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: A document that contradicts its registry fails something (Priority: P0)

**As a** maintainer, **I want** a check that reads the document against the registry, **so
that** a hand-found defect does not need to be found by hand again.

**Given** a mode whose declared command is hidden in the hub table, **When** the check runs,
**Then** it fails, and it passes again when the row is restored.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Finding 25, a contract stated in the hub manifest and not honoured by two packets, remains
  owned rather than closed.
- Invariant 6c covers one column. The rest of a hub document can still disagree with its
  registry without failing anything, which is the same class this phase was created to close.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Durable Directive**: See `goal.md`
