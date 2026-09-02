---
title: "Feature Specification: Phase 1: baseline-and-instrumentation"
description: "Three numbers this packet depends on are unmeasured or wrong. Freeze the corpora, re-capture the scorer baseline, count coverage from the table the runtime actually reads, and make the lane's contribution visible."
trigger_phrases:
  - "advisor baseline"
  - "embedding coverage count"
  - "lane attribution"
  - "frozen corpus gate"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/023-semantic-lane-enablement/001-baseline-and-instrumentation"
    last_updated_at: "2026-09-03T00:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the phase specification"
    next_safe_action: "Freeze the three corpora and re-capture the scorer baseline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-023-001-baseline-and-instrumentation"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which run can score real embeddings, given the committed baseline substitutes fixture vectors"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: baseline-and-instrumentation

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
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-embedding-population |
| **Handoff Criteria** | Coverage, latency and the scorer baseline are recorded from the running system, and the lane's contribution is readable from outside the process |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Semantic lane enablement specification.

**Scope Boundary**: Measurement and read-only reporting. No weight, no vector and no flag changes.

**Dependencies**:
- The advisor daemon, reachable through `node .opencode/bin/skill-advisor.cjs`.
- The three corpora that packet 052 froze, which this phase adopts as gates rather than rewriting.

**Deliverables**:
- `research/baseline.md`, carrying coverage per node, the scorer metrics, latency and the corpus hashes.
- A read-only coverage and lane report on the advisor status surface.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Three numbers this packet is built on are either unmeasured or wrong.

Coverage was recorded as zero of fourteen. That count reads `skill_nodes.embedding`, a retired
column which is genuinely empty. The live read path prefers the active `vec_<dim>` table, and a
direct query returns nine rows in `vec_768` against an active pointer of `nomic-embed-text-v1.5`
at dimension 768. So the real gap is five hubs, not fourteen, and the five are named.

The lane's contribution cannot be observed. A recommendation carries `dominantLane` and nothing
else, so no caller can tell whether the semantic lane scored a row, returned nothing, or was
skipped because the prompt embedding failed. The lane keeps a `runtimeHealth` record with a
`disabledReason`, and nothing exposes it.

The accuracy gate cannot see an embedding change. The committed baseline is captured with
`VITEST=true` set deliberately, which makes the lane substitute deterministic fixture vectors
because real embeddings do not reproduce in continuous integration. Every ratchet run re-scores
under that same regime. So a change to real vectors moves nothing the gate measures, and a later
phase claiming safety from a green ratchet would be claiming it from a run that never saw the
change.

### Purpose

Put the real starting numbers on record and make the lane observable, so the phases that follow
argue from measurement rather than from a default.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Adopting the 444-signal corpus, the 180-row realistic corpus and the 224-row out-of-scope control set as frozen gates, each pinned by a content hash.
- Re-capturing the scorer eval baseline and recording all six metrics with the commit they were captured at.
- Counting embedding coverage per node from the active vector table, and naming the nodes that have none.
- Recording daemon latency and cost per recommendation at the current weight.
- A read-only report of lane state, coverage and `disabledReason` on the advisor status surface.

### Out of Scope
- Changing any lane weight. Phase 004 owns that, and changing it here would void the baseline this phase exists to capture.
- Embedding anything. Phase 002 owns population.
- Rewriting the corpora. A corpus edited during a baseline is not a baseline.
- Reconciling the daemon scorer with the Python scorer, which disagree on roughly a third of prompts and are governed elsewhere.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/baseline.md` | Create | Coverage per node, scorer metrics, latency, corpus hashes |
| `mcp-server/handlers/advisor-status.ts` | Modify | Report lane liveness, weight, vector count and `disabledReason` |
| `mcp-server/lib/scorer/lanes/semantic-shadow.ts` | Modify | Expose the existing runtime health record through the status path |
| `mcp-server/scripts/routing-accuracy/scorer-eval-baseline.json` | Modify | Re-captured at this phase's commit |
| `mcp-server/tests/handlers/advisor-status.vitest.ts` | Modify | Cover the new read-only fields |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Record embedding coverage per node from the active `vec_<dim>` table, naming every node without a vector |
| REQ-002 | Re-capture the scorer eval baseline and record all six metrics with the commit and the fixture hashes |
| REQ-003 | Pin the three corpora by content hash so a later phase measures against the same rows |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Expose lane liveness, resolved weight, vector count and `disabledReason` through the advisor status surface, read-only |
| REQ-005 | Record daemon latency per recommendation, sampled over at least twenty calls, at the current weight |
| REQ-006 | State whether any existing run scores real embeddings rather than fixture vectors, and name it or record its absence |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader can name the five uncovered hubs without opening the database. Matches AC-001.
- **SC-002**: The six baseline metrics are recorded and re-derivable from the capture script. Matches AC-002.
- **SC-003**: The three corpus hashes are recorded and match the files on disk. Matches AC-003.
- **SC-004**: `advisor_status` reports a vector count that agrees with a direct query of the active table. Matches AC-004.
- **SC-005**: The fixture-vector limitation of the accuracy gate is written down where a later phase will read it. Matches AC-006.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The advisor daemon | No measurement is possible without it | The daemon self-starts through the CLI front door, and freshness is reported per call |
| Dependency | The local embedding backend | The prompt side of the lane needs it per call | Record whether it answered, and record the `disabledReason` when it did not |
| Risk | The baseline is captured while another agent edits skill metadata | High | Record the commit, and re-derive the fixture hashes at the moment of capture |
| Risk | Adding status fields changes what the scorer does | Medium | The report is read-only, and the coverage query runs against a read-only handle |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A single recommendation stays inside the 60 second CLI timeout. The observed figure in the predecessor packet was five to six seconds per prompt.
- **NFR-P02**: The coverage query adds no measurable time to a recommendation, because it runs on the status path rather than the scoring path.

### Security
- **NFR-S01**: Every database read uses the read-only handle, so a measurement can never create or migrate the graph database.

### Reliability
- **NFR-R01**: Each measured call writes its output and its exit status to separate files, so a failed call cannot hide inside a pipeline.
- **NFR-R02**: A missing embedding backend degrades the report to a recorded reason rather than an error.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: an empty recommendation array is a measured result, and the predecessor corpus returned one on 94 of 180 rows.
- Maximum length: corpus prompts are full sentences, because the point is to measure how people write.
- Invalid format: a node present in `skill_nodes` with no row in the active vector table counts as uncovered rather than as an error.

### Error Scenarios
- External service failure: the embedding backend is unreachable, the lane records `prompt_embedding_failed`, and the report carries that reason.
- Network timeout: a call that exceeds 60 seconds is recorded as a failed row and re-run once, with both attempts kept.
- Concurrent access: another agent rebuilds the graph during a sweep, which is caught by re-deriving the corpus hashes after the run.

### State Transitions
- Partial completion: a sweep that stops halfway leaves per-row files, so it resumes rather than restarts.
- Session expiry: the daemon restarts mid-sweep and reports a new generation, which is recorded beside the affected rows.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Five files, roughly 180 lines, one system |
| Risk | 5/25 | No auth, no breaking change, read-only additions to one handler |
| Research | 13/20 | Locating the real coverage source and the fixture-vector regime |
| **Total** | **27/70** | **Level 2** |

`recommend-level.sh --loc 180 --files 6` returns level 1 at score 27. This phase is authored at
level 2 because its closure depends on acceptance criteria, which is a level 2 document.
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether any existing run scores real embeddings rather than fixture vectors. REQ-006 answers it by naming the run or recording its absence, and phase 004 cannot claim safety from the ratchet until that answer exists.
- Whether the daemon and a fresh process resolve the same active pointer. Both read the same table, and the sweep records the pointer it saw.
<!-- /ANCHOR:questions -->

---
