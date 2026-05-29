---
title: "Decision Record: scripts physical lane reorg"
description: "Architecture decisions for moving the deep-agent-improvement scripts into lane subdirs: lane classification, TST-1-preserving spawn-time lane resolution, the dispatch-model silent-config-failure trap, and keeping lib and tests at the scripts root."
trigger_phrases:
  - "scripts-physical-reorg decisions"
  - "scripts lane reorg adr"
  - "deep-agent-improvement scripts decision record"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/013-scripts-physical-reorg"
    last_updated_at: "2026-05-29T10:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffold 013 decision-record for scripts physical lane reorg"
    next_safe_action: "git mv scripts into lane subdirs and fix __dirname path joins"
    blockers: []
    key_files:
      - ".opencode/skills/deep-agent-improvement/scripts/loop-host.cjs"
      - ".opencode/skills/deep-agent-improvement/scripts/dispatch-model.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-scripts-physical-reorg"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: scripts physical lane reorg

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Lane Classification of the 16 Scripts

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-29 |
| **Deciders** | Owner, claude-opus |

---

<!-- ANCHOR:adr-001-context -->
### Context

Phases 010-012 split references, assets, the agent note, the catalog, and the advisor by lane, but the 16 scripts plus the scorer subtree are still flat at `scripts/`. We need a classification that puts each script under the lane it actually serves, so the tree mirrors the two co-equal lanes.

### Constraints
- Classification must reflect runtime ownership, not just naming: a script that loop-host spawns on the model-benchmark path may still be shared if both lanes use it.
- The scorer subtree must move wholesale into model-benchmark so its internal relative requires (`./harness.cjs`, `../lib/cache.cjs`) stay valid.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Three lane subdirs - agent-improvement (8 scripts), model-benchmark (2 scripts + scorer/), shared (6 scripts).

**How it works**: agent-improvement holds score-candidate, generate-profile, rollback-candidate, candidate-lineage, scan-integration, check-mirror-drift, trade-off-detector, benchmark-stability. model-benchmark holds dispatch-model, run-benchmark, and the scorer/ subtree moved as one unit. shared holds loop-host, promote-candidate, materialize-benchmark-fixtures, reduce-state, improvement-journal, mutation-coverage - scripts both lanes invoke or that orchestrate across lanes.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Three-lane subdirs (chosen)** | Tree mirrors the two-lane prose; matches 010-012 layout | Requires path-join and cross-reference repair | 9/10 |
| Two lanes only, shared folded into agent-improvement | Fewer dirs | loop-host and materialize would be mislabeled as agent-only | 5/10 |
| Leave scripts flat | Zero move risk | Last surface stays inconsistent; lane invisible on disk | 3/10 |

**Why this one**: A dedicated shared lane is the only honest home for loop-host (which orchestrates both modes) and materialize-benchmark-fixtures (which loop-host spawns on the benchmark path but is fixture infra). It also matches the references/assets layout shipped in 010.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A reader can tell a script's lane from the tree alone.
- The scripts tree finally matches the references/assets lane split.

**What it costs**:
- Every `__dirname`-relative path and cross-reference must be repaired. Mitigation: full grep inventory before the move and a green vitest suite after.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| materialize misclassified | M | shared is correct: it is fixture infra loop-host spawns, not benchmark-only logic |
| scorer relative requires break | M | move scorer/ wholesale so internal requires stay valid |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Scripts are the last flat surface after 010-012 |
| 2 | **Beyond Local Maxima?** | PASS | Two-lane and flat alternatives weighed and rejected |
| 3 | **Sufficient?** | PASS | Three subdirs cover all 16 scripts plus scorer |
| 4 | **Fits Goal?** | PASS | On the critical path to a fully lane-visible skill |
| 5 | **Open Horizons?** | PASS | Mirrors the established lane layout; no new pattern |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `scripts/agent-improvement/`, `scripts/model-benchmark/`, `scripts/shared/` created via git mv.
- scorer/ moved into model-benchmark/scorer/ as one unit.

**How to roll back**: `git mv` each script back to `scripts/`, then revert the matching path-join and cross-reference edits. Moves are history-preserving.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: TST-1-Preserving Lane Resolution at Spawn Time

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-29 |
| **Deciders** | Owner, claude-opus |

---

### Context

`loop-host.cjs` is moving to the shared lane, but it spawns children across all three lanes: score-candidate (agent-improvement), materialize-benchmark-fixtures (shared), and run-benchmark (model-benchmark). Its `planInvocation(mode, args)` is a pure planner that returns ordered steps with bare script names, and the TST-1 backward-compat test asserts the default and explicit agent-improvement plans are byte-identical. If lane paths leak into the plan, that identity breaks.

### Constraints
- `planInvocation` must keep returning bare script names so the TST-1 identity test stays byte-identical.
- Children live in different lanes, so a single `path.join(SCRIPTS_ROOT, name)` against the shared dir would miss two of three.

---

### Decision

**We chose**: Resolve each child script's lane path in the spawn layer (`runNode` / `runPlan`), not in `planInvocation`.

**How it works**: `planInvocation` continues to emit `{ script: 'score-candidate.cjs', args }` style steps with bare names. A new lane-resolution map in the spawn layer translates each bare name to its `scripts/<lane>/<name>` path right before `spawnSync`. The plan stays byte-identical; only execution knows about lanes.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Spawn-time lane resolution (chosen)** | Keeps planInvocation byte-identical; TST-1 stays green | Adds a name to lane-path map | 9/10 |
| Put lane paths in planInvocation steps | Single resolution point | Breaks TST-1 byte-identity; plan now leaks lane layout | 2/10 |
| Keep all loop-host children in one lane | No spawn-layer change | Forces a wrong lane on at least two children | 3/10 |

**Why this one**: TST-1 is a hard backward-compat gate. Resolving in the spawn layer is the only option that keeps the plan byte-identical while still pointing each spawn at its real lane path.

---

### Consequences

**What improves**:
- TST-1 identity test stays green with no plan change.
- Lane knowledge is isolated to the execution boundary.

**What it costs**:
- A small name-to-lane map must stay in sync with the moves. Mitigation: derive it from the same lane classification in ADR-001.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Map drifts from actual lane | M | single source: ADR-001 classification; covered by the suite |
| A child spawned at wrong path | H | non-zero exit surfaces loudly; loop-host aborts remaining steps |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | loop-host spawns across all three lanes |
| 2 | **Beyond Local Maxima?** | PASS | plan-level resolution considered and rejected for TST-1 |
| 3 | **Sufficient?** | PASS | spawn-layer map covers every child |
| 4 | **Fits Goal?** | PASS | preserves the backward-compat contract the build shipped |
| 5 | **Open Horizons?** | PASS | execution-boundary resolution is reusable for future lanes |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `loop-host.cjs` runNode/runPlan gain a bare-name to lane-path resolver.
- `planInvocation` is unchanged.

**How to roll back**: Revert the resolver edit and move loop-host back to the scripts root; the bare `path.join(SCRIPTS_ROOT, name)` then works again at the flat layout.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Guarding the dispatch-model Silent-Config-Failure Trap

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-29 |
| **Deciders** | Owner, claude-opus |

---

### Context

`dispatch-model.cjs` sets `SCRIPTS_ROOT = __dirname` and then resolves `path.join(SCRIPTS_ROOT, '..', 'state')` and `path.join(SCRIPTS_ROOT, '..', 'assets', 'agent-improvement', 'improvement_config.json')`. At the flat layout `..` is the skill root. After moving into `scripts/model-benchmark/`, `..` becomes the scripts root, so both paths miss. `loadConfig` wraps the read in try/catch and returns `{}` on any failure, so a wrong depth produces no error: dispatch silently runs with default model, agent, timeout, and backoff while the journal and dashboard claim the configured values.

### Constraints
- The config is genuinely optional (the catch is intentional for the no-config case), so we cannot simply throw on a missing file.
- We must distinguish "no config exists" from "config exists but the path is wrong after the move".

---

### Decision

**We chose**: Fix the `..` depth to account for the new subdir level AND add a positive test that asserts the real config loads, not just that the script runs.

**How it works**: After moving into `scripts/model-benchmark/`, the state and assets joins gain one more `..` (or resolve from a computed skill-root anchor) so they point at the skill root again. A regression test materializes a known `improvement_config.json` and asserts dispatch-model reads the expected `modelBenchmarkConfig` values, catching any future silent fallback to `{}`.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Fix depth + positive config-load test (chosen)** | Closes the silent trap and proves config loads | One more test | 9/10 |
| Fix depth only | Minimal change | A future move could silently break it again with no signal | 4/10 |
| Make loadConfig throw on read error | Loud failure | Breaks the legitimate no-config case | 3/10 |

**Why this one**: The danger here is silence, not a crash. Only a positive assertion that the config actually loaded converts a silent failure into a caught one while preserving the optional-config behavior.

---

### Consequences

**What improves**:
- A wrong path now fails a test instead of silently degrading dispatch.
- The journal/dashboard config claims stay truthful.

**What it costs**:
- One regression test to maintain. Mitigation: it pins the exact trap this move risks.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Depth fixed but test omitted | H | the test is a P0 acceptance item (REQ-003) |
| Future move re-breaks the depth | M | positive config-load test fails loudly on regression |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | the `..` depth changes with the move; failure is silent |
| 2 | **Beyond Local Maxima?** | PASS | throw-on-error and fix-only weighed and rejected |
| 3 | **Sufficient?** | PASS | depth fix plus positive assert covers the trap |
| 4 | **Fits Goal?** | PASS | protects the model-benchmark lane the move touches |
| 5 | **Open Horizons?** | PASS | the assert guards against any future relayout |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `dispatch-model.cjs` state and assets path joins gain the correct depth.
- A regression test asserts the real config loads.

**How to roll back**: Revert the depth edit and move dispatch-model back to the scripts root, where the original `..` depth is correct.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: lib and tests Stay at the Scripts Root

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-29 |
| **Deciders** | Owner, claude-opus |

---

### Context

`lib/` (typed-errors, promotion-gates, mirror-sync-verify) is shared infra imported via `./lib/` by callers at the scripts root, and `tests/` resolves every script by absolute repo path. Moving lib into a lane would force lane callers to reach across lanes; moving tests would churn 14 absolute-path resolvers for no structural gain.

### Constraints
- lib is imported by scripts in more than one lane.
- tests resolve scripts by absolute repo path, so they are layout-agnostic except for the path strings they hold.

---

### Decision

**We chose**: Keep `lib/`, `tests/`, `vitest.config.mjs`, `node_modules`, and `README.md` at the scripts root.

**How it works**: Moved scripts reference lib via `../lib/` (one level up from their lane subdir) instead of `./lib/`. tests keep their absolute resolver strings, updated only to the new lane paths of the scripts they target.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **lib + tests stay at root (chosen)** | lib stays single-source for all lanes; minimal test churn | movers use `../lib/` instead of `./lib/` | 9/10 |
| Move lib into shared lane | lib under a lane label | cross-lane reach; deeper relative requires | 4/10 |
| Co-locate tests with their lane scripts | tests near code | 14 resolvers churned; tests are layout-agnostic anyway | 3/10 |

**Why this one**: lib is genuinely cross-lane infra, so the scripts root is its honest home. tests resolve by absolute path, so co-location buys nothing and costs churn.

---

### Consequences

**What improves**:
- lib remains a single shared dependency for every lane.
- Test churn is limited to the script path strings that actually moved.

**What it costs**:
- Moved scripts use `../lib/` rather than `./lib/`. Mitigation: a mechanical, grep-verifiable edit.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A mover keeps `./lib/` after moving | M | grep `require('./lib` in lane subdirs returns zero |
| A test resolver path missed | M | full suite run surfaces an unresolved-path failure |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | lib is imported across lanes; tests are layout-agnostic |
| 2 | **Beyond Local Maxima?** | PASS | move-lib and co-locate-tests considered and rejected |
| 3 | **Sufficient?** | PASS | root retains exactly the shared and test infra |
| 4 | **Fits Goal?** | PASS | keeps the reorg scoped to lane-owned scripts |
| 5 | **Open Horizons?** | PASS | lib stays reusable as new lanes are added |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- No move for lib, tests, vitest.config.mjs, node_modules, README.md.
- Moved scripts switch `./lib/` requires to `../lib/`.

**How to roll back**: Revert the `../lib/` edits back to `./lib/` when scripts return to the root; no lib or test files moved, so there is nothing to restore.
<!-- /ANCHOR:adr-004 -->

---

<!--
Level 3 Decision Record: one ADR per major decision.
Write in human voice: active, direct, specific.
-->
