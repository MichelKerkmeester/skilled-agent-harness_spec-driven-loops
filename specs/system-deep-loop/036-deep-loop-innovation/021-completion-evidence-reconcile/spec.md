---
title: "Feature Specification: Reconcile Migration-Program Completion Claims Against the Current Suites"
description: "Checked completion items in the 013 migration program cite counts and line anchors that reproduce from no source, and the two acceptance mechanisms that should have caught it — the review scope manifest and recursive strict validation — are themselves unbounded. This child reopens every unreproducible evidence claim, re-evidences it against the suites as they exist at HEAD or strikes it, and repairs the acceptance boundary so the same drift cannot recur."
trigger_phrases:
  - "completion evidence reconcile"
  - "blocker 4 evidence drift"
  - "migration program completion claims"
  - "recursive validation child manifest"
  - "deep loop 021 reconcile"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/021-completion-evidence-reconcile"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the remediation child package from the WS1 phase-tree proposal"
    next_safe_action: "Run T001 against the 9 scoped findings before any checklist edit"
    blockers:
      - "OPERATOR-DECISION OD-1: relocate the 016 pre-cutover validation artifacts to their own packet, or formally re-scope 016"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    completion_pct: 0
    open_questions:
      - "Does the 016 disposition relocate the borrowed review/ and alignment/ artifacts, or re-scope 016 around them?"
      - "Does the bounded child manifest live in validate.sh or in the parent graph-metadata.json?"
    answered_questions:
      - "Children 021-033 nest as flat siblings under 036, conditional on this child landing the hashed-child-manifest fix first"
      - "Phase 015 is reopened and stated honestly here; it is not remediated by this tree"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

# Feature Specification: Reconcile Migration-Program Completion Claims Against the Current Suites

> Phase adjacency under the `036-deep-loop-innovation` parent (grouping order, not a runtime dependency): predecessor `020-sk-code-opencode-alignment`; successor `022-shadow-parity-independent-derivation`.

> **Scaffold dependency.** This child is scaffolded under `036-deep-loop-innovation/` as a flat
> sibling of phases 001-020. That nesting is conditional on child `021`'s hashed-child-manifest fix
> (`F-029-03`) landing first: without a bounded child manifest, every child added here widens the
> parent's unbounded recursive-validation glob. `021` is the first scaffold in the tree.

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Blocker 4 of the four named cutover blockers is that the migration program's completion evidence does not reconcile with the suites it cites. Checked P0/P1 items point at run counts and line anchors that reproduce from nothing, so "Complete" is not a load-bearing signal anywhere downstream. This child reopens each unreproducible claim, re-evidences or strikes it, and then repairs the two acceptance mechanisms that let the drift through: a review scope manifest that mixed ignored local state with an incomplete tracked set, and recursive strict validation that follows an unfrozen live child glob.

**Key Decisions**: Evidence citations move to test name + suite-content digest + candidate SHA (ADR-001); recursive validation acceptance is bounded by a hashed child manifest (ADR-002); the 016 pre-cutover artifact disposition is an OPERATOR-DECISION reserved in `decision-record.md`

**Critical Dependencies**: None. This child is the root of the remediation tree and every other child depends on it.
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
| **Wave** | W1 (first; gates every other child in this tree) |
| **Findings in scope** | 9 (1 P0 / 8 P1 / 0 P2), 5 carrying a review `CONFIRMED*` mark |
| **Blocks `014` cutover** | Yes — Blocker 4 of the four named cutover blockers |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Checked completion items across the 013 migration program cite evidence that cannot be reproduced. `F-025-03` is CONFIRMED: a council shadow-parity checklist contradicts its own implementation summary. `F-029-02` is CONFIRMED: phase 015 has no implementation summary, 0 of 29 checklist items checked, and `planned` graph metadata, while 016 makes 015 evidence a blocking prerequisite. `F-029-01` is CONFIRMED-WITH-CORRECTION: the review scope manifest included ignored and untracked entries while omitting a tracked frozen benchmark baseline, and the leaf that reported it got the mechanism right and the count wrong (33 omissions, not the 48 it claimed). `F-029-03` is CONFIRMED: recursive strict validation globs every numbered child with no phase-manifest boundary, so the parent gate goes redder with every child added — including the twelve this tree adds. The result is that no downstream claim built on a program "Complete" marker is trustworthy, and `014` cannot read `016` as a gate.

### Purpose
Make every completion claim in the migration program reproducible from a named test, a suite-content digest, and a candidate SHA, and bound the two acceptance mechanisms so evidence drift is caught at the gate rather than at review.

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
- Fixing the five pre-existing `deep-alignment` command-contract test failures that `F-ORC-01` records — this child captures them as a RED baseline; `031` triages them.
- Executing phase 015. This child reopens 015 and states its status honestly; retirement work stays in 015.
- Re-running the whole-system gate. That is 016 execution, which this child explicitly re-scopes or relocates rather than performs.
- Remediating any finding assigned to another child, even where it touches a file listed here.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every checked P0/P1 item in the 013 migration program whose evidence cites a count or line anchor that reproduces from no source: reopen, re-evidence against HEAD, or strike with a rationale.
- A citation format change across the reopened items: test name + suite-content digest + candidate SHA, never a bare run count and never a raw line number.
- The review scope manifest (`goal-file-manifest.txt`): exclude ignored and untracked entries, include the tracked frozen benchmark baseline.
- A bounded child-manifest boundary for `validate.sh --recursive`, so the acceptance set is a frozen, hashed list rather than a live glob.
- Reopening phase `015-legacy-writer-retirement` status honestly (no implementation summary, 0/29 checklist, `planned` metadata) and recording that it gates `016`.
- A rollout validator that rejects any `fix` entry in `command-injection-rollout.json` lacking a capture manifest, fallback hash, comparator runs, and a baseline-divergence result.
- The `016` pre-cutover artifact disposition: relocate the borrowed `review/` and `alignment/` trees to their own packet, or formally re-scope `016` (OPERATOR-DECISION OD-1).
- Enforcing the `F-022-01` re-open trigger recorded in the WS1 disposition bucket: if any packet claims real-run migration-gate evidence before `014` executes, `F-022-01` reopens as a traceability defect.

### Out of Scope
- Code changes in `runtime/lib/**` — this child touches acceptance mechanisms and documentation evidence, not the ledger spine.
- The style-conformance census described in `alignment/STOPPED-AFTER-SAMPLE.md`; it is recommended as a separate top-level packet.
- Any change to the 166-finding register itself. The register is the input, not a work surface.

### Findings in Scope (9)

| ID | Sev | Review mark | Location (at review time) | Defect |
|----|-----|-------------|---------------------------|--------|
| `F-025-01` | P1 | unverified | `specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/005-resume-adapter/checklist.md:60` | Deep Review resume checklist certifies scenarios absent from its cited suite |
| `F-025-02` | P1 | unverified | `specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/005-resume-adapter/checklist.md:58` | Council resume checklist overstates coverage behind obsolete 6/6 evidence |
| `F-025-03` | P1 | CONFIRMED | `specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/006-shadow-parity/checklist.md:44` | Council shadow-parity checklist contradicts its own implementation evidence |
| `F-025-04` | P1 | unverified | `specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/004-certificates-and-receipts/checklist.md:67` | Deep Research certificate evidence uses stale counts and displaced line anchors |
| `F-029-01` | P1 | CONFIRMED-WITH-CORRECTION | `specs/system-deep-loop/036-deep-loop-innovation/016-whole-system-gate/goal-file-manifest.txt:1075` | Review manifest mixes ignored local state with an incomplete tracked evidence set |
| `F-029-02` | P0 | CONFIRMED | `specs/system-deep-loop/036-deep-loop-innovation/015-legacy-writer-retirement/checklist.md:42` | Mandatory legacy-writer-retirement evidence does not exist |
| `F-029-03` | P1 | CONFIRMED | `skills/system-spec-kit/scripts/spec/validate.sh:1039` | Recursive strict validation follows an unfrozen live child set |
| `F-ORC-01` | P1 | CONFIRMED | `deep-alignment/scripts/tests/:0` | deep-alignment script test suite baseline is RED (5 pre-existing failures) |
| `F-035-01` | P1 | unverified | `shared/rollout/command-injection-rollout.json:2` | Four commands are promoted before the required evidence mechanism exists |

**Accountability note, carried verbatim from the WS1 proposal:** `F-025-03` and Blocker 4 are defects in this program's own completion claim. The session that landed that column also reconciled its parent to Complete. This child is the program auditing itself, so the independent-verification requirement (REQ-U04) is not optional here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/004-certificates-and-receipts/checklist.md` | Modify | Reopen or re-evidence the certificate/receipt completion claims (`F-025-04`) |
| `.opencode/specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/005-resume-adapter/checklist.md` | Modify | Reopen scenarios certified but absent from the cited suite (`F-025-01`) |
| `.opencode/specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/005-resume-adapter/checklist.md` | Modify | Replace the obsolete 6/6 evidence string (`F-025-02`) |
| `.opencode/specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/006-shadow-parity/checklist.md` | Modify | Resolve the contradiction against its own implementation summary (`F-025-03`, CONFIRMED) |
| `.opencode/specs/system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/006-shadow-parity/implementation-summary.md` | Modify | Reconcile the summary with the corrected checklist |
| `.opencode/specs/system-deep-loop/036-deep-loop-innovation/016-whole-system-gate/goal-file-manifest.txt` | Modify | Bound the manifest: drop ignored/untracked, add the tracked frozen benchmark baseline (`F-029-01`) |
| `.opencode/specs/system-deep-loop/036-deep-loop-innovation/016-whole-system-gate/PRE-014-VALIDATION-RUN.md` | Modify | Record the OD-1 disposition and cross-reference the WS1 disposition bucket |
| `.opencode/specs/system-deep-loop/036-deep-loop-innovation/015-legacy-writer-retirement/{checklist.md,tasks.md,graph-metadata.json}` | Modify | State 015 status honestly and record that it gates 016 (`F-029-02`, CONFIRMED) |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Modify | Bound the recursive child glob with a hashed phase manifest (`F-029-03`, CONFIRMED) |
| `.opencode/skills/system-deep-loop/shared/rollout/command-injection-rollout.json` | Modify | Reopen the four promoted `fix` entries lacking their evidence mechanism (`F-035-01`) |
| `.opencode/skills/system-deep-loop/shared/rollout/promotion-rule.md` | Modify | State the evidence a `fix` promotion requires, matching the new validator |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every reopened completion item cites a test **name**, a suite-content digest, and a candidate SHA. No reinstated `[x]` cites a bare run count or a raw line number. | Grep the four reopened checklists for `\d+/\d+ passing` and for bare `:\d+` evidence anchors: zero hits. Every `[x]` line carries all three citation components. |
| REQ-002 | Recursive strict validation accepts a **bounded, hashed child manifest** rather than a live numbered-child glob. | `validate.sh --recursive --strict` on the 036 parent reports the manifest hash it validated against; adding an unlisted child folder makes it fail rather than silently widen. |
| REQ-003 | Phase `015-legacy-writer-retirement` status is stated honestly and its gating relationship to `016` is recorded. | `015/graph-metadata.json` status and `015/checklist.md` progress agree with reality (0/29 at time of writing); `016` docs name 015 as an unmet prerequisite. |
| REQ-004 | The review scope manifest contains only tracked, in-scope files and includes the tracked frozen benchmark baseline. | Every manifest entry resolves to a tracked path (`git ls-files` membership); the frozen benchmark baseline appears; ignored and untracked entries are absent. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | A rollout validator rejects any `fix` entry lacking a capture manifest, a fallback hash, comparator runs, and a baseline-divergence result. | The validator run over `command-injection-rollout.json` fails on a synthetic `fix` entry missing any one of the four, and passes only on complete entries. |
| REQ-006 | The `F-ORC-01` RED baseline is captured as a delta anchor, not fixed here. | Recorded run of `node --test` over `deep-alignment/scripts/tests/*.test.cjs` with its discovered/pass/fail/skip counts and exit code, plus a note assigning the failures to `031`. |
| REQ-007 | The `016` pre-cutover artifact disposition is recorded (relocate or re-scope) with a rationale. | `PRE-014-VALIDATION-RUN.md` states the chosen disposition; `decision-record.md` ADR records it once OD-1 is answered. |
| REQ-008 | The `F-022-01` re-open trigger is enforceable from this child. | A documented check: if any packet claims real-run migration-gate evidence before `014` executes, `F-022-01` reopens. Recorded in this child and cross-referenced from the disposition bucket. |

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

- **SC-001**: Every one of the 9 scoped findings is closed as fixed, `REFUTED` with a rationale, or `ALREADY-FIXED` with a commit citation.
- **SC-002**: No completion claim anywhere in the reopened set cites a number that cannot be reproduced by running the named suite at the named SHA.
- **SC-003**: `validate.sh --recursive --strict` on `036-deep-loop-innovation` is green against a bounded, hashed child manifest that includes children 021-032.
- **SC-004**: Adding a child folder that is absent from the manifest makes the recursive gate fail, proving the boundary is real.
- **SC-005**: The `F-ORC-01` RED baseline (`deep-alignment` script suite) is recorded as a delta anchor and explicitly assigned to `031`.
- **SC-006**: `015` status is honest and its gating relationship to `016` is written down.
- **SC-007**: The `016` artifact disposition is recorded, so a future reader cannot mistake the pre-cutover validation run for the gate `014` waits on.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | This child audits the program that produced it; a self-authored gate is not independent evidence | High | REQ-U04 independent adversarial pass by an actor other than the builder, run against the reopened evidence set specifically |
| Risk | Reopening checklist items reverts parent packets from Complete to In Progress and may cascade | Medium | Reconcile parent rollups in the same change; never leave a child reopened while its parent still claims Complete |
| Risk | `031` Lane B legitimately reduces discovered test counts, invalidating citations issued here | High | Cite suite-content digests that survive de-duplication, or re-reconcile after `031` lands. The 021 <-> 031 sequencing rule in `MANIFEST.md` is binding. |
| Risk | Bounding `validate.sh` changes a shared spec-kit script used by every packet in the repo | High | Default to current behavior when no manifest is present; opt in per parent. Run the whole-repo recursive validation before and after and report the delta. |
| Dependency | OPERATOR-DECISION OD-1 (relocate vs re-scope 016) | Blocks REQ-007 only | The rest of the child proceeds; OD-1 gates only the disposition record |
| Dependency | The four suite runners (`runtime` vitest, alignment `node --test`, council vitest, improvement vitest) | Blocks all baselines | All four confirmed present as files; capture baselines first, before any edit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: Evidence citations must be reproducible by a second party from the doc alone: suite path, test name, digest, SHA.
- **NFR-D02**: The child manifest hash must be stable across machines (no absolute paths, no locale-dependent sort).

### Compatibility
- **NFR-C01**: `validate.sh` without a manifest keeps its current behavior for every other packet in the repo.
- **NFR-C02**: No spec-folder schema change; `description.json` and `graph-metadata.json` stay generator-owned.

### Honesty
- **NFR-H01**: A reopened item may not be re-closed in the same commit that reopens it unless the re-evidence run is cited in that commit.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- A cited suite no longer exists: strike the claim, record the deletion commit, do not invent a replacement.
- A cited test was renamed: `MOVED`, cite the new name and the rename commit.
- A suite exists but is RED (the `F-ORC-01` case): record the RED baseline; do not mark the dependent item `[x]`.

### Error Scenarios
- The child manifest hash mismatches: the recursive gate must FAIL loudly, never warn-and-continue.
- A manifest entry names a folder that does not exist: hard failure, not a skip.
- `git ls-files` unavailable (bare checkout): the manifest check must fail closed rather than pass by default.

### State Transitions
- Partial reconcile: a child left reopened must leave its parent rollup reopened too; the two may not disagree at any commit.
- Concurrent session edits the same checklists: run in an isolated worktree and re-verify against the merge target before landing.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | 9 findings across 4 review-owned checklist/summary files, a shared manifest, a repo-wide `validate.sh`, and a rollout config |
| Risk | 20/25 | Edits a shared spec-kit script consumed by every packet in the repo (`validate.sh`); self-audit risk named in R-001 |
| Research | 8/20 | Root cause already isolated by the review; remaining work is confirm-before-build re-reads, not open investigation |
| Multi-Agent | 6/15 | Single workstream, five sequential phases, one independent-verification pass (REQ-U04) |
| Coordination | 14/15 | Gates every other child (022-032) in the remediation tree; blocked by OPERATOR-DECISION OD-1 for REQ-007 only |
| **Total** | **66/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Self-audit produces a green gate that a different actor would fail | H | H | Mandatory independent adversarial pass (REQ-U04); the review's own durable lesson names this exact failure |
| R-002 | `031` Lane B de-duplication invalidates citations issued by this child | H | H | Digest-based citations plus an explicit re-reconcile task gated on `031` landing |
| R-003 | Bounding `validate.sh` breaks recursive validation for unrelated packets | H | M | Manifest is opt-in; whole-repo before/after recursive run reported as a delta |
| R-004 | Reopening cascades further than expected across the 013 subtree | M | M | Enumerate the full reopen set in T002 before editing; reconcile parents in the same change |
| R-005 | OD-1 stays unanswered and the 016 disposition is left implicit | M | M | REQ-007 is the only requirement gated on OD-1; the rest of the child lands without it |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: A reader can reproduce any completion claim (Priority: P0)

**As a** reviewer picking up the migration program cold, **I want** every checked item to name a test, a suite digest, and a SHA, **so that** I can re-run it and get the same answer instead of trusting a number.

**Acceptance Criteria**:
1. Given a reopened checklist item, When I read its evidence string, Then it names a test, a suite-content digest, and a candidate SHA.
2. Given that citation, When I check out the SHA and run the named suite, Then the named test exists and the claim reproduces.

### US-002: The recursive gate has a boundary (Priority: P0)

**As a** operator running the parent gate, **I want** recursive strict validation to validate a frozen child set, **so that** adding a child does not silently widen or redden the acceptance surface.

**Acceptance Criteria**:
1. Given a bounded child manifest, When I run `validate.sh --recursive --strict` on the parent, Then the run reports the manifest hash it validated against.
2. Given a child folder absent from the manifest, When I run the same command, Then it fails rather than silently including or excluding the folder.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:open-questions -->
## 12. OPEN QUESTIONS

- **OD-1 (OPERATOR-DECISION).** Relocate the `016` pre-014 validation artifacts (`review/`, `alignment/`) to their own packet, or formally re-scope `016` around them? Adding children 021-032 makes re-scoping strictly more work, which argues for relocation. Gates REQ-007 only.
- Does the bounded child manifest belong in `validate.sh` (a spec-kit-wide mechanism) or in the parent `graph-metadata.json` (a per-packet mechanism)? ADR-002 proposes the former with per-parent opt-in; the alternative is recorded there.
- After `031` Lane B removes duplicate test registration, must every citation issued here be re-verified, or does the suite-content digest survive de-duplication unchanged? Resolve empirically before closing.
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
