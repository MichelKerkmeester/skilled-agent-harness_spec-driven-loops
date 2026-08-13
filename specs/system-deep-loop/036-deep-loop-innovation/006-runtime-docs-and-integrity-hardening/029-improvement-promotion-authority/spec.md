---
title: "Feature Specification: Bind Promotion, Rollback and Council Persistence to Authenticated Receipts and Authorized Roots"
description: "Eight P0s share one mechanism: mutable local JSON is treated as authority. Promotion never checks candidate, target or input hash; ship verifies fields stored inside the same mutable acceptance JSON; the candidate authors the rubric it is scored against; and council persistence resolves its packet root from a caller-chosen argument. Severity is calibrated: the actor is the operator or a stale local file, not a remote attacker."
trigger_phrases:
  - "improvement promotion authority"
  - "promotion acceptance receipt binding"
  - "council persistence packet root"
  - "stale score authorizes promotion"
  - "deep loop 029 promotion"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/029-improvement-promotion-authority"
    last_updated_at: "2026-08-11T13:55:00Z"
    last_updated_by: "codex"
    recent_action: "Confirmed the 3-finding tail landed as f6cdf604a2; implementation is 13/13"
    next_safe_action: "Evidence the checklist and reconcile the ADRs."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    completion_pct: 77
    open_questions:
      - "Packet closeout remains open even though all 13 implementation findings landed: checklist items and ADR dispositions still require evidence-backed reconciliation"
      - "What is the approval model for autonomous mode: advisory-only, or a candidate-and-target-bound operator receipt?"
      - "Which evaluator identity source replaces candidate frontmatter?"
    answered_questions:
      - "CALIBRATION: these eight P0s are severity-inflated. The actor is the operator or a stale local file, not a remote attacker. Read them as cutover-readiness and robustness risk."
      - "The receipt format and approval model are a design decision requiring a decision record, not a patch"
      - "Promotion copies bytes into canonical targets, so a mistake here overwrites shipped files"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

# Feature Specification: Bind Promotion, Rollback and Council Persistence to Authenticated Receipts and Authorized Roots

> Phase adjacency under the `036-deep-loop-innovation` parent (grouping order, not a runtime dependency): predecessor `028-fanout-dispatch-integrity`; successor `030-runtime-mirror-and-routing-parity`.

> **Scaffold dependency.** This child is scaffolded under `036-deep-loop-innovation/` as a flat
> sibling of phases 001-020. That nesting is conditional on child `021`'s hashed-child-manifest fix
> (`F-029-03`) landing first: without a bounded child manifest, every child added here widens the
> parent's unbounded recursive-validation glob. `021` is the first scaffold in the tree.

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Eight P0 findings share one mechanism: mutable local JSON is treated as authority. Promotion checks score status and thresholds but never `score.candidate`, `score.target` or `score.inputHash`, so a stale score from an earlier revision can authorize promotion of a newer unscored candidate. Ship verifies only fields stored inside the same mutable acceptance JSON, so a forged state can point `candidateSnapshotPath` at arbitrary content. The candidate authors the rubric it is scored against. Council persistence resolves its packet root from a caller-chosen positional argument. The severity is calibrated: the actor is the operator or a stale local file, and promotion copies bytes into canonical targets, which is why a mistake here overwrites shipped files.

**Key Decisions**: An authenticated append-only acceptance receipt binds all evidence digests, paths, target preimage, candidate snapshot, evaluator epoch and approval identity (ADR-001); evaluator identity comes from an authority the candidate does not control (ADR-002); every write boundary is contained, not only the target (ADR-003)

**Critical Dependencies**: `021` for honest baselines. Independent of the ledger children.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | In Progress — 13/13 implementation findings landed; the checklist is 0/50 and the ADRs remain Proposed. Tail commit: `f6cdf604a2`. |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent** | `system-deep-loop/036-deep-loop-innovation` |
| **Wave** | W3 |
| **Findings in scope** | 13 (8 P0 / 5 P1 / 0 P2), 1 carrying a review `CONFIRMED*` mark |
| **Blocks `014` cutover** | Gates the improvement lanes of the cutover, not the ledger blockers |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Promotion checks score status and thresholds but never `score.candidate`, `score.target` or `score.inputHash`, so a stale score from an earlier revision can authorize promotion of a newer unscored candidate (`F-017-01`, CONFIRMED-WITH-MITIGATION: the benchmark report is target-bound, which mitigates but does not close it). Ship verifies only fields stored inside the same mutable acceptance JSON, so a forged state can point `candidateSnapshotPath` at arbitrary content and set the hashes to match (`F-017-03`). Rollback accepts either `preAcceptTargetHash` or `candidateHash`, so a forged pair restores an arbitrary backup over the canonical target (`F-017-04`), and direct rollback copies any readable file under the allowed roots with no recorded pre-promotion hash (`F-008-03`). The candidate authors the rubric it is scored against: the scorer derives the evaluator profile and `agentName` from candidate frontmatter and scans integration under that candidate-chosen name (`F-017-05`). The autonomous model-benchmark workflow declares `approvals: none` yet unconditionally invokes `promote-candidate.cjs --approve`, and the script treats flag presence as approval (`F-021-01`). Only the target write boundary is contained; candidate, archive, acceptance, event-log and state paths are not (`F-017-02`). Council persistence resolves its packet root from a caller-chosen positional argument and only checks that `root/ai-council` is inside that same chosen root (`F-019-01`); topic IDs are inserted into paths after a trim-and-non-empty check, so `../` escapes (`F-019-02`); and `--memory-save-payload-out` resolves and overwrites any path (`F-019-03`). Three P1 numeric and parse gates round it out: `Number(x || 0)` comparisons pass on `NaN` (`F-008-01`), a text-less JSONL stream is scored as raw event JSON (`F-008-02`), and the REMEDIATE hook parses `--confirm` and then ignores it (`F-021-02`).

### Purpose
Make promotion, rollback and council persistence depend on authenticated evidence and authorized roots rather than on mutable local files a stale run or an operator mistake can supply.

### Calibration

> **Severity calibration (carry verbatim, do not re-escalate).** The review report states that in
> every confirmed case the actor is the operator or a stale local file, not a remote attacker. Read
> every P0 and P1 below as **cutover-readiness and robustness risk, not breach risk**. A finding's
> severity label is not a licence to treat it as a security incident.

> **Finding = hypothesis.** Only 13 of the 166 register findings carry a `CONFIRMED*` mark. Every
> other finding in the scope table below is an unverified single-leaf report. No fix may be built
> against an unconfirmed finding: T001 re-reads every cited `file:line` at HEAD and records
> `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` before any edit.

### Non-Goals
- Treating these as remote-attacker scenarios. The calibration is explicit: the actor is the operator or a stale local file.
- The ledger children (`022`, `023`, `024`, `025`). This child is independent of them.
- Changing what the improvement lanes measure; only what authorizes a promotion.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An authenticated append-only acceptance receipt binding evidence digests, paths, target preimage, candidate snapshot, evaluator epoch and approval identity.
- Promotion checks `score.candidate`, `score.target` and `score.inputHash`, so a stale or cross-target score cannot authorize.
- Ship verifies against the receipt rather than against fields stored in the same mutable acceptance JSON.
- Rollback accepts only the recorded promoted-candidate hash, and direct rollback records a pre-promotion hash.
- Evaluator identity comes from an authority the candidate does not control.
- Autonomous mode is advisory-only or requires a candidate-and-target-bound operator receipt; flag presence is not approval.
- Every write boundary contained: candidate, archive, acceptance, event log and state paths, not only the target.
- Council persistence confined to an authorized packet root; topic IDs rejected when they can escape; `--memory-save-payload-out` confined.
- `NaN`, `Infinity` and absent score, delta and aggregate fields fail closed.
- A text-less event stream is unscorable rather than scored as raw JSON.
- The REMEDIATE hook requires authorization at both the CLI and the module boundary.

### Out of Scope
- The ledger children.
- Fan-out dispatch (`028`).
- What the improvement lanes measure.

### Findings in Scope (13)

| ID | Sev | Review mark | Location (at review time) | Defect |
|----|-----|-------------|---------------------------|--------|
| `F-021-01` | P0 | unverified | `commands/deep/assets/deep-model-benchmark-auto.yaml:198` | Autonomous model benchmark fabricates promotion approval |
| `F-021-02` | P1 | unverified | `deep-alignment/scripts/remediate-hook.cjs:87` | REMEDIATE hook does not enforce operator confirmation |
| `F-017-01` | P0 | CONFIRMED-WITH-MITIGATION | `deep-improvement/scripts/shared/promote-candidate.cjs:455` | Promotion accepts evaluator receipts for a different artifact |
| `F-017-02` | P0 | unverified | `deep-improvement/scripts/shared/promote-candidate.cjs:550` | Promotion has no candidate or artifact-output containment |
| `F-017-03` | P0 | unverified | `deep-improvement/scripts/shared/promote-candidate.cjs:157` | Ship trusts a caller-forged acceptance receipt |
| `F-017-04` | P0 | unverified | `deep-improvement/scripts/shared/rollback-candidate.cjs:177` | Rollback hash guard is bypassable through the candidate-hash alternative |
| `F-017-05` | P0 | unverified | `deep-improvement/scripts/agent-improvement/score-candidate.cjs:535` | Candidate controls evaluator identity and derived rubric |
| `F-019-01` | P0 | unverified | `deep-ai-council/scripts/lib/persist-artifacts.cjs:532` | Council writer scopes writes relative to an attacker-chosen root |
| `F-019-02` | P0 | unverified | `deep-ai-council/scripts/orchestrate-topic.cjs:48` | Council topic identifiers traverse outside the packet |
| `F-019-03` | P1 | unverified | `deep-ai-council/scripts/lib/persist-artifacts.cjs:1007` | Memory-save payload output is an unrestricted file overwrite |
| `F-008-01` | P1 | unverified | `deep-improvement/scripts/shared/promote-candidate.cjs:518` | Non-finite score values bypass promotion gates |
| `F-008-02` | P1 | unverified | `deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs:322` | Benchmark sweep scores raw event JSON when assistant text is absent |
| `F-008-03` | P1 | unverified | `deep-improvement/scripts/agent-improvement/rollback-candidate.cjs:144` | Direct rollback trusts an unbound backup file |

These eight P0s are the severity-inflation batch. Per the review calibration, the actor is the operator or a stale local file, not a remote attacker, so read them as cutover-readiness and robustness risk. That calibration is why they are batched into one child rather than getting a child each. `F-017-01` is CONFIRMED-WITH-MITIGATION: the benchmark report is target-bound, which mitigates the confirmed live-risk half without closing it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs` | Modify | Receipt-bound promotion; candidate/target/inputHash checks; containment; fail-closed numerics (`F-017-01`, `F-017-02`, `F-017-03`, `F-008-01`) |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs` | Modify | Accept only the recorded promoted-candidate hash (`F-017-04`) |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs` | Modify | Evaluator identity from an authority the candidate does not control (`F-017-05`) |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/rollback-candidate.cjs` | Modify | Record a pre-promotion hash for direct rollback (`F-008-03`) |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs` | Modify | A text-less event stream is unscorable (`F-008-02`) |
| `.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs` | Modify | Authorized packet root; confined payload output (`F-019-01`, `F-019-03`) |
| `.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs` | Modify | Reject topic IDs that can escape the packet (`F-019-02`) |
| `.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs` | Modify | Same root and topic-ID discipline as orchestrate-topic |
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/remediate-hook.cjs` | Modify | Require authorization at CLI and module boundary (`F-021-02`) |
| `.opencode/skills/system-deep-loop/commands/deep/assets/deep-model-benchmark-auto.yaml` | Modify | Autonomous mode advisory-only or receipt-bound (`F-021-01`) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A stale, cross-candidate or cross-target score receipt cannot authorize a promotion. | Three named tests: stale score, score for another candidate, score for another target. All are rejected. |
| REQ-002 | A forged acceptance JSON cannot authorize a ship. | A hand-edited acceptance file pointing `candidateSnapshotPath` at arbitrary content with matching hashes is rejected against the receipt. |
| REQ-003 | Rollback accepts only the recorded promoted-candidate hash. | A forged `preAcceptTargetHash`/`candidateHash` pair does not restore an arbitrary backup. |
| REQ-004 | A candidate cannot select its own evaluator identity. | A candidate whose frontmatter names a different evaluator profile or `agentName` is scored under the authority-supplied identity. |
| REQ-005 | Autonomous mode does not fabricate approval; flag presence is not approval. | The autonomous workflow either runs advisory-only or requires a candidate-and-target-bound operator receipt; `--approve` alone does not promote. |
| REQ-006 | Council persistence cannot write outside its authorized packet root. | A caller-chosen external root and a `../`-bearing topic ID are both rejected before any `mkdir`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Every write boundary is contained: candidate, archive, acceptance, event log and state paths. | One containment test per boundary; none is uncontained. |
| REQ-008 | `NaN`, `Infinity` and absent score, delta and aggregate fields fail closed. | Named tests per field and per non-finite value. |
| REQ-009 | A text-less event stream is unscorable rather than scored as raw event JSON. | Named test: a stream with no assistant text yields an unscorable result. |
| REQ-010 | The REMEDIATE hook requires authorization at both the CLI and the module boundary. | Named tests at both boundaries; parsing `--confirm` and ignoring it is no longer possible. |
| REQ-011 | `--memory-save-payload-out` cannot overwrite an arbitrary path. | Named test: a path outside the authorized root is rejected. |

### Universal - applies to every child in the 021-032 remediation tree

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-U01 | Confirm before build. Every finding ID in the scope table is re-read at HEAD and classified `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` before any code edit. | T001 output table in `tasks.md` lists all scoped IDs with a classification and a cited probe, test, commit, or new anchor. |
| REQ-U02 | Baseline before delta. Every suite this child touches is run **before** any edit and its real numbers recorded; the whole gate is re-run at close and reported as a delta. | Pre-edit and post-edit runs of the named runners are recorded in `checklist.md` with discovered-test counts, pass/fail/skip, and exit codes. |
| REQ-U03 | Negative test per confirmed finding. Acceptance is a test that **fails before the fix and passes after** — never a green suite alone. | Each confirmed finding maps to a named test that is demonstrated red at the pre-fix commit and green at the post-fix commit. |
| REQ-U04 | Independent verification. An adversarial pass is run by a different actor than the builder; a gate authored alongside the change is not independent evidence. | A verification pass distinct from the build pass is recorded, naming the actor and the defects it found (or explicitly none). |
| REQ-U05 | Evidence citations are drift-proof. No completion claim cites a bare run count or a raw line number; every claim cites a **test name + suite-content digest + candidate SHA**. | `checklist.md` evidence strings contain a test name, a suite digest, and a commit SHA. Grep for bare "N/N passing" strings returns none. |
| REQ-U06 | Completion discipline. `validate.sh --strict` exits 0 for this child, all `checklist.md` items are `[x]` with evidence, and completion metadata reconciles across `spec.md` / `plan.md` / `tasks.md` / `implementation-summary.md`. | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-child> --strict` exits 0; no doc claims a completion state another doc contradicts. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 13 scoped findings closed as fixed, `REFUTED`, or `ALREADY-FIXED`.
- **SC-002**: A stale, cross-candidate or cross-target score receipt is rejected.
- **SC-003**: A forged acceptance JSON is rejected.
- **SC-004**: Rollback accepts only the recorded promoted-candidate hash.
- **SC-005**: A candidate cannot select its own evaluator identity.
- **SC-006**: A `../` topic ID and an external packet root are rejected before any `mkdir`.
- **SC-007**: Non-finite and absent numeric fields fail closed.
- **SC-008**: Both improvement and council vitest projects green, reported as deltas against their captured baselines.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Promotion copies bytes into canonical targets, so a mistake overwrites shipped files | High | Every promotion test runs against a fixture target tree, never the real one; containment covers every write boundary |
| Risk | A red baseline exists in this area (`F-ORC-01` proves it is possible) | Medium | Capture baselines for both vitest projects before any change; report deltas, not absolutes |
| Risk | Receipt design is a decision, not a patch, and could expand scope | Medium | ADR-001 fixes the receipt contents before implementation; anything beyond it is out of scope |
| Risk | Tightening approval blocks a legitimate autonomous workflow | Medium | Advisory-only is the fallback; the operator decides which model applies |
| Dependency | `021` honest baselines | Blocks evidence issuance | Sequence after `021` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Authority
- **NFR-A01**: No mutable local file may be the sole authority for a promotion, ship or rollback.
- **NFR-A02**: The evaluator identity must come from a source the candidate cannot edit.

### Containment
- **NFR-C01**: Every write boundary must be contained, not only the target.
- **NFR-C02**: A path must be validated before any `mkdir`.

### Fail-closed
- **NFR-F01**: Non-finite and absent numeric fields must fail closed, never compare as zero.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Score with `NaN` or `Infinity`: fails closed (`F-008-01`).
- Absent delta or aggregate field: fails closed, not treated as zero.
- Text-less event stream: unscorable (`F-008-02`).
- Empty topic ID: rejected (it already is); `../`-bearing topic ID: also rejected (`F-019-02`).

### Error Scenarios
- Stale score from an earlier revision: rejected (`F-017-01`).
- Forged acceptance JSON with matching hashes: rejected against the receipt (`F-017-03`).
- Forged rollback hash pair: rejected (`F-017-04`).
- Candidate frontmatter naming a different evaluator: ignored in favour of the authority (`F-017-05`).
- External packet root supplied positionally: rejected before any `mkdir` (`F-019-01`).

### State Transitions
- Promotion interrupted mid-copy: the receipt records what was intended, so the state is diagnosable.
- Rollback without a recorded pre-promotion hash: refused rather than guessing (`F-008-03`).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | 13 findings across 10 files spanning three subsystems: deep-improvement (promote/rollback/score), deep-ai-council (persist/orchestrate), deep-alignment (remediate-hook) plus the autonomous benchmark yaml |
| Risk | 22/25 | Promotion copies bytes into canonical shipped targets, so a mistake overwrites shipped files; this child audits and rewrites its own promotion mechanism |
| Research | 10/20 | Root cause already isolated by the review per the calibration note; remaining work is confirm-before-build re-reads via T001, but the receipt and evaluator-authority design (ADR-001/ADR-002) is a genuine decision, not a pure patch |
| Multi-Agent | 8/15 | Single workstream, six original phases merged to three, one independent-verification pass (REQ-U04) targeted specifically at whether any promotion path still trusts a mutable local file |
| Coordination | 10/15 | Depends on `021` for honest baselines; independent of the ledger children (`022`-`025`); gates only the improvement lanes of the `014` cutover, not the ledger blockers |
| **Total** | **70/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A promotion test overwrites a shipped file | H | M | Fixture target trees only; containment across every write boundary |
| R-002 | Baselines are red and get read as regressions | M | M | Capture both project baselines first; report deltas |
| R-003 | Receipt design expands scope | M | M | ADR-001 fixes the receipt contents before implementation |
| R-004 | Tightened approval blocks a legitimate autonomous workflow | M | M | Advisory-only fallback; the operator chooses the model |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: A stale score cannot promote (Priority: P0)

**As a** operator promoting an improvement candidate, **I want** a score receipt that does not match this candidate and target to be rejected, **so that** an earlier revision's score cannot authorize a newer unscored candidate.

**Acceptance Criteria**:
1. Given a score receipt for a different candidate, When promotion runs, Then it is rejected naming the mismatch.
2. Given a score receipt for a different target, When promotion runs, Then it is rejected naming the mismatch.

### US-002: Council writes stay in the packet (Priority: P0)

**As a** operator running a council session, **I want** persistence to refuse a packet root and topic ID that can escape, **so that** a mistyped argument cannot write outside the packet.

**Acceptance Criteria**:
1. Given a caller-supplied external packet root, When persistence runs, Then it is rejected before any `mkdir`.
2. Given a topic ID containing `../`, When a path is built, Then it is rejected before any `mkdir`.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:open-questions -->
## 12. OPEN QUESTIONS

- What is the approval model for autonomous mode? Advisory-only is the safe fallback; a candidate-and-target-bound operator receipt preserves autonomy while making approval real. The autonomous workflow currently declares `approvals: none` and then invokes `--approve`, so either model is an improvement, but the choice is the operator's.
- Which evaluator identity source replaces candidate frontmatter? It must be something the candidate cannot edit. Record the chosen authority in ADR-002 before implementing.
- Does the acceptance receipt live beside the acceptance JSON or in a separate append-only log? Append-only is the point of the receipt, so a location the promotion flow cannot rewrite is preferred; decide before Phase 2.
<!-- /ANCHOR:open-questions -->
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Findings register**: `../016-whole-system-gate/review/findings-register.md`
- **Canonical registry**: `../016-whole-system-gate/review/deep-review-findings-registry.json`
- **Review verdict and calibration**: `../016-whole-system-gate/review/review-report.md`
<!-- /ANCHOR:related-docs -->
