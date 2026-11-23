---
title: "Decision Record: Phase 3: manual-runner"
description: "Eight decisions for the manual runner. Accepted: the decision queue, the run-marker allowlist entry, receipts under the user-level state root, the result event through the append gateway and read-only OpenCode and Mistral Vibe bots. Proposed: the posture matrix and body-secret detection. Superseded: the first replay proposal."
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

**As built (2026-11-22)**: `runtime/lib/posture.ts` reads `EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY` and each kind's `sandboxSurface` at call time. Codex, Cursor and the DeepSeek Harness honor every sandbox class. Claude Code, Devin, Pi, OpenCode and Mistral Vibe honor read-only only, because their surface is a permission mode, a tool allowlist or a permission config, a tool gate rather than an OS boundary. An undeclared sandbox resolves to the deep-loop default, `workspace-write`. The first build refused OpenCode and Mistral Vibe for every class, because the OpenCode builder refused read-only and Vibe took no sandbox mode. The operator decision of 2026-11-22 ("Support read-only now", ADR-008) supersedes that part: both deep-loop builders now carry a read-only tool-narrowing profile, the runner reads OpenCode's `opencode-json` final answer, and both kinds are admitted for read-only only. The decision text above, which already listed them for read-only, now matches the build.
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

**As built (2026-11-22)**: `findSecretLiteral(text, known)` and `collectKnownSecrets(env, checkoutRoot)` in `runtime/lib/dispatch.ts`. Known values are the environment values outside the keys every executor kind admits (derived from `buildExecutorDispatchEnv`, not restated) plus the values in the checkout's top-level `.env*` files. Values shorter than 8 characters, booleans and plain numbers are ignored, since they would refuse ordinary text. A fixed prefix list covers common token shapes. A match names the key or prefix, never the value. Absolute-path values are ignored too: in a real shell, `PWD`, `OLDPWD` and `SHELL` sit outside the allowlist, and a body naming its own checkout was refused as a secret until this rule was added.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Retry by ledger replay only

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Superseded by ADR-007 |
| **Date** | 2026-11-22 |
| **Deciders** | Phase implementer. Superseded by operator decision D15 on 2026-11-22: "Build it now" |

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

**As built (2026-11-22), blocked**: the gateway is not wired. `appendModeEvent` needs a per-mode event registry, a transition policy, an authority root and a cutover binding, and no bots mode has them. Building one is a module outside this phase's Files to Change, so T014 is blocked and AC-008 stays Unmet. The runner writes one `bot_run_result` row per run to the run ledger, keyed `<run id>:result`, and never dispatches a run twice. Open for the operator: either add a bots ledger schema in a later phase, or supersede the gateway part of REQ-011.

**Superseded (2026-11-22)**: the operator chose to build it now (D15). ADR-007 records how, and the direct `bot_run_result` row is gone.
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

<!-- ANCHOR:adr-006 -->
## ADR-006: Dispatch receipts live under the user-level state root

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Operator decision D14, 2026-11-22: move dispatch receipts out of the run folder to the user-level state root. Verbatim answer: "Move receipts out" |

---

<!-- ANCHOR:adr-006-context -->
### Context

The audited deep-loop runner writes a pair of dispatch receipts per invocation, an intent and a completion. Each records the command and its arguments. Cursor, Claude Code, Devin and Pi take the prompt on argv (`EXECUTOR_ADAPTER_CAPABILITIES[kind].promptChannel` in `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`), so for those kinds a receipt holds the whole prompt. The first build wrote receipts into the run folder's `receipts/`, inside the Skilled tree, which the child can read and which REQ-005 says holds no command line. The build left the question open: does a receipt count as a log?
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: Receipts go to `<state root>/<identity key>/receipts/<run id>/`, named by `receiptFolder` in `runtime/lib/state-root.ts`, owner-only like every other user-level folder. The run folder keeps the ledger, the observability stream and the child's own output, and holds no `receipts/`. The record's `evidence.receiptDir` points at the new folder. REQ-001, T012 and AC-006 are amended to match: the run folder holds the evidence a child may read, and the receipts are the one evidence pointer outside it.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Move receipts to the user-level state root (chosen)** | No deep-loop change. Receipts keep their full audit value | One evidence pointer leaves the run folder | 8/10 |
| Redact the prompt in the deep-loop receipt | Run folder stays whole | Changes a shared deep-loop format other callers read | 4/10 |
| Refuse argv kinds for bots | No prompt on argv at all | Drops Claude Code, Devin and Pi for read-only bots | 3/10 |

**Why this one**: The operator chose it, and it touches no shared file.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- No file in the run folder holds the prompt or the command line, for any admitted kind.

**What it costs**:
- A status reader follows one pointer outside the run folder. Mitigation: the pointer is in the record, like every other.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The child reads the receipts folder | M | It sits under the user-level state root, which the child is not told about and does not inherit through `XDG_STATE_HOME` |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**: `receiptFolder` and the `receipts` folder in `state-root.ts`, and the runner's evidence pointers.

**How to roll back**: Point `receiptDir` back at the run folder. AC-006 then reopens for argv kinds.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: The run result event goes through the append gateway, with replay as the retry

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Operator decision D15, 2026-11-22. Verbatim answer: "Build it now". Supersedes ADR-004 and widens the frozen scope by the deep-loop files named below |

---

<!-- ANCHOR:adr-007-context -->
### Context

ADR-004 chose retry by ledger replay through `appendModeEvent` in `.skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts`, and the first build could not wire it: the gateway needs an event registry, a transition policy, an authority root and a cutover binding. Reading the gateway shows the caller supplies four of those itself: the ledger and its event registry, the policy registry and the authorization gateway, the authority root (`options.authorityRoot`) and the binding (`options.binding`). One thing it does not let a caller supply is mode admission. The gateway refuses any mode outside `AUTHORITY_FLIP_MODE_ORDER` (`append-mode-event.ts:493`), and the selector refuses any authority record whose mode is outside the same list (`per-mode-authority-flip/authority-selector.ts:21`). That list is the frozen cutover order of the deep modes, and the CLI test iterates it, so the bots mode cannot simply join it.

Callers checked before any shared edit, with `rg` over `.skilled/skills/system-deep-loop/`:
- `appendModeEvent`: `scripts/append-mode-event.cjs`, `lib/mode-append-gateway/index.ts`, `tests/unit/mode-append-gateway.vitest.ts`, `tests/integration/deep-research-postflip-fanout.vitest.ts`, plus the gateway README and two feature-catalog pages. `lib/deep-loop/executor-audit.ts` reaches it only through `appendThroughGateway`, for state logs beside a `deep-review-ledger` or `deep-research-ledger` folder, which the bots ledger never is.
- The mode order and its type (`AUTHORITY_FLIP_MODE_ORDER`, `CutoverCertificateMode`, `isValidAuthorityRecord`, `selectAuthorityRoute`): `lib/per-mode-authority-flip/` (types, selector, registry, index), `lib/deep-research-authority/composition.ts`, `lib/mode-append-gateway/append-mode-event.ts`, `scripts/append-mode-event.cjs`, `scripts/verify-authority.cjs`, and the tests `append-mode-event-cli.vitest.ts`, `mode-append-gateway.vitest.ts` and `per-mode-authority-flip.vitest.ts`.
- The mode event registries and policy registry (`createDeepResearchEventRegistry`, `createDeepReviewEventRegistry`, `TransitionPolicyRegistry`): the two ledger-schema modules, `lib/authorized-ledger/`, the gateway, the append CLI and their tests. The bots registration builds its own instances and changes none of them.
<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We chose**: A bots-owned registration in `.skilled/skills/system-skilled-bots/runtime/lib/result-ledger.ts`: one event type `skilled-bots.run.result-recorded`, one allow policy, an authority root at `<state root>/authority` (`sharedStatePaths().authority`), and a binding from `resolveCutoverBinding` against the checkout's HEAD. The deep-loop change is the one seam the gateway lacks: a second list, `AUTHORITY_CALLER_MODES`, holding `system-skilled-bots`. The gateway and the selector admit `AUTHORITY_ADMITTED_MODES`, the flip order plus the caller modes. `AUTHORITY_FLIP_MODE_ORDER` itself is unchanged, so the flip order, the append CLI, its routability test and `verify-authority.cjs` see nothing new.

**How it works**: The runner binds the result ledger before dispatch; a checkout with no HEAD commit is refused as `result-ledger-unbound` before any child runs. After the child exits, the runner prepares one result event, keyed by the idempotency key `<run id>:result`, and sends it through `appendModeEvent`. A failed write is retried by re-sending the same prepared event, never by dispatching again. The gateway stores a re-sent event once and returns the original receipt. An event that still fails after the replays ends the run as a failure classed `hub`, `result-event-unrecorded`.
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Caller-mode list beside the flip order (chosen)** | Flip order, CLI and verify script untouched. Bots owns its registry and policy | Four deep-loop source files (types, index, selector, gateway) and two READMEs change | 8/10 |
| Add the bots mode to `AUTHORITY_FLIP_MODE_ORDER` | One list | The CLI test requires every order mode to route through the CLI, so the CLI would need a bots adapter, a deep-loop import of the bots skill | 3/10 |
| Keep the direct ledger row, supersede REQ-011's gateway part | No shared edit | The operator chose to build it | 2/10 |

**Why this one**: It is the smallest change that lets a caller outside deep-loop use the gateway, and it keeps the deep modes' frozen order frozen.
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

**What improves**:
- A re-sent result event is stored once, so a retry never duplicates the audit chain, and one run keeps one dispatch receipt pair.

**What it costs**:
- `runBot` is now async, because the gateway is. Phase 5's drain awaits it.
- A checkout with no commit cannot run a bot. Mitigation: the refusal names the cause.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The deep-loop edit changes a deep mode | M | The flip order is unchanged. The whole deep-loop suite runs before and after |
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**: `result-ledger.ts` and the runner in the bots skill. In deep-loop: `lib/per-mode-authority-flip/types.ts` (the union and the two lists), `lib/per-mode-authority-flip/index.ts` (exports), `lib/per-mode-authority-flip/authority-selector.ts` (`MODE_SET`), `lib/mode-append-gateway/append-mode-event.ts` (the admission check), and the two READMEs that name the check.

**How to roll back**: Revert the deep-loop lines and the runner's gateway call. The runner then has no result event path, which is the state ADR-004 recorded.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: OpenCode and Mistral Vibe run read-only bots through a tool-narrowing profile

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Operator decision, 2026-11-22, relayed by the orchestrator without a D number. Verbatim answer: "Support read-only now". Supersedes the OpenCode and Mistral Vibe refusal in ADR-002's as-built note, and widens the frozen scope by the deep-loop files named below |

---

<!-- ANCHOR:adr-008-context -->
### Context

The first build refused OpenCode and Mistral Vibe for every sandbox class. `finalizeLineageCommand` in `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` threw on a read-only OpenCode lineage, because its Bash tool can write anywhere, and `buildVibeLineageCommand` passed no confinement and recorded `resolvedSandbox: null`. Both CLIs can narrow their tools, which the operator chose to use. The option text: "Add a read-only tool-narrowing profile to both deep-loop builders, admit both kinds for read-only bots only, and run one approved live probe per CLI showing a write is refused before the row reads Met."

The tool names and keys were confirmed from each CLI, not guessed. No model was called:
Two of these went past the brief's literal allowance of `--help`: `opencode debug agents --standalone` starts a private OpenCode server, and `vibe config schema` prints Vibe's config schema. Neither calls a model.
- OpenCode 2.3.2: the permission keys come from `opencode debug agents --standalone`, run from the worktree root with the read-only inline config, shows the v1 permission map translated on the default `build` agent: `edit` and `write` become two `edit` denies, `bash` a `shell` deny, `task` a `subagent` deny, after the project's own allows (`scratch/opencode-permission-probe.txt`). The v1-to-v2 translation (`write`/`edit`/`patch` to `edit`, `bash` to `shell`, `task` to `subagent`) matches the earlier research in `specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/research/iterations/iteration-005.md` and `iteration-008.md`. The cli-opencode skill references do not name these keys.
- Mistral Vibe 3.1.2: the flag comes from `vibe --help`, which documents `--enabled-tools`, "Enable specific tools (headless: disables all others). Repeat the flag", and the tool names come from `vibe config schema`, whose builtin tools include `read_file` and `grep` as the read tools (`scratch/vibe-tool-names.txt`). The repository's hook fixture records payload names qualified, such as `file_system.read_file`, so whether `--enabled-tools` matches the bare names is confirmed only by the live probe's token read. `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/cli-reference.md` names the same flag.
- OpenCode's `--format json` stream shape was read from a committed real capture, `specs/system-deep-loop/loop-architecture/003-deprecate-improvement-modes/001-removal-research/001-model-benchmark-inventory/research/lineages/deepseek/logs/fanout-lineage.out`: a `text` event carries one text part of an assistant message in `part.text`, with its `part.messageID`. No deep-loop reader for its final answer existed, so the bots runtime adds one.

Callers checked before any shared edit, with `rg` over `.skilled/skills/`:
- `buildOpencodeLineageCommand` and `buildVibeLineageCommand` are reached only through `buildLineageCommand` and its adapter table in `fanout-run.cjs`. `buildLineageCommand` is called by `fanout-run.cjs` itself (the fan-out lineage loop), `scripts/dispatch-iteration.cjs` (six call sites, the OpenCode ones passing the builder's `env` as `dispatchEnv`), the bots `lib/dispatch.ts`, the deep-research and deep-review workflow YAMLs (which name it in prose), and the tests `executor-adapter-capabilities.vitest.ts`, `combo-matrix.vitest.ts`, `fanout-run.vitest.ts`, `fanout-executable-version.vitest.ts`, `executor-branch-contract.vitest.ts`, `opencode-dual-dispatch.vitest.ts`, `fanout-effective-config.vitest.ts`, `fanout-claude-stream-json.vitest.ts` and `tests/stress/cli-adapter/` (`cli-mistral-vibe.vitest.ts`, `cli-codex.vitest.ts`, `fixtures/adapter-suite.ts`). The whole deep-loop suite ran before and after, so a caller that pinned the old behavior and was not edited would have failed. `buildVibeLineageCommand` is also exported to `fanout-run.vitest.ts`.
- The read-only refusal was pinned by `fanout-run.vitest.ts` (the OpenCode config-merge test), `combo-matrix.vitest.ts` (a rejected branch and the rejected count), `dispatch-iteration.vitest.ts` (a refusal case), and `executor-adapter-capabilities.vitest.ts` (the `auto-approve-flag` branch). Vibe's missing sandbox was pinned by `executor-config.vitest.ts` (field support and a sandboxMode rejection) and `fixtures/adapter-suite.ts` (a null read-only config).
- `sandboxSurface` is read only by `executor-adapter-capabilities.vitest.ts` and the bots `lib/posture.ts`. `EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY` is unchanged for both kinds.
<!-- /ANCHOR:adr-008-context -->

---

<!-- ANCHOR:adr-008-decision -->
### Decision

**We chose**: A read-only profile in each deep-loop builder, recorded as a compensating control and never as an OS sandbox, and admission of both kinds for read-only bots only.

**How it works**:
- **OpenCode.** A read-only lineage gets `OPENCODE_CONFIG_CONTENT` with a `permission` allowlist: `"*": "deny"` first, then `read`, `grep`, `glob` and `list` allowed, then the `external_directory` deny workspace-write already had. The rules are merged into any inherited config and written after its permission keys, so an inherited allow cannot reopen a tool. The same rules go under `agent.build.permission`, the lineage passes `--agent build`, and the builder refuses the lineage unless OpenCode resolves that agent with every non-read action denied (third review, below). `effectiveConfig` records `sandboxMode: read-only` and `sandboxEnforcement: compensating`. workspace-write and danger-full-access build as before, except that the `external_directory` deny is now always written last, which only tightens an inherited config that listed it first. Its `sandboxSurface` becomes `permission-config`, which replaces the now unused `auto-approve-flag`. The first build's profile was a deny list of `edit`, `write`, `bash` and `task`; the third review replaced it.
- **Mistral Vibe.** A read-only lineage adds `--enabled-tools read_file --enabled-tools grep` and sets `SPECKIT_DIST_AUTO_REBUILD=0` in the child, because the repository's session-start hook otherwise rebuilds stale dist output in the checkout, lifecycle code no tool allowlist stops (the fan-out already sets it for every Vibe lineage, and Pi's read-only `--no-extensions` is the same kind of guard). It is recorded as `sandboxMode: read-only`, `sandboxEnforcement: compensating`. Every other value builds as before and records `null`. Its `sandboxSurface` becomes `tool-allowlist`. `sandboxMode` joins its supported fields, and `parseExecutorConfig` accepts `read-only` as its only value, so a fan-out config that names a write-capable mode for Vibe is still refused.
- **Bots runner.** `posture.ts` admits the `permission-config` surface beside `permission-mode` and `tool-allowlist`, for read-only only. `dispatch.ts` now forwards the builder's `env` to the audited runner as `dispatchEnv` and runs the child in the builder's `cwd`, because the OpenCode denies and Vibe's lineage home travel there. A Vibe run gets a private temp lineage folder, outside the run folder (which must hold no prompt) and the state root (whose path the child is never told); after the run the runner copies Vibe's `export.json` beside the receipts as `vibe-export.json` and removes the folder. `executor-audit.ts` admits `VIBE_HOME` and `SPECKIT_DIST_AUTO_REBUILD` in `DISPATCH_ENV_KEYS` for Vibe. OpenCode's final answer is read as the text parts of the last message that printed any.
<!-- /ANCHOR:adr-008-decision -->

---

<!-- ANCHOR:adr-008-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Tool-narrowing profile in the shared builders (chosen)** | One profile for every caller; recorded as compensating, never as a boundary | Changes shared deep-loop builders and their tests | 8/10 |
| Narrow the tools only in the bots runner | No shared edit | The command line is the deep-loop runtime's own; a second builder would drift from it | 3/10 |
| Keep both kinds refused | No change | The operator chose to support read-only now | 2/10 |

**Why this one**: The operator chose it, and it keeps one command builder per kind.
<!-- /ANCHOR:adr-008-alternatives -->

---

<!-- ANCHOR:adr-008-consequences -->
### Consequences

**What improves**:
- Read-only bots can run on OpenCode and Mistral Vibe, and a fan-out lineage can ask either for read-only.

**What it costs**:
- A read-only OpenCode or Vibe run is confined by a tool gate inside the CLI, not by the OS. Mitigation: every record says `compensating`, and both stay `false` in `EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY`.
- A Vibe child runs in its temp lineage folder, not the checkout, as every Vibe lineage does. Its read tools reach the checkout only by absolute path, under Vibe's `outside_workdir` policy (default `ask`, which `--auto-approve` answers). A read-only Vibe bot that relies on relative paths will not find the checkout. Not changed here.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A project agent's own rules come after the top-level inline rules and can re-allow edit and shell (`agent.build.permission` in `opencode.json`, or `.opencode/agent/build.md`) | H | Fixed in the third review: the inline config writes the read-only rules under `agent.build` too, which OpenCode applies after every project agent rule; the lineage passes `--agent build`, so a project `default_agent` cannot pick another agent; and the builder resolves the agent before dispatch and refuses unless every non-read action ends on a deny (`scratch/opencode-agent-probe-after.txt`, `scratch/opencode-builder-probe-after.txt`) |
| A Vibe tool name changes in a later release | M | The builder pins `vibe 3.1.2` and refuses any other version |
| Vibe's `export.json` judges completion and the bots runner does not read it | M | Fixed in the third review: a clean exit is judged by deep-loop's own `validateVibeCompletion` before the lineage folder is removed, and an unfinished export fails the run as `vibe-run-unfinished` |
| The narrowing does not hold on a real child, or Vibe's tool names match nothing and the child runs with no tools | H | AC-024 and AC-025 stay Unmet until the approved live probe shows a committed token read and a write refused |
| Other lifecycle code in a consumer repository writes outside the tools (an OpenCode plugin, a Vibe hook other than the dist rebuild) | M | Not covered by the tool narrowing; the live probe runs on a scratch repository with none |
<!-- /ANCHOR:adr-008-consequences -->

---

<!-- ANCHOR:adr-008-impl -->
### Implementation

**What changes**: In deep-loop: `scripts/fanout-run.cjs` (the refusal removed, the two read-only profiles, Vibe's rebuild switch, the warning text and two comments; in the third review, the OpenCode allowlist, the agent-level rules, `--agent build`, the agent resolver and its refusal, and the exports `OPENCODE_READ_ONLY_UNCONFINED` and `opencodeReadOnlyGap`), `lib/deep-loop/executor-config.ts` (the two surfaces, the surface union, Vibe's `sandboxMode` support and its read-only-only check, and the capability notes), `lib/deep-loop/executor-audit.ts` (`VIBE_HOME` and `SPECKIT_DIST_AUTO_REBUILD` in Vibe's `DISPATCH_ENV_KEYS`), and the six test files named in spec.md. In the bots skill: `lib/posture.ts`, `lib/dispatch.ts`, the opencode and vibe stub executors and the runner, posture and dispatch tests.

**How to roll back**: Revert the deep-loop lines and the bots `posture.ts` surface entry. The OpenCode builder then refuses read-only again and Vibe records no sandbox, and the posture matrix refuses both kinds, which is ADR-002's first as-built state. To roll back only the third review's OpenCode check, revert `assertOpencodeReadOnlyConfined` and its call, the `--agent` argument and the agent-level rules in `fanout-run.cjs`, and the `read-only-unconfined` cause in the bots runner, with the tests that assert them.

### Third review (2026-11-22)

The operator answered the second review with "Fix all, third review", choosing: "One builder fixes the four P1s at the source: OpenCode read-only becomes an allowlist ('*': deny, then read/grep/glob/list); refuse read-only OpenCode unless the resolved agent (opencode debug agents, no model call) denies every write action; judge Vibe through deep-loop's existing validateVibeCompletion; name the checkout path in the Vibe prompt. Also the three minor findings."

Each finding was reproduced before its fix:
- **The deny list let every unlisted tool run.** `scratch/opencode-agent-probe-before.txt` resolves the old profile with `opencode debug agents --standalone` (OpenCode 2.3.2, no model call) in four scratch repositories: the last rule for `webfetch`, `question` and an MCP-style tool name is the default `*:*=allow`. The new evaluator, run over those resolutions, reports `agent build has no catch-all deny`.
- **A project agent block re-allowed edit and shell.** The same probe shows `shell:*=allow` and `edit:*=allow` last on `build` for a project `agent.build.permission` and for a `.opencode/agent/build.md` frontmatter.
- **Vibe was judged by its exit alone.** A stub that exits 0 with an export saying `exit_code: 1` recorded `completed` (`scratch/negative-controls-third-review.txt`).
- **The Vibe child was never told the checkout path**, and the three minor findings: each new test failed against the unfixed code first, in the same file.

What changed:
- **The allowlist.** Read-only is `"*": "deny"`, then `read`, `grep`, `glob`, `list` allowed, then `external_directory` denied. OpenCode applies the last matching rule, so the key order is the policy. The four read keys are v1 permission keys OpenCode passes through by name; the strings of the OpenCode binary show its built-in `explore` agent naming `read`, `grep` and `glob` as permission actions. No v2 rule named `list` was seen there, so `list` is kept for v1 compatibility; an unknown name loses a tool and cannot open one.
- **Agent-level rules and `--agent build`.** The probe proved that OpenCode applies the inline `agent.build.permission` after a project's `agent.build.permission` and after a markdown agent file, and after same-key project rules, since each source keeps its own rule list (`scratch/opencode-agent-probe-after.txt`). So the read-only rules are written there too, kept per the operator's "keep that only if the probe proves it wins". `debug agents` does not say which agent is the default, so the lineage names `--agent build` and a project `default_agent` cannot choose another one.
- **The resolver check, in the builder.** Before a read-only OpenCode command is returned, `buildOpencodeLineageCommand` runs `opencode debug agents --standalone` in the child's working folder and with the child's environment (the per-kind allowlist over the caller's environment, plus the inline config), and refuses with `OpencodeReadOnlyUnconfinedError` unless the `build` agent has a catch-all deny and no later rule that is not a deny, except for a read action. An `ask` counts as an allow, since `--auto` approves it. It is in the shared builder, so the bots runner, the fan-out lineages and `dispatch-iteration` all get it; the error keeps `code: INPUT_VALIDATION`, so no caller's exit mapping changes. The bots runner records it as the refusal `read-only-unconfined`, class `environment`, exit 4. The probe wrote nothing into the scratch repositories. One resolve took 0.86 s, measured once.
- **Vibe.** A clean Vibe exit is judged by deep-loop's exported `validateVibeCompletion(0, lineageDir)` before the lineage folder is removed; a non-null message fails the run as `vibe-run-unfinished`, class `environment`, with the message in the observability stream. A kind that starts in a lineage folder gets one prompt line naming the checkout's absolute path.
- **Minor findings.** A throw after the lease is taken, or after the seed exists, now ends in one record and releases the lease. A parked run whose result event cannot be recorded keeps `needsYouItemId` on its failed exit, which needed a narrow contract change in `run-record.ts` (`RESULT_EVENT_UNRECORDED` may carry the item id). A needs-you folder that exists but cannot be listed holds the bot as `needs-you-unlistable`, and `bots inbox` reports it instead of printing an empty inbox.

Deviation: the operator's option expected the `agent.build.permission` fixture to end refused before dispatch. With the agent-level rules kept, as the same option allowed when the probe proves they win, OpenCode resolves that fixture with every non-read action denied, so the builder admits it, and the live probe passes it on no write, either admitted or refused (`scratch/oc-gate-e2e.txt`, which reached the dispatch shim for all four fixtures with no model call). No OpenCode 2.3.2 config found here beats the inline agent rules; tried were a project agent block, a markdown agent, same-key project rules, a `default_agent`, a plugin `config` hook and a broken `opencode.json`. The refusal path is proven by stubbed resolver output in the bots and deep-loop tests and by a mutation control that switched the check off (`scratch/negative-controls-third-review.txt`).

Side effects recorded, not changed:
- `read: allow` comes after OpenCode's default `*.env` ask rules, so it overrides them. Under `--auto` an ask was already approved, so the run behaves the same.
- The `question` and `webfetch` tools are now denied for read-only. A headless run has nobody to answer a question.
- Every read-only OpenCode build now spawns `opencode debug agents` once. A test that builds one must inject `resolveOpencodeAgents` or give its stub binary a `debug agents` answer; four deep-loop tests and the bots stub were updated so.
<!-- /ANCHOR:adr-008-impl -->
<!-- /ANCHOR:adr-008 -->

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
| Q009 | Move dispatch receipts out of the run folder to the user-level state root | Operator answer D14, 2026-11-22 | Receipts in the run folder's `receipts/` | ADR-006, REQ-001, REQ-005, T012, AC-006 |
| Q010 | Build retry by ledger replay through the append gateway now | Operator answer D15, 2026-11-22 | ADR-004 and its blocked T014 | ADR-007, REQ-011, T014, AC-008 |
| Q011 | Support read-only bots on OpenCode and Mistral Vibe now, through a tool-narrowing profile in both deep-loop builders, with one approved live probe per CLI before the live rows read Met | Operator answer, 2026-11-22 | The OpenCode and Mistral Vibe refusal in ADR-002's as-built note | ADR-008, REQ-023, T039 to T044, AC-022 to AC-025 |
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
- **Q009** (D14, the receipts question): "Move receipts out". Operator decision 2026-11-22: move dispatch receipts out of the run folder to the user-level state root.
- **Q010** (D15, the gateway replay question): "Build it now".
- **Q011** (the OpenCode and Mistral Vibe question, relayed without a D number): "Support read-only now". Offered option text: "Add a read-only tool-narrowing profile to both deep-loop builders, admit both kinds for read-only bots only, and run one approved live probe per CLI showing a write is refused before the row reads Met."

Only the chosen answers, and the one option text above, reached this phase. The other offered options were not recorded here.
<!-- /ANCHOR:operator-answers-verbatim -->

---
