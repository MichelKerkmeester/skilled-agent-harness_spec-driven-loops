---
title: "Decision Record: Stress-Test the Six External CLI Deep-Loop Adapters and Fan-Out Orchestration"
description: "Planned decisions for the future stress program: a hang-safe per-file test suite, per-skill adapter playbooks with a shared fan-out playbook, and deterministic external-dependency gating."
trigger_phrases:
  - "cli adapter stress tests"
  - "deep-loop executor adapter coverage"
  - "fan-out stress testing"
  - "external CLI manual testing playbook"
  - "stdin hang adapter regression"
importance_tier: "critical"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/001-cli-adapter-stress-and-playbooks"
    last_updated_at: "2026-08-07T08:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded planned test, playbook, and dependency-gating decisions"
    next_safe_action: "Review planned ADRs before execution handoff"
    blockers: []
    key_files:
      - "decision-record.md"
    completion_pct: 0
    open_questions:
      - "Does execution need any additional harness seam beyond current exports?"
    answered_questions:
      - "The three required decisions are captured as Planned ADRs."
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

# Decision Record: Stress-Test the Six External CLI Deep-Loop Adapters and Fan-Out Orchestration

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use a dedicated serial stress suite with hang-safe execution

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned |
| **Date** | 2026-08-07 |
| **Deciders** | Packet owner, later execution owner |

---

<!-- ANCHOR:adr-001-context -->
### Context

The adapter tests need to exercise real child-process behavior: auth and transport failures, stdin starvation, timeouts, sandbox modes, captured-PID cleanup, workspace containment, and self-invocation. The shared runtime process can hang or serialize unrelated work when a full test aggregate holds a common SQLite or CLI resource, so a green aggregate would not prove that each file is safe to run.

### Constraints

- Stress files must live under `.opencode/skills/system-deep-loop/runtime/tests/stress/cli-adapter/` and must not alter the adapter implementation.
- Execution must set `fileParallelism:false`, run one subject file at a time, close stdin explicitly where a CLI is headless, and bound every subprocess.
- The six adapter subjects and fan-out need separate evidence while sharing fixture and matrix helpers.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: A dedicated `runtime/tests/stress/cli-adapter/` suite with one file per adapter and one fan-out file, gated by serial per-file execution with `fileParallelism:false`.

**How it works**: Shared helpers create isolated worktrees, bounded command shims, captured-PID process trees, and evidence artifacts. Each stress file can be run independently with an explicit timeout; the directory-level command is an inventory convenience, not the completion gate. The harness refuses to treat a missing provider or transport as a passing result.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Dedicated stress directory with one serial file per subject** | Isolates hangs, keeps failure evidence local, and matches the seven-subject matrix | More commands and more result files to retain | 9/10 |
| Add all cases to existing unit suites | Reuses imports and current fixtures | Mixes fast unit behavior with external process timing; a hang blocks unrelated regression tests | 5/10 |
| One full aggregate stress process | One command and one report | A stdin or shared-resource hang hides which subject failed and can hold the entire runner | 3/10 |
| One shell script per edge case | Easy to run manually | Duplicates adapter setup, weakens typed assertions, and makes matrix completeness hard to prove | 4/10 |

**Why this one**: The failure program is process- and workspace-sensitive. Per-file isolation gives the cheapest reliable boundary for proving that a failure is bounded and attributed to one subject.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- A 0% CPU stdin or stall failure is bounded to one file and retains its PID/output evidence.
- Adapter and fan-out results can be rerun independently without provider-wide aggregate noise.
- The matrix can point to named test files instead of a single opaque report.

**What it costs**:

- The execution owner must run and retain several commands rather than one aggregate command.
- Shared fixtures need explicit cleanup and worktree isolation.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A per-file run still leaks a child | H | Captured PID, descendant cleanup, timeout, and post-run process check |
| Serial runs hide concurrency defects | M | Fan-out's own stress file exercises concurrency while file scheduling remains serial |
| Test helpers become a second adapter | M | Reuse existing command builders and keep helpers limited to shims, bounds, and evidence |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | Planned | The phase brief identifies stdin hangs, timeout, and shared-process failures as real blockers to a live run |
| 2 | **Beyond Local Maxima?** | Planned | Dedicated, unit-integrated, aggregate, and shell-script approaches are compared above |
| 3 | **Sufficient?** | Planned | Independent per-file evidence plus a dedicated concurrency file covers both isolation and fan-out behavior |
| 4 | **Fits Goal?** | Planned | The location is scoped to stress artifacts and does not change adapter behavior |
| 5 | **Open Horizons?** | Planned | A future adapter can add one subject file and matrix rows without changing the execution boundary |

**Checks Summary**: 0/5 verified in this scaffold; execution must close the checks.
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes later**:

- `runtime/tests/stress/cli-adapter/cli-codex.vitest.ts`
- `runtime/tests/stress/cli-adapter/cli-opencode.vitest.ts`
- `runtime/tests/stress/cli-adapter/cli-pi.vitest.ts`
- `runtime/tests/stress/cli-adapter/cli-claude-code.vitest.ts`
- `runtime/tests/stress/cli-adapter/cli-devin.vitest.ts`
- `runtime/tests/stress/cli-adapter/cli-cursor.vitest.ts`
- `runtime/tests/stress/cli-adapter/fanout.vitest.ts` and shared test helpers

**How to roll back**: Stop the affected per-file run, clean only its captured process tree, and remove only its isolated stress artifacts. No runtime adapter file is a rollback target for this child.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Keep adapter playbooks per skill and fan-out playbooks in the hub

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned |
| **Date** | 2026-08-07 |
| **Deciders** | Packet owner, CLI skill owners |

---

<!-- ANCHOR:adr-002-context -->
### Context

Each CLI packet owns different command syntax, auth preflight, models, sandbox flags, approval behavior, and provider diagnostics. Fan-out cuts across those adapters and needs one shared orchestration scenario contract. A single root corpus would centralize navigation but would duplicate adapter-specific truth; six separate fan-out copies would drift.

### Constraints

- Adapter snippets must live in the owning `cli-*/manual-testing-playbook/` package so the packet's existing validator and operator context remain authoritative.
- Fan-out scenarios must be discoverable from the hub playbook and must not be copied into six adapter packets.
- Every matrix cell still needs one canonical snippet, exact commands, evidence, verdict, and failure triage.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: A hybrid playbook layout: adapter-specific snippets under `.opencode/skills/cli-external-orchestration/cli-*/manual-testing-playbook/stress/`, and shared fan-out snippets under `.opencode/skills/cli-external-orchestration/manual-testing-playbook/fanout-stress/`.

**How it works**: Each adapter's 14 rows stay with its native command and dependency contract. Fan-out's rows are written once against `fanout-run.cjs`, then linked from the hub index and the coverage matrix. The root/hub playbook owns orchestration policy; per-feature files own execution truth.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|--------|-------|
| **Hybrid per-skill adapter plus hub fan-out layout** | Keeps native CLI truth local and avoids fan-out duplication | Matrix tooling must traverse more than one package root | 9/10 |
| One consolidated hub playbook for all cells | One index and one validator entry point | Adapter auth/flags drift from the owning skill and files become unwieldy | 6/10 |
| Six complete per-skill playbooks including fan-out | Local navigation is easy | Shared scheduler guidance is duplicated and will diverge | 4/10 |
| Put snippets only in the spec packet | Packet-local evidence is convenient | Operators cannot find the reusable playbook beside the CLI contract | 3/10 |

**Why this one**: The playbook packet contract says shared rules belong at the root and execution truth belongs in per-feature files. The hybrid boundary applies that rule to adapter ownership and shared fan-out behavior.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:

- An operator reading `cli-cursor` or `cli-devin` sees the correct native auth and sandbox commands beside its stress snippets.
- Fan-out cleanup, budgets, convergence, and partial aggregation have one maintained scenario source.
- The coverage matrix can expose missing links across the seven subjects.

**What it costs**:

- The execution validator must accept a bounded multi-package scope.
- The matrix author must maintain links across six adapter packages and one hub category.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A CLI packet changes its command contract | M | Re-read its `SKILL.md` and references at execution start; keep exact commands in its own snippet |
| A hub scenario is copied into an adapter packet | M | Matrix ownership rule allows one canonical fan-out path only |
| Prompt fields drift from command fields | M | Playbook validator and prompt-synchronization check are completion gates |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | Planned | Six CLI packets have materially different dispatch contracts while fan-out is shared |
| 2 | **Beyond Local Maxima?** | Planned | Consolidated, duplicated, packet-local, and hybrid layouts are compared above |
| 3 | **Sufficient?** | Planned | The split preserves one canonical snippet for every adapter and fan-out cell |
| 4 | **Fits Goal?** | Planned | Paths are the user's requested CLI skill and hub playbook surfaces |
| 5 | **Open Horizons?** | Planned | A future adapter adds its own packet subtree without moving fan-out truth |

**Checks Summary**: 0/5 verified in this scaffold; execution must close the checks.
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes later**:

- One `stress/` category and one scenario file per adapter/edge-case cell under each owning CLI packet.
- One `fanout-stress/` category under the hub package for shared orchestration scenarios.
- A coverage matrix that links each subject/row to exactly one test and one snippet.

**How to roll back**: Remove only the newly authored stress categories and matrix links for the affected subject. Existing CLI playbook scenarios and the fan-out runtime remain untouched.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Gate live external dependencies behind hermetic coverage and precise skips

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned |
| **Date** | 2026-08-07 |
| **Deciders** | Packet owner, later execution owner |

---

### Context

The six adapters depend on external binaries, provider auth, model availability, account balance, rate limits, and sometimes a shared OAuth home. Those dependencies are not stable enough to be the only test oracle, but an unavailable CLI cannot be silently replaced by a passing fixture. The program therefore needs deterministic failure injection plus a separate live lane that reports a specific blocker when its preconditions are absent.

### Constraints

- Hermetic tests must run without credentials and must not persist fake credentials or provider-identifying output.
- Live probes must run only after `command -v` and adapter-specific auth checks; live output must be redacted before retention.
- A dependency `SKIP` is allowed only when it names the missing command, auth state, sandbox capability, or environment restriction.
- Direct child gate tests use `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1`; fan-out must also be checked for its runtime child env (`MK_SPEC_GATE_DISABLED=1`, `AI_SESSION_CHILD=1`).

---

### Decision

**We chose**: Use hermetic command/PATH shims and synthetic process/artifact fixtures for deterministic matrix coverage, then run live success/failure probes only when binary and auth preflight passes. Record unavailable live lanes as `SKIP` with the exact blocker.

**How it works**: The harness places controlled executables first in `PATH`, drives the existing command-builder/process path, and asserts stdout, stderr, exit/signal, artifacts, ledger, cleanup, and summary behavior. A live probe never supplies the sole proof for a cell; it supplements the hermetic result and keeps provider failure distinct from transport absence. No adapter behavior is changed to make the harness easier to run.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|--------|-------|
| **Hermetic shims plus gated live probes** | Deterministic coverage with real-world confirmation when available; clear skip semantics | Requires a small shim and redaction layer | 9/10 |
| Live CLI/auth only | Highest realism for available providers | Cannot run reliably in CI or unauthenticated worktrees; misses missing-transport paths | 4/10 |
| Fully synthetic adapter mocks | Fast and credential-free | Can bypass command construction, stdin, sandbox, PID, and artifact behavior where the incidents occurred | 5/10 |
| Treat unavailable live dependencies as pass | Keeps reports green | Falsifies coverage and hides exactly the transport/auth failures this phase targets | 1/10 |

**Why this one**: The matrix targets both provider-independent process behavior and provider-dependent diagnostics. Two lanes are needed to test both without making credentials a hidden prerequisite.

---

### Consequences

**What improves**:

- CI or an isolated worktree can cover all 14 rows without external credentials.
- Live auth/model/rate-limit evidence is still captured when available, without pretending it is universal.
- The resulting playbook tells operators exactly when to run live and how to report a blocker.

**What it costs**:

- Shims must model the output and timing shape that the adapter actually consumes.
- Every live skip needs a specific reason and cannot be collapsed into a generic unavailable label.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Shim differs from a native CLI's error shape | M | Keep live probes as supplemental evidence and read each owning skill's command contract |
| Credentials leak into captured output | H | Redact before writing artifacts; scan fixtures and playbooks |
| A live probe waits for stdin or approval | H | `</dev/null`, bounded timeout, captured PID, and explicit sandbox/approval flags |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | Planned | Provider/auth availability and stdin/process failures are independent concerns |
| 2 | **Beyond Local Maxima?** | Planned | Live-only, mock-only, pass-on-skip, and two-lane approaches are compared above |
| 3 | **Sufficient?** | Planned | Hermetic coverage plus gated live evidence covers both deterministic and native behavior |
| 4 | **Fits Goal?** | Planned | The gate preserves honest PASS/FAIL/SKIP semantics and no adapter behavior change |
| 5 | **Open Horizons?** | Planned | A new provider or adapter can add a shim and preflight without rewriting the matrix contract |

**Checks Summary**: 0/5 verified in this scaffold; execution must close the checks.

---

### Implementation

**What changes later**:

- Shared deterministic command shims and live dependency preflight helpers in the dedicated stress suite.
- Per-cell evidence fields for command, environment, output, artifacts, and `PASS` / `FAIL` / `SKIP`.
- Redaction and no-secret scans for fixtures, playbooks, and findings.

**How to roll back**: Disable the live lane for the affected adapter, preserve the precise `SKIP` evidence, and rerun the hermetic file. Remove only the shim or preflight helper if it is proven unsafe; do not alter the adapter or provider configuration.
<!-- /ANCHOR:adr-003 -->
