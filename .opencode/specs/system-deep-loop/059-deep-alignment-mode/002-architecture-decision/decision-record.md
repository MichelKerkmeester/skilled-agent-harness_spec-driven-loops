---
title: "Decision Record: deep-alignment architecture"
description: "Twelve ADRs freezing the deep-alignment mode-packet architecture: seven accepted decisions locked by the frozen design brief (new-packet shape, scoping tree, adapter contract, authority sequencing, alignment contract, state machine, explicit boundary) and five explicitly open questions each owned by a named later phase."
trigger_phrases:
  - "deep-alignment architecture decision record"
  - "alignment adapter contract adr"
  - "deep-alignment state machine adr"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/002-architecture-decision"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored 12 ADRs, 7 accepted 5 open"
    next_safe_action: "Route for operator approval before phase 003"
    blockers:
      - "Human approval required before phase 003 starts"
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-002-architecture-decision"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "ADR-008 sk-code adapter automatability limits"
      - "ADR-009 sk-design live-render audit v2+ scope"
      - "ADR-010 deep-review runtime reuse boundary"
      - "ADR-011 non-interactive lane-arg schema"
      - "ADR-012 new-authority adapter registration governance"
    answered_questions: []
---
# Decision Record: deep-alignment architecture

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: New mode-packet, not a deep-review mode

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-11 |
| **Deciders** | Operator (via frozen design brief) |

---

<!-- ANCHOR:adr-001-context -->
### Context

`deep-alignment` needs a first-class interactive scoping entry phase (resolving N alignment lanes across artifact class, standard authority, and scope) that `deep-review` does not have, and its "authority" is an external per-skill standard needing a pluggable adapter, not a general-correctness reviewer. The question was whether to add this as a new `deep-review` sub-mode or as a new sibling mode-packet under `system-deep-loop`.

### Constraints

- Must maximally reuse the proven `deep-review` runtime engine (`.opencode/skills/system-deep-loop/runtime/scripts/{loop-lock,convergence,verify-iteration,upsert}.cjs`) rather than rebuild it.
- Must not blur `deep-review`'s existing contract (general code/doc correctness review) with a fundamentally different one (conformance-to-a-named-authority).
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: A new `system-deep-loop` mode-packet, `deep-alignment`, as a peer of `deep-review`, not a mode or flag inside `deep-review`.

**How it works**: `deep-alignment` gets its own `workflowMode` entry in `.opencode/skills/system-deep-loop/mode-registry.json` and its own packet folder, but its loop backend reuses the same `runtime/scripts/` primitives `deep-review` already uses — a thin specialization of the engine, not a rebuild.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **New mode-packet (chosen)** | Clean separation of contracts (correctness vs. conformance); the scoping question is a first-class entry phase `deep-review` structurally lacks | One more mode-packet to register and route | 9/10 |
| A `deep-review` convergence-mode flag, like `055`'s `divergent` mode | Smallest structural footprint; precedent exists for mode flags | The scoping question and the pluggable adapter contract are not convergence-mode concerns — forcing them into `deep-review`'s existing contract would overload it | 4/10 |
| A wrapper script outside `system-deep-loop` entirely | Zero coupling to the runtime engine | Forfeits the proven convergence/state machinery `deep-review` already has; would rebuild what already works | 2/10 |

**Why this one**: The scoping question and the authority-adapter contract are both genuinely new concerns `deep-review` was never designed to carry, but the loop mechanics underneath are identical enough to reuse directly.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- `deep-review`'s contract (general correctness) stays clean; `deep-alignment`'s contract (named-authority conformance) is separately legible.
- The engine-reuse boundary (ADR-010, open) can be resolved on its own merits instead of being pre-constrained by a mode-flag design.

**What it costs**:
- A new mode-packet must be registered, routed, and benchmarked (phases 003 and 009) rather than riding on `deep-review`'s existing routing.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Advisor confusion between `deep-review` and `deep-alignment` for "audit"/"review" style prompts | M | Phase 009's behavior benchmark explicitly tests this collision, mirroring the sk-code/sk-design/deep-loop vocab-collision fixes already shipped in `012-parent-hub-compat` |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The 130/131 manual pattern is real, repeated work with no product form today |
| 2 | **Beyond Local Maxima?** | PASS | The mode-flag and standalone-wrapper alternatives were weighed and rejected on their contract-fit merits |
| 3 | **Sufficient?** | PASS | A new mode-packet is the minimum structural change that keeps both contracts clean |
| 4 | **Fits Goal?** | PASS | Directly matches the design brief's locked framing |
| 5 | **Open Horizons?** | PASS | Future authorities and lanes stay addable without restructuring the packet boundary |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md` — new thin mode contract (phase 003).
- `.opencode/skills/system-deep-loop/mode-registry.json` — new `deep-alignment` entry (phase 003).

**How to roll back**: Before phase 003 runs, revert this ADR's text — no files exist yet. After phase 003, delete the new packet folder and registry entry (additive-only phases, no destructive rewrites to `deep-review`).
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Structured three-axis scoping decision tree with a non-interactive arg form

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-11 |
| **Deciders** | Operator (via frozen design brief) |

---

<!-- ANCHOR:adr-002-context -->
### Context

The mode needs to resolve "what to audit against what standard, where" before it can run. A free-text prompt would be ambiguous and hard to make headless-safe; the operator explicitly asked for multiple authorities per run (for example "sk-code and sk-git and/or sk-design").

### Constraints

- Must support N lanes per run, not just one authority at a time.
- Must have a non-interactive form for cron/headless invocation, with the interactive question as the fallback.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: A structured decision tree over exactly three axes — artifact class (docs/code/designs/git-history), standard authority (sk-doc/sk-git/sk-design/sk-code, extensible), and scope (paths/globs/branch-range). One run resolves to N alignment lanes, one lane per (authority x artifact-class x scope) combination the operator names.

**How it works**: The interactive path asks the three-axis question and resolves lanes from the answers. The non-interactive path accepts lanes directly as an argument (exact schema owned by open ADR-011, phase 004).
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Structured three-axis tree (chosen)** | Deterministic lane resolution; supports multiple authorities per run; headless-safe once the arg form exists | Requires designing and maintaining a small decision-tree UX | 9/10 |
| Free-text scoping prompt | Fastest to build | Ambiguous, not reliably headless-safe, hard to test | 3/10 |
| One authority per invocation only | Simplest lane model | Directly contradicts the operator's explicit multi-authority requirement | 2/10 |

**Why this one**: It is the only option that satisfies both the multi-authority requirement and the headless-safety requirement without inventing a bespoke query language.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A single run can audit `sk-code` and `sk-git` and `sk-design` lanes together, matching the operator's stated use case.
- Cron/headless callers get a stable, testable arg surface instead of having to script around an interactive prompt.

**What it costs**:
- The non-interactive schema needs its own design pass (open ADR-011) before phase 004 can implement it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Lane explosion (too many lanes in one run, blowing the iteration budget) | M | Phase 008's corpus-partitioning and convergence thresholds bound this, not the scoping phase itself |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Multi-authority, multi-lane scoping is an explicit operator requirement |
| 2 | **Beyond Local Maxima?** | PASS | Free-text and single-authority alternatives were considered and rejected on concrete grounds |
| 3 | **Sufficient?** | PASS | Three axes cover every locked example in the brief without over-designing a fourth |
| 4 | **Fits Goal?** | PASS | Matches the operator's literal multi-authority example |
| 5 | **Open Horizons?** | PASS | New artifact classes or authorities extend the same three-axis tree without restructuring it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `.opencode/skills/system-deep-loop/deep-alignment/scripts/scope-resolver.*` — new, phase 004.

**How to roll back**: Not yet implemented; revert this ADR's text before phase 004 runs.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Pluggable per-authority adapter contract

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-11 |
| **Deciders** | Operator (via frozen design brief) |

---

<!-- ANCHOR:adr-003-context -->
### Context

The engine must stay authority-agnostic so `sk-doc`/`sk-git`/`sk-design`/`sk-code` are the v1 set, not a hard ceiling — future authorities (`sk-prompt`, `system-spec-kit`) must be addable without touching the loop.

### Constraints

- The contract must separate "find the artifacts" from "find the standard" from "check the artifact against the standard" so each concern can be tested and swapped independently.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: A three-method adapter contract: `discover(scope) -> artifacts`, `standardSource(authority) -> { templates, rules }`, `check(artifact, rules) -> findings`.

**How it works**: The `ITERATE` state calls `discover` once per lane to seed the corpus, `standardSource` once per authority to load the rules, and `check` per artifact per iteration slice. Every authority adapter implements the same three methods; the loop never branches on which authority it is running.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Three-method adapter contract (chosen)** | Clean separation of discovery/standard/check; matches how the reference 130/131 pattern actually worked by hand | Four adapters must each implement all three methods | 9/10 |
| One monolithic `audit(lane) -> findings` method per authority | Fewer methods to implement | Collapses discovery, standard-loading, and checking into one opaque call; harder to test and reuse across authorities | 4/10 |
| Hard-wire the four v1 authorities directly into the loop, no adapter abstraction | Fastest initial build | Directly violates the "not hard-wired to four" requirement; blocks future authorities without a rewrite | 1/10 |

**Why this one**: It is the only option that keeps the engine authority-agnostic while still matching the concrete `discover`/`standardSource`/`check` shape the brief locks.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- New authorities register by implementing three methods, not by modifying the loop.
- `sk-doc`'s adapter (phase 005) becomes the reference implementation every later adapter can be checked against for shape-consistency.

**What it costs**:
- Some duplicated discovery logic is likely across adapters (for example glob-walking a scope) until a shared helper is worth extracting — deferred, not designed here.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Adapters drift in shape (inconsistent return types across `discover`/`check`) | M | Phase 005's reference adapter sets the return-shape precedent every later adapter phase is checked against |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Authority-agnostic extensibility is an explicit brief requirement |
| 2 | **Beyond Local Maxima?** | PASS | The monolithic and hard-wired alternatives were weighed and rejected |
| 3 | **Sufficient?** | PASS | Three methods are the minimum needed to separate the three genuinely distinct concerns |
| 4 | **Fits Goal?** | PASS | Matches the brief's exact locked contract shape |
| 5 | **Open Horizons?** | PASS | `sk-prompt`/`system-spec-kit` and any future authority slot in without engine changes |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `.opencode/skills/system-deep-loop/deep-alignment/adapters/{sk-doc,sk-git,sk-design,sk-code}/*` — new, phases 005-007.

**How to roll back**: Not yet implemented; revert this ADR's text before phase 005 runs.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Authority sequencing — sk-doc, sk-git, sk-design (static v1), sk-code

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-11 |
| **Deciders** | Operator (via frozen design brief) |

---

<!-- ANCHOR:adr-004-context -->
### Context

Four authorities need adapters. Building the hardest one first risks stalling the whole program on the least-deterministic surface before the adapter contract itself is proven.

### Constraints

- `sk-design`'s live-render (chrome-devtools-driven) audits are explicitly out of v1 scope; static DESIGN.md/token checks only.
- `sk-code`'s adapter must be honest about being reasoning-based, not a deterministic linter.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Sequence the four v1 authorities by determinism, most deterministic first: `sk-doc` (reference — `validate_document.py` + `extract_structure.py` DQI + `core_standards.md`), `sk-git` (deterministic — conventional-commit + worktree/branch rules already AI-scannable in `sk-git/SKILL.md`), `sk-design` (audit-rubric — DESIGN.md structure + tokens, STATIC-first, v1 defers live-render), `sk-code` (hardest — surface-detection via `sk-code/SKILL.md` §2 Smart Routing, reasoning-checked, honest limits).

**How it works**: Phase 005 builds the `sk-doc` adapter as the reference every later adapter's shape is checked against. Phase 006 builds `sk-git` and `sk-design` together since both are lower-risk than `sk-code`. Phase 007 builds `sk-code` last, once the contract has been proven three times already.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Determinism-ordered sequencing (chosen)** | Proves the adapter contract on easy cases before the hardest one; matches how the manual 130/131 precedent worked (sk-doc first) | One more phase-ordering decision to document | 9/10 |
| Build `sk-code` first (highest operator interest) | Front-loads the highest-value authority | Risks discovering contract gaps on the hardest case first, without a proven reference to check against | 4/10 |
| Build all four in parallel | Fastest wall-clock | No reference adapter exists yet to check shape-consistency against; high rework risk | 3/10 |

**Why this one**: A reference adapter proven on the most deterministic authority de-risks the harder ones that follow.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Phase 007's `sk-code` adapter inherits a proven contract shape instead of discovering contract gaps on the hardest case first.
- `sk-design`'s v1 static-only scope avoids a live-render dependency (chrome-devtools) that would otherwise couple this program to `mcp-tooling` availability.

**What it costs**:
- `sk-code` conformance checking — the authority the operator likely cares most about first — ships last in the v1 sequence.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Operator expects `sk-code` conformance sooner | L | This ADR documents the sequencing rationale explicitly so the ordering is a visible trade-off, not a silent deprioritization |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Some sequencing decision is required; four adapters cannot ship simultaneously from one phase |
| 2 | **Beyond Local Maxima?** | PASS | `sk-code`-first and fully-parallel alternatives were weighed and rejected on risk grounds |
| 3 | **Sufficient?** | PASS | Determinism-ordering is the simplest rule that both de-risks and matches the reference precedent |
| 4 | **Fits Goal?** | PASS | Matches the brief's exact locked sequencing |
| 5 | **Open Horizons?** | PASS | A fifth authority can slot in anywhere in the sequence based on its own determinism, no restructuring needed |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- Phase ordering only; no files change from this ADR directly. Phases 005-007 execute the sequence.

**How to roll back**: Re-order the phase children if evidence from an early adapter phase warrants it — a phase-ordering change, not a code rollback.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: The alignment contract — verify-first, known-deviation suppression, read-only default, gated remediation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-11 |
| **Deciders** | Operator (via frozen design brief) |

---

<!-- ANCHOR:adr-005-context -->
### Context

A naive conformance linter would flag intentional repo conventions (repo-wide TOC ban, compact pointer-cards, kebab-case, cli-family frontmatter, changelog plain-H2) as drift, and would risk asserting findings that are not actually true against live reality. The manual 130/131 precedent proved that verify-first re-probing plus a known-deviation list is what separates real drift from noise.

### Constraints

- Findings must be re-probed against the real validator/CLI/registry before assertion, not asserted from static pattern-matching alone.
- Remediation must never run unattended when concurrent sessions are live (`main-branch-direct-push.md`/regression-baseline discipline already governs this repo's fix protocol).
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: Four first-class mode invariants, enforced by the engine, not left to individual adapters to opt into: (1) verify-first — every reality-drift finding is re-probed against live ground truth before assertion; (2) known-deviation suppression — a per-authority accepted-conventions list so intentional conventions are never flagged; (3) read-only by default; (4) gated remediation — opt-in, operator-approved, verify-first, never auto-`-A`/scoped-stage/worktree-when-diverged/doc-only-skip when concurrent sessions are live.

**How it works**: The `ITERATE` state's finding-emission path always re-probes before a finding is written to the registry. Each authority adapter's `standardSource` includes its own known-deviation list. `REMEDIATE` is a separate, optional state that never runs as part of the default `REPORT`-terminated loop.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Four engine-level invariants (chosen)** | Consistent guarantees across every authority; matches the proven manual pattern | Adapters cannot opt out of verify-first even when a check feels "obviously" true | 9/10 |
| Leave verify-first and suppression to each adapter's discretion | More adapter flexibility | Directly repeats the naive-linter failure mode the brief explicitly rejects | 2/10 |
| Auto-remediation by default with an opt-out flag | Fastest fix turnaround | Contradicts the read-only-default requirement and the concurrent-session safety discipline this repo already enforces elsewhere | 1/10 |

**Why this one**: The mode's entire value proposition — proving drift against live reality, separated from intentional convention — depends on these four invariants holding uniformly, not per-adapter.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- False-positive findings against intentional repo conventions are suppressed by design, not by adapter discipline.
- Remediation stays safe by default, matching this repo's existing concurrent-session and regression-baseline safety norms.

**What it costs**:
- Every finding costs an extra verify-first re-probe, which is slower than asserting from the first pattern match.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An adapter's known-deviation list goes stale as conventions evolve | M | Each adapter's `standardSource` is versioned alongside its authority's own standards; staleness is visible as a maintenance task, not silent |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The manual 130/131 precedent needed exactly this discipline to avoid false positives |
| 2 | **Beyond Local Maxima?** | PASS | Adapter-discretion and auto-remediation alternatives were weighed and rejected |
| 3 | **Sufficient?** | PASS | Four invariants are the minimum set the brief names; no fifth invariant is invented here |
| 4 | **Fits Goal?** | PASS | Matches the brief's exact locked alignment contract |
| 5 | **Open Horizons?** | PASS | The invariants apply uniformly to any future authority, no per-adapter renegotiation needed |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- The `ITERATE` and `REMEDIATE` state implementations in `.opencode/skills/system-deep-loop/deep-alignment/scripts/` — new, phase 008.

**How to roll back**: Not yet implemented; revert this ADR's text before phase 008 runs.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: State machine and packet-local artifact layout

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-11 |
| **Deciders** | Operator (via frozen design brief) |

---

<!-- ANCHOR:adr-006-context -->
### Context

The loop needs a named state sequence and a state-storage location. Gate 4 (this repo's constitutional rule) forbids manual `/tmp` state for skill-owned workflows.

### Constraints

- State must live in the bound spec folder, matching `deep-review`'s own `review/` subdirectory convention (config, findings registry, state JSONL, iterations, prompts, dispatch receipts).
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: `INIT -> SCOPE -> DISCOVER -> ITERATE -> CONVERGE -> REPORT -> [optional] REMEDIATE`, with all state under the bound spec folder's `alignment/` subdirectory.

**How it works**: `INIT` resolves the bound spec folder. `SCOPE` resolves lanes (ADR-002). `DISCOVER` runs `adapter.discover` per lane (ADR-003). `ITERATE` partitions the corpus and runs `adapter.check` per slice, verify-first (ADR-005). `CONVERGE` reuses `runtime/scripts/convergence.cjs`'s coverage/dry-run/max-iterations thresholds. `REPORT` emits `alignment-report.md` per lane. `REMEDIATE` is optional and gated (ADR-005).
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Seven-state machine, spec-folder-bound `alignment/` (chosen)** | Directly mirrors `deep-review`'s proven `review/` layout; Gate-4-compliant | One more named directory convention to document | 9/10 |
| Fewer states (collapse SCOPE into INIT, or DISCOVER into ITERATE) | Simpler diagram | Blurs genuinely distinct concerns (lane resolution vs. corpus discovery vs. per-slice checking), harder to reason about mid-loop failures | 4/10 |
| State under `/tmp` or a non-spec-folder location | Nothing to clean up in the repo | Directly violates Gate 4 (no manual `/tmp` state) | 1/10 |

**Why this one**: It is the direct `deep-review`-pattern match, and the only option that is Gate-4-compliant without inventing a new storage convention.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- Resume behavior can reuse `deep-review`'s existing state-recovery patterns almost directly, since the layout matches.
- No new Gate-4 exception needs to be argued for.

**What it costs**:
- Nothing material — this mirrors an already-proven layout.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| `alignment/` and `review/` naming collide conceptually for a reader skimming a spec folder | L | Directory name is explicit (`alignment/`, not `review/`), and phase 003's `SKILL.md` states the boundary plainly (ADR-007) |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A named state machine and a Gate-4-compliant storage location are both required to run the loop at all |
| 2 | **Beyond Local Maxima?** | PASS | Fewer-state and non-spec-folder alternatives were weighed and rejected |
| 3 | **Sufficient?** | PASS | Seven states are the minimum that keep lane-resolution, discovery, checking, and convergence separately reasoned about |
| 4 | **Fits Goal?** | PASS | Matches the brief's exact locked state sequence |
| 5 | **Open Horizons?** | PASS | `REMEDIATE` is already modeled as optional, so a future mandatory-remediation mode (if ever wanted) would be a policy change, not a structural one |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- `<spec-folder>/alignment/{deep-alignment-config.json,deep-alignment-findings-registry.json,deep-alignment-state.jsonl,iterations/,prompts/,dispatch-receipts/,alignment-report.md}` — new, phase 008.

**How to roll back**: Not yet implemented; revert this ADR's text before phase 008 runs.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: Explicit boundary against parent-skill-check.cjs and deep-review

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-11 |
| **Deciders** | Operator (via frozen design brief) |

---

<!-- ANCHOR:adr-007-context -->
### Context

Two existing systems sound adjacent to `deep-alignment` and must be distinguished explicitly so later readers and future adapter authors do not conflate them: `.opencode/commands/doctor/scripts/parent-skill-check.cjs` (hub structure) and `deep-review` (general correctness).

### Constraints

- The distinction must be stateable in one sentence per system for `SKILL.md` to carry forward in phase 003.
<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We chose**: `deep-alignment` is NOT `parent-skill-check.cjs` — that script checks hub *structure* (folders, registries, routing wiring). `deep-alignment` is NOT `deep-review` — that mode audits general code/doc correctness. `deep-alignment` audits artifact *content* conformance against a *named* authority's own templates and creation standards.

**How it works**: `SKILL.md`'s "When To Use" section (phase 003) states this boundary explicitly, mirroring how `.opencode/skills/system-deep-loop/deep-review/SKILL.md:22` frames its own scope for `deep-review`.
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Explicit written boundary (chosen)** | Prevents advisor confusion and future scope creep in either direction | Requires disciplined SKILL.md prose upkeep | 9/10 |
| Leave the boundary implicit, rely on naming alone | Zero extra documentation | The 012-parent-hub-compat program already proved "audit"/"review" vocabulary collisions are real and costly to fix after the fact | 2/10 |
| Merge `deep-alignment` into `parent-skill-check.cjs`'s scope | One fewer system to reason about | Conflates a static structural checker (script, no loop, no lanes) with an iterative conformance-audit mode-packet — mechanically incompatible shapes | 1/10 |

**Why this one**: The 012-parent-hub-compat program's own finding (vocab collisions are a half-landed-migration risk, not a hypothetical one) makes an explicit written boundary the only credible option.
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

**What improves**:
- Advisor routing and human readers both get a one-sentence-per-system disambiguation instead of inferring it from behavior.

**What it costs**:
- Nothing material — this is documentation discipline, not a structural cost.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The boundary prose drifts from actual behavior as the mode evolves | L | Phase 009's cutover gate re-checks `SKILL.md` prose against the shipped mode before advisor routing goes live |
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Real vocab-collision precedent exists in this repo's own history (012-parent-hub-compat) |
| 2 | **Beyond Local Maxima?** | PASS | Implicit-boundary and merge-into-parent-skill-check alternatives were weighed and rejected |
| 3 | **Sufficient?** | PASS | A one-sentence-per-system boundary is the minimum needed to disambiguate |
| 4 | **Fits Goal?** | PASS | Matches the brief's exact locked boundary framing |
| 5 | **Open Horizons?** | PASS | The boundary statement extends cleanly if a third adjacent system appears later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-007-five-checks -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**:
- `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md` "When To Use" section — new, phase 003.

**How to roll back**: Not yet implemented; revert this ADR's text before phase 003 runs.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008 (Open): sk-code adapter automatability limits

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Open (Deferred) |
| **Date** | 2026-07-11 |
| **Deciders** | Not yet decided — owned by phase 007 |

---

<!-- ANCHOR:adr-008-context -->
### Context

`sk-code`'s standards surface (its `SKILL.md` §2 Smart Routing surface-detection markers plus each surface's reference patterns) is judgment-heavy compared to `sk-doc`'s deterministic validators. The brief flags this as genuinely open: "how deterministic can pattern-conformance be?"

### Constraints

- Any answer must preserve ADR-005's honesty requirement — the adapter must state what it checks deterministically versus what it checks by reasoning, not claim false determinism.
<!-- /ANCHOR:adr-008-context -->

---

<!-- ANCHOR:adr-008-decision -->
### Decision

**We defer this decision to phase 007.** No automatability ceiling or floor is set here. Phase 007 must design the `sk-code` adapter's `check()` method against real surfaces and report back what fraction of its checks are deterministic pattern-matches versus reasoning-agent judgment calls, then this ADR is closed or amended with that evidence.
<!-- /ANCHOR:adr-008-decision -->

---

<!-- ANCHOR:adr-008-alternatives -->
### Alternatives Considered

Not yet scored — alternatives depend on phase 007's concrete findings against real `sk-code` surfaces, which do not exist until that phase runs. Candidate shapes noted for phase 007 to evaluate: (a) fully reasoning-agent-based `check()` with no deterministic component, (b) a hybrid where surface-detection is deterministic but pattern-conformance is reasoning-based, (c) a deterministic-only subset with judgment-heavy checks explicitly out of v1 scope.
<!-- /ANCHOR:adr-008-alternatives -->

---

<!-- ANCHOR:adr-008-consequences -->
### Consequences

**What staying open costs**: Phase 007 cannot be fully planned until this resolves; its own plan.md must treat the automatability question as its first design task, not an implementation detail.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Phase 007 assumes false determinism to hit a deadline | H | ADR-005's honesty requirement is a hard engine-level invariant, not something phase 007 can silently relax |
<!-- /ANCHOR:adr-008-consequences -->

---

<!-- ANCHOR:adr-008-five-checks -->
### Five Checks Evaluation

Not applicable — this ADR records an open question, not a decision. The five-checks evaluation applies once phase 007 proposes a concrete answer.
<!-- /ANCHOR:adr-008-five-checks -->

---

<!-- ANCHOR:adr-008-impl -->
### Implementation

**What changes**: Nothing yet.

**How to roll back**: N/A — no implementation exists to roll back.
<!-- /ANCHOR:adr-008-impl -->
<!-- /ANCHOR:adr-008 -->

---

<!-- ANCHOR:adr-009 -->
## ADR-009 (Open): sk-design live-render audit scope beyond v1 static-only

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Open (Deferred) |
| **Date** | 2026-07-11 |
| **Deciders** | Not yet decided — owned by a later phase, not pre-scoped |

---

<!-- ANCHOR:adr-009-context -->
### Context

ADR-004 already locks v1's `sk-design` adapter to static DESIGN.md/token checks only. What remains genuinely open is whether and when a live-render (chrome-devtools-driven) audit dimension joins as a v2+ extension, and which phase would own it.

### Constraints

- Any live-render extension must go through `design-mcp-open-design`'s existing dispatch boundary (`sk-design/shared/design_dispatch_boundary.md`) rather than inventing a parallel chrome-devtools path.
<!-- /ANCHOR:adr-009-context -->

---

<!-- ANCHOR:adr-009-decision -->
### Decision

**We defer this decision entirely.** No v2+ phase is pre-scoped for live-render audits. This ADR exists so the v1 static-only scope (ADR-004) is not mistaken for a permanent ceiling.
<!-- /ANCHOR:adr-009-decision -->

---

<!-- ANCHOR:adr-009-alternatives -->
### Alternatives Considered

Not yet scored — no v2+ phase exists to evaluate concrete alternatives against. Candidate shapes for a future decision: (a) a new phase added to this program's numbering, (b) a follow-on packet under `sk-design` that `deep-alignment`'s adapter calls into, (c) staying static-only permanently if the operator judges the value insufficient.
<!-- /ANCHOR:adr-009-alternatives -->

---

<!-- ANCHOR:adr-009-consequences -->
### Consequences

**What staying open costs**: Nothing blocks the current 9-phase program — v1's static scope is already locked by ADR-004. This ADR only prevents future readers from assuming static-only is permanent without evidence.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future contributor silently bolts on live-render checks without going through the dispatch boundary | L | ADR-009's constraint section names the required boundary explicitly for whoever picks this up |
<!-- /ANCHOR:adr-009-consequences -->

---

<!-- ANCHOR:adr-009-five-checks -->
### Five Checks Evaluation

Not applicable — this ADR records an open question with no owning phase yet proposed.
<!-- /ANCHOR:adr-009-five-checks -->

---

<!-- ANCHOR:adr-009-impl -->
### Implementation

**What changes**: Nothing yet.

**How to roll back**: N/A — no implementation exists to roll back.
<!-- /ANCHOR:adr-009-impl -->
<!-- /ANCHOR:adr-009 -->

---

<!-- ANCHOR:adr-010 -->
## ADR-010 (Open): Exact reuse boundary with the deep-review runtime engine

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Open (Deferred) |
| **Date** | 2026-07-11 |
| **Deciders** | Not yet decided — owned by phase 008 |

---

<!-- ANCHOR:adr-010-context -->
### Context

Phase 001's research confirmed that not every loop primitive lives in the shared `.opencode/skills/system-deep-loop/runtime/scripts/` directory — `reduce-state.cjs` is mode-local at `.opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs`, not shared runtime. This means "reuse the deep-review runtime engine" is not a single uniform import; some primitives are truly shared (`loop-lock.cjs`, `convergence.cjs`, `verify-iteration.cjs`, `upsert.cjs`) and at least one (`reduce-state.cjs`) is mode-local and would need to be forked or promoted to shared.

### Constraints

- Whatever boundary phase 008 chooses, it must not require modifying `deep-review`'s own behavior to accommodate `deep-alignment`.
<!-- /ANCHOR:adr-010-context -->

---

<!-- ANCHOR:adr-010-decision -->
### Decision

**We defer this decision to phase 008.** No fork-vs-share call is made here for the mode-local scripts. Phase 008 must decide, per mode-local script it needs, whether to fork a `deep-alignment`-local copy or promote the script to shared `runtime/scripts/` (which would also change `deep-review`'s own import, a cross-mode change requiring its own care).
<!-- /ANCHOR:adr-010-decision -->

---

<!-- ANCHOR:adr-010-alternatives -->
### Alternatives Considered

Not yet scored — the concrete list of mode-local scripts `deep-alignment` actually needs is not known until phase 008 designs the loop wiring. Candidate shapes for phase 008 to evaluate: (a) fork `reduce-state.cjs` into a `deep-alignment`-local copy, accepting drift risk; (b) promote it to shared `runtime/scripts/`, accepting a cross-mode change to `deep-review`'s import path; (c) write a new `deep-alignment`-specific reducer from scratch if the shapes diverge enough that reuse is not actually cheaper.
<!-- /ANCHOR:adr-010-alternatives -->

---

<!-- ANCHOR:adr-010-consequences -->
### Consequences

**What staying open costs**: Phase 008 cannot be fully planned until this resolves; its own plan.md must treat the reuse-boundary question as its first design task.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Phase 008 assumes full shared-runtime reuse without checking, then discovers `reduce-state.cjs` is mode-local mid-implementation | M | Phase 001's confirmed finding is cited directly in this ADR so phase 008 starts from the correct fact, not an assumption |
<!-- /ANCHOR:adr-010-consequences -->

---

<!-- ANCHOR:adr-010-five-checks -->
### Five Checks Evaluation

Not applicable — this ADR records an open question, not a decision. The five-checks evaluation applies once phase 008 proposes a concrete fork-vs-share answer.
<!-- /ANCHOR:adr-010-five-checks -->

---

<!-- ANCHOR:adr-010-impl -->
### Implementation

**What changes**: Nothing yet.

**How to roll back**: N/A — no implementation exists to roll back.
<!-- /ANCHOR:adr-010-impl -->
<!-- /ANCHOR:adr-010 -->

---

<!-- ANCHOR:adr-011 -->
## ADR-011 (Open): Non-interactive lane-arg schema

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Open (Deferred) |
| **Date** | 2026-07-11 |
| **Deciders** | Not yet decided — owned by phase 004 |

---

<!-- ANCHOR:adr-011-context -->
### Context

ADR-002 locks the three-axis scoping tree and requires a non-interactive arg form for headless/cron invocation, but the exact schema (flag names, lane-array shape, how multiple lanes serialize on one command line) is not decided here.

### Constraints

- The schema must express the same three axes (artifact class, standard authority, scope) the interactive question resolves, with no information loss.
<!-- /ANCHOR:adr-011-context -->

---

<!-- ANCHOR:adr-011-decision -->
### Decision

**We defer this decision to phase 004.** No flag names or serialization format are chosen here. Phase 004 must design the schema alongside the interactive decision tree so both paths resolve to the same internal lane representation.
<!-- /ANCHOR:adr-011-decision -->

---

<!-- ANCHOR:adr-011-alternatives -->
### Alternatives Considered

Not yet scored — phase 004 has not yet designed the interactive tree this schema must mirror. Candidate shapes for phase 004 to evaluate: (a) a single `--lanes` JSON-array flag, (b) repeated `--lane authority=X,class=Y,scope=Z` flags, (c) a lane-config file path flag for very large lane sets.
<!-- /ANCHOR:adr-011-alternatives -->

---

<!-- ANCHOR:adr-011-consequences -->
### Consequences

**What staying open costs**: Phase 009's `/deep:alignment` command cannot fully specify its argument surface until this resolves.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The non-interactive schema is designed after the interactive tree and ends up unable to express something the tree can | M | ADR-011's constraint section requires zero information loss between the two paths, checked at phase 004's own verification step |
<!-- /ANCHOR:adr-011-consequences -->

---

<!-- ANCHOR:adr-011-five-checks -->
### Five Checks Evaluation

Not applicable — this ADR records an open question, not a decision. The five-checks evaluation applies once phase 004 proposes a concrete schema.
<!-- /ANCHOR:adr-011-five-checks -->

---

<!-- ANCHOR:adr-011-impl -->
### Implementation

**What changes**: Nothing yet.

**How to roll back**: N/A — no implementation exists to roll back.
<!-- /ANCHOR:adr-011-impl -->
<!-- /ANCHOR:adr-011 -->

---

<!-- ANCHOR:adr-012 -->
## ADR-012 (Open): New-authority adapter registration governance

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Open (Deferred) |
| **Date** | 2026-07-11 |
| **Deciders** | Not yet decided — owned by a later phase, not pre-scoped |

---

<!-- ANCHOR:adr-012-context -->
### Context

ADR-003 locks the adapter contract as authority-agnostic, extensible beyond the v1 four. What remains open is the governance process: who decides a fifth authority (for example `sk-prompt` or `system-spec-kit`) is worth an adapter, and what quality bar a new adapter must clear before it ships.

### Constraints

- Any governance process must not require engine changes to add an authority — that guarantee is already locked by ADR-003.
<!-- /ANCHOR:adr-012-context -->

---

<!-- ANCHOR:adr-012-decision -->
### Decision

**We defer this decision entirely.** No governance process is designed here. This ADR exists so a future contributor does not assume adapter registration is either fully open (anyone can add one) or fully closed (only this program's authors can) without an explicit ruling.
<!-- /ANCHOR:adr-012-decision -->

---

<!-- ANCHOR:adr-012-alternatives -->
### Alternatives Considered

Not yet scored — no governance proposal has been drafted. Candidate shapes for a future decision: (a) treat new adapters like any other skill-code contribution, reviewed under normal PR discipline; (b) require a short adapter-specific decision-record justifying the new authority's determinism profile, mirroring this phase's own ADR-004 sequencing rationale; (c) require the new authority's own parent skill to name and maintain its adapter directly rather than `deep-alignment` owning all adapters centrally.
<!-- /ANCHOR:adr-012-alternatives -->

---

<!-- ANCHOR:adr-012-consequences -->
### Consequences

**What staying open costs**: Nothing blocks the current 9-phase program — v1's four authorities are already locked by ADR-004. This ADR only prevents silent, ungoverned adapter sprawl later.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Adapters accumulate without a consistent quality bar once the contract proves easy to implement against | L | This ADR flags the governance gap explicitly so it is a visible follow-up, not a silent omission |
<!-- /ANCHOR:adr-012-consequences -->

---

<!-- ANCHOR:adr-012-five-checks -->
### Five Checks Evaluation

Not applicable — this ADR records an open question with no owning phase yet proposed.
<!-- /ANCHOR:adr-012-five-checks -->

---

<!-- ANCHOR:adr-012-impl -->
### Implementation

**What changes**: Nothing yet.

**How to roll back**: N/A — no implementation exists to roll back.
<!-- /ANCHOR:adr-012-impl -->
<!-- /ANCHOR:adr-012 -->

---

<!--
Level 3 Decision Record: 12 ADRs — ADR-001 through ADR-007 accepted (the frozen brief's locked decisions),
ADR-008 through ADR-012 explicitly open (the frozen brief's open questions), each owned by a named later phase.
Write in human voice: active, direct, specific.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
