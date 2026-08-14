---
title: "Feature Specification: Make Fan-Out Fulfillment Evidence-Derived and Dispatch Containment Enforced"
description: "A lineage is accepted when one non-empty top-level report exists, with no validation of state JSONL, iteration records, deltas, findings registry or terminal synthesis, and under the max-iterations policy a single synthesis record's self-reported counters are trusted over the actual iteration files. That is the fabrication mode the review observed live. Around it sit dropped provenance, kind-specific containment, and an observability sink that persists whole payloads."
trigger_phrases:
  - "fanout dispatch integrity"
  - "fanout fulfillment artifact contract"
  - "write containment dirty path"
  - "executor audit provenance"
  - "deep loop 028 fanout"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-fanout-dispatch-integrity"
    last_updated_at: "2026-08-08T02:30:00Z"
    last_updated_by: "claude"
    recent_action: "Verified REQ-010, F-016-03, and write-containment data-loss fix via code and tests"
    next_safe_action: "Landed as 568aa17a40; QA gaps: baseline, rollback, tests, contract; F-016-01/F-016-06 deferred"
    blockers: []
    key_files:
      - "spec.md"
      - "checklist.md"
      - "decision-record.md"
    completion_pct: 86
    open_questions:
      - "Per-mode artifact contract location still open; T005/T006 never executed"
      - "No per-dispatch-kind containment test exists even though containment now runs for every kind (REQ-010 code delivered, REQ-010 test-per-kind bar still open)"
    answered_questions:
      - "CALIBRATION: F-016-01 is a robustness fix, not a security incident; fix is execFile/argv"
      - "BLAST-RADIUS RULE: dispatch tests run in an isolated worktree per the cli-codex incident"
      - "REQ-003 RESOLVED: cli-opencode now rejects an explicit unenforceable sandbox mode (throw) instead of labeling it advisory and dispatching; default (unspecified) resolves to danger-full-access"
      - "REQ-010 RESOLVED (code): containmentEnabled is now true for every dispatch kind, made safe by the preserve-as-advisory data-loss fix"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

# Feature Specification: Make Fan-Out Fulfillment Evidence-Derived and Dispatch Containment Enforced

> Phase adjacency under the `036-deep-loop-innovation` parent (grouping order, not a runtime dependency): predecessor `005-mode-gate-and-contract-binding`; successor `007-improvement-promotion-authority`.

> **Scaffold dependency.** This child is scaffolded under `036-deep-loop-innovation/` as a flat
> sibling of phases 001-020. That nesting is conditional on child `021`'s hashed-child-manifest fix
> (`F-029-03`) landing first: without a bounded child manifest, every child added here widens the
> parent's unbounded recursive-validation glob. `021` is the first scaffold in the tree.

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Fulfillment is the load-bearing half: a lineage is accepted when one non-empty top-level report exists, and under the max-iterations policy a single synthesis record's self-reported `totalIterations` and `stopReason` are trusted over the actual iteration files. That is the fabrication mode the review observed live. Provenance is dropped: the worker discards `effectiveConfig` and `invocationFingerprint`, and the executor audit records five fields, so materially different invocations produce identical audit blocks. Containment is kind-specific and blunt: native dispatch hardcodes permission bypass, `cli-opencode` records sandbox modes it never enforces, post-dispatch containment runs only for `cli-codex` (confirmed live, reverting 15 untracked files belonging to a concurrent session), and the guard exempts dirty paths by pathname only.

**Key Decisions**: Fulfillment is derived from a per-mode artifact contract, never from report presence or self-reported counters (ADR-001); dispatch moves from shell interpolation to argv (ADR-002); containment is uniform across kinds and detects dirty-path truncation by content identity (ADR-003)

**Critical Dependencies**: `021` for honest baselines. Coordinates with `024` on `runtime/lib/deep-loop/`. Sequence before `031` for `fanout-run.cjs`.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete (10/12 findings landed as d0d8623ddf; REQ-010 uniform containment + F-016-03 rejection + a write-containment data-loss safety fix delivered, code- and test-verified, landed as 568aa17a40 on skilled/v4.0.0.0; F-016-01/F-016-06 deferred; residual QA items open — see checklist) |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent** | `system-deep-loop/036-deep-loop-innovation` |
| **Wave** | W4 |
| **Findings in scope** | 12 (5 P0 / 7 P1 / 0 P2), 2 carrying a review `CONFIRMED*` mark |
| **Blocks `014` cutover** | No — robustness, not on the cutover unblock path |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Fulfillment accepts a lineage when one non-empty top-level report exists, with no validation of state JSONL, iteration records, deltas, findings registry or terminal synthesis (`F-010-01`), and under the max-iterations policy trusts a single synthesis record's self-reported `totalIterations` and `stopReason` over the actual iteration files (`F-010-02`). Provenance is dropped: the worker destructures `command`/`args`/`input` and discards `effectiveConfig` and `invocationFingerprint` (`F-010-03`), and the executor audit records only five fields, omitting sandbox mode, timeout, web-search policy, config dir, governor and executable identity, so materially different invocations produce identical audit blocks (`F-010-04`). Containment is kind-specific: native dispatch hardcodes `--dangerously-skip-permissions` with `--dir process.cwd()` and ignores the computed sandbox mode (`F-016-02`, CORROBORATED-IN-PART); `cli-opencode` silently records read-only and workspace-write as effective while emitting no enforcing flag (`F-016-03`); the containment guard exempts pre-existing dirty paths by pathname only, so a child can truncate an already-dirty out-of-scope file (`F-016-04`); and it returns an empty violation list when the artifact realpath falls outside the worktree (`F-016-05`). Shell wrappers interpolate `{research_topic}`, `{config.fanout_json}` and paths straight into a shell command (`F-016-01`, CONFIRMED-SEVERITY-CALIBRATED: operator-supplied values, so the realistic failure is a broken dispatch from ordinary punctuation). Standalone Codex dispatch forwards the entire parent environment (`F-016-06`). And the shared observability sink persists `{...payload}` with no allowlist while callers pass whole native records (`F-020-01`), and interpolates a raw lineage label onto stderr for three loud events (`F-020-02`).

### Purpose
Make a fulfilled lineage mean the work exists, make an audit block distinguish materially different invocations, and make containment enforce the same boundary regardless of dispatch kind.

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
- Exit-code classification in `fanout-run.cjs` — that is `031`, sequenced after this child.
- The ledger append boundary (`024`), even though both touch `runtime/lib/deep-loop/`.
- Treating `F-016-01` as a security incident. It is calibrated as a robustness fix; the values are operator-supplied.
- Any change to what a mode produces; only to how fulfillment is verified.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A per-mode artifact contract: state JSONL, iteration records, deltas, findings registry and terminal synthesis, all validated before a lineage is fulfilled.
- Iteration counts derived from actual iteration files, never from a synthesis record's self-report.
- Durable dispatch provenance: `effectiveConfig` and `invocationFingerprint` survive to the worker.
- Executor audit records sandbox mode, timeout, web-search policy, config dir, governor and executable identity.
- Uniform containment across dispatch kinds; a sandbox mode that cannot be enforced is rejected rather than recorded as effective.
- Post-dispatch containment for every kind, not only `cli-codex`.
- Dirty-path exemption by content identity rather than pathname, so truncation of an already-dirty out-of-scope file is detected.
- An out-of-worktree artifact scope is a hard dispatch failure, not an empty violation list.
- Argv dispatch (`execFile`) replacing shell interpolation in the fan-out wrappers.
- Standalone Codex dispatch forwards a filtered environment.
- An allowlist on the observability sink; raw lineage labels are not interpolated onto stderr.

### Out of Scope
- Exit-code classification (`031`).
- Ledger fencing (`024`).
- Mode gates (`027`).

### Findings in Scope (12)

| ID | Sev | Review mark | Location (at review time) | Defect |
|----|-----|-------------|---------------------------|--------|
| `F-010-01` | P0 | unverified | `runtime/scripts/fanout-run.cjs:553` | Fan-out fulfills lineages with only a top-level report |
| `F-010-02` | P0 | unverified | `runtime/scripts/fanout-run.cjs:674` | Max-iteration completion trusts child-authored synthesis counters |
| `F-010-03` | P1 | unverified | `runtime/scripts/fanout-run.cjs:2272` | Fan-out discards invocation provenance before spawning |
| `F-010-04` | P1 | unverified | `runtime/lib/deep-loop/executor-audit.ts:824` | Executor JSONL audits collapse materially different dispatches |
| `F-016-01` | P0 | CONFIRMED-SEVERITY-CALIBRATED | `commands/deep/assets/deep-research-auto.yaml:165` | Fanout shell wrappers interpolate unescaped attacker-controlled values |
| `F-016-02` | P0 | CORROBORATED-IN-PART | `runtime/scripts/fanout-run.cjs:1593` | Native fanout dispatch always bypasses permissions and has no write containment |
| `F-016-03` | P0 | unverified | `runtime/scripts/fanout-run.cjs:1630` | cli-opencode silently ignores read-only and workspace-write sandbox modes |
| `F-016-04` | P1 | unverified | `runtime/lib/deep-loop/write-containment.ts:295` | Write containment exempts pre-existing dirty paths by pathname only |
| `F-016-05` | P1 | unverified | `runtime/lib/deep-loop/write-containment.ts:238` | Containment fails open when the artifact scope is outside the worktree |
| `F-016-06` | P1 | unverified | `runtime/scripts/codex-dispatch.cjs:122` | Standalone Codex dispatch forwards the entire parent environment |
| `F-020-01` | P1 | unverified | `runtime/lib/deep-loop/observability-events.cjs:109` | Observability ledger persists unrestricted producer payloads |
| `F-020-02` | P1 | unverified | `runtime/lib/deep-loop/observability-events.cjs:137` | Loud lifecycle events disclose raw lineage labels on stderr |

`F-016-01` is CONFIRMED-SEVERITY-CALIBRATED: the interpolated values are operator-supplied, so the realistic failure is a broken dispatch from ordinary punctuation rather than an injection incident. `F-016-02` is CORROBORATED-IN-PART and was observed live: `cli-codex` containment reverted 15 untracked files belonging to a concurrent session. That is why every dispatch test in this child runs in an isolated worktree.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Artifact-contract fulfillment; iteration counts from files; provenance; containment; argv dispatch (`F-010-01`, `F-010-02`, `F-010-03`, `F-016-02`, `F-016-03`) |
| `.opencode/skills/system-deep-loop/runtime/scripts/codex-dispatch.cjs` | Modify | Forward a filtered environment (`F-016-06`) |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | Modify | Content-identity dirty-path exemption; hard failure on out-of-worktree scope (`F-016-04`, `F-016-05`) |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modify | Record sandbox mode, timeout, search policy, config dir, governor, executable identity (`F-010-04`) |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/observability-events.cjs` | Modify | Allowlist the persisted payload; stop interpolating raw labels onto stderr (`F-020-01`, `F-020-02`) |
| `.opencode/skills/system-deep-loop/commands/deep/assets/deep-research-{auto,confirm}.yaml` | Modify | Argv dispatch instead of shell interpolation (`F-016-01`) |
| `.opencode/skills/system-deep-loop/commands/deep/assets/deep-review-{auto,confirm}.yaml` | Modify | Argv dispatch instead of shell interpolation |
| `.opencode/skills/system-deep-loop/runtime/tests/executor-audit-receipts.test.ts` | Modify | Provenance-field assertions |
| `.opencode/skills/system-deep-loop/runtime/tests/executor-audit-cli-branch-receipts.test.ts` | Modify | Per-kind audit distinctness assertions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A lineage is fulfilled only when its per-mode artifact contract is satisfied. | A lineage with a non-empty report but a missing, duplicated or inconsistent state JSONL fails fulfillment. |
| REQ-002 | Iteration counts are derived from actual iteration files. | A lineage emitting one synthesis record claiming the configured count with no matching iteration files fails fulfillment. |
| REQ-003 | A sandbox mode that cannot be enforced is rejected rather than recorded as effective. | An unsupported sandbox mode for a dispatch kind causes a dispatch failure, not a recorded-effective value. |
| REQ-004 | Containment detects truncation of a pre-existing dirty out-of-scope file. | Content-identity based test: a child truncating an already-dirty out-of-scope file is detected. |
| REQ-005 | An out-of-worktree artifact scope is a hard dispatch failure. | A dispatch whose artifact realpath falls outside the worktree fails rather than returning an empty violation list. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Dispatch provenance survives to the worker and into the audit. | `effectiveConfig` and `invocationFingerprint` are present at the worker; materially different invocations produce distinguishable audit blocks. |
| REQ-007 | Fan-out dispatch uses argv rather than shell interpolation. | A topic containing quotes, semicolons and spaces survives dispatch intact. |
| REQ-008 | Standalone Codex dispatch forwards a filtered environment. | A parent environment variable outside the allowlist is absent in the child. |
| REQ-009 | The observability sink allowlists what it persists and does not interpolate raw labels onto stderr. | Credential-shaped keys and prompt or error text in nested payloads are redacted or rejected at the sink; loud events emit no raw label. |
| REQ-010 | Post-dispatch containment runs for every dispatch kind. | One containment test per supported kind, none skipped. |

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

- **SC-001**: All 12 scoped findings closed as fixed, `REFUTED`, or `ALREADY-FIXED`.
- **SC-002**: A lineage with a report but no state JSONL fails fulfillment.
- **SC-003**: A lineage with a self-reported count and no iteration files fails fulfillment.
- **SC-004**: An unsupported sandbox mode is rejected rather than recorded as effective.
- **SC-005**: Truncation of a pre-existing dirty out-of-scope file is detected by content identity.
- **SC-006**: A topic containing quotes, semicolons and spaces dispatches intact.
- **SC-007**: Every dispatch test ran in an isolated worktree and no concurrent session file was touched.
- **SC-008**: `npm run typecheck && npm test` in `runtime` green, reported as a delta against the `021` baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Dispatch tests damage a concurrent session's files | High | Blast-radius rule: every dispatch test runs in an isolated worktree. `F-016-02` was observed doing exactly this. |
| Risk | The artifact contract rejects legitimate historical lineages | Medium | Enumerate existing lineage shapes first; a rejection of a genuine complete lineage is a finding, not an acceptable cost |
| Risk | Argv dispatch changes behavior for wrappers that relied on shell features | Medium | Enumerate wrapper shell usage before the change; anything relying on a shell feature is called out explicitly |
| Risk | Uniform containment blocks a dispatch kind that genuinely cannot enforce a mode | Medium | That is the intended outcome: rejecting is correct where recording-as-effective was the defect. Record the policy for such kinds. |
| Risk | `024` edits the same `runtime/lib/deep-loop/` directory | Medium | Different files; serialize the merge |
| Risk | `031` adds exit-code classification to `fanout-run.cjs` | Medium | This child lands the artifact contract first; ordering in `MANIFEST.md` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Evidence
- **NFR-E01**: Fulfillment must be derived from artifacts on disk, never from a self-report.
- **NFR-E02**: An audit block must distinguish materially different invocations.

### Containment
- **NFR-C01**: The containment boundary must not depend on dispatch kind.
- **NFR-C02**: A scope the guard cannot evaluate must be a failure, never an empty violation list.

### Isolation
- **NFR-I01**: Every dispatch test runs in an isolated worktree.

### Redaction
- **NFR-R01**: The observability sink persists only allowlisted fields.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Report present, state JSONL absent: fulfillment fails (`F-010-01`).
- Synthesis claiming N iterations, zero iteration files: fulfillment fails (`F-010-02`).
- Topic containing quotes, semicolons and spaces: dispatches intact (`F-016-01`).
- Empty payload at the sink: persisted as empty, not as an absent record.

### Error Scenarios
- Unsupported sandbox mode for a kind: dispatch fails (`F-016-03`).
- Artifact realpath outside the worktree: hard failure (`F-016-05`).
- Child truncates an already-dirty out-of-scope file: detected (`F-016-04`).
- Credential-shaped key in a nested payload: redacted or rejected (`F-020-01`).

### State Transitions
- Duplicated state JSONL: fulfillment fails rather than picking one.
- Partial lineage mid-dispatch: not fulfilled, and the partial state is diagnosable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | 12 findings across 5 runtime modules (`fanout-run.cjs`, `codex-dispatch.cjs`, `write-containment.ts`, `executor-audit.ts`, `observability-events.cjs`), 4 YAML command assets, and 2 test suites |
| Risk | 22/25 | Edits `runtime/lib/deep-loop/` shared with `024`; a containment defect in this exact scope was observed live reverting 15 untracked files belonging to a concurrent session |
| Research | 10/20 | Root cause isolated by the review, but two open questions (artifact-contract location, unenforceable-mode policy) and two required enumerations (lineage shapes, wrapper shell usage) remain before Phase 2/4 can start |
| Multi-Agent | 6/15 | Single workstream, five sequential phases, one independent-verification pass (REQ-U04) |
| Coordination | 8/15 | Depends on `021`'s baseline; coordinates with `024` on a shared directory; must sequence before `031` on `fanout-run.cjs`; not on the `014` cutover path |
| **Total** | **66/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Dispatch tests revert a concurrent session's files | H | M | Isolated worktree for every dispatch test (NFR-I01); this failure was observed live |
| R-002 | The artifact contract rejects a genuine historical lineage | M | M | Lineage shapes enumerated first; a rejection is investigated as a finding |
| R-003 | Argv dispatch breaks a wrapper relying on shell features | M | M | Wrapper shell usage enumerated before the change |
| R-004 | Directory collision with `024` | M | M | Different files; serialize the merge |
| R-005 | File collision with `031` on `fanout-run.cjs` | M | M | Artifact contract lands first; ordering in `MANIFEST.md` |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: A fulfilled lineage did the work (Priority: P0)

**As a** operator reading a fan-out result, **I want** fulfillment to require the artifacts the mode is supposed to produce, **so that** a lineage that emitted one report cannot pass as a completed run.

**Acceptance Criteria**:
1. Given a lineage with a non-empty report and no state JSONL, When fulfillment runs, Then it fails.
2. Given a lineage with one synthesis record claiming the configured iteration count and no iteration files, When fulfillment runs, Then it fails.

### US-002: Containment does not depend on dispatch kind (Priority: P0)

**As a** engineer running a fan-out alongside other work, **I want** the same write boundary regardless of which executor is dispatched, **so that** a concurrent session's files are safe from every kind, not only the one that happens to check.

**Acceptance Criteria**:
1. Given a dispatch of any supported kind, When the child writes outside its scope, Then containment detects it.
2. Given a child truncating an already-dirty out-of-scope file, When containment runs, Then it is detected by content identity rather than exempted by pathname.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:open-questions -->
## 12. OPEN QUESTIONS

- Does the per-mode artifact contract live in the mode registry or beside each mode asset? The registry keeps one place to look; per-asset keeps the contract next to the thing that produces it. Decide before Phase 2.
- What is the containment policy for a dispatch kind that genuinely cannot enforce a computed sandbox mode? Rejecting the dispatch is correct where recording-as-effective was the defect, but the policy for such a kind must be written down rather than emerging from a rejection.
- Which fan-out wrappers rely on shell features that argv dispatch removes? Enumerate before Phase 4; anything relying on a shell feature needs an explicit replacement rather than a silent behavior change.
<!-- /ANCHOR:open-questions -->
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Findings register**: `../001-whole-system-gate/review/findings-register.md`
- **Canonical registry**: `../001-whole-system-gate/review/deep-review-findings-registry.json`
- **Review verdict and calibration**: `../001-whole-system-gate/review/review-report.md`
<!-- /ANCHOR:related-docs -->
