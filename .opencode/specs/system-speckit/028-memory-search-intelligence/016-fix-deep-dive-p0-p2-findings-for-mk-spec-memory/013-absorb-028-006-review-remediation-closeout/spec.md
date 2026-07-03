---
title: "Feature Specification: Phase 13: absorb-028-006-review-remediation-closeout"
description: "Program bookkeeping closeout: point the absorbed trackers (028/006/002, 028/006/004, ex-031 Group-A) at their owning phases, complete the 91-item P2 mapping, sweep the findings ledger for silent drops, record two scaffolding tooling bugs, and run the final recursive validation."
trigger_phrases:
  - "review remediation closeout"
  - "absorbed tracker pointers"
  - "p2 triage mapping"
  - "findings completeness sweep"
  - "016 program closeout phase"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/013-absorb-028-006-review-remediation-closeout"
    last_updated_at: "2026-07-03T09:57:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Authored phase planning docs (spec, plan, tasks, checklist)"
    next_safe_action: "Execute LAST in program order, after phase 012 closes"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-03-016-013-closeout-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does the 028/006 clean re-review requirement carry forward after absorption, or does the program's own eval + validation evidence close the loop?"
      - "Which follow-on owner takes the two spec-kit tooling fixes (create.sh child level, upgrade-level.sh addendum paths)?"
    answered_questions:
      - "Absorption decision: operator chose ABSORB — Group-A plus 028/006/002 plus 028/006/004 fold into this program; phase 013 closes the old trackers with pointers"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 13: absorb-028-006-review-remediation-closeout

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-03 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 012-envelope-presentation-and-command-doc-alignment |
| **Successor** | None |
| **Handoff Criteria** | Every absorbed tracker row carries a disposition pointer; the 91-item P2 mapping and the ledger completeness table have zero unmapped entries; `validate.sh --strict` is green across the program parent plus all 13 children; the closeout memory save is indexed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the Deep dive remediation phase children specification.

**Scope Boundary**: Spec-document and metadata edits only. This phase writes tracker docs, mapping tables, parent rollups, and generator-owned JSON metadata. It ships zero code changes — every code fix belongs to phases 001-012, and the two tooling bugs it records are routed, not fixed here.

**Dependencies**:
- Phases 001-012 executed (or their final statuses known) — this phase runs LAST in the program execution order (011 → 001-005 → 006 → 007-008 → 009 → 010 → 012 → 013) and its mapping claims depend on the other phases' outcomes.
- `../research/phase-decomposition.md` (authoritative finding-to-phase map), `../research/deep-dive-report.md` §6 (known-open inventory), `../research/findings-ledger.md` (Agent A section for the tracker landscape).
- Operator absorption decision (recorded in ../spec.md): Group-A → phase 007; 028/006/002 items → phases 008/009; 028/006/004 P2 triage → this phase's mapping table.

**Deliverables**:
- Absorbed trackers updated in place with pointers: `../../006-review-remediation/002-memory-schema-and-concurrency/`, `../../006-review-remediation/004-p2-triage/`, `../../014-manual-playbook-execution-sweep/001-findings-remediation/tasks.md`.
- 028/006 parent spec + graph metadata refreshed so packet 028's blocker status is accurate; 028 packet-parent phase-map rows synchronized.
- Findings-completeness mapping table in this phase's `tasks.md` — every ledger finding mapped to a phase task or accepted-as-is with a reason.
- Two new tooling findings recorded with repro (create.sh child-level bug, upgrade-level.sh broken upgrade path).
- Final program validation evidence: recursive strict validation, scoped `memory_index_scan`, `/memory:save` closeout.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator absorbed three open trackers into this program, but the tracker docs still advertise their pre-absorption state: `028/006/002-memory-schema-and-concurrency` and `028/006/004-p2-triage` read "PENDING, scaffold only" with no pointer to the phases that now own their items, and the ex-031 tracker (`028/014/001-findings-remediation`) still lists T-0211/T-0212 as "queued for next fix-dispatch round". Packet 028's parent rollup therefore reports a stale blocker picture, the 91-item P2 triage has no per-item disposition, and roughly 150 ledger findings have never been audited for silent drops against the 13 phase scopes. Two tooling bugs discovered while scaffolding this very program are so far recorded nowhere actionable.

### Purpose
Close the program's books: every absorbed tracker row points at its owning phase, every ledger finding has an explicit disposition, packet 028's status surfaces are accurate, the tooling bugs are tracked with repro, and the whole program validates green recursively.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Absorption pointer edits: 028/006/002 items P1-2/P1-4 → phase 008, item P1-5 → phase 009; ex-031 Group-A rows (T-0211/T-0212/REQ-214) → phase 007.
- Completing 028/006/004's 91-item P2 mapping table: each item → covered-by-phase-NNN of this program, or accept-as-is with a reason.
- Sweeping the remaining open rows of `028/014/001-findings-remediation/tasks.md` (Phase-2 appendix and deferred/blocked rows) and mapping each to one of: covered by phase NNN, stays in 014, obsolete.
- Status reconciliation: 028/006 parent spec + graph metadata; 028 packet-parent phase-map rows; 016 program-parent phase-map final statuses.
- Findings-completeness sweep over `../research/findings-ledger.md` with the mapping table produced in this phase's `tasks.md`.
- Recording two new tooling findings (create.sh, upgrade-level.sh) with reproducible evidence and routing them to a follow-on owner.
- Final program validation: `validate.sh --strict` across parent + 13 children, scoped `memory_index_scan`, `/memory:save` closeout.

### Out of Scope
- Any mcp_server or script code change — code fixes live in phases 001-012; the two tooling bugs are recorded and routed here, not fixed.
- Re-deciding triage verdicts already owned by phases 001-012 — this phase maps and points, it does not re-litigate fixes.
- Editing executed done-evidence in 028/006 children 001/003/005/006 or in packet 030 — their records are frozen.
- Re-running the 028/006 deep review — whether a clean re-review round is still required post-absorption is an operator decision recorded here, not performed here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `../../006-review-remediation/002-memory-schema-and-concurrency/tasks.md` | Modify | Mark T005/T006 absorbed → phase 008, T007 absorbed → phase 009, with pointer paths |
| `../../006-review-remediation/002-memory-schema-and-concurrency/spec.md` | Modify | Status note: scope absorbed into program 016 phases 008/009 |
| `../../006-review-remediation/002-memory-schema-and-concurrency/implementation-summary.md` | Modify | Record absorption disposition instead of pending contract |
| `../../006-review-remediation/004-p2-triage/spec.md` | Modify | Complete the 91-item per-item mapping in the lens-family triage table |
| `../../006-review-remediation/004-p2-triage/tasks.md` | Modify | Close T004-T011 against the completed mapping with evidence |
| `../../006-review-remediation/004-p2-triage/implementation-summary.md` | Modify | Record the finalized triage state and routing |
| `../../006-review-remediation/spec.md` | Modify | Phase-map rows for 002/004 updated from pending to absorbed/closed with pointers |
| `../../006-review-remediation/graph-metadata.json` | Regenerate | Derived status refresh after the parent spec update |
| `../../spec.md` | Modify | 028 packet-parent phase-map row for 006 (blocker accuracy) and 016 status |
| `../../graph-metadata.json` | Regenerate | 028 packet-parent derived status refresh |
| `../../014-manual-playbook-execution-sweep/001-findings-remediation/tasks.md` | Modify | Group-A rows marked absorbed → phase 007; open-row sweep dispositions |
| `tasks.md` | Modify | Findings-completeness mapping table filled during execution |
| `../spec.md` | Modify | 016 program-parent phase-map final statuses at closeout |
| `../graph-metadata.json` | Regenerate | Program-parent derived status refresh |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | 028/006/002 tracker points at its absorbing phases: P1-2 and P1-4 → phase 008, P1-5 → phase 009 | Grep of `002-memory-schema-and-concurrency/tasks.md` shows T005/T006/T007 each carrying an absorbed-pointer line naming the owning phase folder; no row still reads as an unowned pending contract |
| REQ-002 | 028/006/004's 91-item P2 mapping table is complete: every item → covered by phase NNN of this program, or accept-as-is with a reason | Row count over the completed table equals 91; zero rows without a disposition; every phase pointer names an existing child folder of this program |
| REQ-003 | Ex-031 Group-A rows are absorbed: T-0211, T-0212, and REQ-214 point at phase 007 | `028/014/001-findings-remediation` tasks/spec rows for the three items carry the absorbed → `016/007-ranking-filter-bypass-and-score-scale-fixes/` pointer and no longer read "queued" |
| REQ-004 | Findings-completeness sweep: every finding in `../research/findings-ledger.md` is mapped to a phase task or explicitly accepted-as-is with a reason — no silent drops | The mapping table in this phase's `tasks.md` covers every ledger section (L1-L9, DUP MECHANISM, agents E/F/I/A/C/G/D/H, plus the absent Agent B section via report §3/§4 references) with per-section disposition counts and zero unresolved rows |
| REQ-005 | Parent status accuracy: 028/006 parent spec + graph metadata and the 028 packet-parent phase map reflect the absorbed/closed state | 028/006 `spec.md` phase-map rows for 002/004 no longer say pending-scaffold; regenerated `graph-metadata.json` parses and derives the updated status; 028 parent map row for 006 matches |
| REQ-006 | Final program validation is green and the closeout is saved | `validate.sh --strict` exits 0 for the 016 parent and each of the 13 children; scoped `memory_index_scan` covers the program parent and edited tracker folders; `/memory:save` closeout recorded |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Every other open row in `028/014/001-findings-remediation/tasks.md` (Phase-2 appendix + deferred/blocked rows) is mapped to one of: covered by phase NNN, stays in 014, obsolete | Each of the known open rows (T003, T-0032, T-0056, T-0062, T-0087, T-0193, T-0194, T-0208, T-0240, T-0372, T-0381, T900-T902) carries exactly one disposition annotation |
| REQ-008 | The two scaffolding tooling findings are recorded as tracked items with repro and routed to a follow-on owner | Both findings appear in this phase's `tasks.md` with script-line anchors and a reproducing command; the routing decision (owner or new packet) is recorded |

### Acceptance Scenarios

1. **Given** the absorbed 028/006/002 tracker, **When** a reader opens its `tasks.md` after this phase, **Then** rows T005/T006/T007 each name the program phase that owns the fix and the doc makes no unowned pending claim.
2. **Given** the 91-item P2 set frozen in `028/006/archive/review-report.md`, **When** the mapping table is complete, **Then** every item resolves to exactly one disposition and every covered-by pointer names an existing phase folder.
3. **Given** the ex-031 tracker, **When** Group-A absorption lands, **Then** T-0211/T-0212/REQ-214 read absorbed → phase 007 and the remaining open rows each carry a sweep disposition.
4. **Given** packet 028's parent rollup, **When** the status reconciliation lands, **Then** the phase-map row for 006-review-remediation no longer reports a stale blocker state and the regenerated graph metadata parses clean.
5. **Given** the findings ledger, **When** the completeness sweep finishes, **Then** the tasks.md mapping table shows zero findings without either a phase-task owner or an accept-as-is reason.
6. **Given** the completed program, **When** the final validation task runs, **Then** strict validation exits 0 for the parent and all 13 children and the closeout memory save is visible to a scoped search.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero absorbed tracker rows without a disposition pointer — verified by grep over the three tracker folders.
- **SC-002**: 91/91 P2 items mapped; ledger completeness table complete with no silent drops (per-section counts reconcile against the ledger).
- **SC-003**: Packet 028's blocker status is accurate: 028/006 parent and 028 packet-parent surfaces agree with the absorbed/closed child states.
- **SC-004**: `validate.sh --strict` exit 0 across the 016 parent plus all 13 children in one final run.
- **SC-005**: Both tooling findings are reproducible from their recorded evidence by a reader with no session context.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 001-012 completion state | Mapping rows claiming covered-by-phase-NNN are wrong if a phase closed differently than planned | Setup task re-reads each phase's final status before mapping; disposition distinguishes owned-by-phase from shipped |
| Risk | Concurrent sessions editing the shared trackers (observed during the 014 sweep: another session owned deep-loop files) | Medium — edit collisions or clobbered rows | Check `git status` on every target file before editing; re-read after edit; keep edits row-scoped |
| Risk | Hand-editing generator-owned JSON drifts from the derive logic | Medium — status surfaces disagree again | Regenerate `graph-metadata.json`/`description.json` via the spec-kit generators, never hand-edit derived fields; verify with a JSON parse |
| Risk | The 028/006 source review closed NOT CONVERGED; absorption may not discharge the clean re-review requirement | Medium — packet 028 closure claim could overreach | Record the operator's re-review disposition explicitly in the 028/006 parent update; do not mark the review loop closed without it |
| Dependency | Memory MCP surface healthy for `memory_index_scan` and `/memory:save` | Closeout save blocked if the daemon is down | Phase 011 (executed first) restores surface trust; CLI fallback documented in the plan |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the 028/006 phase-transition rule "re-run /deep:review on 028 until a clean round" survive absorption, or does the program's eval-parity + validation evidence close the source-review loop? Operator decision, recorded during execution.
- Who owns the two spec-kit tooling fixes (create.sh child-level, upgrade-level.sh addendum paths): a new speckit packet or an existing tooling tracker? Routed during execution, fix out of this program's scope.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The full closeout pass (tracker edits + mapping tables + validation + index scan) completes within one working session; the 91-item table and the ledger sweep are batchable and resumable row-by-row.
- **NFR-P02**: The final recursive validation run stays a single command per folder — no bespoke tooling introduced for closeout.

### Security
- **NFR-S01**: No secrets, tokens, or machine-local absolute paths are written into any tracker doc — repo-relative paths only.
- **NFR-S02**: Generator-owned JSON is regenerated through spec-kit tooling, never hand-edited into a shape the derive logic would not produce.

### Reliability
- **NFR-R01**: The closeout is idempotent — re-running the pointer edits and metadata regeneration on already-closed trackers produces zero further diffs.
- **NFR-R02**: Every disposition is traceable: a reader can follow any tracker row to its owning phase task (or accept-as-is reason) without session context.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Finding maps to no phase and has no accept reason: halt the sweep row, route to the operator — silent drops are the failure mode this phase exists to prevent.
- Phase 001-012 closed differently than planned: the disposition records the actual outcome (owned-but-descoped, moved, or shipped), never the planned one.
- Ledger Agent B section absent (report notes it pending): cover B-tagged findings via report §3/§4 citations instead, recorded in the mapping table note.

### Error Scenarios
- Tracker row already edited by a concurrent session: re-read the file, reconcile rather than overwrite, and note the collision in the sweep notes.
- Generator fails on a hand-edited tracker: restore the file from git, re-apply the row-scoped edit, regenerate.
- Memory surface down at closeout: record CLI-fallback evidence (`node .opencode/bin/spec-memory.cjs`), defer the save, and keep the phase open rather than claiming completion.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 14 documentation surfaces across 4 packets; zero code files |
| Risk | 8/25 | Text-only and git-revertible, but status surfaces feed packet-028 rollups and resume ladders |
| Research | 12/20 | Full ledger sweep (~150 findings), 91-item P2 mapping, 14-row open-item sweep |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
