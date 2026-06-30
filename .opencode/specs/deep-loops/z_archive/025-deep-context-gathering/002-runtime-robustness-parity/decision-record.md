---
title: "Decision Record: deep-context runtime-robustness parity"
description: "Decisions for bringing the host-driven deep-context loop to runtime-robustness parity: in-process tsx import with inline fallback over re-exec, excluding bayesian-scorer and fanout-run as non-gaps, and the host-owner loop-lock caveat."
trigger_phrases:
  - "runtime parity decision"
  - "tsx in-process import"
  - "non-gap exclusion"
  - "loop-lock host owner"
  - "bayesian fanout excluded"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-deep-context-gathering/002-runtime-robustness-parity"
    last_updated_at: "2026-06-06T23:55:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored 3 ADRs for the runtime-robustness-parity phase"
    next_safe_action: "Cross-check checklist/plan/implementation-summary evidence against ADR decisions"
    blockers: []
    key_files:
      - ".opencode/skills/deep-context/scripts/reduce-state.cjs"
      - ".opencode/skills/deep-context/scripts/loop-lock.cjs"
    session_dedup:
      fingerprint: "sha256:2b71f0c4a9d35ee2c6184f93a17d4cb5e820a6713fd9c2ee4407b51a9c6d3e72"
      session_id: "dc-134-002-20260606"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "In-process tsx import with inline fallback chosen over per-call re-exec"
      - "bayesian-scorer and fanout-run excluded as non-gaps"
      - "Loop-lock owner id is host-provided and reused across acquire/release"
---
# Decision Record: deep-context runtime-robustness parity

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Host-driven in-process tsx import with inline fallback over re-exec

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-06 |
| **Deciders** | deep-context owner, runtime maintainer |

---

<!-- ANCHOR:adr-001-context -->
### Context

The deep-context loop is host-driven: the host runs `reduce-state.cjs` and the workflow YAMLs invoke `loop-lock.cjs`. To reach robustness parity, these `.cjs` scripts needed the runtime's durability and validation primitives, which ship as TypeScript modules (`atomic-state.ts`, `jsonl-repair.ts`, `loop-lock.ts`) rather than pre-compiled CommonJS. We had to choose how a CJS script consumes a TS helper without forking the helper's logic.

### Constraints

- The runtime helpers must be reused unmodified so research and review stay unaffected; deep-context cannot vendor its own copy.
- The scripts must stay dual-use (importable as modules and runnable as CLIs) and must not hard-fail when a TS toolchain is unavailable.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Import the runtime TypeScript helpers in-process via the tsx CJS register shipped with `system-spec-kit`, memoized once per invocation, with contract-equivalent inline fallbacks (`writeStateAtomicInline`, `repairJsonlTailInline`) when the register or a helper is unavailable.

**How it works**: `reduce-state.cjs` `loadStateSafety()` requires the tsx CJS register, then requires `atomic-state.ts` and `jsonl-repair.ts`; if both export the expected functions it returns `{writeStateAtomic, repairJsonlTail, source: 'runtime'}`, otherwise it returns the inline pair with `source: 'inline'`. `loop-lock.cjs` does the same for `loop-lock.ts`. The result is cached so the helpers load once per reducer run, not per write.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **In-process tsx import + inline fallback (chosen)** | Reuses the runtime helpers unmodified; no per-call spawn; degrades gracefully | A second (inline) code path to keep contract-equivalent | 9/10 |
| Re-exec a TS runner per call | Single source of logic | Process-spawn latency on every write; hard toolchain dependency; brittle in non-TTY automation | 4/10 |
| Vendor compiled CJS copies of the helpers | No toolchain dependency | Forks the helper logic; drifts from the runtime; defeats the reuse goal | 3/10 |

**Why this one**: In-process import reuses the trusted runtime helpers with no per-call spawn, and the inline fallback keeps the host-driven loop functional when the toolchain is absent, with `stateSafety.source` recording which path ran.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- deep-context inherits the runtime's crash-safe write and corrupt-tail repair contracts without duplicating them.
- The scripts stay dual-use and avoid the latency and fragility of a per-call TS re-exec.

**What it costs**:
- An inline fallback path must stay contract-equivalent to the runtime helpers. Mitigation: the inline functions are minimal mirrors of the runtime contract, and the fixture smoke run exercises the `runtime` path and reports the source.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Inline fallback drifts from the runtime contract | M | Keep the inline functions minimal; `stateSafety.source` makes the active path observable in the registry |
| tsx register path moves | L | Path resolved relative to the script; failure routes to the inline fallback rather than crashing |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A CJS host script cannot consume the TS helpers without an import or re-exec strategy |
| 2 | **Beyond Local Maxima?** | PASS | Re-exec and vendored-copy alternatives evaluated and scored |
| 3 | **Sufficient?** | PASS | In-process import plus inline fallback covers both toolchain-present and toolchain-absent cases |
| 4 | **Fits Goal?** | PASS | Reuses the runtime helpers unmodified, which is the parity goal |
| 5 | **Open Horizons?** | PASS | New runtime helpers can be adopted the same way without a new mechanism |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `reduce-state.cjs`: `loadStateSafety()` imports `writeStateAtomic` + `repairJsonlTail` via the tsx register, memoized, with inline fallbacks; `registry.stateSafety`/`source` records the active path.
- `loop-lock.cjs`: `loadLoopLock()` imports the loop-lock trio via the tsx register.

**How to roll back**: Drop the `loadStateSafety`/`loadLoopLock` import blocks and call the inline functions directly, or revert `reduce-state.cjs` to its phase-001 non-atomic writes and delete `loop-lock.cjs`. No runtime file is touched.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Exclude bayesian-scorer and fanout-run as non-gaps

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-06 |
| **Deciders** | deep-context owner, runtime maintainer |

---

<!-- ANCHOR:adr-002-context -->
### Context

The robustness-parity review compared deep-context against the mature loops' use of the shared `deep-loop-runtime`. Two runtime features came up as candidate gaps: `bayesian-scorer` (executor demotion by score) and the `fanout-run`/`fanout-pool`/`fanout-salvage` disjoint-slice lineage mode. We had to decide whether parity required wiring them, or whether they are deliberate non-gaps for deep-context.

### Constraints

- Parity means matching the durability and validation guarantees the mature loops actually rely on, not adopting every runtime capability.
- deep-context's dispatch model is by-model shared scope (council-style), which is a design choice from phase 001, not an accident to be corrected here.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Exclude both `bayesian-scorer` and the `fanout-run`/`fanout-pool`/`fanout-salvage` mode from this phase as non-gaps.

**How it works**: `bayesian-scorer` is left unwired because neither `deep-research` nor `deep-review` uses it either, so wiring it into deep-context would exceed parity rather than reach it. The disjoint-slice `fanout-run` mode is left unused because deep-context dispatches a heterogeneous pool over a single shared scope by-model (council dispatch), which is a deliberate design, not the disjoint-slice lineage pattern `fanout-run` exists to serve. The two excluded features are recorded here so the absence is intentional and auditable.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Exclude both as non-gaps (chosen)** | Matches the mature loops' actual guarantees; respects deep-context's by-model shared-scope design | Requires documenting the exclusion so it is not read as an oversight | 9/10 |
| Wire bayesian-scorer for completeness | Maximal feature parity on paper | The mature loops do not use it; adds unused executor-demotion machinery; exceeds parity | 3/10 |
| Adopt the disjoint-slice fanout-run mode | Reuses the runtime fan-out path | Conflicts with by-model shared-scope council dispatch; would change deep-context's convergence semantics | 2/10 |

**Why this one**: Parity is matching what the mature loops actually depend on. `bayesian-scorer` is unused by them, and `fanout-run` serves a disjoint-slice model deep-context deliberately does not use, so excluding both is the correct scope.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The phase stays scoped to genuine durability and validation gaps, avoiding unused machinery.
- deep-context's by-model shared-scope convergence design is preserved unchanged.

**What it costs**:
- A future reader might expect every runtime feature wired. Mitigation: this ADR records why the two are non-gaps, with the design rationale for each.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Exclusion read as an unfinished gap | M | This ADR documents the deliberate non-gap status and the design reason for each |
| A later phase adopts fanout-run without revisiting convergence | M | The ADR ties the exclusion to the by-model shared-scope convergence model so a future change is forced to reconsider it |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Scoping the phase requires deciding which runtime features are real gaps |
| 2 | **Beyond Local Maxima?** | PASS | Wiring each candidate feature was evaluated and rejected with rationale |
| 3 | **Sufficient?** | PASS | The five wired features cover the durability/validation gaps; the two excluded ones are not gaps |
| 4 | **Fits Goal?** | PASS | Parity targets the mature loops' actual guarantees, which neither excluded feature provides |
| 5 | **Open Horizons?** | PASS | The exclusion is documented, so a future need can revisit it deliberately |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- No code change for the exclusions; `bayesian-scorer` stays unwired and the disjoint-slice `fanout-run`/`pool`/`salvage` mode stays unused by deep-context.
- The phase wires only atomic-state, jsonl-repair, post-dispatch-validate, loop-lock, and executor-audit.

**How to roll back**: Not applicable; nothing was added for the exclusions. If a future phase needs by-slice fan-out or score-based demotion, it would revisit this ADR and the convergence model.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Loop-lock owner id is host-provided and reused across acquire/release

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-06 |
| **Deciders** | deep-context owner, runtime maintainer |

---

<!-- ANCHOR:adr-003-context -->
### Context

The runtime `loop-lock.ts` helper models an owner by pid and uses `processAlive`/`isStaleLoopLock` to reclaim a lock whose owner process has died. The mature loops run as one long-lived process, so the lock owner is naturally that process's pid for the lock's whole lifetime. The deep-context loop is host-driven: there is no single long-lived loop process. The host invokes `loop-lock.cjs acquire` on start and `loop-lock.cjs release` on halt/cancel/complete as separate process invocations, so the acquiring process and the releasing process are not the same pid.

### Constraints

- The runtime release is owner-scoped: `releaseLoopLock(lockPath, ownerPid)` only releases a lock the given owner holds, so acquire and release must agree on the owner id.
- macOS/BSD file locking is advisory, so stale-lock reclaim and a stable owner id are how single-writer is actually enforced.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Make the loop-lock owner id host-provided via a `--owner <int>` argument, reused across the acquire/release pair, defaulting to the invoking process pid only for standalone use.

**How it works**: `loop-lock.cjs` reads `--owner` and passes it as `ownerPid` to `acquireLoopLock`/`refreshLoopLock`/`releaseLoopLock`. The workflow YAMLs capture the owner id at acquire time (`captured_owner_pid`) and pass the same value to every release call (halt, cancel, complete), so the owner-scoped release matches the holder even though it runs in a different process. When no `--owner` is given, the wrapper falls back to its own pid for one-off standalone use.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Host-provided owner id reused across acquire/release (chosen)** | Owner-scoped release works for a multi-process host loop; reuses the runtime helper unchanged | The host must capture and re-pass the owner id | 9/10 |
| Use each invocation's own pid | Zero plumbing | Release pid differs from acquire pid, so the owner-scoped release never matches and the lock leaks | 2/10 |
| Make release owner-agnostic | Simplest release | Any process could release another's lock; breaks the single-writer guarantee | 2/10 |

**Why this one**: A host-driven loop has no single long-lived pid, so a host-provided owner id reused across the pair is the only option that keeps the runtime's owner-scoped release correct without weakening the single-writer guarantee.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- The host-driven loop gets correct single-writer locking with stale-lock reclaim from the same runtime helper the mature loops use.
- Release is owner-scoped and idempotent, so halt/cancel/complete can each release safely.

**What it costs**:
- The host carries the owner id between the acquire and release steps. Mitigation: the workflow YAMLs capture `captured_owner_pid` at acquire and re-pass it on every release path.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Owner id not re-passed on release | L | Owner-scoped release is a no-op on mismatch; a stale lock is later reclaimed via `isStaleLoopLock`/`processAlive` |
| Advisory locking on macOS/BSD | M | Stale-lock reclaim plus a stable owner id; stale-lock override is confirm-only or explicit recovery-only |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A host-driven loop has no single long-lived pid, so the owner model must be reconciled |
| 2 | **Beyond Local Maxima?** | PASS | Per-invocation pid and owner-agnostic release evaluated and rejected |
| 3 | **Sufficient?** | PASS | Host-provided owner id reused across the pair makes the owner-scoped release correct |
| 4 | **Fits Goal?** | PASS | Reuses the runtime loop-lock helper unchanged while fitting the host-driven model |
| 5 | **Open Horizons?** | PASS | The owner-id contract is explicit, so future host orchestrations follow the same pattern |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `loop-lock.cjs`: parses `--owner <int>`, defaults to `process.pid` for standalone use, and passes the owner to the acquire/refresh/release helpers.
- Both workflow YAMLs: capture `captured_owner_pid` at `step_acquire_lock` and re-pass it to `step_release_lock` and the halt/cancel release paths.

**How to roll back**: Revert the `step_acquire_lock`/`step_release_lock` lines in both YAMLs and delete `loop-lock.cjs`; the loop falls back to the phase-001 prose-only lock step. No runtime file changes.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!--
Level 3 decision record - 3 ADRs for the runtime-robustness-parity phase
Each ADR: Metadata, Context+Constraints, Decision, Alternatives, Consequences, Five Checks, Implementation
-->
