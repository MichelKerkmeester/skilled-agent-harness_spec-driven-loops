---
title: "Decision Record: Gateway [system-deep-loop/036-deep-loop-innovation/015-gateway-contract-remediation/decision-record]"
description: "Architecture decisions for reconciling the deep-loop state-write contract to a single canonical path (the append gateway): the north-star write path, the P0 resolution direction, the ai-council MCP staleness, and the conformance-guard hardening approach."
trigger_phrases:
  - "gateway contract remediation adr"
  - "single canonical state-write path decision"
  - "projection refresh vs gateway receipt decision"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/015-gateway-contract-remediation"
    last_updated_at: "2026-08-25T14:10:00Z"
    last_updated_by: "claude"
    recent_action: "Authored ADR-001..004 for the remediation"
    next_safe_action: "Author plan.md and tasks.md"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    completion_pct: 0
    open_questions:
      - "ADR-002 direction A vs B pending confirmation of 012's projection-refresh intent."
    answered_questions:
      - "Canonical write path = the append gateway (ADR-001, already established by 012/013)."
---
# Decision Record: Gateway State-Write Contract Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The append gateway is the single canonical state-write path

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-25 |
| **Deciders** | Operator (via 012/013 lineage; reaffirmed here) |

---

<!-- ANCHOR:adr-001-context -->
### Context

`012-runtime-enablement` made the typed event ledger authoritative for all deep-loop modes and turned each `*-state.jsonl` into a projection the gateway refreshes. `013` migrated the leaf agent persona files to that model. The `014` review found the remaining artifacts (prompt-packs, runtime wiring for review/alignment, SKILLs, guard) still describe or permit a direct write, producing the P0 contradiction. Before fixing the surfaces, the north-star contract must be stated once so every workstream measures against the same target.

### Constraints

- The gateway's guarantees (authorization, fencing, receipt, projection refresh) hold only when it is the actual write path; any direct `>> *-state.jsonl` write bypasses all four.
- The change must not introduce a "gateway-else-direct-write" fallback anywhere; a refused append (exit 2) is a halt, not a cue to redirect.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: The append gateway (`append-mode-event.cjs`) is the one canonical state-write path for every deep-loop mode. Every artifact a dispatched leaf touches — prompt-pack template, agent persona, SKILL, YAML — must instruct or permit only the gateway. Non-gateway artifacts may *describe* the state log as a read-only projection, never as a write target.

**How it works**: Exit 0 from the gateway = durable in the ledger (and, once WS1 lands, reflected in the projection); exit 2 = refused → the leaf halts and names the failed check. No artifact offers a direct-write alternative.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Gateway is the sole path (chosen)** | Preserves all four gateway guarantees; matches 012/013 intent | Requires fixing every adjacent artifact (this packet's work) | 9/10 |
| Allow direct append as a documented fast path | No prompt-pack rewrite | Reintroduces the exact unauthorized/unfenced/unreceipted write 012 removed; diverges projection from ledger | 1/10 |
| Per-mode split (gateway for research, direct for review/alignment) | Smallest change | Institutionalizes the current contradiction; two contracts to reason about | 2/10 |

**Why this one**: 012 and 013 already committed the repo to the gateway model; the only coherent completion is to make the remaining artifacts obey it, not to carve out exceptions that reopen the bypass.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- One write contract across every artifact; a leaf cannot both obey its instructions and bypass the gateway.
- The conformance guard gains a single, checkable rule to enforce.

**What it costs**:
- Every adjacent surface must change (WS1–WS6); the prompt-pack rewrite touches live runtime.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A missed artifact keeps instructing a direct write | H | WS6 extends the guard to scan prompt-packs/YAMLs, closing the surface that hid the P0 |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The P0 is a shipped contradiction; a single north-star path is the precondition for fixing it coherently |
| 2 | **Beyond Local Maxima?** | PASS | The per-mode-split and documented-fast-path alternatives were weighed and rejected, not assumed |
| 3 | **Sufficient?** | PASS | One path is the minimum contract; no additional mechanism introduced |
| 4 | **Fits Goal?** | PASS | Completes the 012/013 gateway model rather than diverging from it |
| 5 | **Open Horizons?** | PASS | Leaves room for future modes to adopt the same single-path rule without restructure |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**: All WS1–WS6 target surfaces are measured against this rule; the guard (WS6) enforces it mechanically.

**How to roll back**: Nothing lands at plan time. During build, each workstream reverts independently via `git restore`; ADR-001 itself is a statement of intent with no artifact of its own.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Make gateway-only review/alignment writes pass validation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted — Direction A (operator-selected 2026-08-25) |
| **Date** | 2026-08-25 |
| **Deciders** | Operator (chose A) + runtime intent check (T001, confirming) |

> **Operator decision (2026-08-25): Direction A.** The build still runs the T001 intent check first as the gate: it confirms a review/alignment legacy-projection consumer exists before the runtime edit. If T001's evidence contradicts A (no consumer — refresh was deliberate), that is a Logic-Sync stop, not a silent switch to B; the operator is re-consulted.

---

<!-- ANCHOR:adr-002-context -->
### Context

This is the pivotal P0 decision. `append-mode-event.ts` refreshes the legacy projection only for `mode==='research'` (branches at :191,205); `verify-iteration.cjs:167` requires the iteration record to be present in the state-log projection. So a review/alignment leaf writing only through the gateway never lands in the projection the validator reads → `state_record_missing` → redispatch. Fixing the prompt-packs to call the gateway (WS1/T1) is necessary but not sufficient — without this decision, the gateway-clean leaf still deadlocks.

### Constraints

- We do not yet know whether 012 left review/alignment projection-refresh unwired **deliberately** (the review YAML says "Exit 0 … means durable in the ledger, and nothing more") or simply **unfinished**. That intent determines which direction is correct.
- Whichever direction, exit 2 must remain a halt; neither direction may add a direct-write fallback.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose (recommended, pending intent check)**: **Direction A — wire the gateway's legacy-projection refresh for review and alignment**, extending the research-only branch so a gateway append lands in the state-log projection, satisfying `verify-iteration.cjs` unchanged.

**Gating condition**: the build MUST first confirm whether review/alignment have a legacy-projection consumer. If they do → Direction A. If they provably do not (refresh was skipped by design) → fall back to **Direction B**: change `verify-iteration.cjs` to accept a gateway receipt (the ledger record, `latest-record-wins` already present at :165-170) as proof, so the validator no longer depends on projection refresh. The direction is not hard-coded in the plan; T2 carries the check first.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A — wire review/alignment projection refresh (recommended)** | Keeps `verify-iteration`'s "record in state log" contract intact; projection stays the uniform read surface across modes | Extends runtime the review flagged as deliberately research-only; must confirm intent first | 7/10 |
| **B — validator accepts a gateway receipt** | No runtime projection change; smallest runtime delta | Splits the validator's contract by mode; two proof shapes to maintain | 6/10 |
| Do nothing to the runtime, only fix prompt-packs | Least code | Leaves the deadlock — gateway-clean leaves still fail `state_record_missing` | 1/10 |

**Why this one (conditionally)**: A is more faithful to the uniform "projection is the read surface" model 012 established, so it is preferred *if* a consumer exists. But because the review surfaced evidence the omission may be deliberate, the decision is explicitly gated on a build-time intent check rather than asserted — a Logic-Sync point, not a guess.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**: A gateway-only leaf writes durably AND passes validation, closing the deadlock half of the P0.

**What it costs**: Direction A touches `append-mode-event.ts`'s projection pipeline; Direction B touches the validator. Either is live runtime and needs a negative-control dispatch proving the deadlock before and its absence after.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Wiring A contradicts a deliberate 012 design | H | Gate on the intent check in T2; escalate via Logic-Sync if evidence conflicts with the recommendation |
| B leaves the projection permanently stale for review/alignment | M | Document that the projection is non-authoritative for those modes and that consumers must read the ledger |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without it the gateway-clean leaf deadlocks; prompt-pack fix alone is insufficient |
| 2 | **Beyond Local Maxima?** | PASS | Two real directions weighed; the do-nothing option shown to leave the deadlock |
| 3 | **Sufficient?** | PASS | Either direction fully removes the `state_record_missing` deadlock for gateway-only writes |
| 4 | **Fits Goal?** | PASS | Directly resolves the P0's runtime leg |
| 5 | **Open Horizons?** | CONDITIONAL | Gated on the intent check; the ADR is amendable in place if the check flips the direction |

**Checks Summary**: 4/5 PASS, 1 conditional (intent-gated)
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**: Direction A → `append-mode-event.ts` projection-refresh branch extended to review/alignment. Direction B → `verify-iteration.cjs` accepts a gateway receipt. Decided by T2's intent check.

**How to roll back**: The chosen file is reverted via `git restore` (pre-merge) or a scoped revert (post-merge); the projection/validator returns to its current research-only shape.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Remove the decommissioned sequential_thinking mandate from ai-council

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-08-25 |
| **Deciders** | Operator (pending) |

---

<!-- ANCHOR:adr-003-context -->
### Context

`AGENTS.md:391` declares the Sequential Thinking MCP server decommissioned. ai-council prompts across runtimes still mandate it (`.opencode/agents/ai-council.md:22`, and throughout `.claude`/`.pi` copies), and `.claude/agents/ai-council.md:4` lists `mcp__sequential_thinking__*` in its tool grant. The review notes "only .pi still registers it," which leaves open whether `.pi/mcp.json` holds a stale entry or a genuinely live local server.

### Constraints

- Removing a tool a runtime genuinely still serves would strip a real capability; keeping a dead mandate makes ai-council instruct an unreachable tool.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Remove the `sequential_thinking` mandate and tool grant from ai-council prompts and metadata in every runtime where the server is gone, and replace the "Depth 1 = sequential_thinking" mechanism with the runtime-appropriate in-context sequential deliberation. Gate the `.pi` copy on inspecting `.pi/mcp.json`: remove if the registration is stale; keep (and document) only if it backs a live local server.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Remove where dead, keep where live (chosen)** | Truthful per-runtime state; no dead mandate, no lost live capability | Requires inspecting `.pi/mcp.json` | 9/10 |
| Re-register the server fleet-wide | ai-council prompts need no change | Resurrects a deliberately decommissioned server; contradicts AGENTS.md | 2/10 |
| Remove everywhere unconditionally | Simplest | Risks stripping a genuinely live `.pi` local server | 4/10 |

**Why this one**: it matches each runtime's actual state rather than assuming a uniform one.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**: ai-council stops mandating an unreachable MCP; its Depth-1 path becomes executable everywhere.

**What it costs**: The Depth-1 deliberation mechanism must be re-expressed without the MCP in the affected runtimes.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A runtime's live local server is removed | M | Inspect `.pi/mcp.json` before removing that copy |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A mandated tool that no longer exists is a live defect in the prompt |
| 2 | **Beyond Local Maxima?** | PASS | Re-registration and unconditional-removal both weighed |
| 3 | **Sufficient?** | PASS | Per-runtime removal + in-context fallback fully closes the finding |
| 4 | **Fits Goal?** | PASS | Closes F-001 |
| 5 | **Open Horizons?** | PASS | Leaves `.pi` free to keep a live server if one exists |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**: ai-council prompts/metadata across runtimes; `.pi/mcp.json` per inspection.

**How to roll back**: `git restore` the ai-council files; re-add the registration if a removal proves wrong.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Harden the conformance guard to fail closed and cover the bypass surface

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-08-25 |
| **Deciders** | Operator (pending) |

---

<!-- ANCHOR:adr-004-context -->
### Context

The `013` guard `check-agent-gateway.sh` is why the P0 slipped past: it scans only the four resolved agent files (not the prompt-packs where the direct-write actually lives), it `|| continue`s past unresolvable agents, and it exits 0 with no assertion that the expected number of agents were actually checked. Its regexes also miss single-`>` truncate, `| tee`, and no-space-backtick `--event-json` shapes.

### Constraints

- The guard must not hard-code a literal count that goes stale when a runtime or agent is legitimately added.
- Extending scan scope must not produce false positives on legitimate read-only references to state-file names.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Make the guard fail closed — derive the expected agent count from the runtime × agent matrix, assert the actual checked count meets that floor, and exit non-zero if any target is unresolvable. Extend its scan to the prompt-pack templates (the surface that hid the P0) and to the mode YAMLs, and extend its write-detection regexes to single-`>`, `| tee`, and no-space-backtick `--event-json` shapes.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Fail-closed + matrix count + extended scan/regex (chosen)** | Closes the exact hole that let the P0 through; future-proof count | More guard code; must tune regexes against false positives | 9/10 |
| Only add the count-floor assertion | Minimal | Leaves the prompt-pack surface unscanned — the P0 would still slip | 3/10 |
| Replace the shell guard with a runtime test | Stronger typing | Larger build; loses the cheap pre-commit grep gate | 5/10 |

**Why this one**: it directly closes the surface and failure-mode that produced the P0 while keeping the cheap guard.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**: A future direct-write reintroduction — in an agent OR a prompt-pack — fails the guard; a missing runtime file fails instead of silently passing.

**What it costs**: Guard maintenance grows; regex tuning needs a small fixture set.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Extended regex false-positives on read-only mentions | M | Target write-verbs and redirect shapes, not any state-file name; test against a fixture of legitimate references |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The guard's fail-open + narrow scope is the root cause the P0 exploited |
| 2 | **Beyond Local Maxima?** | PASS | Count-only and runtime-test alternatives weighed |
| 3 | **Sufficient?** | PASS | Fail-closed + prompt-pack scan + extended regex covers the demonstrated bypass shapes |
| 4 | **Fits Goal?** | PASS | Closes P1-003, P2-001, P2-003 |
| 5 | **Open Horizons?** | PASS | Matrix-derived count adapts to future runtime/agent additions |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**: `check-agent-gateway.sh` — resolver, count assertion, scan scope, regexes; a small fixture of legitimate/illegitimate references for regression.

**How to roll back**: `git restore` the guard script to its `013` form.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->
