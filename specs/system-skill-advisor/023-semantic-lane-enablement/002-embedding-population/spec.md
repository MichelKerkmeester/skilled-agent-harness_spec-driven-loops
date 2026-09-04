---
title: "Feature Specification: Phase 2: embedding-population"
description: "Five hubs carry no vector in the active table, and two of them are the hubs Gate B scored at zero. Diagnose why the refresh skipped them, then populate every node with the embedder the runtime already points at."
trigger_phrases:
  - "embedding population"
  - "skill vector refresh"
  - "active embedder pointer"
  - "vector coverage gap"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/023-semantic-lane-enablement/002-embedding-population"
    last_updated_at: "2026-09-03T00:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the phase specification"
    next_safe_action: "Diagnose why five nodes have no row in the active table"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-023-002-embedding-population"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Why the last refresh left five nodes without a row"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: embedding-population

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-09-03 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-baseline-and-instrumentation |
| **Successor** | 003-weight-and-fusion-research |
| **Handoff Criteria** | Every node in `skill_nodes` carries a row in the active vector table under the active model |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Semantic lane enablement specification.

**Scope Boundary**: Vector data and the refresh path that writes it. No lane weight, no fusion change and no flag.

**Dependencies**:
- Phase 001, for the coverage count this phase is measured against.
- A local embedding backend that serves the model the active pointer names.

**Deliverables**:
- Every node covered in the active vector table, verified by a count query.
- `decision-record.md`, carrying the embedder choice and the failure policy.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Nine of fourteen skill nodes carry a vector. The five without one are `mcp-tooling`, `sk-code`,
`sk-design`, `sk-vision` and `system-deep-loop`, and they are all parent hubs. Two of them own the
hubs that Gate B scored at exactly zero, across 37 and 25 corpus rows. A lane that cannot see a
hub cannot route to it, whatever weight it carries.

The refresh path is not obviously broken. It resolves the active pointer, upserts into
`vec_<dim>` and skips a row whose stored content hash still matches. It also deletes a row
outright when the skill has no description to embed, and it stops after three consecutive
failures and counts the rest as failed. Each of those is a plausible way to lose five rows, and
the stored timestamps show two separate runs rather than one: six rows written on 2 August and
three on 21 August. The five missing hubs sit in neither batch, and they are not a contiguous
range in the identifier order the refresh walks, so a single interrupted run does not explain it.

The immediate reading is that all five hubs do carry a description in their `SKILL.md`
frontmatter today, which rules out the simplest explanation and leaves the cause open. Guessing
here would be cheap and wrong. The phase starts by reproducing the skip.

### Purpose

Every hub carries a current vector, and the reason the five were missing is written down so the
gap cannot reopen quietly.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reproducing the skip for the five uncovered nodes and naming the mechanism.
- Running the refresh so every node carries a row under the active model and dimension.
- The content-hash guard, so an edited hub description re-embeds and an unchanged one does not.
- The failure policy when the backend is unreachable, stated and tested.
- A check that fails when coverage drops below full.

### Out of Scope
- Choosing a different embedding model. The active pointer already names one, and changing it re-embeds every row for a reason this packet does not have.
- Removing the retired `skill_nodes.embedding` column. A separate deprecation owns it.
- Any lane weight or fusion change, which phase 004 owns.
- Embedding anything below hub level. The graph holds fourteen nodes, and per-mode vectors are a different design.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp-server/lib/skill-graph/skill-graph-db.ts` | Modify | The skip and delete paths, once the mechanism is known |
| `mcp-server/handlers/skill-graph/scan.ts` | Modify | Refresh coverage after a scan, and report what it wrote |
| `mcp-server/tests/skill-graph/refresh-roundtrip.vitest.ts` | Modify | A case that fails when a node is left without a row |
| `decision-record.md` | Create | The embedder choice, the failure policy and the coverage floor |
| `research/population.md` | Create | The reproduced mechanism and the run output |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Reproduce the skip for the five uncovered nodes and name the mechanism with the code path that causes it |
| REQ-002 | Populate every node in `skill_nodes` with a vector in the active table under the active model |
| REQ-003 | Keep the run offline against the local backend, so no hub description leaves the machine |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Prove the content-hash guard both ways: an edited description re-embeds, an unchanged one is skipped |
| REQ-005 | State and test what happens when the backend is unreachable, so a failed run cannot silently empty the table |
| REQ-006 | Add a check that fails when any node lacks a vector, so the gap cannot reopen unnoticed |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The count of rows in the active vector table equals the count of skill nodes. Matches AC-002.
- **SC-002**: The mechanism that lost five rows is named with a file and a line. Matches AC-001.
- **SC-003**: A second run embeds nothing, because every hash matches. Matches AC-004.
- **SC-004**: A run against a stopped backend leaves the existing rows readable. Matches AC-005.
- **SC-005**: A test fails when a node is left uncovered. Matches AC-006.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The local embedding backend | Nothing can be embedded without it | The active pointer names a model the local backend already serves, checked before the run |
| Dependency | The active pointer in `vec_metadata` | A changed pointer invalidates every stored vector | Record the pointer before and after, and treat a change as a stop |
| Risk | The refresh deletes rows it cannot embed | High | The failure path is tested before the real run, against a copy of the database |
| Risk | Embedding changes routing before phase 004 chooses a weight | Medium | Coverage is measured against the frozen corpora immediately, so the effect of coverage alone is separated from the effect of weight |
| Risk | Another agent rebuilds the graph mid-run | Medium | The daemon owns the writable handle, so the run goes through it rather than around it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A full refresh of fourteen nodes completes within two minutes on the local backend.
- **NFR-P02**: A no-op refresh, where every hash matches, embeds nothing and returns in under a second.

### Security
- **NFR-S01**: Embedding runs against the local backend, so no hub description is sent to a remote service.
- **NFR-S02**: Only the daemon holds the writable database handle, and this phase does not open a second writer.

### Reliability
- **NFR-R01**: A backend outage leaves previously stored vectors readable rather than deleting them.
- **NFR-R02**: A refresh is idempotent. Running it twice gives the same table.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a skill whose frontmatter carries no description, which today removes its row rather than keeping the old vector.
- Maximum length: a very long hub description, which the adapter truncates according to its own limit rather than failing.
- Invalid format: a vector whose length disagrees with the pointer dimension, which the refresh already rejects before writing.

### Error Scenarios
- External service failure: the backend is stopped, and after three consecutive failures the run stops and reports an outage.
- Network timeout: a single slow row, which is retried once before it counts as failed.
- Concurrent access: a scan and a refresh overlap, which the single writable handle serializes.

### State Transitions
- Partial completion: a run that stops halfway leaves the rows it wrote, and a rerun completes the rest through the hash guard.
- Session expiry: the daemon restarts mid-run, and the next refresh resumes from the stored hashes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 11/25 | Five files, roughly 260 lines, one system plus its database |
| Risk | 12/25 | Persistence, a delete path, and a backend that can go away mid-run |
| Research | 12/20 | Reproducing a skip whose simplest explanation is already ruled out |
| **Total** | **35/70** | **Level 2** |

`recommend-level.sh --loc 260 --files 7 --db` returns level 1 at score 38. This phase is authored
at level 2 because it touches persistence and closes against acceptance criteria.
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Why the last refresh left five nodes without a row. REQ-001 answers it by reproduction rather than by argument, and the answer decides whether any code changes at all.
- Whether coverage alone moves Gate B enough to leave the weight at 0.05. The measurement runs here, and the decision belongs to phase 004.
<!-- /ANCHOR:questions -->

---
