---
title: "Decision Record: Bind Promotion, Rollback and Council Persistence to Authenticated Receipts and Authorized Roots"
description: "Decision record for 007-improvement-promotion-authority: the architectural rulings this remediation child depends on, with alternatives and consequences."
trigger_phrases:
  - "improvement promotion authority"
  - "promotion acceptance receipt binding"
  - "council persistence packet root"
  - "stale score authorizes promotion"
  - "deep loop 029 promotion"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/007-improvement-promotion-authority"
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Reconciled packet docs to the landed additive-dark state under 0d1827eef50"
    next_safe_action: "Pass the additive-dark acceptance review and independent adversarial verification"
    blockers:
      - "Additive-dark acceptance review must pass before promotion goes live (CHK-018)"
      - "Independent adversarial verification pending (CHK-005)"
    key_files:
      - "decision-record.md"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

# Decision Record: Bind Promotion, Rollback and Council Persistence to Authenticated Receipts and Authorized Roots

---

<!-- ANCHOR:adr-001 -->
## ADR-001: An authenticated append-only acceptance receipt binds every promotion

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Packet owner; operator selected advisory-only autonomous mode through the task's fail-closed constraint |

---

<!-- ANCHOR:adr-001-context -->
### Context

Eight P0 findings share one mechanism: mutable local JSON is treated as authority. Promotion never checks `score.candidate`, `score.target` or `score.inputHash` (`F-017-01`, confirmed with mitigation). Ship verifies only fields stored inside the same mutable acceptance JSON (`F-017-03`). Rollback accepts either of two hashes (`F-017-04`). Promotion copies bytes into canonical targets, so a mistake overwrites shipped files. The calibration matters: the actor is the operator or a stale local file, not a remote attacker, which makes this a robustness and cutover-readiness problem rather than an incident.

### Constraints

- The receipt must be append-only and must live somewhere the promotion flow cannot rewrite.
- It must bind candidate to target, so a cross-target or stale score cannot authorize.
- The approval model for autonomous mode is an operator decision.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: An authenticated append-only acceptance receipt binding all evidence digests, paths, target preimage, candidate snapshot, evaluator epoch and approval identity, verified by promotion, ship and rollback alike.

**How it works**: An operator-authorized issuer creates an HMAC-SHA256 approval receipt with exclusive creation. Promotion verifies its authentication and exact candidate, target-preimage, score-input, benchmark, repeatability, configuration, manifest and evaluator-authority bindings. Acceptance creates an independently authenticated receipt binding the immutable candidate snapshot, pre-accept target backup and acceptance state. Ship and both rollback paths verify that acceptance receipt rather than trusting caller-supplied JSON.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Authenticated append-only receipt** | One artifact binds every step; a stale or forged local file cannot authorize; rollback has a real anchor | A new artifact and a verification step in three flows | 9/10 |
| Add candidate/target checks to the existing acceptance JSON | Much smaller change | The acceptance JSON is the mutable file being trusted; adding checks to it does not fix who can edit it | 3/10 |
| Sign the acceptance JSON in place | No new artifact | A signature over a rewritable file still permits replacement with another validly signed older file | 5/10 |

**Why this one**: Append-only is what makes the receipt an anchor rather than another editable file, and binding candidate to target is what closes the stale-score path specifically.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A stale or cross-target score cannot authorize a promotion.
- Rollback has a recorded pre-promotion hash rather than a guess.
- Ship stops verifying a file against itself.

**What it costs**:
- A new artifact plus a verification step in three flows. Mitigation: the receipt contents are fixed before implementation so scope cannot drift.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A legitimate promotion is blocked by the binding | M | Rejections name the mismatched field; fixture-tree tests cover the legitimate paths |
| Receipt design expands into a general-purpose provenance system | M | ADR-001 fixes the field list; anything beyond it is out of scope |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Eight P0s share the mutable-file-as-authority mechanism |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed, including signing in place |
| 3 | **Sufficient?** | PASS | One receipt covers promotion, ship and rollback |
| 4 | **Fits Goal?** | PASS | Gates the improvement lanes of the cutover |
| 5 | **Open Horizons?** | PASS | A new lane binds to the same receipt |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `promote-candidate.cjs` and both `rollback-candidate.cjs` scripts.
- `promotion-receipts.cjs`, which authenticates receipts, rejects replacement and requires every decided authority field.

**Acceptance evidence**: `promotion receipt authority > authenticates the decided authority fields and evidence bindings`, `fails closed when a signed receipt is modified`, and `uses exclusive creation so an issued receipt cannot be replaced`; promotion/ship/rollback integration is exercised by `ships an accepted snapshot and rolls back to the pre-acceptance target`, `refuses a forged acceptance file with no receipt, even when the OR hash guard would pass`, and `refuses an acceptance file that drifted from its issued receipt`. The affected authority matrix passed on 2026-08-15; aggregate suite-content SHA-256 `0505321f555e3edab1a3145da4e5acce74cb4b022408b10c2f49867d1a1fa265`.

**How to roll back**: Revert the receipt-binding commits; the prior acceptance-JSON checks return. Record that `F-017-01`, `F-017-03` and `F-017-04` re-open.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Evaluator identity comes from an authority the candidate does not control

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Packet owner |

---

<!-- ANCHOR:adr-002-context -->
### Context

`F-017-05` records that the scorer derives the evaluator profile and `agentName` from candidate frontmatter and scans integration under that candidate-chosen name. The candidate therefore authors the rubric it is scored against, which makes the score a statement about the candidate's preferences rather than about its quality.

### Constraints

- The authority must be something the candidate cannot edit as part of proposing itself.
- Existing candidates carry frontmatter that will now be ignored for this purpose.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Evaluator profile and `agentName` come from an authority outside the candidate; candidate frontmatter is ignored for evaluator selection.

**How it works**: The target manifest is the authority. Each target entry must supply a non-dynamic `profileId`, `evaluatorAgentName`, `evaluatorEpoch`, and optionally `evaluatorSourcePath` (otherwise the canonical target). Missing authority fails closed. Candidate frontmatter cannot provide a fallback, and the scorer records the resolved identity and source hash for receipt binding.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Authority-supplied evaluator identity** | The candidate cannot choose its own rubric; the receipt records which evaluator scored it | Existing candidate frontmatter is ignored for this purpose | 9/10 |
| Validate the candidate-supplied evaluator against an allowlist | Smaller change | The candidate still chooses among allowed rubrics, which is the same problem with fewer options | 4/10 |
| Score under every evaluator and take the minimum | Removes the choice entirely | Expensive and produces a score nobody asked for | 3/10 |

**Why this one**: Removing the choice is the fix; constraining it leaves the candidate selecting the terms of its own evaluation.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A score means the candidate met an externally chosen bar.
- The receipt records which evaluator scored the candidate.

**What it costs**:
- Candidate frontmatter is ignored for evaluator selection. Mitigation: documented, and the frontmatter remains meaningful for other purposes.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The authority source is itself editable by the candidate flow | H | The chosen authority is recorded and reviewed specifically for this property |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A candidate authoring its own rubric invalidates the score |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed |
| 3 | **Sufficient?** | PASS | Removing the choice closes the finding |
| 4 | **Fits Goal?** | PASS | Promotion authority depends on the score meaning something |
| 5 | **Open Horizons?** | PASS | New evaluators are registered with the authority |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `agent-improvement/score-candidate.cjs` evaluator resolution.
- The acceptance receipt evaluator-epoch field.

**Acceptance evidence**: `ignores candidate frontmatter when selecting evaluator identity and rubric source` and `fails closed when no evaluator authority manifest is supplied`; both passed in the affected authority matrix on 2026-08-15, suite-content SHA-256 `0505321f555e3edab1a3145da4e5acce74cb4b022408b10c2f49867d1a1fa265`.

**How to roll back**: Revert the resolution commit; candidate frontmatter is honoured again. Record that `F-017-05` re-opens.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Every write boundary is contained, and council persistence is confined to an authorized root

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Packet owner |

---

<!-- ANCHOR:adr-003-context -->
### Context

`F-017-02` records that only the target write boundary is contained: candidate, archive, acceptance, event-log and state paths are not. `F-019-01` records that council persistence resolves its packet root from a caller-chosen positional argument and only checks that `root/ai-council` is inside that same chosen root, which is trivially true. `F-019-02` records that topic IDs are inserted into paths after a trim-and-non-empty check, so `../` escapes. `F-019-03` records that `--memory-save-payload-out` resolves and overwrites any path.

### Constraints

- Validation must happen before any `mkdir`, or a rejected path has already created directories.
- Legitimate lanes write to several roots, so containment must enumerate them rather than assume one.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Every write boundary is contained against an enumerated authorized root set, and every caller-supplied path component is validated before any directory is created.

**How it works**: Promotion and rollback validate candidate, target, archive, approval, acceptance, event-log, state and backup boundaries against enumerated roots before any write. Council persistence resolves the authority roots from `DEEP_AI_COUNCIL_AUTHORIZED_SPEC_ROOTS` (defaulting to repository `specs` and `.opencode/specs`), requires the packet root to be inside one of them, rejects symlinks, validates strict topic IDs, and confines payload output to the resulting council root before any `mkdir`.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Enumerated authorized roots, validate before `mkdir`** | Every boundary protected; a rejected path creates nothing | Each script must declare its roots | 9/10 |
| Contain only the target and document the rest | No work | This is the status quo that produced four findings | 1/10 |
| Sandbox the whole process | Strongest containment | Much wider change than this child; affects unrelated lanes | 5/10 |

**Why this one**: Declaring roots per script is the smallest change that covers every boundary, and validating before `mkdir` is what makes a rejection leave no trace.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- A mistyped root or topic ID cannot write outside the packet.
- Candidate, archive, acceptance, event-log and state paths get the same protection as the target.

**What it costs**:
- Each script declares its authorized roots. Mitigation: the enumeration is short and reviewable.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A legitimate write path is omitted from the root set | M | Per-boundary containment tests; a blocked legitimate write is investigated as a finding |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Four findings describe uncontained or caller-redirectable writes |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed including process sandboxing |
| 3 | **Sufficient?** | PASS | Enumerated roots plus pre-`mkdir` validation closes all four |
| 4 | **Fits Goal?** | PASS | Promotion copies bytes into canonical targets; containment is the safety net |
| 5 | **Open Horizons?** | PASS | A new script declares its roots |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `promote-candidate.cjs` containment.
- `persist-artifacts.cjs` root resolution and payload output.
- `orchestrate-{topic,session}.cjs` topic-ID validation.

**Acceptance evidence**: `rejects an uncontained %s before creating output` covers candidate, archive, acceptance, event-log and state boundaries; `refuses a caller-selected packet root outside configured authority before mkdir`, `rejects a payload output outside the authorized council root`, and the unsafe-topic matrix verify council containment. The authority matrix and council project passed on 2026-08-15; suite-content SHA-256 `0505321f555e3edab1a3145da4e5acce74cb4b022408b10c2f49867d1a1fa265`.

**How to roll back**: Revert the containment commits per script. Record that `F-017-02` and the three `F-019-*` findings re-open.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

## ADR-004: Autonomous improvement remains advisory-only

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Decider** | Operator task constraint: "no dark->live authority flip" |

The autonomous benchmark may produce recommendations and evidence, but it cannot invoke canonical promotion. Promotion remains a separate operator-authorized session using an authenticated, candidate-and-target-bound approval receipt. This is not inferred from a default: it follows the explicit additive-dark constraint in the completion task. `autonomous promotion authority > is advisory-only and cannot invoke a canonical promotion command` passed in the affected authority matrix; suite-content SHA-256 `0505321f555e3edab1a3145da4e5acce74cb4b022408b10c2f49867d1a1fa265`.
