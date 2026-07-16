---
title: "Spec: True-Citation Ledger Density Benchmark"
description: "Benchmarks the default-off SPECKIT_TRUE_CITATION_EMITTER against the ledger-density prerequisite the 024 demote-only Beta-posterior reranker design is blocked on. The emitter mines a session transcript for the memory ids the assistant referenced after a search and writes used and not-used pairs to a shadow ledger, the real-citation signal the hollow result_cited flag lacks. A read-only harness measures three things on the live corpus: the shown universe the emitter reconstructs from, whether a real session-scoped emit can ever fire, and whether the assistant text actually echoes the shown ids the detector keys on. The emit pipe is proven separable on a scratch copy, but the live corpus carries zero session-scoped shown rows and the bare integer detector matches mostly number noise, so the live ledger density a reranker could consume is zero. The verdict is REFINE: the firing trigger and the reference key both need a named change before the emitter earns its ledger."
trigger_phrases:
  - "true citation ledger benchmark"
  - "SPECKIT_TRUE_CITATION_EMITTER density"
  - "citation ledger feasibility"
  - "used vs unused citation signal separation"
  - "true citation emitter firing trigger"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/004-dark-flag-graduation/003-true-citation-ledger"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Built the read-only feasibility harness, ran it on the live corpus, authored the REFINE verdict"
    next_safe_action: "Phase complete, verdict lives in benchmark-results.md"
    blockers: []
    key_files:
      - "scripts/citation-ledger-feasibility.mjs"
      - "results/metrics.json"
      - "benchmark-results.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: True-Citation Ledger Density Benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-24 |
| **Branch** | `system-speckit/029-memory-search-intelligence` |
| **Parent** | `../spec.md` (dark flag graduation suite) |
| **Feature** | `SPECKIT_TRUE_CITATION_EMITTER` (`lib/feedback/true-citation-emitter.ts`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 028 packet ships the true-citation emitter dark behind a default-off flag. The emitter mines the post-hoc transcript for the memory ids the assistant actually referenced after a search and writes used and not-used pairs to a separate shadow ledger. This is the real-citation signal the hollow `result_cited` flag lacks, since `result_cited` fires for every shown result on a content search so cited equals shown and the corpus holds zero shown-but-unused negatives. The 024 reranker research recorded a CONDITIONAL-GO on a demote-only Beta-posterior penalty and blocked the win on PREREQ-A ledger density: the gold-and-ledger intersection sat at 0.4 percent with the emitter off and a measured prod win needs it materially higher. The emitter was held off because it adds a transcript-mining write path that must earn ledger density before any reranker consumes it. Nobody has measured whether the emitter, when enabled, actually reaches that density on the real corpus or produces a usable used-versus-unused separation.

### Purpose
Measure the emitter against the 024 density prerequisite on the production corpus, read-only, and return GRADUATE, REFINE, or CUT. Measure the shown universe the emitter reconstructs from, whether a real session-scoped emit can ever fire on the live data, and whether the assistant text actually echoes the bare integer memory ids the detector keys on. Prove the emit pipe end-to-end against a scratch copy so any input gap is isolated from a code defect. If the emitter cannot reach the density today, diagnose the exact firing-trigger and reference-key blocks and design the refinement that would unblock it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A read-only feasibility harness that backs up the live database and measures the emitter on the production corpus without ever writing the live ledger
- Three measurements: the live `search_shown` ledger structure, the firing-trigger reachability under the emitter's session-scoped reconstruction, and the real-transcript reference hit rate for the bare integer detector
- A real transcript-replay end-to-end against a scratch database copy that proves the emit pipe writes a real used-versus-unused split when the inputs line up
- A GRADUATE, REFINE, or CUT verdict grounded strictly in the measured numbers, with the firing-trigger refinement designed if REFINE

### Out of Scope
- Editing the emitter, the search handler, the flag readers, or any shared production code. This is a read-only benchmark
- Flipping `SPECKIT_TRUE_CITATION_EMITTER` to default-on or enabling it on the live server
- Building the 024 reranker. The reranker is a downstream consumer of the ledger this benchmark assesses, not in this phase
- The corpus-geometry prerequisite PREREQ-B from 024. This phase measures the density side the emitter owns, not whether a reliable-negative-above-gold geometry exists
- Any write to the live `feedback_events` or `true_citation_events` tables. The replay forces the flag on inside the harness process only, against a scratch copy

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| spec.md | Create | Defines the density-benchmark scope and the REFINE disposition |
| plan.md | Create | Defines the read-only harness method and the verification route |
| tasks.md | Create | Records the harness and documentation tasks |
| checklist.md | Create | Records the verification items |
| scripts/citation-ledger-feasibility.mjs | Create | The read-only feasibility harness over the live corpus |
| results/metrics.json | Create | The measured ledger structure, replay, and reference-realism rollup |
| benchmark-results.md | Create | The full data tables and the REFINE verdict |
| implementation-summary.md | Create | Records the benchmark outcome and the firing-trigger refinement design |
| description.json | Create | Search metadata for this phase |
| graph-metadata.json | Create | Child identity and graph metadata for this phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The emitter is measured on the production corpus, not only a synthesized ledger | the harness reads the live `search_shown` rows the production search handler writes, and reports the shown universe, the session linkage, and the distinct query and memory counts |
| REQ-002 | The harness reads the live database read-only and any emit write lands on a scratch copy | the live database is backed up read-only, the replay forces the flag on inside the harness process against the scratch copy, and `true_citation_events` is never created on the live database |
| REQ-003 | The phase returns one of GRADUATE, REFINE, or CUT with evidence | the verdict cites values present in metrics.json |
| REQ-004 | Default-off byte-identity is verified | with the flag off the emit is a no-op that returns zeros and does not create the shadow table |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The ledger density is measured against the 024 PREREQ-A prerequisite | metrics.json reports whether a real session-scoped emit can reach a non-zero ledger density on the live corpus |
| REQ-006 | The used-versus-unused signal separation is measured | the replay proves the emit pipe writes a correct used and not-used split, and the reference-realism scan reports how often a live shown id is actually echoed in real assistant text |
| REQ-007 | The harness is reproducible from committed config | `node scripts/citation-ledger-feasibility.mjs` rebuilds metrics.json |
| REQ-008 | If the verdict is REFINE, the firing-trigger refinement is designed | the firing-trigger and the reference-key changes are named with the exact production seam each touches |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A read-only harness that measures the emitter on the production corpus and never writes the live ledger, proven by the absence of a live `true_citation_events` table after the run
- **SC-002**: A measured answer to whether the emitter reaches the 024 ledger-density prerequisite, with the firing-trigger ceiling reported as the session-scoped shown count and the reference signal reported as the real-transcript echo rate
- **SC-003**: A GRADUATE, REFINE, or CUT verdict grounded strictly in the measured numbers, with the firing-trigger refinement designed when REFINE
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The harness writes the live ledger | A benchmark mutates the production memory database | The live database is backed up read-only and the flag is forced on only inside the harness process against a scratch copy, so no emit write reaches the live database |
| Risk | A code defect reads as an input gap | The verdict blames the data when the emitter is broken | A scratch replay with hand-aligned inputs proves the emit pipe writes a correct used-versus-unused split, isolating any input gap from a code defect |
| Risk | The reference hit rate reads as real density | A reader treats a number-collision match as a citation | The harness buckets the matched ids by digit length and samples the matched context, so the short-id collisions are visible as noise rather than citations |
| Dependency | The 024 PREREQ-A ledger-density prerequisite | The benchmark measures the emitter against it | The 024 research recorded the 0.4 percent gold-and-ledger intersection and the 0.000-by-construction reranker delta as the density block |
| Dependency | The production `search_shown` rows and the live transcripts | The emitter reconstructs the shown universe from the former and mines references from the latter | Both exist on disk, the harness reads them read-only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The harness reads the live database read-only and backs it up once per run, so the live daemon write lock is never contended
- **NFR-P02**: The reference-realism scan is bounded to a recent-transcript sample, so the run completes in seconds rather than scanning the full transcript history

### Security
- **NFR-S01**: The live database is never opened for writes and the flag is forced on only inside the harness process, so no benchmark cell mutates the live memory database
- **NFR-S02**: The scratch copy lives in a temporary directory created with restricted permissions and is removed after the run

### Reliability
- **NFR-R01**: The replay isolates the emit pipe from the input gap, so a failed separation reads as a code defect and a zero density reads as an input gap, never the reverse
- **NFR-R02**: The harness fails closed on a missing live database or an unreachable transcript directory rather than fabricating a number
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A live corpus with zero session-scoped shown rows: the emitter's session-scoped reconstruction returns an empty set, so a real session-scoped emit fires on nothing despite a populated shown universe
- A short integer memory id like `8` or `16`: the bare-token detector matches it inside ordinary prose counts, so the apparent reference coverage is mostly number noise rather than a citation of the shown memory
- An absent `true_citation_events` table: the emitter has never run on the live database, so the live ledger density is zero by construction

### Error Scenarios
- The flag off: the emit is a no-op that returns zeros and does not create the shadow table, the byte-identity case
- A transcript that never echoes a shown id: the emitter writes every shown id as a not-used pair, so an all-negative ledger is the honest outcome when the assistant cites by content rather than by id

### State Transitions
- Flag off to on inside the harness: the off path touches nothing, the on path writes the used-versus-unused split to the scratch copy only, so the live database is unchanged across the transition
- Empty ledger to populated: the replay shows the populated state the emitter can produce when a session-scoped shown set and an id-echoing turn coincide, the configuration the live corpus does not exhibit
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | One read-only harness and a phase folder, no production edits |
| Risk | 5/25 | Read-only over the live database, the only write lands on a scratch copy |
| Research | 17/20 | A three-axis feasibility measurement against the 024 density prerequisite plus a scratch replay and a reference-realism scan |
| **Total** | **29/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether the firing trigger should plumb a stable session id into the production `search_shown` write so the emitter's session-scoped reconstruction can reach the shown universe, which the search handler currently records with a null session id on the non-eval branch
- Whether the reference key should change from a bare integer memory id to a content or title anchor the assistant actually echoes, since the assistant cites a memory by its content not its database id
<!-- /ANCHOR:questions -->
