---
title: "Feature Specification: Close the Readiness-Gate, Rollback-Switch and Mode-Contract Conformance Boundaries"
description: "The gates that authorize a cutover, and the conformance harness that certifies a mode is ready, both accept unbound evidence: readiness gates never compare the sealed digest set against the certificate claims, rollback switches build certificates from returned fields without comparing them to what was prepared, and conformance accepts a reducer that ignores the fixture event. Legacy clone drift between research/review and the newer modes means the durable fix is one shared strict validator."
trigger_phrases:
  - "mode gate contract binding"
  - "readiness gate sealed digest binding"
  - "rollback switch certificate binding"
  - "conformance event unbound reducer"
  - "deep loop 027 gates"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/027-mode-gate-and-contract-binding"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the remediation child package from the WS1 phase-tree proposal"
    next_safe_action: "Run T001 against the 9 scoped findings before any edit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    completion_pct: 0
    open_questions:
      - "Does the shared strict validator live in mode-contracts or in a new module the four gate families import?"
      - "Which of the model/skill gates is the reference implementation for version-binding comparison?"
    answered_questions:
      - "The durable fix is a shared strict validator, not four local patches; the legacy clone drift is the reason"
      - "Sequence before `032`, whose P2 riders touch `deep-research-rollback-gate/mode-gate.ts`"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

# Feature Specification: Close the Readiness-Gate, Rollback-Switch and Mode-Contract Conformance Boundaries

> Phase adjacency under the `036-deep-loop-innovation` parent (grouping order, not a runtime dependency): predecessor `026-alignment-coverage-integrity`; successor `028-fanout-dispatch-integrity`.

> **Scaffold dependency.** This child is scaffolded under `036-deep-loop-innovation/` as a flat
> sibling of phases 001-020. That nesting is conditional on child `021`'s hashed-child-manifest fix
> (`F-029-03`) landing first: without a bounded child manifest, every child added here widens the
> parent's unbounded recursive-validation glob. `021` is the first scaffold in the tree.

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

These are the gates `014` reads to decide a flip, and they accept unbound evidence. Standalone readiness gates verify sealed bindings and certificates on two independent paths and never compare the sealed digest set with the certificate's artifact claims. Rollback switches validate a request, then check only `authorization.verdict` and build a certificate from the returned fields without comparing mode, epoch, evidence digest or request digest against what was prepared. Conformance accepts a reducer that ignores the fixture event and a constant certificate carrying unrelated references. Because research and review are legacy clones of the newer modes, the durable fix is one shared strict validator rather than four local patches.

**Key Decisions**: One shared strict gate validator adopted by all four gate families, replacing legacy clone drift (ADR-001); malformed input returns a deterministic blocked disposition rather than a rejected promise (ADR-002)

**Critical Dependencies**: `024` for the fence and proof primitives; `025` for certificate binding. Sequence before `032`.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent** | `system-deep-loop/036-deep-loop-innovation` |
| **Wave** | W4 |
| **Findings in scope** | 9 (2 P0 / 7 P1 / 0 P2), 0 carrying a review `CONFIRMED*` mark |
| **Blocks `014` cutover** | Yes — these are the gates `014` reads to decide a flip |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Standalone readiness gates verify sealed bindings and certificates on two independent paths and never compare the sealed digest set with the certificate's `artifactClaims`/`artifactSetDigest` (`F-013-01`). Rollback switches validate a request, then check only `authorization.verdict` and build a certificate from the returned fields without comparing mode, epoch, evidence digest or request digest against what was prepared, in deep-research, deep-review, deep-ai-council and deep-alignment alike (`F-013-02`). Rollback-window eligibility counts executions filtered only by token shape and text, so two fabricated execution IDs with syntactically valid certificate digests satisfy the threshold (`F-005-02`). Resume classifies a plain caller-supplied object as `result_recorded` with authority `ledger` (`F-004-04`). Conformance accepts a reducer that ignores the fixture event entirely, with no `appliedEventId` check (`F-013-04`), and a constant certificate carrying unrelated non-empty references (`F-013-05`). Closure context freezes its outer object but stores identity-bearing inputs by reference, so a caller can redirect budget scope after validation (`F-013-03`). Deep-research and deep-review gates reject the promise on `null` input instead of returning a blocked disposition (`F-013-06`). Common and agent gates validate version bindings with `isToken` and copy them into the readiness certificate, where model and skill compare against installed constants, so common and agent can issue internally consistent certificates carrying stale version labels (`F-024-02`).

### Purpose
Make every cutover-authorizing gate compare the evidence it was given against the evidence it prepared, so a permissive gate cannot make a downstream cutover certificate meaningless.

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
- Certificate issuance semantics — that is `025`, whose binding work this child consumes.
- The append boundary and fencing — that is `024`.
- The P2 riders on `deep-research-rollback-gate/mode-gate.ts` (`F-031-01`, `F-031-02`) — those are `032`, which adopts the validator this child introduces.
- Fan-out dispatch (`028`).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One shared strict gate validator, adopted by the research, review, common and agent gate families.
- Readiness gates compare the sealed digest set against the certificate's `artifactClaims` and `artifactSetDigest`.
- Rollback switches compare mode, epoch, evidence digest and request digest against what was prepared before building a certificate.
- Rollback-window eligibility counts only authenticated executions, not token-shaped text.
- Resume refuses to classify a caller-supplied object as ledger-authoritative.
- Conformance rejects an event-unbound reducer (missing `appliedEventId`) and an evidence-unbound certificate.
- Closure context stores identity-bearing inputs by value, so budget scope cannot be redirected after validation.
- Malformed or `null` gate input returns a deterministic blocked disposition rather than a rejected promise.
- Common and agent gates compare version bindings against installed constants, matching the model and skill reference implementation.

### Out of Scope
- Certificate content binding (`025`).
- Fencing and the append boundary (`024`).
- P2 mode-gate riders (`032`).

### Findings in Scope (9)

| ID | Sev | Review mark | Location (at review time) | Defect |
|----|-----|-------------|---------------------------|--------|
| `F-013-01` | P0 | unverified | `runtime/lib/deep-research-rollback-gate/mode-gate.ts:389` | Standalone readiness gates do not bind sealed artifacts to the verified certificate |
| `F-013-02` | P0 | unverified | `runtime/lib/deep-research-rollback-gate/rollback-switch.ts:263` | Standalone rollback switches trust an unbound allow decision |
| `F-013-03` | P1 | unverified | `runtime/lib/cross-mode-closures/context.ts:163` | Closure context is only shallowly immutable |
| `F-013-04` | P1 | unverified | `runtime/lib/mode-contracts/conformance.ts:739` | Reducer conformance accepts an event-unbound reducer |
| `F-013-05` | P1 | unverified | `runtime/lib/mode-contracts/conformance.ts:855` | Certificate conformance accepts evidence-unbound certificates |
| `F-013-06` | P1 | unverified | `runtime/lib/deep-research-rollback-gate/mode-gate.ts:683` | Deep-research and deep-review gates throw on malformed top-level input |
| `F-024-02` | P1 | unverified | `runtime/lib/deep-improvement-common-rollback-gate/mode-gate.ts:320` | Common and Agent Improvement mode gates trust caller-supplied version bindings |
| `F-005-02` | P1 | unverified | `runtime/lib/deep-review-rollback-gate/mode-gate.ts:605` | Rollback-window success count trusts unauthenticated execution claims |
| `F-004-04` | P1 | unverified | `runtime/lib/dispatch-receipts/resume-projection.ts:203` | Resume treats a caller assertion as ledger-authoritative result evidence |

Every ID above is assigned to this child and to no other. Locations are the anchors recorded during the review run; T001 re-resolves each one at HEAD.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/mode-gate.ts` | Modify | Bind sealed digests to certificate claims; blocked disposition on malformed input (`F-013-01`, `F-013-06`) |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/rollback-switch.ts` | Modify | Compare mode, epoch, evidence digest and request digest against the prepared request (`F-013-02`) |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-review-rollback-gate/mode-gate.ts` | Modify | Authenticated rollback-window counting (`F-005-02`); adopt the shared validator |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-rollback-gate/mode-gate.ts` | Modify | Compare version bindings against installed constants (`F-024-02`) |
| `.opencode/skills/system-deep-loop/runtime/lib/agent-improvement-rollback-gate/mode-gate.ts` | Modify | Same version-binding comparison as common |
| `.opencode/skills/system-deep-loop/runtime/lib/mode-contracts/conformance.ts` | Modify | Reject event-unbound reducers and evidence-unbound certificates (`F-013-04`, `F-013-05`) |
| `.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/context.ts` | Modify | Store identity-bearing inputs by value (`F-013-03`) |
| `.opencode/skills/system-deep-loop/runtime/lib/dispatch-receipts/resume-projection.ts` | Modify | Refuse ledger authority for a caller-supplied object (`F-004-04`) |
| `council and alignment rollback switches` | Modify | Same prepared-request comparison as deep-research |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-research-rollback-gate.vitest.ts` | Modify | Unbound-evidence and blocked-disposition tests |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-rollback-gate.vitest.ts` | Modify | Fabricated-execution-row test |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/deep-improvement-common-rollback-gate.vitest.ts` | Modify | Stale-version-token rejection test |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts` | Modify | Stale-version-token rejection test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A readiness gate compares the sealed digest set against the certificate's `artifactClaims` and `artifactSetDigest`. | A certificate whose claims do not match the sealed set is rejected, with the mismatch named. |
| REQ-002 | A rollback switch compares mode, epoch, evidence digest and request digest against what was prepared before building a certificate. | A mismatched allow decision is rejected before a fence is acquired. |
| REQ-003 | Malformed or `null` gate input returns a deterministic blocked disposition rather than a rejected promise. | A `null` input to each gate returns a blocked result with a stable reason code. |
| REQ-004 | Conformance rejects a reducer that ignores the fixture event and a certificate carrying unrelated references. | An event-ignoring no-op reducer fails its accept fixture; a constant certificate with unrelated references fails. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Rollback-window eligibility counts only authenticated executions. | Two fabricated execution IDs with syntactically valid certificate digests earn no window credit. |
| REQ-006 | Resume refuses to classify a caller-supplied object as `result_recorded` with authority `ledger`. | A plain object supplied by the caller is not treated as ledger-authoritative. |
| REQ-007 | Closure context stores identity-bearing inputs by value. | A caller mutating its input object after validation cannot redirect budget scope. |
| REQ-008 | Common and agent gates compare version bindings against installed constants. | A stale-but-token-shaped version binding is rejected, matching the model and skill gates. |
| REQ-009 | One shared strict validator serves all four gate families. | No gate family carries a private copy of the validation logic; a grep for duplicated validation shapes returns none. |

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

- **SC-001**: All 9 scoped findings closed as fixed, `REFUTED`, or `ALREADY-FIXED`.
- **SC-002**: A mismatched allow decision is rejected before a fence is acquired.
- **SC-003**: An event-ignoring no-op reducer fails its accept fixture.
- **SC-004**: A constant certificate with unrelated references fails conformance.
- **SC-005**: Fabricated execution rows earn no rollback-window credit.
- **SC-006**: A stale-but-valid version token is rejected by common and agent, matching the model and skill reference implementation.
- **SC-007**: `npm run typecheck && npm test` in `runtime` green, reported as a delta against the `021` baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Four gate families adopting one validator is a wide refactor under `014` | High | Adopt one family at a time, each an independent commit, with the model/skill reference behavior as the target |
| Risk | Tightening a gate blocks a legitimate flip | Medium | Every rejection must name the mismatched field so a legitimate flip can be diagnosed rather than guessed at |
| Risk | `032` P2 riders touch the same mode-gate file | Medium | This child introduces the validator; `032` adopts it. Ordering recorded in `MANIFEST.md` |
| Dependency | `024` fence and proof primitives | Blocks REQ-002 | Sequence after `024` |
| Dependency | `025` certificate binding | Blocks REQ-001 | Sequence after `025`; the gate compares what `025` makes comparable |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: Every gate outcome must be a value, never a rejected promise. Blocked dispositions carry a stable reason code.

### Binding
- **NFR-B01**: A gate must compare what it was given against what it prepared, not against a re-derivation of the input.

### Uniformity
- **NFR-U01**: The four gate families must share one validator, so legacy clone drift cannot recur.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- `null` input: blocked disposition with a stable reason code (`F-013-06`).
- Empty artifact claim set: rejected rather than vacuously matched.
- Zero eligible executions: window not satisfied, rather than trivially satisfied.

### Error Scenarios
- Certificate claims disjoint from the sealed set: rejected with the mismatch named (`F-013-01`).
- Allow decision for a different mode or epoch: rejected before a fence is acquired (`F-013-02`).
- Two fabricated execution IDs: no window credit (`F-005-02`).
- Stale-but-token-shaped version binding: rejected (`F-024-02`).

### State Transitions
- Caller mutates its input after validation: budget scope cannot move (`F-013-03`).
- Caller supplies a result object at resume: not ledger-authoritative (`F-004-04`).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | 9 findings across 4 gate families (research, review, common, agent), a shared conformance module, a closure-context module, a resume-projection module, unnamed council/alignment rollback switches, and 4 unit-test files |
| Risk | 22/25 | Edits the production `runtime/lib/*-rollback-gate` and `mode-contracts` surfaces that `014` reads to authorize every mode flip; a wide refactor touching four families at once |
| Research | 12/20 | Root cause (clone drift) already named by the review; open questions remain on the validator's home module and which reference gate wins the version-binding comparison |
| Multi-Agent | 8/15 | Single workstream, five sequential phases with two parallelizable adoption tasks (T011/T012), one independent-verification pass (REQ-U04) |
| Coordination | 12/15 | Depends on `024` (fence/proof primitives) and `025` (certificate binding); sequenced before `032`, whose P2 riders adopt this child's validator |
| **Total** | **74/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The shared-validator refactor destabilises a gate under `014` | H | M | One family per commit, model/skill behavior as the reference target |
| R-002 | A tightened gate blocks a legitimate flip and the cause is opaque | M | M | Every rejection names the mismatched field |
| R-003 | File collision with `032` on the research mode gate | M | M | This child introduces the validator; `032` adopts it; ordering in `MANIFEST.md` |
| R-004 | `025` binding arrives late, so the gate has nothing to compare | M | M | Sequence after `025`; REQ-001 is the only requirement that depends on it |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: A gate compares what it prepared (Priority: P0)

**As a** operator flipping authority for one mode, **I want** the rollback switch to compare the allow decision against the request it prepared, **so that** a decision for a different mode or epoch cannot authorize this flip.

**Acceptance Criteria**:
1. Given an allow decision whose mode or epoch differs from the prepared request, When the rollback switch runs, Then it rejects before acquiring a fence.

### US-002: A gate never throws at the caller (Priority: P0)

**As a** engineer wiring a gate into an automated workflow, **I want** malformed input to return a blocked disposition, **so that** a workflow can branch on the result instead of catching an exception.

**Acceptance Criteria**:
1. Given a `null` input, When any mode gate runs, Then it returns a blocked disposition with a stable reason code rather than rejecting.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:open-questions -->
## 12. OPEN QUESTIONS

- Does the shared strict validator live inside `mode-contracts` or in a new module the four gate families import? `mode-contracts` already owns conformance, which argues for placing it there; a separate module keeps conformance from becoming a grab bag. Decide before Phase 2.
- Which of the model and skill gates is the reference implementation for version-binding comparison? Both are described as the existing green reference; pick one and record why, so common and agent converge on a single behavior rather than two.
- Should the blocked-disposition reason codes be shared across gate families, or per family? Shared codes make workflow branching uniform; per-family codes carry more context. Recommended: shared codes with a per-family detail field.
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
