---
title: "Decision Record: Compiled Routing Flag Propagation & Effective Consumption"
description: "Three decisions governing how the compiled decision is threaded to an agent boundary: thread a top-level metadata.compiledRouteSummary rather than the full object across brief surfaces, consume 002's serving-state fingerprint for cache invalidation rather than recomputing, and render the 4-action outcome as an additive brief line rather than a structured field."
trigger_phrases:
  - "compiled routing consumption decision record"
  - "compiledRouteSummary threading decision"
  - "serving-state fingerprint cache decision"
importance_tier: "critical"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/003-flag-propagation-and-effective-consumption"
    last_updated_at: "2026-07-20T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the three threading/cache/render decisions as Proposed"
    next_safe_action: "Settle the three ADRs with the operator before Phase 2"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 20
    open_questions:
      - "Full compiledRoute object or a top-level metadata.compiledRouteSummary?"
    answered_questions: []
---
# Decision Record: Compiled Routing Flag Propagation & Effective Consumption

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Thread a top-level `metadata.compiledRouteSummary`, not the full `compiledRoute` object

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed, recommended (settle before Phase 2) |
| **Date** | 2026-07-20 |
| **Deciders** | Claude Opus 4.8; operator retains the decision |

---

<!-- ANCHOR:adr-001-context -->
### Context

The advisor attaches the compiled decision additively as `{ ...recommendation, compiledRoute }` (`handlers/advisor-recommend.ts:371`). Two rebuild sites drop it: the bridge's `buildNativeBrief` rebuilds each recommendation through a hand-listed field allowlist that omits `compiledRoute` (`mk-skill-advisor-bridge.mjs:539-551`), and the CLI `AdvisorRecommendation` interface in `subprocess.ts` has no `compiledRoute` field. To un-drop the decision, this phase must carry it through the native brief, the CLI interface, and the hook render. The synthesis (CF-ACT-1) explicitly offers a choice: thread `compiledRoute` **or** a top-level `metadata.compiledRouteSummary`.

### Constraints

- The change must be additive and byte-identical to legacy on routing fields; the brief must never recompute `skill`/`workflowMode`.
- The field crosses a TypeScript interface boundary (`subprocess.ts`) and two serialization boundaries (native + CLI briefs), so its shape is a maintenance surface.
- The consumer that matters is the hook render, which needs only the 4-action outcome (route / clarify / defer / reject) plus enough identity to be legible, not the full internal decision object.

<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Thread a compact, top-level `metadata.compiledRouteSummary` carrying the served outcome (route / clarify / defer / reject), the target identity, the serving authority, and the manifest fingerprint — rather than passing the entire `compiledRoute` object through every surface.

**How it works**: `enrichCompiledRoutes` continues to attach the full `compiledRoute` upstream. At the brief boundary, the bridge and CLI carry only the summary as an additive top-level field, so exactly one small, typed shape crosses the `AdvisorRecommendation` interface and both serialization boundaries. The hook renders the summary. A consumer that needs the full object still has it at the advisor layer, before the brief boundary.

<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Top-level `metadata.compiledRouteSummary` (chosen)** | One small typed shape crosses the interface; minimal field surface; the hook gets exactly what it renders | A summary schema to define and keep in sync with the outcome enum | 8/10 |
| Thread the full `compiledRoute` object everywhere | Nothing to summarize; the whole decision is available downstream | A large internal shape crosses the CLI interface and both briefs; more to keep byte-stable and to review for accidental routing-field leakage | 6/10 |
| Re-resolve the compiled route at the hook | No field crosses the brief boundary at all | Duplicates the resolve on the hot path; risks a second read under the spec tree; diverges from the advisor's already-attached decision | 3/10 |

**Why this one**: The brief boundary should carry the smallest thing the consumer renders. A summary keeps the CLI interface change tiny and auditable, makes accidental routing-field leakage structurally unlikely, and leaves the full object exactly where it already lives.

<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The `subprocess.ts` interface gains one small optional field, not a large object; the diff is auditable.
- The hook renders a shape designed for rendering, so the 4-action outcome is legible without unpacking internals.

**What it costs**:
- A summary schema must be defined and kept in sync with the compiled outcome enum. Mitigation: derive the summary from the same enum the resolver emits, with a shape test.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Summary omits a field a downstream consumer later needs | M | The full `compiledRoute` remains at the advisor layer; a later phase can widen the summary additively |
| Summary and full object disagree | L | Derive the summary from the resolver's decision in one place; assert equality of the shared fields in a test |

<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The decision is dropped at two confirmed rebuild sites; something must cross the brief boundary to reach an agent |
| 2 | **Beyond Local Maxima?** | PASS | The full-object and re-resolve options are weighed and scored, not dismissed |
| 3 | **Sufficient?** | PASS | The summary carries the outcome, identity, authority, and fingerprint the hook and cache need |
| 4 | **Fits Goal?** | PASS | Directly delivers the compiled decision to system-context, which is the phase's whole point |
| 5 | **Open Horizons?** | PASS | The summary can be widened additively; the full object stays available upstream |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- The bridge `buildNativeBrief` rebuild and the CLI `AdvisorRecommendation` interface each gain an optional top-level `metadata.compiledRouteSummary`.
- The hook renders the summary's 4-action outcome.

**How to roll back**: Remove the summary field from the interface, the brief rebuild, and the hook render; the brief returns to today's byte-identical legacy shape.

<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Consume 002's serving-state fingerprint for cache invalidation, do not recompute

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed, recommended (implemented in Phase 2, coordinated with 002) |
| **Date** | 2026-07-20 |
| **Deciders** | Claude Opus 4.8; operator retains the decision |

---

<!-- ANCHOR:adr-002-context -->
### Context

Once the compiled decision flows to the brief, two caches can serve it staleley. The advisor-brief cache keys on the prompt (`mk-skill-advisor.js` `cacheKeyForPrompt`, `:271`) with no serving-state input; the runtime `engineCache` is a bare `Map` with no invalidation hook (`011-runtime-engine/lib/compiled-route.cjs:33`). After a manifest flip or a `=0` kill, a cached compiled brief would be re-served — defeating the very kill-switch the program is named for (CF-ACT-10). The 002 foundation ships a serving-status probe that already computes an effective-serving-state / manifest fingerprint per hub.

### Constraints

- No touched runtime path may read under `.opencode/specs`; the fingerprint source must live in 002's promoted closure, not the spec tree.
- The fingerprint must be cheap on the decision path — reused, not a second recompute.

<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Fold 002's serving-state fingerprint into both cache keys (`cacheKeyForPrompt` and the `engineCache` invalidation input), rather than recomputing a fingerprint locally in this phase.

**How it works**: 002 exposes the per-hub serving-state fingerprint from its promoted status probe. This phase reads that value and includes it in the cache key, so a flip or `=0` changes the fingerprint and forces a miss. There is one source of serving truth, and the cache reads no spec-tree path.

<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Consume 002's fingerprint (chosen)** | One source of serving truth; no second recompute; no spec-tree read | Introduces an ordering dependency on 002's probe interface | 9/10 |
| Recompute a fingerprint locally in this phase | No dependency on 002's interface shape | Two fingerprint computations that can disagree; risks re-adding a spec-tree read | 4/10 |
| TTL-only expiry, no fingerprint | Simplest; no new key input | A flip/`=0` still serves a stale compiled brief for the TTL window — the exact kill-switch hole | 2/10 |

**Why this one**: Cache correctness under a flip must track the served authority, and 002 already computes that authority. Reusing it keeps one source of truth and avoids a second, drift-prone recompute or a TTL hole that defeats the kill-switch.

<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A manifest flip or `=0` is a guaranteed cache miss; the kill-switch is honored immediately, not after a TTL.
- The advisor-brief cache and the engine cache invalidate on the same signal, so they cannot disagree about the served authority.

**What it costs**:
- An ordering dependency on 002's fingerprint interface. Mitigation: 002 is already this phase's hard prerequisite, so no new sequencing is introduced.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| 002's fingerprint shape changes after wiring | L | Consume it behind a small typed accessor; a shape change is one call-site update with a test |
| Fingerprint read adds latency on the hot path | L | Reuse the value the status probe already computed; do not recompute per request |

<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Both caches lack a serving-state input; a flip/`=0` would re-serve a stale compiled brief |
| 2 | **Beyond Local Maxima?** | PASS | The local-recompute and TTL-only options are weighed and rejected for drift and kill-switch holes |
| 3 | **Sufficient?** | PASS | One shared fingerprint invalidates both caches on the exact events that matter |
| 4 | **Fits Goal?** | PASS | A consumed decision is only correct if the kill-switch and flips take effect immediately |
| 5 | **Open Horizons?** | PASS | A single serving-state signal generalizes to any future cache that must track served authority |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `cacheKeyForPrompt` (`mk-skill-advisor.js:271`) and the `engineCache` invalidation input (`compiled-route.cjs:33`) include 002's serving-state fingerprint.

**How to roll back**: Remove the fingerprint from the cache keys; the caches revert to prompt-only keying (the current behavior). Because consumption is additive, the fallback is behavior-neutral for legacy serving.

<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Render the 4-action outcome as an additive brief line, not a structured field

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed, recommended (settle before Phase 2) |
| **Date** | 2026-07-20 |
| **Deciders** | Claude Opus 4.8; operator retains the decision |

---

<!-- ANCHOR:adr-003-context -->
### Context

The hook injects a skill-advisor brief into an agent's system-context (`.opencode/plugins/mk-skill-advisor.js`). This phase must surface the compiled decision's 4-action outcome (route / clarify / defer / reject) there. The brief today is legacy-shaped; a matched hub's compiled decision is byte-identical to legacy on routing fields, so the outcome is additive information, not a replacement.

### Constraints

- Absent a compiled decision, the injected brief must be byte-identical to today (the additive path degrades cleanly to legacy).
- The render must not imply the compiled decision changed the route when it did not; it reports the served authority and outcome, not a new routing target.

<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Render the compiled outcome as an additive, human-legible brief line, rather than introducing a new structured field the runtime must interpret.

**How it works**: When a compiled decision is served, the hook appends one legible line reporting the outcome (route / clarify / defer / reject) and the served authority. When no compiled decision is present, no line is added and the brief is byte-identical to legacy.

<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Additive brief line (chosen)** | Byte-identical legacy brief when absent; legible to the agent; no new runtime contract | Prose the agent reads rather than a machine field | 8/10 |
| A new structured field the runtime interprets | Machine-consumable; enables future automated gating | A new runtime contract to version and maintain; larger blast radius; premature for a phase whose job is only to make the decision visible | 5/10 |
| Render nothing; rely on the field being present | No render code | The decision reaches the brief object but is invisible to the agent — the effectiveness gap is not actually closed | 2/10 |

**Why this one**: The phase's job is to make the compiled decision reach and be visible at an agent boundary. An additive line does exactly that with the smallest contract and a clean legacy-identical fallback; a structured runtime field is a larger commitment that a later phase can make when there is an automated consumer for it.

<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- The agent sees the compiled outcome; the end-to-end effectiveness void (CF-ACT-1) is closed at the visible boundary.
- The legacy brief is untouched when no compiled decision is served, so the change cannot regress today's behavior.

**What it costs**:
- The outcome is prose, not a machine field. Mitigation: a later phase can add a structured field additively once an automated consumer exists.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The line implies the route changed | M | Word it as served-authority + outcome, never as a new routing target; parity gate proves the route is unchanged |
| Line inflates the brief size | L | Bounded single line; covered by the plugin's existing bounded-brief sizing |

<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without a render, the decision reaches the brief object but not the agent; the effectiveness gap stays open |
| 2 | **Beyond Local Maxima?** | PASS | The structured-field and render-nothing options are weighed and scored |
| 3 | **Sufficient?** | PASS | A legible line surfaces the outcome the phase set out to deliver |
| 4 | **Fits Goal?** | PASS | Makes the compiled decision visible at an agent boundary, which is the phase's purpose |
| 5 | **Open Horizons?** | PASS | A structured field can be added additively later without redoing this work |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- The hook render (`.opencode/plugins/mk-skill-advisor.js`) appends the outcome line when a compiled decision is served.

**How to roll back**: Remove the render line; the injected brief returns to its legacy-identical form.

<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!--
Level 3 Decision Record: One ADR per major decision.
Written in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
