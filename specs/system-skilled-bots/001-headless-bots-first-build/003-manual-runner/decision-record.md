---
title: "Decision Record: Phase 3: manual-runner"
description: "Five decisions for the manual runner. Accepted: the decision queue for human-decision stops, with the hold and the move of bots answer to phase 5, and the run-marker allowlist entry. Proposed: the posture matrix, body-secret detection and retry by ledger replay."
trigger_phrases:
  - "manual runner decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/003-manual-runner"
    last_updated_at: "2026-11-22T10:48:29Z"
    last_updated_by: "spec-writer"
    recent_action: "Amended ADR-001 for D9, D10 and D12"
    next_safe_action: "Review ADR-002 to ADR-004 before implementation starts"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-manual-runner"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 3: manual-runner

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: A run that needs a human decision parks in a decision queue

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Operator, decision D1 on 2026-11-22: "Decision queue". This reverses the phase's earlier recommendation of `blockedStop` with no queue. Amended by D9 (the hold), D10 (the expiry key) and D12 (`bots answer` moves to phase 5), all on 2026-11-22 |

---

<!-- ANCHOR:adr-001-context -->
### Context

An unattended run can reach a point where only a person can decide. research.md §16 Q2 left this open: round 1 noted Orca's "needs you" queue as precedent (research.md §4), and neither round designed escalation beyond `blockedStop`. A child that stops to ask and exits 0 looks like a clean run (research.md §8). The operator chose a queue the operator answers later. The research did not design it, so the shape below is this phase's design under that decision.

### Constraints

- `blockedStop` already exists as a stop reason at `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/lifecycle-taxonomy.cjs:48`. No stop reason is added.
- The record exit value `awaiting-decision`, the item schema and the `needsYou.expiryDays` key are phase 1's to fix. The `resume` request kind, its idempotency key and, by operator decision D12, `bots answer` are phase 5's.
- Every trigger only writes a run request (research.md §9). An answer is a trigger too.
- A run must not be able to forge or clear an item, the same rule as switches (research.md §13).
- Phase 3 has no delivery channel and no status surface. Phases 4 and 7 add the notification and the status rows.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Park the run. It ends with exit `awaiting-decision`, stop reason `blockedStop` and class `operator`, writes one needs-you item, releases its lease and exits. While the item is open, the bot's other runs are held (operator decision D9). Phase 5's `bots answer` turns an answer into one `resume` run request (operator decision D12).

**How it works**:
- The prompt tells the child to print one line `[NEEDS-DECISION] <question>`, then optional `[OPTION] <text>` lines, and stop. This marker is new and owned here. No existing deep-loop marker carries it.
- The runner scans the captured output. The first marker wins. An empty question is a run failure classed `author` with no item. A timeout or budget stop keeps its own class even with a marker. A marker on exit 0 still parks the run.
- The runner writes one item to `<state root>/<identity key>/needs-you/` by temp file and rename. It holds the run id, bot id, question, options, `created_at`, the prompt the run was dispatched with and the evidence pointers. Then it rewrites the generation stamp and releases the lease. No process waits.
- `bots inbox` lists open and expired items. An item's `expiresAt` is its `createdAt` plus `needsYou.expiryDays`, default 7 (operator decision D10). An unanswered item past `expiresAt` reads as `expired`. The state is derived, so the file is not rewritten. It is reported and never answered automatically.
- Hold: while a bot has an open item, the runner refuses its other runs before dispatch with the refusal cause `awaiting-decision-hold`, naming the item id. Open means unanswered and not past `expiresAt`. The `resume` request for the item passes, because phase 5 records the answer before it enqueues. Phase 5's drain quarantines a held request with reason `held-needs-you`, and phase 6 records a held schedule fire as a skipped slot (operator decision D9).
- `bots answer <item-id> "<text>"` is phase 5's (operator decision D12). It records the answer, rewrites the stamp through this phase's writer and enqueues one request of kind `resume`, source `answer`, idempotency key equal to the item id. This phase exports the body-secret predicate and the stamp writer it calls.
- The resumed run is a new run with a new id, joined to the item. Its prompt is the item's prompt plus the question and the answer, and it binds the same spec folder. If it asks again, it opens a new item.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Decision queue under the state root (chosen)** | Work resumes with the answer. Uses the normal request path. Nothing waits | New item state, an expiry and a resume path to build and test | 8/10 |
| blockedStop plus operator class, no queue | Uses existing vocabulary. No new state | Work that needed one answer reruns from scratch. The operator rejected it | 5/10 |
| Let the child guess and continue | No stop | Unattended guesses on decisions meant for people | 2/10 |

**What is fixed and what is not**: The choice of a queue, the hold (D9), the expiry key `needsYou.expiryDays` (D10) and the move of `bots answer` to phase 5 (D12) are Accepted. The marker text is this phase's design. The item fields are phase 1's and the `resume` request shape is phase 5's.

**Why this one**: The operator chose it. It keeps the rule that every trigger only writes a run request, so an answer adds no second way to start a run.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A blocked run never reads as a success, and its work resumes with the answer instead of starting over.

**What it costs**:
- New state to keep: items, an expiry and an answer path. Mitigation: items sit beside switches under the state root, and phase 7 owns their retention.
- A bot with an open item does no other work until the item is answered or expires. Mitigation: the expiry bounds the hold, and status shows the bot as held (operator decision D9).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The child exits 0 without printing the marker | H | The marker rule sits in the prompt beside `AI_SESSION_CHILD=1` (research.md §8) |
| An answer starts two runs | M | Phase 5's `bots answer` keys the request by the item id and refuses a different second answer |
| A secret reaches argv through the question or the answer | H | The body-secret predicate runs over both before dispatch |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | research.md §16 Q2 was open and the operator decided it |
| 2 | **Beyond Local Maxima?** | PASS | A plain stop and a guess were weighed |
| 3 | **Sufficient?** | PASS | One item per run, one request per answer, no waiting process |
| 4 | **Fits Goal?** | PASS | The answer flows through the same queue and runner as every trigger |
| 5 | **Open Horizons?** | PASS | Multi-question dialogs and phone answers can build on the item later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- The dispatch prompt and marker parser, the runner's exit mapping, the needs-you module, the hold check and the `inbox` verb. Phase 5 adds the `answer` verb.

**How to roll back**: Remove the needs-you module, the hold check and the `inbox` verb. The marker then maps to `blockedStop` with class `operator` and no item, which was the earlier proposal.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Posture matrix and admitted executor kinds

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Phase implementer, with operator review of the admitted kinds |

---

<!-- ANCHOR:adr-002-context -->
### Context

`sandboxMode` is a preventive boundary for three of nine kinds: Codex, Cursor and the DeepSeek Harness. Claude Code and Devin map it to a permission mode, Pi to a tool allowlist and OpenCode to an auto-approve flag. Native and Mistral Vibe take nothing (research.md §13). `EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY` in `executor-config.ts` records this per kind.

### Constraints

- The fan-out write guard reports an out-of-scope write after the fact. It is evidence, not confinement.
- Only `isolation: shared` exists in this phase. Worktrees arrive in phase 4.
- `buildExecutorDispatchEnv` returns the full parent environment for `native` (`executor-audit.ts:1146`), which breaks the environment allowlist.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We propose**: Build the matrix from `EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY` and the per-kind controls. A definition that declares a preventive sandbox class runs only on a kind marked `true`. A declared weaker class runs on the kinds whose control matches it, and the record states the honored posture.

**How it works**: The posture validator reads the declared isolation and sandbox class, looks up the chosen kind and refuses before dispatch on a mismatch or on `isolation: worktree`. The honored posture is written into the record. For the first build, admit the three preventive kinds for any write-capable posture. Admit Claude Code, OpenCode, Devin, Pi and Mistral Vibe only for a read-only posture. Do not admit `native`, because its child would inherit the full environment.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Matrix from executor-config, read-only for weak kinds** | States what is honored. Refuses false claims of confinement | Fewer kinds can write unattended | 8/10 |
| Admit all nine kinds with any posture | Widest choice | Records would claim containment that does not exist | 2/10 |
| Admit only the three preventive kinds | Simplest truthful rule | Blocks harmless read-only bots on six kinds | 6/10 |

**Why this one**: It ties posture to the one table the runtime already keeps and tests, so the runner cannot drift from it.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Every record states the posture it honored, so a run is never described as contained without a boundary.

**What it costs**:
- Write-capable bots on Claude Code, OpenCode, Devin, Pi and Mistral Vibe are refused, and `native` is refused for every posture. Mitigation: the refusal message names the kinds that can honor the posture.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The capability table changes under the runner | M | Read it at run time. Do not copy it |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | research.md §13 requires posture to be declared and validated |
| 2 | **Beyond Local Maxima?** | PASS | Three admission rules compared |
| 3 | **Sufficient?** | PASS | One lookup over an existing table |
| 4 | **Fits Goal?** | PASS | Refusal before dispatch is a phase acceptance criterion |
| 5 | **Open Horizons?** | PASS | Kinds join as their controls are proven |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- The posture validator and its unit test.

**How to roll back**: Revert the validator. The runner then refuses every dispatch, which is the safe failure.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: How the body-secret refusal detects a literal

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Phase implementer |

---

<!-- ANCHOR:adr-003-context -->
### Context

Five of nine kinds pass the prompt as a command-line argument, which the process table shows for the life of the run (research.md §13). A secret in a `BOT.md` body would therefore leak before any output guard runs. research.md names the refusal but not the detector.

### Constraints

- Output redaction cannot be assumed on Claude Code, Codex, Cursor, Devin and DSH.
- Reports name keys and fingerprints, never values, as the env-secret guard does.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We propose**: Refuse a body that contains a value of any key from the operator's environment or the repository's dotenv files, plus a small set of known token prefixes.

**How it works**: Before dispatch the runner compares the body against the values of keys outside the allowlist and against fixed prefixes for common tokens. A match refuses the run with class `author` and names the matched key or prefix, never the value. The check is one exported predicate. Phase 2's checker imports it, so the repository has one detector, not two.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Known values plus token prefixes** | Few false positives. Catches the secrets the operator holds | Misses a secret the operator never loaded | 7/10 |
| Entropy scan of the body | Catches unknown secrets | Flags hashes, ids and code samples | 4/10 |
| No detection, rely on review | No code | A leak reaches the process table | 1/10 |

**Why this one**: It catches the secrets most likely to be pasted and gives clear refusals. An entropy pass can join later if a miss is observed.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- A pasted key is refused before it reaches argv.

**What it costs**:
- A secret that is neither loaded nor prefixed passes. Mitigation: record this limit in the skill's docs.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The detector logs the value it found | H | Tests assert the refusal names only the key or prefix |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | research.md §13 names the refusal |
| 2 | **Beyond Local Maxima?** | PASS | Three detectors compared |
| 3 | **Sufficient?** | PASS | Value set plus prefix list |
| 4 | **Fits Goal?** | PASS | REQ-005 depends on it |
| 5 | **Open Horizons?** | PASS | The detector list can grow |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- The secret check inside the dispatch module.

**How to roll back**: Revert the check. Every run is then exposed to argv leaks, so roll back only with dispatch disabled.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Retry by ledger replay only

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Phase implementer |

---

<!-- ANCHOR:adr-004-context -->
### Context

A retry that dispatches again into write-once artifacts duplicates work and can corrupt the evidence chain. The append gateway stores a re-sent event once (research.md §8).

### Constraints

- Terminal states never change once written (research.md §10).
- The lease key never contains a worktree path, so a retry cannot start a second tree.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We propose**: Retry only by replaying the ledger through the append gateway in `.skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/`. Never dispatch a second time for the same run.

**How it works**: When a result event write fails, the runner re-sends the same event with the same id. The gateway stores it once. A run whose dispatch failed ends with its class. A new attempt is a new run with a new id.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Ledger replay through the gateway** | Idempotent. Reuses tested code | A failed dispatch is not retried inside one run | 8/10 |
| Redispatch on failure | Recovers transient failures | Duplicate work and write-once conflicts | 3/10 |

**Why this one**: It reuses the gateway's idempotence and keeps one run to one dispatch.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- One run maps to one dispatch receipt pair, which keeps the audit chain simple.

**What it costs**:
- Transient executor failures need a new run. Mitigation: phase 5 adds a bounded retry at the request level.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A caller bypasses the gateway and appends directly | M | Tests assert the runner writes events only through the gateway |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | research.md §8 forbids redispatch |
| 2 | **Beyond Local Maxima?** | PASS | Redispatch was weighed |
| 3 | **Sufficient?** | PASS | Uses an existing gateway |
| 4 | **Fits Goal?** | PASS | REQ-011 depends on it |
| 5 | **Open Horizons?** | PASS | Phase 5 adds request-level retry on top |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- The runner's event-write path.

**How to roll back**: Revert the event-write path to a single append with no replay. No dispatch behavior changes.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

<!-- ANCHOR:adr-005 -->
## ADR-005: How the run marker reaches the child

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Operator, decision D7 on 2026-11-22: "Add allowlist entry" |

---

<!-- ANCHOR:adr-005-context -->
### Context

Phase 5's post-commit leg must skip a commit made inside a bot run, so a bot that commits cannot enqueue itself. It needs a marker in the environment the child passes to git. The runner sets the marker. The child environment comes from `buildExecutorDispatchEnv`, which keeps only the common allowlist and per-kind prefixes (`.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:150`, `:1140`). The `dispatchEnv` field accepts only the keys in `DISPATCH_ENV_KEYS`, which covers two kinds (`executor-audit.ts:1495`). A new key is therefore dropped before the child sees it.

### Constraints

- This phase imports the deep-loop libraries and modifies only this one entry.
- Owner of the file: the `system-deep-loop` skill. The list is `EXECUTOR_COMMON_ENV_ALLOWLIST` at `executor-audit.ts:150`, read by `isAllowedExecutorEnvKey` at `:304`.
- Callers of `buildExecutorDispatchEnv`: `system-deep-loop/runtime/scripts/dispatch-iteration.cjs`, `system-deep-loop/runtime/scripts/fanout-run.cjs`, `.skilled/commands/deep/assets/deep-review.yaml` and `.skilled/commands/deep/assets/deep-research.yaml`. Tests: `executor-audit.vitest.ts`, `fanout-run.vitest.ts`, `executor-audit-receipts.test.ts` and `executor-audit-cli-branch-receipts.test.ts`. None sets the key, so none sees a change.
- A new allowlist entry needs an observed failure as evidence (research.md §13).
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: name the marker `SKILLED_BOT_RUN_ID`, set to the run id, and add that one key to `EXECUTOR_COMMON_ENV_ALLOWLIST` in `executor-audit.ts`. The owner and callers are named above. The observed failure is produced in this phase: T025 shows a fixture child without the key before the entry.

**How it works**: The runner sets the key in its own environment before dispatch. The widened allowlist passes it to every kind. Phase 5's leg skips when the key is set.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **New key plus one allowlist entry** | Precise. Marks bot runs only | Edits a shared file | 7/10 |
| Phase 5 keys on `AI_SESSION_CHILD`, which already passes | No shared edit | Skips commits from every orchestrated child, not only bots | 4/10 |
| A marker file under the state root, keyed by the lease | No environment change | The hook must find the run from a checkout path, and the lease key holds no path | 3/10 |

**Why this one**: It is the only option that marks bot runs alone. The operator approved the shared edit.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- A bot that commits cannot trigger itself.

**What it costs**:
- One line in a shared deep-loop file. Mitigation: run the deep-loop suite before and after (T023).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The marker leaks into a non-bot dispatch | L | Only the runner sets it. A test shows a non-bot dispatch has no marker |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase 5 REQ-011 depends on a marker |
| 2 | **Beyond Local Maxima?** | PASS | Three delivery paths compared |
| 3 | **Sufficient?** | PASS | One key, one allowlist entry |
| 4 | **Fits Goal?** | PASS | Bounds a runaway loop (research.md §13) |
| 5 | **Open Horizons?** | PASS | Other triggers can read the same key |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- The dispatch module, and one allowlist entry in `executor-audit.ts`.

**How to roll back**: Remove the entry and the key. Phase 5's leg then has no marker and must fall back to the retry bound.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions
<!-- FILL: Leave the table empty: a full-auto save fills it from captured operator answers. Hand-write a row only for an answer the capture missed, with the next free id. GOOD: Q004 decides `Keep the archive for 30 days`, gives the stated reason and names REQ-002. WEAK: Q004 says `Discussed retention` and leaves the other cells empty. -->

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | A run that needs a decision parks in a needs-you queue the operator answers later | Operator answer D1, 2026-11-22 | The earlier `blockedStop`-only proposal in ADR-001 | ADR-001, REQ-010, REQ-016 to REQ-018, REQ-020 |
| Q002 | Run folders live in the Skilled tree under `.skilled/skills/.state/system-skilled-bots/`, gitignored | Operator answer D2, 2026-11-22 | research.md §11's state-root placement, for run folders only | REQ-021, plan Storage row |
| Q003 | Add `SKILLED_BOT_RUN_ID` to the executor-audit allowlist | Operator answer D7, 2026-11-22 | None | ADR-005, REQ-014, T025 |
| Q004 | Raise this phase to Level 3 | Operator answer D8, 2026-11-22 | Level 2 scaffold | All packet docs |
| Q005 | While a bot has an open needs-you item, its scheduled and queued runs are held and reported until the item is answered or expires. The runner refuses them with the cause `awaiting-decision-hold` | Operator answer D9, 2026-11-22. The operator picked the recommended option | Runs firing freely during an open item | ADR-001, REQ-013, REQ-022, T034, AC-019 |
| Q006 | The needs-you expiry is `needsYou.expiryDays` in `bots/config.json`, default 7 | Operator answer D10, 2026-11-22. The operator picked the recommended option | The unnamed expiry key | ADR-001, REQ-018, T028, AC-014 |
| Q007 | `bots answer` moves to phase 5 as a queue producer. This phase keeps writing items, `bots inbox`, expiry and the resumed prompt | Operator answer D12, 2026-11-22. The operator picked the recommended option | The 003 T030 block and the wait between phases 3 and 5 | ADR-001, REQ-019 (moved), REQ-020, AC-015 and AC-016 (Superseded), AC-018 |
| Q008 | A hand-typed `bots run <id>` is held too while the bot has an open needs-you item, and its refusal points at `bots inbox` | Operator answer D13, 2026-11-22. The operator picked the recommended option | Allowing manual runs, or allowing them with `--force` | REQ-022, T034 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

- **Q001** (D1, Q2: what an unattended run does when it needs a human decision): "Decision queue". Offered option text: park the run and add a needs-you queue you answer later, like Orca.
- **Q002** (D2, Q3: where run folders live): "preferably inside the skilled repo folder somehow but git ignored".
- **Q003** (D7, the run marker): "Add allowlist entry (Recommended)".
- **Q004** (D8, levels): "Raise to Level 3".
- **Q005** (D9, asked as "While a bot has an open needs-you item, should its schedule keep firing new runs?"): "Hold new runs (Recommended)".
- **Q006** (D10, asked as "How should the needs-you expiry and history be configured?"): "Both configurable (Recommended)".
- **Q007** (D12, asked as "`bots answer` creates a cycle... Move it?"): "Move to 005 (Recommended)". The question text is as the orchestrator relayed it, elided in the middle.
- **Q008** (D13, asked as "While a bot is waiting on your answer, should a hand-typed `bots run <id>` also be held?", options "Hold it too (Recommended)", "Allow manual runs", "Allow with --force"): "Hold it too (Recommended)".

Only the chosen answers, and the one option text above, reached this phase. The other offered options were not recorded here.
<!-- /ANCHOR:operator-answers-verbatim -->

---
