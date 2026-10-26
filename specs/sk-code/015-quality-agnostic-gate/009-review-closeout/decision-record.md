---
title: "Decision Record: Phase 9: review-closeout"
description: "Three choices the operator-accepted review items needed: a separate trust key for configured checks, warnings for a fault on a surface that does not apply, and a bounded pool that keeps node --check."
trigger_phrases:
  - "review closeout decision record"
  - "trustRepoChecks decision"
  - "syntax node pool decision"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/009-review-closeout"
    last_updated_at: "2026-10-26T16:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded the three decisions the accepted review items needed"
    next_safe_action: "Implement lane A, then lanes B and C, against these decisions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-review-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 9: review-closeout

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: A separate trust key for configured checks

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, confirmed by the operator 2026-10-26 |
| **Date** | 2026-10-26 |
| **Deciders** | Operator (accepted the review recommendation), phase author |

---

<!-- ANCHOR:adr-001-context -->
### Context

A committed `.sk-code/quality.json` names commands, and today the runner runs them as soon as the gate runs. In a cloned repository that is code from the repository's authors running on the operator's machine with no grant. The git hooks already ask for a grant before they run a repository's hooks, through `skilled.trustRepoHooks`. The review asked for the same opt-in on configured checks.

### Constraints

- The hub's own repository must keep running its own config with no extra step, or every run here turns `UNVERIFIED`.
- The grant must live where the repository cannot set it for the operator. Local git config qualifies, because a clone does not carry it.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: a new key, `skilled.trustRepoChecks`, read with `git config --local --bool`, as its own grant beside the hook key.

**How it works**: The runner reads the key once per run before any configured spawn. A configured check runs when the key is true, when the repository is the hub's own, or when the operator named the file with `--config`. Otherwise it reports `SKIPPED_UNTRUSTED` with the repair line `git config --local skilled.trustRepoChecks true`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A separate `skilled.trustRepoChecks` key** | Each grant says what it allows. An operator can trust a repository's checks and not its hooks, or the other way round | One more key to set in a repository the operator trusts fully | 8/10 |
| Reuse `skilled.trustRepoHooks` | One key, already documented, already set in some clones | A grant given for hooks silently starts running checks, and the reverse cannot be expressed. Hooks run on git events and checks run on the gate, so they are separate trust grants | 4/10 |

**Why this one**: hooks and checks run different code at different times, so one grant must not quietly widen into the other.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- No command from a committed config runs without a grant the repository cannot give itself.
- A grant given for hooks keeps meaning exactly what it meant.

**What it costs**:
- A repository that relied on its config now reads `SKIPPED_UNTRUSTED` until the operator grants it. Mitigation: the repair line is one command, and the changelog names the change.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A global git config sets the key and grants every repository | M | Only `--local` is read, and a case sets a global true and expects no grant |
| The hub-repository test misreads a fork as the hub | M | The test compares the repository root with the root that holds the loaded hub, not a remote name |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A cloned config runs code with no grant today, which the review named and the operator accepted |
| 2 | **Beyond Local Maxima?** | PASS | Reusing the hook key was weighed and rejected above |
| 3 | **Sufficient?** | PASS | One key and two existing signals, the hub repository and `--config`, cover every case the review named |
| 4 | **Fits Goal?** | PASS | The gate runs in any repository, which means it must not run that repository's code unasked |
| 5 | **Open Horizons?** | PASS | The key name follows the existing `skilled.trust*` family |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `quality-gate.cjs` reads the grant and adds the `SKIPPED_UNTRUSTED` state.
- `quality-config.md` section 8 and `runner-contract.md` state the grant, the state and the repair line, and the doctor's `status` reports the trust state read-only.

**How to roll back**: revert the lane B commit with `git revert <sha>`, and an operator who set the key removes it with `git config --local --unset skilled.trustRepoChecks`.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Warnings for a fault on a surface that does not apply

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, confirmed by the operator 2026-10-26 |
| **Date** | 2026-10-26 |
| **Deciders** | Operator (accepted the review recommendation), phase author |

---

<!-- ANCHOR:adr-002-context -->
### Context

Phase 005 made `CHECKLIST_OUTSIDE_SKILL` and `CHECKLIST_ROW_INVALID` config errors for any installed skill. A malformed row in a skill whose surface touches none of the files in scope therefore turns every run into `ERROR`, and the author cannot fix it from the change they are checking. This decision amends that 005 rule.

### Constraints

- A fault that does affect a file in scope must still stop the gate, or a broken row could hide a checklist the author needed.
- The verdict schema stays `code-quality-run/v1`, so the change can only add a field.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: a fault errors only when the faulty skill's surface applies to a file in scope, and is otherwise listed in a new non-gating `config.warnings` array.

**How it works**: the runner resolves surfaces per file before it raises the two codes. For a skill in that set it raises into `errors[]` as before. For any other skill it adds `{ code, skill, reason }` to `config.warnings` and changes nothing else in the verdict.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Error where it applies, warn elsewhere** | The gate stops only on what affects the change, and the fault is still visible | Readers that want every fault must read two arrays | 8/10 |
| Keep the error everywhere | One rule, no new field | An unrelated skill's typo blocks every author in the repository | 3/10 |
| Drop the fault silently where it does not apply | Simplest verdict | A broken row goes unnoticed until it matters | 2/10 |

**Why this one**: it keeps the block where the fault matters and the signal where it does not.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A malformed row in an unrelated skill no longer blocks a run.
- The fault stays in the verdict, so the skill's owner can find it.

**What it costs**:
- One added field that readers may ignore. Mitigation: `runner-contract.md` documents it, and the consumer inventory in `plan.md` checks no reader fails on it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Surface resolution misses a file and a fault that applies is warned | M | A case puts a file of the faulty surface in scope and expects `ERROR` |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The review named the over-wide error and the operator accepted the fix |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed above |
| 3 | **Sufficient?** | PASS | One condition and one added array |
| 4 | **Fits Goal?** | PASS | The gate blocks on evidence about the change, not about unrelated skills |
| 5 | **Open Horizons?** | PASS | `config.warnings` can carry other non-gating config notes later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- The checklist row validation in `quality-gate.cjs` checks surface applicability before it raises.
- `runner-contract.md` states the rule and the array, and the 005 decision record marks its rule amended by this phase.

**How to roll back**: revert the lane A commit with `git revert <sha>`, which restores the error for every installed skill.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: A bounded pool that keeps node --check

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, confirmed by the operator 2026-10-26 |
| **Date** | 2026-10-26 |
| **Deciders** | Operator (accepted the review recommendation), phase author |

---

<!-- ANCHOR:adr-003-context -->
### Context

`syntax-node` spawns one `node --check` per file, one after another. On a 50-file scope that loop is a large share of the run. The review asked for the check to run faster and for the timing to be recorded as five full runs with per-check durations.

### Constraints

- The findings must not change. `node --check` is the parser the code will run under, so its verdict is the one that counts.
- The machine must not be flooded. A 50-file scope must not start 50 processes at once on a smaller machine.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: run the same `node --check` calls through a concurrent pool bounded by the core count, and gather results by input index.

**How it works**: the pool starts at most `os.availableParallelism()` calls at once, starts the next file as one finishes, and writes each result into the slot of its input. The finding list is built from the slots in order, so it matches the sequential loop.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Bounded pool of `node --check`** | Same parser and same findings, wall time drops with the core count | Still one process per file | 8/10 |
| An in-process compiler such as `vm.Script` or a bundled parser | No spawn cost | A different parse path than the runtime, so findings can differ on module syntax and flags, and a bundled parser is a new dependency | 4/10 |
| Keep the sequential loop | No change | The budget stays unmeasured and slow | 2/10 |

**Why this one**: it is the only option that keeps `node --check` semantics while cutting the wall time.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- The node syntax check's wall time drops on a multi-core machine.
- `evidence/timing.json` records five full runs with per-check `duration_ms`, so the budget is a measurement.

**What it costs**:
- Concurrency in a blocking check. Mitigation: the pool parity case compares findings with the sequential loop on the same files.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Results arrive out of order and the finding list reorders | M | Results are gathered by input index, and the case checks order |
| A slower machine misses the budget | L | The figure is labelled a reference-machine figure with the machine and core count beside it |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The review named the sequential loop and the missing five-run record |
| 2 | **Beyond Local Maxima?** | PASS | An in-process compiler was weighed and rejected above |
| 3 | **Sufficient?** | PASS | A pool around the existing call, with no new dependency |
| 4 | **Fits Goal?** | PASS | The parent budget is under 2 seconds for 50 files |
| 5 | **Open Horizons?** | PASS | The same pool can serve `syntax-shell` later if a measurement asks for it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `runNodeCheck` in `quality-gate.cjs` runs through the bounded pool.
- `quality-gate.test.cjs` gains the pool parity case, and `evidence/timing.json` holds the five runs.

**How to roll back**: revert the lane C commit with `git revert <sha>`, which restores the sequential loop. The timing record stays as evidence of the run it measured.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---
