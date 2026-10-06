---
title: "Decision Record: v4.0.0.3 review remediation"
description: "Five decisions for the v4.0.0.3 remediation: the child-dispatch exemption, the reclaim read-back, review event routing, heartbeat-judged transient locks, and the R-05 waiver."
trigger_phrases:
  - "child dispatch exemption decision"
  - "stale lock reclaim decision"
  - "review event routing decision"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/069-v4-0-0-3-review-remediation"
    last_updated_at: "2026-10-06T10:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded ADR-001 to ADR-003 during planning"
    next_safe_action: "Implement through /speckit:implement"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e4486fa5-248b-49a4-8970-229354aab7a1"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: v4.0.0.3 review remediation

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Child-dispatch exemption covers every ask-or-wait rule inside the lineage directory

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-06 |
| **Deciders** | Operator (accepted as written on 2026-10-06), planner |

---

<!-- ANCHOR:adr-001-context -->
### Context

`AGENTS.md:61` pre-resolves Gate 3 for a worker marked `AI_SESSION_CHILD=1`, and only Gate 3. The other ask-or-wait rules still bind such a worker: Law 4 and Halt Conditions, Logic-Sync, Escalation and stop-for-yes. In phase 68, GPT-6 Luna applied them literally inside a detached fan-out lineage and ended six turns on a question nobody could answer (`../068-v4-0-0-3-release-deep-review/review/luna-halt-analysis.md` section 4). DeepSeek and SWE 2 read the same rules and kept going. A waiver in the dispatch prompt alone does not hold, because the prompt sits below an `AGENTS.md` line that says it cannot be overridden.

### Constraints

- `AGENTS.md` is a hard-rule document. A change to an exemption there is a governance change, not an edit.
- `check-rule-copies.js` requires 21 anchors to end inside the first 16,384 bytes (Devin's cut). On 2026-10-06 the last one, `#### Blast-Radius Management`, ends at byte 16,359, which leaves 25 bytes. Every byte added at `:61` or `:169` must be offset by an equal trim before that anchor. The `:178` and `:188` clauses sit after it and are free.
- The user-level `~/.claude/CLAUDE.md` copy sits outside the repository and is the operator's to update.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: extend the `AGENTS.md:61` exemption so that, for a bound child, every ask-or-wait rule becomes record-and-continue for actions confined to its lineage directory, while actions outside it stay forbidden.

**How it works**: the bullet names the rules it converts (§1 Law 4 and Halt Conditions, §7 Logic-Sync and Escalation, §3 stop-for-yes). A conflict is recorded in the iteration, and the worker follows the workflow YAML and continues. `AGENTS.md:178` and `:188` gain one clause each pointing back to the exemption. The `:61` rewrite is byte-neutral, because the delivery-prefix guard leaves 25 bytes of room. `fanout-run.cjs` adds a matching non-interactive preamble (F2), so the waiver is both true at the authority Luna obeys and visible in the prompt.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Widen the exemption in `AGENTS.md` plus the prompt preamble** | Fixes the rule at the layer Luna ranks highest; one sentence | Changes a hard-rule document | 8/10 |
| Prompt preamble only (F2 without F1) | No governance change | Loses to the "cannot be overridden" line for a strict reader, so the analysis expects about 3 of 6 stops prevented | 5/10 |
| Drop Luna from fan-out lineages | No rule change | Gives up a model family the operator chose for diversity | 2/10 |

**Why this one**: only the `AGENTS.md` change prevents all six stops counted in the analysis. Confining it to the lineage directory keeps every outside write forbidden.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A detached lineage records a conflict and keeps running, instead of spending its retries on one unanswerable question.

**What it costs**:
- A child can now continue past a Logic-Sync it would have stopped on. Mitigation: it must record the conflict as a finding, so the lead still sees it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A worker reads "record-and-continue" as permission to write outside its directory | H | The bullet states that actions outside the directory stay forbidden, and runner write containment still reports any outside write |
| An anchor moves past the Devin 16 KB cut | H | Write the `:61` bullet byte-neutral, offset by a trim of the same size earlier in the first 16 KB. Keep F3's steer-authority wording in the prompt rather than at `:169`. Rerun `check-rule-copies.js` and require exit 0 |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Six observed stops in phase 68 |
| 2 | **Beyond Local Maxima?** | PASS | Prompt-only and drop-Luna were weighed above |
| 3 | **Sufficient?** | PASS | One bullet plus two clauses |
| 4 | **Fits Goal?** | PASS | Luna lineages are part of the operator's fan-out plan |
| 5 | **Open Horizons?** | PASS | The same exemption serves any strict model in a lineage |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `AGENTS.md:61`, `:178` and `:188`.
- The F2 preamble in `fanout-run.cjs` `buildLoopPrompt`.

**How to roll back**: revert the commit that touches `AGENTS.md`; F2 stands on its own.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: A stale-lock reclaim reads back what it renamed

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-06 |
| **Deciders** | Planner, from the R-03 fix recommendation |

---

<!-- ANCHOR:adr-002-context -->
### Context

`tryReclaimStaleLoopLock` (`loop-lock.ts:298-315`) renames whatever sits at the lock path, then links a fresh lock. It never checks that the renamed file is the stale holder it judged. Two reclaimers that read the same stale holder can both return `acquired: true` (R-03). A host-local single-flight path exists (`:480-497`), but `scripts/loop-lock.cjs:156-163` never asks for it, and refresh and release already verify identity.

### Constraints

- `loop-lock.cjs` loads the TypeScript source through tsx, so the fix lives in `loop-lock.ts` alone.
- The lock must keep working across hosts that share a packet folder, where host-local single-flight gives no guarantee.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: after the rename, read the claimed record and compare its pid, nonce and heartbeat with the stale holder the caller observed. On a mismatch, restore the record untouched and return not-acquired.

**How it works**: this matches the identity check refresh and release already make. A two-reclaimer interleaving test in `loop-lock.vitest.ts` drives the rename order the report describes.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Read-back after rename** | Fixes the reclaim itself for every caller; mirrors refresh and release | A few lines plus a restore path | 8/10 |
| Turn on `hostLocalSingleFlight` from the CLI | One-line change | Holds only on one host, and leaves the library unsafe for any other caller | 5/10 |

**Why this one**: the library is the shared contract, and only the read-back closes the race there.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Exactly one reclaimer wins, which keeps the lock safe once R-22 (ADR-004) makes live locks reachable.

**What it costs**:
- The loser of a race returns not-acquired and the workflow halts fail-closed. Mitigation: that is the correct outcome for a second run on one packet.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A restore after a mismatch races a third writer | L | The restore uses the same exclusive link, so it fails instead of overwriting |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Confirmed P1 R-03 |
| 2 | **Beyond Local Maxima?** | PASS | Single-flight was weighed |
| 3 | **Sufficient?** | PASS | One function changes |
| 4 | **Fits Goal?** | PASS | Required P1 |
| 5 | **Open Horizons?** | PASS | Holds for multi-host packet folders |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `tryReclaimStaleLoopLock` in `loop-lock.ts`, plus a test in `tests/unit/loop-lock.vitest.ts`.

**How to roll back**: revert the commit; the CLI and workflows are untouched.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Review event rows use the reserved review stems, and two pure-bookkeeping rows are pinned

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-06 |
| **Deciders** | Planner, from the R-01 fix recommendation and the architecture explorer's map |

---

<!-- ANCHOR:adr-003-context -->
### Context

The review workflows emit eight `"type":"event"` rows through the append gateway, which has no route for them and exits 1 (`append-mode-event.cjs:462-463`). Six of them already have reserved review stems: `run_resumed`, `run_restarted`, `graph_convergence_evaluated`, `blocked_stop_recorded`, `pause_recorded` and `recovery_started` (`deep-review-ledger-types.ts:596-614`). `config_warning` and `lock_released` have none. Research solves the same problem with a `pinned_bookkeeping` list whose rows are only printed (`deep-research-auto.yaml:110-114`). The review reducer, unlike research, reads these rows back from the state log: `graph_convergence` signals at `reduce-state.cjs:1076-1100`, resume and restart at `:416` and `:468`, pause and stuck recovery at `:507-515`, blocked stop at `:1297`.

### Constraints

- The projection in `deep-review-state-contract.ts:171-181` drops `signals` and `blockers` from `graph_convergence_evaluated`, and maps `pause_recorded` and `recovery_started` to their stem names, not `userPaused` and `stuckRecovery`.
- `DEEP_REVIEW_STEM_PRODUCERS` and its checker must flip each stem from `reserved` to `spoken` when it gains a producer.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: rewrite the six directives in stem form against the reserved stems, flip those stems to spoken, and widen the projection so each row reaches the state log in the shape the reducer reads. Pin `config_warning` and `lock_released` as `bookkeeping_log` rows, as research does, because nothing reads them back.

**Amendment (2026-10-06, work-package design)**: the closed field sets of `graph_convergence_evaluated` and `blocked_stop_recorded` (`deep-review-ledger-schema.ts:306-330`, checked exactly at `:654-659`) have no slot for the graph `signals` and `blockers` the reducer scores from (`reduce-state.cjs:1053-1056`), nor for the blocked-stop gate detail and prose hint. Without them the projection is lossy: the graph score would fall back to a plain mean. The decision therefore includes adding `signals` and `blockers` (graph) and `gateDetail`, `graphBlockerDetail` and `recoveryHint` (blocked stop) as additive data fields. The three confirm-only pivot rows (`pivot_confirm_accepted`, `manualStop`, `pivot_override_accepted`) join the pinned list, because no pivot stem exists and they already fail today.

**How it works**: the `state_write_protocol` block gains a `pinned_bookkeeping` list for the pinned rows. A CLI test renders every remaining directive from both review YAMLs, pipes it to `append-mode-event.cjs --mode review`, and asserts exit 0 and the projected state-log row.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Reserved stems plus two pins** | Uses stems already designed for these rows; restores reducer inputs | Touches the YAMLs, stem table and projection | 8/10 |
| Pin all eight as print-only bookkeeping | Smallest change; ends the exit-1 halts | Leaves the reducer's convergence, resume, pause and blocked-stop reads dead, which is half of R-01's impact | 4/10 |
| A review upcaster in the gateway | YAMLs untouched | Duplicates a mapping the reserved stems already express | 5/10 |

**Why this one**: printing all eight fails because `reduce-state.cjs:1076`, `:416`, `:507` and `:1297` read them from the state log. An upcaster would restate the stem table in a second place.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Default-policy review runs stop exiting 1 on every iteration, and the reducer sees convergence, pause, resume and blocked-stop evidence again.

**What it costs**:
- Three files beyond the YAMLs change. Mitigation: the stem-producer checker and reducer tests cover them.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The projected rows differ from what the reducer expects | M | Assert reducer output on a recorded state log before and after |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Confirmed P1 R-01 |
| 2 | **Beyond Local Maxima?** | PASS | Three routes weighed |
| 3 | **Sufficient?** | PASS | Reuses reserved stems |
| 4 | **Fits Goal?** | PASS | Required P1 |
| 5 | **Open Horizons?** | PASS | Brings review in line with research's declared pins |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `deep-review-auto.yaml`, `deep-review-confirm.yaml`, `deep-review-ledger-types.ts`, `deep-review-ledger-schema.ts` (additive fields), `deep-review-state-contract.ts`, and a new gateway emission test.

**How to roll back**: revert the commit; the gateway's existing branches are unchanged.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: A lock acquired without an owner process is judged by its heartbeat, and every workflow refreshes it

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-06 |
| **Deciders** | Operator (accepted: heartbeat, 30-minute TTL, on 2026-10-06), planner |

---

<!-- ANCHOR:adr-004-context -->
### Context

R-22 is new and was found during work-package design. Every deep-loop workflow acquires its packet lock without `--owner-pid`, so the lock records the `loop-lock.cjs` process itself (`loop-lock.cjs:81-84`), which exits at once. `isStaleLoopLock` treats a dead owner as stale (`loop-lock.ts:563-569`), and no workflow refreshes. A second acquire 160 ms later reclaimed a fresh lock in a lead probe on 2026-10-06. The lock therefore excludes nothing.

### Constraints

- Workflow steps run as separate shell commands in each runtime's tool sandbox. No process that lives as long as the run is portably known to every runtime.
- Records already on disk must keep reading, so the new field is optional.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: when `acquire` gets no `--owner-pid`, the CLI records the owner as transient. `isStaleLoopLock` judges a transient-owner lock by heartbeat age alone. Every workflow acquires with a TTL sized to its iteration timeout and refreshes the lock at the start of each iteration.

**How it works**:
- **Library.** `LoopLockData` gains an optional `ownerKind`, either `process` or `transient`. A transient lock is stale only when its heartbeat is older than twice its TTL.
- **CLI.** `acquire` sets `transient` when it resolves the pid itself.
- **Workflows.** All six pass `--ttl-ms 1800000` to match the 1,800-second iteration timeout. Each adds a refresh step that fails closed on `refreshed:false`.
- **Lock note.** It becomes one factual sentence, the same in both modes: acquire reclaims a stale lock itself and reports it under `reclaimed`. This supersedes the original F5 wording, whose `alive:false` test would always pass for a transient owner.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Transient owner judged by heartbeat, plus a refresh per iteration** | Runtime-agnostic; old records keep reading | A crashed run holds the lock for up to twice the TTL (60 minutes) unless released | 8/10 |
| `--owner-pid "$PPID"` in each workflow | One flag per call | What `$PPID` names depends on each runtime's shell nesting, which cannot be verified here, and a wrong guess leaves the lock either always stale or never stale | 4/10 |
| Leave the lock advisory and document it | No change | Two runs on one packet corrupt its state log | 1/10 |

**Why this one**: it is the only option whose correctness does not depend on runtime process trees.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- A second run on a packet now fails closed, as `step_acquire_lock` already promises (`deep-review-auto.yaml:298`).
- `holdsLiveLoopLock` (`fanout-run.cjs:545`) starts seeing live foreign runs, so write containment works as designed.

**What it costs**:
- A crashed run blocks its packet for up to 60 minutes. Mitigation: `loop-lock.cjs status` shows the holder, and the operator can release it.
- R-03's reclaim race becomes reachable in practice. Mitigation: ADR-002 lands in the same workstream, first.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An iteration outlives twice the TTL without a refresh | M | The TTL is sized to the iteration timeout, and the refresh runs at every iteration start |
| `holdsLiveLoopLock` changes write containment for fan-out | M | WP-E maps `owner_kind` in `fanout-run.cjs:557-561`, with a test |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Probe-proven double acquire |
| 2 | **Beyond Local Maxima?** | PASS | `$PPID` and doc-only weighed |
| 3 | **Sufficient?** | PASS | One optional field, one flag, one refresh step per workflow |
| 4 | **Fits Goal?** | PASS | Mutual exclusion is the lock's stated job |
| 5 | **Open Horizons?** | PASS | Callers that pass a real owner pid keep today's behavior |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- WP-C: `loop-lock.ts` and `loop-lock.cjs`, with tests.
- WP-A: the review YAMLs.
- WP-F: the research and council YAMLs.
- WP-E: the `holdsLiveLoopLock` mapping.

**How to roll back**: revert the three workstream commits. Records written with `owner_kind` are read as `process` by the old code, which is today's behavior.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: R-05 is waived; the salvage row stays a direct, advisory write

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-06 |
| **Deciders** | Planner, from the WP-E design |

---

<!-- ANCHOR:adr-005-context -->
### Context

`fanout-salvage.cjs:170` writes `salvaged_from_stdout` straight into the state log. A later gateway append can rewrite the projection and drop it. No stem exists for it in either the review or the research schema. A gateway route would need a stem in both, plus census, schema, reducer and projection entries, and would make `runSalvageSweep` async.

### Constraints

- The only live consumer is one attribution count (`fanout-merge.cjs:966`).
- The feature catalog documents the direct write as intended (`feature-catalog/state-safety/jsonl-lock-held-merge.md:28`).
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: waive R-05. A short comment above `fanout-salvage.cjs:170` says the row is advisory and a projection rewrite can drop it.

**How it works**: the recovered iteration file, which is the real salvage, is written outside the state log and survives (`fanout-salvage.cjs:161`).
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Waive with a comment** | No schema change | The attribution count can read low after a retry | 7/10 |
| New salvage stems in both schemas | Count survives | About ten files across two schemas for one count | 4/10 |

**Why this one**: the cost of the route is far larger than the one count it protects.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- No schema churn in this packet.

**What it costs**:
- `Salvaged` in `fanout-attribution.md` can under-count. Mitigation: the iteration files remain the source of truth.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later consumer relies on the row | L | The comment names the limitation at the write |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The finding needs a recorded disposition |
| 2 | **Beyond Local Maxima?** | PASS | The gateway route was costed |
| 3 | **Sufficient?** | PASS | One comment |
| 4 | **Fits Goal?** | PASS | The goal allows a recorded waiver |
| 5 | **Open Horizons?** | PASS | Salvage stems remain open as a follow-up |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- One comment in `fanout-salvage.cjs`.

**How to roll back**: delete the comment.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-index -->
## ADR Index

| ADR | Title | Status | Workstreams |
|-----|-------|--------|-------------|
| ADR-001 | Child-dispatch exemption covers every ask-or-wait rule inside the lineage directory | Accepted (operator) | W-H |
| ADR-002 | A stale-lock reclaim reads back what it renamed | Accepted | W-C |
| ADR-003 | Review event rows use the reserved review stems (amended: additive fields, pivot pins) | Accepted | W-A |
| ADR-004 | A lock acquired without an owner process is judged by its heartbeat, and every workflow refreshes it | Accepted (operator) | W-C, W-A, W-F, W-E |
| ADR-005 | R-05 is waived | Accepted | W-E |
<!-- /ANCHOR:adr-index -->
