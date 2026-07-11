---
title: "Decision Record: deep-alignment architecture"
description: "Twelve ADRs freezing the deep-alignment mode-packet architecture: all twelve now Accepted — the original seven locked by the frozen design brief (new-packet shape, scoping tree, adapter contract, authority sequencing, alignment contract, state machine, explicit boundary), plus five the operator resolved on 2026-07-11 (sk-code hybrid check(), a new sk-design live-render adapter phase, reduce-state.cjs promoted to shared runtime, config-file-only non-interactive lanes, adapter-registration governance)."
trigger_phrases:
  - "deep-alignment architecture decision record"
  - "alignment adapter contract adr"
  - "deep-alignment state machine adr"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/002-architecture-decision"
    last_updated_at: "2026-07-11T13:16:04Z"
    last_updated_by: "claude"
    recent_action: "Resolved final 5 ADRs (008-012); all 12 now Accepted"
    next_safe_action: "Route for operator approval before phase 003"
    blockers:
      - "Human approval required before phase 003 starts"
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-002-architecture-decision"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "ADR-008 sk-code adapter automatability limits: HYBRID (deterministic surface-detection + reasoning-based pattern-conformance, honestly labeled)"
      - "ADR-009 sk-design live-render audit scope: new phase 010-adapter-sk-design-live-render added"
      - "ADR-010 deep-review runtime reuse boundary: reduce-state.cjs promoted to shared runtime/scripts/"
      - "ADR-011 non-interactive lane-arg schema: --lane-config <file.json> only"
      - "ADR-012 new-authority adapter registration governance: short adapter decision-record required"
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

**We chose**: Four first-class mode invariants, enforced by the engine, not left to individual adapters to opt into: (1) verify-first — every reality-drift finding is re-probed against live ground truth before assertion; (2) known-deviation suppression — a per-authority accepted-conventions list so intentional conventions are never flagged; (3) read-only by default; (4) gated remediation — opt-in, operator-approved, verify-first, with hard safety discipline: never `git add -A` (scoped staging only), a worktree when the branch has diverged, and doc-only/skip-shared-files restraint when concurrent sessions are live.

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
## ADR-008: sk-code adapter automatability limits — HYBRID

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-11 |
| **Deciders** | Operator, 2026-07-11 |

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

**We chose**: HYBRID. The sk-code adapter's `check()` is a two-layer pass — deterministic surface-detection (reusing sk-code's shared smart-router markers, `.opencode/skills/sk-code/shared/references/smart_routing.md` and `stack_detection.md`) layered with reasoning-based pattern-conformance for everything the deterministic layer does not cover. Every finding is honestly labeled by producing layer per ADR-005's honesty invariant — no false determinism.

**How it works**: Phase 007 no longer chooses between fully-reasoning, hybrid, or deterministic-only shapes for the adapter — that choice is closed. Phase 007 designs the *specific* deterministic-vs-reasoning split within this locked hybrid frame: layer 1 (deterministic) covers surface detection plus whatever pattern-drift checker already exists for that surface (`verify_alignment_drift.py` for OPENCODE, the Webflow minification/verification script chain for WEBFLOW); layer 2 (reasoning-agent) covers architectural/pattern conformance the deterministic layer does not reach. Every finding is tagged `layer: deterministic` or `layer: reasoning-agent`.
<!-- /ANCHOR:adr-008-decision -->

---

<!-- ANCHOR:adr-008-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Hybrid: deterministic surface-detection + reasoning-based pattern-conformance (chosen)** | Reuses proven, reproducible detection and pattern-drift tooling where it exists; keeps the remaining judgment-heavy checks honestly labeled rather than blended in or overclaimed | Two layers to design, build, and keep in sync as the deterministic layer's coverage grows | 9/10 |
| Fully reasoning-agent-based `check()` with no deterministic component | Simplest single-layer design | Throws away real, reproducible tooling (`verify_alignment_drift.py`, the Webflow script chain) that already exists and works | 3/10 |
| Deterministic-only subset, judgment-heavy checks explicitly out of v1 scope | Fully reproducible, no non-determinism risk | Drops most of what "does this code follow the surface's stack patterns" actually means; the adapter would cover a thin slice of real conformance | 4/10 |

**Why this one**: sk-code already has real, reproducible deterministic tooling for parts of conformance and genuinely judgment-heavy territory for the rest; a hybrid with honest layer-tagging is the only option that uses the deterministic tooling without pretending the rest is deterministic too.
<!-- /ANCHOR:adr-008-alternatives -->

---

<!-- ANCHOR:adr-008-consequences -->
### Consequences

**What improves**:
- The adapter reuses real, proven tooling (`verify_alignment_drift.py`, the Webflow script chain) instead of rebuilding pattern-drift detection from scratch.
- Downstream convergence logic (phase 008) can weight deterministic-layer findings more heavily than reasoning-agent findings, since every finding is layer-tagged.

**What it costs**:
- Two layers to design, build, and keep synchronized as the deterministic layer's real-world coverage evolves.
- Deterministic coverage is asymmetric across surfaces (OPENCODE has a general-purpose checker; WEBFLOW's is narrower), which the automatability-limits statement must state plainly rather than smooth over.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Phase 007 quietly widens the "deterministic" label to cover reasoning-agent findings | H | ADR-005's honesty requirement is a hard engine-level invariant; every finding must carry its real producing layer, verified at phase 007's dry-run step |
<!-- /ANCHOR:adr-008-consequences -->

---

<!-- ANCHOR:adr-008-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without a resolved determinism model, phase 007 cannot honestly describe what `check()` does |
| 2 | **Beyond Local Maxima?** | PASS | The fully-reasoning and deterministic-only alternatives were weighed and rejected on concrete grounds |
| 3 | **Sufficient?** | PASS | Two layers, each tagged, is the minimum shape that both reuses existing tooling and stays honest about what remains judgment |
| 4 | **Fits Goal?** | PASS | Matches the operator's explicit resolution and ADR-005's pre-existing honesty invariant |
| 5 | **Open Horizons?** | PASS | A future surface with fuller deterministic tooling simply grows layer 1's coverage; the two-layer shape does not need to change |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-008-five-checks -->

---

<!-- ANCHOR:adr-008-impl -->
### Implementation

**What changes**:
- `.opencode/skills/system-deep-loop/deep-alignment/adapters/sk-code/*` — phase 007 designs the two-layer `check()` (deterministic surface-detection + pattern-drift, reasoning-agent conformance) within this locked hybrid frame; phase 007's own `spec.md`/`plan.md` name the exact split and the accepted-deviation set.

**How to roll back**: Not yet implemented; revert this ADR's text and phase 007's hybrid framing before phase 007's execution pass runs.
<!-- /ANCHOR:adr-008-impl -->
<!-- /ANCHOR:adr-008 -->

---

<!-- ANCHOR:adr-009 -->
## ADR-009: sk-design live-render audit scope — new phase 010

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-11 |
| **Deciders** | Operator, 2026-07-11 |

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

**We chose**: Add a new phase, `010-adapter-sk-design-live-render`, as a peer adapter of 006 (static sk-design) and 007 (sk-code), joining this program's v1 authority set with a live-render dimension for `sk-design`. Live-render (chrome-devtools-driven) audits route exclusively through the existing `design-mcp-open-design` dispatch boundary (`.opencode/skills/sk-design/shared/design_dispatch_boundary.md`, `.opencode/skills/sk-design/SKILL.md:30` — "a read-only bridge, always paired with a design-judgment mode that owns the taste") — never a parallel chrome-devtools path. ADR-004's v1 static scope is unchanged and stays phase 006's scope; live-render is phase 010's scope, not a phase-006 amendment.

**How it works**: Phase 006's "live-render deferred indefinitely" language is replaced with "live-render split into its own phase 010." Phase 010 plans a third `sk-design`-authority adapter using the same `{discover, standardSource, check}` contract (ADR-003); its `check()` renders the target UI via `design-mcp-open-design` (which drives chrome-devtools underneath) and audits it against `sk-design`'s live rubric (accessibility, performance, responsive, anti-slop — `.opencode/skills/sk-design/design-audit/references/`). Its findings feed phase 008's reducer as a peer lane alongside 006's static findings and 007's sk-code findings; phase 009's cutover gates now cover phase 010 too.
<!-- /ANCHOR:adr-009-decision -->

---

<!-- ANCHOR:adr-009-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A new phase added to this program's numbering (chosen)** | Keeps every `deep-alignment` adapter inside one coherent, sequentially-numbered program; reuses this packet's already-frozen ADR-003 contract and phase-008 reducer/convergence wiring directly | One more phase to plan and eventually build | 9/10 |
| A follow-on packet under `sk-design` that `deep-alignment`'s adapter calls into | Keeps live-render logic co-located with `sk-design`'s own audit mode | Splits one authority's adapter across two packets/owners, complicating the ADR-003 contract boundary and phase-008's per-lane reducer wiring | 4/10 |
| Stay static-only permanently | Zero additional scope | Contradicts the operator's explicit resolution and leaves a real, requested capability (live-render conformance) off the roadmap indefinitely | 1/10 |

**Why this one**: A same-program phase keeps the adapter contract, the reducer, and the cutover gates uniform across all `sk-design` dimensions, and mirrors how this program already sequences authorities by phase rather than by owning skill.
<!-- /ANCHOR:adr-009-alternatives -->

---

<!-- ANCHOR:adr-009-consequences -->
### Consequences

**What improves**:
- `sk-design` conformance checking gets a live-render dimension without destabilizing phase 006's already-planned static adapter or its v1 boundary.
- The dispatch boundary constraint (route only through `design-mcp-open-design`) is enforced at the ADR level before phase 010 is even planned in detail, preventing a parallel chrome-devtools path from being invented later.

**What it costs**:
- The program grows from 9 to 10 phases, and phase 009's cutover gate scope grows to cover phase 010's artifacts too.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future contributor bolts on a parallel chrome-devtools path instead of routing through `design-mcp-open-design` | M | This ADR's Decision anchor names the required boundary explicitly; phase 010's own spec restates it as a hard scope constraint |
<!-- /ANCHOR:adr-009-consequences -->

---

<!-- ANCHOR:adr-009-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Live-render conformance is a real, requested capability that static DESIGN.md/token checks structurally cannot cover (rendered accessibility, performance, responsive behavior) |
| 2 | **Beyond Local Maxima?** | PASS | The sk-design-owned-packet and stay-static-only alternatives were weighed and rejected on concrete grounds |
| 3 | **Sufficient?** | PASS | One new peer phase, reusing the existing contract and dispatch boundary, is the minimum structural change |
| 4 | **Fits Goal?** | PASS | Matches the operator's explicit resolution |
| 5 | **Open Horizons?** | PASS | Future sk-design dimensions (if any) can slot in as further peer phases without restructuring 006/007/010 |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-009-five-checks -->

---

<!-- ANCHOR:adr-009-impl -->
### Implementation

**What changes**:
- New spec folder `.opencode/specs/system-deep-loop/059-deep-alignment-mode/010-adapter-sk-design-live-render/` (this scaffold pass).
- Parent `spec.md`'s phase map extended from 9 to 10 phases.
- `.opencode/skills/system-deep-loop/deep-alignment/adapters/sk-design-live-render/*` — future, phase 010's own build.

**How to roll back**: Delete the `010-adapter-sk-design-live-render/` folder and revert the parent phase-map/graph-metadata entries before phase 010's execution pass runs; no live adapter code exists yet.
<!-- /ANCHOR:adr-009-impl -->
<!-- /ANCHOR:adr-009 -->

---

<!-- ANCHOR:adr-010 -->
## ADR-010: Exact reuse boundary with the deep-review runtime engine — promote to shared runtime

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-11 |
| **Deciders** | Operator, 2026-07-11 |

---

<!-- ANCHOR:adr-010-context -->
### Context

A scaffold-time read (recorded in phase 001's research plan and re-confirmed when that gate executes) shows that not every loop primitive lives in the shared `.opencode/skills/system-deep-loop/runtime/scripts/` directory — `reduce-state.cjs` is mode-local at `.opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs`, not shared runtime. This means "reuse the deep-review runtime engine" is not a single uniform import; some primitives are truly shared (`loop-lock.cjs`, `convergence.cjs`, `verify-iteration.cjs`, `upsert.cjs`) and at least one (`reduce-state.cjs`) is mode-local and would need to be forked or promoted to shared.

### Constraints

- Whatever boundary phase 008 chooses, it must not require modifying `deep-review`'s own behavior to accommodate `deep-alignment`.
<!-- /ANCHOR:adr-010-context -->

---

<!-- ANCHOR:adr-010-decision -->
### Decision

**We chose**: PROMOTE TO SHARED RUNTIME. Phase 008 relocates `reduce-state.cjs` (and any other mode-local primitive it needs) from `.opencode/skills/system-deep-loop/deep-review/scripts/` to shared `.opencode/skills/system-deep-loop/runtime/scripts/`, repointing `deep-review`'s own import to the new path. This is a BEHAVIOR-PRESERVING relocation — the file's logic and output do not change, only its location and `deep-review`'s require path — which honors this ADR's own constraint that `deep-review`'s behavior must not change to accommodate `deep-alignment`.

**How it works**: Phase 008 plans (and a future execution pass performs) the move `deep-review/scripts/reduce-state.cjs` -> `runtime/scripts/reduce-state.cjs`, updates `deep-review`'s caller(s) to the new path, and authors `deep-alignment`'s own lane-keyed alignment-report reducer as a sibling file in the same shared `runtime/scripts/` directory rather than a `deep-alignment`-local script. This establishes "reducers are shared-runtime primitives" as the going-forward convention instead of forking a mode-local copy per mode.
<!-- /ANCHOR:adr-010-decision -->

---

<!-- ANCHOR:adr-010-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Promote to shared `runtime/scripts/` (chosen)** | Both modes' reducers live under one shared convention going forward; `deep-alignment` does not fork logic it would otherwise have to keep in sync by hand | Touches `deep-review`'s own import path — a cross-mode change requiring its own care, even though behavior is unchanged | 9/10 |
| Fork `reduce-state.cjs` into a `deep-alignment`-local copy | Zero risk to `deep-review`'s existing import path | Two copies of near-identical reducer logic drift apart over time; repeats the exact "mode-local primitive" problem this ADR exists to resolve | 3/10 |
| Write a new `deep-alignment`-specific reducer from scratch | No dependency on `deep-review`'s reducer shape at all | Discards a proven, working pattern (`REQUIRED_DIMENSIONS`/`SEVERITY_WEIGHTS`) for no benefit, since the lane-keyed shape phase 008 already plans is a straightforward adaptation, not a divergent design | 4/10 |

**Why this one**: A behavior-preserving relocation gets `deep-alignment` a real, shared primitive to build its own reducer next to, without forking logic that would otherwise drift, and without requiring `deep-review`'s own behavior to change.
<!-- /ANCHOR:adr-010-alternatives -->

---

<!-- ANCHOR:adr-010-consequences -->
### Consequences

**What improves**:
- `reduce-state.cjs` and `deep-alignment`'s new lane-keyed reducer both live under the same shared `runtime/scripts/` convention, instead of one mode-local script sitting oddly apart from the rest of the shared engine.
- `deep-review`'s behavior is provably unchanged — only its import path moves — so this ADR's own "do not modify deep-review's behavior" constraint holds by construction.

**What it costs**:
- `deep-review`'s caller(s) need a one-line import-path update at build time; a small, low-risk, but real cross-mode touch-point.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future edit accidentally changes `reduce-state.cjs`'s logic during the relocation, not just its path | M | Phase 008's execution pass must verify `deep-review`'s reducer output is byte-identical before/after the move (diff test), not just that the file compiles |
<!-- /ANCHOR:adr-010-consequences -->

---

<!-- ANCHOR:adr-010-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The scaffold-time finding confirmed `reduce-state.cjs` is mode-local, not shared; some resolution was required before phase 008 could plan concretely |
| 2 | **Beyond Local Maxima?** | PASS | The fork and write-from-scratch alternatives were weighed and rejected on drift/reuse grounds |
| 3 | **Sufficient?** | PASS | A location move plus a sibling file is the minimum change that achieves a shared-runtime convention |
| 4 | **Fits Goal?** | PASS | Matches the operator's explicit resolution and this ADR's own "do not modify deep-review's behavior" constraint |
| 5 | **Open Horizons?** | PASS | Future modes needing a reducer follow the same shared-location convention without renegotiating fork-vs-share again |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-010-five-checks -->

---

<!-- ANCHOR:adr-010-impl -->
### Implementation

**What changes**:
- `.opencode/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs` — relocate to `.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` (phase 008 execution pass).
- `deep-review`'s caller(s) of `reduce-state.cjs` — repoint the require/import path only; no logic change.
- `.opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs` (new, phase 008) — `deep-alignment`'s own lane-keyed reducer, sibling to the relocated file.

**How to roll back**: Move `reduce-state.cjs` back to `deep-review/scripts/` and revert `deep-review`'s import path; delete the new alignment reducer. No behavior changes need reverting since none occur beyond the location move.
<!-- /ANCHOR:adr-010-impl -->
<!-- /ANCHOR:adr-010 -->

---

<!-- ANCHOR:adr-011 -->
## ADR-011: Non-interactive lane-arg schema — config-file only

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-11 |
| **Deciders** | Operator, 2026-07-11 |

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

**We chose**: CONFIG-FILE ONLY. The non-interactive path is a single `--lane-config <file.json>` flag carrying the lane array — not repeated `--lane` flags, not an inline `--lanes` JSON-array flag. The interactive scoping question (ADR-002) handles quick, ad-hoc runs; both paths resolve to the identical internal lane-tuple representation with zero information loss.

**How it works**: Phase 004 designs the `--lane-config` JSON schema: an array of `{authority, artifactClass, scope}` objects, one per lane, validated against the same three-axis rules (ADR-002) the interactive tree enforces, with SCOPE values validated against the repo root (NFR-S01) before any adapter's `discover()` runs.
<!-- /ANCHOR:adr-011-decision -->

---

<!-- ANCHOR:adr-011-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A lane-config file flag (chosen)** | Scales cleanly to large or repeated lane sets (cron/headless is the primary use case); one canonical serialization to validate and version, easy to diff/review in a PR | Requires writing a file rather than a single inline flag for a one-off run | 9/10 |
| A single `--lanes` inline JSON-array flag | No file needed for a quick run | Unwieldy and error-prone to hand-type or shell-escape for N>1 lanes; the exact case headless/cron runs need most | 4/10 |
| Repeated `--lane authority=X,class=Y,scope=Z` flags | Familiar CLI idiom | A custom per-flag mini-grammar to design, parse, and keep in sync with the three-axis rules separately from the config-file shape; more surface area for the same expressive power | 4/10 |

**Why this one**: Headless/cron invocation — the actual reason a non-interactive path exists — benefits from a versionable, diffable, reviewable file far more than from a terser inline flag; the interactive question already covers the quick, one-off case.
<!-- /ANCHOR:adr-011-alternatives -->

---

<!-- ANCHOR:adr-011-consequences -->
### Consequences

**What improves**:
- Cron/headless callers get one canonical, reviewable lane-config file format instead of choosing between three competing non-interactive shapes.
- Phase 009's `/deep:alignment` command can fully specify its argument surface (`--lane-config <file.json>`, otherwise fall back to the interactive question) without further design work.

**What it costs**:
- A one-off non-interactive run still needs a file on disk, not a single inline flag — an accepted tradeoff since headless/cron is the primary use case this path serves.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A malformed or stale `--lane-config` file silently resolves to fewer lanes than intended | M | Phase 004's schema validation fails closed on an unknown authority or malformed SCOPE value, per the existing edge-case rule for invalid AUTHORITY values |
<!-- /ANCHOR:adr-011-consequences -->

---

<!-- ANCHOR:adr-011-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | ADR-002 already requires a non-interactive form for headless/cron invocation; a concrete schema shape was needed to finish phase 004's plan |
| 2 | **Beyond Local Maxima?** | PASS | The inline-flag and repeated-flag alternatives were weighed and rejected on concrete headless/cron-fit grounds |
| 3 | **Sufficient?** | PASS | One config-file flag is the minimum surface that expresses the same three axes as the interactive tree with zero information loss |
| 4 | **Fits Goal?** | PASS | Matches the operator's explicit resolution and ADR-002's headless-safety requirement |
| 5 | **Open Horizons?** | PASS | The JSON schema can grow new optional fields per lane without breaking the flag surface |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-011-five-checks -->

---

<!-- ANCHOR:adr-011-impl -->
### Implementation

**What changes**:
- `.opencode/skills/system-deep-loop/deep-alignment/references/lane_config_schema.md` (new, phase 004) — the `--lane-config` JSON schema.
- `.opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs` (or equivalent; final location follows ADR-010's shared-runtime convention) — parses `--lane-config` into the internal lane-tuple representation.

**How to roll back**: Not yet implemented; revert this ADR's text before phase 004's execution pass runs.
<!-- /ANCHOR:adr-011-impl -->
<!-- /ANCHOR:adr-011 -->

---

<!-- ANCHOR:adr-012 -->
## ADR-012: New-authority adapter registration governance — short adapter decision-record

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-11 |
| **Deciders** | Operator, 2026-07-11 |

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

**We chose**: Registering a new authority adapter beyond the v1 four (plus phase 010's sk-design live-render dimension) requires shipping a short decision-record stating the new adapter's determinism profile — what it checks deterministically versus by reasoning — mirroring ADR-005's honesty rule and ADR-004's sequencing rationale. No engine change is required (already guaranteed by ADR-003's authority-agnostic contract); this is a documentation/governance gate, not a code gate.

**How it works**: A future contributor proposing a fifth (or later) adapter authors one short, ADR-sized decision-record — not a full Level-3 decision-record — before that adapter's `check()` ships, naming its deterministic-vs-reasoning split the same way ADR-008 now does for `sk-code`. This is the standing governance rule for this program going forward, not a deferred question.
<!-- /ANCHOR:adr-012-decision -->

---

<!-- ANCHOR:adr-012-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Require a short adapter-specific decision-record (chosen)** | Matches the honesty and sequencing discipline this program already applies to its own adapters (ADR-004, ADR-005, ADR-008); cheap for a real contributor, real deterrent to silent, undocumented sprawl | One more artifact a new-adapter contributor must write | 9/10 |
| Treat new adapters like any other skill-code contribution, reviewed under normal PR discipline | Zero new process | Drops the determinism-honesty discipline this program's own adapters (ADR-005, ADR-008) are held to; a new adapter could ship overclaiming determinism with no dedicated check for it | 3/10 |
| Require the new authority's own parent skill to name and maintain its adapter directly | Keeps adapter ownership close to the authority's own domain experts | Fragments adapter governance across every parent skill instead of one consistent rule for this program; contradicts ADR-003's authority-agnostic, centrally-defined contract | 3/10 |

**Why this one**: A short decision-record is cheap to produce, mirrors discipline this program already applies to itself, and is the only option that keeps the honesty-about-determinism bar consistent across every adapter, current and future.
<!-- /ANCHOR:adr-012-alternatives -->

---

<!-- ANCHOR:adr-012-consequences -->
### Consequences

**What improves**:
- Every adapter, present and future, is held to the same honesty-about-determinism bar (ADR-005, ADR-008), not just the v1 four plus phase 010.
- A future contributor has an unambiguous, cheap process to follow instead of guessing whether adapter registration is open or closed.

**What it costs**:
- One short decision-record per new adapter — a small, deliberate friction, not a rebuild-the-engine cost (ADR-003 already guarantees no engine change is needed).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A contributor skips the decision-record and ships an adapter anyway | L | This ADR is the citable governance rule; `parent-skill-check.cjs`/`validate.sh` gates at cutover time are the enforcement backstop for any packet claiming a new adapter is done |
<!-- /ANCHOR:adr-012-consequences -->

---

<!-- ANCHOR:adr-012-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without an explicit rule, adapter registration is ambiguous between "fully open" and "fully closed," inviting either sprawl or unnecessary gatekeeping |
| 2 | **Beyond Local Maxima?** | PASS | The no-new-process and skill-owned-governance alternatives were weighed and rejected on discipline-consistency grounds |
| 3 | **Sufficient?** | PASS | One short decision-record is the minimum artifact that carries the honesty-about-determinism discipline forward |
| 4 | **Fits Goal?** | PASS | Matches the operator's explicit resolution and mirrors this program's own ADR-004/ADR-005/ADR-008 discipline |
| 5 | **Open Horizons?** | PASS | Any future authority, however novel, follows the same one-artifact governance rule with no restructuring |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-012-five-checks -->

---

<!-- ANCHOR:adr-012-impl -->
### Implementation

**What changes**: No code changes. This ADR is itself the governance artifact; future adapter proposals cite it as the required process.

**How to roll back**: Revert this ADR's text to Open if the operator later decides a heavier or lighter governance process is warranted.
<!-- /ANCHOR:adr-012-impl -->
<!-- /ANCHOR:adr-012 -->

---

<!--
Level 3 Decision Record: 12 ADRs — all twelve Accepted. ADR-001 through ADR-007 were locked by the frozen
design brief; ADR-008 through ADR-012 were the brief's explicitly open questions, resolved by the operator
on 2026-07-11 (sk-code hybrid check(); new phase 010 for sk-design live-render; reduce-state.cjs promoted
to shared runtime/scripts/; config-file-only non-interactive lanes; short adapter decision-record governance).
Write in human voice: active, direct, specific.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
