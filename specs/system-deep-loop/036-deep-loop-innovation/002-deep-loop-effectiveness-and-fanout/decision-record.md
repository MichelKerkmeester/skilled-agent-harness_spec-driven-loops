---
title: "Decision Record: Deep-Loop Effectiveness & Fan-out Automation (targeted follow-on)"
description: "Method decisions for the 20-iteration non-converging follow-on: single-lineage SOL xhigh per operator directive (ADR-001), building on 065 as a new child 005 rather than the reserved 002 slot (ADR-002), and a research + scratch-prototype-only guardrail that leaves the shipped fanout-run.cjs unmodified as a gated follow-on (ADR-003)."
trigger_phrases:
  - "deep loop effectiveness decisions"
  - "single lineage sol xhigh decision"
  - "new child 005 not 002"
  - "fanout fix gated follow-on"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout"
    last_updated_at: "2026-07-15T08:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Run 20/20 done; ADR-001/002/003 Accepted; prototype exit 0 recorded"
    next_safe_action: "Finish close-out doc; then strict recursive validate"
    blockers: []
    key_files:
      - "spec.md"
      - "scratch/fanout-prototype.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "065-005-dr"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "ADR-001: single-lineage SOL gpt-5.6-sol xhigh (fast) per operator directive; LUNA/GLM appear only in the scratch prototype demo, never the research iters."
      - "ADR-002: new child 005 (not the reserved 002 slot) so 001's completed+validated docs keep their 'phase 002 = synthesis' cross-references intact."
      - "ADR-003: research + scratch-prototype only; the shipped fanout-run.cjs is unmodified; the small fan-out fix is a gated follow-on."
---
# Decision Record: Deep-Loop Effectiveness & Fan-out Automation (targeted follow-on)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Single-lineage SOL xhigh for the research iterations

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-15 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

001 ran three lineages (LUNA 25 / SOL 10 / GLM 10) for breadth. This follow-on is about DEPTH on three operator-chosen threads, seeded from 001 so it deepens rather than re-surveys. The operator directed a single, strongest lineage for the deepening iterations to keep the run coherent and the transport contention with a concurrent packet-138 session minimal.

### Constraints

- One lineage for all 20 research iterations; no per-iteration model switching.
- GPT dispatch only via cli-codex (carried from the 001 mandate).
- The transport (cli-codex ChatGPT-OAuth) is shared with a concurrent session — serial dispatch, no blanket-kill.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: a single lineage — GPT-5.6 SOL (`gpt-5.6-sol`) at `xhigh` reasoning on the `fast` service tier, via cli-codex `codex --search exec` (top-level `--search` for live web mining) — for all 20 deepening iterations.

**How it works**: the 001 Shape-B driver dispatches one SOL iteration at a time with the top-level `--search` flag, seeds each from the accumulated findings registry, and emits loop-equivalent state. LUNA and GLM appear ONLY inside the throwaway `scratch/fanout-prototype.cjs`, which demonstrates heterogeneous multi-model dispatch but does not run any of the 20 research iterations.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Single-lineage SOL xhigh (chosen)** | Coherent deepening; strongest single reasoning tier; minimal shared-OAuth contention; matches the operator directive | One perspective on the research iters (mitigated: prototype demonstrates multi-model separately) | 9/10 |
| Repeat 001's three-lineage split | Three perspectives | Re-survey risk against a depth mission; heavier shared-OAuth load; contradicts the directive | 3/10 |
| Per-iteration model switching in one lineage | Would blend perspectives | NOT native (config immutable, single scalar model); needs hand-rolled switching beyond the authorized driver | 1/10 |

**Why this one**: the mission is depth on three threads, and a single strong lineage with live search delivers that without the re-survey and contention costs of a multi-lineage run.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Coherent, seeded deepening across all 20 iterations; every catalogued repo is new vs 001.
- Minimal contention with the concurrent packet-138 session on the shared OAuth transport.

**What it costs**:
- A single model perspective on the research iterations. Mitigation: the prototype demonstrates heterogeneous multi-model dispatch separately, and phase 002 can widen lineages if needed.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Single lineage narrows angle diversity | M | Divergent mode + per-thread directives; 001's three-lineage catalogue remains the breadth base |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A lineage must be chosen; the operator directed one |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared above |
| 3 | **Sufficient?** | PASS | One supported executor config; no engine changes |
| 4 | **Fits Goal?** | PASS | Depth mission served by the strongest single tier |
| 5 | **Open Horizons?** | PASS | Phase 002 can widen lineages later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Executor config at launch only; verified in `research/deep-research-config.json` (one `gpt-5.6-sol` / `xhigh` / `fast` generation, 20 iterations).

**How to roll back**: Stop the run; relaunch with a different lineage config. State is packet-local and additive.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Build on 065 as a new child 005, not the reserved 002 slot

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-15 |
| **Deciders** | Operator + orchestrator |

---

<!-- ANCHOR:adr-002-context -->
### Context

065's parent map reserves `002-synthesis-and-improvement-mapping`, `003-improvement-proposals`, and `004-implementation` as Planned slots. 001's completed and strict-validated docs cross-reference `002` as the synthesis-and-mapping successor. This deepening follow-on needed a home without disturbing that already-shipped map.

### Constraints

- 001 is Complete and strict-validated; its cross-references must not be invalidated.
- The reserved 002-004 slots carry a specific, documented meaning in the parent map.
- Phase-parent detection and the lean-trio parent policy must stay intact.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: create this work as a NEW child `002-deep-loop-effectiveness-and-fanout`, leaving the reserved `002`/`003`/`004` map rows untouched.

**How it works**: 005 is a sibling of 001 under the 065 phase parent, seeded from 001's registry. The parent map gains a 005 row (Status Complete) while the reserved slots keep their Planned meaning; 001's "phase 002 = synthesis" cross-references stay valid because nothing renumbered them.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **New child 005 (chosen)** | Zero disturbance to 001's shipped docs or the reserved-slot semantics; clean sibling under the phase parent | One more child folder in the map | 9/10 |
| Reuse the reserved `002` slot for this run | No new number | Collides with the documented "002 = synthesis-and-mapping" meaning; would ripple stale cross-references through 001's completed+validated docs | 2/10 |
| Fold this run into 001 | No new folder | 001 is Complete; re-opening it breaks its close-out and validation baseline | 1/10 |

**Why this one**: it adds the work without renumbering or re-opening anything already shipped.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- 001's completed docs and the reserved-slot semantics remain untouched and valid.
- The phase parent cleanly gains a second complete child under the lean-trio policy.

**What it costs**:
- The child numbering is non-contiguous (001 then 005). Mitigation: the parent map documents each row's purpose, so the gap is self-explaining.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Readers expect contiguous child numbers | L | Parent map purpose column explains 005; reserved 002-004 stay Planned |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The work needs a home that does not disturb 001 |
| 2 | **Beyond Local Maxima?** | PASS | Three placements compared above |
| 3 | **Sufficient?** | PASS | A new child fully contains the run + prototype |
| 4 | **Fits Goal?** | PASS | Deepens 001 without renumbering reserved slots |
| 5 | **Open Horizons?** | PASS | Reserved 002-004 remain free for their planned purpose |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- One new child folder `005-...`; one added row in `../spec.md` PHASE DOCUMENTATION MAP; `005-...` added to the parent `graph-metadata.json` `children_ids`.

**How to roll back**: Remove the 005 row + `children_ids` entry and the child folder; nothing in 001 or the reserved slots was touched.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Research + scratch-prototype only; shipped fanout-run.cjs unmodified

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-15 |
| **Deciders** | Operator + orchestrator |

---

<!-- ANCHOR:adr-003-context -->
### Context

Thread 1 asks whether the automated fanout can reproduce the manual multi-model live-search run. Investigating that surfaced the exact gap: the shipped `runtime/scripts/fanout-run.cjs` already carries per-lineage model + reasoning effort and dispatches a distinct executor per lineage; the only missing piece for automated multi-model live-search is a live-tool (`--search`) policy plus a capability matrix, executor adapters, and a manifest compiler. Applying that fix would edit shipped runtime code, which this research phase must not do.

### Constraints

- Zero writes outside this spec folder (SC-005); shipped runtime/skill code is READ-ONLY.
- The operator wants proof the automation is feasible, not a production change this phase.
- The prototype must demonstrate the mechanism without importing runtime risk.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: deliver the fan-out answer as a DESIGN + a throwaway `scratch/fanout-prototype.cjs`, and leave `runtime/scripts/fanout-run.cjs` unmodified. The production fix is a gated follow-on for phase 003.

**How it works**: the prototype implements the four missing pieces in miniature (capability matrix, per-kind adapters with invocation fingerprints, manifest compiler, provenance-preserving reducer) and ran a live 3-model fleet — SOL xhigh + LUNA max via `codex --search exec`, GLM max via `opencode` — at exit 0, parsing 3/3 and merging 2 repos with provenance. It touches zero runtime code and serves as the reference design for the gated change.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Design + throwaway scratch prototype (chosen)** | Proves feasibility end-to-end; zero runtime risk; honors the research-only scope lock | The fix is not live yet (deferred to a gated phase) | 9/10 |
| Patch `fanout-run.cjs` now | Ships the fix immediately | Violates the research-only scope lock (SC-005); un-reviewed runtime change riding on a research packet | 1/10 |
| Answer by design doc only, no prototype | Lightest touch | Leaves feasibility unproven — the operator's core question | 4/10 |

**Why this one**: it answers the operator's question with a working demonstration while keeping every write inside the spec folder.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Feasibility is proven with a live run, not asserted; the reference design is ready for phase 003.
- The scope lock stays intact — no shipped runtime code changed.

**What it costs**:
- The production fanout still lacks the live-tool path until the gated follow-on lands. Mitigation: research.md §8 ranks it first (effort S-M) with the prototype as the reference.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Prototype tempts scope-creep into the shipped runtime | H | Prototype confined to `scratch/`; runtime edits explicitly out of scope (gated follow-on) |
| Design drifts from the real runtime before phase 003 | L | Prototype records the exact argv + capability matrix; validate against `fanout-run.cjs` at build time |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The fan-out question needs proof, not just a design |
| 2 | **Beyond Local Maxima?** | PASS | Three delivery options compared above |
| 3 | **Sufficient?** | PASS | A scratch prototype demonstrates the full mechanism |
| 4 | **Fits Goal?** | PASS | Answers feasibility while holding the scope lock |
| 5 | **Open Horizons?** | PASS | Leaves the runtime untouched for a reviewed follow-on |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- Only `scratch/fanout-prototype.cjs` + `scratch/fanout-prototype-result.json` are created; `runtime/scripts/fanout-run.cjs` is untouched (scoped `git status` at close).

**How to roll back**: Delete the `scratch/` prototype; nothing in the shipped runtime changed, so there is nothing else to revert.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
