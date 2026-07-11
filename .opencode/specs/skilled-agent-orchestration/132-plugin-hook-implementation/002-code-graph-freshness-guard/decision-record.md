---
title: "Decision Record: Incremental Code-Graph Freshness Guard"
description: "Architecture decisions for the post-edit code-graph freshness guard: the shared output-free core plus two thin runtime adapters boundary, and the advisory fail-open posture with a warm-only never-cold-start invariant and a default-off bootstrap opt-in."
trigger_phrases:
  - "code graph freshness decisions"
  - "freshness core adapters ADR"
  - "fail-open posture ADR"
  - "warm-only never cold-start"
  - "code-graph-freshness-guard"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/002-code-graph-freshness-guard"
    last_updated_at: "2026-07-11T14:17:40Z"
    last_updated_by: "spec-author"
    recent_action: "Authored two ADRs: core-plus-two-adapters boundary and advisory fail-open posture"
    next_safe_action: "Await approval, then implement against the ADR boundaries"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/runtime/lib/code-graph/freshness-core.cjs"
      - ".opencode/plugins/mk-code-graph-freshness.js"
      - ".opencode/skills/system-code-graph/runtime/hooks/claude/code-graph-freshness.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-code-graph-freshness-guard"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Incremental Code-Graph Freshness Guard

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Shared output-free core plus two thin runtime adapters

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-11 |
| **Deciders** | Phase 002 author, pending operator approval |

---

<!-- ANCHOR:adr-001-context -->
### Context

Two runtimes react to the same post-edit signal: OpenCode through `tool.execute.after` and Claude through a PostToolUse `Write|Edit` hook. Both must apply identical policy: the same debounce math, the same empty gate, the same warm probe, and the same never-cold-start invariant. The repo already ships this exact split for `mk-deep-loop-guard`, where the policy lives in `runtime/lib/deep-loop/dispatch-guard.cjs` and two thin adapters wrap it. We needed to choose between duplicating the policy in each hook or extracting it into one shared core.

### Constraints

- The OpenCode plugin file must be default-export-only, or the whole plugin silently drops (`plugins/README.md:26-28`).
- The Claude hook is short-lived and stateless per invocation, so any cross-edit state must live on disk.
- The core must never write stdout/stderr, because a stray byte corrupts the TUI.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Put all decision logic in an output-free `freshness-core.cjs` that returns a transport-free decision, and keep each adapter a thin shell that owns only the spawn and the log append.

**How it works**: `evaluateEdit()` reads the readiness marker, the owner heartbeat, and the hex(sessionID)-keyed debounce state, then returns one of `skip`, `defer-empty`, `defer-cold`, `defer-inflight`, or `scan` plus `warnings`/`audits` arrays. The adapters append those arrays to the log and, only on `scan`, spawn `.opencode/bin/code-index.cjs` detached. The core never spawns and never prints.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared output-free core + two thin adapters** | One place to test policy; adapters stay trivial; clones a proven boundary | Slight indirection between adapter and core | 9/10 |
| Two independent hooks with duplicated logic | No shared module to import | Policy drifts between runtimes; doubles the test surface; two places to fix a bug | 3/10 |
| One core that also owns the spawn and logging | Fewer files | Core would need `child_process` and stdout, breaking the output-free and TUI-safety rules | 2/10 |

**Why this one**: It matches the repo's proven `dispatch-guard.cjs` boundary, keeps the policy testable in isolation, and preserves the hard rules that the core stays output-free and the plugin stays default-export-only.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The debounce, empty-gate, warm-probe, and concurrency policy is unit-tested once, independent of either runtime.
- Each adapter fails open on its own, so a fault in one runtime cannot affect the other.

**What it costs**:
- One extra module boundary between adapter and core. Mitigation: the boundary is identical to the shipped `mk-deep-loop-guard` split, so the pattern is already understood and reviewed.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A named export in the plugin `.js` drops the whole file | H | Default-export-only; hang the test surface on the default fn `__test`; folder-purity vitest gate |
| Core accidentally prints or spawns | M | Grep gate in the checklist; the core has no `child_process` import and no stdout/stderr write |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two runtimes need identical policy; duplication would drift immediately |
| 2 | **Beyond Local Maxima?** | PASS | Duplicated-logic and monolithic-core alternatives were scored and rejected |
| 3 | **Sufficient?** | PASS | The core-plus-adapters split is the minimal structure that keeps policy shared and adapters output-free |
| 4 | **Fits Goal?** | PASS | On the critical path: the core is the load-bearing decision and both adapters depend on it |
| 5 | **Open Horizons?** | PASS | A third runtime would add one more thin adapter with zero policy change |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Create `freshness-core.cjs` under `system-code-graph/runtime/lib/code-graph/` with the gate chain and exports.
- Create the two adapters (`mk-code-graph-freshness.js`, `code-graph-freshness.cjs`) that import and call the core.

**How to roll back**: Delete the three new files and revert the appended `.claude/settings.json` command and the `plugins/README.md` entry. No schema change exists, so no data reversal applies.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Advisory fail-open posture with a warm-only never-cold-start invariant

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-11 |
| **Deciders** | Phase 002 author, pending operator approval |

---

<!-- ANCHOR:adr-002-context -->
### Context

The guard reacts to every source edit, so it sits on a hot path shared with unrelated tools. A blocking or throwing guard would degrade every edit. The daemon can also be cold, and waking it on an edit would cause a surprise multi-second cold-start. The graph is empty on this repo right now, and establishing initial scope is a decision the operator owns through SessionStart. We needed a posture that self-heals a warm, established graph while staying invisible and safe in every other state.

### Constraints

- The guard must never block or throw into the tool path (unlike `deep-loop-guard`, which does throw on reject).
- It must never cold-start the daemon; scope establishment belongs to SessionStart and the operator.
- The default index scope excludes `.opencode/skills`, agents, commands, specs, and plugins (`tool-schemas.ts:23-34`), so this repo's own edits are mostly out of scope.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: An observe-advise-plus-self-heal posture that fails open on every internal error, acts only on the deterministic high-confidence case, and gates initial establishment behind a default-off opt-in.

**How it works**: The guard dispatches only when an established non-empty graph, an in-scope source edit, a warm daemon (heartbeat under `ttlMs`), an elapsed debounce, and no in-flight scan all hold. It defers-and-logs on empty, cold, in-flight, or out-of-scope. It never cold-starts: a cheap heartbeat probe plus the CLI `--warm-only`/PROMPT_TIME env means the CLI provably throws exit-75 instead of `spawnLauncher` (`code-index-cli.js:996`). Bootstrap-from-empty stays off unless `MK_CODE_GRAPH_FRESHNESS_BOOTSTRAP=1`.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Advisory fail-open, warm-only, default-off bootstrap** | Never blocks an edit; never cold-starts; keeps scope decisions with the operator | Trailing-edge precision on the Claude side is bounded | 9/10 |
| Blocking guard that waits for the scan | Guarantees a fresh graph before the next tool | Blocks every edit for multiple seconds; unacceptable on a hot path | 1/10 |
| Bootstrap-from-empty on by default | Self-heals even an empty graph with no setup | Runs an unscoped establishing scan the operator did not ask for; risks scope thrash | 3/10 |

**Why this one**: It restores freshness exactly where it is safe and high-confidence, and it degrades to a silent log everywhere else, so the worst realistic failure is a single unnecessary incremental scan.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Edits are never blocked and the daemon is never woken by an edit.
- The graph self-heals from soft-stale to fresh on an established, warm session with no operator action.

**What it costs**:
- The Claude side cannot fire on a pure trailing edge every time. Mitigation: combine a max-wait cap, next-edit-after-settle, and a SessionStart drain; stale structural reads already false-safe to `blocked`, so a bounded delay is not a correctness risk.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Warm probe race: heartbeat goes stale between probe and dispatch | L | CLI `--warm-only` exit-75 refusal is the backstop; never invoke the launcher |
| Per-call scope flags narrow the fingerprint | H | Pass no per-call scope flags; inherit process env (`readiness_and_scope_fingerprint.md:104`) |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A hot-path guard must be non-blocking and must not cold-start, or it harms every edit |
| 2 | **Beyond Local Maxima?** | PASS | Blocking and default-on-bootstrap alternatives were scored and rejected |
| 3 | **Sufficient?** | PASS | Fail-open plus warm-only plus default-off bootstrap covers every unsafe state with a defer |
| 4 | **Fits Goal?** | PASS | Directly serves the goal: self-heal the graph without operator action or risk |
| 5 | **Open Horizons?** | PASS | The bootstrap opt-in leaves room to enable establishment later without re-architecting |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `evaluateEdit()` implements the gate order that returns `defer-empty`, `defer-cold`, `defer-inflight`, `skip`, or `scan`.
- The scan dispatch always carries `--warm-only` and `SPECKIT_CODE_INDEX_CLI_PROMPT_TIME=1`; no code path calls `mk-code-index-launcher.cjs`.
- `MK_CODE_GRAPH_FRESHNESS_BOOTSTRAP` is documented in `plugins/README.md` and left unset.

**How to roll back**: Remove the appended `.claude/settings.json` command and delete `mk-code-graph-freshness.js` to disable both adapters; the core and its state dir can then be deleted with no data impact.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
