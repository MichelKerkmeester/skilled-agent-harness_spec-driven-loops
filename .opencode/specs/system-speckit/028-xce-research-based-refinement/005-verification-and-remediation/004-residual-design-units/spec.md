---
title: "Feature Specification: Residual 029 Design Units (vector truth, replay pool, launcher parity)"
description: "After 029 closed its P0/P1 deep-review queue and the original-backlog careful tail, three packet-scale builds and a defer-by-design bucket remain. Each touches a delicate subsystem (live vector store, prompt-safety replay, daemon lifecycle) and needs its own safety gate before code."
trigger_phrases:
  - "residual design units"
  - "tri-105 vector reconcile"
  - "tri-148 launcher parity"
  - "hash-class replay pool"
  - "029 follow-on"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/005-verification-and-remediation/004-residual-design-units"
    last_updated_at: "2026-06-13T14:30:00Z"
    last_updated_by: "scaffold-author"
    recent_action: "Units A/B + tail shipped; Unit C documented; tri-163 refuted, tri-129 deferred"
    next_safe_action: "None — resolved; only deferred Unit C / tri-129 remain as tracked follow-ons"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:b3db1ff916fb4c6f23bce7c21683241320a90f4d5e406396002455b735916221"
      session_id: "030-scaffold-populate-2026-06-13"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Residual 029 Design Units

<!-- SPECKIT_LEVEL: 1 -->
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
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Resolved (units A/B + tail shipped; Unit C documented; tri-163 refuted; tri-129 deferred; tri-135 already-correct) |
| **Created** | 2026-06-13 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Parent Spec** | ../spec.md |
| **Phase** | 30 of 30 |
| **Predecessor** | 029-deep-research-remediation |
| **Successor** | None |
| **Handoff Criteria** | Each design unit shipped with its safety gate satisfied (backup+quiesce for A, privacy-invariant for B, live-adoption harness for C). |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 30** of the 027 XCE epic: the dedicated follow-on for the residual 029 work the operator routed off the tail-grind session. 029 closed both original goals plus the round-2 deep-review queue (18 P1 + 33 P2). What remains is not a flat backlog. It is three packet-scale builds, each delicate enough that the AI Council (`029-deep-research-remediation/ai-council/council-report.md`) recommended structuring this packet as design units rather than a task list.

**Scope Boundary**: Only the genuinely-open residual after 029. This packet designs and ships three units plus a defer-by-design bucket. It does NOT reopen any closed 029 finding, and it does NOT force the design-first items to close before the 027 epic closes (the council verdict was unanimous that none is a live P0/P1 regression).

**Dependencies**:
- 029 deep-review round-2 PASS (closed) is the predecessor state.
- The vector-surface divergence HEALTH (tri-105 health half) already shipped in commit `c86424df8a`; Unit A consumes it.
- The shadow-evaluation typed `no-replay-pool` skip (tri-007/008/009 honesty half) already shipped in commit `6cbb7b457c`; Unit B consumes it.
- The spec-memory packet-140 supervision scaffold is the reference implementation Unit C ports from.

**Deliverables**:
- Unit A: a reconciled live vector store with a per-class adjudication record.
- Unit B: a privacy-preserving hash-class synthetic replay corpus wired into the shadow-evaluation scheduler.
- Unit C: launcher parity for mk-code-index (transparent recycle / front-proxy) or a recorded document-the-asymmetry decision.
- A defer-by-design bucket and an L9/L2 verify-first tail, both tracked.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
029 ground the deep-research remediation down to its tail, but three residual builds were deliberately deferred because each mutates a high-blast-radius subsystem: the live production vector store (corruption history), the prompt-safety replay path (raw query text is permanently banned), and the code-index daemon lifecycle (3x historical dual-writer DB corruption). Treating them as inline fixes would invert the exact risk discipline that opened and closed the 027 epic.

### Purpose
Ship the three residual design units, each gated by its own safety contract, so the 027 epic's last genuinely-open work lands without rushing the most delicate code in the system.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Unit A — Vector storage truth (tri-105 reconcile).** Reconcile the live divergence: active surface `vec_768=10381` vs `memory_index.success`/`vec_memories=10072`, composed of 6 true orphans + 308 vectors for non-success memories + 5 success rows missing their `vec_768` vector. A backup plus a daemon-quiesced maintenance op plus an explicit per-class decision (prune orphans / re-embed missing / adjudicate the 308). The divergence HEALTH already shipped; only the ~314-row data reconcile remains. (Implemented numbers differ from this planning snapshot: the live divergence had drifted by execution time, so the shipped reconcile reset 91 success-missing-active-vector rows to retry behind an online backup — see implementation-summary.md.)
- **Unit B — Shadow/feedback + replay pool (tri-007/009/103, feeds L2 tri-022/131).** Build a privacy-preserving hash-class synthetic replay corpus (sample synthetic eval queries by `query_hash`/intent class) and integrate it into the shadow-evaluation scheduler. Fold the Cluster B/C remnants from the L7 disposition. The honesty half (typed no-replay-pool skip) already shipped.
- **Unit C — Launcher parity (tri-148).** Port the transparent-recycle / front-proxy to `mk-code-index-launcher.cjs` by replicating spec-memory's full packet-140 supervision scaffold (crash-loop guard, owner-disposal-race guard `shouldAbortRelaunchOnFire`, relaunch backoff, process-group reap), validated with the live-daemon adoption test harness — OR record the council's lean document-the-asymmetry decision as the terminal answer.
- A tracked defer-by-design bucket and an L9/L2 verify-first tail (see §4 and §6).

### Out of Scope
- Reopening any closed 029 finding - the round-2 verdict is PASS and the epic-close decision is unanimous.
- Forcing the design-first units to close before 027 epic-close - the council verdict explicitly says nothing must close first.
- Any bounded raw-prompt retention for the replay corpus - `query_text` is permanently banned (asserted by `consumption-logger-privacy.vitest.ts`); auto-rejected unless provably non-reversible.
- The Turso backend migration - gated on upstream signals, out of 027 entirely.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| (Unit A) memory vector store + reconcile op | Modify | Backup, daemon-quiesce, per-class reconcile of ~314 rows; design-doc first |
| (Unit B) shadow-evaluation scheduler + replay corpus builder | Create/Modify | Hash-class synthetic corpus + scheduler integration; no raw query text |
| (Unit C) `mk-code-index-launcher.cjs` + adoption harness | Modify/Create | Port packet-140 supervision scaffold OR record document-the-asymmetry |
| ../spec.md (parent phase-map rows 30) | Modify | Fill row-30 scope/criteria/verification only |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Unit A vector reconcile is a backed-up, daemon-quiesced maintenance op, never an inline migration. | A backup exists before mutation AND the daemon is quiesced AND a per-class decision (6 orphans, 308 non-success, 5 missing-success) is recorded before any row mutates. |
| REQ-002 | Unit B replay corpus never stores raw query text. | `consumption-logger-privacy.vitest.ts` (or equivalent) still asserts `query_text` absence after the corpus ships; the corpus is keyed only by `query_hash`/intent class. |
| REQ-003 | Unit C launcher change is verified against the dual-writer corruption class before it lands, or the asymmetry is documented instead. | Either the live-daemon adoption harness proves no SIGTERM/relaunch flap, OR a recorded document-the-asymmetry decision is the terminal answer with no launcher mutation. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Each design unit produces a design doc before its implementation. | A design note answering the unit's key question (canonical surface for A, permissible corpus for B, parity-vs-document for C) precedes code. |
| REQ-005 | The defer-by-design bucket is tracked, not silently dropped. | tri-138, tri-163, tri-129/135, L3, and the `:637` investigation each appear as a not-started task with its deferral rationale. |
| REQ-006 | The L9/L2 tail is verify-first: each item re-confirmed still-real before any implementation. | tri-108/109, tri-111/113/117/121/122/124, carry-overs 125/158, and L2 tri-031 are each marked verify-first; none is implemented without re-confirmation. |
| REQ-007 | Unit B folds the Cluster B/C remnants noted in the L7 disposition. | The shadow-promotion (Cluster B) and persistence (Cluster C) remnants are addressed within Unit B's design, not left orphaned. |
| REQ-008 | The AI Council report is the design reference for unit structure and ordering. | The plan sequences units per the council roadmap (vector-truth, then replay, then launcher last as highest risk). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Unit A ships a reconciled vector store with the active surface and `vec_memories` consistent, backed by a backup and a per-class adjudication record.
- **SC-002**: Unit B ships a hash-class synthetic replay corpus integrated into the shadow scheduler with the no-raw-query-text invariant intact.
- **SC-003**: Unit C either ships verified launcher parity (no flap under the adoption harness) or records the document-the-asymmetry terminal decision.
- **SC-004**: The defer-by-design bucket and L9/L2 tail are tracked with rationale; nothing is silently dropped.

### Acceptance Scenarios

1. **Given** the live vector store shows `vec_768=10381` vs `vec_memories=10072`, **When** Unit A runs, **Then** a backup is taken, the daemon is quiesced, and each of the three divergence classes is adjudicated and reconciled with a recorded decision.
2. **Given** the replay corpus is being built, **When** any candidate eval query is sampled, **Then** only its `query_hash`/intent class is stored and the privacy test still asserts no raw `query_text`.
3. **Given** Unit C proposes a launcher change, **When** the live-daemon adoption harness runs, **Then** it proves no SIGTERM/relaunch flap OR the change is withdrawn in favor of the documented asymmetry.
4. **Given** an L9/L2 tail item is picked up, **When** work starts, **Then** the item is first re-confirmed still-real against current code before any edit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Unit A mutates a live store with a corruption history | High | Backup + daemon-quiesce + per-class decision before any row mutates; never inline |
| Risk | Unit B leaks raw query text into a replay corpus | High | Hard invariant: hash-class only; privacy test gates the corpus |
| Risk | Unit C reintroduces the SIGTERM/relaunch flap + DB corruption | High | Replicate the full packet-140 scaffold; live-adoption harness gates the land; document-the-asymmetry is the lean alternative |
| Risk | Stale dispositions cause rework on the L9/L2 tail | Medium | Verify-first each item; several are likely already-fixed |
| Dependency | tri-105 divergence HEALTH (shipped `c86424df8a`) | Unit A measurement baseline | Consume the shipped health surface |
| Dependency | tri-007/008/009 honesty half (shipped `6cbb7b457c`) | Unit B integration point | Build the corpus on the typed-skip contract |
| Dependency | spec-memory packet-140 supervision scaffold | Unit C reference | Port (not reinvent) the proven scaffold |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Unit A: should the 308 non-success-with-vectors be pruned, re-classed, or retained, and who adjudicates per class?
- Unit B: which permissible corpus model does the operator choose - hash-class synthetic, opt-in enrollment, or permanently-disabled-with-honesty-only?
- Unit C: does the code-index OWNER session need flap-survival parity, or is documenting the asymmetry the correct terminal answer (council leans document)?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
